// The reading units of grades 1 and 2 (docs/chinese-curriculum.md §9): nursery rhymes and short passages written for this subject,
// three units a grade, each with a short check, in the characters the two grades teach.

import type { ReadingUnitDef } from "@ga/content";

import { question, unit } from "./kit.ts";

/** gradeOneHome is the reading unit of grade 1 about family and home. */
const gradeOneHome = unit(
  1,
  "chinese-reading-1-home",
  ["我的家", "My Home"],
  [
    {
      id: "chinese-laughter-fills-our-home",
      title: ["笑声满我家", "Laughter Fills Our Home"],
      body: `太阳下山了，
爸爸回到家。
妈妈做好饭，
奶奶端上茶。
哥哥写完字，
妹妹画完画。
全家坐桌前，
笑声满我家。`,
      xp: 2,
      questions: [
        question(
          ["太阳下山了，谁回到了家？", "Who comes home when the sun goes down?"],
          ["爸爸", "Dad"],
          [
            ["哥哥", "The elder brother"],
            ["奶奶", "Grandma"],
            ["妹妹", "The little sister"],
          ],
          ["儿歌开头说：“太阳下山了，爸爸回到家。”", "The rhyme begins by saying that when the sun goes down, Dad comes home."],
        ),
        question(
          ["奶奶端上了什么？", "What does Grandma bring to the table?"],
          ["茶", "Tea"],
          [
            ["饭", "Rice"],
            ["汤", "Soup"],
            ["水果", "Fruit"],
          ],
          ["儿歌说：“奶奶端上茶。”做饭的是妈妈。", "The rhyme says Grandma brings the tea; it is Mum who cooks."],
        ),
        question(
          ["妹妹在做什么？", "What has the little sister been doing?"],
          ["画画", "Drawing"],
          [
            ["写字", "Writing"],
            ["做饭", "Cooking"],
            ["唱歌", "Singing"],
          ],
          ["儿歌说：“妹妹画完画。”写字的是哥哥。", "The rhyme says the little sister has finished her drawing; the brother was writing."],
        ),
      ],
    },
    {
      id: "chinese-grandmas-soup",
      title: ["奶奶的汤", "Grandma's Soup"],
      body: `秋天到了，风刮在脸上，有点冷。奶奶给我们做了一大碗鸡蛋汤。汤里有黄黄的鸡蛋，还有绿绿的青菜。

奶奶问：“汤好喝吗？”我说：“好喝！好喝极了！”哥哥说：“奶奶，我还要一碗！”

喝了热汤，我的手和脚都暖和了。我想：奶奶的汤最香，奶奶的爱最暖。`,
      xp: 2,
      questions: [
        question(
          ["奶奶给我们做了什么？", "What does Grandma make for us?"],
          ["鸡蛋汤", "Egg soup"],
          [
            ["米饭", "Rice"],
            ["面条", "Noodles"],
            ["西瓜汁", "Watermelon juice"],
          ],
          ["第一段说：“奶奶给我们做了一大碗鸡蛋汤。”", "The first paragraph says Grandma makes a big bowl of egg soup."],
        ),
        question(
          ["汤里有什么？", "What is in the soup?"],
          ["鸡蛋和青菜", "Egg and green vegetables"],
          [
            ["鱼和肉", "Fish and meat"],
            ["苹果和桃", "Apples and peaches"],
            ["米饭和糖", "Rice and sugar"],
          ],
          ["第一段说：“汤里有黄黄的鸡蛋，还有绿绿的青菜。”", "The first paragraph says the soup has yellow egg and green vegetables."],
        ),
        question(
          ["哥哥说了什么？", "What does the elder brother say?"],
          ["奶奶，我还要一碗！", "Grandma, I want another bowl!"],
          [
            ["好喝极了！", "It's delicious!"],
            ["汤好喝吗？", "Is the soup good?"],
            ["有点冷。", "It's a bit cold."],
          ],
          [
            "第二段说：“哥哥说：‘奶奶，我还要一碗！’”“好喝极了”是我说的，“汤好喝吗”是奶奶问的。",
            "The second paragraph says the brother asks for another bowl; I say it is delicious, and Grandma asks the question.",
          ],
        ),
      ],
    },
    {
      id: "chinese-little-sister-walks",
      title: ["妹妹学走路", "Little Sister Learns to Walk"],
      body: `妹妹一岁了，她想学走路。她拉着妈妈的手，慢慢地站了起来。她向前走了两步，一下子坐在了地上。

妹妹没有哭。她自己又站起来，向前走了五步，走到了奶奶身边。

奶奶笑着说：“妹妹会走路了！”我们都为她拍手。`,
      xp: 2,
      questions: [
        question(
          ["妹妹想学什么？", "What does the little sister want to learn?"],
          ["走路", "To walk"],
          [
            ["跳舞", "To dance"],
            ["读书", "To read"],
            ["写字", "To write"],
          ],
          ["第一段说：“她想学走路。”", "The first paragraph says she wants to learn to walk."],
        ),
        question(
          ["妹妹第一次走了几步就坐在了地上？", "How many steps does the little sister take before she first sits down?"],
          ["两步", "Two steps"],
          [
            ["五步", "Five steps"],
            ["七步", "Seven steps"],
            ["十步", "Ten steps"],
          ],
          [
            "第一段说：“她向前走了两步，一下子坐在了地上。”五步是第二次走的。",
            "The first paragraph says she walks two steps and sits down; the five steps come the second time.",
          ],
        ),
        question(
          ["妹妹走到了谁的身边？", "Whom does the little sister walk to?"],
          ["奶奶", "Grandma"],
          [
            ["妈妈", "Mum"],
            ["哥哥", "Her elder brother"],
            ["爸爸", "Dad"],
          ],
          ["第二段说：“走到了奶奶身边。”", "The second paragraph says she walks all the way to Grandma."],
        ),
      ],
    },
  ],
);

