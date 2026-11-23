// The kit of the reading and speaking topics of the stages (docs/chinese-curriculum.md §18.9): passages or scenes written
// for the subject, each with questions whose wrong options carry the reason they are wrong. A solution finds the words
// of the text that answer the question, chooses by them and checks the answer against them; each other option is then
// said to be wrong, and why. The data is written compactly and parsed here, and the parser rejects what it cannot trust:
// a clue that is not in the text, an option given twice, a reason it does not know.

import { type Generator, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point, quote } from "@ga/subject-chinese";

import { recognitionByGrade } from "../characters/index.ts";
import type { GradeTopic } from "../grammar/index.ts";

/**
 * REASONS are why a wrong option is wrong, by tag: each says it of the option, in English and in Chinese. In them, {s}
 * stands for the sentence of the text that rules the option out, the one that answers the question, and {e} for the
 * sentence the text ends with, which shows how a story turns out.
 */
export const REASONS = {
  // Details of a text: each quotes the sentence that rules the option out.
  unsaid: ["the text never says this. What it says on this is: “{s}”", "原文没有说到这一点。说到这件事的是：“{s}”"],
  other: [
    "this is in the text, but it answers another question. This one is answered by: “{s}”",
    "原文里有这个内容，可它回答的是别的问题。回答这个问题的是：“{s}”",
  ],
  opposite: ["the text says the opposite: “{s}”", "原文说的正好相反：“{s}”"],
  part: ["this is only part of the answer. The text says all of it: “{s}”", "这只说到了一部分。原文说的是：“{s}”"],
  life: ["this may be so in life, but the text says: “{s}”", "生活中也许是这样，可原文说的是：“{s}”"],
  who: ["this names the wrong one. The text says: “{s}”", "说错了是谁（或是什么）。原文说的是：“{s}”"],
  sense: ["put into its sentence, it does not make sense: “{s}”", "放进这句话里，意思讲不通：“{s}”"],
  changed: ["this is not what was said. The words were: “{s}”", "和原来说的话不一样。原话是：“{s}”"],
  // Verse.
  rhyme: ["it ends in a different sound, so it does not rhyme.", "它末尾的音不同，读起来不押韵。"],
  mixed: ["some of these characters end in a different sound, so they do not all rhyme.", "这几个字里有的韵母不同，读起来不都押韵。"],
  notend: [
    "some of these characters do not end a line; a rhyme is heard at the ends of lines.",
    "这几个字有的不在句子末尾；押韵要看句末的字。",
  ],
  rhymes: ["this line does end in the rhyme.", "这一句末尾的字是押韵的。"],
  final: ["the characters that end the lines do not end in this sound.", "句末的字读起来末尾不是这个音。"],
  // What is imagined.
  real: ["this really happens; it is not imagined.", "这在生活中真的有，不是想象出来的。"],
  imagined: ["this is imagined; it does not happen in real life.", "这是想象出来的，生活中不会真的有。"],
  // The lesson or the main idea of a whole text.
  detail: [
    "this repeats something that happens in the text; it is not what the whole text shows or teaches.",
    "这只是重复了文中的一件事，不是全文说明的意思或讲的道理。",
  ],
  reversed: ["this is the opposite of what the ending shows: “{e}”", "这和结尾说明的正好相反。结尾是：“{e}”"],
  never: ["the text never mentions anything like this.", "文中根本没有说到这样的事。"],
  narrow: ["this takes in only one part of what the text tells, not the whole of it.", "这只说到了文中的一部分内容，没有概括全部。"],
  broad: ["this says more than the text does; it is too wide.", "说得太宽了，超出了文中说的内容。"],
  // Key words and sentences.
  literal: ["this is what the word often means, but not what it means here: “{s}”", "这是这个词平常的意思，可在这里讲不通：“{s}”"],
  example: [
    "this is one of the things the paragraph tells; the sentence that sums them all up is: “{s}”",
    "这只是这一段讲到的一个方面。概括全段的是：“{s}”",
  ],
  place: ["the sentence that sums it up is not there. It is: “{s}”", "概括全段的句子不在这里，而是：“{s}”"],
  onepart: ["this fits only one part of the text, not how it turns out: “{e}”", "这只符合文中的一部分，不符合最后的结果：“{e}”"],
  // Speaking.
  rude: ["this is not polite.", "这样说不礼貌。"],
  harsh: ["this is too sharp and would hurt the other person.", "语气太冲，别人听了会不高兴。"],
  off: ["this does not say what the moment needs.", "答非所问，没有说到这时该说的话。"],
  unclear: ["this is not clear: the listener cannot tell what is meant.", "说得不清楚，听的人不明白是什么意思。"],
  missing: ["this leaves out something the listener needs. The whole of it is: “{s}”", "漏了要紧的内容。完整的话是：“{s}”"],
  told: ["the telling does say this: “{s}”", "这一点已经讲了：“{s}”"],
  order: ["this tells things out of order.", "先后顺序乱了。"],
  address: ["this calls the person in a way that does not suit them.", "称呼不合适。"],
  cutin: ["this cuts in before the other person has finished.", "抢着说，没有等别人把话说完。"],
  queue: ["this pushes in instead of waiting one's turn.", "插队，没有按顺序等。"],
  blame: ["this puts the blame elsewhere instead of saying sorry.", "把错推给别的，没有向别人道歉。"],
  pushy: ["this only insists on one's own idea and does not talk it over.", "只坚持自己的想法，没有和别人商量。"],
  said: ["this was said already: “{s}”", "这一点对方已经说清楚了：“{s}”"],
  person: [
    "this keeps “I” and “you” as the speaker said them; relayed, they must be turned round. The words were: “{s}”",
    "没有把“我”“你”“他”按听的人换过来。原话是：“{s}”",
  ],
  noreason: ["this gives a view but not the reason for it.", "只说了自己的想法，没有说为什么。"],
  weak: ["the reason given has nothing to do with the matter.", "说的理由和商讨的事没有关系。"],
  dismiss: ["this brushes the other view aside without answering it.", "没有回应别人的意见，只是不听。"],
  nofeeling: ["this tells what was seen but not how one felt.", "只讲了见到的事，没有说出自己的感受。"],
  mismatch: ["this feeling does not follow from what happened: “{s}”", "这个感受和讲的事对不上：“{s}”"],
  flat: ["this is told without the detail that makes it come alive.", "讲得太简单，没有让人听了像看见一样的细节。"],
  noend: ["this stops before the story ends.", "故事还没讲完就停下了。"],
  retold: ["this changes what happens in the story.", "把故事里发生的事讲错了。"],
  aside: ["this detail has nothing to do with this moment of the story.", "这个细节和故事里这个时候的事没有关系。"],
  needless: ["this tells what this listener does not need, and leaves out what they do.", "说的不是这个听的人需要的，他要知道的反倒没说。"],
  noname: ["this does not say who is calling or whom one wants.", "没有说清自己是谁、要找谁。"],
  abrupt: ["this ends the talk without a goodbye or thanks.", "没有道谢或道别，就把话断了。"],
  unsuited: ["this does not suit being a guest in someone's home.", "做客时这样说、这样做不合适。"],
  unmoved: ["this reason does not matter to the one being persuaded.", "这个理由和被劝的人关心的事没有关系，打动不了他。"],
  plain: ["these words tell what is there or what happened; they do not show the feeling.", "这些话只写了景物或事情，没有表现出这种感情。"],
  elsewhere: ["that part is about something else. The answer is here: “{s}”", "那一段讲的是别的内容，答案在这里：“{s}”"],
  // Grades 5 and 6: methods of explaining, each said not to be used where it is not.
  nonumber: ["the sentence gives no figure to explain by: “{s}”", "句中没有用具体的数字来说明：“{s}”"],
  noexample: ["the sentence gives no instance of the thing: “{s}”", "句中没有举出具体的例子：“{s}”"],
  nolikening: ["the sentence likens the thing to nothing else: “{s}”", "句中没有把它比作别的东西：“{s}”"],
  nocompare: ["the sentence sets the thing beside nothing else: “{s}”", "句中没有拿它和别的东西比较：“{s}”"],
  nokinds: ["the sentence does not sort the thing into kinds: “{s}”", "句中没有把它分成几类来说：“{s}”"],
  nodefine: ["the sentence does not say what the thing is in general: “{s}”", "句中没有概括地说明它是什么：“{s}”"],
  // The colour of words.
  praise: [
    "this word speaks well of something, and here something is blamed: “{s}”",
    "这个词是褒义的，带着称赞，可这里说的是不好的事：“{s}”",
  ],
  pejorative: [
    "this word speaks ill of something, and here something is praised: “{s}”",
    "这个词是贬义的，带着批评，可这里是在称赞：“{s}”",
  ],
  neutral: ["this word only tells what is so and shows no view of it: “{s}”", "这个词不带褒贬，只是说明事情，看不出态度：“{s}”"],
  // The order of a text and its ways of writing.
  wrongorder: ["the text does not go in this order; see where it says: “{s}”", "文中不是按这种顺序写的，看这一句：“{s}”"],
  notdescribe: ["this sentence does not picture how something looks, sounds or moves: “{s}”", "这句话没有具体描写样子、声音或动作：“{s}”"],
  notlyric: ["this sentence does not pour out a feeling: “{s}”", "这句话没有直接抒发感情：“{s}”"],
  notargue: ["this sentence gives no view and reasons about nothing: “{s}”", "这句话没有发表看法、讲道理：“{s}”"],
  notnarrate: ["this sentence does not tell what happened: “{s}”", "这句话不是在交代事情的经过：“{s}”"],
  // Poems.
  nomood: ["this feeling does not fit the lines of the poem: “{s}”", "这种感情和诗句对不上：“{s}”"],
  pause: ["this pause breaks a word in two, and the sense with it.", "这样停顿把一个词拆开了，意思也断了。"],
  // Arguments, tables and gathering information.
  notview: ["this is an example the text gives, not the view it argues.", "这是文中举的事例，不是作者的观点。"],
  noproof: ["this example does not bear on the view: “{s}”", "这个事例证明不了这个观点：“{s}”"],
  figure: ["this misreads the figures. They say: “{s}”", "数字看错了。上面写的是：“{s}”"],
  irrelevant: ["this is true, but it does nothing for what is to be done.", "这条信息是真的，可是和要做的事没有关系。"],
  // Speaking in grades 5 and 6.
  offtopic: ["this strays from the topic being discussed.", "这句话离开了讨论的话题。"],
  tone: ["the tone does not suit the moment.", "语气不对，不像这时该有的口气。"],
  stress: ["the stress falls on a word the question does not ask about.", "重音放错了，强调的不是对方问的内容。"],
  trivial: ["this keeps a minor detail and drops the main point.", "抓住的是次要的细节，不是要点。"],
  rambling: ["this rambles, and the listener cannot find the point.", "说得又散又长，听的人抓不住要点。"],
  unfit: ["this does not suit the occasion or the listeners.", "不合这个场合，也不合听的人。"],
  closed: ["this question can only be answered yes or no, and draws out nothing.", "这个问题只能答“是”或“不是”，问不出具体的内容。"],
  misgrasp: ["this gets the other person's view wrong.", "把对方的意思理解错了。"],
  attack: ["this goes at the person, not at the view.", "针对的是人，不是观点。"],
  dull: ["this is said flatly, with nothing to hold the listeners.", "平平地说，没有用事例或问题吸引听众。"],
  noopening: ["this plunges into a detail before saying what the talk is about.", "一开口就讲细节，没有先说清要讲什么。"],
  // Grades 7 to 9: the thread, order and weight of a narrative.
  notthread: [
    "this comes up in the text, but it does not run through it and join its parts.",
    "文中写到了它，可它没有贯穿全文，没有把各部分串起来。",
  ],
  notflashback: [
    "the text does not open with a later moment and then go back to tell how it came about.",
    "文章没有先写后来的事，再回过头去写事情的经过。",
  ],
  notchrono: [
    "the text does not simply go from first to last; it turns back in time to tell something earlier.",
    "文章不是从头到尾按先后写下来的，中间有回过头去写的地方。",
  ],
  notinsert: [
    "the telling does not break off to recall something earlier and then take up its thread again.",
    "叙述中间没有停下来插进以前的事，再接着往下写。",
  ],
  role: ["this is not what this part does in the text.", "这不是这一部分在文中的作用。"],
  notdetailed: ["this part is passed over in a sentence or two, not told in detail.", "这部分只用一两句带过，不是详写。"],
  // Ways of describing a person or a place.
  noaction: ["the sentence pictures no movement of the person: “{s}”", "句中没有具体写人物的动作：“{s}”"],
  nospeech: ["the sentence gives no words the person says: “{s}”", "句中没有写人物说的话：“{s}”"],
  nothought: ["the sentence does not show what goes on in the person's mind: “{s}”", "句中没有写人物心里怎么想：“{s}”"],
  nolooks: ["the sentence does not picture the person's face, build or clothes: “{s}”", "句中没有写人物的外貌、神情或穿着：“{s}”"],
  nosetting: ["the sentence pictures no place, weather or scene around the people: “{s}”", "句中没有写人物周围的景物、天气或场面：“{s}”"],
  nosense: ["the sentence does not write from this sense: “{s}”", "句中没有从这个感官来写：“{s}”"],
  // Exposition and news.
  nocite: ["the sentence quotes no saying, record or source: “{s}”", "句中没有引用诗文、资料或别人的话：“{s}”"],
  noshape: ["the sentence does not picture the thing's look: “{s}”", "句中没有具体描摹事物的样子：“{s}”"],
  fact: ["this is a fact the report gives, not a view on it.", "这是报道的事实，不是对它的看法。"],
  view: ["this is a view on what happened, not a fact the report gives.", "这是对事情的看法，不是报道的事实。"],
  // Classical Chinese.
  modern: [
    "this is what the word means today, but not in this classical sentence: “{s}”",
    "这是这个词今天的意思，放在这句文言里讲不通：“{s}”",
  ],
  // Speaking in grades 7 to 9.
  surface: ["this takes the words only at their face and misses what is meant.", "只听懂了字面意思，没听出话里真正的意思。"],
  overread: ["this reads into the words what they do not mean.", "想得太多了，话里并没有这个意思。"],
  added: ["this adds what was never said.", "加进了原话里没有的内容。"],
  casual: ["this is too casual for the listener or the occasion.", "说得太随便，不合对方的身份或这个场合。"],
  stiff: ["this is too stiff and formal for the listener or the occasion.", "说得太生硬、太正式，不合对方或这个场合。"],
  unlinked: ["this does not start from the moment and the people at hand.", "没有从眼前的场合、眼前的人和事说起。"],
  // Grades 7 to 9: a reading the text does not bear out.
  misread: ["the text does not show this; read it again where it says: “{s}”", "文中表现的不是这个意思，再读读这一句：“{s}”"],
  // Grade 9: a debate.
  yield: ["this gives up your own side's stand instead of answering for it.", "放弃了己方的立场，没有为它作答。"],
  // Grade 11: a seminar and a research presentation.
  repeat: [
    "this only says again what was said before, and adds nothing to the discussion.",
    "只是把别人说过的话再说一遍，没有给讨论增加新的东西。",
  ],
  noturn: ["this leaves the others no turn to speak.", "没有给别的同学发言的机会。"],
  overclaim: ["this claims more than the evidence found.", "说得超出了依据所能证明的范围。"],
  jargon: ["this is full of terms these listeners do not know, and loses them.", "满是听众不熟悉的术语，听的人跟不上。"],
  wrongcase: ["this example is not a case of what is being explained.", "举的例子不是这里要说明的情况。"],
  nofinding: ["this ends without saying what was found.", "没有说出研究的发现就结束了。"],
  // The senior course: a likening, a side or a flaw taken wrongly, and words read only at their face.
  likening: [
    "this takes a likening of the text for what the writer argues; it is there only to picture the point.",
    "这是把文中打比方的话当成了作者的观点，那句话只是用来打比方的。",
  ],
  oneside: [
    "this is the view of one side the text sets out, not the writer's own: “{s}”",
    "这只是文中摆出的一方的看法，不是作者自己的态度：“{s}”",
  ],
  face: [
    "this takes the words at their face; here they mean more than they say: “{s}”",
    "这是只按字面去理解，没有读出这句话里比喻、象征或言外的意思：“{s}”",
  ],
  sound: [
    "this calls the reasoning sound, but it does not hold; see where it says: “{s}”",
    "认为这样推理没有问题，可它站不住，看这一句：“{s}”",
  ],
  notflaw: ["this names another error than the one the reasoning makes: “{s}”", "说错了推理的毛病，这里犯的不是这种错误：“{s}”"],
  offpoint: ["this misses the point and fastens on something beside it.", "没有说到要害，抓住的是不相干的枝节。"],
  nopersonify: ["the sentence does not write of the thing as if it were a person: “{s}”", "句中没有把它当作人来写：“{s}”"],
  otherschool: [
    "this is the teaching of another school, not of this text, which says: “{s}”",
    "这是别家学派的主张，不是本文的意思。本文说的是：“{s}”",
  ],
  otheruse: [
    "this is what the word means in another sentence of the text, not in this one: “{s}”",
    "这是这个字在文中另一句里的意思，放在这一句里讲不通：“{s}”",
  ],
  noexaggerate: ["the sentence does not make the thing larger or smaller than it is: “{s}”", "句中没有故意把事物说得更大或更小：“{s}”"],
} as const;

