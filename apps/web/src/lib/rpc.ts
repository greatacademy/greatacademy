import { Code, ConnectError, createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { AccountService } from "@ga/proto/account/v1/account_pb";
import { AdminService } from "@ga/proto/admin/v1/admin_pb";
import { BillingService } from "@ga/proto/billing/v1/billing_pb";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { ConversationService } from "@ga/proto/conversation/v1/conversation_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";
import { PrivacyService } from "@ga/proto/privacy/v1/privacy_pb";

// Calls go to the same origin, so the session cookie is sent with them. They
// are made from the browser only: pages fetch their data after hydration.
const transport = createConnectTransport({ baseUrl: "/api/rpc" });

export const account = createClient(AccountService, transport);
export const catalog = createClient(CatalogService, transport);
export const learning = createClient(LearningService, transport);
export const privacy = createClient(PrivacyService, transport);
export const admin = createClient(AdminService, transport);
export const billing = createClient(BillingService, transport);
export const conversation = createClient(ConversationService, transport);

/** isNotFound reports whether a call failed because what it asked for does not exist. */
export const isNotFound = (error: unknown) => ConnectError.from(error).code === Code.NotFound;

/** isNotCurrent reports whether a call failed because the course it names is not the learner's current course. */
export const isNotCurrent = (error: unknown) => ConnectError.from(error).code === Code.FailedPrecondition;

/** shouldRetry lets a query try once more, unless asking again cannot help: what it asked for does not exist, or is not the current course. */
export const shouldRetry = (failures: number, error: unknown) => failures < 1 && !isNotFound(error) && !isNotCurrent(error);

/** timeZone is the browser's IANA time zone, which decides what "today" means for XP. */
export const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** failureCode is the code of a failed call. */
export const failureCode = (error: unknown) => ConnectError.from(error).code;
