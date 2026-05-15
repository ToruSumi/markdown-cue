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

  test("supports strike, check, and math triggers", () => {
    const strike = buildCompletionItemData(";strike", 7).find((item) => item.label === "Strikethrough");
    const check = buildCompletionItemData(";check", 6).find((item) => item.label === "Checkbox");
    const math = buildCompletionItemData(";math", 5).find((item) => item.label === "Math Block");

    assert.ok(strike);
    assert.ok(check);
    assert.ok(math);
  });

  test("mathblock insert text contains real newlines", () => {
    const items = buildCompletionItemData(";math", 5);
    const mathItem = items.find((item) => item.label === "Math Block");
    assert.ok(mathItem);
    assert.ok(mathItem.insertText.includes("\n"));
    assert.ok(!mathItem.insertText.includes("\\n"));
  });

  test("sort order starts with heading1", () => {
    const items = buildCompletionItemData(";", 1);
    assert.ok(items.length > 0);
    const sorted = items.slice().sort((a, b) => a.sortText.localeCompare(b.sortText));
    assert.equal(sorted[0].label, "Heading 1");
  });
});
