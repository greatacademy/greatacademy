// Whole books of the native grades with questions written for this subject (docs/chinese-curriculum.md §9).

import type { BookData } from "./index.ts";

/** earlyBooks are the whole books of grades 3 to 6. */
export const earlyBooks: readonly BookData[] = [
  {
    id: "andersen",
    grade: 3,
    title: { en: "Andersen's Fairy Tales", zh: "安徒生童话" },
    author: { en: "Hans Christian Andersen", zh: "安徒生" },
    guide: {
      en: "Read one tale at a time, and after each one say in a sentence who it is about and what happens to them. Notice how toys, animals and flowers think and speak like people. Look for what each main character wants and what stands in the way. Many tales end sadly or strangely: ask yourself what the author wants you to feel and to think about.",
      zh: "一次读一个故事，读完用一句话说说它讲的是谁、遇到了什么事。留意玩具、动物和花草怎样像人一样想事情、说话。找一找每个主人公想要什么，又是什么在挡着他。很多故事的结尾让人难过或意想不到，问问自己：作者想让我们感受到什么、想到什么？",
    },
    callout: {
      en: "Many tales share names and shapes: a girl, a swan, a soldier. Before you choose, place the question in its own tale: the match girl's visions are not the little mermaid's, and the ugly duckling's winter is not the snow queen's.",
      zh: "很多故事里都有女孩、天鹅、士兵。选之前先想清楚问的是哪一个故事：卖火柴的小女孩看到的幻象不是小美人鱼的，丑小鸭的冬天也不是冰雪女王的冬天。",
    },
    questions: `
问：丑小鸭为什么总被大家欺负？
答：它长得又大又丑
据：《丑小鸭》开头：它是最后孵出来的，个子大，样子又难看，鸭子和小鸡都啄它、推它。 || “The Ugly Duckling”, its opening: hatched last, it is big and plain, and the ducks and hens peck it and push it about.
错：它不会游泳 || 它其实游得很好，鸭妈妈还因此认定它不是火鸡，被欺负不是因为这个。 || it swims well, which is how the mother duck knows it is no turkey; that is not why it is bullied.
错：它偷吃别人的东西 || 书里没有它偷东西的情节，它一直是被欺负的一方。 || it never steals anything in the tale; it is always the one wronged.
错：它总是大哭大闹 || 书里的它总是默默忍受、躲开，并不吵闹。 || it bears everything quietly and slips away; it never makes a scene.
验：换个角度看结尾：它变成天鹅后，别的天鹅都来亲它，说明它从来就不是“丑”，只是和鸭子长得不一样。 || Look at the end instead: once it is a swan the others come to stroke it, so it was never ugly, only unlike the ducks.

问：丑小鸭最后变成了什么？
答：一只美丽的天鹅
据：《丑小鸭》结尾：春天它飞到湖上，从水里的倒影看到自己已是一只美丽的天鹅。 || “The Ugly Duckling”, its end: in spring it flies to a lake and sees in the water that it has become a beautiful swan.
错：一只漂亮的鸭子 || 它一直被当成鸭子，结尾正是发现自己根本不是鸭子。 || it was taken for a duck all along; the end is that it is no duck at all.
错：一只雪白的鸽子 || 书里没有鸽子，它看到的是湖上的天鹅。 || there are no doves in the tale; what it sees on the lake are swans.
错：一只高大的鹅 || 鹅是农家院里的家禽，它变成的是能远飞的天鹅。 || a goose is a farmyard bird; it becomes a swan that flies far.
验：对照它秋天第一次看见天鹅南飞时的心情：那时它就说不出地喜欢它们，结尾它成了它们中的一员。 || Set it beside the autumn when it first sees swans fly south: it loved them without knowing why, and at the end it is one of them.

问：丑小鸭离家以后，在哪个季节过得最苦？
答：冬天
据：《丑小鸭》：它离家后挨过秋天，冬天冻在冰里差点死掉，被一个农夫救回家。 || “The Ugly Duckling”: after leaving home it lives through autumn, then in winter freezes into the ice and nearly dies, until a farmer carries it home.
错：春天 || 春天是它苦尽甘来、变成天鹅的季节。 || spring is when its hardship ends and it becomes a swan.
错：夏天 || 它是在夏天孵出来的，那时还在鸭妈妈身边。 || it hatches in summer, while it is still with its mother.
错：秋天 || 秋天它在沼泽边漂泊，第一次看见天鹅，苦还没到最重。 || in autumn it drifts by the marshes and first sees the swans; the worst is yet to come.
验：按季节顺序再走一遍：夏天出生，秋天离家，冬天最冷最苦，春天变成天鹅，冬天正是“苦尽”之前最低的地方。 || Run the seasons in order: born in summer, gone in autumn, at its lowest in winter, a swan in spring; winter is the low point just before the turn.

问：《丑小鸭》想告诉我们什么？
答：经历苦难不放弃，终会实现梦想
据：《丑小鸭》全篇：它受尽欺负和寒冷，却始终向往天鹅，最后成了天鹅。 || “The Ugly Duckling” as a whole: bullied and frozen, it never stops longing for the swans, and at last it is one.
错：长得丑的人不会幸福 || 结尾它不但幸福，还谦虚地说“我做梦也没想到会有这么多幸福”，并不是长得丑就不幸福。 || at the end it is happy, saying it never dreamed of such happiness; plainness is not what the tale condemns.
错：应该一直待在自己家里 || 它留在鸭场只会被欺负，离开家才找到了天鹅。 || staying in the duck yard brings only bullying; it finds the swans by leaving.
错：鸭子比天鹅更好 || 故事里鸭子是欺负它的一方，作者并不在比较鸭子和天鹅谁好。 || the ducks are the bullies, and the tale is not ranking ducks against swans.
验：换成主人公的经历来对：被欺负、被冻、险些被猎狗咬，它都没有放弃，正是“经历苦难不放弃”。 || Check it against what the duckling lives through: bullied, frozen, nearly caught by a hunting dog, it never gives up.

问：卖火柴的小女孩是在什么时候冻死的？
答：大年夜
据：《卖火柴的小女孩》：故事发生在一年的最后一夜，第二天新年早上人们看到她冻死在墙角。 || “The Little Match Girl”: it happens on the last night of the year, and on New Year's morning she is found frozen in a corner.
错：圣诞节的早上 || 她划火柴时看见过圣诞树，但那是幻象，日子是大年夜。 || she sees a Christmas tree in a match's light, but that is a vision; the night is New Year's Eve.
错：春天的夜里 || 故事里下着大雪，是寒冬，不是春天。 || snow is falling: it is deep winter, not spring.
错：她生日那天 || 书里没有提到她的生日。 || the tale never mentions her birthday.
验：对照结尾的时间：人们在“新年的太阳”升起时发现她，她死去的那一夜就是旧年的最后一夜。 || Check against the end: she is found as the New Year's sun rises, so she died on the last night of the old year.

问：小女孩为什么不敢回家？
答：没卖掉火柴，怕爸爸打她
据：《卖火柴的小女孩》：她一整天一根火柴也没卖掉，一个钱也没挣到，不敢回家，因为爸爸一定会打她。 || “The Little Match Girl”: she has sold no matches all day and earned nothing, so she dares not go home, for her father would beat her.
错：她找不到回家的路 || 她知道家在哪里，只是不敢回去。 || she knows where home is; she dares not go.
错：家里一个人也没有 || 家里有爸爸，而且家里也和外面一样冷。 || her father is at home, and home is as cold as the street.
错：她的鞋子丢了 || 她确实丢了妈妈的拖鞋，但那不是她不敢回家的原因。 || she did lose her mother's slippers, but that is not why she stays out.
验：从她家的样子再看：家里只有一个屋顶，风从缝里灌进来，回家既冷又要挨打，所以她宁愿坐在墙角。 || Look at her home instead: a roof with cracks the wind blows through, cold and a beating, so she would rather stay in the corner.

问：小女孩第一次划亮火柴，看见了什么？
答：一个暖和的大火炉
据：《卖火柴的小女孩》：第一根火柴亮起，她好像坐在一个大火炉前面，火烧得很旺。 || “The Little Match Girl”: in the first match's light she seems to sit before a big iron stove, burning warmly.
错：一只香喷喷的烤鹅 || 烤鹅是第二根火柴里看见的。 || the roast goose comes with the second match.
错：一棵美丽的圣诞树 || 圣诞树是第三根火柴里看见的。 || the Christmas tree comes with the third match.
错：她去世的奶奶 || 奶奶是在后来的火光里出现的，不是第一次。 || her grandmother appears in a later match, not the first.
验：按她的需要排一排：最先冷，所以看见火炉；再饿，看见烤鹅；再想要快乐，看见圣诞树；最后想要爱，看见奶奶。 || Order the visions by her needs: cold first, so a stove; then hunger, a goose; then joy, a tree; last, love, her grandmother.

问：小女孩最后一次在火光里看见了谁？
答：去世的奶奶
据：《卖火柴的小女孩》结尾：她把整把火柴都擦着，想留住奶奶，奶奶把她抱起，一起飞走了。 || “The Little Match Girl”, the end: she strikes the whole bundle to keep her grandmother, who takes her in her arms and flies away with her.
错：她的爸爸 || 她怕爸爸，不会在火光里盼着见他。 || she fears her father; he is not whom she longs to see.
错：她的妈妈 || 书里提到的是妈妈穿过的拖鞋，火光里没有妈妈。 || her mother appears only through the slippers she wore; she is not in the light.
错：一个过路的人 || 过路的人都没有理她，火光里出现的是唯一疼爱她的人。 || the passers-by ignore her; the light shows the one person who loved her.
验：从人物关系看：书里说奶奶是“唯一疼她的人”，所以最后一根火柴照出的只能是奶奶。 || Check by the people around her: the grandmother is the only one who loved her, so she is who the last light shows.

问：《卖火柴的小女孩》让读者产生了什么感情？
答：对穷苦孩子的同情
据：《卖火柴的小女孩》全篇：作者写她又冷又饿、无人理睬、冻死街头，让人同情穷苦的孩子。 || “The Little Match Girl” as a whole: cold, hungry, ignored, she dies in the street, and the tale moves us to pity poor children.
错：对新年的喜爱 || 新年里富人在过节，正衬托出她的悲惨，并不是让人喜爱新年。 || the rich celebrating the New Year only sharpen her misery; the tale is not about loving the holiday.
错：对奶奶的不满 || 奶奶是她唯一的温暖，读者不会对奶奶不满。 || her grandmother is her one warmth; no reader resents her.
错：对大雪的害怕 || 大雪只是环境，读者感到的是对她的同情，不是怕雪。 || the snow is the setting; what we feel is pity for her, not fear of snow.
验：从结尾人们的反应来对：大家只说她“想暖和一下”，没人知道她看到的美好，读者越知道，就越同情她。 || Check by how the passers-by react at the end: they only say she wanted to warm herself; we know what she saw, and pity her the more.

问：骗子说他们织的布有什么特别？
答：愚蠢或不称职的人看不见
据：《皇帝的新装》：两个骗子说，他们织的布，凡是不称职或愚蠢得不可救药的人都看不见。 || “The Emperor's New Clothes”: the swindlers say their cloth cannot be seen by anyone unfit for his post or hopelessly stupid.
错：在夜里会发出亮光 || 书里只说看不见的人愚蠢，没有说布会发光。 || they claim only that fools cannot see it; nothing about glowing.
错：穿多久都不会变旧 || 骗子吹的是颜色和图案美，没说永远不旧。 || they boast of its colours and patterns, not that it never wears out.
错：穿上的人能够隐身 || 隐身的反倒是布本身，没有人能隐身。 || it is the cloth that is unseen; no wearer becomes invisible.
验：从后面的情节对一下：大臣们、皇帝都不敢说看不见，正是怕被当成“愚蠢、不称职”，说明骗子讲的就是这一点。 || Check by what follows: ministers and emperor all hide that they see nothing, for fear of being thought stupid or unfit; that is the swindlers' claim.

问：大臣们为什么都说看见了那块布？
答：怕别人说自己愚蠢不称职
据：《皇帝的新装》：老大臣和官员去看布，什么也没看见，却怕别人说自己愚蠢、不称职，就跟着夸布好看。 || “The Emperor's New Clothes”: the old minister and the officials see nothing, but fearing to be thought stupid or unfit, they praise the cloth.
错：那块布真的非常漂亮 || 织机上根本没有布，骗子只是在空织机上比划。 || there is no cloth at all; the swindlers work at empty looms.
错：骗子给了他们很多钱 || 是骗子向皇帝要钱要丝，没有给大臣钱。 || the swindlers take money and silk from the emperor; they pay no one.
错：皇帝命令他们这样说 || 皇帝没有下令，他自己也同样看不见、不敢说。 || the emperor gives no such order; he too sees nothing and says nothing.
验：对照小孩子说真话以后：大家才敢交头接耳，说明之前大臣们全是因为害怕才说看见。 || Set it beside the child's cry: only then do people whisper the truth, so it was fear that made the ministers say they saw it.

问：游行时，第一个说出皇帝什么也没穿的是谁？
答：一个小孩子
据：《皇帝的新装》结尾：游行时，一个小孩子喊出“他什么衣服也没穿呀”。 || “The Emperor's New Clothes”, the end: in the procession a little child cries that he has nothing on.
错：一位老大臣 || 老大臣最先去看布，却假装看见了。 || the old minister was the first to see the cloth, and pretended he could.
错：一个骗子 || 骗子早已带着钱溜走了，不会说破。 || the swindlers have already slipped away with the money.
错：皇帝自己 || 皇帝心里发抖，却摆出更骄傲的样子把游行走完。 || the emperor shivers inside but walks on even prouder.
验：从小孩的身份看：只有小孩不在乎称职不称职，所以第一个说真话的只能是他。 || Check by who the child is: only a child has no post to fear for, so he alone could speak first.

问：《皇帝的新装》主要讽刺了什么？
答：爱虚荣、不敢说真话
据：《皇帝的新装》全篇：从皇帝到百姓，人人怕被看成愚蠢而说假话，作者讽刺的是虚荣和不敢说真话。 || “The Emperor's New Clothes” as a whole: from emperor to crowd, all lie for fear of looking stupid; the tale mocks vanity and the fear of telling the truth.
错：贪吃又懒惰 || 皇帝爱的是新衣服，故事里没有写他贪吃。 || the emperor loves new clothes; nothing is said of his eating.
错：胆小又怕黑 || 人们怕的是被说愚蠢，不是怕黑。 || they fear being thought stupid, not the dark.
错：粗心又健忘 || 大家不是忘了说，而是明明看见却不敢说。 || no one forgets anything; they see and dare not say.
验：从开头和结尾对照：开头皇帝只爱穿新衣，结尾明知受骗还要撑完游行，两头都是虚荣。 || Set the opening beside the end: he lives for new clothes, and he finishes the parade knowing he is fooled; vanity at both ends.

问：在海王的女儿里，小人鱼排第几？
答：最小的一个
据：《海的女儿》开头：海王有六个女儿，小人鱼是最小的一个，也是最美的。 || “The Little Mermaid”, its opening: the sea king has six daughters, and the little mermaid is the youngest and the loveliest.
错：最大的一个 || 她有五个姐姐，她不是最大的。 || she has five older sisters; she is not the eldest.
错：第二个 || 第二个是她的一个姐姐。 || the second is one of her sisters.
错：第三个 || 第三个也是她的姐姐。 || the third is also a sister.
验：从规矩看：人鱼满十五岁才能浮上海面，姐姐们一年一个先上去，她要等得最久，正因为她最小。 || Check by the rule: a mermaid rises to the surface at fifteen, the sisters one a year, and she waits longest because she is the youngest.

问：小人鱼在海上救了谁？
答：一位王子
据：《海的女儿》：她十五岁第一次浮上海面，遇上风暴，船沉了，她把王子托到岸边。 || “The Little Mermaid”: on her first visit to the surface at fifteen, a storm sinks a ship and she carries the prince to shore.
错：一个老水手 || 船上的水手在风暴里都落了水，她救的是王子。 || the sailors are lost in the storm; it is the prince she saves.
错：海里的巫婆 || 海巫婆是她后来去求的人，不是她救的人。 || the sea witch is the one she later goes to for help, not one she saves.
错：她的姐姐 || 姐姐们一直在海里，不需要她救。 || her sisters live in the sea and need no saving.
验：从后面看：王子醒来后以为救他的是庙里的姑娘，这个误会正是围绕“她救了王子”展开的。 || Check by what follows: the prince wakes believing a girl from the temple saved him; the whole sorrow turns on her having saved him.

问：谁帮小人鱼把鱼尾变成了人的腿？
答：海巫婆
据：《海的女儿》：她去找海巫婆，喝下巫婆的药，鱼尾才变成了两条腿。 || “The Little Mermaid”: she goes to the sea witch, and the witch's potion turns her tail into legs.
错：她的奶奶 || 奶奶只告诉她人有灵魂，并没有帮她变腿。 || her grandmother only tells her that people have souls; she does not change her.
错：她的姐姐们 || 姐姐们后来用头发向巫婆换来一把刀，没有帮她变腿。 || her sisters later trade their hair for a knife; they do not give her legs.
错：王子 || 王子并不知道她是人鱼，也不会魔法。 || the prince never knows she is a mermaid and has no magic.
验：从代价看：变腿要付出声音，每走一步像踩在刀尖上，这样的交易只有海巫婆提得出来。 || Check by the price: her voice, and every step like walking on knives; only the sea witch would strike that bargain.

问：小人鱼为了得到人的腿，付出了什么？
答：她美妙的声音
据：《海的女儿》：海巫婆要的报酬是她的声音，割掉了她的舌头。 || “The Little Mermaid”: the sea witch's price is her voice, and she cuts out her tongue.
错：她的长头发 || 用长头发换东西的是她的姐姐们，换来的是一把刀。 || it is her sisters who give up their hair, for a knife.
错：她的眼泪 || 书里说人鱼没有眼泪，所以眼泪不能拿来交换。 || the tale says mermaids have no tears to give.
错：她的王冠 || 书里没有王冠的交易。 || there is no crown in the bargain.
验：从后面的结果看：她到王子身边后一句话也说不出，无法告诉王子是她救了他，正因为没有了声音。 || Check by what follows: at the prince's side she cannot say a word, not even that she saved him, because her voice is gone.

问：小人鱼最后为什么没有杀死王子？
答：她深爱王子，不愿伤害他
据：《海的女儿》结尾：姐姐们给她刀，她看着睡着的王子，还是不忍心，把刀扔进了海里。 || “The Little Mermaid”, the end: her sisters give her a knife, but looking at the sleeping prince she cannot do it and throws the knife into the sea.
错：刀子掉进了海里 || 刀不是掉下去的，是她自己扔进海里的。 || the knife does not fall; she throws it away.
错：王子突然醒了过来 || 王子一直在睡梦中，只念着新娘的名字。 || the prince stays asleep, only murmuring his bride's name.
错：姐姐们拦住了她 || 姐姐们正是来劝她杀王子的，并没有拦她。 || her sisters came to urge her to kill him, not to stop her.
验：从她的选择看：杀了王子她能变回人鱼活三百年，她宁可自己化为泡沫，说明是爱让她放下了刀。 || Check by her choice: killing him would give her three hundred years as a mermaid, yet she chooses to become foam; love made her drop the knife.

问：小人鱼不肯杀死王子，跳进海里以后，她的身体化成了什么？
答：海上的泡沫
据：《海的女儿》结尾：她跳进海里，身体化成了泡沫，又升到空中，成为空气的女儿。 || “The Little Mermaid”, the end: she leaps into the sea, her body turns to foam, and she rises as a daughter of the air.
错：一条小鱼 || 她没有变回任何一种鱼。 || she becomes no fish of any kind.
错：一块礁石 || 礁石不在书里的结局里。 || no reef appears in the ending.
错：一朵浪花里的珍珠 || 书里没有珍珠这个结局，是泡沫。 || it is foam, not a pearl.
验：对照巫婆一开始说的话：王子若娶了别人，她就会变成海上的泡沫，结局正应了这句话。 || Check against the witch's warning: if the prince weds another, she will become foam on the sea; the ending keeps that word.

问：拇指姑娘是从哪里出来的？
答：一朵花里
据：《拇指姑娘》开头：一个女人种下巫婆给的大麦粒，长出一朵像郁金香的花，花心里坐着拇指姑娘。 || “Thumbelina”, its opening: a woman plants a barley grain from a witch, it grows into a tulip-like flower, and in its heart sits Thumbelina.
错：一个鸟蛋里 || 她不是从蛋里孵出来的。 || she is not hatched from an egg.
错：一片树叶里 || 睡莲叶子是她后来被癞蛤蟆放在上面的地方。 || a water-lily leaf is where the toad later leaves her.
错：一个贝壳里 || 胡桃壳是她的小床，不是她出生的地方。 || a walnut shell is her cradle, not where she comes from.
验：从她的样子看：她小得只有拇指那么大，配得上从花心里出来，后来又嫁给花中王子，开头和结尾都离不开花。 || Check by her size: no bigger than a thumb, fit to come from a flower, and she ends wedding the flowers' prince; flowers open and close her tale.

问：拇指姑娘冬天无家可归时，是谁收留了她？
答：一只田鼠
据：《拇指姑娘》：冬天来了，她冻得发抖，在麦田里找到一只田鼠的家，田鼠收留了她。 || “Thumbelina”: winter comes, she shivers, and in a cornfield she finds a field mouse's home; the mouse takes her in.
错：一只燕子 || 燕子是她后来救活的，不是收留她的。 || the swallow is the one she later saves, not her host.
错：一只鼹鼠 || 鼹鼠是田鼠的邻居，后来要娶她。 || the mole is the mouse's neighbour, who wants to marry her.
错：一只金龟子 || 金龟子把她抓走又丢下了，没有收留她。 || the cockchafer carries her off and then drops her.
验：从人物关系对：正因为住在田鼠家，田鼠才把有钱的邻居鼹鼠介绍给她，关系是一环扣一环的。 || Check by how the people connect: because she lives with the mouse, the mouse brings her the rich mole next door.

问：拇指姑娘为什么不愿嫁给鼹鼠？
答：要住在地下，见不到太阳
据：《拇指姑娘》：嫁给鼹鼠就要住到很深的地下，再也见不到她喜爱的太阳。 || “Thumbelina”: marrying the mole means living deep under the earth, never to see the sun she loves.
错：鼹鼠家里太穷了 || 鼹鼠很有钱，田鼠正是看中了这一点。 || the mole is rich; that is why the field mouse favours him.
错：鼹鼠对她很凶 || 书里没写鼹鼠凶她，问题是他讨厌阳光和花。 || he is not cruel to her; he simply hates the sun and flowers.
错：鼹鼠不会说话 || 鼹鼠会说话，还常来田鼠家做客。 || the mole speaks, and often visits the mouse.
验：对照她最后的选择：她跟燕子飞向阳光灿烂的南方，说明她怕的正是失去太阳。 || Check by her last choice: she flies with the swallow to the sunny south, so what she dreaded was losing the sun.

问：拇指姑娘救活了谁，后来又被它带到了南方？
答：一只燕子
据：《拇指姑娘》：她在地道里发现一只冻僵的燕子，悄悄照顾它救活了它；春天燕子把她带到温暖的南方。 || “Thumbelina”: in the tunnel she finds a frozen swallow and nurses it back to life; in spring it carries her to the warm south.
错：一只田鼠 || 田鼠收留了她，但没有带她去南方。 || the field mouse took her in but carried her nowhere.
错：一只癞蛤蟆 || 癞蛤蟆是开头把她抢走的。 || the toad is the one who stole her at the start.
错：一只蝴蝶 || 她把睡莲叶子拴在蝴蝶身上逃走，但没救过蝴蝶，也没被蝴蝶带去南方。 || she tied her leaf to a butterfly to escape, but she never saved it, and it took her nowhere south.
验：看燕子能飞多远：只有候鸟会在秋天飞往南方，所以带她去南方的只能是燕子。 || Check by who can fly that far: only a migrating bird goes south in autumn, so it must be the swallow.

问：拇指姑娘最后嫁给了谁？
答：花中的小王子
据：《拇指姑娘》结尾：在南方的花里，她遇到和她一样小的花中王子，嫁给了他。 || “Thumbelina”, the end: among the flowers of the south she meets a prince as small as she is, and marries him.
错：癞蛤蟆的儿子 || 癞蛤蟆想让她嫁给儿子，她逃走了。 || the toad wanted her for its son, and she escaped.
错：有钱的鼹鼠 || 她在婚礼那天跟燕子飞走，没有嫁给鼹鼠。 || on the wedding day she flew off with the swallow instead.
错：一只金龟子 || 金龟子听别人说她丑，就把她丢下了。 || the cockchafer dropped her when the others called her ugly.
验：从三个求婚者对照：癞蛤蟆、金龟子、鼹鼠都和她不相配，只有花中王子和她一样小、一样爱花。 || Compare her suitors: toad, beetle and mole are no match; only the flower prince is her size and loves flowers too.

问：王后怎样试出来的人是不是真正的公主？
答：在很多床垫下放一粒豌豆
据：《豌豆上的公主》：王后在床板上放一粒豌豆，上面压了二十床垫子和二十床鸭绒被。 || “The Princess and the Pea”: the queen puts one pea on the bedstead and piles twenty mattresses and twenty eiderdowns on it.
错：让她唱一首好听的歌 || 书里的试法和唱歌无关。 || the test has nothing to do with singing.
错：看她穿的衣服好不好 || 她来时被雨淋得狼狈，衣服根本不像公主。 || she arrives soaked and bedraggled; her clothes prove nothing.
错：问她家住在哪里 || 王后什么也没问，偷偷用豌豆试她。 || the queen asks nothing; she tests her in secret.
验：从第二天的结果对：她说被什么硬东西硌得浑身发青，只有真正“娇嫩”的公主才隔着四十层还感觉得到。 || Check by the morning: she is black and blue from something hard; only a true princess could feel it through forty layers.

问：第二天早上，公主说她睡得怎么样？
答：很不舒服，身上都青了
据：《豌豆上的公主》：她说一整夜几乎没合眼，好像睡在硬东西上，浑身都青紫了。 || “The Princess and the Pea”: she says she hardly slept, as if lying on something hard, and is black and blue all over.
错：非常香甜，一夜没醒 || 正相反，她几乎一夜没睡。 || just the opposite: she barely slept.
错：梦见了一位王子 || 书里没有写她做梦。 || no dream is mentioned.
错：床太短，脚伸不开 || 她抱怨的是硌，不是床短。 || she complains of something hard, not a short bed.
验：从结局对：王子因此娶了她，豌豆被送进博物馆，正因为她睡得不舒服才证明了身份。 || Check by the ending: the prince marries her and the pea goes to a museum; her bad night is the proof.

问：坚定的锡兵和别的锡兵有什么不同？
答：他只有一条腿
据：《坚定的锡兵》开头：二十五个锡兵用一把旧锡汤匙铸成，最后一个锡不够，只有一条腿。 || “The Steadfast Tin Soldier”, its opening: twenty-five soldiers are cast from an old tin spoon, and the last, short of tin, has one leg.
错：他只有一只眼睛 || 书里没说他少一只眼睛。 || nothing says he lacks an eye.
错：他没有拿枪 || 他和别的锡兵一样扛着枪。 || he shoulders his musket like the rest.
错：他比别人高一头 || 他们一样高，他只是少一条腿。 || they are all alike in height; he only lacks a leg.
验：从他站立的样子看：他用一条腿站得笔直，像跳舞姑娘踮起一只脚，他正因此觉得她和自己一样。 || Check by how he stands: firm on one leg, like the dancer raised on one foot, which is why he feels she is like him.

问：锡兵爱上了谁？
答：一个纸做的跳舞姑娘
据：《坚定的锡兵》：桌上有一座纸做的宫殿，门口站着一个纸剪的跳舞姑娘，锡兵爱上了她。 || “The Steadfast Tin Soldier”: on the table stands a paper castle, at its door a paper dancer, and the soldier loves her.
错：一个瓷娃娃 || 书里的她是纸做的，不是瓷的。 || she is made of paper, not porcelain.
错：一个小公主 || 她是跳舞的姑娘，不是公主。 || she is a dancer, not a princess.
错：一只小鸟 || 书里没有他爱小鸟的情节。 || he loves no bird in the tale.
验：对照结尾：风把跳舞姑娘吹进火炉，她和他一起烧掉，只剩一片烧黑的亮片，两人的结局连在一起。 || Check against the end: a draught blows the dancer into the stove beside him, and only her blackened spangle remains; their ends are bound together.

问：锡兵最后怎样了？
答：被扔进火炉，熔成一颗心
据：《坚定的锡兵》结尾：他被小男孩扔进火炉，第二天女仆在灰里找到一颗小小的锡心。 || “The Steadfast Tin Soldier”, the end: a little boy throws him into the stove, and next day the maid finds a little tin heart in the ashes.
错：被一条鱼吞进了肚子 || 被鱼吞下是中途的事，他后来又回到了原来的屋子。 || being swallowed by a fish happens midway; he is brought back to the same house.
错：被小男孩送给了朋友 || 书里没有把他送人的情节。 || he is never given away.
错：掉进河里再也没回来 || 他掉进水沟漂进河里，但后来回来了。 || he falls into the gutter and the canal, but he comes back.
验：从标题“坚定”来对：经历了掉窗、坐纸船、被鱼吞，他始终站直不动，最后熔成一颗心，正写出他的忠贞。 || Check by the word “steadfast”: through the fall, the paper boat and the fish he stays upright, and he melts into a heart; that is his constancy.

问：《野天鹅》里，王子们被谁变成了天鹅？
答：狠心的新王后
据：《野天鹅》开头：国王娶了一个狠心的新王后，她把十一个王子变成了野天鹅。 || “The Wild Swans”, its opening: the king marries a wicked new queen, and she turns the eleven princes into wild swans.
错：森林里的巫婆 || 书里施魔法的就是新王后，没有森林巫婆。 || the queen herself casts the spell; there is no forest witch.
错：他们的父亲 || 国王被新王后蒙蔽，不是他施的魔法。 || the king is deceived by the queen; he casts nothing.
错：一位仙女 || 仙女在梦里告诉妹妹怎样救哥哥，不是害他们的人。 || a fairy tells the sister in a dream how to save them; she does not harm them.
验：从妹妹的遭遇对照：新王后也想害艾丽莎，把她弄脏丑化，说明对这一家孩子下手的一直是她。 || Check by what happens to the sister: the queen also tries to harm Elisa and soils her face, so the children's enemy is the queen throughout.

问：《野天鹅》里，被变成天鹅的哥哥一共有几个？
答：十一个
据：《野天鹅》开头：国王有十一个儿子和一个女儿艾丽莎，十一个王子都被变成了天鹅。 || “The Wild Swans”, its opening: the king has eleven sons and a daughter, Elisa, and all eleven sons become swans.
错：七个 || 七个是格林童话《七只乌鸦》里的数。 || seven is the number of Grimm's “Seven Ravens”.
错：十个 || 不是十个，书里是十一个哥哥。 || not ten; the tale has eleven brothers.
错：十二个 || 十二个是格林童话《十二兄弟》里的数。 || twelve is the number of Grimm's “Twelve Brothers”.
验：从妹妹织的衣服对：她要织十一件荨麻衣，每个哥哥一件。 || Check by the shirts: she must knit eleven of nettle, one for each brother.

问：妹妹用什么给哥哥们织衣服？
答：刺手的荨麻
据：《野天鹅》：仙女告诉艾丽莎，要采刺手的荨麻，用脚踩成麻，织成衣服。 || “The Wild Swans”: the fairy tells Elisa to gather stinging nettles, tread them into flax and knit shirts.
错：柔软的羊毛 || 书里强调的是刺手的荨麻，不是软羊毛。 || the tale insists on stinging nettles, not soft wool.
错：结实的麻绳 || 不是麻绳，是用荨麻纺成的麻。 || not rope; flax trodden from nettles.
错：河边的芦苇 || 书里没有用芦苇。 || no reeds are used.
验：从她吃的苦对：她的手被荨麻刺得起泡，后来还到墓地去采荨麻，才被当成巫婆，这都离不开荨麻。 || Check by her suffering: her hands blister from the nettles, and gathering them in the churchyard gets her called a witch.

问：妹妹在织完衣服以前，必须做到什么？
答：一句话也不说
据：《野天鹅》：仙女说，从开始织到织完，她一句话也不能说，一说哥哥们就会死。 || “The Wild Swans”: the fairy says that from the first stitch to the last she must not speak a word, or her brothers will die.
错：一口饭也不吃 || 书里没要求她不吃饭。 || nothing forbids her to eat.
错：每天都要流泪 || 书里没有每天要流泪的要求。 || there is no rule about weeping.
错：不能见到太阳 || 她白天也在织衣，没有不能见太阳的说法。 || she works by day as well; there is no rule about the sun.
验：从她被冤枉的情节对：被当成巫婆要烧死时她也不开口辩解，正因为不能说话。 || Check by her trial: called a witch and sent to the fire, she says nothing in her own defence, because she must not speak.

问：最小的哥哥为什么还留着一只天鹅翅膀？
答：最后一件衣服少织了一只袖子
据：《野天鹅》结尾：最后一件衣服还差一只袖子没织完，最小的哥哥就留下了一只天鹅翅膀。 || “The Wild Swans”, the end: the last shirt lacks one sleeve, so the youngest brother keeps a swan's wing.
错：他自己不想变回人 || 哥哥们都盼着变回人，书里没写他不想。 || all the brothers long to be men again; nothing says he did not.
错：他飞得太远没赶回来 || 十一只天鹅一起飞来，他也赶到了。 || all eleven swans arrive together, he among them.
错：新王后又对他施了魔法 || 新王后没有再出现施魔法。 || the queen casts no new spell.
验：从她织衣的时间对：她在去刑场的车上还在赶织，时间不够，才少了一只袖子。 || Check by the time she had: she was still knitting in the cart to the fire, and time ran out before the last sleeve.

问：安徒生常常让哪些东西像人一样想事情、说话？
答：动物、玩具和花草
据：《安徒生童话》全书：锡兵、跳舞姑娘、丑小鸭、燕子、花朵都会想、会说话。 || Andersen's tales as a whole: the tin soldier, the paper dancer, the duckling, the swallow and the flowers all think and speak.
错：只有国王和王后 || 国王王后有，但更多的是动物、玩具和花草。 || kings and queens appear, but far more often animals, toys and flowers.
错：只有天上的神仙 || 安徒生童话里很少写天上的神仙。 || his tales seldom deal with gods in heaven.
错：只有小孩子 || 小孩子当然会说话，题目问的是哪些“东西”像人一样。 || children speak anyway; the question is which things speak like people.
验：举两个例子对：《坚定的锡兵》里锡兵会爱，《丑小鸭》里鸭子会议论，正是动物和玩具像人一样。 || Test with two tales: the tin soldier loves, the ducks gossip; animals and toys act like people.

问：安徒生是哪个国家的作家？
答：丹麦
据：作者生平：安徒生是丹麦作家，生在欧登塞，后来住在哥本哈根。 || The author: Andersen was Danish, born in Odense, and lived in Copenhagen.
错：德国 || 德国出了格林兄弟，不是安徒生。 || Germany gave us the Brothers Grimm, not Andersen.
错：法国 || 法国的童话作家是佩罗。 || France's teller of fairy tales is Perrault.
错：英国 || 安徒生不是英国人。 || Andersen was not English.
验：从书里找线索：《海的女儿》的铜像立在哥本哈根港口，这正是丹麦的首都。 || Check by a landmark: the Little Mermaid's statue stands in Copenhagen harbour, the capital of Denmark.
`,
  },
  {
    id: "chinese-myths",
    grade: 4,
    title: { en: "Ancient Chinese Myths", zh: "中国古代神话" },
    author: { en: "Traditional", zh: "中国古代神话传说" },
    guide: {
      en: "Each myth is short: after reading one, name its hero, the trouble they faced and what they did about it. Notice what each myth explains, such as where the sky, people or writing came from. The same gods appear in several stories, so keep a list of names and what each one did. Ask what wish or quality of the ancient people each story shows.",
      zh: "每个神话都不长，读完一个，说说它的主人公是谁、遇到了什么难题、怎样解决的。留意每个神话在解释什么，比如天地、人类或文字是怎么来的。同一位神常在好几个故事里出现，可以列一张表，记下名字和他们做的事。想一想：每个故事表现了古人怎样的愿望和品质？",
    },
    callout: {
      en: "Gods and heroes cross between myths: Nüwa, Fuxi, Houyi and Chang'e. Before you choose, place the question in its own myth: Nüwa mends the sky, but she does not shoot the suns.",
      zh: "神话里的神和英雄常常互相出现：女娲、伏羲、后羿、嫦娥。选之前先想清楚问的是哪一个神话：女娲补天，射日的却不是她。",
    },
    questions: `
问：盘古在混沌中睡了多久才醒来？
答：一万八千年
据：《盘古开天地》开头：天地还是一团混沌，像个大鸡蛋，盘古在里面睡了一万八千年才醒来。 || “Pangu Separates Heaven and Earth”, its opening: all is chaos like a great egg, and Pangu sleeps inside it for eighteen thousand years before he wakes.
错：一千年 || 一千年太短，书里是一万八千年。 || a thousand is far too few; it is eighteen thousand.
错：八百年 || 八百年是传说中彭祖的寿命，和盘古无关。 || eight hundred years is the lifespan told of Peng Zu, not Pangu.
错：十万年 || 十万年不是书里的数。 || a hundred thousand is not the book's number.
验：从后面的情节对：天地分开后，又是一万八千年，天每天高一丈，地每天厚一丈，盘古的故事是用“一万八千年”来记时的。 || Check by what follows: after the parting comes another eighteen thousand years of the sky rising and the earth thickening; the myth counts in eighteen thousands.

问：盘古用什么劈开了混沌？
答：一把大斧头
据：《盘古开天地》：盘古醒来，看见四周漆黑一片，抡起大斧头，朝眼前的黑暗猛劈过去。 || “Pangu Separates Heaven and Earth”: waking in the dark, Pangu swings a great axe at the blackness before him.
错：一把宝剑 || 书里不是宝剑，是大斧头。 || not a sword; a great axe.
错：一根神棍 || 神棍让人想起孙悟空的金箍棒，那是《西游记》。 || a magic staff calls up Sun Wukong's cudgel, from Journey to the West.
错：一张神弓 || 神弓是后羿射日用的。 || a magic bow is Houyi's, for shooting the suns.
验：从“劈”字对：劈是用斧头的动作，把混沌一分为二，正和斧头相配。 || Check by the verb: “cleave” is what an axe does, splitting the chaos in two.

问：天地分开后，轻而清的东西变成了什么？
答：天
据：《盘古开天地》：混沌劈开后，轻而清的东西慢慢上升，变成了天。 || “Pangu Separates Heaven and Earth”: once the chaos is split, what is light and clear rises slowly and becomes the sky.
错：地 || 重而浊的东西下降，变成了地，正好相反。 || the heavy and murky sinks and becomes the earth; the opposite.
错：海 || 海是后来盘古的身体变出来的。 || the seas come later, from Pangu's body.
错：山 || 山也是盘古倒下后身体变成的。 || the mountains too come from his fallen body.
验：从“轻”和“重”对：轻的上升，重的下沉，上面的是天，下面的是地，方向不会错。 || Check by weight: the light rises, the heavy sinks; what is above is sky, what is below is earth.

问：盘古为什么要用身体撑着天地？
答：怕天和地又合在一起
据：《盘古开天地》：天地分开后，盘古怕它们还会合在一起，就头顶着天，脚踏着地，撑在中间。 || “Pangu Separates Heaven and Earth”: afraid they will close again, he holds the sky up with his head and presses the earth with his feet.
错：想让自己长得更高 || 他长高是撑天的结果，不是目的。 || his growing tall comes of holding them apart; it is not his aim.
错：想看看天外有什么 || 书里没写他想看天外。 || nothing says he wished to see beyond the sky.
错：怕太阳掉下来 || 那时还没有太阳，太阳是他倒下后眼睛变的。 || there is no sun yet; it comes from his eye after he falls.
验：从结局对：直到天地已经牢固，不会再合拢，他才放心地倒下，说明他一直担心的就是天地合拢。 || Check by the end: only when heaven and earth are firm does he lie down, so his fear was that they would close.

问：盘古倒下以后，他的双眼变成了什么？
答：太阳和月亮
据：《盘古开天地》：盘古倒下后，左眼变成太阳，右眼变成月亮。 || “Pangu Separates Heaven and Earth”: when he falls, his left eye becomes the sun and his right eye the moon.
错：满天的星星 || 满天的星星是他的头发和胡须变的。 || the stars come from his hair and beard.
错：奔流的江河 || 江河是他的血液变的。 || the rivers come from his blood.
错：高高的山峰 || 高山是他的身体和四肢变的。 || the mountains come from his body and limbs.
验：从“一双”对：眼睛有两只，天上能和它们一一对应的正是一个太阳、一个月亮。 || Check by the pair: two eyes, and the two great lights of the sky, one sun and one moon.

问：盘古倒下以后，他的血液变成了什么？
答：奔流的江河
据：《盘古开天地》：盘古倒下后，他的血液变成了奔流的江河。 || “Pangu Separates Heaven and Earth”: when he falls, his blood becomes the flowing rivers.
错：辽阔的大地 || 辽阔的大地是他的肌肉变的。 || the broad land comes from his flesh.
错：飘动的白云 || 白云是他呼出的气变的。 || the clouds come from his breath.
错：轰隆的雷声 || 雷声是他的声音变的。 || the thunder comes from his voice.
验：从“流动”对：血在身体里流动，江河在大地上奔流，两者是对应的。 || Check by flow: blood runs through the body as rivers run over the land.

问：女娲为什么要造人？
答：她觉得天地间太冷清
据：《女娲造人》：盘古开天地以后，女娲在大地上走，觉得天地间太冷清，就想造出和自己一样的人。 || “Nüwa Makes People”: walking the earth after Pangu's work, Nüwa finds the world too lonely and wants to make beings like herself.
错：天帝命令她这样做 || 书里没有天帝命令，是她自己的想法。 || no god commands her; it is her own wish.
错：她想找人帮她补天 || 补天是后来天塌了才发生的，造人在前。 || mending the sky comes later, when it falls; making people comes first.
错：她想找人陪伴盘古 || 盘古那时已经倒下化成万物了。 || Pangu has already fallen and become the world.
验：从造人以后的情景对：人们在她身边欢呼跳跃，她心里十分高兴，冷清变成了热闹，正应了她造人的原因。 || Check by what follows: the people dance and cheer around her and she is glad; the loneliness is gone.

问：女娲用什么捏出了最早的人？
答：黄泥
据：《女娲造人》：她蹲在水池边，抓起地上的黄泥，照着水中自己的样子捏出了小人。 || “Nüwa Makes People”: crouching by a pool, she takes yellow clay and shapes little figures after her own reflection.
错：石头 || 石头是她后来炼来补天的。 || stone is what she later smelts to mend the sky.
错：木头 || 书里没有用木头造人。 || she makes no one of wood.
错：白雪 || 白雪捏不成人，书里也没有。 || nothing in the myth is made of snow.
验：从古人的说法对：中国人常说自己是“黄土”造的，和女娲用黄泥捏人的传说是一致的。 || Check by the saying: the old belief that people were made of yellow earth matches Nüwa's yellow clay.

问：女娲后来用什么办法更快地造人？
答：用藤条甩出泥点
据：《女娲造人》：她捏得累了，就把一根藤条伸进泥浆里，用力一甩，溅出的泥点都变成了人。 || “Nüwa Makes People”: tired of shaping, she dips a vine into the mud and swings it, and every drop becomes a person.
错：请天神一起来捏 || 书里她是一个人造人，没有请天神。 || she works alone; she calls on no gods.
错：用石头雕刻人像 || 雕刻石像太慢，也不是书里的办法。 || carving stone is slower still, and not what she does.
错：用大锅煮黄泥 || 书里没有煮泥这一步。 || nothing is boiled.
验：从“更快”对：一甩就是一大片泥点，比一个个捏快得多，这才配得上“更快”。 || Check by “faster”: one swing scatters many drops, far quicker than shaping one by one.

问：天为什么会塌下一角？
答：共工撞断了不周山
据：《女娲补天》：水神共工和火神打仗，打输了，一头撞在不周山上，撑天的柱子断了，天塌下一角。 || “Nüwa Mends the Sky”: the water god Gonggong, beaten in battle, butts Buzhou Mountain, the pillar of heaven breaks, and a corner of the sky falls.
错：盘古累得倒下了 || 盘古倒下是在开天辟地之后，天没有因此塌。 || Pangu's fall came after the parting and broke nothing.
错：后羿射下了太阳 || 后羿射日是另一个故事，太阳射下了，天没有破。 || Houyi's shooting is another story; no sky breaks.
错：大禹挖开了高山 || 大禹开挖河道治水，没有挖开山让天塌。 || Yu digs channels for the flood; he brings no sky down.
验：从“不周山”这个名字对：它是撑天的柱子，被撞断后西北的天倾斜下来，所以日月星辰都往西北移，这正是共工撞山的后果。 || Check by Buzhou Mountain itself: it held up the sky, and when it broke the heavens tilted northwest, which is why the stars drift that way.

问：女娲用什么补好了天？
答：炼好的五色石
据：《女娲补天》：女娲到处寻找五色石，用大火把它们炼成浆，把天上的窟窿补好。 || “Nüwa Mends the Sky”: she gathers stones of five colours, melts them in a great fire and fills the hole in the sky.
错：捏好的黄泥 || 黄泥是她造人用的。 || yellow clay is what she made people of.
错：天上的白云 || 白云补不了天，书里也没有。 || clouds cannot mend the sky, and the myth never says so.
错：烧红的铁块 || 书里没有铁块，是五色石。 || there is no iron; it is five-coloured stone.
验：从天的颜色对：传说天边的彩霞就是五色石的光彩，补天和五色石是连在一起的。 || Check by the sky's colours: the coloured clouds are said to be the glow of those stones.

问：女娲用什么撑住了四方的天？
答：大龟的四只脚
据：《女娲补天》：她怕天再塌，就杀了一只大龟，砍下它的四只脚，立在四方撑住天。 || “Nüwa Mends the Sky”: fearing it will fall again, she kills a great turtle and stands its four legs at the four quarters to prop the sky.
错：盘古的手和脚 || 盘古的四肢变成了四方的大山，那是盘古神话里的事，女娲用的是大龟的脚。 || Pangu's limbs became the mountains of the four quarters, but that is his myth; Nüwa uses the turtle's legs.
错：四棵大树 || 书里不是树，是大龟的脚。 || not trees; the turtle's legs.
错：四座高山 || 书里不是山，是大龟的脚。 || not mountains; the turtle's legs.
验：从数目对：天有东南西北四方，龟正好有四只脚，一只撑一方。 || Check by number: four quarters of the sky, four legs of the turtle, one for each.

问：精卫原来是谁？
答：炎帝的小女儿
据：《精卫填海》（《山海经·北山经》）：炎帝的小女儿名叫女娃，到东海游玩时淹死了，化成一只鸟，叫精卫。 || “Jingwei Fills the Sea”, from the Classic of Mountains and Seas: Nüwa, youngest daughter of the Flame Emperor, drowns in the Eastern Sea and becomes a bird called Jingwei.
错：黄帝的小女儿 || 黄帝是炎帝的对手，精卫是炎帝的女儿。 || the Yellow Emperor is the Flame Emperor's rival; Jingwei is the Flame Emperor's daughter.
错：女娲的女儿 || 女娲没有女儿的故事，精卫的原名“女娃”和“女娲”只是读音相近。 || Nüwa the goddess has no daughter in the myths; the girl's name, Nüwa (女娃), only sounds like hers (女娲).
错：大禹的妻子 || 大禹的妻子是涂山氏。 || Yu's wife is the woman of Tushan.
验：从名字对：女娃和女娲读音相近，容易混，但一个是炎帝的女儿，一个是造人的女神。 || Check the names: 女娃 and 女娲 sound alike, but one is the Flame Emperor's daughter, the other the goddess who made people.

问：精卫为什么要填海？
答：她在东海里淹死了
据：《精卫填海》：女娃在东海游玩时被大浪吞没，再也没有回来，她恨大海夺走了她的生命。 || “Jingwei Fills the Sea”: playing on the Eastern Sea, she is swallowed by the waves and never returns, and she hates the sea that took her life.
错：大海淹了她的家 || 大海淹的是她自己，不是她的家。 || the sea drowned her, not her home.
错：海神抢走了她的宝贝 || 书里没有海神抢宝贝。 || no sea god steals anything.
错：她想在海上修一条路 || 她要把海填平，不是修路。 || she wants the sea filled, not a road built.
验：从她叫的声音对：精卫的叫声就像“精卫、精卫”，在海上一遍遍飞，正是为自己的死向大海讨还。 || Check by her cry: she calls her own name over the sea again and again, avenging her death.

问：精卫用什么来填海？
答：西山的石子和树枝
据：《精卫填海》：她常常衔着西山的树枝和石子，飞去投进东海。 || “Jingwei Fills the Sea”: she carries twigs and pebbles from the Western Hills and drops them into the Eastern Sea.
错：东海边的沙子 || 东海边的沙子就在海里，书里是从西山衔来的。 || the shore sand is already in the sea; she brings hers from the Western Hills.
错：天上的云彩 || 云彩衔不住，书里也没有。 || she could not carry clouds, and the myth never says so.
错：田里的泥土 || 书里说的是树枝和石子，不是泥土。 || twigs and pebbles, not soil.
验：从“西”和“东”对：一只小鸟从西山飞到东海，路那么远，一次只衔一点，更显出她的执着。 || Check by west and east: a small bird flies all the way from the Western Hills to the Eastern Sea, a beakful at a time.

问：精卫填海表现了什么精神？
答：坚持不懈、永不放弃
据：《精卫填海》全篇：一只小鸟要填平大海，明知做不到，还是天天衔石填海，从不停止。 || “Jingwei Fills the Sea” as a whole: a small bird sets out to fill the sea, and though it cannot be done, she never stops.
错：聪明机智、随机应变 || 她没有用计谋，一直在做同一件事。 || she uses no cunning; she does the same thing day after day.
错：能歌善舞、快乐自在 || 她是为复仇而填海，不是快乐自在。 || she fills the sea for vengeance, not for pleasure.
错：宽容大度、不记仇 || 她恨大海，正是记着仇，不是不记仇。 || she hates the sea and remembers her wrong.
验：从后人的成语对：“精卫填海”常用来比喻意志坚决、不畏艰难，正是坚持不懈。 || Check by the idiom: “Jingwei fills the sea” is used of an unbending will.

问：哪个故事的主人公变成了一只鸟？
答：精卫填海
据：《精卫填海》：炎帝的女儿淹死后化成一只鸟，名叫精卫。 || “Jingwei Fills the Sea”: the drowned daughter becomes a bird named Jingwei.
错：夸父逐日 || 夸父没有变成鸟，他的手杖变成了桃林。 || Kuafu becomes no bird; his staff becomes a peach grove.
错：仓颉造字 || 仓颉是黄帝的史官，没有变成鸟。 || Cangjie is the Yellow Emperor's scribe and stays a man.
错：神农尝百草 || 神农尝百草，也没有变成鸟。 || Shennong tastes herbs; he never becomes a bird.
验：从精卫的名字来源对：“精卫”就是这只鸟叫声的样子，鸟和人名在故事里合二为一。 || Check by the name: Jingwei is the bird's own cry; bird and girl are one.

问：夸父一直追赶的是什么？
答：太阳
据：《夸父逐日》（《山海经·海外北经》）：夸父迈开大步，一直追赶太阳。 || “Kuafu Chases the Sun”, from the Classic of Mountains and Seas: Kuafu strides after the sun.
错：月亮 || 书里追的是白天的太阳，不是月亮。 || he chases the sun of the day, not the moon.
错：星星 || 星星在书里没有被追赶。 || no one chases stars in the myth.
错：大风 || 风不是他追的东西。 || the wind is not what he pursues.
验：从他口渴的原因对：越靠近太阳越热，他才渴得要喝干河水，追的一定是太阳。 || Check by his thirst: the nearer he comes, the hotter it gets, which is why he drinks the rivers dry.

问：夸父口渴时，喝干了什么？
答：黄河和渭河
据：《夸父逐日》：他追到太阳落下的地方，口渴极了，一口气喝干了黄河和渭河。 || “Kuafu Chases the Sun”: reaching where the sun sets, he is so thirsty that he drinks the Yellow River and the Wei dry.
错：长江和汉水 || 长江和汉水在南方，书里是北方的黄河和渭河。 || the Yangtze and the Han are southern rivers; the myth names the Yellow River and the Wei in the north.
错：东海和南海 || 海水不能解渴，书里也没写他喝海。 || seawater quenches no thirst, and he drinks none.
错：一个大湖 || 大湖（大泽）是他还想去喝的地方，没走到就死了。 || the great lake is where he was still heading when he died.
验：从下一步对：喝干了黄河、渭河还不够，他又往北去找大泽，可见喝干的是两条河。 || Check by the next step: the two rivers are not enough, so he heads north for the great lake.

问：夸父最后怎样了？
答：渴死在追赶的路上
据：《夸父逐日》：他往北去大泽喝水，还没走到，就渴死在半路上。 || “Kuafu Chases the Sun”: heading north to the great lake, he dies of thirst before he reaches it.
错：追上了太阳 || 太阳没有被追上，他是在路上死去的。 || he never catches the sun; he dies on the way.
错：回到了自己的家乡 || 他没有回家，死在去大泽的路上。 || he never goes home; he dies on the road.
错：变成了一条大河 || 变成桃林的是他的手杖，不是他自己。 || it is his staff that becomes a peach grove, not he.
验：从他留下的东西对：他死后手杖化成桃林，给后来追赶的人遮阴解渴，说明他是死在半路的。 || Check by what he leaves: his staff becomes a peach grove for later travellers; he fell on the road.

问：夸父扔下的手杖变成了什么？
答：一片桃林
据：《夸父逐日》结尾：他死前扔下手杖，手杖化成了一片桃林（邓林）。 || “Kuafu Chases the Sun”, the end: as he dies he throws down his staff, and it becomes a peach grove.
错：一座高山 || 高山不是手杖变的。 || no mountain comes from the staff.
错：一条大河 || 大河是他喝干的，不是手杖变的。 || rivers are what he drank dry, not what his staff became.
错：一群小鸟 || 书里没有小鸟，变成鸟的是精卫。 || there are no birds here; the bird is Jingwei.
验：从手杖的样子想：木头做的手杖插在地上能长成树，长成一片林子是说得通的。 || Check by the staff itself: a wooden stick set in the earth can grow into trees.

问：后羿射日以前，人们为什么受苦？
答：十个太阳一起出来
据：《后羿射日》（《淮南子》）：尧的时候，十个太阳一起出来，庄稼晒焦，草木枯死，百姓没有吃的。 || “Houyi Shoots the Suns”, from the Huainanzi: in Yao's time ten suns rise together, scorching the crops and killing the plants.
错：天上破了一个大洞 || 天破洞是女娲补天的故事。 || a hole in the sky is the tale of Nüwa.
错：洪水到处泛滥 || 洪水是大禹治水的故事。 || the flood is the tale of Yu.
错：大地裂开了口子 || 书里说的是太阳晒，没有大地裂口。 || the trouble is the heat, not a split in the earth.
验：从后羿的办法对：他射的是太阳，可见人们受苦正是因为太阳太多。 || Check by his remedy: he shoots suns, so the trouble was too many suns.

问：后羿一共射下了几个太阳？
答：九个
据：《后羿射日》：后羿一连射下九个太阳，留下一个照亮大地。 || “Houyi Shoots the Suns”: he shoots down nine and leaves one to light the earth.
错：十个 || 射下十个就没有太阳了，庄稼也长不成。 || shooting all ten would leave no sun at all.
错：八个 || 书里是九个，不是八个。 || nine, not eight.
错：一个 || 射一个解决不了九个太阳的炎热。 || one would leave nine to burn.
验：用加法对：十个太阳，射下九个，留下一个，正是今天天上的一个太阳。 || Check by sum: ten less nine leaves the one sun we have.

问：后羿射日以后，人们的生活怎样了？
答：重新过上了安宁的日子
据：《后羿射日》：九个太阳射下以后，草木重新生长，人们又过上了安宁的日子。 || “Houyi Shoots the Suns”: with nine suns gone, plants grow again and people live in peace.
错：再也看不见太阳了 || 他留下了一个太阳，人们还看得见。 || he leaves one sun; people still see it.
错：都搬到了月亮上 || 去月亮上的是嫦娥一个人。 || only Chang'e goes to the moon.
错：变得更加困难了 || 射日正是为了解救百姓，日子变好了。 || the shooting was to save the people, and life gets better.
验：从人们对后羿的态度对：百姓把他当作英雄，西王母还给了他不死药，说明他做了一件大好事。 || Check by how he is honoured: hailed as a hero, he is given the elixir by the Queen Mother of the West.

问：后羿的不死药是谁给的？
答：西王母
据：《嫦娥奔月》（《淮南子》）：后羿向西王母求来了不死药。 || “Chang'e Flies to the Moon”, from the Huainanzi: Houyi asks the Queen Mother of the West for the elixir of life.
错：女娲 || 女娲造人补天，没有给不死药。 || Nüwa makes people and mends the sky; she gives no elixir.
错：天帝 || 天帝没有给他不死药。 || the god of heaven gives no elixir.
错：神农 || 神农尝百草找治病的药，不是不死药。 || Shennong seeks medicines, not immortality.
验：从西王母的身份对：她住在昆仑山，管着长生不老的仙药，求不死药自然要去找她。 || Check by who she is: she keeps the herbs of long life on Mount Kunlun.

问：嫦娥是怎样飞到月亮上去的？
答：吃下了不死药
据：《嫦娥奔月》：嫦娥吃下了不死药，身体变轻，飘飘地飞上了月亮。 || “Chang'e Flies to the Moon”: she swallows the elixir, grows light and floats up to the moon.
错：骑着一只神鸟 || 书里没有神鸟。 || there is no magic bird.
错：踩着一朵彩云 || 踩云飞的是神仙小说里的写法，书里是吃药。 || riding a cloud belongs to other tales; she takes the elixir.
错：后羿用箭送她上去 || 后羿的箭是射太阳的，他没有送她上天。 || Houyi's arrows are for the suns; he does not send her up.
验：从后羿的反应对：他回家发现嫦娥不见了，只能望着月亮想她，说明是她自己吃药飞走的。 || Check by Houyi's grief: he comes home to find her gone and can only gaze at the moon.

问：人们在什么节日赏月，想起嫦娥的故事？
答：中秋节
据：《嫦娥奔月》：后羿思念嫦娥，在月圆的八月十五摆上果品望月，后来人们在中秋节赏月。 || “Chang'e Flies to the Moon”: missing her, Houyi sets out fruit under the full moon of the fifteenth of the eighth month; so people view the moon at Mid-Autumn.
错：春节 || 春节是过年，不是赏月的节日。 || Spring Festival is the New Year, not for viewing the moon.
错：端午节 || 端午节纪念的是屈原。 || Dragon Boat Festival honours Qu Yuan.
错：元宵节 || 元宵节赏的是花灯，月也圆，但不是嫦娥的节日。 || the Lantern Festival is for lanterns, not for Chang'e.
验：从月亮对：中秋节的月亮最圆最亮，人们赏月、吃月饼、讲嫦娥的故事。 || Check by the moon: Mid-Autumn's moon is the fullest, when people eat mooncakes and tell of Chang'e.

问：大禹的父亲鲧用什么方法治水，结果失败了？
答：只靠筑堤去堵
据：《大禹治水》：鲧用息壤筑堤堵水，水越涨越高，九年也没有治好。 || “Yu Tames the Flood”: Gun dams the water with magic soil, but it rises higher, and after nine years the flood is still there.
错：开河把水引走 || 开河引水是大禹的办法。 || digging channels is Yu's method.
错：挖湖把水存起来 || 挖湖存水不是书里鲧的做法。 || storing water in lakes is not what Gun does.
错：请天神把水收走 || 鲧是偷了天帝的息壤，不是请天神收水。 || Gun steals the god's soil; he asks no god to take the water.
验：从父子对照：鲧“堵”失败，禹改用“疏”成功，两种办法正好相反。 || Check by father and son: Gun blocks and fails, Yu channels and succeeds.

问：大禹用什么方法治好了洪水？
答：开挖河道，把水引到海里
据：《大禹治水》：大禹改用疏导的办法，开挖河道，把洪水引进大海。 || “Yu Tames the Flood”: Yu channels the flood instead, digging courses to lead it to the sea.
错：修起高墙，把水挡住 || 修墙挡水是他父亲鲧的办法，失败了。 || walls are his father's way, which failed.
错：请来天神，把水收走 || 书里是靠人力挖河，不是请神。 || it is done by digging, not by gods.
错：带人搬到高山上住 || 搬到高山只是躲水，水没有治好。 || moving to the hills only flees the water.
验：从结果对：水顺着河道流进大海，不再泛滥，正是“引”而不是“挡”。 || Check by the result: led down its channels to the sea, the water no longer floods.

问：大禹治水时留下了哪个有名的故事？
答：三过家门而不入
据：《大禹治水》：大禹治水十三年，三次经过自己家门口都没有进去。 || “Yu Tames the Flood”: for thirteen years he passes his own door three times without going in.
错：一夜搬走一座山 || 搬山的故事是《愚公移山》。 || moving a mountain is the tale of the Foolish Old Man.
错：七天七夜不睡觉 || 书里没有七天七夜不睡的故事。 || there is no tale of seven sleepless days.
错：一箭射下九个太阳 || 射太阳的是后羿。 || shooting suns is Houyi's deed.
验：从他治水的年数对：十三年在外，路过家门却顾不上进去，正显出他一心为民。 || Check by the years: thirteen away, too busy to step inside his own door.

问：神农为什么要尝百草？
答：为了找到能治病的草药
据：《神农尝百草》（《淮南子》）：神农亲口尝百草，为了知道哪些能治病，哪些有毒。 || “Shennong Tastes a Hundred Herbs”, from the Huainanzi: he tastes plants to learn which heal and which poison.
错：为了找到好吃的野菜 || 他尝草是为了找药，不是为了找好吃的。 || he tastes for medicine, not for flavour.
错：为了找到不死药 || 不死药是西王母的，神农找的是治病的药。 || the elixir is the Queen Mother's; Shennong seeks cures.
错：为了喂养牛羊 || 书里不是为牛羊找草料。 || it is not fodder he seeks.
验：从他的称号对：后人尊他为医药之祖，中药书叫《神农本草经》，说明他尝草是为了治病。 || Check by his title: honoured as the father of medicine, he gives his name to the Shennong Herbal.

问：神农尝百草时，常常遇到什么危险？
答：吃下毒草而中毒
据：《神农尝百草》：他一天中毒七十次，靠找到解毒的草药才活下来。 || “Shennong Tastes a Hundred Herbs”: he is poisoned seventy times in a day and saved only by the antidotes he finds.
错：被大水冲走 || 书里没有洪水冲走他，洪水是大禹的故事。 || no flood sweeps him away; floods are Yu's.
错：被老虎咬伤 || 书里没写他被老虎咬。 || no tiger bites him.
错：在山里迷了路 || 书里的危险是毒草，不是迷路。 || the danger is poison, not getting lost.
验：从他尝草的方法对：要知道一种草有没有毒，只能亲口尝，所以最常遇到的危险就是中毒。 || Check by his method: the only way to know a poison is to taste it.

问：仓颉造字是受了什么启发？
答：鸟兽留下的脚印
据：《仓颉造字》（《淮南子》等）：仓颉看见鸟兽留在地上的脚印，各不相同，受到启发，创造了文字。 || “Cangjie Makes Writing”: seeing the different tracks birds and beasts leave, Cangjie is inspired to make characters.
错：天上星星的位置 || 星星的位置不是传说里的启发。 || the stars are not his inspiration.
错：水里游动的鱼 || 书里没有说是鱼。 || no fish inspire him.
错：树叶的纹路 || 书里没有说是树叶。 || no leaves inspire him.
验：从造字的道理对：脚印一看就知道是什么动物，一个符号代表一样东西，这正是文字的样子。 || Check by the idea: a track tells you the beast at a glance, as a sign stands for a thing.

问：传说仓颉是哪位帝王的史官？
答：黄帝
据：《仓颉造字》：传说仓颉是黄帝的史官。 || “Cangjie Makes Writing”: he is said to be the Yellow Emperor's scribe.
错：炎帝 || 炎帝是精卫的父亲。 || the Flame Emperor is Jingwei's father.
错：大禹 || 大禹是治水的英雄，比仓颉晚。 || Yu is the flood hero, later than Cangjie.
错：后羿 || 后羿是射日的英雄，不是帝王。 || Houyi is an archer, not an emperor.
验：从史官的职责对：史官要记事，正需要文字，所以造字的传说落在黄帝的史官身上。 || Check by his office: a scribe keeps records and needs writing.

问：哪个神话讲的是天和地是怎么来的？
答：盘古开天地
据：《盘古开天地》：这个神话讲天和地原来是一团混沌，被盘古劈开才有了天地。 || “Pangu Separates Heaven and Earth”: the myth tells how chaos was split by Pangu into sky and earth.
错：精卫填海 || 精卫填海讲的是一只鸟要填平大海。 || Jingwei is a bird filling the sea.
错：夸父逐日 || 夸父逐日讲的是追赶太阳。 || Kuafu chases the sun.
错：后羿射日 || 后羿射日讲的是射下多余的太阳。 || Houyi shoots down the extra suns.
验：从时间顺序对：盘古的故事排在全书最前面，其他神话都发生在天地已经有了以后。 || Check by order: Pangu's myth comes first; the others happen once heaven and earth exist.

问：中国古代神话常常表达了古人什么样的愿望？
答：战胜自然，过上好日子
据：全书：盘古开天、女娲补天、大禹治水、后羿射日，都是人和自然的灾难斗争，让百姓过上好日子。 || The book as a whole: Pangu, Nüwa, Yu and Houyi all fight the disasters of nature so that people can live well.
错：当上皇帝，管理天下 || 书里的英雄不是为了当皇帝。 || the heroes do not seek a throne.
错：打败别的部落 || 书里讲的是战胜自然，不是部落打仗。 || the struggle is with nature, not tribe against tribe.
错：得到很多金银财宝 || 神话里的英雄不求金银。 || the heroes seek no treasure.
验：举两个反例对：夸父、精卫都失败了，但古人仍然歌颂他们敢于和自然较量。 || Test by the failures: Kuafu and Jingwei lose, yet are praised for daring to match nature.
`,
  },
  {
    id: "journey-to-the-west",
    grade: 5,
    title: { en: "Journey to the West", zh: "西游记" },
    author: { en: "Wu Cheng'en", zh: "吴承恩" },
    guide: {
      en: "The book has two parts: Sun Wukong's early life and his rebellion in Heaven, then the long journey west with the monk and his three disciples. Keep a list of the four pilgrims with their weapons, their skills and their faults, and note which one solves or causes each trouble. Most adventures follow a pattern: a demon appears, captures the monk, and the disciples must find out who it is and how to defeat it. Notice how the characters change over the journey, and enjoy the humour, especially Zhu Bajie's.",
      zh: "全书可以分两大部分：先是孙悟空出世、学艺、大闹天宫，然后是唐僧师徒四人西天取经。给师徒四人各列一张卡片，写上兵器、本领和缺点，看看每次的麻烦是谁解决的、又是谁惹出来的。很多故事有相似的样子：妖怪出现、抓走唐僧，徒弟们要查清妖怪的来历、想办法打败它。留意人物在取经路上的变化，也读一读书里有趣的地方，特别是猪八戒。",
    },
    callout: {
      en: "The pilgrims meet many demons with the same tricks. Before you choose, place the question in its own episode, then ask who did it: Wukong, Bajie, Sha Wujing or the monk; a right deed given to the wrong pilgrim is still wrong.",
      zh: "取经路上的妖怪很多，手段也相似。选之前先想清楚问的是哪一难，再想是谁做的：悟空、八戒、沙僧还是唐僧；事情对了，人说错了，还是错的。",
    },
    questions: `
问：孙悟空是怎样出生的？
答：从一块仙石里蹦出来
据：第一回：花果山顶有一块仙石，受天地精华，迸裂出一个石卵，化作一只石猴。 || Chapter 1: an immortal stone on the Mountain of Flowers and Fruit splits open, and its egg becomes a stone monkey.
错：从一个仙桃里生出来 || 仙桃是他后来在蟠桃园偷吃的（第五回）。 || immortal peaches are what he later steals from the orchard (chapter 5).
错：由东海龙王所生 || 东海龙王后来给了他金箍棒，不是他的父亲。 || the Dragon King of the Eastern Sea later gives him his staff; he is no father.
错：从一朵莲花里生出来 || 从莲花里重生的是哪吒，不是孙悟空。 || it is Nezha who is reborn from a lotus.
验：从他的名字对：他叫“石猴”，后来人称“猴头”是从石头里出来的，菩提祖师给他取姓“孙”，也没有父母可依。 || Check by his name: the “stone monkey” has no parents; even his surname comes from his master.

问：众猴为什么拜孙悟空为王？
答：他第一个跳进了水帘洞
据：第一回：群猴说谁能钻进瀑布里找到源头不伤身体，就拜他为王；石猴第一个跳了进去，发现了水帘洞。 || Chapter 1: the monkeys promise to make king whoever can go through the waterfall unhurt; the stone monkey leaps first and finds the Water Curtain Cave.
错：他打败了山里的老虎 || 书里没有他打老虎的情节，他在花果山和虎豹为伴。 || he fights no tiger; he lives among tigers and leopards in peace.
错：他的年纪最大 || 他是新出生的石猴，并不年长。 || he is newly born, not the eldest.
错：他会七十二变 || 七十二变是他后来跟菩提祖师学的。 || the seventy-two changes he learns later from Patriarch Subodhi.
验：从他的称号对：他从此自称“美猴王”，住在水帘洞，王位和水帘洞是连在一起的。 || Check by his title: from then on he is the Handsome Monkey King of the Water Curtain Cave.

问：孙悟空跟谁学会了七十二变和筋斗云？
答：菩提祖师
据：第二回：他漂洋过海，在灵台方寸山拜菩提祖师为师，学会了七十二变和筋斗云。 || Chapter 2: crossing the seas, he becomes Patriarch Subodhi's pupil on the Mountain of Mind and learns the seventy-two changes and the cloud somersault.
错：唐僧 || 唐僧是他后来取经时的师父，只会念经和紧箍咒。 || Tang Seng is his later master on the pilgrimage, who knows sutras and the tightening spell.
错：太上老君 || 太上老君把他放进八卦炉里炼，不是教他本领。 || Laozi puts him into the furnace; he teaches him nothing.
错：如来佛祖 || 如来佛祖是把他压在五行山下的人。 || the Buddha is the one who pins him under the mountain.
验：从师父的话对：菩提祖师赶他走时不许他说出师父是谁，后来他的本领从不提师门，正因为这个约定。 || Check by the parting: Subodhi forbids him ever to name his teacher, which is why he never does.

问：孙悟空一个筋斗能翻多远？
答：十万八千里
据：第二回：菩提祖师教他筋斗云，一个筋斗能翻十万八千里。 || Chapter 2: Subodhi teaches him the cloud somersault, which carries him a hundred and eight thousand li in one leap.
错：八万四千里 || 八万四千是佛经里常说的数（如“八万四千法门”），不是筋斗云的距离。 || eighty-four thousand is a number the sutras love, as in the eighty-four thousand gates of the Dharma; it is not his somersault.
错：一万八千里 || 一万八千少了“十万”，书里是十万八千里。 || eighteen thousand drops the hundred thousand; it is a hundred and eight thousand.
错：九万里 || 九万里是《逍遥游》里大鹏乘风而上的高度。 || ninety thousand li is how high the great Peng rises in Zhuangzi's “Free and Easy Wandering”.
验：对照第七回：他在如来手掌里翻筋斗，以为翻出了十万八千里，其实没出手心，“十万八千里”正是这里的笑点。 || Set it beside chapter 7: he somersaults his hundred and eight thousand li and never leaves the Buddha's palm.

问：孙悟空的金箍棒是从哪里得到的？
答：东海龙宫
据：第三回：他到东海龙宫借兵器，拿走了定海神针，就是如意金箍棒。 || Chapter 3: he goes to the Dragon Palace of the Eastern Sea for a weapon and takes the pillar that steadies the sea, the As-You-Will gold-banded staff.
错：天宫 || 天宫给了他官职，不是兵器。 || Heaven gives him offices, not a weapon.
错：花果山 || 花果山是他的家，那里只有凡间兵器。 || the Mountain of Flowers and Fruit is his home, with only earthly arms.
错：太上老君的丹房 || 他在丹房偷吃的是金丹（第五回）。 || in Laozi's chamber he steals the elixir pills (chapter 5).
验：从龙王的反应对：龙王丢了定海神针，上天告状，这正是天宫第一次招安他的起因。 || Check by what follows: the dragon kings complain to Heaven, and Heaven first summons him.

问：玉皇大帝第一次给孙悟空的官职是什么？
答：弼马温
据：第四回：玉帝招安他上天，封了个看马的小官“弼马温”。 || Chapter 4: summoned to Heaven, he is made Keeper of the Horses, the lowly bimawen.
错：齐天大圣 || “齐天大圣”是他嫌官小回花果山后，第二次招安时才封的。 || Great Sage Equal to Heaven comes with the second summons, after he storms home.
错：天蓬元帅 || 天蓬元帅是猪八戒在天上的官。 || Marshal Tianpeng is Zhu Bajie's post in Heaven.
错：卷帘大将 || 卷帘大将是沙僧在天上的官。 || the Curtain-Raising General is Sha Seng's post.
验：从他为什么反下天宫对：他听说弼马温“未入流”，最小最低，才一怒之下打回花果山。 || Check by why he rebels: he learns the post is below all rank and storms back home.

问：孙悟空第二次上天后，被派去看管什么？
答：蟠桃园
据：第五回：第二次上天封了齐天大圣，玉帝让他管蟠桃园，他偷吃了园里的仙桃。 || Chapter 5: made Great Sage, he is put in charge of the peach orchard, and eats its peaches.
错：天上的马 || 看马是第一次上天当弼马温时的事。 || tending horses was his first post.
错：炼丹炉 || 炼丹炉是他被抓后关进去的地方。 || the furnace is where he is put after his capture.
错：天河 || 管天河的是天蓬元帅，就是后来的猪八戒。 || the Heavenly River is Marshal Tianpeng's charge, later Bajie.
验：从后面情节对：七仙女来摘桃，他才知道蟠桃会没有请他，于是大闹蟠桃会，事情都从蟠桃园引出来。 || Check by what follows: the fairies come for peaches, he learns he is not invited to the feast, and the havoc begins.

问：孙悟空在八卦炉里炼出了什么本领？
答：火眼金睛
据：第七回：太上老君把他放进八卦炉里炼了四十九天，烟熏坏了眼睛，却炼成了火眼金睛。 || Chapter 7: Laozi burns him in the trigram furnace for forty-nine days; the smoke reddens his eyes into fiery golden eyes.
错：七十二变 || 七十二变是菩提祖师教的（第二回）。 || the seventy-two changes come from Subodhi (chapter 2).
错：筋斗云 || 筋斗云也是菩提祖师教的。 || the cloud somersault also comes from Subodhi.
错：分身法 || 拔毫毛变出许多猴子的本领，他在花果山时就会用了。 || the hairs that become many monkeys he could use long before.
验：从后来的用处对：取经路上他一眼看出白骨精的真身，靠的就是火眼金睛。 || Check by later use: he sees through the White Bone Demon on the road with those eyes.

问：大闹天宫后，是谁把孙悟空压在了山下？
答：如来佛祖
据：第七回：天兵天将都制服不了他，玉帝请来如来佛祖，如来把他压在五行山下。 || Chapter 7: when no army can hold him, the Jade Emperor calls the Buddha, who pins him under Five Elements Mountain.
错：玉皇大帝 || 玉帝正是因为管不住他才请如来的。 || the Jade Emperor sends for the Buddha because he cannot.
错：观音菩萨 || 观音推荐了二郎神，没有压他。 || Guanyin recommends Erlang; she pins no one.
错：二郎神 || 二郎神在第六回抓住过他，但他又从八卦炉里逃了出来。 || Erlang catches him in chapter 6, but he escapes from the furnace.
验：从手掌对：如来和他打赌翻出手心，翻手一压，手掌化成五座山，压人的只能是如来。 || Check by the palm: the Buddha's hand becomes the five peaks that pin him.

问：孙悟空被压在哪座山下？
答：五行山
据：第七回：如来的五指化作金、木、水、火、土五座联山，叫五行山，把他压在下面五百年。 || Chapter 7: the Buddha's five fingers become five joined peaks, metal, wood, water, fire and earth, the Five Elements Mountain.
错：花果山 || 花果山是他的老家，不是压他的山。 || the Mountain of Flowers and Fruit is his home.
错：火焰山 || 火焰山是取经路上的难关（第五十九回）。 || Flaming Mountain is a trial on the road (chapter 59).
错：灵山 || 灵山是如来住的地方，也是取经的终点。 || Vulture Peak is the Buddha's seat and the pilgrims' goal.
验：从“五”对：五根手指，五行，五座连在一起的山，名字就从这里来。 || Check by five: five fingers, five elements, five peaks.

问：孙悟空大闹天宫，最能说明他什么性格？
答：不怕权威，敢于反抗
据：第三至七回：他敢夺龙宫宝贝、闯地府勾生死簿、嫌官小反出天宫、自封齐天大圣。 || Chapters 3 to 7: he takes the dragons' treasure, strikes his name from the Book of Life and Death, scorns his post and names himself Equal to Heaven.
错：胆小怕事，处处躲避 || 他打遍天兵天将，从不躲避。 || he fights all Heaven's armies and never hides.
错：贪图享乐，不肯吃苦 || 他嫌的是官小，不是怕吃苦。 || he scorns a lowly post, not hardship.
错：老实听话，从不惹事 || 他处处惹事，正好相反。 || he stirs up trouble everywhere.
验：从他的口号对：“皇帝轮流做，明年到我家”，这句话最能看出他不服权威。 || Check by his cry: emperors take turns, and next year it is mine.

问：唐僧去西天是为了什么？
答：取回真经
据：第十二、十三回：唐太宗派唐僧去西天拜佛，取回能超度亡魂的大乘真经。 || Chapters 12 and 13: Emperor Taizong sends Tang Seng west to fetch the Mahayana scriptures.
错：寻找徒弟 || 徒弟是观音一路安排的，不是他的目的。 || his disciples are arranged by Guanyin along the way; they are not his aim.
错：求长生不老 || 求长生的是妖怪，他们想吃他的肉。 || it is the demons who want long life, by eating him.
错：消灭所有妖怪 || 他心肠软，不主张杀妖怪。 || he is soft-hearted and against killing.
验：从结尾对：第九十八回他们在灵山取到经书，第一百回送回长安，取经的目的到这里才算完成。 || Check by the end: they receive the scriptures on Vulture Peak (chapter 98) and bring them to Chang'an (chapter 100).

问：唐僧取经是从哪里出发的？
答：长安
据：第十三回：唐僧从长安出发，太宗亲自送他出城。 || Chapter 13: he sets out from Chang'an, seen off by the emperor himself.
错：洛阳 || 洛阳不是唐朝的京城，唐僧从长安出发。 || Luoyang is not where he starts; the capital is Chang'an.
错：花果山 || 花果山是孙悟空的家。 || the Mountain of Flowers and Fruit is Wukong's home.
错：灵山 || 灵山是终点，不是起点。 || Vulture Peak is where he ends, not where he begins.
验：从全书结尾对：取到经后他们又回到长安，交给唐太宗，起点和终点是同一个城。 || Check by the end: they bring the scriptures back to Chang'an; it is both start and finish.

问：唐僧用什么办法管住孙悟空？
答：念紧箍咒
据：第十四回：观音给唐僧一顶花帽和紧箍咒，孙悟空戴上后，唐僧一念咒他就头疼。 || Chapter 14: Guanyin gives Tang Seng a cap and the tightening spell; once Wukong wears it, the spell makes his head ache.
错：抢走金箍棒 || 金箍棒一直在孙悟空手里，唐僧拿不动。 || the staff stays in Wukong's hand; Tang Seng could not lift it.
错：请观音来帮忙 || 观音只是传给他咒语，管他的是唐僧自己念咒。 || Guanyin only teaches the spell; Tang Seng uses it.
错：不给他饭吃 || 书里没有用不给饭吃来管他。 || withholding food is never his method.
验：从三打白骨精对：唐僧一连念紧箍咒，悟空疼得满地打滚，可见这是唐僧管他的办法。 || Check by the White Bone Demon: Tang Seng chants and Wukong writhes; that is his hold.

问：猪八戒原来在天上是什么官？
答：天蓬元帅
据：第八回、第十九回：猪八戒原是天上的天蓬元帅，因调戏嫦娥被贬下凡，错投了猪胎。 || Chapters 8 and 19: Bajie was Marshal Tianpeng in Heaven, sent down for flirting with Chang'e, and born by mistake in a sow.
错：卷帘大将 || 卷帘大将是沙僧。 || the Curtain-Raising General is Sha Seng.
错：弼马温 || 弼马温是孙悟空的第一个官职。 || Keeper of the Horses is Wukong's first post.
错：齐天大圣 || 齐天大圣是孙悟空的封号。 || Great Sage Equal to Heaven is Wukong's title.
验：从他的兵器对：九齿钉耙是天蓬元帅的兵器，跟着他一起下凡。 || Check by his weapon: the nine-toothed rake came with him from Heaven.

问：猪八戒用的兵器是什么？
答：九齿钉耙
据：第十九回：猪八戒用一柄九齿钉耙，是他当天蓬元帅时的兵器。 || Chapter 19: Bajie fights with a nine-toothed rake, his weapon as Marshal Tianpeng.
错：降妖宝杖 || 降妖宝杖是沙僧的兵器。 || the demon-quelling staff is Sha Seng's.
错：金箍棒 || 金箍棒是孙悟空的。 || the gold-banded staff is Wukong's.
错：三尖两刃刀 || 三尖两刃刀是二郎神的兵器。 || the three-pointed blade is Erlang's.
验：从他投奔时的情景对：他在高老庄扛着钉耙和悟空大战，钉耙从一开始就跟着他。 || Check by Gao Village: he fights Wukong there with the rake on his shoulder.

问：沙僧原来在天上是什么官？
答：卷帘大将
据：第八回、第二十二回：沙僧原是卷帘大将，因在蟠桃会上打碎了琉璃盏被贬到流沙河。 || Chapters 8 and 22: Sha Seng was the Curtain-Raising General, banished to the Flowing Sands River for breaking a crystal cup at the peach feast.
错：天蓬元帅 || 天蓬元帅是猪八戒。 || Marshal Tianpeng is Bajie.
错：托塔天王 || 托塔天王是李靖，哪吒的父亲。 || the Pagoda-Bearing King is Li Jing, Nezha's father.
错：东海龙王 || 东海龙王送了金箍棒，和沙僧无关。 || the Dragon King of the Eastern Sea gave the staff; he is no one's past life here.
验：从他住的地方对：他被贬在流沙河当妖怪，后来在那里被收为徒弟，和“打碎琉璃盏”的罪对得上。 || Check by his river: banished to the Flowing Sands, he is taken on there.

问：唐僧骑的白龙马原来是谁？
答：西海龙王的三太子
据：第八回、第十五回：白龙马原是西海龙王敖闰的三太子，因烧了殿上明珠犯了死罪，观音救下让他驮唐僧。 || Chapters 8 and 15: the white horse was the third son of the Dragon King of the Western Sea, condemned for burning a pearl; Guanyin spares him to carry Tang Seng.
错：东海龙王的儿子 || 东海龙王送了孙悟空金箍棒，书里不是他的儿子。 || the Eastern Sea's king gave the staff; it is not his son.
错：天宫里的天马 || 天马是孙悟空当弼马温时看管的马。 || heavenly horses are what Wukong tended as Keeper.
错：山中的一只白狐 || 书里没有白狐变马。 || no white fox becomes a horse.
验：从他出场的情节对：鹰愁涧里一条白龙吃了唐僧的马，于是变成白马顶替，前后正好接上。 || Check by Eagle Grief Stream: a white dragon eats Tang Seng's horse and becomes the horse in its place.

问：师徒中谁最常挑着担子，还常常劝师兄们别吵？
答：沙僧
据：第二十二回以后：沙僧挑着行李担子，师兄吵架时常出来劝和。 || From chapter 22: Sha Seng carries the luggage and often makes peace when the others quarrel.
错：猪八戒 || 猪八戒常嫌担子重、闹着要散伙，挑起事端的多是他。 || Bajie grumbles at the load and keeps proposing they split up; he starts the quarrels.
错：孙悟空 || 孙悟空在前面开路打妖怪，是常和八戒吵的人。 || Wukong clears the road ahead and is the one quarrelling with Bajie.
错：白龙马 || 白龙马驮的是唐僧，不会说话劝人。 || the white horse carries Tang Seng and seldom speaks.
验：从性格对：沙僧老实忠厚，话少，正适合做挑担和劝和的人。 || Check by his nature: honest and quiet, he is the one to carry and to calm.

问：哪一句最符合猪八戒的样子？
答：好吃懒做，却也憨厚可爱
据：书中八戒的多处情节：他贪吃贪睡，爱偷懒，常闹着散伙回高老庄，但打妖怪也出力，憨直可爱。 || Bajie throughout: greedy, sleepy, lazy, always ready to go home to Gao Village, yet he fights when he must and is lovable in his bluntness.
错：本领高强，嫉恶如仇 || 本领高强、嫉恶如仇说的是孙悟空。 || great powers and hatred of evil describe Wukong.
错：沉默寡言，从不抱怨 || 沉默寡言、从不抱怨说的是沙僧。 || quiet and uncomplaining describe Sha Seng.
错：一心向佛，从不动摇 || 一心向佛、从不动摇说的是唐僧。 || single-minded devotion describes Tang Seng.
验：从他的法名对：观音给他取名“悟能”，唐僧又叫他“八戒”，要他戒掉荤腥，正因为他太贪吃。 || Check by his names: Tang Seng calls him “Eight Precepts” to curb his appetite.

问：路上的妖怪大多想从唐僧那里得到什么？
答：吃唐僧肉，长生不老
据：书中多处：妖怪们都听说唐僧是金蝉子转世，吃他一块肉就能长生不老。 || Throughout: the demons hear that Tang Seng is the Golden Cicada reborn, and a bite of him gives long life.
错：抢走他的通关文牒 || 妖怪要的是他的肉，不是文书。 || the demons want his flesh, not his papers.
错：抢走他的白龙马 || 白龙马是龙太子变的，妖怪不是冲它来的。 || the horse is a dragon prince; no demon is after it.
错：拜他做师父 || 妖怪想吃他，不是拜他为师。 || they want to eat him, not learn from him.
验：从白骨精的话对：她一见唐僧就说“造化了”，吃他的肉可以长寿，正是这个原因。 || Check by the White Bone Demon: she rejoices that his flesh will make her live forever.

问：白骨精三次变化，先后变成了哪些人？
答：村姑、老妇人、老公公
据：第二十七回：白骨精先变成送饭的村姑，再变成找女儿的老妇人，最后变成找妻女的老公公。 || Chapter 27: the White Bone Demon becomes a village girl with food, then an old woman seeking her daughter, then an old man seeking both.
错：小孩、老妇人、老公公 || 第一次变的是年轻村姑，不是小孩。 || the first form is a young village girl, not a child.
错：村姑、和尚、老公公 || 第二次变的是老妇人，没有和尚。 || there is no monk among her forms.
错：仙女、老妇人、书生 || 她没有变仙女和书生。 || she never becomes a fairy or a scholar.
验：从一家人的关系对：先是女儿，再是来找女儿的母亲，最后是来找她们的父亲，三次变化正好凑成一家。 || Check by the family: daughter, mother looking for her, father looking for both.

问：三打白骨精以后，唐僧做了什么？
答：把孙悟空赶走了
据：第二十七回：唐僧以为悟空连杀三人，写了贬书把他赶回花果山。 || Chapter 27: believing Wukong has killed three people, Tang Seng writes him a letter of dismissal and sends him home.
错：重重夸奖了孙悟空 || 唐僧恰恰是错怪了他，没有夸他。 || far from praise, he wrongs him.
错：把猪八戒赶走了 || 猪八戒说坏话，却没被赶走。 || Bajie spoke against Wukong and stayed.
错：自己回了长安 || 唐僧继续西行，没有回长安。 || Tang Seng goes on west, not home.
验：从后面情节对：第三十一回唐僧被黄袍怪变成老虎，八戒去花果山请回悟空，说明悟空之前被赶走了。 || Check by chapter 31: when Tang Seng is turned into a tiger, Bajie must fetch Wukong back from home.

问：三打白骨精时，谁在唐僧面前说孙悟空的坏话？
答：猪八戒
据：第二十七回：猪八戒在一旁挑唆，说悟空用障眼法变出尸体，让师父念紧箍咒。 || Chapter 27: Bajie stirs things up, saying Wukong conjured the bodies, and urges the master to chant the spell.
错：沙僧 || 沙僧没有说坏话，还劝过师父。 || Sha Seng says nothing against him.
错：白龙马 || 白龙马不说话，也没有挑拨。 || the horse says nothing.
错：观音菩萨 || 观音这时不在场。 || Guanyin is not there.
验：从八戒的性格对：他常被悟空捉弄，心里有怨气，才会趁机说坏话。 || Check by his grudge: often teased by Wukong, he takes his chance.

问：唐僧多次错怪孙悟空，说明了他什么？
答：心地善良，却分不清真假
据：第二十七回等：唐僧几次把妖怪当好人，反而怪悟空乱杀，可他是出于慈悲。 || Chapter 27 and others: more than once Tang Seng takes demons for good people and blames Wukong, out of mercy.
错：一直讨厌孙悟空 || 他事后常后悔，并不是讨厌悟空。 || he often regrets it afterwards; he does not hate Wukong.
错：比孙悟空更聪明 || 他看不出妖怪，比悟空更容易受骗。 || he cannot see through demons; he is easier to fool.
错：胆子很大，不怕妖怪 || 他遇到妖怪就吓得发抖。 || he trembles at every demon.
验：从他的身份对：他是一心向善的和尚，见人就想救，却没有火眼金睛，所以总分不清真假。 || Check by who he is: a merciful monk without fiery eyes, he cannot tell true from false.

问：过火焰山时，孙悟空要借什么宝贝？
答：芭蕉扇
据：第五十九至六十一回：火焰山挡住去路，只有铁扇公主的芭蕉扇能扇灭大火。 || Chapters 59 to 61: Flaming Mountain blocks the road, and only Princess Iron Fan's plantain fan can put out the fire.
错：紫金葫芦 || 紫金葫芦是金角大王、银角大王的宝贝（第三十四、三十五回）。 || the purple-gold gourd belongs to the Golden and Silver Horned Kings (chapters 34 and 35).
错：玉净瓶 || 玉净瓶是观音菩萨的净瓶。 || the jade vase is Guanyin's.
错：照妖镜 || 照妖镜是托塔天王的宝贝。 || the demon-revealing mirror is the Pagoda-Bearing King's.
验：从“扇”对：要灭火得扇风下雨，一扇熄火、二扇生风、三扇下雨，只有扇子做得到。 || Check by the fan's three strokes: fire out, wind up, rain down.

问：芭蕉扇在谁的手里？
答：铁扇公主
据：第五十九回：芭蕉扇在罗刹女，也就是铁扇公主手里。 || Chapter 59: the fan belongs to the Rakshasi, Princess Iron Fan.
错：白骨精 || 白骨精在第二十七回就被打死了。 || the White Bone Demon dies in chapter 27.
错：女儿国国王 || 女儿国国王没有芭蕉扇。 || the queen of the Women's Kingdom has no fan.
错：观音菩萨 || 观音手里的是净瓶。 || Guanyin holds the vase.
验：从她的名字对：“铁扇公主”的名字就带着扇子。 || Check by her name: Princess Iron Fan.

问：铁扇公主为什么不肯把扇子借给孙悟空？
答：她恨孙悟空收服了红孩儿
据：第五十九回：铁扇公主是红孩儿的母亲，恨悟空请观音收走了她的儿子。 || Chapter 59: she is Red Boy's mother and hates Wukong for having Guanyin take her son away.
错：扇子已经坏了 || 扇子好好的，后来悟空借到假扇才扇不灭火。 || the fan is whole; it is the false one she gives that fails.
错：她也想吃唐僧肉 || 她要的是报仇，不是吃唐僧肉。 || she wants revenge, not his flesh.
错：她不认识孙悟空 || 她认识悟空，牛魔王还是悟空的结拜兄弟。 || she knows him well; the Bull Demon King is his sworn brother.
验：从人物关系对：红孩儿在第四十至四十二回被观音收作善财童子，正是这件事让铁扇公主记恨。 || Check by family: Red Boy became Guanyin's page in chapters 40 to 42, and that is her grudge.

问：在女儿国，国王想让唐僧做什么？
答：留下来和她成亲
据：第五十四回：西梁女国的国王看中了唐僧，想招他为夫，让他当国王。 || Chapter 54: the queen of the Women's Kingdom wants Tang Seng as her husband and king.
错：把真经留给她 || 她要的是唐僧这个人，不是真经。 || she wants the man, not the scriptures.
错：帮她打败妖怪 || 女儿国没有妖怪要她打，后来的蝎子精是另一回事。 || the queen fights no demon; the scorpion spirit is another matter.
错：收她做徒弟 || 她没有要拜唐僧为师。 || she does not ask to be his pupil.
验：从唐僧的应对对：悟空出主意假装答应，骗来通关文牒再走，说明国王求的是成亲。 || Check by the ruse: Wukong has him feign agreement to get the travel papers, so marriage is what she asks.

问：真假美猴王中，假孙悟空其实是什么？
答：六耳猕猴
据：第五十八回：假悟空是六耳猕猴，如来说出他的来历，悟空一棒打死了他。 || Chapter 58: the false Wukong is a six-eared macaque, named by the Buddha and killed by Wukong.
错：一只狐狸精 || 书里没有狐狸精冒充悟空。 || no fox spirit impersonates him.
错：红孩儿 || 红孩儿早被观音收服了。 || Red Boy was already taken by Guanyin.
错：白骨精 || 白骨精第二十七回就死了。 || the White Bone Demon died in chapter 27.
验：从“六耳”对：如来说六耳猕猴善于聆音，能知千里外之事，所以能学得和悟空一模一样。 || Check by the six ears: the Buddha says it hears all, so it could copy Wukong perfectly.

问：真假美猴王中，最后是谁分辨出了真假？
答：如来佛祖
据：第五十八回：两个悟空打到灵山，如来说出了六耳猕猴的真相。 || Chapter 58: the two Wukongs fight their way to Vulture Peak, and the Buddha reveals the macaque.
错：观音菩萨 || 观音念紧箍咒，两个都喊疼，分不出来。 || Guanyin chants the spell and both cry out; she cannot tell.
错：唐僧 || 唐僧念咒也分不出。 || Tang Seng's spell fails too.
错：玉皇大帝 || 玉帝用照妖镜照，也照不出来。 || the Jade Emperor's mirror shows nothing.
验：从过程排一排：唐僧、观音、玉帝、地藏都分不出，最后到如来那里才分清，可见只有如来能辨。 || Check by the order: master, Guanyin, Jade Emperor and the underworld all fail before the Buddha succeeds.

问：唐僧师徒取经一共经历了多少难？
答：九九八十一难
据：第九十九回：观音查对取经簿，师徒一共经历了九九八十一难。 || Chapter 99: Guanyin checks the record and finds the pilgrims have passed eighty-one ordeals.
错：七十二难 || 七十二是孙悟空的变化之数。 || seventy-two is the number of Wukong's changes.
错：一百零八难 || 一百零八是《水浒传》好汉的人数。 || a hundred and eight is the number of heroes in Water Margin.
错：三十六难 || 三十六不是书里的数。 || thirty-six is not the book's number.
验：从情节对：取经回程时还差一难，观音特意补上通天河落水一难，凑足九九之数。 || Check by the last trial: one is missing on the way home, so they are dropped in the River of Heaven to make up eighty-one.

问：取经成功后，孙悟空被封为什么？
答：斗战胜佛
据：第一百回：如来封孙悟空为斗战胜佛。 || Chapter 100: the Buddha names Wukong the Victorious Fighting Buddha.
错：齐天大圣 || 齐天大圣是他在天宫自封的，后来玉帝认了。 || Great Sage is his own title from Heaven.
错：净坛使者 || 净坛使者是猪八戒的封号。 || Altar Cleanser is Bajie's.
错：美猴王 || 美猴王是他在花果山的称号。 || Handsome Monkey King is his name on his mountain.
验：对照师兄弟：唐僧封旃檀功德佛，八戒封净坛使者，沙僧封金身罗汉，悟空因一路降妖封斗战胜佛。 || Set it beside the others: Tang Seng a Buddha, Bajie the Altar Cleanser, Sha Seng an arhat, and Wukong the fighting Buddha.

问：《西游记》是哪个朝代写成的小说？
答：明代
据：作者和成书：《西游记》是明代吴承恩写成的。 || The book: Journey to the West was written in the Ming by Wu Cheng'en.
错：唐代 || 唐代是故事发生的时代，不是成书的时代。 || the Tang is when the story is set, not when it was written.
错：宋代 || 宋代有《大唐三藏取经诗话》这样的前身，还不是这部小说。 || the Song has forerunners such as the Tang Sanzang verse tale, not this novel.
错：清代 || 清代成书的是《红楼梦》。 || the Qing gives us Dream of the Red Chamber.
验：从四大名著对：《水浒传》《三国演义》《西游记》都成书于明代，只有《红楼梦》是清代。 || Check by the four classics: three are Ming, only the Red Chamber is Qing.

问：唐僧取经的故事最早来自什么？
答：唐代玄奘西行取经的真事
据：小说的来历：唐代高僧玄奘真的西行到天竺取经，回来写了《大唐西域记》，后人据此编出故事。 || Its source: the Tang monk Xuanzang really went to India for scriptures and wrote the Records of the Western Regions.
错：宋代一位和尚的游记 || 它来自唐代真事，宋代只是流传加工。 || it begins with a Tang journey; the Song only retold it.
错：作者自己做的一个梦 || 书里的故事有真实来历，不是作者做梦。 || it has a real source, not a dream.
错：一个外国的童话 || 它是中国的故事，不是外国童话。 || it is a Chinese story, not a foreign tale.
验：从唐僧的名字对：唐僧又叫“玄奘”“三藏”，正是这位真实高僧的法号。 || Check by his names: Xuanzang and Sanzang are the real monk's names.
`,
  },
  {
    id: "robinson-crusoe",
    grade: 6,
    title: { en: "Robinson Crusoe", zh: "鲁滨逊漂流记" },
    author: { en: "Daniel Defoe", zh: "笛福" },
    guide: {
      en: "Robinson tells his own story, so notice how he feels and reasons at each turn, not only what he does. Keep a timeline: his voyages before the island, the shipwreck, building a home, the footprint, Friday, and the rescue. List the problems he faces, such as food, shelter, loneliness and fear, and how he solves each with his hands and his head. Ask yourself what the long years alone teach him, and what you would have done in his place.",
      zh: "这本书是鲁滨逊自己讲自己的故事，读的时候不光要看他做了什么，还要留意他每一步的想法和心情。可以画一条时间线：上岛前的航海、遇难、建家园、发现脚印、救下星期五、最后获救。把他遇到的难题列出来，比如吃的、住的、孤独和害怕，再看看他是怎样动手动脑解决的。想一想：二十多年的独居生活让他明白了什么？如果你在他的位置，会怎么做？",
    },
    callout: {
      en: "Robinson's years on the island follow an order: the wreck, the shelter, the crops, the footprint, Friday, the ship. Place the question in that order before you choose; an act of a later year is wrong for an earlier one.",
      zh: "鲁滨逊在岛上的经历有先后：沉船、搭住处、种庄稼、发现脚印、救下星期五、搭船回国。选之前先把问题放回这个顺序里；后来才做的事，放在前面就错了。",
    },
    questions: `
问：鲁滨逊为什么要出海？
答：他一心想航海冒险
据：开头：鲁滨逊从小一心想航海，不顾家人反对，从约克郡跑到赫尔港上了船。 || The opening: from boyhood Robinson longs for the sea, and against his family's wishes he goes from York to Hull and boards a ship.
错：家里穷得没饭吃 || 他家是中等人家，生活过得去，父亲正是劝他守住安稳日子。 || his family is of the middle station and comfortable; his father urges him to keep that easy life.
错：被人骗到了船上 || 他是听朋友邀请自愿上船的，没人骗他。 || he boards willingly at a friend's invitation; no one tricks him.
错：要去外地找父亲 || 父亲就在家里，他是离开父亲出海的。 || his father is at home; he goes to sea by leaving him.
验：从他后来的经历对：每次脱险以后他都还要再出海，说明推动他的始终是冒险的心。 || Check by his later life: after every escape he goes to sea again; the longing drives him.

问：鲁滨逊第一次出海前，谁劝他不要去？
答：他的父亲
据：开头：父亲苦口婆心地劝他，说中等人家的生活最安稳，不要出海冒险。 || The opening: his father pleads with him that the middle station is the safest life, and not to go to sea.
错：一位船长 || 那位船长是在他第一次遇险以后才劝他别再出海的，不是出海前。 || the captain warns him only after the first wreck, not before he sails.
错：他的朋友 || 朋友恰恰是邀他上自家船的人。 || the friend is the one who invites him aboard.
错：他的老师 || 书里没有老师劝他。 || no teacher warns him.
验：从他流落荒岛后的反省对：他常想起父亲的话，后悔当初不听，可见劝他的正是父亲。 || Check by his remorse on the island: he often recalls his father's words.

问：第一次出海遇到风暴后，鲁滨逊是怎么想的？
答：后悔了，可风停后又忘了
据：第一次航行：风暴来时他吓坏了，后悔离家，可风一停，喝了酒，就把悔意忘了。 || His first voyage: terrified in the storm, he repents of leaving, but once it calms and he drinks with the sailors, he forgets.
错：发誓再也不出海了 || 他在风暴中确实这样想过，可风一停就抛在脑后，后来又一次次出海。 || he thinks so in the storm, but drops it as soon as it calms and sails again and again.
错：觉得风暴很好玩 || 风暴把他吓坏了，并不好玩。 || the storm terrifies him; it is no fun.
错：马上就回家去了 || 他没有回家，后来到伦敦又上了船。 || he does not go home; he goes to London and sails again.
验：从第二场风暴对：不久船在雅茅斯沉了，他又后悔，却还是没回家，悔了又忘正是他的毛病。 || Check by the second storm off Yarmouth: he repents again and still does not go home.

问：在一次早年的航行中，鲁滨逊遇到了什么？
答：被海盗抓去当了奴隶
据：早年的航行：他去几内亚做生意，船被土耳其海盗截住，他被带到萨累当了两年奴隶。 || His early voyages: trading to Guinea, his ship is taken by Turkish pirates, and he is a slave at Sallee for two years.
错：被野人抓去关了起来 || 被野人抓人是荒岛上后来的事，而且被抓的是星期五。 || cannibals with captives come much later on the island, and their captive is Friday.
错：船沉了，漂到了荒岛 || 漂到荒岛是后来去非洲贩运时的事。 || the island comes with a later voyage to Africa.
错：被父亲找回了家 || 父亲一直没有来找过他。 || his father never comes for him.
验：从他逃走的过程对：他带着少年佐立驾小船逃出萨累，被葡萄牙船长救起去了巴西，接上了后面的经历。 || Check by the escape: he flees Sallee in a boat with the boy Xury, and a Portuguese captain takes him to Brazil.

问：流落荒岛以前，鲁滨逊在哪里经营种植园？
答：巴西
据：早年的航行：葡萄牙船长把他带到巴西，他在那里买地经营甘蔗种植园。 || His early life: the Portuguese captain takes him to Brazil, where he buys land and plants sugar cane.
错：英国 || 英国是他的家乡，他在那里没有种植园。 || England is his home; he has no plantation there.
错：非洲 || 非洲是他去贩运的地方，船就是去非洲时出的事。 || Africa is where he sails to trade; that voyage ends in the wreck.
错：印度 || 书里没有去印度。 || he never goes to India.
验：从结尾对：回到英国后，正是巴西种植园这些年的收益让他成了富人。 || Check by the end: the plantation's earnings make him rich when he returns.

问：船遇到风暴撞坏以后，船上的人怎样了？
答：只有鲁滨逊活了下来
据：遇难的情节：船在暴风中搁浅，大家坐小艇逃生，小艇被大浪打翻，只有他一个人被冲上岸。 || The wreck: the ship runs aground, the crew take to the boat, a wave overturns it, and he alone is washed ashore.
错：大家都游到了岛上 || 别人都淹死了，他上岸后只看到几顶帽子和两只不成对的鞋。 || the rest drown; ashore he finds only some hats and two odd shoes.
错：船长和他一起活了下来 || 船长也和别人一起淹死了。 || the captain drowns with the rest.
错：全被路过的船救走了 || 没有船来救，他在岛上待了二十八年。 || no ship comes; he stays twenty-eight years.
验：从后面对：他一个人在岛上很多年都没见过一个人，直到看到脚印，说明当时只有他活下来。 || Check by what follows: for years he sees no one, until the footprint.

问：上岛的第一个晚上，鲁滨逊睡在哪里？
答：一棵树上
据：上岛第一天：他怕夜里有野兽，就爬到一棵大树上，拿一根短棍防身，睡了一夜。 || His first day ashore: fearing wild beasts, he climbs a tree with a short stick for defence and sleeps there.
错：一个山洞里 || 山洞是他后来挖出来、找到的。 || the cave comes later.
错：破船上 || 他第二天才游到破船上。 || he swims out to the wreck the next day.
错：沙滩上 || 他怕野兽，不敢睡在沙滩上。 || he fears beasts and dares not sleep on the sand.
验：从他当时的处境对：刚上岸什么工具都没有，只有一把小刀、一只烟斗，只能先上树躲避。 || Check by what he has: only a knife and a pipe, so a tree is his only refuge.

问：鲁滨逊从破船上运回了哪些东西？
答：粮食、工具和枪支
据：上岛初期：他扎了木筏，一趟趟从破船上运回粮食、木匠工具、枪支和火药。 || His first days: he builds rafts and brings off food, carpenter's tools, guns and powder.
错：只有几件衣服 || 他运回的远不止衣服，最要紧的是工具和枪。 || he takes far more than clothes; tools and guns matter most.
错：一条完好的小船 || 船上的小艇早翻了，他是扎木筏运东西的。 || the ship's boat is lost; he uses rafts.
错：一群活的山羊 || 船上活着的只有一条狗和两只猫，山羊是岛上的野羊。 || the only live animals aboard are a dog and two cats; the goats are wild on the island.
验：从他后来的生活对：盖房、打猎、种地都靠这些工具和枪，正是从破船上运来的。 || Check by his later life: building, hunting and farming all depend on those tools and guns.

问：鲁滨逊把处境的好处和坏处分两栏写下来，说明他什么？
答：遇事冷静，往好处想
据：上岛初期：他把“坏处”和“好处”像记账一样分两栏写下来，发现处境里也有可感谢的事。 || His early days: he sets out the evil and the good of his state in two columns, like an account, and finds things to be thankful for.
错：很喜欢写字 || 他写下来是为了想清楚处境，不是为了练字。 || he writes to think, not to practise writing.
错：想写信向人求救 || 岛上没有人收信，他也没写信。 || there is no one to receive a letter.
错：怕忘了日子 || 记日子是用木柱刻痕，这两栏写的是好坏。 || he counts days on a post; the columns weigh good and bad.
验：从他之后的做法对：写完以后他不再整天哀叹，开始动手安排生活，正说明他冷静、往好处想。 || Check by what he does next: he stops lamenting and sets to work.

问：鲁滨逊是怎样记住日子的？
答：在木柱上刻刻痕
据：上岛初期：他立起一根大木柱，每天用刀刻一道痕，七天刻长一点，一个月再长一点。 || His early days: he sets up a large post and cuts a notch each day, a longer one each week and longer still each month.
错：在沙滩上画线 || 沙滩上的线会被潮水冲掉，书里是木柱。 || lines on the sand wash away; he uses a post.
错：数月亮的圆缺 || 书里没写他数月亮。 || he does not count the moons.
错：在石头上画画 || 书里没有在石头上画画。 || he draws no pictures on stone.
验：从后面对：他靠这根木柱知道日子，后来救星期五那天才说得出是“星期五”。 || Check by later: thanks to the post he knows that the day he saves Friday is a Friday.

问：鲁滨逊怎样保护自己的住所？
答：用木桩围起一道墙
据：上岛初期：他在小山坡前的平地上搭帐篷，外面打下两排木桩，围成一道坚固的墙，用梯子进出。 || His early days: he pitches his tent on a ledge and drives two rows of stakes around it as a wall, going in and out by a ladder.
错：挖了一条大河 || 书里没有挖河。 || he digs no river.
错：一直住在树上 || 他只在第一夜睡在树上。 || he sleeps in a tree only on the first night.
错：养了很多条狗 || 船上只带下一条狗。 || he has only the one dog from the ship.
验：从梯子对：他把梯子收进墙里，外面的人就进不来，正说明是一道木桩墙。 || Check by the ladder: pulled in after him, it leaves the wall closed.

问：鲁滨逊在岛上种出了什么粮食？
答：大麦和稻子
据：上岛后的种植：他倒掉装鸡饲料的袋子，后来那里长出了大麦和稻子，他留种种了下来。 || His farming: he shakes out a bag of chicken feed, and barley and rice spring up, which he saves and sows.
错：玉米和小麦 || 书里没有玉米；英文“corn”泛指谷物，长出来的是大麦和稻子。 || there is no maize; the English “corn” means grain, and what grows is barley and rice.
错：土豆和红薯 || 土豆和红薯不在书里。 || there are no potatoes in the book.
错：黄豆和绿豆 || 书里没有种豆子。 || he grows no beans.
验：从来历对：鸡饲料里本来就是大麦和稻谷，撒掉的种子才长出这两种。 || Check by the source: the feed was barley and rice, so that is what grew.

问：鲁滨逊养了什么动物，能吃肉又能喝奶？
答：山羊
据：上岛后：他捉来野山羊，圈养起来，吃羊肉、喝羊奶，还做黄油和奶酪。 || On the island: he catches wild goats and keeps them for meat, milk, butter and cheese.
错：野牛 || 岛上没有野牛。 || there are no buffalo.
错：鹿 || 书里没有鹿。 || there are no deer.
错：猪 || 书里没有猪。 || there are no pigs.
验：从他的衣服对：他还用山羊皮做帽子、衣服和伞，山羊是他最重要的家畜。 || Check by his clothes: goatskin cap, coat and umbrella.

问：鲁滨逊用什么办法让山羊不跑掉？
答：用篱笆把它们圈起来
据：上岛后：他用篱笆围出几块地，把捉来的小山羊圈在里面养。 || On the island: he hedges in several enclosures and keeps the young goats inside.
错：用绳子拴在家门口 || 拴在门口养不了一大群。 || a tether cannot hold a flock.
错：把它们关进山洞里 || 书里没有把羊关进山洞。 || he does not shut them in the cave.
错：每天守在它们身边 || 他还要种地、打猎，不能整天守着。 || he must farm and hunt; he cannot watch them all day.
验：从羊群的数目对：后来他有几十只羊，只有用篱笆圈地才养得下。 || Check by number: dozens of goats need enclosures.

问：鲁滨逊用什么做成了蜡烛？
答：山羊油
据：上岛后：没有蜡烛，他用山羊的油脂做成灯，夜里照明。 || On the island: lacking candles, he makes lamps from goat's tallow.
错：蜂蜡 || 他没有蜂蜡。 || he has no beeswax.
错：鱼油 || 书里用的不是鱼油。 || he does not use fish oil.
错：松脂 || 书里没有松脂。 || he does not use pine resin.
验：从他养的动物对：山羊既供肉和奶，杀羊剩下的油脂正好拿来点灯。 || Check by the goats: their fat is at hand after butchering.

问：鲁滨逊做陶器是为了什么？
答：用来盛水和煮东西
据：上岛后：他用黏土烧成罐子和锅，用来盛水、煮肉汤。 || On the island: he fires clay into pots to hold water and cook broth.
错：卖给路过的人 || 岛上没有路过的人。 || there is no one passing to sell to.
错：用来装饰住所 || 他做罐子是为了用，不是摆设。 || the pots are for use, not ornament.
错：送给星期五做礼物 || 做陶器时星期五还没来。 || Friday has not yet come when he makes pots.
验：从他的高兴对：第一次烧出能耐火的锅，他煮了一锅肉汤，高兴极了，可见陶器是为了生活用。 || Check by his joy: his first fireproof pot lets him boil broth.

问：鲁滨逊教会了什么鸟说话？
答：鹦鹉
据：上岛后：他捉到一只鹦鹉，教它叫“鲁滨逊·克鲁索”。 || On the island: he catches a parrot and teaches it to say his name.
错：乌鸦 || 书里没有乌鸦。 || there is no crow.
错：八哥 || 书里没有八哥。 || there is no myna.
错：鸽子 || 书里没有鸽子会说话。 || no pigeon speaks.
验：从他睡梦中被叫醒的情节对：有一天他听到有人叫他名字，吓了一跳，原来是鹦鹉。 || Check by the scene: one day a voice calls his name and startles him; it is the parrot.

问：鲁滨逊生了一场大病以后，开始常读什么书？
答：《圣经》
据：上岛后：他得了一场重病，发烧时害怕，从船上带来的箱子里拿出《圣经》来读，从此常读。 || On the island: in a fever he takes out the Bible from a sea chest and reads it, and keeps reading.
错：航海日记 || 航海日记是他自己写的，不是读的书。 || the journal is his own writing, not a book he reads.
错：一本小说 || 书里没写他读小说。 || he reads no novel.
错：一本地图册 || 书里没写他读地图册。 || he reads no atlas.
验：从他的变化对：读《圣经》后他觉得自己不是孤单一人，心里平静了许多。 || Check by the change in him: after reading he feels less alone.

问：鲁滨逊有一段时间用什么方式记录每天的事？
答：写日记
据：上岛后：他用船上找到的墨水写日记，直到墨水用完。 || On the island: he keeps a journal with the ship's ink until it runs out.
错：画图画 || 书里没写他画画记事。 || he does not draw his days.
错：写信 || 没人收信，他写的是日记。 || there is no one to write to; he keeps a journal.
错：唱歌 || 书里没写他唱歌记事。 || he does not sing them.
验：从书的样子对：书中一部分正是他的日记，按日期一条条写。 || Check by the book itself: part of it is his journal, entry by entry.

问：鲁滨逊自己做的第一条独木舟为什么没用上？
答：太重了，拖不到海里
据：造船的情节：他砍倒一棵大树挖成独木舟，可船太大太重，离海又远，他拖不动。 || The boat: he hollows out a huge tree, but it is too heavy and too far from the water to launch.
错：被大浪打坏了 || 船还没下水，没被浪打坏。 || it never reaches the water to be broken.
错：木头太小坐不下 || 正相反，船做得太大。 || on the contrary, it is too big.
错：被野人偷走了 || 那时岛上还没有野人来过。 || no savage has yet come.
验：从他的教训对：他后来做第二条小船时，先想好离水近，说明第一条是因为拖不动才白做了。 || Check by the lesson: he builds the second boat near the water.

问：鲁滨逊在沙滩上看到什么，吓得好几天睡不好？
答：一个人的脚印
据：上岛第十五年左右：他在沙滩上发现一个人的赤脚脚印，吓得几天几夜睡不好。 || About his fifteenth year: he finds a naked footprint in the sand and cannot sleep for days.
错：一艘大船 || 大船是后来叛乱的水手开来的。 || the ship comes much later with the mutineers.
错：一只大野兽 || 书里没有大野兽吓他。 || no great beast frightens him.
错：一团火光 || 火光是他后来远远看到野人生火的事。 || the fire is what he sees later, of the savages.
验：从他后来的发现对：不久他看到海边有人骨和火堆，才知道是野人来过，脚印就是开端。 || Check by what follows: he finds bones and a fire, and knows the savages have come.

问：星期五原来是什么人？
答：被他从野人手里救下的俘虏
据：星期五出场：一群野人带着俘虏上岛要吃人，一个俘虏逃跑，鲁滨逊开枪救下了他。 || Friday's coming: savages bring captives to eat; one escapes, and Robinson saves him with his gun.
错：同船遇难的水手 || 同船的人都淹死了。 || his shipmates all drowned.
错：岛上原来的主人 || 岛上没有原来的主人。 || the island has no former owner.
错：一个西班牙人 || 西班牙人是后来救下的。 || the Spaniard is saved later.
验：从星期五的举动对：他跪下把鲁滨逊的脚放在自己头上，表示愿做仆人，说明他是被救下的俘虏。 || Check by his gesture: he sets Robinson's foot on his head, the sign of a rescued man.

问：鲁滨逊为什么叫他“星期五”？
答：救他的那天是星期五
据：星期五出场：他救下这个人的那一天是星期五，就给他取名“星期五”。 || Friday's coming: he saves him on a Friday and names him for the day.
错：他那年刚好五岁 || 书里没说他五岁，他是一个青年。 || he is a young man, not five.
错：他是第五个上岛的人 || 岛上原来只有鲁滨逊一个人。 || Robinson was the only one on the island.
错：这是他自己起的名字 || 名字是鲁滨逊给他取的。 || it is Robinson who names him.
验：从木柱刻痕对：鲁滨逊一直记着日子，才知道那天是星期五。 || Check by the post: he knows the day because he kept count.

问：星期五对鲁滨逊的态度怎样？
答：忠心耿耿
据：星期五以后：星期五对他忠心耿耿，学会说英语，干活勤快，还愿为他拼命。 || After Friday comes: he is utterly loyal, learns English, works hard and would die for him.
错：一直想逃跑 || 星期五从没想逃，后来还跟他回欧洲。 || Friday never tries to escape and later goes with him to Europe.
错：常常不听话 || 他学得快，听鲁滨逊的话。 || he learns quickly and obeys.
错：想报复他 || 他感激救命之恩，不想报复。 || he is grateful, not vengeful.
验：从结尾对：鲁滨逊离开小岛时把星期五带走，正因为他是忠心的伙伴。 || Check by the end: Robinson takes him along when he leaves.

问：鲁滨逊后来又从野人手里救下了谁？
答：星期五的父亲和一个西班牙人
据：后来：又一群野人上岛，鲁滨逊和星期五救下一个西班牙人和星期五的父亲。 || Later: another party of savages comes, and they save a Spaniard and Friday's father.
错：一位船长和他的大副 || 船长和大副是后来叛乱时救的。 || the captain and mate are saved later, in the mutiny.
错：一个英国水手 || 这次没有英国水手。 || there is no English sailor in this rescue.
错：星期五的哥哥 || 书里没有星期五的哥哥。 || Friday has no brother here.
验：从星期五的反应对：他认出被捆的老人是自己的父亲，高兴得又哭又跳。 || Check by Friday's joy: he finds the bound old man is his father.

问：一艘船上的水手叛乱时，鲁滨逊帮助了谁？
答：被绑起来的船长
据：结尾：一艘英国船的水手叛乱，把船长绑上岸，鲁滨逊和星期五帮船长夺回了船。 || The end: mutineers bring their bound captain ashore, and Robinson and Friday help him retake the ship.
错：叛乱的水手 || 叛乱的水手是他对付的人。 || the mutineers are those he fights.
错：一群野人 || 这次不是野人。 || these are not savages.
错：西班牙人 || 西班牙人去大陆找人了，不在这件事里。 || the Spaniard has gone to the mainland.
验：从后果对：船长感激他，答应送他回英国，正因为他帮的是船长。 || Check by the result: the grateful captain carries him home.

问：鲁滨逊最后是怎样离开小岛的？
答：帮船长夺回船，坐船离开
据：结尾：他帮船长夺回大船，坐这艘船离开了小岛。 || The end: having helped retake the ship, he sails away on it.
错：自己造船划了回去 || 他自己造的船只能沿岛划，没有回去。 || his own boats only went round the island.
错：被一艘商船偶然救走 || 不是偶然路过，是叛乱的船开到岛上。 || no ship passed by chance; it came with the mutiny.
错：星期五的部落送他走 || 星期五的部落没有送他。 || Friday's people play no part.
验：从日期对：他上船离开的时候，在岛上已经二十八年了，正是船长的船带他回家。 || Check by the date: twenty-eight years on, it is the captain's ship that takes him.

问：鲁滨逊离开小岛时，把谁留在了岛上？
答：几个叛乱的水手
据：结尾：几个最坏的叛乱水手不愿回国受审，被留在了岛上。 || The end: the worst mutineers, unwilling to face trial, are left on the island.
错：星期五 || 星期五跟他一起走了。 || Friday goes with him.
错：船长 || 船长开船送他回国。 || the captain sails the ship home.
错：他的鹦鹉和山羊 || 他带走了一只鹦鹉，还有羊皮帽和伞。 || he takes a parrot, his goatskin cap and umbrella with him.
验：从岛的后来对：他告诉留下的水手怎样种地养羊，岛上后来有了新的住户。 || Check by the island's future: he teaches them how to live there.

问：星期五最后怎样了？
答：跟鲁滨逊一起离开了小岛
据：结尾：星期五跟鲁滨逊一起离开小岛，到了欧洲。 || The end: Friday leaves with him for Europe.
错：一个人留在了岛上 || 他没有留在岛上。 || he does not stay.
错：回到了自己的部落 || 他没有回自己的部落。 || he does not go home to his people.
错：被野人抓走了 || 这时没有野人抓他。 || no savages take him now.
验：从回国路上的情节对：在欧洲翻山时星期五还和熊逗着玩，说明他一直跟着鲁滨逊。 || Check by the journey home: in the mountains of Europe Friday plays with a bear.

问：鲁滨逊在岛上一共生活了多少年？
答：二十八年
据：结尾：他算了一下，在岛上一共生活了二十八年两个月零十九天。 || The end: he reckons he lived on the island twenty-eight years, two months and nineteen days.
错：十八年 || 十八年少了十年。 || eighteen is ten years short.
错：三十年 || 三十年多了，书里是二十八年。 || thirty is too many.
错：十年 || 十年太少。 || ten is far too few.
验：从时间线对：上岛十五年左右才看见脚印，后来还过了好些年才遇到叛乱的船，加起来正好二十多年。 || Check by the timeline: the footprint near the fifteenth year, Friday and the mutiny years after.

问：回到英国以后，鲁滨逊发现了什么？
答：巴西的种植园让他成了富人
据：结尾：他回到英国，父母都已去世，但巴西种植园这些年的收益让他成了富人。 || The end: in England his parents are dead, but the Brazilian plantation has made him rich.
错：父母一直在家里等他 || 父母已经去世了。 || his parents have died.
错：他的钱全被人骗光了 || 替他保管钱的寡妇很守信。 || the widow who kept his money was faithful.
错：家乡被大火烧光了 || 书里没有家乡被烧。 || his home was not burned.
验：从种植园的经营对：他托付的人一直帮他经营，账目清楚，二十多年攒下一大笔钱。 || Check by the plantation: it was kept faithfully all those years.

问：这部小说是用第几人称写的？
答：第一人称
据：全书的写法：全书用“我”来讲，是鲁滨逊自述。 || The book's form: it is told by “I”, Robinson himself.
错：第二人称 || 书里没有用“你”来讲。 || it is not told as “you”.
错：第三人称 || 书里不是用“他”来讲。 || it is not told as “he”.
错：一会儿第一、一会儿第三人称 || 全书都用“我”，没有换来换去。 || it stays with “I” throughout.
验：从日记的部分对：书里的日记都是“我”写的，和全书的人称一致。 || Check by the journal: it is his own, in the first person.

问：这部小说最主要表现了鲁滨逊什么精神？
答：勇敢顽强，不怕困难
据：全书：一个人在荒岛上二十八年，盖房、种地、养羊、造船，从不放弃。 || The book as a whole: alone twenty-eight years, he builds, farms, herds and makes boats, never giving up.
错：贪图钱财，不顾一切 || 他在岛上靠的是劳动，钱在岛上没用。 || on the island money is useless; he lives by work.
错：爱好冒险，却不肯劳动 || 他在岛上天天劳动，从不偷懒。 || he works every day.
错：遇事总是依靠别人 || 他大部分时间只能靠自己。 || for most of it he has only himself.
验：从他看到金币时的话对：他说这些钱在岛上一文不值，可见他靠的不是钱，而是勇气和劳动。 || Check by the coins: he says they are worthless here.

问：鲁滨逊的经历最能告诉读者什么？
答：困境中靠劳动和智慧也能活下去
据：全书：他靠劳动和智慧，在荒岛上解决了吃、住、穿，活了下来。 || The book as a whole: by labour and wit he solves food, shelter and clothing, and survives.
错：一个人永远离不开金钱 || 他在岛上发现钱没用。 || he finds money useless on the island.
错：出门冒险一定会失败 || 他冒险最后成功回到了家。 || his adventure ends in safe return.
错：只要等待就会有人来救 || 他不是等人来救，而是自己动手。 || he does not wait; he acts.
验：从他的经历对：沉船时一无所有，后来有房有地有羊，全是自己的双手和办法换来的。 || Check by his life: from nothing to house, fields and flock, by his own hands.

问：《鲁滨逊漂流记》的作者笛福是哪国人？
答：英国
据：作者：笛福是英国作家，1719年出版了这部小说。 || The author: Defoe was English and published the novel in 1719.
错：美国 || 笛福不是美国人。 || Defoe was not American.
错：法国 || 笛福不是法国人。 || Defoe was not French.
错：丹麦 || 丹麦作家是安徒生。 || the Danish writer is Andersen.
验：从主人公对：鲁滨逊生在英国约克，回来也是回英国，作者也是英国人。 || Check by the hero: born in York, he returns to England, as English as his author.
`,
  },
];
