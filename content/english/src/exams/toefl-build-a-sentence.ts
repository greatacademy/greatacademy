// TOEFL Writing, Build a Sentence: words and phrases of a reply to another speaker, to put in order. Statements come
// first, then questions and indirect questions, whose word order differs. Every exchange is written for this course.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, type ReplyItem, replyGenerator } from "./kit.ts";

/** reply builds a ReplyItem from what was said and the reply's chunks, separated by bars. */
function reply(said: string, chunks: string, end: "." | "?", alsoRight?: readonly (readonly number[])[]): ReplyItem {
  return { said, chunks: chunks.split("|"), end, ...(alsoRight && { alsoRight }) };
}

const statements: readonly ReplyItem[] = [
  reply("Did you finish the reading for today's class?", "I|only had|time to read|the first|chapter", "."),
  reply("Why weren't you at the meeting yesterday?", "I|didn't know|that it|had been|moved to|Tuesday", "."),
  reply("Is the library open on Sundays?", "yes, but|it|closes|two hours|earlier", "."),
  reply("How did your presentation go?", "it went|better|than|I had|expected", "."),
  reply("Have you chosen a topic for your paper?", "I'm|thinking of|writing about|how bees|choose|a home", "."),
  reply("Can I borrow your notes from Monday?", "of course,|I'll|send|them to you|this evening", "."),
  reply("Where should we meet before the trip?", "let's|meet|in front of|the main|entrance", "."),
  reply("What did the professor say about the exam?", "she said|it will|cover|the last|three|chapters", "."),
  reply("Do you need help carrying those boxes?", "thanks, but|they are|lighter|than they|look", "."),
  reply("Why is the lab closed today?", "they are|replacing|some of|the old|equipment", "."),
  reply("Did you enjoy the lecture?", "it was|interesting, but|a bit|too long|for me", "."),
  reply("Are you coming to the club meeting tonight?", "I can't, because|I have to|finish|an essay|by tomorrow", "."),
  reply("How long have you lived in this city?", "I moved|here|about|three years|ago", "."),
  reply("Which room is the history class in?", "it has|been moved|to the|second|floor", "."),
  reply("Is it hard to get a room in student housing?", "you should|apply|as early|as|you can", "."),
  reply("Did the bus arrive on time this morning?", "no, it|was|twenty minutes|late|because of|the snow", "."),
  reply("What are you going to do this summer?", "I'm hoping|to find|a job|at a|museum", "."),
  reply("Why did you change your major?", "I realized|that I|enjoy|working|with|animals", "."),
  reply("Have you seen the new art center?", "not yet, but|I'm planning|to go|there|next weekend", "."),
  reply("Could you explain the homework to me?", "we have to|answer|the questions|at the end|of the|chapter", "."),
  reply("How was the field trip?", "we saw|more birds|than|we|had|expected", "."),
  reply("Do you know where my umbrella is?", "I think|you|left it|next to|the door", "."),
  reply("Is the cafeteria still serving lunch?", "it|stopped|serving|food|ten minutes|ago", "."),
  reply("Why are you studying so late?", "I have|a test|first thing|in the|morning", "."),
  reply("Did you sign up for the writing course?", "it was|already|full when|I tried|to sign up", "."),
  reply("What should I bring to the interview?", "you only need|to bring|a copy|of your|application", "."),
  reply("Has the package arrived yet?", "it was|delivered|to the|office|this morning", "."),
  reply("Are you going to take the bus?", "I'd rather|walk, since|it's|such a|nice day", "."),
  reply("Why is the river so high?", "it has|rained|almost|every day|this week", ".", [[4, 0, 1, 2, 3]]),
  reply("Did your team win the game?", "we lost|by|a single|point|in the|last minute", ".", [[0, 4, 5, 1, 2, 3]]),
  reply("Is your sister still at university?", "she finished|her degree|last year and|now works|as a|teacher", "."),
  reply("How do you get to campus?", "I usually|ride|my bike|unless|it is|raining", "."),
];

