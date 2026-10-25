import { test } from "node:test";
import assert from "node:assert/strict";
import { spokenTime } from "../js/core/spokenTime.js";
import { languages, getLanguage, detectLanguage } from "../js/i18n/index.js";
import en from "../js/i18n/en.js";

const at = (hours, minutes, seconds) => ({ hours, minutes, seconds });

// Every kind of phrase, in both directions and both roundings.
const moments = [
  at(10, 0, 0), at(9, 58, 31), at(10, 1, 0), at(10, 14, 31), at(10, 15, 0),
  at(10, 16, 0), at(10, 30, 0), at(10, 30, 31), at(10, 44, 31), at(10, 45, 0),
  at(10, 58, 0), at(10, 58, 31), at(10, 59, 0), at(10, 59, 59), at(0, 0, 0),
];

for (const language of languages) {
  test(`${language.code}: gives readable text for every kind of phrase`, () => {
    for (const rounding of ["broadcast", "classic"]) {
      for (const time of moments) {
        const { sign, text } = language.format(spokenTime(time, { rounding }));
        assert.equal(typeof sign, "string");
        assert.ok(text.length > 0, JSON.stringify(time));
        assert.doesNotMatch(text, /undefined|NaN|null/, JSON.stringify(time));
      }
    }
  });
}

test("en: wording", () => {
  const say = (time, rounding) => {
    const { sign, text } = en.format(spokenTime(time, { rounding }));
    return `${sign} ${text}`.trim();
  };
  assert.equal(say(at(10, 0, 0)), "+ 10 O'Clock");
  assert.equal(say(at(10, 15, 0)), "+ Quarter past 10");
  assert.equal(say(at(10, 58, 31)), "− 1 minute to 11");
  assert.equal(say(at(10, 31, 0)), "+ 29 minutes to 11");
  assert.equal(say(at(10, 59, 59)), "1 second to 11");
  assert.equal(say(at(10, 59, 0)), "60 seconds to 11");
  assert.equal(say(at(10, 30, 31), "classic"), "Half past 10");
});

test("unknown languages fall back to the first", () => {
  assert.equal(getLanguage("xx"), languages[0]);
});

test("detects the browser language, ignoring region, with a fallback", () => {
  assert.equal(detectLanguage(["en-NZ"]), "en");
  assert.equal(detectLanguage(["xx-YY"]), languages[0].code);
  assert.equal(detectLanguage([]), languages[0].code);
});
