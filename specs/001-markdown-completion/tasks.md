# Tasks: Markdown Completion Provider

**Input**: Design documents from `/specs/001-markdown-completion/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: MANDATORY — SCON-004 requires primary path test + boundary condition test minimum.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **VS Code Extension**: `src/` for source, `test/` for tests at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, extension manifest, and build tooling

- [X] T001 Create extension manifest with name, displayName, version, engines (vscode ^1.85.0), activationEvents, contributes.commands, main, and scripts in package.json
- [X] T002 [P] Configure TypeScript compilation (strict mode, outDir, rootDir, ES2020 target, sourceMap) in tsconfig.json
- [X] T003 [P] Create extension packaging exclusion rules in .vscodeignore

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared modules and test infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Define CompletionSnippet interface and create snippet definitions array (H1–H3, Bold, Italic, Link, Image, Table, Code Block, Blockquote, Footnote, Horizontal Rule) with label, detail, documentation, snippet, sortOrder, filterText in src/snippets.ts
- [X] T005 [P] Create extension entry point skeleton (activate registers disposables, deactivate is no-op) in src/extension.ts
- [X] T006 [P] Setup test runner and Mocha configuration in test/runTest.ts and test/suite/index.ts

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — トリガー文字による記法候補の表示と挿入 (Priority: P1) 🎯 MVP

**Goal**: `;` 入力で Markdown 記法候補を表示し、選択で SnippetString として挿入する

**Independent Test**: `.md` ファイルで `;` を入力 → 候補一覧表示 → 選択 → 正しい記法がスニペット挿入される

### Tests for User Story 1 (MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Write snippet data integrity tests (all keys unique, filterText starts with `;`, snippet contains valid tabstop syntax, sortOrder present) in test/suite/snippets.test.ts
- [X] T008 [P] [US1] Write completion provider primary path tests (returns CompletionItem[] on trigger, each item has kind=Snippet + SnippetString insertText + correct range + filterText + sortText) in test/suite/completionProvider.test.ts

### Implementation for User Story 1

- [X] T009 [US1] Implement MarkdownCompletionProvider.provideCompletionItems — map CompletionSnippet[] to CompletionItem[] with kind=Snippet, insertText=new SnippetString(snippet), range from `;` to cursor, filterText, sortText in src/completionProvider.ts
- [X] T010 [US1] Register CompletionItemProvider with document selector `{ language: 'markdown', scheme: 'file' }` and trigger character `';'` in src/extension.ts

**Checkpoint**: User Story 1 fully functional — `;` triggers completion list, selection inserts snippet, trigger text is replaced

---

## Phase 4: User Story 2 — コードブロック内での補完抑制 (Priority: P2)

**Goal**: フェンスドコードブロック、インラインコード、YAML front matter 内で補完を抑制する

**Independent Test**: フェンスドコードブロック内で `;` を入力 → 候補が表示されないことを確認

### Tests for User Story 2 (MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US2] Write context detection boundary tests — isInFencedCodeBlock (inside/outside/nested), isInInlineCode (inside/outside/escaped), isInFrontMatter (inside/outside/no front matter) in test/suite/contextDetector.test.ts

### Implementation for User Story 2

- [X] T012 [US2] Implement context detection functions — isInFencedCodeBlock (``` / ~~~ toggle scan), isInInlineCode (backtick count to cursor), isInFrontMatter (--- boundary scan from line 0) in src/contextDetector.ts
- [X] T013 [US2] Integrate context detection into provideCompletionItems — call detection functions and return undefined when any suppression flag is true in src/completionProvider.ts

**Checkpoint**: User Stories 1 AND 2 both work — completions suppressed in code/front matter regions

---

## Phase 5: User Story 3 — コマンドパレットからの記法挿入 (Priority: P3)

**Goal**: コマンドパレットから Quick Pick で記法を選択し、カーソル位置に SnippetString を挿入する

**Independent Test**: コマンドパレットで「Markdown: Insert Syntax」を実行 → Quick Pick 表示 → 記法選択 → スニペット挿入

### Implementation for User Story 3

- [X] T014 [US3] Implement Quick Pick insert syntax command — show snippet labels via showQuickPick, insert selected SnippetString at active editor cursor in src/insertSyntaxCommand.ts
- [X] T015 [US3] Register markdown-cue.insertSyntax command in activate() in src/extension.ts

**Checkpoint**: All user stories independently functional — trigger completion, context suppression, and command palette insertion

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, security validation, and final quality checks

- [X] T016 [P] Create README.md with feature overview, usage instructions, development setup, and available commands
- [X] T017 Security hardening and communication minimization review — verify no network imports, no telemetry, no external API calls across all source files
- [X] T018 Run quickstart.md validation — execute setup, build, and test commands from quickstart.md end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - US2 modifies src/completionProvider.ts created in US1, so US2 depends on US1
  - US3 is independent of US1 and US2 (uses only src/snippets.ts from Foundational)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 completion (integrates into src/completionProvider.ts)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Independent of US1 and US2 (uses only src/snippets.ts)

### Within Each User Story

- Mandatory tests MUST be written and FAIL before implementation
- Tests before implementation code
- Core module before registration in extension.ts
- Story complete before moving to next priority

### Parallel Opportunities

- T002 and T003 can run in parallel with each other (Phase 1)
- T005 and T006 can run in parallel with each other (Phase 2)
- T007 and T008 can run in parallel (US1 tests)
- T011 can run in parallel with US3 work (different files, no dependency)
- US3 (T014–T015) can run in parallel with US2 (T011–T013) since US3 only depends on Foundational

---

## Parallel Example: User Story 1

```text
# Phase 1 parallel tasks:
T002: Configure TypeScript in tsconfig.json
T003: Create .vscodeignore

# Phase 2 parallel tasks:
T005: Extension entry point skeleton in src/extension.ts
T006: Test runner setup in test/runTest.ts + test/suite/index.ts

# US1 tests (write first, in parallel):
T007: Snippet integrity tests in test/suite/snippets.test.ts
T008: Completion provider tests in test/suite/completionProvider.test.ts

# Then US1 implementation (sequential):
T009: CompletionItemProvider in src/completionProvider.ts
T010: Register provider in src/extension.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T006)
3. Complete Phase 3: User Story 1 (T007–T010)
4. **STOP and VALIDATE**: Run tests, launch Extension Development Host, verify `;` triggers completions
5. MVP is functional — can demo and gather feedback

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP! (`;` completion works)
3. Add User Story 2 → Test independently → Quality improvement (no code block false positives)
4. Add User Story 3 → Test independently → Discoverability improvement (command palette access)
5. Polish → Documentation, security review, quickstart validation
6. Each story adds value without breaking previous stories
