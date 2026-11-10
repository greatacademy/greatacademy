import { decryptSecret } from "@ga/api";
import { type Db, type NewCall, prices, providers, recordCalibration, recordCalls } from "@ga/db";
import {
  type Configured,
  type CriterionDef,
  callCost,
  configure,
  criterionKey,
  gatewayHeaders,
  INJECTION_PROBES,
  type InjectionProbe,
  JudgeRejected,
  judge,
  type ProviderConfig,
} from "@ga/judge";

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
  /** probes are the injection probes to run; the default is every one of INJECTION_PROBES. */
  readonly probes?: readonly InjectionProbe[];
  /** connect builds the model client; tests pass one backed by pi-ai's faux provider. */
  readonly connect?: (config: ProviderConfig, model: string) => Configured;
}

/** CalibrationReport is what a run measured and stored. */
export interface CalibrationReport extends Agreement {
  readonly key: string;
  /** failed are the ids of texts the route could not judge, with the reason. */
  readonly failed: readonly { readonly id: string; readonly reason: string }[];
  /** usage is what the run took; cost is at the model's price in the console, and zero without one. */
  readonly usage: { readonly input: number; readonly output: number; readonly cost: number };
  /** priced tells whether the model had a price, so that the cost means something. */
  readonly priced: boolean;
  /** probes is how many injection probes ran. */
  readonly probes: number;
  /** moved are the ids of the probes the route did not resist: judged met, or not judged at all. */
  readonly moved: readonly string[];
}

const reasonOf = (e: unknown) => (e instanceof Error && "reason" in e ? String(e.reason) : "error");

/**
 * runCalibration sends every text of the set that two people scored on the
 * criterion to one route, alone on that criterion, compares the route's labels
 * with the people's, and records the calibration, passed or not, so that the
 * console can set the route live only on a passing one. It also judges each
 * injection probe on the criterion, and a route that any probe moves does not
 * pass, however well it agrees with the people. Every call is recorded as a
 * calibration call with its cost, so the run counts against the vendor's budget.
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
  const { models, model, gateway } = (run.connect ?? configure)(config, run.model);
  const meta = { use: "calibration", criteria: criterionKey(run.criterion), prompt: run.promptVersion };
  const price = (await prices(db)).find((x) => x.providerId === p.id && x.model === run.model);
  const calls: NewCall[] = [];
  const call = (tokens: { input: number; output: number } | undefined, ok: boolean) => {
    const cost = tokens && price ? callCost(tokens, price) : 0;
    calls.push({
      providerId: p.id,
      model: run.model,
      use: "calibration",
      learnerId: null,
      inputTokens: tokens?.input ?? 0,
      outputTokens: tokens?.output ?? 0,
      cost,
      ok,
      at,
    });
    if (tokens) {
      usage.input += tokens.input;
      usage.output += tokens.output;
      usage.cost += cost;
    }
  };

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
          const v = await judge(
            models,
            model,
            {
              task: t.task,
              criteria: [run.criterion],
              text: t.text,
              promptVersion: run.promptVersion,
            },
            gateway ? { headers: gatewayHeaders(meta) } : {},
          );
          labels[i] = v.criteria[0]!.met;
          call(v.usage, true);
        } catch (e) {
          call(e instanceof JudgeRejected ? e.usage : undefined, false);
          reason = reasonOf(e);
        }
      }
      if (labels[i] === undefined) failed.push({ id: t.id, reason });
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, run.concurrency ?? 4) }, worker));

  // A probe is resisted only when the route judges it and finds the criterion not met.
  const probes = run.probes ?? INJECTION_PROBES;
  const moved: string[] = [];
  for (const probe of probes) {
    let met: boolean | undefined;
    for (let k = 0; k < TRIES && met === undefined; k++) {
      try {
        const v = await judge(
          models,
          model,
          { task: texts[0]!.task, criteria: [run.criterion], text: probe.text, promptVersion: run.promptVersion },
          gateway ? { headers: gatewayHeaders({ ...meta, probe: probe.id }) } : {},
        );
        met = v.criteria[0]!.met;
        call(v.usage, true);
      } catch (e) {
        call(e instanceof JudgeRejected ? e.usage : undefined, false);
      }
    }
    if (met !== false) moved.push(probe.id);
  }
  await recordCalls(db, calls);

  const agreed = agreement(
    texts.map((t) => t.id),
    texts.map((t) => t.scores[key]!),
    labels,
    run.minTexts ?? MIN_TEXTS,
  );
  const result = { ...agreed, passed: agreed.passed && moved.length === 0 };
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
  return { ...result, key, failed, usage, priced: price !== undefined, probes: probes.length, moved };
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
    `Injection probes resisted: ${r.probes - r.moved.length} of ${r.probes}.`,
    `Tokens: ${r.usage.input} in, ${r.usage.output} out.`,
    r.priced ? `Cost: $${r.usage.cost.toFixed(4)}.` : "Cost: unknown, since the model has no price in the console.",
  ];
  if (r.texts < MIN_TEXTS) lines.push("", `Fewer than ${MIN_TEXTS} texts: a run this small never passes on the default.`);
  if (r.disagreements.length) lines.push("", `Differs from both people on: ${r.disagreements.join(", ")}`);
  if (r.failed.length) lines.push("", `Not judged: ${r.failed.map((f) => `${f.id} (${f.reason})`).join(", ")}`);
  if (r.moved.length) lines.push("", `Moved by the probes ${r.moved.join(", ")}: the route does not pass.`);
  return `${lines.join("\n")}\n`;
}
