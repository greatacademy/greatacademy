import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

// The topics of the course english-reading-comprehension that the stories practice.
const inferences = { topic: "making-inferences", weight: 0.3 } as const;
const inferencesSome = { topic: "making-inferences", weight: 0.2 } as const;
const characters = { topic: "characters", weight: 0.3 } as const;
const charactersSome = { topic: "characters", weight: 0.2 } as const;
const pointOfView = { topic: "point-of-view", weight: 0.3 } as const;
const lesson = { topic: "lesson-of-a-story", weight: 0.3 } as const;
const lessonSome = { topic: "lesson-of-a-story", weight: 0.2 } as const;
const figures = { topic: "similes-and-metaphors", weight: 0.3 } as const;
const figuresSome = { topic: "similes-and-metaphors", weight: 0.2 } as const;
const idioms = { topic: "idioms", weight: 0.3 } as const;

/** storiesAndFables is a reading unit of grades 3 to 5 of short original stories and fables about characters, lessons and figurative language. */
export const storiesAndFables: ReadingUnitDef = {
  id: "stories-and-fables",
  title: t("Stories and Fables", "故事与寓言"),
  passages: [
    {
      id: "the-missing-lunch",
      title: t("The Missing Lunch", "不见了的午餐"),
      body: `At noon on Monday, Tomas opened his lunch box and stared. Inside there was one apple, a napkin and a small note in his grandmother's careful writing: "Sorry! Pepper got to your sandwich first."

Tomas closed the box with a snap. His stomach growled loudly. He thought about the muddy paw prints he had seen by the kitchen door that morning, and the way Pepper had been licking her lips and wagging her tail under the table. Now it all made sense.

"What's wrong?" asked Ruby, who sat next to him.

"My lunch got eaten," Tomas said. "And not by me."

Ruby looked at her own lunch. She had a cheese sandwich, carrot sticks and two cookies. Without a word, she broke the sandwich in half and pushed one piece across the table. Then she added a cookie.

"You don't have to do that," Tomas said.

"I know," Ruby said, smiling. "But I want to."

That evening, Tomas told his grandmother the whole story. Pepper lay at his feet, looking very pleased with herself.

"Tomorrow," his grandmother said, "I am packing two sandwiches. One is for you, and one is for Ruby."`,
      topics: [inferences, charactersSome],
      names: ["Tomas", "Pepper", "Ruby"],
      xp: 5,
      questions: [
        {
          prompt: t("Who is Pepper most likely to be?", "佩珀最有可能是谁？"),
          right: t("The family dog", "家里的狗"),
          wrong: [
            t("Tomas's little sister", "托马斯的妹妹"),
            t("A girl in Tomas's class", "托马斯班上的一个女孩"),
            t("The neighbor's cat", "邻居家的猫"),
          ],
          solution: t(
            "The second paragraph gives the clues: muddy paw prints by the door, and Pepper licking her lips and wagging her tail under the table. Those fit a dog.",
            "第二段给出了线索：门边有泥爪印，佩珀在桌子下面舔嘴唇、摇尾巴。这些都说明它是一条狗。",
          ),
        },
        {
          prompt: t("Which word best describes Ruby?", "哪个词最能描述鲁比？"),
          right: t("Generous", "慷慨大方"),
          wrong: [t("Greedy", "贪心"), t("Shy", "害羞"), t("Bossy", "爱指挥别人")],
          solution: t(
            'Without being asked, Ruby breaks her sandwich in half, adds a cookie, and says "But I want to." She gives what is hers freely.',
            "没人请求，鲁比就把三明治掰成两半，还加了一块饼干，并说“But I want to.”。她心甘情愿地分享自己的东西。",
          ),
        },
        {
          prompt: t("Why will Tomas's grandmother pack a sandwich for Ruby?", "托马斯的奶奶为什么要给鲁比也准备一个三明治？"),
          right: t("To thank Ruby for sharing her lunch", "为了感谢鲁比分享午餐"),
          wrong: [
            t("Because Pepper will eat one of them", "因为佩珀会吃掉其中一个"),
            t("Because Ruby asked her for one", "因为鲁比向她要了一个"),
            t("Because Ruby forgot her lunch", "因为鲁比忘了带午餐"),
          ],
          solution: t(
            "The grandmother decides this right after Tomas tells her the whole story, which includes Ruby sharing. The story does not say it, but a sandwich for Ruby is her way of saying thank you.",
            "奶奶是在托马斯讲完整件事（包括鲁比分享午餐）之后才这样决定的。故事没有直说，但给鲁比做三明治就是她表示感谢的方式。",
          ),
        },
      ],
    },
    {
      id: "the-dragon-notebook",
      title: t("The Dragon Notebook", "画龙的笔记本"),
      body: `On her first day at Hillside School, Mei sat at the back of the room and kept her eyes on her desk. When Mr. Grant asked her to tell the class about herself, her face turned red, and she whispered only her name.

At recess, she sat alone on a bench with a notebook. Owen, who had been watching her, walked over. He saw that she was drawing a dragon with long silver wings, every scale drawn with care.

"That's amazing," he said. "Can you draw a horse?"

Mei looked up. For the first time that day, she smiled. She turned to a new page and drew a horse running through tall grass, its tail flying out behind it. Soon three more children were standing around the bench, asking for a lion, a rocket and a cat in a hat.

When the bell rang, Mei closed her notebook slowly, as if she did not want recess to end.

The next morning, she did not sit at the back. She sat at the table next to Owen, and during math she raised her hand twice.`,
      topics: [characters, inferencesSome],
      names: ["Hillside", "Mei", "Grant", "Owen"],
      xp: 5,
      questions: [
        {
          prompt: t("How does Mei feel in the first paragraph?", "第一段里小梅有什么感受？"),
          right: t("Shy and nervous", "害羞又紧张"),
          wrong: [t("Angry and bored", "生气又无聊"), t("Proud and excited", "骄傲又兴奋"), t("Sick and tired", "生病又疲惫")],
          solution: t(
            "The first paragraph says she sits at the back, keeps her eyes on her desk, turns red and whispers only her name. Those are signs of a shy, nervous person.",
            "第一段说她坐在后排，眼睛一直盯着桌子，脸变红，只小声说出自己的名字。这些都是害羞紧张的表现。",
          ),
        },
        {
          prompt: t("What does it show when Mei closes her notebook slowly?", "小梅慢慢合上笔记本，说明了什么？"),
          right: t("She was enjoying recess and did not want it to end", "她玩得很开心，不想让课间结束"),
          wrong: [
            t("She was tired of drawing", "她画累了"),
            t("She was afraid of the bell", "她害怕铃声"),
            t("She did not want anyone to see her drawings", "她不想让别人看到她的画"),
          ],
          solution: t(
            'The fifth paragraph says she closed it slowly "as if she did not want recess to end." Children had gathered around her drawings, and she was happy.',
            "第五段说她慢慢合上本子，“as if she did not want recess to end”。孩子们围着看她画画，她很开心。",
          ),
        },
        {
          prompt: t("How has Mei changed by the end of the story?", "到故事结尾，小梅有了什么变化？"),
          right: t("She feels more at home and joins in", "她更自在了，开始融入大家"),
          wrong: [
            t("She has stopped drawing", "她不再画画了"),
            t("She has become bossy", "她变得爱指挥别人了"),
            t("She wants to change schools", "她想转学"),
          ],
          solution: t(
            "The last paragraph says she no longer sits at the back: she sits next to Owen and raises her hand twice, unlike the first day.",
            "最后一段说她不再坐在后排：她坐在欧文旁边，还举了两次手，和第一天完全不同。",
          ),
        },
      ],
    },
    {
      id: "the-spelling-bee",
      title: t("The Spelling Bee", "拼写比赛"),
      body: `Priya had practiced for the class spelling bee for three weeks. Every night, her father read words from a long list while she walked in circles around the kitchen, spelling them out loud.

On the day of the bee, only Priya and a boy named Sam were left. Ms. Lee gave Priya the word "necessary." Priya spelled it quickly, but as soon as the last letter left her mouth, her stomach dropped. She had doubled the wrong letter.

Ms. Lee was looking down at her list and did not seem to notice. "Correct!" she said, and the class clapped.

Sam spelled his next word right. Then Priya got "island" and spelled it perfectly. Ms. Lee smiled. "Priya is our winner!"

Priya stood very still. Her hands felt cold. She looked at the shiny gold ribbon on Ms. Lee's desk, and then at Sam, who was trying hard not to look sad.

"Ms. Lee," she said quietly, "I spelled necessary wrong. I doubled the wrong letter."

The room went silent. Ms. Lee checked her list and nodded. The bee went on, and Sam won with the word "bicycle."

After school, Ms. Lee gave Priya a ribbon too. It was blue, and it said "Honest Speller."`,
      topics: [characters, inferencesSome],
      names: ["Priya", "Sam", "Lee", "Lee's"],
      xp: 5,
      questions: [
        {
          prompt: t(
            'What do "her stomach dropped" and "her hands felt cold" show about Priya?',
            "“her stomach dropped”和“her hands felt cold”说明了普丽娅怎样的状态？",
          ),
          right: t("She felt uneasy because she knew she had made a mistake", "她心里不安，因为她知道自己拼错了"),
          wrong: [
            t("She was hungry and the room was cold", "她饿了，教室又冷"),
            t("She was excited to win the ribbon", "她为能赢得绶带而兴奋"),
            t("She was angry at Sam", "她在生山姆的气"),
          ],
          solution: t(
            "Her stomach drops right when she realizes she doubled the wrong letter, and her hands feel cold just before she tells the truth. Both show worry, not hunger or cold weather.",
            "她意识到自己重复错了字母时，心一下子沉了下去；在说出实情之前，她的手发凉。这两处都表现出担心，而不是饥饿或天气冷。",
          ),
        },
        {
          prompt: t("Which word best describes Priya?", "哪个词最能描述普丽娅？"),
          right: t("Honest", "诚实"),
          wrong: [t("Careless", "粗心"), t("Boastful", "爱吹牛"), t("Lazy", "懒惰")],
          solution: t(
            "Nobody noticed her mistake, yet she told Ms. Lee and gave up the win. Practicing for three weeks also shows she is not lazy.",
            "没有人发现她的错误，她却主动告诉李老师，放弃了胜利。她练了三个星期，也说明她并不懒。",
          ),
        },
        {
          prompt: t("Why does Priya look at Sam before she speaks up?", "普丽娅为什么在开口之前看了看山姆？"),
          right: t("She sees he is sad and knows he did not get a fair chance", "她看到他很难过，知道他没有得到公平的机会"),
          wrong: [
            t("She wants him to speak for her", "她想让他替自己说话"),
            t("She thinks he cheated", "她认为他作弊了"),
            t("She wants to show him the ribbon", "她想把绶带给他看"),
          ],
          solution: t(
            "The fifth paragraph says Sam was trying hard not to look sad. Right after looking at him, Priya admits her mistake, so seeing him helps her decide to make it fair.",
            "第五段说山姆正努力不让自己显得难过。普丽娅看了他之后马上承认了错误，可见是看到他让她决定还他一个公平。",
          ),
        },
      ],
    },
    {
      id: "the-cardboard-castle",
      title: t("The Cardboard Castle", "纸板城堡"),
      body: `My little brother Ben is six, and he never gives up. I am ten, so I usually know better, or at least that is what I tell him.

Last Saturday, Ben decided to build a castle out of the big boxes our new fridge came in. I told him it would never stand up. "Cardboard is too soft," I said. "It will fall down the minute you add a roof."

Ben did not answer. He just went to get the tape.

The first tower fell over. The second tower bent in the middle like a tired flower. Ben sat on the floor for a long time, looking at the pieces. I was sure he would cry, and I was almost ready to say, "I told you so."

Instead, he rolled the cardboard into tubes, like the ones inside paper towels. He stood the tubes up inside the walls, and suddenly the towers were strong.

By dinner time, the castle had two towers, a door that opened and a flag made from one of my old socks. Mom took a picture of it.

I still have not told Ben, but I think he is a better builder than I am. Maybe tomorrow I will ask if I can help.`,
      topics: [pointOfView, charactersSome],
      names: ["Ben"],
      xp: 5,
      questions: [
        {
          prompt: t("Who is telling this story?", "这个故事是谁讲的？"),
          right: t("Ben's older sister or brother", "本的哥哥或姐姐"),
          wrong: [t("Ben himself", "本自己"), t("Their mom", "他们的妈妈"), t("A friend who came to visit", "一位来做客的朋友")],
          solution: t(
            'The teller says "My little brother Ben is six" and "I am ten." The story is told in the first person by Ben\'s older brother or sister.',
            "讲故事的人说“My little brother Ben is six”和“I am ten”。故事是由本的哥哥或姐姐用第一人称讲述的。",
          ),
        },
        {
          prompt: t("How does the teller's opinion change during the story?", "讲述者的看法在故事中发生了什么变化？"),
          right: t("At first the teller thinks the castle will fail, and at the end admires Ben", "一开始认为城堡会失败，最后却佩服本"),
          wrong: [
            t("At first the teller loves the castle, and at the end thinks it is silly", "一开始很喜欢城堡，最后觉得它很傻"),
            t("The teller is sure from the start that Ben will succeed", "讲述者从一开始就确信本会成功"),
            t("The teller never pays attention to the castle", "讲述者从没关注过城堡"),
          ],
          solution: t(
            'In the second paragraph the teller says the castle "would never stand up." In the last paragraph the teller thinks Ben "is a better builder than I am."',
            "第二段里讲述者说城堡“would never stand up”；最后一段里讲述者却认为本“is a better builder than I am”。",
          ),
        },
        {
          prompt: t("What does the reader know that Ben does not?", "读者知道哪件本不知道的事？"),
          right: t("That the teller thinks Ben is the better builder", "讲述者认为本是更好的建造者"),
          wrong: [
            t("That the first tower fell over", "第一座塔倒了"),
            t("That Mom took a picture", "妈妈拍了照"),
            t("That the flag is made from a sock", "旗子是用袜子做的"),
          ],
          solution: t(
            'The last paragraph says "I still have not told Ben." Because the teller shares private thoughts with us, we know something Ben does not. The other things happened in front of Ben.',
            "最后一段说“I still have not told Ben”。讲述者把心里话告诉了我们，所以我们知道本不知道的事。其他几件事都是本亲眼看到的。",
          ),
        },
      ],
    },
    {
      id: "the-kite-under-the-stairs",
      title: t("The Kite Under the Stairs", "楼梯下的风筝"),
      body: `I am a kite. I am red and yellow, with a long tail made of ribbons. For two long winters, I lay in the dark closet under the stairs, behind the boots and a broken umbrella. I thought nobody remembered me.

Then one spring morning, the door opened, and light poured in. A girl with a gap in her front teeth pulled me out. "Grandpa, look!" she called. "Is this the kite you told me about?"

An old man came slowly down the hall. When he saw me, his eyes went soft. "I made that kite for your mother when she was your age," he said.

My tail was torn, and one of my sticks was cracked. The girl and her grandpa spent the whole afternoon fixing me with glue, string and tape. Their heads were close together over the table, and they laughed a lot.

The next day was windy. On the hill behind the house, the girl ran, and I rose up, higher and higher, until the houses below looked like toys. Far beneath me, I could see the old man waving with both arms.

I had forgotten how much I loved the sky.`,
      topics: [pointOfView, inferencesSome],
      xp: 5,
      questions: [
        {
          prompt: t("Who is telling this story?", "这个故事是谁讲的？"),
          right: t("The kite", "风筝"),
          wrong: [t("The girl", "小女孩"), t("The grandpa", "爷爷"), t("The girl's mother", "小女孩的妈妈")],
          solution: t(
            'The first sentence is "I am a kite." The whole story is told by the kite, using "I" and "me."',
            "第一句就是“I am a kite.”。整个故事都由风筝用“I”和“me”来讲述。",
          ),
        },
        {
          prompt: t(
            'Why do the old man\'s "eyes went soft" when he sees the kite?',
            "老人看到风筝时，为什么“eyes went soft”（眼神变得温柔）？",
          ),
          right: t("The kite brings back happy memories of his daughter as a child", "风筝让他想起女儿小时候的美好回忆"),
          wrong: [
            t("He is angry that the kite is broken", "他气风筝坏了"),
            t("He cannot see well in the dark hall", "走廊太暗，他看不清"),
            t("He is tired from walking down the hall", "他走过走廊累了"),
          ],
          solution: t(
            "Right after his eyes go soft, he says he made the kite for the girl's mother when she was a child. Seeing it reminds him of that time with love.",
            "他眼神变柔和之后，马上说这只风筝是他在女孩的妈妈小时候为她做的。看到它，他满怀深情地想起了那段时光。",
          ),
        },
        {
          prompt: t("How do the kite's feelings change from the beginning to the end?", "从开头到结尾，风筝的心情有什么变化？"),
          right: t("From forgotten and lonely to full of joy", "从被遗忘的孤单变成满心欢喜"),
          wrong: [
            t("From happy to scared", "从开心变成害怕"),
            t("From angry to more angry", "从生气变得更生气"),
            t("From excited to bored", "从兴奋变成无聊"),
          ],
          solution: t(
            'In the first paragraph the kite thinks "nobody remembered me." The last line says it had forgotten "how much I loved the sky."',
            "第一段里风筝觉得“nobody remembered me”；最后一句说它已经忘了“how much I loved the sky”。",
          ),
        },
      ],
    },
    {
      id: "two-sides-of-the-fence",
      title: t("Two Sides of the Fence", "篱笆的两边"),
      body: `Jada's Side

Every afternoon, a soccer ball comes flying over the fence into our yard. Yesterday it landed right in my tomato plants and broke two of them. I have been growing those tomatoes since March. I marched to the fence and shouted, "Keep your ball on your side!" Then I kept the ball. I think the boy next door does not care about anyone but himself.

Marco's Side

We moved into this house last month, and I do not know anyone here yet. The only thing I like to do is kick my ball against the fence, because it reminds me of playing with my old team. Yesterday I kicked it too hard, and it went over. The girl next door yelled at me and did not give it back. I wanted to say sorry, but she looked so angry that I just went inside. Now I don't even have my ball.

The Next Day

Jada found a note stuck in the fence. It said, "Sorry about your plants. I can help you fix them. Marco." Jada read it twice. Then she picked up the ball and walked next door.`,
      topics: [pointOfView, charactersSome],
      names: ["Jada", "Jada's", "Marco", "Marco's"],
      xp: 5,
      questions: [
        {
          prompt: t("Why does Marco kick his ball against the fence?", "马可为什么对着篱笆踢球？"),
          right: t("It reminds him of his old team, and he does not know anyone yet", "这让他想起以前的球队，而且他在这里还谁都不认识"),
          wrong: [
            t("He wants to break Jada's plants", "他想弄坏杰达的植物"),
            t("He wants to make Jada angry", "他想惹杰达生气"),
            t("His coach told him to practice there", "教练让他在那儿练习"),
          ],
          solution: t(
            "In Marco's part, he says he does not know anyone and that kicking the ball reminds him of playing with his old team.",
            "在马可的部分里，他说自己谁都不认识，踢球能让他想起和以前的球队一起踢球的日子。",
          ),
        },
        {
          prompt: t("In her part, what does Jada think of Marco?", "在杰达的部分里，她怎么看马可？"),
          right: t("That he does not care about anyone but himself", "他只顾自己，不在乎别人"),
          wrong: [
            t("That he is lonely and misses his friends", "他很孤单，想念朋友"),
            t("That he is a great soccer player", "他是个很棒的足球运动员"),
            t("That he wants to help her garden", "他想帮她照料菜园"),
          ],
          solution: t(
            "The last sentence of Jada's part says: \"I think the boy next door does not care about anyone but himself.\" She does not know he is lonely; only Marco's part tells us that.",
            "杰达部分的最后一句说：“I think the boy next door does not care about anyone but himself.”她并不知道他很孤单，只有马可的部分告诉了我们这一点。",
          ),
        },
        {
          prompt: t("Why does the story tell the same events twice, from two sides?", "故事为什么从两个角度把同一件事讲两遍？"),
          right: t("To show that each of them knew only part of what happened", "为了表明他们每个人都只知道事情的一部分"),
          wrong: [
            t("To show that Jada was right all along", "为了表明杰达从头到尾都是对的"),
            t("To teach the reader how to grow tomatoes", "为了教读者怎样种番茄"),
            t("To show that Marco is better at soccer than Jada", "为了表明马可踢球比杰达好"),
          ],
          solution: t(
            "Jada thinks Marco is selfish, and Marco thinks Jada is just angry. Only by reading both parts do we see the whole picture, which they begin to see too in the last part.",
            "杰达以为马可自私，马可以为杰达只是在生气。只有读了两个部分，我们才看到全貌；在最后一部分，他们自己也开始明白了。",
          ),
        },
      ],
    },
    {
      id: "the-mole-who-dug-too-fast",
      title: t("The Mole Who Dug Too Fast", "挖得太快的鼹鼠"),
      body: `Under the meadow lived a young mole named Pip who could dig faster than anyone. He was very proud of it. "Watch me!" he would shout, and dirt would fly in every direction.

One day Pip decided to dig a tunnel all the way to the far side of the meadow, where the sweetest roots grew. An old beetle sat on a stone and watched him begin.

"Go slowly near the willow tree," said the beetle. "The river runs close under the ground there."

"Slow is for beetles," laughed Pip, and he dug on.

He dug past the fence post and under the flowers. When he reached the willow tree, the ground felt cool and soft, but Pip did not stop to think about it. He pushed his nose forward one more time, and cold water rushed into the tunnel.

Pip scrambled back the way he had come, wet and shivering. Half of his fine tunnel was full of mud.

The next morning, he walked to the beetle's stone. "Will you show me where the river runs?" he asked. Together they drew a map in the dirt, and this time Pip dug around the willow tree. It took longer, but the tunnel stayed dry.`,
      topics: [lesson, charactersSome],
      names: ["Pip"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the lesson of this fable?", "这则寓言的道理是什么？"),
          right: t("Listen to good advice instead of rushing ahead", "要听取好的建议，不要一味往前冲"),
          wrong: [
            t("Moles should never dig tunnels", "鼹鼠永远不该挖地道"),
            t("The fastest one always wins", "最快的人总是赢"),
            t("Never trust what a beetle says", "永远别相信甲虫的话"),
          ],
          solution: t(
            "Pip laughs at the beetle's warning and floods his tunnel. When he comes back and asks for help, his new tunnel stays dry. Listening to good advice is what made the difference.",
            "皮普嘲笑甲虫的提醒，结果地道被水淹了。后来他回去请教，新地道就没有进水。是否听取好建议决定了结果。",
          ),
        },
        {
          prompt: t("Which detail shows that Pip missed a warning sign?", "哪个细节说明皮普忽略了危险的信号？"),
          right: t("The ground felt cool and soft, but he did not stop to think", "土摸起来又凉又软，他却没有停下来想一想"),
          wrong: [
            t("He dug past the fence post", "他挖过了篱笆桩"),
            t("Dirt flew in every direction", "泥土四处飞溅"),
            t("He drew a map in the dirt", "他在泥土上画了地图"),
          ],
          solution: t(
            "The fifth paragraph says the ground near the willow felt cool and soft, a sign that water was close, but Pip did not stop to think about it.",
            "第五段说柳树附近的土又凉又软，这说明水就在附近，但皮普没有停下来想一想。",
          ),
        },
        {
          prompt: t("How does Pip change by the end?", "到结尾，皮普有了什么变化？"),
          right: t("He asks for help and is willing to take more time", "他会请别人帮忙，也愿意多花些时间"),
          wrong: [
            t("He stops digging forever", "他再也不挖地道了"),
            t("He learns to dig even faster", "他学会挖得更快"),
            t("He moves to the other side of the river", "他搬到了河的对岸"),
          ],
          solution: t(
            'The last paragraph says he asks the beetle, "Will you show me where the river runs?" and digs around the willow even though "it took longer."',
            "最后一段说他问甲虫“Will you show me where the river runs?”，并且绕开柳树挖，尽管“it took longer”。",
          ),
        },
      ],
    },
    {
      id: "the-sunflower-and-the-clover",
      title: t("The Sunflower and the Clover", "向日葵和三叶草"),
      body: `At the edge of a farm, a tall sunflower grew beside a patch of clover. The sunflower's face was as round and bright as a golden plate, and she loved to look down at the world.

"Poor little clover," she said one morning. "You are so low that nobody ever sees you. I can see all the way to the barn."

The clover said nothing. Her leaves just moved gently in the breeze.

That afternoon, the sky turned dark gray. The wind came across the field like a running horse, and rain fell in heavy sheets. The sunflower swayed from side to side. Then, with a loud crack, her stem bent until her bright face touched the mud.

The clover pressed close to the ground and held on. When the storm passed, not one of her leaves was missing.

The next morning, the farmer's daughter came out to the field. She gently tied the sunflower to a stick so that she could stand again. Then she knelt by the clover and smiled. "Look," she said, "a four-leaf clover. This is my lucky day."

The sunflower was quiet for a long time. "I am sorry for what I said," she told the clover at last. "From up here, I never really looked at you."`,
      topics: [lesson, figuresSome],
      glossed: ["clover"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the lesson of this fable?", "这则寓言的道理是什么？"),
          right: t("Do not look down on others; small things have their own strengths", "不要看不起别人，小的东西也有自己的长处"),
          wrong: [
            t("Tall plants always do better than short ones", "高的植物总比矮的长得好"),
            t("Storms are bad for farms", "暴风雨对农场有害"),
            t("Always stay close to the ground", "永远贴着地面"),
          ],
          solution: t(
            "The sunflower mocks the clover for being low, but the clover survives the storm and is the one the girl calls lucky. In the end the sunflower says sorry.",
            "向日葵嘲笑三叶草长得矮，可三叶草挺过了暴风雨，还被女孩称为幸运草。最后向日葵道了歉。",
          ),
        },
        {
          prompt: t(
            'What does the simile "as round and bright as a golden plate" tell you?',
            "明喻“as round and bright as a golden plate”告诉了你什么？",
          ),
          right: t("The sunflower's face was large, round and shining", "向日葵的花盘又大又圆，闪闪发亮"),
          wrong: [
            t("The sunflower was made of gold", "向日葵是金子做的"),
            t("The farmer ate dinner from the sunflower", "农夫用向日葵盛饭吃"),
            t("The sunflower was heavy and hard", "向日葵又重又硬"),
          ],
          solution: t(
            "A simile uses as or like to say two things are alike in some way. The first paragraph means the flower looked round and bright like a gold plate, not that it was one.",
            "明喻用 as 或 like 说明两样东西在某方面相像。第一段的意思是花盘看起来像金盘子一样圆而亮，并不是说它真是盘子。",
          ),
        },
        {
          prompt: t(
            'What does "The wind came across the field like a running horse" mean?',
            "“The wind came across the field like a running horse”是什么意思？",
          ),
          right: t("The wind was fast and strong", "风又快又猛"),
          wrong: [
            t("The wind was soft and quiet", "风又轻又静"),
            t("A horse ran through the field", "一匹马跑过了田野"),
            t("The wind was warm", "风很暖和"),
          ],
          solution: t(
            "A running horse is fast and powerful. In the fourth paragraph the wind is strong enough to crack the sunflower's stem, so the simile shows its speed and force.",
            "奔跑的马又快又有力。第四段里风大到把向日葵的茎都折断了，所以这个明喻表现的是风的速度和力量。",
          ),
        },
      ],
    },
    {
      id: "snow-day",
      title: t("Snow Day", "下雪天"),
      body: `When Ivy woke up, the world outside her window was a blank page. Snow had fallen all night, covering the street, the cars and the fence in thick white.

School was closed. Ivy pulled on her boots and ran outside, and the cold air bit her cheeks. Her breath came out in small clouds, like smoke from a dragon.

Her little brother Max followed her. He was wrapped in so many sweaters that he moved like a walking pillow. Together they rolled a snowball across the yard. It grew bigger and bigger until it was a boulder, too heavy to push.

"This is the bottom," Ivy said. They made a middle and a head, and Max found two black stones for eyes and a carrot for a nose.

By lunch, their fingers were icicles, and they went inside. Mom gave them mugs of hot chocolate. The warm drink was a small sun in Ivy's hands.

That night, Ivy looked out at the snowman. The moon was a silver coin above the roofs, and the snowman stood guard in the yard like a soldier who would not sleep.`,
      topics: [figures],
      names: ["Ivy", "Ivy's", "Max"],
      xp: 5,
      questions: [
        {
          prompt: t(
            'What does the metaphor "the world outside her window was a blank page" mean?',
            "隐喻“the world outside her window was a blank page”是什么意思？",
          ),
          right: t("Everything was covered in smooth, plain white snow", "一切都被平整洁白的雪覆盖了"),
          wrong: [
            t("Ivy saw a page of her book through the window", "艾薇透过窗户看到了书里的一页"),
            t("The window was dirty", "窗户很脏"),
            t("It was too dark to see anything", "天太黑，什么都看不见"),
          ],
          solution: t(
            "The next sentence says snow had covered the street, the cars and the fence in thick white, so everything looked like an empty white page.",
            "下一句说大雪把街道、汽车和篱笆都盖上了厚厚的白色，所以一切看起来就像一张空白的纸。",
          ),
        },
        {
          prompt: t("Which of these is a simile?", "下面哪一句是明喻？"),
          right: t('"He moved like a walking pillow."', "“He moved like a walking pillow.”（他走起来像个会走路的枕头。）"),
          wrong: [
            t('"Their fingers were icicles."', "“Their fingers were icicles.”（他们的手指成了冰柱。）"),
            t('"The moon was a silver coin."', "“The moon was a silver coin.”（月亮是一枚银币。）"),
            t('"School was closed."', "“School was closed.”（学校停课了。）"),
          ],
          solution: t(
            "A simile says one thing is like another, using like or as. Only the pillow sentence uses like. The icicles and the coin are metaphors, and the last one is not a figure of speech.",
            "明喻用 like 或 as 说明一样东西像另一样东西。只有枕头那句用了 like。冰柱和银币那两句是隐喻，最后一句不是比喻。",
          ),
        },
        {
          prompt: t('What does "their fingers were icicles" tell you?', "“their fingers were icicles”告诉了你什么？"),
          right: t("Their fingers were very cold", "他们的手指冻得冰凉"),
          wrong: [
            t("Icicles were hanging from their fingers", "他们的手指上挂着冰柱"),
            t("Their fingers were long and thin", "他们的手指又细又长"),
            t("They wore gloves made of ice", "他们戴着冰做的手套"),
          ],
          solution: t(
            "The fifth paragraph says this after a whole morning in the snow, right before they go inside for hot chocolate. Icicles are frozen, so the metaphor means their fingers were freezing.",
            "第五段在他们玩了一上午雪之后这样说，紧接着他们就进屋喝热巧克力。冰柱是冻住的，所以这个隐喻是说他们的手指冻僵了。",
          ),
        },
      ],
    },
    {
      id: "the-class-play",
      title: t("The Class Play", "班级话剧"),
      body: `Theo had wanted to be in the class play for months, but on the night of the show, he got cold feet. He stood behind the curtain, holding his lines so tightly that the paper crumpled.

"I can't do it," he whispered to his friend Zoe. "What if I forget everything?"

Zoe was playing the queen, and she wore a paper crown that kept falling over one eye. "We're all in the same boat," she said. "My knees are shaking too." Just then, Mr. Park, their teacher, walked past and said, "Break a leg, everyone!"

Theo looked down at his legs in alarm. Zoe laughed so hard that her crown fell off. "It means good luck, silly," she said.

The curtain opened. For the first few lines, Theo's voice was small and shaky. Then he saw his grandmother in the front row, giving him a thumbs up, and something inside him relaxed. He remembered every word. When the audience laughed at his joke, he even added a little bow.

Afterward, Zoe found him by the door. "See?" she said. "That wasn't so hard."

Theo grinned. "It was a piece of cake," he said. Then he paused. "Well, maybe a very big piece."`,
      topics: [idioms, lessonSome],
      names: ["Theo", "Theo's", "Zoe", "Park"],
      xp: 5,
      questions: [
        {
          prompt: t('What does "he got cold feet" mean in this story?', "故事里的“he got cold feet”是什么意思？"),
          right: t("He became nervous and wanted to back out", "他紧张起来，想打退堂鼓"),
          wrong: [
            t("His feet were freezing on the stage", "他在台上脚冻得冰凉"),
            t("His shoes were too small", "他的鞋太小了"),
            t("He wanted to go outside in the snow", "他想到外面雪地里去"),
          ],
          solution: t(
            'Right after he gets cold feet, Theo crumples his lines and whispers, "I can\'t do it." The idiom means he was too scared to go on.',
            "西奥“got cold feet”之后，把台词纸都攥皱了，还小声说“I can't do it.”。这个习语的意思是他害怕得不敢上台。",
          ),
        },
        {
          prompt: t(
            'Why does Theo look down at his legs when Mr. Park says "Break a leg"?',
            "朴老师说“Break a leg”时，西奥为什么低头看自己的腿？",
          ),
          right: t("He takes the words literally, not as a wish for good luck", "他把这句话当成了字面意思，没听出是祝好运"),
          wrong: [
            t("His leg is hurt", "他的腿受伤了"),
            t("He is checking his costume", "他在检查自己的戏服"),
            t("Mr. Park pointed at his legs", "朴老师指了指他的腿"),
          ],
          solution: t(
            'Zoe laughs and explains, "It means good luck, silly." Theo had thought about the real meaning of the words, so he was alarmed.',
            "佐伊笑着解释说“It means good luck, silly.”。西奥想到的是这几个词的字面意思，所以吓了一跳。",
          ),
        },
        {
          prompt: t("What lesson does the story teach?", "这个故事告诉我们什么道理？"),
          right: t("Feeling afraid does not mean you cannot do something well", "感到害怕并不代表你做不好"),
          wrong: [
            t("Never take part in a play", "永远不要参加演出"),
            t("Friends should laugh at each other's mistakes", "朋友之间应该嘲笑彼此的错误"),
            t("Only people who are never nervous should act", "只有从不紧张的人才应该演戏"),
          ],
          solution: t(
            "Theo is so scared he almost gives up, yet he remembers every word and even takes a bow. Being nervous did not stop him from doing well.",
            "西奥害怕得差点放弃，可他记住了每一句台词，还鞠了一躬。紧张并没有妨碍他表现出色。",
          ),
        },
      ],
    },
  ],
};
