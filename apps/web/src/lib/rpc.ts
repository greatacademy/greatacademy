import { Code, ConnectError, createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";

// Calls go to the same origin, so the session cookie is sent with them. They
// are made from the browser only: pages fetch their data after hydration.
const transport = createConnectTransport({ baseUrl: "/api/rpc" });

export const catalog = createClient(CatalogService, transport);
export const learning = createClient(LearningService, transport);

/** isNotFound reports whether a call failed because what it asked for does not exist. */
export const isNotFound = (error: unknown) => ConnectError.from(error).code === Code.NotFound;

/** isNotEnrolled reports whether a call failed because the learner has not enrolled in the course it names. */
export const isNotEnrolled = (error: unknown) => ConnectError.from(error).code === Code.FailedPrecondition;

/** shouldRetry lets a query try once more, unless asking again cannot help: what it asked for does not exist, or the learner has not enrolled. */
export const shouldRetry = (failures: number, error: unknown) => failures < 1 && !isNotFound(error) && !isNotEnrolled(error);

/** timeZone is the browser's IANA time zone, which decides what "today" means for XP. */
export const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
