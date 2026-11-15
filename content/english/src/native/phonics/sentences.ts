// Phonics: short decodable sentences, made only of the patterns and sight words the course has taught, each about a
// picture. Reading them, from a sentence to its picture and from a picture to its sentence, then writing them: the
// picture's word in the gap, then the sentence with its capital letter and full stop.

import { type Figure, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { spoken, withSounds } from "../../audio.ts";
import { letters, phonicsTopic } from "./kit.ts";
import { picture } from "./pictures.ts";
import { wordSounds } from "./sounds.ts";

/** Sentence is a short sentence about a picture word, with two other picture words that look like it. */
interface Sentence {
  readonly word: string;
  readonly text: string;
  readonly others: readonly [string, string];
}

const rows = `
cat|hat rat|A cat can sit on a mat.
pig|fig pin|The pig is in the mud.
bus|bug sun|We get on the bus.
fox|box fan|A fox can dig a den.
hen|pen net|The hen sat on an egg.
ship|shop shell|The ship is on the sea.
fish|dish ship|The fish can swim fast.
duck|sock truck|The duck can swim in the pond.
chick|chin chips|The chick is in the nest.
bath|path moth|I sit in the bath.
frog|flag drum|A frog can hop on a log.
crab|crib clam|The crab is on the sand.
drum|plum dress|Tap the drum with a stick.
nest|vest tent|Three eggs are in the nest.
tent|nest vest|We sleep in a tent.
lamp|stamp pump|Tom has a lamp on his desk.
cake|cape rake|Mom made a cake.
kite|bike pine|The kite has a long tail.
bike|kite hive|Sam can ride a bike.
rope|rose robe|Sam has a long rope.
nose|rose note|The dog has a wet nose.
bone|cone robe|The dog digs up a bone.
cube|tube mule|A cube has six sides.
boat|goat coat|The boat is on the lake.
goat|boat toad|The goat can eat hay.
rain|train chain|The rain will make us wet.
sheep|ship shell|The sheep has a thick coat.
tree|bee train|The cat is up the tree.
snail|nail sail|The snail has a shell.
queen|teeth wheel|The queen waves at us.
`;

const sentences: readonly Sentence[] = rows
  .trim()
  .split("\n")
  .map((line) => {
    const [word = "", others = "", text = ""] = line.split("|");
    const [a = "", b = "", ...rest] = others.split(" ");
    if (rest.length > 0) throw new Error(`${word} needs two other pictures`);
    return { word, text, others: [a, b] };
  });

/** wordsOf splits a sentence into its words, without its full stop. */
const wordsOf = (text: string) => text.replace(/\.$/u, "").split(" ");

for (const s of sentences) {
  if (!/^[A-Z][a-z ]+\.$/u.test(s.text)) throw new Error(`"${s.text}" must start with a capital and end with a full stop`);
  if (wordsOf(s.text).filter((w) => w.toLowerCase() === s.word).length !== 1) throw new Error(`"${s.text}" must name ${s.word} once`);
  for (const o of [s.word, ...s.others]) picture(o);
  if (new Set([s.word, ...s.others]).size !== 3) throw new Error(`the pictures of "${s.text}" repeat`);
  for (const o of s.others) if ("aeiou".includes(o[0] ?? "")) throw new Error(`${o} would need *an*`);
}
if (new Set(sentences.map((s) => s.word)).size !== sentences.length) throw new Error("sentence words repeat");

/** swapped is a sentence with its picture word replaced by another. */
const swapped = (s: Sentence, other: string) =>
  wordsOf(s.text)
    .map((w) => (w === s.word ? other : w))
    .join(" ") + ".";

/** gapped is a sentence with its picture word replaced by a gap. */
const gapped = (s: Sentence) => swapped(s, "___");

const why = (s: Sentence): Text =>
  t(
    `${picture(s.word).alt.en} The sentence is about a **${s.word}**, *${letters(s.word)}*: "${s.text}"`,
    `${picture(s.word).alt["zh-CN"]}这个句子说的是 **${s.word}**，*${letters(s.word)}*："${s.text}"`,
  );

const notIt = (s: Sentence, other: string): Text =>
  t(
    `That one is about a ${other}, spelled *${letters(other)}*, but the picture shows a ${s.word}, *${letters(s.word)}*. Read each word of the sentence again.`,
    `那个说的是 ${other}，拼作 *${letters(other)}*，而图片是 ${s.word}，*${letters(s.word)}*。把句子的每个词再读一遍。`,
  );

/** sentenceSounds are the recordings of each sentence and its picture's word, shown with the solution. */
const sentenceSounds = new Map(sentences.map((s) => [s.text, withSounds(spoken(s.text), ...wordSounds(s.word))]));

/** sentenceToPicture shows a sentence and asks to choose the picture it is about. */
const sentenceToPicture = (rng: Rng): Problem => {
  const s = rng.cycle(sentences);
  const options = rng.shuffle([s.word, ...s.others]);
  const answer = options.indexOf(s.word);
  const figures: Figure[] = options.map(picture);
  return {
    prompt: joinText([t("Which picture is this sentence about?", "这个句子说的是哪张图片？"), same(`**${s.text}**`)]),
    answer: { checker: "choice", expected: answer, input: { kind: "choice", options: figures.map((f) => f.alt), figures } },
    solution: why(s),
    ...sentenceSounds.get(s.text),
    canonical: String(answer),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
    mistakes: s.others.map((o) => ({ response: String(options.indexOf(o)), feedback: notIt(s, o) })),
  };
};

/** pictureToSentence shows a picture and asks to choose the sentence about it. */
const pictureToSentence = (rng: Rng): Problem => {
  const s = rng.cycle(sentences);
  const wrong = s.others.map((o) => swapped(s, o));
  const options = rng.shuffle([s.text, ...wrong]);
  const answer = options.indexOf(s.text);
  return {
    prompt: t("Which sentence is about the picture?", "哪个句子说的是这张图片？"),
    figure: picture(s.word),
    answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(same) } },
    solution: why(s),
    ...sentenceSounds.get(s.text),
    canonical: String(answer),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
    mistakes: s.others.map((o, i) => ({ response: String(options.indexOf(wrong[i] ?? "")), feedback: notIt(s, o) })),
  };
};

