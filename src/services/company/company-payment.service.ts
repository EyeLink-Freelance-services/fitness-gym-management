import {
  backendGet,
  backendPost,
} from "@/lib/api/backend-client";
import {
  mapClientAndPaymentToRow,
  mapPaymentResponseToRow,
} from "@/modules/company/company-payment.mappers";
import {
  getCompanyClients,
  getCompanyPricingForCompany,
} from "@/services/company/company.service";
import type {
  ClientPaymentResponseApiBean,
  CompanyPaymentRow,
  PaymentRequestApiBean,
  SearchClientPaymentsApiBean,
} from "@/types/dashboard/company-payment";
import type { GetPageParams } from "@/types/dashboard/shared";

const COMPANY_API_BASE = "/api/companies";

async function requireCompanyId(): Promise<string> {
  const { getAuthContext } = await import("@/lib/auth/get-auth-context");
  const auth = await getAuthContext();
  const companyId = auth?.companyId;

  if (!companyId) {
    throw new Error(
      "No active company in session (missing businessId/companyId).",
    );
  }

  return companyId;
}

export async function getClientPayments(
  clientId: string,
  {
    pageNumber = 0,
    pageSize = 10,
    billingMonth,
    descendingSort = true,
  }: GetPageParams & {
    billingMonth?: string;
    descendingSort?: boolean;
  } = {},
) {
  const companyId = await requireCompanyId();
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
    descendingSort: String(descendingSort),
  });

  if (billingMonth) {
    params.set("billingMonth", billingMonth);
  }

  const data = await backendGet<SearchClientPaymentsApiBean>(
    `${COMPANY_API_BASE}/${companyId}/clients/${clientId}/payments?${params.toString()}`,
  );

  const payments =
    data.payments ??
    (data as { clientPayments?: ClientPaymentResponseApiBean[] }).clientPayments ??
    [];

  return {
    payments,
    totalCount: data.totalElements ?? payments.length,
  };
}

async function findClientPaymentForMonth(
  clientId: string,
  billingMonth: string,
): Promise<ClientPaymentResponseApiBean | null> {
  try {
    const { payments } = await getClientPayments(clientId, {
      billingMonth,
      pageNumber: 0,
      pageSize: 1,
    });
    return payments[0] ?? null;
  } catch {
    return null;
  }
}

export async function getCompanyPayments({
  pageNumber = 0,
  pageSize = 10,
  billingMonth,
  search,
}: GetPageParams & { billingMonth: string; search?: string }) {
  const [clientsResult, companyPricing] = await Promise.all([
    getCompanyClients({ pageNumber, pageSize, search }),
    getCompanyPricingForCompany(),
  ]);

  const payments = await Promise.all(
    clientsResult.clients.map(async (client) => {
      const payment = await findClientPaymentForMonth(client.id, billingMonth);
      return mapClientAndPaymentToRow(
        client,
        payment,
        billingMonth,
        companyPricing,
      );
    }),
  );

  return {
    payments,
    totalCount: clientsResult.totalCount,
  };
}

export async function payClientPayment(
  clientId: string,
  body: PaymentRequestApiBean,
) {
  const companyId = await requireCompanyId();

  await backendPost(
    `${COMPANY_API_BASE}/${companyId}/clients/${clientId}/payments`,
    body,
  );
}

export async function getCompanyPaymentAfterPay(
  clientId: string,
  billingMonth: string,
): Promise<CompanyPaymentRow | null> {
  const payment = await findClientPaymentForMonth(clientId, billingMonth);
  if (!payment) return null;
  return mapPaymentResponseToRow(payment);
}
