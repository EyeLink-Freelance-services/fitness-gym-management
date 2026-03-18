import { supabaseServer } from "@/lib/supabase/server";
import { TrainingPlanFormInput } from "@/lib/validation/schemas/training-plans";

const TABLE = "training_plans";

function mapTrainingPlanToForm(data: any): TrainingPlanFormInput {
  return {
    id: data.id,
    company_id: data.company_id,
    created_by: data.created_by,
    updated_by: data.updated_by,
    title: data.title,
    description: data.description ?? "",
    level: data.level,
    status: data.status,
    created_at: data.created_at,
    updated_at: data.updated_at,
    sessions: (data.sessions ?? [])
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((session: any) => ({
        id: session.id,
        plan_id: session.plan_id,
        day_index: session.day_index,
        title: session.title,
        notes: session.notes ?? "",
        order_index: session.order_index,
        exercises: (session.exercises ?? [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((exercise: any) => ({
            id: exercise.id,
            session_id: exercise.session_id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            rest_seconds: exercise.rest_seconds,
            tempo: exercise.tempo ?? "",
            order_index: exercise.order_index,
          })),
      })),
  };
}

export const createTrainingPlan = async (payload: TrainingPlanFormInput) => {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("create_training_plan_with_sessions", {p_payload: payload});

  if (error) throw error;

  return data;
}

export const updateTrainingPlan = async (payload: TrainingPlanFormInput) => {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc(
    "update_training_plan_with_sessions",
    { p_payload: payload }
  );

  if (error) throw error;
  return data;
};

export const saveTrainingPlan = async (payload: TrainingPlanFormInput) => {
  if (payload.id) {
    return updateTrainingPlan(payload);
  }

  return createTrainingPlan(payload);
};

export async function listTrainingPlan() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getTrainingPlan(id: string) {
  const supabase = await supabaseServer();
  
  const { data, error } = await supabase
    .from("training_plans")
    .select(`
      id,
      company_id,
      created_by,
      updated_by,
      title,
      description,
      level,
      status,
      created_at,
      updated_at,
      sessions:training_plan_sessions (
        id,
        plan_id,
        day_index,
        title,
        notes,
        order_index,
        exercises:training_session_exercises (
          id,
          session_id,
          name,
          sets,
          reps,
          weight,
          rest_seconds,
          tempo,
          order_index
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapTrainingPlanToForm(data);
}