/** missingWord shows a picture and its sentence with a gap, and asks to type the picture's word. */
const missingWord = (rng: Rng): Problem => {
  const s = rng.cycle(sentences);
  return {
    prompt: joinText([t("Type the word for the picture that fills the gap.", "键入填空的图片的词。"), same(`**${gapped(s)}**`)]),
    figure: picture(s.word),
    answer: { checker: "word-form", expected: [s.word], input: { kind: "text" } },
    solution: why(s),
    ...sentenceSounds.get(s.text),
    canonical: s.word,
    wrong: [...s.others],
  };
};

/** plain writes a sentence the way the problem shows it: no capital letter, no full stop, but names and *I* keep
 * theirs. */
const plain = (s: Sentence) => {
  const [first = "", ...rest] = wordsOf(s.text);
  const name = /^(I|Sam|Tom|Mom)$/u.test(first);
  return [name ? first : first.toLowerCase(), ...rest].join(" ");
};

/** fullSentence shows a sentence without its capital letter and full stop, and asks to write it properly. */
const fullSentence = (rng: Rng): Problem => {
  const s = rng.cycle(sentences);
  const bare = wordsOf(s.text).join(" ");
  return {
    prompt: joinText([
      t(
        "Write this sentence properly, with a capital letter at the start and a full stop at the end.",
        "把这个句子正确地写出来：开头用大写字母，结尾加句号。",
      ),
      same(`**${plain(s)}**`),
    ]),
    figure: picture(s.word),
    answer: { checker: "sentence", expected: [s.text], input: { kind: "text" } },
    solution: t(
      `A sentence starts with a capital letter and ends with a full stop: "${s.text}"`,
      `句子以大写字母开头，以句号结尾："${s.text}"`,
    ),
    ...sentenceSounds.get(s.text),
    canonical: s.text,
    wrong: [...new Set([`${bare.charAt(0).toLowerCase()}${bare.slice(1)}.`, bare])].filter((w) => w !== s.text),
  };
};

