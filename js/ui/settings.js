import { ROUNDINGS } from "../core/spokenTime.js";
import { detectLanguage, isSupportedLanguage } from "../i18n/index.js";

const STORAGE_KEY = "broadcasters-clock";

/**
 * @typedef {{
 *   rounding: import("../core/spokenTime.js").Rounding,
 *   lang: string,
 *   hour12: boolean,
 * }} Settings
 */

/** What each setting accepts. Anything else is ignored. */
const validators = {
  rounding: (v) => ROUNDINGS.includes(v),
  lang: (v) => isSupportedLanguage(v),
  hour12: (v) => typeof v === "boolean",
};

function defaults() {
  return { rounding: "broadcast", lang: detectLanguage(), hour12: true };
}

/**
 * Settings come from, in order of priority: the URL (?rounding=classic&lang=en
 * &hour12=0), the saved copy in localStorage, then the defaults. The URL lets a
 * studio PC bookmark its own setup.
 * @returns {Settings}
 */
export function loadSettings(search = location.search) {
  const settings = defaults();
  Object.assign(settings, pick(readStored()));
  Object.assign(settings, pick(readParams(search)));
  return settings;
}

/** @param {Settings} settings */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be blocked (private windows, locked-down PCs). Carry on.
  }
}

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function readParams(search) {
  const params = new URLSearchParams(search);
  const out = {};
  if (params.has("rounding")) out.rounding = params.get("rounding");
  if (params.has("lang")) out.lang = params.get("lang");
  if (params.has("hour12")) out.hour12 = params.get("hour12") !== "0";
  return out;
}

/** Keep only values that pass validation. */
function pick(candidate) {
  const out = {};
  for (const [key, isValid] of Object.entries(validators)) {
    if (key in candidate && isValid(candidate[key])) out[key] = candidate[key];
  }
  return out;
}
