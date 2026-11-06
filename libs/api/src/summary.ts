import type { MessageInitShape } from "@bufbuild/protobuf";
import { Code, ConnectError } from "@connectrpc/connect";
import { type Db, learnerSettings, totalXp, xpByDay } from "@ga/db";
import { DAY } from "@ga/engine";
import type { XpSummarySchema } from "@ga/proto/learning/v1/learning_pb";

/** checkTimeZone returns a valid IANA time zone, UTC when none is given. */
export function checkTimeZone(timeZone: string): string {
  const tz = timeZone || "UTC";
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: tz });
  } catch {
    throw new ConnectError(`unknown time zone ${tz}`, Code.InvalidArgument);
  }
  return tz;
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** xpSummary sums a learner's XP and sets it against their goals, in a time zone. */
export async function xpSummary(
  db: Db,
  learnerId: string,
  now: number,
  timeZone: string,
): Promise<MessageInitShape<typeof XpSummarySchema>> {
  const tz = checkTimeZone(timeZone);
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" });
  const byDay = await xpByDay(db, learnerId, new Date(now - 15 * DAY), tz);
  const days = Array.from({ length: 14 }, (_, i) => byDay.get(day.format(new Date(now - (13 - i) * DAY))) ?? 0);
  const today = weekdays.indexOf(new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(new Date(now)));
  const { goals, goalsPaused } = await learnerSettings(db, learnerId);
  const set = goals && !goalsPaused ? goals : undefined;
  return {
    total: await totalXp(db, learnerId),
    today: days[13]!,
    days,
    goalToday: set?.[today] ?? 0,
    goalWeek: set?.reduce((a, b) => a + b, 0) ?? 0,
    week: days.slice(13 - today).reduce((a, b) => a + b, 0),
  };
}
