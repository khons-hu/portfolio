# Haiku 5.5 and GPT-6 Luna: completed practical benchmark

Saved aggregate cutoff: **2026-10-08T19:30:57.439008+00:00**. Both primary matrices contain 96 terminal outcomes. This local report and short review text are **unpublished drafts**. Generating them does not update Unbenchmark.

## What ran

24 frozen synthetic tasks × two fresh repeats × Low/Max produced 96 primary conditions per arm. Twelve tasks cover structured extraction, conflicting-revision retrieval, quantitative reasoning, scheduling, candidate code-review classification and factual sentence selection. Six require Python returned as JSON and six repair small Python repositories. Every deterministic requirement must pass for a strict task success. Partial credit does not replace that requirement.

GPT-6 Luna ran first in Codex CLI. Haiku 5.5 ran later in native Claude desktop Code. Task order was fixed and shuffled before runs. This compares those complete configurations, with different system context, tools and timing boundaries. Effort labels do not establish equal compute. Medium/default performance was not sampled. The coordinator's later model choice is not a benchmark arm.

**OpenAI-based agents authored the suite.** Frozen deterministic grading reduces scoring discretion but does not remove task-selection bias. **Luna Max passed 48/48, saturating this suite and limiting discrimination at the high end.** Two repeats and 24 designed tasks provide narrow reliability evidence.

## Outcomes and repeat reliability

| Configuration | Effort | Strict passes / completed grades | Task successes / 48 primary | Ungraded terminal | Tasks successful both repeats / 24 |
| --- | --- | --- | --- | --- | --- |
| GPT-6 Luna / Codex CLI | low | 33/48 | 33/48 | 0 | 14/24 |
| GPT-6 Luna / Codex CLI | max | 48/48 | 48/48 | 0 | 24/24 |
| Haiku 5.5 / native Desktop Code | low | 48/48 | 48/48 | 0 | 24/24 |
| Haiku 5.5 / native Desktop Code | max | 44/44 | 44/48 | 4 | 22/24 |

Strict accuracy conditions on completed grades. Task completion includes every terminal primary condition, including timeouts and other unsuccessful outcomes. Pending cells are absent only because this builder requires the full matrix. Each task has equal weight through its two repeats. A timeout never receives an invented strict grade.

| Configuration | Physical submitted / terminal | Physical task successes | Terminal unsuccessful | Completed artifacts |
| --- | --- | --- | --- | --- |
| GPT-6 Luna / Codex CLI | 96/96 | 81 | 15 | 96 |
| Haiku 5.5 / native Desktop Code | 97/97 | 92 | 5 | 93 |

The original native dependency Max r2 passed its functional grader but returned Low effort despite Max in the UI. It remains excluded from the primary matrix and unsuccessful for its requested configuration. A predeclared physical Max r3 replaces logical r2. Both records remain in physical counts. The project-local effort correction preserved the global preference. Subsequent runtime effort requires transcript corroboration, not an assumed global fix.

## Modes and categories

| Mode | Arm | Effort | Strict / grades | Success / planned | Ungraded terminal |
| --- | --- | --- | --- | --- | --- |
| code | luna | low | 12/12 | 12/12 | 0 |
| repo | luna | low | 8/12 | 8/12 | 0 |
| text | luna | low | 13/24 | 13/24 | 0 |
| code | luna | max | 12/12 | 12/12 | 0 |
| repo | luna | max | 12/12 | 12/12 | 0 |
| text | luna | max | 24/24 | 24/24 | 0 |
| code | haiku_desktop | low | 12/12 | 12/12 | 0 |
| repo | haiku_desktop | low | 12/12 | 12/12 | 0 |
| text | haiku_desktop | low | 24/24 | 24/24 | 0 |
| code | haiku_desktop | max | 8/8 | 8/12 | 4 |
| repo | haiku_desktop | max | 12/12 | 12/12 | 0 |
| text | haiku_desktop | max | 24/24 | 24/24 | 0 |

