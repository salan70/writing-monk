---
name: evolve-preferences
description: Review accumulated observations and propose evidence-backed changes to the user's writing preferences.
---

# Evolve preferences

## Procedure

1. Read new observations and preference candidates.
2. Load existing preferences in relevant scopes.
3. Detect duplicates and near-duplicates.
4. For each affected preference, evaluate:
   - supporting evidence
   - diversity of cases
   - contextual consistency
   - counter-evidence
   - possible narrower scope
5. Propose one of:
   - create
   - merge
   - increase confidence
   - decrease confidence
   - narrow scope
   - broaden scope
   - deprecate
   - no change
6. Keep provenance intact.
7. Do not delete evidence history.
8. Require explicit human review before accepted-preference changes are finalized.

## Avoid

- treating one edit as a permanent style rule
- interpreting agent-specific verbosity as a universal user preference
- creating many tiny synonymous preferences
