"use server";

import {
  createCompanyService,
  updateCompanyService,
} from "@/modules/super-admin/super-admin.service";
import { CompanyFormData } from "@/types/forms";

export async function createCompanyAction(data: CompanyFormData) {
  return await createCompanyService(data);
}

export async function updateCompanyAction(
  companyId: string,
  data: CompanyFormData,
) {
  return await updateCompanyService(companyId, data);
}