/** Context is what a reason may quote: the sentence that answers the question, and the sentence the text ends with. */
interface Context {
  readonly sentence: string;
  readonly ending: string;
}

/** sentencesOf splits a text into its sentences, each with its closing mark and any closing quotation mark. */
const sentencesOf = (text: string): readonly string[] =>
  (text.match(/[^。！？\n]+(?:[。！？]+[”’」]?)?/gu) ?? []).map((x) => x.trim()).filter((x) => x !== "");

/** NOTES opens the line of notes that follows a classical text or a poem, the notes separated by full stops. */
const NOTES = "注：";

/** textOf is a body without its line of notes: the text itself. */
const textOf = (body: string): string =>
  body
    .split("\n")
    .filter((line) => !line.startsWith(NOTES))
    .join("\n");

/** askedWord is the word whose meaning a question asks, as the question quotes it, or undefined for any other question. */
const askedWord = (ask: Text): string | undefined => /“([^“”]{1,4})”[^“”]{0,8}?(?:是什么意思|指什么|指的是什么)/u.exec(ask["zh-CN"])?.[1];

/** Asked is what a note is judged against: a question's ask, its answer and the places of the text it rests on. */
type Asked = Pick<Question, "ask" | "right" | "evidence">;

/**
 * givesAway tells a note that would answer a question for the learner: one that states its answer, or, when the
 * question asks what a word means, one that glosses that word or that the question cites.
 */
