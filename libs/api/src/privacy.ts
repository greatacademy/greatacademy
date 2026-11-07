import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import {
  type AgeBand,
  addGuardian,
  approvedVerification,
  assentConsent,
  type ConsentScope,
  clearResponses,
  consentsOf,
  contactsOf,
  type Db,
  deleteUserData,
  exportLearner,
  isGuardian,
  isPlatformAdmin,
  latestVerification,
  learnerAge,
  learnerFor,
  recordConsent,
  setDailyMinutes,
  setLearnerAge,
  setManaged,
  submitVerification,
  userOfLearner,
  withdrawConsent,
} from "@ga/db";
import { AccessStatus, Band as BandMessage, type PrivacyService } from "@ga/proto/privacy/v1/privacy_pb";

import { type Access, accessOf, currentNotice, marketOpenToMinors, scopeOffered } from "./capabilities.ts";
import { accountsKey, dbKey, userIdKey } from "./context.ts";
import { AI_SCOPES, ASSENT_SCOPES, ageBand, consentExpiry, isKnownCountry, MARKETS, movedBand, nextBand } from "./markets.ts";

/** FormStore keeps guardians' signed forms while they wait for a decision. */
export interface FormStore {
  put(key: string, form: Uint8Array, contentType: string): Promise<void>;
  get(key: string): Promise<Uint8Array | undefined>;
  delete(key: string): Promise<void>;
}

/** NoticeKind is a message the privacy rules send to a person. */
export type NoticeKind = "consent-expiring" | "child-reduced" | "account-inactive" | "verification-decided";

/** Notify tells a person something; it never carries a learner's text. */
export type Notify = (to: string, kind: NoticeKind) => Promise<void>;

/** PrivacyDeps are the privacy service's dependencies besides the request context. */
export interface PrivacyDeps {
  /** now is the clock, in milliseconds since the epoch. */
  now(): number;
  readonly forms: FormStore;
  readonly notify: Notify;
}

/** MAX_FORM_BYTES bounds an uploaded signed form. */
export const MAX_FORM_BYTES = 5 * 1024 * 1024;

const formTypes = ["application/pdf", "image/png", "image/jpeg"];
const allScopes: readonly ConsentScope[] = ["basic", "writing", "speech", "conversation", "research"];

const bandMessage = (band: AgeBand | null | undefined): BandMessage =>
  band === "child"
    ? BandMessage.CHILD
    : band === "teen"
      ? BandMessage.TEEN
      : band === "adult"
        ? BandMessage.ADULT
        : BandMessage.UNSPECIFIED;

const statusMessage: Record<Access["status"], AccessStatus> = {
  ok: AccessStatus.OK,
  "needs-age": AccessStatus.NEEDS_AGE,
  "market-closed": AccessStatus.MARKET_CLOSED,
  "needs-guardian": AccessStatus.NEEDS_GUARDIAN,
};

function database(ctx: HandlerContext): Db {
  const db = ctx.values.get(dbKey);
  if (!db) throw new ConnectError("no database", Code.Internal);
  return db;
}

function auth(ctx: HandlerContext): { db: Db; userId: string } {
  const userId = ctx.values.get(userIdKey);
  if (!userId) throw new ConnectError("sign in first", Code.Unauthenticated);
  return { db: database(ctx), userId };
}

function checkCountry(country: string): string {
  if (!isKnownCountry(country)) throw new ConnectError("unknown country", Code.InvalidArgument);
  return country;
}

function checkPassword(password: string): void {
  if (password.length < 8 || password.length > 128) throw new ConnectError("the password needs 8 to 128 characters", Code.InvalidArgument);
}

function checkScope(scope: string): ConsentScope {
  const found = allScopes.find((s) => s === scope);
  if (!found) throw new ConnectError("unknown scope", Code.InvalidArgument);
  return found;
}

