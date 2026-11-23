// Phonics: short decodable sentences, made only of the patterns and sight words the course has taught, each about a
// picture. Reading them, from a sentence to its picture and from a picture to its sentence, then writing them: the
// picture's word in the gap, then the sentence with its capital letter and full stop.

import { type Figure, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { spoken, withSounds } from "../../audio.ts";
import { letters, phonicsTopic, pictureNoun } from "./kit.ts";
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

/** decodableSentences are the course's short sentences, each about a picture word. */
export const decodableSentences: readonly { readonly word: string; readonly text: string }[] = sentences;

/** swapped is a sentence with its picture word replaced by another. */
const swapped = (s: Sentence, other: string) =>
  wordsOf(s.text)
    .map((w) => (w === s.word ? other : w))
    .join(" ") + ".";

/** gapped is a sentence with its picture word replaced by a gap. */
const gapped = (s: Sentence) => swapped(s, "___");

const why = (s: Sentence): Text =>
  t(
    `${picture(s.word).alt.en} Read the sentence: "${s.text}" Its key word is **${s.word}** (*${letters(s.word)}*).\n\n**Check.** Picture "${s.text}" as a whole: it matches **${s.word}**, not *${s.others[0]}* or *${s.others[1]}*.`,
    `${picture(s.word).alt["zh-CN"]}读这句话："${s.text}" 里面的关键词是 **${s.word}**（*${letters(s.word)}*）。\n\n**检验。** 想想 "${s.text}" 讲的整幅画面：它说的是 **${s.word}**，不是 *${s.others[0]}* 或 *${s.others[1]}*。`,
  );

const notPicture = (other: string): Text =>
  t(
    `That picture shows ${pictureNoun(other)} (*${letters(other)}*), not the word in the sentence.`,
    `那张图是 ${other}（*${letters(other)}*），和句子里说的词对不上。`,
  );

const notSentence = (other: string): Text =>
  t(
    `That sentence is about ${pictureNoun(other)} (*${letters(other)}*), not what the picture shows.`,
    `那个句子说的是 ${other}（*${letters(other)}*），和图片画的东西对不上。`,
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
    mistakes: s.others.map((o) => ({ response: String(options.indexOf(o)), feedback: notPicture(o) })),
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
    mistakes: s.others.map((o, i) => ({ response: String(options.indexOf(wrong[i] ?? "")), feedback: notSentence(o) })),
  };
};

