import { z } from "zod";

export const MembershipPlanFormSchema = z.object({
  company_id: z.string().uuid(),
  name: z.string().trim().min(1, "Name is required").max(150),
  price: z.number().min(0, "Price must be >= 0"),
  entree_fee: z.number().min(0, "Entry fee must be >= 0"),
  duration_days: z.number().int().min(1, "Duration must be at least 1 day"),
  is_monthly: z.boolean(),
  description: z.string().trim().max(2000).nullable().optional(),
  is_active: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.is_monthly && data.duration_days % 30 !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["duration_days"],
      message: "Monthly plans must use multiples of 30 days.",
    });
  }
});

export const MembershipPlanEditSchema = MembershipPlanFormSchema.extend({
  id: z.string().uuid(),
	created_by: z.string().uuid(),
	updated_by: z.string().uuid().nullable().optional(),
});

export type MembershipPlanFormValues = z.infer<typeof MembershipPlanFormSchema>;
export type MembershipPlanCreateInput = z.infer<typeof MembershipPlanFormSchema>;
export type MembershipPlanEditInput = z.infer<typeof MembershipPlanEditSchema>;

export type MembershipPlanRow = {
  id: string;
  company_id: string;
  name: string;
  price: number;
  entree_fee: number;
  duration_days: number;
  is_monthly: boolean;
  description: string | null;
  is_active: boolean;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};