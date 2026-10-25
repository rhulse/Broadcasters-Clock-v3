import { timePartsFromDate } from "./core/timeParts.js";
import { spokenTime } from "./core/spokenTime.js";
import { isHourWarning, minuteProgress } from "./core/warnings.js";
import { digitalTime } from "./core/digitalTime.js";
import { getLanguage, languages } from "./i18n/index.js";
import { startTicker } from "./ui/ticker.js";
import { loadSettings, saveSettings } from "./ui/settings.js";
import { createTextView } from "./ui/textView.js";

let settings = loadSettings();
const view = createTextView(document.querySelector("[data-clock]"));

function render(now) {
  const parts = timePartsFromDate(now);
  const language = getLanguage(settings.lang);
  const { sign, text } = language.format(spokenTime(parts, { rounding: settings.rounding }));

  view.render({
    sign,
    text,
    progress: minuteProgress(parts),
    warning: isHourWarning(parts),
    digital: digitalTime(now, { locale: language.code, hour12: settings.hour12 }),
  });
}

function applyLanguage() {
  document.documentElement.lang = getLanguage(settings.lang).code;
}

// Settings dialog
const dialog = document.querySelector("[data-settings]");
const form = dialog.querySelector("form");
const langSelect = form.elements.lang;

for (const { code, name } of languages) langSelect.add(new Option(name, code));

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
  render(new Date());
});

document.querySelector("[data-open-settings]").addEventListener("click", () => {
  syncForm();
  dialog.showModal();
});

applyLanguage();
startTicker(render);
