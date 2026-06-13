import type {
  CoachDietPlanMeal,
  CoachMealTimeOption,
  ClientDietPlanRow,
} from "@/types/dashboard/client";
import type {
  ClientDietRequestApiBean,
  ClientDietResponseApiBean,
  MealInterval,
} from "@/types/dashboard/client-diet";
import type { PersonalCoachDietPlanFormData } from "@/types/forms";
import type { CoachPlanClient } from "@/modules/client-records/coach-plan.types";

const MEAL_INTERVAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

function isSpecificMealInterval(interval: string) {
  const normalized = interval.toUpperCase();
  return (
    normalized === "SPECIFIC" ||
    normalized === "CUSTOM"
  );
}

export function formatMealIntervalLabel(
  mealInterval: string,
  mealTime?: string,
): string {
  const normalized = mealInterval.toUpperCase();

  if (
    normalized === "BREAKFAST" ||
    normalized === "LUNCH" ||
    normalized === "DINNER"
  ) {
    return MEAL_INTERVAL_LABELS[normalized];
  }

  if (isSpecificMealInterval(mealInterval) && mealTime) {
    return formatMealTime(mealTime);
  }

  return mealInterval;
}

export function formatMealTime(value: string) {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDietUpdatedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapClientDietResponseToRow(
  api: ClientDietResponseApiBean,
): ClientDietPlanRow {
  return {
    id: api.id ?? "",
    mealInterval: api.mealInterval ?? "",
    mealTime: api.mealTime,
    mealDescription: api.mealDescription ?? "",
    updatedAt:
      api.auditData?.lastModifiedDate ??
      api.auditData?.createdDate ??
      new Date().toISOString(),
  };
}

function toMealTimeDateTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const h = String(hours ?? "0").padStart(2, "0");
  const m = String(minutes ?? "0").padStart(2, "0");
  return `${year}-${month}-${day}T${h}:${m}:00`;
}

function mapTimeSlotToInterval(timeSlot: CoachMealTimeOption): MealInterval {
  if (timeSlot === "Specific") return "SPECIFIC";
  return timeSlot.toUpperCase() as MealInterval;
}

function mapIntervalToTimeSlot(interval: string): CoachMealTimeOption {
  const normalized = interval.toUpperCase();
  if (isSpecificMealInterval(interval)) return "Specific";
  if (normalized === "LUNCH") return "Lunch";
  if (normalized === "DINNER") return "Dinner";
  return "Breakfast";
}

export const DIET_MEAL_TIME_OPTIONS: CoachMealTimeOption[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Specific",
];

export const MAX_DIET_MEALS_PER_CLIENT = 4;

export function formatDietTimeSlotLabel(timeSlot: CoachMealTimeOption): string {
  if (timeSlot === "Specific") return "Specific Time";
  return timeSlot;
}

export function allDietSlotsTaken(existingRows: ClientDietPlanRow[]): boolean {
  const counts = countDietMealSlots(existingRows, []);
  return (
    counts.breakfast >= 1 &&
    counts.lunch >= 1 &&
    counts.dinner >= 1 &&
    counts.specific >= 1
  );
}

export function countDietMealSlots(
  existingRows: ClientDietPlanRow[],
  formMeals: PersonalCoachDietPlanFormData["meals"],
  excludeFormIndex?: number,
) {
  const counts = { breakfast: 0, lunch: 0, dinner: 0, specific: 0 };

  for (const row of existingRows) {
    const slot = mapIntervalToTimeSlot(row.mealInterval);
    if (slot === "Breakfast") counts.breakfast += 1;
    else if (slot === "Lunch") counts.lunch += 1;
    else if (slot === "Dinner") counts.dinner += 1;
    else if (slot === "Specific") counts.specific += 1;
  }

  formMeals.forEach((meal, index) => {
    if (excludeFormIndex === index) return;

    if (meal.timeSlot === "Breakfast") counts.breakfast += 1;
    else if (meal.timeSlot === "Lunch") counts.lunch += 1;
    else if (meal.timeSlot === "Dinner") counts.dinner += 1;
    else if (meal.timeSlot === "Specific") counts.specific += 1;
  });

  return counts;
}

export function getAvailableDietTimeSlots(
  existingRows: ClientDietPlanRow[],
  formMeals: PersonalCoachDietPlanFormData["meals"],
  currentIndex: number,
): CoachMealTimeOption[] {
  const counts = countDietMealSlots(existingRows, formMeals, currentIndex);

  return DIET_MEAL_TIME_OPTIONS.filter((slot) => {
    if (slot === "Breakfast") return counts.breakfast < 1;
    if (slot === "Lunch") return counts.lunch < 1;
    if (slot === "Dinner") return counts.dinner < 1;
    if (slot === "Specific") return counts.specific < 1;
    return false;
  });
}

