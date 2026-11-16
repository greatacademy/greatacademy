// The sentences of E4.5's test of speech-to-text: 200 sentences with the errors learners make, each with its correct
// form. A route that hears "She go to school" as "She goes to school" corrects the learner silently, and the checker
// would pass what was wrong; a route passes only when it keeps the errors.

/** ErrorSentence is a sentence said with an error, and the sentence it should have been. */
export interface ErrorSentence {
  readonly id: string;
  readonly said: string;
  readonly correct: string;
}

const third: readonly [string, string][] = [
  ["go to school every day", "goes to school every day"],
  ["like green apples", "likes green apples"],
  ["play football after school", "plays football after school"],
  ["want a new bike", "wants a new bike"],
  ["read a book at night", "reads a book at night"],
  // Not "watch TV" or "live near": said together, "watch TV" sounds as "watched TV" and "live near" as "lived near".
  ["eat rice for lunch", "eats rice for lunch"],
  ["sing in the choir", "sings in the choir"],
  ["have a big dog", "has a big dog"],
];
const thirdSubjects = ["She", "He", "My sister", "The boy", "Tom"];

const were = ["at the park yesterday", "very happy", "late for class", "in the kitchen"];
const wereSubjects = ["They", "We", "You", "The children", "My friends"];

const pasts: readonly [string, string][] = [
  ["goed to the shop yesterday", "went to the shop yesterday"],
  ["eated pizza for dinner", "ate pizza for dinner"],
  ["runned very fast", "ran very fast"],
  ["buyed a new hat", "bought a new hat"],
  ["seed a bird in the tree", "saw a bird in the tree"],
  ["catched the ball", "caught the ball"],
  ["drinked some juice", "drank some juice"],
  ["writed a letter", "wrote a letter"],
  ["taked the bus", "took the bus"],
  ["comed home late", "came home late"],
];
const pastSubjects = ["I", "We", "He"];

const plurals: readonly [string, string][] = [
  ["two childs", "two children"],
  ["three mouses", "three mice"],
  ["five sheeps", "five sheep"],
  ["two mans", "two men"],
  ["four womans", "four women"],
  ["many tooths", "many teeth"],
  ["two foots", "two feet"],
  ["three gooses", "three geese"],
];
const pluralStarts = ["I can see", "We have", "There are"];

const articles: readonly [string, string][] = [
  ["ate a apple", "ate an apple"],
  ["saw a elephant", "saw an elephant"],
  ["wants a egg", "wants an egg"],
  ["has an big dog", "has a big dog"],
  ["found an cat", "found a cat"],
  ["needs a umbrella", "needs an umbrella"],
  ["drew an house", "drew a house"],
  ["bought a orange", "bought an orange"],
  ["met a actor", "met an actor"],
  ["read an book", "read a book"],
];
const articleSubjects = ["She", "My brother"];

const doesnt = ["like milk", "know the answer", "have a pen", "want to go"];
const doesntSubjects = ["He", "She", "My brother", "Tom", "It"];

const modals: readonly [string, string][] = [
  ["can swims", "can swim"],
  ["must goes home", "must go home"],
  ["can to ride a bike", "can ride a bike"],
  ["should eats more fruit", "should eat more fruit"],
  ["will comes tomorrow", "will come tomorrow"],
];
const modalSubjects = ["He", "She", "My dog", "Anna"];

const others: readonly [string, string][] = [
  ["My bike is more better than yours.", "My bike is better than yours."],
  ["She is more taller than me.", "She is taller than me."],
  ["This is the most biggest house.", "This is the biggest house."],
  ["His cake is more nicer.", "His cake is nicer."],
  ["Today is more colder than yesterday.", "Today is colder than yesterday."],
  ["I am agree with you.", "I agree with you."],
  ["I has a red pen.", "I have a red pen."],
  ["I has two brothers.", "I have two brothers."],
  ["We has a lot of homework.", "We have a lot of homework."],
  ["They has a small garden.", "They have a small garden."],
  ["I is ten years old.", "I am ten years old."],
  ["You is my best friend.", "You are my best friend."],
  ["Where you live?", "Where do you live?"],
  ["What you want?", "What do you want?"],
  ["Why she is sad?", "Why is she sad?"],
  ["He didn't went to school.", "He didn't go to school."],
  ["She didn't saw the film.", "She didn't see the film."],
  ["I am go to the park.", "I am going to the park."],
  ["We are play in the garden.", "We are playing in the garden."],
  ["He is sleep now.", "He is sleeping now."],
  ["There is many books on the desk.", "There are many books on the desk."],
  ["She speak English very good.", "She speaks English very well."],
  ["I have went to Beijing.", "I have gone to Beijing."],
  ["He arrived to the station.", "He arrived at the station."],
  ["We discussed about the plan.", "We discussed the plan."],
  ["I am interesting in music.", "I am interested in music."],
];

const id = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/^-|-$/g, "");

/** errorSentences are the 200 sentences of the test, in a fixed order. */
export function errorSentences(): readonly ErrorSentence[] {
  const out: [string, string][] = [];
  for (const s of thirdSubjects) for (const [bad, good] of third) out.push([`${s} ${bad}.`, `${s} ${good}.`]);
  for (const s of wereSubjects) for (const c of were) out.push([`${s} was ${c}.`, `${s} were ${c}.`]);
  for (const s of pastSubjects) for (const [bad, good] of pasts) out.push([`${s} ${bad}.`, `${s} ${good}.`]);
  for (const s of pluralStarts) for (const [bad, good] of plurals) out.push([`${s} ${bad}.`, `${s} ${good}.`]);
  for (const s of articleSubjects) for (const [bad, good] of articles) out.push([`${s} ${bad}.`, `${s} ${good}.`]);
  for (const s of doesntSubjects) for (const v of doesnt) out.push([`${s} don't ${v}.`, `${s} doesn't ${v}.`]);
  for (const s of modalSubjects) for (const [bad, good] of modals) out.push([`${s} ${bad}.`, `${s} ${good}.`]);
  out.push(...others);
  return out.map(([said, correct]) => ({ id: id(said), said, correct }));
}
