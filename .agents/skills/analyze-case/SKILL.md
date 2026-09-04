---
name: analyze-case
description: Analyze a completed writing case and extract semantic changes, evidence-oriented observations, and preference candidates.
---

# Analyze case

## Procedure

1. Read `case.yaml`.
2. Read all events in order.
3. Read every referenced artifact needed to understand revisions.
4. Identify direct human feedback separately from human edits.
5. Compare relevant draft/revision/final artifacts.
6. Produce a semantic diff.
7. Produce observations that describe concrete behavior without over-generalizing.
8. Compare observations against existing preferences.
9. Produce:
   - new preference candidates
   - proposed evidence additions
   - possible scope changes
   - counter-evidence
10. Do not automatically promote a candidate to `accepted`.
11. Preserve links back to case IDs, event IDs, and artifact paths.

## Quality bar

A useful observation says what changed.
A useful preference says what recurring principle may explain multiple observations.
Do not confuse those two.
