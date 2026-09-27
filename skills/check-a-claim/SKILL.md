---
name: check-a-claim
description: Compare a draft claim with supplied evidence and identify unsupported wording.
---

## Inputs
A draft, public or authorized source excerpts, exact source URLs, and their observation dates.

## Steps
1. Split the draft into concrete claims. Keep opinions separate from factual claims.
2. For each claim, cite the supporting excerpt or mark it unsupported or contradicted.
3. Preserve the source's scope, date, sample size and stated limitations.
4. Distinguish implemented, tested, deployed and verified live.
5. Flag missing attribution, vague hype and wording that exceeds the evidence.
6. Return findings for the author to review. Do not publish or silently rewrite the draft.

## Output
Claim. Source. Supported, unsupported or contradicted. Missing evidence or qualification.

## Synthetic example
Draft: the feature works on every phone.
Evidence: one desktop browser check.
Finding: unsupported. Mobile behaviour has not been established.

## Limits
An excerpt match does not establish that the source is true or current. This does not detect authorship or replace independent fact checking.
