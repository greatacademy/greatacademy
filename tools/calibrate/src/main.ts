import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

import { connect, providers } from "@ga/db";
import { criterionById } from "@ga/subject-english";

import { parseScoredSet } from "./agreement.ts";
import { renderReport, runCalibration } from "./calibrate.ts";

// `DATABASE_URL=… AI_KEYS_SECRET=… pnpm nx run calibrate:calibrate -- --criterion w4-topic-sentence@1 --provider <id> --model <model> --prompt writing-1 --set scored.jsonl`
const { values } = parseArgs({
  options: {
    criterion: { type: "string" },
    provider: { type: "string" },
    model: { type: "string" },
    prompt: { type: "string" },
    set: { type: "string" },
    concurrency: { type: "string" },
    out: { type: "string" },
  },
});
const url = process.env.DATABASE_URL;
const secret = process.env.AI_KEYS_SECRET;
const [id, version] = (values.criterion ?? "").split("@");
if (!url || !secret || !id || !version || !values.provider || !values.model || !values.prompt || !values.set) {
  console.error(
    "usage: DATABASE_URL=… AI_KEYS_SECRET=… calibrate --criterion <id@version> --provider <provider id> --model <model> --prompt <prompt version> --set <file.jsonl> [--concurrency <n>] [--out <file>]",
  );
  process.exit(1);
}
const criterion = criterionById(id);
if (!criterion || criterion.version !== version) {
  console.error(`no criterion ${values.criterion}`);
  process.exit(1);
}

const set = parseScoredSet(readFileSync(values.set, "utf8"));
const { db, close } = connect(url);
try {
  const report = await runCalibration(
    db,
    {
      criterion,
      providerId: values.provider,
      model: values.model,
      promptVersion: values.prompt,
      set,
      aiKeysSecret: secret,
      ...(values.concurrency && { concurrency: Number(values.concurrency) }),
    },
    new Date(),
  );
  const name = (await providers(db)).find((p) => p.id === values.provider)?.name ?? values.provider;
  const markdown = renderReport(report, { providerName: name, model: values.model, promptVersion: values.prompt });
  if (values.out) writeFileSync(values.out, markdown);
  else process.stdout.write(markdown);
} finally {
  await close();
}
