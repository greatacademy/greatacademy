import { type Api, createModels, createProvider, type Model, type Models, type ProviderStreams } from "@earendil-works/pi-ai";
import { anthropicMessagesApi } from "@earendil-works/pi-ai/api/anthropic-messages.lazy";
import { googleGenerativeAIApi } from "@earendil-works/pi-ai/api/google-generative-ai.lazy";
import { mistralConversationsApi } from "@earendil-works/pi-ai/api/mistral-conversations.lazy";
import { openAICompletionsApi } from "@earendil-works/pi-ai/api/openai-completions.lazy";
import { openAIResponsesApi } from "@earendil-works/pi-ai/api/openai-responses.lazy";

import { catalogVendor } from "./catalog.ts";

/** SUPPORTED_APIS are the wire protocols an administrator can choose for a provider; a new one needs code. */
export const SUPPORTED_APIS: Readonly<Record<string, () => ProviderStreams>> = {
  "anthropic-messages": anthropicMessagesApi,
  "openai-completions": openAICompletionsApi,
  "openai-responses": openAIResponsesApi,
  "google-generative-ai": googleGenerativeAIApi,
  "mistral-conversations": mistralConversationsApi,
};

/** DEFAULT_BASE_URLS are the vendors' own endpoints, used when a provider leaves its base URL empty. */
export const DEFAULT_BASE_URLS: Readonly<Record<string, string>> = {
  "anthropic-messages": "https://api.anthropic.com",
  "openai-completions": "https://api.openai.com/v1",
  "openai-responses": "https://api.openai.com/v1",
  "google-generative-ai": "https://generativelanguage.googleapis.com/v1beta",
  "mistral-conversations": "https://api.mistral.ai",
};

/** GATEWAY_HOST is the host of Cloudflare AI Gateway, which a provider's base URL may point at. */
export const GATEWAY_HOST = "gateway.ai.cloudflare.com";

/** viaGateway tells whether a base URL goes through Cloudflare AI Gateway. */
export function viaGateway(baseUrl: string): boolean {
  try {
    return new URL(baseUrl).hostname === GATEWAY_HOST;
  } catch {
    return false;
  }
}

/**
 * gatewayHeaders are the headers of a call through AI Gateway. The gateway logs
 * the call's model, tokens, cost, status and duration but not its request or
 * response, so it keeps no learner's text; the metadata lets its log be read by
 * use, criterion and prompt, and never names a learner.
 */
export function gatewayHeaders(meta: Readonly<Record<string, string>>): Record<string, string> {
  return { "cf-aig-collect-log-payload": "false", "cf-aig-metadata": JSON.stringify(meta) };
}

/** ProviderConfig is a provider as an administrator configured it, with its key decrypted on the server. */
export interface ProviderConfig {
  readonly id: string;
  readonly name: string;
  readonly api: string;
  readonly baseUrl: string;
  readonly apiKey: string;
  /** catalog is the id of the named vendor in pi-ai's catalog it was picked from, or empty for one configured by hand. */
  readonly catalog?: string;
}

/** Configured is a Models collection holding one configured provider, and the model a route names. */
export interface Configured {
  readonly models: Models;
  readonly model: Model<Api>;
  /** gateway tells whether calls go through Cloudflare AI Gateway. */
  readonly gateway: boolean;
}

/**
 * configure builds a pi-ai provider from an administrator's configuration, with
 * the key given explicitly so nothing is read from the environment. A model of
 * a vendor picked from the catalog keeps the catalog's limits and request
 * settings, at the configured base URL. Any other model need not be in a
 * catalog: its limits are generous guesses, and its cost is left at zero, as
 * every cost is, since costs come from the prices administrators set.
 */
export function configure(config: ProviderConfig, modelId: string): Configured {
  const api = SUPPORTED_APIS[config.api];
  if (!api) throw new Error(`unsupported api ${config.api}`);
  const vendor = config.catalog ? catalogVendor(config.catalog) : undefined;
  const baseUrl = config.baseUrl || vendor?.baseUrl || DEFAULT_BASE_URLS[config.api] || "";
  const known = vendor?.models.find((m) => m.id === modelId);
  const zero = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  const model: Model<Api> = known
    ? { ...known, api: config.api as Api, provider: config.id, baseUrl, cost: zero }
    : {
        id: modelId,
        name: modelId,
        api: config.api as Api,
        provider: config.id,
        baseUrl,
        reasoning: false,
        input: ["text"],
        cost: zero,
        contextWindow: 128_000,
        maxTokens: 4_096,
      };
  const key = config.apiKey;
  const gateway = viaGateway(baseUrl);
  const provider = createProvider({
    id: config.id,
    name: config.name,
    baseUrl,
    auth: { apiKey: { name: `${config.name} key`, resolve: async () => ({ auth: { apiKey: key }, source: "admin console" }) } },
    models: [model],
    api: api(),
  });
  const models = createModels();
  models.setProvider(provider);
  return { models, model, gateway };
}
