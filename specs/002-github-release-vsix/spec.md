# Feature Specification: GitHub Release VSIX 自動ビルド

**Feature Branch**: `002-github-release-vsix`

**Created**: 2026-05-15

**Status**: Draft

**Input**: User description: "開発している拡張機能を GitHub 上の Release に表示させて入手しやすくしたい。master にマージした後に Release を作成する際に、ソースコードだけでなく VSIX ファイルを自動ビルドしてダウンロードできるようにする。"

## Clarifications

### Session 2026-05-15

- Q: Release イベントのトリガータイプをどうするか → A: 当初 `created` を採用予定だったが、調査の結果 `created` は Draft リリースでは発火しないことが判明。`published` を採用する（Draft を公開した時と、非 Draft リリース作成時の両方で発火する）
- Q: CI ワークフローがチェックアウトする対象をどうするか → A: Release タグのコミットを自動チェックアウト（GitHub Actions デフォルト動作、ブランチ明示指定不要）
- Q: CI インフラ機能のテスト戦略として Constitution Principle III をどう充足するか → A: ワークフロー YAML の構文バリデーション（`actionlint`）を自動テストとして追加し、quickstart.md のスモークテストと合わせて Principle III を充足する
- Q: `.vscodeignore` の更新は必要か → A: `.github/**` を追加して VSIX から除外する（ワークフローやエージェント設定は拡張機能の動作に不要のため）
- Q: US1 タイトルの「Release 作成時」を「Release 公開時」に修正すべきか → A: 「Release 作成時」のまま維持する。Draft 含め Release を作る行為全体を指す運用上の用語として適切。技術的なトリガータイプ（`published`）は FR-001 で明示済み

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Release 作成時の VSIX 自動ビルド・添付 (Priority: P1)

開発者が GitHub UI から Release を作成すると、CI が自動的にソースコードをチェックアウトし、テストを実行し、VSIX ファイルをパッケージングして Release アセットに添付する。ユーザーは Release ページから VSIX ファイルを直接ダウンロードできる。

**Why this priority**: これがこの機能のコアバリューそのもの。VSIX の自動配布を実現することで、ユーザーがソースコードからビルドする手間を省き、拡張機能の入手性を大幅に向上させる。

**Independent Test**: GitHub UI から Release を作成し、CI が完了した後に Release ページに VSIX ファイルがアセットとして表示されていることを確認する。

**Acceptance Scenarios**:

1. **Given** 開発者が GitHub UI で新しい Release を作成する, **When** CI ワークフローが実行される, **Then** VSIX ファイルが自動的にビルドされ Release アセットに添付される
2. **Given** Release ページに VSIX がアセットとして添付されている, **When** ユーザーがアセットをクリックする, **Then** `markdown-cue-{version}.vsix` がダウンロードされる
3. **Given** CI ワークフローが実行される, **When** ユニットテストが失敗する, **Then** VSIX はビルドされず Release にアセットは添付されない（品質ゲートとして機能する）
4. **Given** ダウンロードした VSIX ファイルがある, **When** `code --install-extension markdown-cue-x.x.x.vsix` を実行する, **Then** 拡張機能が正常にインストールされ動作する

---

### User Story 2 - リリース前の手動バージョン更新 (Priority: P2)

開発者はリリース前に `package.json` の `version` フィールドを手動で更新する。CI はこのバージョンを使って VSIX ファイル名を決定するため、バージョン番号が Release タグと一致していることが期待される。

**Why this priority**: バージョンの一貫性はユーザーが正しいバージョンを識別するために重要。ただし自動化ではなく手動プロセスであり、CI 側の仕組みとは独立して機能する。

**Independent Test**: `package.json` の version を `1.0.0` に更新してコミットし、タグ `v1.0.0` で Release を作成した後、添付される VSIX のファイル名が `markdown-cue-1.0.0.vsix` であることを確認する。

**Acceptance Scenarios**:

1. **Given** `package.json` の version が `1.0.0` である, **When** Release が作成され CI が実行される, **Then** 生成される VSIX のファイル名は `markdown-cue-1.0.0.vsix` となる
2. **Given** 開発者がバージョンを更新せずに Release を作成した, **When** CI が実行される, **Then** VSIX は前回と同じバージョン番号で生成される（CI はバージョン検証を行わない）

---

### User Story 3 - VSIX からの手動インストール手順の提供 (Priority: P3)

ユーザーが Release ページから VSIX をダウンロードした後、どのようにインストールするかが README に記載されている。Marketplace を経由しない配布方法のため、インストール手順が明確に案内されている必要がある。

**Why this priority**: VSIX を配布しても、インストール方法がわからなければユーザーは利用できない。補助的な情報提供だがユーザー体験の完成に必要。

**Independent Test**: README のインストール手順に従って、ダウンロードした VSIX を VS Code にインストールできることを確認する。

**Acceptance Scenarios**:

1. **Given** ユーザーが README を閲覧する, **When** インストール手順セクションを確認する, **Then** VSIX のダウンロード先と `code --install-extension` コマンドの使い方が記載されている
2. **Given** ユーザーが README を閲覧する, **When** インストール手順セクションを確認する, **Then** VS Code UI からの VSIX インストール方法（拡張機能ビュー → 「...」→「VSIX からインストール」）も記載されている

---

### Edge Cases

