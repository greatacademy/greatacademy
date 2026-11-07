import { Code, ConnectError } from "@connectrpc/connect";
import {
  type ConsentRow,
  type ConsentScope,
  calibrationPassed,
  currentConsents,
  type Db,
  type LearnerAge,
  learnerAge,
  marketLaunchOf,
  notices,
  providers,
  type RoutePosition,
  routes,
  studiedMs,
  type VendorCheckRow,
  vendorChecks,
} from "@ga/db";
import { AI_SCOPES, ASSENT_SCOPES, marketOf, minorsCanUse, NOTICE_VERSION } from "./markets.ts";
import { checkTimeZone } from "./summary.ts";

/** CHECK_VALID_MS is how long a register check counts (starting value). */
export const CHECK_VALID_MS = 365 * 24 * 3600_000;

/** Access says what stands between a learner and study, and which scopes are in force. */
export interface Access {
  readonly status: "ok" | "needs-age" | "market-closed" | "needs-guardian";
  readonly scopes: readonly ConsentScope[];
  readonly age: LearnerAge;
}

/** marketOpenToMinors tells whether a market's rule allows minors and an administrator has opened it. */
export async function marketOpenToMinors(db: Db, country: string | null): Promise<boolean> {
  if (!country || !minorsCanUse(marketOf(country))) return false;
  return (await marketLaunchOf(db, country))?.minorsOpen ?? false;
}

/** scopesInForce turns current consents into scopes; a child's scope that asks for assent waits for it. */
function scopesInForce(band: string, consents: readonly ConsentRow[]): ConsentScope[] {
  const scopes = new Set<ConsentScope>();
  for (const c of consents) if (band !== "child" || !ASSENT_SCOPES.includes(c.scope) || c.assentAt) scopes.add(c.scope);
  return [...scopes];
}

/** accessOf decides what a learner may do at a time: everything below denies by default. */
export async function accessOf(db: Db, learnerId: string, at: number): Promise<Access> {
  const age = await learnerAge(db, learnerId);
  const consents = await currentConsents(db, learnerId, new Date(at));
  const given = scopesInForce(age.band ?? "", consents);
  if (!age.band) return { status: "needs-age", scopes: [], age };
  if (age.band === "adult") return { status: "ok", scopes: ["basic", ...given.filter((s) => s !== "basic")], age };
  if (!(await marketOpenToMinors(db, age.country))) return { status: "market-closed", scopes: [], age };
  if (age.band === "teen") return { status: "ok", scopes: ["basic", ...given.filter((s) => s !== "basic")], age };
  return given.includes("basic") ? { status: "ok", scopes: given, age } : { status: "needs-guardian", scopes: [], age };
}

/** requireStudy refuses a learner who may not study now. */
export async function requireStudy(db: Db, learnerId: string, at: number): Promise<Access> {
  const access = await accessOf(db, learnerId, at);
  if (access.status !== "ok") throw new ConnectError(`study is not available: ${access.status}`, Code.PermissionDenied);
  return access;
}

/** checkValid tells whether a register entry has every condition met and is recent enough. */
export function checkValid(c: VendorCheckRow, at: number): boolean {
  return (
    c.servesMarket &&
    c.minorsAllowed &&
    c.noTraining &&
    c.shortRetention &&
    c.processingAgreement &&
    c.transferMechanism &&
    at - c.checkedAt.getTime() < CHECK_VALID_MS
  );
}

/** currentNotice is the newest notice version with the vendors it names. */
export async function currentNotice(db: Db): Promise<{ version: string; vendors: readonly string[] }> {
  const [newest] = await notices(db);
  return newest ?? { version: NOTICE_VERSION, vendors: [] };
}

/** kindForScope is the kind of vendor a scope needs. */
const kindForScope = (scope: ConsentScope) => (scope === "speech" ? "speech" : "model");

/** scopeOffered tells whether a market can offer a scope now: its rule allows it and the current notice names a vendor of that kind with a valid check there. */
export async function scopeOffered(db: Db, country: string, scope: ConsentScope, at: number): Promise<boolean> {
  if (scope === "basic") return true;
  if (!AI_SCOPES.includes(scope) || marketOf(country)?.status !== "open") return false;
  const [notice, list, checks] = await Promise.all([currentNotice(db), providers(db), vendorChecks(db)]);
  return list.some(
    (p) =>
      p.enabled &&
      p.kind === kindForScope(scope) &&
      notice.vendors.includes(p.id) &&
      checks.some((c) => c.providerId === p.id && c.country === country && checkValid(c, at)),
  );
}

/** QualifiedRoute is a route allowed to receive a learner's data. */
export interface QualifiedRoute {
  readonly position: RoutePosition;
  readonly providerId: string;
  readonly model: string;
  readonly promptVersion: string;
}

/**
 * qualifyingRoute finds the route that may judge a learner's work: the live
 * primary, or else the calibrated backup. For a minor all five conditions of
 * docs/admin.md §6 must hold, and with none it returns undefined and judgment waits.
 */
export async function qualifyingRoute(
  db: Db,
  criterion: string,
  learnerId: string,
  scope: ConsentScope,
  at: number,
): Promise<QualifiedRoute | undefined> {
  const age = await learnerAge(db, learnerId);
  const minor = age.band !== "adult";
  const consents = (await currentConsents(db, learnerId, new Date(at))).filter(
    (c) => c.scope === scope && (age.band !== "child" || !ASSENT_SCOPES.includes(scope) || c.assentAt),
  );
  if (minor && (consents.length === 0 || !(await marketOpenToMinors(db, age.country)))) return undefined;
  if (minor && marketOf(age.country ?? "")?.status !== "open") return undefined;
  const [list, checks, versions, all] = await Promise.all([providers(db), vendorChecks(db), notices(db), routes(db)]);
  const candidates = all
    .filter((r) => r.criterion === criterion)
    .sort((a, b) => a.position.localeCompare(b.position))
    .reverse();
  for (const r of candidates) {
    if (!list.some((p) => p.id === r.providerId && p.enabled)) continue;
    const calibrated = await calibrationPassed(db, r);
    if (!calibrated || (r.position === "primary" && !r.live)) continue;
    if (minor) {
      const registered = checks.some((c) => c.providerId === r.providerId && c.country === age.country && checkValid(c, at));
      const named = consents.some((c) => versions.find((v) => v.version === c.noticeVersion)?.vendors.includes(r.providerId));
      if (!registered || !named) continue;
    }
    return { position: r.position, providerId: r.providerId, model: r.model, promptVersion: r.promptVersion };
  }
  return undefined;
}

/** startOfDay is when the local day of a time began, in a time zone. */
export function startOfDay(now: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: checkTimeZone(timeZone),
    hourCycle: "h23",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(new Date(now));
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return now - (part("hour") * 3600 + part("minute") * 60 + part("second")) * 1000 - (now % 1000);
}

/** studiedToday is how long a learner has studied since the local day began, in milliseconds. */
export function studiedToday(db: Db, learnerId: string, now: number, timeZone: string): Promise<number> {
  return studiedMs(db, learnerId, new Date(startOfDay(now, timeZone)));
}