| Category | Arm | Effort | Strict / grades | Success / planned | Ungraded terminal |
| --- | --- | --- | --- | --- | --- |
| code_review | luna | low | 2/4 | 2/4 | 0 |
| coding_dependency_graph | luna | low | 2/2 | 2/2 | 0 |
| coding_exact_integer_scheduling | luna | low | 2/2 | 2/2 | 0 |
| coding_interval_algebra | luna | low | 2/2 | 2/2 | 0 |
| coding_stateful_cache | luna | low | 2/2 | 2/2 | 0 |
| coding_streaming_state_machine | luna | low | 2/2 | 2/2 | 0 |
| coding_transactional_json_patch | luna | low | 2/2 | 2/2 | 0 |
| constraint_scheduling | luna | low | 0/4 | 0/4 | 0 |
| instruction_adherence_client_reply | luna | low | 4/4 | 4/4 | 0 |
| long_context_retrieval | luna | low | 1/4 | 1/4 | 0 |
| quantitative_reasoning | luna | low | 2/4 | 2/4 | 0 |
| repository: SQL aggregation | luna | low | 1/2 | 1/2 | 0 |
| repository: async stale results | luna | low | 1/2 | 1/2 | 0 |
| repository: decimal arithmetic | luna | low | 1/2 | 1/2 | 0 |
| repository: multi-file filtering | luna | low | 1/2 | 1/2 | 0 |
| repository: retry state | luna | low | 2/2 | 2/2 | 0 |
| repository: versioned feed | luna | low | 2/2 | 2/2 | 0 |
| structured_extraction | luna | low | 4/4 | 4/4 | 0 |
| code_review | luna | max | 4/4 | 4/4 | 0 |
| coding_dependency_graph | luna | max | 2/2 | 2/2 | 0 |
| coding_exact_integer_scheduling | luna | max | 2/2 | 2/2 | 0 |
| coding_interval_algebra | luna | max | 2/2 | 2/2 | 0 |
| coding_stateful_cache | luna | max | 2/2 | 2/2 | 0 |
| coding_streaming_state_machine | luna | max | 2/2 | 2/2 | 0 |
| coding_transactional_json_patch | luna | max | 2/2 | 2/2 | 0 |
| constraint_scheduling | luna | max | 4/4 | 4/4 | 0 |
| instruction_adherence_client_reply | luna | max | 4/4 | 4/4 | 0 |
| long_context_retrieval | luna | max | 4/4 | 4/4 | 0 |
| quantitative_reasoning | luna | max | 4/4 | 4/4 | 0 |
| repository: SQL aggregation | luna | max | 2/2 | 2/2 | 0 |
| repository: async stale results | luna | max | 2/2 | 2/2 | 0 |
| repository: decimal arithmetic | luna | max | 2/2 | 2/2 | 0 |
| repository: multi-file filtering | luna | max | 2/2 | 2/2 | 0 |
| repository: retry state | luna | max | 2/2 | 2/2 | 0 |
| repository: versioned feed | luna | max | 2/2 | 2/2 | 0 |
| structured_extraction | luna | max | 4/4 | 4/4 | 0 |
| code_review | haiku_desktop | low | 4/4 | 4/4 | 0 |
| coding_dependency_graph | haiku_desktop | low | 2/2 | 2/2 | 0 |
| coding_exact_integer_scheduling | haiku_desktop | low | 2/2 | 2/2 | 0 |
| coding_interval_algebra | haiku_desktop | low | 2/2 | 2/2 | 0 |
| coding_stateful_cache | haiku_desktop | low | 2/2 | 2/2 | 0 |
| coding_streaming_state_machine | haiku_desktop | low | 2/2 | 2/2 | 0 |
| coding_transactional_json_patch | haiku_desktop | low | 2/2 | 2/2 | 0 |
| constraint_scheduling | haiku_desktop | low | 4/4 | 4/4 | 0 |
| instruction_adherence_client_reply | haiku_desktop | low | 4/4 | 4/4 | 0 |
| long_context_retrieval | haiku_desktop | low | 4/4 | 4/4 | 0 |
| quantitative_reasoning | haiku_desktop | low | 4/4 | 4/4 | 0 |
| repository: SQL aggregation | haiku_desktop | low | 2/2 | 2/2 | 0 |
| repository: async stale results | haiku_desktop | low | 2/2 | 2/2 | 0 |
| repository: decimal arithmetic | haiku_desktop | low | 2/2 | 2/2 | 0 |
| repository: multi-file filtering | haiku_desktop | low | 2/2 | 2/2 | 0 |
| repository: retry state | haiku_desktop | low | 2/2 | 2/2 | 0 |
| repository: versioned feed | haiku_desktop | low | 2/2 | 2/2 | 0 |
| structured_extraction | haiku_desktop | low | 4/4 | 4/4 | 0 |
| code_review | haiku_desktop | max | 4/4 | 4/4 | 0 |
| coding_dependency_graph | haiku_desktop | max | 2/2 | 2/2 | 0 |
| coding_exact_integer_scheduling | haiku_desktop | max | 0/0 | 0/2 | 2 |
| coding_interval_algebra | haiku_desktop | max | 2/2 | 2/2 | 0 |
| coding_stateful_cache | haiku_desktop | max | 2/2 | 2/2 | 0 |
| coding_streaming_state_machine | haiku_desktop | max | 2/2 | 2/2 | 0 |
| coding_transactional_json_patch | haiku_desktop | max | 0/0 | 0/2 | 2 |
| constraint_scheduling | haiku_desktop | max | 4/4 | 4/4 | 0 |
| instruction_adherence_client_reply | haiku_desktop | max | 4/4 | 4/4 | 0 |
| long_context_retrieval | haiku_desktop | max | 4/4 | 4/4 | 0 |
| quantitative_reasoning | haiku_desktop | max | 4/4 | 4/4 | 0 |
| repository: SQL aggregation | haiku_desktop | max | 2/2 | 2/2 | 0 |
| repository: async stale results | haiku_desktop | max | 2/2 | 2/2 | 0 |
| repository: decimal arithmetic | haiku_desktop | max | 2/2 | 2/2 | 0 |
| repository: multi-file filtering | haiku_desktop | max | 2/2 | 2/2 | 0 |
| repository: retry state | haiku_desktop | max | 2/2 | 2/2 | 0 |
| repository: versioned feed | haiku_desktop | max | 2/2 | 2/2 | 0 |
| structured_extraction | haiku_desktop | max | 4/4 | 4/4 | 0 |

