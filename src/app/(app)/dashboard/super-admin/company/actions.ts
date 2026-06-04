"use server";

import {
  createCompanyService,
  updateCompanyService,
  getCompanies,
} from "@/modules/super-admin/super-admin.service";
import { CompanyFormData } from "@/types/forms";
import { revalidatePath } from "next/cache";

export async function createCompanyAction(data: CompanyFormData) {
  const result = await createCompanyService(data);
  revalidatePath("/dashboard/super-admin/company");
  return result;
}

export async function updateCompanyAction(
  companyId: string,
  data: CompanyFormData,
) {
  const result = await updateCompanyService(companyId, data);
  revalidatePath("/dashboard/super-admin/company");
  return result;
}

export async function fetchCompaniesPage(
  pageNumber: number,
  pageSize: number,
) {
  const { companies, totalCount } = await getCompanies({
    pageNumber,
    pageSize,
  });

  return {
    companies,
    totalCount,
  };
}
