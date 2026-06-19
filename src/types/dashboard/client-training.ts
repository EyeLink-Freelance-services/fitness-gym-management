import type { AuditableApiBean } from "./shared";

export type ClientTrainingPlanSearchSortField =
  | "TRAINING_DAY"
  | "TRAINING_ACTIVITY"
  | "CREATION_DATE";

export type TrainingPlanDayField =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type TrainingDayApiField =
  | "trainingMonday"
  | "trainingTuesday"
  | "trainingWednesday"
  | "trainingThursday"
  | "trainingFriday"
  | "trainingSaturday"
  | "trainingSunday";

export interface ClientTrainingPlanResponseApiBean {
  id?: string;
  trainingPlanId?: string;
  clientId?: string;
  clientName?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  trainingMonday?: string;
  trainingTuesday?: string;
  trainingWednesday?: string;
  trainingThursday?: string;
  trainingFriday?: string;
  trainingSaturday?: string;
  trainingSunday?: string;
  auditData?: AuditableApiBean;
}

export type ClientTrainingPlanRequestApiBean = Partial<
  Pick<ClientTrainingPlanResponseApiBean, TrainingPlanDayField | TrainingDayApiField>
>;

export interface SearchClientTrainingPlansApiBean {
  trainingPlans?: ClientTrainingPlanResponseApiBean[];
  pageSize?: number;
  pageNumber?: number;
  totalElements?: number;
  totalPages?: number;
}
