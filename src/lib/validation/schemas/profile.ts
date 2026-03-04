import { isValidPhoneNumber } from "libphonenumber-js/min";
import { z } from "zod";

export const ProfileCreateSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z.string().refine(
    (value) => isValidPhoneNumber(value),
    { message: "Invalid international phone number" }
  ),
  picture: z
    .any()
    .optional(),
});

export const ProfileUpdateSchema = ProfileCreateSchema.partial();

export type ProfileCreateFormValues = z.infer<typeof ProfileCreateSchema>;
export type ProfileUpdateFormValues = z.infer<typeof ProfileUpdateSchema>;