export function generateFieldKeyFromLabel(label: string): string {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "field";
}

export function ensureUniqueFieldKey(
  base: string,
  existingKeys: Set<string>,
): string {
  let key = base;
  let n = 2;
  while (existingKeys.has(key)) {
    key = `${base}_${n}`;
    n += 1;
  }
  return key;
}
