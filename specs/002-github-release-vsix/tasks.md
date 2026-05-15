# Tasks: GitHub Release VSIX 自動ビルド

**Input**: Design documents from `/specs/002-github-release-vsix/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: テストは spec に明示的な要求がないため、CI ワークフロー自体のユニットテストは生成しない。品質保証は quickstart.md のスモークテストで実施する。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: package.json の依存関係・メタデータ追加と LICENSE ファイルの配置

- [X] T001 Add `@vscode/vsce` to devDependencies in package.json
- [X] T002 [P] Add `license` field (`"MIT"`) to package.json
- [X] T003 [P] Create LICENSE file with MIT license text at repository root in LICENSE

---

## Phase 2: User Story 1 - Release 作成時の VSIX 自動ビルド・添付 (Priority: P1) 🎯 MVP

**Goal**: GitHub UI から Release を公開した際に CI が自動で VSIX をビルドし Release アセットに添付する

**Independent Test**: GitHub UI から Release を作成・公開し、CI 完了後に Release ページに VSIX がアセットとして表示されることを確認する（quickstart.md テスト 1）

### Implementation for User Story 1

- [X] T004 [US1] Create `.github/workflows/` directory structure
- [X] T005 [US1] Create CI workflow file with trigger (`on: release: types: [published]`) and permissions (`contents: write`) in .github/workflows/release.yml
- [X] T006 [US1] Add checkout step (`actions/checkout@v4`) in .github/workflows/release.yml
- [X] T007 [US1] Add Node.js setup step (`actions/setup-node@v4`, node `20.x`) in .github/workflows/release.yml
- [X] T008 [US1] Add dependency install step (`npm install`) in .github/workflows/release.yml
- [X] T009 [US1] Add test execution step (`npm run test:unit`) as quality gate in .github/workflows/release.yml
- [X] T010 [US1] Add VSIX packaging step (`npx vsce package`) in .github/workflows/release.yml
- [X] T011 [US1] Add Release asset upload step (`softprops/action-gh-release@v2` with `files: '*.vsix'`) in .github/workflows/release.yml

**Checkpoint**: CI ワークフローが完成。Release 公開で VSIX ビルド・添付が自動実行される状態。

---

## Phase 3: User Story 2 - リリース前の手動バージョン更新 (Priority: P2)

**Goal**: package.json の version フィールドが VSIX ファイル名に正しく反映されること（手動運用プロセスの文書化）

**Independent Test**: package.json の version を更新してコミットし、Release を作成後、VSIX ファイル名にバージョンが反映されることを確認する（quickstart.md テスト 1 で同時確認可能）

### Implementation for User Story 2

- [X] T012 [US2] Add release procedure section (version update → master merge → Release creation flow) to README.md

**Checkpoint**: リリース手順が文書化され、開発者がバージョン更新の運用を理解できる状態。

---

## Phase 4: User Story 3 - VSIX からの手動インストール手順の提供 (Priority: P3)

**Goal**: ユーザーが Release ページから VSIX をダウンロードしてインストールする方法を README に記載する

**Independent Test**: README のインストール手順に従って VSIX をダウンロード・インストールできることを確認する（quickstart.md テスト 2）

### Implementation for User Story 3

- [X] T013 [US3] Add VSIX installation instructions section (CLI and VS Code UI methods) to README.md

**Checkpoint**: ユーザー向けインストール手順が README に記載され、初めてのユーザーでもインストール可能な状態。

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 最終検証と文書の整合性確認

- [X] T014 [P] Update .vscodeignore to exclude .github/ directory if not already excluded
- [X] T015 Run quickstart.md validation (スモークテスト手順の実施確認)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on T001 (vsce in devDependencies) and T002 (license field)
- **User Story 2 (Phase 3)**: No dependencies on other phases (README 追記のみ)
- **User Story 3 (Phase 4)**: No dependencies on other phases (README 追記のみ)
- **Polish (Phase 5)**: Depends on Phase 2 completion

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Setup (Phase 1) — T001, T002 が完了していること
- **User Story 2 (P2)**: Independent — README への追記のみ、Phase 1 以降いつでも実行可能
- **User Story 3 (P3)**: Independent — README への追記のみ、Phase 1 以降いつでも実行可能

### Within User Story 1

- T004 (directory) → T005 (workflow skeleton) → T006-T011 (steps in order, same file)
- T006-T011 は同一ファイルへの逐次追記のため並列化不可

### Parallel Opportunities

- T002 and T003 can run in parallel (different files)
- T012 and T013 can run in parallel (different README sections, no overlap)
- T014 can run in parallel with T012, T013

---

## Parallel Example: Setup Phase

```bash
# After T001 (vsce dependency), these can run in parallel:
Task T002: Add license field to package.json
Task T003: Create LICENSE file at repository root
```

## Parallel Example: User Story 2 + 3

```bash
# These two stories are fully independent and can run in parallel:
Task T012: Add release procedure to README.md
Task T013: Add VSIX installation instructions to README.md
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: User Story 1 (T004-T011)
3. **STOP and VALIDATE**: GitHub UI から Draft Release を作成し Publish → VSIX が添付されることを確認
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → 依存関係・メタデータ準備完了
2. Add User Story 1 → CI ワークフロー完成 → Release テスト（MVP!）
3. Add User Story 2 + 3 → README にリリース手順とインストール手順を追記
4. Polish → .vscodeignore 確認 + quickstart 検証

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- T005-T011 は同一ファイル (.github/workflows/release.yml) への逐次書き込みのため、実装時は一括で行うのが効率的
- T012 と T013 は同じ README.md だが異なるセクションへの追記のため、同時作業も可能（セクション境界を意識すること）
