# Tasks: Additional Markdown Snippets

**Input**: Design documents from `/specs/003-add-extra-snippets/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include a minimum mandatory automated test set for every user story. For this feature, extend the existing Mocha unit tests in `test/suite/` before implementation and verify they fail before code changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the active design artifacts and the current shared snippet/test baseline before editing code.

- [X] T001 Review active feature design artifacts in specs/003-add-extra-snippets/spec.md, specs/003-add-extra-snippets/plan.md, and specs/003-add-extra-snippets/contracts/snippet-catalog-contract.md
- [X] T002 [P] Inspect the current shared snippet catalog and baseline order in src/snippets.ts
- [X] T003 [P] Inspect the current regression coverage for snippets and completion discovery in test/suite/snippets.test.ts and test/suite/completionProvider.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared change surface that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Lock the shared naming, filterText, and stable sort-slot strategy for `underline` and `details` in src/snippets.ts and test/suite/snippets.test.ts

**Checkpoint**: Shared snippet catalog update strategy is fixed and user story implementation can proceed.

---

## Phase 3: User Story 1 - 下線をすぐ挿入できる (Priority: P1) 🎯 MVP

**Goal**: 補完候補一覧とコマンド一覧の両方から下線 snippet を選択し、`<u>text</u>` を挿入できるようにする。

**Independent Test**: Markdown 編集中に `;under` などで下線候補へ到達し、補完経路とコマンド経路の両方で `<u>text</u>` が挿入されることを確認する。

### Tests for User Story 1 (MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T005 [P] [US1] Add underline snippet format and Quick Pick mapping assertions in test/suite/snippets.test.ts
- [X] T006 [P] [US1] Add underline trigger discovery assertions in test/suite/completionProvider.test.ts

### Implementation for User Story 1

- [X] T007 [US1] Add the `underline` snippet entry with label, detail, filterText, icon, and `<u>${1:text}</u>` template in src/snippets.ts

**Checkpoint**: 下線 snippet が補完候補とコマンド一覧の両方で独立して利用可能になる。

---

## Phase 4: User Story 2 - 折りたたみブロックをテンプレート付きで挿入できる (Priority: P2)

**Goal**: 補完候補一覧とコマンド一覧の両方から、実改行を含む details テンプレートを挿入できるようにする。

**Independent Test**: Markdown 編集中に details 候補を選択し、`<details>`、`<summary>summary</summary>`、`body`、`</details>` を含む複数行 template が実改行で挿入されることを確認する。

### Tests for User Story 2 (MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [P] [US2] Add details multiline snippet and tab-stop assertions in test/suite/snippets.test.ts
- [X] T009 [P] [US2] Add details trigger discovery and real-newline insert text assertions in test/suite/completionProvider.test.ts

### Implementation for User Story 2

- [X] T010 [US2] Add the `details` snippet entry with multiline template, tab order, filterText, icon, and stable sort slot in src/snippets.ts

**Checkpoint**: 折りたたみ snippet が両導線で実改行のまま挿入され、独立して検証可能になる。

---

## Phase 5: User Story 3 - 新しい snippet が既存一覧に自然に統合される (Priority: P3)

**Goal**: 追加した 2 項目が既存候補と同じ表示粒度で一覧に統合され、既存順序と既存候補の挙動を壊さないようにする。

**Independent Test**: 候補一覧と Quick Pick 一覧で下線と折りたたみの両方が見え、既存候補の順序と既存 multiline snippet の挙動が回帰していないことを確認する。

### Tests for User Story 3 (MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US3] Extend fixed sort order and shared Quick Pick parity assertions for the full catalog in test/suite/snippets.test.ts
- [X] T012 [P] [US3] Add combined completion discovery assertions covering the new labels alongside existing snippets in test/suite/completionProvider.test.ts

### Implementation for User Story 3

- [X] T013 [US3] Finalize the shared catalog ordering, labels, details, and filter strings for `underline` and `details` without changing existing entries in src/snippets.ts

**Checkpoint**: 新規 2 項目が一覧品質を保ったまま既存カタログへ統合される。

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation alignment across all user stories.

- [X] T014 [P] Update manual verification notes for the new snippets and the 2-step insertion validation in specs/003-add-extra-snippets/quickstart.md
- [X] T015 Run the full regression command from package.json and confirm the manual validation path in package.json and specs/003-add-extra-snippets/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion
- **User Story 3 (Phase 5)**: Depends on User Story 1 and User Story 2 because it validates the final integrated catalog
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 - no dependency on other stories
- **User Story 2 (P2)**: Can start after Phase 2 - no dependency on other stories
- **User Story 3 (P3)**: Starts after US1 and US2 because it verifies the combined catalog and regression surface

### Within Each User Story

- Tests MUST be written and shown failing before implementation
- `src/snippets.ts` changes come after the story’s test updates
- Story-specific verification happens before moving to the next dependent story

### Parallel Opportunities

- T002 and T003 can run in parallel during Setup
- T005 and T006 can run in parallel for US1
- T008 and T009 can run in parallel for US2
- T011 and T012 can run in parallel for US3

---

## Parallel Example: User Story 1

```bash
# Launch the mandatory tests for User Story 1 together:
Task: T005 Add underline snippet format and Quick Pick mapping assertions in test/suite/snippets.test.ts
Task: T006 Add underline trigger discovery assertions in test/suite/completionProvider.test.ts
```

---

## Parallel Example: User Story 2

```bash
# Launch the mandatory tests for User Story 2 together:
Task: T008 Add details multiline snippet and tab-stop assertions in test/suite/snippets.test.ts
Task: T009 Add details trigger discovery and real-newline insert text assertions in test/suite/completionProvider.test.ts
```

---

## Parallel Example: User Story 3

```bash
# Launch the mandatory tests for User Story 3 together:
Task: T011 Extend fixed sort order and shared Quick Pick parity assertions in test/suite/snippets.test.ts
Task: T012 Add combined completion discovery assertions covering the new labels in test/suite/completionProvider.test.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm underline insertion works independently from both insertion surfaces
5. Demo or ship the MVP slice if needed

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 and validate it independently
3. Add User Story 2 and validate multiline insertion independently
4. Add User Story 3 to lock in final ordering and regression coverage
5. Finish with Polish validation

### Parallel Team Strategy

1. One developer completes Setup + Foundational
2. After Phase 2, one developer can take US1 while another takes US2
3. US3 starts after both stories merge because it validates the integrated final state

---

## Notes

- All tasks follow the required checklist format and include exact file paths
- `[P]` markers are used only for tasks that touch different files with no unfinished dependency between them
- This feature intentionally keeps all implementation changes centered on src/snippets.ts and its existing test surfaces
