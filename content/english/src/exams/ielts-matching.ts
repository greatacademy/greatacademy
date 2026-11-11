// IELTS Reading: matching headings to paragraphs, and finding the paragraph that contains a piece of information.
// Each text has four lettered paragraphs, six headings (four right and two that fit no paragraph) and one piece of
// information from each paragraph, which is a detail rather than its main idea.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type LabelledItem, labelGenerator, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** Lettered is a text of four paragraphs with their headings, two extra headings, and a detail of each paragraph with its evidence. */
interface Lettered {
  readonly paragraphs: readonly [string, string, string, string];
  readonly headings: readonly [string, string, string, string];
  readonly extra: readonly [string, string];
  readonly details: readonly (readonly [detail: string, evidence: string])[];
}

const letters = ["A", "B", "C", "D"] as const;

const shownText = (text: Lettered) => text.paragraphs.map((p, i) => `**${letters[i]}** ${p}`).join("\n\n");

function headingItems(text: Lettered): readonly SolvedChoice[] {
  return text.paragraphs.map((_, i) => {
    const right = text.headings[i] as string;
    const letter = letters[i] as string;
    return {
      shown: `${shownText(text)}\n\n**Paragraph ${letter}**`,
      right,
      wrong: [...text.headings.filter((_, j) => j !== i), ...text.extra],
      whyNot: [
        ...text.headings
          .map((_, j) => j)
          .filter((j) => j !== i)
          .map((j) =>
            t(
              `That heading sums up paragraph ${letters[j]}, not paragraph ${letter}, which is about "${right}".`,
              `这个标题概括的是段落 ${letters[j]}，而不是段落 ${letter}；段落 ${letter} 讲的是“${right}”。`,
            ),
          ),
        ...text.extra.map(() =>
          t(
            `No paragraph is about this. It sounds close to the subject of the text, but paragraph ${letter} is about "${right}".`,
            `没有哪个段落讲这个内容。它听起来和文章主题相近，但段落 ${letter} 讲的是“${right}”。`,
          ),
        ),
      ],
      solution: t(
        `"${right}" sums up the whole of paragraph ${letter}. A heading that matches only one detail, or a word you can see in the paragraph, is a trap: the heading must cover what every sentence is there to say.`,
        `“${right}”概括了段落 ${letter} 的全部内容。只对应某个细节或只是含有段落中某个词的标题是陷阱：标题必须涵盖段落中每个句子共同要表达的意思。`,
      ),
    };
  });
}

function detailItems(text: Lettered): readonly LabelledItem[] {
  return text.details.map(([detail, evidence], i) => ({
    shown: `${shownText(text)}\n\n**Information:** ${detail}`,
    right: i,
    whyNot: (label: number) =>
      t(
        `Paragraph ${letters[label]} is about "${text.headings[label]}" and does not give this detail. It is in paragraph ${letters[i]}.`,
        `段落 ${letters[label]} 讲的是“${text.headings[label]}”，没有提到这个细节。它在段落 ${letters[i]}。`,
      ),
    solution: t(
      `Paragraph ${letters[i]}: "${evidence}" The information is a detail in other words, not the main idea of the paragraph.`,
      `段落 ${letters[i]}："${evidence}" 这条信息是换了说法的细节，而不是该段的主旨。`,
    ),
  }));
}

