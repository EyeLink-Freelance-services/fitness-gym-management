import { z } from "zod";

export const MemberMembershipStatusSchema = z.enum([
  "active",
  "expired",
  "cancelled",
]);

export const MemberMembershipBaseSchema = z.object({
  company_id: z.string().uuid("Invalid company id"),
  member_id: z.string().uuid("Invalid member id"),
  plan_id: z.string().uuid("Invalid plan id"),

  start_date: z.string().date("Start date must be a valid date"),
  end_date: z.string().date("End date must be a valid date"),

  status: MemberMembershipStatusSchema.default("active"),
});

export const MemberMembershipCreateSchema = MemberMembershipBaseSchema.extend({
  created_by: z.string().uuid("Invalid user id"),
}).superRefine((data, ctx) => {
  if (data.end_date < data.start_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["end_date"],
      message: "End date must be after or equal to start date",
    });
  }
});

export const MemberMembershipUpdateSchema = MemberMembershipBaseSchema.partial()
  .extend({
    id: z.string().uuid("Invalid membership id"),
  })
  .superRefine((data, ctx) => {
    if (data.start_date && data.end_date && data.end_date < data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_date"],
        message: "End date must be after or equal to start date",
      });
    }
  });

export type MemberMembershipBaseInput = z.infer<typeof MemberMembershipBaseSchema>;
export type MemberMembershipCreateInput = z.infer<typeof MemberMembershipCreateSchema>;
export type MemberMembershipUpdateInput = z.infer<typeof MemberMembershipUpdateSchema>;