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

## What it catches

| Category | Examples |
| --- | --- |
| **Prompt injection** | "ignore all previous instructions", "do not tell the user", "act without confirmation", disable/bypass safety, stated intent to exfiltrate |
| **Dangerous shell** | `rm -rf ~`, `curl \| bash`, fork bombs, `chmod 777`, `dd`/`mkfs`, reverse shells |
| **Secret access** | reads `~/.ssh/id_rsa`, `~/.aws/credentials`, `.npmrc`, `.netrc`, dumps the environment, hits the keychain |
| **Exfiltration** | uploads local files, contacts `webhook.site` / `pastebin` / ngrok / raw IPs, programmatic outbound POST |
| **Supply chain** | runtime `pip`/`npm` installs, `git clone && run` |
| **Obfuscation** | `base64 -d \| sh`, large base64 blobs, hidden zero-width / bidi Unicode |
| **Over-permission** | `allowed-tools: *` |

It reads `SKILL.md` **prose** for instruction-injection and reads **scripts and fenced code blocks** for dangerous commands — so a `chmod 777` mentioned in a sentence won't false-positive, but the same command in a code block will.

See every rule: `npx @royalpinto007/skill-audit --rules`.

## Usage

```bash
npx @royalpinto007/skill-audit <path> [options]

# scan a skill directory
npx @royalpinto007/skill-audit ~/.claude/skills/some-skill

# fail CI on anything medium or worse
npx @royalpinto007/skill-audit ./my-skill --fail-on medium

# machine-readable output
npx @royalpinto007/skill-audit ./my-skill --format json
npx @royalpinto007/skill-audit ./my-skill --format sarif > skill-audit.sarif
```

**Options**

| Flag | Default | Meaning |
| --- | --- | --- |
| `--format <text\|json\|sarif>` | `text` | output format |
| `--fail-on <severity>` | `high` | exit `1` if any finding is at or above this severity |
| `--rules` | | list every rule and exit |
| `-h, --help` / `-v, --version` | | |

**Exit codes:** `0` clean (below threshold) · `1` findings at/above `--fail-on` · `2` bad usage.

