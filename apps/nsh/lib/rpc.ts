import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";

/**
 * API_URL is the web app's Worker, which serves the API. In development that is
 * the Vite dev server: the desktops and the iOS simulator reach it at localhost,
 * and Android after `adb reverse tcp:5173 tcp:5173`.
 */
export const API_URL = "http://localhost:5173";

const transport = createConnectTransport({ baseUrl: `${API_URL}/api/rpc` });

/** catalog is the client of the course catalog, which needs no account. */
export const catalog = createClient(CatalogService, transport);
