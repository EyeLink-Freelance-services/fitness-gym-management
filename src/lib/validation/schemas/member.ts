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

  email: z.string().trim().email("Invalid email address"),
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

export type MemberWithMembershipInput = {
  p_company_id: string;
  p_assigned_coach_id?: string | null;
  p_member_code?: string | null;
  p_first_name: string;
  p_last_name: string;
  p_dob: string;
  p_gender?: string | null;
  p_phone: string;
  p_email: string;
  p_address?: string | null;
  p_emergency_contact_name?: string | null;
  p_emergency_contact_phone: string;
  p_medical_notes?: string | null;
  p_member_status?: "active" | "inactive";
  p_created_by: string;
  p_plan_id?: string | null;
  p_start_date?: string | null;
  p_end_date: string;
  p_membership_status?: "active" | "expired" | "cancelled";
};
