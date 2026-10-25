import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildClock, OUTPUT } from "../scripts/build.mjs";

test("clock.html is up to date (run `npm run build` if this fails)", () => {
  assert.equal(readFileSync(OUTPUT, "utf8"), buildClock());
});

test("clock.html needs nothing else to run", () => {
  const html = buildClock();
  assert.doesNotMatch(html, /<link rel="stylesheet"/);
  assert.doesNotMatch(html, /<script[^>]*\ssrc=/);
  assert.doesNotMatch(html, /^(import|export)\b/m);
});
