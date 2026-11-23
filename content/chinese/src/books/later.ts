// Whole books of the native grades with questions written for this subject (docs/chinese-curriculum.md §9).

import type { BookData } from "./index.ts";

/** laterBooks are the whole books of grades 7 to 11. */
export const laterBooks: readonly BookData[] = [
  {
    id: "dawn-blossoms",
    grade: 7,
    title: { en: "Dawn Blossoms Plucked at Dusk", zh: "朝花夕拾" },
    author: { en: "Lu Xun", zh: "鲁迅" },
    guide: {
      en: "These ten essays are memories: a grown man writes about his childhood and youth, so listen for two voices, the child who lived it and the adult who looks back and judges. For each essay, note the people in it, what happened, and how the writer feels about them, which often changes from the start to the end. Read the essays in order and they trace his life from his home town to his studies in Nanjing and Japan and his return. Watch for gentle humour and for sharp criticism of old customs, old education and quack doctors.",
      zh: "这十篇散文都是回忆：一个成年人写自己的童年和青年，所以要听出两种声音，一种是当年经历这些事的孩子，一种是回头看、作评价的成年人。每读一篇，记下其中的人物、发生的事，以及作者对他们的感情，这种感情常常从开头到结尾有变化。按顺序读下来，能看出作者从故乡到南京、到日本求学再回国的经历。留意文中温和的幽默，也留意他对旧习俗、旧教育和庸医的尖锐批评。",
    },
    callout: {
      en: "The ten essays look back on different times and people: Ah Chang, Mr Fujino, Fan Ainong, the garden and the school. Place the question in its own essay before you choose; a memory of one person given to another is wrong.",
      zh: "十篇文章回忆的是不同的时候和人：阿长、藤野先生、范爱农、百草园和三味书屋。选之前先想清楚问的是哪一篇；把一个人的事安到另一个人身上，就错了。",
    },
    questions: `
问：《朝花夕拾》原来的书名是什么？
答：《旧事重提》
据：《小引》：这些文章最初在《莽原》上连载时，总题叫《旧事重提》，后来编集才改名《朝花夕拾》。 || The preface: when the essays first ran in the magazine Wilderness they were titled Old Things Retold; the book was renamed later.
错：《呐喊》 || 《呐喊》是鲁迅的第一本小说集。 || Call to Arms is Lu Xun's first book of stories.
错：《彷徨》 || 《彷徨》是他的第二本小说集。 || Wandering is his second book of stories.
错：《野草》 || 《野草》是他的散文诗集。 || Wild Grass is his book of prose poems.
验：从旧名的意思对：“旧事重提”和“朝花夕拾”说的是一回事，都是重新说起往事。 || Check by meaning: both titles mean telling old things again.

问：《朝花夕拾》是一本什么样的书？
答：回忆性散文集
据：全书：十篇文章都是作者回忆童年到青年的往事，是回忆性散文。 || The book as a whole: ten essays recalling his childhood and youth, prose of memory.
错：短篇小说集 || 小说集是《呐喊》《彷徨》，《朝花夕拾》写的是真人真事。 || the story books are Call to Arms and Wandering; this one recalls real people.
错：现代诗集 || 书里都是散文，不是诗。 || it is prose, not verse.
错：日记和书信集 || 书里不是日记和书信，是一篇篇回忆文章。 || it is essays, not diaries or letters.
验：从人物对：阿长、藤野先生、范爱农都是作者生活中真实的人。 || Check by the people: Ah Chang, Fujino and Fan Ainong were real.

问：书名“朝花夕拾”是什么意思？
答：成年后回忆早年的往事
据：《小引》：带露折花，色香自然好得多，可他做不到；“朝花夕拾”是说到了晚年才拾起早年的往事。 || The preface: flowers picked with the dew on them are best, but he cannot; he gathers in the evening what bloomed in the morning, the past recalled late.
错：早上种花，傍晚收获 || 书名是比喻，不是真的种花收花。 || the title is a figure, not gardening.
错：全书写的是各种花草 || 书里写的是人和事，不是花草。 || the book is about people, not plants.
错：一天之内写成的文章 || 这些文章是1926年陆续写成的，不是一天写的。 || the essays were written over 1926, not in a day.
验：从内容对：书里写的都是他小时候和青年时的事，写的时候他已经四十多岁了。 || Check by the content: early life, written in his forties.

问：《狗·猫·鼠》中，“我”小时候仇猫的一个原因是什么？
答：以为猫吃了“我”的隐鼠
据：《狗·猫·鼠》：“我”养的隐鼠不见了，长妈妈说是被猫吃了，“我”便恨起猫来。 || “Dogs, Cats and Mice”: his pet mouse vanishes, Ah Chang says a cat ate it, and he hates cats from then on.
错：猫抓伤了“我”的手 || 书里没写猫抓伤“我”。 || no cat scratches him.
错：猫偷吃了家里的鱼 || 书里没写猫偷鱼。 || no cat steals fish.
错：猫夜里叫得太吵 || 夜里被猫叫吵是作者成年后读书时的事，不是小时候仇猫的原因。 || being kept awake by cats is from his adult nights of reading, not his childhood grudge.
验：从后来的真相对：他后来知道隐鼠是长妈妈踩死的，可仇猫已经成了习惯，可见当初的原因就是隐鼠。 || Check by the truth he later learns: Ah Chang trod on the mouse, yet the grudge stayed.

问：“我”养的隐鼠其实是怎么死的？
答：被长妈妈踩死了
据：《狗·猫·鼠》：后来才知道，隐鼠是被长妈妈一脚踩死的，并不是猫吃的。 || “Dogs, Cats and Mice”: he learns later that Ah Chang stepped on the mouse.
错：被猫吃掉了 || 说猫吃了隐鼠，正是长妈妈当初瞒着他的话。 || the cat was only Ah Chang's cover story.
错：被父亲打死了 || 书里没写父亲打死隐鼠。 || his father did not kill it.
错：自己生病死了 || 隐鼠不是病死的。 || it did not die of illness.
验：从“我”对阿长的态度对：知道真相后“我”对阿长有了怨，下一篇一开头就写到这件事。 || Check by his feelings: the next essay begins with that grudge against Ah Chang.

问：阿长有哪些让“我”不耐烦的地方？
答：爱切切察察，睡成“大”字
据：《阿长与〈山海经〉》：阿长喜欢切切察察，跟人低声说话；夜里睡觉伸开手脚，摆成一个“大”字。 || “Ah Chang and the Classic of Mountains and Seas”: she loves whispering gossip, and at night sleeps sprawled like the character 大.
错：脾气暴躁，常常打人 || 书里没写阿长打人。 || she never strikes anyone.
错：懒惰贪吃，不爱干活 || 书里没写她懒惰贪吃。 || she is not called lazy or greedy.
错：爱说谎话，骗人钱财 || 书里没写她骗钱。 || she cheats no one.
验：从“我”的抱怨对：母亲委婉地劝她，她不说话，夜里照样睡成“大”字，“我”更加不耐烦。 || Check by his complaint: his mother hints, she says nothing, and sprawls as before.

问：元旦早上，阿长要“我”做的第一件事是什么？
答：说“恭喜”，吃福橘
据：《阿长与〈山海经〉》：元旦一早，阿长要“我”一睁眼先说“阿妈，恭喜恭喜”，再塞一瓣福橘到嘴里。 || “Ah Chang”: on New Year's morning she makes him say “Congratulations, Ama!” the moment he wakes, then puts a lucky orange segment in his mouth.
错：给长辈磕头拜年 || 磕头拜年不是她要“我”做的第一件事。 || kowtowing to elders is not her first demand.
错：穿上新衣去看戏 || 书里没写去看戏。 || there is no opera here.
错：背一段书再吃饭 || 背书是《五猖会》里父亲要“我”做的事。 || reciting is what his father demands in “The Five Fierce Gods Fair”.
验：从她的规矩对：她相信一年的运气都在这第一句话和福橘上，所以一定要先做。 || Check by her belief: the year's luck rests on that first word and orange.

问：阿长给“我”买来了什么书？
答：《山海经》
据：《阿长与〈山海经〉》：她告假回来，给“我”买来一套绘图的《山海经》，她叫它“三哼经”。 || “Ah Chang”: back from leave, she brings him an illustrated Classic of Mountains and Seas, which she calls the “three-hum classic”.
错：《二十四孝图》 || 《二十四孝图》是一位长辈送的，不是阿长买的。 || the Twenty-Four Filial Exemplars came from an elder, not Ah Chang.
错：《鉴略》 || 《鉴略》是父亲要“我”背的书。 || the Brief Mirror is what his father makes him recite.
错：《花镜》 || 《花镜》是“我”自己买的。 || the Mirror of Flowers he bought himself.
验：从“三哼经”对：她不识字，把书名说错了，正说明这书是她亲自去买来的。 || Check by her mistake: she cannot read and gets the title wrong.

问：《阿长与〈山海经〉》中，“我”对阿长的感情有什么变化？
答：从厌烦到敬重和怀念
据：《阿长与〈山海经〉》：起初“我”嫌她多事、讨厌她，她买来《山海经》后，“我”对她有了新的敬意，最后深深怀念她。 || “Ah Chang”: at first he finds her tiresome, after the book he feels new respect, and at the end he mourns her.
错：从敬重到厌烦 || 方向反了，是从厌烦到敬重。 || the turn runs the other way.
错：一直很讨厌她 || 买书以后“我”敬重她。 || after the book he respects her.
错：一直很害怕她 || “我”不怕她，只是嫌她。 || he does not fear her; she annoys him.
验：从结尾对：“仁厚黑暗的地母呵，愿在你怀里永安她的魂灵”，这是深深的怀念。 || Check by the end: he prays that the earth will keep her soul in peace.

问：《阿长与〈山海经〉》的结尾，作者表达了什么愿望？
答：愿阿长的灵魂得到安息
据：《阿长与〈山海经〉》结尾：“仁厚黑暗的地母呵，愿在你怀里永安她的魂灵！” || “Ah Chang”, the last line: “Kind dark mother earth, may her soul rest forever in your arms!”
错：希望再见阿长一面 || 阿长已经去世多年，不可能再见。 || she has long been dead.
错：希望阿长原谅自己 || 书里没写请她原谅。 || he does not ask her forgiveness.
错：希望找到阿长的家人 || 书里说连她的姓名、经历都不知道，没说找家人。 || he says he never knew her name or story, not that he seeks her family.
验：从前一句对：作者说她去世已经三十年了，所以只能祝愿她安息。 || Check by the line before: she died thirty years ago.

问：《二十四孝图》中，作者最反感的是哪两个故事？
答：郭巨埋儿和老莱娱亲
据：《二十四孝图》：作者最反感“郭巨埋儿”和“老莱娱亲”，一个残忍，一个肉麻。 || “The Twenty-Four Filial Exemplars”: he most dislikes Guo Ju burying his son and Lao Lai amusing his parents, the one cruel, the other nauseating.
错：卧冰求鲤和哭竹生笋 || 卧冰求鲤和哭竹生笋，作者只说难以做到，不是最反感。 || lying on ice and weeping for bamboo he finds impossible, not the worst.
错：黄香扇枕和陆绩怀橘 || 黄香扇枕、陆绩怀橘，作者说还勉强能学。 || fanning the pillow and hiding oranges he could just manage.
错：子路负米和闻雷泣墓 || 子路负米等，作者没有特别反感。 || Zilu carrying rice draws no special scorn.
验：从郭巨的故事对：作者说读后害怕父亲会埋掉自己，正是“残忍”让他反感。 || Check by Guo Ju: he feared his own father might bury him.

问：《二十四孝图》主要批判了什么？
答：虚伪残酷的封建孝道
据：《二十四孝图》：作者通过这些故事，批判了虚伪、残酷的封建孝道。 || “The Twenty-Four Filial Exemplars”: through these tales he attacks the false and cruel filial code.
错：不孝顺父母的人 || 作者不是批评不孝的人，而是批评吃人的孝道。 || he is not attacking the unfilial but the code that devours children.
错：儿童读物太少 || 作者开头确实感叹儿童读物太少，但全篇批判的是孝道。 || he does lament the lack of children's books, but the target is the code.
错：书中的画画得粗糙 || 作者不是在评画。 || he is not judging the pictures.
验：从郭巨埋儿对：为了孝顺母亲要活埋孩子，这种孝道既虚伪又残酷，正是批判的对象。 || Check by Guo Ju: burying a child for filial piety is the cruelty he attacks.

问：《五猖会》中，“我”要去看会时，父亲让“我”先做什么？
答：背出一段《鉴略》
据：《五猖会》：“我”正要去看会，父亲叫“我”背出《鉴略》里的一段，背不出不准去。 || “The Five Fierce Gods Fair”: as he is leaving for the fair, his father makes him recite a passage of the Brief Mirror first.
错：写完一篇大字 || 书里不是写大字。 || not copying characters.
错：读完《山海经》 || 《山海经》是阿长买的，不是父亲要背的。 || the Classic is Ah Chang's gift, not his task.
错：给母亲请安 || 书里没写给母亲请安。 || he is not sent to greet his mother.
验：从背的内容对：“粤自盘古，生于太荒”，“我”一句也不懂，只能死记，可见背的是《鉴略》。 || Check by the words: “Since Pangu, born in the waste”, which he cannot understand.

问：“我”背出书以后，去看五猖会的心情怎样？
答：已经没有了兴致
据：《五猖会》：背出书后，大家欢欢喜喜出发，“我”却没有什么兴致了。 || “The Five Fierce Gods Fair”: once he recites it they set off happily, but he has lost all interest.
错：高兴得跳了起来 || 书里正相反，他没有兴致。 || the reverse: he has lost all joy.
错：后悔没有早点背 || 书里没写他后悔。 || he does not regret not starting sooner.
错：急着回家再背一遍 || 书里没写他回家再背。 || he does not rush home to recite again.
验：从结尾对：作者说至今还诧异父亲为什么偏要那时叫“我”背书，可见那天的兴致全被打掉了。 || Check by the end: he still wonders why his father chose that moment.

问：《五猖会》表现了什么？
答：旧式教育对儿童天性的压制
据：《五猖会》：孩子最盼的看会，被逼着先背不懂的书，作者借此写旧式教育对儿童天性的压制。 || “The Five Fierce Gods Fair”: forced to recite what he cannot understand before the treat he longs for, the boy shows how old schooling crushed children.
错：父亲对孩子的宠爱 || 父亲在这里是逼他背书，不是宠爱。 || the father forces him; this is no indulgence.
错：迎神赛会多么热闹 || 赛会的热闹只是陪衬，重点在背书。 || the festival is backdrop; the recitation is the point.
错：背书的好方法 || 书里背书是死记硬背，不是好方法。 || it is rote, not a method to praise.
验：从前后对比对：去看会前满心期盼，背完书后毫无兴致，这一落差正写出了压制。 || Check by contrast: eager before, flat after.

问：在《无常》中，作者觉得无常是个怎样的鬼？
答：可怖而可爱，有人情
据：《无常》：作者说无常“鬼而人，理而情，可怖而可爱”。 || “Wuchang”: he calls Wuchang ghost yet human, just yet kind, frightening yet lovable.
错：凶恶可怕，毫无人情 || 作者说他有人情，不是毫无人情。 || he has human feeling.
错：十分滑稽，只会逗笑 || 他虽有滑稽的样子，但不只是逗笑。 || he is comic in looks but more than a joke.
错：和蔼可亲，像个老人 || 他戴高帽、拿破芭蕉扇，并不像老人那样和蔼。 || in tall hat with a broken fan he is no kindly old man.
验：从他放走鬼魂的故事对：他同情一个死去的人，想放他回阳间一会，因此挨了打，这就是“有人情”。 || Check by his tale: he pities a soul and lets it go back a while, and is beaten for it.

问：冬天的百草园里，“我”最喜欢做什么？
答：在雪地里捕鸟
据：《从百草园到三味书屋》：冬天的百草园没什么意思，下雪时，“我”用闰土父亲教的方法在雪地里捕鸟。 || “From Hundred-Plant Garden to Three-Flavour Study”: in winter the garden is dull, but in snow he traps birds as Runtu's father taught.
错：堆雪人、打雪仗 || 作者说堆雪人要有人鉴赏，百草园冷落，不相宜。 || he says a snowman needs onlookers and the garden is too lonely.
错：摘覆盆子吃 || 覆盆子是夏天的果子。 || raspberries are a summer fruit.
错：捉蟋蟀玩 || 捉蟋蟀是夏天的乐趣。 || crickets belong to summer.
验：从方法对：扫出一块空地，支起竹筛，撒下秕谷，远远牵着绳子，正是雪天捕鸟。 || Check by the method: a swept patch, a propped sieve, some grain and a string.

问：长妈妈给“我”讲了一个什么故事？
答：美女蛇的故事
据：《从百草园到三味书屋》：长妈妈讲了美女蛇的故事，说一个书生被叫名字，答应了就会被吃掉。 || “From Hundred-Plant Garden”: Ah Chang tells of the beautiful snake that calls your name and eats you if you answer.
错：孙悟空的故事 || 孙悟空的故事不是阿长讲的。 || Sun Wukong is not her tale.
错：牛郎织女的故事 || 牛郎织女不是她讲的。 || the Cowherd and the Weaver are not hers.
错：嫦娥奔月的故事 || 嫦娥奔月不是她讲的。 || Chang'e is not hers.
验：从“我”的反应对：从此“我”夜里在墙根乘凉，总怕有人叫名字，这是美女蛇故事留下的。 || Check by his fear: he dreads hearing his name called by the wall.

问：三味书屋的先生是谁？
答：寿镜吾先生
据：《从百草园到三味书屋》：三味书屋的先生是一个高而瘦的老人，叫寿镜吾，是本城极方正、质朴、博学的人。 || “From Hundred-Plant Garden”: the teacher of the Three-Flavour Study is Shou Jingwu, a tall thin old man, upright and learned.
错：藤野先生 || 藤野先生是作者在日本仙台学医时的老师。 || Mr Fujino taught him medicine in Sendai.
错：范爱农 || 范爱农是作者的朋友。 || Fan Ainong is his friend.
错：陈莲河 || 陈莲河是《父亲的病》里的医生。 || Chen Lianhe is the doctor in “My Father's Illness”.
验：从读书的场景对：先生读“铁如意，指挥倜傥”时摇头晃脑，这就是三味书屋里的寿先生。 || Check by the scene: the old man rocking his head over his verse is Mr Shou.

问：“我”问先生“怪哉”虫是怎么回事，先生怎样？
答：很不高兴，说不知道
据：《从百草园到三味书屋》：“我”问“怪哉”这虫是怎么回事，先生说“不知道！”，脸上还有怒色。 || “From Hundred-Plant Garden”: asked about the “strange” insect, the teacher says “I don't know!” and looks angry.
错：讲得清清楚楚 || 先生没有讲，只说不知道。 || he explains nothing.
错：让“我”去查书 || 先生没有让“我”查书。 || he does not send him to look it up.
错：夸“我”爱动脑筋 || 先生不高兴，并没有夸。 || he is displeased, not pleased.
验：从作者的领悟对：“我”才知道做学生是不该问这些事的，只要读书，可见先生对问题很反感。 || Check by the lesson he learns: pupils should not ask such things.

问：先生读书读得入神时，学生们在做什么？
答：有的偷偷玩，有的描画像
据：《从百草园到三味书屋》：先生读书入了神，学生们有的用纸糊盔甲套在指甲上做戏，“我”在描小说上的画像。 || “From Hundred-Plant Garden”: while the teacher is rapt, some pupils play with paper armour on their fingernails, and he traces pictures from novels.
错：都认真跟着朗读 || 先生入神时，学生们就偷偷玩起来了。 || once he is rapt, they stop reading.
错：全都趴着睡着了 || 书里没有全睡着。 || no one is asleep.
错：都跑到后园去了 || 学生在书屋里玩，没跑到后园。 || they play at their desks, not in the garden.
验：从“我”描的画对：“我”描成了一大本《荡寇志》和《西游记》的绣像，正是在这些时候。 || Check by his tracings: a whole volume of illustrations from Water Margin's sequel and Journey to the West.

问：《父亲的病》中，陈莲河开的奇特药引是什么？
答：原配的一对蟋蟀
据：《父亲的病》：陈莲河开的药引是“蟋蟀一对”，还注明要“原配”，即本在一窠中的。 || “My Father's Illness”: Chen Lianhe prescribes a pair of crickets, and they must be an original married pair from one nest.
错：一对活的老鼠 || 书里没有用老鼠做药引。 || no mice are prescribed.
错：三年的老酒 || “经霜三年的甘蔗”是前一位名医开的，不是老酒。 || it was three-year frosted sugar cane, from the earlier doctor, not old wine.
错：新鲜的鱼头 || 书里没有鱼头。 || there is no fish head.
验：从作者的讽刺对：他说昆虫也要贞节，续弦再娶的连做药资格也丧失了，正是在讽刺“原配蟋蟀”。 || Check by his mockery: even insects must be chaste to qualify as medicine.

问：父亲临终时，衍太太让“我”做什么？
答：大声叫喊父亲
据：《父亲的病》：父亲临终时，衍太太叫“我”大声叫喊父亲，说这样他才不会走。 || “My Father's Illness”: as his father dies, Mrs Yan tells him to call out loudly to keep him.
错：给父亲喂药 || 书里不是喂药。 || not to give medicine.
错：去请医生 || 医生已经不来了，没让“我”去请。 || the doctor has stopped coming.
错：为父亲念经 || 书里不是念经。 || not to chant sutras.
验：从下一题对：作者后来最后悔的就是这一声声喊叫，正说明衍太太叫他做的是喊。 || Check by his remorse: the cries are what he regrets.

问：作者后来为什么把叫喊父亲看作自己最大的错处？
答：让父亲不能安静地离世
据：《父亲的病》结尾：“我”的叫喊让父亲不能安静地死去，作者说这是对父亲最大的错处。 || “My Father's Illness”, the end: his shouts deny his father a quiet death; he calls it his greatest wrong.
错：没有请到好医生 || 请医生不是他的错处，是庸医误了父亲。 || the doctors failed, not he.
错：没有按时给父亲吃药 || 书里没有写这件事。 || that is not in the essay.
错：没有听清父亲的遗言 || 父亲已说不出遗言，叫喊打扰了他。 || his father could say nothing; the shouting troubled him.
验：从父亲最后的话对：父亲说“什么呢？……不要嚷……”，可见叫喊让他不得安静。 || Check by his father's last words: “What?... Don't shout...”

问：《父亲的病》主要批判了什么？
答：庸医误人
据：《父亲的病》：两位“名医”开奇特的药引、败鼓皮丸，耽误了病情，作者讽刺了庸医误人。 || “My Father's Illness”: the two famous doctors with their strange ingredients and drum-skin pills let the illness run; he mocks quacks.
错：父亲脾气太坏 || 书里批判的不是父亲。 || the target is not his father.
错：中药价钱太贵 || 药钱贵只是一面，主要是医生无用还误人。 || the cost is one thing; the doctors' harm is the point.
错：亲戚不肯帮忙 || 书里没写亲戚不帮忙。 || relatives' help is not the issue.
验：从陈莲河最后的话对：药无效时他说“可以请人看一看，可有什么冤愆”，把病推给鬼神，正是庸医。 || Check by his last advice: he blames some past sin, a quack's way out.

问：《琐记》中的衍太太是个怎样的人？
答：表面和善，暗中使坏
据：《琐记》：衍太太对孩子们很和善，让他们吃冰、打旋子，却又挑唆“我”偷母亲的首饰，背后散布流言。 || “Trivia”: Mrs Yan is all kindness to children, letting them eat ice and spin, yet she urges him to take his mother's jewels and spreads tales behind his back.
错：一直真心关爱“我” || 她是暗中使坏，不是真心关爱。 || she is malicious beneath, not truly kind.
错：脾气暴躁，常常打人 || 书里她对孩子总是笑脸，不打人。 || she always smiles at children.
错：学问很深，爱教孩子 || 书里没写她学问深、爱教孩子。 || she is no scholar.
验：从《父亲的病》对：父亲临终时让“我”叫喊的也是衍太太，前后对照，更见她的为人。 || Check by “My Father's Illness”: it was she who made him shout.

问：衍太太在背后散布了什么流言？
答：说“我”偷家里东西去卖
据：《琐记》：不久就听到流言，说“我”已经偷了家里的东西去变卖了。 || “Trivia”: soon he hears the rumour that he has been stealing family things to sell.
错：说“我”考试作弊 || 书里没有考试作弊的流言。 || there is no rumour of cheating.
错：说“我”打了别人 || 书里没有打人的流言。 || no rumour of fighting.
错：说“我”不爱读书 || 流言说的是偷东西，不是不读书。 || the tale is of theft, not idleness.
验：从他的反应对：这流言让他觉得像掉进冷水里，决心离开家乡，“走异路，逃异地”。 || Check by his response: he resolves to leave home.

问：离开家乡后，“我”在南京进的第一所学堂是什么？
答：江南水师学堂
据：《琐记》：“我”到南京，先进了江南水师学堂，后来改进矿务铁路学堂。 || “Trivia”: in Nanjing he first enters the Jiangnan Naval Academy, then the School of Mines and Railways.
错：仙台医学专门学校 || 仙台医学专门学校是后来去日本读的。 || the Sendai medical school comes later, in Japan.
错：三味书屋 || 三味书屋是家乡的私塾。 || the Three-Flavour Study is his home school.
错：东京弘文学院 || 东京弘文学院也是去日本以后。 || the Kobun Institute in Tokyo is also later.
验：从他的行程对：先离开绍兴到南京，再从南京毕业去日本，第一所学堂一定在南京。 || Check by his route: Shaoxing, Nanjing, then Japan.

问：在南京读书时，“我”热心读的新书是哪一本？
答：《天演论》
据：《琐记》：在南京时“我”看到了严复译的《天演论》，一有空闲就读。 || “Trivia”: in Nanjing he finds Yan Fu's translation of Evolution and Ethics and reads it at every spare moment.
错：《山海经》 || 《山海经》是童年阿长买的。 || the Classic of Mountains and Seas was Ah Chang's gift in childhood.
错：《鉴略》 || 《鉴略》是童年父亲要他背的。 || the Brief Mirror was his childhood task.
错：《花镜》 || 《花镜》是童年自己买的。 || the Mirror of Flowers he bought as a boy.
验：从“新书”对：只有《天演论》是外国新学说的译本，其他三本都是旧书。 || Check by “new”: only Evolution and Ethics is a translation of new learning.

问：藤野先生为“我”做了什么？
答：用红笔修改“我”的讲义
据：《藤野先生》：藤野先生把“我”的讲义拿去，用红笔从头到尾添改了，连文法错误也订正了。 || “Mr Fujino”: he takes the notes and corrects them in red from first to last, even the grammar.
错：替“我”交了学费 || 书里没写他替“我”交学费。 || he pays no fees.
错：帮“我”找到住处 || 书里写的是替“我”改讲义，不是找住处。 || he corrects notes; he finds no lodging.
错：教“我”说日语 || 书里没写他教日语。 || he does not teach Japanese.
验：从“我”保存讲义对：作者把这些讲义订成三厚本收藏着，可见讲义上的红笔最让他感动。 || Check by what he kept: the corrected notes bound in three volumes.

问：藤野先生纠正过“我”画错的什么图？
答：下臂的血管图
据：《藤野先生》：藤野先生指出“我”画的下臂血管移了位置，说解剖图不是美术。 || “Mr Fujino”: he points out that the drawing of the forearm's blood vessels is out of place; anatomy is not art.
错：人的头骨图 || 书里不是头骨图。 || not the skull.
错：心脏的图 || 书里不是心脏图。 || not the heart.
错：眼睛的图 || 书里不是眼睛图。 || not the eye.
验：从“我”的不服对：“我”心里说图还是我画得不错，说明错的正是画得好看却挪了位置的血管。 || Check by his inner protest: he thought his drawing looked better.

问：一些日本学生为什么怀疑“我”的考试成绩？
答：以为老师泄露了考题
据：《藤野先生》：一些日本学生以为藤野先生在讲义上做了记号，把考题泄露给“我”，还写匿名信。 || “Mr Fujino”: some students think Fujino marked the questions in the notes for him, and send an anonymous letter.
错：以为“我”偷了讲义 || 书里不是偷讲义。 || not theft of notes.
错：以为“我”没交学费 || 书里没有学费的事。 || nothing about fees.
错：以为“我”请人代考 || 书里不是代考。 || not a stand-in.
验：从他们的理由对：“中国是弱国，所以中国人当然是低能儿”，这正是他们怀疑的根源。 || Check by their reasoning: a weak nation, so its people must be dull.

问：看了那段时事画片以后，“我”作出了什么决定？
答：弃医从文
据：《藤野先生》：看到画片里中国人围观同胞被杀，神情麻木，“我”决定不学医了，改从文艺。 || “Mr Fujino”: seeing Chinese onlookers stare dully at a compatriot's execution, he gives up medicine for literature.
错：继续学医 || 他离开仙台就是不再学医。 || he leaves Sendai to give up medicine.
错：回国参军 || 书里没有参军。 || he does not join the army.
错：留在日本教书 || 他回国了，不是留在日本教书。 || he does not stay to teach.
验：从他的道理对：他说愚弱的国民，体格再健壮也只能做示众的材料，所以要改变精神，就离开了仙台。 || Check by his reason: to change the spirit, not the body.

问：“我”和范爱农第一次相见是在哪里？
答：日本东京
据：《范爱农》：在东京的同乡会上，“我”和范爱农为给徐锡麟发电报的事争执，书中两人的交往从这里开始（文中说更早在横滨码头见过一面）。 || “Fan Ainong”: at a meeting in Tokyo the two argue over a telegram about Xu Xilin; their friendship in the book begins there, though he recalls glimpsing Fan earlier at the Yokohama docks.
错：日本仙台 || 仙台是作者学医的地方，没有遇到范爱农。 || Sendai is where he studied medicine; Fan is not there.
错：南京 || 南京是作者读书的地方，不是相识处。 || Nanjing is where he studied, not where they met.
错：绍兴 || 绍兴是后来重逢的地方。 || Shaoxing is where they meet again later.
验：从后来重逢对：辛亥前后两人在绍兴重逢，范爱农说起在东京时就讨厌“我”，可见是在日本认识的。 || Check by their reunion: in Shaoxing Fan admits he disliked him back in Tokyo.

问：范爱农是一个怎样的人？
答：正直倔强，不肯随波逐流
据：《范爱农》：范爱农看不惯革命后的投机者，不肯随波逐流，宁愿穷困。 || “Fan Ainong”: he scorns the opportunists after the revolution and refuses to go with the tide, though it leaves him poor.
错：圆滑世故，善于讨好 || 他正直倔强，最不会讨好人。 || he is the least ingratiating of men.
错：胆小怕事，从不说话 || 他敢说话，在同乡会上就和人争。 || he speaks out, as at the Tokyo meeting.
错：贪图名利，爱当大官 || 他不贪名利，最后穷困潦倒。 || he cares nothing for gain and dies poor.
验：从他的遭遇对：因为不肯迎合，他被排挤出学校，四处碰壁，正见出他的正直倔强。 || Check by his fate: forced out of the school for refusing to bend.

问：范爱农最后怎样了？
答：落水而死
据：《范爱农》结尾：范爱农穷困潦倒，一次喝醉后坐船落水而死。 || “Fan Ainong”, the end: poor and adrift, he falls from a boat after drinking and drowns.
错：病死在家中 || 他是落水死的，不是病死。 || he drowns; he does not die of illness.
错：去日本留学 || 他没有再去日本。 || he does not return to Japan.
错：当上了校长 || 他被排挤出学校，没当上校长。 || he is forced out, not made principal.
验：从作者的怀疑对：作者说至今不知道他是失足还是自杀，可见他是落水死的。 || Check by the author's doubt: he never learns whether it was a slip or suicide.
`,
  },
  {
    id: "twenty-thousand-leagues",
    grade: 7,
    title: { en: "Twenty Thousand Leagues Under the Seas", zh: "海底两万里" },
    author: { en: "Jules Verne", zh: "凡尔纳" },
    guide: {
      en: "This is a science-fiction novel told in the first person by Professor Aronnax, so everything is seen through a scientist's eyes. Follow the voyage on a map, marking where the Nautilus goes and what happens there; it circles much of the world's oceans in about ten months. Keep a note on each of the four main people: the professor, his servant Conseil, the harpooner Ned Land and Captain Nemo, and how each feels about life aboard. Ask what science the book uses, what it imagined that later came true, and what kind of man Nemo is: why he has left the land, and whom he helps and whom he fights.",
      zh: "这是一部科幻小说，由阿龙纳斯教授用第一人称讲述，所以书里的一切都是从一位科学家的眼中看到的。可以对着地图读，标出鹦鹉螺号到过哪里、在那里发生了什么；它用大约十个月走遍了世界上的许多大洋。为四个主要人物各做一份笔记：教授、他的仆人康塞尔、捕鲸手尼德·兰和尼摩船长，记下每个人对船上生活的态度。想一想：书里用到了哪些科学知识，书中想象的哪些东西后来成了真；尼摩船长是一个什么样的人，他为什么离开陆地，他帮助谁，又和谁作对。",
    },
    callout: {
      en: "The Nautilus visits many seas, and the narrator, Ned Land and Conseil see each wonder differently. Place the question in its stretch of the voyage, and ask whose view it is, before you choose.",
      zh: "鹦鹉螺号去过许多海域，阿龙纳斯、尼德·兰和康塞尔对同一件事的看法也不一样。选之前先想清楚问的是航行的哪一段，又是谁的看法。",
    },
    questions: `
问：《海底两万里》的作者凡尔纳是哪个国家的人？
答：法国
据：作者：儒勒·凡尔纳是法国作家，1870年出版了这部小说。 || The author: Jules Verne was French and published the novel in 1870.
错：英国 || 英国作家写的是《鲁滨逊漂流记》（笛福）这类书，凡尔纳不是英国人。 || Verne was not English; Defoe, who wrote Robinson Crusoe, was.
错：美国 || 凡尔纳不是美国人，林肯号才是美国军舰。 || Verne was not American; it is the frigate Abraham Lincoln that is American.
错：德国 || 凡尔纳不是德国人。 || Verne was not German.
验：从叙述者对：讲故事的阿龙纳斯是巴黎自然史博物馆的教授，主人公和作者一样是法国人。 || Check by the narrator: Aronnax is a professor at the Paris Museum, French like his author.

问：《海底两万里》属于哪一类作品？
答：科幻小说
据：全书：凡尔纳用当时的科学知识想象出一艘能环游海底的潜水艇，这是科幻小说。 || The book as a whole: Verne uses the science of his day to imagine a submarine that tours the ocean floor; it is science fiction.
错：童话 || 书里没有神仙和会说话的动物，不是童话。 || there are no fairies or talking beasts; it is no fairy tale.
错：历史小说 || 故事是想象的，不是写历史上的事。 || it is imagined, not history.
错：游记散文 || 它有完整的情节和人物，不是游记散文。 || it has plot and characters; it is no travel essay.
验：从“鹦鹉螺号”对：书中的潜艇在当时还造不出来，作者是根据科学道理设想的，这正是科幻的特点。 || Check by the Nautilus: no such submarine existed, but it was imagined on scientific grounds.

问：这部小说是由谁讲述的？
答：阿龙纳斯教授，用第一人称“我”讲述
据：全书：故事由法国生物学家阿龙纳斯教授用“我”来讲，记下他在鹦鹉螺号上的十个月。 || The book as a whole: Professor Aronnax tells it as “I”, recording his ten months aboard.
错：尼摩船长，用第一人称“我”讲述 || 尼摩船长是被讲述的人物，他的来历要读者跟着“我”慢慢猜。 || Nemo is the one told about; his story we guess through the narrator's eyes.
错：捕鲸手尼德·兰，用第一人称“我”讲述 || 尼德·兰一直想逃走，他不是讲故事的人。 || Ned Land, always plotting escape, is not the narrator.
错：作者用第三人称讲述，书中没有“我” || 书中有“我”，就是阿龙纳斯教授。 || there is an “I”: Aronnax.
验：从结尾对：最后“我”在挪威渔民小屋里醒来，说要把这十个月的经历写下来，就是这本书。 || Check by the end: waking in Norway, he resolves to write down these ten months.

问：故事开始时，人们以为海上那个撞坏船只的东西是什么？
答：一头巨大的海怪，有人认为是独角鲸
据：第一部开头：1866年海上屡次有船被不明的东西撞坏，许多人认为是一头巨大的海怪，阿龙纳斯推测是一头巨型独角鲸。 || Part 1, the opening: in 1866 ships are struck by something unknown; most think it a sea monster, and Aronnax supposes a giant narwhal.
错：一座会移动的冰山 || 冰山不会快速移动、追着船撞。 || no iceberg moves so fast or chases ships.
错：一艘敌国的军舰 || 书里起初没有人说是军舰，后来才知道是潜艇。 || no one thinks it a warship; it proves to be a submarine.
错：一块漂浮的礁石 || 礁石不会移动，而这个东西会在不同的海域出现。 || a reef cannot move, and this thing appears in many seas.
验：从林肯号出海对：美国派军舰去追捕的是“海怪”，船上还请了捕鲸手，可见大家把它当成了动物。 || Check by the hunt: a frigate with a harpooner goes after a beast.

问：阿龙纳斯教授为什么登上林肯号？
答：受邀随舰出海，追捕那头“海怪”
据：第一部前几章：美国组织林肯号去追捕海怪，邀请正在纽约的阿龙纳斯教授随舰出海。 || Part 1, early chapters: the Abraham Lincoln is sent to hunt the monster and invites Aronnax, then in New York, to sail with it.
错：要去南极考察冰川 || 书里没有去南极考察冰川，南极是后来乘鹦鹉螺号去的。 || there is no glacier survey; he reaches the pole later, on the Nautilus.
错：要去美国大学讲课 || 他在纽约是刚考察完回来，并没有去讲课。 || he is back in New York from an expedition, not lecturing.
错：被海盗抓上了船 || 他是受邀上船的，没有海盗。 || he is invited; there are no pirates.
验：从他的身份对：他是研究海洋生物的专家，又写过关于海底的书，人们才请他去辨认海怪。 || Check by who he is: an expert on sea creatures, asked to identify the beast.

问：阿龙纳斯教授的仆人康塞尔有什么特点？
答：忠心耿耿，热衷于给生物分类
据：书中多处：康塞尔是阿龙纳斯的仆人，对主人忠心耿耿，最爱给见到的生物分门别类。 || Throughout: Conseil is Aronnax's servant, utterly loyal and devoted to classifying every creature he sees.
错：脾气急躁，一心想逃走 || 急着逃走的是尼德·兰。 || Ned Land is the one desperate to escape.
错：胆小怕事，常常抱怨 || 康塞尔从不抱怨，主人去哪儿他都跟着。 || Conseil never complains and follows his master anywhere.
错：精通航海，负责驾驶潜艇 || 驾驶潜艇的是尼摩船长和船员。 || the crew and Nemo pilot the submarine.
验：从冰下缺氧的情节对：他把最后的空气让给主人，正是忠心的证明。 || Check by the air shortage: he gives his master the last air.

问：尼德·兰是做什么的？
答：加拿大的捕鲸手，擅长使用鱼叉
据：第一部：尼德·兰是加拿大人，林肯号上的捕鲸手，鱼叉用得最准。 || Part 1: Ned Land is a Canadian harpooner aboard the Lincoln, unmatched with the harpoon.
错：法国的生物学家 || 法国生物学家是阿龙纳斯。 || the French naturalist is Aronnax.
错：鹦鹉螺号上的大副 || 他不是鹦鹉螺号的船员，而是被困在船上的人。 || he is no crewman of the Nautilus but a captive.
错：林肯号的舰长 || 林肯号的舰长是法拉格特。 || the Lincoln's captain is Farragut.
验：从他对海怪出手对：林肯号追上“海怪”时，是他投出鱼叉，打在坚硬的铁壳上。 || Check by his throw: his harpoon strikes the creature's iron hide.

问：三个人是怎样来到鹦鹉螺号上的？
答：林肯号被撞，他们落入海中，爬到了“海怪”的背上，才发现它是一艘潜艇
据：第一部第七章：林肯号被撞，教授和康塞尔落水，尼德·兰也在水里，他们爬上“海怪”的背，才发现那是钢铁做的潜艇。 || Part 1, chapter 7: when the Lincoln is rammed, Aronnax and Conseil fall into the sea, Ned with them, and they climb onto the monster's back to find it is steel.
错：他们乘小船追到海怪身边，主动敲门请求上船 || 他们是落水后碰上的，没有乘小船去敲门。 || they reach it adrift in the water, not by boat.
错：尼摩船长到港口邀请他们一起出海 || 尼摩船长没有邀请他们，是把他们当俘虏关起来。 || Nemo invites no one; he locks them up as prisoners.
错：他们在海边散步时被潜艇上的人绑架 || 书里没有在海边被绑架。 || no one is kidnapped from a beach.
验：从尼摩的态度对：他说他们是不请自来，本可以不管，后来只准他们留在船上不许离开，正因为是意外登船。 || Check by Nemo's view: they came uninvited, and may stay but never leave.

问：鹦鹉螺号靠什么作为动力？
答：电
据：第一部：尼摩船长向教授介绍，鹦鹉螺号的一切，开动、照明、取暖，都靠电。 || Part 1: Nemo tells the professor that everything aboard, motion, light and heat, runs on electricity.
错：蒸汽 || 书里特别说明不用蒸汽，那是当时一般轮船的动力。 || the book stresses it is not steam, the power of ordinary ships.
错：风帆 || 潜艇在水下，不能用风帆。 || a submarine under water cannot use sails.
错：人力划桨 || 书里没有划桨。 || no one rows.
验：从他取电的办法对：他从海水里提取钠来制电池，不用靠岸补煤，所以能一直在海底航行。 || Check by his batteries: made with sodium from seawater, they need no port.

问：尼摩船长给鹦鹉螺号的船员们定下的生活方式是怎样的？
答：一切都取自大海，很少踏上陆地
据：第一部：尼摩船长说大海供给他一切，食物、衣料都取自海里，他和船员很少踏上陆地。 || Part 1: Nemo says the sea supplies everything, food and cloth alike; he and his crew rarely touch land.
错：每个月都靠岸采购食物 || 他们不靠岸采购，靠海里的东西生活。 || they buy nothing ashore.
错：船员轮流上岸探亲 || 船员不上岸探亲，他们和陆地断绝了关系。 || the crew have broken with the land.
错：只在白天航行，夜里停靠港口 || 鹦鹉螺号日夜都在航行。 || the Nautilus sails day and night.
验：从教授吃的饭对：他第一顿饭吃到的“肉”其实是海龟、海豚，连烟也是海藻做的，可见一切取自大海。 || Check by the meals: the “meat” is turtle and dolphin, even the cigars are seaweed.

问：鹦鹉螺号上有一间特别的屋子，让阿龙纳斯教授十分惊叹，里面有什么？
答：藏书上万册的图书室和摆满珍品的客厅
据：第一部：船上有藏书一万二千册的图书室，还有挂着名画、摆满海洋珍品的大客厅。 || Part 1: aboard is a library of twelve thousand volumes and a salon hung with paintings and filled with treasures of the sea.
错：关押俘虏的牢房 || 书里没有牢房，三人住在船舱里。 || there is no prison; the three have cabins.
错：饲养家禽的农场 || 船上的食物都来自海里，没有养家禽。 || all food is from the sea; there are no poultry.
错：存放武器的军火库 || 船上有武器，但让教授惊叹的是图书室和客厅。 || there are arms, but it is the library and salon that amaze him.
验：从尼摩的说法对：他说这些书是他和陆地唯一的联系，离开陆地那天起就不再买书了。 || Check by Nemo's words: the books are his last tie to the land.

问：教授他们在克利斯波岛附近的海底做了什么？
答：穿着潜水服，在海底森林里打猎
据：第一部：尼摩船长邀请教授他们穿潜水服，到克利斯波岛的海底森林里打猎。 || Part 1: Nemo invites them to put on diving suits and hunt in the undersea forest of Crespo Island.
错：在岛上建了一座房子 || 他们没有在岛上建房。 || they build nothing on the island.
错：在海底种了一片庄稼 || 海底没有种庄稼。 || they grow no crops.
错：在岛上发现了一座古城 || 发现古城遗迹是后来在大西洋海底的事。 || the ruined city comes later, under the Atlantic.
验：从尼德·兰起初的高兴对：他一听“打猎”就想到陆上的森林，结果是海底森林，可见活动正是在海底打猎。 || Check by Ned's mistake: he thinks “hunt” means a forest ashore, but it is under the sea.

问：鹦鹉螺号在托雷斯海峡搁浅时，岛上的土著人围攻它，尼摩船长用什么办法赶走了他们？
答：让舷梯的栏杆通上电，碰到的人都被电退
据：第一部：鹦鹉螺号在托雷斯海峡搁浅，土著人围上来，尼摩船长让舷梯的扶手通上电，碰到的人被电得逃走。 || Part 1: aground in the Torres Strait, the Nautilus is mobbed by islanders; Nemo electrifies the ladder rail and those who touch it flee.
错：开炮把他们打跑 || 尼摩不愿伤人，没有开炮。 || Nemo will not kill them; he fires no gun.
错：送给他们很多金子 || 书里没有送金子。 || he gives no gold.
错：等到天黑悄悄逃走 || 他们没有逃，后来涨潮时船才浮起来。 || they do not slip away; the tide lifts the ship later.
验：从尼摩的为人对：他同情这些土著，只用电把他们吓退，不伤性命，这和他同情弱者的性格一致。 || Check by his nature: he only drives them off, sparing their lives.

问：在锡兰岛附近的采珠场，尼摩船长做了一件什么事？
答：从鲨鱼口中救下一个穷苦的采珠人，还送给他一袋珍珠
据：第二部：在锡兰岛的采珠场，尼摩船长从鲨鱼口中救下一个印度采珠人，还送给他一袋珍珠。 || Part 2: at the Ceylon pearl beds, Nemo saves an Indian diver from a shark and gives him a bag of pearls.
错：抢走了采珠人的珍珠 || 他没有抢珍珠，反而送了珍珠。 || he steals no pearls; he gives them.
错：雇用采珠人到船上做工 || 他没有雇用采珠人。 || he hires no one.
错：教采珠人怎样驾驶潜艇 || 他没有教人驾驶潜艇，鹦鹉螺号的秘密从不外传。 || he teaches no one; the Nautilus's secret is kept.
验：从他的话对：他说这个采珠人是被压迫国家的人，他自己也属于那个国家，可见他同情穷苦的人。 || Check by his words: the diver belongs to an oppressed land, as he does.

问：鹦鹉螺号是怎样从红海到达地中海的？
答：穿过一条海底下的隧道
据：第二部：苏伊士运河还没有修通，尼摩船长从他发现的“阿拉伯隧道”，从红海海底穿到地中海。 || Part 2: the Suez Canal is not yet open, so Nemo takes the Arabian Tunnel he found, under the land from the Red Sea to the Mediterranean.
错：从苏伊士运河的水面上开过去 || 故事发生在1868年，苏伊士运河1869年才开通。 || the story is set in 1868, and the canal opened in 1869.
错：绕过整个非洲大陆 || 他们几天就到了地中海，没有绕非洲。 || they reach the Mediterranean in days, not by rounding Africa.
错：被大船拖着走陆路运过去 || 潜艇从没被拖上陆地。 || the submarine never goes overland.
验：从尼德·兰的怀疑对：他不相信能从红海到地中海，结果第二天就到了，正说明走的是海底隧道。 || Check by Ned's disbelief: he scoffs, and next day they are through.

问：在维哥湾海底，教授看到了什么？
答：古代沉船里的大量金银财宝，船员们正在打捞
据：第二部：在西班牙维哥湾海底，教授看到古代西班牙沉船里的金银财宝，船员们正在打捞。 || Part 2: in Vigo Bay, Spain, he sees the treasure of sunken galleons and the crew gathering it.
错：一座海底火山正在喷发 || 书里没有在维哥湾看到火山。 || there is no volcano in Vigo Bay.
错：一群正在产卵的大鲸鱼 || 书里没写鲸鱼产卵。 || no whales are spawning.
错：一座传说中的海底宫殿 || 那是真实的沉船，不是传说中的宫殿。 || it is real wreckage, not a legendary palace.
验：从下一件事对：尼摩说他用这些财宝帮助受压迫的人，前后连起来正说明他在打捞财宝。 || Check by what follows: Nemo says the treasure goes to the oppressed.

问：尼摩船长把从海底打捞的财宝用在了哪里？
答：援助为自由而斗争的被压迫的人们
据：第二部：尼摩船长说他打捞的财宝是为了援助世界上为自由而斗争的被压迫的人们。 || Part 2: Nemo says his treasure goes to the oppressed who fight for freedom.
错：全部藏在船上自己享用 || 他自己过得很简朴，不是为了享用。 || he lives simply; it is not for himself.
错：用来买一座小岛当国王 || 他不想当国王，他远离陆地。 || he seeks no throne; he shuns the land.
错：交给了林肯号的舰长 || 林肯号早就失散了。 || the Lincoln is long gone.
验：从克里特岛的情节对：他曾把一大箱金子交给从克里特岛来的潜水人，那里正有人起义争取独立。 || Check by Crete: he sends a chest of gold to a diver from Crete, where a rising is under way.

问：教授在海底见到了传说中哪块大陆的遗迹？
答：大西洲
据：第二部：尼摩船长带教授在海底走到火山旁，看到了传说中沉没的大西洲的遗迹。 || Part 2: Nemo leads him across the sea floor to a volcano, and he sees the ruins of sunken Atlantis.
错：南极洲 || 南极洲是他们后来到达的，那里不是遗迹。 || Antarctica they reach later; it is no ruin.
错：澳大利亚 || 澳大利亚是现存的大陆。 || Australia is a living continent.
错：新大陆 || 新大陆指美洲，不是沉没的大陆。 || the New World is America, not a sunken land.
验：从尼摩在石头上写的字对：他在岩石上写下“大西洲”，让教授知道这是哪里。 || Check by the word Nemo chalks on the rock: Atlantis.

问：在南极，尼摩船长做了一件什么事？
答：在南极点插上了一面绣着字母“N”的黑旗
据：第二部：1868年3月21日，尼摩船长到达南极点，插上一面绣着金色字母“N”的黑旗。 || Part 2: on 21 March 1868 Nemo reaches the South Pole and plants a black flag with a gold N.
错：在冰上建立了一座科学考察站 || 书里没有建考察站。 || there is no research station.
错：找到了一艘失踪多年的探险船 || 书里没有找到失踪的探险船。 || no lost ship is found.
错：把船员们留在南极过冬 || 他们很快离开南极，没有留下过冬。 || they leave quickly; no one winters there.
验：从“N”对：N是尼摩名字的第一个字母，他宣布南极属于自己。 || Check by the N: Nemo's initial, claiming the pole.

问：离开南极时，鹦鹉螺号遇到了什么危险？
答：被困在冰层下，空气越来越少，大家轮流凿冰才逃出来
据：第二部：离开南极时，一座冰山翻倒，鹦鹉螺号被困在冰层下，空气越来越少，大家轮流凿冰才逃出来。 || Part 2: leaving the pole, an iceberg overturns and traps the Nautilus beneath the ice; air runs short and all take turns cutting through.
错：被一群鲨鱼咬破了船壳 || 在冰下遇险，不是鲨鱼。 || the danger is the ice, not sharks.
错：遇上了海底火山爆发 || 书里海底火山是在大西洲那里，不是在南极。 || the volcano is at Atlantis, not the pole.
错：被一艘军舰的炮弹击中 || 被军舰炮击是后来在大西洋上的事。 || the shelling comes later, in the Atlantic.
验：从下一题对：康塞尔和尼德·兰把空气让给教授，正因为困在冰下缺氧。 || Check by what follows: the others give him air because there is none.

问：被困在冰下时，康塞尔和尼德·兰把什么让给了教授？
答：储气罐里剩下的空气
据：第二部：困在冰下时，康塞尔和尼德·兰把储气罐里剩下的一点空气让给了教授。 || Part 2: under the ice, Conseil and Ned give the professor the last air in the reservoirs.
错：最后一点淡水 || 缺的是空气，不是水。 || it is air they lack, not water.
错：唯一一件潜水服 || 潜水服船上有很多，缺的是空气。 || there are many diving suits; air is what is short.
错：船上最后一顿饭 || 缺的不是饭，是空气。 || it is not food.
验：从教授醒来对：他说自己是靠他们让出的空气才活下来的，对两个伙伴非常感激。 || Check by his gratitude: he lives on the air they gave.

问：鹦鹉螺号在大西洋上遭到什么海洋动物的袭击？
答：一群巨大的章鱼
据：第二部：在大西洋上，一群巨大的章鱼（大王乌贼）缠住了鹦鹉螺号。 || Part 2: in the Atlantic, giant squid seize the Nautilus.
错：一群凶猛的鲨鱼 || 书里不是鲨鱼群袭击。 || not sharks.
错：一头愤怒的抹香鲸 || 抹香鲸是鹦鹉螺号在南方海域主动攻击的对象，不是来袭击它的。 || sperm whales are what the Nautilus itself attacks in southern waters; they do not attack it.
错：一大群海豚 || 海豚不会袭击潜艇。 || dolphins attack no submarine.
验：从搏斗的情节对：船员们拿斧头砍断章鱼的长腕，正是和章鱼搏斗。 || Check by the fight: the crew hack at its arms with axes.

问：一位船员在与大章鱼的搏斗中死去，尼摩船长的反应是什么？
答：悲痛地流下了眼泪
据：第二部：一个船员被章鱼卷走，尼摩船长望着大海，悲痛地流下了眼泪。 || Part 2: when a crewman is snatched by a squid, Nemo looks at the sea and weeps.
错：很快就把这件事忘了 || 他十分悲痛，没有忘掉。 || he grieves; he does not forget.
错：责怪船员太不小心 || 书里没有责怪船员。 || he blames no one.
错：下令立刻返回陆地 || 他不回陆地，他和陆地断绝了关系。 || he never goes back to land.
验：从他对船员的感情对：之前有船员受伤死去，他也亲自安葬，可见他把船员当亲人。 || Check by the burial: he buried another man himself.

问：在太平洋上，一位受伤死去的船员被安葬在哪里？
答：海底的珊瑚墓地
据：第一部：一位受伤的船员死了，尼摩船长带大家把他安葬在海底的珊瑚墓地里。 || Part 1: when a wounded crewman dies, Nemo buries him in a coral cemetery on the sea floor.
错：一座无人的小岛上 || 他们不上陆地，不葬在岛上。 || they shun land and bury no one on an island.
错：南极的冰原下 || 到南极是后来的事。 || the pole comes later.
错：船上的一间小屋里 || 书里是葬在海底，不在船上。 || he is buried in the sea, not kept aboard.
验：从尼摩的话对：他说死者在这里能躲开鲨鱼，也躲开了人，大海是他们唯一的家。 || Check by Nemo's words: there they are safe from sharks and men.

问：尼摩船长的格言“动中之动”，表达了他怎样的想法？
答：在不停流动的大海里过自由的生活
据：第一部：鹦鹉螺号上到处写着“Mobilis in mobili”，意思是在流动的大海里自由运动。 || Part 1: “Mobilis in mobili”, moving in the moving element, is written all over the Nautilus.
错：做事要快，不能停下来 || 格言说的是生活方式，不是做事快慢。 || it speaks of a way of life, not of speed.
错：要不停地追捕海里的动物 || 他打猎只为生活，格言不是讲追捕。 || it is not about hunting.
错：船要不停地开，不能修理 || 鹦鹉螺号也要修理和停泊，格言不是这个意思。 || the Nautilus is repaired and stops; that is not the meaning.
验：从他的生活对：他远离陆地上的压迫，在大海里来去自由，正是“动中之动”。 || Check by his life: free on the sea, far from the land's tyrants.

问：从全书看，尼摩船长是一个怎样的人？
答：学识渊博、神秘孤僻，痛恨压迫、同情被压迫的人
据：全书：尼摩船长学识渊博，远离人群，痛恨压迫，又同情和帮助被压迫的人。 || The book as a whole: Nemo is learned and solitary, hates oppression and helps the oppressed.
错：贪财好利，专门抢劫过往的商船 || 他把财宝送给受压迫的人，不是抢劫商船。 || he gives his treasure away; he robs no merchantmen.
错：胆小怕事，从不和人发生冲突 || 他敢于与军舰作战，并不胆小。 || he fights warships; he is no coward.
错：热爱陆地，一心想回到家乡 || 他和陆地断绝了关系，并不想回去。 || he has broken with the land.
验：从他攻击军舰的情节对：他痛恨的那个国家派来军舰，他把它撞沉，可见他心里有深仇。 || Check by the warship: he sinks a ship of the nation he hates.

问：尼德·兰一直想做的是什么？
答：离开鹦鹉螺号，回到陆地上
据：全书：尼德·兰一直想逃离鹦鹉螺号，回到陆地上。 || The book as a whole: Ned Land wants above all to escape and get back to land.
错：当上鹦鹉螺号的船长 || 他从没想当船长。 || he never wishes to command.
错：留在海底过一辈子 || 他最不愿意留在海底。 || staying under the sea is what he hates most.
错：去南极找宝藏 || 他不在乎宝藏，只想回家。 || he wants home, not treasure.
验：从结尾对：最后正是他发现机会，领着大家乘小艇逃走。 || Check by the end: it is he who seizes the chance to flee.

问：故事的结尾，三个人是怎样离开鹦鹉螺号的？
答：鹦鹉螺号卷进大漩涡时，他们乘小艇逃了出来
据：第二部结尾：鹦鹉螺号被卷进挪威海岸外的大漩涡，三人趁机乘小艇逃了出来。 || Part 2, the end: the Nautilus is drawn into the great maelstrom off Norway, and the three escape in its boat.
错：尼摩船长亲自把他们送上岸 || 尼摩没有送他们，他们是逃走的。 || Nemo does not release them; they flee.
错：一艘军舰把鹦鹉螺号俘虏了 || 鹦鹉螺号没有被俘。 || the Nautilus is never captured.
错：他们在南极下了船，走回了家 || 他们没有在南极下船。 || they do not land at the pole.
验：从他们醒来的地方对：他们醒在挪威渔民的小屋里，正是漩涡所在的海岸。 || Check by where they wake: a Norwegian fisherman's hut, by the maelstrom.

问：三个人醒来时在什么地方？
答：挪威海岸外一个岛上的渔民小屋里
据：第二部结尾：三人醒来时，在挪威罗弗敦群岛一个渔民的小屋里。 || Part 2, the end: they wake in a fisherman's hut on the Lofoten Islands of Norway.
错：林肯号的船舱里 || 林肯号早已失散。 || the Lincoln is long gone.
错：巴黎的博物馆里 || 他们还没回到巴黎。 || they are not yet in Paris.
错：南极的冰原上 || 他们早已离开南极。 || they left the pole long before.
验：从漩涡对：大漩涡在挪威海岸外，他们被冲上附近的岛，正好接上。 || Check by the maelstrom: it lies off Norway, and they wash up nearby.

问：这部小说里有哪些写法让它成为“科幻”小说？
答：用当时的科学知识，合理地想象出还没有的潜水艇和海底生活
据：全书：作者用当时的科学知识，合理地想象出还没有的潜水艇和海底生活。 || The book as a whole: Verne uses the science of his day to imagine a submarine and life under the sea.
错：书中的事全是作者亲身经历过的 || 这些都是想象的，作者没有亲身经历。 || it is imagined; Verne lived none of it.
错：故事里有会说话的动物和神仙 || 书里没有会说话的动物和神仙。 || there are no talking beasts or gods.
错：全书只介绍海洋生物的科学知识，没有情节 || 书里有完整的冒险情节。 || it has a full plot of adventure.
验：从后来的历史对：书出版几十年后，真正的潜水艇才普遍造出来，可见作者的想象是有科学根据的。 || Check by history: real submarines came decades later.
`,
  },
  {
    id: "insect-world",
    grade: 8,
    title: { en: "Souvenirs Entomologiques", zh: "昆虫记" },
    author: { en: "Jean-Henri Fabre", zh: "法布尔" },
    guide: {
      en: "Fabre writes as both a scientist and a storyteller: for each insect, note what he wanted to find out, how he watched or tested it, and what he concluded. Keep a table of the insects with where they live, what they eat, how they build or hunt, and one surprising fact. Notice how he compares insects to people, giving them feelings and characters, and ask whether this helps or misleads. Above all, watch his method: patience, repeated observation and simple experiments in the field rather than dead specimens.",
      zh: "法布尔既是科学家，又是讲故事的人：读每一种昆虫时，记下他想弄清什么问题、怎样观察或做实验、得出了什么结论。可以列一张表，写上每种昆虫住在哪儿、吃什么、怎样筑巢或捕猎，再加一个让你惊奇的发现。留意他常把昆虫比作人，写出它们的感情和性格，想一想这样写有什么好处，会不会让人误解。最重要的是学习他的方法：耐心，反复观察，在野外做简单的实验，而不是只看死去的标本。",
    },
    callout: {
      en: "Fabre describes many insects, and each has its own way of living. Place the question with its own insect before you choose: what the dung beetle does is not what the cicada or the mantis does.",
      zh: "法布尔写了很多昆虫，每种都有自己的生活方式。选之前先想清楚问的是哪一种：蜣螂做的事，不是蝉或螳螂做的事。",
    },
    questions: `
问：法布尔是哪个国家的人？
答：法国
据：作者生平：法布尔是法国昆虫学家，晚年住在法国南部的塞里尼昂，在那里写完了《昆虫记》。 || The author: Fabre was a French entomologist who spent his last decades at Sérignan in southern France, where he finished the book.
错：英国 || 法布尔不是英国人，英国的达尔文还写信称赞过他。 || Fabre was not English; it was the Englishman Darwin who praised him.
错：德国 || 法布尔不是德国人。 || he was not German.
错：意大利 || 法布尔不是意大利人。 || he was not Italian.
验：从《蝉》里的寓言对：他要纠正的是法国诗人拉封丹的《蝉和蚂蚁》，他写的正是法国乡间的蝉。 || Check by “The Cicada”: he corrects the French poet La Fontaine, about the cicadas of southern France.

问：法布尔主要用什么方法研究昆虫？
答：在野外长期观察和做实验
据：《荒石园》和全书：法布尔在野外和自家园子里一连多年观察活的昆虫，还设计实验来验证。 || “The Harmas” and the whole book: for years he watches living insects in the open and in his garden, and devises experiments.
错：解剖死去的昆虫标本 || 他批评只在实验室解剖死虫的做法，说自己研究的是活的生命。 || he criticises those who only dissect dead insects; he studies the living.
错：查阅前人写的书 || 他常常发现前人书里的错误，比如别人对蝉的误解。 || he often finds errors in earlier books, such as the old ideas about cicadas.
错：听农民讲昆虫的故事 || 他还纠正过民间和寓言里对昆虫的误解。 || he corrects folk tales and fables about insects.
验：从放炮的实验对：他为了弄清蝉听不听得见，借来土炮在树下放，正是观察加实验。 || Check by the cannon: to learn whether cicadas hear, he fires one beneath them.

问：法布尔把自己观察昆虫的那块荒地叫作什么？
答：荒石园
据：《荒石园》：他买下一块长满荆棘、乱石的荒地，叫它“荒石园”，在那里观察昆虫。 || “The Harmas”: he buys a stony waste of thistles and calls it his harmas, the place of his observations.
错：百草园 || 百草园是鲁迅童年的后园。 || the Hundred-Plant Garden is Lu Xun's childhood garden.
错：昆虫园 || 书里没有“昆虫园”这个名字。 || there is no “insect garden”.
错：大观园 || 大观园在《红楼梦》里。 || the Grand View Garden is in Dream of the Red Chamber.
验：从荒地的样子对：那里满是石头，没人耕种，却正好是昆虫的乐园，名字就叫“荒石园”。 || Check by the place: stony and untilled, a paradise for insects.

问：《昆虫记》的语言有什么特点？
答：科学准确，又生动有趣
据：全书：法布尔写得准确可靠，又用生动的比喻和拟人手法，被称为“昆虫的史诗”。 || The book as a whole: exact and reliable, yet full of lively comparisons and personification, it has been called an epic of insects.
错：全是枯燥的数据 || 书里有数据，但写得生动，并不枯燥。 || it has figures but is never dry.
错：只讲趣闻，不讲科学 || 他讲趣事时也讲科学道理。 || its stories carry the science.
错：全部用诗歌写成 || “史诗”是比喻，书是用散文写的。 || “epic” is a figure; the book is prose.
验：从《蝉》对：他既写清蝉的地洞怎样造，又把它的歌唱写得像一首颂歌，两方面都有。 || Check by “The Cicada”: exact about the burrow, lyrical about the song.

问：法布尔观察的蝉，幼虫在地下生活多少年？
答：四年
据：《蝉》：法布尔说，蝉的幼虫要在地下待四年。 || “The Cicada”: Fabre says the larva lives four years underground.
错：一年 || 一年太短，书里是四年。 || one year is too short.
错：十七年 || 十七年是美洲一种周期蝉，不是法布尔写的蝉。 || seventeen years belongs to an American periodical cicada, not his.
错：一个月 || 一个月是它出土以后的生活时间。 || a month is its life above ground.
验：从下一题对：地下四年，地上一个多月，作者用这对比感叹蝉的一生。 || Check by the contrast he draws: four years below, a month in the sun.

问：蝉钻出地面以后，在阳光下能活多久？
答：一个多月
据：《蝉》：蝉在地下四年，出土后在阳光下只能活一个多月。 || “The Cicada”: after four years below, it lives little more than a month in the sun.
错：四年 || 四年是它在地下的时间。 || four years is its time underground.
错：一年 || 一年不是书里的数。 || a year is not the book's number.
错：一天 || 一天太短。 || a day is far too short.
验：从作者的感叹对：“四年黑暗中的苦工，一个月阳光下的享乐”，正是这两个时间的对比。 || Check by his words: four years of toil in the dark, a month of joy in the light.

问：蝉的地洞口为什么没有一堆土？
答：泥土被用来涂抹洞壁了
据：《蝉》：蝉挖洞时把泥土涂在洞壁上，还用体内的液体把土和成灰泥，所以洞口没有土堆。 || “The Cicada”: it plasters the soil onto the walls of its tunnel, wetting it with its own fluid, so no heap is left at the mouth.
错：风把土吹走了 || 书里说土没有被运出去，不是被风吹走。 || the soil never leaves the hole.
错：蚂蚁把土搬走了 || 蚂蚁不帮蝉搬土。 || ants carry nothing for the cicada.
错：雨水把土冲走了 || 洞壁抹了灰泥，雨水冲不到这里。 || the walls are plastered; rain is not the cause.
验：从洞壁的样子对：洞壁光滑结实，不会塌，正是因为土被涂在了壁上。 || Check by the walls: smooth and firm, plastered with that soil.

问：蝉的幼虫出土以后，通常在哪里蜕皮？
答：爬到树枝或草茎上
据：《蝉》：幼虫出洞后，爬到附近的树枝或草茎上，抓牢了再蜕皮。 || “The Cicada”: out of the hole, the larva climbs a twig or stem, holds fast and sheds its skin.
错：在地洞里 || 它是出了地洞才蜕皮的。 || it moults only after it leaves the hole.
错：在水里 || 书里没有在水里蜕皮。 || it does not moult in water.
错：在平地上 || 它要爬到高处抓牢，不在平地上。 || it climbs; it does not moult on the ground.
验：从蜕皮的样子对：它倒挂着慢慢翻出身子，必须先抓住树枝，才能悬在空中蜕皮。 || Check by how it moults: it hangs head down, which needs a grip on a twig.

问：蝉是靠什么发出响亮的声音的？
答：腹部的发音器
据：《蝉》：蝉的发音器在腹部，两片薄膜振动，发出响亮的声音。 || “The Cicada”: its sound organ is in the abdomen, where membranes vibrate loudly.
错：嘴巴 || 蝉的嘴是吸树汁的，不是用来叫的。 || its mouth is for sucking sap.
错：翅膀摩擦 || 翅膀摩擦发声的是蟋蟀。 || rubbing wings is the cricket's way.
错：后腿摩擦 || 后腿摩擦发声的是蝗虫一类。 || rubbing legs is the grasshopper's.
验：从雌雄对：只有雄蝉会叫，雌蝉腹部没有发音器，所以叫声来自腹部。 || Check by the sexes: only males sing; females lack the organ.

问：法布尔为了试一试蝉的听觉，做了什么？
答：在树下放土炮
据：《蝉》：法布尔借来乡里过节用的土炮，在梧桐树下放了两响，试蝉听不听得见。 || “The Cicada”: he borrows the village's festival cannon and fires it twice beneath the plane trees.
错：在树下敲锣 || 书里用的是土炮，不是锣。 || a cannon, not a gong.
错：在树下大声喊叫 || 书里不是喊叫。 || not shouting.
错：把蝉捉进屋里 || 他是在树下现场试，没有捉进屋。 || he tests them in the tree, not indoors.
验：从实验的设计对：要试听觉，声音越响越好，所以用了最响的土炮。 || Check by the design: the loudest sound he could find.

问：放炮以后，树上的蝉怎么样？
答：照样唱，像没听见一样
据：《蝉》：放炮以后，树上的蝉照样唱，像什么也没听见一样。 || “The Cicada”: after the shots the cicadas sing on as if they heard nothing.
错：全都飞走了 || 蝉没有被吓走。 || none flies away.
错：停止了歌唱 || 蝉没有停止歌唱。 || none stops singing.
错：唱得更响了 || 它们的声音没有变化。 || their song does not change.
验：从他的结论对：他说蝉也许听觉很迟钝，或者根本听不见，正因为放炮后毫无反应。 || Check by his conclusion: they hear poorly or not at all.

问：法布尔发现，蝉刚产下的卵常被谁破坏？
答：一种很小的蚋
据：《蝉》：蝉刚产下卵，一种很小的蚋就跟在后面，把自己的卵产进蝉的卵里。 || “The Cicada”: no sooner has she laid than a tiny gnat follows and lays its eggs among hers.
错：蚂蚁 || 书里破坏蝉卵的是蚋，不是蚂蚁。 || the gnat, not the ant.
错：蜘蛛 || 书里不是蜘蛛。 || not a spider.
错：螳螂 || 螳螂会吃蝉，但不是破坏卵的那一个。 || the mantis eats cicadas but does not spoil the eggs.
验：从蚋的样子对：它小得蝉都不在意，就在蝉身边产卵，蝉却毫无办法。 || Check by its size: so small the cicada ignores it.

问：螳螂捕捉猎物主要靠什么？
答：像大刀一样带锯齿的前足
据：《螳螂》：螳螂的前足像两把大刀，上面有锯齿，一合拢就能夹住猎物。 || “The Mantis”: its forelegs are toothed blades that close on prey.
错：口中吐出的丝网 || 吐丝结网的是蜘蛛。 || webs are the spider's.
错：尾部的毒刺 || 尾部有毒刺的是蜂。 || a sting is the wasp's.
错：又长又黏的舌头 || 用黏舌头捕食的是青蛙、变色龙。 || a sticky tongue is the frog's or chameleon's.
验：从它的样子对：它平时把前足举在胸前，像在祈祷，其实是在等着猎物。 || Check by its pose: forelegs raised as if praying, waiting.

问：螳螂遇到大猎物时，常摆出什么姿势吓唬它？
答：张开翅膀，竖起身子
据：《螳螂》：遇到大蝗虫，螳螂张开翅膀，竖起身子，摆出吓人的姿势。 || “The Mantis”: faced with a big locust, it spreads its wings and rears up in a fearsome pose.
错：缩成一团装死 || 它不装死，而是摆出吓人的样子。 || it does not play dead; it threatens.
错：飞到高处躲起来 || 它不躲，而是正面迎上去。 || it does not hide; it faces the prey.
错：吐出难闻的液体 || 书里没写它吐液体。 || it sprays nothing.
验：从结果对：蝗虫被吓得不敢动，螳螂就扑上去，可见这姿势是为了吓住猎物。 || Check by the result: the locust freezes, and the mantis strikes.

问：法布尔观察到雌螳螂有时会做出什么令人吃惊的事？
答：吃掉雄螳螂
据：《螳螂》：法布尔看到雌螳螂有时会吃掉雄螳螂。 || “The Mantis”: Fabre sees the female sometimes eat the male.
错：吃掉自己的卵 || 书里没写它吃自己的卵。 || it does not eat its eggs.
错：和雄螳螂一起照顾卵 || 书里雄螳螂常被吃掉，不会一起照顾卵。 || the male is often eaten; he tends no eggs.
错：把卵送给别的螳螂 || 书里没写它把卵送人。 || it gives its eggs to none.
验：从作者的态度对：他说这种事让人吃惊，正和螳螂“祈祷”的样子形成反差。 || Check by his surprise: so unlike its praying look.

问：螳螂把卵产在哪里？
答：泡沫凝成的卵囊里
据：《螳螂》：雌螳螂产卵时排出泡沫，泡沫凝固成卵囊，卵就在里面。 || “The Mantis”: the female lays in a froth that hardens into an egg case.
错：泥土下的洞穴里 || 书里不是地下的洞穴。 || not a burrow.
错：蝉的卵里 || 螳螂不把卵产在蝉卵里，那是蚋。 || the gnat lays in the cicada's eggs, not the mantis.
错：树叶背面的丝网上 || 丝网是蜘蛛的。 || silk is the spider's.
验：从卵囊的样子对：法布尔描写它像一团硬化的泡沫，能挡住冬天的寒冷。 || Check by its look: a hardened froth against the winter.

问：圣甲虫滚粪球时，常有另一只来“帮忙”，它其实想做什么？
答：趁机把粪球抢走
据：《圣甲虫》：一只圣甲虫滚粪球时，常有另一只赶来装作帮忙，其实是想把粪球抢走。 || “The Sacred Beetle”: while one rolls its ball, another often comes as if to help, but means to steal it.
错：帮配偶一起干活 || 法布尔说这不是配偶。 || Fabre says it is no mate.
错：教小圣甲虫滚球 || 不是教小圣甲虫。 || it teaches no young.
错：真心帮朋友的忙 || 它不是真心帮忙。 || it is not a true friend.
验：从结果对：主人一不留神，“帮忙”的那只就推着粪球跑了，可见是小偷。 || Check by the result: the helper makes off with the ball.

问：雌圣甲虫给幼虫准备的粪团是什么形状？
答：梨形
据：《圣甲虫》：雌圣甲虫给幼虫做的粪团是梨形的，卵就产在细的那一头。 || “The Sacred Beetle”: for its larva the female shapes a pear, and lays the egg in the neck.
错：圆球形 || 圆球是它滚着吃的粪球。 || the round ball is food for itself.
错：方块形 || 书里没有方块形。 || there is no cube.
错：长条形 || 书里没有长条形。 || there is no long strip.
验：从幼虫对：梨形的细颈里通气，幼虫出生就有食物，形状正是为幼虫设计的。 || Check by the larva: air in the neck, food all round.

问：古埃及人怎样看待圣甲虫？
答：把它当作神圣的象征
据：《圣甲虫》：古埃及人把圣甲虫当作神圣的象征，把它刻在石头上。 || “The Sacred Beetle”: the ancient Egyptians held it sacred and carved it in stone.
错：把它当作可怕的害虫 || 古埃及人敬它，不是当害虫。 || they revered it, not feared it.
错：把它当作美味的食物 || 书里没写他们吃它。 || they did not eat it.
错：把它当作治病的药 || 书里没写拿它治病。 || it was no medicine.
验：从名字对：“圣甲虫”的“圣”字就来自古埃及人对它的崇拜。 || Check by the name: “sacred” comes from that worship.

问：蟋蟀的住宅通常选在什么地方？
答：向阳、排水好的草坡上
据：《蟋蟀》：蟋蟀选向阳、排水好的草坡，自己挖洞做住宅。 || “The Cricket”: it picks a sunny, well-drained bank and digs its own home.
错：阴暗潮湿的树洞里 || 它喜欢干燥向阳的地方。 || it likes the dry and sunny.
错：别的虫留下的旧洞里 || 它自己挖洞，不住别人的旧洞。 || it digs its own; it takes no one's old hole.
错：高高的树枝上 || 它住在地下的洞里。 || it lives underground.
验：从作者的比较对：他说别的昆虫大多随便找个地方藏身，蟋蟀却自己建家，所以值得称赞。 || Check by his comparison: others take any shelter; the cricket builds.

问：法布尔为什么称赞蟋蟀的住宅？
答：工具简单，却建得十分用心
据：《蟋蟀》：蟋蟀的工具只有前足和大颚，却把住宅建得很用心，经常修整。 || “The Cricket”: with only its forelegs and jaws, it builds and keeps its home with care.
错：住宅比别的昆虫都大 || 它的住宅并不大。 || its home is not large.
错：是许多蟋蟀一起建的 || 是一只蟋蟀自己建的。 || one cricket builds alone.
错：里面装饰得很漂亮 || 它看重的是实用，不是装饰。 || it is practical, not decorated.
验：从工具对：工具那么简单，住宅却那么整齐，作者才称赞它是建筑家。 || Check by the tools: so simple, so neat a house.

问：蟋蟀是怎样“唱歌”的？
答：两片前翅互相摩擦
据：《蟋蟀》：蟋蟀把两片前翅互相摩擦，发出声音。 || “The Cricket”: it rubs its two forewings together.
错：张开嘴巴鸣叫 || 蟋蟀不是用嘴叫的。 || it does not sing with its mouth.
错：用后腿敲打地面 || 书里不是用后腿敲地。 || not by drumming its legs.
错：振动腹部的鼓膜 || 用腹部发声的是蝉。 || the abdomen is the cicada's.
验：从翅膀的构造对：一片前翅上有像锉一样的齿，一片上有刮片，一擦就响。 || Check by the wing: a file on one, a scraper on the other.

问：萤火虫主要吃什么？
答：蜗牛
据：《萤火虫》：萤火虫主要吃蜗牛。 || “The Glow-worm”: it feeds mainly on snails.
错：花蜜 || 书里不是花蜜。 || not nectar.
错：树叶 || 书里不是树叶。 || not leaves.
错：蚂蚁 || 书里不是蚂蚁。 || not ants.
验：从下一题对：法布尔写它怎样对付蜗牛，正说明蜗牛是它的食物。 || Check by the next scene: it is snails it hunts.

问：萤火虫是怎样对付蜗牛的？
答：先麻醉它，再化成汁液吸食
据：《萤火虫》：萤火虫用口器在蜗牛身上轻轻地刺几下，蜗牛就被麻醉，再把它化成液体吸食。 || “The Glow-worm”: it pricks the snail gently, numbs it, then turns it to liquid and drinks.
错：一口咬碎吞下去 || 它的嘴很小，咬不碎蜗牛。 || its mouth is too small to crush a snail.
错：用亮光把它吓晕 || 亮光不能把蜗牛吓晕。 || its light stuns nothing.
错：吐丝把它缠起来 || 萤火虫不会吐丝。 || it spins no silk.
验：从作者的比喻对：他说这好像外科医生先给病人麻醉，可见是先麻醉。 || Check by his comparison: like a surgeon with an anaesthetic.

问：萤火虫的光是从哪里发出来的？
答：腹部的末端
据：《萤火虫》：萤火虫的光是从腹部末端发出来的。 || “The Glow-worm”: its light comes from the tip of the abdomen.
错：头部 || 头部不发光。 || not the head.
错：翅膀 || 翅膀不发光。 || not the wings.
错：腿上 || 腿不发光。 || not the legs.
验：从它的样子对：夜里看到的光点都在它身体的尾部。 || Check by the night: the glow is at its tail.

问：松毛虫外出时有什么特点？
答：一条跟着一条排成长队
据：《松毛虫》：松毛虫外出时一条跟着一条，排成长长的队伍。 || “The Pine Processionary”: it goes out in single file, a long procession.
错：成群地乱飞乱爬 || 它们不乱，排得整整齐齐。 || they never scatter.
错：总是单独行动 || 它们总是成队行动。 || they always go together.
错：由最大的一条背着走 || 没有背着走的。 || no one carries another.
验：从名字对：它的法文名字就是“列队行进的毛虫”。 || Check by its name: the procession caterpillar.

问：松毛虫靠什么跟住前面的伙伴？
答：前面的虫吐下的丝
据：《松毛虫》：每条松毛虫一边走一边吐丝，后面的就顺着丝走。 || “The Pine Processionary”: each spins a thread as it goes, and the next follows it.
错：伙伴身上的气味 || 书里靠的是丝，不是气味。 || silk, not scent.
错：伙伴发出的声音 || 书里没写它们发声。 || they make no sound.
错：伙伴身上的亮光 || 发光的是萤火虫。 || the glow-worm is the one that shines.
验：从花盆实验对：法布尔擦掉丝，后面的就走不下去，可见靠的是丝。 || Check by the rim: wipe the thread and they stop.

问：法布尔让松毛虫队伍在花盆边上首尾相接，结果怎样？
答：绕着盆沿转了好几天
据：《松毛虫》：法布尔让队伍在花盆边上首尾相接，它们绕着盆沿转了七天。 || “The Pine Processionary”: when the file closes into a ring on a vase rim, they circle for seven days.
错：马上找到了出路 || 它们找不到出路。 || they find no way out.
错：领头的带大家爬了下来 || 首尾相接后就没有领头的了。 || once the ring closes there is no leader.
错：当天就全部饿死了 || 它们转了好几天，没有当天饿死。 || they circle for days, not dying that day.
验：从下一题对：转了那么久都走不出去，正说明它们只会跟着走。 || Check by the next question: they only follow.

问：松毛虫绕盆沿的实验说明了什么？
答：它们只会盲目地跟随
据：《松毛虫》：几天里它们一直跟着前面的丝转，明明不远处就有松叶，却不会离开圈子。 || “The Pine Processionary”: for days they follow the thread, though pine needles lie close by.
错：它们非常聪明 || 正相反，这实验说明它们不聪明。 || on the contrary, it shows no intelligence.
错：它们记忆力很好 || 它们只是跟着丝，不靠记忆。 || they follow silk, not memory.
错：它们喜欢转圈游戏 || 它们是饿着转圈，不是在玩。 || they circle hungry, not at play.
验：从食物对：饿了好几天还不离开圈子去吃近处的松叶，只能说是盲目跟随。 || Check by the food: hungry, they still will not leave the ring.

问：园蛛躲在网外，怎样知道网上有了猎物？
答：靠一根信号丝感到振动
据：《园蛛》：园蛛躲在网外，用一根丝连着网，网上一有动静，丝就振动报信。 || “The Garden Spider”: hidden outside its web, it holds a thread tied to it, which trembles when prey is caught.
错：用眼睛一直盯着网 || 它躲在外面，不盯着网。 || it hides; it does not watch.
错：闻到猎物的气味 || 书里不是靠气味。 || not by smell.
错：听到猎物的叫声 || 书里不是靠听声音。 || not by sound.
验：从作者的比喻对：他把这根丝比作电报线，靠的正是振动。 || Check by his figure: he calls it a telegraph wire.

问：一些捕猎的蜂为什么把猎物蜇得不死不活？
答：让幼虫一直有新鲜的食物
据：《昆虫记》写捕猎蜂的篇章：蜂把猎物蜇得麻醉而不死，让幼虫一直吃到新鲜的食物。 || The chapters on hunting wasps: they paralyse their prey without killing it, so the larva has fresh food.
错：它们自己吃不完 || 书里说是为了幼虫，不是吃不完。 || it is for the larva, not surplus.
错：想把猎物养作宠物 || 不是当宠物。 || not as pets.
错：怕猎物死后报复 || 不是怕报复。 || not for fear of revenge.
验：从幼虫对：猎物死了会腐烂，活着又会反抗，只有麻醉不死才最合适。 || Check by the larva: dead prey rots, live prey fights back.

问：法布尔写的黄蜂，把巢建在哪里？
答：地下的洞里
据：《黄蜂》：法布尔写的黄蜂把巢建在地下的洞里。 || “The Wasp”: the wasps Fabre describes build their nest in a hole in the ground.
错：高高的树枝上 || 把巢挂在树上的是别的蜂类，书里写的黄蜂在地下。 || others hang nests in trees; his wasps live underground.
错：人家的屋檐下 || 屋檐下筑巢的是别的蜂，书里不是。 || eave-nesting is another kind.
错：小河的水面上 || 水面上不能筑巢。 || no nest floats on a stream.
验：从实验对：他用玻璃罩罩住地下巢的出口，观察黄蜂怎样出不来，正说明巢在地下。 || Check by his experiment: he covers the hole in the ground with a glass bell.

问：法布尔在书中常常怎样写昆虫？
答：像写人一样写它们的性格
据：全书：法布尔把昆虫当作有性格的生命来写，把它们写得像人一样。 || The book as a whole: Fabre writes insects as beings with character, almost as people.
错：把它们写成冷冰冰的标本 || 他写的是活生生的昆虫，不是标本。 || he writes living insects, not specimens.
错：把它们都写成人类的敌人 || 他欣赏昆虫，并不把它们都当敌人。 || he admires them, not sees them as foes.
错：只写它们的大小和颜色 || 他写它们的生活和习性，不只写外表。 || he writes their lives, not just their looks.
验：从蟋蟀对：他把蟋蟀写成会建房的建筑家，正是拟人的写法。 || Check by the cricket: the builder of a house.

问：观察昆虫时，法布尔常常怎样做？
答：一连几个小时耐心等待
据：全书：法布尔观察昆虫常常一连几个小时守在一处，耐心等待。 || The book as a whole: he often waits for hours in one spot.
错：看一眼就下结论 || 他从不草率下结论，反复观察。 || he never concludes in haste.
错：请别人替他观察 || 他坚持亲自观察。 || he watches for himself.
错：只在实验室里观察 || 他主要在野外观察。 || he watches mostly in the open.
验：从园蛛对：他为看园蛛织网，常常天不亮就起来守着，正是耐心等待。 || Check by the spider: he rises before dawn to watch it spin.

问：《昆虫记》最能体现法布尔什么精神？
答：热爱生命，严谨求实
据：全书：法布尔一生热爱昆虫，几十年如一日地观察和实验，严谨求实。 || The book as a whole: he loves insects all his life and observes for decades with rigour.
错：为了出名，不择手段 || 他晚年才出名，不是为了名声。 || he won fame only late, and never sought it.
错：只关心有用的害虫 || 他关心所有昆虫，不只害虫。 || he cares for every insect, not just pests.
错：相信书本，不信观察 || 他相信观察，常纠正书本上的错误。 || he trusts observation and corrects books.
验：从蝉的寓言对：他用观察纠正了拉封丹寓言里“蝉向蚂蚁借粮”的说法，正是求实精神。 || Check by the fable: he corrects La Fontaine's cicada begging from the ant.
`,
  },
  {
    id: "steel-tempered",
    grade: 8,
    title: { en: "How the Steel Was Tempered", zh: "钢铁是怎样炼成的" },
    author: { en: "Nikolai Ostrovsky", zh: "奥斯特洛夫斯基" },
    guide: {
      en: "The novel follows Pavel Korchagin from a quick-tempered boy in a small Ukrainian town to a young man who keeps working for his cause after war, labour and illness have taken his health and sight. Read it as the story of a character being made: mark the turns of his life, the people who shaped him, such as the sailor Zhukhrai, his friends and the girls he loved, and the choices he made each time and why. Ask what the title means, steel hardened in fire and then cooled, and how it fits Pavel. Notice that much of the book comes from the author's own life, and that it was written when he was bedridden and blind. Keep a timeline of Pavel's life and, beside each stage, what he learned.",
      zh: "小说写保尔·柯察金从乌克兰小城里一个脾气倔强的少年，成长为一个在战争、劳动和疾病夺去了健康和视力以后仍然坚持工作的青年。可以把它当作一个人怎样被“炼成”的故事来读：标出他一生的几次转折，记下影响过他的人，比如水兵朱赫来、他的朋友和他爱过的姑娘，想一想他每一次作了什么选择、为什么这样选。想一想书名的意思：钢铁要在烈火里烧、再经过冷却才能炼成，这和保尔的经历有什么相像。还要注意，书里很多内容来自作者自己的经历，而作者是在瘫痪、失明以后写成这本书的。可以给保尔的一生画一条时间线，在每一段旁边写下他从中学到了什么。",
    },
    callout: {
      en: "Pavel changes from a rough boy into a soldier and a writer. Place the question in its stage of his life before you choose; what he does after his wounds is not what he did as a boy in Shepetivka.",
      zh: "保尔从一个莽撞的少年成长为战士，又成为作家。选之前先把问题放回他人生的那个阶段；他受伤以后做的事，不是他少年时在小镇上做的事。",
    },
    questions: `
问：《钢铁是怎样炼成的》的作者是哪国作家？
答：苏联
据：作者：尼古拉·奥斯特洛夫斯基是苏联作家，1930年代写成这部小说。 || The author: Nikolai Ostrovsky was a Soviet writer who wrote the novel in the 1930s.
错：法国 || 法国作家写的是凡尔纳、法布尔这些书，不是这部。 || French writers gave us Verne and Fabre, not this book.
错：英国 || 作者不是英国人。 || he was not English.
错：美国 || 作者不是美国人。 || he was not American.
验：从故事里的事对：保尔参加的是红军和共青团，书里写的是十月革命后的国内战争，正是苏联的历史。 || Check by the story: the Red Army and the Komsomol of the civil war, Soviet history.

问：这部小说的主人公是谁？
答：保尔·柯察金
据：全书：小说写保尔·柯察金从一个顽皮少年成长为坚强战士的一生。 || The book as a whole: it follows Pavel Korchagin from wild boy to steadfast fighter.
错：朱赫来 || 朱赫来是引他走上革命道路的水兵。 || Zhukhrai is the sailor who leads him to the revolution.
错：阿尔焦姆 || 阿尔焦姆是保尔的哥哥。 || Artyom is Pavel's brother.
错：谢廖沙 || 谢廖沙是保尔的朋友，后来牺牲了。 || Seryozha is his friend, who falls in battle.
验：从全书的结构对：从第一部被开除到第二部写书，每一章都跟着保尔走，主人公只能是他。 || Check by the structure: from expulsion to the novel he writes, every chapter follows Pavel.

问：小说的故事主要发生在什么地方？
答：乌克兰的小城和周围地区
据：第一部：故事从乌克兰的小城舍佩托夫卡开始，保尔在那里长大。 || Part 1: the story begins in Shepetovka, a small Ukrainian town where Pavel grows up.
错：英国的伦敦 || 书里没有写伦敦。 || there is no London.
错：法国的巴黎 || 书里没有写巴黎。 || there is no Paris.
错：美国的乡村 || 书里没有写美国。 || there is no America.
验：从后来的情节对：他修铁路是为了给基辅运木柴，基辅也是乌克兰的城市。 || Check by the railway: it carries firewood to Kiev, also in Ukraine.

问：保尔小时候为什么被学校开除？
答：他往神父家的面团里撒了烟末
据：第一部第一章：保尔往瓦西里神父家做复活节糕的面团里撒了一把烟末，被赶出学校。 || Part 1, chapter 1: Pavel sprinkles tobacco into the Easter dough at Father Vasily's, and is expelled.
错：他偷了同学的钱 || 书里没写他偷钱。 || he steals no money.
错：他和老师打了一架 || 他是和神父结了仇，不是和老师打架。 || his feud is with the priest, not a fight with a teacher.
错：他一直不交学费 || 书里没写学费的事。 || fees are not the matter.
验：从神父平时怎样对他对：神父常罚他、揪他耳朵，他才报复撒烟末，前后是一件事。 || Check by the grudge: the priest pulled his ears and punished him, so Pavel took revenge.

问：保尔离开学校后，最早在哪里干活？
答：车站的食堂里
据：第一部第一章：保尔被开除后，母亲把他送到车站食堂去干活，烧水、洗碗。 || Part 1, chapter 1: after his expulsion his mother sends him to work in the station canteen, boiling water and washing dishes.
错：一家书店里 || 书里没写书店。 || no bookshop.
错：一所学校里 || 他是被学校开除的，不会去学校干活。 || he has just been thrown out of school.
错：一座教堂里 || 他和神父结仇，不会去教堂。 || at odds with the priest, he would not work in a church.
验：从他在食堂看到的事对：他在那里看到底层人受欺压，开始恨那些剥削人的人，这是他成长的第一站。 || Check by what he sees there: the poor exploited, his first lesson.

问：阿尔焦姆是保尔的什么人？
答：哥哥
据：第一部：阿尔焦姆是保尔的哥哥，是个铁路工人。 || Part 1: Artyom is Pavel's elder brother, a railway worker.
错：父亲 || 保尔的父亲早已去世，家里靠母亲和哥哥。 || Pavel's father is dead; mother and brother keep the house.
错：老师 || 他是工人，不是老师。 || he is a worker, not a teacher.
错：同学 || 他比保尔大很多，不是同学。 || he is much older, not a schoolmate.
验：从送保尔去干活对：哥哥常管着保尔，还替他在电厂找了工作，正是兄长的样子。 || Check by his care: he finds Pavel work at the power station.

问：在保尔走上革命道路的过程中，影响最大的是哪位水兵？
答：朱赫来
据：第一部：朱赫来是一名水兵，在保尔家躲藏时给他讲革命道理，影响了保尔的一生。 || Part 1: Zhukhrai, a sailor, hides at Pavel's home and teaches him the revolution.
错：谢廖沙 || 谢廖沙是保尔的朋友，不是引路人。 || Seryozha is a friend, not a guide.
错：阿尔焦姆 || 阿尔焦姆是哥哥，不是水兵。 || Artyom is his brother, not a sailor.
错：维克多 || 维克多是地主的儿子，是保尔的对头，后来还告发了他。 || Viktor is a landowner's son and Pavel's enemy, who later informs on him.
验：从保尔救他对：保尔冒险救下朱赫来，正因为朱赫来对他影响最大。 || Check by the rescue: Pavel risks all to save him.

问：朱赫来教给了少年保尔什么本领？
答：拳击
据：第一部：朱赫来教保尔拳击，告诉他怎样出拳才有力。 || Part 1: Zhukhrai teaches Pavel to box.
错：游泳 || 书里没写他教游泳。 || he does not teach swimming.
错：画画 || 书里没写他教画画。 || he does not teach drawing.
错：拉琴 || 保尔会拉手风琴，但不是朱赫来教的。 || Pavel plays the accordion, but not from Zhukhrai.
验：从救朱赫来对：保尔用朱赫来教的拳击打倒押送兵，前后呼应。 || Check by the rescue: he uses those punches on the guard.

问：朱赫来被押送着经过街上时，保尔做了什么？
答：扑上去把押送的士兵打倒，救了朱赫来
据：第一部：朱赫来被押着经过街上，保尔扑上去把押送兵打倒，朱赫来趁机逃走。 || Part 1: as Zhukhrai is marched through the street, Pavel knocks down the guard and Zhukhrai escapes.
错：躲在屋里不敢出来 || 保尔没有躲，而是冲了出去。 || he does not hide; he charges.
错：跑去告诉了警察 || 他没去告诉警察，警察正是押人的一方。 || he tells no police; they are the captors.
错：跟着人群看热闹 || 他不是看热闹，而是出手救人。 || he does not watch; he acts.
验：从下一题对：保尔因此被人告发抓进监狱，正说明他救了朱赫来。 || Check by what follows: he is arrested for it.

问：救了朱赫来以后，保尔遭遇了什么？
答：被人告发，抓进了监狱
据：第一部：维克多告发了保尔，保尔被抓进监狱，受了审问。 || Part 1: Viktor informs on him, and Pavel is jailed and interrogated.
错：得到了一大笔奖赏 || 他没有得奖，反而坐牢。 || no reward; prison.
错：当上了镇上的官 || 他被抓了，没当官。 || he is arrested, not promoted.
错：马上去了外国 || 他没去外国。 || he goes nowhere abroad.
验：从他出狱对：后来他趁押送混乱逃出来，跑到冬妮娅家躲藏，说明他坐过牢。 || Check by his escape: freed in confusion, he hides at Tonya's.

问：冬妮娅是一个什么样的姑娘？
答：林务官的女儿，保尔的初恋
据：第一部：冬妮娅是林务官的女儿，在湖边钓鱼时认识了保尔，是他的初恋。 || Part 1: Tonya is the forester's daughter, who meets Pavel fishing by the lake; his first love.
错：保尔的亲妹妹 || 保尔没有妹妹，家里只有哥哥。 || Pavel has no sister, only a brother.
错：食堂老板的女儿 || 食堂老板是剥削工人的人，书里没有他的女儿和保尔恋爱。 || the canteen boss exploits his workers; no daughter loves Pavel.
错：一位红军护士 || 冬妮娅是富家小姐，不是红军护士。 || Tonya is a well-to-do girl, not a Red Army nurse.
验：从身份对：冬妮娅家境好，保尔是穷工人的孩子，这个差别后来让他们分开。 || Check by class: her comfort and his poverty later part them.

问：保尔和冬妮娅后来为什么分开了？
答：两人的想法和要走的路越来越不同
据：第二部：修铁路时保尔又遇见冬妮娅，她已嫁给工程师，看不起干活的工人，两人的路已经完全不同。 || Part 2: at the railway Pavel meets Tonya again, married to an engineer and scornful of labourers; their roads have parted.
错：冬妮娅搬到了很远的外国 || 冬妮娅没有去外国，修铁路时两人还见过面。 || she did not go abroad; they meet at the railway.
错：保尔的母亲不许他们来往 || 保尔的母亲没有阻止他们。 || his mother does not forbid them.
错：两人为了一件小事吵了一架 || 两人分开不是因为小事，而是想法不同。 || it is not a quarrel but a difference of outlook.
验：从冬妮娅的穿着对：她穿着漂亮的衣服来工地，和满身泥水的保尔形成对比，正说明两人已不是一路人。 || Check by her clothes: finery beside his mud.

问：保尔参加红军后，在哪一种部队里作战？
答：骑兵部队
据：第一部：保尔参加了布琼尼的第一骑兵军，骑马作战。 || Part 1: Pavel joins Budyonny's First Cavalry Army.
错：海军舰队 || 书里没有海军舰队，水兵是朱赫来。 || no fleet; the sailor is Zhukhrai.
错：空军 || 那时没有空军作战。 || there is no air force here.
错：炮兵学校 || 他不是在学校，而是在前线。 || not a school; the front.
验：从他受伤对：他在骑兵冲锋中头部负伤，正是骑兵作战的时候。 || Check by his wound: taken in a cavalry charge.

问：保尔在一次战斗中受了什么伤？
答：头部受了重伤，右眼看不见了
据：第一部末尾：一颗炮弹在保尔身边爆炸，他头部受了重伤，右眼失明。 || End of Part 1: a shell bursts beside him; his head is badly hurt and he loses the sight of his right eye.
错：失去了一条腿 || 他没有失去腿。 || he loses no leg.
错：两只手都受了伤 || 书里写的是头和眼睛。 || it is his head and eye.
错：只是擦破了一点皮 || 这是重伤，几乎送命。 || it is grave, nearly fatal.
验：从他退伍对：他因伤离开部队，不能再打仗，可见伤得很重。 || Check by his discharge: he can no longer fight.

问：冬天修筑铁路，是为了把什么运进城里？
答：过冬用的木柴
据：第二部：冬天城里缺燃料，保尔他们修一条窄轨铁路，把森林里的木柴运进基辅过冬。 || Part 2: the city lacks fuel for winter, so they build a narrow-gauge line to bring firewood from the forest to Kiev.
错：粮食和蔬菜 || 书里运的是木柴，不是粮食。 || firewood, not food.
错：枪支和弹药 || 不是运枪支弹药。 || not arms.
错：书本和纸张 || 不是运书本。 || not books.
验：从季节对：严冬缺柴就会冻死人，所以要抢在冬天把木柴运进城。 || Check by the season: without wood the city freezes.

问：修筑铁路的时候，保尔他们遇到了哪些困难？
答：天气寒冷，缺吃少穿，还有匪徒袭击
据：第二部：修路时天寒地冻，缺吃少穿，靴子破了，还有匪徒来袭击。 || Part 2: the cold is bitter, food and clothing scarce, boots worn through, and bandits attack.
错：工具太多，用不完 || 工具不够用，不是太多。 || tools are short, not plentiful.
错：工人太多，挤不下 || 人手不够，不是太多。 || hands are short.
错：天气太热，没法干活 || 那是冬天，非常冷。 || it is winter, bitterly cold.
验：从保尔的样子对：他穿着破靴子在冰水里干活，正是这些困难的写照。 || Check by Pavel: worn boots in freezing water.

问：修完铁路以后，保尔得了什么病？
答：伤寒
据：第二部：铁路修完后，保尔得了伤寒，差点死去。 || Part 2: when the line is done Pavel falls ill with typhus and nearly dies.
错：近视 || 书里没写近视，他的眼睛是受伤失明的。 || not short sight; his eye was lost to a wound.
错：感冒 || 这是重病，不是感冒。 || it is grave, not a cold.
错：牙痛 || 书里没写牙痛。 || no toothache.
验：从误传他死去对：朋友们一度以为他死了，可见病得很重。 || Check by the false news: his friends think him dead.

问：丽达是保尔的什么人？
答：一起工作的同志，保尔曾经爱过她
据：第二部：丽达是和保尔一起工作的团干部，教他读书学习，保尔曾经爱过她。 || Part 2: Rita is a Komsomol worker alongside Pavel, who helps him study; he loved her.
错：保尔的姐姐 || 保尔没有姐姐。 || he has no sister.
错：保尔的老师的女儿 || 书里没有这样的人。 || there is no such person.
错：保尔在食堂里的老板 || 食堂老板是男人，和丽达无关。 || the canteen boss is a man.
验：从后来的情节对：多年后两人重逢，丽达告诉他当年那个人是她哥哥，说明两人曾经相爱。 || Check by their reunion: she tells him the man was her brother.

问：保尔为什么一度疏远了丽达？
答：他误以为和丽达在一起的哥哥是她的恋人
据：第二部：保尔看到丽达和一个男人亲热，以为是她的恋人，就疏远了她，其实那是她哥哥。 || Part 2: seeing Rita with a man, Pavel thinks him her lover and draws away; he was her brother.
错：丽达批评了他的工作 || 书里不是批评他。 || she does not criticise him.
错：丽达搬到了别的城市 || 她没有搬走。 || she does not move away.
错：保尔的家人不喜欢丽达 || 书里没写家人不喜欢她。 || his family has nothing to do with it.
验：从误会解开对：丽达后来告诉他那是哥哥，保尔才知道自己错了。 || Check by the clearing up: she tells him later.

问：保尔很喜欢小说里的哪位人物？
答：牛虻
据：第一部：保尔读了伏尼契的小说《牛虻》，非常喜爱主人公牛虻。 || Part 1: Pavel reads Voynich's The Gadfly and loves its hero.
错：鲁滨孙 || 鲁滨孙是笛福小说的主人公，书里没写保尔喜爱。 || Robinson is Defoe's hero; Pavel does not single him out.
错：孙悟空 || 孙悟空是《西游记》里的。 || Sun Wukong is from Journey to the West.
错：堂吉诃德 || 堂吉诃德是西班牙小说的人物，书里没写保尔喜爱。 || Don Quixote is Spanish; Pavel does not cite him.
验：从牛虻的性格对：牛虻是一个为理想不怕牺牲的革命者，这正是保尔想成为的人。 || Check by the Gadfly: a revolutionary who fears no sacrifice, as Pavel wishes to be.

问：保尔后来的身体怎样了？
答：全身瘫痪，双目失明
据：第二部后半：伤病越来越重，保尔全身瘫痪，双目失明。 || Late Part 2: his wounds and illness worsen until he is paralysed and blind.
错：完全恢复了健康 || 他没有恢复。 || he does not recover.
错：只是有点咳嗽 || 他是全身瘫痪，不是咳嗽。 || paralysis, not a cough.
错：变得比以前更强壮 || 他越来越虚弱。 || he grows weaker.
验：从他写书的方式对：他看不见，只能用模板写字，后来口述让人记录，正因为瘫痪失明。 || Check by how he writes: a stencil, then dictation.

问：身体垮掉以后，保尔想过轻生，他最后作了什么决定？
答：不放弃，换一种方式继续为理想工作
据：第二部：保尔一度想开枪自杀，但他告诉自己不能投降，要换一种方式为理想工作。 || Part 2: he once thinks of shooting himself, but resolves not to give in and to serve by other means.
错：回到故乡，什么也不做 || 他没有放弃，什么都不做正是他拒绝的。 || doing nothing is what he refuses.
错：去国外治病，再也不回来 || 他没去国外。 || he does not go abroad.
错：让别人替自己做所有的事 || 他坚持自己写书，不让别人替。 || he writes himself.
验：从他对自己说的话对：“就是在生活难以忍受的时候，也要坚持活下去”，正是这个决定。 || Check by his words: hold on to life even when it is unbearable.

问：保尔不能再上战场以后，选择了用什么方式继续战斗？
答：写一部小说
据：第二部：不能再上前线以后，保尔开始写一部小说，用笔继续战斗。 || Part 2: no longer able to fight, he begins a novel.
错：开一家商店 || 书里没写开商店。 || he opens no shop.
错：去学校教体育 || 他瘫痪了，不能教体育。 || paralysed, he cannot teach sport.
错：当一名火车司机 || 他看不见，不能开火车。 || blind, he cannot drive a train.
验：从书稿丢失对：他写好的书稿寄丢了，他又重写，正说明他选择的是写书。 || Check by the lost manuscript: he writes it again.

问：保尔写好的书稿第一次寄出去以后，发生了什么事？
答：在邮寄途中丢失了
据：第二部：保尔把写好的第一份书稿寄出去，在邮寄途中丢失了。 || Part 2: his first manuscript is lost in the post.
错：马上就出版了 || 书稿丢了，没出版。 || lost, not published.
错：被他自己烧掉了 || 不是他烧的，是邮寄丢的。 || not burned; lost in the mail.
错：被朋友改成了诗 || 书里没写改成诗。 || no one turns it into verse.
验：从结尾对：他重新写，最后收到出版社的电报说书稿通过了，前面正是丢失过一次。 || Check by the end: he rewrites, and the telegram says it is accepted.

问：保尔的妻子叫什么名字？
答：达雅
据：第二部：保尔的妻子叫达雅，是他养病时认识的姑娘，后来成了党员。 || Part 2: Pavel's wife is Taya, whom he meets while convalescing; she later joins the party.
错：冬妮娅 || 冬妮娅是他的初恋，嫁给了工程师。 || Tonya is his first love, married to an engineer.
错：丽达 || 丽达是他爱过的同志，没有成为他的妻子。 || Rita he loved, but she is not his wife.
错：安娜 || 安娜是他的同志，不是妻子。 || Anna is a comrade, not his wife.
验：从他瘫痪后的生活对：照顾他、帮他写字的是达雅，正是妻子。 || Check by his last years: it is Taya who cares for him.

问：书名《钢铁是怎样炼成的》是什么意思？
答：人要像钢铁一样，在艰苦的斗争和磨炼中变得坚强
据：书名和全书：钢铁要在烈火里炼、在冷水里淬，人也要在艰苦的斗争和磨炼中变得坚强。 || The title and the whole book: steel is made in fire and cold water, and people grow strong in hard struggle.
错：讲的是工厂怎样炼钢 || 书里没写工厂炼钢。 || it is not about a steelworks.
错：讲的是铁路是怎样修成的 || 修铁路只是保尔经历的一部分。 || the railway is one part of Pavel's life.
错：讲的是一种新的炼铁方法 || 书里不讲炼铁方法。 || it teaches no smelting.
验：从保尔的一生对：战争、伤病、瘫痪一次次打击他，他却越来越坚强，正是“炼钢”的意思。 || Check by Pavel's life: each blow makes him harder.

问：小说中主人公的经历和谁的经历很相近？
答：作者自己
据：作者的经历：奥斯特洛夫斯基也参加过国内战争、受过重伤，后来瘫痪失明，保尔的经历和他很相近。 || The author's life: Ostrovsky fought in the civil war, was badly wounded, and later paralysed and blind, like Pavel.
错：作者的父亲 || 作者写的是自己，不是父亲。 || he wrote his own life, not his father's.
错：作者的老师 || 书里没写作者的老师。 || not his teacher.
错：一位外国国王 || 书里没有外国国王。 || there is no king.
验：从下一题对：作者写书时也瘫痪失明，和保尔一模一样。 || Check by the next question: he too was paralysed and blind as he wrote.

问：作者写这部小说时，身体是什么样的？
答：已经瘫痪在床，眼睛也看不见了
据：作者的经历：奥斯特洛夫斯基写这部小说时，已经瘫痪在床，双目失明。 || The author's life: when he wrote it, Ostrovsky was bedridden and blind.
错：身体非常健康 || 他写书时身体已经垮了。 || his health was gone.
错：正在前线打仗 || 他早已不能打仗。 || he could no longer fight.
错：正在大学里读书 || 他瘫痪在床，不能上大学。 || bedridden, he could not attend university.
验：从保尔写书的方式对：书里保尔用模板写字、口述写书，正是作者自己写这本书的样子。 || Check by Pavel's stencil and dictation: that is how Ostrovsky wrote.

问：保尔站在牺牲战友的墓前想到了什么？
答：人的生命只有一次，应该为有意义的事业度过
据：第二部第三章：保尔站在牺牲战友的墓前想：人最宝贵的是生命，生命只有一次，应当为人类最壮丽的事业度过。 || Part 2, chapter 3: at the grave of fallen comrades he thinks that life is given once and should be spent on the noblest cause.
错：以后再也不要交朋友了 || 他想的是珍惜生命，不是不交朋友。 || he thinks of life's worth, not of avoiding friends.
错：应该赶快离开这座城市 || 他没想离开。 || he does not think of leaving.
错：打仗太可怕，要回家种地 || 他不怕打仗，没想回家种地。 || he fears no battle and thinks not of farming.
验：从他后来的选择对：瘫痪后他不肯轻生而去写书，正是在实践这段话。 || Check by his later choice: he writes rather than die.

问：下面哪一项最能概括保尔的性格？
答：意志坚强，不怕困难，忠于理想
据：全书：保尔在战争、伤病和瘫痪面前从不屈服，始终忠于理想。 || The book as a whole: Pavel never yields to war, wounds or paralysis, and keeps faith with his ideal.
错：胆小怕事，遇事退缩 || 他敢救朱赫来、敢上前线，并不胆小。 || he saves Zhukhrai and goes to war; no coward.
错：贪图享受，只顾自己 || 他吃苦在前，从不只顾自己。 || he takes the hardest work.
错：犹豫不决，没有主见 || 他做事果断，有主见。 || he is decisive.
验：从修铁路对：别人倒下了他还在冰水里干，这正是意志坚强。 || Check by the railway: he works on when others fall.

问：保尔从小脾气怎样？
答：倔强，爱打抱不平
据：第一部：保尔从小倔强，敢和神父作对，看到不公平的事就要管。 || Part 1: as a boy Pavel is stubborn, defies the priest, and cannot bear injustice.
错：温顺，从不和人争 || 他敢和神父作对，并不温顺。 || he defies the priest; he is no meek boy.
错：懒散，什么都不在乎 || 他凡事都较真，不是不在乎。 || he cares hotly about everything.
错：胆小，见人就躲 || 他敢救朱赫来，不胆小。 || he saves Zhukhrai; he is not timid.
验：从他在食堂对：他看不惯伙计欺负女工，就和人打架，正是爱打抱不平。 || Check by the canteen: he fights men who bully the women workers.

问：《钢铁是怎样炼成的》是一部什么样的作品？
答：长篇小说
据：全书：这是一部分为两部、写主人公一生的长篇小说。 || The book as a whole: a novel in two parts following its hero's life.
错：一本诗集 || 书是散文写的小说，不是诗集。 || it is a prose novel, not poems.
错：一部科普读物 || 它不是讲科学知识的。 || it is not popular science.
错：一本童话集 || 它写的是真实的历史和人物，不是童话。 || it is no fairy tale.
验：从篇幅和结构对：书分两部，每部九章，跟着保尔从少年写到成年，正是长篇小说。 || Check by its form: two parts of nine chapters, from boyhood to manhood.
`,
  },
  {
    id: "water-margin",
    grade: 9,
    title: { en: "Water Margin", zh: "水浒传" },
    author: { en: "Shi Nai'an", zh: "施耐庵" },
    guide: {
      en: "The novel is built like a chain: one hero's story leads to the next, until they all gather at Liangshan. Keep a list of the main heroes with their nicknames, weapons, former jobs and the event that drove each to Liangshan. For each hero, ask what forced him to rebel, and notice how often it was a corrupt official. Compare heroes who seem alike, such as Lu Zhishen, Wu Song and Li Kui, by what they do, not by labels. In the end, think about the amnesty and what it means for the story's idea of loyalty and justice.",
      zh: "这部小说像一条链子：一个好汉的故事引出下一个，最后大家都聚到梁山。给主要好汉列一张表，写上绰号、兵器、原来的身份，以及让他上梁山的那件事。读每个好汉时，想一想是什么逼他造反，留意这里有多少次是贪官恶霸。比较几个看起来相像的人物，比如鲁智深、武松和李逵，要看他们做了什么，而不是只看标签。读到结尾，想一想招安对“忠义”这个主题意味着什么。",
    },
    callout: {
      en: "There are a hundred and eight heroes, and their deeds are easily mixed: Wu Song kills the tiger, Lu Zhishen uproots the willow, Lin Chong is driven to Liangshan. Before you choose, ask whose story the question is about.",
      zh: "一百零八位好汉的故事很容易混：武松打虎，鲁智深倒拔垂杨柳，林冲被逼上梁山。选之前先想清楚问的是谁的故事。",
    },
    questions: `
问：鲁达为什么要打镇关西？
答：替金氏父女打抱不平
据：第三回“鲁提辖拳打镇关西”：鲁达听金老父女哭诉被郑屠强骗霸占，替他们打抱不平。 || Chapter 3: Lu Da hears old Jin and his daughter tell how the butcher Zheng cheated and abused them, and takes up their cause.
错：镇关西欠了他的钱 || 书里没写郑屠欠鲁达钱，鲁达还故意让他切肉来消遣他。 || Zheng owes him nothing; Lu Da makes him mince meat just to provoke him.
错：镇关西当众骂了他 || 郑屠没有先骂鲁达，是鲁达找上门去。 || Zheng does not insult him first; Lu Da seeks him out.
错：替林冲报仇 || 那时鲁达还不认识林冲。 || Lu Da has not yet met Lin Chong.
验：从鲁达先做的事对：他先给金氏父女凑了盘缠，送他们出城，再去找郑屠，可见他是为他们出头。 || Check by what he does first: he gives the Jins travel money and sees them off before going after Zheng.

问：“镇关西”其实是什么人？
答：卖肉的郑屠
据：第三回：“镇关西”是渭州状元桥下卖肉的郑屠，鲁达嘲笑他不配这个名号。 || Chapter 3: “Lord of the West” is Zheng the butcher at Zhuangyuan Bridge, and Lu Da mocks the title.
错：县里的知县 || 知县是做官的，郑屠只是个卖肉的。 || a magistrate is an official; Zheng sells meat.
错：山里的强盗 || 他在城里开肉铺，不是山里的强盗。 || he keeps a shop in town, not a mountain hideout.
错：禁军的教头 || 禁军教头是林冲。 || the drill instructor is Lin Chong.
验：从鲁达的话对：他骂郑屠“你是个卖肉的操刀屠户，也配叫做镇关西”，正点出他的身份。 || Check by Lu Da's taunt: a butcher with a cleaver calling himself Lord of the West.

问：鲁达打死镇关西以后怎样了？
答：逃走后出家当了和尚
据：第三、四回：鲁达打死郑屠后逃走，经赵员外介绍到五台山文殊院出家，法名智深。 || Chapters 3 and 4: after killing Zheng, Lu Da flees and, through squire Zhao, becomes a monk at Wutai Mountain, named Zhishen.
错：马上上了梁山 || 他上梁山是很久以后的事。 || Liangshan comes much later.
错：到官府去自首 || 他没有自首，是逃走的。 || he flees; he does not surrender.
错：投奔了柴进 || 投奔柴进的是林冲、宋江、武松。 || it is Lin Chong, Song Jiang and Wu Song who go to Chai Jin.
验：从他的名字对：此后他叫“鲁智深”，有了“花和尚”的绰号，正因为出了家。 || Check by his name: from then on he is Lu Zhishen, the Flowery Monk.

问：鲁智深在大相国寺的菜园里做了什么，让泼皮们服气？
答：倒拔垂杨柳
据：第七回“花和尚倒拔垂杨柳”：鲁智深在大相国寺看守菜园，把一棵绿杨柳连根拔起，泼皮们从此服了他。 || Chapter 7: guarding the vegetable garden of Xiangguo Temple, he uproots a willow, and the local toughs submit.
错：拳打镇关西 || 拳打镇关西是他出家以前在渭州的事。 || the Lord of the West was in Weizhou, before he was a monk.
错：醉打蒋门神 || 醉打蒋门神是武松的事。 || beating Jiang the Door God is Wu Song's deed.
错：景阳冈打虎 || 景阳冈打虎也是武松的事。 || the tiger of Jingyang Ridge is Wu Song's.
验：从同一回的下半对：林冲正是隔墙看他拔树耍禅杖，两人结拜，地点就是这座菜园。 || Check by the same chapter: Lin Chong watches over the wall, and they become sworn brothers there.

问：鲁智深的绰号是什么？
答：花和尚
据：书中：鲁智深身上刺着花绣，又是和尚，绰号“花和尚”。 || The novel: tattooed and a monk, he is called the Flowery Monk.
错：行者 || “行者”是武松的绰号。 || the Pilgrim is Wu Song.
错：豹子头 || “豹子头”是林冲的绰号。 || Panther Head is Lin Chong.
错：黑旋风 || “黑旋风”是李逵的绰号。 || Black Whirlwind is Li Kui.
验：从他的身份对：既是和尚，又满背花绣，“花”和“和尚”两样都有。 || Check by the man: a monk, and tattooed.

问：林冲原来是做什么的？
答：八十万禁军教头
据：第七回：林冲是东京八十万禁军的枪棒教头。 || Chapter 7: Lin Chong is a drill instructor of the eight hundred thousand imperial guards in the capital.
错：渭州的提辖 || 渭州的提辖是鲁达。 || the captain in Weizhou is Lu Da.
错：阳谷县的都头 || 阳谷县的都头是武松。 || the constable of Yanggu is Wu Song.
错：郓城县的押司 || 郓城县的押司是宋江。 || the clerk of Yuncheng is Song Jiang.
验：从他的武艺对：他见鲁智深耍禅杖就喝彩，懂行的正是教头。 || Check by his eye: an instructor knows good staff-work at once.

问：林冲被人设计陷害，误入了什么地方？
答：白虎堂
据：第七回“豹子头误入白虎堂”：高太尉设计让林冲拿着宝刀进了商议军机的白虎堂。 || Chapter 7: Marshal Gao tricks Lin Chong into the White Tiger Hall, where war is planned, with a blade in hand.
错：聚义厅 || 聚义厅是梁山上的大厅。 || the Hall of Brotherhood is on Liangshan.
错：山神庙 || 山神庙是他后来在沧州躲雪的地方。 || the mountain temple is where he shelters later in Cangzhou.
错：快活林 || 快活林是武松醉打蒋门神的地方。 || Happy Grove is where Wu Song beats Jiang.
验：从罪名对：带刀闯白虎堂就是要刺杀太尉的罪名，林冲因此被刺配沧州。 || Check by the charge: entering with a blade means plotting murder, and he is exiled for it.

问：是谁一心要害林冲？
答：高太尉父子
据：第七至十回：高太尉的养子高衙内看上林冲的妻子，高太尉父子一心要害林冲。 || Chapters 7 to 10: Marshal Gao's son covets Lin Chong's wife, and father and son plot his ruin.
错：蔡太师 || 蔡太师是收生辰纲寿礼的人，不是害林冲的人。 || Grand Tutor Cai receives the birthday gifts; he is not Lin Chong's enemy.
错：梁中书 || 梁中书是送生辰纲的人。 || Governor Liang sends the gifts.
错：西门庆 || 西门庆害的是武大郎。 || Ximen Qing harms Wu Dalang.
验：从陆谦对：一路追到沧州放火的陆谦，正是奉高太尉之命去的。 || Check by Lu Qian: he follows Lin Chong to Cangzhou on the marshal's orders.

问：林冲被押解途中，谁在野猪林救了他？
答：鲁智深
据：第八回“鲁智深大闹野猪林”：两个公差要在野猪林害死林冲，鲁智深跳出来救了他。 || Chapter 8: the guards are about to kill Lin Chong in Wild Boar Forest when Lu Zhishen leaps out and saves him.
错：武松 || 武松这时还没出场。 || Wu Song has not yet appeared.
错：李逵 || 李逵这时还没出场。 || Li Kui has not yet appeared.
错：柴进 || 柴进是后来林冲到沧州路上投奔的人。 || Chai Jin is whom Lin Chong visits later on the road.
验：从禅杖对：鲁智深用禅杖架住水火棍，一路护送林冲到沧州附近，正是结拜兄弟的情义。 || Check by the staff: he blocks the cudgel and escorts Lin Chong nearly to Cangzhou.

问：草料场起火时，林冲为什么没有被烧死？
答：草屋被雪压塌，他去山神庙过夜
据：第十回“林教头风雪山神庙”：大雪压塌了草料场的草屋，林冲只好去山神庙过夜，躲过了大火。 || Chapter 10: heavy snow crushes his hut at the fodder depot, so he spends the night in the mountain temple and escapes the fire.
错：他提前知道了这个阴谋 || 他事先不知道，是在庙里听到放火人的话才明白。 || he knows nothing beforehand; he learns the plot by overhearing in the temple.
错：鲁智深赶来叫醒了他 || 鲁智深这时不在沧州。 || Lu Zhishen is far away.
错：他被人请去喝酒没回来 || 他是出去买过酒，但回来时草屋已被雪压塌。 || he did go out for wine, but came back to find the hut crushed.
验：从他在庙里听到的对：放火的人说“烧死了林冲”，以为他在草屋里，可见他正因草屋塌了才不在。 || Check by what he hears: they boast he is burned, thinking him in the hut.

问：风雪山神庙以后，林冲去了哪里？
答：投奔梁山
据：第十一回“林冲雪夜上梁山”：林冲杀了陆谦等人，经柴进写信推荐，投奔了梁山。 || Chapter 11: having killed Lu Qian and the others, he goes to Liangshan with a letter from Chai Jin.
错：回东京报仇 || 他杀了人，回东京只能送死。 || he cannot go back to the capital.
错：到五台山出家 || 去五台山出家的是鲁智深。 || it is Lu Zhishen who became a monk.
错：去沧州自首 || 他杀了人，不会去自首。 || he will not surrender.
验：从回目对：“林冲雪夜上梁山”，第十一回的题目就写明了。 || Check by the chapter title: Lin Chong goes to Liangshan on a snowy night.

问：林冲的绰号是什么？
答：豹子头
据：书中：林冲长得“豹头环眼”，绰号“豹子头”。 || The novel: with a panther's head and round eyes, he is called Panther Head.
错：花和尚 || “花和尚”是鲁智深。 || the Flowery Monk is Lu Zhishen.
错：青面兽 || “青面兽”是杨志，脸上有青记。 || the Blue-Faced Beast is Yang Zhi, with his birthmark.
错：智多星 || “智多星”是吴用。 || Wu Yong is the Resourceful Star.
验：从他的相貌对：书里写他“豹头环眼，燕颔虎须”，绰号就从样子来。 || Check by his looks: the nickname comes from his face.

问：“生辰纲”是什么？
答：梁中书送给蔡太师的寿礼
据：第十二至十六回：生辰纲是北京大名府的梁中书送给岳父蔡太师祝寿的十万贯金珠宝贝。 || Chapters 12 to 16: the birthday convoy is the treasure Governor Liang sends his father-in-law, Grand Tutor Cai.
错：皇帝赏给梁山的金银 || 这是送给蔡太师的，不是给梁山的。 || it goes to Cai, not to Liangshan.
错：高太尉送给皇帝的礼物 || 高太尉和生辰纲无关。 || Marshal Gao has nothing to do with it.
错：宋江给父亲的生日礼 || 宋江和生辰纲无关。 || Song Jiang has nothing to do with it.
验：从名字对：“生辰”就是生日，给的正是蔡太师的寿辰。 || Check by the word: the birthday is Cai's.

问：智取生辰纲的计策主要是谁想出来的？
答：吴用
据：第十六回“吴用智取生辰纲”：吴用定下计策，晁盖等人扮成贩枣子的客人。 || Chapter 16: Wu Yong lays the plan, and Chao Gai's band disguise themselves as date sellers.
错：宋江 || 宋江是事后给晁盖通风报信的人。 || Song Jiang only warns Chao Gai afterwards.
错：晁盖 || 晁盖是带头的人，计策出自吴用。 || Chao Gai leads, but the plan is Wu Yong's.
错：公孙胜 || 公孙胜参加了劫取，但计策不是他想的。 || Gongsun Sheng takes part, but the plan is not his.
验：从回目对：第十六回题目就叫“吴用智取生辰纲”。 || Check by the chapter title.

问：吴用的绰号是什么？
答：智多星
据：书中：吴用足智多谋，绰号“智多星”。 || The novel: Wu Yong, rich in schemes, is the Resourceful Star.
错：及时雨 || “及时雨”是宋江。 || Timely Rain is Song Jiang.
错：入云龙 || “入云龙”是公孙胜。 || Dragon in the Clouds is Gongsun Sheng.
错：青面兽 || “青面兽”是杨志。 || the Blue-Faced Beast is Yang Zhi.
验：从他的作用对：智取生辰纲、三打祝家庄都是他出谋划策，名号和他的本领相符。 || Check by his deeds: the birthday convoy, Zhu Village.

问：押送生辰纲的是谁？
答：杨志
据：第十六回：梁中书派杨志押送生辰纲。 || Chapter 16: Governor Liang puts Yang Zhi in charge of the convoy.
错：林冲 || 林冲已在梁山。 || Lin Chong is already on Liangshan.
错：武松 || 武松还没出场。 || Wu Song has not appeared.
错：鲁智深 || 鲁智深在二龙山，没有押送。 || Lu Zhishen guards no convoy.
验：从杨志后来对：丢了生辰纲无法交差，他和鲁智深一起占了二龙山，正因为他是押送人。 || Check by what follows: unable to report back, he joins Lu Zhishen on Twin Dragon Mountain.

问：好汉们是怎样劫走生辰纲的？
答：在酒里下了蒙汗药
据：第十六回：在黄泥冈上，好汉们在一桶酒里下了蒙汗药，让押送的人喝了倒下。 || Chapter 16: on Yellow Mud Ridge they drug a bucket of wine, and the escort drink it and fall.
错：半夜放火偷袭 || 这是白天在冈上，没有放火。 || it is by day, and no fire is set.
错：假扮官兵骗走 || 他们扮的是贩枣子的客人，不是官兵。 || they pose as date sellers, not soldiers.
错：在山路上埋伏硬抢 || 杨志武艺高强，硬抢抢不来，所以要智取。 || Yang Zhi is too strong to rob; they must outwit him.
验：从“智取”二字对：用药酒骗人上当，正是“智”而不是“力”。 || Check by the word “outwit”: drugged wine, not force.

问：武松在哪里打死了老虎？
答：景阳冈
据：第二十三回“景阳冈武松打虎”：武松喝了十八碗酒，过景阳冈打死了老虎。 || Chapter 23: after eighteen bowls of wine, Wu Song crosses Jingyang Ridge and kills the tiger.
错：野猪林 || 野猪林是鲁智深救林冲的地方。 || Wild Boar Forest is where Lu Zhishen saves Lin Chong.
错：沂岭 || 沂岭是李逵杀四只虎的地方。 || Yi Ridge is where Li Kui kills four tigers.
错：快活林 || 快活林是武松打蒋门神的地方。 || Happy Grove is where Wu Song beats Jiang.
验：从酒店的招牌对：冈下酒家挂着“三碗不过冈”，武松偏喝了十八碗再过冈，正是景阳冈。 || Check by the inn sign: “three bowls and you won't cross the ridge”.

问：武松打虎以后，当了什么差事？
答：阳谷县的都头
据：第二十三回：武松打虎后，阳谷县知县赏识他，让他当了步兵都头。 || Chapter 23: after the tiger, the magistrate of Yanggu makes him constable of foot soldiers.
错：禁军的教头 || 禁军教头是林冲。 || the drill instructor is Lin Chong.
错：渭州的提辖 || 渭州提辖是鲁达。 || the Weizhou captain is Lu Da.
错：郓城县的押司 || 郓城押司是宋江。 || the Yuncheng clerk is Song Jiang.
验：从下一段情节对：他在阳谷县街上遇见哥哥武大郎，正因为在那里当了都头。 || Check by what follows: he meets his brother in Yanggu's streets.

问：武松醉打蒋门神，是为谁出头？
答：施恩
据：第二十九回“武松醉打蒋门神”：施恩的快活林酒店被蒋门神霸占，武松替施恩夺回。 || Chapter 29: Jiang the Door God has seized Shi En's tavern in Happy Grove, and Wu Song wins it back.
错：宋江 || 宋江和这件事无关。 || Song Jiang has no part in it.
错：张青 || 张青是十字坡开店的菜园子，后来送武松头陀衣服。 || Zhang Qing keeps the inn at Crossroads Slope and later gives him a pilgrim's robe.
错：金老 || 金老是鲁达救的人。 || old Jin is Lu Da's charge.
验：从施恩对武松的照顾对：武松在牢里受施恩照顾，才答应替他出头，是报恩。 || Check by the debt: Shi En cared for him in prison.

问：武松的绰号是什么？
答：行者
据：第三十一、三十二回：武松血溅鸳鸯楼后，张青夫妇给他扮成头陀，从此人称“行者”。 || Chapters 31 and 32: after the bloodshed at Mandarin Duck Tower, Zhang Qing dresses him as an itinerant monk, and he is the Pilgrim.
错：花和尚 || “花和尚”是鲁智深。 || the Flowery Monk is Lu Zhishen.
错：豹子头 || “豹子头”是林冲。 || Panther Head is Lin Chong.
错：黑旋风 || “黑旋风”是李逵。 || Black Whirlwind is Li Kui.
验：从他的打扮对：头陀打扮、戴戒箍，所以叫“行者”。 || Check by his dress: a pilgrim's band and robe.

问：宋江的绰号是什么？
答：及时雨
据：书中：宋江仗义疏财，常救人急难，江湖上称他“及时雨”。 || The novel: generous and quick to help, Song Jiang is called Timely Rain.
错：智多星 || “智多星”是吴用。 || the Resourceful Star is Wu Yong.
错：玉麒麟 || “玉麒麟”是卢俊义。 || the Jade Unicorn is Lu Junyi.
错：小旋风 || “小旋风”是柴进。 || the Little Whirlwind is Chai Jin.
验：从“雨”字对：干旱时下雨最可贵，宋江在别人急难时出手，正像及时雨。 || Check by the rain: welcome in a drought, like his help.

问：宋江在上梁山以前是做什么的？
答：郓城县的押司
据：第十八回以后：宋江是山东郓城县的押司。 || From chapter 18: Song Jiang is a clerk in Yuncheng county.
错：东京的教头 || 东京的教头是林冲。 || the capital's instructor is Lin Chong.
错：阳谷县的都头 || 阳谷县都头是武松。 || the Yanggu constable is Wu Song.
错：渭州的提辖 || 渭州提辖是鲁达。 || the Weizhou captain is Lu Da.
验：从私放晁盖对：他在县衙当差，才能先得知官府要抓晁盖的消息。 || Check by the warning: working in the county office, he hears of Chao Gai's arrest first.

问：宋江为什么杀了阎婆惜？
答：她拿晁盖的信要挟他
据：第二十一回“宋江怒杀阎婆惜”：阎婆惜拿到晁盖写给宋江的信，要挟他交出金子，宋江一怒杀了她。 || Chapter 21: Yan Poxi finds Chao Gai's letter and blackmails him; in rage Song Jiang kills her.
错：她偷光了宋江的钱 || 她没有偷钱；她要的是晁盖送来的一百两金子，拿信逼宋江交出来。 || she steals nothing; she demands the hundred taels of gold Chao Gai sent, using the letter.
错：她骂了宋江的父亲 || 宋太公在书里没卷进这件事，争吵只为那封信。 || Song's father has no part in it; the quarrel is only over the letter.
错：她要逃回娘家去 || 她不想走，她要的是宋江写休书让她改嫁张文远，同时交金子。 || she is not running home; she wants a release to marry Zhang Wenyuan, and the gold.
验：从信的分量对：私通梁山是死罪，她拿信要挟，宋江才不得不下手。 || Check by the letter: dealings with Liangshan were a capital crime.

问：李逵的绰号是什么？
答：黑旋风
据：书中：李逵长得黑，性子急，绰号“黑旋风”。 || The novel: dark and fierce, Li Kui is the Black Whirlwind.
错：行者 || “行者”是武松。 || the Pilgrim is Wu Song.
错：及时雨 || “及时雨”是宋江。 || Timely Rain is Song Jiang.
错：豹子头 || “豹子头”是林冲。 || Panther Head is Lin Chong.
验：从“旋风”对：他打起仗来抡着板斧冲进人群，像一阵旋风。 || Check by the whirlwind: axes whirling into the crowd.

问：李逵常用的兵器是什么？
答：两把板斧
据：书中：李逵使两把板斧。 || The novel: Li Kui fights with two broad axes.
错：一条禅杖 || 禅杖是鲁智深的。 || the staff is Lu Zhishen's.
错：一杆长枪 || 长枪是林冲的。 || the spear is Lin Chong's.
错：两口戒刀 || 两口戒刀是武松的。 || the two monk's swords are Wu Song's.
验：从他杀虎对：沂岭杀虎时他也是拿着刀斧上前，板斧是他的标志。 || Check by Yi Ridge: he goes at the tigers with his blades.

问：李逵接母亲上梁山时，发生了什么事？
答：母亲被虎吃了，他杀了四只虎
据：第四十三回“黑旋风沂岭杀四虎”：李逵背母亲上梁山，在沂岭去找水时，母亲被老虎吃了，他杀了四只虎。 || Chapter 43: carrying his mother to Liangshan, Li Kui goes for water on Yi Ridge; tigers eat her, and he kills four.
错：母亲被官兵抓走了 || 官兵来抓是李达报官的事，李逵背着母亲逃过了，母亲最后死于老虎。 || the soldiers come after Li Da reports him, but he escapes with her; tigers kill her.
错：母亲不肯离开家乡 || 不肯走的不是母亲；她愿意跟儿子去，是李逵的哥哥李达去报了官。 || she goes willingly; it is his brother Li Da who reports him.
错：母亲病死在半路上 || 她眼睛瞎了，但不是病死在路上；李逵去找水时她被虎吃了。 || she is blind but does not die of illness; tigers take her while he fetches water.
验：对照武松打虎：武松打虎是为过冈，李逵杀虎是为母亲报仇，一个是一只，一个是四只。 || Set it beside Wu Song: one tiger to cross a ridge, four for a mother.

问：哪一句最符合李逵的性格？
答：鲁莽直率，对宋江忠心
据：书中：李逵性子急、说话直，对宋江忠心耿耿。 || The novel: hot-tempered and blunt, Li Kui is utterly loyal to Song Jiang.
错：足智多谋，做事谨慎 || 足智多谋的是吴用。 || resource and caution are Wu Yong's.
错：贪生怕死，见钱眼开 || 他不怕死，也不贪财。 || he fears no death and craves no wealth.
错：文质彬彬，爱读诗书 || 他是粗人，不读诗书。 || he is no scholar.
验：从结局对：宋江临死怕他造反，叫他一起喝毒酒，他说“生时伏侍哥哥，死了也只是哥哥部下的一个小鬼”。 || Check by the end: told to drink poison with Song Jiang, he says he will serve him in death as in life.

问：宋江三打祝家庄，最后是怎样攻破的？
答：派人假装投奔，里应外合
据：第五十回：孙立等人假装来帮祝家庄，混进庄里，和梁山军里应外合攻破了祝家庄。 || Chapter 50: Sun Li and his band pretend to aid Zhu Village, get inside, and open it to Liangshan from within.
错：放一把大火烧了庄子 || 书里第三次破庄靠的不是放火，是孙立一伙混进庄里做内应。 || the third attack does not burn the village; it wins through Sun Li's men inside.
错：挖开河水淹了庄子 || 水淹是《三国演义》里关羽水淹七军一类的打法，祝家庄没有被水淹。 || flooding is Guan Yu's tactic in Three Kingdoms; Zhu Village is never flooded.
错：围住庄子把人饿出来 || 前两次梁山都是硬攻，并没有围住庄子等它断粮。 || the first two attacks are assaults; no one starves the village out.
验：从“三打”对：前两次硬打都失败了，第三次改用计谋才成功，正是里应外合。 || Check by the three attacks: force fails twice, a ruse succeeds.

问：晁盖是怎样死的？
答：攻打曾头市时中了毒箭
据：第六十回“晁天王曾头市中箭”：晁盖攻打曾头市，中了史文恭的毒箭而死。 || Chapter 60: attacking Zeng Fortress, Chao Gai is struck by Shi Wengong's poisoned arrow and dies.
错：被宋江设计害死 || 射箭的是曾头市的史文恭，宋江没有设计害他。 || the archer is Shi Wengong of Zeng Fortress; Song Jiang plots nothing.
错：在梁山病死 || 他是中箭后箭毒发作而死，不是在山上病死。 || he dies of the poisoned arrow, not of illness on the mountain.
错：被官兵活捉处死 || 晁盖没被官兵捉过，他死在攻打曾头市的阵前。 || he is never captured; he falls in the attack on Zeng Fortress.
验：从他的遗言对：他说谁捉住射死他的人谁就做山寨之主，后来卢俊义捉了史文恭，正接上。 || Check by his last words: whoever takes the archer leads; Lu Junyi does.

问：梁山泊排座次时，一共有多少位好汉？
答：一百零八位
据：第七十一回：石碣上刻着三十六天罡、七十二地煞，一共一百零八位好汉。 || Chapter 71: the stone tablet lists thirty-six heavenly and seventy-two earthly stars, a hundred and eight heroes.
错：七十二位 || 七十二是地煞星的数。 || seventy-two are the earthly stars.
错：三十六位 || 三十六是天罡星的数。 || thirty-six are the heavenly stars.
错：一百位 || 一百是个凑整的数，石碣上是三十六加七十二，不是一百。 || a hundred is a round guess; the tablet gives 36 plus 72.
验：从天罡地煞相加对：三十六加七十二，正好一百零八。 || Check by the sum: 36 + 72 = 108.

问：排座次以后，坐第一把交椅的是谁？
答：宋江
据：第七十一回：排座次时，宋江坐了第一把交椅。 || Chapter 71: in the ranking Song Jiang takes the first seat.
错：晁盖 || 晁盖在第六十回就死了。 || Chao Gai died in chapter 60.
错：卢俊义 || 卢俊义坐第二把交椅。 || Lu Junyi takes the second.
错：吴用 || 吴用坐第三把交椅。 || Wu Yong takes the third.
验：从晁盖之死对：晁盖死后宋江先代管山寨，排座次时坐了第一位。 || Check by the succession: after Chao Gai, Song Jiang leads.

问：梁山好汉打出的旗号是什么？
答：替天行道
据：书中：梁山泊立起杏黄旗，上书“替天行道”。 || The novel: Liangshan raises an apricot banner reading “Act on Heaven's behalf”.
错：天下大同 || “天下大同”是《礼记》里的理想，不是梁山的旗号。 || “Great Harmony” is the Book of Rites' ideal, not Liangshan's banner.
错：扶清灭洋 || “扶清灭洋”是清末义和团的口号。 || “Support the Qing, destroy the foreign” is the Boxers'.
错：均贫富 || “均贫富”是宋代农民起义提过的口号，不是梁山的旗号。 || “Equalise rich and poor” was raised by other Song risings, not by Liangshan.
验：从忠义堂对：聚义厅改叫“忠义堂”，旗上写“替天行道”，两样都是宋江的主张。 || Check by the hall renamed Loyalty: both are Song Jiang's line.

问：梁山好汉最后的结局怎样？
答：接受招安后死的死，散的散
据：后半部：好汉们接受招安，征辽、征方腊，死的死、散的散，宋江最后被奸臣毒死。 || The later chapters: accepting amnesty, they fight the Liao and Fang La; most die or scatter, and Song Jiang is poisoned by ministers.
错：打下东京当了皇帝 || 他们接受招安，没有当皇帝。 || they take the amnesty; no throne.
错：一直在梁山快活到老 || 他们离开了梁山。 || they leave Liangshan.
错：全部被官兵剿灭 || 他们不是被剿灭，而是招安后在征战中死散。 || they are not crushed; they die in the emperor's wars.
验：从宋江和李逵对：宋江喝毒酒，又让李逵陪死，正是招安后的悲剧结局。 || Check by Song Jiang and Li Kui: poison, the tragedy of amnesty.

问：许多好汉被逼上梁山，这反映了什么？
答：官逼民反的社会现实
据：全书：林冲、杨志、武松等人本来不想造反，都是被官府逼得走投无路才上梁山。 || The book as a whole: Lin Chong, Yang Zhi, Wu Song and others never meant to rebel; corrupt officials drove them to it.
错：好汉们都爱打打杀杀 || 他们并不是爱打杀，而是被逼的。 || they did not love bloodshed; they were driven.
错：梁山上的生活很富足 || 书里写的是被逼，不是去享福。 || it is compulsion, not comfort, that brings them.
错：朝廷对百姓非常宽厚 || 朝廷正是逼他们的一方。 || the court is what drives them.
验：从林冲对：他是禁军教头，最想安稳过日子，却被高太尉一步步逼上梁山，正是“官逼民反”。 || Check by Lin Chong: he wanted only peace, and was driven step by step.
`,
  },
  {
    id: "jane-eyre",
    grade: 9,
    title: { en: "Jane Eyre", zh: "简·爱" },
    author: { en: "Charlotte Brontë", zh: "夏洛蒂·勃朗特" },
    guide: {
      en: "Jane tells her own story, from an orphan bullied in her aunt's house, through a hard charity school, to a governess at Thornfield who loves her employer, leaves him when she learns the truth, and returns to him of her own free will. Follow the places in order, Gateshead, Lowood, Thornfield, the house on the moor where she is taken in, and Ferndean, and note at each what she suffers and what she chooses. Ask what she will not give up, whatever it costs her: her self-respect, her belief that a poor plain woman is equal in spirit to anyone, and her wish to love and be loved freely. Compare the people round her, Helen Burns and Miss Temple, Mr Rochester and St John Rivers, and what each of them teaches her or asks of her. The book was written in England in the 1840s, when a woman without money had few choices; read Jane's choices against that.",
      zh: "这部小说由简·爱自己讲述：她从舅妈家受欺负的孤女，到条件艰苦的慈善学校，再到桑菲尔德庄园当家庭教师；她爱上了庄园的主人，得知真相后离开了他，最后又凭自己的意愿回到他身边。按顺序记下她到过的地方：盖茨黑德府、洛伍德学校、桑菲尔德庄园、收留她的荒原上的那户人家、芬丁庄园，在每一处旁边写下她受了什么苦、作了什么选择。想一想，不管付出什么代价，她始终不肯放弃的是什么：她的自尊，她相信一个贫穷、不美的女子在精神上和任何人都是平等的，还有她要自由地爱、也被人爱的愿望。比较她身边的人：海伦·彭斯和谭波尔小姐，罗切斯特和圣约翰，想一想他们各自教给了她什么、又要她做什么。这本书写于十九世纪四十年代的英国，那时一个没有钱的女子很少有选择的机会；把简的选择放到这样的背景下去读。",
    },
    callout: {
      en: "Jane's life moves through places, Gateshead, Lowood, Thornfield, Moor House, and each has its own people. Place the question in its place before you choose; Mrs Reed's cruelty is not Mr Brocklehurst's.",
      zh: "简·爱的经历按地方展开：盖茨黑德、劳渥德、桑菲尔德、沼泽居，每处有各自的人。选之前先把问题放回那个地方；里德太太的冷酷不是布罗克尔赫斯特的。",
    },
    questions: `
问：《简·爱》的作者是谁？
答：夏洛蒂·勃朗特
据：《简·爱》1847年出版，作者是英国的夏洛蒂·勃朗特，最初署名“柯勒·贝尔”。 || Jane Eyre came out in 1847 by Charlotte Brontë, first under the name Currer Bell.
错：艾米莉·勃朗特 || 艾米莉·勃朗特是夏洛蒂的妹妹，她写的是《呼啸山庄》。 || Emily Brontë, her sister, wrote Wuthering Heights.
错：狄更斯 || 狄更斯写的是《雾都孤儿》《大卫·科波菲尔》。 || Dickens wrote Oliver Twist and David Copperfield.
错：笛福 || 笛福写的是《鲁滨逊漂流记》。 || Defoe wrote Robinson Crusoe.
验：从第40题对：勃朗特三姐妹里写《呼啸山庄》的是艾米莉，写《简·爱》的是姐姐夏洛蒂。 || Check against the sisters: Emily wrote Wuthering Heights, Charlotte this one.

问：《简·爱》的作者是哪国作家？
答：英国
据：勃朗特一家住在英格兰约克郡的哈沃斯，书里的盖茨黑德、洛伍德、桑菲尔德都在英格兰北部。 || The Brontës lived at Haworth in Yorkshire, and Gateshead, Lowood and Thornfield are all in northern England.
错：法国 || 法国是阿黛勒和她母亲的故乡，不是作者的国家。 || France is Adèle's homeland, not the author's.
错：美国 || 美国在书里没有出现。 || America plays no part in the book.
错：俄国 || 俄国作家是托尔斯泰、屠格涅夫那一类，勃朗特是英国人。 || Russian writers are Tolstoy or Turgenev; Brontë is English.
验：从书里的远方对：要去传教的地方是英国的殖民地印度，罗切斯特的妻子来自西印度群岛，都是从英国看出去的“远方”。 || Check by the far places: India and the West Indies are distant lands seen from England.

问：《简·爱》大约写于什么时候？
答：十九世纪
据：小说1847年出版，夏洛蒂·勃朗特生于1816年、卒于1855年，正是十九世纪。 || Published 1847; Charlotte Brontë lived 1816 to 1855, the nineteenth century.
错：十五世纪 || 十五世纪英国还没有长篇小说。 || in the fifteenth century England had no novels yet.
错：十七世纪 || 十七世纪还早；连《鲁滨逊漂流记》也是1719年，十八世纪才出。 || the seventeenth is too early; even Robinson Crusoe came out in 1719.
错：二十世纪末 || 二十世纪末离作者去世已经一百多年。 || the late twentieth century is more than a century after her death.
验：从书里的交通对：简去桑菲尔德、离开桑菲尔德都坐马车，还没有坐火车的情节，是十九世纪上半叶的英国。 || Check by travel: Jane goes everywhere by coach, early nineteenth-century England.

问：这部小说是用什么人称来讲述的？
答：第一人称，由简自己讲述
据：全书由简用“我”来讲，最后一章开头就是“读者，我嫁给了他”。 || Jane tells it as “I”; the last chapter opens “Reader, I married him.”
错：第三人称，由一位旁观者讲述 || 书里没有旁观者，简自己说“我”。 || there is no onlooker; Jane says “I”.
错：由罗切斯特写的日记组成 || 书里没有罗切斯特的日记，他的往事是他自己对简讲的。 || there is no diary; Rochester tells his past to Jane.
错：由几个人轮流讲述 || 只有简一个人讲，别人的事都是从简听来的。 || Jane alone narrates; others' stories reach us through her.
验：从她对读者说话对：她常直接说“读者”，只有讲故事的人自己才能这样跟读者说话。 || Check by the asides: she speaks to “reader” directly.

问：简小时候为什么住在舅妈里德太太家？
答：她的父母都去世了
据：第二、三章：简的父亲是牧师，父母都染上伤寒去世，舅舅里德先生收养了她，临死前叫太太答应照顾她。 || Chapters 2 and 3: her clergyman father and her mother died of typhus; her uncle Reed took her in and made his wife promise to keep her.
错：她的父母去外国工作了 || 她的父母没有出国，是病死的。 || her parents went nowhere; they died.
错：她自己离家出走了 || 她太小了，是被舅舅接去的，不是自己跑去的。 || she was a baby, brought by her uncle.
错：舅妈花钱买下了她 || 书里没有买卖孩子的事，是舅舅收养的。 || no one bought her; her uncle adopted her.
验：从红房子对：舅舅就死在那间红房子里，简被关进去时最怕的就是舅舅的鬼魂，可见是舅舅收养了她。 || Check by the red room: her uncle died in it, which is why it frightens her.

问：表哥约翰·里德欺负简，简还了手以后，受到了什么惩罚？
答：被关进了一间阴森的“红房子”
据：第一、二章：约翰·里德拿书砸简，简还手，被关进了舅舅去世的那间“红房子”。 || Chapters 1 and 2: John Reed throws a book at her, she fights back, and she is locked in the red room where her uncle died.
错：被赶到街上过夜 || 她没有被赶到街上，是关在屋里。 || she is not turned out; she is locked in.
错：一整天不许吃饭 || 书里没写罚饿，罚的是关房间。 || no fast; the punishment is the room.
错：被送去当了女仆 || 当女仆是她后来担心的出路，这时并没有被送去。 || she is not sent to service.
验：从后果对：她在红房子里吓昏过去，药剂师劳埃德先生来看她，才提议送她去上学。 || Check by what follows: she faints there, and Mr Lloyd's visit leads to school.

问：里德太太后来把简送到了哪里？
答：洛伍德慈善学校
据：第四、五章：里德太太把简交给布洛克赫斯特先生，送到洛伍德慈善学校。 || Chapters 4 and 5: Mrs Reed hands her to Mr Brocklehurst and sends her to Lowood, a charity school.
错：桑菲尔德庄园 || 桑菲尔德是她十八岁后去当家庭教师的地方。 || Thornfield is where she goes as a governess at eighteen.
错：一所伦敦的大学 || 书里没有大学，那时女孩也上不了大学。 || there is no university; girls could not go then.
错：一位亲戚的农场 || 书里没有亲戚的农场；收留她的表亲住在荒原的沼泽居。 || there is no farm; her cousins live at Moor House.
验：从“慈善”二字对：洛伍德收的是孤儿和穷人家的女孩，正合里德太太不想花钱养她的心思。 || Check by “charity”: it took orphans cheaply, as Mrs Reed wished.

问：洛伍德学校的生活条件怎样？
答：吃不饱，穿不暖，后来还流行了伤寒
据：第五至九章：洛伍德饭菜常常是糊的，冬天冷得冻手，春天流行伤寒，许多学生病死。 || Chapters 5 to 9: burnt porridge, freezing winters, and a typhus outbreak in spring that kills many girls.
错：吃得好，住得也很舒服 || 饭菜常是烧糊的粥，简第一天就没吃下去。 || the porridge is burnt; Jane cannot eat it on her first day.
错：只上半天课，其余时间玩 || 她们整天上课、做针线，休息时也冷得发抖。 || they study and sew all day.
错：学生都是有钱人家的孩子 || 学生多是孤儿，有钱人家的孩子不会进慈善学校。 || they are mostly orphans; rich girls would not attend.
验：从布洛克赫斯特一家对：他自己的妻女穿丝绒戴皮毛来参观，却要学生剪掉卷发、节衣缩食，对比出学校的苦。 || Check by his family: silk and furs for them, hunger for the girls.

问：学校的主管当众说简是一个说谎的孩子，并罚她做什么？
答：站在凳子上让全校的人看
据：第七章：布洛克赫斯特先生当众说简是说谎的孩子，罚她站在凳子上半个小时，不许人跟她说话。 || Chapter 7: Mr Brocklehurst calls her a liar before the school and makes her stand on a stool for half an hour.
错：在雨里跑十圈 || 书里没有罚跑圈。 || there is no running.
错：抄写一整本书 || 书里没有罚抄书。 || there is no copying.
错：一个人打扫全校 || 打扫不是她受的罚；海伦受的罚是挨打和戴“邋遢”的牌子。 || cleaning is not it; Helen's punishments are the rod and the “slattern” label.
验：从海伦对：简站在凳子上时，海伦走过朝她笑了一笑，给了她勇气，罚的正是“让人看”。 || Check by Helen: she passes and smiles at Jane on the stool.

问：简在洛伍德最好的朋友是谁？
答：海伦·彭斯
据：第六至九章：简在洛伍德最好的朋友是海伦·彭斯。 || Chapters 6 to 9: her closest friend at Lowood is Helen Burns.
错：阿黛勒 || 阿黛勒是她后来在桑菲尔德教的学生。 || Adèle is her pupil later at Thornfield.
错：伯莎·梅森 || 伯莎·梅森是罗切斯特关在阁楼上的妻子。 || Bertha Mason is Rochester's wife in the attic.
错：英格拉姆小姐 || 英格拉姆小姐是罗切斯特假装追求的贵族小姐。 || Miss Ingram is the lady Rochester pretends to court.
验：从海伦临终对：简偷偷溜到她床上陪她过了最后一夜，这是最好的朋友才会做的事。 || Check by the last night: Jane slips into her bed to be with her.

问：海伦·彭斯是一个什么样的人？
答：受了委屈也能忍耐、宽容别人
据：第六章：海伦挨了罚也不辩解，说要“以德报怨”，宽容对待别人。 || Chapter 6: Helen accepts punishment without complaint and speaks of returning good for evil.
错：脾气火爆，常和老师吵架 || 脾气火爆、敢顶撞的是小时候的简自己，海伦正相反。 || the hot temper is young Jane's; Helen is the opposite.
错：爱打扮，看不起穷同学 || 爱打扮的是布洛克赫斯特的妻女，海伦被骂邋遢也不在乎。 || finery belongs to Brocklehurst's family; Helen is called a slattern.
错：胆小怕事，从不说话 || 海伦很会说话，跟简谈信仰、谈忍耐，一谈就是很久。 || she talks long with Jane about faith and patience.
验：从两人的对比对：简说受了不公平就要反抗，海伦却劝她忍耐，作者正用海伦来衬托简。 || Check by contrast: Jane would fight back; Helen counsels patience.

问：海伦·彭斯后来怎么样了？
答：因肺病去世了
据：第九章：海伦得了肺病（痨病），在谭波尔小姐的房间里，在简的怀里去世。 || Chapter 9: Helen dies of consumption in Miss Temple's room, in Jane's arms.
错：考上了大学 || 那时女孩上不了大学，她也没有活到那时。 || girls could not go, and she did not live so long.
错：嫁给了有钱人 || 她死时还是个女孩，没有出嫁。 || she dies a girl, unmarried.
错：成了学校的校长 || 当了教师的是简，海伦没有。 || it is Jane who becomes a teacher.
验：从坟墓对：多年后她的墓上刻着拉丁文“我将复活”，是简后来立的。 || Check by the grave: “Resurgam”, the stone Jane later placed.

问：哪一位老师为简洗清了说谎的罪名？
答：谭波尔小姐
据：第八章：谭波尔小姐写信给药剂师劳埃德先生核实，当众宣布简没有说谎。 || Chapter 8: Miss Temple writes to Mr Lloyd and then declares before the school that Jane is cleared.
错：费尔法克斯太太 || 费尔法克斯太太是桑菲尔德的管家，那时简还没见过她。 || Mrs Fairfax is Thornfield's housekeeper, not met yet.
错：里德太太 || 里德太太正是说简撒谎的人。 || Mrs Reed is the one who called her a liar.
错：格雷斯·普尔 || 格雷斯·普尔是桑菲尔德的女仆。 || Grace Poole is a Thornfield servant.
验：从劳埃德先生对：他正是在红房子之后来看过简的人，他的回信能证明简说的是实话。 || Check by Mr Lloyd: he saw Jane after the red room and could confirm her story.

问：简在洛伍德学校一共待了多少年？
答：先当了六年学生，又当了两年教师
据：第十章：简在洛伍德当了六年学生，又当了两年教师，一共八年。 || Chapter 10: six years as a pupil and two as a teacher, eight in all.
错：只待了一个学期 || 一个学期太短，她站凳子、交朋友、经历伤寒都在头一年里，后来还当了老师。 || a term is too short; she later taught there.
错：从小到老一直待在那里 || 她十八岁就离开了，去了桑菲尔德。 || she leaves at eighteen for Thornfield.
错：待了一年就逃走了 || 她没有逃走；悄悄出走是后来离开桑菲尔德的事。 || she does not run away; that is her flight from Thornfield.
验：从年龄对：她十岁进洛伍德，十八岁登报找工作，正好八年。 || Check by age: in at ten, advertising at eighteen.

问：简离开洛伍德以后，去桑菲尔德庄园做什么？
答：当家庭教师
据：第十章、十一章：简登报求职，费尔法克斯太太回信，请她去桑菲尔德当家庭教师。 || Chapters 10 and 11: she advertises, and Mrs Fairfax engages her as governess at Thornfield.
错：当厨师 || 厨房里有别的仆人，她教书。 || there are servants for the kitchen; she teaches.
错：当女主人 || 女主人要等她嫁给罗切斯特，婚礼却被打断了。 || mistress would come by marriage, which is stopped.
错：当医生 || 书里没有女医生，她也没学过医。 || she never studies medicine.
验：从她的学生对：她到了才知道要教的是阿黛勒，正是家庭教师的工作。 || Check by her pupil: Adèle.

问：简在桑菲尔德教的学生是谁？
答：法国小女孩阿黛勒
据：第十一章：她的学生是罗切斯特收养的法国小女孩阿黛勒·瓦伦。 || Chapter 11: her pupil is Adèle Varens, a French girl Rochester took in.
错：表哥约翰·里德 || 约翰·里德是小时候欺负她的表哥，比她大。 || John Reed is the cousin who bullied her.
错：圣约翰的妹妹 || 圣约翰的妹妹是成年人，后来是简的朋友，不是学生。 || St John's sisters are grown women and friends.
错：英格拉姆小姐 || 英格拉姆小姐是来做客的贵族小姐。 || Miss Ingram is a guest.
验：从阿黛勒说法语对：简在洛伍德学过法语，所以能教这个法国孩子。 || Check by French: Jane learned it at Lowood.

问：简第一次见到罗切斯特时，发生了什么事？
答：他的马在结冰的路上滑倒，简上前帮了他
据：第十二章：一月的黄昏，简去村里寄信，罗切斯特的马在结冰的路上滑倒，简上前帮他扶上马。 || Chapter 12: on a January dusk, going to post a letter, Jane helps Rochester when his horse slips on the ice.
错：他在宴会上请简跳舞 || 宴会是后来请客时的事，简坐在角落里，没跳舞。 || the party comes later; Jane sits in a corner.
错：他在学校里给简上课 || 罗切斯特没有在学校教过书。 || Rochester never teaches in a school.
错：他在街上抢了简的钱包 || 书里没有抢钱包的事。 || there is no robbery.
验：从那条狗对：她回到庄园，看见那只叫派洛特的狗在客厅里，才知道刚才的骑马人就是主人。 || Check by the dog Pilot: she finds it at the house and knows who the rider was.

问：一天夜里，罗切斯特的房间着火了，是谁救了他？
答：简
据：第十五章：深夜罗切斯特床上着火，简泼水把火浇灭，叫醒了他。 || Chapter 15: at night his bed is on fire; Jane douses it and wakes him.
错：阿黛勒 || 阿黛勒是个小孩，正睡着。 || Adèle is a child asleep.
错：费尔法克斯太太 || 费尔法克斯太太住得远，没被叫醒，罗切斯特也不让告诉她。 || Mrs Fairfax sleeps far off and is not told.
错：圣约翰 || 那时简还不认识圣约翰。 || Jane does not yet know St John.
验：从罗切斯特的反应对：他握着简的手不肯放，从这一夜起两人的感情明显近了。 || Check by his response: he holds her hand and will not let go.

问：桑菲尔德庄园里常常传出奇怪的笑声，简一开始以为是谁发出的？
答：女仆格雷斯·普尔
据：第十一至十六章：费尔法克斯太太说笑声是女仆格雷斯·普尔，简也就这样以为。 || Chapters 11 to 16: Mrs Fairfax says it is the servant Grace Poole, and Jane believes it.
错：罗切斯特 || 罗切斯特不在家时也有笑声，简没怀疑过他。 || the laughter sounds while he is away.
错：阿黛勒 || 阿黛勒的笑是孩子的笑，简认得。 || Adèle's laugh is a child's.
错：费尔法克斯太太 || 正是费尔法克斯太太告诉简是格雷斯，她自己不会笑得那样怪。 || it is Mrs Fairfax who names Grace.
验：从婚礼那天对：揭开真相时，真正的笑声来自伯莎，格雷斯·普尔是看守她的人。 || Check by the wedding day: the laugh is Bertha's; Grace is her keeper.

问：罗切斯特让简以为他要娶英格拉姆小姐，是为了什么？
答：试探简是不是真的爱他
据：第二十四章：罗切斯特说他假装追求英格拉姆小姐，是想让简像他爱她一样爱他。 || Chapter 24: Rochester says he courted Miss Ingram to make Jane love him as he loved her.
错：想把简赶走 || 他恰恰想把简留下，还说要给她另找差事是在试她。 || he wants her to stay; the talk of a new post is part of the test.
错：想得到英格拉姆家的庄园 || 罗切斯特还故意散布自己钱少，英格拉姆家就冷淡了，他不图她家的产业。 || he spreads word his fortune is small; he wants nothing of theirs.
错：想让阿黛勒有个母亲 || 他反倒说要把阿黛勒送去上学。 || he means to send Adèle to school.
验：从英格拉姆小姐对：她一听说罗切斯特钱不多就冷淡了，罗切斯特正借此看清谁真心。 || Check by Miss Ingram: she cools when told he is poor.

问：简向罗切斯特说出心里话时，最想表达的是什么？
答：自己虽然贫穷、不美，在精神上却和他是平等的
据：第二十三章：简说：“你以为我穷、低微、不美、矮小，我就没有灵魂没有心吗？”我们在精神上是平等的。 || Chapter 23: “Do you think, because I am poor, obscure, plain, and little, I am soulless and heartless?” Their spirits are equal.
错：自己想要他的财产 || 她不要他的财产，后来连他送的珠宝衣料都推辞。 || she refuses even his jewels and silks.
错：自己从来没有爱过他 || 她正是在表白自己爱他。 || it is a confession of love.
错：自己想马上离开英国 || 她说的是不愿离开他，即使被派去爱尔兰也伤心。 || she grieves at the thought of being sent to Ireland.
验：从结果对：罗切斯特听完这番话就向她求婚，正因为她说出了平等的爱。 || Check by the result: he proposes then.

问：简和罗切斯特的婚礼为什么被打断了？
答：有人说出罗切斯特已经有妻子伯莎，她被关在阁楼上
据：第二十六章：律师布里格斯和梅森在教堂里说出罗切斯特十五年前已娶了伯莎·梅森，她就关在桑菲尔德三楼。 || Chapter 26: the lawyer Briggs and Mason declare in church that Rochester married Bertha Mason fifteen years ago and she lives on the third floor.
错：简在婚礼前生了一场大病 || 简没有生病，婚礼当天到了教堂。 || Jane is well and at the church.
错：罗切斯特的庄园突然着了火 || 庄园着火是简离开以后的事。 || the fire comes after she leaves.
错：简的舅妈来阻止了婚礼 || 里德太太那时已经去世了。 || Mrs Reed is already dead.
验：从那封信对：简写信告诉叔叔要结婚，叔叔托梅森去阻止，所以梅森才赶来。 || Check by her letter: her uncle heard and sent Mason.

问：知道真相以后，简怎样做？
答：虽然还爱着他，仍然悄悄离开了桑菲尔德
据：第二十七章：罗切斯特求她跟他去法国南部，简虽然爱他，仍在天亮前悄悄离开。 || Chapter 27: he begs her to come to the south of France; loving him still, she leaves before dawn.
错：留下来做了庄园的女主人 || 她不肯在他有妻子时做他的情人，所以走了。 || she will not be his mistress while his wife lives.
错：去法院告了罗切斯特 || 书里没有打官司。 || there is no lawsuit.
错：回到舅妈家住了下来 || 舅妈已经去世了，盖茨黑德也没有她的家。 || Mrs Reed is dead; Gateshead is no home.
验：从她留下的东西对：她把罗切斯特送的珍珠项链留下，只带了二十先令，可见是下了决心走的。 || Check by what she leaves: his pearls behind, twenty shillings in her purse.

问：离开桑菲尔德以后，简遇到了什么情况？
答：身上没有钱，在荒原上流浪，几乎饿死
据：第二十八章：她坐马车到惠特克劳斯，把包落在车上，身无分文，在荒原上流浪讨饭。 || Chapter 28: set down at Whitcross with her parcel left in the coach, she wanders the moor and begs.
错：马上找到了更好的工作 || 她讨工作被一家家拒绝，后来才在莫尔顿教书。 || she is refused work everywhere first.
错：坐船去了印度 || 去印度是圣约翰后来的打算，她没去。 || India is St John's plan, and she does not go.
错：回到洛伍德当了校长 || 她再没回洛伍德，也没当过校长。 || she never returns to Lowood.
验：从沼泽居对：她饿得倒在圣约翰家门口，被女仆汉娜挡在门外，可见真是快饿死了。 || Check by the doorstep: Hannah turns her away as a beggar.

问：是谁收留了快要饿死的简？
答：圣约翰和他的两个妹妹
据：第二十八、二十九章：牧师圣约翰·里弗斯和妹妹黛安娜、玛丽收留了她。 || Chapters 28 and 29: the clergyman St John Rivers and his sisters Diana and Mary take her in.
错：里德太太 || 里德太太已经去世了。 || Mrs Reed is dead.
错：英格拉姆小姐 || 英格拉姆小姐在她自己的庄园，和简没有来往。 || Miss Ingram has no part here.
错：海伦·彭斯 || 海伦·彭斯早就在洛伍德去世了。 || Helen died long before at Lowood.
验：从后来的血缘对：收留她的正是她不知道的表亲，这一巧合在第三十三章才揭开。 || Check by the twist: they turn out to be her cousins.

问：圣约翰后来给简找了一份什么工作？
答：在乡村小学教穷人家的女孩
据：第三十一章：圣约翰让她在莫尔顿村的乡村小学教穷人家的女孩。 || Chapter 31: St John gives her the village school for poor girls at Morton.
错：在城里的商店卖东西 || 书里没写她卖东西。 || she never works in a shop.
错：在大船上做饭 || 船是圣约翰要去印度时坐的。 || the ship is for St John's India.
错：在医院照顾病人 || 照顾病人是她小时候在洛伍德见过的伤寒，不是她的工作。 || nursing is not her post.
验：从她以前的经历对：她在洛伍德当过两年教师，教书正是她会做的事。 || Check by her past: two years teaching at Lowood.

问：简后来得到了谁留给她的一大笔遗产？
答：她的叔叔
据：第三十三章：她的叔叔约翰·爱在马德拉经商，去世时给她留下两万英镑。 || Chapter 33: her uncle John Eyre, a merchant in Madeira, leaves her twenty thousand pounds.
错：罗切斯特 || 罗切斯特这时并不知道她在哪里。 || Rochester does not know where she is.
错：里德太太 || 里德太太没钱可留，她儿子约翰早已败光家产自杀了。 || Mrs Reed has nothing; John ruined the family.
错：谭波尔小姐 || 谭波尔小姐结婚离开了洛伍德，和遗产无关。 || Miss Temple married and left; she has nothing to do with it.
验：从第三十六题对：里德太太当年瞒下的，正是这位叔叔想收养简的信。 || Check by the letter: the same uncle once wanted to adopt her.

问：得到遗产以后，简是怎样做的？
答：和表哥表姐们平分了这笔钱
据：第三十三、三十四章：她把两万英镑分成四份，自己和三位表亲各得五千。 || Chapters 33 and 34: she divides it into four, five thousand each for herself and her cousins.
错：一个人全留了下来 || 她坚持分，说一个人拿太多不公平。 || she insists it is unjust to keep it all.
错：全部捐给了洛伍德学校 || 书里没写捐给洛伍德。 || she gives nothing to Lowood.
错：用来买了桑菲尔德庄园 || 桑菲尔德烧毁了，她也没买。 || Thornfield is burned; she buys nothing.
验：从她最想要的东西对：她说宁要亲人也不要钱，分钱正是为了有一个家。 || Check by her wish: she would rather have family than money.

问：简后来知道了，圣约翰和她是什么关系？
答：表兄妹
据：第三十三章：圣约翰的母亲是简父亲的姐妹，他们是表兄妹。 || Chapter 33: St John's mother was her father's sister; they are cousins.
错：亲兄妹 || 他们不同父母，不是亲兄妹。 || different parents; not siblings.
错：同学 || 他们没一起上过学。 || they never studied together.
错：师生 || 圣约翰给她找工作，教她印度斯坦语，但不是她的老师那种师生关系。 || he teaches her Hindustani, but they are not teacher and pupil.
验：从遗产对：叔叔约翰·爱也是他们的舅舅，所以遗产本该有他们一份，简才平分。 || Check by the will: the same uncle is theirs too.

问：圣约翰向简求婚，要她和他一起去哪里？
答：去印度传教
据：第三十四章：圣约翰要去印度传教，求简做他的妻子同去。 || Chapter 34: St John is going to India as a missionary and asks her to come as his wife.
错：去法国旅行 || 去法国南部是罗切斯特当初求她去的。 || the south of France is Rochester's plea.
错：回桑菲尔德 || 圣约翰跟桑菲尔德毫无关系。 || St John has nothing to do with Thornfield.
错：去伦敦做生意 || 他不做生意，是牧师。 || he is a clergyman, not a trader.
验：从他教她的语言对：他让她学印度斯坦语，正为了去印度。 || Check by the language: Hindustani.

问：简为什么拒绝了圣约翰的求婚？
答：他们之间没有爱情，他只是需要一个帮手
据：第三十四、三十五章：简说他要的是一个传教的帮手，不是爱人；没有爱的婚姻她不能接受。 || Chapters 34 and 35: he wants a helper, not a beloved; she will not marry without love.
错：圣约翰太穷了 || 简不在乎贫富，她自己穷时也不肯为钱嫁人。 || money never decides her choices.
错：简已经嫁给了别人 || 她那时还没结婚。 || she is not yet married.
错：简不愿意离开那所小学 || 得了遗产后她已经把学校交出去了。 || she has already given up the school.
验：从她的让步对：她说愿意作为妹妹跟他去印度，就是不愿做妻子，可见问题在于没有爱情。 || Check by her offer: she would go as his sister, not his wife.

问：什么让简决定回去找罗切斯特？
答：她好像听到了罗切斯特在远方呼唤她的名字
据：第三十五章：夜里她仿佛听到罗切斯特在远方喊“简！简！简！”，第二天就动身去找他。 || Chapter 35: at night she seems to hear Rochester calling “Jane! Jane! Jane!” and sets out next day.
错：罗切斯特写信请她回去 || 罗切斯特不知道她在哪里，没写过信。 || he does not know where she is and writes nothing.
错：圣约翰劝她回去 || 圣约翰正要她去印度，不会劝她回去。 || St John wants her for India.
错：她在报上看到了庄园要卖的消息 || 书里没写看报。 || there is no newspaper.
验：从罗切斯特那边对：第三十七章他说那夜他也在喊她的名字，并听见她回答，两边对上了。 || Check by Rochester's side: he called her that very night.

问：简回到桑菲尔德时，看到了什么？
答：庄园被大火烧成了废墟
据：第三十六章：桑菲尔德被大火烧成了废墟，旅店老板告诉她是伯莎放的火。 || Chapter 36: Thornfield is a burnt ruin; the innkeeper tells her Bertha set the fire.
错：庄园比以前更热闹了 || 庄园已成废墟，没人住了。 || it is empty ruins.
错：罗切斯特又娶了别人 || 罗切斯特没有再娶。 || he has not remarried.
错：阿黛勒成了庄园的主人 || 阿黛勒在学校里，庄园也没了。 || Adèle is at school.
验：从罗切斯特的住处对：她只好再去芬丁庄园找他，正因为桑菲尔德没法住了。 || Check by Ferndean: he has moved, as Thornfield is gone.

问：那场大火以后，罗切斯特怎么样了？
答：眼睛瞎了，还失去了一只手
据：第三十六章：罗切斯特救火时被砸伤，一只眼睛没了，另一只瞎了，还失去了一只手。 || Chapter 36: hurt in the fire, he loses one eye and the sight of the other, and one hand.
错：一点伤也没有受 || 他受了重伤。 || he is badly hurt.
错：去了外国，再也没回来 || 他住在芬丁庄园，没去外国。 || he lives at Ferndean.
错：在大火中死去了 || 死的是伯莎，她从屋顶跳下摔死了。 || it is Bertha who dies, leaping from the roof.
验：从第三十五题对：结局写他一只眼睛后来渐渐看得见了，可见他活了下来，眼睛受了伤。 || Check by the end: his sight partly returns.

问：小说的结局是怎样的？
答：简和罗切斯特结了婚，罗切斯特的一只眼睛后来渐渐看得见了
据：第三十八章：“读者，我嫁给了他。”两年后罗切斯特一只眼睛恢复视力，看见了他们的儿子。 || Chapter 38: “Reader, I married him.” Two years on, one eye recovers and he sees their son.
错：简和圣约翰一起去了印度 || 圣约翰一个人去了印度，结尾简收到他的信。 || St John goes alone; she gets his letter at the end.
错：简一个人回到了洛伍德 || 她没回洛伍德。 || she does not return to Lowood.
错：简回到了舅妈家，照顾她到老 || 舅妈在第二十一章就去世了。 || Mrs Reed died in chapter 21.
验：从最后一段对：小说结尾写的是圣约翰在印度，可见简没跟他去。 || Check by the last paragraph: it is about St John in India.

问：舅妈里德太太临死前，向简承认了什么？
答：她瞒下了简的叔叔想收养简的信
据：第二十一章：里德太太临死承认，三年前简的叔叔来信想收养简，她回信说简已经死在洛伍德。 || Chapter 21: dying, Mrs Reed confesses that three years ago Jane's uncle wrote to adopt her and she replied that Jane had died at Lowood.
错：她偷了简父母的钱 || 书里没写她偷钱。 || there is no theft.
错：她才是简的亲生母亲 || 简的母亲是里德先生的妹妹，里德太太只是舅妈。 || Jane's mother was Mr Reed's sister.
错：她把简的朋友赶走了 || 简在里德家没有朋友被赶走。 || there is no friend sent away.
验：从第二十六题对：叔叔后来知道简还活着，才托梅森阻止了婚礼，前后呼应。 || Check by the wedding: the uncle knows she lives and sends Mason.

问：简听说舅妈病重，还回去看望她，这表现了简的什么品质？
答：不记旧仇，宽容善良
据：第二十一章：简得知舅妈病重，请假回盖茨黑德，还想和舅妈和解。 || Chapter 21: hearing Mrs Reed is dying, she goes back to Gateshead and seeks to make peace.
错：贪图舅妈的财产 || 里德家已经败落，没钱可给。 || the Reeds are ruined.
错：想向舅妈报复 || 她原谅了舅妈，临别还吻了她。 || she forgives her and kisses her.
错：只是为了离开桑菲尔德 || 她还担心罗切斯特会娶别人，心里想着桑菲尔德。 || she longs to be back at Thornfield.
验：从舅妈的态度对：舅妈到死也不肯和简和解，简却说“我原谅你”，可见宽容在简这一边。 || Check by contrast: Mrs Reed will not forgive; Jane does.

问：哪一句最符合简·爱？
答：自尊自强，敢于反抗，追求平等
据：全书：简小时候反抗表哥，长大后不肯做情人，又拒绝没有爱情的婚姻，一直追求平等和自尊。 || The whole book: she fights John Reed, refuses to be a mistress, refuses a loveless marriage.
错：温顺听话，从不反抗 || 她小时候就敢反抗表哥。 || she fights back as a child.
错：贪图钱财，爱慕虚荣 || 她一个人走了，连珠宝都不要。 || she leaves even the jewels.
错：胆小怕事，没有主见 || 她每一次大事都自己做决定。 || she decides every big step herself.
验：从她拒绝两次婚事对：一次因为不平等，一次因为没爱情，正说明她要的是平等和爱。 || Check by two refusals: one unequal, one loveless.

问：哪一句最符合圣约翰？
答：虔诚坚定，把事业看得比感情还重
据：第三十四章：圣约翰一心要去印度传教，连自己喜欢的奥利弗小姐也放弃了。 || Chapter 34: he gives up Miss Oliver, whom he loves, for the mission.
错：脾气暴躁，粗心大意 || 他冷静克制，不是暴躁粗心。 || he is cold and controlled.
错：贪图享受，不肯吃苦 || 他放弃舒适的生活去印度吃苦。 || he goes to India to suffer.
错：爱说爱笑，没有主见 || 他严肃少笑，而且主意极定。 || he is grave and fixed in purpose.
验：从结局对：小说最后一段写他在印度，信仰坚定，至死不悔。 || Check by the end: in India, firm unto death.

问：夏洛蒂·勃朗特的妹妹艾米莉写了哪部小说？
答：《呼啸山庄》
据：文学史：艾米莉·勃朗特写了《呼啸山庄》。 || Emily Brontë wrote Wuthering Heights.
错：《鲁滨逊漂流记》 || 《鲁滨逊漂流记》是笛福写的。 || Defoe wrote Robinson Crusoe.
错：《傲慢与偏见》 || 《傲慢与偏见》是简·奥斯丁写的。 || Jane Austen wrote Pride and Prejudice.
错：《雾都孤儿》 || 《雾都孤儿》是狄更斯写的。 || Dickens wrote Oliver Twist.
验：从第1题对：姐姐夏洛蒂写《简·爱》，妹妹艾米莉写《呼啸山庄》，同在1847年出版。 || Check by the sisters: both books came out in 1847.

问：《简·爱》主要表现了什么？
答：一个女子追求独立、平等和真正的爱情
据：全书：简从孤女到家庭教师，始终追求独立、平等和真正的爱情。 || The whole book: from orphan to governess, Jane seeks independence, equality and true love.
错：一个穷人怎样发财 || 她得到遗产却平分出去，发财不是主题。 || she shares her fortune away; wealth is not the theme.
错：一场战争的经过 || 书里没有战争。 || there is no war.
错：一次海上探险的经历 || 海上探险是《鲁滨逊漂流记》。 || sea adventure is Robinson Crusoe.
验：从结尾对：她是在自己有了财产、能独立以后才回去和罗切斯特平等地结婚的。 || Check by the end: she returns as an independent equal.
`,
  },
  {
    id: "dream-of-red-chamber",
    grade: 10,
    title: { en: "Dream of the Red Chamber", zh: "红楼梦" },
    author: { en: "Cao Xueqin", zh: "曹雪芹" },
    guide: {
      en: "Start with the frame: a stone left over from the goddess Nüwa's mending of the sky enters the human world, and Baoyu's dream in the Land of Illusion foretells the fates of the girls, so early riddles point to later events. Draw a family tree of the Jia household and the four great families, and mark where each young woman lives in the Grand View Garden. Judge the characters by what they do in scenes such as Daiyu burying flowers, Xifeng running the household or Grannie Liu's visits, not by a single label. Follow the movement from splendour toward decline, and the way poems, names and small details carry hidden meaning.",
      zh: "先读懂小说的框架：女娲补天剩下的一块石头来到人间，宝玉在太虚幻境里的梦预示了众女子的命运，所以前面的判词和曲子都暗示着后面的情节。给贾府和四大家族画一张人物关系图，并标出每位姑娘在大观园里住在哪儿。评价人物要看她们在具体情节里怎么做，比如黛玉葬花、凤姐理家、刘姥姥进大观园，而不是只贴一个标签。留意贾府从繁华走向衰败的趋势，也留意诗词、名字和小细节里藏着的意思。",
    },
    callout: {
      en: "The novel has hundreds of people, and many of its scenes look alike: poems, banquets, illnesses. Before you choose, ask who it is about and in which scene; Daiyu's poem is not Baochai's, and her burial of flowers is not Xiangyun's sleep among peonies.",
      zh: "小说里的人物有几百个，诗会、宴席、生病的场面也很相似。选之前先想清楚问的是谁、在哪一回；黛玉的诗不是宝钗的，黛玉葬花也不是湘云醉卧。",
    },
    questions: `
问：小说开头的那块石头是怎么来的？
答：女娲补天剩下的一块
据：第一回：女娲炼石补天，用了三万六千五百块，单剩一块没用，弃在大荒山青埂峰下。 || Chapter 1: Nüwa smelted stones to mend the sky and used all but one, left at the foot of Greensickness Peak.
错：盘古开天时落下的 || 盘古是开天辟地的神话，书里的石头和他无关。 || Pangu split heaven from earth; the stone has nothing to do with him.
错：东海龙宫里的宝石 || 东海龙宫的宝贝是《西游记》里孙悟空拿走的金箍棒那一类。 || the Dragon King's treasures belong to Journey to the West.
错：天上掉下的星星 || 书里的石头是补天剩下的，不是从天上掉下的星星。 || the stone was left over, not a fallen star.
验：从石头的心情对：它因为别的石头都去补了天，只有自己没用，才“自怨自叹”，想到人间走一遭。 || Check by its grief: it alone was left unused, and so longed for the world.

问：《红楼梦》还有一个书名是什么？
答：《石头记》
据：第一回：书里交代此书原名《石头记》，记的就是那块石头在人间的经历。 || Chapter 1: the book says its first title was The Story of the Stone, the stone's record of its life among men.
错：《金陵记》 || 《金陵十二钗》才是第一回里提到的另一个书名，没有《金陵记》。 || chapter 1 names The Twelve Beauties of Jinling, not a Jinling Record.
错：《大观园》 || 大观园是书里的园子，不是书名。 || Grand View Garden is a place in the book.
错：《风月传》 || 第一回提到的是《风月宝鉴》，不是《风月传》。 || chapter 1 names The Precious Mirror of Love, not a Tale of Love.
验：从第1题对：开头的石头就是故事的记录者，所以叫《石头记》。 || Check by the stone: it is the recorder, hence the title.

问：贾宝玉出生时口里衔着什么？
答：一块通灵宝玉
据：第二回：冷子兴说宝玉“一落胞胎，嘴里便衔下一块五彩晶莹的玉来”。 || Chapter 2: Leng Zixing says Baoyu was born with a bright five-coloured jade in his mouth.
错：一把金锁 || 金锁是薛宝钗戴的。 || the gold lock is Baochai's.
错：一颗珍珠 || “珍珠”是袭人原来的名字，不是宝玉嘴里的东西。 || Pearl was Xiren's first name, not what Baoyu held.
错：一枚金麒麟 || 金麒麟是史湘云戴的。 || the gold kylin is Xiangyun's.
验：从他的名字对：“宝玉”二字就是从这块玉来的。 || Check by his name: “Baoyu” means precious jade.

问：小说中的“四大家族”是哪四家？
答：贾、史、王、薛
据：第四回：门子给贾雨村看的“护官符”写了贾、史、王、薛四家，“皆连络有亲”。 || Chapter 4: the “officials' amulet” lists the Jia, Shi, Wang and Xue, all related by marriage.
错：贾、林、王、薛 || 林家是黛玉的父家，书香门第，不在护官符上。 || the Lins are Daiyu's scholarly family, not on the list.
错：贾、史、王、林 || 这里用林家换掉了薛家，薛蟠打死人一案正是护官符引出来的。 || it drops the Xue, whose son's murder case brings up the list.
错：贾、甄、王、薛 || 甄家是第一回的甄士隐和江南甄家，不在四大家族里。 || the Zhen are Zhen Shiyin and the southern Zhen, not among the four.
验：从亲戚关系对：贾母姓史，王夫人和王熙凤姓王，薛姨妈是王夫人的妹妹，四家都连着亲。 || Check by marriage: Grandmother Jia is a Shi, Lady Wang a Wang, Aunt Xue her sister.

问：林黛玉为什么来到贾府？
答：母亲去世，外祖母接她来
据：第二、三回：黛玉的母亲贾敏去世，外祖母贾母派人来接她进京。 || Chapters 2 and 3: after her mother Jia Min dies, her grandmother sends for her.
错：父亲送她来读书 || 她在家已跟贾雨村读书了，进京不是为读书。 || she was already studying with Jia Yucun at home.
错：家里没有钱了 || 她父亲林如海是巡盐御史，家里不缺钱。 || her father is salt commissioner; money is no issue.
错：她要嫁给贾宝玉 || 那时她和宝玉都还是孩子，谈不上嫁娶。 || both are children.
验：从送她的人对：护送她进京的贾雨村正是她的老师，林如海让他顺路，可见是去外祖母家安身。 || Check by her escort: her tutor goes with her to the grandmother.

问：林黛玉初进贾府时，是怎样的表现？
答：处处留心，不敢多说多走
据：第三回：黛玉“步步留心，时时在意，不肯轻易多说一句话，多行一步路”。 || Chapter 3: she is careful at every step, unwilling to say a word or take a step too many.
错：大大方方，有说有笑 || 有说有笑、大大方方的是同一回出场的王熙凤。 || the laughing ease is Wang Xifeng's in the same chapter.
错：只顾哭，不理别人 || 她见贾母时哭了一场，后来仍小心应答，并没有只顾哭。 || she weeps on meeting her grandmother, then answers carefully.
错：骄傲自大，看不起人 || 她怕被人耻笑，处处谦让，不是骄傲。 || she fears ridicule and yields.
验：从她吃茶对：她看贾府饭后先漱口再吃茶，和家里不同，就跟着照做，可见处处留心。 || Check by the tea: she copies the Jia custom after meals.

问：初到贾府时，哪个人物“未见其人，先闻其声”？
答：王熙凤
据：第三回：王熙凤人还没进屋，就在后院笑着说“我来迟了，不曾迎接远客”。 || Chapter 3: before she enters, Xifeng laughs from the back, “I'm late to welcome our guest!”
错：贾母 || 贾母是黛玉进门最先见到的人，搂着她哭。 || Grandmother Jia is the first she meets, weeping.
错：王夫人 || 王夫人在屋里说话很少，没有先声夺人。 || Lady Wang speaks little.
错：薛宝钗 || 薛宝钗第四回才进贾府。 || Baochai arrives in chapter 4.
验：从黛玉的惊讶对：她心想“这些人个个皆敛声屏气，这来者是谁，这样放诞无礼”，可见别人都不敢大声。 || Check by Daiyu's surprise: everyone else is hushed.

问：宝玉第一次见黛玉，为什么摔了自己的玉？
答：听说林妹妹没有玉
据：第三回：宝玉问黛玉有没有玉，黛玉说没有，他就发狂摔玉，说“家里姐姐妹妹都没有，单我有”。 || Chapter 3: hearing she has no jade, he hurls his, saying none of the girls has one but him.
错：嫌那块玉太重了 || 书里没说玉太重，他嫌的是“人的高低不择”。 || weight is not the issue; he calls it undiscerning.
错：父亲要拿走那块玉 || 贾政那时不在场，没人要拿走玉。 || his father is absent; no one takes it.
错：黛玉说那块玉不好看 || 黛玉只说自己没有，没说玉不好看。 || she only says she has none.
验：从贾母的哄劝对：贾母骗他说黛玉的玉随她母亲葬了，宝玉才不闹，可见他介意的是“林妹妹没有”。 || Check by the grandmother's lie: Daiyu's jade went to the grave with her mother.

问：在神话中，林黛玉的前世是什么？
答：绛珠仙草
据：第一回：西方灵河岸上三生石畔有一株绛珠仙草，受神瑛侍者灌溉，修成女体。 || Chapter 1: on the Spirit River bank grows the Crimson Pearl plant, watered by the Divine Attendant until it becomes a girl.
错：一块顽石 || 顽石是宝玉的前身，就是补天剩下的那块。 || the stone is Baoyu's origin.
错：一朵莲花 || 莲花是佛教的象征，书里不用来说黛玉。 || the lotus is a Buddhist symbol, not Daiyu's.
错：一只仙鹤 || 书里没有仙鹤化身的人。 || no one in the book was a crane.
验：从她的住处对：潇湘馆种满竹子，“绛珠”就是红色的泪珠，和她爱哭连在一起。 || Check by the name: “crimson pearl” means red tears.

问：绛珠仙草为什么要用一生的眼泪来还？
答：报答神瑛侍者的灌溉之恩
据：第一回：绛珠仙草说神瑛侍者用甘露灌溉她，她无水可还，便要把一生的眼泪还给他。 || Chapter 1: having no water to repay his dew, she vows to repay him with a lifetime of tears.
错：偿还欠宝钗的情 || 她和宝钗之间没有这样的前缘。 || there is no such tie to Baochai.
错：受了警幻仙子的惩罚 || 警幻仙子只是让这些人登记下凡，没有惩罚她。 || the Fairy of Disenchantment only registers them.
错：她天生就爱哭 || 是因为要还泪她才爱哭，不是天生爱哭再找理由。 || she weeps because of the debt, not the other way round.
验：从神瑛侍者对：神瑛侍者就是宝玉的前身，所以黛玉的眼泪多半是为宝玉流的。 || Check by the attendant: he is Baoyu, and her tears are for him.

问：薛宝钗随身戴着什么？
答：一把金锁
据：第八回：宝钗项上挂着金锁，上面刻着“不离不弃，芳龄永继”。 || Chapter 8: Baochai wears a gold lock engraved “Never leave me, never forsake me”.
错：一块通灵宝玉 || 通灵宝玉是宝玉的。 || the jade is Baoyu's.
错：一枚金麒麟 || 金麒麟是湘云的。 || the kylin is Xiangyun's.
错：一串佛珠 || 佛珠和后来出家的惜春、庵里的妙玉有关。 || prayer beads suit Xichun or Miaoyu.
验：从两件东西上的字对：宝玉的玉上刻“莫失莫忘，仙寿恒昌”，正和金锁上的八个字配成一对。 || Check by the inscriptions: his jade's eight characters pair with hers.

问：小说里的“金玉良缘”是指谁和谁？
答：宝玉和宝钗
据：第八回：宝玉的玉和宝钗的金锁上的字恰好成对，人称“金玉良缘”。 || Chapter 8: his jade and her lock make a pair, the gold-and-jade match.
错：宝玉和黛玉 || 宝玉和黛玉是“木石前盟”，木是绛珠草，石是那块石头。 || Baoyu and Daiyu are the bond of wood and stone.
错：贾琏和王熙凤 || 贾琏和王熙凤早已成亲，与金玉无关。 || Jia Lian and Xifeng are already married.
错：宝玉和湘云 || 湘云戴的是金麒麟，第三十一回回目“因麒麟伏白首双星”说的是她。 || Xiangyun wears the kylin, a different omen.
验：从结局对：宝玉最后娶的正是宝钗，金玉良缘成了，木石前盟落空。 || Check by the end: Baoyu marries Baochai.

问：贾宝玉梦中去到的仙境叫什么？
答：太虚幻境
据：第五回：宝玉在秦可卿房里睡着，梦游太虚幻境。 || Chapter 5: asleep in Qin Keqing's room, Baoyu dreams of the Land of Illusion.
错：大观园 || 大观园是人间的园子，第十七回才修好。 || Grand View Garden is real and built later.
错：蓬莱仙岛 || 蓬莱是传说里海上的仙山。 || Penglai is an island of legend.
错：灵山 || 灵山是《西游记》里如来佛祖住的地方。 || Vulture Peak is the Buddha's in Journey to the West.
验：从门口的对联对：“假作真时真亦假，无为有处有还无”，第一回甄士隐梦中见过同一副，正是太虚幻境。 || Check by the couplet: the same one Zhen Shiyin saw in chapter 1.

问：宝玉在梦中看到的判词和曲子预示了什么？
答：金陵众女子的命运
据：第五回：宝玉看了“金陵十二钗”正册、副册、又副册的判词，听了《红楼梦曲》，都暗示众女子的命运。 || Chapter 5: he reads the registers of the Twelve Beauties of Jinling and hears the songs, which foretell their fates.
错：宝玉将来的官职 || 判词写的都是女子，不说宝玉的官职。 || the verses concern women, not his career.
错：贾府的家产数目 || 判词不记家产。 || they record no wealth.
错：皇宫里的大事 || 元春的判词虽涉及宫中，但写的仍是她个人的命运。 || even Yuanchun's verse is about her fate.
验：从晴雯对：又副册第一首写“心比天高，身为下贱”，后来晴雯果然被逐病死，正应了判词。 || Check by Qingwen: her verse foretells her end.

问：贾府里辈分最高、最受尊敬的人是谁？
答：贾母
据：第三回起：贾母是荣国府辈分最高的老祖宗，人称“老太太”。 || From chapter 3: Grandmother Jia is the eldest of the house.
错：贾政 || 贾政是贾母的二儿子，见了贾母也要跪下。 || Jia Zheng is her son and kneels to her.
错：王夫人 || 王夫人是她的儿媳。 || Lady Wang is her daughter-in-law.
错：贾赦 || 贾赦是她的大儿子。 || Jia She is her elder son.
验：从宝玉挨打对：贾政打宝玉，贾母一来，贾政便跪下认错，可见她辈分最高。 || Check by the beating: Jia Zheng kneels when she comes.

问：贾宝玉的父亲是谁？
答：贾政
据：第三回：宝玉是荣国府贾政和王夫人的儿子。 || Chapter 3: Baoyu is the son of Jia Zheng and Lady Wang.
错：贾赦 || 贾赦是宝玉的伯父。 || Jia She is his uncle.
错：贾琏 || 贾琏是贾赦的儿子，宝玉的堂兄。 || Jia Lian is his cousin.
错：贾珍 || 贾珍是宁国府的当家人。 || Jia Zhen heads the Ning house.
验：从第三十三回对：亲手打宝玉、逼他读书的父亲正是贾政。 || Check by chapter 33: it is Jia Zheng who beats him.

问：贾宝玉最不喜欢的是什么？
答：读书考功名
据：书中：宝玉讨厌读书考功名，把只求做官的人叫作“禄蠹”。 || The novel: Baoyu hates study for office and calls such men “salary worms”.
错：和姐妹们作诗 || 他最爱和姐妹们起诗社作诗。 || he loves the poetry club.
错：在园子里玩耍 || 他最爱在园子里和姐妹们一起住。 || he loves living in the garden.
错：和丫鬟们说笑 || 他和丫鬟们说笑最开心。 || he loves joking with the maids.
验：从宝钗、湘云劝他对：她们劝他留心仕途经济，他就不高兴，只有黛玉从不劝，所以他敬重黛玉。 || Check by the advice: he resents those who urge a career, but not Daiyu.

问：宝玉被父亲狠狠打了一顿，主要是因为什么？
答：被告结交戏子、逼死丫鬟
据：第三十三回：忠顺王府来要戏子琪官，贾环又说金钏投井是宝玉逼的，贾政大怒，打了宝玉。 || Chapter 33: the Prince's men demand the actor Qiguan, Jia Huan blames Baoyu for Jinchuan's drowning, and Jia Zheng beats him.
错：考试没有考中 || 那时他还没去考试，中举是书末的事。 || he has not sat an exam; that comes at the end.
错：打碎了皇上的赏赐 || 书里没写他打碎皇上赏的东西。 || he breaks no imperial gift.
错：偷了家里的银子 || 书里没写他偷银子。 || he steals no silver.
验：从回目对：第三十三回“手足耽耽小动唇舌，不肖种种大承笞挞”，弟弟贾环告状，正是原因之一。 || Check by the title: a brother's slander and a son's misdeeds.

问：王熙凤在宁国府协理了谁的丧事？
答：秦可卿
据：第十三、十四回“王熙凤协理宁国府”：秦可卿死后，王熙凤到宁国府帮着料理丧事。 || Chapters 13 and 14: after Qin Keqing dies, Xifeng runs her funeral at the Ning house.
错：贾敬 || 贾敬死在第六十三回，是尤氏料理。 || Jia Jing dies in chapter 63, and Lady You sees to it.
错：林如海 || 林如海死在扬州，是贾琏带黛玉回去的。 || Lin Ruhai dies in Yangzhou; Jia Lian takes Daiyu home.
错：晴雯 || 晴雯是被撵出去后病死的，没有大办丧事。 || Qingwen dies dismissed, with no great funeral.
验：从回目对：“王熙凤协理宁国府”，协理的正是秦可卿的丧事。 || Check by the title.

问：哪一句最符合王熙凤？
答：精明能干，心狠手辣
据：书中：王熙凤协理宁国府办事干脆，又在第十五回弄权铁槛寺、第六十八、六十九回逼死尤二姐。 || The novel: she runs the funeral briskly, takes bribes at Iron Threshold Temple, and drives Second Sister You to suicide.
错：温柔沉默，与世无争 || 温柔沉默、守寡不问事的是李纨。 || quiet withdrawal is Li Wan's.
错：天真烂漫，不懂人情 || 天真烂漫的是湘云。 || artless gaiety is Xiangyun's.
错：多愁善感，爱写诗词 || 多愁善感、爱写诗的是黛玉。 || melancholy poetry is Daiyu's.
验：从她的判词对：“机关算尽太聪明，反算了卿卿性命”，正说她精明而狠。 || Check by her song: too clever, she schemes away her own life.

问：大观园原本是为了什么而修建的？
答：迎接元妃回家省亲
据：第十六至十八回：元春被封为贵妃，皇帝准许回家省亲，贾府修了省亲别墅，就是后来的大观园。 || Chapters 16 to 18: Yuanchun is made an imperial consort, allowed a home visit, and the family builds the visiting villa that becomes the garden.
错：给宝玉成亲用 || 宝玉成亲是书末的事，不在园子里办。 || his wedding is at the end, not the garden's purpose.
错：给贾母祝寿用 || 贾母祝寿在荣国府里办，不用修园子。 || birthdays are held in the house.
错：给姑娘们读书用 || 姑娘们是后来元春让她们住进去的。 || the girls move in later at Yuanchun's word.
验：从园名对：“大观园”三个字是元春省亲时亲自题的。 || Check by the name: Yuanchun named it.

问：元春为什么能回家省亲？
答：被封为贵妃
据：第十六回：元春“才选凤藻宫尚书，加封贤德妃”，皇帝又恩准妃嫔回家省亲。 || Chapter 16: Yuanchun is made Mistress of the Phoenix Palace and Worthy Consort, and consorts are permitted home visits.
错：嫁给了王爷 || 她是入宫做了皇帝的妃子，不是嫁王爷。 || she is the emperor's consort, not a prince's wife.
错：考中了状元 || 女子那时不能考状元。 || women could not sit the exams.
错：当上了女官的头 || 她先做过女官，但能省亲是因为被加封为贵妃。 || she was a palace official first, but the visit comes from being consort.
验：从排场对：她回家时太监开道、全家跪迎，这是贵妃的礼仪。 || Check by the ceremony: the family kneels as to a consort.

问：林黛玉在大观园住在哪里？
答：潇湘馆
据：第二十三回：元春让姐妹们和宝玉住进大观园，黛玉选了竹子多的潇湘馆。 || Chapter 23: Yuanchun lets them move in, and Daiyu chooses the bamboo-shaded Xiaoxiang Lodge.
错：怡红院 || 怡红院是宝玉的。 || Happy Red Court is Baoyu's.
错：蘅芜苑 || 蘅芜苑是宝钗的。 || Alpinia Park is Baochai's.
错：稻香村 || 稻香村是李纨的。 || Paddy-Sweet Cottage is Li Wan's.
验：从她的诗号对：诗社里她叫“潇湘妃子”，就从住处来。 || Check by her pen-name: the Queen of Xiaoxiang.

问：贾宝玉在大观园住在哪里？
答：怡红院
据：第二十三回：宝玉住怡红院。 || Chapter 23: Baoyu lives at Happy Red Court.
错：潇湘馆 || 潇湘馆是黛玉的。 || Xiaoxiang Lodge is Daiyu's.
错：蘅芜苑 || 蘅芜苑是宝钗的。 || Alpinia Park is Baochai's.
错：秋爽斋 || 秋爽斋是探春的。 || Autumn Freshness Studio is Tanchun's.
验：从他的诗号对：诗社里他叫“怡红公子”。 || Check by his pen-name: the Happy Red Prince.

问：黛玉葬花时吟的诗叫什么？
答：《葬花吟》
据：第二十七回：黛玉在花冢前哭着吟出《葬花吟》，宝玉在山坡后听见。 || Chapter 27: Daiyu weeps out the Flower Burial Song at the grave of the flowers; Baoyu overhears.
错：《好了歌》 || 《好了歌》是第一回跛足道人唱的。 || the Won-Done Song is the lame Taoist's in chapter 1.
错：《咏白海棠》 || 《咏白海棠》是第三十七回诗社的题目。 || the White Begonia poems are the club's in chapter 37.
错：《桃花行》 || 《桃花行》也是黛玉写的，但在第七十回，不是葬花时吟的。 || the Peach Blossom Song is hers too, but in chapter 70.
验：从宝玉的反应对：他听到“侬今葬花人笑痴，他年葬侬知是谁”，恸倒在山坡上，正是这首诗。 || Check by Baoyu: he collapses at the line about who will bury her.

问：黛玉为什么要把落花埋起来？
答：怜惜落花，也伤感自己的身世
据：第二十三、二十七回：黛玉说花落在水里会流到脏地方，不如埋了干净；她怜花也自伤身世。 || Chapters 23 and 27: she says flowers in the stream drift to filthy places, so burial keeps them clean; she pities them and herself.
错：怕落花弄脏了园子 || 她怕的是花被糟蹋，不是怕花弄脏园子。 || she fears for the flowers, not for the garden.
错：想让花开得更好 || 花已经落了，埋起来不会让它开得更好。 || burying fallen flowers does not help them bloom.
错：贾母让她这样做 || 书里没写贾母叫她葬花。 || no one tells her to.
验：从诗句对：“侬今葬花人笑痴，他年葬侬知是谁”，花和自己连在一起。 || Check by the line: she links the flowers to herself.

问：大观园里起诗社，最先提出的是谁？
答：探春
据：第三十七回“秋爽斋偶结海棠社”：探春写花笺邀大家起诗社。 || Chapter 37: Tanchun sends notes inviting everyone to form a poetry club at her studio.
错：黛玉 || 黛玉诗写得好，但起社的主意不是她出的。 || Daiyu writes well but did not propose it.
错：宝钗 || 宝钗是应邀来的。 || Baochai comes by invitation.
错：湘云 || 湘云是第一次社以后才赶来补诗的。 || Xiangyun arrives after the first meeting.
验：从地点对：回目说在秋爽斋结社，秋爽斋正是探春的住处。 || Check by the place: her own studio.

问：探春代管家务时，做了哪件事？
答：把园子分给婆子们承包管理
据：第五十六回“敏探春兴利除宿弊”：探春把园子分给会种花草的婆子们承包，省下开支。 || Chapter 56: Tanchun parcels out the garden to the old women to tend for profit.
错：把丫鬟都赶出了园子 || 撵丫鬟是第七十四回抄检大观园以后王夫人做的。 || dismissing maids is Lady Wang's, after the search in chapter 74.
错：给每个人都涨了月钱 || 她是在省钱，还免了重复发的头油脂粉钱。 || she saves, cutting a double allowance.
错：卖掉了大观园 || 园子是省亲别墅，谁也不能卖。 || no one could sell the consort's villa.
验：从回目对：“兴利除宿弊”，兴利就是承包，除弊就是砍掉重复开支。 || Check by the title: create profit, remove waste.

问：刘姥姥第一次进荣国府，是谁接待并给了她银子？
答：王熙凤
据：第六回“刘姥姥一进荣国府”：周瑞家的引她见王熙凤，凤姐给了她二十两银子。 || Chapter 6: Mrs Zhou takes her to Xifeng, who gives her twenty taels.
错：贾母 || 她第一次没见到贾母，第三十九回二进才见。 || she meets Grandmother Jia only on the second visit.
错：王夫人 || 王夫人没出面，交给了凤姐。 || Lady Wang leaves it to Xifeng.
错：薛姨妈 || 薛姨妈和这件事无关。 || Aunt Xue has no part.
验：从结局对：后来贾府败落，巧姐被卖，是刘姥姥救了她，报的正是凤姐当年的接济。 || Check by the end: she later rescues Xifeng's daughter.

问：刘姥姥在大观园的宴席上做了什么？
答：故意出洋相，逗大家开心
据：第四十回：凤姐和鸳鸯设计，刘姥姥也心领神会，说“老刘老刘，食量大似牛”，逗得满座大笑。 || Chapter 40: set up by Xifeng and Yuanyang, she plays the clown — “Old Liu, eats like an ox” — and everyone roars.
错：生气地离开了宴席 || 她没生气，还说“姑娘们哄我，我就乐一乐”。 || she takes no offence.
错：作了一首好诗 || 她行酒令说的是“大火烧了毛毛虫”这样的俗话，不会作诗。 || her drinking verse is folk talk, not poetry.
错：给大家讲佛经 || 书里没写她讲佛经。 || she does not preach sutras.
验：从众人的笑对：书里写黛玉笑岔了气、湘云喷了饭，正说明她在逗乐。 || Check by the laughter: Xiangyun sprays her rice.

问：谁撕扇子取乐，宝玉还笑着把扇子递给她？
答：晴雯
据：第三十一回“撕扇子作千金一笑”：晴雯爱听撕扇子的声音，宝玉就把扇子递给她撕。 || Chapter 31: Qingwen loves the sound of tearing fans, and Baoyu hands them to her.
错：袭人 || 袭人那几天刚被宝玉误踢伤，没有撕扇。 || Xiren has just been kicked by mistake.
错：麝月 || 麝月的扇子是被晴雯拿去撕的，她自己没撕。 || Sheyue's fan is the one Qingwen tears.
错：鸳鸯 || 鸳鸯是贾母的丫鬟。 || Yuanyang is Grandmother Jia's maid.
验：从起因对：晴雯先跌坏了扇骨，被宝玉说了两句，两人吵过又和好，才有撕扇的事。 || Check by the cause: she broke a fan, they quarrelled, then made up.

问：晴雯带病连夜补好了什么？
答：宝玉的雀金裘
据：第五十二回“勇晴雯病补雀金裘”：宝玉的孔雀毛大氅烧了个洞，晴雯带病连夜补好。 || Chapter 52: Baoyu's peacock cloak is burned, and the sick Qingwen mends it overnight.
错：黛玉的手帕 || 宝玉送黛玉旧手帕是第三十四回，没人补。 || the handkerchiefs are Baoyu's gift in chapter 34.
错：贾母的屏风 || 书里没写补贾母的屏风。 || no screen is mended.
错：宝钗的香囊 || 剪香袋的是黛玉，第十七、十八回。 || it is Daiyu who cuts up a purse, in chapters 17 and 18.
验：从“勇”字对：她发着烧还熬夜，正因为第二天宝玉要穿着去见长辈，不补不行。 || Check by “brave”: feverish, she works all night.

问：谁喝醉后睡在芍药花下的石凳上？
答：史湘云
据：第六十二回“憨湘云醉眠芍药裀”：湘云喝醉了，睡在山石后的青石凳上，芍药花瓣落了一身。 || Chapter 62: drunk, Xiangyun sleeps on a stone bench, covered in peony petals.
错：林黛玉 || 黛玉体弱，不会醉卧在外。 || Daiyu is too frail.
错：薛宝钗 || 宝钗稳重守礼，不会这样。 || Baochai is too proper.
错：贾探春 || 探春那天是主人之一，忙着行令。 || Tanchun is a hostess busy with games.
验：从“憨”字对：只有心直口快、豪爽的湘云才会醉卧石凳，还说梦话行酒令。 || Check by “artless”: only Xiangyun would, still mumbling drinking games.

问：哪一句最符合薛宝钗？
答：稳重随和，处事周到
据：书中：宝钗待人随和，懂事周到，连赵姨娘都夸她。 || The novel: Baochai is easy and considerate, praised even by Concubine Zhao.
错：心直口快，爱说爱笑 || 心直口快的是湘云。 || frankness is Xiangyun's.
错：孤高敏感，多愁善病 || 孤高敏感的是黛玉。 || pride and sensitivity are Daiyu's.
错：精明强干，心狠手辣 || 精明狠辣的是凤姐。 || shrewd ruthlessness is Xifeng's.
验：从她住的屋子对：蘅芜苑里“雪洞一般”，一点玩器都没有，见她不喜张扬。 || Check by her room: bare as a snow cave.

问：哪一句最符合林黛玉？
答：才华出众，敏感多愁
据：书中：黛玉才情最高，诗社常夺魁，又多愁多病，常为小事伤心。 || The novel: Daiyu is the most gifted poet and quick to grieve.
错：稳重随和，处事周到 || 稳重随和的是宝钗。 || steadiness is Baochai's.
错：豪爽大方，不拘小节 || 豪爽大方的是湘云。 || openhandedness is Xiangyun's.
错：精明强干，心狠手辣 || 精明狠辣的是凤姐。 || ruthlessness is Xifeng's.
验：从《葬花吟》对：她能写出这样的诗，又对着落花流泪，正是有才又多愁。 || Check by the Flower Burial Song.

问：《红楼梦》通过贾府的故事，主要写出了什么？
答：一个大家族由盛到衰的过程
据：全书：贾府由元妃省亲的极盛，到抄家、败落，“落了片白茫茫大地真干净”。 || The whole book: from the splendour of the visit to confiscation and ruin — “a vast white emptiness”.
错：一个穷人发家的过程 || 书里是富家败落，不是穷人发家。 || it is a great house falling, not a poor man rising.
错：一场战争的经过 || 书里没有写战争。 || there is no war.
错：一次求取真经的旅途 || 求取真经是《西游记》。 || the pilgrimage is Journey to the West.
验：从《好了歌》对：第一回就唱“好便是了，了便是好”，预示了盛极而衰。 || Check by the Won-Done Song: it foretells the fall.
`,
  },
  {
    // 《乡土中国》 is not in the public domain: the guide and the questions only name its ideas in this subject's own words
    // and quote none of it.
    id: "xiangtu-zhongguo",
    grade: 10,
    title: { en: "From the Soil", zh: "乡土中国" },
    author: { en: "Fei Xiaotong", zh: "费孝通" },
    guide: {
      en: "This is not a story but a short work of sociology: fourteen essays, first given as lectures in the late 1940s, on how rural Chinese society holds together. Read it as an argument. For each essay, write down the one idea it names, such as the differential mode of association, rule by rites, or the power of elders, and the image or example the author uses to make it clear, such as ripples spreading from a stone thrown into water against a bundle of sticks tied together. Note what each idea is set against, usually a Western or modern society, and how the essays build on one another: a society that does not move needs little writing, a society of acquaintances is ruled by custom rather than by law, and so on. Then test the ideas against what you know of village and town today: which still hold, and which have changed.",
      zh: "这不是一部故事，而是一本篇幅不长的社会学著作：十四篇文章，最初是二十世纪四十年代后期的讲课稿，讲的是中国乡村社会靠什么组织起来、维持下去。要把它当作论证来读。每读一篇，记下它提出的一个概念，比如差序格局、礼治秩序、长老统治，再记下作者用来说明它的比喻或例子，比如把石头丢进水里一圈圈推开的波纹，和一捆捆扎在一起的柴。留意每个概念是拿什么来对比的，通常是西方的或现代的社会；也留意各篇之间怎样一层层连起来：不流动的社会不大需要文字，熟人社会靠礼俗而不靠法律，等等。最后，拿这些概念对照你所知道的今天的乡村和城镇，想一想哪些还说得通，哪些已经变了。",
    },
    callout: {
      en: "Fei Xiaotong's ideas are named in his own words: 差序格局, 礼治秩序, 无讼, 长老统治. Before you choose, say what the term means in his book, not what the same words mean today.",
      zh: "费孝通的观点都有他自己的说法：差序格局、礼治秩序、无讼、长老统治。选之前先说清这个说法在书里是什么意思，而不是这几个字在今天的意思。",
    },
    questions: `
问：《乡土中国》的作者是谁？
答：费孝通
据：书的《后记》：这是社会学家费孝通在西南联大、云南大学讲“乡村社会学”的讲稿整理而成。 || The postscript: sociologist Fei Xiaotong assembled it from his lectures on rural sociology at Southwest Associated University and Yunnan University.
错：鲁迅 || 鲁迅写的是《呐喊》《朝花夕拾》，是小说和散文。 || Lu Xun wrote Call to Arms and Dawn Blossoms, stories and essays.
错：梁启超 || 梁启超写过《少年中国说》，是清末的政论家。 || Liang Qichao, a late-Qing essayist, wrote “Young China”.
错：钱锺书 || 钱锺书写的是小说《围城》。 || Qian Zhongshu wrote the novel Fortress Besieged.
验：从作者的另一本书对：费孝通早年写过调查江苏一个村子的《江村经济》，研究乡村正是他的本行。 || Check by his other book: Peasant Life in China, a study of one Jiangsu village.

问：《乡土中国》属于哪一类著作？
答：社会学著作
据：《后记》和全书：它用概念分析中国乡村社会的结构，是一部社会学著作。 || The postscript and the book: it analyses rural society through concepts, a work of sociology.
错：长篇小说 || 书里没有人物和情节，是一篇篇说理的文章。 || there are no characters or plot, only argued essays.
错：诗歌集 || 全书是散文体的论述，不是诗。 || it is prose argument, not verse.
错：游记 || 作者讲的是理论，不是记一路的见闻。 || it is theory, not a travelogue.
验：从篇名对：“差序格局”“礼治秩序”“长老统治”都是概念，小说和游记不会用这样的题目。 || Check by the titles: they are concepts.

问：这本书最初是怎样形成的？
答：作者在大学讲课的讲稿整理而成
据：《后记》：书是作者在大学讲“乡村社会学”时的讲稿，先在《世纪评论》上连载，后结集出版。 || The postscript: the lectures were serialised in Century Review and then published as a book.
错：作者在国外写的日记 || 书写的是中国乡下，不是在国外写的日记。 || it is about rural China, not a diary abroad.
错：作者写给家人的书信 || 全书是给读者和学生讲的，不是家书。 || it addresses students, not family.
错：作者创作的一组小说 || 它是论文集，不是小说。 || these are essays, not stories.
验：从文章的口气对：书里常说“我们”“我曾提出”，像是在课堂上一步步讲给学生听。 || Check by the voice: it sounds like a lecturer guiding a class.

问：这本书大约写成于什么时候？
答：二十世纪四十年代后期
据：《后记》：这些文章1947年连载，1948年出版，正是二十世纪四十年代后期。 || The postscript: serialised in 1947, published in 1948.
错：十九世纪初 || 十九世纪初费孝通还没出生，他生于1910年。 || Fei was born in 1910.
错：二十世纪八十年代 || 二十世纪八十年代他研究的是小城镇，写了《小城镇 大问题》。 || in the 1980s he studied small towns.
错：二十一世纪初 || 二十一世纪初他已年过九十，2005年去世。 || by then he was over ninety and died in 2005.
验：从书里的背景对：书里讲“司法下乡”“新式教育”刚进入乡村，正是民国后期的情形。 || Check by the setting: courts and new schools just reaching villages, late Republican China.

问：书中说中国基层社会是“乡土性”的，最主要的根据是什么？
答：人们靠种地为生，世代住在一个地方
据：《乡土本色》：“从基层上看去，中国社会是乡土性的”，乡下人靠种地谋生，粘在土地上，世代定居。 || “Native Soil”: at its base Chinese society is rural; farmers are bound to the land and stay put for generations.
错：人们大多住在城市里 || 书里说的是基层的乡下人，不是城里人。 || it concerns villagers, not townsfolk.
错：人们经常到各地经商 || 经商的流动是《血缘和地缘》里说的集市那一面，不是乡土的根据。 || travelling trade belongs to the market essay, not to the soil.
错：人们以打猎为生 || 靠打猎为生的是游牧、渔猎民族，作者正拿他们和农民对比。 || hunting peoples are the contrast, not the rule.
验：从作者举的例子对：他说中国人到了西伯利亚也要下些种子试试能不能种地，可见离不开土。 || Check by his example: even in Siberia Chinese settlers plant seeds.

问：作者说“土气”这个词，在书里有什么意思？
答：不是骂人的话，说的是人们离不开泥土
据：《乡土本色》：作者说“土气”这个词常被看作骂人，其实它正说明乡下人离不开泥土。 || “Native Soil”: “earthy” sounds like an insult, but it rightly says country people cannot leave the soil.
错：是在嘲笑乡下人穿得不时髦 || 作者正要纠正这种嘲笑。 || he is correcting that very sneer.
错：是说乡下的空气不好 || “土”说的是泥土，不是空气。 || “soil” is the soil, not the air.
错：是说乡下人脾气很坏 || 书里没有说乡下人脾气坏。 || he says nothing of temper.
验：从“土”的另一个意思对：作者说农民把泥土当成神，土地庙到处都有，“土气”本是这种依恋。 || Check by the earth god: shrines to the soil are everywhere.

问：书中认为，乡土社会的一个重要特点是什么？
答：人们很少流动，生于斯、长于斯
据：《乡土本色》：乡土社会不流动，人们“生于斯、长于斯、死于斯”。 || “Native Soil”: rural people are born, grow up and die in one place.
错：人们常常搬到别的地方去住 || 常常搬家正是作者说乡土社会少有的事。 || frequent moving is exactly what is rare.
错：人们彼此都不认识 || 不流动所以彼此都熟悉，是熟人社会。 || staying put makes everyone familiar.
错：人们主要靠法律来解决问题 || 靠法律解决问题是现代社会，《无讼》里正讲乡下人不爱打官司。 || law is modern; “No Lawsuits” shows villagers avoid it.
验：从熟人社会对：正因为不流动，乡下人才从小认识村里每个人，下一题的熟人社会就由此而来。 || Check by the next idea: staying put makes a society of acquaintances.

问：在乡土社会里，人和人之间是怎样的关系？
答：大家从小就彼此熟悉，是熟人社会
据：《乡土本色》：乡土社会是“没有陌生人的社会”，大家从小熟悉。 || “Native Soil”: it is a society without strangers.
错：大家互不相识，是陌生人社会 || 陌生人社会是作者说的现代社会。 || a society of strangers is the modern one.
错：大家只靠契约来往 || 乡下人借钱常常不立契约，靠熟悉和信任。 || villagers lend without contracts.
错：大家都住在高楼里 || 乡下人住的是平房院落，高楼是城市的。 || tall buildings are urban.
验：从“信任”对：作者说乡下人的信任不是对契约的重视，而是“发生于对一种行为的规矩熟悉到不加思索时的可靠性”。 || Check by trust: it rests on familiarity, not contracts.

问：在熟人社会里，人们做事主要靠什么来规范？
答：从小熟悉的规矩和习惯
据：《乡土本色》：熟人社会里的规矩是从小学来的，“从心所欲而不逾规矩”。 || “Native Soil”: rules are learned from childhood until one follows them without thinking.
错：一份份签好的合同 || 签合同是陌生人之间的事，乡下人看到签字画押反而觉得见外。 || contracts are for strangers; villagers find them cold.
错：报纸上的广告 || 乡下人不识字，不靠报纸。 || they cannot read papers.
错：外来的命令 || 外来的命令正是乡下人不熟悉的东西。 || outside orders are what they do not know.
验：从“规矩”和“法律”的对比对：作者说乡土社会“是‘礼俗社会’”，靠习惯而不是条文。 || Check by the contrast: a society of custom, not statute.

问：作者认为，乡下人不识字，主要原因是什么？
答：在面对面的熟人社会里，文字用处不大
据：《文字下乡》：乡下人不识字不是愚，面对面的熟人社会里，说话和表情就够了，文字用处不大。 || “Writing Goes to the Countryside”: illiteracy is not stupidity; face to face, words and looks suffice.
错：乡下人天生比城里人笨 || 作者正反驳“乡下人笨”，举例说教授的孩子捉蚱蜢不如乡下孩子。 || he refutes it: a professor's child catches grasshoppers worse than a village child.
错：乡下没有纸和笔 || 作者讲的是用不着，不是没有纸笔。 || it is need, not paper, that is lacking.
错：政府不许乡下人识字 || 书里没说政府禁止识字。 || no government forbids it.
验：从作者举的城里例子对：乡下人在马路上听到汽车喇叭慌了手脚，不是笨，是不熟悉，和城里人不懂庄稼一样。 || Check by the car horn: unfamiliarity, not stupidity.

问：在《文字下乡》中，作者认为文字的产生主要是为了什么？
答：克服空间和时间上的阻隔
据：《文字下乡》：文字是为了克服空间上的阻隔；《再论文字下乡》又讲时间上的阻隔。 || “Writing Goes to the Countryside” on distance, and the sequel on time: writing overcomes separation.
错：让人显得更有学问 || 作者说的是交流的需要，不是显学问。 || it serves communication, not show.
错：用来装饰房屋 || 书里没有讲文字装饰房子。 || there is no decoration.
错：代替说话，让人不再开口 || 文字补的是说话传不到的地方，并不代替说话。 || it reaches where speech cannot; it does not replace speech.
验：从书信对：人分隔两地才需要写信，在同一个村里面对面就不用写了。 || Check by letters: needed only when apart.

问：作者说乡土社会里一代代人的生活差不多，这说明了什么？
答：经验代代相同，靠口耳相传就够了，不大需要文字记录
据：《再论文字下乡》：乡土社会生活定型，前人的办法可以照用，经验口耳相传就够了。 || The sequel: life is settled, the elders' ways can be copied, and speech passes them on.
错：乡下人不愿意学习新东西 || 作者说的是不需要，不是不愿意学。 || it is need, not will.
错：乡下人的记性都很差 || 作者没说记性差，反而说靠记忆就够了。 || he says memory suffices.
错：乡下的生活越来越好 || 作者说的是生活差不多，不是越来越好。 || life stays the same, not better.
验：从长老统治对：正因为经验代代相同，老人的经验才有用，长老才有权力。 || Check by the elders: their experience matters because life repeats.

问：“差序格局”这个概念，作者用什么比喻来说明？
答：把石头丢进水里，一圈圈推出去的波纹
据：《差序格局》：中国人的关系像“把一块石头丢在水面上所发生的一圈圈推出去的波纹”。 || “Differential Mode”: relations are like ripples spreading from a stone thrown into water.
错：一棵大树的树根 || 书里比喻关系没有用树根，树根是读者容易拿“根”字联想的。 || tree roots are not his image.
错：一座高高的宝塔 || 宝塔是层层叠高的东西，书里没有。 || a pagoda is not his image.
错：一条长长的河流 || 河流书里没有用来说关系。 || a river is not his image.
验：从“推”字对：作者说“推己及人”，从自己向外推，正和波纹从中心往外推相合。 || Check by “extend oneself to others”: outward from the centre.

问：与“差序格局”相对，作者用什么比喻说明西方社会的“团体格局”？
答：一捆一捆扎好的柴
据：《差序格局》：西洋的团体格局“好像我们在田里捆柴”，几根成一把，几把成一扎，界限分明。 || “Differential Mode”: the Western mode is like bundled firewood, sticks tied into bundles with clear bounds.
错：水面上的波纹 || 水面的波纹正是用来说中国的差序格局。 || ripples describe the Chinese mode.
错：天上的星星 || 星星书里没用来比喻。 || stars are not used.
错：一张蜘蛛网 || 蜘蛛网是作者说差序格局时提到的“网”，不是团体格局。 || the web is part of his differential picture, not the Western one.
验：从“界限”对：一捆柴里哪根属于哪捆清清楚楚，团体格局里谁是团体的人也清楚。 || Check by the boundaries: each stick belongs to one bundle.

问：在“差序格局”中，一个人社会关系的中心是什么？
答：他自己
据：《差序格局》：每个人都以“己”为中心，向外推出去；作者称之为“自我主义”。 || “Differential Mode”: each person stands at the centre, which he calls egoism.
错：国家 || 国家在差序格局里是最外面、最模糊的一圈。 || the state is the faintest outer ring.
错：村里的长老 || 长老有权力，但每个人的圈子仍以自己为中心。 || elders have power, but each circle centres on oneself.
错：他的邻居 || 邻居是圈子里的一层，不是中心。 || neighbours are one ring, not the centre.
验：从“推己及人”对：先有“己”，才有推出去的人，中心当然是自己。 || Check by the phrase: one starts from oneself.

问：差序格局中的关系有什么特点？
答：离自己越近越亲，越远越疏，远近可以伸缩
据：《差序格局》：关系“愈推愈远，也愈推愈薄”，而且可以伸缩：“家”可以只指太太，也可以大到“天下一家”。 || “Differential Mode”: the further out, the thinner; and the circle stretches — “family” may mean a wife or all under heaven.
错：每个人和所有人都一样亲近 || 一样亲近正是团体格局的特点。 || equal ties are the Western mode.
错：关系一旦定下就永远不变 || 作者恰恰说它能伸缩。 || he stresses that it stretches.
错：和陌生人的关系最亲近 || 陌生人在最外圈，最疏远。 || strangers are the outermost ring.
验：从“自家人”对：作者说“自家人”可以包罗任何要拉入自己圈子的人，可见能伸缩。 || Check by “our own people”: it can take in anyone one wishes.

问：《维系着私人的道德》中，作者认为乡土社会的道德有什么特点？
答：道德要看对象和自己的关系而定
据：《维系着私人的道德》：差序格局里，道德标准要看对象和自己的关系而定。 || “Morality of Private Ties”: what is right depends on one's relation to the other person.
错：对所有人都用同一个标准 || 对所有人一个标准是团体格局的道德。 || one standard for all is the Western mode.
错：只讲对国家的义务 || 作者说乡土社会里对国家的观念最模糊。 || he says duty to the state is the faintest.
错：没有任何道德 || 作者说的是道德不同，不是没有道德。 || he describes a different morality, not none.
验：从孝悌忠信对：孝对父母、悌对兄弟、忠对君主、信对朋友，每一种都对着一种关系。 || Check by the virtues: each one names a relation.

问：作者认为，中国乡下的“家”有什么特点？
答：它像一个小家族，还要承担生产等许多事情
据：《家族》：中国乡下的家是“小家族”，除了生育，还是做事业的团体，要管生产、政治、宗教等许多事。 || “Clan”: the rural family is a small clan, an enterprise for farming and more besides reproduction.
错：它只是夫妻两个人一起生活的地方 || 夫妻两人的小家是西方的家庭。 || a couple alone is the Western family.
错：它和别人家没有任何来往 || 家和亲戚邻里都连在差序格局里，不是不来往。 || it is woven into the web of kin.
错：它一年只团聚一次 || 一家人平日就住在一起。 || they live together every day.
验：从下一题对：家要做事业，才需要父子这条传承的主轴，夫妻感情反成次要。 || Check by the next question: an enterprise needs the father-son axis.

问：作者认为，在乡土社会的家庭里，哪一种关系是主轴？
答：父子之间的关系
据：《家族》：家庭的主轴在父子之间、在婆媳之间，夫妇是配轴。 || “Clan”: the main axis is father and son, mother- and daughter-in-law; husband and wife are secondary.
错：夫妻之间的关系 || 夫妻关系是西方家庭的主轴，在中国乡下是配轴。 || the couple is the Western axis, secondary here.
错：朋友之间的关系 || 朋友不在家里。 || friends are outside the family.
错：邻居之间的关系 || 邻居也不在家里。 || neighbours are outside too.
验：从“纪律”对：作者说乡下夫妇之间相敬如宾，很少说亲热话，可见夫妻不是主轴。 || Check by restraint: couples are reserved with each other.

问：作者认为乡土社会讲究“男女有别”，主要是为了什么？
答：维持社会关系的稳定
据：《男女有别》：乡土社会讲“男女有别”，是为了避免感情冲动，维持社会关系的稳定。 || “Separate Spheres”: separating the sexes avoids emotional upheaval and keeps relations stable.
错：让男女互相仇视 || 作者说的是保持距离，不是仇视。 || distance, not hostility.
错：让男女不能说话 || 男女照样说话来往，只是不讲亲密的感情。 || they talk; they avoid intimacy.
错：让家庭变得更热闹 || 恰恰相反，乡下家庭“不求热闹”而求安稳。 || the aim is calm, not bustle.
验：从上一篇对：既然家要做事业、要稳定，就得防住夫妻之外的感情冲动。 || Check by the previous essay: a working family must be stable.

问：书中说乡土社会是“礼治”的社会，这里的“礼”指什么？
答：社会公认合适、靠传统维持的行为规范
据：《礼治秩序》：“礼是社会公认合式的行为规范”，维持它的是传统。 || “Rule of Rites”: rites are the norms society accepts as proper, upheld by tradition.
错：别人送来的礼物 || “礼物”的礼是日常的意思，不是书里的意思。 || a gift is the everyday sense.
错：只在过年时用的客套话 || 礼是天天要遵守的，不只是过年说的客套话。 || it rules every day, not only at New Year.
错：皇帝颁布的法律条文 || 法律条文是“法”，正是作者拿来和“礼”对比的。 || statutes are law, the contrast.
验：从下一题对：作者说礼和法的不同在于维持的力量，一个靠传统，一个靠国家。 || Check by the next point: tradition versus the state.

问：作者认为“礼”和“法”最大的不同是什么？
答：维持礼的是传统，推行法的是国家的权力
据：《礼治秩序》：维持礼的是传统，推行法的是国家的权力。 || “Rule of Rites”: tradition upholds rites; state power enforces law.
错：礼是写下来的，法是口头说的 || 乡土社会的礼大多不写下来，靠习惯。 || rites are largely unwritten.
错：礼只管城里人，法只管乡下人 || 书里没有这样分，礼正是乡土社会的。 || rites belong to the countryside.
错：礼和法完全是一回事 || 作者正在讲两者不同。 || he is distinguishing them.
验：从“主动服膺”对：作者说礼靠人们从小教化、“主动服膺”，不用警察来逼。 || Check by willing obedience: no police are needed.

问：作者说的“礼治”，是不是就等于“人治”？
答：不是，礼治靠的是传统规范，不是个人的好恶
据：《礼治秩序》：作者说礼治不是人治，礼治靠的是传统规范，不是个人的好恶。 || “Rule of Rites”: rule by rites is not rule by men; it rests on tradition, not personal whim.
错：是，礼治就是谁说了算听谁的 || 作者正好否定了这个说法。 || he denies exactly that.
错：是，礼治就是没有任何规矩 || 礼治恰恰是有规矩的。 || rites are rules.
错：书中没有讨论这个问题 || 这正是《礼治秩序》开头讨论的问题。 || the essay opens with this question.
验：从“传统”对：长老也得照礼办事，不能凭一己之意改，可见不是谁说了算。 || Check by tradition: even elders must follow the rites.

问：《无讼》中，乡土社会的人们怎样看待打官司？
答：觉得打官司是丢脸的事，最好不要打
据：《无讼》：乡下人把打官司看作可羞的事，说明教化不够。 || “No Lawsuits”: going to court is shameful, a sign of poor upbringing.
错：觉得打官司是光荣的事 || 正相反，是丢脸的事。 || it is shameful.
错：每遇到小事都去打官司 || 小事都在乡里调解掉了。 || small matters are mediated.
错：只相信打官司能解决问题 || 作者说乡下人宁可调解。 || they prefer mediation.
验：从调解的场面对：作者写乡绅调解时先把双方骂一顿，说他们丢了村子的脸，可见打官司是可羞的。 || Check by the scene: the mediator scolds both for shaming the village.

问：在乡土社会里，发生了纠纷通常怎样解决？
答：由乡里有威望的长者出面调解
据：《无讼》：纠纷由乡里有威望的长者、乡绅出面调解，作者自己也参加过。 || “No Lawsuits”: disputes go to respected elders and gentry; he once sat in.
错：一定要到城里的法院去打官司 || 城里的法院正是乡下人不愿去的地方。 || the town court is what they avoid.
错：在报纸上公开辩论 || 乡下人不识字，不在报纸上辩论。 || they do not argue in newspapers.
错：通过投票来决定 || 投票是现代的办法，乡下人靠调解。 || voting is modern.
验：从长老统治对：长者有教化的权力，所以由他们调解，前后两篇连在一起。 || Check by the elders' essay: their teaching power lets them judge.

问：作者认为，在乡土社会里简单地推行现代司法，可能带来什么问题？
答：旧的礼治秩序被破坏了，新的法治秩序却还没有建立起来
据：《无讼》：司法下乡后，“法治秩序的好处未得，而破坏礼治秩序的弊病却已先发生了”。 || “No Lawsuits”: modern courts arrive, the old order breaks before the new one can work.
错：所有的纠纷马上都消失了 || 作者说纠纷反而更难处理。 || disputes become harder.
错：人们会更加团结 || 有人钻法律的空子，乡里反而不和。 || people exploit the law and villages quarrel.
错：乡下人会全部搬到城里去 || 书里没写乡下人搬进城。 || no one moves to town.
验：从作者的例子对：有人在乡里做了违礼的事，却去城里告状，还打赢了，乡里人看了不服。 || Check by his example: the offender sues and wins, to the village's outrage.

问：《无为政治》中，作者把权力分成哪两种？
答：横暴权力和同意权力
据：《无为政治》：作者把权力分为横暴权力和同意权力两种。 || “Inactive Government”: he names two kinds of power, coercive and consensual.
错：大权力和小权力 || 书里没用大小来分。 || size is not his measure.
错：城市权力和乡村权力 || 书里没用城乡来分。 || town and country are not his measure.
错：男性权力和女性权力 || 书里没用男女来分。 || sex is not his measure.
验：从《长老统治》对：作者后来又补上第三种“教化性的权力”，说前两种都说不尽乡土社会。 || Check by the next essay: he adds a third kind.

问：作者认为，传统中国的皇权对乡村基层的影响怎样？
答：表面强大，实际上对乡村干预不多，常被称为“无为”
据：《无为政治》：农业社会剩余少，养不起强大的权力，皇权虽然表面强大，实际上很少干预乡村，被称作“无为”。 || “Inactive Government”: a farming society cannot feed strong power, so the throne seems mighty but leaves villages alone.
错：每天都直接管理每一户人家 || 皇权到不了每家每户，“天高皇帝远”。 || the throne does not reach every house.
错：乡村完全没有受到皇权的影响 || 乡村也交税、服役，不是完全不受影响。 || villages still paid taxes.
错：皇帝亲自到每个村庄去收税 || 皇帝不会亲自下乡收税。 || the emperor collects no taxes himself.
验：从篇名对：“无为政治”四个字就是说皇权在基层少有作为。 || Check by the title: inactive government.

问：《长老统治》中，作者提出的是哪一种权力？
答：教化性的权力
据：《长老统治》：作者提出第三种权力，“教化性的权力”。 || “Rule of Elders”: he names a third power, the power of teaching.
错：横暴权力 || 横暴权力是《无为政治》里说的，作者说它说不尽乡土社会。 || coercive power is from the previous essay.
错：同意权力 || 同意权力也是《无为政治》里说的。 || consensual power is too.
错：商业权力 || 书里没有“商业权力”。 || there is no commercial power.
验：从父母管孩子对：作者说父母教孩子既不是压迫，也不是双方同意，而是教化，这就是第三种。 || Check by parents: neither coercion nor consent, but teaching.

问：长老之所以有权力，主要是因为什么？
答：他们年长，掌握着代代相传的经验
据：《长老统治》：长老年长，掌握代代相传的经验，所以有教化的权力。 || “Rule of Elders”: elders hold inherited experience and so have the power to teach.
错：他们最有钱 || 长老的权力来自年纪和经验，不来自钱。 || it comes from age, not wealth.
错：他们力气最大 || 长老年纪大，力气不比年轻人大。 || elders are not the strongest.
错：他们是外来的官员 || 长老是本乡本土的人。 || elders are local.
验：从“长幼之序”对：乡下讲究兄长弟幼，按年龄排先后，就因为年长的懂得多。 || Check by seniority: the older know more.

问：作者认为，教化性的权力在什么样的社会里最容易发生？
答：变化很慢、经验可以代代相传的社会
据：《长老统治》：在变化很慢、经验可以照用的社会里，教化性的权力最容易发生。 || “Rule of Elders”: the power of teaching arises where change is slow and experience holds good.
错：变化很快的社会 || 变化快的社会里经验会过时，出现的是《名实的分离》里的时势权力。 || in fast change, experience fails and power of circumstance arises.
错：没有老人的社会 || 没有老人就没有长老。 || without elders there are no elders.
错：完全靠商业维持的社会 || 商业社会是陌生人的契约，作者在《血缘和地缘》里讲。 || commerce rests on contracts between strangers.
验：从《再论文字下乡》对：生活定型、经验代代相同，长老的经验才有用。 || Check by the writing essay: settled life makes experience valid.

问：《血缘和地缘》中，作者认为血缘社会有什么特点？
答：身份生来就定了，社会比较稳定
据：《血缘和地缘》：血缘社会里身份生来就定了，是稳定的社会。 || “Blood and Place”: in a kin society status is fixed at birth, and society is stable.
错：人人都可以随便改变身份 || 身份不能随便改，生在哪家就是哪家的人。 || status cannot be changed at will.
错：人们只和陌生人做生意 || 和陌生人做生意是地缘、商业的一面。 || trade with strangers is the other side.
错：家族之间没有任何关系 || 家族之间靠婚姻、血缘连在一起。 || clans are linked by marriage.
验：从“稳定”对：生来就定的身份，不用争，社会也就不容易乱。 || Check by stability: fixed status leaves little to fight over.

问：作者认为，商业往往在什么样的地方发展起来？
答：血缘之外、陌生人来往的地方，比如集市
据：《血缘和地缘》：亲戚之间讲人情不好算账，所以商业多在血缘之外的集市、街上发展。 || “Blood and Place”: kin cannot keep strict accounts, so trade grows outside kinship, at markets.
错：一家人之内 || 一家人之内不算账。 || families do not keep accounts.
错：最亲密的亲戚之间 || 亲戚之间讲人情，算清了就伤感情。 || exact accounts hurt kin.
错：没有人的荒野里 || 没有人就谈不上做生意。 || no people, no trade.
验：从“当场清算”对：作者说在集市上大家都是陌生人，可以当场钱货两清，不欠人情。 || Check by settling on the spot: strangers can square accounts at once.

问：书中提到，从外地迁来、在村里住了很久的人，常常仍被看作什么？
答：外来的“客”，难以完全融入
据：《血缘和地缘》：外来户在村里住了几代，仍常被叫作“客边”“新客”，难以完全融入。 || “Blood and Place”: newcomers, even after generations, are still called guests.
错：村里最有权力的人 || 外来的人在村里没有根，不会是最有权的。 || newcomers have no roots and no power.
错：村里的长老 || 长老是本村的老人。 || elders are native.
错：从来不被注意的人 || 他们常被注意，还被另眼看待。 || they are marked out.
验：从血缘对：村里的地位跟着血缘走，外来的没有血缘，所以总是“客”。 || Check by kinship: no kin, always a guest.

问：《名实的分离》中，作者提出了哪一种权力？
答：在社会变迁中产生的时势权力
据：《名实的分离》：社会变迁中出现了“时势权力”，由能提出新办法的人掌握。 || “Name and Reality”: in times of change, power of circumstance goes to those with new answers.
错：横暴权力 || 横暴权力是《无为政治》里的。 || coercive power is from another essay.
错：长老的教化权力 || 长老的权力在变化中反而削弱了。 || elders' power weakens in change.
错：同意权力 || 同意权力也是《无为政治》里的。 || consensual power is from another essay.
验：从“文化英雄”对：作者说时势权力属于能提出新办法的“文化英雄”，正是变化时的产物。 || Check by the culture hero: new times, new leaders.

问：作者说的“名实的分离”，指的是什么？
答：表面上照旧尊重老规矩，实际的内容已经变了
据：《名实的分离》：长老权力不许人公开反对，人们就用“注释”的办法，表面照旧尊重，内容却悄悄改了。 || “Name and Reality”: elders forbid open dissent, so people reinterpret, keeping the form while the content changes.
错：人的名字和长相不一样 || 书里说的不是人名和长相。 || it is not names and faces.
错：东西的名称和价格不一样 || 书里说的不是商品价格。 || it is not prices.
错：城市和乡村的名字不同 || 书里说的不是地名。 || it is not place names.
验：从篇名对：“名”是表面的说法，“实”是实际的内容，两者分开了。 || Check by the title: name and reality part.

问：《从欲望到需要》中，作者认为乡土社会的人们行动主要靠什么？
答：在传统中养成、经过文化塑造的欲望
据：《从欲望到需要》：乡土社会里人们靠欲望行事，这欲望是文化塑造的，在传统中养成。 || “From Desire to Need”: rural people act on desires shaped by culture and tradition.
错：周密的科学计划 || 科学计划是现代社会依“需要”行事时才有的。 || scientific planning comes with need, in modern society.
错：每天看报纸的消息 || 乡下人不看报。 || villagers read no papers.
错：完全随心所欲 || 作者说欲望是文化塑造的，并非随心所欲。 || desires are shaped by culture, not whim.
验：从篇名对：“从欲望到需要”说的是变化，乡土社会在“欲望”这一头。 || Check by the title: rural society is at the desire end.

问：作者认为，到了变化快的现代社会，人们行动要靠什么？
答：认清自己的需要，有计划地去做
据：《从欲望到需要》：现代社会变得快，人要认清自己的需要，有计划地去做。 || “From Desire to Need”: in fast-changing modern society, people must know their needs and plan.
错：完全照着老习惯去做 || 照老习惯正是乡土社会的做法，变化快就不灵了。 || old habits fail in fast change.
错：只听长老的话 || 长老的经验在变化快时已不够用了。 || elders' experience no longer suffices.
错：什么都不用做 || 作者说的是要有计划地做，不是不做。 || one must plan, not idle.
验：从上一题对：一头是传统养成的欲望，一头是有计划的需要，正好是篇名的两端。 || Check by the pair: desire and need.

问：作者写这本书，常用什么方法来说明中国乡土社会的特点？
答：和西方社会、现代社会作对比
据：全书：作者常拿中国乡土社会和西方社会、现代社会对比，例如差序格局对团体格局。 || The whole book: he constantly sets rural China against Western and modern society.
错：讲一个从头到尾的故事 || 全书是一篇篇论文，没有贯穿的故事。 || it is essays, not one story.
错：列出大量的数学公式 || 书里没有数学公式。 || there are no formulas.
错：只引用古代的诗词 || 书里引孔子、孟子的话，但主要是分析，不是引诗。 || it quotes Confucius, but mainly analyses.
验：从“捆柴”和“波纹”对：两个比喻一中一西摆在一起，正是对比的方法。 || Check by the two images side by side.

问：读《乡土中国》，比较恰当的方法是什么？
答：抓住每一篇的核心概念，结合今天的生活去思考
据：全书：每篇有一个核心概念，如“差序格局”“礼治秩序”“长老统治”，读时要抓概念、联系生活。 || The whole book: each essay turns on one concept; read for it and test it against life.
错：只记住书里的故事情节 || 书里没有故事情节。 || there is no plot.
错：只背诵书中的优美句子 || 它是说理的书，重在概念，不在美句。 || it argues; fine phrases are not the point.
错：只看目录，不读正文 || 目录只有篇名，不读正文就不懂概念。 || titles alone teach nothing.
验：从差序格局对：读懂它，就能理解今天为什么还讲“熟人好办事”，可见要联系生活。 || Check by today: “acquaintances get things done” still holds.
`,
  },
  {
    // 《呐喊》 is in the public domain; the guide and the questions still tell it in this subject's own words.
    id: "call-to-arms",
    grade: 11,
    title: { en: "Call to Arms", zh: "呐喊" },
    author: { en: "Lu Xun", zh: "鲁迅" },
    guide: {
      en: "Call to Arms is Lu Xun's first collection of stories, fourteen of them, written between 1918 and 1922 and published in 1923. Begin with the preface: it tells why he gave up medicine for writing, and its image of people asleep in an iron house with no windows explains the title. Then read the stories one by one, and for each write down three things: who tells it and from where, such as the boy in the wine shop of Kong Yiji; the scene in which the people around the main figure show what they are, often a crowd that watches and laughs; and what the story suggests is wrong in the minds of the people of its time. Notice the places that recur, Luzhen and Weizhuang, and the kinds of people: scholars who failed the examinations, villagers, onlookers. Compare the stories that end in darkness with the few that end in hope, such as the road at the end of My Old Home. Last, ask which of the habits of mind these stories expose you still meet today.",
      zh: "《呐喊》是鲁迅的第一部小说集，收了十四篇小说，写于1918年到1922年，1923年出版。先读书前的《自序》：它讲了作者为什么弃医从文，其中关于人们睡在一间没有窗户的铁屋子里的比喻，也说明了书名的意思。然后一篇一篇地读，每读一篇，记下三点：谁在讲这个故事、站在什么位置，比如《孔乙己》里酒店的小伙计；主要人物周围的人在哪个场面里露出了他们的样子，常常是一群围观、发笑的人；小说揭示了那个时代的人们精神上的什么毛病。留意反复出现的地方，鲁镇、未庄，和反复出现的几类人：考不中的读书人、乡民、看客。再把结局黑暗的几篇和少数带着希望的几篇对比着读，比如《故乡》结尾关于路的话。最后想一想，这些小说揭示的精神上的毛病，今天还能不能见到。",
    },
    callout: {
      en: "The stories have different people and towns: Ah Q, Kong Yiji, Runtu, the madman, Hua Laoshuan. Place the question in its own story before you choose; Kong Yiji's beans are not Ah Q's turnips.",
      zh: "这些小说的人物和地方各不相同：阿Q、孔乙己、闰土、狂人、华老栓。选之前先想清楚问的是哪一篇；孔乙己的茴香豆不是阿Q的萝卜。",
    },
    questions: `
问：《呐喊》的作者是谁？
答：鲁迅
据：《自序》末尾署“鲁迅”，这是他的第一部小说集。 || The preface is signed Lu Xun; it is his first collection of stories.
错：茅盾 || 茅盾写的是《子夜》《林家铺子》。 || Mao Dun wrote Midnight and The Lin Family Shop.
错：巴金 || 巴金写的是《家》《春》《秋》。 || Ba Jin wrote Family, Spring and Autumn.
错：老舍 || 老舍写的是《骆驼祥子》《四世同堂》。 || Lao She wrote Camel Xiangzi.
验：从《自序》里的经历对：去日本学医、在仙台看幻灯片，都是鲁迅自己的经历。 || Check by the preface: medicine in Japan, the slides at Sendai, Lu Xun's own life.

问：《呐喊》是一部什么样的作品？
答：短篇小说集
据：全书：《呐喊》收的是十四篇短篇小说，最长的《阿Q正传》也只有九章。 || The whole book: fourteen short stories; even the longest, The True Story of Ah Q, has only nine chapters.
错：长篇小说 || 书里没有长篇，《阿Q正传》是其中最长的一篇，算中篇。 || there is no novel; Ah Q is the longest, a novella.
错：散文集 || 鲁迅的散文集是《朝花夕拾》。 || his essays are Dawn Blossoms Plucked at Dusk.
错：诗集 || 鲁迅的散文诗集是《野草》。 || his prose poems are Wild Grass.
验：从各篇的写法对：《孔乙己》《故乡》都有人物、情节、虚构的“我”，是小说不是散文。 || Check by form: invented narrators and plots make them stories.

问：《呐喊》一共收了多少篇小说？
答：十四篇
据：全书目录：从《狂人日记》到《社戏》，一共十四篇。 || The contents: from Diary of a Madman to Village Opera, fourteen stories.
错：八篇 || 八篇是鲁迅另一本《故事新编》的篇数。 || eight is the count of Old Tales Retold.
错：二十篇 || 二十篇书里没有这个数。 || twenty is no count here.
错：三十篇 || 三十篇更多，全书只到第十四篇《社戏》。 || thirty is far too many.
验：从首尾对：第一篇《狂人日记》，最后一篇《社戏》，数下来正是十四篇。 || Check by first and last: count from the Madman to the Opera.

问：《呐喊》是哪一年出版的？
答：1923年
据：版本：1923年由北京新潮社出版，收入1918至1922年写的小说。 || Published 1923 by New Tide in Beijing, collecting stories of 1918 to 1922.
错：1903年 || 1903年鲁迅还在日本留学，那年他剪了辫子，还没写小说。 || in 1903 he was studying in Japan.
错：1949年 || 1949年鲁迅已去世十三年。 || by 1949 he had been dead thirteen years.
错：1966年 || 1966年更晚，鲁迅1936年去世。 || 1966 is thirty years after his death.
验：从第一篇对：《狂人日记》1918年发表，《呐喊》收的是此后几年的作品，在1923年出版正合。 || Check by the first story: 1918, collected five years later.

问：在《自序》里，作者用什么比喻来说明当时中国人的处境？
答：一间没有窗户、很难打破的铁屋子，里面的人都睡着了
据：《自序》：他对金心异说，有一间铁屋子，绝无窗户，万难破毁，里面许多熟睡的人快要闷死了。 || The preface: he tells Jin Xinyi of an iron house without windows, almost indestructible, its sleepers about to suffocate.
错：一艘在海上漂流、找不到方向的小船 || 小船漂流的比喻书里没有。 || there is no drifting boat.
错：一座很久没有人照料的花园 || 花园是《朝花夕拾》里的百草园，不是比喻。 || the garden is the Hundred Plant Garden in another book.
错：一条怎么也走不到头的长路 || 路的比喻在《故乡》结尾，说的是希望。 || the road is in My Old Home, about hope.
验：从金心异的回答对：他说“然而几个人既然起来，你不能说决没有毁坏这铁屋的希望”，鲁迅这才答应写文章。 || Check by the reply: if a few wake, there is hope of breaking it.

问：《自序》里，作者为什么放弃学医？
答：看到影片里围观同胞被杀的中国人神情麻木，觉得改变人的精神更要紧
据：《自序》：在仙台看日俄战争的幻灯片，围观同胞被杀的中国人神情麻木，他觉得医好身体不如改变精神。 || The preface: at Sendai he saw slides of a Chinese man executed before a numb Chinese crowd, and turned from bodies to minds.
错：因为学医的考试没有通过 || 他在仙台医专成绩并不差，《藤野先生》里还写老师给他改笔记。 || his grades were fine; Fujino corrected his notes.
错：因为家里人不同意他学医 || 他学医正是因为父亲被庸医耽误了，家里并不反对。 || he chose medicine after quacks failed his father.
错：因为他自己的身体不好 || 书里没写他身体不好。 || his health is not the reason.
验：从他后来做的事对：他弃医后去东京办文艺杂志《新生》，正是为了改变精神。 || Check by what he did next: a literary magazine in Tokyo.

问：按照《自序》的说法，书名“呐喊”是什么意思？
答：为那些在寂寞中前进的人呐喊助威，让他们不害怕向前
据：《自序》：“聊以慰藉那在寂寞里奔驰的猛士，使他不惮于前驱”。 || The preface: to comfort the fighters who press on in loneliness, so they will not fear to lead.
错：作者在痛苦中大声地哭喊 || 他说是给别人助威，不是自己哭喊。 || it is cheering others, not wailing.
错：号召人们拿起武器去打仗 || 他说的是精神上的鼓舞，不是号召打仗。 || it is spiritual, not armed.
错：作者写小说时周围很吵闹 || “呐喊”是比喻，不是说周围吵闹。 || the shout is a figure, not noise.
验：从“听将令”对：他说自己的小说要“听将令”，不用消极的结尾，所以《药》的坟上添了花环。 || Check by his orders: he adds a wreath in Medicine.

问：《狂人日记》是用什么形式写成的？
答：一个“狂人”写的日记
据：《狂人日记》：前面一段文言小序说明来历，正文是狂人写的十三则白话日记。 || “Diary of a Madman”: a classical preface explains its source, then thirteen vernacular entries.
错：几封往来的书信 || 书里没有书信。 || there are no letters.
错：一部多幕的剧本 || 它是小说，不是剧本。 || it is a story, not a play.
错：一组长短不一的诗 || 它是白话散文，不是诗。 || it is prose, not verse.
验：从篇名对：题目就叫“日记”，小序也说是从狂人的日记里摘出来的。 || Check by the title and preface.

问：《狂人日记》中，“狂人”在古书的字缝里看出了哪两个字？
答：吃人
据：《狂人日记》第三则：“仔细看了半夜，才从字缝里看出字来，满本都写着两个字是‘吃人’！” || Entry 3: after half the night he sees between the lines two words: “eat people”.
错：仁义 || “仁义道德”是书面上写着的字，“吃人”藏在字缝里。 || “benevolence and righteousness” are on the page; the words between them are “eat people”.
错：读书 || “读书”书里没有。 || “study” is not there.
错：革命 || “革命”书里没有。 || “revolution” is not there.
验：从书上的字和字缝对：“这历史没有年代，歪歪斜斜的每叶上都写着‘仁义道德’几个字”，字缝里才是另两个字。 || Check by the page: virtue written, cannibalism beneath.

问：《狂人日记》的结尾发出了怎样的呼喊？
答：救救孩子
据：《狂人日记》第十三则：“没有吃过人的孩子，或者还有？救救孩子……” || The last entry: “Perhaps there are still children who have not eaten men? Save the children…”
错：打倒列强 || “打倒列强”是二十年代北伐时的口号。 || “Down with the powers” is a 1920s slogan.
错：回到故乡 || 书里没有回故乡。 || there is no homecoming.
错：天下太平 || “天下太平”和全篇的惊恐正相反。 || peace is the opposite of its terror.
验：从孩子对：狂人觉得大人都吃过人，只有孩子还可能没有，所以希望在孩子身上。 || Check by the children: only they may be innocent.

问：《孔乙己》是通过谁的眼睛来写孔乙己的？
答：咸亨酒店里的一个小伙计
据：《孔乙己》：“我从十二岁起，便在镇口的咸亨酒店里当伙计”，故事由这个小伙计讲。 || “Kong Yiji”: “From twelve I worked as a boy at the Xianheng tavern” — the boy tells it.
错：孔乙己本人 || 孔乙己是被讲的人。 || Kong Yiji is the subject.
错：丁举人 || 丁举人只在别人嘴里出现。 || Mr Ding appears only in talk.
错：孔乙己的邻居 || 书里没有他的邻居出场。 || no neighbour narrates.
验：从结尾那句对：“我到现在终于没有见——大约孔乙己的确死了”，正是伙计多年后的回忆。 || Check by the last line: the boy, years later.

问：孔乙己是一个怎样的人？
答：读过书却没有考上秀才、穷困潦倒的人
据：《孔乙己》：“孔乙己原来也读过书，但终于没有进学，又不会营生”。 || “Kong Yiji”: he had studied but never passed the first exam, and could make no living.
错：家里有很多田地的财主 || 有田地的是丁举人那样的人。 || land belongs to men like Mr Ding.
错：在县里做官的人 || 做官的是中了举的丁举人。 || office belongs to the graduate Ding.
错：咸亨酒店的掌柜 || 掌柜是在粉板上记他欠十九个钱的人。 || the owner chalks up his nineteen coppers.
验：从长衫对：他“是站着喝酒而穿长衫的唯一的人”，穿长衫是读书人，站着喝是穷。 || Check by his gown: a scholar's robe, a pauper's stance.

问：孔乙己的腿是怎么断的？
答：偷了丁举人家的东西，被打断了
据：《孔乙己》：他偷到丁举人家里，被打了大半夜，又打折了腿。 || “Kong Yiji”: he stole from Mr Ding and was beaten half the night, his legs broken.
错：喝醉了酒，在路上摔断了 || 书里没写他醉后摔断。 || he did not fall drunk.
错：在战场上受了伤 || 他没有上过战场。 || he never went to war.
错：得了重病，慢慢不能走了 || 是被打断的，不是病的。 || beaten, not ill.
验：从他最后一次来对：他用手撑着“走”来，说是“跌断，跌，跌……”，众人一笑，可见大家都知道是打断的。 || Check by his lie: he says he fell, and they laugh.

问：《药》中，华老栓为了给儿子治病，买来的“药”是什么？
答：蘸了人血的馒头
据：《药》：华老栓向刽子手康大叔买了蘸着革命者鲜血的馒头。 || “Medicine”: Old Shuan buys from the executioner a bun soaked in a revolutionary's blood.
错：从山里采来的草药 || 书里不是草药。 || it is no herb.
错：从城里买来的西药 || 书里不是西药。 || it is no foreign medicine.
错：一碗熬了很久的米粥 || 书里不是米粥。 || it is no porridge.
验：从康大叔的话对：他在茶馆里说“这样的人血馒头，什么痨病都包好”。 || Check by Kang: “a blood bun cures any consumption”.

问：《药》中被杀害的革命者叫什么名字？
答：夏瑜
据：《药》：被杀的是夏三奶奶的儿子夏瑜。 || “Medicine”: the executed man is Xia Yu, son of Granny Xia.
错：华小栓 || 华小栓是吃人血馒头的病孩子。 || Little Shuan is the sick boy.
错：阿Q || 阿Q是《阿Q正传》里的人。 || Ah Q is another story's.
错：闰土 || 闰土是《故乡》里的人。 || Runtu is in My Old Home.
验：从两家的姓对：“华”“夏”合起来是“华夏”，两家的悲剧就是整个中国的。 || Check by the surnames: Hua and Xia together mean China.

问：《药》的结尾，夏瑜的坟上出现了什么？
答：一圈红白相间的花
据：《药》第四节：夏瑜坟顶上有“一圈红白的花”，夏妈妈很吃惊。 || “Medicine”, part 4: a wreath of red and white flowers lies on Xia Yu's grave.
错：一棵新栽的大树 || 坟边有一株没有叶的树，上面停着乌鸦，不是新栽的。 || there is a leafless tree with a crow, not a new one.
错：一块刻着名字的石碑 || 书里没有刻名字的碑。 || there is no stone.
错：一只白色的鸽子 || 结尾飞起来的是乌鸦，不是鸽子。 || it is a crow that flies, not a dove.
验：从《自序》对：鲁迅说他“不恤用了曲笔，在《药》的瑜儿的坟上平空添上一个花环”。 || Check by the preface: he added the wreath on purpose.

问：《故乡》中，“我”回故乡是为了什么？
答：告别老屋，把家人接到“我”谋生的地方去
据：《故乡》：“我这次是专为了别他而来的”，老屋卖了，要把母亲接到“我”谋食的异地。 || “My Old Home”: the house is sold, and he comes to say goodbye and take his mother away.
错：给家里的长辈过生日 || 书里没写给长辈过生日。 || there is no birthday.
错：在故乡找一份工作 || 他是来离开故乡的。 || he comes to leave.
错：回去看一场社戏 || 看社戏是另一篇《社戏》。 || the opera is another story.
验：从结尾对：小说最后写的是“我”坐船离开，看着故乡远去，可见是来告别的。 || Check by the end: he sails away.

问：《故乡》中，中年闰土见到“我”，叫了一声什么，让“我”感到两人之间隔了一层厚障壁？
答：老爷
据：《故乡》：闰土恭敬地叫了一声“老爷！……”，“我”觉得“我们之间已经隔了一层可悲的厚障壁了”。 || “My Old Home”: Runtu says respectfully “Master!” and the narrator feels a thick wall between them.
错：迅哥儿 || “迅哥儿”是少年闰土的叫法，中年时已不这样叫了。 || “Brother Xun” was the boy's word.
错：哥哥 || 闰土让儿子水生给“我”磕头，自己没叫哥哥。 || Runtu makes his son bow.
错：朋友 || “朋友”书里没有这样叫。 || “friend” is not said.
验：从少年对：少年闰土和“我”无话不谈，叫“迅哥儿”，正对比出“老爷”的隔膜。 || Check by the boy: the old name shows the distance.

问：《故乡》结尾关于路的一段话，表达的是什么意思？
答：希望就像地上的路，走的人多了，也就有了
据：《故乡》结尾：“其实地上本没有路，走的人多了，也便成了路。” || The end: “There was no road; when many walk it, it becomes one.”
错：出门在外，一定要认清方向 || 这句话不是讲认方向。 || it is not about direction.
错：故乡的路已经和从前不一样了 || 路是比喻，不是说真的路变了。 || the road is a figure.
错：人生的路会越走越窄 || 作者说的是路会出来，不是变窄。 || he says a road appears.
验：从上一句对：“希望本是无所谓有，无所谓无的”，下一句才用路来比希望。 || Check by the line before: hope neither exists nor not.

问：《阿Q正传》中，阿Q被人欺负以后，常用什么办法安慰自己？
答：在心里把失败想成胜利，比如当作是儿子打了老子
据：《阿Q正传》第二章“优胜记略”：阿Q被打了，就想“我总算被儿子打了”，于是心满意足。 || Ah Q chapter 2: beaten, he tells himself his son has beaten him, and feels victorious.
错：到县里去告状 || 他不告状，也告不起。 || he never sues.
错：偷偷练武，准备报仇 || 他没有练武。 || he does not train.
错：搬到别的村子去住 || 他后来进城是去谋生，不是为躲人搬走。 || he goes to town for work, not to flee.
验：从“精神胜利法”对：他打不过人就在心里转败为胜，所以挨打后反而得意。 || Check by his method: defeat turned to victory in his head.

问：阿Q住在哪里？
答：未庄的土谷祠
据：《阿Q正传》：阿Q“没有家，住在未庄的土谷祠里”。 || Ah Q: he has no home and sleeps in Weizhuang's Tutelary God temple.
错：鲁镇的咸亨酒店 || 咸亨酒店在鲁镇，是孔乙己喝酒的地方。 || the Xianheng tavern is Kong Yiji's.
错：城里的一户大户人家 || 大户人家是赵太爷家，阿Q只是去打短工。 || the big house is Zhao's, where he does odd jobs.
错：县城的衙门里 || 衙门是他最后被抓进去的地方。 || the yamen is where he is taken at the end.
验：从被赶走对：他向吴妈求爱后，地保要他赔钱，还不许他再进赵家，他只能回土谷祠。 || Check by his banishment: he goes back to the temple.

问：阿Q最后的结局是什么？
答：被当作抢劫的犯人枪毙了
据：《阿Q正传》第九章“大团圆”：赵家被抢，阿Q被抓去当替罪羊，游街后枪毙。 || Ah Q chapter 9: after the Zhao house is robbed, he is seized as scapegoat, paraded and shot.
错：发了一笔财，回到未庄 || 他从城里带回过些钱和衣物，但很快花光，没发财。 || he brings back a little loot, soon gone.
错：参加革命，当上了官 || 假洋鬼子不准他革命，他没当上官。 || the fake foreigner bars him from the revolution.
错：离开未庄，到外地谋生 || 他去过城里又回来了，最后死在县城。 || he goes and returns, and dies in the town.
验：从回目对：“大团圆”是反话，写的正是他糊里糊涂地被枪毙。 || Check by the irony: the “happy ending” is his execution.

问：阿Q临死前在供状上画圆圈，他最在意的是什么？
答：圆圈画得不够圆
据：《阿Q正传》第九章：他画圆圈，“画得不圆”而羞愧，又安慰自己“孙子才画得很圆的圆圈呢”。 || Chapter 9: ashamed that his circle is not round, he consoles himself that only grandsons draw round circles.
错：自己的性命保不住了 || 他到游街时才隐约觉得要杀头，画圈时并不在意。 || only on the cart does he sense death.
错：没有人给他送饭 || 书里没写他在意送饭。 || food is not his worry.
错：赵太爷会不会来看他 || 书里没写他想赵太爷来看。 || he does not await Zhao.
验：从精神胜利法对：连性命攸关的时刻他也只在乎面子，这正是第二章那套办法的结局。 || Check by his method: face matters even at death.

问：《社戏》中，“我”和小伙伴们是怎样去看戏的？
答：晚上划着船去赵庄
据：《社戏》：“我”和小伙伴们夜里借了航船，划到赵庄去看戏。 || “Village Opera”: at night he and the boys borrow a boat and row to Zhao Village.
错：白天走路进城 || 是晚上，而且划船去。 || at night, by boat.
错：坐着马车去县里 || 他们划船，没有马车。 || by boat, not cart.
错：跟着大人坐轿子去 || 大人没跟去，是小伙伴担保的。 || no adults go; the boys vouch for him.
验：从回来的路上对：他们在船上偷吃六一公公的罗汉豆，可见是坐船去的。 || Check by the beans: they steal them on the way back by boat.

问：《社戏》的结尾说再也没有吃到那夜那样好的豆、看到那夜那样好的戏，主要是因为什么？
答：那一夜和小伙伴们在一起，自由又快乐
据：《社戏》结尾：“真的，一直到现在，我实在再没有吃到那夜似的好豆，——也不再看到那夜似的好戏了。” || The end: never again such good beans or such good opera.
错：那夜的豆是花了很多钱买来的 || 豆是偷摘的六一公公家的，没花钱。 || the beans were taken from Liuyi's field.
错：那夜的戏班子是全国最有名的 || 戏其实并不好看，老旦一直唱，他们看得打呵欠。 || the opera was dull; they yawned.
错：后来那里再也不种豆了 || 六一公公第二天还送豆来，那里还种豆。 || Liuyi sends more beans next day.
验：从戏的好坏对：那夜的戏明明沉闷，他却说好，可见好的不是戏，是那夜的快乐。 || Check by the dull opera: what was good was the night.

问：《一件小事》中，让“我”感到惭愧的是谁？
答：一个人力车夫
据：《一件小事》：车夫撞了老女人，主动扶她去巡警分驻所，“我”觉得自己的“小”。 || “A Small Incident”: the rickshaw man knocks a woman over and helps her to the police post; the narrator feels small.
错：一个巡警 || 巡警只是来传话的，“我”还托他把铜元给车夫。 || the policeman only passes word.
错：一个老女人 || 老女人是被撞的人。 || the woman is the one hurt.
错：一个学生 || 书里没有学生。 || there is no student.
验：从“我”的反应对：“我”先嫌老女人装腔作势、怪车夫多事，后来看到车夫的背影高大起来，才惭愧。 || Check by his turn: first annoyed, then ashamed.

问：《风波》中的“风波”是怎样引起的？
答：传说皇帝又坐了龙庭，而七斤已经剪了辫子
据：《风波》：张勋复辟，传说“皇帝坐了龙庭”，而七斤进城时已被剪了辫子。 || “A Storm in a Teacup”: rumour says the emperor is back, and Sevenpounds has lost his queue in town.
错：村里发了一场大水 || 书里没写发大水。 || there is no flood.
错：七斤家里失了火 || 书里没写失火。 || there is no fire.
错：七斤的女儿要出嫁 || 女儿六斤还小，正在裹脚。 || his daughter is a small girl.
验：从赵七爷对：他特意穿上长衫来看七斤有没有辫子，可见风波就因为辫子。 || Check by Mr Zhao: he comes in his gown to look at the queue.

问：《明天》中，单四嫂子失去了谁？
答：她的儿子宝儿
据：《明天》：寡妇单四嫂子的儿子宝儿病死了。 || “Tomorrow”: the widow Fourth Shan's son Bao'er dies of illness.
错：她的丈夫 || 她早已守寡，丈夫不在了。 || her husband is long dead.
错：她的母亲 || 书里没写她母亲。 || her mother is absent.
错：她的女儿 || 她只有宝儿一个孩子。 || Bao'er is her only child.
验：从篇名对：她夜里盼着“明天”宝儿会好，可宝儿还是死了。 || Check by the title: she hopes for tomorrow.

问：《头发的故事》借谈什么来回顾辛亥革命前后的事？
答：剪辫子
据：《头发的故事》：N先生在双十节借剪辫子的往事，回顾辛亥革命前后。 || “The Story of Hair”: on the Double Tenth, Mr N recalls cutting queues to look back on 1911.
错：穿衣服 || 民国改的是辫子，衣服谁都可以照旧穿，N先生说的苦都是辫子惹的。 || dress could stay as it was; Mr N's troubles all came from the queue.
错：吃饭 || 吃饭和革命前后的变化无关，篇名就叫“头发的故事”。 || meals have nothing to do with the revolution; the title says hair.
错：读书 || N先生说的是留学生剪了辫子回国被人骂，读书本身不是话题。 || Mr N speaks of students mocked for cutting queues, not of study itself.
验：从《风波》对：辫子在两篇里都是革命的象征，剪了辫子就意味着跟上了新朝。 || Check by Storm: the queue marks loyalty in both.

问：《白光》中的陈士成是一个怎样的人？
答：一次又一次考不中、最后发了疯的读书人
据：《白光》：陈士成考了十六回县考都没中，发疯去挖银子，最后淹死在湖里。 || “White Light”: after sixteen failed exams Chen Shicheng goes mad digging for silver and drowns.
错：一个走南闯北的商人 || 他一辈子没离开过家乡。 || he never leaves home.
错：一个为革命牺牲的青年 || 他和革命无关；为革命牺牲的是《药》里的夏瑜。 || that is Xia Yu in Medicine.
错：一个勤劳的农民 || 他是读书人，不种地。 || he is a scholar, not a farmer.
验：从孔乙己对：两人都是考不中的读书人，一个被打断腿，一个发了疯。 || Check by Kong Yiji: both failed scholars.

问：《兔和猫》《鸭的喜剧》和书中其他各篇相比，有什么不同？
答：写的是小动物和日常小事，语气比较轻松
据：《兔和猫》《鸭的喜剧》：写北京寓所里的小兔、小鸭和盲诗人爱罗先珂，语气轻松。 || “Rabbits and a Cat”, “The Comedy of the Ducks”: rabbits, ducklings and the blind poet Eroshenko in a Beijing house, lightly told.
错：都是很长的长篇小说 || 它们是全书最短的几篇。 || they are among the shortest.
错：写的是外国的战争 || 书里写的是院子里的小事，没有战争。 || there is no war.
错：都是用诗写成的 || 它们和其他各篇一样是白话散文体小说。 || they are prose like the rest.
验：从《狂人日记》对：放在一起看，一边是“吃人”，一边是小鸭小兔，轻重差别很明显。 || Check by contrast with the Madman.

问：《呐喊》中很多小说写到的地方，如鲁镇、未庄，大多以哪里为原型？
答：作者的家乡浙江绍兴一带
据：全书：鲁镇、未庄、赵庄多以作者家乡浙江绍兴一带为原型，有乌篷船、社戏和黄酒。 || The book: Luzhen, Weizhuang and Zhao Village are modelled on Shaoxing, with its awning boats, operas and yellow wine.
错：北京城里的胡同 || 《一件小事》《兔和猫》写在北京，但鲁镇、未庄不是北京。 || some stories are set in Beijing, but not these villages.
错：上海的租界 || 书里没写上海租界。 || the Shanghai concessions are absent.
错：日本的东京 || 鲁迅在日本学医是在仙台，不是这些小镇的原型。 || Japan is in the preface, not the villages.
验：从咸亨酒店对：绍兴至今还有咸亨酒店，卖的正是书里的黄酒和茴香豆。 || Check by the Xianheng: it still stands in Shaoxing.

问：鲁迅小说里常常写到一群围观别人的苦难、把它当作热闹来看的人，这些人常被称作什么？
答：看客
据：《自序》和《药》《阿Q正传》：围观同胞受苦的人被称为“看客”。 || The preface, “Medicine”, Ah Q: those who watch suffering as a show are called onlookers.
错：侠客 || 侠客是武侠小说里行侠仗义的人。 || a knight-errant is from martial tales.
错：说客 || 说客是战国时替人游说的人。 || a persuader is a Warring States envoy.
错：门客 || 门客是孟尝君那样的贵族家里养的人。 || a retainer serves a noble house.
验：从幻灯片对：《自序》里围观同胞被杀的中国人，和《阿Q正传》里看阿Q游街的人，是同一种人。 || Check by the slides and Ah Q's parade: the same crowd.

问：读《呐喊》，比较恰当的方法是什么？
答：把小说放回当时的社会，看作者揭示了人们怎样的精神状态
据：《自序》：作者写小说是为了改变国人的精神，所以读时要把小说放回当时的社会。 || The preface: he wrote to change minds, so read the stories in their society.
错：只记住每篇小说的情节 || 只记情节就看不出作者要揭示的精神。 || plot alone misses the purpose.
错：只背诵书中的精彩句子 || 只背句子就丢了整篇的意思。 || quotations lose the whole.
错：只读《自序》，不读小说 || 《自序》只是说明，小说才是正文。 || the preface explains; the stories are the work.
验：从书名对：“呐喊”是为了唤醒铁屋里的人，读者要看懂的正是那些人的精神状态。 || Check by the title: a shout to wake the sleepers.
`,
  },
];
