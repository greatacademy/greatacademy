import { describe, expect, it } from "vitest";

import { redact } from "./redact.ts";

describe("redact", () => {
  it("replaces emails, links and handles", () => {
    expect(redact("Write to tom.lee+pets@mail.example.com or see https://example.com/me and follow @tom_lee.")).toBe(
      "Write to [email] or see [link] and follow [handle].",
    );
    expect(redact("www.example.org is mine")).toBe("[link] is mine");
  });

  it("replaces phone numbers in common shapes, not short numbers or years", () => {
    expect(redact("Call 555-123-4567, +44 20 7946 0958 or 13812345678.")).toBe("Call [phone], [phone] or [phone].");
    expect(redact("In 2026 I read 12 books and 300 pages.")).toBe("In 2026 I read 12 books and 300 pages.");
  });

  it("replaces street addresses in English and Chinese", () => {
    expect(redact("I live at 42 Maple Street. It is quiet.")).toBe("I live at [address] It is quiet.");
    expect(redact("我家住在中山路128号3单元。")).toBe("我家住在中山路[address]。");
  });

  it("replaces names that a phrase introduces, and keeps the phrase", () => {
    expect(redact("Hello, my name is Anna Smith and my dog is called Max.")).toBe("Hello, my name is [name] and my dog is called [name].");
    expect(redact("大家好，我叫王小明，今年十岁。")).toBe("大家好，我叫[name]，今年十岁。");
  });

  it("keeps ordinary writing as it is", () => {
    const text = "Dogs make good pets because they are loyal. A game called chess is hard, but I am learning it.";
    expect(redact(text)).toBe(text);
  });
});
