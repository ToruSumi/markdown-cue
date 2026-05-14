import { strict as assert } from "assert";
import { completionSnippets } from "../../src/snippets";

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
});
