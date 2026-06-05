export const SESSION_COOKIE = "loom_session";

export const ROLES = ["Admin", "Menejer"] as const;
export type Role = (typeof ROLES)[number];

export const LEAD_STATUSES = [
  "Yangi",
  "Ko'rib chiqilmoqda",
  "Bog'landi",
  "Rad etildi",
  "Yopildi",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const PRODUCT_OPTIONS = [
  "Mato",
  "Triko",
  "Denim",
  "Asosiy kiyimlar",
  "Boshqa",
] as const;

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}
