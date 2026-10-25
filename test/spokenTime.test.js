import { test } from "node:test";
import assert from "node:assert/strict";
import { spokenTime } from "../js/core/spokenTime.js";
import { isHourWarning, minuteProgress } from "../js/core/warnings.js";

const at = (hours, minutes, seconds) => ({ hours, minutes, seconds });
const MINUS = "−";

// [description, time, expected] for the default (broadcast) rounding
const broadcast = [
  ["top of the hour", at(10, 0, 0), { kind: "oclock", sign: "+", hour: 10 }],
  ["rounds up to the hour", at(9, 58, 31), { kind: "minutes", sign: MINUS, hour: 10, count: 1, direction: "to" }],
  ["singular minute past", at(10, 1, 0), { kind: "minutes", sign: "+", hour: 10, count: 1, direction: "past" }],
  ["just before the quarter", at(10, 14, 31), { kind: "quarter", sign: MINUS, hour: 10, direction: "past" }],
  ["quarter past", at(10, 15, 0), { kind: "quarter", sign: "+", hour: 10, direction: "past" }],
  ["just after the quarter", at(10, 16, 0), { kind: "minutes", sign: "+", hour: 10, count: 16, direction: "past" }],
  ["half past, coming up", at(10, 29, 31), { kind: "half", sign: MINUS, hour: 10 }],
  ["half past", at(10, 30, 0), { kind: "half", sign: "+", hour: 10 }],
  ["30 seconds is still plus", at(10, 30, 30), { kind: "half", sign: "+", hour: 10 }],
  ["31 seconds rounds up, and crosses to 'to'", at(10, 30, 31), { kind: "minutes", sign: MINUS, hour: 11, count: 29, direction: "to" }],
  ["first minute 'to'", at(10, 31, 0), { kind: "minutes", sign: "+", hour: 11, count: 29, direction: "to" }],
  ["quarter to", at(10, 45, 0), { kind: "quarter", sign: "+", hour: 11, direction: "to" }],
  ["coming up to quarter to", at(10, 44, 31), { kind: "quarter", sign: MINUS, hour: 11, direction: "to" }],
  ["singular minute to", at(10, 58, 0), { kind: "minutes", sign: "+", hour: 11, count: 2, direction: "to" }],
  ["1 minute to, rounded up", at(10, 58, 31), { kind: "minutes", sign: MINUS, hour: 11, count: 1, direction: "to" }],
  ["countdown starts at 59:00", at(10, 59, 0), { kind: "countdown", seconds: 60, hour: 11 }],
  ["countdown ignores rounding", at(10, 59, 45), { kind: "countdown", seconds: 15, hour: 11 }],
  ["last second", at(10, 59, 59), { kind: "countdown", seconds: 1, hour: 11 }],
];

for (const [name, time, expected] of broadcast) {
  test(`broadcast: ${name}`, () => {
    assert.deepEqual(spokenTime(time), expected);
  });
}

test("classic: never rounds up and has no sign", () => {
  assert.deepEqual(spokenTime(at(10, 30, 31), { rounding: "classic" }), {
    kind: "half",
    sign: "",
    hour: 10,
  });
  assert.deepEqual(spokenTime(at(10, 0, 45), { rounding: "classic" }), {
    kind: "oclock",
    sign: "",
    hour: 10,
  });
});

test("classic: still counts down in the last minute", () => {
  assert.deepEqual(spokenTime(at(10, 59, 40), { rounding: "classic" }), {
    kind: "countdown",
    seconds: 20,
    hour: 11,
  });
});

test("hours wrap onto a 12-hour dial", () => {
  const hourOf = (h, m, s) => spokenTime(at(h, m, s)).hour;
  assert.equal(hourOf(0, 0, 0), 12, "midnight");
  assert.equal(hourOf(0, 40, 0), 1, "00:40 is 20 to 1");
  assert.equal(hourOf(12, 0, 0), 12, "noon");
  assert.equal(hourOf(12, 40, 0), 1, "12:40 is 20 to 1");
  assert.equal(hourOf(13, 0, 0), 1);
  assert.equal(hourOf(23, 40, 0), 12, "23:40 is 20 to midnight");
  assert.equal(hourOf(23, 59, 0), 12, "countdown to midnight");
});

test("warning covers the last 10 seconds of the hour only", () => {
  assert.equal(isHourWarning(at(10, 59, 49)), false);
  assert.equal(isHourWarning(at(10, 59, 50)), true);
  assert.equal(isHourWarning(at(10, 59, 59)), true);
  assert.equal(isHourWarning(at(11, 0, 0)), false);
  assert.equal(isHourWarning(at(10, 58, 55)), false);
});

test("progress runs 0..100 and shows full at the start of a minute", () => {
  assert.equal(minuteProgress(at(10, 5, 0)), 100);
  assert.equal(minuteProgress(at(10, 5, 1)), (1 / 60) * 100);
  assert.equal(minuteProgress(at(10, 5, 30)), 50);
});