function givesAway(note: string, q: Asked): boolean {
  const word = askedWord(q.ask);
  const head = note.split("，")[0] ?? note;
  if (word !== undefined && (head.includes(word) || note.includes(`“${word}”`) || q.evidence.some((e) => note.includes(e)))) return true;
  return note.includes(q.right);
}

/** bodyFor is a body as shown with a question: every note that would give its answer away is left out, the rest kept. */
export function bodyFor(body: string, q: Asked): string {
  return body
    .split("\n")
    .flatMap((line) => {
      if (!line.startsWith(NOTES)) return [line];
      const kept = line
        .slice(NOTES.length)
        .split("。")
        .map((n) => n.trim())
        .filter((n) => n !== "" && !givesAway(n, q));
      return kept.length === 0 ? [] : [`${NOTES}${kept.join("。")}。`];
    })
    .join("\n");
}

/** lineOf is a sentence quoted without the comma that ends a line of verse in the middle of its sentence. */
const lineOf = (sentence: string): string => sentence.replace(/[，、；：]+$/u, "");

/** contextOf finds, in a piece, the sentence of its text that holds the clue, made whole as a quotation (or else its title, or the clue itself), and the last sentence of its text. */
function contextOf(piece: Piece, clue: string): Context {
  const body = sentencesOf(textOf(piece.body));
  const inBody = body.findIndex((x) => x.includes(clue));
  const sentence = inBody >= 0 ? wholeQuote(body, inBody, clue) : piece.title.includes(clue) ? piece.title : clue;
  return { sentence: lineOf(sentence), ending: lineOf(body.at(-1) ?? piece.body) };
}

