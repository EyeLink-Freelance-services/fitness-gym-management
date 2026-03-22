import z from "zod";
import { optionalIntFromInput } from "../helpers/check-number";

export const DietMealItemFormSchema = z.object({
  id: z.string().uuid().optional(),
  meal_id: z.string().uuid().optional().nullable(),
  food_name: z
    .string()
    .trim()
    .min(1, "Food name is required")
    .max(150, "Food name is too long"),
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required")
    .max(100, "Quantity is too long"),
  notes: z.string()
    .trim()
    .optional()
    .or(z.literal("")),
  order_index: optionalIntFromInput.default(0),
});

export type DietMealItemFormInput = z.input<typeof DietMealItemFormSchema>;
export type DietMealItemFormValues = z.output<typeof DietMealItemFormSchema>;