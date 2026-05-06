"use server";

import { createCompanyService } from "@/modules/super-admin/super-admin.service";
import { CompanyFormData } from "@/types/forms";

export async function createCompanyAction(data: CompanyFormData) {
  return await createCompanyService(data);
}
