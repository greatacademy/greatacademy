// The clues of the gap sentences of the level 6 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelSixClues are the clues of the gap sentences of the level 6 words, by clueKey, each word's sentence counted as 1. */
export const levelSixClues = parseClues(`
语言/1 | 世界上有几千种，有的只有很少的人会说 | There are thousands in the world, so the word must mean language.
书面语/1 | 论文不能像聊天一样随便 | A paper must not read like a chat, so the word must mean written language.
俗语/1 | 老百姓常说的“活到老，学到老” | Live and learn is a common saying, so the word must mean folk saying.
成语/1 | “一举两得”这样四个字的固定说法 | A fixed four-character phrase like this, so the word must mean idiom.
词典/1 | 遇到不认识的词可以查 | Look up unknown words in it, so the word must mean dictionary.
字典/1 | 收了一万多个汉字，每个字标拼音 | It lists ten thousand characters with pinyin, so the word must mean character dictionary.
语种/1 | 翻译软件能翻一百多个 | The app translates over a hundred, so the word must mean language.
简体字/1 | 中国大陆的书和报纸用的字 | Mainland books and papers use them, so the word must mean simplified characters.
术语/1 | 医生说的专业词，病人听不懂 | Patients miss the doctor's jargon, so the word must mean technical term.
外来词/1 | “沙发”的读音来自英语 | Shafa comes from English sofa, so the word must mean loanword.
舌头/1 | 发音时要放在上面的牙后面 | It goes behind the upper teeth, so the word must mean tongue.
嘴唇/1 | 天气干的时候常常起皮 | In dry weather it peels, so the word must mean lips.
喊/1 | 在楼下大声叫我的名字 | He called my name loudly from below, so the word must mean to shout.
沙哑/1 | 唱了一晚上歌，声音变了 | After a night of singing his voice changed, so the word must mean hoarse.
沉默/1 | 听到坏消息，很久没有人开口 | No one spoke for a long time, so the word must mean silent.
叹气/1 | 遇到小问题就“唉”一声 | He sighs at every little problem, so the word must mean to sigh.
吐字/1 | 播音员每个字都说得清楚 | The announcer says every word clearly, so the word must mean enunciation.
声调/1 | 普通话有四个，还有轻声 | Mandarin has four plus the neutral tone, so the word must mean tone.
语调/1 | 问问题时句子最后往上走 | It rises at the end of a question, so the word must mean intonation.
低声/1 | 图书馆里怕影响别人 | In a library you speak softly, so the word must mean in a low voice.
含义/1 | 话很简单，意思却很深 | The words are simple but the meaning deep, so the word must mean meaning.
包含/1 | 词里有两层意思 | The word holds two senses, so the word must mean to contain.
包括/1 | 十个国家里有中国和日本 | Ten countries, among them China and Japan, so the word must mean to include.
暗示/1 | 看手表，没直接说该走了 | He looked at his watch instead of saying so, so the word must mean to hint.
所谓/1 | 他说的“好办法”其实没用 | His so-called good idea is useless, so the word must mean so-called.
无所谓/1 | 去哪儿吃饭都可以，你决定 | Anywhere is fine, you decide, so the word must mean to not mind.
在乎/1 | 很关心别人怎么看他 | He cares a lot what others think, so the word must mean to care about.
意味着/1 | 红灯亮了，车必须停 | A red light means stop, so the word must mean to mean.
言外之意/1 | 说“时间不早了”，其实是想回家 | Saying it is late means he wants to go home, so the word must mean implied meaning.
概括/1 | 用一句话说出文章的内容 | Sum up the essay in one sentence, so the word must mean to summarise.
劝/1 | 医生让他多休息，少看手机 | The doctor urged him to rest, so the word must mean to urge.
劝说/1 | 经过朋友们说了很多次才去看医生 | Friends talked him into it, so the word must mean persuasion.
劝告/1 | 不听父母的话，后悔了 | He ignored his parents' advice and regretted it, so the word must mean advice.
说服/1 | 理由充分，大家都同意了 | His sound reasons won everyone over, so the word must mean to convince.
肯定/1 | 老师说他的办法很好 | The teacher praised his method, so the word must mean to affirm.
不肯/1 | 生气了，跟谁都不愿意说话 | Angry, he refused to talk, so the word must mean to refuse.
口才/1 | 讲故事大家都爱听 | Everyone loves to hear him tell a story, so the word must mean eloquence.
恰当/1 | 这个词用在这里不合适 | The word does not fit here, so the word must mean appropriate.
巧妙/1 | 用一个聪明的比喻讲清楚了 | A clever metaphor made it clear, so the word must mean ingenious.
赞同/1 | 大多数人都同意这个计划 | Most people agree with the plan, so the word must mean to approve of.
命令/1 | 船长下的，大家马上离开船 | The captain gave it and all left the ship, so the word must mean order.
指令/1 | 说话就能让手机做事 | You can give a phone spoken instructions, so the word must mean instruction.
口令/1 | 体育课听老师喊“向左转” | Pupils follow the teacher's drill command, so the word must mean word of command.
暗号/1 | 约好拍三下手 | Three claps they agreed on, so the word must mean secret signal.
令人/1 | 这个消息让人高兴 | The news makes one happy, so the word must mean to make one.
派/1 | 经理让他去机场接客人 | The manager sent him to the airport, so the word must mean to send.
传达/1 | 班长把校长的话告诉每个同学 | The monitor relayed the head's words, so the word must mean to pass on.
请示/1 | 自己决定不了，先问经理 | He must ask the manager first, so the word must mean to ask for instructions.
传话/1 | 别让我在你们中间说来说去 | Do not make me your go-between, so the word must mean to carry messages.
回话/1 | 问他明天来不来，再告诉我 | Ask him and let me know, so the word must mean reply.
或者/1 | 坐地铁和坐公共汽车选一个 | Take the subway or the bus, so the word must mean or.
或许/1 | 天这么黑，可能要下雨 | So dark it may rain, so the word must mean perhaps.
若是/1 | 明天不下雨就去爬山 | If it does not rain we will climb, so the word must mean if.
若干/1 | 书分成几个部分 | The book has a number of parts, so the word must mean several.
万一/1 | 多穿衣服，怕晚上变冷 | Dress warmly in case it gets cold, so the word must mean in case.
要不/1 | 快走，不然就迟到了 | Hurry or we will be late, so the word must mean otherwise.
可见/1 | 每天都练习，说明他喜欢音乐 | Daily practice shows he loves music, so the word must mean it is clear that.
难免/1 | 第一次上台，紧张是正常的 | Nerves are only natural the first time, so the word must mean hard to avoid.
既然/1 | 你已经决定了，我就不说了 | Since you have decided, so the word must mean since.
何况/1 | 老师都觉得难，我们更难 | If teachers find it hard, let alone us, so the word must mean let alone.
标点/1 | 写作文时每个都要用对 | Each must be right in an essay, so the word must mean punctuation.
逗号/1 | 一句话没说完，中间停一下 | It marks a pause inside a sentence, so the word must mean comma.
句号/1 | 一句话说完了写在最后 | It ends a sentence, so the word must mean full stop.
问号/1 | “你几点回来”后面用的 | It ends a question, so the word must mean question mark.
引号/1 | 别人的原话前后加上 | They enclose a direct quote, so the word must mean quotation marks.
感叹号/1 | 很强的感情时句子最后用 | It ends a strong exclamation, so the word must mean exclamation mark.
顿号/1 | “春、夏、秋、冬”中间用的 | It separates items in a list, so the word must mean enumeration comma.
冒号/1 | “他说”后面、引号前面用 | It comes after he said, so the word must mean colon.
笔画/1 | “人”只有两个 | The character for person has two, so the word must mean stroke.
部首/1 | “河”和“湖”都是三点水 | Both have the water radical, so the word must mean radical.
比较/1 | 买东西先看几家商店的价格 | Compare prices before buying, so the word must mean to compare.
较/1 | 今天的气温有点高 | Today is rather hot, so the word must mean relatively.
似乎/1 | 他好像不太高兴 | He seems unhappy, so the word must mean seemingly.
几乎/1 | 差不多每天都读一个小时书 | He reads almost every day, so the word must mean almost.
类似/1 | 以前也遇到过差不多的问题 | I have met a similar problem, so the word must mean similar.
相似/1 | 姐妹两个长得很像 | The sisters look alike, so the word must mean alike.
仅仅/1 | 只过了三天大家就忘了 | Only three days later all forgot, so the word must mean merely.
不仅/1 | 会说中文，还会写书法 | He speaks Chinese and also does calligraphy, so the word must mean not only.
似的/1 | 高兴得像个孩子一样 | Happy as a child, so the word must mean as if.
恰好/1 | 我到车站，车正好来了 | The bus came just as I arrived, so the word must mean just in time.
手语/1 | 妹妹听不见，全家都学了 | His sister is deaf so the family learned it, so the word must mean sign language.
盲文/1 | 看不见的人也能读的书 | Blind people can read it, so the word must mean braille.
盲人/1 | 路上有专门给看不见的人走的路 | A path for those who cannot see, so the word must mean blind person.
文盲/1 | 没上过学，五十岁才会读书写字 | He could not read until fifty, so the word must mean illiterate.
助听器/1 | 爷爷戴上以后听得清楚 | Grandpa hears better with it, so the word must mean hearing aid.
眼神/1 | 妈妈看了我一眼让我别说话 | Mum's look told me to be quiet, so the word must mean look in the eyes.
读音/1 | 一个字有两种念法 | The character can be read in two ways, each with its own meaning, so the word must mean pronunciation.
插话/1 | 别人说话的时候不要打断 | Do not cut in while others talk, so the word must mean to interrupt.
对方/1 | 说话时看着跟你说话的人 | Look at the other person, so the word must mean the other party.
逗/1 | 讲笑话让大家笑了 | His joke made everyone laugh, so the word must mean to amuse.
青年/1 | 很多年轻人在网上发表看法 | Many young people post their views, so the word must mean youth.
青少年/1 | 杂志很适合中学生 | The magazine suits secondary pupils, so the word must mean teenagers.
青春/1 | 把年轻的岁月给了山里的学校 | He gave his youthful years to the school, so the word must mean youth.
流行语/1 | 每年出现，很快大家都在说 | New ones appear every year and soon everyone is saying them, so the word must mean buzzword.
用语/1 | 合同里的词很正式 | The contract's wording is formal, so the word must mean wording.
它们/1 | 这些花需要阳光 | These flowers need sun, so the word must mean they, for things.
表情包/1 | 不打字，发了一个笑脸 | He sent a smiley instead of text, so the word must mean sticker.
外号/1 | 同学们叫他“小飞人” | Classmates call him Little Flyer, so the word must mean nickname.
网名/1 | 在网上叫“快乐的鱼” | Online he is Happy Fish, so the word must mean screen name.
头像/1 | 换成了一只小猫 | He changed his picture to a cat, so the word must mean profile picture.
姑姑/1 | 爸爸的妹妹 | The sentence names Dad's younger sister, so the word must mean paternal aunt.
舅舅/1 | 妈妈的弟弟 | The sentence names Mum's younger brother, so the word must mean maternal uncle.
婶婶/1 | 叔叔的妻子 | Uncle has just married, and his wife joins the family, so the word must mean aunt, father's younger brother's wife.
嫂子/1 | 哥哥的妻子 | My elder brother's wife, so the word must mean sister-in-law.
姑父/1 | 姑姑的丈夫 | The man who comes with the aunt is her husband, so the word must mean uncle, father's sister's husband.
舅妈/1 | 舅舅的妻子 | The uncle's wife is the one who cooks well, so the word must mean aunt, mother's brother's wife.
外婆/1 | 妈妈的妈妈 | The sentence names Mum's mother, so the word must mean maternal grandmother.
外公/1 | 外婆的丈夫 | The sentence names the husband of Grandma on Mum's side, so the word must mean maternal grandfather.
表哥/1 | 舅舅的儿子，比我大 | Mum's brother's older son, so the word must mean elder cousin.
堂哥/1 | 叔叔的儿子，比我大 | Dad's brother's older son, so the word must mean elder cousin on father's side.
丈夫/1 | 她结婚才一年的那个人 | The man she married a year ago, so the word must mean husband.
媳妇/1 | 儿子结婚了，新来的女人 | Grandma Wang's son has married, and his new bride treats her well, so the word must mean daughter-in-law.
婆婆/1 | 丈夫的妈妈 | After marrying she lives with her husband's mother, so the word must mean mother-in-law.
公婆/1 | 丈夫的父母 | Her husband's parents, so the word must mean parents-in-law.
婆家/1 | 结婚以后住在丈夫家 | After marriage she lives with her husband's family, so the word must mean husband's family.
娘家/1 | 姐姐带孩子回去看父母 | She goes home to her own parents, so the word must mean wife's parents' home.
夫妇/1 | 年轻的一对刚搬来 | A young couple moved in, so the word must mean married couple.
老伴/1 | 爷爷和他一起散步的老妻子 | Grandpa walks with his old wife, so the word must mean spouse in old age.
再婚/1 | 母亲又结了一次婚 | His mother married again, so the word must mean to remarry.
妇女/1 | 三月八日的节日 | The March 8 holiday is for them, so the word must mean women.
长辈/1 | 过年孩子们给他们拜年 | Children greet them at New Year, so the word must mean elders.
祖辈/1 | 几百年都是这片土地上的农民 | His ancestors farmed here for centuries, so the word must mean ancestors.
晚辈/1 | 爷爷对家里的孩子们很耐心 | Grandpa is patient with the younger generation, so the word must mean younger generation.
前辈/1 | 公司里早来的人教他很多 | Senior colleagues taught him, so the word must mean senior.
辈分/1 | 年纪小，有的大人要叫他叔叔 | Young as he is, adults call him uncle, so the word must mean place in the family hierarchy.
一辈子/1 | 他一生都住在小村子里 | He lived there all his life, so the word must mean lifetime.
孙子/1 | 儿子的儿子 | The grandparents have a granddaughter and a son's son, so the word must mean grandson.
外孙/1 | 女儿生的儿子 | The daughter has had a son, and he is the grandparents' grandson, so the word must mean grandson, daughter's son.
兄弟/1 | 他们是两个男孩，长得很像 | The two are boys who look so alike that people mix them up, so the word must mean brothers.
兄妹/1 | 哥哥照顾妹妹 | The brother looks after his sister, so the word must mean brother and sister.
婴儿/1 | 才出生三天 | The child in the hospital was born only three days ago, so the word must mean baby.
宝宝/1 | 妈妈怀里的小孩子 | The little one in Mum's arms, so the word must mean baby.
娃娃/1 | 妹妹每天带着布做的玩具 | Her cloth toy goes everywhere, so the word must mean doll.
抚养/1 | 从小是外婆养大的 | Grandma brought him up, so the word must mean to raise.
早教/1 | 两三岁的孩子上的课 | Parents send children of two or three to these classes, so the word must mean early education.
摇篮/1 | 推着它孩子就睡着了 | Rocked in it the child sleeps, so the word must mean cradle.
收养/1 | 不是亲生的女孩，带回家养 | They took in a girl not their own, so the word must mean to adopt.
育儿/1 | 刚当父母的人需要的知识 | New parents need such know-how, so the word must mean childcare.
母婴室/1 | 机场里给孩子换衣服的房间 | At the airport there is a room where mothers can change their babies, so the word must mean nursing room.
疼爱/1 | 奶奶最爱小孙女 | Grandma dotes on her granddaughter, so the word must mean to dote on.
嘱咐/1 | 出门前妈妈说路上小心 | Mum told me to take care, so the word must mean to tell, exhort.
可怜/1 | 小狗又冷又饿 | The puppy is cold and hungry, so the word must mean pitiful.
温柔/1 | 她说话的声音孩子们喜欢 | Her soft voice charms children, so the word must mean gentle.
柔软/1 | 衣服的布料穿着舒服 | The cloth is soft, so the word must mean soft.
盼望/1 | 孩子们天天想着放假 | Children long for the holidays, so the word must mean to look forward to.
忍不住/1 | 听到笑话大家都笑了 | No one could keep from laughing, so the word must mean cannot help.
和睦/1 | 一家人相处得很好 | The family lives in harmony, so the word must mean harmonious.
严厉/1 | 作业写不好就要重写 | Poor homework is redone, so the word must mean strict.
慈祥/1 | 奶奶脸上带着笑容 | Grandma's face shows a kindly smile, so the word must mean kindly.
亲情/1 | 走多远都是最重要的 | Family love matters most, so the word must mean family affection.
屋子/1 | 不大，但收拾得很干净 | The small room is tidy, so the word must mean room.
屋里/1 | 外面太冷，快进来 | Come inside from the cold, so the word must mean indoors.
家务/1 | 星期六全家人一起做 | The family does chores on Saturday, so the word must mean housework.
家规/1 | 吃饭的时候不看手机 | No phones at meals is a family rule, so the word must mean family rule.
家风/1 | 几代人都爱读书 | Generation after generation of the family has loved reading, so the word must mean family tradition.
丢/1 | 做事不小心，东西找不到了 | Careless, he often loses things, so the word must mean to lose.
掉/1 | 杯子别落到地上 | Do not let the cup fall, so the word must mean to drop.
忘掉/1 | 那句话一直记得 | I never forgot those words, so the word must mean to forget.
俩/1 | 我们两个是同一个班的 | The two of us share a class, so the word must mean two of.
全家福/1 | 春节一家人拍的照片 | The whole family took a photo together at Spring Festival, so the word must mean family portrait.
晚年/1 | 爷爷老了以后过得很幸福 | Grandpa's later years are happy, so the word must mean old age.
养老院/1 | 星期天去看望那里的老人 | We visit the old people there, so the word must mean old people's home.
老年人/1 | 公共汽车上有给他们的座位 | Buses keep seats for them, so the word must mean the elderly.
老人家/1 | 王爷爷，您身体还好吗 | The speaker politely addresses old Grandpa Wang, so the word must mean venerable sir.
怀念/1 | 常常想起乡下的童年 | He misses his country childhood, so the word must mean to miss, cherish the memory of.
当年/1 | 爷爷讲他那时上大学的故事 | Grandpa tells of his student days, so the word must mean back then.
留念/1 | 毕业时一起照相 | A class photo as a keepsake, so the word must mean to keep as a souvenir.
相册/1 | 奶奶打开看年轻时的照片 | Grandma shows her old photos in it, so the word must mean photo album.
时隔/1 | 二十年以后又见面 | They met again twenty years later, so the word must mean after an interval of.
永远/1 | 我会一直记得这一天 | I will remember it forever, so the word must mean forever.
忍耐/1 | 人太多，只能慢慢等 | With the crowd they must wait patiently, so the word must mean to be patient.
忍受/1 | 夏天热得受不了 | The summer heat is unbearable, so the word must mean to bear.
忍让/1 | 哥哥从来不跟弟弟吵 | He always gives way to his brother, so the word must mean to yield.
谦让/1 | 两个人谁也不肯先坐 | Each politely lets the other sit first, so the word must mean to defer politely.
体谅/1 | 妈妈工作累，我们要理解她 | Mum is tired, so we should understand her, so the word must mean to be understanding.
和好/1 | 吵了一架，第二天就好了 | They quarrelled and made up the next day, so the word must mean to make up.
分担/1 | 家务大家一起做 | Everyone shares the chores, so the word must mean to share.
照看/1 | 我出去一会儿，请帮我看着孩子 | Please mind the child for me, so the word must mean to look after.
接送/1 | 爷爷负责孙子上下学 | Grandpa takes him to and from school, so the word must mean to drop off and pick up.
隔开/1 | 一条小河把两个村子分开 | A stream separates the villages, so the word must mean to separate.
成年/1 | 很多国家十八岁就算大人 | At eighteen one is an adult, so the word must mean to come of age.
长大成人/1 | 当年的小女孩已经是大人了 | The little girl is now grown up, so the word must mean to grow up.
未成年人/1 | 法律特别保护不到十八岁的人 | The law protects minors, so the word must mean minor.
懂事/1 | 常常帮妈妈做家务 | He helps Mum without being told, so the word must mean sensible.
听话/1 | 主人让小狗坐下它就坐下 | The dog obeys, so the word must mean obedient.
调皮/1 | 弟弟总是爬到桌子上玩 | He climbs on the table, so the word must mean naughty.
自立/1 | 毕业后不再要父母的钱 | He stopped taking money from his parents, so the word must mean to stand on one's own feet.
惯/1 | 孩子要什么就给什么 | They give him anything he wants, so the word must mean to spoil.
零花钱/1 | 每周的都存起来 | He saves his weekly allowance, so the word must mean pocket money.
代沟/1 | 父母和孩子想法不一样，要多沟通 | Parents and children often think differently and need to talk more, so the word must mean generation gap.
曾祖父/1 | 一百多年前出生的爷爷的爸爸 | The man was born over a hundred years ago and is Grandpa's father, so the word must mean great-grandfather.
家庭成员/1 | 家里一共五个人，还有一只狗 | There are five people in the family, and a dog as well, so the word must mean family member.
亲子/1 | 爸爸妈妈和孩子一起做游戏 | At the nursery parents and children play games together, so the word must mean parent-child.
母女/1 | 两个人走在一起像姐妹 | Mother and daughter look like sisters, so the word must mean mother and daughter.
当家/1 | 买什么都由妈妈决定 | Mum decides all purchases, so the word must mean to run the household.
勤俭/1 | 一辈子从来不浪费 | They never waste anything, so the word must mean hardworking and thrifty.
拥有/1 | 他有一个幸福的家庭 | He has a happy family, so the word must mean to have.
期盼/1 | 父母等着在外地的孩子回家 | Parents long for their child's return, so the word must mean to look forward to.
姑娘/1 | 王家的女儿考上了大学 | The Wangs' girl got into university, so the word must mean girl.
厉害/1 | 一个人能说五种语言 | She speaks five languages, so the word must mean impressive.
田野/1 | 春天开满黄色小花的地方 | Fields full of yellow flowers in spring, so the word must mean open country.
农田/1 | 不能随便盖房子的种地的地方 | Farmland must not be built on, so the word must mean farmland.
种田/1 | 父母在乡下一年四季都忙 | His parents farm all year, so the word must mean to farm.
水稻/1 | 南方雨水多，人们爱吃米饭 | The rainy south grows rice, so the word must mean paddy rice.
稻田/1 | 夏天一片片绿油油的 | Green paddies in summer, so the word must mean rice field.
小麦/1 | 面粉来自它 | Flour comes from it, so the word must mean wheat.
棉花/1 | 衣服用它做，穿着舒服 | Comfortable clothes are made of it, so the word must mean cotton.
庄稼/1 | 雨水多，地里长得很好 | Rain made the crops grow well, so the word must mean crops.
丰收/1 | 粮食多，农民高兴 | A big harvest pleases farmers, so the word must mean bumper harvest.
播种/1 | 春天把种子放进地里 | Seeds go in the ground in spring, so the word must mean to sow.
村庄/1 | 山脚下住着三十多户人家 | Thirty families live at the foot of the hill, so the word must mean village.
水井/1 | 以前村里的水从里面打上来 | Villagers used to draw their drinking water up out of it, so the word must mean well.
竹子/1 | 熊猫最爱吃 | Pandas love to eat it, so the word must mean bamboo.
竹林/1 | 房子后面，风一来沙沙响 | It rustles in the wind behind the house, so the word must mean bamboo grove.
鸭子/1 | 在水里游来游去的鸟 | A few birds are swimming about in the water, so the word must mean duck.
池塘/1 | 院子后面有几条小鱼 | Behind the yard there is a little pool with a few fish in it, so the word must mean pond.
泉水/1 | 山里的水又清又甜 | Mountain water is clear and sweet, so the word must mean spring water.
菜地/1 | 奶奶种了白菜和土豆 | Grandma grows cabbage and potatoes there, so the word must mean vegetable plot.
黄牛/1 | 以前农民用它拉车 | Farmers used it to pull carts, so the word must mean ox.
羊群/1 | 远处像天上的白云 | Far off it looks like clouds, so the word must mean flock of sheep.
牧民/1 | 草原上骑着马放羊 | The people on the grassland ride horses as they graze their sheep, so the word must mean herdsman.
牧场/1 | 养着几千头牛的大草地 | The large grassland keeps thousands of cattle, so the word must mean pasture.
渔民/1 | 天没亮就开船出海 | Before dawn these people take their boats out to sea, so the word must mean fishermen.
渔船/1 | 港口里停着很多 | Many lie in the harbour, so the word must mean fishing boat.
渔村/1 | 海边家家户户都会打鱼 | Every family fishes, so the word must mean fishing village.
鱼塘/1 | 他家每年能卖很多鱼 | His family sells fish from it, so the word must mean fish pond.
温泉/1 | 冬天去那里洗澡 | Many people like to bathe in its warm water in winter, so the word must mean hot spring.
山坡/1 | 上面种满了茶树 | Tea bushes cover it, so the word must mean hillside.
上坡/1 | 骑车很累的路 | Riding is tiring here, so the word must mean uphill.
下坡/1 | 车速会变快 | Bikes speed up on it, so the word must mean downhill.
树枝/1 | 小鸟站在上面唱歌 | A bird sings on it, so the word must mean branch.
枝头/1 | 秋天结满了红苹果 | Apples hang at the branch tips, so the word must mean tip of a branch.
枝叶/1 | 大树下面很凉快 | Thick foliage gives shade, so the word must mean branches and leaves.
发芽/1 | 种子放进土里几天以后 | A few days after going into the soil the seeds begin to grow, so the word must mean to sprout.
桃子/1 | 又大又甜的水果 | The fruit is big and sweet, so the word must mean peach.
桃花/1 | 三月山上一片粉红 | In March the flowers on the hill turn it all pink, so the word must mean peach blossom.
果园/1 | 秋天去采苹果的地方 | We pick apples there, so the word must mean orchard.
果树/1 | 院子里种的，秋天有水果吃 | They give fruit every autumn, so the word must mean fruit tree.
浇水/1 | 天热每天都要给花 | Flowers need it daily in heat, so the word must mean to water.
盛开/1 | 公园里的花开得正好 | The flowers are in full bloom, so the word must mean to bloom.
建筑/1 | 有一百多年的历史 | This building is a century old, so the word must mean building.
建筑师/1 | 设计博物馆的人 | A famous person designed the museum, so the word must mean architect.
大厦/1 | 三十层的，市里最高的楼 | The thirty-storey building is the tallest in the city, so the word must mean mansion, tower block.
高楼/1 | 越来越多，天空越来越小 | Tall buildings shrink the sky, so the word must mean high-rise.
公寓/1 | 在市中心租了一间小的 | He rents a small flat, so the word must mean apartment.
店铺/1 | 街两边卖小吃的 | Both sides of the street are lined with places selling snacks, so the word must mean shop.
物业/1 | 楼里的灯坏了打电话给他们 | When the lights in the building fail, the residents phone the people who run it and they send someone to repair them, so the word must mean property management.
门卫/1 | 小区里认识每一位住户 | He knows every resident, so the word must mean gatekeeper.
楼道/1 | 不能放自行车 | No bikes there, so the word must mean stairwell.
住房/1 | 大城市很贵，买房不容易 | Housing is dear in big cities, so the word must mean housing.
城市化/1 | 很多农民搬进了城市 | As cities grow, many farmers move into them, so the word must mean urbanisation.
进城/1 | 村里的年轻人大多去城市工作 | Young villagers go to the city, so the word must mean to go to town.
农民工/1 | 城里的大楼是他们建起来的 | Migrant workers built the towers, so the word must mean migrant worker.
留守/1 | 父母外地打工，孩子跟着爷爷奶奶 | Children left behind with grandparents, so the word must mean left behind.
户口/1 | 在老家，人在北京工作 | His registration is back home, so the word must mean household registration.
城乡/1 | 之间的交通越来越方便 | Travel between town and country is easier, so the word must mean town and country.
差距/1 | 我的中文和他比还差很多 | My Chinese lags far behind, so the word must mean gap.
致富/1 | 靠种水果有了钱 | Fruit made them rich, so the word must mean to get rich.
特产/1 | 这种茶是家乡有名的东西 | This tea is a local speciality, so the word must mean local speciality.
农产品/1 | 网上卖大米和水果 | He sells rice and fruit online, so the word must mean farm produce.
噪音/1 | 马路上声音太大，睡不好 | Traffic noise ruins sleep, so the word must mean noise.
宁静/1 | 山村的夜晚只能听到虫叫 | Only insects are heard at night, so the word must mean tranquil.
安宁/1 | 楼下天天装修，大家不得 | Daily building work allows no peace, so the word must mean peaceful.
宁可/1 | 走路去也不想堵车 | I would rather walk, so the word must mean would rather.
闲/1 | 退休以后一点也不，天天帮社区做事 | Retired but never idle, so the word must mean idle.
空闲/1 | 你什么时候有时间吃个饭 | When are you free to eat, so the word must mean free time.
休闲/1 | 公园是市民放松的好地方 | Parks are for leisure, so the word must mean leisure.
闲聊/1 | 晚饭后邻居们在楼下随便说说话 | Neighbours chat after dinner, so the word must mean to chat.
乱/1 | 你的房间该收拾了 | Your room needs tidying, so the word must mean messy.
农闲/1 | 冬天农民有时间休息 | In winter farmers have time to rest, so the word must mean slack farming season.
公交/1 | 每天坐它上班，二十分钟到 | He takes the bus to work, so the word must mean public bus.
通勤/1 | 每天上下班路上两个小时 | Going to and from work takes him two hours a day, so the word must mean to commute.
上班族/1 | 早上八点地铁里都是 | Office workers fill the subway at eight, so the word must mean office workers.
早高峰/1 | 早上路上特别堵的时候 | The roads are jammed at this time in the morning, so the word must mean morning rush hour.
十字路口/1 | 在下一个往左转 | Turn left at the next one, so the word must mean crossroads.
拖拉机/1 | 农民开着去地里干活 | Farmers drive it to the fields, so the word must mean tractor.
超车/1 | 弯多的路上不能开到前面车的前面 | Do not pass on bends, so the word must mean to overtake.
超过/1 | 人口已经多于一千万 | The population tops ten million, so the word must mean to exceed.
街头/1 | 节日时到处都是人 | Streets are crowded at festivals, so the word must mean street.
拖/1 | 拉着大箱子走进车站 | He pulled a big suitcase, so the word must mean to drag.
超市/1 | 去买点儿水果和牛奶 | I buy fruit and milk there, so the word must mean supermarket.
便利店/1 | 楼下二十四小时开门 | Open round the clock downstairs, so the word must mean convenience store.
小卖部/1 | 学校里卖本子和笔 | The little shop at school sells exercise books and pens, so the word must mean tuck shop.
集市/1 | 每个星期天镇上的 | Every Sunday the town holds a market crowded with shoppers, so the word must mean market fair.
收银台/1 | 买好东西到这里付钱 | Pay here, so the word must mean checkout.
摆/1 | 桌子上放着几本书 | Books lie on the table, so the word must mean to place.
摆放/1 | 商店按种类放东西 | Goods are arranged by type, so the word must mean to arrange.
铺/1 | 在床上放了一条新床单 | She spread a new sheet, so the word must mean to spread.
中介/1 | 通过他们租到房子 | He found a flat through an agent, so the word must mean agency.
丰富/1 | 商店什么都能买到 | The shop has everything, so the word must mean abundant.
繁华/1 | 全市最热闹的街 | The street is the busiest and liveliest place in the city, so the word must mean bustling.
大都市/1 | 上海是国际的 | Shanghai is an international one, so the word must mean metropolis.
古镇/1 | 一千多年历史，石头铺的街 | The town is over a thousand years old and its streets are paved with stone, so the word must mean ancient town.
盛大/1 | 学校的毕业典礼很隆重 | The school held its graduation ceremony on a grand scale, so the word must mean grand.
丰盛/1 | 过年妈妈做了一桌好菜 | At New Year Mum cooked a table full of good dishes, so the word must mean sumptuous.
超级/1 | 这家店的蛋糕非常好吃 | The cake is super tasty, so the word must mean super.
邻里/1 | 小区里住得近的人常常互相帮忙 | Neighbours help each other, so the word must mean neighbourhood.
地标/1 | 大桥代表这座城市 | The bridge is the city's landmark, so the word must mean landmark.
广场舞/1 | 很多老人晚上在公园里跳 | Old people dance it in the park, so the word must mean square dancing.
大妈/1 | 每天早上帮孩子过马路的阿姨 | A middle-aged woman helps children cross, so the word must mean auntie.
肺/1 | 我们靠它呼吸 | We breathe with it, so the word must mean lung.
肝/1 | 人体里最重的内脏 | The organ is the heaviest inside the human body, so the word must mean liver.
胸口/1 | 用手按着，觉得心跳得很快 | He pressed his chest, so the word must mean chest.
腰/1 | 裤子这里太大，往下掉 | The trousers are loose at the waist, so the word must mean waist.
腹部/1 | 吃了不干净的东西肚子不舒服 | Bad food upset his belly, so the word must mean abdomen.
膝盖/1 | 裤子在腿中间这里破了 | The trousers have torn at the joint in the middle of the leg, so the word must mean knee.
手臂/1 | 举起来打招呼 | He raised it to wave, so the word must mean arm.
肌肉/1 | 经常锻炼会变结实 | Exercise firms it, so the word must mean muscle.
心脏/1 | 每分钟跳六十到一百次 | It beats sixty to a hundred times a minute, so the word must mean heart.
肩/1 | 书包背在上面 | He carries his bag on it, so the word must mean shoulder.
咳/1 | 感冒了晚上一直这样 | He coughs all night with a cold, so the word must mean to cough.
肿/1 | 脚受伤了，穿不进鞋 | His injured foot swelled, so the word must mean swollen.
头晕/1 | 一天没吃东西，站起来时 | Hungry, he felt dizzy standing up, so the word must mean dizzy.
晕车/1 | 坐长途汽车容易不舒服，所以坐前面 | Long bus rides make her sick, so the word must mean carsick.
症状/1 | 发烧和头疼是感冒常见的 | Fever and headache are common signs, so the word must mean symptom.
吐/1 | 吃了不新鲜的东西 | He was sick after bad food, so the word must mean to vomit.
躺/1 | 不舒服就去床上 | Go and lie on the bed, so the word must mean to lie down.
癌症/1 | 早发现早治疗，很多可以治好 | Many cases are curable if caught early, so the word must mean cancer.
糖尿病/1 | 吃东西要少放糖 | He must cut sugar, so the word must mean diabetes.
腰疼/1 | 坐了一整天，站不直 | After a day at the desk his back aches, so the word must mean backache.
药剂师/1 | 买药时问每天吃几次 | When buying medicine you can ask the person who dispenses it how often to take it, so the word must mean pharmacist.
细菌/1 | 饭前要洗手，手上有很多 | We wash before meals because our hands carry many tiny germs, so the word must mean bacteria.
口罩/1 | 感冒出门最好戴上 | Wear one when ill, so the word must mean face mask.
输液/1 | 病很重，在医院三天 | He was on a drip for three days, so the word must mean intravenous drip.
血液/1 | 心脏把它送到全身 | The heart pumps it, so the word must mean blood.
按时/1 | 吃药不能忘了时间 | Take medicine on time, so the word must mean on time.
剂量/1 | 孩子吃药跟大人不一样多 | A child's dose differs, so the word must mean dosage.
牙齿/1 | 每天早晚刷牙保护它们 | Brushing protects them, so the word must mean teeth.
消炎/1 | 医生开的治发炎的药 | The doctor prescribed a medicine that fights inflammation, so the word must mean anti-inflammatory.
体温计/1 | 好像发烧了，量一下 | Check for fever with it, so the word must mean thermometer.
伸/1 | 他把手出来跟我握 | He held out his hand, so the word must mean to stretch out.
拉伸/1 | 跑步以前先做的运动 | Do it before running, so the word must mean stretching.
伸懒腰/1 | 坐了一上午站起来 | After sitting all morning he stretched, so the word must mean to stretch oneself.
跳绳/1 | 女孩子们下课在操场上玩 | Girls play it at break, so the word must mean to skip rope.
绳子/1 | 很结实，可以拉车 | It is strong enough to pull a cart with, so the word must mean rope.
汗水/1 | 跑完步衣服都湿了 | Running soaked his shirt, so the word must mean sweat.
擦/1 | 用纸弄干净脸 | He wiped his face, so the word must mean to wipe.
扭伤/1 | 打篮球的时候脚 | He sprained his ankle playing, so the word must mean to sprain.
脱/1 | 进门先把鞋拿下来 | Take off your shoes, so the word must mean to take off.
慢跑/1 | 每天早上在公园半小时 | He jogs every morning, so the word must mean to jog.
作息/1 | 放假也要有规律 | Keep a regular routine, so the word must mean daily routine.
早睡早起/1 | 爷爷每天这样，身体很好 | Grandpa keeps early hours, so the word must mean early to bed, early to rise.
生物钟/1 | 坐飞机到别的国家一下子乱了 | Jet lag upsets it, so the word must mean body clock.
散步/1 | 吃完晚饭去河边 | After dinner we go for a walk by the river, so the word must mean to take a walk.
久坐/1 | 每过一个小时要站起来走走 | Sitting too long is bad, so the word must mean to sit for long.
近视/1 | 要戴眼镜才能看清黑板 | He needs glasses for the board, so the word must mean short-sighted.
视力/1 | 看太久手机会影响 | Looking at a phone too long every day harms it, so the word must mean eyesight.
护眼/1 | 看书半小时看看远处 | Looking far off rests the eyes, so the word must mean eye care.
户外/1 | 孩子们每天应该在外面活动 | Children need time outdoors, so the word must mean outdoors.
睡懒觉/1 | 星期天十点才起床 | He sleeps in till ten, so the word must mean to sleep in.
油炸/1 | 这种食品好吃但不能多吃 | Fried food is tasty but unhealthy, so the word must mean deep-fried.
碳酸饮料/1 | 里面糖很多，最好少喝 | Fizzy drinks hold much sugar, so the word must mean soft drink.
甜食/1 | 爱吃蛋糕和巧克力 | She loves cake and chocolate, so the word must mean sweets.
粗粮/1 | 小米和红豆 | Millet and red beans, so the word must mean coarse grains.
主食/1 | 北方人把饺子和面条当作 | Northerners eat dumplings as staples, so the word must mean staple food.
空腹/1 | 要吃完饭再吃药 | Do not take it on an empty stomach, so the word must mean on an empty stomach.
饭后/1 | 不要马上跑步 | Do not run right after a meal, so the word must mean after a meal.
保健品/1 | 没有广告说的那么有用 | Supplements are oversold, so the word must mean health supplement.
卡路里/1 | 蛋糕比苹果高很多 | Cake has more of them, so the word must mean calorie.
有机/1 | 超市卖的比较贵的蔬菜 | Pricier vegetables grown without chemicals, so the word must mean organic.
卫生/1 | 饭店的厨房要注意干净 | Kitchens must be clean, so the word must mean hygiene.
卫生间/1 | 请问在哪儿 | Where is the toilet, so the word must mean toilet.
洗手液/1 | 洗手时用点儿洗得更干净 | It gets hands cleaner, so the word must mean hand soap.
脏/1 | 在外面玩了一天，衣服 | His clothes are dirty, so the word must mean dirty.
擦干/1 | 洗完手用纸 | Dry your hands with paper, so the word must mean to wipe dry.
病菌/1 | 经常洗手可以减少传播 | Handwashing stops germs spreading, so the word must mean germs.
传染病/1 | 流感是一种 | Flu is one, so the word must mean infectious disease.
免疫/1 | 疫苗帮助身体建立 | Vaccines build it, so the word must mean immunity.
抵抗力/1 | 经常锻炼，很少感冒 | Exercise keeps him well, so the word must mean resistance.
液体/1 | 坐飞机不能带太多 | Air passengers may not carry much of it, so the word must mean liquid.
急救/1 | 医生来教简单的知识 | A doctor teaches basic first aid, so the word must mean first aid.
急救箱/1 | 家里放常用的药 | Keep common medicines in it, so the word must mean first-aid kit.
创可贴/1 | 手指破了贴上 | A cut finger gets one, so the word must mean plaster.
药片/1 | 很小，容易吃下去 | The pills are small and easy to swallow, so the word must mean tablet.
药水/1 | 孩子不爱吃药片 | For a child who will not take tablets, so the word must mean liquid medicine.
过量/1 | 吃药不能太多 | Do not take too much, so the word must mean excessive.
中暑/1 | 天太热在外面待太久 | Long in the heat you get it, so the word must mean heatstroke.
晒伤/1 | 海边玩了一天，皮肤 | His skin burned at the beach, so the word must mean sunburn.
防晒/1 | 夏天去海边一定要注意 | At the seaside in summer you must protect yourself from the sun, so the word must mean sun protection.
脱水/1 | 吐了一天，身体缺水 | A day of vomiting dried him out, so the word must mean dehydration.
中医/1 | 觉得中药对他有用 | He trusts Chinese herbs, so the word must mean traditional Chinese medicine.
西药/1 | 和中药都可以 | Either Chinese medicine or this, so the word must mean Western medicine.
草药/1 | 奶奶在院子里种的 | Grandma grows them, so the word must mean medicinal herbs.
按摩/1 | 工作累了，身体放松 | After a tiring day at work it relaxes the body a great deal, so the word must mean massage.
推拿/1 | 医生用手治好了腰疼 | His back was cured by hand, so the word must mean Chinese therapeutic massage.
偏方/1 | 生病不要随便相信 | Do not trust folk cures, so the word must mean folk remedy.
保健/1 | 爷爷每天打太极拳 | Grandpa looks after his health, so the word must mean health care.
就医/1 | 症状严重要马上 | Serious symptoms need a doctor, so the word must mean to seek medical care.
处方/1 | 这种药要有医生的才能买 | It needs a doctor's prescription, so the word must mean prescription.
关节/1 | 天冷时奶奶常常疼 | Grandma's joints ache in cold, so the word must mean joint.
健身操/1 | 很多人早上在广场上做 | People do exercises in the square, so the word must mean aerobics.
快走/1 | 不喜欢跑步可以试试 | People who dislike running can try walking fast instead, so the word must mean brisk walking.
骑行/1 | 和朋友去郊外 | A ride to the countryside, so the word must mean cycling.
球类/1 | 足球和篮球都是 | Football and basketball are ball games, so the word must mean ball games.
运动量/1 | 每天只走一千步太少 | A thousand steps is too little exercise, so the word must mean amount of exercise.
瘦身/1 | 为了这个每天跑步 | She runs to slim down, so the word must mean to slim.
超重/1 | 你的行李要多付钱 | Your luggage is overweight, so the word must mean overweight.
出汗/1 | 天太热坐着不动也会 | You sweat even sitting, so the word must mean to sweat.
体育课/1 | 下午要穿运动鞋 | Wear trainers for PE, so the word must mean PE class.
摔倒/1 | 路上有冰，小心 | There is ice on the road, so take care, so the word must mean to fall down.
恒星/1 | 太阳是离地球最近的 | The Sun is the nearest one, so the word must mean star.
银河/1 | 太阳系只是它里面很小的一部分 | The solar system is a tiny part of it, so the word must mean Milky Way.
光年/1 | 长度单位，不是时间单位 | It measures distance, not time, so the word must mean light year.
黑洞/1 | 引力大到连光都跑不出来 | Not even light escapes it, so the word must mean black hole.
星系/1 | 宇宙里很多，每个都有很多恒星 | Each holds many stars, so the word must mean galaxy.
天文/1 | 从小用望远镜看星星 | He loves stargazing, so the word must mean astronomy.
天文台/1 | 山上晚上可以看星星的地方 | A hilltop place to watch stars, so the word must mean observatory.
流星/1 | 晚上从天上划过 | It streaked across the sky, so the word must mean meteor.
日食/1 | 白天天色突然变暗 | Day suddenly darkens, so the word must mean solar eclipse.
星空/1 | 躺在草地上看满天星星 | We lay watching the starry sky, so the word must mean starry sky.
固体/1 | 冰是，水是液体 | Ice is one, water a liquid, so the word must mean solid.
气体/1 | 空气由好几种组成 | Air is a mix of them, so the word must mean gas.
熔化/1 | 铁在很高温度下变成液体 | Iron melts at high heat, so the word must mean to melt, of metal.
融化/1 | 太阳出来，雪慢慢没了 | The snow melts in the sun, so the word must mean to melt, thaw.
溶解/1 | 糖放进水里很快不见了 | Sugar dissolves in water, so the word must mean to dissolve.
凝固/1 | 水在零度以下变成冰 | Water freezes below zero, so the word must mean to solidify.
蒸发/1 | 太阳一晒，地上的水没了 | The sun dries the ground, so the word must mean to evaporate.
结冰/1 | 天太冷，河面上 | The river froze over, so the word must mean to freeze.
水蒸气/1 | 水开了冒出很多 | Boiling water gives off steam, so the word must mean steam.
冰点/1 | 水的是零度 | Water's is zero, so the word must mean freezing point.
浮力/1 | 海水的更大，人容易浮起来 | Sea water holds you up better, so the word must mean buoyancy.
浮/1 | 树叶在水面上 | Leaves float on water, so the word must mean to float.
下沉/1 | 石头放进水里 | A stone put into water goes straight down, so the word must mean to sink.
振动/1 | 声音是物体这样产生的 | Sound comes from vibration, so the word must mean to vibrate.
摩擦/1 | 两只手互相搓会暖和 | Rubbing hands warms them, so the word must mean friction.
重力/1 | 苹果往下落不飞到天上 | Apples fall because of it, so the word must mean gravity.
惯性/1 | 汽车突然停下人往前倒 | People lurch forward when a car stops, so the word must mean inertia.
斜面/1 | 沿着推箱子比直接搬省力 | Pushing up it saves effort, so the word must mean inclined plane.
牛顿/1 | 传说看到苹果落地想到万有引力 | He saw an apple fall, so the word must mean Newton.
磁力/1 | 磁铁能吸住铁 | Magnets attract iron with it, so the word must mean magnetic force.
秒/1 | 一分钟有六十个 | Sixty make a minute, so the word must mean second.
秒表/1 | 体育老师记录跑一百米的时间 | The PE teacher times us with it, so the word must mean stopwatch.
毫米/1 | 一厘米等于十个 | Ten make a centimetre, so the word must mean millimetre.
厘米/1 | 这支笔长十五个 | The pen is fifteen of them long, so the word must mean centimetre.
毫升/1 | 这瓶水有五百个 | The bottle holds five hundred, so the word must mean millilitre.
吨/1 | 大卡车能装十个 | The truck carries ten of them, so the word must mean tonne.
误差/1 | 每次测量都有一点，要多量几次 | Every measurement has some, so the word must mean error.
精确/1 | 能测出头发有多粗 | It measures a hair exactly, so the word must mean precise.
温度计/1 | 窗外显示零下五度 | It shows minus five outside, so the word must mean thermometer.
刻度/1 | 温度计上每一格是一度 | Each mark is one degree, so the word must mean graduation mark.
昆虫/1 | 蜜蜂是一种，有六条腿 | Bees are six-legged ones, so the word must mean insect.
蜜蜂/1 | 在花上飞来飞去 | They fly from flower to flower, so the word must mean bee.
蜂蜜/1 | 喝茶时放一点 | He adds a little to his tea, so the word must mean honey.
鲸鱼/1 | 生活在海里，但不是鱼 | It lives in the sea but is no fish, so the word must mean whale.
老鹰/1 | 在天上飞，看着地上的小动物 | It flies watching small animals below, so the word must mean eagle.
猴子/1 | 动物园里在树上跳来跳去 | They leap about in trees, so the word must mean monkey.
老虎/1 | 猫科动物中最大的 | It is the biggest animal of the cat family, so the word must mean tiger.
产卵/1 | 鱼游回出生的河里 | Fish return to spawn, so the word must mean to lay eggs.
幼虫/1 | 昆虫小时候的样子跟长大不一样 | Young insects look different, so the word must mean larva.
恐龙/1 | 六千多万年前就灭绝了 | Extinct for sixty million years, so the word must mean dinosaur.
岩石/1 | 山是由坚硬的它构成的 | The mountain is hard stone, so the word must mean rock.
矿物/1 | 盐也是一种 | Salt is one, so the word must mean mineral.
矿石/1 | 运出来再从里面提取铁 | Iron is extracted from it, so the word must mean ore.
煤矿/1 | 城市以前很多，现在都关了 | The city's coal mines are closed, so the word must mean coal mine.
铜/1 | 容易导电，电线里常用 | It carries electricity easily, so wires are often made of it, so the word must mean copper.
化石/1 | 科学家发现了恐龙的 | Dinosaur remains in stone, so the word must mean fossil.
地质/1 | 研究山二十年的学家 | He studies mountains, so the word must mean geology.
青铜/1 | 古代用它做了很多器物 | Ancient vessels were made of it, so the word must mean bronze.
灰色/1 | 石头不黑也不白 | The stone is neither black nor white, so the word must mean grey.
金子/1 | 手表因为它很贵 | The watch is dear because of it, so the word must mean gold.
谜/1 | 宇宙怎么开始到现在还不知道 | How the universe began is a mystery, so the word must mean mystery.
谜语/1 | 老师出的，大家想答案 | The teacher set a riddle, so the word must mean riddle.
谜底/1 | 最后老师说出了答案 | The teacher revealed the answer, so the word must mean answer to a riddle.
奥秘/1 | 科学家探索海洋的 | Scientists explore the ocean's secrets, so the word must mean mystery.
获得/1 | 比赛中得了第一名 | He won first place, so the word must mean to obtain.
获奖/1 | 电影在国际上多次 | The film has won many awards, so the word must mean to win a prize.
诺贝尔奖/1 | 居里夫人得了两次 | Marie Curie won it twice, so the word must mean Nobel Prize.
假说/1 | 还需要实验来证明的想法 | The idea still needs more experiments to prove it, so the word must mean hypothesis.
突破/1 | 研究取得了重大进展 | The research made a breakthrough, so the word must mean breakthrough.
推测/1 | 根据化石想这种动物会飞 | From fossils they inferred it flew, so the word must mean to infer.
胶水/1 | 把两张纸贴在一起 | It sticks paper together, so the word must mean glue.
氢气/1 | 最轻的气体 | The lightest gas, so the word must mean hydrogen.
灰尘/1 | 很久没打扫，桌子上 | The table is dusty, so the word must mean dust.
生锈/1 | 铁放在潮湿的地方 | Iron in damp places rusts, so the word must mean to rust.
清晰/1 | 用显微镜看到细胞 | The microscope shows cells clearly, so the word must mean clear.
接触/1 | 手不要直接碰这种液体 | Do not touch the liquid, so the word must mean to touch.
斜/1 | 照片放得不正，往右转一点 | The photo is crooked, so the word must mean slanting.
恒温/1 | 实验室一年四季都是二十度 | The lab stays at twenty degrees, so the word must mean constant temperature.
样本/1 | 医生取了一点血送去检查 | The doctor took a little blood to send for testing, so the word must mean sample.
对照/1 | 一组不浇水跟另一组比 | One group is the control, so the word must mean to compare, control.
电流/1 | 通过电线灯就亮了 | It flows and the lamp lights, so the word must mean electric current.
导电/1 | 金属容易，塑料却不能 | Metal conducts, plastic does not, so the word must mean to conduct electricity.
导体/1 | 金属是很好的 | Metal is a good one, so the word must mean conductor.
磁场/1 | 地球有，所以指南针能指方向 | Earth's magnetism guides a compass, so the word must mean magnetic field.
反射/1 | 月亮自己不发光 | The Moon reflects sunlight, so the word must mean to reflect.
折射/1 | 筷子放进水里像断了 | A chopstick looks bent in water, so the word must mean refraction.
回声/1 | 在山里大声喊能听到 | Shout in the hills and hear it, so the word must mean echo.
影子/1 | 中午的时候人的最短 | At noon a person's shadow is at its shortest, so the word must mean shadow.
放大镜/1 | 看树叶上的小虫子 | He looks at tiny bugs with it, so the word must mean magnifying glass.
指南针/1 | 在山里迷路能帮你找方向 | It finds direction, so the word must mean compass.
物理学/1 | 大学学的，现在研究宇宙 | He studied it and now studies the universe, so the word must mean physics.
化学家/1 | 居里夫人也是物理学家 | Marie Curie was also this, so the word must mean chemist.
天文学家/1 | 用望远镜观测遥远的星星 | They study distant stars, so the word must mean astronomer.
发明家/1 | 小时候喜欢做小机器 | He built gadgets as a boy, so the word must mean inventor.
观测/1 | 科学家每天看天气的变化 | Scientists observe the weather, so the word must mean to observe.
验证/1 | 想法需要用实验来证明 | The idea needs testing, so the word must mean to verify.
地理/1 | 能说出每个国家的首都 | He knows every capital, so the word must mean geography.
图表/1 | 把实验结果画出来很清楚 | Results shown clearly as a chart, so the word must mean chart.
标本/1 | 博物馆里的昆虫 | Insect specimens in a museum, so the word must mean specimen.
变量/1 | 实验时一次只改变一个 | Change one at a time, so the word must mean variable.
寺庙/1 | 山上古老的，早上能听到钟声 | Up on the hill an old building rings its bell every morning, so the word must mean temple.
宝塔/1 | 河边有一座七层的 | A tower of seven storeys stands by the river, so the word must mean pagoda.
佛教/1 | 两千年前从印度传到中国 | It came from India, so the word must mean Buddhism.
佛像/1 | 石窟里大大小小的 | The caves hold many carved figures, large and small, so the word must mean statue of Buddha.
和尚/1 | 寺里每天很早起床读经 | Monks rise early, so the word must mean monk.
宫殿/1 | 故宫是皇帝住的 | Emperors lived there, so the word must mean palace.
大殿/1 | 寺庙里放大佛像的地方 | The great statue of the Buddha stands in the temple's main hall, so the word must mean main hall.
少林寺/1 | 那里的和尚会功夫 | Its monks know kung fu, so the word must mean Shaolin Temple.
石窟/1 | 一千多年前在山上开出来的 | Carved out a thousand years ago, so the word must mean grotto.
莫高窟/1 | 中国西北，里面有很多古画 | The caves lie in China's northwest and hold paintings over a thousand years old, so the word must mean Mogao Caves.
陶瓷/1 | 博物馆收藏的古代的 | The museum holds ancient ones, so the word must mean ceramics.
瓷器/1 | 中国很早就卖到世界各地 | China exported it early, so the word must mean porcelain.
陶器/1 | 七千年前的 | Seven thousand years old, so the word must mean pottery.
青花瓷/1 | 白瓶子上画着蓝色的花 | Blue flowers on white, so the word must mean blue-and-white porcelain.
陶艺/1 | 学习用泥土做杯子 | He learns to make cups from clay, so the word must mean ceramic art.
景德镇/1 | 做瓷器一千多年 | It has made porcelain for a millennium, so the word must mean Jingdezhen.
精致/1 | 小瓷杯做得很好 | The little cup is finely made, so the word must mean exquisite.
古董/1 | 爷爷收藏的几百年的东西 | Grandpa collects centuries-old things, so the word must mean antique.
茶叶/1 | 春天采的最好 | Spring picking is best, so the word must mean tea leaves.
功夫茶/1 | 广东人喜欢，杯子很小 | Cantonese drink it from tiny cups, so the word must mean gongfu tea.
丝绸/1 | 中国最早生产 | China first made it, so the word must mean silk.
丝绸之路/1 | 商人沿着把东西运到西方 | Merchants carried goods west on it, so the word must mean Silk Road.
刺绣/1 | 衣服上手工做的图案 | Handmade designs on cloth, so the word must mean embroidery.
绣花/1 | 奶奶年轻时很会 | Grandma embroidered well, so the word must mean to embroider.
锦绣/1 | 山清水秀的河山 | The land, with its green hills and clear waters, is beautiful, so the word must mean splendid.
唐装/1 | 过年爷爷穿的红色衣服 | Grandpa wears a red Tang suit, so the word must mean Tang-style jacket.
中国结/1 | 奶奶用红绳编出来的 | Woven from red cord, so the word must mean Chinese knot.
年画/1 | 过年和春联一起贴 | Posted with couplets at New Year, so the word must mean New Year picture.
皮影/1 | 古老的民间戏 | This kind of play is an old folk art, so the word must mean shadow puppets.
风筝/1 | 春天孩子们在公园里放 | Children fly them in spring, so the word must mean kite.
秦朝/1 | 只有十五年就灭亡了 | It lasted only fifteen years, so the word must mean Qin dynasty.
秦始皇/1 | 第一个叫自己“皇帝”的人 | He was the first person to call himself emperor, so the word must mean First Emperor of Qin.
甲骨文/1 | 最早的成熟汉字 | It is the earliest mature Chinese script found so far, so the word must mean oracle bone script.
青铜器/1 | 博物馆里三千年的东西 | The piece in the museum is three thousand years old, so the word must mean bronze ware.
竹简/1 | 纸出现以前把字写在上面 | Before paper appeared, people often wrote on them, so the word must mean bamboo slips.
科举/1 | 一千三百多年历史的考试 | An exam system of 1,300 years, so the word must mean imperial examination.
状元/1 | 全省第一名 | He came first in the whole province, so the word must mean top scorer.
秀才/1 | 古时候叫读书人 | In the past people often gave this name to a man of learning, so the word must mean scholar.
书院/1 | 古代读书人学习讨论的地方 | Scholars studied there, so the word must mean academy.
典故/1 | 这句话里有一个历史故事 | The line alludes to history, so the word must mean allusion.
玉/1 | 中国人认为它代表美好的品德 | It stands for virtue, so the word must mean jade.
玉器/1 | 三千年前做得很精美的 | The museum has a finely made piece from three thousand years ago, so the word must mean jade article.
工匠/1 | 古代一块石头一块石头建桥的人 | They built the bridge stone by stone, so the word must mean craftsman.
手艺/1 | 做面条的本事跟爷爷学的 | His noodle skill came from Grandpa, so the word must mean craft skill.
手艺人/1 | 老街上会做灯笼、剪纸的人 | Lantern makers and paper cutters, so the word must mean craftsperson.
传承/1 | 手艺传了三百年 | The craft has passed down for 300 years, so the word must mean to pass down.
传人/1 | 古老手艺的第五代 | He is the fifth generation to carry on the old craft, so the word must mean successor.
文物/1 | 从地下发现的古代东西 | Relics found underground, so the word must mean cultural relic.
修复/1 | 专家花三年把古画弄好 | Experts restored the painting, so the word must mean to restore.
出土/1 | 青铜器在河南被挖出来 | The bronze was unearthed in Henan, so the word must mean to be unearthed.
儒家/1 | 孔子是代表人物 | Confucius represents it, so the word must mean Confucianism.
道家/1 | 老子是代表人物 | Laozi represents it, so the word must mean Taoism.
圣人/1 | 古人把孔子叫做 | Confucius was called a sage, so the word must mean sage.
神圣/1 | 对很多人来说这座山 | The mountain is sacred, so the word must mean sacred.
孝道/1 | 传统文化很重视对父母好 | Tradition prizes filial piety, so the word must mean filial piety.
仁/1 | 孔子认为就是爱人 | Confucius said it is loving others, so the word must mean benevolence.
家训/1 | “多读书，做好人” | Read much, be good, so the word must mean family motto.
中华/1 | 文化有几千年历史 | Chinese culture is millennia old, so the word must mean China, Chinese.
华夏/1 | 中国古代的一个名字 | It is an ancient name for China, so the word must mean Huaxia.
孔庙/1 | 纪念孔子的地方 | It honours Confucius, so the word must mean Confucian temple.
楷书/1 | 学书法一般先学 | Calligraphy starts with it, so the word must mean regular script.
书法家/1 | 写的字被很多人收藏 | His calligraphy is collected, so the word must mean calligrapher.
国画/1 | 用毛笔和墨在纸上画 | Painted with brush and ink, so the word must mean Chinese painting.
山水画/1 | 画黄山的风景 | It shows Huangshan's scenery, so the word must mean landscape painting.
水墨画/1 | 只有黑白两种颜色 | The paintings use only black and white yet have great charm, so the word must mean ink painting.
毛笔/1 | 写书法要用 | Calligraphy needs it, so the word must mean writing brush.
宣纸/1 | 在上面写了“福”字 | He wrote fu on it, so the word must mean rice paper.
印章/1 | 画家在画上盖的 | The painter stamps it on the work, so the word must mean seal.
古筝/1 | 她弹得很好听 | She plays it beautifully, so the word must mean guzheng.
民乐/1 | 用中国传统乐器演奏 | Played on Chinese instruments, so the word must mean Chinese folk music.
辉煌/1 | 唐朝非常强大的朝代 | The Tang was a very great dynasty in Chinese history, so the word must mean glorious.
灿烂/1 | 中华民族创造的文化 | The Chinese people created a splendid culture, so the word must mean splendid.
宏伟/1 | 长城那样大的建筑 | The Great Wall is magnificent, so the word must mean magnificent.
杰作/1 | 大家认为这张画是他最好的 | Everyone thinks this painting is the best thing he made, so the word must mean masterpiece.
杰出/1 | 一位很了不起的科学家 | He is a remarkable scientist, so the word must mean outstanding.
四大发明/1 | 造纸术是其中之一 | Papermaking is one of them, so the word must mean Four Great Inventions.
造纸术/1 | 出现以前人们写在竹简上 | Before it, people wrote on bamboo, so the word must mean papermaking.
印刷术/1 | 书可以一次印很多本 | With it many copies of a book could be made at once, so the word must mean printing.
火药/1 | 古人用它做烟花 | Fireworks were made from it, so the word must mean gunpowder.
精华/1 | 书收集了唐诗最好的部分 | The book collects the best parts of Tang poetry, so the word must mean essence.
寻找/1 | 回到出生的地方找记忆 | He went back to look for memories, so the word must mean to look for.
寻根/1 | 海外华人回到中国 | Overseas Chinese seek their roots, so the word must mean to seek one's roots.
追寻/1 | 一生都在追自己的梦想 | He pursued his dream all his life, so the word must mean to pursue.
悠久/1 | 中国有很长的历史 | China has a long history, so the word must mean long-standing.
世界遗产/1 | 长城三十多年前就是 | The Great Wall became one decades ago, so the word must mean World Heritage Site.
文化遗产/1 | 保护它是每个人的责任 | Everyone must protect it, so the word must mean cultural heritage.
遗址/1 | 古城现在只有一些石头 | Only stones are left, so the word must mean ruins.
考古/1 | 去野外找古代东西的学家 | He digs for ancient things, so the word must mean archaeology.
古籍/1 | 图书馆收藏的珍贵古书 | The library keeps many rare old books, so the word must mean ancient books.
博物院/1 | 故宫每年接待很多游客 | The place in the Forbidden City receives many visitors each year, so the word must mean museum.
凤凰/1 | 传说里和龙一起代表吉祥 | With the dragon it means good fortune, so the word must mean phoenix.
龙凤/1 | 婚礼上常见的图案 | The design is often seen at weddings, so the word must mean dragon and phoenix.
吉祥物/1 | 熊猫常常被选作运动会的 | The panda often represents the games, so the word must mean mascot.
对联/1 | 春节贴在门上 | Pasted on doors at Spring Festival, so the word must mean couplet.
围棋/1 | 起源于中国几千年的棋 | The board game began in China thousands of years ago, so the word must mean go.
古都/1 | 很多朝代在西安建都 | Xi'an was a capital of many dynasties, so the word must mean ancient capital.
周围/1 | 古塔四面有很多老房子 | Old houses stand on every side of the pagoda, so the word must mean around.
范围/1 | 考试考前五课 | The exam covers five lessons, so the word must mean scope.
包围/1 | 古城被一条河围着 | A river encircles the town, so the word must mean to surround.
烂/1 | 苹果放得太久 | The apple has gone rotten, so the word must mean rotten.
报道/1 | 报纸写了昨天的大雨 | The paper covered yesterday's rain, so the word must mean to report.
头条/1 | 各大网站最重要的位置 | The story took the top place on every major website today, so the word must mean headline.
新闻稿/1 | 公司发给报社的 | Sent to newspapers by the firm, so the word must mean press release.
现场/1 | 记者第一时间来到事情发生的地方 | The reporter reached the scene, so the word must mean scene.
访谈/1 | 主持人和科学家聊了一个小时 | The host talked with a scientist, so the word must mean interview.
报社/1 | 大学毕业在那里当记者 | She is a reporter there, so the word must mean newspaper office.
头版/1 | 照片登在报纸的第一页 | The photo appeared on the first page of the paper, so the word must mean front page.
刊登/1 | 文章登在上个月的杂志上 | The article ran in last month's issue, so the word must mean to publish.
突发/1 | 遇到这样的事件记者马上出发 | Sudden events send reporters out at once, so the word must mean sudden.
评论员/1 | 每天在电视上分析经济新闻 | He analyses the economy on TV, so the word must mean commentator.
报刊/1 | 阅览室里有各种 | The reading room has all kinds of newspapers and magazines, so the word must mean newspapers and periodicals.
晚报/1 | 爷爷下班路上买一份 | Grandpa buys it on his way home, so the word must mean evening paper.
周刊/1 | 每个星期一出版 | It comes out every Monday, so the word must mean weekly.
月刊/1 | 每个月出一期 | The magazine comes out once a month, so the word must mean monthly.
社论/1 | 代表报社的看法 | It states the paper's view, so the word must mean editorial.
专栏/1 | 每期写一篇关于饮食的文章 | She writes a piece about food for the magazine in every issue, so the word must mean column.
版面/1 | 图片和文字安排得很好 | Pictures and text are well laid out, so the word must mean layout.
订阅/1 | 每个月送到家里的杂志 | A magazine delivered monthly, so the word must mean to subscribe.
发行/1 | 杂志在全国卖十万本 | Sold nationwide, so the word must mean to circulate.
杂志社/1 | 他给他们投了稿 | He submitted to the magazine, so the word must mean magazine office.
帖子/1 | 在网上问哪本书好看 | He wrote something online asking which book is good, so the word must mean post.
发帖/1 | 在网上问去北京要准备什么 | He posted a question online, so the word must mean to post.
跟帖/1 | 在帖子下面说自己的看法 | Many replied below the post, so the word must mean to reply to a post.
弹幕/1 | 看视频时屏幕上飞过很多 | Comments fly across the video, so the word must mean bullet comments.
热搜/1 | 一下子很多人都看到了 | It trended at once, so the word must mean trending searches.
博主/1 | 每周发一个做菜视频 | The person posts a cooking video online every week, so the word must mean blogger.
点评/1 | 老师一个个说作文好在哪儿 | The teacher commented on each essay, so the word must mean to comment on.
争议/1 | 结局有人喜欢有人不喜欢 | The ending divides people, so the word must mean controversy.
议论/1 | 下课后同学们都在说新老师 | Everyone talked about the new teacher, so the word must mean to discuss.
吐槽/1 | 在网上说饭馆服务太差 | He griped online about service, so the word must mean to complain, rant.
真相/1 | 调查以后事情清楚了 | The truth came out, so the word must mean truth.
核实/1 | 发新闻前先看消息准不准 | Before a story goes out, the reporter must first check that it is accurate, so the word must mean to verify.
当事人/1 | 采访这件事里的人，听他自己说 | The person involved, so the word must mean party concerned.
目击者/1 | 亲眼看到整个过程 | He saw it all, so the word must mean eyewitness.
知情/1 | 据了解情况的人说 | Those in the know say, so the word must mean informed.
内幕/1 | 报道让大家看到行业里面的事 | The story exposed the inside story, so the word must mean inside story.
疑点/1 | 消息不能马上相信 | Doubtful points, so the word must mean doubtful point.
真假/1 | 网上消息要学会判断 | Judge whether news is true, so the word must mean true or false.
可信/1 | 来自政府网站 | The news comes from a government website, so the word must mean credible.
传闻/1 | 学校放假一个月，最后是假的 | The rumour proved false, so the word must mean rumour.
辟谣/1 | 专家出来说这种水果没毒 | Experts dispelled the rumour, so the word must mean to refute a rumour.
谣传/1 | 网上说水果有毒，没这回事 | People online say the fruit is poisonous, but there is nothing in it, so the word must mean to rumour.
求证/1 | 看到消息马上打电话给医院 | He called to confirm, so the word must mean to seek confirmation.
小道消息/1 | 常常不准的打听来的 | Gossip that is often wrong, so the word must mean hearsay.
捏造/1 | 完全没有事实根据 | No basis in fact, so the word must mean to fabricate.
截图/1 | 把聊天记录拍下来发给老师 | He sent a screenshot, so the word must mean screenshot.
断章取义/1 | 只引用我话里的一句 | He quoted me out of context, so the word must mean to quote out of context.
歪曲/1 | 改了专家的原话 | The expert's words were twisted, so the word must mean to distort.
误导/1 | 标题容易让读者想错 | The headline misleads, so the word must mean to mislead.
核查/1 | 编辑部有人负责查数字 | Someone checks the figures, so the word must mean to check.
澄清/1 | 关于误会发表文章 | He cleared up the misunderstanding, so the word must mean to clarify.
曝光/1 | 工厂偷偷排污水被记者 | The reporter exposed the factory, so the word must mean to expose.
揭露/1 | 书写出了当时社会的问题 | The book exposed society's problems, so the word must mean to reveal.
披露/1 | 年度报告里公开收入 | The report disclosed revenue, so the word must mean to disclose.
透露/1 | 不愿说出电影的结局 | He will not reveal the ending, so the word must mean to let slip.
揭晓/1 | 比赛的结果明天公布 | Results are announced tomorrow, so the word must mean to announce.
声明/1 | 公司说网上的消息不是真的 | The firm issued a statement, so the word must mean statement.
露面/1 | 演员很久没在公众面前 | The actor has not appeared in public, so the word must mean to show up.
匿名/1 | 有人不写名字给报社写信 | An unsigned letter, so the word must mean anonymous.
实名/1 | 留言不能用假名字 | Real names only, so the word must mean real name.
舆论/1 | 引起社会的关注 | Public opinion took notice, so the word must mean public opinion.
舆情/1 | 分析网上顾客对产品的看法 | Online sentiment analysis, so the word must mean public sentiment.
民意/1 | 市长决定前做的调查 | The mayor polled the public, so the word must mean popular will.
公众/1 | 博物馆每周一不开放 | Closed to the public on Mondays, so the word must mean the public.
受众/1 | 节目主要是中学生看 | Its audience is teenagers, so the word must mean audience.
焦点/1 | 比赛成了大家讨论的中心 | The match is the focus, so the word must mean focus.
热点/1 | 环境问题是近几年的 | Environment is a hot topic, so the word must mean hot topic.
轰动/1 | 发现在全世界引起 | It caused a sensation, so the word must mean sensation.
纷纷/1 | 新手机上市，大家一个接一个去买 | People rushed one after another, so the word must mean one after another.
炒作/1 | 书写得一般，只是被弄得很火 | The book was hyped, so the word must mean to hype.
称赞/1 | 老师说他的作文写得很好 | The teacher praised him, so the word must mean to praise.
权威/1 | 这个领域大家都相信他 | Everyone trusts his judgement, so the word must mean authority.
质疑/1 | 有科学家怀疑研究的结论 | Scientists question the result, so the word must mean to call into question.
辨别/1 | 小孩子不太会分好人坏人 | Children cannot tell good from bad, so the word must mean to distinguish.
片面/1 | 只听一个人的话了解的情况 | Listening to only one person gives a view from one side only, so the word must mean one-sided.
夸大/1 | 广告说的效果比实际大 | Ads overstate results, so the word must mean to exaggerate.
夸张/1 | 一次能吃十碗饭 | Ten bowls at once is an exaggeration, so the word must mean exaggerated.
证实/1 | 消息已经被医院确定 | The hospital confirmed it, so the word must mean to confirm.
中立/1 | 记者不能偏向哪一方 | Reporters must take no side, so the word must mean neutral.
一面之词/1 | 还要听另一方怎么说 | Hear the other side too, so the word must mean one side of the story.
播音员/1 | 普通话非常标准 | His Mandarin is perfect, so the word must mean announcer.
转载/1 | 文章被很多网站登出 | Many sites reposted it, so the word must mean to reprint.
原创/1 | 视频是他自己做的 | He made the video himself, so the word must mean original.
阅读量/1 | 文章已经过了一百万 | A million readers, so the word must mean number of reads.
爆料/1 | 网友告诉记者饭馆卫生差 | A user tipped off a reporter, so the word must mean to leak information.
声称/1 | 公司说产品能治百病 | The firm claims a cure-all, so the word must mean to claim.
据悉/1 | 新桥明年就能通车 | It is reported the bridge opens next year, so the word must mean it is reported.
道听途说/1 | 别相信那些听来的消息 | Do not trust hearsay, so the word must mean hearsay.
名誉/1 | 假新闻伤害了他 | Fake news hurt his reputation, so the word must mean reputation.
刊物/1 | 学校每学期出一本登同学文章的 | The school puts out a magazine of pupils' writing each term, so the word must mean publication.
挣钱/1 | 靠双手养活一家人 | He earns to feed his family, so the word must mean to earn money.
攒钱/1 | 每个月存一点，一年后买电脑 | She saved monthly for a computer, so the word must mean to save up.
积蓄/1 | 用多年存的钱买了车 | Years of savings bought a car, so the word must mean savings.
储蓄/1 | 中国人存钱的比率很高 | Chinese people have long kept the habit of putting money by, so the word must mean savings deposit.
零用钱/1 | 妈妈每星期给我五十块 | Mum gives the speaker fifty yuan a week to spend, so the word must mean pocket money.
生活费/1 | 上大学时父母每个月给两千 | At university his parents gave him two thousand a month to live on, so the word must mean living expenses.
学费/1 | 大学一年要五千块 | The university charges five thousand a year to study there, so the word must mean tuition.
存折/1 | 奶奶不用银行卡 | Grandma still uses a bankbook, so the word must mean bankbook.
定期/1 | 钱存三年，利息高一些 | A three-year deposit pays more, so the word must mean fixed-term.
活期/1 | 利息低但随时可以取 | Low interest but always available, so the word must mean current account.
取款/1 | 去银行拿钱交房租 | He withdrew money for rent, so the word must mean to withdraw money.
取款机/1 | 银行门口晚上也能取钱 | You can get cash at night from it, so the word must mean cash machine.
转账/1 | 用手机给他两百块 | I sent him two hundred by phone, so the word must mean to transfer money.
手续费/1 | 往国外汇钱要交一点 | Sending money abroad costs a fee, so the word must mean service charge.
开户/1 | 到银行办了一张银行卡 | He opened an account, so the word must mean to open an account.
余额/1 | 买东西前看卡里还有多少 | He checked what was left on his card, so the word must mean balance.
扫码/1 | 用手机付款 | Pay by scanning a code, so the word must mean to scan a code.
柜台/1 | 在银行排队存钱的地方 | He queued at it in the bank, so the word must mean counter.
柜员/1 | 每天帮顾客存钱取钱 | He works at the bank helping customers pay in and take out money, so the word must mean teller.
发票/1 | 公司报销时需要 | Needed for expenses, so the word must mean invoice.
特价/1 | 衣服只卖五十块 | The jacket is on offer at only fifty yuan, so the word must mean special price.
原价/1 | 一百块，现在打八折 | A hundred before the discount, so the word must mean original price.
标价/1 | 每件商品上贴着 | Every item has a price tag, so the word must mean marked price.
性价比/1 | 不贵，质量又好 | The computer is not dear and is well made too, so the word must mean value for money.
物美价廉/1 | 小店的东西好又便宜 | The little shop's goods are good and cheap, so the word must mean good and inexpensive.
廉价/1 | 塑料玩具很容易坏 | Cheap toys break, so the word must mean cheap.
贵重/1 | 不要把值钱的东西放车里 | Leave no valuables in the car, so the word must mean valuable.
砍价/1 | 在市场和老板说便宜一点 | At the market you can bargain with the stallholder, so the word must mean to bargain.
包邮/1 | 网店买满一百块 | Free postage over a hundred, so the word must mean free shipping.
下单/1 | 昨晚在网上买，今天就收到 | Ordered last night, here today, so the word must mean to place an order.
商场/1 | 星期六里面人很多 | Crowded on Saturday, so the word must mean shopping mall.
摊主/1 | 在市场卖了二十年水果 | He has run his stall for twenty years, so the word must mean stall owner.
地摊/1 | 晚上在路边买了个小玩具 | He bought a little toy at a stall by the roadside in the evening, so the word must mean street stall.
摊位/1 | 在菜市场租的卖菜的地方 | He rents a market stall, so the word must mean stall.
小贩/1 | 推着车卖水果 | He sells fruit from a cart, so the word must mean pedlar.
推销/1 | 打电话卖保险 | Someone called to sell insurance, so the word must mean to promote, sell.
成交/1 | 最后以三千元谈好 | They settled at three thousand, so the word must mean to clinch a deal.
进货/1 | 每周一买回新货 | New stock arrives Mondays, so the word must mean to stock up.
缺货/1 | 手机太受欢迎，商店里没有了 | Shops are sold out, so the word must mean out of stock.
销量/1 | 手机卖了一百万台 | A million sold, so the word must mean sales volume.
欠债/1 | 做生意亏了本 | He lost money and owes much, so the word must mean to be in debt.
还款/1 | 贷款要在十年内 | The loan is repaid in ten years, so the word must mean to repay.
债务/1 | 公司太多，最后破产 | Too much debt bankrupted the firm, so the word must mean debt.
欠款/1 | 他全部还清了 | He paid off what he owed, so the word must mean money owed.
借条/1 | 借钱给朋友时让他写 | Have a friend sign an IOU, so the word must mean IOU.
押金/1 | 租自行车先交，还车时退 | Refunded when the bike returns, so the word must mean deposit.
分期/1 | 每个月付三百块 | Pay monthly, so the word must mean in instalments.
首付/1 | 买房子先付三成 | Thirty per cent of the price must be paid first to buy the flat, so the word must mean down payment.
透支/1 | 信用卡不能再刷了 | The card is over its limit, so the word must mean to overdraw.
欠费/1 | 手机要尽快交话费 | The phone bill is overdue, so the word must mean to be in arrears.
基金/1 | 每个月拿一部分工资买 | He invests monthly in it, so the word must mean fund.
保险/1 | 给全家人都买了医疗的 | He bought medical cover for the whole family, so the word must mean insurance.
股民/1 | 股市一跌很着急的人 | Investors fret when shares fall, so the word must mean stock investor.
通货膨胀/1 | 同样的钱能买的东西变少 | Money buys less, so the word must mean inflation.
购买力/1 | 收入增加以后提高 | Higher income raises it, so the word must mean purchasing power.
外币/1 | 银行可以兑换十几种 | A dozen foreign currencies, so the word must mean foreign currency.
富裕/1 | 农民的生活越来越好 | Farmers grow well off, so the word must mean prosperous.
欧元/1 | 法国和德国都用 | France and Germany use it, so the word must mean euro.
日元/1 | 去日本旅行前换的 | Before travelling to Japan he changed some money, so the word must mean Japanese yen.
膨胀/1 | 很多东西受热以后 | Heat makes things expand, so the word must mean to expand.
奢侈/1 | 每天去高级饭店吃饭 | He dines lavishly every day, so the word must mean extravagant.
奢侈品/1 | 名牌包、名牌手表 | Designer bags and watches, so the word must mean luxury goods.
攀比/1 | 同学之间比谁的手机更贵 | Do not compete over phones, so the word must mean to keep up with others.
炫耀/1 | 总喜欢向别人显示新鞋 | He shows off his new shoes, so the word must mean to show off.
大手大脚/1 | 花钱多，工资不够用 | He spends freely, so the word must mean wasteful.
精打细算/1 | 妈妈从来不多花一分钱 | Mum budgets carefully, so the word must mean to budget carefully.
量入为出/1 | 不能花得比挣得多 | One must never spend more than one earns, so the word must mean to live within one's means.
记账/1 | 每天写下钱花在哪里 | She tracks her spending, so the word must mean to keep accounts.
开销/1 | 搬到大城市家里花的钱多了 | Expenses rose in the city, so the word must mean expenses.
消费观/1 | 年轻人花钱的想法跟老人不一样 | Young and old view spending differently, so the word must mean attitude to spending.
优惠券/1 | 用了可以少付二十块 | It takes twenty off, so the word must mean coupon.
赠品/1 | 买电视送的小音箱 | The shop throws in a small speaker free with the TV, so the word must mean free gift.
赠送/1 | 作者给图书馆的书 | The author donated the book, so the word must mean to present.
会员/1 | 办了健身房的卡 | He signed up for the gym's card, so the word must mean member.
积分/1 | 每买一百块得十个 | Ten points per hundred, so the word must mean points.
退款/1 | 商品有问题可以申请 | If the goods are faulty, you can ask for your money back, so the word must mean refund.
换货/1 | 鞋子小了一号 | The shoes are too small, so the word must mean to exchange goods.
保修/1 | 冰箱三年里坏了免费修 | If the fridge breaks within three years, it is repaired free, so the word must mean warranty.
收据/1 | 交完学费学校给的 | Given after paying fees, so the word must mean receipt.
礼券/1 | 朋友送的书店的 | On her birthday a friend gave her a voucher for a bookshop, so the word must mean gift voucher.
收支平衡/1 | 小店终于不亏了 | The shop now breaks even, so the word must mean to break even.
赔本/1 | 价钱这么低卖 | Such low prices mean a loss, so the word must mean to sell at a loss.
营业额/1 | 饭店一天两万块 | The restaurant takes twenty thousand yuan a day, so the word must mean turnover.
账本/1 | 老板每晚看一遍 | The boss checks the ledger, so the word must mean account book.
账目/1 | 公司的要清清楚楚 | The accounts must be clear, so the word must mean accounts.
抵押/1 | 用房子向银行借钱 | He pledged his house, so the word must mean mortgage.
债主/1 | 欠了很多钱，天天来找他 | Creditors come daily, so the word must mean creditor.
货到付款/1 | 不用先付钱 | Pay when it arrives, so the word must mean cash on delivery.
商贩/1 | 街上卖什么的都有 | People on the street sell all kinds of things, so the word must mean trader.
理财产品/1 | 收益比存定期高 | It pays more than a deposit, so the word must mean wealth management product.
友情/1 | 从小一起长大，感情很深 | Childhood friends, so the word must mean friendship.
知己/1 | 我心里想什么他都知道 | He knows my mind, so the word must mean close friend.
老同学/1 | 毕业二十年后在街上遇到 | Met after twenty years, so the word must mean old classmate.
校友/1 | 科学家是我们学校的 | The scientist is one of our alumni, so the word must mean alumnus.
无话不谈/1 | 好朋友在一起什么都说 | Best friends talk about anything, so the word must mean to talk about everything.
志同道合/1 | 一起做研究的朋友 | Like-minded friends, so the word must mean like-minded.
共同语言/1 | 我们都喜欢足球 | We share interests, so the word must mean common ground.
结识/1 | 在夏令营认识新朋友 | He got to know new friends, so the word must mean to get to know.
义气/1 | 朋友有困难一定帮忙 | He stands by friends, so the word must mean loyalty to friends.
亲密/1 | 常常一起上学的好朋友 | Close friends, so the word must mean intimate.
相处/1 | 性格好，和谁都能 | He gets along with everyone, so the word must mean to get along.
合群/1 | 跟班里同学都玩得来 | He fits in with everyone, so the word must mean sociable.
人际关系/1 | 在公司里处理好很重要 | Managing relationships at work matters, so the word must mean interpersonal relations.
社交/1 | 她不喜欢，星期天在家看书 | She avoids socialising, so the word must mean social life.
打招呼/1 | 见到邻居主动说早上好 | He always greets neighbours, so the word must mean to greet.
道谢/1 | 别人帮了你 | When helped, you should thank them, so the word must mean to thank.
亲切/1 | 新老师说话让人觉得温暖 | The new teacher is warm, so the word must mean cordial.
生疏/1 | 很多年不联系 | Years apart made them distant, so the word must mean estranged.
陌生人/1 | 小孩子不要跟着走 | Children must not go with strangers, so the word must mean stranger.
热闹/1 | 过年家里来了很多亲戚 | At New Year the house is full of relatives, so the word must mean lively.
默契/1 | 一个眼神就知道对方想做什么 | One glance says it all, so the word must mean tacit understanding.
合得来/1 | 两个人性格差不多 | Similar natures, so the word must mean to get on well.
关照/1 | 我刚来公司，请大家多帮助 | New at work, he asks for help, so the word must mean to look after.
合作伙伴/1 | 两家公司多年一起做事 | Long-time partners, so the word must mean partner.
交心/1 | 什么心事都愿意说 | They share all their worries, so the word must mean to open one's heart.
人情/1 | 他帮了我很多，我欠他一个 | I owe him a favour, so the word must mean favour.
面子/1 | 当着大家批评他 | Scolded in public, he lost face, so the word must mean face.
度量/1 | 别人批评他也不生气 | He takes criticism calmly, so the word must mean magnanimity.
靠得住/1 | 做事认真的人 | A careful worker you can count on, so the word must mean reliable.
忠告/1 | 老师的话让他少走弯路 | The teacher's advice saved him trouble, so the word must mean sincere advice.
忠诚/1 | 小狗对主人 | A dog is loyal, so the word must mean loyal.
忠实/1 | 节目的观众每期都看 | He watches every episode of the programme, so the word must mean faithful.
信赖/1 | 值得相信的医生 | He is a doctor people can trust, so the word must mean to trust.
守约/1 | 说几点到就几点到 | He keeps appointments, so the word must mean to keep an appointment.
失约/1 | 约好三点见面他没来 | He failed to turn up, so the word must mean to miss an appointment.
诺言/1 | 按时把书还给了我 | He kept his promise, so the word must mean promise.
许诺/1 | 考得好暑假就去旅行 | Dad promised a trip, so the word must mean to promise.
真心实意/1 | 他是真的想帮你 | He truly wants to help, so the word must mean sincerely.
虚情假意/1 | 对你好只是想让你帮他做事 | His kindness is fake, so the word must mean hypocritical affection.
坦诚/1 | 朋友之间应该说真话 | Friends should be candid, so the word must mean candid.
闹矛盾/1 | 两个人最近谁也不理谁 | They are at odds, so the word must mean to fall out.
闹别扭/1 | 为了一个玩具整个下午不说话 | They sulked over a toy, so the word must mean to sulk at each other.
指责/1 | 出了问题不应该互相说是对方错 | Do not blame each other, so the word must mean to accuse.
埋怨/1 | 总说天气不好，不想自己的原因 | He grumbles about the weather, so the word must mean to blame.
欺负/1 | 大孩子不能打小孩子 | Big children must not bully small ones, so the word must mean to bully.
排挤/1 | 在新班级被几个同学推到外面 | Classmates pushed him out, so the word must mean to push out.
孤立/1 | 别人和你不一样就不跟他玩 | Do not shut someone out, so the word must mean to isolate.
冷淡/1 | 吵架以后她对我不热情了 | She turned cold, so the word must mean cold, indifferent.
说坏话/1 | 不要在背后说别人不好 | Do not badmouth people, so the word must mean to speak ill of.
计较/1 | 好朋友之间不要为小事 | Do not quibble over trifles, so the word must mean to fuss over.
委屈/1 | 没做错事却被批评 | Blamed unfairly, so the word must mean wronged.
嫉妒/1 | 朋友考了第一名心里不舒服 | His friend came first, so the word must mean jealous.
怨恨/1 | 过了很多年心里已经不恨了 | After so many years he no longer bears a grudge over it, so the word must mean resentment.
嘲笑/1 | 别人说错话不应该笑他 | Do not laugh at mistakes, so the word must mean to mock.
冷嘲热讽/1 | 不帮忙还在一边说难听的话 | He jeered instead of helping, so the word must mean to mock and taunt.
难为情/1 | 在大家面前唱歌觉得害羞 | Singing in public embarrasses her, so the word must mean embarrassed.
抱怨/1 | 总说工作太累工资太低 | He complains of work and pay, so the word must mean to complain.
吵闹/1 | 两个孩子在客厅里很吵 | The children are noisy, so the word must mean to make a racket.
屈服/1 | 困难再大他都没有低头 | He never gave in, so the word must mean to yield.
心胸/1 | 宽广，从不为小事生气 | Broad-minded, so the word must mean breadth of mind.
和解/1 | 朋友帮助两家人不再争了 | The families were reconciled, so the word must mean to reconcile.
和好如初/1 | 吵过一次架，很快就跟以前一样好 | They were soon friends again, so the word must mean to be reconciled as before.
化解/1 | 一句道歉让矛盾没了 | An apology resolved the conflict, so the word must mean to resolve.
调解/1 | 邻居有矛盾，居委会派人来 | The committee came to mediate, so the word must mean to mediate.
劝架/1 | 两个同学吵起来，班长过来 | The monitor broke up the quarrel, so the word must mean to stop a fight.
握手言和/1 | 比赛后两个队员成了好朋友 | They shook hands and made peace, so the word must mean to make peace.
赔礼道歉/1 | 打破邻居家窗户，主动上门 | He went round to apologise, so the word must mean to make a formal apology.
认错/1 | 知道自己错了向老师说 | He admitted his fault, so the word must mean to admit a mistake.
抱歉/1 | 让你等了这么久 | Sorry to keep you waiting, so the word must mean sorry.
妥协/1 | 双方都让了一点问题就解决了 | Both gave ground, so the word must mean to compromise.
牵挂/1 | 孩子在国外，父母心里总想着 | Parents worry about him abroad, so the word must mean to worry about.
挂念/1 | 奶奶好多了，你不用 | Grandma is better, do not worry, so the word must mean to miss, worry about.
拥抱/1 | 见到老朋友高兴地上前 | She hugged her old friend, so the word must mean to hug.
团聚/1 | 春节全家人一起吃年夜饭 | The family reunites at New Year, so the word must mean to reunite.
聚会/1 | 我们班一起唱歌吃饭 | On Saturday the class meets to sing and eat together, so the word must mean party.
送别/1 | 朋友们都到机场 | Friends see him off at the airport, so the word must mean to see off.
久别/1 | 老朋友很久没见了 | Old friends long parted, so the word must mean long separated.
关怀/1 | 老师的照顾下适应了新学校 | With the teacher's care he settled in, so the word must mean care.
倾诉/1 | 有了烦恼向好朋友说 | When troubled you can pour out your worries to a good friend, so the word must mean to pour out.
倾听/1 | 不只会说，还会耐心地听 | A good friend listens, so the word must mean to listen attentively.
敬佩/1 | 为别人做了这么多好事 | Everyone admires his good deeds, so the word must mean to esteem.
佩服/1 | 能用三种语言演讲 | I admire his three languages, so the word must mean to admire.
冷漠/1 | 看到别人有困难不能不管 | Do not be indifferent, so the word must mean indifferent.
疏远/1 | 搬家以后跟老朋友渐渐远了 | They drifted apart, so the word must mean to drift apart.
绝交/1 | 为小事吵架差点儿不再是朋友 | They almost broke off, so the word must mean to break off relations.
亲近/1 | 小猫一见到人就过来 | The kitten comes to people, so the word must mean friendly, close.
爱面子/1 | 做错了事也不愿意承认 | He is too proud to admit it when he is wrong, so the word must mean to be concerned about face.
坦然/1 | 没有做错事所以很平静 | Innocent, he is at ease, so the word must mean calm.
闹着玩/1 | 别生气，我刚才是开玩笑 | I was only joking, so the word must mean to joke.
亲如一家/1 | 两家邻居住了二十年 | Neighbours of twenty years, so the word must mean as close as family.
歌剧/1 | 意大利的从头到尾都是唱出来的 | The Italian work is sung from beginning to end, so the word must mean opera.
舞剧/1 | 没有台词，全靠跳舞讲故事 | Danced without words, so the word must mean dance drama.
音乐剧/1 | 有唱歌、跳舞，也有对话 | The show has songs, dancing and spoken lines, so the word must mean musical.
儿童剧/1 | 很受小朋友欢迎 | Children love the play and many parents bring them to see it, so the word must mean children's play.
木偶戏/1 | 演员在幕后用线拉着木头小人 | Wooden figures on strings, so the word must mean puppet show.
皮影戏/1 | 用灯光把影子照在白布上 | Lamplight casts the shadows of little figures onto a white screen, so the word must mean shadow play.
马戏/1 | 小狗跳绳，小熊骑车 | Dogs skip and bears ride bikes, so the word must mean circus.
小品/1 | 春节晚会上让观众笑个不停 | Comic sketches at the gala, so the word must mean skit.
昆曲/1 | 中国最古老的戏曲之一，六百年 | One of the oldest operas, so the word must mean Kunqu opera.
越剧/1 | 江南的地方戏，演员大多是女的 | It is a local opera from the south of the Yangtze, with mostly women as actors, so the word must mean Yue opera.
交响乐/1 | 一百多位音乐家一起演奏的 | A hundred musicians play it, so the word must mean symphony.
乐队/1 | 有的弹吉他，有的打鼓 | Twenty pupils play in it, some on guitar and some on drums, so the word must mean band.
指挥/1 | 乐团演奏时大家都看着他的手 | The orchestra watches his hands, so the word must mean conductor.
合唱/1 | 全班参加学校的比赛 | The whole class sang together, so the word must mean chorus.
独唱/1 | 她一个人上台唱民歌 | She sang alone, so the word must mean solo singing.
独奏/1 | 一个人在台上表演钢琴 | He played the piano alone, so the word must mean instrumental solo.
伴奏/1 | 她唱歌，妹妹弹钢琴 | Her sister plays along, so the word must mean accompaniment.
合唱团/1 | 学校的，每周练习两次 | She joined the school's group that sings together twice a week, so the word must mean choir.
演奏家/1 | 有名的小提琴 | He is a famous violinist, so the word must mean performer.
钢琴/1 | 从五岁开始学弹 | She has played since five, so the word must mean piano.
小提琴/1 | 放在肩上拉 | Rested on the shoulder, so the word must mean violin.
大提琴/1 | 太大了，放在两腿中间拉 | Played between the knees, so the word must mean cello.
笛子/1 | 用竹子做的 | Made of bamboo, so the word must mean flute.
二胡/1 | 拉的中国传统乐器 | A bowed Chinese instrument, so the word must mean erhu.
鼓手/1 | 乐队里坐在最后面的人 | He sits at the back of the band, so the word must mean drummer.
打鼓/1 | 他在乐队里负责的事 | His part in the band is playing the drums, so the word must mean to play drums.
乐谱/1 | 演奏以前先看看 | Read before playing, so the word must mean sheet music.
音符/1 | 曲子里每个他都记得 | He remembers every note, so the word must mean musical note.
旋律/1 | 歌听一遍就记住了 | The tune sticks at once, so the word must mean melody.
谱曲/1 | 音乐家给诗配上音乐 | A composer set the poem to music, so the word must mean to compose music.
排练/1 | 为了演出练了三个月 | They rehearsed for months, so the word must mean to rehearse.
彩排/1 | 演出前一天穿上服装 | A full costume run the day before, so the word must mean dress rehearsal.
谢幕/1 | 演出结束演员走到台前 | The cast take their bow, so the word must mean curtain call.
后台/1 | 上场前演员在这里化妆 | Actors make up there, so the word must mean backstage.
登台/1 | 第一次上去表演，有点儿紧张 | It is her first time performing on stage, and she is a little nervous, so the word must mean to go on stage.
亮相/1 | 新车在车展上第一次出现 | The car debuts at the show, so the word must mean to make a debut.
灯光/1 | 演出开始舞台上亮了 | The stage lights come up, so the word must mean lighting.
道具/1 | 桌子、椅子、电话 | Things used on stage, so the word must mean props.
观众席/1 | 演出前已经坐满了人 | The seats are full, so the word must mean auditorium seating.
节目单/1 | 看了知道有十个节目 | It lists ten acts, so the word must mean programme.
配角/1 | 只出现了五分钟 | He has a small part in the film and appears for only five minutes, so the word must mean supporting role.
扮演/1 | 她在电影里演一位老师 | She plays a teacher, so the word must mean to play a role.
化妆/1 | 演员上台前要先做的 | Actors do it before going on, so the word must mean to put on make-up.
化妆师/1 | 半小时把年轻演员变成老人 | The make-up artist aged him, so the word must mean make-up artist.
打扮/1 | 参加晚会前弄得很漂亮 | She dressed up for the party, so the word must mean to dress up.
装扮/1 | 扮成老爷爷，谁也没认出 | He disguised himself, so the word must mean to disguise.
小丑/1 | 马戏团里戴红鼻子的 | The red-nosed one, so the word must mean clown.
反派/1 | 电影里常演坏人 | He often plays villains, so the word must mean villain.
脸谱/1 | 京剧里不同颜色代表性格 | Painted faces show character, so the word must mean facial make-up in opera.
主演/1 | 电影由著名演员担任主角 | A star leads the cast, so the word must mean to star.
嗓子/1 | 唱了一晚上今天哑了 | His voice is hoarse, so the word must mean throat, voice.
嗓音/1 | 很特别，一听就知道是她 | Her voice is unmistakable, so the word must mean voice.
唱腔/1 | 京剧的外国人觉得新鲜 | Peking opera's singing style, so the word must mean singing style.
高音/1 | 她唱到最高的那个 | Everyone clapped when she sang the highest note, so the word must mean high note.
低音/1 | 声音很低，在合唱团里唱 | He sings bass, so the word must mean bass.
走调/1 | 唱歌常常不在调上 | He sings off key, so the word must mean to go off key.
舞姿/1 | 很优美，大家看得入迷 | Her dancing posture is graceful, so the word must mean dance posture.
姿势/1 | 写字的时候要保持正确的 | Sit correctly to write, so the word must mean posture.
旋转/1 | 用脚尖连续转很多圈 | The ballerina spins, so the word must mean to spin.
模仿/1 | 很会学别人说话的声音 | He imitates voices, so the word must mean to imitate.
歌星/1 | 开演唱会门票一下子卖完 | Concert tickets sold out, so the word must mean singing star.
影星/1 | 演过很多有名的电影 | She is an international star who has acted in many famous films, so the word must mean film star.
影迷/1 | 每个星期都去电影院 | He loves films, so the word must mean film fan.
戏迷/1 | 爷爷每天都听京剧 | Grandpa listens to Peking opera every day, so the word must mean opera fan.
偶像/1 | 运动员是很多年轻人的 | Many young people look up to the athlete, so the word must mean idol.
票房/1 | 电影很受欢迎 | The film is a box-office hit, so the word must mean box office.
喝彩/1 | 表演太精彩，观众都为他 | The crowd cheered, so the word must mean to cheer.
一举成名/1 | 比赛得了第一名就出名了 | She became famous overnight, so the word must mean to become famous at one stroke.
家喻户晓/1 | 连小孩子都知道 | Everyone knows it, so the word must mean known to every household.
歌迷/1 | 演唱会后等在门口想见歌手 | Fans waited for the singer, so the word must mean music fans.
芭蕾舞/1 | 演员常常用脚尖站着 | Dancers stand on their toes, so the word must mean ballet.
民族舞/1 | 少数民族的舞，很有特色 | She performs a dance of an ethnic minority, so the word must mean folk dance.
独舞/1 | 她一个人表演 | She danced alone, so the word must mean solo dance.
群舞/1 | 五十个人一起跳 | Fifty people dance together on a big scale, so the word must mean group dance.
领舞/1 | 站在最前面的 | She leads at the front, so the word must mean lead dancer.
魔术/1 | 把手表变没了 | He made a watch vanish, so the word must mean magic trick.
魔术师/1 | 从帽子里变出一只小鸟 | Someone made a little bird appear from a hat, so the word must mean magician.
变脸/1 | 四川戏里一转头换一张脸 | In Sichuan opera an actor turns his head and shows a new face, so the word must mean face-changing.
魔法/1 | 童话里把石头变成金子 | In the fairy tale an old man turns stone into gold, so the word must mean magic.
舞蹈家/1 | 从小学跳舞后来有名了 | She learned to dance as a child and later became famous for it, so the word must mean dancer.
上映/1 | 电影下个月在影院放 | The film opens next month, so the word must mean to be shown.
首映/1 | 导演和演员都来了的第一次放映 | The director and actors came to the cinema the night the film was first shown, so the word must mean premiere.
放映/1 | 每周五晚上在礼堂放一部电影 | The school shows a film in the hall every Friday evening, so the word must mean to screen.
感人/1 | 很多观众都哭了 | The story made many in the audience cry, so the word must mean moving.
出色/1 | 演出表现得非常好 | She did brilliantly, so the word must mean outstanding.
传神/1 | 演老人像真的一样 | He plays the old man so well that he seems real, so the word must mean vivid, lifelike.
绘声绘色/1 | 讲那天的事大家都听入迷 | He told the story so vividly that everyone was spellbound, so the word must mean vividly.
即兴/1 | 没有准备就表演了相声 | Unprepared, he improvised, so the word must mean impromptu.
发挥/1 | 太紧张没有拿出平时的水平 | Nerves held him back, so the word must mean to bring into play.
仿佛/1 | 听着歌好像回到小时候 | The song takes me back, so the word must mean as if.
半球/1 | 赤道把地球分成南北两个 | The equator splits Earth in two, so the word must mean hemisphere.
经度/1 | 相同的地方在一条南北方向的线上 | Places that share it lie on one north-south line, so the word must mean longitude.
纬度/1 | 赤道的是零度 | At the equator it is zero, so the word must mean latitude.
赤道/1 | 附近的地方一年四季都很热 | Places near it are always hot, so the word must mean equator.
北半球/1 | 中国在那里，十二月是冬天 | China is there, winter in December, so the word must mean Northern Hemisphere.
南半球/1 | 澳大利亚在那里，十二月是夏天 | Australia is there, summer in December, so the word must mean Southern Hemisphere.
地球仪/1 | 老师转动它告诉我们中国在哪 | The teacher spins it, so the word must mean globe.
方向感/1 | 在陌生的城市也不迷路 | He never gets lost, so the word must mean sense of direction.
方位/1 | 看太阳判断自己在哪 | He fixed his position by the sun, so the word must mean position, bearing.
时区/1 | 中国全国只用一个 | China uses one, so the word must mean time zone.
地形/1 | 西高东低，河向东流 | China's land is high in the west and low in the east, so the word must mean terrain.
盆地/1 | 四川四周都是山，中间低 | Sichuan is ringed by mountains and lower in the middle, so the word must mean basin.
丘陵/1 | 不太高，适合种茶 | Low hills for tea, so the word must mean hills.
山脉/1 | 喜马拉雅有最高的山峰 | The Himalayas hold the highest peaks in the world, so the word must mean mountain range.
峡谷/1 | 河在两座大山之间流过 | A deep cut between mountains, so the word must mean gorge.
海拔/1 | 城市很高，刚来的人会头疼 | The city is high up, so the word must mean altitude.
黄土高原/1 | 土是黄色的，下雨容易冲走 | Yellow soil washed away by rain, so the word must mean Loess Plateau.
青藏高原/1 | 世界上海拔最高的高原 | It is the highest plateau in the world, so the word must mean Qinghai-Tibet Plateau.
山腰/1 | 爬到一半就累了 | Tired halfway up, so the word must mean mountainside.
山脚/1 | 小村子在山下 | The village lies at the foot, so the word must mean foot of a hill.
瀑布/1 | 河水从山上落下来 | Water falls from the mountain, so the word must mean waterfall.
海峡/1 | 坐船穿过一小时到对面的岛 | A boat crosses this narrow stretch of sea to the island in an hour, so the word must mean strait.
海湾/1 | 三面是陆地，风浪很小 | Land lies on three sides of the water, so the waves are small, so the word must mean bay.
湖泊/1 | 这个地区河流和它很多 | The region has many rivers and much standing water, so the word must mean lake.
源头/1 | 长江的在青藏高原 | Where the Yangtze begins, so the word must mean source.
流域/1 | 黄河的是古代文明发源地 | The lands along the Yellow River were an early home of Chinese civilisation, so the word must mean river basin.
上游/1 | 河水流得很急 | The river runs fast in its higher part and slowly lower down, so the word must mean upper reaches.
下游/1 | 上海离入海口很近 | Shanghai is near the mouth, so the word must mean lower reaches.
运河/1 | 古人修的，一千多年历史 | Dug by people long ago, so the word must mean canal.
长江/1 | 中国最长的河 | It is the longest river in China and in Asia, so the word must mean Yangtze River.
海岸线/1 | 中国大陆的有一万八千多公里 | Over eighteen thousand kilometres of it, so the word must mean coastline.
海岸/1 | 沿着散步看海 | We walked along the coast, so the word must mean seashore.
岸边/1 | 小船慢慢靠过去 | The little boat slowly drew up to the land, so the word must mean bank, shore.
对岸/1 | 河的那一边是树林 | A wood lies on the other side of the river, so the word must mean opposite bank.
上岸/1 | 船停好乘客一个个下船 | Passengers went ashore, so the word must mean to go ashore.
停泊/1 | 渔船在港口里 | Boats lie at anchor, so the word must mean to anchor.
港湾/1 | 风平浪静，渔船都停在这里 | The water is calm, and fishing boats like to moor there, so the word must mean harbour.
海南岛/1 | 中国南部，冬天也很温暖 | The island lies in the south of China and is warm even in winter, so the word must mean Hainan Island.
内陆/1 | 新疆离海很远 | Xinjiang lies in China's northwest, far from the sea, so the word must mean inland.
大洋/1 | 太平洋是最大的 | The Pacific is the largest, so the word must mean ocean.
季风/1 | 夏天从海上来带来雨 | Summer winds bring rain, so the word must mean monsoon.
降水/1 | 一年很少，非常干燥 | The place gets little rain or snow in a year and is very dry, so the word must mean precipitation.
热带雨林/1 | 亚马孙河流域有最大的 | The Amazon has the largest, so the word must mean tropical rainforest.
绿洲/1 | 沙漠中走了一天终于看到 | After a day in the desert they at last saw green land, so the word must mean oasis.
冰山/1 | 海上只有一小部分露出水面 | Only a small part of the ice floating at sea shows above the water, so the word must mean iceberg.
极光/1 | 北极附近冬夜彩色的光 | Coloured lights in the polar night, so the word must mean aurora.
极夜/1 | 北极附近一整天看不到太阳 | Near the North Pole there is a time when the sun is not seen all day, so the word must mean polar night.
冻土/1 | 地下一年四季不化的土 | A layer of ground under the place stays frozen all year, so the word must mean permafrost.
雪线/1 | 山上这条线以上都是雪 | Above it lies snow all year, so the word must mean snow line.
地势/1 | 这里高，能看到整个城市 | High ground overlooks the city, so the word must mean lie of the land.
西北/1 | 新疆在中国的这个方向 | Xinjiang lies here, so the word must mean northwest.
西南/1 | 四川和云南 | Sichuan and Yunnan are given as lying in this part of China, so the word must mean southwest.
东南/1 | 福建在沿海 | Fujian lies on the coast in this part of China, so the word must mean southeast.
华北/1 | 北京在这个地区 | Beijing lies in this region of China, so the word must mean North China.
华南/1 | 广东冬天也不太冷 | Guangdong lies in this region, where winter is mild, so the word must mean South China.
江南/1 | 水多，有很多小桥和小船 | The region has much water, with many little bridges and boats, so the word must mean south of the Yangtze.
边疆/1 | 离国界很近的地方 | After university he went to work in a place close to the national border, so the word must mean border region.
省会/1 | 广州是广东省的 | Guangzhou is Guangdong's capital, so the word must mean provincial capital.
面积/1 | 俄罗斯国土最大 | Russia is largest by it, so the word must mean area.
泰山/1 | 山东，很多人半夜爬去看日出 | The mountain is in Shandong, and many people climb it at night to see the sunrise, so the word must mean Mount Tai.
旅行社/1 | 去云南通过他们报的名 | We booked through an agency, so the word must mean travel agency.
行程/1 | 旅行很紧，每天去三个地方 | The trip is tightly planned, with three places to visit each day, so the word must mean itinerary.
攻略/1 | 出发前在网上看的旅游 | Online travel tips, so the word must mean travel guide.
路线/1 | 导航找了一条最近的 | The satnav found the shortest way for us, so the word must mean route.
目的地/1 | 坐了十个小时火车终于到了 | We finally arrived, so the word must mean destination.
跟团游/1 | 什么都安排好了，不用操心 | Everything is arranged, so the word must mean package tour.
自助游/1 | 不喜欢跟着导游走 | He travels independently, so the word must mean independent travel.
自驾游/1 | 爸爸开车带我们去 | Dad drives us, so the word must mean road trip.
背包客/1 | 便宜旅馆住的年轻人 | Young budget travellers, so the word must mean backpacker.
名胜古迹/1 | 长城和故宫 | The Great Wall and the Forbidden City are given as examples of Beijing's famous sights, so the word must mean places of historic interest.
中转/1 | 没有直达火车，在省会换一次 | There is no direct train, so travellers change once at the provincial capital, so the word must mean to transfer.
转机/1 | 去巴西要在别的国家换飞机 | Change planes on the way, so the word must mean to change planes.
改签/1 | 突然有事把票换到第二天 | He moved his ticket a day, so the word must mean to change a ticket.
退票/1 | 旅行取消了 | The trip is off, so the word must mean to return a ticket.
候车室/1 | 火车没来，大家在里面等 | The train has not come, so everyone waits in the room for it, so the word must mean waiting room.
候机厅/1 | 飞机晚点等了三个小时 | The flight was late, and we waited three hours in the lounge, so the word must mean departure lounge.
途经/1 | 北京开往上海的火车中间过南京 | The train passes through Nanjing, so the word must mean to pass through.
路程/1 | 从家到学校走路十分钟 | The walk from home to school takes only ten minutes, so the word must mean distance, journey.
入住/1 | 酒店下午两点以后才能住进去 | Check-in is after two, so the word must mean to check in.
退房/1 | 明天中午十二点以前离开酒店 | Leave the room by noon, so the word must mean to check out.
徒步/1 | 走了二十公里才到村子 | They walked twenty kilometres, so the word must mean on foot.
露营/1 | 去湖边，晚上睡在外面 | On Saturday we go to the lake and sleep outdoors at night, so the word must mean to camp.
帐篷/1 | 晚上在湖边支起来 | Pitched by the lake at night, so the word must mean tent.
悬崖/1 | 走在边上要特别小心 | Walking along the edge of the drop needs great care, so the word must mean cliff.
冒险/1 | 天气这么坏还是不要去爬山 | Do not risk the climb, so the word must mean to take a risk.
溶洞/1 | 洞里的石头形状很特别 | Strange rock shapes inside, so the word must mean limestone cave.
山清水秀/1 | 小村子像画一样美 | The little village is as lovely as a painting, so the word must mean green hills and clear waters.
名山大川/1 | 一生走遍了全国的 | He visited the country's great mountains and rivers, so the word must mean famous mountains and great rivers.
风景区/1 | 每年有几百万游客 | Millions of tourists visit the place every year, so the word must mean scenic area.
日出/1 | 早上四点就起床去看 | They got up at four in the morning to see it, so the word must mean sunrise.
论点/1 | 文章的主张是读书能让人进步 | The essay's claim is clear, so the word must mean thesis.
论据/1 | 看法很好，但需要更多事实支持 | More facts are needed, so the word must mean supporting evidence.
论证/1 | 用三个例子证明自己的观点 | Three examples prove his point, so the word must mean to argue, prove.
前提/1 | 身体健康是做好工作的 | Health comes first, so the word must mean precondition.
推论/1 | 从数据得出多运动睡得更好 | The data lead to the conclusion that people who exercise more sleep better, so the word must mean inference.
依据/1 | 法官判案以法律为 | Judges decide cases on the basis of the law, so the word must mean basis.
要点/1 | 把文章最重要的几点写下来 | Write down the main points, so the word must mean main point.
论述/1 | 书用很多例子讲古代教育制度 | The book discusses ancient schooling, so the word must mean to expound.
有理有据/1 | 发言有道理有证据，大家被说服 | Reasoned and supported, so the word must mean well-reasoned and well-founded.
站得住脚/1 | 证据充足，观点就 | Enough evidence makes a view hold up, so the word must mean tenable.
逻辑/1 | 说话一步一步讲得很清楚 | He reasons step by step, so the word must mean logic.
归纳/1 | 从例子中找出一个规律 | The teacher asks us to draw a general rule from these examples, so the word must mean to induce, sum up.
演绎/1 | 从所有金属能导电推出铜能导电 | The reasoning goes from a general rule to a particular case, so the word must mean deduction.
类比/1 | 用水管里的水流讲电流 | Water in a pipe explains current, so the word must mean analogy.
对比/1 | 两张照片放在一起看出不同 | Put side by side, the two photos show great differences, so the word must mean to contrast.
综合/1 | 考虑成绩、表现和兴趣 | The school weighs marks, conduct and interests all together, so the word must mean comprehensive.
推断/1 | 从脚印知道有人来过 | Footprints show someone came, so the word must mean to deduce.
因果关系/1 | 下雨和地湿之间有 | Rain causes wet ground, so the word must mean cause and effect.
前因后果/1 | 把事情的原因和结果讲清楚 | He explained cause and outcome, so the word must mean cause and effect.
来龙去脉/1 | 记者花一个月了解了事情的全部经过 | After a month the reporter learned the whole story from start to finish, so the word must mean ins and outs.
反驳/1 | 不同意我的看法，举例子 | He disagreed and argued back, so the word must mean to refute.
驳斥/1 | 科学家用数据批驳错误说法 | Data refuted the false claim, so the word must mean to rebut.
斥责/1 | 上课说话被老师批评 | The teacher scolded him, so the word must mean to rebuke.
反例/1 | 找到一个就说明说法不是总成立 | One counterexample is enough, so the word must mean counterexample.
谬误/1 | 文章里有很多错误需要改正 | The essay is full of errors that need correcting, so the word must mean fallacy, error.
荒谬/1 | 说地球是平的 | A flat Earth is absurd, so the word must mean absurd.
证伪/1 | 科学理论应该可以被证明是错的 | Theories must be falsifiable, so the word must mean to falsify.
不成立/1 | 前提错了，结论也 | A false premise sinks the conclusion, so the word must mean untenable.
讲不通/1 | 你的理由大家都不会接受 | The reason makes no sense, so the word must mean to make no sense.
胡说八道/1 | 别听他，根本不是那样 | Do not listen to his nonsense, so the word must mean to talk nonsense.
估计/1 | 看这天气明天会下雨 | Judging by the weather, the speaker thinks it will rain tomorrow, so the word must mean to estimate, reckon.
估算/1 | 算了一下旅行大约五千块 | He worked out a rough cost, so the word must mean to estimate.
低估/1 | 对手很强，不要以为他们弱 | Do not underrate them, so the word must mean to underestimate.
高估/1 | 以为自己能力强，没按时完成 | He overrated himself, so the word must mean to overestimate.
评估/1 | 专家在看计划的风险 | Experts assess the risks, so the word must mean to assess.
断定/1 | 证据不够，不能说一定是他 | We cannot conclude it was him, so the word must mean to conclude.
确信/1 | 他比谁都努力，一定能成功 | I am sure he will succeed, so the word must mean to be convinced.
无可置疑/1 | 这些数据是事实 | The data are beyond doubt, so the word must mean indisputable.
判定/1 | 裁判说球没有进 | The referee ruled it no goal, so the word must mean to judge.
成见/1 | 不应该对别人早有看法 | Do not prejudge others, so the word must mean prejudice.
料想/1 | 谁也没想到比赛结果是这样 | No one expected it, so the word must mean to expect.
猜测/1 | 大家都在想新老师是什么样的人 | Everyone guesses about the new teacher, so the word must mean to guess.
猜想/1 | 数学的两百年没人能证明 | An unproved maths idea, so the word must mean conjecture.
猜谜/1 | 元宵节一边看灯一边 | On the night of the Lantern Festival people look at lanterns and solve riddles, so the word must mean to guess riddles.
斟酌/1 | 重要的信每个词都反复考虑 | He weighed every word, so the word must mean to deliberate.
琢磨/1 | 这道题想了一个晚上 | He puzzled over it all night, so the word must mean to ponder.
权衡/1 | 比较两份工作的好处坏处 | He weighed two jobs, so the word must mean to weigh up.
深思熟虑/1 | 想了很久决定出国留学 | After careful thought, so the word must mean careful consideration.
三思而后行/1 | 做重要决定以前 | Think before acting, so the word must mean to look before you leap.
想当然/1 | 做事要先了解实际情况 | One must learn the real situation first before acting, so the word must mean to take for granted.
阐述/1 | 在会上说明自己的看法 | He set out his view, so the word must mean to expound.
阐明/1 | 书讲清楚地球为什么有四季 | The book explains the seasons, so the word must mean to clarify.
陈述/1 | 把事情经过简单说一遍 | State what happened, so the word must mean to state.
定义/1 | 老师先给出“三角形”是什么 | What a triangle is, so the word must mean definition.
区分/1 | 事实和观点要分开 | Tell fact from opinion, so the word must mean to distinguish.
归类/1 | 把词按意思分好 | Sort the words by meaning, so the word must mean to classify.
譬如/1 | 游泳、跑步和打球 | Swimming, running and ball games, so the word must mean for example.
换言之/1 | 计划太贵，我们没有钱 | The plan costs too much, which is to say we lack the money, so the word must mean in other words.
具体/1 | 你说得太笼统了 | Be more specific, so the word must mean specific.
抽象/1 | “美”和“幸福”这样的概念 | Beauty and happiness are abstract, so the word must mean abstract.
以偏概全/1 | 见过两个北方人就说北方人都高 | Two people stand for all, so the word must mean to overgeneralise.
自相矛盾/1 | 一会儿说去过，一会儿说没去过 | He contradicts himself, so the word must mean self-contradictory.
本末倒置/1 | 为了漂亮书包不买书 | Bag before books, so the word must mean to put the cart before the horse.
偷换概念/1 | 讨论学习时间，他说上课时间 | He swapped one idea for another, so the word must mean to switch concepts.
循环论证/1 | 书是对的，因为书上这样写 | The proof assumes itself, so the word must mean circular reasoning.
似是而非/1 | 听起来有道理，想想却不对 | The claim sounds reasonable but turns out wrong on reflection, so the word must mean specious.
先入为主/1 | 听完双方的话再下结论 | Do not let first impressions decide, so the word must mean preconceived.
张冠李戴/1 | 把李白的诗说成杜甫写的 | He credited the wrong poet, so the word must mean to mix things up.
牵强/1 | 解释大家都不相信 | The explanation is far-fetched, so the word must mean far-fetched.
盲从/1 | 要有自己的判断 | Do not follow blindly, so the word must mean to follow blindly.
独立思考/1 | 不要总是问答案 | Think for yourself, so the word must mean independent thinking.
换位思考/1 | 遇到矛盾时站在对方角度 | Put yourself in their place, so the word must mean to see from another's view.
举一反三/1 | 学会一道题就会做一类题 | One problem teaches a type, so the word must mean to infer other cases from one.
学以致用/1 | 把课上学的用到生活中 | We should apply what we learn in class to daily life, so the word must mean to put learning into practice.
一分为二/1 | 事情有好的一面和坏的一面 | See both sides, so the word must mean to see both sides.
思路/1 | 很清楚，一下子找到办法 | His line of thought is clear, so the word must mean train of thought.
批判性/1 | 培养这种思维，不要什么都信 | We should learn to think in a way that does not believe everything, so the word must mean critical.
全面/1 | 不能只看一个方面 | One should look at every side of a question, not just one, so the word must mean comprehensive.
一针见血/1 | 指出了问题的关键 | He went straight to the heart, so the word must mean to hit the nail on the head.
本质/1 | 透过现象看 | See past appearances, so the word must mean essence.
由此可见/1 | 每天练习，成功不是靠运气 | This shows it was not luck, so the word must mean thus it can be seen.
综上所述/1 | 最后总结说学生应该多运动 | The speaker closes by summing up what has been said, so the word must mean in summary.
从而/1 | 改进学习方法，成绩提高 | Better methods raised his marks, so the word must mean thereby.
进而/1 | 先学好拼音，再学汉字 | Pinyin first, then characters, so the word must mean and then.
反之/1 | 不运动身体就会变差 | Conversely no exercise harms health, so the word must mean conversely.
倘若/1 | 明天下雨比赛就改期 | If it rains, so the word must mean if.
归根到底/1 | 失败是因为准备不够 | In the end it was poor preparation, so the word must mean in the final analysis.
与此同时/1 | 城市变大，交通问题也严重 | Meanwhile traffic worsens, so the word must mean at the same time.
偶然/1 | 他们在国外遇到 | They met abroad by chance, so the word must mean by chance.
实践/1 | 理论要和它结合 | Theory must meet practice, so the word must mean practice.
`);
