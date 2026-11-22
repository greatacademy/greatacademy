// The texts of the first reading topics of grade 6 (docs/chinese-curriculum.md §18.9): short fiction, prose and
// arguments written for this subject, and classical poems in the public domain with notes written for it. The format
// is that of parsePieces in topic-kit.ts: a question's wrong options carry the reason they are wrong.

/** FICTION_6 are the stories of reading-6-fiction: their people seen through the plot, and their setting. */
export const FICTION_6 = `
# 最后一班渡船
天快黑了，江面上起了风，浪一个接一个地打在码头的石阶上。老周把渡船拴好，正准备回家，远处跑来一个背着大包的姑娘，一边跑一边喊：“师傅，等一等！”
“今天风大，不开了。”老周摆摆手。姑娘急得快哭了：“我妈住院了，我得赶到对岸的医院去。”
老周看了看江面，又看了看姑娘，一句话没说，解开了缆绳。船在浪里摇得厉害，姑娘紧紧抓着船舷，脸都白了。老周弓着腰，两只手死死地握住船舵，眼睛盯着对岸的灯光。
船靠岸了，姑娘要给钱，老周把她的手推了回去：“快去吧，别让你妈等。”说完，他调转船头，消失在风浪里。
?1 老周开始为什么不肯开船？ | Why did Lao Zhou refuse at first?
= 风大，开船危险 | 今天风大，不开了 | 江面上起了风，浪一个接一个地打在码头的石阶上
- 他不认识这个姑娘 ~unsaid
- 船坏了 ~unsaid
?1 老周最后为什么又开了船？ | Why did he sail after all?
= 姑娘的妈妈住院了，她急着去医院 | 我妈住院了，我得赶到对岸的医院去 | 姑娘急得快哭了
- 姑娘给了他很多钱 ~opposite
- 风停了 ~opposite
?1 从老周“一句话没说，解开了缆绳”可以看出他是个怎样的人？ | What kind of man does untying the rope in silence show?
≈ 话不多，却热心肠，肯为别人冒险 | 一句话没说，解开了缆绳 | 老周看了看江面，又看了看姑娘 | 快去吧，别让你妈等
- 脾气很坏，不爱理人 ~opposite
- 做事很马虎 ~unsaid
?2 开头写“江面上起了风，浪一个接一个地打在码头的石阶上”，有什么作用？ | What does the opening wind and waves do?
≈ 写出渡江危险，为后面老周冒险开船做铺垫 | 浪一个接一个地打在码头的石阶上 | 今天风大，不开了 | 船在浪里摇得厉害
- 说明江边的风景很美 ~mismatch
- 说明老周很喜欢江 ~unsaid
?2 “船在浪里摇得厉害”，这一环境描写表现了什么？ | What does the rocking boat show?
≈ 渡江的艰险，更显出老周的勇敢 | 船在浪里摇得厉害 | 老周弓着腰，两只手死死地握住船舵
- 船太小，装不下人 ~unsaid
- 姑娘很喜欢坐船 ~opposite
?2 结尾“消失在风浪里”，给人怎样的感觉？ | What does the last image leave?
≈ 老周又独自回到危险中，让人敬佩又担心 | 他调转船头，消失在风浪里 | 船在浪里摇得厉害
- 老周不想再见到姑娘 ~unsaid
- 风浪已经停了 ~opposite

# 补鞋匠
巷子口有个补鞋摊，摊主是个哑巴，大家都叫他“老哑”。他的摊子只有一把伞、一个小凳、一只装满工具的木箱。
一个下雨天，一个穿得很破的小男孩站在摊前，脚上的球鞋张着“大嘴”。他红着脸，从口袋里摸出几枚硬币。老哑看了看鞋，又看了看硬币，摆摆手，示意他坐下。他把鞋放在膝盖上，一针一针地缝，缝得又密又直。雨点打在伞上，噼啪作响，他却好像没听见。
鞋补好了，老哑从箱子里拿出一双新鞋垫，塞进了鞋里。男孩要把硬币放下，老哑却把他的手合上，指了指他的书包，又竖起了大拇指。
?1 老哑的摊子有哪些东西？ | What makes up the stall?
= 一把伞、一个小凳、一只木箱 | 他的摊子只有一把伞、一个小凳、一只装满工具的木箱
- 一张大桌子和几把椅子 ~unsaid
- 一个小房子 ~unsaid
?1 老哑“指了指他的书包，又竖起了大拇指”，是什么意思？ | What does pointing to the satchel and a thumbs-up mean?
≈ 鼓励男孩好好读书 | 指了指他的书包，又竖起了大拇指 | 男孩要把硬币放下
- 想要男孩的书包 ~sense
- 说男孩的书包很好看 ~literal
?1 从这个故事可以看出老哑是个怎样的人？ | What kind of man is Lao Ya?
≈ 善良、体贴，乐于帮助穷苦的孩子 | 老哑从箱子里拿出一双新鞋垫，塞进了鞋里 | 老哑看了看鞋，又看了看硬币，摆摆手 | 老哑却把他的手合上
- 小气，只想多赚钱 ~opposite
- 粗心，补鞋补得很差 ~opposite
?2 “雨点打在伞上，噼啪作响，他却好像没听见”，写出了什么？ | What does the rain he seems not to hear show?
≈ 老哑补鞋专心致志 | 他却好像没听见 | 一针一针地缝，缝得又密又直
- 老哑的耳朵听不见 ~literal
- 雨下得很小 ~opposite
?2 故事发生在一个下雨天，这样安排有什么作用？ | What does setting it on a rainy day do?
≈ 雨天更衬出男孩的困难和老哑的温暖 | 一个下雨天 | 脚上的球鞋张着“大嘴” | 雨点打在伞上，噼啪作响
- 说明补鞋只能在雨天 ~sense
- 和故事没有关系 ~sense
?2 男孩“红着脸，从口袋里摸出几枚硬币”，表现了男孩怎样的心情？ | What does his red face and few coins show?
≈ 钱不够，不好意思 | 他红着脸，从口袋里摸出几枚硬币 | 一个穿得很破的小男孩
- 很生气 ~mismatch
- 很得意 ~mismatch

# 考场上的橡皮
期末考试，数学考到一半，我的橡皮掉到了地上，滚到了前面李强的脚边。李强是我们班成绩最好的同学，也是我最想超过的人。
我小声喊他，他没有回头。我只好举手，监考老师走过来，帮我捡起了橡皮。我心里有点生气：他一定是故意不理我。
考完试，李强走过来，拿出一块新橡皮递给我：“刚才考试，我不能回头，怕老师以为我们在说话。这块送你，下次多带一块。”我接过橡皮，脸一下子热了。
成绩出来了，我比李强少了两分。我第一次没有觉得难过。
?1 我的橡皮为什么滚到了李强脚边？ | How did my eraser reach Li Qiang?
= 考试时掉到地上滚过去了 | 我的橡皮掉到了地上，滚到了前面李强的脚边 | 数学考到一半
- 我故意扔给他的 ~unsaid
- 他借走了 ~unsaid
?1 李强为什么没有回头？ | Why did Li Qiang not turn round?
= 考试时回头，怕老师以为我们在说话 | 怕老师以为我们在说话 | 刚才考试，我不能回头
- 他故意不理我 ~opposite
- 他没听见 ~unsaid
?1 “我第一次没有觉得难过”，说明我有了什么变化？ | What change does the last line show?
≈ 不再只想着超过李强，对他有了新的认识 | 我第一次没有觉得难过 | 也是我最想超过的人 | 我比李强少了两分 | 我接过橡皮，脸一下子热了
- 我不再在乎学习了 ~unsaid
- 我考得比李强好 ~opposite
?2 故事的情节在哪里发生了转折？ | Where does the plot turn?
≈ 考完试，李强送我新橡皮并说明原因 | 考完试，李强走过来，拿出一块新橡皮递给我 | 他一定是故意不理我 | 我接过橡皮，脸一下子热了
- 我的橡皮掉到了地上 ~sense
- 成绩出来了 ~sense
?2 故事发生在考场上，这个环境对情节有什么作用？ | What does the exam room do for the plot?
≈ 考场不许说话，才有了“不回头”的误会 | 刚才考试，我不能回头 | 我小声喊他，他没有回头 | 他一定是故意不理我
- 说明数学很难 ~unsaid
- 说明我们是同桌 ~unsaid
?2 “我接过橡皮，脸一下子热了”，表现了我怎样的心情？ | What does my face burning show?
≈ 误会了李强，感到惭愧 | 我接过橡皮，脸一下子热了 | 他一定是故意不理我 | 怕老师以为我们在说话
- 教室里太热了 ~literal
- 很高兴得到了新橡皮 ~mismatch

# 雪夜送药
那年冬天特别冷，山村被大雪封住了路。半夜，村东头的小芳发起了高烧，她的奶奶急得团团转。村里唯一的医生住在山那边。
十五岁的哥哥阿明二话没说，穿上棉衣，打着手电就出了门。雪没过了膝盖，每走一步都要用力把腿拔出来。风像刀子一样刮在脸上，手电的光在漫天的雪里只照得见一小块地方。他摔倒了好几次，爬起来接着走。
天快亮的时候，阿明带着医生回来了。他的眉毛和头发上结满了白霜，像个小老头。小芳退了烧，睁开眼，看见哥哥坐在床边睡着了。
?1 阿明为什么要连夜出门？ | Why did A Ming go out at night?
= 妹妹发高烧，要去山那边请医生 | 村里唯一的医生住在山那边 | 小芳发起了高烧
- 他想去山那边看雪 ~unsaid
- 奶奶让他去买药 ~unsaid
?1 阿明什么时候回到家的？ | When did he get back?
= 天快亮的时候 | 天快亮的时候，阿明带着医生回来了
- 半夜 ~changed
- 第二天晚上 ~changed
?1 从阿明“二话没说”出门可以看出他怎样？ | What does his going without a word show?
≈ 关心妹妹，有担当 | 阿明二话没说，穿上棉衣，打着手电就出了门 | 她的奶奶急得团团转 | 他摔倒了好几次，爬起来接着走
- 不爱说话，不关心家人 ~opposite
- 做事不想后果，很鲁莽 ~mismatch
?2 “雪没过了膝盖”“风像刀子一样刮在脸上”，这些环境描写有什么作用？ | What do the deep snow and knife-like wind do?
≈ 写出路途艰难，衬托阿明的勇敢 | 风像刀子一样刮在脸上 | 雪没过了膝盖 | 他摔倒了好几次，爬起来接着走
- 说明山里的风景很美 ~mismatch
- 说明阿明喜欢冬天 ~unsaid
?2 “他的眉毛和头发上结满了白霜，像个小老头”，写出了什么？ | What does the frost on his brows show?
≈ 阿明在寒夜里走了很久，非常辛苦 | 他的眉毛和头发上结满了白霜 | 天快亮的时候，阿明带着医生回来了
- 阿明真的变老了 ~literal
- 阿明在路上玩雪了 ~unsaid
?2 结尾写阿明“坐在床边睡着了”，有什么作用？ | What does his falling asleep at the bedside do?
≈ 写出他的疲惫，也写出他对妹妹的牵挂 | 看见哥哥坐在床边睡着了 | 天快亮的时候，阿明带着医生回来了
- 说明阿明不关心妹妹 ~opposite
- 说明天又黑了 ~unsaid

# 第一百个客人
小镇上有一家面馆。一天中午，客人刚走完，进来一位老奶奶，牵着一个小男孩。老奶奶问了价钱，只要了一碗面，推到孙子面前，自己喝着免费的面汤。
老板看在眼里，走过去说：“老人家，您真幸运，您是今天的第一百个客人，这碗面免费。”老奶奶连声道谢。
过了一个多月，老板发现那个男孩每天都蹲在店门口，往地上放小石子，一颗，两颗……老板明白了，他在数客人，想让奶奶也当一回“第一百个客人”。可是来的客人总是不够多。
这天，老板悄悄打了几个电话。不一会儿，熟人们一个接一个地来了。男孩数到第九十九颗石子时，飞快地跑回了家……
?1 老板为什么说老奶奶是“第一百个客人”？ | Why did the owner call her the hundredth guest?
≈ 想让她吃一碗免费的面，又不伤她的自尊 | 这碗面免费 | 只要了一碗面，推到孙子面前，自己喝着免费的面汤 | 您是今天的第一百个客人
- 她真的是第一百个客人 ~opposite
- 店里正在搞抽奖活动 ~unsaid
?1 男孩每天往地上放小石子是在做什么？ | What was the boy doing with the pebbles?
= 数来吃面的客人 | 他在数客人 | 往地上放小石子，一颗，两颗
- 在玩游戏 ~opposite
- 在铺一条小路 ~unsaid
?1 从“悄悄打了几个电话”可以看出老板怎样？ | What does the quiet phone calls show of the owner?
≈ 善良细心，想成全男孩的孝心 | 老板悄悄打了几个电话 | 想让奶奶也当一回“第一百个客人” | 熟人们一个接一个地来了
- 想让店里生意更好 ~mismatch
- 想把男孩赶走 ~opposite
?2 结尾停在男孩“飞快地跑回了家”，有什么好处？ | What is gained by ending as the boy runs home?
≈ 留下想象的空间，读者能想到接下来会发生什么 | 男孩数到第九十九颗石子时，飞快地跑回了家 | 想让奶奶也当一回“第一百个客人”
- 说明故事没有写完 ~sense
- 说明男孩不想让奶奶吃面 ~opposite
?2 老奶奶“自己喝着免费的面汤”，写出了什么？ | What does her drinking the free broth show?
≈ 家里困难，奶奶把面留给孙子 | 自己喝着免费的面汤 | 老奶奶问了价钱，只要了一碗面，推到孙子面前
- 奶奶不喜欢吃面 ~unsaid
- 面汤特别好喝 ~unsaid
?2 故事的高潮是哪一部分？ | Which part is the climax?
≈ 熟人们一个接一个来，男孩数到第九十九颗石子 | 熟人们一个接一个地来了 | 男孩数到第九十九颗石子时，飞快地跑回了家 | 可是来的客人总是不够多
- 老奶奶只要了一碗面 ~sense
- 老板说面免费 ~sense

# 守林人
大兴安岭深处有一座小木屋，屋里住着守林人老王。他一个人在这里守了二十年。
夏天，蚊子成群地往身上扑；冬天，零下四十度，水缸里的水冻成了冰坨。老王每天背着水壶和干粮，在林子里走几十里路，看有没有着火的地方，有没有偷砍树的人。没有人说话，他就对着树说，对着鸟说。
有人问他：“一个人在山里，不闷吗？”老王指着满山的树说：“你看，这些都是我的孩子，我怎么会闷？”
今年，老王要退休了。下山那天，他在每一棵熟悉的大树上拍了拍，就像跟老朋友告别。
?1 老王每天在林子里做什么？ | What does Lao Wang do each day?
= 巡山，看有没有着火和偷砍树的 | 看有没有着火的地方，有没有偷砍树的人 | 在林子里走几十里路
- 砍树卖钱 ~opposite
- 打猎 ~unsaid
?1 老王为什么说“不闷”？ | Why does he say he is not lonely?
= 他把满山的树当作自己的孩子 | 这些都是我的孩子 | 我怎么会闷
- 山里有很多人陪他 ~opposite
- 他每天看电视 ~unsaid
?1 “在每一棵熟悉的大树上拍了拍”，表现了老王怎样的感情？ | What does patting each tree show?
≈ 对森林的深深眷恋 | 就像跟老朋友告别 | 他在每一棵熟悉的大树上拍了拍 | 这些都是我的孩子
- 想检查树有没有生病 ~literal
- 很高兴终于可以下山了 ~mismatch
?2 第二段写夏天的蚊子和冬天的严寒，有什么作用？ | What do the mosquitoes and the cold do?
≈ 写出守林环境艰苦，衬托老王的坚守 | 冬天，零下四十度，水缸里的水冻成了冰坨 | 夏天，蚊子成群地往身上扑 | 他一个人在这里守了二十年
- 介绍大兴安岭的气候 ~narrow
- 说明老王不想守林 ~opposite
?2 “没有人说话，他就对着树说，对着鸟说”，写出了什么？ | What does talking to trees and birds show?
≈ 守林生活孤独，老王却和森林有了感情 | 他就对着树说，对着鸟说 | 没有人说话 | 这些都是我的孩子
- 老王会说鸟的语言 ~literal
- 老王的脑子有问题 ~sense
?2 小说开头写“大兴安岭深处有一座小木屋”，交代了什么？ | What does the first sentence set up?
≈ 故事发生的环境：偏远的深山老林 | 大兴安岭深处有一座小木屋 | 他一个人在这里守了二十年
- 老王的年龄 ~unsaid
- 老王的家人 ~unsaid

# 一张旧地图
放暑假，爷爷从箱底翻出一张旧地图，纸已经发黄，边角都磨破了。他指着上面一个小圆点说：“这是我出生的村子。”
我用手机一查，那里早已变成了一个大湖，村子在建水库时搬走了。爷爷听了，半天没说话，只是用手指在那个小圆点上轻轻地摸来摸去。
第二天，爸爸开车带爷爷去了湖边。湖水很蓝，一眼望不到边。爷爷站在岸上，望着湖心，忽然说：“我家门口有一棵大枣树，就在那儿。”他指的地方，只有一片水，几只白鹭从水面上飞过。
回来的路上，爷爷把那张地图叠得整整齐齐，放进了上衣口袋。
?1 爷爷出生的村子后来怎样了？ | What became of Grandpa's village?
= 建水库时搬走了，那里成了大湖 | 那里早已变成了一个大湖 | 村子在建水库时搬走了
- 变成了一座大城市 ~unsaid
- 还和原来一样 ~opposite
?1 爷爷在湖边说了什么？ | What did Grandpa say at the lake?
= 他家门口有一棵大枣树，就在湖心那儿 | 我家门口有一棵大枣树，就在那儿
- 湖水真蓝，真好看 ~unsaid
- 他想在湖里游泳 ~unsaid
?1 “用手指在那个小圆点上轻轻地摸来摸去”，表现了爷爷怎样的心情？ | What does his finger on the dot show?
≈ 怀念故乡，心里不舍 | 用手指在那个小圆点上轻轻地摸来摸去 | 爷爷听了，半天没说话 | 这是我出生的村子
- 在找地图上的错 ~literal
- 很高兴村子变成了湖 ~mismatch
?2 “他指的地方，只有一片水，几只白鹭从水面上飞过”，这一环境描写有什么作用？ | What does the empty water with egrets do?
≈ 写出故乡已经不在，更显出爷爷的思念 | 他指的地方，只有一片水 | 我家门口有一棵大枣树，就在那儿
- 说明湖边的白鹭很多 ~narrow
- 说明爷爷看错了地方 ~sense
?2 开头写地图“纸已经发黄，边角都磨破了”，说明了什么？ | What do the yellowed, worn edges show?
≈ 地图很旧，爷爷常常拿出来看 | 纸已经发黄，边角都磨破了 | 爷爷从箱底翻出一张旧地图
- 爷爷不爱护东西 ~opposite
- 地图是新买的 ~opposite
?2 结尾爷爷把地图“放进了上衣口袋”，有什么含义？ | What does putting the map in his pocket mean?
≈ 故乡虽然没了，爷爷会把它珍藏在心里 | 放进了上衣口袋 | 爷爷把那张地图叠得整整齐齐 | 他指的地方，只有一片水
- 爷爷要扔掉地图 ~opposite
- 爷爷怕地图被雨淋湿 ~unsaid

# 秘密
班上的小雪总是穿着同一件蓝外套，袖口都洗得发白了。有人在背后笑她：“就这一件衣服吗？”小雪听见了，低着头，什么也没说。
一天放学，我在菜市场门口看见了小雪。她系着围裙，正帮一个坐轮椅的女人收拾菜摊，动作又快又熟练。那个女人摸着她的头，笑着说着什么。我愣在那里，悄悄地走开了。
第二天，又有人笑小雪的外套。我站起来说：“衣服旧不旧有什么关系？人家比我们都能干！”大家都看着我，小雪也抬起头看我。我没有说出那个秘密，只是冲她笑了笑。
?1 我在菜市场门口看见小雪在做什么？ | What was Xiaoxue doing at the market?
= 帮坐轮椅的女人收拾菜摊 | 正帮一个坐轮椅的女人收拾菜摊
- 在买新衣服 ~unsaid
- 在和同学玩 ~unsaid
?1 题目中的“秘密”指的是什么？ | What is the secret of the title?
≈ 小雪放学后帮家里摆菜摊，十分能干 | 我没有说出那个秘密 | 她系着围裙，正帮一个坐轮椅的女人收拾菜摊，动作又快又熟练 | 人家比我们都能干
- 小雪只有一件衣服 ~part
- 我考试得了第一 ~never
?1 我为什么“悄悄地走开了”？ | Why did I slip away?
≈ 不想让小雪难为情，想保护她 | 我愣在那里，悄悄地走开了 | 小雪听见了，低着头，什么也没说 | 我没有说出那个秘密
- 我不想帮忙 ~opposite
- 我怕被小雪骂 ~unsaid
?2 开头写小雪的外套“袖口都洗得发白了”，有什么作用？ | What does the faded cuff do?
≈ 写出小雪家境不好，为下文做铺垫 | 袖口都洗得发白了 | 正帮一个坐轮椅的女人收拾菜摊
- 说明小雪很爱干净 ~part
- 说明蓝色不好看 ~unsaid
?2 故事在哪里发生了转折？ | Where does the story turn?
= 我在菜市场门口看见了小雪 | 我在菜市场门口看见了小雪
- 有人笑小雪的外套 ~sense
- 小雪低着头不说话 ~sense
?2 从我站起来说的话可以看出我是个怎样的人？ | What kind of person does my standing up show?
≈ 正直，愿意保护被嘲笑的同学 | 衣服旧不旧有什么关系 | 又有人笑小雪的外套 | 我站起来说
- 爱出风头 ~mismatch
- 和小雪吵过架 ~unsaid

# 灯塔
小岛上只有一座灯塔和一位看塔人。每天傍晚，看塔人沿着一百二十级台阶爬上塔顶，点亮那盏大灯；第二天清晨，再把它熄灭。
有一年秋天，台风来了。狂风卷着海浪，一次次地扑向小岛，塔身都在微微发抖。电断了，大灯熄了。看塔人摸黑爬上塔顶，点起了备用的煤油灯，用身体挡着风，护着那一点小小的火苗。
那一夜，有三条渔船在海上迷了路，船上的人看见了那点微弱的光，拼命地朝它划去，终于平安靠岸。
第二天，渔民们来到灯塔下，看塔人已经累得靠在墙边睡着了，手里还握着那盏灯。
?1 看塔人每天要做什么？ | What does the keeper do each day?
= 傍晚点亮大灯，清晨把它熄灭 | 每天傍晚，看塔人沿着一百二十级台阶爬上塔顶，点亮那盏大灯 | 第二天清晨，再把它熄灭
- 出海打鱼 ~unsaid
- 修理台阶 ~unsaid
?1 台风那夜，三条渔船是怎样平安靠岸的？ | How did the three boats get in safe?
= 看见灯塔上微弱的光，朝它划去 | 船上的人看见了那点微弱的光，拼命地朝它划去
- 台风很快就停了 ~unsaid
- 看塔人开船去接他们 ~unsaid
?1 从看塔人“用身体挡着风”可以看出他怎样？ | What does shielding the flame with his body show?
≈ 尽职尽责，不顾自己的安危 | 用身体挡着风，护着那一点小小的火苗 | 看塔人摸黑爬上塔顶 | 狂风卷着海浪
- 他很怕冷 ~literal
- 他不知道该怎么办 ~opposite
?2 “塔身都在微微发抖”这一环境描写有什么作用？ | What does the trembling tower do?
≈ 写出台风的猛烈，衬托看塔人的勇敢 | 塔身都在微微发抖 | 狂风卷着海浪，一次次地扑向小岛 | 看塔人摸黑爬上塔顶
- 说明灯塔修得不好 ~sense
- 说明看塔人很害怕 ~mismatch
?2 结尾写看塔人“手里还握着那盏灯”，有什么作用？ | What does the lamp still in his hand do?
≈ 写出他守了一整夜，形象更加感人 | 手里还握着那盏灯 | 看塔人已经累得靠在墙边睡着了 | 那一夜
- 说明他忘了放下灯 ~literal
- 说明天还没亮 ~opposite
?2 文中“一百二十级台阶”这个细节说明了什么？ | What do the hundred and twenty steps show?
≈ 每天爬上塔顶很辛苦，看塔人却天天坚持 | 看塔人沿着一百二十级台阶爬上塔顶 | 每天傍晚 | 第二天清晨，再把它熄灭
- 灯塔里有电梯 ~opposite
- 看塔人喜欢数台阶 ~unsaid

# 借书
小镇的图书馆只有一间屋子。管理员是一位姓陈的老先生，戴着厚厚的眼镜，脾气很古怪：借书的人必须先回答他一个问题，答对了才能借。
十岁那年，我想借一本《海底两万里》。陈先生推了推眼镜，问：“你为什么想读它？”我想了想说：“我想知道海底是什么样子。”他摇摇头：“不对。”我急了：“那您说为什么？”他笑了：“因为你好奇。好奇的人，什么书都能读懂。”说着，把书递给了我。
后来我才知道，他问每个孩子的问题都一样，答案也都一样。
?1 在陈先生的图书馆借书有什么规矩？ | What was the rule for borrowing?
= 先回答他一个问题，答对了才能借 | 借书的人必须先回答他一个问题，答对了才能借
- 先交钱才能借 ~unsaid
- 每人只能借一次 ~unsaid
?1 陈先生认为“我”应该读这本书的原因是什么？ | Why, in his view, should I read it?
= 因为我好奇 | 因为你好奇
- 因为我想知道海底的样子 ~opposite
- 因为这本书很有名 ~unsaid
?1 结尾“他问每个孩子的问题都一样，答案也都一样”，说明了什么？ | What does the last line show of Mr Chen?
≈ 他是想借这个问题鼓励每个孩子保持好奇心 | 他问每个孩子的问题都一样，答案也都一样 | 因为你好奇 | 好奇的人，什么书都能读懂
- 他记性不好，只会问一个问题 ~sense
- 他不想把书借给孩子 ~opposite
?2 开头说陈先生“脾气很古怪”，和后文有什么关系？ | How does “odd temper” tie to what follows?
≈ 先抑后扬，读到后面才知道他用心良苦 | 脾气很古怪 | 借书的人必须先回答他一个问题，答对了才能借 | 他问每个孩子的问题都一样，答案也都一样
- 后文写他确实很坏 ~opposite
- 和后文没有关系 ~sense
?2 “陈先生推了推眼镜”，这个动作描写有什么作用？ | What does pushing up his glasses do?
≈ 写出他认真打量“我”，让人物更真实 | 陈先生推了推眼镜 | 你为什么想读它
- 说明他的眼镜坏了 ~unsaid
- 说明他在生气 ~mismatch
?2 故事的环境是“只有一间屋子”的小图书馆，这样写有什么作用？ | What does the one-room library add?
≈ 小镇条件简陋，更显出陈先生对孩子读书的用心 | 小镇的图书馆只有一间屋子 | 好奇的人，什么书都能读懂
- 说明小镇上的人不读书 ~unsaid
- 说明图书馆的书很多 ~opposite
`;

