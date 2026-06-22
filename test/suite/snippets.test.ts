import { strict as assert } from "assert";
import { completionSnippets } from "../../src/snippets";
import { buildSyntaxQuickPickItems } from "../../src/insertSyntaxCommand";

suite("snippets", () => {
  function getSnippetByKey(key: string): string {
    const snippet = completionSnippets.find((item) => item.key === key);
    assert.ok(snippet, `Missing snippet for key: ${key}`);
    return snippet.snippet;
  }

  test("has unique keys", () => {
    const keys = completionSnippets.map((item) => item.key);
    const unique = new Set(keys);
    assert.equal(unique.size, keys.length);
  });

  test("all filterText values start with ';'", () => {
    completionSnippets.forEach((item) => {
      assert.ok(item.filterText.startsWith(";"));
    });
  });

  test("all snippets and sort orders are present", () => {
    completionSnippets.forEach((item) => {
      assert.ok(item.snippet.length > 0);
      assert.ok(item.sortOrder.length > 0);
      assert.ok(item.icon.length > 0);
    });
  });

  test("table3 snippet uses real newlines", () => {
    const snippet = getSnippetByKey("table3");
    assert.ok(snippet.includes("\n"));
    assert.ok(!snippet.includes("\\n"));
  });

  test("footnote snippet uses real newlines", () => {
    const snippet = getSnippetByKey("footnote");
    assert.ok(snippet.includes("\n"));
    assert.ok(!snippet.includes("\\n"));
  });

  test("mathblock snippet uses real newlines", () => {
    const snippet = getSnippetByKey("mathblock");
    assert.ok(snippet.includes("\n"));
    assert.ok(!snippet.includes("\\n"));
  });

  test("strikethrough snippet format", () => {
    const snippet = getSnippetByKey("strikethrough");
    assert.equal(snippet, "~~${1:text}~~");
  });

  test("checkbox snippet format", () => {
    const snippet = getSnippetByKey("checkbox");
    assert.equal(snippet, "- [ ] ${1:text}");
  });

  test("underline snippet format", () => {
    const snippet = getSnippetByKey("underline");
    assert.equal(snippet, "<u>${1:text}</u>");
  });

  test("details snippet uses real newlines and tab order", () => {
    const snippet = getSnippetByKey("details");
    assert.ok(snippet.includes("\n"));
    assert.ok(!snippet.includes("\\n"));
    assert.equal(
      snippet,
      "<details>\n<summary>${1:summary}</summary>\n${2:body}\n</details>"
    );
  });

  test("alert snippets use real newlines", () => {
    for (const key of ["alert-note", "alert-tip", "alert-important", "alert-warning", "alert-caution"]) {
      const snippet = getSnippetByKey(key);
      assert.ok(snippet.includes("\n"), `${key} should use real newline`);
      assert.ok(!snippet.includes("\\n"), `${key} should not use escaped newline`);
    }
  });

  test("alert-note snippet format", () => {
    assert.equal(getSnippetByKey("alert-note"), "> [!NOTE]\n> ${1:text}");
  });

  test("FR-010 fixed snippet order", () => {
    const expectedOrder = [
      "heading1",
      "heading2",
      "heading3",
      "bold",
      "italic",
      "link",
      "image",
      "table3",
      "codeblock",
      "blockquote",
      "footnote",
      "hr",
      "strikethrough",
      "checkbox",
      "mathblock",
      "underline",
      "details",
      "breakpage",
      "alert-note",
      "alert-tip",
      "alert-important",
      "alert-warning",
      "alert-caution"
    ];
    const actualOrder = completionSnippets
      .slice()
      .sort((a, b) => a.sortOrder.localeCompare(b.sortOrder))
      .map((item) => item.key);
    assert.deepEqual(actualOrder, expectedOrder);
  });

  test("quick pick items map from shared snippets", () => {
    const items = buildSyntaxQuickPickItems();
    assert.equal(items.length, completionSnippets.length);

    const math = items.find((item) => item.label === "Math Block");
    assert.ok(math);
    assert.ok(math.snippet.includes("\n"));
    assert.ok(!math.snippet.includes("\\n"));

    const underline = items.find((item) => item.label === "Underline");
    assert.ok(underline);
    assert.equal(underline.snippet, "<u>${1:text}</u>");

    const details = items.find((item) => item.label === "Details");
    assert.ok(details);
    assert.equal(details.description, "<details>");
    assert.ok(details.snippet.includes("\n"));
    assert.ok(!details.snippet.includes("\\n"));
  });
});
