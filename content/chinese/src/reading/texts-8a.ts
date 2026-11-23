// The texts of the grade 8 reading topics of exposition and science writing (docs/chinese-curriculum.md §18.9), written
// for this subject. The format is that of parsePieces in topic-kit.ts: a question's wrong options carry the reason they
// are wrong.

/** EXPOSITORY_8 are the pieces of reading-8-expository: the order each explains in, and the accuracy and life of its language. */
export const EXPOSITORY_8 = `
# 一块砖的诞生
古老的城墙、乡间的院墙，都是用一块块砖砌起来的。一块砖是怎样做成的呢？
第一步是取土。做砖要用黏性大的黄土，挖出来以后，先把里面的石子、草根挑干净。
第二步是和泥。在土里加水，反复踩、反复揉，直到泥变得又软又匀，没有一点干块。
第三步是制坯。把泥摔进木头做的模子里，压实，刮平，再把模子翻过来，一块方方正正的砖坯就出来了。
第四步是晾坯。砖坯要放在阴凉通风的地方，慢慢阴干，一般要晾半个月左右。晒得太急，砖坯容易开裂。
最后一步是烧制。把晾干的砖坯一层层码进窑里，用大火烧上几天几夜，窑里的温度大约有九百多摄氏度。土里含有铁，烧过以后，砖就成了红色。
?1 本文主要按什么顺序说明砖的制作？ | In what order does the text explain brick-making?
≈ 时间顺序，按制作的先后步骤 | 第一步是取土 | 第二步是和泥 | 最后一步是烧制
- 空间顺序，从外到里 ~wrongorder
- 逻辑顺序，从原因到结果 ~wrongorder
?1 第二段到第六段的顺序能不能调换？为什么？ | Could paragraphs two to six change places?
≈ 不能，做砖的步骤有先后，前一步做完才能做后一步 | 第一步是取土 | 第四步是晾坯 | 把晾干的砖坯一层层码进窑里
- 能，每一段说的都是做砖 ~sense
- 能，先烧制再晾坯也可以 ~opposite
?1 文中哪些词语表明了说明的顺序？ | Which words mark the order?
= “第一步”“第二步”“第三步”“第四步”“最后一步” | 第一步是取土 | 最后一步是烧制
- “古老”“乡间” ~other
- “反复踩、反复揉” ~other
?2 “一般要晾半个月左右”中的“一般”和“左右”能不能去掉？ | Can 一般 and 左右 be dropped?
≈ 不能，晾坯的时间随天气不同，这两个词说得更准确 | 一般要晾半个月左右 | 慢慢阴干
% “一般”说的是大多数时候，“左右”说的是时间在半个月前后。阴干的快慢要看天气，不会每次都正好半个月；去掉这两个词，就成了一个死数，反而不准确。 | 一般 is “usually”, 左右 “about”. How fast a brick dries in the shade depends on the weather, and it is not always exactly half a month; without the two words the figure is fixed, and less accurate.
- 能，去掉后句子更简洁 ~sense
- 能，砖坯正好要晾十五天 ~opposite
?2 “晒得太急，砖坯容易开裂”中的“容易”有什么作用？ | What does 容易 do?
≈ 说明晒得急不一定开裂，只是开裂的可能大，说法有分寸 | 晒得太急，砖坯容易开裂
% “容易”是说可能性大，不是说一定。晒得急的砖坯，有的会裂，有的不会；用“容易”，既提醒了要阴干，又没有把话说死，符合实际。 | 容易 means likely, not certain: some bricks dried too fast crack, some do not. The word warns that they must dry slowly without overstating, and fits the facts.
- 说明砖坯晒了就一定开裂 ~opposite
- 说明晒砖坯是一件容易的事 ~literal
?2 “窑里的温度大约有九百多摄氏度”运用了什么说明方法？有什么作用？ | What method is the kiln's temperature, and to what end?
≈ 列数字，具体说明烧砖需要很高的温度 | 窑里的温度大约有九百多摄氏度 | 用大火烧上几天几夜
- 打比方，把窑比作火炉 ~nolikening
- 举例子，举出一座有名的窑 ~noexample

# 福建土楼
在福建西南部的山区，散落着一座座巨大的土楼，有圆的，也有方的，远远望去，像从地里长出来的蘑菇。
先看土楼的外墙。墙是用黄土、细沙和石灰混合，一层层夯实筑成的，底层的墙厚一般在一米以上。外墙下面几层不开窗，或者只开很小的窗，像一座坚固的城堡。
走进大门，是一个宽敞的院子，院子四周就是一圈圈的房屋。一座大的圆楼，往往有三四层高。底层是厨房和饭厅，二层是仓库，三层以上才是卧室。
院子的正中，通常是祖堂，族里的人在这里祭祀祖先、商量大事，也在这里办喜事。
一座土楼里，往往住着同一个家族的几十户人家，多的有几百人。大家同住一楼，守望相助，过着和睦的生活。二〇〇八年，福建土楼被列入《世界遗产名录》。
?1 第二段到第四段是按什么顺序说明土楼的？ | In what order do paragraphs two to four go?
≈ 空间顺序，由外到内 | 先看土楼的外墙 | 走进大门 | 院子的正中
- 时间顺序，按建造的先后 ~wrongorder
- 由主到次，先说最重要的祖堂 ~wrongorder
?1 第三段说明楼层的用途，是按什么顺序写的？ | In what order does paragraph three give the floors?
= 由下到上 | 底层是厨房和饭厅，二层是仓库，三层以上才是卧室
- 由上到下 ~opposite
- 由左到右 ~unsaid
?1 按这样的顺序说明土楼，有什么好处？ | What does this order gain?
≈ 像带着读者从外面走进楼里，条理清楚，读者容易看明白 | 先看土楼的外墙 | 走进大门 | 院子的正中
- 能说明土楼是哪一年建成的 ~unsaid
- 能把土楼和城堡比较 ~role
?2 “底层的墙厚一般在一米以上”中的“一般”能不能去掉？ | Can 一般 be dropped?
≈ 不能，土楼大小不同，墙的厚度也不同，“一般”说得更准确 | 底层的墙厚一般在一米以上
% “一般”是说大多数土楼是这样。土楼有大有小，墙也有厚有薄，不一定座座都在一米以上。去掉它，就成了所有土楼都这样，说得太绝对。 | 一般 says most tulou are so. They differ in size, and so do their walls; not every one is over a metre thick. Without the word it would say all of them are, which is too absolute.
- 能，去掉后更简洁 ~sense
- 能，所有土楼的墙都一样厚 ~opposite
?2 “像从地里长出来的蘑菇”用了什么说明方法？有什么作用？ | What method is the mushroom, and to what end?
≈ 打比方，形象地写出土楼圆圆的、散落在山间的样子 | 像从地里长出来的蘑菇 | 有圆的，也有方的
- 作比较，说明土楼比蘑菇大 ~nocompare
- 列数字，说明土楼的数量 ~nonumber
?2 “往往住着同一个家族的几十户人家”中的“往往”有什么作用？ | What does 往往 do?
≈ 说明大多是这样，也有例外，说法准确 | 往往住着同一个家族的几十户人家
% “往往”表示常常如此，但不是全部。大多数土楼住的是一个家族，也可能有别的情况。用“往往”，说明符合实际，没有说过头。 | 往往 means it is often so, not always. Most tulou house one clan, but there may be exceptions; the word keeps the statement true without overstating.
- 说明每座土楼都只住一个家族 ~opposite
- 说明土楼里的人经常搬家 ~sense

# 一张宣纸的诞生
宣纸是我国传统的书画用纸，洁白柔软，墨落在上面，浓淡分明，能保存很多年。传统的宣纸是怎样做成的呢？
先备料。宣纸的主要原料是青檀树皮和稻草。树皮和稻草要先在水里泡软，再放进大锅里蒸煮，然后摊在向阳的山坡上，任凭日晒雨淋，慢慢变白。这一步往往要几个月。
接着是制浆。把晒白的原料洗干净，放进石臼里反复舂打，打成细细的纤维，再和水调成纸浆。
然后是捞纸。两位师傅抬起一张细竹帘，在纸浆槽里一荡一提，竹帘上就留下了一层薄薄的纸浆。一荡的轻重，决定了纸的厚薄，全凭手上的功夫。
最后是晒纸和剪纸。把湿纸一张张揭开，刷在烧热的墙上烘干，再检查、剪齐，一张宣纸才算做成。
从备料到成纸，传统的宣纸一般要经过一百多道工序，前后大约要一年。
?1 本文第二到五段是按什么顺序说明的？ | In what order do paragraphs two to five go?
≈ 时间顺序，按制作工序的先后 | 先备料 | 接着是制浆 | 然后是捞纸 | 最后是晒纸和剪纸
- 空间顺序，从作坊外写到作坊里 ~wrongorder
- 由主到次，先写最重要的捞纸 ~wrongorder
?1 文中哪些词语表示工序的先后？ | Which words mark the order of the steps?
= “先”“接着”“然后”“最后” | 先备料 | 接着是制浆 | 然后是捞纸 | 最后是晒纸和剪纸
- “洁白柔软”“浓淡分明” ~other
- “一荡一提” ~other
?1 “捞纸”一段能不能放到“制浆”前面？为什么？ | Could 捞纸 come before 制浆?
≈ 不能，要先把原料打成纸浆，才能从纸浆槽里捞纸 | 再和水调成纸浆 | 在纸浆槽里一荡一提
- 能，每一段说的都是做纸 ~sense
- 能，先捞纸再制浆也行 ~opposite
?2 “这一步往往要几个月”中的“往往”能不能去掉？ | Can 往往 be dropped?
≈ 不能，晒白的快慢要看天气，“往往”表示多数时候如此，说得更准确 | 这一步往往要几个月 | 任凭日晒雨淋，慢慢变白
% 原料摊在山坡上“日晒雨淋”，晴天多就快些，雨天多就慢些。“往往”说的是大多数时候要几个月，留有余地；去掉它，就成了每次都一样，不符合实际。 | Left on the slope to sun and rain, the stuff whitens faster in fine weather and slower in wet. 往往 says it mostly takes months, and leaves room; without it, every batch would take the same time, which is not so.
- 能，每次都正好要几个月 ~opposite
- 能，“往往”是多余的 ~sense
?2 “一般要经过一百多道工序，前后大约要一年”运用了什么说明方法？有什么作用？ | What method is this, and to what end?
≈ 列数字，具体说明做一张宣纸工序多、时间长，很不容易 | 一般要经过一百多道工序，前后大约要一年 | 这一步往往要几个月
- 打比方，把宣纸比作一年 ~nolikening
- 举例子，举出一位造纸师傅 ~noexample
?2 “一荡的轻重，决定了纸的厚薄，全凭手上的功夫”说明了什么？ | What does this sentence show?
≈ 说明捞纸全靠师傅的手艺，技术要求很高 | 一荡的轻重，决定了纸的厚薄，全凭手上的功夫
% 纸的厚薄不是靠机器量出来的，而是由“一荡”用多大的力决定的；“全凭”两个字更强调只能依靠手上的经验。可见捞纸是一门很难的手艺。 | The thickness is not set by a machine but by how hard each sweep is; 全凭, “wholly by”, stresses that only the skill of the hand decides. Lifting paper is a hard craft.
- 说明纸越荡越厚 ~sense
- 说明谁都能捞好纸 ~opposite

# 陕北的窑洞
在陕北的黄土高原上，许多人家住在窑洞里。窑洞是在黄土山坡上挖出来的房子，一排排依山而建，远看像山坡上开了一扇扇门。
先看窑洞的正面。窑洞的门和窗都开在朝阳的一面，上面是半圆形的拱顶。窗户很大，糊着白纸，逢年过节，人们在窗纸上贴上红红的窗花。
走进窑洞，靠窗的地方是一盘土炕，白天阳光照在炕上，暖暖的。炕边连着灶台，做饭时的热气从炕下面通过，冬天睡在炕上一点也不冷。
再往里走，窑洞的后半部光线暗一些，一般用来放粮食、农具和杂物。
窑洞冬暖夏凉。这是因为它四周和顶上都是厚厚的黄土，顶上的土一般有好几米厚，外面的冷热很难透进来。冬天，窑洞里的温度往往比外面高十几摄氏度。
?1 第二到四段是按什么顺序说明窑洞的？ | In what order do paragraphs two to four go?
≈ 空间顺序，由外到里 | 先看窑洞的正面 | 走进窑洞 | 再往里走
- 时间顺序，按一年四季 ~wrongorder
- 逻辑顺序，先说结果再说原因 ~wrongorder
?1 最后一段是按什么顺序说明的？ | In what order does the last paragraph go?
≈ 逻辑顺序，先说冬暖夏凉的特点，再说原因 | 窑洞冬暖夏凉 | 这是因为它四周和顶上都是厚厚的黄土
- 空间顺序，从上到下 ~wrongorder
- 时间顺序，从冬天写到夏天 ~wrongorder
?1 第一段在全文中有什么作用？ | What does paragraph one do?
≈ 总说窑洞是什么样的房子，引出下文的具体说明 | 窑洞是在黄土山坡上挖出来的房子 | 先看窑洞的正面
- 说明窑洞里的家具 ~role
- 说明窑洞为什么冬暖夏凉 ~role
?2 “远看像山坡上开了一扇扇门”运用了什么说明方法？有什么作用？ | What method is this, and to what end?
≈ 打比方，形象地写出窑洞一排排嵌在山坡上的样子 | 远看像山坡上开了一扇扇门 | 一排排依山而建
- 列数字，说明窑洞的数量 ~nonumber
- 作比较，说明窑洞比楼房好 ~nocompare
?2 “冬天，窑洞里的温度往往比外面高十几摄氏度”运用了哪些说明方法？ | What methods does this sentence use?
≈ 作比较和列数字，具体说明窑洞冬天暖和 | 窑洞里的温度往往比外面高十几摄氏度
% 这句话把窑洞里和外面的温度放在一起比，是作比较；“十几摄氏度”是具体的数字，是列数字。两种方法合在一起，让读者清楚地知道窑洞里暖和多少。 | The sentence sets the inside against the outside, which is comparing; “a dozen or more degrees” is a figure, which is giving figures. Together they show how much warmer it is.
- 打比方，把窑洞比作火炉 ~nolikening
- 举例子，举出一户人家 ~noexample
?2 “顶上的土一般有好几米厚”中的“一般”有什么作用？ | What does 一般 do?
≈ 说明大多数窑洞是这样，不同的窑洞会有差别，表达准确 | 顶上的土一般有好几米厚
% 窑洞挖在不同的山坡上，顶上的土有厚有薄。“一般”表示大多数窑洞如此，并没有说每一孔都一样；去掉它，话就说得太绝对了。 | Caves are dug into different slopes, and the earth above them varies. 一般 says most are so, not every one; without it, the statement would be too absolute.
- 说明所有窑洞的顶都一样厚 ~opposite
- 说明窑洞顶上的土很薄 ~opposite

# 溶洞是怎样形成的
在我国南方的一些山里，藏着一个个溶洞。洞里有的石头像竹笋一样从地上长出来，有的像冰柱一样从洞顶挂下来，千姿百态。这些溶洞是怎样形成的呢？
原来，这些山大多是石灰岩。雨水从空气和泥土里带走了一些二氧化碳，变成了一种很弱的酸水。这种水能慢慢溶解石灰岩。
雨水顺着岩石的缝隙往下渗，一边流，一边把石灰岩溶掉一点点。缝隙越溶越宽，越溶越深。经过几十万年甚至更长的时间，地下就出现了一个个大洞，这就是溶洞。
溶洞形成以后，含着石灰的水从洞顶一滴滴落下来。水分慢慢蒸发，留下的石灰一点点积起来，在洞顶结成了石钟乳，在地上堆成了石笋。石钟乳和石笋长得非常慢，往往要几十年甚至上百年才长一厘米。
?1 本文第二、三段是按什么顺序说明溶洞成因的？ | In what order do paragraphs two and three go?
≈ 逻辑顺序，由原因到结果，一步步说明溶洞怎样形成 | 这种水能慢慢溶解石灰岩 | 缝隙越溶越宽，越溶越深 | 这就是溶洞
- 空间顺序，从洞口写到洞底 ~wrongorder
- 时间顺序，按一年四季 ~wrongorder
?1 第一段为什么先写溶洞里的奇石？ | Why does paragraph one open with the rocks?
≈ 先写看到的现象，引起读者的兴趣，再引出“怎样形成”的问题 | 千姿百态 | 这些溶洞是怎样形成的呢
- 为了说明石笋是竹笋变的 ~literal
- 为了说明溶洞的形成原因 ~role
?1 第四段和第三段是什么关系？ | How does paragraph four follow paragraph three?
≈ 先说溶洞的形成，再说溶洞里石钟乳和石笋的形成，按事物发展的先后 | 溶洞形成以后 | 这就是溶洞
- 第四段说的是另一种山洞 ~unsaid
- 两段的顺序可以随便调换 ~opposite
?2 “这种水能慢慢溶解石灰岩”中的“慢慢”能不能去掉？ | Can 慢慢 be dropped?
≈ 不能，酸水很弱，溶解得极慢，“慢慢”准确地说明了这个特点 | 这种水能慢慢溶解石灰岩 | 变成了一种很弱的酸水
% 文中说这是“一种很弱的酸水”，溶洞要“几十万年甚至更长的时间”才能形成。“慢慢”正说出了溶解的速度；去掉它，读者会以为石灰岩很快就被溶掉了。 | The water is “a very weak acid”, and a cave takes “hundreds of thousands of years or longer”. 慢慢 gives the pace; without it the reader might think the rock dissolves quickly.
- 能，去掉后句子更短 ~sense
- 能，石灰岩一下子就被溶掉了 ~opposite
?2 “往往要几十年甚至上百年才长一厘米”中的“甚至”有什么作用？ | What does 甚至 do?
≈ 表示更进一层，说明有的长得更慢，要上百年，强调生长极其缓慢 | 往往要几十年甚至上百年才长一厘米
% “甚至”把意思往前推进一步：一般要几十年，更慢的要上百年。用了它，石钟乳和石笋生长的缓慢就说得更充分，也符合不同溶洞情况不同的事实。 | 甚至 pushes the point a step further: tens of years as a rule, a hundred or more for the slowest. It makes the slowness fuller, and fits the fact that caves differ.
- 表示所有的石笋都长了一百年 ~sense
- 表示石笋长得很快 ~opposite
?2 “有的像冰柱一样从洞顶挂下来”运用了什么说明方法？ | What method is this?
≈ 打比方，把石钟乳比作冰柱，写出它的形状，形象生动 | 有的像冰柱一样从洞顶挂下来
% 石钟乳是从洞顶往下长的石头，读者没见过，不容易想象。作者用大家熟悉的“冰柱”来打比方，一下子就让人看到了它上粗下尖、垂挂下来的样子。 | A stalactite is rock growing down from the roof, hard to picture unseen. Likening it to an icicle, which everyone knows, at once shows its hanging, tapering shape.
- 作比较，说明冰柱比石头凉 ~nocompare
- 下定义，说明什么是冰柱 ~nodefine

# 冬天的“电”从哪里来
冬天脱毛衣的时候，常常听到噼啪的响声，在黑暗里还能看见一点点小火花；手一碰门把手，指尖会被“电”一下。这是怎么回事呢？
原来，物体都是由极小的微粒组成的，其中有一种带电的电子。两种不同的物体互相摩擦，有些电子会从一个物体跑到另一个物体上。得到电子的物体带上了负电，失去电子的物体带上了正电，这叫摩擦起电。
平时空气比较潮湿，物体上的电很快就被空气中的水汽带走了。冬天天气干燥，电不容易散掉，就在身上越积越多。
当手靠近金属门把手的时候，身上积存的电一下子跑到门把手上，就产生了小火花，人也感到被“电”了一下。这种电，叫作静电。
静电的电压有时能高达几千伏，但放电的时间极短，一般不会伤人。不过，在加油站这样的地方，静电的火花可能引起火灾，所以加油前最好先摸一下专门消除静电的装置。
?1 本文是按什么顺序说明的？ | In what order is the text written?
≈ 逻辑顺序，从生活现象说到原因，再说结果和防范 | 这是怎么回事呢 | 这叫摩擦起电 | 这种电，叫作静电 | 所以加油前最好先摸一下
- 时间顺序，从早上写到晚上 ~wrongorder
- 空间顺序，从家里写到加油站 ~wrongorder
?1 第三段为什么要放在第二段后面？ | Why must paragraph three follow paragraph two?
≈ 先说电是怎样产生的，再说冬天电为什么会积起来，道理一层接一层，不能颠倒 | 这叫摩擦起电 | 电不容易散掉，就在身上越积越多
- 两段说的是两件没有关系的事 ~sense
- 第三段说的是怎样消除静电 ~elsewhere
?1 第一段在文中有什么作用？ | What does paragraph one do?
≈ 从大家熟悉的现象说起，引出要说明的问题，引起读者的兴趣 | 冬天脱毛衣的时候 | 这是怎么回事呢
- 说明静电的危害 ~role
- 说明摩擦起电的道理 ~role
?2 “静电的电压有时能高达几千伏”中的“有时”能不能去掉？ | Can 有时 be dropped?
≈ 不能，静电的电压不总是这么高，“有时”说得更准确 | 静电的电压有时能高达几千伏
% 身上积的电有多有少，电压也有高有低。“有时”表示只在一些时候能高到几千伏；去掉它，就成了静电每次都有几千伏，说过头了。 | The charge on the body varies, and so does the voltage. 有时 says it reaches thousands of volts only at times; without it, every shock would be that high, which says too much.
- 能，静电每次都是几千伏 ~opposite
- 能，“有时”和句意没有关系 ~sense
?2 “静电的火花可能引起火灾”中的“可能”有什么作用？ | What does 可能 do?
≈ 说明不是一定会引起，而是有这种危险，既提醒了读者，又没有夸大 | 静电的火花可能引起火灾 | 一般不会伤人
% 静电火花不是每次都会点着东西，只有在加油站这样的地方才有危险。“可能”说的是有这种危险，不是必然发生。这样写，既让人重视，又符合实际。 | A spark does not always set anything alight; only in places like a filling station is it dangerous. 可能 names a risk, not a certainty: it makes people careful and stays true.
- 说明静电一定会引起火灾 ~opposite
- 说明加油站不会着火 ~opposite
?2 “被‘电’了一下”中的“电”为什么加引号？ | Why is 电 in quotation marks?
≈ “电”在这里当动词用，是口头上的说法，指被电击的感觉，加引号表示特殊用法 | 指尖会被“电”一下 | 人也感到被“电”了一下
- 表示引用别人的话 ~unsaid
- 表示否定，人并没有感觉 ~opposite

# 蒙古包
在内蒙古的大草原上，常常能看到一座座白色的圆顶房子，像一颗颗撒在绿毯上的珍珠，这就是牧民住的蒙古包。
蒙古包的骨架是木头做的。下面一圈是可以折叠的木格子墙，像一张张拉开的网；上面是几十根细长的木杆，一头搭在墙上，一头插进顶上的圆形木圈里，撑起圆圆的屋顶。顶上的木圈就是天窗，白天可以采光、通风，做饭的烟也从这里出去。
骨架外面，一层层盖上厚厚的毛毡，再用绳子捆紧。毛毡能挡风保暖，草原上冬天的风再大，包里也很暖和。
蒙古包的门一般朝东南开。进了门，正中间是火炉，火炉后面正对着门的地方，是长辈和客人坐的位置，两边住着家里的其他人。
牧民要随着季节换草场，蒙古包拆起来很方便，几个人一两个小时就能拆完，用车一拉，就可以搬到新的地方去。
?1 第二、三段是按什么顺序说明蒙古包的构造的？ | In what order do paragraphs two and three go?
≈ 由里到外，先说骨架，再说外面盖的毛毡；说骨架时由下到上 | 蒙古包的骨架是木头做的 | 骨架外面 | 下面一圈 | 上面是几十根细长的木杆
- 时间顺序，按一年四季 ~wrongorder
- 逻辑顺序，先说结果再说原因 ~wrongorder
?1 第四段介绍包内的布置，是按什么顺序说明的？ | In what order does paragraph four go?
≈ 空间顺序，从门口到中间再到后面和两边 | 进了门，正中间是火炉 | 火炉后面正对着门的地方 | 两边住着家里的其他人
- 由上到下 ~wrongorder
- 由远到近 ~wrongorder
?1 最后一段说明蒙古包拆搬方便，和牧民的生活有什么关系？ | How does the last paragraph tie to herders' life?
≈ 牧民要随季节换草场，所以房子要便于拆搬，说明了蒙古包这样建的原因 | 牧民要随着季节换草场 | 蒙古包拆起来很方便
- 说明牧民不喜欢住在一个地方 ~overread
- 说明蒙古包很容易坏 ~misread
?2 “像一张张拉开的网”运用了什么说明方法？有什么作用？ | What method is the net, and to what end?
≈ 打比方，形象地写出木格子墙交叉成格、可以拉开的样子 | 像一张张拉开的网 | 下面一圈是可以折叠的木格子墙
- 列数字，说明墙的长度 ~nonumber
- 作比较，说明木墙比网结实 ~nocompare
?2 “几个人一两个小时就能拆完”运用了什么说明方法？有什么作用？ | What method is this, and to what end?
≈ 列数字，具体说明蒙古包拆起来又快又方便 | 几个人一两个小时就能拆完 | 蒙古包拆起来很方便
- 打比方，把拆包比作搬家 ~nolikening
- 下定义，说明什么是蒙古包 ~nodefine
?2 “蒙古包的门一般朝东南开”中的“一般”能不能去掉？ | Can 一般 be dropped?
≈ 不能，大多数蒙古包是这样，也有不同的，“一般”说得准确 | 蒙古包的门一般朝东南开
% “一般”表示大多数情况。草原上的蒙古包多数门朝东南，但也会因为地形、风向而不同。去掉“一般”，就成了每一座都朝东南，说得太绝对了。 | 一般 marks most cases. Most yurts face south-east, but ground and wind can make some differ. Drop the word and every one must face south-east, which is too absolute.
- 能，所有蒙古包的门都朝东南 ~opposite
- 能，“一般”是多余的 ~sense

# 候鸟为什么要迁徙
每年秋天，大雁排着队向南飞；到了春天，它们又飞回北方。像大雁这样随季节变化，每年在两个地方之间往返的鸟，叫作候鸟。
候鸟为什么要长途迁徙呢？主要是为了食物。北方的冬天天寒地冻，草籽被雪盖住，虫子也躲了起来，鸟儿很难找到吃的；南方冬天比较暖和，食物多。春天北方回暖，白天长，虫子多，又适合养育雏鸟，它们就飞回去。
候鸟飞得很远。北极燕鸥夏天在北极，冬天飞到南极，一年往返的路程大约有七万千米，是迁徙最远的鸟。
它们怎样认路呢？科学家发现，候鸟可能靠太阳和星星辨别方向，有的还能感知地球的磁场。不过，这其中还有许多秘密，科学家至今没有完全弄清楚。
?1 本文是按什么顺序说明的？ | In what order is the text written?
≈ 逻辑顺序，先说是什么，再说为什么，再说怎样 | 叫作候鸟 | 候鸟为什么要长途迁徙呢 | 它们怎样认路呢
- 时间顺序，从春天写到冬天 ~wrongorder
- 空间顺序，从北方写到南方 ~wrongorder
?1 第二段说明迁徙的原因，是怎样安排的？ | How is paragraph two arranged?
≈ 先说主要原因是食物，再分别说冬天南飞和春天北归的道理 | 主要是为了食物 | 南方冬天比较暖和，食物多 | 春天北方回暖
- 先说北极，再说南极 ~other
- 只说了春天，没说冬天 ~part
?1 第一段在文中有什么作用？ | What does paragraph one do?
≈ 由大雁南飞引出候鸟，并说明什么是候鸟 | 每年秋天，大雁排着队向南飞 | 叫作候鸟
- 说明大雁是迁徙最远的鸟 ~who
- 说明候鸟怎样认路 ~role
?2 “主要是为了食物”中的“主要”能不能去掉？ | Can 主要 be dropped?
≈ 不能，迁徙还有气温、养育雏鸟等原因，“主要”说得更准确 | 主要是为了食物 | 又适合养育雏鸟
% 文中除了食物，还说到春天适合“养育雏鸟”，可见迁徙不只一个原因。“主要”表示食物是最重要的原因；去掉它，就成了只为食物，说得不全面。 | Besides food, the text names the spring as fit for raising young, so there is more than one reason. 主要 makes food the chief one; without it, food would be the only one, which is incomplete.
- 能，候鸟只为了食物才迁徙 ~opposite
- 能，“主要”和全句没有关系 ~sense
?2 “候鸟可能靠太阳和星星辨别方向”中的“可能”有什么作用？ | What does 可能 do?
≈ 说明这只是推测，科学家还没有完全证实，体现了说明语言的严谨 | 候鸟可能靠太阳和星星辨别方向 | 科学家至今没有完全弄清楚
- 说明候鸟一定是靠太阳认路的 ~opposite
- 说明作者不相信科学家 ~misread
?2 “一年往返的路程大约有七万千米”运用了什么说明方法？有什么作用？ | What method is this, and to what end?
≈ 列数字，具体说明北极燕鸥迁徙路程之远 | 一年往返的路程大约有七万千米 | 是迁徙最远的鸟
- 举例子，说明所有候鸟都飞七万千米 ~broad
- 分类别，把候鸟分成几类 ~nokinds

# 指纹
伸出手，仔细看看指尖，会发现上面有许多弯弯曲曲的细线，这就是指纹。
指纹是手指皮肤上凸起的纹路。它在人还没有出生时就已经形成，以后会随着身体长大而放大，花纹却终身不变。
世界上几乎找不到两个指纹完全相同的人，就连长得一模一样的双胞胎，指纹也不一样。
按照花纹的样子，指纹大致可以分为三类：像弓一样的弓形纹，像簸箕一样的箕形纹，一圈圈像漩涡的斗形纹。
正因为指纹人人不同、终身不变，它的用处很大。警察可以根据现场留下的指纹找到嫌疑人；现在，许多手机、门锁也用指纹来“认主人”。
?1 本文是按什么顺序说明指纹的？ | In what order is the fingerprint explained?
≈ 逻辑顺序，先说是什么，再说特点和种类，最后说用途 | 指纹是手指皮肤上凸起的纹路 | 指纹大致可以分为三类 | 它的用处很大
- 时间顺序，从古代写到今天 ~wrongorder
- 空间顺序，从大拇指写到小拇指 ~wrongorder
?1 最后一段开头的“正因为指纹人人不同、终身不变”有什么作用？ | What does the opening of the last paragraph do?
≈ 承上启下，由前面说的特点引出用途 | 正因为指纹人人不同、终身不变 | 它的用处很大
- 总结全文的中心 ~role
- 说明指纹的种类 ~role
?1 第二、三段分别说明了指纹的什么特点？ | What features do paragraphs two and three give?
= 终身不变；人人不同 | 花纹却终身不变 | 世界上几乎找不到两个指纹完全相同的人
- 越长越多；越来越小 ~unsaid
- 颜色不同；形状一样 ~unsaid
?2 “世界上几乎找不到两个指纹完全相同的人”中的“几乎”能不能去掉？ | Can 几乎 be dropped?
≈ 不能，人们没法把世上所有人的指纹都比对一遍，“几乎”留有余地，说法更严谨 | 世界上几乎找不到两个指纹完全相同的人
% 世界上的人那么多，谁也不可能把所有人的指纹都拿来一一比较。“几乎”表示接近于绝对，又不说死；去掉它，就把话说过头了。 | No one can compare the fingerprints of everyone on earth. 几乎 comes close to absolute without saying it outright; without it the statement goes too far.
- 能，所有人的指纹都已经比较过了 ~opposite
- 能，去掉后更有力 ~sense
?2 “大致可以分为三类”运用了什么说明方法？ | What method is this?
≈ 分类别，把指纹按花纹分成弓形纹、箕形纹、斗形纹三类，说明得有条理 | 指纹大致可以分为三类
% 这一句把指纹按“花纹的样子”分成了三类，并逐一说明每一类像什么，这是分类别。分了类，读者能分清不同的指纹，说明更有条理。 | The sentence sorts fingerprints into three kinds by their pattern and says what each is like: that is classifying. Sorted so, the reader can tell them apart, and the account is orderly.
- 列数字，说明指纹的数量 ~nonumber
- 下定义，说明指纹是什么 ~nodefine
?2 “用指纹来‘认主人’”中的引号有什么作用？ | What do the quotation marks do?
≈ 表示特殊的说法，把手机、门锁拟人化，生动地说明指纹识别 | 用指纹来“认主人”
% 手机、门锁不会真的认人，这里给“认主人”加上引号，表示这是一种特殊的、拟人的说法：机器凭指纹分辨出谁是主人。这样写生动、亲切，读者一看就懂。 | Phones and locks do not really know anyone; the quotation marks mark 认主人 as a special, personifying phrase: the machine tells its owner by the fingerprint. It is vivid and easy to grasp.
- 表示引用别人说的话 ~unsaid
- 表示否定，手机认不出主人 ~opposite

# 眼睛怎样看见东西
我们能看见五颜六色的世界，靠的是眼睛。眼睛是怎样看见东西的呢？
眼球的前面有一层透明的角膜，光线从物体上反射过来，先穿过角膜。
角膜后面是瞳孔，它像照相机的光圈，光线强的时候缩小，光线弱的时候放大，控制进入眼睛的光的多少。
光线通过瞳孔，到达晶状体。晶状体像一个可以变厚变薄的凸透镜，把光线聚到眼球后面的视网膜上，在那里形成一个倒立的像。
视网膜上有上亿个感光细胞，它们把光变成信号，通过视神经传给大脑。大脑把倒立的像“翻”过来，我们看到的就是正立的东西了。
?1 本文第二到五段是按什么顺序说明的？ | In what order do paragraphs two to five go?
≈ 按光线进入眼睛的先后，由前到后，一步步说明 | 先穿过角膜 | 角膜后面是瞳孔 | 光线通过瞳孔，到达晶状体 | 通过视神经传给大脑
- 由主到次，先说最重要的大脑 ~wrongorder
- 由上到下，从眉毛写到下巴 ~wrongorder
?1 这样安排顺序有什么好处？ | What does the order gain?
≈ 顺着光线走过的路线说明，读者能清楚地了解看见东西的全过程 | 先穿过角膜 | 光线通过瞳孔，到达晶状体 | 通过视神经传给大脑
- 能说明眼睛有多大 ~unsaid
- 能把眼睛和耳朵比较 ~role
?1 第五段说的是看见东西的哪一步？ | Which step does paragraph five tell?
= 视网膜把光变成信号，传给大脑，大脑把像翻正 | 它们把光变成信号，通过视神经传给大脑 | 大脑把倒立的像“翻”过来
- 光线穿过角膜 ~elsewhere
- 瞳孔变大变小 ~elsewhere
?2 “它像照相机的光圈”运用了什么说明方法？有什么作用？ | What method is the camera, and to what end?
≈ 打比方，把瞳孔比作照相机的光圈，通俗地说明它控制光线多少的作用 | 它像照相机的光圈 | 控制进入眼睛的光的多少
- 作比较，说明眼睛比照相机好 ~nocompare
- 举例子，举出一部照相机 ~noexample
?2 “视网膜上有上亿个感光细胞”运用了什么说明方法？ | What method is this?
≈ 列数字，说明感光细胞数量极多 | 视网膜上有上亿个感光细胞
% “上亿个”是一个数量，用数字说明感光细胞多得惊人，这是列数字。它让读者具体地感受到视网膜的精密。 | 上亿个, “a hundred million and more”, is a figure: it shows how many light cells there are, which is giving figures. The reader feels concretely how fine the retina is.
- 打比方，把细胞比作照片 ~nolikening
- 下定义，说明视网膜是什么 ~nodefine
?2 “大脑把倒立的像‘翻’过来”中的“翻”加了引号，为什么？ | Why is 翻 in quotation marks?
≈ 大脑并不是真的把像翻转，这是形象的说法，加引号表示特殊含义 | 大脑把倒立的像“翻”过来
% 大脑处理的是信号，并没有像翻东西那样真的把像翻个身。用“翻”是打个比方，形象易懂；加上引号，提醒读者这个词不是平常的意思。 | The brain deals in signals; it does not really turn the image over as one turns a thing. 翻 is a figure, vivid and plain; the marks warn that it is not meant in its usual sense.
- 表示引用别人的话 ~unsaid
- 表示大脑真的会翻跟头 ~literal
`;

