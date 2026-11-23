// Reasons written by hand for pairs of words that the usage notes and the word meanings cannot tell apart
// (grammar-reasons.ts): words of like meaning that differ in grammar or position, and set phrases.
//
// A line a pair: `right | wrong | why the wrong one fails, in English | in Chinese`.

import { type Text, t } from "@ga/content";

import { lines } from "../grammar/drill.ts";

/** PAIRS are the written reasons, a line each. */
const PAIRS = `
  做菜做得 | 做得菜 | 得 cannot stand between a verb and its object. Say the verb with its object, then the verb again with 得: 做菜做得. | “得”不能放在动词和宾语中间。先说动词和宾语，再重复动词加“得”：做菜做得。
  没有 | 不有 | 有 is always negated with 没, never with 不: 没有. | “有”的否定总是用“没”，不用“不”：没有。
  分 | 时 | Minutes after the hour are counted with 分. 时 is not used after a number to tell the minutes. | 整点后的分钟用“分”来数。“时”不能放在数字后面表示几分。
  号 | 月 | 五月 already gives the month. The day of the month comes next and takes 号, so 八月 cannot follow it. | 前面的“五月”已经是月份，后面该说几号，用“号”，不能再接“八月”。
  天 | 七 | Sunday is 星期天 or 星期日. Days are counted only from 星期一 to 星期六, so there is no 星期七. | 星期日说“星期天”或“星期日”。“星期”后面的数字只到六，没有“星期七”。
  天 | 八 | Sunday is 星期天 or 星期日. Days are counted only from 星期一 to 星期六, so there is no 星期八. | 星期日说“星期天”或“星期日”。“星期”后面的数字只到六，没有“星期八”。
  下星期去 | 星期的下去 | 下 goes before 星期 to say “next week”: 下星期. It is not put after 星期, and 的 has no place there. | 表示“下一个星期”，“下”放在“星期”前面：下星期。不能放在后面，也不加“的”。
  每天 | 每个天 | 天 is already a counted word, so 每 goes right before it: 每天. It takes no 个. | “天”本身就能计数，“每”直接放在它前面：每天，不加“个”。
  每天 | 每号 | 每天 means every day. 号 names one date of the month, and 每号 is not said. | “每天”是每一天。“号”指某月的哪一天，不说“每号”。
  吃饭 | 吃了饭 | 了 does not go inside 吃饭 here. With 没, or after a wish such as 想, the meal has not happened, so there is no 了. | 这里“了”不能放进“吃饭”中间。用“没”或在“想”这样的愿望后面，吃饭还没有发生，所以不用“了”。
  没喝 | 不喝了 | 不喝了 says he will stop drinking from now on. To say he did not drink it, use 没 and no 了. | “不喝了”是说从现在起不再喝。要说他没有喝过，用“没”，不加“了”。
  吃饭了吗 | 吃了饭吗了 | The question word 吗 ends the sentence; nothing comes after it. And 了 is said once, here after 吃饭. | 疑问词“吗”放在句子最后，后面不能再有别的词；“了”也只用一次，放在“吃饭”后面。
  没吃饭 | 不吃了饭 | To say something did not happen, use 没 and no 了. 不 says he does not or will not eat. | 说事情没有发生，用“没”，不加“了”。“不”是说不吃或不想吃。
  不想 | 没想了 | 想 here says a wish. A wish is negated with 不: 不想. 没想 and 了 make it about the past. | 这里的“想”表示愿望。否定愿望用“不”：不想。“没想了”说的是过去的事。
  您好 | 您是好 | 好 is an adjective, and it follows the subject directly. It takes no 是: 您好. | “好”是形容词，直接放在主语后面，不加“是”：您好。
  好吃不好吃 | 好不吃好 | A yes-or-no question repeats the whole word: 好吃不好吃. 不 goes before the second 好吃 and does not break it. | 正反问要把整个词重复：好吃不好吃。“不”放在第二个“好吃”前面，不能把词拆开。
  不想吃饭 | 吃不饭 | The question asks 想不想: 不 goes between the two 想. 不 cannot stand inside 吃饭. | 问的是“想不想”，“不”放在两个“想”中间，不能放进“吃饭”里。
  这件 | 这个 | 件 is the measure word for clothes and things that happen. 衣服 takes 件, not 个. | “件”是衣服、事情的量词。“衣服”要用“件”，不用“个”。
  多少钱 | 几钱 | 几 asks about a small number and needs a measure word after it. A price is asked with 多少钱. | “几”问较小的数，后面要有量词。问价钱说“多少钱”。
  多少钱 | 什么钱 | 什么钱 asks what kind of money. To ask the price, say 多少钱, “how much money”. | “什么钱”问的是哪一种钱。问价钱要说“多少钱”。
  多少钱 | 哪钱 | 哪 asks which one and needs a measure word after it. The price is asked with 多少钱. | “哪”问哪一个，后面要有量词。问价钱用“多少钱”。
  那些 | 那岁 | 那些 means “those” and goes before a noun. 岁 counts years of age and cannot follow 那 here. | “那些”指那几个，放在名词前面。“岁”只用来说年龄，不能放在这里。
  这些 | 这岁 | 这些 means “these” and goes before a noun. 岁 counts years of age and cannot follow 这 here. | “这些”指这几个，放在名词前面。“岁”只用来说年龄，不能放在这里。
  多少钱 | 多少个钱 | 钱 is not counted with 个. 多少 goes right before 钱: 多少钱. | “钱”不用“个”来数，“多少”直接放在“钱”前面：多少钱。
  多少钱 | 钱几 | The question word comes before 钱: 多少钱. 几 cannot come after 钱, and 几 asks about a small number. | 疑问词放在“钱”前面：多少钱。“几”不能放在“钱”后面，而且“几”问的是较小的数。
  还是两杯 | 和两杯吗 | A question that offers a choice joins the two with 还是 and takes no 吗. 和 only joins nouns. | 让人选择的问句用“还是”连接两项，句末不加“吗”。“和”只连接名词。
  吃饭了 | 吃了了饭 | 了 is said once, at the end: 吃饭了. It is not doubled, and here it does not go inside 吃饭. | “了”只用一次，放在句末：吃饭了。不能重复，这里也不放进“吃饭”中间。
  怎么样 | 吗样 | 怎么样 asks “how is it” and stays whole. 吗 is a question particle at the end of a sentence and cannot replace 怎么. | “怎么样”问“怎么样”，三个字连在一起。“吗”是句末的疑问助词，不能替换“怎么”。
  明天去，怎么样 | 怎么样明天去吗 | To ask for an idea, say the idea first and add 怎么样 at the end, after a comma. 怎么样 is already a question and takes no 吗. | 征求意见时，先说想法，再在逗号后加“怎么样”。“怎么样”已经是问句，不再加“吗”。
  个来 | 本来 | 第一个 counts the first person to come. 本 is the measure word for books, not for people. | “第一个”说的是第一个来的人。“本”是书的量词，不能用来数人。
  多少 | 第几 | 第几 asks for a place in order, such as first or second. The question asks how many students, so it needs 多少. | “第几”问次序。这里问有几个学生，要用“多少”。
  多少个 | 第多少 | 第 marks a place in order. The question asks how many, so it needs 多少个, without 第. | “第”表示次序。这里问数量，要用“多少个”，不加“第”。
  多少个 | 第几 | 第几 asks for a place in order. The question asks how many students, so it needs 多少个. | “第几”问次序。这里问有多少个学生，要用“多少个”。
  写字 | 写在字 | 在家 already says where. 在 does not go again inside 写字. | “在家”已经说了地点，“在”不能再放进“写字”中间。
  不在 | 不是 | 在 says where someone or something is, and 不 goes before it: 不在. 是 cannot take a place word this way. | “在”说人或东西在哪儿，否定时“不”放在前面：不在。“是”不能这样带地点。
  房间里 | 在房间在 | 在 is said once, before the place: 在房间里. A place inside something ends with 里, not with a second 在. | “在”只用一次，放在地点前面：在房间里。表示里面用“里”，不能用第二个“在”。
  左边 | 的左 | Here 左边 follows 学校 directly: 学校左边. 左 alone is not used as a place word, and 的 does not join them here. | 这里“左边”直接放在“学校”后面：学校左边。“左”单用不作方位词，这里也不加“的”。
  前边 | 的前 | Here 前边 follows 医院 directly: 医院前边. 前 alone is not used here, and 的 does not join them. | 这里“前边”直接放在“医院”后面：医院前边。“前”单用不行，这里也不加“的”。
  后边 | 后是 | 后边 is one place word and stays whole. 是 comes after it: 楼后边是…. | “后边”是一个方位词，要连在一起，“是”放在它后面：楼后边是……
  后边 | 是后 | The place word 后边 comes first and stays whole. Then comes 是: 楼后边是…. | 方位词“后边”放在前面，并且要完整，然后才是“是”：楼后边是……
  楼上 | 楼是上 | 楼上 is one place word, “upstairs”. 是 cannot go inside it. | “楼上”是一个方位词，“是”不能放进中间。
  楼上 | 楼在上 | 在 is said once, before the place: 在楼上. It cannot go again inside 楼上. | “在”只用一次，放在地点前面：在楼上。不能再放进“楼上”中间。
  哪里 | 哪边里 | To ask where, say 哪里 or 哪边. 哪边里 joins the two and is not a word. | 问地点说“哪里”或“哪边”。“哪边里”把两个词拼在一起，不成词。
  哪里 | 里边哪 | The question word for a place is 哪里, with 哪 first. 里边 means “inside” and is not a question. | 问地点用“哪里”，“哪”在前。“里边”是“里面”的意思，不是疑问词。
  不在 | 没有 | To say the book is not in the room, negate 在: 不在房间里. 没有 says there is none, and it needs a thing after it. | 说书不在房间里，要否定“在”：不在房间里。“没有”说没有某物，后面要跟事物。
  读书 | 读了书 | 在…呢 says an action is going on now. 了 says it is done, so 了 does not fit with 在…呢. | “在……呢”表示动作正在进行。“了”表示完成，不能和“在……呢”一起用。
  走路 | 走了路 | Here 走路去 says how she goes, as a habit. 了 would say one walk is done, which does not fit. | 这里“走路去”说她去的方式。“了”表示一次动作完成，这里不合适。
  第一次 | 第一个 | 次 counts times something is done. 个 counts people and things, so 第一个 cannot say “the first time”. | “次”数动作的次数。“个”数人和东西，“第一个”不能表示第一次。
  第一次 | 第一件 | 次 counts times something is done. 件 counts clothes and matters, not times. | “次”数动作的次数。“件”数衣服和事情，不数次数。
  第一次 | 第一本 | 次 counts times something is done. 本 counts books, not times. | “次”数动作的次数。“本”数书，不数次数。
  第一次 | 第一个次 | 次 is itself a measure word. Two measure words do not stand together, so 个 has no place. | “次”本身就是量词，两个量词不能连用，“个”多余。
  吃三次饭 | 吃饭三个次 | The number of times goes between the verb and its object: 吃三次饭. 次 is a measure word and takes no 个. | 次数放在动词和宾语中间：吃三次饭。“次”本身是量词，不加“个”。
  下雪 | 是雪 | Snow falling is 下雪, with the verb 下. 是 only says what something is. | 下雪用动词“下”：下雪。“是”只说某物是什么。
  下雪 | 很雪 | Snow falling is 下雪, with the verb 下. 很 goes before adjectives, and 雪 is not one. | 下雪用动词“下”：下雪。“很”放在形容词前面，“雪”不是形容词。
  下雪 | 雪了 | It needs the verb 下: 下雪了. Without 下, nothing falls, and 了 is said only once. | 要有动词“下”：下雪了。少了“下”就没有“落下”的意思，“了”也只用一次。
  看看 | 看了看了 | 你看看 asks someone to have a look now. 看了看 tells of a look that is over, and 了 is not said twice. | “你看看”是请对方现在看一下。“看了看”说的是已经看过，而且“了”不能用两次。
  唱歌 | 一歌 | The verb is doubled to make it light: 唱唱歌. 一 goes only between two one-character verbs, as in 看一看, and 歌 is a noun. | 把动词重叠表示轻松：唱唱歌。“一”只能放在两个相同的单字动词中间，如“看一看”，而“歌”是名词。
  看看书 | 看一书看 | The verb is doubled before its object: 看看书. 一 can only go between the two 看, and the object 书 comes last. | 动词重叠后再接宾语：看看书。“一”只能放在两个“看”中间，宾语“书”放在最后。
  打球打 | 打了球 | To say how well something is done with an object, repeat the verb: 打球打得很好. 了 cannot come before 得 here. | 动词带宾语又说程度时，要重复动词：打球打得很好。这里“得”前面不能用“了”。
  好吃吗 | 很好吃得 | 得 comes right after the verb and is said once. The question needs 吗 at the end. | “得”紧跟在动词后面，只用一次。问句句末要用“吗”。
  打球打得 | 打得球 | 得 cannot stand between a verb and its object. Say the verb with its object, then the verb again with 得: 打球打得. | “得”不能放在动词和宾语中间。先说动词和宾语，再重复动词加“得”：打球打得。
  写字写得 | 写得字 | 得 cannot stand between a verb and its object. Say the verb with its object, then the verb again with 得: 写字写得. | “得”不能放在动词和宾语中间。先说动词和宾语，再重复动词加“得”：写字写得。
  没去 | 不去了 | 不去了 says they will not go any more. To say they did not go, use 没 and no 了. | “不去了”说以后不去了。要说他们没有去，用“没”，不加“了”。
  最好 | 比好 | 比 compares two things and needs both: A 比 B 好. With only one thing, use 最 to say “the best”. | “比”比较两样东西，要说“A比B好”。只说一样东西时，用“最”表示最好。
  最好 | 最很好 | 最好 keeps its two characters together. 最 and 很 both say degree, so 很 cannot stand between 最 and 好. | “最好”两个字要连在一起。“最”和“很”都表示程度，“很”不能放在“最”和“好”中间。
  两 | 二十 | 两百 is two hundred. 二十百 is not how numbers are said: 百 follows one digit only. | “两百”就是二百。“百”前面只放一位数，不说“二十百”。
  二 | 十 | 二十二 is twenty-two. 二十十 does not say a number: after 二十 comes a single digit. | “二十二”就是二十二。“二十”后面只能跟一位数，没有“二十十”。
  零 | 十 | 一万零五百 has a 零 because the thousands place is empty. 一万十五百 is not a number. | “一万零五百”中千位是空的，所以要用“零”。“一万十五百”不是数字。
  一万 | 十千 | Ten thousand has its own word, 万: 一万. Chinese does not say 十千. | 一万有专门的“万”字：一万。汉语不说“十千”。
  多少个 | 哪个 | The question asks how many people. 哪个 asks which one. | 这里问有多少人。“哪个”问的是哪一个。
  几个 | 哪个 | 几个 asks for a number. 哪个 asks which one, so it cannot ask how many, and 第 does not go before it. | “几个”问数目。“哪个”问哪一个，不能问多少，“第”也不能放在它前面。
  那个 | 那里个 | 那里 means “there” and takes no measure word. To point at one thing, use 那 with the measure word: 那个. | “那里”表示地点，后面不加量词。指一个东西，用“那”加量词：那个。
  这个 | 这岁 | 这 points with a measure word before a noun: 这个名字. 岁 is used only for age and does not count names. | “这”加量词放在名词前：这个名字。“岁”只说年龄，不能数名字。
  那个 | 哪个 | 那个 points to a person. 哪个 asks which one, but this is a statement. | “那个”指一个人。“哪个”是问哪一个，可这里是陈述句。
  还没回家 | 已经没回家了 | To say something has not happened yet, use 还没 and no 了. 已经 says it has already happened, so it clashes with 没. | 说事情还没有发生，用“还没”，不加“了”。“已经”表示已经发生，和“没”矛盾。
  没回家 | 不回家了 | 不回家了 says she will not come home any more. To say she has not come home yet, use 还没 and no 了. | “不回家了”是说不回家了。要说她还没到家，用“还没”，不加“了”。
  洗澡 | 洗过澡了 | 常常 asks about a habit. 过 and 了 tell about one time that is over, so they do not fit with 常常. | “常常”问的是习惯。“过”和“了”说的是一次已经完成的事，不能和“常常”一起用。
  常常见面 | 没常见面了 | 常常 says something happens often and stays whole. 没 and 了 do not go with a habit here. | “常常”说事情经常发生，两个字要连在一起。这里说习惯，不用“没”和“了”。
  有时候早起，有时候 | 有的早起，有的 | 有的 means “some of them” and is used for people or things. One person does it at some times, so it needs 有时候. | “有的”指一部分人或东西。这里说一个人在某些时候这样做，要用“有时候”。
  有时候冷，有时候 | 有的冷，有的 | 有的 means “some of them”, for people or things. The weather changes at different times, so it needs 有时候. | “有的”指一部分人或东西。这里说天气在不同时候不一样，要用“有时候”。
  有时候去，有时候 | 有的去，有的 | 有的 means “some of them”, for people or things. Here one person goes at some times, so it needs 有时候. | “有的”指一部分人或东西。这里说一个人有些时候去，要用“有时候”。
  一样 | 同样 | 跟…一样 and 像…一样 end with 一样. 同样 goes before a verb or a noun, not at the end of the pattern. | “跟……一样”“像……一样”都以“一样”结尾。“同样”放在动词或名词前面，不能放在格式末尾。
  一样 | 同 | 跟…一样 is the fixed pattern for “the same as”. 同 alone does not go before an adjective here: it cannot link 跟你的 to 大. | “跟……一样”是固定格式。单用“同”不能放在形容词前面，不能把“跟你的”和“大”连起来。
  那么 | 那样么 | 那么 is one word and goes before the adjective: 那么高. 那样么 is not a word. | “那么”是一个词，放在形容词前面：那么高。“那样么”不成词。
  的贵，旧的 | 地贵，旧地 | 新的 and 旧的 stand for “the new one” and “the old one”, and that takes 的. 地 goes before a verb to say how it is done. | “新的”“旧的”表示新的东西、旧的东西，要用“的”。“地”放在动词前面说怎样做。
  的给我，小的 | 地给我，小地 | 大的 and 小的 stand for “the big one” and “the small one”, and that takes 的. 地 goes before a verb to say how it is done. | “大的”“小的”表示大的东西、小的东西，要用“的”。“地”放在动词前面说怎样做。
  这么 | 这样的 | 这么 goes right before an adjective to say “so”: 这么贵. 这样的 goes before a noun, not before 贵. | “这么”直接放在形容词前面表示程度：这么贵。“这样的”要放在名词前面，不能放在“贵”前面。
  这么 | 这儿 | 这儿 means “here” and names a place. Before an adjective, “so” is 这么. | “这儿”表示地点“这里”。形容词前面表示程度要用“这么”。
  那么 | 那里很的 | Before the adjective, only one word of degree is used: 那么贵. 那里 is a place, and 的 has no place before 贵. | 形容词前只用一个表示程度的词：那么贵。“那里”是地点，“的”也不能放在“贵”前面。
  早就 | 早才 | 早就 says it happened early, or long ago. 才 says it happened late, so it clashes with 早. | “早就”表示很早或早已。“才”表示晚，和“早”矛盾。
  早就 | 早还 | 很早就醒了 says he woke early. 还 says something is still going on, and it does not link 很早 to 醒了. | “很早就醒了”说他醒得早。“还”表示仍然，不能把“很早”和“醒了”连起来。
  早就 | 早再 | 很早就醒了 says he woke early. 再 says something will happen again later, which does not fit a past event. | “很早就醒了”说他醒得早。“再”说以后再一次发生，不能用于已经发生的事。
  完早饭了 | 完了早饭了呢 | With 就…了, 了 is said once, at the end. 呢 does not go after 了 here. | 用“就……了”时，“了”只在句末用一次，后面也不再加“呢”。
  做饭做得 | 做得饭 | 得 cannot stand between a verb and its object. Say the verb with its object, then the verb again with 得: 做饭做得. | “得”不能放在动词和宾语中间。先说动词和宾语，再重复动词加“得”：做饭做得。
  吃饭吃得 | 吃得饭 | 得 cannot stand between a verb and its object. Say the verb with its object, then the verb again with 得: 吃饭吃得. | “得”不能放在动词和宾语中间。先说动词和宾语，再重复动词加“得”：吃饭吃得。
  开车开得 | 开得车 | 得 cannot stand between a verb and its object. Say the verb with its object, then the verb again with 得: 开车开得. | “得”不能放在动词和宾语中间。先说动词和宾语，再重复动词加“得”：开车开得。
  有的 | 有些的 | 有的…有的… splits a group into parts. 有些 already means “some” and takes no 的 here. | “有的……有的……”把一组东西分成几部分。“有些”本身就是“一些”，这里不加“的”。
  有的 | 一些 | The pattern is 有的…有的…, said the same way both times. 一些 does not answer the first 有的. | 格式是“有的……有的……”，前后要一样。“一些”不能和前面的“有的”相配。
  回家 | 回了家 | 了 is said once. Here it comes at the end: 回家了. 回了家了 has two. | “了”只用一次，这里放在句末：回家了。“回了家了”用了两个“了”。
  有的很好吃，有的不好吃 | 有很好吃的，有的不好吃有 | Both parts start with 有的: 有的很好吃，有的不好吃. 有 cannot end a sentence. | 前后两部分都以“有的”开头：有的很好吃，有的不好吃。“有”不能放在句末。
  只有 | 只是有 | 只 goes right before the verb 有: 只有. 是 has no place between them. | “只”直接放在动词“有”前面：只有。中间不能加“是”。
  小时 | 天个 | 半个小时 is half an hour, with 小时 after the measure word. 天个 puts the measure word after the noun. | “半个小时”是半个钟头，“小时”放在量词后面。“天个”把量词放在名词后面了。
  不够 | 没有够了 | 不够 says there are not enough. 没有 and 了 would make it a past event, and 够 here is a state now. | “不够”说现在数量不足。“没有”和“了”把它说成过去的事，这里说的是现在的情况。
  别人 | 别的人们 | 别人 means “other people”. 们 does not go after 人 with 别的 before it. | “别人”就是“其他人”。前面有“别的”时，“人”后面不加“们”。
  别的人 | 别人 | 别的人都走了 picks out the other people present, apart from him. 别人 is used for people in general. | “别的人都走了”指在场的其他人，除了他。“别人”泛指他人。
  听懂 | 听错 | 我都听懂了 says I understood all of it. 听错 says I heard it wrong, which is the opposite. | “我都听懂了”说全都听明白了。“听错”是听得不对，意思相反。
  听懂 | 听会 | The result of listening and understanding is 懂: 听懂. 会 is the result of learning a skill, as in 学会. | 听了而明白，结果补语用“懂”：听懂。“会”是学会技能的结果，如“学会”。
  听懂 | 听着 | 着 says an action goes on, not a result. 都…了 needs a result: 听懂了. | “着”表示动作持续，不表示结果。“都……了”需要结果：听懂了。
  学会 | 学懂 | Learning a skill, such as using a computer, has the result 会: 学会. 懂 is for understanding meaning. | 学技能，比如用电脑，结果是“会”：学会。“懂”用于明白意思。
  学会 | 学对 | Learning to use something has the result 会: 学会. 对 says right or wrong, not that a skill is mastered. | 学用东西，结果是“会”：学会。“对”说对不对，不表示掌握了技能。
  学会 | 学着 | 着 says an action goes on, not a result. 学会了 says the skill is now mastered. | “着”表示动作持续，不表示结果。“学会了”说已经掌握了技能。
  看懂 | 看会了 | Reading and understanding has the result 懂: 看懂. 没 also takes no 了. | 看了而明白，结果用“懂”：看懂。用“没”时也不加“了”。
  看懂 | 看对了 | Reading a page has the result 懂. 看对 says you read something right, and 没 takes no 了. | 看书的结果用“懂”。“看对”说看得正确，而且用“没”时不加“了”。
  学会 | 学错 | 还没学会 says she has not yet mastered it. 学错 says she learned it wrong, which is not what is meant. | “还没学会”说还没有掌握。“学错”说学得不对，不是这个意思。
  学会 | 学过了 | 还没 needs a result verb: 还没学会. 过 and 了 do not go after 没 here. | “还没”后面要用结果补语：还没学会。这里“没”后面不用“过了”。
  打错电话了 | 打电话错着 | The result word 错 comes right after the verb: 打错电话了. 着 says an action goes on and does not end a result. | 结果补语“错”紧跟在动词后面：打错电话了。“着”表示持续，不能表示结果。
  没看错 | 不看错了 | To say a result did not happen, use 没 before the verb and no 了: 没看错. | 否定结果用“没”放在动词前，不加“了”：没看错。
  没看错 | 看没错了 | 没 goes before the verb and its result: 没看错. It cannot go between them. | “没”放在动词和结果补语前面：没看错，不能放在中间。
  帮助 | 帮 | After 很有 comes a noun: 很有帮助. 帮 alone is a verb and cannot follow 有 here. | “很有”后面接名词：很有帮助。单用“帮”是动词，不能放在“有”后面。
  帮助 | 帮着 | 帮助 here is a noun, “help”: 有帮助, 在…的帮助下. 帮着 is a verb with 着, not a noun. | 这里的“帮助”是名词：有帮助、在……的帮助下。“帮着”是动词加“着”，不是名词。
  别人 | 别的 | 别的 needs a noun after it, as in 别的人. 别人 means “other people” and stands alone. | “别的”后面要接名词，如“别的人”。“别人”就是“其他人”，可以单用。
  三 | 四 | 一刻 is 15 minutes, so 三刻 is 45. 四刻 would be a whole hour, which is not said. | “一刻”是十五分钟，“三刻”是四十五分。“四刻”就是一小时，不这样说。
  一刻 | 一个刻 | 刻 counts quarters of an hour by itself. It takes no 个: 一刻. | “刻”本身就是计时单位，不加“个”：一刻。
  半 | 两刻 | Half past the hour is said with 半: 七点半. 两刻 is not used for the half hour. | 整点过半说“半”：七点半。不说“两刻”。
  半 | 一半 | 七点半 tells the time. 一半 means “half of something”, not half past the hour. | “七点半”说时间。“一半”是某物的一半，不表示几点半。
  点钟 | 点刻钟 | 点钟 tells the hour. 刻 is a quarter hour and does not go inside 点钟. | “点钟”说整点。“刻”是一刻钟，不能放在“点钟”中间。
  了 | 刻 | 现在几点了 asks the time, with 了 at the end. 刻 needs a number before it. | “现在几点了”问时间，句末用“了”。“刻”前面要有数字。
  四十五分 | 三十分 | 三刻 is three quarters, 45 minutes. 三十分 is only 30 minutes. | “三刻”是三个十五分钟，即四十五分。“三十分”只有三十分钟。
  四十五 | 三刻 | After 就是 the time is said again in minutes: 四十五分. 三刻分 mixes 刻 with 分. | “就是”后面用分钟再说一遍：四十五分。“三刻分”把“刻”和“分”混在一起了。
  得去 | 过去 | 得去 says one has to go. 过去 means to go over, or the past, and says nothing about having to. | “得去”表示必须去。“过去”是走过去或从前，没有“必须”的意思。
  不用来 | 得不来了 | 不用 says there is no need: 不用来. 得 means “must”, and 得不 is not said. | “不用”表示没有必要：不用来。“得”表示必须，不说“得不”。
  不用上班 | 不得上班了不 | 不用 says there is no need to go to work. 不得 means “must not”, and a sentence does not end with 不. | “不用”表示不需要上班。“不得”是“不许”，句子也不能以“不”结尾。
  没看见他 | 不看见他了 | 刚才 points to the past. To say it did not happen, use 没 and no 了. | “刚才”说的是过去。否定已经发生的事，用“没”，不加“了”。
  迟到 | 迟了到 | 迟到 is one word; 了 does not go inside it. Here 了 ends the sentence. | “迟到”是一个词，“了”不能放进中间。这里“了”放在句末。
  开会 | 开过会了 | 还在 says the meeting is still going on. 过 and 了 say it is over, which clashes with 在. | “还在”表示会议还在进行。“过”和“了”表示已经结束，和“在”矛盾。
  多长时间 | 几点 | The question asks how long it takes. 几点 asks what time it is. | 这里问要花多少时间。“几点”问的是时刻。
  多长时间 | 什么时候了 | The question asks how long it takes. 什么时候 asks when. | 这里问需要多久。“什么时候”问的是时间点。
  多长时间 | 多少点 | How long is 多长时间. 多少点 is not said; 点 is a time on the clock. | 问时长说“多长时间”。不说“多少点”，“点”是钟点。
  多少钱 | 怎么钱 | The price is asked with 多少钱. 怎么 asks how something is done. | 问价钱用“多少钱”。“怎么”问方式。
  多少钱 | 多钱 | 多 alone does not ask a price. The question word is 多少: 多少钱. | 单用“多”不能问价钱，要用“多少”：多少钱。
  多长时间 | 什么点 | How long is 多长时间. 什么点 is not said; 点 is a time on the clock. | 问时长说“多长时间”。不说“什么点”，“点”是钟点。
  个小时 | 点 | 两个小时 is a length of time, two hours. 两点 is a time on the clock, two o'clock. | “两个小时”是时长。“两点”是钟点。
  十分钟 | 十个分钟 | 分钟 counts minutes by itself and takes no 个: 十分钟. | “分钟”本身可以计数，不加“个”：十分钟。
  十分钟 | 十点钟 | 二十分钟 is a length of time. 点钟 tells a time on the clock, and there is no 二十点钟 in daily speech. | “二十分钟”是时长。“点钟”说钟点，不是时长。
  怎么了 | 怎么样了吗 | 你怎么了 asks what is wrong. 怎么样 asks how something is, and a question word takes no 吗. | “你怎么了”问出了什么事。“怎么样”问情况如何，而且有疑问词就不再加“吗”。
  多大 | 多岁 | Age is asked with 多大. 岁 is not put after 多. | 问年龄说“多大”，不说“多岁”。
  多大 | 多几岁 | Age is asked with 多大 or 几岁, not both together. | 问年龄说“多大”或“几岁”，不能两个合在一起。
  多大 | 多很大 | 多 asks how much and goes right before the adjective: 多大. 很 has no place between them. | “多”问程度，直接放在形容词前：多大。中间不能加“很”。
  多长 | 多大 | Time is long or short, so its length is asked with 多长时间. 大 is for size and age. | 时间说长短，问时长用“多长时间”。“大”用于大小和年龄。
  多长 | 多久 | 多久 already means “how long” and takes no 时间. With 时间, say 多长时间. | “多久”本身就是“多长时间”，后面不加“时间”。带“时间”要说“多长时间”。
  多大 | 几大 | 多大 asks about age or size. 几 asks about a number and needs a measure word after it. | “多大”问年龄或大小。“几”问数目，后面要有量词。
  多久 | 几久 | 几 asks about a number and needs a measure word. How long is 多久. | “几”问数目，后面要有量词。问多长时间用“多久”。
  多久 | 怎么久 | 怎么 asks how or why. How long is 多久. | “怎么”问方式或原因。问时间长短用“多久”。
  一点儿 | 一下儿 | 一点儿 says “a little” about an amount, after an adjective or before a noun. 一下儿 goes after a verb to say “once, briefly”, not an amount. | “一点儿”表示数量少，放在形容词后或名词前。“一下儿”放在动词后，表示动作一次、时间短，不表示数量。
  有点儿 | 一下儿 | 有点儿 goes before an adjective to say “a bit”, often about something not wanted: 有点儿苦. 一下儿 goes after a verb. | “有点儿”放在形容词前，表示稍微，多用于不如意的事：有点儿苦。“一下儿”要放在动词后面。
  有点儿累 | 累一点儿有 | 有点儿 goes before the adjective: 有点儿累. 有 cannot end the sentence. | “有点儿”放在形容词前面：有点儿累。“有”不能放在句末。
  有点儿不舒服 | 一点儿不舒服了 | Before an adjective, “a bit” is 有点儿. 一点儿 goes after an adjective or before a noun. | 形容词前面表示“稍微”用“有点儿”。“一点儿”放在形容词后面或名词前面。
  睡觉 | 睡过觉了了 | After 应该 comes the plain verb: 应该睡觉. 过 and 了 tell of the past, and 了 is not doubled. | “应该”后面用动词原形：应该睡觉。“过”“了”说过去的事，“了”也不能重复。
  应不应该吃药 | 应该吃药不应该吗 | A yes-or-no question puts 应不应该 before the verb. It already asks, so it takes no 吗. | 正反问把“应不应该”放在动词前面。正反问已经是问句，不加“吗”。
  最好多 | 很好多 | 最好 is one word, “had better”, and gives advice. 很好 means “very good” and does not give advice before a verb. | “最好”是一个词，表示建议。“很好”是“非常好”，不能放在动词前表示建议。
  睡 | 睡着了了 | Here the plain verb is needed: 早点儿睡. Advice is not about the past, and 了 is not doubled. | 这里要用动词原形：早点儿睡。建议不说过去的事，“了”也不能重复。
  太多 | 很多的 | After 吃得 comes a word of degree: 吃得太多. 的 does not end it. | “吃得”后面说程度：吃得太多。后面不加“的”。
  最好多 | 最很好多 | 最好 is one word, “had better”. 很 cannot go inside it. | “最好”是一个词，“很”不能放进中间。
  最好听 | 最很好听 | 最好 is one word, “had better”, before the verb 听听. 很 cannot go inside it. | “最好”是一个词，放在“听听”前面，“很”不能放进中间。
  去过那里 | 过去那里了 | 过 goes right after the verb: 去过. 过去 is a different word, and 没 takes no 了. | “过”紧跟在动词后面：去过。“过去”是另一个词，而且用“没”时不加“了”。
  去过没有 | 过去没有了 | 过 comes right after the verb: 去过没有. 了 cannot follow the question 没有. | “过”紧跟动词：去过没有。问句“没有”后面不能加“了”。
  不太 | 有近 | 不太 goes before the adjective to say “not very”: 不太近. 有 is not used before 近 this way, and 近 is not doubled. | “不太”放在形容词前，表示“不很”：不太近。“近”前面不这样用“有”，也不重复。
  一起床 | 就起床 | The pattern is 一…就…: 一 goes before the first action, 就 before the second. Two 就 break it. | 格式是“一……就……”：“一”在第一个动作前，“就”在第二个动作前。用两个“就”就不成格式了。
  一起床 | 才起床 | The pattern is 一…就…: 一 goes before the first action. 才 says something happened late. | 格式是“一……就……”，第一个动作前用“一”。“才”表示晚。
  一起床 | 先起床 | The pattern is 一…就…, with 一 before the first action. 先 pairs with 然后 or 再, not with 就 here. | 格式是“一……就……”，第一个动作前用“一”。“先”和“然后”“再”搭配，这里不和“就”配。
  就起床 | 一起床 | In 一…就…, 一 goes before the first action and 就 before the second. The second needs 就. | “一……就……”里，“一”在第一个动作前，“就”在第二个动作前。第二个动作要用“就”。
  不是坐火车来的 | 是不坐火车来了 | The pattern 是…的 is negated with 不是 at the front, and it ends with 的, not 了. | “是……的”句的否定，把“不是”放在前面，句末用“的”，不用“了”。
  不是去年去的 | 是不去年去了 | The pattern 是…的 is negated with 不是 at the front, and it ends with 的, not 了. | “是……的”句的否定，把“不是”放在前面，句末用“的”，不用“了”。
  进来 | 进到 | The speaker is in the room, so the movement is toward the speaker: 进来. 到 needs a place after it. | 说话人在房间里，动作朝向说话人：进来。“到”后面要接地点。
  进来 | 进过 | 进来 asks someone to come in now, toward the speaker. 过 tells of something done before. | “进来”是请人现在进来，朝向说话人。“过”说的是以前做过的事。
  上来 | 上去 | The speaker is upstairs, so the movement comes toward the speaker: 上来. 上去 goes away from the speaker. | 说话人在楼上，动作朝向说话人：上来。“上去”是离开说话人。
  回去 | 回来过 | He left and will come again tomorrow, so he went away from here: 回去. 回来 comes toward the speaker. | 他走了，明天再来，所以是离开这里：回去。“回来”是朝说话人这边来。
  回去 | 回到着 | 回去 says he went back, away from here. 到 needs a place, and 着 does not fit a finished move. | “回去”说他离开这里回去了。“到”后面要有地点，“着”也不用于已完成的动作。
  回去 | 回过了着 | 回去了 says he went back. 过, 了 and 着 cannot stand in a row after the verb. | “回去了”说他回去了。“过”“了”“着”不能连在动词后面。
  出去 | 出着 | Going out of the room is 出去, away from where they are. 着 says an action goes on, not a direction. | 离开房间往外走是“出去”。“着”表示持续，不表示方向。
  出去 | 出到 | Going out of the room is 出去. 到 needs a place after it. | 离开房间往外走是“出去”。“到”后面要有地点。
  出去 | 出过 | 出去走走吧 suggests going out now. 过 tells of something done before. | “出去走走吧”是建议现在出去。“过”说的是以前做过的事。
  回家去 | 回去了家 | A place goes between 回 and 去: 回家去. 去 does not come before the place. | 地点放在“回”和“去”中间：回家去。“去”不能放在地点前面。
  进来 | 进了来过 | 请进来 asks someone to come in now. 了 does not split 进来, and 过 tells of the past. | “请进来”是请人现在进来。“了”不能把“进来”分开，“过”说的是过去。
  上楼来吧 | 楼上来吧去 | The place goes between 上 and 来: 上楼来. 吧 ends the sentence, and 来 and 去 point opposite ways. | 地点放在“上”和“来”中间：上楼来。“吧”放在句末，“来”和“去”方向相反。
  进房间去 | 房间进去了 | The place goes between 进 and 去: 进房间去. The place cannot come before 进. | 地点放在“进”和“去”中间：进房间去。地点不能放在“进”前面。
  回来了 | 回了来去 | 回来 stays together and 了 follows it: 回来了. 来 and 去 point opposite ways. | “回来”连在一起，后面加“了”：回来了。“来”和“去”方向相反。
  进房间来 | 房间进来去 | The place goes between 进 and 来: 进房间来. 来 and 去 point opposite ways. | 地点放在“进”和“来”中间：进房间来。“来”和“去”方向相反。
  就要 | 快要 | With a time word or a length of time before it, say 就要…了. 快要 does not follow one. | 前面有时间词或时长时，用“就要……了”。“快要”不能跟在它们后面。
  就要 | 快 | With a time word such as 明天, say 就要…了. 快…了 is not used after a time word. | 前面有时间词“明天”时，用“就要……了”。“快……了”不能用在时间词后面。
  就要 | 正要了 | 就要…了 says something will happen soon. 正要 means “just about to” and is not followed by 了 here. | “就要……了”说事情快要发生。“正要”表示正打算，后面不加“了”。
  回国 | 回过国 | 就要…了 is about what will happen soon. 过 tells of the past and does not fit. | “就要……了”说将要发生的事。“过”说过去的经历，不合适。
  下课 | 下过课 | 就要…了 is about what will happen soon. 过 tells of the past and does not fit. | “就要……了”说将要发生的事。“过”说过去的经历，不合适。
  次 | 回个 | 次 counts times and takes no 个. 回 can also count times, but 个 after it is wrong. | “次”数次数，不加“个”。“回”也能数次数，但后面不能加“个”。
  两次 | 二次个 | Before a measure word, two is 两: 两次. A measure word is not followed by 个. | 量词前面说“两”：两次。量词后面也不加“个”。
  好几 | 好多个 | 好几遍 means “quite a few times”. 遍 is a measure word, so 个 has no place before it. | “好几遍”是很多遍。“遍”是量词，前面不能再用“个”。
  这儿 | 这个 | 在 needs a place after it: 在这儿. 这个 means “this one” and is not a place. | “在”后面要接地点：在这儿。“这个”是“这一个”，不是地点。
  这儿 | 这么 | 在 needs a place after it: 在这儿. 这么 means “so” and is not a place. | “在”后面要接地点：在这儿。“这么”表示程度，不是地点。
  这儿 | 这样 | 在 needs a place after it: 在这儿. 这样 means “like this” and is not a place. | “在”后面要接地点：在这儿。“这样”是方式，不是地点。
  全都 | 全部的 | Before a verb, “all” is 全都: 全都去过. 全部的 goes before a noun, not before a verb. | 动词前说“全都”：全都去过。“全部的”放在名词前，不能放在动词前。
  全部 | 全个 | 全部 is one word, “all of them”. 个 is a measure word and cannot replace 部 in it. | “全部”是一个词，表示所有的。“个”是量词，不能替换“部”。
  愿意 | 愿着 | 愿意 is one word, “to be willing”. 着 cannot replace 意 in it. | “愿意”是一个词，表示乐意。“着”不能替换“意”。
  愿 | 意 | The question repeats the first character: 愿不愿意. It starts with 愿, not 意. | 正反问重复第一个字：愿不愿意。开头是“愿”，不是“意”。
  愿 | 希 | The question repeats the first character of 愿意: 愿不愿意. 希 belongs to 希望, another word. | 正反问重复“愿意”的第一个字：愿不愿意。“希”是“希望”里的字。
  愿 | 望 | The question repeats the first character of 愿意: 愿不愿意. 望 belongs to 希望, another word. | 正反问重复“愿意”的第一个字：愿不愿意。“望”是“希望”里的字。
  自己 | 大家们 | 自己 means “oneself”. 大家 already means everyone and never takes 们. | “自己”指本人。“大家”已经指所有人，后面不加“们”。
  大家 | 自己们 | 大家 means “everyone”. 自己 means “oneself”, and it never takes 们. | “大家”指所有人。“自己”指本人，后面不加“们”。
  大家 | 别的人们 | 大家 means “everyone”, which fits all liking the teacher. 别的人们 is not said: 别的 and 们 do not go together. | “大家”指所有人，正合“都很喜欢”。不说“别的人们”。
  自己 | 别人们 | 自己 means “oneself”. 别人 means other people and never takes 们. | “自己”指本人。“别人”指其他人，后面不加“们”。
  别人 | 自己们 | 别人 means “other people”. 自己 means “oneself” and never takes 们. | “别人”指其他人。“自己”指本人，后面不加“们”。
  大家 | 别人们 | 大家 means “everyone”. 别人 never takes 们. | “大家”指所有人。“别人”后面不加“们”。
  别人 | 大家们 | 别人 means “other people”. 大家 means everyone and never takes 们. | “别人”指其他人。“大家”指所有人，后面不加“们”。
  觉得 | 觉的 | 觉得 is one word, “to feel, to think”, written with 得. 的 cannot take the place of 得 in it. | “觉得”是一个词，用“得”。“的”不能替换其中的“得”。
  怎么样 | 什么样的了 | 怎么样 asks for an opinion and ends the question. 什么样的 asks what kind, and 了 does not follow it. | “怎么样”问看法，放在句末。“什么样的”问哪一种，后面也不加“了”。
  睡 | 睡着了着 | Here the plain verb 睡 is needed. 了 and 着 cannot both follow it. | 这里要用动词原形“睡”。“了”“着”不能都跟在后面。
  觉不觉得 | 得不得觉 | The question repeats the first character: 觉不觉得. The word 觉得 keeps 觉 first. | 正反问重复第一个字：觉不觉得。“觉得”里“觉”在前面。
  担心 | 担着心了 | 为…担心 says a habit of worry with 常常. 着 and 了 do not go inside it here. | 和“常常”连用说经常担心，这里“担心”中间不加“着”和“了”。
  高兴 | 高的兴 | 高兴 is one word, “happy”, and 的 cannot go inside it. | “高兴”是一个词，“的”不能放进中间。
  担心 | 担的心 | 担心 is one word here, “to worry”, and 的 cannot go inside it. | 这里“担心”是一个词，“的”不能放进中间。
  变成 | 变得 | 变成 is followed by a noun: 变成了冰. 变得 is followed by an adjective, such as 变得很冷. | “变成”后面接名词：变成了冰。“变得”后面接形容词，如“变得很冷”。
  变成 | 变了 | 变成 says what something turns into: 变成了冰. 变了了 has 了 twice and no 成. | “变成”说变为什么东西：变成了冰。“变了了”用了两个“了”，也少了“成”。
  变成 | 变着 | 变成 says what something turns into. 着 says an action goes on, and it cannot link 变 to 冰. | “变成”说变为什么。“着”表示持续，不能把“变”和“冰”连起来。
  变 | 化 | 变得很快 says it changes fast: 变 is the verb before 得. 化 alone is not used as this verb. | “变得很快”中“变”是动词。“化”不单用作这个动词。
  变化 | 变成化 | 变化 is one word, “change”. 成 cannot go inside it. | “变化”是一个词，“成”不能放进中间。
  别人 | 别们 | 别人 is one word, “other people”. 们 cannot replace 人 in it. | “别人”是一个词。“们”不能替换其中的“人”。
  海边 | 海的边 | 海边 is one word, “the seaside”. 的 does not go inside it. | “海边”是一个词，“的”不能放进中间。
  可以 | 能可 | 可以 is one word, “may, can”. 能可 is not a word: 能 and 可以 are each used alone. | “可以”是一个词。“能可”不成词，“能”和“可以”要分开单用。
  有多 | 很多 | 有多长 asks how long. 很多 means “many” and cannot stand before 长. | “有多长”问有多长。“很多”是数量多，不能放在“长”前面。
  多大 | 什么大 | 多 asks how much before an adjective: 多大. 什么 goes before a noun. | 形容词前问程度用“多”：多大。“什么”放在名词前面。
  多大 | 多少大 | 多 alone goes before an adjective: 多大. 多少 asks a number and goes before a noun or measure word. | 形容词前只用“多”：多大。“多少”问数量，放在名词或量词前。
  差不多 | 差不 | 差不多 is one word, “about, almost”. 差不 is not a word. | “差不多”是一个词，表示相差很少、将近。“差不”不成词。
  差不多 | 差多 | 差不多 is one word, “almost”. Without 不, 差多 means a big gap, the opposite. | “差不多”是一个词，意思是将近。少了“不”，“差多”反而是相差多。
  看书 | 看着了书 | 一边…一边… joins two actions at the same time with plain verbs. 着 and 了 do not go in. | “一边……一边……”连接同时进行的两个动作，动词不加“着”“了”。
  看书 | 看过了了书 | 一边…一边… joins two actions at the same time with plain verbs. 过 and 了 do not go in. | “一边……一边……”连接同时进行的动作，动词不加“过”“了”。
  看书 | 看看了书 | 一边…一边… takes plain verbs. The verb is not doubled, and 了 does not go in. | “一边……一边……”后面用动词原形，不重叠，也不加“了”。
  看 | 看看了 | 一边…一边… takes plain verbs. The verb is not doubled, and 了 does not go in. | “一边……一边……”后面用动词原形，不重叠，也不加“了”。
  拍照片 | 拍着了照片 | 一边…一边… joins two actions at the same time with plain verbs. 着 and 了 do not go in. | “一边……一边……”连接同时进行的两个动作，动词不加“着”“了”。
  拍照片 | 拍过了了照片 | 一边…一边… joins two actions at the same time with plain verbs. 过 and 了 do not go in. | “一边……一边……”连接同时进行的动作，动词不加“过”“了”。
  拍照片 | 拍拍了照片 | 一边…一边… takes plain verbs. The verb is not doubled, and 了 does not go in. | “一边……一边……”后面用动词原形，不重叠，也不加“了”。
  又高又 | 一边高一边 | 一边…一边… joins actions. Two qualities at once are joined with 又…又…: 又高又大. | “一边……一边……”连接动作。两个性质同时存在用“又……又……”：又高又大。
  又高又大 | 一边高大 | Two qualities are joined with 又…又…, each word with its own 又: 又高又大. | 两个性质用“又……又……”，每个词前面都有“又”：又高又大。
  又高又大 | 高一边大一边 | Two qualities are joined with 又…又…, and 又 comes before each word. 一边 is for actions. | 两个性质用“又……又……”，“又”放在每个词前面。“一边”用于动作。
  听见 | 听完了 | 没听见 says the sound did not reach me. 听完 says listening to the end, and 没 takes no 了. | “没听见”说没听到声音。“听完”是听到结束，而且用“没”时不加“了”。
  听见 | 听好了 | 没听见 says the sound did not reach me. 听好 means to listen well, and 没 takes no 了. | “没听见”说没听到声音。“听好”是好好听，而且用“没”时不加“了”。
  听见 | 听着 | Hearing a sound is the result 见: 听见. 着 says listening goes on, not that the sound was heard. | 听到声音的结果用“见”：听见。“着”表示正在听，不表示听到了。
  找到 | 找见了 | The result of looking for something is 到: 找到. 找见 is a regional form, and 了 is said once here, at the end. | 找东西的结果用“到”：找到。这里“了”只在句末用一次。
  找到 | 找着 | 找到 gives the result: the thing is found. 着 after a verb usually says the action goes on, not that it ended in finding. | “找到”说出结果：找到了。“着”放在动词后一般表示动作持续，不表示找到了。
  找到 | 找过了 | 找过 says he has looked before. The sentence says he found it, so it needs 到. | “找过”是曾经找过。这里说找到了，要用“到”。
  看见 | 看完 | 看见 says the eyes caught it. 看完 means to finish reading or watching something, which does not fit here. | “看见”说眼睛看到了。“看完”是看到结束，这里不合适。
  看见 | 看好 | 看见 says the eyes caught it. 看好 means to look after something, or to think it will do well. | “看见”说眼睛看到了。“看好”是看管，或认为会成功。
  看见 | 看着 | 看见…了 says one saw it. 看着 says someone is looking, not that he saw it. | “看见……了”说看到了。“看着”表示正在看，不表示看到了。
  找到 | 找见 | 一直没找到 says he has not found it. 找到 is the standard result form. | “一直没找到”说一直没找到。标准说法用“找到”。
  找到 | 找了 | 没 cannot go with 了 here. 找到 says the result, finding it. | 这里“没”不能和“了”一起用。“找到”说出结果。
  就去 | 过去 | 下了课就去 says he goes right after class. 过去 does not link the two actions in time. | “下了课就去”说下课后马上去。“过去”不能把两个动作在时间上连起来。
  睡觉 | 睡着觉了了 | After 就 comes the plain verb: 就睡觉. 着 and two 了 do not go in. | “就”后面用动词原形：就睡觉。不加“着”，也不用两个“了”。
  听说 | 听见说 | 听说 is one word, “to hear it said”. 见 does not go inside it. | “听说”是一个词，“见”不能放进中间。
  听说 | 听到说 | 听说 is one word, “to hear it said”. 到 does not go inside it. | “听说”是一个词，“到”不能放进中间。
  听说 | 看说 | News you heard from others is 听说. 看说 is not a word. | 从别人那里听来的消息说“听说”。“看说”不成词。
  听说 | 说说 | 听说 at the start says “I hear that…”. 说说 means “talk about it” and asks someone to speak. | 句首的“听说”表示听别人说。“说说”是请人说一说。
  听说 | 讲说 | News you heard from others is 听说. 讲说 is not a word. | 从别人那里听来的消息说“听说”。“讲说”不成词。
  听说 | 听看 | 听说 is one word, “to hear it said”. 听看 is not a word. | “听说”是一个词。“听看”不成词。
  听说 | 听了说 | 听说 is one word. 了 does not go inside it. | “听说”是一个词，“了”不能放进中间。
  听说 | 听过说 | 听说 is one word. 过 does not go inside it. | “听说”是一个词，“过”不能放进中间。
  很好吃 | 好吃好了 | The news is simply that they are tasty: 很好吃. 好吃 is not repeated, and 了 has no place. | 消息就是饺子很好吃：很好吃。“好吃”不重复，也不加“了”。
  听说 | 听着说 | 听说 is one word. 着 does not go inside it. | “听说”是一个词，“着”不能放进中间。
  听说明天 | 听着说明天 | 听说 is one word, at the start of the sentence. 着 does not go inside it. | “听说”是一个词，放在句首，“着”不能放进中间。
  说明天 | 说了过明天 | 听老师说 tells who the news came from. 说 takes no 了 or 过 here. | “听老师说”说消息来自谁，这里“说”后面不加“了”“过”。
  老师说明天 | 着老师说过了明天 | The pattern is 听 + person + 说: 听老师说. 着, 过 and 了 do not go in it. | 格式是“听+人+说”：听老师说。中间不加“着”“过”“了”。
  听同学说 | 听说过了同学 | The person goes between 听 and 说: 听同学说. 过 and 了 do not go in. | 人放在“听”和“说”中间：听同学说。不加“过”“了”。
  在唱歌 | 唱着歌了 | 在 before the verb says it is going on now: 在唱歌的人. 了 says it is over, which clashes. | 动词前的“在”表示正在进行：在唱歌的人。“了”表示完成，二者矛盾。
  在唱歌 | 唱歌了过 | 在 before the verb says it is going on now. 了 and 过 tell of the past. | 动词前的“在”表示正在进行。“了”“过”说的是过去。
  的 | 们 | 什么的 ends a list: “and so on”. 们 marks more than one person and cannot follow 什么. | “什么的”放在列举后面，表示“等等”。“们”表示人的复数，不能放在“什么”后面。
  认为 | 认得为 | 认为 is one word, “to think”. 得 does not go inside it. | “认为”是一个词，“得”不能放进中间。
  怎么样 | 哪个样 | 怎么样 asks for an opinion. 哪个样 is not said. | “怎么样”问看法。不说“哪个样”。
  怎么样 | 怎么了样 | 怎么样 is one word; 了 cannot go inside it. | “怎么样”是一个词，“了”不能放进中间。
  怎么样 | 什么样了 | 怎么样 asks for an opinion. 什么样 asks what kind, and 了 does not follow it. | “怎么样”问看法。“什么样”问哪一种，后面也不加“了”。
  认为 | 认了为 | 认为 is one word. 了 does not go inside it. | “认为”是一个词，“了”不能放进中间。
  每天 | 也天 | 每天 means “every day”, and 都 after it sums up all days. 也 does not go before 天. | “每天”是每一天，后面“都”总括所有日子。“也”不能放在“天”前面。
  每天 | 有天 | 每天…都 means every day. 有天 means “one day” and does not go with 都. | “每天……都”是每一天。“有天”是某一天，不和“都”连用。
  每天 | 很天 | 每天 means “every day”. 很 goes before an adjective, and 天 is not one. | “每天”是每一天。“很”放在形容词前面，“天”不是形容词。
  都 | 每 | 每 goes before the noun and 都 goes before the verb: 每个人都要. The verb needs 都. | “每”在名词前，“都”在动词前：每个人都要。动词前要用“都”。
  每次 | 每个次 | 次 is itself a measure word. 每 goes right before it: 每次. | “次”本身是量词，“每”直接放在前面：每次。
  你 | 你们们 | 们 is said once. And 还是你去吧 picks one person: 你. | “们”只用一次。“还是你去吧”是选一个人：你。
  新婚 | 新的婚 | 新婚 is a set word in the wish 新婚快乐. 的 does not go inside it. | “新婚”是固定词，用于祝愿“新婚快乐”，“的”不能放进中间。
  健康 | 健健 | 健康 is one word, “healthy”. 健健 is not a word. | “健康”是一个词，意思是身体好。“健健”不成词。
  一会儿 | 一个会儿 | 一会儿 is a short time and takes no measure word. 个 has no place in it. | “一会儿”表示短时间，不用量词，“个”多余。
  看一会儿书 | 看书一会儿着 | How long goes between the verb and its object: 看一会儿书. 着 cannot end the sentence here. | 时长放在动词和宾语中间：看一会儿书。“着”不能放在句末。
  着看 | 好看 | 坐着看 says how she watches: sitting. 好看 means “good-looking”. | “坐着看”说用什么样子看：坐着。“好看”是漂亮的意思。
  着 | 好 | 开着 says the door is open and stays so. 开好 says it was opened as planned. | “开着”说门一直开着。“开好”是说已经开好了。
  看书 | 看着书着 | 坐着 already says how he reads. The second verb takes no 着: 看书. | “坐着”已经说了方式，后面的动词不再加“着”：看书。
  吃饭 | 吃着饭着 | 站着 already says how he eats. The second verb takes no 着: 吃饭. | “站着”已经说了方式，后面的动词不再加“着”：吃饭。
  睡在 | 睡着 | 睡在 says where he sleeps, with the place after 在. 睡着 means “fall asleep” and cannot take a place. | “睡在”说在哪儿睡，“在”后面接地点。“睡着”是入睡，不能接地点。
  我 | 我们的 | The subject here is one person, 我. 我们的 means “our” and needs a noun after it. | 这里主语是一个人：我。“我们的”后面要接名词。
  不敢 | 不勇 | 不敢 means “not dare”. 勇 is used only in the word 勇敢 and does not stand alone as a verb. | “不敢”是没有胆量做。“勇”只用在“勇敢”这个词里，不能单用作动词。
  敢 | 勇 | 敢 goes before a verb: 敢做. 勇 is part of 勇敢 and cannot go before a verb alone. | “敢”放在动词前：敢做。“勇”是“勇敢”里的字，不能单独放在动词前。
  敢 | 不敢了着 | 我敢说 means “I can say for sure”. 不敢 says the opposite, and 了 and 着 have no place. | “我敢说”表示有把握地说。“不敢”意思相反，“了”“着”也多余。
  说话 | 说着话了 | After 不敢 or 不肯 comes the plain verb: 说话. 着 and 了 do not go in. | “不敢”“不肯”后面接动词原形：说话。不加“着”和“了”。
  敢不敢 | 勇不勇 | The question is 敢不敢. 勇 does not stand alone as a verb. | 正反问是“敢不敢”。“勇”不能单用作动词。
  不能 | 没能了 | 简直不能 says it cannot be done. 没能 tells of the past, and 了 does not go after it. | “简直不能”说没法做。“没能”说过去没做成，后面也不加“了”。
  没有意思 | 不有意思 | 有 is negated with 没, never with 不: 没有意思. | “有”的否定用“没”，不用“不”：没有意思。
  没有意思 | 不是有意思 | 有 is negated with 没: 没有意思. 不是 does not go before 有. | “有”的否定用“没”：没有意思。“不是”不能放在“有”前面。
  不管 | 别管 | 完全不管别人 says he takes no notice of others. 别管 tells someone not to take notice. | “完全不管别人”说他不理别人。“别管”是让别人不要管。
  不管 | 无管 | 不管 means “take no notice of”. 无管 is not a word. | “不管”表示不理。“无管”不成词。
  不管 | 着管 | 不 goes before 管 to say he does not care: 不管. 着 cannot stand before a verb. | “不”放在“管”前面表示不理：不管。“着”不能放在动词前面。
  天 | 聊 | 聊天 splits around the time: 聊了一会儿天. The second part is 天, not 聊 again. | “聊天”中间可以插入时长：聊了一会儿天。后半部分是“天”，不是再说一遍“聊”。
  架 | 个吵架 | 吵架 splits around 了一: 吵了一架. The second part is only 架, and it takes no 个. | “吵架”中间插入“了一”：吵了一架。后半部分只说“架”，不加“个”。
  吵架 | 吵他架 | The person goes before the verb with 跟: 跟他吵架. 吵架 does not take a person inside it. | 对象用“跟”放在动词前面：跟他吵架。“吵架”中间不能放人。
  跟朋友见面 | 见朋友面 | 见面 does not take the person inside. Say 跟朋友见面, with 跟 before it. | “见面”中间不能放人，要说“跟朋友见面”，用“跟”引出对象。
  帮了我的忙 | 帮忙了我 | 帮忙 takes no object after it. The person goes inside: 帮了我的忙. | “帮忙”后面不能带宾语，人要放在中间：帮了我的忙。
  帮了我的忙 | 帮忙我了 | 帮忙 takes no object after it. The person goes inside: 帮了我的忙. | “帮忙”后面不能带宾语，人要放在中间：帮了我的忙。
  聊了一会儿天 | 聊天聊天了一会儿 | 聊天 splits to take 了 and the time inside: 聊了一会儿天. It is not said twice. | “聊天”要分开，把“了”和时长放在中间：聊了一会儿天。不说两遍。
  结婚了 | 结了婚了婚 | 结婚 is said once: 结婚了 or 结了婚. 婚 does not come twice. | “结婚”只说一次：结婚了，或结了婚。“婚”不能出现两次。
  跟他吵架 | 吵他架 | The person goes before the verb with 跟: 跟他吵架. 吵架 does not take a person inside it. | 对象用“跟”放在动词前：跟他吵架。“吵架”中间不能放人。
  跟老同学见了面 | 见面了老同学 | 见面 takes no object after it. Say 跟老同学见了面, with 了 inside 见面. | “见面”后面不能带宾语，要说“跟老同学见了面”，“了”放在中间。
  互相 | 相互相 | 互相 is one word, “each other”. 相 is not said again before it. | “互相”是一个词，前面不再加“相”。
  不说话 | 没说着话 | 互相不说话 says they are not speaking, now and for some time. 没 and 着 do not fit a state like this. | “互相不说话”说他们一直不说话。“没”和“着”不用于这种状态。
  看了看 | 看看了了 | A short action in the past is 看了看, with 了 between the two 看. 了 is not doubled. | 已经做过的短动作说“看了看”，“了”放在两个“看”中间，不能重复。
  送给 | 送跟 | 送给 marks who receives the gift: 送给他. 跟 means “with” and does not mark a receiver. | “送给”引出接受的人：送给他。“跟”表示“和”，不引出接受者。
  送给 | 送对 | 送给 marks who receives the gift. 对 marks who an action is aimed at, not who receives. | “送给”引出接受的人。“对”表示对象，不表示接受者。
  送给 | 送从 | 送给 marks who receives the gift. 从 marks where something comes from. | “送给”引出接受的人。“从”表示起点。
  好听 | 好着听 | 好好 is said twice before the verb: 好好听. 着 has no place between them. | “好好”放在动词前：好好听。中间不能加“着”。
  好听 | 的听 | 好好 is said twice before the verb: 好好听. 好的 does not go before a verb. | “好好”放在动词前：好好听。“好的”不能放在动词前。
  好听 | 得听 | 好好 goes before the verb: 好好听. 得 goes after a verb, not between 好 and 听. | “好好”放在动词前：好好听。“得”放在动词后面，不能放在“好”和“听”中间。
  记住 | 记着住 | 记住 is a verb with its result. 着 cannot go between them. | “记住”是动词加结果补语，“着”不能放在中间。
  明白 | 明着白 | 明白 is one word. 着 cannot go inside it. | “明白”是一个词，“着”不能放进中间。
  收到 | 收着到 | 收到 is a verb with its result. 着 cannot go between them. | “收到”是动词加结果补语，“着”不能放在中间。
  解决 | 解着决 | 解决 is one word. 着 cannot go inside it. | “解决”是一个词，“着”不能放进中间。
  同意 | 同着意 | 同意 is one word. 着 cannot go inside it. | “同意”是一个词，“着”不能放进中间。
  故事 | 故的事 | 故事 is one word, “story”. 的 cannot go inside it. | “故事”是一个词，“的”不能放进中间。
  通过 | 通着 | 通过了 says it was passed. 着 says an action goes on and does not say it passed. | “通过了”说已经通过。“着”表示持续，不说结果。
  通过 | 通得 | 通过 is one word, “to pass”. 得 cannot replace 过 in it. | “通过”是一个词。“得”不能替换其中的“过”。
  不去 | 吗 | 究竟 goes with a question word or an A-not-A question: 去不去. It does not go with 吗. | “究竟”和疑问词或正反问连用：去不去。不和“吗”连用。
  哪儿 | 那儿吗 | 究竟 asks with a question word: 去哪儿. 那儿 means “there” and is not a question, and 究竟 takes no 吗. | “究竟”要和疑问词连用：去哪儿。“那儿”不是疑问词，“究竟”也不和“吗”连用。
  没关系 | 不关系 | 没关系 is a set phrase, “it doesn't matter”. 关系 is a noun and is negated with 没. | “没关系”是固定说法。“关系”是名词，否定用“没”。
  没关系 | 别关系 | 没关系 is a set phrase, “it doesn't matter”. 别 goes before a verb to say “don't”. | “没关系”是固定说法。“别”放在动词前表示“不要”。
  没关系 | 非关系 | 没关系 is a set phrase, “it doesn't matter”. 非关系 is not said. | “没关系”是固定说法。不说“非关系”。
  甚至 | 而甚 | 甚至 is one word, “even”, before what it stresses. 而 does not go before 甚. | “甚至”是一个词，放在强调的内容前面。“而”不能放在“甚”前。
  不大不小，正好 | 正好不大不小着 | 正好 here sums up after the comma: 不大不小，正好. 着 cannot end the sentence. | 这里“正好”在逗号后总结：不大不小，正好。“着”不能放在句末。
  少吃 | 小吃 | 少 before a verb means “do less of it”: 少吃. 小吃 is a noun, “snacks”. | “少”放在动词前表示少做：少吃。“小吃”是名词，指零食。
  早点儿 | 早得点儿 | 早点儿 means “a bit earlier” and goes before the verb. 得 does not go inside it. | “早点儿”表示早一些，放在动词前。“得”不能放进中间。
  生病 | 生着病了 | After 由于 comes the cause, in plain words: 由于生病. 着 and 了 do not go in. | “由于”后面说原因，用原形：由于生病。不加“着”和“了”。
  不够 | 没够了 | After 得, “not enough” is 不够. 没 and 了 do not fit after 得. | “得”后面说“不够”。“得”后面不用“没”和“了”。
  拿走 | 拿着 | 被…拿走了 says the books are gone. 拿着 says someone is holding them. | “被……拿走了”说书被拿没了。“拿着”是说手里拿着。
  拿走 | 拿在 | 拿走 says the books are taken away. 在 needs a place after it. | “拿走”说书被拿走了。“在”后面要接地点。
  拿走 | 拿很 | 拿走 is a verb with its result. 很 goes before an adjective, not after a verb. | “拿走”是动词加结果。“很”放在形容词前面，不能放在动词后面。
  送给 | 送在 | 送给 marks who receives: 送给了邻居. 在 marks a place, and 邻居 is a person. | “送给”引出接受的人：送给了邻居。“在”引出地点，“邻居”是人。
  送给 | 送成 | 送给 marks who receives. 成 says what something turns into. | “送给”引出接受的人。“成”说变成什么。
  送给 | 送着 | 送给 marks who receives. 着 says an action goes on and cannot take a receiver. | “送给”引出接受的人。“着”表示持续，不能引出接受者。
  交给 | 交成 | 交给 marks who receives. 成 says what something turns into. | “交给”引出接受的人。“成”说变成什么。
  交给 | 交在 | 交给 marks who receives: 交给谁. 在 marks a place, and 谁 is a person. | “交给”引出接受的人：交给谁。“在”引出地点，“谁”是人。
  交给 | 交着 | 交给 marks who receives. 着 says an action goes on and cannot take a receiver. | “交给”引出接受的人。“着”表示持续，不能引出接受者。
  看不 | 没看得 | 看不清楚 says one cannot see clearly. The potential form puts 不 between the verb and its result; 没…得 is not a form. | “看不清楚”表示没法看清。可能补语把“不”放在动词和结果中间，没有“没……得”这种说法。
  下雪 | 下过着雪 | 竟然下雪了 says snow is falling now, to one's surprise. 过 and 着 do not go inside 下雪 here. | “竟然下雪了”说现在下雪了，出人意料。这里“下雪”中间不加“过”“着”。
  下雪 | 下地雪 | 下雪 is a verb and its object. 地 goes before a verb and cannot stand between 下 and 雪. | “下雪”是动词加宾语。“地”放在动词前面，不能放在“下”和“雪”中间。
  下雪 | 下得雪 | 下雪 is a verb and its object. 得 cannot stand between a verb and its object. | “下雪”是动词加宾语。“得”不能放在动词和宾语中间。
  不了 | 不过 | 吃不了 says one cannot eat that much. 吃不过 is not said. | “吃不了”表示吃不完那么多。不说“吃不过”。
  出来 | 出在 | 拿出来 says the phone came out toward the speaker. 在 needs a place. | “拿出来”说手机被拿出来。“在”后面要接地点。
  出来 | 出着 | 拿出来 says the phone came out. 着 says an action goes on, not a direction. | “拿出来”说手机被拿出来。“着”表示持续，不表示方向。
  出来 | 出到 | 拿出来 says the phone came out. 到 needs a place after it. | “拿出来”说手机被拿出来。“到”后面要接地点。
  出 | 起 | 出 says something comes out: out of a place, or a new idea out of thinking. 起 says rising, or calling back something already known. | “出”表示从里到外：离开某处，或想出新东西。“起”表示向上，或想起原来知道的事。
  回家 | 回去家 | The place goes between 回 and 去: 回家去. 去 cannot come before 家 here. | 地点放在“回”和“去”中间：回家去。“去”不能放在“家”前。
  回家 | 回来家 | The place goes between 回 and 去: 回家去. 来 cannot come before 家, and 来 and 去 point opposite ways. | 地点放在“回”和“去”中间：回家去。“来”不能放在“家”前，而且“来”“去”方向相反。
  回家 | 回着家 | The place goes right after 回: 回家去. 着 has no place between them. | 地点紧跟“回”：回家去。中间不能加“着”。
  回去 | 回来去 | 放回去 puts the books back where they came from. 来 and 去 point opposite ways and are not used together. | “放回去”是把书放回原处。“来”和“去”方向相反，不能连用。
  回来 | 回去来 | 买回来 says it was brought back here. 去 and 来 point opposite ways and are not used together. | “买回来”说买了带回这里。“去”和“来”方向相反，不能连用。
  回来 | 回着 | 买回来 says he brought it back here. 着 says an action goes on, not a direction. | “买回来”说买了带回来。“着”表示持续，不表示方向。
  回来 | 回进 | 买回来 says he brought it back here. 回进 is not a direction word. | “买回来”说买了带回来。“回进”不是趋向补语。
  起来 | 开来 | 起来 here says up, or back to mind: 站起来, 想起来. 开来 says something spreads out. | 这里“起来”表示向上或回想起来：站起来、想起来。“开来”表示散开。
  来 | 起 | 下起雨来 says rain has started. 起…来 go around the object: 起 before 雨 and 来 after it. | “下起雨来”说开始下雨。“起……来”把宾语夹在中间：“起”在“雨”前，“来”在“雨”后。
  不起来 | 不过去 | 想不起来 says one cannot remember. 想不过去 is not said. | “想不起来”表示记不起。不说“想不过去”。
  收起来 | 收下去 | 收起来 says to gather things up and put them away. 收下去 is not said that way. | “收起来”表示把东西收好。不说“收下去”。
  下去 | 起去 | 下去 after a verb says to keep on doing it. 起去 is not a direction word. | 动词后的“下去”表示继续做下去。“起去”不是趋向补语。
  下来 | 起去 | 下来 here says something comes to rest or is kept: 停下来, 记下来. 起去 is not a direction word. | 这里“下来”表示停住或留下：停下来、记下来。“起去”不是趋向补语。
  留下来 | 留起去 | 留下来 says to keep something. 起去 is not a direction word. | “留下来”表示保留。“起去”不是趋向补语。
  留下来 | 留上去 | 留下来 says to keep something. 上去 is a move up and away, which does not fit. | “留下来”表示保留。“上去”表示向上离开，不合适。
  下来了 | 了下了来 | 黑下来 says it got dark, and 了 ends the sentence. 了 does not go inside 下来 or before it. | “黑下来”表示天变黑，“了”放在句末，不能放在“下来”中间或前面。
  出来 | 起去 | 出来 says something comes out or is told apart. 起去 is not a direction word. | “出来”表示出来或辨认出来。“起去”不是趋向补语。
  不出来 | 不过去 | 认不出来 and 听不出来 say one cannot tell what it is. 不过去 is not said this way. | “认不出来”“听不出来”表示辨认不出。不这样说“不过去”。
  看出来 | 看起来 | 看出来 says one noticed something. 看起来 means “it looks” and gives an opinion. | “看出来”表示发现了某事。“看起来”是从外表判断。
  就能 | 才能 | 只要 pairs with 就: 只要…就…. 才 pairs with 只有. | “只要”和“就”搭配：只要……就……。“才”和“只有”搭配。
  好不 | 很 | 不管 needs a choice or a question word after it, such as 好不好. 很好 is a plain statement. | “不管”后面要接选择或疑问词，如“好不好”。“很好”是普通陈述。
  不好 | 了 | 不管 needs a choice after it: 好不好. 好了 is a plain statement. | “不管”后面要接选择：好不好。“好了”是陈述。
  不好 | 吗 | 不管 takes an A-not-A choice: 好不好. It does not take 吗. | “不管”后面用正反形式：好不好。不用“吗”。
  怎么样 | 很好 | 不管 needs a question word after it: 怎么样. 很好 is a plain statement. | “不管”后面要接疑问词：怎么样。“很好”是陈述。
  谁 | 有人 | 不管 needs a question word after it: 谁. 有人 is a plain statement. | “不管”后面要接疑问词：谁。“有人”是陈述。
  一杯 | 杯子 | A number and a measure word go before 茶: 一杯茶. 杯子 is a noun and cannot go before 茶. | 数量词放在“茶”前：一杯茶。“杯子”是名词，不能放在“茶”前面。
  进来 | 着进 | 走进来 says someone came in. 着 says an action goes on and does not come before 进. | “走进来”说有人进来了。“着”表示持续，不能放在“进”前。
  多 | 很多地 | 多 before a verb means “do more of it”: 多练习. 很多 goes before a noun. | “多”放在动词前表示多做：多练习。“很多”放在名词前。
  一口 | 每口 | 一口…也没 says “not even one mouthful”. 每 does not go with 也没 this way. | “一口……也没”表示连一口都没有。“每”不能这样和“也没”连用。
  好 | 好多了 | 不如 says one is not as good as the other. 好多了 says “much better”, which does not follow 不如. | “不如”说比不上。“好多了”是好很多，不能接在“不如”后面。
  不如用 | 比不用 | 不如 says “not as good as”: A 不如 B 方便. 比 needs B before the adjective, and 不 has no place. | “不如”表示比不上：A不如B方便。“比”后面接比较对象，“不”多余。
  得多 | 很 | After an adjective in a 比 sentence, “much more” is 得多. 很 cannot go in a 比 sentence. | “比”字句里形容词后面说“得多”。“比”字句里不能用“很”。
  得多 | 非常 | In a 比 sentence, “much more” is 得多 after the adjective. 非常 cannot go in a 比 sentence. | “比”字句里形容词后用“得多”。“比”字句里不能用“非常”。
  多了 | 很 | In a 比 sentence, “much more” is 多了 after the adjective. 很 cannot go in a 比 sentence. | “比”字句里形容词后用“多了”。“比”字句里不能用“很”。
  多了 | 非常 | In a 比 sentence, “much more” is 多了 after the adjective. 非常 cannot go in a 比 sentence. | “比”字句里形容词后用“多了”。“比”字句里不能用“非常”。
  多了 | 太 | In a 比 sentence, “much more” is 多了 after the adjective. 太 cannot go in a 比 sentence. | “比”字句里形容词后用“多了”。“比”字句里不能用“太”。
  多多 | 很多 | In a 比 sentence, 很 cannot go before the adjective. Say 多多了: 多 and then 多了. | “比”字句里形容词前不能用“很”。要说“多多了”。
  不用 | 都用 | 为了保护环境 gives the purpose, so we do not use plastic bags: 不用. 都用 says the opposite. | “为了保护环境”说目的，所以不用塑料袋：不用。“都用”意思相反。
  不用 | 就用 | 为了保护环境 gives the purpose, so we do not use plastic bags. 就用 says the opposite. | “为了保护环境”说目的，所以不用塑料袋。“就用”意思相反。
  不用 | 很用 | 很 goes before an adjective, not before the verb 用. The purpose needs 不用. | “很”放在形容词前，不能放在动词“用”前。这里要用“不用”。
  早就 | 早并 | 很早就 says they went early. 并 does not link 很早 to 去. | “很早就”说他们去得早。“并”不能把“很早”和“去”连起来。
  早就 | 早而 | 早就 says it happened early, or long ago. 而 joins two parts and does not link a time to a verb. | “早就”表示早已发生。“而”连接两部分，不能把时间和动词连起来。
  少花钱 | 花很少钱 | After 为了, 少 goes before the verb: 少花钱. 很少 before 钱 is not how it is said. | “为了”后面把“少”放在动词前：少花钱。不说“花很少钱”。
  多 | 少 | 一百多 means “over a hundred”. 少 is not used after a number this way. | “一百多”表示超过一百。“少”不能这样放在数字后。
  三 | 五 | Two numbers side by side give a rough number, and they must be next to each other: 两三. 两五 is not said. | 两个相邻的数字连用表示概数：两三。不说“两五”。
  睡了 | 睡着 | 睡了十个小时 says how long he slept. 睡着 means “fall asleep” and does not take a length of time here. | “睡了十个小时”说睡了多长时间。“睡着”是入睡，这里不能带时长。
  非少 | 不少 | The pattern is 非…不可: 非 before the action, 不可 at the end. 不…不可 is not the pattern. | 格式是“非……不可”：“非”在动作前，“不可”在句末。没有“不……不可”。
  看起来 | 看上来 | 看起来 means “it looks”. 看上来 is not said. | “看起来”是从外表判断。不说“看上来”。
  看起来 | 看下来 | 看起来 means “it looks”. 看下来 means “to watch to the end”. | “看起来”是从外表判断。“看下来”是从头看到尾。
  看起来 | 看出来 | 看起来 gives how it looks. 看出来 says one noticed something. | “看起来”说外表看上去怎样。“看出来”是发现了某事。
  看起来 | 看过来 | 看起来 gives how it looks. 看过来 means “look this way”. | “看起来”说外表看上去怎样。“看过来”是朝这边看。
  极了 | 极的 | 极了 goes after an adjective: 聪明极了. 了 is part of it, and 的 cannot replace it. | “极了”放在形容词后：聪明极了。“了”不能换成“的”。
  极了 | 很极 | 极了 follows the adjective alone. 很 cannot come before 极. | “极了”直接放在形容词后，前面不加“很”。
  好极了 | 好的极了 | 极了 follows the adjective directly: 好极了. 的 cannot go between them. | “极了”直接放在形容词后：好极了。中间不能加“的”。
  好极了 | 好着极了 | 极了 follows the adjective directly: 好极了. 着 cannot go between them. | “极了”直接放在形容词后：好极了。中间不能加“着”。
  好极了 | 好极 | The pattern is 极了, with 了: 好极了. 好极 alone does not end the sentence. | 格式是“极了”，要有“了”：好极了。“好极”不能单独结尾。
  好极了 | 好很极了 | 极了 follows the adjective directly: 好极了. 很 cannot go between them. | “极了”直接放在形容词后：好极了。中间不能加“很”。
  夜 | 过夜 | 熬夜 splits with 过 inside: 熬过夜. 过 is said once. | “熬夜”中间插入“过”：熬过夜。“过”只用一次。
  遇到 | 遇着 | 遇到 is the verb with its result 到. Before 过, 着 cannot take the place of 到. | “遇到”是动词加结果“到”。在“过”前面，“着”不能替换“到”。
  遇到 | 遇得 | 遇到 is the verb with its result 到. 得 cannot take the place of 到. | “遇到”是动词加结果“到”。“得”不能替换“到”。
  抽烟 | 抽过烟 | 从来不 says a habit, never doing it. 过 goes with 从来没, not with 从来不. | “从来不”说一向不做。“过”和“从来没”搭配，不和“从来不”搭配。
  十分 | 十 | Here 十分 is ten minutes: 差十分八点 means ten minutes to eight. Without 分, 差十八点 does not say how much time is left. | 这里的“十分”是十分钟：“差十分八点”是七点五十分。少了“分”，“差十八点”说不出差多少时间。
  关于 | 关着 | 关于 means “about” and goes before a topic. 关着 says something is shut, and it cannot introduce a topic. | “关于”引出话题，意思是“有关”。“关着”说东西关着，不能引出话题。
  死了 | 太 | 死了 after an adjective says “extremely”: 累死了. 太 goes before an adjective, not after it. | 形容词后面加“死了”表示程度极高：累死了。“太”要放在形容词前面，不能放在后面。
  死了 | 非常 | 死了 after an adjective says “extremely”: 累死了. 非常 goes before an adjective, not after it. | 形容词后面加“死了”表示程度极高：累死了。“非常”要放在形容词前面，不能放在后面。
  坏了 | 太 | 坏了 after a feeling says “terribly”: 饿坏了. 太 goes before an adjective, not after it. | 表示感受的词后面加“坏了”表示程度很高：饿坏了。“太”要放在形容词前面。
  坏了 | 很 | 坏了 after a feeling says “terribly”: 高兴坏了. 很 goes before an adjective, not after it. | 表示感受的词后面加“坏了”表示程度很高：高兴坏了。“很”要放在形容词前面。
  坏了 | 死 | The ending is 坏了 or 死了, with 了. 死 alone cannot end the sentence after an adjective. | 程度补语是“坏了”或“死了”，要带“了”。单用“死”不能放在形容词后结束句子。
  坏了 | 非常 | 坏了 after a feeling says “terribly”: 急坏了. 非常 goes before an adjective, not after it. | 表示感受的词后面加“坏了”表示程度很高：急坏了。“非常”要放在形容词前面。
  死了 | 坏 | The ending is 死了 or 坏了, with 了. 坏 alone cannot end the sentence after an adjective. | 程度补语是“死了”或“坏了”，要带“了”。单用“坏”不能放在形容词后结束句子。
  坏了 | 极 | After an adjective the ending is 极了 or 坏了, with 了. 极 alone cannot end it. | 形容词后面说“极了”或“坏了”，要带“了”。单用“极”不能结尾。
  死了 | 极 | After an adjective the ending is 极了 or 死了, with 了. 极 alone cannot end it. | 形容词后面说“极了”或“死了”，要带“了”。单用“极”不能结尾。
  十分 | 死了 | Before an adjective, the degree word is 十分. 死了 goes after an adjective, not before it. | 形容词前面表示程度用“十分”。“死了”放在形容词后面，不能放在前面。
  相当 | 坏了 | Before an adjective, the degree word is 相当. 坏了 goes after an adjective, not before it. | 形容词前面表示程度用“相当”。“坏了”放在形容词后面，不能放在前面。
  十分 | 坏了 | Before an adjective, the degree word is 十分. 坏了 goes after an adjective, not before it. | 形容词前面表示程度用“十分”。“坏了”放在形容词后面，不能放在前面。
  相当 | 死了 | Before an adjective, the degree word is 相当. 死了 goes after an adjective, not before it. | 形容词前面表示程度用“相当”。“死了”放在形容词后面，不能放在前面。
  不错 | 别错 | 不错 is a set word, “quite good”. 别 tells someone not to do something, and 别错 is not said. | “不错”是固定的词，表示相当好。“别”是叫人不要做某事，不说“别错”。
  不错 | 非错 | 不错 is a set word, “quite good”. 非错 is not said. | “不错”是固定的词，表示相当好。不说“非错”。
  十分大 | 得多大 | After 下得 comes the degree and the adjective: 十分大. 得 is said once, and 多 cannot stand there. | “下得”后面说程度和形容词：十分大。“得”只用一次，这里也不能用“多”。
  不熬夜 | 没熬夜过 | 再也不 says one will never do it again from now on. 没…过 tells of the past, which does not fit 以后. | “再也不”说以后再也不做。“没……过”说的是过去，不能和“以后”连用。
  不断 | 断了 | 不断 before a verb means “on and on”. 断了 means “broke off”, the opposite. | “不断”放在动词前表示连续不停。“断了”是断开了，意思相反。
  从明天起 | 自从明天以后 | 自从 looks back to a time in the past. For a time to come, say 从…起: 从明天起. | “自从”只用于过去的时间。说将来，要用“从……起”：从明天起。
  从下个月开始 | 自从下个月以后 | 自从 looks back to a time in the past. For a time to come, say 从…开始: 从下个月开始. | “自从”只用于过去的时间。说将来，要用“从……开始”：从下个月开始。
  坐得下 | 得坐下了 | Whether there is room is 坐得下, with 得 between the verb and 下. 得 cannot come first, and 了 has no place in the question. | 能不能容纳说“坐得下”，“得”放在动词和“下”中间。“得”不能放在前面，问句里也不用“了”。
  上 | 起 | 上 here says the action reaches its goal: 考上, 爱上. 起 does not give that result. | 这里的“上”表示达到目的：考上、爱上。“起”没有这个结果。
  戴上 | 戴开 | Putting a hat on is 戴上: 上 says it is now on. 开 says something comes apart or opens. | 戴帽子说“戴上”，“上”表示附着上去。“开”表示分开、打开。
  戴上 | 戴出 | Putting a hat on is 戴上: 上 says it is now on. 出 says something comes out. | 戴帽子说“戴上”，“上”表示附着上去。“出”表示从里到外。
  戴上 | 戴过 | 出门以前 points to this one time, and 戴上 says the hat is on. 过 tells of an experience, and it cannot go with 了 here. | “出门以前”说的是这一次，“戴上”说帽子戴好了。“过”说经历，这里也不能和“了”连用。
  一直下 | 一向地下 | 一直 says the rain went on without stopping. 一向 says something has always been so, and 地 does not follow it. | “一直”说雨一直不停。“一向”说一贯如此，后面也不加“地”。
  随便 | 时随 | 随便你 means “as you like”. 时随 is not a word. | “随便你”表示由你决定。“时随”不成词。
  要不然 | 要是 | 要不然 means “or else”: it says what would happen if not. 要是 means “if”, and it needs a condition, not a result, after it. | “要不然”表示“如果不这样”，后面说结果。“要是”是“如果”，后面要接条件，不接结果。
  要不 | 要是 | 要不 means “or else”, or offers another choice. 要是 means “if”, and it needs a condition after it. | “要不”表示“否则”，或提出另一个选择。“要是”是“如果”，后面要接条件。
  要不 | 不是 | 要不 means “or else”. 不是 says something is not so, and it does not give a result. | “要不”表示“否则”。“不是”是否定判断，不能引出后果。
  打开 | 打上 | Opening a window is 打开. 打上 does not mean to open. | 开窗户说“打开”。“打上”没有打开的意思。
  打开 | 打下 | Opening a window is 打开. 打下 means to knock down. | 开窗户说“打开”。“打下”是打落下来。
  打开 | 打起 | Opening a window is 打开. 打起 means to start or to lift. | 开窗户说“打开”。“打起”是开始或举起。
  离开 | 离起 | Going away is 离开. 离起 is not a word. | 走开说“离开”。“离起”不成词。
  开 | 起 | 让开 and 走开 mean to move away and make room. 起 does not give that meaning. | “让开”“走开”表示离开原处、让出地方。“起”没有这个意思。
  以内 | 以中 | Within a limit is 以内: 十分钟以内. 以中 is not said. | 在一定范围之内说“以内”：十分钟以内。不说“以中”。
  以上 | 以内 | 以上 means that number or more. 以内 means that number or less, so the rule turns round. | “以上”表示这个数和比它大的。“以内”是这个数和比它小的，意思反了。
  以外 | 以内 | 以外 means “outside” or “apart from”: 城市以外, 除了…以外. 以内 means “within”. | “以外”表示外面或排除：城市以外、除了……以外。“以内”表示在范围里面。
  下 | 中 | These phrases use 下: 一百块以下, 在…前提下. 中 does not go there. | 这些说法用“下”：一百块以下、在……前提下。不能用“中”。
  上 | 中 | These phrases use 上: 六十岁以上, 在…基础上. 中 does not go there. | 这些说法用“上”：六十岁以上、在……基础上。不能用“中”。
  等等 | 等到 | 等等 ends a list, “and so on”. 等到 means “wait until” and needs a time after it. | “等等”放在列举后面表示还有别的。“等到”是等到某个时候，后面要有时间。
  等 | 等等 | 等 is said once here. 等等 ends a list on its own: it does not go before a number, or before 着 or 了. | 这里只用一个“等”。“等等”单独结束列举，不放在数字前，也不放在“着”“了”前。
  看来 | 看见 | 在…看来 means “in …'s view”. 看见 means “to see” and cannot end this phrase. | “在……看来”表示“从……的角度看”。“看见”是看到，不能用在这个格式里。
  过 | 起 | 过 is right here: 去过 says one has been there, and 下得过 says one can beat someone. 起 gives neither meaning. | 这里要用“过”：“去过”表示经历，“下得过”表示能胜过。“起”没有这些意思。
  马上 | 刻立 | 马上 means “very soon”. 刻立 is 立刻 with its characters swapped, and it is not a word. | “马上”表示很快。“刻立”把“立刻”的字颠倒了，不成词。
  马上 | 立刻了 | 马上就要…了 says something will happen soon, and 了 comes at the end. 立刻 is not used with 就要…了 for a date, and 了 cannot follow it. | “马上就要……了”说事情快要发生，“了”在句末。“立刻”不和“就要……了”连用说节日，后面也不能加“了”。
  是因为 | 所以 | 之所以 gives the result first; the reason follows with 是因为. 所以 gives a result, not a reason. | “之所以”先说结果，后面用“是因为”说原因。“所以”引出结果，不引出原因。
  是因为 | 因此 | 之所以 gives the result first; the reason follows with 是因为. 因此 gives a result, not a reason. | “之所以”先说结果，后面用“是因为”说原因。“因此”引出结果，不引出原因。
  而 | 同 | 而 joins two parts that contrast: 南方雨多，而北方雨少. 同 means “with” and does not open a contrast. | “而”连接对比的两部分：南方雨多，而北方雨少。“同”表示“跟”，不能引出对比。
  感 | 觉 | The set phrase is 对…感兴趣, “be interested in”. 觉兴趣 is not said. | 固定说法是“对……感兴趣”。不说“觉兴趣”。
  也许 | 也是许 | 也许 is one word, “perhaps”. 是 cannot go inside it. | “也许”是一个词，表示可能。“是”不能放进中间。
  不可能 | 不许也 | 不可能 means “impossible”. 不许也 is not a word. | “不可能”表示不会发生。“不许也”不成词。
  可能 | 许也 | 可能 here means “likely” or “chance”. 许也 is 也许 with its characters swapped, and it is not a word. | 这里的“可能”表示可能性。“许也”是“也许”颠倒了，不成词。
  不可能 | 也许不的 | 不可能 goes before the verb to say it cannot be. 也许 is a guess, and 的 has no place before 做. | “不可能”放在动词前，说不会这样。“也许”是猜测，“的”也不能放在“做”前面。
  家 | 们 | 某 and 各 take a measure word before a noun: 某家公司, 各家银行. 们 is not a measure word. | “某”“各”后面接量词再接名词：某家公司、各家银行。“们”不是量词。
  某家 | 某些个 | 某家 points to one company. 某些 means “some”, and 个 cannot follow it. | “某家”指一家公司。“某些”是一些，后面不能再加“个”。
  位 | 们 | 某 and 各 take a measure word before a noun: 某位同学, 各位客人. 们 is not a measure word. | “某”“各”后面接量词再接名词：某位同学、各位客人。“们”不是量词。
  某位 | 某些个 | 某位 points to one student. 某些 means “some”, and 个 cannot follow it. | “某位”指一位同学。“某些”是一些，后面不能再加“个”。
  某些 | 某们 | 某些 means “some”, before a noun. 们 does not go after 某. | “某些”表示一些，放在名词前。“某”后面不加“们”。
  某些 | 某个们 | 某些 means “some”, before a noun. 某个 is one, and 们 cannot follow it. | “某些”表示一些。“某个”是一个，后面不能加“们”。
  某人 | 某们人 | 某人 means “someone”. 们 does not go between 某 and 人. | “某人”指某一个人。“们”不能放在“某”和“人”中间。
  人都 | 人才 | 都 says all of them do it: 任何人都, 全家人都. 才 says something happens late, and it does not sum up a group. | “都”表示全部：任何人都、全家人都。“才”表示晚，不能总括全体。
  是否 | 不是否 | 是否 already means “whether or not”. 不 cannot go before it. | “是否”已经是“是不是”的意思，前面不能加“不”。
  有罪 | 在罪 | Being guilty is 有罪, “to have guilt”. 在 marks a place. | 犯了罪说“有罪”。“在”表示处所。
  有罪 | 给罪 | Being guilty is 有罪, “to have guilt”. 给 marks who receives something. | 犯了罪说“有罪”。“给”引出接受的人。
  有罪 | 被罪 | Being guilty is 有罪, “to have guilt”. 被 marks who does the action. | 犯了罪说“有罪”。“被”引出施事者。
  一共 | 一个共 | 一共 is one word, “in all”. 个 cannot go inside it. | “一共”是一个词，表示合起来。“个”不能放进中间。
  方面 | 个面 | The pattern is 一方面…另一方面…, the same word both times. 一个面 is not said. | 格式是“一方面……另一方面……”，前后用同一个词。不说“一个面”。
  个 | 们 | The measure word 个 is needed here: 各个城市, 一个个月饼. 们 is not a measure word. | 这里要用量词“个”：各个城市、一个个月饼。“们”不是量词。
  要不然 | 所以 | After 幸亏, 要不然 says what would have happened without the help. 所以 gives a real result, but he did finish. | “幸亏”后面用“要不然”说没有帮助会怎样。“所以”说真实的结果，可事情已经做完了。
  要不然 | 因为 | After 幸亏, 要不然 says what would have happened without the help. 因为 gives a reason, which does not fit. | “幸亏”后面用“要不然”说没有帮助会怎样。“因为”引出原因，不合适。
  害怕 | 怕恐 | 害怕 is one word, “to be afraid of”. 怕恐 is not a word. | “害怕”是一个词。“怕恐”不成词。
  恐怕来不及 | 害怕来不及了 | 恐怕 gives a worried guess: 恐怕来不及了. 害怕 says one is afraid of something, and 了 is said once. | “恐怕”表示担心的估计：恐怕来不及了。“害怕”说感到害怕，“了”也只用一次。
  根本 | 一根 | 根本 before 不 says “not at all”. 一根 counts one long thin thing. | “根本”放在“不”前表示完全不。“一根”是数量，指一根细长的东西。
  没法 | 很想 | 根本 goes before a negative: 根本没法. 很想 is not negative, and the rain stopped them. | “根本”后面接否定：根本没法。“很想”不是否定，而且雨大得出不了门。
  没法 | 都能 | 根本 goes before a negative: 根本没法. 都能 says the opposite. | “根本”后面接否定：根本没法。“都能”意思相反。
  没法 | 太会 | 根本 goes before a negative: 根本没法. 太会 is not negative. | “根本”后面接否定：根本没法。“太会”不是否定。
  没有鱼 | 有鱼了 | 根本 goes before a negative: 根本没有. 有鱼了 says there are fish, and 根本 cannot go with it. | “根本”后面接否定：根本没有。“有鱼了”是肯定，不能和“根本”连用。
  听不懂 | 听懂了 | 根本 goes before a negative: 根本听不懂. 听懂了 is not negative. | “根本”后面接否定：根本听不懂。“听懂了”不是否定。
  不完 | 完了 | 根本 goes before a negative: 根本写不完. 写完了 is not negative. | “根本”后面接否定：根本写不完。“写完了”不是否定。
  没有树 | 有树了 | 根本 goes before a negative: 根本没有. 有树了 says there are trees. | “根本”后面接否定：根本没有。“有树了”是肯定。
  不是他做的 | 是他做的了 | 根本 goes before a negative: 根本不是. 是…的 takes no 了. | “根本”后面接否定：根本不是。“是……的”句也不加“了”。
  人也 | 人才 | The pattern is 连…也/都: 连一个人也没有. 才 does not go with 连. | 格式是“连……也/都”：连一个人也没有。“才”不和“连”搭配。
  不过 | 不起 | 跑不过他 says one cannot run faster than him. 跑不起 is not said. | “跑不过他”表示跑不赢他。不说“跑不起”。
  一次 | 一下 | The pattern repeats the same counted word: 一次比一次. 一下 is not repeated with 一次. | 格式前后重复同一个量词：一次比一次。不说“一下比一次”。
  一年 | 一下 | The pattern repeats the same counted word: 一年比一年. 一下 is not repeated with 一年. | 格式前后重复同一个量词：一年比一年。不说“一下比一年”。
  根据 | 一根 | 根据 means “based on”, before a noun. 一根 counts one long thin thing. | “根据”表示以……为依据，放在名词前。“一根”是数量。
  根据天气情况，我们改了时间 | 我们改了时间根据了天气情况 | A phrase with 根据 goes at the head: 根据天气情况，…. 根据 takes no 了. | 带“根据”的短语放在句首：根据天气情况，……。“根据”后面不加“了”。
  据说 | 被说 | 据说 means “it is said”, at the head of the sentence. 被 marks who does an action. | “据说”表示听说，放在句首。“被”引出施事者。
  据说 | 把说 | 据说 means “it is said”, at the head of the sentence. 把 brings an object before a verb. | “据说”表示听说，放在句首。“把”把宾语提到动词前。
  据说 | 给说 | 据说 means “it is said”, at the head of the sentence. 给 marks who receives. | “据说”表示听说，放在句首。“给”引出接受的人。
  所知 | 知道所 | 据我所知 is a fixed phrase, “as far as I know”. Its words do not change order. | “据我所知”是固定说法，词序不能改。
  知 | 知道了 | 据我所知 is a fixed phrase, “as far as I know”. 所知 cannot become 所知道了. | “据我所知”是固定说法，不能改成“所知道了”。
  据他说 | 他据说了 | The source goes between 据 and 说: 据他说. 据说 takes no 了. | 消息来源放在“据”和“说”中间：据他说。“据说”后面不加“了”。
  凭 | 平 | 凭 means “by means of”, before what one relies on. 平 means “flat” or “even”. | “凭”表示依靠，放在所依靠的事物前面。“平”是平坦的意思。
  个人 | 人个们 | The measure word goes before the noun: 一百个人. 们 does not go after a number. | 量词放在名词前面：一百个人。有数量时不加“们”。
  以便 | 便了 | 以便 is one word, “so that”, at the head of its part. 便了 is not a word. | “以便”是一个词，表示“为了方便”，放在分句开头。“便了”不成词。
  为了 | 便以 | 为了 gives the purpose at the head. 便以 is not a word. | “为了”放在句首说目的。“便以”不成词。
  为了不 | 以免 | 以免 opens a later part: …，以免迷路. At the head, say 为了不. | “以免”用在后一个分句开头：……，以免迷路。放在句首要说“为了不”。
  为了不 | 免以 | At the head, the purpose is 为了不. 免以 is not a word. | 放在句首说目的用“为了不”。“免以”不成词。
  为了不 | 以为 | 以为 means “to think wrongly”. At the head, the purpose is 为了不. | “以为”是“认为（但实际不是）”。句首说目的用“为了不”。
  从而 | 从此而 | 从而 is one word, “and so”. 此 cannot go inside it. | “从而”是一个词，表示因此。“此”不能放进中间。
  渐渐 | 逐 | 渐渐 is said twice: 渐渐地. 逐 alone is not used, and 逐渐 is a different word. | “渐渐”要重叠：渐渐地。“逐”不能单用。
  渐渐 | 逐逐 | 渐渐 is 渐 said twice. 逐逐 is not a word; the word with 逐 is 逐渐. | “渐渐”是“渐”重叠。“逐逐”不成词，带“逐”的词是“逐渐”。
  渐渐 | 渐逐 | The words are 渐渐 and 逐渐. 渐逐 has the characters the wrong way round. | 词是“渐渐”或“逐渐”。“渐逐”字序颠倒了。
  解决 | 了解决 | 解决 comes right after the word before it: 加以解决, 尽快解决, 有待解决. 了 cannot go before the verb. | “解决”直接放在前面的词后面：加以解决、尽快解决、有待解决。“了”不能放在动词前面。
  不再用 | 再再不用 | 不再 means “no longer”, with 不 first. 再 is said once. | “不再”表示不再继续，“不”在前。“再”只用一次。
  除了 | 除外 | 除了 opens the phrase: 除了中文, 除了…以外. 除外 is not the opening word. | 开头用“除了”：除了中文、除了……以外。“除外”不能放在开头。
  除了 | 除以 | 除了 means “apart from”: 除了中文, 除了…以外. 除以 means “divided by” in arithmetic. | “除了”表示排除：除了中文、除了……以外。“除以”是数学里的除法。
  以外 | 以后 | The pattern is 除了…以外, “apart from”. 以后 means “after” and does not close it. | 格式是“除了……以外”，表示排除。“以后”表示时间以后，不能用在这里。
  以外 | 以前 | The pattern is 除了…以外, “apart from”. 以前 means “before” and does not close it. | 格式是“除了……以外”。“以前”表示时间以前，不能用在这里。
  别的 | 别人的 | 别的节日 means “other holidays”. 别人的 means “other people's”. | “别的节日”是其他节日。“别人的”是其他人的。
  以外 | 以为 | The pattern is 除了…以外. 以为 means “to think wrongly” and does not close it. | 格式是“除了……以外”。“以为”是“认为”，不能用在这里。
  时候 | 时间 | The pattern is 每当…的时候, “whenever”. 时间 is an amount of time and does not close it. | 格式是“每当……的时候”。“时间”指时长，不能用在这个格式里。
  每当 | 每次当 | 每当 is one word, “whenever”. 次 cannot go inside it. | “每当”是一个词，表示每到某个时候。“次”不能放进中间。
  从 | 起 | The pattern is 从…起: 从 opens it and 起 closes it. 起 cannot also open it. | 格式是“从……起”：“从”在前，“起”在后。“起”不能放在前面。
  一到 | 一起 | The span is 从…到…: 从初一到初七. 起 does not mark where it ends. | 时间范围说“从……到……”：从初一到初七。“起”不表示终点。
  一到 | 一起来 | The span is 从…到…: 从初一到初七. 起来 does not mark where it ends. | 时间范围说“从……到……”：从初一到初七。“起来”不表示终点。
  从今年起 | 自从今年起来 | The pattern is 从…起. 自从 is for the past, and 起来 does not close the pattern. | 格式是“从……起”。“自从”用于过去，“起来”也不能用在格式末尾。
  从这个学期起 | 自从这个学期起来 | The pattern is 从…起. 自从 is for the past, and 起来 does not close the pattern. | 格式是“从……起”。“自从”用于过去，“起来”也不能用在格式末尾。
  从那时候起 | 自从那时候起来 | The pattern is 从…起, “from then on”. 起来 does not close it, and 自从 goes with 以后 or 以来. | 格式是“从……起”。“起来”不能放在格式末尾，“自从”要和“以后”“以来”搭配。
  从一百年前起 | 自从一百年前起来 | The pattern is 从…起, “from then on”. 起来 does not close it, and 自从 goes with 以后 or 以来. | 格式是“从……起”。“起来”不能放在格式末尾，“自从”要和“以后”“以来”搭配。
  从那天起 | 自从那天起来 | The pattern is 从…起, “from then on”. 起来 does not close it, and 自从 goes with 以后 or 以来. | 格式是“从……起”。“起来”不能放在格式末尾，“自从”要和“以后”“以来”搭配。
  依照 | 依旧 | 依照 means “according to”, before a rule. 依旧 means “as before” and cannot take a rule after it. | “依照”表示按照，后面接规定。“依旧”表示照旧，后面不能接规定。
  办事 | 办着事了 | 要 says what one should do, so the verb stays plain: 办事. 着 and 了 do not fit a rule for what one should do. | “要”说应该怎样做，动词用原形：办事。说应该做的事不用“着”和“了”。
  说话 | 说着话 | 不得 forbids it and 从来不 says it never happens, so the verb stays plain: 说话. 着 says an action is going on. | “不得”表示禁止，“从来不”表示从不这样，动词都用原形：说话。“着”表示动作在进行，不合适。
  调查 | 问 | 进行 takes a two-character verb after it: 进行调查. 问 has one character and does not follow 进行. | “进行”后面接双音节动词：进行调查。“问”是单音节，不能放在“进行”后面。
  下 | 后 | The pattern is 在…下, “with … as the help or condition”: 在老师的帮助下, 在父母的鼓励下. 后 tells time, not a condition. | 格式是“在……下”，表示在某种帮助或条件下：在老师的帮助下、在父母的鼓励下。“后”表示时间，不表示条件。
  越多 | 很多 | The pattern is 越…越…, said in both parts: 越便宜，越多. 很多 breaks the pair. | 格式是“越……越……”，前后都要用：越便宜……越多。“很多”破坏了这个搭配。
  与其他 | 把其他 | The pattern is 与…相比, “compared with”. 把 brings an object before a verb and does not go with 相比. | 格式是“与……相比”。“把”是把宾语提到动词前，不和“相比”搭配。
  还在 | 还是在了 | 还在 + verb says it is still going on: 还在下雨. 还是 means “still” or “or”, and 了 cannot go before 下雨. | “还在”加动词表示动作仍在进行：还在下雨。“还是”是另一个词，“了”也不能放在“下雨”前面。
  此外，服务也很好 | 服务此外也很好了 | 此外 opens the new part, before its subject: 此外，服务也很好. It does not go after the subject, and 了 does not fit. | “此外”放在分句开头、主语前面：此外，服务也很好。不能放在主语后面，句末也不加“了”。
  此外，最好还会用电脑 | 最好还会用此外电脑 | 此外 opens the new part: 此外，最好还会用电脑. It cannot go inside 用电脑. | “此外”放在分句开头：此外，最好还会用电脑。不能放进“用电脑”中间。
  偏偏 | 偏的 | 偏偏 is 偏 said twice: it says someone does just what is not wanted. 偏的 is not that word. | “偏偏”是“偏”重叠，表示故意跟别人的愿望相反。“偏的”不是这个词。
  难道 | 难到 | 难道 is written with 道. 难到 is not a word. | “难道”的“道”是道路的“道”。“难到”不成词。
  未必 | 不必未 | 未必 means “not always”, and it goes right before what it doubts. 不必 means “need not”, and 未 cannot follow it. | “未必”表示不一定，直接放在所怀疑的内容前面。“不必”是不需要，后面也不能加“未”。
  未必 | 必不未 | 未必 means “not always”, with 未 first. 必不未 is not a word. | “未必”表示不一定，“未”在前。“必不未”不成词。
  不见得 | 必未 | 不见得 means “not likely”. 必未 is 未必 with its characters swapped, and it is not a word. | “不见得”表示不一定。“必未”把“未必”的字颠倒了，不成词。
  开车 | 开着车了 | 何必 asks why one should do it at all, so the verb stays plain: 何必开车. 着 and 了 do not fit. | “何必”反问为什么一定要做，动词用原形：何必开车。不加“着”和“了”。
  哪儿 | 那儿 | 哪儿 in a question that expects no answer means “how could”: 哪儿读得懂. 那儿 means “there”. | 反问句里的“哪儿”表示“怎么能”：哪儿读得懂。“那儿”是“那个地方”。
  一般 | 一样般 | The pattern is 像…一般 or 像…一样, one word or the other. 一样般 puts both together. | 格式是“像……一般”或“像……一样”，只用其中一个。“一样般”把两个词叠在一起了。
  走路 | 走着路 | 只顾 says one pays attention only to this action, and the verb stays plain: 只顾走路. 着 does not go after 只顾. | “只顾”表示只注意做一件事，动词用原形：只顾走路。不加“着”。
  来便宜，二来 | 去便宜，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  来天气太热，二来 | 去天气太热，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  来对身体好，二来 | 去对身体好，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  来身体不好，二来 | 去身体不好，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  来离家近，二来 | 去离家近，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  来吃得健康，二来 | 去吃得健康，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  来味道好，二来 | 去味道好，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  来我不太饿，二来 | 去我不太饿，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  来有力气，二来 | 去有力气，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  来是兴趣，二来 | 去是兴趣，二去 | The pattern is 一来…二来…, “first … second …”. 一去 and 二去 are not said. | 格式是“一来……二来……”，表示列举原因。不说“一去”“二去”。
  碗 | 们 | 一碗碗 says “bowl after bowl”: the measure word is said twice. 们 is not a measure word. | “一碗碗”表示一碗又一碗，量词重叠。“们”不是量词。
  堆 | 们 | 一堆堆 says “pile after pile”: the measure word is said twice. 们 is not a measure word. | “一堆堆”表示一堆又一堆，量词重叠。“们”不是量词。
  个月饼 | 一月饼 | 一个个 says “one after another”: 一个个月饼, with 个 said twice. 一月饼 leaves out the measure word. | “一个个”表示一个又一个：一个个月饼，“个”重叠。“一月饼”少了量词。
  加上 | 加起 | 加上 means “and also”, adding one more reason. 加起 is not said; 加起来 means “add up”. | “加上”表示再加一个原因。不说“加起”，“加起来”是相加。
  固然 | 固定 | 固然 grants a point before 但是: “it is true that”. 固定 means “fixed”. | “固然”先承认一点，后面接“但是”。“固定”是不变动的意思。
  不至于 | 不至 | 不至于 is one word, “not go so far as”. 于 cannot be left out. | “不至于”是一个词，表示不会到某种程度。“于”不能省略。
  生气 | 生着气了 | 不至于 and 不值得 talk about whether it is worth it, so the verb stays plain: 生气. 着 and 了 do not fit. | “不至于”“不值得”说值不值得、会不会这样，动词用原形：生气。不加“着”和“了”。
  地点 | 得点 | Before a verb, the manner is joined with 地: 轻轻地点头. 得 goes after a verb. | 动词前面表示方式用“地”：轻轻地点头。“得”放在动词后面。
  地点 | 了点 | Before a verb, the manner is joined with 地: 轻轻地点头. 了 goes after a verb, not between a manner word and the verb. | 动词前面表示方式用“地”：轻轻地点头。“了”放在动词后面，不能放在方式词和动词中间。
  不肯 | 没了肯 | 不肯 means “will not”: it says what one is unwilling to do, so it takes 不. 了 has no place after 没. | “不肯”表示不愿意，意愿用“不”否定。“没”后面也不加“了”。
  不肯 | 别了肯 | 不肯 means “will not”. 别 tells someone not to do something, and 了 has no place after it. | “不肯”表示不愿意。“别”是叫人不要做，后面也不加“了”。
  不肯 | 没肯了 | 不肯 means “will not”: it says what one is unwilling to do, so it takes 不. 了 does not follow 肯. | “不肯”表示不愿意，意愿用“不”否定。“肯”后面也不加“了”。
  时间 | 时候间 | 时间 is the word for an amount of time: 三天时间. 时候间 is not a word. | 表示时长用“时间”：三天时间。“时候间”不成词。
  不知道 | 没知道了 | 知道 is a state, and its negative is 不知道. 没 and 了 do not go with it here. | “知道”是状态，否定说“不知道”。这里不用“没”和“了”。
  掉 | 起 | 卖掉 says the papers are gone, sold off. 起 does not give that result. | “卖掉”表示卖出去、没有了。“起”没有这个结果。
  忘不掉 | 忘掉不了着 | Not being able to forget is 忘不掉, with 不 between the verb and 掉. 着 has no place here. | 表示不能忘说“忘不掉”，“不”放在动词和“掉”中间。“着”也不能用在这里。
  花钱 | 花了钱 | 乱花钱 tells of a habit: 总是 says it happens again and again. 了 marks one finished action and does not fit a habit. | “总是乱花钱”说的是习惯。“了”表示一次完成的动作，不能用在习惯上。
  花钱 | 花着钱 | 花钱 here names what one does in general, so the verb stays plain. 着 says an action is going on at one moment. | 这里的“花钱”说的是一般的做法，动词用原形。“着”表示某一刻动作在进行，不合适。
  花钱 | 花过了钱 | 乱花钱 tells of a habit: 总是 says it happens again and again. 过 and 了 tell of one past event. | “总是乱花钱”说的是习惯。“过”和“了”说过去的一次，不能用在习惯上。
  说话 | 说了话 | 从来不 says something never happens, so the verb stays plain: 从来不乱说话. 了 marks one finished action. | “从来不”说从来不这样，动词用原形：从来不乱说话。“了”表示一次完成的动作。
  说话 | 说过了话 | 从来不 says something never happens, so the verb stays plain. 过 and 了 tell of one past event. | “从来不”说从来不这样，动词用原形。“过”和“了”说过去的一次。
  再好 | 最好 | The fixed phrase is 再好不过了, “nothing could be better”. 最好不过 is not said. | 固定说法是“再好不过了”，表示没有比这更好的。不说“最好不过”。
  排队 | 排着队了 | 要先排队 says what one must do first, so the verb stays plain. 着 and 了 do not fit. | “要先排队”说先要做的事，动词用原形。不加“着”和“了”。
  解释 | 了解释 | 难以 goes right before a two-character verb: 难以解释. 了 cannot go between them. | “难以”直接放在双音节动词前：难以解释。中间不能加“了”。
  不过是 | 不是 | 只不过是 means “is only”: 不过 cannot be left out. 只不是 is not said, and the sentence does not deny anything. | “只不过是”表示仅仅是，“不过”不能省。不说“只不是”，这句话也不是否定。
  解决不 | 了解决不 | 往往 goes right before the verb: 往往解决不了. 了 cannot come first. | “往往”直接放在动词前：往往解决不了。“了”不能放在前面。
  在于 | 等于 | 在于 means “lies in”: the key lies in keeping on. 等于 means “equals”. | “在于”表示关键所在：成功的关键在于坚持。“等于”表示相等。
  省钱 | 省着钱 | 在于 names what the good point is, and the verb stays plain: 在于省钱. 着 does not fit. | “在于”说出好处是什么，动词用原形：在于省钱。不加“着”。
  常用 | 常比用 | 常用于 means “is often used in”. 比 compares and has no place here. | “常用于”表示经常用在某方面。“比”表示比较，不能用在这里。
  由此可见 | 由此看见 | The fixed phrase is 由此可见, “from this we can see”. 可见 says a conclusion; 看见 means “to see with the eyes”. | 固定说法是“由此可见”，引出结论。“看见”是用眼睛看到。
  将于 | 过于 | 将于 says something will take place at a time: 将于今晚八点. 过于 means “too much”. | “将于”表示将在某时发生：将于今晚八点。“过于”表示太、过分。
  所谓 | 所说 | 所谓 means “what is called”, before a term to explain. 所说 means “what was said”. | “所谓”表示“所说的叫……的”，后面接要解释的词语。“所说”是说过的话。
  想不起来 | 不起想起来 | Not being able to recall is 想不起来, with 不 between 想 and 起来. 不起 cannot come first. | 表示记不起说“想不起来”，“不”放在“想”和“起来”中间。“不起”不能放在前面。
  纷纷 | 分分 | 纷纷 is written with 纷, “one after another”. 分分 is not that word. | “纷纷”的“纷”是纷乱的“纷”，表示一个接一个。“分分”不是这个词。
  人们 | 他 | 纷纷 says many people do it one after another, so the subject must be many. 他 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“他”只是一个人。
  人们 | 我 | 纷纷 says many people do it one after another, so the subject must be many. 我 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“我”只是一个人。
  人们 | 一个人 | 纷纷 says many people do it one after another, so the subject must be many. 一个人 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“一个人”只有一个。
  读者们 | 那位读者 | 纷纷 says many people do it one after another, so the subject must be many. 那位读者 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“那位读者”只是一个人。
  读者们 | 他 | 纷纷 says many people do it one after another, so the subject must be many. 他 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“他”只是一个人。
  读者们 | 我 | 纷纷 says many people do it one after another, so the subject must be many. 我 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“我”只是一个人。
  很多人 | 他 | 纷纷 says many people do it one after another, so the subject must be many. 他 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“他”只是一个人。
  很多人 | 我 | 纷纷 says many people do it one after another, so the subject must be many. 我 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“我”只是一个人。
  读者 | 他 | 纷纷 says many people do it one after another, so the subject must be many. 他 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“他”只是一个人。
  网友 | 我 | 纷纷 says many people do it one after another, so the subject must be many. 我 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“我”只是一个人。
  大家 | 我 | 纷纷 says many people do it one after another, so the subject must be many. 我 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“我”只是一个人。
  网友们 | 他 | 纷纷 says many people do it one after another, so the subject must be many. 他 is one person. | “纷纷”表示许多人接连去做，主语要是多数。“他”只是一个人。
  路上的 | 这个 | 纷纷 says many things do it one after another, so the subject must be many: 路上的灯. 这个灯 is one lamp. | “纷纷”表示许多事物接连发生，主语要是多数：路上的灯。“这个灯”只有一盏。
  舍不得 | 舍没得 | Not having the heart to do it is 舍不得, with 不. 没 does not go inside this word. | 不愿意放弃说“舍不得”，用“不”。“没”不能放进这个词中间。
  舍得 | 舍不 | 舍得 means “be willing to part with”. 舍不 leaves out 得 and is not a word. | “舍得”表示愿意放弃。“舍不”少了“得”，不成词。
  舍得 | 舍过 | 舍得 means “be willing to part with”, with 得. 过 does not take its place. | “舍得”表示愿意放弃，要用“得”。“过”不能代替它。
  舍得 | 舍着 | 舍得 means “be willing to part with”, with 得. 着 does not take its place. | “舍得”表示愿意放弃，要用“得”。“着”不能代替它。
  花钱 | 花地钱 | 花钱 is a verb and its object. 地 goes before a verb to join a manner word, never inside 花钱. | “花钱”是动词带宾语。“地”放在动词前连接方式词，不能放进“花钱”中间。
  舍得 | 舍了着得 | 舍得 is one word, and its characters stay together. 了 and 着 cannot go inside it. | “舍得”是一个词，字要连在一起。“了”和“着”不能放进中间。
  白 | 绿 | 白 before a verb means “for nothing”: 白跑了一次. 绿 is only a color. | “白”放在动词前表示没有效果：白跑了一次。“绿”只是颜色。
  既 | 即 | The pattern 既…又… is written with 既. 即 means “that is” or “at once”. | 格式“既……又……”用“既”。“即”是“就是”或“立即”的意思。
  也是 | 就是 | The pattern is 既…也…: 既是同学，也是好朋友. 就是 does not pair with 既. | 格式是“既……也……”：既是同学，也是好朋友。“就是”不和“既”搭配。
  是 | 然 | 要不是 means “if it were not for”: it names what really happened. 要不然 means “or else” and does not fit before 你帮我. | “要不是”表示“如果没有”，后面接真实发生的事。“要不然”是“否则”，不能放在“你帮我”前面。
  早就 | 早却 | After 要不是, the result is 早就…了: “would have long since”. 却 turns a contrast and does not fit. | “要不是”后面的结果说“早就……了”。“却”表示转折，不合适。
  下 | 下雨着 | The pattern is 说…就…, with the same verb twice: 说下就下. 下雨着 changes the verb and adds 着. | 格式是“说……就……”，前后用同一个动词：说下就下。“下雨着”改了动词还加了“着”。
  仿佛 | 仿照 | 仿佛 means “as if”, before what it looks like. 仿照 means “to copy” a model. | “仿佛”表示好像，后面接像什么。“仿照”是照着样子做。
  而言 | 而说 | The fixed phrase is 对…而言, “for …”. 而说 is not said. | 固定说法是“对……而言”。不说“而说”。
  而言 | 来讲话 | The phrase is 对…而言 or 对…来讲. 来讲话 adds 话, and it is not said. | 说法是“对……而言”或“对……来讲”。“来讲话”多了“话”，不这样说。
  西 | 西边 | 以西 means “west of”: 以 + 西. 以 does not go before 西边. | “以西”表示在某地西面：“以”加“西”。“以”不能放在“西边”前面。
  以西 | 西边以 | 以西 means “west of”, with 以 first. 西边以 is not said. | “以西”表示在某地西面，“以”在前。不说“西边以”。
  东 | 东边 | 以东 means “east of”: 以 + 东. 以 does not go before 东边. | “以东”表示在某地东面：“以”加“东”。“以”不能放在“东边”前面。
  以东 | 东边以 | 以东 means “east of”, with 以 first. 东边以 is not said. | “以东”表示在某地东面，“以”在前。不说“东边以”。
  不同意 | 不了同意 | 不 goes right before 同意 to say one does not agree. 了 cannot go between them. | “不”直接放在“同意”前，表示不赞成。中间不能加“了”。
  不同意 | 不着同意 | 不 goes right before 同意 to say one does not agree. 着 cannot go between them. | “不”直接放在“同意”前，表示不赞成。中间不能加“着”。
  不同意 | 不地同意 | 不 goes right before 同意 to say he does not agree. 地 cannot go between them. | “不”直接放在“同意”前，表示不赞成。中间不能加“地”。
  倘若 | 尚若 | 倘若 means “if”, written with 倘. 尚若 is not a word. | “倘若”表示如果，第一个字是“倘”。“尚若”不成词。
  点钟 | 点点 | Time on the clock is 点 or 点钟: 八点钟. 点 is said once. | 钟点说“点”或“点钟”：八点钟。“点”只用一次。
  点钟 | 点分钟 | The hour is 点钟: 八点钟. 分钟 counts minutes and does not go after 点. | 整点说“点钟”：八点钟。“分钟”是计时长的，不能放在“点”后面。
  一说 | 再说 | The pattern is 一…就…: 一说 says “as soon as he speaks”. 再说 means “say again” and does not pair with 就. | 格式是“一……就……”：“一说”表示刚一说。“再说”是再说一次，不和“就”搭配。
  再说 | 又说 | The request is for the future, so “again” is 再: 再说一次. 又 tells of a repeat that already happened. | 请求的是还没做的事，“再一次”用“再”：再说一次。“又”说已经发生的重复。
  再说 | 就说 | “Again” is 再: 再说一次. 就 says something happens soon or at once. | “再一次”用“再”：再说一次。“就”表示很快或马上。
  再说 | 才说 | “Again” is 再: 再说一次. 才 says something happens late. | “再一次”用“再”：再说一次。“才”表示晚。
  请你再说一次 | 再请你说一次了 | 再 goes right before the verb it repeats: 请你再说一次. A request takes no 了. | “再”直接放在要重复的动词前：请你再说一次。请求句也不加“了”。
  不了 | 不得 | 吃不了 says there is too much to finish. 吃不得 says it should not be eaten, which is not the point here. | “吃不了”表示太多吃不完。“吃不得”表示不能吃，意思不对。
  死 | 很 | 死了 after an adjective says “extremely”: 累死了. 很 goes before an adjective, so 累很了 is not said. | 形容词后面加“死了”表示程度极高：累死了。“很”要放在形容词前面，不说“累很了”。
  坏 | 很 | 坏了 after a feeling says “terribly”: 饿坏了. 很 goes before an adjective, so 饿很了 is not said. | 表示感受的词后面加“坏了”表示程度很高：饿坏了。“很”要放在形容词前面，不说“饿很了”。
  坏 | 非常 | 坏了 after a feeling says “terribly”: 饿坏了. 非常 goes before an adjective, so 饿非常了 is not said. | 表示感受的词后面加“坏了”表示程度很高：饿坏了。“非常”要放在形容词前面，不说“饿非常了”。
  开 | 上 | 开 after 让, 走 or 分 says moving apart or away: 让开, 走开, 分开. 上 says something reaches or is put on, the other way. | “开”放在“让、走、分”后面，表示离开或分开：让开、走开、分开。“上”表示达到或附着，方向相反。
  开 | 下 | 开 after 让, 走 or 分 says moving apart or away: 让开, 走开, 分开. 下 says moving down. | “开”放在“让、走、分”后面，表示离开或分开：让开、走开、分开。“下”表示向下。
  下 | 外 | 以下 means that number or less: 一米二以下. 以外 means outside a place, and it does not go after a number. | “以下”表示这个数和比它小的：一米二以下。“以外”表示在某处外面，不放在数量后面。
  上 | 外 | 以上 means that number or more: 六十岁以上. 以外 means outside a place, and it does not go after a number. | “以上”表示这个数和比它大的：六十岁以上。“以外”表示在某处外面，不放在数量后面。
  下 | 上 | 下 is right here: 以下 means that number or less, and 在…下 says under some help or condition. 上 turns 以下 into 以上, “or more”, and 在…上 points to a field, not to help. | 这里要用“下”：“以下”是这个数和比它小的，“在……下”表示在某种帮助或条件下。“上”会把“以下”变成“以上”，“在……上”指某个方面，不指帮助。
  来着 | 着了 | 来着 ends a question about something one knew but cannot recall. 着了 is not said at the end of a question. | “来着”用在问句末尾，问自己一时想不起来的事。问句末尾不说“着了”。
  等 | 什么的 | Before a number that sums up the list, use 等: 北京、上海、广州等三个城市. 什么的 ends a list in speech, and it does not go before a number. | 列举后面用数字总结时用“等”：北京、上海、广州等三个城市。“什么的”是口语里结束列举的，不能放在数字前。
  等 | 和 | 等 after a list says “and so on”, before the word that sums it up: …等词语. 和 joins two names inside a list, not after the last one. | “等”放在列举后面，表示还有别的，后面接总括的词：……等词语。“和”连接列举中的两项，不放在最后一项后面。
  等 | 也 | 等 after a list says “and so on”, before the word that sums it up. 也 goes before a verb, not after a list. | “等”放在列举后面，表示还有别的，后面接总括的词。“也”放在动词前，不放在列举后面。
  等 | 才 | 等 after a list says “and so on”, before the word that sums it up. 才 goes before a verb, not after a list. | “等”放在列举后面，表示还有别的，后面接总括的词。“才”放在动词前，不放在列举后面。
  拿 | 把 | The fixed phrase is 拿…来说, “take … for example”. 把 brings an object before a verb and does not go with 来说. | 固定说法是“拿……来说”，表示举例。“把”是把宾语提到动词前，不和“来说”搭配。
  拿 | 给 | The fixed phrase is 拿…来说, “take … for example”. 给 marks who receives and does not go with 来说. | 固定说法是“拿……来说”，表示举例。“给”引出接受的人，不和“来说”搭配。
  拿 | 被 | The fixed phrase is 拿…来说, “take … for example”. 被 marks who does an action and does not go with 来说. | 固定说法是“拿……来说”，表示举例。“被”引出施事者，不和“来说”搭配。
  来说 | 去说 | The fixed phrase is 拿…来说, “take … for example”, with 来. 去说 is not said in it. | 固定说法是“拿……来说”，用“来”。这个格式里不说“去说”。
  看来 | 看着 | The fixed phrase is 在…看来, “in …'s view”. 看着 means “looking at” and cannot close it. | 固定说法是“在……看来”，表示从某人的角度看。“看着”是正在看，不能用在这个格式里。
  看来 | 看过 | The fixed phrase is 在…看来, “in …'s view”. 看过 means “have seen” and cannot close it. | 固定说法是“在……看来”，表示从某人的角度看。“看过”是看过了，不能用在这个格式里。
  在 | 对 | 在 opens these phrases: 在…看来, 在…下, 在…上. 对 marks who or what something is aimed at, and it does not go with 看来, 下 or 上. | “在”用在这些格式的开头：在……看来、在……下、在……上。“对”引出对象，不和“看来”“下”“上”搭配。
  在 | 把 | 在 opens these phrases: 在…看来, 在…下. 把 brings an object before a verb and cannot open them. | “在”用在这些格式的开头：在……看来、在……下。“把”是把宾语提到动词前，不能放在这里。
  在 | 给 | 在 marks a place, a field or a point of view: 在学习上, 写在这里, 在我看来. 给 marks who receives something. | “在”表示处所、方面或看法的角度：在学习上、写在这里、在我看来。“给”引出接受的人。
  下 | 里 | 在…下 says under some help or condition: 在老师的帮助下, 在…前提下. 里 marks the inside of a place. | “在……下”表示在某种帮助或条件下：在老师的帮助下、在……前提下。“里”表示在某处里面。
  下 |  | The pattern is 在…下: 在 opens it and 下 closes it. Without 下 the phrase is not finished. | 格式是“在……下”：“在”在前，“下”在后。少了“下”，这个格式不完整。
  去 | 来 | The pattern is verb + 来 + the same verb + 去: 想来想去, “over and over”. The second part takes 去, not 来. | 格式是“动词＋来＋同一个动词＋去”：想来想去，表示反复。后一半用“去”，不用“来”。
  去 | 过 | The pattern is verb + 来 + the same verb + 去: 想来想去, “over and over”. 过 cannot take the place of 去. | 格式是“动词＋来＋同一个动词＋去”：想来想去，表示反复。“过”不能代替“去”。
  去 | 着 | 去 is needed here: 回家去 says the way leads away, and 想来想去 says one does it over and over. 着 gives neither. | 这里要用“去”：“回家去”表示离开这里，“想来想去”表示反复。“着”没有这些意思。
  好 | 是 | The pattern is A也好，B也好: 好 is said in both parts, and 都 sums them up. 也是 means “is also” and breaks the pattern. | 格式是“A也好，B也好”：两部分都用“好”，后面用“都”总括。“也是”是“也是……”，破坏了格式。
  要 | 是 | 要不 is one word here, “or else” or “how about”. 是不 is not a word. | 这里的“要不”是一个词，表示“否则”或提出建议。“是不”不成词。
  来 | 上下 | 来 after a round number says “about”: 十来个人. 上下 goes after the whole amount, not between the number and the measure word: 三百块上下. | “来”放在整数后面表示概数：十来个人。“上下”放在整个数量后面，不能放在数词和量词中间：三百块上下。
  下 | 来 | 上下 after an amount says “about”: 三百块上下. 上来 is a direction word after a verb, not an amount. | “上下”放在数量后面表示概数：三百块上下。“上来”是动词后的趋向补语，不表示数量。
  根本不 | 根本很 | 根本 needs a negative after it: 根本不…, “not at all”. 很 is not negative. | “根本”后面要接否定：根本不……，表示完全不。“很”不是否定。
  根本不 | 根本都 | 根本 needs a negative after it: 根本不…, “not at all”. 都 is not negative. | “根本”后面要接否定：根本不……，表示完全不。“都”不是否定。
  根本没 | 根本很 | 根本 needs a negative after it: 根本没…, “not at all”. 很 is not negative. | “根本”后面要接否定：根本没……，表示完全没有。“很”不是否定。
  根本没 | 根本都 | 根本 needs a negative after it: 根本没…, “not at all”. 都 is not negative. | “根本”后面要接否定：根本没……，表示完全没有。“都”不是否定。
  没 | 太 | 根本 needs a negative after it: 根本没…, “not at all”. 太 says “too”, and it is not negative. | “根本”后面要接否定：根本没……。“太”表示过分，不是否定。
  不 | 太 | 根本 needs a negative after it: 根本不…, 根本写不完. 太 says “too”, and it is not negative. | “根本”后面要接否定：根本不……、根本写不完。“太”表示过分，不是否定。
  不累 | 累了 | 根本 needs a negative after it: 根本不累. 累了 says he is tired, so 根本 cannot go with it. | “根本”后面要接否定：根本不累。“累了”是肯定，不能和“根本”连用。
  不想去爬山 | 想去爬山了 | 根本 needs a negative after it: 根本不想去. 想去爬山了 is not negative. | “根本”后面要接否定：根本不想去。“想去爬山了”是肯定。
  不知道这件事 | 知道这件事了 | 根本 needs a negative after it: 根本不知道. 知道这件事了 is not negative. | “根本”后面要接否定：根本不知道。“知道这件事了”是肯定。
  不下雪 | 下雪了 | 根本 needs a negative after it: 根本不下雪. 下雪了 is not negative. | “根本”后面要接否定：根本不下雪。“下雪了”是肯定。
  没来过这里 | 来过这里了 | 根本 needs a negative after it: 根本没来过. 来过这里了 is not negative. | “根本”后面要接否定：根本没来过。“来过这里了”是肯定。
  不过 | 不着 | 不过 after a verb says one cannot beat someone: 跑不过他. 不着 says one cannot reach or get something, which is not the point. | “不过”放在动词后面表示胜不过：跑不过他。“不着”表示够不到、得不到，意思不对。
  不过 | 不完 | 不过 after a verb says one cannot beat someone: 跑不过他. 不完 says one cannot finish, and 跑不完他 is not said. | “不过”放在动词后面表示胜不过：跑不过他。“不完”表示做不完，不说“跑不完他”。
  不过 | 没过 | 不过 is one unit here: 说不过她 says one cannot beat her, and 再…不过了 says nothing could be more so. 没过 gives neither. | 这里的“不过”是一个整体：“说不过她”表示胜不过，“再……不过了”表示没有比这更……的。“没过”没有这些意思。
  过 | 完 | 得过 after a verb says one can beat someone: 下得过他. 完 says an action is finished, and 下得完他 is not said. | “得过”放在动词后面表示能胜过：下得过他。“完”表示完成，不说“下得完他”。
  场 | 天 | The pattern repeats the same counted word: 一场比一场, with 场 for a match. 一天 cannot follow 一场. | 格式前后重复同一个量词：一场比一场，“场”指一场比赛。“一场”后面不能接“一天”。
  场 | 年 | The pattern repeats the same counted word: 一场比一场, with 场 for a match. 一年 cannot follow 一场. | 格式前后重复同一个量词：一场比一场，“场”指一场比赛。“一场”后面不能接“一年”。
  场 | 个 | The pattern repeats the same counted word: 一场比一场, with 场 for a match. 一个 cannot follow 一场. | 格式前后重复同一个量词：一场比一场，“场”指一场比赛。“一场”后面不能接“一个”。
  光 | 也 | 不光 means “not only”, and 还 or 也 comes in the second part. 不也 is not this pattern. | “不光”表示不只，后一部分用“还”或“也”。“不也”不是这个格式。
  光 | 还 | 不光 means “not only”, and 还 comes in the second part. 不还 puts 还 in the first part. | “不光”表示不只，“还”用在后一部分。“不还”把“还”放到了前一部分。
  还是 | 就是 | 还是 here means “is also”: 不光是医生，还是作家. 就是 means “is exactly”, and it does not follow 不光. | 这里的“还是”表示“也是”：不光是医生，还是作家。“就是”表示正是，不和“不光”搭配。
  还是 | 才是 | 还 here adds one more thing: 还是一名作家. 才是 means “only that is”, and it does not add. | 这里的“还”表示补充：还是一名作家。“才是”表示“这才是”，没有补充的意思。
  根本写不 | 根本写很 | 根本 needs a negative after it: 根本写不完, “cannot possibly finish”. 很 is not negative, and it cannot go between 写 and 完. | “根本”后面要接否定：根本写不完。“很”不是否定，也不能放在“写”和“完”中间。
  根本写不 | 根本写都 | 根本 needs a negative after it: 根本写不完, “cannot possibly finish”. 都 is not negative, and it cannot go between 写 and 完. | “根本”后面要接否定：根本写不完。“都”不是否定，也不能放在“写”和“完”中间。
  哪里 | 那里 | 哪里 asks where, and in a question that expects no answer it means “how could”: 我哪里看得完. 那里 means “there”. | “哪里”问地方；在反问句里表示“怎么能”：我哪里看得完。“那里”是“那个地方”。
  哪里 | 哪个 | 哪里 asks where, and in a question that expects no answer it means “how could”. 哪个 asks which one and has no such use. | “哪里”问地方；在反问句里表示“怎么能”。“哪个”问哪一个，没有这种用法。
  哪里 | 什么 | 哪里 asks where, and in a question that expects no answer it means “how could”. 什么 asks about a thing. | “哪里”问地方；在反问句里表示“怎么能”。“什么”问事物。
  哪儿 | 哪个 | 哪儿 asks where, and in a question that expects no answer it means “how could”. 哪个 asks which one and has no such use. | “哪儿”问地方；在反问句里表示“怎么能”。“哪个”问哪一个，没有这种用法。
  哪儿 | 什么 | 哪儿 asks where, and in a question that expects no answer it means “how could”. 什么 asks about a thing. | “哪儿”问地方；在反问句里表示“怎么能”。“什么”问事物。
  不但 | 不是 | 不但 means “not only”: the second part comes with 而且, or with 反而 when it turns the other way. 不是 says something is not so. | “不但”表示不只，后一部分用“而且”，意思相反时用“反而”。“不是”是否定判断。
  不但 | 虽然 | 不但 means “not only”, and 反而 can follow when the second part turns the other way. 虽然 grants a fact before 但是, and it does not go with 反而. | “不但”表示不只，意思相反时后面接“反而”。“虽然”后面接“但是”，不和“反而”搭配。
  不但 | 因为 | 不但 means “not only”, and 反而 can follow when the second part turns the other way. 因为 gives a reason, and it does not go with 反而. | “不但”表示不只，意思相反时后面接“反而”。“因为”引出原因，不和“反而”搭配。
  时 | 次 | 一时 means “for the moment”: 一时想不起来. 一次 means “once”, which does not fit. | “一时”表示短时间内、一下子：一时想不起来。“一次”是一回，意思不对。
  掉 | 着 | 掉 after a verb says something is gone: 卖掉, 忘掉. 着 says an action is going on, which does not fit 都…了. | “掉”放在动词后面表示去除、没有了：卖掉、忘掉。“着”表示动作在进行，不和“都……了”搭配。
  掉 | 过 | 掉 after a verb says something is gone: 卖掉, 忘掉. 过 tells of an experience, not that the papers are gone. | “掉”放在动词后面表示去除、没有了：卖掉、忘掉。“过”说经历，不表示东西没有了。
  再 | 很 | The fixed phrase is 再 + adjective + 不过了, “could not be more”: 再好不过了. 很 does not go in it. | 固定说法是“再＋形容词＋不过了”，表示没有比这更……的：再好不过了。“很”不能用在里面。
  再好不过 | 又好不过 | The fixed phrase is 再 + adjective + 不过了, “could not be more”: 再好不过了. 又 says something happened again. | 固定说法是“再＋形容词＋不过了”：再好不过了。“又”表示重复发生。
  再合适不过 | 又合适不过 | The fixed phrase is 再 + adjective + 不过了, “could not be more”: 再合适不过了. 又 says something happened again. | 固定说法是“再＋形容词＋不过了”：再合适不过了。“又”表示重复发生。
  再合适不过 | 最合适不过 | The fixed phrase is 再 + adjective + 不过了, “could not be more”: 再合适不过了. 最合适不过 is not said. | 固定说法是“再＋形容词＋不过了”：再合适不过了。不说“最合适不过”。
  你再累 | 你又累 | 再 + adjective + 也 says “however …, still”: 再累也不要熬夜. 又 says something happened again. | “再＋形容词＋也”表示无论怎样都：再累也不要熬夜。“又”表示重复发生。
  再饿也 | 又饿也 | 再 + adjective + 也 says “however …, still”: 再饿也不能吃太多糖. 又 says something happened again. | “再＋形容词＋也”表示无论怎样都：再饿也不能吃太多糖。“又”表示重复发生。
  再饿也 | 最饿也 | 再 + adjective + 也 says “however …, still”: 再饿也不能吃太多糖. 最 says “most” and does not go with 也 this way. | “再＋形容词＋也”表示无论怎样都：再饿也不能吃太多糖。“最”表示程度最高，不和“也”这样搭配。
  天气再冷 | 天气又冷 | 再 + adjective + 也 says “however …, still”: 天气再冷，爷爷也要出去. 又 says something happened again. | “再＋形容词＋也”表示无论怎样都：天气再冷，爷爷也要出去。“又”表示重复发生。
  天气再冷 | 天气最冷 | 再 + adjective + 也 says “however …, still”: 天气再冷，爷爷也要出去. 最 says “most” and does not go with 也 this way. | “再＋形容词＋也”表示无论怎样都：天气再冷，爷爷也要出去。“最”表示程度最高，不和“也”这样搭配。
  不过 | 不了 | The fixed phrase is 再 + adjective + 不过了, “could not be more”: 再新鲜不过了. 不了 says one cannot, which turns the meaning round. | 固定说法是“再＋形容词＋不过了”：再新鲜不过了。“不了”表示不能，意思就反了。
  不过 | 不 | The fixed phrase is 只不过…而已, “only … that's all”. 只不 is not said. | 固定说法是“只不过……而已”，表示仅仅。不说“只不”。
  味 | 位 | 一味 means “blindly, only one way”, written with 味. 一位 counts one person. | “一味”表示单纯地、一个劲儿地，用“味”。“一位”是数一个人。
  所 | 了 | The pattern is 为 + who + 所 + verb, “be … by”: 为科学家所接受. 了 cannot take the place of 所. | 格式是“为＋人＋所＋动词”，表示被：为科学家所接受。“了”不能代替“所”。
  所 | 着 | The pattern is 为 + who + 所 + verb, “be … by”: 为科学家所接受. 着 cannot take the place of 所. | 格式是“为＋人＋所＋动词”，表示被：为科学家所接受。“着”不能代替“所”。
  所 | 过 | The pattern is 为 + who + 所 + verb, “be … by”: 为科学家所接受. 过 cannot take the place of 所. | 格式是“为＋人＋所＋动词”，表示被：为科学家所接受。“过”不能代替“所”。
  所 |  | The pattern is 为 + who + 所 + verb, “be … by”: 为全世界所知道. Without 所 the pattern is not finished. | 格式是“为＋人＋所＋动词”，表示被：为全世界所知道。少了“所”，格式不完整。
  不料 | 料到 | 不料 means “unexpectedly”, before a surprise. 料到 means “expected it”, the opposite. | “不料”表示没想到，后面接意外的事。“料到”是想到了，意思相反。
  很多 | 这个 | 纷纷 says many people do it one after another, so the subject must be many: 很多人. 这个人 is one person. | “纷纷”表示许多人接连去做，主语要是多数：很多人。“这个人”只是一个人。
  记者们 | 这个记者 | 纷纷 says many people do it one after another, so the subject must be many: 记者们. 这个记者 is one person. | “纷纷”表示许多人接连去做，主语要是多数：记者们。“这个记者”只是一个人。
  为 | 是 | These set phrases take 为, “as”: 称为, 以…为…, 不失为. 是 does not go in them. | 这些固定说法用“为”：称为、以……为……、不失为。“是”不能用在里面。
  为 | 当 | The set phrases 以…为… and 不愧为 take 为, “as”. 当 does not go in them. | 固定说法“以……为……”和“不愧为”用“为”。“当”不能用在里面。
  为 | 做 | The set phrase is 以…为…, “take … as …”: 以山地为主. 做 does not go in it. | 固定说法是“以……为……”：以山地为主。“做”不能用在里面。
  为 | 了 | 称为 is a set word, “be called”, with the name right after it. 称了 is not said before a name. | “称为”是固定的词，后面直接接名称。名称前不说“称了”。
  为 | 成为 | 称为 is a set word, “be called”, with the name right after it. 称成为 is not said. | “称为”是固定的词，后面直接接名称。不说“称成为”。
  为 | 对 | 为 is right here: it says whom or what something is for (为你高兴, 为安全起见, 为国家的发展而工作), and in 为…所 it says who does the action. 对 marks only whom an action is aimed at. | 这里要用“为”：表示为了谁、为了什么（为你高兴、为安全起见、为国家的发展而工作），在“为……所”里引出施事者。“对”只引出动作的对象。
  为 | 把 | 为 is right here: it says whom something is for (为你担心, 为学生提供), and in 为…所 it says who does the action. 把 brings an object before a verb. | 这里要用“为”：表示为了谁（为你担心、为学生提供），在“为……所”里引出施事者。“把”是把宾语提到动词前。
  为 | 给 | 为 is right here: it says whom something is for (为你高兴), and in 为…所 it says who does the action. 给 marks who receives something. | 这里要用“为”：表示为了谁（为你高兴），在“为……所”里引出施事者。“给”引出接受的人。
  白 | 黑 | 白 before a verb means “for nothing”: 白跑了一次. 黑 is only a color. | “白”放在动词前表示没有效果：白跑了一次。“黑”只是颜色。
  白 | 红 | 白 before a verb means “for nothing”: 白跑了一次. 红 is only a color. | “白”放在动词前表示没有效果：白跑了一次。“红”只是颜色。
  又 | 就 | 又 is right here: it says something happens again, or joins two qualities in 又…又 or 既…又. 就 says something happens soon or easily. | 这里要用“又”：表示重复，或在“又……又”“既……又”里连接两种情况。“就”表示很快或容易。
  又 | 才 | 又 is right here: it says something happens again, or joins two qualities in 既…又. 才 says something happens late. | 这里要用“又”：表示重复，或在“既……又”里连接两种情况。“才”表示晚。
  又 | 还是 | 又 is right here: it says something happens again, or joins two qualities in 既…又. 还是 says “still” or asks for a choice. | 这里要用“又”：表示重复，或在“既……又”里连接两种情况。“还是”表示仍然或问选择。
  累是累 | 累了累 | The pattern is A是A: 累是累，但是…, “it is tiring, but …”. 是 stands between the two, and 了 cannot take its place. | 格式是“A是A”：累是累，但是……，先承认再转折。中间用“是”，“了”不能代替它。
  累是累 | 累很累 | The pattern is A是A: 累是累，但是…, “it is tiring, but …”. 很 cannot take the place of 是. | 格式是“A是A”：累是累，但是……。“很”不能代替“是”。
  好看是好看 | 好看了好看 | The pattern is A是A: 好看是好看，可是…, “it is pretty, but …”. 了 cannot take the place of 是. | 格式是“A是A”：好看是好看，可是……。“了”不能代替“是”。
  好看是好看 | 好看很好看 | The pattern is A是A: 好看是好看，可是…, “it is pretty, but …”. 很 cannot take the place of 是. | 格式是“A是A”：好看是好看，可是……。“很”不能代替“是”。
  好看是好看 | 好看的好看 | The pattern is A是A: 好看是好看，可是…, “it is pretty, but …”. 的 cannot take the place of 是. | 格式是“A是A”：好看是好看，可是……。“的”不能代替“是”。
  累是累 | 累的累 | The pattern is A是A: 累是累，但是…, “it is tiring, but …”. 的 cannot take the place of 是. | 格式是“A是A”：累是累，但是……。“的”不能代替“是”。
  就是 | 所以 | 就是 here means “it's just that”, and names a drawback after a good point: 聪明是聪明，就是不太认真. 所以 gives a result, not a drawback. | 这里的“就是”表示“只是”，在优点后面说出不足：聪明是聪明，就是不太认真。“所以”引出结果，不说不足。
  就是 | 因为 | 就是 here means “it's just that”, and names a drawback after a good point. 因为 gives a reason, not a drawback. | 这里的“就是”表示“只是”，在优点后面说出不足。“因为”引出原因，不说不足。
  就是 | 而且 | 就是 here means “it's just that”, and names a drawback after a good point. 而且 adds a further point of the same kind. | 这里的“就是”表示“只是”，在优点后面说出不足。“而且”是追加同类的内容。
  别说 | 别讲话 | The pattern is 别说 A，连 B 都…, “let alone A”. 别讲话 means “do not talk”. | 格式是“别说A，连B都……”，表示A更不用说。“别讲话”是叫人不要说话。
  说 | 是 | The pattern is 别说 A，连 B 都…, “let alone A”. 别是 is not said. | 格式是“别说A，连B都……”。不说“别是”。
  就 | 把 | 就 here means “as for, on”: 就…而言, 就这个问题. 把 brings an object before a verb. | 这里的“就”表示“关于、从……方面”：就……而言、就这个问题。“把”是把宾语提到动词前。
  就 | 被 | 就 here means “as for, on”: 就…而言, 就这个问题. 被 marks who does an action. | 这里的“就”表示“关于、从……方面”：就……而言、就这个问题。“被”引出施事者。
  就 | 让 | The fixed phrase is 就…而言, “as for …”: 就面积而言. 让 does not go with 而言. | 固定说法是“就……而言”，表示从某方面说：就面积而言。“让”不和“而言”搭配。
`;

/** pairReasons are the written reasons, by `right|wrong`. */
export const pairReasons: ReadonlyMap<string, Text> = (() => {
  const out = new Map<string, Text>();
  for (const [right = "", wrong = "", en = "", zh = ""] of lines(PAIRS, 4)) {
    const key = `${right}|${wrong}`;
    if (out.has(key)) throw new Error(`grammar pairs: ${key} twice`);
    out.set(key, t(en, zh));
  }
  return out;
})();
