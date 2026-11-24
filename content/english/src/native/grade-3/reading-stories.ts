// Grade 3: reading skills for stories, served from the short tales of tales.ts: the setting, problem and solution, how
// a character changes, the key events of a retelling, and how one action moves the plot.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { type Arrange, type Ask, arrangeGenerator, askGenerator, fill, topic } from "./kit.ts";
import { tales } from "./tales.ts";

const settingBank: readonly Ask[] = tales.map((tale) => ({
  question: t("Where and when does this story happen?", "这个故事发生在什么地方、什么时候？"),
  shown: tale.text,
  right: tale.setting[0],
  wrong: [tale.setting[1], tale.setting[2]],
  why: t(
    `The story takes place **${tale.setting[0]}**.\n\n**Check.** Point to both clues in the story—one for *where* and one for *when*: both match **${tale.setting[0]}**, while neither wrong choice fits the text.`,
    `故事发生的背景是 **${tale.setting[0]}**。\n\n**检验。** 在文中分别找出表示“在哪里”和“在什么时候”的线索词：两项都对上 **${tale.setting[0]}**，而另外两个选项在文中找不到依据。`,
  ),
  whyNot: [tale.setting[1], tale.setting[2]].map((w, idx) =>
    fill(
      idx === 0
        ? [
            "No words in the story point to {wrong}; check both the place and time clues.",
            "故事里没有任何词指向“{wrong}”；再核对地点和时间线索。",
          ]
        : ["The story's place and time words do not match {wrong}.", "故事里的地点和时间词都和“{wrong}”不符。"],
      w,
      tale.setting[0],
    ),
  ),
}));

const problemBank: readonly Ask[] = tales.flatMap((tale): Ask[] => [
  {
    question: t("What is the problem in this story?", "这个故事里的问题是什么？"),
    shown: tale.text,
    right: tale.problem,
    wrong: [tale.solution, tale.detail],
    why: t(
      `The problem is: *${tale.problem}*\n\n**Check.** Ask *what trouble drives the rest of the story?* Everything the character does next happens to fix *${tale.problem}*`,
      `故事的问题是：*${tale.problem}*\n\n**检验。** 问自己：*是什么麻烦推动了后面的情节？* 角色接下来做的一切都是为了解决 *${tale.problem}*`,
    ),
    whyNot: [
      t("That is how the problem is solved near the end, not the problem itself.", "这是故事结尾时问题被解决的方式，不是问题本身。"),
      t(
        "That is a small detail of the story; it causes no trouble that the story must settle.",
        "这只是故事里的一个小细节，并没有带来故事必须解决的麻烦。",
      ),
    ],
  },
  {
    question: t("How is the problem in this story solved?", "这个故事里的问题是怎样解决的？"),
    shown: tale.text,
    right: tale.solution,
    wrong: [tale.problem, tale.notSolution],
    why: t(
      `The solution is: *${tale.solution}*\n\n**Check.** Compare the opening trouble with the ending: once *${tale.solution}* happens, the problem is truly over.`,
      `解决办法是：*${tale.solution}*\n\n**检验。** 对照开头的麻烦和结尾：发生 *${tale.solution}* 之后，原本的麻烦就彻底解除了。`,
    ),
    whyNot: [
      t("That is the problem itself, the trouble at the start, not how it ends.", "这是问题本身，是开头的麻烦，而不是它怎样结束。"),
      t(
        "That happens in the story, but it does not settle the problem; the trouble is still there after it.",
        "这件事在故事里发生了，但它没有解决问题；它之后麻烦还在。",
      ),
    ],
  },
]);

const changeBank: readonly Ask[] = tales.map((tale) => {
  const [from, to, other] = tale.change;
  const right = `from ${from} to ${to}`;
  return {
    question: t(`How does ${tale.who} change from the beginning of the story to the end?`, `${tale.who} 从故事开头到结尾有什么变化？`),
    shown: tale.text,
    right,
    wrong: [`from ${to} to ${from}`, `from ${from} to ${other}`],
    why: t(
      `${tale.who} changes **${right}**.\n\n**Check.** Compare the first scene with the final scene: at the start ${tale.who} acts *${from}*, and by the end ${tale.who} acts *${to}*—in that exact order.`,
      `${tale.who} 的变化是 **${right}**。\n\n**检验。** 对比开头和结尾：开头时 ${tale.who} 表现得 *${from}*，结尾时变成 *${to}*，先后顺序不能颠倒。`,
    ),
    whyNot: [
      t("That turns the change around: it puts the end of the story first.", "这把变化说反了：它把故事的结尾放到了开头。"),
      t(
        `The beginning is right, but nothing at the end of the story shows ${tale.who} being ${other}.`,
        `开头说对了，但故事结尾没有任何地方表现出 ${tale.who} 是 ${other} 的。`,
      ),
    ],
  };
});

