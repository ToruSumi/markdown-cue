import { strict as assert } from "assert";
import { completionSnippets } from "../../src/snippets";

suite("snippets", () => {
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
});
