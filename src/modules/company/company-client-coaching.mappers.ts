import type {
  CoachDietPlanRecord,
  CoachMealTimeOption,
  CoachTrainingPlanDay,
  CoachTrainingPlanRecord,
} from "@/types/dashboard/client";
import type {
  ClientDietPlanMealApiBean,
  ClientDietPlanRequestApiBean,
  ClientDietPlanResponseApiBean,
  ClientTrainingPlanDayApiBean,
  ClientTrainingPlanRequestApiBean,
  ClientTrainingPlanResponseApiBean,
} from "@/types/dashboard/company-client-coaching";

const TRAINING_DAYS: CoachTrainingPlanDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function normalizeMealTimeSlot(value?: string): CoachMealTimeOption {
  const options: CoachMealTimeOption[] = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Specific",
  ];
  const match = options.find(
    (option) => option.toLowerCase() === value?.toLowerCase(),
  );
  return match ?? "Breakfast";
}

export function mapDietPlanResponseToRecord(
  api: ClientDietPlanResponseApiBean,
  clientId: string,
): CoachDietPlanRecord {
  return {
    id: api.id ?? "",
    clientId,
    clientName: api.clientName ?? "",
    updatedAt: api.updatedAt ?? api.auditData?.lastModifiedDate ?? new Date().toISOString(),
    meals: (api.meals ?? []).map((meal, index) => ({
      id: meal.id ?? `meal-${index + 1}`,
      timeSlot: normalizeMealTimeSlot(meal.timeSlot),
      specificTime: meal.specificTime,
      meal: meal.meal ?? "",
    })),
  };
}

export function mapTrainingPlanResponseToRecord(
  api: ClientTrainingPlanResponseApiBean,
  clientId: string,
): CoachTrainingPlanRecord {
  const byDay = Object.fromEntries(
    (api.days ?? []).map((entry) => [entry.day, entry.exercise ?? ""]),
  ) as Partial<Record<CoachTrainingPlanDay, string>>;

  return {
    id: api.id ?? "",
    clientId,
    clientName: api.clientName ?? "",
    updatedAt: api.updatedAt ?? api.auditData?.lastModifiedDate ?? new Date().toISOString(),
    days: TRAINING_DAYS.map((day) => ({
      day,
      exercise: byDay[day] ?? "",
    })),
  };
}

export function mapDietPlanFormToApiRequest(
  record: CoachDietPlanRecord,
): ClientDietPlanRequestApiBean {
  const meals: ClientDietPlanMealApiBean[] = record.meals.map((meal) => ({
    id: meal.id,
    timeSlot: meal.timeSlot,
    specificTime: meal.specificTime,
    meal: meal.meal,
  }));

  return { meals };
}

export function mapTrainingPlanFormToApiRequest(
  record: CoachTrainingPlanRecord,
): ClientTrainingPlanRequestApiBean {
  const days: ClientTrainingPlanDayApiBean[] = record.days.map((entry) => ({
    day: entry.day,
    exercise: entry.exercise,
  }));

  return {
    days,
  };
}
