// What the grammar words of the levels do (docs/chinese-curriculum.md §8.4), for the reasons of grammar-reasons.ts: the
// words the wrong options most often put for the right ones. Each note is what the word does in any sentence, in a few
// plain words, so that it can follow the word in a reason: 没 “says that something did not happen”.
//
// A line a word: `word | class | what it does in English | what it does in Chinese`. The class says where the word
// stands in a sentence, for the reasons of word order (see WordClass).

import { type Text, t } from "@ga/content";

import { lines } from "../grammar/drill.ts";

/** USAGE are the notes, a line each. */
const USAGE = `
  不 | neg | says not, about what is so or what someone does or will do | 否定现在、将来或经常的事，也用在“是、会”和形容词前面
  没 | neg | says that something did not happen, or goes before 有 | 说事情没有发生，或者用在“有”前面
  没有 | neg | says that something did not happen, or that someone does not have something | 说事情没有发生，或者说不具有
  别 | neg | tells someone not to do something | 叫人不要做某事
  不要 | neg | tells someone not to do something | 叫人不要做某事
  了 | aspect | shows that something has happened or has changed | 表示动作完成或情况有了变化
  着 | aspect | shows that an action or a state goes on | 表示动作或状态在持续
  过 | aspect | shows that something happened at some time before | 表示曾经有过某种经历
  的 | struct | joins a describing word or an owner to a noun | 连接修饰的词或领有者和后面的名词
  地 | struct | joins a describing word to a verb, telling how it is done | 连接修饰的词和后面的动词，说明怎样做
  得 | struct | joins a verb to how well or how much it is done | 连接动词和后面说明程度、结果的部分
  吗 | end | ends a yes-or-no question | 用在句末，表示是不是、对不对的疑问
  呢 | end | ends a question that has a question word or a choice, or asks about another one: 你呢 | 用在有疑问词或选择的问句末尾，或者接着问另一个人或事物：你呢
  吧 | end | ends a suggestion, or a guess that asks for agreement | 用在句末，表示建议或推测
  是 | verb | links two nouns: A is B | 连接两个名词，说明“A就是B”
  很 | adv | goes before an adjective | 用在形容词前面
  有 | verb | says someone has something, or something is somewhere | 说具有某物，或者某处存在某物
  在 | prep | says where someone or something is, or that an action is going on | 说人或事物所在的地方，或者动作正在进行
  就 | adv | says something happens early, soon or easily | 说事情发生得早、快或者容易
  才 | adv | says something happens late, or only after something else | 说事情发生得晚，或者在别的事以后才发生
  都 | adv | says that all of the things before it are included | 总括它前面说到的全部
  也 | adv | says the same is true of another one | 说另一个人或事物也是这样
  还 | adv | says something goes on or is added | 说动作还在继续，或者还有补充
  再 | adv | says something will happen again or later | 说动作将要重复，或者在以后发生
  又 | adv | says something happened again | 说动作已经又发生了一次
  被 | prep | marks who does the action to the subject | 引出对主语做动作的人
  把 | prep | brings the thing acted on before the verb | 把动作的对象提到动词前面
  结果 | conj | opens the part that tells how things turned out | 引出事情最后的结果
  早点儿 | adv | says a bit earlier | 表示早一些
  让 | verb | says someone makes or lets another do something | 说使别人做某事或允许别人做某事
  给 | prep | marks the person who receives something | 引出接受东西的人
  对 | prep | marks who or what an action or a feeling is aimed at | 引出动作、态度所对着的人或事
  跟 | prep | means “with” | 表示“和……一起”
  和 | conj | joins two nouns: A and B | 连接两个名词
  从 | prep | marks where or when something starts | 说起点：从什么地方、从什么时候
  到 | prep | marks where or when something ends | 说终点：到什么地方、到什么时候
  往 | prep | marks the direction of a movement | 说动作的方向
  向 | prep | marks the direction of a movement or the person an action is aimed at | 说动作的方向或对象
  离 | prep | marks the place a distance is measured from | 说距离从哪里算起
  比 | prep | compares two things: A 比 B … | 比较两种事物：A比B……
  像 | prep | says one thing is like another | 说一种事物和另一种相像
  于 | prep | marks the place, time or thing in formal writing | 书面语，引出处所、时间或对象
  为 | prep | marks the person or purpose something is done for | 引出受益的人或目的
  为了 | prep | gives the purpose of an action | 说做事的目的
  因为 | conj | gives the reason | 说原因
  所以 | conj | gives the result | 说结果
  因此 | conj | gives the result, in a formal tone | 说结果，语气比较正式
  于是 | conj | says what happened next because of it | 说接着因此发生的事
  但是 | conj | turns to something unexpected | 表示转折，引出意外的情况
  可是 | conj | turns to something unexpected | 表示转折，引出意外的情况
  但 | conj | turns to something unexpected | 表示转折，引出意外的情况
  却 | adv | goes after the subject and turns to something unexpected | 用在主语后面，表示转折
  而 | conj | joins two parts, adding or contrasting | 连接两个部分，表示并列或转折
  而且 | conj | adds a further point | 表示更进一层
  并且 | conj | adds a further point | 表示更进一层
  虽然 | conj | grants a fact before a 但是 | 先承认一个事实，后面常有“但是”
  反而 | adv | says the result is the opposite of what one expects | 说结果和预想的相反
  还是 | conj | asks someone to choose, in a question | 用在问句里，让人从几项里选一项
  或者 | conj | lists choices in a statement | 用在陈述句里，列出几种可能
  然后 | conj | says what comes next | 说接下来做的事
  如果 | conj | sets a condition: if | 提出假设的条件
  要是 | conj | sets a condition: if | 提出假设的条件
  只要 | conj | sets a condition that is enough, with 就 | 提出足够的条件，后面常用“就”
  只有 | conj | sets the one condition needed, with 才 | 提出唯一的条件，后面常用“才”
  已经 | adv | says something has already happened | 说事情已经发生
  正在 | adv | says an action is going on now | 说动作正在进行
  马上 | adv | says something will happen very soon | 说事情很快就要发生
  常常 | adv | says something happens often | 说事情经常发生
  太 | adv | says too much, often with 了 at the end | 表示程度过头，句末常有“了”
  最 | adv | marks the most of all | 表示程度最高
  更 | adv | says even more | 表示程度更进一层
  非常 | adv | says very, more strongly than 很 | 表示程度很高，比“很”更强
  极了 | other | goes after an adjective and says extremely | 用在形容词后面，表示程度极高
  多 | other | asks how much, or says many | 问程度、数量，或者表示数量大
  几 | number | asks for a small number, before a measure word | 问十以内的数目，后面接量词
  多少 | number | asks for a number of any size | 问数量，大小都可以
  两 | number | counts two, before a measure word | 用在量词前面，表示数目二
  二 | number | is the number two, used in counting and in numbers | 用在数数和数字里，表示数目二
  一 | number | is the number one | 表示数目一
  一下 | other | goes after a verb and says doing it briefly, or trying it | 用在动词后面，表示做一次、试一试
  个 | measure | counts people and most things | 是量词，用于人和大多数事物
  张 | measure | counts flat things, such as paper, tables and beds | 是量词，用于纸、桌子、床等平面的东西
  件 | measure | counts clothes on the upper body and matters | 是量词，用于上衣和事情
  条 | measure | counts long, narrow things, such as roads, rivers and fish | 是量词，用于路、河、鱼等长条的东西
  本 | measure | counts books | 是量词，用于书本
  次 | measure | counts how many times something happens | 是量词，说动作发生的次数
  双 | measure | counts things that come in pairs | 是量词，用于成对的东西
  谁 | question | asks about a person | 问人
  什么 | question | asks about a thing | 问事物
  哪 | question | asks which one | 问哪一个
  哪儿 | question | asks where | 问地方
  哪里 | question | asks where | 问地方
  怎么 | question | asks how, or why | 问方式或原因
  怎么样 | question | asks what something is like | 问情况怎样
  这 | pointer | points to something near | 指近处的人或事物
  那 | pointer | points to something far away | 指远处的人或事物
  这么 | adv | says so, to this degree, or in this way | 表示程度或方式，像这样
  那么 | adv | says so, to that degree, or in that way | 表示程度或方式，像那样
  叫 | verb | gives a name, or tells someone to do something | 说名称，或者叫人做某事
  会 | modal | says someone can do something learned, or that something will happen | 说学会了能做，或者将来可能发生
  能 | modal | says someone is able to, or is allowed to | 说有能力做，或者条件允许
  要 | modal | says someone wants to or must, or that something will soon happen | 说想要、必须，或者将要发生
  想 | modal | says someone wants to, or thinks | 说打算、希望，或者思考
  来 | dir | says a movement comes toward the speaker | 说动作朝着说话人的方向
  去 | dir | says a movement goes away from the speaker | 说动作离开说话人的方向
  上 | dir | shows a movement up, or that something reaches its goal | 表示向上，或者达到目的
  下 | dir | shows a movement down, or that something has room or stays | 表示向下，或者容纳、留下
  起来 | dir | shows a movement up, or that something starts and goes on | 表示向上，或者开始并继续
  下来 | dir | shows a movement down toward the speaker, or that something stays | 表示由高到低朝说话人，或者固定下来
  下去 | dir | shows a movement down away from the speaker, or that something goes on | 表示由高到低离开说话人，或者继续下去
  出来 | dir | shows a movement out toward the speaker, or that something comes to light | 表示由里向外朝说话人，或者显露出来
  过去 | dir | shows a movement past or over, away from the speaker | 表示经过或离开说话人
  成 | verb | says something becomes another thing | 说变成了另一种事物
  完 | verb | says an action is finished | 说动作做完了
  见 | verb | says something is seen or heard | 说看到、听到
  连 | conj | means even, with 都 or 也 after it | 表示“甚至”，后面常有“都、也”
  甚至 | adv | adds the most surprising case | 引出最突出的情况
  何况 | conj | says a further case is all the more so | 说更进一层的情况就更不用说了
  否则 | conj | says what happens if not | 说如果不这样会怎样
  不如 | conj | says one thing is less good than another | 说前者比不上后者
  只 | adv | says only | 表示限于某个范围
  先 | adv | says something happens first | 说事情最先发生
  将 | adv | says something will happen, in formal writing | 书面语，说将要发生
  由 | prep | marks who does or is in charge of something | 引出做事或负责的人
  由于 | conj | gives the reason, in formal writing | 书面语，说原因
  以 | prep | marks the means or the way, in formal writing | 书面语，说凭借的手段或方式
  以及 | conj | joins the last of a list, in formal writing | 书面语，连接并列的最后一项
  据 | prep | marks what something is based on | 引出依据
  凭 | prep | marks what someone relies on | 引出凭借的东西
  照 | prep | means “following” or “according to” | 表示按照
  鉴于 | prep | gives the fact a decision is based on, in formal writing | 书面语，引出作为依据的情况
  至于 | prep | turns to another matter | 引出另一个话题
  然而 | conj | turns to something unexpected, in formal writing | 书面语，表示转折
  既 | conj | joins two qualities, with 又 or 也 | 和“又、也”配合，连接两种情况
  当 | prep | marks the time when something happens | 说事情发生的时候
  不是 | conj | says that something is not so, often before 而是 | 否定一种说法，后面常有“而是”
  而是 | conj | gives what is so, after 不是 | 用在“不是”后面，说出真实的情况
  就是 | conj | says it is exactly so, or even if | 表示正是，或者表示假设让步
  使 | verb | says something causes a result | 说引起某种结果
  无 | other | says there is none, in formal writing | 书面语，表示没有
  非 | other | says is not, in formal writing | 书面语，表示不是
  之 | struct | joins words like 的, in formal writing | 书面语，作用相当于“的”
  此 | other | means “this”, in formal writing | 书面语，表示“这”
  必 | adv | says must or surely, in formal writing | 书面语，表示必须或必定
  一边 | conj | says two actions happen at once, in 一边……一边…… | 用在“一边……一边……”里，表示两个动作同时进行
  也许 | adv | says perhaps | 表示推测，不能肯定
  点儿 | other | says a little | 表示少量
  一会儿 | other | says a short time | 表示很短的时间
  哪怕 | conj | says even if | 表示假设让步
  要么 | conj | offers two choices, in 要么……要么…… | 用在“要么……要么……”里，表示两种选择
  与其 | conj | gives the less good choice, in 与其……不如…… | 用在“与其……不如……”里，引出不取的一项
  以便 | conj | gives the purpose, so that | 引出目的，使下文的事容易实现
  以致 | conj | gives a bad result | 引出不好的结果
  相当 | adv | says quite | 表示程度比较高
  一定 | adv | says surely, for certain | 表示肯定、必定
  正好 | adv | says just right, or by good chance | 表示恰好
  一起 | adv | says together | 表示在一块儿
  真 | adv | says really, before an adjective | 用在形容词前面，表示“确实”
  刚 | adv | says just now, a moment ago | 表示不久以前
  刚刚 | adv | says just now, a moment ago | 表示不久以前
  差点儿 | adv | says something almost happened | 表示某事几乎发生
  终于 | adv | says at last, after a long time | 表示经过很长时间以后
  究竟 | adv | asks “in the end, really?” in a question | 用在问句里，表示追究到底
  到底 | adv | asks “in the end, really?” in a question | 用在问句里，表示追究到底
  突然 | adv | says suddenly | 表示情况发生得很快、出人意料
  本来 | adv | says at first, as it was before | 表示原先
  仍然 | adv | says still, as before | 表示情况没有变
  其实 | adv | says in fact | 表示所说的是实际情况
  难怪 | adv | says no wonder: now the reason is clear | 表示明白了原因，不再觉得奇怪
  一直 | adv | says all along, without stopping | 表示动作或状态始终不变
  原来 | adv | says it turns out: what was not known before | 表示发现了以前不知道的情况
  互相 | adv | says each other | 表示彼此对待
  只好 | adv | says there is no other choice | 表示没有别的办法
  千万 | adv | says be sure to, in a warning | 表示恳切叮嘱
  几乎 | adv | says almost | 表示差不多、接近
  大概 | adv | says probably | 表示估计
  好像 | adv | says it seems | 表示似乎、不能肯定
  特别 | adv | says especially, very | 表示格外、尤其
  比较 | adv | says fairly, quite | 表示具有一定程度
  有点儿 | adv | says a little, for what is not wanted | 表示程度不高，多用于不如意的事
  一共 | adv | says in all | 表示合在一起
  必须 | adv | says must | 表示一定要
  越来越 | adv | says more and more | 表示程度随时间加深
  曾经 | adv | says once, at some time before | 表示从前有过
  从来 | adv | says ever, all along, with 不 or 没 | 表示从过去到现在，常和“不、没”连用
  尤其 | adv | says especially | 表示更进一步
  竟然 | adv | says something is a surprise | 表示出乎意料
  居然 | adv | says something is a surprise | 表示出乎意料
  果然 | adv | says it happened just as expected | 表示事实与所料相符
  尽量 | adv | says as much as one can | 表示力求达到最大限度
  往往 | adv | says it is usually so, as a rule | 表示某种情况经常出现
  总是 | adv | says always | 表示一直如此
  经常 | adv | says often | 表示次数多
  正 | adv | says an action is going on just now | 表示动作正在进行
  可以 | modal | says may, or can | 表示可能或允许
  应该 | modal | says should | 表示情理上必须如此
  愿意 | modal | says be willing to | 表示乐意
  可能 | modal | says may, perhaps | 表示也许
  敢 | modal | says dare to | 表示有胆量
  关于 | prep | marks what something is about | 引出关涉的事物
  对于 | prep | marks the thing something is said of or done about | 引出对待的对象
  除了 | prep | marks what is left out, or what is added: besides | 表示不计算在内，或者另有补充
  根据 | prep | marks what something is based on | 引出作为依据的事物
  按照 | prep | marks the rule something follows: according to | 引出遵从的依据
  通过 | prep | marks the means: through, by | 引出手段或方式
  随着 | prep | says one change goes along with another | 表示一种变化跟着另一种变化
  不但 | conj | sets the first point, with 而且 after it | 提出第一点，后面常有“而且”
  不仅 | conj | sets the first point, with 而且 after it, more formal | 提出第一点，后面常有“而且”，比较正式
  既然 | conj | grants a fact and draws a result, with 就 | 先承认一个事实，再推出结论，后面常有“就”
  即使 | conj | says even if, with 也 | 表示假设让步，后面常有“也”
  不管 | conj | says no matter what, with 都 | 表示条件不同结果都不变，后面常有“都”
  无论 | conj | says no matter what, with 都, more formal | 表示条件不同结果都不变，后面常有“都”，比较正式
  尽管 | conj | grants a fact: although | 表示让步，承认某种事实
  除非 | conj | sets the one condition: unless, only if | 提出唯一的条件
  万一 | conj | says in case, if by bad luck | 表示可能性很小的假设
  首先 | conj | says first, before the rest | 表示最先
  另外 | conj | adds another point | 表示在说过的以外
  还有 | conj | adds one more | 表示补充
  里 | loc | marks inside a place, after its noun | 用在名词后面，表示在里面
  外 | loc | marks outside a place, after its noun | 用在名词后面，表示在外面
  啊 | end | ends a sentence with feeling | 用在句末，加强语气
  杯 | measure | counts cups and glasses of something | 是量词，用于杯装的东西
  块 | measure | counts pieces, and yuan in speech | 是量词，用于块状的东西，口语里也用于钱
  遍 | measure | counts times through, from start to end | 是量词，说从头到尾的次数
  口 | measure | counts people of a family, and mouthfuls | 是量词，用于家里的人口和一口一口的东西
  位 | measure | counts people, politely | 是量词，用于人，含敬意
  种 | measure | counts kinds | 是量词，说事物的种类
  些 | measure | says some, a few | 是量词，表示不定的数量
  一点儿 | other | says a little: after an adjective, or before a noun | 表示少量，用在形容词后面或名词前面
`;

/** WordClass is where a grammar word stands in a sentence: its kind, for the reasons of word order. */
export type WordClass = (typeof CLASSES)[number];

/** CLASSES are the kinds of grammar words. */
const CLASSES = [
  "neg",
  "aspect",
  "struct",
  "end",
  "verb",
  "adv",
  "prep",
  "conj",
  "measure",
  "number",
  "question",
  "pointer",
  "modal",
  "dir",
  "loc",
  "other",
] as const;

/** Usage is what a grammar word is and does. */
export interface Usage {
  readonly kind: WordClass;
  readonly note: Text;
}

const isClass = (s: string): s is WordClass => (CLASSES as readonly string[]).includes(s);

/** usage are what the grammar words do, by word. */
export const usage: ReadonlyMap<string, Usage> = (() => {
  const out = new Map<string, Usage>();
  for (const [word = "", kind = "", en = "", zh = ""] of lines(USAGE, 4)) {
    if (out.has(word)) throw new Error(`grammar usage: ${word} twice`);
    if (!isClass(kind)) throw new Error(`grammar usage: the class of ${word}`);
    out.set(word, { kind, note: t(en, zh) });
  }
  return out;
})();
