'use server'

import { createCompany } from "@/lib/db/queries/company";
import { CompanyCreateInput, CompanyCreateSchema } from "@/lib/validation/schemas/company";
import { revalidatePath } from "next/cache";

export async function createCompanyAction(values: CompanyCreateInput) {
  const parsed = CompanyCreateSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten(),
      message: 'Invalid payload for company'
    };
  }

  try {
    const company = await createCompany(parsed.data);
    revalidatePath('/dashboard/super-admin/company')

    return {
      ok: true,
      data: company,
      message: "company has been created successfully"
    };
  } catch (error: any) {
    console.log(error, "errororo")
    return {
        ok: false,
        message: error.message ?? 'failed to create company'
    }
  }
}