/** depth is how many quotations, inner ones included, are open at the end of a text, less those it closes unopened. */
const depth = (text: string): number => text.split(/[“‘]/u).length - text.split(/[”’]/u).length;

/** unopened is the place just after the last closing quotation mark of a text that closes a quotation it never opened, or 0. */
function unopened(text: string): number {
  let open = 0;
  let after = 0;
  [...text].forEach((c, i) => {
    if (c === "“" || c === "‘") open++;
    else if (c === "”" || c === "’") {
      if (open > 0) open--;
      else after = i + 1;
    }
  });
  return after;
}

/**
 * wholeQuote is the sentence at the given place that holds the clue, made whole as a quotation: a sentence that begins
 * inside a speech is cut where the speech closes, keeping the side the clue lies on, and runs back to the speech's start
 * when the clue spans both; a sentence that ends inside a speech is cut where the speech opens, keeping the side the clue lies on, and
 * runs on to the speech's close when the clue spans both.
 */
function wholeQuote(sentences: readonly string[], at: number, clue: string): string {
  let text = sentences[at] ?? "";
  let start = at;
  const cut = unopened(text);
  if (cut > 0 && text.slice(cut).includes(clue)) text = text.slice(cut).trim();
  else if (cut > 0 && text.slice(0, cut - 1).includes(clue) && unopened(text.slice(0, cut - 1)) === 0) text = text.slice(0, cut - 1);
  else while (unopened(text) > 0 && start > 0) text = (sentences[--start] ?? "") + text;
  const open = unclosed(text);
  if (open > 0 && text.slice(open).includes(clue)) return text.slice(open).trim();
  if (open > 0 && text.slice(0, open - 1).includes(clue)) return text.slice(0, open - 1).trim();
  for (let i = at + 1; depth(text) > 0 && i < sentences.length; i++) text += sentences[i];
  return text;
}

/** unclosed is the place just after the innermost opening quotation mark of a text that it leaves open, or 0. */
function unclosed(text: string): number {
  const opens: number[] = [];
  [...text].forEach((c, i) => {
    if (c === "“" || c === "‘") opens.push(i + 1);
    else if ((c === "”" || c === "’") && opens.length > 0) opens.pop();
  });
  return opens.at(-1) ?? 0;
}

/** KNOWN is the share of a topic's characters that must have been taught before it. */
const KNOWN = 0.97;

/** isHan tells a Chinese character. */
export const isHan = (c: string): boolean => /\p{Script=Han}/u.test(c);

/**
 * quoted quotes a text as the last thing a sentence says: a whole sentence keeps its own closing mark inside the
 * quotation marks, and a part of one is followed by a full stop after them. A closing quotation mark left over from a
 * speech the sentence ends is dropped.
 */
export function quoted(text: string, locale: "en" | "zh-CN"): string {
  const count = (mark: string): number => text.split(mark).length - 1;
  const whole = count("”") > count("“") && text.endsWith("”") ? text.slice(0, -1) : text;
  const inner = whole.replaceAll("“", "‘").replaceAll("”", "’");
  return /[。！？.!?…][”’」]?$/u.test(whole) ? `“${inner}”` : `“${inner}”${locale === "en" ? "." : "。"}`;
}

