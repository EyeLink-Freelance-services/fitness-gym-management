import { isValidPhoneNumber } from "libphonenumber-js/min";
import { z } from "zod";

export const CompanyBaseSchema  = z.object({
  name: z.string().trim().min(1, "Company name is required").max(255),
  mode: z.enum(["personal", "company"]),

  logo_url: z.string().trim().url("Invalid logo URL").optional().or(z.literal("")),
  brn: z
    .string()
    .trim()
    .min(1, "BRN is required")
    .regex(/^\d{7,10}$/, "BRN must be between 7 and 10 digits"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  post_code: z.string().trim().optional(),
  region: z.string().trim().min(1, "District / Region is required"),
  contact_email: z.string().trim().email("Invalid email"),
  contact_phone: z.string().refine(
    (value) => isValidPhoneNumber(value),
    { message: "Invalid international phone number" }
  ),
  terms: z.string().trim().optional(),
  disclaimer: z.string().trim().optional(),
});

export const CompanyCreateSchema = CompanyBaseSchema;

export const CompanyUpdateSchema = CompanyBaseSchema.extend({
  id: z.string().uuid(),
});

export type CompanyCreateInput = z.infer<typeof CompanyCreateSchema>;
export type CompanyUpdateInput = z.infer<typeof CompanyUpdateSchema>;