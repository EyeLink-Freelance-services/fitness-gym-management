import z from "zod";
import { optionalIntFromInput, optionalNumberFromInput } from "../helpers/check-number";

export const TrainingPlanExerciseFormSchema = z.object({
  id: z.string().uuid().optional(),
  session_id: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1, 'Exercise name is required').max(150, "Exercise name is too long"),
  sets: optionalIntFromInput.refine(
    (val) => val === undefined || val >= 0,
    "Sets must be greater than or equal to 0"
  ).optional(),
  reps: optionalIntFromInput.refine(
    (val) => val === undefined || val >= 0,
    "Reps must be greater than or equal to 0"
  ).optional(),
  weight: optionalNumberFromInput.refine(
    (val) => val === undefined || val >= 0,
    "Weight must be greater than or equal to 0"
  ).optional(),
  rest_seconds: optionalIntFromInput.refine(
    (val) => val === undefined || val >= 0,
    "Rest seconds must be greater than or equal to 0"
  ).optional(),
  tempo: z
    .string()
    .trim()
    .max(50, "Tempo is too long")
    .optional()
    .or(z.literal("")),
  order_index: z.number().int().min(0).default(0)
})

export type TrainingPlanExerciseFormInput = z.input<typeof TrainingPlanExerciseFormSchema>;
export type TrainingPlanExerciseFormValues = z.output<typeof TrainingPlanExerciseFormSchema>;