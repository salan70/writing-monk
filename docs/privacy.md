# Privacy and public-repository policy

This repository is intended to be public while the user's actual writing history remains private.

## Never commit

- real prompts containing private information
- real feedback
- human-edited drafts
- inferred personal preferences
- generated writing profiles
- private reports or metrics containing excerpts

All operational data belongs under:

```text
workspace/
```

and `workspace/` is ignored by Git.

## Safe to commit

- schemas
- source code
- synthetic examples
- generic skills
- generic documentation
- tests built from synthetic fixtures

## If a real case is useful as an example

Create a new synthetic fixture that demonstrates the same structural behavior without preserving the original wording or identifying context.