const readingSentences = phonicsTopic({
  id: "reading-decodable-sentences",
  title: t("Reading Short Sentences", "读短句"),
  summary: t(
    "Short sentences such as *A frog can hop on a log.*, made of words a child can sound out and the sight words learned.",
    "*A frog can hop on a log.* 这样的短句，由孩子能拼读的词和学过的常见词组成。",
  ),
  prerequisites: ["reading-words-with-vowel-teams", "reading-sight-words", "reading-words-with-blends", "reading-words-with-digraphs"],
  encompasses: [
    { topic: "reading-words-with-vowel-teams", weight: 0.2 },
    { topic: "reading-sight-words", weight: 0.2 },
  ],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-picture-for-a-sentence",
      t("The Picture for a Sentence", "句子对应的图片"),
      t(
        "A sentence is a group of words that says something. Read it one word at a time, from left to right. Sound out each word you do not know at once, and read the sight words you have learned. Then read the whole sentence again, and think about what it says.\n\nThe pictures show words that look alike, such as *cat*, *hat* and *rat*, so read every letter of each word in the sentence before you choose.",
        "句子是一组说出一件事的词。从左到右一个词一个词地读。不能马上认出的词就拼读出来，学过的常见词直接读。然后把整个句子再读一遍，想想它说了什么。\n\n这些图片的词长得很像，比如 *cat*、*hat* 和 *rat*，所以要读清句子里每个词的每个字母再选。",
      ),
      sentenceToPicture,
    ),
    point(
      "choosing-the-sentence-for-a-picture",
      t("The Sentence for a Picture", "图片对应的句子"),
      t(
        "Now the picture comes first. Say what it shows, then read each sentence all the way through. The sentences differ in one word only, so find that word in each and check it against the picture.",
        "现在先给出图片。说出图上是什么，然后把每个句子从头读到尾。这些句子只差一个词，所以要在每个句子里找到这个词，和图片对一对。",
      ),
      pictureToSentence,
    ),
  ],
});

const writingSentences = phonicsTopic({
  id: "writing-decodable-sentences",
  title: t("Writing Short Sentences", "写短句"),
  summary: t(
    "Writing short sentences: the word for a picture in its gap, then the whole sentence with a capital letter and a full stop.",
    "写短句：先在空格里写出图片的词，再写出开头大写、结尾有句号的整个句子。",
  ),
  prerequisites: ["reading-decodable-sentences", "spelling-words-with-vowel-teams", "spelling-sight-words"],
  encompasses: [
    { topic: "reading-decodable-sentences", weight: 0.3 },
    { topic: "spelling-words-with-vowel-teams", weight: 0.2 },
  ],
  xp: 10,
  knowledgePoints: [
    point(
      "the-missing-word-of-a-sentence",
      t("The Missing Word", "缺少的词"),
      t(
        "Read the sentence and look at the picture: the gap is the picture's word. Say the word slowly, one sound at a time, and write a letter or a team of letters for each sound. Then read the whole sentence with your word in it.",
        "读句子，看图片：空格就是图片的词。慢慢地一个音一个音地说出这个词，为每个音写一个字母或一组字母。然后把你的词放进句子，读一遍整句。",
      ),
      missingWord,
    ),
    point(
      "a-capital-letter-and-a-full-stop",
      t("A Capital Letter and a Full Stop", "大写字母和句号"),
      t(
        "Every sentence starts with a capital letter and ends with a full stop: *a frog can hop on a log* becomes **A frog can hop on a log.** Names such as *Sam* always start with a capital letter, wherever they stand. Copy the words in the same order, with a space between each two.",
        "每个句子都以大写字母开头，以句号结尾：*a frog can hop on a log* 要写成 **A frog can hop on a log.** *Sam* 这样的名字不管在哪里，都以大写字母开头。按原来的顺序抄写这些词，每两个词之间空一格。",
      ),
      fullSentence,
    ),
  ],
});

/** sentenceTopics are the phonics topics of short decodable sentences. */
export const sentenceTopics: readonly TopicDef[] = [readingSentences, writingSentences];
