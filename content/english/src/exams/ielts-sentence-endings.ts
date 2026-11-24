// IELTS Reading: matching sentence endings. Each short text has three sentence beginnings, each with its right ending,
// a near miss that reuses the text's words to say what it does not, and two further endings the text does not support.
// A learner first chooses the ending of one beginning, then works with the whole list of endings, A to F, as the test
// prints it.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type LabelledItem, labelGenerator, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** Beginning is a sentence beginning, its right ending, a near miss built from the text's words, and the words of the text that decide it. */
type Beginning = readonly [beginning: string, ending: string, nearMiss: string, evidence: string];

/** Ended is a short text, three sentence beginnings and two endings that fit none of them. */
interface Ended {
  readonly text: string;
  readonly beginnings: readonly [Beginning, Beginning, Beginning];
  readonly extras: readonly [string, string];
}

const texts: readonly Ended[] = [
  {
    text: "Foxes have lived in many European cities for decades, but they behave differently from foxes in the countryside. City foxes have smaller territories, because food is easier to find: a few gardens and bins can feed a family. They are also bolder. In one experiment, researchers left unfamiliar objects near food; urban foxes approached them within minutes, while rural foxes often stayed away for the whole night. Yet city foxes are not tame. Most avoid people and do their searching after midnight, when the streets are quiet. Their main danger is traffic, which kills more young foxes than any disease.",
    beginnings: [
      [
        "The territories of city foxes",
        "are small because food is easy to find.",
        "are small because the foxes avoid people.",
        "City foxes have smaller territories, because food is easier to find",
      ],
      [
        "In the experiment, rural foxes",
        "often kept away from the new objects.",
        "approached the new objects within minutes.",
        "rural foxes often stayed away for the whole night",
      ],
      [
        "Traffic",
        "kills more young foxes than disease does.",
        "is the reason foxes search for food after midnight.",
        "Their main danger is traffic, which kills more young foxes than any disease",
      ],
    ],
    extras: ["were fed by the researchers every night.", "is the main reason foxes move into cities."],
  },
  {
    text: "About one in five workers in industrial countries works at night for at least part of the month. The human body, however, is built to sleep in darkness. Night workers sleep on average one to two hours less than day workers, because daytime sleep is lighter and more often interrupted by noise. Over years, this loss has been linked with weight gain and heart disease. Some employers now try to reduce the harm. One hospital moved from rotating shifts, in which staff changed between day and night every week, to fixed shifts chosen by the staff themselves. Absence fell by a quarter, and the nurses who chose nights reported sleeping better than before.",
    beginnings: [
      [
        "Sleep during the day",
        "is lighter and more easily disturbed than sleep at night.",
        "lasts one to two hours longer than sleep at night.",
        "daytime sleep is lighter and more often interrupted by noise",
      ],
      [
        "Under the hospital's old system, staff",
        "changed between day and night shifts every week.",
        "chose whether to work days or nights.",
        "rotating shifts, in which staff changed between day and night every week",
      ],
      [
        "Nurses who chose to work at night",
        "said they slept better than before.",
        "were absent more often than before.",
        "the nurses who chose nights reported sleeping better than before",
      ],
    ],
    extras: ["worked fewer hours than the day staff.", "is the main cause of heart disease."],
  },
  {
    text: "Bamboo is a grass, not a tree, yet some species grow as tall as a four-storey building. It grows very fast: a stem can rise by almost a metre in a single day, and it can be harvested after three to five years, compared with decades for most timber. Its strength comes from long fibres that run along the stem, which make it hard to snap. Its weaknesses are insects and damp. Untreated bamboo can rot within a few years, so builders soak the stems in a solution of salts or protect them from rain with wide roofs. In several countries, engineers are now writing official building standards for bamboo, which banks require before they will lend money for houses built from it.",
    beginnings: [
      [
        "Bamboo stems",
        "can be cut for use after three to five years.",
        "take decades to be ready for use.",
        "it can be harvested after three to five years",
      ],
      [
        "The long fibres in a stem",
        "make bamboo hard to break.",
        "attract insects and hold damp.",
        "long fibres that run along the stem, which make it hard to snap",
      ],
      [
        "Banks",
        "want official standards before lending money for bamboo houses.",
        "are writing official standards for bamboo buildings.",
        "which banks require before they will lend money for houses built from it",
      ],
    ],
    extras: ["are usually painted to keep insects away.", "are stronger than steel in every way."],
  },
  {
    text: "Many primary schools have started gardens, and researchers have tried to measure what children gain from them. In one study, pupils who grew vegetables for a year were more willing to taste new vegetables than pupils at similar schools without gardens, although they did not eat more vegetables at home. Teachers also used the gardens for maths and science: pupils measured how fast plants grew and recorded the results in charts. The biggest problem was the summer holiday, when nobody was there to water the plants. Schools that succeeded usually found volunteers among parents or neighbours to look after the garden while the school was closed.",
    beginnings: [
      [
        "Pupils who grew vegetables",
        "were more willing to try new vegetables.",
        "ate more vegetables at home.",
        "pupils who grew vegetables for a year were more willing to taste new vegetables",
      ],
      [
        "In maths and science lessons, pupils",
        "measured how the plants grew.",
        "sold the vegetables they had grown.",
        "pupils measured how fast plants grew and recorded the results in charts",
      ],
      [
        "Successful schools",
        "found volunteers to look after the garden in the holidays.",
        "closed their gardens for the summer.",
        "Schools that succeeded usually found volunteers among parents or neighbours",
      ],
    ],
    extras: ["were given extra lessons in cooking.", "won prizes for their vegetables."],
  },
  {
    text: "Wind turbines are sometimes blamed for killing large numbers of birds. Studies suggest that the number killed by each turbine is usually small, far smaller than the number killed by cats or by flying into glass windows. The risk is not equal everywhere, however. Turbines placed on the routes that birds follow when they migrate, or near the nests of large birds such as eagles, cause far more deaths. In one trial, painting one of the three blades black reduced bird deaths by about 70 per cent, apparently because the moving blades became easier to see. Some wind farms now also stop their turbines for short periods when cameras detect large birds approaching.",
    beginnings: [
      [
        "Cats and glass windows",
        "kill more birds than wind turbines do.",
        "are the main danger to eagles.",
        "far smaller than the number killed by cats or by flying into glass windows",
      ],
      [
        "Turbines on migration routes",
        "cause more bird deaths than turbines elsewhere.",
        "are painted black to protect birds.",
        "Turbines placed on the routes that birds follow when they migrate",
      ],
      [
        "Painting one blade black",
        "made the blades easier for birds to see.",
        "made the turbines produce 70 per cent less power.",
        "apparently because the moving blades became easier to see",
      ],
    ],
    extras: ["have been removed from most wind farms.", "frightens birds away from their nests."],
  },
  {
    text: "Desalination removes salt from sea water to make it fit to drink. Most modern plants use reverse osmosis, in which water is pushed at high pressure through a membrane that lets water pass but stops salt. The method works, but it has two drawbacks. It uses a great deal of energy, mainly to create the pressure, and it leaves behind a very salty liquid called brine. If brine is poured back into the sea in one place, it sinks and can harm creatures living on the sea floor. Newer plants spread it through many small pipes so that it mixes quickly, and some companies are testing ways to extract useful minerals from it.",
    beginnings: [
      [
        "The membrane",
        "lets water through but holds back the salt.",
        "removes energy from the water.",
        "a membrane that lets water pass but stops salt",
      ],
      [
        "Most of the energy",
        "is used to create high pressure.",
        "is used to extract minerals from brine.",
        "It uses a great deal of energy, mainly to create the pressure",
      ],
      [
        "Brine released in one place",
        "can harm animals on the sea floor.",
        "mixes quickly with the sea water.",
        "it sinks and can harm creatures living on the sea floor",
      ],
    ],
    extras: ["is safe to drink without further treatment.", "is sold to farmers as fertiliser."],
  },
  {
    text: "Parents often hope that music lessons will make their children better at other subjects. The evidence is mixed. Children who learn an instrument do tend to score higher in reading and maths, but they also tend to come from families with more money and more books at home. When researchers compared children from similar families, the difference became much smaller. One large trial gave free lessons to children chosen at random; after two years, their memory for sounds had improved, but their school marks had not. The researchers concluded that music is worth learning for its own sake, not as a short cut to success in other subjects.",
    beginnings: [
      [
        "Children who play an instrument",
        "often come from better-off families.",
        "always do better at school than other children.",
        "they also tend to come from families with more money and more books at home",
      ],
      [
        "In the large trial, children",
        "were chosen at random to receive lessons.",
        "chose which instrument they wanted to learn.",
        "One large trial gave free lessons to children chosen at random",
      ],
      [
        "After two years, the children's school marks",
        "showed no improvement.",
        "rose in reading but not in maths.",
        "their memory for sounds had improved, but their school marks had not",
      ],
    ],
    extras: ["were higher than their parents expected.", "practised for an hour every day."],
  },
  {
    text: "Most deaths in earthquakes are caused not by the shaking itself but by buildings that collapse. Engineers use several methods to keep buildings standing. One is base isolation: the building rests on thick pads of rubber and steel, which let the ground move beneath it while the structure above moves much less. Another is to place heavy weights near the top of tall towers; they swing in the opposite direction to the building and reduce its movement. These methods are expensive, so in poorer regions engineers often focus on simpler steps, such as tying walls and roofs firmly together, which can stop a house from falling apart even if its walls crack.",
    beginnings: [
      [
        "Most earthquake deaths",
        "result from buildings falling down.",
        "are caused by the shaking of the ground.",
        "Most deaths in earthquakes are caused not by the shaking itself but by buildings that collapse",
      ],
      [
        "The pads of rubber and steel",
        "allow the ground to move under the building.",
        "swing in the opposite direction to the building.",
        "which let the ground move beneath it while the structure above moves much less",
      ],
      [
        "Tying walls and roofs together",
        "can keep a cracked house from falling apart.",
        "is too expensive for poorer regions.",
        "which can stop a house from falling apart even if its walls crack",
      ],
    ],
    extras: ["are placed on the roofs of tall towers.", "prevents the walls from cracking."],
  },
  {
    text: "In several cities, apps now connect shops and restaurants that have unsold food at the end of the day with customers who want a cheap meal. A bakery, for example, can offer a bag of the day's leftover bread at a third of its usual price. Customers do not know exactly what they will get, which some find part of the fun. For businesses, the money is small, but they throw away less, and many say the app brings in new customers who later return and pay full price. Critics point out that the food saved is only a tiny share of the total wasted, most of which is thrown away in homes rather than in shops.",
    beginnings: [
      [
        "Bakeries using the app",
        "sell leftover bread at a lower price.",
        "give leftover bread away for free.",
        "a bag of the day's leftover bread at a third of its usual price",
      ],
      [
        "Some customers",
        "enjoy not knowing what they will receive.",
        "complain about the quality of the food.",
        "Customers do not know exactly what they will get, which some find part of the fun",
      ],
      [
        "Most wasted food",
        "is thrown away in people's homes.",
        "is sold through apps at the end of the day.",
        "most of which is thrown away in homes rather than in shops",
      ],
    ],
    extras: ["make large profits from the app.", "is given to farm animals."],
  },
  {
    text: "Artificial light at night has spread so widely that most people in Europe and North America can no longer see the Milky Way from where they live. The effects go beyond the loss of the stars. Many insects are drawn to street lamps and circle them until they die of exhaustion, which reduces the food available for bats and birds. Young sea turtles, which find the sea by moving towards the brightest horizon, may crawl inland towards lit roads instead. Some towns have switched to lamps that point downwards and give a warmer, orange light, which attracts fewer insects. Others simply turn off half their street lights after midnight, and residents have rarely complained.",
    beginnings: [
      [
        "Insects that circle street lamps",
        "may die of exhaustion.",
        "are eaten by young sea turtles.",
        "circle them until they die of exhaustion",
      ],
      [
        "Young sea turtles",
        "may head towards lit roads instead of the sea.",
        "are attracted by the warmer orange light.",
        "may crawl inland towards lit roads instead",
      ],
      [
        "Residents of towns that turn off lights after midnight",
        "have seldom complained.",
        "can now see the Milky Way again.",
        "residents have rarely complained",
      ],
    ],
    extras: ["use more electricity than before.", "move inland to avoid the light."],
  },
];