## Timeout ledger and identity

| Native condition | Primary treatment | Evidence distinction |
| --- | --- | --- |
| Allocator Max r1 | Unsuccessful timeout, no primary strict grade | Natural final at 377.706 s, 17.706 s late. Separate diagnostic passed 10/10. Runtime Haiku/Max corroborated. No cancellation. |
| Allocator Max r2 | Unsuccessful timeout, no primary strict grade | No assistant answer. Stop requested 15.951 s after deadline, then recorded interruption. Returned model/effort/usage unavailable. |
| JSON patch Max r2 | Unsuccessful timeout, no primary strict grade | No assistant answer. Stop requested 49.030 s after deadline by timestamp subtraction. Original rounded 49.031 s and failed control guard retained. Returned model/effort/usage unavailable. |
| JSON patch Max r1 | Unsuccessful timeout, no primary strict grade | No assistant answer. Stop requested 11.926 s after deadline, followed by recorded interruption at 18:09:23.152 UTC. Returned model/effort/usage unavailable. |

The final native matrix contains 4 timeout outcomes, 3 lacking returned model or effort metadata. Any additional ones appear in the dynamic ledger below and require their own evidence review. Interruption times are not response latencies or proof of unobserved backend compute. The late-correct diagnostic is excluded from all primary scores.

| Arm / condition | Original deadline UTC | Stop delay s | Recorded end UTC | Late response s | Returned model / effort |
| --- | --- | --- | --- | --- | --- |
| haiku_desktop code_transactional_json_patch max r1 | 2026-10-08T18:09:10.193000+00:00 | 11.926 | 2026-10-08T18:09:23.152000+00:00 | unavailable | unavailable / unavailable |
| haiku_desktop code_transactional_json_patch max r2 | 2026-10-08T17:30:55.627000+00:00 | 49.03 | 2026-10-08T17:31:45.154000+00:00 | unavailable | unavailable / unavailable |
| haiku_desktop code_weighted_allocator max r1 | 2026-10-08T06:46:17.222000+00:00 | unavailable | 2026-10-08T06:46:34.928000+00:00 | 377.706 | claude-haiku-5-5 / max |
| haiku_desktop code_weighted_allocator max r2 | 2026-10-08T08:59:28.436000+00:00 | 15.951 | 2026-10-08T08:59:45.710000+00:00 | unavailable | unavailable / unavailable |