const questions: readonly ReplyItem[] = [
  reply("I'm going to the bookstore after class.", "could you|pick up|a notebook|for me", "?"),
  reply("The professor moved the deadline.", "do you|know|when|the paper|is due|now", "?"),
  reply("I just got back from Japan.", "how long|did you|stay|there", "?"),
  reply("The museum has a new exhibition.", "do you|know|how much|the tickets|cost", "?"),
  reply("I can't find my student card.", "where|did you|last|use|it", "?", [[0, 1, 3, 4, 2]]),
  reply("Our team is meeting on Friday.", "can you|tell me|what time|the meeting|starts", "?"),
  reply("I've joined the photography club.", "how often|does|the club|meet", "?"),
  reply("Someone left a phone in the classroom.", "do you|know|whose|phone|it is", "?"),
  reply("The new dormitory opens next month.", "have you|decided|whether|you will|move in", "?"),
  reply("I'm taking a course in Spanish.", "what made|you|decide|to learn|Spanish", "?"),
  reply("I missed the bus again this morning.", "why|don't you|leave|home|a little|earlier", "?"),
  reply("The lab results came back.", "did they|show|what|you|expected", "?"),
  reply("I'm looking for a quiet place to study.", "have you|tried|the reading room|on the|third floor", "?"),
  reply("The concert was canceled.", "do you|know|why|it|was|canceled", "?"),
  reply("I'm thinking of buying a used bike.", "could you|ask|the seller|how old|it is", "?"),
  reply("The library is getting new computers.", "do you|know|when|they will|be|installed", "?"),
  reply("I finally finished my essay.", "how many|words|did you|end up|writing", "?"),
  reply("There's a talk on climate this evening.", "can you|tell me|where|it|will be|held", "?"),
  reply("My roommate is moving out.", "has she|found|someone|to take|her place", "?"),
  reply("The café on campus has closed.", "do you|know|if|it will|open|again", "?"),
  reply("I need to send this package to Canada.", "do you|know|how long|it|will take|to arrive", "?"),
  reply("The professor wants to see me.", "did she|say|what|she|wants|to discuss", "?"),
  reply("I've lost my notes from the lecture.", "would you|like|to borrow|mine", "?"),
  reply("The exam has been moved to another building.", "do you|know|which|building|it is|in", "?"),
  reply("I start my new job on Monday.", "what|will you|be|doing|there", "?"),
  reply("We're planning a trip to the mountains.", "how|are you|going|to get|there", "?"),
  reply("My laptop stopped working.", "have you|asked|anyone|in the|computer|office", "?"),
  reply("The bookstore is having a sale.", "do you|know|how long|the sale|will|last", "?"),
  reply("I've been offered two jobs.", "which one|are you|going|to accept", "?"),
  reply("The train was delayed for an hour.", "did they|explain|what|had|caused|the delay", "?"),
  reply("I'm writing a paper on early maps.", "where|are you|finding|the old|maps", "?"),
  reply("Our neighbor plays the piano every night.", "does|the noise|keep|you|awake", "?"),
  reply("The swimming pool reopens next week.", "do you|know|what|the new|hours|are", "?"),
];

const question = t("Put the words in order to make a reply.", "把这些词语排好顺序，组成一句回答。");

/** buildASentence is the Build a Sentence task of TOEFL Writing. */
export const buildASentence: TopicDef = examTopic({
  id: "toefl-build-a-sentence",
  title: t("Build a Sentence", "连词成句"),
  summary: t(
    "Put words and phrases in order to reply to another speaker: first statements, then questions and indirect questions.",
    "把词语排成顺序，回答另一个人的话：先是陈述句，再是疑问句和间接疑问句。",
  ),
  strand: "writing",
  prerequisites: ["indirect-questions", "subject-and-object-questions"],
  encompasses: [{ topic: "indirect-questions", weight: 0.2 }],
  xp: 10,
  points: [
    point(
      "statements",
      t("Statements", "陈述句"),
      t(
        "Read what the other speaker said first: the reply must answer it. Find the subject and its verb, put them together, and build outward: what comes after the verb, then the details of place and time, which usually go last.",
        "先读对方说的话：回答必须回应它。找到主语和谓语动词放在一起，再向外扩展：先放动词后面的成分，再放地点和时间等细节，它们通常放在最后。",
      ),
      replyGenerator(question, statements),
    ),
    point(
      "questions",
      t("Questions and indirect questions", "疑问句和间接疑问句"),
      t(
        "A direct question puts the helping verb before the subject: *how long did you stay*. An indirect question, after *do you know* or *can you tell me*, keeps the order of a statement: *do you know when the paper is due*, not *when is the paper due*.",
        "直接疑问句把助动词放在主语前面：how long did you stay。间接疑问句跟在 do you know、can you tell me 之后，保持陈述句语序：do you know when the paper is due，而不是 when is the paper due。",
      ),
      replyGenerator(question, questions),
    ),
  ],
});