/** readableAfter is the first recognition batch of the grade or earlier after which KNOWN of the characters of the texts are taught. */
export function readableAfter(texts: readonly string[], grade: number): string {
  const han = [...texts.join("")].filter(isHan);
  const batches = recognitionByGrade.filter((g) => g.grade <= grade).flatMap((g) => g.batches);
  const known = new Set<string>();
  for (const batch of batches) {
    for (const e of batch.entries) known.add(e.char);
    if (han.filter((c) => known.has(c)).length >= KNOWN * han.length) return batch.topic.id;
  }
  const last = batches.at(-1);
  if (!last) throw new Error(`reading: no recognition batches up to grade ${grade}`);
  return last.topic.id;
}

/** BATCH_ORDER is the place of each recognition batch in the order they are taught. */
const BATCH_ORDER = new Map(recognitionByGrade.flatMap((g) => g.batches).map((b, i) => [b.topic.id, i]));

/** latestBatch is the place of the latest recognition batch a topic needs, directly or through the given topics it follows. */
function latestBatch(id: string, known: ReadonlyMap<string, TopicDef>): number {
  const own = BATCH_ORDER.get(id);
  if (own !== undefined) return own;
  const topic = known.get(id);
  return topic ? Math.max(-1, ...topic.prerequisites.map((p) => latestBatch(p, known))) : -1;
}

/**
 * prerequisitesOf joins the batch by which a topic's texts can be read to the topics it follows, leaving the batch out
 * when one of those, as given in known, already needs it or a later one.
 */
export function prerequisitesOf(batch: string, after: readonly string[], known: readonly TopicDef[]): readonly string[] {
  const byId = new Map(known.map((k) => [k.id, k]));
  const implied = Math.max(-1, ...after.map((a) => latestBatch(a, byId)));
  return (BATCH_ORDER.get(batch) ?? -1) > implied ? [batch, ...after] : after;
}

/** Reason is the tag of why a wrong option is wrong. */
export type Reason = keyof typeof REASONS;

/** Question is one question on a text: what it asks, the right option, the wrong ones with their reasons, and its clue. */
export interface Question {
  readonly ask: Text;
  readonly right: string;
  /** wrong are the wrong options with their reasons, and the words of the text that refute an option where they are not the clue. */
  readonly wrong: readonly (readonly [option: string, reason: Reason, refuted?: string])[];
  /** clue is the words of the text that answer the question, as they stand in it, or the first words an inference starts from. */
  readonly clue: string;
  /** inferred tells a question whose answer the text does not state but lets the reader infer, as against one it states. */
  readonly inferred: boolean;
  /** evidence are the words of the text the answer rests on, the clue first. */
  readonly evidence: readonly string[];
  /** reasoning, when given, says how the evidence leads to the answer, in place of the default wording of the second step. */
  readonly reasoning?: Text;
}

/** Piece is a text with its questions for each knowledge point of its topic: a passage, a sign, a verse or a scene. */
export interface Piece {
  readonly title: string;
  readonly body: string;
  /** questions are the questions of each knowledge point, by its index. */
  readonly questions: readonly (readonly Question[])[];
}

/**
 * parsePieces reads texts separated by lines `#` with a title. The lines after a title are the text until the first
 * question. A question is `?k ask in Chinese | ask in English`, k its knowledge point counted from 1, then
 * `= right | clue` and `- wrong ~reason` once for each wrong option, or `- wrong ~reason @words`, where the reason
 * quotes the sentence of those words of the text instead of the sentence of the clue. A question whose answer is inferred, not stated,
 * has `≈ right | clue | more evidence…` instead, with the places of the text it rests on, and
 * `% reasoning in Chinese | reasoning in English`, how they lead to the answer, which it may leave out when it rests on
 * two places or more.
 */
