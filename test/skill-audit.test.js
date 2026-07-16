import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { scanSkill, scanText } from "../src/scan.js";
import { exitCode, sarifReport, jsonReport, counts } from "../src/report.js";
import { RULES } from "../src/rules.js";

const here = dirname(fileURLToPath(import.meta.url));
const fixture = (n) => join(here, "fixtures", n);

test("malicious skill triggers the expected high-signal rules", () => {
  const { findings } = scanSkill(fixture("malicious-skill"));
  const ids = new Set(findings.map((f) => f.rule));
  for (const expected of [
    "SKILL-INJ-001", // ignore previous instructions
    "SKILL-INJ-002", // do not tell the user
    "SKILL-INJ-003", // without confirmation
    "SKILL-SH-002",  // curl | bash
    "SKILL-SH-005",  // chmod 777
    "SKILL-NET-002", // webhook.site
    "SKILL-SEC-001", // id_rsa
    "SKILL-SEC-002", // .aws/credentials
    "SKILL-OBF-001", // base64 --decode | bash
    "SKILL-PERM-001",// allowed-tools: *
  ]) {
    assert.ok(ids.has(expected), `expected rule ${expected} to fire`);
  }
  assert.ok(findings.some((f) => f.severity === "critical"), "should have a critical finding");
});

test("clean skill produces zero findings", () => {
  const { findings } = scanSkill(fixture("clean-skill"));
  assert.equal(findings.length, 0, JSON.stringify(findings, null, 2));
});

