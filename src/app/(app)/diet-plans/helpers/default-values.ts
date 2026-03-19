import { DietMealItemFormInput } from "@/lib/validation/schemas/diet-meal-item";
import { DietPlanMealFormInput } from "@/lib/validation/schemas/diet-plan-meal";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";

export function createDefaultMealItem(
  overrides?: Partial<DietMealItemFormInput>
): DietMealItemFormInput {
  return {
    food_name: "",
    quantity: "",
    notes: "",
    order_index: 0,
    ...overrides,
  };
}

export function createDefaultMeal(
  overrides?: Partial<DietPlanMealFormInput>
): DietPlanMealFormInput {
  return {
    day_index: 1,
    meal_type: "breakfast",
    notes: "",
    order_index: 0,
    items: [createDefaultMealItem()],
    ...overrides,
  };
}

export function createDefaultDietPlan(
  companyId: string
): DietPlanFormInput {
  return {
    company_id: companyId,
    title: "",
    description: "",
    status: "draft",
    meals: [createDefaultMeal()],
  };
}