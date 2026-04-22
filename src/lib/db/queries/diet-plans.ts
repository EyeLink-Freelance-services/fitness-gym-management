import { getServerDbClient } from "@/lib/db/server-client";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";

const TABLE = "diet_plans";

function mapDietPlanToForm(data: any): DietPlanFormInput {
  return {
    id: data.id,
    company_id: data.company_id,
    created_by: data.created_by,
    updated_by: data.updated_by,
    title: data.title,
    description: data.description ?? "",
    status: data.status,
    created_at: data.created_at,
    updated_at: data.updated_at,
    meals: (data.meals ?? [])
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((meal: any) => ({
        id: meal.id,
        diet_plan_id: meal.diet_plan_id,
        day_index: meal.day_index,
        meal_type: meal.meal_type,
        notes: meal.notes ?? "",
        order_index: meal.order_index,
        items: (meal.items ?? [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((item: any) => ({
            id: item.id,
            meal_id: item.meal_id,
            food_name: item.food_name,
            quantity: item.quantity,
            notes: item.notes,
            order_index: item.order_index,
          })),
      })),
  };
}

export const createDietPlan = async (payload: DietPlanFormInput) => {
  const db = await getServerDbClient();

  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) return null;

  const { data, error } = await db.rpc("create_diet_plan_with_meals", {p_payload: payload});

  if (error) throw error;

  return data;
}

export const updateDietPlan = async (payload: DietPlanFormInput) => {
  const db = await getServerDbClient();

  const { data, error } = await db.rpc(
    "update_diet_plan_with_meals",
    { p_payload: payload }
  );

  if (error) throw error;
  return data;
};

export const saveDietPlan = async (payload: DietPlanFormInput) => {
  if (payload.id) {
    return updateDietPlan(payload);
  }

  return createDietPlan(payload);
};

export async function listDietPlan() {
  const db = await getServerDbClient();

  const { data, error } = await db
    .from("diet_plans")
    .select(`
      id,
      title,
      description,
      status,
      created_at,
      meals:diet_plan_meals(id)
    `);

  if (error) throw error;

  const rs = data?.map((plan) => ({
        id: plan.id,
        title: plan.title,
        description: plan.description,
        status: plan.status,
        created_at: plan.created_at,
        meals_count: plan.meals?.length ?? 0,
      })) ?? [];

  return rs;
}

export async function getDietPlan(id: string) {
  const db = await getServerDbClient();
  
  const { data, error } = await db
    .from(TABLE)
    .select(`
      id,
      company_id,
      created_by,
      updated_by,
      title,
      description,
      status,
      created_at,
      updated_at,
      meals:diet_plan_meals (
        id,
        diet_plan_id,
        day_index,
        meal_type,
        notes,
        order_index,
        items:diet_meal_items (
          id,
          meal_id,
          food_name,
          quantity,
          notes,
          order_index
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapDietPlanToForm(data);
}