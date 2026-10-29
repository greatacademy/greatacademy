import { type Db, schema } from "@ga/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

/**
 * createAuth configures better-auth on a request's database. Accounts are
 * email and password for now; sessions are cookies on the web.
 */
export function createAuth(db: Db, secret: string, baseURL: string) {
  return betterAuth({
    baseURL,
    basePath: "/api/auth",
    secret,
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  });
}
