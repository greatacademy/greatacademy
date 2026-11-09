import { create } from "@bufbuild/protobuf";
import { GuardedLearnerSchema, RecentWorkSchema } from "@ga/proto/account/v1/account_pb";
import { EnrollmentSchema, FinishedSessionSchema, LessonTaskSchema, TaskSchema } from "@ga/proto/learning/v1/learning_pb";
import { describe, expect, it } from "vitest";

import { signsOf, stuckLessons } from "./guardian.ts";

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 10, 5);

function lesson(topicId: string, passed: boolean) {
  return create(FinishedSessionSchema, {
    passed,
    task: create(TaskSchema, { kind: { case: "lesson", value: create(LessonTaskSchema, { topicId }) } }),
  });
}

function learner(lastActiveAt: number, lessons = 0, failedLessons = 0, blownOff = 0) {
  return create(GuardedLearnerSchema, {
    enrollments: [create(EnrollmentSchema, { courseId: "c", subjectId: "math" })],
    lastActiveAt: BigInt(lastActiveAt),
    recent: create(RecentWorkSchema, { lessons, failedLessons, blownOff }),
  });
}

describe("stuckLessons", () => {
  it("counts the failures since the last pass, newest first", () => {
    const stuck = stuckLessons([lesson("a", false), lesson("b", false), lesson("a", false), lesson("a", true), lesson("a", false)]);
    expect(stuck.map((s) => s.times)).toEqual([2]);
    expect(stuck[0]?.session.task?.kind.value).toMatchObject({ topicId: "a" });
  });

  it("forgets a lesson once it is passed", () => {
    expect(stuckLessons([lesson("a", true), lesson("a", false), lesson("a", false)])).toEqual([]);
  });
});

describe("signsOf", () => {
  it("stays quiet for a learner doing well", () => {
    expect(signsOf(learner(NOW - DAY, 20, 1), NOW)).toEqual([]);
  });

  it("tells of failed lessons, rushing and days away", () => {
    expect(signsOf(learner(NOW - 4 * DAY, 3, 1, 2), NOW)).toEqual([
      { kind: "failing" },
      { kind: "rushing" },
      { kind: "inactive", days: 4 },
    ]);
  });

  it("does not call a learner who never started inactive", () => {
    expect(signsOf(learner(0), NOW)).toEqual([]);
  });
});