for (const e of texts) {
  for (const [beginning, , , evidence] of e.beginnings) {
    if (!e.text.includes(evidence)) throw new Error(`the evidence for "${beginning}" is not in the text: ${evidence}`);
  }
}

/** end gives the period a quoted piece of evidence needs when it has no closing punctuation of its own. */
const end = (evidence: string) => (/[.!?]$/u.test(evidence) ? "" : ".");

/** joined writes a beginning and its ending as one sentence. */
const joined = (beginning: string, ending: string) => `${beginning} ${ending}`;

const nearWhy = t(
  "This ending reuses words from the text, but the text does not say it about this beginning.",
  "这个结尾借用了原文的词，但原文并没有就这个开头这样说。",
);
const extraWhy = (chosen: string) => t(`"${chosen}" is not supported by the text at all.`, `“${chosen}”在原文中根本没有依据。`);

const single: readonly SolvedChoice[] = interleave(
  texts.map((e) =>
    e.beginnings.map(
      ([beginning, ending, nearMiss, evidence]): SolvedChoice => ({
        shown: `${e.text}\n\n**${beginning} …**`,
        right: ending,
        wrong: [nearMiss, ...e.extras],
        solution: t(
          `**${joined(beginning, ending)}** The text says: "${evidence}${end(evidence)}"\n\n**Check.** Read the joined sentence as a whole and verify it matches "${evidence}${end(evidence)}" in both grammar and meaning.`,
          `**${joined(beginning, ending)}** 原文是："${evidence}${end(evidence)}"\n\n**检验。** 把拼接后的整句通读一遍，确认语法连贯且与原文“${evidence}${end(evidence)}”意思一致。`,
        ),
        whyNot: [nearWhy, ...e.extras.map(extraWhy)],
      }),
    ),
  ),
);

