// Grade 5: the reading unit of the sixth theme, the Maya, the Aztec and the Inca, and how they lived in rainforests, on
// lakes and high in the mountains.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const empireWords = { topic: "words-of-the-maya-aztec-and-inca", weight: 0.3 } as const;
const heightWords = { topic: "words-of-heights-and-depths", weight: 0.3 } as const;
const riseWords = { topic: "words-for-rise-and-fall", weight: 0.3 } as const;
const calendarWords = { topic: "words-of-calendars-and-counting", weight: 0.3 } as const;
const history = { topic: "connecting-events-in-history", weight: 0.2 } as const;
const accounts = { topic: "multiple-accounts-of-one-event", weight: 0.2 } as const;
const legend = { topic: "legend-or-history", weight: 0.2 } as const;
const sources = { topic: "finding-answers-in-several-sources", weight: 0.2 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** theMayaAztecAndInca is a reading unit of grade 5 on three great peoples of the Americas before 1500. */
export const theMayaAztecAndInca: ReadingUnitDef = {
  id: "the-maya-aztec-and-inca",
  title: t("The Maya, Aztec and Inca", "玛雅、阿兹特克和印加"),
  passages: [
    passage(
      "cities-in-the-rainforest",
      t("Cities in the Rainforest", "雨林中的城市"),
      `Deep in the rainforests of Central America, under a thick roof of green leaves, lie the ruins of great stone cities. They were built by the Maya, a people whose cities were at their height more than a thousand years ago.

Building in a rainforest was hard work. The Maya had no metal tools, no wheels for carrying loads and no horses or oxen. Yet they cleared the forest, cut blocks of limestone and raised enormous stepped temples that rose above the treetops. Priests climbed the steep stairs to hold ceremonies at the top, where everyone in the city below could see them.

Tikal, one of the largest Maya cities, may have been home to tens of thousands of people. It had palaces, plazas, ball courts and huge stone tanks that collected rainwater for the dry season.

The Maya were never one empire. Like the Greeks, they lived in many city-states, each with its own king, and these cities often fought one another.

Then, around 1,100 years ago, many of the great cities in the southern rainforest were abandoned. Scientists think a mix of long droughts, too many people for the land and constant wars may have caused this decline. Slowly, the forest grew back over the empty plazas.`,
      [empireWords, riseWords, history, academic2],
      [
        ask(
          t("What made building Maya cities especially hard?", "是什么让建造玛雅城市格外困难？"),
          t("They had no metal tools, wheels or animals for carrying", "他们没有金属工具、轮子或驮运的牲畜"),
          [
            t("There was no stone anywhere near the forest", "森林附近根本没有石头"),
            t("Their kings did not allow any building", "他们的国王不许建造任何东西"),
            t("It never rained in the rainforest", "雨林里从不下雨"),
          ],
          t(
            "The second paragraph says the Maya had no metal tools, no wheels for loads and no horses or oxen, yet still built great temples.",
            "第二段说，玛雅人没有金属工具、没有运货的轮子，也没有马或牛，却仍然建起了宏伟的神庙。",
          ),
        ),
        ask(
          t("Why did Tikal have huge stone tanks?", "蒂卡尔为什么有巨大的石砌水池？"),
          t("To collect rainwater for the dry season", "为旱季收集雨水"),
          [
            t("To hold ceremonies at the top", "在顶上举行仪式"),
            t("To keep enemies out of the city", "把敌人挡在城外"),
            t("To store blocks of limestone", "存放石灰岩块"),
          ],
          t("The third paragraph says the tanks collected rainwater for the dry season.", "第三段说，这些水池用来为旱季收集雨水。"),
        ),
        ask(
          t("What may have caused the southern Maya cities to be abandoned?", "什么可能导致了南部玛雅城市被遗弃？"),
          t("Droughts, too many people and constant wars together", "干旱、人口过多和连年战争共同作用"),
          [
            t("A single enemy army that destroyed every city", "一支摧毁了所有城市的敌军"),
            t("The forest growing over the plazas", "森林长满了广场"),
            t("The Maya moving to Greece", "玛雅人搬到了希腊"),
          ],
          t(
            "The last paragraph says scientists think a mix of long droughts, too many people and constant wars caused the decline. The forest grew back afterward, as a result.",
            "最后一段说，科学家认为长期干旱、人口过多和连年战争共同导致了衰落。森林重新生长是之后的结果。",
          ),
        ),
      ],
    ),
    passage(
      "maya-writing-and-calendars",
      t("Maya Writing and Calendars", "玛雅文字与历法"),
      `The Maya created the most complete writing system in the Americas before Europeans arrived. They carved it on stone monuments, painted it on pottery and wrote it in folding books made of bark paper.

Maya writing used hundreds of signs called glyphs. Some glyphs stood for whole words, such as "jaguar" or "king." Others stood for sounds, which could be combined to spell words. For a long time, no one could read them. Then, in the last century, scholars finally cracked the code, and today most Maya inscriptions can be read. Many tell the stories of kings: when they were born, when they took power and which battles they won.

The Maya were also skilled at counting time. They used several calendars at once. One had 365 days, close to the length of a year. Another, used for ceremonies, had 260 days. Together, the two calendars repeated only once every 52 years.

For very long stretches of time, they used a third calendar, called the Long Count, which counted days from a starting date thousands of years in the past.

To make all these calculations, the Maya used a number system based on twenty, and they were among the first people in the world to use a sign for zero.`,
      [calendarWords, empireWords],
      [
        ask(
          t("What could a single Maya glyph stand for?", "一个玛雅文字符号可以代表什么？"),
          t("A whole word or a sound", "一个完整的词或一个音"),
          [
            t("Only the name of a king", "只能代表国王的名字"),
            t("Only a number in the calendar", "只能代表历法中的一个数字"),
            t("Only a picture with no meaning", "只是没有意义的图画"),
          ],
          t(
            "The second paragraph says some glyphs stood for whole words and others stood for sounds that could spell words.",
            "第二段说，有些符号代表完整的词，另一些代表可以拼成词的音。",
          ),
        ),
        ask(
          t("How often did the 365-day and 260-day calendars repeat together?", "365 天历和 260 天历多久会一起重复一次？"),
          t("Once every 52 years", "每 52 年一次"),
          [t("Once every year", "每年一次"), t("Once every 20 years", "每 20 年一次"), t("Once every 260 years", "每 260 年一次")],
          t(
            "The third paragraph says the two calendars together repeated only once every 52 years.",
            "第三段说，这两种历法合在一起每 52 年才重复一次。",
          ),
        ),
        ask(
          t("What does the passage say about Maya numbers?", "文章怎样描述玛雅的数字？"),
          t("They were based on twenty and included zero", "以二十为基数，而且有零"),
          [
            t("They were based on ten, like ours", "像我们一样以十为基数"),
            t("They had no way to write large numbers", "无法书写大数"),
            t("They were copied from the Greeks", "是从希腊人那里抄来的"),
          ],
          t(
            "The last paragraph says the Maya used a number system based on twenty and were among the first to use a sign for zero.",
            "最后一段说，玛雅人使用以二十为基数的计数法，而且是最早使用零的符号的民族之一。",
          ),
        ),
      ],
    ),
    passage(
      "corn-beans-and-squash",
      t("Corn, Beans and Squash", "玉米、豆子和南瓜"),
      `Long before there were cities in the Americas, farmers there learned to grow three crops together. Many Native American peoples called them the Three Sisters: corn, beans and squash.

The three plants help one another, almost like members of a family. Corn grows tall and straight, giving the bean vines a pole to climb toward the sun. Beans do something remarkable for the soil. Tiny bacteria living on their roots take nitrogen from the air and add it to the soil, feeding the corn and squash. Squash spreads its huge, prickly leaves across the ground. The leaves shade the soil so it stays damp, block weeds from growing and keep hungry animals away.

The three crops are good partners on the plate too. Corn gives energy, beans give protein, and squash gives vitamins. Eaten together, they make a healthy diet.

Corn was especially important. The Maya and the Aztec ground it into flour to make flat cakes and thick drinks, and a Maya story tells that the gods made the first people out of corn dough.

Today, corn is grown on every continent except Antarctica. Every time you eat popcorn or a tortilla, you are enjoying a gift from the first farmers of the Americas.`,
      [empireWords, sources],
      [
        ask(
          t("How do beans help the other two crops?", "豆子怎样帮助另外两种作物？"),
          t("Bacteria on their roots add nitrogen to the soil", "它们根上的细菌给土壤增加氮"),
          [
            t("They give the corn a pole to climb", "它们给玉米提供攀爬的杆子"),
            t("Their leaves shade the soil and block weeds", "它们的叶子遮住土壤、挡住杂草"),
            t("Their prickles keep hungry animals away", "它们的刺能赶走饥饿的动物"),
          ],
          t(
            "The second paragraph says bacteria on bean roots take nitrogen from the air and add it to the soil. The corn is the pole, and the squash shades the ground.",
            "第二段说，豆根上的细菌从空气中获取氮并加入土壤。玉米是杆子，南瓜给地面遮阴。",
          ),
        ),
        ask(
          t("Why are the crops called the Three Sisters?", "这些作物为什么被称为“三姐妹”？"),
          t("They grow together and help one another, like a family", "它们一起生长、互相帮助，像一家人"),
          [
            t("Three sisters were the first to plant them", "三个姐妹最先种植了它们"),
            t("They all look exactly alike", "它们长得一模一样"),
            t("They can only be eaten by girls", "只有女孩才能吃它们"),
          ],
          t(
            "The passage explains that the plants help one another almost like members of a family.",
            "文章解释说，这些植物互相帮助，几乎像一家人。",
          ),
        ),
        ask(
          t("What does the Maya story about corn show?", "关于玉米的玛雅故事说明了什么？"),
          t("How important corn was to the Maya", "玉米对玛雅人有多重要"),
          [
            t("How corn was first brought to Antarctica", "玉米最初是怎样被带到南极洲的"),
            t("Why squash leaves are prickly", "南瓜叶为什么有刺"),
            t("How to make popcorn at home", "怎样在家做爆米花"),
          ],
          t(
            "The fourth paragraph begins by saying corn was especially important, and the story that people were made from corn dough supports that.",
            "第四段开头说玉米格外重要，而人是用玉米面团造出来的故事支持了这一点。",
          ),
        ),
      ],
    ),
    passage(
      "the-island-city-of-the-aztec",
      t("The Island City of the Aztec", "阿兹特克的岛上之城"),
      `According to an Aztec legend, the god of the sun told the wandering Aztec people to settle where they saw an eagle perched on a cactus, eating a snake. Around 1325, they saw that sign on a swampy island in a great lake in the Valley of Mexico. There they began to build their capital, Tenochtitlan.

It seemed a poor place for a city, but the Aztec made the most of it. They built wide stone causeways, raised roads that crossed the water and joined the island to the shore. They built a stone aqueduct that carried fresh water from springs on the mainland. Canoes filled the canals that ran between the streets, carrying goods and people.

By about 1500, Tenochtitlan had grown into one of the largest cities in the world, with perhaps 200,000 people. At its center rose the Great Temple, and nearby a huge market drew tens of thousands of shoppers each day.

In 1519, Spanish soldiers led by Hernán Cortés arrived. One of them later wrote that the city looked like something from a dream. Two years later, after fierce fighting and a terrible disease the Spanish had brought, the city fell.

Today, Mexico City stands on the same spot, and the eagle on the cactus appears on the flag of Mexico.`,
      [empireWords, legend, accounts],
      [
        ask(
          t("Which part of the passage is a legend rather than history?", "文章中哪一部分是传说而不是历史？"),
          t("A god telling the Aztec to settle where an eagle sat on a cactus", "神让阿兹特克人在鹰栖于仙人掌之处定居"),
          [
            t("Spanish soldiers arriving in 1519", "西班牙士兵在 1519 年到达"),
            t("A city of perhaps 200,000 people by 1500", "到 1500 年人口约二十万的城市"),
            t("Mexico City standing on the same spot today", "今天墨西哥城就坐落在同一个地方"),
          ],
          t(
            'The passage marks the eagle story with "According to an Aztec legend." The dates and numbers are facts historians can check.',
            '文章用 "According to an Aztec legend" 标明鹰的故事。日期和数字是历史学家可以核实的事实。',
          ),
        ),
        ask(
          t("What were the causeways for?", "堤道是做什么用的？"),
          t("To join the island city to the shore", "把岛上的城市和湖岸连接起来"),
          [
            t("To carry fresh water from springs", "从泉水处引来淡水"),
            t("To hold the market each day", "每天举行集市"),
            t("To keep canoes off the canals", "不让独木舟进入运河"),
          ],
          t(
            "The second paragraph says the causeways were raised roads that crossed the water and joined the island to the shore. The aqueduct carried the water.",
            "第二段说，堤道是横跨水面、连接岛屿与湖岸的高路。输送淡水的是引水渠。",
          ),
        ),
        ask(
          t("According to the passage, what helped bring about the fall of the city?", "根据文章，是什么导致了这座城市的陷落？"),
          t("Fierce fighting and a disease the Spanish brought", "激烈的战斗和西班牙人带来的疾病"),
          [
            t("A long drought that dried up the lake", "一场使湖泊干涸的长期干旱"),
            t("The Aztec leaving to find a new eagle", "阿兹特克人离开去寻找新的鹰"),
            t("The market growing too large", "集市变得太大"),
          ],
          t(
            "The fourth paragraph says the city fell after fierce fighting and a terrible disease the Spanish had brought.",
            "第四段说，经过激烈的战斗以及西班牙人带来的可怕疾病，这座城市陷落了。",
          ),
        ),
      ],
    ),
    passage(
      "floating-gardens",
      t("Floating Gardens", "浮动园圃"),
      `How do you feed 200,000 people in a city built on a lake? The Aztec answer was the chinampa, a garden built on the water.

To make a chinampa, farmers first marked out a long, narrow rectangle in the shallow part of the lake by driving wooden stakes into the lake bottom. They wove branches between the stakes to make a kind of fence. Then they filled the space inside with layers of mud scooped from the lake floor and rotting plants, until the pile rose above the water. Finally, they planted willow trees along the edges. The roots grew down and held the garden firmly in place.

Though people called them floating gardens, chinampas did not really float. They were islands, anchored to the lake bottom.

They were also wonderfully rich farmland. Water soaked up into the soil from below, so the crops rarely needed watering. When the soil wore out, farmers scooped fresh mud from the canals and spread it on top. Some chinampas gave as many as seven harvests a year of corn, beans, squash, peppers and flowers.

Thousands of chinampas surrounded Tenochtitlan, separated by canals. A few still exist south of Mexico City, where families grow vegetables and flowers on them today.`,
      [empireWords, riseWords],
      [
        ask(
          t("What was the first step in making a chinampa?", "建造浮田的第一步是什么？"),
          t("Driving wooden stakes into the lake bottom", "把木桩打进湖底"),
          [
            t("Planting willow trees along the edges", "沿边缘种柳树"),
            t("Filling the space with mud and plants", "用淤泥和植物填满空间"),
            t("Scooping mud from the canals onto the top", "从运河里舀淤泥铺在上面"),
          ],
          t(
            'The second paragraph says farmers "first" drove stakes into the lake bottom; the mud came next, and the willows "finally."',
            '第二段说农民 "first" 把木桩打进湖底；然后填淤泥，"finally" 才种柳树。',
          ),
        ),
        ask(
          t("Did chinampas really float?", "浮田真的会漂浮吗？"),
          t("No, they were islands anchored to the lake bottom", "不会，它们是固定在湖底的小岛"),
          [
            t("Yes, they drifted around the lake", "会，它们在湖上漂来漂去"),
            t("Yes, but only in the dry season", "会，但只在旱季"),
            t("No, they were built on dry land", "不会，它们建在干地上"),
          ],
          t(
            "The third paragraph says that though people called them floating gardens, chinampas did not really float; they were anchored islands.",
            "第三段说，虽然人们称之为浮动园圃，浮田其实并不漂浮，它们是固定的小岛。",
          ),
        ),
        ask(
          t("Why did the crops on chinampas rarely need watering?", "浮田上的庄稼为什么很少需要浇水？"),
          t("Water soaked up into the soil from below", "水从下面渗进土壤"),
          [
            t("It rained on them every day", "每天都有雨落在上面"),
            t("The willow trees carried water to them", "柳树给它们输水"),
            t("The farmers grew only flowers", "农民只种花"),
          ],
          t(
            "The fourth paragraph says water soaked up into the soil from below, so the crops rarely needed watering.",
            "第四段说，水从下面渗进土壤，所以庄稼很少需要浇水。",
          ),
        ),
      ],
    ),
    passage(
      "the-inca-road",
      t("The Inca Road", "印加古道"),
      `In the 1400s, the Inca built the largest empire in the Americas. It stretched more than 4,000 kilometers along the Andes Mountains of South America, from high snowy peaks to dry deserts and steamy forests. To hold such a long, rugged empire together, the Inca built roads.

Their road network covered about 40,000 kilometers, enough to wrap around the Earth. Some stretches were paved with fitted stones. On steep slopes, the road became stone stairs cut into the mountainside. Over deep gorges, the Inca hung bridges woven from grass rope, strong enough to carry people and llamas. Villagers rebuilt the bridges every year so they never wore out.

The Inca had no horses and no wheeled carts, so most people walked, and llamas carried the loads. Messages traveled by relay. Young runners waited at small stations along the road. Each one ran a few kilometers, then passed the message to the next runner. In this way, news could travel about 240 kilometers in a single day.

Along the roads stood storehouses full of food, cloth and weapons, so soldiers and travelers always had supplies.

Parts of the Inca road are still used today, and some hikers walk it for days to reach the mountain city of Machu Picchu.`,
      [empireWords, heightWords],
      [
        ask(
          t("Why did the Inca build so many roads?", "印加人为什么修建了这么多道路？"),
          t("To hold their long, rugged empire together", "把他们漫长崎岖的帝国连成一体"),
          [
            t("To give their horses a place to run", "给他们的马一个奔跑的地方"),
            t("To reach the cities of the Maya", "到达玛雅人的城市"),
            t("To wrap a road around the Earth", "修一条环绕地球的路"),
          ],
          t(
            "The first paragraph says they built roads to hold such a long, rugged empire together. The Inca had no horses.",
            "第一段说，他们修路是为了把这样一个漫长崎岖的帝国连在一起。印加人没有马。",
          ),
        ),
        ask(
          t("How did messages travel on the Inca road?", "印加古道上的消息是怎样传递的？"),
          t("Runners passed them from one to the next", "跑者一个接一个地传递"),
          [
            t("Llamas carried them alone between cities", "羊驼独自在城市间驮送"),
            t("Riders on horses galloped with them", "骑手骑马飞奔传送"),
            t("They were shouted from peak to peak", "从一座山峰喊到另一座山峰"),
          ],
          t(
            "The third paragraph describes a relay: each runner ran a few kilometers, then passed the message to the next.",
            "第三段描述了接力：每个跑者跑几公里，然后把消息传给下一个人。",
          ),
        ),
        ask(
          t("Why did villagers rebuild the rope bridges every year?", "村民为什么每年都重建绳桥？"),
          t("So they never wore out", "这样它们就永远不会磨损坏掉"),
          [
            t("Because llamas ate the grass rope", "因为羊驼吃掉了草绳"),
            t("Because the rivers changed course", "因为河流改道了"),
            t("So the bridges could carry carts", "这样桥就能通行车辆"),
          ],
          t(
            "The second paragraph says villagers rebuilt the bridges every year so they never wore out.",
            "第二段说，村民每年重建这些桥，这样它们就不会磨损。",
          ),
        ),
      ],
    ),
    passage(
      "machu-picchu",
      t("Machu Picchu", "马丘比丘"),
      `High on a narrow ridge in the Andes, about 2,400 meters above sea level, sit the stone ruins of Machu Picchu. Clouds often drift below it, and on both sides the mountain drops steeply to a roaring river far beneath.

The Inca built Machu Picchu in the 1400s, probably as a retreat for an emperor. Its builders were masters of stonework. They cut granite blocks so precisely that the stones fit together without any mortar, and in many places a knife blade cannot slip between them. Because the stones can shift slightly and settle back, the walls have survived many earthquakes.

To farm on such steep slopes, the Inca built terraces, wide flat steps cut into the mountainside and held up by stone walls. The terraces stopped the soil from washing away in heavy rain, and layers of gravel underneath let extra water drain off. Crops such as corn and potatoes grew on them.

Machu Picchu was used for less than a hundred years. It was abandoned around the time the Spanish arrived, perhaps because of war or disease. The Spanish never found it, and for centuries only local farmers knew it was there. In 1911, an explorer named Hiram Bingham was led to it, and photographs soon made it famous around the world.`,
      [heightWords, riseWords],
      [
        ask(
          t("Why have the walls of Machu Picchu survived many earthquakes?", "马丘比丘的墙为什么能经受多次地震？"),
          t("The stones can shift slightly and settle back", "石块能轻微移动后再归位"),
          [
            t("They are held together with strong mortar", "它们用坚固的灰浆粘在一起"),
            t("They were rebuilt every year by villagers", "村民每年都重建它们"),
            t("Earthquakes never happen in the Andes", "安第斯山脉从不发生地震"),
          ],
          t(
            "The second paragraph says the stones fit without mortar and can shift slightly and settle back, so the walls have survived earthquakes.",
            "第二段说，石块不用灰浆就能严丝合缝，能轻微移动后再归位，所以墙经受住了地震。",
          ),
        ),
        ask(
          t("How did the terraces help farmers?", "梯田怎样帮助了农民？"),
          t("They stopped soil washing away and let water drain", "防止土壤被冲走，并让水排走"),
          [
            t("They kept the clouds away from the crops", "让云远离庄稼"),
            t("They made the mountain less steep for walking", "让山不那么陡，便于行走"),
            t("They hid the city from the Spanish", "让西班牙人找不到这座城市"),
          ],
          t(
            "The third paragraph says the terraces stopped soil from washing away, and gravel underneath let extra water drain off.",
            "第三段说，梯田防止土壤被冲走，下面的砾石层能让多余的水排出。",
          ),
        ),
        ask(
          t("What does the passage say about how Machu Picchu became famous?", "文章怎样讲述马丘比丘出名的经过？"),
          t("An explorer was led to it in 1911, and photographs spread", "1911 年一位探险家被领到那里，照片随之传开"),
          [
            t("The Spanish found it and wrote about it", "西班牙人发现了它并写了文章"),
            t("An emperor invited visitors from Europe", "一位皇帝邀请了欧洲的游客"),
            t("Farmers sold its stones in the city", "农民把它的石头拿到城里卖"),
          ],
          t(
            "The last paragraph says the Spanish never found it; in 1911 Hiram Bingham was led to it, and photographs made it famous.",
            "最后一段说，西班牙人从未发现它；1911 年海勒姆·宾厄姆被领到那里，照片使它闻名于世。",
          ),
        ),
      ],
    ),
    passage(
      "knots-that-kept-records",
      t("Knots That Kept Records", "用绳结记事"),
      `The Inca ruled millions of people, collected taxes and filled thousands of storehouses, all without a written language. How did they keep track of everything? They used knots.

The Inca recording tool was called a khipu, which means "knot." A khipu was a main cord with many thinner strings hanging from it, sometimes hundreds of them. Each string could carry knots of different kinds tied at different places along it.

The position of a knot showed its value. Knots near the bottom of a string stood for ones, the next group up stood for tens, then hundreds, and so on, very like the way we write numbers today. A string with seven knots near the bottom and three knots higher up meant thirty-seven. The color of a string may have shown what was being counted: llamas, potatoes or people.

Special officials called khipukamayuq, "knot keepers," made and read the khipus. They traveled the empire, recording harvests and counting the people in each village, and runners carried khipus along the roads to the capital.

About 1,000 khipus survive in museums today. Scholars can read the numbers on many of them, but some researchers believe khipus also recorded stories and history. If so, no one has yet learned to read them.`,
      [calendarWords, sources],
      [
        ask(
          t("What did the position of a knot on a string show?", "绳上绳结的位置表示什么？"),
          t("Its value: ones, tens, hundreds and so on", "它的数值：个、十、百等"),
          [
            t("What was being counted, such as llamas", "所计的是什么，比如羊驼"),
            t("Which village the khipu came from", "这根结绳来自哪个村庄"),
            t("The name of the knot keeper", "结绳官的名字"),
          ],
          t(
            "The third paragraph says the position showed the value. The color of the string may have shown what was being counted.",
            "第三段说，位置表示数值。绳子的颜色可能表示所计的东西。",
          ),
        ),
        ask(
          t(
            "A string has seven knots near the bottom and three higher up. What number is it?",
            "一根绳子下部有七个结，上面有三个结。它表示什么数？",
          ),
          t("Thirty-seven", "三十七"),
          [t("Seventy-three", "七十三"), t("Ten", "十"), t("Three hundred seven", "三百零七")],
          t(
            "Knots near the bottom are ones and the next group up are tens, so three tens and seven ones make thirty-seven.",
            "下部的结表示个位，上面一组表示十位，所以三个十加七个一是三十七。",
          ),
        ),
        ask(
          t("What question about khipus is still unanswered?", "关于结绳，还有什么问题没有答案？"),
          t("Whether they also recorded stories and history", "它们是否也记录了故事和历史"),
          [
            t("Whether they recorded numbers at all", "它们到底是否记录了数字"),
            t("What the word khipu means", "khipu 这个词是什么意思"),
            t("Who made and read the khipus", "谁制作和解读结绳"),
          ],
          t(
            "The last paragraph says scholars can read the numbers, but some believe khipus also recorded stories, and no one has learned to read those yet.",
            "最后一段说，学者能读出数字，但有人认为结绳还记录了故事，而这些至今没人能读懂。",
          ),
        ),
      ],
    ),
  ],
};
