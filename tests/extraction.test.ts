import assert from "node:assert/strict";
import { test } from "node:test";
import { extractBlueprintDeterministically as extract } from "../src/engine/extraction";

test("ordinary words do not create artificial AI, API or ML requirements", () => {
  const result = extract("Build a retail website with email signup and rapid checkout");
  assert.ok(!result.requiredCapabilities.includes("ML"));
  assert.ok(!result.requiredCapabilities.includes("Backend"));
});

test("explicit AI, APIs and cloud requirements are still detected", () => {
  const result = extract("Build an AI dashboard with APIs and AWS deployment in 1 week for 5 members");
  for (const domain of ["ML", "Frontend", "Backend", "Cloud"]) {
    assert.ok(result.requiredCapabilities.includes(domain));
  }
  assert.equal(result.timeline, "1 week");
  assert.equal(result.teamSize, 5);
});

test("singular and plural numeric timelines agree", () => {
  assert.equal(extract("Build a tool in 1 month").timeline, "1 month");
  assert.equal(extract("Build a tool in two weeks").timeline, "2 weeks");
});
