import type { Api, Model } from "@earendil-works/pi-ai";
import { builtinProviders } from "@earendil-works/pi-ai/providers/all";

import { SUPPORTED_APIS } from "./provider.ts";

/** CatalogProvider is a named vendor of pi-ai's built-in catalog that an administrator can pick, with its own endpoint and models. */
export interface CatalogProvider {
  /** id is pi-ai's provider id, such as "deepseek"; it never changes for a vendor. */
  readonly id: string;
  readonly name: string;
  readonly api: string;
  readonly baseUrl: string;
  readonly models: readonly Model<Api>[];
}

/**
 * SUBSCRIPTION_PROVIDERS are built-in providers sold as a person's subscription
 * for coding tools, or only reachable with a person's sign-in; a service that
 * judges learners' writing must not call them.
 */
const SUBSCRIPTION_PROVIDERS = new Set([
  "github-copilot",
  "openai-codex",
  "kimi-coding",
  "zai",
  "zai-coding-cn",
  "qwen-token-plan",
  "qwen-token-plan-cn",
  "qwen-token-plan-individual",
  "xiaomi-token-plan-ams",
  "xiaomi-token-plan-cn",
  "xiaomi-token-plan-sgp",
  "opencode",
  "opencode-go",
  "radius",
]);

/**
 * catalogOf keeps of a provider the models served by one supported API at one
 * fixed endpoint, the largest such group, since an administrator configures a
 * vendor as one API and one base URL; it is undefined when none qualifies.
 */
function catalogOf(id: string, name: string, models: readonly Model<Api>[]): CatalogProvider | undefined {
  const groups = new Map<string, Model<Api>[]>();
  for (const m of models) {
    if (!SUPPORTED_APIS[m.api] || !m.baseUrl.startsWith("https://") || m.baseUrl.includes("{")) continue;
    const key = `${m.api} ${m.baseUrl}`;
    groups.set(key, [...(groups.get(key) ?? []), m]);
  }
  const largest = [...groups.values()].sort((a, b) => b.length - a.length)[0];
  const first = largest?.[0];
  if (!largest || !first) return undefined;
  return { id, name, api: first.api, baseUrl: first.baseUrl, models: [...largest].sort((a, b) => a.name.localeCompare(b.name)) };
}

let built: readonly CatalogProvider[] | undefined;

/**
 * catalogProviders are the named vendors an administrator can pick: pi-ai's
 * built-in providers that take an API key, minus personal subscriptions,
 * sorted by name. Picking one fills in its API, endpoint and models; the key,
 * budgets and markets stay the administrator's.
 */
export function catalogProviders(): readonly CatalogProvider[] {
  built ??= builtinProviders()
    .filter((p) => p.auth.apiKey && !SUBSCRIPTION_PROVIDERS.has(p.id))
    .map((p) => catalogOf(p.id, p.name, p.getModels()))
    .filter((p): p is CatalogProvider => p !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name));
  return built;
}

/** catalogVendor is a named vendor of the catalog, or undefined when the catalog has no vendor with the id. */
export function catalogVendor(providerId: string): CatalogProvider | undefined {
  return catalogProviders().find((p) => p.id === providerId);
}

/** catalogModel is a model of a named vendor in the catalog, or undefined when the vendor or the model is not there. */
export function catalogModel(providerId: string, modelId: string): Model<Api> | undefined {
  return catalogVendor(providerId)?.models.find((m) => m.id === modelId);
}
