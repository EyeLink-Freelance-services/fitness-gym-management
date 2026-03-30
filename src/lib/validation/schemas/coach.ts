import { z } from "zod";
import { optionalIntFromInput } from "../helpers/check-number";
import { isValidPhoneNumber } from "libphonenumber-js/min";

export const CoachStatusSchema = z.enum(["active", "inactive"]);

export const CreateCompanyCoachSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(255, "First name is too long"),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(255, "Last name is too long"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  phone: z.string().refine(
    (value) => isValidPhoneNumber(value),
    { message: "Invalid international phone number" }
  ),

  specialization: z
    .string()
    .trim()
    .min(1, "Specialization is required")
    .max(255, "Specialization is too long"),

  certifications: z
    .string()
    .trim()
    .max(1000, "Certifications is too long")
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      return value === "" ? undefined : value;
    }),

  year_exp: optionalIntFromInput.refine(
    (val) => val === undefined || val <= 70,
    "Year experience is too high"
  ).optional(),

  bio: z
    .string()
    .trim()
    .max(3000, "Bio is too long")
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      return value === "" ? undefined : value;
    }),

  availability: z
    .string()
    .trim()
    .min(1, "Availability is required")
    .max(2000, "Availability is too long"),

  status: CoachStatusSchema.default("active"),
});

export type CreateCompanyCoachInput = z.input<typeof CreateCompanyCoachSchema>;
export type CreateCompanyCoachValues = z.infer<typeof CreateCompanyCoachSchema>;