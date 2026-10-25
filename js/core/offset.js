/**
 * Maths for test mode: jumping the clock to a chosen time of day.
 */

/**
 * Parse "HH:MM" or "HH:MM:SS" (as a time input gives). Null if invalid.
 * @param {string} value
 * @returns {import("./timeParts.js").TimeParts | null}
 */
export function parseTimeOfDay(value) {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return null;

  const [, h, m, s = "0"] = match;
  const parts = { hours: Number(h), minutes: Number(m), seconds: Number(s) };
  const valid = parts.hours < 24 && parts.minutes < 60 && parts.seconds < 60;
  return valid ? parts : null;
}

/**
 * The offset in milliseconds that makes `now` read as `target` today.
 *
 * It is always a whole number of seconds, so the shifted clock keeps ticking
 * on the same second boundaries as the real one.
 *
 * @param {import("./timeParts.js").TimeParts} target
 * @param {Date} now
 */
export function offsetToReach(target, now) {
  const wholeSecond = now.getTime() - now.getMilliseconds();
  const goal = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    target.hours,
    target.minutes,
    target.seconds,
  ).getTime();
  return goal - wholeSecond;
}
