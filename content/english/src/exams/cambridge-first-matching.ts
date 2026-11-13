// Cambridge First Reading Part 7: multiple matching. Each set has four people, A to D, who write a short paragraph on
// the same subject, and eight statements, two about each person: one about what they did or what happened, one about
// how they felt or what they think. The statements say it in other words, and another person often mentions the same
// thing in a way that does not match.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type LabelledItem, labelGenerator } from "./kit.ts";

/** Matched is a statement, the index of the person it matches, and their words that decide it. */
type Matched = readonly [statement: string, person: number, evidence: string];

/** MatchingSet is a subject, four people's paragraphs, and statements of fact and of attitude about them. */
interface MatchingSet {
  readonly subject: string;
  readonly people: readonly [string, string, string, string];
  readonly facts: readonly [Matched, Matched, Matched, Matched];
  readonly attitudes: readonly [Matched, Matched, Matched, Matched];
}

const letters = ["A", "B", "C", "D"] as const;

const sets: readonly MatchingSet[] = [
  {
    subject: "Four people describe learning to cook.",
    people: [
      "I only started cooking at university, when I got tired of paying for takeaways. My first attempts were awful, but a flatmate showed me how to make a few simple dishes, and now I cook every evening. I find it relaxing after a day of lectures.",
      "My grandmother taught me when I was about eight. We made bread together every Sunday, and she never measured anything. I still can't follow a recipe properly, which annoys my husband, but people say my bread is the best they've tasted.",
      "I learned from videos online. At first I tried complicated recipes and failed, so I went back to basics. It took me a year to feel confident. Honestly, I still get nervous when I cook for guests.",
      "I took a six-week evening course at a local college. The teacher was strict, and some people dropped out, but I loved the discipline. The course wasn't cheap, but I'd say it was worth every penny.",
    ],
    facts: [
      ["Which person was taught by a relative?", 1, "My grandmother taught me when I was about eight."],
      ["Which person learned partly because of the cost of food?", 0, "when I got tired of paying for takeaways"],
      ["Which person attended a class with other learners?", 3, "I took a six-week evening course ... some people dropped out"],
      [
        "Which person had to simplify what they were trying to cook?",
        2,
        "I tried complicated recipes and failed, so I went back to basics.",
      ],
    ],
    attitudes: [
      ["Which person still feels anxious in a particular situation?", 2, "I still get nervous when I cook for guests."],
      ["Which person thinks the money they spent was justified?", 3, "it was worth every penny"],
      ["Which person finds cooking calming?", 0, "I find it relaxing after a day of lectures."],
      [
        "Which person admits that a habit of theirs irritates someone?",
        1,
        "I still can't follow a recipe properly, which annoys my husband",
      ],
    ],
  },
  {
    subject: "Four people describe working from home.",
    people: [
      "When my company let us work from home, I set up a desk in the spare room. I get far more done without colleagues interrupting me. The only thing I miss is the chat at lunchtime, so I meet a friend for coffee twice a week.",
      "I tried it for six months and went back to the office. At home I worked longer hours without noticing, and I found it hard to switch off in the evening. I'm much happier now that work stays at work.",
      "Working from home saves me two hours of travelling a day, which I now spend with my children. My manager was doubtful at first, but my results have improved, and she has changed her mind.",
      "I share a small flat with two other people who also work from home, so we take turns at the kitchen table. It can be noisy, but we've agreed on quiet hours in the morning. I'd prefer an office, to be honest, but rents near it are too high.",
    ],
    facts: [
      ["Which person returned to their previous way of working?", 1, "I tried it for six months and went back to the office."],
      [
        "Which person now spends their former travel time on family?",
        2,
        "saves me two hours of travelling a day, which I now spend with my children",
      ],
      ["Which person has made an arrangement with the people they live with?", 3, "we've agreed on quiet hours in the morning"],
      ["Which person makes regular plans to see someone socially?", 0, "I meet a friend for coffee twice a week"],
    ],
    attitudes: [
      ["Which person changed someone else's opinion?", 2, "My manager was doubtful at first ... she has changed her mind."],
      ["Which person would rather be working somewhere else?", 3, "I'd prefer an office, to be honest"],
      ["Which person feels more productive at home?", 0, "I get far more done without colleagues interrupting me."],
      ["Which person found it difficult to stop thinking about work?", 1, "I found it hard to switch off in the evening"],
    ],
  },
  {
    subject: "Four people describe a memorable journey.",
    people: [
      "We drove across Australia in an old van that broke down twice. Each time, strangers stopped to help, and one family even invited us to stay the night. I'd always thought of myself as independent, but that trip taught me to accept help.",
      "I took the train from Beijing to Moscow, six days in all. I'd expected to be bored, but the changing landscape outside the window was never dull. I spent hours just watching it and writing in my diary.",
      "My trip to Iceland was a disappointment, mainly because of the weather. It rained every day and we hardly saw the mountains. Still, the hot springs were wonderful, and I'd like to go back one day in summer.",
      "I cycled the length of my own country, from the south coast to the far north, to raise money for a hospital. It took three weeks. My legs ached for days afterwards, but I've never felt so proud of anything.",
    ],
    facts: [
      ["Which person travelled in order to support a cause?", 3, "to raise money for a hospital"],
      ["Which person had problems with their vehicle?", 0, "an old van that broke down twice"],
      ["Which person kept a written record of the journey?", 1, "writing in my diary"],
      ["Which person could not see some of the scenery they had hoped to see?", 2, "we hardly saw the mountains"],
    ],
    attitudes: [
      [
        "Which person was surprised to enjoy something they had expected to dislike?",
        1,
        "I'd expected to be bored, but the changing landscape ... was never dull.",
      ],
      ["Which person learned something about their own character?", 0, "that trip taught me to accept help"],
      ["Which person felt a strong sense of achievement?", 3, "I've never felt so proud of anything."],
      ["Which person hopes to repeat the trip in better conditions?", 2, "I'd like to go back one day in summer"],
    ],
  },
  {
    subject: "Four people describe taking up a sport as adults.",
    people: [
      "I joined a rowing club at forty. Training starts at six in the morning, which I hated at first, but now I can't imagine starting the day any other way. The others in my boat have become close friends.",
      "My doctor suggested swimming for my back. I was embarrassed because I could barely swim, so I took lessons with a group of children. They were very patient with me, and my back is much better.",
      "I started climbing after watching a film about it. I bought all the expensive equipment before my first lesson, which was a mistake, because I needed different shoes. I'm still a beginner, but I go three times a week.",
      "I play tennis with my neighbour every Saturday. Neither of us is any good, and we don't keep score. For me it's an excuse to be outside and have a laugh, rather than a competition.",
    ],
    facts: [
      ["Which person took up the sport for a health reason?", 1, "My doctor suggested swimming for my back."],
      [
        "Which person spent money unwisely at the start?",
        2,
        "I bought all the expensive equipment before my first lesson, which was a mistake",
      ],
      ["Which person plays without counting points?", 3, "we don't keep score"],
      ["Which person has formed strong friendships through the sport?", 0, "The others in my boat have become close friends."],
    ],
    attitudes: [
      ["Which person felt awkward about their lack of skill?", 1, "I was embarrassed because I could barely swim"],
      ["Which person is not interested in winning?", 3, "rather than a competition"],
      [
        "Which person came to like something they had disliked?",
        0,
        "which I hated at first, but now I can't imagine starting the day any other way",
      ],
      ["Which person was inspired by something they saw?", 2, "I started climbing after watching a film about it."],
    ],
  },
  {
    subject: "Four people describe their first job.",
    people: [
      "My first job was in a bookshop. The pay was low, but I could borrow any book I liked, and I read more that year than ever before. The owner trusted me to run the shop alone on Sundays, which gave me a lot of confidence.",
      "I worked in a busy restaurant kitchen at sixteen. It was hot, loud and exhausting, and the chef shouted at everyone. I left after three months, but looking back, it taught me to work fast under pressure.",
      "I was a lifeguard at an outdoor pool. Most days nothing happened, and the hardest part was staying alert. Once I had to pull a child out of the water, and I'll never forget how frightened I was.",
      "I delivered newspapers before school for two years. I had to get up at five, even in winter. I saved almost everything I earned and bought my first bicycle, which I still have.",
    ],
    facts: [
      ["Which person was given responsibility for a whole business at times?", 0, "The owner trusted me to run the shop alone on Sundays"],
      ["Which person left the job after a short time?", 1, "I left after three months"],
      ["Which person bought something with the money they had saved?", 3, "I saved almost everything I earned and bought my first bicycle"],
      ["Which person had to deal with an emergency?", 2, "Once I had to pull a child out of the water"],
    ],
    attitudes: [
      ["Which person now sees value in an unpleasant experience?", 1, "looking back, it taught me to work fast under pressure"],
      ["Which person found it hard to concentrate when little was happening?", 2, "the hardest part was staying alert"],
      ["Which person says the job made them feel more sure of themselves?", 0, "which gave me a lot of confidence"],
      ["Which person still owns something connected with the job?", 3, "my first bicycle, which I still have"],
    ],
  },
  {
    subject: "Four people describe moving to a new city.",
    people: [
      "I moved to Berlin for a job without speaking any German. The first months were lonely, and I nearly went home. Joining a choir changed everything: I made friends and my German improved quickly.",
      "When I moved to the capital, the cost of living shocked me. I share a flat with three strangers and spend half my salary on rent. Even so, I wouldn't swap the energy of this city for anywhere else.",
      "I moved to a small coastal city to be near my partner's family. I'd lived in big cities all my life, so I worried I'd be bored, but I've found the slower pace suits me. I walk to work along the beach.",
      "I've moved four times in ten years because of my husband's job. I've become good at settling in: the first thing I do is find a local café and become a regular. Still, I'm tired of starting again.",
    ],
    facts: [
      ["Which person moved for family reasons?", 2, "to be near my partner's family"],
      ["Which person found a group activity that helped them?", 0, "Joining a choir changed everything"],
      ["Which person has relocated several times?", 3, "I've moved four times in ten years"],
      ["Which person spends a large part of their income on housing?", 1, "spend half my salary on rent"],
    ],
    attitudes: [
      ["Which person almost gave up and returned?", 0, "I nearly went home"],
      ["Which person feels positive about the city despite a disadvantage?", 1, "Even so, I wouldn't swap the energy of this city"],
      ["Which person expresses weariness about moving?", 3, "I'm tired of starting again."],
      ["Which person's fears about the move turned out to be wrong?", 2, "I worried I'd be bored, but I've found the slower pace suits me"],
    ],
  },
  {
    subject: "Four people describe their use of social media.",
    people: [
      "I deleted all my social media apps last year. I noticed I was checking my phone every few minutes, even during meals. Now I read more and sleep better, although I sometimes miss out on news from old friends.",
      "I run a small online shop, so social media is essential for my business. I post photos of new products every morning. Most of my customers find me there, so I couldn't stop even if I wanted to.",
      "I mainly use it to keep in touch with my family abroad. My grandparents have learned to send videos, which is lovely. I don't post much myself; I'm quite a private person.",
      "I used to compare myself with people online all the time, and it made me miserable. Now I follow only accounts about hobbies, like gardening. It's a much friendlier place for me.",
    ],
    facts: [
      ["Which person depends on social media for their work?", 1, "social media is essential for my business"],
      ["Which person changed the kind of accounts they follow?", 3, "Now I follow only accounts about hobbies"],
      ["Which person stopped using social media completely?", 0, "I deleted all my social media apps last year."],
      ["Which person mentions older relatives learning a new skill?", 2, "My grandparents have learned to send videos"],
    ],
    attitudes: [
      ["Which person says social media used to make them unhappy?", 3, "it made me miserable"],
      ["Which person describes themselves as reserved?", 2, "I'm quite a private person"],
      ["Which person feels they have no real choice about using it?", 1, "I couldn't stop even if I wanted to"],
      ["Which person regrets losing contact with some people?", 0, "I sometimes miss out on news from old friends"],
    ],
  },
  {
    subject: "Four people describe learning a musical instrument.",
    people: [
      "I've played the piano since I was five, mostly because my parents insisted. I hated practising as a child, but at about fifteen I discovered jazz, and suddenly I wanted to play all day.",
      "I bought a guitar at fifty after my children left home. My fingers hurt for weeks, and progress is slow, but I play for twenty minutes every evening. My aim is simply to play a few songs I love.",
      "I learned the violin at school and played in the school orchestra. I gave it up at university because I had no time. I regret that now; when I tried again recently, I'd forgotten almost everything.",
      "I teach myself the drums from online lessons. My neighbours complained about the noise, so I bought an electronic kit that I can play with headphones. It's not quite the same, but it keeps the peace.",
    ],
    facts: [
      [
        "Which person found a solution to a problem with the people next door?",
        3,
        "My neighbours complained ... so I bought an electronic kit",
      ],
      ["Which person started learning late in life?", 1, "I bought a guitar at fifty"],
      ["Which person played with a group of musicians?", 2, "played in the school orchestra"],
      ["Which person was made to learn by others?", 0, "mostly because my parents insisted"],
    ],
    attitudes: [
      ["Which person wishes they had not stopped playing?", 2, "I regret that now"],
      ["Which person has modest goals?", 1, "My aim is simply to play a few songs I love."],
      ["Which person accepts that their solution is not perfect?", 3, "It's not quite the same, but it keeps the peace."],
      [
        "Which person's attitude changed when they found a new style?",
        0,
        "at about fifteen I discovered jazz, and suddenly I wanted to play all day",
      ],
    ],
  },
];

