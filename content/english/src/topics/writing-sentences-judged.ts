// Writing: sentences written by the learner and judged by a model for their meaning (W2).

import { type CriterionSpec, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

const limits = { minWords: 6, maxChars: 300 };

const shown = (model: string) => t(`One good sentence:\n\n> ${model}`, `一个好的句子：\n\n> ${model}`);

/** becauseBank asks for a reason that explains a short sentence. */
const becauseBank: readonly WritingItem[] = [
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "Maya wore her raincoat.",
    model: "Maya wore her raincoat because dark clouds were filling the sky.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "The baby started to cry.",
    model: "The baby started to cry because the loud thunder woke him up.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "The store closed early.",
    model: "The store closed early because a storm was coming.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "Leo practiced the piano every evening.",
    model: "Leo practiced the piano every evening because his concert was only a week away.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "The plants on the windowsill grew tall.",
    model: "The plants on the windowsill grew tall because they got sunlight all day.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "We could not play outside at break.",
    model: "We could not play outside at break because the field was covered in mud.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "The bridge was closed to cars.",
    model: "The bridge was closed to cars because workers were repairing a crack.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "Grandpa keeps a flashlight by his bed.",
    model: "Grandpa keeps a flashlight by his bed because the power sometimes goes out at night.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "The dog hid under the bed.",
    model: "The dog hid under the bed because the fireworks outside were so loud.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "Our class cheered.",
    model: "Our class cheered because the principal gave us an extra recess.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "Grandpa put on his reading glasses.",
    model: "Grandpa put on his reading glasses because the letters on the map were tiny.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "The pond froze solid.",
    model: "The pond froze solid because the temperature stayed below zero all week.",
  },
  {
    task: "Expand this sentence with because and a reason of your own.",
    source: "Sofia packed an extra sandwich.",
    model: "Sofia packed an extra sandwich because her friend often forgets his lunch.",
  },
];

/** butBank asks for a contrast or a limit that follows a short sentence. */
const butBank: readonly WritingItem[] = [
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "The test was long.",
    model: "The test was long, but most of the questions were easy.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "Our team played well.",
    model: "Our team played well, but we still lost by one goal.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "The puppy is small.",
    model: "The puppy is small, but he can pull hard on his leash.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "I studied for the spelling quiz.",
    model: "I studied for the spelling quiz, but I forgot how to spell one word.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "The museum was crowded.",
    model: "The museum was crowded, but we still saw the dinosaur bones up close.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "The soup smelled delicious.",
    model: "The soup smelled delicious, but it was far too hot to eat.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "Sara wanted to join the swim team.",
    model: "Sara wanted to join the swim team, but practice was at the same time as her music lessons.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "The old car is slow.",
    model: "The old car is slow, but it has never broken down.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "The puppy was tiny.",
    model: "The puppy was tiny, but it barked louder than any dog on the street.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "We left home early.",
    model: "We left home early, but heavy traffic made us late anyway.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "The soup smelled delicious.",
    model: "The soup smelled delicious, but it was far too salty to eat.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "Ben wanted to play outside.",
    model: "Ben wanted to play outside, but his homework was not finished yet.",
  },
  {
    task: "Expand this sentence with but and a contrast of your own.",
    source: "The old bike was rusty.",
    model: "The old bike was rusty, but it still rode smoothly down the hill.",
  },
];

