"use client";

import type { CompanyClient, CompanyPricing } from "@/types/dashboard/company";
import { getCompanyClientFullName } from "@/modules/company/company-client.mappers";
import { ClientProfileBreadcrumb } from "./client-profile-breadcrumb";
import { ClientProfileHeader } from "./client-profile-header";
import { ClientProfileSummary } from "./client-profile-summary";
import { CoachSection } from "./coach-section";
import { EmergencyContactSection } from "./emergency-contact-section";
import { MedicalSection } from "./medical-section";
import { MembershipSection } from "./membership-section";
import { PersonalInfoSection } from "./personal-info-section";
import { useClientProfileEdit } from "./use-client-profile-edit";

export type ClientProfilePageProps = {
  client: CompanyClient;
  companyPricing: CompanyPricing | null;
};

export function ClientProfilePage({
  client,
  companyPricing,
}: ClientProfilePageProps) {
  const edit = useClientProfileEdit(client, companyPricing);
  const sectionProps = {
    client,
    draft: edit.draft,
    isEditing: edit.isEditing,
    onPatch: edit.patch,
  };

  return (
    <div className="pb-12">
      <ClientProfileBreadcrumb
        clientName={getCompanyClientFullName(client)}
      />

      <ClientProfileHeader
        client={client}
        isEditing={edit.isEditing}
        isPending={edit.isPending}
        onEdit={edit.startEdit}
        onSave={edit.save}
        onCancel={edit.cancelEdit}
      />

      <ClientProfileSummary client={client} companyPricing={companyPricing} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PersonalInfoSection {...sectionProps} />
          <EmergencyContactSection {...sectionProps} />
          <MedicalSection {...sectionProps} />
        </div>

        <div className="space-y-6">
          <MembershipSection {...sectionProps} />
          <CoachSection {...sectionProps} />
        </div>
      </div>
    </div>
  );
}
