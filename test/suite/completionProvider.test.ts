import { strict as assert } from "assert";
import { buildCompletionItemData } from "../../src/completionProvider";

suite("completionProvider", () => {
  test("returns snippet completion item data on trigger input", () => {
    const items = buildCompletionItemData(";link", 5);
    assert.ok(items);
    assert.ok(items.length > 0);
  });
});