/** PROSE_6 are the prose pieces of reading-6-prose: the feeling they carry, and how they express it. */
export const PROSE_6 = `
# 门前的石阶
老家的门前有三级石阶，是爷爷年轻时一块一块从山上背下来的。
小时候，我坐在石阶上看蚂蚁搬家，等爸爸下班；奶奶坐在石阶上择菜，和邻居聊天。下雨天，雨水顺着石阶流下去，像一条小小的瀑布。
后来我们搬进了城里的楼房，楼梯是水泥的，一级一级都一样，冷冰冰的。我常常想起那三级石阶，想起坐在上面晒太阳的午后。
今年回老家，石阶还在，只是长满了青苔。我坐上去，石头凉凉的，心里却暖暖的。
?1 这篇散文表达了作者怎样的感情？ | What feeling does the piece carry?
≈ 对老家和童年生活的怀念 | 我常常想起那三级石阶 | 小时候，我坐在石阶上看蚂蚁搬家 | 石头凉凉的，心里却暖暖的
- 对城里楼房的喜爱 ~opposite
- 对爷爷的埋怨 ~never
?1 “石头凉凉的，心里却暖暖的”，“暖暖的”是因为什么？ | Why is the heart warm?
≈ 石阶勾起了温暖的回忆 | 石头凉凉的，心里却暖暖的 | 我常常想起那三级石阶，想起坐在上面晒太阳的午后 | 是爷爷年轻时一块一块从山上背下来的
- 那天太阳很大 ~literal
- 作者穿了厚衣服 ~literal
?1 作者说城里的楼梯“冷冰冰的”，表达了什么？ | What does calling the city stairs cold express?
≈ 城里的楼梯没有老家石阶那样的感情 | 一级一级都一样，冷冰冰的 | 是爷爷年轻时一块一块从山上背下来的 | 奶奶坐在石阶上择菜，和邻居聊天 | 我常常想起那三级石阶
% 把前后两处对照着读：老家的三级石阶，是爷爷一块一块从山上背下来的，“我”在上面看蚂蚁、等爸爸，奶奶在上面择菜、聊天，每一级都连着家人和回忆；城里的水泥楼梯却“一级一级都一样”，没有一点这样的故事。“冷冰冰的”不只是说水泥凉，更是说它没有老家石阶那样的人情和回忆。这句话本身没有写“没有感情”，意思是从这个对比里读出来的。 | Read the two places against each other: the three steps at home were carried down the hill one by one by grandfather; on them I watched ants and waited for father, and grandmother picked over vegetables and chatted, so each step holds family and memories. The concrete stairs in town are “every one the same”, with no such story. “Cold” says more than that concrete is cold: the stairs have none of the warmth and memory of the steps at home. The sentence itself does not say “without feeling”; that meaning is read from the contrast.
- 楼梯的温度很低 ~literal
- 作者不喜欢爬楼梯 ~unsaid
?2 文章借三级石阶来写什么？ | What does the piece use the steps to write of?
≈ 借物抒情，借石阶写对老家亲人的思念 | 我坐上去，石头凉凉的，心里却暖暖的 | 是爷爷年轻时一块一块从山上背下来的 | 我常常想起那三级石阶
- 介绍石阶是怎样做成的 ~mismatch
- 说明石头比水泥好 ~sense
?2 文中把城里的水泥楼梯和老家的石阶放在一起写，用的是什么写法？ | What way of writing sets stone beside concrete?
≈ 对比 | 后来我们搬进了城里的楼房 | 一级一级都一样，冷冰冰的 | 老家的门前有三级石阶
- 比喻 ~nolikening
- 排比 ~sense
?2 第二段回忆在石阶上的几件事，有什么作用？ | What do the memories of the second paragraph do?
≈ 写出石阶承载的家的温暖，为后文的思念做铺垫 | 奶奶坐在石阶上择菜，和邻居聊天 | 小时候，我坐在石阶上看蚂蚁搬家，等爸爸下班 | 我常常想起那三级石阶
- 说明作者小时候很无聊 ~mismatch
- 介绍蚂蚁怎样搬家 ~narrow

# 窗外的那棵树
我的书桌正对着窗外的一棵梧桐树。
春天，它冒出嫩绿的新芽，好像在跟我说：“新的一年开始了。”夏天，它的叶子又大又密，挡住了火辣辣的太阳，给我送来一窗的绿荫。秋天，叶子一片片变黄、飘落，我捡起一片夹在书里。冬天，它光秃秃的，枝条却一根根伸向天空，好像在等待着什么。
六年来，我在这扇窗前读书、写字，它在窗外静静地陪着我。我要毕业了，最舍不得的，就是这棵树。
?1 作者对这棵树怀着怎样的感情？ | What does the writer feel for the tree?
= 喜爱和不舍 | 最舍不得的，就是这棵树 | 它在窗外静静地陪着我
- 讨厌它挡住了阳光 ~opposite
- 对它没有什么感觉 ~opposite
?1 “它在窗外静静地陪着我”，作者把树当作什么？ | What does the writer take the tree for?
≈ 陪伴自己的朋友 | 它在窗外静静地陪着我 | 好像在跟我说
- 一件家具 ~sense
- 一位老师 ~unsaid
?1 冬天的树“好像在等待着什么”，表现了作者怎样的心情？ | What feeling is in the waiting winter tree?
≈ 对春天和未来的期盼 | 枝条却一根根伸向天空，好像在等待着什么 | 春天，它冒出嫩绿的新芽，好像在跟我说：“新的一年开始了。”
- 对冬天的害怕 ~nomood
- 对树的同情 ~mismatch
?2 文章是按什么顺序写梧桐树的？ | In what order is the tree written?
= 按春夏秋冬的季节 | 春天，它冒出嫩绿的新芽 | 夏天，它的叶子又大又密 | 秋天，叶子一片片变黄、飘落 | 冬天，它光秃秃的
- 按从上到下 ~wrongorder
- 按事情的发展 ~wrongorder
?2 “好像在跟我说：‘新的一年开始了。’”用了什么修辞手法？ | What figure is the tree speaking?
≈ 拟人 | 好像在跟我说 | 新的一年开始了
% 树不会说话，作者却写它“好像在跟我说”话，把树当成人来写，这种修辞手法叫拟人。 | A tree cannot speak, yet the writer has it seem to “say” something, writing of it as of a person: that figure is personification.
- 夸张 ~sense
- 排比 ~sense
?2 结尾写“我要毕业了”，有什么作用？ | What does “I am about to leave” do?
≈ 点明写这棵树的原因，表达不舍之情 | 我要毕业了，最舍不得的，就是这棵树 | 六年来，我在这扇窗前读书、写字
- 开始讲一个新故事 ~sense
- 说明作者不爱上学 ~opposite

# 父亲的扁担
父亲有一根扁担，又粗又亮，中间被肩膀磨出了一道浅浅的弯。
这根扁担，挑过稻谷，挑过柴火，也挑过我上学的行李。记得那年我去县城读初中，父亲挑着两个大木箱，走了二十多里山路。他一路上很少说话，只是不停地换肩，汗水湿透了后背。
如今父亲老了，扁担靠在墙角，落满了灰尘。我把它擦干净，挂在了客厅的墙上。每次看到那道弯，我就想起父亲弯下的腰。
?1 文章表达了作者对父亲怎样的感情？ | What feeling for Father does the piece carry?
≈ 感激和敬爱 | 每次看到那道弯，我就想起父亲弯下的腰 | 父亲挑着两个大木箱，走了二十多里山路 | 我把它擦干净，挂在了客厅的墙上
- 埋怨父亲不说话 ~opposite
- 嫌弃父亲老了 ~opposite
?1 作者为什么把扁担挂在客厅的墙上？ | Why hang the pole in the sitting room?
≈ 珍惜它，用它纪念父亲的辛劳 | 我把它擦干净，挂在了客厅的墙上 | 扁担靠在墙角，落满了灰尘 | 我就想起父亲弯下的腰
- 用来装饰房子 ~mismatch
- 以后还要用它挑东西 ~unsaid
?1 父亲“一路上很少说话，只是不停地换肩”，写出了什么？ | What does his silent shifting of shoulders show?
≈ 父亲沉默、辛苦，把爱藏在行动里 | 只是不停地换肩，汗水湿透了后背 | 他一路上很少说话 | 走了二十多里山路
- 父亲在生作者的气 ~mismatch
- 父亲的肩膀受伤了 ~unsaid
?2 文章借扁担来写父亲，这种写法叫什么？ | What is it to write Father through the pole?
≈ 借物写人 | 父亲有一根扁担 | 这根扁担，挑过稻谷，挑过柴火，也挑过我上学的行李 | 我就想起父亲弯下的腰
- 借景抒情 ~sense
- 直接说明 ~sense
?2 “扁担中间那道弯”和“父亲弯下的腰”放在一起，表达了什么？ | What do the bent pole and the bent back say together?
≈ 扁担的弯是父亲为家操劳的见证 | 每次看到那道弯，我就想起父亲弯下的腰 | 中间被肩膀磨出了一道浅浅的弯
- 扁担做得不直 ~literal
- 父亲腰疼 ~literal
?2 第二段列出扁担挑过的东西，有什么作用？ | What does listing the loads do?
≈ 写出父亲为家付出了很多 | 这根扁担，挑过稻谷，挑过柴火，也挑过我上学的行李 | 我就想起父亲弯下的腰
- 介绍农村的庄稼 ~narrow
- 说明扁担很结实 ~narrow

# 夜听雨
小时候住在乡下，最爱夜里听雨。
雨落在瓦上，叮叮咚咚，像有人在屋顶弹琴；落在院子里的芭蕉叶上，啪嗒啪嗒，声音又大又圆；落在池塘里，沙沙沙，轻得像蚕吃桑叶。我躺在床上，听着听着就睡着了，梦里也是雨声。
现在住在城里，窗外是车声、人声，很少听得见雨。偶尔下一场大雨，我也会关了灯，站在窗前，可听到的只是雨打在玻璃上的声音，单调而急促。
我想念的，或许不只是那些雨声，还有那个无忧无虑的自己。
?1 作者在文中表达了怎样的感情？ | What feeling does the piece carry?
≈ 对乡下童年生活的怀念 | 还有那个无忧无虑的自己 | 小时候住在乡下，最爱夜里听雨 | 现在住在城里
- 对城市生活的喜爱 ~opposite
- 对下雨天的厌烦 ~opposite
?1 结尾一句说明作者真正想念的是什么？ | What does the writer truly miss?
= 不只是雨声，还有无忧无虑的童年 | 我想念的，或许不只是那些雨声，还有那个无忧无虑的自己 | 小时候住在乡下
- 只是乡下的雨声 ~part
- 城里的车声 ~opposite
?1 城里的雨声“单调而急促”，表现了作者怎样的心情？ | What feeling is in the dull, hurried rain of the city?
≈ 失落，找不到小时候听雨的感觉 | 单调而急促 | 很少听得见雨 | 最爱夜里听雨
- 欢喜 ~nomood
- 害怕 ~nomood
?2 第二段把雨落在瓦上、芭蕉上、池塘里的声音分开写，用的是什么写法？ | How does the second paragraph write the rain?
≈ 从不同的地方写雨声，写得具体生动 | 落在池塘里，沙沙沙，轻得像蚕吃桑叶 | 雨落在瓦上，叮叮咚咚 | 落在院子里的芭蕉叶上，啪嗒啪嗒
- 按时间先后写 ~wrongorder
- 直接抒发感情 ~notlyric
?2 “像有人在屋顶弹琴”用了什么修辞手法？ | What figure is “like someone playing on the roof”?
≈ 比喻 | 像有人在屋顶弹琴 | 雨落在瓦上，叮叮咚咚
% 句子用“像”把雨落在瓦上的叮咚声，比作有人在屋顶弹琴的声音，拿一样东西比另一样东西，这种修辞手法叫比喻。 | The sentence uses “like” to liken the patter of rain on the tiles to someone playing a zither on the roof; likening one thing to another is a simile.
- 拟人 ~sense
- 夸张 ~sense
?2 文章把乡下听雨和城里听雨放在一起写，有什么作用？ | What does setting country rain beside city rain do?
≈ 通过对比，突出对乡下生活的怀念 | 现在住在城里，窗外是车声、人声，很少听得见雨 | 小时候住在乡下，最爱夜里听雨 | 单调而急促
- 说明城里不下雨 ~literal
- 说明乡下的雨更大 ~unsaid

# 野菊花
秋天，山坡上开满了野菊花。它们没有人浇水，也没有人施肥，就那样一丛一丛地长在石缝里、路边上。
别的花都谢了，它们却开得正旺。一朵朵小小的黄花，在秋风里摇着，不害怕，也不张扬。霜来了，叶子冻得发紫，花却依然开着。
我想起了村里的李奶奶。她一个人把三个孩子拉扯大，从来没有叫过一声苦。她就像这野菊花，在最冷的季节里，开出最暖的颜色。
?1 作者借野菊花赞美了什么？ | What does the writer praise through the flower?
≈ 像李奶奶那样在困难中坚强乐观的人 | 她就像这野菊花 | 她一个人把三个孩子拉扯大，从来没有叫过一声苦 | 霜来了，叶子冻得发紫，花却依然开着
- 只赞美野菊花好看 ~part
- 赞美秋天的风景 ~mismatch
?1 “不害怕，也不张扬”说出了野菊花怎样的品格？ | What character is “unafraid and unshowy”?
≈ 坚强而朴实 | 在秋风里摇着，不害怕，也不张扬 | 一朵朵小小的黄花
- 胆小怕事 ~opposite
- 爱出风头 ~opposite
?1 “在最冷的季节里，开出最暖的颜色”，是什么意思？ | What does “the warmest colour in the coldest season” mean?
≈ 在最艰难的处境里，依然给人温暖和希望 | 在最冷的季节里，开出最暖的颜色 | 她一个人把三个孩子拉扯大，从来没有叫过一声苦
- 野菊花是红色的 ~literal
- 冬天很暖和 ~literal
?2 文章先写野菊花，再写李奶奶，用的是什么写法？ | What way of writing passes from flower to woman?
≈ 托物言志，借物写人 | 我想起了村里的李奶奶 | 她就像这野菊花 | 秋天，山坡上开满了野菊花
- 按时间顺序记事 ~sense
- 说明野菊花的种类 ~nokinds
?2 “别的花都谢了，它们却开得正旺”用了什么写法？ | What way of writing is this?
≈ 对比，突出野菊花的顽强 | 别的花都谢了，它们却开得正旺 | 霜来了，叶子冻得发紫，花却依然开着
- 比喻 ~nolikening
- 列数字 ~nonumber
?2 第一段写野菊花“没有人浇水，也没有人施肥”，有什么作用？ | What do “no one waters it” do?
≈ 写出它生长环境艰苦，表现它的顽强 | 没有人浇水，也没有人施肥 | 就那样一丛一丛地长在石缝里、路边上
- 说明野菊花不需要水 ~sense
- 说明村里的人很懒 ~unsaid

# 校园的钟声
我们学校有一口老钟，挂在操场边的大榕树上。上课、下课，都靠它来告诉大家。
早上，钟声清脆，叫醒了整个校园；中午，钟声悠长，送我们去吃饭；傍晚，钟声慢慢地响，像在说：“孩子们，明天见。”
后来，学校装了电铃，老钟不响了。可是我们每次走过大榕树，还会抬头看一看它。
毕业那天，校长又敲响了那口钟，“当——当——当——”，我们站在操场上，谁也没有说话。
?1 这篇散文表达了怎样的感情？ | What feeling does the piece carry?
≈ 对校园生活的留恋 | 毕业那天，校长又敲响了那口钟 | 我们站在操场上，谁也没有说话 | 还会抬头看一看它
- 对电铃的喜爱 ~opposite
- 对上学的厌烦 ~opposite
?1 “我们站在操场上，谁也没有说话”，表现了怎样的心情？ | What does our silence show?
≈ 依依不舍，心里感慨万千 | 我们站在操场上，谁也没有说话 | 毕业那天，校长又敲响了那口钟
- 不想听钟声 ~mismatch
- 没有什么感觉 ~mismatch
?1 老钟不响了以后，我们“还会抬头看一看它”，说明了什么？ | What does looking up at the silent bell show?
≈ 我们对老钟有很深的感情 | 可是我们每次走过大榕树，还会抬头看一看它 | 后来，学校装了电铃，老钟不响了
- 老钟坏了，大家想修好它 ~unsaid
- 大家担心老钟会掉下来 ~unsaid
?2 第二段写早上、中午、傍晚的钟声，用了什么写法？ | How does the second paragraph write the bell?
≈ 写出不同时候钟声的不同，用拟人写出亲切 | 像在说：“孩子们，明天见。” | 早上，钟声清脆 | 中午，钟声悠长
- 用列数字说明钟有多大 ~nonumber
- 用分类别说明钟的种类 ~nokinds
?2 文章开头写老钟，结尾又写校长敲响老钟，这种结构叫什么？ | What is the structure that opens and closes on the bell?
≈ 首尾呼应 | 校长又敲响了那口钟 | 我们学校有一口老钟
% 文章开头写学校有一口老钟，结尾又写毕业那天校长敲响了它：开头提到的东西，结尾又回到它，前后相互照应，这种结构叫首尾呼应。 | The essay opens on the school's old bell and ends with the headmaster ringing it on leaving day: what the opening names, the ending returns to, the two answering each other. That shape is called echoing the opening in the ending.
- 倒叙 ~wrongorder
- 总分总 ~wrongorder
?2 “当——当——当——”中的破折号表示什么？ | What do the dashes in 当——当—— mark?
≈ 钟声悠长 | “当——当——当——” | 中午，钟声悠长
% 破折号把每一声“当”拉长了，读的时候要拖着声音，像钟声一声一声地传开、久久不断，所以表示钟声悠长。 | The dashes draw out each “dang”, to be read long, as the bell's notes spread one by one and linger; so they show the long ringing of the bell.
- 说话被打断 ~sense
- 后面是解释 ~sense

# 外婆的蒲扇
外婆有一把蒲扇，扇面已经发黄，扇柄被摸得油亮。
夏天的夜晚，没有空调，我热得睡不着。外婆就坐在床边，一下一下地给我扇着，嘴里哼着我听不懂的老歌。风凉凉的，带着一股淡淡的草香。我常常在扇子的风里睡着，醒来时，外婆还在扇。
有一回，我问外婆：“你不累吗？”外婆笑了：“扇着扇着，手就不知道累了。”
外婆走了好几年了。现在我睡在有空调的屋子里，却常常在梦里，感觉到那一阵一阵的风。
?1 文章表达了作者对外婆怎样的感情？ | What feeling for Granny does the piece carry?
≈ 深深的怀念 | 却常常在梦里，感觉到那一阵一阵的风 | 外婆走了好几年了
- 对外婆的埋怨 ~opposite
- 对蒲扇的厌烦 ~opposite
?1 “醒来时，外婆还在扇”，说明了什么？ | What does “she was still fanning” show?
≈ 外婆扇了很久，非常疼爱我 | 醒来时，外婆还在扇 | 我常常在扇子的风里睡着
- 外婆睡不着觉 ~unsaid
- 外婆忘了停下来 ~literal
?1 “扇着扇着，手就不知道累了”，表现了外婆怎样的心？ | What heart does “the hand forgets it is tired” show?
≈ 为了孩子，再累也心甘情愿 | 扇着扇着，手就不知道累了 | 你不累吗
- 外婆的手真的不会累 ~literal
- 外婆不想说实话 ~unsaid
?2 文章借什么来表达对外婆的思念？ | Through what is the longing expressed?
= 借一把蒲扇 | 外婆有一把蒲扇 | 却常常在梦里，感觉到那一阵一阵的风
- 借一首老歌 ~part
- 借夏天的星星 ~never
?2 结尾写“有空调的屋子”和“那一阵一阵的风”，用的是什么写法？ | What way of writing is the last sentence?
≈ 对比，空调代替不了外婆的爱 | 现在我睡在有空调的屋子里 | 却常常在梦里，感觉到那一阵一阵的风 | 夏天的夜晚，没有空调
- 夸张 ~sense
- 比喻 ~nolikening
?2 “扇柄被摸得油亮”这个细节说明了什么？ | What does the shiny handle show?
≈ 外婆用了很多年，常常给我扇 | 扇柄被摸得油亮 | 一下一下地给我扇着
- 扇子是新买的 ~opposite
- 扇柄上涂了油 ~literal

# 一碗面
每次离家，妈妈都要给我煮一碗面。面里卧着两个荷包蛋，撒着碧绿的葱花。妈妈说：“出门吃面，路才走得长。”
第一次去外地读书，我吃着面，看见妈妈坐在对面，一直看着我，碗里的面却一口没动。临走时，她往我包里塞了一袋又一袋吃的，送到车站，又站在那里，直到车开远了，还在挥手。
后来，我吃过许多地方的面，可是再也没有哪一碗，比得上家里的那一碗。
?1 作者通过一碗面表达了什么？ | What does the bowl of noodles express?
≈ 母亲对孩子的爱和作者对家的思念 | 比得上家里的那一碗 | 每次离家，妈妈都要给我煮一碗面 | 看见妈妈坐在对面，一直看着我
- 作者喜欢吃面条 ~part
- 外地的面不好吃 ~literal
?1 妈妈“碗里的面却一口没动”，说明了什么？ | What does her untouched bowl show?
≈ 妈妈舍不得孩子离开，心思全在孩子身上 | 碗里的面却一口没动 | 一直看着我 | 第一次去外地读书
- 妈妈不饿 ~unsaid
- 面煮得不好吃 ~unsaid
?1 “再也没有哪一碗，比得上家里的那一碗”，为什么？ | Why can no bowl match it?
≈ 家里的面里有妈妈的爱 | 可是再也没有哪一碗，比得上家里的那一碗 | 每次离家，妈妈都要给我煮一碗面 | 出门吃面，路才走得长
- 家里的面用的是最好的面粉 ~unsaid
- 别的地方不会煮面 ~sense
?2 文中写妈妈的几个动作：看着我、塞吃的、挥手，有什么作用？ | What do her watching, packing and waving do?
≈ 用具体的动作表现母爱，不直接说出来 | 往我包里塞了一袋又一袋吃的 | 一直看着我 | 直到车开远了，还在挥手
- 说明妈妈很忙 ~mismatch
- 介绍车站的样子 ~unsaid
?2 “出门吃面，路才走得长”这句话在文中有什么作用？ | What does Mother's saying do?
≈ 写出妈妈的祝福，也点出“一碗面”的意义 | 出门吃面，路才走得长 | 每次离家，妈妈都要给我煮一碗面
- 说明吃面能让人走得快 ~literal
- 介绍怎样煮面 ~narrow
?2 文章以“一碗面”为题，好在哪里？ | What is good in the title?
≈ 以小见大，一碗普通的面写出深深的母爱 | 每次离家，妈妈都要给我煮一碗面 | 比得上家里的那一碗 | 碗里的面却一口没动
- 说明文章是介绍美食的 ~mismatch
- 题目和内容没有关系 ~sense

# 山路
去外婆家，要走一条弯弯的山路。
小时候，我嫌山路太长，走不了几步就要爸爸背。爸爸一边走一边教我认路边的花草：这是映山红，那是金银花。走着走着，山路好像就变短了。
长大以后，我自己走这条路。我发现，路边的花草还是那些，石头还是那些，只是背我的人，头发已经白了。
人生的路也像这山路，弯弯曲曲，有上坡也有下坡。可是只要有人陪着，再长的路也不怕。
?1 文章表达了怎样的感情和道理？ | What feeling and lesson does the piece carry?
≈ 感激父亲的陪伴，懂得有人陪伴就不怕路长 | 只要有人陪着，再长的路也不怕 | 只是背我的人，头发已经白了 | 人生的路也像这山路
- 讨厌走山路 ~opposite
- 山路越短越好 ~sense
?1 “山路好像就变短了”，是因为什么？ | Why did the path seem shorter?
≈ 爸爸陪我认花草，走得有趣 | 爸爸一边走一边教我认路边的花草 | 走着走着，山路好像就变短了
- 爸爸带我走了近路 ~unsaid
- 我长高了 ~unsaid
?1 “只是背我的人，头发已经白了”，表达了什么？ | What does “his hair is white now” express?
≈ 感叹父亲老了，心中感慨 | 只是背我的人，头发已经白了 | 走不了几步就要爸爸背
- 爸爸染了头发 ~literal
- 爸爸生病了 ~unsaid
?2 最后一段用的是什么写法？ | What way of writing is the last paragraph?
≈ 由山路联想到人生，说出道理 | 人生的路也像这山路 | 可是只要有人陪着，再长的路也不怕
- 描写山路的样子 ~notdescribe
- 列数字说明路有多长 ~nonumber
?2 第二、三段把小时候和长大后放在一起写，有什么作用？ | What does setting childhood beside now do?
≈ 对比中写出时光流逝和父亲的老去 | 长大以后，我自己走这条路 | 走不了几步就要爸爸背 | 只是背我的人，头发已经白了
- 说明山路变了 ~opposite
- 说明我不再去外婆家 ~opposite
?2 “路边的花草还是那些，石头还是那些”，有什么作用？ | What does “the same flowers, the same stones” do?
≈ 景物没变，衬出人已变老 | 路边的花草还是那些，石头还是那些 | 只是背我的人，头发已经白了
- 说明山里很荒凉 ~unsaid
- 说明作者记性很好 ~unsaid

# 灯
小时候，村里还没有通电，家家点煤油灯。
晚上，妈妈把灯放在桌子中间，我在灯下写作业，她在灯下缝衣服。灯光小小的，黄黄的，只照得见一张桌子。妈妈常常把灯往我这边推一推，自己凑近了，眯着眼睛穿针。
后来，村里通了电，家家亮起了电灯，屋子里亮堂堂的。可我总忘不了那盏小油灯，忘不了妈妈眯着眼睛穿针的样子。
那盏灯照亮的，不只是一张桌子，还有我的整个童年。
?1 文章表达了作者怎样的感情？ | What feeling does the piece carry?
≈ 对母亲的感激和对童年的怀念 | 忘不了妈妈眯着眼睛穿针的样子 | 那盏灯照亮的，不只是一张桌子，还有我的整个童年
- 对电灯的赞美 ~mismatch
- 对没有电的抱怨 ~mismatch
?1 妈妈“把灯往我这边推一推”，说明了什么？ | What does pushing the lamp to me show?
≈ 妈妈把光让给我，自己吃苦 | 妈妈常常把灯往我这边推一推 | 自己凑近了，眯着眼睛穿针 | 灯光小小的，黄黄的，只照得见一张桌子
- 灯放得不稳 ~unsaid
- 妈妈不需要灯光 ~opposite
?1 “照亮的……还有我的整个童年”是什么意思？ | What does “lit my whole childhood” mean?
≈ 母爱温暖了我的童年 | 还有我的整个童年 | 妈妈常常把灯往我这边推一推
- 油灯点了很多年 ~literal
- 童年的晚上很亮 ~literal
?2 文中把煤油灯和电灯放在一起写，有什么作用？ | What does setting oil lamp beside electric light do?
≈ 对比中突出那盏油灯在作者心中的分量 | 后来，村里通了电 | 屋子里亮堂堂的 | 可我总忘不了那盏小油灯
- 说明电灯比油灯更暗 ~opposite
- 介绍电是怎样来的 ~unsaid
?2 结尾一句用了什么写法？ | What way of writing is the last sentence?
≈ 由实到虚，借灯抒情 | 那盏灯照亮的，不只是一张桌子 | 还有我的整个童年
- 说明灯的用处 ~sense
- 列数字 ~nonumber
?2 “灯光小小的，黄黄的，只照得见一张桌子”，有什么作用？ | What does the small yellow light do?
≈ 写出油灯光弱，为写妈妈让灯做铺垫 | 灯光小小的，黄黄的，只照得见一张桌子 | 妈妈常常把灯往我这边推一推
- 说明桌子很小 ~literal
- 说明油灯很好看 ~unsaid
`;

