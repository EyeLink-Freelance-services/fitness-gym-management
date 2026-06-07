import type { AuditableApiBean } from "./shared";

export interface ClientDietPlanMealApiBean {
  id?: string;
  timeSlot?: string;
  specificTime?: string;
  meal?: string;
}

export interface ClientDietPlanRequestApiBean {
  meals?: ClientDietPlanMealApiBean[];
}

export interface ClientDietPlanResponseApiBean {
  id?: string;
  clientId?: string;
  clientName?: string;
  updatedAt?: string;
  meals?: ClientDietPlanMealApiBean[];
  auditData?: AuditableApiBean;
}

export interface SearchClientDietPlansApiBean {
  dietPlans?: ClientDietPlanResponseApiBean[];
}

export interface ClientTrainingPlanDayApiBean {
  day?: string;
  exercise?: string;
}

export interface ClientTrainingPlanRequestApiBean {
  repeatEveryWeek?: boolean;
  repeatEveryMonth?: boolean;
  days?: ClientTrainingPlanDayApiBean[];
}

export interface ClientTrainingPlanResponseApiBean {
  id?: string;
  clientId?: string;
  clientName?: string;
  updatedAt?: string;
  repeatEveryWeek?: boolean;
  repeatEveryMonth?: boolean;
  days?: ClientTrainingPlanDayApiBean[];
  auditData?: AuditableApiBean;
}

export interface SearchClientTrainingPlansApiBean {
  trainingPlans?: ClientTrainingPlanResponseApiBean[];
}

export interface ClientRecordDraftRequestApiBean {
  sessionDate?: string;
  notes?: string;
  values?: Record<string, string>;
}

export interface ClientRecordDraftApiBean {
  sessionDate?: string;
  notes?: string;
  values?: Record<string, string>;
  auditData?: AuditableApiBean;
}
