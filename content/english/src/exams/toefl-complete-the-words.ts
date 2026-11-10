// TOEFL Reading, Complete the Words: a short academic text with one word cut after its first half. The learner types
// the word, or only its missing letters. Short words test reading in context; longer words also test the form that the
// sentence needs. Every text is written for this course.

import { joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, quote } from "./kit.ts";

/** Form is why a longer word takes its form in its sentence. */
type Form =
  | "noun"
  | "plural"
  | "uncountable"
  | "singular"
  | "adverb"
  | "adjective"
  | "ing-adjective"
  | "ed-adjective"
  | "passive"
  | "perfect"
  | "past"
  | "after-preposition"
  | "base"
  | "in-progress";

const formWhy: Record<Form, Text> = {
  noun: t("The gap follows *the*, *an* or a possessive, so it needs a noun.", "空格前是 the、an 或所有格，需要一个名词。"),
  plural: t(
    "A word such as *many*, *both*, *two of* or *hundreds of* shows that the noun must be plural.",
    "many、both、two of、hundreds of 等词说明这个名词要用复数。",
  ),
  uncountable: t("*Information* is uncountable, so it has no plural form.", "information 是不可数名词，没有复数形式。"),
  singular: t("The verb *has* shows that the noun is singular.", "动词 has 说明这个名词是单数。"),
  adverb: t("The word describes a verb or an adjective, so it is an adverb in *-ly*.", "这个词修饰动词或形容词，所以用以 -ly 结尾的副词。"),
  adjective: t(
    "The word follows *be*, *become* or *make it*, or comes before a noun, so it is an adjective.",
    "这个词跟在 be、become、make it 之后或用在名词前，所以用形容词。",
  ),
  "ing-adjective": t(
    "An *-ing* adjective describes what causes a feeling, such as a match or a lecture.",
    "以 -ing 结尾的形容词描述引起某种感受的事物，例如比赛或讲座。",
  ),
  "ed-adjective": t("An *-ed* adjective describes how people feel.", "以 -ed 结尾的形容词描述人的感受。"),
  passive: t(
    "The subject receives the action, so *was* is followed by a past participle.",
    "主语是动作的承受者，所以 was 之后用过去分词。",
  ),
  perfect: t("After *have* or *has*, a verb takes its past participle.", "have 或 has 之后用过去分词。"),
  past: t("*Last year* places the action in the past, so the verb is in the past simple.", "last year 表示过去，所以动词用一般过去时。"),
  "after-preposition": t(
    "After a preposition such as *before* or *without*, a verb takes *-ing*.",
    "在 before、without 等介词之后，动词用 -ing 形式。",
  ),
  base: t("After *to*, a verb takes its base form.", "to 之后动词用原形。"),
  "in-progress": t("After *are*, a verb takes *-ing* for an action in progress.", "are 之后用 -ing 形式表示正在进行的动作。"),
};

/** Cut is a text with one word marked in brackets, and plausible wrong words. */
interface Cut {
  readonly text: string;
  readonly wrong: readonly string[];
  readonly form?: Form;
}

/** split finds the bracketed word of a text and the text around it. */
function split(text: string): { before: string; word: string; after: string } {
  const match = /^(.*)\[([a-z]+)\](.*)$/su.exec(text);
  if (!match) throw new Error(`no word in brackets: ${text}`);
  return { before: match[1] as string, word: match[2] as string, after: match[3] as string };
}

function completeGenerator(question: Text, bank: readonly Cut[]): (rng: Rng) => Problem {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const { before, word, after } = split(item.text);
    const kept = word.slice(0, Math.floor(word.length / 2));
    const full = `${before}**${word}**${after}`;
    const why = item.form ? formWhy[item.form] : undefined;
    return {
      prompt: joinText([question, same(quote(`${before}${kept}\\_\\_\\_${after}`))]),
      answer: { checker: "word-form", expected: [word, word.slice(kept.length)], input: { kind: "text" } },
      solution: joinText([t(`The word is **${word}**.`, `这个词是 **${word}**。`), ...(why ? [why] : []), same(quote(full))]),
      canonical: word,
      wrong: [...item.wrong],
    };
  };
}

const question = t("Complete the word. Type the whole word, or only its missing letters.", "补全这个词。输入整个词，或只输入缺少的字母。");

