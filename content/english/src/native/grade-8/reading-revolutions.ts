// Grade 8: the reading unit of the fourth theme, the age of revolutions, from the American and French revolutions to
// Haiti, Latin America and the long struggle to end slavery.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const revolutionWords = { topic: "words-of-revolution", weight: 0.3 } as const;
const foundingWords = { topic: "words-of-founding-documents", weight: 0.3 } as const;
const slaveryWords = { topic: "words-of-slavery-and-abolition", weight: 0.3 } as const;
const founding = { topic: "reading-a-founding-document", weight: 0.2 } as const;
const viewpoints = { topic: "acknowledging-conflicting-viewpoints", weight: 0.2 } as const;
const latin6 = { topic: "latin-roots-6", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** theAgeOfRevolutions is a reading unit of grade 8 on the revolutions of the late 1700s and early 1800s. */
export const theAgeOfRevolutions: ReadingUnitDef = {
  id: "the-age-of-revolutions",
  title: t("The Age of Revolutions", "革命时代"),
  passages: [
    passage(
      "a-quarrel-over-taxes",
      t("A Quarrel over Taxes", "一场关于税收的争吵"),
      `In 1763, Britain won a long and costly war against France for control of North America. The victory left the British government deeply in debt, and its leaders decided that the thirteen American colonies should help pay for the soldiers who protected them. Parliament began to pass new taxes.

The Stamp Act of 1765 required colonists to buy a stamp for newspapers, legal papers and even playing cards. The tax itself was small, but it caused an angry response. Colonists did not elect anyone to Parliament, and many argued that only their own assemblies had the right to tax them. "No taxation without representation" became their cry. Crowds attacked the homes of tax collectors, and merchants refused to buy British goods.

Parliament gave way and ended the Stamp Act, but it soon passed new taxes on glass, paint, paper and tea. Each time, the protests grew. In 1773, colonists disguised as Mohawk warriors boarded three ships in Boston harbor and threw 342 chests of tea into the water. Parliament answered by closing the port of Boston and sending more soldiers.

Not every colonist wanted to break with Britain. Many, later called Loyalists, believed that the protests had gone too far and that the colonies were safer under the king. Others hoped that a compromise could still be found. But by 1775, local militia groups were drilling on village greens, and in April of that year, British soldiers and colonists exchanged fire at Lexington and Concord. A quarrel over taxes had become a war.`,
      [revolutionWords, viewpoints, academic3, academic2],
      [
        ask(
          t("Why did many colonists object to the Stamp Act, although the tax was small?", "印花税虽然不多，为什么许多殖民者还是反对它？"),
          t("They had no elected members in the Parliament that taxed them", "向他们征税的议会里没有他们选出的议员"),
          [
            t("They could not afford to buy newspapers", "他们买不起报纸"),
            t("The tax was used to pay French soldiers", "这笔税被用来支付法国士兵的薪水"),
            t("The king had promised never to tax them", "国王曾承诺永远不向他们征税"),
          ],
          t(
            "The passage says the colonists did not elect anyone to Parliament and argued that only their own assemblies had the right to tax them.",
            "文章说殖民者没有选出任何议会议员，他们认为只有他们自己的议会才有权向他们征税。",
          ),
        ),
        ask(
          t("What did Parliament do after the tea was thrown into Boston harbor?", "茶叶被倒入波士顿港后，议会做了什么？"),
          t("It closed the port of Boston and sent more soldiers", "它关闭了波士顿港，并派来更多士兵"),
          [
            t("It ended all taxes on the colonies", "它取消了对殖民地的所有税收"),
            t("It gave the colonists seats in Parliament", "它给了殖民者议会席位"),
            t("It paid the merchants for the lost tea", "它赔偿了商人损失的茶叶"),
          ],
          t(
            "The third paragraph says Parliament closed the port of Boston and sent more soldiers.",
            "第三段说议会关闭了波士顿港并派来更多士兵。",
          ),
        ),
        ask(
          t("How does the passage show that colonists did not all agree?", "文章如何表明殖民者并非意见一致？"),
          t("It describes Loyalists who thought the protests had gone too far", "它描写了认为抗议过火的效忠派"),
          [
            t("It shows that the merchants supported the taxes", "它表明商人支持这些税"),
            t("It explains that the militia refused to fight", "它解释说民兵拒绝作战"),
            t("It says the tea was thrown away by British soldiers", "它说茶叶是被英国士兵倒掉的"),
          ],
          t(
            "The last paragraph says many colonists, later called Loyalists, believed the protests had gone too far and that the colonies were safer under the king.",
            "最后一段说许多后来被称为效忠派的殖民者认为抗议过火了，殖民地在国王统治下更安全。",
          ),
        ),
      ],
      [
        "Britain",
        "British",
        "France",
        "North",
        "America",
        "American",
        "Parliament",
        "Stamp",
        "Act",
        "Mohawk",
        "Boston",
        "Loyalists",
        "April",
        "Lexington",
        "Concord",
      ],
    ),
    passage(
      "a-declaration-of-independence",
      t("A Declaration of Independence", "一份独立宣言"),
      `In the summer of 1776, after more than a year of fighting, the Continental Congress in Philadelphia asked a committee to explain to the world why the colonies were breaking away from Britain. The committee chose Thomas Jefferson, a thirty-three-year-old lawyer from Virginia, to write the first draft.

The Declaration of Independence opens with a short preamble, which says that when one people separates from another, it owes the world an explanation. Then comes its most famous sentence: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness." In plain words, these rights belong to every person from birth and can never be given away. Governments exist to protect them, and when a government destroys them, the people may change it or remove it.

Most of the document is a long list of grievances against King George III. He had refused to approve good laws, taxed the colonists without their consent, kept soldiers among them in peacetime and cut off their trade. Each complaint was meant to prove that the king had become a tyrant.

Congress approved the Declaration on July 4, 1776. Its words were soon read aloud in town squares across the colonies. Yet they raised a question that would trouble the new nation for nearly a century. Jefferson himself held more than six hundred people in slavery during his life. How could a country founded on the idea that all men are created equal allow some people to own others?`,
      [foundingWords, founding, latin6],
      [
        ask(
          t("What does the passage say the preamble of the Declaration explains?", "文章说《独立宣言》的序言说明了什么？"),
          t("That a people separating from another owes the world an explanation", "一个民族在脱离另一个民族时应向世界作出解释"),
          [
            t("That the king had refused to approve good laws", "国王拒绝批准良好的法律"),
            t("That Congress would meet in Philadelphia", "大陆会议将在费城开会"),
            t("That Jefferson was chosen to write the draft", "杰斐逊被选中起草文件"),
          ],
          t(
            "The second paragraph says the preamble states that when one people separates from another, it owes the world an explanation.",
            "第二段说序言指出，当一个民族脱离另一个民族时，应当向世界作出解释。",
          ),
        ),
        ask(
          t(
            "According to the Declaration, what may the people do when a government destroys their rights?",
            "根据《独立宣言》，当政府破坏人民的权利时，人民可以怎么做？",
          ),
          t("Change the government or remove it", "改变或推翻这个政府"),
          [
            t("Ask the king for new laws", "请求国王颁布新法律"),
            t("Refuse to pay any taxes for a year", "一年内拒绝缴纳任何税款"),
            t("Write a list of grievances and wait", "写下一份不满清单并等待"),
          ],
          t(
            "The passage explains that governments exist to protect these rights, and when a government destroys them, the people may change it or remove it.",
            "文章解释说政府的存在是为了保护这些权利，当政府破坏这些权利时，人民可以改变或推翻它。",
          ),
        ),
        ask(
          t("What problem does the last paragraph raise about the Declaration?", "最后一段提出了关于《独立宣言》的什么问题？"),
          t("Its claim that all men are equal clashed with slavery in the new nation", "它关于人人平等的主张与新国家的奴隶制相矛盾"),
          [
            t("It was approved before the war had begun", "它在战争开始之前就被批准了"),
            t("It was never read aloud in public", "它从未被公开宣读"),
            t("Its list of grievances was too short to convince anyone", "它的不满清单太短，无法说服任何人"),
          ],
          t(
            "The passage notes that Jefferson held more than six hundred people in slavery and asks how a country founded on equality could allow some people to own others.",
            "文章指出杰斐逊一生奴役过六百多人，并问一个建立在平等之上的国家怎能允许一些人拥有另一些人。",
          ),
        ),
      ],
      [
        "Continental",
        "Congress",
        "Philadelphia",
        "Britain",
        "Thomas",
        "Jefferson",
        "Virginia",
        "Declaration",
        "Independence",
        "Creator",
        "Rights",
        "Life",
        "Liberty",
        "Happiness",
        "King",
        "George",
        "III",
        "July",
      ],
    ),
    passage(
      "the-fall-of-the-bastille",
      t("The Fall of the Bastille", "攻占巴士底狱"),
      `In 1789, France was the richest and most powerful kingdom in Europe, but its government was nearly bankrupt. It had spent huge sums on wars, including its support for the American Revolution, and the royal court at Versailles lived in great luxury. Meanwhile, a poor harvest had pushed the price of bread so high that many ordinary families spent most of their wages just to eat.

French society was divided into three groups, called estates. The clergy made up the first estate and the nobility the second. Together, they were a tiny part of the population, yet they paid almost no taxes. Everyone else, from rich lawyers to poor peasants, belonged to the third estate and carried the weight of the taxes.

When King Louis XVI called a meeting of the three estates to find money, the representatives of the third estate demanded a greater voice. When they were locked out of their meeting hall, they gathered on a nearby tennis court and swore not to separate until France had a constitution.

In Paris, rumors spread that the king was gathering soldiers to crush them. On July 14, 1789, an angry crowd stormed the Bastille, an old fortress that held prisoners and gunpowder. The fortress held only seven prisoners that day, but its fall had enormous meaning. The Bastille stood for the power of a king who could imprison people without trial. Within weeks, peasants across France were attacking the manor houses of nobles, and the old order began to collapse. Today, July 14 is France's national holiday.`,
      [revolutionWords, foundingWords],
      [
        ask(
          t("Why were many French families struggling in 1789?", "为什么1789年许多法国家庭生活艰难？"),
          t("A poor harvest had made bread very expensive", "歉收使面包变得非常昂贵"),
          [
            t("The Bastille had taken away their gunpowder", "巴士底狱夺走了他们的火药"),
            t("The nobles had refused to buy their goods", "贵族拒绝购买他们的货物"),
            t("The king had closed all the markets", "国王关闭了所有市场"),
          ],
          t(
            "The first paragraph says a poor harvest pushed the price of bread so high that many families spent most of their wages just to eat.",
            "第一段说歉收使面包价格高涨，许多家庭把大部分工资都花在吃饭上。",
          ),
        ),
        ask(
          t("What was unfair about the three estates?", "三个等级有什么不公平之处？"),
          t("The clergy and nobles paid almost no taxes, while everyone else paid", "教士和贵族几乎不纳税，而其他所有人都要纳税"),
          [
            t("The third estate had more votes than the other two", "第三等级比另外两个等级拥有更多选票"),
            t("Only peasants were allowed to own land", "只有农民被允许拥有土地"),
            t("The nobles had to pay for the king's wars alone", "贵族不得不独自承担国王的战争开支"),
          ],
          t(
            "The passage says the first two estates were a tiny part of the population yet paid almost no taxes, while the third estate carried the weight of the taxes.",
            "文章说前两个等级只占人口的极小部分，却几乎不纳税，而第三等级承担了税收的重担。",
          ),
        ),
        ask(
          t(
            "Why did the fall of the Bastille matter, although it held only seven prisoners?",
            "巴士底狱只关押着七名囚犯，为什么攻占它意义重大？",
          ),
          t("It stood for a king's power to imprison people without trial", "它象征着国王不经审判就监禁人民的权力"),
          [
            t("It was the king's favorite palace", "它是国王最喜爱的宫殿"),
            t("It held all the gold of the French government", "它存放着法国政府的全部黄金"),
            t("It was where the tennis court oath was sworn", "网球场宣誓就是在那里进行的"),
          ],
          t(
            "The last paragraph explains that the Bastille stood for the power of a king who could imprison people without trial.",
            "最后一段解释说，巴士底狱象征着一个可以不经审判就监禁人民的国王的权力。",
          ),
        ),
      ],
      ["France", "French", "Europe", "American", "Revolution", "Versailles", "King", "Louis", "XVI", "Paris", "July", "Bastille"],
    ),
    passage(
      "the-rights-of-man-and-of-woman",
      t("The Rights of Man, and of Woman", "人权与女权"),
      `In August 1789, a few weeks after the fall of the Bastille, the new National Assembly of France approved the Declaration of the Rights of Man and of the Citizen. Like the American Declaration of Independence, it began with the idea that people have rights by nature. Its first article states that men are born and remain free and equal in rights. Other articles promised freedom of speech and religion, equal treatment under the law and the right not to be arrested without cause. The power to govern, it declared, comes from the nation, not from the king.

The document was revolutionary, but it left many people out. It said nothing about the enslaved people working on French plantations in the Caribbean. And although women had marched and fought alongside men, the new rights were given only to men.

In 1791, a playwright named Olympe de Gouges answered with a document of her own, the Declaration of the Rights of Woman and of the Female Citizen. She copied the structure of the original almost article by article, but she changed its words. Her first article reads that woman is born free and remains equal to man in rights. She argued that if women could be punished by the law, they should also have a voice in making it.

Many revolutionaries mocked her. In the violent years that followed, she criticized the leaders of the Revolution, and in 1793 she was arrested and sent to the guillotine. French women would not win the right to vote until 1944. Yet her declaration is now remembered as one of the first great statements of women's rights.`,
      [foundingWords, revolutionWords, founding, academic2],
      [
        ask(
          t("Where did the Declaration of the Rights of Man say the power to govern comes from?", "《人权宣言》说统治权来自哪里？"),
          t("From the nation", "来自国民"),
          [t("From the king", "来自国王"), t("From the church", "来自教会"), t("From the army", "来自军队")],
          t(
            "The first paragraph says the power to govern, it declared, comes from the nation, not from the king.",
            "第一段说它宣布统治权来自国民，而不是来自国王。",
          ),
        ),
        ask(
          t("How did Olympe de Gouges write her declaration?", "奥兰普·德古热是如何写她的宣言的？"),
          t(
            "She copied the original's structure but changed its words to include women",
            "她沿用了原文的结构，但改动了用词，把女性包括进去",
          ),
          [
            t("She wrote it as a play to be performed in Paris", "她把它写成剧本在巴黎演出"),
            t("She asked the king to sign it before the Assembly", "她请国王在议会之前签署它"),
            t("She removed all the articles about the law", "她删去了所有关于法律的条款"),
          ],
          t(
            "The passage says she copied the structure of the original almost article by article but changed its words, so that woman is born free and equal to man.",
            "文章说她几乎逐条沿用了原文的结构，但改动了用词，写成女性生而自由并与男性平等。",
          ),
        ),
        ask(
          t("What was her argument for giving women a voice in making laws?", "她主张让女性参与立法的理由是什么？"),
          t("If women could be punished by the law, they should help make it", "既然女性会受到法律惩罚，她们就应该参与制定法律"),
          [
            t("Women had more education than men at the time", "当时女性比男性受过更多教育"),
            t("The king had promised women the vote", "国王曾承诺给予女性选举权"),
            t("Women paid more taxes than men", "女性比男性缴纳更多的税"),
          ],
          t(
            "The third paragraph says she argued that if women could be punished by the law, they should also have a voice in making it.",
            "第三段说她认为，既然女性会受到法律惩罚，她们也应该在制定法律时拥有发言权。",
          ),
        ),
      ],
      [
        "August",
        "Bastille",
        "National",
        "Assembly",
        "France",
        "French",
        "Declaration",
        "Rights",
        "Man",
        "Citizen",
        "American",
        "Independence",
        "Caribbean",
        "Olympe",
        "de",
        "Gouges",
        "Woman",
        "Female",
        "Revolution",
      ],
    ),
    passage(
      "the-revolution-in-haiti",
      t("The Revolution in Haiti", "海地革命"),
      `In the 1780s, the French colony of Saint-Domingue, on the western part of the Caribbean island of Hispaniola, was the richest colony in the world. It produced around forty percent of the sugar and more than half of the coffee sold in Europe. That wealth was built on the labor of nearly half a million enslaved Africans, who outnumbered the white colonists by about ten to one. Conditions on the sugar plantations were so brutal that many enslaved workers died within a few years of arriving.

When news of the French Revolution and its talk of liberty and equality reached the island, it raised hopes on every side. In August 1791, enslaved people in the north rose in a great insurrection, burning plantations and fighting for their freedom.

The most famous leader of the revolution was Toussaint Louverture, who had himself been born into slavery. He was a brilliant soldier and a skillful politician. Over the next ten years, his armies defeated French, Spanish and British forces. In 1794, the French government abolished slavery in all its colonies, and Toussaint became the ruler of the island.

Then, in 1802, Napoleon sent a huge army to bring back French control, and many feared he meant to restore slavery as well. Toussaint was tricked into a meeting, arrested and shipped to a prison in France, where he died. But the fighting went on under his general, Jean-Jacques Dessalines. On January 1, 1804, Dessalines declared the independence of Haiti, the first nation founded by people who had freed themselves from slavery.`,
      [slaveryWords, revolutionWords],
      [
        ask(
          t("What was Saint-Domingue's wealth built on?", "圣多明各的财富建立在什么之上？"),
          t("The labor of nearly half a million enslaved Africans", "近五十万被奴役非洲人的劳动"),
          [
            t("Gold mines in the mountains of the island", "岛上山区的金矿"),
            t("Trade with the American colonies", "与美洲殖民地的贸易"),
            t("The taxes paid by white colonists", "白人殖民者缴纳的税款"),
          ],
          t(
            "The first paragraph says the colony's wealth was built on the labor of nearly half a million enslaved Africans.",
            "第一段说这块殖民地的财富建立在近五十万被奴役非洲人的劳动之上。",
          ),
        ),
        ask(
          t("What does the passage suggest started the insurrection of 1791?", "文章暗示是什么引发了1791年的起义？"),
          t("News of the French Revolution and its ideas of liberty and equality", "法国大革命及其自由平等思想的消息"),
          [
            t("Napoleon's arrival with a huge army", "拿破仑率大军到来"),
            t("The arrest of Toussaint Louverture", "杜桑·卢维杜尔被捕"),
            t("A fall in the price of sugar in Europe", "欧洲糖价下跌"),
          ],
          t(
            "The second paragraph says the news of the French Revolution and its talk of liberty and equality raised hopes, and the insurrection followed.",
            "第二段说法国大革命及其自由平等言论的消息燃起了希望，随后发生了起义。",
          ),
        ),
        ask(
          t("Why is Haiti's independence described as unique?", "为什么说海地的独立是独一无二的？"),
          t("It was the first nation founded by people who had freed themselves from slavery", "它是第一个由自我解放的奴隶建立的国家"),
          [
            t("It was the first colony to grow coffee", "它是第一个种植咖啡的殖民地"),
            t("It was the only country Napoleon never attacked", "它是拿破仑唯一没有进攻过的国家"),
            t("It was founded on the same day as the United States", "它与美国在同一天建国"),
          ],
          t(
            "The last sentence says Haiti was the first nation founded by people who had freed themselves from slavery.",
            "最后一句说海地是第一个由摆脱奴隶制的人建立的国家。",
          ),
        ),
      ],
      [
        "French",
        "Saint",
        "Domingue",
        "Caribbean",
        "Hispaniola",
        "Europe",
        "Africans",
        "Revolution",
        "August",
        "Toussaint",
        "Louverture",
        "Spanish",
        "British",
        "Napoleon",
        "France",
        "Jean",
        "Jacques",
        "Dessalines",
        "January",
        "Haiti",
      ],
    ),
    passage(
      "the-liberator",
      t("The Liberator", "解放者"),
      `In the early 1800s, Spain ruled an empire in the Americas that stretched from California to the southern tip of South America. Its colonies were governed by officials sent from Spain, and the most powerful positions were given to people born in Europe. Wealthy families born in the colonies, known as creoles, resented being treated as second-class subjects in their own lands.

Their chance came in 1808, when Napoleon invaded Spain and imprisoned its king. With no legitimate ruler in Madrid, colonial leaders began to govern themselves, and soon they were demanding complete independence.

The most famous of these leaders was Simón Bolívar, the son of a rich family from Caracas, in what is now Venezuela. As a young man, he had travelled in Europe and read the writers of the Enlightenment, and he swore that he would not rest until South America was free. For nearly twenty years, he led armies across mountains, rivers and plains. In 1819, his soldiers made a daring march over the frozen passes of the Andes and surprised the Spanish army in what is now Colombia.

By 1825, Bolívar's campaigns had freed the lands that became Venezuela, Colombia, Ecuador, Peru and Bolivia, which was named in his honor. He was called the Liberator. Yet his dream of one great united nation failed. The new countries quarrelled, and Bolívar, struggling to hold them together, took more and more power for himself. Critics began to call him a dictator. He died in 1830, exhausted and disappointed, saying that those who had served the revolution had "ploughed the sea."`,
      [revolutionWords, viewpoints],
      [
        ask(
          t("Why did the creoles resent Spanish rule?", "为什么克里奥尔人对西班牙的统治不满？"),
          t("The most powerful positions went to people born in Europe", "最有权势的职位都给了在欧洲出生的人"),
          [
            t("Spain had freed all the enslaved people in the colonies", "西班牙解放了殖民地的所有奴隶"),
            t("Napoleon had become their king", "拿破仑成了他们的国王"),
            t("They were not allowed to travel to Europe", "他们不被允许去欧洲旅行"),
          ],
          t(
            "The first paragraph says the most powerful positions were given to people born in Europe, so creoles felt like second-class subjects.",
            "第一段说最有权势的职位都给了在欧洲出生的人，所以克里奥尔人觉得自己是二等臣民。",
          ),
        ),
        ask(
          t("How did events in Europe help the independence movements begin?", "欧洲的事件如何帮助独立运动兴起？"),
          t("Napoleon imprisoned Spain's king, so the colonies began to govern themselves", "拿破仑囚禁了西班牙国王，于是殖民地开始自治"),
          [
            t("Spain sent Bolívar to govern the colonies", "西班牙派玻利瓦尔去管理殖民地"),
            t("Britain bought the colonies from Spain", "英国从西班牙手中买下了殖民地"),
            t("The Enlightenment writers moved to Caracas", "启蒙运动的作家们搬到了加拉加斯"),
          ],
          t(
            "The second paragraph says that with no legitimate ruler in Madrid after Napoleon imprisoned the king, colonial leaders began to govern themselves.",
            "第二段说拿破仑囚禁国王后，马德里没有了合法统治者，殖民地领导人便开始自治。",
          ),
        ),
        ask(
          t("Which detail shows that people held conflicting views of Bolívar?", "哪个细节表明人们对玻利瓦尔有相互矛盾的看法？"),
          t("He was called the Liberator, but critics called him a dictator", "他被称为解放者，但批评者称他为独裁者"),
          [
            t("He travelled in Europe as a young man", "他年轻时曾在欧洲旅行"),
            t("His soldiers crossed the frozen passes of the Andes", "他的士兵翻越了安第斯山脉冰冻的山口"),
            t("Bolivia was named in his honor", "玻利维亚以他的名字命名"),
          ],
          t(
            "The last paragraph says he was called the Liberator, yet as he took more power, critics began to call him a dictator.",
            "最后一段说他被称为解放者，但随着他掌握更多权力，批评者开始称他为独裁者。",
          ),
        ),
      ],
      [
        "Spain",
        "Spanish",
        "Americas",
        "California",
        "South",
        "America",
        "Europe",
        "Napoleon",
        "Madrid",
        "Simón",
        "Bolívar",
        "Caracas",
        "Venezuela",
        "Enlightenment",
        "Andes",
        "Colombia",
        "Ecuador",
        "Peru",
        "Bolivia",
        "Liberator",
      ],
    ),
    passage(
      "voices-against-the-slave-trade",
      t("Voices Against the Slave Trade", "反对奴隶贸易的声音"),
      `For nearly three hundred years, European ships carried enslaved Africans across the Atlantic Ocean to the plantations of the Americas. Historians estimate that more than twelve million people were forced onto these ships, and that well over a million died during the crossing, which was known as the Middle Passage. By the late 1700s, British ships carried more enslaved people than those of any other nation.

In Britain, a movement grew to end the trade. Its members included Quakers, who believed that every person carried the light of God, and campaigners such as Thomas Clarkson, who collected evidence from sailors and doctors about conditions on the ships. One of the most powerful voices was Olaudah Equiano. Captured as a child in West Africa, he had been enslaved for ten years before he bought his own freedom. In 1789, he published the story of his life, describing the chains, the crowding and the cruelty of the slave ships. His book became a bestseller.

Abolitionists found new ways to reach the public. Josiah Wedgwood, a famous potter, made a small medallion showing a kneeling African in chains with the words "Am I Not a Man and a Brother?" Hundreds of thousands of people signed petitions, and many refused to buy sugar grown by enslaved workers.

Defenders of the trade argued that it was essential to Britain's wealth and that ending it would ruin merchants and ports. For years, they won the votes in Parliament. But in 1807, Parliament finally banned the slave trade in the British Empire. Slavery itself, however, continued in British colonies until 1834.`,
      [slaveryWords, viewpoints, academic1],
      [
        ask(
          t("What was the Middle Passage?", "什么是“中间航程”？"),
          t("The crossing of the Atlantic on which enslaved Africans were carried", "被奴役的非洲人被运送横渡大西洋的航程"),
          [
            t("A road that connected the plantations of the Americas", "连接美洲种植园的一条道路"),
            t("The law that ended the slave trade", "废除奴隶贸易的法律"),
            t("A meeting of Quakers in London", "伦敦贵格会的一次聚会"),
          ],
          t(
            "The first paragraph says over a million people died during the crossing, which was known as the Middle Passage.",
            "第一段说有一百多万人死于这段航程，它被称为“中间航程”。",
          ),
        ),
        ask(
          t("Why was Olaudah Equiano's book so powerful?", "为什么奥劳达·艾奎亚诺的书如此有力量？"),
          t("He had been enslaved himself and described the ships from experience", "他本人曾被奴役，根据亲身经历描写了奴隶船"),
          [
            t("He was a member of Parliament", "他是议会议员"),
            t("He was the owner of a large plantation", "他是一个大种植园的主人"),
            t("He made medallions that people wore", "他制作了人们佩戴的徽章"),
          ],
          t(
            "The passage says Equiano was captured as a child, enslaved for ten years, and described the chains, crowding and cruelty of the slave ships.",
            "文章说艾奎亚诺小时候被掳走，被奴役了十年，他描写了奴隶船上的锁链、拥挤和残酷。",
          ),
        ),
        ask(
          t("What view did the defenders of the trade hold?", "奴隶贸易的辩护者持什么观点？"),
          t("That ending it would ruin merchants and ports and harm Britain's wealth", "废除它会毁掉商人和港口，损害英国的财富"),
          [
            t("That enslaved people should be paid for their work", "被奴役的人应该得到劳动报酬"),
            t("That sugar should no longer be grown", "不应该再种植甘蔗"),
            t("That the trade should be moved to France", "这项贸易应该转移到法国"),
          ],
          t(
            "The last paragraph says defenders argued the trade was essential to Britain's wealth and ending it would ruin merchants and ports.",
            "最后一段说辩护者认为这项贸易对英国的财富至关重要，废除它会毁掉商人和港口。",
          ),
        ),
      ],
      [
        "European",
        "Africans",
        "Atlantic",
        "Ocean",
        "Americas",
        "Historians",
        "Middle",
        "Passage",
        "British",
        "Britain",
        "Quakers",
        "God",
        "Thomas",
        "Clarkson",
        "Olaudah",
        "Equiano",
        "West",
        "Africa",
        "Abolitionists",
        "Josiah",
        "Wedgwood",
        "African",
        "Parliament",
        "Empire",
      ],
    ),
    passage(
      "the-road-to-freedom",
      t("The Road to Freedom", "通往自由之路"),
      `In the United States, slavery grew rather than shrank after the Revolution. The invention of the cotton gin in 1793 made growing cotton far more profitable, and by 1860 nearly four million people were held in bondage, most of them on the cotton plantations of the South. Enslaved people could be bought and sold, and families were often torn apart.

Many resisted in whatever ways they could. Some worked slowly or broke tools; others kept their families' stories and songs alive. Thousands escaped. They travelled north at night, hiding in forests and swamps, following the North Star. A secret network of people, both Black and white, who hid and guided these fugitives became known as the Underground Railroad.

Its most famous conductor was Harriet Tubman. Born into slavery in Maryland, she escaped in 1849 and then returned again and again to lead others to freedom, including members of her own family. She carried a pistol and moved her groups through the darkness with great courage. She later said that she never lost a single passenger.

Another escaped slave, Frederick Douglass, became one of the greatest speakers of his age. In 1852, he was invited to give a speech for the Fourth of July. He asked his audience what the holiday meant to an enslaved person, and answered that it revealed "the gross injustice and cruelty" of which the enslaved were the constant victims.

The question of slavery divided the country until it led to civil war in 1861. In 1865, the Thirteenth Amendment to the Constitution finally abolished slavery throughout the United States.`,
      [slaveryWords, foundingWords],
      [
        ask(
          t("Why did slavery grow in the United States after 1793?", "为什么1793年后奴隶制在美国扩大了？"),
          t("The cotton gin made growing cotton far more profitable", "轧棉机使种植棉花的利润大大提高"),
          [
            t("The Revolution had made slavery legal for the first time", "独立战争第一次使奴隶制合法化"),
            t("The Underground Railroad brought enslaved people south", "地下铁路把被奴役的人带到了南方"),
            t("Cotton could no longer be bought from Britain", "再也不能从英国购买棉花"),
          ],
          t(
            "The first paragraph says the cotton gin of 1793 made growing cotton far more profitable.",
            "第一段说1793年发明的轧棉机使种植棉花的利润大大提高。",
          ),
        ),
        ask(
          t("What was the Underground Railroad?", "什么是“地下铁路”？"),
          t("A secret network of people who hid and guided escaping slaves", "一个隐藏并引导逃亡奴隶的秘密网络"),
          [
            t("A railway built under the cities of the North", "修建在北方城市地下的铁路"),
            t("A law that let enslaved people travel freely", "一项允许被奴役者自由旅行的法律"),
            t("A group of soldiers who fought in the civil war", "一群在内战中作战的士兵"),
          ],
          t(
            "The second paragraph says a secret network of people who hid and guided these fugitives became known as the Underground Railroad.",
            "第二段说一个隐藏并引导这些逃亡者的秘密网络被称为“地下铁路”。",
          ),
        ),
        ask(
          t("What point did Frederick Douglass make in his Fourth of July speech?", "弗雷德里克·道格拉斯在七四演讲中提出了什么观点？"),
          t("That the holiday revealed the injustice suffered by enslaved people", "这个节日暴露了被奴役者所遭受的不公"),
          [
            t("That the holiday should be moved to another day", "这个节日应该改到另一天"),
            t("That enslaved people should celebrate it too", "被奴役的人也应该庆祝它"),
            t("That the Revolution had ended slavery", "独立战争已经结束了奴隶制"),
          ],
          t(
            "The passage says Douglass answered that the holiday revealed the gross injustice and cruelty of which the enslaved were the constant victims.",
            "文章说道格拉斯回答，这个节日暴露了被奴役者一直遭受的严重不公和残酷。",
          ),
        ),
      ],
      [
        "United",
        "States",
        "Revolution",
        "South",
        "North",
        "Star",
        "Black",
        "Underground",
        "Railroad",
        "Harriet",
        "Tubman",
        "Maryland",
        "Frederick",
        "Douglass",
        "Fourth",
        "July",
        "Thirteenth",
        "Amendment",
        "Constitution",
      ],
    ),
  ],
};
