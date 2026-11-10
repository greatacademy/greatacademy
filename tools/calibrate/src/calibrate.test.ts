import { createModels, fauxAssistantMessage, fauxProvider, fauxToolCall, type JsonObject } from "@earendil-works/pi-ai";
import { encryptSecret } from "@ga/api";
import { createProvider, type Db, schema, setPrice } from "@ga/db";
import { createTestDb } from "@ga/db/testing";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { ScoredText } from "./agreement.ts";
import { renderReport, runCalibration } from "./calibrate.ts";

const SECRET = "test-secret-for-keys-0123456789";
const criterion = { id: "states-point", version: "1", question: "Does the paragraph state its point first?", quoteWhenMet: false };
const AT = new Date(Date.UTC(2026, 10, 1));

const respond = (met: boolean) =>
  fauxAssistantMessage(
    [
      fauxToolCall("respond", {
        criteria: [{ id: "states-point", met, quotation: "", note: "The first sentence." }],
        feedback: [],
      } as JsonObject),
    ],
    { stopReason: "toolUse" },
  );

const text = (id: string, people: [boolean, boolean]): ScoredText => ({
  id,
  task: { prompt: "Write about a pet.", modelAnswer: "Cats are easy pets." },
  text: `Text ${id} about a pet.`,
  scores: { "states-point@1": people, "other@1": [true, true] },
});

let db: Db & { close(): Promise<void> };
let providerId: string;
let faux: ReturnType<typeof fauxProvider>;

beforeEach(async () => {
  db = await createTestDb();
  providerId = await createProvider(db, {
    name: "Vendor",
    kind: "model",
    api: "openai-completions",
    keyCipher: await encryptSecret(SECRET, "test-key"),
    enabled: true,
    createdAt: AT,
    updatedAt: AT,
  });
  faux = fauxProvider();
});
afterEach(() => db.close());

const run = (set: ScoredText[], minTexts: number) =>
  runCalibration(
    db,
    {
      criterion,
      providerId,
      model: "m1",
      promptVersion: "writing-1",
      set,
      aiKeysSecret: SECRET,
      concurrency: 1,
      minTexts,
      connect: (config) => {
        expect(config.apiKey).toBe("test-key");
        const models = createModels();
        models.setProvider(faux.provider);
        return { models, model: faux.getModel() };
      },
    },
    AT,
  );

describe("runCalibration", () => {
  it("judges each scored text on the criterion alone and records a passing calibration", async () => {
    faux.setResponses([respond(true), respond(true), respond(false), respond(false)]);
    const report = await run([text("a", [true, true]), text("b", [true, false]), text("c", [false, false]), text("d", [false, false])], 4);
    expect(report).toMatchObject({ key: "states-point@1", texts: 4, passed: true, failed: [] });
    expect(report.kappa).toBeCloseTo(0.75);
    const [row] = await db.select().from(schema.calibration);
    expect(row).toMatchObject({ criterion: "states-point@1", providerId, model: "m1", promptVersion: "writing-1", passed: true });
    const rendered = renderReport(report, { providerName: "Vendor", model: "m1", promptVersion: "writing-1" });
    expect(rendered).toContain("| 4 | 0.750 | 0.500 | yes |");
    expect(rendered).toContain("Cost: unknown");
    const calls = await db.select().from(schema.aiCall);
    expect(calls.map((c) => [c.use, c.ok, c.cost, c.learnerId])).toEqual(Array(4).fill(["calibration", true, 0, null]));
  });

  it("records each call at the model's price, failed ones too, so the run counts against the budget", async () => {
    await setPrice(db, { providerId, model: "m1", inputPerMillion: 2, outputPerMillion: 8, updatedAt: AT });
    faux.setResponses([respond(true)]);
    const report = await run([text("a", [true, true]), text("b", [false, false])], 2);
    const calls = await db.select().from(schema.aiCall);
    expect(calls.map((c) => c.ok)).toEqual([true, false, false]);
    const cost = calls.reduce((t, c) => t + (c.inputTokens * 2 + c.outputTokens * 8) / 1e6, 0);
    expect(report.priced).toBe(true);
    expect(report.usage.cost).toBeCloseTo(cost, 12);
    expect(calls.reduce((t, c) => t + c.cost, 0)).toBeCloseTo(cost, 12);
  });

  it("tries a failing text again, then counts it against the route and records a failed calibration", async () => {
    // The first text gets one response; the second finds none left, twice.
    faux.setResponses([respond(true)]);
    const report = await run([text("a", [true, true]), text("b", [false, false])], 2);
    expect(report.failed).toEqual([{ id: "b", reason: "provider-error" }]);
    expect(report.disagreements).toEqual(["b"]);
    expect(report.passed).toBe(false);
    const [row] = await db.select().from(schema.calibration);
    expect(row?.passed).toBe(false);
  });

  it("refuses a set with no text scored on the criterion", async () => {
    await expect(run([{ ...text("a", [true, true]), scores: {} }], 1)).rejects.toThrow("no text of the set is scored on states-point@1");
  });
});
