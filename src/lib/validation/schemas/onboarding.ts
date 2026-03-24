import { isValidPhoneNumber } from "libphonenumber-js/min";
import { z } from "zod";

export const InviteCreateSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  invitation_type: z.enum(["personal", "company"]),
  company_name: z.string().trim().max(255).optional().or(z.literal("")),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  expires_in_days: z.coerce.number().int().min(1).max(30).default(7),
  terms_version: z.string().trim().min(1).default("v1"),
  privacy_version: z.string().trim().min(1).default("v1"),
});

export type InviteCreateInput = z.input<typeof InviteCreateSchema>;
export type InviteCreateValues = z.infer<typeof InviteCreateSchema>;

export const AcceptTermsSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
  accepted_terms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms",
  }),
  accepted_privacy: z.boolean().refine((value) => value === true, {
    message: "You must accept the privacy policy",
  }),
});

export type AcceptTermsInput = z.input<typeof AcceptTermsSchema>;
export type AcceptTermsValues = z.infer<typeof AcceptTermsSchema>;

export const OnboardingProfileSchema = z.object({
  token: z.string().trim().min(1),
  first_name: z.string().trim().min(1, "First name is required").max(255),
  last_name: z.string().trim().min(1, "Last name is required").max(255),
  picture_url: z.any().optional(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  company_name: z.string().trim().min(1, "Company name is required").max(255),
  company_logo_url: z.string().trim().url("Invalid logo URL").optional().or(z.literal("")),
  company_brn: z
    .string()
    .trim()
    .min(1, "BRN is required")
    .regex(/^\d{7,10}$/, "BRN must be between 7 and 10 digits"),
  company_address: z.string().trim().min(1, "Address is required"),
  company_city: z.string().trim().min(1, "City is required"),
  company_post_code: z.string().trim().optional(),
  company_region: z.string().trim().min(1, "District / Region is required"),
  company_contact_email: z.string().trim().email("Invalid email"),
  company_contact_phone: z.string().refine(
    (value) => isValidPhoneNumber(value),
    { message: "Invalid international phone number" }
  ),
  company_terms: z.string().trim().optional(),
  company_disclaimer: z.string().trim().optional(),
});

export type OnboardingProfileInput = z.input<typeof OnboardingProfileSchema>;
export type OnboardingProfileValues = z.infer<typeof OnboardingProfileSchema>;