export type assignmentStatus = "active" | "completed" | "cancelled";

export type TrainingPlanAssignment = {
  id?: string;
  company_id: string;
  plan_id: string;
  member_id: string,
  assigned_by: string,
  start_date: string | null;
  status: assignmentStatus;
};

export type DietPlanAssignment = {
  id?: string;
  company_id: string;
  diet_plan_id: string;
  member_id: string,
  assigned_by: string,
  start_date: string | null;
  status: assignmentStatus;
};