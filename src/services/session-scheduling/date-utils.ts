export function addWeeksToIsoDate(isoDay: string, weeks: number): string {
  const d = new Date(isoDay + "T12:00:00");
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}
