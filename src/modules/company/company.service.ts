import {
  backendGet,
  backendPost,
  backendPut,
} from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import type {
  ClientResponseApiBean,
  CompanyClientRow,
  CompanyPricing,
  SearchClientsApiBean,
} from "@/types/dashboard/company";
import type { CompanyResponseApiBean } from "@/types/dashboard/super-admin";
import { GetPageParams } from "@/types/dashboard/shared";
import type { StatusTone } from "@/types/shared";
import type { ClientFormData } from "@/types/forms";

function formatMembershipPlan(plan?: string | null): string | undefined {
  if (!plan) return undefined;
  if (plan === "NORMAL") return "Standard";
  if (plan === "PERSONAL") return "Personal Coaching";
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
    email: client.contact?.email ?? "",
    contact: client.contact?.phoneNumber ?? undefined,
    plan: formatMembershipPlan(client.activePlan?.membershipPlan),
    standardPrice: client.activePlan?.standardPrice ?? undefined,
    hasPersonalCoachingPrice: client.activePlan?.hasPersonalCoachingPrice ?? undefined,
    personalCoachPrice: client.activePlan?.personalCoachingPrice ?? undefined,
    joinedAt: client.auditData?.createdDate ?? undefined,
    expiresAt: client.activePlan?.endDate ?? undefined,
    coach: null,
    membershipStatus,
    membershipStatusTone,
  };
}

const COMPANY_API_BASE = "/api/companies";

async function requireCompanyId(): Promise<string> {
  const auth = await getAuthContext();
  const companyId = auth?.companyId;

  if (!companyId) {
    throw new Error(
      "No active company in session (missing businessId/companyId).",
    );
  }

  return companyId;
}

export async function getCompanyPricingForCompany(): Promise<CompanyPricing> {
  const companyId = await requireCompanyId();

  const company = await backendGet<CompanyResponseApiBean>(
    `${COMPANY_API_BASE}/${companyId}`,
  );

  return {
    standardPrice: company.price?.standardPrice ?? undefined,
    hasPersonalCoachingPrice: company.price?.hasPersonalCoachingPrice ?? undefined,
    personalCoachingPrice: company.price?.personalCoachingPrice ?? undefined,
  };
}

export async function getCompanyClients({
  pageNumber = 0,
  pageSize = 10,
}: GetPageParams = {}) {
  const companyId = await requireCompanyId();

  const data = await backendGet<SearchClientsApiBean>(
    `${COMPANY_API_BASE}/${companyId}/clients?pageNumber=${pageNumber}&pageSize=${pageSize}&descendingSort=true`,
  );

  return {
    clients: (data.clients ?? []).map(mapClientApiToRow),
    totalCount: data.totalElements ?? 0,
  };
}

export async function getCompanyAllClients() {
  const { clients } = await getCompanyClients({ pageSize: 10 });
  return clients;
}

export async function getCompanyLastFiveClients() {
  const { clients } = await getCompanyClients({ pageSize: 5 });
  return clients;
}

// ___ Client Create / Update for company client ___
function resolveMembershipPlan(plan: string) {
  return plan === "personalCoach" ? "PERSONAL" : "STANDARD";
}

function mapClientFormToClientRequest(
  form: ClientFormData,
  companyPlan?: CompanyPricing | null,
) {
  const trimmedEmail = (form.email ?? "").trim();

  if (!trimmedEmail) {
    throw new Error("Client email is required and cannot be empty");
  }

  return {
    information: {
      firstName: form.firstName,
      lastName: form.lastName,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
    },
    contact: {
      email: trimmedEmail,
      phoneNumber: form.phoneNumber,
      emergencyContactName: form.emergencyContactName || undefined,
      emergencyContactPhone: form.emergencyContactPhone || undefined,
    },
    plan: {
      membershipPlan: resolveMembershipPlan(form.membershipPlan),
      standardPrice: companyPlan?.standardPrice ?? undefined,
      personalCoachingPrice: companyPlan?.personalCoachingPrice ?? undefined,
    },
    medicalConditions: form.medicalConditions || undefined,
    agreeTermsOfService: form.agreeTermsOfService,
  };
}

export async function createClientService(
  form: ClientFormData,
  companyPlan?: CompanyPricing | null,
) {
  const companyId = await requireCompanyId();

  return await backendPost(
    `${COMPANY_API_BASE}/${companyId}/clients`,
    mapClientFormToClientRequest(form, companyPlan),
  );
}

export async function updateClientService(
  clientId: string,
  form: ClientFormData,
  companyPlan?: CompanyPricing | null,
) {
  const companyId = await requireCompanyId();

  return await backendPut(
    `${COMPANY_API_BASE}/${companyId}/clients/${clientId}`,
    mapClientFormToClientRequest(form, companyPlan),
  );
}