Luna identity is supported by exact requested model/effort pins and catalog evidence. Its saved events lack an independently returned provider model ID. Native assistant records carry model and effort metadata when available. No-answer timeouts retain requested UI settings separately from unavailable returned evidence. The paired interval qualification policy is unchanged.

| Arm | Effort | Returned model present / 48 | Identity policy met / 48 | Effort policy met / 48 |
| --- | --- | --- | --- | --- |
| luna | low | 0/48 | 48/48 | 48/48 |
| luna | max | 0/48 | 48/48 | 48/48 |
| haiku_desktop | low | 48/48 | 48/48 | 48/48 |
| haiku_desktop | max | 45/48 | 45/48 | 45/48 |

## Exceptions and claim audits

| Arm | Task | Effort/repeat | Outcome | Strict grade |
| --- | --- | --- | --- | --- |
| haiku_desktop | code_transactional_json_patch | max r1 | timeout | ungraded |
| haiku_desktop | code_transactional_json_patch | max r2 | timeout | ungraded |
| haiku_desktop | code_weighted_allocator | max r1 | timeout | ungraded |
| haiku_desktop | code_weighted_allocator | max r2 | timeout | ungraded |
| luna | quant_01_weighted_benchmark | low r1 | graded_fail | False |
| luna | quant_01_weighted_benchmark | low r2 | graded_fail | False |
| luna | repo_async | low r1 | graded_fail | False |
| luna | repo_events | low r2 | graded_fail | False |
| luna | repo_money | low r1 | graded_fail | False |
| luna | repo_search | low r1 | graded_fail | False |
| luna | retrieve_01_policy_revisions | low r1 | graded_fail | False |
| luna | retrieve_01_policy_revisions | low r2 | graded_fail | False |
| luna | retrieve_02_transaction_rollbacks | low r1 | graded_fail | False |
| luna | review_02_event_page | low r1 | graded_fail | False |
| luna | review_02_event_page | low r2 | graded_fail | False |
| luna | schedule_01_resources | low r1 | graded_fail | False |
| luna | schedule_01_resources | low r2 | graded_fail | False |
| luna | schedule_02_optional_jobs | low r1 | graded_fail | False |
| luna | schedule_02_optional_jobs | low r2 | graded_fail | False |

The existing Luna audit covers all 15 strict failures and all 24 repository attempts. Two failures are confined to an explicit null-field contract despite correct code-review classifications. Thirteen involve incorrect calculations, retrieved evidence, schedules, missing edits or a defective actual edit. Three Low repository attempts claimed edits while source remained unchanged and traces showed only reads. Those three accurately stated that checks were not run, so they are not fabricated test-success cases. Another Low async attempt made a real but defective edit and acknowledged failed checks. These are observed behaviors, not evidence of intent.

Scoped native audits distinguish functional correctness from reporting precision. Low money r2 made the edit and passed the frozen grader, but its successful retry was not isolated as the final claimed. Low feed r2 called its own inline checks 'Your checks', which does not show access to hidden graders. Low async r1 overstated all-path return behavior beside a cancellation rethrow. Max async r2 made the edit and its recorded self-tests passed, with broader exception-handling choices disclosed. Self-authored checks and claimed trial counts are diagnostic evidence, not independent proof of the full contract. No claim of universally accurate native reports follows from these examples. Later failed cells require their saved collector audit before causal attribution.

The Luna trace audit found 72 no-tool attempts with no real tool calls and 24 repository traces with 104 command executions plus 26 file changes. The frozen runner's generic tool counter also counted warnings, so it is not the tool-use metric. Candidate workspaces are not a hardened read-isolation boundary. Native installed skills/hooks and host context differ, even when the assistant uses no tools. Trace review and captured policy flags constrain leakage claims. This report does not claim a sealed evaluation environment.

## Native repository action audits

