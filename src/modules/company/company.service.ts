import { supabaseServer } from "@/lib/supabase/server";
import { CompanyFormData } from "@/types/forms";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function createCompanyService(form: CompanyFormData) {
  const supabase = await supabaseServer();

  try {
    let logoUrl: string | null = null;
    if (form.companyLogo) {
      logoUrl = await uploadCompanyLogo(form.companyLogo);
    }

    const { data, error } = await supabase.rpc("create_company_with_branches", {
      p_name: form.companyName,
      p_brn: form.brn,
      p_contact_phone: form.contactNumber,
      p_address: form.addressLine1,
      p_city: form.city,
      p_post_code: form.postcode,
      p_region: form.state,
      p_disclaimer: form.disclaimer,
      p_standard_price: form.standardPrice,
      p_premium_price: form.hasPremiumPlan ? form.premiumPrice : null,
      p_logo_url: logoUrl,
      p_branches: form.branches,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadCompanyLogo(file: File) {
  const extension = file.name.split(".").pop();
  const filePath = `company-logos/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from("company-assets")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabaseAdmin.storage
    .from("company-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
