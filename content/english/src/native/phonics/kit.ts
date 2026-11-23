// Phonics: the words a young reader decodes, each with near spellings, and the generators of problems with pictures.

import { type Figure, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { withSounds } from "../../audio.ts";
import { allPictureWords, picture } from "./pictures.ts";
import { wordSounds } from "./sounds.ts";

/** Spellings are a picture word with near spellings: two that change the vowel, two the first letter, two the last. */
export interface Spellings {
  readonly word: string;
  readonly vowel: readonly [string, string];
  readonly first: readonly [string, string];
  readonly last: readonly [string, string];
}

/** NearKind names which letter a near spelling changes. */
export type NearKind = "vowel" | "first" | "last";

const rows = `
cat|cot cut|bat mat|cap can
hat|hit hot|cat mat|ham has
cap|cop cup|map tap|cat can
map|mop mup|cap tap|man mat
fan|fin fun|pan van|fat fad
van|ven vin|fan pan|vat val
pan|pen pin|fan can|pat pad
bag|beg big|rag tag|bat bad
can|con cun|fan man|cap cat
rat|rot rut|cat hat|ram rag
bed|bad bid|red fed|beg bet
hen|hun hin|pen ten|hem het
pen|pan pin|hen ten|pet peg
net|nut not|jet wet|ned neg
web|wab wob|neb feb|wet wed
jet|jot jut|net wet|jeb jem
leg|log lag|beg peg|let led
ten|tan tin|hen pen|teg tep
pig|peg pug|big dig|pin pit
pin|pan pen|tin win|pig pit
six|sax sox|fix mix|sip sit
fin|fan fun|pin win|fig fit
bin|ban bun|pin tin|bib bit
bib|bob bub|fib rib|bin big
fig|fog fug|big pig|fin fit
dog|dig dug|log fog|dot don
pot|pat pit|hot dot|pop pod
box|bax bix|fox mox|bog bop
fox|fix fax|box mox|fog fob
mop|map mup|top hop|mob mom
log|leg lag|dog fog|lot lop
top|tip tap|mop hop|tot ton
bus|bas bis|mus tus|bud bug
cup|cap cop|pup sup|cub cut
sun|sin son|bun fun|sub sum
bug|bag big|rug mug|bud bun
tub|tab tob|cub rub|tug tum
rug|rag rig|bug hug|rub run
hut|hat hit|cut nut|hug hum
`;

const pair = (s: string, word: string): readonly [string, string] => {
  const [a, b, ...rest] = s.trim().split(/\s+/u);
  if (!a || !b || rest.length > 0) throw new Error(`${word} needs two near spellings in "${s}"`);
  return [a, b];
};

/** spellings are the near spellings of every picture word, in the order of the pictures. */
export const spellings: readonly Spellings[] = rows
  .trim()
  .split("\n")
  .map((line) => {
    const [word = "", vowel = "", first = "", last = ""] = line.split("|");
    return { word, vowel: pair(vowel, word), first: pair(first, word), last: pair(last, word) };
  });

for (const s of spellings) {
  const near = [...s.vowel, ...s.first, ...s.last];
  if (new Set([s.word, ...near]).size !== 7) throw new Error(`the near spellings of ${s.word} repeat`);
  for (const w of near) {
    if (w.length !== 3) throw new Error(`${w} is not three letters`);
    const changed = [0, 1, 2].filter((i) => w[i] !== s.word[i]);
    if (changed.length !== 1) throw new Error(`${w} must change one letter of ${s.word}`);
  }
  for (const w of s.vowel) if (w[1] === s.word[1]) throw new Error(`${w} keeps the vowel of ${s.word}`);
  for (const w of s.first) if (w[0] === s.word[0]) throw new Error(`${w} keeps the first letter of ${s.word}`);
  for (const w of s.last) if (w[2] === s.word[2]) throw new Error(`${w} keeps the last letter of ${s.word}`);
}
if (spellings.map((s) => s.word).join() !== allPictureWords.join()) throw new Error("spellings must follow the pictures");

/** letters writes a word letter by letter: "c-a-t". */
export const letters = (word: string) => [...word].join("-");

/** caps writes a word in capital letters. */
export const caps = (word: string) => word.toUpperCase();

const bareNouns = new Set([
  "ten",
  "six",
  "chips",
  "mice",
  "dice",
  "feet",
  "teeth",
  "milk",
  "rice",
  "rain",
  "mail",
  "paint",
  "hay",
  "soap",
  "cloth",
]);

/** pictureNoun formats a picture word with the right English article (or none for plurals, mass nouns, and numbers). */
export const pictureNoun = (word: string): string => {
  if (word === "sun") return "the sun";
  if (bareNouns.has(word)) return word;
  return /^[aeiou]/u.test(word) ? `an ${word}` : `a ${word}`;
};

/** PictureItem is a problem about a picture: the question's own words, the options, the right one, and its feedback. */
export interface PictureItem {
  readonly word: string;
  readonly extra?: string;
  readonly right: string;
  readonly wrong: readonly string[];
  readonly solution: Text;
  readonly whyNot?: (wrong: string) => Text;
}

/** soundsFor are the recordings of each word of a bank, asked for when the bank is built and shown with the solution. */
const soundsFor = (bank: readonly { readonly word: string }[]) =>
  new Map(bank.map((item) => [item.word, withSounds(...wordSounds(item.word))]));

/** pictureChoice shows a picture, with any words of the item, and asks to choose among words or letters. */
export function pictureChoice(question: Text, bank: readonly PictureItem[]) {
  const sounds = soundsFor(bank);
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const options = rng.shuffle([item.right, ...item.wrong]);
    const answer = options.indexOf(item.right);
    return {
      prompt: item.extra === undefined ? question : joinText([question, same(item.extra)]),
      figure: picture(item.word),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(same) } },
      solution: item.solution,
      ...sounds.get(item.word),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      ...(item.whyNot && { mistakes: item.wrong.map((w) => ({ response: String(options.indexOf(w)), feedback: item.whyNot!(w) })) }),
    };
  };
}

