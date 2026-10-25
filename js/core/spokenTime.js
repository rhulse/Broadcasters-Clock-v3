/**
 * The heart of the clock: decide what to say, without saying it.
 *
 * Returns data only. Each language in js/i18n turns that data into words,
 * so grammar and word order stay out of this file.
 *
 * Rounding:
 *   "broadcast" - after 30 seconds, look ahead to the next minute and mark it
 *                 with a minus sign ("coming up to"). Before, mark it plus
 *                 ("just gone"). This is how most broadcasters speak.
 *   "classic"   - always the current minute, no sign. (The original Delphi
 *                 clock's standard mode.)
 */

/**
 * @typedef {"broadcast" | "classic"} Rounding
 *
 * @typedef {{ kind: "countdown", seconds: number, hour: number }
 *   | { kind: "oclock", sign: Sign, hour: number }
 *   | { kind: "half", sign: Sign, hour: number }
 *   | { kind: "quarter", sign: Sign, hour: number, direction: Direction }
 *   | { kind: "minutes", sign: Sign, hour: number, count: number, direction: Direction }
 * } SpokenTime
 *
 * @typedef {"+" | "−" | ""} Sign   (the minus is U+2212, not a hyphen)
 * @typedef {"past" | "to"} Direction
 */

export const ROUNDINGS = /** @type {const} */ (["broadcast", "classic"]);

/** 0, 13 and 24 all map into 1..12. */
const to12 = (hour) => ((hour + 11) % 12) + 1;

/**
 * @param {import("./timeParts.js").TimeParts} parts
 * @param {{ rounding?: Rounding }} [options]
 * @returns {SpokenTime}
 */
export function spokenTime({ hours, minutes, seconds }, { rounding = "broadcast" } = {}) {
  // The last minute of the hour is a countdown, never a rounded time.
  if (minutes === 59) {
    return { kind: "countdown", seconds: 60 - seconds, hour: to12(hours + 1) };
  }

  const roundedUp = rounding === "broadcast" && seconds > 30;
  const m = minutes + (roundedUp ? 1 : 0); // always 0..59 here
  const past = m <= 30;
  const distance = past ? m : 60 - m;
  const hour = to12(past ? hours : hours + 1);
  const sign = rounding === "classic" ? "" : roundedUp ? "−" : "+";
  const direction = past ? "past" : "to";

  if (m === 0) return { kind: "oclock", sign, hour };
  if (m === 30) return { kind: "half", sign, hour };
  if (distance === 15) return { kind: "quarter", sign, hour, direction };
  return { kind: "minutes", sign, hour, count: distance, direction };
}