/** gradeOneAnimals is the reading unit of grade 1 about animals. */
const gradeOneAnimals = unit(
  1,
  "chinese-reading-1-animals",
  ["动物朋友", "Animal Friends"],
  [
    {
      id: "chinese-in-the-yard",
      title: ["院子里", "In the Yard"],
      body: `院子里，真热闹，
小鸟树上叫，
小兔草里跳，
小狗来回跑，
小猫睡大觉。
你也来，我也来，
大家都来笑一笑。`,
      xp: 2,
      questions: [
        question(
          ["谁在树上叫？", "Who is calling in the tree?"],
          ["小鸟", "The little bird"],
          [
            ["小兔", "The little rabbit"],
            ["小狗", "The puppy"],
            ["小猫", "The kitten"],
          ],
          ["儿歌说：“小鸟树上叫。”", "The rhyme says the little bird calls in the tree."],
        ),
        question(
          ["小猫在做什么？", "What is the kitten doing?"],
          ["睡大觉", "Having a long sleep"],
          [
            ["来回跑", "Running back and forth"],
            ["草里跳", "Jumping in the grass"],
            ["树上叫", "Calling in the tree"],
          ],
          ["儿歌说：“小猫睡大觉。”来回跑的是小狗。", "The rhyme says the kitten is fast asleep; it is the puppy that runs about."],
        ),
        question(
          ["小兔在哪里跳？", "Where is the little rabbit jumping?"],
          ["草里", "In the grass"],
          [
            ["树上", "In the tree"],
            ["河里", "In the river"],
            ["床上", "On the bed"],
          ],
          ["儿歌说：“小兔草里跳。”", "The rhyme says the little rabbit jumps in the grass."],
        ),
      ],
    },
    {
      id: "chinese-the-birds-new-home",
      title: ["小鸟的新家", "The Little Bird's New Home"],
      body: `秋天的一个夜里，刮了一场大风。第二天早上，我看见树上小鸟的家被风刮到了地上。

小鸟没有哭，也没有走。它飞来飞去，找来小草，又找来树叶，一点一点地做新家。

到了晚上，新家做好了。小鸟住进新家，唱起了歌。我想：家没了不要紧，再做一个就好了。`,
      xp: 2,
      questions: [
        question(
          ["大风过后，小鸟的家怎么了？", "What happened to the little bird's home after the storm?"],
          ["被风刮到了地上", "The wind blew it to the ground"],
          [
            ["被小猫拿走了", "A cat took it"],
            ["被大雨打湿了", "Heavy rain soaked it"],
            ["被哥哥拿下来了", "The elder brother took it down"],
          ],
          [
            "第一段说：“刮了一场大风……小鸟的家被风刮到了地上。”",
            "The first paragraph says the strong wind blew the bird's home to the ground.",
          ],
        ),
        question(
          ["小鸟用什么做新家？", "What does the bird build its new home with?"],
          ["小草和树叶", "Grass and leaves"],
          [
            ["石头和沙子", "Stones and sand"],
            ["纸和布", "Paper and cloth"],
            ["雪和冰", "Snow and ice"],
          ],
          ["第二段说：“找来小草，又找来树叶。”", "The second paragraph says the bird fetches grass and then leaves."],
        ),
        question(
          ["新家做好了，小鸟怎么样？", "What does the bird do once the new home is finished?"],
          ["住进新家，唱起了歌", "It moves in and starts to sing"],
          [
            ["哭了起来", "It starts to cry"],
            ["飞走了，再也没回来", "It flies away for good"],
            ["又把新家拆了", "It takes the new home apart"],
          ],
          ["第三段说：“小鸟住进新家，唱起了歌。”", "The third paragraph says the bird moves in and starts to sing."],
        ),
      ],
    },
    {
      id: "chinese-the-snow-dog",
      title: ["雪狗", "The Snow Dog"],
      body: `我家有一只小黄狗，叫黄黄。每天我去上学，黄黄都送我到门口。我放学回家，黄黄就跑过来，在我身边跳来跳去。

有一天下大雪，我回家晚了。走到门前，我看见一只“雪狗”。“雪狗”站起来，跳了一下——原来是黄黄！

我说：“黄黄，我回来了！”`,
      xp: 2,
      questions: [
        question(
          ["我家的小黄狗叫什么？", "What is our little yellow dog called?"],
          ["黄黄", "Huanghuang"],
          [
            ["雪雪", "Xuexue"],
            ["亮亮", "Liangliang"],
            ["花花", "Huahua"],
          ],
          ["第一句说：“我家有一只小黄狗，叫黄黄。”", "The first sentence says our little yellow dog is called Huanghuang."],
        ),
        question(
          ["我去上学时，黄黄送我到哪里？", "How far does Huanghuang see me off when I go to school?"],
          ["门口", "To the door"],
          [
            ["学校", "To school"],
            ["河边", "To the river"],
            ["公园", "To the park"],
          ],
          ["第一段说：“黄黄都送我到门口。”", "The first paragraph says Huanghuang sees me off at the door."],
        ),
        question(
          ["下大雪那天，门前的“雪狗”是谁？", "On the snowy day, who is the “snow dog” at the door?"],
          ["身上满是雪的黄黄", "Huanghuang covered in snow"],
          [
            ["哥哥做的雪人", "A snowman the brother made"],
            ["邻居家的白狗", "The neighbour's white dog"],
            ["一只小白兔", "A little white rabbit"],
          ],
          [
            "第二段说：“‘雪狗’站起来，跳了一下——原来是黄黄！”黄黄在门前等我，身上都是雪。",
            "The second paragraph says the snow dog stands up and jumps: it is Huanghuang, who waited in the snow.",
          ],
        ),
      ],
    },
  ],
);

