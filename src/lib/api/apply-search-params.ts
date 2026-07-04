/**
 * Maps a free-text search box value to backend list query params.
 * Matches the coaches API convention: email / phone / name field.
 */
export function applyContactSearchParams(
  params: URLSearchParams,
  search?: string,
  nameKey: string = "firstName",
) {
  const trimmed = search?.trim();
  if (!trimmed) return;

  if (trimmed.includes("@")) {
    params.set("email", trimmed);
  } else if (/^[+\d\s-]+$/.test(trimmed)) {
    params.set("contactNumber", trimmed);
  } else {
    params.set(nameKey, trimmed);
  }
}
