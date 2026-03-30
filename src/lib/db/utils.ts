export function emptyToNull(value?: string) {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function mapById<T extends { id: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

export function generateRandomPassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}