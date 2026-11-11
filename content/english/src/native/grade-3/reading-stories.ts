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
    `The story happens ${tale.setting[0]}. Words that name a place, a season or a time of day are the clues to a setting.`,
    `故事发生的时间地点是：${tale.setting[0]}。故事里表示地点、季节或一天中某个时候的词，就是判断背景的线索。`,
  ),
  whyNot: [tale.setting[1], tale.setting[2]].map((w) =>
    fill(
      [
        "No words in the story point to {wrong}; look again at the words that name the place and the time.",
        "故事里没有任何词指向“{wrong}”；再看看表示地点和时间的词。",
      ],
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
      `The problem is the trouble the story must settle: ${tale.problem} The rest of the story is about dealing with it.`,
      `问题是故事必须解决的麻烦：${tale.problem} 故事其余的部分都在讲如何应对它。`,
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
      `The solution is what settles the trouble: ${tale.solution} After it, the problem is over.`,
      `解决办法就是让麻烦结束的那件事：${tale.solution} 这件事之后，问题就不存在了。`,
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
      `At the beginning ${tale.who} is ${from}, and by the end ${to}. Compare what the character does first with what the character does last.`,
      `开头时 ${tale.who} 是 ${from} 的，到结尾变成了 ${to} 的。把角色最开始的做法和最后的做法比一比。`,
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
    `After this event, ${tale.who} acts differently: ${tale.changed} A change in a character comes from something that happens to them.`,
    `这件事之后，${tale.who} 的做法变了：${tale.changed} 角色的变化来自发生在他们身上的事。`,
  ),
  whyNot: tale.details.map(() =>
    t(
      "That is a small detail of the story; it does not make the character feel or act any differently.",
      "这只是故事里的一个小细节，并没有让角色的感受或做法有任何不同。",
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
        `A retelling keeps the events that lead to the problem and its solution, like this one: ${event}`,
        `复述保留那些通向问题和解决办法的事件，比如这一件：${event}`,
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
    `First: ${tale.events[0]} Then: ${tale.events[1]} Last: ${tale.events[2]} Each event leads to the next one.`,
    `首先：${tale.events[0]} 然后：${tale.events[1]} 最后：${tale.events[2]} 每一件事都引出下一件事。`,
  ),
}));

