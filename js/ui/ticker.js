/**
 * Call `onTick` at the start of every second of the system clock.
 * A plain setInterval drifts, so each tick is scheduled against the clock.
 * Returns a function that stops the ticker.
 * @param {(now: Date) => void} onTick
 */
export function startTicker(onTick) {
  let timer;

  const tick = () => {
    const now = new Date();
    onTick(now);
    timer = setTimeout(tick, 1000 - (now.getTime() % 1000));
  };

  // Browsers throttle timers in hidden tabs; catch up as soon as we're seen.
  const onVisible = () => {
    if (document.visibilityState === "visible") {
      clearTimeout(timer);
      tick();
    }
  };
  document.addEventListener("visibilitychange", onVisible);

  tick();

  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisible);
  };
}