const short: readonly Cut[] = [
  { text: "Bats hunt at night. They make high sounds and [listen] for the echoes that come back.", wrong: ["listens"] },
  { text: "Early maps were often drawn on animal skin, which lasted [longer] than paper.", wrong: ["long"] },
  { text: "Bread rises because yeast produces gas, and the gas is [caught] in the dough.", wrong: ["cause"] },
  { text: "Most of the water on Earth is salt water, and only a very [small] part of it is fresh.", wrong: ["smaller"] },
  { text: "Some birds fly thousands of kilometers each year, yet they [usually] return to the same nest.", wrong: ["useful"] },
  { text: "Children learn their first language without lessons, simply by hearing [others] speak.", wrong: ["other"] },
  { text: "In the desert, many plants store water in their thick [leaves].", wrong: ["leafs"] },
  { text: "The moon has no air, so there is no [weather] there: no wind, no rain and no clouds.", wrong: ["wear"] },
  { text: "Thousands of years ago, farmers [chose] the seeds of their best plants to grow the next year.", wrong: ["choose"] },
  { text: "Pots of honey thousands of years old have been [found], and the honey could still be eaten.", wrong: ["founded"] },
  { text: "Sound travels faster through water [than] through air.", wrong: ["then"] },
  { text: "The heart of an adult beats about seventy [times] a minute.", wrong: ["time"] },
  { text: "Volcanoes can be dangerous, but the soil [around] them is often very rich.", wrong: ["arose"] },
  { text: "Glaciers move very slowly, sometimes only a few meters a [year].", wrong: ["years"] },
  { text: "Penguins cannot fly, but they swim very [well].", wrong: ["good"] },
  { text: "When the population of a city grows quickly, the [price] of housing usually rises.", wrong: ["prize"] },
  { text: "The first clocks used falling water to [measure] time.", wrong: ["means"] },
  { text: "Many insects can see colors [that] people cannot.", wrong: ["them"] },
  { text: "The brain uses about a fifth of the body's [energy], although it is small.", wrong: ["enemy"] },
  { text: "Paper was invented in China about two thousand years [ago].", wrong: ["age"] },
  { text: "Rivers carry sand and stones [down] to the sea.", wrong: ["done"] },
  { text: "A healthy diet [should] contain plenty of fruit and vegetables.", wrong: ["shown"] },
  { text: "The ocean takes in heat from the sun and [slowly] gives it back.", wrong: ["slow"] },
  { text: "Elephants can [smell] water from far away.", wrong: ["small"] },
  { text: "Without bees, [many] plants could not produce fruit.", wrong: ["make"] },
  { text: "The Romans built roads so well that some are [still] used today.", wrong: ["stall"] },
  { text: "Light from the sun takes about eight minutes to [travel] to the Earth.", wrong: ["trade"] },
  { text: "Salt was once [worth] as much as gold in some places.", wrong: ["worse"] },
  { text: "Trees lose water through [tiny] holes in their leaves.", wrong: ["time"] },
  { text: "Scientists [believe] that the first people reached Australia at least fifty thousand years ago.", wrong: ["belief"] },
  { text: "A thirsty camel can drink a hundred liters of water in ten [minutes].", wrong: ["minute"] },
  { text: "The Earth's [center] is about as hot as the surface of the sun.", wrong: ["central"] },
];

