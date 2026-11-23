// The clues of the gap sentences of the level 9 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelNineClues are the clues of the gap sentences of the level 9 words, by clueKey, each word's sentence counted as 1. */
export const levelNineClues = parseClues(`
双关/1 | 福字倒贴因为倒和到同音 | People hang 福 upside down because 倒 sounds the same as 到, so the word must mean pun.
借代/1 | 用笔杆子代替会写文章的人 | The nickname 笔杆子 stands in for a person who writes well, so the word must mean metonymy.
明喻/1 | 用了像字的比喻 | The comparison of her red face to an apple uses the word 像, so the word must mean simile.
暗喻/1 | 时间是一条河 | The sentence says time is a river, using 是 instead of 像, so the word must mean metaphor.
借喻/1 | 只出现用来比喻的东西 | Only the image appears in the sentence and the thing it stands for is left out, so the word must mean metaphor without the tenor.
反语/1 | 房间又脏又乱却说真爱干净 | Mother calls a filthy, messy room very clean, so the word must mean irony.
顶真/1 | 前一句末尾是后一句开头 | The end of each line is the start of the next, so the word must mean chain linking.
通感/1 | 花香写得像歌声 | A scent is described as if it were distant singing, so the word must mean synaesthesia.
互文/1 | 上下两句意思互相补充 | The two lines of the poem complete each other and must be read together, so the word must mean mutual complementation.
修辞格/1 | 比喻拟人夸张排比 | Metaphor, personification, exaggeration and parallelism are common ones, so the word must mean rhetorical device.
名词/1 | 桌子城市友谊 | Table, city and friendship are words for things, so the word must mean noun.
动词/1 | 跑写思考 | Run, write and think are words for actions, so the word must mean verb.
形容词/1 | 美丽高大安静 | Beautiful, tall and quiet describe qualities, so the word must mean adjective.
副词/1 | 很都已经 | Words like 很, 都 and 已经 belong to this class, so the word must mean adverb.
介词/1 | 从对于关于 | Words like 从, 对于 and 关于 belong to this class, so the word must mean preposition.
连词/1 | 和但是所以 | Words like 和, 但是 and 所以 belong to this class, so the word must mean conjunction.
助词/1 | 的地得和了着过 | Structural 的, 地 and 得 and aspect markers 了, 着 and 过 are examples, so the word must mean auxiliary word.
量词/1 | 一本书的本 | Examples are 本 in 一本书 and 张 in 一张纸, so the word must mean measure word.
代词/1 | 我你这那 | Examples are 我, 你, 这 and 那, so the word must mean pronoun.
叹词/1 | 哎呀唉哦能单独成句 | Words like 哎呀, 唉 and 哦 can stand alone as sentences, so the word must mean interjection.
主语/1 | 小明读书里的小明 | In 小明读书, 小明 is who does the reading, so the word must mean subject.
谓语/1 | 花开了里的开了 | In 花开了, 开了 says what the flower does, so the word must mean predicate.
宾语/1 | 我喜欢音乐里的音乐 | In 我喜欢音乐, 音乐 is what is liked, so the word must mean object.
定语/1 | 红色的花里的红色的 | In 红色的花, 红色的 describes the flower, so the word must mean attributive.
状语/1 | 他慢慢地走里的慢慢地 | In 他慢慢地走, 慢慢地 describes how he walks, so the word must mean adverbial.
补语/1 | 他跑得很快里的很快 | In 他跑得很快, 很快 follows 得 and tells how he runs, so the word must mean complement.
短语/1 | 美丽的校园不是完整句子 | The words 美丽的校园 do not make a complete sentence, so the word must mean phrase.
语序/1 | 狗咬人和人咬狗不同 | The sentences 狗咬人 and 人咬狗 mean entirely different things, so the word must mean word order.
句式/1 | 把字句和被字句 | The 把 and 被 sentences are common Chinese ones, so the word must mean sentence pattern.
倒装句/1 | 主语放在了后面 | The sentence 多美啊，这里的春天 puts the subject at the end, so the word must mean inverted sentence.
陈述句/1 | 今天是星期一 | The sentence 今天是星期一 simply states a fact, so the word must mean declarative sentence.
疑问句/1 | 你吃饭了吗 | The sentence 你吃饭了吗 ends with a question mark, so the word must mean interrogative sentence.
祈使句/1 | 请关上门 | The sentence 请关上门 makes a request, so the word must mean imperative sentence.
感叹句/1 | 这里的风景太美了 | The sentence 这里的风景太美了 expresses strong feeling, so the word must mean exclamatory sentence.
病句/1 | 缺少主语的句子 | The sentence is missing a subject, so the word must mean ungrammatical sentence.
歧义/1 | 两个学校的老师有两种意思 | The phrase 两个学校的老师 can be read in two different ways, so the word must mean ambiguity.
实词/1 | 名词动词形容词 | Nouns, verbs and adjectives belong to this class, so the word must mean notional word.
虚词/1 | 介词连词助词 | Prepositions, conjunctions and particles belong to this class, so the word must mean function word.
语法/1 | 作文内容不错可句子有错误 | His essay's content is good but many of its sentences are wrongly formed, so the word must mean grammar.
数词/1 | 一十百千 | Examples are 一, 十, 百 and 千, so the word must mean numeral.
标点符号/1 | 逗号句号问号 | Commas, full stops and question marks are examples, so the word must mean punctuation mark.
省略号/1 | 话没有说完 | It shows that a remark is left unfinished, so the word must mean ellipsis.
括号/1 | 起解释作用的话放在里面 | Words that explain something in a sentence can be put inside them, so the word must mean brackets.
破折号/1 | 歇后语前后两部分之间 | It often separates the two halves of a xiehouyu, so the word must mean dash.
书名号/1 | 写书名报纸名用 | They mark the names of books, newspapers and articles, so the word must mean book title marks.
分号/1 | 停顿比逗号长比句号短 | Its pause is longer than a comma's and shorter than a full stop's, so the word must mean semicolon.
着重号/1 | 字下面的小圆点 | Small dots under characters in the text mark them for special attention, so the word must mean emphasis mark.
间隔号/1 | 外国人名和姓之间 | It separates the given name and surname of a translated foreign name, so the word must mean interpunct.
连接号/1 | 从北京到上海的路线 | It joins two place names to show a route from Beijing to Shanghai, so the word must mean hyphen.
单引号/1 | 引号里面的引号 | They are used for quotation marks inside quotation marks, so the word must mean single quotation marks.
偏旁/1 | 河湖海都有三点水 | The characters 河, 湖 and 海 all share the three-dot water component, so the word must mean radical.
笔顺/1 | 先上后下先左后右 | Characters are written top before bottom and left before right, so the word must mean stroke order.
方块字/1 | 每个字写在一个方格里 | Each Chinese character is written in its own square, so the word must mean square-shaped characters.
象形/1 | 日月山照着样子画 | The characters 日, 月 and 山 were first drawn to look like the things themselves, so the word must mean pictographic.
会意/1 | 人靠在树旁是休 | A person leaning against a tree makes 休, so the word must mean associative compound.
形声/1 | 湖字左边表意右边表音 | The left side of 湖 gives the meaning and the right side the sound, so the word must mean pictophonetic.
指事/1 | 木下加一短横表示树根 | A short stroke at the foot of 木 marks the root and makes 本, so the word must mean self-explanatory character.
独体字/1 | 人口大不能再分开 | Characters like 人, 口 and 大 cannot be split into parts, so the word must mean single-component character.
合体字/1 | 妈由女和马组成 | The character 妈 is made of 女 and 马, so the word must mean compound character.
简化字/1 | 书马门写法比过去简单 | Characters like 书, 马 and 门 are written more simply than before, so the word must mean simplified character.
声母/1 | 包和抛只是开头的音不同 | The syllables 包 and 抛 differ only in their opening sound, so the word must mean initial consonant.
韵母/1 | 妈和摸只是后面的音不同 | The syllables 妈 and 摸 differ only in the sound after the opening, so the word must mean final.
卷舌/1 | 说知吃是要翘起舌头 | Many southerners find the tongue position for 知, 吃 and 是 difficult, so the word must mean to curl the tongue.
儿化/1 | 北京人说玩儿一点儿 | Beijingers say 玩儿 and 一点儿, so the word must mean rhotacisation.
轻声/1 | 桌子的子读得又轻又短 | The 子 in 桌子 is read short and light, so the word must mean neutral tone.
变调/1 | 两个三声连读前一个读二声 | When two third tones meet, the first is read as a second tone, so the word must mean tone change.
送气/1 | 发怕的声母吐出一股气 | A puff of air comes out with the opening sound of 怕, so the word must mean aspiration.
鼻音/1 | 妈和那气流从鼻子出来 | Air flows out through the nose for the opening sounds of 妈 and 那, so the word must mean nasal sound.
音节/1 | 一个汉字通常读一个 | One character is usually read as one of these units, so the word must mean syllable.
四声/1 | 阴平阳平上声去声 | Mandarin's four pitch patterns are named yinping, yangping, shang and qu, so the word must mean four tones.
近义词/1 | 美丽和漂亮 | The words 美丽 and 漂亮 mean nearly the same, so the word must mean synonym.
反义词/1 | 冷和热 | The words 冷 and 热 mean the opposite of each other, so the word must mean antonym.
同音字/1 | 是事试读音完全相同 | The characters 是, 事 and 试 sound exactly alike, so the word must mean homophone.
多音字/1 | 长在长短和长大里读音不同 | The character 长 is read differently in 长短 and 长大, so the word must mean character with several readings.
错别字/1 | 把再见写成在见 | He wrote 在见 instead of 再见, so the word must mean miswritten character.
本义/1 | 古代走的原来意思是跑 | The character 走 first meant to run and only later took on today's meaning, so the word must mean original meaning.
引申义/1 | 感情很深里的深 | The character 深 first described deep water and 感情很深 stretches that meaning, so the word must mean extended meaning.
词义/1 | 会读会写还要理解 | Learning a new word means more than reading and writing it, so the word must mean meaning of a word.
通假字/1 | 古书里用读音相近的字代替 | Old books sometimes use a similar-sounding character in place of the proper one, so the word must mean interchangeable character.
中性/1 | 结果不带褒义也不带贬义 | The word 结果 carries neither praise nor blame, so the word must mean neutral.
口吻/1 | 作文用一只小猫的语气写 | The essay is written as if a kitten were speaking, so the word must mean tone of voice.
抑扬顿挫/1 | 朗读诗歌声音高低起伏 | His voice rises and falls beautifully as he reads poetry aloud, so the word must mean with rising and falling cadence.
吞吞吐吐/1 | 问他为什么迟到说不出原因 | Asked why he was late, he could not get the reason out, so the word must mean to hem and haw.
结巴/1 | 一紧张一个字重复好几遍 | When nervous he repeats each word several times, so the word must mean to stutter.
啰嗦/1 | 一件小事说了半小时 | He spent half an hour on one small matter, so the word must mean wordy.
唠叨/1 | 妈妈每天让我多穿衣服早睡 | Every day Mother repeats that the speaker should dress warmly and sleep early, so the word must mean to nag.
嘀咕/1 | 不敢大声反对小声说 | He dares not object out loud and grumbles quietly, so the word must mean to mutter.
滔滔不绝/1 | 说起足球谁也插不上嘴 | When he talks about football, nobody else can get a word in, so the word must mean to talk on and on.
口齿伶俐/1 | 小姑娘主持节目不紧张 | The little girl hosts the show without any nerves, so the word must mean eloquent.
含糊/1 | 没说同意还是不同意 | He talked a long time without saying yes or no, so the word must mean ambiguous.
谚语/1 | 一年之计在于春 | The line 一年之计在于春 is a saying about farming seasons, so the word must mean proverb.
歇后语/1 | 竹篮打水一场空 | The line 竹篮打水，一场空 has a lead-in followed by its point, so the word must mean xiehouyu.
惯用语/1 | 开夜车走后门 | Phrases like 开夜车 and 走后门 are set colloquial expressions, so the word must mean idiom.
俏皮话/1 | 他爱说大家被逗笑 | People often laugh at his witty remarks, so the word must mean wisecrack.
绕口令/1 | 四是四十是十说快易错 | The line 四是四，十是十 is easy to trip over when said fast, so the word must mean tongue twister.
顺口溜/1 | 交通规则编成好记的句子 | The teacher turned the traffic rules into easy rhymes and the pupils remembered them at once, so the word must mean doggerel.
口头禅/1 | 差不多他总挂在嘴上 | Whatever happens he says 差不多, so the word must mean pet phrase.
警句/1 | 文章里读了很受启发的句子 | Many lines in the article are inspiring, so the word must mean epigram.
熟语/1 | 成语谚语歇后语 | Chengyu, sayings and xiehouyu all belong to it, so the word must mean set phrase.
横批/1 | 春联贴在门上方的一条 | Above the door, between the two couplet scrolls, one more strip is pasted, so the word must mean horizontal couplet scroll.
措辞/1 | 给校长写信要礼貌 | A letter to the head teacher must be polite and proper, so the word must mean wording.
字斟句酌/1 | 合同重要看了一遍又一遍 | The contract is important and he read it again and again, so the word must mean to choose words with care.
咬文嚼字/1 | 说话不必太计较字眼 | Speech need only be clear in meaning, so the word must mean to be pedantic about words.
贴切/1 | 比喻一下子让人明白 | The comparison makes the point clear at once, so the word must mean fitting.
直白/1 | 话说得不考虑别人感受 | He spoke without any thought for others' feelings, so the word must mean plain-spoken.
拗口/1 | 读音相近的字太多 | The sentence has too many similar-sounding characters, so the word must mean hard to pronounce.
顺口/1 | 儿歌小朋友很快会背 | Children learn the nursery rhyme by heart very quickly, so the word must mean flowing.
精炼/1 | 每个字都恰到好处 | Every word in his writing is exactly right, so the word must mean succinct.
赘述/1 | 前面讲过这里不再说 | What was covered earlier will not be repeated here, so the word must mean to go over again.
混淆/1 | 己和已样子很像 | The characters 己 and 已 look very alike, so the word must mean to confuse.
哎呀/1 | 把作业本忘在教室了 | The speaker has left the exercise book in the classroom, so the word must mean oh dear.
哎哟/1 | 脚扭了好疼 | The speaker has twisted an ankle and it hurts, so the word must mean ouch.
唉声叹气/1 | 没考好一回家就 | He did badly in the exam and sighs and groans at home, so the word must mean to moan and sigh.
哦/1 | 原来是这样终于明白 | The speaker has just understood how things are, so the word must mean oh.
哇/1 | 孩子们走进海洋馆叫起来 | The children cry out in amazement on entering the aquarium, so the word must mean wow.
嘛/1 | 他本来就是个孩子 | He is only a child after all and the speaker says not to expect too much, so the word must mean a particle of the obvious.
啦/1 | 太好我们爬到山顶 | The speaker is delighted to have finally reached the summit, so the word must mean a particle of excitement.
乐呵呵/1 | 爷爷整天好像没有烦恼 | Grandpa seems never to have a worry, so the word must mean happy and smiling.
嘿嘿/1 | 一笑说秘密不能告诉你 | He laughed and said he could not tell the secret, so the word must mean hehe.
语气词/1 | 吗呢吧放在句末 | Words like 吗, 呢 and 吧 at the end of a sentence show questioning or suggestion, so the word must mean modal particle.
烘托/1 | 阴沉天气衬出悲伤心情 | Gloomy weather brings out the character's sorrow, so the word must mean to set off.
照应/1 | 结尾和开头互相呼应 | The ending and the opening answer each other, so the word must mean to echo.
铺垫/1 | 前面写辛苦为最后成功准备 | The early paragraphs on the hero's hardship prepare for his final success, so the word must mean setup.
开门见山/1 | 第一句就点明主题 | The first sentence states the theme, so the word must mean to come straight to the point.
寓情于景/1 | 通过落叶表达思念 | The author shows his longing through falling autumn leaves instead of saying it, so the word must mean to express feeling through scenery.
画龙点睛/1 | 结尾一句让主题更鲜明 | The last sentence makes the theme clearer, so the word must mean to add the crucial finishing touch.
欲扬先抑/1 | 先写不起眼后写了不起 | The essay first makes him seem ordinary and only then shows how remarkable he is, so the word must mean to suppress before praising.
侧面描写/1 | 写路人都回头看她 | Her beauty is shown through passers-by turning to look, so the word must mean indirect description.
正面描写/1 | 直接写外貌语言动作 | His looks, words and actions are described straight out, so the word must mean direct description.
借物喻人/1 | 写小草赞美普通人 | The essay about roadside grass really praises ordinary people who work quietly, so the word must mean to describe people through objects.
风趣/1 | 老师说话同学们常被逗笑 | The pupils often laugh at Mr Wang's way of talking, so the word must mean humorous.
俏皮/1 | 小女孩朝我做鬼脸 | The little girl pulled a funny face at the speaker, so the word must mean playful.
打趣/1 | 拿新发型开玩笑 | Everyone joked about his new haircut and he laughed along, so the word must mean to tease.
自嘲/1 | 说自己就是长个子慢 | He said he was quick at everything except growing taller, so the word must mean to laugh at oneself.
挖苦/1 | 总说刺伤别人的话 | Constant sarcasm hurts people, so the word must mean to mock.
玩笑/1 | 你别当真 | You should not take it seriously, so the word must mean joke.
说笑/1 | 晚饭后在院子里聊天 | After supper the family sit in the yard chatting and laughing, so the word must mean to chat and joke.
冷笑话/1 | 讲完谁也没笑 | After his joke everyone looked at each other and nobody laughed, so the word must mean corny joke.
段子/1 | 网上好笑的转发给朋友 | He saw something funny online and passed it to friends at once, so the word must mean funny story.
幽默感/1 | 爸爸总能逗笑一家人 | Dad can always make the family laugh, so the word must mean sense of humour.
傻话/1 | 你一定能考好的 | The speaker is sure you will do well in the exam, so the word must mean nonsense.
悄悄话/1 | 两个好朋友在角落小声说 | Two good friends talk quietly in a corner, so the word must mean secret whisper.
废话/1 | 写文章要简洁 | Writing should be concise, so the word must mean useless words.
客套话/1 | 老朋友不用说 | Old friends need no formal politeness, so the word must mean polite formulas.
场面话/1 | 会上说的不一定真心 | What he said at the meeting may not be sincere, so the word must mean things said for show.
大白话/1 | 用它讲科学小学生能懂 | The book explains science simply enough for schoolchildren, so the word must mean plain language.
心里话/1 | 今晚想跟你说几句 | Tonight the speaker wants to tell you what they really feel, so the word must mean what is on one's mind.
谎话/1 | 说了后来自己很不安 | He felt uneasy afterwards about what he had said, so the word must mean lie.
撒谎/1 | 从小不说假话大家信任 | Everyone trusts him because he has always told the truth, so the word must mean to lie.
气话/1 | 生气时说的别往心里去 | He said it in anger and you should not take it to heart, so the word must mean angry words.
啥/1 | 你说什么我没听清 | The speaker did not catch what you just said, so the word must mean what.
咱/1 | 我们俩是好朋友 | The two of us are good friends and you can ask for anything, so the word must mean we.
俺/1 | 山东人说我 | He is from Shandong and says this instead of 我, so the word must mean I.
吴语/1 | 上海话和苏州话 | Shanghainese and Suzhou speech belong to it, so the word must mean Wu dialects.
闽南话/1 | 厦门人平时说 | Xiamen people speak it every day, so the word must mean Minnan dialect.
客家话/1 | 广东梅州很多人说 | Many people in Meizhou, Guangdong speak it, so the word must mean Hakka.
官话/1 | 北方方言也叫 | The northern dialects spoken from the northeast to the southwest have this other name, so the word must mean Mandarin dialects.
东北话/1 | 把干什么说成干啥 | He says 干啥 instead of 干什么, so the word must mean Northeastern dialect.
四川话/1 | 成都人平时说 | People in Chengdu speak it every day, so the word must mean Sichuan dialect.
乡音/1 | 离开家乡几十年没改 | After decades away from home his accent has not changed at all, so the word must mean native accent.
守株待兔/1 | 只盼着下次还有好运气 | Doing well once, he stopped revising and hoped for luck again, so the word must mean to wait idly for windfalls.
狐假虎威/1 | 仗着哥哥是班长作威作福 | He bosses classmates around because his brother is the class monitor, so the word must mean to bully by borrowed power.
画蛇添足/1 | 写得很好再加一段反而不好 | The essay was already good and the extra paragraph spoils it, so the word must mean to ruin by adding the superfluous.
井底之蛙/1 | 以为天只有井口那么大 | Without seeing the world we think the sky is as small as the mouth of a well, so the word must mean someone with a narrow view.
杯弓蛇影/1 | 小声音就以为有小偷 | Every little noise makes him think there is a burglar, so the word must mean to be needlessly suspicious.
惊弓之鸟/1 | 被狗咬过一听到狗叫就怕 | Bitten once, he is now terrified by any barking, so the word must mean someone easily frightened.
对牛弹琴/1 | 跟三岁孩子讲经济学 | Explaining economics to a three-year-old is pointless, so the word must mean to talk to the wrong audience.
亡羊补牢/1 | 错了很多现在复习还来得及 | There is still time to revise properly after a bad exam, so the word must mean to fix things after a loss.
龟兔赛跑/1 | 跑得快的骄傲睡大觉 | The fast runner grew proud, fell asleep and lost, so the word must mean the tortoise and the hare.
乌鸦喝水/1 | 往瓶子里放石子水升上来 | The bird drops pebbles into the bottle until the water rises, so the word must mean the crow drinking water.
兔死狐悲/1 | 同行公司倒闭不免难过 | Seeing other firms in his trade close one by one saddens him, so the word must mean to grieve for one's own kind.
鸦雀无声/1 | 老师一进教室立刻安静 | The noisy class falls silent as soon as the teacher walks in, so the word must mean utter silence.
门可罗雀/1 | 饭店以前客人多现在冷清 | The once busy restaurant now has almost no customers, so the word must mean deserted.
鸡犬不宁/1 | 装修吵得整栋楼 | A month of renovation next door disturbed the whole building, so the word must mean general disturbance.
鹏程万里/1 | 毕业时祝前程似锦 | At graduation the teacher wishes the pupils a great future, so the word must mean a bright future.
金蝉脱壳/1 | 借口去洗手间悄悄离开 | He said he was going to the toilet and slipped away from the reporters, so the word must mean to escape by a ruse.
呆若木鸡/1 | 听到消息站着说不出话 | He stood speechless at the news, so the word must mean dumbfounded.
卧虎藏龙/1 | 小村子出过好几位画家 | The small village has produced several famous painters, so the word must mean hidden talents.
龙飞凤舞/1 | 爷爷的毛笔字很有气势 | Grandpa's brush writing is bold and sweeping, so the word must mean lively flowing calligraphy.
如鱼得水/1 | 到新研究所工作进步快 | He thrives and makes fast progress at the new institute, so the word must mean to be in one's element.
塞翁失马/1 | 没考上却遇到好老师 | He failed to get into that school but met a good teacher at another, so the word must mean a loss that may turn out well.
老马识途/1 | 爷爷住了一辈子找到小路 | Grandpa, who has lived here all his life, found the little path for us, so the word must mean the old horse knows the road.
一马当先/1 | 队长总冲在最前面 | The captain always charges ahead when there is trouble, so the word must mean to take the lead.
走马观花/1 | 参观博物馆不停下仔细看 | A museum should be looked at slowly and carefully, so the word must mean to look at things hastily.
害群之马/1 | 球队里故意不配合的人 | One player keeps refusing to cooperate with the team, so the word must mean black sheep.
马不停蹄/1 | 下了飞机就赶到会场 | He went straight from the plane to the meeting, so the word must mean nonstop.
单枪匹马/1 | 一个人来城市创业 | He came to the city alone to start a business, so the word must mean single-handedly.
蛛丝马迹/1 | 警察不放过任何线索 | The police checked the room for the smallest clue, so the word must mean faint traces.
千军万马/1 | 考生们过独木桥 | On exam day candidates are said to cross a single-log bridge in huge numbers, so the word must mean a mighty host.
马到成功/1 | 比赛前朋友们祝他 | Before the match his friends wished him quick success, so the word must mean to win at once.
刻舟求剑/1 | 情况变了还用老办法 | Things have changed completely and you still use a method from ten years ago, so the word must mean to act without regard to change.
郑人买履/1 | 买鞋不试穿要回家拿尺码 | Not trying shoes on and going home for the measurement is laughable, so the word must mean rigid adherence to dogma.
骑驴找驴/1 | 眼镜就戴在头上 | He searched everywhere for the glasses that were on his head, so the word must mean to search for what is under one's nose.
叶公好龙/1 | 说喜欢小狗来了却害怕 | He says he loves puppies but backs away in fright when one comes near, so the word must mean to love something only in name.
盲人摸象/1 | 只看一章就评价整本书 | Reading one chapter and judging the whole book is like this, so the word must mean to judge the whole by a part.
画饼充饥/1 | 光想好吃的肚子还饿 | Thinking about good food does not fill an empty stomach, so the word must mean to feed on illusions.
望梅止渴/1 | 曹操说前面有梅林 | Cao Cao told thirsty soldiers there was a plum grove ahead and their mouths watered, so the word must mean to console with false hopes.
纸上谈兵/1 | 读游泳的书却没下过水 | He has read many books on swimming but never been in the water, so the word must mean to theorise without practice.
弄巧成拙/1 | 装饰蛋糕奶油弄得到处是 | Trying to make the cake prettier, he got cream everywhere, so the word must mean to make things worse by being clever.
朝三暮四/1 | 今天学画明天学钢琴 | He wants painting one day and piano the next, so the word must mean to keep changing one's mind.
完璧归赵/1 | 借来的书好好保管还回 | The speaker will keep the borrowed book carefully and return it as it was, so the word must mean to return something intact.
负荆请罪/1 | 知道错了主动道歉 | He knew he was wrong and went to apologise the next day, so the word must mean to offer a humble apology.
围魏救赵/1 | 攻打魏都逼魏军回来 | The Qi army attacked the Wei capital instead of going to Zhao, forcing Wei to pull back, so the word must mean to relieve one place by attacking another.
退避三舍/1 | 见了脾气急的他都让开 | Classmates keep well away from the strong, hot-tempered boy, so the word must mean to keep well clear.
唇亡齿寒/1 | 一个灭亡另一个难保 | If one small state falls, the other can hardly survive, so the word must mean closely interdependent.
卧薪尝胆/1 | 输了以后每天苦练 | After losing, he trained hard every day and won the next year, so the word must mean to endure hardship for revenge.
四面楚歌/1 | 观点没有一个人支持 | Not one person at the meeting supported his view, so the word must mean surrounded by enemies.
背水一战/1 | 最后一次机会全力拼 | This is the last chance and we must give everything, so the word must mean to fight with no retreat.
草木皆兵/1 | 望见草木以为是敌兵 | An ancient ruler saw the plants on a hill and thought they were enemy soldiers, so the word must mean to see enemies everywhere.
指鹿为马/1 | 赵高把鹿说成马 | Zhao Gao called a deer a horse and no minister dared disagree, so the word must mean to deliberately misrepresent.
三顾茅庐/1 | 校长去了好几次请专家 | The head teacher visited the expert several times to win him over, so the word must mean to call on someone repeatedly to recruit them.
初出茅庐/1 | 刚毕业很多事不懂 | He has just graduated and knows little yet, so the word must mean inexperienced.
草船借箭/1 | 诸葛亮三天得到十万支箭 | In Romance of the Three Kingdoms, Zhuge Liang got a hundred thousand arrows in three days, so the word must mean borrowing arrows with straw boats.
刘备/1 | 三次去请诸葛亮出山 | He went three times to ask Zhuge Liang to help him, so the word must mean Liu Bei.
诸葛亮/1 | 比喻非常聪明会出主意的人 | His name is used for a very clever person full of plans, so the word must mean Zhuge Liang.
曹操/1 | 东汉末年政治家也是诗人 | He was a statesman of the late Eastern Han and also a poet, so the word must mean Cao Cao.
关羽/1 | 后人尊称关公 | Later generations call him Lord Guan, so the word must mean Guan Yu.
张飞/1 | 三国里脾气急说话直的猛将 | In Three Kingdoms tales he is a fierce, hot-tempered, blunt general, so the word must mean Zhang Fei.
说曹操曹操到/1 | 正说着小王他就进来了 | Xiao Wang walked in just as we were talking about him, so the word must mean speak of the devil.
三个臭皮匠/1 | 顶个诸葛亮大家一起想 | The saying says together they match one Zhuge Liang, so the word must mean three ordinary people.
凿壁偷光/1 | 墙上挖洞借邻居家光读书 | A poor child made a hole in the wall to read by the neighbour's light, so the word must mean to study hard despite poverty.
囊萤映雪/1 | 用萤火虫和雪光照明读书 | Ancient students read by fireflies in a bag or light reflected from snow, so the word must mean to study diligently in hardship.
悬梁刺股/1 | 困了把头发系在房梁上 | Ancient students tied their hair to the beam to stay awake reading, so the word must mean to study with grim determination.
程门立雪/1 | 在老师门外雪里站着等 | Yang Shi stood in heavy snow at his teacher's door waiting for him to wake, so the word must mean to stand in the snow at a teacher's door.
孟母三迁/1 | 为孩子好环境搬好几次家 | She moved house several times to give her child a good environment, so the word must mean Mencius's mother moving three times.
手不释卷/1 | 八十岁每天读两小时书 | At eighty Grandpa still reads two hours a day, so the word must mean never putting down a book.
学富五车/1 | 老教授什么问题都难不倒 | No question can stump the old professor, so the word must mean very learned.
才高八斗/1 | 写的诗文没人比得上 | Nobody can match his poems and essays, so the word must mean of great talent.
七步成诗/1 | 曹植走七步作一首诗 | Cao Zhi is said to have made a poem in the time it took to walk seven steps, so the word must mean quick literary talent.
江郎才尽/1 | 后来再写不出好作品 | He wrote many fine poems when young but nothing good later, so the word must mean to have exhausted one's talent.
胸有成竹/1 | 早想好解法回答很从容 | He had worked out the solution long before and answered calmly, so the word must mean to have a plan in mind.
班门弄斧/1 | 在书法家面前写毛笔字 | The speaker is writing calligraphy in front of a master calligrapher, so the word must mean to show off before a master.
入木三分/1 | 评论把问题分析得很深 | The review analyses the problem very deeply, so the word must mean incisive.
目无全牛/1 | 拆开表就能找出问题 | The old master can find the fault in any watch within minutes, so the word must mean consummate skill.
百步穿杨/1 | 射箭本领很高 | His archery is excellent, so the word must mean expert marksmanship.
运斤成风/1 | 一把斧子用得非常灵活 | The carpenter wields his axe with great skill, so the word must mean masterly skill.
巧夺天工/1 | 玉雕的花像真的一样 | The flowers carved in jade look real, so the word must mean craftsmanship surpassing nature.
出神入化/1 | 魔术表演观众看呆了 | The audience is spellbound by his magic, so the word must mean to reach perfection.
鲁班/1 | 被木匠尊为祖师 | Carpenters honour him as the founder of their craft, so the word must mean Lu Ban.
一技之长/1 | 学会一门手艺不怕找不到工作 | With a trade, you need not worry about finding work, so the word must mean a particular skill.
水滴石穿/1 | 每天背十个单词一年很可观 | Learning ten words every day adds up to a great deal in a year, so the word must mean constant dripping wears away stone.
一曝十寒/1 | 学习不能晒一天冻十天 | The sentence insists on keeping at it every day, so the word must mean to work by fits and starts.
有始有终/1 | 答应了就不能做到一半不管 | Having agreed to it, you must not drop it halfway, so the word must mean to finish what one starts.
百折不挠/1 | 经历很多失败最后成功 | He failed many times and finally succeeded, so the word must mean indomitable.
聚沙成塔/1 | 每人捐一点帮很多人 | If everyone gives a little, many people in need can be helped, so the word must mean many small amounts make a great deal.
虎头蛇尾/1 | 开头热情没几天放弃 | He starts eagerly and gives up within a few days, so the word must mean to start strong and fizzle out.
一鼓作气/1 | 中间不休息爬上山顶 | They climbed to the summit without resting once on the way, so the word must mean in one go.
再接再厉/1 | 表现很好希望更好成绩 | They did well this time and are urged to do even better, so the word must mean to keep up the effort.
卷土重来/1 | 去年输了今年又来赢冠军 | They lost last year and came back this year to win the title, so the word must mean to stage a comeback.
功败垂成/1 | 只差最后一步失败了 | He was only one step away when it fell through, so the word must mean to fail on the verge of success.
高山流水/1 | 两人都爱音乐最懂对方 | The two both love music and understand each other best, so the word must mean perfect understanding between friends.
知音/1 | 人生难得遇到懂自己的人 | Meeting someone who truly understands you is rare in life, so the word must mean soulmate.
锦上添花/1 | 本来优秀获奖更好 | He was already excellent and the prize adds to that, so the word must mean to make something good even better.
落井下石/1 | 别人困难时还说他坏话 | Instead of helping a person in trouble, he speaks ill of him at that very moment, so the word must mean to hit someone who is down.
过河拆桥/1 | 事办成就不理帮过他的人 | Once his business was done he ignored everyone who had helped him, so the word must mean to abandon one's helpers.
拔刀相助/1 | 弱小同学被欺负站出来 | He always stands up when a weaker classmate is bullied, so the word must mean to step in to help.
一臂之力/1 | 有困难我愿意帮你 | The speaker is willing to help if you are in difficulty, so the word must mean a helping hand.
同甘共苦/1 | 夫妻几十年感情很好 | The couple have been through decades together and are still close, so the word must mean to share weal and woe.
患难与共/1 | 地震中全村一起重建家园 | After the earthquake the whole village rebuilt their homes together, so the word must mean to stand together in adversity.
齐心协力/1 | 大家一条心把事办好 | If we all pull together the job will get done, so the word must mean to work together.
刮目相看/1 | 他进步快大家对他看法变了 | He has improved quickly and teachers and classmates now see him differently, so the word must mean to look at someone with new eyes.
士别三日/1 | 半年不见汉语说得这么好 | After only half a year apart, the friend's Chinese has become remarkably good, so the word must mean people change quickly.
青出于蓝/1 | 学生比老师更有名 | His student later became more famous than he was, so the word must mean the pupil surpasses the master.
大器晚成/1 | 五十岁才出版第一本小说 | He published his first novel only at fifty, so the word must mean great talents mature late.
少年老成/1 | 十二岁说话做事很稳重 | The child is only twelve but speaks and acts very steadily, so the word must mean old head on young shoulders.
乳臭未干/1 | 别看不起他年纪小 | People look down on him for his young age, so the word must mean very young and inexperienced.
宝刀不老/1 | 七十岁教练示范动作标准 | The seventy-year-old coach still demonstrates every move perfectly, so the word must mean still as capable as ever.
老当益壮/1 | 爷爷退休后学会开车锻炼 | Grandpa learned to drive after retiring and exercises in the park every day, so the word must mean old but still vigorous.
后起之秀/1 | 年轻棋手赢了好几位老将 | The young go player has already beaten several veterans, so the word must mean promising newcomer.
年富力强/1 | 三十多岁正是好时候 | He is in his thirties, a time of full strength, so the word must mean in the prime of life.
扁鹊/1 | 战国名医总结看病方法 | This famous Warring States doctor is said to have set out the four ways of examining a patient, so the word must mean Bian Que.
对症下药/1 | 先找到原因再解决 | You must find the cause of poor marks before you can fix them, so the word must mean to suit the remedy to the problem.
妙手回春/1 | 病人出院送医生锦旗 | A cured patient leaving hospital gives the doctor a silk banner, so the word must mean skilled hands that restore health.
起死回生/1 | 快倒闭的工厂又好了 | A new manager rescues a factory that was about to close, so the word must mean to revive.
悬壶济世/1 | 回家乡给乡亲看病 | After medical school he went home to treat the villagers, so the word must mean to practise medicine to help people.
杏林/1 | 董奉请病人种树 | Dong Feng asked cured patients to plant apricot trees instead of paying, so the word must mean the medical profession.
望闻问切/1 | 看听问摸脉 | Chinese doctors look, listen, ask and take the pulse, so the word must mean the four methods of diagnosis.
药到病除/1 | 开的药一吃病就好 | The experienced doctor's medicine usually cures quickly, so the word must mean the medicine cures at once.
防微杜渐/1 | 小错不改变大错 | Small faults left alone grow into big ones, so the word must mean to check at the outset.
李时珍/1 | 写成本草纲目 | This Ming physician spent nearly thirty years writing the Compendium of Materia Medica, so the word must mean Li Shizhen.
一举两得/1 | 锻炼身体又保护环境 | Cycling to work both gives exercise and protects the environment, so the word must mean to gain two ends at once.
三心二意/1 | 做作业要专心 | Homework needs full attention, so the word must mean distracted.
九牛一毛/1 | 这点钱对他来说很少 | That sum means almost nothing to such a rich man, so the word must mean a tiny fraction.
一字千金/1 | 文章写得精彩 | The writer's essays are brilliant enough for every word to be prized, so the word must mean writing of great value.
七上八下/1 | 等成绩时心里不安 | He is waiting nervously for his exam results, so the word must mean anxious.
十全十美/1 | 世上没有毫无缺点的人 | Everyone in the world has faults, so the word must mean flawless.
万无一失/1 | 计划检查好几遍 | He checked the plan several times before setting out, so the word must mean absolutely safe.
五湖四海/1 | 来自各地为同一目标 | We come from all over and share one goal, so the word must mean all corners of the country.
一波三折/1 | 航班取消又丢行李 | First the flight was cancelled and then the luggage was lost, so the word must mean full of setbacks.
得寸进尺/1 | 让了一次要求越来越多 | Each time you give way his demands grow, so the word must mean to push one's luck.
盘古开天/1 | 天地原来连在一起 | In this myth heaven and earth were at first joined together, so the word must mean Pangu separating heaven and earth.
精卫填海/1 | 小鸟衔石子填大海 | In this myth a small bird carries pebbles every day to fill the sea, so the word must mean Jingwei filling the sea.
夸父逐日/1 | 巨人追着太阳跑 | In this myth a giant runs after the sun, so the word must mean Kuafu chasing the sun.
牛郎织女/1 | 七月初七在鹊桥相会 | Legend says the couple meet on a bridge of magpies on the seventh of the seventh month, so the word must mean the cowherd and the weaver girl.
天衣无缝/1 | 配合一点问题也没有 | Their teamwork had no problems at all, so the word must mean flawless.
八仙过海/1 | 各显神通用上绝招 | Every team used its own special trick in the contest, so the word must mean the Eight Immortals crossing the sea.
姜太公钓鱼/1 | 愿者上钩没人逼他 | Nobody forced him and he chose to take part himself, so the word must mean Jiang Taigong fishing.
王婆卖瓜/1 | 总说自己做的菜最好 | He always says his own cooking is the best, so the word must mean Granny Wang selling melons.
孔融让梨/1 | 告诉孩子学会谦让 | The story teaches children to give way to others, so the word must mean Kong Rong giving up the pears.
曹冲称象/1 | 小孩用船和石头称大象 | In this story a little boy weighs an elephant using a boat and stones, so the word must mean Cao Chong weighing the elephant.
出处/1 | 成语在哪本古书里 | The question asks which ancient book the chengyu comes from, so the word must mean source.
用典/1 | 古人写诗引用故事 | Readers of old poems must know the stories behind them, so the word must mean to use allusions.
引经据典/1 | 一开口就是古书里的话 | Whenever he speaks he quotes ancient books, so the word must mean to quote authoritative works.
来历/1 | 石碑老人说得清楚 | The old villagers can all explain where the stone tablet came from, so the word must mean origin.
掌故/1 | 熟悉北京老胡同的故事 | The old gentleman tells endless stories of old Beijing hutongs, so the word must mean historical anecdotes.
佳话/1 | 互助几十年在村里传 | The story of two old people helping each other is retold fondly in the village, so the word must mean much-told story.
美谈/1 | 还钱包成了大家口中的 | Returning a lost wallet made him the talk of the town in a good way, so the word must mean praised deed.
出自/1 | 温故知新来自论语 | The saying 温故知新 comes from the Analects, so the word must mean to come from.
千古/1 | 故事一直流传 | The story has been told and praised down the ages, so the word must mean through the ages.
原文/1 | 是我翻译的本来是古文 | The speaker translated the sentence from an ancient text, so the word must mean original text.
苦尽甘来/1 | 多年努力过上好日子 | After years of hard work they finally live well, so the word must mean good days after hard ones.
乐极生悲/1 | 高兴得跳起来扭伤脚 | He jumped for joy at winning and twisted his ankle, so the word must mean extreme joy begets sorrow.
时来运转/1 | 失业几个月找到好工作 | Out of work for months, he has recently found a good job, so the word must mean one's luck changes.
好事多磨/1 | 不顺利但最后能办成 | The matter is not going smoothly but will succeed in the end, so the word must mean good things come through trials.
柳暗花明/1 | 找不到出路突然有希望 | Just when they saw no way out, new hope suddenly appeared, so the word must mean a new prospect opens up.
转危为安/1 | 病人经抢救脱离危险 | After the doctors' rescue the patient is out of danger, so the word must mean to pull through.
喜出望外/1 | 收到录取通知书 | He has just received his university offer letter, so the word must mean pleasantly surprised.
节外生枝/1 | 事情快办好别再出新问题 | The matter is almost settled and you are told not to cause new trouble, so the word must mean to raise side issues.
失而复得/1 | 丢了的小狗跑回家 | The puppy missing for three days came home on its own, so the word must mean to regain what was lost.
福无双至/1 | 丢钱包又弄坏手机 | He lost his wallet and then broke his phone, so the word must mean blessings never come in pairs.
苏格拉底/1 | 自己没写书靠学生记录 | He wrote no books and his ideas survive through his students, so the word must mean Socrates.
柏拉图/1 | 在雅典创办学园 | He founded an academy in Athens and taught there for decades, so the word must mean Plato.
亚里士多德/1 | 当过亚历山大的老师 | He was Plato's student and later tutored Alexander the Great, so the word must mean Aristotle.
赫拉克利特/1 | 人不能两次踏进同一条河 | He said nobody can step into the same river twice, so the word must mean Heraclitus.
泰勒斯/1 | 认为万物本原是水 | Called the first Greek philosopher, he held that everything comes from water, so the word must mean Thales.
毕达哥拉斯/1 | 认为万物都是数 | He held that all things are number and the Pythagorean theorem bears his name, so the word must mean Pythagoras.
芝诺/1 | 最快的人追不上乌龟 | He asked how the fastest runner could ever catch the tortoise ahead, so the word must mean Zeno.
第欧根尼/1 | 住在一个大缸里 | Legend says he lived in a large jar with almost no possessions, so the word must mean Diogenes.
犬儒学派/1 | 像狗一样简单生活 | Diogenes, who wanted to live as simply as a dog, is the leading figure, so the word must mean Cynicism.
斯多葛学派/1 | 用理性控制情绪 | It teaches controlling feelings by reason and calmly accepting what cannot change, so the word must mean Stoicism.
笛卡尔/1 | 我思故我在 | "I think, therefore I am" is the famous line of this French philosopher, so the word must mean Descartes.
帕斯卡/1 | 发明计算器帮父亲算税 | As a young man this French thinker invented a calculator to help his father with taxes, so the word must mean Pascal.
洛克/1 | 心灵像一块白板 | This English philosopher said the newborn mind is like a blank slate, so the word must mean Locke.
卢梭/1 | 爱弥儿主张顺应天性 | In Emile he argued that education should follow a child's nature, so the word must mean Rousseau.
康德/1 | 散步邻居就知道几点 | Neighbours could tell the time from this German philosopher's daily walk, so the word must mean Kant.
黑格尔/1 | 把辩证法发展成体系 | This German philosopher built dialectics into a complete system, so the word must mean Hegel.
叔本华/1 | 以悲观人生观闻名 | This German philosopher is known for his pessimism, so the word must mean Schopenhauer.
萨特/1 | 拒绝诺贝尔文学奖 | This French existentialist turned down the Nobel Prize in Literature, so the word must mean Sartre.
培根/1 | 知识就是力量 | "Knowledge is power" is often credited to this English philosopher, so the word must mean Francis Bacon.
维特根斯坦/1 | 哲学问题来自对语言的误解 | He held that many philosophical problems come from misunderstanding language, so the word must mean Wittgenstein.
孟子/1 | 主张人性本善 | He held that human nature is good and a book bearing his name records his words, so the word must mean Mencius.
亚圣/1 | 孟子被尊为 | Confucius is the Supreme Sage and Mencius has the title next to his, so the word must mean Second Sage.
韩非子/1 | 法家集大成者 | He brought Legalist thought together at the end of the Warring States, so the word must mean Han Feizi.
杨朱/1 | 主张贵己 | He taught that everyone should first treasure his own life, so the word must mean Yang Zhu.
惠施/1 | 庄子的朋友常辩论 | He was Zhuangzi's good friend and often debated with him, so the word must mean Hui Shi.
公孙龙/1 | 白马非马 | He put forward the famous claim that a white horse is not a horse, so the word must mean Gongsun Long.
列子/1 | 能乘着风在天上走 | Zhuangzi's book says he could ride the wind across the sky, so the word must mean Liezi.
管子/1 | 齐国管仲的尊称 | Later people gave Guan Zhong, the statesman of Qi, this honoured name, so the word must mean Guanzi.
告子/1 | 认为人性没有善和不善 | Against Mencius, he said human nature is neither good nor bad, so the word must mean Gaozi.
先秦/1 | 孔子老子庄子的时期 | Confucius, Laozi and Zhuangzi all lived before the Qin, so the word must mean pre-Qin period.
见贤思齐/1 | 向身边优秀同学学习 | We should learn from the excellent classmates around us, so the word must mean to strive to equal the virtuous.
非礼勿视/1 | 不合礼的事不看 | Of Confucius's four rules about improper things, this is the one about looking, so the word must mean look not at what is improper.
三十而立/1 | 孔子三十岁能自立 | Confucius said he could stand on his own at thirty, so the word must mean established at thirty.
四十不惑/1 | 刚好四十岁 | He has just turned forty, so the word must mean no longer perplexed at forty.
知天命/1 | 五十而 | Confucius described himself at fifty with these words, so the word must mean to know the will of heaven.
有教无类/1 | 不管穷富都愿意教 | Confucius taught pupils whether they were rich or poor, so the word must mean teaching without discrimination.
仁者爱人/1 | 有仁德的人关心别人 | Confucians held that a humane person always cares about others, so the word must mean the humane love people.
圣贤/1 | 古代读书人的榜样 | Old scholars took them as models in hope of becoming virtuous, so the word must mean sages and worthies.
己所不欲/1 | 勿施于人 | The saying tells you not to force on others what you would not want yourself, so the word must mean what one does not wish for oneself.
君子/1 | 和而不同 | Confucius contrasts this kind of person with the petty person, so the word must mean person of virtue.
上善若水/1 | 帮助万物却不争 | Laozi praised water for helping all things without competing, so the word must mean supreme goodness is like water.
道法自然/1 | 顺着自然规律做事 | Laozi taught that people should follow nature's laws, so the word must mean the Way follows nature.
无为而治/1 | 汉初让百姓休养生息 | Early Han rulers left the people alone to recover, so the word must mean to govern by doing nothing.
大巧若拙/1 | 看上去笨手笨脚 | The quiet old craftsman looks clumsy but is highly skilled, so the word must mean true skill appears clumsy.
庄周梦蝶/1 | 分不清梦见蝴蝶还是蝴蝶梦见自己 | On waking Zhuangzi could not tell whether he had dreamed of a butterfly or the reverse, so the word must mean Zhuangzi dreaming of a butterfly.
齐物论/1 | 从道看万物平等 | In this chapter Zhuangzi says all things are equal from the view of the Dao, so the word must mean Discourse on Making All Things Equal.
子非鱼/1 | 怎么知道鱼的快乐 | Huishi asked Zhuangzi how he could know the happiness of fish, so the word must mean you are not a fish.
道德经/1 | 老子五千多字 | Laozi is said to have left a book of some five thousand characters, so the word must mean Tao Te Ching.
坐忘/1 | 静坐忘掉一切 | Zhuangzi described sitting still and forgetting the body and the outside world, so the word must mean sitting and forgetting.
心斋/1 | 让心清净不被杂念打扰 | Zhuangzi described keeping the mind as clean as a fasting stomach, so the word must mean fasting of the mind.
周易/1 | 最古老的经典讲万物变化 | One of China's oldest classics, it is about how all things change, so the word must mean I Ching.
八卦/1 | 天地雷风水火山泽 | Heaven, earth, thunder, wind, water, fire, mountain and marsh are what they stand for, so the word must mean eight trigrams.
乾坤/1 | 扭转根本改变局面 | People speak of turning these round to mean changing things completely, so the word must mean the universe.
太极/1 | 生出阴阳两仪 | The ancients believed it gave rise to yin and yang, so the word must mean taiji.
五行/1 | 金木水火土 | Metal, wood, water, fire and earth explain how things relate, so the word must mean five phases.
天人合一/1 | 人和自然和谐相处 | This idea holds that people should live in harmony with nature, so the word must mean unity of heaven and humanity.
相生相克/1 | 木生火水克火 | Wood feeds fire and water puts it out, so the word must mean mutual generation and restraint.
自强不息/1 | 天行健君子以 | The Book of Changes ties it to heaven's strong motion, so the word must mean to strive ceaselessly.
厚德载物/1 | 地势坤君子以 | The Book of Changes ties it to the earth that bears all things, so the word must mean great virtue bears all things.
浑然一体/1 | 园林建筑和山水好像天然生成 | The garden's buildings and landscape look as if they grew there naturally, so the word must mean an integral whole.
王阳明/1 | 哲学家军事家书法家 | This Ming thinker was also a general and a calligrapher, so the word must mean Wang Yangming.
陆九渊/1 | 心学的开创者 | This Southern Song thinker started the School of Mind that Wang Yangming carried on, so the word must mean Lu Jiuyuan.
张载/1 | 为天地立心 | This Northern Song thinker spoke of setting up a heart for heaven and earth, so the word must mean Zhang Zai.
二程/1 | 北宋一对理学家兄弟 | Two Northern Song brothers who were both Neo-Confucians are named together, so the word must mean the two Chengs.
理学/1 | 天地万物都有一个理 | Song thinkers held that all things contain a principle called 理, so the word must mean School of Principle.
心学/1 | 道理就在自己心里 | Wang Yangming held that truth lies in one's own mind, not outside, so the word must mean School of Mind.
知行合一/1 | 知道道理还要去做 | Knowing the truth is not enough without acting on it, so the word must mean unity of knowledge and action.
致良知/1 | 心里本来有分辨善恶的能力 | Late in life Wang Yangming said everyone has an inborn sense of right and wrong, so the word must mean to extend innate knowledge.
龙场悟道/1 | 被贬到贵州想通道理 | Exiled to Guizhou, Wang Yangming worked many things out there, so the word must mean awakening at Longchang.
心即理/1 | 道理就在人的心中 | Lu Jiuyuan and Wang Yangming both held that principle is in the mind, so the word must mean the mind is principle.
非黑即白/1 | 不是好人就是坏人 | He thinks people are either good or bad with nothing in between, so the word must mean all or nothing.
因果倒置/1 | 消防车引起了火灾 | The argument says fire engines cause fires because places with more engines have more fires, so the word must mean confusing cause and effect.
自圆其说/1 | 解释前后矛盾 | His explanation contradicts itself, so the word must mean to make one's story hold together.
漏洞百出/1 | 编的理由谁也不信 | Nobody believes the excuse he made up, so the word must mean riddled with flaws.
强词夺理/1 | 明明错了还说是别人的错 | He was clearly wrong and still argued that others were to blame, so the word must mean to argue speciously.
理屈词穷/1 | 被追问只好认错 | Under everyone's questions he finally had to admit his mistake, so the word must mean to have no argument left.
胡搅蛮缠/1 | 顾客一直不让售货员走 | The customer keeps the shop assistant from leaving, so the word must mean to harass unreasonably.
颠倒黑白/1 | 他弄坏的却说别人弄坏 | He broke it himself and says someone else did, so the word must mean to turn black into white.
牵强附会/1 | 成绩和星座联系在一起 | Linking exam marks with star signs makes no sense, so the word must mean strained interpretation.
无懈可击/1 | 对方一句也反驳不了 | His opponent could not answer a single point of his argument, so the word must mean unassailable.
管中窥豹/1 | 只看一篇文章评价作家 | Judging a writer from only one article misses most of the picture, so the word must mean to see only part.
一叶知秋/1 | 从小事看出风气变化 | A small event shows a change in public manners, so the word must mean a straw in the wind.
见微知著/1 | 从很小的症状发现大病 | A good doctor spots a serious illness from tiny symptoms, so the word must mean to see the whole from a small clue.
触类旁通/1 | 学会一题解出一类题 | Learning how to solve one problem lets you solve a whole type, so the word must mean to grasp related things by analogy.
以小见大/1 | 一家人小故事写时代变化 | A family's small story shows the change of a whole era, so the word must mean to show the large through the small.
由表及里/1 | 不能只看表面现象 | You should not look only at the surface when analysing a problem, so the word must mean from the outside in.
去伪存真/1 | 网上信息不能什么都信 | Online there is much information and not all of it should be believed, so the word must mean to discard the false and keep the true.
认识论/1 | 人怎样获得知识 | It asks how people come to know things, so the word must mean epistemology.
方法论/1 | 科学研究要有正确的 | Research needs the right way of working as well as knowledge, so the word must mean methodology.
格物致知/1 | 对着竹子看了七天 | Young Wang Yangming stared at bamboo for seven days to understand it, so the word must mean to study things to gain knowledge.
思想实验/1 | 爱因斯坦想象追着光跑 | Einstein imagined chasing a beam of light, so the word must mean thought experiment.
电车难题/1 | 救五个人伤害另一个 | It asks whether one person should be harmed to save five, so the word must mean trolley problem.
囚徒困境/1 | 只考虑自己对大家都不好 | When each thinks only of himself, everyone may end up worse off, so the word must mean prisoner's dilemma.
缸中之脑/1 | 怎么知道世界是真实的 | It asks how we know the world we see is real, so the word must mean brain in a vat.
奥卡姆剃刀/1 | 能用简单解释就不用复杂的 | It says to prefer the simple explanation when it is enough, so the word must mean Occam's razor.
芝诺悖论/1 | 飞着的箭其实不动 | One of them claims a flying arrow does not really move, so the word must mean Zeno's paradox.
说谎者悖论/1 | 我现在说的这句话是假话 | A sentence that says it is false cannot be either true or false, so the word must mean liar paradox.
理发师悖论/1 | 罗素用来说明集合论问题 | Russell used it to show a problem in set theory, so the word must mean barber paradox.
中文房间/1 | 按规则处理汉字的机器算不算懂 | It asks whether a machine that handles characters by rules really understands Chinese, so the word must mean Chinese room.
无知之幕/1 | 不知道出生在什么家庭 | Not knowing what family you would be born into leads you to choose fairer rules, so the word must mean veil of ignorance.
怀疑论/1 | 皮浪对一切判断保持怀疑 | Pyrrho of ancient Greece held that every judgement should be doubted, so the word must mean scepticism.
不可知论/1 | 事物本质永远无法认识 | It holds that people can never know the essence behind things, so the word must mean agnosticism.
决定论/1 | 知道所有原因就能预测将来 | It says knowing all causes would let you predict the future exactly, so the word must mean determinism.
宿命论/1 | 一切都是命中注定 | He thinks effort is useless because everything is fated, so the word must mean fatalism.
经验主义/1 | 知识都来自经验 | Locke held that all knowledge comes from experience, so the word must mean empiricism.
理性主义/1 | 理性是知识最可靠的来源 | Descartes trusted reason as the surest source of knowledge, so the word must mean rationalism.
实用主义/1 | 杜威是代表人物 | The American philosopher Dewey is a leading figure of it, so the word must mean pragmatism.
虚无主义/1 | 人生没有意义和价值 | It holds that life has no meaning or value at all, so the word must mean nihilism.
存在主义/1 | 人先存在再通过选择决定自己 | Sartre held that people exist first and then make themselves by their choices, so the word must mean existentialism.
形而上学/1 | 世界的本原是什么 | It asks what the world fundamentally is, so the word must mean metaphysics.
浩然之气/1 | 培养正直的精神 | Mencius urged people to cultivate it and be upright, so the word must mean moral courage.
舍生取义/1 | 生命和正义不能同时得到 | Mencius said that when life and justice cannot both be had, justice comes first, so the word must mean to give one's life for justice.
民贵君轻/1 | 国家根本在于百姓 | Mencius held that the people are the root of the state, so the word must mean the people matter more than the ruler.
鱼与熊掌/1 | 多玩和考第一不可兼得 | Wanting both to play more and to come top is impossible, so the word must mean you cannot have both.
五十步笑百步/1 | 迟到五分钟笑迟到十分钟 | You were five minutes late yourself and laugh at someone ten minutes late, so the word must mean to mock others for a fault one shares.
性善论/1 | 每个人天生有同情心 | Mencius held that everyone is born with compassion, so the word must mean theory that human nature is good.
性恶论/1 | 人要靠学习和礼法才变好 | Unlike Mencius, some Confucians held that people improve only through learning and rites, so the word must mean theory that human nature is bad.
生于忧患/1 | 死于安乐 | Mencius said hardship makes people strong and comfort ruins them, so the word must mean to thrive in adversity.
牺牲/1 | 照顾妈妈放弃休息时间 | She gave up much of her rest to care for her sick mother, so the word must mean to sacrifice.
不朽/1 | 立德立功立言 | The ancients said virtue, deeds and writings make a person live on, so the word must mean imperishable.
刹那/1 | 流星划过就消失 | The meteor vanishes almost as soon as it appears, so the word must mean instant.
白驹过隙/1 | 人生很短要珍惜每一天 | Life passes quickly and we should treasure every day, so the word must mean time flies like a horse past a crack.
逝者如斯/1 | 孔子站在河边感叹时间 | By the river Confucius sighed that time flows away like water, so the word must mean time passes like the river.
稍纵即逝/1 | 机会看准要马上抓 | You must seize a chance at once when you see it, so the word must mean gone in a flash.
沧海桑田/1 | 大海变成了平原 | Thousands of years ago this plain was the sea, so the word must mean seas turned to mulberry fields.
变化无常/1 | 山上刚晴又下雨 | Sunshine on the mountain suddenly turns to rain, so the word must mean ever-changing.
时过境迁/1 | 当年烦恼现在不算什么 | The worries of those years no longer seem to matter, so the word must mean things change with time.
物是人非/1 | 老房子还在邻居都搬走 | The old house is still there but the neighbours have all moved away, so the word must mean things remain but people are gone.
斗转星移/1 | 几十年小树长成大树 | Decades have passed and the sapling has become a big tree, so the word must mean the stars shift.
匆匆/1 | 吃了几口饭赶去上班 | He took only a few bites before rushing off to work, so the word must mean hastily.
知足常乐/1 | 有吃有住家人健康就好 | Grandma says food, a home and a healthy family are enough, so the word must mean contentment brings happiness.
安贫乐道/1 | 颜回住小巷从不抱怨 | Yan Hui lived in a poor alley and never complained, so the word must mean to be content in poverty.
淡泊名利/1 | 科学家把奖金捐给学校 | The scientist gave all his prize money to a school, so the word must mean indifferent to fame and gain.
宁静致远/1 | 诸葛亮给儿子的信 | Zhuge Liang wrote to his son that only calm leads far, so the word must mean tranquillity leads far.
随遇而安/1 | 搬到哪里都能很快适应 | He settles in quickly wherever he moves, so the word must mean at ease wherever one is.
喜悦/1 | 种的花开了心里很高兴 | She sees the flowers she planted come into bloom, so the word must mean joy.
心浮气躁/1 | 做研究要沉下心 | Research needs a settled mind and slow work, so the word must mean restless and impetuous.
安逸/1 | 辞掉工作去山区教书 | He quit his job to teach in the mountains instead of living at ease, so the word must mean easy and comfortable.
迷茫/1 | 不知道该选什么专业 | At the end of high school he did not know which subject to choose, so the word must mean confused.
顺其自然/1 | 努力过了结果不重要 | We have done our best and the result no longer matters, so the word must mean to let nature take its course.
祸福相倚/1 | 坏事里藏着好事 | Laozi said good hides inside bad and bad inside good, so the word must mean good and bad fortune depend on each other.
物极必反/1 | 吃得太多反而伤身体 | Eating too much harms the body, so the word must mean things turn into their opposites at the extreme.
否极泰来/1 | 艰难后过上好日子 | After those hard years the family finally lives well, so the word must mean bad luck gives way to good.
对立统一/1 | 冷和热上和下 | Hot and cold, up and down, being and non-being are pairs like this, so the word must mean unity of opposites.
量变/1 | 水温一度一度升高 | Water warms one degree at a time before it turns to steam at a hundred, so the word must mean quantitative change.
质变/1 | 积累多了变成另一种状态 | Small daily progress adds up until something new happens, so the word must mean qualitative change.
相对/1 | 山比石头大比地球小 | A mountain is bigger than a stone but much smaller than the Earth, so the word must mean relative.
扬弃/1 | 保留好的去掉不好的 | Keep the good in tradition and drop the bad, so the word must mean to sift and keep the best.
内因/1 | 能不能进步自己是根本 | Outside conditions only help a person's progress, so the word must mean internal cause.
外因/1 | 温度只是条件 | The egg itself is what matters and warmth only helps, so the word must mean external cause.
冥想/1 | 闭上眼睛让自己平静 | Every morning he closes his eyes for ten minutes to calm down, so the word must mean to meditate.
当头棒喝/1 | 批评让他明白问题 | The teacher's criticism made him see his problem at once, so the word must mean a sharp warning.
机锋/1 | 禅师说话意思要细细体会 | Zen masters' words must be thought over carefully, so the word must mean pointed Zen remarks.
顿悟/1 | 看到落叶一下子想通 | After long puzzling, he understood all at once on seeing the falling leaves, so the word must mean sudden enlightenment.
沉思/1 | 站在窗前想了很久 | He stands at the window lost in thought for a long time, so the word must mean contemplation.
内省/1 | 吾日三省吾身 | Zengzi examined himself three times a day, so the word must mean to examine oneself.
反思/1 | 考试失败后想学习方法 | After failing the exam he looked carefully at how he studied, so the word must mean to reflect on.
静坐/1 | 每晚半小时什么也不想 | Every evening he sits still for half an hour thinking of nothing, so the word must mean to sit in meditation.
公案/1 | 禅宗看起来不合常理的问题 | In Zen these are often questions that seem to make no sense, so the word must mean koan.
渐悟/1 | 一步一步修行 | In Zen it is set against sudden awakening and comes step by step, so the word must mean gradual enlightenment.
傻瓜/1 | 下大雨还在外面等我 | The friend affectionately scolds the person waiting outside in heavy rain, so the word must mean silly.
傻笑/1 | 收到通知书一个人坐着笑 | He sits alone grinning after getting his offer letter, so the word must mean to grin foolishly.
装傻/1 | 弟弟说自己什么也没看见 | Asked who broke the vase, the little brother claims he saw nothing, so the word must mean to play dumb.
傻乎乎/1 | 小狗追着自己尾巴转圈 | The puppy keeps chasing its own tail in circles, so the word must mean dopey.
傻眼/1 | 到机场才发现没带护照 | At the airport he found he had forgotten his passport, so the word must mean to be dumbfounded.
犯傻/1 | 重要考试一点不复习 | Doing no revision at all for such an important exam makes no sense, so the word must mean to act stupidly.
愚蠢/1 | 相信骗人的广告 | Believing that kind of fraudulent advert is a poor choice, so the word must mean foolish.
蠢事/1 | 后悔年轻时做的 | He often regrets things he did when young, so the word must mean foolish deeds.
自作聪明/1 | 没看说明书就安装装错了 | He skipped the instructions, thinking he knew better, and installed it wrong, so the word must mean to think oneself clever.
耍小聪明/1 | 考试把答案写在手上 | Writing answers on your hand in an exam is dishonest, so the word must mean to use petty cleverness.
急躁/1 | 做实验要一步一步来 | An experiment must be done one step at a time, so the word must mean rash.
暴躁/1 | 一点小事就大喊大叫 | He shouts at the slightest thing, so the word must mean irascible.
浮躁/1 | 做学问要沉得住气 | Scholarship needs patience, so the word must mean impetuous.
毛躁/1 | 作业里常有写错的字 | His homework is often full of miswritten characters, so the word must mean slapdash.
戒骄戒躁/1 | 赢了以后继续努力 | After the win the coach reminds the players to keep working hard, so the word must mean to guard against pride and rashness.
好脾气/1 | 从来不对学生发火 | Mr Wang never loses his temper with pupils, so the word must mean good temper.
耍脾气/1 | 没买到玩具在门口不走 | The little sister will not leave the shop because she did not get a toy, so the word must mean to throw a tantrum.
倔脾气/1 | 决定的事谁也劝不动 | Nobody can talk Grandpa out of anything he has decided, so the word must mean obstinate temper.
急性子/1 | 等车五分钟就不耐烦 | He grows restless after only five minutes at the bus stop, so the word must mean impatient person.
慢性子/1 | 吃一顿饭要一小时 | She takes an hour over one meal, so the word must mean slowcoach.
沉闷/1 | 开会三小时大家不说话 | Nobody spoke in the three-hour meeting, so the word must mean oppressive.
纳闷/1 | 昨天还好今天怎么没来 | He was fine yesterday and the speaker wonders why he missed class today, so the word must mean to wonder.
解闷/1 | 奶奶一个人养只小猫 | Grandma lives alone and keeps a kitten for company, so the word must mean to relieve boredom.
闷闷不乐/1 | 好朋友搬走以后 | He has been unhappy all day since his good friend moved away, so the word must mean depressed.
生闷气/1 | 不满就说出来 | If something bothers you, say it instead of keeping it in, so the word must mean to sulk.
闷声不响/1 | 吃完饭就回房间 | He finished eating without a word and went to his room, so the word must mean without a word.
烦躁/1 | 天气又热又吵 | The weather is hot and noisy, so the word must mean fidgety.
惦记/1 | 妈妈天天想着外地的他 | Her son studies far away and Mother thinks of him every day, so the word must mean to keep thinking about.
懊悔/1 | 当初没听老师的话 | Ignoring the teacher made him miss the registration deadline, so the word must mean to regret.
懊恼/1 | 下大雨偏偏没带雨衣 | It poured just as he went out and he had no raincoat, so the word must mean annoyed.
倔强/1 | 摔倒好几次又站起来 | She fell several times and still got up and ran on, so the word must mean unbending.
认死理/1 | 规定上没写的一件不做 | He refuses to do anything the rules do not mention, so the word must mean inflexible.
死心眼/1 | 这条路不通就换一条 | If this road is blocked, take another, so the word must mean single-minded.
一根筋/1 | 一旦开始非做完不可 | Once he starts something he must finish it and forgets even to eat, so the word must mean dogged.
咬定/1 | 一口说那天在家 | He firmly insists he was at home that day, so the word must mean to assert firmly.
咬紧牙关/1 | 最后一公里跑到终点 | In the last kilometre she held on and reached the finish, so the word must mean to grit one's teeth.
发狠/1 | 要一年内学会游泳 | He resolved to learn to swim within a year and practises daily, so the word must mean to make a determined effort.
狠心/1 | 让孩子一个人去外地上学 | The parents let their child go away to school alone to make him independent, so the word must mean to harden one's heart.
逞强/1 | 发烧还要去上课 | You have a fever and should rest instead of going to class, so the word must mean to try to prove oneself.
较劲/1 | 暗中比谁成绩更好 | The two quietly compete to see whose marks are better, so the word must mean to vie with.
瞪眼/1 | 他刚想插话妈妈就 | His mother glares as he is about to interrupt and he stays quiet, so the word must mean to glare.
干瞪眼/1 | 火车开走了晚到的他 | The train has left and he can only stand on the platform, so the word must mean to look on helplessly.
目瞪口呆/1 | 帽子里拿出小鸟 | The magician pulls a bird from an empty hat, so the word must mean stunned.
瞅见/1 | 在超市门口看到你哥哥 | The speaker just noticed your brother at the supermarket entrance, so the word must mean to catch sight of.
瞅准/1 | 守门员一把抓住球 | The goalkeeper catches the ball at exactly the right moment, so the word must mean to watch for exactly.
瞧见/1 | 我的眼镜找了半天 | The speaker has been searching for the glasses for ages, so the word must mean to see.
瞧不起/1 | 做小生意的也很辛苦 | Small traders work hard too, so the word must mean to look down on.
走着瞧/1 | 你说我学不会 | The speaker is told they cannot learn it and answers that time will tell, so the word must mean we shall see.
眨眼/1 | 灯光太亮不停地 | The lights are too bright, so the word must mean to blink.
一眨眼/1 | 时间过得快就到年底 | Time flies and it is already the end of the year, so the word must mean in the twinkling of an eye.
睁眼/1 | 早上一醒发现下雪 | First thing on waking he saw it was snowing, so the word must mean to open one's eyes.
眼睁睁/1 | 看着风把气球吹走 | He can only watch helplessly as the wind carries the balloon away, so the word must mean looking on helplessly.
睁一只眼闭一只眼/1 | 管理员不能装作没看见 | The caretaker must not ignore rule-breaking, so the word must mean to turn a blind eye.
皱眉/1 | 看到成绩单说又退步了 | Seeing his son's report card, Dad asks why he has slipped again, so the word must mean to frown.
皱纹/1 | 爷爷额头上有很多 | Grandpa's forehead is lined, so the word must mean wrinkle.
不屑/1 | 听了他的话露出表情 | Her expression shows what she thinks of his words, so the word must mean disdainful.
发愣/1 | 看着窗外老师叫他没听见 | Staring out of the window, he did not even hear the teacher call him, so the word must mean to be in a daze.
愣住/1 | 听到意外消息 | Everyone is stunned by the unexpected news, so the word must mean to be stunned.
愣神/1 | 一走神杯子掉了 | The cup slipped from his hand in a moment of distraction, so the word must mean to space out.
耸肩/1 | 问他安排他什么也没说 | Asked about tomorrow, he says nothing, so the word must mean to shrug.
惊吓/1 | 小猫躲在床底下不出来 | The kitten hides under the bed and will not come out, so the word must mean scare.
吓人/1 | 电影看一半就不敢看 | The film was too frightening to watch to the end, so the word must mean frightening.
恐吓/1 | 逼人交出钱财 | Forcing people to hand over money by threats is illegal, so the word must mean to threaten.
吓一跳/1 | 他从门后跳出来 | He jumped out from behind the door, so the word must mean to give a start.
躲藏/1 | 小猫在草地里一动不动 | The kitten keeps perfectly still in the grass, so the word must mean to hide.
躲避/1 | 地震时找安全的地方 | In an earthquake you must quickly find a safe place, so the word must mean to shelter from.
躲闪/1 | 球飞来来不及让开 | He had no time to dodge and the ball hit his shoulder, so the word must mean to dodge.
东躲西藏/1 | 做了坏事的人不安心 | Wrongdoers never live in peace, so the word must mean to hide here and there.
悄悄/1 | 妹妹睡着我们走出房间 | The little sister is asleep and they leave the room, so the word must mean quietly.
悄无声息/1 | 夜里大雪盖住城市 | Heavy snow covered the whole city during the night, so the word must mean silently.
瞎说/1 | 没调查清楚就别说 | Do not talk before you have checked the facts, so the word must mean to talk rubbish.
瞎猜/1 | 这道题要认真计算 | The problem needs careful calculation, so the word must mean to guess wildly.
瞎忙/1 | 没计划整天忙不出结果 | Without a plan you are busy all day and achieve nothing, so the word must mean to bustle aimlessly.
瞎编/1 | 故事根本没发生过 | The story never happened, so the word must mean to make up.
瞎操心/1 | 孩子长大了你别 | The child is grown up now, so the word must mean to worry for nothing.
糊涂/1 | 年纪大了忘了眼镜放哪儿 | Being old, he sometimes forgets where his glasses are, so the word must mean confused.
稀里糊涂/1 | 签了合同后来发现上当 | He signed the contract without understanding it and was cheated, so the word must mean muddle-headedly.
丢三落四/1 | 又把作业本忘在家里 | He left his exercise book at home again today, so the word must mean scatterbrained.
迷糊/1 | 刚睡醒把牙膏当洗面奶 | Just awake, he mistook the toothpaste for face wash, so the word must mean dazed.
马大哈/1 | 出门常忘带东西 | He often forgets things when he goes out, so the word must mean careless person.
蹲下/1 | 帮小女孩系鞋带 | He bent his knees to tie the little girl's shoelace, so the word must mean to squat down.
抬头/1 | 一看天上有道光 | He looked up at a beautiful light in the sky, so the word must mean to raise one's head.
敏捷/1 | 小猴子一下爬到树顶 | The little monkey reaches the top of the tree in a moment, so the word must mean agile.
扔掉/1 | 过期食物不能再吃 | Out-of-date food must not be eaten, so the word must mean to throw away.
扑通/1 | 他一声跳进河里 | It is the sound of him jumping into the river, so the word must mean splash.
踩踏/1 | 请不要踩草地 | The sign asks people to keep off the grass, so the word must mean to trample.
挺胸/1 | 站队时抬头不弯腰 | When lining up, do not stoop, so the word must mean to throw out one's chest.
撞击/1 | 海浪不停打着石头 | The waves keep pounding the rocks on the shore, so the word must mean to strike.
掏出/1 | 从口袋拿出纸条 | He took a note from his pocket and handed it over, so the word must mean to take out.
撒腿/1 | 铃声一响孩子们往外跑 | When the bell rings, the children dash outside, so the word must mean to take to one's heels.
碰见/1 | 在书店遇到小学老师 | The speaker ran into a primary school teacher at the bookshop, so the word must mean to run into.
碰巧/1 | 想找他他正好来了 | The speaker wanted to find him and he happened to turn up, so the word must mean as it happens.
碰面/1 | 约好三点在公园门口 | They agreed to meet at the park gate at three, so the word must mean to meet up.
碰运气/1 | 没准备就去考试 | He sat the exam without preparing at all, so the word must mean to try one's luck.
碰壁/1 | 找工作处处不顺 | His job search failed everywhere and he decided to learn a trade, so the word must mean to hit a wall.
碰钉子/1 | 经理一句话就拒绝 | The manager turned his request down in one sentence, so the word must mean to be rebuffed.
撞见/1 | 偷吃零食被老师看到 | The teacher caught him eating snacks in the classroom, so the word must mean to catch in the act.
趁机/1 | 下课了向老师请教 | When class ended he took the chance to ask the teacher a question, so the word must mean to seize the opportunity.
趁早/1 | 计划不行早点改 | The plan does not work and should be changed before it is too late, so the word must mean as soon as possible.
趁热打铁/1 | 学过的当天就复习 | What you learn should be revised the same day, so the word must mean to strike while the iron is hot.
玩耍/1 | 孩子们在草地上 | The children play happily on the grass, so the word must mean to play.
捉迷藏/1 | 小时候在院子里玩 | As children they played hide-and-seek in the yard, so the word must mean hide-and-seek.
扑克/1 | 下雨天一家人打 | On a rainy day the family sits together playing cards, so the word must mean playing cards.
疯玩/1 | 放假在外面一整天 | After a whole day playing outside the children fall straight asleep, so the word must mean to play like mad.
耍花招/1 | 想骗大家被识破 | His trick to fool everyone was quickly seen through, so the word must mean to play tricks.
耍赖/1 | 输的人请客不能不认 | It was agreed the loser would pay for the meal, so the word must mean to welsh.
捉弄/1 | 把同学书包藏起来 | He hides classmates' schoolbags for fun, so the word must mean to tease.
卖弄/1 | 在别人面前显示知识 | He always shows off his knowledge in front of others, so the word must mean to show off.
摆弄/1 | 一有空就修旧收音机 | Whenever he is free he tinkers with the old radio to fix it, so the word must mean to tinker with.
撒欢/1 | 小狗到草地上跑起来 | The puppy runs about happily on the grass, so the word must mean to frisk about.
惹事/1 | 在外面从不闯祸 | Everyone says he is a good boy who never causes trouble outside, so the word must mean to stir up trouble.
招惹/1 | 这条狗很凶别去 | The dog is fierce, so the word must mean to provoke.
惹祸/1 | 玩火容易引起火灾 | Playing with fire can easily start a blaze, so the word must mean to court disaster.
惹是生非/1 | 小时候常闯祸 | He caused trouble as a child and grew more sensible later, so the word must mean to stir up trouble.
惹不起/1 | 他脾气大谁也 | He has such a temper that nobody dares cross him, so the word must mean cannot afford to offend.
冲撞/1 | 说话太直得罪客人 | He speaks too bluntly and offended a guest, so the word must mean to offend.
抬杠/1 | 你说东他偏说西 | Whatever you say, he says the opposite, so the word must mean to bicker.
撕破脸/1 | 两家公司打起官司 | The two firms fell out over a contract and went to court, so the word must mean to openly fall out.
耍嘴皮子/1 | 光说没用要行动 | Talk is useless without real action, so the word must mean to show off with words.
撒气/1 | 考得不好别拿弟弟 | You did badly in the exam and should not take it out on your brother, so the word must mean to vent one's anger.
爽快/1 | 请他帮忙很快答应 | He agreed to help at once, so the word must mean straightforwardly.
豪爽/1 | 常请朋友吃饭 | He often treats his friends to meals, so the word must mean open-handed.
直爽/1 | 有意见当面说 | She says any objection to your face, so the word must mean forthright.
爽朗/1 | 院子里传来爷爷的笑声 | Grandpa's hearty laugh comes from the yard, so the word must mean hearty.
乖巧/1 | 小女孩见客人先问好 | The little girl always greets guests first, so the word must mean well-behaved.
心直口快/1 | 说话伤人其实没坏心 | Her words sometimes hurt though she means no harm, so the word must mean frank and outspoken.
直肠子/1 | 心里想什么说什么 | He says whatever he thinks, so the word must mean straight shooter.
刀子嘴豆腐心/1 | 奶奶嘴上骂心里疼我 | Grandma scolds the speaker but loves them most, so the word must mean harsh words but a kind heart.
老好人/1 | 谁也不得罪 | He never offends anyone or speaks ill of others, so the word must mean someone who offends no one.
自来熟/1 | 第一天就和大家打成一片 | On his first day in the new class he was already friends with everyone, so the word must mean someone who warms up fast.
小心眼/1 | 人家只是开玩笑 | It was only a joke, so the word must mean narrow-minded.
好面子/1 | 不懂也不愿问 | He does not understand but will not ask, so the word must mean concerned with face.
胆怯/1 | 第一次上台声音很小 | Giving his first speech on stage, he spoke very softly, so the word must mean nervous.
墙头草/1 | 谁力量大就听谁 | He follows whoever is strongest, so the word must mean turncoat.
逞能/1 | 一个人搬两张桌子扭伤腰 | Showing off, he carried two desks alone and hurt his back, so the word must mean to show off one's ability.
傲慢/1 | 同事都不喜欢他的态度 | His colleagues dislike his attitude, so the word must mean haughty.
任性/1 | 想要什么就给什么 | Giving children everything they want spoils their character, so the word must mean wilful.
撒娇/1 | 抱着爸爸手臂要玩具 | The little daughter hugs her father's arm wanting a new toy, so the word must mean to act cute.
嘴馋/1 | 口袋里总装着零食 | He always has snacks in his pocket, so the word must mean fond of eating.
眼馋/1 | 看着同学的新球鞋 | He looks longingly at a classmate's new trainers, so the word must mean to covet.
起劲/1 | 正玩得谁也不想回家 | The children are playing and nobody wants to go home, so the word must mean with gusto.
带劲/1 | 球赛观众一直欢呼 | The crowd kept cheering throughout the match, so the word must mean thrilling.
干劲/1 | 新员工每天很早到 | The new employee arrives early every day, so the word must mean enthusiasm for work.
使劲/1 | 瓶盖太紧拧好几下 | The lid was tight and took several hard twists to open, so the word must mean with effort.
劲头/1 | 看他学习的那股 | The way he studies, he is sure to do well, so the word must mean vigour.
费劲/1 | 箱子太重搬起来 | The box is too heavy, so the word must mean strenuous.
差劲/1 | 等一小时才上菜 | The food took an hour to arrive, so the word must mean lousy.
没劲/1 | 电影看一半睡着了 | He fell asleep halfway through the film, so the word must mean dull.
挺身而出/1 | 有人落水跳下去救 | Seeing someone fall into the water, he jumped in and saved them, so the word must mean to step forward bravely.
加把劲/1 | 只有最后一题了 | There is only one question left, so the word must mean to make an extra effort.
混日子/1 | 年轻人要有理想 | Young people should have ideals, so the word must mean to idle away one's days.
蒙混过关/1 | 抄作业想过去被发现 | He copied someone's homework and the teacher found out, so the word must mean to muddle through.
混为一谈/1 | 学习好和品德好是两回事 | Good marks and good character are two different things, so the word must mean to confuse one with another.
鱼目混珠/1 | 用假货冒充名牌 | Some sellers pass off fakes as brand-name goods, so the word must mean to pass off the fake as genuine.
弄错/1 | 对不起把名字搞错 | The speaker apologises over your name, so the word must mean to get wrong.
弄清/1 | 先找到原因再解决 | When a problem comes up, find the cause before solving it, so the word must mean to make clear.
弄虚作假/1 | 科学数据必须真实 | Research data must be genuine, so the word must mean to practise fraud.
糊弄/1 | 报告随便写来应付我 | The speaker suspects the report was written carelessly to fob them off, so the word must mean to fool.
混乱/1 | 停电后地铁站 | After the power cut the metro station was in disorder, so the word must mean confusion.
弄坏/1 | 借来的相机别 | The camera is borrowed, so the word must mean to break.
亿万/1 | 全世界观众 | The match was broadcast to viewers all over the world, so the word must mean hundreds of millions.
数以亿计/1 | 银河系里的恒星 | The Sun is just one ordinary star among the Milky Way's countless stars, so the word must mean in the hundreds of millions.
亿万年/1 | 地球经过很长时间变化 | Earth took an immense span of time to reach its present form, so the word must mean hundreds of millions of years.
十亿/1 | 中国人口超过 | China's population is over a thousand million, so the word must mean billion.
渺小/1 | 和宇宙相比人类 | Mankind is compared with the vast universe, so the word must mean insignificant.
浩渺/1 | 望着大海心情开阔 | Looking out at the sea from the shore made him feel open-hearted, so the word must mean boundless.
茫茫/1 | 宇宙中地球是小蓝点 | Earth is just a little blue dot in the universe, so the word must mean vast and hazy.
天文单位/1 | 大约一亿五千万公里 | It is about a hundred and fifty million kilometres, so the word must mean astronomical unit.
光速/1 | 每秒三十万公里 | Sunlight takes just over eight minutes to reach Earth at three hundred thousand kilometres a second, so the word must mean speed of light.
宇宙膨胀/1 | 远处星系都在离去 | Distant galaxies are all moving away from us, so the word must mean expansion of the universe.
陨石/1 | 从天上掉下来四十多亿年 | The museum shows a stone that fell from the sky over four billion years old, so the word must mean meteorite.
陨落/1 | 伟大科学家去世一颗巨星 | People speak of a great star falling when a great scientist dies, so the word must mean to fall.
陨石坑/1 | 五万年前太空石头撞出来的 | A space rock struck Arizona fifty thousand years ago, so the word must mean impact crater.
坠落/1 | 大石头从山上掉下来 | A big rock fell from the mountain and smashed the roadside barrier, so the word must mean to fall.
滑翔/1 | 老鹰在高空慢慢飞 | The eagle soars slowly high up looking for prey, so the word must mean to glide.
下坠/1 | 气球漏气向地面 | The balloon leaks and slowly sinks to the ground, so the word must mean to drop.
流星雨/1 | 每年八月英仙座 | Every August the Perseids can be seen from the northern hemisphere, so the word must mean meteor shower.
飘落/1 | 雪花落在头发上 | Snowflakes land gently on her hair, so the word must mean to float down.
掠过/1 | 鸟从水面轻轻飞过 | A bird skims lightly over the water, so the word must mean to sweep past.
太空垃圾/1 | 报废卫星和火箭残片 | Dead satellites and rocket fragments threaten working satellites, so the word must mean space junk.
木星/1 | 太阳系最大的行星 | It is the biggest planet, larger than the other seven put together, so the word must mean Jupiter.
土星/1 | 周围有一圈美丽光环 | A small telescope shows the beautiful rings around it, so the word must mean Saturn.
金星/1 | 除月亮外夜空最亮 | After the Moon it is the brightest object in the night sky, so the word must mean Venus.
水星/1 | 离太阳最近八十八天一圈 | It is closest to the Sun and goes round it in eighty-eight days, so the word must mean Mercury.
天王星/1 | 几乎躺着绕太阳转 | Its axis is tilted until it almost lies on its side, so the word must mean Uranus.
海王星/1 | 先用数学预言后才找到 | Mathematics predicted it before it was found, so the word must mean Neptune.
冥王星/1 | 二零零六年后叫矮行星 | Since 2006 it has been counted as a dwarf planet, so the word must mean Pluto.
土星环/1 | 主要由冰块和石块组成 | They are made of chunks of ice and rock around Saturn, so the word must mean rings of Saturn.
行星环/1 | 木星天王星海王星也有很暗 | Jupiter, Uranus and Neptune have faint ones too, so the word must mean planetary ring.
小行星带/1 | 火星和木星之间 | Countless bodies of all sizes lie between Mars and Jupiter, so the word must mean asteroid belt.
椭圆/1 | 行星轨道不是正圆 | Planetary orbits are not perfect circles, so the word must mean ellipse.
自转/1 | 一周二十四小时有昼夜 | Earth turns once about every twenty-four hours, making day and night, so the word must mean rotation.
公转/1 | 绕太阳一周是一年 | Earth goes once round the Sun in a year, so the word must mean orbit.
公转轨道/1 | 八大行星差不多在同一平面 | The eight planets' paths round the Sun lie almost in one plane, so the word must mean orbital path.
近地点/1 | 满月看起来特别大 | A full Moon at this point looks especially big, so the word must mean perigee.
远地点/1 | 离地球大约四十万公里 | At this point the Moon is about four hundred thousand kilometres away, so the word must mean apogee.
地轴/1 | 倾斜才有四季 | Its tilt gives Earth the four seasons, so the word must mean earth's axis.
万有引力/1 | 牛顿解释行星绕太阳运动 | Newton's law explained why planets go round the Sun, so the word must mean universal gravitation.
引力波/1 | 二零一五年第一次探测到 | Scientists first detected them directly in 2015, so the word must mean gravitational wave.
引潮力/1 | 海水每天涨落两次 | The Moon's pull makes the sea rise and fall twice a day, so the word must mean tide-generating force.
白矮星/1 | 体积像地球质量像太阳 | It is about Earth's size but can be nearly as heavy as the Sun, so the word must mean white dwarf.
红巨星/1 | 五十亿年后太阳会膨胀成 | In about five billion years the Sun will swell into one, so the word must mean red giant.
中子星/1 | 方糖大小上亿吨 | A sugar-cube-sized piece of it weighs over a hundred million tonnes, so the word must mean neutron star.
超新星/1 | 宋代记录白天都能看见 | Song astronomers recorded a star exploding that was visible by day, so the word must mean supernova.
双星/1 | 看起来一颗其实一对 | Some stars that look like one are really a pair, so the word must mean double star.
星团/1 | 模糊的光由很多恒星组成 | Through a telescope the fuzzy light turns out to be many stars together, so the word must mean star cluster.
星云/1 | 气体和尘埃聚集形成恒星 | New stars form from gas and dust gathering inside it, so the word must mean nebula.
恒星系/1 | 以太阳为中心 | The solar system has the Sun at its centre, so the word must mean stellar system.
星等/1 | 数字越小星星越亮 | The smaller the number, the brighter the star, so the word must mean stellar magnitude.
亮度/1 | 台灯看书时调亮 | The lamp can be turned up for reading, so the word must mean brightness.
夜空/1 | 星星一闪一闪 | Stars twinkle on a clear night, so the word must mean night sky.
星光/1 | 借着微弱的光走山路 | They walked the mountain path slowly by faint starlight, so the word must mean starlight.
闪烁/1 | 远处灯光在雨中 | Distant lights flicker in the rain, so the word must mean to flicker.
北极星/1 | 迷路时靠它找北方 | Lost in the wild, you can find north by it, so the word must mean Polaris.
北斗七星/1 | 北方天空七颗很亮的星 | Seven bright stars in the northern sky point the way to the Pole Star, so the word must mean Big Dipper.
星座/1 | 星空分成八十八个 | Astronomers divide the sky into eighty-eight of them, so the word must mean constellation.
银河系/1 | 一千多亿颗恒星 | The Sun is one of more than a hundred billion stars in it, so the word must mean Milky Way.
天河/1 | 乡下夏夜白色一条横在天上 | On summer nights in the countryside a white band crosses the sky, so the word must mean the heavenly river.
星图/1 | 拿着它找星座 | He uses a chart to find the constellations, so the word must mean star map.
星辰/1 | 古人仰望想象传说 | Looking up at the starry sky, the ancients imagined many legends, so the word must mean the stars.
太阳黑子/1 | 多的年份太阳活动强 | In years with many of these the Sun is more active, so the word must mean sunspot.
太阳风/1 | 粒子进入大气层发出极光 | Auroras glow when particles it carries enter Earth's atmosphere, so the word must mean solar wind.
日全食/1 | 白天突然像夜晚一样黑 | Daytime suddenly turns as dark as night, so the word must mean total solar eclipse.
日环食/1 | 太阳像金色圆环 | The Sun looks like a golden ring in the sky, so the word must mean annular eclipse.
月食/1 | 地球影子落在月亮上 | The Earth's shadow falls on the Moon, so the word must mean lunar eclipse.
满月/1 | 中秋节晚上一轮 | It hangs in the sky on the night of the Mid-Autumn Festival, so the word must mean full moon.
新月/1 | 初一前后几乎看不到 | Around the first of each lunar month the Moon can hardly be seen, so the word must mean new moon.
月相/1 | 月亮圆缺变化 | The Moon waxes and wanes in turn, so the word must mean lunar phase.
天狗吃月亮/1 | 古人不明白月食原因 | The ancients did not understand what caused lunar eclipses, so the word must mean the dog eating the moon.
环形山/1 | 月亮表面圆形的坑 | A telescope shows many round features on the Moon's surface, so the word must mean lunar crater.
昼夜/1 | 工人们白天晚上不停 | The workers kept going round the clock and finished the bridge on time, so the word must mean day and night.
极昼/1 | 北极夏天太阳整天不落 | In the Arctic summer the Sun does not set all day, so the word must mean polar day.
旭日东升/1 | 海面上一片金光 | The sea shines gold as the Sun comes up, so the word must mean the sun rising in the east.
昼夜温差/1 | 沙漠白天热晚上冷 | The desert is hot by day and cold at night, so the word must mean diurnal temperature range.
凌晨/1 | 四点起床送牛奶 | He gets up at four to deliver milk, so the word must mean small hours.
黎明/1 | 东方天空渐渐发白 | The eastern sky gradually grows pale, so the word must mean dawn.
曙光/1 | 治这种病终于有了希望 | After years of research there is hope of treating the disease, so the word must mean first light.
黄昏/1 | 鸟儿飞回树林 | The birds fly back to the woods, so the word must mean dusk.
昏暗/1 | 光线看不清书上的字 | The light in the room is too dim to read by, so the word must mean gloomy.
黯淡/1 | 天亮后星光 | After dawn the stars fade, so the word must mean dim.
光芒/1 | 太阳照亮整个山谷 | The Sun lights up the whole valley, so the word must mean radiance.
光芒万丈/1 | 太阳从海面升起 | The Sun rises from the sea in full glory, so the word must mean radiant in all directions.
彩虹/1 | 雨停了天边一道 | It appears at the edge of the sky after the rain stops, so the word must mean rainbow.
蔚蓝/1 | 从太空看地球的颜色 | Seen from space, Earth has the colour of sea and sky, so the word must mean sky blue.
忽明忽暗/1 | 星星好像在眨眼 | The star seems to be winking at us, so the word must mean now bright now dim.
洒落/1 | 阳光透过树叶照在小路 | Sunlight comes through the leaves onto the woodland path, so the word must mean to spill down.
光谱/1 | 分析星光知道恒星组成 | Analysing starlight this way tells scientists what a star is made of, so the word must mean spectrum.
红移/1 | 星系正在离我们而去 | The light of distant galaxies shows they are moving away, so the word must mean redshift.
宇宙射线/1 | 宇航员在太空中受照射 | Astronauts in space are exposed to more radiation from it, so the word must mean cosmic ray.
皓月当空/1 | 中秋一家人赏月 | On Mid-Autumn night the family admire the Moon in the yard, so the word must mean a bright moon in the sky.
地壳/1 | 运动引起地震火山 | Its movements cause earthquakes and volcanic eruptions, so the word must mean earth's crust.
外壳/1 | 手机金属做的 | The phone's casing is made of metal, so the word must mean outer shell.
贝壳/1 | 孩子们在海滩上找到 | Children find many pretty ones on the beach, so the word must mean seashell.
蛋壳/1 | 很薄一碰就破 | It is thin and breaks at a touch, so the word must mean eggshell.
大气层/1 | 流星摩擦燃烧发光 | Meteors glow as small bodies burn up by friction on entering it, so the word must mean atmosphere.
臭氧层/1 | 挡住大部分紫外线 | It blocks most of the Sun's ultraviolet light and protects life, so the word must mean ozone layer.
地平线/1 | 太阳从上面慢慢升起 | The Sun slowly rises above it, so the word must mean horizon.
天际/1 | 大雁飞向远方 | A flock of wild geese flies off towards it, so the word must mean the edge of the sky.
天顶/1 | 赤道中午太阳接近头顶 | Near the equator at noon the Sun is almost overhead and shadows nearly vanish, so the word must mean zenith.
白茫茫/1 | 下了一夜大雪的田野 | After a night of heavy snow the fields are white as far as the eye can see, so the word must mean a vast whiteness.
扁平/1 | 银河系像一个圆盘 | The Milky Way is shaped like a disc, so the word must mean flat.
扁圆/1 | 地球两极稍微扁一点 | Earth is slightly flattened at the poles, so the word must mean oblate.
垂直/1 | 旗杆和地面 | The flagpole and the ground meet at a right angle, so the word must mean vertical.
垂线/1 | 从直线外一点画向这条直线 | It is drawn from a point outside a line to that line, so the word must mean perpendicular line.
下垂/1 | 柳树枝条长长到水面 | Willow branches hang down to the water, so the word must mean to droop.
侧面/1 | 照片只能看到半边脸 | The photo shows only half of his face, so the word must mean side view.
横向/1 | 表格这样是日期纵向是科目 | The dates run across the table and subjects run down, so the word must mean horizontal.
纵横/1 | 街道交错像一张大网 | The city's streets crisscross like a net, so the word must mean in all directions.
横跨/1 | 大桥连接长江两岸 | The bridge spans both banks of the Yangtze, so the word must mean to span.
横穿/1 | 行人不要随意过马路 | Pedestrians should not cross the road anywhere they like, so the word must mean to cross.
观星/1 | 去郊外看城里看不到的星星 | Out of town they saw many stars that cannot be seen in the city, so the word must mean to stargaze.
天象/1 | 日食流星等 | Ancient astronomers recorded eclipses, meteors and more, so the word must mean astronomical phenomena.
天文馆/1 | 参观了解宇宙知识 | The school visited a place to learn about the universe, so the word must mean planetarium.
射电望远镜/1 | 中国天眼口径五百米 | The five-hundred-metre dish in Guizhou is called China's Sky Eye, so the word must mean radio telescope.
天文望远镜/1 | 拍到土星光环 | He photographed Saturn's rings with his own instrument, so the word must mean astronomical telescope.
瞄准/1 | 望远镜对着月亮 | He pointed the telescope at the Moon and focused it, so the word must mean to aim at.
深空探测/1 | 月球和火星都是目标 | The Moon and Mars are major targets, so the word must mean deep space exploration.
探月/1 | 绕落回三步 | China's programme has three steps: orbit, land and return, so the word must mean lunar exploration.
天文观测/1 | 高山空气稀薄干燥 | Thin, dry mountain air suits it, so the word must mean astronomical observation.
星空摄影/1 | 半夜带相机上山拍银河 | He often climbs a mountain at midnight with a camera to shoot the Milky Way, so the word must mean astrophotography.
载人航天/1 | 神舟五号送第一位航天员 | In 2003 Shenzhou 5 took China's first astronaut into space, so the word must mean human spaceflight.
飘浮/1 | 空间站里东西在空中 | Anything not fastened down drifts in the air of the space station, so the word must mean to float.
太空舱/1 | 宇航员在里面吃饭睡觉 | Astronauts eat, sleep and do experiments inside it, so the word must mean space capsule.
云霄/1 | 火箭喷火直冲 | The rocket shoots up with flames pouring out, so the word must mean the heavens.
太空行走/1 | 二零零八年第一次 | In 2008 a Chinese astronaut first went outside the craft, so the word must mean spacewalk.
微重力/1 | 水变成漂浮的水球 | Water forms floating balls on the space station, so the word must mean microgravity.
中国空间站/1 | 又叫天宫 | It is also called Tiangong and was completed in 2022, so the word must mean the Chinese space station.
对接/1 | 飞船和空间站连在一起 | The spacecraft and the station joined together in space, so the word must mean to dock.
升空/1 | 火箭点火带飞船上去 | After ignition the rocket slowly carries the spacecraft up, so the word must mean to lift off.
倒计时/1 | 数到零就点火 | Before launch the count goes down to zero and then the engines fire, so the word must mean countdown.
发射场/1 | 海南靠近赤道 | Hainan has a spaceport near the equator, so the word must mean launch site.
着陆器/1 | 第一次在月球背面降落 | In 2019 a Chinese craft landed safely on the far side of the Moon, so the word must mean lander.
火星车/1 | 祝融号在火星表面工作 | Zhurong worked on the surface of Mars for over a year, so the word must mean Mars rover.
卫星导航/1 | 开车到陌生地方不迷路 | With it you will not get lost driving somewhere new, so the word must mean satellite navigation.
北斗/1 | 中国自己的导航系统 | China built its own satellite navigation system, so the word must mean BeiDou.
同步卫星/1 | 好像一直停在同一个地方 | From the ground it seems to stay in the same spot in the sky, so the word must mean geosynchronous satellite.
气象卫星/1 | 天气预报资料来自 | Much weather forecast data comes from it, so the word must mean meteorological satellite.
通信卫星/1 | 海上轮船打电话上网 | Ships far out at sea can phone and go online through it, so the word must mean communications satellite.
卫星云图/1 | 天气预报播放云的分布 | TV forecasts show the spread of the clouds, so the word must mean satellite cloud picture.
航天器/1 | 卫星飞船空间站 | Satellites, spacecraft and space stations all belong to it, so the word must mean spacecraft.
大爆炸/1 | 一百三十八亿年前宇宙起源 | Many scientists believe the universe began about 13.8 billion years ago, so the word must mean Big Bang.
奇点/1 | 宇宙最初极小的一点 | The Big Bang theory says the universe began extremely small, so the word must mean singularity.
暗物质/1 | 不发光却有引力 | It gives off no light but has gravity, so the word must mean dark matter.
星际/1 | 未来人类也许能旅行 | Humans may one day travel between the stars, so the word must mean interstellar.
外星人/1 | 还没找到存在的证据 | Nobody has yet found evidence that they exist, so the word must mean extraterrestrial.
系外行星/1 | 已发现几千颗 | Astronomers have found thousands orbiting other stars, so the word must mean exoplanet.
宜居带/1 | 地球表面有液态水 | Earth's place around the Sun lets liquid water exist on its surface, so the word must mean habitable zone.
天圆地方/1 | 古人对天地形状的看法 | Ancient Chinese pictured the sky as round and the earth as square, so the word must mean heaven is round and earth square.
渺茫/1 | 大海里找戒指 | Finding a tiny ring in the sea is very unlikely, so the word must mean remote.
迄今为止/1 | 地球是唯一有生命的星球 | Earth is the only planet known to have life, so the word must mean up to now.
上旬/1 | 十月一日 | National Day on 1 October falls in the first ten days of the month, so the word must mean first ten days of a month.
中旬/1 | 五月十五日 | The fifteenth falls in the middle ten days of the month, so the word must mean middle ten days of a month.
下旬/1 | 一月三十一日 | The thirty-first falls in the last ten days of the month, so the word must mean last ten days of a month.
芒种/1 | 北方农民忙收麦子 | Around this solar term northern farmers harvest wheat, so the word must mean Grain in Ear solar term.
一晃/1 | 十年过去孩子长大 | Ten years passed and the children have grown up, so the word must mean in the blink of an eye.
忽然/1 | 正上课灯灭了 | The lights went out in the middle of a lesson, so the word must mean suddenly.
摇晃/1 | 船在大风中 | The ship rocks in the strong wind, so the word must mean to sway.
晃动/1 | 地震时杯子 | The cups on the table start to shake in the earthquake, so the word must mean to shake.
忽略/1 | 只顾学习不顾身体 | He studied and neglected his health, so the word must mean to overlook.
疏忽/1 | 一时不小心写错时间 | A careless moment made him write down the wrong meeting time, so the word must mean negligence.
细胞核/1 | 遗传物质储存在里面 | Genetic material is mainly stored in it, so the word must mean cell nucleus.
细胞膜/1 | 控制物质进出细胞 | It controls what goes in and out of the cell, so the word must mean cell membrane.
细胞质/1 | 线粒体等分布在其中 | Mitochondria and other parts sit in it, so the word must mean cytoplasm.
细胞壁/1 | 植物有动物没有 | Plant cells have one and animal cells do not, so the word must mean cell wall.
细胞分裂/1 | 使细胞数量增加 | Living things increase their number of cells this way, so the word must mean cell division.
单细胞/1 | 细菌要用显微镜看 | Bacteria are made of one cell and need a microscope to see, so the word must mean unicellular.
多细胞/1 | 人和大多数动植物 | People and most animals and plants are made of many cells, so the word must mean multicellular.
线粒体/1 | 细胞的动力工厂 | It is called the cell's power plant, so the word must mean mitochondrion.
叶绿体/1 | 叶子是绿色因为有很多 | Leaves are green because of many of these in their cells, so the word must mean chloroplast.
核糖体/1 | 合成蛋白质的地方 | It is tiny but is where the cell makes proteins, so the word must mean ribosome.
染色体/1 | 人体细胞二十三对 | Human body cells have twenty-three pairs, so the word must mean chromosome.
遗传物质/1 | 脱氧核糖核酸 | DNA is this in most living things, so the word must mean genetic material.
双螺旋/1 | 一九五三年发现的结构 | In 1953 scientists found the structure of DNA, so the word must mean double helix.
基因组/1 | 人类计划二零零三年完成 | The human project was largely finished in 2003, so the word must mean genome.
遗传病/1 | 色盲是常见的 | Colour blindness is a common one, so the word must mean genetic disease.
显性/1 | 有一个基因就会表现 | A single gene of this kind is enough for the trait to show, so the word must mean dominant.
隐性/1 | 成对出现才会表现 | These genes show only when they come in pairs, so the word must mean recessive.
变异/1 | 同父母的孩子不完全一样 | Children of the same parents do not look exactly alike, so the word must mean variation.
遗传学/1 | 研究基因代代相传 | He studied how genes are passed down the generations, so the word must mean genetics.
克隆/1 | 一九九六年第一只羊 | In 1996 the first sheep copied from an adult body cell was born, so the word must mean to clone.
氨基酸/1 | 组成蛋白质 | Proteins are built from many kinds of them, so the word must mean amino acid.
胆固醇/1 | 吃太多油炸食品会升高 | Eating too much fried food may raise it in the blood, so the word must mean cholesterol.
葡萄糖/1 | 饿得发晕补充一点 | A little of it quickly restores strength when you feel faint with hunger, so the word must mean glucose.
脂肪酸/1 | 脂肪分解成甘油和 | Fat is broken down into glycerol and these, so the word must mean fatty acid.
碳水化合物/1 | 米饭面条的主要成分 | It is the main part of rice and noodles, so the word must mean carbohydrate.
氯化钠/1 | 海水是咸的 | Seawater is salty from large amounts of it dissolved, so the word must mean sodium chloride.
微量元素/1 | 铁和碘 | Iron and iodine are ones the body needs, so the word must mean trace element.
矿物质/1 | 牛奶中的钙 | Milk contains calcium and others, so the word must mean mineral.
激素/1 | 青春期个子长得快 | At puberty the body releases more of them and children shoot up, so the word must mean hormone.
新陈代谢/1 | 经常运动可以促进 | Regular exercise speeds it up, so the word must mean metabolism.
消化系统/1 | 胃和肠 | The stomach and intestines belong to it, so the word must mean digestive system.
循环系统/1 | 心脏和血管 | The heart and blood vessels make it up, so the word must mean circulatory system.
神经系统/1 | 大脑和脊髓是中心 | The brain and spinal cord are its centre, so the word must mean nervous system.
呼吸系统/1 | 肺是最重要的器官 | The lungs are its most important organ, so the word must mean respiratory system.
血液循环/1 | 冬天手脚冰冷 | Hands and feet that are always cold in winter may point to a problem with it, so the word must mean blood circulation.
红细胞/1 | 把氧气运到身体各处 | They carry oxygen all over the body, so the word must mean red blood cell.
白细胞/1 | 发炎时血液里增多 | They increase in the blood during inflammation, so the word must mean white blood cell.
血小板/1 | 手指划破帮助止血 | They help stop the bleeding from a cut finger, so the word must mean platelet.
干细胞/1 | 可以变成多种细胞 | They can turn into many different kinds of cell, so the word must mean stem cell.
骨髓/1 | 血细胞在这里产生 | Blood cells are mainly produced in it, so the word must mean bone marrow.
神经元/1 | 大脑里八百六十亿个 | The brain has about eighty-six billion of them, so the word must mean neuron.
小脑/1 | 受伤走路难平衡 | People with damage to it find it hard to keep their balance, so the word must mean cerebellum.
脑干/1 | 控制呼吸心跳 | It controls breathing and heartbeat, so the word must mean brainstem.
脊髓/1 | 在脊柱里连接大脑和身体 | It runs inside the spine and links the brain to the body, so the word must mean spinal cord.
条件反射/1 | 一听到铃声流口水 | The dog drools at the sound of a bell that always came before food, so the word must mean conditioned reflex.
鼓膜/1 | 振动后听到声音 | Sound entering the ear canal makes it vibrate, so the word must mean eardrum.
角膜/1 | 光线先通过透明的 | Light first passes through this clear layer of the eye, so the word must mean cornea.
视网膜/1 | 物体在上面形成图像 | Images of objects form on it and we see, so the word must mean retina.
本能/1 | 小鸭不用学就会游泳 | Ducklings swim without being taught, so the word must mean instinct.
生理/1 | 青春期身体变化 | At puberty teenagers' bodies change greatly, so the word must mean physiology.
孵化/1 | 小鸡在机器里出来 | The chicks came out of eggs in a machine, so the word must mean to hatch.
孵蛋/1 | 母鸡二十一天后有小鸡 | The chicks will come out in twenty-one days, so the word must mean to brood.
卵生/1 | 鸟类和爬行动物 | Birds and most reptiles lay eggs, so the word must mean oviparous.
胎生/1 | 鲸是这样的哺乳动物 | Whales live in the sea but give birth to live young, so the word must mean viviparous.
受精/1 | 卵子发育成新个体 | The egg then starts to develop into a new individual, so the word must mean to be fertilised.
雌性/1 | 产卵的蜂王 | The queen bee lays the eggs, so the word must mean female.
雄性/1 | 头上有长毛的狮子 | The lion with a mane is meant, so the word must mean male.
雌雄/1 | 鸟类羽毛颜色不同 | In many birds the males have brighter feathers, so the word must mean the sexes.
试管婴儿/1 | 一九七八年在英国出生 | In 1978 the first such baby was born in Britain, so the word must mean IVF baby.
生命周期/1 | 蝴蝶的卵幼虫等阶段 | A butterfly goes through four stages starting with the egg, so the word must mean life cycle.
进化论/1 | 达尔文提出 | Darwin proposed that living things changed gradually, so the word must mean theory of evolution.
自然选择/1 | 生物越来越适应环境 | Over long periods living things become better suited to their surroundings, so the word must mean natural selection.
适者生存/1 | 不适应的被淘汰 | Creatures that cannot adapt are weeded out in nature, so the word must mean survival of the fittest.
物竞天择/1 | 严复翻译进化论 | Yan Fu used the phrase when translating Darwin, so the word must mean species compete and nature selects.
拟态/1 | 昆虫长得像树枝 | Some insects look like twigs to avoid their enemies, so the word must mean mimicry.
保护色/1 | 青蛙的绿色 | The frog's green makes it hard to spot in the grass, so the word must mean protective colouration.
伪装/1 | 变色龙改变皮肤颜色 | The chameleon changes the colour of its skin to hide, so the word must mean to disguise.
天敌/1 | 猫头鹰对老鼠 | Owls hunt mice, so the word must mean natural predator.
共同祖先/1 | 人和黑猩猩 | Research shows humans and chimpanzees descend from the same ancestor, so the word must mean common ancestor.
变态发育/1 | 毛毛虫变蝴蝶 | A caterpillar becomes a butterfly, so the word must mean metamorphosis.
哺乳动物/1 | 鲸生活在海里 | Whales live in the sea and feed their young on milk, so the word must mean mammal.
脊椎动物/1 | 鱼鸟和人 | Fish, birds and humans all have backbones, so the word must mean vertebrate.
无脊椎动物/1 | 昆虫和蚯蚓 | Insects and earthworms have no backbones, so the word must mean invertebrate.
节肢动物/1 | 虾和蜘蛛 | Shrimps and spiders belong to this group, so the word must mean arthropod.
软体动物/1 | 章鱼和贝类 | Octopuses and shellfish belong to this group, so the word must mean mollusc.
鸟类/1 | 骨头空心身体轻 | Many of them have hollow bones and light bodies, so the word must mean birds.
杂食动物/1 | 熊吃果子又吃鱼 | Bears eat both fruit and fish, so the word must mean omnivore.
恒温动物/1 | 体温基本不变 | Birds and mammals keep their body temperature steady, so the word must mean warm-blooded animal.
变温动物/1 | 蛇天冷要冬眠 | Snakes hibernate when it is cold, so the word must mean cold-blooded animal.
水生动物/1 | 鱼虾水母 | Fish, shrimps and jellyfish all live in water, so the word must mean aquatic animal.
家禽/1 | 鸡鸭鹅 | Chickens, ducks and geese are common on farms, so the word must mean poultry.
猛禽/1 | 老鹰从高空抓猎物 | The eagle swoops down from high up to catch prey, so the word must mean raptor.
飞禽走兽/1 | 森林里各种各样 | All kinds of birds and beasts live in the forest, so the word must mean wildlife.
鸽子/1 | 广场上游客喂食 | Tourists often feed the birds on the square, so the word must mean pigeon.
信鸽/1 | 古人用来传递消息 | In old times people sent messages by birds that could find their way home, so the word must mean homing pigeon.
和平鸽/1 | 白色的象征和平 | The white bird is a symbol of peace, so the word must mean peace dove.
天鹅/1 | 冬天从北方飞到湖上 | In winter flocks of large white birds fly south to the lake, so the word must mean swan.
鹅毛/1 | 千里送礼轻情意重 | The saying is about a light gift sent from far away with deep feeling, so the word must mean goose feather.
翅膀/1 | 小鸟张开飞向天空 | The little bird spreads them and flies into the sky, so the word must mean wing.
鸡翅/1 | 晚饭有红烧 | Supper includes this braised chicken part, so the word must mean chicken wing.
鲤鱼/1 | 公园池塘里红色的 | The park pond has many red fish, so the word must mean carp.
对虾/1 | 北方沿海的大虾 | It is a large prawn common on the northern Chinese coast, so the word must mean prawn.
龙虾/1 | 有一对大钳子煮熟变红 | It has a pair of big claws and turns red when cooked, so the word must mean lobster.
虾米/1 | 奶奶做汤放一些提味 | Grandma adds small dried shrimps to soup for flavour, so the word must mean dried shrimp.
河蟹/1 | 秋天是吃的季节 | Autumn is the season for eating freshwater crabs, so the word must mean river crab.
海龟/1 | 爬到沙滩上产卵 | The females crawl onto the beach to lay eggs, so the word must mean sea turtle.
藻类/1 | 湖水变绿发臭 | Too much of it turns lake water green and smelly, so the word must mean algae.
海藻/1 | 海带和紫菜 | Kelp and laver are edible kinds, so the word must mean seaweed.
甲壳/1 | 虾蟹身上坚硬的一层 | Shrimps and crabs are covered by a hard layer, so the word must mean carapace.
浮游生物/1 | 很多鱼以它为食 | Many fish feed on the tiny drifting life in the water, so the word must mean plankton.
蚯蚓/1 | 下雨后爬到地面 | They often come up to the surface after rain, so the word must mean earthworm.
蜘蛛/1 | 在墙角结网 | It has spun a web in the corner, so the word must mean spider.
蛛网/1 | 清晨挂满露珠 | At dawn it is covered in dewdrops, so the word must mean spider web.
蝙蝠/1 | 白天倒挂着睡 | It sleeps hanging upside down by day and catches insects at night, so the word must mean bat.
蜻蜓/1 | 下雨前飞得低 | Before rain it often flies low, so the word must mean dragonfly.
触角/1 | 蚂蚁用来传递信息 | Ants pass messages with the feelers on their heads, so the word must mean antenna.
复眼/1 | 蜻蜓几万只小眼 | A dragonfly's is made of tens of thousands of tiny eyes, so the word must mean compound eye.
口器/1 | 蚊子的像细针 | A mosquito's is like a fine needle that pierces skin, so the word must mean mouthparts.
外骨骼/1 | 昆虫身体外面坚硬的一层 | Insects have no bones inside and a hard layer outside, so the word must mean exoskeleton.
成虫/1 | 蝉只活几个星期 | A cicada larva lives underground for years and the adult only weeks, so the word must mean adult insect.
爪子/1 | 小猫把沙发抓坏 | The kitten scratched the sofa to pieces, so the word must mean claw.
鸡爪/1 | 又香又辣的菜 | The spicy dish is made from chicken feet, so the word must mean chicken feet.
脚趾/1 | 鞋太小挤得疼 | The shoes are too small and pinch, so the word must mean toe.
马蹄/1 | 远处传来一阵声 | A clatter of horses comes from afar, so the word must mean horse's hoof.
蹄子/1 | 牛羊的分成两半 | Cows and sheep have them split in two, so the word must mean hoof.
犬齿/1 | 老虎咬住猎物 | A tiger's are long and sharp for gripping prey, so the word must mean canine tooth.
象牙/1 | 保护大象禁止买卖 | Many countries ban trading it to protect elephants, so the word must mean ivory.
吸盘/1 | 章鱼腿吸住石头 | An octopus's legs hold tight to rocks with them, so the word must mean sucker.
毒腺/1 | 毒蛇头部 | A venomous snake's are in its head and the venom flows through its fangs, so the word must mean venom gland.
龟壳/1 | 乌龟把头缩进去 | A tortoise draws its head in when in danger, so the word must mean tortoise shell.
光合作用/1 | 绿色植物制造养分放出氧气 | Green plants make food this way and give off oxygen, so the word must mean photosynthesis.
呼吸作用/1 | 植物夜里一直进行 | Plants keep doing it at night when photosynthesis stops, so the word must mean respiration.
叶绿素/1 | 秋天减少叶子变黄 | Leaves turn yellow in autumn as it decreases, so the word must mean chlorophyll.
蒸腾作用/1 | 水分从叶子散发出去 | Plants give off water absorbed by the roots through their leaves, so the word must mean transpiration.
气孔/1 | 叶子表面气体水分进出 | Gases and water pass in and out through tiny openings on the leaf, so the word must mean stoma.
根系/1 | 草牢牢抓住沙土 | The grass's roots grip the sandy soil firmly, so the word must mean root system.
根毛/1 | 根尖上吸收水分 | Plants absorb water mainly through tiny hairs near the root tips, so the word must mean root hair.
年轮/1 | 数一数知道树的年龄 | Counting the rings on the trunk tells the tree's age, so the word must mean annual ring.
叶脉/1 | 像叶子的血管 | They carry water and nutrients like a leaf's blood vessels, so the word must mean leaf vein.
树皮/1 | 剥掉一圈树会死 | A tree slowly dies if a ring of it is stripped off, so the word must mean bark.
花蕊/1 | 蜜蜂把头伸进去 | The bee pokes its head into the centre of the flower, so the word must mean flower's centre.
雄蕊/1 | 顶端花药里有花粉 | The anther at its tip holds pollen, so the word must mean stamen.
雌蕊/1 | 花粉落在上面才能结果 | A flower bears fruit only after pollen lands on it, so the word must mean pistil.
花瓣/1 | 风吹过粉红色落了一地 | A gust of wind leaves pink ones all over the ground, so the word must mean petal.
子房/1 | 发育成果实 | After fertilisation it slowly becomes the fruit, so the word must mean ovary.
胚珠/1 | 发育成种子 | It will develop into a seed, so the word must mean ovule.
传粉/1 | 蜜蜂在花间飞来飞去 | Bees fly from flower to flower, so the word must mean to pollinate.
花粉/1 | 有人过敏打喷嚏 | Some people sneeze as soon as spring arrives, so the word must mean pollen.
果皮/1 | 吃苹果前洗干净 | An apple should be washed before eating, so the word must mean fruit skin.
种皮/1 | 保护里面的胚 | It protects the embryo inside the seed, so the word must mean seed coat.
竹笋/1 | 春天竹林里长出 | In spring many shoots come up in the bamboo grove, so the word must mean bamboo shoot.
雨后春笋/1 | 咖啡店大量出现 | New coffee shops keep springing up in the city, so the word must mean mushrooming.
莲花/1 | 夏天池塘里开了 | In summer the flowers on the pond bloom, so the word must mean lotus.
莲子/1 | 和红豆煮甜汤 | Mother cooks a sweet soup with them and red beans, so the word must mean lotus seed.
莲蓬/1 | 夏末孩子们划船去采 | In late summer children row out to pick the ripe seed heads on the pond, so the word must mean lotus pod.
向日葵/1 | 花盘跟着太阳转 | Its flower head turns to follow the Sun, so the word must mean sunflower.
植株/1 | 玉米长得又高又壮 | The maize plants are tall and strong, so the word must mean plant.
被子植物/1 | 苹果桃和水稻 | Apples, peaches and rice are flowering plants, so the word must mean angiosperm.
种子植物/1 | 松树和苹果树用种子繁殖 | Pines and apple trees reproduce by seeds, so the word must mean seed plant.
雌雄同株/1 | 玉米雄花在顶雌花在中间 | Maize has male flowers at the top and female flowers in the middle of one plant, so the word must mean monoecious.
微生物/1 | 要用显微镜才能看见 | Many are too small to see without a microscope, so the word must mean microorganism.
真菌/1 | 蘑菇不是植物 | Mushrooms are not plants, so the word must mean fungus.
乳酸菌/1 | 牛奶加入做成酸奶 | Yoghurt is made by adding them to milk, so the word must mean lactobacillus.
益生菌/1 | 对肠道有好处 | Some foods contain them for the good of the gut, so the word must mean probiotic.
耐药性/1 | 滥用抗生素使细菌产生 | Overusing antibiotics makes bacteria develop it, so the word must mean drug resistance.
禽流感/1 | 在鸡鸭中传播 | It spreads mainly among chickens, ducks and other birds, so the word must mean avian influenza.
转基因/1 | 培育出不怕虫子的棉花 | Scientists bred cotton that pests do not harm, so the word must mean genetically modified.
生物技术/1 | 大量生产药品和疫苗 | Medicines and vaccines are mass-produced with it, so the word must mean biotechnology.
基因工程/1 | 生产糖尿病人用的药 | Some medicines for diabetes are made this way, so the word must mean genetic engineering.
杂交/1 | 培育出高产水稻 | Scientists bred high-yield rice by crossing varieties, so the word must mean to hybridise.
驻华/1 | 各国大使馆设在北京 | Most countries' embassies of this kind are in Beijing, so the word must mean stationed in China.
驻外/1 | 在非洲工作五年的记者 | He is a journalist who has worked in Africa for five years, so the word must mean stationed abroad.
常驻/1 | 公司派他在巴黎三年 | The company is sending him to Paris for three years, so the word must mean to be permanently stationed.
总领事/1 | 领导上海领事馆 | He heads the consulate in Shanghai and handles local nationals' affairs, so the word must mean consul general.
参赞/1 | 使馆负责文化交流 | The embassy's cultural officer handles cultural exchange, so the word must mean counsellor.
特使/1 | 元首不能出席派去 | The head of state could not attend and sent someone in his place, so the word must mean special envoy.
外交使团/1 | 新年招待会各国成员出席 | Members from every country's embassy were invited to the New Year reception, so the word must mean diplomatic corps.
签证官/1 | 面试问留学原因 | At the interview he was asked why he wanted to study in that country, so the word must mean visa officer.
外交辞令/1 | 我们会认真研究 | Saying "we will study it carefully" is often just a formula, so the word must mean diplomatese.
外交途径/1 | 解决贸易纠纷 | The two countries agreed to settle the trade dispute by diplomacy, so the word must mean diplomatic channels.
会晤/1 | 两国领导人下月在北京 | The two leaders will meet in Beijing next month, so the word must mean to meet.
会谈/1 | 三小时后签署协议 | After three hours of talks both sides signed an agreement, so the word must mean talks.
国事访问/1 | 总统应邀三天 | The president came to China at its invitation for three days, so the word must mean state visit.
回访/1 | 对方来过今年我们去 | Their head teacher visited last year and ours goes there this year, so the word must mean to pay a return visit.
访华/1 | 外国总理参观长城 | The foreign premier saw the Great Wall on his first trip to China, so the word must mean to visit China.
访问团/1 | 二十名大学生组成 | Twenty university students arrive in Beijing tomorrow as a group, so the word must mean visiting delegation.
随行/1 | 总统出访一百多名企业家 | Over a hundred business people travel with the president, so the word must mean to accompany.
外宾/1 | 讲解员用英语介绍 | The museum guide explains the exhibits in fluent English, so the word must mean foreign guest.
致电/1 | 地震后领导人表示慰问 | After the earthquake many leaders sent messages of sympathy, so the word must mean to send a message.
贺电/1 | 夺冠后收到许多 | The Chinese team received many messages after winning the title, so the word must mean congratulatory telegram.
国宴/1 | 菜不一定贵但有地方特色 | The dishes at this state dinner are not always costly but show local character, so the word must mean state banquet.
欢迎仪式/1 | 孩子们献上鲜花 | Children give the guests flowers at the airport ceremony, so the word must mean welcoming ceremony.
礼炮/1 | 二十一响表示欢迎 | Twenty-one rounds greet the arriving head of state, so the word must mean salute cannon.
检阅/1 | 两国元首一起看仪仗队 | The two heads of state review the guard of honour together, so the word must mean to review troops.
仪仗队/1 | 队员身材高大动作整齐 | Its members are all tall and move in perfect unison, so the word must mean honour guard.
旗帜/1 | 会场四周各国的 | The flags of every country hang around the hall, so the word must mean banner.
勋章/1 | 老科学家胸前国家颁发的 | The old scientist wears a state honour on his chest, so the word must mean medal.
授勋/1 | 总统把勋章挂在胸前 | The president hangs the medals on their chests himself, so the word must mean to award a decoration.
外交礼节/1 | 主人到门口迎接 | The host should meet visiting guests at the door, so the word must mean diplomatic protocol.
请柬/1 | 大使馆国庆招待会的 | He received an invitation to the embassy's National Day reception, so the word must mean invitation card.
缔结/1 | 一九七八年和平友好条约 | China and Japan signed a treaty of peace and friendship in 1978, so the word must mean to conclude.
缔约国/1 | 都必须遵守条约 | Every country that signed must obey the treaty, so the word must mean state party.
缔造/1 | 和平需要各国共同 | Peace must be built and kept by all countries together, so the word must mean to found.
公约/1 | 班里制定贴在墙上 | The class drew up rules of good conduct and pinned them on the wall, so the word must mean code of conduct.
国际公约/1 | 保护湿地一百七十多国加入 | Over a hundred and seventy countries have joined the one on wetlands, so the word must mean international convention.
议定书/1 | 京都减少温室气体 | In 1997 countries in Kyoto adopted a document to cut greenhouse gases, so the word must mean protocol.
备忘录/1 | 两所大学准备互派学生 | Two universities signed a document on exchanging students, so the word must mean memorandum.
联合声明/1 | 宣布建立外交关系 | After the talks the two countries announced diplomatic ties together, so the word must mean joint statement.
南极条约/1 | 南极只能用于和平和科研 | Under it Antarctica may be used only for peace and science, so the word must mean Antarctic Treaty.
巴黎协定/1 | 二零一五年应对气候变化 | In 2015 nearly two hundred countries adopted it to tackle climate change, so the word must mean Paris Agreement.
安理会/1 | 由十五个理事国组成 | The UN body has fifteen members, so the word must mean Security Council.
常任理事国/1 | 安理会五个中国是其一 | The Security Council has five, China among them, so the word must mean permanent member.
会员国/1 | 联合国一百九十三个 | The UN now has a hundred and ninety-three, so the word must mean member state.
观察员/1 | 可以发言但不能投票 | Some countries may speak at the meeting but cannot vote, so the word must mean observer.
世界卫生组织/1 | 总部在日内瓦 | Its headquarters are in Geneva, so the word must mean World Health Organization.
世贸组织/1 | 中国二零零一年加入 | China joined it in 2001, so the word must mean World Trade Organization.
国际奥委会/1 | 决定哪座城市举办奥运会 | It decides which city hosts the Olympic Games, so the word must mean International Olympic Committee.
非政府组织/1 | 不靠政府的钱靠捐款 | It relies on public donations instead of government money, so the word must mean non-governmental organisation.
国际组织/1 | 世界卫生组织是一个 | The World Health Organization is an important one, so the word must mean international organisation.
否决权/1 | 常任理事国都有 | Every permanent member of the Security Council has it, so the word must mean veto power.
峰会/1 | 二十多国元首参加 | Heads of state and government of over twenty countries attend, so the word must mean summit.
年会/1 | 每年十二月总结工作 | The organisation meets every December to review the year, so the word must mean annual meeting.
东道主/1 | 中国热情接待各国代表 | China warmly received the delegates as host, so the word must mean host.
主办国/1 | 二零二二年世界杯是卡塔尔 | Qatar staged the 2022 World Cup, so the word must mean host country.
轮值主席/1 | 安理会每个月换一次 | The Security Council's presidency changes every month, so the word must mean rotating chair.
提案/1 | 代表向大会提交 | Delegates may submit them to the assembly for discussion, so the word must mean motion.
决议/1 | 联合国定世界海洋日 | The General Assembly made 8 June World Oceans Day, so the word must mean resolution.
一致通过/1 | 没有一个人反对 | Nobody opposed the decision at the meeting, so the word must mean to pass unanimously.
达成共识/1 | 三天讨论在减排目标上 | After three days all sides agreed on the emissions target, so the word must mean to reach a consensus.
遗憾/1 | 没达成协议主办方 | The meeting failed to reach agreement, so the word must mean regretful.
和平共处/1 | 不同制度的国家 | Countries with different systems can live alongside each other, so the word must mean to coexist peacefully.
互不干涉/1 | 各国内政 | Countries should keep out of each other's internal affairs, so the word must mean mutual non-interference.
平等互利/1 | 贸易建立在这个基础上 | The two countries' trade rests on fairness and gain for both, so the word must mean equality and mutual benefit.
互利共赢/1 | 不是一方得利一方吃亏 | Cooperation should not let one side gain while the other loses, so the word must mean mutual benefit and win-win.
睦邻友好/1 | 中国和周边国家 | China keeps good relations with neighbouring countries, so the word must mean good-neighbourly friendship.
多边主义/1 | 大家一起商量 | Everyone should decide together instead of one country deciding, so the word must mean multilateralism.
单边/1 | 一个国家自己提高关税 | One country raising tariffs on its own upsets its trading partners, so the word must mean unilateral.
国际秩序/1 | 公正合理需要共同努力 | Keeping it fair and reasonable needs all countries' efforts, so the word must mean international order.
国际法/1 | 领海宽度不超过十二海里 | Under it a country's territorial sea is at most twelve nautical miles, so the word must mean international law.
繁荣昌盛/1 | 新年祝愿国家 | At New Year people wish the country well and the people happiness, so the word must mean thriving.
国际关系/1 | 大学专业毕业进外交部 | He studied it at university and then joined the foreign ministry, so the word must mean international relations.
国际形势/1 | 复杂多变需要合作 | The world situation is complex and changing, so the word must mean international situation.
国际社会/1 | 各国纷纷派来救援队 | Countries all over the world sent rescue teams after the earthquake, so the word must mean international community.
国际地位/1 | 经济发展后不断提高 | The country's standing in the world rises with its economy, so the word must mean international status.
紧张局势/1 | 缓和边境的 | The two leaders phoned to ease matters on the border, so the word must mean tense situation.
争端/1 | 国家间应和平解决 | Disputes between countries should be settled peacefully, so the word must mean dispute.
遏制/1 | 各国联手阻止病毒传播 | Countries join forces to stop the virus spreading, so the word must mean to curb.
严峻/1 | 全球变暖形势 | Global warming is a serious situation, so the word must mean severe.
化险为夷/1 | 及时沟通危机过去 | Timely talks between both sides ended the crisis safely, so the word must mean to turn danger into safety.
堪称/1 | 会晤是关系史上的大事 | The meeting deserves to be called a major event in the two countries' relations, so the word must mean to be worthy of being called.
华侨/1 | 捐钱回家乡修学校 | Many Chinese living abroad give money to build schools and hospitals at home, so the word must mean overseas Chinese.
侨胞/1 | 大使馆邀请一起包饺子 | At Spring Festival the embassy invites local Chinese to make dumplings, so the word must mean overseas compatriot.
侨乡/1 | 江门很多人家有亲戚在国外 | Many families in Jiangmen have relatives overseas, so the word must mean home of overseas Chinese.
归侨/1 | 从印尼回国在厦门定居 | His father came back from Indonesia in the fifties and settled in Xiamen, so the word must mean returned overseas Chinese.
侨居/1 | 年轻时住在法国 | She lived in France when young and came home only in old age, so the word must mean to reside abroad.
撤侨/1 | 用飞机把三千多人接回 | The government flew over three thousand of its citizens home after the earthquake, so the word must mean to evacuate citizens.
外侨/1 | 来自欧洲美洲的住户 | Many people from Europe and the Americas live in the city, so the word must mean foreign national.
民间交往/1 | 国家关系的基础是人民友谊 | The basis of relations between countries is friendship between peoples, so the word must mean non-governmental contact.
友好城市/1 | 北京和东京一九七九年 | Beijing and Tokyo became twinned in 1979, so the word must mean twin cities.
庞大/1 | 东南亚华人超过三千万 | Over thirty million ethnic Chinese live in Southeast Asia, so the word must mean enormous.
人文交流/1 | 互派留学生 | Exchanging students is an important part of it, so the word must mean people-to-people exchange.
孔子学院/1 | 在本国学了两年中文 | He studied Chinese at one in his own country before going to Beijing, so the word must mean Confucius Institute.
汉语热/1 | 世界上学中文的人多了 | Interest in learning Chinese grew with China's economy, so the word must mean Chinese language fever.
交换生/1 | 在日本大学学习一年 | She studied for a year at a university in Japan through a programme, so the word must mean exchange student.
访问学者/1 | 王教授在英国一年 | Professor Wang spent a year at a British university, so the word must mean visiting scholar.
弘扬/1 | 艺术节传播传统文化 | The festival aims to promote traditional culture, so the word must mean to carry forward.
启迪/1 | 出国交流让我看到不同生活 | Going abroad showed the speaker different ways of living, so the word must mean enlightenment.
文化差异/1 | 点头在有的国家表示不同意 | A nod means yes in some countries and no in others, so the word must mean cultural difference.
文化冲击/1 | 留学生感到孤独不习惯 | New overseas students often feel lonely and out of place, so the word must mean culture shock.
惋惜/1 | 翻译家没译完就去世 | The translator died before finishing his last book, so the word must mean to feel sorry.
贸易额/1 | 去年比前年增长百分之十 | Trade between the two countries rose ten per cent last year, so the word must mean trade volume.
贸易顺差/1 | 出口多进口少 | A country exports more than it imports, so the word must mean trade surplus.
贸易逆差/1 | 进口比出口多 | A country imports more than it exports, so the word must mean trade deficit.
贸易伙伴/1 | 中国是很多国家最大的 | China is the largest one for many countries, so the word must mean trading partner.
贸易壁垒/1 | 提高关税 | Raising tariffs is a common one, so the word must mean trade barrier.
反倾销/1 | 低于成本价大量出售 | Foreign goods sold in bulk below cost can be investigated, so the word must mean anti-dumping.
外汇储备/1 | 中国多年居世界第一 | China's have led the world for years, so the word must mean foreign exchange reserves.
引进外资/1 | 为外国企业提供便利 | The city offers many conveniences to foreign firms, so the word must mean to bring in foreign investment.
经济特区/1 | 厦门是最早的之一 | Xiamen was one of China's first, so the word must mean special economic zone.
中欧班列/1 | 货物从重庆到德国十几天 | Goods reach Germany from Chongqing in just over ten days by rail, so the word must mean China-Europe freight train.
对外援助/1 | 帮许多国家修公路医院 | China has helped many countries build roads and hospitals, so the word must mean foreign aid.
援建/1 | 当地人叫友谊体育场 | Locals call the stadium China built the Friendship Stadium, so the word must mean to help build.
人道主义/1 | 红十字会的工作精神 | The Red Cross's work shows this spirit, so the word must mean humanitarianism.
国际救援/1 | 十几个国家派人参加 | Over ten countries sent people to help after the earthquake, so the word must mean international relief.
救援队/1 | 带搜救犬赶到灾区 | They rushed overnight to the quake zone with search dogs, so the word must mean rescue team.
捐助/1 | 衣服食物帮受灾的人 | Many people gave clothes and food to help the victims, so the word must mean to donate.
粮食安全/1 | 每个国家都要保障 | Every country must make sure it has enough food, so the word must mean food security.
减贫/1 | 中国经验受到关注 | China's experience of lifting people out of poverty draws world attention, so the word must mean poverty reduction.
维和/1 | 中国派出人员最多 | China sends the most peacekeepers of the permanent members, so the word must mean peacekeeping.
发展中国家/1 | 需要资金技术发展经济 | Many need more money and technology to grow their economies, so the word must mean developing country.
领土/1 | 俄罗斯面积最大 | Russia is the largest country by land area, so the word must mean territory.
领海/1 | 从海岸基线算起十二海里 | It usually extends twelve nautical miles from the coast, so the word must mean territorial sea.
领空/1 | 外国飞机进入需要允许 | Foreign aircraft need permission to enter it, so the word must mean airspace.
主权/1 | 尊重别国的 | Every country, large or small, should respect others' independence, so the word must mean sovereignty.
岛屿/1 | 印度尼西亚一万多个 | Indonesia is made up of more than ten thousand, so the word must mean island.
群岛/1 | 夏威夷在太平洋中部 | Hawaii lies in the middle of the Pacific, so the word must mean archipelago.
内陆国/1 | 蒙古四周没有海 | Mongolia has no sea on any side, so the word must mean landlocked country.
专属经济区/1 | 最远到二百海里 | It reaches up to two hundred nautical miles from the coast, so the word must mean exclusive economic zone.
滨海/1 | 青岛美丽的城市 | Qingdao is a beautiful city by the sea, so the word must mean seaside.
宛如/1 | 小岛像撒在海上的珍珠 | From the plane the islets look like pearls scattered on the sea, so the word must mean as if.
边境/1 | 中越小镇越南商人来 | Vietnamese traders come to the town every day, so the word must mean border area.
国界/1 | 这条河对岸是另一个国家 | The other bank of the river is another country, so the word must mean national boundary.
边检/1 | 把护照交给工作人员 | Passports must be shown to the officers there, so the word must mean frontier inspection.
出入境/1 | 办护照到公安局 | Passports are issued by this office of the police, so the word must mean exit and entry.
免签/1 | 去旅游不用办签证 | Tourists between the two countries no longer need visas, so the word must mean visa exemption.
落地签/1 | 到机场再办 | No visa is needed in advance and one can be got at the airport, so the word must mean visa on arrival.
过境/1 | 在迪拜停留四小时 | On the way to Europe they stopped four hours in Dubai, so the word must mean to transit.
跨境/1 | 网上买外国商品电商 | Many people buy foreign goods online, so the word must mean cross-border.
申报/1 | 现金超过规定向海关 | Cash over the limit must be declared at customs on arrival, so the word must mean to declare.
倒时差/1 | 刚到美国白天想睡 | For the first days in America he always felt sleepy in the daytime, so the word must mean to adjust to jet lag.
气候变化/1 | 冰川融化海平面上升 | Glaciers melt and sea levels rise, so the word must mean climate change.
温室气体/1 | 二氧化碳是主要的一种 | Carbon dioxide is a main one, so the word must mean greenhouse gas.
减排/1 | 城市发展电动汽车 | Many cities promote electric cars to cut emissions, so the word must mean to reduce emissions.
可持续发展/1 | 不为眼前利益破坏环境 | We must not harm the environment for short-term gain, so the word must mean sustainable development.
跨境传播/1 | 防止传染病需要合作 | Stopping diseases from spreading between countries needs cooperation, so the word must mean spread across borders.
核不扩散/1 | 大多数国家加入条约 | Most countries have joined the treaty, so the word must mean nuclear non-proliferation.
外太空/1 | 属于全人类和平目的 | It belongs to all mankind and may be used only for peace, so the word must mean outer space.
公海/1 | 各国船都可以自由航行 | Ships of every country may sail freely there, so the word must mean high seas.
极地/1 | 研究冰层了解过去气候 | Scientists study ice there to learn about Earth's past climate, so the word must mean polar region.
和平利用/1 | 用核能发电 | Countries should use nuclear power to generate electricity, so the word must mean to use peacefully.
瑞士/1 | 山地国家手表巧克力 | It is a mountainous country famous for watches and chocolate, so the word must mean Switzerland.
瑞典/1 | 诺贝尔奖颁奖在斯德哥尔摩 | Nobel ceremonies other than the Peace Prize are held in its capital, so the word must mean Sweden.
芬兰/1 | 千湖之国 | It is called the land of a thousand lakes, so the word must mean Finland.
丹麦/1 | 安徒生的国家 | Hans Christian Andersen came from there, so the word must mean Denmark.
菲律宾/1 | 七千多个岛首都马尼拉 | It has over seven thousand islands and Manila is its capital, so the word must mean the Philippines.
缅甸/1 | 和云南相邻 | It borders Yunnan and people on both sides mix a lot, so the word must mean Myanmar.
文莱/1 | 东南亚小国石油丰富 | It is a small Southeast Asian country rich in oil, so the word must mean Brunei.
黎巴嫩/1 | 地中海东岸首都贝鲁特 | It lies on the eastern Mediterranean and Beirut is its capital, so the word must mean Lebanon.
阿拉伯/1 | 数字其实是印度人发明的 | The numerals we use were in fact invented in ancient India, so the word must mean Arab.
曼谷/1 | 泰国的首都 | It is the capital of Thailand, so the word must mean Bangkok.
喧哗/1 | 图书馆里不要大声 | The library asks people not to be loud, so the word must mean to make a racket.
嘈杂/1 | 饭馆不适合谈事情 | The restaurant is too noisy for a business talk, so the word must mean noisy.
哗然/1 | 假新闻揭穿后舆论 | The fake news was exposed and the public was in uproar, so the word must mean in an uproar.
声嘶力竭/1 | 球迷为球队加油 | The fans cheer their team at the top of their voices, so the word must mean shouting oneself hoarse.
嘶哑/1 | 讲三小时课嗓子 | He lectured for three hours straight, so the word must mean husky.
聆听/1 | 安静地听老教授报告 | The pupils sit quietly listening to the old professor, so the word must mean to listen respectfully.
呼唤/1 | 妈妈在门口叫孩子 | Mother calls the child home for supper from the door, so the word must mean to call.
唤起/1 | 纪录片引起人们关注 | The documentary made people care about protecting wildlife, so the word must mean to arouse.
音量/1 | 晚上看电视调小 | Please turn the TV down at night, so the word must mean volume.
音质/1 | 耳机像在音乐厅 | Music on the headphones sounds like a concert hall, so the word must mean sound quality.
诙谐/1 | 说话把大家逗笑 | His talk often makes everyone roar with laughter, so the word must mean jocular.
调侃/1 | 说自己胖得像熊猫 | He jokes that he is as fat as a panda, so the word must mean to banter.
侃侃而谈/1 | 面对记者一点不紧张 | The young scientist talked to reporters at ease and without nerves, so the word must mean to talk confidently.
哗众取宠/1 | 网络节目故意说怪话 | Some online shows say odd things only to get attention, so the word must mean to play to the gallery.
夸大其词/1 | 吃药三天能长高 | The advert claims the medicine makes you taller in three days, so the word must mean to exaggerate.
添油加醋/1 | 越传越离谱 | The story grew wilder each time he passed it on, so the word must mean to embroider a story.
以讹传讹/1 | 错误说法在网上传 | Many people believe the false claim spread online, so the word must mean to pass on a falsehood.
诋毁/1 | 发文章说同行坏话被告 | He was sued for attacking a rival online, so the word must mean to slander.
恍然大悟/1 | 听了解释才明白看错了题 | After the teacher explained, the speaker realised they had misread the question, so the word must mean to suddenly realise.
乱七八糟/1 | 书和衣服扔了一地 | Books and clothes lie all over his floor, so the word must mean in a mess.
创刊/1 | 报纸一九四九年开始出版 | The paper was founded in 1949, so the word must mean to start publication.
停刊/1 | 读者越来越少 | The magazine stopped as readers fell away, so the word must mean to stop publication.
复刊/1 | 停办十年今年又出 | The paper stopped for ten years and now appears again, so the word must mean to resume publication.
创刊号/1 | 收藏现在很值钱 | He owns the magazine's first issue, now worth a lot, so the word must mean first issue.
合订本/1 | 图书馆几十年的报纸 | The library keeps decades of the paper bound together, so the word must mean bound volume.
号外/1 | 获得奥运举办权那晚 | Many papers printed special editions the night Beijing won the Olympics, so the word must mean extra edition.
副刊/1 | 散文发表在文艺 | His essays often appear in the paper's literary pages, so the word must mean supplement.
丛书/1 | 二十本每本一个科学问题 | The series has twenty books, each on a science question, so the word must mean book series.
出版物/1 | 注明出版单位和时间 | Every one must state its publisher and date, so the word must mean publication.
畅销书/1 | 一个月卖五十万本 | The novel sold half a million copies in a month, so the word must mean bestseller.
稿件/1 | 编辑每天看几十篇 | The editor reads dozens of readers' submissions a day, so the word must mean manuscript.
约稿/1 | 请作家写童年散文 | The magazine asked the writer for an essay on childhood, so the word must mean to commission an article.
审稿/1 | 论文经过专家 | Papers are published only after experts check them, so the word must mean to review a manuscript.
退稿/1 | 小说多次被退回 | His stories were rejected many times but he did not give up, so the word must mean to reject a manuscript.
截稿/1 | 明天中午之前写完 | The deadline is noon tomorrow, so the word must mean to close for submissions.
编辑部/1 | 读者写信寄给 | Readers may write to the magazine's office, so the word must mean editorial department.
总编辑/1 | 头版新闻由他决定 | The chief editor decides what goes on the front page, so the word must mean editor-in-chief.
责任编辑/1 | 对每一句话仔细核对 | The editor in charge checked every sentence of the book, so the word must mean editor in charge.
撰稿人/1 | 专门写旅行文章 | He writes travel pieces for several magazines, so the word must mean writer.
专栏作家/1 | 每周一篇教育文章 | She writes a weekly piece on education for the paper, so the word must mean columnist.
采编/1 | 又采访又编辑稿件 | He both goes out to report and edits copy, so the word must mean reporting and editing.
采写/1 | 两名记者花一个月 | Two reporters spent a month on the report, so the word must mean to gather and write.
记者站/1 | 报社在三十多个城市设有 | The paper has bureaus in over thirty cities, so the word must mean news bureau.
通讯社/1 | 新华社是国家的 | Xinhua is China's national news agency, so the word must mean news agency.
通讯员/1 | 学校的小经常给校报写稿 | He often writes for the school newspaper, so the word must mean correspondent.
特约记者/1 | 旅行家每到一国发回报道 | The traveller sends the magazine a report from every country, so the word must mean special correspondent.
实习记者/1 | 大学没毕业在电视台 | She has not graduated yet and works at a TV station, so the word must mean trainee reporter.
采访对象/1 | 尊重他们不公开隐私 | Reporters must respect the people they interview, so the word must mean interviewee.
专访/1 | 获奖后接受电视台 | After winning, the writer gave a TV station an exclusive interview, so the word must mean special interview.
新闻嗅觉/1 | 从小事发现大新闻 | A good reporter spots big news in small things, so the word must mean news sense.
独家报道/1 | 别的报纸都没有 | No other paper has the story, so the word must mean exclusive report.
深度报道/1 | 一万多字分析交通拥堵 | Over ten thousand characters analyse the causes of traffic jams, so the word must mean in-depth report.
连续报道/1 | 一共发了十二篇 | The paper ran twelve articles on the matter, so the word must mean continuous coverage.
现场报道/1 | 冒着大雨在洪水边 | The reporter speaks beside the flood in heavy rain, so the word must mean on-the-spot report.
快讯/1 | 比赛一结束中国队获胜 | As soon as the match ended, the website announced China's win, so the word must mean newsflash.
简讯/1 | 每条只有几十个字 | Page two has a column of items only a few dozen characters long, so the word must mean brief news.
通稿/1 | 很多报纸内容一模一样 | Many papers print the same text word for word, so the word must mean wire copy.
新闻发布会/1 | 外交部每个工作日例行 | The foreign ministry holds one every working day, so the word must mean press conference.
答记者问/1 | 发言人介绍访问情况 | The spokesperson took questions about the visit, so the word must mean to answer reporters' questions.
新闻界/1 | 老记者工作四十年 | The veteran reporter has worked in journalism for forty years, so the word must mean journalism circles.
消息来源/1 | 很难判断真假 | The story does not say where it came from, so the word must mean news source.
知情人/1 | 据他说公司下个月发布新手机 | Someone in the know says the firm will launch a new phone next month, so the word must mean informed source.
传言/1 | 说放假一周后来是假的 | The talk of a week's holiday proved false, so the word must mean rumour.
失实/1 | 报道不真实报社道歉 | The paper has apologised publicly for the report, so the word must mean untrue.
虚假新闻/1 | 在网上发布要承担法律责任 | Posting fake stories online brings legal responsibility, so the word must mean false news.
事实核查/1 | 帮读者分辨真假消息 | Some media help readers tell true news from false, so the word must mean fact-check.
甄别/1 | 网上信息要学会分辨 | Online information is vast and readers must tell true from false, so the word must mean to screen.
一小撮/1 | 散布谣言的人很少 | Most netizens are sensible and only a few spread rumours, so the word must mean a small bunch.
扒/1 | 网友把十年前的照片找出来 | Netizens dug up the actor's photos from ten years ago, so the word must mean to dig up.
揪出/1 | 警方很快找到造谣的人 | Police quickly found the person spreading rumours online, so the word must mean to ferret out.
娱乐/1 | 周末看电影和打球 | At weekends he watches films and plays ball, so the word must mean recreation.
娱乐圈/1 | 十六岁进入拍了二十多部电影 | She started acting at sixteen and has made over twenty films, so the word must mean entertainment industry.
娱乐新闻/1 | 对明星的事不感兴趣 | He has no interest in stars' lives, so the word must mean entertainment news.
文娱/1 | 周五下午唱歌跳舞下棋 | Singing, dancing and chess take place on Friday afternoons, so the word must mean cultural and recreational.
自娱自乐/1 | 爷爷在家拉二胡 | Grandpa plays the erhu at home for his own pleasure, so the word must mean to entertain oneself.
综艺节目/1 | 周末电视上又唱又跳 | Weekend TV is full of singing and dancing shows, so the word must mean variety show.
真人秀/1 | 城市孩子去农村生活一个月 | The show films city children living on a farm for a month, so the word must mean reality show.
选秀/1 | 通过唱歌节目出名 | She became famous through a singing contest show, so the word must mean talent contest.
脱口秀/1 | 观众笑个不停 | The audience laugh nonstop at the comedian's stand-up, so the word must mean talk show.
嘉宾/1 | 今天节目请来科学家 | Today's programme has a famous scientist as guest, so the word must mean guest.
收视率/1 | 电视剧几乎家家都在看 | Almost every household is watching the drama, so the word must mean viewing figures.
收听率/1 | 早上开车时段广播最高 | Many people drive to work in the morning with the radio on, so the word must mean audience rating.
转播/1 | 很多电视台同时播足球赛 | Many TV stations across the country showed the match at the same time, so the word must mean to relay.
录播/1 | 不是直播出错可以重录 | The programme is not live and mistakes can be re-recorded, so the word must mean recorded broadcast.
重播/1 | 昨晚没看到今天下午再放 | The speaker missed last night's programme but can see it again this afternoon, so the word must mean to rebroadcast.
首播/1 | 纪录片下周六第一次播 | The documentary will be shown for the first time next Saturday, so the word must mean first broadcast.
黄金时段/1 | 晚七点到十点广告最贵 | Seven to ten in the evening has the most viewers and the dearest adverts, so the word must mean prime time.
卫视/1 | 省级节目全国都能看 | Many provincial channels can be seen nationwide, so the word must mean satellite television.
广播电台/1 | 主持晚上音乐节目 | He hosts a music programme every evening on the radio, so the word must mean radio station.
调频/1 | 收音机调到九十七点四 | The radio must be tuned to 97.4 to get the station, so the word must mean frequency modulation.
片头/1 | 电视剧开头三十秒音乐好听 | The drama's opening runs only thirty seconds with lovely music, so the word must mean opening titles.
片尾/1 | 列出所有工作人员名字 | All the crew's names are listed after the film, so the word must mean closing credits.
主题曲/1 | 动画片很多孩子会唱 | Many children can sing the cartoon's song, so the word must mean theme song.
插曲/1 | 一只小狗跑进球场 | A puppy ran onto the pitch during the match, so the word must mean interlude.
演职员/1 | 拍完那天一起吃饭 | The whole cast and crew celebrated together when filming ended, so the word must mean cast and crew.
摄像师/1 | 把摄像机对准主持人 | Before the show someone pointed the camera at the host, so the word must mean video camera operator.
剪辑师/1 | 几百小时素材剪成两小时 | Hundreds of hours of footage were cut into a two-hour film, so the word must mean film editor.
后期制作/1 | 拍完了明年春天上映 | Filming is finished and the film comes out next spring, so the word must mean post-production.
纪录片/1 | 大熊猫拍了三年 | The film about giant pandas took three whole years to shoot, so the word must mean documentary.
拷贝/1 | 照片从手机到电脑 | The speaker moved the photos from the phone to the computer, so the word must mean to copy.
收音机/1 | 爷爷散步时听新闻 | Grandpa listens to the news on it during his morning walk, so the word must mean radio.
录音机/1 | 反复听磁带 | Learners used to play tapes over and over on it, so the word must mean tape recorder.
摄像机/1 | 记者背着跑到现场 | The reporter ran to the accident carrying it, so the word must mean video camera.
麦克风/1 | 主持人拿起宣布晚会开始 | The host picks it up to open the show, so the word must mean microphone.
扬声器/1 | 广场上播放音乐 | Music is playing through them on the square, so the word must mean loudspeaker.
天线/1 | 屋顶上装着电视 | Many rooftops once had one for the TV, so the word must mean antenna.
按钮/1 | 按一下红色的机器停 | Pressing the red one stops the machine, so the word must mean button.
旋钮/1 | 转动找别的电台 | Turning it on the radio finds other stations, so the word must mean knob.
有线电视/1 | 能看一百多个频道 | The family gets over a hundred channels after it was installed, so the word must mean cable TV.
荧光屏/1 | 老式电视机凸出来 | Old TV sets had a bulging front and a big belly behind, so the word must mean fluorescent screen.
显示屏/1 | 车站显示出发时间 | The station shows every train's departure time on it, so the word must mean display screen.
触摸屏/1 | 用手指点一点买票 | Tickets can be bought by tapping it with a finger, so the word must mean touch screen.
大屏幕/1 | 广场上直播比赛 | Many people stand watching the match live on the square, so the word must mean big screen.
横屏/1 | 把手机横过来看 | Turning the phone sideways gives a bigger picture, so the word must mean landscape orientation.
分辨率/1 | 一千九百二十乘一千零八十 | The photo measures 1920 by 1080, so the word must mean resolution.
像素/1 | 照片放大后的小方块 | Enlarging a photo shows the tiny squares it is made of, so the word must mean pixel.
高清/1 | 连球员表情都看得清 | Even the players' faces could be seen clearly in the live broadcast, so the word must mean high-definition.
画质/1 | 老电影修复后比原来好 | The restored old film looks much better than before, so the word must mean image quality.
荧屏/1 | 老演员很多年没出现在上面 | The old actor has not been seen on TV for years, so the word must mean television screen.
五彩缤纷/1 | 灯光把舞台照得漂亮 | The lights at the gala make the stage beautiful, so the word must mean riotously colourful.
公众号/1 | 学校开通每天发新闻 | The school posts campus news on WeChat every day, so the word must mean public account.
推送/1 | 手机每天发来几十条新闻 | The phone sends dozens of news items a day, so the word must mean to push.
评论区/1 | 视频下面几千条留言 | Thousands of comments sit under the video, so the word must mean comment section.
留言板/1 | 学生给校长提建议 | Pupils can leave suggestions for the head on the school website, so the word must mean message board.
置顶/1 | 重要通知一打开就看到 | The notice is the first thing seen on opening the page, so the word must mean to pin to the top.
删帖/1 | 帖子不实网站删掉 | The post was untrue and the website took it down, so the word must mean to delete a post.
转帖/1 | 好文章放到自己博客上 | He reposted a good article on his own blog, so the word must mean to repost.
拉黑/1 | 总发广告的人 | The man kept sending her adverts, so the word must mean to blacklist.
屏蔽/1 | 软件让网页没有广告 | The software hides adverts and makes pages cleaner, so the word must mean to block.
迭代/1 | 软件每个月都有新版本 | The software has a new version nearly every month, so the word must mean to iterate.
点击率/1 | 一百人里只有一个点开 | Only one in a hundred who saw the advert opened it, so the word must mean click-through rate.
浏览量/1 | 文章一天超过十万 | Over a hundred thousand people read the article in a day, so the word must mean page views.
播放量/1 | 歌的视频超过一亿次 | The song's video has been played over a hundred million times, so the word must mean number of plays.
发行量/1 | 报纸每天最高一百万份 | The paper once sold a million copies a day, so the word must mean circulation.
蹭热度/1 | 借热门新闻发无关广告 | Some sellers post unrelated adverts riding on hot news, so the word must mean to cash in on a hot topic.
吸引眼球/1 | 文章标题写得很夸张 | Some articles use exaggerated headlines to grab attention, so the word must mean to catch the eye.
营销号/1 | 为赚钱编离奇故事 | Many accounts make up strange stories for money, so the word must mean marketing account.
造势/1 | 电影上映前花钱宣传 | The company spent heavily on publicity before the film came out, so the word must mean to build momentum.
推波助澜/1 | 谣言越传越广媒体也参与 | Some media helped the rumour spread further, so the word must mean to add fuel to the fire.
震撼/1 | 纪录片画面让人难忘 | People cannot forget the documentary's images, so the word must mean shocking.
软广告/1 | 看起来像新闻 | The article looks like news but is really promotion, so the word must mean disguised advertisement.
广告词/1 | 牛奶的一句简单好记 | Many people can repeat the simple, catchy milk slogan, so the word must mean advertising slogan.
广告牌/1 | 高速公路两边巨大的 | Huge ones stand along the motorway, so the word must mean billboard.
植入广告/1 | 主人公总喝同一牌子饮料 | The hero always drinks the same brand of drink in the series, so the word must mean product placement.
代言人/1 | 运动员为运动鞋公司 | The athlete represents a sports-shoe company, so the word must mean brand ambassador.
品牌形象/1 | 质量问题会损害 | Quality problems seriously damage a company's reputation, so the word must mean brand image.
宣传片/1 | 城市拍了旅游的 | The city made a tourism film shown again and again on TV, so the word must mean promotional video.
传单/1 | 新饭店在路口发 | The new restaurant sends people to hand out leaflets at the crossing, so the word must mean leaflet.
口号/1 | 运动会上高喊着 | Pupils shout slogans as they march past the stand at the sports meet, so the word must mean slogan.
幌子/1 | 打着免费体检卖保健品 | They offer free health checks only to sell supplements, so the word must mean pretext.
媒介素养/1 | 教学生分辨网上信息 | The school teaches pupils to tell true information from false online, so the word must mean media literacy.
信息茧房/1 | 只看自己喜欢的内容 | People who see only content they like get shut in, so the word must mean information cocoon.
算法推荐/1 | 总看到同一类内容 | We keep seeing the same kind of content, so the word must mean recommendation algorithm.
信息过载/1 | 几百条消息什么也记不住 | Receiving hundreds of messages a day, people remember none of them, so the word must mean information overload.
淹没/1 | 真实声音被谣言盖住 | True voices are often drowned out by rumours, so the word must mean to submerge.
深度阅读/1 | 刷短视频代替不了 | Short videos cannot replace reading good books with a calm mind, so the word must mean in-depth reading.
数字鸿沟/1 | 老人不会用智能手机 | Many old people cannot use smartphones, so the word must mean digital divide.
新闻伦理/1 | 偷拍私生活违反 | Secretly filming people's private lives for news breaks the rules of the trade, so the word must mean news ethics.
名誉权/1 | 捏造事实诋毁别人 | Making up facts online to smear someone violates their rights, so the word must mean right of reputation.
剽窃/1 | 论文大段抄别人成果 | He copied long passages of others' research and lost his degree, so the word must mean to plagiarise.
屋檐/1 | 下雨站在下面躲雨 | They shelter from the rain under the edge of the roof, so the word must mean eaves.
飞檐翘角/1 | 古楼像要飞起来的鸟 | The old building looks like a bird about to take off, so the word must mean upswept eaves and corners.
琉璃瓦/1 | 故宫屋顶金黄色的 | The Forbidden City's roofs are covered with golden glazed tiles, so the word must mean glazed tile.
屋脊/1 | 上面立着一排小兽 | A row of small beasts often stands along the top of old roofs, so the word must mean roof ridge.
斗拱/1 | 把屋顶重量传到柱子 | These wooden brackets carry the roof's weight onto the pillars, so the word must mean dougong bracket.
横梁/1 | 架在两根柱子上撑起屋顶 | The beam laid across two pillars holds up the roof, so the word must mean crossbeam.
立柱/1 | 大殿前红色雕着龙 | Four red pillars carved with dragons stand in front of the hall, so the word must mean upright column.
榫卯/1 | 不用钉子连木头 | Ancient carpenters joined wood together without a single nail, so the word must mean mortise and tenon joint.
雕梁画栋/1 | 王府十分华丽 | The mansion's beams are carved and painted splendidly, so the word must mean carved beams and painted rafters.
木结构/1 | 古代宫殿很怕失火 | Ancient Chinese palaces were very vulnerable to fire, so the word must mean wooden structure.
门槛/1 | 进门时要抬起脚 | You must lift your foot to step over it at old doorways, so the word must mean threshold.
门帘/1 | 夏天挡蚊子 | In summer many families hang one in the doorway to keep out mosquitoes, so the word must mean door curtain.
窗帘/1 | 拉开阳光照进来 | She pulled them open and sunlight poured in, so the word must mean curtain.
匾额/1 | 老店门口写着店名 | A board with the shop's name hangs over the old shop door, so the word must mean inscribed board.
门楼/1 | 高大说明主人有钱 | The family's tall gateway shows they were once rich, so the word must mean gate tower.
照壁/1 | 进大门迎面挡住视线 | A wall facing the gate blocks outsiders' view, so the word must mean spirit screen.
天井/1 | 雨水从四面屋顶流进来 | Rainwater runs into the small open space in the middle of southern houses, so the word must mean skywell.
回廊/1 | 下雨天在里面散步 | You can stroll in the long covered walkway even when it rains, so the word must mean winding corridor.
栅栏/1 | 草地四周白色的 | A white fence surrounds the park lawn, so the word must mean fence.
竹篱/1 | 农家小院围着 | The farmyard is fenced with bamboo and full of vegetables, so the word must mean bamboo fence.
民居/1 | 各地风格反映气候习惯 | Local houses reflect climate and way of life, so the word must mean folk dwelling.
吊脚楼/1 | 一半用木柱撑在空中 | Houses in the Guizhou hills stand half on the slope and half on wooden posts, so the word must mean stilted house.
土楼/1 | 福建又大又圆住几十户 | Big round buildings in Fujian house dozens of families, so the word must mean tulou.
竹楼/1 | 云南南部楼下通风 | People live upstairs and the airy ground floor stays open in hot southern Yunnan, so the word must mean bamboo house.
石库门/1 | 上海用石头做门框 | Old Shanghai houses have doorframes made of stone, so the word must mean stone-gate house.
骑楼/1 | 广州老街下雨不怕 | Walking under the arcades of old Guangzhou keeps you dry, so the word must mean arcade building.
徽派建筑/1 | 白墙黑瓦马头墙 | White walls, black tiles and stepped gable walls mark it, so the word must mean Huizhou architecture.
火炕/1 | 东北冬天农村睡 | Many rural families in the cold northeast sleep on heated beds, so the word must mean kang.
土坯/1 | 以前村里房子用它盖 | Village houses used to be built of sun-dried mud bricks, so the word must mean mud brick.
村寨/1 | 苗族一千多户在山坡 | Over a thousand Miao families live on the hillside, so the word must mean stockaded village.
天坛/1 | 祈年殿蓝色琉璃瓦 | Its Hall of Prayer is round with blue glazed tiles, so the word must mean Temple of Heaven.
祭坛/1 | 摆放祭品祭祀天地 | The ancients set out offerings on it to honour heaven and earth, so the word must mean altar.
殿堂/1 | 终于走进艺术的 | After years of effort he finally entered the highest realm of art, so the word must mean palace hall.
佛塔/1 | 大雁塔一千多年 | The Big Wild Goose Pagoda in Xi'an is over a thousand years old, so the word must mean Buddhist pagoda.
角楼/1 | 故宫城墙四个角上 | Each corner of the Forbidden City's wall has an exquisite tower, so the word must mean corner tower.
亭台楼阁/1 | 园子里小桥流水 | The garden has pavilions, towers, small bridges and streams, so the word must mean pavilions, terraces and towers.
巍峨/1 | 抬头看到宫殿 | The palace towers above the foot of the hill, so the word must mean lofty.
矗立/1 | 高楼在江边 | Tall buildings rise along the river, so the word must mean to tower.
古建筑/1 | 明清时期的 | The city has kept many Ming and Qing buildings, so the word must mean ancient architecture.
峨眉山/1 | 四川山上古老寺庙 | The mountain in Sichuan has many ancient temples, so the word must mean Mount Emei.
苏州园林/1 | 面积不大假山水池样样有 | They are small but have rockeries, ponds, flowers and trees, so the word must mean classical gardens of Suzhou.
曲径通幽/1 | 小路绕过假山通向竹林 | The path winds round the rockery into a bamboo grove, so the word must mean a winding path to a secluded spot.
借景/1 | 远处的山和塔变成园景 | The garden makes distant hills and pagodas part of its view, so the word must mean borrowed view.
草坪/1 | 请爱护不要踩 | Please do not walk on the grass, so the word must mean lawn.
花坛/1 | 广场中央圆形开满花 | A round bed full of flowers sits in the middle of the square, so the word must mean flower bed.
人工湖/1 | 十年前挖的 | The lake in the park was dug ten years ago, so the word must mean man-made lake.
湿地公园/1 | 水鸟多观鸟好地方 | It has many waterbirds and is good for birdwatching, so the word must mean wetland park.
口袋公园/1 | 街角空地老人去坐坐 | The empty corner lot became a tiny park where old people sit, so the word must mean pocket park.
喷泉/1 | 随音乐喷出水柱 | Water shoots high on the square in time with music, so the word must mean fountain.
观景台/1 | 山顶看整座城市 | The whole city can be seen from the mountain top, so the word must mean observation deck.
哥特式/1 | 巴黎圣母院 | Notre-Dame de Paris is a model of this style, so the word must mean Gothic.
巴洛克/1 | 装饰华丽曲线雕刻多 | This richly decorated style has many curves and carvings, so the word must mean Baroque.
罗马式/1 | 教堂墙厚窗小 | Churches in this style have thick walls and small windows, so the word must mean Romanesque.
现代主义/1 | 二十世纪反对多余装饰 | Twentieth-century buildings in this style reject extra decoration, so the word must mean modernism.
极简/1 | 公寓除床和桌子几乎没有 | The flat has little more than a bed and a table, so the word must mean minimalist.
地中海风格/1 | 白墙配蓝色门窗 | The hotel has white walls with blue doors and windows, so the word must mean Mediterranean style.
新中式/1 | 有传统味道又舒适 | The decoration has a traditional feel and is very comfortable, so the word must mean modern Chinese style.
尖顶/1 | 教堂高高伸向天空 | The church's spire points high into the sky, so the word must mean spire.
圆顶/1 | 罗马万神殿近两千年 | The Pantheon's dome is nearly two thousand years old, so the word must mean dome.
传统建筑/1 | 村子没有一座高楼 | The village still has no tall buildings at all, so the word must mean traditional architecture.
砖木结构/1 | 墙是砖屋顶是木头 | The walls are brick and the roof is wood, so the word must mean brick-and-wood structure.
框架结构/1 | 墙只起分隔作用 | In most tall buildings today the walls only divide rooms, so the word must mean frame structure.
钢筋混凝土/1 | 大桥非常坚固 | The bridge is built of a very strong material, so the word must mean reinforced concrete.
承重墙/1 | 装修不能随便拆 | Removing it during renovation endangers the building, so the word must mean load-bearing wall.
打地基/1 | 盖高楼首先要 | A tall building needs a firm base first, so the word must mean to lay a foundation.
夯土/1 | 长城有些地方用它筑成 | Parts of the Great Wall are made of rammed earth, so the word must mean rammed earth.
夯实/1 | 学外语要先打牢基础 | Language learners must lay a firm foundation first, so the word must mean to tamp down.
青砖/1 | 老胡同灰色的 | Many houses in Beijing's old hutongs are built of grey bricks, so the word must mean blue-grey brick.
红砖/1 | 老教学楼远看一片红 | The old teaching building looks all red from afar, so the word must mean red brick.
砾石/1 | 小路上走起来沙沙响 | The park path crunches underfoot, so the word must mean gravel.
建筑工地/1 | 不戴安全帽不能进 | Nobody without a hard hat may go in, so the word must mean construction site.
毛坯房/1 | 墙上什么也没有要装修 | The walls are bare and must be finished by the owners, so the word must mean unfurnished shell.
精装修/1 | 买了家具就能住 | The flat is ready to move into once furniture is bought, so the word must mean fully finished.
防水/1 | 卫生间不然楼下漏水 | The bathroom floor must be sealed or water leaks downstairs, so the word must mean waterproof.
隔音/1 | 邻居说话都能听见 | Neighbours' voices can be heard through the walls, so the word must mean sound insulation.
采光/1 | 朝南白天不用开灯 | The south-facing flat needs no lights by day, so the word must mean lighting.
塌方/1 | 大雨后山路车不能过 | After heavy rain the mountain road is blocked to traffic, so the word must mean cave-in.
倒塌/1 | 老房子年久失修 | The neglected old house suddenly fell down, so the word must mean to collapse.
塌陷/1 | 路面下沉半米 | Rain washed away the soil underneath and the road sank half a metre, so the word must mean to subside.
建筑面积/1 | 一百平方米实际使用小一些 | The flat is a hundred square metres and the usable area is smaller, so the word must mean gross floor area.
户型/1 | 买房还要看 | When buying a flat, the layout matters as well as the price, so the word must mean floor plan.
两室一厅/1 | 一家三口住 | The family of three lives in a flat with two bedrooms and a living room, so the word must mean two-bedroom flat.
主卧/1 | 最大带卫生间爸妈住 | The parents have the biggest bedroom with its own bathroom, so the word must mean master bedroom.
次卧/1 | 比爸妈的房间小一点 | The speaker's room is a bit smaller than the parents', so the word must mean second bedroom.
阳台/1 | 奶奶在上面种花 | Grandma grows many flowers out there, so the word must mean balcony.
飘窗/1 | 坐在上面看书 | She likes to sit reading in the window seat, so the word must mean bay window.
储藏室/1 | 不常用的东西放在里面 | Things rarely used are kept there, so the word must mean storage room.
地下室/1 | 以前停自行车 | Bicycles used to be parked below ground in the building, so the word must mean basement.
层高/1 | 三米比一般房子高 | The ceilings are three metres high, so the word must mean storey height.
复式/1 | 客厅在楼下卧室在楼上 | The living room is downstairs and the bedrooms upstairs, so the word must mean duplex.
橱柜/1 | 厨房里摆满碗盘 | Bowls and plates fill the kitchen cupboards, so the word must mean kitchen cabinet.
衣橱/1 | 冬衣叠好放进 | She folded her winter clothes and put them away, so the word must mean wardrobe.
书橱/1 | 爷爷放满书 | Grandpa's is full of books of every kind, so the word must mean bookcase.
橱窗/1 | 商店摆着新款衣服 | New clothes on display attract passers-by, so the word must mean display window.
地毯/1 | 光脚走在上面舒服 | It is thick and comfortable to walk on barefoot, so the word must mean carpet.
挂毯/1 | 墙上织着雪山草原 | The one on the wall shows snowy mountains and grassland, so the word must mean tapestry.
狭窄/1 | 老城区两辆车难同时过 | Two cars can hardly pass each other in the old streets, so the word must mean narrow.
窄小/1 | 屋子只能放一张床 | Their room holds only one bed, so the word must mean small and narrow.
地窖/1 | 北方农民放白菜土豆 | Northern farmers store cabbages and potatoes underground in winter, so the word must mean cellar.
被窝/1 | 冬天早上不想出来 | On winter mornings he does not want to get out of bed, so the word must mean quilt.
摩天大楼/1 | 哈利法塔世界最高 | The Burj Khalifa is the tallest in the world, so the word must mean skyscraper.
地标建筑/1 | 东方明珠塔 | The Oriental Pearl Tower is one of Shanghai's, so the word must mean landmark building.
天际线/1 | 江边高楼亮灯很美 | At night the lit-up towers along the river look beautiful against the sky, so the word must mean skyline.
超高层/1 | 超过一百米的楼房 | Buildings over a hundred metres tall are called this, so the word must mean high-rise.
电梯房/1 | 爷爷爬楼梯困难搬进 | Grandpa moved because stairs had become hard for him, so the word must mean flat with a lift.
顶层/1 | 夏天屋里特别热 | He lives on the top floor and it gets very hot in summer, so the word must mean top floor.
底层/1 | 楼下是商店 | Shops are on the ground floor and homes above, so the word must mean ground floor.
别墅/1 | 海边周末度假 | They bought a house by the sea for weekend holidays, so the word must mean villa.
轮廓/1 | 远处山模糊的一个 | At dusk only the faint shape of distant hills can be seen, so the word must mean outline.
观光塔/1 | 广州塔四百多米看城市 | Visitors ride a lift to over four hundred metres to look over Guangzhou, so the word must mean sightseeing tower.
城市规划/1 | 居民上班上学买东西方便 | Good planning makes work, school and shopping easy, so the word must mean city planning.
总体规划/1 | 老城区不能再建高楼 | Under the city's plan no more tall buildings may go up in the old town, so the word must mean master plan.
布局/1 | 每栋楼都能晒到太阳 | Every building in the estate gets sunshine, so the word must mean arrangement.
功能区/1 | 住人办公工厂分开 | Parts of the city are for homes, offices or factories, so the word must mean functional zone.
商业区/1 | 商场饭店一家挨一家 | Shops and restaurants line the city centre, so the word must mean commercial district.
住宅区/1 | 工厂不能建在旁边 | Factories must not be built near homes because of noise, so the word must mean residential area.
工业区/1 | 建在下风减少污染 | Factories are usually downwind to reduce pollution for residents, so the word must mean industrial zone.
开发区/1 | 农田变成建了很多工厂 | Farmland ten years ago now has many factories, so the word must mean development zone.
老城区/1 | 街道窄保留老房子 | The streets are narrow but many old houses remain, so the word must mean old city.
卫星城/1 | 减轻市中心压力 | Smaller towns were built around the big city to ease pressure on its centre, so the word must mean satellite town.
旧城改造/1 | 有价值的老建筑保留 | Valuable old buildings should be kept during renovation of the old town, so the word must mean redevelopment of old districts.
城市更新/1 | 老工厂变成艺术区 | The old factory has become an arts district, so the word must mean urban regeneration.
棚户区/1 | 改造后变成整齐小区 | The old shanty area became a tidy estate, so the word must mean shanty town.
安置房/1 | 拆迁居民搬进 | Residents moved into government-built homes after demolition, so the word must mean resettlement housing.
保障房/1 | 低价租给收入不高的家庭 | Low-income families rent government flats cheaply, so the word must mean social housing.
容积率/1 | 楼和楼之间空地大 | There is plenty of open space between the buildings, so the word must mean floor area ratio.
绿化率/1 | 百分之四十树和草地 | Forty per cent of the estate is covered by trees and grass, so the word must mean greening rate.
人口密度/1 | 澳门世界最大之一 | Macau is among the most crowded places in the world, so the word must mean population density.
宜居城市/1 | 空气好交通方便 | The city has good air and easy transport, so the word must mean liveable city.
智慧城市/1 | 红绿灯根据车流调整 | Traffic lights adjust their timing to traffic automatically, so the word must mean smart city.
主干道/1 | 八条车道车流不断 | The road has eight lanes and constant traffic, so the word must mean arterial road.
支路/1 | 大路堵车走旁边的 | You can take a side road when the main one is jammed, so the word must mean branch road.
环线/1 | 北京二环三环 | Beijing's Second and Third Ring Roads circle the centre, so the word must mean ring road.
高架桥/1 | 汽车在上面下面也通车 | Cars drive on it while the road below runs as usual, so the word must mean viaduct.
交通枢纽/1 | 地铁公交长途车都停 | Metro, buses and coaches all stop at the station, so the word must mean transport hub.
岔路口/1 | 不知往左还是往右 | He could not decide whether to go left or right, so the word must mean road junction.
斑马线/1 | 过马路要走 | Cross the road at the striped crossing and watch the lights, so the word must mean zebra crossing.
停车场/1 | 商场地下停一千辆车 | The mall has room underground for a thousand cars, so the word must mean car park.
步行街/1 | 不许汽车通行游客放心走 | No cars are allowed and visitors walk freely, so the word must mean pedestrian street.
死胡同/1 | 走进去只好退回来 | They had to turn back the way they came, so the word must mean blind alley.
公共设施/1 | 公园长椅路灯大家爱护 | Park benches and street lights belong to everyone, so the word must mean public facilities.
无障碍设施/1 | 坡道盲道带扶手的厕所 | Ramps, tactile paths and toilets with handrails are examples, so the word must mean barrier-free facilities.
消防栓/1 | 路边红色的不能在前面停车 | The red post by the road is for fighting fires, so the word must mean fire hydrant.
坡道/1 | 坐轮椅的人也能进 | Wheelchair users can now get into the building, so the word must mean ramp.
消防通道/1 | 不能停车否则消防车进不来 | Parked cars would block fire engines, so the word must mean fire escape route.
应急避难所/1 | 地震后居民转移到 | Residents moved to it after the earthquake, so the word must mean emergency shelter.
停机坪/1 | 医院楼顶直升机送病人 | Helicopters can land on the hospital roof, so the word must mean helipad.
污水处理厂/1 | 脏水变干净才流进河里 | Dirty water is cleaned before it flows into the river, so the word must mean sewage treatment plant.
井盖/1 | 不见了留下危险的洞 | It is missing and leaves a dangerous hole in the road, so the word must mean manhole cover.
社区中心/1 | 有图书室健身房老人活动室 | It has a reading room, a gym and a room for the elderly, so the word must mean community centre.
蜡烛/1 | 停电了妈妈点起一支 | Mother lights one during the power cut, so the word must mean candle.
蜡笔/1 | 弟弟画太阳和小房子 | The little brother drew a sun and a house in colour, so the word must mean crayon.
蜡像/1 | 和真人一模一样 | The museum figures look exactly like real people, so the word must mean waxwork.
石蜡/1 | 现在很多蜡烛用它做 | Many candles today are made from it instead of beeswax, so the word must mean paraffin.
蜂蜡/1 | 蜜蜂造六边形小格子 | Bees build hexagonal cells from it to store honey, so the word must mean beeswax.
打蜡/1 | 木地板又亮又滑 | The wooden floor shines and is slippery afterwards, so the word must mean to wax.
蜡黄/1 | 病了好几天脸色 | He has been ill for days and looks unwell, so the word must mean waxy yellow.
烛光/1 | 生日蛋糕上照着笑脸 | The candles on the birthday cake light up everyone's smiles, so the word must mean candlelight.
烛台/1 | 铜做的插着三支蜡烛 | A brass holder with three candles stands on the table, so the word must mean candleholder.
蜡染/1 | 去掉蜡布上出现白色花纹 | Some Guizhou peoples remove the wax after dyeing to leave white patterns, so the word must mean batik.
扎染/1 | 用线缠紧染出一圈圈白花纹 | Parts of the cloth are bound tightly with thread before dyeing to leave white rings, so the word must mean tie-dyeing.
印染/1 | 在布上印出十几种颜色 | The factory prints patterns of a dozen colours on cloth, so the word must mean printing and dyeing.
染坊/1 | 河边晒满刚染好的蓝布 | Freshly dyed blue cloth used to hang drying by the river, so the word must mean dyeworks.
染料/1 | 古人用植物根和叶子做 | The ancients used plant roots and leaves to colour cloth blue and red, so the word must mean dyestuff.
染色/1 | 羊毛洗干净再上颜色 | The wool is washed and coloured before being knitted into jumpers, so the word must mean to dye.
蓝印花布/1 | 蓝底白花做头巾 | Old people in the southern water towns wear blue cloth with white flowers, so the word must mean blue printed cloth.
浸泡/1 | 染布前在清水里放一夜 | Before dyeing, the cloth is left in clean water overnight, so the word must mean to soak.
浸透/1 | 大雨让衬衫都湿了 | Even the shirt under his clothes was wet from the heavy rain, so the word must mean to drench.
布料/1 | 又软又透气做夏衣 | This soft, airy material suits summer clothes, so the word must mean cloth.
碎布/1 | 奶奶拼成一条被子 | Grandma sewed the leftover scraps into a pretty quilt, so the word must mean rags.
包扎/1 | 手划破校医消毒 | The school nurse cleaned and dressed his cut hand, so the word must mean to dress a wound.
扎针/1 | 中医在腿上治疗 | After weeks of acupuncture on his leg, the pain went away, so the word must mean to give acupuncture.
扎根/1 | 小树在山坡上长得越来越高 | The young trees have taken hold on the hillside and keep growing, so the word must mean to take root.
扎实/1 | 基础好学新知识快 | He learns new things quickly thanks to a solid grounding, so the word must mean solid.
扎营/1 | 天黑登山队在山脚 | Night was falling and the climbers camped at the foot of the mountain, so the word must mean to camp.
挣扎/1 | 小鸟被网缠住拼命 | The little bird is caught in a net and fighting hard, so the word must mean to struggle.
包裹/1 | 快递员送来家乡特产 | The courier brought Grandma's local specialities, so the word must mean package.
裹足不前/1 | 遇到困难就停下 | Stopping at the first difficulty never leads to success, so the word must mean to hold back.
沉浸/1 | 节日晚上大家在快乐中 | On the festival night everyone is lost in happiness, so the word must mean to be immersed.
浸湿/1 | 跑完步头发被汗水 | After his run his hair was wet with sweat, so the word must mean to wet.
葫芦/1 | 切成两半做水瓢 | The old man cut a dried gourd in half to make two ladles, so the word must mean gourd.
糖葫芦/1 | 冬天北京街头的小摊 | Stalls sell candied fruit on sticks in Beijing streets in winter, so the word must mean candied fruit on a stick.
葫芦丝/1 | 吹云南民歌声音柔和 | She played a Yunnan folk song on a soft-sounding wind instrument, so the word must mean hulusi.
芦花/1 | 秋天河边白茫茫一片 | In autumn the riverbank is white with reed flowers, so the word must mean reed catkins.
藤编/1 | 篮子椅子又轻又结实 | Baskets and chairs woven from plant canes are light and strong, so the word must mean rattan weaving.
藤椅/1 | 爷爷坐在上面乘凉 | Grandpa likes to sit in the cane chair in the yard on summer days, so the word must mean cane chair.
藤条/1 | 泡软弯成各种形状 | Workers soak the canes until they can be bent into shapes, so the word must mean rattan.
竹编/1 | 竹篮竹席竹灯笼 | The town is famous for baskets, mats and lanterns woven of bamboo, so the word must mean bamboo weaving.
草编/1 | 麦子茎编草帽草鞋 | Farmers weave straw hats and sandals from dried wheat stalks, so the word must mean straw plaiting.
顺藤摸瓜/1 | 警察找到丢失的自行车 | Following the clues, the police soon found the lost bicycle, so the word must mean to follow clues.
雨伞/1 | 下午有雨出门带 | The forecast says rain this afternoon, so the word must mean umbrella.
油纸伞/1 | 纸做刷了桐油 | Its paper cover is brushed with tung oil against rain, so the word must mean oiled paper umbrella.
降落伞/1 | 飞行员安全落地 | The pilot landed safely on the ground, so the word must mean parachute.
遮阳伞/1 | 沙滩上彩色的 | Colourful ones stand all over the beach, so the word must mean parasol.
打伞/1 | 雨不大没撑就走回家 | The rain was light and he walked home without one, so the word must mean to put up an umbrella.
丝绵/1 | 被子又轻又暖和 | The quilt is light and warm, so the word must mean silk wadding.
绵羊/1 | 草原上低头吃草像白云 | A flock grazing on the grassland looks like a white cloud, so the word must mean sheep.
连绵/1 | 南方春天阴雨不断 | In spring the south often goes days without sun under steady rain, so the word must mean unbroken.
海绵/1 | 能吸很多水擦桌子 | It soaks up a lot of water and dries the table quickly, so the word must mean sponge.
绵软/1 | 棉花糖又白又 | Fresh candyfloss is white and fluffy like a cloud, so the word must mean soft.
盒子/1 | 爷爷做的木头装玩具 | Grandpa made a wooden one to hold the speaker's toys, so the word must mean box.
饭盒/1 | 中午打开有米饭和菜 | At noon he opened it to find rice and two dishes, so the word must mean lunch box.
礼盒/1 | 中秋装着月饼的 | Before Mid-Autumn, shops are full of mooncakes packed in them, so the word must mean gift box.
铅笔盒/1 | 放铅笔橡皮和尺子 | It holds pencils, a rubber and a ruler, so the word must mean pencil box.
首饰盒/1 | 项链耳环放进去 | Mother put her necklace and earrings into it, so the word must mean jewellery box.
纸浆/1 | 木头打碎煮烂做纸 | Paper mills break down and boil wood to make paper, so the word must mean paper pulp.
豆浆/1 | 早饭喝一杯配油条 | For breakfast he had a hot drink and two fried dough sticks, so the word must mean soybean milk.
泥浆/1 | 雨后工地鞋子陷进去 | After heavy rain the building site is deep in mud, so the word must mean slurry.
糖浆/1 | 医生开一瓶止咳 | The doctor gave him a bottle for his cough, so the word must mean syrup.
岩浆/1 | 火山爆发流出红色的 | Red molten rock flows out of the erupting volcano, so the word must mean magma.
枕头/1 | 太高睡得不舒服 | It is too high to sleep on comfortably, so the word must mean pillow.
枕巾/1 | 绣着花铺在枕头上 | Grandma laid an embroidered cloth over the pillow, so the word must mean pillow cover cloth.
枕套/1 | 拉开拿出枕芯 | Unzip it to take out the pillow filling to air, so the word must mean pillowcase.
瓷枕/1 | 古人夏天用很凉 | People in the past slept on cool porcelain ones in summer, so the word must mean porcelain pillow.
毛巾/1 | 游泳后擦干身上的水 | After swimming he dried himself with a big one, so the word must mean towel.
围巾/1 | 妈妈用毛线织的红色 | Mother knitted a red one for the speaker in cold weather, so the word must mean scarf.
头巾/1 | 草原风大把头包起来 | Herders' wives wrap their heads against the grassland wind, so the word must mean headscarf.
纸巾/1 | 感冒流鼻涕用完一大包 | He had a cold and used up a big pack blowing his nose, so the word must mean tissue.
餐巾/1 | 西餐厅铺在腿上 | At a Western restaurant you lay it across your lap, so the word must mean napkin.
丝巾/1 | 真丝织的又薄又滑 | It is woven of pure silk and is thin and smooth, so the word must mean silk scarf.
串门/1 | 过年邻居互相拜年 | At New Year, neighbours visit one another to give greetings, so the word must mean to visit neighbours.
串珠/1 | 彩色珠子做手链 | The little girl made a bracelet from coloured beads, so the word must mean strung beads.
羊肉串/1 | 新疆烤的又香又嫩 | Xinjiang's grilled lamb skewers are famous, so the word must mean mutton skewer.
串联/1 | 两个灯泡接在电池上 | In physics class two small bulbs are connected one after the other to a battery, so the word must mean to connect in series.
一连串/1 | 丢钱包又错过火车 | He lost his wallet and then missed his train, so the word must mean a series of.
水瓢/1 | 从水缸里取水浇花 | Grandma scooped water from the vat to water the flowers, so the word must mean gourd ladle.
瓢虫/1 | 背上有七个黑点 | A red beetle with seven black spots sits on a leaf, so the word must mean ladybird.
棕色/1 | 小熊的毛 | The little bear's fur is soft and brown, so the word must mean brown.
棕绳/1 | 渔民把小船系在岸边 | Fishermen tie their boats to the shore with strong rope, so the word must mean palm-fibre rope.
棕编/1 | 棕树嫩叶编小鸟小虫 | Little birds and insects woven of palm leaves are famous in Sichuan, so the word must mean palm-leaf craft.
抹布/1 | 吃完饭擦桌子 | After the meal he wiped the table clean, so the word must mean rag.
涂抹/1 | 脸上擦防晒霜 | Before going out she put sunscreen on her face, so the word must mean to smear.
抹去/1 | 悄悄擦掉泪水 | He quietly wiped away his tears and smiled again, so the word must mean to wipe away.
抹杀/1 | 一次失败不能否定努力 | One failure cannot erase years of effort, so the word must mean to obliterate.
夹子/1 | 风大把衣服夹在绳子上 | Mother pegs the washing to the line in the strong wind, so the word must mean clip.
文件夹/1 | 合同放进蓝色的 | He keeps all the contracts in a blue one, so the word must mean folder.
夹心/1 | 饼干中间有巧克力 | The biscuits have a layer of chocolate in the middle, so the word must mean with filling.
发夹/1 | 头上蝴蝶形状的 | She wears a butterfly-shaped one in her hair, so the word must mean hairpin.
夹杂/1 | 普通话里有家乡话 | His Mandarin is mixed with words from his home dialect, so the word must mean to be mixed with.
夹缝/1 | 小草从石头里长出来 | Some grass grows out of the cracks between the stones, so the word must mean crevice.
轿子/1 | 古时当官的出门坐 | In old times officials were carried about in them, so the word must mean sedan chair.
花轿/1 | 新娘坐着到新郎家 | By old custom the bride was carried to the groom's home, so the word must mean bridal sedan chair.
抬轿/1 | 走得又稳又快 | Those carrying the chair walked fast and smoothly, so the word must mean to carry a sedan chair.
掀开/1 | 锅盖香味扑面而来 | He lifted the pot lid and a delicious smell came out, so the word must mean to lift.
掀起/1 | 电影带来学书法热潮 | The film set off a wave of calligraphy learning across the country, so the word must mean to set off.
婚俗/1 | 各地结婚的讲究不同 | Wedding dates, clothes and feasts differ from place to place, so the word must mean marriage customs.
寿面/1 | 爷爷八十岁吃长长的 | On Grandpa's eightieth birthday the family ate long noodles with him, so the word must mean birthday noodles.
抓周/1 | 一岁生日抓了毛笔 | At his first birthday the baby grabbed a brush from a pile of objects, so the word must mean first birthday object-grabbing.
做寿/1 | 奶奶七十岁全家准备 | The family is preparing Grandma's seventieth birthday, so the word must mean to celebrate an elder's birthday.
寿桃/1 | 祝寿桌上用面做的 | Peach-shaped buns are set out when wishing an elder long life, so the word must mean birthday peach bun.
蒲扇/1 | 夏夜爷爷摇着讲故事 | Grandpa waves a fan while telling stories on summer evenings, so the word must mean cattail fan.
蒲公英/1 | 一吹种子就飞走 | One gentle breath blows its seeds away, so the word must mean dandelion.
蒲团/1 | 寺庙地上圆圆的 | Round cushions lie on the temple floor, so the word must mean prayer cushion.
凳子/1 | 踩着放书到最上面 | He stood on a stool to put the book on the top shelf, so the word must mean stool.
坐冷板凳/1 | 一个赛季一场没上 | He did not play a single match all season, so the word must mean to be benched.
桐油/1 | 木船涂上不怕水泡 | A coat of this oil keeps wooden boats from rotting, so the word must mean tung oil.
泡桐/1 | 长得快木头轻 | Villagers plant this fast-growing tree with light wood near houses, so the word must mean paulownia.
油桐/1 | 四月开白花种子能榨油 | Its seeds yield oil and its white flowers fill the hills in April, so the word must mean tung tree.
酿造/1 | 传统方法做酱油晒一年 | The factory makes soy sauce the traditional way over a year, so the word must mean to brew.
酿蜜/1 | 蜜蜂忙着采花 | In spring bees busily gather nectar from the rape flowers, so the word must mean to make honey.
牡丹/1 | 洛阳四月很多人去看 | Luoyang's flowers draw crowds every April, so the word must mean peony.
丹顶鹤/1 | 头顶红色象征长寿 | This bird with a red crown stands for long life, so the word must mean red-crowned crane.
丹青/1 | 老画家一生爱好 | The old artist has loved painting landscapes and birds all his life, so the word must mean painting.
泼墨/1 | 几笔画出烟雨远山 | With a few broad strokes of ink he paints distant hills in misty rain, so the word must mean splash-ink painting.
活泼/1 | 小猫好像要跳下来 | The kittens in the painting look ready to jump off the paper, so the word must mean lively.
文房四宝/1 | 毛笔墨宣纸 | The brush, ink and xuan paper belong to the scholar's set, so the word must mean four treasures of the study.
雕版/1 | 唐代把字刻在木板上印书 | Tang printers carved characters on wooden blocks and then printed them, so the word must mean block printing.
活字/1 | 北宋一个字用很多次 | In the Northern Song each character could be used many times, so the word must mean movable type.
刻刀/1 | 在木板上刻出花纹 | The master cuts patterns into the wood bit by bit, so the word must mean graver.
剪影/1 | 照侧脸用黑纸剪出 | The artist cut the speaker's profile from black paper, so the word must mean silhouette.
端午/1 | 五月初五吃粽子 | People eat zongzi on the fifth of the fifth lunar month, so the word must mean Duanwu.
重阳/1 | 九月初九登高看老人 | On the ninth of the ninth lunar month people climb hills and visit elders, so the word must mean Chongyang.
清明/1 | 回老家扫墓 | Around this festival many people sweep their ancestors' graves, so the word must mean Tomb-Sweeping Day.
踏青/1 | 春天去郊外看桃花 | In spring the family goes out of town and sees hills of peach blossom, so the word must mean to go for a spring walk.
汤圆/1 | 元宵节晚上全家吃 | The family eats them on the night of the Lantern Festival, so the word must mean tangyuan.
花灯/1 | 元宵节街上挂满 | All kinds hang in the streets on the Lantern Festival night, so the word must mean festive lantern.
猜灯谜/1 | 公园里猜对有奖品 | Small prizes go to those who solve the riddles in the park at the Lantern Festival, so the word must mean to guess lantern riddles.
赛龙舟/1 | 端午节江上两岸观众 | Crowds line the river every Dragon Boat Festival, so the word must mean to race dragon boats.
赏月/1 | 中秋吃月饼 | The family eats mooncakes in the yard on Mid-Autumn night, so the word must mean to admire the moon.
泼水节/1 | 西双版纳四月互相祝福 | In mid-April people in Xishuangbanna splash each other as a blessing, so the word must mean Water-Splashing Festival.
小年/1 | 腊月二十三开始准备过年 | In the north the twenty-third of the twelfth month starts New Year preparations, so the word must mean Little New Year.
祭灶/1 | 请灶王上天说好话 | People asked the kitchen god to speak well of them in heaven, so the word must mean to worship the Kitchen God.
年货/1 | 春节前超市挤满人 | Before Spring Festival supermarkets are packed with festive shoppers, so the word must mean Spring Festival shopping.
办年货/1 | 离春节一星期妈妈忙着 | A week before Spring Festival Mother is busy shopping for it, so the word must mean to do Spring Festival shopping.
贴春联/1 | 除夕上午在大门两边 | On New Year's Eve morning Dad and the speaker put up couplets by the door, so the word must mean to put up spring couplets.
团圆饭/1 | 全家人一起吃一顿 | The brother working away came home and the whole family ate together, so the word must mean family reunion dinner.
门神/1 | 大门上贴两张希望平安 | Some families paste two guardian figures on the door for safety, so the word must mean door god.
福字/1 | 倒着贴意思福到了 | People paste it upside down to say good fortune has arrived, so the word must mean the character for good fortune.
瑞雪/1 | 兆丰年 | Farmers say heavy winter snow foretells a good harvest, so the word must mean auspicious snow.
碎碎平安/1 | 过年打破碗奶奶笑着说 | Grandma laughs it off when a bowl breaks at New Year, so the word must mean broken pieces bring peace.
泥人/1 | 天津姓张的艺人捏的 | A Tianjin artist named Zhang shaped lifelike clay figures, so the word must mean clay figurine.
糖人/1 | 把糖吹成小动物 | Children love the little animals the old artist blows from hot sugar, so the word must mean blown-sugar figure.
糖画/1 | 糖倒在石板上画一条龙 | The old man pours melted sugar on a stone slab to draw a dragon, so the word must mean sugar painting.
面塑/1 | 彩色面团捏孙悟空 | The artist shapes a Monkey King from coloured dough in minutes, so the word must mean dough figurine.
唐三彩/1 | 唐代黄绿白陶器 | Tang pottery is mostly in yellow, green and white, so the word must mean tricolour glazed pottery.
紫砂壶/1 | 宜兴泡茶茶香不散 | Teapots from Yixing keep the tea's fragrance, so the word must mean purple clay teapot.
抖空竹/1 | 公园里老人转得飞快 | Old people spin humming diabolos in the park, so the word must mean to play diabolo.
景泰蓝/1 | 北京工艺品多用蓝色 | The famous Beijing craft is mostly blue, which gives its name, so the word must mean cloisonne.
苏绣/1 | 苏州刺绣两面都能看 | Suzhou embroidery has fine stitches and some pieces can be viewed from both sides, so the word must mean Su embroidery.
云锦/1 | 南京为皇宫织造 | Nanjing's colourful brocade was woven for the palace, so the word must mean Yunjin brocade.
拼搏/1 | 运动员顽强争荣誉 | The athletes fought hard and won honour for the country, so the word must mean to struggle hard.
搏斗/1 | 渔民和大风大浪一整夜 | Fishermen fought wind and waves all night before reaching port, so the word must mean to wrestle.
搏击/1 | 每周学两次身体结实 | He takes fighting lessons twice a week and grows stronger, so the word must mean fighting.
脉搏/1 | 跑完步每分钟一百多次 | After running his pulse beats over a hundred a minute, so the word must mean pulse.
奔驰/1 | 马在草原上扬起尘土 | Horses gallop across the grassland raising dust, so the word must mean to gallop.
驰名/1 | 景德镇瓷器中外 | Jingdezhen porcelain is famous at home and abroad, so the word must mean renowned.
背道而驰/1 | 要减肥却吃很多甜食 | He says he wants to slim but eats lots of sweets every day, so the word must mean to run counter to.
凯旋/1 | 冠军队员归来 | Many people met the champions at the airport on their return, so the word must mean to return in triumph.
凯歌/1 | 球队一路高奏打进决赛 | The team won match after match on the way to the final, so the word must mean triumphal song.
夺冠/1 | 年轻球队终于 | After a year of effort the young team finally won the title, so the word must mean to win the championship.
胳膊/1 | 举哑铃一小时酸了 | After lifting dumbbells for an hour his arms ache, so the word must mean arm.
脖子/1 | 长颈鹿的很长 | Giraffes can reach high leaves, so the word must mean neck.
大拇指/1 | 大家向他竖起 | Everyone gave him a thumbs-up for his performance, so the word must mean thumb.
身躯/1 | 拖着疲倦的走回家 | He dragged his tired body slowly home, so the word must mean frame.
躯干/1 | 头和四肢之外的部分 | The body has a head, this part and the four limbs, so the word must mean torso.
手掌/1 | 把小石子放在上面 | He held a small stone out flat to show everyone, so the word must mean palm.
腹肌/1 | 做仰卧起坐练出来 | Daily sit-ups gave him strong stomach muscles, so the word must mean abs.
韧带/1 | 踢球拉伤膝盖的 | He strained his knee playing football and must rest a month, so the word must mean ligament.
脚尖/1 | 跳芭蕾用它站立 | Ballet dancers often stand on the tips of their toes, so the word must mean tiptoe.
脚跟/1 | 刚到新公司还没站稳 | He is new at the company and acts carefully, so the word must mean heel.
憋气/1 | 在水下两分钟 | He can hold his breath underwater for two minutes, so the word must mean to hold one's breath.
蹬腿/1 | 学蛙泳先收腿再向后 | In breaststroke you draw your legs in and then kick back hard, so the word must mean to kick out.
俯身/1 | 把地上的球拿起来 | He bent down to pick up the ball and threw it to a teammate, so the word must mean to bend over.
跪下/1 | 老师单膝和孩子一样高 | The teacher went down on one knee to be as tall as the child, so the word must mean to kneel.
踢腿/1 | 武术课向前踢得又高又直 | The martial arts class kick forward high and straight together, so the word must mean to kick.
压腿/1 | 把腿放在栏杆上 | Before dancing she stretches her leg on the barre, so the word must mean to stretch one's legs.
翻跟头/1 | 杂技演员连着翻 | The acrobat turns somersault after somersault to applause, so the word must mean to turn somersaults.
倒立/1 | 双手撑地两腿笔直 | He stands on his hands with his legs straight up, so the word must mean handstand.
绊倒/1 | 跑太快被石头 | Running too fast, he tripped on a stone, so the word must mean to trip.
竖起/1 | 小狗听到声音耳朵 | The puppy pricked up its ears at a strange sound, so the word must mean to prick up.
木棍/1 | 爷爷走山路拿着 | Grandpa always carries a stick on mountain paths, so the word must mean wooden stick.
竹竿/1 | 院子里挂衣服晒 | Grandma hangs the washing on a long pole in the yard, so the word must mean bamboo pole.
钓竿/1 | 湖边钓了三条鱼 | He caught three fish by the lake in a morning, so the word must mean fishing rod.
撑竿跳高/1 | 拿长竿跳过横杆 | Athletes run fast with a long pole and clear a high bar, so the word must mean pole vault.
立竿见影/1 | 锻炼效果要几个月 | The effects of exercise take months to show, so the word must mean instant effect.
棍术/1 | 长棍在手里转得飞快 | After three years of practice the long staff spins fast in his hands, so the word must mean cudgel play.
靶子/1 | 射箭场一圈圈彩色圆环 | Coloured rings are painted on the archery target, so the word must mean target.
靶心/1 | 一箭射中得十分 | His arrow hit the centre for ten points, so the word must mean bullseye.
打靶/1 | 军训第一次很紧张 | During military training the pupils went shooting for the first time, so the word must mean shooting practice.
射箭/1 | 拉开弓瞄准七十米外 | The archer draws the bow and aims at a target seventy metres away, so the word must mean archery.
橄榄球/1 | 椭圆形抱着跑 | The ball is oval and players may run holding it, so the word must mean rugby.
棒球/1 | 击球手用木棒打 | Popular in America and Japan, the batter hits the pitcher's ball with a bat, so the word must mean baseball.
垒球/1 | 像棒球但球大场地小 | It is like baseball with a bigger ball and smaller field, so the word must mean softball.
手球/1 | 用手传球扔进球门 | Players pass with their hands and throw the ball into the goal, so the word must mean handball.
冰球/1 | 冰上用球杆打小圆饼 | Players on skates hit a puck with sticks, so the word must mean ice hockey.
门球/1 | 退休老人在草地上打 | Retired people play it on the park lawn, so the word must mean gateball.
高尔夫/1 | 球场草地一眼望不到头 | The course is huge and the grass stretches out of sight, so the word must mean golf.
曲棍球/1 | 用一头弯曲的棍子 | Players hit the ball with sticks curved at one end, so the word must mean field hockey.
球衣/1 | 背后印着号码 | Each player's number is printed on the back, so the word must mean jersey.
俱乐部/1 | 学校足球每周练三次 | He joined the school football club and practises three times a week, so the word must mean club.
乒乓球/1 | 中国的国球 | It is called China's national ball game, so the word must mean table tennis.
球台/1 | 中间有一张网 | A net divides it in half, so the word must mean table tennis table.
发球/1 | 先把球抛起来再打 | The server tosses the ball up and then hits it, so the word must mean to serve.
接球/1 | 对方球又快又低没打过网 | The return was fast and low and he could not get it over the net, so the word must mean to receive.
横拍/1 | 握拍像跟人握手 | Players hold this kind of bat as if shaking hands, so the word must mean shakehand grip.
直拍/1 | 握拍像拿笔 | Older Chinese players hold the bat like a pen, so the word must mean penhold grip.
握拍/1 | 不能太紧手腕放松 | The coach says not to grip too tightly and keep the wrist loose, so the word must mean to hold the racket.
杀球/1 | 跳起来又快又重 | She jumped and smashed the shuttle hard into the other court, so the word must mean smash.
吊球/1 | 轻轻一打刚过网就落 | With the opponent at the back, her soft shot dropped just over the net, so the word must mean drop shot.
清脆/1 | 球打在台上的响声 | The ball makes a crisp sound on the table, so the word must mean clear and crisp.
田径/1 | 跑步跳远跳高扔铅球 | Running, jumping and shot put are all in it, so the word must mean track and field.
跨栏/1 | 一百一十米跨过十个栏架 | Runners clear ten barriers in the 110-metre race, so the word must mean hurdles.
接力赛/1 | 四人每人跑一百米 | In the 4 x 100 metres each of four runners runs a hundred metres, so the word must mean relay race.
马拉松/1 | 四十二点一九五公里 | The race is 42.195 kilometres long, so the word must mean marathon.
铅球/1 | 放在肩膀上推出去 | The ball rests on the shoulder and is pushed out hard, so the word must mean shot put.
标枪/1 | 又细又长助跑扔出 | Athletes run up and throw a long thin spear, so the word must mean javelin.
铁饼/1 | 像扁盘子转几圈扔 | Athletes spin several times before throwing a flat plate, so the word must mean discus.
投掷/1 | 铅球标枪铁饼 | Shot put, javelin and discus are all throwing events, so the word must mean throwing.
起跑线/1 | 比赛前运动员在后面准备 | The runners get ready behind it before the race, so the word must mean starting line.
终点线/1 | 第一个冲过赢冠军 | He crossed it first and won, so the word must mean finish line.
自由体操/1 | 大地毯上翻腾跳跃 | Gymnasts tumble and leap on a big mat, so the word must mean floor exercise.
吊环/1 | 抓住两个挂在空中的圆环 | Gymnasts hold two rings hanging in the air, so the word must mean still rings.
鞍马/1 | 上面有两个把手身体转动 | Gymnasts swing their bodies round on an apparatus with two handles, so the word must mean pommel horse.
跳马/1 | 助跑撑一下空中翻转 | Gymnasts sprint, push off an apparatus with their hands and flip in the air, so the word must mean vault.
平衡木/1 | 只有十厘米宽不能出错 | Gymnasts leap and flip on a beam just ten centimetres wide, so the word must mean balance beam.
俯卧撑/1 | 双手把身体撑起再放下 | He pushes his body up with his arms fifty times every morning, so the word must mean push-up.
仰卧起坐/1 | 躺在垫子上一口气三十个 | Lying on a mat he did thirty in one go, so the word must mean sit-up.
哑铃/1 | 举二十分钟手臂结实 | Lifting weights twenty minutes a day built his arms, so the word must mean dumbbell.
跑步机/1 | 下雨天在家里跑 | On rainy days he runs on a machine at home, so the word must mean treadmill.
广播体操/1 | 第二节课后全校到操场做 | The whole school exercises on the playground after the second lesson, so the word must mean radio calisthenics.
自由泳/1 | 对泳姿没有限制 | Any stroke is allowed and most swimmers choose the crawl, so the word must mean freestyle.
蛙泳/1 | 动作像青蛙 | Swimmers move like frogs, so the word must mean breaststroke.
仰泳/1 | 脸朝上游 | It is the only stroke swum face up, so the word must mean backstroke.
花样游泳/1 | 在水中跳舞 | Swimmers move gracefully to music as if dancing in the water, so the word must mean synchronised swimming.
泳池/1 | 长五十米可以正式比赛 | It is fifty metres long and fit for official races, so the word must mean swimming pool.
泳镜/1 | 戴上在水下看清楚 | With them on he can see clearly underwater, so the word must mean swimming goggles.
淋浴/1 | 游泳前冲洗干净 | Rinse your body before swimming, so the word must mean to shower.
浴巾/1 | 洗完澡擦干身上 | After his bath he dried himself with a big one, so the word must mean bath towel.
浴室/1 | 宾馆里有热水和毛巾 | The hotel's has hot water, towels and toothbrushes, so the word must mean bathroom.
海水浴/1 | 夏天在海里游泳晒太阳 | In summer many people swim and sunbathe at the seaside, so the word must mean sea bath.
冰壶/1 | 推石头队友刷冰 | Players slide stones while teammates sweep the ice ahead, so the word must mean curling.
速滑/1 | 弯着腰比谁用时少 | Skaters bend low and race to post the fastest time, so the word must mean speed skating.
花样滑冰/1 | 冰上随音乐跳跃旋转 | Skaters jump and spin to music as if dancing, so the word must mean figure skating.
冬奥会/1 | 二零二二年北京举办 | Beijing hosted the twenty-fourth one in 2022, so the word must mean Winter Olympics.
冰场/1 | 湖结了厚冰 | The frozen park lake becomes a big rink, so the word must mean skating rink.
冰刀/1 | 冰鞋下又薄又锋利 | The thin, sharp blades under skates can cut hands, so the word must mean skate blade.
冰鞋/1 | 第一次滑冰先租一双 | On his first time skating he hired a pair, so the word must mean ice skates.
滑雪场/1 | 很多雪道初学者在缓坡练 | Beginners practise on gentle slopes, so the word must mean ski resort.
跳台/1 | 十米高准备往下跳 | The diver stands ten metres up ready to jump, so the word must mean diving platform.
单板/1 | 两只脚站在一块板上 | Both feet stand on one board, so the word must mean snowboard.
摔跤/1 | 雪天路滑小心 | The snowy road is slippery and you should walk slowly, so the word must mean to fall over.
柔道/1 | 起源于日本白色蓝色衣服 | The sport began in Japan and athletes wear white or blue, so the word must mean judo.
空手道/1 | 学了五年系上黑带 | After five years of training he has earned his black belt, so the word must mean karate.
散打/1 | 中国武术发展来能用拳脚 | Fighters drawn from Chinese martial arts may punch, kick and throw, so the word must mean free combat.
格斗/1 | 拳击柔道摔跤 | Boxing, judo and wrestling are all combat sports, so the word must mean combat.
护具/1 | 保护头和膝盖 | Wear them to protect the head and knees when sparring, so the word must mean protective gear.
黑带/1 | 柔道空手道水平很高 | In judo and karate it marks a very high level, so the word must mean black belt.
扎马步/1 | 两腿分开蹲下半小时 | Martial arts learners squat with legs apart for half an hour, so the word must mean to hold a horse stance.
舞剑/1 | 剑在老人手里像银龙 | The blade flashes like a silver dragon in the old man's hand, so the word must mean to perform a sword dance.
套路/1 | 太极拳二十四个动作 | This form of taiji has twenty-four moves, so the word must mean set routine.
复赛/1 | 预赛成绩好顺利进入 | He did well in the heats and went through to the next round, so the word must mean second round.
淘汰赛/1 | 输的一方要回家 | The loser of each match goes home at this stage, so the word must mean knockout round.
小组赛/1 | 每组四队互相比一场 | The four teams in each group play one another once, so the word must mean group stage.
加时赛/1 | 九十分钟一比一 | The match was one all after ninety minutes, so the word must mean overtime.
种子选手/1 | 头号第一轮不遇强敌 | As top seed he will not meet a strong opponent in the first round, so the word must mean seeded player.
黑马/1 | 没名气的球队打进决赛 | An unknown team reached the final, so the word must mean dark horse.
爆冷/1 | 世界第一第一轮就输 | The world number one lost in the first round, so the word must mean upset.
打平/1 | 最后一比一 | After ninety minutes the score was one all, so the word must mean to draw.
反超/1 | 落后两分连进三球 | Two behind at half time, the team scored three in the second half, so the word must mean to come from behind.
绝杀/1 | 最后一秒投进三分 | His three-pointer went in with one second left, so the word must mean winning shot at the last moment.
运动会/1 | 学校秋天跑步跳远拔河 | The school holds running, long jump and tug of war every autumn, so the word must mean sports meet.
亚运会/1 | 二零一零年在广州 | The sixteenth Asian Games were held in Guangzhou in 2010, so the word must mean Asian Games.
全运会/1 | 国内水平最高各省派队 | It is China's top domestic multi-sport event, with a team from every province, so the word must mean National Games.
残奥会/1 | 残疾人运动员参加 | Athletes with disabilities compete after the Olympics, so the word must mean Paralympics.
代表团/1 | 四百多名运动员参加奥运 | China sent over four hundred athletes to the Games, so the word must mean delegation.
开幕式/1 | 各国运动员排队走进体育场 | Athletes of every country march into the stadium in line, so the word must mean opening ceremony.
闭幕式/1 | 大家依依不舍告别 | Everyone says reluctant goodbyes at the end of the games, so the word must mean closing ceremony.
圣火/1 | 在希腊点燃传到举办城市 | It is lit in Greece and carried to the host city, so the word must mean sacred flame.
奖牌榜/1 | 最后一天排第一 | On the last day the country came first in the medal table, so the word must mean medal table.
不胜枚举/1 | 奖牌奖杯数不过来 | The athlete won more medals and trophies than can be listed, so the word must mean too numerous to list.
前锋/1 | 这个赛季进了二十个球 | He has scored twenty goals this season, so the word must mean forward.
后卫/1 | 防守好对方一球未进 | The other team scored no goals against their defence, so the word must mean defender.
中锋/1 | 身高两米一篮球队的 | He is two metres ten tall and plays in the middle of the basketball team, so the word must mean centre.
扣篮/1 | 双手把球扣进篮筐 | He leapt high and slammed the ball through the hoop with both hands, so the word must mean dunk.
三分球/1 | 离篮筐很远投进 | He shot from far out and scored, so the word must mean three-point shot.
助攻/1 | 这个球是他传的 | He passed the ball for the goal, so the word must mean assist.
越位/1 | 踢进了但裁判说不算 | The referee ruled the goal out, so the word must mean offside.
角球/1 | 球被碰出了底线 | A defender knocked the ball over the goal line, so the word must mean corner kick.
头球/1 | 跳起来顶进球门 | He jumped and nodded the ball into the goal, so the word must mean header.
任意球/1 | 对方犯规一脚踢进 | After a foul he kicked the ball straight into the goal, so the word must mean free kick.
攀岩/1 | 戴安全绳在陡墙上 | He clips on a safety rope and starts up a steep wall, so the word must mean rock climbing.
蹦极/1 | 从五十米高桥上跳下 | He jumped off a fifty-metre bridge for the first time, so the word must mean bungee jumping.
越野/1 | 经过树林小河山坡 | The running route goes through woods, streams and hills, so the word must mean cross-country.
翻山越岭/1 | 登山队走了三天到山顶 | The climbers walked three days before reaching the summit, so the word must mean to cross mountains and ridges.
陡坡/1 | 骑车上不去只能推 | Cyclists must push their bikes up part of the road, so the word must mean steep slope.
分水岭/1 | 受伤后改当教练 | After that injury he became a coach, so the word must mean watershed.
跳伞/1 | 从三千米高飞机上 | He jumped from a plane at three thousand metres and fell a while before opening up, so the word must mean to parachute.
滑翔伞/1 | 背着借风飞上天 | He ran off the mountain top and rose slowly on the wind, so the word must mean paraglider.
淋湿/1 | 没带伞全身 | Caught without an umbrella in a sudden downpour, they got soaked, so the word must mean to get drenched.
白跑一趟/1 | 比赛改了时间 | At the stadium he found the match had been moved, so the word must mean to make a trip for nothing.
公告/1 | 公司网站宣布新产品 | The company announced on its website that a new product comes out next month, so the word must mean public notice.
通告/1 | 交通部门说下周禁止通行 | The transport department announced that the road closes to vehicles next week, so the word must mean circular.
启事/1 | 丢了钱包贴一张寻物 | He lost his wallet and posted a notice at the school gate, so the word must mean announcement.
失物招领/1 | 拾到手表交到 | He handed in a watch he found on the playground, so the word must mean lost property.
兹定于/1 | 本月十五日召开会议 | The notice opens by fixing a meeting for the fifteenth, so the word must mean it is hereby scheduled.
特此通知/1 | 通知正文最后写四个字 | It comes at the end of a notice after the main text, so the word must mean notice is hereby given.
届时/1 | 明天九点到时请准时集合 | The opening ceremony is at nine and pupils should gather then, so the word must mean when the time comes.
务必/1 | 请一定在周五前交 | The materials are important and must be handed in before Friday, so the word must mean must.
敬请/1 | 新年晚会请家长光临 | Parents are politely invited to the school's New Year party, so the word must mean to respectfully request.
告知/1 | 地址变了请通知我们 | Please let us know if your address changes, so the word must mean to inform.
称呼/1 | 第一行顶格写亲爱的王老师 | A letter's first line, flush left, is like "Dear Mr Wang", so the word must mean form of address.
正文/1 | 写在称呼下一行空两格 | It begins on the line after the greeting, indented two spaces, so the word must mean main text.
此致/1 | 下一行顶格写敬礼 | It comes before 敬礼 at the end of a letter, so the word must mean with this I convey.
敬上/1 | 名字后面写两个字 | He wrote these two characters after his name in a letter to his teacher, so the word must mean respectfully submitted.
附言/1 | 写完信又加一段提醒回信 | After the letter he added a few lines reminding his friend to reply, so the word must mean postscript.
收件人/1 | 快递员请他签字 | The courier asks the addressee to sign, so the word must mean recipient.
发件人/1 | 没写名字不知谁寄来 | Nobody knows who sent the letter, so the word must mean sender.
敬启者/1 | 旧式书信开头 | Old-style letters opened with words of respect to the reader, so the word must mean respectfully addressed.
邮政编码/1 | 信封左上角六个小格子 | In China it goes in the six boxes at the top left of the envelope, so the word must mean postal code.
顺颂/1 | 给长辈写信结尾安康 | Letters to elders may end with wishes for their health, so the word must mean and with best wishes.
赐教/1 | 还请先生不吝 | Meeting a famous scholar, the speaker asks for his guidance, so the word must mean to favour with instruction.
恭候/1 | 晚会在门口等各位 | The hosts wait at the door for the guests, so the word must mean to respectfully await.
光临/1 | 欢迎来本店 | Shop staff welcome a customer and ask what they need, so the word must mean presence.
惠存/1 | 送老师的书上写 | He wrote it after his teacher's name in a book he gave her, so the word must mean kindly keep.
敬赠/1 | 全体学生 | The first page shows the book is a gift from all the pupils, so the word must mean respectfully presented.
为盼/1 | 请在周五前回复 | The writer asks for a reply before Friday, so the word must mean it is hoped.
热忱/1 | 志愿者为大家服务 | The volunteers serve everyone with great enthusiasm, so the word must mean warmth.
谢忱/1 | 谨向朋友致以 | The writer thanks every friend who helped, so the word must mean heartfelt thanks.
久仰/1 | 今天终于见到您 | The speaker has heard of the person for a long time and finally meets them, so the word must mean to have long looked forward to meeting.
指正/1 | 报告不对的地方请批评 | Readers are invited to point out mistakes in the report, so the word must mean to point out errors.
感谢信/1 | 出院时给医生护士写 | After two weeks in hospital he wrote to the doctors and nurses, so the word must mean letter of thanks.
表扬信/1 | 乘客希望公司称赞司机 | The passenger wrote to the company to praise the driver who returned his wallet, so the word must mean letter of commendation.
慰问信/1 | 给灾区小朋友写 | Pupils wrote to children in the quake zone to encourage them, so the word must mean letter of sympathy.
邀请函/1 | 请家长参加毕业典礼 | Parents were each sent one asking them to the graduation, so the word must mean letter of invitation.
贺信/1 | 学校得冠军教育局发来 | The education bureau congratulated the school on winning the national contest, so the word must mean letter of congratulations.
特此证明/1 | 该生是我校三年级学生 | A school certificate ends by confirming he is a third-year pupil, so the word must mean this is to certify.
介绍信/1 | 说明这人是谁做什么 | Hotels used to need a letter from your workplace saying who you were, so the word must mean letter of introduction.
自荐信/1 | 介绍特长希望得到工作 | He wrote to the company presenting his strengths for the job, so the word must mean letter of self-recommendation.
辞职信/1 | 换工作给经理写 | He decided to change jobs and wrote to his manager, so the word must mean letter of resignation.
喜报/1 | 考上大学学校寄到家 | The school sent good news to his home when he got into university, so the word must mean announcement of good news.
唁电/1 | 很多国家科学家通过电报发来 | Scientists from many countries sent telegrams of mourning, so the word must mean telegram of condolence.
唁函/1 | 给老师家人写一封 | He wrote to his teacher's family expressing grief, so the word must mean letter of condolence.
吊唁/1 | 到老教授家安慰家人 | Many students visited the late professor's home to comfort his family, so the word must mean to offer condolences.
节哀/1 | 请你保重身体 | He tells his grieving friend to take care of himself, so the word must mean to restrain one's grief.
致哀/1 | 降半旗悼念 | Many countries flew flags at half mast, so the word must mean to pay tribute.
默哀/1 | 起立低头一分钟 | Everyone stood and bowed their heads for a minute, so the word must mean to stand in silent tribute.
瞻仰/1 | 清明到烈士陵园 | At Qingming the pupils visited the martyrs' monument, so the word must mean to look at with reverence.
肃静/1 | 阅览室不要大声 | Please do not talk loudly in the reading room, so the word must mean solemn silence.
肃然起敬/1 | 老医生在山村几十年 | The old doctor served a mountain village for decades, so the word must mean to be filled with respect.
严肃/1 | 老师表情事情很重要 | The teacher's face told everyone the matter was important, so the word must mean stern.
简报/1 | 每周简单介绍工作 | The company issues a short weekly summary of its main work, so the word must mean briefing.
述职报告/1 | 年底经理说明一年工作 | At year end every manager writes about his work over the year, so the word must mean work report.
调查报告/1 | 问了两百人关于垃圾分类 | They asked two hundred residents about rubbish sorting and wrote it up, so the word must mean investigation report.
可行性报告/1 | 分析计划能不能做成 | Experts analysed whether the new factory plan could work, so the word must mean feasibility study.
年度/1 | 回顾一年来的工作 | The summary reviews the company's work over the year, so the word must mean year.
季度/1 | 一年有四个 | The year has four of them and the first runs January to March, so the word must mean quarter.
上半年/1 | 一月到六月 | From January to June the factory built fifty thousand cars, so the word must mean first half of the year.
附表/1 | 报告后面的具体数字 | The figures are in the tables at the back of the report, so the word must mean attached table.
现将/1 | 本月工作情况报告如下 | It introduces a report on this month's work, so the word must mean we now.
总计/1 | 这个月收入三万元 | Income for the month came to thirty thousand yuan altogether, so the word must mean total.
倍数/1 | 十二除以三等于四 | Twelve divided by three is four, so the word must mean multiple.
加倍/1 | 考试快到更努力 | Exams are coming and he revises twice as hard, so the word must mean to double.
成倍/1 | 网上买东西的人增加 | Online shoppers have multiplied in recent years, so the word must mean manifold.
倍增/1 | 每天一百件变两百件 | Output rose from a hundred pieces a day to two hundred, so the word must mean to multiply.
事半功倍/1 | 方法对了学习 | The right method makes study far more effective, so the word must mean twice the result for half the effort.
同比/1 | 今年五月比去年五月 | This May's sales are compared with last May's, so the word must mean year-on-year.
环比/1 | 这个月比上个月 | This month's sales are compared with last month's, so the word must mean period-on-period.
百分点/1 | 百分之五降到百分之四 | Unemployment fell from five per cent to four, so the word must mean percentage point.
剩余/1 | 用了八千还剩两千 | Eight thousand yuan was spent and two thousand returned, so the word must mean surplus.
过剩/1 | 苹果太多价格下降 | A bumper apple harvest pushed prices down, so the word must mean excess.
申请书/1 | 想加入志愿者协会 | He wants to join the volunteer society, so the word must mean application.
倡议书/1 | 号召全校节约用水 | The student union called on everyone to save water, so the word must mean written appeal.
建议书/1 | 希望学校多开体育课 | They wrote to the head asking for more PE lessons, so the word must mean written proposal.
计划书/1 | 创业要做什么需要多少钱 | They set out what the business would do and how much it needs, so the word must mean plan.
协议书/1 | 双方签字事情定下来 | Both sides signed and the matter was settled, so the word must mean written agreement.
说明书/1 | 使用机器前仔细阅读 | Read it carefully before using the machine, so the word must mean instructions.
请假条/1 | 发烧妈妈给老师写 | He had a fever and his mother wrote to the teacher for him, so the word must mean leave note.
批复/1 | 上级同意了计划 | The higher authority replied to the request and approved the plan, so the word must mean written reply.
批示/1 | 校长写同意请马上办理 | The head wrote on the document to approve it and act at once, so the word must mean written instructions.
请批示/1 | 妥否 | A request often ends by asking whether it is proper, so the word must mean please give instructions.
会议纪要/1 | 把会上决定整理发给部门 | The secretary summed up the decisions for each department, so the word must mean meeting summary.
会议记录/1 | 写清时间地点每人发言 | It sets down the meeting's time, place and what everyone said, so the word must mean meeting record.
记录人/1 | 会议记录最后写名字 | The minutes end with the name of the person who took them, so the word must mean recorder.
列席/1 | 学生代表不参加表决 | Student representatives attend but do not vote, so the word must mean to attend as a non-voting delegate.
缺席/1 | 两人因病没来 | Two people missed today's meeting through illness, so the word must mean to be absent.
签到/1 | 到了以后先在门口 | People sign in at the door when they arrive, so the word must mean to sign in.
签到表/1 | 数上面的名字三十人 | The secretary counted thirty names after the meeting, so the word must mean attendance sheet.
举手表决/1 | 没有不同意见全部同意 | Nobody disagreed and everyone voted for the plan, so the word must mean to vote by show of hands.
与会/1 | 参加会议的人都签了名 | Everyone at the meeting signed the minutes, so the word must mean to attend a meeting.
议定/1 | 讨论后定下次会议日期 | After discussion everyone agreed on the date of the next meeting, so the word must mean to agree upon.
编号/1 | 每份合同方便查找 | Each contract has one for easy finding later, so the word must mean serial number.
文号/1 | 公文标题上面的代字年份 | It combines the office's code, the year and a sequence number above the title, so the word must mean reference number.
签发/1 | 要由局长签字才能发出 | The director must sign the document before it goes out, so the word must mean to sign and issue.
印发/1 | 作息时间表给每个班 | The school sent the new timetable to every class, so the word must mean to print and distribute.
上报/1 | 周五前把名单交给学校 | Each class must send its team list to the school by Friday, so the word must mean to report to a higher level.
备案/1 | 新公司到有关部门登记 | A new company must register with the authorities, so the word must mean to file for the record.
存档/1 | 材料看完不能丢掉 | The materials must be kept on file and not thrown away, so the word must mean to archive.
抄送/1 | 邮件还要发给其他部门 | Colleagues in other departments also receive a copy of the email, so the word must mean to carbon copy.
主送/1 | 主要负责办理的单位 | It is the main office to act, unlike those only copied, so the word must mean main addressee.
函告/1 | 会议时间改了通知单位 | The participating units were told of the new meeting time by letter, so the word must mean to notify by letter.
来函/1 | 贵校的已经收到 | Your school's letter has been received, so the word must mean incoming letter.
复函/1 | 收到对方信后尽快写 | A reply must be written soon after the other side's letter, so the word must mean letter of reply.
致函/1 | 公司给市政府写信 | The company wrote to the city government about a new factory, so the word must mean to send a letter to.
函件/1 | 秘书每天处理几十封 | The secretary handles dozens of letters a day, so the word must mean correspondence.
此复/1 | 回复来函结尾 | It ends a reply to someone's letter, so the word must mean hereby replied.
妥否/1 | 请批示合不合适 | The request asks the higher authority whether this is suitable, so the word must mean is this appropriate.
如下/1 | 有关事项通知 | It introduces the items that follow, so the word must mean as follows.
据此/1 | 车太多市里决定修新路 | The survey found too many cars and the city decided on a new road, so the word must mean accordingly.
兹有/1 | 我校学生前往实习 | The letter introduces a pupil coming to the unit for an internship, so the word must mean this is to introduce.
兹因/1 | 学校停电课改到下周 | It gives the power cut as the reason the lesson is moved, so the word must mean because.
收条/1 | 今收到班费叁拾元整 | The teacher wrote that thirty yuan of class money had been received, so the word must mean receipt.
欠条/1 | 今欠货款玖拾元整 | He wrote that he owed the shop ninety yuan, so the word must mean IOU.
领条/1 | 今领到篮球捌个 | He wrote that he had taken eight basketballs, so the word must mean receipt for items drawn.
大写金额/1 | 支票写成壹万元整 | On a cheque the amount is written in complex numerals that are hard to alter, so the word must mean amount in capitals.
元整/1 | 人民币壹拾捌 | The receipt shows exactly eighteen yuan, so the word must mean yuan only.
合计/1 | 三本书一共六十元 | The three books cost sixty yuan in all, so the word must mean to add up to.
累计/1 | 这个月一共跑一百公里 | He ran a hundred kilometres over the month, so the word must mean to total.
结余/1 | 花了两千还剩三百 | He spent two thousand yuan and has three hundred left, so the word must mean surplus.
乙方/1 | 租房子的一方 | The tenant is the second party in the contract, so the word must mean party B.
丙方/1 | 合同排在第三的一方 | The third party in a three-way contract is meant, so the word must mean party C.
浙江/1 | 东部省会是杭州 | The province in eastern China has Hangzhou as its capital, so the word must mean Zhejiang.
杭州/1 | 西湖所在 | West Lake is there, so the word must mean Hangzhou.
陕西/1 | 省会西安有兵马俑 | Its capital is Xi'an, home of the Terracotta Army, so the word must mean Shaanxi.
辽宁/1 | 东北南边靠海 | The northeastern province borders the sea to the south, so the word must mean Liaoning.
河北/1 | 简称冀 | Its short name is 冀, so the word must mean Hebei.
湘江/1 | 湖南最大河流进洞庭湖 | Hunan's biggest river flows north into Dongting Lake, so the word must mean Xiang River.
湘菜/1 | 湖南菜又香又辣 | Hunan dishes are often fragrant and spicy, so the word must mean Hunan cuisine.
辽阔/1 | 内蒙古草原望不到边 | The Inner Mongolian grassland stretches beyond sight, so the word must mean vast.
联系电话/1 | 报名表上方便打电话通知 | The form needs a number to call you, so the word must mean contact phone number.
电子邮箱/1 | 作业发到老师的 | Homework is sent to the teacher's email, so the word must mean email address.
希冀/1 | 怀着对未来的去大城市 | He left home for the city full of hope for the future, so the word must mean aspiration.
瞩目/1 | 研究成果引人 | The young scientist's results draw attention, so the word must mean to focus attention on.
举世瞩目/1 | 长城伟大工程 | The Great Wall is known the world over, so the word must mean attracting worldwide attention.
高瞻远瞩/1 | 几十年前就重视外语 | Decades ago the old head already valued foreign languages, so the word must mean far-sighted.
禀报/1 | 下人把消息告诉主人 | Servants told the master that guests had come, so the word must mean to report to a superior.
禀性/1 | 从小善良愿意帮人 | He has always been kind and helps others, so the word must mean natural disposition.
恩赐/1 | 好成绩不是别人给的 | Good marks come from your own effort, not from anyone else, so the word must mean favour.
赏赐/1 | 立功将军得到皇帝的 | Generals who won great victories received gifts from the emperor, so the word must mean imperial reward.
园丁/1 | 老师比作辛勤的 | People liken hard-working teachers to it, so the word must mean gardener.
人丁/1 | 希望家里兴旺 | People hoped for many members in the family, so the word must mean population of a family.
傍晚/1 | 太阳快落山天边红 | The Sun is about to set and the sky is red, so the word must mean dusk.
顷刻/1 | 大雨路上全是水 | The road was flooded in no time, so the word must mean instant.
每逢/1 | 周一早上升旗 | Every Monday morning the school raises the flag, so the word must mean on every occasion.
逢年过节/1 | 给远方父母打电话 | At holidays and New Year he phones his distant parents, so the word must mean at festivals and new year.
千载难逢/1 | 到国家队训练的机会 | Training with the national team is a chance he must treasure, so the word must mean rare.
久别重逢/1 | 老同学紧紧抱在一起 | Two old classmates hug tightly after years apart, so the word must mean to meet after long separation.
钥匙/1 | 出门忘带只好等妈妈 | He forgot it and had to wait at the door for his mother, so the word must mean key.
徐徐/1 | 国旗慢慢升起 | The flag rises slowly as the anthem plays, so the word must mean gently.
公顷/1 | 农场五百种小麦 | The farm's five hundred units of land are all wheat, so the word must mean hectare.
贮存/1 | 粮食放在仓库准备过冬 | Grain harvested in autumn is kept in barns for winter, so the word must mean to store.
`);
