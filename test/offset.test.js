import { test } from "node:test";
import assert from "node:assert/strict";
import { offsetToReach, parseTimeOfDay } from "../js/core/offset.js";
import { timePartsFromDate } from "../js/core/timeParts.js";

test("parses times as a time input gives them", () => {
  assert.deepEqual(parseTimeOfDay("07:58:30"), { hours: 7, minutes: 58, seconds: 30 });
  assert.deepEqual(parseTimeOfDay("07:58"), { hours: 7, minutes: 58, seconds: 0 });
  assert.deepEqual(parseTimeOfDay("23:59:59"), { hours: 23, minutes: 59, seconds: 59 });
  assert.deepEqual(parseTimeOfDay(" 0:00 "), { hours: 0, minutes: 0, seconds: 0 });
});

test("rejects bad times", () => {
  for (const bad of ["", "7", "24:00", "12:60", "12:00:60", "ab:cd", "12:00:00:00"]) {
    assert.equal(parseTimeOfDay(bad), null, bad);
  }
});

const shifted = (target, now) => new Date(now.getTime() + offsetToReach(target, now));

test("the offset makes now read as the target time", () => {
  const now = new Date(2026, 5, 15, 10, 15, 42, 700);
  const parts = timePartsFromDate(shifted({ hours: 7, minutes: 58, seconds: 30 }, now));
  assert.deepEqual(parts, { hours: 7, minutes: 58, seconds: 30 });
});

test("it can jump forwards as well as back", () => {
  const now = new Date(2026, 5, 15, 7, 0, 5, 0);
  const parts = timePartsFromDate(shifted({ hours: 23, minutes: 59, seconds: 50 }, now));
  assert.deepEqual(parts, { hours: 23, minutes: 59, seconds: 50 });
});

test("the offset is whole seconds, so ticks stay on the real second boundaries", () => {
  const now = new Date(2026, 5, 15, 10, 15, 42, 700);
  const offset = offsetToReach({ hours: 7, minutes: 58, seconds: 30 }, now);
  assert.ok(offset % 1000 === 0); // not assert.equal: a negative offset gives -0
  assert.equal(shifted({ hours: 7, minutes: 58, seconds: 30 }, now).getMilliseconds(), 700);
});
