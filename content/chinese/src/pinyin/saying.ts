// Saying pinyin (docs/chinese-curriculum.md §5, docs/chinese-development-plan.md C2.4): a word is played and the learner
// says it after the recording, heard by a speech service that assesses each syllable against the word. The words drill
// the pairs of tones one after another, then the tones that change in speech: two third tones, 一 and 不. A syllable said
// wrong is named with what was wrong in it, its initial, its final or its tone.

import { type Generator, heardResponse, type Problem, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import { heard } from "../audio.ts";
import { parseSyllable } from "./syllables.ts";
import { PITCH_EN, PITCH_ZH, TONE_EN, TONE_ZH } from "./teach.ts";

/** LANGUAGE is the language the pinyin course is spoken in: standard Mandarin. */
export const LANGUAGE = "zh-CN";

/** SaidWord is a word to say: its characters, its pinyin as written, and how it is said when that differs. */
export interface SaidWord {
  readonly word: string;
  readonly pinyin: string;
  readonly said?: string;
}

/** heardAs is the response of a word heard clearly. */
const heardAs = (text: string) => heardResponse({ text, confidence: 0.95, seconds: [...text].length * 0.4 + 0.5 });

/** tonesOf are the tones of the syllables of a word's pinyin, with each syllable as written. */
const tonesOf = (pinyin: string): readonly (readonly [string, number])[] =>
  pinyin.split(" ").map((x) => {
    const s = parseSyllable(x);
    if (!s) throw new Error(`pinyin saying: ${x} has no tone`);
    return [x, s.tone] as const;
  });

/** hum says how the pitch of a word moves, syllable by syllable. */
const hum = (pinyin: string): Text => {
  const tones = tonesOf(pinyin).map(([, tone]) => tone - 1);
  return t(tones.map((n) => PITCH_EN[n]).join(", then "), tones.map((n) => PITCH_ZH[n]).join("，然后"));
};

/** saying describes each syllable of a word's pinyin with its tone. */
const saying = (pinyin: string): Text => {
  const tones = tonesOf(pinyin);
  return t(
    tones.map(([x, tone]) => `${x} is the ${TONE_EN[tone - 1]} tone, ${PITCH_EN[tone - 1]}`).join("; "),
    tones.map(([x, tone]) => `${x} 是${TONE_ZH[tone - 1]}，${PITCH_ZH[tone - 1]}`).join("；"),
  );
};

/** humCheck checks a word said by humming its pitch first. */
const humCheck = (pinyin: string): Text => {
  const h = hum(pinyin);
  return t(
    `**Check.** Hum the word's pitch without its sounds (${h.en}), and say the word over the hum: it should sound like the recording.`,
    `**检验。** 先不发音，只把音高哼出来：${h["zh-CN"]}；再照着这个调子把词说出来，应该和录音一样。`,
  );
};

/** pairWhy works a word whose tones do not change: hear each tone, then say it. */
const pairWhy = (w: SaidWord): Text => {
  const each = saying(w.pinyin);
  const check = humCheck(w.pinyin);
  return t(
    `**Step 1: hear the tones.** ${w.word} ${w.pinyin}: ${each.en}.

**Step 2: say it after the recording.** Say each syllable in its own tone, at the recording's pace, as one word.

${check.en}`,
    `**第一步：听声调。**${w.word} ${w.pinyin}：${each["zh-CN"]}。

**第二步：跟着录音说。**每个音节读准自己的声调，用录音的速度连成一个词。

${check["zh-CN"]}`,
  );
};

/** changeWhy works a word whose tone changes in speech: find the change and why, then say it as it is said. */
const changeWhy = (w: SaidWord): Text => {
  const said = w.said ?? w.pinyin;
  const written = w.pinyin.split(" ");
  const spoken = said.split(" ");
  const at = spoken.findIndex((x, i) => x !== written[i]);
  const chars = [...w.word];
  const next = tonesOf(w.pinyin)[at + 1]?.[1];
  const char = at < 0 ? chars.at(-1) : chars[at];
  const reason =
    at < 0
      ? t(`${char} ends the word, so it keeps its own tone.`, `“${char}”在词尾，读原调。`)
      : char === "一"
        ? next === 4
          ? t("一 comes before a fourth tone, so it is said in the second tone.", "“一”在第四声前，读第二声。")
          : t("一 comes before a tone other than the fourth, so it is said in the fourth tone.", "“一”在第四声以外的声调前，读第四声。")
        : char === "不"
          ? t("不 comes before a fourth tone, so it is said in the second tone.", "“不”在第四声前，读第二声。")
          : t("Two third tones come together, so the first is said in the second tone.", "两个第三声相连，前一个读第二声。");
  const each = saying(said);
  const check = humCheck(said);
  return t(
    `**Step 1: find the change.** ${w.word} is written ${w.pinyin}. ${reason.en} The word is said ${said}.

**Step 2: say it after the recording.** Say ${said}: ${each.en}.

${check.en}`,
    `**第一步：找出变调。**“${w.word}”写作 ${w.pinyin}。${reason["zh-CN"]}整个词读作 ${said}。

**第二步：跟着录音说。**读 ${said}：${each["zh-CN"]}。

${check["zh-CN"]}`,
  );
};

/** repeating plays each word in turn and asks for it said after the recording; another word said instead is wrong. */
function repeating(words: readonly SaidWord[], why: (w: SaidWord) => Text): Generator {
  if (words.length < 30) throw new Error(`pinyin saying: ${words.length} words, fewer than 30`);
  for (const w of words) heard(w.word);
  let i = 0;
  const order = words.map((w) => ({ w, other: words[(i++ * 7 + 3) % words.length]! }));
  return (rng): Problem => {
    const { w, other } = rng.cycle(order);
    const sayAs = w.said && w.said !== w.pinyin ? w.said : undefined;
    return {
      prompt: t(
        `Listen, then say the word after the recording:\n\n**${w.word}** ${w.pinyin}${sayAs ? `, said ${sayAs}` : ""}`,
        `听录音，然后跟着说这个词：\n\n**${w.word}** ${w.pinyin}${sayAs ? `，读作 ${sayAs}` : ""}`,
      ),
      listen: [heard(w.word)],
      solution: why(w),
      answer: {
        checker: "speech",
        expected: { mode: "repeat", reference: w.word },
        input: { kind: "speech", language: LANGUAGE, mode: "repeat", text: w.word, maxSeconds: 5 },
      },
      canonical: heardAs(w.word),
      wrong: [heardAs(other.word === w.word ? "你好" : other.word)],
    };
  };
}

/** rows reads lines of ` | `-separated fields. */
const rows = (data: string): readonly (readonly string[])[] =>
  data
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "")
    .map((l) => l.split(" | ").map((f) => f.trim()));

