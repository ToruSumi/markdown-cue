# Tasks: Markdown Completion Provider

**Input**: Design documents from `/specs/001-markdown-completion/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Include a minimum mandatory automated test set for every feature: at least one primary-path test and one boundary/failure-path test.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- VS Code Extension: `src/` for source, `test/` for tests at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare manifests, scripts, and baseline development flow for the current feature scope

- [X] T001 Align extension metadata and activation events (`onLanguage:markdown`, `onCommand:markdown-cue.insertSyntax`) in package.json
- [X] T002 [P] Verify TypeScript compile and test scripts for this feature in package.json and tsconfig.json
- [X] T003 [P] Refresh usage notes for trigger completion and command insertion in README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared structures and utilities required by all user stories

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Consolidate CompletionSnippet contract fields (key, label, detail, documentation, snippet, sortOrder, filterText, icon) in src/snippets.ts
- [X] T005 [P] Ensure completion item mapping uses shared snippet sort/filter/range fields consistently in src/completionProvider.ts
- [X] T006 [P] Ensure quick pick insertion path reads from shared completionSnippets source in src/insertSyntaxCommand.ts
- [X] T007 Add baseline snippet integrity checks (unique keys, `;` prefix, icon presence, real newline policy) in test/suite/snippets.test.ts
- [X] T008 Add fixed-order assertion helper for FR-010 sequence validation in test/suite/snippets.test.ts

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - トリガー文字による記法候補の表示と挿入 (Priority: P1) 🎯 MVP

**Goal**: `;` 入力で補完候補を表示し、選択した Markdown 記法を SnippetString で挿入する

**Independent Test**: Markdown ファイルで `;`, `;link`, `;strike`, `;check`, `;math` を入力し、候補表示と正しい挿入が成立すること

### Tests for User Story 1 (MANDATORY)

- [X] T009 [P] [US1] Add primary path completion tests for trigger filtering and candidate presence (`;`, `;link`, `;strike`, `;check`, `;math`) in test/suite/completionProvider.test.ts
- [X] T010 [P] [US1] Add boundary tests for multiline insertion text using real newlines (not `\\n`) for table, footnote, and mathblock in test/suite/completionProvider.test.ts
- [X] T011 [P] [US1] Add snippet format tests for strikethrough, checkbox, and mathblock in test/suite/snippets.test.ts
- [X] T012 [P] [US1] Add fixed-order tests enforcing FR-010 sequence in test/suite/snippets.test.ts

### Implementation for User Story 1

- [X] T013 [US1] Add strikethrough, checkbox, and mathblock snippet definitions with filterText and icon in src/snippets.ts
- [X] T014 [US1] Implement FR-010 fixed sortOrder mapping (`heading1` ... `mathblock`) in src/snippets.ts
- [X] T015 [US1] Ensure completion item labels include icon prefixes and trigger replacement range behavior in src/completionProvider.ts
- [X] T016 [US1] Keep label/documentation centralized in snippet data for future localization compatibility in src/snippets.ts

**Checkpoint**: User Story 1 is independently functional and testable

---

## Phase 4: User Story 2 - コードブロック内での補完抑制 (Priority: P2)

**Goal**: フェンスドコードブロック、インラインコード、YAML front matter 内で補完を抑制する

**Independent Test**: 抑制対象の文脈で `;` 入力して候補が出ないこと、通常文脈では候補が出ること

### Tests for User Story 2 (MANDATORY)

- [X] T017 [P] [US2] Add boundary tests for fenced code block detection (inside/outside and fence transitions) in test/suite/contextDetector.test.ts
- [X] T018 [P] [US2] Add boundary tests for inline code and front matter suppression in test/suite/contextDetector.test.ts
- [X] T019 [P] [US2] Add completion suppression integration tests for blocked contexts in test/suite/completionProvider.test.ts

### Implementation for User Story 2

- [X] T020 [US2] Harden fenced code and inline code context detection logic for suppression correctness in src/contextDetector.ts
- [X] T021 [US2] Harden YAML front matter detection boundaries in src/contextDetector.ts
- [X] T022 [US2] Ensure provider returns undefined when any suppression condition is true in src/completionProvider.ts

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - コマンドパレットからの記法挿入 (Priority: P3)

**Goal**: `Markdown: Insert Syntax` から Quick Pick で記法を選択し、カーソル位置へスニペット挿入する

**Independent Test**: コマンド実行で一覧表示され、表・脚注・数式ブロックなど複数行候補が実改行で挿入されること

### Tests for User Story 3 (MANDATORY)

- [X] T023 [P] [US3] Add unit tests for quick pick candidate mapping from shared snippets in test/suite/snippets.test.ts
- [X] T024 [P] [US3] Add command-path multiline insertion regression tests for table, footnote, and mathblock in test/suite/completionProvider.test.ts

### Implementation for User Story 3

- [X] T025 [US3] Extract quick pick item builder for testable mapping and use it in command flow in src/insertSyntaxCommand.ts
- [X] T026 [US3] Ensure command flow inserts selected snippet with SnippetString and no-op on missing editor in src/insertSyntaxCommand.ts
- [X] T027 [US3] Verify command registration and disposal lifecycle for insert syntax command in src/extension.ts

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, quality checks, and release-readiness tasks

- [X] T028 [P] Update smoke-check docs and examples for new snippets in specs/001-markdown-completion/quickstart.md
- [X] T029 [P] Sync spec artifacts and contract wording for FR-010/FR-012/SC-007 consistency in specs/001-markdown-completion/spec.md and specs/001-markdown-completion/contracts/extension-contract.md
- [X] T030 [P] Add tasks traceability notes for FR-011 future localization readiness in specs/001-markdown-completion/tasks.md
- [X] T031 Run full validation commands (`npm run compile`, `npm test`) and record outcomes in specs/001-markdown-completion/quickstart.md
- [X] T032 Security and communication minimization review for runtime paths in src/extension.ts and src/completionProvider.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies - can start immediately
- Foundational (Phase 2): Depends on Setup completion - blocks all user stories
- User Stories (Phase 3+): Depend on Foundational completion
- Polish (Phase 6): Depends on all target user stories completion

### User Story Dependencies

- US1 (P1): Starts after Foundational, no dependency on other user stories
- US2 (P2): Depends on US1 provider behavior and extends suppression logic
- US3 (P3): Depends on Foundational shared snippets and can proceed in parallel with US2 once foundational is done

### Within Each User Story

- Write tests first and confirm they fail before implementation
- Implement models/data structures before wiring into provider/commands
- Complete story-level regression checks before moving to next story

### Parallel Opportunities

- T002 and T003 can run in parallel
- T005, T006, T007, and T008 can run in parallel
- US1 tests T009, T010, T011, and T012 can run in parallel
- US2 tests T017, T018, and T019 can run in parallel
- US3 tests T023 and T024 can run in parallel
- T028, T029, and T030 can run in parallel in Polish phase

---

## Parallel Example: User Story 1

```text
# Run in parallel
T009 [US1] completion trigger filtering tests in test/suite/completionProvider.test.ts
T010 [US1] multiline newline boundary tests in test/suite/completionProvider.test.ts
T011 [US1] new snippet format tests in test/suite/snippets.test.ts
T012 [US1] fixed-order sequence tests in test/suite/snippets.test.ts

# Then run sequentially
T013 [US1] add new snippets in src/snippets.ts
T014 [US1] apply FR-010 fixed sort order in src/snippets.ts
T015 [US1] validate provider label/range behavior in src/completionProvider.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2
2. Complete US1 tests and implementation (T009-T016)
3. Validate with `npm run compile` and `npm test`
4. Demo trigger completion workflow in Markdown editor

### Incremental Delivery

1. Deliver US1: trigger completion + new snippet set
2. Deliver US2: context-aware suppression hardening
3. Deliver US3: command palette insertion parity
4. Finish Polish: docs sync, validation, security review

### Parallel Team Strategy

1. One developer handles snippet data and completion tests (US1)
2. One developer handles context detector hardening (US2)
3. One developer handles command flow and registration (US3)
4. Merge after phase checkpoints and re-run full test suite

## Traceability Notes

- FR-011 (将来ローカライズ可能構造) は MVP では抽象要件として維持し、`src/snippets.ts` への文言集中管理（T016）で将来差し替え可能性を確保する。
