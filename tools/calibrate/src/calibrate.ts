import { decryptSecret } from "@ga/api";
import { type Db, providers, recordCalibration } from "@ga/db";
import { type Configured, type CriterionDef, configure, criterionKey, judge, type ProviderConfig } from "@ga/judge";

import { type Agreement, agreement, MIN_TEXTS, type ScoredText } from "./agreement.ts";

/** TRIES is how many times a text is sent to the route before it counts as not judged. */
export const TRIES = 2;

/** CalibrationRun names the route to calibrate and the set to run it on. */
export interface CalibrationRun {
  readonly criterion: CriterionDef;
  readonly providerId: string;
  readonly model: string;
  readonly promptVersion: string;
  readonly set: readonly ScoredText[];
  /** aiKeysSecret opens the provider's key, as the web Worker does. */
  readonly aiKeysSecret: string;
  readonly concurrency?: number;
  readonly minTexts?: number;
  /** connect builds the model client; tests pass one backed by pi-ai's faux provider. */
  readonly connect?: (config: ProviderConfig, model: string) => Configured;
}

/** CalibrationReport is what a run measured and stored. */
export interface CalibrationReport extends Agreement {
  readonly key: string;
  /** failed are the ids of texts the route could not judge, with the reason. */
  readonly failed: readonly { readonly id: string; readonly reason: string }[];
  readonly usage: { readonly input: number; readonly output: number; readonly cost: number };
}

const reasonOf = (e: unknown) => (e instanceof Error && "reason" in e ? String(e.reason) : "error");

/**
 * runCalibration sends every text of the set that two people scored on the
 * criterion to one route, alone on that criterion, compares the route's labels
 * with the people's, and records the calibration, passed or not, so that the
 * console can set the route live only on a passing one.
 */
export async function runCalibration(db: Db, run: CalibrationRun, at: Date): Promise<CalibrationReport> {
  const key = criterionKey(run.criterion);
  const texts = run.set.filter((t) => t.scores[key]);
  if (texts.length === 0) throw new Error(`no text of the set is scored on ${key}`);
  const p = (await providers(db)).find((x) => x.id === run.providerId);
  if (!p) throw new Error(`no provider ${run.providerId}`);
  if (!p.keyCipher) throw new Error(`provider ${p.name} has no key`);
  const config: ProviderConfig = {
    id: p.id,
    name: p.name,
    api: p.api,
    baseUrl: p.baseUrl,
    apiKey: await decryptSecret(run.aiKeysSecret, p.keyCipher),
  };
  const { models, model } = (run.connect ?? configure)(config, run.model);

  const labels: (boolean | undefined)[] = new Array(texts.length);
  const failed: { id: string; reason: string }[] = [];
  const usage = { input: 0, output: 0, cost: 0 };
  let next = 0;
  const worker = async () => {
    while (next < texts.length) {
      const i = next++;
      const t = texts[i]!;
      let reason = "";
      for (let k = 0; k < TRIES && labels[i] === undefined; k++) {
        try {
          const v = await judge(models, model, {
            task: t.task,
            criteria: [run.criterion],
            text: t.text,
            promptVersion: run.promptVersion,
          });
          labels[i] = v.criteria[0]!.met;
          usage.input += v.usage.input;
          usage.output += v.usage.output;
          usage.cost += v.usage.cost;
        } catch (e) {
          reason = reasonOf(e);
        }
      }
      if (labels[i] === undefined) failed.push({ id: t.id, reason });
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, run.concurrency ?? 4) }, worker));

  const result = agreement(
    texts.map((t) => t.id),
    texts.map((t) => t.scores[key]!),
    labels,
    run.minTexts ?? MIN_TEXTS,
  );
  await recordCalibration(db, {
    criterion: key,
    providerId: p.id,
    model: run.model,
    promptVersion: run.promptVersion,
    kappa: result.kappa,
    humanKappa: result.humanKappa,
    passed: result.passed,
    at,
  });
  return { ...result, key, failed, usage };
}

/** renderReport writes a report in Markdown, naming texts by id only. */
export function renderReport(r: CalibrationReport, route: { providerName: string; model: string; promptVersion: string }): string {
  const lines = [
    `# Calibration of ${r.key}`,
    "",
    `Route: ${route.providerName}, ${route.model}, prompt ${route.promptVersion}`,
    "",
    "| Texts | Route κ | People κ | Passed |",
    "| ---: | ---: | ---: | :--- |",
    `| ${r.texts} | ${r.kappa.toFixed(3)} | ${r.humanKappa.toFixed(3)} | ${r.passed ? "yes" : "no"} |`,
    "",
    `Tokens: ${r.usage.input} in, ${r.usage.output} out.`,
  ];
  if (r.texts < MIN_TEXTS) lines.push("", `Fewer than ${MIN_TEXTS} texts: a run this small never passes on the default.`);
  if (r.disagreements.length) lines.push("", `Differs from both people on: ${r.disagreements.join(", ")}`);
  if (r.failed.length) lines.push("", `Not judged: ${r.failed.map((f) => `${f.id} (${f.reason})`).join(", ")}`);
  return `${lines.join("\n")}\n`;
}
