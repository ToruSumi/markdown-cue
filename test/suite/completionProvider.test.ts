import { strict as assert } from "assert";
import { buildCompletionItemData } from "../../src/completionProvider";

suite("completionProvider", () => {
  test("returns snippet completion item data on trigger input", () => {
    const items = buildCompletionItemData(";link", 5);
    assert.ok(items);
    assert.ok(items.length > 0);
  });

  test("includes icon property in completion items", () => {
    const items = buildCompletionItemData(";link", 5);
    assert.ok(items.length > 0);
    items.forEach((item) => {
      assert.ok(item.icon);
      assert.strictEqual(typeof item.icon, "string");
    });
  });

  test("link snippet has chain emoji icon", () => {
    const items = buildCompletionItemData(";link", 5);
    assert.ok(items.length > 0);
    const linkItem = items.find((item) => item.label === "Link");
    assert.ok(linkItem);
    assert.strictEqual(linkItem.icon, "🔗");
  });

  test("heading1 snippet has 1️⃣ emoji icon", () => {
    const items = buildCompletionItemData(";heading1", 9);
    assert.ok(items.length > 0);
    const h1Item = items.find((item) => item.label === "Heading 1");
    assert.ok(h1Item);
    assert.strictEqual(h1Item.icon, "1️⃣");
  });

  test("table snippet insert text contains real newlines", () => {
    const items = buildCompletionItemData(";table", 6);
    assert.ok(items.length > 0);
    const tableItem = items.find((item) => item.label === "Table (3 cols)");
    assert.ok(tableItem);
    assert.ok(tableItem.insertText.includes("\n"));
    assert.ok(!tableItem.insertText.includes("\\n"));
  });
});
