// College writing: signposts, the phrases that tell a reader where a text is going. Each item is two sentences joined by
// a signpost that previews, adds, contrasts, gives an example, shows a result or sums up. A learner first chooses the
// signpost for a gap, then names what a signpost in bold does.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

/** jobs are what a signpost can do. */
const jobs = ["preview", "addition", "contrast", "example", "result", "summary"] as const;

/** Job is one of the jobs of a signpost. */
type Job = (typeof jobs)[number];

const jobName: Readonly<Record<Job, readonly [string, string]>> = {
  preview: ["previews what the text will do", "预告下文要做什么"],
  addition: ["adds a further point", "补充另一个要点"],
  contrast: ["introduces a contrast", "引出对比或转折"],
  example: ["gives an example", "举出例子"],
  result: ["shows a result", "说明结果"],
  summary: ["sums up", "总结"],
};

// The wrong jobs offered for each job leave out the ones a careless reader could defend: an extra fact can read as a
// result, and a summary can read as a result or an addition.
const wrongJobs: Readonly<Record<Job, readonly [Job, Job, Job]>> = {
  preview: ["addition", "contrast", "result"],
  addition: ["contrast", "example", "summary"],
  contrast: ["addition", "example", "result"],
  example: ["contrast", "result", "summary"],
  result: ["contrast", "example", "preview"],
  summary: ["contrast", "example", "preview"],
};

const signposts: Readonly<Record<Job, readonly [string, string, string]>> = {
  preview: ["In what follows,", "In this essay,", "In the sections that follow,"],
  addition: ["In addition,", "Furthermore,", "Moreover,"],
  contrast: ["However,", "By contrast,", "Even so,"],
  example: ["For example,", "For instance,", "To illustrate,"],
  result: ["As a result,", "Therefore,", "Consequently,"],
  summary: ["In short,", "To sum up,", "In summary,"],
};

/** Linked is a sentence, the signpost that opens the next one, the rest of that sentence, and the signpost's job. */
type Linked = readonly [before: string, signpost: string, after: string, job: Job];

const linked: readonly Linked[] = [
  [
    "Few studies have asked why students drop out of online courses.",
    "In what follows,",
    "I first review what is known about online learning, then describe interviews with forty students, and finally suggest changes to course design.",
    "preview",
  ],
  [
    "Green roofs keep buildings cooler in summer.",
    "In addition,",
    "they hold rainwater that would otherwise flood the streets.",
    "addition",
  ],
  [
    "Many people believe that cold weather causes colds.",
    "However,",
    "colds are caused by viruses, which spread more easily when people stay indoors in winter.",
    "contrast",
  ],
  [
    "Some animals change their behaviour in cities.",
    "For example,",
    "some city birds sing at a higher pitch to be heard over traffic.",
    "example",
  ],
  [
    "The bridge was closed for repairs for six months.",
    "As a result,",
    "shops on the far side of the river lost many customers.",
    "result",
  ],
  [
    "Green roofs cool buildings, hold rainwater and give birds a place to live.",
    "In short,",
    "they offer several benefits for a small cost.",
    "summary",
  ],
  [
    "This essay asks whether bike-sharing schemes reduce car use.",
    "In the sections that follow,",
    "I look first at the evidence from large cities and then at smaller towns.",
    "preview",
  ],
  [
    "The new timetable saves students an hour a day.",
    "Furthermore,",
    "it allows teachers to plan lessons together on Friday afternoons.",
    "addition",
  ],
  ["Car use in the city centre fell by a third.", "By contrast,", "car use in the suburbs did not change.", "contrast"],
  [
    "Small changes to a canteen can change what people eat.",
    "For instance,",
    "placing fruit next to the till raised fruit sales by a fifth in one study.",
    "example",
  ],
  ["The questionnaire was only in English.", "Consequently,", "parents who did not read English could not take part.", "result"],
  [
    "The four-day week cut sick days, kept output the same and was popular with staff.",
    "To sum up,",
    "the trial suggests that a shorter week can work in office jobs.",
    "summary",
  ],
  [
    "Opinions about homework for young children are divided.",
    "In this essay,",
    "I set out the case for homework, then the case against it, and end with a recommendation.",
    "preview",
  ],
  [
    "Remote work saves employees the cost of travel.",
    "Moreover,",
    "many say it lets them concentrate better on difficult tasks.",
    "addition",
  ],
  ["The drug worked well in the laboratory.", "However,", "it had no clear effect in patients.", "contrast"],
  ["Words can change their meaning over time.", "For example,", "*nice* once meant foolish.", "example"],
  ["Most of the participants were university students.", "Therefore,", "the findings may not apply to older adults.", "result"],
  [
    "Some studies found an effect and others did not, and most of them were small.",
    "In summary,",
    "the evidence so far is mixed.",
    "summary",
  ],
  [
    "The report looks at three ways to cut the hospital's energy use.",
    "In the sections that follow,",
    "each option is described in turn, with its costs and likely savings.",
    "preview",
  ],
  ["Reading aloud helps children learn new words.", "In addition,", "it gives parents and children time together.", "addition"],
  ["The method is cheap and quick.", "Even so,", "its results are less accurate than those of a full survey.", "contrast"],
  [
    "Some companies now measure results rather than hours.",
    "To illustrate,",
    "one software firm lets staff work any hours they like as long as projects are finished on time.",
    "example",
  ],
  ["Fuel prices doubled in a year.", "As a result,", "many families cut back on car journeys.", "result"],
  ["The plan is cheap, quick to start and supported by local people.", "To sum up,", "it is the best of the three options.", "summary"],
  [
    "Why do some cities manage traffic better than others?",
    "In this essay,",
    "I compare two cities of similar size and ask what explains the difference.",
    "preview",
  ],
  ["The survey was the largest of its kind.", "Furthermore,", "it was repeated three years later with the same families.", "addition"],
  ["The sample was small.", "Even so,", "the difference between the two groups was large enough to be worth further study.", "contrast"],
  [
    "Many inventions came about by accident.",
    "For instance,",
    "a scientist found the first antibiotic after mould grew on a dish he had left uncovered.",
    "example",
  ],
  ["The school moved its start time to nine o'clock.", "Consequently,", "fewer students arrived late.", "result"],
  [
    "The rule cut waste in shops and canteens, but not in homes, where most food is thrown away.",
    "In short,",
    "it tackled the smaller part of the problem.",
    "summary",
  ],
];