export function parsePieces(data: string, points: number): readonly Piece[] {
  const given: string[] = [];
  const pieces = data
    .trim()
    .split(/^# /mu)
    .filter((block) => block.trim() !== "")
    .map((block) => {
      const [title = "", ...rows] = block.split("\n").map((l) => l.trim());
      const firstQuestion = rows.findIndex((r) => r.startsWith("?"));
      if (firstQuestion < 1) throw new Error(`piece ${title}: no text or no question`);
      const body = rows
        .slice(0, firstQuestion)
        .filter((r) => r !== "")
        .join("\n");
      const questions: Question[][] = Array.from({ length: points }, () => []);
      let current:
        | {
            k: number;
            ask: Text;
            right?: string;
            evidence?: string[];
            inferred?: boolean;
            reasoning?: Text;
            wrong: [string, Reason, string?][];
          }
        | undefined;
      const close = () => {
        if (!current) return;
        const { k, ask, right, evidence = [], inferred = false, reasoning, wrong } = current;
        const clue = evidence[0];
        if (right === undefined || clue === undefined) throw new Error(`piece ${title}: ${ask["zh-CN"]} has no answer`);
        if (wrong.length < 2) throw new Error(`piece ${title}: ${ask["zh-CN"]} needs two wrong options`);
        if (new Set([right, ...wrong.map((w) => w[0])]).size !== wrong.length + 1)
          throw new Error(`piece ${title}: ${ask["zh-CN"]} repeats an option`);
        for (const e of [...evidence, ...wrong.flatMap((w) => (w[2] === undefined ? [] : [w[2]]))])
          if (e === "" || !`${title}\n${body}`.includes(e)) throw new Error(`piece ${title}: the clue ${e} is not in the text`);
        const shown = `${title}\n${bodyFor(body, { ask, right, evidence })}`;
        for (const e of evidence)
          if (!shown.includes(e)) given.push(`piece ${title}: ${ask["zh-CN"]} rests on ${e}, a note that gives the answer away`);
        if (!inferred && askedWord(ask) !== undefined && body.includes(NOTES))
          given.push(`piece ${title}: ${ask["zh-CN"]} asks a word its notes leave out, so its meaning is inferred`);
        if (inferred && new Set(evidence).size < 2 && !reasoning)
          throw new Error(`piece ${title}: ${ask["zh-CN"]} infers from one place but says not how`);
        if (reasoning && !inferred) throw new Error(`piece ${title}: ${ask["zh-CN"]} has reasoning but is not inferred`);
        questions[k]!.push({ ask, right, wrong, clue, inferred, evidence, ...(reasoning ? { reasoning } : {}) });
        current = undefined;
      };
      for (const row of rows.slice(firstQuestion).filter((r) => r !== "")) {
        if (row.startsWith("?")) {
          close();
          const k = Number(row[1]) - 1;
          const [zh = "", en = ""] = row
            .slice(2)
            .split(" | ")
            .map((s) => s.trim());
          if (!(k >= 0 && k < points) || zh === "" || en === "") throw new Error(`piece ${title}: question ${row}`);
          current = { k, ask: t(en, zh), wrong: [] };
        } else if ((row.startsWith("=") || row.startsWith("≈")) && current) {
          const [right = "", ...evidence] = row
            .slice(1)
            .split(" | ")
            .map((s) => s.trim());
          current.right = right;
          current.evidence = evidence;
          current.inferred = row.startsWith("≈");
        } else if (row.startsWith("%") && current) {
          const [zh = "", en = ""] = row
            .slice(1)
            .split(" | ")
            .map((s) => s.trim());
          if (zh === "" || en === "") throw new Error(`piece ${title}: reasoning ${row}`);
          current.reasoning = t(en, zh);
        } else if (row.startsWith("-") && current) {
          const m = /^-\s*(.+?)\s*~(\w+)(?:\s+@\s*(.+))?$/u.exec(row);
          if (!m || !(m[2]! in REASONS)) throw new Error(`piece ${title}: wrong option ${row}`);
          current.wrong.push(m[3] === undefined ? [m[1]!, m[2] as Reason] : [m[1]!, m[2] as Reason, m[3].trim()]);
        } else throw new Error(`piece ${title}: cannot read ${row}`);
      }
      close();
      return { title, body, questions };
    });
  if (given.length > 0) throw new Error(given.join("\n"));
  return pieces;
}

/** Kind words the steps of a solution by what the text is: a passage read, a sign, a verse or something heard. */
export interface Kind {
  /** text names the text in a sentence, in English and in Chinese: "the passage", "短文". */
  readonly text: readonly [en: string, zh: string];
}

/** PASSAGE is a passage read: a story, a fable, a fairy tale, a text on nature. */
export const PASSAGE: Kind = { text: ["the passage", "短文"] };
/** SIGN is the words around us: signs, labels, timetables and calendars. */
export const SIGN: Kind = { text: ["the text", "上面的文字"] };
/** VERSE is a nursery rhyme or a children's verse. */
export const VERSE: Kind = { text: ["the verse", "儿歌"] };
/** POEM is a poem of the later grades, modern or classical. */
export const POEM: Kind = { text: ["the poem", "诗"] };
/** WORK is a work of several forms read together: poems, letters and stories in one topic. */
export const WORK: Kind = { text: ["the text", "作品"] };
/** TALK is what someone says, which the learner reads until it is recorded. */
export const TALK: Kind = { text: ["what is said", "说的话"] };

/** shownOf is a text as a problem shows it with a question: its title on a line of its own, then the text and the notes that do not give the answer away. */
const shownOf = (p: Piece, q: Question): string => {
  const body = bodyFor(p.body, q);
  return p.title === "" ? body : `${p.title}\n\n${body}`;
};

/** asked are the questions of one knowledge point across pieces, each with its piece, in turn. */
function asked(pieces: readonly Piece[], k: number): readonly (readonly [Piece, Question])[] {
  const out = pieces.flatMap((p) => (p.questions[k] ?? []).map((q) => [p, q] as const));
  if (out.length === 0) throw new Error(`no questions for knowledge point ${k + 1}`);
  return out;
}

/** nested turns the quotation marks of a text into inner ones, for it to be quoted in turn. */
const nested = (text: string): string => text.replaceAll("“", "‘").replaceAll("”", "’");

/** reasonOf says why a wrong option is wrong, quoting the text where the reason does. */
const reasonOf = (option: string, reason: Reason, context: Context): Text => {
  const [en, zh] = REASONS[reason];
  const fill = (text: string, locale: "en" | "zh-CN") =>
    text.replace("“{s}”", quoted(context.sentence, locale)).replace("“{e}”", quoted(context.ending, locale));
  return t(`${option}: ${fill(en, "en")}`, `“${nested(option)}”：${fill(zh, "zh-CN")}`);
};

/** Steps are the three steps of a solution on a text, each in English and in Chinese, with the headings of the first two. */
export interface Steps {
  readonly heads?: { readonly find: Text; readonly choose: Text };
  readonly find: Text;
  readonly choose: Text;
  readonly check: Text;
}

/** Wording words the steps of a question on a text; it overrides the default steps of pieceGenerator. */
export type Wording = (q: Question, piece: Piece) => Steps;

/** HEADINGS are the bold headings of the three steps, as a solution writes them. */
const HEADINGS = {
  find: t("**Step 1: find the words that answer it.**", "**第一步：找到回答问题的话。**"),
  choose: t("**Step 2: choose by those words.**", "**第二步：照着这句话选。**"),
} as const;

/** byClue is the default wording: find the clue, choose the option that says what it says, and read both again. */
const byClue =
  (kind: Kind): Wording =>
  (q) => {
    const [textEn, textZh] = kind.text;
    const one = q.evidence.length === 1;
    return {
      find: t(
        `The question asks: ${q.ask.en} In ${textEn}, look for the words about this: ${evidenceOf(q, "en")}`,
        `题目问的是：${q.ask["zh-CN"]}在${textZh}里找写这件事的话：${evidenceOf(q, "zh-CN")}`,
      ),
      choose: t(
        `Of the options, only “${q.right}” says what ${one ? "these words say" : "these places say together"}.`,
        `几个选项里，只有“${q.right}”和${one ? "这句话" : "这几处合起来"}说的一致。`,
      ),
      check: t(
        `Read the question again with the answer, “${q.right}”, and then the words of ${textEn}: ${evidenceOf(q, "en")} They agree.`,
        `带着答案“${q.right}”再读一遍问题，然后对照${textZh}里的${marksOf(q, "zh-CN")}，${one ? "两者" : "答案和这几处"}说的是一回事。`,
      ),
    };
  };

/** marksOf quotes the places of the text an answer rests on, joined into a phrase without a closing mark. */
export function marksOf(q: Question, locale: "en" | "zh-CN"): string {
  const marks = q.evidence.map((e) => `“${e.replaceAll("“", "‘").replaceAll("”", "’")}”`);
  const last = marks.pop() ?? "";
  if (marks.length === 0) return last;
  return locale === "en" ? `${marks.join(", ")} and ${last}` : `${marks.join("，")}，还有${last}`;
}

/** evidenceOf quotes the places of the text an answer rests on as the last thing a sentence says. */
export const evidenceOf = (q: Question, locale: "en" | "zh-CN"): string =>
  q.evidence.length === 1 ? quoted(q.clue, locale) : `${marksOf(q, locale)}${locale === "en" ? "." : "。"}`;

/** endingOf is the last sentence of a piece's text. */
export const endingOf = (piece: Piece): string => sentencesOf(textOf(piece.body)).at(-1) ?? piece.body;

/** INFERENCE_HEADINGS are the bold headings of the first two steps of a question whose answer is inferred. */
const INFERENCE_HEADINGS = {
  find: t("**Step 1: find the words the answer can be inferred from.**", "**第一步：找到能推出答案的话。**"),
  choose: t("**Step 2: reason from those words.**", "**第二步：从这些话推出答案。**"),
} as const;

/**
 * byInference words a question whose answer the text does not state: find the places it rests on, reason from them
 * together, and check the answer against the whole text and its ending, not against words it does not have.
 */
const byInference =
  (kind: Kind): Wording =>
  (q, piece) => {
    const [textEn, textZh] = kind.text;
    const ending = endingOf(piece);
    const felt = kind !== SIGN && kind !== TALK;
    return {
      heads: INFERENCE_HEADINGS,
      find: t(
        `The question asks: ${q.ask.en} The answer is not said in so many words in ${textEn}; it has to be inferred. Look for the words it rests on: ${evidenceOf(q, "en")}`,
        `题目问的是：${q.ask["zh-CN"]}${textZh}没有直接写出答案，要从上下文推出来。先找到相关的话：${evidenceOf(q, "zh-CN")}`,
      ),
      choose:
        q.reasoning ??
        t(
          `Read these places side by side and ask what they show together: they point to “${q.right}”. None of the other options squares with all of them.`,
          `把这几处放在一起想：它们合起来透露出的，是“${q.right}”。其他选项和这几处话对不上。`,
        ),
      check: t(
        `The answer was inferred: no sentence of ${textEn} answers the question in so many words, so the check is not to look for them. Read the whole of it again with “${q.right}” in mind, through to the end, which is ${quoted(ending, "en")} Nothing in it goes against the answer, and the answer fits what the whole ${felt ? "says and feels" : "says"}, so the inference holds.`,
        `这个答案是推出来的，${textZh}里没有哪一句直接这样回答问题，所以不能靠找原话来检验。换个办法：心里想着答案“${q.right}”，把${textZh}从头读到结尾，结尾是${quoted(ending, "zh-CN")}通读下来，没有一处和答案相反，答案也和全文的${felt ? "意思、感情" : "意思"}相合，这个推断站得住。`,
      ),
    };
  };

/**
 * pieceGenerator asks the questions of a knowledge point in turn, with the text and the options shuffled. The solution
 * finds the clue, chooses by it and checks the choice against the question, or, for an inferred answer, reasons from
 * its evidence and checks it against the whole text; or it follows the wording given; then each
 * other option is answered.
 */
export function pieceGenerator(
  pieces: readonly Piece[],
  k: number,
  kind: Kind,
  wording: Wording = (q, piece) => (q.inferred ? byInference(kind) : byClue(kind))(q, piece),
): Generator {
  const bank = asked(pieces, k);
  return (rng: Rng): Problem => {
    const [piece, q] = rng.cycle(bank);
    const options = rng.shuffle([q.right, ...q.wrong.map((w) => w[0])]);
    const answer = options.indexOf(q.right);
    const context = contextOf(piece, q.clue);
    const reasonFor = ([o, r, refuted]: readonly [string, Reason, string?]) =>
      reasonOf(o, r, refuted === undefined ? context : contextOf(piece, refuted));
    const reasons = options.filter((o) => o !== q.right).map((o) => reasonFor(q.wrong.find((w) => w[0] === o)!));
    const list = (locale: "en" | "zh-CN") => reasons.map((r) => `- ${r[locale]}`).join("\n");
    const steps = wording({ ...q, right: nested(q.right) }, piece);
    const heads = steps.heads ?? HEADINGS;
    const solution = t(
      `${heads.find.en} ${steps.find.en}\n\n${heads.choose.en} ${steps.choose.en}\n\n**Check.** ${steps.check.en}\n\nThe other options:\n\n${list("en")}`,
      `${heads.find["zh-CN"]}${steps.find["zh-CN"]}\n\n${heads.choose["zh-CN"]}${steps.choose["zh-CN"]}\n\n**检验。** ${steps.check["zh-CN"]}\n\n其他选项：\n\n${list("zh-CN")}`,
    );
    return {
      prompt: joinText([q.ask, same(quote(shownOf(piece, q)))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map((o) => same(o)) } },
      solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: q.wrong.map((w) => ({ response: String(options.indexOf(w[0])), feedback: reasonFor(w) })),
    };
  };
}

/**
 * RuleItem is a situation of speaking: the scene, the reply that suits it and the replies that do not, with why, and
 * the check of this scene, when it has its own: the clues of the scene that make only the right reply fit.
 */
export interface RuleItem {
  readonly scene: string;
  readonly right: string;
  readonly wrong: readonly (readonly [option: string, reason: Reason])[];
  readonly check?: Text;
}

/**
 * parseRules reads situations separated by blank lines: the scene on its first line or lines, then `= right`,
 * `- wrong ~reason` once for each wrong option, and optionally `% check | English`, the check of this scene, which
 * takes the place of the check of the rule.
 */
export function parseRules(data: string): readonly RuleItem[] {
  return data
    .trim()
    .split(/\n\s*\n/u)
    .map((block) => {
      const rows = block
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "");
      const at = rows.findIndex((r) => r.startsWith("="));
      if (at < 1) throw new Error(`situation: ${rows[0]}`);
      const scene = rows.slice(0, at).join("\n");
      const right = rows[at]!.slice(1).trim();
      const checks = rows.slice(at + 1).filter((r) => r.startsWith("%"));
      if (checks.length > 1) throw new Error(`situation ${rows[0]}: more than one check`);
      const wrong = rows
        .slice(at + 1)
        .filter((r) => !r.startsWith("%"))
        .map((row): [string, Reason] => {
          const m = /^-\s*(.+?)\s*~(\w+)$/u.exec(row);
          if (!m || !(m[2]! in REASONS)) throw new Error(`situation ${scene}: wrong option ${row}`);
          return [m[1]!, m[2] as Reason];
        });
      if (wrong.length < 2) throw new Error(`situation ${scene}: needs two wrong options`);
      if (new Set([right, ...wrong.map((w) => w[0])]).size !== wrong.length + 1) throw new Error(`situation ${scene}: repeats an option`);
      if (checks[0] === undefined) return { scene, right, wrong };
      const [zh, en] = checks[0]
        .slice(1)
        .split(" | ")
        .map((x) => x.trim());
      if (!zh || !en) throw new Error(`situation ${scene}: a check needs Chinese and English`);
      return { scene, right, wrong, check: t(en, zh) };
    });
}

