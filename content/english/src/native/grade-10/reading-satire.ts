// Grade 10: the reading unit of the eighth theme, satire and humor, from a modest proposal and a war over eggs to an
// emperor with no clothes, a spaghetti harvest, a jester who argued with an emperor and a ribbon cut for nothing.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const satireWords = { topic: "words-of-satire-and-wit", weight: 0.3 } as const;
const follyWords = { topic: "words-of-folly-and-vanity", weight: 0.3 } as const;
const satire = { topic: "understanding-satire", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** satireAndHumor is a reading unit of grade 10 on satire, wit and the follies they expose. */
export const satireAndHumor: ReadingUnitDef = {
  id: "satire-and-humor",
  title: t("Satire and Humor", "讽刺与幽默"),
  passages: [
    passage(
      "a-proposal-no-one-could-accept",
      t("A Proposal No One Could Accept", "一个无人能接受的建议"),
      `In 1729, a short pamphlet appeared in Dublin with a long title. It promised a plan for preventing the children of poor people in Ireland from being a burden to their parents or their country, and for making them useful to the public. Its author was Jonathan Swift, a clergyman already famous for his book Gulliver's Travels.

The pamphlet begins calmly, in the reasonable voice of an expert who has studied a serious problem. Ireland, it observes, is full of desperate families. Mothers beg in the streets with several children behind them, unable to feed them. The writer has considered the question carefully, he says, and he has a solution that will benefit everyone.

Then he explains it. The children of the poor, he suggests, should be sold at the age of one year to the wealthy, to be cooked and eaten.

The rest of the pamphlet continues in the same calm, businesslike tone. The writer calculates how many children could be sold each year. He suggests recipes. He lists the advantages: poor families would earn money, the number of hungry people would fall, and the landlords, who had already devoured most of the parents, would seem to have the best claim to the children. He even claims, with mock modesty, that he has nothing to gain himself, since his own children are too old to be sold.

Some early readers were shocked, and a few may have taken it seriously. But most understood at once that Swift was not proposing anything of the kind. He was writing satire. By presenting a monstrous idea in the cool language of economic planning, he forced readers to see how the rich and powerful were already treating the poor of Ireland: as goods to be used, not as human beings. English landlords took rents from Irish farms while the farmers' families starved. Laws favored English trade over Irish. Swift's horrifying proposal was only a slight exaggeration of what was already happening.

The power of the pamphlet comes from its incongruity, the gap between the gentle, sensible voice and the horror of what it says. Near the end, the writer lists a series of real reforms that might help Ireland, such as taxing absent landlords and buying Irish goods, and then dismisses them as impossible because no one will ever adopt them. In that moment, Swift's anger at the complacent rulers of his country shows through.

Nearly three hundred years later, "a modest proposal" is still used to describe a shocking suggestion made to expose a real injustice.`,
      [satireWords, follyWords, satire],
      [
        ask(
          t("Why does the pamphlet use a calm, reasonable voice?", "这本小册子为什么用平静而理性的口吻？"),
          t(
            "The gap between the calm voice and the horror makes the injustice stand out",
            "平静的口吻与恐怖内容之间的反差使不公显得格外突出",
          ),
          [
            t("Swift really believed his plan would work", "斯威夫特真的相信他的计划会奏效"),
            t("Pamphlets in Dublin were not allowed to show anger", "都柏林的小册子不允许表达愤怒"),
            t("He wanted readers to fall asleep before the end", "他想让读者在读完前就睡着"),
          ],
          t(
            "The sixth paragraph says its power comes from the incongruity between the gentle voice and the horror of what it says.",
            "第六段说它的力量来自温和的口吻与所说内容的恐怖之间的不协调。",
          ),
          [
            t("Swift was not proposing anything of the kind; the plan was satire.", "斯威夫特根本没有这个意思；这个计划是讽刺。"),
            t("No rule about pamphlets is mentioned; his anger shows near the end.", "文中没提小册子的规定；他的愤怒在结尾显露出来。"),
            t("The calm voice draws readers in, the opposite of putting them to sleep.", "冷静的语气吸引读者，而不是让人睡着。"),
          ],
        ),
        ask(
          t("What real situation was Swift attacking?", "斯威夫特抨击的是什么真实情况？"),
          t("The rich treating Ireland's poor as goods rather than people", "富人把爱尔兰的穷人当作商品而不是人"),
          [
            t("A plan by doctors to feed children better", "医生让孩子吃得更好的计划"),
            t("A shortage of cooks in the city of Dublin", "都柏林厨师短缺"),
            t("The success of his own book about Gulliver", "他自己那本关于格列佛的书的成功"),
          ],
          t(
            "The fifth paragraph says he forced readers to see how the powerful were already treating the poor as goods to be used, not human beings.",
            "第五段说他迫使读者看到当权者已经把穷人当作可利用的商品，而不是人。",
          ),
          [
            t(
              "No doctors' plan is mentioned; Swift attacked landlords and unfair laws.",
              "文中没提医生的计划；斯威夫特抨击的是地主和不公的法律。",
            ),
            t("Cooks are not the subject; the recipes are part of the satire.", "厨师不是主题；食谱只是讽刺的一部分。"),
            t("Gulliver's Travels is mentioned only to say Swift was famous.", "提到《格列佛游记》只是说明斯威夫特出名。"),
          ],
        ),
        ask(
          t(
            "Why does the writer list real reforms near the end and then dismiss them?",
            "作者为什么在结尾附近列出真正的改革措施又把它们否定？",
          ),
          t("To show his anger that sensible solutions were being ignored", "以表明他对明智的解决办法被忽视的愤怒"),
          [
            t("To prove that the reforms had already worked", "为了证明这些改革已经奏效"),
            t("Because he had forgotten what he wrote earlier", "因为他忘了自己前面写的内容"),
            t("To advertise goods made in England", "为英国生产的商品做广告"),
          ],
          t(
            "He dismisses real reforms as impossible because no one will adopt them, and there his anger at complacent rulers shows through.",
            "他以没人会采纳为由把真正的改革斥为不可能，此时他对自满的统治者的愤怒显露出来。",
          ),
          [
            t("The reforms had not been tried; no one would adopt them.", "这些改革根本没实行，没人愿意采纳。"),
            t("The dismissal is deliberate, a moment where his anger shows.", "这种否定是有意的，显露出他的愤怒。"),
            t("The reforms included buying Irish goods, not English ones.", "改革中包括购买爱尔兰货，而不是英国货。"),
          ],
        ),
        ask(
          t("Where and when did the pamphlet first appear?", "这本小册子最早在何时何地出现？"),
          t("In Dublin, in 1729", "1729年，都柏林"),
          [t("In London, in 1726", "1726年，伦敦"), t("In Paris, in 1789", "1789年，巴黎"), t("In Edinburgh, in 1835", "1835年，爱丁堡")],
          t("In 1729, a short pamphlet appeared in Dublin with a long title.", "1729年，一本标题很长的小册子在都柏林出现。"),
          [
            t(
              "1726 and Gulliver's Travels came earlier; the pamphlet was Dublin, 1729.",
              "1726年出的是《格列佛游记》；这本小册子是1729年在都柏林出版的。",
            ),
            t("Paris and 1789 have nothing to do with Swift.", "巴黎和1789年与斯威夫特无关。"),
            t("Edinburgh and 1835 belong to the moon hoax story, not Swift.", "爱丁堡和1835年属于月球骗局，与斯威夫特无关。"),
          ],
        ),
      ],
      ["Dublin", "Ireland", "Ireland's", "Irish", "Jonathan", "Swift", "Swift's", "Gulliver's", "English"],
    ),
    passage(
      "the-war-over-an-egg",
      t("The War Over an Egg", "一场为鸡蛋而起的战争"),
      `In the first part of Gulliver's Travels, published by Jonathan Swift in 1726, a ship's doctor named Lemuel Gulliver is shipwrecked and wakes to find himself tied to the ground. He has washed ashore in Lilliput, a country whose people are about fifteen centimeters tall.

At first, the book reads like an adventure. Gulliver, a giant among the Lilliputians, is fed enormous meals, carried to the capital on a specially built cart and allowed to walk through the city, stepping carefully over the walls. But as he learns more about the country, it becomes clear that Swift is not really writing about tiny people. He is writing about his own country, and the joke is on the reader.

The Lilliputians are proud, quarrelsome and obsessed with small things. Their officials win high positions not by ability but by dancing on a tightrope before the emperor; whoever jumps highest without falling is given the job. Others compete by leaping over or crawling under a stick that the emperor holds. The winners receive colored threads to wear around their waists. Readers in Swift's time recognized at once a mockery of the British court, where ministers competed for favor and honors in ways that seemed equally absurd.

The most famous episode concerns eggs. Long ago, Gulliver is told, all Lilliputians broke their eggs at the larger end before eating them. But when a future emperor cut his finger doing so, his father ordered everyone to break their eggs at the smaller end. Many people refused. The quarrel led to six rebellions, cost one emperor his life and another his crown, and sent thousands of people into exile in the neighboring island of Blefuscu. Now Lilliput and Blefuscu are at war, and many thousands have died. The cause is still the question of which end of an egg should be broken.

Swift's readers understood the target. For two centuries, Europe had been torn apart by wars between Catholics and Protestants, fought partly over questions that seemed, to Swift, as trivial as the end of an egg, while the deeper beliefs they shared were forgotten. Britain and France had been fighting each other for years.

The genius of the satire is its scale. By shrinking the people, Swift shrinks their quarrels, and readers can see how small and foolish they are. Gulliver himself does not notice. He reports everything with polite seriousness. It is the reader, looking down on Lilliput as Gulliver does, who realizes that the tiny people are a reflection of us.`,
      [satireWords, follyWords, satire, academic2],
      [
        ask(
          t("What were the tightrope contests a mockery of?", "走钢丝比赛是在嘲讽什么？"),
          t("A court where ministers won favor in absurd ways rather than by ability", "一个大臣不靠能力、而靠荒唐手段赢得宠信的朝廷"),
          [
            t("Circus performers who traveled across Europe", "在欧洲各地巡演的马戏团演员"),
            t("Doctors who treated patients on ships", "在船上给病人看病的医生"),
            t("Children who played games in the street", "在街上玩游戏的孩子"),
          ],
          t(
            "The third paragraph says readers recognized a mockery of the British court, where ministers competed for favor and honors in absurd ways.",
            "第三段说读者看出这是在嘲讽英国宫廷，那里的大臣以同样荒唐的方式争宠和争荣誉。",
          ),
          [
            t("Circus performers are not the target; readers saw the British court.", "讽刺对象不是马戏演员；读者看出的是英国宫廷。"),
            t("Gulliver is a ship's doctor, but the contests mock ministers.", "格列佛是船医，但比赛讽刺的是大臣。"),
            t("Children's games are not the target; ministers' contests for favor are.", "讽刺对象不是儿童游戏，而是大臣争宠。"),
          ],
        ),
        ask(
          t("What real conflicts was the war over eggs meant to suggest?", "关于鸡蛋的战争是为了暗示哪些真实的冲突？"),
          t("Wars between Catholics and Protestants over what seemed small differences", "天主教徒和新教徒之间因看似微小的分歧而起的战争"),
          [
            t("Disputes between farmers about raising chickens", "农民之间关于养鸡的争执"),
            t("A war between Lilliput and a real island", "小人国与一座真实岛屿之间的战争"),
            t("Arguments among cooks about recipes", "厨师之间关于菜谱的争论"),
          ],
          t(
            "The fifth paragraph says Europe had been torn by wars between Catholics and Protestants over questions that seemed as trivial as the end of an egg.",
            "第五段说欧洲曾被天主教徒和新教徒之间的战争撕裂，而争论的问题在斯威夫特看来就像鸡蛋从哪头打开一样琐碎。",
          ),
          [
            t("Chickens are not the point; the quarrel mirrors religious wars.", "重点不在养鸡；这场争吵影射宗教战争。"),
            t("Blefuscu is an invented island, standing for France.", "布莱夫斯库是虚构的岛，影射法国。"),
            t("Recipes are not the point; the egg stands for religious quarrels.", "重点不在菜谱；鸡蛋代表宗教纷争。"),
          ],
        ),
        ask(
          t("How does making the people tiny help the satire?", "把人写得很小怎样有助于讽刺？"),
          t("It shrinks their quarrels too, so readers see how foolish they are", "它也缩小了他们的争吵，使读者看清这些争吵多么愚蠢"),
          [
            t("It makes the book suitable only for young children", "它使这本书只适合小孩子"),
            t("It allows Gulliver to win every war by himself", "它使格列佛能独自赢得每场战争"),
            t("It hides the fact that the book is about Britain", "它掩盖了这本书写的是英国的事实"),
          ],
          t(
            "The last paragraph says by shrinking the people, Swift shrinks their quarrels, and readers can see how small and foolish they are.",
            "最后一段说斯威夫特缩小了人，也就缩小了他们的争吵，读者便能看清这些争吵多么渺小和愚蠢。",
          ),
          [
            t("The satire is aimed at adult readers and their politics.", "这种讽刺针对的是成年读者及其政治。"),
            t(
              "Gulliver's strength is not the point; the tiny scale makes quarrels look foolish.",
              "格列佛的力量不是重点；缩小的比例让争吵显得愚蠢。",
            ),
            t("Readers recognized Britain at once; nothing was hidden.", "读者一眼就认出了英国，并无隐藏。"),
          ],
        ),
        ask(
          t("What was Lemuel Gulliver's job?", "莱缪尔·格列佛的职业是什么？"),
          t("A ship's doctor", "船医"),
          [t("A ship's captain", "船长"), t("A rope dancer", "走钢丝的人"), t("A royal minister", "王室大臣")],
          t(
            "A ship's doctor named Lemuel Gulliver is shipwrecked and wakes to find himself tied to the ground.",
            "一位名叫莱缪尔·格列佛的船医遭遇海难，醒来发现自己被绑在地上。",
          ),
          [
            t("He was not the captain; he was the ship's doctor.", "他不是船长，而是船医。"),
            t("Rope dancing is how Lilliputian officials won their jobs.", "走绳索是小人国官员求职的方式。"),
            t("Ministers belong to the Lilliputian court, not Gulliver.", "大臣属于小人国宫廷，不是格列佛。"),
          ],
        ),
      ],
      [
        "Gulliver's",
        "Gulliver",
        "Jonathan",
        "Swift",
        "Swift's",
        "Lemuel",
        "Lilliput",
        "Lilliputians",
        "Blefuscu",
        "Europe",
        "Catholics",
        "Protestants",
        "Britain",
        "France",
        "British",
      ],
    ),
    passage(
      "the-clothes-that-were-not-there",
      t("The Clothes That Were Not There", "不存在的衣服"),
      `Many people first meet satire as children, without knowing it, in a fairy tale by the Danish writer Hans Christian Andersen. Published in 1837, it tells of an emperor who cares about nothing but his clothes. He changes his outfit every hour of the day, and while other kings might be found in council, he can always be found in his dressing room.

One day, two swindlers arrive in the city. They claim to be weavers who can make the most beautiful cloth in the world. Its colors and patterns are magnificent, they say, but it has a remarkable quality: it is invisible to anyone who is unfit for his position or hopelessly stupid. The emperor is delighted. Not only will he have splendid clothes, but he will also be able to discover which of his officials are unworthy of their jobs. He pays the swindlers a fortune, and they set up two empty looms and pretend to work day and night.

The emperor sends his oldest and most trusted minister to see how the work is going. The minister stares at the empty looms and sees nothing. He is horrified. Can it be that he is stupid, or unfit for his office? He dares not admit it. So he praises the pattern and the colors, repeating the words the swindlers use. A second official does the same. Finally, the emperor himself visits the looms and sees nothing at all. Rather than confess, he declares the cloth magnificent.

On the day of a great procession, the swindlers pretend to dress the emperor in his new clothes. He walks through the streets under a canopy, while his chamberlains hold up a train that is not there. The crowds cheer and admire the clothes, because no one wants to seem stupid. Then a small child calls out, "But he has nothing on!"

The words pass from person to person until the whole crowd is shouting them. The emperor shivers, for he suspects that they are right. But he thinks, "I must go through with the procession now." And he walks on more proudly than ever, while his chamberlains carry the train that does not exist.

The story mocks more than one folly. It mocks the vanity of the emperor, the obsequious officials who tell him only what he wants to hear and the crowd that goes along with what everyone else seems to believe. Most of all, it shows how fear of looking foolish can make sensible people act foolishly. The phrase "the emperor's new clothes" is still used today for anything that everyone praises but no one honestly believes in.`,
      [follyWords, satireWords, satire],
      [
        ask(
          t("Why did the minister praise cloth he could not see?", "大臣为什么称赞他看不见的布？"),
          t("He was afraid of being thought stupid or unfit for his office", "他害怕被认为愚蠢或不称职"),
          [
            t("The swindlers had paid him to do it", "骗子付钱让他这样做"),
            t("He really could see the beautiful patterns", "他真的能看见美丽的图案"),
            t("The emperor had ordered him to lie", "皇帝命令他撒谎"),
          ],
          t(
            "The third paragraph says he wondered if he was stupid or unfit and dared not admit it, so he praised the pattern.",
            "第三段说他怀疑自己是否愚蠢或不称职，不敢承认，于是称赞那些图案。",
          ),
          [
            t("No bribe is mentioned; the minister acted out of fear.", "文中没提贿赂；大臣是出于恐惧。"),
            t("He saw nothing on the empty looms.", "他在空织布机上什么也没看到。"),
            t("The emperor sent him only to check the work, not to lie.", "皇帝只派他去查看进度，并没让他撒谎。"),
          ],
        ),
        ask(
          t("Why is it a child who speaks the truth?", "为什么说出真相的是一个孩子？"),
          t("A child does not yet fear looking foolish in front of others", "孩子还不害怕在别人面前显得愚蠢"),
          [
            t("Children are not allowed to watch processions", "孩子不被允许观看游行"),
            t("The child was one of the swindlers", "那个孩子是骗子之一"),
            t("Only children could see invisible cloth", "只有孩子能看见隐形的布"),
          ],
          t(
            "The story shows that fear of looking foolish makes people act foolishly; the child, without that fear, simply says what he sees.",
            "故事表明害怕显得愚蠢会让人做蠢事；孩子没有这种恐惧，只是说出了他看到的东西。",
          ),
          [
            t("The child is in the crowd watching the procession.", "孩子就在观看游行的人群中。"),
            t("The child is not a swindler; the swindlers are the two weavers.", "孩子不是骗子；骗子是那两个织工。"),
            t("There was no cloth for anyone to see.", "根本没有布，谁也看不见。"),
          ],
        ),
        ask(
          t("What does the emperor's decision to walk on more proudly reveal?", "皇帝决定更加骄傲地走下去，揭示了什么？"),
          t("His vanity makes him keep up the pretense even when he knows the truth", "他的虚荣让他在知道真相后仍继续伪装"),
          [
            t("He has finally learned an important lesson", "他终于学到了重要的一课"),
            t("He has decided to punish the swindlers", "他决定惩罚那些骗子"),
            t("He believes the child is wrong", "他相信那个孩子错了"),
          ],
          t(
            "He suspects the crowd is right but goes through with the procession more proudly than ever, choosing appearance over truth.",
            "他怀疑人群是对的，却比以往任何时候都更骄傲地走完游行，选择了面子而非真相。",
          ),
          [
            t("He has learned nothing; he keeps up the act.", "他什么也没学到，仍在继续演戏。"),
            t("Punishing the swindlers is never mentioned.", "文中没提惩罚骗子。"),
            t("He suspects the child is right.", "他怀疑孩子说得对。"),
          ],
        ),
        ask(
          t('Who were the two "weavers" really?', "那两个“织工”到底是什么人？"),
          t("Swindlers", "骗子"),
          [t("The emperor's ministers", "皇帝的大臣"), t("Famous artists", "著名艺术家"), t("Children from the crowd", "人群中的孩子")],
          t("Two swindlers arrive in the city and claim to be weavers.", "两个骗子来到城里，自称是织工。"),
          [
            t("The ministers were the ones fooled, not the weavers.", "大臣是被骗的人，不是织工。"),
            t("They were not real artists; they set up empty looms.", "他们不是真正的艺术家，只架起了空织布机。"),
            t("The child in the crowd exposed them, not the other way round.", "人群中的孩子揭穿了他们，而不是相反。"),
          ],
        ),
      ],
      ["Danish", "Hans", "Christian", "Andersen"],
    ),
    passage(
      "the-spaghetti-harvest",
      t("The Spaghetti Harvest", "意大利面丰收"),
      `On the evening of April 1, 1957, viewers of Panorama, one of the most respected news programs on British television, watched a short report from southern Switzerland. Over film of women in a sunny orchard picking long strands of pasta from the branches of trees and laying them out to dry, the program's presenter explained in a calm and serious voice that it had been an excellent year for the spaghetti harvest.

The report was full of convincing details. The mild winter, it said, and the disappearance of a pest called the spaghetti weevil had led to a record crop. The presenter explained that many people wondered why spaghetti always grows to the same length. This, he said, was the result of many years of patient work by plant breeders, who had finally produced the perfect spaghetti. The film ended with a family sitting down to a traditional harvest meal of freshly picked pasta.

The report lasted about three minutes. It was, of course, a joke for April Fools' Day, the idea of a cameraman who remembered a teacher teasing his class that they were so foolish they would believe spaghetti grew on trees.

What happened next surprised even the people who had made it. Hundreds of viewers telephoned the BBC. Some were angry that a serious news program had played a trick on them. But many wanted to know more. Where could they buy a spaghetti tree? How could they grow one at home? According to the BBC, staff answered some callers with a perfectly straight face, advising them to place a sprig of spaghetti in a tin of tomato sauce and hope for the best.

It is easy to laugh at the viewers who believed it. But in 1950s Britain, pasta was not a common food. Most people had eaten spaghetti only from a tin, in tomato sauce, if at all, and had no idea how it was made. The report came from a trusted program and a familiar, respected voice. And the film looked exactly like real news.

The spaghetti harvest is often described as one of the greatest hoaxes ever broadcast. It was harmless, and most people who were fooled laughed at themselves afterward. But it also showed something that is worth remembering. People tend to believe what comes from a source they trust, especially when it is delivered with confidence and about a subject they know little about. Gullible viewers were not stupid. They were trusting, and the program had earned their trust over many years.

Today, every April 1, newspapers and websites around the world publish their own invented stories. Few have been as gentle or as memorable.`,
      [follyWords, satireWords, academic1],
      [
        ask(
          t("What made the spaghetti report so convincing?", "是什么让这篇意大利面的报道如此令人信服？"),
          t("A trusted program, a serious voice and realistic details", "一个受信任的节目、严肃的口吻和逼真的细节"),
          [
            t("Photographs of spaghetti trees in British gardens", "英国花园里意大利面树的照片"),
            t("Letters from scientists who had studied pasta", "研究过意大利面的科学家的来信"),
            t("A warning at the start that it was a joke", "开头说明这是个玩笑的提示"),
          ],
          t(
            "The passage says it came from a respected program, was told in a calm and serious voice and was full of convincing details.",
            "文章说它来自一个受尊敬的节目，用平静严肃的口吻讲述，并充满令人信服的细节。",
          ),
          [
            t("The film was from Switzerland, not British gardens.", "影片拍的是瑞士，不是英国花园。"),
            t("No scientists are mentioned; the details were invented.", "文中没提科学家；细节都是编的。"),
            t("There was no warning; the report was played straight.", "没有任何预警；报道一本正经地播出。"),
          ],
        ),
        ask(
          t("What does the BBC's advice to callers show?", "英国广播公司给来电者的建议说明了什么？"),
          t("Its staff kept up the joke with a straight face", "它的工作人员一本正经地把玩笑继续下去"),
          [
            t("The BBC really did sell spaghetti trees", "英国广播公司真的在卖意大利面树"),
            t("The staff did not know the report was a hoax", "工作人员不知道那篇报道是恶作剧"),
            t("The BBC apologized to every viewer", "英国广播公司向每位观众道了歉"),
          ],
          t(
            "Staff answered with a perfectly straight face, advising people to put a sprig of spaghetti in tomato sauce and hope for the best.",
            "工作人员一本正经地回答，建议人们把一小枝意大利面放进番茄酱里，然后听天由命。",
          ),
          [
            t("The BBC sold no trees; the advice was a joke.", "BBC 并没卖树；那个建议是玩笑。"),
            t("The staff knew; they answered with a straight face.", "员工知情，只是一本正经地回答。"),
            t("Some callers were angry, but no apology is mentioned.", "有些来电者生气了，但文中没提道歉。"),
          ],
        ),
        ask(
          t("How does the writer defend the viewers who were fooled?", "作者怎样为被愚弄的观众辩护？"),
          t("They were trusting, and pasta was unfamiliar to them", "他们是出于信任，而且对意大利面并不熟悉"),
          [
            t("They had all been told the truth beforehand", "他们事先都被告知了真相"),
            t("They were paid to pretend that they believed it", "他们被付钱假装相信"),
            t("They were watching a different program", "他们在看另一个节目"),
          ],
          t(
            "The writer says pasta was not common in 1950s Britain and the gullible viewers were not stupid but trusting.",
            "作者说意大利面在20世纪50年代的英国并不常见，那些容易受骗的观众不是愚蠢，而是信任。",
          ),
          [
            t("They were fooled, so they had not been told.", "他们被骗了，说明事先并不知情。"),
            t("No payment is mentioned; they believed it honestly.", "文中没提报酬；他们是真心相信。"),
            t("They watched Panorama, the program that ran the report.", "他们看的正是播出这则报道的《全景》节目。"),
          ],
        ),
        ask(
          t("Which pest's disappearance supposedly led to a record spaghetti crop?", "据说是哪种害虫的消失带来了意大利面大丰收？"),
          t("The spaghetti weevil", "意大利面象鼻虫"),
          [t("The pasta moth", "面条蛾"), t("The tomato beetle", "番茄甲虫"), t("The noodle worm", "面条虫")],
          t(
            "The mild winter and the disappearance of a pest called the spaghetti weevil had led to a record crop.",
            "暖冬和一种叫意大利面象鼻虫的害虫消失，带来了创纪录的丰收。",
          ),
          [
            t("The pasta moth is not in the report.", "报道中没有“意面蛾”。"),
            t("The tomato beetle is not mentioned.", "文中没提“番茄甲虫”。"),
            t("The noodle worm is not mentioned; it was the spaghetti weevil.", "文中没提“面条虫”；是“意面象鼻虫”。"),
          ],
        ),
      ],
      ["Panorama", "Switzerland", "BBC", "BBC's", "Britain", "British", "Fools"],
    ),
    passage(
      "the-jester-and-the-emperor",
      t("The Jester and the Emperor", "优伶与皇帝"),
      `In the court of the First Emperor of China, the man who had united the country in 221 BC, there lived a jester named You Zhan. He was very short, and his job was to sing, joke and entertain. Yet according to the historian Sima Qian, who included him in a chapter about jesters in his great history, You Zhan sometimes did something that the emperor's ministers dared not do: he changed the emperor's mind.

The emperor was famous for his ambition and his harshness. Ministers who disagreed with him risked their lives. A jester, however, had a strange kind of freedom. Because his words were taken as jokes, he could say things that would have been dangerous coming from anyone else.

Sima Qian tells several stories. In one, the emperor proposed to enlarge his royal hunting park until it stretched for hundreds of kilometers, filling it with birds and animals. The cost to the people would have been enormous. No minister protested. You Zhan, however, praised the plan enthusiastically. "Excellent!" he said. "Fill it with plenty of animals. Then, if enemies come from the east, the deer can drive them back with their antlers."

The emperor laughed and abandoned the plan. The jester had not argued against it. He had simply carried it one step further, until its absurdity was obvious.

In another story, the emperor's son, who became the second emperor, wanted to paint the walls of the capital with lacquer, an expensive shiny coating. Again You Zhan agreed with delight. "Wonderful," he said. "Even if Your Majesty had not mentioned it, I would have begged you to do it. The people will complain about the cost, but how beautiful it will be! Enemies will slip on the shiny walls and be unable to climb them. The only problem is that lacquer must dry in a shaded room. We will need to build a house large enough to cover the whole city." The emperor laughed, and the project was dropped.

Courts in many parts of the world had similar figures. In medieval Europe, the court fool was sometimes allowed to mock kings and lords in ways that would have been punished in other people. Some modern writers have compared these jesters to satirists and comedians today, who use humor to criticize the powerful.

You Zhan's method was simple but brilliant. Instead of saying that the emperor was wrong, he pretended to agree and let the emperor see the folly for himself. A ruler who could not be told the truth directly could still be made to laugh at it.`,
      [satireWords, follyWords, satire, academic1, academic3],
      [
        ask(
          t("Why could a jester say things that ministers dared not say?", "为什么优伶敢说大臣们不敢说的话？"),
          t("His words were taken as jokes, which gave him a kind of freedom", "他的话被当作玩笑，这给了他一种自由"),
          [
            t("He was the emperor's oldest and closest relative", "他是皇帝最年长、最亲近的亲戚"),
            t("Ministers were not allowed to speak at court", "大臣不被允许在朝廷上发言"),
            t("The emperor never listened to anyone else", "皇帝从不听别人的话"),
          ],
          t(
            "The second paragraph says because a jester's words were taken as jokes, he could say things that would have been dangerous from anyone else.",
            "第二段说因为优伶的话被当作玩笑，他能说出别人说了会有危险的话。",
          ),
          [
            t("He was a jester, not a relative.", "他是弄臣，不是亲戚。"),
            t("Ministers spoke but dared not disagree.", "大臣可以说话，只是不敢反对。"),
            t("The emperor listened to You Zhan, so he did listen to someone.", "皇帝听了优旃的话，并非谁都不听。"),
          ],
        ),
        ask(
          t("How did You Zhan argue against the hunting park?", "优旃是怎样反对扩建猎苑的？"),
          t("He pretended to praise it and pushed it until it became absurd", "他假装称赞，并把它推到荒唐的地步"),
          [
            t("He wrote a long letter listing its costs", "他写了一封长信列出其代价"),
            t("He asked the people to protest against it", "他让百姓起来反对"),
            t("He refused to entertain the emperor until it was dropped", "他拒绝为皇帝表演，直到计划被取消"),
          ],
          t(
            "The fourth paragraph says he did not argue against it but carried it one step further until its absurdity was obvious.",
            "第四段说他并没有反驳，而是把它再往前推了一步，直到其荒唐显而易见。",
          ),
          [
            t("He did not argue; he praised the plan.", "他没有反驳，而是夸赞这个计划。"),
            t("The people did not protest, and he asked no one to.", "百姓没有抗议，他也没叫人抗议。"),
            t("He kept entertaining; his joke itself changed the plan.", "他照常逗乐；正是笑话本身改变了计划。"),
          ],
        ),
        ask(
          t("What does the joke about building a house over the city mock?", "关于在全城上方盖房子的玩笑嘲讽了什么？"),
          t("The enormous and pointless cost of the lacquer plan", "漆城计划巨大而毫无意义的花费"),
          [
            t("The shortness of the jester himself", "优伶本人的矮小"),
            t("The skill of the builders of the capital", "都城建造者的技艺"),
            t("The emperor's love of hunting animals", "皇帝对打猎的热爱"),
          ],
          t(
            "By pointing out that drying the lacquer would need a building over the whole city, he made the plan's cost and folly impossible to ignore.",
            "他指出晾干漆需要一座罩住全城的房子，使这个计划的代价和愚蠢无法被忽视。",
          ),
          [
            t("His height is not part of this joke.", "他的身高与这个笑话无关。"),
            t("The builders are not mocked; the cost is.", "被讽刺的不是工匠，而是花费。"),
            t("Hunting belongs to the first story, about the park.", "打猎属于第一个关于园囿的故事。"),
          ],
        ),
        ask(
          t("What was You Zhan like in appearance?", "优旃的外表是什么样的？"),
          t("He was very short", "他个子很矮"),
          [t("He was very tall", "他个子很高"), t("He was very old", "他年纪很大"), t("He wore a famous mask", "他戴着著名的面具")],
          t("There lived a jester named You Zhan. He was very short.", "有一个名叫优旃的俳优，他个子很矮。"),
          [
            t("He was very short, not tall.", "他很矮，不是高。"),
            t("His age is never mentioned.", "文中没提他的年龄。"),
            t("No mask is mentioned.", "文中没提面具。"),
          ],
        ),
      ],
      ["China", "BC", "You", "Zhan", "Zhan's", "Sima", "Qian", "Majesty", "Europe"],
    ),
    passage(
      "the-dictator-on-the-screen",
      t("The Dictator on the Screen", "银幕上的独裁者"),
      `By the late 1930s, Charlie Chaplin was perhaps the most famous film star in the world. His character, the Little Tramp, with his small mustache, bowler hat, cane and baggy trousers, had made audiences laugh in dozens of silent films. Some people noticed that another famous man of the time wore a very similar mustache: Adolf Hitler, the dictator of Germany.

Chaplin decided to use the resemblance. In 1938 he began work on a film called The Great Dictator, in which he would play two roles. One was a poor Jewish barber who returns from the First World War with memory loss. The other was Adenoid Hynkel, the ruler of a country called Tomainia, an obvious lampoon of Hitler.

It was a dangerous project. Hitler's government was persecuting Jewish people and threatening its neighbors. Many people in Hollywood and in the British government worried that the film would cause political problems. Some advised Chaplin to abandon it. He refused, and he paid for much of it with his own money.

In the film, Hynkel is a pompous, ridiculous figure. He gives furious speeches in a nonsense language that sounds like German, so full of shouting that the microphones bend away from him. In the most famous scene, alone in his office, he dances with a giant balloon globe of the world, tossing it gently into the air with his feet and his head, dreaming of ruling it all, until it bursts in his hands. Another scene shows Hynkel and the ruler of a neighboring country, a parody of the Italian dictator Mussolini, competing to sit higher than each other by raising their barber chairs.

Chaplin's comedy made the dictators look small and absurd. But the film ends very differently. Through a case of mistaken identity, the barber is taken for Hynkel and must give a speech to a huge crowd. Instead of a comic speech, Chaplin looks directly at the camera and speaks in his own voice about kindness, freedom and the dangers of hatred. Some critics thought the speech was too serious for a comedy. Others found it deeply moving.

The film was released in 1940 and was a great success. Years later, after the full horror of the Nazi death camps became known, Chaplin wrote that if he had known the truth, he could not have made fun of the Nazis' madness. His remark raises a question that satirists still face: are there some evils too terrible to laugh at, or is ridicule one of the few weapons that ordinary people have against tyrants?`,
      [satireWords, follyWords, satire, academic2],
      [
        ask(
          t("Why was making The Great Dictator dangerous?", "为什么拍《大独裁者》很危险？"),
          t("Hitler was powerful and threatening, and many feared political trouble", "希特勒有权有势、咄咄逼人，许多人担心惹上政治麻烦"),
          [
            t("Chaplin had never made a film before", "卓别林以前从未拍过电影"),
            t("Silent films had been banned in America", "无声电影在美国被禁止了"),
            t("The giant balloon globe could have exploded", "巨大的地球仪气球可能会爆炸"),
          ],
          t(
            "The third paragraph says Hitler's government was persecuting Jewish people and threatening its neighbors, and many worried about political problems.",
            "第三段说希特勒政府迫害犹太人并威胁邻国，许多人担心会引发政治问题。",
          ),
          [
            t("Chaplin had made dozens of films.", "卓别林已经拍过几十部电影。"),
            t("Silent films were not banned; he had made many.", "默片并没被禁，他拍过很多。"),
            t("The balloon bursting is a scene, not a danger in making the film.", "气球爆裂是电影情节，不是拍摄的危险。"),
          ],
        ),
        ask(
          t("What does the scene with the balloon globe suggest about Hynkel?", "地球仪气球那场戏暗示了海因克尔怎样？"),
          t("His dream of ruling the world is both foolish and fragile", "他统治世界的梦想既愚蠢又脆弱"),
          [
            t("He is a skilled athlete who loves games", "他是一位热爱游戏的熟练运动员"),
            t("He wants to protect the earth from harm", "他想保护地球免受伤害"),
            t("He is afraid of balloons and globes", "他害怕气球和地球仪"),
          ],
          t(
            "He dances with the globe, dreaming of ruling it all, until it bursts in his hands, which shows how foolish and fragile his ambition is.",
            "他抱着地球仪跳舞，梦想统治整个世界，直到它在他手中破裂，显示出他的野心多么愚蠢和脆弱。",
          ),
          [
            t("It is about ambition, not sport.", "它讲的是野心，不是运动。"),
            t("He dreams of ruling the world, not protecting it.", "他梦想统治世界，不是保护它。"),
            t("He plays with the globe lovingly, not fearfully.", "他痴迷地玩着地球仪，并不害怕。"),
          ],
        ),
        ask(
          t("What question does Chaplin's later remark raise?", "卓别林后来的话提出了什么问题？"),
          t("Whether some evils are too terrible to be mocked", "某些罪恶是否可怕到不能被嘲笑"),
          [
            t("Whether comedies should be longer than dramas", "喜剧是否应该比正剧长"),
            t("Whether barbers make good political leaders", "理发师能否成为好的政治领袖"),
            t("Whether audiences prefer silent films", "观众是否更喜欢无声电影"),
          ],
          t(
            "He wrote that had he known the truth he could not have made fun of the Nazis, which raises whether some evils are too terrible to laugh at.",
            "他写道，如果当时知道真相，他就不可能嘲笑纳粹，这引出了某些罪恶是否可怕到不能被嘲笑的问题。",
          ),
          [
            t("Film length is never discussed.", "文中从未讨论电影长短。"),
            t("The barber's speech is a plot point, not the question.", "理发师的演讲是情节，不是那个问题。"),
            t("Silent films are not the question raised.", "提出的问题与默片无关。"),
          ],
        ),
        ask(
          t("Which two roles did Chaplin play in The Great Dictator?", "卓别林在《大独裁者》中扮演哪两个角色？"),
          t("A poor Jewish barber and the dictator Hynkel", "一个贫穷的犹太理发师和独裁者欣克尔"),
          [
            t("The Little Tramp and a soldier", "小流浪汉和一个士兵"),
            t("Hitler and a British minister", "希特勒和一位英国大臣"),
            t("A banker and a policeman", "一个银行家和一个警察"),
          ],
          t(
            "He would play two roles: a poor Jewish barber, and the dictator Hynkel.",
            "他扮演两个角色：一个贫穷的犹太理发师和独裁者欣克尔。",
          ),
          [
            t("The Little Tramp is his older character, not a role in this film.", "流浪汉是他以前的角色，不在这部片里。"),
            t(
              "He played a lampoon of Hitler, not Hitler himself, and no British minister.",
              "他演的是讽刺希特勒的角色，不是希特勒本人，也没有英国大臣。",
            ),
            t("No banker or policeman is mentioned.", "文中没提银行家或警察。"),
          ],
        ),
      ],
      [
        "Charlie",
        "Chaplin",
        "Chaplin's",
        "Tramp",
        "Adolf",
        "Hitler",
        "Hitler's",
        "Germany",
        "German",
        "Jewish",
        "Adenoid",
        "Hynkel",
        "Tomainia",
        "Hollywood",
        "British",
        "Italian",
        "Mussolini",
        "Nazi",
        "Nazis",
        "America",
      ],
    ),
    passage(
      "the-pictures-that-beat-a-boss",
      t("The Pictures That Beat a Boss", "击败一个大佬的漫画"),
      `In the 1860s, the most powerful man in New York City was not the mayor. It was William Tweed, known as Boss Tweed, the leader of a political organization called Tammany Hall. Tweed and his friends controlled elections, judges and the city's money. Through false bills and inflated contracts, they stole enormous sums from the public. One courthouse, which should have cost a fraction of the price, ended up costing the city more than it had paid for Alaska. A carpenter was paid hundreds of thousands of dollars for a month's work, and the city bought thermometers at prices that would have been absurd for gold.

Newspapers reported some of this, but Tweed was not worried. Many of his supporters were poor immigrants who could not read English well. A newspaper article, however critical, did not reach them.

A cartoonist named Thomas Nast changed that. Nast worked for Harper's Weekly, a popular magazine. Beginning around 1869, he drew cartoon after cartoon attacking Tweed. He showed him as a fat man with a huge diamond pin, his head replaced by a bag of money. He drew Tweed and his friends standing in a circle, each pointing to the man on his right, under the title "Who stole the people's money?" He drew a tiger, the symbol of Tammany Hall, tearing apart a woman who represented the republic, while Tweed watched like an emperor at a Roman arena.

The cartoons were caustic, simple and devastating. They required no reading at all. Anyone could look at them and understand what they meant.

Tweed is reported to have complained that he did not care what the newspapers wrote, because his voters could not read, but that they could see the pictures. His friends tried to bribe Nast to stop, reportedly offering him a fortune to go to Europe to study art. Nast refused.

In 1871, a newspaper published secret financial records that proved the scale of the theft. Tweed was arrested and tried. He was convicted, escaped from custody and fled to Spain disguised as a sailor. There, according to the famous story, Spanish officials recognized him from one of Nast's cartoons and sent him back. He died in a New York jail in 1878.

Nast went on to create many images that Americans still know, including the elephant as a symbol of the Republican Party. But his campaign against Tweed remains his most famous achievement. It showed that ridicule, aimed carefully at a real wrong, can sometimes do what serious argument cannot.`,
      [satireWords, follyWords, satire, academic3],
      [
        ask(
          t("Why was Tweed not worried by newspaper articles?", "特威德为什么不担心报纸上的文章？"),
          t("Many of his supporters could not read English well", "他的许多支持者英语读得不好"),
          [
            t("He owned every newspaper in the city", "他拥有城里所有的报纸"),
            t("The articles praised him and his friends", "那些文章赞扬他和他的朋友"),
            t("Newspapers were banned in New York at the time", "当时纽约禁止出版报纸"),
          ],
          t(
            "The second paragraph says many of his supporters were poor immigrants who could not read English well, so articles did not reach them.",
            "第二段说他的许多支持者是英语不好的贫穷移民，文章影响不到他们。",
          ),
          [
            t("Newspapers did report on him; he did not own them all.", "报纸确实报道了他，他并不拥有全部报纸。"),
            t("The articles were critical, not praise.", "文章是批评性的，不是赞扬。"),
            t("Newspapers were published freely.", "报纸是自由出版的。"),
          ],
        ),
        ask(
          t("What made Nast's cartoons so effective?", "是什么让纳斯特的漫画如此有效？"),
          t("Anyone could understand them without reading", "任何人不用读文字就能看懂"),
          [
            t("They were printed in many different languages", "它们用多种语言印刷"),
            t("They were drawn in bright, expensive colors", "它们用明亮昂贵的颜色画成"),
            t("They were approved by Tweed before printing", "它们在印刷前经过特威德批准"),
          ],
          t(
            "The fourth paragraph says the cartoons required no reading at all; anyone could look at them and understand.",
            "第四段说这些漫画根本不需要阅读，任何人看了都能明白。",
          ),
          [
            t("Language did not matter; the pictures needed no words.", "语言不重要；图画不需要文字。"),
            t("Color is never mentioned; simplicity was the strength.", "文中没提颜色；简洁才是长处。"),
            t("Tweed tried to bribe Nast to stop, the opposite of approving.", "特威德想贿赂纳斯特停笔，谈不上批准。"),
          ],
        ),
        ask(
          t("What does the cartoon of men pointing to the man on their right suggest?", "那幅人人指向右边之人的漫画暗示了什么？"),
          t("Every one of them was guilty, and each tried to blame another", "他们每个人都有罪，却都想把责任推给别人"),
          [
            t("None of them knew where the money had gone", "他们谁也不知道钱去了哪里"),
            t("They were all helping to catch the thief", "他们都在帮忙抓小偷"),
            t("They were planning a dance at Tammany Hall", "他们在计划在坦慕尼协会跳舞"),
          ],
          t(
            'Under the title "Who stole the people\'s money?", each man points to another, mocking a group in which all are guilty and each shifts the blame.',
            '在"谁偷了人民的钱？"这个标题下，每个人都指着别人，嘲讽一群人人有罪又互相推诿的人。',
          ),
          [
            t("They knew; each pointed to blame someone else.", "他们都知道；每人都指着别人推卸责任。"),
            t("They were the thieves, not catching one.", "他们就是贼，不是在抓贼。"),
            t("No dance is mentioned; the circle is about blame.", "文中没提舞会；围成一圈是在互相推诿。"),
          ],
        ),
      ],
      [
        "William",
        "Tweed",
        "Boss",
        "Tammany",
        "Hall",
        "Alaska",
        "English",
        "Thomas",
        "Nast",
        "Nast's",
        "Harper's",
        "Weekly",
        "Roman",
        "Europe",
        "Spain",
        "Spanish",
        "Americans",
        "Republican",
        "Party",
      ],
    ),
    passage(
      "the-ribbon-at-the-end-of-the-road",
      t("The Ribbon at the End of the Road", "路尽头的彩带"),
      `The new bridge over the Little Ash River was finished on a Tuesday, and the mayor of Dunmere decided that it deserved the greatest ceremony in the history of the town.

It was a fine bridge. It was made of white stone and had four lamps shaped like swans, and it had cost more than the town spent on its schools in three years. Its only weakness was that it did not lead anywhere. The road on the far side, which was supposed to connect Dunmere to the motorway, had never been built, because the money had run out while the swans were being carved. The bridge ended at a field, where a farmer's cows looked at it with mild curiosity.

None of this troubled the mayor, Mr. Percival Blane, a large man with a voice that could fill a cathedral. "A bridge," he told the council, "is not merely a means of crossing a river. It is a symbol of our ambition. It shows the world that Dunmere looks forward."

"Toward the cows," murmured a councillor at the back. Nobody laughed. The councillors who laughed at Mr. Blane did not tend to remain councillors for long.

Preparations took a month. A band was hired. A platform was built at the near end of the bridge for the speeches, and a second, smaller platform at the far end for the photographs. A ribbon of purple silk, six meters long, was stretched across the middle. The local newspaper, whose editor was the mayor's brother-in-law, printed a special edition describing the bridge as "a triumph of vision."

On the day itself, the mayor spoke for fifty minutes. He thanked the architects, the engineers, the stonemasons, the council and himself, the last of these several times. He compared the bridge to the great bridges of London and Paris, and he hinted that the swans might one day become famous across Europe. His deputy, standing beside him, nodded at every sentence, and applauded at the end of each paragraph, sometimes before it had ended.

Then the mayor cut the ribbon with a large pair of golden scissors, and the band played, and the crowd, who had been promised free sandwiches, cheered. Mr. Blane walked proudly across the bridge, followed by the council, the band and the photographer, until the whole procession arrived at the far end and stood in the field.

There was a short pause. A cow came over to investigate the golden scissors.

"Next year," the mayor announced, with no sign of embarrassment, "we shall build the road."

Everyone applauded. It was, the newspaper said the next morning, a historic day.`,
      [follyWords, satireWords, satire, academic1],
      [
        ask(
          t("What is the main folly the story mocks?", "这个故事主要嘲讽的是什么愚蠢行为？"),
          t("A pompous official celebrating a costly project that serves no purpose", "一位自负的官员庆祝一个花费巨大却毫无用处的工程"),
          [
            t("Farmers who let their cows wander onto bridges", "让牛闲逛到桥上的农民"),
            t("Bands that play too loudly at ceremonies", "在典礼上演奏太响的乐队"),
            t("Towns that do not spend enough on bridges", "在桥梁上花钱不够的城镇"),
          ],
          t(
            "The bridge cost more than three years of school spending and leads only to a field, yet the mayor celebrates it as a symbol of ambition.",
            "这座桥的花费超过学校三年的开支，却只通向一片田地，而市长仍把它当作雄心的象征来庆祝。",
          ),
          [
            t("The cows are innocent bystanders.", "奶牛只是无辜的旁观者。"),
            t("The band is part of the scene, not its target.", "乐队只是场景的一部分，不是讽刺对象。"),
            t("The bridge cost a fortune, more than three years of school spending.", "这座桥花费巨大，超过三年的学校开支。"),
          ],
        ),
        ask(
          t("Which detail shows the deputy is a sycophant?", "哪个细节表明副手是个阿谀奉承者？"),
          t("He nods at every sentence and applauds before paragraphs end", "他每句话都点头，段落还没讲完就鼓掌"),
          [
            t("He murmurs that the bridge leads toward the cows", "他低声说桥通向奶牛"),
            t("He writes for the local newspaper", "他为当地报纸撰稿"),
            t("He carves the lamps shaped like swans", "他雕刻了天鹅形状的灯"),
          ],
          t(
            "The deputy nodded at every sentence and applauded at the end of each paragraph, sometimes before it had ended, flattering the mayor without thought.",
            "副手对每句话都点头，每段结束都鼓掌，有时段落还没讲完就鼓掌，不假思索地奉承市长。",
          ),
          [
            t("The murmur about cows came from a councillor at the back.", "关于奶牛的嘀咕来自后排的一位议员。"),
            t("The newspaper editor is the mayor's brother-in-law.", "报纸编辑是市长的妹夫。"),
            t("Stonemasons carved the swans, not the deputy.", "天鹅是石匠雕的，不是副手。"),
          ],
        ),
        ask(
          t(
            'Why does the narrator say "It was, the newspaper said the next morning, a historic day"?',
            '叙述者为什么说"第二天早上报纸说，那是历史性的一天"？',
          ),
          t("It is ironic, since the newspaper's praise is as empty as the bridge", "这是反讽，因为报纸的赞扬和那座桥一样空洞"),
          [
            t("The ceremony really was the most important in history", "那场典礼确实是历史上最重要的"),
            t("The road was built the next day", "第二天路就修好了"),
            t("The newspaper wanted to criticize the mayor", "报纸想批评市长"),
          ],
          t(
            "The paper is run by the mayor's brother-in-law and praises an empty ceremony, so its words are ironic and mock the town's complacency.",
            "这家报纸由市长的妹夫经营，赞扬一场空洞的典礼，所以这句话是反讽，嘲讽了小镇的自满。",
          ),
          [
            t("The bridge led to a field; nothing about the day was historic.", "桥通向一片田野，这一天毫无历史意义。"),
            t("The mayor only promised the road for next year.", "市长只说明年再修路。"),
            t("The editor is the mayor's brother-in-law and praises him.", "编辑是市长的妹夫，是在吹捧他。"),
          ],
        ),
      ],
      ["Ash", "Dunmere", "Percival", "Blane", "London", "Paris", "Europe"],
    ),
  ],
};