const gapItems: readonly ChoiceItem[] = linked.map(([before, signpost, after, job], i): ChoiceItem => {
  const wrong = wrongJobs[job].map((w) => signposts[w][i % 3] as string);
  return [`${before} ___ ${after}`, signpost, wrong];
});

const jobItems: readonly ChoiceItem[] = linked.map(([before, signpost, after, job]): ChoiceItem => {
  const name = (j: Job) => jobName[j][0];
  return [`${before} **${signpost}** ${after}`, name(job), wrongJobs[job].map(name)];
});

/** jobOf finds the job of a signpost or of a job's name. */
const jobOf = (answer: string): Job =>
  jobs.find((j) => jobName[j][0] === answer || (signposts[j] as readonly string[]).includes(answer)) ?? "summary";

/** signposting is the college topic of signposts in academic writing. */
export const signposting: TopicDef = {
  id: "signposting-in-academic-writing",
  title: t("Signposting in Academic Writing", "学术写作中的路标词"),
  summary: t(
    "The phrases that tell a reader where a text is going: previewing what comes, adding, contrasting, giving an example, showing a result and summing up.",
    "告诉读者文章走向的短语：预告下文、补充、对比、举例、说明结果和总结。",
  ),
  prerequisites: ["cohesion-old-before-new"],
  encompasses: [{ topic: "cohesion-old-before-new", weight: 0.2 }],
  xp: 12,
  strand: "writing",
  knowledgePoints: [
    point(
      "choosing-a-signpost",
      t("Choosing a Signpost", "选择路标词"),
      t(
        "A **signpost** tells the reader how the next sentence relates to the last one, before they read it. To choose one, decide what the next sentence does:\n\n- **previews** what the text will do: *In what follows,*, *In this essay,*\n- **adds** a further point of the same kind: *In addition,*, *Furthermore,*, *Moreover,*\n- **contrasts** with what came before: *However,*, *By contrast,*, *Even so,*\n- **gives an example** of a general claim: *For example,*, *For instance,*, *To illustrate,*\n- **shows a result**: *As a result,*, *Therefore,*, *Consequently,*\n- **sums up** what has been said: *In short,*, *To sum up,*, *In summary,*\n\nA wrong signpost misleads: *However* promises a contrast, and the reader looks for one.",
        "**路标词**在读者读下一句之前就告诉他，下一句和上一句是什么关系。选择路标词，要先判断下一句在做什么：\n\n- **预告**下文要做什么：*In what follows,*、*In this essay,*\n- **补充**同类的另一个要点：*In addition,*、*Furthermore,*、*Moreover,*\n- 与前文形成**对比**：*However,*、*By contrast,*、*Even so,*\n- 为一般性说法**举例**：*For example,*、*For instance,*、*To illustrate,*\n- 说明**结果**：*As a result,*、*Therefore,*、*Consequently,*\n- **总结**前面的内容：*In short,*、*To sum up,*、*In summary,*\n\n用错路标词会误导读者：*However* 预示着转折，读者就会去找转折。",
      ),
      choiceGenerator(t("Which signpost fits the gap?", "哪个路标词适合填入空格？"), gapItems, (right) => {
        const job = jobOf(right);
        const [en, zh] = jobName[job];
        return t(`**${right}** The second sentence ${en}.`, `**${right}** 第二句的作用是${zh}。`);
      }),
    ),
    point(
      "naming-what-a-signpost-does",
      t("Naming What a Signpost Does", "说出路标词的作用"),
      t(
        "Reading is faster when you notice signposts: they tell you whether the next sentence previews, adds, contrasts, gives an example, shows a result or sums up. *However* and *Even so* warn that something unexpected follows; *Therefore* and *Consequently* say that what follows is caused by what came before; *In short* and *To sum up* say that nothing new is coming, only the point of what you have read.",
        "注意路标词，阅读就会更快：它们告诉你下一句是在预告、补充、对比、举例、说明结果还是总结。*However* 和 *Even so* 提醒你后面有出乎意料的内容；*Therefore* 和 *Consequently* 说明后面的内容是前文导致的；*In short* 和 *To sum up* 说明后面不会有新内容，只是你所读内容的要点。",
      ),
      choiceGenerator(t("What does the signpost in bold do?", "加粗的路标词起什么作用？"), jobItems, (right, shown) => {
        const job = jobOf(right);
        const signpost = /\*\*(.+?)\*\*/u.exec(shown)?.[1] ?? "";
        return t(
          `**${right}**: *${signpost}* tells the reader that the sentence ${right}.`,
          `**${right}**（${jobName[job][1]}）：*${signpost}* 告诉读者这句话的作用是${jobName[job][1]}。`,
        );
      }),
    ),
  ],
};
