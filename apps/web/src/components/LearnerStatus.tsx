import type { GuardedLearner } from "@ga/proto/account/v1/account_pb";

import type { Sign } from "../lib/guardian.ts";
import { type Messages, useI18n } from "../lib/i18n.tsx";

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

function ago(ms: number, locale: string): string {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const passed = Date.now() - ms;
  for (const [unit, size] of units) {
    if (passed >= size) return format.format(-Math.floor(passed / size), unit);
  }
  return format.format(0, "minute");
}

/** ActiveLine tells whether a learner is studying now, or when they last were. */
export function ActiveLine({ learner }: { learner: GuardedLearner }) {
  const { m, locale } = useI18n();
  if (learner.studying) {
    return (
      <div className="flex items-center gap-1.5 text-sm font-medium text-good">
        <span className="size-2 rounded-full bg-good" /> {m.studyingNow}
      </div>
    );
  }
  const last = Number(learner.lastActiveAt);
  return <div className="text-sm text-muted">{last > 0 ? m.lastActive(ago(last, locale)) : m.notStartedYet}</div>;
}

/** signText words a sign for the guardian. */
export function signText(sign: Sign, m: Messages): string {
  if (sign.kind === "failing") return m.warningFailing;
  if (sign.kind === "rushing") return m.warningRushing;
  return m.warningInactive(sign.days);
}
