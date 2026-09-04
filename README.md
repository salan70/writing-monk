# writing-monk

A repository-first framework for iteratively personalizing AI-generated writing from human feedback.

`writing-monk` treats the full loop — request → draft → feedback → revision → acceptance — as first-class data. It preserves evidence, extracts observations, evolves writing preferences, and feeds those preferences back into future AI-agent writing.

## Goals

- Preserve raw writing/review history without collapsing it into vague "memory".
- Separate observed evidence from inferred preferences.
- Keep every preference traceable back to concrete cases and feedback.
- Support context-specific writing preferences instead of one global style prompt.
- Work with coding agents such as Codex, Claude Code, and Cursor.
- Keep personal writing data local by default, even when this repository is public.

## Core loop

```text
request
  ↓
generation
  ↓
human feedback / edit
  ↓
revision
  ↓
acceptance
  ↓
semantic diff
  ↓
observations
  ↓
preference candidates
  ↓
preference evolution
  ↓
writing profile
  ↓
next generation
```

## Repository layout

```text
.
├── AGENTS.md
├── CLAUDE.md
├── .agents/
│   └── skills/
├── config/
├── docs/
├── examples/
├── schemas/
├── src/
└── workspace/        # local personal data; ignored by Git
```

The public repository contains the framework, schemas, examples, and agent instructions. Personal cases, preferences, profiles, and reports belong under `workspace/` and are ignored by Git.

## Data model

A case is modeled as an event stream plus Markdown artifacts:

```text
workspace/cases/<case-id>/
├── case.yaml
├── events.jsonl
├── artifacts/
│   ├── draft-001.md
│   ├── revision-001.md
│   └── final.md
└── analysis/
    ├── semantic-diff.json
    ├── observations.yaml
    └── preference-candidates.yaml
```

- **Markdown**: long-form writing artifacts.
- **JSONL**: append-oriented event history.
- **YAML**: human-readable metadata and structured analysis.
- **JSON Schema**: machine validation contracts.

## Agent skills

The canonical skills live in `.agents/skills/`:

- `personalized-writing`
- `analyze-case`
- `evolve-preferences`
- `evaluate-writing`

`AGENTS.md` is the canonical repository instruction file. `CLAUDE.md` imports it for Claude Code.

## CLI

The initial CLI is intentionally local-first and does not call an LLM API. AI reasoning is delegated to the active agent.

Planned commands:

```bash
pnpm monk new
pnpm monk validate
pnpm monk profile
pnpm monk stats
```

## Public repository / private data

Do not commit real user cases or inferred writing preferences to this repository.

The default `.gitignore` excludes:

```text
workspace/
```

Use `examples/` for synthetic, non-sensitive fixtures only.

## MVP principles

1. Raw evidence is immutable in spirit.
2. Observations are distinct from interpretations.
3. Preferences require evidence.
4. Counter-evidence is retained.
5. Preferences are scoped by context.
6. Profile versions are explicit.
7. Automatic preference mutation is avoided; agents propose changes and humans review them.
8. Every generated artifact records the profile version and applied preferences when possible.

## Status

Initial MVP scaffold.