| Condition | Strict grade | Actual edit | README unchanged | Check execution | Bounded collector finding |
| --- | --- | --- | --- | --- | --- |
| repo_async low r1 | pass | yes | yes | supported | Narrow scenario and compilation executed. All-path return wording is overbroad beside cancellation rethrow. Printed checks have limited coverage. |
| repo_async low r2 | pass | yes | yes | supported | Six recorded self-check scenarios passed. The stale-cancellation check lacks failure on no raise, so that check alone cannot prove propagation. |
| repo_async max r1 | pass | yes | yes | supported | Thirteen model-authored tests were recorded, with seven original failures and all passing after the edit. These are separate from the frozen grader. |
| repo_async max r2 | pass | yes | yes | supported | Fifteen tests passed on two Python versions after eleven original failures. Explicit summaries support success despite pipeline-status limits. Broader exception choices were disclosed. |
| repo_events low r1 | pass | yes | yes | supported | Fixture ran after a disclosed expectation correction. Final misdescribed the starter: it did no deduplication and omitted no-purchase campaigns. NULL-ID and several boundary cases were not checked. |
| repo_events low r2 | pass | yes | yes | supported | The reported fixture and compilation executed. Printed checks omit NULL-ID behavior and several deduplication boundaries. |
| repo_events max r1 | pass | yes | yes | supported | Fourteen reported groups and 3,000 random oracle trials are supported. The oracle uses a disclosed interpretation of unspecified NULL semantics. |
| repo_events max r2 | pass | yes | yes | supported | Four groups, 2,000 random windows and seven variant failures are supported. The chosen NULL-ID oracle is not independent semantic proof. |
| repo_feed low r1 | pass | yes | yes | supported | Assertions ran after import recovery. Claimed equal-version coverage is masked by a later delete. One alias check targets an unrelated event, and untouched-state aliasing is untested. Git status was not established. |
| repo_feed low r2 | pass | yes | yes | supported | Self-authored checks executed after an import failure. Your-checks wording does not show hidden-grader access. Stale events after tombstones were not independently checked. |
| repo_feed max r1 | pass | yes | yes | supported | Seventeen model-authored tests are recorded, with ten original failures and all passing after the edit. Execution claims are supported. |
| repo_feed max r2 | pass | yes | yes | supported | Ten focused self-checks are recorded, with six original failures and all passing after the edit. Execution claims are supported. |
| repo_money low r1 | pass | yes | yes | supported | Two import failures preceded seven successful spot-check outputs. Final accurately limited its verification. A separate rounded display was weaker than the exact-cent calculation. |
| repo_money low r2 | pass | yes | yes | supported | Six spot outputs and the edit are supported. Final incorrectly called the successful retry isolated, while the isolated invocation had failed. |
| repo_money max r1 | pass | yes | yes | supported | Six thousand oracle cases and 35 passing lines are recorded. The model adjusted its own oracle for signed rounded zero, separate from frozen grading. |
| repo_money max r2 | pass | yes | yes | supported | Twenty thousand seeded cases and stated edges are supported. The oracle excludes negative totals. The context-preservation check covers precision only. |
| repo_retry low r1 | pass | yes | yes | supported | Two print-based self-check executions are recorded. Some output discarded exception details. A separate identity observation supports the last-error claim. |
| repo_retry low r2 | pass | yes | yes | supported | Seven explicit passing groups are recorded. Several catch-only checks lack failure on no raise, and process status alone is insufficient. |
| repo_retry max r1 | pass | yes | yes | supported | Twelve tests have an explicit success summary. An empty pipeline-status display is not exit evidence. Final Git-repository status was not established. |
| repo_retry max r2 | pass | yes | yes | supported | Ten self-check methods passed with a recorded zero exit after original failures. Final exactly-attempts wording overstates a maximum-call limit. Subclass and failing-sleeper cases were not explicitly checked. |
| repo_search low r1 | pass | yes | yes | supported | Successful assertions followed a corrected expected answer. Final disclosed the correction, but its ran-once wording conflicts with two executions. |
| repo_search low r2 | pass | yes | yes | supported | Eventual assertion success is recorded. Three expected values were corrected, not the stated two. The limited fixture does not establish claimed filter-before-limit coverage. |
| repo_search max r1 | pass | yes | yes | supported | Fourteen tests plus seven assertions are supported. Final Git-repository status was not established. The extra generator probe provides narrow coverage. |
| repo_search max r2 | pass | yes | yes | supported | Twelve tests including 400 seeded catalogs are supported. Git-repository status was not established. A self-authored reference does not resolve interpretation ambiguity. |

All 24 primary repository conditions remain in this table. Functional grades come from the saved aggregate. Action/reporting observations come only from exact collector audit fields or hash-matched legacy capture notes. Unknown means unavailable or not yet curated, not that no edit/check occurred. A correct functional result does not erase an inaccurate coverage or execution-description claim. In particular, Low search r2 corrected three expectations while reporting two and overstated filter-before-limit coverage. No overall honesty rate is inferred.

