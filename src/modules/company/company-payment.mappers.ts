import {
  getCompanyClientFullName,
  getMembershipAmount,
  getMembershipPlanLabel,
} from "@/modules/company/company-client.mappers";
import type {
  ClientPaymentResponseApiBean,
  CompanyPaymentRow,
} from "@/types/dashboard/company-payment";
import type { CompanyClient, CompanyPricing } from "@/types/dashboard/company";

function normalizePlan(raw?: string): "NORMAL" | "PERSONAL" {
  return raw?.toUpperCase() === "PERSONAL" ? "PERSONAL" : "NORMAL";
}

function formatBillingMonthLabel(value: string): string {
  const [year, month] = value.split("-");
  if (!year || !month) return value;

  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getCurrentBillingMonth(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export { formatBillingMonthLabel };

export function mapClientAndPaymentToRow(
  client: CompanyClient,
  payment: ClientPaymentResponseApiBean | null,
  billingMonth: string,
  companyPricing?: CompanyPricing,
): CompanyPaymentRow {
  const membershipPlan = normalizePlan(
    payment?.membershipPlan ?? client.membershipPlan,
  );
  const standardPrice =
    payment?.standardPrice ??
    client.standardPrice ??
    companyPricing?.standardPrice;
  const additionalFees =
    payment?.additionalFees ?? client.additionalFees ?? undefined;
  const paidDate = payment?.auditData?.createdDate;
  const amount = getMembershipAmount(
    membershipPlan,
    standardPrice,
    additionalFees,
    companyPricing,
  );

  return {
    id: `${client.id}-${billingMonth}`,
    clientId: client.id,
    clientName: getCompanyClientFullName(client),
    membershipPlan,
    billingMonth,
    amount,
    standardPrice,
    additionalFees,
    paidDate,
    isPaid: Boolean(paidDate),
  };
}

export function mapPaymentResponseToRow(
  payment: ClientPaymentResponseApiBean,
): CompanyPaymentRow {
  const membershipPlan = normalizePlan(payment.membershipPlan);
  const clientName =
    `${payment.firstName ?? ""} ${payment.lastName ?? ""}`.trim() || "Client";
  const billingMonth = payment.billingMonth ?? "";
  const paidDate = payment.auditData?.createdDate;

  const standardPrice = payment.standardPrice;
  const additionalFees = payment.additionalFees;

  return {
    id: payment.id ?? `${payment.clientId}-${billingMonth}`,
    clientId: payment.clientId ?? "",
    clientName,
    membershipPlan,
    billingMonth,
    amount: getMembershipAmount(
      membershipPlan,
      standardPrice,
      additionalFees,
    ),
    standardPrice,
    additionalFees,
    paidDate,
    isPaid: Boolean(paidDate),
  };
}

export function getPaymentPlanLabel(plan: "NORMAL" | "PERSONAL"): string {
  return getMembershipPlanLabel(plan);
}
