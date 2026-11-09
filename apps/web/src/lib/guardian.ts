import type { GuardedLearner } from "@ga/proto/account/v1/account_pb";
import type { FinishedSession } from "@ga/proto/learning/v1/learning_pb";

const DAY = 86_400_000;

/** inactiveDays is how many days without a task make it worth a guardian's look. */
const inactiveDays = 3;

/** Sign is something about a learner that a guardian may want to look at. */
export type Sign = { kind: "failing" } | { kind: "rushing" } | { kind: "inactive"; days: number };

/** signsOf lists what is worth a guardian's look: often failed lessons, rushed tasks, and days away from a course. */
export function signsOf(learner: GuardedLearner, now: number): Sign[] {
  const signs: Sign[] = [];
  const recent = learner.recent;
  if (recent && recent.lessons >= 3 && recent.failedLessons * 10 > recent.lessons) signs.push({ kind: "failing" });
  if (recent?.blownOff) signs.push({ kind: "rushing" });
  const last = Number(learner.lastActiveAt);
  if (learner.enrollments.length > 0 && last > 0) {
    const days = Math.floor((now - last) / DAY);
    if (days >= inactiveDays) signs.push({ kind: "inactive", days });
  }
  return signs;
}

/** Stuck is a lesson failed several times in a row, with the last of those sessions. */
export interface Stuck {
  times: number;
  session: FinishedSession;
}

/** stuckLessons finds the lessons whose latest attempts all failed, at least twice, from sessions listed newest first. */
export function stuckLessons(sessions: readonly FinishedSession[]): Stuck[] {
  const streaks = new Map<string, Stuck>();
  const settled = new Set<string>();
  for (const session of sessions) {
    const task = session.task?.kind;
    if (task?.case !== "lesson") continue;
    const id = task.value.topicId;
    if (settled.has(id)) continue;
    if (session.passed) {
      settled.add(id);
      continue;
    }
    const streak = streaks.get(id);
    if (streak) streak.times += 1;
    else streaks.set(id, { times: 1, session });
  }
  return [...streaks.entries()].filter(([, s]) => s.times >= 2).map(([, s]) => s);
}