/** gradeOneSeasons is the reading unit of grade 1 about the seasons and the weather. */
const gradeOneSeasons = unit(
  1,
  "chinese-reading-1-seasons",
  ["春夏秋冬", "Through the Year"],
  [
    {
      id: "chinese-the-spring-wind",
      title: ["春风", "The Spring Wind"],
      body: `春风暖，春雨下，
小草绿了树开花。
小鸟飞回大树上，
唱歌唱到我的家。
妹妹听了笑哈哈，
拉我出门去看它。`,
      xp: 2,
      questions: [
        question(
          ["儿歌里的春风怎么样？", "What is the spring wind like in the rhyme?"],
          ["暖", "Warm"],
          [
            ["冷", "Cold"],
            ["大", "Strong"],
            ["热", "Hot"],
          ],
          ["第一句说：“春风暖。”", "The first line says the spring wind is warm."],
        ),
        question(
          ["小鸟飞回了哪里？", "Where does the little bird fly back to?"],
          ["大树上", "The big tree"],
          [
            ["我的家里", "Into my home"],
            ["河里", "The river"],
            ["草里", "The grass"],
          ],
          ["儿歌说：“小鸟飞回大树上。”", "The rhyme says the bird flies back to the big tree."],
        ),
        question(
          ["妹妹听到鸟叫，做了什么？", "What does the little sister do when she hears the bird?"],
          ["拉我出门去看小鸟", "She pulls me outside to see the bird"],
          [
            ["关上了窗", "She shuts the window"],
            ["睡起了觉", "She goes to sleep"],
            ["哭了起来", "She starts to cry"],
          ],
          ["最后两句说：“妹妹听了笑哈哈，拉我出门去看它。”", "The last lines say she laughs and pulls me outside to see it."],
        ),
      ],
    },
    {
      id: "chinese-what-the-cicada-knows",
      title: ["知了知道什么", "What the Cicada Knows"],
      body: `夏天的下午，天很热。知了在树上叫个不停：“知了，知了。”

我问奶奶：“知了知道什么呀？”奶奶笑着说：“它知道夏天热呀！”

哥哥从冰箱里拿来西瓜，凉凉的，甜甜的。我们吃了西瓜，就不热了。我想：知了热不热呢？我要给它留一块西瓜！`,
      xp: 2,
      questions: [
        question(
          ["知了在哪里叫？", "Where is the cicada calling?"],
          ["树上", "In the tree"],
          [
            ["草里", "In the grass"],
            ["屋里", "In the house"],
            ["河边", "By the river"],
          ],
          ["第一段说：“知了在树上叫个不停。”", "The first paragraph says the cicada calls on and on in the tree."],
        ),
        question(
          ["奶奶说，知了知道什么？", "What does Grandma say the cicada knows?"],
          ["夏天热", "That summer is hot"],
          [
            ["春天暖", "That spring is warm"],
            ["秋天凉", "That autumn is cool"],
            ["西瓜甜", "That watermelon is sweet"],
          ],
          ["第二段奶奶说：“它知道夏天热呀！”", "In the second paragraph Grandma says it knows that summer is hot."],
        ),
        question(
          ["哥哥从冰箱里拿来了什么？", "What does the elder brother take out of the fridge?"],
          ["西瓜", "Watermelon"],
          [
            ["冰水", "Iced water"],
            ["鸡蛋", "Eggs"],
            ["牛奶", "Milk"],
          ],
          ["第三段说：“哥哥从冰箱里拿来西瓜。”", "The third paragraph says the brother takes watermelon from the fridge."],
        ),
      ],
    },
    {
      id: "chinese-frost-flowers",
      title: ["冰花", "Frost Flowers"],
      body: `冬天的早上，我醒来一看，窗上有好多冰花。冰花有的像小草，有的像星星，有的像大树。我对着窗户哈了一口气，冰花慢慢不见了。

太阳出来了，窗上的冰花都不见了。我想：冰花，冰花，明天再来呀！`,
      xp: 2,
      questions: [
        question(
          ["冬天的早上，我在窗上看见了什么？", "What do I see on the window on a winter morning?"],
          ["冰花", "Frost flowers"],
          [
            ["雪人", "A snowman"],
            ["小鸟", "A little bird"],
            ["红花", "Red flowers"],
          ],
          ["第一句说：“窗上有好多冰花。”", "The first sentence says there are many frost flowers on the window."],
        ),
        question(
          ["冰花像什么？", "What do the frost flowers look like?"],
          ["小草、星星和大树", "Grass, stars and big trees"],
          [
            ["小鸟、小鱼和小猫", "Birds, fish and kittens"],
            ["苹果、西瓜和桃", "Apples, watermelons and peaches"],
            ["月亮、太阳和云", "The moon, the sun and clouds"],
          ],
          [
            "第一段说：“冰花有的像小草，有的像星星，有的像大树。”",
            "The first paragraph says some look like grass, some like stars and some like big trees.",
          ],
        ),
        question(
          ["太阳出来以后，冰花怎么样了？", "What happens to the frost flowers when the sun comes out?"],
          ["都不见了", "They are all gone"],
          [
            ["变得更多了", "There are more of them"],
            ["变成了雪", "They turn into snow"],
            ["飞到了树上", "They fly into the tree"],
          ],
          [
            "第二段说：“太阳出来了，窗上的冰花都不见了。”",
            "The second paragraph says that when the sun comes out the frost flowers are all gone.",
          ],
        ),
      ],
    },
  ],
);

