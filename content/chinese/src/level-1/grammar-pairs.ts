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
  早就 | 早才 | 早就 says it happened early, or long ago. 才 says it happened late, so it clashes with 早. | “早就”表示早已发生。“才”表示晚，和“早”矛盾。
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
  帮助 | 帮着 | 帮助 here is a noun, “help”. 帮着 is a verb with 着, not a noun. | 这里“帮助”是名词。“帮着”是动词加“着”，不是名词。
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
  说话 | 说着话了 | After 不敢 or 不肯 comes the plain verb: 说话. 着 and 了 do not go in. | “不敢”“不肯”后面用动词原形：说话。不加“着”和“了”。
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
