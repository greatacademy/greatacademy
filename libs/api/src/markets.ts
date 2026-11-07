import type { AgeBand, ConsentScope } from "@ga/db";

/** MarketStatus is a market's rule: open, open with no AI scopes, or closed to minors. */
export type MarketStatus = "open" | "open-no-ai" | "closed";

/** Market is one row of the table in docs/minors-data.md §4. Changing a row is a legal decision that goes through review. */
export interface Market {
  readonly country: string;
  readonly status: MarketStatus;
  /** guardianBelow is the age under which a guardian must consent. */
  readonly guardianBelow: number;
  /** languages are those the notices and guardian pages must exist in. */
  readonly languages: readonly string[];
}

/** ADULT_AGE is when the adult band starts, in every market for now. */
export const ADULT_AGE = 18;

/** OTHER_COUNTRY is the answer of someone from a market that has no row. */
export const OTHER_COUNTRY = "other";

/** MARKETS is every market with a row. */
export const MARKETS: readonly Market[] = [
  { country: "US", status: "open", guardianBelow: 13, languages: ["en"] },
  { country: "CA", status: "open", guardianBelow: 14, languages: ["en", "fr"] },
  { country: "AU", status: "open", guardianBelow: 15, languages: ["en"] },
  { country: "SG", status: "open", guardianBelow: 13, languages: ["en"] },
  { country: "JP", status: "open", guardianBelow: 16, languages: ["ja"] },
  { country: "KR", status: "open", guardianBelow: 14, languages: ["ko"] },
  { country: "TW", status: "open", guardianBelow: 18, languages: ["zh-TW"] },
  { country: "HK", status: "open-no-ai", guardianBelow: 18, languages: ["zh-TW"] },
  { country: "BR", status: "open", guardianBelow: 16, languages: ["pt-BR"] },
  { country: "CN", status: "closed", guardianBelow: 14, languages: ["zh-CN"] },
];

/** NOTICE_LANGUAGES are the languages the published notices exist in. */
export const NOTICE_LANGUAGES: readonly string[] = ["en", "zh-CN"];

/** NOTICE_VERSION is the version of the notices in the code, used until an administrator publishes one naming vendors. */
export const NOTICE_VERSION = "2026-11";

/** CONSENT_MONTHS is how long a consent lasts (starting value). */
export const CONSENT_MONTHS = 12;

/** AI_SCOPES are the scopes that reach AI vendors. */
export const AI_SCOPES: readonly ConsentScope[] = ["writing", "speech"];

/** ASSENT_SCOPES are the scopes a child is asked about too. */
export const ASSENT_SCOPES: readonly ConsentScope[] = ["writing", "speech", "research"];

/** marketOf finds a market's row. */
export function marketOf(country: string): Market | undefined {
  return MARKETS.find((m) => m.country === country);
}

/** isKnownCountry tells whether an answer is a market or "other". */
export function isKnownCountry(country: string): boolean {
  return country === OTHER_COUNTRY || marketOf(country) !== undefined;
}

/** missingLanguages lists the languages a market needs that the notices do not exist in yet. */
export function missingLanguages(market: Market): string[] {
  return market.languages.filter((l) => !NOTICE_LANGUAGES.includes(l));
}

/** addYears moves a time by whole calendar years, in UTC. */
function addYears(at: number, years: number): number {
  const d = new Date(at);
  return Date.UTC(d.getUTCFullYear() + years, d.getUTCMonth(), d.getUTCDate());
}

/**
 * birthAnchor is the first day on which a person born in a month has surely
 * been born: the first of the next month. Counting birthdays from it never
 * makes anyone older than they are.
 */
export function birthAnchor(year: number, month: number): number {
  return Date.UTC(year, month, 1);
}

/** Band is an age band with the time it ends; adults' never ends. */
export interface Band {
  readonly band: AgeBand;
  readonly endsAt: number | null;
}

/** bandAt is the band of a person at a time, given when birthdays count from and the age of the guardian line. */
export function bandAt(anchor: number, guardianBelow: number, now: number): Band {
  const line = addYears(anchor, guardianBelow);
  if (now < line) return { band: "child", endsAt: line };
  const adult = addYears(anchor, ADULT_AGE);
  return now < adult ? { band: "teen", endsAt: adult } : { band: "adult", endsAt: null };
}

/** guardianLine is the age of the guardian line for an answer; with no row the strictest line applies. */
export function guardianLine(country: string): number {
  return marketOf(country)?.guardianBelow ?? ADULT_AGE;
}

/** ageBand answers the age question. A birth date that cannot be real is refused by returning undefined. */
export function ageBand(country: string, year: number, month: number, now: number): Band | undefined {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return undefined;
  const anchor = birthAnchor(year, month);
  if (year < 1900 || anchor > now + 31 * 24 * 3600_000) return undefined;
  return bandAt(anchor, guardianLine(country), now);
}

/** anchorFromBand recovers when birthdays count from out of a stored minor's band end, since the birth date is not stored. */
export function anchorFromBand(band: AgeBand, endsAt: number, guardianBelow: number): number {
  return addYears(endsAt, band === "teen" ? -ADULT_AGE : -guardianBelow);
}

/** movedBand is a minor's band after moving country: the stricter of the two rows, never an older band than now. */
export function movedBand(band: AgeBand, endsAt: number, from: string, to: string, now: number): Band {
  const anchor = anchorFromBand(band, endsAt, guardianLine(from));
  const next = bandAt(anchor, Math.max(guardianLine(from), guardianLine(to)), now);
  return band === "child" && next.band !== "child" ? { band, endsAt } : next;
}

/** nextBand is the band a learner can confirm once theirs has ended; undefined while it lasts. */
export function nextBand(band: AgeBand, endsAt: number | null, country: string, now: number): Band | undefined {
  if (band === "adult" || endsAt === null || now < endsAt) return undefined;
  return bandAt(anchorFromBand(band, endsAt, guardianLine(country)), guardianLine(country), now);
}

/** consentExpiry is when a consent granted at a time ends. */
export function consentExpiry(at: number): Date {
  const d = new Date(at);
  d.setUTCMonth(d.getUTCMonth() + CONSENT_MONTHS);
  return d;
}

/** minorsCanUse tells whether a market's rule lets minors in at all once launched. */
export function minorsCanUse(market: Market | undefined): market is Market {
  return market !== undefined && market.status !== "closed";
}
