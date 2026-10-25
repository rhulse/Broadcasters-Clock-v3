/**
 * A language turns SpokenTime data into words. It owns all grammar and word
 * order, so each language is free to build the phrase however it needs.
 *
 * @typedef {{
 *   code: string,
 *   name: string,
 *   format: (t: import("../core/spokenTime.js").SpokenTime) => { sign: string, text: string }
 * }} Language
 */

import en from "./en.js";

/** Add new languages here. The first is the fallback. */
export const languages = [en];

const byCode = new Map(languages.map((language) => [language.code, language]));

/** @param {string} code */
export function isSupportedLanguage(code) {
  return byCode.has(code);
}

/** Look up a language, falling back to the first one. */
export function getLanguage(code) {
  return byCode.get(code) ?? languages[0];
}

/** Pick the best match for the browser's preferred languages. */
export function detectLanguage(preferred = globalThis.navigator?.languages ?? []) {
  for (const tag of preferred) {
    const code = tag.toLowerCase().split("-")[0];
    if (byCode.has(code)) return code;
  }
  return languages[0].code;
}
