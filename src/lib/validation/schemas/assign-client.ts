import { z } from "zod";

export const AssignClientStatusSchema = z.enum([
  "assigned",
  "pending",
  "unassigned",
]);

export const AssignClientCreateSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  coachId: z.string().min(1, "Coach is required"),
  status: AssignClientStatusSchema,
});

export type AssignClientCreateInput = z.infer<typeof AssignClientCreateSchema>;