/** gradeTwoSchool is the reading unit of grade 2 about school and friends. */
const gradeTwoSchool = unit(
  2,
  "chinese-reading-2-school",
  ["校园和朋友", "School and Friends"],
  [
    {
      id: "chinese-off-to-school",
      title: ["上学堂", "Off to School"],
      body: `天刚亮，出太阳，
小鸟枝头把歌唱。
背起书包出家门，
开开心心上学堂。
见了老师问声好，
见了同学喜洋洋。
读书写字用心学，
我们一起来成长。`,
      xp: 3,
      questions: [
        question(
          ["小鸟在哪里唱歌？", "Where is the little bird singing?"],
          ["枝头", "On a branch"],
          [
            ["屋顶", "On the roof"],
            ["窗前", "In front of the window"],
            ["学校门口", "At the school gate"],
          ],
          ["儿歌第二句说：“小鸟枝头把歌唱。”", "The second line says the bird sings on a branch."],
        ),
        question(
          ["见了老师，我们怎样做？", "What do we do when we see the teacher?"],
          ["问声好", "Say hello"],
          [
            ["拉拉手", "Hold hands"],
            ["唱首歌", "Sing a song"],
            ["跑过去", "Run past"],
          ],
          ["儿歌说：“见了老师问声好。”", "The rhyme says we say hello when we see the teacher."],
        ),
        question(
          ["“见了同学喜洋洋”中，“喜洋洋”是什么意思？", "In “seeing classmates, all aglow with joy”, what does 喜洋洋 mean?"],
          ["非常高兴", "Very happy"],
          [
            ["有点害怕", "A little scared"],
            ["很不好意思", "Very shy"],
            ["急急忙忙", "In a great hurry"],
          ],
          [
            "前面说“开开心心上学堂”，见到同学当然也很开心，“喜洋洋”就是非常高兴的样子。",
            "The rhyme has just said we go to school happily; 喜洋洋 describes being full of joy at seeing classmates.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-new-classmate",
      title: ["新同学", "The New Classmate"],
      body: `星期一，我们班来了一位新同学，叫林小雨。她个子小小的，说话的声音也小小的。下课了，同学们都跑到操场上玩，林小雨一个人坐在座位上，看着窗外。

我走过去，问她：“你想和我们一起跳房子吗？”她点点头，笑了。

跳完房子，林小雨教我们玩她家乡的一种游戏，大家玩得可开心了。放学的时候，林小雨拉着我的手说：“谢谢你，我有新朋友了！”`,
      xp: 3,
      questions: [
        question(
          ["新同学叫什么名字？", "What is the new classmate's name?"],
          ["林小雨", "Lin Xiaoyu"],
          [
            ["林小云", "Lin Xiaoyun"],
            ["王小雨", "Wang Xiaoyu"],
            ["李小林", "Li Xiaolin"],
          ],
          ["第一段说：“我们班来了一位新同学，叫林小雨。”", "The first paragraph says the new classmate is called Lin Xiaoyu."],
        ),
        question(
          ["下课时，林小雨在做什么？", "What is Lin Xiaoyu doing at break?"],
          ["一个人坐在座位上看窗外", "Sitting alone at her desk, looking out of the window"],
          [
            ["在操场上跳房子", "Playing hopscotch on the playground"],
            ["和同学们一起跑步", "Running with the other children"],
            ["在教大家做游戏", "Teaching everyone a game"],
          ],
          [
            "第一段说：“林小雨一个人坐在座位上，看着窗外。”跳房子和教游戏是后来的事。",
            "The first paragraph says she sits alone at her desk looking out; the hopscotch and the game come later.",
          ],
        ),
        question(
          ["这篇短文主要讲了什么？", "What is the passage mainly about?"],
          ["我请新同学一起玩，她有了新朋友", "I invite the new classmate to play, and she makes new friends"],
          [
            ["林小雨的家乡在哪里", "Where Lin Xiaoyu's hometown is"],
            ["怎样跳房子跳得好", "How to play hopscotch well"],
            ["我们班星期一上了什么课", "Which lessons our class had on Monday"],
          ],
          [
            "短文先写林小雨一个人坐着，再写我请她跳房子，最后她说：“我有新朋友了！”",
            "It tells how she sat alone, how I asked her to play hopscotch with us, and ends with her saying she has new friends.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-class-goldfish",
      title: ["班里的金鱼", "The Class Goldfish"],
      body: `教室的窗台上有一个鱼缸，里面住着两条金鱼，一条红的，一条黑的。红的叫“火苗”，黑的叫“墨点”。

老师说，大家轮流照顾金鱼。轮到我那天，我早早来到学校，先给金鱼换水，再放一点鱼食。老师还说，鱼食不能多放，吃多了金鱼会生病。

我蹲在鱼缸边上看。“火苗”游得快，“墨点”游得慢，它们吐出一串串小泡泡，好像在说：“谢谢你！”`,
      xp: 3,
      questions: [
        question(
          ["黑色的金鱼叫什么？", "What is the black goldfish called?"],
          ["墨点", "Inky"],
          [
            ["火苗", "Flame"],
            ["泡泡", "Bubbles"],
            ["小黑", "Blackie"],
          ],
          ["第一段说：“红的叫‘火苗’，黑的叫‘墨点’。”", "The first paragraph says the red one is Flame and the black one is Inky."],
        ),
        question(
          ["为什么鱼食不能多放？", "Why must we not put in too much food?"],
          ["金鱼吃多了会生病", "The goldfish get ill if they eat too much"],
          [
            ["鱼食太贵了", "Fish food is too expensive"],
            ["鱼缸会装不下", "The tank would overflow"],
            ["金鱼不爱吃鱼食", "Goldfish don't like fish food"],
          ],
          ["第二段说：“鱼食不能多放，吃多了金鱼会生病。”", "The second paragraph says too much food makes the goldfish ill."],
        ),
        question(
          ["“大家轮流照顾金鱼”中，“轮流”是什么意思？", "In “everyone takes turns to look after the goldfish”, what does 轮流 mean?"],
          ["一个接一个，按次序来做", "One after another, in turn"],
          [
            ["大家一起同时做", "Everyone does it at the same time"],
            ["只让老师一个人做", "Only the teacher does it"],
            ["谁想做就做", "Whoever wants to does it"],
          ],
          [
            "文中说“轮到我那天”，可见每天由一个同学照顾，一个接一个，这就是轮流。",
            "The passage says “on my day”, so one child looks after them each day in turn: that is 轮流.",
          ],
        ),
      ],
    },
  ],
);

/** gradeTwoGarden is the reading unit of grade 2 about plants and small creatures. */
const gradeTwoGarden = unit(
  2,
  "chinese-reading-2-garden",
  ["小小菜园", "The Little Garden"],
  [
    {
      id: "chinese-in-the-vegetable-patch",
      title: ["菜园里", "In the Vegetable Patch"],
      body: `菜园里，真热闹，
青菜排队弯弯腰。
黄瓜顺着架子爬，
茄子穿上紫外套。
土豆躲在泥土里，
露出绿叶摇呀摇。
我给菜园浇浇水，
大家长得高又高。`,
      xp: 3,
      questions: [
        question(
          ["谁穿上了紫外套？", "Who has put on a purple coat?"],
          ["茄子", "The aubergine"],
          [
            ["青菜", "The greens"],
            ["黄瓜", "The cucumber"],
            ["土豆", "The potato"],
          ],
          ["儿歌说：“茄子穿上紫外套。”", "The rhyme says the aubergine has put on a purple coat."],
        ),
        question(
          ["土豆躲在哪里？", "Where is the potato hiding?"],
          ["泥土里", "In the soil"],
          [
            ["架子上", "On the trellis"],
            ["水里", "In the water"],
            ["青菜下面", "Under the greens"],
          ],
          ["儿歌说：“土豆躲在泥土里，露出绿叶摇呀摇。”", "The rhyme says the potato hides in the soil with its green leaves showing."],
        ),
        question(
          ["这首儿歌主要写了什么？", "What is the rhyme mainly about?"],
          ["菜园里的菜长得好，很热闹", "The vegetables in the garden grow well and it is lively"],
          [
            ["怎样做一盘好吃的菜", "How to cook a tasty dish"],
            ["茄子为什么是紫色的", "Why aubergines are purple"],
            ["菜园里来了很多小鸟", "Many birds come to the garden"],
          ],
          [
            "儿歌第一句说“菜园里，真热闹”，接着写青菜、黄瓜、茄子、土豆，最后说“大家长得高又高”。",
            "It begins by saying the garden is lively, describes each vegetable, and ends with all of them growing tall.",
          ],
        ),
      ],
    },
    {
      id: "chinese-a-pot-of-garlic",
      title: ["一盆蒜苗", "A Pot of Garlic Shoots"],
      body: `妈妈给了我几颗蒜，让我种在小花盆里。我把蒜尖尖的一头朝上，轻轻按进土里，再浇了一点水。

第二天，我跑去看，土里什么也没有。第三天，还是什么也没有。我有点着急，妈妈笑着说：“别急，蒜在土里喝水呢。”

过了几天，土里冒出了一根根绿色的小芽，像一排小小的士兵。蒜苗长得可快了，一天比一天高。

那天，妈妈剪下蒜苗，炒了一盘蒜苗鸡蛋。我吃得特别香。`,
      xp: 3,
      questions: [
        question(
          ["我把蒜种在了哪里？", "Where do I plant the garlic?"],
          ["小花盆里", "In a small flowerpot"],
          [
            ["菜园里", "In the vegetable garden"],
            ["水杯里", "In a glass of water"],
            ["学校里", "At school"],
          ],
          ["第一段说：“让我种在小花盆里。”", "The first paragraph says Mum has me plant it in a small flowerpot."],
        ),
        question(
          ["第二天和第三天，我为什么着急？", "Why am I worried on the second and third days?"],
          ["土里什么也没有长出来", "Nothing has come up from the soil"],
          [
            ["蒜苗长得太高了", "The shoots have grown too tall"],
            ["花盆被打破了", "The pot has been broken"],
            ["妈妈把蒜苗剪了", "Mum has cut the shoots"],
          ],
          ["第二段说：“土里什么也没有……我有点着急。”", "The second paragraph says there is nothing in the soil, so I grow anxious."],
        ),
        question(
          ["文中把刚冒出的蒜苗比作什么？", "What does the passage compare the new shoots to?"],
          ["一排小小的士兵", "A row of little soldiers"],
          [
            ["一串小泡泡", "A string of little bubbles"],
            ["一群小蜜蜂", "A swarm of little bees"],
            ["一根根小草", "Blades of grass"],
          ],
          ["第三段说：“像一排小小的士兵。”", "The third paragraph says they are like a row of little soldiers."],
        ),
      ],
    },
    {
      id: "chinese-the-bee-and-the-peach-blossom",
      title: ["蜜蜂和桃花", "The Bee and the Peach Blossom"],
      body: `春天，桃花开了，粉红粉红的，一朵挨着一朵。一群蜜蜂飞来了，在花间忙个不停。

蜜蜂爬进花里，用长长的嘴吸花蜜。它的身上、腿上都是黄色的花粉。它从这朵花飞到那朵花，就把花粉带了过去。

爷爷说，有了蜜蜂帮忙，桃花谢了以后，才能结出又大又甜的桃子。原来，蜜蜂不光会采蜜，还是花儿的好朋友呢！`,
      xp: 3,
      questions: [
        question(
          ["蜜蜂用什么吸花蜜？", "What does the bee use to sip nectar?"],
          ["长长的嘴", "Its long mouth"],
          [
            ["它的腿", "Its legs"],
            ["它的翅膀", "Its wings"],
            ["黄色的花粉", "The yellow pollen"],
          ],
          ["第二段说：“用长长的嘴吸花蜜。”", "The second paragraph says the bee sips nectar with its long mouth."],
        ),
        question(
          ["“在花间忙个不停”中，“忙个不停”是什么意思？", "In “busy without stopping among the flowers”, what does 忙个不停 mean?"],
          ["一直在忙，不停下来", "Busy all the time, never stopping"],
          [
            ["想停又停不下来", "Wanting to stop but unable to"],
            ["忙了一会儿就休息", "Busy for a moment, then resting"],
            ["什么事也不做", "Doing nothing at all"],
          ],
          [
            "第二段写蜜蜂爬进花里，又从这朵飞到那朵，一刻也不停，这就是“忙个不停”。",
            "The next paragraph shows the bees going from flower to flower without a pause: that is 忙个不停.",
          ],
        ),
        question(
          ["这篇短文主要讲了什么？", "What is the passage mainly about?"],
          [
            "蜜蜂采蜜时帮桃花传花粉，是花的好朋友",
            "Bees carry pollen for the peach blossom as they gather nectar, so they are its friends",
          ],
          [
            ["桃花是什么颜色的", "What colour peach blossom is"],
            ["爷爷家种了很多桃树", "Grandpa grows many peach trees"],
            ["怎样做又甜又香的蜂蜜", "How to make sweet honey"],
          ],
          [
            "短文写蜜蜂把花粉从这朵花带到那朵花，最后说：“蜜蜂不光会采蜜，还是花儿的好朋友呢！”",
            "It shows bees carrying pollen between flowers and ends by calling them the flowers' good friends.",
          ],
        ),
      ],
    },
  ],
);

/** gradeTwoHelping is the reading unit of grade 2 about helping one another. */
const gradeTwoHelping = unit(
  2,
  "chinese-reading-2-helping",
  ["互相帮助", "Helping Each Other"],
  [
    {
      id: "chinese-my-two-hands",
      title: ["我的小手", "My Two Hands"],
      body: `我有一双小小手，
十个手指本领大。
帮着奶奶洗洗碗，
帮着爷爷浇浇花。
弟弟摔倒扶起他，
人人夸我好娃娃。`,
      xp: 3,
      questions: [
        question(
          ["我帮爷爷做什么？", "What do I help Grandpa do?"],
          ["浇花", "Water the flowers"],
          [
            ["洗碗", "Wash the dishes"],
            ["扫地", "Sweep the floor"],
            ["做饭", "Cook"],
          ],
          ["儿歌说：“帮着爷爷浇浇花。”洗碗是帮奶奶。", "The rhyme says I help Grandpa water the flowers; the dishes are for Grandma."],
        ),
        question(
          ["弟弟摔倒了，我怎样做？", "What do I do when my little brother falls?"],
          ["把他扶起来", "Help him up"],
          [
            ["笑他", "Laugh at him"],
            ["去叫妈妈", "Go and call Mum"],
            ["自己走开", "Walk away"],
          ],
          ["儿歌说：“弟弟摔倒扶起他。”", "The rhyme says that when my brother falls I help him up."],
        ),
        question(
          ["“十个手指本领大”中，“本领大”是什么意思？", "In “ten fingers with great skill”, what does 本领大 mean?"],
          ["会做很多事", "Able to do many things"],
          [
            ["长得很大", "Very big in size"],
            ["力气很小", "Very weak"],
            ["很爱玩", "Very fond of play"],
          ],
          [
            "儿歌接着写小手会洗碗、浇花、扶弟弟，能做很多事，这就是“本领大”。",
            "The rhyme goes on to list washing dishes, watering flowers and helping a brother up: many things, which is 本领大.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-red-mitten",
      title: ["红手套", "The Red Mitten"],
      body: `冬天的一个下午，我和妈妈从公园回家。路边的长椅上，放着一只红色的小手套。

“是哪个小朋友丢的呢？”我想。要是放在椅子上，可能会被风吹走。我把手套挂在长椅旁的小树枝上，红红的，很远就能看见。

第二天，我又路过那里，手套不见了。树枝上挂着一张小纸条，上面写着：“谢谢你帮我找到手套！”我心里暖暖的。`,
      xp: 3,
      questions: [
        question(
          ["我在哪里看见了红手套？", "Where do I see the red mitten?"],
          ["路边的长椅上", "On a bench by the road"],
          [
            ["公园的草地上", "On the grass in the park"],
            ["学校的门口", "At the school gate"],
            ["家门前的树下", "Under the tree outside home"],
          ],
          ["第一段说：“路边的长椅上，放着一只红色的小手套。”", "The first paragraph says the little red mitten is on a bench by the road."],
        ),
        question(
          ["我为什么把手套挂在树枝上？", "Why do I hang the mitten on the branch?"],
          ["怕被风吹走，挂高了很远就能看见", "So the wind won't blow it away and it can be seen from far off"],
          [
            ["我想把手套带回家", "I want to take it home"],
            ["树枝上挂着很好看", "It looks pretty on the branch"],
            ["妈妈让我挂的", "Mum tells me to"],
          ],
          [
            "第二段说：“要是放在椅子上，可能会被风吹走。”挂在树枝上，“很远就能看见”。",
            "The second paragraph says the wind might blow it off the bench, and on the branch it can be seen from far away.",
          ],
        ),
        question(
          ["这篇短文主要讲了什么？", "What is the passage mainly about?"],
          ["我帮丢手套的人找回了手套", "I help someone get back a lost mitten"],
          [
            ["我和妈妈去公园玩", "Mum and I go to play in the park"],
            ["冬天怎样不让手冻着", "How to keep hands warm in winter"],
            ["我丢了一只手套", "I lose a mitten"],
          ],
          [
            "短文写我把捡到的手套挂起来，第二天丢手套的人留下纸条：“谢谢你帮我找到手套！”",
            "It tells how I hang up the mitten I found, and the owner leaves a note thanking me for helping find it.",
          ],
        ),
      ],
    },
    {
      id: "chinese-everybodys-path",
      title: ["大家路", "Everybody's Path"],
      body: `一场大雨过后，森林里的小路到处是坑。小兔走路摔倒了，小鸭的脚掉进了泥坑。

小猪看见了，心想：我来把路修一修吧！他推来一车小石子，把坑一个一个填平。

小熊路过，问：“小猪，你在干什么？”小猪说：“修路呀！”小熊说：“我也来帮忙！”后来，小羊、小猴也都来了。

没过几天，小路变得又平又宽。大家给这条路起了个名字，叫“大家路”。`,
      xp: 3,
      questions: [
        question(
          ["大雨过后，小路怎样了？", "What is the path like after the heavy rain?"],
          ["到处是坑", "Full of holes and puddles"],
          [
            ["又平又宽", "Flat and wide"],
            ["被大水冲走了", "Washed away by the flood"],
            ["长满了小草", "Covered in grass"],
          ],
          [
            "第一段说：“森林里的小路到处是坑。”又平又宽是修好以后的样子。",
            "The first paragraph says the path is full of holes; flat and wide is how it looks once mended.",
          ],
        ),
        question(
          ["谁最先想到修路？", "Who first thinks of mending the path?"],
          ["小猪", "Piglet"],
          [
            ["小熊", "Little Bear"],
            ["小兔", "Little Rabbit"],
            ["小猴", "Little Monkey"],
          ],
          ["第二段说：“小猪看见了，心想：我来把路修一修吧！”", "The second paragraph says Piglet sees the path and decides to mend it."],
        ),
        question(
          ["这条路为什么叫“大家路”？", "Why is the path called Everybody's Path?"],
          ["它是大家一起修好的", "Everyone mended it together"],
          [
            ["大家都住在路边", "Everyone lives beside it"],
            ["它是森林里最大的路", "It is the biggest path in the forest"],
            ["小猪不让别人走", "Piglet won't let anyone else use it"],
          ],
          [
            "小猪先修，后来小熊、小羊、小猴“也都来了”。路是大家修的，所以叫“大家路”。",
            "Piglet starts, and Bear, Lamb and Monkey all join in; everyone built it, so it is Everybody's Path.",
          ],
        ),
      ],
    },
  ],
);

/** earlyReading are the reading units of grades 1 and 2, with the grade that offers each. */
export const earlyReading: readonly { readonly grade: number; readonly unit: ReadingUnitDef }[] = [
  { grade: 1, unit: gradeOneHome },
  { grade: 1, unit: gradeOneAnimals },
  { grade: 1, unit: gradeOneSeasons },
  { grade: 2, unit: gradeTwoSchool },
  { grade: 2, unit: gradeTwoGarden },
  { grade: 2, unit: gradeTwoHelping },
];
