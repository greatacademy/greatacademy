// Grade 11: the reading unit of the sixth theme, justice and protest, from a man who would not pay a tax and a
// letter from a jail to a boycott of grapes, a fire in a factory, riders on buses, two roads to equality, two
// raised fists and a day when the women of a country stopped work.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const justice = { topic: "words-of-justice-and-protest", weight: 0.3 } as const;
const equality = { topic: "words-of-equality-and-freedom", weight: 0.3 } as const;
const comparing = { topic: "comparing-arguments-on-one-issue", weight: 0.2 } as const;
const academic6 = { topic: "academic-words-6", weight: 0.1 } as const;
const academic7 = { topic: "academic-words-7", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** justiceAndProtest is a reading unit of grade 11 on justice and protest, equality and freedom, and the arguments of those who sought them. */
export const justiceAndProtest: ReadingUnitDef = {
  id: "justice-and-protest",
  title: t("Justice and Protest", "正义与抗议"),
  passages: [
    passage(
      "the-night-in-the-jail",
      t("The Night in the Jail", "狱中一夜"),
      `In July 1846, Henry David Thoreau walked into the town of Concord, Massachusetts, from his cabin at Walden Pond to collect a mended shoe. On the way, he met the local tax collector, who reminded him that he had not paid his poll tax, a small tax charged to every adult man, for several years. Thoreau said he would not pay it. The collector arrested him, and he spent the night in the town jail.

Thoreau had a reason. The tax went to a government that permitted slavery and that had just gone to war with Mexico, a war that many people in the North believed was being fought to spread slavery into new territory. Thoreau did not want his money, however small, to support either. The next morning, someone, probably his aunt, paid the tax for him, and he was released, angry that he had been freed against his will.

He turned the experience into a lecture and then an essay, which later became known as "Civil Disobedience." Its argument was that a person's conscience is a higher authority than the law. When a government commits a serious injustice, Thoreau wrote, citizens should not simply vote against it and wait. They should refuse to cooperate. Under a government that imprisons anyone unjustly, he declared, the true place for a just man is also a prison.

Thoreau's essay raised questions that are still debated. If everyone obeyed only their own conscience, would there be any law at all? Thoreau's answer was that he did not oppose government in general, only an unjust one, and that the person who breaks a law for conscience must accept the punishment openly. That openness, he believed, was what separated civil disobedience from simple crime.

For decades, the essay had few readers. Then, in the twentieth century, it found an audience far beyond Concord. Mohandas Gandhi read it while organizing protests against unjust laws in South Africa and later in India, and he said it influenced his ideas. Leaders of the civil rights movement in the United States read it too. Many of them were arrested for breaking laws they believed were unjust, and they went to jail without resisting, just as Thoreau had argued.

Thoreau spent only one night behind bars. But the question he asked that night, what a citizen owes to a government that does wrong, has travelled further than he could have imagined.`,
      [justice, equality, comparing, academic6],
      [
        ask(
          t("Why did Thoreau refuse to pay his tax?", "梭罗为什么拒绝纳税？"),
          t(
            "He did not want to support a government that allowed slavery and fought an unjust war",
            "他不想支持一个允许奴隶制、发动不义战争的政府",
          ),
          [
            t("He could not afford to pay because he was too poor", "他太穷了，付不起"),
            t("He believed that all taxes should be abolished forever", "他认为所有的税都应永远废除"),
            t("He had forgotten to bring money to town that day", "他那天忘了带钱进城"),
          ],
          t(
            "The second paragraph says the tax went to a government that permitted slavery and had gone to war with Mexico, and he did not want to support either.",
            "第二段说这笔税交给了一个允许奴隶制并对墨西哥开战的政府，他不想支持这两者。",
          ),
        ),
        ask(
          t(
            "What, according to Thoreau, separates civil disobedience from simple crime?",
            "在梭罗看来，什么把公民不服从和单纯的犯罪区分开来？",
          ),
          t("Breaking the law openly for conscience and accepting the punishment", "出于良知公开违法并接受惩罚"),
          [
            t("Breaking the law secretly so that no one is hurt", "秘密地违法，这样就没有人受伤"),
            t("Breaking only laws that are very old", "只违反非常古老的法律"),
            t("Asking a lawyer for permission first", "事先征得律师的许可"),
          ],
          t(
            "The fourth paragraph says the person who breaks a law for conscience must accept the punishment openly, and that openness separates civil disobedience from crime.",
            "第四段说出于良知违法的人必须公开接受惩罚，这种公开性将公民不服从与犯罪区分开来。",
          ),
        ),
        ask(
          t("How did the essay's influence spread in the twentieth century?", "这篇文章的影响在二十世纪是如何传播的？"),
          t(
            "Gandhi and civil rights leaders read it and used its ideas in their protests",
            "甘地和民权运动领袖读了它，并在抗议中运用了它的思想",
          ),
          [
            t("It was banned and forgotten until very recently", "它被禁止并被遗忘，直到最近"),
            t("It was taught only in the schools of Concord", "它只在康科德的学校里讲授"),
            t("It was used by governments to justify new taxes", "政府用它来为新税辩护"),
          ],
          t(
            "The fifth paragraph says Gandhi said it influenced his ideas, and leaders of the civil rights movement read it too.",
            "第五段说甘地称这篇文章影响了他的思想，民权运动的领袖们也读过它。",
          ),
        ),
      ],
      [
        "Henry",
        "David",
        "Thoreau",
        "Thoreau's",
        "Concord",
        "Massachusetts",
        "Mexico",
        "Mexican",
        "Emerson",
        "Mohandas",
        "Gandhi",
        "American",
      ],
    ),
    passage(
      "a-letter-from-a-cell",
      t("A Letter from a Cell", "牢房里的一封信"),
      `In April 1963, Martin Luther King Jr. was arrested in Birmingham, Alabama, for leading a march without a permit. Birmingham was one of the most segregated cities in the United States. Black residents could not eat at most lunch counters, use the same restrooms as white people or apply for many jobs. Bombs had been set off so often in Black neighborhoods that some people called the city Bombingham.

While King sat in a jail cell, a friend smuggled in a newspaper. In it was a public letter from eight white religious leaders of the city. They agreed that segregation was wrong, but they called the protests unwise and untimely. They urged Black residents to be patient, to stop demonstrating and to wait for change through the courts and negotiation. They also suggested that King was an outsider who had come to stir up trouble.

King began to write an answer in the margins of the newspaper and on scraps of paper, which his lawyers carried out. The result, known as the "Letter from Birmingham Jail," is one of the most important documents of the civil rights movement.

King answered each point of his critics in turn. To the charge that he was an outsider, he replied that he had been invited, and that injustice in one place threatens justice in every place, so no one who cared about fairness could be an outsider anywhere in the country. To the call for patience, he explained that Black Americans had waited for more than three hundred years. The word wait, he wrote, had almost always meant never. He described having to explain to his young daughter why she could not go to an amusement park advertised on television.

He also explained why he was willing to break some laws while asking others to obey them. A just law, he argued, is one that uplifts human dignity; an unjust law is one that degrades it, or that a majority imposes on a minority while refusing to obey it itself. One has a moral responsibility to disobey unjust laws, he said, but one must do so openly, lovingly and with a willingness to accept the penalty.

Perhaps his sharpest point was aimed at those who claimed to agree with him. The greatest obstacle to freedom, he wrote, was not the open racist but the moderate who preferred order to justice, who agreed with the goal but always disagreed with the methods.

Within months, Birmingham's leaders agreed to end segregation in many stores. The letter, written on scraps in a cell, continues to be read wherever people argue about when to wait and when to act.`,
      [justice, equality, comparing, academic7, academic3],
      [
        ask(
          t("What did the eight religious leaders argue in their letter?", "那八位宗教领袖在信中主张什么？"),
          t("That the protests were unwise and Black residents should wait for the courts", "抗议是不明智的，黑人居民应该等待法院解决"),
          [
            t("That segregation was right and should continue forever", "种族隔离是正确的，应该永远继续下去"),
            t("That King should lead more marches across the country", "金应该在全国领导更多的游行"),
            t("That the city should build more amusement parks", "这座城市应该建更多的游乐园"),
          ],
          t(
            "The second paragraph says they agreed segregation was wrong but called the protests unwise and untimely and urged patience and the courts.",
            "第二段说他们同意种族隔离是错误的，但称抗议不明智、不合时宜，并主张耐心等待法院解决。",
          ),
        ),
        ask(
          t("How did King distinguish a just law from an unjust one?", "金如何区分正义的法律与不正义的法律？"),
          t(
            "A just law uplifts human dignity; an unjust law degrades it or binds only a minority",
            "正义的法律提升人的尊严；不正义的法律贬低人的尊严或只约束少数人",
          ),
          [
            t("A just law is old; an unjust law is new", "正义的法律是古老的；不正义的法律是新的"),
            t("A just law is passed by a city; an unjust law by a country", "正义的法律由城市通过；不正义的法律由国家通过"),
            t("A just law is easy to obey; an unjust law is hard", "正义的法律容易遵守；不正义的法律难以遵守"),
          ],
          t(
            "The fifth paragraph says a just law uplifts human dignity, and an unjust law degrades it or is imposed by a majority on a minority.",
            "第五段说正义的法律提升人的尊严，不正义的法律贬低尊严，或由多数强加于少数。",
          ),
        ),
        ask(
          t("Whom did King call the greatest obstacle to freedom?", "金称谁是自由的最大障碍？"),
          t("The moderate who agreed with the goal but preferred order to justice", "同意目标、却更看重秩序而非正义的温和派"),
          [
            t("The open racist who used violence in the streets", "在街头使用暴力的公开种族主义者"),
            t("The lawyers who carried his letter out of jail", "把他的信带出监狱的律师"),
            t("The young people who joined the marches", "参加游行的年轻人"),
          ],
          t(
            "The sixth paragraph says the greatest obstacle was not the open racist but the moderate who preferred order to justice.",
            "第六段说最大的障碍不是公开的种族主义者，而是更看重秩序而非正义的温和派。",
          ),
        ),
      ],
      ["Martin", "Luther", "King", "Jr", "Birmingham", "Alabama", "King's", "Black", "American", "Americans", "Easter"],
    ),
    passage(
      "the-grapes-of-delano",
      t("The Grapes of Delano", "德拉诺的葡萄"),
      `In September 1965, a group of Filipino grape pickers in the town of Delano, California, walked out of the fields. They were paid about a dollar and twenty-five cents an hour. Many lived in camps without running water, and in the fields they were often given no toilets and no clean water to drink, even in temperatures above thirty-five degrees. The grape growers refused to negotiate. The Filipino workers, led by Larry Itliong, asked the mostly Mexican American farmworkers' association led by Cesar Chavez and Dolores Huerta to join them.

Chavez hesitated. His group was small and had little money, and a strike could fail and destroy it. But the members voted to join, and the two groups later merged into a single union, the United Farm Workers.

The strike was hard to win. Growers could bring in replacement workers, and the pickers had no savings. So Chavez and Huerta took the struggle beyond the fields. They asked people across the country, and later around the world, to stop buying table grapes until the growers agreed to a contract. Volunteers stood outside supermarkets handing out leaflets. Some stores removed grapes from their shelves.

The boycott worked because it turned a local dispute into a question for ordinary shoppers: would they buy fruit picked by workers who were denied basic dignity? At its height, millions of Americans stopped buying grapes.

Chavez insisted that the movement remain nonviolent, even when strikers were beaten. In 1968, when some members began to talk of using force, he went without food for twenty-five days to recommit the union to peaceful methods. He lost so much weight that he could barely stand.

Not everyone agreed with the union's tactics. Growers argued that the boycott hurt small farmers as well as large ones and that outsiders did not understand the economics of farming. Some workers who wanted to keep working felt pressured by the strike. These objections were not all unreasonable, and a fair history must include them.

In 1970, five years after the strike began, the major grape growers signed contracts with the union. The workers won higher wages, clean water, toilets in the fields and protection from dangerous pesticides. The victory was not permanent; the union later lost members and many contracts. But the grape boycott showed that people with almost no power could win redress by making others care about how their food was grown.`,
      [justice, equality, comparing, academic6, academic3],
      [
        ask(
          t("Why did Chavez and Huerta organize a boycott of grapes?", "查韦斯和韦尔塔为什么组织抵制葡萄？"),
          t("The strike alone was hard to win, so they sought pressure from shoppers", "单靠罢工难以取胜，所以他们寻求购物者施加压力"),
          [
            t("They believed grapes were bad for people's health", "他们认为葡萄对人的健康有害"),
            t("The government had asked them to stop the strike", "政府要求他们停止罢工"),
            t("They wanted to start selling their own grapes", "他们想开始卖自己的葡萄"),
          ],
          t(
            "The third paragraph says the strike was hard to win, so they took the struggle beyond the fields by asking people to stop buying grapes.",
            "第三段说罢工难以取胜，所以他们把斗争扩展到田地之外，呼吁人们不买葡萄。",
          ),
        ),
        ask(
          t("Why did Chavez go without food for twenty-five days?", "查韦斯为什么绝食二十五天？"),
          t("To recommit the union to nonviolence when some members talked of force", "在一些成员谈论使用武力时，让工会重新坚守非暴力"),
          [
            t("To protest against the price of grapes in supermarkets", "抗议超市里的葡萄价格"),
            t("Because the union could not afford to buy food", "因为工会买不起食物"),
            t("To lose weight before a meeting with the growers", "为了在与种植者见面前减肥"),
          ],
          t(
            "The fifth paragraph says that when some members talked of force, he fasted for twenty-five days to recommit the union to peaceful methods.",
            "第五段说当一些成员谈论使用武力时，他绝食二十五天，让工会重新坚守和平方式。",
          ),
        ),
        ask(
          t("What objections to the boycott does the passage present fairly?", "文章公正地陈述了对抵制运动的哪些反对意见？"),
          t("That it hurt small farmers and pressured some workers who wanted to work", "它伤害了小农户，并给一些想工作的工人带来压力"),
          [
            t("That grapes were too expensive for most people to buy", "葡萄太贵，大多数人买不起"),
            t("That the union was secretly owned by the growers", "工会秘密地归种植者所有"),
            t("That the strikers had used violence from the start", "罢工者从一开始就使用了暴力"),
          ],
          t(
            "The sixth paragraph says growers argued the boycott hurt small farmers and some workers felt pressured, and calls these objections not all unreasonable.",
            "第六段说种植者认为抵制伤害了小农户，一些工人感到有压力，并称这些反对意见并非都不合理。",
          ),
        ),
      ],
      [
        "Cesar",
        "Chavez",
        "Chavez's",
        "Dolores",
        "Huerta",
        "Delano",
        "California",
        "Filipino",
        "Mexican",
        "American",
        "Americans",
        "United",
        "Farm",
        "Workers",
        "Larry",
        "Itliong",
      ],
    ),
    passage(
      "the-fire-on-the-ninth-floor",
      t("The Fire on the Ninth Floor", "九楼的大火"),
      `Late on a Saturday afternoon in March 1911, near closing time, a fire broke out on the eighth floor of a building in Manhattan, New York. The top three floors were occupied by the Triangle Shirtwaist Company, which made women's blouses. About five hundred people worked there, most of them young women and girls, many of them recent Jewish and Italian immigrants. Some were only fourteen years old.

The fire spread quickly through the piles of cotton scraps. Workers on the ninth floor rushed to the exits and found that one of the doors was locked. The owners kept it locked, it was later said, to prevent workers from stealing and from taking unauthorized breaks. The single fire escape collapsed under the weight of the people on it. The firefighters' ladders reached only to the sixth floor. Within about eighteen minutes, 146 people were dead. Many had jumped from the windows to escape the flames, while crowds on the street below watched in horror.

The deaths shocked the city, but they were not a complete surprise. Two years earlier, thousands of garment workers, including many from the Triangle factory, had gone on strike for higher pay, shorter hours and safer conditions. Among their demands had been unlocked doors and working fire escapes. The Triangle owners had refused.

The owners were tried for manslaughter but found not guilty. Years later, they paid the families of the victims about seventy-five dollars for each life lost. To many, this verdict was a second injustice.

Yet the fire led to lasting change. A young woman named Frances Perkins had been on the street that day and saw the workers fall. She later said that the day of the fire was the day a new era began. New York created a commission to investigate factory conditions across the state. Over the next few years, the state passed dozens of new laws requiring fire drills, sprinklers, unlocked doors and limits on working hours for women and children. These laws became models for the rest of the country.

Perkins herself went on to become the first woman to serve in a president's cabinet, as Secretary of Labor, and she helped create laws on minimum wages and the forty-hour working week.

Every year, on the anniversary of the fire, people gather outside the building, which still stands. They chalk the names of the victims on the pavement, a reminder that safety at work was won at a terrible cost.`,
      [justice, equality, academic7],
      [
        ask(
          t("Why was one of the exit doors locked?", "为什么有一扇出口门被锁上了？"),
          t("The owners kept it locked to prevent stealing and unauthorized breaks", "老板把它锁上，以防工人偷东西和擅自休息"),
          [
            t("The firefighters locked it to keep out the smoke", "消防员把它锁上以挡住烟雾"),
            t("It had been broken for years and could not open", "它坏了好几年，打不开"),
            t("The workers locked it to keep the fire out", "工人把它锁上以挡住火"),
          ],
          t(
            "The second paragraph says the owners kept the door locked, it was later said, to prevent workers from stealing and taking unauthorized breaks.",
            "第二段说据后来的说法，老板锁着这扇门，以防工人偷东西和擅自休息。",
          ),
        ),
        ask(
          t("Why was the fire not a complete surprise?", "为什么这场大火并不完全出人意料？"),
          t(
            "Workers had already struck for unlocked doors and working fire escapes and been refused",
            "工人们早已为了不锁的门和可用的消防梯而罢工，却遭到拒绝",
          ),
          [
            t("The building had burned down twice before", "这栋楼以前已经烧毁过两次"),
            t("The owners had announced that a fire would happen", "老板曾宣布会发生火灾"),
            t("The city had warned that the building was too tall", "市政府曾警告说这栋楼太高了"),
          ],
          t(
            "The third paragraph says workers had struck two years earlier, demanding unlocked doors and working fire escapes, and the owners refused.",
            "第三段说工人们两年前曾罢工，要求不锁门和可用的消防梯，老板拒绝了。",
          ),
        ),
        ask(
          t("What lasting change followed the fire?", "这场大火之后发生了什么持久的变化？"),
          t("New laws on fire safety and working hours that became models elsewhere", "关于消防安全和工作时间的新法律，成为其他地方的范本"),
          [
            t("The owners were sent to prison for many years", "老板被判入狱多年"),
            t("All factories in New York were closed for good", "纽约所有的工厂都永久关闭了"),
            t("Immigrants were forbidden to work in factories", "移民被禁止在工厂工作"),
          ],
          t(
            "The fifth paragraph says the state passed dozens of new laws on fire drills, sprinklers, unlocked doors and working hours, which became models for the country.",
            "第五段说该州通过了数十项关于消防演习、喷淋装置、不锁门和工作时间的新法律，这些法律成为全国的范本。",
          ),
        ),
      ],
      ["Triangle", "Shirtwaist", "Company", "New", "York", "Manhattan", "Frances", "Perkins", "Italian", "Jewish", "American"],
    ),
    passage(
      "the-freedom-riders",
      t("The Freedom Riders", "自由乘车者"),
      `In 1960, the Supreme Court of the United States ruled that segregation in bus stations serving travelers between states was illegal. But in the South, the ruling was ignored. Waiting rooms, restrooms and lunch counters at bus stations were still marked "white" and "colored."

In May 1961, a group of thirteen people, Black and white, decided to test the law. They boarded two buses in Washington, D.C., heading south. They planned to sit together and to use the facilities at each station regardless of the signs. They called themselves the Freedom Riders. They knew that they might be attacked, and they had trained to respond without violence.

At first, the trip passed with only minor trouble. Then, in Alabama, it turned violent. Outside the town of Anniston, a mob surrounded one bus, slashed its tires and threw a firebomb through a window. The riders escaped just before the bus burst into flames, and they were beaten as they stumbled out. In Birmingham, the other bus was met by a crowd with iron pipes, and the police arrived only after the riders had been badly hurt.

Many people urged the riders to stop. Even some supporters of civil rights argued that the rides were too provocative and that progress would come faster through quieter negotiation. Government officials worried about the violence and asked for a cooling-off period. These were not unreasonable fears; people had nearly died.

But a young student leader in Nashville, Diane Nash, believed that if the rides stopped, it would send the message that violence could defeat nonviolence. She organized new riders to continue. Over the summer, more than four hundred people joined the rides. When they reached Jackson, Mississippi, they were arrested for using the white waiting room and sent to a harsh state prison. They kept singing in their cells.

In the autumn of 1961, under pressure from the attention the rides had drawn, the federal government issued firm rules ending segregation in bus and train stations, and the signs came down.

Many Freedom Riders went on to lead the civil rights movement; one of them, John Lewis, later served in Congress for more than thirty years. Their story raises a question that every movement faces: when is caution wise, and when does it simply give the advantage to those who use force?`,
      [justice, equality, comparing, academic6],
      [
        ask(
          t("What were the Freedom Riders trying to do?", "自由乘车者想做什么？"),
          t(
            "Test whether a court ruling against segregation in bus stations would be obeyed",
            "检验法院反对汽车站种族隔离的裁决是否会被遵守",
          ),
          [
            t("Find a faster bus route from Washington to the South", "找到一条从华盛顿到南方更快的公交路线"),
            t("Protest against the high price of bus tickets", "抗议高昂的车票价格"),
            t("Persuade bus companies to buy new buses", "说服公交公司购买新车"),
          ],
          t(
            "The first two paragraphs say the court had ruled such segregation illegal, but it was ignored, so the riders set out to test the law.",
            "前两段说法院已裁定这种隔离违法却无人遵守，所以乘车者出发去检验这项法律。",
          ),
        ),
        ask(
          t("What argument did some people make for stopping the rides?", "一些人以什么理由主张停止乘车行动？"),
          t(
            "They were too provocative, and quieter negotiation might bring progress faster",
            "它们太具挑衅性，较温和的谈判可能会带来更快的进步",
          ),
          [
            t("They were too expensive for the riders to pay for", "乘车者负担不起这项行动的费用"),
            t("The buses were needed for other passengers", "其他乘客需要用这些公交车"),
            t("The riders had already won all their goals", "乘车者已经实现了所有目标"),
          ],
          t(
            "The fourth paragraph says some supporters argued the rides were too provocative and progress would come faster through quieter negotiation.",
            "第四段说一些支持者认为乘车行动太具挑衅性，较温和的谈判会更快带来进步。",
          ),
        ),
        ask(
          t("Why did Diane Nash insist that the rides continue?", "黛安·纳什为什么坚持继续乘车行动？"),
          t("Stopping would send the message that violence could defeat nonviolence", "停下来就等于告诉人们暴力可以战胜非暴力"),
          [
            t("She wanted the riders to reach a prison in Mississippi", "她想让乘车者到密西西比州的监狱去"),
            t("The government had promised to pay the riders", "政府答应付钱给乘车者"),
            t("She believed the mobs had already given up", "她认为暴徒已经放弃了"),
          ],
          t(
            "The fifth paragraph says she believed that if the rides stopped, it would send the message that violence could defeat nonviolence.",
            "第五段说她认为如果停止乘车，就等于告诉人们暴力可以战胜非暴力。",
          ),
        ),
      ],
      [
        "Freedom",
        "Riders",
        "Supreme",
        "Court",
        "Alabama",
        "Anniston",
        "Birmingham",
        "Montgomery",
        "Mississippi",
        "Jackson",
        "Diane",
        "Nash",
        "John",
        "Lewis",
        "Washington",
        "Black",
        "American",
        "Americans",
      ],
    ),
    passage(
      "two-roads-to-equality",
      t("Two Roads to Equality", "通往平等的两条路"),
      `In 1895, a Black educator named Booker T. Washington gave a speech in Atlanta that made him the most famous Black leader in the United States. Washington had been born into slavery and had built the Tuskegee Institute in Alabama, a school that trained Black students in farming, building and other trades. In his speech, he made an offer to white Southerners. Black Americans, he suggested, would not demand social equality or press for political rights for the present. Instead, they would work hard, learn useful skills and build up property. In return, he asked white Southerners for jobs, fair treatment and support for Black education.

Washington believed that economic progress had to come first. Respect, he argued, would follow from usefulness. A man who owned a farm or a business and contributed to his town could not long be denied his rights. To many white listeners, the speech was reassuring, and they praised him widely. Many Black Americans, too, admired his practical program and his schools.

But some disagreed sharply. In 1903, a young scholar named W. E. B. Du Bois, the first Black American to earn a doctorate from Harvard, published a book called The Souls of Black Folk. In one chapter, he criticized Washington directly. Du Bois agreed that trade schools were valuable and that hard work mattered. But he argued that Washington's approach asked Black Americans to give up three things: political power, civil rights and higher education for their most gifted young people. And in the years since the speech, Du Bois pointed out, Black Southerners had lost the right to vote in state after state, and segregation had become law.

For Du Bois, no people could win respect by accepting a lower place. Rights had to be demanded, not earned by patience. He also argued that every people needed educated leaders, doctors, teachers and thinkers, not only skilled workers. In 1909, he helped found an organization to fight for civil rights in the courts and in public.

Historians still debate the two men. Washington lived in the violent South, where open protest could lead to murder, and some argue that his caution was a way of protecting his people while quietly funding legal challenges in secret. Du Bois lived and worked mostly in the North and could speak more freely.

The debate between them was not about the goal, which both men shared, but about the road. It is a debate that every movement for equality has had to face: whether to push for full rights at once or to build strength step by step.`,
      [equality, justice, comparing, academic7],
      [
        ask(
          t("What did Washington ask Black Americans to focus on first?", "华盛顿要求美国黑人首先关注什么？"),
          t("Hard work, useful skills and building up property", "努力工作、学习实用技能、积累财产"),
          [
            t("Demanding the right to vote in every state", "要求在每个州获得投票权"),
            t("Moving to the cities of the North", "搬到北方的城市"),
            t("Earning doctorates from famous universities", "在名牌大学获得博士学位"),
          ],
          t(
            "The first paragraph says Washington suggested Black Americans would work hard, learn useful skills and build up property, rather than press for rights for now.",
            "第一段说华盛顿提出美国黑人应努力工作、学习实用技能、积累财产，暂不争取权利。",
          ),
        ),
        ask(
          t(
            "What did Du Bois argue Washington's approach asked Black Americans to give up?",
            "杜波依斯认为华盛顿的路线要求美国黑人放弃什么？",
          ),
          t("Political power, civil rights and higher education for gifted youth", "政治权力、公民权利以及有天赋青年的高等教育"),
          [
            t("Their farms, their businesses and their schools", "他们的农场、生意和学校"),
            t("Hard work, trade schools and useful skills", "努力工作、职业学校和实用技能"),
            t("Their homes in the South and their families", "他们在南方的家园和家人"),
          ],
          t(
            "The third paragraph says Du Bois argued the approach asked them to give up political power, civil rights and higher education for their most gifted young people.",
            "第三段说杜波依斯认为这条路线要求他们放弃政治权力、公民权利以及最有天赋的年轻人接受高等教育的机会。",
          ),
        ),
        ask(
          t("What kind of disagreement did the two men have?", "两人之间是哪一类分歧？"),
          t("They shared the goal but disagreed about the best way to reach it", "他们目标相同，但在实现目标的最佳途径上有分歧"),
          [
            t("They disagreed about whether equality was a good goal", "他们在平等是否是好目标上有分歧"),
            t("They disagreed about the facts of where each was born", "他们在各自出生地的事实上有分歧"),
            t("They disagreed about whether schools should exist", "他们在是否应该有学校上有分歧"),
          ],
          t(
            "The last paragraph says the debate was not about the goal, which both shared, but about the road.",
            "最后一段说争论不在于目标，两人目标相同，而在于道路。",
          ),
        ),
      ],
      [
        "Booker",
        "Washington",
        "Washington's",
        "W",
        "E",
        "B",
        "Du",
        "Bois",
        "Du",
        "Bois's",
        "Tuskegee",
        "Atlanta",
        "Harvard",
        "Black",
        "American",
        "Americans",
        "Souls",
      ],
    ),
    passage(
      "two-raised-fists",
      t("Two Raised Fists", "两只高举的拳头"),
      `On the sixteenth of October, 1968, at the Olympic Games in Mexico City, two American sprinters, Tommie Smith and John Carlos, won the gold and bronze medals in the 200-meter race. When they stepped onto the podium to receive their medals, they did something that the world has never forgotten.

They walked out in black socks with no shoes, to represent Black poverty. As the American national anthem played, each lowered his head and raised one fist in a black glove into the air. Smith later said the gesture was a salute to human rights. The silver medalist, an Australian named Peter Norman, who was white, stood beside them wearing a badge in support of their cause.

The stadium fell into an uneasy silence, and then some spectators began to boo. Within two days, the Olympic leadership had expelled Smith and Carlos from the Games, saying that political gestures had no place in sport. At home, many newspapers condemned them. They received death threats, and for years they struggled to find work.

The arguments on each side were serious. Critics said that the Olympics were meant to bring nations together above politics, and that athletes who used the podium for protest broke an important rule. If every athlete protested a cause, they argued, the Games would become a battlefield of politics. Some also felt that the gesture showed disrespect to the national anthem.

Smith and Carlos and their supporters answered that the Games were already political. Nations used them to show their power, and Black athletes were celebrated when they won medals for their country but faced discrimination when they returned home. In that year, Black Americans were still fighting for basic rights, and leaders of the civil rights movement had been assassinated. Staying silent, they argued, would mean accepting that injustice.

Peter Norman also paid a price. Back in Australia, he was criticized and, many believe, left out of the next Olympic team despite his fast times. He never regretted his choice. When he died in 2006, Smith and Carlos travelled to Australia to carry his coffin.

Opinions of the protest have changed greatly over time. Today a statue of the two men with their fists raised stands at the university where they trained, and many people now see the gesture as an act of courage. Yet the debate it opened, about whether athletes should speak out on public issues, continues at almost every major sporting event.`,
      [justice, equality, comparing, academic6, academic2],
      [
        ask(
          t("Why were Smith and Carlos expelled from the Games?", "史密斯和卡洛斯为什么被逐出奥运会？"),
          t("The Olympic leaders said political gestures had no place in sport", "奥运会领导层说政治姿态在体育运动中没有立足之地"),
          [
            t("They had broken the rules of the 200-meter race", "他们违反了二百米比赛的规则"),
            t("They refused to accept their medals on the podium", "他们拒绝在领奖台上接受奖牌"),
            t("They had argued with the Australian runner", "他们和澳大利亚选手发生了争执"),
          ],
          t(
            "The third paragraph says the Olympic leadership expelled them, saying political gestures had no place in sport.",
            "第三段说奥运会领导层把他们驱逐了，称政治姿态在体育中没有立足之地。",
          ),
        ),
        ask(
          t("What was the critics' main argument against the protest?", "批评者反对这次抗议的主要理由是什么？"),
          t("The Games should stand above politics and bring nations together", "奥运会应该超越政治，把各国团结在一起"),
          [
            t("The runners had not trained hard enough to win", "运动员训练不够刻苦，不配获胜"),
            t("Black socks were not allowed at the Olympics", "奥运会不允许穿黑袜子"),
            t("The race had been run too slowly that year", "那一年的比赛跑得太慢了"),
          ],
          t(
            "The fourth paragraph says critics argued the Olympics were meant to bring nations together above politics, and protest broke that rule.",
            "第四段说批评者认为奥运会旨在超越政治、团结各国，抗议违反了这一规则。",
          ),
        ),
        ask(
          t(
            "How did Smith and Carlos answer the claim that the Games were above politics?",
            "史密斯和卡洛斯如何回应奥运会超越政治的说法？",
          ),
          t(
            "They said the Games were already political and silence would accept injustice",
            "他们说奥运会本来就是政治性的，保持沉默就等于接受不公",
          ),
          [
            t("They said they had not meant the gesture to be political", "他们说他们并没有想让这个姿态带有政治性"),
            t("They said the rules of the Games did not apply to them", "他们说奥运会的规则不适用于他们"),
            t("They said they would never run in a race again", "他们说他们再也不参加比赛了"),
          ],
          t(
            "The fifth paragraph says they answered that nations already used the Games to show power, and staying silent would mean accepting injustice.",
            "第五段说他们回应称各国早已利用奥运会展示实力，保持沉默就意味着接受不公。",
          ),
        ),
      ],
      [
        "Tommie",
        "Smith",
        "John",
        "Carlos",
        "Peter",
        "Norman",
        "Mexico",
        "City",
        "Olympic",
        "Olympics",
        "Australian",
        "Black",
        "American",
        "Americans",
      ],
    ),
    passage(
      "the-day-the-women-stopped",
      t("The Day the Women Stopped", "女性停工的那一天"),
      `On the twenty-fourth of October, 1975, something unusual happened in Iceland. Women across the country did not go to work. They did not cook, clean or look after their children. About ninety percent of the women in Iceland took part in what they called a day off. Around twenty-five thousand of them gathered in the center of the capital, Reykjavik, in a country whose whole population was then only about two hundred and twenty thousand.

The idea had grown out of a simple complaint. Women in Iceland earned far less than men, often less than two-thirds as much for similar work, and they held almost no seats in parliament. At the same time, they did nearly all the unpaid work of the household. Organizers wanted to show how much the country depended on women's work, paid and unpaid, by taking it away for a single day.

Some had suggested calling it a strike, but that word seemed too aggressive to many, and the organizers worried it would frighten off women who were less political or whose employers might punish them. Calling it a day off made it easier for women of every background, farmers' wives and office workers, young and old, to join. The choice of words helped turn a protest into something close to a national event.

The effect was dramatic. Banks, factories and shops had to close or run with few staff. Schools and nurseries shut because the teachers were women. Fathers had to bring their children to work, and many offices were filled with noisy children. Some shops reportedly sold out of sausages, an easy food that men could cook. Newspapers could barely be printed because the typesetters were women.

The next year, Iceland's parliament passed a law guaranteeing equal pay for equal work. Five years later, in 1980, Icelanders elected Vigdis Finnbogadottir as their president. She was the first woman in the world to be elected head of state in a national election. She said later that she would never have been elected without the day off.

The struggle did not end there. Women in Iceland still earned less than men decades later, and they have repeated the protest several times, leaving work at the exact time of day when, by the gap in their pay, they stopped being paid. Today Iceland is often ranked among the most equal countries in the world. Its story suggests that sometimes the most powerful way to show what people contribute is simply to stop.`,
      [equality, justice, academic7, academic2],
      [
        ask(
          t("Why did the organizers call the protest a day off rather than a strike?", "组织者为什么把这次抗议称为“休假日”而不是“罢工”？"),
          t("The word strike seemed aggressive and might frighten off many women", "“罢工”一词显得太激进，可能会吓退许多女性"),
          [
            t("Strikes were completely illegal in Iceland at the time", "当时罢工在冰岛是完全违法的"),
            t("The protest was held on a public holiday", "抗议是在一个公共假日举行的"),
            t("The women were paid for the day by their employers", "女性那天的工资由雇主支付"),
          ],
          t(
            "The third paragraph says strike seemed too aggressive and might frighten off less political women, so day off let women of every background join.",
            "第三段说“罢工”显得太激进，可能吓退不太关心政治的女性，所以“休假日”让各种背景的女性都能参加。",
          ),
        ),
        ask(
          t("What did the day show about the country?", "这一天说明了这个国家的什么情况？"),
          t("How much it depended on women's paid and unpaid work", "它有多么依赖女性的有偿和无偿劳动"),
          [
            t("That men were better at running banks and shops", "男性更擅长经营银行和商店"),
            t("That children did not need to go to school", "孩子们不需要去上学"),
            t("That newspapers were no longer read in Iceland", "冰岛不再有人看报纸"),
          ],
          t(
            "The second paragraph says organizers wanted to show how much the country depended on women's work, and the fourth paragraph shows banks, schools and newspapers stopping.",
            "第二段说组织者想说明国家有多依赖女性的劳动，第四段写了银行、学校和报纸停摆的情景。",
          ),
        ),
        ask(
          t("What followed the day off in later years?", "休假日之后的几年里发生了什么？"),
          t("An equal pay law and the election of a woman as president", "一部同工同酬的法律，以及一位女性当选总统"),
          [
            t("A ban on women working in factories", "禁止女性在工厂工作"),
            t("The closing of all nurseries in the country", "全国所有托儿所关闭"),
            t("A new law that made strikes illegal", "一部规定罢工违法的新法律"),
          ],
          t(
            "The fifth paragraph says parliament passed an equal pay law the next year, and in 1980 Vigdis Finnbogadottir was elected president.",
            "第五段说议会第二年通过了同工同酬法，1980 年维格迪丝·芬博阿多蒂尔当选总统。",
          ),
        ),
      ],
      ["Iceland", "Icelandic", "Reykjavik", "Vigdis", "Finnbogadottir", "United", "Nations"],
    ),
  ],
};