const texts: readonly Lettered[] = [
  {
    paragraphs: [
      "For most of history, people told the time by the sun. Each town set its clocks to noon, the moment when the sun was highest, so the time in one town might be several minutes different from the time in the next. Since few people travelled far in a day, this caused little trouble.",
      "The railways changed this. A train leaving one town at ten o'clock might arrive in another where the clocks showed a different time altogether, and printed timetables became almost impossible to follow. Passengers missed trains, and there were even accidents when two trains were on the same line at the same moment.",
      "The solution was a single time for a whole country. In Britain, railway companies adopted London time in the 1840s, and towns gradually followed. In 1884 an international meeting divided the world into time zones, each normally one hour apart, measured from a line passing through Greenwich in London.",
      "Not everyone accepted the change at once. Some towns kept two clocks on public buildings, one showing local time and one showing railway time. Many people felt that time belonged to the sun and not to the companies, and it was decades before the new system was used everywhere.",
    ],
    headings: ["Time set by the sun", "A problem created by faster travel", "Agreeing on shared time", "Resistance to the new system"],
    extra: ["The invention of the mechanical clock", "Why the railways lost money"],
    details: [
      [
        "a reason why differences between towns did not matter at first",
        "Since few people travelled far in a day, this caused little trouble.",
      ],
      ["a reference to trains crashing", "There were even accidents when two trains were on the same line at the same moment."],
      ["the place from which time zones are measured", "Measured from a line passing through Greenwich in London."],
      ["buildings that showed two different times", "Some towns kept two clocks on public buildings."],
    ],
  },
  {
    paragraphs: [
      "Coffee was first drunk in Yemen in the fifteenth century, where it helped people stay awake during long night prayers. From there it spread to Cairo and Istanbul, and by the sixteenth century coffee houses had become places where men met to talk, play games and listen to music.",
      "Not all rulers welcomed them. Several tried to close coffee houses, fearing that people who gathered there would criticise the government. These bans rarely lasted, because coffee had become too popular and because the taxes it produced were too valuable to lose.",
      "In the seventeenth century coffee reached Europe. In London, coffee houses became known as 'penny universities', since for the price of a cup anyone could listen to discussions of science, politics and business. Some of today's largest companies began as groups of traders who met regularly in particular coffee houses.",
      "Today coffee is grown in more than fifty countries, most of them near the equator. It is one of the most traded farm products in the world, and the income of millions of small farmers depends on its price, which can rise and fall sharply from one year to the next.",
    ],
    headings: ["A drink for long nights", "Attempts to control a new habit", "Places of learning and trade", "A global crop"],
    extra: ["How coffee is roasted", "The health effects of coffee"],
    details: [
      ["entertainment that was available in early coffee houses", "Men met to talk, play games and listen to music."],
      ["a financial reason for allowing coffee houses", "The taxes it produced were too valuable to lose."],
      ["a nickname for coffee houses", "Coffee houses became known as 'penny universities'."],
      ["the unpredictability of farmers' earnings", "Its price, which can rise and fall sharply from one year to the next."],
    ],
  },
  {
    paragraphs: [
      "When a forest burns, it can seem that everything has been destroyed. Yet within weeks, green shoots appear in the black soil. Some plants grow again from roots that survived underground, while others grow from seeds that were lying in the earth, waiting for the right conditions.",
      "Some trees actually depend on fire. Certain pines produce cones that stay tightly closed until they are heated. Only the heat of a fire opens them and releases the seeds, which then fall onto ground that has been cleared of other plants and enriched by ash.",
      "Animals return more slowly. Birds that feed on insects often arrive first, attracted by the insects living in the dead wood. Larger animals follow as the plants they eat grow back, and after ten or twenty years the forest may support more kinds of animal than before the fire.",
      "This does not mean that all fires are good. Fires today are often hotter and more frequent than in the past, partly because of rising temperatures. When fires come too often, young trees have no time to produce seeds, and a forest can be replaced by grassland.",
    ],
    headings: ["Quick signs of new life", "Trees that need fire", "The gradual return of wildlife", "When fire becomes a danger"],
    extra: ["How firefighters work", "The cost of forest fires to farmers"],
    details: [
      ["plants that survive because part of them is below the surface", "Some plants grow again from roots that survived underground."],
      ["a benefit of ash for new plants", "Ground that has been cleared of other plants and enriched by ash."],
      ["the first animals to come back", "Birds that feed on insects often arrive first."],
      ["a possible change from one kind of landscape to another", "A forest can be replaced by grassland."],
    ],
  },
  {
    paragraphs: [
      "In the early twentieth century, most children in the region left school at twelve to work on farms or in factories. Families needed their wages, and few parents saw any point in further education. Only the children of wealthy families went on to secondary school.",
      "This changed when the government made schooling free and required children to attend until the age of fifteen. At first many families resisted, and inspectors had to visit homes to find children who were missing classes. Within a generation, however, attendance was almost complete.",
      "The effects went far beyond reading and writing. Economists have shown that the regions where schooling expanded first later grew faster than the others. Young people with more education moved to better jobs, often in the cities, and sent money home to their families.",
      "Not every result was positive. As young people left for the cities, many villages lost their populations, and some disappeared completely. Those who stayed found it harder to keep schools, shops and doctors in their communities.",
    ],
    headings: ["Work before learning", "A new law and its enforcement", "Economic rewards of education", "An unintended cost"],
    extra: ["Teachers' pay and conditions", "The first universities in the region"],
    details: [
      ["officials who checked whether children were at school", "Inspectors had to visit homes to find children who were missing classes."],
      ["the age at which most children stopped studying", "Most children in the region left school at twelve."],
      ["money sent by young people to their parents", "Sent money home to their families."],
      ["the complete loss of some places", "Some disappeared completely."],
    ],
  },
  {
    paragraphs: [
      "Octopuses are among the most intelligent animals without a backbone. In laboratories they have learned to open jars, find their way through mazes and recognise individual people, sometimes showing a clear dislike of a particular researcher by spraying them with water.",
      "What makes this intelligence surprising is how it is organised. About two thirds of an octopus's nerve cells are not in its brain but in its arms. Each arm can taste, touch and react on its own, so that an arm can continue to search for food even when the brain is occupied with something else.",
      "Their intelligence is also surprising because octopuses live such short lives. Most species live for only one or two years, and they never meet their parents, so they cannot learn from older animals as apes and dolphins do. Everything they know, they must discover for themselves.",
      "Scientists believe that this intelligence developed because the octopus lost its shell. Without protection, it needed to hide, change colour and solve problems quickly to survive among faster and stronger hunters.",
    ],
    headings: [
      "Clever behaviour in the laboratory",
      "A mind spread through the body",
      "Learning without teachers",
      "A possible origin of octopus intelligence",
    ],
    extra: ["How octopuses change colour", "Octopuses as food"],
    details: [
      [
        "an octopus showing that it did not like someone",
        "Showing a clear dislike of a particular researcher by spraying them with water.",
      ],
      [
        "the proportion of nerve cells found outside the brain",
        "About two thirds of an octopus's nerve cells are not in its brain but in its arms.",
      ],
      ["a comparison with other intelligent animals", "They cannot learn from older animals as apes and dolphins do."],
      ["a body part that octopuses no longer have", "This intelligence developed because the octopus lost its shell."],
    ],
  },
  {
    paragraphs: [
      "The idea of the weekend is surprisingly recent. For most of the nineteenth century, factory workers in Europe worked six days a week, often for twelve hours a day, with only Sunday free for rest and religion.",
      "The free Saturday afternoon was won gradually by workers' organisations, which argued that rested workers made fewer mistakes. Some employers agreed, finding that shorter weeks did not reduce what their factories produced. By the 1920s, a free Saturday was common in many industries.",
      "The two-day weekend created new industries of its own. Football matches, cinemas, seaside trips and shopping all grew because millions of people now had free time at the same moment. Leisure became something that could be bought and sold.",
      "Today some companies are testing a four-day week. Early results suggest that employees are happier and no less productive, but critics point out that the system may not suit jobs such as nursing, where someone must always be at work.",
    ],
    headings: ["Long weeks of work", "How Saturday became free", "A business built on free time", "The next step?"],
    extra: ["Religion and the working week", "Why workers preferred longer hours"],
    details: [
      ["the length of a typical working day", "Often for twelve hours a day."],
      ["employers discovering that output did not fall", "Finding that shorter weeks did not reduce what their factories produced."],
      ["the reason why many people could enjoy leisure together", "Millions of people now had free time at the same moment."],
      ["a kind of job that may not suit a new arrangement", "The system may not suit jobs such as nursing."],
    ],
  },
  {
    paragraphs: [
      "For centuries, sailors could find their latitude, their position north or south, by measuring the height of the sun or the stars. Finding longitude, their position east or west, was far harder, and ships were regularly lost because their crews did not know where they were.",
      "In theory the problem had a simple solution. A ship that carried a clock showing the time at its home port could compare it with local noon at sea; every hour of difference meant fifteen degrees of longitude. The difficulty was that no clock could keep accurate time on a moving ship.",
      "In 1714 the British government offered a large prize for a practical method. The winner was not a scientist but a carpenter, John Harrison, who spent more than forty years building a series of clocks that kept time even in storms and changing temperatures.",
      "Harrison was paid only part of the prize at first, because the experts who judged the competition preferred a method based on astronomy. Only after the king himself became involved did he receive most of the money, three years before his death.",
    ],
    headings: ["A dangerous gap in sailors' knowledge", "The principle of measuring by time", "An unexpected winner", "A slow reward"],
    extra: ["How sailors measured the stars", "Shipwrecks and their causes"],
    details: [
      ["a definition of latitude", "Their latitude, their position north or south."],
      ["the link between time and degrees", "Every hour of difference meant fifteen degrees of longitude."],
      ["the length of time one person spent on the problem", "Spent more than forty years building a series of clocks."],
      ["the involvement of a ruler", "Only after the king himself became involved did he receive most of the money."],
    ],
  },
  {
    paragraphs: [
      "Every year, millions of tonnes of food are thrown away before they reach a shop. Fruit that is too small or has an unusual shape is often left in the fields, because supermarkets believe that customers will not buy it.",
      "Further waste happens in the home. Studies in several countries suggest that households throw away between a fifth and a third of the food they buy, much of it because people misunderstand the dates printed on packets and throw away food that is still safe to eat.",
      "Some cities have found ways to reduce this waste. Apps allow restaurants to sell meals cheaply at the end of the day, and community fridges let people leave food they do not need for others to take. In one city, these schemes have cut household food waste by almost a quarter.",
      "Reducing food waste matters for the climate as well as for the cost of living. Food that rots in rubbish tips produces methane, a powerful greenhouse gas, and the water and energy used to grow it are wasted too.",
    ],
    headings: ["Losses on the farm", "Waste in the kitchen", "Local solutions", "An environmental reason to act"],
    extra: ["Why food prices are rising", "The history of supermarkets"],
    details: [
      ["confusion about information on food packaging", "People misunderstand the dates printed on packets."],
      ["the appearance of fruit as a reason for waste", "Fruit that is too small or has an unusual shape is often left in the fields."],
      ["a gas released by wasted food", "Food that rots in rubbish tips produces methane."],
      ["a way for neighbours to share unwanted food", "Community fridges let people leave food they do not need for others to take."],
    ],
  },
];

