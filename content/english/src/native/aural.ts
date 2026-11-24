// Listening and reading aloud in the native grades (S1 and S3, §9.1 of the design): each unit of a grade from grade 1
// gets a listening topic, which plays the passages of the unit's reading unit read aloud, without their text, and asks
// their questions, and then a topic of reading aloud, where sentences and short stretches of those passages are read
// at a speaking pace. Native courses do not practice pronunciation: an accent passes as long as the words are clear.

import {
  type CourseDef,
  type Generator,
  type PassageDef,
  type Problem,
  type ReadingUnitDef,
  spokenWords,
  type Text,
  type TopicDef,
  t,
  type UnitDef,
} from "@ga/content";
import { point } from "@ga/subject-english";
import { withRecordings } from "../audio.ts";
import { heardAs, LANGUAGE } from "../levels/speaking.ts";
import type { Pack } from "../pack.ts";

/** MIN_QUESTIONS is the fewest questions a listening topic may ask. */
const MIN_QUESTIONS = 8;

/** MIN_SENTENCES is the fewest sentences a topic of reading aloud may give, and MIN_STRETCHES the fewest stretches. */
const MIN_SENTENCES = 10;
const MIN_STRETCHES = 5;

/**
 * A sentence read aloud has 6 to 24 words, or from SHORT_SENTENCE words when the passages give fewer than FEW_SENTENCES
 * of those, as the short sentences of the first grades do; a stretch of sentences has 25 to 45, about 20 seconds at a
 * speaking pace.
 */
const SENTENCE_WORDS = [6, 24] as const;
const SHORT_SENTENCE = 4;
const FEW_SENTENCES = 30;
const STRETCH_WORDS = [25, 45] as const;

/** readAloudSeconds is how long a recording of a text read aloud may be: about two words a second, and some to start. */
const readAloudSeconds = (text: string) => Math.min(30, 6 + Math.ceil(spokenWords(text).length * 0.5));

