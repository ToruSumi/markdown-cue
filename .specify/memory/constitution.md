<!--
Sync Impact Report
- Version change: 0.0.0 -> 1.0.0
- Modified principles:
	- Template Principle 1 -> I. VS Code Extension Scope First
	- Template Principle 2 -> II. Least-Communication by Default
	- Template Principle 3 -> III. Minimum Mandatory Testing
	- Template Principle 4 -> IV. Secure Implementation Baseline
	- Template Principle 5 -> V. Simplicity and Reviewability
- Added sections:
	- Security and Privacy Requirements
	- Development Workflow and Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending: .specify/templates/commands/*.md (directory not present, no files to update)
- Deferred items:
	- None
-->

# Markdown Cue Constitution

## Core Principles

### I. VS Code Extension Scope First
All implemented features MUST directly support the VS Code extension product surface.
Code, commands, and configuration MUST map to a user-visible extension behavior,
extension runtime support, or extension developer workflow. Generic utilities that do
not support this scope MUST be rejected or moved outside this repository.
Rationale: Tight scope prevents accidental complexity and reduces maintenance overhead.

### II. Least-Communication by Default
Features MUST avoid unnecessary external communication. Network access MUST be
explicitly justified, minimized in frequency and payload, and disabled by default when
not required for core functionality. Any telemetry, update checks, or third-party calls
MUST be opt-in and documented in the feature specification.
Rationale: Reducing external communication lowers security, privacy, and reliability risk.

### III. Minimum Mandatory Testing
Each feature MUST include a minimum, risk-based automated test set that proves
correctness of the primary path and one key failure or boundary condition. "No tests"
is never acceptable. Test scope MAY remain small for simple features, but absence of
tests MUST fail review.
Rationale: Even simple changes need regression protection and confidence for release.

### IV. Secure Implementation Baseline
Security-sensitive paths (input parsing, command execution, file access, and network
requests) MUST use secure defaults, explicit validation, and least-privilege behavior.
Dependencies MUST be kept minimal and actively justified. New dependencies that add
networked runtime behavior require explicit review notes.
Rationale: Baseline hardening prevents common extension attack and abuse vectors.

### V. Simplicity and Reviewability
Solutions MUST prefer the simplest implementation that satisfies requirements.
Unnecessary abstraction, speculative extensibility, and opaque logic MUST be avoided.
Code changes MUST remain easy to review with clear reasoning in specs, plans, and PRs.
Rationale: Simplicity improves reliability, onboarding, and long-term velocity.

## Security and Privacy Requirements

- Data collection MUST be minimized to what is required for the feature to function.
- Any external endpoint usage MUST be listed in the specification with purpose,
	trigger, and failure behavior.
- Secrets, tokens, and credentials MUST never be hardcoded or logged.
- User-facing documentation MUST disclose optional communication behavior and how to
	disable it.

## Development Workflow and Quality Gates

1. Specification MUST document communication needs and test scope before implementation.
2. Implementation plans MUST pass Constitution Check gates before coding.
3. Task breakdowns MUST include minimum mandatory automated tests for each user story.
4. Reviews MUST verify least-communication compliance and security baseline controls.
5. Merges MUST be blocked when mandatory tests fail or are missing.

## Governance

This constitution is the highest-priority project policy for delivery and review.
Amendments require: (1) a documented rationale, (2) explicit update of dependent
templates under .specify/templates, and (3) version bump assignment under semantic
versioning rules below.

Versioning policy:
- MAJOR: Backward-incompatible governance changes or principle removals/redefinitions.
- MINOR: New principle or materially expanded mandatory guidance.
- PATCH: Clarifications, wording improvements, and non-semantic refinements.

Compliance review expectations:
- Every plan and task artifact MUST include evidence of constitution alignment.
- Reviewers MUST record any justified exceptions in the relevant spec or plan.
- Periodic compliance checks SHOULD occur at least once per feature cycle.

**Version**: 1.0.0 | **Ratified**: 2026-05-13 | **Last Amended**: 2026-05-13
