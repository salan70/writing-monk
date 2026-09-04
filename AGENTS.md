# AGENTS.md

## Purpose

This repository implements `writing-monk`: a local-first personalization framework for AI-assisted writing.

The system learns from human review history while preserving provenance and avoiding premature over-generalization.

## Non-negotiable principles

1. Never rewrite or summarize away raw human feedback when storing evidence.
2. Keep raw evidence, observations, preference hypotheses, accepted preferences, and generated profiles as separate layers.
3. Never promote a one-off edit directly into a global rule.
4. Every preference must retain links to supporting evidence.
5. Retain counter-evidence when it exists.
6. Scope preferences by context when appropriate.
7. Do not silently mutate accepted preferences. Propose changes and make the change explicit.
8. Personal data belongs under `workspace/` and must not be committed.
9. Synthetic examples belong under `examples/`.
10. The repository itself must not require an LLM API for core storage/validation operations.

## Canonical data flow

```text
case events
→ semantic diff
→ observations
→ preference candidates
→ reviewed preferences
→ generated writing profile
→ personalized generation
```

## Storage conventions

### Case metadata

Use `case.yaml`.

### Event history

Use append-oriented `events.jsonl`.

Each event must have:
- `id`
- `type`
- `actor`
- `created_at`

Relationships between events should be explicit via `parent`, `target`, or both.

### Writing artifacts

Store long-form text as Markdown under `artifacts/`.

Do not embed substantial documents as escaped JSON strings.

### Analysis

Store machine-readable semantic diffs in JSON.
Store observations and preference candidates as YAML unless a specific consumer requires JSON.

## Provenance

A preference should be traceable through:

```text
preference
→ observation
→ case/event
→ raw human feedback or edit
```

## Preference lifecycle

Supported conceptual states:

```text
candidate
→ hypothesis
→ accepted
→ deprecated
```

Do not infer promotion solely from a fixed numeric threshold. Evidence count, diversity of contexts, consistency, and counter-evidence matter.

## Agent behavior

When generating writing:
1. Classify the writing context.
2. Load the relevant writing profile and preference evidence.
3. Prefer context-specific preferences over generic ones when they conflict.
4. Record which preferences were intentionally applied.
5. Do not imitate superficial phrasing from past examples when a general preference explains the same evidence.

When analyzing a case:
1. Read the request, drafts, feedback, human edits, and final artifact.
2. Distinguish direct feedback from inferred interpretation.
3. Produce semantic changes.
4. Convert changes into observations.
5. Compare observations against existing preferences.
6. Produce preference candidates or proposed updates.
7. Preserve counter-evidence.

When evolving preferences:
1. Never edit raw evidence.
2. Consider multiple cases.
3. Prefer merging duplicate concepts over creating near-duplicate rules.
4. Decrease confidence or narrow scope when counter-evidence appears.
5. Deprecate obsolete preferences instead of deleting their history.

## Public repository safety

Before committing:
- Ensure no real `workspace/` content is staged.
- Ensure examples contain no private text.
- Ensure generated reports do not include personal writing samples.
