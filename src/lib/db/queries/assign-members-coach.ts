import { supabaseServer } from "@/lib/supabase/server";
import { DietPlanAssignment, TrainingPlanAssignment } from "@/types/assignment-plan";

const TABLES = {
  diet: "diet_plan_assignments",
  training: "training_plan_assignments",
} as const;

type AssignmentType = "diet" | "training";

type AssignmentPayloadMap = {
  diet: DietPlanAssignment;
  training: TrainingPlanAssignment;
};

export async function createAssignment<T extends AssignmentType>(
  type: T,
  payload: AssignmentPayloadMap[T] | AssignmentPayloadMap[T][]
) {
  const supabase = await supabaseServer();

  const table = TABLES[type];

  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select("*");

  if (error) throw error;
  return data;
}