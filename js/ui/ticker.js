/**
 * Call `onTick` at the start of every second of the clock.
 * A plain setInterval drifts, so each tick is scheduled against the clock.
 * Returns a function that stops the ticker.
 *
 * @param {(now: Date) => void} onTick
 * @param {() => Date} [getNow] the clock to follow (defaults to the system clock)
 */
export function startTicker(onTick, getNow = () => new Date()) {
  let timer;

  const tick = () => {
    const now = getNow();
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