export function canAddAnotherDietMeal(
  existingRows: ClientDietPlanRow[],
  formMeals: PersonalCoachDietPlanFormData["meals"],
) {
  if (formMeals.length >= MAX_DIET_MEALS_PER_CLIENT) {
    return false;
  }

  const counts = countDietMealSlots(existingRows, formMeals);
  return (
    counts.breakfast < 1 ||
    counts.lunch < 1 ||
    counts.dinner < 1 ||
    counts.specific < 1
  );
}

function getFirstAvailableDietSlot(
  existingRows: ClientDietPlanRow[],
  formMeals: PersonalCoachDietPlanFormData["meals"],
): CoachMealTimeOption {
  const available = getAvailableDietTimeSlots(
    existingRows,
    formMeals,
    formMeals.length,
  );
  return available[0] ?? "Breakfast";
}

export function createDietFormData(
  client: CoachPlanClient,
  existingRows: ClientDietPlanRow[] = [],
): PersonalCoachDietPlanFormData {
  return {
    clientId: client.id,
    clientName: client.name,
    meals: [
      {
        timeSlot: getFirstAvailableDietSlot(existingRows, []),
        specificTime: "",
        meal: "",
      },
    ],
  };
}

export function isSpecificTimeTaken(
  time: string,
  existingRows: ClientDietPlanRow[],
  formMeals: PersonalCoachDietPlanFormData["meals"],
  excludeFormIndex: number,
) {
  const normalized = time.trim();
  if (!normalized) return false;

  const takenInForm = formMeals.some(
    (meal, index) =>
      index !== excludeFormIndex &&
      meal.timeSlot === "Specific" &&
      meal.specificTime?.trim() === normalized,
  );

  if (takenInForm) return true;

  return existingRows.some(
    (row) =>
      mapIntervalToTimeSlot(row.mealInterval) === "Specific" &&
      row.mealTime &&
      formatMealTime(row.mealTime) === normalized,
  );
}

export function mapCoachMealToApiRequest(
  meal: CoachDietPlanMeal,
): ClientDietRequestApiBean {
  const mealInterval = mapTimeSlotToInterval(meal.timeSlot);
  const payload: ClientDietRequestApiBean = {
    mealInterval,
    mealDescription: meal.meal.trim(),
  };

  if (mealInterval === "SPECIFIC" && meal.specificTime?.trim()) {
    payload.mealTime = toMealTimeDateTime(meal.specificTime.trim());
  }

  return payload;
}

function getMealSlotLabel(timeSlot: CoachMealTimeOption): string {
  return formatDietTimeSlotLabel(timeSlot);
}

export function validateDietMealsBeforeSave(
  existingRows: ClientDietPlanRow[],
  meals: CoachDietPlanMeal[],
  editingDietId?: string,
): string | null {
  const rows = editingDietId
    ? existingRows.filter((row) => row.id !== editingDietId)
    : existingRows;

  if (rows.length + meals.length > MAX_DIET_MEALS_PER_CLIENT) {
    return "Each client can have at most 1 Breakfast, 1 Lunch, 1 Dinner, and 1 Specific Time.";
  }

  const existingIntervals = new Set(
    rows.map((row) =>
      mapTimeSlotToInterval(mapIntervalToTimeSlot(row.mealInterval)),
    ),
  );

  const formIntervals = new Set<MealInterval>();

  for (const meal of meals) {
    const interval = mapTimeSlotToInterval(meal.timeSlot);

    if (formIntervals.has(interval)) {
      return `Only one ${getMealSlotLabel(meal.timeSlot)} entry can be saved at a time.`;
    }
    formIntervals.add(interval);

    if (existingIntervals.has(interval)) {
      return `A ${getMealSlotLabel(meal.timeSlot)} diet already exists. Click that row to edit it.`;
    }
  }

  return null;
}

export function getDietSaveErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unable to save diet plan.";
  }

  const message = error.message;

  if (message.includes("409") || message.includes("DUPLICATE_ENTRY")) {
    return "A diet for this meal time already exists. Each client can have 1 Breakfast, 1 Lunch, 1 Dinner, and 1 Specific Time.";
  }

  const jsonMatch = message.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const body = JSON.parse(jsonMatch[0]) as {
        status?: number;
        detail?: string;
      };
      if (body.status === 409) {
        return "A diet for this meal time already exists. Each client can have 1 Breakfast, 1 Lunch, 1 Dinner, and 1 Specific Time.";
      }
      if (body.detail) {
        return body.detail;
      }
    } catch {
      // Fall through to the raw message.
    }
  }

  return message;
}

export function dietRowToFormData(
  client: CoachPlanClient,
  row?: ClientDietPlanRow,
): PersonalCoachDietPlanFormData {
  if (!row) {
    return {
      clientId: client.id,
      clientName: client.name,
      meals: [{ timeSlot: "Breakfast", specificTime: "", meal: "" }],
    };
  }

  const timeSlot = mapIntervalToTimeSlot(row.mealInterval);

  return {
    clientId: client.id,
    clientName: client.name,
    meals: [
      {
        timeSlot,
        specificTime:
          timeSlot === "Specific" && row.mealTime
            ? formatMealTime(row.mealTime)
            : "",
        meal: row.mealDescription,
      },
    ],
  };
}
