import { z } from "zod";
import { DietPlanMealFormSchema } from "./diet-plan-meal";

export const DietPlanStatusEnum = z.enum(["draft", "published", "archived"]);

export const DietPlanFormSchema = z.object({
  id: z.string().uuid().optional(),
  company_id: z.string().uuid("Company is required"),
  created_by: z.string().uuid().optional(),
  updated_by: z.string().uuid().optional().nullable(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title is too long"),
  description: z.string()
  .trim()
  .optional()
  .or(z.literal("")),
  status: DietPlanStatusEnum,
  meals: z
    .array(DietPlanMealFormSchema)
    .min(1, "At least one meal is required")
    .superRefine((meals, ctx) => {
      meals.forEach((meal, index) => {
        if (meal.day_index === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Day is required",
            path: [index, "day_index"],
          });
        }
      });
    }),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type DietPlanFormInput = z.input<typeof DietPlanFormSchema>;
export type DietPlanFormValues = z.output<typeof DietPlanFormSchema>;