/** PicturesItem is a word to read and the pictures to choose among, the first of them right. */
export interface PicturesItem {
  readonly word: string;
  readonly pictures: readonly string[];
  readonly solution: Text;
}

/** pictureOptions shows a word and asks to choose the picture it names. */
export function pictureOptions(question: Text, bank: readonly PicturesItem[]) {
  const sounds = soundsFor(bank);
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const options = rng.shuffle([...item.pictures]);
    const answer = options.indexOf(item.word);
    const figures: Figure[] = options.map(picture);
    return {
      prompt: joinText([question, same(`**${item.word}**`)]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: figures.map((f) => f.alt), figures } },
      solution: item.solution,
      ...sounds.get(item.word),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: options
        .filter((w) => w !== item.word)
        .map((w) => ({
          response: String(options.indexOf(w)),
          feedback: t(
            `That picture shows ${pictureNoun(w)}, spelled *${letters(w)}*. Look again at each letter of **${item.word}**.`,
            `那张图是 ${w}，拼作 *${letters(w)}*。再看看 **${item.word}** 的每个字母。`,
          ),
        })),
    };
  };
}

/** TypedPictureItem is a picture with any words of the item, the accepted answers and likely wrong ones. */
export interface TypedPictureItem {
  readonly word: string;
  readonly extra?: string;
  readonly accepted: readonly string[];
  readonly wrong: readonly string[];
  readonly solution: Text;
}

/** pictureTyped shows a picture and asks to type a letter or a word. */
export function pictureTyped(question: Text, bank: readonly TypedPictureItem[]) {
  const sounds = soundsFor(bank);
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    return {
      prompt: item.extra === undefined ? question : joinText([question, same(item.extra)]),
      figure: picture(item.word),
      answer: { checker: "word-form", expected: [...item.accepted], input: { kind: "text" } },
      solution: item.solution,
      ...sounds.get(item.word),
      canonical: item.accepted[0] ?? "",
      wrong: [...item.wrong],
    };
  };
}

/** PhonicsTopic is what a phonics topic declares; the kit fills in what every phonics topic shares. */
export type PhonicsTopic = Omit<TopicDef, "encompasses" | "knowledgePoints"> & {
  readonly encompasses?: TopicDef["encompasses"];
  readonly knowledgePoints: TopicDef["knowledgePoints"];
};

/** phonicsTopic builds a topic of the phonics course. */
export const phonicsTopic = (def: PhonicsTopic): TopicDef => ({ ...def, encompasses: def.encompasses ?? [] });
