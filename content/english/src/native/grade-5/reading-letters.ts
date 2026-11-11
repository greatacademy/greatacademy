// Grade 5: the reading unit of the tenth theme, letters and diaries from the past: invented writers of other times
// telling of their days in their own words.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const letterWords = { topic: "words-of-letters-and-diaries", weight: 0.3 } as const;
const pastWords = { topic: "words-of-life-long-ago", weight: 0.3 } as const;
const memoryWords = { topic: "words-for-memory-and-history", weight: 0.3 } as const;
const longingWords = { topic: "words-for-longing-and-affection", weight: 0.3 } as const;
const diaries = { topic: "reading-diaries-and-letters", weight: 0.2 } as const;
const accounts = { topic: "multiple-accounts-of-one-event", weight: 0.2 } as const;
const history = { topic: "connecting-events-in-history", weight: 0.2 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** lettersAndDiariesFromThePast is a reading unit of grade 5 of invented letters, logs and diaries of other times. */
export const lettersAndDiariesFromThePast: ReadingUnitDef = {
  id: "letters-and-diaries-from-the-past",
  title: t("Letters and Diaries from the Past", "往昔的书信与日记"),
  passages: [
    passage(
      "a-letter-from-the-canal-boat",
      t("A Letter from the Canal Boat", "运河船上的来信"),
      `June 14, 1835

Dear Grandmother,

I am writing to you from the deck of the canal boat Morning Star, with the paper on my knee, so please forgive the wobbly letters.

We left Albany four days ago. The boat is long and narrow, and it has no sails or engine. Instead, two mules walk along a path beside the canal, pulling the boat with a rope. My cousin Will walks with them and leads them. When he gets tired, I take a turn.

We move about as fast as a person walks, so the journey to Buffalo will take more than a week. Father says that before the canal was dug, the same trip took a month by wagon and cost far more.

The best part is the locks. When the land rises, the boat floats into a stone box with gates at each end. The gates close, water pours in, and the boat rises like a cork until it is level with the canal ahead.

The worst part is the low bridges. Whenever the captain shouts "Low bridge!" everyone on the roof must drop flat or be knocked off.

I miss you and your apple cake terribly. I will write again from Buffalo.

Your loving grandson,
Thomas`,
      [letterWords, pastWords],
      [
        ask(
          t("How did the canal boat move?", "运河船是怎样前进的？"),
          t("Mules on a path beside the canal pulled it", "运河边小路上的骡子拉着它"),
          [
            t("The wind filled its large sails", "风吹满了它的大帆"),
            t("An engine turned a wheel at the back", "发动机带动船尾的轮子"),
            t("The passengers rowed it with oars", "乘客们用桨划船"),
          ],
          t(
            "Thomas writes that the boat has no sails or engine; two mules walk beside the canal pulling it with a rope.",
            "托马斯写道，船没有帆也没有发动机；两头骡子在运河边用绳子拉着它走。",
          ),
        ),
        ask(
          t("According to Father, how did the canal change the journey?", "据父亲说，运河怎样改变了这段旅程？"),
          t("It made the trip much shorter and cheaper than by wagon", "它让旅程比坐马车短得多、便宜得多"),
          [
            t("It made the trip longer but more fun", "它让旅程更长，但更有趣"),
            t("It made the trip possible only in winter", "它让旅程只能在冬天进行"),
            t("It made the trip faster than walking", "它让旅程比步行还快"),
          ],
          t(
            "Father says the trip took a month by wagon and cost far more; now it takes about a week. The boat moves only as fast as walking.",
            "父亲说，坐马车要走一个月，花费也多得多；现在大约只要一周。船的速度和步行差不多。",
          ),
        ),
        ask(
          t("What feeling does Thomas show at the end of his letter?", "托马斯在信的结尾流露出什么感情？"),
          t("He misses his grandmother", "他想念祖母"),
          [
            t("He is angry about the low bridges", "他对低矮的桥很生气"),
            t("He is bored with the journey", "他对旅程感到厌烦"),
            t("He is afraid of the locks", "他害怕船闸"),
          ],
          t(
            'He writes "I miss you and your apple cake terribly" and signs "Your loving grandson."',
            '他写道 "I miss you and your apple cake terribly"，并署名 "Your loving grandson"。',
          ),
        ),
      ],
    ),
    passage(
      "the-lighthouse-keepers-log",
      t("The Lighthouse Keeper's Log", "灯塔看守人的日志"),
      `From the log of the North Point Light, kept by Hannah Gray

October 3, 1871. Clear and calm. Lit the lamp at 5:40 in the evening. Trimmed the wicks at midnight and again at four. Two fishing boats passed safely.

October 4. Wind rising from the east. Cleaned the soot from the glass all morning, as Father taught me, so the light would shine its farthest. Since Father fell ill, I keep the light alone. He watches from his bed and asks every hour whether the lamp is burning.

October 5. A great storm. Waves broke over the rocks below the tower, and spray struck the windows forty feet above the sea. I climbed the stairs nine times in the night to keep the lamp trimmed and the oil filled. At three in the morning, I saw lights out on the water, a ship driven toward the rocks. I rang the fog bell until my arms ached. The ship turned away just in time.

October 6. The storm has passed. The captain of the schooner Lark rowed ashore to thank us. He said that without the light and the bell, his ship and its eleven men would have been lost. Father cried when I told him.

Lit the lamp at 5:35.`,
      [letterWords, diaries],
      [
        ask(
          t("Why does Hannah keep the light alone?", "汉娜为什么独自看守灯塔？"),
          t("Her father has fallen ill", "她的父亲病倒了"),
          [
            t("Her father has gone to sea", "她的父亲出海了"),
            t("No one else knows where it is", "没有别人知道它在哪里"),
            t("The captain asked her to", "船长请她这样做"),
          ],
          t(
            "The entry for October 4 says that since Father fell ill, she keeps the light alone while he watches from his bed.",
            "10 月 4 日的日志说，自从父亲病倒，她就独自看守灯塔，父亲在床上看着。",
          ),
        ),
        ask(
          t("What did Hannah do when she saw a ship being driven toward the rocks?", "汉娜看到一艘船被推向礁石时做了什么？"),
          t("She rang the fog bell until her arms ached", "她一直敲雾钟，敲到手臂发酸"),
          [
            t("She rowed out to warn the captain", "她划船出去警告船长"),
            t("She put out the lamp to save oil", "她熄灭了灯以节省油"),
            t("She woke her father to help her", "她叫醒父亲来帮忙"),
          ],
          t(
            "The October 5 entry says she rang the fog bell until her arms ached, and the ship turned away just in time.",
            "10 月 5 日的日志说，她一直敲雾钟，敲到手臂发酸，那艘船及时转向了。",
          ),
        ),
        ask(
          t("Why do the entries begin with the weather?", "为什么每篇日志都以天气开头？"),
          t("The weather mattered most to a lighthouse keeper's work", "天气对灯塔看守人的工作最重要"),
          [
            t("Hannah wanted to become a weather reporter", "汉娜想成为天气预报员"),
            t("Her father could not see out of his window", "她父亲看不到窗外"),
            t("It was the only thing that happened each day", "那是每天唯一发生的事"),
          ],
          t(
            "A log records work. Calm or stormy weather decided how hard the night would be and how much the light was needed, so each entry starts there.",
            "日志记录的是工作。天气是平静还是有风暴，决定了夜晚有多艰难、灯光有多重要，所以每篇都从天气写起。",
          ),
        ),
      ],
    ),
    passage(
      "dear-mama-from-the-gold-fields",
      t("Dear Mama, from the Gold Fields", "亲爱的妈妈：来自金矿的信"),
      `Sacramento, California
March 2, 1850

Dear Mama,

I have reached California at last, after five months at sea and a crossing I hope never to make again. I am well, though thinner, and I have not forgotten my promise to write.

The stories we heard at home were not quite true. Gold does not lie on the ground waiting to be picked up. The men here dig all day in the cold river, washing gravel in pans until their hands are raw, and most find only a few small flakes. Some find nothing at all.

Everything costs a fortune. An egg costs a dollar, and a pair of boots costs as much as a month of wages at home. I have learned that the people growing rich are mostly the ones who sell things to the miners.

So I have made a decision, and I hope you will not think me foolish. I have taken a job with Mr. Chen, who runs a laundry and a small store near the river. He pays me fairly and has been very kind. With what I save, I mean to open a bakery. You always said my bread was the best in our village.

Please give my love to Ana and little Luis. Tell them their sister has not found gold, but she has found her way.

Your daughter,
Isabel`,
      [longingWords, history],
      [
        ask(
          t("What does Isabel say about the stories she heard at home?", "伊莎贝尔怎样评价她在家乡听到的传闻？"),
          t("They were not quite true: gold was hard to find", "并不完全是真的：金子很难找到"),
          [
            t("They were completely true: gold was everywhere", "完全是真的：到处都是金子"),
            t("They said California had no rivers", "传闻说加利福尼亚没有河"),
            t("They were about bakeries, not gold", "传闻讲的是面包店，不是金子"),
          ],
          t(
            "She writes that the stories were not quite true: gold does not lie on the ground, and most men find only a few flakes.",
            "她写道，那些传闻并不完全属实：金子不是躺在地上的，大多数人只找到几片碎金。",
          ),
        ),
        ask(
          t("Why did Isabel decide not to dig for gold?", "伊莎贝尔为什么决定不去淘金？"),
          t("She saw that sellers, not miners, were growing rich", "她发现发财的是商人，而不是淘金者"),
          [
            t("Her mother told her to come home", "她妈妈叫她回家"),
            t("Mr. Chen would not let her", "陈先生不让她去"),
            t("She was afraid of the river", "她害怕那条河"),
          ],
          t(
            "She has learned that the people growing rich are mostly those who sell things to the miners, so she plans to open a bakery.",
            "她发现发财的多半是卖东西给淘金者的人，所以她打算开一家面包店。",
          ),
        ),
        ask(
          t('What does Isabel mean by "she has found her way"?', '伊莎贝尔说 "she has found her way" 是什么意思？'),
          t("She has found a good plan for her life", "她为自己的生活找到了好的方向"),
          [
            t("She has found the road back home", "她找到了回家的路"),
            t("She has found a map of the gold fields", "她找到了一张金矿地图"),
            t("She has found her lost sister", "她找到了失散的妹妹"),
          ],
          t(
            "She contrasts not finding gold with finding a way to succeed: a fair job now and a bakery of her own later.",
            "她把没找到金子和找到成功之路作对比：现在有份公道的工作，将来开自己的面包店。",
          ),
        ),
      ],
    ),
    passage(
      "a-diary-of-the-great-flood",
      t("A Diary of the Great Flood", "大洪水日记"),
      `The diary of Ruby Mae Carter, aged twelve, of a river town

April 20, 1927. It has rained every day this month. The river is higher than Papa has ever seen it. Men from all over town are filling sacks with sand and piling them on the levee, the long bank of earth that keeps the river out. Papa has been there two nights without sleep.

April 22. This morning the church bell rang without stopping, which means danger. The levee broke north of town. We had one hour. Mama packed the quilts, the Bible and the photographs, and we carried our chickens in a crate. Papa lifted Granny into the wagon. I looked back once. Water was already running down Main Street like a brown river.

April 25. We are living in tents on the high ground by the railroad with hundreds of other families. Food comes by train. I help Mrs. Lewis with the little children so their mothers can rest.

May 10. Papa rowed back to see the house today. He says the water reached the windows. My school is full of mud.

May 30. The water has gone down at last. Everything smells of mud, but the walls are standing. Tomorrow we begin to clean. Mama says a house can be scrubbed, but people cannot be replaced, and we are all here.`,
      [memoryWords, diaries],
      [
        ask(
          t("What is a levee, as the diary explains?", "根据日记的解释，什么是堤坝？"),
          t("A long bank of earth that keeps the river out", "挡住河水的一道长长的土堤"),
          [
            t("A tent on the high ground", "高地上的帐篷"),
            t("A bell that rings in danger", "遇到危险时敲响的钟"),
            t("A boat used to row through floods", "洪水中划行的船"),
          ],
          t(
            "The April 20 entry defines the levee as the long bank of earth that keeps the river out.",
            "4 月 20 日的日记把堤坝解释为挡住河水的一道长长的土堤。",
          ),
        ),
        ask(
          t("What did the family take when they had to leave?", "一家人不得不离开时带走了什么？"),
          t("Quilts, the Bible, photographs and the chickens", "被子、圣经、照片和鸡"),
          [
            t("Their furniture and the kitchen stove", "家具和厨房的炉子"),
            t("Nothing at all, because they had no time", "什么也没带，因为没有时间"),
            t("Sacks of sand for the levee", "堵堤坝用的沙袋"),
          ],
          t(
            "The April 22 entry lists what Mama packed: the quilts, the Bible and the photographs, and the chickens in a crate.",
            "4 月 22 日的日记列出了妈妈收拾的东西：被子、圣经和照片，还有装在板条箱里的鸡。",
          ),
        ),
        ask(
          t("What does Mama's saying at the end show?", "结尾妈妈的话说明了什么？"),
          t("The family's safety matters more than the damaged house", "家人平安比房子受损更重要"),
          [
            t("Mama wants to move to a new town", "妈妈想搬到一个新的镇子"),
            t("The house was too badly damaged to clean", "房子损坏得太厉害，没法清理"),
            t("Mama is angry at the men who built the levee", "妈妈对修堤坝的人很生气"),
          ],
          t(
            "Mama says a house can be scrubbed but people cannot be replaced, and all of them are safe.",
            "妈妈说房子可以擦洗干净，但人是无法替代的，而他们全家都平安。",
          ),
        ),
      ],
    ),
    passage(
      "letters-across-the-ocean",
      t("Letters Across the Ocean", "越洋书信"),
      `Two letters, the first from a girl who had sailed to a new country, the second from the sister she left behind.

New York, November 1, 1907

Dear Sofia,

The ship took twelve days, and I was seasick for nine of them. When we came into the harbor, everyone rushed to the rail to see the great statue holding up her torch. An old man beside me took off his hat and cried.

Now I live with Uncle Marco in two small rooms on a busy street. I work in a factory, sewing collars onto shirts, ten hours a day. It is hard, but I am saving for your ticket. Do not forget me.

Your sister, Elena

Naples, December 20, 1907

Dear Elena,

Your letter took six weeks to reach us, and Mama read it aloud so many times that the paper is soft as cloth. We were proud and also sad. The house is very quiet without your singing.

Do not work too hard for my ticket. Papa says I am needed here until the olive harvest is in. But I practice the English words you sent me every night: hello, thank you, how much?

I will come. Keep a place for me by the window.

Your sister, Sofia`,
      [longingWords, accounts],
      [
        ask(
          t("Why is Elena working ten hours a day?", "埃琳娜为什么每天工作十个小时？"),
          t("She is saving money for Sofia's ticket", "她在为索菲娅攒船票钱"),
          [
            t("She wants to buy a house on a busy street", "她想在热闹的街上买一栋房子"),
            t("Uncle Marco makes her work for him", "马可叔叔逼她为他干活"),
            t("She wants to go home to Naples", "她想回那不勒斯"),
          ],
          t('Elena writes "It is hard, but I am saving for your ticket."', '埃琳娜写道 "It is hard, but I am saving for your ticket."'),
        ),
        ask(
          t("What detail shows how much the family valued Elena's letter?", "哪个细节说明家人非常珍视埃琳娜的信？"),
          t("Mama read it so often the paper became soft", "妈妈读了很多遍，信纸都变软了"),
          [
            t("The letter took six weeks to arrive", "这封信六周才寄到"),
            t("Papa is waiting for the olive harvest", "爸爸在等橄榄收获"),
            t("Sofia practices English every night", "索菲娅每晚练习英语"),
          ],
          t(
            "Sofia writes that Mama read it aloud so many times that the paper is soft as cloth. The six weeks shows distance, not how much they valued it.",
            "索菲娅写道，妈妈大声读了很多遍，信纸软得像布。六周只说明路途遥远，并不说明他们多珍视它。",
          ),
        ),
        ask(
          t("How do the two letters show the same separation from two sides?", "两封信怎样从两方面展现了同一场分离？"),
          t("Elena tells of the new country, Sofia of the quiet home", "埃琳娜讲新国家的生活，索菲娅讲冷清的家"),
          [
            t("Both sisters describe the ship and the statue", "两姐妹都描写了轮船和雕像"),
            t("Both sisters work in the same factory", "两姐妹在同一家工厂工作"),
            t("Sofia has already arrived in New York", "索菲娅已经到了纽约"),
          ],
          t(
            "Elena writes about her new life in New York; Sofia writes about the family missing her in Naples. Each sees the separation from where she is.",
            "埃琳娜写她在纽约的新生活；索菲娅写那不勒斯的家人如何想念她。每个人都从自己所在之处看待这次分离。",
          ),
        ),
      ],
    ),
    passage(
      "a-schoolgirls-diary-1910",
      t("A Schoolgirl's Diary, 1910", "女学生日记，1910 年"),
      `From the diary of Margaret Ellis, aged eleven

Monday, September 12, 1910. School began again today. Our schoolhouse has one room and one teacher, Miss Harlow, for all twenty-three of us, from the smallest to the tallest. I sit in the fourth row with the other fifth-year pupils. We write on slates with chalk and wipe them clean with a rag, because paper is too dear to waste.

Wednesday, September 14. My turn to arrive early and light the stove. It is two miles to school, and I walk it with my brother Arthur, who is seven and complains the whole way. I carried our lunch pail: bread, cheese and two apples.

Friday, September 16. Spelling bee. I lost on the word "necessary." I will never forget how to spell it again: one c, two s's.

Tuesday, September 20. Great excitement! A man drove an automobile past the school, and Miss Harlow let us all run to the fence to watch. It was noisy and smelled of oil. Arthur says he will own one someday. Father says horses will always be better.

Thursday, September 22. Miss Harlow says that next year we may have a second room and a second teacher. I am not sure I want things to change.`,
      [pastWords, memoryWords],
      [
        ask(
          t("Why did the pupils write on slates?", "学生们为什么在石板上写字？"),
          t("Paper was too expensive to waste", "纸太贵，舍不得浪费"),
          [
            t("Miss Harlow did not know how to use paper", "哈洛老师不会用纸"),
            t("Slates were easier to carry two miles", "石板更方便走两英里路带着"),
            t("The stove would burn any paper", "炉子会把纸烧掉"),
          ],
          t(
            'Margaret writes that they use slates because "paper is too dear to waste"; here "dear" means expensive.',
            '玛格丽特写道，他们用石板是因为 "paper is too dear to waste"；这里的 "dear" 意思是昂贵。',
          ),
        ),
        ask(
          t("What does the entry about the automobile show about the time?", "关于汽车的那篇日记反映了那个时代的什么？"),
          t("Automobiles were still new and rare", "汽车当时还很新奇、很少见"),
          [
            t("Every family already had one", "每家都已经有了汽车"),
            t("Horses had disappeared from the roads", "马已经从路上消失了"),
            t("Children drove themselves to school", "孩子们自己开车上学"),
          ],
          t(
            "The whole school ran to the fence to watch one car go by, and Father still prefers horses, so automobiles were new and rare.",
            "全校都跑到篱笆边看一辆汽车经过，父亲仍然更喜欢马，可见汽车当时还很新奇、很少见。",
          ),
        ),
        ask(
          t("How does Margaret feel about the plan for a second room?", "玛格丽特对增加第二间教室的计划有什么感受？"),
          t("Unsure, because she is not sure she wants change", "犹豫不定，因为她不确定是否想要改变"),
          [
            t("Delighted, because the school is too crowded", "很高兴，因为学校太挤了"),
            t("Angry, because Miss Harlow is leaving", "很生气，因为哈洛老师要走了"),
            t("Bored, because nothing ever happens", "很无聊，因为什么事都没发生"),
          ],
          t(
            'Her last entry says "I am not sure I want things to change." Nothing says Miss Harlow is leaving.',
            '她的最后一篇日记说 "I am not sure I want things to change." 文中没有说哈洛老师要走。',
          ),
        ),
      ],
    ),
    passage(
      "a-telegram-home",
      t("A Telegram Home", "一封家电报"),
      `In 1925, sending a telegram was the fastest way to get a message across a country. A clerk tapped each letter in a code of dots and dashes along an electric wire, and at the other end another clerk wrote it down and a boy on a bicycle delivered it. Because every word cost money, people wrote as few words as possible.

This is the telegram Joseph Okeke sent from the city to his parents' village:

ARRIVED SAFE STOP FOUND WORK AT RAILWAY STOP LETTER FOLLOWS STOP LOVE JOSEPH

The word "STOP" took the place of a period. Eleven words told his parents three important things: he was safe, he had a job, and more news was coming.

The letter that followed, two weeks later, was four pages long. Joseph described the station, the steam engines and the noise of the city at night. He told them about the room he shared with two other young men from his region and about the food, which he did not like.

"The telegram," his mother said years later, "let me sleep that night. The letter let me see where my son was living."

Each kind of message did a different job.`,
      [letterWords, accounts, academic2],
      [
        ask(
          t("Why did people use as few words as possible in telegrams?", "人们为什么在电报里尽量少用字？"),
          t("Every word cost money", "每个字都要花钱"),
          [
            t("Clerks could only tap ten words a day", "报务员一天只能发十个字"),
            t("Long telegrams were against the law", "长电报是违法的"),
            t("Boys on bicycles could not carry long ones", "骑车的男孩带不了长电报"),
          ],
          t(
            "The first paragraph says that because every word cost money, people wrote as few words as possible.",
            "第一段说，因为每个字都要花钱，所以人们尽量少写字。",
          ),
        ),
        ask(
          t('What did the word "STOP" do in a telegram?', '电报里的 "STOP" 一词起什么作用？'),
          t("It took the place of a period", "它代替句号"),
          [
            t("It told the clerk to stop sending", "它告诉报务员停止发报"),
            t("It meant the sender was in danger", "它表示发报人有危险"),
            t("It asked the reader to reply at once", "它请收报人马上回复"),
          ],
          t(
            'The passage says "STOP" took the place of a period, marking the end of each short sentence.',
            '文章说 "STOP" 代替句号，标出每个短句的结尾。',
          ),
        ),
        ask(
          t("According to Joseph's mother, how were the telegram and the letter different?", "据约瑟夫的母亲说，电报和信有什么不同？"),
          t("One brought quick relief, the other a picture of his life", "一个带来及时的安心，另一个描绘了他的生活"),
          [
            t("The telegram was longer and more detailed", "电报更长、更详细"),
            t("The letter arrived first and the telegram later", "信先到，电报后到"),
            t("Neither told her anything she wanted to know", "两者都没告诉她想知道的事"),
          ],
          t(
            "She says the telegram let her sleep that night, while the letter let her see where her son was living.",
            "她说电报让她那晚睡得着，而信让她看到了儿子住在什么地方。",
          ),
        ),
      ],
    ),
    passage(
      "notes-from-a-mountain-village",
      t("Notes from a Mountain Village", "山村札记"),
      `In 1936, a young teacher named Chen Lan went to work in a village high in the mountains of Yunnan. She kept a notebook of her first year there. These are some of her notes.

September. The path to the village takes two days on foot. The children have never had a school before. Twelve came on the first day. Most had walked over an hour. We have no desks, so we sit on the floor of the old temple, and I write characters on a board with chalk I carried up the mountain.

November. The rice harvest. Half the children are absent, helping their families in the terraced fields. I do not scold them. Without the harvest, there is no food for winter. Instead, I go to the fields in the afternoons and teach numbers by counting bundles of rice.

February. Snow closed the path for three weeks. We read the same four books again and again until the children could recite them.

June. Little Ah Fu, who could not write his name in September, wrote a letter to his father, who works in the town below. He asked me to read it before he sent it. It had only two mistakes.

I have decided to stay another year.`,
      [pastWords, history],
      [
        ask(
          t("Why were half the children absent in November?", "为什么十一月有一半的孩子没来上学？"),
          t("They were helping their families with the rice harvest", "他们在帮家里收稻子"),
          [
            t("Snow had closed the mountain path", "大雪封了山路"),
            t("Chen Lan had sent them home to rest", "陈兰让他们回家休息"),
            t("The temple was being repaired", "寺庙在修缮"),
          ],
          t(
            "The November note says half the children were helping their families in the terraced fields. The snow came in February.",
            "十一月的札记说，一半的孩子在梯田里帮家里干活。大雪是二月才来的。",
          ),
        ),
        ask(
          t("How did Chen Lan respond to the absent children?", "陈兰怎样对待缺课的孩子？"),
          t("She went to the fields and taught numbers there", "她到田里去，在那里教数数"),
          [
            t("She scolded them when they returned", "他们回来时她责备了他们"),
            t("She closed the school until winter", "她把学校关到冬天"),
            t("She asked their parents to keep them home", "她请家长让孩子待在家里"),
          ],
          t(
            "She did not scold them; instead she went to the fields in the afternoons and taught numbers by counting bundles of rice.",
            "她没有责备他们，而是下午到田里去，通过数稻捆来教数字。",
          ),
        ),
        ask(
          t("Why does Chen Lan decide to stay another year?", "陈兰为什么决定再留一年？"),
          t("She sees how much the children, like Ah Fu, have learned", "她看到了像阿福这样的孩子学到了很多"),
          [
            t("The path down the mountain is closed", "下山的路被封了"),
            t("The town below has no teachers", "山下的镇上没有老师"),
            t("She has not finished reading the four books", "她还没读完那四本书"),
          ],
          t(
            "The note just before her decision tells how Ah Fu, who could not write his name, wrote a letter with only two mistakes.",
            "她作出决定前的那条札记写道，原来连名字都不会写的阿福，写了一封只有两处错误的信。",
          ),
        ),
      ],
    ),
  ],
};
