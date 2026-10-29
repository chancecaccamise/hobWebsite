import { siteConfig } from "@/config/site";

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: siteConfig.timeZone,
});

/** e.g. "Oct 28, 2026 · 10:05 PM" in the site's time zone. */
export function formatDateTime(iso: string) {
  const parts = dateTimeFormat.formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("month")} ${get("day")}, ${get("year")} · ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
}

/** Reads a 1-based ?page= value, falling back to 1. */
export function parsePage(value: string | string[] | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
