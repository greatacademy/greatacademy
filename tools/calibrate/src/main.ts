import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parseArgs } from "node:util";

import { connect, providers } from "@ga/db";
import { criterionById as chineseCriterion } from "@ga/subject-chinese";
import { criterionById as englishCriterion } from "@ga/subject-english";

import { parseScoredSet } from "./agreement.ts";
import { renderReport, runCalibration } from "./calibrate.ts";
import { parseSpeechSet, renderSpeechReport, runSpeechCalibration } from "./speech.ts";

// `DATABASE_URL=… AI_KEYS_SECRET=… pnpm nx run calibrate:calibrate -- --criterion w4-topic-sentence@1 --provider <id> --model <model> --prompt writing-1 --set scored.jsonl`
// `DATABASE_URL=… AI_KEYS_SECRET=… pnpm nx run calibrate:calibrate -- --speech stt:en-US --provider <id> --model default --set clips.jsonl`
const { values } = parseArgs({
  options: {
    speech: { type: "string" },
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
if (values.speech) {
  const [use, language] = values.speech.split(":");
  if (!url || !secret || (use !== "stt" && use !== "pronunciation") || !language || !values.provider || !values.model || !values.set) {
    console.error(
      "usage: DATABASE_URL=… AI_KEYS_SECRET=… calibrate --speech <stt|pronunciation>:<language> --provider <provider id> --model <model> --set <clips.jsonl> [--concurrency <n>] [--out <file>]",
    );
    process.exit(1);
  }
  const folder = dirname(resolve(values.set));
  const clips = parseSpeechSet(readFileSync(values.set, "utf8"));
  const { db, close } = connect(url);
  try {
    const reports = await runSpeechCalibration(
      db,
      {
        use,
        language,
        providerId: values.provider,
        model: values.model,
        clips,
        aiKeysSecret: secret,
        read: (path) => new Uint8Array(readFileSync(resolve(folder, path))),
        ...(values.concurrency && { concurrency: Number(values.concurrency) }),
      },
      new Date(),
    );
    const name = (await providers(db)).find((p) => p.id === values.provider)?.name ?? values.provider;
    const model = values.model;
    const markdown = reports.map((r) => renderSpeechReport(r, { providerName: name, model })).join("\n");
    if (values.out) writeFileSync(values.out, markdown);
    else process.stdout.write(markdown);
  } finally {
    await close();
  }
  process.exit(0);
}
const [id, version] = (values.criterion ?? "").split("@");
if (!url || !secret || !id || !version || !values.provider || !values.model || !values.prompt || !values.set) {
  console.error(
    "usage: DATABASE_URL=… AI_KEYS_SECRET=… calibrate --criterion <id@version> --provider <provider id> --model <model> --prompt <prompt version> --set <file.jsonl> [--concurrency <n>] [--out <file>]",
  );
  process.exit(1);
}
const criterion = englishCriterion(id) ?? chineseCriterion(id);
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
