import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

import { compileMath } from "@ga/content-math";
import { connect } from "@ga/db";

import { defaultReportOptions, loadPilotData, renderPilotReport, summarize } from "./report.ts";

// `DATABASE_URL=… pnpm nx run pilot:report -- --course algebra-i --since 2026-12-01 --out /tmp/pilot.md`
const { values } = parseArgs({
  options: {
    course: { type: "string" },
    since: { type: "string" },
    "min-learners": { type: "string" },
    out: { type: "string" },
  },
});
const url = process.env.DATABASE_URL;
if (!values.course || !url) {
  console.error("usage: DATABASE_URL=… report --course <id> [--since <date>] [--min-learners <n>] [--out <file>]");
  process.exit(1);
}

const subject = compileMath();
const { db, close } = connect(url);
try {
  const data = await loadPilotData(db, values.course, values.since ? new Date(values.since) : undefined);
  const report = summarize(data, {
    ...defaultReportOptions,
    ...(values["min-learners"] && { minLearners: Number(values["min-learners"]) }),
  });
  const markdown = renderPilotReport(values.course, report, {
    topic: (id) => subject.topics.get(id)?.title.en ?? id,
    kp: (id, kp) => subject.topics.get(id)?.knowledgePoints[kp]?.title.en ?? String(kp),
  });
  if (values.out) writeFileSync(values.out, markdown);
  else process.stdout.write(markdown);
} finally {
  await close();
}
