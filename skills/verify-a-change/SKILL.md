---
name: verify-a-change
description: Verify changed behaviour proportionately and report the result with its limits.
---

## Inputs
The intended behaviour, changed files or release, environment, and a reproducible acceptance condition.

## Steps
1. State what success should look like and which regression would matter.
2. Run the narrowest meaningful check for the changed behaviour.
3. For a UI change, inspect the actual interaction and resulting state. HTTP 200 alone is not UI verification.
4. Record the version, environment and observed result. Keep failures and uncertainty visible.
5. Broaden checks only when a failure, new change or unresolved concern justifies it.
6. Stop once the acceptance condition is supported. Separate local, deployed and verified-live status.

## Output
Change. Version and environment. Check performed. Observed result. Remaining limits.

## Synthetic example
Change: a reset button clears a filter.
Check: apply a filter, reset it, inspect the input and visible results.
Result: report what changed in the UI, not merely that the button was clicked.

## Limits
A passing check covers its tested conditions. It is not proof that every environment or edge case works.
