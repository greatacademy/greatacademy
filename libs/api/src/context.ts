import { createContextKey } from "@connectrpc/connect";
import type { Db } from "@ga/db";

/** userIdKey carries the id of the signed-in user, set by the host after authenticating the request. */
export const userIdKey = createContextKey<string | undefined>(undefined, { description: "signed-in user id" });

/** dbKey carries the request's database client, opened by the host. */
export const dbKey = createContextKey<Db | undefined>(undefined, { description: "database client" });

/** ChildAccounts creates and changes the sign-in of children's accounts, which only the host's auth library can do. */
export interface ChildAccounts {
  /** create makes an account signing in with a username, and returns its user id; a taken username throws AlreadyExists. */
  create(username: string, password: string): Promise<string>;
  /** setPassword replaces an account's password and ends its sessions. */
  setPassword(userId: string, password: string): Promise<void>;
}

/** accountsKey carries the request's account operations, set by the host. */
export const accountsKey = createContextKey<ChildAccounts | undefined>(undefined, { description: "child accounts" });
