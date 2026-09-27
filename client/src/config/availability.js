// Single source of truth for developer availability values.
// Older profiles may store "Available" or "unavailable"; normalizeAvailability
// maps them onto these values (mirrors server/src/services/profile.service.js).
export const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available", badgeClass: "bg-green-100 text-green-700" },
  { value: "busy", label: "Busy", badgeClass: "bg-amber-100 text-amber-700" },
  { value: "not-available", label: "Not Available", badgeClass: "bg-red-100 text-red-600" },
];

const LEGACY_AVAILABILITY = { unavailable: "not-available" };

export function normalizeAvailability(value) {
  if (typeof value !== "string") {
    return "";
  }
  const normalized = value.trim().toLowerCase();
  return LEGACY_AVAILABILITY[normalized] || normalized;
}

export function getAvailabilityOption(value) {
  const normalized = normalizeAvailability(value);
  return AVAILABILITY_OPTIONS.find((option) => option.value === normalized);
}
