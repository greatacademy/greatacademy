import { Code, ConnectError } from "@connectrpc/connect";
import {
  type ConsentRow,
  type ConsentScope,
  currentConsents,
  type Db,
  type LearnerAge,
  learnerAge,
  marketLaunchOf,
  notices,
  prices,
  providers,
  type RoutePosition,
  type RouteUse,
  routeCalibrated,
  routes,
  studiedMs,
  type VendorCheckRow,
  vendorChecks,
} from "@ga/db";
import { providerSpend, withinBudget } from "./costs.ts";
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

/** useForScope is the use of route a scope needs: writing is judged, speech is first turned into text, and a conversation is answered. */
const useForScope = (scope: ConsentScope): RouteUse =>
  scope === "speech" ? "stt" : scope === "conversation" ? "conversation" : "judgment";

/** scopeOffered tells whether a market can offer a scope now: its rule allows it, and the current notice names a vendor with a live route of the use the scope needs and a valid check there. */
export async function scopeOffered(db: Db, country: string, scope: ConsentScope, at: number): Promise<boolean> {
  if (scope === "basic") return true;
  if (!AI_SCOPES.includes(scope) || marketOf(country)?.status !== "open") return false;
  const [notice, list, checks, all] = await Promise.all([currentNotice(db), providers(db), vendorChecks(db), routes(db)]);
  return list.some(
    (p) =>
      p.enabled &&
      notice.vendors.includes(p.id) &&
      all.some((r) => r.providerId === p.id && r.live && r.use === useForScope(scope)) &&
      checks.some((c) => c.providerId === p.id && c.country === country && checkValid(c, at)),
  );
}

/** QualifiedRoute is a route allowed to receive a learner's data, with the price of its model. */
export interface QualifiedRoute {
  readonly position: RoutePosition;
  readonly providerId: string;
  readonly model: string;
  readonly promptVersion: string;
  readonly price: { readonly inputPerMillion: number; readonly outputPerMillion: number };
}

/**
 * qualifyingRoute finds the route that may judge a learner's work, or answer
 * them in a conversation, by the use the scope needs and its target (a
 * criterion key, or a conversation's id): the live primary, or else the calibrated backup. For a minor all five conditions of
 * docs/admin.md §6 must hold, and with none it returns undefined and judgment waits.
 * avoid passes over a position, so that a judgment the primary keeps failing moves to the backup.
 * Its model must have a price, and no budget its vendor has may be spent;
 * a text already taken is finished whatever the budget, with budget false.
 */
export async function qualifyingRoute(
  db: Db,
  criterion: string,
  learnerId: string,
  scope: ConsentScope,
  at: number,
  avoid?: RoutePosition,
  budget = true,
): Promise<QualifiedRoute | undefined> {
  const age = await learnerAge(db, learnerId);
  const minor = age.band !== "adult";
  const consents = (await currentConsents(db, learnerId, new Date(at))).filter(
    (c) => c.scope === scope && (age.band !== "child" || !ASSENT_SCOPES.includes(scope) || c.assentAt),
  );
  if (minor && (consents.length === 0 || !(await marketOpenToMinors(db, age.country)))) return undefined;
  if (minor && marketOf(age.country ?? "")?.status !== "open") return undefined;
  const [list, checks, versions, all, priced, spend] = await Promise.all([
    providers(db),
    vendorChecks(db),
    notices(db),
    routes(db),
    prices(db),
    budget ? providerSpend(db, at) : undefined,
  ]);
  const candidates = all
    .filter((r) => r.use === useForScope(scope) && r.target === criterion && r.position !== avoid)
    .sort((a, b) => a.position.localeCompare(b.position))
    .reverse();
  for (const r of candidates) {
    const vendor = list.find((p) => p.id === r.providerId && p.enabled);
    const price = priced.find((x) => x.providerId === r.providerId && x.model === r.model);
    if (!vendor || !price) continue;
    if (spend && !withinBudget(vendor, spend.get(vendor.id))) continue;
    const calibrated = await routeCalibrated(db, r);
    if (!calibrated || (r.position === "primary" && !r.live)) continue;
    if (minor) {
      const registered = checks.some((c) => c.providerId === r.providerId && c.country === age.country && checkValid(c, at));
      const named = consents.some((c) => versions.find((v) => v.version === c.noticeVersion)?.vendors.includes(r.providerId));
      if (!registered || !named) continue;
    }
    return {
      position: r.position,
      providerId: r.providerId,
      model: r.model,
      promptVersion: r.promptVersion,
      price: { inputPerMillion: price.inputPerMillion, outputPerMillion: price.outputPerMillion },
    };
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
