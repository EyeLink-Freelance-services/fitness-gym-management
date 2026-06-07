import type {
  ClientResponseApiBean,
  CompanyClient,
  CompanyClientFormValues,
  MembershipPlanFormValue,
  MembershipPlanKind,
  CompanyPricing,
} from "@/types/dashboard/company";

export function getCompanyClientFullName(
  client: Pick<CompanyClient, "firstName" | "lastName">,
): string {
  return `${client.firstName} ${client.lastName}`.trim() || "Client";
}

export function getMembershipPlanLabel(kind: MembershipPlanKind): string {
  if (kind === "PERSONAL") return "Personal Coaching";
  return "Standard";
}

export function getClientCoachDisplayName(
  client: Pick<CompanyClient, "coachId" | "coachName">,
): string {
  const name = client.coachName?.trim();
  if (name) return name;
  if (client.coachId) return "Unassigned";
  return "-";
}

export function getClientDisplayFee(
  client: CompanyClient,
  companyPricing?: CompanyPricing,
): number | undefined {
  if (client.membershipPlan === "PERSONAL") {
    return client.additionalFees;
  }
  return client.standardPrice ?? companyPricing?.standardPrice;
}

function toDateInputValue(value?: string): string {
  if (!value) return "";
  return value.split("T")[0] ?? value;
}

export function normalizeMembershipPlanKind(
  raw?: string | null,
): MembershipPlanKind {
  const upper = raw?.toUpperCase();
  if (upper === "PERSONAL") return "PERSONAL";
  return "NORMAL";
}

export function membershipPlanKindToFormValue(
  kind: MembershipPlanKind,
): MembershipPlanFormValue {
  return kind === "PERSONAL" ? "personalCoach" : "standard";
}

export function membershipPlanFormValueToKind(
  value: string,
): MembershipPlanKind {
  return value === "personalCoach" ? "PERSONAL" : "NORMAL";
}

export function mapClientResponseToCompanyClient(
  api: ClientResponseApiBean,
): CompanyClient {
  const membershipPlan = normalizeMembershipPlanKind(api.plan?.membershipPlan);

  return {
    id: api.id,
    firstName: api.information?.firstName ?? "",
    lastName: api.information?.lastName ?? "",
    dateOfBirth: toDateInputValue(api.information?.dateOfBirth),
    gender: api.information?.gender ?? "",
    email: api.contact?.email ?? "",
    phoneNumber: api.contact?.phoneNumber ?? "",
    emergencyContactName: api.contact?.emergencyContactName ?? "",
    emergencyContactPhone: api.contact?.emergencyContactPhone ?? "",
    medicalConditions: api.medicalConditions,
    agreeTermsOfService: api.agreeTermsOfService ?? true,
    membershipPlan,
    additionalFees: api.plan?.additionalFees,
    standardPrice: api.plan?.standardPrice,
    coachId: api.coachId ?? api.plan?.coachId ?? null,
    coachName: api.coachName ?? null,
    planStatus: api.plan?.status,
    joinedAt: api.plan?.startDate ?? api.auditData?.createdDate,
    expiresAt: api.plan?.endDate,
  };
}

export function mapCompanyClientToFormValues(
  client: CompanyClient,
): CompanyClientFormValues {
  return {
    firstName: client.firstName,
    lastName: client.lastName,
    dateOfBirth: client.dateOfBirth,
    gender: client.gender,
    email: client.email,
    phoneNumber: client.phoneNumber,
    emergencyContactName: client.emergencyContactName,
    emergencyContactPhone: client.emergencyContactPhone,
    medicalConditions: client.medicalConditions ?? "",
    membershipPlan: membershipPlanKindToFormValue(client.membershipPlan),
    additionalFees: client.additionalFees,
    assignedCoach: client.coachId ?? "",
    startDate: client.joinedAt ?? "",
    agreeTermsOfService: client.agreeTermsOfService ?? true,
  };
}

export function mapClientFormValuesToApiRequest(form: CompanyClientFormValues) {
  const trimmedEmail = (form.email ?? "").trim();

  if (!trimmedEmail) {
    throw new Error("Client email is required and cannot be empty");
  }

  const membershipPlan = membershipPlanFormValueToKind(form.membershipPlan);

  const plan: {
    membershipPlan: MembershipPlanKind;
    additionalFees?: number;
  } = { membershipPlan };

  if (membershipPlan === "PERSONAL") {
    const raw = form.additionalFees;
    const n = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isNaN(n)) {
      plan.additionalFees = n;
    }
  }

  const assignedCoach = form.assignedCoach?.trim();
  const coachId =
    membershipPlan === "PERSONAL" && assignedCoach ? assignedCoach : null;

  return {
    coachId,
    information: {
      firstName: form.firstName,
      lastName: form.lastName,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
    },
    contact: {
      email: trimmedEmail,
      phoneNumber: form.phoneNumber,
      emergencyContactName: form.emergencyContactName,
      emergencyContactPhone: form.emergencyContactPhone,
    },
    plan,
    medicalConditions: form.medicalConditions || "N/A",
    agreeTermsOfService: form.agreeTermsOfService,
  };
}