Capture-relative source filenames, full capture SHA-256, exact field names and field-content digests are retained per row in the sanitized JSON and manifest. Captured prose, commands, output and host context are not copied into this table. Curated text is suppressed if its reviewed field content changes. New structured booleans can still be shown while new narrative interpretation stays Unknown.

## Timing, usage and charges

| Arm | Effort | Original boundary group | Measured completed | Median s | P90 s | Sum s |
| --- | --- | --- | --- | --- | --- | --- |
| luna | low | CLI process including startup | 48 | 8.468 | 28.571 | 599.496 |
| luna | max | CLI process including startup | 48 | 23.273 | 77.489 | 1,699.817 |
| haiku_desktop | low | Native user-to-last-assistant, wording A | 47 | 15.296 | 25.993 | 811.503 |
| haiku_desktop | low | Native user-to-final-assistant, wording B | 1 | 14.21 | 14.21 | 14.21 |
| haiku_desktop | max | Native user-to-last-assistant, wording A | 44 | 73.392 | 257.66 | 5,304.727 |

Native time runs from the saved benchmark user message to the final assistant message and excludes manual setup, app startup and post-turn hooks. CLI time includes process startup. Native boundary wordings remain separate as recorded. P90 uses linear interpolation at (n−1)×0.90. These are conditional completed-answer timings, with censored and late outcomes shown separately. There is no causal cross-arm speed ratio. UI responding indicators sometimes remained stale after a timely raw final. Setup recoveries and interruption gaps are separate from inference time.

| Native effort | Secondary metric | Measured / 48 | Missing/invalid | Median s | P90 s |
| --- | --- | --- | --- | --- | --- |
| low | click_request_to_raw_start_seconds | 32/48 | 16 | 3.12 | 4.836 |
| low | click_request_to_final_seconds | 32/48 | 16 | 18.533 | 35.104 |
| max | click_request_to_raw_start_seconds | 27/48 | 21 | 2.495 | 5.42 |
| max | click_request_to_final_seconds | 24/48 | 24 | 79.426 | 276.586 |

The click-request clock is recorded immediately before Send, not a measured physical-click instant. Differences can include automation, dispatch, transport, queue, clock and delivery effects. They are not pure server queue time. No-answer timeouts do not acquire invented final timestamps. Primary clocks and deadlines remain unchanged.

| Arm | Effort | Counter | Observed sum | Measured / completed grades |
| --- | --- | --- | --- | --- |
| luna | low | input_tokens | 1,371,155 | 48/48 |
| luna | low | cached_input_tokens | 955,392 | 48/48 |
| luna | low | cache_write_input_tokens | 0 | 48/48 |
| luna | low | output_tokens | 26,141 | 48/48 |
| luna | low | reasoning_output_tokens | 0 | 48/48 |
| luna | max | input_tokens | 1,720,143 | 48/48 |
| luna | max | cached_input_tokens | 1,196,544 | 48/48 |
| luna | max | cache_write_input_tokens | 0 | 48/48 |
| luna | max | output_tokens | 128,598 | 48/48 |
| luna | max | reasoning_output_tokens | 91,731 | 48/48 |
| haiku_desktop | low | input_tokens | 9,465,785 | 48/48 |
| haiku_desktop | low | cached_input_tokens | 6,576,831 | 48/48 |
| haiku_desktop | low | cache_write_input_tokens | 2,888,764 | 48/48 |
| haiku_desktop | low | output_tokens | 178,800 | 48/48 |
| haiku_desktop | low | reasoning_output_tokens | 126,667 | 48/48 |
| haiku_desktop | max | input_tokens | 19,982,506 | 44/44 |
| haiku_desktop | max | cached_input_tokens | 16,778,384 | 44/44 |
| haiku_desktop | max | cache_write_input_tokens | 3,203,800 | 44/44 |
| haiku_desktop | max | output_tokens | 1,322,261 | 44/44 |
| haiku_desktop | max | reasoning_output_tokens | 1,215,162 | 44/44 |