/** tonePairs are common words of two syllables, three for each pair of tones but two third tones, which change. */
const tonePairs: readonly SaidWord[] = rows(`
今天 | jīn tiān
飞机 | fēi jī
咖啡 | kā fēi
中国 | Zhōng guó
欢迎 | huān yíng
家庭 | jiā tíng
开始 | kāi shǐ
铅笔 | qiān bǐ
黑板 | hēi bǎn
工作 | gōng zuò
音乐 | yīn yuè
生日 | shēng rì
明天 | míng tiān
房间 | fáng jiān
熊猫 | xióng māo
学习 | xué xí
银行 | yín háng
同学 | tóng xué
苹果 | píng guǒ
牛奶 | niú nǎi
词典 | cí diǎn
学校 | xué xiào
节目 | jié mù
同意 | tóng yì
老师 | lǎo shī
北京 | Běi jīng
每天 | měi tiān
语言 | yǔ yán
美国 | Měi guó
女孩 | nǚ hái
考试 | kǎo shì
礼物 | lǐ wù
晚饭 | wǎn fàn
面包 | miàn bāo
汽车 | qì chē
唱歌 | chàng gē
问题 | wèn tí
地图 | dì tú
大学 | dà xué
电脑 | diàn nǎo
汉语 | Hàn yǔ
下雨 | xià yǔ
再见 | zài jiàn
电视 | diàn shì
睡觉 | shuì jiào
`).map(([word, pinyin]) => ({ word: word!, pinyin: pinyin! }));