/** soBank asks for a result that follows from a short sentence. */
const soBank: readonly WritingItem[] = [
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "The road was covered in ice.",
    model: "The road was covered in ice, so the buses drove very slowly.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "Nadia forgot her lunch at home.",
    model: "Nadia forgot her lunch at home, so her friend shared a sandwich with her.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "The library got a hundred new books.",
    model: "The library got a hundred new books, so the librarians built another shelf.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "It had not rained for two months.",
    model: "It had not rained for two months, so the town asked people to save water.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "The power went out during dinner.",
    model: "The power went out during dinner, so we lit candles and ate in the dark.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "Ben missed the last bus.",
    model: "Ben missed the last bus, so he called his mother to pick him up.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "The class wanted to help the animal shelter.",
    model: "The class wanted to help the animal shelter, so they collected old blankets and towels.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "My little sister is afraid of the dark.",
    model: "My little sister is afraid of the dark, so she sleeps with a night light.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "The power went out.",
    model: "The power went out, so we read our books by candlelight.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "Mia forgot her umbrella.",
    model: "Mia forgot her umbrella, so she was soaked by the time she got home.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "The library had a new mystery book.",
    model: "The library had a new mystery book, so I put my name on the waiting list.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "The river rose after the storm.",
    model: "The river rose after the storm, so the park by the bank was closed.",
  },
  {
    task: "Expand this sentence with so and a result of your own.",
    source: "Our team practiced every afternoon.",
    model: "Our team practiced every afternoon, so we were ready for the final game.",
  },
];

/** pairBank asks for two sentences joined into one in any way that keeps their meaning. */
const pairBank: readonly WritingItem[] = [
  {
    task: "Combine these sentences into one sentence. Use any way you have learned, and keep their meaning.",
    source: "The kite rose high into the sky. The wind was strong.",
    model: "Because the wind was strong, the kite rose high into the sky.",
  },
  {
    task: "Combine these sentences into one sentence. Use any way you have learned, and keep their meaning.",
    source: "Mr. Diaz teaches science. He grows tomatoes in the school garden.",
    model: "Mr. Diaz, who teaches science, grows tomatoes in the school garden.",
  },
  {
    task: "Combine these sentences into one sentence. Use any way you have learned, and keep their meaning.",
    source: "The river flooded the fields. The farmers lost their crops.",
    model: "The river flooded the fields, so the farmers lost their crops.",
  },
  {
    task: "Combine these sentences into one sentence. Use any way you have learned, and keep their meaning.",
    source: "Rosa is my cousin. She won the spelling contest.",
    model: "Rosa, my cousin, won the spelling contest.",
  },
  {
    task: "Combine these sentences into one sentence. Use any way you have learned, and keep their meaning.",
    source: "The movie was long. We enjoyed every minute of it.",
    model: "Although the movie was long, we enjoyed every minute of it.",
  },
  {
    task: "Combine these sentences into one sentence. Use any way you have learned, and keep their meaning.",
    source: "The bakery opens at six. It sells fresh bread.",
    model: "The bakery, which opens at six, sells fresh bread.",
  },
  {
    task: "Combine these sentences into one sentence. Use any way you have learned, and keep their meaning.",
    source: "We waited for the rain to stop. Then we walked home.",
    model: "After the rain stopped, we walked home.",
  },
  {
    task: "Combine these sentences into one sentence. Use any way you have learned, and keep their meaning.",
    source: "The museum has a whale skeleton. The skeleton hangs from the ceiling.",
    model: "The museum has a whale skeleton that hangs from the ceiling.",
  },
];

