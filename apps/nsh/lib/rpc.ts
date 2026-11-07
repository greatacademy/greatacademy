import { type Client, createClient, type Interceptor } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { PrivacyService } from "@ga/proto/privacy/v1/privacy_pb";

import { token } from "./session.ts";

/**
 * API_URL is the web app's Worker, which serves the API. In development that is
 * the Vite dev server: the desktops and the iOS simulator reach it at localhost,
 * and Android after `adb reverse tcp:5173 tcp:5173`.
 */
export const API_URL = "http://localhost:5173";

const withToken: Interceptor = (next) => (request) => {
  const current = token();
  if (current) request.header.set("Authorization", `Bearer ${current}`);
  return next(request);
};

const transport = createConnectTransport({ baseUrl: `${API_URL}/api/rpc`, interceptors: [withToken] });

/** catalog is the client of the course catalog, which needs no account. */
export const catalog: Client<typeof CatalogService> = createClient(CatalogService, transport);

/** privacy is the client of age bands, consent and access. */
export const privacy: Client<typeof PrivacyService> = createClient(PrivacyService, transport);
