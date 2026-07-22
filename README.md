# skill-audit

**A security scanner for agent skills.** Scan a Claude/agent Skill for prompt-injection, dangerous shell, secret access, and network exfiltration **before you trust it** — one command, zero dependencies, SARIF output for CI.

```bash
npx @royalpinto007/skill-audit ./path-to-skill
```

[![npm](https://img.shields.io/npm/v/@royalpinto007/skill-audit.svg)](https://www.npmjs.com/package/@royalpinto007/skill-audit) [![CI](https://github.com/royalpinto007/skill-audit/actions/workflows/ci.yml/badge.svg)](https://github.com/royalpinto007/skill-audit/actions) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Why

Agent **skills** are the new plugin. A skill is a `SKILL.md` plus scripts that an agent will **read as instructions and execute** — and people install them from GitHub, gists, and marketplaces with zero review. That is an unguarded supply chain: a skill can quietly tell the agent to *ignore its own rules*, `curl | bash` a payload, read your `~/.ssh` keys, or POST your `.env` to a webhook, and nothing checks for it.

`skill-audit` is `npm audit` for skills. Point it at a skill and it flags the patterns that should stop you from installing it.