const labels = ["A", "B", "C", "D", "E", "F"] as const;

/** listOf gives the six endings of a text in the order printed: the three right ones, a near miss and the two extras, turned by the text's place. */
function listOf(e: Ended, place: number): readonly string[] {
  const near = e.beginnings[place % 3]?.[2] ?? "";
  const endings = [...e.beginnings.map(([, ending]) => ending), near, ...e.extras];
  const turn = (place * 2 + 1) % endings.length;
  return [...endings.slice(turn), ...endings.slice(0, turn)];
}

const full: readonly LabelledItem[] = interleave(
  texts.map((e, place) => {
    const list = listOf(e, place);
    const sentences = e.beginnings.map(([beginning], i) => `${i + 1}. ${beginning} …`).join("\n");
    const printed = list.map((ending, i) => `**${labels[i]}** ${ending}`).join("\n\n");
    return e.beginnings.map(([beginning, ending, , evidence], i): LabelledItem => {
      const right = list.indexOf(ending);
      return {
        shown: `${e.text}\n\n${sentences}\n\n${printed}\n\n**Which ending completes sentence ${i + 1}?**`,
        right,
        solution: t(
          `**${labels[right]}**: ${joined(beginning, ending)} The text says: "${evidence}${end(evidence)}"\n\n**Check.** Confirm ending **${labels[right]}** continues sentence ${i + 1} grammatically and paraphrases the quoted evidence.`,
          `**${labels[right]}**：${joined(beginning, ending)} 原文是："${evidence}${end(evidence)}"\n\n**检验。** 确认结尾 **${labels[right]}** 在语法上能自然接续第 ${i + 1} 句，并且准确转述了所引原文。`,
        ),
        whyNot: (label) => {
          const chosen = list[label] ?? "";
          const other = e.beginnings.findIndex(([, ending]) => ending === chosen);
          return other >= 0
            ? t(
                `This ending completes sentence ${other + 1}, not sentence ${i + 1}.`,
                `这个结尾属于第 ${other + 1} 句，而不是第 ${i + 1} 句。`,
              )
            : e.extras.includes(chosen)
              ? extraWhy(chosen)
              : nearWhy;
        },
      };
    });
  }),
);