const changedBank: readonly Ask[] = tales.map((tale) => ({
  question: t(`Which event changes how ${tale.who} feels or acts?`, `哪件事改变了 ${tale.who} 的感受或做法？`),
  shown: tale.text,
  right: tale.changed,
  wrong: [...tale.details],
  why: t(
    `This turning point changes ${tale.who}: *${tale.changed}*\n\n**Check.** Look right before and right after *${tale.changed}* in the story: ${tale.who} acts one way before it and a new way after it.`,
    `这个转折点改变了 ${tale.who}：*${tale.changed}*\n\n**检验。** 对比 *${tale.changed}* 发生前后：在这之前和之后，${tale.who} 的做法截然不同。`,
  ),
  whyNot: tale.details.map((_, idx) =>
    idx === 0
      ? t("That is a background detail; it does not make the character act any differently.", "这只是一个背景细节，并没有让角色改变做法。")
      : t(
          "That detail is true in the story, but it is not the turning point that changes the character.",
          "这个细节在文中虽有出现，但不是改变角色的转折事件。",
        ),
  ),
}));

const keyEventBank: readonly Ask[] = tales.flatMap((tale) =>
  tale.events.map(
    (event, i): Ask => ({
      question: t("Which of these belongs in a short retelling of the story?", "下面哪一项应该写进这个故事的简短复述？"),
      shown: tale.text,
      right: event,
      wrong: [tale.details[i % 2] ?? "", tale.notHappen],
      why: t(
        `A short retelling keeps key plot events like: *${event}*\n\n**Check.** Try leaving *${event}* out of the story: the problem or its solution would stop making sense, proving it is a key event.`,
        `简短复述要保留关键情节，比如：*${event}*\n\n**检验。** 试着把 *${event}* 从故事里拿掉：问题或解决办法就会接不上，说明它是关键事件。`,
      ),
      whyNot: [
        t(
          "That is a small detail; the problem and its solution do not depend on it, so a retelling leaves it out.",
          "这只是一个小细节，问题和解决办法都不取决于它，所以复述时可以省略。",
        ),
        t("That does not happen in the story at all, so a retelling cannot include it.", "故事里根本没有发生这件事，所以复述不能写进去。"),
      ],
    }),
  ),
);

const orderBank: readonly Arrange[] = tales.map((tale) => ({
  question: t("Put the key events of the story in the order they happen.", "把故事中的关键事件按发生的顺序排列。"),
  shown: tale.text,
  steps: tale.events,
  why: t(
    `In order: (1) ${tale.events[0]} (2) ${tale.events[1]} (3) ${tale.events[2]}\n\n**Check.** Trace cause and effect from 1 to 3: step 1 sets up step 2, and step 2 makes step 3 possible.`,
    `正确顺序：（1）${tale.events[0]}（2）${tale.events[1]}（3）${tale.events[2]}\n\n**检验。** 从 1 到 3 顺一遍因果：第 1 步引出第 2 步，第 2 步才能接上第 3 步。`,
  ),
}));

const causedBank: readonly Ask[] = tales.map((tale) => ({
  question: t(`What did this action cause? “${tale.action}”`, `这个行为导致了什么？“${tale.action}”`),
  shown: tale.text,
  right: tale.caused,
  wrong: [tale.details[0], tale.notHappen],
  why: t(
    `That action caused: *${tale.caused}*\n\n**Check.** Connect the action and result with *because*: *${tale.caused}* happened specifically because of “${tale.action}”`,
    `这个行为导致的结果是：*${tale.caused}*\n\n**检验。** 用“因为……所以……”连起来验证：正是因为“${tale.action}”，才发生了 *${tale.caused}*`,
  ),
  whyNot: [
    t(
      "That is in the story, but the action did not cause it; it is a detail that is true anyway.",
      "这件事在故事里，但不是这个行为导致的；不管有没有这个行为它都是真的。",
    ),
    t("That never happens in the story, so the action could not have caused it.", "故事里从来没有发生这件事，所以这个行为不可能导致它。"),
  ],
}));