// An item takes the paragraph of a detail from its place in the list, so the details are put in the order of the
// paragraphs that quote their evidence, which also checks that each paragraph has one.
const sorted: readonly Lettered[] = texts.map((text) => ({
  ...text,
  details: text.paragraphs.map((p) => {
    const found = text.details.find(([, evidence]) => p.toLowerCase().includes(evidence.replace(/\.$/, "").toLowerCase()));
    if (!found) throw new Error(`no detail found for a paragraph of "${text.headings[0]}"`);
    return found;
  }),
}));

const headingQuestion = t(
  "Choose the most suitable heading for the paragraph named below the text.",
  "为短文下方指定的段落选出最合适的标题。",
);

const detailQuestion = t(
  "Which paragraph, **A**, **B**, **C** or **D**, contains the information below the text?",
  "短文下方的信息出现在哪一段：**A**、**B**、**C** 还是 **D**？",
);

/** matchingHeadings is the IELTS topic of matching headings and information to paragraphs. */
export const matchingHeadings: TopicDef = examTopic({
  id: "ielts-matching-headings",
  title: t("Matching Headings and Information", "段落标题与信息匹配"),
  summary: t(
    "IELTS-style matching: choose the heading that sums up a paragraph, and find the paragraph that contains a piece of information.",
    "雅思风格的匹配题：选出概括段落的标题，找出包含某条信息的段落。",
  ),
  strand: "reading",
  prerequisites: ["supporting-details"],
  encompasses: [
    { topic: "main-idea", weight: 0.3 },
    { topic: "supporting-details", weight: 0.2 },
  ],
  xp: 12,
  points: [
    point(
      "matching-headings",
      t("Matching Headings", "段落标题匹配"),
      t(
        "A heading sums up the **main idea** of a whole paragraph. Read the first and last sentences, ask what all the sentences have in common, and then look for the heading that says it in other words.\n\nWrong headings are usually traps of three kinds: one that matches a single detail of the paragraph, one that repeats a word you can see in it, and one that fits another paragraph. There are more headings than paragraphs, so some headings fit nowhere.",
        "标题概括的是整段的**主旨**。先读首句和尾句，想一想所有句子的共同点，再找用别的说法表达这一点的标题。\n\n错误的标题通常是三类陷阱：只对应段落中某一个细节的；重复了段落里看得见的某个词的；适合另一段的。标题比段落多，有些标题哪段都不适合。",
      ),
      solvedChoiceGenerator(headingQuestion, interleave(sorted.map(headingItems))),
    ),
    point(
      "matching-information",
      t("Matching Information", "信息匹配"),
      t(
        "Here the information is a **detail**, not a main idea, and it is written in other words: a reason, an example, a number, a comparison or a definition. Decide what kind of detail you are looking for, then scan each paragraph for it. Do not choose a paragraph just because it shares a word with the information; check that it really says the same thing.",
        "这类题的信息是**细节**而不是主旨，并且换了说法：一个原因、一个例子、一个数字、一个比较或一个定义。先判断要找哪一类细节，再逐段查找。不要因为某段和信息有一个相同的词就选它，要确认它真的表达了同样的意思。",
      ),
      labelGenerator(detailQuestion, ["A", "B", "C", "D"], interleave(sorted.map(detailItems))),
    ),
  ],
});
