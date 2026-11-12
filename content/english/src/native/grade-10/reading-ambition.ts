// Grade 10: the reading unit of the third theme, ambition and power, from an emperor who crowned himself and a
// general who changed sides to a king who gave up his throne and a country that asked its guilty to confess.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const ambitionWords = { topic: "words-of-ambition-and-tyranny", weight: 0.3 } as const;
const loyaltyWords = { topic: "words-of-loyalty-and-betrayal", weight: 0.3 } as const;
const guiltWords = { topic: "words-of-guilt-and-conscience", weight: 0.3 } as const;
const motives = { topic: "complex-characters-and-motives", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** ambitionAndPower is a reading unit of grade 10 on the desire for power, loyalty and betrayal, and guilt. */
export const ambitionAndPower: ReadingUnitDef = {
  id: "ambition-and-power",
  title: t("Ambition and Power", "野心与权力"),
  passages: [
    passage(
      "the-crown-he-took",
      t("The Crown He Took", "他自己拿起的王冠"),
      `On December 2, 1804, thousands of guests crowded into the cathedral of Notre-Dame in Paris to watch a coronation. The Pope had traveled from Rome for the occasion, and everyone expected him to place the crown on the head of the new emperor, as popes had done for kings for a thousand years. Instead, at the decisive moment, Napoleon Bonaparte took the crown in his own hands and placed it on his own head.

The gesture was carefully planned, and its meaning was clear. Napoleon owed his power to no one. Fifteen years earlier, France had risen in revolution against its king, and the revolutionaries had promised liberty and equality. Napoleon, a young officer from Corsica with no noble family, had risen through the chaos by winning battle after battle. By 1799 he had seized control of the government. Now he had made himself an emperor.

To many French people, he was a hero. He brought order after years of violence, built roads and schools, and created a clear code of laws that is still the basis of law in many countries. To others, he was a tyrant who had betrayed the revolution he claimed to protect. The composer Beethoven had dedicated a symphony to him, admiring him as a champion of freedom. When he heard of the coronation, he is said to have torn the title page in anger.

Napoleon's ambition seemed insatiable. He conquered much of Europe, placed his brothers on foreign thrones and dreamed of a hegemony that would stretch from Spain to Russia. In 1812 he invaded Russia with more than 600,000 soldiers. The Russians retreated, burning their own crops, and the winter did the rest. Fewer than 100,000 of his soldiers returned.

In 1814 his enemies forced him to abdicate and sent him to the island of Elba. He escaped, returned to power for a hundred days, and was finally defeated at Waterloo in 1815. He died on a remote island in the Atlantic, still insisting that he had acted for France.

Historians still argue about him. Was he a reformer who needed power to change his country, or a man whose overweening pride cost hundreds of thousands of lives? Perhaps the honest answer is that he was both.`,
      [ambitionWords, motives],
      [
        ask(
          t("What did Napoleon mean to show by crowning himself?", "拿破仑自己加冕想表明什么？"),
          t("That he owed his power to no one but himself", "他的权力不来自任何别人，只来自他自己"),
          [
            t("That he did not respect the cathedral of Paris", "他不尊重巴黎的大教堂"),
            t("That the Pope had arrived too late to do it", "教皇来得太晚，无法为他加冕"),
            t("That he wanted to return power to the king", "他想把权力还给国王"),
          ],
          t(
            "The second paragraph says the gesture was planned and its meaning was clear: Napoleon owed his power to no one.",
            "第二段说这一举动是精心策划的，意思很清楚：拿破仑的权力不来自任何人。",
          ),
        ),
        ask(
          t("Why is Beethoven said to have torn the title page of his symphony?", "据说贝多芬为什么撕掉了交响曲的扉页？"),
          t("He felt Napoleon had betrayed the freedom he once seemed to stand for", "他觉得拿破仑背叛了他曾经代表的自由"),
          [
            t("He disliked the music that was played at the coronation", "他不喜欢加冕典礼上演奏的音乐"),
            t("He had not been invited to the ceremony in Paris", "他没有受邀参加巴黎的典礼"),
            t("He wanted to dedicate the symphony to the Pope", "他想把交响曲献给教皇"),
          ],
          t(
            "Beethoven had admired Napoleon as a champion of freedom; the coronation showed him a man who made himself an emperor.",
            "贝多芬曾把拿破仑当作自由的捍卫者来敬仰；加冕却让他看到一个自立为皇帝的人。",
          ),
        ),
        ask(
          t("How does the passage present Napoleon's character in the end?", "文章最后怎样呈现拿破仑的性格？"),
          t("As mixed: both a reformer and a man of costly pride", "复杂的：既是改革者，又是代价惨重的骄傲之人"),
          [
            t("As simply a hero who saved his country from chaos", "单纯是一位把国家从混乱中拯救出来的英雄"),
            t("As simply a tyrant who did nothing of value", "单纯是一个毫无建树的暴君"),
            t("As a soldier who never wanted any power", "一个从不想要权力的军人"),
          ],
          t(
            "The last paragraph asks whether he was a reformer or a proud man who cost many lives, and answers that he was perhaps both.",
            "最后一段问他是改革者还是让许多人丧命的骄傲之人，并回答说他也许两者都是。",
          ),
        ),
      ],
      ["Napoleon", "Bonaparte", "Notre-Dame", "Corsica", "Beethoven", "Elba", "Waterloo"],
    ),
    passage(
      "the-ides-of-march",
      t("The Ides of March", "三月十五日"),
      `In the Roman calendar, the middle of March was called the Ides. On the Ides of March in 44 BC, Julius Caesar walked into a meeting of the Roman Senate. Within minutes he lay dead on the floor, stabbed twenty-three times by a group of senators. Among them was Marcus Brutus, a man Caesar had treated almost as a son.

Caesar had become the most powerful man in Rome. A brilliant general, he had conquered Gaul, the land that is now France, and had won a civil war against his rivals. The Senate, frightened or flattered, had named him dictator for life. Coins carried his portrait, and statues of him stood in the temples beside the gods. To his supporters, he was bringing peace to a republic torn by violence. To his enemies, he was a king in all but name, and Romans had hated kings for nearly five hundred years.

The conspirators called themselves liberators. They believed that by killing one man they could save the republic. Brutus, in particular, was famous for his honesty. His family claimed descent from the man who had driven out the last king of Rome, and many historians believe he joined the plot not out of envy but from a staunch belief in the republic.

Yet his act was also a terrible betrayal. Caesar had pardoned Brutus after the civil war, in which Brutus had fought against him, and had given him high office. According to one ancient writer, when Caesar saw Brutus among his attackers, he stopped resisting and covered his face with his robe.

The plot failed in its purpose. The people of Rome, who had loved Caesar, turned against the conspirators. Caesar's friend Mark Antony and his young heir Octavian raised armies, and within two years Brutus had taken his own life after losing a battle. Octavian went on to become Augustus, the first emperor of Rome. The republic that Brutus had killed to save was gone.

Was Brutus a loyal citizen or a treacherous friend? The question has fascinated writers for two thousand years, perhaps because he was, in different ways, both at once.`,
      [loyaltyWords, ambitionWords, motives],
      [
        ask(
          t("Why did many Romans fear Caesar's power?", "为什么许多罗马人害怕恺撒的权力？"),
          t("He seemed to be a king in all but name, and Romans hated kings", "他似乎除了名号外就是国王，而罗马人憎恨国王"),
          [
            t("He had lost a civil war against his rivals", "他在内战中败给了对手"),
            t("He refused to put his portrait on coins", "他拒绝把自己的肖像印在钱币上"),
            t("He planned to give Gaul back to its people", "他打算把高卢还给当地人"),
          ],
          t(
            "The second paragraph says his enemies saw him as a king in all but name, and Romans had hated kings for nearly five hundred years.",
            "第二段说他的敌人认为他除了名号外就是国王，而罗马人憎恨国王已近五百年。",
          ),
        ),
        ask(
          t("What motive do many historians give for Brutus joining the plot?", "许多历史学家认为布鲁图参与密谋的动机是什么？"),
          t("A firm belief in the republic rather than envy", "对共和国的坚定信念，而不是嫉妒"),
          [
            t("A wish to become dictator in Caesar's place", "想取代恺撒成为独裁者"),
            t("Anger that Caesar had refused to pardon him", "对恺撒不肯赦免他感到愤怒"),
            t("Fear of Mark Antony and his armies", "害怕马克·安东尼和他的军队"),
          ],
          t(
            "The third paragraph says many historians believe he joined not out of envy but from a staunch belief in the republic.",
            "第三段说许多历史学家认为他参与密谋不是出于嫉妒，而是出于对共和国的坚定信念。",
          ),
        ),
        ask(
          t("What does the passage suggest is ironic about the result of the plot?", "文章暗示这场密谋的结果有什么讽刺之处？"),
          t("The killing meant to save the republic led to its end", "本想拯救共和国的刺杀反而导致了它的终结"),
          [
            t("Brutus was made emperor by the grateful people", "感激的民众让布鲁图当了皇帝"),
            t("Caesar survived the attack and pardoned everyone", "恺撒在袭击中幸存并赦免了所有人"),
            t("The Senate became more powerful than ever before", "元老院变得比以往任何时候都更有权力"),
          ],
          t(
            "Octavian became the first emperor, so the republic that Brutus had killed to save was gone.",
            "屋大维成了第一位皇帝，所以布鲁图为了拯救而杀人的那个共和国消失了。",
          ),
        ),
      ],
      ["Caesar", "Brutus", "Gaul", "Antony", "Octavian", "Augustus", "BC"],
    ),
    passage(
      "the-general-who-changed-sides",
      t("The General Who Changed Sides", "改换阵营的将军"),
      `In the American War of Independence, few officers were braver than Benedict Arnold. In 1775 he led a march of more than a thousand men through the frozen forests of Maine to attack the city of Quebec. Two years later, at the Battle of Saratoga, he charged into the enemy lines against orders and was badly wounded in the leg. The victory at Saratoga persuaded France to join the war on the American side, and many historians believe Arnold deserved much of the credit.

Yet today, in the United States, his name means only one thing. To call someone a "Benedict Arnold" is to call him a traitor.

Arnold's story is not simply one of greed. He was a proud man who felt that he had been treated unfairly. Other officers, some less able than he, were promoted ahead of him. Congress questioned his accounts and accused him of using his position for profit. In Philadelphia, where he was military governor, he married a young woman from a family that was loyal to the British, and he spent far more money than he earned.

In 1780, Arnold took command of West Point, a fort on the Hudson River that controlled the route between New England and the other colonies. In secret, he offered to surrender it to the British in exchange for a large payment and a command in the British army. His messenger, a British officer named John André, was captured with the plans hidden in his boot. Arnold learned of the arrest just in time and escaped to a British ship.

André was hanged as a spy. Arnold became a general in the British army and led raids against the towns of the country he had once fought for, including one near his own birthplace. But the British never fully trusted a turncoat, and he never received the rewards he had hoped for. He died in London in 1801, in debt and largely forgotten.

At Saratoga there is a strange monument. It shows a boot and a soldier's badge, and it honors "the most brilliant soldier" of the army, who was wounded there. It does not give his name.`,
      [loyaltyWords, motives],
      [
        ask(
          t("Which of these helps explain why Arnold changed sides?", "下面哪一项有助于解释阿诺德为什么改换阵营？"),
          t("He felt passed over and unfairly treated, and he needed money", "他觉得被忽视、受到不公待遇，而且需要钱"),
          [
            t("He had always secretly been a British officer", "他一直秘密地是英国军官"),
            t("He was ordered to do so by Congress", "国会命令他这样做"),
            t("He wanted to protect the fort at West Point", "他想保护西点要塞"),
          ],
          t(
            "The third paragraph says he was proud, felt treated unfairly as others were promoted ahead of him, and spent more than he earned.",
            "第三段说他很骄傲，看到别人比他先晋升而觉得不公，而且花的钱比挣的多。",
          ),
        ),
        ask(
          t("How was Arnold's plot discovered?", "阿诺德的阴谋是怎样被发现的？"),
          t("His messenger was captured with the plans in his boot", "他的信使被捕，靴子里藏着计划"),
          [
            t("His wife told the American army about it", "他的妻子向美军告发了"),
            t("A British ship refused to take him aboard", "一艘英国船拒绝让他上船"),
            t("He confessed it to Congress in Philadelphia", "他在费城向国会坦白了"),
          ],
          t(
            "The fourth paragraph says John André was captured with the plans hidden in his boot.",
            "第四段说约翰·安德烈被捕时，计划藏在他的靴子里。",
          ),
        ),
        ask(
          t("Why does the monument at Saratoga not give Arnold's name?", "为什么萨拉托加的纪念碑不写阿诺德的名字？"),
          t("It honors his courage there while refusing to honor the traitor", "它纪念他在那里的英勇，却拒绝纪念这个叛徒"),
          [
            t("No one knew who had been wounded in the battle", "没人知道是谁在战斗中受了伤"),
            t("The monument was built before he became famous", "纪念碑建于他成名之前"),
            t("He asked in his will that his name be left out", "他在遗嘱中要求不写他的名字"),
          ],
          t(
            "The monument praises the most brilliant soldier wounded there but, because he later betrayed his country, leaves out his name.",
            "纪念碑赞扬在那里受伤的最杰出的军人，但因为他后来背叛了国家，没有写他的名字。",
          ),
        ),
      ],
      ["Benedict", "Arnold", "Maine", "Quebec", "Saratoga", "Philadelphia", "Hudson", "André"],
    ),
    passage(
      "the-emperor-of-the-wall",
      t("The Emperor of the Wall", "长城的皇帝"),
      `In 221 BC, after centuries of war between rival kingdoms, one ruler finally conquered all the others. He was the king of Qin, and he gave himself a new title: Qin Shi Huang, the First Emperor. He believed that his family would rule China for ten thousand generations.

His achievements were enormous. He made the different kingdoms use the same written characters, the same coins and the same weights and measures, so that a merchant could trade from one end of the empire to the other. He built roads and canals, and he joined earlier walls in the north into a long barrier against invaders, a work that later dynasties would extend into the Great Wall.

But his methods were ruthless. Hundreds of thousands of people were forced to work on his projects, and many died. To silence criticism, his chief minister persuaded him to order the burning of books that praised the past or questioned the present, keeping only works on subjects such as medicine and farming. According to the historian Sima Qian, writing about a century later, hundreds of scholars who opposed him were killed. Modern historians debate how much of this account is exact, but the emperor's reputation as a tyrant has lasted for two thousand years.

As he grew older, the emperor became obsessed with death. He sent expeditions across the sea to find a medicine that would make him live forever, and he took potions that may have contained mercury, a poison. He also prepared for the afterlife by building a vast tomb guarded by an army of thousands of life-sized clay soldiers, each with its own face.

He died in 211 BC while traveling, far from his capital. His ministers hid his death for weeks and forged his orders to place a weaker son on the throne. Within four years, rebellions had swept the country and his dynasty had fallen.

The clay army was discovered by farmers digging a well in 1974. Today millions of visitors come to see it. They stand in silence before the ranks of soldiers, admiring the skill of the workers who made them and wondering about the emperor who thought that even death could be commanded.`,
      [ambitionWords, motives, academic3],
      [
        ask(
          t("Which achievement helped merchants trade across the empire?", "哪一项成就帮助商人在全国各地做生意？"),
          t("The same coins, weights and measures everywhere", "各地使用相同的钱币和度量衡"),
          [
            t("The burning of books about the past", "焚烧有关过去的书籍"),
            t("The tomb guarded by clay soldiers", "由陶俑守卫的陵墓"),
            t("The search for a medicine of long life", "寻找长生不老药"),
          ],
          t(
            "The second paragraph says he made the kingdoms use the same characters, coins, weights and measures, so a merchant could trade everywhere.",
            "第二段说他让各国使用相同的文字、钱币和度量衡，因此商人可以到处做生意。",
          ),
        ),
        ask(
          t("What does the passage say about Sima Qian's account?", "关于司马迁的记载，文章怎么说？"),
          t("Modern historians debate how exact it is", "现代历史学家对它是否准确有争论"),
          [
            t("It was written by the emperor himself", "它是皇帝本人写的"),
            t("It was burned along with the other books", "它和其他书一起被烧掉了"),
            t("It proves the emperor was a gentle ruler", "它证明皇帝是位仁慈的君主"),
          ],
          t(
            "The third paragraph says modern historians debate how much of his account is exact.",
            "第三段说现代历史学家对他的记载有多少是准确的仍有争论。",
          ),
        ),
        ask(
          t("What does the last sentence suggest about the emperor's ambition?", "最后一句暗示皇帝的野心怎样？"),
          t("It went so far that he believed he could command even death", "它大到让他相信连死亡也能被他支配"),
          [
            t("It was small, since he cared only about farming", "很小，因为他只关心农业"),
            t("It was shared equally by all of his ministers", "他所有的大臣都同样怀有这种野心"),
            t("It ended when he discovered the clay army", "当他发现陶俑军队时就结束了"),
          ],
          t(
            "The final words describe an emperor who thought that even death could be commanded, a sign of boundless ambition.",
            "最后一句描述一位以为连死亡也可以被命令的皇帝，表明他的野心没有止境。",
          ),
        ),
      ],
      ["Qin", "Shi", "Huang", "Sima", "Qian", "BC"],
    ),
    passage(
      "the-king-who-gave-up-the-throne",
      t("The King Who Gave Up the Throne", "放弃王位的国王"),
      `On the evening of December 11, 1936, millions of people in Britain and across its empire gathered around their radios. They heard the voice of a man who, until that morning, had been their king. "I have found it impossible," he said, "to carry the heavy burden of responsibility and to discharge my duties as King as I would wish to do without the help and support of the woman I love."

Edward VIII had been king for less than a year. Before that, as Prince of Wales, he had been one of the most popular figures in the world, admired for his charm and his modern style. But he had fallen in love with Wallis Simpson, an American woman who had been divorced once and was in the process of divorcing her second husband.

At the time, the king was also the head of the Church of England, which did not allow divorced people to remarry while their former partners were still alive. The prime minister, Stanley Baldwin, told Edward that the government and the people would not accept Mrs. Simpson as queen. Edward faced a choice: give her up, or give up the crown. He chose to abdicate, and his younger brother became King George VI.

People judged his decision very differently. Some saw it as a great romance, a man who gave up an empire for love. Others saw it as a failure of duty, a king who put his own happiness before his responsibilities to his people. His brother, a shy man with a stammer who had never expected or wanted to rule, had to take up the burden that Edward had laid down, just a few years before the Second World War.

Later evidence complicated the story further. Edward and Wallis visited Nazi Germany in 1937 and met Hitler, and documents found after the war suggested that Edward had been less loyal to his country than many had believed. Some historians now argue that his abdication, painful as it was, may have been fortunate for Britain.

Edward lived the rest of his life in France as the Duke of Windsor. He and Wallis remained together until his death in 1972. Whether his choice was noble, selfish or simply human, it remains one of the most famous decisions ever made by a king.`,
      [ambitionWords, loyaltyWords, motives, academic2, academic1],
      [
        ask(
          t("Why could Edward not keep both the crown and his marriage plans?", "为什么爱德华不能既保住王位又实现结婚计划？"),
          t("The government and the Church would not accept a divorced woman as queen", "政府和教会不接受一位离过婚的女子成为王后"),
          [
            t("Wallis Simpson refused to live in Britain", "沃利斯·辛普森拒绝住在英国"),
            t("His brother had already been chosen as king", "他的弟弟已经被选为国王"),
            t("The radio would not broadcast his wedding", "电台不肯播出他的婚礼"),
          ],
          t(
            "The third paragraph explains that the Church did not allow divorced people to remarry and the prime minister said she would not be accepted as queen.",
            "第三段解释说教会不允许离婚者再婚，首相说人们不会接受她当王后。",
          ),
        ),
        ask(
          t("How did the abdication affect Edward's brother?", "退位对爱德华的弟弟有什么影响？"),
          t("A shy man who never wanted to rule had to become king", "一个从不想统治的腼腆男人不得不当上国王"),
          [
            t("He was sent to live in France for the rest of his life", "他被送去法国度过余生"),
            t("He refused the crown and gave it to Baldwin", "他拒绝王位，把它交给了鲍德温"),
            t("He lost his position in the Church of England", "他失去了在英国国教中的地位"),
          ],
          t(
            "The fourth paragraph says his brother, shy and with a stammer, had never expected or wanted to rule but had to take up the burden.",
            "第四段说他的弟弟腼腆、口吃，从未期待也不想统治，却不得不挑起重担。",
          ),
        ),
        ask(
          t("How does later evidence change the way some people see the abdication?", "后来的证据怎样改变了一些人对退位的看法？"),
          t(
            "It suggests Edward's loyalty was doubtful, so his leaving may have helped Britain",
            "它表明爱德华的忠诚值得怀疑，所以他的离开也许对英国有利",
          ),
          [
            t("It proves that Edward never loved Wallis Simpson", "它证明爱德华从未爱过沃利斯·辛普森"),
            t("It shows that Baldwin wanted to be king himself", "它表明鲍德温自己想当国王"),
            t("It reveals that the radio speech was never given", "它揭示那篇广播讲话从未发表过"),
          ],
          t(
            "The fifth paragraph says documents suggested Edward was less loyal than believed, and some historians think his abdication was fortunate for Britain.",
            "第五段说文件表明爱德华并不像人们以为的那样忠诚，一些历史学家认为他退位对英国是幸事。",
          ),
        ),
      ],
      ["Edward", "VIII", "Wallis", "Simpson", "Stanley", "Baldwin", "George", "VI", "Nazi", "Hitler", "Windsor"],
    ),
    passage(
      "the-blame-that-fell-on-sam",
      t("The Blame That Fell on Sam", "落在萨姆身上的责备"),
      `The window of the science lab broke on a Thursday afternoon, and by Friday morning the whole school knew that Sam Okoro had done it.

Leo knew that he had not. Leo had been there. He and Sam had been kicking a ball against the wall behind the lab after school, and it was Leo's kick, a wild one that he had meant to look impressive, that sent the ball through the glass. They had both run. Sam, who was faster, had been seen by a teacher as he turned the corner. Leo, behind him, had not.

When the vice principal called Sam into her office, Leo waited for his friend to say his name. Sam did not. He said only that he had been there and that he was sorry the window was broken. He was given a week of detention and a letter home to his parents, who would have to pay for the glass.

Leo told himself that he would confess on Monday. Then he told himself that it was too late, that confessing now would only get them both in trouble, that Sam had chosen to stay silent and that it was Sam's decision. He was skilled at finding reasons. What he could not find was sleep.

The strange thing was that Sam never mentioned it. He sat beside Leo at lunch as usual and talked about football and a film he wanted to see. He did not seem angry. That made it worse. Leo began to avoid him, taking a different route home and sitting at another table, and he hated himself for it, which made him avoid Sam even more. He was not only culpable for the window. He was now complicit in the punishment of his best friend.

On the last day of Sam's detention, Leo walked into the vice principal's office. His hands were shaking. He told her everything: the kick, the running, the silence. He expected her to be furious. Instead, she listened, asked him a few questions and then said, "Thank you for telling me. That cannot have been easy."

Leo was given a detention of his own and paid for half of the window from his savings. Sam's parents received a second letter, which explained that their son had been exonerated.

That evening, Leo found Sam outside his house. "Why didn't you tell them it was me?" he asked.

Sam shrugged. "I thought you would," he said. "I just didn't know when."`,
      [guiltWords, loyaltyWords, motives],
      [
        ask(
          t("Why did Leo keep delaying his confession?", "利奥为什么一再推迟坦白？"),
          t("He kept finding reasons to avoid the consequences", "他不断找理由逃避后果"),
          [
            t("He did not know who had broken the window", "他不知道是谁打破了窗户"),
            t("Sam had asked him never to tell anyone", "萨姆要求他永远不要告诉任何人"),
            t("The vice principal refused to see him", "副校长拒绝见他"),
          ],
          t(
            "The fourth paragraph says he told himself it was too late and that it was Sam's decision; he was skilled at finding reasons.",
            "第四段说他告诉自己已经太晚了，而且那是萨姆的决定；他很擅长找理由。",
          ),
        ),
        ask(
          t("Why did Sam's friendliness make Leo feel worse?", "为什么萨姆的友好让利奥感觉更糟？"),
          t(
            "It reminded Leo that his friend was suffering for his silence without blaming him",
            "它提醒利奥，朋友因他的沉默受罚却不责怪他",
          ),
          [
            t("Leo thought Sam was secretly planning revenge", "利奥认为萨姆在暗中策划报复"),
            t("Sam talked too much about a film Leo disliked", "萨姆总谈论一部利奥不喜欢的电影"),
            t("Leo wanted to sit with other friends at lunch", "利奥想和别的朋友一起吃午饭"),
          ],
          t(
            "Sam did not seem angry, and that made it worse: Leo's guilt grew because his friend bore the punishment without complaint.",
            "萨姆似乎并不生气，这反而更糟：朋友毫无怨言地承担惩罚，使利奥的罪恶感越来越重。",
          ),
        ),
        ask(
          t("What does Sam's last reply reveal about him?", "萨姆最后的回答揭示了他什么？"),
          t("He trusted that Leo would eventually do the right thing", "他相信利奥最终会做正确的事"),
          [
            t("He had forgotten who broke the window", "他忘了是谁打破了窗户"),
            t("He wanted Leo to pay for the whole window", "他想让利奥赔整扇窗户"),
            t("He was angry that Leo had confessed", "他对利奥坦白感到生气"),
          ],
          t(
            "\"I thought you would. I just didn't know when\" shows that Sam's silence came from loyalty and trust in his friend's conscience.",
            '"我以为你会说的，只是不知道什么时候"表明萨姆的沉默出于忠诚，以及对朋友良心的信任。',
          ),
        ),
      ],
      ["Sam", "Okoro", "Leo"],
    ),
    passage(
      "the-tallest-tower",
      t("The Tallest Tower", "最高的塔"),
      `In the city of Varno, the merchant Aldo Brask had everything a man could want: a fleet of ships, a house by the harbor and the respect of the whole town. What he did not have was the tallest building. That honor belonged to the old cathedral, whose spire had looked down on Varno for three hundred years.

So Brask decided to build a tower. He hired the best architect in the country and told her that the tower must rise higher than the spire. When she showed him her plans, he looked at the height and said, "More." She added ten floors. "More," he said again.

The architect warned him that the ground near the harbor was soft and that a building so tall might not stand. Brask dismissed her. He hired another architect, a young man who agreed with everything he said. When the town council raised questions, Brask lent money to two of its members, and the questions stopped. When his oldest friend, a ship captain named Teo, told him that the townspeople were laughing at his vanity, Brask stopped inviting him to dinner.

The tower took six years to build. Brask spent his savings, then sold his ships one by one. On the day the last stone was laid, the whole town gathered at its foot. The tower was magnificent. Its top was hidden in the clouds, and the cathedral spire looked like a toy beside it. Brask climbed to the highest room and looked down at the town that he now overlooked completely.

That night, a storm came in from the sea. In the morning, the townspeople saw that the tower was leaning, just slightly, toward the harbor. By the end of the month, it was leaning so far that no one would enter it. The council, its members no longer in debt to Brask, ordered it to be taken down.

Years later, an old man was often seen sitting on the cathedral steps, looking at the empty space where the tower had stood. One day Teo sat down beside him. For a long time, neither spoke. Then Brask said, quietly, "It was very tall, wasn't it?"

"It was," said Teo. "For a month."`,
      [ambitionWords, motives],
      [
        ask(
          t("Why did Brask want to build the tower?", "布拉斯克为什么要建这座塔？"),
          t("He wanted the honor of having the tallest building in the town", "他想拥有城里最高建筑的荣耀"),
          [
            t("He needed a new home for his family", "他需要给家人一个新家"),
            t("The cathedral was about to fall down", "大教堂快要倒塌了"),
            t("The town council asked him to build it", "镇议会请他建造"),
          ],
          t(
            "The first paragraph says he had everything except the tallest building, an honor that belonged to the cathedral.",
            "第一段说他什么都有，唯独没有最高的建筑，这份荣耀属于大教堂。",
          ),
        ),
        ask(
          t(
            "What do Brask's actions toward the first architect, the council and Teo have in common?",
            "布拉斯克对第一位建筑师、议会和泰奥的做法有什么共同点？",
          ),
          t("He silences or pushes away anyone who questions his plan", "他让任何质疑他计划的人闭嘴或疏远他们"),
          [
            t("He thanks each of them for their honest advice", "他感谢他们每个人的坦诚建议"),
            t("He asks each of them to share in the profits", "他请他们每个人分享利润"),
            t("He follows their advice and changes the plans", "他听从他们的建议并修改了计划"),
          ],
          t(
            "He dismisses the architect, buys the council's silence and stops inviting Teo; each time he removes someone who doubts him.",
            "他解雇了建筑师，买通了议会，不再邀请泰奥；每一次他都清除了一个怀疑他的人。",
          ),
        ),
        ask(
          t("What does Teo's last reply suggest?", "泰奥最后的回答暗示了什么？"),
          t("The tower's glory was short and not worth what Brask gave up", "塔的荣耀很短暂，不值得布拉斯克所付出的一切"),
          [
            t("Teo had always wanted to own the tower himself", "泰奥一直想自己拥有那座塔"),
            t("The tower will soon be built again even taller", "这座塔很快会重建得更高"),
            t("Brask was right to ignore the first architect", "布拉斯克不理第一位建筑师是对的"),
          ],
          t(
            '"For a month" reminds Brask how briefly the tower stood, after he had spent his ships, his money and his friend on it.',
            '"一个月"提醒布拉斯克这座塔只存在了多么短的时间，而他为此付出了船队、金钱和朋友。',
          ),
        ),
      ],
      ["Varno", "Aldo", "Brask", "Teo"],
    ),
    passage(
      "telling-the-truth-to-heal",
      t("Telling the Truth to Heal", "说出真相以求愈合"),
      `When apartheid ended in South Africa in the early 1990s, the country faced a painful question. For decades, the government had kept the Black majority separate and unequal by law. Thousands of people had been imprisoned, tortured or killed, by the police and, in some cases, by groups fighting against the government. How could a nation built on such injustice become a place where everyone could live together?

Some people wanted trials and punishment, like the trials held after the Second World War. Others feared that trials would take decades and might lead to new violence, since many of the guilty still held power in the army and police. The new government, led by Nelson Mandela, chose a different path: the Truth and Reconciliation Commission, led by Archbishop Desmond Tutu.

The commission made an unusual offer. People who had committed crimes for political reasons could apply for amnesty, meaning that they would not be prosecuted. But they had to tell the whole truth about what they had done, in public. Those who lied, or who refused to come forward, could still be put on trial.

For more than two years, the commission held hearings across the country. Victims and their families described what had happened to them, often for the first time. Police officers described how they had killed prisoners and hidden their bodies. Some families finally learned where their loved ones were buried. Many hearings were broadcast on radio and television, so that the whole nation listened.

The commission was not without critics. Some victims felt that criminals were being allowed to walk free simply by talking. Not every perpetrator expressed contrition, and some seemed to recite their crimes without feeling. The commission could recommend payments to victims, but the government paid far less than it suggested.

Yet many people believe that the commission did something that trials could not. It created a shared record that no one could deny. It allowed victims to be heard and gave some of them the chance to meet the people who had harmed them. Tutu argued that forgiveness was not forgetting, and that a country could not move forward by pretending the past had not happened. Other nations, from Peru to Canada, have since created their own truth commissions.`,
      [guiltWords, motives],
      [
        ask(
          t("What did people have to do to receive amnesty from the commission?", "人们必须做什么才能获得委员会的特赦？"),
          t("Tell the whole truth about their crimes in public", "公开讲出他们罪行的全部真相"),
          [
            t("Pay money to the families of their victims", "向受害者家属付钱"),
            t("Leave South Africa and never return", "离开南非，永不回来"),
            t("Serve a short time in prison first", "先坐一小段时间的牢"),
          ],
          t(
            "The third paragraph says they had to tell the whole truth about what they had done, in public; those who lied could still be tried.",
            "第三段说他们必须公开讲出自己所做的全部真相；说谎的人仍可能受审。",
          ),
        ),
        ask(
          t("Why did some people prefer a commission to trials?", "为什么一些人更倾向于成立委员会而不是审判？"),
          t("Trials might take decades and lead to new violence", "审判可能耗时几十年，并引发新的暴力"),
          [
            t("No one had committed any crimes under apartheid", "种族隔离期间没有人犯过罪"),
            t("The victims did not want to speak about the past", "受害者不想谈论过去"),
            t("Trials had already been held after the war", "战后已经举行过审判"),
          ],
          t(
            "The second paragraph says some feared trials would take decades and might cause new violence, since many of the guilty still held power.",
            "第二段说一些人担心审判要拖几十年，并可能引发新的暴力，因为许多有罪的人仍掌握权力。",
          ),
        ),
        ask(
          t("Which criticism of the commission does the passage mention?", "文章提到了对委员会的哪一种批评？"),
          t("Some criminals went free without showing real remorse", "一些罪犯没有表现出真正的悔意就获得了自由"),
          [
            t("The hearings were kept secret from the public", "听证会对公众保密"),
            t("Archbishop Tutu refused to listen to the victims", "图图大主教拒绝倾听受害者"),
            t("Other countries banned truth commissions", "其他国家禁止设立真相委员会"),
          ],
          t(
            "The fifth paragraph says some victims felt criminals walked free by talking, and not every perpetrator expressed contrition.",
            "第五段说一些受害者觉得罪犯只要开口就能获释，而且并非每个施害者都表示了悔恨。",
          ),
        ),
      ],
      ["Nelson", "Mandela", "Desmond", "Tutu", "Peru"],
    ),
  ],
};