/** sayingTopic is the spoken topic of the pinyin course, given the words whose tones change in speech. */
export function sayingTopic(changes: readonly SaidWord[], prerequisites: readonly string[]): TopicDef {
  return {
    id: "pinyin-saying",
    title: t("Saying Words", "说词语"),
    summary: t(
      "Saying words of two syllables after a recording: each pair of tones, then the tones that change in speech.",
      "跟着录音说双音节词语：各种声调组合，以及说话时的变调。",
    ),
    prerequisites,
    encompasses: [],
    xp: 8,
    strand: "pinyin",
    spoken: LANGUAGE,
    intro: t(
      "Saying a word after a recording puts together what the other pinyin topics teach: each syllable in its tone, and the tones that change in speech. 熊猫 xióng māo rises, then stays high and level; 你好, written nǐ hǎo, is said ní hǎo. Listen to the whole word first, then say it at the recording's pace.\n\nThe first knowledge point says words whose tones stay as written, the second words whose tones change in speech.",
      "跟着录音说词语，要用上前面拼音课学的所有东西：每个音节的声调，以及说话时的变调。“熊猫”xióng māo 先往上升，再高而平；“你好”写作 nǐ hǎo，读作 ní hǎo。先把整个词听完，再用录音的速度说出来。\n\n第一个知识点说声调不变的词语，第二个说有变调的词语。",
    ),
    knowledgePoints: [
      point(
        "pinyin-saying-tone-pairs",
        t("Pairs of Tones", "声调组合"),
        t(
          "In a word of two syllables, each keeps its tone: keep the first tone high and level, let the second rise, keep the third low, and let the fourth fall. Listen to the recording, then say the word at the same pace, syllable by syllable in its tone.\n\n学校 xué xiào is a rising tone, then a falling one: xué goes up, xiào comes down from high.\n\n> **Watch out.** Do not let the second syllable copy the first. In 学校 the second syllable falls; said with a rise, it would be xué xiáo, which is not the word.",
          "双音节词语里每个音节都保持自己的声调：第一声高而平，第二声往上升，第三声压低，第四声往下降。先听录音，再用同样的速度把每个音节按声调读出来。\n\n比如“学校”xué xiào，先升后降：xué 往上升，xiào 从高处降下来。\n\n> **注意。** 不要让后一个音节跟着前一个走。“学校”的后一个音节是降调；如果也读成升调，就成了 xué xiáo，不是这个词了。",
        ),
        repeating(tonePairs, pairWhy),
      ),
      point(
        "pinyin-saying-tone-changes",
        t("Tones That Change", "变调"),
        t(
          "Some tones change in speech while pinyin writes the original: the first of two third tones is said in the second tone (你好 ní hǎo); 一 is said yí before a fourth tone and yì before the others; 不 is said bú before a fourth tone. Listen for the change in the recording, and copy it.\n\n一定 is written yī dìng. dìng is a fourth tone, so 一 rises: yídìng.\n\n> **Watch out.** Say the tone the rule gives, not the one written. Read straight from the pinyin, 一定 would come out yī dìng, and 你好 nǐ hǎo with two dips, which is not how they are said.",
          "有些声调在说话时会变，拼音仍写原调：两个第三声相连，前一个读第二声（你好 ní hǎo）；“一”在第四声前读 yí，在其他声调前读 yì；“不”在第四声前读 bú。听出录音里的变调，照着说。\n\n比如“一定”写作 yī dìng。dìng 是第四声，所以“一”往上升：yídìng。\n\n> **注意。** 要按变调规则读，不要照着写出来的声调读。照拼音直接念，“一定”会读成 yī dìng，“你好”会读成两个降升调 nǐ hǎo，都不是实际的读法。",
        ),
        repeating(changes, changeWhy),
      ),
    ],
  };
}
