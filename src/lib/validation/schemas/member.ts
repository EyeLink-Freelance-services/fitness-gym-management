import { isValidPhoneNumber } from "libphonenumber-js/min";
import { z } from "zod";

export const MemberStatus = z.enum(["active", "inactive"]);

export const MemberBaseSchema = z.object({
  company_id: z.string().uuid(),
  assigned_coach_id: z.string().nullable()
  .optional(),

  member_code: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, _ or -")
    .optional()
    .nullable(),

  first_name: z.string().trim().min(1, "First name is required").max(100),
  last_name: z.string().trim().min(1, "Last name is required").max(100),

  dob: z
    .union([z.string().date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),

  gender: z.string().trim().max(50).optional().nullable(),

  phone: z.string().refine(
    (value) => isValidPhoneNumber(value),
    { message: "Invalid international phone number" }
  ),

  email: z.string().trim().email().optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),

  emergency_contact_name: z.string().trim().max(150).optional().nullable(),
  emergency_contact_phone: z.string().refine(
    (value) => isValidPhoneNumber(value),
    { message: "Invalid international phone number" }
  ),

  medical_notes: z.string().trim().max(2000).optional().nullable(),

  status: MemberStatus,
});

export const MemberCreateSchema = MemberBaseSchema;

export const MemberUpdateSchema = MemberBaseSchema.partial().extend({
  id: z.string().uuid(),
});

export type MemberCreateInput = z.infer<typeof MemberCreateSchema>;
export type MemberUpdateInput = z.infer<typeof MemberUpdateSchema>;

// import { z } from "zod";

// export const MemberCreateSchema = z.object({
//   first_name: z.string().min(1),
//   last_name: z.string().min(1),
//   email: z.string().email().optional().or(z.literal("")).transform(v => v || undefined),
//   phone: z.string().optional().or(z.literal("")).transform(v => v || undefined),
//   status: z.enum(["active", "inactive"]).default("active"),
// });

// export const MemberUpdateSchema = MemberCreateSchema.partial();

// export type MemberCreateInput = z.infer<typeof MemberCreateSchema>;
// export type MemberUpdateInput = z.infer<typeof MemberUpdateSchema>;