/** RULE_HEADINGS are the default headings of the steps of a speaking solution: what the moment needs, and the reply. */
const RULE_HEADINGS = {
  find: t("Step 1: think what the moment needs.", "第一步：想一想这时该怎么说。"),
  choose: t("Step 2: choose the reply that does it.", "第二步：选出这样说的一句。"),
};

/** Rule is what a knowledge point of speaking judges a reply by, said as a step of the solution, and its check. */
export interface Rule {
  /** heads are the headings of the two steps, where the default ones, for choosing a reply, do not fit. */
  readonly heads?: { readonly find: Text; readonly choose: Text };
  readonly step: Text;
  readonly check: Text;
}

/**
 * ruleGenerator asks the situations of a knowledge point in turn: which reply suits the scene. The solution states the
 * rule, finds the reply that keeps it and checks it as if said aloud; then each other reply is answered.
 */
export function ruleGenerator(question: Text, items: readonly RuleItem[], rule: Rule): Generator {
  const heads = rule.heads ?? RULE_HEADINGS;
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    const options = rng.shuffle([item.right, ...item.wrong.map((w) => w[0])]);
    const answer = options.indexOf(item.right);
    const context = { sentence: item.scene, ending: item.scene };
    const reasons = options.filter((o) => o !== item.right).map((o) => reasonOf(o, item.wrong.find((w) => w[0] === o)![1], context));
    const list = (locale: "en" | "zh-CN") => reasons.map((r) => `- ${r[locale]}`).join("\n");
    const check = item.check ?? rule.check;
    const solution = t(
      `**${heads.find.en}** ${rule.step.en}\n\n**${heads.choose.en}** “${item.right}”\n\n**Check.** ${check.en}\n\nThe other options:\n\n${list("en")}`,
      `**${heads.find["zh-CN"]}**${rule.step["zh-CN"]}\n\n**${heads.choose["zh-CN"]}**“${nested(item.right)}”\n\n**检验。** ${check["zh-CN"]}\n\n其他选项：\n\n${list("zh-CN")}`,
    );
    return {
      prompt: joinText([question, same(quote(item.scene))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map((o) => same(o)) } },
      solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: item.wrong.map(([o, r]) => ({ response: String(options.indexOf(o)), feedback: reasonOf(o, r, context) })),
    };
  };
}

