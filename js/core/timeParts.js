/**
 * @typedef {{ hours: number, minutes: number, seconds: number }} TimeParts
 */

/**
 * Split a Date into the parts the clock cares about (local time).
 * @param {Date} date
 * @returns {TimeParts}
 */
export function timePartsFromDate(date) {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
}
