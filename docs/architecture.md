# Architecture

## Layers

`writing-monk` separates five layers.

### 1. Raw history

Authoritative source data:
- requests
- AI generations
- human feedback
- human edits
- acceptance / rejection events

### 2. Observations

Concrete descriptions of what changed.

Example:

> The phrase "very important" was removed and replaced by a technically specific statement.

This is still evidence-oriented and should avoid broad personality claims.

### 3. Preference hypotheses

Generalizations inferred from observations.

Example:

> Avoid rhetorical emphasis that does not add technical meaning.

Hypotheses carry confidence, scope, supporting evidence, and counter-evidence.

### 4. Accepted preferences

Reviewed preferences that can influence future generation.

### 5. Generated writing profile

A compact artifact optimized for agent consumption.

The profile is derived data. It is not the canonical evidence store.

## Why event streams

Writing review is naturally sequential:

```text
request → generation → feedback → generation → human edit → accept
```

`events.jsonl` keeps this sequence append-friendly while allowing artifacts themselves to remain readable Markdown files.

## Why not one large JSON document

Long-form prose becomes difficult to read, diff, and edit when escaped inside JSON. The repository therefore stores text artifacts separately and references them from structured events.

## Profile versioning

Each generated profile should have an explicit integer version.

Cases should record the profile version used during generation whenever possible. This allows later evaluation of whether profile changes actually improved first-draft acceptance, edit ratio, or revision count.

## Agent independence

The storage model should not depend on a single vendor or model. Agent-specific metadata may be recorded, but preferences must not be conflated with quirks from one model.
