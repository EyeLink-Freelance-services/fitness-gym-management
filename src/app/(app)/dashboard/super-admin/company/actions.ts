"use server";

import { createCompanyService } from "@/modules/company/company.service";
import { CompanyFormData } from "@/types/forms";

export async function createCompanyAction(data: CompanyFormData) {
  return await createCompanyService(data);
}
