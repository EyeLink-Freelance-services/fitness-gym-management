"use client";

import { useState } from "react";
import type { CompanyClient, CompanyPricing } from "@/types/dashboard/company";
import { getCompanyClientFullName } from "@/modules/company/company-client.mappers";
import type { ActivePlanDialog } from "@/modules/client-records/coach-plan.types";
import type {
  ClientDietPlanRow,
  ClientTrainingPlanRow,
} from "@/types/dashboard/client";
import { ClientProfileBreadcrumb } from "./client-profile-breadcrumb";
import { ClientProfileHeader } from "./client-profile-header";
import { CoachSection } from "./coach-section";
import { EmergencyContactSection } from "./emergency-contact-section";
import { MedicalSection } from "./medical-section";
import { MembershipSection } from "./membership-section";
import { PersonalInfoSection } from "./personal-info-section";
import { useClientProfileEdit } from "./use-client-profile-edit";
import { CompanyClientCoachingSection } from "./company-client-coaching-section";

export type ClientProfilePageProps = {
  client: CompanyClient;
  companyPricing: CompanyPricing | null;
  initialDiets?: ClientDietPlanRow[];
  initialTrainingPlans?: ClientTrainingPlanRow[];
  readOnly?: boolean;
  showDataEntry?: boolean;
  showBreadcrumb?: boolean;
};

export function ClientProfilePage({
  client,
  companyPricing,
  initialDiets = [],
  initialTrainingPlans = [],
  readOnly = false,
  showDataEntry = false,
  showBreadcrumb = false,
}: ClientProfilePageProps) {
  const edit = useClientProfileEdit(client, companyPricing);
  const [activePlanDialog, setActivePlanDialog] = useState<ActivePlanDialog>(null);
  const isPersonalCoaching = client.membershipPlan === "PERSONAL";
  const clientName = getCompanyClientFullName(client);

  const sectionProps = {
    client,
    draft: edit.draft,
    isEditing: readOnly ? false : edit.isEditing,
    onPatch: edit.patch,
  };

  return (
    <div className="pb-12">
      {(showBreadcrumb || !readOnly) && (
        <ClientProfileBreadcrumb clientName={clientName} />
      )}

      <ClientProfileHeader
        client={client}
        isEditing={readOnly ? false : edit.isEditing}
        isPending={edit.isPending}
        onEdit={edit.startEdit}
        onSave={edit.save}
        onCancel={edit.cancelEdit}
        showDataEntry={showDataEntry}
        readOnly={readOnly}
      />

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

      {isPersonalCoaching && (
        <div className="mt-8">
          <CompanyClientCoachingSection
            clientId={client.id}
            clientName={clientName}
            initialDiets={initialDiets}
            initialTrainingPlans={initialTrainingPlans}
            activeDialog={activePlanDialog}
            onActiveDialogChange={setActivePlanDialog}
            readOnly={readOnly}
          />
        </div>
      )}
    </div>
  );
}
