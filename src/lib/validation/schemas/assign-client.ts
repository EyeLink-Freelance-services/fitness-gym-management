import { z } from "zod";

export const AssignClientStatusSchema = z.enum([
  "assigned",
  "pending",
  "unassigned",
]);

export const AssignClientCreateSchema = z
  .object({
    clientId: z.string().min(1, "Client is required"),
    coachId: z.string(),
    status: AssignClientStatusSchema,
  })
  .superRefine((values, ctx) => {
    if (values.status !== "unassigned" && !values.coachId.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["coachId"],
        message: "Coach is required",
      });
    }
  });

export type AssignClientCreateInput = z.infer<typeof AssignClientCreateSchema>;
