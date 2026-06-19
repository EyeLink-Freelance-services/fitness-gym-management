import type {
  ClientTrainingPlanRow,
  CoachTrainingPlanDay,
} from "@/types/dashboard/client";
import type {
  ClientTrainingPlanRequestApiBean,
  ClientTrainingPlanResponseApiBean,
  SearchClientTrainingPlansApiBean,
  TrainingDayApiField,
  TrainingPlanDayField,
} from "@/types/dashboard/client-training";
import type { CoachTrainingPlanFormData } from "@/types/forms";
import type { CoachPlanClient } from "@/modules/client-records/coach-plan.types";

const TRAINING_DAYS: CoachTrainingPlanDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const FORM_DAY_KEYS: Record<CoachTrainingPlanDay, TrainingPlanDayField> = {
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
  Sunday: "sunday",
};

const API_DAY_KEYS: Record<CoachTrainingPlanDay, TrainingDayApiField> = {
  Monday: "trainingMonday",
  Tuesday: "trainingTuesday",
  Wednesday: "trainingWednesday",
  Thursday: "trainingThursday",
  Friday: "trainingFriday",
  Saturday: "trainingSaturday",
  Sunday: "trainingSunday",
};

function buildRowId(planId: string, day: CoachTrainingPlanDay) {
  return `${planId}-${day.toLowerCase()}`;
}

export function resolvePlanId(api: ClientTrainingPlanResponseApiBean) {
  return api.id?.trim() || api.trainingPlanId?.trim() || "";
}

export function formatTrainingUpdatedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getActivityForDay(
  api: ClientTrainingPlanResponseApiBean,
  day: CoachTrainingPlanDay,
) {
  const formValue = api[FORM_DAY_KEYS[day]];
  if (typeof formValue === "string" && formValue.trim()) {
    return formValue.trim();
  }

  const apiValue = api[API_DAY_KEYS[day]];
  if (typeof apiValue === "string" && apiValue.trim()) {
    return apiValue.trim();
  }

  return "";
}

export function planHasAnyActivity(api: ClientTrainingPlanResponseApiBean) {
  return TRAINING_DAYS.some((day) => getActivityForDay(api, day).length > 0);
}

export function extractTrainingPlansFromSearchResponse(
  data: SearchClientTrainingPlansApiBean,
): ClientTrainingPlanResponseApiBean[] {
  if (Array.isArray(data.trainingPlans) && data.trainingPlans.length > 0) {
    return data.trainingPlans;
  }

  const content = (
    data as SearchClientTrainingPlansApiBean & {
      content?: ClientTrainingPlanResponseApiBean[];
    }
  ).content;

  if (Array.isArray(content) && content.length > 0) {
    return content;
  }

  const record = data as SearchClientTrainingPlansApiBean &
    ClientTrainingPlanResponseApiBean;

  if (planHasAnyActivity(record) || resolvePlanId(record)) {
    return [record];
  }

  return [];
}

export function getFormValueForDay(
  values: CoachTrainingPlanFormData,
  day: CoachTrainingPlanDay,
) {
  return values[FORM_DAY_KEYS[day]] ?? "";
}

export function mapClientTrainingResponseToRows(
  api: ClientTrainingPlanResponseApiBean,
): ClientTrainingPlanRow[] {
  const planId = resolvePlanId(api);

  if (!planId) {
    return [];
  }

  const updatedAt =
    api.auditData?.lastModifiedDate ??
    api.auditData?.createdDate ??
    new Date().toISOString();

  return TRAINING_DAYS.flatMap((day) => {
    const trainingActivity = getActivityForDay(api, day);

    if (!trainingActivity) {
      return [];
    }

    return [
      {
        id: buildRowId(planId, day),
        planId,
        day,
        trainingActivity,
        updatedAt,
      },
    ];
  });
}

export function sortTrainingRows(rows: ClientTrainingPlanRow[]) {
  const order = new Map(TRAINING_DAYS.map((day, index) => [day, index]));

  return [...rows].sort(
    (left, right) => (order.get(left.day) ?? 0) - (order.get(right.day) ?? 0),
  );
}

export function getTakenTrainingDays(rows: ClientTrainingPlanRow[]) {
  return new Set(rows.map((row) => row.day));
}

export function getAvailableTrainingDays(rows: ClientTrainingPlanRow[]) {
  const taken = getTakenTrainingDays(rows);
  return TRAINING_DAYS.filter((day) => !taken.has(day));
}

export function allTrainingDaysTaken(rows: ClientTrainingPlanRow[]) {
  return getTakenTrainingDays(rows).size >= TRAINING_DAYS.length;
}

export function createTrainingFormData(
  client: CoachPlanClient,
): CoachTrainingPlanFormData {
  return {
    clientId: client.id,
    clientName: client.name,
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  };
}

export function trainingRowToFormData(
  client: CoachPlanClient,
  row?: ClientTrainingPlanRow,
): CoachTrainingPlanFormData {
  const base = createTrainingFormData(client);

  if (!row) {
    return base;
  }

  return {
    ...base,
    [FORM_DAY_KEYS[row.day]]: row.trainingActivity,
  };
}

export function getFilledTrainingEntriesFromForm(
  values: CoachTrainingPlanFormData,
  allowedDays: CoachTrainingPlanDay[],
) {
  return allowedDays
    .map((day) => ({
      day,
      activity: getFormValueForDay(values, day).trim(),
    }))
    .filter((entry) => entry.activity.length > 0);
}

function setDayOnRequest(
  body: ClientTrainingPlanRequestApiBean,
  day: CoachTrainingPlanDay,
  activity: string,
) {
  const value = activity.trim();
  body[FORM_DAY_KEYS[day]] = value;
  body[API_DAY_KEYS[day]] = value;
}

export function mapTrainingPlanToApiRequest(
  existingRows: ClientTrainingPlanRow[],
  values: CoachTrainingPlanFormData,
  daysToUpdate: CoachTrainingPlanDay[],
): ClientTrainingPlanRequestApiBean {
  const body: ClientTrainingPlanRequestApiBean = {};

  for (const row of existingRows) {
    setDayOnRequest(body, row.day, row.trainingActivity);
  }

  for (const day of daysToUpdate) {
    setDayOnRequest(body, day, getFormValueForDay(values, day));
  }

  return body;
}

export function getExistingPlanId(rows: ClientTrainingPlanRow[]) {
  return rows[0]?.planId;
}

export function isTrainingPlanConflict(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("409") || error.message.includes("DUPLICATE_ENTRY")
  );
}

export function validateTrainingBeforeSave(
  existingRows: ClientTrainingPlanRow[],
  values: CoachTrainingPlanFormData,
  editingRowId?: string,
): string | null {
  const rows = editingRowId
    ? existingRows.filter((row) => row.id !== editingRowId)
    : existingRows;
  const taken = getTakenTrainingDays(rows);

  if (editingRowId) {
    const row = existingRows.find((entry) => entry.id === editingRowId);
    if (!row) {
      return "Training plan not found.";
    }

    const activity = getFormValueForDay(values, row.day).trim();
    if (!activity) {
      return `${row.day} training activity is required.`;
    }

    return null;
  }

  const availableDays = getAvailableTrainingDays(rows);
  const entries = getFilledTrainingEntriesFromForm(values, availableDays);

  if (entries.length === 0) {
    return "Enter a training activity for at least one day.";
  }

  for (const entry of entries) {
    if (taken.has(entry.day)) {
      return `A ${entry.day} training plan already exists. Click that row to edit it.`;
    }
  }

  return null;
}

export function getTrainingSaveErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unable to save training plan.";
  }

  return error.message;
}
