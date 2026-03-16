import z from "zod";
import { TrainingPlanSessionFormSchema } from "./training-plan-sessions";

export const TrainingPlanStatus = z.enum(["draft", "published", "archived"]);

export const TrainingPlanFormSchema = z.object({
  id: z.string().uuid().optional(),
  company_id: z.string().uuid(),
  title: z.string().trim().min(1, "Title is required").max(150, 'title too long'),
  description: z.string().trim().max(3000, 'Description is too long').nullable().optional(),
  level: z.int().min(1, "Level must be at least 1")
    .max(5, "Level must be at most 5"),
  status: TrainingPlanStatus,
  sessions: z
    .array(TrainingPlanSessionFormSchema)
    .min(1, "At least one session is required"),
  updated_by: z.string().uuid().nullable(),
  created_by: z.string().uuid().optional(),
});

export type TrainingPlanFormInput = z.input<typeof TrainingPlanFormSchema>;