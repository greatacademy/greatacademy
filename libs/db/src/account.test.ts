import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localeOfEmail, setUserLocale } from "./account.ts";
import { createTestDb, createUser } from "./testing.ts";

describe("user locale", () => {
  let db: Awaited<ReturnType<typeof createTestDb>>;
  beforeAll(async () => {
    db = await createTestDb();
    await createUser(db, "u1");
  });
  afterAll(() => db.close());

  it("is unknown until recorded, then follows the last language used", async () => {
    expect(await localeOfEmail(db, "u1@example.com")).toBeUndefined();
    await setUserLocale(db, "u1", "zh-CN");
    expect(await localeOfEmail(db, "u1@example.com")).toBe("zh-CN");
    await setUserLocale(db, "u1", "en");
    expect(await localeOfEmail(db, "u1@example.com")).toBe("en");
    expect(await localeOfEmail(db, "nobody@example.com")).toBeUndefined();
  });
});