const causedBank: readonly Ask[] = tales.map((tale) => ({
  question: t(`What did this action cause? “${tale.action}”`, `这个行为导致了什么？“${tale.action}”`),
  shown: tale.text,
  right: tale.caused,
  wrong: [tale.details[0], tale.notHappen],
  why: t(
    `Because of the action, the next event happens: ${tale.caused} Ask what happens right after the action and because of it.`,
    `因为这个行为，下一件事发生了：${tale.caused} 问问自己：紧接着这个行为、并且因为它发生了什么？`,
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
    `The real action caused this: ${tale.caused} Without that action, the cause is gone, so most likely: ${tale.ifRight}`,
    `真实的行为导致了：${tale.caused} 没有这个行为，原因就不存在了，所以最可能的是：${tale.ifRight}`,
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
          "The **setting** of a story is where and when it happens. A story does not always say it in one sentence, so look for clues: words for a place (*the oak woods*, *a lighthouse*), a season (*autumn*, *the first snow*) or a time of day (*one foggy night*).\n\nPut the clues together. A choice is right only when the story's own words support both the place and the time.",
          "故事的**背景**是它发生的地点和时间。故事不一定用一句话直接说出来，所以要找线索：表示地点的词（*the oak woods*、*a lighthouse*）、季节（*autumn*、*the first snow*）或一天中的时间（*one foggy night*）。\n\n把这些线索合在一起。只有故事里的词同时支持地点和时间，这个选项才是对的。",
        ),
        askGenerator(settingBank),
      ),
      point(
        "naming-the-problem-and-solution",
        t("Naming the Problem and the Solution", "说出问题和解决办法"),
        t(
          "The **problem** of a story is the trouble the main character must deal with; it usually comes near the beginning. The **solution** is what settles the trouble, near the end.\n\nDo not mix them up with details. A detail, such as the color of a kite, is true in the story but causes no trouble and settles nothing.",
          "故事的**问题**是主角必须应对的麻烦，通常出现在开头附近。**解决办法**是让麻烦结束的事，通常在结尾附近。\n\n不要把它们和细节混淆。细节（比如风筝的颜色）在故事里是真的，但它不带来麻烦，也不解决任何事。",
        ),
        askGenerator(problemBank),
      ),
    ],
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
          "To see how a character changes, compare two moments. At the **beginning**, what does the character do, and what does that show about them? At the **end**, what do they do now?\n\nA selfish squirrel who hides his food and later shares it has changed *from selfish to generous*. Keep the order: the beginning comes first.",
          "要看出角色怎样变化，就比较两个时刻。在**开头**，角色做了什么，这说明他是什么样的？到了**结尾**，他又做了什么？\n\n一只先把食物藏起来、后来却分享食物的松鼠，就是*从自私变得慷慨*。注意顺序：开头放在前面。",
        ),
        askGenerator(changeBank),
      ),
      point(
        "the-event-that-changes-them",
        t("The Event That Changes Them", "改变角色的事件"),
        t(
          "A character changes **because something happens**: they see a friend in trouble, they make a mistake, or someone shows them kindness. Look for the moment just before the character starts to act differently.\n\nSmall details, such as the color of a tail or the name of a street, are true in the story but change nothing.",
          "角色的变化是**因为发生了某件事**：他们看到朋友遇到麻烦，犯了一个错，或者有人对他们表示善意。找到角色开始改变做法之前的那一刻。\n\n小细节（比如尾巴的颜色或街道的名字）在故事里是真的，但不会改变任何事。",
        ),
        askGenerator(changedBank),
      ),
    ],
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
          "A **retelling** tells a story again in a few sentences. It keeps the **key events**: how the problem starts, what the characters do about it, and how it is solved.\n\nTest an event by asking: if I left it out, would the story still make sense? If yes, it is a detail. And never add something the story does not say.",
          "**复述**是用几句话把故事再讲一遍。它保留**关键事件**：问题怎样开始，角色怎样应对，问题怎样解决。\n\n检验一个事件的方法是问自己：如果把它省掉，故事还说得通吗？如果说得通，它就是细节。另外，绝不能加上故事里没有的内容。",
        ),
        askGenerator(keyEventBank),
      ),
      point(
        "ordering-the-key-events",
        t("Putting the Key Events in Order", "给关键事件排序"),
        t(
          "The key events of a story come in order: the **beginning** brings the problem, the **middle** shows what the characters do, and the **end** brings the solution.\n\nEach event leads to the next, so ask which one has to happen first for the others to happen at all.",
          "故事的关键事件是有顺序的：**开头**带来问题，**中间**写角色做了什么，**结尾**带来解决办法。\n\n每件事都引出下一件，所以要问：哪件事必须先发生，其他的事才可能发生？",
        ),
        arrangeGenerator(orderBank),
      ),
    ],
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
          "In a story, one thing leads to another. When a character **acts**, the action causes the next event: Ava pours too much water, so her beans turn yellow.\n\nTo find what an action caused, look at what happens right after it and ask whether it happened **because of** it. A detail that is true anyway was not caused by it.",
          "在故事里，一件事引出另一件事。角色**做了某事**，这个行为就引出下一件事：Ava 浇水太多，所以她的豆子变黄了。\n\n要找出行为导致的结果，就看紧接着发生了什么，并问它是不是**因为**这个行为才发生的。本来就是真的细节，不是它导致的。",
        ),
        askGenerator(causedBank),
      ),
      point(
        "if-they-had-acted-differently",
        t("If They Had Acted Differently", "如果做法不同"),
        t(
          "Because actions cause events, a different action would change the story. To imagine it, find the event the real action caused, then take the action away: that event would most likely not happen.\n\nA good guess follows from the story. A guess that has nothing to do with the action, however exciting, does not.",
          "因为行为会引出事件，不同的行为就会改变故事。想象的方法是：先找到真实行为导致的事件，再把这个行为拿掉——那件事很可能就不会发生了。\n\n好的推测来自故事本身。和这个行为毫无关系的推测，不管多么有趣，都不对。",
        ),
        askGenerator(whatIfBank),
      ),
    ],
  ),
];