/** missingWord shows a picture and its sentence with a gap, and asks to type the picture's word. */
const missingWord = (rng: Rng): Problem => {
  const s = rng.cycle(sentences);
  return {
    prompt: joinText([t("Type the word for the picture that fills the gap.", "键入填空的图片的词。"), same(`**${gapped(s)}**`)]),
    figure: picture(s.word),
    answer: { checker: "word-form", expected: [s.word], input: { kind: "text" } },
    solution: t(
      `${picture(s.word).alt.en} Say the picture's word sound by sound: *${letters(s.word)}* → **${s.word}**.\n\n**Check.** Put **${s.word}** into the blank and read the sentence aloud: "${s.text}" It makes sense and matches the picture.`,
      `${picture(s.word).alt["zh-CN"]}逐音拼出图片的词：*${letters(s.word)}* → **${s.word}**。\n\n**检验。** 把 **${s.word}** 填进横线再把句子读一遍："${s.text}" 句子通顺，也对上图片。`,
    ),
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
  const firstLetter = s.text[0] ?? "";
  const count = wordsOf(s.text).length;
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
      `Make the first letter a capital (**${firstLetter}**) and put a full stop (**.**) at the end: "${s.text}"\n\n**Check.** Check three things on "${s.text}": it starts with capital **${firstLetter}**, it ends with **.**, and all ${count} words are in the same order with spaces between them.`,
      `把第一个字母改成大写（**${firstLetter}**），在末尾加上句号（**.**）："${s.text}"\n\n**检验。** 对照 "${s.text}" 检查三件事：开头是大写 **${firstLetter}**，结尾有句号 **.**，全部 ${count} 个词顺序正确、词间都有空格。`,
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
  intro: t(
    "Leo opens his first little book and reads a whole line: *The **pig** is in the mud.* Every word is one he can sound out or a sight word he already knows!\n\nA sentence puts words together to tell a little picture. Let's read short sentences and match each one to its picture.",
    "利奥翻开第一本小书，读出了一整句话：*The **pig** is in the mud.* 里面的每个词，不是能拼读出来的，就是学过的常见词！\n\n句子把词连在一起，讲出一幅小画面。我们来读短句，把句子和图片配成对。",
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
        "Read the sentence one word at a time from left to right. Take *A **cat** can sit on a mat.*: sound out *cat*, *can*, *sit*, and *mat*, then read the whole sentence again and pick the cat picture.\n\nPicture the whole sentence in your mind before you tap.\n\n> **Watch out.** The other pictures have look-alike words, such as *cat*, *hat*, and *rat*, so read every letter of the key word.",
        "从左到右一个词一个词地读句子。拿 *A **cat** can sit on a mat.* 来说，先拼读 *cat*、*can*、*sit*、*mat*，再把整句读一遍，点小猫的图片。\n\n点图之前先在脑海里想一想整句话的画面。\n\n> **注意。** 其他图片的词和关键词长得很像（比如 *cat*、*hat*、*rat*），关键词的每个字母都要读清。",
      ),
      sentenceToPicture,
    ),
    point(
      "choosing-the-sentence-for-a-picture",
      t("The Sentence for a Picture", "图片对应的句子"),
      t(
        "Now you see the picture first. For a picture of a **boat**, read each sentence all the way through and spot the one word that changes: *boat*, *goat*, or *coat*. Pick *The **boat** is on the lake.*\n\nCheck that one key word against the picture.\n\n> **Watch out.** The sentences look almost identical, so do not pick after reading only the first two words.",
        "现在先看到图片。看到小船 **boat** 时，把每个句子从头读到尾，找出唯一不同的那个词：*boat*、*goat* 还是 *coat*，选 *The **boat** is on the lake.*\n\n把这个关键词和图片仔细对一对。\n\n> **注意。** 几个句子几乎一模一样，不要只读开头两三个词就急着选。",
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
  intro: t(
    "Mia draws a **cake** and writes a line under it: *Mom made a cake.* She begins with a big **M** and finishes with a dot at the end.\n\nFirst we will type the picture's word to finish a sentence, and then we will write a whole sentence with its capital letter and full stop.",
    "米娅画了一个蛋糕 **cake**，在下面写了一句话：*Mom made a cake.* 她开头写了大写的 **M**，末尾点了一个句号。\n\n我们先填出空格里图片的词，再来写出开头大写、结尾带句号的整句话。",
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
        "Look at the picture and read the sentence around the blank. For a **duck** in *The ___ can swim in the pond.*, say *d-u-ck* and type **duck**.\n\nRead the sentence again with your word inside it.\n\n> **Watch out.** Check the spelling pattern of the word—such as **ck**, a blend, or a silent **e**—before you submit.",
        "看图片，再读空格前后的句子。看到小鸭子 **duck** 和 *The ___ can swim in the pond.* 时，念 *d-u-ck*，键入 **duck**。\n\n把写好的词放进句子里再读一遍。\n\n> **注意。** 提交前检查一下词里的拼写规则，比如 **ck**、辅音连缀或不发音的 **e**。",
      ),
      missingWord,
    ),
    point(
      "a-capital-letter-and-a-full-stop",
      t("A Capital Letter and a Full Stop", "大写字母和句号"),
      t(
        "Every sentence begins with a capital letter and ends with a full stop. Turn *a frog can hop on a log* into **A frog can hop on a log.**\n\nCopy every word in the same order with one space between words, and keep names like *Sam* capitalized.\n\n> **Watch out.** Do not forget the capital letter at the start or the full stop at the end.",
        "每个句子都要大写开头、句号结尾。把 *a frog can hop on a log* 写成 **A frog can hop on a log.**\n\n按原来的顺序抄写每个词，词与词之间空一格，像 *Sam* 这样的名字也要保持大写。\n\n> **注意。** 不要漏掉句首的大写字母或句尾的句号。",
      ),
      fullSentence,
    ),
  ],
});

/** sentenceTopics are the phonics topics of short decodable sentences. */
export const sentenceTopics: readonly TopicDef[] = [readingSentences, writingSentences];
