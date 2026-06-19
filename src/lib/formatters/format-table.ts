import { ImageProps } from "next/image";
import { compactFormat, standardFormat } from "./format-number";

export function formatColumnLabel(key: string) {
  const spaced = key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function isImageSrc(value: unknown): value is ImageProps["src"] {
  if (typeof value === "string") return true;

  return Boolean(
    value &&
      typeof value === "object" &&
      "src" in value &&
      typeof (value as { src?: unknown }).src === "string",
  );
}

export function formatCellValue(key: string, value: unknown) {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "number") {
    const normalizedKey = key.toLowerCase();

    if (
      normalizedKey.includes("revenue") ||
      normalizedKey.includes("price") ||
      normalizedKey.includes("amount")
    ) {
      return `$${standardFormat(value)}`;
    }

    if (
      normalizedKey.includes("conversion") ||
      normalizedKey.includes("rate") ||
      normalizedKey.includes("percentage")
    ) {
      return `${value}%`;
    }

    return compactFormat(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}
