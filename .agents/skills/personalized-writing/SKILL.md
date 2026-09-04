---
name: personalized-writing
description: Generate writing using the user's accepted writing preferences and relevant prior evidence.
---

# Personalized writing

## Input

A writing request from the user.

## Procedure

1. Determine the writing context and audience.
2. Read the current generated writing profile if available.
3. Load accepted preferences relevant to the context.
4. Prefer narrower context-specific preferences over global ones when they conflict.
5. Optionally inspect a small number of relevant past cases when the profile is insufficient.
6. Generate the draft.
7. Record:
   - profile version used
   - preference IDs intentionally applied
   - agent/tool metadata when available
8. Never invent a preference that is not present in the accepted profile during the generation step.

## Output

The requested writing plus enough case metadata to preserve provenance.
