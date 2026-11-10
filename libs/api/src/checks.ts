import { type CalibrationKappa, type CheckRow, checkedSince, type Db, type ProviderRow, passingKappas } from "@ga/db";

import type { Alarm } from "./costs.ts";

/** CHECK_SHARE is the share of finished judgments sampled for a person to check (*starting*). */
export const CHECK_SHARE = 0.05;

/** DRIFT_WINDOW_MS is how far back the checks of a route are counted (*starting*). */
export const DRIFT_WINDOW_MS = 90 * 24 * 3600_000;

/** MIN_DRIFT_CHECKS is how many checks a route needs before its drift is judged (*starting*). */
export const MIN_DRIFT_CHECKS = 30;

/** DRIFT_MARGIN is how far a route's kappa with people may fall below its calibration's before it drifts (*starting*). */
export const DRIFT_MARGIN = 0.1;

/** CHECK_READ_ACTION and CHECK_SAVE_ACTION are what the change log records when a person reads or checks a sample. */
export const CHECK_READ_ACTION = "check.read";
/** CHECK_SAVE_ACTION is what the change log records when a person gives a verdict on a sample. */
export const CHECK_SAVE_ACTION = "check.save";

/**
 * sampled tells, from a judgment's id alone, whether it is one of the share
 * sampled for checking, so the choice is fixed, needs no randomness and
 * cannot be steered by what the learner wrote.
 */
export function sampled(id: string, share: number): boolean {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h / 2 ** 32 < share;
}

/** cohenKappa is the agreement of two raters' yes-or-no labels beyond chance; two raters who agree on one label throughout get 1. */
export function cohenKappa(a: readonly boolean[], b: readonly boolean[]): number {
  const n = a.length;
  if (n === 0) return 0;
  let agree = 0;
  let yesA = 0;
  let yesB = 0;
  for (let i = 0; i < n; i++) {
    if (a[i] === b[i]) agree++;
    if (a[i]) yesA++;
    if (b[i]) yesB++;
  }
  const po = agree / n;
  const pe = (yesA / n) * (yesB / n) + (1 - yesA / n) * (1 - yesB / n);
  return pe === 1 ? (po === 1 ? 1 : 0) : (po - pe) / (1 - pe);
}

/** RouteDrift is how a route's live verdicts compare with people's. */
export interface RouteDrift {
  readonly criterion: string;
  readonly providerId: string;
  readonly model: string;
  readonly promptVersion: string;
  readonly checks: number;
  /** agreement is the share of checks where the route and the person agreed. */
  readonly agreement: number;
  readonly kappa: number;
  /** calibrationKappa is the route's kappa in its newest passing calibration, if it has one. */
  readonly calibrationKappa: number | undefined;
  /** drifting is true when there are enough checks and the kappa fell more than DRIFT_MARGIN below the calibration's. */
  readonly drifting: boolean;
}

const routeOf = (r: { criterion: string; providerId: string; model: string; promptVersion: string }) =>
  `${r.criterion}|${r.providerId}|${r.model}|${r.promptVersion}`;

/** routeDrift groups checked samples by route and compares each route's agreement with people against its calibration. */
export function routeDrift(checked: readonly CheckRow[], kappas: readonly CalibrationKappa[]): RouteDrift[] {
  const groups = new Map<string, CheckRow[]>();
  for (const c of checked) {
    if (c.personMet === null) continue;
    const key = routeOf(c);
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }
  const calibrated = new Map(kappas.map((k) => [routeOf(k), k.kappa]));
  return [...groups.values()]
    .map((rows) => {
      const first = rows[0]!;
      const route = rows.map((r) => r.met);
      const people = rows.map((r) => r.personMet!);
      const kappa = cohenKappa(route, people);
      const calibrationKappa = calibrated.get(routeOf(first));
      return {
        criterion: first.criterion,
        providerId: first.providerId,
        model: first.model,
        promptVersion: first.promptVersion,
        checks: rows.length,
        agreement: rows.filter((r) => r.met === r.personMet).length / rows.length,
        kappa,
        calibrationKappa,
        drifting: rows.length >= MIN_DRIFT_CHECKS && calibrationKappa !== undefined && kappa < calibrationKappa - DRIFT_MARGIN,
      };
    })
    .sort((x, y) => Number(y.drifting) - Number(x.drifting) || x.criterion.localeCompare(y.criterion) || x.model.localeCompare(y.model));
}

/** driftOf reads the drift of every route checked within DRIFT_WINDOW_MS of a time. */
export async function driftOf(db: Db, at: number): Promise<RouteDrift[]> {
  return routeDrift(await checkedSince(db, new Date(at - DRIFT_WINDOW_MS)), await passingKappas(db));
}

/** driftAlarms warn, once a month per route, of the routes whose live verdicts drifted from people's. */
export async function driftAlarms(db: Db, list: readonly ProviderRow[], at: number): Promise<Alarm[]> {
  const month = new Date(at).toISOString().slice(0, 7);
  const name = new Map(list.map((p) => [p.id, p.name]));
  return (await driftOf(db, at))
    .filter((d) => d.drifting)
    .map((d) => ({
      target: `${name.get(d.providerId) ?? d.providerId}/${d.model}/${d.criterion}`,
      detail: `drift ${month}`,
      text:
        `On ${d.criterion}, ${d.model} with prompt ${d.promptVersion} agrees with people at kappa ${d.kappa.toFixed(2)} over ${d.checks} checks, ` +
        `below the ${d.calibrationKappa!.toFixed(2)} of its calibration. Calibrate it again, or move its criterion to another route.`,
      textZh:
        `在 ${d.criterion} 上，${d.model}（提示词版本 ${d.promptVersion}）在 ${d.checks} 次核对中与人工评分的 kappa 为 ${d.kappa.toFixed(2)}，` +
        `低于校准时的 ${d.calibrationKappa!.toFixed(2)}。请重新校准，或把这项标准换到另一条路线。`,
    }));
}
