export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("uz-UZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("uz-UZ", {
    dateStyle: "medium",
  }).format(date);
}
