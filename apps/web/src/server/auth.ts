import { Code, ConnectError } from "@connectrpc/connect";
import { type ChildAccounts, usernamePattern } from "@ga/api";
import { type Db, isManagedUser, schema, soleManagedChildren } from "@ga/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { bearer, username } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import type { SendEmail } from "./email.ts";
import { type Locale, requestLocale, resetPasswordEmail, verifyEmail } from "./templates.ts";

/** usernameForm is the form a username is stored and looked up in: Unicode NFC, lowercase. */
const usernameForm = (name: string) => name.trim().normalize("NFC").toLowerCase();

/** emailLocale is the language of an email a person asked for: that of their request, else the one they last used, else English. */
const emailLocale = (request: Request | undefined, stored: unknown): Locale =>
  requestLocale(request?.headers) ?? (stored === "zh-CN" || stored === "en" ? stored : "en");

/**
 * createAuth configures better-auth on a request's database. Every account has
 * a name, seen only by the person and their guardians, and a username, which
 * signs in as the email address does and is the learner's name in leagues. A
 * child's account, which a guardian makes, has no real address and signs in
 * with its username only; sessions are cookies on the web and signed bearer tokens in the native apps. A
 * learner can study before verifying the email address, which only recovery
 * depends on. A child cannot delete their whole account, and a guardian's
 * deletion takes the accounts of the children only they guard. endPlans stops
 * what the person pays for from renewing before their plans' rows go.
 */
export function createAuth(
  db: Db,
  secret: string,
  baseURL: string,
  sendEmail: SendEmail,
  endPlans: (userId: string) => Promise<void> = async () => {},
) {
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
      sendResetPassword: ({ user, url }, request) =>
        sendEmail(resetPasswordEmail(user.email, url, emailLocale(request, (user as { locale?: unknown }).locale))),
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: ({ user, url }, request) =>
        sendEmail(verifyEmail(user.email, url, emailLocale(request, (user as { locale?: unknown }).locale))),
    },
    plugins: [
      username({
        minUsernameLength: 3,
        maxUsernameLength: 20,
        usernameValidator: (name) => usernamePattern.test(name),
        usernameNormalization: usernameForm,
        validationOrder: { username: "post-normalization" },
      }),
      bearer({ requireSignature: true }),
    ],
    databaseHooks: {
      user: {
        create: {
          before: async (user, ctx) => {
            const name = typeof user.name === "string" ? user.name.trim() : "";
            if (!name) throw new APIError("BAD_REQUEST", { message: "enter your name" });
            if (typeof user.username !== "string" || !user.username) throw new APIError("BAD_REQUEST", { message: "choose a username" });
            const locale = requestLocale(ctx?.headers ?? ctx?.request?.headers);
            return { data: { ...user, name, ...(locale && { locale }) } };
          },
        },
        update: {
          before: async (user) => {
            if (user.name === undefined) return;
            const name = typeof user.name === "string" ? user.name.trim() : "";
            if (!name) throw new APIError("BAD_REQUEST", { message: "enter your name" });
            return { data: { ...user, name } };
          },
        },
      },
    },
    user: {
      additionalFields: { locale: { type: "string", required: false, input: false } },
      deleteUser: {
        enabled: true,
        beforeDelete: async ({ id }) => {
          if (await isManagedUser(db, id)) throw new APIError("FORBIDDEN", { message: "a guardian deletes a child's account" });
          await endPlans(id);
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
    async create(name, display, password) {
      const username = usernameForm(display);
      const taken = await db.select({ id: schema.user.id }).from(schema.user).where(eq(schema.user.username, username));
      if (taken.length > 0) throw new ConnectError("that username is taken", Code.AlreadyExists);
      const ctx = await auth.$context;
      const user = await ctx.internalAdapter.createUser(
        {
          name,
          email: `${crypto.randomUUID()}@child.invalid`,
          emailVerified: true,
          username,
          displayUsername: display,
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
