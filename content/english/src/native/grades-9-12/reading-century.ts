// Grades 9 to 12: the reading unit of the sixth theme, a century of change, from the factories of the nineteenth
// century to the connected world of today.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const history = { topic: "words-of-modern-history", weight: 0.3 } as const;
const documents = { topic: "analyzing-historical-documents", weight: 0.2 } as const;

/** aCenturyOfChange is a reading unit of grades 9 to 12 on the great changes of the modern world. */
export const aCenturyOfChange: ReadingUnitDef = {
  id: "a-century-of-change",
  title: t("A Century of Change", "百年变迁"),
  passages: [
    passage(
      "the-mill-girls",
      t("The Mill Girls", "纺织厂的女工"),
      `In the 1830s, thousands of young women left farms across New England to work in the cotton mills of Lowell, Massachusetts. Most were between fifteen and twenty-five. For many, it was the first time they had earned their own money or lived away from their families.

The mills were among the wonders of the age of industrialization. Water from the river turned great wheels that powered thousands of machines. The young workers tended these machines from five in the morning until seven at night, six days a week. The rooms were hot and noisy, and the air was thick with cotton dust that made breathing difficult. A bell rang to wake them, a bell rang to call them to meals and a bell rang to send them back to work.

The owners presented the mills as a safe and respectable place for young women. Workers lived in boarding houses run by older women who enforced strict rules: no drinking, a curfew at ten and church on Sundays. Some workers wrote poems and essays and published them in a magazine of their own.

But conditions grew harder. When cotton prices fell, the owners cut wages and sped up the machines, asking each worker to tend more looms for less pay. In 1834 and again in 1836, hundreds of women walked out in protest. One wrote that they would not be made "slaves" to the mill owners. The strikes failed, but the women did not stop. In 1845, they formed one of the first labor organizations of working women in the United States and sent petitions to the state legislature demanding a ten-hour working day.

The legislature refused. Over the next decades, the original mill girls were gradually replaced by immigrants from Ireland and elsewhere, who were desperate for work and paid even less. Yet the women of Lowell had shown that factory workers could organize, speak in public and demand a voice in the conditions of their own lives.`,
      [clues, history],
      [
        ask(
          t("What does the repeated mention of the bell suggest about life in the mills?", "文中反复提到钟声，暗示了工厂生活的什么特点？"),
          t("The workers' whole day was strictly controlled", "工人的一整天都受到严格控制"),
          [
            t("The mills were near a church", "工厂靠近一座教堂"),
            t("The workers enjoyed music", "工人们喜欢音乐"),
            t("The workers had a great deal of free time", "工人们有大量空闲时间"),
          ],
          t(
            "A bell woke them, called them to meals and sent them back to work: every part of the day was set by the mill.",
            "钟声叫醒她们、叫她们吃饭、又催她们回去干活：一天的每个环节都由工厂安排。",
          ),
        ),
        ask(
          t("Why did the women walk out in 1834 and 1836?", "这些女工为什么在1834年和1836年罢工？"),
          t("The owners cut wages and made them tend more machines", "厂主削减工资，并让她们照看更多机器"),
          [
            t("They wanted to return to their farms", "她们想回到农场"),
            t("The boarding houses were closed", "宿舍被关闭了"),
            t("The mills ran out of cotton", "工厂的棉花用完了"),
          ],
          t(
            "The fourth paragraph says the owners cut wages and sped up the machines, asking each worker to tend more looms for less pay.",
            "第四段说，厂主削减工资、加快机器速度，让每个工人以更少的报酬照看更多织机。",
          ),
        ),
        ask(
          t(
            "What does the last paragraph say the women of Lowell achieved, even though their demands were refused?",
            "最后一段说，尽管要求被拒绝，洛厄尔的女工们取得了什么成就？",
          ),
          t("They showed that factory workers could organize and demand a voice", "她们证明了工厂工人可以组织起来并争取话语权"),
          [
            t("They won a ten-hour working day at once", "她们立即争取到了十小时工作制"),
            t("They became owners of the mills", "她们成了工厂的主人"),
            t("They stopped all immigration", "她们阻止了所有移民"),
          ],
          t(
            "The passage ends by saying they had shown that factory workers could organize, speak in public and demand a voice.",
            "文章最后说，她们证明了工厂工人能够组织起来、公开发言并争取话语权。",
          ),
        ),
      ],
      ["New", "England", "Lowell", "Massachusetts", "United", "States", "Ireland"],
    ),
    passage(
      "through-the-golden-door",
      t("Through the Golden Door", "穿过金色的大门"),
      `Between 1892 and 1954, about twelve million people passed through Ellis Island, a small island in the harbor of New York. It was the main gateway for immigration to the United States, and for many travelers it was the first piece of America they ever touched.

Most arrived after a crossing of one or two weeks. Wealthier passengers were examined on board, but those who had traveled in the crowded lower decks were taken by ferry to the island. There they climbed a long staircase to the great hall. They did not know it, but doctors were watching them climb, looking for anyone who breathed with difficulty or walked with a limp.

The inspections were quick. Doctors checked eyes, lungs and hearts. A person who seemed ill might have a letter written on their coat in chalk and be held for further tests. Officials asked questions: Where are you going? Do you have work? Do you have money? Who paid for your ticket? Most immigrants passed through in a few hours. About two percent were sent back, often because of illness, and for families the fear of being separated was terrible.

Immigrants came for many reasons. Some were escaping poverty and hunger; others fled persecution because of their religion or politics. Many had relatives already in America who had written letters describing jobs and opportunities. They brought languages, foods, customs and religions that changed the cities where they settled.

Not everyone welcomed them. Some Americans feared that newcomers would take their jobs or would not fit in. In the 1920s, new laws sharply limited immigration, especially from southern and eastern Europe and from Asia.

The poet Emma Lazarus had written in 1883 of a lamp lifted "beside the golden door," welcoming the poor and tired of the world. For millions, Ellis Island was that door, though passing through it was only the beginning of a long and difficult new life.`,
      [clues, history],
      [
        ask(
          t("Why were doctors watching immigrants climb the staircase?", "医生们为什么观察移民爬楼梯？"),
          t("To spot signs of illness or disability", "为了发现疾病或身体残障的迹象"),
          [
            t("To help them carry their bags", "为了帮他们拿行李"),
            t("To count how many had arrived", "为了清点到达的人数"),
            t("To choose who would get the best jobs", "为了挑选谁能得到最好的工作"),
          ],
          t(
            "The second paragraph says the doctors looked for anyone who breathed with difficulty or walked with a limp.",
            "第二段说，医生们在寻找呼吸困难或走路一瘸一拐的人。",
          ),
        ),
        ask(
          t("Which reason for coming to America does the passage NOT mention?", "文章没有提到以下哪个来美国的原因？"),
          t("To join the army", "为了参军"),
          [
            t("To escape poverty and hunger", "为了摆脱贫困和饥饿"),
            t("To flee persecution", "为了逃避迫害"),
            t("To join relatives who wrote about jobs", "为了投奔写信介绍工作的亲戚"),
          ],
          t(
            "The fourth paragraph names poverty, hunger, persecution and relatives' letters, but not joining an army.",
            "第四段提到了贫困、饥饿、迫害和亲戚的来信，但没有提到参军。",
          ),
        ),
        ask(
          t('What does the "golden door" stand for in the last paragraph?', "最后一段中的“金色的大门”象征什么？"),
          t("America's welcome to immigrants seeking a new life", "美国对寻求新生活的移民的欢迎"),
          [
            t("A real gold door on Ellis Island", "埃利斯岛上一扇真正的金门"),
            t("The wealth of the passengers", "乘客们的财富"),
            t("The laws of the 1920s", "20世纪20年代的法律"),
          ],
          t(
            "Lazarus's image of a lamp beside the golden door welcomes the poor and tired; for millions, Ellis Island was that welcome.",
            "拉撒路笔下金门旁的明灯欢迎贫穷和疲惫的人；对数百万人来说，埃利斯岛就是那份欢迎。",
          ),
        ),
      ],
      ["Ellis", "Island", "New", "York", "United", "States", "America", "Americans", "Europe", "Asia", "Emma", "Lazarus"],
    ),
    passage(
      "a-letter-from-the-front",
      t("A Letter from the Front", "前线来信"),
      `The following is an invented letter, written in the style of the letters that soldiers sent home during the First World War. Read it as a historian would read a primary source.

France, 3 November 1916

Dear Mother,

Thank you for the socks and the cake, which arrived only a little crushed. The men in my section shared it out to the last crumb, and Davies, who never says much, said it was the best thing he had eaten since August.

You ask what it is like here. I am not allowed to say where we are, and the officers read every letter, so I must be careful. We have been in the line for six days. It has rained for five of them. The trench is deep mud, and our boots are never dry. At night the guns are quiet sometimes, and then you can hear the rats, and once, very far away, a bird.

Please do not worry about me. We are well fed, and our spirits are good. I think the papers at home make it all sound worse than it is.

Tell little Annie that I have kept her drawing in my pocket, and that it has been through more than most soldiers. Tell Father I am sorry about our argument before I left. I think of it often.

Your loving son,

Tom

A historian reading this letter would notice several things. It is a primary source, written at the time by someone who was there. But it was also written for a particular audience, a worried mother, and under censorship, since officers read every letter. Tom may have hidden the worst. His claim that "our spirits are good" may be true, or may be meant to comfort her. Details such as the mud, the rats and the drawing are more reliable, because he had no reason to invent them. The letter tells us not only about the war, but about what a soldier chose to say about it.`,
      [clues, history, documents, { topic: "academic-words-1", weight: 0.1 }],
      [
        ask(
          t("Why must Tom be careful about what he writes?", "汤姆为什么必须小心自己写的内容？"),
          t("Officers read every letter, so his writing was censored", "军官会检查每一封信，他的信受到审查"),
          [
            t("His mother does not like long letters", "他母亲不喜欢长信"),
            t("He has very little paper", "他的纸很少"),
            t("He is not good at spelling", "他不擅长拼写"),
          ],
          t(
            "Tom writes that he is not allowed to say where they are and that the officers read every letter.",
            "汤姆写道，他不能说出他们在哪里，而且军官会看每一封信。",
          ),
        ),
        ask(
          t('Why might Tom claim that "our spirits are good"?', "汤姆为什么可能会说“我们士气很好”？"),
          t("He may want to comfort his worried mother", "他可能想安慰担心的母亲"),
          [
            t("He was ordered to praise the food", "他被命令称赞伙食"),
            t("He wants to return home at once", "他想立刻回家"),
            t("He is writing to a newspaper", "他在给报纸写信"),
          ],
          t(
            "The historian notes that the letter was written for a worried mother, so the claim may be meant to comfort her.",
            "历史学家指出，这封信是写给担心的母亲的，所以这句话可能是为了安慰她。",
          ),
        ),
        ask(
          t(
            "Why are details like the mud and the rats more reliable than Tom's reassurances?",
            "为什么泥泞和老鼠这样的细节比汤姆的安慰话更可靠？",
          ),
          t("He had no reason to invent them", "他没有理由编造这些细节"),
          [
            t("The officers added them to the letter", "这些是军官加进信里的"),
            t("They appear in every newspaper", "它们出现在每家报纸上"),
            t("They are written in capital letters", "它们是用大写字母写的"),
          ],
          t(
            "The last paragraph says such details are more reliable because he had no reason to invent them.",
            "最后一段说，这些细节更可靠，因为他没有理由编造它们。",
          ),
        ),
      ],
      ["France", "Davies", "Annie", "Tom"],
    ),
    passage(
      "the-crash",
      t("The Crash", "大崩盘"),
      `In the 1920s, the American economy seemed unstoppable. Factories produced cars, radios and refrigerators in enormous numbers, and many Americans believed that prosperity would continue forever. Millions bought shares in companies, hoping their value would keep rising. Many did not pay the full price but borrowed most of the money, expecting to repay it from their profits.

For a while, it worked. Share prices climbed year after year, far faster than the real growth of the companies behind them. But this meant that prices depended on confidence: people bought because they expected others to buy. When that confidence broke, the fall was sudden.

In late October 1929, prices on the New York Stock Exchange began to drop. On October 24, frightened investors sold nearly thirteen million shares. Five days later, on a day later called Black Tuesday, prices collapsed. Fortunes vanished in hours. People who had borrowed to buy shares could not repay their loans.

The crash itself was only the beginning. Banks that had lent money to investors, or had invested themselves, began to fail. Because savings were not insured, families who had kept their money in those banks lost it. Frightened people rushed to withdraw their savings from other banks, which caused even more to collapse.

With less money to spend, people bought fewer goods. Factories cut production and laid off workers, who then had even less to spend. The cycle repeated, deepening the depression year after year. By 1933, about one in four American workers had no job. Because the United States had lent money to many other countries and bought their goods, the crisis spread around the world.

Historians still debate the exact causes. Most agree that the crash revealed deep weaknesses: too much borrowing, unequal incomes, weak banks and governments that were slow to act. Many of the rules that now protect banks and savings were written in response.`,
      [clues, history, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("Why did share prices depend on confidence?", "为什么股价依赖于信心？"),
          t("People bought because they expected others to keep buying", "人们买入是因为预期别人会继续买入"),
          [
            t("Companies grew exactly as fast as their prices", "公司的增长与股价完全同步"),
            t("The government set the prices", "价格由政府制定"),
            t("Only banks could buy shares", "只有银行能买股票"),
          ],
          t(
            "The second paragraph says prices climbed faster than real growth, so people bought because they expected others to buy.",
            "第二段说，股价上涨的速度远超实际增长，所以人们买入是因为预期别人也会买入。",
          ),
        ),
        ask(
          t("How did bank failures spread, according to the passage?", "根据文章，银行倒闭是如何蔓延的？"),
          t("Frightened people withdrew savings from other banks, causing more to fail", "惊慌的人们从其他银行取出存款，导致更多银行倒闭"),
          [
            t("The government closed every bank on purpose", "政府故意关闭了所有银行"),
            t("Banks refused to lend to factories", "银行拒绝贷款给工厂"),
            t("Banks moved their money abroad", "银行把钱转移到了国外"),
          ],
          t(
            "The fourth paragraph says frightened people rushed to withdraw their savings from other banks, which caused even more to collapse.",
            "第四段说，惊慌的人们争相从其他银行取出存款，导致更多银行倒闭。",
          ),
        ),
        ask(
          t("What is the cycle described in the fifth paragraph?", "第五段描述的是什么样的循环？"),
          t("Less spending led to job losses, which led to even less spending", "支出减少导致失业，失业又导致支出进一步减少"),
          [
            t("Rising prices led to higher wages", "物价上涨带来更高工资"),
            t("More borrowing led to more savings", "更多借贷带来更多储蓄"),
            t("Factories hired more workers each year", "工厂每年雇用更多工人"),
          ],
          t(
            "People bought fewer goods, factories laid off workers, and those workers had even less to spend, so the cycle repeated.",
            "人们买的东西更少，工厂解雇工人，这些工人可花的钱更少，于是循环往复。",
          ),
        ),
      ],
      ["American", "Americans", "New", "York", "Stock", "Exchange", "October", "Black", "Tuesday", "United", "States"],
    ),
    passage(
      "posters-that-went-to-war",
      t("Posters That Went to War", "走上战场的海报"),
      `During the Second World War, governments needed more than soldiers. They needed farmers to grow more food, factories to build more planes, families to save fuel and metal, and everyone to buy war bonds that helped pay for the fighting. To persuade millions of people at once, they turned to posters.

Posters were cheap to print and could be placed anywhere: in train stations, shop windows, schools and factories. The best of them combined a simple image with a few words that were easy to remember. In Britain, one poster showed a garden spade beside the words "Dig for Victory," urging families to grow vegetables in their gardens and parks. In the United States, a famous image showed a woman worker in a red headscarf, flexing her arm beneath the words "We Can Do It!"

Many posters were propaganda, messages designed to shape what people thought and felt, often by showing only one side. Some were harmless and practical, encouraging people to save food or avoid careless talk that might help enemy spies. Others were darker. Posters in many countries showed the enemy as monstrous or less than human, making it easier for people to support violence against them. In totalitarian states, where the government controlled all newspapers, radio and films, propaganda was everywhere and no other voices were allowed.

Historians study these posters as primary sources. They do not show us what people actually believed; they show what governments wanted people to believe, and what fears and hopes they thought would move them. A poster asking women to work in factories tells us that the government needed workers, and also that some people needed to be convinced that women could do the job.

Looking at a poster, a historian asks: Who made this? For whom? What did they want the viewer to feel and do? And what does it leave out? These questions are just as useful for the images that surround us today.`,
      [clues, history, documents, { topic: "academic-words-1", weight: 0.1 }],
      [
        ask(
          t("Why were posters a useful tool for governments during the war?", "为什么海报在战争期间是政府的有用工具？"),
          t("They were cheap and could reach millions of people in many places", "它们便宜，能在很多地方触及数百万人"),
          [
            t("They were the only kind of art allowed", "它们是唯一被允许的艺术形式"),
            t("They could be sent to enemy countries", "它们可以被送到敌国"),
            t("They told both sides of every story", "它们讲述了每件事的两面"),
          ],
          t(
            "The second paragraph says posters were cheap to print and could be placed anywhere, from stations to factories.",
            "第二段说，海报印制便宜，可以张贴在从车站到工厂的任何地方。",
          ),
        ),
        ask(
          t("What does the passage say posters show historians?", "文章说海报向历史学家展示了什么？"),
          t("What governments wanted people to believe", "政府希望人们相信什么"),
          [
            t("Exactly what everyone believed at the time", "当时每个人确切的想法"),
            t("How many soldiers fought in each battle", "每场战役有多少士兵参战"),
            t("The prices of goods during the war", "战时商品的价格"),
          ],
          t(
            "The fourth paragraph says posters do not show what people believed, but what governments wanted them to believe.",
            "第四段说，海报并不显示人们实际相信什么，而是显示政府希望他们相信什么。",
          ),
        ),
        ask(
          t(
            "What can a poster asking women to work in factories reveal beyond the government's need for workers?",
            "一张号召妇女进工厂工作的海报，除了说明政府需要工人，还能揭示什么？",
          ),
          t("Some people still had to be convinced that women could do the work", "仍有一些人需要被说服，相信妇女能胜任这份工作"),
          [
            t("Women did not want to work at all", "妇女根本不想工作"),
            t("Factories were closing", "工厂正在关闭"),
            t("The war had already ended", "战争已经结束"),
          ],
          t(
            "The passage says such a poster also tells us that some people needed to be convinced that women could do the job.",
            "文章说，这样的海报也告诉我们，有些人需要被说服，相信妇女能做好这份工作。",
          ),
        ),
      ],
      ["Britain", "United", "States"],
    ),
    passage(
      "the-end-of-empire",
      t("The End of Empire", "帝国的终结"),
      `At midnight on 14 August 1947, in the hall of the Constituent Assembly in New Delhi, Jawaharlal Nehru rose to speak. In a few minutes, India would be independent after nearly two centuries of British rule. "At the stroke of the midnight hour," he said, "when the world sleeps, India will awake to life and freedom."

The road to that night had been long. For decades, Indian leaders had demanded self-rule. The most famous, Mohandas Gandhi, led millions in campaigns of nonviolent resistance: refusing to buy British cloth, marching to the sea to make salt in defiance of a British tax, and accepting arrest rather than fighting back. These campaigns showed the world that British rule depended on the cooperation of Indians, and that this cooperation could be withdrawn.

The Second World War made independence urgent. Britain had been exhausted by the war, and many of its people no longer wished to hold an empire by force. Yet independence came with a terrible cost. Disputes between Hindu and Muslim leaders led to partition: British India was divided into two countries, India and Pakistan. As new borders were drawn, millions of people found themselves on the wrong side. Perhaps fifteen million people fled their homes, and violence between communities killed hundreds of thousands, possibly far more.

India's independence was followed by a wave of decolonization across Asia and Africa. Within thirty years, dozens of new nations had replaced the colonies of Britain, France, Portugal and other European powers. Some won independence through negotiation; others, as in Algeria and Vietnam, only after long and bloody wars.

The new nations faced enormous challenges. Many had borders drawn by colonial officials who knew little about the peoples living there. Their economies had been built to send raw materials to Europe. Building schools, governments and industries of their own would take generations, and in many places that work continues today.`,
      [clues, history, documents],
      [
        ask(
          t("How did Gandhi's campaigns challenge British rule?", "甘地领导的运动如何挑战了英国的统治？"),
          t(
            "They showed that British rule depended on Indians' cooperation, which could be withdrawn",
            "它们表明英国的统治依赖印度人的合作，而这种合作可以撤回",
          ),
          [
            t("They defeated the British army in battle", "它们在战场上打败了英军"),
            t("They persuaded Britain to buy Indian cloth", "它们说服英国购买印度布料"),
            t("They divided India into two countries", "它们把印度分成了两个国家"),
          ],
          t(
            "The second paragraph says the campaigns showed that British rule depended on the cooperation of Indians, and that it could be withdrawn.",
            "第二段说，这些运动表明英国的统治依赖于印度人的合作，而这种合作是可以撤回的。",
          ),
        ),
        ask(
          t("What was partition, as described in the passage?", "文章所描述的“分治”是什么？"),
          t("The division of British India into India and Pakistan", "把英属印度分为印度和巴基斯坦"),
          [
            t("A tax on salt", "一种盐税"),
            t("A meeting of the Constituent Assembly", "制宪会议的一次会议"),
            t("A campaign of nonviolent resistance", "一场非暴力抵抗运动"),
          ],
          t(
            "The third paragraph says disputes led to partition: British India was divided into two countries, India and Pakistan.",
            "第三段说，分歧导致了分治：英属印度被分成印度和巴基斯坦两个国家。",
          ),
        ),
        ask(
          t("Why did many new nations face difficulties with their borders?", "为什么许多新国家在边界问题上面临困难？"),
          t("The borders had been drawn by officials who knew little about the peoples there", "边界是由对当地民族知之甚少的官员划定的"),
          [
            t("They had no borders at all", "它们根本没有边界"),
            t("Their borders were set by the peoples themselves", "边界由当地民族自己划定"),
            t("Their neighbors refused to trade with them", "邻国拒绝与它们贸易"),
          ],
          t(
            "The last paragraph says many borders were drawn by colonial officials who knew little about the peoples living there.",
            "最后一段说，许多边界是由对当地民族了解甚少的殖民官员划定的。",
          ),
        ),
      ],
      [
        "Constituent",
        "Assembly",
        "New",
        "Delhi",
        "Jawaharlal",
        "Nehru",
        "India",
        "Indian",
        "Indians",
        "India's",
        "British",
        "Mohandas",
        "Gandhi",
        "Britain",
        "Hindu",
        "Muslim",
        "Pakistan",
        "Asia",
        "Africa",
        "France",
        "Portugal",
        "European",
        "Algeria",
        "Vietnam",
        "Europe",
      ],
    ),
    passage(
      "the-wall-comes-down",
      t("The Night the Wall Came Down", "柏林墙倒塌之夜"),
      `For twenty-eight years, a wall of concrete and wire divided the city of Berlin. It was built in 1961 by the government of East Germany, which was allied with the Soviet Union, to stop its citizens from escaping to the West. Families were separated overnight. Guards were ordered to shoot anyone who tried to cross, and more than a hundred people died attempting it.

The wall became the most famous symbol of the Cold War, the long rivalry between the United States and its allies on one side and the Soviet Union and its allies on the other. The two sides never fought a direct war, but they competed in weapons, space and influence around the world.

By the late 1980s, the communist governments of Eastern Europe were in trouble. Their economies were weak, and people were tired of shortages, censorship and the secret police. In the Soviet Union, a new leader, Mikhail Gorbachev, had begun reforms and made clear that he would not send tanks to keep other governments in power. In Poland and Hungary, change was already under way. In East Germany, crowds of thousands marched every week, chanting, "We are the people."

On the evening of 9 November 1989, a government spokesman announced at a press conference that East Germans would be allowed to travel freely. Asked when the rule began, he looked at his notes, seemed confused and said, "Immediately, without delay." In fact, it was meant to begin the next day, with proper paperwork. But crowds rushed to the wall, and the guards, with no orders, finally opened the gates.

That night, strangers embraced and climbed onto the wall with hammers. Within a year, Germany was reunited; within two, the Soviet Union itself had dissolved. A mistake at a press conference had opened a door that history was already pushing on.`,
      [clues, history],
      [
        ask(
          t("Why was the Berlin Wall built?", "柏林墙为什么被修建？"),
          t("To stop East Germans from escaping to the West", "为了阻止东德人逃往西方"),
          [
            t("To protect the city from floods", "为了保护城市免受洪水侵袭"),
            t("To separate two rival football clubs", "为了分开两个对立的足球俱乐部"),
            t("To keep Western soldiers out of the Soviet Union", "为了阻止西方士兵进入苏联"),
          ],
          t(
            "The first paragraph says the government of East Germany built it to stop its citizens from escaping to the West.",
            "第一段说，东德政府修建它是为了阻止本国公民逃往西方。",
          ),
        ),
        ask(
          t("What role did the spokesman's mistake play?", "发言人的失误起到了什么作用？"),
          t("He said the rule began immediately, and crowds rushed to the wall that night", "他说新规定立即生效，当晚人群便涌向柏林墙"),
          [
            t("He ordered the guards to shoot", "他命令卫兵开枪"),
            t("He announced that the wall would be made taller", "他宣布柏林墙要加高"),
            t("He refused to answer any questions", "他拒绝回答任何问题"),
          ],
          t(
            'He said "Immediately, without delay," though the rule was meant for the next day, and crowds rushed to the wall.',
            "他说“立即生效，毫不拖延”，尽管新规定本应第二天才实施，于是人群涌向了柏林墙。",
          ),
        ),
        ask(
          t("What does the last sentence suggest about the fall of the wall?", "最后一句话暗示了柏林墙倒塌的什么情况？"),
          t(
            "Deeper forces were already causing change; the mistake only set the moment",
            "更深层的力量早已在推动变化；那个失误只是决定了时机",
          ),
          [
            t("The wall fell only because of one accident", "柏林墙倒塌仅仅是因为一次意外"),
            t("Nobody wanted the wall to fall", "没有人希望柏林墙倒塌"),
            t("The Soviet Union planned the event carefully", "苏联精心策划了这一事件"),
          ],
          t(
            '"A door that history was already pushing on" means weak economies, protests and reforms were already making change likely.',
            "“一扇历史早已在推动的门”意味着疲弱的经济、抗议和改革已经让变化成为可能。",
          ),
        ),
      ],
      [
        "Berlin",
        "East",
        "Germany",
        "Germans",
        "Soviet",
        "Union",
        "West",
        "Cold",
        "War",
        "United",
        "States",
        "Eastern",
        "Europe",
        "Mikhail",
        "Gorbachev",
        "Poland",
        "Hungary",
      ],
    ),
    passage(
      "the-connected-world",
      t("The Connected World", "相互连接的世界"),
      `Pick up almost any object near you, and it probably has a story that crosses several countries. A pair of running shoes might be designed in one country, made from rubber grown in a second and fabric woven in a third, assembled in a fourth, and shipped across an ocean to be sold in a fifth. This web of connections is called globalization, and it has changed the world as much as any war or revolution.

Trade between distant places is ancient. But in the second half of the twentieth century, it grew enormously. One reason was a simple invention: the steel shipping container. Before the 1950s, goods were loaded onto ships one sack or box at a time, which was slow and expensive. Containers of a standard size could be lifted by cranes straight from ships onto trains and trucks, cutting the cost of shipping dramatically.

At the same time, many countries signed agreements to lower taxes on imported goods. Later, the internet allowed companies to coordinate factories and suppliers on different continents in real time.

The effects have been mixed. Globalization has helped hundreds of millions of people escape poverty, especially in Asia, as factories brought jobs and wages to places that had been mostly farming villages. Goods of all kinds became cheaper for buyers around the world.

But not everyone gained. In older industrial towns in Europe and North America, factories closed as companies moved production to countries where wages were lower. Many workers lost jobs that had supported their families for generations. Long supply chains also proved fragile: during the pandemic of 2020, shortages appeared quickly when factories closed and ships were delayed.

Today, people disagree about how much countries should depend on each other. Some want to bring factories home; others argue that cooperation makes everyone richer and wars less likely. Either way, the connected world is not going away.`,
      [clues, history, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("Why did the shipping container make trade cheaper?", "为什么集装箱让贸易变得更便宜？"),
          t(
            "Goods could be moved by crane between ships, trains and trucks without unpacking",
            "货物可以用起重机在船、火车和卡车之间转运而无需拆包",
          ),
          [
            t("Containers were made of gold", "集装箱是金子做的"),
            t("Ships no longer needed crews", "船不再需要船员"),
            t("It allowed goods to be shipped by air", "它让货物可以空运"),
          ],
          t(
            "The second paragraph says containers of a standard size could be lifted straight from ships onto trains and trucks, cutting costs.",
            "第二段说，标准尺寸的集装箱可以直接从船上吊到火车和卡车上，从而降低了成本。",
          ),
        ),
        ask(
          t("Who lost from globalization, according to the passage?", "根据文章，谁在全球化中受损？"),
          t("Workers in older industrial towns whose factories moved abroad", "老工业城镇中工厂外迁的工人"),
          [
            t("Buyers who paid less for goods", "以更低价格购物的消费者"),
            t("Villagers in Asia who found factory jobs", "在亚洲找到工厂工作的村民"),
            t("Companies that coordinated suppliers online", "在网上协调供应商的公司"),
          ],
          t(
            "The fifth paragraph says factories in older industrial towns closed as companies moved production abroad, and many workers lost their jobs.",
            "第五段说，随着公司把生产转移到国外，老工业城镇的工厂关闭，许多工人失去了工作。",
          ),
        ),
        ask(
          t("What does the word fragile most likely mean in the fifth paragraph?", "第五段中的 fragile 最可能是什么意思？"),
          t("Easily broken or disrupted", "容易断裂或受到干扰"),
          [t("Very strong and reliable", "非常坚固可靠"), t("Extremely cheap", "极其便宜"), t("Completely new", "全新的")],
          t(
            "Context clue: supply chains proved fragile when shortages appeared quickly as factories closed and ships were delayed.",
            "上下文线索：工厂关闭、船只延误后很快出现短缺，说明供应链是 fragile 的，即容易被打断。",
          ),
        ),
      ],
      ["Asia", "Europe", "North", "America"],
    ),
  ],
};
