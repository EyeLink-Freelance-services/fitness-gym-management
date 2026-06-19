import z from "zod";
import { TrainingPlanExerciseFormSchema } from "./training_session_exercises";
import { optionalIntFromInput } from "../helpers/check-number";

export const TrainingPlanSessionFormSchema = z.object({
  id: z.string().uuid().optional(),
  plan_id: z.string().uuid().optional().nullable(),
  day_index: optionalIntFromInput.refine(
    (val) => val === undefined || val >= 0,
    "Day index must be greater than or equal to 0"
  ).optional(),
  title: z.string().trim().min(1, "Session Title is required").max(150, "Session title is too long"),
  notes: z.string().trim().max(2000, "Notes are too long").nullable().optional(),
  order_index: z.number().int().min(0).default(0),
  exercises: z
    .array(TrainingPlanExerciseFormSchema)
    .min(1, "At least one exercise is required"),
})

export type TrainingPlanSessionFormInput = z.input<typeof TrainingPlanSessionFormSchema>;
export type TrainingPlanSessionFormValues = z.output<typeof TrainingPlanSessionFormSchema>;