const long: readonly Cut[] = [
  { text: "The [development] of the printing press made books much cheaper.", wrong: ["developing", "develop"], form: "noun" },
  {
    text: "The final match was [exciting]: the score changed six times in the last ten minutes.",
    wrong: ["excited"],
    form: "ing-adjective",
  },
  { text: "Many scientists were [surprised] when the results came in.", wrong: ["surprising"], form: "ed-adjective" },
  { text: "The scouts examine each possible home [carefully] before they return.", wrong: ["careful"], form: "adverb" },
  { text: "The bridge was [designed] by a young engineer in 1890.", wrong: ["design", "designing"], form: "passive" },
  { text: "Two of the oldest [universities] in Europe are in Italy.", wrong: ["university"], form: "plural" },
  { text: "Coral reefs are [particularly] sensitive to warm water.", wrong: ["particular"], form: "adverb" },
  {
    text: "Before [publishing] their results, researchers ask other experts to check their work.",
    wrong: ["publish", "published"],
    form: "after-preposition",
  },
  { text: "The [population] of the city doubled in twenty years.", wrong: ["popular"], form: "noun" },
  {
    text: "Maps became far more [accurate] once people at sea could measure their position.",
    wrong: ["accuracy", "accurately"],
    form: "adjective",
  },
  { text: "The [discovery] of penicillin in 1928 changed medicine.", wrong: ["discover", "discovered"], form: "noun" },
  { text: "Wind farms make electricity without [producing] harmful gases.", wrong: ["produce", "produced"], form: "after-preposition" },
  { text: "Honeybees share [information] about food by dancing.", wrong: ["informations"], form: "uncountable" },
  { text: "The museum's collection has grown [steadily] since it opened.", wrong: ["steady"], form: "adverb" },
  { text: "Hundreds of [languages] have disappeared in the last hundred years.", wrong: ["language"], form: "plural" },
  { text: "The new medicine was [developed] in less than a year.", wrong: ["develop", "developing"], form: "passive" },
  { text: "The city became [increasingly] crowded as factories opened.", wrong: ["increasing"], form: "adverb" },
  { text: "Students who sleep well tend to [remember] more of what they learn.", wrong: ["remembered", "remembering"], form: "base" },
  { text: "The [temperature] of the ocean has risen over the last century.", wrong: ["temperatures"], form: "singular" },
  { text: "Many [experiments] have shown that bees can count.", wrong: ["experiment"], form: "plural" },
  { text: "Scientists have [discovered] a new kind of frog in the forests of Peru.", wrong: ["discover", "discovering"], form: "perfect" },
  {
    text: "Modern engines are far more [efficient] than older ones: they use less fuel.",
    wrong: ["efficiency", "efficiently"],
    form: "adjective",
  },
  { text: "The lecture was [interesting], but it was too long.", wrong: ["interested"], form: "ing-adjective" },
  { text: "The students were [disappointed] that the trip was canceled.", wrong: ["disappointing"], form: "ed-adjective" },
  { text: "Scientists are [studying] how the virus spreads from animals to people.", wrong: ["study", "studied"], form: "in-progress" },
  { text: "The library has [recently] changed its opening hours.", wrong: ["recent"], form: "adverb" },
  { text: "Water is an [important] part of every diet.", wrong: ["importance"], form: "adjective" },
  { text: "Reading [regularly] improves both vocabulary and spelling.", wrong: ["regular"], form: "adverb" },
  { text: "Last year the town [celebrated] its five hundredth birthday.", wrong: ["celebrate", "celebrating"], form: "past" },
  { text: "After ten years of talks, the two countries finally reached an [agreement].", wrong: ["agree"], form: "noun" },
  { text: "Both [scientists] won a prize for their work on bees.", wrong: ["scientist"], form: "plural" },
  { text: "Lack of sleep makes it [difficult] to concentrate.", wrong: ["difficulty"], form: "adjective" },
  { text: "The new machine is [completely] safe for children to use.", wrong: ["complete"], form: "adverb" },
];

/** completeTheWords is the Complete the Words task of TOEFL Reading. */
export const completeTheWords: TopicDef = examTopic({
  id: "toefl-complete-the-words",
  title: t("Complete the Words", "补全单词"),
  summary: t(
    "Complete a word cut after its first half, from the sentence around it: first short words, then longer words whose form the sentence decides.",
    "根据上下文补全只给出前半部分的单词：先是短词，再是形式由句子决定的长词。",
  ),
  strand: "reading",
  prerequisites: ["b2-words-linking-1", "b2-words-research-2"],
  encompasses: [],
  xp: 10,
  points: [
    point(
      "short-words",
      t("Short words", "短词"),
      t(
        "Read the whole sentence before you type. Ask what the sentence needs at the gap: a noun after *the*, a verb after *can*, a word such as *than* after *faster*. Then think of a word that begins with the letters shown and fits the meaning.",
        "先读完整个句子再输入。想一想空格处句子需要什么：the 之后是名词，can 之后是动词，faster 之后是 than 等。然后想出一个以所给字母开头、意思又通顺的词。",
      ),
      completeGenerator(question, short),
    ),
    point(
      "longer-words",
      t("Longer words and their forms", "长词及其形式"),
      t(
        "With a longer word, the first half often shows the word, but not its ending. Look at the words around the gap: an article asks for a noun, *many* for a plural, *was* for a past participle, a preposition for *-ing*, and a verb or an adjective for an adverb in *-ly*.",
        "长词的前半部分往往已经显示出是哪个词，但看不出词尾。看空格周围的词：冠词要求名词，many 要求复数，was 要求过去分词，介词要求 -ing 形式，修饰动词或形容词则用以 -ly 结尾的副词。",
      ),
      completeGenerator(question, long),
    ),
  ],
});
