import { ValidateResult } from "@/types/forms";

export const PASSWORD_MIN_LENGTH = 7;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getPasswordStrength(val: string): number {
  const password = val ?? "";
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  return Math.min(
    4,
    [
      password.length >= PASSWORD_MIN_LENGTH,
      hasLower && hasUpper,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length,
  );
}

export function validateRequired(
  val: unknown,
  message = "This field is required",
): ValidateResult {
  if (typeof val === "string") return val.trim().length > 0 || message;
  if (typeof val === "number") return Number.isFinite(val) || message;
  if (typeof val === "boolean") return true;
  if (val instanceof Date) return !Number.isNaN(val.getTime()) || message;
  if (Array.isArray(val)) return val.length > 0 || message;
  return (val !== null && val !== undefined) || message;
}

export function validateEmail(
  val: string,
  message = "Enter a valid email",
): ValidateResult {
  return emailRegex.test((val ?? "").trim()) || message;
}

export function validateMinLength(
  val: string,
  min: number,
  message = `Must be at least ${min} characters`,
): ValidateResult {
  return (val ?? "").trim().length >= min || message;
}

export function validateMaxLength(
  val: string,
  max: number,
  message = `Must be at most ${max} characters`,
): ValidateResult {
  return (val ?? "").trim().length <= max || message;
}

export function validateOtpCode(val: string, length = 6): ValidateResult {
  const v = (val ?? "").trim();
  return (new RegExp(`^\\d{${length}}$`).test(v) ||
    `Enter a ${length}-digit code`) as ValidateResult;
}

export function validatePhone(
  val: string,
  message = "Enter a valid phone number",
): ValidateResult {
  const v = (val ?? "").trim();
  // Accepted formats: +230xxxxxxxx, 230xxxxxxxx, or local 7–15 digits.
  const digits = v.replace(/[^\d+]/g, "");
  const normalized = digits.startsWith("+") ? digits.slice(1) : digits;
  const onlyDigits = normalized.replace(/\D/g, "");
  return (onlyDigits.length >= 7 && onlyDigits.length <= 15) || message;
}

export function validatePassword(
  val: string,
  options?: {
    minLength?: number;
    minCategories?: 2 | 3 | 4;
  },
): ValidateResult {
  const password = val ?? "";
  const minLength = options?.minLength ?? PASSWORD_MIN_LENGTH;
  const minCategories = options?.minCategories ?? 3;

  if (password.length < minLength)
    return `Password must be at least ${minLength} characters`;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const categories = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
    Boolean,
  ).length;
  if (categories < minCategories) {
    return `Password must include at least ${minCategories} of: lowercase, uppercase, number, special character`;
  }

  return true;
}

export function validatePasswordMatches(
  val: string,
  other: string,
  message = "Values do not match",
): ValidateResult {
  return val === other || message;
}