These sums cover completed graded attempts only. They omit ungraded outcomes and the excluded original, so they are not total experiment consumption. Thinking is included in output. Cache reads/writes are included in total input and must not be added again. Same-message transcript blocks are deduplicated by the collector. Missing timeout usage is unknown, not zero. Different tokenizers and native context prevent token totals from establishing efficiency. Actual subscription charges and complete background usage remain unavailable. Historical Luna API-equivalent estimates are not bills. No cost-saving claim is made.

## Paired uncertainty

- Low Task completion: Haiku minus Luna +31.250 percentage points, saved 95% paired task-cluster interval [+16.667, +47.917].
- Low Completed-grade strict accuracy: Haiku minus Luna +31.250 percentage points, saved 95% paired task-cluster interval [+16.667, +47.917].
- Max: interval unavailable under the designated evidence qualification policy. No missing-identity cell is dropped or replaced by UI selection.

Qualified intervals resample 24 paired task clusters 10,000 times, retaining both repeats and arms. They describe this selected suite, not all work. Cross-task shared state, temporally blocked model order, authorship bias and unlike harnesses remain. Saturation can yield a degenerate interval and is not general certainty.

## Anthropic's reported benchmarks

| Vendor benchmark | Haiku 5.5 | GPT-6 Luna | Metric |
| --- | --- | --- | --- |
| GDPval-AA v2.1 | 1620 | 1437 | Elo |
| AA-Briefcase v1.1 | 1578 | 1336 | Elo |
| OSWorld 2.1 offline | 72.4% | 48.9% | Partial credit |
| Terminal-Bench 4.0 | 39.2% | 16.4% | Benchmark score |
| FrontierCode 1.1 Main | 46.4% | 42.4% | Benchmark score |
| Chartography no tools | 46.4% | 29.1% | Benchmark score |

These are vendor-reported numbers from the [official launch](https://www.anthropic.com/claude-haiku-5-5), checked in the saved 7 October claim audit. They were not reproduced here. The [system card](https://www.anthropic.com/claude-haiku-5-5-system-card) generally uses Max adaptive thinking for headline results. OSWorld's 72.4% is partial credit, while its strict pass rate is 37.1%. Medium GDPval is 1277 compared with Max 1620. Terminal-Bench uses 66 tasks, ten attempts, a specific cached-resource/no-egress harness and uncertainty conventions that are not automatically equivalent to external competitor intervals. FrontierCode uses 100 tasks and five runs. This study uses different tasks, graders, environments and budgets.

The local results can show whether performance transfers to these sampled tasks. They neither verify nor falsify the exact advertised numbers. Matching original versions, input access, harness, effort, tool budgets, scoring and uncertainty would be required. Elo gaps are not percentage improvements.

## Practical conclusion and limits

Luna Max completed 48/48 successfully. Luna Low passed 33/48. In this native setup, Haiku Low completed 48/48 primary conditions successfully and Haiku Max 44/48. These results guide choices for similar small Python and structured-text work under the recorded constraints. They do not establish an overall model winner, intrinsic speed, equivalent effort or a subscription-cost advantage.

This suite does not measure vision, audio, live computer use, rendered design, broad web research, long production projects, broad safety, million-token context or subjective prose. Sentence selection is not open-ended writing. Native pasted-content wrappers preserve the frozen payload but change its envelope. Two recorded Low cases used byte-exact bare messages. Host instructions and large native context differ from the stripped CLI. UI evidence filing and deadline-anchor corrections are preserved locally. Functional scores and qualification flags were not cleaned up by this report.

A dated 50-case public checkpoint was previously verified. This builder neither reads current live publication state nor publishes. Its short draft keeps the existing six subjective 8/10 ratings separate from measured pass rates. The coordinator must inspect the final text and verify any later live update.

## Shareable evidence

The accompanying sanitized JSON and CSV contain all 192 primary cell outcomes, selected measurements, identity qualification and evidence digests. This narrative revision accepts only the documented Haiku display alias and Low/Max casing, retaining original field values beside normalized presentation. It consumes the saved audit projection without recomputation and records the original projector and revised builder hashes separately. The manifest records input/source hashes and the declared physical correction. Raw transcripts, responses, thinking, prompts, candidate files, hidden tests, native host context, account/session identifiers, screenshots, environment/configuration and machine paths are excluded. Hashes support provenance but do not independently prove correctness or reveal the excluded audit material. This is a sanitized result archive, not a standalone reproduction kit.
