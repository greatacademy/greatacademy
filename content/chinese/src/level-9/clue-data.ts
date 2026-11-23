// The clues of the gap sentences of the level 9 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelNineClues are the clues of the gap sentences of the level 9 words, by clueKey, each word's sentence counted as 1. */
export const levelNineClues = parseClues(`
双关/1 | 福字倒贴因为倒和到同音 | A pun, so the word must mean pun.
借代/1 | 用笔杆子代替会写文章的人 | Metonymy, so the word must mean metonymy.
明喻/1 | 用了像字的比喻 | A simile, so the word must mean simile.
暗喻/1 | 时间是一条河 | A metaphor, so the word must mean metaphor.
借喻/1 | 只出现用来比喻的东西 | An implied metaphor, so the word must mean metaphor without the tenor.
反语/1 | 房间又脏又乱却说真爱干净 | Irony, so the word must mean irony.
顶真/1 | 前一句末尾是后一句开头 | Anadiplosis, so the word must mean chain linking.
通感/1 | 花香写得像歌声 | Synaesthesia, so the word must mean synaesthesia.
互文/1 | 上下两句意思互相补充 | Intertextual pairing, so the word must mean mutual complementation.
修辞格/1 | 比喻拟人夸张排比 | Figures of speech, so the word must mean rhetorical device.
名词/1 | 桌子城市友谊 | Nouns, so the word must mean noun.
动词/1 | 跑写思考 | Verbs, so the word must mean verb.
形容词/1 | 美丽高大安静 | Adjectives, so the word must mean adjective.
副词/1 | 很都已经 | Adverbs, so the word must mean adverb.
介词/1 | 从对于关于 | Prepositions, so the word must mean preposition.
连词/1 | 和但是所以 | Conjunctions, so the word must mean conjunction.
助词/1 | 的地得和了着过 | Particles, so the word must mean auxiliary word.
量词/1 | 一本书的本 | Measure words, so the word must mean measure word.
代词/1 | 我你这那 | Pronouns, so the word must mean pronoun.
叹词/1 | 哎呀唉哦能单独成句 | Interjections, so the word must mean interjection.
主语/1 | 小明读书里的小明 | The subject, so the word must mean subject.
谓语/1 | 花开了里的开了 | The predicate, so the word must mean predicate.
宾语/1 | 我喜欢音乐里的音乐 | The object, so the word must mean object.
定语/1 | 红色的花里的红色的 | An attribute, so the word must mean attributive.
状语/1 | 他慢慢地走里的慢慢地 | An adverbial, so the word must mean adverbial.
补语/1 | 他跑得很快里的很快 | A complement, so the word must mean complement.
短语/1 | 美丽的校园不是完整句子 | A phrase, so the word must mean phrase.
语序/1 | 狗咬人和人咬狗不同 | Word order, so the word must mean word order.
句式/1 | 把字句和被字句 | Sentence patterns, so the word must mean sentence pattern.
倒装句/1 | 主语放在了后面 | Inversion, so the word must mean inverted sentence.
陈述句/1 | 今天是星期一 | A statement, so the word must mean declarative sentence.
疑问句/1 | 你吃饭了吗 | A question, so the word must mean interrogative sentence.
祈使句/1 | 请关上门 | A command, so the word must mean imperative sentence.
感叹句/1 | 这里的风景太美了 | An exclamation, so the word must mean exclamatory sentence.
病句/1 | 缺少主语的句子 | A faulty sentence, so the word must mean ungrammatical sentence.
歧义/1 | 两个学校的老师有两种意思 | Ambiguity, so the word must mean ambiguity.
实词/1 | 名词动词形容词 | Content words, so the word must mean notional word.
虚词/1 | 介词连词助词 | Function words, so the word must mean function word.
语法/1 | 作文内容不错可句子有错误 | Grammar, so the word must mean grammar.
数词/1 | 一十百千 | Numerals, so the word must mean numeral.
标点符号/1 | 逗号句号问号 | Punctuation, so the word must mean punctuation mark.
省略号/1 | 话没有说完 | An ellipsis, so the word must mean ellipsis.
括号/1 | 起解释作用的话放在里面 | Brackets, so the word must mean brackets.
破折号/1 | 歇后语前后两部分之间 | A dash, so the word must mean dash.
书名号/1 | 写书名报纸名用 | Title marks, so the word must mean book title marks.
分号/1 | 停顿比逗号长比句号短 | A semicolon, so the word must mean semicolon.
着重号/1 | 字下面的小圆点 | Emphasis dots, so the word must mean emphasis mark.
间隔号/1 | 外国人名和姓之间 | The middle dot, so the word must mean interpunct.
连接号/1 | 从北京到上海的路线 | A connecting dash, so the word must mean hyphen.
单引号/1 | 引号里面的引号 | Single quotes, so the word must mean single quotation marks.
偏旁/1 | 河湖海都有三点水 | A component, so the word must mean radical.
笔顺/1 | 先上后下先左后右 | Stroke order, so the word must mean stroke order.
方块字/1 | 每个字写在一个方格里 | Square characters, so the word must mean square-shaped characters.
象形/1 | 日月山照着样子画 | Pictographic, so the word must mean pictographic.
会意/1 | 人靠在树旁是休 | Compound ideographic, so the word must mean associative compound.
形声/1 | 湖字左边表意右边表音 | Phono-semantic, so the word must mean pictophonetic.
指事/1 | 木下加一短横表示树根 | Indicative, so the word must mean self-explanatory character.
独体字/1 | 人口大不能再分开 | Single-component characters, so the word must mean single-component character.
合体字/1 | 妈由女和马组成 | Compound characters, so the word must mean compound character.
简化字/1 | 书马门写法比过去简单 | Simplified characters, so the word must mean simplified character.
声母/1 | 包和抛只是开头的音不同 | The initial, so the word must mean initial consonant.
韵母/1 | 妈和摸只是后面的音不同 | The final, so the word must mean final.
卷舌/1 | 说知吃是要翘起舌头 | Retroflex, so the word must mean to curl the tongue.
儿化/1 | 北京人说玩儿一点儿 | Erhua, so the word must mean rhotacisation.
轻声/1 | 桌子的子读得又轻又短 | The neutral tone, so the word must mean neutral tone.
变调/1 | 两个三声连读前一个读二声 | Tone sandhi, so the word must mean tone change.
送气/1 | 发怕的声母吐出一股气 | Aspirated, so the word must mean aspiration.
鼻音/1 | 妈和那气流从鼻子出来 | Nasals, so the word must mean nasal sound.
音节/1 | 一个汉字通常读一个 | A syllable, so the word must mean syllable.
四声/1 | 阴平阳平上声去声 | The four tones, so the word must mean four tones.
近义词/1 | 美丽和漂亮 | Synonyms, so the word must mean synonym.
反义词/1 | 冷和热 | Antonyms, so the word must mean antonym.
同音字/1 | 是事试读音完全相同 | Homophones, so the word must mean homophone.
多音字/1 | 长在长短和长大里读音不同 | A polyphone, so the word must mean character with several readings.
错别字/1 | 把再见写成在见 | A wrong character, so the word must mean miswritten character.
本义/1 | 古代走的原来意思是跑 | The original meaning, so the word must mean original meaning.
引申义/1 | 感情很深里的深 | An extended meaning, so the word must mean extended meaning.
词义/1 | 会读会写还要理解 | Word meaning, so the word must mean meaning of a word.
通假字/1 | 古书里用读音相近的字代替 | Loan characters, so the word must mean interchangeable character.
中性/1 | 结果不带褒义也不带贬义 | Neutral, so the word must mean neutral.
口吻/1 | 作文用一只小猫的语气写 | The voice, so the word must mean tone of voice.
抑扬顿挫/1 | 朗读诗歌声音高低起伏 | Cadenced, so the word must mean with rising and falling cadence.
吞吞吐吐/1 | 问他为什么迟到说不出原因 | Hesitantly, so the word must mean to hem and haw.
结巴/1 | 一紧张一个字重复好几遍 | Stammering, so the word must mean to stutter.
啰嗦/1 | 一件小事说了半小时 | Long-winded, so the word must mean wordy.
唠叨/1 | 妈妈每天让我多穿衣服早睡 | Nagging, so the word must mean to nag.
嘀咕/1 | 不敢大声反对小声说 | Muttering, so the word must mean to mutter.
滔滔不绝/1 | 说起足球谁也插不上嘴 | Talking nonstop, so the word must mean to talk on and on.
口齿伶俐/1 | 小姑娘主持节目不紧张 | Articulate, so the word must mean eloquent.
含糊/1 | 没说同意还是不同意 | Vague, so the word must mean ambiguous.
谚语/1 | 一年之计在于春 | A proverb, so the word must mean proverb.
歇后语/1 | 竹篮打水一场空 | A two-part allegorical saying, so the word must mean xiehouyu.
惯用语/1 | 开夜车走后门 | Idiomatic phrases, so the word must mean idiom.
俏皮话/1 | 他爱说大家被逗笑 | Witty remarks, so the word must mean wisecrack.
绕口令/1 | 四是四十是十说快易错 | A tongue twister, so the word must mean tongue twister.
顺口溜/1 | 交通规则编成好记的句子 | A jingle, so the word must mean doggerel.
口头禅/1 | 差不多他总挂在嘴上 | A catchphrase, so the word must mean pet phrase.
警句/1 | 文章里读了很受启发的句子 | Aphorisms, so the word must mean epigram.
熟语/1 | 成语谚语歇后语 | Set phrases, so the word must mean set phrase.
横批/1 | 春联贴在门上方的一条 | The horizontal scroll, so the word must mean horizontal couplet scroll.
措辞/1 | 给校长写信要礼貌 | Wording, so the word must mean wording.
字斟句酌/1 | 合同重要看了一遍又一遍 | Weighing every word, so the word must mean to choose words with care.
咬文嚼字/1 | 说话不必太计较字眼 | Pedantic, so the word must mean to be pedantic about words.
贴切/1 | 比喻一下子让人明白 | Apt, so the word must mean fitting.
直白/1 | 话说得不考虑别人感受 | Blunt, so the word must mean plain-spoken.
拗口/1 | 读音相近的字太多 | Awkward to say, so the word must mean hard to pronounce.
顺口/1 | 儿歌小朋友很快会背 | Easy to say, so the word must mean flowing.
精炼/1 | 每个字都恰到好处 | Concise, so the word must mean succinct.
赘述/1 | 前面讲过这里不再说 | Repetition, so the word must mean to go over again.
混淆/1 | 己和已样子很像 | Mixed up, so the word must mean to confuse.
哎呀/1 | 把作业本忘在教室了 | Oh no, so the word must mean oh dear.
哎哟/1 | 脚扭了好疼 | Ouch, so the word must mean ouch.
唉声叹气/1 | 没考好一回家就 | Sighing, so the word must mean to moan and sigh.
哦/1 | 原来是这样终于明白 | Oh, so the word must mean oh.
哇/1 | 孩子们走进海洋馆叫起来 | Wow, so the word must mean wow.
嘛/1 | 他本来就是个孩子 | Obviously, so the word must mean a particle of the obvious.
啦/1 | 太好我们爬到山顶 | Exclamation, so the word must mean a particle of excitement.
乐呵呵/1 | 爷爷整天好像没有烦恼 | Cheerful, so the word must mean happy and smiling.
嘿嘿/1 | 一笑说秘密不能告诉你 | A chuckle, so the word must mean hehe.
语气词/1 | 吗呢吧放在句末 | Modal particles, so the word must mean modal particle.
烘托/1 | 阴沉天气衬出悲伤心情 | Setting off, so the word must mean to set off.
照应/1 | 结尾和开头互相呼应 | Echoing, so the word must mean to echo.
铺垫/1 | 前面写辛苦为最后成功准备 | Groundwork, so the word must mean setup.
开门见山/1 | 第一句就点明主题 | Straight to the point, so the word must mean to come straight to the point.
寓情于景/1 | 通过落叶表达思念 | Feeling in scenery, so the word must mean to express feeling through scenery.
画龙点睛/1 | 结尾一句让主题更鲜明 | The finishing touch, so the word must mean to add the crucial finishing touch.
欲扬先抑/1 | 先写不起眼后写了不起 | Praise after belittling, so the word must mean to suppress before praising.
侧面描写/1 | 写路人都回头看她 | Indirect description, so the word must mean indirect description.
正面描写/1 | 直接写外貌语言动作 | Direct description, so the word must mean direct description.
借物喻人/1 | 写小草赞美普通人 | Symbolism, so the word must mean to describe people through objects.
风趣/1 | 老师说话同学们常被逗笑 | Witty, so the word must mean humorous.
俏皮/1 | 小女孩朝我做鬼脸 | Cheeky, so the word must mean playful.
打趣/1 | 拿新发型开玩笑 | Teasing, so the word must mean to tease.
自嘲/1 | 说自己就是长个子慢 | Self-mocking, so the word must mean to laugh at oneself.
挖苦/1 | 总说刺伤别人的话 | Sarcastic, so the word must mean to mock.
玩笑/1 | 你别当真 | A joke, so the word must mean joke.
说笑/1 | 晚饭后在院子里聊天 | Chatting and laughing, so the word must mean to chat and joke.
冷笑话/1 | 讲完谁也没笑 | A bad joke, so the word must mean corny joke.
段子/1 | 网上好笑的转发给朋友 | A funny bit, so the word must mean funny story.
幽默感/1 | 爸爸总能逗笑一家人 | A sense of humour, so the word must mean sense of humour.
傻话/1 | 你一定能考好的 | Silly talk, so the word must mean nonsense.
悄悄话/1 | 两个好朋友在角落小声说 | Whispers, so the word must mean secret whisper.
废话/1 | 写文章要简洁 | Padding, so the word must mean useless words.
客套话/1 | 老朋友不用说 | Pleasantries, so the word must mean polite formulas.
场面话/1 | 会上说的不一定真心 | Lip service, so the word must mean things said for show.
大白话/1 | 用它讲科学小学生能懂 | Plain speech, so the word must mean plain language.
心里话/1 | 今晚想跟你说几句 | Heart-to-heart words, so the word must mean what is on one's mind.
谎话/1 | 说了后来自己很不安 | A lie, so the word must mean lie.
撒谎/1 | 从小不说假话大家信任 | Lying, so the word must mean to lie.
气话/1 | 生气时说的别往心里去 | Words in anger, so the word must mean angry words.
啥/1 | 你说什么我没听清 | What, so the word must mean what.
咱/1 | 我们俩是好朋友 | We, so the word must mean we.
俺/1 | 山东人说我 | I, so the word must mean I.
吴语/1 | 上海话和苏州话 | Wu, so the word must mean Wu dialects.
闽南话/1 | 厦门人平时说 | Southern Min, so the word must mean Minnan dialect.
客家话/1 | 广东梅州很多人说 | Hakka, so the word must mean Hakka.
官话/1 | 北方方言也叫 | Mandarin, so the word must mean Mandarin dialects.
东北话/1 | 把干什么说成干啥 | Northeastern speech, so the word must mean Northeastern dialect.
四川话/1 | 成都人平时说 | Sichuanese, so the word must mean Sichuan dialect.
乡音/1 | 离开家乡几十年没改 | His home accent, so the word must mean native accent.
守株待兔/1 | 只盼着下次还有好运气 | Waiting for luck, so the word must mean to wait idly for windfalls.
狐假虎威/1 | 仗着哥哥是班长作威作福 | Borrowed power, so the word must mean to bully by borrowed power.
画蛇添足/1 | 写得很好再加一段反而不好 | Overdoing it, so the word must mean to ruin by adding the superfluous.
井底之蛙/1 | 以为天只有井口那么大 | A frog in a well, so the word must mean someone with a narrow view.
杯弓蛇影/1 | 小声音就以为有小偷 | Groundless fear, so the word must mean to be needlessly suspicious.
惊弓之鸟/1 | 被狗咬过一听到狗叫就怕 | Once bitten, so the word must mean someone easily frightened.
对牛弹琴/1 | 跟三岁孩子讲经济学 | Wasted words, so the word must mean to talk to the wrong audience.
亡羊补牢/1 | 错了很多现在复习还来得及 | Mending the fence, so the word must mean to fix things after a loss.
龟兔赛跑/1 | 跑得快的骄傲睡大觉 | The tortoise and the hare, so the word must mean the tortoise and the hare.
乌鸦喝水/1 | 往瓶子里放石子水升上来 | The crow and the pitcher, so the word must mean the crow drinking water.
兔死狐悲/1 | 同行公司倒闭不免难过 | Sorrow for one's kind, so the word must mean to grieve for one's own kind.
鸦雀无声/1 | 老师一进教室立刻安静 | Dead silence, so the word must mean utter silence.
门可罗雀/1 | 饭店以前客人多现在冷清 | Deserted, so the word must mean deserted.
鸡犬不宁/1 | 装修吵得整栋楼 | In turmoil, so the word must mean general disturbance.
鹏程万里/1 | 毕业时祝前程似锦 | A great future, so the word must mean a bright future.
金蝉脱壳/1 | 借口去洗手间悄悄离开 | Slipping away, so the word must mean to escape by a ruse.
呆若木鸡/1 | 听到消息站着说不出话 | Dumbstruck, so the word must mean dumbfounded.
卧虎藏龙/1 | 小村子出过好几位画家 | Hidden talent, so the word must mean hidden talents.
龙飞凤舞/1 | 爷爷的毛笔字很有气势 | Flamboyant writing, so the word must mean lively flowing calligraphy.
如鱼得水/1 | 到新研究所工作进步快 | In one's element, so the word must mean to be in one's element.
塞翁失马/1 | 没考上却遇到好老师 | A blessing in disguise, so the word must mean a loss that may turn out well.
老马识途/1 | 爷爷住了一辈子找到小路 | Experience shows the way, so the word must mean the old horse knows the road.
一马当先/1 | 队长总冲在最前面 | Taking the lead, so the word must mean to take the lead.
走马观花/1 | 参观博物馆不停下仔细看 | A quick look, so the word must mean to look at things hastily.
害群之马/1 | 球队里故意不配合的人 | A bad apple, so the word must mean black sheep.
马不停蹄/1 | 下了飞机就赶到会场 | Without a break, so the word must mean nonstop.
单枪匹马/1 | 一个人来城市创业 | Single-handed, so the word must mean single-handedly.
蛛丝马迹/1 | 警察不放过任何线索 | Clues, so the word must mean faint traces.
千军万马/1 | 考生们过独木桥 | A huge crowd, so the word must mean a mighty host.
马到成功/1 | 比赛前朋友们祝他 | Instant success, so the word must mean to win at once.
刻舟求剑/1 | 情况变了还用老办法 | Outdated methods, so the word must mean to act without regard to change.
郑人买履/1 | 买鞋不试穿要回家拿尺码 | Trusting the rule over reality, so the word must mean rigid adherence to dogma.
骑驴找驴/1 | 眼镜就戴在头上 | Looking for what one has, so the word must mean to search for what is under one's nose.
叶公好龙/1 | 说喜欢小狗来了却害怕 | Professed love, so the word must mean to love something only in name.
盲人摸象/1 | 只看一章就评价整本书 | Partial view, so the word must mean to judge the whole by a part.
画饼充饥/1 | 光想好吃的肚子还饿 | Empty comfort, so the word must mean to feed on illusions.
望梅止渴/1 | 曹操说前面有梅林 | False comfort, so the word must mean to console with false hopes.
纸上谈兵/1 | 读游泳的书却没下过水 | Armchair theory, so the word must mean to theorise without practice.
弄巧成拙/1 | 装饰蛋糕奶油弄得到处是 | Backfiring, so the word must mean to make things worse by being clever.
朝三暮四/1 | 今天学画明天学钢琴 | Fickle, so the word must mean to keep changing one's mind.
完璧归赵/1 | 借来的书好好保管还回 | Returned intact, so the word must mean to return something intact.
负荆请罪/1 | 知道错了主动道歉 | Apologising humbly, so the word must mean to offer a humble apology.
围魏救赵/1 | 攻打魏都逼魏军回来 | Indirect relief, so the word must mean to relieve one place by attacking another.
退避三舍/1 | 见了脾气急的他都让开 | Giving way, so the word must mean to keep well clear.
唇亡齿寒/1 | 一个灭亡另一个难保 | Mutual dependence, so the word must mean closely interdependent.
卧薪尝胆/1 | 输了以后每天苦练 | Enduring hardship, so the word must mean to endure hardship for revenge.
四面楚歌/1 | 观点没有一个人支持 | Besieged on all sides, so the word must mean surrounded by enemies.
背水一战/1 | 最后一次机会全力拼 | A last stand, so the word must mean to fight with no retreat.
草木皆兵/1 | 望见草木以为是敌兵 | Jumping at shadows, so the word must mean to see enemies everywhere.
指鹿为马/1 | 赵高把鹿说成马 | Calling black white, so the word must mean to deliberately misrepresent.
三顾茅庐/1 | 校长去了好几次请专家 | Repeated visits, so the word must mean to call on someone repeatedly to recruit them.
初出茅庐/1 | 刚毕业很多事不懂 | Green, so the word must mean inexperienced.
草船借箭/1 | 诸葛亮三天得到十万支箭 | Borrowing arrows, so the word must mean borrowing arrows with straw boats.
刘备/1 | 三次去请诸葛亮出山 | Liu Bei, so the word must mean Liu Bei.
诸葛亮/1 | 比喻非常聪明会出主意的人 | Zhuge Liang, so the word must mean Zhuge Liang.
曹操/1 | 东汉末年政治家也是诗人 | Cao Cao, so the word must mean Cao Cao.
关羽/1 | 后人尊称关公 | Guan Yu, so the word must mean Guan Yu.
张飞/1 | 三国里脾气急说话直的猛将 | Zhang Fei, so the word must mean Zhang Fei.
说曹操曹操到/1 | 正说着小王他就进来了 | Speak of the devil, so the word must mean speak of the devil.
三个臭皮匠/1 | 顶个诸葛亮大家一起想 | Three cobblers, so the word must mean three ordinary people.
凿壁偷光/1 | 墙上挖洞借邻居家光读书 | Studying by borrowed light, so the word must mean to study hard despite poverty.
囊萤映雪/1 | 用萤火虫和雪光照明读书 | Studying by fireflies, so the word must mean to study diligently in hardship.
悬梁刺股/1 | 困了把头发系在房梁上 | Fierce study, so the word must mean to study with grim determination.
程门立雪/1 | 在老师门外雪里站着等 | Respect for teachers, so the word must mean to stand in the snow at a teacher's door.
孟母三迁/1 | 为孩子好环境搬好几次家 | Moving for a child, so the word must mean Mencius's mother moving three times.
手不释卷/1 | 八十岁每天读两小时书 | At eighty Grandpa still reads for two hours every day, so the word must mean never putting down a book.
学富五车/1 | 老教授什么问题都难不倒 | Learned, so the word must mean very learned.
才高八斗/1 | 写的诗文没人比得上 | Highly talented, so the word must mean of great talent.
七步成诗/1 | 曹植走七步作一首诗 | A poem in seven steps, so the word must mean quick literary talent.
江郎才尽/1 | 后来再写不出好作品 | Talent run dry, so the word must mean to have exhausted one's talent.
胸有成竹/1 | 早想好解法回答很从容 | Confident, so the word must mean to have a plan in mind.
班门弄斧/1 | 在书法家面前写毛笔字 | Showing off before an expert, so the word must mean to show off before a master.
入木三分/1 | 评论把问题分析得很深 | Penetrating, so the word must mean incisive.
目无全牛/1 | 拆开表就能找出问题 | Mastery, so the word must mean consummate skill.
百步穿杨/1 | 射箭本领很高 | Crack shooting, so the word must mean expert marksmanship.
运斤成风/1 | 一把斧子用得非常灵活 | Superb craft, so the word must mean masterly skill.
巧夺天工/1 | 玉雕的花像真的一样 | Superb workmanship, so the word must mean craftsmanship surpassing nature.
出神入化/1 | 魔术表演观众看呆了 | Masterly, so the word must mean to reach perfection.
鲁班/1 | 被木匠尊为祖师 | Lu Ban, so the word must mean Lu Ban.
一技之长/1 | 学会一门手艺不怕找不到工作 | A skill, so the word must mean a particular skill.
水滴石穿/1 | 每天背十个单词一年很可观 | Persistence pays, so the word must mean constant dripping wears away stone.
一曝十寒/1 | 学习不能晒一天冻十天 | On and off, so the word must mean to work by fits and starts.
有始有终/1 | 答应了就不能做到一半不管 | Seeing it through, so the word must mean to finish what one starts.
百折不挠/1 | 经历很多失败最后成功 | Undaunted, so the word must mean indomitable.
聚沙成塔/1 | 每人捐一点帮很多人 | Many a little, so the word must mean many small amounts make a great deal.
虎头蛇尾/1 | 开头热情没几天放弃 | A strong start and weak finish, so the word must mean to start strong and fizzle out.
一鼓作气/1 | 中间不休息爬上山顶 | In one burst, so the word must mean in one go.
再接再厉/1 | 表现很好希望更好成绩 | Keep it up, so the word must mean to keep up the effort.
卷土重来/1 | 去年输了今年又来赢冠军 | A comeback, so the word must mean to stage a comeback.
功败垂成/1 | 只差最后一步失败了 | Failing at the last step, so the word must mean to fail on the verge of success.
高山流水/1 | 两人都爱音乐最懂对方 | Kindred spirits, so the word must mean perfect understanding between friends.
知音/1 | 人生难得遇到懂自己的人 | A true friend, so the word must mean soulmate.
锦上添花/1 | 本来优秀获奖更好 | Icing on the cake, so the word must mean to make something good even better.
落井下石/1 | 别人困难时还说他坏话 | Kicking someone when they are down, so the word must mean to hit someone who is down.
过河拆桥/1 | 事办成就不理帮过他的人 | Ungrateful, so the word must mean to abandon one's helpers.
拔刀相助/1 | 弱小同学被欺负站出来 | Coming to the rescue, so the word must mean to step in to help.
一臂之力/1 | 有困难我愿意帮你 | A helping hand, so the word must mean a helping hand.
同甘共苦/1 | 夫妻几十年感情很好 | Sharing joys and sorrows, so the word must mean to share weal and woe.
患难与共/1 | 地震中全村一起重建家园 | Together through hardship, so the word must mean to stand together in adversity.
齐心协力/1 | 大家一条心把事办好 | Working as one, so the word must mean to work together.
刮目相看/1 | 他进步快大家对他看法变了 | Seen in a new light, so the word must mean to look at someone with new eyes.
士别三日/1 | 半年不见汉语说得这么好 | After three days apart, so the word must mean people change quickly.
青出于蓝/1 | 学生比老师更有名 | Surpassing the teacher, so the word must mean the pupil surpasses the master.
大器晚成/1 | 五十岁才出版第一本小说 | A late bloomer, so the word must mean great talents mature late.
少年老成/1 | 十二岁说话做事很稳重 | Mature beyond his years, so the word must mean old head on young shoulders.
乳臭未干/1 | 别看不起他年纪小 | Wet behind the ears, so the word must mean very young and inexperienced.
宝刀不老/1 | 七十岁教练示范动作标准 | At seventy the old coach still shows the moves perfectly, so the word must mean still as capable as ever.
老当益壮/1 | 爷爷退休后学会开车锻炼 | Vigorous in old age, so the word must mean old but still vigorous.
后起之秀/1 | 年轻棋手赢了好几位老将 | A rising star, so the word must mean promising newcomer.
年富力强/1 | 三十多岁正是好时候 | In his prime, so the word must mean in the prime of life.
扁鹊/1 | 战国名医总结看病方法 | Bian Que, so the word must mean Bian Que.
对症下药/1 | 先找到原因再解决 | The right remedy, so the word must mean to suit the remedy to the problem.
妙手回春/1 | 病人出院送医生锦旗 | A healing touch, so the word must mean skilled hands that restore health.
起死回生/1 | 快倒闭的工厂又好了 | Brought back to life, so the word must mean to revive.
悬壶济世/1 | 回家乡给乡亲看病 | Practising medicine, so the word must mean to practise medicine to help people.
杏林/1 | 董奉请病人种树 | The medical world, so the word must mean the medical profession.
望闻问切/1 | 看听问摸脉 | The four examinations, so the word must mean the four methods of diagnosis.
药到病除/1 | 开的药一吃病就好 | An instant cure, so the word must mean the medicine cures at once.
防微杜渐/1 | 小错不改变大错 | Nipping it in the bud, so the word must mean to check at the outset.
李时珍/1 | 写成本草纲目 | Li Shizhen, so the word must mean Li Shizhen.
一举两得/1 | 锻炼身体又保护环境 | Two birds with one stone, so the word must mean to gain two ends at once.
三心二意/1 | 做作业要专心 | Half-hearted, so the word must mean distracted.
九牛一毛/1 | 这点钱对他来说很少 | A drop in the ocean, so the word must mean a tiny fraction.
一字千金/1 | 文章写得精彩 | Every word priceless, so the word must mean writing of great value.
七上八下/1 | 等成绩时心里不安 | On tenterhooks, so the word must mean anxious.
十全十美/1 | 世上没有毫无缺点的人 | Perfect, so the word must mean flawless.
万无一失/1 | 计划检查好几遍 | Foolproof, so the word must mean absolutely safe.
五湖四海/1 | 来自各地为同一目标 | All over the land, so the word must mean all corners of the country.
一波三折/1 | 航班取消又丢行李 | Full of twists, so the word must mean full of setbacks.
得寸进尺/1 | 让了一次要求越来越多 | Give an inch, so the word must mean to push one's luck.
盘古开天/1 | 天地原来连在一起 | Pangu, so the word must mean Pangu separating heaven and earth.
精卫填海/1 | 小鸟衔石子填大海 | Jingwei, so the word must mean Jingwei filling the sea.
夸父逐日/1 | 巨人追着太阳跑 | Kuafu, so the word must mean Kuafu chasing the sun.
牛郎织女/1 | 七月初七在鹊桥相会 | The cowherd and the weaver girl, so the word must mean the cowherd and the weaver girl.
天衣无缝/1 | 配合一点问题也没有 | Seamless, so the word must mean flawless.
八仙过海/1 | 各显神通用上绝招 | Each showing its skill, so the word must mean the Eight Immortals crossing the sea.
姜太公钓鱼/1 | 愿者上钩没人逼他 | Willing participants, so the word must mean Jiang Taigong fishing.
王婆卖瓜/1 | 总说自己做的菜最好 | Self-praise, so the word must mean Granny Wang selling melons.
孔融让梨/1 | 告诉孩子学会谦让 | Kong Rong, so the word must mean Kong Rong giving up the pears.
曹冲称象/1 | 小孩用船和石头称大象 | Cao Chong, so the word must mean Cao Chong weighing the elephant.
出处/1 | 成语在哪本古书里 | The source, so the word must mean source.
用典/1 | 古人写诗引用故事 | Allusion, so the word must mean to use allusions.
引经据典/1 | 一开口就是古书里的话 | Quoting the classics, so the word must mean to quote authoritative works.
来历/1 | 石碑老人说得清楚 | Its origin, so the word must mean origin.
掌故/1 | 熟悉北京老胡同的故事 | Anecdotes, so the word must mean historical anecdotes.
佳话/1 | 互助几十年在村里传 | A tale to treasure, so the word must mean much-told story.
美谈/1 | 还钱包成了大家口中的 | A story people praise, so the word must mean praised deed.
出自/1 | 温故知新来自论语 | From, so the word must mean to come from.
千古/1 | 故事一直流传 | For ages, so the word must mean through the ages.
原文/1 | 是我翻译的本来是古文 | The original text, so the word must mean original text.
苦尽甘来/1 | 多年努力过上好日子 | After bitterness sweetness, so the word must mean good days after hard ones.
乐极生悲/1 | 高兴得跳起来扭伤脚 | Joy turning to sorrow, so the word must mean extreme joy begets sorrow.
时来运转/1 | 失业几个月找到好工作 | Luck turning, so the word must mean one's luck changes.
好事多磨/1 | 不顺利但最后能办成 | Good things take time, so the word must mean good things come through trials.
柳暗花明/1 | 找不到出路突然有希望 | Light at the end of the tunnel, so the word must mean a new prospect opens up.
转危为安/1 | 病人经抢救脱离危险 | Out of danger, so the word must mean to pull through.
喜出望外/1 | 收到录取通知书 | Overjoyed, so the word must mean pleasantly surprised.
节外生枝/1 | 事情快办好别再出新问题 | Complications, so the word must mean to raise side issues.
失而复得/1 | 丢了的小狗跑回家 | Lost and found, so the word must mean to regain what was lost.
福无双至/1 | 丢钱包又弄坏手机 | Misfortunes never come singly, so the word must mean blessings never come in pairs.
苏格拉底/1 | 自己没写书靠学生记录 | Socrates, so the word must mean Socrates.
柏拉图/1 | 在雅典创办学园 | Plato, so the word must mean Plato.
亚里士多德/1 | 当过亚历山大的老师 | Aristotle, so the word must mean Aristotle.
赫拉克利特/1 | 人不能两次踏进同一条河 | Heraclitus, so the word must mean Heraclitus.
泰勒斯/1 | 认为万物本原是水 | Thales, so the word must mean Thales.
毕达哥拉斯/1 | 认为万物都是数 | Pythagoras, so the word must mean Pythagoras.
芝诺/1 | 最快的人追不上乌龟 | Zeno, so the word must mean Zeno.
第欧根尼/1 | 住在一个大缸里 | Diogenes, so the word must mean Diogenes.
犬儒学派/1 | 像狗一样简单生活 | The Cynics, so the word must mean Cynicism.
斯多葛学派/1 | 用理性控制情绪 | The Stoics, so the word must mean Stoicism.
笛卡尔/1 | 我思故我在 | Descartes, so the word must mean Descartes.
帕斯卡/1 | 发明计算器帮父亲算税 | Pascal, so the word must mean Pascal.
洛克/1 | 心灵像一块白板 | Locke, so the word must mean Locke.
卢梭/1 | 爱弥儿主张顺应天性 | Rousseau, so the word must mean Rousseau.
康德/1 | 散步邻居就知道几点 | Kant, so the word must mean Kant.
黑格尔/1 | 把辩证法发展成体系 | Hegel, so the word must mean Hegel.
叔本华/1 | 以悲观人生观闻名 | Schopenhauer, so the word must mean Schopenhauer.
萨特/1 | 拒绝诺贝尔文学奖 | Sartre, so the word must mean Sartre.
培根/1 | 知识就是力量 | Bacon, so the word must mean Francis Bacon.
维特根斯坦/1 | 哲学问题来自对语言的误解 | Wittgenstein, so the word must mean Wittgenstein.
孟子/1 | 主张人性本善 | Mencius, so the word must mean Mencius.
亚圣/1 | 孟子被尊为 | The Second Sage, so the word must mean Second Sage.
韩非子/1 | 法家集大成者 | Han Feizi, so the word must mean Han Feizi.
杨朱/1 | 主张贵己 | Yang Zhu, so the word must mean Yang Zhu.
惠施/1 | 庄子的朋友常辩论 | Hui Shi, so the word must mean Hui Shi.
公孙龙/1 | 白马非马 | Gongsun Long, so the word must mean Gongsun Long.
列子/1 | 能乘着风在天上走 | Liezi, so the word must mean Liezi.
管子/1 | 齐国管仲的尊称 | Guanzi, so the word must mean Guanzi.
告子/1 | 认为人性没有善和不善 | Gaozi, so the word must mean Gaozi.
先秦/1 | 孔子老子庄子的时期 | Pre-Qin, so the word must mean pre-Qin period.
见贤思齐/1 | 向身边优秀同学学习 | Emulating the worthy, so the word must mean to strive to equal the virtuous.
非礼勿视/1 | 不合礼的事不看 | Seeing no impropriety, so the word must mean look not at what is improper.
三十而立/1 | 孔子三十岁能自立 | Standing at thirty, so the word must mean established at thirty.
四十不惑/1 | 刚好四十岁 | Free of doubt at forty, so the word must mean no longer perplexed at forty.
知天命/1 | 五十而 | Knowing heaven's will, so the word must mean to know the will of heaven.
有教无类/1 | 不管穷富都愿意教 | Education for all, so the word must mean teaching without discrimination.
仁者爱人/1 | 有仁德的人关心别人 | The benevolent love others, so the word must mean the humane love people.
圣贤/1 | 古代读书人的榜样 | Sages, so the word must mean sages and worthies.
己所不欲/1 | 勿施于人 | What you do not want, so the word must mean what one does not wish for oneself.
君子/1 | 和而不同 | A gentleman, so the word must mean person of virtue.
上善若水/1 | 帮助万物却不争 | The highest good is like water, so the word must mean supreme goodness is like water.
道法自然/1 | 顺着自然规律做事 | Following nature, so the word must mean the Way follows nature.
无为而治/1 | 汉初让百姓休养生息 | Rule by non-action, so the word must mean to govern by doing nothing.
大巧若拙/1 | 看上去笨手笨脚 | Great skill looks clumsy, so the word must mean true skill appears clumsy.
庄周梦蝶/1 | 分不清梦见蝴蝶还是蝴蝶梦见自己 | The butterfly dream, so the word must mean Zhuangzi dreaming of a butterfly.
齐物论/1 | 从道看万物平等 | On the equality of things, so the word must mean Discourse on Making All Things Equal.
子非鱼/1 | 怎么知道鱼的快乐 | You are not a fish, so the word must mean you are not a fish.
道德经/1 | 老子五千多字 | The Tao Te Ching, so the word must mean Tao Te Ching.
坐忘/1 | 静坐忘掉一切 | Sitting in forgetfulness, so the word must mean sitting and forgetting.
心斋/1 | 让心清净不被杂念打扰 | Fasting of the heart, so the word must mean fasting of the mind.
周易/1 | 最古老的经典讲万物变化 | The Book of Changes, so the word must mean I Ching.
八卦/1 | 天地雷风水火山泽 | The eight trigrams, so the word must mean eight trigrams.
乾坤/1 | 扭转根本改变局面 | Heaven and earth, so the word must mean the universe.
太极/1 | 生出阴阳两仪 | The supreme ultimate, so the word must mean taiji.
五行/1 | 金木水火土 | The five elements, so the word must mean five phases.
天人合一/1 | 人和自然和谐相处 | Harmony of heaven and man, so the word must mean unity of heaven and humanity.
相生相克/1 | 木生火水克火 | Generating and overcoming, so the word must mean mutual generation and restraint.
自强不息/1 | 天行健君子以 | Ceaseless self-improvement, so the word must mean to strive ceaselessly.
厚德载物/1 | 地势坤君子以 | Virtue that carries all, so the word must mean great virtue bears all things.
浑然一体/1 | 园林建筑和山水好像天然生成 | A seamless whole, so the word must mean an integral whole.
王阳明/1 | 哲学家军事家书法家 | Wang Yangming, so the word must mean Wang Yangming.
陆九渊/1 | 心学的开创者 | Lu Jiuyuan, so the word must mean Lu Jiuyuan.
张载/1 | 为天地立心 | Zhang Zai, so the word must mean Zhang Zai.
二程/1 | 北宋一对理学家兄弟 | The Cheng brothers, so the word must mean the two Chengs.
理学/1 | 天地万物都有一个理 | Neo-Confucianism, so the word must mean School of Principle.
心学/1 | 道理就在自己心里 | The School of Mind, so the word must mean School of Mind.
知行合一/1 | 知道道理还要去做 | Unity of knowing and doing, so the word must mean unity of knowledge and action.
致良知/1 | 心里本来有分辨善恶的能力 | Extending innate knowing, so the word must mean to extend innate knowledge.
龙场悟道/1 | 被贬到贵州想通道理 | Enlightenment at Longchang, so the word must mean awakening at Longchang.
心即理/1 | 道理就在人的心中 | Mind is principle, so the word must mean the mind is principle.
非黑即白/1 | 不是好人就是坏人 | Black or white, so the word must mean all or nothing.
因果倒置/1 | 消防车引起了火灾 | Reversed causation, so the word must mean confusing cause and effect.
自圆其说/1 | 解释前后矛盾 | A consistent story, so the word must mean to make one's story hold together.
漏洞百出/1 | 编的理由谁也不信 | Full of holes, so the word must mean riddled with flaws.
强词夺理/1 | 明明错了还说是别人的错 | Arguing unreasonably, so the word must mean to argue speciously.
理屈词穷/1 | 被追问只好认错 | Out of arguments, so the word must mean to have no argument left.
胡搅蛮缠/1 | 顾客一直不让售货员走 | Pestering, so the word must mean to harass unreasonably.
颠倒黑白/1 | 他弄坏的却说别人弄坏 | Twisting the facts, so the word must mean to turn black into white.
牵强附会/1 | 成绩和星座联系在一起 | Far-fetched, so the word must mean strained interpretation.
无懈可击/1 | 对方一句也反驳不了 | Watertight, so the word must mean unassailable.
管中窥豹/1 | 只看一篇文章评价作家 | A partial view, so the word must mean to see only part.
一叶知秋/1 | 从小事看出风气变化 | A small sign, so the word must mean a straw in the wind.
见微知著/1 | 从很小的症状发现大病 | Reading small signs, so the word must mean to see the whole from a small clue.
触类旁通/1 | 学会一题解出一类题 | Learning by analogy, so the word must mean to grasp related things by analogy.
以小见大/1 | 一家人小故事写时代变化 | The big in the small, so the word must mean to show the large through the small.
由表及里/1 | 不能只看表面现象 | From surface to depth, so the word must mean from the outside in.
去伪存真/1 | 网上信息不能什么都信 | Sifting truth, so the word must mean to discard the false and keep the true.
认识论/1 | 人怎样获得知识 | Epistemology, so the word must mean epistemology.
方法论/1 | 科学研究要有正确的 | Methodology, so the word must mean methodology.
格物致知/1 | 对着竹子看了七天 | Investigating things, so the word must mean to study things to gain knowledge.
思想实验/1 | 爱因斯坦想象追着光跑 | A thought experiment, so the word must mean thought experiment.
电车难题/1 | 救五个人伤害另一个 | The trolley problem, so the word must mean trolley problem.
囚徒困境/1 | 只考虑自己对大家都不好 | The prisoner's dilemma, so the word must mean prisoner's dilemma.
缸中之脑/1 | 怎么知道世界是真实的 | Brain in a vat, so the word must mean brain in a vat.
奥卡姆剃刀/1 | 能用简单解释就不用复杂的 | Occam's razor, so the word must mean Occam's razor.
芝诺悖论/1 | 飞着的箭其实不动 | Zeno's paradoxes, so the word must mean Zeno's paradox.
说谎者悖论/1 | 我现在说的这句话是假话 | The liar paradox, so the word must mean liar paradox.
理发师悖论/1 | 罗素用来说明集合论问题 | The barber paradox, so the word must mean barber paradox.
中文房间/1 | 按规则处理汉字的机器算不算懂 | The Chinese room, so the word must mean Chinese room.
无知之幕/1 | 不知道出生在什么家庭 | The veil of ignorance, so the word must mean veil of ignorance.
怀疑论/1 | 皮浪对一切判断保持怀疑 | Scepticism, so the word must mean scepticism.
不可知论/1 | 事物本质永远无法认识 | Agnosticism, so the word must mean agnosticism.
决定论/1 | 知道所有原因就能预测将来 | Determinism, so the word must mean determinism.
宿命论/1 | 一切都是命中注定 | Fatalism, so the word must mean fatalism.
经验主义/1 | 知识都来自经验 | Empiricism, so the word must mean empiricism.
理性主义/1 | 理性是知识最可靠的来源 | Rationalism, so the word must mean rationalism.
实用主义/1 | 杜威是代表人物 | Pragmatism, so the word must mean pragmatism.
虚无主义/1 | 人生没有意义和价值 | Nihilism, so the word must mean nihilism.
存在主义/1 | 人先存在再通过选择决定自己 | Existentialism, so the word must mean existentialism.
形而上学/1 | 世界的本原是什么 | Metaphysics, so the word must mean metaphysics.
浩然之气/1 | 培养正直的精神 | Noble spirit, so the word must mean moral courage.
舍生取义/1 | 生命和正义不能同时得到 | Dying for righteousness, so the word must mean to give one's life for justice.
民贵君轻/1 | 国家根本在于百姓 | The people first, so the word must mean the people matter more than the ruler.
鱼与熊掌/1 | 多玩和考第一不可兼得 | Fish and bear's paw, so the word must mean you cannot have both.
五十步笑百步/1 | 迟到五分钟笑迟到十分钟 | The pot calling the kettle black, so the word must mean to mock others for a fault one shares.
性善论/1 | 每个人天生有同情心 | The goodness of human nature, so the word must mean theory that human nature is good.
性恶论/1 | 人要靠学习和礼法才变好 | The badness of human nature, so the word must mean theory that human nature is bad.
生于忧患/1 | 死于安乐 | Born of adversity, so the word must mean to thrive in adversity.
牺牲/1 | 照顾妈妈放弃休息时间 | Sacrificed, so the word must mean to sacrifice.
不朽/1 | 立德立功立言 | Immortal, so the word must mean imperishable.
刹那/1 | 流星划过就消失 | An instant, so the word must mean instant.
白驹过隙/1 | 人生很短要珍惜每一天 | Fleeting, so the word must mean time flies like a horse past a crack.
逝者如斯/1 | 孔子站在河边感叹时间 | So it flows, so the word must mean time passes like the river.
稍纵即逝/1 | 机会看准要马上抓 | Fleeting, so the word must mean gone in a flash.
沧海桑田/1 | 大海变成了平原 | Great changes, so the word must mean seas turned to mulberry fields.
变化无常/1 | 山上刚晴又下雨 | Changeable, so the word must mean ever-changing.
时过境迁/1 | 当年烦恼现在不算什么 | Times change, so the word must mean things change with time.
物是人非/1 | 老房子还在邻居都搬走 | Places remain but people change, so the word must mean things remain but people are gone.
斗转星移/1 | 几十年小树长成大树 | Time passing, so the word must mean the stars shift.
匆匆/1 | 吃了几口饭赶去上班 | Hurriedly, so the word must mean hastily.
知足常乐/1 | 有吃有住家人健康就好 | Content, so the word must mean contentment brings happiness.
安贫乐道/1 | 颜回住小巷从不抱怨 | Content in poverty, so the word must mean to be content in poverty.
淡泊名利/1 | 科学家把奖金捐给学校 | Indifferent to fame, so the word must mean indifferent to fame and gain.
宁静致远/1 | 诸葛亮给儿子的信 | Calm to go far, so the word must mean tranquillity leads far.
随遇而安/1 | 搬到哪里都能很快适应 | Easygoing, so the word must mean at ease wherever one is.
喜悦/1 | 种的花开了心里很高兴 | Joy, so the word must mean joy.
心浮气躁/1 | 做研究要沉下心 | Impatient, so the word must mean restless and impetuous.
安逸/1 | 辞掉工作去山区教书 | Comfort, so the word must mean easy and comfortable.
迷茫/1 | 不知道该选什么专业 | Lost, so the word must mean confused.
顺其自然/1 | 努力过了结果不重要 | Letting it be, so the word must mean to let nature take its course.
祸福相倚/1 | 坏事里藏着好事 | Fortune and misfortune intertwined, so the word must mean good and bad fortune depend on each other.
物极必反/1 | 吃得太多反而伤身体 | Extremes reverse, so the word must mean things turn into their opposites at the extreme.
否极泰来/1 | 艰难后过上好日子 | After the storm, so the word must mean bad luck gives way to good.
对立统一/1 | 冷和热上和下 | The unity of opposites, so the word must mean unity of opposites.
量变/1 | 水温一度一度升高 | Quantitative change, so the word must mean quantitative change.
质变/1 | 积累多了变成另一种状态 | Qualitative change, so the word must mean qualitative change.
相对/1 | 山比石头大比地球小 | Relative, so the word must mean relative.
扬弃/1 | 保留好的去掉不好的 | Sublation, so the word must mean to sift and keep the best.
内因/1 | 能不能进步自己是根本 | Internal causes, so the word must mean internal cause.
外因/1 | 温度只是条件 | External causes, so the word must mean external cause.
冥想/1 | 闭上眼睛让自己平静 | Meditation, so the word must mean to meditate.
当头棒喝/1 | 批评让他明白问题 | A wake-up call, so the word must mean a sharp warning.
机锋/1 | 禅师说话意思要细细体会 | Zen wit, so the word must mean pointed Zen remarks.
顿悟/1 | 看到落叶一下子想通 | Sudden insight, so the word must mean sudden enlightenment.
沉思/1 | 站在窗前想了很久 | Deep thought, so the word must mean contemplation.
内省/1 | 吾日三省吾身 | Introspection, so the word must mean to examine oneself.
反思/1 | 考试失败后想学习方法 | Reflecting, so the word must mean to reflect on.
静坐/1 | 每晚半小时什么也不想 | Sitting quietly, so the word must mean to sit in meditation.
公案/1 | 禅宗看起来不合常理的问题 | A koan, so the word must mean koan.
渐悟/1 | 一步一步修行 | Gradual enlightenment, so the word must mean gradual enlightenment.
傻瓜/1 | 下大雨还在外面等我 | A fool, so the word must mean silly.
傻笑/1 | 收到通知书一个人坐着笑 | Grinning, so the word must mean to grin foolishly.
装傻/1 | 弟弟说自己什么也没看见 | Playing dumb, so the word must mean to play dumb.
傻乎乎/1 | 小狗追着自己尾巴转圈 | Silly, so the word must mean dopey.
傻眼/1 | 到机场才发现没带护照 | Stunned, so the word must mean to be dumbfounded.
犯傻/1 | 重要考试一点不复习 | Being foolish, so the word must mean to act stupidly.
愚蠢/1 | 相信骗人的广告 | Stupid, so the word must mean foolish.
蠢事/1 | 后悔年轻时做的 | Stupid things, so the word must mean foolish deeds.
自作聪明/1 | 没看说明书就安装装错了 | Too clever by half, so the word must mean to think oneself clever.
耍小聪明/1 | 考试把答案写在手上 | Petty tricks, so the word must mean to use petty cleverness.
急躁/1 | 做实验要一步一步来 | Impatient, so the word must mean rash.
暴躁/1 | 一点小事就大喊大叫 | Hot-tempered, so the word must mean irascible.
浮躁/1 | 做学问要沉得住气 | Restless, so the word must mean impetuous.
毛躁/1 | 作业里常有写错的字 | Careless, so the word must mean slapdash.
戒骄戒躁/1 | 赢了以后继续努力 | Staying humble, so the word must mean to guard against pride and rashness.
好脾气/1 | 从来不对学生发火 | Good-natured, so the word must mean good temper.
耍脾气/1 | 没买到玩具在门口不走 | Throwing a tantrum, so the word must mean to throw a tantrum.
倔脾气/1 | 决定的事谁也劝不动 | Stubborn, so the word must mean obstinate temper.
急性子/1 | 等车五分钟就不耐烦 | Impatient, so the word must mean impatient person.
慢性子/1 | 吃一顿饭要一小时 | Slow-paced, so the word must mean slowcoach.
沉闷/1 | 开会三小时大家不说话 | Dull, so the word must mean oppressive.
纳闷/1 | 昨天还好今天怎么没来 | Puzzled, so the word must mean to wonder.
解闷/1 | 奶奶一个人养只小猫 | Keeping boredom away, so the word must mean to relieve boredom.
闷闷不乐/1 | 好朋友搬走以后 | Glum, so the word must mean depressed.
生闷气/1 | 不满就说出来 | Sulking, so the word must mean to sulk.
闷声不响/1 | 吃完饭就回房间 | Silently, so the word must mean without a word.
烦躁/1 | 天气又热又吵 | Irritable, so the word must mean fidgety.
惦记/1 | 妈妈天天想着外地的他 | Thinking of him, so the word must mean to keep thinking about.
懊悔/1 | 当初没听老师的话 | Regret, so the word must mean to regret.
懊恼/1 | 下大雨偏偏没带雨衣 | Vexed, so the word must mean annoyed.
倔强/1 | 摔倒好几次又站起来 | Stubbornly, so the word must mean unbending.
认死理/1 | 规定上没写的一件不做 | Rigid, so the word must mean inflexible.
死心眼/1 | 这条路不通就换一条 | Stubborn, so the word must mean single-minded.
一根筋/1 | 一旦开始非做完不可 | One-track, so the word must mean dogged.
咬定/1 | 一口说那天在家 | Insisting, so the word must mean to assert firmly.
咬紧牙关/1 | 最后一公里跑到终点 | Gritting her teeth, so the word must mean to grit one's teeth.
发狠/1 | 要一年内学会游泳 | Resolved, so the word must mean to make a determined effort.
狠心/1 | 让孩子一个人去外地上学 | Steeling themselves, so the word must mean to harden one's heart.
逞强/1 | 发烧还要去上课 | Pushing himself, so the word must mean to try to prove oneself.
较劲/1 | 暗中比谁成绩更好 | Competing, so the word must mean to vie with.
瞪眼/1 | 他刚想插话妈妈就 | A glare, so the word must mean to glare.
干瞪眼/1 | 火车开走了晚到的他 | Watching helplessly, so the word must mean to look on helplessly.
目瞪口呆/1 | 帽子里拿出小鸟 | Agape, so the word must mean stunned.
瞅见/1 | 在超市门口看到你哥哥 | Spotted, so the word must mean to catch sight of.
瞅准/1 | 守门员一把抓住球 | Seizing the moment, so the word must mean to watch for exactly.
瞧见/1 | 我的眼镜找了半天 | Seen, so the word must mean to see.
瞧不起/1 | 做小生意的也很辛苦 | Looking down on, so the word must mean to look down on.
走着瞧/1 | 你说我学不会 | Wait and see, so the word must mean we shall see.
眨眼/1 | 灯光太亮不停地 | Blinking, so the word must mean to blink.
一眨眼/1 | 时间过得快就到年底 | In a blink, so the word must mean in the twinkling of an eye.
睁眼/1 | 早上一醒发现下雪 | Opening his eyes, so the word must mean to open one's eyes.
眼睁睁/1 | 看着风把气球吹走 | Helplessly, so the word must mean looking on helplessly.
睁一只眼闭一只眼/1 | 管理员不能装作没看见 | Turning a blind eye, so the word must mean to turn a blind eye.
皱眉/1 | 看到成绩单说又退步了 | Frowning, so the word must mean to frown.
皱纹/1 | 爷爷额头上有很多 | Wrinkles, so the word must mean wrinkle.
不屑/1 | 听了他的话露出表情 | Disdain, so the word must mean disdainful.
发愣/1 | 看着窗外老师叫他没听见 | Staring blankly, so the word must mean to be in a daze.
愣住/1 | 听到意外消息 | Stunned, so the word must mean to be stunned.
愣神/1 | 一走神杯子掉了 | A lapse of attention, so the word must mean to space out.
耸肩/1 | 问他安排他什么也没说 | A shrug, so the word must mean to shrug.
惊吓/1 | 小猫躲在床底下不出来 | A fright, so the word must mean scare.
吓人/1 | 电影看一半就不敢看 | Scary, so the word must mean frightening.
恐吓/1 | 逼人交出钱财 | Intimidation, so the word must mean to threaten.
吓一跳/1 | 他从门后跳出来 | Startled, so the word must mean to give a start.
躲藏/1 | 小猫在草地里一动不动 | Hiding, so the word must mean to hide.
躲避/1 | 地震时找安全的地方 | Taking cover, so the word must mean to shelter from.
躲闪/1 | 球飞来来不及让开 | Dodging, so the word must mean to dodge.
东躲西藏/1 | 做了坏事的人不安心 | On the run, so the word must mean to hide here and there.
悄悄/1 | 妹妹睡着我们走出房间 | Quietly, so the word must mean quietly.
悄无声息/1 | 夜里大雪盖住城市 | Without a sound, so the word must mean silently.
瞎说/1 | 没调查清楚就别说 | Talking nonsense, so the word must mean to talk rubbish.
瞎猜/1 | 这道题要认真计算 | Guessing blindly, so the word must mean to guess wildly.
瞎忙/1 | 没计划整天忙不出结果 | Busy for nothing, so the word must mean to bustle aimlessly.
瞎编/1 | 故事根本没发生过 | Made up, so the word must mean to make up.
瞎操心/1 | 孩子长大了你别 | Worrying needlessly, so the word must mean to worry for nothing.
糊涂/1 | 年纪大了忘了眼镜放哪儿 | Muddled, so the word must mean confused.
稀里糊涂/1 | 签了合同后来发现上当 | Without thinking, so the word must mean muddle-headedly.
丢三落四/1 | 又把作业本忘在家里 | Forgetful, so the word must mean scatterbrained.
迷糊/1 | 刚睡醒把牙膏当洗面奶 | Groggy, so the word must mean dazed.
马大哈/1 | 出门常忘带东西 | A scatterbrain, so the word must mean careless person.
蹲下/1 | 帮小女孩系鞋带 | Crouching, so the word must mean to squat down.
抬头/1 | 一看天上有道光 | Looking up, so the word must mean to raise one's head.
敏捷/1 | 小猴子一下爬到树顶 | Nimble, so the word must mean agile.
扔掉/1 | 过期食物不能再吃 | Thrown away, so the word must mean to throw away.
扑通/1 | 他一声跳进河里 | A splash, so the word must mean splash.
踩踏/1 | 请不要踩草地 | Trampling, so the word must mean to trample.
挺胸/1 | 站队时抬头不弯腰 | Chest out, so the word must mean to throw out one's chest.
撞击/1 | 海浪不停打着石头 | Pounding, so the word must mean to strike.
掏出/1 | 从口袋拿出纸条 | Pulled out, so the word must mean to take out.
撒腿/1 | 铃声一响孩子们往外跑 | Breaking into a run, so the word must mean to take to one's heels.
碰见/1 | 在书店遇到小学老师 | Ran into, so the word must mean to run into.
碰巧/1 | 想找他他正好来了 | By chance, so the word must mean as it happens.
碰面/1 | 约好三点在公园门口 | Meeting up, so the word must mean to meet up.
碰运气/1 | 没准备就去考试 | Trying his luck, so the word must mean to try one's luck.
碰壁/1 | 找工作处处不顺 | Rebuffed, so the word must mean to hit a wall.
碰钉子/1 | 经理一句话就拒绝 | A snub, so the word must mean to be rebuffed.
撞见/1 | 偷吃零食被老师看到 | Caught, so the word must mean to catch in the act.
趁机/1 | 下课了向老师请教 | Taking the chance, so the word must mean to seize the opportunity.
趁早/1 | 计划不行早点改 | Early, so the word must mean as soon as possible.
趁热打铁/1 | 学过的当天就复习 | Striking while the iron is hot, so the word must mean to strike while the iron is hot.
玩耍/1 | 孩子们在草地上 | Playing, so the word must mean to play.
捉迷藏/1 | 小时候在院子里玩 | Hide-and-seek, so the word must mean hide-and-seek.
扑克/1 | 下雨天一家人打 | Cards, so the word must mean playing cards.
疯玩/1 | 放假在外面一整天 | Playing wildly, so the word must mean to play like mad.
耍花招/1 | 想骗大家被识破 | Playing tricks, so the word must mean to play tricks.
耍赖/1 | 输的人请客不能不认 | Going back on one's word, so the word must mean to welsh.
捉弄/1 | 把同学书包藏起来 | Playing pranks, so the word must mean to tease.
卖弄/1 | 在别人面前显示知识 | Showing off, so the word must mean to show off.
摆弄/1 | 一有空就修旧收音机 | Fiddling with, so the word must mean to tinker with.
撒欢/1 | 小狗到草地上跑起来 | Frolicking, so the word must mean to frisk about.
惹事/1 | 在外面从不闯祸 | Making trouble, so the word must mean to stir up trouble.
招惹/1 | 这条狗很凶别去 | Provoking, so the word must mean to provoke.
惹祸/1 | 玩火容易引起火灾 | Causing trouble, so the word must mean to court disaster.
惹是生非/1 | 小时候常闯祸 | Troublemaking, so the word must mean to stir up trouble.
惹不起/1 | 他脾气大谁也 | Untouchable, so the word must mean cannot afford to offend.
冲撞/1 | 说话太直得罪客人 | Offending, so the word must mean to offend.
抬杠/1 | 你说东他偏说西 | Contradicting, so the word must mean to bicker.
撕破脸/1 | 两家公司打起官司 | Falling out openly, so the word must mean to openly fall out.
耍嘴皮子/1 | 光说没用要行动 | All talk, so the word must mean to show off with words.
撒气/1 | 考得不好别拿弟弟 | Venting, so the word must mean to vent one's anger.
爽快/1 | 请他帮忙很快答应 | Readily, so the word must mean straightforwardly.
豪爽/1 | 常请朋友吃饭 | Generous, so the word must mean open-handed.
直爽/1 | 有意见当面说 | Frank, so the word must mean forthright.
爽朗/1 | 院子里传来爷爷的笑声 | Hearty, so the word must mean hearty.
乖巧/1 | 小女孩见客人先问好 | Sweet, so the word must mean well-behaved.
心直口快/1 | 说话伤人其实没坏心 | Outspoken, so the word must mean frank and outspoken.
直肠子/1 | 心里想什么说什么 | Straight-talking, so the word must mean straight shooter.
刀子嘴豆腐心/1 | 奶奶嘴上骂心里疼我 | Sharp tongue soft heart, so the word must mean harsh words but a kind heart.
老好人/1 | 谁也不得罪 | A people-pleaser, so the word must mean someone who offends no one.
自来熟/1 | 第一天就和大家打成一片 | Instantly friendly, so the word must mean someone who warms up fast.
小心眼/1 | 人家只是开玩笑 | Petty, so the word must mean narrow-minded.
好面子/1 | 不懂也不愿问 | Proud, so the word must mean concerned with face.
胆怯/1 | 第一次上台声音很小 | Timid, so the word must mean nervous.
墙头草/1 | 谁力量大就听谁 | A fence-sitter, so the word must mean turncoat.
逞能/1 | 一个人搬两张桌子扭伤腰 | Showing off his strength, so the word must mean to show off one's ability.
傲慢/1 | 同事都不喜欢他的态度 | Arrogant, so the word must mean haughty.
任性/1 | 想要什么就给什么 | Wilful, so the word must mean wilful.
撒娇/1 | 抱着爸爸手臂要玩具 | Coaxing, so the word must mean to act cute.
嘴馋/1 | 口袋里总装着零食 | Greedy for snacks, so the word must mean fond of eating.
眼馋/1 | 看着同学的新球鞋 | Envious, so the word must mean to covet.
起劲/1 | 正玩得谁也不想回家 | Enthusiastically, so the word must mean with gusto.
带劲/1 | 球赛观众一直欢呼 | Exciting, so the word must mean thrilling.
干劲/1 | 新员工每天很早到 | Drive, so the word must mean enthusiasm for work.
使劲/1 | 瓶盖太紧拧好几下 | Hard, so the word must mean with effort.
劲头/1 | 看他学习的那股 | Zeal, so the word must mean vigour.
费劲/1 | 箱子太重搬起来 | Hard work, so the word must mean strenuous.
差劲/1 | 等一小时才上菜 | Awful, so the word must mean lousy.
没劲/1 | 电影看一半睡着了 | Boring, so the word must mean dull.
挺身而出/1 | 有人落水跳下去救 | Stepping forward, so the word must mean to step forward bravely.
加把劲/1 | 只有最后一题了 | One more push, so the word must mean to make an extra effort.
混日子/1 | 年轻人要有理想 | Drifting, so the word must mean to idle away one's days.
蒙混过关/1 | 抄作业想过去被发现 | Getting away with it, so the word must mean to muddle through.
混为一谈/1 | 学习好和品德好是两回事 | Lumping together, so the word must mean to confuse one with another.
鱼目混珠/1 | 用假货冒充名牌 | Passing off fakes, so the word must mean to pass off the fake as genuine.
弄错/1 | 对不起把名字搞错 | The speaker apologises for getting your name wrong, so the word must mean to get wrong.
弄清/1 | 先找到原因再解决 | Clearing up, so the word must mean to make clear.
弄虚作假/1 | 科学数据必须真实 | Faking, so the word must mean to practise fraud.
糊弄/1 | 报告随便写来应付我 | Fobbing off, so the word must mean to fool.
混乱/1 | 停电后地铁站 | Chaos, so the word must mean confusion.
弄坏/1 | 借来的相机别 | Broken, so the word must mean to break.
亿万/1 | 全世界观众 | Hundreds of millions, so the word must mean hundreds of millions.
数以亿计/1 | 银河系里的恒星 | Countless, so the word must mean in the hundreds of millions.
亿万年/1 | 地球经过很长时间变化 | Aeons, so the word must mean hundreds of millions of years.
十亿/1 | 中国人口超过 | A billion, so the word must mean billion.
渺小/1 | 和宇宙相比人类 | Tiny, so the word must mean insignificant.
浩渺/1 | 望着大海心情开阔 | Vast, so the word must mean boundless.
茫茫/1 | 宇宙中地球是小蓝点 | Boundless, so the word must mean vast and hazy.
天文单位/1 | 大约一亿五千万公里 | An astronomical unit, so the word must mean astronomical unit.
光速/1 | 每秒三十万公里 | The speed of light, so the word must mean speed of light.
宇宙膨胀/1 | 远处星系都在离去 | Cosmic expansion, so the word must mean expansion of the universe.
陨石/1 | 从天上掉下来四十多亿年 | A meteorite, so the word must mean meteorite.
陨落/1 | 伟大科学家去世一颗巨星 | Fallen, so the word must mean to fall.
陨石坑/1 | 五万年前太空石头撞出来的 | A crater, so the word must mean impact crater.
坠落/1 | 大石头从山上掉下来 | Falling, so the word must mean to fall.
滑翔/1 | 老鹰在高空慢慢飞 | Gliding, so the word must mean to glide.
下坠/1 | 气球漏气向地面 | Sinking, so the word must mean to drop.
流星雨/1 | 每年八月英仙座 | A meteor shower, so the word must mean meteor shower.
飘落/1 | 雪花落在头发上 | Drifting down, so the word must mean to float down.
掠过/1 | 鸟从水面轻轻飞过 | Skimming, so the word must mean to sweep past.
太空垃圾/1 | 报废卫星和火箭残片 | Space debris, so the word must mean space junk.
木星/1 | 太阳系最大的行星 | Jupiter, so the word must mean Jupiter.
土星/1 | 周围有一圈美丽光环 | Saturn, so the word must mean Saturn.
金星/1 | 除月亮外夜空最亮 | Venus, so the word must mean Venus.
水星/1 | 离太阳最近八十八天一圈 | Mercury, so the word must mean Mercury.
天王星/1 | 几乎躺着绕太阳转 | Uranus, so the word must mean Uranus.
海王星/1 | 先用数学预言后才找到 | Neptune, so the word must mean Neptune.
冥王星/1 | 二零零六年后叫矮行星 | Pluto, so the word must mean Pluto.
土星环/1 | 主要由冰块和石块组成 | Saturn's rings, so the word must mean rings of Saturn.
行星环/1 | 木星天王星海王星也有很暗 | Planetary rings, so the word must mean planetary ring.
小行星带/1 | 火星和木星之间 | The asteroid belt, so the word must mean asteroid belt.
椭圆/1 | 行星轨道不是正圆 | An ellipse, so the word must mean ellipse.
自转/1 | 一周二十四小时有昼夜 | Rotation, so the word must mean rotation.
公转/1 | 绕太阳一周是一年 | Revolution, so the word must mean orbit.
公转轨道/1 | 八大行星差不多在同一平面 | Orbits, so the word must mean orbital path.
近地点/1 | 满月看起来特别大 | Perigee, so the word must mean perigee.
远地点/1 | 离地球大约四十万公里 | Apogee, so the word must mean apogee.
地轴/1 | 倾斜才有四季 | The axis, so the word must mean earth's axis.
万有引力/1 | 牛顿解释行星绕太阳运动 | Gravitation, so the word must mean universal gravitation.
引力波/1 | 二零一五年第一次探测到 | Gravitational waves, so the word must mean gravitational wave.
引潮力/1 | 海水每天涨落两次 | The tidal force, so the word must mean tide-generating force.
白矮星/1 | 体积像地球质量像太阳 | A white dwarf, so the word must mean white dwarf.
红巨星/1 | 五十亿年后太阳会膨胀成 | A red giant, so the word must mean red giant.
中子星/1 | 方糖大小上亿吨 | A neutron star, so the word must mean neutron star.
超新星/1 | 宋代记录白天都能看见 | A supernova, so the word must mean supernova.
双星/1 | 看起来一颗其实一对 | Binary stars, so the word must mean double star.
星团/1 | 模糊的光由很多恒星组成 | A star cluster, so the word must mean star cluster.
星云/1 | 气体和尘埃聚集形成恒星 | A nebula, so the word must mean nebula.
恒星系/1 | 以太阳为中心 | A star system, so the word must mean stellar system.
星等/1 | 数字越小星星越亮 | Magnitude, so the word must mean stellar magnitude.
亮度/1 | 台灯看书时调亮 | Brightness, so the word must mean brightness.
夜空/1 | 星星一闪一闪 | The night sky, so the word must mean night sky.
星光/1 | 借着微弱的光走山路 | Starlight, so the word must mean starlight.
闪烁/1 | 远处灯光在雨中 | Twinkling, so the word must mean to flicker.
北极星/1 | 迷路时靠它找北方 | The Pole Star, so the word must mean Polaris.
北斗七星/1 | 北方天空七颗很亮的星 | The Big Dipper, so the word must mean Big Dipper.
星座/1 | 星空分成八十八个 | Constellations, so the word must mean constellation.
银河系/1 | 一千多亿颗恒星 | The Milky Way galaxy, so the word must mean Milky Way.
天河/1 | 乡下夏夜白色一条横在天上 | The Milky Way, so the word must mean the heavenly river.
星图/1 | 拿着它找星座 | A star chart, so the word must mean star map.
星辰/1 | 古人仰望想象传说 | Stars, so the word must mean the stars.
太阳黑子/1 | 多的年份太阳活动强 | Sunspots, so the word must mean sunspot.
太阳风/1 | 粒子进入大气层发出极光 | The solar wind, so the word must mean solar wind.
日全食/1 | 白天突然像夜晚一样黑 | A total solar eclipse, so the word must mean total solar eclipse.
日环食/1 | 太阳像金色圆环 | An annular eclipse, so the word must mean annular eclipse.
月食/1 | 地球影子落在月亮上 | A lunar eclipse, so the word must mean lunar eclipse.
满月/1 | 中秋节晚上一轮 | A full moon, so the word must mean full moon.
新月/1 | 初一前后几乎看不到 | A new moon, so the word must mean new moon.
月相/1 | 月亮圆缺变化 | Phases, so the word must mean lunar phase.
天狗吃月亮/1 | 古人不明白月食原因 | A heavenly dog, so the word must mean the dog eating the moon.
环形山/1 | 月亮表面圆形的坑 | Craters, so the word must mean lunar crater.
昼夜/1 | 工人们白天晚上不停 | Day and night, so the word must mean day and night.
极昼/1 | 北极夏天太阳整天不落 | The midnight sun, so the word must mean polar day.
旭日东升/1 | 海面上一片金光 | The rising sun, so the word must mean the sun rising in the east.
昼夜温差/1 | 沙漠白天热晚上冷 | The day-night temperature gap, so the word must mean diurnal temperature range.
凌晨/1 | 四点起床送牛奶 | Early morning, so the word must mean small hours.
黎明/1 | 东方天空渐渐发白 | Dawn, so the word must mean dawn.
曙光/1 | 治这种病终于有了希望 | A glimmer of hope, so the word must mean first light.
黄昏/1 | 鸟儿飞回树林 | Dusk, so the word must mean dusk.
昏暗/1 | 光线看不清书上的字 | Dim, so the word must mean gloomy.
黯淡/1 | 天亮后星光 | Faint, so the word must mean dim.
光芒/1 | 太阳照亮整个山谷 | Rays, so the word must mean radiance.
光芒万丈/1 | 太阳从海面升起 | Shining brilliantly, so the word must mean radiant in all directions.
彩虹/1 | 雨停了天边一道 | A rainbow, so the word must mean rainbow.
蔚蓝/1 | 从太空看地球的颜色 | Azure, so the word must mean sky blue.
忽明忽暗/1 | 星星好像在眨眼 | Flickering, so the word must mean now bright now dim.
洒落/1 | 阳光透过树叶照在小路 | Scattered, so the word must mean to spill down.
光谱/1 | 分析星光知道恒星组成 | The spectrum, so the word must mean spectrum.
红移/1 | 星系正在离我们而去 | Redshift, so the word must mean redshift.
宇宙射线/1 | 宇航员在太空中受照射 | Cosmic rays, so the word must mean cosmic ray.
皓月当空/1 | 中秋一家人赏月 | A bright moon above, so the word must mean a bright moon in the sky.
地壳/1 | 运动引起地震火山 | The crust, so the word must mean earth's crust.
外壳/1 | 手机金属做的 | The casing, so the word must mean outer shell.
贝壳/1 | 孩子们在海滩上找到 | Shells, so the word must mean seashell.
蛋壳/1 | 很薄一碰就破 | Eggshell, so the word must mean eggshell.
大气层/1 | 流星摩擦燃烧发光 | The atmosphere, so the word must mean atmosphere.
臭氧层/1 | 挡住大部分紫外线 | The ozone layer, so the word must mean ozone layer.
地平线/1 | 太阳从上面慢慢升起 | The horizon, so the word must mean horizon.
天际/1 | 大雁飞向远方 | The horizon, so the word must mean the edge of the sky.
天顶/1 | 赤道中午太阳接近头顶 | The zenith, so the word must mean zenith.
白茫茫/1 | 下了一夜大雪的田野 | A white expanse, so the word must mean a vast whiteness.
扁平/1 | 银河系像一个圆盘 | Flat, so the word must mean flat.
扁圆/1 | 地球两极稍微扁一点 | Oblate, so the word must mean oblate.
垂直/1 | 旗杆和地面 | Perpendicular, so the word must mean vertical.
垂线/1 | 从直线外一点画向这条直线 | A perpendicular, so the word must mean perpendicular line.
下垂/1 | 柳树枝条长长到水面 | Hanging down, so the word must mean to droop.
侧面/1 | 照片只能看到半边脸 | The side, so the word must mean side view.
横向/1 | 表格这样是日期纵向是科目 | Horizontally, so the word must mean horizontal.
纵横/1 | 街道交错像一张大网 | Crisscrossing, so the word must mean in all directions.
横跨/1 | 大桥连接长江两岸 | Spanning, so the word must mean to span.
横穿/1 | 行人不要随意过马路 | Crossing, so the word must mean to cross.
观星/1 | 去郊外看城里看不到的星星 | Stargazing, so the word must mean to stargaze.
天象/1 | 日食流星等 | Celestial events, so the word must mean astronomical phenomena.
天文馆/1 | 参观了解宇宙知识 | A planetarium, so the word must mean planetarium.
射电望远镜/1 | 中国天眼口径五百米 | A radio telescope, so the word must mean radio telescope.
天文望远镜/1 | 拍到土星光环 | A telescope, so the word must mean astronomical telescope.
瞄准/1 | 望远镜对着月亮 | Aimed, so the word must mean to aim at.
深空探测/1 | 月球和火星都是目标 | Deep-space exploration, so the word must mean deep space exploration.
探月/1 | 绕落回三步 | Lunar exploration, so the word must mean lunar exploration.
天文观测/1 | 高山空气稀薄干燥 | Astronomical observation, so the word must mean astronomical observation.
星空摄影/1 | 半夜带相机上山拍银河 | Astrophotography, so the word must mean astrophotography.
载人航天/1 | 神舟五号送第一位航天员 | Crewed spaceflight, so the word must mean human spaceflight.
飘浮/1 | 空间站里东西在空中 | Floating, so the word must mean to float.
太空舱/1 | 宇航员在里面吃饭睡觉 | The capsule, so the word must mean space capsule.
云霄/1 | 火箭喷火直冲 | The skies, so the word must mean the heavens.
太空行走/1 | 二零零八年第一次 | A spacewalk, so the word must mean spacewalk.
微重力/1 | 水变成漂浮的水球 | Microgravity, so the word must mean microgravity.
中国空间站/1 | 又叫天宫 | China's space station, so the word must mean the Chinese space station.
对接/1 | 飞船和空间站连在一起 | Docked, so the word must mean to dock.
升空/1 | 火箭点火带飞船上去 | Lifting off, so the word must mean to lift off.
倒计时/1 | 数到零就点火 | A countdown, so the word must mean countdown.
发射场/1 | 海南靠近赤道 | A launch site, so the word must mean launch site.
着陆器/1 | 第一次在月球背面降落 | A lander, so the word must mean lander.
火星车/1 | 祝融号在火星表面工作 | A rover, so the word must mean Mars rover.
卫星导航/1 | 开车到陌生地方不迷路 | Satellite navigation, so the word must mean satellite navigation.
北斗/1 | 中国自己的导航系统 | BeiDou, so the word must mean BeiDou.
同步卫星/1 | 好像一直停在同一个地方 | A geostationary satellite, so the word must mean geosynchronous satellite.
气象卫星/1 | 天气预报资料来自 | Weather satellites, so the word must mean meteorological satellite.
通信卫星/1 | 海上轮船打电话上网 | Communications satellites, so the word must mean communications satellite.
卫星云图/1 | 天气预报播放云的分布 | Satellite images, so the word must mean satellite cloud picture.
航天器/1 | 卫星飞船空间站 | Spacecraft, so the word must mean spacecraft.
大爆炸/1 | 一百三十八亿年前宇宙起源 | The Big Bang, so the word must mean Big Bang.
奇点/1 | 宇宙最初极小的一点 | A singularity, so the word must mean singularity.
暗物质/1 | 不发光却有引力 | Dark matter, so the word must mean dark matter.
星际/1 | 未来人类也许能旅行 | Interstellar, so the word must mean interstellar.
外星人/1 | 还没找到存在的证据 | Aliens, so the word must mean extraterrestrial.
系外行星/1 | 已发现几千颗 | Exoplanets, so the word must mean exoplanet.
宜居带/1 | 地球表面有液态水 | The habitable zone, so the word must mean habitable zone.
天圆地方/1 | 古人对天地形状的看法 | Round heaven and square earth, so the word must mean heaven is round and earth square.
渺茫/1 | 大海里找戒指 | Slim, so the word must mean remote.
迄今为止/1 | 地球是唯一有生命的星球 | So far, so the word must mean up to now.
上旬/1 | 十月一日 | Early in the month, so the word must mean first ten days of a month.
中旬/1 | 五月十五日 | Mid-month, so the word must mean middle ten days of a month.
下旬/1 | 一月三十一日 | Late in the month, so the word must mean last ten days of a month.
芒种/1 | 北方农民忙收麦子 | Grain in Ear, so the word must mean Grain in Ear solar term.
一晃/1 | 十年过去孩子长大 | In a flash, so the word must mean in the blink of an eye.
忽然/1 | 正上课灯灭了 | Suddenly, so the word must mean suddenly.
摇晃/1 | 船在大风中 | Rocking, so the word must mean to sway.
晃动/1 | 地震时杯子 | Shaking, so the word must mean to shake.
忽略/1 | 只顾学习不顾身体 | Neglected, so the word must mean to overlook.
疏忽/1 | 一时不小心写错时间 | Carelessness, so the word must mean negligence.
细胞核/1 | 遗传物质储存在里面 | The nucleus, so the word must mean cell nucleus.
细胞膜/1 | 控制物质进出细胞 | The cell membrane, so the word must mean cell membrane.
细胞质/1 | 线粒体等分布在其中 | The cytoplasm, so the word must mean cytoplasm.
细胞壁/1 | 植物有动物没有 | The cell wall, so the word must mean cell wall.
细胞分裂/1 | 使细胞数量增加 | Cell division, so the word must mean cell division.
单细胞/1 | 细菌要用显微镜看 | Single-celled, so the word must mean unicellular.
多细胞/1 | 人和大多数动植物 | Multicellular, so the word must mean multicellular.
线粒体/1 | 细胞的动力工厂 | Mitochondria, so the word must mean mitochondrion.
叶绿体/1 | 叶子是绿色因为有很多 | Chloroplasts, so the word must mean chloroplast.
核糖体/1 | 合成蛋白质的地方 | Ribosomes, so the word must mean ribosome.
染色体/1 | 人体细胞二十三对 | Chromosomes, so the word must mean chromosome.
遗传物质/1 | 脱氧核糖核酸 | Genetic material, so the word must mean genetic material.
双螺旋/1 | 一九五三年发现的结构 | The double helix, so the word must mean double helix.
基因组/1 | 人类计划二零零三年完成 | The genome, so the word must mean genome.
遗传病/1 | 色盲是常见的 | A hereditary disease, so the word must mean genetic disease.
显性/1 | 有一个基因就会表现 | Dominant, so the word must mean dominant.
隐性/1 | 成对出现才会表现 | Recessive, so the word must mean recessive.
变异/1 | 同父母的孩子不完全一样 | Variation, so the word must mean variation.
遗传学/1 | 研究基因代代相传 | Genetics, so the word must mean genetics.
克隆/1 | 一九九六年第一只羊 | Cloned, so the word must mean to clone.
氨基酸/1 | 组成蛋白质 | Amino acids, so the word must mean amino acid.
胆固醇/1 | 吃太多油炸食品会升高 | Cholesterol, so the word must mean cholesterol.
葡萄糖/1 | 饿得发晕补充一点 | Glucose, so the word must mean glucose.
脂肪酸/1 | 脂肪分解成甘油和 | Fatty acids, so the word must mean fatty acid.
碳水化合物/1 | 米饭面条的主要成分 | Carbohydrates, so the word must mean carbohydrate.
氯化钠/1 | 海水是咸的 | Sodium chloride, so the word must mean sodium chloride.
微量元素/1 | 铁和碘 | Trace elements, so the word must mean trace element.
矿物质/1 | 牛奶中的钙 | Minerals, so the word must mean mineral.
激素/1 | 青春期个子长得快 | Hormones, so the word must mean hormone.
新陈代谢/1 | 经常运动可以促进 | Metabolism, so the word must mean metabolism.
消化系统/1 | 胃和肠 | The digestive system, so the word must mean digestive system.
循环系统/1 | 心脏和血管 | The circulatory system, so the word must mean circulatory system.
神经系统/1 | 大脑和脊髓是中心 | The nervous system, so the word must mean nervous system.
呼吸系统/1 | 肺是最重要的器官 | The respiratory system, so the word must mean respiratory system.
血液循环/1 | 冬天手脚冰冷 | Circulation, so the word must mean blood circulation.
红细胞/1 | 把氧气运到身体各处 | Red blood cells, so the word must mean red blood cell.
白细胞/1 | 发炎时血液里增多 | White blood cells, so the word must mean white blood cell.
血小板/1 | 手指划破帮助止血 | Platelets, so the word must mean platelet.
干细胞/1 | 可以变成多种细胞 | Stem cells, so the word must mean stem cell.
骨髓/1 | 血细胞在这里产生 | Bone marrow, so the word must mean bone marrow.
神经元/1 | 大脑里八百六十亿个 | Neurons, so the word must mean neuron.
小脑/1 | 受伤走路难平衡 | The cerebellum, so the word must mean cerebellum.
脑干/1 | 控制呼吸心跳 | The brainstem, so the word must mean brainstem.
脊髓/1 | 在脊柱里连接大脑和身体 | The spinal cord, so the word must mean spinal cord.
条件反射/1 | 一听到铃声流口水 | A conditioned reflex, so the word must mean conditioned reflex.
鼓膜/1 | 振动后听到声音 | The eardrum, so the word must mean eardrum.
角膜/1 | 光线先通过透明的 | The cornea, so the word must mean cornea.
视网膜/1 | 物体在上面形成图像 | The retina, so the word must mean retina.
本能/1 | 小鸭不用学就会游泳 | Instinct, so the word must mean instinct.
生理/1 | 青春期身体变化 | Physiological, so the word must mean physiology.
孵化/1 | 小鸡在机器里出来 | Hatched, so the word must mean to hatch.
孵蛋/1 | 母鸡二十一天后有小鸡 | Sitting on eggs, so the word must mean to brood.
卵生/1 | 鸟类和爬行动物 | Egg-laying, so the word must mean oviparous.
胎生/1 | 鲸是这样的哺乳动物 | Live-bearing, so the word must mean viviparous.
受精/1 | 卵子发育成新个体 | Fertilised, so the word must mean to be fertilised.
雌性/1 | 产卵的蜂王 | Female, so the word must mean female.
雄性/1 | 头上有长毛的狮子 | Male, so the word must mean male.
雌雄/1 | 鸟类羽毛颜色不同 | Male and female, so the word must mean the sexes.
试管婴儿/1 | 一九七八年在英国出生 | A test-tube baby, so the word must mean IVF baby.
生命周期/1 | 蝴蝶的卵幼虫等阶段 | Life cycle, so the word must mean life cycle.
进化论/1 | 达尔文提出 | The theory of evolution, so the word must mean theory of evolution.
自然选择/1 | 生物越来越适应环境 | Natural selection, so the word must mean natural selection.
适者生存/1 | 不适应的被淘汰 | Survival of the fittest, so the word must mean survival of the fittest.
物竞天择/1 | 严复翻译进化论 | Natural selection, so the word must mean species compete and nature selects.
拟态/1 | 昆虫长得像树枝 | Mimicry, so the word must mean mimicry.
保护色/1 | 青蛙的绿色 | Camouflage colouring, so the word must mean protective colouration.
伪装/1 | 变色龙改变皮肤颜色 | Camouflage, so the word must mean to disguise.
天敌/1 | 猫头鹰对老鼠 | A natural enemy, so the word must mean natural predator.
共同祖先/1 | 人和黑猩猩 | A common ancestor, so the word must mean common ancestor.
变态发育/1 | 毛毛虫变蝴蝶 | Metamorphosis, so the word must mean metamorphosis.
哺乳动物/1 | 鲸生活在海里 | Mammals, so the word must mean mammal.
脊椎动物/1 | 鱼鸟和人 | Vertebrates, so the word must mean vertebrate.
无脊椎动物/1 | 昆虫和蚯蚓 | Invertebrates, so the word must mean invertebrate.
节肢动物/1 | 虾和蜘蛛 | Arthropods, so the word must mean arthropod.
软体动物/1 | 章鱼和贝类 | Molluscs, so the word must mean mollusc.
鸟类/1 | 骨头空心身体轻 | Birds, so the word must mean birds.
杂食动物/1 | 熊吃果子又吃鱼 | Omnivores, so the word must mean omnivore.
恒温动物/1 | 体温基本不变 | Warm-blooded animals, so the word must mean warm-blooded animal.
变温动物/1 | 蛇天冷要冬眠 | Cold-blooded animals, so the word must mean cold-blooded animal.
水生动物/1 | 鱼虾水母 | Aquatic animals, so the word must mean aquatic animal.
家禽/1 | 鸡鸭鹅 | Poultry, so the word must mean poultry.
猛禽/1 | 老鹰从高空抓猎物 | A bird of prey, so the word must mean raptor.
飞禽走兽/1 | 森林里各种各样 | Birds and beasts, so the word must mean wildlife.
鸽子/1 | 广场上游客喂食 | Pigeons, so the word must mean pigeon.
信鸽/1 | 古人用来传递消息 | Carrier pigeons, so the word must mean homing pigeon.
和平鸽/1 | 白色的象征和平 | The dove of peace, so the word must mean peace dove.
天鹅/1 | 冬天从北方飞到湖上 | Swans, so the word must mean swan.
鹅毛/1 | 千里送礼轻情意重 | A goose feather, so the word must mean goose feather.
翅膀/1 | 小鸟张开飞向天空 | Wings, so the word must mean wing.
鸡翅/1 | 晚饭有红烧 | Chicken wings, so the word must mean chicken wing.
鲤鱼/1 | 公园池塘里红色的 | Carp, so the word must mean carp.
对虾/1 | 北方沿海的大虾 | Prawns, so the word must mean prawn.
龙虾/1 | 有一对大钳子煮熟变红 | A lobster, so the word must mean lobster.
虾米/1 | 奶奶做汤放一些提味 | Dried shrimps, so the word must mean dried shrimp.
河蟹/1 | 秋天是吃的季节 | River crabs, so the word must mean river crab.
海龟/1 | 爬到沙滩上产卵 | Sea turtles, so the word must mean sea turtle.
藻类/1 | 湖水变绿发臭 | Algae, so the word must mean algae.
海藻/1 | 海带和紫菜 | Seaweed, so the word must mean seaweed.
甲壳/1 | 虾蟹身上坚硬的一层 | A shell, so the word must mean carapace.
浮游生物/1 | 很多鱼以它为食 | Plankton, so the word must mean plankton.
蚯蚓/1 | 下雨后爬到地面 | Earthworms, so the word must mean earthworm.
蜘蛛/1 | 在墙角结网 | A spider, so the word must mean spider.
蛛网/1 | 清晨挂满露珠 | A cobweb, so the word must mean spider web.
蝙蝠/1 | 白天倒挂着睡 | Bats, so the word must mean bat.
蜻蜓/1 | 下雨前飞得低 | Dragonflies, so the word must mean dragonfly.
触角/1 | 蚂蚁用来传递信息 | Antennae, so the word must mean antenna.
复眼/1 | 蜻蜓几万只小眼 | Compound eyes, so the word must mean compound eye.
口器/1 | 蚊子的像细针 | Mouthparts, so the word must mean mouthparts.
外骨骼/1 | 昆虫身体外面坚硬的一层 | An exoskeleton, so the word must mean exoskeleton.
成虫/1 | 蝉只活几个星期 | Adults, so the word must mean adult insect.
爪子/1 | 小猫把沙发抓坏 | Claws, so the word must mean claw.
鸡爪/1 | 又香又辣的菜 | Chicken feet, so the word must mean chicken feet.
脚趾/1 | 鞋太小挤得疼 | Toes, so the word must mean toe.
马蹄/1 | 远处传来一阵声 | Hooves, so the word must mean horse's hoof.
蹄子/1 | 牛羊的分成两半 | Hooves, so the word must mean hoof.
犬齿/1 | 老虎咬住猎物 | Canines, so the word must mean canine tooth.
象牙/1 | 保护大象禁止买卖 | Ivory, so the word must mean ivory.
吸盘/1 | 章鱼腿吸住石头 | Suckers, so the word must mean sucker.
毒腺/1 | 毒蛇头部 | Venom glands, so the word must mean venom gland.
龟壳/1 | 乌龟把头缩进去 | Its shell, so the word must mean tortoise shell.
光合作用/1 | 绿色植物制造养分放出氧气 | Photosynthesis, so the word must mean photosynthesis.
呼吸作用/1 | 植物夜里一直进行 | Respiration, so the word must mean respiration.
叶绿素/1 | 秋天减少叶子变黄 | Chlorophyll, so the word must mean chlorophyll.
蒸腾作用/1 | 水分从叶子散发出去 | Transpiration, so the word must mean transpiration.
气孔/1 | 叶子表面气体水分进出 | Stomata, so the word must mean stoma.
根系/1 | 草牢牢抓住沙土 | Roots, so the word must mean root system.
根毛/1 | 根尖上吸收水分 | Root hairs, so the word must mean root hair.
年轮/1 | 数一数知道树的年龄 | Growth rings, so the word must mean annual ring.
叶脉/1 | 像叶子的血管 | Veins, so the word must mean leaf vein.
树皮/1 | 剥掉一圈树会死 | Bark, so the word must mean bark.
花蕊/1 | 蜜蜂把头伸进去 | The stamens and pistil, so the word must mean flower's centre.
雄蕊/1 | 顶端花药里有花粉 | The stamen, so the word must mean stamen.
雌蕊/1 | 花粉落在上面才能结果 | The pistil, so the word must mean pistil.
花瓣/1 | 风吹过粉红色落了一地 | Petals, so the word must mean petal.
子房/1 | 发育成果实 | The ovary, so the word must mean ovary.
胚珠/1 | 发育成种子 | Ovules, so the word must mean ovule.
传粉/1 | 蜜蜂在花间飞来飞去 | Pollination, so the word must mean to pollinate.
花粉/1 | 有人过敏打喷嚏 | Pollen, so the word must mean pollen.
果皮/1 | 吃苹果前洗干净 | The peel, so the word must mean fruit skin.
种皮/1 | 保护里面的胚 | The seed coat, so the word must mean seed coat.
竹笋/1 | 春天竹林里长出 | Bamboo shoots, so the word must mean bamboo shoot.
雨后春笋/1 | 咖啡店大量出现 | Springing up, so the word must mean mushrooming.
莲花/1 | 夏天池塘里开了 | Lotus flowers, so the word must mean lotus.
莲子/1 | 和红豆煮甜汤 | Lotus seeds, so the word must mean lotus seed.
莲蓬/1 | 夏末孩子们划船去采 | Lotus pods, so the word must mean lotus pod.
向日葵/1 | 花盘跟着太阳转 | Sunflowers, so the word must mean sunflower.
植株/1 | 玉米长得又高又壮 | Plants, so the word must mean plant.
被子植物/1 | 苹果桃和水稻 | Flowering plants, so the word must mean angiosperm.
种子植物/1 | 松树和苹果树用种子繁殖 | Seed plants, so the word must mean seed plant.
雌雄同株/1 | 玉米雄花在顶雌花在中间 | Monoecious, so the word must mean monoecious.
微生物/1 | 要用显微镜才能看见 | Microbes, so the word must mean microorganism.
真菌/1 | 蘑菇不是植物 | A fungus, so the word must mean fungus.
乳酸菌/1 | 牛奶加入做成酸奶 | Lactic acid bacteria, so the word must mean lactobacillus.
益生菌/1 | 对肠道有好处 | Probiotics, so the word must mean probiotic.
耐药性/1 | 滥用抗生素使细菌产生 | Drug resistance, so the word must mean drug resistance.
禽流感/1 | 在鸡鸭中传播 | Bird flu, so the word must mean avian influenza.
转基因/1 | 培育出不怕虫子的棉花 | Genetic modification, so the word must mean genetically modified.
生物技术/1 | 大量生产药品和疫苗 | Biotechnology, so the word must mean biotechnology.
基因工程/1 | 生产糖尿病人用的药 | Genetic engineering, so the word must mean genetic engineering.
杂交/1 | 培育出高产水稻 | Hybridisation, so the word must mean to hybridise.
驻华/1 | 各国大使馆设在北京 | In China, so the word must mean stationed in China.
驻外/1 | 在非洲工作五年的记者 | Posted abroad, so the word must mean stationed abroad.
常驻/1 | 公司派他在巴黎三年 | Based, so the word must mean to be permanently stationed.
总领事/1 | 领导上海领事馆 | The consul general, so the word must mean consul general.
参赞/1 | 使馆负责文化交流 | A counsellor, so the word must mean counsellor.
特使/1 | 元首不能出席派去 | A special envoy, so the word must mean special envoy.
外交使团/1 | 新年招待会各国成员出席 | The diplomatic corps, so the word must mean diplomatic corps.
签证官/1 | 面试问留学原因 | The visa officer, so the word must mean visa officer.
外交辞令/1 | 我们会认真研究 | Diplomatic language, so the word must mean diplomatese.
外交途径/1 | 解决贸易纠纷 | Diplomatic channels, so the word must mean diplomatic channels.
会晤/1 | 两国领导人下月在北京 | A meeting, so the word must mean to meet.
会谈/1 | 三小时后签署协议 | Talks, so the word must mean talks.
国事访问/1 | 总统应邀三天 | A state visit, so the word must mean state visit.
回访/1 | 对方来过今年我们去 | A return visit, so the word must mean to pay a return visit.
访华/1 | 外国总理参观长城 | Visiting China, so the word must mean to visit China.
访问团/1 | 二十名大学生组成 | A delegation, so the word must mean visiting delegation.
随行/1 | 总统出访一百多名企业家 | Accompanying, so the word must mean to accompany.
外宾/1 | 讲解员用英语介绍 | Foreign guests, so the word must mean foreign guest.
致电/1 | 地震后领导人表示慰问 | Sending messages, so the word must mean to send a message.
贺电/1 | 夺冠后收到许多 | Messages of congratulation, so the word must mean congratulatory telegram.
国宴/1 | 菜不一定贵但有地方特色 | A state banquet, so the word must mean state banquet.
欢迎仪式/1 | 孩子们献上鲜花 | A welcome ceremony, so the word must mean welcoming ceremony.
礼炮/1 | 二十一响表示欢迎 | A gun salute, so the word must mean salute cannon.
检阅/1 | 两国元首一起看仪仗队 | Reviewing, so the word must mean to review troops.
仪仗队/1 | 队员身材高大动作整齐 | The guard of honour, so the word must mean honour guard.
旗帜/1 | 会场四周各国的 | Flags, so the word must mean banner.
勋章/1 | 老科学家胸前国家颁发的 | A medal, so the word must mean medal.
授勋/1 | 总统把勋章挂在胸前 | Decorating, so the word must mean to award a decoration.
外交礼节/1 | 主人到门口迎接 | Diplomatic etiquette, so the word must mean diplomatic protocol.
请柬/1 | 大使馆国庆招待会的 | An invitation, so the word must mean invitation card.
缔结/1 | 一九七八年和平友好条约 | Concluded, so the word must mean to conclude.
缔约国/1 | 都必须遵守条约 | Signatories, so the word must mean state party.
缔造/1 | 和平需要各国共同 | Building, so the word must mean to found.
公约/1 | 班里制定贴在墙上 | A pact, so the word must mean code of conduct.
国际公约/1 | 保护湿地一百七十多国加入 | An international convention, so the word must mean international convention.
议定书/1 | 京都减少温室气体 | A protocol, so the word must mean protocol.
备忘录/1 | 两所大学准备互派学生 | A memorandum, so the word must mean memorandum.
联合声明/1 | 宣布建立外交关系 | A joint statement, so the word must mean joint statement.
南极条约/1 | 南极只能用于和平和科研 | The Antarctic Treaty, so the word must mean Antarctic Treaty.
巴黎协定/1 | 二零一五年应对气候变化 | The Paris Agreement, so the word must mean Paris Agreement.
安理会/1 | 由十五个理事国组成 | The Security Council, so the word must mean Security Council.
常任理事国/1 | 安理会五个中国是其一 | Permanent members, so the word must mean permanent member.
会员国/1 | 联合国一百九十三个 | Member states, so the word must mean member state.
观察员/1 | 可以发言但不能投票 | Observers, so the word must mean observer.
世界卫生组织/1 | 总部在日内瓦 | The WHO, so the word must mean World Health Organization.
世贸组织/1 | 中国二零零一年加入 | The WTO, so the word must mean World Trade Organization.
国际奥委会/1 | 决定哪座城市举办奥运会 | The IOC, so the word must mean International Olympic Committee.
非政府组织/1 | 不靠政府的钱靠捐款 | An NGO, so the word must mean non-governmental organisation.
国际组织/1 | 世界卫生组织是一个 | An international organisation, so the word must mean international organisation.
否决权/1 | 常任理事国都有 | The veto, so the word must mean veto power.
峰会/1 | 二十多国元首参加 | A summit, so the word must mean summit.
年会/1 | 每年十二月总结工作 | An annual meeting, so the word must mean annual meeting.
东道主/1 | 中国热情接待各国代表 | The host, so the word must mean host.
主办国/1 | 二零二二年世界杯是卡塔尔 | The host country, so the word must mean host country.
轮值主席/1 | 安理会每个月换一次 | The rotating presidency, so the word must mean rotating chair.
提案/1 | 代表向大会提交 | Proposals, so the word must mean motion.
决议/1 | 联合国定世界海洋日 | A resolution, so the word must mean resolution.
一致通过/1 | 没有一个人反对 | Passed unanimously, so the word must mean to pass unanimously.
达成共识/1 | 三天讨论在减排目标上 | Reaching consensus, so the word must mean to reach a consensus.
遗憾/1 | 没达成协议主办方 | Regret, so the word must mean regretful.
和平共处/1 | 不同制度的国家 | Peaceful coexistence, so the word must mean to coexist peacefully.
互不干涉/1 | 各国内政 | Non-interference, so the word must mean mutual non-interference.
平等互利/1 | 贸易建立在这个基础上 | Equality and mutual benefit, so the word must mean equality and mutual benefit.
互利共赢/1 | 不是一方得利一方吃亏 | A win-win, so the word must mean mutual benefit and win-win.
睦邻友好/1 | 中国和周边国家 | Good-neighbourly, so the word must mean good-neighbourly friendship.
多边主义/1 | 大家一起商量 | Multilateralism, so the word must mean multilateralism.
单边/1 | 一个国家自己提高关税 | Unilaterally, so the word must mean unilateral.
国际秩序/1 | 公正合理需要共同努力 | The international order, so the word must mean international order.
国际法/1 | 领海宽度不超过十二海里 | International law, so the word must mean international law.
繁荣昌盛/1 | 新年祝愿国家 | Prosperous, so the word must mean thriving.
国际关系/1 | 大学专业毕业进外交部 | International relations, so the word must mean international relations.
国际形势/1 | 复杂多变需要合作 | The international situation, so the word must mean international situation.
国际社会/1 | 各国纷纷派来救援队 | The international community, so the word must mean international community.
国际地位/1 | 经济发展后不断提高 | International standing, so the word must mean international status.
紧张局势/1 | 缓和边境的 | Tensions, so the word must mean tense situation.
争端/1 | 国家间应和平解决 | Disputes, so the word must mean dispute.
遏制/1 | 各国联手阻止病毒传播 | Containing, so the word must mean to curb.
严峻/1 | 全球变暖形势 | Grim, so the word must mean severe.
化险为夷/1 | 及时沟通危机过去 | Averted, so the word must mean to turn danger into safety.
堪称/1 | 会晤是关系史上的大事 | The meeting is held to be a major event in the history of the two countries' relations, so the word must mean to be worthy of being called.
华侨/1 | 捐钱回家乡修学校 | Overseas Chinese, so the word must mean overseas Chinese.
侨胞/1 | 大使馆邀请一起包饺子 | Compatriots abroad, so the word must mean overseas compatriot.
侨乡/1 | 江门很多人家有亲戚在国外 | A hometown of emigrants, so the word must mean home of overseas Chinese.
归侨/1 | 从印尼回国在厦门定居 | A returned overseas Chinese, so the word must mean returned overseas Chinese.
侨居/1 | 年轻时住在法国 | Living abroad, so the word must mean to reside abroad.
撤侨/1 | 用飞机把三千多人接回 | Evacuating nationals, so the word must mean to evacuate citizens.
外侨/1 | 来自欧洲美洲的住户 | Foreign residents, so the word must mean foreign national.
民间交往/1 | 国家关系的基础是人民友谊 | People-to-people exchanges, so the word must mean non-governmental contact.
友好城市/1 | 北京和东京一九七九年 | Sister cities, so the word must mean twin cities.
庞大/1 | 东南亚华人超过三千万 | Huge, so the word must mean enormous.
人文交流/1 | 互派留学生 | Cultural exchanges, so the word must mean people-to-people exchange.
孔子学院/1 | 在本国学了两年中文 | A Confucius Institute, so the word must mean Confucius Institute.
汉语热/1 | 世界上学中文的人多了 | A craze for Chinese, so the word must mean Chinese language fever.
交换生/1 | 在日本大学学习一年 | An exchange student, so the word must mean exchange student.
访问学者/1 | 王教授在英国一年 | A visiting scholar, so the word must mean visiting scholar.
弘扬/1 | 艺术节传播传统文化 | Promoting, so the word must mean to carry forward.
启迪/1 | 出国交流让我看到不同生活 | Inspiration, so the word must mean enlightenment.
文化差异/1 | 点头在有的国家表示不同意 | Cultural differences, so the word must mean cultural difference.
文化冲击/1 | 留学生感到孤独不习惯 | Culture shock, so the word must mean culture shock.
惋惜/1 | 翻译家没译完就去世 | Regret, so the word must mean to feel sorry.
贸易额/1 | 去年比前年增长百分之十 | Trade volume, so the word must mean trade volume.
贸易顺差/1 | 出口多进口少 | A trade surplus, so the word must mean trade surplus.
贸易逆差/1 | 进口比出口多 | A trade deficit, so the word must mean trade deficit.
贸易伙伴/1 | 中国是很多国家最大的 | A trading partner, so the word must mean trading partner.
贸易壁垒/1 | 提高关税 | Trade barriers, so the word must mean trade barrier.
反倾销/1 | 低于成本价大量出售 | Anti-dumping, so the word must mean anti-dumping.
外汇储备/1 | 中国多年居世界第一 | Foreign exchange reserves, so the word must mean foreign exchange reserves.
引进外资/1 | 为外国企业提供便利 | Attracting foreign capital, so the word must mean to bring in foreign investment.
经济特区/1 | 厦门是最早的之一 | Special economic zones, so the word must mean special economic zone.
中欧班列/1 | 货物从重庆到德国十几天 | The China-Europe railway express, so the word must mean China-Europe freight train.
对外援助/1 | 帮许多国家修公路医院 | Foreign aid, so the word must mean foreign aid.
援建/1 | 当地人叫友谊体育场 | Built with aid, so the word must mean to help build.
人道主义/1 | 红十字会的工作精神 | Humanitarianism, so the word must mean humanitarianism.
国际救援/1 | 十几个国家派人参加 | International rescue, so the word must mean international relief.
救援队/1 | 带搜救犬赶到灾区 | A rescue team, so the word must mean rescue team.
捐助/1 | 衣服食物帮受灾的人 | Donating, so the word must mean to donate.
粮食安全/1 | 每个国家都要保障 | Food security, so the word must mean food security.
减贫/1 | 中国经验受到关注 | Poverty reduction, so the word must mean poverty reduction.
维和/1 | 中国派出人员最多 | Peacekeeping, so the word must mean peacekeeping.
发展中国家/1 | 需要资金技术发展经济 | Developing countries, so the word must mean developing country.
领土/1 | 俄罗斯面积最大 | Territory, so the word must mean territory.
领海/1 | 从海岸基线算起十二海里 | Territorial waters, so the word must mean territorial sea.
领空/1 | 外国飞机进入需要允许 | Airspace, so the word must mean airspace.
主权/1 | 尊重别国的 | Sovereignty, so the word must mean sovereignty.
岛屿/1 | 印度尼西亚一万多个 | Islands, so the word must mean island.
群岛/1 | 夏威夷在太平洋中部 | An archipelago, so the word must mean archipelago.
内陆国/1 | 蒙古四周没有海 | A landlocked country, so the word must mean landlocked country.
专属经济区/1 | 最远到二百海里 | The exclusive economic zone, so the word must mean exclusive economic zone.
滨海/1 | 青岛美丽的城市 | Coastal, so the word must mean seaside.
宛如/1 | 小岛像撒在海上的珍珠 | Seen from the plane, the little islands look like pearls scattered on the sea, so the word must mean as if.
边境/1 | 中越小镇越南商人来 | The border, so the word must mean border area.
国界/1 | 这条河对岸是另一个国家 | The boundary, so the word must mean national boundary.
边检/1 | 把护照交给工作人员 | Border control, so the word must mean frontier inspection.
出入境/1 | 办护照到公安局 | Exit and entry, so the word must mean exit and entry.
免签/1 | 去旅游不用办签证 | Visa-free, so the word must mean visa exemption.
落地签/1 | 到机场再办 | A visa on arrival, so the word must mean visa on arrival.
过境/1 | 在迪拜停留四小时 | In transit, so the word must mean to transit.
跨境/1 | 网上买外国商品电商 | Cross-border, so the word must mean cross-border.
申报/1 | 现金超过规定向海关 | Declaring, so the word must mean to declare.
倒时差/1 | 刚到美国白天想睡 | Getting over jet lag, so the word must mean to adjust to jet lag.
气候变化/1 | 冰川融化海平面上升 | Climate change, so the word must mean climate change.
温室气体/1 | 二氧化碳是主要的一种 | Greenhouse gases, so the word must mean greenhouse gas.
减排/1 | 城市发展电动汽车 | Cutting emissions, so the word must mean to reduce emissions.
可持续发展/1 | 不为眼前利益破坏环境 | Sustainable development, so the word must mean sustainable development.
跨境传播/1 | 防止传染病需要合作 | Cross-border spread, so the word must mean spread across borders.
核不扩散/1 | 大多数国家加入条约 | Non-proliferation, so the word must mean nuclear non-proliferation.
外太空/1 | 属于全人类和平目的 | Outer space, so the word must mean outer space.
公海/1 | 各国船都可以自由航行 | The high seas, so the word must mean high seas.
极地/1 | 研究冰层了解过去气候 | The polar regions, so the word must mean polar region.
和平利用/1 | 用核能发电 | Peaceful use, so the word must mean to use peacefully.
瑞士/1 | 山地国家手表巧克力 | Switzerland, so the word must mean Switzerland.
瑞典/1 | 诺贝尔奖颁奖在斯德哥尔摩 | Sweden, so the word must mean Sweden.
芬兰/1 | 千湖之国 | Finland, so the word must mean Finland.
丹麦/1 | 安徒生的国家 | Denmark, so the word must mean Denmark.
菲律宾/1 | 七千多个岛首都马尼拉 | The Philippines, so the word must mean the Philippines.
缅甸/1 | 和云南相邻 | Myanmar, so the word must mean Myanmar.
文莱/1 | 东南亚小国石油丰富 | Brunei, so the word must mean Brunei.
黎巴嫩/1 | 地中海东岸首都贝鲁特 | Lebanon, so the word must mean Lebanon.
阿拉伯/1 | 数字其实是印度人发明的 | Arabic, so the word must mean Arab.
曼谷/1 | 泰国的首都 | Bangkok, so the word must mean Bangkok.
喧哗/1 | 图书馆里不要大声 | Making noise, so the word must mean to make a racket.
嘈杂/1 | 饭馆不适合谈事情 | Noisy, so the word must mean noisy.
哗然/1 | 假新闻揭穿后舆论 | An uproar, so the word must mean in an uproar.
声嘶力竭/1 | 球迷为球队加油 | At the top of their voices, so the word must mean shouting oneself hoarse.
嘶哑/1 | 讲三小时课嗓子 | Hoarse, so the word must mean husky.
聆听/1 | 安静地听老教授报告 | Listening, so the word must mean to listen respectfully.
呼唤/1 | 妈妈在门口叫孩子 | Calling, so the word must mean to call.
唤起/1 | 纪录片引起人们关注 | Aroused, so the word must mean to arouse.
音量/1 | 晚上看电视调小 | The volume, so the word must mean volume.
音质/1 | 耳机像在音乐厅 | Sound quality, so the word must mean sound quality.
诙谐/1 | 说话把大家逗笑 | Humorous, so the word must mean jocular.
调侃/1 | 说自己胖得像熊猫 | Joking, so the word must mean to banter.
侃侃而谈/1 | 面对记者一点不紧张 | Speaking with ease, so the word must mean to talk confidently.
哗众取宠/1 | 网络节目故意说怪话 | Grandstanding, so the word must mean to play to the gallery.
夸大其词/1 | 吃药三天能长高 | Exaggerating, so the word must mean to exaggerate.
添油加醋/1 | 越传越离谱 | Embellishing, so the word must mean to embroider a story.
以讹传讹/1 | 错误说法在网上传 | Spreading errors, so the word must mean to pass on a falsehood.
诋毁/1 | 发文章说同行坏话被告 | Defaming, so the word must mean to slander.
恍然大悟/1 | 听了解释才明白看错了题 | Suddenly seeing, so the word must mean to suddenly realise.
乱七八糟/1 | 书和衣服扔了一地 | A mess, so the word must mean in a mess.
创刊/1 | 报纸一九四九年开始出版 | Founded, so the word must mean to start publication.
停刊/1 | 读者越来越少 | Ceased publication, so the word must mean to stop publication.
复刊/1 | 停办十年今年又出 | Resumed, so the word must mean to resume publication.
创刊号/1 | 收藏现在很值钱 | The first issue, so the word must mean first issue.
合订本/1 | 图书馆几十年的报纸 | Bound volumes, so the word must mean bound volume.
号外/1 | 获得奥运举办权那晚 | A special edition, so the word must mean extra edition.
副刊/1 | 散文发表在文艺 | The supplement, so the word must mean supplement.
丛书/1 | 二十本每本一个科学问题 | A series, so the word must mean book series.
出版物/1 | 注明出版单位和时间 | Publications, so the word must mean publication.
畅销书/1 | 一个月卖五十万本 | A bestseller, so the word must mean bestseller.
稿件/1 | 编辑每天看几十篇 | Manuscripts, so the word must mean manuscript.
约稿/1 | 请作家写童年散文 | Commissioning, so the word must mean to commission an article.
审稿/1 | 论文经过专家 | Peer review, so the word must mean to review a manuscript.
退稿/1 | 小说多次被退回 | Rejected, so the word must mean to reject a manuscript.
截稿/1 | 明天中午之前写完 | The deadline, so the word must mean to close for submissions.
编辑部/1 | 读者写信寄给 | The editorial office, so the word must mean editorial department.
总编辑/1 | 头版新闻由他决定 | The editor-in-chief, so the word must mean editor-in-chief.
责任编辑/1 | 对每一句话仔细核对 | The responsible editor, so the word must mean editor in charge.
撰稿人/1 | 专门写旅行文章 | A contributor, so the word must mean writer.
专栏作家/1 | 每周一篇教育文章 | A columnist, so the word must mean columnist.
采编/1 | 又采访又编辑稿件 | News gathering and editing, so the word must mean reporting and editing.
采写/1 | 两名记者花一个月 | Reported and written, so the word must mean to gather and write.
记者站/1 | 报社在三十多个城市设有 | Bureaus, so the word must mean news bureau.
通讯社/1 | 新华社是国家的 | A news agency, so the word must mean news agency.
通讯员/1 | 学校的小经常给校报写稿 | A correspondent, so the word must mean correspondent.
特约记者/1 | 旅行家每到一国发回报道 | A special correspondent, so the word must mean special correspondent.
实习记者/1 | 大学没毕业在电视台 | An intern reporter, so the word must mean trainee reporter.
采访对象/1 | 尊重他们不公开隐私 | Interviewees, so the word must mean interviewee.
专访/1 | 获奖后接受电视台 | An exclusive interview, so the word must mean special interview.
新闻嗅觉/1 | 从小事发现大新闻 | A nose for news, so the word must mean news sense.
独家报道/1 | 别的报纸都没有 | An exclusive, so the word must mean exclusive report.
深度报道/1 | 一万多字分析交通拥堵 | In-depth reporting, so the word must mean in-depth report.
连续报道/1 | 一共发了十二篇 | Serial coverage, so the word must mean continuous coverage.
现场报道/1 | 冒着大雨在洪水边 | Live reporting, so the word must mean on-the-spot report.
快讯/1 | 比赛一结束中国队获胜 | A news flash, so the word must mean newsflash.
简讯/1 | 每条只有几十个字 | News in brief, so the word must mean brief news.
通稿/1 | 很多报纸内容一模一样 | A press release, so the word must mean wire copy.
新闻发布会/1 | 外交部每个工作日例行 | A press conference, so the word must mean press conference.
答记者问/1 | 发言人介绍访问情况 | Answering questions, so the word must mean to answer reporters' questions.
新闻界/1 | 老记者工作四十年 | The press, so the word must mean journalism circles.
消息来源/1 | 很难判断真假 | Its source, so the word must mean news source.
知情人/1 | 据他说公司下个月发布新手机 | An insider, so the word must mean informed source.
传言/1 | 说放假一周后来是假的 | A rumour, so the word must mean rumour.
失实/1 | 报道不真实报社道歉 | Inaccurate, so the word must mean untrue.
虚假新闻/1 | 在网上发布要承担法律责任 | Fake news, so the word must mean false news.
事实核查/1 | 帮读者分辨真假消息 | Fact-checking, so the word must mean fact-check.
甄别/1 | 网上信息要学会分辨 | Sifting, so the word must mean to screen.
一小撮/1 | 散布谣言的人很少 | A handful, so the word must mean a small bunch.
扒/1 | 网友把十年前的照片找出来 | Dug up, so the word must mean to dig up.
揪出/1 | 警方很快找到造谣的人 | Tracked down, so the word must mean to ferret out.
娱乐/1 | 周末看电影和打球 | Entertainment, so the word must mean recreation.
娱乐圈/1 | 十六岁进入拍了二十多部电影 | Show business, so the word must mean entertainment industry.
娱乐新闻/1 | 对明星的事不感兴趣 | Entertainment news, so the word must mean entertainment news.
文娱/1 | 周五下午唱歌跳舞下棋 | Recreational, so the word must mean cultural and recreational.
自娱自乐/1 | 爷爷在家拉二胡 | Amusing oneself, so the word must mean to entertain oneself.
综艺节目/1 | 周末电视上又唱又跳 | Variety shows, so the word must mean variety show.
真人秀/1 | 城市孩子去农村生活一个月 | A reality show, so the word must mean reality show.
选秀/1 | 通过唱歌节目出名 | A talent show, so the word must mean talent contest.
脱口秀/1 | 观众笑个不停 | Stand-up, so the word must mean talk show.
嘉宾/1 | 今天节目请来科学家 | The guest, so the word must mean guest.
收视率/1 | 电视剧几乎家家都在看 | Ratings, so the word must mean viewing figures.
收听率/1 | 早上开车时段广播最高 | Listening figures, so the word must mean audience rating.
转播/1 | 很多电视台同时播足球赛 | Relayed, so the word must mean to relay.
录播/1 | 不是直播出错可以重录 | Prerecorded, so the word must mean recorded broadcast.
重播/1 | 昨晚没看到今天下午再放 | A rerun, so the word must mean to rebroadcast.
首播/1 | 纪录片下周六第一次播 | A premiere, so the word must mean first broadcast.
黄金时段/1 | 晚七点到十点广告最贵 | Prime time, so the word must mean prime time.
卫视/1 | 省级节目全国都能看 | Satellite TV, so the word must mean satellite television.
广播电台/1 | 主持晚上音乐节目 | A radio station, so the word must mean radio station.
调频/1 | 收音机调到九十七点四 | FM, so the word must mean frequency modulation.
片头/1 | 电视剧开头三十秒音乐好听 | The opening credits, so the word must mean opening titles.
片尾/1 | 列出所有工作人员名字 | The end credits, so the word must mean closing credits.
主题曲/1 | 动画片很多孩子会唱 | The theme song, so the word must mean theme song.
插曲/1 | 一只小狗跑进球场 | An episode, so the word must mean interlude.
演职员/1 | 拍完那天一起吃饭 | Cast and crew, so the word must mean cast and crew.
摄像师/1 | 把摄像机对准主持人 | The cameraman, so the word must mean video camera operator.
剪辑师/1 | 几百小时素材剪成两小时 | The editor, so the word must mean film editor.
后期制作/1 | 拍完了明年春天上映 | Post-production, so the word must mean post-production.
纪录片/1 | 大熊猫拍了三年 | A documentary, so the word must mean documentary.
拷贝/1 | 照片从手机到电脑 | Copied, so the word must mean to copy.
收音机/1 | 爷爷散步时听新闻 | A radio, so the word must mean radio.
录音机/1 | 反复听磁带 | Tape recorders, so the word must mean tape recorder.
摄像机/1 | 记者背着跑到现场 | A video camera, so the word must mean video camera.
麦克风/1 | 主持人拿起宣布晚会开始 | The microphone, so the word must mean microphone.
扬声器/1 | 广场上播放音乐 | Loudspeakers, so the word must mean loudspeaker.
天线/1 | 屋顶上装着电视 | Aerials, so the word must mean antenna.
按钮/1 | 按一下红色的机器停 | A button, so the word must mean button.
旋钮/1 | 转动找别的电台 | The knob, so the word must mean knob.
有线电视/1 | 能看一百多个频道 | Cable television, so the word must mean cable TV.
荧光屏/1 | 老式电视机凸出来 | The screen, so the word must mean fluorescent screen.
显示屏/1 | 车站显示出发时间 | Display screens, so the word must mean display screen.
触摸屏/1 | 用手指点一点买票 | A touchscreen, so the word must mean touch screen.
大屏幕/1 | 广场上直播比赛 | A big screen, so the word must mean big screen.
横屏/1 | 把手机横过来看 | Landscape mode, so the word must mean landscape orientation.
分辨率/1 | 一千九百二十乘一千零八十 | Resolution, so the word must mean resolution.
像素/1 | 照片放大后的小方块 | Pixels, so the word must mean pixel.
高清/1 | 连球员表情都看得清 | High definition, so the word must mean high-definition.
画质/1 | 老电影修复后比原来好 | Picture quality, so the word must mean image quality.
荧屏/1 | 老演员很多年没出现在上面 | The screen, so the word must mean television screen.
五彩缤纷/1 | 灯光把舞台照得漂亮 | Colourful, so the word must mean riotously colourful.
公众号/1 | 学校开通每天发新闻 | An official account, so the word must mean public account.
推送/1 | 手机每天发来几十条新闻 | Pushing, so the word must mean to push.
评论区/1 | 视频下面几千条留言 | The comments section, so the word must mean comment section.
留言板/1 | 学生给校长提建议 | A message board, so the word must mean message board.
置顶/1 | 重要通知一打开就看到 | Pinned to the top, so the word must mean to pin to the top.
删帖/1 | 帖子不实网站删掉 | Deleted the post, so the word must mean to delete a post.
转帖/1 | 好文章放到自己博客上 | Reposted, so the word must mean to repost.
拉黑/1 | 总发广告的人 | Blocked, so the word must mean to blacklist.
屏蔽/1 | 软件让网页没有广告 | Blocking, so the word must mean to block.
迭代/1 | 软件每个月都有新版本 | Iterating, so the word must mean to iterate.
点击率/1 | 一百人里只有一个点开 | The click-through rate, so the word must mean click-through rate.
浏览量/1 | 文章一天超过十万 | Page views, so the word must mean page views.
播放量/1 | 歌的视频超过一亿次 | Play count, so the word must mean number of plays.
发行量/1 | 报纸每天最高一百万份 | Circulation, so the word must mean circulation.
蹭热度/1 | 借热门新闻发无关广告 | Riding the trend, so the word must mean to cash in on a hot topic.
吸引眼球/1 | 文章标题写得很夸张 | Grabbing attention, so the word must mean to catch the eye.
营销号/1 | 为赚钱编离奇故事 | Clickbait accounts, so the word must mean marketing account.
造势/1 | 电影上映前花钱宣传 | Building hype, so the word must mean to build momentum.
推波助澜/1 | 谣言越传越广媒体也参与 | Fuelling, so the word must mean to add fuel to the fire.
震撼/1 | 纪录片画面让人难忘 | Stunning, so the word must mean shocking.
软广告/1 | 看起来像新闻 | An advertorial, so the word must mean disguised advertisement.
广告词/1 | 牛奶的一句简单好记 | The slogan, so the word must mean advertising slogan.
广告牌/1 | 高速公路两边巨大的 | Billboards, so the word must mean billboard.
植入广告/1 | 主人公总喝同一牌子饮料 | Product placement, so the word must mean product placement.
代言人/1 | 运动员为运动鞋公司 | A spokesperson, so the word must mean brand ambassador.
品牌形象/1 | 质量问题会损害 | Brand image, so the word must mean brand image.
宣传片/1 | 城市拍了旅游的 | A promotional film, so the word must mean promotional video.
传单/1 | 新饭店在路口发 | Flyers, so the word must mean leaflet.
口号/1 | 运动会上高喊着 | Slogans, so the word must mean slogan.
幌子/1 | 打着免费体检卖保健品 | A front, so the word must mean pretext.
媒介素养/1 | 教学生分辨网上信息 | Media literacy, so the word must mean media literacy.
信息茧房/1 | 只看自己喜欢的内容 | A filter bubble, so the word must mean information cocoon.
算法推荐/1 | 总看到同一类内容 | Algorithmic recommendation, so the word must mean recommendation algorithm.
信息过载/1 | 几百条消息什么也记不住 | Information overload, so the word must mean information overload.
淹没/1 | 真实声音被谣言盖住 | Drowned out, so the word must mean to submerge.
深度阅读/1 | 刷短视频代替不了 | Deep reading, so the word must mean in-depth reading.
数字鸿沟/1 | 老人不会用智能手机 | The digital divide, so the word must mean digital divide.
新闻伦理/1 | 偷拍私生活违反 | Journalistic ethics, so the word must mean news ethics.
名誉权/1 | 捏造事实诋毁别人 | The right to reputation, so the word must mean right of reputation.
剽窃/1 | 论文大段抄别人成果 | Plagiarism, so the word must mean to plagiarise.
屋檐/1 | 下雨站在下面躲雨 | The eaves, so the word must mean eaves.
飞檐翘角/1 | 古楼像要飞起来的鸟 | Upturned eaves, so the word must mean upswept eaves and corners.
琉璃瓦/1 | 故宫屋顶金黄色的 | Glazed tiles, so the word must mean glazed tile.
屋脊/1 | 上面立着一排小兽 | The ridge, so the word must mean roof ridge.
斗拱/1 | 把屋顶重量传到柱子 | Bracket sets, so the word must mean dougong bracket.
横梁/1 | 架在两根柱子上撑起屋顶 | A beam, so the word must mean crossbeam.
立柱/1 | 大殿前红色雕着龙 | Pillars, so the word must mean upright column.
榫卯/1 | 不用钉子连木头 | Mortise and tenon, so the word must mean mortise and tenon joint.
雕梁画栋/1 | 王府十分华丽 | Ornate, so the word must mean carved beams and painted rafters.
木结构/1 | 古代宫殿很怕失火 | Timber-framed, so the word must mean wooden structure.
门槛/1 | 进门时要抬起脚 | The threshold, so the word must mean threshold.
门帘/1 | 夏天挡蚊子 | A door curtain, so the word must mean door curtain.
窗帘/1 | 拉开阳光照进来 | The curtains, so the word must mean curtain.
匾额/1 | 老店门口写着店名 | A plaque, so the word must mean inscribed board.
门楼/1 | 高大说明主人有钱 | The gatehouse, so the word must mean gate tower.
照壁/1 | 进大门迎面挡住视线 | A screen wall, so the word must mean spirit screen.
天井/1 | 雨水从四面屋顶流进来 | A courtyard, so the word must mean skywell.
回廊/1 | 下雨天在里面散步 | A covered walkway, so the word must mean winding corridor.
栅栏/1 | 草地四周白色的 | A fence, so the word must mean fence.
竹篱/1 | 农家小院围着 | A bamboo fence, so the word must mean bamboo fence.
民居/1 | 各地风格反映气候习惯 | Vernacular houses, so the word must mean folk dwelling.
吊脚楼/1 | 一半用木柱撑在空中 | Stilt houses, so the word must mean stilted house.
土楼/1 | 福建又大又圆住几十户 | Earthen buildings, so the word must mean tulou.
竹楼/1 | 云南南部楼下通风 | Bamboo houses, so the word must mean bamboo house.
石库门/1 | 上海用石头做门框 | Shikumen, so the word must mean stone-gate house.
骑楼/1 | 广州老街下雨不怕 | Arcade buildings, so the word must mean arcade building.
徽派建筑/1 | 白墙黑瓦马头墙 | Hui-style architecture, so the word must mean Huizhou architecture.
火炕/1 | 东北冬天农村睡 | A heated bed, so the word must mean kang.
土坯/1 | 以前村里房子用它盖 | Adobe, so the word must mean mud brick.
村寨/1 | 苗族一千多户在山坡 | A village, so the word must mean stockaded village.
天坛/1 | 祈年殿蓝色琉璃瓦 | The Temple of Heaven, so the word must mean Temple of Heaven.
祭坛/1 | 摆放祭品祭祀天地 | An altar, so the word must mean altar.
殿堂/1 | 终于走进艺术的 | The hall, so the word must mean palace hall.
佛塔/1 | 大雁塔一千多年 | A pagoda, so the word must mean Buddhist pagoda.
角楼/1 | 故宫城墙四个角上 | Corner towers, so the word must mean corner tower.
亭台楼阁/1 | 园子里小桥流水 | Pavilions and towers, so the word must mean pavilions, terraces and towers.
巍峨/1 | 抬头看到宫殿 | Towering, so the word must mean lofty.
矗立/1 | 高楼在江边 | Standing tall, so the word must mean to tower.
古建筑/1 | 明清时期的 | Old buildings, so the word must mean ancient architecture.
峨眉山/1 | 四川山上古老寺庙 | Mount Emei, so the word must mean Mount Emei.
苏州园林/1 | 面积不大假山水池样样有 | The Suzhou gardens, so the word must mean classical gardens of Suzhou.
曲径通幽/1 | 小路绕过假山通向竹林 | A winding path, so the word must mean a winding path to a secluded spot.
借景/1 | 远处的山和塔变成园景 | Borrowed scenery, so the word must mean borrowed view.
草坪/1 | 请爱护不要踩 | The lawn, so the word must mean lawn.
花坛/1 | 广场中央圆形开满花 | A flower bed, so the word must mean flower bed.
人工湖/1 | 十年前挖的 | An artificial lake, so the word must mean man-made lake.
湿地公园/1 | 水鸟多观鸟好地方 | A wetland park, so the word must mean wetland park.
口袋公园/1 | 街角空地老人去坐坐 | A pocket park, so the word must mean pocket park.
喷泉/1 | 随音乐喷出水柱 | A fountain, so the word must mean fountain.
观景台/1 | 山顶看整座城市 | A viewing platform, so the word must mean observation deck.
哥特式/1 | 巴黎圣母院 | Gothic, so the word must mean Gothic.
巴洛克/1 | 装饰华丽曲线雕刻多 | Baroque, so the word must mean Baroque.
罗马式/1 | 教堂墙厚窗小 | Romanesque, so the word must mean Romanesque.
现代主义/1 | 二十世纪反对多余装饰 | Modernist, so the word must mean modernism.
极简/1 | 公寓除床和桌子几乎没有 | Minimalist, so the word must mean minimalist.
地中海风格/1 | 白墙配蓝色门窗 | Mediterranean style, so the word must mean Mediterranean style.
新中式/1 | 有传统味道又舒适 | New Chinese style, so the word must mean modern Chinese style.
尖顶/1 | 教堂高高伸向天空 | The spire, so the word must mean spire.
圆顶/1 | 罗马万神殿近两千年 | The dome, so the word must mean dome.
传统建筑/1 | 村子没有一座高楼 | Traditional buildings, so the word must mean traditional architecture.
砖木结构/1 | 墙是砖屋顶是木头 | Brick and timber, so the word must mean brick-and-wood structure.
框架结构/1 | 墙只起分隔作用 | A frame structure, so the word must mean frame structure.
钢筋混凝土/1 | 大桥非常坚固 | Reinforced concrete, so the word must mean reinforced concrete.
承重墙/1 | 装修不能随便拆 | Load-bearing walls, so the word must mean load-bearing wall.
打地基/1 | 盖高楼首先要 | Laying foundations, so the word must mean to lay a foundation.
夯土/1 | 长城有些地方用它筑成 | Rammed earth, so the word must mean rammed earth.
夯实/1 | 学外语要先打牢基础 | Consolidating, so the word must mean to tamp down.
青砖/1 | 老胡同灰色的 | Grey bricks, so the word must mean blue-grey brick.
红砖/1 | 老教学楼远看一片红 | Red bricks, so the word must mean red brick.
砾石/1 | 小路上走起来沙沙响 | Gravel, so the word must mean gravel.
建筑工地/1 | 不戴安全帽不能进 | A building site, so the word must mean construction site.
毛坯房/1 | 墙上什么也没有要装修 | An unfinished flat, so the word must mean unfurnished shell.
精装修/1 | 买了家具就能住 | Fully fitted, so the word must mean fully finished.
防水/1 | 卫生间不然楼下漏水 | Waterproofing, so the word must mean waterproof.
隔音/1 | 邻居说话都能听见 | Soundproofing, so the word must mean sound insulation.
采光/1 | 朝南白天不用开灯 | Natural light, so the word must mean lighting.
塌方/1 | 大雨后山路车不能过 | A landslide, so the word must mean cave-in.
倒塌/1 | 老房子年久失修 | Collapsed, so the word must mean to collapse.
塌陷/1 | 路面下沉半米 | Subsided, so the word must mean to subside.
建筑面积/1 | 一百平方米实际使用小一些 | Floor area, so the word must mean gross floor area.
户型/1 | 买房还要看 | The layout, so the word must mean floor plan.
两室一厅/1 | 一家三口住 | Two bedrooms and a living room, so the word must mean two-bedroom flat.
主卧/1 | 最大带卫生间爸妈住 | The master bedroom, so the word must mean master bedroom.
次卧/1 | 比爸妈的房间小一点 | The second bedroom, so the word must mean second bedroom.
阳台/1 | 奶奶在上面种花 | The balcony, so the word must mean balcony.
飘窗/1 | 坐在上面看书 | The bay window, so the word must mean bay window.
储藏室/1 | 不常用的东西放在里面 | The storeroom, so the word must mean storage room.
地下室/1 | 以前停自行车 | The basement, so the word must mean basement.
层高/1 | 三米比一般房子高 | Ceiling height, so the word must mean storey height.
复式/1 | 客厅在楼下卧室在楼上 | A duplex, so the word must mean duplex.
橱柜/1 | 厨房里摆满碗盘 | Cupboards, so the word must mean kitchen cabinet.
衣橱/1 | 冬衣叠好放进 | The wardrobe, so the word must mean wardrobe.
书橱/1 | 爷爷放满书 | Bookcase, so the word must mean bookcase.
橱窗/1 | 商店摆着新款衣服 | The shop window, so the word must mean display window.
地毯/1 | 光脚走在上面舒服 | A carpet, so the word must mean carpet.
挂毯/1 | 墙上织着雪山草原 | A tapestry, so the word must mean tapestry.
狭窄/1 | 老城区两辆车难同时过 | Narrow, so the word must mean narrow.
窄小/1 | 屋子只能放一张床 | Cramped, so the word must mean small and narrow.
地窖/1 | 北方农民放白菜土豆 | A cellar, so the word must mean cellar.
被窝/1 | 冬天早上不想出来 | Under the covers, so the word must mean quilt.
摩天大楼/1 | 哈利法塔世界最高 | A skyscraper, so the word must mean skyscraper.
地标建筑/1 | 东方明珠塔 | Landmarks, so the word must mean landmark building.
天际线/1 | 江边高楼亮灯很美 | The skyline, so the word must mean skyline.
超高层/1 | 超过一百米的楼房 | Supertall, so the word must mean high-rise.
电梯房/1 | 爷爷爬楼梯困难搬进 | A lift building, so the word must mean flat with a lift.
顶层/1 | 夏天屋里特别热 | The top floor, so the word must mean top floor.
底层/1 | 楼下是商店 | The ground floor, so the word must mean ground floor.
别墅/1 | 海边周末度假 | A villa, so the word must mean villa.
轮廓/1 | 远处山模糊的一个 | An outline, so the word must mean outline.
观光塔/1 | 广州塔四百多米看城市 | An observation tower, so the word must mean sightseeing tower.
城市规划/1 | 居民上班上学买东西方便 | Urban planning, so the word must mean city planning.
总体规划/1 | 老城区不能再建高楼 | The master plan, so the word must mean master plan.
布局/1 | 每栋楼都能晒到太阳 | The layout, so the word must mean arrangement.
功能区/1 | 住人办公工厂分开 | Functional zones, so the word must mean functional zone.
商业区/1 | 商场饭店一家挨一家 | The business district, so the word must mean commercial district.
住宅区/1 | 工厂不能建在旁边 | Residential areas, so the word must mean residential area.
工业区/1 | 建在下风减少污染 | Industrial zones, so the word must mean industrial zone.
开发区/1 | 农田变成建了很多工厂 | A development zone, so the word must mean development zone.
老城区/1 | 街道窄保留老房子 | The old town, so the word must mean old city.
卫星城/1 | 减轻市中心压力 | Satellite towns, so the word must mean satellite town.
旧城改造/1 | 有价值的老建筑保留 | Urban renewal, so the word must mean redevelopment of old districts.
城市更新/1 | 老工厂变成艺术区 | Regeneration, so the word must mean urban regeneration.
棚户区/1 | 改造后变成整齐小区 | Shanty areas, so the word must mean shanty town.
安置房/1 | 拆迁居民搬进 | Resettlement housing, so the word must mean resettlement housing.
保障房/1 | 低价租给收入不高的家庭 | Affordable housing, so the word must mean social housing.
容积率/1 | 楼和楼之间空地大 | Plot ratio, so the word must mean floor area ratio.
绿化率/1 | 百分之四十树和草地 | Green coverage, so the word must mean greening rate.
人口密度/1 | 澳门世界最大之一 | Population density, so the word must mean population density.
宜居城市/1 | 空气好交通方便 | A liveable city, so the word must mean liveable city.
智慧城市/1 | 红绿灯根据车流调整 | A smart city, so the word must mean smart city.
主干道/1 | 八条车道车流不断 | A main road, so the word must mean arterial road.
支路/1 | 大路堵车走旁边的 | Side roads, so the word must mean branch road.
环线/1 | 北京二环三环 | Ring roads, so the word must mean ring road.
高架桥/1 | 汽车在上面下面也通车 | An overpass, so the word must mean viaduct.
交通枢纽/1 | 地铁公交长途车都停 | A transport hub, so the word must mean transport hub.
岔路口/1 | 不知往左还是往右 | A fork, so the word must mean road junction.
斑马线/1 | 过马路要走 | The zebra crossing, so the word must mean zebra crossing.
停车场/1 | 商场地下停一千辆车 | A car park, so the word must mean car park.
步行街/1 | 不许汽车通行游客放心走 | A pedestrian street, so the word must mean pedestrian street.
死胡同/1 | 走进去只好退回来 | A dead end, so the word must mean blind alley.
公共设施/1 | 公园长椅路灯大家爱护 | Public facilities, so the word must mean public facilities.
无障碍设施/1 | 坡道盲道带扶手的厕所 | Accessible facilities, so the word must mean barrier-free facilities.
消防栓/1 | 路边红色的不能在前面停车 | A fire hydrant, so the word must mean fire hydrant.
坡道/1 | 坐轮椅的人也能进 | A ramp, so the word must mean ramp.
消防通道/1 | 不能停车否则消防车进不来 | The fire lane, so the word must mean fire escape route.
应急避难所/1 | 地震后居民转移到 | An emergency shelter, so the word must mean emergency shelter.
停机坪/1 | 医院楼顶直升机送病人 | A helipad, so the word must mean helipad.
污水处理厂/1 | 脏水变干净才流进河里 | A sewage plant, so the word must mean sewage treatment plant.
井盖/1 | 不见了留下危险的洞 | A manhole cover, so the word must mean manhole cover.
社区中心/1 | 有图书室健身房老人活动室 | The community centre, so the word must mean community centre.
蜡烛/1 | 停电了妈妈点起一支 | A candle, so the word must mean candle.
蜡笔/1 | 弟弟画太阳和小房子 | Crayons, so the word must mean crayon.
蜡像/1 | 和真人一模一样 | Wax figures, so the word must mean waxwork.
石蜡/1 | 现在很多蜡烛用它做 | Paraffin wax, so the word must mean paraffin.
蜂蜡/1 | 蜜蜂造六边形小格子 | Beeswax, so the word must mean beeswax.
打蜡/1 | 木地板又亮又滑 | Waxing, so the word must mean to wax.
蜡黄/1 | 病了好几天脸色 | Sallow, so the word must mean waxy yellow.
烛光/1 | 生日蛋糕上照着笑脸 | Candlelight, so the word must mean candlelight.
烛台/1 | 铜做的插着三支蜡烛 | A candlestick, so the word must mean candleholder.
蜡染/1 | 去掉蜡布上出现白色花纹 | Batik, so the word must mean batik.
扎染/1 | 用线缠紧染出一圈圈白花纹 | Tie-dye, so the word must mean tie-dyeing.
印染/1 | 在布上印出十几种颜色 | Printing and dyeing, so the word must mean printing and dyeing.
染坊/1 | 河边晒满刚染好的蓝布 | A dye house, so the word must mean dyeworks.
染料/1 | 古人用植物根和叶子做 | Dyes, so the word must mean dyestuff.
染色/1 | 羊毛洗干净再上颜色 | Dyed, so the word must mean to dye.
蓝印花布/1 | 蓝底白花做头巾 | Blue calico, so the word must mean blue printed cloth.
浸泡/1 | 染布前在清水里放一夜 | Soaking, so the word must mean to soak.
浸透/1 | 大雨让衬衫都湿了 | Soaked through, so the word must mean to drench.
布料/1 | 又软又透气做夏衣 | Fabric, so the word must mean cloth.
碎布/1 | 奶奶拼成一条被子 | Scraps, so the word must mean rags.
包扎/1 | 手划破校医消毒 | Bandaged, so the word must mean to dress a wound.
扎针/1 | 中医在腿上治疗 | Acupuncture, so the word must mean to give acupuncture.
扎根/1 | 小树在山坡上长得越来越高 | Taking root, so the word must mean to take root.
扎实/1 | 基础好学新知识快 | Solid, so the word must mean solid.
扎营/1 | 天黑登山队在山脚 | Pitching camp, so the word must mean to camp.
挣扎/1 | 小鸟被网缠住拼命 | Struggling, so the word must mean to struggle.
包裹/1 | 快递员送来家乡特产 | A parcel, so the word must mean package.
裹足不前/1 | 遇到困难就停下 | Hesitating, so the word must mean to hold back.
沉浸/1 | 节日晚上大家在快乐中 | Immersed, so the word must mean to be immersed.
浸湿/1 | 跑完步头发被汗水 | Soaked, so the word must mean to wet.
葫芦/1 | 切成两半做水瓢 | A gourd, so the word must mean gourd.
糖葫芦/1 | 冬天北京街头的小摊 | Candied haws, so the word must mean candied fruit on a stick.
葫芦丝/1 | 吹云南民歌声音柔和 | A gourd flute, so the word must mean hulusi.
芦花/1 | 秋天河边白茫茫一片 | Reed flowers, so the word must mean reed catkins.
藤编/1 | 篮子椅子又轻又结实 | Rattan work, so the word must mean rattan weaving.
藤椅/1 | 爷爷坐在上面乘凉 | A rattan chair, so the word must mean cane chair.
藤条/1 | 泡软弯成各种形状 | Canes, so the word must mean rattan.
竹编/1 | 竹篮竹席竹灯笼 | Bamboo weaving, so the word must mean bamboo weaving.
草编/1 | 麦子茎编草帽草鞋 | Straw weaving, so the word must mean straw plaiting.
顺藤摸瓜/1 | 警察找到丢失的自行车 | Following the trail, so the word must mean to follow clues.
雨伞/1 | 下午有雨出门带 | An umbrella, so the word must mean umbrella.
油纸伞/1 | 纸做刷了桐油 | An oil-paper umbrella, so the word must mean oiled paper umbrella.
降落伞/1 | 飞行员安全落地 | A parachute, so the word must mean parachute.
遮阳伞/1 | 沙滩上彩色的 | Sunshades, so the word must mean parasol.
打伞/1 | 雨不大没撑就走回家 | Holding an umbrella, so the word must mean to put up an umbrella.
丝绵/1 | 被子又轻又暖和 | Silk floss, so the word must mean silk wadding.
绵羊/1 | 草原上低头吃草像白云 | Sheep, so the word must mean sheep.
连绵/1 | 南方春天阴雨不断 | Continuous, so the word must mean unbroken.
海绵/1 | 能吸很多水擦桌子 | A sponge, so the word must mean sponge.
绵软/1 | 棉花糖又白又 | Soft, so the word must mean soft.
盒子/1 | 爷爷做的木头装玩具 | A box, so the word must mean box.
饭盒/1 | 中午打开有米饭和菜 | A lunch box, so the word must mean lunch box.
礼盒/1 | 中秋装着月饼的 | Gift boxes, so the word must mean gift box.
铅笔盒/1 | 放铅笔橡皮和尺子 | A pencil case, so the word must mean pencil box.
首饰盒/1 | 项链耳环放进去 | A jewellery box, so the word must mean jewellery box.
纸浆/1 | 木头打碎煮烂做纸 | Pulp, so the word must mean paper pulp.
豆浆/1 | 早饭喝一杯配油条 | Soy milk, so the word must mean soybean milk.
泥浆/1 | 雨后工地鞋子陷进去 | Mud, so the word must mean slurry.
糖浆/1 | 医生开一瓶止咳 | Syrup, so the word must mean syrup.
岩浆/1 | 火山爆发流出红色的 | Lava, so the word must mean magma.
枕头/1 | 太高睡得不舒服 | The pillow, so the word must mean pillow.
枕巾/1 | 绣着花铺在枕头上 | A pillow towel, so the word must mean pillow cover cloth.
枕套/1 | 拉开拿出枕芯 | The pillowcase, so the word must mean pillowcase.
瓷枕/1 | 古人夏天用很凉 | Porcelain pillows, so the word must mean porcelain pillow.
毛巾/1 | 游泳后擦干身上的水 | A towel, so the word must mean towel.
围巾/1 | 妈妈用毛线织的红色 | A scarf, so the word must mean scarf.
头巾/1 | 草原风大把头包起来 | A headscarf, so the word must mean headscarf.
纸巾/1 | 感冒流鼻涕用完一大包 | Tissues, so the word must mean tissue.
餐巾/1 | 西餐厅铺在腿上 | The napkin, so the word must mean napkin.
丝巾/1 | 真丝织的又薄又滑 | A silk scarf, so the word must mean silk scarf.
串门/1 | 过年邻居互相拜年 | Dropping in, so the word must mean to visit neighbours.
串珠/1 | 彩色珠子做手链 | Beaded, so the word must mean strung beads.
羊肉串/1 | 新疆烤的又香又嫩 | Lamb kebabs, so the word must mean mutton skewer.
串联/1 | 两个灯泡接在电池上 | Connected in series, so the word must mean to connect in series.
一连串/1 | 丢钱包又错过火车 | A string of, so the word must mean a series of.
水瓢/1 | 从水缸里取水浇花 | A water ladle, so the word must mean gourd ladle.
瓢虫/1 | 背上有七个黑点 | A ladybird, so the word must mean ladybird.
棕色/1 | 小熊的毛 | Brown, so the word must mean brown.
棕绳/1 | 渔民把小船系在岸边 | Coir rope, so the word must mean palm-fibre rope.
棕编/1 | 棕树嫩叶编小鸟小虫 | Palm-leaf weaving, so the word must mean palm-leaf craft.
抹布/1 | 吃完饭擦桌子 | A cloth, so the word must mean rag.
涂抹/1 | 脸上擦防晒霜 | Applying, so the word must mean to smear.
抹去/1 | 悄悄擦掉泪水 | Wiping away, so the word must mean to wipe away.
抹杀/1 | 一次失败不能否定努力 | Erasing, so the word must mean to obliterate.
夹子/1 | 风大把衣服夹在绳子上 | Pegs, so the word must mean clip.
文件夹/1 | 合同放进蓝色的 | A folder, so the word must mean folder.
夹心/1 | 饼干中间有巧克力 | Filled, so the word must mean with filling.
发夹/1 | 头上蝴蝶形状的 | A hair clip, so the word must mean hairpin.
夹杂/1 | 普通话里有家乡话 | Mixed with, so the word must mean to be mixed with.
夹缝/1 | 小草从石头里长出来 | Cracks, so the word must mean crevice.
轿子/1 | 古时当官的出门坐 | Sedan chairs, so the word must mean sedan chair.
花轿/1 | 新娘坐着到新郎家 | A bridal sedan, so the word must mean bridal sedan chair.
抬轿/1 | 走得又稳又快 | Carrying the sedan, so the word must mean to carry a sedan chair.
掀开/1 | 锅盖香味扑面而来 | Lifting off, so the word must mean to lift.
掀起/1 | 电影带来学书法热潮 | Set off, so the word must mean to set off.
婚俗/1 | 各地结婚的讲究不同 | Wedding customs, so the word must mean marriage customs.
寿面/1 | 爷爷八十岁吃长长的 | Longevity noodles, so the word must mean birthday noodles.
抓周/1 | 一岁生日抓了毛笔 | The first-birthday pick, so the word must mean first birthday object-grabbing.
做寿/1 | 奶奶七十岁全家准备 | Celebrating a birthday, so the word must mean to celebrate an elder's birthday.
寿桃/1 | 祝寿桌上用面做的 | Longevity peaches, so the word must mean birthday peach bun.
蒲扇/1 | 夏夜爷爷摇着讲故事 | A palm fan, so the word must mean cattail fan.
蒲公英/1 | 一吹种子就飞走 | A dandelion, so the word must mean dandelion.
蒲团/1 | 寺庙地上圆圆的 | Cushions, so the word must mean prayer cushion.
凳子/1 | 踩着放书到最上面 | A stool, so the word must mean stool.
坐冷板凳/1 | 一个赛季一场没上 | Sitting on the bench, so the word must mean to be benched.
桐油/1 | 木船涂上不怕水泡 | Tung oil, so the word must mean tung oil.
泡桐/1 | 长得快木头轻 | Paulownia, so the word must mean paulownia.
油桐/1 | 四月开白花种子能榨油 | Tung trees, so the word must mean tung tree.
酿造/1 | 传统方法做酱油晒一年 | Brewing, so the word must mean to brew.
酿蜜/1 | 蜜蜂忙着采花 | Making honey, so the word must mean to make honey.
牡丹/1 | 洛阳四月很多人去看 | Peonies, so the word must mean peony.
丹顶鹤/1 | 头顶红色象征长寿 | The red-crowned crane, so the word must mean red-crowned crane.
丹青/1 | 老画家一生爱好 | Painting, so the word must mean painting.
泼墨/1 | 几笔画出烟雨远山 | Splashed ink, so the word must mean splash-ink painting.
活泼/1 | 小猫好像要跳下来 | Lively, so the word must mean lively.
文房四宝/1 | 毛笔墨宣纸 | The four treasures of the study, so the word must mean four treasures of the study.
雕版/1 | 唐代把字刻在木板上印书 | Woodblock printing, so the word must mean block printing.
活字/1 | 北宋一个字用很多次 | Movable type, so the word must mean movable type.
刻刀/1 | 在木板上刻出花纹 | A carving knife, so the word must mean graver.
剪影/1 | 照侧脸用黑纸剪出 | A silhouette, so the word must mean silhouette.
端午/1 | 五月初五吃粽子 | The Dragon Boat Festival, so the word must mean Duanwu.
重阳/1 | 九月初九登高看老人 | The Double Ninth Festival, so the word must mean Chongyang.
清明/1 | 回老家扫墓 | Qingming, so the word must mean Tomb-Sweeping Day.
踏青/1 | 春天去郊外看桃花 | A spring outing, so the word must mean to go for a spring walk.
汤圆/1 | 元宵节晚上全家吃 | Sweet dumplings, so the word must mean tangyuan.
花灯/1 | 元宵节街上挂满 | Lanterns, so the word must mean festive lantern.
猜灯谜/1 | 公园里猜对有奖品 | Lantern riddles, so the word must mean to guess lantern riddles.
赛龙舟/1 | 端午节江上两岸观众 | Dragon boat racing, so the word must mean to race dragon boats.
赏月/1 | 中秋吃月饼 | Admiring the moon, so the word must mean to admire the moon.
泼水节/1 | 西双版纳四月互相祝福 | The Water-Splashing Festival, so the word must mean Water-Splashing Festival.
小年/1 | 腊月二十三开始准备过年 | Little New Year, so the word must mean Little New Year.
祭灶/1 | 请灶王上天说好话 | Offerings to the Kitchen God, so the word must mean to worship the Kitchen God.
年货/1 | 春节前超市挤满人 | New Year goods, so the word must mean Spring Festival shopping.
办年货/1 | 离春节一星期妈妈忙着 | New Year shopping, so the word must mean to do Spring Festival shopping.
贴春联/1 | 除夕上午在大门两边 | Putting up couplets, so the word must mean to put up spring couplets.
团圆饭/1 | 全家人一起吃一顿 | A reunion dinner, so the word must mean family reunion dinner.
门神/1 | 大门上贴两张希望平安 | Door gods, so the word must mean door god.
福字/1 | 倒着贴意思福到了 | The fu character, so the word must mean the character for good fortune.
瑞雪/1 | 兆丰年 | Timely snow, so the word must mean auspicious snow.
碎碎平安/1 | 过年打破碗奶奶笑着说 | Peace every year, so the word must mean broken pieces bring peace.
泥人/1 | 天津姓张的艺人捏的 | Clay figures, so the word must mean clay figurine.
糖人/1 | 把糖吹成小动物 | Sugar figures, so the word must mean blown-sugar figure.
糖画/1 | 糖倒在石板上画一条龙 | Sugar painting, so the word must mean sugar painting.
面塑/1 | 彩色面团捏孙悟空 | Dough modelling, so the word must mean dough figurine.
唐三彩/1 | 唐代黄绿白陶器 | Tang tricolour, so the word must mean tricolour glazed pottery.
紫砂壶/1 | 宜兴泡茶茶香不散 | A Yixing teapot, so the word must mean purple clay teapot.
抖空竹/1 | 公园里老人转得飞快 | Diabolo, so the word must mean to play diabolo.
景泰蓝/1 | 北京工艺品多用蓝色 | Cloisonne, so the word must mean cloisonne.
苏绣/1 | 苏州刺绣两面都能看 | Suzhou embroidery, so the word must mean Su embroidery.
云锦/1 | 南京为皇宫织造 | Cloud brocade, so the word must mean Yunjin brocade.
拼搏/1 | 运动员顽强争荣誉 | Striving, so the word must mean to struggle hard.
搏斗/1 | 渔民和大风大浪一整夜 | Fighting, so the word must mean to wrestle.
搏击/1 | 每周学两次身体结实 | Combat sports, so the word must mean fighting.
脉搏/1 | 跑完步每分钟一百多次 | Pulse, so the word must mean pulse.
奔驰/1 | 马在草原上扬起尘土 | Galloping, so the word must mean to gallop.
驰名/1 | 景德镇瓷器中外 | Famous, so the word must mean renowned.
背道而驰/1 | 要减肥却吃很多甜食 | Running counter, so the word must mean to run counter to.
凯旋/1 | 冠军队员归来 | Triumphant return, so the word must mean to return in triumph.
凯歌/1 | 球队一路高奏打进决赛 | Songs of victory, so the word must mean triumphal song.
夺冠/1 | 年轻球队终于 | Won the title, so the word must mean to win the championship.
胳膊/1 | 举哑铃一小时酸了 | Arms, so the word must mean arm.
脖子/1 | 长颈鹿的很长 | The neck, so the word must mean neck.
大拇指/1 | 大家向他竖起 | Thumbs up, so the word must mean thumb.
身躯/1 | 拖着疲倦的走回家 | His body, so the word must mean frame.
躯干/1 | 头和四肢之外的部分 | The trunk, so the word must mean torso.
手掌/1 | 把小石子放在上面 | Palm, so the word must mean palm.
腹肌/1 | 做仰卧起坐练出来 | Abdominal muscles, so the word must mean abs.
韧带/1 | 踢球拉伤膝盖的 | Ligaments, so the word must mean ligament.
脚尖/1 | 跳芭蕾用它站立 | Tiptoe, so the word must mean tiptoe.
脚跟/1 | 刚到新公司还没站稳 | A footing, so the word must mean heel.
憋气/1 | 在水下两分钟 | Holding breath, so the word must mean to hold one's breath.
蹬腿/1 | 学蛙泳先收腿再向后 | Kicking back, so the word must mean to kick out.
俯身/1 | 把地上的球拿起来 | Bending down, so the word must mean to bend over.
跪下/1 | 老师单膝和孩子一样高 | Kneeling, so the word must mean to kneel.
踢腿/1 | 武术课向前踢得又高又直 | Kicks, so the word must mean to kick.
压腿/1 | 把腿放在栏杆上 | Stretching legs, so the word must mean to stretch one's legs.
翻跟头/1 | 杂技演员连着翻 | Somersaults, so the word must mean to turn somersaults.
倒立/1 | 双手撑地两腿笔直 | A handstand, so the word must mean handstand.
绊倒/1 | 跑太快被石头 | Tripped, so the word must mean to trip.
竖起/1 | 小狗听到声音耳朵 | Pricked up, so the word must mean to prick up.
木棍/1 | 爷爷走山路拿着 | A stick, so the word must mean wooden stick.
竹竿/1 | 院子里挂衣服晒 | A bamboo pole, so the word must mean bamboo pole.
钓竿/1 | 湖边钓了三条鱼 | A fishing rod, so the word must mean fishing rod.
撑竿跳高/1 | 拿长竿跳过横杆 | Pole vault, so the word must mean pole vault.
立竿见影/1 | 锻炼效果要几个月 | Immediate results, so the word must mean instant effect.
棍术/1 | 长棍在手里转得飞快 | Staff fighting, so the word must mean cudgel play.
靶子/1 | 射箭场一圈圈彩色圆环 | Targets, so the word must mean target.
靶心/1 | 一箭射中得十分 | The bullseye, so the word must mean bullseye.
打靶/1 | 军训第一次很紧张 | Target practice, so the word must mean shooting practice.
射箭/1 | 拉开弓瞄准七十米外 | Archery, so the word must mean archery.
橄榄球/1 | 椭圆形抱着跑 | Rugby, so the word must mean rugby.
棒球/1 | 击球手用木棒打 | Baseball, so the word must mean baseball.
垒球/1 | 像棒球但球大场地小 | Softball, so the word must mean softball.
手球/1 | 用手传球扔进球门 | Handball, so the word must mean handball.
冰球/1 | 冰上用球杆打小圆饼 | Ice hockey, so the word must mean ice hockey.
门球/1 | 退休老人在草地上打 | Gateball, so the word must mean gateball.
高尔夫/1 | 球场草地一眼望不到头 | Golf, so the word must mean golf.
曲棍球/1 | 用一头弯曲的棍子 | Hockey, so the word must mean field hockey.
球衣/1 | 背后印着号码 | Jerseys, so the word must mean jersey.
俱乐部/1 | 学校足球每周练三次 | A club, so the word must mean club.
乒乓球/1 | 中国的国球 | Table tennis, so the word must mean table tennis.
球台/1 | 中间有一张网 | The table, so the word must mean table tennis table.
发球/1 | 先把球抛起来再打 | Serving, so the word must mean to serve.
接球/1 | 对方球又快又低没打过网 | Returning, so the word must mean to receive.
横拍/1 | 握拍像跟人握手 | Shakehand grip, so the word must mean shakehand grip.
直拍/1 | 握拍像拿笔 | Penhold grip, so the word must mean penhold grip.
握拍/1 | 不能太紧手腕放松 | The grip, so the word must mean to hold the racket.
杀球/1 | 跳起来又快又重 | A smash, so the word must mean smash.
吊球/1 | 轻轻一打刚过网就落 | A drop shot, so the word must mean drop shot.
清脆/1 | 球打在台上的响声 | Crisp, so the word must mean clear and crisp.
田径/1 | 跑步跳远跳高扔铅球 | Athletics, so the word must mean track and field.
跨栏/1 | 一百一十米跨过十个栏架 | Hurdles, so the word must mean hurdles.
接力赛/1 | 四人每人跑一百米 | A relay, so the word must mean relay race.
马拉松/1 | 四十二点一九五公里 | A marathon, so the word must mean marathon.
铅球/1 | 放在肩膀上推出去 | The shot put, so the word must mean shot put.
标枪/1 | 又细又长助跑扔出 | The javelin, so the word must mean javelin.
铁饼/1 | 像扁盘子转几圈扔 | The discus, so the word must mean discus.
投掷/1 | 铅球标枪铁饼 | Throwing events, so the word must mean throwing.
起跑线/1 | 比赛前运动员在后面准备 | The starting line, so the word must mean starting line.
终点线/1 | 第一个冲过赢冠军 | The finishing line, so the word must mean finish line.
自由体操/1 | 大地毯上翻腾跳跃 | Floor exercise, so the word must mean floor exercise.
吊环/1 | 抓住两个挂在空中的圆环 | The rings, so the word must mean still rings.
鞍马/1 | 上面有两个把手身体转动 | Pommel horse, so the word must mean pommel horse.
跳马/1 | 助跑撑一下空中翻转 | The vault, so the word must mean vault.
平衡木/1 | 只有十厘米宽不能出错 | The balance beam, so the word must mean balance beam.
俯卧撑/1 | 双手把身体撑起再放下 | Press-ups, so the word must mean push-up.
仰卧起坐/1 | 躺在垫子上一口气三十个 | Sit-ups, so the word must mean sit-up.
哑铃/1 | 举二十分钟手臂结实 | Dumbbells, so the word must mean dumbbell.
跑步机/1 | 下雨天在家里跑 | A treadmill, so the word must mean treadmill.
广播体操/1 | 第二节课后全校到操场做 | Morning exercises, so the word must mean radio calisthenics.
自由泳/1 | 对泳姿没有限制 | Freestyle, so the word must mean freestyle.
蛙泳/1 | 动作像青蛙 | Breaststroke, so the word must mean breaststroke.
仰泳/1 | 脸朝上游 | Backstroke, so the word must mean backstroke.
花样游泳/1 | 在水中跳舞 | Artistic swimming, so the word must mean synchronised swimming.
泳池/1 | 长五十米可以正式比赛 | The pool, so the word must mean swimming pool.
泳镜/1 | 戴上在水下看清楚 | Goggles, so the word must mean swimming goggles.
淋浴/1 | 游泳前冲洗干净 | A shower, so the word must mean to shower.
浴巾/1 | 洗完澡擦干身上 | A bath towel, so the word must mean bath towel.
浴室/1 | 宾馆里有热水和毛巾 | The bathroom, so the word must mean bathroom.
海水浴/1 | 夏天在海里游泳晒太阳 | Sea bathing, so the word must mean sea bath.
冰壶/1 | 推石头队友刷冰 | Curling, so the word must mean curling.
速滑/1 | 弯着腰比谁用时少 | Speed skating, so the word must mean speed skating.
花样滑冰/1 | 冰上随音乐跳跃旋转 | Figure skating, so the word must mean figure skating.
冬奥会/1 | 二零二二年北京举办 | The Winter Olympics, so the word must mean Winter Olympics.
冰场/1 | 湖结了厚冰 | A rink, so the word must mean skating rink.
冰刀/1 | 冰鞋下又薄又锋利 | The blades, so the word must mean skate blade.
冰鞋/1 | 第一次滑冰先租一双 | Skates, so the word must mean ice skates.
滑雪场/1 | 很多雪道初学者在缓坡练 | A ski resort, so the word must mean ski resort.
跳台/1 | 十米高准备往下跳 | The platform, so the word must mean diving platform.
单板/1 | 两只脚站在一块板上 | Snowboarding, so the word must mean snowboard.
摔跤/1 | 雪天路滑小心 | Falling, so the word must mean to fall over.
柔道/1 | 起源于日本白色蓝色衣服 | Judo, so the word must mean judo.
空手道/1 | 学了五年系上黑带 | Karate, so the word must mean karate.
散打/1 | 中国武术发展来能用拳脚 | Sanda, so the word must mean free combat.
格斗/1 | 拳击柔道摔跤 | Combat, so the word must mean combat.
护具/1 | 保护头和膝盖 | Protective gear, so the word must mean protective gear.
黑带/1 | 柔道空手道水平很高 | A black belt, so the word must mean black belt.
扎马步/1 | 两腿分开蹲下半小时 | The horse stance, so the word must mean to hold a horse stance.
舞剑/1 | 剑在老人手里像银龙 | Sword dancing, so the word must mean to perform a sword dance.
套路/1 | 太极拳二十四个动作 | The routine, so the word must mean set routine.
复赛/1 | 预赛成绩好顺利进入 | The semi-finals, so the word must mean second round.
淘汰赛/1 | 输的一方要回家 | The knockout stage, so the word must mean knockout round.
小组赛/1 | 每组四队互相比一场 | The group stage, so the word must mean group stage.
加时赛/1 | 九十分钟一比一 | Extra time, so the word must mean overtime.
种子选手/1 | 头号第一轮不遇强敌 | A seed, so the word must mean seeded player.
黑马/1 | 没名气的球队打进决赛 | A dark horse, so the word must mean dark horse.
爆冷/1 | 世界第一第一轮就输 | An upset, so the word must mean upset.
打平/1 | 最后一比一 | Drew, so the word must mean to draw.
反超/1 | 落后两分连进三球 | Overtaking, so the word must mean to come from behind.
绝杀/1 | 最后一秒投进三分 | A buzzer-beater, so the word must mean winning shot at the last moment.
运动会/1 | 学校秋天跑步跳远拔河 | A sports day, so the word must mean sports meet.
亚运会/1 | 二零一零年在广州 | The Asian Games, so the word must mean Asian Games.
全运会/1 | 国内水平最高各省派队 | The National Games, so the word must mean National Games.
残奥会/1 | 残疾人运动员参加 | The Paralympics, so the word must mean Paralympics.
代表团/1 | 四百多名运动员参加奥运 | The delegation, so the word must mean delegation.
开幕式/1 | 各国运动员排队走进体育场 | The opening ceremony, so the word must mean opening ceremony.
闭幕式/1 | 大家依依不舍告别 | The closing ceremony, so the word must mean closing ceremony.
圣火/1 | 在希腊点燃传到举办城市 | The Olympic flame, so the word must mean sacred flame.
奖牌榜/1 | 最后一天排第一 | The medal table, so the word must mean medal table.
不胜枚举/1 | 奖牌奖杯数不过来 | The athlete has won more medals and cups than anyone could count, so the word must mean too numerous to list.
前锋/1 | 这个赛季进了二十个球 | A striker, so the word must mean forward.
后卫/1 | 防守好对方一球未进 | The defenders, so the word must mean defender.
中锋/1 | 身高两米一篮球队的 | The centre, so the word must mean centre.
扣篮/1 | 双手把球扣进篮筐 | A slam dunk, so the word must mean dunk.
三分球/1 | 离篮筐很远投进 | A three-pointer, so the word must mean three-point shot.
助攻/1 | 这个球是他传的 | An assist, so the word must mean assist.
越位/1 | 踢进了但裁判说不算 | Offside, so the word must mean offside.
角球/1 | 球被碰出了底线 | A corner, so the word must mean corner kick.
头球/1 | 跳起来顶进球门 | A header, so the word must mean header.
任意球/1 | 对方犯规一脚踢进 | A free kick, so the word must mean free kick.
攀岩/1 | 戴安全绳在陡墙上 | Climbing, so the word must mean rock climbing.
蹦极/1 | 从五十米高桥上跳下 | Bungee jumping, so the word must mean bungee jumping.
越野/1 | 经过树林小河山坡 | Cross-country, so the word must mean cross-country.
翻山越岭/1 | 登山队走了三天到山顶 | Over hill and dale, so the word must mean to cross mountains and ridges.
陡坡/1 | 骑车上不去只能推 | A steep slope, so the word must mean steep slope.
分水岭/1 | 受伤后改当教练 | A turning point, so the word must mean watershed.
跳伞/1 | 从三千米高飞机上 | Skydiving, so the word must mean to parachute.
滑翔伞/1 | 背着借风飞上天 | A paraglider, so the word must mean paraglider.
淋湿/1 | 没带伞全身 | Soaked, so the word must mean to get drenched.
白跑一趟/1 | 比赛改了时间 | A wasted trip, so the word must mean to make a trip for nothing.
公告/1 | 公司网站宣布新产品 | An announcement, so the word must mean public notice.
通告/1 | 交通部门说下周禁止通行 | A notice, so the word must mean circular.
启事/1 | 丢了钱包贴一张寻物 | A notice, so the word must mean announcement.
失物招领/1 | 拾到手表交到 | Lost and found, so the word must mean lost property.
兹定于/1 | 本月十五日召开会议 | It is hereby set, so the word must mean it is hereby scheduled.
特此通知/1 | 通知正文最后写四个字 | Hereby notified, so the word must mean notice is hereby given.
届时/1 | 明天九点到时请准时集合 | At that time, so the word must mean when the time comes.
务必/1 | 请一定在周五前交 | Without fail, so the word must mean must.
敬请/1 | 新年晚会请家长光临 | Cordially inviting, so the word must mean to respectfully request.
告知/1 | 地址变了请通知我们 | Inform, so the word must mean to inform.
称呼/1 | 第一行顶格写亲爱的王老师 | The salutation, so the word must mean form of address.
正文/1 | 写在称呼下一行空两格 | The body, so the word must mean main text.
此致/1 | 下一行顶格写敬礼 | With respect, so the word must mean with this I convey.
敬上/1 | 名字后面写两个字 | Respectfully yours, so the word must mean respectfully submitted.
附言/1 | 写完信又加一段提醒回信 | A postscript, so the word must mean postscript.
收件人/1 | 快递员请他签字 | The addressee, so the word must mean recipient.
发件人/1 | 没写名字不知谁寄来 | The sender, so the word must mean sender.
敬启者/1 | 旧式书信开头 | To whom it may concern, so the word must mean respectfully addressed.
邮政编码/1 | 信封左上角六个小格子 | The postcode, so the word must mean postal code.
顺颂/1 | 给长辈写信结尾安康 | Wishing you, so the word must mean and with best wishes.
赐教/1 | 还请先生不吝 | Your guidance, so the word must mean to favour with instruction.
恭候/1 | 晚会在门口等各位 | Awaiting, so the word must mean to respectfully await.
光临/1 | 欢迎来本店 | Visiting, so the word must mean presence.
惠存/1 | 送老师的书上写 | Please keep, so the word must mean kindly keep.
敬赠/1 | 全体学生 | Presented, so the word must mean respectfully presented.
为盼/1 | 请在周五前回复 | Hoping, so the word must mean it is hoped.
热忱/1 | 志愿者为大家服务 | Enthusiasm, so the word must mean warmth.
谢忱/1 | 谨向朋友致以 | Thanks, so the word must mean heartfelt thanks.
久仰/1 | 今天终于见到您 | Long admired, so the word must mean to have long looked forward to meeting.
指正/1 | 报告不对的地方请批评 | Correction, so the word must mean to point out errors.
感谢信/1 | 出院时给医生护士写 | A thank-you letter, so the word must mean letter of thanks.
表扬信/1 | 乘客希望公司称赞司机 | A letter of praise, so the word must mean letter of commendation.
慰问信/1 | 给灾区小朋友写 | Letters of sympathy, so the word must mean letter of sympathy.
邀请函/1 | 请家长参加毕业典礼 | An invitation, so the word must mean letter of invitation.
贺信/1 | 学校得冠军教育局发来 | A congratulatory letter, so the word must mean letter of congratulations.
特此证明/1 | 该生是我校三年级学生 | This is to certify, so the word must mean this is to certify.
介绍信/1 | 说明这人是谁做什么 | A letter of introduction, so the word must mean letter of introduction.
自荐信/1 | 介绍特长希望得到工作 | A cover letter, so the word must mean letter of self-recommendation.
辞职信/1 | 换工作给经理写 | A resignation letter, so the word must mean letter of resignation.
喜报/1 | 考上大学学校寄到家 | Good news, so the word must mean announcement of good news.
唁电/1 | 很多国家科学家通过电报发来 | Telegrams of condolence, so the word must mean telegram of condolence.
唁函/1 | 给老师家人写一封 | A letter of condolence, so the word must mean letter of condolence.
吊唁/1 | 到老教授家安慰家人 | Paying respects, so the word must mean to offer condolences.
节哀/1 | 请你保重身体 | Restrain your grief, so the word must mean to restrain one's grief.
致哀/1 | 降半旗悼念 | Mourning, so the word must mean to pay tribute.
默哀/1 | 起立低头一分钟 | A minute's silence, so the word must mean to stand in silent tribute.
瞻仰/1 | 清明到烈士陵园 | Paying homage, so the word must mean to look at with reverence.
肃静/1 | 阅览室不要大声 | Silence, so the word must mean solemn silence.
肃然起敬/1 | 老医生在山村几十年 | Deep respect, so the word must mean to be filled with respect.
严肃/1 | 老师表情事情很重要 | Serious, so the word must mean stern.
简报/1 | 每周简单介绍工作 | A bulletin, so the word must mean briefing.
述职报告/1 | 年底经理说明一年工作 | A performance report, so the word must mean work report.
调查报告/1 | 问了两百人关于垃圾分类 | A survey report, so the word must mean investigation report.
可行性报告/1 | 分析计划能不能做成 | A feasibility report, so the word must mean feasibility study.
年度/1 | 回顾一年来的工作 | Annual, so the word must mean year.
季度/1 | 一年有四个 | Quarters, so the word must mean quarter.
上半年/1 | 一月到六月 | The first half of the year, so the word must mean first half of the year.
附表/1 | 报告后面的具体数字 | The appended table, so the word must mean attached table.
现将/1 | 本月工作情况报告如下 | Herewith, so the word must mean we now.
总计/1 | 这个月收入三万元 | In total, so the word must mean total.
倍数/1 | 十二除以三等于四 | A multiple, so the word must mean multiple.
加倍/1 | 考试快到更努力 | Redoubled, so the word must mean to double.
成倍/1 | 网上买东西的人增加 | Many times over, so the word must mean manifold.
倍增/1 | 每天一百件变两百件 | Doubled, so the word must mean to multiply.
事半功倍/1 | 方法对了学习 | Twice the result, so the word must mean twice the result for half the effort.
同比/1 | 今年五月比去年五月 | Year on year, so the word must mean year-on-year.
环比/1 | 这个月比上个月 | Month on month, so the word must mean period-on-period.
百分点/1 | 百分之五降到百分之四 | A percentage point, so the word must mean percentage point.
剩余/1 | 用了八千还剩两千 | Remaining, so the word must mean surplus.
过剩/1 | 苹果太多价格下降 | A glut, so the word must mean excess.
申请书/1 | 想加入志愿者协会 | An application, so the word must mean application.
倡议书/1 | 号召全校节约用水 | A proposal, so the word must mean written appeal.
建议书/1 | 希望学校多开体育课 | A letter of suggestion, so the word must mean written proposal.
计划书/1 | 创业要做什么需要多少钱 | A business plan, so the word must mean plan.
协议书/1 | 双方签字事情定下来 | The agreement, so the word must mean written agreement.
说明书/1 | 使用机器前仔细阅读 | The manual, so the word must mean instructions.
请假条/1 | 发烧妈妈给老师写 | A sick note, so the word must mean leave note.
批复/1 | 上级同意了计划 | An official reply, so the word must mean written reply.
批示/1 | 校长写同意请马上办理 | Instructions, so the word must mean written instructions.
请批示/1 | 妥否 | Please advise, so the word must mean please give instructions.
会议纪要/1 | 把会上决定整理发给部门 | The minutes, so the word must mean meeting summary.
会议记录/1 | 写清时间地点每人发言 | The record of the meeting, so the word must mean meeting record.
记录人/1 | 会议记录最后写名字 | The note-taker, so the word must mean recorder.
列席/1 | 学生代表不参加表决 | Attending without a vote, so the word must mean to attend as a non-voting delegate.
缺席/1 | 两人因病没来 | Absent, so the word must mean to be absent.
签到/1 | 到了以后先在门口 | Signing in, so the word must mean to sign in.
签到表/1 | 数上面的名字三十人 | The sign-in sheet, so the word must mean attendance sheet.
举手表决/1 | 没有不同意见全部同意 | A show of hands, so the word must mean to vote by show of hands.
与会/1 | 参加会议的人都签了名 | Attending, so the word must mean to attend a meeting.
议定/1 | 讨论后定下次会议日期 | Agreed, so the word must mean to agree upon.
编号/1 | 每份合同方便查找 | A number, so the word must mean serial number.
文号/1 | 公文标题上面的代字年份 | The document number, so the word must mean reference number.
签发/1 | 要由局长签字才能发出 | Signed and issued, so the word must mean to sign and issue.
印发/1 | 作息时间表给每个班 | Printed and distributed, so the word must mean to print and distribute.
上报/1 | 周五前把名单交给学校 | Report up, so the word must mean to report to a higher level.
备案/1 | 新公司到有关部门登记 | Registering, so the word must mean to file for the record.
存档/1 | 材料看完不能丢掉 | Filed, so the word must mean to archive.
抄送/1 | 邮件还要发给其他部门 | Copied, so the word must mean to carbon copy.
主送/1 | 主要负责办理的单位 | The principal recipient, so the word must mean main addressee.
函告/1 | 会议时间改了通知单位 | Informed by letter, so the word must mean to notify by letter.
来函/1 | 贵校的已经收到 | Your letter, so the word must mean incoming letter.
复函/1 | 收到对方信后尽快写 | A reply, so the word must mean letter of reply.
致函/1 | 公司给市政府写信 | Wrote to, so the word must mean to send a letter to.
函件/1 | 秘书每天处理几十封 | Letters, so the word must mean correspondence.
此复/1 | 回复来函结尾 | This is our reply, so the word must mean hereby replied.
妥否/1 | 请批示合不合适 | Whether appropriate, so the word must mean is this appropriate.
如下/1 | 有关事项通知 | As follows, so the word must mean as follows.
据此/1 | 车太多市里决定修新路 | On this basis, so the word must mean accordingly.
兹有/1 | 我校学生前往实习 | Hereby, so the word must mean this is to introduce.
兹因/1 | 学校停电课改到下周 | Owing to, so the word must mean because.
收条/1 | 今收到班费叁拾元整 | A receipt, so the word must mean receipt.
欠条/1 | 今欠货款玖拾元整 | An IOU, so the word must mean IOU.
领条/1 | 今领到篮球捌个 | A requisition slip, so the word must mean receipt for items drawn.
大写金额/1 | 支票写成壹万元整 | The amount in words, so the word must mean amount in capitals.
元整/1 | 人民币壹拾捌 | Yuan exactly, so the word must mean yuan only.
合计/1 | 三本书一共六十元 | In total, so the word must mean to add up to.
累计/1 | 这个月一共跑一百公里 | Cumulatively, so the word must mean to total.
结余/1 | 花了两千还剩三百 | A balance, so the word must mean surplus.
乙方/1 | 租房子的一方 | Party B, so the word must mean party B.
丙方/1 | 合同排在第三的一方 | Party C, so the word must mean party C.
浙江/1 | 东部省会是杭州 | Zhejiang, so the word must mean Zhejiang.
杭州/1 | 西湖所在 | Hangzhou, so the word must mean Hangzhou.
陕西/1 | 省会西安有兵马俑 | Shaanxi, so the word must mean Shaanxi.
辽宁/1 | 东北南边靠海 | Liaoning, so the word must mean Liaoning.
河北/1 | 简称冀 | Hebei, so the word must mean Hebei.
湘江/1 | 湖南最大河流进洞庭湖 | The Xiang River, so the word must mean Xiang River.
湘菜/1 | 湖南菜又香又辣 | Hunan cuisine, so the word must mean Hunan cuisine.
辽阔/1 | 内蒙古草原望不到边 | Vast, so the word must mean vast.
联系电话/1 | 报名表上方便打电话通知 | A contact number, so the word must mean contact phone number.
电子邮箱/1 | 作业发到老师的 | Email, so the word must mean email address.
希冀/1 | 怀着对未来的去大城市 | Hope, so the word must mean aspiration.
瞩目/1 | 研究成果引人 | Attention, so the word must mean to focus attention on.
举世瞩目/1 | 长城伟大工程 | World-famous, so the word must mean attracting worldwide attention.
高瞻远瞩/1 | 几十年前就重视外语 | Far-sighted, so the word must mean far-sighted.
禀报/1 | 下人把消息告诉主人 | Reporting, so the word must mean to report to a superior.
禀性/1 | 从小善良愿意帮人 | Nature, so the word must mean natural disposition.
恩赐/1 | 好成绩不是别人给的 | A gift, so the word must mean favour.
赏赐/1 | 立功将军得到皇帝的 | Rewards, so the word must mean imperial reward.
园丁/1 | 老师比作辛勤的 | Gardeners, so the word must mean gardener.
人丁/1 | 希望家里兴旺 | Family members, so the word must mean population of a family.
傍晚/1 | 太阳快落山天边红 | Evening, so the word must mean dusk.
顷刻/1 | 大雨路上全是水 | In a moment, so the word must mean instant.
每逢/1 | 周一早上升旗 | Every, so the word must mean on every occasion.
逢年过节/1 | 给远方父母打电话 | On holidays, so the word must mean at festivals and new year.
千载难逢/1 | 到国家队训练的机会 | Once in a lifetime, so the word must mean rare.
久别重逢/1 | 老同学紧紧抱在一起 | Reunited, so the word must mean to meet after long separation.
钥匙/1 | 出门忘带只好等妈妈 | His keys, so the word must mean key.
徐徐/1 | 国旗慢慢升起 | Slowly, so the word must mean gently.
公顷/1 | 农场五百种小麦 | Hectares, so the word must mean hectare.
贮存/1 | 粮食放在仓库准备过冬 | Stored, so the word must mean to store.
`);