/** ReadingSpec is a reading topic of the stages: its texts, two knowledge points and how each is worded. */
export interface ReadingSpec {
  readonly grade: number;
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly intro: Text;
  readonly data: string;
  readonly kind: Kind;
  readonly after?: string;
  readonly points: readonly (readonly [suffix: string, title: Text, explanation: Text, wording?: Wording])[];
}

/**
 * readingTopicOf builds a reading topic from its spec, after the batch by which its texts can be read, unless a topic it
 * follows, as given in known, already comes after that batch.
 */
export function readingTopicOf(spec: ReadingSpec, known: readonly TopicDef[] = []): GradeTopic {
  const pieces = parsePieces(spec.data, spec.points.length);
  if (pieces.length < 10) throw new Error(`${spec.id}: ${pieces.length} texts, at least 10 needed`);
  for (let k = 0; k < spec.points.length; k++) {
    const n = pieces.flatMap((p) => p.questions[k] ?? []).length;
    if (n < 30) throw new Error(`${spec.id}: knowledge point ${k + 1} has ${n} questions, at least 30 needed`);
  }
  const topic: TopicDef = {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    intro: spec.intro,
    prerequisites: prerequisitesOf(
      readableAfter(
        pieces.map((p) => p.title + p.body),
        spec.grade,
      ),
      spec.after ? [spec.after] : [],
      known,
    ),
    encompasses: [],
    xp: 15,
    strand: "reading",
    knowledgePoints: spec.points.map(([suffix, title, explanation, wording], k) =>
      point(`${spec.id}-${suffix}`, title, explanation, pieceGenerator(pieces, k, spec.kind, wording)),
    ),
  };
  return { grade: spec.grade, topic };
}
