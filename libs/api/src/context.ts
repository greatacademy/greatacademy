import { createContextKey } from "@connectrpc/connect";
import type { Db } from "@ga/db";

/** userIdKey carries the id of the signed-in user, set by the host after authenticating the request. */
export const userIdKey = createContextKey<string | undefined>(undefined, { description: "signed-in user id" });

/** dbKey carries the request's database client, opened by the host. */
export const dbKey = createContextKey<Db | undefined>(undefined, { description: "database client" });
