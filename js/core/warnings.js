/** How many seconds before the top of the hour the warning starts. */
export const WARNING_SECONDS = 10;

/**
 * True in the final WARNING_SECONDS of the hour.
 * @param {import("./timeParts.js").TimeParts} parts
 */
export function isHourWarning({ minutes, seconds }) {
  return minutes === 59 && seconds >= 60 - WARNING_SECONDS;
}

/**
 * Position through the current minute, 0..100. At the very start of the minute
 * the bar shows full, as the original clock did, so a completed minute is
 * visible for a second.
 * @param {import("./timeParts.js").TimeParts} parts
 */
export function minuteProgress({ seconds }) {
  return seconds === 0 ? 100 : (seconds / 60) * 100;
}
