import { strict as assert } from "assert";
import { completionSnippets } from "../../src/snippets";
import {
  DEFAULT_LOCALE,
  getLocalizedSnippets,
  getQuickPickPlaceholder,
  localizeSnippet,
  resolveLocale
} from "../../src/i18n";

suite("i18n", () => {
  test("resolveLocale maps exact and regional language tags to a supported locale", () => {
    assert.equal(resolveLocale("ja"), "ja");
    assert.equal(resolveLocale("ja-JP"), "ja");
    assert.equal(resolveLocale("JA-jp"), "ja");
    assert.equal(resolveLocale("en"), "en");
    assert.equal(resolveLocale("en-US"), "en");
  });

  test("resolveLocale falls back to the default locale for unsupported or missing languages", () => {
    assert.equal(resolveLocale("fr"), DEFAULT_LOCALE);
    assert.equal(resolveLocale("pt-br"), DEFAULT_LOCALE);
    assert.equal(resolveLocale(undefined), DEFAULT_LOCALE);
    assert.equal(resolveLocale(null), DEFAULT_LOCALE);
    assert.equal(resolveLocale(""), DEFAULT_LOCALE);
  });

  test("localizeSnippet returns the original snippet for the default locale", () => {
    const snippet = completionSnippets[0];
    assert.deepEqual(localizeSnippet(snippet, "en"), snippet);
  });

  test("localizeSnippet overrides label and documentation for a translated locale", () => {
    const heading1 = completionSnippets.find((snippet) => snippet.key === "heading1");
    assert.ok(heading1);
    const localized = localizeSnippet(heading1, "ja");
    assert.equal(localized.label, "見出し1");
    assert.equal(localized.detail, heading1.detail);
    assert.equal(localized.snippet, heading1.snippet);
    assert.equal(localized.key, heading1.key);
  });

  test("getLocalizedSnippets preserves catalog size and keys across locales", () => {
    const enSnippets = getLocalizedSnippets("en");
    const jaSnippets = getLocalizedSnippets("ja");

    assert.equal(enSnippets.length, completionSnippets.length);
    assert.equal(jaSnippets.length, completionSnippets.length);
    assert.deepEqual(
      jaSnippets.map((snippet) => snippet.key),
      completionSnippets.map((snippet) => snippet.key)
    );
  });

  test("every snippet has a Japanese translation for its label", () => {
    const jaSnippets = getLocalizedSnippets("ja");
    jaSnippets.forEach((snippet) => {
      const original = completionSnippets.find((item) => item.key === snippet.key);
      assert.ok(original);
      assert.notEqual(snippet.label, original.label, `Missing ja label override for ${snippet.key}`);
    });
  });

  test("getQuickPickPlaceholder returns a locale-specific string", () => {
    assert.equal(getQuickPickPlaceholder("en"), "Select Markdown syntax to insert");
    assert.equal(getQuickPickPlaceholder("ja"), "挿入するMarkdown構文を選択してください");
  });
});
