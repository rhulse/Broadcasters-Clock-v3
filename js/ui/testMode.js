import { offsetToReach, parseTimeOfDay } from "../core/offset.js";

/**
 * Test mode: jump the clock to a chosen time so a countdown can be checked
 * live. Nothing here is saved, and a banner shows whenever the clock is not
 * real, so it can't be left running on air unnoticed.
 *
 * @param {{
 *   root: Element,                 the test-mode fieldset
 *   banner: HTMLElement,
 *   clock: ReturnType<typeof import("./clock.js").createClock>,
 *   onChange: () => void,          the clock moved: redraw
 *   onJump: () => void,            the user asked for a jump or a reset
 * }} options
 */
export function setupTestMode({ root, banner, clock, onChange, onJump }) {
  const toggle = root.querySelector("[data-test-toggle]");
  const controls = root.querySelector("[data-test-controls]");
  const timeInput = root.querySelector("[data-test-time]");

  function sync() {
    controls.hidden = !toggle.checked;
    banner.hidden = clock.offset === 0;
  }

  function jump() {
    const target = parseTimeOfDay(timeInput.value);
    if (!target) {
      timeInput.focus();
      return;
    }
    clock.setOffset(offsetToReach(target, new Date()));
    sync();
    onChange();
    onJump();
  }

  function reset() {
    clock.setOffset(0);
    sync();
    onChange();
  }

  toggle.addEventListener("change", () => {
    if (!toggle.checked) reset();
    sync();
  });

  root.querySelector("[data-test-set]").addEventListener("click", jump);
  root.querySelector("[data-test-reset]").addEventListener("click", () => {
    reset();
    onJump();
  });
  timeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      jump();
    }
  });

  sync();
}
