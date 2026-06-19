export type TrainingPlanStatus = "draft" | "published" | "archived";

export type TrainingSessionExercise = {
  id: string;
  session_id: string;
  name: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  rest_seconds: number | null;
  tempo: string | null;
  order_index: number;
};

export type TrainingPlanSession = {
  id: string;
  plan_id: string;
  day_index: number | null;
  title: string;
  notes: string | null;
  order_index: number;
  created_at?: string;
  exercises: TrainingSessionExercise[];
};

export type TrainingPlan = {
  id: string;
  company_id: string;
  created_by: string;
  updated_by?: string;
  title: string;
  description: string | null;
  level: number,
  status: TrainingPlanStatus;
  created_at: string;
  updated_at: string;
  sessions: TrainingPlanSession[];
};