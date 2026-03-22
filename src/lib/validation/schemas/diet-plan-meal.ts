import z from "zod";
import { optionalIntFromInput } from "../helpers/check-number";
import { DietMealItemFormSchema } from "./diet-meal-item";

export const MealTypeEnum = z.enum(["breakfast", "lunch", "dinner", "snack"]);

export const DietPlanMealFormSchema = z.object({
  id: z.string().uuid().optional(),
  diet_plan_id: z.string().uuid().optional().nullable(),
  day_index: optionalIntFromInput.refine(
    (val) => val === undefined || val >= 1,
    "Day must be at least 1"
  ).optional(),
  meal_type: MealTypeEnum,
  notes: z.string()
    .trim()
    .optional()
    .or(z.literal("")),
  order_index: optionalIntFromInput.default(0),
  items: z
    .array(DietMealItemFormSchema)
    .min(1, "At least one meal item is required"),
});

export type DietPlanMealFormInput = z.input<typeof DietPlanMealFormSchema>;
export type DietPlanMealFormValues = z.output<typeof DietPlanMealFormSchema>;