/** sentenceEndings is the IELTS topic of matching sentence endings. */
export const sentenceEndings: TopicDef = examTopic({
  id: "ielts-matching-sentence-endings",
  title: t("Matching Sentence Endings", "句子结尾匹配"),
  summary: t(
    "IELTS-style sentence beginnings after short texts, each to be completed with the ending the text supports: first one at a time, then from a list of six endings.",
    "雅思风格的题目：短文后给出句子的开头，要选出原文支持的结尾。先一次完成一句，再从六个结尾的列表中选择。",
  ),
  intro: t(
    "Matching Sentence Endings tests both reading accuracy and grammar at once: a valid ending must continue the sentence's syntax cleanly **and** agree with the passage—without falling for a near miss that swaps the subject.",
    "句子结尾匹配同时考查阅读准确度与语法衔接：正确的结尾既要能自然接续前半句的语法，又要与原文意思一致，不能落入偷换主语的近似陷阱。",
  ),
  strand: "reading",
  prerequisites: ["ielts-true-false-not-given"],
  encompasses: [{ topic: "ielts-true-false-not-given", weight: 0.2 }],
  xp: 12,
  points: [
    point(
      "ielts-choosing-an-ending",
      t("Choosing an Ending", "选择结尾"),
      t(
        "Each beginning names something the text talks about. Find the part of the text about it: the beginning often uses the text's own words, or close ones. Then read what the text says about it and choose the ending that says the same thing.\n\n> **Watch out.** Beware the **near miss**: it borrows real words from the text but attaches them to the wrong subject or flips the meaning (*Rural foxes approached the new objects* when the text says city foxes did).",
        "每个开头都指向原文谈到的某个事物。找到原文中谈它的部分：开头常用原文的词，或相近的词。再读原文对它说了什么，选出意思相同的结尾。\n\n> **注意。** 警惕**近似陷阱**：它照搬原文里真实出现的词，却把它们接到了错误的主语上或把意思说反（原文说的是城市狐狸，选项却写成 *Rural foxes*）。",
      ),
      solvedChoiceGenerator(t("Read the text and choose the right ending.", "阅读短文，选出正确的结尾。"), single),
    ),
    point(
      "ielts-endings-from-a-list",
      t("Matching from a List of Endings", "从结尾列表中匹配"),
      t(
        "In the test, a list of endings serves several beginnings, and there are more endings than beginnings. Work through the beginnings in order, since they follow the order of the text. For each, find its part of the text, then look for its ending in the list. Grammar can help: an ending must continue the beginning as a correct sentence.\n\n> **Watch out.** Because there are extra unused endings in the list, never pick an ending just by eliminating two others—always verify it against the passage itself.",
        "考试中，一个结尾列表供几个开头共用，而且结尾比开头多。按顺序逐句作答，因为开头的顺序与原文一致。每一句都先找到原文中对应的部分，再在列表中找它的结尾。语法也能帮忙：结尾必须能和开头连成正确的句子。\n\n> **注意。** 列表里有多余的干扰结尾，切忌只靠排除法盲选——每个配对都必须回到原文核对。",
      ),
      labelGenerator(
        t("Read the text and the sentences below it, then answer the question.", "阅读短文和下面的句子，然后回答问题。"),
        labels,
        full,
      ),
    ),
  ],
});
