export type ActivePlanDialog =
  | { type: "diet"; mode: "create" | "edit"; planId?: string }
  | { type: "training"; mode: "create" | "edit"; planId?: string }
  | null;

export type CoachPlanClient = {
  id: string;
  name: string;
};
