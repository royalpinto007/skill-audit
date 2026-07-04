// Rule catalogue for skill-audit.
// Each rule: { id, severity, category, title, appliesTo, remediation, pattern? , detect? }
//  - appliesTo: "prose" (markdown text), "code" (scripts + md code blocks), or "any"
//  - pattern: a global RegExp; every match becomes a finding
//  - detect: (text) => [{ index, match }]  for checks a single regex can't express
//
// Severity ladder: critical > high > medium > low > info

export const SEVERITY_ORDER = ["info", "low", "medium", "high", "critical"];

const ZERO_WIDTH = /[​‌‍﻿⁠‪-‮⁦-⁩]/g;

export const RULES = [
  // ---- Prompt injection / instruction override hidden in the skill's prose ----
  { id: "SKILL-INJ-001", severity: "high", category: "prompt-injection", appliesTo: "prose",
    title: "Instruction override ('ignore previous instructions')",
    remediation: "A skill should describe a capability, not tell the agent to discard its own rules.",
    pattern: /ignore\s+(all\s+|any\s+)?(the\s+)?(prior|previous|above|earlier)\s+(instructions|rules|prompts|guidelines)/gi },

  { id: "SKILL-INJ-002", severity: "high", category: "prompt-injection", appliesTo: "prose",
    title: "Directs the agent to hide activity from the user",
    remediation: "Skills must not instruct the agent to conceal what it does from the user.",
    // [^.]{0,25} (not [^.\n]) so a line-wrapped "do not tell the\nuser" is still caught.
    pattern: /(do\s*not|don'?t|never)\s+(tell|inform|show|reveal|mention|notify|alert)\b[^.]{0,25}\buser/gi },

  { id: "SKILL-INJ-003", severity: "high", category: "prompt-injection", appliesTo: "prose",
    title: "Instructs the agent to act without confirmation",
    remediation: "Destructive or sensitive actions should keep a human confirmation step; a skill removing it is a red flag.",
    pattern: /(without\s+(asking|confirmation|permission|approval)|do\s*not\s+ask|no\s+need\s+to\s+(ask|confirm)|skip\s+(the\s+)?confirmation)/gi },

  { id: "SKILL-INJ-004", severity: "medium", category: "prompt-injection", appliesTo: "prose",
    title: "Tells the agent to disable or bypass safety",
    remediation: "Legit skills never ask the agent to turn off guardrails, moderation, or security checks.",
    pattern: /(disable|bypass|turn\s+off|ignore|override)\b[^.\n]{0,25}(safety|guardrail|security|moderation|filter|policy)/gi },

  { id: "SKILL-INJ-005", severity: "critical", category: "prompt-injection", appliesTo: "any",
    title: "Stated intent to exfiltrate secrets",
    remediation: "The skill text describes sending secrets/tokens/credentials somewhere. Treat as malicious until proven otherwise.",
    pattern: /(exfiltrate|leak|send|upload|post|forward)\b[^.\n]{0,30}(secret|token|password|credential|private\s*key|api[\s_-]?key|\.env)/gi },

  { id: "SKILL-INJ-006", severity: "high", category: "obfuscation", appliesTo: "any",
    title: "Hidden zero-width or bidirectional Unicode",
    remediation: "Invisible characters are used to smuggle instructions past human review. Remove them.",
    detect: (t) => matchesOf(t, ZERO_WIDTH) },

  { id: "SKILL-INJ-007", severity: "medium", category: "prompt-injection", appliesTo: "prose",
    title: "Auto-run / always-execute directive",
    remediation: "A skill should run on demand, not command the agent to always/automatically execute things.",
    pattern: /(always|automatically|on\s+every\s+(message|turn|request))\s+(run|execute|invoke|call)\b/gi },


];

function matchesOf(text, re) {
  const out = [];
  let m;
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  while ((m = g.exec(text)) !== null) {
    out.push({ index: m.index, match: m[0] });
    if (m.index === g.lastIndex) g.lastIndex++;
  }
  return out;
}

export { matchesOf };