const whatIfBank: readonly Ask[] = tales.map((tale) => ({
  question: t(`What would most likely have happened if ${tale.alt}?`, `如果 ${tale.alt}，最可能会发生什么？`),
  shown: tale.text,
  right: tale.ifRight,
  wrong: [tale.caused, tale.ifOdd],
  why: t(
    `Most likely: *${tale.ifRight}*\n\n**Check.** In the real story, the character's action caused *${tale.caused}* Removing that cause removes its effect, pointing logically to *${tale.ifRight}*`,
    `最可能发生的是：*${tale.ifRight}*\n\n**检验。** 原故事里角色的行为导致了 *${tale.caused}*；改变那个原因后，原本的结果不再成立，顺理成章会变成 *${tale.ifRight}*`,
  ),
  whyNot: [
    t(
      "That is what really happened because of the character's action; acting differently would not have led to it.",
      "这是因为角色的真实行为才发生的事；如果做法不同，就不会导致它。",
    ),
    t(
      "Nothing in the story links that to the character's choice, so it does not follow from acting differently.",
      "故事里没有任何内容把它和角色的选择联系起来，所以它不会因为做法不同而发生。",
    ),
  ],
}));

/** storyTopics are the reading topics of grade 3 built on its short tales. */
export const storyTopics: readonly TopicDef[] = [
  topic(
    "setting-problem-and-solution",
    t("Setting, Problem and Solution", "背景、问题和解决办法"),
    t(
      "Where and when a story happens, what problem its main character faces, and how the problem is solved.",
      "故事在哪里、什么时候发生，主角遇到了什么问题，问题又是怎样解决的。",
    ),
    ["characters"],
    [
      point(
        "finding-the-setting",
        t("Finding the Setting", "找出故事背景"),
        t(
          "The **setting** tells where and when a story happens. Combine place clues (*the oak woods*, *a lighthouse*) with time clues (*autumn*, *one foggy night*).\n\n> **Watch out.** Check that the story's own words support *both* the place and the time in your answer.",
          "故事的**背景**包括地点和时间。把地点线索（*the oak woods*、*a lighthouse*）和时间线索（*autumn*、*one foggy night*）合起来看。\n\n> **注意。** 选项里的地点和时间两项都必须在文中找得到依据。",
        ),
        askGenerator(settingBank),
      ),
      point(
        "naming-the-problem-and-solution",
        t("Naming the Problem and the Solution", "说出问题和解决办法"),
        t(
          "The **problem** is the trouble the main character must overcome (usually near the start); the **solution** is what settles it (near the end).\n\n> **Watch out.** Do not pick a harmless detail (like the color of a kite) as a problem or a solution.",
          "**问题**是主角必须解决的麻烦（常在开头附近）；**解决办法**是化解麻烦的事（常在结尾附近）。\n\n> **注意。** 不要把无关痛痒的细节（比如风筝的颜色）错当成问题或解决办法。",
        ),
        askGenerator(problemBank),
      ),
    ],
    14,
    t(
      "Almost every great story shares the same skeleton: a place and time (the setting), a trouble that gets things moving (the problem), and a way out (the solution). Let's spot all three in short tales.",
      "几乎每个好故事都有同样的骨架：发生的时间地点（背景）、推动故事的麻烦（问题）以及化解麻烦的办法（解决办法）。这节课我们在短故事里把它们一一找出来。",
    ),
  ),
  topic(
    "character-change",
    t("How Characters Change", "角色如何变化"),
    t(
      "A main character often feels or thinks differently at the end of a story because of what happened.",
      "因为发生的事，主角在故事结尾时的感受或想法常常和开头不同。",
    ),
    ["characters"],
    [
      point(
        "from-beginning-to-end",
        t("From the Beginning to the End", "从开头到结尾"),
        t(
          "Compare what a character does at the **beginning** with what they do at the **end**: a squirrel who hides food first and shares it later changes *from selfish to generous*.\n\n> **Watch out.** Keep the direction right—the beginning trait comes first, and the ending trait comes second.",
          "对比角色在**开头**和**结尾**的做法：先把食物藏起来、后来主动分享的松鼠，是*从自私变得慷慨*。\n\n> **注意。** 别把方向说反——开头的样子在前，结尾的样子在后。",
        ),
        askGenerator(changeBank),
      ),
      point(
        "the-event-that-changes-them",
        t("The Event That Changes Them", "改变角色的事件"),
        t(
          "Characters change **because of an event**—a mistake, a kindness, or a friend in trouble. Look for the turning point right before the character starts acting differently.\n\n> **Watch out.** A true detail from the story is not the turning point unless the character's behavior shifts right after it.",
          "角色之所以变化，是**因为经历了某件事**（犯错、受助或看见朋友遇险）。找到角色开始转变之前的那一个转折点。\n\n> **注意。** 文中真实的小细节如果没有引发角色转变，就不是转折事件。",
        ),
        askGenerator(changedBank),
      ),
    ],
    14,
    t(
      "In a good story, the main character at the last page is not quite the same person as on page one. Tracking what they do first, what happens in the middle, and what they do last shows how—and why—they grew.",
      "在好故事里，最后一页的主角往往和第一页不一样了。对比他们开头、中间和结尾的做法，就能看清他们如何成长、为何改变。",
    ),
  ),
  topic(
    "retelling-key-events",
    t("Retelling the Key Events", "复述关键事件"),
    t(
      "A retelling keeps the events that matter to the problem and its solution and leaves out small details.",
      "复述保留与问题和解决办法有关的事件，省略小细节。",
    ),
    ["sequence-in-texts", "setting-problem-and-solution"],
    [
      point(
        "choosing-the-key-events",
        t("Choosing the Key Events", "选择关键事件"),
        t(
          "A short **retelling** keeps only the **key events**: how the problem begins, what the characters do about it, and how it is solved. Ask: *If I cut this out, would the story break?*\n\n> **Watch out.** Leave out minor details that do not affect the plot, and never invent events not in the story.",
          "简短**复述**只保留**关键事件**：麻烦怎么起、角色怎么做、最后怎么解决。问一问：*删掉这件事，故事还连得上吗？*\n\n> **注意。** 不影响情节的小细节要删掉，更不能编造原文没发生的事。",
        ),
        askGenerator(keyEventBank),
      ),
      point(
        "ordering-the-key-events",
        t("Putting the Key Events in Order", "给关键事件排序"),
        t(
          "Put key events in cause-and-effect order: the problem comes first, the action in the middle, and the solution last.\n\n> **Watch out.** Check whether each event could even happen without the one placed before it.",
          "按因果顺序排列关键事件：问题在先、行动居中、解决办法在后。\n\n> **注意。** 核对每件事是不是必须等前面那件事发生后才能发生。",
        ),
        arrangeGenerator(orderBank),
      ),
    ],
    14,
    t(
      "If a friend asks you to tell them a story in thirty seconds, you cannot repeat every single sentence—you pick the key events and tell them in order. Let's practice separating key events from small details.",
      "如果朋友让你用三十秒讲完一个故事，你没法把每句话都背出来，只能挑出关键事件并按顺序讲清。这节课我们练习把关键事件和小细节分开。",
    ),
  ),
  topic(
    "how-actions-move-the-plot",
    t("How Actions Move the Plot", "行为如何推动情节"),
    t("What a character does causes the next event of a story.", "角色的所作所为会引出故事的下一件事。"),
    ["characters", "sequence-in-texts"],
    [
      point(
        "what-an-action-causes",
        t("What an Action Causes", "行为导致的结果"),
        t(
          "Characters drive the plot by what they do: *Ava pours too much water, so her beans turn yellow.* Look at what happens right after the action and *because* of it.\n\n> **Watch out.** A detail that was already true before the action was not caused by it.",
          "角色的行为推动情节往前走：*Ava 浇水太多，所以豆子发黄了。* 找出紧随该行为、且*因为*它才发生的结果。\n\n> **注意。** 在这个行为之前就已经成立的细节，不是它导致的结果。",
        ),
        askGenerator(causedBank),
      ),
      point(
        "if-they-had-acted-differently",
        t("If They Had Acted Differently", "如果做法不同"),
        t(
          "When you change a character's choice, the result changes too: first spot what the real action caused, then ask what would logically happen without that cause.\n\n> **Watch out.** Stay grounded in the story's own clues—skip wild guesses that have no link to the character's action.",
          "改变角色的选择，后果也会跟着变：先找出原行为导致的结果，再推想换一种做法后会顺理成章发生什么。\n\n> **注意。** 推想必须紧扣原文线索，不要选和角色选择毫无关系的离奇猜测。",
        ),
        askGenerator(whatIfBank),
      ),
    ],
    14,
    t(
      "Stories move like dominoes: one choice a character makes tips over the next event. Seeing how actions cause outcomes also lets you predict how the whole story would change if a character chose differently.",
      "故事像多米诺骨牌：角色的一个选择会推倒下一件事。看懂行为如何引出结果，还能帮你推想“如果换一种做法会怎样”。",
    ),
  ),
];
