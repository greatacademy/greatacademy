// The texts of the first reading topics of grade 3 (docs/chinese-curriculum.md §18.9): fairy tales and poems written for
// this subject, and fables retold from old tales in the public domain. The format is that of parsePieces in
// topic-kit.ts: a question's wrong options carry the reason they are wrong.

/** FAIRY_TALES_3 are the fairy tales of reading-3-fairy-tales, written for the subject. */
export const FAIRY_TALES_3 = `
# 小刺猬的礼物
秋天到了，小刺猬在树林里捡了很多红红的果子，背在身上的刺上，高高兴兴地往家走。路上，他看见小松鼠坐在树下哭。原来小松鼠的家被大风吹坏了，存的果子全掉进了河里。小刺猬想了想，把背上的果子一个一个摘下来，送给了小松鼠。小松鼠擦干眼泪，笑了。小刺猬背上空空的，心里却满满的，他觉得这是最快乐的一天。
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 小刺猬把自己捡的果子送给了伤心的小松鼠 | 把背上的果子一个一个摘下来，送给了小松鼠
- 小刺猬在树林里捡了很多果子 ~onepart
- 小松鼠的家被大风吹坏了 ~detail
?1 下面哪一句按顺序讲清了故事？ | Which retelling keeps the order of the story?
= 小刺猬捡果子回家，路上遇到哭着的小松鼠，就把果子送给了它 | 路上，他看见小松鼠坐在树下哭
- 小刺猬把果子送给小松鼠，然后去树林里捡果子 ~order
- 小松鼠送给小刺猬果子，小刺猬笑了 ~who
?1 小松鼠为什么哭？ | Why was the squirrel crying?
= 家被大风吹坏了，存的果子掉进了河里 | 原来小松鼠的家被大风吹坏了，存的果子全掉进了河里
- 它找不到小刺猬了 ~unsaid
- 它的果子被小刺猬拿走了 ~unsaid
?2 小刺猬往家走的时候，心情怎么样？ | How did the hedgehog feel on his way home?
= 很高兴 | 高高兴兴地往家走
- 很伤心 ~opposite
- 很害怕 ~unsaid
?2 小松鼠收到果子以后，心情有什么变化？ | How did the squirrel's feelings change once it had the fruit?
= 从伤心变得高兴了 | 小松鼠擦干眼泪，笑了 | 小松鼠坐在树下哭
- 从高兴变得伤心了 ~opposite
- 一直很伤心 ~opposite
?2 “背上空空的，心里却满满的”，说明小刺猬心里怎么样？ | What does "his back empty, his heart full" show about the hedgehog?
≈ 帮助了别人，心里很快乐 | 他觉得这是最快乐的一天 | 把背上的果子一个一个摘下来，送给了小松鼠 | 小刺猬背上空空的，心里却满满的
- 果子没有了，心里很难过 ~opposite
- 背着果子太累了 ~unsaid

# 不想长大的小树
山坡上有一棵小树，他总是说：“我才不要长大呢，长大了要挡风，还要被鸟儿踩，多麻烦呀！”一年夏天，下了一场大雨，山坡上的泥土一块一块往下滑。旁边的大树伸开长长的根，紧紧抓住泥土，护住了山下的小屋。小树看呆了，他小声说：“原来长大了能做这么多事。”从那以后，小树天天喝足雨水，晒足太阳，努力地往上长。
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 小树看到大树护住了小屋，从不想长大变得努力长大 | 从那以后，小树天天喝足雨水，晒足太阳，努力地往上长
- 山坡上下了一场大雨 ~detail
- 小树一直不想长大 ~reversed
?1 大雨来的时候，大树做了什么？ | What did the big tree do in the rain?
= 用根抓住泥土，护住了山下的小屋 | 旁边的大树伸开长长的根，紧紧抓住泥土，护住了山下的小屋
- 把小树挡在身后 ~unsaid
- 被雨水冲倒了 ~opposite
?1 故事的结果是什么？ | How does the story end?
= 小树努力地往上长 | 小树天天喝足雨水，晒足太阳，努力地往上长
- 小树还是不想长大 ~opposite
- 小树搬到了山下 ~unsaid
?2 开头小树说“多麻烦呀”，说明他觉得长大怎么样？ | When the tree says "what a bother", how does it feel about growing up?
≈ 不愿意，觉得长大很麻烦 | 我才不要长大呢 | 长大了要挡风，还要被鸟儿踩，多麻烦呀
- 很想快点长大 ~opposite
- 长大了很好玩 ~opposite
?2 看到大树护住小屋，小树的心情怎么样？ | How did the little tree feel watching the big tree save the house?
≈ 很吃惊，也很佩服 | 小树看呆了 | 原来长大了能做这么多事
- 很生气 ~unsaid
- 一点儿也不在意 ~opposite
?2 “小树天天喝足雨水，晒足太阳”，表现了小树怎样的心情？ | What does "drinking its fill of rain and sun every day" show?
≈ 他盼着快点长大 | 努力地往上长 | 原来长大了能做这么多事
- 他怕长大 ~opposite
- 他觉得太阳太热 ~unsaid

# 云朵的旅行
一朵白云想去看看大海。她飘过高高的山，山上的小草说：“白云姐姐，给我们一点雨吧！”白云下了一阵小雨，草儿绿了。她飘过干干的田野，农民伯伯抬头望着天，白云又下了一阵雨，小苗挺直了腰。等飘到大海上空的时候，白云已经变得又小又薄了。可她一点也不后悔，她说：“我把雨送给了需要它的地方，这比看大海还开心。”
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 白云去看大海的路上，把雨送给了需要的地方 | 我把雨送给了需要它的地方
- 白云飘过了高高的山 ~onepart
- 白云看到了蓝蓝的大海 ~never
?1 白云先飘过哪里？ | Where did the cloud float first?
= 高高的山 | 她飘过高高的山
- 干干的田野 ~other
- 大海 ~other
?1 白云飘到大海上空时，变成了什么样？ | What was the cloud like by the time it reached the sea?
= 又小又薄 | 白云已经变得又小又薄了
- 又大又厚 ~opposite
- 变成了黑云 ~unsaid
?2 小草求白云给点雨时，心里怎么想？ | What was on the grass's mind when it asked for rain?
≈ 盼着能下雨 | 白云姐姐，给我们一点雨吧 | 白云下了一阵小雨，草儿绿了
- 怕下雨 ~opposite
- 想去看大海 ~who
?2 变小以后，白云后悔吗？ | Did the cloud regret growing smaller?
= 不后悔，她很开心 | 可她一点也不后悔
- 很后悔 ~opposite
- 很生气 ~unsaid
?2 白云为什么觉得开心？ | Why was the cloud happy?
= 她把雨送给了需要它的地方 | 我把雨送给了需要它的地方
- 她终于看到了大海 ~unsaid
- 她变得又小又薄 ~other

# 爱生气的小青蛙
小青蛙住在池塘边，他有个毛病，一点小事就生气，一生气肚子就鼓得圆圆的。小鸭子不小心溅了他一身水，他鼓起肚子；小鱼游过来想跟他玩，他也鼓起肚子。慢慢地，没有人愿意来找他了。小青蛙一个人坐在荷叶上，觉得好孤单。老乌龟慢慢爬过来，对他说：“生气的时候，先数到十，再说话。”小青蛙照着做了，后来他的朋友越来越多。
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 爱生气的小青蛙学会了不乱生气，交到了朋友 | 后来他的朋友越来越多
- 小鸭子溅了小青蛙一身水 ~detail
- 小青蛙一直没有朋友 ~reversed
?1 为什么慢慢地没有人来找小青蛙了？ | Why did nobody come to see the frog any more?
= 他一点小事就生气 | 一点小事就生气
- 他搬到别的池塘去了 ~unsaid
- 他总是睡觉 ~unsaid
?1 老乌龟教了小青蛙什么办法？ | What did the old turtle teach the frog?
= 生气的时候先数到十，再说话 | 生气的时候，先数到十，再说话
- 生气的时候跳进水里 ~unsaid
- 生气的时候鼓起肚子 ~opposite
?2 一个人坐在荷叶上时，小青蛙心情怎么样？ | How did the frog feel alone on the lily pad?
= 很孤单 | 觉得好孤单
- 很开心 ~opposite
- 很得意 ~opposite
?2 小青蛙“鼓起肚子”的时候，他心里怎么样？ | How did the frog feel when he puffed up his belly?
= 在生气 | 一生气肚子就鼓得圆圆的
- 很高兴 ~opposite
- 吃得太饱了 ~life
?2 朋友越来越多的时候，小青蛙会是什么心情？ | How would the frog feel with more and more friends?
≈ 不再孤单，很快乐 | 后来他的朋友越来越多 | 觉得好孤单
- 更孤单了 ~reversed
- 还是爱生气 ~opposite

# 月亮上的灯
小兔子晚上睡不着，问妈妈：“月亮那么亮，是谁在上面点了一盏灯吗？”妈妈笑着说：“你自己去问问月亮吧。”小兔子跳上最高的山，大声喊：“月亮，你的灯是谁点的？”月亮回答：“我自己不会发光，是太阳照在我身上，我才亮起来的。”小兔子明白了。回到家，他说：“原来月亮是借了太阳的光呀！”说完，他放心地睡着了。
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 小兔子去问月亮，知道了月亮的光是太阳照的 | 原来月亮是借了太阳的光呀
- 小兔子晚上睡不着 ~onepart
- 小兔子跳上了最高的山 ~detail
?1 小兔子是在哪里问月亮的？ | Where did the rabbit ask the moon?
= 最高的山上 | 小兔子跳上最高的山
- 家门口 ~unsaid
- 河边 ~unsaid
?1 月亮为什么会亮？ | Why does the moon shine?
= 太阳照在它身上 | 是太阳照在我身上，我才亮起来的
- 有人在上面点了灯 ~opposite
- 它自己会发光 ~opposite
?2 小兔子问妈妈时，心里怎么样？ | How did the rabbit feel when he asked his mother?
≈ 很好奇，想知道答案 | 是谁在上面点了一盏灯吗 | 小兔子晚上睡不着
- 很害怕月亮 ~unsaid
- 很生气 ~unsaid
?2 小兔子在山上“大声喊”，说明他怎么样？ | What does his shouting on the mountain show?
≈ 他很想弄明白 | 大声喊 | 小兔子跳上最高的山 | 月亮，你的灯是谁点的
- 他很生月亮的气 ~unsaid
- 他迷路了 ~unsaid
?2 最后小兔子为什么能放心地睡着？ | Why could the rabbit fall asleep at ease?
≈ 他弄明白了月亮为什么亮 | 小兔子明白了 | 原来月亮是借了太阳的光呀 | 说完，他放心地睡着了
- 妈妈给他点了一盏灯 ~unsaid
- 他跑累了 ~life

# 小水桶
井边有两只水桶，一只新，一只旧。新水桶看着旧水桶身上的裂缝，笑着说：“你每次打水，走到家就漏掉一半，真没用！”旧水桶听了，难过地低下头。主人听见了，带它们走了一遍回家的路。路的一边光秃秃的，另一边却开满了小花。主人说：“这一边的花，都是旧水桶漏下的水浇大的。”新水桶红了脸，旧水桶第一次觉得自己也很有用。
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 新水桶笑旧水桶漏水，主人让它们知道漏下的水浇开了花 | 这一边的花，都是旧水桶漏下的水浇大的
- 井边有两只水桶 ~detail
- 旧水桶身上有裂缝 ~onepart
?1 路的两边有什么不同？ | How do the two sides of the path differ?
= 一边光秃秃的，一边开满了小花 | 路的一边光秃秃的，另一边却开满了小花
- 两边都开满了小花 ~part
- 两边都光秃秃的 ~part
?1 是谁带水桶走了一遍回家的路？ | Who took the buckets along the path home?
= 主人 | 主人听见了，带它们走了一遍回家的路
- 新水桶 ~who
- 旧水桶 ~who
?2 新水桶说“真没用”时，旧水桶心情怎么样？ | How did the old bucket feel when the new one said "how useless"?
= 很难过 | 旧水桶听了，难过地低下头
- 很得意 ~opposite
- 很生气 ~unsaid
?2 “新水桶红了脸”，说明它心里怎么样？ | What does "the new bucket blushed" show?
≈ 觉得不好意思了 | 新水桶红了脸 | 你每次打水，走到家就漏掉一半，真没用 | 这一边的花，都是旧水桶漏下的水浇大的
- 被太阳晒红了 ~life
- 很高兴 ~unsaid
?2 最后，旧水桶的心情有什么变化？ | How did the old bucket's feelings change in the end?
= 从难过变成觉得自己有用 | 旧水桶第一次觉得自己也很有用 | 旧水桶听了，难过地低下头
- 从高兴变得难过 ~opposite
- 一直觉得自己没用 ~opposite

# 风筝和线
一只风筝在天上飞，越飞越高。她低头看看牵着她的线，不高兴地说：“都是你拉着我，要不然我能飞到云上去！”线听了，轻轻地松开了手。风筝高兴极了，可是没过一会儿，她就在风里打起转来，一头栽进了树枝里。风筝挂在树上，又冷又怕。她这才明白，是线让她飞得又高又稳。小主人把她取下来，重新系好了线，风筝又稳稳地飞上了天。
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 风筝嫌线拉着她，离开线以后掉了下来，才明白线的好处 | 是线让她飞得又高又稳
- 风筝在天上越飞越高 ~detail
- 风筝离开线以后飞到了云上 ~reversed
?1 线松开以后，风筝怎么样了？ | What happened to the kite once the string let go?
= 在风里打转，栽进了树枝里 | 她就在风里打起转来，一头栽进了树枝里
- 飞到了云上 ~opposite
- 稳稳地落在了地上 ~unsaid
?1 最后风筝是怎样又飞上天的？ | How did the kite fly again in the end?
= 小主人把她取下来，重新系好了线 | 小主人把她取下来，重新系好了线
- 风把她吹了起来 ~unsaid
- 她自己飞了起来 ~unsaid
?2 风筝说“都是你拉着我”时，心情怎么样？ | How did the kite feel when she said "it's all because you hold me"?
= 不高兴，嫌线拉着她 | 不高兴地说
- 很感谢线 ~opposite
- 很害怕 ~other
?2 线松开时，风筝的心情怎么样？ | How did the kite feel when the string let go?
= 高兴极了 | 风筝高兴极了
- 很伤心 ~opposite
- 很害怕 ~other
?2 挂在树上时，风筝心情怎么样？ | How did the kite feel caught in the tree?
= 又冷又怕 | 风筝挂在树上，又冷又怕
- 高兴极了 ~other
- 很得意 ~opposite

# 会唱歌的石头
小河边有一块灰灰的石头，他很羡慕河里的小鱼会唱歌，也很羡慕树上的小鸟会唱歌。“我又笨又重，什么也不会。”他常常这样叹气。有一天，河水涨起来，从他身上流过，发出“叮咚、叮咚”的声音。小鱼游过来说：“石头哥哥，你唱得真好听！”石头愣住了，原来他也能唱歌。从那以后，他天天和河水一起唱，再也不叹气了。
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 以为自己什么也不会的石头，发现自己也能和河水一起唱歌 | 原来他也能唱歌
- 小鸟在树上唱歌 ~never
- 石头常常叹气 ~reversed
?1 石头是怎样“唱歌”的？ | How did the stone "sing"?
= 河水从他身上流过，发出叮咚的声音 | 河水涨起来，从他身上流过，发出“叮咚、叮咚”的声音
- 他自己张开嘴唱 ~unsaid
- 小鱼教会了他 ~unsaid
?1 是谁先说石头唱得好听？ | Who first said the stone sang well?
= 小鱼 | 小鱼游过来说
- 小鸟 ~who
- 河水 ~who
?2 开头，石头为什么常常叹气？ | Why did the stone often sigh at first?
= 他羡慕别人，觉得自己什么也不会 | 我又笨又重，什么也不会 | 他很羡慕河里的小鱼会唱歌
- 他被河水冲走了 ~unsaid
- 他不喜欢小鱼 ~unsaid
?2 “石头愣住了”，说明他心里怎么样？ | What does "the stone was stunned" show?
≈ 很吃惊，没想到自己能唱歌 | 石头愣住了，原来他也能唱歌 | 我又笨又重，什么也不会
- 很生气 ~unsaid
- 很伤心 ~opposite
?2 从那以后，石头的心情怎么样？ | How did the stone feel from then on?
≈ 很快乐，不再叹气 | 再也不叹气了 | 他天天和河水一起唱
- 还是常常叹气 ~opposite
- 更羡慕小鸟了 ~opposite

# 小蜗牛的家
小蜗牛总觉得背上的壳太重了，他对妈妈说：“我想把壳放下，像毛毛虫一样轻轻松松地爬。”妈妈说：“你试试吧。”小蜗牛爬出了壳，觉得身子轻多了。可是太阳一出来，他的身子就被晒得干干的；一只小鸟飞过，他吓得不知往哪儿躲。小蜗牛急忙爬回壳里，长长地出了一口气：“还是有壳好，它是我随身带着的家呀！”
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 小蜗牛嫌壳重，离开壳以后才知道壳是他的家 | 还是有壳好，它是我随身带着的家呀
- 小蜗牛想像毛毛虫一样爬 ~onepart
- 一只小鸟飞了过去 ~detail
?1 爬出壳以后，小蜗牛遇到了什么事？ | What happened to the snail out of its shell?
= 被太阳晒干，看见小鸟吓得没处躲 | 他的身子就被晒得干干的
- 和毛毛虫做了朋友 ~unsaid
- 找到了一个新家 ~unsaid
?1 小蜗牛为什么想放下壳？ | Why did the snail want to put down its shell?
= 他觉得壳太重了 | 小蜗牛总觉得背上的壳太重了
- 他的壳坏了 ~unsaid
- 妈妈叫他放下 ~who
?2 刚爬出壳时，小蜗牛觉得怎么样？ | How did the snail feel just out of the shell?
= 身子轻多了，很轻松 | 觉得身子轻多了
- 又冷又怕 ~other
- 很后悔 ~other
?2 小鸟飞过时，小蜗牛心情怎么样？ | How did the snail feel when the bird flew past?
= 很害怕 | 他吓得不知往哪儿躲
- 很高兴 ~opposite
- 很好奇 ~unsaid
?2 小蜗牛“长长地出了一口气”，说明他怎么样？ | What does his long sigh show?
≈ 回到壳里，他放心了 | 长长地出了一口气 | 他吓得不知往哪儿躲 | 还是有壳好
- 他累得喘不过气 ~life
- 他很生妈妈的气 ~unsaid

# 种星星的小熊
小熊听说种下什么就能长出什么，就把妈妈给他的一颗亮晶晶的糖埋进土里，他想：“长出来的一定是星星。”他天天浇水，天天等。一个月过去了，土里什么也没长出来。小熊难过极了。这天晚上，妈妈带他来到院子里，原来他浇过水的地方长出了一片小草，小草上的露水在月光下一闪一闪的，真像满地的星星。小熊拍着手笑了。
?1 这个故事主要讲了什么？ | What is the story mainly about?
= 小熊想种出星星，最后看到小草上的露水像满地的星星 | 小草上的露水在月光下一闪一闪的，真像满地的星星
- 妈妈给了小熊一颗糖 ~detail
- 小熊种出了真的星星 ~never
?1 小熊种下了什么？ | What did the little bear plant?
= 一颗亮晶晶的糖 | 把妈妈给他的一颗亮晶晶的糖埋进土里
- 一颗星星 ~life
- 一棵小草 ~other
?1 一个月过去，土里怎么样了？ | What had come up after a month?
= 什么也没长出来 | 土里什么也没长出来
- 长出了星星 ~opposite
- 长出了一棵大树 ~unsaid
?2 小熊天天浇水、天天等，说明他心里怎么样？ | What does his daily watering and waiting show?
≈ 他盼着种出星星 | 长出来的一定是星星 | 他天天浇水，天天等
- 他不想种了 ~opposite
- 他很害怕 ~unsaid
?2 什么也没长出来，小熊心情怎么样？ | How did the bear feel when nothing grew?
= 难过极了 | 小熊难过极了
- 高兴极了 ~opposite
- 一点也不在意 ~opposite
?2 最后小熊为什么拍着手笑了？ | Why did the bear clap and laugh at the end?
≈ 他看到了像星星一样的露水 | 真像满地的星星 | 小熊拍着手笑了 | 长出来的一定是星星
- 他又得到了一颗糖 ~unsaid
- 妈妈给他摘了一颗星星 ~unsaid
`;

