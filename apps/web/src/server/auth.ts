import { type Db, schema } from "@ga/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { resetPasswordEmail, type SendEmail, verifyEmail } from "./email.ts";

/**
 * createAuth configures better-auth on a request's database. Accounts are
 * email and password; sessions are cookies on the web. A learner can study
 * before verifying the email address, which only recovery depends on.
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
    user: { deleteUser: { enabled: true } },
    session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  });
}
