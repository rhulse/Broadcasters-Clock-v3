/**
 * The clock's source of time: the system clock, plus an offset for test mode.
 * The offset is never saved, so a reload always returns to real time.
 */
export function createClock() {
  let offset = 0;

  return {
    now: () => new Date(Date.now() + offset),
    get offset() {
      return offset;
    },
    setOffset(ms) {
      offset = ms;
    },
  };
}