/** ARGUMENTS_6 are the short arguments of reading-6-argument: the view each argues, and the examples it gives. */
export const ARGUMENTS_6 = `
# 失败是成功的阶梯
人们常说，失败是成功之母。一次失败，并不说明你不行，只要从中找到原因，失败就会成为通向成功的阶梯。
爱迪生发明电灯时，试过一千多种材料，都失败了。有人笑他白费力气，他却说：“我没有失败，我只是找到了一千多种不能用的材料。”最后，他终于找到了合适的灯丝。
我们学习也是这样。一道题做错了，不要灰心，把错在哪里弄明白，下次就不会再错。
所以，面对失败，我们要冷静地找原因，而不是放弃。
?1 这篇短文的观点是什么？ | What view does the text argue?
= 失败只要找到原因，就能成为成功的阶梯 | 只要从中找到原因，失败就会成为通向成功的阶梯
- 爱迪生发明了电灯 ~notview
- 做错题不要灰心 ~narrow
?1 作者的观点在文中出现在哪里？ | Where is the view stated?
≈ 第一段提出，最后一段总结 | 只要从中找到原因，失败就会成为通向成功的阶梯 | 所以，面对失败，我们要冷静地找原因，而不是放弃
% 第一段说“只要从中找到原因，失败就会成为通向成功的阶梯”，这是作者的看法；最后一段用“所以”开头，又说“要冷静地找原因，而不是放弃”，把这个看法再说一遍。可见观点在开头提出，在结尾总结。 | The first paragraph says that once we find the cause, failure becomes a step to success: that is the writer's view. The last paragraph opens with “so” and says again that we should calmly find the cause and not give up. The view is put at the start and summed up at the end.
- 只在第二段 ~elsewhere
- 文中没有说出来 ~opposite
?1 最后一段和第一段是什么关系？ | How does the last paragraph answer the first?
≈ 呼应开头，总结观点 | 所以，面对失败，我们要冷静地找原因 | 只要从中找到原因，失败就会成为通向成功的阶梯
% 最后一段的“找原因”，正是第一段“找到原因”的意思，开头和结尾说的是同一个观点；结尾又用“所以”收住全文。所以它和第一段是呼应开头、总结观点的关系。 | “Find the cause” in the last paragraph repeats the “find the cause” of the first: the start and the end hold the same view, and the end, opening with “so”, closes the essay. So it echoes the opening and sums up the view.
- 提出一个新的观点 ~sense
- 讲了一个新的事例 ~sense
?2 作者举爱迪生的事例，是为了证明什么？ | What does the Edison example prove?
≈ 失败中找到原因，最终能获得成功 | 最后，他终于找到了合适的灯丝 | 试过一千多种材料，都失败了 | 只要从中找到原因，失败就会成为通向成功的阶梯
- 电灯是很难发明的 ~noproof
- 爱迪生很会说话 ~noproof
?2 文中第三段举学习中做错题的例子，有什么作用？ | What does the wrong sum example do?
≈ 联系我们的生活，让观点更有说服力 | 一道题做错了，不要灰心 | 我们学习也是这样 | 爱迪生发明电灯时
% 爱迪生的事离我们比较远；作者接着说“我们学习也是这样”，举出做错题这件人人都遇到过的事。从名人说到我们自己，读者会觉得这个道理就在身边，观点也就更有说服力。 | Edison's story is far from us; the writer goes on, “our learning is the same”, and gives the wrong sum everyone has met. Moving from a famous man to ourselves makes the point feel close at hand, and the view more convincing.
- 说明数学题很难 ~noproof
- 和观点没有关系 ~sense
?2 爱迪生说“我只是找到了一千多种不能用的材料”，表现了什么？ | What do Edison's words show?
≈ 他把失败看成收获，不灰心 | 我只是找到了一千多种不能用的材料 | 我没有失败 | 有人笑他白费力气
- 他不承认自己做错了 ~opposite
- 他已经不想再试了 ~opposite

# 读书要有选择
书是人类的朋友，可并不是每一本书都值得读。
现在的书多得像大海，有好书，也有内容粗糙、甚至有害的书。我们的时间有限，如果什么书都读，就可能把时间浪费在没用的书上。
古人说：“书犹药也，善读之可以医愚。”药用对了能治病，用错了却会伤身。读书也一样，要选那些能让我们增长知识、懂得道理的书。
怎样选书呢？可以听听老师和家长的建议，也可以先看看目录和开头几页，再决定读不读。
?1 这篇短文的观点是什么？ | What view does the text argue?
= 读书要有选择 | 可并不是每一本书都值得读 | 读书要有选择
- 书是人类的朋友 ~part
- 古人很会读书 ~notview
?1 作者认为为什么读书要有选择？ | Why must one choose, the writer says?
= 书有好有坏，时间有限 | 有好书，也有内容粗糙、甚至有害的书 | 我们的时间有限
- 买书要花很多钱 ~unsaid
- 书太重，带不动 ~unsaid
?1 文中提出了哪些选书的方法？ | What ways of choosing does the text give?
= 听老师和家长的建议，先看目录和开头几页 | 可以听听老师和家长的建议 | 也可以先看看目录和开头几页，再决定读不读
- 只读最厚的书 ~unsaid
- 只读别人都在读的书 ~unsaid
?2 作者引用“书犹药也”这句话，是为了说明什么？ | What does the saying about medicine argue?
≈ 书选对了有益，选错了有害 | 药用对了能治病，用错了却会伤身 | 读书也一样，要选那些能让我们增长知识、懂得道理的书
- 读书能治病 ~literal
- 药比书重要 ~noproof
?2 把书比作药，用的是什么论证方法？ | What way of arguing likens books to medicine?
≈ 比喻论证 | 书犹药也，善读之可以医愚 | 药用对了能治病，用错了却会伤身
% 作者借古人的话，把书比作药：药用对了治病，用错了伤身，书也一样有益有害。用一个人们熟悉的比方来讲道理，这种论证方法叫比喻论证。 | The writer borrows an old saying and likens books to medicine: rightly taken it heals, wrongly taken it harms, and books too can help or hurt. Arguing through a familiar likeness is called argument by analogy.
- 举例论证 ~noexample
- 对比论证 ~nocompare
?2 “现在的书多得像大海”，这句话为观点提供了什么？ | What does the sea of books lend the view?
≈ 书太多，所以更需要选择 | 现在的书多得像大海 | 我们的时间有限，如果什么书都读，就可能把时间浪费在没用的书上
- 说明大海里有书 ~literal
- 说明书越多越好 ~noproof

# 小事不小
有人认为，小事不值得做，要做就做大事。我却觉得，小事不小。
古人说：“一屋不扫，何以扫天下？”连自己的屋子都打扫不干净的人，又怎么能做成大事呢？
有一位科学家，每次做完实验，都要把仪器擦得干干净净，摆放整齐。有人说他浪费时间，他说：“仪器干净，数据才准确。”正是这种对小事的认真，让他取得了很多成果。
在生活中，随手关灯、按时还书、主动问好，都是小事，却能看出一个人的品格。
?1 这篇短文的观点是什么？ | What view does the text argue?
= 小事不小，要认真做好小事 | 我却觉得，小事不小
- 要做就做大事 ~opposite
- 科学家应该把仪器擦干净 ~notview
?1 文章开头先写“有人认为，小事不值得做”，有什么作用？ | What does opening with the opposite view do?
≈ 先摆出不同的看法，再提出自己的观点 | 有人认为，小事不值得做，要做就做大事 | 我却觉得，小事不小
% 第一句摆出别人的看法，第二句用“却”一转，说出“小事不小”。先有不同的看法，作者的观点和它一对照，就显得更鲜明。所以开头这句是先摆出不同的看法，再提出自己的观点。 | The first sentence sets out another view; the second turns on “but” and gives “small things are not small”. Set against a different view, the writer's own stands out more clearly. So the opening sets out a different view, then gives the writer's own.
- 这就是作者的观点 ~opposite
- 和下文没有关系 ~sense
?1 最后一段说明了什么？ | What does the last paragraph show?
= 生活中的小事能看出一个人的品格 | 却能看出一个人的品格 | 随手关灯、按时还书、主动问好，都是小事
- 小事做不做都可以 ~opposite
- 关灯能省很多电 ~unsaid
?2 科学家擦仪器的事例证明了什么？ | What does the scientist example prove?
≈ 认真做好小事，才能做成大事 | 正是这种对小事的认真，让他取得了很多成果 | 每次做完实验，都要把仪器擦得干干净净，摆放整齐
- 科学家很爱干净 ~noproof
- 做实验很浪费时间 ~noproof
?2 引用“一屋不扫，何以扫天下”，有什么作用？ | What does the old saying do?
≈ 用古人的话证明观点，更有说服力 | 一屋不扫，何以扫天下 | 连自己的屋子都打扫不干净的人，又怎么能做成大事呢
- 告诉我们要天天扫地 ~literal
- 说明古人不爱扫地 ~sense
?2 第四段列举随手关灯、按时还书、主动问好，用的是什么论证方法？ | What way of arguing lists turning off lights and the like?
≈ 举例论证 | 随手关灯、按时还书、主动问好 | 都是小事，却能看出一个人的品格
% 作者举出随手关灯、按时还书、主动问好这几件具体的事，来证明小事能看出品格。用具体的事例来证明观点，这种论证方法叫举例论证。 | The writer gives several real acts, switching off lights, returning books on time, greeting first, to show that small things reveal character. Proving a view by real examples is called argument by example.
- 比喻论证 ~nolikening
- 道理论证 ~sense

# 说话的艺术
同样一件事，说法不同，效果也大不一样。会说话，是一种本领。
有一位顾客在饭店里吃出了一根头发。第一位服务员说：“不可能，我们的厨房很干净。”顾客很生气。第二位服务员说：“真对不起，我马上给您换一份。”顾客的气消了，还夸这家店服务好。
两位服务员说的话，结果完全不同。可见，说话时多替别人想一想，用尊重和真诚的语气，往往能化解矛盾。
当然，会说话不是说假话。真诚，才是说话最重要的艺术。
?1 这篇短文的观点是什么？ | What view does the text argue?
≈ 说话要替别人着想，真诚尊重，才能有好效果 | 用尊重和真诚的语气，往往能化解矛盾 | 说话时多替别人想一想 | 真诚，才是说话最重要的艺术
- 饭店里会吃出头发 ~notview
- 会说话就是会说假话 ~opposite
?1 最后一段补充说明了什么？ | What does the last paragraph add?
= 会说话不是说假话，真诚最重要 | 会说话不是说假话 | 真诚，才是说话最重要的艺术
- 说话越多越好 ~unsaid
- 服务员都很会说话 ~unsaid
?1 “可见”这个词后面的话，在文中起什么作用？ | What does the sentence after 可见 do?
≈ 从事例中得出结论 | 可见，说话时多替别人想一想 | 两位服务员说的话，结果完全不同
% “可见”前面讲的是两位服务员的事和不同的结果，后面说的是一个道理。“可见”的意思是“由此能看出”，所以它后面的话是从事例中得出的结论。 | Before “so we see” come the two waiters and their different results; after it comes a general point. “So we see” means “from this it can be seen”, so what follows is the conclusion drawn from the example.
- 举出一个新的事例 ~sense
- 描写服务员的样子 ~notdescribe
?2 两位服务员的事例用的是什么论证方法？ | What way of arguing are the two waiters?
≈ 对比论证 | 两位服务员说的话，结果完全不同 | 不可能，我们的厨房很干净 | 真对不起，我马上给您换一份
% 作者把两位服务员的话放在一起：一个说“不可能”，顾客很生气；一个先道歉再换菜，顾客消了气。把两种做法和结果摆在一起比，这种论证方法叫对比论证。 | The writer sets the two waiters side by side: one says “impossible” and the customer is angry; one apologizes and replaces the dish, and the anger fades. Setting two ways and their results against each other is called argument by contrast.
- 比喻论证 ~nolikening
- 引用论证 ~sense
?2 第二位服务员的话为什么让顾客消了气？ | Why did the second waiter calm the customer?
≈ 他先道歉，又马上解决问题 | 真对不起，我马上给您换一份 | 顾客的气消了
- 他请顾客免费吃饭 ~unsaid
- 他和顾客是朋友 ~unsaid
?2 这个事例证明了什么？ | What does the example prove?
= 说法不同，效果大不一样 | 同样一件事，说法不同，效果也大不一样
- 饭店的厨房不干净 ~noproof
- 服务员不应该说话 ~noproof

# 坚持的力量
水滴本身很柔弱，可是日复一日地滴下去，连坚硬的石头也能滴穿。这就是坚持的力量。
王羲之小时候练字，每天写完就到池塘边洗笔，时间长了，一池清水都变黑了。正是这样的坚持，他后来成了著名的书法家。
有的同学学钢琴，刚开始兴致勃勃，几个月后觉得枯燥就放弃了，结果什么也没学会。
做任何事情，开始并不难，难的是坚持到底。只要不放弃，再小的力量也能积累成大的成就。
?1 这篇短文的观点是什么？ | What view does the text argue?
= 只要坚持，再小的力量也能取得大成就 | 只要不放弃，再小的力量也能积累成大的成就
- 王羲之的字写得好 ~notview
- 学钢琴很枯燥 ~notview
?1 文章开头写水滴石穿，有什么作用？ | What does the dripping water do?
≈ 用生活中的现象引出观点 | 这就是坚持的力量 | 连坚硬的石头也能滴穿
% 水滴石穿是人们都见过的现象；第二句紧接着说“这就是坚持的力量”，从这个现象引到要讲的道理上。所以开头写水滴石穿，是用生活中的现象引出观点。 | Dripping water wearing through stone is something all have seen; the next sentence says at once, “this is the power of keeping on”, leading from the sight to the point. So the opening uses an everyday sight to bring in the view.
- 介绍石头的种类 ~unsaid
- 说明水很硬 ~opposite
?1 作者认为做事难在哪里？ | What is hard, the writer says?
= 坚持到底 | 难的是坚持到底
- 开始做 ~opposite
- 找到老师 ~unsaid
?2 王羲之洗笔的事例证明了什么？ | What does the Wang Xizhi example prove?
≈ 坚持不懈才能取得成就 | 正是这样的坚持，他后来成了著名的书法家 | 每天写完就到池塘边洗笔
- 池塘里的水很容易变黑 ~noproof
- 写字要用好墨 ~noproof
?2 学钢琴半途而废的例子，和王羲之的例子是什么关系？ | How does the piano example relate to Wang Xizhi?
≈ 一正一反，形成对比 | 结果什么也没学会 | 正是这样的坚持，他后来成了著名的书法家
% 王羲之坚持练字，成了书法家；学钢琴的同学半途放弃，什么也没学会。一个坚持、一个放弃，结果正好相反：两个例子一正一反，形成对比。 | Wang Xizhi kept practicing and became a great calligrapher; the piano pupil gave up halfway and learned nothing. One kept on, one gave up, with opposite results: one example for and one against, set in contrast.
- 两个例子说的意思一样 ~sense
- 和观点没有关系 ~sense
?2 “一池清水都变黑了”这个细节说明了什么？ | What does the blackened pond show?
≈ 王羲之练字时间长、次数多 | 一池清水都变黑了 | 每天写完就到池塘边洗笔，时间长了
- 王羲之不爱干净 ~noproof
- 墨的质量很好 ~noproof

# 学会倾听
很多人喜欢说，却不喜欢听。其实，会倾听比会说更重要。
倾听能让我们学到东西。孔子说：“三人行，必有我师焉。”认真听别人说话，就能从别人身上学到长处。
倾听也是对人的尊重。别人说话时，你看着对方，点点头，对方就会觉得被重视；如果你东张西望，随便打断，对方就会很失望。
有一次，班里讨论春游去哪里。小华一直在认真听，最后他把大家的意见综合起来，提出了一个人人都满意的方案。
所以，在说之前，先学会听吧。
?1 这篇短文的观点是什么？ | What view does the text argue?
= 会倾听比会说更重要 | 会倾听比会说更重要
- 春游要去公园 ~notview
- 孔子有很多老师 ~notview
?1 文中从哪两方面说倾听的好处？ | From which two sides is listening shown good?
= 能学到东西，也是对人的尊重 | 倾听能让我们学到东西 | 倾听也是对人的尊重
- 能长高，能变聪明 ~unsaid
- 能少说话，能多休息 ~unsaid
?1 文中说，别人说话时我们应该怎样做？ | What should one do when others speak?
= 看着对方，点点头 | 你看着对方，点点头
- 东张西望 ~opposite
- 随时打断 ~opposite
?2 引用孔子的话是为了证明什么？ | What does the Confucius quotation prove?
= 倾听能让我们学到东西 | 倾听能让我们学到东西
- 孔子喜欢旅行 ~noproof
- 三个人一起走路很好 ~literal
?2 小华的事例证明了什么？ | What does the Xiaohua example prove?
≈ 认真倾听能综合大家的意见，把事办好 | 最后他把大家的意见综合起来 | 提出了一个人人都满意的方案 | 小华一直在认真听
- 小华很会说话 ~noproof
- 春游很好玩 ~noproof
?2 “你看着对方……如果你东张西望……”，用的是什么论证方法？ | What way of arguing is the second clause?
≈ 对比论证 | 如果你东张西望，随便打断，对方就会很失望 | 你看着对方，点点头，对方就会觉得被重视
% 这句话把两种听法放在一起：看着对方、点点头，对方觉得被重视；东张西望、随便打断，对方很失望。把两种做法和结果摆在一起比，这种论证方法叫对比论证。 | The sentence puts two ways of listening together: look and nod, and the speaker feels valued; glance about and interrupt, and the speaker is let down. Setting two ways and their results against each other is called argument by contrast.
- 比喻论证 ~nolikening
- 引用论证 ~sense

# 节约从一滴水开始
地球上的水看起来很多，可是能直接用的淡水还不到百分之一。很多地方的人，每天要走很远的路才能打到一桶水。
有人觉得，家里的水龙头滴一点水没关系。可是一个滴水的龙头，一个月就能浪费一千多升水，够一个人喝上一年多。
节约用水，不需要做什么大事：洗手时关小龙头，洗菜的水留着浇花，发现漏水及时修。每个人省下一点，加起来就是一条河。
所以，节约要从一滴水开始。
?1 这篇短文的观点是什么？ | What view does the text argue?
= 节约要从一滴水开始 | 所以，节约要从一滴水开始
- 地球上的水很多 ~opposite
- 很多地方的人要走很远的路打水 ~notview
?1 文中提出了哪些节约用水的做法？ | What ways of saving water does it give?
= 洗手关小龙头，洗菜水浇花，漏水及时修 | 洗手时关小龙头 | 洗菜的水留着浇花 | 发现漏水及时修
- 不洗手，不洗菜 ~opposite
- 每天只喝一杯水 ~unsaid
?1 “每个人省下一点，加起来就是一条河”是什么意思？ | What does “together it makes a river” mean?
≈ 人人节约一点，合起来就很多 | 每个人省下一点，加起来就是一条河 | 节约用水，不需要做什么大事
- 省下的水要倒进河里 ~literal
- 河里的水是大家省下来的 ~literal
?2 “一个滴水的龙头，一个月就能浪费一千多升水”，用的是什么论证方法？ | What way of arguing is the dripping tap?
≈ 列数字，用数据说话 | 一个月就能浪费一千多升水 | 够一个人喝上一年多
% 作者没有只说“滴水浪费很多”，而是说出“一千多升”“一年多”这样确切的数字。用数据来证明观点，让人一看就明白浪费有多大，这种方法是列数字，用数据说话。 | The writer does not just say a dripping tap wastes much; the writer gives exact figures, “over a thousand litres”, “more than a year”. Proving a view with data, so the waste is plain at a glance, is giving figures: letting numbers speak.
- 比喻论证 ~nolikening
- 引用论证 ~sense
?2 第一段写淡水少、取水难，是为了证明什么？ | What does the first paragraph argue?
≈ 水很珍贵，必须节约 | 能直接用的淡水还不到百分之一 | 每天要走很远的路才能打到一桶水 | 所以，节约要从一滴水开始
- 应该多挖井 ~noproof
- 打水是一种锻炼 ~noproof
?2 第二段先写“有人觉得……没关系”，再用数字反驳，有什么作用？ | What does stating then answering “it doesn't matter” do?
≈ 驳倒错误看法，让观点更有力 | 有人觉得，家里的水龙头滴一点水没关系 | 可是一个滴水的龙头，一个月就能浪费一千多升水
% 第二段先摆出“滴一点水没关系”这个看法，再用“可是”一转，拿出一千多升的数字说明它不对。先立起错误的看法再用事实驳倒，作者的观点就更有力了。 | The second paragraph first sets out the view that a little dripping does not matter, then turns on “but” and gives the thousand litres that prove it wrong. Raising a wrong view and knocking it down with facts makes the writer's view the stronger.
- 说明滴水真的没关系 ~opposite
- 介绍水龙头怎样修 ~unsaid

# 兴趣是最好的老师
为什么有的同学学得又快又好？一个重要的原因，是他们有兴趣。
达尔文小时候喜欢收集昆虫和植物，常常在野外一待就是一整天。正是这份兴趣，让他后来走上了研究生物的道路。
兴趣能让人主动去学，不觉得累。被逼着学，学一个小时就觉得长；有兴趣地学，学三个小时也觉得短。
当然，兴趣也需要培养。一开始不喜欢的东西，多了解一点，也许就会喜欢上它。
?1 这篇短文的观点是什么？ | What view does the text argue?
= 兴趣是最好的老师 | 兴趣是最好的老师
- 达尔文喜欢收集昆虫 ~notview
- 学习要被逼着才行 ~opposite
?1 最后一段补充了什么？ | What does the last paragraph add?
= 兴趣需要培养 | 当然，兴趣也需要培养
- 不喜欢的就不要学 ~opposite
- 兴趣是天生的，改不了 ~opposite
?1 文章开头的问句有什么作用？ | What does the opening question do?
≈ 引起读者思考，引出观点 | 为什么有的同学学得又快又好 | 一个重要的原因，是他们有兴趣
% 文章一开头就提问，读者会跟着想“为什么”；第二句紧接着回答“是他们有兴趣”，引出了要讲的观点。所以开头的问句能引起读者思考，引出观点。 | The essay opens with a question, and readers start to ask why; the next sentence answers, “because they are interested”, bringing in the view. So the opening question sets readers thinking and leads in the view.
- 考考读者 ~sense
- 说明作者学得不好 ~unsaid
?2 达尔文的事例证明了什么？ | What does the Darwin example prove?
≈ 兴趣能引导人走向成功 | 正是这份兴趣，让他后来走上了研究生物的道路 | 达尔文小时候喜欢收集昆虫和植物
- 野外很好玩 ~noproof
- 昆虫很好收集 ~noproof
?2 “被逼着学……有兴趣地学……”，用的是什么论证方法？ | What way of arguing is forced versus willing study?
≈ 对比论证 | 有兴趣地学，学三个小时也觉得短 | 被逼着学，学一个小时就觉得长
% 这句话把“被逼着学”和“有兴趣地学”放在一起：一个小时觉得长，三个小时觉得短。把两种情况和结果摆在一起比，这种论证方法叫对比论证。 | The sentence sets learning under force beside learning with interest: one hour feels long, three hours feel short. Setting two cases and their results against each other is called argument by contrast.
- 比喻论证 ~nolikening
- 举例论证 ~noexample
?2 题目“兴趣是最好的老师”用了什么修辞？ | What figure is in the title?
≈ 比喻，把兴趣比作老师 | 兴趣能让人主动去学，不觉得累
% 兴趣不是人，题目却说它是“老师”：老师引着学生去学，兴趣也能“让人主动去学”。把兴趣说成老师，是拿一样东西比作另一样，用的是比喻。 | Interest is no person, yet the title calls it a “teacher”: a teacher leads pupils to learn, and interest too “makes us learn of our own accord”. Calling interest a teacher likens one thing to another: a metaphor.
- 夸张 ~sense
- 拟人 ~sense

# 诚信是金
古人说：“人无信不立。”一个人不讲诚信，就很难在社会上立足。
春秋时期，有个人叫季布，他答应别人的事，一定做到。人们说：“得黄金百斤，不如得季布一诺。”后来他遇到危难，很多人都愿意帮助他。
有的商店卖东西缺斤少两，开始时多赚了一点，可是顾客知道以后，再也不来了，最后只好关门。
诚信像金子一样宝贵。守住诚信，就守住了别人对我们的信任。
?1 这篇短文的观点是什么？ | What view does the text argue?
≈ 做人要讲诚信 | 一个人不讲诚信，就很难在社会上立足 | 守住诚信，就守住了别人对我们的信任 | 人无信不立
- 黄金比诺言更宝贵 ~opposite
- 季布是春秋时期的人 ~notview
?1 “得黄金百斤，不如得季布一诺”是什么意思？ | What does the saying about Ji Bu mean?
≈ 季布的一句承诺比百斤黄金还宝贵 | 得黄金百斤，不如得季布一诺 | 他答应别人的事，一定做到
% “不如”是“比不上”。得到一百斤黄金，还比不上得到季布的一句答应；因为季布“答应别人的事，一定做到”，他的承诺比黄金还宝贵。 | “Is not as good as” means falls short of. A hundred jin of gold falls short of one promise from Ji Bu, because whatever he promised he did: his word was worth more than gold.
- 季布有很多黄金 ~literal
- 季布不讲信用 ~opposite
?1 文章结尾把诚信比作什么？ | What is honesty likened to at the end?
= 金子 | 诚信像金子一样宝贵
- 大山 ~unsaid
- 大海 ~unsaid
?2 季布的事例和商店的事例，分别从哪两方面证明观点？ | From which two sides do the two examples argue?
≈ 一个讲诚信得到帮助，一个不讲诚信关了门 | 后来他遇到危难，很多人都愿意帮助他 | 最后只好关门
% 季布讲诚信，遇到危难时很多人帮他；商店缺斤少两，顾客不再来，只好关门。一个从讲诚信的好处说，一个从不讲诚信的害处说，正反两方面证明观点。 | Ji Bu kept his word, and many helped him in trouble; the shop gave short weight, lost its customers and closed. One shows the gain of honesty, the other the loss of dishonesty: the view is proved from both sides.
- 两个都说明做生意很难 ~noproof
- 两个都说明黄金很贵 ~noproof
?2 开头引用“人无信不立”，有什么作用？ | What does the opening saying do?
≈ 用名言引出观点 | 人无信不立 | 一个人不讲诚信，就很难在社会上立足
% 文章第一句是古人的话“人无信不立”，第二句紧接着用自己的话把它讲明白，这就是文章的观点。用名言开头，既有分量，又引出了观点。 | The first sentence is an old saying, “without trust one cannot stand”; the next explains it in the writer's words, and that is the essay's view. Opening with a famous saying gives weight and brings in the view.
- 说明人站不起来 ~literal
- 介绍一个人的名字 ~sense
?2 商店缺斤少两的事例证明了什么？ | What does the cheating shop prove?
≈ 不讲诚信，最终会失去别人的信任 | 顾客知道以后，再也不来了 | 最后只好关门 | 守住诚信，就守住了别人对我们的信任
- 卖东西能多赚钱 ~noproof
- 顾客都很小气 ~noproof

# 多走出去看看
有人说，读万卷书，不如行万里路。我认为，书要读，路也要走。
书上写的长城，是一张照片、几行文字；站在长城上，才能感受到它的雄伟和古人修建它的艰辛。书上写的大海，是一片蓝色；站在海边，才能听见海浪的声音，闻到海风的咸味。
走出去，还能认识不同的人，学到书上没有的东西。徐霞客一生走遍了大半个中国，写成了著名的《徐霞客游记》。
当然，走路也离不开读书。读过书再出门，看到的东西会更多。
?1 这篇短文的观点是什么？ | What view does the text argue?
= 书要读，路也要走 | 我认为，书要读，路也要走
- 读书不如走路 ~opposite
- 长城很雄伟 ~notview
?1 最后一段说明了什么？ | What does the last paragraph show?
= 走路也离不开读书 | 当然，走路也离不开读书 | 读过书再出门，看到的东西会更多
- 不用读书，只要走路 ~opposite
- 出门一定要带书 ~literal
?1 作者认为“走出去”还有什么好处？ | What else is good in going out, the writer says?
= 认识不同的人，学到书上没有的东西 | 走出去，还能认识不同的人，学到书上没有的东西
- 能买到便宜的东西 ~unsaid
- 能少读很多书 ~opposite
?2 第二段把书上的长城、大海和亲眼看到的放在一起写，用的是什么论证方法？ | What way of arguing sets the book's Great Wall beside the real?
≈ 对比论证 | 站在长城上，才能感受到它的雄伟 | 书上写的长城，是一张照片、几行文字
% 第二段把书上的长城（“一张照片、几行文字”）和站在长城上的感受放在一起，大海也这样写。把两种情况摆在一起比，看出亲眼看到的更多，这种论证方法叫对比论证。 | The second paragraph sets the Great Wall in books, “a photo and a few lines”, beside standing on it, and the sea likewise. Setting the two cases against each other to show that seeing for oneself gives more is argument by contrast.
- 比喻论证 ~nolikening
- 引用论证 ~sense
?2 徐霞客的事例证明了什么？ | What does Xu Xiake prove?
≈ 走出去能学到很多，取得成就 | 写成了著名的《徐霞客游记》 | 徐霞客一生走遍了大半个中国
- 徐霞客不爱读书 ~noproof
- 旅行很危险 ~noproof
?2 开头引用“读万卷书，不如行万里路”，作者的态度是什么？ | What is the writer's stance on the saying?
≈ 不完全同意，认为读书和走路都重要 | 我认为，书要读，路也要走 | 有人说，读万卷书，不如行万里路
% 开头引用的话说读书“不如”走路，作者接着却说“书要读，路也要走”，没有跟着说读书不如走路，结尾还说“走路也离不开读书”。可见作者不完全同意这句话，认为两样都重要。 | The opening saying puts reading below travel; the writer replies, “books must be read and roads walked”, not following the saying, and ends that walking needs reading too. So the writer does not fully agree, holding both to matter.
- 完全同意 ~opposite
- 完全反对，认为只要读书 ~opposite
`;

