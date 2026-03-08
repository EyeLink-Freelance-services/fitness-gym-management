import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
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

  start_date: z.union([z.string().date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
  end_date: z.union([z.string().date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),

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

export const MemberMembershipTransactionSchema = z.object({
  plan_id: z.string().uuid("Invalid plan id"),

  start_date: z.iso.date("Start date must be a valid date"),
  end_date: z.iso.date("End date must be a valid date"),

  status: MemberMembershipStatusSchema.default("active"),
});

export type MemberMembershipBaseInput = z.infer<typeof MemberMembershipBaseSchema>;
export type MemberMembershipCreateInput = z.infer<typeof MemberMembershipTransactionSchema>;
export type MemberMembershipUpdateInput = z.infer<typeof MemberMembershipUpdateSchema>;

export type MemberMembershipPlan = {
	id: string,
	company_id: string,
	member_id: string,
	plan_id: string,
	start_date: Date,
	end_date: Date,
	status: string,
	created_by: string,
	created_at: Timestamp
}