/** FABLES_3 are the fables of reading-3-fables, retold for the subject from old tales. */
export const FABLES_3 = `
# 自相矛盾
古时候，楚国有个卖矛和盾的人。他先举起盾，对大家说：“我的盾最坚固，什么东西都刺不穿它！”接着又举起矛说：“我的矛最快，什么东西都能刺穿！”一个人问他：“用你的矛去刺你的盾，会怎么样呢？”那个人张着嘴，一句话也答不上来。
?1 这个人卖的是什么？ | What was the man selling?
= 矛和盾 | 有个卖矛和盾的人
- 刀和剑 ~unsaid
- 弓和箭 ~unsaid
?1 他是怎样夸他的盾的？ | How did he praise his shield?
= 什么东西都刺不穿它 | 我的盾最坚固，什么东西都刺不穿它
- 什么东西都能刺穿 ~other
- 又轻又好看 ~unsaid
?1 有人问了他什么？ | What was he asked?
= 用你的矛去刺你的盾，会怎么样 | 用你的矛去刺你的盾，会怎么样呢
- 你的矛卖多少钱 ~unsaid
- 你的盾是从哪里来的 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 说话做事要前后一致，不能自己打自己的嘴巴 | 那个人张着嘴，一句话也答不上来 | 我的盾最坚固，什么东西都刺不穿它 | 我的矛最快，什么东西都能刺穿
- 盾要做得很坚固 ~detail
- 买东西要买最便宜的 ~never
?2 这个人错在哪里？ | Where did the man go wrong?
≈ 他前后说的话互相抵触 | 我的矛最快，什么东西都能刺穿 | 我的盾最坚固，什么东西都刺不穿它
- 他的矛不够快 ~never
- 他卖东西时声音太小 ~never
?2 他为什么答不上来？ | Why could he not answer?
≈ 不管怎么回答，他总有一句话是错的 | 一句话也答不上来 | 用你的矛去刺你的盾，会怎么样呢 | 我的盾最坚固，什么东西都刺不穿它
% 两句夸口放在一起就出了问题：如果矛刺穿了盾，“什么东西都刺不穿”的盾就说错了；如果矛刺不穿盾，“什么东西都能刺穿”的矛就说错了。不管怎么答，总有一句是错的，所以他答不上来。 | Put his two boasts together and the trouble shows: if the spear pierces the shield, the shield “nothing can pierce” was a lie; if it does not, the spear that “pierces anything” was. Either way one of his words is wrong, so he has no answer.
- 他没听清别人的话 ~never
- 他的盾被刺穿了 ~never

# 掩耳盗铃
从前有个人，看见别人家门上挂着一只大铃，很想把它偷走。可是铃一碰就会响，响了就会被人发现。他想了一个“好办法”：用手按住自己的耳朵，听不见响声，别人也就听不见了。他按住耳朵，伸手去摘铃。铃“丁零零”响了起来，主人跑出来，一下子就把他抓住了。
?1 这个人想偷什么？ | What did the man want to steal?
= 门上的铃 | 看见别人家门上挂着一只大铃
- 门上的锁 ~unsaid
- 家里的钱 ~unsaid
?1 他想出的“好办法”是什么？ | What was his "clever idea"?
= 按住自己的耳朵 | 用手按住自己的耳朵
- 把铃包起来 ~unsaid
- 等主人睡着了再去 ~unsaid
?1 最后怎么样了？ | What happened in the end?
= 铃响了，他被主人抓住了 | 主人跑出来，一下子就把他抓住了
- 他偷走了铃 ~opposite
- 铃一点声音也没有 ~opposite
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 自己骗自己，事实不会因此改变 | 铃“丁零零”响了起来 | 用手按住自己的耳朵，听不见响声，别人也就听不见了 | 一下子就把他抓住了
- 铃一碰就会响 ~detail
- 想要什么就要想办法拿到 ~reversed
?2 这个人错在哪里？ | Where did the man go wrong?
≈ 以为自己听不见，别人也就听不见 | 听不见响声，别人也就听不见了 | 主人跑出来，一下子就把他抓住了
- 他的耳朵不好 ~never
- 他去偷的时候天太亮 ~never
?2 他的办法为什么没有用？ | Why did his trick fail?
≈ 他按住的是自己的耳朵，铃声还是会被别人听见 | 主人跑出来 | 用手按住自己的耳朵 | 铃“丁零零”响了起来
- 铃太大了，拿不动 ~never
- 主人一直站在门口 ~never

# 南辕北辙
古时候，有个人要到南方的楚国去，可是赶着马车一直往北走。路人提醒他：“楚国在南边，你怎么往北走呢？”他说：“我的马跑得快！”路人说：“马再快，方向错了也到不了。”他又说：“我带的钱很多，我的车夫赶车的本领也很高！”说完，他催着马车继续往北跑。他的条件越好，离楚国就越远。
?1 这个人要到哪里去？ | Where was the man going?
= 南方的楚国 | 有个人要到南方的楚国去
- 北方的一个国家 ~opposite
- 他自己的家 ~unsaid
?1 他说了自己的哪些好条件？ | What advantages did he say he had?
= 马快，钱多，车夫本领高 | 我带的钱很多，我的车夫赶车的本领也很高 | 我的马跑得快
- 只有马跑得快 ~part
- 他认识去楚国的路 ~unsaid
?1 听了路人的提醒，他怎么做的？ | What did he do after the passer-by warned him?
= 继续往北跑 | 他催着马车继续往北跑
- 掉头往南走 ~opposite
- 停下来问路 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 做事先要看准方向，方向错了，条件越好离目标越远 | 他的条件越好，离楚国就越远 | 赶着马车一直往北走 | 马再快，方向错了也到不了
- 赶路要有一匹快马 ~detail
- 出门要多带一些钱 ~onepart
?2 这个人错在哪里？ | Where did the man go wrong?
≈ 方向错了还不肯改 | 他催着马车继续往北跑 | 楚国在南边，你怎么往北走呢
- 他的马跑得太慢 ~never
- 他带的钱不够 ~reversed
?2 路人的话说明了什么？ | What do the passer-by's words show?
≈ 方向错了，跑得再快也到不了 | 马再快，方向错了也到不了 | 他的条件越好，离楚国就越远
- 马快就能早点到 ~reversed
- 楚国离得很近 ~never

# 滥竽充数
古时候，齐宣王喜欢听吹竽，每次都要三百个人一起吹。有个南郭先生，根本不会吹竽，也混进了这支队伍。别人吹的时候，他就捧着竽，摇头晃脑，装出很会吹的样子。后来齐宣王死了，他的儿子当了国王。新国王也爱听吹竽，可他喜欢一个一个地听。南郭先生知道混不下去了，只好偷偷地逃走了。
?1 齐宣王喜欢怎样听吹竽？ | How did King Xuan like to hear the yu?
= 三百个人一起吹 | 每次都要三百个人一起吹
- 一个一个地听 ~other
- 只听南郭先生吹 ~unsaid
?1 南郭先生在队伍里怎样做？ | What did Mr Nanguo do in the band?
= 捧着竽装样子 | 装出很会吹的样子
- 认真地吹 ~opposite
- 教别人吹 ~unsaid
?1 南郭先生最后怎么样了？ | What became of Mr Nanguo?
= 偷偷地逃走了 | 只好偷偷地逃走了
- 当上了国王 ~unsaid
- 学会了吹竽 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 没有真本领，靠装是混不长久的 | 南郭先生知道混不下去了，只好偷偷地逃走了 | 根本不会吹竽 | 装出很会吹的样子
- 国王都喜欢听吹竽 ~detail
- 只要装得像，就能一直混下去 ~reversed
?2 南郭先生为什么混不下去了？ | Why could Mr Nanguo not get by any longer?
≈ 新国王一个一个地听，他不会吹就会被发现 | 可他喜欢一个一个地听 | 根本不会吹竽 | 别人吹的时候，他就捧着竽
- 新国王不喜欢听吹竽 ~never
- 他的竽坏了 ~never
?2 南郭先生应该怎么做？ | What should Mr Nanguo have done?
≈ 认真学好真本领 | 根本不会吹竽 | 只好偷偷地逃走了
- 找一个更大的队伍混进去 ~reversed
- 吹得更响一点 ~never

# 杞人忧天
古时候，杞国有个人，整天担心天会掉下来，地会陷下去，自己没有地方躲。他愁得吃不下饭，睡不着觉。有个朋友去开导他：“天是一团气，到处都有，怎么会掉下来呢？地是一块块土，四面八方都是，怎么会陷呢？”这个人听了，放下心来，高兴地笑了。
?1 这个杞国人担心什么？ | What was the man of Qi afraid of?
= 天会掉下来，地会陷下去 | 整天担心天会掉下来，地会陷下去
- 家里没有饭吃 ~unsaid
- 朋友不理他 ~unsaid
?1 他担心得怎么样？ | How badly did he worry?
= 吃不下饭，睡不着觉 | 他愁得吃不下饭，睡不着觉
- 天天出去玩 ~opposite
- 只是有一点担心 ~part
?1 朋友是怎样开导他的？ | How did his friend reason with him?
= 天是一团气，地是一块块土，不会掉下来，也不会陷下去 | 天是一团气，到处都有，怎么会掉下来呢 | 地是一块块土，四面八方都是，怎么会陷呢
- 叫他搬到别的地方去 ~unsaid
- 送给他一间房子 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 不要为没有根据的事白白担心 | 这个人听了，放下心来，高兴地笑了 | 整天担心天会掉下来，地会陷下去 | 天是一团气，到处都有，怎么会掉下来呢
- 杞国有个人 ~detail
- 天真的会塌下来 ~reversed
?2 这个人错在哪里？ | Where did the man go wrong?
≈ 他为不会发生的事整天发愁 | 整天担心天会掉下来 | 他愁得吃不下饭，睡不着觉 | 怎么会掉下来呢
- 他吃得太少 ~never
- 他不愿意交朋友 ~never
?2 朋友的话起了什么作用？ | What did the friend's words do?
≈ 让他明白担心是多余的，放下心来 | 这个人听了，放下心来 | 天是一团气，到处都有，怎么会掉下来呢
- 让他更担心了 ~reversed
- 让他搬了家 ~never

# 郑人买履
郑国有个人想买一双新鞋。他在家先用绳子量好自己脚的大小，可是出门时忘了带。到了集市，他拿起鞋子才发现量好的绳子没带，就说：“我忘了带尺码！”他跑回家去拿，等他再赶回来，集市已经散了，鞋子没有买成。有人问他：“你为什么不用自己的脚试一试呢？”他说：“我宁可相信量好的尺码，也不相信自己的脚。”
?1 他是怎样量脚的大小的？ | How did he measure his foot?
= 用绳子量 | 他在家先用绳子量好自己脚的大小
- 用尺子量 ~unsaid
- 请别人帮他量 ~unsaid
?1 到了集市，他发现了什么？ | What did he find at the market?
= 量好的绳子没带 | 量好的绳子没带
- 鞋子都卖完了 ~unsaid
- 钱忘了带 ~unsaid
?1 最后他买到鞋子了吗？ | Did he buy the shoes in the end?
= 没有，集市已经散了 | 集市已经散了，鞋子没有买成
- 买到了一双新鞋 ~opposite
- 买到了一双旧鞋 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 做事要看实际，不能死守老办法 | 我宁可相信量好的尺码，也不相信自己的脚 | 等他再赶回来，集市已经散了，鞋子没有买成
- 买鞋要先量好脚 ~onepart
- 出门不能忘带东西 ~detail
?2 这个人错在哪里？ | Where did the man go wrong?
= 他只信量好的尺码，不信自己的脚 | 我宁可相信量好的尺码，也不相信自己的脚
- 他走路太慢 ~never
- 他家离集市太远 ~never
?2 他本来可以怎样做？ | What could he have done instead?
= 用自己的脚试一试 | 你为什么不用自己的脚试一试呢
- 再跑回家拿一次绳子 ~reversed
- 明天再来买 ~never

# 叶公好龙
古时候有个叶公，说自己最喜欢龙。他家的墙上画着龙，柱子上刻着龙，衣服上也画着龙。天上的真龙知道了，很受感动，就飞到叶公家来，把头伸进窗户里看他。叶公一看见真龙，吓得脸色发白，转身就跑。原来，叶公喜欢的只是画上的龙，并不是真的龙。
?1 叶公家里哪些地方有龙？ | Where in Lord Ye's house were dragons?
= 墙上、柱子上和衣服上 | 他家的墙上画着龙，柱子上刻着龙，衣服上也画着龙
- 只有墙上 ~part
- 院子里养着一条龙 ~unsaid
?1 真龙为什么来叶公家？ | Why did the real dragon come?
≈ 它听说叶公喜欢龙，很受感动 | 天上的真龙知道了，很受感动 | 说自己最喜欢龙
- 它迷路了 ~unsaid
- 叶公请它来的 ~unsaid
?1 叶公看见真龙后怎么做？ | What did Lord Ye do when he saw the real dragon?
= 吓得转身就跑 | 吓得脸色发白，转身就跑
- 高兴地请它进屋 ~opposite
- 给它画了一张像 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 不能只是嘴上说喜欢，心里并不是真的喜欢 | 叶公喜欢的只是画上的龙，并不是真的龙 | 说自己最喜欢龙 | 吓得脸色发白，转身就跑
- 龙会飞到人家里来 ~detail
- 叶公是真心喜欢龙的 ~reversed
?2 叶公错在哪里？ | Where did Lord Ye go wrong?
≈ 他说喜欢龙，其实只是喜欢龙的样子 | 原来，叶公喜欢的只是画上的龙 | 说自己最喜欢龙 | 他家的墙上画着龙
- 他画的龙不好看 ~never
- 他家的窗户太小 ~never
?2 叶公“转身就跑”说明了什么？ | What does his running away show?
≈ 他并不是真的喜欢龙 | 并不是真的龙 | 吓得脸色发白，转身就跑 | 说自己最喜欢龙
- 他想去找更多的画 ~never
- 他跑去请朋友来看龙 ~never

# 鹬蚌相争
一只河蚌张开壳，在河滩上晒太阳。一只鹬飞过来，伸出长嘴去啄蚌肉。河蚌急忙合上壳，紧紧夹住了鹬的嘴。鹬说：“今天不下雨，明天不下雨，你就会干死！”河蚌说：“今天不放你，明天不放你，你就会饿死！”它们谁也不让谁。这时，一个渔夫走过来，毫不费力地把它们一起捉走了。
?1 河蚌是怎样夹住鹬的？ | How did the clam catch the snipe?
= 急忙合上壳，夹住了鹬的嘴 | 河蚌急忙合上壳，紧紧夹住了鹬的嘴
- 用脚夹住了鹬 ~unsaid
- 把鹬拉进了水里 ~unsaid
?1 鹬对河蚌说了什么？ | What did the snipe say to the clam?
= 不下雨，你就会干死 | 今天不下雨，明天不下雨，你就会干死
- 不放我，我就会饿死 ~who
- 我们一起回家吧 ~unsaid
?1 最后谁得到了好处？ | Who gained in the end?
≈ 渔夫 | 一个渔夫走过来，毫不费力地把它们一起捉走了 | 它们谁也不让谁
- 鹬 ~opposite
- 河蚌 ~opposite
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 双方互不相让，结果让别人得了好处 | 毫不费力地把它们一起捉走了 | 它们谁也不让谁
- 河蚌喜欢晒太阳 ~detail
- 只要坚持到底就能赢 ~reversed
?2 鹬和河蚌错在哪里？ | Where did the snipe and the clam go wrong?
= 它们谁也不让谁 | 它们谁也不让谁
- 它们说话的声音太大 ~never
- 河蚌的壳不够硬 ~never
?2 渔夫为什么能“毫不费力”？ | Why was it so easy for the fisherman?
≈ 鹬和河蚌争个不停，谁也走不了 | 它们谁也不让谁 | 紧紧夹住了鹬的嘴
- 渔夫带了很大的网 ~never
- 鹬和河蚌自己跳进了篮子 ~never

# 惊弓之鸟
古时候，有个叫更羸的射箭能手。一天，一只大雁从天上飞过，更羸对魏王说：“我不用箭，只拉一下弓，就能让它掉下来。”他拉开弓，大雁果然掉了下来。魏王很奇怪。更羸说：“它飞得很慢，叫声也很悲惨，可见这只大雁受过箭伤，伤口还没好。它一听见弓弦响，就害怕得拼命往高处飞，伤口裂开，就掉下来了。”
?1 更羸是怎样让大雁掉下来的？ | How did Geng Lei bring the goose down?
= 不用箭，只拉了一下弓 | 我不用箭，只拉一下弓
- 射了一支箭 ~opposite
- 扔了一块石头 ~unsaid
?1 更羸从哪里看出大雁受过伤？ | How did Geng Lei tell the goose was hurt?
= 它飞得慢，叫声悲惨 | 它飞得很慢，叫声也很悲惨
- 它的羽毛是红的 ~unsaid
- 魏王告诉他的 ~who
?1 大雁为什么会掉下来？ | Why did the goose fall?
= 听见弓响，拼命往高处飞，伤口裂开了 | 伤口裂开，就掉下来了
- 被箭射中了 ~opposite
- 飞得太累了 ~life
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 仔细观察、认真分析，才能看清事情的原因 | 这只大雁受过箭伤，伤口还没好 | 它飞得很慢，叫声也很悲惨 | 它一听见弓弦响
- 大雁会从天上飞过 ~detail
- 射箭一定要用很多箭 ~never
?2 更羸为什么能做到这件事？ | Why could Geng Lei do it?
≈ 他仔细观察了大雁，知道它受过伤 | 这只大雁受过箭伤 | 它飞得很慢，叫声也很悲惨
- 他的弓特别大 ~never
- 他运气好 ~reversed
?2 魏王“很奇怪”，是因为什么？ | Why was the King of Wei puzzled?
≈ 没有用箭，大雁却掉了下来 | 大雁果然掉了下来 | 我不用箭，只拉一下弓
- 更羸不会射箭 ~never
- 大雁会说话 ~never

# 塞翁失马
从前，边塞上住着一位老人。有一天，他家的马跑丢了，邻居们来安慰他，他却说：“这不一定是坏事。”过了几个月，丢了的马自己回来了，还带回了一匹好马。邻居们来祝贺他，他又说：“这不一定是好事。”后来，他的儿子骑这匹好马，摔断了腿。邻居们又来安慰，他还是说：“这不一定是坏事。”不久打仗了，年轻人都要去当兵，他的儿子因为腿伤留在了家里，保住了性命。
?1 老人家的马跑丢后，邻居们做了什么？ | What did the neighbours do when the horse ran off?
= 来安慰他 | 邻居们来安慰他
- 来祝贺他 ~other
- 帮他去找马 ~unsaid
?1 跑丢的马回来时，带回了什么？ | What did the lost horse bring back?
= 一匹好马 | 还带回了一匹好马
- 一头牛 ~unsaid
- 老人的儿子 ~unsaid
?1 打仗时，老人的儿子为什么没去当兵？ | Why did his son not go to war?
= 他的腿摔伤了 | 他的儿子因为腿伤留在了家里
- 他年纪太小 ~unsaid
- 他骑马跑走了 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 好事和坏事在一定条件下会互相转变 | 他的儿子因为腿伤留在了家里，保住了性命 | 还带回了一匹好马 | 摔断了腿
- 骑马一定会摔断腿 ~never
- 丢了东西一定是坏事 ~reversed
?2 老人为什么总说“不一定”？ | Why did the old man always say "not necessarily"?
≈ 他明白事情还会变化，不能只看眼前 | 这不一定是坏事 | 这不一定是好事 | 保住了性命
- 他听不清邻居说的话 ~never
- 他不喜欢邻居 ~never
?2 儿子摔断腿后，结果怎么样？ | How did the son's broken leg turn out?
= 反而让他保住了性命 | 保住了性命 | 他的儿子因为腿伤留在了家里
- 让他再也不能回家 ~reversed
- 让他去当了兵 ~reversed
`;