/** SCIENCE_8 are the pieces of reading-8-science: what each discovery found and how, and the spirit of science it shows. */
export const SCIENCE_8 = `
# 蝙蝠靠什么飞行
两百多年前，意大利科学家斯帕兰札尼注意到一个现象：蝙蝠在漆黑的夜里飞来飞去，从不撞到东西。它靠的是眼睛吗？
他在一间屋子里拉了许多细绳，绳上挂着小铃铛，再把蝙蝠的眼睛蒙起来放进去。蝙蝠照样飞，铃铛一个也没响。看来，蝙蝠不是靠眼睛。
那么是靠鼻子吗？他又把蝙蝠的鼻子堵住，结果蝙蝠还是飞得自由自在。
最后，他把蝙蝠的耳朵塞住。这一次，蝙蝠像没头苍蝇一样乱撞，铃铛响成一片。
斯帕兰札尼得出结论：蝙蝠是用耳朵来“看路”的。可是耳朵怎么能看路呢？他没能找到答案。直到一百多年后，科学家才用仪器发现，蝙蝠能发出人耳听不到的超声波，靠听回声来辨别前面的东西。
?1 斯帕兰札尼最先想弄清楚的是什么问题？ | What did he first want to know?
= 蝙蝠在黑夜里飞行靠的是不是眼睛 | 它靠的是眼睛吗
- 蝙蝠为什么喜欢夜里出来 ~unsaid
- 蝙蝠吃什么东西 ~unsaid
?1 斯帕兰札尼是用什么方法一步步找到答案的？ | By what method did he find the answer?
≈ 做实验，每次只改变一个条件，逐个排除 | 再把蝙蝠的眼睛蒙起来放进去 | 他又把蝙蝠的鼻子堵住 | 最后，他把蝙蝠的耳朵塞住
- 查阅古书上的记载 ~unsaid
- 请教捕蝙蝠的猎人 ~unsaid
?1 在屋里挂上带铃铛的细绳，有什么用？ | What were the belled strings for?
≈ 蝙蝠一碰到绳子铃铛就会响，可以知道它有没有撞到东西 | 绳上挂着小铃铛 | 铃铛一个也没响 | 铃铛响成一片
- 用铃声吸引蝙蝠飞过来 ~unsaid
- 让屋子里更热闹 ~unsaid
?2 斯帕兰札尼没能弄清“耳朵怎么能看路”，这件事说明了什么？ | What does his unanswered question show?
≈ 科学探索是一代代接力的，一个人的发现有限，后人在此基础上继续前进 | 他没能找到答案 | 直到一百多年后，科学家才用仪器发现
- 斯帕兰札尼的实验是失败的 ~misread
- 蝙蝠的秘密到今天也没有人知道 ~opposite
?2 斯帕兰札尼的研究体现了怎样的科学精神？ | What spirit of science does his work show?
≈ 对常见现象善于发问，并用实验求证，不凭猜想下结论 | 它靠的是眼睛吗 | 看来，蝙蝠不是靠眼睛 | 斯帕兰札尼得出结论
- 相信传说，不做实验 ~opposite
- 只观察一次就下结论 ~opposite
?2 文中说科学家后来“用仪器发现”超声波，这说明了什么？ | What does the instrument later show?
≈ 有些现象人的感官察觉不到，科学的进步也要靠工具的进步 | 蝙蝠能发出人耳听不到的超声波 | 科学家才用仪器发现
- 斯帕兰札尼的耳朵不好 ~unsaid
- 人耳能听到超声波 ~opposite

# 鹅颈瓶的秘密
肉汤放久了会变质发臭，里面长出许多微生物。从前很多人认为，这些微生物是从肉汤里自己生出来的。法国科学家巴斯德却不相信。
他想：如果微生物是从空气里落进去的呢？为了证明这一点，他设计了一种特别的瓶子：瓶颈又细又长，弯成像鹅脖子一样的形状。
他把肉汤倒进两个这样的瓶子里，煮沸，杀死里面原有的微生物。空气可以进入弯弯的瓶颈，可空气里的灰尘和微生物会被挡在弯曲的地方，落不进肉汤里。
结果，肉汤放了很久，依然清澈新鲜。接着，他把其中一个瓶子的瓶颈打断，空气中的东西能直接落进去了。没过几天，这瓶肉汤就变质了。
这个实验证明：肉汤里的微生物来自空气，而不是自己生出来的。巴斯德的发现，为后来的食品保存和防止伤口感染打下了基础。
?1 巴斯德的实验要证明什么？ | What did the experiment set out to prove?
= 肉汤里的微生物来自空气，而不是自己生出来的 | 肉汤里的微生物来自空气，而不是自己生出来的
- 煮沸的肉汤更好喝 ~unsaid
- 鹅颈瓶可以装更多肉汤 ~unsaid
?1 把瓶颈弯成鹅脖子的样子，有什么作用？ | Why bend the neck like a goose's?
≈ 让空气能进去，却把灰尘和微生物挡在弯曲处，落不进肉汤 | 空气可以进入弯弯的瓶颈 | 可空气里的灰尘和微生物会被挡在弯曲的地方
- 让瓶子更漂亮 ~unsaid
- 把空气完全挡在外面 ~opposite
?1 打断一个瓶子的瓶颈，在实验中起什么作用？ | What does breaking one neck do in the experiment?
≈ 形成对比：两瓶只差瓶颈这一点，结果不同，证明微生物来自空气 | 他把其中一个瓶子的瓶颈打断 | 这瓶肉汤就变质了 | 依然清澈新鲜
- 巴斯德不小心把瓶子摔坏了 ~misread
- 为了把肉汤倒出来喝 ~unsaid
?2 巴斯德面对当时多数人的看法，是什么态度？ | What was his attitude to the common view?
≈ 不盲从多数人的看法，敢于怀疑，并用实验去验证 | 巴斯德却不相信 | 为了证明这一点，他设计了一种特别的瓶子
- 完全相信多数人的看法 ~opposite
- 不做实验，只和别人争论 ~unsaid
?2 实验中先把肉汤煮沸，体现了怎样的科学态度？ | What attitude does boiling the broth first show?
≈ 严谨，先排除原有的微生物，结果才可信 | 煮沸，杀死里面原有的微生物
% 如果肉汤里本来就有微生物，后来变质，就分不清是原来的还是空气里落进去的。先煮沸，把原有的微生物杀死，实验的结果才能说明问题。这正是科学的严谨。 | If the broth already held microbes, spoiling later could not tell old ones from those fallen from the air. Boiling first kills the old ones, so the result means something: that is the care of science.
- 为了让肉汤更香 ~unsaid
- 煮沸是多余的，可以不做 ~opposite
?2 最后一段说巴斯德的发现“打下了基础”，这说明了什么？ | What does “laid the foundation” show?
≈ 一个看似简单的实验，能推动科学和生活的进步 | 为后来的食品保存和防止伤口感染打下了基础
% 一个用肉汤和瓶子做的实验，后来影响到食品保存和医院防止伤口感染。可见弄清一个基本的道理，会给生活带来很大的改变。 | An experiment with broth and flasks later bore on keeping food and on preventing infection of wounds. Settling one basic question can change life greatly.
- 巴斯德发明了冰箱 ~unsaid
- 这个实验和生活没有关系 ~opposite

# 吊灯的摆动
一五八三年，十九岁的伽利略在比萨的大教堂里，看见屋顶垂下的一盏吊灯被风吹得来回摆动。
别人只是随便看一眼，他却盯着看了很久。他发现，吊灯摆动的幅度越来越小，可是每摆动一次所用的时间似乎没有变。
当时没有钟表，他就按着自己手腕上的脉搏来计时。一次次数下来，结果都一样：不管摆得远还是近，来回一次的时间几乎相同。
回到家，他用绳子拴上重物做成摆，反复试验，换不同的重物，又换不同长度的绳子。他发现，摆来回一次的时间和重物的轻重无关，而和绳子的长短有关。
后来，人们根据这个道理，制成了走得更准的摆钟。
?1 伽利略用什么来计时？为什么？ | How did Galileo time it, and why?
= 用手腕上的脉搏，因为当时没有钟表 | 当时没有钟表，他就按着自己手腕上的脉搏来计时
- 用教堂的钟声，因为钟声很准 ~unsaid
- 用沙漏，因为沙漏最方便 ~unsaid
?1 伽利略在家里的试验，得出了什么结论？ | What did his tests at home show?
= 摆来回一次的时间和重物的轻重无关，和绳子的长短有关 | 摆来回一次的时间和重物的轻重无关，而和绳子的长短有关
- 重物越重，摆得越快 ~opposite
- 绳子的长短和摆动没有关系 ~opposite
?1 伽利略“换不同的重物，又换不同长度的绳子”，这样做的目的是什么？ | Why change the weights, then the strings?
≈ 一次改变一个条件，找出摆动的时间到底和什么有关 | 换不同的重物，又换不同长度的绳子 | 和重物的轻重无关，而和绳子的长短有关
- 想做一个更好看的摆 ~unsaid
- 家里的绳子不够用 ~unsaid
?2 “别人只是随便看一眼，他却盯着看了很久”运用了什么写法？表现了什么？ | What method is this sentence, and what does it show?
≈ 对比，表现伽利略善于观察、对常见现象有好奇心 | 别人只是随便看一眼，他却盯着看了很久
% 同样看见吊灯摆动，别人随便看看就过去了，伽利略却一直盯着。把两种态度放在一起对比，突出了他对平常现象的好奇和细心的观察。 | Others glance at the swinging lamp and move on; Galileo keeps watching. Setting the two side by side brings out his curiosity about the everyday and his careful eye.
- 比喻，把吊灯比作钟表 ~nolikening
- 说明伽利略看不清吊灯 ~misread
?2 伽利略从教堂回家后又反复试验，这说明了什么？ | What do his tests at home show of him?
≈ 他不满足于一次观察，要用反复的实验来验证 | 回到家，他用绳子拴上重物做成摆，反复试验
% 在教堂里数脉搏只是初步的观察，可能有偶然。他回家自己做摆，换重物、换绳子，一次次试，就是要用实验来检验发现是不是真的，这是求实的态度。 | Counting his pulse in church was only a first look, perhaps by chance. Making his own pendulum and changing weights and strings, again and again, tests whether the finding holds: that is a respect for fact.
- 他在教堂里的发现是错的 ~misread
- 他觉得做摆很好玩 ~unsaid
?2 最后一段说人们制成了摆钟，说明了什么？ | What does the pendulum clock at the end show?
≈ 从平常的现象中发现的道理，可以用来造福生活 | 后来，人们根据这个道理，制成了走得更准的摆钟
% 吊灯摆动是谁都见过的小事，伽利略从中找到了规律，人们又用这个规律做出了更准的钟。科学发现就这样走进了日常生活。 | A swinging lamp is something everyone has seen; Galileo found its law, and others used the law to build truer clocks. So a discovery enters daily life.
- 伽利略发明了手表 ~unsaid
- 吊灯比摆钟更准 ~opposite

# 风筝引来了闪电
二百多年前，人们看见天上的闪电，听见轰隆隆的雷声，都很害怕，以为那是神发怒了。美国科学家富兰克林却想：闪电会不会和实验室里的电火花是同一种东西？
一七五二年夏天的一个雷雨天，富兰克林和儿子来到费城郊外的田野里，放起了一只特别的风筝。风筝顶上绑着一根尖尖的细铁丝，麻绳的下端系着一把铜钥匙，手握的地方换成了一段丝带。他们站在一间小棚子下面，不让丝带被雨淋湿。
雨水把麻绳淋湿以后，富兰克林看见麻绳上的细毛一根根竖了起来。他用手指的关节靠近钥匙，“啪”的一声，跳出了一串火花，手上一阵发麻。他又把钥匙上的电引进一只专门储存电的瓶子里，后来用它做实验，结果和实验室里的电完全一样。
这个实验证明：闪电就是电。不久，富兰克林根据这个道理发明了避雷针，保护了许多房屋。
不过，这个实验非常危险。第二年，一位俄国科学家在做类似的实验时，被雷电击中而死。
?1 富兰克林想弄清楚的是什么问题？ | What did Franklin want to know?
= 闪电和实验室里的电火花是不是同一种东西 | 闪电会不会和实验室里的电火花是同一种东西
- 雷声为什么那么响 ~unsaid
- 风筝能飞多高 ~unsaid
?1 风筝上的铁丝、麻绳、钥匙和丝带各有什么用？ | What were the wire, string, key and ribbon for?
≈ 铁丝把天上的电引下来，湿麻绳传电，钥匙让电聚在那里，干丝带不传电，保护手握的人 | 风筝顶上绑着一根尖尖的细铁丝 | 麻绳的下端系着一把铜钥匙 | 不让丝带被雨淋湿
% 电要从天上传到地面，靠的是尖铁丝和淋湿的麻绳；钥匙系在麻绳下端，电就聚到了钥匙上；手握的地方换成丝带，又特意不让它淋湿，是因为干丝带不容易传电，能保护拿风筝的人。每一样东西都有用处，说明实验是精心设计的。 | The pointed wire and the wet string carry the charge down; the key at the end of the string gathers it; the ribbon in the hand is kept dry because dry silk hardly carries electricity, which guards the man holding it. Each part has a use: the experiment was carefully planned.
- 都是为了让风筝更好看 ~unsaid
- 丝带是为了让电更快地传到手上 ~opposite
?1 富兰克林怎样证明钥匙上的电和实验室里的电一样？ | How did he show the key's charge was ordinary electricity?
= 把钥匙上的电引进储存电的瓶子，再用它做实验，结果完全一样 | 他又把钥匙上的电引进一只专门储存电的瓶子里，后来用它做实验，结果和实验室里的电完全一样
- 只凭手上发麻就下了结论 ~part
- 请别人来摸一摸钥匙 ~unsaid
?2 富兰克林和当时多数人对闪电的看法有什么不同？说明了什么？ | How did his view differ, and what does it show?
≈ 多数人以为闪电是神发怒，他却想到它可能是电，说明他敢于怀疑旧说法，用科学去解释自然 | 以为那是神发怒了 | 富兰克林却想
- 他也认为闪电是神发怒 ~opposite
- 他不怕打雷，喜欢在雨里玩 ~misread
?2 文章最后写俄国科学家的死，有什么作用？ | Why end with the Russian scientist's death?
≈ 说明这个实验非常危险，也提醒读者，科学探索要勇敢，更要讲究安全 | 不过，这个实验非常危险 | 被雷电击中而死
% 前面写富兰克林的实验成功了，最后笔锋一转，用“不过”写出第二年另一位科学家因类似的实验而死。这既说明富兰克林冒了很大的危险，也告诉读者：这样的实验不能随便模仿，探索要大胆，也要小心。 | After the success, “however” turns to another scientist killed the next year by a like experiment. It shows the risk Franklin ran, and warns the reader that such trials are not to be copied lightly: be bold in inquiry, and careful too.
- 说明俄国科学家不如富兰克林聪明 ~misread
- 说明避雷针没有用 ~unsaid
?2 富兰克林发明避雷针，说明了什么？ | What does the lightning rod show?
≈ 弄清了自然的道理，就能用它来造福人类 | 这个实验证明：闪电就是电 | 富兰克林根据这个道理发明了避雷针，保护了许多房屋
- 避雷针是用风筝做的 ~sense
- 有了避雷针就不会打雷了 ~sense

# 磁针“微偏东”
指南针是我国古代的伟大发明。北宋的沈括在《梦溪笔谈》里，详细记录了他对指南针的研究。
用磁石磨过的针，就能指南。可是，针放在哪里最好呢？沈括一一试过：放在指甲上，放在碗边上，都能转动，但容易滑落；让针浮在水面上，水一晃，针就跟着摇动；最好的办法，是用一根新丝线，把针的中间粘上一点蜡，挂在没有风的地方，针就稳稳地指向南方。
在反复观察中，沈括还发现了一个别人没有注意到的现象：磁针所指的方向“常微偏东，不全南也”，就是总是稍稍偏向东边，并不正对着南方。
这就是磁偏角。沈括的记录，是世界上关于磁偏角最早的记载，比欧洲早了四百多年。
?1 沈括试过哪几种放置磁针的方法？ | What ways of setting the needle did he try?
= 放在指甲上、放在碗边上、浮在水面上、用丝线挂起来 | 放在指甲上，放在碗边上 | 让针浮在水面上 | 用一根新丝线
- 插在土里、绑在木棍上 ~unsaid
- 放在铜盘上、放在书上 ~unsaid
?1 沈括认为哪种方法最好？为什么？ | Which way was best, and why?
≈ 用丝线挂起来，挂在没有风的地方，针不会滑落也不会摇动，指向稳定 | 最好的办法，是用一根新丝线 | 针就稳稳地指向南方
- 浮在水面上，因为最方便 ~opposite
- 放在指甲上，因为随时可以看 ~opposite
?1 沈括发现了什么现象？ | What did he notice?
= 磁针总是稍稍偏向东边，不正对着南方 | 就是总是稍稍偏向东边，并不正对着南方
- 磁针总是指向北方 ~unsaid
- 磁针有时指南，有时指北 ~unsaid
?2 沈括把几种方法一一试过，说明了什么？ | What does trying every way show?
≈ 他做事认真严谨，用比较实验找出最好的方法 | 沈括一一试过 | 最好的办法
- 他不知道该怎样用指南针 ~misread
- 他很喜欢玩针 ~unsaid
?2 “别人没有注意到的现象”被沈括发现了，原因是什么？ | Why did Shen Kuo see what others missed?
≈ 他反复细心地观察，不放过细微的差别 | 在反复观察中 | 常微偏东，不全南也
- 他的眼睛比别人好 ~unsaid
- 他用了别人没有的仪器 ~unsaid
?2 最后一段说沈括的记录“比欧洲早了四百多年”，作用是什么？ | What does “four hundred years before Europe” do?
≈ 用比较突出沈括的发现在世界上领先，表达了自豪之情 | 比欧洲早了四百多年 | 是世界上关于磁偏角最早的记载
- 说明欧洲人不会用指南针 ~unsaid
- 说明沈括去过欧洲 ~unsaid

# 稻田里找“宝”
一九六四年夏天，湖南安江的稻田里，一位年轻的农业老师顶着烈日，弯着腰，在一行行稻子中间慢慢地走。他就是袁隆平。
他要找的，是一种特别的稻株：它的花粉不能用，自己不能结籽，叫作“雄性不育株”。有了它，才可能培育出产量更高的杂交水稻。可是，当时国外有的专家认为，水稻很难做成杂交，这条路走不通。
袁隆平不这样看。他想：既然别的作物能杂交，水稻为什么不能试一试？
找这样的稻株，就像大海里捞针。他拿着放大镜，一株一株地看，一朵一朵地查。一连找了十几天，看了一万多株稻穗，终于找到了第一株。
这以后，他和助手们又试了很多年。一九七〇年，他的学生在海南的野生稻里，找到了一种更好的不育株。一九七三年，杂交水稻培育成功，产量比普通水稻高出大约两成。如今，杂交水稻已经在许多国家种植，让更多的人吃饱了饭。
?1 袁隆平要在稻田里找什么？为什么？ | What was he looking for, and why?
= 找雄性不育株，有了它才可能培育出高产的杂交水稻 | 叫作“雄性不育株” | 有了它，才可能培育出产量更高的杂交水稻
- 找害虫，保护稻子 ~unsaid
- 找最高的稻子，拿去展览 ~unsaid
?1 袁隆平是用什么方法找到第一株不育株的？ | How did he find the first one?
= 拿着放大镜一株一株地看，一朵一朵地查 | 他拿着放大镜，一株一株地看，一朵一朵地查
- 请国外专家帮他找 ~unsaid
- 随便摘了一株就找到了 ~opposite
?1 杂交水稻培育成功用了多长时间？ | How long did it take to succeed?
≈ 从一九六四年开始，到一九七三年成功，大约九年 | 一九六四年夏天 | 一九七三年，杂交水稻培育成功
% 文章开头说寻找是在“一九六四年夏天”，后面说“一九七三年，杂交水稻培育成功”。从一九六四年到一九七三年，前后大约经过了九年。 | The search began in the summer of 1964, and the hybrid succeeded in 1973: about nine years from first to last.
- 十几天 ~figure
- 一九七〇年当年就成功了 ~figure
?2 面对“这条路走不通”的说法，袁隆平是什么态度？ | What was his attitude to “it cannot be done”?
≈ 不盲从权威的看法，敢于质疑，坚持去试 | 袁隆平不这样看 | 水稻为什么不能试一试
- 完全相信专家，放弃了 ~opposite
- 和专家吵了起来 ~unsaid
?2 “就像大海里捞针”有什么作用？ | What does the needle in the sea do?
≈ 比喻寻找不育株非常难，衬托出袁隆平的耐心和毅力 | 就像大海里捞针 | 看了一万多株稻穗，终于找到了第一株
- 说明袁隆平在海边找针 ~literal
- 说明这样的稻株很容易找 ~opposite
?2 杂交水稻的成功说明了怎样的道理？ | What does the success teach?
≈ 科学研究要敢想敢试，还要长期坚持、众人合作，才能取得造福人类的成果 | 他和助手们又试了很多年 | 他的学生在海南的野生稻里 | 让更多的人吃饱了饭
- 只要运气好就能成功 ~broad
- 一个人就能完成所有研究 ~opposite

# 一只“不干净”的培养皿
一九二八年夏天，英国细菌学家弗莱明出门度假前，在实验室里留下了几只培养细菌的玻璃皿。
度假回来，他发现有一只培养皿被一种青绿色的霉菌“弄脏”了。换了别人，也许会把它洗掉了事。弗莱明却仔细一看，发现霉菌周围有一圈透明的地方，那里的细菌都死了。
他想：会不会是这种霉菌放出了一种能杀死细菌的东西？他把霉菌单独培养起来，做了一次次实验，证实霉菌里确实有一种物质能杀死许多种细菌。他把它叫作青霉素。
可是，青霉素很难提纯，弗莱明没能把它做成药。十多年后，另外两位科学家弗洛里和钱恩接着研究，终于把青霉素制成了药品，挽救了无数病人的生命。一九四五年，三个人一起获得了诺贝尔奖。
?1 弗莱明在被“弄脏”的培养皿里发现了什么？ | What did he see in the spoiled dish?
= 霉菌周围有一圈透明的地方，那里的细菌都死了 | 发现霉菌周围有一圈透明的地方，那里的细菌都死了
- 细菌长得比原来更多 ~opposite
- 培养皿裂开了 ~unsaid
?1 弗莱明提出了什么猜想？又是怎样证实的？ | What did he guess, and how did he prove it?
≈ 猜想霉菌放出了杀死细菌的东西，单独培养霉菌，做了一次次实验来证实 | 会不会是这种霉菌放出了一种能杀死细菌的东西 | 他把霉菌单独培养起来，做了一次次实验
- 猜想细菌是被热死的，用温度计来证实 ~unsaid
- 没有猜想，直接把霉菌做成了药 ~opposite
?1 青霉素是怎样最终成为药品的？ | How did penicillin at last become a medicine?
= 十多年后，弗洛里和钱恩接着研究，制成了药品 | 另外两位科学家弗洛里和钱恩接着研究，终于把青霉素制成了药品
- 弗莱明当年就把它做成了药 ~opposite
- 一位病人偶然发现了它 ~unsaid
?2 “换了别人，也许会把它洗掉了事”这句话有什么作用？ | What does this sentence do?
≈ 用别人的做法作对比，突出弗莱明观察细致，不放过意外的现象 | 换了别人，也许会把它洗掉了事 | 弗莱明却仔细一看
- 批评弗莱明不爱干净 ~misread
- 说明培养皿必须马上洗掉 ~opposite
?2 青霉素的发现说明，偶然的机会和科学发现有什么关系？ | How do chance and discovery relate here?
≈ 机会常常出现在偶然之中，但只有善于观察、勤于思考的人才能抓住它 | 有一只培养皿被一种青绿色的霉菌“弄脏”了 | 弗莱明却仔细一看 | 他想
- 科学发现全靠运气，不用努力 ~broad
- 偶然发生的事都没有用 ~opposite
?2 三个人一起获得诺贝尔奖，说明了什么？ | What does the shared prize show?
≈ 重大的科学成果往往要靠许多人接力合作才能完成 | 另外两位科学家弗洛里和钱恩接着研究 | 三个人一起获得了诺贝尔奖
% 弗莱明发现了青霉素，却没能做成药；弗洛里和钱恩接着研究，才让它真正救人。三个人共同获奖，说明这项成果不是一个人完成的，而是接力合作的结果。 | Fleming found penicillin but could not make it a medicine; Florey and Chain carried the work on and made it save lives. The shared prize shows the achievement was not one man's but a relay of many.
- 诺贝尔奖每次都发给三个人 ~unsaid
- 弗莱明的贡献最小 ~misread

# 种了八年豌豆
一百多年前，奥地利一座修道院的园子里，有一位叫孟德尔的修道士，种了八年豌豆。
他选豌豆，是因为豌豆有许多容易分清的性状：种子有圆的也有皱的，花有红的也有白的，茎有高的也有矮的。
他把结圆种子的豌豆和结皱种子的豌豆杂交，结果第一代全都是圆种子。他把第一代再种下去，第二代里又出现了皱种子。他一粒一粒地数，发现圆种子和皱种子的数量比大约是三比一。换成别的性状，比例也差不多。
八年里，他种了两万多株豌豆，记录了大量数据，总结出了生物遗传的规律。一八六六年，他发表了论文，可是当时几乎没有人重视。直到他去世十几年后，三位科学家分别得出了同样的结论，人们才认识到他的发现有多么重要。
?1 孟德尔为什么选豌豆做实验？ | Why did he choose peas?
= 豌豆有许多容易分清的性状 | 豌豆有许多容易分清的性状
- 豌豆长得最快 ~unsaid
- 豌豆最好吃 ~unsaid
?1 圆种子和皱种子的豌豆杂交后，两代分别是什么结果？ | What came of crossing round and wrinkled?
= 第一代全是圆种子，第二代又出现了皱种子，圆皱大约是三比一 | 结果第一代全都是圆种子 | 第二代里又出现了皱种子 | 大约是三比一
- 第一代全是皱种子 ~opposite
- 两代都只有圆种子 ~opposite
?1 “换成别的性状，比例也差不多”说明了什么？ | What does “much the same for other traits” show?
≈ 三比一不是偶然的，而是普遍的规律 | 换成别的性状，比例也差不多 | 总结出了生物遗传的规律
- 别的性状没有比例 ~opposite
- 孟德尔数错了 ~misread
?2 “他一粒一粒地数”表现了孟德尔怎样的品质？ | What does counting seed by seed show?
≈ 耐心细致，用准确的数据说话 | 他一粒一粒地数 | 记录了大量数据
% “一粒一粒地数”是很费工夫的事。孟德尔不凭印象说“多一些”“少一些”，而是一粒粒数清楚，得出“三比一”这样准确的数据。这正是科学研究需要的耐心和严谨。 | Counting seed by seed takes great labour. He does not say “more” or “fewer” by impression but counts every one, reaching an exact ratio of three to one: the patience and care research needs.
- 他不会用别的计数方法 ~misread
- 他想知道一共有多少豌豆可以吃 ~unsaid
?2 孟德尔的论文发表时没人重视，这件事说明了什么？ | What does the neglect of his paper show?
≈ 新的科学发现有时一时不被理解，但真理经得起时间的检验 | 当时几乎没有人重视 | 三位科学家分别得出了同样的结论 | 人们才认识到他的发现有多么重要
- 孟德尔的结论是错的 ~opposite
- 论文写得太短了 ~unsaid
?2 本文主要表现了孟德尔怎样的科学精神？ | What spirit of science does the text chiefly show?
≈ 长期坚持，细致观察，重视数据 | 种了八年豌豆 | 他种了两万多株豌豆，记录了大量数据
- 不怕危险，勇于冒险 ~unsaid
- 只凭灵感，不做实验 ~opposite

# 写了几十年的物候日记
物候是指草木的荣枯、候鸟的来去等随季节变化的自然现象。我国气象学家竺可桢，是研究物候的开拓者。
从三十年代起，竺可桢每天都记日记。日记里除了天气，还记着他看到的物候：哪一天桃花开了，哪一天柳树绿了，哪一天燕子来了。无论在家还是出差，从不间断。
就这样，他记了几十年。直到去世的前一天，他还用颤抖的手，在日记本上记下了当天的气温和风向。
他把多年的物候记录和古书里的记载对比，发现我国近五千年来的气候有过多次冷暖变化，写出了著名的论文。他还和别人合写了一本通俗的小书，让更多人了解物候学。
他常说：“只有坚持记录，才能从平常的现象里看出规律。”
?1 什么是物候？ | What is 物候?
= 草木的荣枯、候鸟的来去等随季节变化的自然现象 | 物候是指草木的荣枯、候鸟的来去等随季节变化的自然现象
- 每天的天气预报 ~narrow
- 古书里的记载 ~unsaid
?1 竺可桢用什么方法研究五千年来的气候？ | How did he study five thousand years of climate?
= 把多年的物候记录和古书里的记载对比 | 他把多年的物候记录和古书里的记载对比
- 到各地挖掘古代的冰块 ~unsaid
- 只查阅外国的资料 ~unsaid
?1 竺可桢的日记里记了哪些物候？ | What did his diary record?
= 桃花开、柳树绿、燕子来的日子 | 哪一天桃花开了，哪一天柳树绿了，哪一天燕子来了
- 每天吃了什么 ~unsaid
- 读了哪些书 ~unsaid
?2 “直到去世的前一天，他还用颤抖的手……记下了当天的气温和风向”表现了什么？ | What does the last entry show?
≈ 竺可桢几十年如一日、坚持不懈的科学精神 | 直到去世的前一天 | 从不间断
- 竺可桢生病时也喜欢写字 ~misread
- 日记本快用完了 ~unsaid
?2 竺可桢和别人合写通俗的小书，说明了什么？ | What does the popular book show?
≈ 他重视把科学知识普及给大众 | 让更多人了解物候学 | 他还和别人合写了一本通俗的小书
- 他觉得自己的论文不好 ~misread
- 他想靠写书赚钱 ~unsaid
?2 结尾引用竺可桢的话，有什么作用？ | What does his saying at the end do?
≈ 点明坚持记录和发现规律的关系，揭示了全文的道理 | 只有坚持记录，才能从平常的现象里看出规律 | 从不间断
- 说明竺可桢不爱说话 ~unsaid
- 劝人们每天写作文 ~misread

# 挤奶姑娘不出天花
两百多年前，天花是一种可怕的传染病，得了的人很多会死去，活下来的人脸上也会留下疤痕。
英国乡村医生琴纳注意到一件怪事：挤奶的姑娘很少得天花。他了解到，这些姑娘常常从牛身上染上一种很轻的病，叫牛痘，手上起几个小疱，很快就好了。
琴纳想：会不会是得过牛痘的人，就不再得天花了？他观察、记录了许多年，越来越相信这一点。
一七九六年，他从一位得了牛痘的挤奶姑娘手上取了一点痘浆，种在一个男孩的胳膊上。男孩出了几个小疱，几天就好了。几个星期以后，琴纳又给男孩接种天花的痘浆，男孩没有得天花。
琴纳把这种方法叫作“种牛痘”。后来，种牛痘在世界各地推广。一九八〇年，世界卫生组织宣布，天花已经在全世界被消灭。
?1 琴纳是从什么现象得到启发的？ | What set Jenner thinking?
= 挤奶的姑娘很少得天花 | 挤奶的姑娘很少得天花
- 牛从来不生病 ~unsaid
- 男孩们都不怕天花 ~unsaid
?1 琴纳的实验分哪两步？ | What were the two steps of his trial?
≈ 先给男孩种牛痘，几个星期后再接种天花，看他会不会得病 | 种在一个男孩的胳膊上 | 琴纳又给男孩接种天花的痘浆
- 先让男孩得天花，再给他治好 ~opposite
- 只种了牛痘，没有再检验 ~part
?1 “一九八〇年……天花已经在全世界被消灭”说明了什么？ | What does 1980 show?
≈ 种牛痘的方法有效，最终战胜了天花 | 种牛痘在世界各地推广 | 天花已经在全世界被消灭
- 一九八〇年天花又出现了 ~opposite
- 牛痘也被消灭了 ~unsaid
?2 琴纳从发现现象到做实验，经过了怎样的过程？ | What path did he take from fact to trial?
≈ 观察现象，提出猜想，长期记录，最后用实验验证 | 琴纳注意到一件怪事 | 会不会是得过牛痘的人，就不再得天花了 | 他观察、记录了许多年 | 一七九六年
- 先做实验，再去观察 ~wrongorder
- 听别人说了就直接推广 ~unsaid
?2 琴纳是乡村医生，却有了重大发现，这说明了什么？ | What does a country doctor's discovery show?
≈ 科学发现不一定在大实验室里，只要留心生活、勤于思考就可能有收获 | 英国乡村医生琴纳注意到一件怪事 | 他观察、记录了许多年
- 乡村医生比城里医生高明 ~broad
- 琴纳的发现全靠运气 ~misread
?2 琴纳“观察、记录了许多年”才动手实验，体现了怎样的态度？ | What attitude do the years of notes show?
≈ 慎重严谨，有了充分的依据才去验证 | 他观察、记录了许多年，越来越相信这一点
% 琴纳有了猜想并没有马上去试，而是花了许多年观察、记录，等证据越来越多，才做实验。这说明他对待科学，尤其是关系到人的生命的事，十分慎重。 | Having his guess, Jenner did not rush to test it but spent years observing and noting until the evidence grew. It shows great care with science, above all where life is at stake.
- 他做事拖拉 ~misread
- 他不相信自己的猜想 ~opposite
`;
