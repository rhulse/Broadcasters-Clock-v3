/**
 * Format a Date as a digital clock string, e.g. "09:05:07 AM".
 * @param {Date} date
 * @param {{ locale?: string, hour12?: boolean }} [options]
 */
export function digitalTime(date, { locale = "en", hour12 = true } = {}) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12,
  }).format(date);
}