/** POEMS_3 are the children's poems of reading-3-poems, written for the subject. */
export const POEMS_3 = `
# 春雨
春雨轻轻地下，
落在柳树上，柳枝绿了；
落在桃树上，桃花红了；
落在田野里，小苗长高了。
春雨说：“我没有颜色，
可我把颜色送给了大家。”
?1 春雨落在桃树上，桃树怎么样了？ | What became of the peach tree when the spring rain fell on it?
= 桃花红了 | 落在桃树上，桃花红了
- 柳枝绿了 ~other
- 小苗长高了 ~other
?1 诗里写了春雨落在哪些地方？ | Where does the rain fall in the poem?
= 柳树上、桃树上和田野里 | 落在柳树上，柳枝绿了 | 落在桃树上，桃花红了 | 落在田野里，小苗长高了
- 只落在柳树上 ~part
- 落在屋顶上和小河里 ~unsaid
?1 读这首诗，眼前是一幅怎样的画面？ | What picture does the poem bring to mind?
≈ 春雨中，柳绿花红，小苗长高 | 落在柳树上，柳枝绿了 | 落在桃树上，桃花红了 | 落在田野里，小苗长高了 | 春雨轻轻地下
- 大雪纷飞，到处白茫茫 ~unsaid
- 秋风吹落了满地黄叶 ~unsaid
?2 这首诗主要写了什么？ | What is the poem mainly about?
= 春雨让万物变得五颜六色 | 可我把颜色送给了大家
- 春雨落在柳树上 ~narrow
- 春雨下得很大很急 ~never
?2 “我没有颜色，可我把颜色送给了大家”是什么意思？ | What do the rain's words mean?
= 春雨自己没有颜色，却让万物有了颜色 | 我没有颜色
- 春雨想要很多颜色 ~reversed
- 春雨是红色的 ~never
?2 这首诗表达了怎样的感情？ | What feeling does the poem show?
= 对春雨的喜爱和赞美 | 可我把颜色送给了大家
- 对春雨的讨厌 ~reversed
- 对冬天的想念 ~never

# 秋天的信
秋风是邮递员，
送来一封封黄色的信。
信飞到小松鼠家，
小松鼠忙着把松果藏好；
信飞到大雁的窝里，
大雁排好队飞向南方。
信上写着：“冬天要来了，
大家快快准备好！”
?1 诗里“黄色的信”指的是什么？ | What are the "yellow letters" of the poem?
≈ 秋天的落叶 | 送来一封封黄色的信 | 秋风是邮递员 | 冬天要来了
% 诗题是“秋天的信”，送信的是秋风，信是黄色的，一封封飞来飞去。秋天里，被秋风吹得一片片飞的黄色东西是落叶，所以“黄色的信”指的是秋天的落叶；信上写着“冬天要来了”，正是落叶告诉大家的事。 | The poem is “Autumn's Letters”; the autumn wind brings them, they are yellow, and they fly about one by one. What is yellow and blown about by the autumn wind is fallen leaves, so the “yellow letters” are the leaves of autumn; and what they say, “winter is coming”, is what falling leaves tell everyone.
- 邮递员送的真信 ~life
- 小松鼠的松果 ~other
?1 收到信后，小松鼠做了什么？ | What did the squirrel do once it had a letter?
= 忙着把松果藏好 | 小松鼠忙着把松果藏好
- 排好队飞向南方 ~who
- 给秋风写了回信 ~unsaid
?1 大雁收到信后怎么做？ | What did the wild geese do with the letter?
= 排好队飞向南方 | 大雁排好队飞向南方
- 把松果藏好 ~who
- 留在窝里过冬 ~opposite
?2 这首诗主要写了什么？ | What is the poem mainly about?
= 秋天到了，动物们忙着准备过冬 | 大家快快准备好
- 小松鼠藏松果 ~narrow
- 冬天的大雪 ~never
?2 秋风送来的“信”告诉大家什么？ | What do the autumn wind's "letters" tell?
= 冬天要来了，快做准备 | 冬天要来了
- 春天要来了 ~reversed
- 邮递员要放假了 ~never
?2 把秋风写成邮递员，让诗读起来怎么样？ | What does making the wind a postman do for the poem?
= 生动有趣，好像秋风也是一个人 | 秋风是邮递员
- 秋风真的会送信 ~life
- 让诗变得很难懂 ~never

# 小河
小河弯弯，
走过青青的山脚，
穿过金黄的稻田，
流过村口的小桥。
它一路唱着歌，
从不停下脚步，
因为大海
在远方等着它。
?1 小河流过了哪些地方？ | Where does the stream flow?
= 山脚、稻田和小桥 | 走过青青的山脚 | 穿过金黄的稻田 | 流过村口的小桥
- 只流过了稻田 ~part
- 城市和高楼 ~unsaid
?1 诗里的稻田是什么颜色？ | What colour are the rice fields?
= 金黄 | 穿过金黄的稻田
- 青青 ~other
- 雪白 ~unsaid
?1 小河一路上在做什么？ | What does the stream do along the way?
= 唱着歌，不停地流 | 它一路唱着歌 | 从不停下脚步
- 停下来休息 ~opposite
- 往山上流 ~unsaid
?2 这首诗主要写了什么？ | What is the poem mainly about?
= 小河不停地流向远方的大海 | 在远方等着它
- 小河绕过了山脚 ~narrow
- 大海里有很多鱼 ~never
?2 小河为什么从不停下脚步？ | Why does the stream never stop?
= 大海在远方等着它 | 因为大海
- 它被山追着跑 ~never
- 它不喜欢村口的小桥 ~never
?2 这首诗让我们感受到小河怎样的样子？ | What sort of stream does the poem show?
= 快乐，一直向着目标前进 | 它一路唱着歌
- 很累，想停下来 ~reversed
- 很害怕大海 ~reversed

# 夜晚的路灯
天黑了，
路灯睁开了眼睛，
一个，两个，三个……
排成长长的队伍。
它们照着回家的人，
照着晚归的小猫，
一直站到天亮，
才悄悄地闭上眼睛。
?1 路灯什么时候“睁开眼睛”？ | When do the street lamps "open their eyes"?
= 天黑了 | 天黑了 | 路灯睁开了眼睛
- 天亮了 ~other
- 中午 ~unsaid
?1 路灯照着谁？ | What do the lamps shine on?
= 回家的人和晚归的小猫 | 它们照着回家的人 | 照着晚归的小猫
- 天上的星星 ~unsaid
- 只照着回家的人 ~part
?1 诗里的路灯是怎样排的？ | How do the lamps stand?
= 排成长长的队伍 | 排成长长的队伍
- 围成一个圆圈 ~unsaid
- 只有一盏 ~opposite
?2 这首诗主要写了什么？ | What is the poem mainly about?
= 路灯整夜为大家照亮回家的路 | 一直站到天亮
- 一只晚归的小猫 ~narrow
- 天亮以后的街道 ~never
?2 “悄悄地闭上眼睛”指的是什么？ | What does "quietly close their eyes" mean?
= 天亮了，路灯关了 | 才悄悄地闭上眼睛
- 路灯坏了 ~never
- 路灯睡着了，不再亮了一整夜 ~reversed
?2 诗人对路灯有怎样的感情？ | How does the poet feel about the lamps?
= 喜爱和感谢 | 它们照着回家的人
- 讨厌路灯太亮 ~reversed
- 害怕夜晚的路灯 ~never

# 下雪的早晨
推开窗，
哇，世界变白了！
屋顶戴上了白帽子，
大树穿上了白棉衣，
小路盖上了白被子。
我跑出门去，
在雪地上留下
一串小小的脚印。
?1 屋顶变成了什么样子？ | What do the roofs look like?
= 戴上了白帽子 | 屋顶戴上了白帽子
- 穿上了白棉衣 ~other
- 盖上了白被子 ~other
?1 “小路盖上了白被子”，写的是什么？ | What does "the path has a white carpet" describe?
≈ 小路上积满了雪 | 小路盖上了白被子 | 世界变白了 | 下雪的早晨
- 有人在路上放了被子 ~life
- 小路上开满了白花 ~unsaid
?1 “我”跑出门后做了什么？ | What did "I" do on running out?
= 在雪地上留下一串脚印 | 在雪地上留下 | 一串小小的脚印
- 堆了一个雪人 ~unsaid
- 回到屋里睡觉 ~unsaid
?2 这首诗主要写了什么？ | What is the poem mainly about?
= 下雪的早晨，到处变白了，“我”很高兴 | 哇，世界变白了
- 屋顶上有雪 ~narrow
- 雪化了，小路很湿 ~never
?2 “哇，世界变白了！”表达了“我”怎样的心情？ | What feeling does "Wow, the world has turned white!" show?
= 惊喜 | 哇，世界变白了
- 难过 ~reversed
- 害怕 ~never
?2 诗里把屋顶、大树、小路写得像人一样穿戴，好在哪里？ | Why write the roofs, trees and paths as if dressed?
= 让雪后的景色更生动、更可爱 | 大树穿上了白棉衣
- 告诉我们大树怕冷 ~life
- 说明下雪很危险 ~never

# 我是一片叶子
我是一片叶子，
春天，我是嫩嫩的绿；
夏天，我为大家撑起绿伞；
秋天，我换上黄衣服，
飘呀飘，落到树妈妈的脚下。
我变成泥土，
明年春天，
又会回到枝头。
?1 夏天叶子做了什么？ | What does the leaf do in summer?
= 为大家撑起绿伞 | 夏天，我为大家撑起绿伞
- 换上黄衣服 ~other
- 落到树妈妈的脚下 ~other
?1 秋天叶子是什么颜色？ | What colour is the leaf in autumn?
= 黄色 | 秋天，我换上黄衣服
- 嫩绿色 ~other
- 红色 ~unsaid
?1 叶子落下以后变成了什么？ | What does the leaf become once it falls?
= 泥土 | 我变成泥土
- 一只蝴蝶 ~unsaid
- 一把真的伞 ~life
?2 这首诗主要写了什么？ | What is the poem mainly about?
= 叶子在一年四季里的变化 | 春天，我是嫩嫩的绿
- 夏天叶子像一把伞 ~narrow
- 冬天下大雪 ~never
?2 “明年春天，又会回到枝头”是什么意思？ | What does "come back to the branch next spring" mean?
= 落叶变成养料，帮大树明年长出新叶 | 我变成泥土
- 同一片叶子会飞回树上 ~life
- 叶子永远不会再长 ~reversed
?2 诗里的叶子把树叫作“树妈妈”，表达了什么？ | What does calling the tree "Mother Tree" show?
= 叶子和大树像孩子和妈妈一样亲 | 落到树妈妈的脚下
- 叶子不喜欢大树 ~reversed
- 大树会说话 ~never

# 风在哪里
谁也没有看见过风，
可是风来了——
风车转起来了，
那是风在推它；
小旗飘起来了，
那是风在拉它；
湖水起了波纹，
那是风在跟它玩。
?1 风车为什么转起来了？ | Why does the windmill turn?
= 风在推它 | 那是风在推它
- 风在拉它 ~other
- 有人在用手转 ~unsaid
?1 “湖水起了波纹”，写的是什么？ | What does "wrinkles on the lake" describe?
≈ 风吹过，湖面起了小波纹 | 湖水起了波纹 | 那是风在跟它玩
- 湖水变老了 ~life
- 有人往湖里扔石头 ~unsaid
?1 诗里写了风让哪些东西动了起来？ | What does the wind set moving in the poem?
= 风车、小旗和湖水 | 风车转起来了 | 小旗飘起来了 | 湖水起了波纹
- 只有风车 ~part
- 大树和小草 ~unsaid
?2 这首诗主要写了什么？ | What is the poem mainly about?
= 看不见风，却能从东西的变化知道风来了 | 谁也没有看见过风
- 小旗在飘 ~narrow
- 风会把房子吹倒 ~never
?2 “谁也没有看见过风”，那我们怎样知道风来了？ | If no one has seen the wind, how do we know it has come?
= 看东西被风吹动的样子 | 谁也没有看见过风
- 用眼睛直接看到风 ~opposite
- 听天气预报 ~never
?2 诗里写风“跟湖水玩”，让人觉得风怎么样？ | What does the wind "playing with the lake" make it seem?
= 像一个调皮的孩子 | 那是风在跟它玩
- 很凶，很可怕 ~reversed
- 风真的会玩游戏 ~life

# 奶奶的扇子
夏天的夜晚，
奶奶摇着大扇子，
摇来一阵阵凉风，
摇来满天的星星，
也摇来一个个
好听的故事。
我在凉风里睡着了，
扇子还在轻轻地摇。
?1 奶奶在什么时候摇扇子？ | When does Grandmother wave her fan?
= 夏天的夜晚 | 夏天的夜晚
- 冬天的早上 ~unsaid
- 秋天的中午 ~unsaid
?1 诗里说扇子摇来了什么？ | What does the fan bring, the poem says?
= 凉风、星星和故事 | 摇来一阵阵凉风 | 摇来满天的星星 | 好听的故事
- 只有凉风 ~part
- 蚊子和雨点 ~unsaid
?1 “我”睡着以后，扇子怎么样？ | What does the fan do once "I" am asleep?
= 还在轻轻地摇 | 扇子还在轻轻地摇
- 停了下来 ~opposite
- 掉到了地上 ~unsaid
?2 这首诗主要写了什么？ | What is the poem mainly about?
= 夏夜里奶奶摇着扇子陪“我”入睡 | 我在凉风里睡着了
- 夏天的星星很多 ~narrow
- 奶奶买了一把新扇子 ~never
?2 “我”睡着了，扇子还在摇，说明了什么？ | What does the fan still waving after "I" fall asleep show?
= 奶奶一直在照顾“我” | 扇子还在轻轻地摇
- 奶奶忘了停下来 ~never
- 奶奶也睡着了 ~reversed
?2 这首诗表达了怎样的感情？ | What feeling does the poem show?
= 对奶奶的爱和想念 | 奶奶摇着大扇子
- 讨厌夏天太热 ~reversed
- 想快点长大 ~never

# 一颗种子
一颗种子睡在泥土里，
春雷响了，叫醒了它。
它伸伸腰，
探出小小的脑袋：
“外面的世界真亮啊！”
它喝着雨水，晒着太阳，
一天一天，
长成了一棵小苗。
?1 是什么叫醒了种子？ | What woke the seed?
= 春雷 | 春雷响了，叫醒了它
- 雨水 ~other
- 太阳 ~other
?1 种子探出脑袋后说了什么？ | What did the seed say when it peeped out?
= 外面的世界真亮啊 | 外面的世界真亮啊
- 泥土里真暖和啊 ~unsaid
- 我要回去睡觉 ~opposite
?1 种子靠什么长大？ | What does the seed grow by?
= 喝雨水，晒太阳 | 它喝着雨水，晒着太阳
- 吃小虫子 ~unsaid
- 只靠睡觉 ~unsaid
?2 这首诗主要写了什么？ | What is the poem mainly about?
= 一颗种子在春天醒来，长成小苗 | 长成了一棵小苗
- 春雷声音很大 ~narrow
- 秋天种子落进了泥土 ~never
?2 “外面的世界真亮啊！”表现了种子怎样的心情？ | What feeling does "How bright it is out here!" show?
= 新奇和高兴 | 外面的世界真亮啊
- 害怕和难过 ~reversed
- 生气 ~never
?2 “一天一天”说明了什么？ | What does "day after day" show?
= 种子是慢慢长大的 | 一天一天
- 种子一下子就长大了 ~reversed
- 种子不会长大 ~reversed

# 我想
我想把小手
安在桃树枝上，
带着一串小花，
在阳光里摇啊摇。
我想把小脚
接在柳树根上，
在春天的泥土里，
悄悄地长啊长。
?1 “我”想把小手安在哪里？ | Where would "I" like to fix my hands?
= 桃树枝上 | 安在桃树枝上
- 柳树根上 ~other
- 小河边上 ~unsaid
?1 “我”想把脚丫接在哪里？ | Where would "I" like to join my feet?
= 柳树根上 | 接在柳树根上
- 桃树枝上 ~other
- 小草中间 ~unsaid
?1 诗里写的是什么季节？ | What season is it in the poem?
= 春天 | 在春天的泥土里
- 冬天 ~unsaid
- 秋天 ~unsaid
?2 这首诗主要写了什么？ | What is the poem mainly about?
= “我”想象自己和春天的花草树木长在一起 | 我想把小手
- 桃树上有小花 ~narrow
- “我”在春天种了一棵树 ~never
?2 “我想”的这些事，是真的能做到的吗？ | Can the things "I" wish for really be done?
= 不能，是“我”的想象 | 我想
- 能，小手真的能安在树上 ~life
- 能，“我”已经做到了 ~reversed
?2 这首诗表达了“我”怎样的感情？ | What feeling does the poem show?
= 对春天的喜爱 | 在阳光里摇啊摇
- 害怕春天 ~reversed
- 想念冬天 ~never
`;