- Release を Draft 状態で作成した場合、`published` イベントは発火しない。Draft を公開（Publish）した時点で CI が実行される（リリースノートを事前に下書きできる運用が可能）
- Release を削除して同じタグで再作成した場合、CI は再実行される
- CI 実行中にリポジトリのデフォルトブランチが変更された場合でも、Release タグが指すコミットに基づいてビルドされる（GitHub Actions デフォルト動作）
- `npm install` や `npm test` が失敗した場合、VSIX は生成されず Release にアセットは添付されない
- VSIX パッケージングで `icon` 未設定の警告が出る場合でも、VSIX ファイル自体は正常に生成される

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: GitHub UI から Release を公開した際に、CI ワークフローが自動的にトリガーされなければならない。トリガーイベントタイプは `published` とする（Draft からの公開と非 Draft の直接作成の両方で発火）
- **FR-002**: CI ワークフローはソースコードのチェックアウト、依存関係のインストール、テスト実行、VSIX パッケージングの順で実行しなければならない
- **FR-003**: ユニットテストが失敗した場合、VSIX のビルドおよび Release へのアセット添付を中止しなければならない（品質ゲート）
- **FR-004**: ビルドされた VSIX ファイルは、対応する Release のアセットとして自動的に添付されなければならない
- **FR-005**: VSIX ファイル名は `{拡張機能名}-{バージョン}.vsix` の形式（`vsce package` のデフォルト命名規則）でなければならない
- **FR-006**: CI ワークフローで使用するパッケージングツール（`@vscode/vsce`）のバージョンは、`devDependencies` で固定管理しなければならない
- **FR-007**: バージョン番号は開発者が `package.json` の `version` フィールドを手動で更新する運用とし、CI による自動バージョニングは行わない
- **FR-008**: README に VSIX ファイルのダウンロード先と、コマンドライン・VS Code UI 双方のインストール手順を記載しなければならない
- **FR-009**: README に開発者向けのリリース手順（バージョン更新 → master マージ → Release 作成の流れ）を記載しなければならない
- **FR-010**: `package.json` に `license` フィールドを設定し、`vsce package` の警告を抑制しなければならない

### Security & Communication Constraints *(mandatory)*

- **SCON-001**: CI ワークフローの外部通信パスは以下のとおり:
  - npm レジストリへのアクセス（依存関係インストール、`npm install` 時）— CI 環境で自動実行
  - GitHub API（Release アセットのアップロード、`GITHUB_TOKEN` 使用）— CI 環境で自動実行
- **SCON-002**: CI ワークフローは VS Code Marketplace への公開を行わない。配布は GitHub Release 経由の VSIX ダウンロードのみとする
- **SCON-003**: CI ワークフローで使用する認証トークンは GitHub が自動提供する `GITHUB_TOKEN` のみとし、追加の Personal Access Token（PAT）は不要とする
- **SCON-004**: 最小必須テストとして、(1) ワークフロー YAML の構文バリデーション（`actionlint`）による自動テスト、(2) quickstart.md に基づくスモークテスト（Release 公開→VSIX 添付の確認、テスト失敗時に VSIX 未添付の確認）を実施する

### Key Entities

- **CI ワークフロー**: GitHub Actions の YAML 定義ファイル。Release 作成イベントをトリガーとして VSIX のビルドとアセット添付を自動実行する
- **VSIX ファイル**: VS Code 拡張機能のパッケージ形式。`vsce package` により生成され、ソースコード・コンパイル済みファイル・メタデータを含むインストール可能なアーカイブ
- **Release アセット**: GitHub Release に添付されるバイナリファイル。ユーザーが Release ページから直接ダウンロード可能

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: GitHub UI から Release を作成してから 5 分以内に VSIX ファイルが Release アセットとして利用可能になる
- **SC-002**: Release ページからダウンロードした VSIX を VS Code にインストールし、拡張機能が正常に動作する（成功率 100%）
- **SC-003**: ユニットテスト失敗時に VSIX が Release に添付されない（品質ゲート機能率 100%）
- **SC-004**: 追加の認証情報（PAT 等）の設定なしに、リポジトリの標準権限のみで CI が動作する
- **SC-005**: README のインストール手順に従って、初めてのユーザーが VSIX ダウンロードからインストール完了まで 3 分以内に完了できる

## Assumptions

- 開発は gitflow に基づき、master ブランチへのマージ後に Release を作成する運用とする
- Release 作成は GitHub UI からの手動操作で行い、タグ名は `v{version}`（例: `v1.0.0`）の命名規則を推奨する
- VS Code Marketplace への公開は本機能のスコープ外とする（将来的に追加可能）
- CI 実行環境は GitHub Actions の `ubuntu-latest` ランナーを使用する
- Node.js のバージョンは LTS（20.x）を使用する
- `@vscode/vsce` パッケージングツールは VSIX 生成に十分であり、追加のビルドツールは不要
- `package.json` の `icon` フィールドは未設定でも VSIX 生成に支障はなく、アイコン追加は本機能のスコープ外とする
- `.vscodeignore` に `.github/**` を追加し、ワークフローやエージェント設定等を VSIX から除外する（拡張機能の動作に不要なファイルを含めずパッケージサイズを最小化）
- テストは `npm run test:unit`（Mocha ユニットテスト）のみを CI で実行し、CI 内での E2E テストは行わない（GitHub UI を使ったスモークテストは quickstart.md に基づき別途実施）
- ワークフロー YAML の品質保証として `actionlint` による構文バリデーションを自動テストに含める（Constitution Principle III 充足）
