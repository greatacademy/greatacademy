// Saying pinyin (docs/chinese-curriculum.md §5, docs/chinese-development-plan.md C2.4): a word is played and the learner
// says it after the recording, heard by a speech service that assesses each syllable against the word. The words drill
// the pairs of tones one after another, then the tones that change in speech: two third tones, 一 and 不. A syllable said
// wrong is named with what was wrong in it, its initial, its final or its tone.

import { type Generator, heardResponse, type Problem, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import { heard } from "../audio.ts";

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

/** repeating plays each word in turn and asks for it said after the recording; another word said instead is wrong. */
function repeating(words: readonly SaidWord[]): Generator {
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
      solution: t(`Say each syllable in its tone: ${sayAs ?? w.pinyin}.`, `每个音节读准声调：${sayAs ?? w.pinyin}。`),
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
    knowledgePoints: [
      point(
        "pinyin-saying-tone-pairs",
        t("Pairs of Tones", "声调组合"),
        t(
          "In a word of two syllables, each keeps its tone: keep the first tone high and level, let the second rise, keep the third low, and let the fourth fall. Listen to the recording, then say the word at the same pace, syllable by syllable in its tone.",
          "双音节词语里每个音节都保持自己的声调：第一声高而平，第二声往上升，第三声压低，第四声往下降。先听录音，再用同样的速度把每个音节按声调读出来。",
        ),
        repeating(tonePairs),
      ),
      point(
        "pinyin-saying-tone-changes",
        t("Tones That Change", "变调"),
        t(
          "Some tones change in speech while pinyin writes the original: the first of two third tones is said in the second tone (你好 ní hǎo); 一 is said yí before a fourth tone and yì before the others; 不 is said bú before a fourth tone. Listen for the change in the recording, and copy it.",
          "有些声调在说话时会变，拼音仍写原调：两个第三声相连，前一个读第二声（你好 ní hǎo）；“一”在第四声前读 yí，在其他声调前读 yì；“不”在第四声前读 bú。听出录音里的变调，照着说。",
        ),
        repeating(changes),
      ),
    ],
  };
}
