import { describe, expect, it } from "vitest";

import { catalogModel, catalogProviders } from "./catalog.ts";
import { configure, SUPPORTED_APIS } from "./provider.ts";

describe("catalogProviders", () => {
  const list = catalogProviders();

  it("offers named vendors with a supported API and a fixed https endpoint", () => {
    expect(list.map((p) => p.id)).toEqual(expect.arrayContaining(["anthropic", "openai", "google", "deepseek", "mistral", "minimax-cn"]));
    for (const p of list) {
      expect(SUPPORTED_APIS[p.api], p.id).toBeDefined();
      expect(p.baseUrl, p.id).toMatch(/^https:\/\/[^{}]+$/);
      expect(p.models.length, p.id).toBeGreaterThan(0);
      for (const m of p.models) expect([m.api, m.baseUrl], `${p.id}/${m.id}`).toEqual([p.api, p.baseUrl]);
    }
  });

  it("leaves out personal subscriptions and sign-in-only vendors", () => {
    const ids = list.map((p) => p.id);
    for (const id of ["github-copilot", "openai-codex", "kimi-coding", "qwen-token-plan", "opencode"]) expect(ids).not.toContain(id);
  });
});

describe("configure", () => {
  const config = { id: "p-1", name: "DeepSeek", api: "openai-completions", baseUrl: "", apiKey: "k" };

  it("keeps a catalog model's limits and settings at the configured endpoint, with no cost", () => {
    const known = catalogProviders().find((p) => p.id === "deepseek")!.models[0]!;
    const { model } = configure({ ...config, catalog: "deepseek", baseUrl: "https://gateway.ai.cloudflare.com/v1/a/g/deepseek" }, known.id);
    expect(model.contextWindow).toBe(known.contextWindow);
    expect(model.compat).toEqual(known.compat);
    expect(model.provider).toBe("p-1");
    expect(model.baseUrl).toBe("https://gateway.ai.cloudflare.com/v1/a/g/deepseek");
    expect(model.cost.input).toBe(0);
  });

  it("takes a model the catalog does not know with generous limits", () => {
    expect(catalogModel("deepseek", "no-such-model")).toBeUndefined();
    const { model } = configure({ ...config, catalog: "deepseek" }, "no-such-model");
    expect(model.contextWindow).toBe(128_000);
    expect(model.baseUrl).toBe("https://api.deepseek.com");
  });
});
