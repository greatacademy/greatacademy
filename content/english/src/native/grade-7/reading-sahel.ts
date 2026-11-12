// Grade 7: the reading unit of the fourth theme, the empires of West Africa, from the gold and salt of Ghana to the
// scholars and manuscripts of Timbuktu.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const empireWords = { topic: "words-of-west-african-empires", weight: 0.3 } as const;
const tradeWords = { topic: "words-of-the-saharan-trade", weight: 0.3 } as const;
const scholarWords = { topic: "words-of-scholars-and-books", weight: 0.3 } as const;
const maps = { topic: "reading-historical-maps", weight: 0.2 } as const;
const fictionHistory = { topic: "comparing-fiction-and-history", weight: 0.2 } as const;
const interact = { topic: "how-individuals-and-events-interact", weight: 0.2 } as const;
const greek3 = { topic: "greek-roots-3", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** goldSaltAndBooks is a reading unit of grade 7 on the empires of Ghana, Mali and Songhai and the trade across the Sahara. */
export const goldSaltAndBooks: ReadingUnitDef = {
  id: "gold-salt-and-books",
  title: t("Gold, Salt and Books", "黄金、盐与书籍"),
  passages: [
    passage(
      "the-land-of-gold",
      t("The Land of Gold", "黄金之地"),
      `More than a thousand years ago, travelers from North Africa told stories of a kingdom south of the Sahara so rich that its king tied his horses to a nugget of gold. That kingdom was Ghana. It had no connection to the modern country of the same name, which lies far to the south. The old empire of Ghana stood in the dry grasslands between the desert and the forests, in parts of what are now Mauritania and Mali.

Ghana grew powerful because of where it was. To the south lay mines where workers dug gold from riverbanks. To the north, in the heart of the Sahara, lay mines of salt. People in the hot south needed salt to stay healthy and to keep food from spoiling, and the people of the north and of the Mediterranean world wanted gold. Ghana sat between them, in the middle of the trade.

The kings of Ghana grew rich not by mining but by taxing. Every load of salt that entered the kingdom paid a tax, and so did every load that left. The king also had a clever rule: all nuggets of gold found in his lands belonged to him, while traders could keep only gold dust. This kept gold scarce, so its price stayed high.

In 1068, a scholar in Spain named al-Bakri wrote a description of Ghana's capital, based on the reports of merchants. He described a king who sat in a domed pavilion, surrounded by horses wearing gold cloth and guards holding gold-mounted swords.

Ghana's power faded in the 1100s, but the trade it had built did not. Other empires would rise in the same lands and grow even richer.`,
      [empireWords, tradeWords, interact],
      [
        ask(
          t("Why did Ghana grow powerful?", "加纳为什么强大起来？"),
          t("It lay between the gold of the south and the salt of the north", "它位于南方的黄金和北方的盐之间"),
          [
            t("It had the largest gold mines in the Sahara", "它拥有撒哈拉最大的金矿"),
            t("It conquered the Mediterranean world", "它征服了地中海世界"),
            t("It was the same as the modern country of Ghana", "它就是现代的加纳国"),
          ],
          t(
            "The second paragraph says gold mines lay to the south and salt mines to the north, and Ghana sat between them, in the middle of the trade.",
            "第二段说金矿在南方，盐矿在北方，而加纳位于两者之间，处在贸易的中心。",
          ),
        ),
        ask(
          t("Why did the king keep all the gold nuggets for himself?", "国王为什么把所有金块都据为己有？"),
          t("To keep gold scarce so its price stayed high", "让黄金保持稀缺，从而保持高价"),
          [
            t("To tie his horses to them", "用来拴他的马"),
            t("Because traders did not want nuggets", "因为商人不想要金块"),
            t("To pay the tax on salt", "用来支付盐税"),
          ],
          t(
            "The third paragraph says the rule kept gold scarce, so its price stayed high.",
            "第三段说这条规定让黄金保持稀缺，所以价格一直很高。",
          ),
        ),
        ask(
          t("Where did al-Bakri get his information about Ghana?", "巴克里关于加纳的信息是从哪里来的？"),
          t("From the reports of merchants", "来自商人的报告"),
          [
            t("From his own visit to the king", "来自他亲自拜访国王"),
            t("From the king's own letters", "来自国王本人的信件"),
            t("From ancient Greek books", "来自古希腊书籍"),
          ],
          t(
            "The fourth paragraph says al-Bakri wrote in Spain, based on the reports of merchants, so his description is a secondhand account.",
            "第四段说巴克里在西班牙写作，依据的是商人的报告，所以他的描述是转述。",
          ),
        ),
      ],
      ["Ghana", "Ghana's", "Sahara", "Mauritania", "Mali", "Mediterranean", "Spain", "al-Bakri", "North", "Africa"],
    ),
    passage(
      "the-salt-road",
      t("The Salt Road", "盐之路"),
      `Yusuf was twelve the first time his uncle let him join the caravan. Before dawn, he helped load the camels with cloth, copper pots and baskets of dates. By the time the sun rose over the town of Sijilmasa, more than a thousand camels stood in a line that stretched out of sight.

For the first few days, Yusuf thought the desert was beautiful. The dunes rose and fell like waves, gold in the morning and red at sunset. But soon the heat pressed down like a heavy hand. Water was rationed, and each evening his uncle measured it out in a small brass cup.

"The desert does not forgive mistakes," his uncle said. "A caravan that loses its way dies of thirst."

They traveled by night when the heat was worst, guided by a man named Ibrahim who read the stars and the shapes of the dunes the way Yusuf read the Quran. Every few days they reached a well, and the camels drank for what seemed like hours.

After nearly a month, they reached Taghaza. Yusuf stared. The houses of the town were built from blocks of salt, and their roofs were made of camel skins. Men cut great slabs of salt from the ground, each as heavy as a boy.

The caravan traded its cloth and copper for salt, and loaded two slabs onto each camel. Then they turned south again, toward the markets of Mali, where salt would be traded for gold.

That night, Yusuf lay beside the fire and looked up at Ibrahim's stars. He was tired and sore, but he already knew he would come again.`,
      [tradeWords, fictionHistory],
      [
        ask(
          t("Why did the caravan travel by night?", "商队为什么在夜间赶路？"),
          t("To avoid the worst of the heat", "为了避开最酷热的时候"),
          [
            t("To hide from the king's soldiers", "为了躲避国王的士兵"),
            t("Because the wells were open only at night", "因为水井只在夜里开放"),
            t("Because the camels could not see by day", "因为骆驼白天看不见"),
          ],
          t("The fourth paragraph says they traveled by night when the heat was worst.", "第四段说他们在最热的时候改在夜间赶路。"),
        ),
        ask(
          t("Which detail in the story is a historical fact rather than an invention?", "故事中哪个细节是历史事实而不是虚构？"),
          t("The houses of Taghaza were built from blocks of salt", "塔加扎的房屋是用盐块建造的"),
          [
            t("Yusuf was twelve on his first trip", "尤素福第一次出行时十二岁"),
            t("Ibrahim read the stars the way Yusuf read the Quran", "易卜拉欣读星星就像尤素福读《古兰经》一样"),
            t("Yusuf knew he would come again", "尤素福知道自己还会再来"),
          ],
          t(
            "Yusuf, his uncle and Ibrahim are invented characters, and their thoughts are invented too. The salt houses of Taghaza are real: travelers who visited the town described houses built of salt blocks and roofed with camel skins.",
            "尤素福、他的叔叔和易卜拉欣都是虚构的人物，他们的想法也是虚构的。塔加扎的盐屋是真实的：到过那里的旅行者描述过用盐块建造、用骆驼皮做屋顶的房屋。",
          ),
        ),
        ask(
          t("What does the uncle's warning, The desert does not forgive mistakes, suggest?", "叔叔的警告“沙漠不会原谅错误”暗示了什么？"),
          t("A small error in the desert could cost lives", "在沙漠中一个小错误就可能致命"),
          [
            t("The desert is too beautiful to cross quickly", "沙漠太美了，不能匆匆穿过"),
            t("Yusuf had already made many mistakes", "尤素福已经犯了很多错误"),
            t("Traders should never go to Taghaza", "商人永远不应该去塔加扎"),
          ],
          t(
            "The uncle explains it in the next sentence: a caravan that loses its way dies of thirst.",
            "叔叔在下一句话中作了解释：迷路的商队会渴死。",
          ),
        ),
      ],
      ["Yusuf", "Sijilmasa", "Ibrahim", "Ibrahim's", "Quran", "Taghaza", "Mali"],
    ),
    passage(
      "the-lion-prince",
      t("The Lion Prince", "狮子王子"),
      `In West Africa, the story of Sundiata Keita has been told for more than seven hundred years. It is not written in a book. It is spoken and sung by griots, storytellers and historians who memorize the history of their people and pass it from parent to child.

In the epic, Sundiata is born to a king and a woman who is said to be ugly but wise. As a child, he cannot walk, and other children mock him. When his father dies, a rival queen drives Sundiata and his mother into exile. Then one day, angered by an insult to his mother, Sundiata pulls himself up on an iron rod so heavy that it bends, and he walks. He grows into a great hunter and warrior.

Meanwhile, a cruel sorcerer king named Sumanguru conquers Sundiata's homeland. Sundiata returns, gathers an army from many peoples and defeats Sumanguru in a great battle, using an arrow tipped with the spur of a white rooster, the only thing that can break the sorcerer's magic.

How much of this is history? Historians agree that a ruler named Sundiata really lived and that, around 1235, he defeated the kingdom of Sosso and founded the empire of Mali. Arab writers who visited the region later confirm that Mali was a great power. But the magical details, such as the bending rod and the sorcerer's spells, cannot be checked against other sources.

For the griots, these details are not mistakes. They express what the people of Mali believe about their founder: that he rose from weakness to greatness, and that he won because he united many peoples against a tyrant.`,
      [empireWords, fictionHistory, interact, academic2, academic1],
      [
        ask(
          t("Who are griots?", "格里奥是什么人？"),
          t("Storytellers and historians who memorize and pass on history", "记忆并传承历史的说书人和史官"),
          [
            t("Arab writers who visited Mali", "到访马里的阿拉伯作家"),
            t("Soldiers in Sundiata's army", "松迪亚塔军队中的士兵"),
            t("Rival queens of the kingdom", "王国中敌对的王后"),
          ],
          t(
            "The first paragraph defines griots as storytellers and historians who memorize the history of their people and pass it from parent to child.",
            "第一段把格里奥定义为记忆本民族历史并代代相传的说书人和史官。",
          ),
        ),
        ask(
          t("Which part of the story do historians accept as fact?", "历史学家接受故事的哪一部分为事实？"),
          t("Sundiata defeated Sosso and founded the empire of Mali", "松迪亚塔打败了索索，建立了马里帝国"),
          [
            t("He walked by pulling himself up on a bending iron rod", "他借助一根被压弯的铁棒站起来走路"),
            t("An arrow with a rooster's spur broke Sumanguru's magic", "带公鸡距的箭破除了苏曼古鲁的魔法"),
            t("His mother was ugly but wise", "他的母亲丑陋但聪慧"),
          ],
          t(
            "The fourth paragraph says historians agree Sundiata really lived and, around 1235, defeated Sosso and founded Mali, while the magical details cannot be checked against other sources.",
            "第四段说历史学家一致认为松迪亚塔确有其人，约在1235年打败索索并建立了马里，而那些神奇的细节无法与其他史料核对。",
          ),
        ),
        ask(
          t(
            "According to the last paragraph, why do the magical details matter to the griots?",
            "根据最后一段，那些神奇的细节为什么对格里奥很重要？",
          ),
          t("They express what the people believe about their founder", "它们表达了人们对开国者的信念"),
          [
            t("They prove that Sundiata had real magic", "它们证明松迪亚塔真有魔法"),
            t("They were copied from Arab writers", "它们是从阿拉伯作家那里抄来的"),
            t("They are mistakes the griots want to correct", "它们是格里奥想要纠正的错误"),
          ],
          t(
            "The last paragraph says the details are not mistakes for the griots; they express the belief that Sundiata rose from weakness to greatness and united many peoples against a tyrant.",
            "最后一段说对格里奥而言这些细节不是错误；它们表达了一种信念：松迪亚塔从弱小走向伟大，团结众多民族推翻了暴君。",
          ),
        ),
      ],
      ["Sundiata", "Sundiata's", "Keita", "Sumanguru", "Sosso", "Mali", "Arab", "West", "Africa"],
      ["griots"],
    ),
    passage(
      "the-king-who-gave-away-gold",
      t("The King Who Gave Away Gold", "散尽黄金的国王"),
      `In 1324, a caravan left the empire of Mali on a journey of more than four thousand kilometers. At its head rode the mansa, or emperor, of Mali, a man named Musa. He was a Muslim, and he was making the hajj, the pilgrimage to the holy city of Mecca that every Muslim who is able should make once in a lifetime.

No one in North Africa had seen anything like it. According to Arab writers, the caravan included thousands of people, among them soldiers, officials and servants, and dozens of camels each carrying loads of gold. The numbers may have grown in the retelling, but all the accounts agree that the caravan was enormous.

When Mansa Musa reached Cairo, in Egypt, he spent and gave away so much gold that the price of gold in the city fell. A writer named al-Umari, who visited Cairo about twelve years later, reported that the value of gold there had still not fully recovered.

The journey had important effects. It showed the Islamic world, and later Europe, that Mali was one of the richest empires on Earth. In 1375, a mapmaker on the island of Majorca drew Mansa Musa on a map of Africa, seated on a throne and holding a large gold nugget.

Mansa Musa also brought back more than memories. He returned with scholars and an architect, and he paid for mosques and schools, including a great mosque in the city of Timbuktu. Under his rule, Timbuktu began to grow into a center of learning that would attract students from across Africa. His pilgrimage turned gold into something that lasted longer: knowledge.`,
      [empireWords, tradeWords, interact, academic2],
      [
        ask(
          t("What was the hajj?", "朝觐是什么？"),
          t("The pilgrimage to Mecca that every able Muslim should make once", "每个有能力的穆斯林一生中应完成一次的麦加朝圣"),
          [
            t("A caravan that carried salt across the Sahara", "一支穿越撒哈拉运盐的商队"),
            t("A tax on gold paid to the emperor", "向皇帝缴纳的黄金税"),
            t("A school for scholars in Timbuktu", "廷巴克图的一所学者学校"),
          ],
          t(
            "The first paragraph defines the hajj as the pilgrimage to the holy city of Mecca that every Muslim who is able should make once in a lifetime.",
            "第一段把朝觐定义为每个有能力的穆斯林一生中应完成一次的圣城麦加朝圣。",
          ),
        ),
        ask(
          t("Why did the price of gold in Cairo fall?", "开罗的金价为什么下跌？"),
          t("Mansa Musa spent and gave away so much gold there", "曼萨·穆萨在那里花掉和送出了大量黄金"),
          [
            t("The mines of Egypt produced too much gold", "埃及的金矿出产了太多黄金"),
            t("Arab writers told people gold was worthless", "阿拉伯作家告诉人们黄金一文不值"),
            t("The caravan stole gold from the city", "商队从城里偷走了黄金"),
          ],
          t(
            "The third paragraph says he spent and gave away so much gold in Cairo that the price of gold in the city fell.",
            "第三段说他在开罗花掉和送出了大量黄金，以致城里的金价下跌。",
          ),
        ),
        ask(
          t("What does the author mean by the last sentence?", "作者最后一句话是什么意思？"),
          t("The scholars and schools he brought had a more lasting effect than the gold", "他带回的学者和学校比黄金产生了更持久的影响"),
          [
            t("Mansa Musa sold books for gold in Cairo", "曼萨·穆萨在开罗用书换黄金"),
            t("Gold can be melted into books", "黄金可以熔炼成书"),
            t("Timbuktu was richer than Cairo", "廷巴克图比开罗更富有"),
          ],
          t(
            "The last paragraph describes the scholars, architect, mosques and schools he brought to Timbuktu; the last sentence says his pilgrimage turned gold into knowledge, which lasted longer.",
            "最后一段描述了他带到廷巴克图的学者、建筑师、清真寺和学校；最后一句说他的朝圣把黄金变成了更持久的东西：知识。",
          ),
        ),
      ],
      [
        "Mali",
        "Mansa",
        "Musa",
        "Muslim",
        "Mecca",
        "Cairo",
        "Egypt",
        "Arab",
        "al-Umari",
        "Islamic",
        "Europe",
        "Majorca",
        "Africa",
        "Timbuktu",
        "Earth",
        "North",
      ],
      ["hajj"],
    ),
    passage(
      "a-map-from-majorca",
      t("A Map from Majorca", "来自马略卡的地图"),
      `In 1375, a mapmaker named Abraham Cresques finished a remarkable set of maps on the island of Majorca, off the coast of Spain. Today it is called the Catalan Atlas, and it is kept in a library in Paris. It is drawn on large sheets of parchment and decorated with gold, silver and bright colors.

Historians study the atlas closely, because it shows what Europeans of the time knew, and believed, about the world. Its maps stretch from the Atlantic Ocean in the west to China in the east. Europe and the coasts of the Mediterranean are drawn with great accuracy, with hundreds of ports labeled in order along the shore. Sailors had measured these coasts for centuries, and the mapmaker could rely on their charts.

Farther away, the atlas becomes less accurate and more decorative. In the south of the map, below the Atlas Mountains, sits a crowned African king on a throne, holding a gold nugget in one hand and a scepter in the other. A label explains that he is the lord of Mali and the richest king in all the land because of the gold found there. A rider on a camel approaches him across the desert.

Abraham Cresques had never been to Mali. He drew it from the reports of merchants, especially traders who crossed the Sahara. That is why the details are vague, but the message is clear.

For a historian, the picture of Mansa Musa is powerful evidence. Fifty years after his famous pilgrimage, the story of his wealth had spread so widely that a mapmaker in Europe placed him at the center of his map of Africa.`,
      [maps, empireWords, tradeWords, academic1],
      [
        ask(
          t("Why are the Mediterranean coasts drawn so accurately on the atlas?", "为什么地图集上的地中海海岸画得如此精确？"),
          t("The mapmaker could rely on charts sailors had made for centuries", "地图绘制者可以依靠水手几个世纪以来绘制的海图"),
          [
            t("Cresques had sailed along every coast himself", "克雷斯克斯亲自沿每一段海岸航行过"),
            t("Merchants from Mali described them to him", "来自马里的商人向他描述了这些海岸"),
            t("The coasts were decorated with gold", "海岸用黄金装饰"),
          ],
          t(
            "The second paragraph says sailors had measured these coasts for centuries and the mapmaker could rely on their charts.",
            "第二段说水手几个世纪以来一直在测量这些海岸，地图绘制者可以依靠他们的海图。",
          ),
        ),
        ask(
          t("What does the picture of the king on the atlas show about Mali?", "地图集上的国王画像表现了马里的什么？"),
          t("It was known as a land of great wealth in gold", "它以盛产黄金、极为富有而闻名"),
          [
            t("It was ruled by a king from Europe", "它由一位来自欧洲的国王统治"),
            t("Its borders were measured exactly", "它的边界被精确测量过"),
            t("It had no trade with the north", "它与北方没有贸易往来"),
          ],
          t(
            "The third paragraph describes a crowned king holding a gold nugget, with a label saying he is the richest king in all the land because of the gold found there.",
            "第三段描述了一位手持金块、头戴王冠的国王，旁边的标签说他因那里出产的黄金而成为这片土地上最富有的国王。",
          ),
        ),
        ask(
          t("Why are the details of Mali vague on the atlas?", "为什么马里的细节在地图集上很模糊？"),
          t("The mapmaker had never been there and relied on merchants' reports", "地图绘制者从未去过那里，只能依靠商人的报告"),
          [
            t("The parchment was damaged in Paris", "羊皮纸在巴黎受损了"),
            t("Mali did not exist in 1375", "马里在1375年并不存在"),
            t("Mansa Musa refused to let mapmakers visit", "曼萨·穆萨不让地图绘制者来访"),
          ],
          t(
            "The fourth paragraph says Cresques had never been to Mali and drew it from the reports of merchants, which is why the details are vague.",
            "第四段说克雷斯克斯从未去过马里，是根据商人的报告画的，所以细节很模糊。",
          ),
        ),
      ],
      [
        "Abraham",
        "Cresques",
        "Majorca",
        "Spain",
        "Catalan",
        "Atlas",
        "Paris",
        "Europeans",
        "Atlantic",
        "China",
        "Mediterranean",
        "Mali",
        "Sahara",
        "Mansa",
        "Musa",
        "Europe",
        "Africa",
        "African",
      ],
    ),
    passage(
      "the-city-of-scholars",
      t("The City of Scholars", "学者之城"),
      `Timbuktu sits at the edge of the Sahara, near a great bend in the Niger River. For camel caravans crossing the desert and boats traveling along the river, it was a natural meeting point. By the 1400s and 1500s, it had become one of the most important centers of learning in Africa.

Scholars came to Timbuktu from across West and North Africa. They taught in mosques and in their own homes, where students sat around them to study. A student might spend years learning the Quran, then move on to law, grammar, mathematics, astronomy and medicine. The most famous teachers attracted students from hundreds of kilometers away.

Learning needed books, and books in Timbuktu were precious. Some were brought by caravan from cities such as Cairo and Fez. Others were copied by hand in Timbuktu itself, by scribes who were paid to write out a text letter by letter. A traveler who visited the city in the early 1500s, known in Europe as Leo Africanus, wrote that more profit was made from the sale of books than from any other kind of goods.

Families of scholars built up private libraries, adding to them over many generations. Their manuscripts covered every subject, from the movement of the stars to the treatment of illness and the settling of disputes between neighbors. Many were written in Arabic, but some were written in local African languages using Arabic letters.

These collections changed how historians see Africa. Some writers in Europe once claimed that Africa south of the Sahara had no written history. The manuscripts of Timbuktu show that this was simply wrong.`,
      [scholarWords, empireWords, greek3],
      [
        ask(
          t("Why was Timbuktu a natural meeting point?", "为什么廷巴克图是天然的交汇点？"),
          t("It lay where desert caravans and river boats could meet", "它位于沙漠商队和河船能够会合的地方"),
          [
            t("It was the capital of the empire of Ghana", "它是加纳帝国的首都"),
            t("It had the largest gold mines in Africa", "它有非洲最大的金矿"),
            t("It was built on the coast of the Mediterranean", "它建在地中海沿岸"),
          ],
          t(
            "The first paragraph says it sits at the edge of the Sahara near a bend in the Niger River, so it was a natural meeting point for caravans and boats.",
            "第一段说它位于撒哈拉边缘、尼日尔河的大拐弯附近，所以是商队和船只天然的交汇点。",
          ),
        ),
        ask(
          t("What does Leo Africanus's report show about books in Timbuktu?", "利奥·阿非利加努斯的报告说明了廷巴克图的书籍什么情况？"),
          t("They were valuable enough to be the most profitable goods", "它们价值高到成为最赚钱的商品"),
          [
            t("They were all written in local African languages", "它们都是用当地非洲语言写的"),
            t("They were given away for free", "它们被免费赠送"),
            t("They were printed on presses", "它们是用印刷机印的"),
          ],
          t(
            "The third paragraph quotes his report that more profit was made from the sale of books than from any other goods.",
            "第三段引用了他的报告：卖书比卖任何其他商品赚的钱都多。",
          ),
        ),
        ask(
          t("What claim do the manuscripts of Timbuktu disprove?", "廷巴克图的手稿推翻了什么说法？"),
          t("That Africa south of the Sahara had no written history", "撒哈拉以南的非洲没有书面历史"),
          [
            t("That scholars studied astronomy", "学者研究天文学"),
            t("That books were copied by hand", "书是手抄的"),
            t("That caravans crossed the Sahara", "商队穿越撒哈拉"),
          ],
          t(
            "The last paragraph says some writers in Europe once claimed Africa south of the Sahara had no written history, and the manuscripts show that this was simply wrong.",
            "最后一段说欧洲一些作者曾声称撒哈拉以南的非洲没有书面历史，而这些手稿表明这种说法完全错误。",
          ),
        ),
      ],
      [
        "Timbuktu",
        "Sahara",
        "Niger",
        "Quran",
        "Cairo",
        "Fez",
        "Leo",
        "Africanus",
        "Africanus's",
        "Arabic",
        "Europe",
        "Africa",
        "African",
        "West",
        "North",
      ],
    ),
    passage(
      "the-empire-of-songhai",
      t("The Empire of Songhai", "桑海帝国"),
      `After the death of Mansa Musa, the empire of Mali slowly weakened. Its rulers quarreled, and distant provinces broke away. One of them, centered on the city of Gao on the Niger River, grew into the largest empire West Africa had ever seen: Songhai.

Songhai's rise began with a ruler named Sunni Ali, who came to power around 1464. He was a brilliant general. His cavalry swept across the grasslands, and his fleet of war canoes controlled the Niger River. In 1468, he captured Timbuktu. Many of the city's scholars disliked him, and the writers of Timbuktu later described him as harsh and cruel. Because most of what we know about him comes from those writers, historians must read their accounts with care.

The next great ruler, Askia Muhammad, took power in 1493. Where Sunni Ali had conquered, Askia Muhammad organized. He divided the empire into provinces, each with its own governor, and he created a professional army. He set standard weights and measures for the markets, so that traders everywhere could trust the amount they were buying. He also supported the scholars of Timbuktu, and the city's schools reached the height of their fame.

Songhai's end came suddenly. In 1591, an army from Morocco crossed the Sahara, hoping to seize the gold mines. Though it was much smaller than the Songhai army, it carried guns. At the battle of Tondibi, the Songhai cavalry could not stand against the gunfire, and the empire collapsed.

The trade routes shifted, too. European ships had begun sailing along the coast of West Africa, and gold could now travel by sea. The great age of the Saharan empires was over.`,
      [empireWords, interact, tradeWords],
      [
        ask(
          t("Why must historians read the accounts of Sunni Ali with care?", "为什么历史学家必须谨慎对待关于逊尼·阿里的记载？"),
          t("They were written by scholars who disliked him", "它们是由不喜欢他的学者写的"),
          [
            t("They were written centuries before he lived", "它们是在他出生前几百年写的"),
            t("They were written in a language no one can read", "它们是用无人能读懂的语言写的"),
            t("They were drawn on a map in Majorca", "它们画在马略卡的一张地图上"),
          ],
          t(
            "The second paragraph says many scholars disliked him, and most of what we know comes from those writers, so their accounts may be one-sided.",
            "第二段说许多学者不喜欢他，而我们所知道的大多来自这些作者，所以他们的记载可能有失偏颇。",
          ),
        ),
        ask(
          t("How did Askia Muhammad differ from Sunni Ali?", "阿斯基亚·穆罕默德与逊尼·阿里有什么不同？"),
          t("He organized the empire rather than conquering new lands", "他致力于治理帝国，而不是征服新的土地"),
          [
            t("He captured Timbuktu with war canoes", "他用战船攻占了廷巴克图"),
            t("He refused to support the scholars", "他拒绝支持学者"),
            t("He brought guns from Morocco", "他从摩洛哥带来了枪支"),
          ],
          t(
            "The third paragraph says where Sunni Ali had conquered, Askia Muhammad organized: provinces, governors, a professional army and standard weights and measures.",
            "第三段说逊尼·阿里征服，阿斯基亚·穆罕默德治理：设立省份和总督，建立职业军队，统一度量衡。",
          ),
        ),
        ask(
          t(
            "Which two causes does the passage give for the end of the great age of the Saharan empires?",
            "文章给出了撒哈拉帝国伟大时代结束的哪两个原因？",
          ),
          t("The Moroccan army's guns and the shift of trade to sea routes", "摩洛哥军队的枪炮和贸易转向海路"),
          [
            t("Mansa Musa's pilgrimage and the price of gold", "曼萨·穆萨的朝圣和金价"),
            t("A drought and the loss of the salt mines", "一场旱灾和盐矿的丧失"),
            t("The death of Askia Muhammad and the fall of Gao", "阿斯基亚·穆罕默德之死和加奥的陷落"),
          ],
          t(
            "The fourth paragraph describes the Moroccan army with guns defeating Songhai at Tondibi, and the last paragraph says trade routes shifted as European ships carried gold by sea.",
            "第四段描述了拥有枪支的摩洛哥军队在通迪比打败桑海，最后一段说随着欧洲船只走海路运送黄金，贸易路线发生了转移。",
          ),
        ),
      ],
      [
        "Songhai",
        "Songhai's",
        "Gao",
        "Niger",
        "Sunni",
        "Ali",
        "Askia",
        "Muhammad",
        "Timbuktu",
        "Morocco",
        "Moroccan",
        "Tondibi",
        "Mansa",
        "Musa",
        "Mali",
        "Sahara",
        "Saharan",
        "European",
        "West",
        "Africa",
      ],
    ),
    passage(
      "saving-the-manuscripts",
      t("Saving the Manuscripts", "拯救手稿"),
      `In 2012, armed groups took control of Timbuktu. They destroyed ancient tombs that the people of the city honored, and many residents feared that the city's manuscripts would be next.

For centuries, families in Timbuktu had protected their collections. During times of danger, they had hidden manuscripts in clay jars, buried them in the sand or carried them into the desert. In the decades before 2012, many of the collections had been brought together in libraries, where experts worked to repair, record and photograph them. Now those libraries were in danger.

A librarian named Abdel Kader Haidara, whose family had kept manuscripts for generations, decided to act. With a small team of helpers, he began to move the manuscripts out of the city in secret. They packed them into metal trunks, a few hundred pages at a time, and loaded them onto donkey carts, cars and boats. Couriers carried them hundreds of kilometers south to the city of Bamako. If they were stopped, they explained that the trunks held old family papers.

The work went on for months. Over time, the team moved hundreds of thousands of manuscripts out of Timbuktu.

In early 2013, as the armed groups were driven out, some fighters set fire to a library. Several thousand manuscripts were burned. It was a terrible loss, but most of the city's treasures had already escaped.

Today, scholars are making digital copies of the rescued manuscripts so that people anywhere can read them. The story of their rescue shows that a library is more than a building. It is also the people who are willing to protect it.`,
      [scholarWords, interact],
      [
        ask(
          t(
            "How had families in Timbuktu protected manuscripts in earlier times of danger?",
            "廷巴克图的家庭在以前的危险时期是怎样保护手稿的？",
          ),
          t("By hiding them in clay jars, in the sand or in the desert", "把它们藏在陶罐里、埋在沙中或带进沙漠"),
          [
            t("By selling them to libraries in Europe", "把它们卖给欧洲的图书馆"),
            t("By making digital copies", "制作数字副本"),
            t("By sending them to Bamako by boat", "用船把它们送到巴马科"),
          ],
          t(
            "The second paragraph says that during times of danger, families hid manuscripts in clay jars, buried them in the sand or carried them into the desert.",
            "第二段说在危险时期，各个家庭把手稿藏在陶罐里、埋在沙里或带进沙漠。",
          ),
        ),
        ask(
          t("What did the couriers say if they were stopped?", "信使如果被拦下会怎么说？"),
          t("That the trunks held old family papers", "箱子里装的是旧家庭文件"),
          [
            t("That they were carrying food to Bamako", "他们在给巴马科运送食物"),
            t("That the manuscripts had already burned", "手稿已经被烧毁了"),
            t("That they worked for the armed groups", "他们为武装团体工作"),
          ],
          t(
            "The third paragraph says that if they were stopped, they explained that the trunks held old family papers.",
            "第三段说如果被拦下，他们就解释说箱子里装的是旧家庭文件。",
          ),
        ),
        ask(
          t("What is the central idea of the last paragraph?", "最后一段的中心思想是什么？"),
          t("A library depends on the people willing to protect it", "图书馆依靠愿意保护它的人"),
          [
            t("Digital copies are better than the originals", "数字副本比原件更好"),
            t("Libraries should be built far from cities", "图书馆应该建在远离城市的地方"),
            t("Manuscripts are safest in clay jars", "手稿放在陶罐里最安全"),
          ],
          t(
            "The last sentences say the rescue shows that a library is more than a building; it is also the people who are willing to protect it.",
            "最后几句说这次救援表明图书馆不只是一座建筑，它也是那些愿意保护它的人。",
          ),
        ),
      ],
      ["Timbuktu", "Abdel", "Kader", "Haidara", "Bamako", "Europe"],
    ),
  ],
};
