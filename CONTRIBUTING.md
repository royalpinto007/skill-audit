# Contributing to Skill-audit

Thanks for helping improve **Skill-audit**. Bug reports, fixes, and features are all welcome.

## Getting set up

```bash
git clone https://github.com/royalpinto007/Skill-audit
cd Skill-audit
npm test    # runs `node --test`, zero dependencies
```

## How to run it

Run it locally with: `npx @royalpinto007/skill-audit ./some-skill`.

## Ways to contribute

Add or refine a rule in `src/rules.js` (each rule has a stable `SKILL-XXX` id, a severity, and a remediation line), then cover it with a fixture in `test/`.

## Pull requests

1. Fork and branch from `main`.
2. Make one focused change per PR.
3. Add or update tests; keep them green.
4. Bump the version and add a `CHANGELOG.md` entry.
5. Open a PR using the template.

## Style

- Match the surrounding code — this project is intentionally **zero-dependency**, so please don't add runtime dependencies.
- Keep it small, honest, and well-scoped.

Questions? Open an issue.
