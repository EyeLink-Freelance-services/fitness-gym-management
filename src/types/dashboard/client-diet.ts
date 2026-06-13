import type { AuditableApiBean } from "./shared";

/** Matches MealIntervalApiBean in the OpenAPI spec. */
export type MealInterval = "BREAKFAST" | "LUNCH" | "DINNER" | "SPECIFIC";

export type ClientDietSearchSortField =
  | "MEAL_INTERVAL"
  | "MEAL_DESCRIPTION"
  | "MEAL_TIME"
  | "CREATION_DATE";

export interface ClientDietResponseApiBean {
  id?: string;
  mealInterval?: MealInterval | string;
  mealTime?: string;
  mealDescription?: string;
  auditData?: AuditableApiBean;
}

/** Single diet – used by DietRequestBody (PUT). */
export interface ClientDietRequestApiBean {
  mealInterval: MealInterval;
  mealTime?: string;
  mealDescription: string;
}

/** Batch create – used by DietsRequestBody (POST). */
export interface DietsRequestApiBean {
  diets: ClientDietRequestApiBean[];
}

export interface SearchClientDietsApiBean {
  diets?: ClientDietResponseApiBean[];
  pageSize?: number;
  pageNumber?: number;
  totalElements?: number;
  totalPages?: number;
}