/** setBank asks for three or more short sentences folded into one. */
const setBank: readonly WritingItem[] = [
  {
    task: "Combine these sentences into one sentence that keeps all of their meaning.",
    source: "The dog barked. The dog was brown. It barked at the mail carrier.",
    model: "The brown dog barked at the mail carrier.",
  },
  {
    task: "Combine these sentences into one sentence that keeps all of their meaning.",
    source: "Ms. Patel is our principal. She rang the bell. She rang it at noon.",
    model: "Ms. Patel, our principal, rang the bell at noon.",
  },
  {
    task: "Combine these sentences into one sentence that keeps all of their meaning.",
    source: "The bus was late. It was snowing. We missed the first class.",
    model: "Because it was snowing, the bus was late, and we missed the first class.",
  },
  {
    task: "Combine these sentences into one sentence that keeps all of their meaning.",
    source: "Tom found a wallet. The wallet was on the sidewalk. He took it to the police station.",
    model: "Tom found a wallet on the sidewalk and took it to the police station.",
  },
  {
    task: "Combine these sentences into one sentence that keeps all of their meaning.",
    source: "The lake freezes in winter. People skate on it. The lake is near our house.",
    model: "People skate on the lake near our house when it freezes in winter.",
  },
  {
    task: "Combine these sentences into one sentence that keeps all of their meaning.",
    source: "Ana painted a picture. The picture showed the sea. She gave it to her grandmother.",
    model: "Ana painted a picture of the sea and gave it to her grandmother.",
  },
  {
    task: "Combine these sentences into one sentence that keeps all of their meaning.",
    source: "The owl hunts at night. It has very good eyesight. It flies without a sound.",
    model: "The owl, which has very good eyesight, flies without a sound when it hunts at night.",
  },
  {
    task: "Combine these sentences into one sentence that keeps all of their meaning.",
    source: "The game was cancelled. The field was flooded. The players went home.",
    model: "The game was cancelled because the field was flooded, so the players went home.",
  },
];

const combineCriteria = ["w2-keeps-meaning", "w2-one-sentence"];

/**
 * judgedSentenceTopics are the sentences a learner writes in their own words,
 * judged by a model for what they mean. A learner for whom no route qualifies does not get them.
 */
