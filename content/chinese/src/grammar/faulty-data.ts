// The faulty-sentence topics of grades 4 and 5. The sentences are written for this subject; each line is a faulty
// sentence, its correction and three revisions that leave a fault or add one, in the format parseFaulty reads.

import { t } from "@ga/content";

import { type FaultySpec, parseFaulty } from "./faulty.ts";

/** FaultyData is a faulty-sentence topic without its prerequisites, which follow the order of the list. */
export type FaultyData = Omit<FaultySpec, "prerequisites"> & { readonly grade: number };

/** faultyData are the faulty-sentence topics, in the order they are taught. */
export const faultyData: readonly FaultyData[] = [
  {
    grade: 4,
    id: "faulty-missing-parts",
    title: t("Faulty Sentences: Missing Parts", "病句：成分残缺"),
    fault: t("a part of the sentence is missing", "成分残缺"),
    explanation: t(
      "A sentence needs someone or something it is about and what is said of them; a verb that takes an object needs one. Ask who does it and what is done: if the sentence cannot answer, a part is missing. A sentence that begins with 通过 or 经过 and goes on with 使 has lost its subject; drop one of them.",
      "一个句子要说清“谁（什么）”和“怎么样（是什么）”，需要宾语的动词还要说清“做什么”。问一问是谁做的、做了什么，回答不出来就是成分残缺。用了“通过……使……”“经过……使……”的句子往往缺少主语，去掉其中一个就好。",
    ),
    items: parseFaulty(`
通过这次活动，使我们懂得了团结的重要。 | 通过这次活动，我们懂得了团结的重要。 | 通过这次活动，使我懂得了团结的重要。 | 通过这次活动，使我们懂得了。 | 通过这次活动，让我们懂得了团结的重要。
在老师的帮助下，取得了很大的进步。 | 在老师的帮助下，我取得了很大的进步。 | 在老师的帮助下，取得了进步。 | 在老师的帮助下，很快取得了很大的进步。 | 老师的帮助下，取得了很大的进步。
我们要养成认真。 | 我们要养成认真学习的好习惯。 | 我们要养成认真的。 | 我们要认真养成。 | 我们要养成很认真。
我们班的同学都积极参加。 | 我们班的同学都积极参加了植树活动。 | 我们班的同学都积极地参加。 | 我们班的同学积极参加。 | 我们班的同学都积极参加了。
小明的作文写得又快又好，受到了。 | 小明的作文写得又快又好，受到了老师的表扬。 | 小明的作文写得又快又好，受到了很多。 | 小明的作文又快又好，受到了。 | 小明的作文写得又快又好，受到。
经过大家的努力，使教室变得干干净净。 | 经过大家的努力，教室变得干干净净。 | 经过大家的努力，使我们的教室变得干干净净。 | 经过大家的努力，使教室变得。 | 经过大家的努力，使教室干干净净地变得。
每天早上，在操场上跑步。 | 每天早上，爷爷都在操场上跑步。 | 每天早上，都在操场上跑步。 | 每天早上，在操场上跑步了。 | 每天早上，在操场上跑步很快。
我们要认真改正作业中的。 | 我们要认真改正作业中的错误。 | 我们要认真改正作业中。 | 我们要改正作业中的。 | 我们要认真改正作业的。
我们学校的图书馆里有很多。 | 我们学校的图书馆里有很多书。 | 我们学校的图书馆里有很多的。 | 我们学校的图书馆有很多。 | 我们学校的图书馆里很多。
听了这个故事，使我很感动。 | 听了这个故事，我很感动。 | 听了这个故事，使我们很感动。 | 听了这个故事，使很感动。 | 这个故事听了，使我很感动。
`),
  },
  {
    grade: 4,
    id: "faulty-mismatches",
    title: t("Faulty Sentences: Words That Do Not Go Together", "病句：搭配不当"),
    fault: t("words that do not go together are joined", "搭配不当"),
    explanation: t(
      "Words that work together must suit each other: a subject its predicate, a verb its object, a describing word what it describes. Take each pair out and say it alone, as 歌声……美丽 or 穿……帽子; if the pair sounds wrong, change one word. When one verb has two objects, check it with each.",
      "句子中相关的词语要搭配得当：主语和谓语、动词和宾语、修饰语和中心语都要合适。把每一对词语单独拿出来读一读，比如“歌声……美丽”“穿……帽子”，读起来别扭就换一个词。一个动词带两个宾语时，要分别检查。",
    ),
    items: parseFaulty(`
春天的公园是一个美丽的季节。 | 春天是一个美丽的季节。 | 春天的公园是美丽的季节。 | 公园的春天是一个美丽的公园。 | 春天的公园是一个季节。
他穿着一件红衣服和一顶红帽子。 | 他穿着一件红衣服，戴着一顶红帽子。 | 他穿着一顶红帽子和一件红衣服。 | 他戴着一件红衣服和一顶红帽子。 | 他穿着一件红衣服，穿着一顶红帽子。
她的歌声很美丽。 | 她的歌声很动听。 | 她的歌声很漂亮。 | 她的歌声很好看。 | 她的歌声很鲜艳。
我们要增强身体，努力学习。 | 我们要增强体质，努力学习。 | 我们要增加身体，努力学习。 | 我们要增大身体，努力学习。 | 我们要增强身体，努力增强学习。
妈妈做的饭菜很香，我的胃口很高。 | 妈妈做的饭菜很香，我的胃口很好。 | 妈妈做的饭菜很香，我的胃口很香。 | 妈妈做的饭菜很香，我的胃口很高兴。 | 妈妈做的饭菜很香，我的胃口很深。
我们一边走，一边欣赏着美丽的风景和清脆的鸟鸣。 | 我们一边走，一边欣赏着美丽的风景，聆听着清脆的鸟鸣。 | 我们一边走，一边看着美丽的风景和清脆的鸟鸣。 | 我们一边走，一边欣赏着美丽的鸟鸣和清脆的风景。 | 我们一边走，一边欣赏着美丽的风景和清脆的鸟叫。
王老师的教学经验非常广阔。 | 王老师的教学经验非常丰富。 | 王老师的教学经验非常宽广。 | 王老师的教学经验非常高大。 | 王老师的教学非常广阔。
他的身体越来越结实，个子也长得很胖。 | 他的身体越来越结实，个子也长得很高。 | 他的身体越来越结实，个子也长得很粗。 | 他的身体越来越结实，个子也长得很宽。 | 他的身体越来越结实，个子也长得又结实又胖。
同学们读书的兴趣越来越强。 | 同学们读书的兴趣越来越浓。 | 同学们读书的兴趣越来越重。 | 同学们读书的兴趣越来越硬。 | 同学们读书的兴趣越来越强大。
她弹着钢琴，唱着优美的舞蹈。 | 她弹着钢琴，跳着优美的舞蹈。 | 她弹着钢琴，听着优美的舞蹈。 | 她唱着钢琴，跳着优美的舞蹈。 | 她弹着钢琴，唱着优美的舞。
`),
  },
  {
    grade: 5,
    id: "faulty-word-order",
    title: t("Faulty Sentences: Wrong Word Order", "病句：语序不当"),
    fault: t("words stand in the wrong order", "语序不当"),
    explanation: t(
      "Chinese tells much by order. Things done one after another are said in that order: first 发现, then 克服. Time and place come before the verb, and words like 已经, 都 and 一本本 stand before what they describe. Read the sentence as events happen and put each word where it belongs.",
      "汉语的意思很多靠语序表达。先后发生的动作要按顺序说，比如先“发现”再“克服”；表示时间、地点的词语和“已经”“都”“一本本”等修饰的词语，一般放在动词前面。按事情发生的顺序读一读，把词语放回该在的位置。",
    ),
    items: parseFaulty(`
我们要克服并且发现学习上的困难。 | 我们要发现并且克服学习上的困难。 | 我们要克服并发现学习上的困难。 | 我们要克服学习上的并且发现困难。 | 我们要克服并且发现学习上的问题。
我们认真地讨论并听取了老师的意见。 | 我们认真地听取并讨论了老师的意见。 | 我们讨论并认真地听取了老师的意见。 | 我们认真地讨论了老师的并听取意见。 | 我们认真地讨论并听取了老师的。
老师耐心地纠正并指出了我作业中的错误。 | 老师耐心地指出并纠正了我作业中的错误。 | 老师纠正并耐心地指出了我作业中的错误。 | 老师耐心地纠正了我作业中的错误并指出。 | 老师耐心地纠正并指出了我作业中的问题。
这本书我已经看完了昨天。 | 这本书我昨天已经看完了。 | 这本书已经我昨天看完了。 | 昨天这本书我看完已经了。 | 这本书我已经看完了昨天的。
我们一起去公园玩了星期天。 | 星期天，我们一起去公园玩了。 | 我们一起去星期天公园玩了。 | 我们一起星期天玩了去公园。 | 星期天我们一起去玩了公园。
老师把我们的作业已经批改完了。 | 老师已经把我们的作业批改完了。 | 老师把已经我们的作业批改完了。 | 老师把我们的作业批改已经完了。 | 已经老师把我们的作业批改完了。
我写完作业以后，又预习了明天要学的课文仔细地。 | 我写完作业以后，又仔细地预习了明天要学的课文。 | 我写完作业以后，又预习了仔细地明天要学的课文。 | 我写完作业以后，又预习了明天仔细地要学的课文。 | 我写完作业仔细地以后，又预习了明天要学的课文。
我们要发扬并继承中华民族的传统美德。 | 我们要继承并发扬中华民族的传统美德。 | 我们要发扬继承中华民族的传统美德。 | 我们要发扬并继承中华民族的美德传统。 | 我们要继承中华民族的并发扬传统美德。
小红把桌子上的书整齐地放好了一本本。 | 小红把桌子上的书一本本整齐地放好了。 | 小红把桌子上的书放好了整齐地一本本。 | 小红把桌子上的书放好了一本本整齐地。 | 一本本小红把桌子上的书整齐地放好了。
爷爷每天早上都在公园里打太极拳半个小时。 | 爷爷每天早上都在公园里打半个小时太极拳。 | 爷爷每天早上都在半个小时公园里打太极拳。 | 爷爷每天早上都打在公园里半个小时太极拳。 | 爷爷半个小时每天早上都在公园里打太极拳。
`),
  },
  {
    grade: 5,
    id: "faulty-repetition",
    title: t("Faulty Sentences: Saying It Twice", "病句：重复啰嗦"),
    fault: t("the same meaning is said twice", "重复啰嗦"),
    explanation: t(
      "Two words that mean the same thing are one too many: 大约 and 左右, 有名 and 著名, 又 and 重新, 一个人 and 独自. Find the word that repeats what another already says and take one of them out.",
      "意思相同的两个词用在一起就重复了，比如“大约”和“左右”、“有名”和“著名”、“又”和“重新”、“一个人”和“独自”。找出意思重复的词语，删去其中一个。",
    ),
    items: parseFaulty(`
我们班大约有四十个左右的同学。 | 我们班大约有四十个同学。 | 我们班大约有四十个左右同学。 | 我们班大约有左右四十个同学。 | 我们班大概大约有四十个同学。
这本书的作者是有名的著名作家。 | 这本书的作者是著名作家。 | 这本书的作者是有名的著名的作家。 | 这本书的作者是著名有名的作家。 | 这本书的作者是有名著名作家。
妈妈又重新把衣服洗了一遍。 | 妈妈重新把衣服洗了一遍。 | 妈妈又重新再把衣服洗了一遍。 | 妈妈又又把衣服洗了一遍。 | 妈妈重新又再洗了一遍衣服。
他一个人独自走在回家的路上。 | 他独自走在回家的路上。 | 他一个人独自地走在回家的路上。 | 他独自一个人地走在回家的路上。 | 他一个人独自一人走在回家的路上。
我们学校的图书馆里有许多很多的书。 | 我们学校的图书馆里有许多书。 | 我们学校的图书馆里有许多许多很多的书。 | 我们学校的图书馆里有很多许多书。 | 我们学校的图书馆里有许多很多书。
老师的话深深地打动了我的内心深处。 | 老师的话深深地打动了我。 | 老师的话深深地打动了我的深处。 | 老师的话深深地深深地打动了我的内心。 | 老师的话打动了我的内心深处深深地。
他的脸上露出了满意的笑容，高兴地笑了。 | 他的脸上露出了满意的笑容。 | 他的脸上露出了满意的笑容，笑了。 | 他的脸上露出了笑容的笑。 | 他的脸上露出了满意的笑容，满意地笑了。
这次春游，我们玩得非常开心极了。 | 这次春游，我们玩得开心极了。 | 这次春游，我们玩得非常开心得极了。 | 这次春游，我们玩得很非常开心极了。 | 这次春游，我们玩得非常极了开心。
我们要按时准时到校。 | 我们要按时到校。 | 我们要准时按时到校。 | 我们要按时准时地到校。 | 我们要准时准点按时到校。
在会上，他第一个首先发言。 | 在会上，他第一个发言。 | 在会上，他第一个首先地发言。 | 在会上，他首先第一个发言。 | 在会上，他第一个首先第一个发言。
`),
  },
];
