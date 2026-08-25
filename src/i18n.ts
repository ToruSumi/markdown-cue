import { CompletionSnippet, completionSnippets } from "./snippets";

/**
 * Locales with dedicated translations. English (`en`) is the base locale and
 * always matches the strings authored in `snippets.ts`.
 */
export type SupportedLocale = "en" | "ja";

export const DEFAULT_LOCALE: SupportedLocale = "en";

const SUPPORTED_LOCALES: ReadonlyArray<SupportedLocale> = ["en", "ja"];

interface SnippetTranslation {
  label?: string;
  documentation?: string;
}

type TranslationTable = Record<string, SnippetTranslation>;

const ja: TranslationTable = {
  heading1: { label: "見出し1", documentation: "見出し1（H1）を挿入します" },
  heading2: { label: "見出し2", documentation: "見出し2（H2）を挿入します" },
  heading3: { label: "見出し3", documentation: "見出し3（H3）を挿入します" },
  bold: { label: "太字", documentation: "太字テキストを挿入します" },
  italic: { label: "斜体", documentation: "斜体テキストを挿入します" },
  link: { label: "リンク", documentation: "リンクを挿入します" },
  image: { label: "画像", documentation: "画像を挿入します" },
  table3: { label: "テーブル（3列）", documentation: "3列のテーブルを挿入します" },
  codeblock: { label: "コードブロック", documentation: "コードブロックを挿入します" },
  blockquote: { label: "引用", documentation: "引用を挿入します" },
  footnote: { label: "脚注", documentation: "脚注を挿入します" },
  hr: { label: "水平線", documentation: "水平線を挿入します" },
  strikethrough: { label: "取り消し線", documentation: "取り消し線テキストを挿入します" },
  checkbox: { label: "チェックボックス", documentation: "未チェックのタスク項目を挿入します" },
  mathblock: { label: "数式ブロック", documentation: "複数行の数式ブロックを挿入します" },
  underline: { label: "下線", documentation: "下線付きテキストを挿入します" },
  details: { label: "詳細（折りたたみ）", documentation: "折りたたみ可能な詳細ブロックを挿入します" },
  breakpage: { label: "改ページ", documentation: "改ページを挿入します" },
  "alert-note": { label: "アラート: ノート", documentation: "ノートのアラート引用を挿入します" },
  "alert-tip": { label: "アラート: ヒント", documentation: "ヒントのアラート引用を挿入します" },
  "alert-important": { label: "アラート: 重要", documentation: "重要のアラート引用を挿入します" },
  "alert-warning": { label: "アラート: 警告", documentation: "警告のアラート引用を挿入します" },
  "alert-caution": { label: "アラート: 注意", documentation: "注意のアラート引用を挿入します" }
};

const translations: Partial<Record<SupportedLocale, TranslationTable>> = { ja };

export const uiStrings: Record<SupportedLocale, { quickPickPlaceholder: string }> = {
  en: { quickPickPlaceholder: "Select Markdown syntax to insert" },
  ja: { quickPickPlaceholder: "挿入するMarkdown構文を選択してください" }
};

/**
 * Maps an arbitrary language tag (e.g. `vscode.env.language`, such as
 * `"ja"`, `"ja-JP"`, or `"pt-br"`) to one of the locales this extension
 * ships translations for, falling back to `DEFAULT_LOCALE` otherwise.
 */
export function resolveLocale(rawLanguage: string | undefined | null): SupportedLocale {
  if (!rawLanguage) {
    return DEFAULT_LOCALE;
  }

  const normalized = rawLanguage.toLowerCase();
  const match = SUPPORTED_LOCALES.find(
    (locale) => normalized === locale || normalized.startsWith(`${locale}-`)
  );

  return match ?? DEFAULT_LOCALE;
}

/**
 * Reads the active display language from VS Code (`vscode.env.language`).
 * Falls back to `DEFAULT_LOCALE` when running outside of a VS Code host
 * (e.g. plain Node.js unit tests) or when the API is unavailable.
 */
export function getActiveLocale(): SupportedLocale {
  try {
    const vscodeApi = require("vscode") as typeof import("vscode");
    return resolveLocale(vscodeApi.env.language);
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function localizeSnippet(
  snippet: CompletionSnippet,
  locale: SupportedLocale
): CompletionSnippet {
  if (locale === DEFAULT_LOCALE) {
    return snippet;
  }

  const override = translations[locale]?.[snippet.key];
  if (!override) {
    return snippet;
  }

  return { ...snippet, ...override };
}

export function getLocalizedSnippets(
  locale: SupportedLocale = getActiveLocale()
): CompletionSnippet[] {
  return completionSnippets.map((snippet) => localizeSnippet(snippet, locale));
}

export function getQuickPickPlaceholder(
  locale: SupportedLocale = getActiveLocale()
): string {
  return uiStrings[locale]?.quickPickPlaceholder ?? uiStrings[DEFAULT_LOCALE].quickPickPlaceholder;
}
