import type { CompanyClient, CompanyClientFormValues } from "@/types/dashboard/company";

export type ClientProfileSectionProps = {
  client: CompanyClient;
  draft: CompanyClientFormValues;
  isEditing: boolean;
  onPatch: (partial: Partial<CompanyClientFormValues>) => void;
};
