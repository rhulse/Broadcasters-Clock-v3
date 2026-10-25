import { timePartsFromDate } from "./core/timeParts.js";
import { spokenTime } from "./core/spokenTime.js";
import { isHourWarning, minuteProgress } from "./core/warnings.js";
import { digitalTime } from "./core/digitalTime.js";
import { getLanguage, languages } from "./i18n/index.js";
import { startTicker } from "./ui/ticker.js";
import { loadSettings, saveSettings } from "./ui/settings.js";
import { createTextView } from "./ui/textView.js";
import { createClock } from "./ui/clock.js";
import { setupTestMode } from "./ui/testMode.js";

let settings = loadSettings();
const clock = createClock();
const view = createTextView(document.querySelector("[data-clock]"));

function render(now) {
  const parts = timePartsFromDate(now);
  const language = getLanguage(settings.lang);
  const spoken = spokenTime(parts, { rounding: settings.rounding });
  const { sign, text } = language.format(spoken);

  view.render({
    sign,
    text,
    progress: minuteProgress(parts),
    warning: isHourWarning(parts),
    countdown: spoken.kind === "countdown",
    digital: digitalTime(now, { locale: language.code, hour12: settings.hour12 }),
  });
}

function applyLanguage() {
  document.documentElement.lang = getLanguage(settings.lang).code;
}

// Settings dialog
const dialog = document.querySelector("[data-settings]");
const form = dialog.querySelector("form");

for (const { code, name } of languages) form.elements.lang.add(new Option(name, code));

function syncForm() {
  form.elements.rounding.value = settings.rounding;
  form.elements.lang.value = settings.lang;
  form.elements.hour12.checked = settings.hour12;
}

form.addEventListener("change", () => {
  settings = {
    rounding: form.elements.rounding.value,
    lang: form.elements.lang.value,
    hour12: form.elements.hour12.checked,
  };
  saveSettings(settings);
  applyLanguage();
  render(clock.now());
});

document.querySelector("[data-open-settings]").addEventListener("click", () => {
  syncForm();
  dialog.showModal();
});

setupTestMode({
  root: dialog.querySelector("[data-test-mode]"),
  banner: document.querySelector("[data-test-banner]"),
  clock,
  onChange: () => render(clock.now()),
  onJump: () => dialog.close(),
});

applyLanguage();
startTicker(render, clock.now);
