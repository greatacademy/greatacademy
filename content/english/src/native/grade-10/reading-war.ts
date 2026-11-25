// Grade 10: the reading unit of the fourth theme, war and memory, from a truce in the trenches and a battle of
// attrition to the poppy, a wall of names, a painting of a bombed town and a letter kept in a drawer.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const warWords = { topic: "words-of-war-and-conflict", weight: 0.3 } as const;
const memoryWords = { topic: "words-of-memory-and-witness", weight: 0.3 } as const;
const toneShifts = { topic: "tone-shifts-in-a-text", weight: 0.2 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** warAndMemory is a reading unit of grade 10 on war, its costs and how people remember it. */
export const warAndMemory: ReadingUnitDef = {
  id: "war-and-memory",
  title: t("War and Memory", "战争与记忆"),
  passages: [
    passage(
      "the-truce-in-the-trenches",
      t("The Truce in the Trenches", "战壕里的休战"),
      `By December 1914, the First World War had already turned into something no one had expected. Both sides had dug long lines of trenches across Belgium and France, sometimes only a few dozen meters apart. Between them lay a strip of mud, barbed wire and shell holes known as no man's land. The soldiers lived in cold, wet ditches, where rats ran over them at night and a raised head could mean a sniper's bullet.

On Christmas Eve, something remarkable happened along parts of the front. British soldiers heard German voices singing carols. Some saw small Christmas trees with candles placed along the top of the enemy trenches. The British sang back. Then, in several places, a few brave men climbed out of their trenches and walked into no man's land, unarmed.

Nobody shot them. Soon, small groups from both sides were meeting in the middle. They shook hands, exchanged cigarettes, chocolate and buttons from their uniforms, and showed each other photographs of their families. In some places, they helped each other bury the dead who had been lying between the lines for weeks. According to several letters, men from both sides even played football with a ball or a tin can.

The truce was not official. It began among the ordinary soldiers, and in many places officers joined in. But the generals on both sides were furious. They feared that soldiers who had shared a cigarette with the enemy would no longer want to kill him. Orders were sent out forbidding any repeat of the truce, and the following Christmas, when the war had grown far more bitter, there were only a few small attempts.

The war continued for almost four more years. Millions of men died, including many of those who had sung carols across no man's land. One British soldier wrote home that it had been "a day of peace in war," and that he would never forget it.

For a long time, the truce was half-forgotten, treated as a strange story rather than history. Today it is remembered with memorials, films and football matches. Perhaps it endures because it shows that the men in the trenches did not hate each other, and that war is something that ordinary people are asked to carry out, not something they choose.`,
      [warWords, memoryWords, toneShifts],
      [
        ask(
          t("How did the truce begin?", "休战是怎样开始的？"),
          t("Among ordinary soldiers, with songs and men walking out unarmed", "在普通士兵之间，以歌声和徒手走出战壕开始"),
          [
            t("With an official order signed by the generals", "以将军们签署的正式命令开始"),
            t("With a football match arranged by both armies", "以两军安排的一场足球赛开始"),
            t("With a message sent from the British king", "以英国国王发出的一封信开始"),
          ],
          t(
            "The second and fourth paragraphs say it began with carols and unarmed men crossing no man's land, and that it was not official.",
            "第二段和第四段说休战始于圣诞颂歌和徒手穿过无人区的士兵，而且并非官方安排。",
          ),
          [
            t("The truce was not official, and the generals were furious about it.", "停战并非官方安排，将军们对此大为恼火。"),
            t(
              "Football came later, after men had already met in the middle; it did not start the truce.",
              "足球是后来的事，那时双方已在中间会面，不是停战的起因。",
            ),
            t("No message from the king is mentioned; it began with carols in the trenches.", "文中没提国王的消息；停战始于战壕里的颂歌。"),
          ],
        ),
        ask(
          t("Why were the generals angry about the truce?", "将军们为什么对休战感到愤怒？"),
          t("They feared soldiers who befriended the enemy would not want to fight", "他们担心与敌人交上朋友的士兵不愿再打仗"),
          [
            t("They wanted to play football themselves", "他们自己想踢足球"),
            t("The soldiers had given away all their food", "士兵们把所有的食物都送了出去"),
            t("The truce had been planned by the enemy as a trap", "休战是敌人设下的圈套"),
          ],
          t(
            "The fourth paragraph says they feared that soldiers who had shared a cigarette with the enemy would no longer want to kill him.",
            "第四段说他们担心和敌人分享过香烟的士兵不再愿意杀他。",
          ),
          [
            t(
              "The generals never wanted to play; they feared friendship would stop the killing.",
              "将军们并不想踢球；他们担心友谊会让士兵不再杀敌。",
            ),
            t(
              "The men exchanged small gifts like cigarettes and chocolate, not all their food.",
              "士兵们交换的是香烟、巧克力等小礼物，不是全部食物。",
            ),
            t(
              "Nothing suggests a trap; the generals' worry was about the soldiers' will to fight.",
              "没有迹象表明是陷阱；将军们担心的是士兵的战斗意志。",
            ),
          ],
        ),
        ask(
          t("How does the tone of the passage change in the fifth paragraph?", "文章的语气在第五段怎样变化？"),
          t("From warm wonder at the truce to a sober reminder of the deaths that followed", "从对休战的温暖惊叹转为对随后死亡的沉重提醒"),
          [
            t("From anger at the generals to joy at the football", "从对将军的愤怒转为对足球的喜悦"),
            t("From fear of snipers to amusement at the rats", "从对狙击手的恐惧转为对老鼠的好笑"),
            t("From a sad tone to a cheerful and comic one", "从悲伤的语气转为欢快滑稽的语气"),
          ],
          t(
            "After the warm details of gifts and games, the fifth paragraph turns grave: millions died, including many who had sung carols.",
            "在礼物和游戏的温暖细节之后，第五段转为沉重：数百万人死去，其中包括许多唱过颂歌的人。",
          ),
          [
            t("The fifth paragraph does not turn to joy; it reports millions of deaths.", "第五段没有转向喜悦；它讲的是数百万人的死亡。"),
            t("Snipers and rats appear in the first paragraph, and nothing about them is amusing.", "狙击手和老鼠出现在第一段，并不好笑。"),
            t("The tone moves toward sorrow, not cheer or comedy.", "语气转向悲伤，不是欢快或滑稽。"),
          ],
        ),
        ask(
          t("What did British soldiers hear from the German trenches on Christmas Eve?", "平安夜英国士兵从德军战壕听到了什么？"),
          t("Voices singing carols", "唱圣诞颂歌的声音"),
          [
            t("Guns firing in celebration", "庆祝的枪声"),
            t("Officers giving orders to attack", "军官下令进攻"),
            t("Church bells ringing", "教堂钟声"),
          ],
          t("On Christmas Eve, British soldiers heard German voices singing carols.", "平安夜，英国士兵听到德国人在唱圣诞颂歌。"),
          [
            t("No guns fired; the British heard singing.", "并没有开枪；英军听到的是歌声。"),
            t("No orders to attack are mentioned; the voices were singing carols.", "文中没提进攻命令；那些声音在唱颂歌。"),
            t("Church bells are not mentioned; the sound was carols.", "文中没提教堂钟声；听到的是颂歌。"),
          ],
        ),
      ],
      ["Belgium", "France", "British", "German"],
    ),
    passage(
      "the-battle-that-would-bleed-them-white",
      t("A Battle of Attrition", "一场消耗战"),
      `In February 1916, the German army attacked the French fortress city of Verdun. The German commander, Erich von Falkenhayn, later claimed that his aim was not to capture the city but to force France to defend it at any cost. Verdun was a symbol of national pride, and he believed the French would never give it up. If France sent soldier after soldier to hold it, he wrote, the French army would "bleed to death."

This was a strategy of attrition: winning not by a decisive victory but by wearing the enemy down until it could no longer fight. It turned the land around Verdun into one of the most terrible places on Earth.

The battle lasted ten months. During that time, the two armies fired tens of millions of shells into an area only a few kilometers wide. Forests disappeared, leaving only splintered stumps. Villages were obliterated so completely that their sites could be identified only by changes in the color of the soil. Soldiers fought in shell holes filled with water and mud, often unable to tell where their own lines ended.

The French held Verdun under the slogan "They shall not pass." Almost three-quarters of the French army served there at some point, rotating in and out so that no unit had to stay too long. A single road, later called the Sacred Way, carried supplies and fresh troops to the front day and night.

But attrition works both ways. To keep up the pressure, the German army also had to keep sending soldiers into the carnage. By December, when the fighting died down, the front line was almost exactly where it had been in February. Roughly 700,000 men had been killed, wounded or gone missing, on both sides together.

After the war, nine of the destroyed villages were never rebuilt. They were declared to have "died for France," and they still officially exist, each with a mayor, although no one lives there. Much of the battlefield remains a forest planted over unexploded shells, closed to the public.

At the center stands a building called the Ossuary, which holds the bones of about 130,000 unidentified soldiers, French and German. Through small windows at its base, visitors can see them. It is a memorial not to victory but to what victory and defeat both cost.`,
      [warWords, memoryWords, toneShifts],
      [
        ask(
          t("What was the aim of Falkenhayn's strategy, according to his later claim?", "根据法尔肯海因后来的说法，他战略的目的是什么？"),
          t("To wear down the French army by forcing it to defend Verdun", "迫使法军死守凡尔登，从而消耗法军"),
          [
            t("To capture Verdun quickly and end the war", "迅速攻占凡尔登并结束战争"),
            t("To build a new road to the city of Paris", "修建一条通往巴黎的新路"),
            t("To make peace with France before winter", "在冬天之前与法国议和"),
          ],
          t(
            "The first paragraph says he claimed his aim was to force France to defend the city at any cost until its army bled to death.",
            "第一段说他声称目的是迫使法国不惜代价守城，直到法军流血而亡。",
          ),
          [
            t("Falkenhayn claimed his aim was not to capture the city.", "法金汉声称他的目的不是攻占这座城。"),
            t(
              "No road to Paris is mentioned; the Sacred Way was a French supply road to Verdun.",
              "文中没提通往巴黎的路；“圣路”是法军通往凡尔登的补给线。",
            ),
            t("He wanted to bleed the French army, not make peace.", "他想让法军流尽鲜血，不是求和。"),
          ],
        ),
        ask(
          t('What does "attrition works both ways" mean in the passage?', '文中"消耗战是双向的"是什么意思？'),
          t("The Germans also lost huge numbers of men to keep up the pressure", "德军为了保持压力也损失了大量士兵"),
          [
            t("Both armies agreed to stop fighting in December", "两军同意在十二月停战"),
            t("The French attacked German cities in return", "法军反过来进攻德国城市"),
            t("Both sides used the Sacred Way for supplies", '双方都用"圣路"运送补给'),
          ],
          t(
            "The fifth paragraph explains that the German army also had to keep sending soldiers into the carnage, and losses were huge on both sides.",
            "第五段解释说德军也不得不不断把士兵送进屠场，双方损失都很惨重。",
          ),
          [
            t("The fighting died down in December, but no agreement to stop is mentioned.", "战斗在十二月平息，但文中没提双方约定停火。"),
            t("The French held Verdun; no attacks on German cities are described.", "法军守住了凡尔登；文中没写进攻德国城市。"),
            t("The Sacred Way supplied the French alone.", "“圣路”只为法军补给。"),
          ],
        ),
        ask(
          t("What point does the final sentence make about the Ossuary?", "最后一句对藏骨堂表达了什么观点？"),
          t("It remembers the cost of the battle, not the glory of winning", "它纪念的是战役的代价，而不是胜利的荣耀"),
          [
            t("It celebrates the French victory over Germany", "它庆祝法国战胜德国"),
            t("It was built only for German soldiers", "它只为德国士兵而建"),
            t("It shows that the battle was not very serious", "它表明这场战役并不严重"),
          ],
          t(
            "It holds unidentified French and German soldiers and is described as a memorial to what victory and defeat both cost.",
            "它安放着无法辨认的法德士兵遗骨，被描述为纪念胜利与失败双方代价的纪念馆。",
          ),
          [
            t("It holds French and German bones and remembers cost, not a victory.", "它安放法德两国的遗骨，纪念的是代价，不是胜利。"),
            t("It holds unidentified soldiers from both sides, French and German.", "它安放的是双方的无名士兵，有法国人也有德国人。"),
            t("The bones of about 130,000 soldiers show the battle was terribly serious.", "约十三万士兵的遗骨表明这场战役极其惨烈。"),
          ],
        ),
        ask(
          t("What was the single supply road to Verdun later called?", "通往凡尔登的那条补给路后来叫什么？"),
          t("The Sacred Way", "神圣之路"),
          [t("The Road of Glory", "荣耀之路"), t("No man's land", "无人区"), t("The Emperor's Road", "皇帝之路")],
          t(
            "A single road, later called the Sacred Way, carried supplies and fresh troops.",
            "一条后来被称为“神圣之路”的道路运送补给和新部队。",
          ),
          [
            t(
              "The Road of Glory is not a name in the passage; the road was the Sacred Way.",
              "文中没有“荣耀之路”这个名字；那条路叫“圣路”。",
            ),
            t("No man's land is the strip between trenches, not a road.", "无人区是两条战壕之间的地带，不是道路。"),
            t("The Emperor's Road is not mentioned; it was called the Sacred Way.", "文中没提“皇帝之路”；它叫“圣路”。"),
          ],
        ),
      ],
      ["Verdun", "Erich", "von", "Falkenhayn", "Ossuary", "German", "French", "France"],
    ),
    passage(
      "the-red-flower",
      t("The Red Flower", "红色的花"),
      `In the spring of 1915, a Canadian army doctor named John McCrae stood near the town of Ypres in Belgium, where some of the fiercest fighting of the First World War had taken place. A few days earlier, a close friend of his had been killed by a shell and buried in a simple grave. Around the graves of the soldiers, McCrae noticed, bright red poppies were growing.

Poppies thrive in disturbed soil. Their seeds can lie in the ground for years, and when the earth is broken open, they bloom. The shelling had churned the fields of Belgium and France so thoroughly that the battlefields burst into red each spring.

McCrae wrote a short poem in which the dead speak from beneath the poppies, reminding the living that they once lived and loved and asking them to carry on the fight. The poem was published in a London magazine later that year and quickly became one of the most famous poems of the war. McCrae himself did not survive it. He died of pneumonia in 1918, still serving as a doctor near the front.

Across the Atlantic, an American teacher named Moina Michael read the poem just before the war ended. She was so moved that she promised to wear a red poppy every day in remembrance of the dead. She began selling silk poppies to raise money for veterans who had returned wounded or unable to work. A French woman, Anna Guérin, took up the idea and spread it to Britain and the countries of its empire.

Within a few years, the poppy had become the symbol of remembrance in Britain, Canada, Australia, New Zealand and other countries. Every November, around the anniversary of the armistice that ended the war, millions of people wear paper poppies on their coats. The money raised still supports veterans and their families.

The poppy has also caused debate. Some people feel it has become too much a symbol of national pride, and that wearing it can seem to celebrate war rather than lament it. In 1933, a group of women in Britain began to sell white poppies instead, as a symbol of peace and a commitment that war should never happen again.

Both flowers grew from the same soil. Both ask the same question: what do the living owe to those who died?`,
      [memoryWords, warWords, toneShifts, academic2],
      [
        ask(
          t("Why did so many poppies grow on the battlefields?", "为什么战场上长出了那么多罂粟花？"),
          t("The shelling broke up the soil, and poppy seeds bloom in disturbed ground", "炮火翻动了土壤，而罂粟种子在被翻动的土地上开花"),
          [
            t("Soldiers planted them beside every grave", "士兵在每座坟墓旁种了它们"),
            t("The weather in Belgium was unusually warm", "比利时的天气异常温暖"),
            t("Doctors used them to treat the wounded", "医生用它们治疗伤员"),
          ],
          t(
            "The second paragraph says poppies thrive in disturbed soil, and the shelling had churned the fields so thoroughly that they burst into red.",
            "第二段说罂粟在被翻动的土壤里茂盛生长，而炮火把田地翻得如此彻底，以致一片通红。",
          ),
          [
            t(
              "No one is said to have planted them; poppies bloom when the earth is broken open.",
              "文中没说有人种；罂粟在土地被翻开时开花。",
            ),
            t("Warm weather is not the reason; the shelling churned the soil.", "原因不是天气暖和；是炮击翻动了土壤。"),
            t(
              "Doctors are not said to use poppies; McCrae only noticed them by the graves.",
              "文中没说医生用罂粟治病；麦克雷只是在墓旁注意到它们。",
            ),
          ],
        ),
        ask(
          t("What did Moina Michael do after reading the poem?", "莫伊娜·迈克尔读了这首诗以后做了什么？"),
          t("She wore a poppy daily and sold silk poppies to help veterans", "她每天佩戴罂粟花，并出售丝绸罂粟花帮助退伍军人"),
          [
            t("She wrote a second poem in reply to McCrae", "她写了第二首诗回应麦克雷"),
            t("She traveled to Belgium to work as a nurse", "她前往比利时当护士"),
            t("She began selling white poppies for peace", "她开始出售象征和平的白色罂粟花"),
          ],
          t(
            "The fourth paragraph says she promised to wear a poppy every day and sold silk poppies to raise money for veterans.",
            "第四段说她承诺每天佩戴罂粟花，并出售丝绸罂粟花为退伍军人筹款。",
          ),
          [
            t("She did not write a reply; she promised to wear a poppy every day.", "她没有写诗回应；她承诺每天佩戴罂粟花。"),
            t("She stayed in America as a teacher; she did not go to Belgium.", "她仍在美国当老师，没有去比利时。"),
            t("White poppies came in 1933 from a group of women in Britain.", "白罂粟是1933年由英国一群女性推出的。"),
          ],
        ),
        ask(
          t("Why did some women begin selling white poppies?", "为什么一些女性开始出售白色罂粟花？"),
          t(
            "They wanted a symbol of peace rather than one that might seem to celebrate war",
            "她们想要和平的象征，而不是看起来像在颂扬战争的象征",
          ),
          [
            t("Red paper had become too expensive to buy", "红纸变得太贵买不起"),
            t("The red poppy was banned in Britain in 1933", "红色罂粟花在1933年被英国禁止"),
            t("White poppies grew more often on the battlefields", "战场上白色罂粟花更常见"),
          ],
          t(
            "The sixth paragraph says some felt the red poppy could seem to celebrate war, so white poppies were sold as a symbol of peace.",
            "第六段说一些人觉得红色罂粟花可能显得像在颂扬战争，所以出售白色罂粟花作为和平的象征。",
          ),
          [
            t("Cost is never mentioned; the white poppy stood for peace.", "文中没提价格；白罂粟代表和平。"),
            t("The red poppy was never banned; the white one was offered instead.", "红罂粟从未被禁止；白罂粟只是另一种选择。"),
            t("The flowers on the battlefields were red; white was a chosen symbol.", "战场上的花是红色的；白色是人为选择的象征。"),
          ],
        ),
        ask(
          t("What was John McCrae's job in the war?", "约翰·麦克雷在战争中的职务是什么？"),
          t("An army doctor", "军医"),
          [t("A teacher", "教师"), t("A general", "将军"), t("A chaplain", "随军牧师")],
          t(
            "A Canadian army doctor named John McCrae stood near the town of Ypres in Belgium.",
            "一位名叫约翰·麦克雷的加拿大军医站在比利时伊普尔镇附近。",
          ),
          [
            t("The teacher in the passage is Moina Michael, not McCrae.", "文中的老师是莫伊娜·迈克尔，不是麦克雷。"),
            t("McCrae served as a doctor, not a general.", "麦克雷是军医，不是将军。"),
            t("A chaplain appears in another story; McCrae was a doctor.", "牧师出现在别的故事里；麦克雷是医生。"),
          ],
        ),
      ],
      [
        "Canadian",
        "John",
        "McCrae",
        "Ypres",
        "Belgium",
        "Moina",
        "Michael",
        "Anna",
        "Guérin",
        "Australia",
        "Zealand",
        "London",
        "Atlantic",
        "Britain",
        "Canada",
        "France",
      ],
    ),
    passage(
      "a-thousand-paper-cranes",
      t("A Thousand Paper Cranes", "一千只纸鹤"),
      `On August 6, 1945, an American plane dropped an atomic bomb on the Japanese city of Hiroshima. In a single moment, most of the city was destroyed. Tens of thousands of people died at once, and many more died in the months and years that followed from burns and from radiation, an invisible poison released by the explosion.

Sasaki Sadako was two years old and lived about a mile from the center of the blast. She was thrown from her house but seemed unhurt. She grew up into a healthy, lively girl who loved running and hoped to become a physical education teacher. Then, when she was eleven, lumps appeared on her neck and behind her ears. Doctors told her family that she had leukemia, a cancer of the blood that had become common among children exposed to the bomb's radiation.

In the hospital, a friend told Sadako about an old Japanese legend: anyone who folds a thousand paper cranes will be granted a wish. Cranes, in Japanese tradition, are symbols of long life. Sadako began to fold them from any paper she could find, including medicine wrappers and the paper from gifts that other patients received. Her wish was to get well.

As her illness grew worse, she kept folding, using a needle to make tiny cranes when her hands were weak. According to her family, she completed more than a thousand and continued beyond. She died in October 1955, at the age of twelve.

Her classmates were determined that she should not be forgotten. They collected letters and money from schools across Japan to build a memorial to Sadako and to all the children killed by the bomb. In 1958, a statue was unveiled in the Hiroshima Peace Memorial Park. It shows a girl standing on top of a tall stone, holding a golden crane above her head. At its base is a simple inscription: "This is our cry. This is our prayer. Peace in the world."

Every year, children from around the world send paper cranes to Hiroshima, millions of them, in strings of a thousand. They are hung in glass cases around the statue. Each one is small and fragile. Together, they have turned the memory of one child's hope into a request for peace that the whole world can hear.`,
      [memoryWords, warWords, toneShifts],
      [
        ask(
          t("Why was leukemia common among children in Hiroshima after the war?", "战后广岛的儿童为什么常患白血病？"),
          t("They had been exposed to radiation from the bomb", "他们受到了原子弹辐射"),
          [
            t("They ate too little food during the war", "他们在战争期间吃得太少"),
            t("The hospitals had run out of medicine", "医院的药用完了"),
            t("They folded paper with poisonous ink", "他们折了含有毒墨水的纸"),
          ],
          t(
            "The second paragraph says leukemia had become common among children exposed to the bomb's radiation.",
            "第二段说白血病在受到原子弹辐射的儿童中已经很常见。",
          ),
          [
            t("Hunger is not mentioned; the cause was radiation.", "文中没提饥饿；原因是辐射。"),
            t("Hospitals running out of medicine is never mentioned.", "文中没提医院缺药。"),
            t(
              "The paper only came from wrappers and gifts; the poison was radiation from the bomb.",
              "纸只是来自包装和礼物；毒害来自原子弹的辐射。",
            ),
          ],
        ),
        ask(
          t("What did Sadako hope would happen if she folded a thousand cranes?", "贞子希望折完一千只纸鹤后会发生什么？"),
          t("That she would get well", "她能康复"),
          [
            t("That the war would begin again", "战争会再次开始"),
            t("That her school would build a statue", "她的学校会建一座雕像"),
            t("That she would become a doctor", "她会成为一名医生"),
          ],
          t("The third paragraph says her wish was to get well.", "第三段说她的愿望是康复。"),
          [
            t("She wished for peace in her own body, to get well, not for war.", "她的愿望是康复，不是战争重来。"),
            t("The statue came after her death, built by her classmates.", "雕像是她死后同学们发起建的。"),
            t("Her dream was to teach physical education, and her wish was to get well.", "她的梦想是当体育老师，愿望是康复。"),
          ],
        ),
        ask(
          t("How does the tone of the final paragraph differ from the opening one?", "最后一段的语气与第一段有什么不同？"),
          t("It moves from stark destruction to a quiet, hopeful call for peace", "从冷峻的毁灭转为安静而充满希望的和平呼吁"),
          [
            t("It moves from hope to anger at the people of Japan", "从希望转为对日本人的愤怒"),
            t("It moves from sadness to a joke about paper", "从悲伤转为一个关于纸的玩笑"),
            t("It stays exactly the same from start to finish", "从头到尾完全一样"),
          ],
          t(
            "The opening describes a city destroyed in a moment; the ending describes millions of fragile cranes that turn one child's hope into a request for peace.",
            "开头描述一座瞬间被毁的城市；结尾描述数百万只脆弱的纸鹤，把一个孩子的希望变成和平的呼吁。",
          ),
          [
            t("The ending is hopeful; it shows no anger at the people of Japan.", "结尾充满希望，没有对日本人的愤怒。"),
            t("The cranes are fragile and serious; nothing about them is a joke.", "纸鹤脆弱而庄重，毫无玩笑之意。"),
            t("The tone shifts from destruction to hope, so it does not stay the same.", "语气从毁灭转为希望，并非一成不变。"),
          ],
        ),
        ask(
          t("What did Sadako hope to become when she grew up?", "贞子长大后想成为什么？"),
          t("A physical education teacher", "体育老师"),
          [t("A doctor", "医生"), t("A painter", "画家"), t("A pilot", "飞行员")],
          t("She loved running and hoped to become a physical education teacher.", "她喜欢跑步，希望成为一名体育老师。"),
          [
            t("Doctors treated her; she wanted to teach physical education.", "医生给她治病；她想当体育老师。"),
            t("Painting is never mentioned; she loved running.", "文中没提画画；她喜欢跑步。"),
            t("Flying is never mentioned; she hoped to teach physical education.", "文中没提飞行；她想当体育老师。"),
          ],
        ),
      ],
      ["Japanese", "Hiroshima", "Sasaki", "Sadako", "Japan"],
    ),
    passage(
      "the-soldier-without-a-name",
      t("The Soldier Without a Name", "无名士兵"),
      `By the end of the First World War, hundreds of thousands of soldiers had been killed whose bodies could not be identified. Some had been buried in graves marked only "A Soldier of the Great War, Known unto God." Others had disappeared completely, their remains lost in the mud of the battlefields. For their families, there was no grave to visit and no place to grieve.

In 1916, a British army chaplain named David Railton noticed a simple wooden cross in a garden in France. On it someone had written in pencil, "An Unknown British Soldier." The image stayed with him. After the war, he wrote to the dean of Westminster Abbey in London, suggesting that one unidentified soldier should be brought home and buried among the kings and poets of the nation, to stand for all the others.

The idea was accepted. In November 1920, the remains of several unknown soldiers were dug up from different battlefields. A senior officer, blindfolded, chose one. The others were reburied. The chosen soldier was carried across the Channel on a warship and taken through the streets of London on a gun carriage. Huge, silent crowds lined the route. On November 11, the second anniversary of the armistice, he was buried in Westminster Abbey in soil brought from France.

No one knew who he was. He might have been a farmer or a clerk, rich or poor, English, Scottish, Welsh or Irish. That was the point. Every mother who had lost a son with no known grave could believe that the soldier might be hers.

On the same day, King George V unveiled a new monument in Whitehall, the street of government offices: the Cenotaph. Its name comes from Greek words meaning "empty tomb." It holds no remains and carries no names, only the words "The Glorious Dead." Every year, on the Sunday nearest November 11, the nation gathers there for two minutes of silence.

France buried its own unknown soldier beneath the Arc de Triomphe in Paris on the same day, and other countries, including the United States, Italy and Belgium, soon followed. Such tombs have become places where the vast numbers of the dead become, for a moment, a single human being, and where grief can be shared by a nation.`,
      [memoryWords, warWords, toneShifts],
      [
        ask(
          t(
            "Why did Railton suggest burying an unknown soldier in Westminster Abbey?",
            "雷尔顿为什么建议把一名无名士兵葬在威斯敏斯特教堂？",
          ),
          t("So that one soldier could stand for all those with no known grave", "让一名士兵代表所有没有已知坟墓的人"),
          [
            t("Because the soldier had been a famous poet", "因为那名士兵是一位著名诗人"),
            t("Because there was no room in the battlefields of France", "因为法国的战场上没有地方了"),
            t("Because the king had asked for a new tomb", "因为国王要求修建一座新墓"),
          ],
          t(
            "The second paragraph says he suggested one unidentified soldier be buried there to stand for all the others.",
            "第二段说他建议把一名身份不明的士兵葬在那里，代表所有其他人。",
          ),
          [
            t("The soldier was unknown, so no one could say he was a poet.", "士兵身份不明，没人能说他是诗人。"),
            t("Space was not the issue; families had no grave to visit.", "问题不在空间；家人没有坟墓可以祭扫。"),
            t("Railton wrote to the dean with his own idea; the king did not ask.", "是雷尔顿自己写信给院长提议的，不是国王要求的。"),
          ],
        ),
        ask(
          t("Why was it important that no one knew who the soldier was?", "为什么没人知道这名士兵是谁很重要？"),
          t("Any grieving mother could believe he might be her son", "任何悲伤的母亲都可以相信他可能是自己的儿子"),
          [
            t("It kept his family from asking for money", "这让他的家人无法索要钱财"),
            t("It meant that no one would visit the grave", "这意味着没人会去扫墓"),
            t("It allowed the army to hide his crimes", "这让军队能掩盖他的罪行"),
          ],
          t(
            "The fourth paragraph says that was the point: every mother who had lost a son with no known grave could believe the soldier might be hers.",
            "第四段说这正是用意所在：每位失去儿子、儿子又没有已知坟墓的母亲，都可以相信那名士兵可能是她的儿子。",
          ),
          [
            t("Money is never mentioned; the point was that every mother could hope.", "文中没提钱；重点是每位母亲都能抱有希望。"),
            t("Huge crowds came, so it was meant to be visited.", "大批民众前来，墓本就是供人凭吊的。"),
            t("No crimes are mentioned; the soldier stood for all the lost.", "文中没提罪行；这位士兵代表所有失踪者。"),
          ],
        ),
        ask(
          t('What does the name "Cenotaph" mean?', '"纪念碑"（Cenotaph）这个名字是什么意思？'),
          t("An empty tomb", "空墓"),
          [
            t("A street of government offices", "一条政府机关街道"),
            t("The glorious dead", "光荣的死者"),
            t("Two minutes of silence", "两分钟的默哀"),
          ],
          t('The fifth paragraph says the name comes from Greek words meaning "empty tomb."', '第五段说这个名字来自意为"空墓"的希腊语词。'),
          [
            t(
              "Whitehall is the street where the Cenotaph stands, not the meaning of the word.",
              "白厅是纪念碑所在的街道，不是这个词的意思。",
            ),
            t('"The Glorious Dead" is the inscription on it, not what the name means.', "“光荣的逝者”是碑上的铭文，不是名字的含义。"),
            t("The two minutes of silence is the yearly ceremony there.", "两分钟默哀是在那里举行的年度仪式。"),
          ],
        ),
        ask(
          t("How was the unknown soldier for Westminster Abbey chosen?", "威斯敏斯特教堂的无名战士是怎样选出的？"),
          t("A blindfolded senior officer chose one of several", "一位蒙着眼的高级军官从几具遗体中选了一具"),
          [
            t("The king chose him by name", "国王点名选出"),
            t("His mother identified him", "他的母亲认出了他"),
            t("The first body found was used", "用了最先找到的遗体"),
          ],
          t("A senior officer, blindfolded, chose one.", "一位蒙着眼的高级军官选了一具。"),
          [
            t("The king unveiled the Cenotaph; he did not choose the soldier.", "国王揭幕了纪念碑，并没有挑选士兵。"),
            t("No mother identified him; no one knew who he was.", "没有母亲认出他；谁也不知道他是谁。"),
            t(
              "Several bodies were dug up, and one was chosen blindfolded, not the first found.",
              "挖出了好几具遗体，蒙眼挑选一具，不是用第一具。",
            ),
          ],
        ),
      ],
      [
        "David",
        "Railton",
        "Westminster",
        "Abbey",
        "London",
        "George",
        "Whitehall",
        "Arc",
        "de",
        "Triomphe",
        "Paris",
        "Italy",
        "Belgium",
        "Channel",
        "English",
        "Scottish",
        "Welsh",
        "Irish",
        "British",
        "France",
        "Greek",
      ],
    ),
    passage(
      "the-wall-of-names",
      t("The Wall of Names", "名字之墙"),
      `In 1981, a committee of veterans held a competition to design a national memorial to the Americans who had died in the Vietnam War. More than 1,400 designs were submitted, each identified only by a number so that the judges would not know who had made it. The winner was a twenty-one-year-old architecture student named Maya Lin.

Her design was startlingly simple. Two long walls of polished black granite would meet in a wide V, sinking into the earth so that the ground rose gently on either side. On the stone would be carved the names of every American who had died or gone missing in the war, more than 58,000 of them, in the order in which they had been lost. There would be no statues, no flags, no words of glory.

The design caused fierce controversy. The war had divided the country deeply, and many veterans felt that they had come home to indifference or hostility. Some called the black wall "a black gash of shame" and said it looked like an apology rather than an honor. Others objected that the designer was a young woman whose parents had come from China. Under pressure, the organizers agreed to add a bronze statue of three soldiers and a flagpole nearby.

When the wall opened in 1982, however, something unexpected happened. Visitors who walked along it found that, as the walls rose beside them, they were surrounded by names. In the polished stone, they could see their own reflections among the names, as if the living and the dead were standing together. People reached out to touch the names of friends and relatives. Many made rubbings on paper with a pencil to take home.

Visitors also began to leave things at the wall: letters, photographs, medals, a pair of boots, a can of beer, a child's drawing. The National Park Service collects them, and it now holds hundreds of thousands of objects, each a fragment of a private memory.

Today the Vietnam Veterans Memorial is one of the most visited monuments in the United States. Lin later explained that she had wanted to make a cut in the earth, a wound that would heal over time. Perhaps her design succeeded because it did not tell visitors what to feel about the war. It simply asked them to remember the people it had cost.`,
      [memoryWords, warWords, toneShifts, academic2],
      [
        ask(
          t("Why were the designs in the competition identified only by numbers?", "为什么比赛中的设计只用编号标识？"),
          t("So that the judges would not know who had made each one", "这样评委就不知道每个设计是谁做的"),
          [
            t("Because the designers had asked to stay secret forever", "因为设计者要求永远保密"),
            t("So that the names of the dead could be carved later", "这样死者的名字可以以后再刻"),
            t("Because there were too many designs to name", "因为设计太多，无法命名"),
          ],
          t(
            "The first paragraph says each design was identified only by a number so the judges would not know who had made it.",
            "第一段说每个设计只用编号标识，使评委不知道是谁做的。",
          ),
          [
            t("Secrecy was only for judging; the winner, Maya Lin, became known.", "匿名只是为了评审；获胜者林璎后来广为人知。"),
            t("The numbers identified designs, not the names of the dead.", "编号标识的是设计，不是逝者的名字。"),
            t("The reason given is fairness in judging, not the number of entries.", "给出的理由是评审公正，不是数量太多。"),
          ],
        ),
        ask(
          t("Why did some veterans object to the design at first?", "为什么一些退伍军人起初反对这个设计？"),
          t("It seemed to them like an apology rather than an honor", "在他们看来它像道歉而不是荣誉"),
          [
            t("It had too many statues and flags on it", "它上面有太多雕像和旗帜"),
            t("It left out the names of the soldiers", "它漏掉了士兵的名字"),
            t("It was too bright and too cheerful", "它太明亮、太欢快"),
          ],
          t(
            "The third paragraph says some called it a black gash of shame and said it looked like an apology rather than an honor.",
            "第三段说一些人称它为耻辱的黑色伤口，说它看起来像道歉而不是荣誉。",
          ),
          [
            t("The design had no statues or flags at first; they were added later.", "最初的设计没有雕像和旗帜，是后来加的。"),
            t("The wall carries more than 58,000 names.", "墙上刻有五万八千多个名字。"),
            t("Critics called the black wall a gash of shame, not cheerful.", "批评者称黑墙为“耻辱的伤口”，并不欢快。"),
          ],
        ),
        ask(
          t("What effect do the reflections in the polished stone have on visitors?", "光滑石面上的倒影对参观者有什么效果？"),
          t("They seem to stand among the dead, joining the living and the lost", "他们仿佛站在逝者中间，把生者与逝者连在一起"),
          [
            t("They cannot read the names because of the glare", "因为反光，他们看不清名字"),
            t("They are reminded of the bronze statue nearby", "他们想起附近的铜像"),
            t("They feel that the war was a great victory", "他们觉得那场战争是伟大的胜利"),
          ],
          t(
            "The fourth paragraph says visitors see their own reflections among the names, as if the living and the dead were standing together.",
            "第四段说参观者看到自己的倒影映在名字中间，仿佛生者与死者站在一起。",
          ),
          [
            t("Visitors could read the names and even touched them.", "参观者能看清名字，还伸手去摸。"),
            t("The statue stands nearby, but the reflections join visitors to the names.", "雕像在附近，但倒影让参观者与名字相融。"),
            t("The design says nothing of victory; it asks visitors to remember.", "设计不提胜利，只请人们铭记。"),
          ],
        ),
        ask(
          t("What are the walls of the Vietnam Veterans Memorial made of?", "越战老兵纪念碑的墙是用什么做的？"),
          t("Polished black granite", "抛光的黑色花岗岩"),
          [t("White marble", "白色大理石"), t("Bronze", "青铜"), t("Gray concrete", "灰色混凝土")],
          t("Two long walls of polished black granite would meet in a wide V.", "两道抛光黑色花岗岩长墙会合成一个宽阔的V字。"),
          [
            t("White marble is not mentioned; the stone is black granite.", "文中没提白色大理石；用的是黑色花岗岩。"),
            t("Bronze was used for the statue added nearby, not the walls.", "青铜用于附近增设的雕像，不是墙。"),
            t("Concrete is not mentioned; the walls are polished granite.", "文中没提混凝土；墙是抛光花岗岩。"),
          ],
        ),
      ],
      ["Vietnam", "Maya", "Lin", "China", "Americans"],
    ),
    passage(
      "the-cathedral-left-in-ruins",
      t("The Cathedral Left in Ruins", "留作废墟的大教堂"),
      `On the night of November 14, 1940, more than five hundred German bombers flew over the English city of Coventry. For eleven hours, they dropped high explosives and thousands of fire bombs on the streets below. By morning, much of the city center was destroyed, more than five hundred people were dead, and the medieval cathedral of St. Michael was a smoking shell. Only its outer walls and its tall stone spire were still standing.

The next morning, the cathedral's provost, Richard Howard, walked through the ruins. Some accounts say that a worker found two burned roof beams lying in the shape of a cross, and tied them together. Another man made a cross from three large medieval nails that had fallen from the roof. Howard had the words "Father Forgive" carved into the wall behind the ruined altar.

The words were chosen carefully. They did not say "Father forgive them." Howard believed that everyone shared in the wrongs that lead to war, and that the British, too, needed forgiveness. A few weeks later, in a broadcast on Christmas Day, he said that when the war was over, the people of Coventry would try to build a kinder world with those who had been their enemies. In 1940, with bombs still falling on Britain, this was an extraordinary thing to say.

The war went on, and British and American bombers destroyed German cities in turn. In February 1945, the city of Dresden was struck by a firestorm in which some 25,000 people died. After the war, Coventry was one of the first British cities to reach out to German towns. It formed a partnership with Dresden, and people from both cities visited each other, exchanged gifts and helped each other rebuild.

When Coventry decided to build a new cathedral, the architect Basil Spence proposed something unusual. Instead of clearing away the ruins, he would leave them standing, roofless and open to the sky, and build the new cathedral beside them, joined by a great porch. Visitors would pass from the ruin of war into the new building, and the two would be seen together.

The new cathedral was consecrated in 1962. Crosses of nails, made from the old medieval nails, have since been given to churches and communities around the world that work for reconciliation, including one in Dresden. Its Church of Our Lady, destroyed in 1945, was rebuilt and reopened in 2005. The golden cross on its dome was made by a British craftsman whose father had been one of the pilots who bombed the city.`,
      [warWords, memoryWords, toneShifts],
      [
        ask(
          t('Why were the words "Father Forgive" chosen without "them"?', '为什么选择"天父宽恕"而不加"他们"？'),
          t(
            "Howard believed everyone, the British included, shared in the wrongs of war",
            "霍华德认为包括英国人在内，每个人都对战争中的过错负有责任",
          ),
          [
            t("There was no space left on the wall for more words", "墙上没有空间再刻更多字"),
            t("He wanted to forgive only the people of Coventry", "他只想宽恕考文垂的人民"),
            t("The German bombers had asked for forgiveness", "德国轰炸机飞行员请求了宽恕"),
          ],
          t(
            "The third paragraph says Howard believed everyone shared in the wrongs that lead to war, and the British too needed forgiveness.",
            "第三段说霍华德认为每个人都对导致战争的过错负有责任，英国人也需要宽恕。",
          ),
          [
            t("Howard chose the words on purpose; space had nothing to do with it.", "霍华德是有意选这几个字的，与空间无关。"),
            t(
              'He left out "them" so that the British would be included, not only Coventry.',
              "他去掉 them，是为了把英国人也包括进去，而不只是考文垂。",
            ),
            t(
              "The bombers asked nothing; Howard spoke of a shared need for forgiveness.",
              "轰炸机没请求什么；霍华德说的是人人都需要宽恕。",
            ),
          ],
        ),
        ask(
          t("Why did Spence leave the ruins of the old cathedral standing?", "斯彭斯为什么让旧大教堂的废墟保留下来？"),
          t("So visitors would see the ruin of war and the new building together", "让参观者同时看到战争的废墟和新的建筑"),
          [
            t("Because there was no money to clear them away", "因为没有钱清理它们"),
            t("Because the ruins were safer than the new building", "因为废墟比新建筑更安全"),
            t("Because the city wanted to sell the old stones", "因为城市想出售旧石头"),
          ],
          t(
            "The fifth paragraph says visitors would pass from the ruin into the new building, and the two would be seen together.",
            "第五段说参观者会从废墟走进新建筑，二者会被一同看到。",
          ),
          [
            t("Money is not mentioned; leaving the ruins was a design choice.", "文中没提钱；保留废墟是设计上的选择。"),
            t("Safety is never mentioned; the ruins stand roofless and open.", "文中没提安全；废墟无顶、敞向天空。"),
            t("Selling stones is never mentioned; the ruins were kept to be seen.", "文中没提卖石头；废墟是留给人看的。"),
          ],
        ),
        ask(
          t("Why is the detail about the golden cross in Dresden especially moving?", "为什么德累斯顿金十字架的细节特别感人？"),
          t("It was made by the son of a pilot who had bombed the city", "它是由一位曾轰炸这座城市的飞行员的儿子制作的"),
          [
            t("It was the first cross ever made of gold", "它是第一个用金子做的十字架"),
            t("It was found unbroken in the ruins in 1945", "它于1945年在废墟中被完好地发现"),
            t("It was taken from Coventry without permission", "它是未经允许从考文垂拿走的"),
          ],
          t(
            "The last sentence says it was made by a British craftsman whose father had been one of the pilots who bombed Dresden, a sign of reconciliation.",
            "最后一句说它是由一位英国工匠制作的，他的父亲曾是轰炸德累斯顿的飞行员之一，这是和解的象征。",
          ),
          [
            t("Gold is not what matters; the maker's family history is.", "重要的不是黄金，而是制作者的家世。"),
            t("The cross was new, made for the rebuilt church in 2005.", "十字架是新做的，为2005年重建的教堂而作。"),
            t("It was made by a British craftsman as a gift, not taken from Coventry.", "它是英国工匠做的礼物，不是从考文垂拿走的。"),
          ],
        ),
      ],
      ["German", "English", "Coventry", "St.", "Michael", "Richard", "Howard", "Britain", "British", "Dresden", "Basil", "Spence"],
    ),
    passage(
      "the-envelope-in-the-desk",
      t("The Letter in the Drawer", "抽屉里的信"),
      `After her grandfather's funeral, Nadia was given the job of clearing out his desk. Everyone in the family agreed that she had been his favorite. She was the one who had sat with him on Sunday afternoons while he did the crossword, the one he had taught to play chess and to whistle through her fingers.

The desk was full of ordinary things: unpaid bills, old maps, pencils sharpened down to stubs. Nadia worked quickly, half smiling at each small discovery. A ticket from a concert in 1962. A photograph of her grandmother laughing on a beach. A recipe for apricot cake in his tidy handwriting, with a note in the margin: "Less sugar. She likes it less sweet."

In the bottom drawer, under a pile of tax forms, she found a brown envelope that had never been sealed. Inside was a letter, several pages long, written in pencil on thin paper. It was dated 1944, and it was addressed to a woman whose name Nadia did not know.

She almost put it back. Then she began to read.

Her grandfather had been nineteen when he wrote it. He described a village he had passed through with his unit, a place whose name had been crossed out, perhaps by a censor. He described what he had seen there, and what he had done, in short, flat sentences, as if he were afraid that longer ones would break. Nadia read the second page twice, and then she put the letter down on the desk and sat very still.

The man in the letter was not the man she knew. Or perhaps he was, and she had never known him. The grandfather who whistled and did crosswords had carried this for sixty years, in a drawer under the tax forms, and he had never said a word.

The letter ended with a request. "If anything happens to me," he had written, "please tell my mother that I tried to do right. Even if it is not true."

Nadia did not show the letter to the rest of the family that day. She put it back in its envelope and took it home. That evening, she baked the apricot cake from his recipe, with less sugar, and ate a slice alone in her kitchen. She did not know yet what she would do with what she had read. She only knew that remembering him would never again be simple.`,
      [memoryWords, warWords, toneShifts],
      [
        ask(
          t("How does the tone change when Nadia begins to read the letter?", "娜迪亚开始读信时，语气怎样变化？"),
          t("From light and affectionate to grave and unsettled", "从轻松亲切变为沉重不安"),
          [
            t("From sad and quiet to angry and loud", "从悲伤安静变为愤怒喧闹"),
            t("From serious to playful and comic", "从严肃变为俏皮滑稽"),
            t("It stays cheerful throughout the story", "它在整个故事中一直很欢快"),
          ],
          t(
            "Before the letter she is half smiling at small discoveries; after reading the second page she sits very still, and remembering him is no longer simple.",
            "读信前她对小发现半带微笑；读完第二页后她一动不动地坐着，回忆他再也不简单了。",
          ),
          [
            t("The story starts warm, not sad, and grows quiet, not loud.", "故事开头温馨而非悲伤，之后变得沉静而非吵闹。"),
            t("It moves away from playfulness, toward something grave.", "它从轻松转向沉重，而非相反。"),
            t("The tone darkens once she reads; it does not stay cheerful.", "她读信后气氛转暗，并非一直欢快。"),
          ],
        ),
        ask(
          t("What does the style of the grandfather's sentences suggest?", "祖父句子的风格暗示了什么？"),
          t("He could barely bring himself to describe what had happened", "他几乎无法让自己描述所发生的事"),
          [
            t("He was in a hurry to finish his crossword", "他急着完成填字游戏"),
            t("He had never learned to write long sentences", "他从未学会写长句子"),
            t("He wanted the letter to sound funny", "他想让这封信听起来有趣"),
          ],
          t(
            "He wrote in short, flat sentences, as if afraid that longer ones would break, which suggests the memory was almost too painful to put into words.",
            "他用简短平淡的句子写，仿佛害怕长句会断裂，这表明那段记忆痛苦得几乎无法诉诸文字。",
          ),
          [
            t("The crossword belongs to Sunday afternoons decades later.", "填字游戏是几十年后周日下午的事。"),
            t("The letter is several pages long, so he could write; he chose short sentences.", "信有好几页，他会写字；短句是他的选择。"),
            t("Nothing in the flat sentences is funny.", "那些平淡的短句毫无幽默。"),
          ],
        ),
        ask(
          t("What is left uncertain at the end of the story?", "故事结尾留下了什么不确定之处？"),
          t("What exactly the grandfather did, and what Nadia will do with the letter", "祖父究竟做了什么，以及娜迪亚会怎样处理这封信"),
          [
            t("Whether Nadia was really her grandfather's favorite", "娜迪亚是否真的是祖父最喜欢的人"),
            t("Whether the apricot cake needed more sugar", "杏子蛋糕是否需要更多糖"),
            t("Whether the grandfather had ever played chess", "祖父是否下过国际象棋"),
          ],
          t(
            "The story never says what he did in the village, and Nadia does not yet know what she will do with what she has read.",
            "故事从未说出他在村里做了什么，娜迪亚也还不知道该怎样处理她读到的内容。",
          ),
          [
            t("Everyone agreed she was his favorite.", "全家都同意她是他最疼爱的人。"),
            t("The cake question is settled: his note said less sugar.", "蛋糕的问题已有答案：他写了少放糖。"),
            t("He taught her chess, so that is certain.", "他教过她下棋，这一点确定无疑。"),
          ],
        ),
      ],
      ["Nadia"],
    ),
  ],
};
