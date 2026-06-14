import type {
  CoachDietPlanRecord,
  CoachDietPlanRow,
  CoachMealTimeOption,
  CoachTrainingPlanDay,
  CoachTrainingPlanRecord,
  CoachTrainingPlanRow,
} from "@/types/dashboard/client";
import type {
  PersonalCoachDietPlanFormData,
  PersonalCoachTrainingPlanFormData,
} from "@/types/forms";
import type { CoachPlanClient } from "./coach-plan.types";

export const TRAINING_DAYS: CoachTrainingPlanDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function createPlanId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function formatUpdatedAt(date: string) {
  return new Date(date).toISOString();
}

export function formatDietSlotLabel(
  timeSlot: CoachMealTimeOption,
  specificTime?: string,
) {
  if (timeSlot !== "Specific") {
    return timeSlot;
  }

  return specificTime ? `Specific (${specificTime})` : "Specific";
}

export function toDietRow(record: CoachDietPlanRecord): CoachDietPlanRow {
  return {
    id: record.id,
    clientName: record.clientName,
    mealsSummary: record.meals
      .map((meal) => formatDietSlotLabel(meal.timeSlot, meal.specificTime))
      .join(" | "),
    totalMeals: record.meals.length,
    updatedAt: record.updatedAt,
  };
}

export function toTrainingRow(
  record: CoachTrainingPlanRecord,
): CoachTrainingPlanRow {
  const byDay = Object.fromEntries(
    record.days.map((entry) => [entry.day, entry.exercise]),
  ) as Record<CoachTrainingPlanDay, string>;

  return {
    id: record.id,
    clientName: record.clientName,
    monday: byDay.Monday ?? "-",
    tuesday: byDay.Tuesday ?? "-",
    wednesday: byDay.Wednesday ?? "-",
    thursday: byDay.Thursday ?? "-",
    friday: byDay.Friday ?? "-",
    saturday: byDay.Saturday ?? "-",
    sunday: byDay.Sunday ?? "-",
    repeats: "-",
    updatedAt: record.updatedAt,
  };
}

export function toDietFormData(
  client: CoachPlanClient,
  record?: CoachDietPlanRecord,
): PersonalCoachDietPlanFormData {
  return {
    clientId: client.id,
    clientName: client.name,
    meals:
      record?.meals.map((meal) => ({
        timeSlot: meal.timeSlot,
        specificTime: meal.specificTime ?? "",
        meal: meal.meal,
      })) ?? [{ timeSlot: "Breakfast", specificTime: "", meal: "" }],
  };
}

export function toTrainingFormData(
  client: CoachPlanClient,
  record?: CoachTrainingPlanRecord,
): PersonalCoachTrainingPlanFormData {
  const byDay = Object.fromEntries(
    (record?.days ?? []).map((entry) => [entry.day, entry.exercise]),
  ) as Partial<Record<CoachTrainingPlanDay, string>>;

  return {
    clientId: client.id,
    clientName: client.name,
    monday: byDay.Monday ?? "",
    tuesday: byDay.Tuesday ?? "",
    wednesday: byDay.Wednesday ?? "",
    thursday: byDay.Thursday ?? "",
    friday: byDay.Friday ?? "",
    saturday: byDay.Saturday ?? "",
    sunday: byDay.Sunday ?? "",
  };
}

export function toDietRecord(
  values: PersonalCoachDietPlanFormData,
  existingId?: string,
): CoachDietPlanRecord {
  return {
    id: existingId ?? createPlanId("diet-plan"),
    clientId: values.clientId,
    clientName: values.clientName,
    updatedAt: formatUpdatedAt(new Date().toISOString()),
    meals: values.meals.map((meal, index) => ({
      id: `${existingId ?? "diet-meal"}-${index + 1}`,
      timeSlot: meal.timeSlot,
      specificTime:
        meal.timeSlot === "Specific" ? meal.specificTime?.trim() ?? "" : undefined,
      meal: meal.meal.trim(),
    })),
  };
}

export function toTrainingRecord(
  values: PersonalCoachTrainingPlanFormData,
  existingId?: string,
): CoachTrainingPlanRecord {
  const exercisesByDay: Record<CoachTrainingPlanDay, string> = {
    Monday: values.monday.trim(),
    Tuesday: values.tuesday.trim(),
    Wednesday: values.wednesday.trim(),
    Thursday: values.thursday.trim(),
    Friday: values.friday.trim(),
    Saturday: values.saturday.trim(),
    Sunday: values.sunday.trim(),
  };

  return {
    id: existingId ?? createPlanId("training-plan"),
    clientId: values.clientId,
    clientName: values.clientName,
    updatedAt: formatUpdatedAt(new Date().toISOString()),
    days: TRAINING_DAYS.map((day) => ({
      day,
      exercise: exercisesByDay[day],
    })),
  };
}
