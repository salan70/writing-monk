# Data model

## Case

A case represents one writing task and its revision history.

Required conceptual fields:
- `id`
- `created_at`
- `status`
- task context
- optional agent metadata
- optional profile version

## Event

Events are append-oriented records.

Initial event types:
- `request`
- `generation`
- `feedback`
- `revision`
- `human_edit`
- `accept`
- `reject`
- `analysis`

## Artifact

Long-form text referenced by an event.

Recommended location:

```text
artifacts/<kind>-<sequence>.md
```

## Semantic diff

A structured interpretation of meaningful changes between two artifacts.

A semantic change can include:
- wording change
- deletion
- insertion
- restructuring
- tone shift
- specificity shift
- audience adaptation
- reasoning change

## Observation

An evidence-oriented statement derived from one or more concrete changes.

Observations should avoid unsupported claims about permanent user preferences.

## Preference

A reusable writing preference.

Important fields:
- `id`
- `statement`
- `status`
- `confidence`
- `scope`
- `positive_evidence`
- `counter_evidence`
- timestamps

## Profile

A generated summary of currently accepted preferences.

The profile is derived and versioned.
