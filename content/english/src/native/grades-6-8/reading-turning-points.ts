// Grades 6 to 8: the reading unit of the sixth theme, turning points, in original short stories about growing up.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const characterWords = { topic: "words-for-character-and-motive", weight: 0.3 } as const;
const plot = { topic: "plot-and-conflict", weight: 0.2 } as const;
const theme = { topic: "theme", weight: 0.2 } as const;
const order = { topic: "foreshadowing-and-flashback", weight: 0.2 } as const;
const irony = { topic: "irony", weight: 0.2 } as const;

/** turningPoints is a reading unit of grades 6 to 8 of short stories in which a young person changes. */
export const turningPoints: ReadingUnitDef = {
  id: "turning-points",
  title: t("Turning Points", "转折点"),
  passages: [
    passage(
      "the-first-job",
      t("The First Job", "第一份工作"),
      `The sign in the window of Mr. Okafor's bakery said HELP WANTED, and Daniel had walked past it four times before he finally pushed open the door. He was thirteen, and he wanted a new bike more than anything.

"Can you get up at five?" Mr. Okafor asked, wiping flour from his hands. Daniel said he could. He had never gotten up at five in his life.

The first week was miserable. His alarm rang in the dark, and he stumbled to the bakery half asleep. He burned a tray of rolls, dropped a cake on the floor and gave a customer the wrong change. Each time, Mr. Okafor only said, "Again," and showed him once more. Daniel was sure he would be fired by Friday.

On Saturday, an old woman came in just before closing. She counted out coins for a single loaf and came up short. Daniel looked at Mr. Okafor, expecting him to send her away. Instead, the baker wrapped two loaves and a sweet roll and waved the money aside. "Next time," he said kindly.

After she left, Daniel asked why. Mr. Okafor shrugged. "A bakery is not only for selling bread," he said. "It is for feeding people."

Daniel worked at the bakery all summer. By August, he could shape rolls faster than Mr. Okafor, and he had saved enough for the bike. But when he thought about that summer years later, it was not the bike he remembered. It was the old woman, the warm loaves, and the quiet way a person could choose to be generous.`,
      [clues, characterWords, theme],
      [
        ask(
          t("Why did Daniel first want the job?", "丹尼尔最初为什么想要这份工作？"),
          t("He wanted to buy a new bike", "他想买一辆新自行车"),
          [
            t("He wanted to learn to bake", "他想学烘焙"),
            t("Mr. Okafor was his uncle", "奥卡福先生是他叔叔"),
            t("He liked getting up early", "他喜欢早起"),
          ],
          t("The first paragraph says he wanted a new bike more than anything.", "第一段说，他最想要的就是一辆新自行车。"),
        ),
        ask(
          t("What does Mr. Okafor's response to Daniel's mistakes show about him?", "奥卡福先生对丹尼尔犯错的反应说明了他是怎样的人？"),
          t("He is patient and willing to teach", "他有耐心，愿意教人"),
          [
            t("He is quick to anger", "他容易发火"),
            t("He does not notice mistakes", "他注意不到错误"),
            t("He wants Daniel to quit", "他想让丹尼尔辞职"),
          ],
          t(
            'Each time Daniel made a mistake, Mr. Okafor only said "Again" and showed him once more, which shows patience.',
            "每次丹尼尔犯错，奥卡福先生只说一句“再来”，然后再示范一遍，这表现了他的耐心。",
          ),
        ),
        ask(
          t("What is the turning point for Daniel in the story?", "故事中丹尼尔的转折点是什么？"),
          t("Seeing Mr. Okafor give bread to the old woman", "看到奥卡福先生把面包送给那位老妇人"),
          [
            t("Burning a tray of rolls", "烤焦了一盘面包卷"),
            t("Buying the bike in August", "八月买了自行车"),
            t("Walking past the sign four times", "四次从招聘启事前走过"),
          ],
          t(
            "The last paragraph says that years later, what Daniel remembered was not the bike but the old woman and the baker's generosity.",
            "最后一段说，多年以后丹尼尔记住的不是自行车，而是那位老妇人和面包师的慷慨。",
          ),
        ),
      ],
      ["Okafor's", "Okafor", "Daniel", "HELP", "WANTED", "August"],
    ),
    passage(
      "a-new-city",
      t("A New City", "新的城市"),
      `When her parents told her they were moving from a small town by the sea to a city of ten million people, Mei did not cry. She simply stopped talking to them for three days.

The new apartment was on the twenty-second floor. From the window, Mei could see a thousand other windows, but not one person she knew. At her new school, the students spoke quickly and laughed at jokes she did not understand. At lunch she sat alone and pretended to read.

Every evening she wrote long messages to her best friend back home, Lin. At first, Lin wrote back right away. Then her answers became shorter, and slower. One night Lin mentioned a beach party Mei had not been invited to, and Mei turned off her phone and lay awake, feeling as if she had disappeared.

The next morning, an old man was sitting by the elevator, struggling with a heavy bag of oranges. Mei carried it to his door. He thanked her in the dialect of her home province, and she was so surprised that she answered in it too. He laughed and invited her in for tea. He had moved to the city forty years ago, he told her, and for the first year he had hated every street.

"What changed?" Mei asked.

He thought for a moment. "I stopped waiting for the city to become my old town," he said. "I let it be something new."

That afternoon, when a girl in her class asked about the strange word on her notebook, Mei did not shrug. She explained.`,
      [clues, characterWords, theme],
      [
        ask(
          t("How did Mei first react to the news of the move?", "梅最初对搬家的消息有什么反应？"),
          t("She stopped talking to her parents for three days", "她三天没和父母说话"),
          [
            t("She cried all night", "她哭了一整夜"),
            t("She was excited about the city", "她对这座城市感到兴奋"),
            t("She asked to live with Lin", "她要求和林住在一起"),
          ],
          t(
            "The first paragraph says she did not cry but stopped talking to them for three days.",
            "第一段说，她没有哭，而是三天没和他们说话。",
          ),
        ),
        ask(
          t('Why does Mei feel "as if she had disappeared"?', "为什么梅觉得自己“好像消失了”？"),
          t("Her old friend seems to be moving on without her", "她的老朋友似乎正在把她抛在身后"),
          [
            t("She is lost in the city", "她在城里迷路了"),
            t("Her phone has stopped working", "她的手机坏了"),
            t("Her parents have forgotten her", "她父母忘了她"),
          ],
          t(
            "Lin's answers grow shorter, and she mentions a party Mei was not invited to, so Mei feels left out of her old life too.",
            "林的回复越来越短，还提到一个没邀请梅的聚会，所以梅觉得自己连过去的生活也被排除在外了。",
          ),
        ),
        ask(
          t("Which statement best expresses the theme of the story?", "哪一句最能表达这个故事的主题？"),
          t("A new place can become home when you stop wishing it were the old one", "当你不再希望新地方变成旧地方时，它就能成为你的家"),
          [
            t("A girl moves to a big city", "一个女孩搬到了大城市"),
            t("Moving", "搬家"),
            t("Old friends are always the best friends", "老朋友永远是最好的朋友"),
          ],
          t(
            "The old man's advice, to let the city be something new, changes Mei, and she begins to open up. The other choices are a plot summary, a topic, or an idea the story does not show.",
            "老人的建议——让这座城市成为新的东西——改变了梅，她开始敞开心扉。其他选项分别是情节概述、话题，或故事没有表现的观点。",
          ),
        ),
      ],
      ["Mei", "Lin"],
    ),
    passage(
      "the-lost-friendship",
      t("The Empty Seat", "空座位"),
      `Ever since first grade, Omar and Theo had sat together on the bus. They shared headphones, traded snacks and argued about which superhero would win in a fight. So when Theo got on the bus on the first day of seventh grade and walked right past Omar to sit with the boys from the basketball team, Omar told himself it was an accident.

It was not. The next day, Theo sat with them again. When Omar waved, Theo gave a quick nod, the kind you give someone you barely know, and turned back to his new friends. Omar heard them laughing and felt his face grow hot.

For weeks, Omar was resentful. He imagined saying cruel things to Theo. He stopped wearing the jacket they had both bought at the same store. At night he lay awake replaying every conversation, trying to find the moment when he had done something wrong.

Then, one afternoon, his grandmother found him sulking on the porch. He told her everything. She listened, then said something that surprised him. "Sometimes people grow in different directions, like two branches of the same tree. It is not anyone's fault. It just means each of you is growing."

The next morning, Omar sat in his usual seat and left the space beside him empty for a moment. Then a quiet girl named Rosa, who always sat alone with a sketchbook, hesitated in the aisle. Omar moved his bag. "You can sit here," he said.

She showed him her drawings. They were good. By the end of the ride, Omar realized he had not thought about Theo once.`,
      [clues, characterWords, plot],
      [
        ask(
          t('What does Theo\'s "quick nod" show?', "西奥“匆匆点了一下头”说明了什么？"),
          t("He is treating Omar like someone he barely knows", "他把奥马尔当成几乎不认识的人"),
          [
            t("He is angry with Omar", "他在生奥马尔的气"),
            t("He did not see Omar", "他没看见奥马尔"),
            t("He wants Omar to join the team", "他想让奥马尔加入球队"),
          ],
          t(
            "The second paragraph says it was the kind of nod you give someone you barely know.",
            "第二段说，那是你对几乎不认识的人才会做的那种点头。",
          ),
        ),
        ask(
          t('What does the word "resentful" most likely mean in the third paragraph?', '第三段中的 "resentful" 最可能是什么意思？'),
          t("Bitter and angry about being treated unfairly", "因受到不公平对待而怨恨"),
          [t("Calm and relaxed", "平静放松"), t("Proud and confident", "骄傲自信"), t("Bored and sleepy", "无聊困倦")],
          t(
            "Omar imagines saying cruel things to Theo and lies awake replaying conversations, which shows bitterness at being hurt.",
            "奥马尔想象对西奥说刻薄的话，夜里躺着反复回想对话，这表现出受伤后的怨恨。",
          ),
        ),
        ask(
          t("How does Omar change by the end of the story?", "到故事结尾，奥马尔有了什么变化？"),
          t("He lets go of the lost friendship and opens himself to a new one", "他放下了失去的友谊，向新的友谊敞开心扉"),
          [
            t("He wins Theo back as a friend", "他把西奥重新争取回来做朋友"),
            t("He joins the basketball team", "他加入了篮球队"),
            t("He decides never to make friends again", "他决定再也不交朋友"),
          ],
          t(
            "After his grandmother's words, Omar invites Rosa to sit with him and realizes he has not thought about Theo once.",
            "听了奶奶的话后，奥马尔邀请罗莎和他坐在一起，并发现自己一次也没想起西奥。",
          ),
        ),
      ],
      ["Omar", "Theo", "Rosa"],
    ),
    passage(
      "grandfathers-garden",
      t("Grandfather's Garden", "爷爷的菜园"),
      `The summer I turned twelve, my grandfather forgot my name. He had been forgetting small things for a year: where he had left his glasses, whether he had eaten lunch. But that June afternoon, when I came to help him in the garden, he looked at me politely and asked, "Are you the new neighbor's boy?"

I said nothing. I went home and told my mother I would not go back. I could not stand to see him like that.

For two weeks I stayed away. Then my mother told me that Grandfather's tomatoes were dying. He kept forgetting to water them, and he did not seem to notice the weeds. She did not ask me to go. She just told me.

I remembered the spring when I was six, when he had held my hand around a tiny seed and pressed it into the soil. "Patience," he had said. "Everything good grows slowly."

The next morning, I went back. Grandfather did not know who I was, but he was happy to have help. We weeded side by side without talking much. When I turned on the hose, he smiled and said, "My grandson used to love doing that." My throat tightened, but I kept watering.

I went every day that summer. Some days he knew me, and most days he did not. It stopped mattering as much as I had thought it would. The tomatoes came back, heavy and red, and on the last day of August he handed me the biggest one and said, "For you." I do not know who he thought I was. I know who I was.`,
      [clues, characterWords, order],
      [
        ask(
          t("Why did the narrator stop visiting his grandfather?", "叙述者为什么不再去看爷爷？"),
          t("It was too painful to see him forget", "看到爷爷忘事太痛苦了"),
          [
            t("He was busy with summer school", "他忙于暑期学校"),
            t("His grandfather asked him to leave", "爷爷让他离开"),
            t("He did not like gardening", "他不喜欢种菜"),
          ],
          t("The second paragraph says he could not stand to see his grandfather like that.", "第二段说，他无法忍受看到爷爷变成那样。"),
        ),
        ask(
          t("What does the fourth paragraph do?", "第四段起什么作用？"),
          t("It is a flashback to a time the grandfather taught the narrator patience", "它是一段倒叙，回到爷爷教叙述者要有耐心的时候"),
          [
            t("It foreshadows that the tomatoes will die", "它预示番茄会死"),
            t("It describes what happens the next morning", "它描写第二天早上发生的事"),
            t("It explains the grandfather's illness", "它解释爷爷的病"),
          ],
          t(
            "The paragraph goes back to the spring when the narrator was six, an earlier time, which is a flashback.",
            "这一段回到叙述者六岁时的那个春天，即更早的时间，所以是倒叙。",
          ),
        ),
        ask(
          t('What does the last line, "I know who I was," suggest?', "最后一句“我知道我是谁”暗示了什么？"),
          t(
            "The narrator has found meaning in caring for his grandfather, even unrecognized",
            "即使不被认出，叙述者也在照顾爷爷中找到了意义",
          ),
          [
            t("The narrator has forgotten his own name", "叙述者忘了自己的名字"),
            t("The grandfather finally remembers him", "爷爷终于记起了他"),
            t("The narrator wants to be a farmer", "叙述者想当农民"),
          ],
          t(
            "Being recognized has stopped mattering as much; he knows he is the grandson who came back to help.",
            "被认出来已经没那么重要了；他知道自己是那个回来帮忙的孙子。",
          ),
        ),
      ],
      ["June", "Grandfather's", "Grandfather", "August"],
    ),
    passage(
      "the-broken-window",
      t("The Broken Window", "打破的窗户"),
      `The ball left Kenji's bat with a sharp crack, sailed over the fence and went straight through the window of Mrs. Alvarez's kitchen. The sound of breaking glass seemed to hang in the air.

For a moment, nobody moved. Then his friends scattered like birds. "Run!" someone yelled. Kenji ran too.

He hid behind the garage until his heart slowed down. Nobody had seen him, he told himself. Mrs. Alvarez was at work all day. There were a dozen kids on the street who could have hit that ball. He went home, washed his hands and sat down to dinner as if nothing had happened.

But that night he could not sleep. He kept picturing Mrs. Alvarez coming home to find glass all over her kitchen floor. She was seventy-two and lived alone. Last winter, when his family's car had broken down in the snow, she had walked over with a thermos of hot soup without being asked.

In the morning, Kenji emptied the jar where he had been saving money for a video game. It was not enough for a window, but it was something. He walked to her door and knocked before he could change his mind.

When she opened it, he held out the money and told her the truth. He waited for her to shout. Instead, she studied him for a long moment. "Do you know how many people would have kept running?" she said at last. She did not take all his money. She took half and asked him to help her rake leaves for the rest.

Kenji raked every Saturday that fall. It was the least fun he had ever had. Somehow, he did not mind.`,
      [clues, characterWords, plot],
      [
        ask(
          t("What is the main conflict in the story?", "故事的主要冲突是什么？"),
          t("Kenji struggles with whether to confess", "健二在是否认错之间挣扎"),
          [
            t("Kenji fights with his friends", "健二和朋友们打架"),
            t("Kenji's team loses a game", "健二的球队输了比赛"),
            t("Mrs. Alvarez tries to catch the thief", "阿尔瓦雷斯太太想抓住肇事者"),
          ],
          t(
            "The story turns on what happens inside Kenji: he hides, cannot sleep, and finally decides to tell the truth. It is a conflict with himself.",
            "故事围绕健二的内心展开：他躲起来，睡不着，最后决定说出真相。这是人与自我的冲突。",
          ),
        ),
        ask(
          t("Why does the memory of the soup matter to Kenji's decision?", "关于那壶汤的回忆为什么影响了健二的决定？"),
          t("It reminds him that Mrs. Alvarez had been kind to his family", "它让他想起阿尔瓦雷斯太太曾善待他的家人"),
          [
            t("It makes him hungry", "它让他觉得饿"),
            t("It proves she was home all day", "它证明她整天在家"),
            t("It shows she owed his family money", "它表明她欠他家钱"),
          ],
          t(
            "The fourth paragraph recalls her bringing soup without being asked, which makes running away feel even worse to Kenji.",
            "第四段回忆她主动送来热汤，这让健二觉得逃走更说不过去了。",
          ),
        ),
        ask(
          t("Why is the ending a little ironic?", "为什么说结尾有点反讽意味？"),
          t("The raking is no fun, yet Kenji does not mind it", "耙树叶一点也不好玩，健二却并不介意"),
          [
            t("Mrs. Alvarez breaks her own window", "阿尔瓦雷斯太太打破了自己的窗户"),
            t("Kenji buys the video game after all", "健二最后还是买了那个电子游戏"),
            t("His friends confess instead of him", "他的朋友们代替他认了错"),
          ],
          t(
            'The last lines set "the least fun he had ever had" against "he did not mind," an unexpected turn that shows his change.',
            "最后几句把“他经历过的最无趣的事”和“他并不介意”放在一起，这个出人意料的转折表现了他的变化。",
          ),
        ),
      ],
      ["Kenji's", "Kenji", "Alvarez's", "Alvarez"],
    ),
    passage(
      "the-team-that-lost",
      t("The Team That Lost", "输掉比赛的球队"),
      `Our soccer team had not lost a game in two years. We were the Hawks, and everyone in town knew it. Before the championship final, the local newspaper ran a photo of us with the headline "Unstoppable." I cut it out and stuck it on my bedroom wall.

Our opponents were a team from the next town that nobody had heard of until that season. They were smaller than us, and their uniforms did not even match. In the warm-up, we laughed at the way their goalkeeper kept dropping the ball.

We scored first, just three minutes in, and after that we stopped trying. We showed off. We passed the ball to the players who had scored the most goals instead of the players who were open. Our coach shouted from the sideline, but we were not listening.

They scored in the second half. Then they scored again. Their goalkeeper, the one we had laughed at, dove to stop our last shot with his fingertips. When the whistle blew, the other team piled on top of him in the mud, laughing and crying, and we stood there as if we had forgotten how to move.

That night I took the photo off my wall. I thought I would feel angry, but mostly I felt embarrassed. We had not lost because they were better. We had lost because we were sure we could not lose.

The next season, our coach pinned a new photo in the locker room. It was the other team, celebrating in the mud. Nobody ever asked him to take it down.`,
      [clues, characterWords, irony],
      [
        ask(
          t("Why did the Hawks lose the final, according to the narrator?", "根据叙述者的说法，鹰队为什么输掉了决赛？"),
          t("They were overconfident and stopped trying", "他们过于自信，不再努力"),
          [
            t("The other team was much bigger", "对方球队的人高大得多"),
            t("Their coach gave them bad advice", "他们的教练给了糟糕的建议"),
            t("The field was too muddy", "球场太泥泞了"),
          ],
          t(
            "The fifth paragraph says they lost because they were sure they could not lose; after scoring, they stopped trying and showed off.",
            "第五段说，他们输是因为确信自己不会输；进球之后，他们不再努力，只顾炫耀。",
          ),
        ),
        ask(
          t('What makes the newspaper headline "Unstoppable" ironic?', "报纸标题“势不可挡”为什么具有反讽意味？"),
          t("The team called unstoppable was beaten in the final", "被称为势不可挡的球队在决赛中被击败了"),
          [
            t("The newspaper printed the wrong team", "报纸登错了球队"),
            t("The narrator cut out the headline", "叙述者把标题剪了下来"),
            t("The other team had no uniforms", "对方球队没有队服"),
          ],
          t(
            "Situational irony: what happens is the opposite of what the headline, and everyone, expected.",
            "这是情境反讽：发生的事情与标题和所有人的预期正好相反。",
          ),
        ),
        ask(
          t("Why does the coach put up the photo of the other team?", "教练为什么贴出对方球队的照片？"),
          t("To remind the players of the lesson they learned", "提醒队员们记住学到的教训"),
          [
            t("To make fun of the other team", "取笑对方球队"),
            t("Because he wanted to coach them instead", "因为他想去执教他们"),
            t("Because the newspaper asked him to", "因为报纸要求他这么做"),
          ],
          t(
            "The photo shows what overconfidence cost them, and no one asks to take it down because they all understand the lesson.",
            "这张照片提醒他们过度自信付出的代价，没有人要求撤下，因为大家都明白这个教训。",
          ),
        ),
      ],
      ["Hawks", "Unstoppable"],
    ),
    passage(
      "the-new-baby",
      t("The New Baby", "新生的小弟弟"),
      `For eleven years, I was an only child, and I liked it that way. I had my parents' full attention, a room with a view of the park, and nobody to share the television with. Then my mother told me she was going to have a baby.

Everyone seemed thrilled except me. Relatives called with advice. My parents painted the spare room yellow and filled it with tiny clothes. When I asked my father to help me with a science project, he said, "Not tonight, I have to build the crib." I built the project alone, and it fell apart on the bus.

When my brother Sami was born, he was red, wrinkled and loud. He cried at night, and my parents walked around the apartment looking like ghosts. Nobody asked about my day. I started staying late at the library just so I would not have to go home.

One evening, my mother was sick, and my father had to work late. I was left alone with Sami for the first time. He would not stop crying. I tried a bottle, a toy, a song. Nothing worked. Finally, desperate, I picked him up and walked to the window, the way I had seen my father do. I pointed out the lights in the park and told him their names, the ones I had made up when I was small.

He stopped crying. He stared at me with huge, serious eyes, and then he grabbed my finger and held on.

When my parents came home, they found us both asleep in the armchair. I did not tell them that I had been holding him the whole time, afraid that if I let go, he might stop needing me.`,
      [clues, characterWords, theme],
      [
        ask(
          t("Why is the narrator unhappy about the new baby at first?", "叙述者起初为什么对新生的宝宝感到不高兴？"),
          t("The narrator feels pushed aside and loses the parents' attention", "叙述者觉得被冷落，失去了父母的关注"),
          [
            t("The baby is sick", "宝宝生病了"),
            t("The family has to move", "全家必须搬家"),
            t("The narrator wanted a sister", "叙述者想要一个妹妹"),
          ],
          t(
            "The second and third paragraphs show the parents too busy to help or ask about the narrator's day.",
            "第二段和第三段写父母忙得顾不上帮忙，也不过问叙述者的一天。",
          ),
        ),
        ask(
          t("Which detail best shows the narrator's turning point?", "哪个细节最能表现叙述者的转折点？"),
          t("Sami grabs the narrator's finger and holds on", "萨米抓住叙述者的手指不放"),
          [
            t("The parents paint the spare room yellow", "父母把空房间刷成黄色"),
            t("The science project falls apart on the bus", "科学作业在公交车上散架了"),
            t("The narrator stays late at the library", "叙述者在图书馆待到很晚"),
          ],
          t(
            "When Sami stops crying and holds the narrator's finger, the narrator's feelings toward him change.",
            "当萨米不哭了、抓住叙述者的手指时，叙述者对他的感情发生了变化。",
          ),
        ),
        ask(
          t("What does the last sentence suggest about the narrator?", "最后一句暗示了叙述者的什么？"),
          t("The narrator has come to love the baby and want to be needed", "叙述者已经爱上了这个宝宝，希望被他需要"),
          [
            t("The narrator is still angry at the parents", "叙述者仍然在生父母的气"),
            t("The narrator is afraid of the dark", "叙述者怕黑"),
            t("The narrator wants to move out", "叙述者想搬出去"),
          ],
          t(
            "Holding Sami the whole time so he would not stop needing the narrator shows a new, protective love.",
            "叙述者一直抱着萨米，怕他不再需要自己，这表现出一种新的、想要保护他的爱。",
          ),
        ),
      ],
      ["Sami"],
    ),
    passage(
      "the-trip-that-went-wrong",
      t("The Trip That Went Wrong", "出了岔子的旅行"),
      `For a whole year, our family had been planning the trip to the mountains. My sister and I had a calendar on the fridge, and every night we crossed off a day. Dad had studied maps of the trail, and Mom had booked a cabin by a lake that, in the photos, looked as blue as a jewel.

The car broke down two hours after we left. It took most of the day to get it fixed at a tiny garage in a town with one street, and we reached the cabin after dark, tired and hungry. In the morning it was raining. It rained the next day too, and the next. The lake was gray, the trail was mud, and the cabin's roof leaked into a bucket beside my bed.

My sister cried. Dad stared at the clouds as if he could argue them away. I was furious at the weather, at the car, at the whole unfair world.

On the third night, the power went out. Mom found candles and an old deck of cards in a drawer. We played a game Dad had learned from his grandfather, one with rules so complicated that we kept arguing about them. My sister laughed so hard she fell off her chair. Dad told stories about camping as a boy, when everything had gone wrong too.

We drove home on the fifth day without ever having seen the blue lake. Years later, though, when my family talks about our best vacation, we do not mean the ones with perfect weather. We mean that one, with the leaking roof and the candlelight and the game nobody could explain.`,
      [clues, characterWords, irony],
      [
        ask(
          t("What details show how carefully the family had planned the trip?", "哪些细节表明这家人对旅行计划得很周密？"),
          t("A calendar on the fridge, studied maps and a booked cabin", "冰箱上的日历、研究过的地图和预订好的小屋"),
          [
            t("A broken car and a leaking roof", "坏掉的汽车和漏水的屋顶"),
            t("Candles and an old deck of cards", "蜡烛和一副旧扑克牌"),
            t("Rain for three days in a row", "连续三天下雨"),
          ],
          t(
            "The first paragraph describes the calendar, Dad's study of the trail maps and the cabin Mom booked.",
            "第一段描写了日历、爸爸对路线地图的研究和妈妈预订的小屋。",
          ),
        ),
        ask(
          t("What is the turning point of the trip?", "这次旅行的转折点是什么？"),
          t("The night the power goes out and the family plays cards", "停电的那晚，一家人一起打牌"),
          [
            t("The car breaking down", "汽车抛锚"),
            t("Arriving at the cabin after dark", "天黑后到达小屋"),
            t("Driving home on the fifth day", "第五天开车回家"),
          ],
          t(
            "On the third night, the candles and the card game turn the family's misery into laughter.",
            "第三天晚上，烛光和纸牌游戏把一家人的沮丧变成了欢笑。",
          ),
        ),
        ask(
          t("Why is the ending ironic?", "为什么说结尾具有反讽意味？"),
          t("The trip where everything went wrong becomes their best vacation", "一切都出了岔子的旅行反而成了他们最好的假期"),
          [
            t("They finally see the blue lake", "他们终于看到了蓝色的湖"),
            t("The weather was perfect after all", "天气其实非常好"),
            t("They never go on vacation again", "他们再也没去度假"),
          ],
          t(
            "What happens is the opposite of what anyone would expect: the ruined trip is remembered as the best one.",
            "发生的事与任何人的预期相反：那次搞砸的旅行反而被记为最好的一次。",
          ),
        ),
      ],
      [],
    ),
  ],
};