/** POEMS_6 are the classical poems of reading-6-poems, in the public domain: their rhythm and rhyme, and their feeling. */
export const POEMS_6 = `
# 过故人庄（唐·孟浩然）
故人具鸡黍，邀我至田家。
绿树村边合，青山郭外斜。
开轩面场圃，把酒话桑麻。
待到重阳日，还来就菊花。
注：具，准备。鸡黍，指农家的饭菜。郭，城墙外。轩，窗户。斜，古音读 xiá，和家、麻、花押韵。
?1 “绿树村边合”应该怎样停顿？ | How is the line paused?
≈ 绿树/村边合 | 绿树村边合
% 这首诗每句五个字，是五言诗。五言诗一般前两个字一顿，后三个字一顿，意思也正好在这里分开。“绿树村边合”这样读，就是“绿树/村边合”。 | Each line has five characters: a five-character poem. Such lines are usually read 2 + 3, pausing after the first two characters, where the sense also breaks. Read so, the line is “绿树/村边合”.
- 绿/树村/边合 ~pause
- 绿树村/边合 ~pause
?1 这首诗押的是哪个韵？下面哪组字是韵脚？ | Which characters rhyme?
= 家、斜、麻、花 | 斜，古音读 xiá，和家、麻、花押韵
- 黍、合、圃、日 ~notend
- 我、树、酒、来 ~notend
?1 这首诗每句有几个字，一共几句？ | How many characters a line, and how many lines?
≈ 每句五个字，一共八句 | 故人具鸡黍，邀我至田家 | 还来就菊花
% 数一数：每一句都是五个字，比如“故人具鸡黍”；从“故人具鸡黍”数到“还来就菊花”，一共八句。 | Count: each line has five characters, such as “gu ren ju ji shu”; from the first line to “huan lai jiu ju hua” there are eight lines.
- 每句七个字，一共四句 ~figure
- 每句五个字，一共四句 ~figure
?2 这首诗表达了诗人怎样的心情？ | What feeling does the poem express?
≈ 在农家做客的愉快和对田园生活的喜爱 | 还来就菊花 | 把酒话桑麻 | 绿树村边合，青山郭外斜
% 诗人写农家的绿树青山，写和朋友开窗喝酒、谈论农事，最后还约好重阳节再来。景色写得美，做客写得亲切，还想再来，可见他在农家做客很愉快，也喜爱这样的田园生活。 | The poet paints the green trees and hills of the farm, opening the window to drink and talk of crops with his friend, and ends by promising to come again at the Double Ninth. Fair scenes, warm company, and a wish to return: he enjoys the visit and loves this country life.
- 对农村生活的厌烦 ~nomood
- 离别朋友的伤心 ~nomood
?2 “待到重阳日，还来就菊花”说明了什么？ | What does the last couplet show?
= 诗人和朋友约好，重阳节还要再来 | 待到重阳日，还来就菊花
- 诗人要搬到农村住 ~unsaid
- 诗人不想再来了 ~opposite
?2 “把酒话桑麻”写出了诗人和朋友怎样？ | What does “talking of mulberry and hemp over wine” show?
= 一边喝酒一边亲切地谈论农事 | 把酒话桑麻 | 开轩面场圃
- 在争论桑树和麻哪个好 ~mismatch
- 在买卖桑麻 ~unsaid

# 逢雪宿芙蓉山主人（唐·刘长卿）
日暮苍山远，天寒白屋贫。
柴门闻犬吠，风雪夜归人。
注：白屋，简陋的茅屋。吠，狗叫。
?1 “柴门闻犬吠”应该怎样停顿？ | How is the line paused?
≈ 柴门/闻犬吠 | 柴门闻犬吠
% 这首诗每句五个字，是五言诗。五言诗一般前两个字一顿，后三个字一顿，意思也正好在这里分开。“柴门闻犬吠”这样读，就是“柴门/闻犬吠”。 | Each line has five characters: a five-character poem. Such lines are usually read 2 + 3, pausing after the first two characters, where the sense also breaks. Read so, the line is “柴门/闻犬吠”.
- 柴/门闻/犬吠 ~pause
- 柴门闻/犬/吠 ~pause
?1 这首诗的韵脚是哪两个字？ | Which two characters rhyme?
≈ 贫、人 | 天寒白屋贫 | 风雪夜归人
% 韵脚是押韵的句子末尾的字。把“天寒白屋贫”“风雪夜归人”这几句末尾的字连起来读：贫、人，它们的韵相同或相近，读起来和谐，所以韵脚就是这几个字。 | Rhyme words are the characters that end the rhyming lines. Read the last characters of these lines together, 贫、人: they share a rhyme or near rhyme and sound in harmony, so they are the rhyme words.
- 远、吠 ~notend
- 山、门 ~notend
?1 这首诗是几言诗？ | How many characters a line?
≈ 五言 | 日暮苍山远 | 柴门闻犬吠
% 数一数：“日暮苍山远”是五个字，“柴门闻犬吠”也是五个字，每句都是五个字，所以是五言诗。 | Count: “ri mu cang shan yuan” is five characters, and so is “chai men wen quan fei”; every line has five, so it is a five-character poem.
- 七言 ~figure
- 四言 ~figure
?2 “天寒白屋贫”写出了怎样的环境？ | What setting does the second line paint?
≈ 天气寒冷，茅屋简陋 | 天寒白屋贫 | 白屋，简陋的茅屋
- 屋子刷成了白色，很漂亮 ~literal
- 天气很暖和 ~opposite
?2 “风雪夜归人”给人怎样的感受？ | What does the last line leave?
≈ 在风雪的寒夜里，有人回家，透出一丝温暖 | 风雪夜归人 | 柴门闻犬吠 | 日暮苍山远，天寒白屋贫
% 前面写天黑、山远、天寒、屋贫，一片冷清；最后听见狗叫，原来是有人冒着风雪夜里回家了。冷清的风雪夜里有人回到家，就透出了一丝温暖。 | First come dusk, far hills, cold and a poor hut, all bleak; then a dog barks, and someone is coming home through the snow at night. Someone coming home on a cold snowy night lets in a touch of warmth.
- 夜里很热闹 ~opposite
- 诗人很害怕 ~nomood
?2 全诗写的是什么时候的事？ | When is the poem set?
≈ 下雪天的傍晚到夜里 | 日暮苍山远 | 风雪夜归人
% “日暮”是太阳落山的傍晚，“风雪夜归人”写到了夜里，又是风雪天。所以全诗写的是下雪天从傍晚到夜里的事。 | “Ri mu” is dusk as the sun sets; “feng xue ye gui ren” has reached night, in wind and snow. So the poem tells of a snowy day from dusk into night.
- 春天的早上 ~changed
- 夏天的中午 ~changed

# 秋夕（唐·杜牧）
银烛秋光冷画屏，轻罗小扇扑流萤。
天阶夜色凉如水，卧看牵牛织女星。
注：画屏，画着图画的屏风。流萤，飞着的萤火虫。天阶，宫中的石阶。
?1 “轻罗小扇扑流萤”应该怎样停顿？ | How is the line paused?
≈ 轻罗小扇/扑流萤 | 轻罗小扇扑流萤
% 这首诗每句七个字，是七言诗。七言诗一般前四个字一顿，后三个字一顿，意思也正好在这里分开。“轻罗小扇扑流萤”这样读，就是“轻罗小扇/扑流萤”。 | Each line has seven characters: a seven-character poem. Such lines are usually read 4 + 3, pausing after the first four characters, where the sense also breaks. Read so, the line is “轻罗小扇/扑流萤”.
- 轻/罗小/扇扑流萤 ~pause
- 轻罗小扇扑/流/萤 ~pause
?1 这首诗的韵脚是哪几个字？ | Which characters rhyme?
≈ 屏、萤、星 | 银烛秋光冷画屏 | 轻罗小扇扑流萤 | 卧看牵牛织女星
% 韵脚是押韵的句子末尾的字。把“银烛秋光冷画屏”“轻罗小扇扑流萤”“卧看牵牛织女星”这几句末尾的字连起来读：屏、萤、星，它们的韵相同或相近，读起来和谐，所以韵脚就是这几个字。 | Rhyme words are the characters that end the rhyming lines. Read the last characters of these lines together, 屏、萤、星: they share a rhyme or near rhyme and sound in harmony, so they are the rhyme words.
- 烛、扇、色 ~notend
- 秋、水、牛 ~notend
?1 这首诗是几言诗？ | How many characters a line?
≈ 七言 | 银烛秋光冷画屏 | 天阶夜色凉如水
% 数一数：“银烛秋光冷画屏”是七个字，“天阶夜色凉如水”也是七个字，每句都是七个字，所以是七言诗。 | Count: the first line has seven characters, and so does “tian jie ye se liang ru shui”; every line has seven, so it is a seven-character poem.
- 五言 ~figure
- 六言 ~figure
?2 “天阶夜色凉如水”写出了怎样的夜晚？ | What night does the third line paint?
≈ 夜深了，凉意浓，很冷清 | 天阶夜色凉如水 | 银烛秋光冷画屏
- 下了一场大雨 ~literal
- 夜晚很热闹 ~opposite
?2 诗中的人“卧看牵牛织女星”，透露出怎样的心情？ | What feeling is in gazing at the Herd Boy and Weaver stars?
≈ 孤单寂寞，盼望有人相伴 | 卧看牵牛织女星 | 轻罗小扇扑流萤 | 天阶夜色凉如水
% 牵牛星和织女星是传说中一年只能见一次面的一对。诗中的人一个人在冷清的夜里扑萤火虫，又躺着望这两颗星，透出她孤单寂寞，盼望有人相伴。 | The Herdboy and Weaver stars are the lovers of legend who meet once a year. Alone on a cold night, chasing fireflies, then lying to gaze at these two stars, she shows her loneliness and her longing for company.
- 很想学习天文 ~unsaid
- 非常快乐 ~nomood
?2 “扑流萤”这个动作，写出了什么？ | What does swatting at fireflies show?
≈ 用扑萤来打发孤单的时光 | 轻罗小扇扑流萤 | 卧看牵牛织女星 | 天阶夜色凉如水
- 萤火虫太多，很讨厌 ~unsaid
- 天气太热，在扇风 ~literal

# 雨晴（唐·王驾）
雨前初见花间蕊，雨后全无叶底花。
蜂蝶纷纷过墙去，却疑春色在邻家。
注：蕊，花蕊。疑，怀疑。
?1 “雨后全无叶底花”应该怎样停顿？ | How is the line paused?
≈ 雨后全无/叶底花 | 雨后全无叶底花
% 这首诗每句七个字，是七言诗。七言诗一般前四个字一顿，后三个字一顿，意思也正好在这里分开。“雨后全无叶底花”这样读，就是“雨后全无/叶底花”。 | Each line has seven characters: a seven-character poem. Such lines are usually read 4 + 3, pausing after the first four characters, where the sense also breaks. Read so, the line is “雨后全无/叶底花”.
- 雨/后全/无叶底花 ~pause
- 雨后全无叶/底/花 ~pause
?1 这首诗的韵脚是哪两个字？ | Which two characters rhyme?
≈ 花、家 | 雨后全无叶底花 | 却疑春色在邻家
% 韵脚是押韵的句子末尾的字。把“雨后全无叶底花”“却疑春色在邻家”这几句末尾的字连起来读：花、家，它们的韵相同或相近，读起来和谐，所以韵脚就是这几个字。 | Rhyme words are the characters that end the rhyming lines. Read the last characters of these lines together, 花、家: they share a rhyme or near rhyme and sound in harmony, so they are the rhyme words.
- 蕊、去 ~notend
- 前、后 ~notend
?1 这首诗一共有几句？ | How many lines?
≈ 四句 | 雨前初见花间蕊，雨后全无叶底花 | 蜂蝶纷纷过墙去，却疑春色在邻家
% 数一数：“雨前初见花间蕊”“雨后全无叶底花”“蜂蝶纷纷过墙去”“却疑春色在邻家”，一共四句。 | Count: the poem has four lines, two in each couplet.
- 八句 ~figure
- 两句 ~figure
?2 “雨后全无叶底花”写出了什么变化？ | What change does the second line show?
≈ 一场雨把花都打落了 | 雨后全无叶底花 | 雨前初见花间蕊
- 雨后花开得更多了 ~opposite
- 叶子都掉光了 ~unsaid
?2 “却疑春色在邻家”表现了诗人怎样的心情？ | What feeling is in “perhaps spring is next door”?
≈ 惜春，又带着一点风趣 | 却疑春色在邻家 | 雨后全无叶底花 | 蜂蝶纷纷过墙去
% 雨后花都没了，诗人心里可惜春天走了，这是惜春；他看见蜂蝶飞过墙，竟怀疑春色跑到邻居家去了，这个想法很有趣。所以诗里有惜春，也带着一点风趣。 | After the rain the flowers are gone and the poet is sorry spring has left; seeing bees and butterflies fly over the wall, he fancies spring has moved next door, a playful thought. So there is regret for spring, with a touch of humour.
- 生邻居的气 ~nomood
- 对春天毫不在意 ~nomood
?2 诗人从“蜂蝶纷纷过墙去”想到了什么？ | What does the poet guess from the bees going over the wall?
≈ 春色跑到邻居家去了 | 蜂蝶纷纷过墙去，却疑春色在邻家 | 雨后全无叶底花
- 邻居家养了很多蜜蜂 ~literal
- 蜂蝶要搬家了 ~literal

# 塞下曲（唐·卢纶）
月黑雁飞高，单于夜遁逃。
欲将轻骑逐，大雪满弓刀。
注：单于（chán yú），敌人的首领。遁逃，逃走。轻骑，轻装快速的骑兵。逐，追赶。
?1 “大雪满弓刀”应该怎样停顿？ | How is the line paused?
≈ 大雪/满弓刀 | 大雪满弓刀
% 这首诗每句五个字，是五言诗。五言诗一般前两个字一顿，后三个字一顿，意思也正好在这里分开。“大雪满弓刀”这样读，就是“大雪/满弓刀”。 | Each line has five characters: a five-character poem. Such lines are usually read 2 + 3, pausing after the first two characters, where the sense also breaks. Read so, the line is “大雪/满弓刀”.
- 大/雪满/弓刀 ~pause
- 大雪满/弓/刀 ~pause
?1 这首诗的韵脚是哪几个字？ | Which characters rhyme?
≈ 高、逃、刀 | 月黑雁飞高 | 单于夜遁逃 | 大雪满弓刀
% 韵脚是押韵的句子末尾的字。把“月黑雁飞高”“单于夜遁逃”“大雪满弓刀”这几句末尾的字连起来读：高、逃、刀，它们的韵相同或相近，读起来和谐，所以韵脚就是这几个字。 | Rhyme words are the characters that end the rhyming lines. Read the last characters of these lines together, 高、逃、刀: they share a rhyme or near rhyme and sound in harmony, so they are the rhyme words.
- 黑、骑、雪 ~notend
- 月、于、将 ~notend
?1 敌人是在什么时候逃走的？ | When does the enemy flee?
= 在没有月亮的黑夜里 | 单于夜遁逃 | 月黑雁飞高
- 在大雪纷飞的白天 ~opposite
- 在大雁南飞的清晨 ~unsaid
?2 “月黑雁飞高，单于夜遁逃”写出了什么？ | What do the first two lines show?
≈ 敌人趁着黑夜悄悄逃走 | 单于夜遁逃 | 月黑雁飞高 | 遁逃，逃走
- 雁群在夜里飞向南方 ~part
- 将士们在夜里睡觉 ~unsaid
?2 “欲将轻骑逐，大雪满弓刀”表现了将士们怎样的精神？ | What spirit is in the last two lines?
≈ 不怕严寒，英勇追敌 | 欲将轻骑逐，大雪满弓刀 | 逐，追赶
% 将士们要带着轻骑兵去追赶逃走的敌人，这时大雪落满了弓和刀。天这样冷，他们还是要追，可见他们不怕严寒，英勇追敌。 | The soldiers are about to lead light horsemen after the fleeing foe as snow covers their bows and blades. In such cold they still pursue: they defy the cold and chase the enemy bravely.
- 怕冷不敢出发 ~opposite
- 想回家过年 ~nomood
?2 “大雪满弓刀”这个画面给人什么感受？ | What does the snow-covered weapons leave?
≈ 环境极其艰苦，更显出将士的豪迈 | 大雪满弓刀 | 欲将轻骑逐
- 弓刀生锈了 ~unsaid
- 雪景很美，令人陶醉 ~nomood

# 秋夜寄邱员外（唐·韦应物）
怀君属秋夜，散步咏凉天。
空山松子落，幽人应未眠。
注：君，你，指邱员外。属，正当。幽人，隐居的人，指邱员外。
?1 “空山松子落”应该怎样停顿？ | How is the line paused?
≈ 空山/松子落 | 空山松子落
% 这首诗每句五个字，是五言诗。五言诗一般前两个字一顿，后三个字一顿，意思也正好在这里分开。“空山松子落”这样读，就是“空山/松子落”。 | Each line has five characters: a five-character poem. Such lines are usually read 2 + 3, pausing after the first two characters, where the sense also breaks. Read so, the line is “空山/松子落”.
- 空/山松/子落 ~pause
- 空山松/子/落 ~pause
?1 这首诗的韵脚是哪两个字？ | Which two characters rhyme?
≈ 天、眠 | 散步咏凉天 | 幽人应未眠
% 韵脚是押韵的句子末尾的字。把“散步咏凉天”“幽人应未眠”这几句末尾的字连起来读：天、眠，它们的韵相同或相近，读起来和谐，所以韵脚就是这几个字。 | Rhyme words are the characters that end the rhyming lines. Read the last characters of these lines together, 天、眠: they share a rhyme or near rhyme and sound in harmony, so they are the rhyme words.
- 夜、落 ~notend
- 君、山 ~notend
?1 这首诗是几言诗？ | How many characters a line?
≈ 五言 | 怀君属秋夜 | 空山松子落
% 数一数：“怀君属秋夜”是五个字，“空山松子落”也是五个字，每句都是五个字，所以是五言诗。 | Count: “huai jun shu qiu ye” has five characters, and so does “kong shan song zi luo”; every line has five, so it is a five-character poem.
- 七言 ~figure
- 四言 ~figure
?2 这首诗表达了诗人怎样的感情？ | What feeling does the poem express?
≈ 对远方朋友的思念 | 怀君属秋夜 | 幽人应未眠 | 君，你，指邱员外
- 对秋天的厌恶 ~nomood
- 对朋友的不满 ~nomood
?2 “幽人应未眠”是诗人怎样想的？ | What does the poet imagine in the last line?
≈ 想象朋友这时也还没有睡，也在想念自己 | 幽人应未眠 | 怀君属秋夜
% “应”是“应该、大概”，是诗人的猜想，不是他看见的。诗人自己在秋夜里想念朋友，就猜想朋友这时大概也没睡，也在想念自己。 | “Ying” means “surely, probably”: a guess, not something the poet sees. Thinking of his friend on the autumn night, he guesses his friend too is awake and thinking of him.
- 朋友真的告诉他没睡 ~unsaid
- 诗人自己睡着了 ~opposite
?2 “空山松子落”写出了怎样的环境？ | What setting does the third line paint?
≈ 山里非常安静，连松子落下都听得见 | 空山松子落 | 幽人应未眠
% 松子很小，落下来声音很轻，诗人却听见了。连这么轻的声音都听得见，说明山里非常安静。 | Pine seeds are tiny and fall softly, yet the poet hears them. When so slight a sound can be heard, the hills must be very quiet.
- 山里正在刮大风 ~unsaid
- 有人在山里摘松子 ~unsaid

# 夜雪（唐·白居易）
已讶衾枕冷，复见窗户明。
夜深知雪重，时闻折竹声。
注：讶，惊讶。衾（qīn），被子。时闻，不时听到。
?1 “时闻折竹声”应该怎样停顿？ | How is the line paused?
≈ 时闻/折竹声 | 时闻折竹声
% 这首诗每句五个字，是五言诗。五言诗一般前两个字一顿，后三个字一顿，意思也正好在这里分开。“时闻折竹声”这样读，就是“时闻/折竹声”。 | Each line has five characters: a five-character poem. Such lines are usually read 2 + 3, pausing after the first two characters, where the sense also breaks. Read so, the line is “时闻/折竹声”.
- 时/闻折/竹声 ~pause
- 时闻折/竹/声 ~pause
?1 这首诗的韵脚是哪两个字？ | Which two characters rhyme?
≈ 明、声 | 复见窗户明 | 时闻折竹声
% 韵脚是押韵的句子末尾的字。把“复见窗户明”“时闻折竹声”这几句末尾的字连起来读：明、声，它们的韵相同或相近，读起来和谐，所以韵脚就是这几个字。 | Rhyme words are the characters that end the rhyming lines. Read the last characters of these lines together, 明、声: they share a rhyme or near rhyme and sound in harmony, so they are the rhyme words.
- 冷、重 ~notend
- 讶、见 ~notend
?1 这首诗一共有几句？ | How many lines?
≈ 四句 | 已讶衾枕冷，复见窗户明 | 夜深知雪重，时闻折竹声
% 数一数：“已讶衾枕冷”“复见窗户明”“夜深知雪重”“时闻折竹声”，一共四句。 | Count: the poem has four lines, two in each couplet.
- 八句 ~figure
- 两句 ~figure
?2 诗人是从哪些方面知道下雪了？ | How does the poet know it snowed?
= 被子冷、窗户亮、听到竹子被压断 | 已讶衾枕冷，复见窗户明 | 时闻折竹声
- 亲眼看到漫天大雪 ~unsaid
- 家人告诉他的 ~unsaid
?2 “时闻折竹声”说明了什么？ | What does the snapping bamboo show?
≈ 雪下得很大很厚 | 夜深知雪重 | 时闻折竹声
% 竹子很结实，却被压断了，发出“折竹声”。诗人从这声音知道“雪重”：雪积得又厚又沉，才能把竹子压断，所以雪下得很大很厚。 | Bamboo is tough, yet it snaps with a crack. From the sound the poet knows the snow is heavy: only thick, heavy snow could break bamboo, so the snowfall is great.
- 有人在砍竹子 ~unsaid
- 风很大 ~unsaid
?2 这首诗写雪，好在哪里？ | What is fine in how the poem writes snow?
≈ 不直接写雪，而从感觉和声音写出雪 | 已讶衾枕冷 | 复见窗户明 | 时闻折竹声
% 全诗没有一句写雪的样子：被子冷是感觉，窗户亮是看见的光，折竹声是听到的声音，诗人却从这些写出了夜里下了大雪。不直接写雪，而从感觉和声音写出雪，这就是它的好处。 | No line describes the snow itself: the cold quilt is felt, the bright window is seen, the snapping bamboo is heard, and from these the poet shows a heavy night snow. Showing the snow through feeling and sound, not directly, is the poem's strength.
- 写出了雪的颜色和形状 ~unsaid
- 写出了孩子们玩雪的快乐 ~never

# 江南逢李龟年（唐·杜甫）
岐王宅里寻常见，崔九堂前几度闻。
正是江南好风景，落花时节又逢君。
注：李龟年，唐朝有名的乐师。岐王、崔九，当时的达官贵人。君，你，指李龟年。
?1 “落花时节又逢君”应该怎样停顿？ | How is the line paused?
≈ 落花时节/又逢君 | 落花时节又逢君
% 这首诗每句七个字，是七言诗。七言诗一般前四个字一顿，后三个字一顿，意思也正好在这里分开。“落花时节又逢君”这样读，就是“落花时节/又逢君”。 | Each line has seven characters: a seven-character poem. Such lines are usually read 4 + 3, pausing after the first four characters, where the sense also breaks. Read so, the line is “落花时节/又逢君”.
- 落/花时/节又逢君 ~pause
- 落花时节又/逢/君 ~pause
?1 这首诗的韵脚是哪两个字？ | Which two characters rhyme?
≈ 闻、君 | 崔九堂前几度闻 | 落花时节又逢君
% 韵脚是押韵的句子末尾的字。把“崔九堂前几度闻”“落花时节又逢君”这几句末尾的字连起来读：闻、君，它们的韵相同或相近，读起来和谐，所以韵脚就是这几个字。 | Rhyme words are the characters that end the rhyming lines. Read the last characters of these lines together, 闻、君: they share a rhyme or near rhyme and sound in harmony, so they are the rhyme words.
- 见、景 ~notend
- 里、前 ~notend
?1 这首诗是几言诗？ | How many characters a line?
≈ 七言 | 岐王宅里寻常见 | 正是江南好风景
% 数一数：“岐王宅里寻常见”是七个字，“正是江南好风景”也是七个字，每句都是七个字，所以是七言诗。 | Count: the first line has seven characters, and so does “zheng shi jiang nan hao feng jing”; every line has seven, so it is a seven-character poem.
- 五言 ~figure
- 四言 ~figure
?2 诗人和李龟年过去在哪里常常见面？ | Where did they meet in the past?
= 岐王宅里、崔九堂前 | 岐王宅里寻常见，崔九堂前几度闻
- 江南的花园里 ~unsaid
- 战场上 ~never
?2 “落花时节又逢君”中的“落花”，除了写季节，还暗含着什么？ | What more do the falling flowers suggest?
≈ 时代和人生的衰落，令人感伤 | 落花时节又逢君 | 岐王宅里寻常见，崔九堂前几度闻
% 当年诗人和李龟年在达官贵人家里常常相见，那是繁华的时候；如今在江南重逢，正是花落的时节。花落是春天将尽，也像那繁华的年代和两人的好时光都过去了，令人感伤。 | Long ago the poet often met Li Guinian in the houses of the great, in a time of splendour; now they meet again in Jiangnan as the flowers fall. Falling flowers end the spring, as the splendid years and their good days have passed: a sad thought.
- 江南的花特别多 ~literal
- 他们相见很开心，没有别的 ~nomood
?2 这首诗表达了诗人怎样的感情？ | What feeling does the poem express?
≈ 今昔对比的感慨 | 岐王宅里寻常见，崔九堂前几度闻 | 正是江南好风景，落花时节又逢君
% 前两句写当年在王公贵人家常常相见，后两句写如今在落花时节的江南重逢。把过去和现在放在一起，人还是那两个人，时代却变了，诗里是今昔对比的感慨。 | The first lines recall frequent meetings in great houses long ago; the last tell of meeting again in Jiangnan as flowers fall. Setting then beside now, the same two men in a changed age, the poem voices a sigh at past and present.
- 对江南风景的赞美 ~part
- 对李龟年的埋怨 ~nomood

# 菊花（唐·元稹）
秋丛绕舍似陶家，遍绕篱边日渐斜。
不是花中偏爱菊，此花开尽更无花。
注：陶家，指东晋诗人陶渊明家，他最爱菊花。斜，古音读 xiá，和家、花押韵。
?1 “此花开尽更无花”应该怎样停顿？ | How is the line paused?
≈ 此花开尽/更无花 | 此花开尽更无花
% 这首诗每句七个字，是七言诗。七言诗一般前四个字一顿，后三个字一顿，意思也正好在这里分开。“此花开尽更无花”这样读，就是“此花开尽/更无花”。 | Each line has seven characters: a seven-character poem. Such lines are usually read 4 + 3, pausing after the first four characters, where the sense also breaks. Read so, the line is “此花开尽/更无花”.
- 此/花开/尽更无花 ~pause
- 此花开尽更/无/花 ~pause
?1 这首诗的韵脚是哪几个字？ | Which characters rhyme?
= 家、斜、花 | 斜，古音读 xiá，和家、花押韵
- 丛、绕、菊 ~notend
- 秋、篱、尽 ~notend
?1 这首诗一共有几句？ | How many lines?
≈ 四句 | 秋丛绕舍似陶家，遍绕篱边日渐斜 | 不是花中偏爱菊，此花开尽更无花
% 数一数：“秋丛绕舍似陶家”“遍绕篱边日渐斜”“不是花中偏爱菊”“此花开尽更无花”，一共四句。 | Count: the poem has four lines, two in each couplet.
- 八句 ~figure
- 六句 ~figure
?2 诗人为什么喜爱菊花？ | Why does the poet love the chrysanthemum?
= 它开到最后，开完就再没有花了 | 此花开尽更无花 | 不是花中偏爱菊
- 它的颜色最鲜艳 ~unsaid
- 它的香味最浓 ~unsaid
?2 “遍绕篱边日渐斜”写出了诗人怎样？ | What does the second line show of the poet?
≈ 绕着篱笆赏菊，一直看到太阳西斜，十分入迷 | 遍绕篱边日渐斜 | 秋丛绕舍似陶家
- 在篱笆边迷了路 ~literal
- 在修篱笆 ~unsaid
?2 诗中写到陶家，有什么用意？ | Why bring in Tao's house?
≈ 借爱菊的陶渊明，表达自己对菊花的喜爱 | 他最爱菊花 | 秋丛绕舍似陶家 | 不是花中偏爱菊
- 说明诗人住在陶渊明家 ~literal
- 介绍陶渊明的家人 ~unsaid

# 送友人（唐·李白）
青山横北郭，白水绕东城。
此地一为别，孤蓬万里征。
浮云游子意，落日故人情。
挥手自兹去，萧萧班马鸣。
注：郭，城外。孤蓬，像随风飘的蓬草一样孤单的人。兹，这里。班马，离群的马。
?1 “挥手自兹去”应该怎样停顿？ | How is the line paused?
≈ 挥手/自兹去 | 挥手自兹去
% 这首诗每句五个字，是五言诗。五言诗一般前两个字一顿，后三个字一顿，意思也正好在这里分开。“挥手自兹去”这样读，就是“挥手/自兹去”。 | Each line has five characters: a five-character poem. Such lines are usually read 2 + 3, pausing after the first two characters, where the sense also breaks. Read so, the line is “挥手/自兹去”.
- 挥/手自/兹去 ~pause
- 挥手自/兹/去 ~pause
?1 这首诗的韵脚是哪几个字？ | Which characters rhyme?
≈ 城、征、情、鸣 | 白水绕东城 | 孤蓬万里征 | 落日故人情 | 萧萧班马鸣
% 韵脚是押韵的句子末尾的字。把“白水绕东城”“孤蓬万里征”“落日故人情”“萧萧班马鸣”这几句末尾的字连起来读：城、征、情、鸣，它们的韵相同或相近，读起来和谐，所以韵脚就是这几个字。 | Rhyme words are the characters that end the rhyming lines. Read the last characters of these lines together, 城、征、情、鸣: they share a rhyme or near rhyme and sound in harmony, so they are the rhyme words.
- 郭、别、意、去 ~notend
- 山、水、云、手 ~notend
?1 这首诗每句几个字，一共几句？ | How many characters a line, and how many lines?
≈ 每句五个字，一共八句 | 青山横北郭 | 萧萧班马鸣
% 数一数：每一句都是五个字，比如“青山横北郭”；从“青山横北郭”数到“萧萧班马鸣”，一共八句。 | Count: each line has five characters, such as “qing shan heng bei guo”; from the first line to “xiao xiao ban ma ming” there are eight lines.
- 每句七个字，一共八句 ~figure
- 每句五个字，一共四句 ~figure
?2 “浮云游子意，落日故人情”表达了什么？ | What does the third couplet express?
≈ 朋友像浮云一样漂泊，诗人像落日一样依依不舍 | 浮云游子意，落日故人情 | 孤蓬万里征
% 浮云飘来飘去，没有定处，就像要远行万里的朋友；落日慢慢下山，迟迟不肯落，就像送别的诗人不舍得朋友走。诗人借这两样景物写出两人的心情。 | Drifting clouds have no fixed place, like the friend off on a long journey; the setting sun sinks slowly, loath to go, like the poet loath to let him leave. Through these two sights the poet shows both their feelings.
- 天上有浮云和落日，风景很美 ~part
- 诗人不想再见到朋友 ~opposite
?2 “萧萧班马鸣”中，连马都在叫，表达了什么？ | What do the neighing horses express?
≈ 借马的叫声写出离别的不舍 | 萧萧班马鸣 | 挥手自兹去 | 班马，离群的马
- 马饿了 ~literal
- 马不想走路 ~literal
?2 全诗表达了怎样的感情？ | What feeling does the whole poem express?
≈ 送别朋友的依依惜别之情 | 此地一为别 | 挥手自兹去 | 落日故人情
- 送别朋友的轻松愉快 ~nomood
- 对朋友远行的羡慕 ~nomood
`;
