import { backendGet } from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import type {
  ClientResponseApiBean,
  CompanyClientRow,
  SearchClientsApiBean,
} from "@/types/dashboard/company";
import { GetPageParams } from "@/types/dashboard/shared";
import type { StatusTone } from "@/types/shared";

function formatMembershipPlan(plan?: string | null): string | undefined {
  if (!plan) return undefined;
  if (plan === "NORMAL") return "Standard";
  if (plan === "PERSONAL") return "Premium";
  return plan;
}

function mapPlanStatusToTone(status?: string | null): StatusTone | undefined {
  if (!status) return undefined;
  if (status === "ACTIVE") return "success";
  if (status === "EXPIRED") return "danger";
  if (status === "INACTIVE") return "neutral";
  return "neutral";
}

function mapClientApiToRow(client: ClientResponseApiBean): CompanyClientRow {
  const firstName = client.information?.firstName ?? "";
  const lastName = client.information?.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || "Client";

  const membershipStatus = client.activePlan?.status ?? undefined;
  const membershipStatusTone = mapPlanStatusToTone(membershipStatus);

  return {
    id: client.id,
    name: fullName,
    contact: client.contact?.phoneNumber ?? undefined,
    plan: formatMembershipPlan(client.activePlan?.membershipPlan),
    price: client.activePlan?.additionalFees ?? undefined,
    joinedAt: client.auditData?.createdDate ?? undefined,
    expiresAt: client.activePlan?.endDate ?? undefined,
    coach: null,
    membershipStatus,
    membershipStatusTone,
  };
}

const COMPANY_API_BASE = "/api/companies";

export async function getCompanyClientsForCompany({
  pageNumber = 0,
  pageSize = 50,
}: GetPageParams = {}) {
  const auth = await getAuthContext();
  const companyId = auth?.companyId;

  if (!companyId) {
    throw new Error(
      "No active company in session (missing businessId/companyId).",
    );
  }

  const data = await backendGet<SearchClientsApiBean>(
    `${COMPANY_API_BASE}/${companyId}/clients?pageNumber=${pageNumber}&pageSize=${pageSize}&descendingSort=true`,
  );

  return {
    clients: (data.clients ?? []).map(mapClientApiToRow),
    totalCount: data.totalElements ?? 0,
  };
}

export async function getCompanyAllClients() {
  const { clients } = await getCompanyClientsForCompany({ pageSize: 10 });
  return clients;
}

export async function getCompanyLastFiveClients() {
  const { clients } = await getCompanyClientsForCompany({ pageSize: 5 });
  return clients;
}