const shownSet = (s: MatchingSet) => `*${s.subject}*\n\n${s.people.map((p, i) => `**${letters[i]}** ${p}`).join("\n\n")}`;

function items(matched: (s: MatchingSet) => readonly Matched[], attitude: boolean): readonly LabelledItem[] {
  return interleave(
    sets.map((s) =>
      matched(s).map(([statement, person, evidence]) => ({
        shown: `${shownSet(s)}\n\n**${statement}**`,
        right: person,
        solution: attitude
          ? t(
              `**${letters[person]}**: "${evidence}" The statement names a feeling or a view in other words. Others may mention the same subject, so check that the person's attitude, not only the topic, matches.`,
              `**${letters[person]}**："${evidence}" 陈述用别的话说出一种感受或看法。其他人可能也提到同一件事，所以要核对此人的态度，而不只是话题。`,
            )
          : t(
              `**${letters[person]}**: "${evidence}" The statement says it in other words. Find the person whose words mean the same, and check that every part of the statement fits them.`,
              `**${letters[person]}**："${evidence}" 陈述换了说法。找到话的意思与之相同的人，并核对陈述的每一部分都符合此人。`,
            ),
      })),
    ),
  );
}

/** multipleMatching is the Cambridge First topic of matching statements to people. */
export const multipleMatching: TopicDef = examTopic({
  id: "fce-multiple-matching",
  title: t("Multiple Matching", "多项匹配"),
  summary: t(
    "Cambridge First Reading Part 7 style: four people write on one subject, and each statement matches one of them.",
    "剑桥 First 阅读第 7 部分风格：四个人就同一话题各写一段，每个陈述对应其中一人。",
  ),
  strand: "reading",
  prerequisites: ["making-inferences"],
  encompasses: [{ topic: "making-inferences", weight: 0.3 }],
  xp: 10,
  points: [
    point(
      "fce-matching-facts",
      t("Matching What People Did", "匹配人们做了什么"),
      t(
        "Read the statement and pick out its key idea: *taught by a relative*, *left after a short time*. The texts will not use the same words, so look for the same meaning: *my grandmother taught me*, *I left after three months*. Several people may mention a similar subject; only one says exactly what the statement says.",
        "读陈述，抓住关键意思：*taught by a relative*、*left after a short time*。文章不会用相同的词，要找相同的意思：*my grandmother taught me*、*I left after three months*。几个人可能提到相似的话题，只有一个人说的和陈述完全一致。",
      ),
      labelGenerator(
        t("Choose the person, A, B, C or D.", "选择对应的人：A、B、C 或 D。"),
        letters,
        items((s) => s.facts, false),
      ),
    ),
    point(
      "fce-matching-attitudes",
      t("Matching Feelings and Views", "匹配感受和看法"),
      t(
        "Statements about attitude use words such as *regrets*, *was surprised*, *feels anxious*, *thinks it was justified*. The person may never use that word: *I regret that now* is direct, but *I still get nervous* means *anxious*, and *worth every penny* means *justified*. Watch for words like *but*, *still* and *looking back*, which often mark the attitude.",
        "关于态度的陈述用 *regrets*、*was surprised*、*feels anxious*、*thinks it was justified* 这样的词。那个人可能从不用这个词：*I regret that now* 很直接，但 *I still get nervous* 表示 *anxious*，*worth every penny* 表示 *justified*。留意 *but*、*still*、*looking back* 这类词，它们常常标出态度。",
      ),
      labelGenerator(
        t("Choose the person, A, B, C or D.", "选择对应的人：A、B、C 或 D。"),
        letters,
        items((s) => s.attitudes, true),
      ),
    ),
  ],
});