export const judgedSentenceTopics: readonly TopicDef[] = [
  {
    id: "expanding-ideas-in-your-own-words",
    title: t("Expanding Ideas in Your Own Words", "用自己的话扩展想法"),
    summary: t(
      "Finish sentences with a reason, a contrast or a result of your own, after because, but or so.",
      "在 because、but 或 so 之后，自己写出原因、转折或结果。",
    ),
    prerequisites: ["expanding-with-because-but-so"],
    encompasses: [{ topic: "expanding-with-because-but-so", weight: 0.5 }],
    xp: 12,
    criteria: ["w2-because-reason", "w2-but-contrast", "w2-so-result"].map(criterion),
    knowledgePoints: [
      point(
        "a-reason-after-because",
        t("A Reason after Because", "because 之后给出原因"),
        t(
          "After *because*, write something that really explains the first part. Ask yourself: *why* did it happen? *The dog barked because it heard a knock at the door* explains the barking. *The dog barked because it is brown* does not: being brown is no reason to bark.",
          "在 *because* 之后，写出真正能解释前半句的内容。问问自己：它*为什么*会发生？*The dog barked because it heard a knock at the door* 解释了狗为什么叫。*The dog barked because it is brown* 则不能：毛是棕色的并不是狗叫的理由。",
        ),
        writingGenerator(t("Write one sentence in English.", "用英语写一个句子。"), becauseBank, ["w2-because-reason"], limits, shown),
      ),
      point(
        "a-contrast-after-but",
        t("A Contrast after But", "but 之后给出转折"),
        t(
          "After *but*, write something that goes against what the first part leads the reader to expect, or that limits it. *The hill was steep, but we reached the top* surprises the reader. *The hill was steep, but it was tall* does not contrast: both parts point the same way.\n\nPut a comma before *but* when it joins two complete sentences.",
          "在 *but* 之后，写出与前半句让读者预期的相反、或对它加以限制的内容。*The hill was steep, but we reached the top* 出乎读者意料。*The hill was steep, but it was tall* 没有转折：两部分指向同一个方向。\n\n*but* 连接两个完整句子时，前面加逗号。",
        ),
        writingGenerator(t("Write one sentence in English.", "用英语写一个句子。"), butBank, ["w2-but-contrast"], limits, shown),
      ),
      point(
        "a-result-after-so",
        t("A Result after So", "so 之后给出结果"),
        t(
          "After *so*, write what happened *because of* the first part. *The milk was sour, so we poured it out* gives a result. *The milk was sour, so it was old* gives a reason instead, and a reason belongs after *because*.\n\nPut a comma before *so* when it joins two complete sentences.",
          "在 *so* 之后，写出*因为*前半句而发生的事。*The milk was sour, so we poured it out* 给出了结果。*The milk was sour, so it was old* 给出的却是原因，而原因应该放在 *because* 之后。\n\n*so* 连接两个完整句子时，前面加逗号。",
        ),
        writingGenerator(t("Write one sentence in English.", "用英语写一个句子。"), soBank, ["w2-so-result"], limits, shown),
      ),
    ],
  },
  {
    id: "combining-sentences-in-your-own-words",
    title: t("Combining Sentences in Your Own Words", "用自己的方式合并句子"),
    summary: t(
      "Choose a way to join short sentences into one, and keep everything they mean.",
      "自己选择方法把几个短句合成一句，并保留它们的全部意思。",
    ),
    prerequisites: ["combining-with-appositives"],
    encompasses: [
      { topic: "combining-with-conjunctions", weight: 0.3 },
      { topic: "combining-with-relative-clauses", weight: 0.3 },
      { topic: "combining-with-appositives", weight: 0.2 },
    ],
    xp: 12,
    criteria: combineCriteria.map(criterion),
    knowledgePoints: [
      point(
        "choosing-a-way-to-combine",
        t("Choosing a Way to Combine", "选择合并的方法"),
        t(
          "You know several ways to join two sentences: a conjunction such as *so*, *because* or *although*; a clause with *who*, *which* or *that*; or an appositive. Choose the one that shows how the ideas relate.\n\n*The wind was strong. The kite rose high* shows a cause, so *because* fits: *Because the wind was strong, the kite rose high.* *Mr. Diaz teaches science. He grows tomatoes* adds information about a person, so a clause fits: *Mr. Diaz, who teaches science, grows tomatoes.*\n\nCheck your sentence: nothing important is lost, and nothing new is added.",
          "你已经会几种连接两个句子的方法：用 *so*、*because*、*although* 这样的连词；用 *who*、*which*、*that* 引导的从句；或者用同位语。选择最能表明两个意思之间关系的那一种。\n\n*The wind was strong. The kite rose high* 表示因果，所以用 *because*：*Because the wind was strong, the kite rose high.* *Mr. Diaz teaches science. He grows tomatoes* 是补充关于一个人的信息，所以用从句：*Mr. Diaz, who teaches science, grows tomatoes.*\n\n检查你的句子：没有丢掉重要的内容，也没有加入新的内容。",
        ),
        writingGenerator(t("Write one sentence in English.", "用英语写一个句子。"), pairBank, combineCriteria, limits, (model) =>
          t(
            `One good sentence:\n\n> ${model}\n\nOther ways can be just as good, as long as the meaning stays the same.`,
            `一个好的句子：\n\n> ${model}\n\n只要意思不变，其他写法也同样可以。`,
          ),
        ),
      ),
      point(
        "folding-several-sentences",
        t("Folding Several Sentences into One", "把几个句子压缩成一句"),
        t(
          "When three short sentences talk about the same thing, the repeated words can go. Keep the main sentence, and fold the others into it as a describing word, a phrase or a clause.\n\n*The cat slept. The cat was gray. It slept on the porch* becomes *The gray cat slept on the porch.* Every fact is still there: the cat, its color, and where it slept.",
          "三个短句说的是同一件事时，重复的词可以去掉。保留主要的句子，把其他句子压缩成一个修饰词、一个短语或一个从句放进去。\n\n*The cat slept. The cat was gray. It slept on the porch* 变成 *The gray cat slept on the porch.* 每个事实都还在：猫、它的颜色，以及它睡在哪里。",
        ),
        writingGenerator(t("Write one sentence in English.", "用英语写一个句子。"), setBank, combineCriteria, limits, (model) =>
          t(
            `One good sentence:\n\n> ${model}\n\nOther ways can be just as good, as long as every fact is kept.`,
            `一个好的句子：\n\n> ${model}\n\n只要保留了每个事实，其他写法也同样可以。`,
          ),
        ),
      ),
    ],
  },
];
