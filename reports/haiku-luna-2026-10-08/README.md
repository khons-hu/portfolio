# Haiku 5.5 vs GPT-6 Luna: a practical workflow evaluation

Completed 8 October 2026. Shared here 9 October 2026.

I compared Haiku 5.5 in native Claude desktop Code with GPT-6 Luna in Codex CLI on 24 frozen synthetic Python and structured-text tasks. Two fresh repeats at Low and Max produced 192 primary outcomes. The evidence keeps unsuccessful tasks, timeouts and runtime identity limits visible.

## Task successes within the deadline

| Workflow | Low | Max |
| --- | ---: | ---: |
| Haiku 5.5 / native desktop Code | 48/48 | 44/48 |
| GPT-6 Luna / Codex CLI | 33/48 | 48/48 |

Haiku Max had four timeouts. All 44 completed graded responses passed, while the four timeouts remain unsuccessful outcomes. Three timeouts have no returned model or effort metadata. One requested-Max run returned Low, so a predeclared replacement preserves the 192 primary outcomes across 193 physical attempts. The original attempt remains in the evidence ledger.

## What these results cover

The hosts, tools, context, prompt envelopes and timing boundaries differ. Low and Max labels do not establish equal compute. OpenAI-based agents authored the suite, so task-selection bias remains. Luna Max saturated this suite. Two repeats across 24 designed tasks provide narrow evidence.

These results describe the recorded workflows. They establish no overall model winner, intrinsic speed comparison or cost advantage. Luna identity uses exact requested pins and catalog evidence without an independently returned provider model ID. This evaluation does not reproduce Anthropic's advertised benchmarks.

## Report and evidence

- [Read the original full report](report.md)
- [Download all 192 primary outcomes as CSV](results.csv)
- [Download the sanitized evidence ZIP](shareable-evidence.zip)

These files are the unchanged **8 October snapshot**. The original report and ZIP refer to an unpublished Unbenchmark draft. That wording describes their creation and the separate Unbenchmark update, which failed at the last recorded check on 8 October at 21:35 UTC. The completed report is now public here. The earlier Unbenchmark checkpoint does not contain these full results.

The ZIP contains only the six-file sanitized allowlist. Raw transcripts, prompts, responses, thinking, screenshots, host context and hidden tests are excluded. It is a result archive, not a standalone reproduction kit. Hashes support provenance without independently proving correctness.

ZIP SHA-256: `2b736b47d2f5754d1be82c72810d33bcf1456c59801e03534f8e3b4dedffed47`.
