export type DietPlanStatus = "draft" | "published" | "archived";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type DietMealItems = {
  id: string;
  meal_id: string;
  food_name: string;
  notes: string | null;
  quantity: string;
  order_index: number;
};

export type DietPlanMeals = {
  id: string;
  diet_plan_id: string;
  day_index: number | null;
  MealType: MealType;
  notes: string | null;
  order_index: number;
  items: DietMealItems[];
};

export type DietPlan = {
  id: string;
  company_id: string;
  created_by: string;
  updated_by?: string;
  title: string;
  description: string | null;
  status: DietPlanStatus;
  created_at: string;
  updated_at: string;
  meals: DietPlanMeals[];
};