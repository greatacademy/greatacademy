import { Code, ConnectError } from "@connectrpc/connect";
import type { ChildAccounts } from "@ga/api";
import { type Db, isManagedUser, schema, soleManagedChildren } from "@ga/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { username } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { resetPasswordEmail, type SendEmail, verifyEmail } from "./email.ts";

/**
 * createAuth configures better-auth on a request's database. Accounts are
 * email and password, or a username for a child's account, which a guardian
 * makes and which has no real address; sessions are cookies on the web. A
 * learner can study before verifying the email address, which only recovery
 * depends on. A child cannot delete their whole account, and a guardian's
 * deletion takes the accounts of the children only they guard.
 */
export function createAuth(db: Db, secret: string, baseURL: string, sendEmail: SendEmail) {
  return betterAuth({
    baseURL,
    basePath: "/api/auth",
    secret,
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      resetPasswordTokenExpiresIn: 60 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: ({ user, url }) => sendEmail(resetPasswordEmail(user.email, url)),
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: ({ user, url }) => sendEmail(verifyEmail(user.email, url)),
    },
    plugins: [username()],
    user: {
      deleteUser: {
        enabled: true,
        beforeDelete: async ({ id }) => {
          if (await isManagedUser(db, id)) throw new APIError("FORBIDDEN", { message: "a guardian deletes a child's account" });
          for (const child of await soleManagedChildren(db, id)) await db.delete(schema.user).where(eq(schema.user.id, child));
        },
      },
    },
    session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  });
}

/** childAccounts gives libs/api the account operations that only better-auth can do. */
export function childAccounts(auth: ReturnType<typeof createAuth>, db: Db): ChildAccounts {
  return {
    async create(name, password) {
      const taken = await db.select({ id: schema.user.id }).from(schema.user).where(eq(schema.user.username, name));
      if (taken.length > 0) throw new ConnectError("that username is taken", Code.AlreadyExists);
      const ctx = await auth.$context;
      const user = await ctx.internalAdapter.createUser(
        {
          name,
          email: `${crypto.randomUUID()}@child.invalid`,
          emailVerified: true,
          username: name,
          displayUsername: name,
        },
        { method: "guardian" },
      );
      await ctx.internalAdapter.linkAccount({
        userId: user.id,
        providerId: "credential",
        accountId: user.id,
        password: await ctx.password.hash(password),
      });
      return user.id;
    },
    async setPassword(userId, password) {
      const ctx = await auth.$context;
      await ctx.internalAdapter.updatePassword(userId, await ctx.password.hash(password));
      await ctx.internalAdapter.deleteUserSessions(userId);
    },
  };
}
