import z from "zod";

import type { KeyboardEvent } from "react";
import { toast } from "sonner";

const NON_NEGATIVE_FIELD_MESSAGES = {
  sets: "Sets must be greater than or equal to 0",
  reps: "Reps must be greater than or equal to 0",
  weight: "Weight must be greater than or equal to 0",
  rest_seconds: "Rest seconds must be greater than or equal to 0",
} as const;

type NonNegativeField = keyof typeof NON_NEGATIVE_FIELD_MESSAGES;

export function preventNegativeKeyDown(
  e: KeyboardEvent<HTMLInputElement>,
  field: NonNegativeField
) {
  if (e.key === "-") {
    e.preventDefault();
    toast.error(NON_NEGATIVE_FIELD_MESSAGES[field]);
  }
}

export const optionalNumberFromInput = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  if (typeof val === "string") return Number(val);
  return val;
}, z.number().optional());

export const optionalIntFromInput = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  if (typeof val === "string") return Number(val);
  return val;
}, z.number().int().optional());