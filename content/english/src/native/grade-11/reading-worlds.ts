// Grade 11: the reading unit of the seventh theme, between two worlds, from a ship that carried a generation to
// Britain and a border drawn in five weeks to villages built by emigrants' money, children of many countries,
// a sailor who wrote in his third language, guest workers in the fields and a language lost in three generations.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const migration = { topic: "words-of-migration-and-identity", weight: 0.3 } as const;
const home = { topic: "words-of-home-and-exile", weight: 0.3 } as const;
const indirect = { topic: "free-indirect-discourse", weight: 0.2 } as const;
const academic6 = { topic: "academic-words-6", weight: 0.1 } as const;
const academic7 = { topic: "academic-words-7", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** betweenTwoWorlds is a reading unit of grade 11 on migration and identity, home and exile, and the lives of people who belong to more than one place. */
export const betweenTwoWorlds: ReadingUnitDef = {
  id: "between-two-worlds",
  title: t("Between Two Worlds", "两个世界之间"),
  passages: [
    passage(
      "the-ship-that-came-in-1948",
      t("The Ship That Came in 1948", "1948 年驶来的船"),
      `On the twenty-second of June, 1948, a ship called the Empire Windrush docked at Tilbury, near London. On board were about a thousand passengers, among them hundreds of people from Jamaica, Trinidad and other islands of the Caribbean. Many had served in the British forces during the Second World War. Britain was short of workers after the war, and as citizens of the British Empire, the passengers had the right to live and work there.

They came with high hopes. Many had been taught in school to think of Britain as the mother country, the center of the world they belonged to. Some wore their best suits and hats as they came down the gangway, ready to begin a new life. A few had already found jobs; most had not.

The reality was harder than they expected. The weather was cold and grey, and the food was unfamiliar. Housing was scarce after the bombing of the war, and many landlords put up signs in their windows refusing to rent to Black people. Workers who had been teachers or clerks at home found that only the hardest and lowest-paid jobs were open to them. Some were insulted in the street. They had thought of themselves as British; many of their neighbors did not.

Yet they stayed, and more followed. Over the next twenty-five years, hundreds of thousands of people came from the Caribbean to Britain. They drove buses, nursed patients in the new national health service, worked in factories and built communities in neighborhoods such as Brixton in south London. They started churches, newspapers and, in 1966, a carnival in the streets of Notting Hill that grew into one of the largest street festivals in Europe.

Their children grew up between two worlds. At home, they heard the stories, songs and accents of the islands. At school, they were British. Many said they felt fully at home in neither place.

In 2018, the story took a painful turn. It emerged that some of the Windrush generation, who had lived in Britain legally for decades, had been wrongly told they were in the country illegally because they lacked documents the government itself had never given them. Some lost their jobs or homes, and a few were deported. The scandal led to public apologies and a compensation scheme.

Today, the twenty-second of June is celebrated in Britain as Windrush Day, a recognition that the people who came down the gangway in 1948 helped to rebuild the country and to change what it means to be British.`,
      [migration, home, academic6],
      [
        ask(
          t("Why did many Caribbean people think of Britain as the mother country?", "为什么许多加勒比人把英国视为“祖国”？"),
          t("They had been taught in school that Britain was the center of their world", "他们在学校里被教导英国是他们世界的中心"),
          [
            t("They had all been born in Britain and moved away", "他们都出生在英国后来又搬走了"),
            t("Their parents had told them it was always warm there", "他们的父母告诉他们那里总是很暖和"),
            t("They had visited Britain many times before 1948", "他们在 1948 年前去过英国很多次"),
          ],
          t(
            "The second paragraph says many had been taught in school to think of Britain as the mother country, the center of the world they belonged to.",
            "第二段说许多人在学校里被教导把英国视为祖国，是他们所属世界的中心。",
          ),
        ),
        ask(
          t("What difficulties did the newcomers face?", "新来的人遇到了哪些困难？"),
          t("Landlords refused to rent to them and only hard, low-paid jobs were open", "房东拒绝租房给他们，他们只能做艰苦的低薪工作"),
          [
            t("They were not allowed to enter the country at all", "他们根本不被允许入境"),
            t("They could not find any churches or newspapers", "他们找不到任何教堂或报纸"),
            t("They had to pay for the ship that brought them", "他们必须为载他们来的船付钱"),
          ],
          t(
            "The third paragraph says landlords put up signs refusing to rent to Black people and only the hardest, lowest-paid jobs were open to them.",
            "第三段说房东贴出拒绝租房给黑人的告示，他们只能做最艰苦、薪水最低的工作。",
          ),
        ),
        ask(
          t("What was the scandal of 2018?", "2018 年的丑闻是什么？"),
          t(
            "Legal residents were wrongly treated as illegal because they lacked papers never given to them",
            "合法居民因缺少政府从未发给他们的证件，被错误地当作非法居民",
          ),
          [
            t("The ship Empire Windrush was found to have been stolen", "人们发现“帝国疾风号”是被盗的船"),
            t("The carnival in Notting Hill was banned by the government", "诺丁山狂欢节被政府禁止"),
            t("Caribbean nurses were found to have no training", "人们发现加勒比护士没有受过培训"),
          ],
          t(
            "The sixth paragraph says some who had lived legally for decades were wrongly told they were illegal because they lacked documents the government had never given them.",
            "第六段说一些合法居住了几十年的人，因缺少政府从未发放的证件，被错误地告知他们是非法居留。",
          ),
        ),
      ],
      [
        "Empire",
        "Windrush",
        "Tilbury",
        "London",
        "Britain",
        "British",
        "Caribbean",
        "Jamaica",
        "Jamaican",
        "Trinidad",
        "Brixton",
        "Sam",
        "King",
      ],
    ),
    passage(
      "a-line-on-a-map",
      t("A Line on a Map", "地图上的一条线"),
      `In the summer of 1947, a British lawyer named Cyril Radcliffe was given a task that seems almost impossible. Britain was about to end its rule over India, and the country was to be divided into two independent nations: India, with a Hindu majority, and Pakistan, with a Muslim majority. Radcliffe was asked to draw the borders between them through the provinces of Punjab and Bengal, where Hindus, Muslims and Sikhs had lived side by side for centuries.

He had never been to India before. He was given about five weeks, old maps and census figures that were sometimes out of date. He worked in a hot room in Delhi, surrounded by advisers who argued over every village. He later said that he was so troubled by the work that he burned his papers and refused his fee.

The borders were announced on the seventeenth of August, two days after independence. Millions of people woke up to find that they were on the wrong side of a line they had never seen. A Sikh farmer in western Punjab now lived in Pakistan; a Muslim weaver in the east now lived in India. Fearing violence, people began to move. They left in carts, on foot and in crowded trains, carrying what they could.

What followed was one of the largest migrations in human history. Somewhere between ten and twenty million people crossed the new borders. As they did, violence broke out between communities that had once been neighbors. Trains arrived at stations full of the dead. Estimates of the number killed range from several hundred thousand to two million. Many women were abducted.

For those who survived, the loss of home was permanent. Families who had lived in the same house for generations never saw it again. Old people in Lahore remembered streets in Amritsar, and old people in Amritsar remembered streets in Lahore, cities only about fifty kilometers apart that had become foreign to each other. Some kept the keys to houses they would never return to.

For decades, many survivors did not speak of what they had seen. Only in recent years have historians and volunteers begun to record their memories before they are lost. Their stories describe not only violence but also kindness: neighbors who hid families of the other religion, strangers who shared water on the road.

The line Radcliffe drew still divides the two countries. It reminds us that a border, drawn quickly on paper, can decide where millions of people belong.`,
      [home, migration, academic7, academic1],
      [
        ask(
          t("Why was Radcliffe's task so difficult?", "为什么拉德克利夫的任务如此困难？"),
          t("He had never been to India and had five weeks and outdated information", "他从没去过印度，只有五周时间和过时的资料"),
          [
            t("He was not allowed to speak to any advisers", "他不被允许与任何顾问交谈"),
            t("He had to build the new border walls himself", "他必须亲自修建新的边境墙"),
            t("He did not know how to read a map", "他不会看地图"),
          ],
          t(
            "The second paragraph says he had never been to India and was given about five weeks, old maps and census figures that were sometimes out of date.",
            "第二段说他从没到过印度，只有大约五周时间，用的是旧地图和有时过时的人口普查数据。",
          ),
        ),
        ask(
          t("What happened after the borders were announced?", "边界宣布后发生了什么？"),
          t("Millions moved across them, and violence broke out between communities", "数百万人跨越边界迁徙，各社区之间爆发了暴力冲突"),
          [
            t("Everyone stayed where they were and nothing changed", "所有人都留在原地，什么都没变"),
            t("The borders were quickly erased by both countries", "两国很快就取消了边界"),
            t("People moved only in the cities, not in the countryside", "人们只在城市里迁移，农村没有"),
          ],
          t(
            "The third and fourth paragraphs say people began to move, between ten and twenty million crossed, and violence broke out between communities.",
            "第三、四段说人们开始迁移，一千万到两千万人跨越边界，各社区之间爆发了暴力冲突。",
          ),
        ),
        ask(
          t("What do the recorded stories show besides violence?", "除了暴力，那些记录下来的故事还展现了什么？"),
          t("Kindness, such as neighbors who hid families of another religion", "善意，例如邻居藏匿其他宗教的家庭"),
          [
            t("That the violence had never really happened", "暴力其实从未发生过"),
            t("That everyone was happy to leave their homes", "每个人都乐意离开自己的家"),
            t("That Radcliffe had visited many of the villages", "拉德克利夫曾去过许多村庄"),
          ],
          t(
            "The sixth paragraph says the stories describe kindness too: neighbors who hid families of the other religion and strangers who shared water.",
            "第六段说这些故事也记录了善意：邻居藏匿其他宗教的家庭，陌生人在路上分享水。",
          ),
        ),
      ],
      [
        "Cyril",
        "Radcliffe",
        "India",
        "Indian",
        "Pakistan",
        "Punjab",
        "Bengal",
        "Lahore",
        "Amritsar",
        "British",
        "Hindu",
        "Hindus",
        "Muslim",
        "Muslims",
        "Sikh",
        "Sikhs",
      ],
    ),
    passage(
      "villages-built-by-letters",
      t("Villages Built by Letters", "侨信建起的村庄"),
      `In the nineteenth and early twentieth centuries, millions of people left the coastal provinces of southern China, especially Guangdong and Fujian, to find work abroad. They went to Southeast Asia, to North and South America, to Australia and to Africa. Most were young men who planned to work for a few years, send money home and return. The villages they came from became known as qiaoxiang, the home villages of overseas Chinese.

The link between those who left and those who stayed was the letter. Emigrants sent letters home, usually with money enclosed, through special shops and couriers who knew every village. These letters, called qiaopi, often contained only a few lines: news of health, a request to look after the parents, instructions on how the money should be spent. For families at home, the arrival of a letter could mean the difference between hunger and plenty.

The money changed the villages. In the county of Kaiping in Guangdong, families who had received money from abroad built tall towers of concrete and stone called diaolou. The towers protected them from bandits and floods, but they were also statements of success. Many mixed Chinese styles with designs their owners had seen abroad: Roman arches, Gothic windows, domes and balconies. Today about eighteen hundred towers still stand, and in 2007 they were listed by UNESCO as a World Heritage Site.

Emigrants also paid for schools, roads, libraries and hospitals in their home villages. Some returned rich and respected. Many others never returned at all. They married abroad, raised children who spoke other languages, or died far from home. Some villages were filled with houses built for owners who never came back to live in them.

For the families left behind, emigration brought both gain and loss. Wives might wait decades for husbands who sent money but rarely visited. Children grew up knowing their fathers only through letters and photographs.

Today, many descendants of those emigrants live around the world. Some travel to the qiaoxiang to find the houses their ancestors built and the graves of relatives they never knew. Archives in China have collected tens of thousands of qiaopi letters, and in 2013 they were added to a UNESCO register of documentary heritage. The letters, simple as many of them are, tell a story of separation and loyalty that stretches across oceans and generations.`,
      [migration, home, academic6],
      [
        ask(
          t("What usually came with the letters emigrants sent home?", "移民寄回家的信通常附带什么？"),
          t("Money for their families", "给家人的钱"),
          [
            t("Photographs of famous buildings abroad", "国外著名建筑的照片"),
            t("Seeds for planting new crops", "种植新作物的种子"),
            t("Tickets for the family to come abroad", "让家人出国的船票"),
          ],
          t(
            "The second paragraph says emigrants sent letters home, usually with money enclosed.",
            "第二段说移民寄信回家，通常信中附有钱。",
          ),
        ),
        ask(
          t("Why did the towers of Kaiping often mix styles?", "开平碉楼为什么常常融合多种风格？"),
          t("Their owners added designs they had seen abroad to Chinese styles", "楼主把在国外见过的设计融入了中国风格"),
          [
            t("Foreign architects were forced to build them", "外国建筑师被迫建造了它们"),
            t("The towers were built to attract foreign tourists", "这些碉楼是为了吸引外国游客而建"),
            t("The builders could not decide on one style", "建造者无法确定一种风格"),
          ],
          t(
            "The third paragraph says many mixed Chinese styles with designs their owners had seen abroad, such as Roman arches and Gothic windows.",
            "第三段说许多碉楼把中国风格和楼主在国外见过的设计结合起来，例如罗马拱门和哥特式窗户。",
          ),
        ),
        ask(
          t("What loss did emigration bring to families left behind?", "移民给留守的家庭带来了什么损失？"),
          t("Long separations, with children knowing fathers only through letters", "长期分离，孩子只能通过书信认识父亲"),
          [
            t("They lost all the money that had been sent", "他们失去了寄来的所有钱"),
            t("Their villages were all destroyed by floods", "他们的村庄都被洪水摧毁了"),
            t("They were forbidden to receive any letters", "他们被禁止接收任何信件"),
          ],
          t(
            "The fifth paragraph says wives might wait decades and children grew up knowing their fathers only through letters and photographs.",
            "第五段说妻子可能要等几十年，孩子成长时只能通过书信和照片认识父亲。",
          ),
        ),
      ],
      ["Guangdong", "Fujian", "Kaiping", "Taishan", "Southeast", "Asia", "America", "Chinese", "UNESCO", "qiaoxiang", "diaolou"],
    ),
    passage(
      "children-of-many-countries",
      t("Children of Many Countries", "多国长大的孩子"),
      `In the 1950s, an American sociologist named Ruth Hill Useem travelled to India with her husband to study Americans living and working there. She noticed something about their children. These children had spent much of their lives outside their parents' home country. They did not fully belong to the culture of India, where they lived, nor to the culture of America, which their passports named. Instead, they seemed to share a third culture with other children like them: children of diplomats, soldiers, missionaries and business people who moved from country to country.

Useem called them third-culture kids. The term has since been used for millions of young people around the world who grow up in countries other than their parents'.

Researchers have found that such children often share certain traits. Many are good at adapting to new places, learning languages and understanding different points of view. They may feel at ease among people from many backgrounds. But many also find one question surprisingly hard: where are you from? For a girl born in Singapore to parents from Brazil and Germany, raised in Lagos and now at school in Toronto, there may be no simple answer.

Consider a student we might call Mei Lin. Her family has moved four times. In each new school, she has learned the rules quickly: how to greet a teacher, which jokes are safe, what to bring for lunch. Now, at sixteen, she stands at the edge of another playground. She knows the routine. Smile, ask questions, don't talk too much about the last place. People here would think it was showing off. She is good at this. She has always been good at this. So why does it feel, this time, like acting?

Feelings like Mei Lin's are common. Third-culture kids often describe a sense of grief that others do not see: the loss of friends, places and routines each time they move. Because the move is usually a choice made by their parents for good reasons, such as a new job, children may feel they have no right to be sad.

When they return to their parents' home country, many experience what is called reverse culture shock. They are expected to fit in, because they look and sound like everyone else, but they have missed years of shared experiences, songs and jokes. They feel like foreigners in the place that is supposed to be home.

Many adult third-culture kids say they found their sense of belonging not in a place but in people, especially others who had lived the same way. For them, home is less a point on a map than a set of relationships carried from country to country.`,
      [migration, home, indirect, academic7],
      [
        ask(
          t("What did Useem mean by a third culture?", "尤西姆所说的“第三文化”是什么意思？"),
          t("A culture shared by children who grew up outside their parents' country", "在父母祖国之外长大的孩子们所共有的文化"),
          [
            t("The culture of a country with three official languages", "一个有三种官方语言的国家的文化"),
            t("The culture of India mixed with the culture of America", "印度文化与美国文化的混合"),
            t("A culture taught in special schools for diplomats", "专门为外交官开设的学校所教授的文化"),
          ],
          t(
            "The first paragraph says these children did not fully belong to either culture but shared a third culture with other children like them.",
            "第一段说这些孩子既不完全属于这种文化，也不完全属于那种文化，而是与其他类似的孩子共享第三种文化。",
          ),
        ),
        ask(
          t(
            'In the paragraph about Mei Lin, whose thoughts are in the sentence "People here would think it was showing off"?',
            "在关于美琳的那一段中，“这里的人会觉得那是在炫耀”是谁的想法？",
          ),
          t("Mei Lin's, given in the narrator's words", "美琳的想法，用叙述者的话说出来"),
          [
            t("The narrator's own opinion about Mei Lin", "叙述者自己对美琳的看法"),
            t("The other students' spoken words to Mei Lin", "其他学生对美琳说的话"),
            t("Ruth Hill Useem's research findings", "露丝·希尔·尤西姆的研究发现"),
          ],
          t(
            "The paragraph moves into Mei Lin's mind: the short commands and the question that ends it are her thoughts, told in the third person without quotation marks.",
            "这一段进入了美琳的内心：那些简短的指令和结尾的问题都是她的想法，用第三人称讲述，没有引号。",
          ),
        ),
        ask(
          t("What is reverse culture shock?", "什么是“逆向文化冲击”？"),
          t("Feeling like a foreigner on returning to one's parents' home country", "回到父母的祖国时觉得自己像个外国人"),
          [
            t("Feeling shocked by a new country on arriving for the first time", "第一次到达一个新国家时感到震惊"),
            t("Being unable to learn any new language", "无法学会任何新语言"),
            t("Refusing to leave the country where one grew up", "拒绝离开自己长大的国家"),
          ],
          t(
            "The sixth paragraph says that on returning to their parents' country, many feel like foreigners in the place that is supposed to be home.",
            "第六段说回到父母的祖国时，许多人在本该是家的地方感到自己像外国人。",
          ),
        ),
      ],
      [
        "Ruth",
        "Hill",
        "Useem",
        "Useem's",
        "India",
        "American",
        "Americans",
        "Mei",
        "Lin",
        "Singapore",
        "Germany",
        "Brazil",
        "Toronto",
        "Lagos",
      ],
    ),
    passage(
      "the-sailor-who-wrote-in-english",
      t("The Sailor Who Wrote in English", "用英语写作的水手"),
      `Joseph Conrad is remembered as one of the great novelists of the English language. Yet English was not his first language, nor even his second. He was born in 1857 as Jozef Teodor Konrad Korzeniowski, to Polish parents in a part of Ukraine that was then ruled by the Russian Empire. Poland did not exist as an independent country; it had been divided among its neighbors.

His father was a poet and a patriot who worked for Polish independence. When Conrad was four, his father was arrested by the Russian authorities and sent into exile in the cold north of Russia, and the family went with him. His mother died there when he was seven, and his father died a few years later. An orphan at eleven, the boy was raised by an uncle.

From an early age, Conrad dreamed of the sea. At sixteen, he left for Marseille in France and went to work on French ships. He spoke French well, it was the second language he learned. At twenty, he joined a British ship, although he knew only a few words of English. He learned the language from sailors, newspapers and books, and over the next sixteen years he rose to become a captain in the British merchant navy. He sailed to Asia, Australia and Africa. In 1890, he travelled up the Congo River, and what he saw of the cruelty of European rule there later became the basis of his novel Heart of Darkness.

In his thirties, he left the sea and began to write. He chose English, the language he had learned last. Writing was slow and painful for him; he sometimes spent a whole day on a single sentence. He spoke English with a strong accent all his life. Yet his novels, full of the sea, of exile and of people torn between loyalties, are written in a prose of remarkable richness.

Conrad never fully felt at home anywhere. He became a British citizen and settled in Kent, in the south of England, but he remained, as he said, a Pole at heart. Many of his characters are outsiders: men far from home, unsure where they belong, tested by situations that reveal who they really are.

Some readers have wondered why he did not write in Polish or French. Conrad once said that he had not so much chosen English as been adopted by it. For a man who had lost his country, his parents and his home, a language may have been the one place he could make his own.`,
      [home, migration, academic6],
      [
        ask(
          t("Why did Conrad's family go into exile when he was a child?", "康拉德小时候，他的家人为什么流亡？"),
          t("His father was arrested for working for Polish independence", "他父亲因争取波兰独立而被捕"),
          [
            t("His father wanted to find work as a sailor in the north", "他父亲想到北方去当水手"),
            t("The family had lost all their money in Ukraine", "他们一家在乌克兰失去了所有的钱"),
            t("His mother wanted to live in a colder country", "他母亲想住在更冷的国家"),
          ],
          t(
            "The second paragraph says his father, a patriot who worked for Polish independence, was arrested and sent into exile, and the family went with him.",
            "第二段说他父亲是为波兰独立奋斗的爱国者，被捕后被流放，全家随同前往。",
          ),
        ),
        ask(
          t("How did Conrad learn English?", "康拉德是怎么学会英语的？"),
          t("From sailors, newspapers and books after joining a British ship", "加入英国船只后，从水手、报纸和书本中学会"),
          [
            t("At a school in Poland when he was a small child", "小时候在波兰的一所学校里"),
            t("From his father, who was an English poet", "从他父亲那里，他父亲是一位英国诗人"),
            t("In Marseille, where everyone spoke English", "在马赛，那里人人都说英语"),
          ],
          t(
            "The third paragraph says he joined a British ship knowing only a few words and learned the language from sailors, newspapers and books.",
            "第三段说他加入英国船只时只会几个英语单词，是从水手、报纸和书本中学会的。",
          ),
        ),
        ask(
          t("What does Conrad's remark about being adopted by English suggest?", "康拉德说自己是被英语“收养”的，这暗示了什么？"),
          t("A language became a kind of home for a man who had lost his", "对一个失去家园的人来说，一种语言成了某种家"),
          [
            t("He disliked English and wished he had written in Polish", "他讨厌英语，希望自己用波兰语写作"),
            t("His English publishers had forced him to write in English", "他的英国出版商强迫他用英语写作"),
            t("He had been adopted by an English family as a child", "他小时候被一个英国家庭收养"),
          ],
          t(
            "The last paragraph says that for a man who had lost his country, parents and home, a language may have been the one place he could make his own.",
            "最后一段说对一个失去祖国、父母和家园的人来说，语言也许是他唯一能据为己有的地方。",
          ),
        ),
      ],
      [
        "Joseph",
        "Conrad",
        "Conrad's",
        "Jozef",
        "Teodor",
        "Konrad",
        "Korzeniowski",
        "Poland",
        "Polish",
        "Russian",
        "Russia",
        "Ukraine",
        "French",
        "Marseille",
        "Congo",
        "Heart",
        "Darkness",
        "Kent",
      ],
    ),
    passage(
      "the-workers-who-were-guests",
      t("The Workers Who Were Guests", "被称为客人的工人"),
      `In 1942, during the Second World War, the United States faced a shortage of farm workers. Millions of young men had joined the army, and crops were rotting in the fields. The American and Mexican governments signed an agreement: Mexican men would come to work temporarily on American farms, and then return home. The workers became known as braceros, from the Spanish word brazo, meaning arm, because they would work with their arms.

The program lasted far longer than the war. From 1942 to 1964, about four and a half million work contracts were signed. Men came from villages across Mexico, often travelling for days to recruitment centers where they waited in long lines. They had to pass medical examinations, and some described being sprayed with chemicals to kill insects before they crossed the border, an experience many found humiliating.

On paper, the agreement promised fair treatment: a minimum wage, decent housing, food at fair prices and protection from discrimination. In practice, these promises were often broken. Many braceros lived in crowded camps and worked long hours bent over in the fields picking cotton, lettuce and tomatoes. Part of their wages was supposed to be saved in a fund and paid to them on their return to Mexico. Many never received this money.

For some, the program offered a real opportunity. The wages, though low by American standards, were higher than they could earn at home. Men sent money to their families, built houses and paid for their children's schooling. Some came back year after year and eventually settled in the United States.

But the program also raised hard questions. The workers were welcome as long as their labor was needed, yet they were not expected to stay, to bring their families or to become part of the communities where they worked. They were, in a sense, guests who were never fully invited in. Critics argued that the program kept wages low for all farm workers and made it harder for them to organize for better conditions. When it ended in 1964, partly because of such criticism, the farmworker unions grew stronger.

Decades later, former braceros and their families organized to demand the savings that had been taken from their pay. In 2008, some received a settlement from the Mexican government. Many had died before it came.

The story of the braceros is repeated in many countries today, wherever temporary workers do essential jobs in a land that is not quite theirs.`,
      [migration, home, academic7],
      [
        ask(
          t("Why did the United States start the Bracero program?", "美国为什么启动“短期劳工计划”？"),
          t("It needed farm workers during the war because many men had joined the army", "战争期间许多男子参军，它需要农场工人"),
          [
            t("It wanted to teach Mexican farmers new methods", "它想教墨西哥农民新的方法"),
            t("Mexico had asked for help with its own harvests", "墨西哥请求帮忙收割自己的庄稼"),
            t("American farmers wanted to stop growing cotton", "美国农民想停止种植棉花"),
          ],
          t(
            "The first paragraph says the country faced a shortage of farm workers because millions of young men had joined the army.",
            "第一段说因为数百万年轻男子参军，国家缺少农场工人。",
          ),
        ),
        ask(
          t("What happened to the savings taken from the braceros' wages?", "从短期劳工工资中扣下的储蓄怎么样了？"),
          t("Many workers never received them, and a settlement came decades later", "许多工人从未拿到，几十年后才达成和解"),
          [
            t("They were paid back with interest on time", "它们按时连本带息还给了工人"),
            t("They were used to build schools in California", "它们被用来在加利福尼亚建学校"),
            t("The workers chose to give them to the farmers", "工人们选择把它们送给农场主"),
          ],
          t(
            "The third paragraph says many never received the money, and the sixth says some received a settlement in 2008, after many had died.",
            "第三段说许多人从未拿到这笔钱，第六段说一些人在 2008 年获得和解赔偿，而许多人在此之前已经去世。",
          ),
        ),
        ask(
          t(
            "What does the passage mean by calling the braceros guests who were never fully invited in?",
            "文章说短期劳工是“从未被真正请进门的客人”，这是什么意思？",
          ),
          t("Their labor was welcome, but they were not expected to stay or belong", "他们的劳动受欢迎，但人们并不希望他们留下或融入"),
          [
            t("They were treated as honored visitors everywhere they went", "他们无论到哪里都被当作尊贵的客人"),
            t("They were invited to live in the farmers' own homes", "他们被邀请住在农场主自己的家里"),
            t("They refused every invitation to visit American towns", "他们拒绝了参观美国城镇的每一次邀请"),
          ],
          t(
            "The fifth paragraph says they were welcome as long as their labor was needed but not expected to stay, bring families or become part of the communities.",
            "第五段说只要需要他们的劳动，他们就受欢迎，但人们并不希望他们留下、带来家人或融入社区。",
          ),
        ),
      ],
      ["Bracero", "Mexico", "Mexican", "Mexicans", "American", "Americans", "California", "Texas", "Arizona", "Spanish"],
    ),
    passage(
      "the-language-that-faded",
      t("The Language That Faded", "渐渐消失的语言"),
      `Linguists have noticed a pattern among immigrant families in countries where one language dominates. It is so common that it is sometimes called the three-generation rule. The first generation, the immigrants themselves, speak their native language at home and learn the new language with difficulty. Their children, the second generation, grow up speaking both, but usually prefer the language of school and friends. By the third generation, the grandchildren often speak only the dominant language. In three generations, a language that may have been spoken in the family for centuries can vanish.

Researchers such as Joshua Fishman studied why this happens. Children want to fit in, and the language of their classmates is the language of television, games and jokes. Parents who are busy working may not have time to teach. Sometimes parents themselves choose not to pass on their language, believing that their children will succeed faster if they speak only the language of the new country. In some times and places, children were punished at school for speaking their family language.

Imagine a family. Rosa came from a village where everyone spoke Spanish. Her son Daniel answers her in English, though he understands everything she says. Her granddaughter Ana is seven. When Rosa tells her the old stories, Ana listens politely and then asks, in English, what a word means. Rosa explains, and switches to English herself to make it easier. It was always easier. And the story is less funny now, somehow, without the words her own grandmother used.

What is lost when a family language disappears? Some researchers point to practical losses: bilingual people can communicate with more people and may find more jobs. Others point to deeper losses. Grandparents and grandchildren may be unable to talk about anything complex. Songs, sayings, prayers and family stories may not survive translation. Some young people later feel that they have lost a part of who they are.

The pattern is not inevitable. Families that keep the language alive often follow a few practices: speaking only the family language at home, sending children to weekend language schools, visiting the country of origin and making the language part of things children enjoy, such as music, films and cooking. Communities can help by offering classes and celebrating the language in public.

Some young adults, having lost their family language as children, now study it as a second language in college, trying to recover what was nearly lost. They often say the effort is worth it, for the moment when they can finally understand a grandparent's story in the words in which it was first told.`,
      [migration, home, indirect, academic6],
      [
        ask(
          t("What does the three-generation rule describe?", "“三代法则”描述的是什么？"),
          t("How a family language is often lost by the grandchildren of immigrants", "移民的孙辈常常会失去家族语言的过程"),
          [
            t("How immigrants learn the new language in three years", "移民如何在三年内学会新语言"),
            t("How three generations always live in one house", "三代人为什么总是住在一起"),
            t("How a country chooses three official languages", "一个国家如何选择三种官方语言"),
          ],
          t(
            "The first paragraph describes the first generation speaking the native language, the second both, and the third often only the dominant language.",
            "第一段描述了第一代说母语、第二代说两种语言、第三代往往只说主流语言的过程。",
          ),
        ),
        ask(
          t(
            'In the paragraph about Rosa, whose thought is "It was always easier"?',
            "在关于罗莎的那一段中，“一直都是这样更容易”是谁的想法？",
          ),
          t("Rosa's, given in the narrator's words without quotation marks", "罗莎的想法，用叙述者的话说出来，没有引号"),
          [
            t("Ana's, spoken aloud to her grandmother", "安娜的想法，她大声对祖母说的"),
            t("The researcher Joshua Fishman's", "研究者约书亚·菲什曼的想法"),
            t("Daniel's, said in English to his mother", "丹尼尔的想法，他用英语对母亲说的"),
          ],
          t(
            "The paragraph slips into Rosa's mind as she switches to English: the short sentence and the regret about the story are her feelings, told by the narrator.",
            "当罗莎改说英语时，这一段滑入了她的内心：那句短句和对故事的遗憾都是她的感受，由叙述者讲出。",
          ),
        ),
        ask(
          t("What practices help families keep their language alive?", "哪些做法有助于家庭保留他们的语言？"),
          t(
            "Speaking it at home, weekend schools, visits and enjoyable activities",
            "在家说这种语言、上周末学校、回乡探访、参与有趣的活动",
          ),
          [
            t("Speaking only the dominant language at home", "在家只说主流语言"),
            t("Forbidding children to watch films or listen to music", "禁止孩子看电影或听音乐"),
            t("Waiting until the children are grown before teaching them", "等孩子长大后再教他们"),
          ],
          t(
            "The fifth paragraph lists speaking only the family language at home, weekend language schools, visiting the country of origin and making the language part of music, films and cooking.",
            "第五段列出了在家只说家族语言、上周末语言学校、回原籍国探访，以及把语言融入音乐、电影和烹饪。",
          ),
        ),
      ],
      ["Fishman", "Joshua", "Rosa", "Ana", "Daniel", "Spanish", "English", "American", "Americans", "Korean", "Chinese"],
    ),
    passage(
      "a-second-home-in-two-languages",
      t("Two Languages, One Mind", "两种语言，一个头脑"),
      `For much of the twentieth century, many teachers and doctors believed that growing up with two languages was harmful. They worried that children would be confused, mix up their words and fall behind at school. Parents were sometimes advised to speak only the language of the country to their children, even if it was not their own.

Research since the 1960s has largely overturned this view. Studies have found that bilingual children reach the same milestones as other children. They may know fewer words in each language at first, but their total vocabulary across both languages is similar. Mixing words from two languages in one sentence, once seen as a sign of confusion, turns out to follow regular rules and is common among fluent bilingual adults.

Some researchers, among them the Canadian psychologist Ellen Bialystok, have suggested that bilingualism may even bring benefits. Because a bilingual person's two languages are always active, the brain must constantly choose one and set the other aside. This practice, they argue, may strengthen the ability to control attention and to switch between tasks. Some studies have found that bilingual older adults show signs of memory loss later than others.

These claims are debated. Other researchers have tried to repeat the studies and found smaller effects or none at all. Some argue that early studies compared groups that differed in other ways, such as wealth or education. The scientific question is still open, and careful researchers avoid exaggerating what is known.

What is less disputed is the experience of bilingual people themselves. Many say that each language carries its own world. A woman who speaks Mandarin with her parents and English at work may feel more formal in one and more playful in the other. Some bilingual people report that they feel like slightly different people in each language, or that certain memories come back only in the language in which they happened.

Code-switching, moving between languages or ways of speaking depending on the situation, is a skill that many bilingual people use every day. A teenager may speak Spanish with her grandmother, English with her friends and a mixture of both with her cousins. Far from being confused, she is reading each situation and choosing the right language for it.

Living in two languages can be tiring. It can also mean never being quite complete in either. But many bilingual people say they would not give up either language, because each lets them belong to a world the other cannot reach.`,
      [migration, home, academic7, academic2, academic1],
      [
        ask(
          t("What did many experts once believe about growing up with two languages?", "许多专家过去对双语成长有什么看法？"),
          t("That it would confuse children and make them fall behind", "它会让孩子困惑，导致他们落后"),
          [
            t("That it was the only way to learn to read", "这是学会阅读的唯一途径"),
            t("That it made children grow taller and stronger", "它让孩子长得更高更壮"),
            t("That it was required by law in many countries", "许多国家的法律都要求这样做"),
          ],
          t(
            "The first paragraph says many believed it was harmful and worried that children would be confused and fall behind at school.",
            "第一段说许多人认为它有害，担心孩子会困惑并在学校落后。",
          ),
        ),
        ask(
          t("How does the passage treat the claim that bilingualism improves attention?", "文章如何对待“双语能提高注意力”这一说法？"),
          t("As debated, since other studies found smaller effects or none", "认为它有争议，因为其他研究发现效果较小或没有效果"),
          [
            t("As proven beyond any doubt by every study", "认为每项研究都毫无疑问地证明了它"),
            t("As a foolish idea that no scientist has ever held", "认为这是一个没有科学家持有过的愚蠢想法"),
            t("As a claim made only by parents, not researchers", "认为这只是家长而不是研究者的说法"),
          ],
          t(
            "The fourth paragraph says the claims are debated, other researchers found smaller effects or none, and the question is still open.",
            "第四段说这些说法有争议，其他研究者发现效果较小或没有效果，这个问题仍然没有定论。",
          ),
        ),
        ask(
          t("What does the example of the teenager show about code-switching?", "那个青少年的例子说明了语码转换的什么特点？"),
          t("It is a skill of choosing the right language for each situation", "它是根据不同情况选择合适语言的技能"),
          [
            t("It is a sign that she has not learned either language well", "它说明她两种语言都没学好"),
            t("It happens only when she is tired or confused", "它只在她累了或困惑时发生"),
            t("It is something she does only with her grandmother", "它是她只在祖母面前做的事"),
          ],
          t(
            "The sixth paragraph says that, far from being confused, she reads each situation and chooses the right language for it.",
            "第六段说她并不困惑，而是在判断每种情境并为之选择合适的语言。",
          ),
        ),
      ],
      ["English", "Spanish", "Chinese", "Mandarin", "Ellen", "Bialystok", "Canadian", "Toronto"],
    ),
  ],
};