/** slug is the kebab-case form of a unit's title. */
const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[’']/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");

/** sentencesOf are the sentences of a passage, in order; a poem's lines run on into its sentences. */
export function sentencesOf(body: string): readonly string[] {
  return body
    .split(/\n\s*\n/u)
    .flatMap((paragraph) =>
      paragraph
        .replace(/\s*\n\s*/gu, " ")
        .split(/(?<=[.!?][”"’)]?)\s+(?=[“"(]?[A-Z])/u)
        .map((s) => s.trim()),
    )
    .filter((s) => s.length > 0);
}

/**
 * spokenOf is the text of a passage as it is spoken: a play's list of characters, its setting and its stage directions
 * in brackets are left out, and its lines keep the names of who says them.
 */
export function spokenOf(body: string): string {
  return body
    .split(/\n\s*\n/u)
    .filter((paragraph) => !/^\s*(CHARACTERS|SETTING):/u.test(paragraph))
    .map((paragraph) => paragraph.replace(/\s*\[[^\]]*\]/gu, "").trim())
    .filter((paragraph) => paragraph.length > 0 && !/^[A-Z][A-Z ]*:$/u.test(paragraph))
    .join("\n\n");
}

/** readable tells whether a sentence can be read aloud and heard back as written: words only, without numerals. */
const readable = (s: string) => !/\d|[—–-]{2}|[[\]{}/*_#]/u.test(s) && /[.!?][”"’)]?$/u.test(s);

/**
 * FEW_STRETCHES is the number of stretches below which the runs may overlap, so that short passages give as many
 * stretches as a knowledge point needs for its practice.
 */
const FEW_STRETCHES = 30;

/**
 * stretchesOf are runs of consecutive sentences of a passage within STRETCH_WORDS, each starting a new run; when they
 * overlap, a run starts at every sentence and ends at every sentence that keeps it within STRETCH_WORDS.
 */
function stretchesOf(sentences: readonly string[], overlap = false): readonly string[] {
  const out: string[] = [];
  for (let i = 0; i < sentences.length; ) {
    const run: string[] = [];
    let n = 0;
    let j = i;
    while (j < sentences.length && readable(sentences[j]!) && n + spokenWords(sentences[j]!).length <= STRETCH_WORDS[1]) {
      n += spokenWords(sentences[j]!).length;
      run.push(sentences[j]!);
      j++;
      if (overlap && j < sentences.length && n >= STRETCH_WORDS[0] && run.length > 1) out.push(run.join(" "));
    }
    if (n >= STRETCH_WORDS[0] && run.length > 1 && !(overlap && out.at(-1) === run.join(" "))) out.push(run.join(" "));
    i = overlap ? i + 1 : Math.max(j, i + 1);
  }
  return out;
}

/** choiceOf is a choice problem among Text options, the right one placed by the seed. */
function choiceOf(fields: Omit<Problem, "answer" | "canonical" | "wrong">, right: Text, wrong: readonly Text[], at: number): Problem {
  const options = [...wrong];
  options.splice(at % (wrong.length + 1), 0, right);
  const index = options.indexOf(right);
  return {
    ...fields,
    answer: { checker: "choice", expected: index, input: { kind: "choice", options } },
    canonical: String(index),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(index)),
  };
}

/** Band groups the twelve native grades by tone: early primary, upper primary, middle school, and high school. */
type Band = "early" | "upper" | "middle" | "high";

/** bandOf maps a grade key like "grade-1" or "grade-10" to its tone band. */
function bandOf(grade: string): Band {
  const n = Number(grade.replace(/^grade-/u, ""));
  if (n <= 2) return "early";
  if (n <= 5) return "upper";
  if (n <= 8) return "middle";
  return "high";
}

/** listeningIntro builds the topic intro for a grade unit's listening topic. */
function listeningIntro(band: Band, unit: Text): Text {
  if (band === "early")
    return t(
      `Your teacher reads a short story aloud and asks, "Where did the pup hide?" You did not see the page, so your ears do the work. In *${unit.en}*, you will listen to short passages and answer questions about what you heard.`,
      `老师大声读了一小段故事，问你：“小狗藏在哪里？”你面前没有书页，全靠耳朵来听。在《${unit["zh-CN"]}》这一单元，你会听几段朗读，再回答听到的内容。`,
    );
  if (band === "upper")
    return t(
      `When someone reads a story or an article aloud, you cannot skim back over a page. You listen for the key facts as they go by. In *${unit.en}*, you will hear the unit's passages read aloud and answer questions from what you hear.`,
      `听别人朗读故事或短文时，你没法用眼睛回看书页，要一边听一边抓住关键信息。在《${unit["zh-CN"]}》这一单元，你会听本单元篇章的朗读，并根据听到的内容回答问题。`,
    );
  if (band === "middle")
    return t(
      `Listening to a talk or a story takes a different habit from reading: you catch the main idea and key details in real time. In *${unit.en}*, you will listen to the unit's passages without the text and answer questions on them.`,
      `听一段讲解或故事和默读不同，需要边听边抓住主旨和关键细节。在《${unit["zh-CN"]}》这一单元，你将在不看原文的情况下听本单元的篇章，并回答相关问题。`,
    );
  return t(
    `In lectures and discussions, you track an argument or narrative by ear, holding key claims and evidence in mind without a transcript. In *${unit.en}*, you will listen to the unit's passages and answer comprehension questions from the audio alone.`,
    `在讲座和讨论中，你需要靠耳朵跟住论述或叙述，在没有文字稿的情况下记住核心观点和依据。在《${unit["zh-CN"]}》这一单元，你将只听本单元篇章的录音，并回答理解问题。`,
  );
}

/** listeningExplanation builds the KP explanation for a grade unit's listening topic. */
function listeningExplanation(band: Band): Text {
  if (band === "early")
    return t(
      `First, read the question so you know what to listen for. Say the question asks, *"What color was the bird?"* Then listen to the story: *"A blue bird sat on the fence."* When you hear *blue*, you have your answer. You can play the recording again if you miss a word.\n\n> **Watch out.** Do not guess from memory—listen to the exact words in the recording.`,
      `先看问题，知道待会儿要听什么。比如问题问：*“那只鸟是什么颜色的？”* 再听故事：*“一只蓝色的鸟停在篱笆上。”* 听到“蓝色”，答案就出来了。没听清可以再播一遍。\n\n> **注意。** 不要凭印象猜，要听清录音里的原话。`,
    );
  if (band === "upper")
    return t(
      `Read the question before you press play so your ears have a target. If the question asks *why the river flooded*, listen for a cause word like *because* or *after*—for example, *"After three days of rain, the river rose over its banks."* Replay any part you need.\n\n> **Watch out.** A wrong choice often uses a real word from the passage in the wrong place—check what the speaker actually linked it to.`,
      `按下播放前先读问题，让耳朵带着目标去听。如果问题问*河水为什么泛滥*，就留意表示原因的话，比如“下了三天雨后，河水漫过了河岸”。没听清的地方可以重播。\n\n> **注意。** 干扰项常会借用文章里出现过的词，但安错了位置——要核对录音里它到底和哪件事连在一起。`,
    );
  if (band === "middle")
    return t(
      `Preview the question first to set a focus, then listen for the main point and the specific detail that answers it. For instance, if asked *what changed the speaker's mind*, listen for a turning point such as *"Until I saw the test results, I doubted the plan."* Replay the clip to confirm.\n\n> **Watch out.** Do not stop listening as soon as you hear a familiar phrase—the speaker may qualify or overturn it in the very next sentence.`,
      `先看问题明确重点，再边听边抓主旨和回答该问题的具体细节。比如题目问*是什么改变了说话人的想法*，就要留意转折处，如“直到看到测试结果，我才打消了对计划的怀疑”。可以重播录音核实。\n\n> **注意。** 别一听到熟悉的词就急着选，说话人下一句可能就会补充限定或推翻前面的说法。`,
    );
  return t(
    `Read the question before playing the audio so you know whether to track an overall claim, a contrast, or a specific piece of evidence. For example, if asked *how the author supports a claim*, listen for data, examples, or concessions that follow it. Replay the relevant segment to verify exact wording.\n\n> **Watch out.** Plausible distractors often echo a detail from the passage while distorting its role in the argument—verify both the detail and what it supports.`,
    `播放前先读题目，明确需要捕捉的是核心论点、对比关系还是具体论据。例如题目问*作者如何支撑某个观点*，就要留意紧随其后的数据、例证或让步。可重播相关片段核对原话。\n\n> **注意。** 迷惑项往往照搬原文里的某个细节，却歪曲了它在论证中的作用——既要核对细节本身，也要核对它支撑的观点。`,
  );
}

/** readingAloudIntro builds the topic intro for a grade unit's reading-aloud topic. */
function readingAloudIntro(band: Band, unit: Text): Text {
  if (band === "early")
    return t(
      `Imagine reading a line from your book to a friend sitting next to you. If you read each word clearly and stop at the period, your friend can picture the story right away. In *${unit.en}*, you will read sentences and short parts of the passages aloud.`,
      `想象你把书里的一句话念给旁边的朋友听。只要每个词读清楚、到句号停一停，朋友马上就能听明白画面。在《${unit["zh-CN"]}》这一单元，你会大声朗读本单元里的句子和小段落。`,
    );
  if (band === "upper")
    return t(
      `Reading aloud smoothly helps a listener follow the story without seeing the page. Grouping words into natural phrases and pausing at commas and periods makes the meaning clear. In *${unit.en}*, you will practice reading sentences and short passages aloud at a steady pace.`,
      `流畅地朗读能让不看书页的听众也轻松听懂。把词按自然的意群连起来读，在逗号和句号处停顿，意思就会很清楚。在《${unit["zh-CN"]}》这一单元，你会练习以稳定的语速朗读句子和短段落。`,
    );
  if (band === "middle")
    return t(
      `Fluent reading aloud sounds like clear, natural speech rather than one word at a time. Phrasing, punctuation pauses, and steady pacing carry the writer's meaning to the listener. In *${unit.en}*, you will read sentences and short stretches from the unit's passages aloud.`,
      `流畅的朗读听起来像清晰自然的说话，而不是一个词一个词往外蹦。合理的意群停顿和稳定的语速能把作者的意思准确传给听众。在《${unit["zh-CN"]}》这一单元，你会朗读本单元篇章中的句子和短段落。`,
    );
  return t(
    `Reading complex prose aloud at a natural speaking pace tests both accuracy and phrasing: commas, clauses, and sentence boundaries guide how the voice groups ideas. In *${unit.en}*, you will read sentences and short stretches from the unit's passages clearly and fluently.`,
    `用自然的语速朗读较复杂的段落，考验的是准确度与意群切分：逗号、从句和句界决定了声音如何组织意思。在《${unit["zh-CN"]}》这一单元，你将清晰、流畅地朗读本单元篇章中的句子和短段落。`,
  );
}

/** readingAloudSentenceExplanation builds the KP explanation for reading sentences aloud. */
function readingAloudSentenceExplanation(band: Band): Text {
  if (band === "early")
    return t(
      `Look at the whole sentence first, then read it aloud: *"The little frog sat on a log."* Keep words that go together close (*The little frog* / *sat on a log*), and pause at the period.\n\n> **Watch out.** Read every small word too—do not skip *the*, *a*, or *on*.`,
      `先看完整句话，再大声读出来：*"The little frog sat on a log."* 把连在一起的意思顺着读（*The little frog* / *sat on a log*），到句号停下来。\n\n> **注意。** 像 *the*、*a*、*on* 这样的小词也要读出来，不要漏掉。`,
    );
  if (band === "upper")
    return t(
      `Scan the whole sentence once before speaking, then read it in natural phrases: *"After the storm passed, the kids ran into the yard."* Pause briefly at the comma, and let your voice fall at the period.\n\n> **Watch out.** Do not rush past small words like *the*, *to*, or *in*, and do not guess a word from its first letter.`,
      `开口前先扫一遍整句，再按自然意群读出：*"After the storm passed, the kids ran into the yard."* 逗号处稍停，句号处语调下降。\n\n> **注意。** 不要一滑而过漏掉 *the*、*to*、*in* 等小词，也不要只看首字母就猜词。`,
    );
  if (band === "middle")
    return t(
      `Read the sentence silently once to spot its phrasing, then speak it clearly: *"Although the trail looked steep, the hikers reached the ridge before dusk."* Group each clause together, pause lightly at commas, and drop your tone at the full stop.\n\n> **Watch out.** Skipping short function words or running straight through a comma blurs the sentence's structure.`,
      `先默读一遍看清句子的意群，再清晰地读出来：*"Although the trail looked steep, the hikers reached the ridge before dusk."* 每个分句连贯读出，逗号处轻停，句号处语调收住。\n\n> **注意。** 漏读虚词或遇到逗号不停顿，会让句子结构变得含糊。`,
    );
  return t(
    `Preview the sentence to map its clauses before speaking: *"While the early data seemed promising, the follow-up trials revealed a narrower effect."* Phrase each clause cleanly, pause at internal punctuation, and close firmly at the period.\n\n> **Watch out.** Dropping small function words or misreading endings like *-ed* and *-s* changes the grammar of the sentence.`,
    `开口前先看清从句结构：*"While the early data seemed promising, the follow-up trials revealed a narrower effect."* 按分句清晰切分意群，句中标点处稍作停顿，句末稳稳收住。\n\n> **注意。** 漏掉虚词或读错 *-ed*、*-s* 等词尾会改变句子的语法意思。`,
  );
}

/** readingAloudStretchExplanation builds the KP explanation for reading short stretches aloud. */
function readingAloudStretchExplanation(band: Band): Text {
  if (band === "early")
    return t(
      `Now read two or three sentences in a row, like telling a short story: *"Sam opened the gate. A little cat sat on the step. Sam gave it a pat."* Take a short breath at each period, then keep going.\n\n> **Watch out.** Do not stop for a long time between sentences, and do not race through the periods.`,
      `这次连着读两三句话，就像讲一个小故事：*"Sam opened the gate. A little cat sat on the step. Sam gave it a pat."* 每个句号处轻轻换一口气，然后接着往下读。\n\n> **注意。** 句与句之间不要停太久，也不要一口气冲过句号。`,
    );
  if (band === "upper")
    return t(
      `Read two or three sentences together at a steady speaking pace: *"The wind picked up at noon. Dark clouds rolled across the hills. Soon the first drops hit the roof."* Pause briefly at each period so each sentence ends cleanly, then carry the meaning into the next.\n\n> **Watch out.** Do not speed up halfway through—keep the last sentence as clear as the first.`,
      `用平时说话的稳定语速连读两三句话：*"The wind picked up at noon. Dark clouds rolled across the hills. Soon the first drops hit the roof."* 每个句号处稍停一下让句子收干净，再把意思顺接到下一句。\n\n> **注意。** 不要读到一半越读越快，最后一句也要像第一句一样清楚。`,
    );
  if (band === "middle")
    return t(
      `Read the whole stretch at a natural speaking pace so the sentences connect into one thought: *"The bridge looked fragile from the bank. Its planks creaked under every step. Still, the cables held firm against the wind."* Pause briefly at each sentence boundary without breaking the flow.\n\n> **Watch out.** Running two sentences together without a pause—or pausing mid-phrase—makes the passage harder to follow.`,
      `用自然的语速把整段连贯读出来，让句子衔接成完整的意思：*"The bridge looked fragile from the bank. Its planks creaked under every step. Still, the cables held firm against the wind."* 句界处稍停，但不要把语气彻底断开。\n\n> **注意。** 两句话之间不停顿，或在词组中间生硬断开，都会影响听众理解。`,
    );
  return t(
    `Deliver the entire stretch as a coherent passage at a steady speaking pace: *"The committee reviewed three proposals. Two relied on unproven estimates. The third grounded its budget in five years of records."* Mark sentence boundaries with crisp pauses while carrying the logical thread forward.\n\n> **Watch out.** Letting your pace rush or your volume drop at the end of a stretch weakens clarity on the final sentence.`,
    `以稳定的语速把整段当作连贯的篇章读出：*"The committee reviewed three proposals. Two relied on unproven estimates. The third grounded its budget in five years of records."* 在句界处利落停顿，同时把逻辑脉络连贯推进。\n\n> **注意。** 读到后半段语速变快或音量变弱，会让最后一句含糊不清。`,
  );
}

/** readProblem is a problem of reading a text aloud, with half of it read as a wrong response. */
function readProblem(prompt: Text, text: string, band: Band, isStretch: boolean): Problem {
  const words = spokenWords(text);
  const half = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const first = words[0] ?? "";
  const last = words.at(-1) ?? "";
  const hasComma = text.includes(",");
  const solution =
    band === "early"
      ? t(
          `Read the words in smooth groups, ${hasComma ? "taking a tiny pause at the comma and " : ""}stopping at each end mark: *${text}*\n\n**Check.** Point to each word as you check your reading: there are ${words.length} words from **${first}** to **${last}**. Make sure you said every small word and paused at the end mark.`,
          `把词连贯读出来，${hasComma ? "在逗号处轻轻停一下，并" : ""}在句末标点处停顿：*${text}*\n\n**检验。** 对照原文逐词核对刚才的朗读：从 **${first}** 到 **${last}** 一共 ${words.length} 个词，确认没有漏掉小词，句末标点也停住了。`,
        )
      : t(
          `Group the words into natural phrases at a steady speaking pace${isStretch ? ", pausing briefly between sentences" : ""}${hasComma ? " and lightly at commas" : ""}: *${text}*\n\n**Check.** Follow the printed text word by word from **${first}** to **${last}** (${words.length} words in all). Confirm that no small words were dropped and that every punctuation pause matched the meaning.`,
          `用稳定的语速按自然意群读出${isStretch ? "，句与句之间稍作停顿" : ""}${hasComma ? "，逗号处轻停" : ""}：*${text}*\n\n**检验。** 对照原文从 **${first}** 逐词核对到 **${last}**（共 ${words.length} 个词），确认没有漏读小词，且每处标点停顿都符合句意。`,
        );
  return {
    prompt,
    solution,
    answer: {
      checker: "speech",
      expected: { mode: "read", reference: text },
      input: { kind: "speech", language: LANGUAGE, mode: "read", text, maxSeconds: readAloudSeconds(text) },
    },
    canonical: heardAs(text),
    wrong: [heardAs(half)],
  };
}

interface Asked {
  readonly passage: PassageDef;
  readonly question: PassageDef["questions"][number];
}

/** listeningTopic plays the recorded passages of a reading unit and asks their questions, the text unseen. */
function listeningTopic(id: string, unit: Text, reading: ReadingUnitDef, prerequisites: readonly string[], band: Band): TopicDef {
  const passages = reading.passages.filter((p) => p.audio !== undefined);
  const asked: Asked[] = [];
  const most = Math.max(0, ...passages.map((p) => p.questions.length));
  for (let k = 0; k < most; k++) for (const p of passages) if (p.questions[k]) asked.push({ passage: p, question: p.questions[k]! });
  if (asked.length < MIN_QUESTIONS) throw new Error(`${id}: ${asked.length} questions on recorded passages, fewer than ${MIN_QUESTIONS}`);
  const listen: Generator = (rng) => {
    const { passage, question } = rng.cycle(asked)!;
    const checkEn =
      band === "early"
        ? `Replay the part of *${passage.title.en}* that tells this fact. Listen for the exact words, and make sure the other choices do not match what the speaker says.`
        : `Replay the relevant part of *${passage.title.en}* to hear that detail directly, and confirm that the other choices contradict or go beyond what the recording says.`;
    const checkZh =
      band === "early"
        ? `回放《${passage.title["zh-CN"]}》讲到这件事的那一段，听清原话，再核对另外几个选项是不是和录音说的不一样。`
        : `回放《${passage.title["zh-CN"]}》的相关片段直接核对这一细节，并确认其余选项与录音内容不符或超出了录音所述。`;
    return choiceOf(
      {
        prompt: t(
          `Listen to *${passage.title.en}* read aloud, then answer.\n\n**${question.prompt.en}**`,
          `听《${passage.title["zh-CN"]}》的朗读，然后回答。\n\n**${question.prompt["zh-CN"]}**`,
        ),
        listen: [`audio/english/${passage.audio}`],
        solution: t(
          `**${question.right.en}** is right. ${question.solution.en}\n\n**Check.** ${checkEn}`,
          `正确答案是**${question.right["zh-CN"]}**。${question.solution["zh-CN"]}\n\n**检验。** ${checkZh}`,
        ),
      },
      question.right,
      question.wrong,
      rng.int(0, question.wrong.length),
    );
  };
  return {
    id,
    title: t(`Listening: ${unit.en}`, `听力：${unit["zh-CN"]}`),
    summary: t(
      `Listen to the passages of *${reading.title.en}* read aloud, without the text, and answer questions on them.`,
      `不看原文，听《${reading.title["zh-CN"]}》中篇章的朗读，并回答问题。`,
    ),
    intro: listeningIntro(band, unit),
    prerequisites,
    encompasses: [],
    xp: 15,
    strand: "listening",
    knowledgePoints: [point("passages", t("Passages you hear", "听到的篇章"), listeningExplanation(band), listen)],
  };
}

/** readingAloudTopic reads aloud sentences, then stretches of sentences, of a reading unit's passages. */
function readingAloudTopic(id: string, unit: Text, reading: ReadingUnitDef, listening: string, band: Band): TopicDef {
  const all = reading.passages.map((p) => sentencesOf(spokenOf(p.body)));
  const within = (least: number) => [
    ...new Set(
      all.flat().filter((s) => {
        const n = spokenWords(s).length;
        return readable(s) && n >= least && n <= SENTENCE_WORDS[1];
      }),
    ),
  ];
  const usual = within(SENTENCE_WORDS[0]);
  const sentences = usual.length >= FEW_SENTENCES ? usual : within(SHORT_SENTENCE);
  const apart = [...new Set(all.flatMap((p) => stretchesOf(p)))];
  const stretches = apart.length >= FEW_STRETCHES ? apart : [...new Set(all.flatMap((p) => stretchesOf(p, true)))];
  if (sentences.length < MIN_SENTENCES) throw new Error(`${id}: ${sentences.length} sentences, fewer than ${MIN_SENTENCES}`);
  if (stretches.length < MIN_STRETCHES) throw new Error(`${id}: ${stretches.length} stretches, fewer than ${MIN_STRETCHES}`);
  const sentence: Generator = (rng) =>
    readProblem(
      t("Read the sentence aloud, as if you were telling someone.", "大声朗读这个句子，就像在讲给别人听。"),
      rng.cycle(sentences)!,
      band,
      false,
    );
  const stretch: Generator = (rng) =>
    readProblem(
      t(
        "Read the passage aloud at a speaking pace, without stopping between the sentences.",
        "用说话的语速大声朗读这段文字，句与句之间不要停下来。",
      ),
      rng.cycle(stretches)!,
      band,
      true,
    );
  return {
    id,
    title: t(`Reading Aloud: ${unit.en}`, `朗读：${unit["zh-CN"]}`),
    summary: t(
      `Read aloud sentences and short stretches of *${reading.title.en}*, fluently and at a speaking pace.`,
      `流畅地、用说话的语速朗读《${reading.title["zh-CN"]}》中的句子和短段落。`,
    ),
    intro: readingAloudIntro(band, unit),
    prerequisites: [listening],
    encompasses: [],
    xp: 10,
    strand: "speaking",
    spoken: LANGUAGE,
    knowledgePoints: [
      point("sentences", t("Sentences", "句子"), readingAloudSentenceExplanation(band), sentence),
      point("stretches", t("Short passages", "短段落"), readingAloudStretchExplanation(band), stretch),
    ],
  };
}

/** prerequisiteOf is what a unit's listening follows: the last topic of its reading module, or of its first module. */
function prerequisiteOf(unit: UnitDef): readonly string[] {
  const reading = unit.modules.find((m) => m.title.en === "Reading") ?? unit.modules[0];
  const last = reading?.topics.at(-1);
  return last ? [last] : [];
}

/**
 * withAural gives each unit of a grade's courses that has a reading unit a listening module and a speaking module,
 * whose topics are named for the grade and the unit: grade-3-listening-how-plants-live and
 * grade-3-reading-aloud-how-plants-live.
 */
export function withAural(pack: Pack, grade: string, readingUnits: readonly ReadingUnitDef[]): Pack {
  const band = bandOf(grade);
  const byId = new Map(withRecordings(readingUnits).map((u) => [u.id, u]));
  const topics: TopicDef[] = [];
  const seen = new Set<string>();
  const courses = pack.courses.map(
    (course): CourseDef => ({
      ...course,
      units: course.units.map((unit) => {
        const reading = byId.get(unit.reading?.[0] ?? "");
        if (!reading) return unit;
        const s = slug(unit.title.en);
        if (seen.has(s)) throw new Error(`${grade}: two units are named ${s}`);
        seen.add(s);
        const listening = `${grade}-listening-${s}`;
        const aloud = `${grade}-reading-aloud-${s}`;
        topics.push(listeningTopic(listening, unit.title, reading, prerequisiteOf(unit), band));
        topics.push(readingAloudTopic(aloud, unit.title, reading, listening, band));
        return {
          ...unit,
          modules: [
            ...unit.modules,
            { title: t("Listening", "听力"), topics: [listening] },
            { title: t("Speaking", "口语"), topics: [aloud] },
          ],
        };
      }),
    }),
  );
  return { ...pack, topics: [...pack.topics, ...topics], courses };
}
