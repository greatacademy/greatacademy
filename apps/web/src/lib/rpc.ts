import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";

// Calls go to the same origin, so the session cookie is sent with them. They
// are made from the browser only: pages fetch their data after hydration.
const transport = createConnectTransport({ baseUrl: "/api/rpc" });

export const catalog = createClient(CatalogService, transport);
export const learning = createClient(LearningService, transport);

/** timeZone is the browser's IANA time zone, which decides what "today" means for XP. */
export const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