/** privacyService implements PrivacyService. */
export function privacyService(deps: PrivacyDeps): ServiceImpl<typeof PrivacyService> {
  /** subject resolves whom a call is about: the caller, or a learner the caller guards. */
  const subject = async (ctx: HandlerContext, learnerId: string) => {
    const { db, userId } = auth(ctx);
    if (!learnerId) return { db, userId, learnerId: await learnerFor(db, userId), self: true };
    if (!(await isGuardian(db, userId, learnerId))) throw new ConnectError("no such learner", Code.NotFound);
    return { db, userId, learnerId, self: false };
  };

  /** guardianMethod returns how the caller was verified, if they are an adult who can consent for a child. */
  const guardianMethod = async (db: Db, userId: string): Promise<string | undefined> => {
    if ((await learnerAge(db, await learnerFor(db, userId))).band !== "adult") return undefined;
    return approvedVerification(db, userId);
  };

  /** managedChild checks that the caller guards a child's account they can run. */
  const managedChild = async (ctx: HandlerContext, learnerId: string) => {
    const s = await subject(ctx, learnerId);
    if (s.self || !(await learnerAge(s.db, s.learnerId)).managed) throw new ConnectError("no such child's account", Code.NotFound);
    return s;
  };

  /** tellGuardians tells a child's guardians, without the child, that the child cut something back. */
  const tellGuardians = async (db: Db, learnerId: string, self: boolean) => {
    if (!self || (await learnerAge(db, learnerId)).band !== "child") return;
    await Promise.all((await contactsOf(db, learnerId)).map((to) => deps.notify(to, "child-reduced")));
  };

  /** canGrant says whether this caller can grant this scope to this learner now. */
  const canGrant = async (db: Db, userId: string, learnerId: string, self: boolean, scope: ConsentScope): Promise<boolean> => {
    const age = await learnerAge(db, learnerId);
    if (!age.band || age.band === "adult" || !age.country) return false;
    if (scope !== "basic" && !AI_SCOPES.includes(scope)) return false;
    if (!(await marketOpenToMinors(db, age.country))) return false;
    if (!(await scopeOffered(db, age.country, scope, deps.now()))) return false;
    if (age.band === "teen") return self && scope !== "basic";
    return !self && (await guardianMethod(db, userId)) !== undefined;
  };

  return {
    async listCountries() {
      return { countries: MARKETS.map((m) => m.country) };
    },

    async checkAge(req, ctx) {
      const band = ageBand(checkCountry(req.country), req.birthYear, req.birthMonth, deps.now());
      if (!band) throw new ConnectError("that date is not valid", Code.InvalidArgument);
      const closed = band.band !== "adult" && !(await marketOpenToMinors(database(ctx), req.country));
      return { band: bandMessage(band.band), closed };
    },

    async getAccess(_req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      const access = await accessOf(db, learnerId, now);
      const { age } = access;
      const next = age.band ? nextBand(age.band, age.bandEndsAt?.getTime() ?? null, age.country ?? "", now) : undefined;
      return {
        status: statusMessage[access.status],
        band: bandMessage(age.band),
        bandEndsAt: BigInt(age.bandEndsAt?.getTime() ?? 0),
        country: age.country ?? "",
        nextBand: bandMessage(next?.band),
        scopes: [...access.scopes],
        managed: age.managed,
        dailyMinutes: age.dailyMinutes ?? 0,
        admin: await isPlatformAdmin(db, userId),
      };
    },

    async setAge(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      if ((await learnerAge(db, learnerId)).band) throw new ConnectError("the age question has been answered", Code.FailedPrecondition);
      const band = ageBand(checkCountry(req.country), req.birthYear, req.birthMonth, deps.now());
      if (!band) throw new ConnectError("that date is not valid", Code.InvalidArgument);
      await setLearnerAge(db, learnerId, {
        band: band.band,
        bandEndsAt: band.endsAt === null ? null : new Date(band.endsAt),
        country: req.country,
      });
      return { band: bandMessage(band.band) };
    },

    async setCountry(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const age = await learnerAge(db, learnerId);
      if (!age.band) throw new ConnectError("answer the age question first", Code.FailedPrecondition);
      const to = checkCountry(req.country);
      if (age.band === "adult" || !age.bandEndsAt) {
        await setLearnerAge(db, learnerId, { band: "adult", bandEndsAt: null, country: to });
        return {};
      }
      const moved = movedBand(age.band, age.bandEndsAt.getTime(), age.country ?? "", to, deps.now());
      await setLearnerAge(db, learnerId, {
        band: moved.band,
        bandEndsAt: moved.endsAt === null ? null : new Date(moved.endsAt),
        country: to,
      });
      return {};
    },

    async confirmBand(_req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const age = await learnerAge(db, learnerId);
      const next = age.band && nextBand(age.band, age.bandEndsAt?.getTime() ?? null, age.country ?? "", deps.now());
      if (!next) throw new ConnectError("this band has not ended", Code.FailedPrecondition);
      await setLearnerAge(db, learnerId, {
        band: next.band,
        bandEndsAt: next.endsAt === null ? null : new Date(next.endsAt),
        country: age.country ?? "other",
      });
      return {};
    },

    async listConsents(req, ctx) {
      const { db, userId, learnerId, self } = await subject(ctx, req.learnerId);
      const now = deps.now();
      const rows = await consentsOf(db, learnerId);
      const access = await accessOf(db, learnerId, now);
      const current = (s: ConsentScope) => rows.filter((c) => c.scope === s && !c.withdrawnAt && c.expiresAt.getTime() > now);
      return {
        consents: rows.map((c) => ({
          id: c.id,
          scope: c.scope,
          role: c.role,
          noticeVersion: c.noticeVersion,
          grantedAt: BigInt(c.grantedAt.getTime()),
          expiresAt: BigInt(c.expiresAt.getTime()),
          withdrawnAt: BigInt(c.withdrawnAt?.getTime() ?? 0),
          assentAt: BigInt(c.assentAt?.getTime() ?? 0),
        })),
        scopes: await Promise.all(
          allScopes.map(async (scope) => ({
            scope,
            inForce: access.scopes.includes(scope),
            canGrant: await canGrant(db, userId, learnerId, self, scope),
            needsAssent:
              access.age.band === "child" &&
              ASSENT_SCOPES.includes(scope) &&
              current(scope).length > 0 &&
              !current(scope).some((c) => c.assentAt),
          })),
        ),
      };
    },

    async grantConsent(req, ctx) {
      const { db, userId, learnerId, self } = await subject(ctx, req.learnerId);
      const scope = checkScope(req.scope);
      if (!(await canGrant(db, userId, learnerId, self, scope)))
        throw new ConnectError("that consent cannot be given now", Code.FailedPrecondition);
      const now = deps.now();
      const age = await learnerAge(db, learnerId);
      const method = self ? "self" : await guardianMethod(db, userId);
      await recordConsent(db, {
        learnerId,
        scope,
        grantedBy: userId,
        role: self ? "self" : "guardian",
        method: method ?? "self",
        noticeVersion: (await currentNotice(db)).version,
        country: age.country ?? "",
        grantedAt: new Date(now),
        expiresAt: consentExpiry(now),
      });
      return {};
    },

    async assentConsent(req, ctx) {
      const { db, userId } = auth(ctx);
      const n = await assentConsent(db, await learnerFor(db, userId), checkScope(req.scope), new Date(deps.now()));
      if (n === 0) throw new ConnectError("no guardian has granted that", Code.FailedPrecondition);
      return {};
    },

    async withdrawConsent(req, ctx) {
      const { db, userId, learnerId, self } = await subject(ctx, req.learnerId);
      const scope = checkScope(req.scope);
      await withdrawConsent(db, learnerId, scope, userId, new Date(deps.now()));
      if (scope === "basic") await clearResponses(db, learnerId);
      await tellGuardians(db, learnerId, self);
      return {};
    },

    async submitVerification(req, ctx) {
      const { db, userId } = auth(ctx);
      if ((await learnerAge(db, await learnerFor(db, userId))).band !== "adult")
        throw new ConnectError("only an adult can be a guardian", Code.PermissionDenied);
      if (!formTypes.includes(req.contentType)) throw new ConnectError("send a PDF, PNG or JPEG", Code.InvalidArgument);
      if (req.form.length === 0 || req.form.length > MAX_FORM_BYTES)
        throw new ConnectError("the form must be under 5 MB", Code.InvalidArgument);
      const latest = await latestVerification(db, userId);
      if (latest && latest.status !== "refused") throw new ConnectError("a verification already exists", Code.FailedPrecondition);
      const formKey = `guardian-forms/${crypto.randomUUID()}`;
      await deps.forms.put(formKey, req.form, req.contentType);
      await submitVerification(db, { userId, method: "signed-form", formKey, formType: req.contentType, at: new Date(deps.now()) });
      return {};
    },

    async getVerification(_req, ctx) {
      const { db, userId } = auth(ctx);
      const latest = await latestVerification(db, userId);
      return { status: latest?.status ?? "none", reason: latest?.reason ?? "" };
    },

    async addChild(req, ctx) {
      const { db, userId } = auth(ctx);
      if (!(await guardianMethod(db, userId))) throw new ConnectError("verify as a guardian first", Code.FailedPrecondition);
      const accounts = ctx.values.get(accountsKey);
      if (!accounts) throw new ConnectError("no accounts", Code.Internal);
      const username = req.username.trim().toLowerCase();
      if (!/^[a-z0-9_-]{3,20}$/.test(username)) throw new ConnectError("that username is not valid", Code.InvalidArgument);
      checkPassword(req.password);
      const now = deps.now();
      const band = ageBand(checkCountry(req.country), req.birthYear, req.birthMonth, now);
      if (!band) throw new ConnectError("that date is not valid", Code.InvalidArgument);
      if (band.band !== "child") throw new ConnectError("at this age a learner has their own account", Code.FailedPrecondition);
      if (!(await marketOpenToMinors(db, req.country)))
        throw new ConnectError("this market is not open to minors", Code.FailedPrecondition);
      const childUser = await accounts.create(username, req.password);
      const learnerId = await learnerFor(db, childUser);
      await setLearnerAge(db, learnerId, { band: "child", bandEndsAt: new Date(band.endsAt ?? now), country: req.country });
      await setManaged(db, learnerId);
      await addGuardian(db, userId, learnerId);
      return { learnerId };
    },

    async resetChildPassword(req, ctx) {
      const { db, learnerId } = await managedChild(ctx, req.learnerId);
      checkPassword(req.password);
      const accounts = ctx.values.get(accountsKey);
      if (!accounts) throw new ConnectError("no accounts", Code.Internal);
      await accounts.setPassword(await userOfLearner(db, learnerId), req.password);
      return {};
    },

    async setTimeLimit(req, ctx) {
      const { db, learnerId, self } = await subject(ctx, req.learnerId);
      if (self) throw new ConnectError("a guardian sets this", Code.PermissionDenied);
      if (!Number.isInteger(req.minutes) || req.minutes < 0 || req.minutes > 1440)
        throw new ConnectError("minutes out of range", Code.InvalidArgument);
      await setDailyMinutes(db, learnerId, req.minutes === 0 ? null : req.minutes);
      return {};
    },

    async exportData(req, ctx) {
      const { db, learnerId } = await subject(ctx, req.learnerId);
      return { json: JSON.stringify(await exportLearner(db, learnerId)) };
    },

    async deleteResponses(req, ctx) {
      const { db, learnerId, self } = await subject(ctx, req.learnerId);
      const deleted = await clearResponses(db, learnerId);
      await tellGuardians(db, learnerId, self);
      return { deleted };
    },

    async deleteChild(req, ctx) {
      const { db, learnerId } = await managedChild(ctx, req.learnerId);
      const keys = await deleteUserData(db, await userOfLearner(db, learnerId));
      await Promise.all(keys.map((k) => deps.forms.delete(k)));
      return {};
    },
  };
}
