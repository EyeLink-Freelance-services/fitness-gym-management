import { genderOptions } from "@/data/shared";

export const CLIENT_GENDER_OPTIONS = genderOptions;

export const MEMBERSHIP_PLAN_FORM_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "personalCoach", label: "Personal Coaching" },
] as const;
