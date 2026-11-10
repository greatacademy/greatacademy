import { type Api, createModels, createProvider, type Model, type Models, type ProviderStreams } from "@earendil-works/pi-ai";
import { anthropicMessagesApi } from "@earendil-works/pi-ai/api/anthropic-messages.lazy";
import { googleGenerativeAIApi } from "@earendil-works/pi-ai/api/google-generative-ai.lazy";
import { mistralConversationsApi } from "@earendil-works/pi-ai/api/mistral-conversations.lazy";
import { openAICompletionsApi } from "@earendil-works/pi-ai/api/openai-completions.lazy";
import { openAIResponsesApi } from "@earendil-works/pi-ai/api/openai-responses.lazy";

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

/** ProviderConfig is a provider as an administrator configured it, with its key decrypted on the server. */
export interface ProviderConfig {
  readonly id: string;
  readonly name: string;
  readonly api: string;
  readonly baseUrl: string;
  readonly apiKey: string;
}

/** Configured is a Models collection holding one configured provider, and the model a route names. */
export interface Configured {
  readonly models: Models;
  readonly model: Model<Api>;
}

/**
 * configure builds a pi-ai provider from an administrator's configuration, with
 * the key given explicitly so nothing is read from the environment. The model
 * need not be in any catalog: its cost is unknown here, so cost is left at zero
 * and limits are generous; token counts still come from the provider.
 */
export function configure(config: ProviderConfig, modelId: string): Configured {
  const api = SUPPORTED_APIS[config.api];
  if (!api) throw new Error(`unsupported api ${config.api}`);
  const baseUrl = config.baseUrl || DEFAULT_BASE_URLS[config.api] || "";
  const model: Model<Api> = {
    id: modelId,
    name: modelId,
    api: config.api as Api,
    provider: config.id,
    baseUrl,
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128_000,
    maxTokens: 4_096,
  };
  const key = config.apiKey;
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
  return { models, model };
}
