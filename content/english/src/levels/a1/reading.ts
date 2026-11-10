// The reading units of A1, one on each theme: notes, messages, short descriptions and dialogues in the words of
// Pre-A1 and A1.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { vocabulary as preA1 } from "../pre-a1/topics.ts";
import { vocabulary } from "./topics.ts";

const words = [...preA1, ...vocabulary];

const aboutMe = passageMaker(words, [
  "a1-words-numbers-to-hundred",
  "a1-words-about-me",
  "a1-words-feelings",
  "a1-words-everyday-words",
  "present-simple",
]);

/** readingAllAboutMe is the reading unit of the theme All About Me: names, countries, languages, ages and feelings. */
const readingAllAboutMe: ReadingUnitDef = {
  id: "a1-reading-all-about-me",
  title: t("All About Me", "关于我"),
  passages: [
    aboutMe({
      id: "a1-me-a-student-from-canada",
      title: ["A Student from Canada", "从加拿大来的学生"],
      body: `Hello! My name is Emma Brown. I'm thirteen years old, and I'm from Canada.

I live in Beijing now with my mother and father. My father works here. Beijing is a very big city, and I like it.

I speak English and French. I don't speak Chinese, but I want to learn it. My new friend Li Na helps me. She speaks Chinese and English.

I feel happy here, but sometimes I'm tired. Life in a new country is not easy, but it is great!`,
      grammar: ["present-simple"],
      names: ["Emma", "Brown", "Canada", "Beijing", "French", "Li", "Na"],
      questions: [
        [
          ["Where is Emma from?", "埃玛是哪里人？"],
          ["Canada", "加拿大"],
          [
            ["China", "中国"],
            ["France", "法国"],
          ],
          ['Emma says: "I\'m from Canada."', "Emma 说：“I'm from Canada.”"],
        ],
        [
          ["Why does Emma live in Beijing?", "埃玛为什么住在北京？"],
          ["Her father works there", "她爸爸在那里工作"],
          [
            ["She wants to learn Chinese", "她想学中文"],
            ["Her friend Li Na lives there", "她的朋友李娜住在那里"],
          ],
          [
            'Emma says: "I live in Beijing now with my mother and father. My father works here."',
            "Emma 说她和父母住在北京，因为她爸爸在这里工作。",
          ],
        ],
        [
          ["Which languages does Emma speak?", "埃玛会说哪些语言？"],
          ["English and French", "英语和法语"],
          [
            ["English and Chinese", "英语和中文"],
            ["Chinese and French", "中文和法语"],
          ],
          ['Emma says: "I speak English and French. I don\'t speak Chinese."', "Emma 说她会说英语和法语，不会说中文。"],
        ],
      ],
    }),
    aboutMe({
      id: "a1-me-pen-friends",
      title: ["Pen Friends", "笔友"],
      body: `Hi Lucas,

My name is Zhang Wei, and I'm your new pen friend. I'm twelve years old. I live in Shanghai, a city in China. I have one sister. She is eighteen.

I speak Chinese, and I'm learning English at school. My English isn't great, but I want to speak it well.

What's your life like in Brazil? How old are you? Do you speak English or Portuguese at home? Please write to me again. My email is on the card.

Your friend,
Zhang Wei`,
      grammar: ["present-simple"],
      names: ["Lucas", "Zhang", "Wei", "Shanghai", "China", "Brazil", "Portuguese"],

      questions: [
        [
          ["Where does Zhang Wei live?", "张伟住在哪里？"],
          ["In Shanghai, China", "中国上海"],
          [
            ["In Brazil", "巴西"],
            ["In Beijing, China", "中国北京"],
          ],
          ['Zhang Wei writes: "I live in Shanghai, a city in China."', "张伟写道：“I live in Shanghai, a city in China.”"],
        ],
        [
          ["How old is his sister?", "他的姐姐几岁？"],
          ["Eighteen", "十八岁"],
          [
            ["Twelve", "十二岁"],
            ["Thirteen", "十三岁"],
          ],
          ['He writes: "I have one sister. She is eighteen."', "他写道：“I have one sister. She is eighteen.”"],
        ],
        [
          ["What does Zhang Wei want Lucas to do?", "张伟希望卢卡斯做什么？"],
          ["Write to him again", "再给他写信"],
          [
            ["Come to Shanghai", "来上海"],
            ["Learn Chinese", "学中文"],
          ],
          ['He writes: "Please write to me again."', "他写道：“Please write to me again.”"],
        ],
      ],
    }),
    aboutMe({
      id: "a1-me-languages-in-our-class",
      title: ["Languages in Our Class", "我们班说的语言"],
      body: `There are twenty students in our class, and we speak many languages.

Ana is from Spain. She speaks Spanish and English. Tom and Kate are from London, so they speak English. Ahmed lives with his family in Cairo, and he speaks Arabic at home. Five students are from China, and they speak Chinese.

I'm Ming. I speak Chinese with my family and English at school. My grandma speaks Cantonese, and I'm learning it from her.

Everyone in our class speaks English. It is the language of our school.`,
      grammar: ["present-simple"],
      names: ["Ana", "Spain", "Spanish", "Tom", "Kate", "London", "Ahmed", "Cairo", "Arabic", "China", "Ming", "Cantonese"],
      questions: [
        [
          ["How many students are in the class?", "班上有多少学生？"],
          ["Twenty", "二十个"],
          [
            ["Fifteen", "十五个"],
            ["Five", "五个"],
          ],
          ['The first line says: "There are twenty students in our class."', "第一句说：“There are twenty students in our class.”"],
        ],
        [
          ["What language does Ahmed speak at home?", "艾哈迈德在家说什么语言？"],
          ["Arabic", "阿拉伯语"],
          [
            ["English", "英语"],
            ["Spanish", "西班牙语"],
          ],
          ['The passage says: "he speaks Arabic at home."', "文中说：“he speaks Arabic at home.”"],
        ],
        [
          ["Who is Ming learning Cantonese from?", "明在跟谁学粤语？"],
          ["His grandma", "他的奶奶"],
          [
            ["His teacher", "他的老师"],
            ["Ana", "安娜"],
          ],
          ['Ming says: "My grandma speaks Cantonese, and I\'m learning it from her."', "明说奶奶会说粤语，他正在跟她学。"],
        ],
      ],
    }),
    aboutMe({
      id: "a1-me-how-old-are-you",
      title: ["How Old Are You?", "你多大了？"],
      body: `How old is everyone in my family?

My brother Leo is four. He thinks he is a big boy! My sister Rosa is sixteen, and she wants a phone for her birthday. I'm fourteen.

My mother is forty, and my father is fifty. My grandpa is eighty, and my grandma is seventy. They live near us.

How old is our dog, Max? He is twelve. For a dog, that is old! He sleeps a lot, but he is happy.`,
      grammar: ["present-simple"],
      names: ["Leo", "Rosa", "Max"],
      questions: [
        [
          ["How old is the writer?", "作者几岁？"],
          ["Fourteen", "十四岁"],
          [
            ["Sixteen", "十六岁"],
            ["Four", "四岁"],
          ],
          ['The writer says: "I\'m fourteen."', "作者说：“I'm fourteen.”"],
        ],
        [
          ["What does Rosa want for her birthday?", "罗莎生日想要什么？"],
          ["A phone", "一部手机"],
          [
            ["A dog", "一只狗"],
            ["A book", "一本书"],
          ],
          ['The writer says: "she wants a phone for her birthday."', "作者说：“she wants a phone for her birthday.”"],
        ],
        [
          ["How old is Grandma?", "奶奶多大年纪？"],
          ["Seventy", "七十岁"],
          [
            ["Eighty", "八十岁"],
            ["Forty", "四十岁"],
          ],
          ['The passage says: "my grandma is seventy." Grandpa is eighty.', "文中说奶奶七十岁，爷爷八十岁。"],
        ],
      ],
    }),
    aboutMe({
      id: "a1-me-a-phone-number",
      title: ["A Phone Number", "一个电话号码"],
      body: `Sara: Hi, Jack! Can I have your phone number?

Jack: Sure. It's 0-7-9-1-5, 4-4-6-2-8.

Sara: Sorry, can you say it again, please?

Jack: Zero, seven, nine, one, five, then four, four, six, two, eight.

Sara: Thank you. And what's your email?

Jack: It's on my card. Here, take it. And what's your number?

Sara: I don't have a phone. My mom has one. Her number is on this paper.

Jack: Thanks! I call you this evening.`,
      grammar: ["present-simple"],
      names: ["Sara", "Jack"],
      questions: [
        [
          ["What does Sara ask Jack for first?", "萨拉先向杰克要什么？"],
          ["His phone number", "他的电话号码"],
          [
            ["His email", "他的电子邮箱"],
            ["His card", "他的名片"],
          ],
          ['Sara says: "Can I have your phone number?"', "Sara 说：“Can I have your phone number?”"],
        ],
        [
          ["Why does Jack say his number again?", "杰克为什么把号码又说了一遍？"],
          ["Sara asks him to", "萨拉请他再说一遍"],
          [
            ["It is a new number", "这是个新号码"],
            ["He says it wrong the first time", "他第一次说错了"],
          ],
          ['Sara says: "Sorry, can you say it again, please?"', "Sara 说：“Sorry, can you say it again, please?”"],
        ],
        [
          ["Whose number does Sara give Jack?", "萨拉给了杰克谁的号码？"],
          ["Her mom's", "她妈妈的"],
          [
            ["Her own", "她自己的"],
            ["Her dad's", "她爸爸的"],
          ],
          ["Sara says: \"I don't have a phone. My mom has one. Here's her number.\"", "Sara 说她没有手机，妈妈有，于是给了妈妈的号码。"],
        ],
      ],
    }),
    aboutMe({
      id: "a1-me-my-city",
      title: ["My City", "我的城市"],
      body: `I live in Hangzhou. It is a big city in China, and a lot of people live there.

My favorite place in the city is the West Lake. It is beautiful in every season. People walk by the lake, and old men play chess there.

My school is near the lake, so I see it every day. My mother and father work in the city, and we live in an apartment on the fifth floor.

I love my city. It is my home, and it is a great place to live.`,
      grammar: ["present-simple"],
      names: ["Hangzhou", "China", "West", "Lake"],
      questions: [
        [
          ["Where is Hangzhou?", "杭州在哪里？"],
          ["In China", "在中国"],
          [
            ["Near Beijing", "在北京附近"],
            ["In the West Lake", "在西湖里"],
          ],
          ['The writer says: "It is a big city in China."', "作者说：“It is a big city in China.”"],
        ],
        [
          ["What do old men do by the lake?", "老人们在湖边做什么？"],
          ["Play chess", "下棋"],
          [
            ["Swim", "游泳"],
            ["Sell things", "卖东西"],
          ],
          ['The writer says: "old men play chess there."', "作者说：“old men play chess there.”"],
        ],
        [
          ["Which floor does the writer live on?", "作者住在几楼？"],
          ["The fifth floor", "五楼"],
          [
            ["The first floor", "一楼"],
            ["The tenth floor", "十楼"],
          ],
          ['The writer says: "we live in an apartment on the fifth floor."', "作者说：“we live in an apartment on the fifth floor.”"],
        ],
      ],
    }),
    aboutMe({
      id: "a1-me-how-do-you-feel-today",
      title: ["How Do You Feel Today?", "你今天感觉怎么样？"],
      body: `Teacher: Good morning, everyone! How do you feel today?

Lily: I feel great! It's my birthday.

Teacher: Happy birthday, Lily! And you, Ben?

Ben: I'm tired. I go to bed late on Sundays.

Teacher: I'm sorry. And you, Mia? You look sad.

Mia: I'm okay, but I'm afraid. We have a math test today.

Teacher: You know your math. You can do it! And how is Sam?

Ben: Sam is sick. He isn't at school.

Teacher: I'm sorry to hear that. I hope he feels well again.`,
      grammar: ["present-simple"],
      names: ["Lily", "Ben", "Mia", "Sam"],
      questions: [
        [
          ["Why does Lily feel great?", "莉莉为什么感觉很好？"],
          ["It is her birthday", "今天是她的生日"],
          [
            ["She has a math test", "她有数学考试"],
            ["She went to bed early", "她睡得早"],
          ],
          ['Lily says: "I feel great! It\'s my birthday."', "Lily 说：“I feel great! It's my birthday.”"],
        ],
        [
          ["Why is Mia afraid?", "米娅为什么害怕？"],
          ["They have a math test today", "今天有数学考试"],
          [
            ["She is sick", "她生病了"],
            ["She is late for school", "她上学迟到了"],
          ],
          ['Mia says: "I\'m afraid. We have a math test today."', "Mia 说：“I'm afraid. We have a math test today.”"],
        ],
        [
          ["Why is Sam not at school?", "萨姆为什么没来上学？"],
          ["He is sick", "他生病了"],
          [
            ["He is tired", "他很累"],
            ["It is his birthday", "今天是他的生日"],
          ],
          ['Ben says: "Sam is sick. He isn\'t at school."', "Ben 说：“Sam is sick. He isn't at school.”"],
        ],
      ],
    }),
  ],
};

const myDay = passageMaker(words, [
  "a1-words-my-day",
  "a1-words-times-of-day",
  "a1-words-how-often",
  "a1-words-little-words-1",
  "third-person-s",
  "adverbs-of-frequency",
]);

/** readingMyDay is the reading unit of the theme My Day: routines from morning to night. */
const readingMyDay: ReadingUnitDef = {
  id: "a1-reading-my-day",
  title: t("My Day", "我的一天"),
  passages: [
    myDay({
      id: "a1-day-a-busy-monday",
      title: ["A Busy Monday", "忙碌的星期一"],
      body: `On Monday I get up at six o'clock. I brush my hair, and I have breakfast with my sister. We usually have eggs and bread.

Then I go to school. School starts at eight. In the morning I have English and math, and in the afternoon I have art.

After school I play football with my friends in the park. I come home at five, and I do my homework before dinner.

In the evening I watch TV for an hour. I go to bed at nine, and I sleep well. Monday is a busy day!`,
      grammar: ["adverbs-of-frequency", "present-simple"],
      questions: [
        [
          ["When does the writer get up on Monday?", "作者星期一几点起床？"],
          ["At six o'clock", "六点"],
          [
            ["At eight o'clock", "八点"],
            ["At five o'clock", "五点"],
          ],
          ['The first line says: "On Monday I get up at six o\'clock."', "第一句说：“On Monday I get up at six o'clock.”"],
        ],
        [
          ["What does the writer do after school?", "作者放学后做什么？"],
          ["Plays football in the park", "在公园踢足球"],
          [
            ["Watches TV for an hour", "看一小时电视"],
            ["Has art", "上美术课"],
          ],
          [
            'The third paragraph says: "After school I play football with my friends in the park."',
            "第三段说放学后作者和朋友在公园踢足球。",
          ],
        ],
        [
          ["When does the writer do homework?", "作者什么时候做作业？"],
          ["Before dinner", "晚饭前"],
          [
            ["After dinner", "晚饭后"],
            ["In the morning", "早上"],
          ],
          ['The passage says: "I do my homework before dinner."', "文中说：“I do my homework before dinner.”"],
        ],
      ],
    }),
    myDay({
      id: "a1-day-a-farmers-morning",
      title: ["A Farmer's Morning", "农夫的早晨"],
      body: `Mr Green is a farmer. He gets up very early, at five o'clock, before the sun comes up. He drinks a cup of tea, and then he goes out to his animals.

First he gives the cows their food. Then he gets the eggs from the chickens. His dog, Bob, always comes with him.

At seven o'clock he comes back into the kitchen. Mrs Green cooks breakfast, and they eat together. After breakfast Mr Green works on the farm all morning. He is always busy, but he is happy. He loves his life on the farm.`,
      grammar: ["third-person-s"],
      names: ["Mr", "Mrs", "Green", "Bob"],
      questions: [
        [
          ["Why does Mr Green get up at five?", "格林先生为什么五点起床？"],
          ["He is a farmer, and his animals need him", "他是农夫，要照顾动物"],
          [
            ["He goes to school", "他要去上学"],
            ["He watches TV", "他要看电视"],
          ],
          ['The passage says he is a farmer, and after his tea "he goes out to his animals."', "文中说他是农夫，喝完茶就出去照顾动物。"],
        ],
        [
          ["What does he get from the chickens?", "他从鸡那里拿到什么？"],
          ["Eggs", "鸡蛋"],
          [
            ["Milk", "牛奶"],
            ["Food", "饲料"],
          ],
          ['The passage says: "Then he gets the eggs from the chickens."', "文中说：“Then he gets the eggs from the chickens.”"],
        ],
        [
          ["Who cooks breakfast?", "谁做早饭？"],
          ["Mrs Green", "格林太太"],
          [
            ["Mr Green", "格林先生"],
            ["Nobody", "没有人"],
          ],
          [
            'The passage says: "Mrs Green cooks breakfast, and they eat together."',
            "文中说：“Mrs Green cooks breakfast, and they eat together.”",
          ],
        ],
      ],
    }),
    myDay({
      id: "a1-day-a-night-nurse",
      title: ["A Night Nurse", "夜班护士"],
      body: `Anna is a nurse, but her day is different. She works at night!

She goes to the hospital at eight in the evening, and she finishes work at seven in the morning. At night she helps sick people. Sometimes they can't sleep, and she talks with them.

In the morning Anna comes home. She has breakfast, and then she goes to bed. She sleeps from nine in the morning to three in the afternoon.

In the afternoon she plays with her children. Then she has dinner, and she goes to work again.`,
      grammar: ["third-person-s", "adverbs-of-frequency"],
      names: ["Anna"],
      questions: [
        [
          ["When does Anna start work?", "安娜几点开始工作？"],
          ["At eight in the evening", "晚上八点"],
          [
            ["At seven in the morning", "早上七点"],
            ["At three in the afternoon", "下午三点"],
          ],
          [
            'The passage says: "She goes to the hospital at eight in the evening."',
            "文中说：“She goes to the hospital at eight in the evening.”",
          ],
        ],
        [
          ["What does Anna do when people can't sleep?", "病人睡不着时，安娜做什么？"],
          ["She talks with them", "她和他们聊天"],
          [
            ["She goes to bed", "她去睡觉"],
            ["She has breakfast", "她吃早饭"],
          ],
          [
            'The passage says: "Sometimes they can\'t sleep, and she talks with them."',
            "文中说：“Sometimes they can't sleep, and she talks with them.”",
          ],
        ],
        [
          ["When does Anna sleep?", "安娜什么时候睡觉？"],
          ["From nine in the morning to three in the afternoon", "从早上九点到下午三点"],
          [
            ["From eight in the evening to seven in the morning", "从晚上八点到早上七点"],
            ["At night, like most people", "和大多数人一样在晚上"],
          ],
          ['The passage says: "She sleeps from nine in the morning to three in the afternoon."', "文中说她从早上九点睡到下午三点。"],
        ],
      ],
    }),
    myDay({
      id: "a1-day-breakfast-with-grandpa",
      title: ["Breakfast with Grandpa", "和爷爷一起吃早饭"],
      body: `Every Saturday I have breakfast with my grandpa. He lives near us, so I walk to his home at eight o'clock.

Grandpa always makes the same breakfast: eggs, bread and a big cup of tea. He never drinks coffee. I usually have milk, but sometimes I have tea with him.

We eat in his kitchen, and he tells me stories about his life. He often talks about his dog, Max, and about his school days.

After breakfast we sometimes play chess. Grandpa is very good at it! Then I go home for lunch.`,
      grammar: ["adverbs-of-frequency"],
      names: ["Max"],
      questions: [
        [
          ["How often does the writer have breakfast with Grandpa?", "作者多久和爷爷吃一次早饭？"],
          ["Every Saturday", "每个星期六"],
          [
            ["Every day", "每天"],
            ["Every Sunday", "每个星期天"],
          ],
          [
            'The first line says: "Every Saturday I have breakfast with my grandpa."',
            "第一句说：“Every Saturday I have breakfast with my grandpa.”",
          ],
        ],
        [
          ["What does Grandpa never drink?", "爷爷从不喝什么？"],
          ["Coffee", "咖啡"],
          [
            ["Tea", "茶"],
            ["Milk", "牛奶"],
          ],
          ['The passage says: "He never drinks coffee."', "文中说：“He never drinks coffee.”"],
        ],
        [
          ["What do they sometimes do after breakfast?", "他们早饭后有时做什么？"],
          ["Play chess", "下棋"],
          [
            ["Go to school", "去上学"],
            ["Walk the dog", "遛狗"],
          ],
          ['The last paragraph says: "After breakfast we sometimes play chess."', "最后一段说：“After breakfast we sometimes play chess.”"],
        ],
      ],
    }),
    myDay({
      id: "a1-day-homework-after-school",
      title: ["Homework after School", "放学后做作业"],
      body: `Lily comes home from school at four o'clock. She is often hungry, so first she eats an apple or a banana.

Then she starts her homework. She usually does her math first, because it is difficult. Then she does her English. Sometimes her brother helps her, but he is often busy.

Lily never watches TV before she finishes her homework. Her mother says no TV before homework, and Lily thinks that is right.

At six o'clock the homework is done. Lily puts her books in her bag, and she goes out to play.`,
      grammar: ["adverbs-of-frequency", "third-person-s"],
      names: ["Lily"],
      questions: [
        [
          ["What does Lily eat after school?", "莉莉放学后吃什么？"],
          ["An apple or a banana", "一个苹果或一根香蕉"],
          [
            ["Bread and eggs", "面包和鸡蛋"],
            ["Nothing", "什么也不吃"],
          ],
          ['The passage says: "first she eats an apple or a banana."', "文中说：“first she eats an apple or a banana.”"],
        ],
        [
          ["Why does Lily do math first?", "莉莉为什么先做数学？"],
          ["It is difficult", "因为数学难"],
          [
            ["It is easy", "因为数学容易"],
            ["Her brother helps her with it", "因为哥哥帮她做数学"],
          ],
          ['The passage says: "She usually does her math first, because it is difficult."', "文中说她通常先做数学，因为数学难。"],
        ],
        [
          ["What does Lily's mother say?", "莉莉的妈妈怎么说？"],
          ["No TV before the homework is finished", "作业做完前不能看电视"],
          [
            ["No homework after six o'clock", "六点以后不做作业"],
            ["No playing outside", "不能出去玩"],
          ],
          ['The passage says: "Her mother says no TV before homework."', "文中说：“Her mother says no TV before homework.”"],
        ],
      ],
    }),
    myDay({
      id: "a1-day-sunday-is-different",
      title: ["Sunday Is Different", "星期天不一样"],
      body: `From Monday to Friday, Sam gets up at seven. He has a small breakfast, and he goes to school.

But Sunday is different. On Sunday Sam never gets up before ten! He stays in bed, and he reads comics.

At eleven the family has a big breakfast together. Dad cooks eggs and potatoes, and Mom makes juice.

In the afternoon they often go to the park, or they visit Grandma. In the evening Sam gets his bag ready for Monday. He goes to bed early, at nine. Sunday is his favorite day.`,
      grammar: ["adverbs-of-frequency"],
      names: ["Sam"],
      questions: [
        [
          ["When does Sam get up on Sunday?", "萨姆星期天几点起床？"],
          ["After ten", "十点以后"],
          [
            ["At seven", "七点"],
            ["At nine", "九点"],
          ],
          ['The passage says: "On Sunday Sam never gets up before ten!"', "文中说：“On Sunday Sam never gets up before ten!”"],
        ],
        [
          ["Who cooks the Sunday breakfast?", "星期天谁做早饭？"],
          ["Dad", "爸爸"],
          [
            ["Mom", "妈妈"],
            ["Sam", "萨姆"],
          ],
          ['The passage says: "Dad cooks eggs and potatoes, and Mom makes juice."', "文中说爸爸做鸡蛋和土豆，妈妈做果汁。"],
        ],
        [
          ["What does Sam do on Sunday evening?", "萨姆星期天晚上做什么？"],
          ["He gets his bag ready for Monday", "为星期一整理书包"],
          [
            ["He reads comics in bed", "在床上看漫画"],
            ["He visits Grandma", "看望奶奶"],
          ],
          [
            'The passage says: "In the evening Sam gets his bag ready for Monday."',
            "文中说：“In the evening Sam gets his bag ready for Monday.”",
          ],
        ],
      ],
    }),
    myDay({
      id: "a1-day-my-dogs-day",
      title: ["My Dog's Day", "我的狗的一天"],
      body: `This is my dog, Rex. What does he do every day?

Rex wakes up early, at six. He always wakes me up too! Then he eats his breakfast and drinks some water.

At eight I go to school, and Rex stays at home. He sleeps on the sofa for most of the morning. Mom doesn't like that, but he often does it.

At four I come home, and Rex runs to the door. He is always happy to see me. We go out to the park, and he plays with his ball. In the evening he sleeps by my bed.`,
      grammar: ["third-person-s", "adverbs-of-frequency"],
      names: ["Rex"],
      questions: [
        [
          ["What does Rex do at six in the morning?", "雷克斯早上六点做什么？"],
          ["He wakes up and wakes the writer up", "他醒来，并把作者叫醒"],
          [
            ["He goes to the park", "他去公园"],
            ["He sleeps on the sofa", "他睡在沙发上"],
          ],
          ['The passage says: "Rex wakes up early, at six. He always wakes me up too!"', "文中说雷克斯六点醒来，总是把作者也叫醒。"],
        ],
        [
          ["What does Mom not like?", "妈妈不喜欢什么？"],
          ["Rex sleeping on the sofa", "雷克斯睡在沙发上"],
          [
            ["Rex playing with his ball", "雷克斯玩球"],
            ["Rex running to the door", "雷克斯跑到门口"],
          ],
          [
            'The passage says: "He sleeps on the sofa for most of the morning. Mom doesn\'t like that."',
            "文中说它上午大部分时间睡在沙发上，妈妈不喜欢这样。",
          ],
        ],
        [
          ["Where does Rex sleep in the evening?", "雷克斯晚上睡在哪里？"],
          ["By the writer's bed", "在作者的床边"],
          [
            ["On the sofa", "在沙发上"],
            ["In the park", "在公园里"],
          ],
          ['The last line says: "In the evening he sleeps by my bed."', "最后一句说：“In the evening he sleeps by my bed.”"],
        ],
      ],
    }),
  ],
};

const timeDates = passageMaker(words, ["a1-words-time", "a1-words-days", "a1-words-months", "a1-words-dates", "prepositions-of-time"]);

/** readingTimeAndDates is the reading unit of the theme Time and Dates: the clock, the days of the week, months and birthdays. */
const readingTimeAndDates: ReadingUnitDef = {
  id: "a1-reading-time-and-dates",
  title: t("Time and Dates", "时间和日期"),
  passages: [
    timeDates({
      id: "a1-time-toms-week",
      title: ["Tom's Week", "汤姆的一周"],
      body: `Tom is very busy every week.

On Monday and Wednesday he has a piano lesson after school, at four o'clock. On Tuesday he plays football with his team. On Thursday he goes to the library with his sister.

Friday is his favorite school day, because there is no homework on Friday evening! He watches a movie with his family.

On Saturday morning he helps his dad in the garden. On Saturday afternoon he is free. On Sunday he visits his grandma and grandpa for lunch.

Next week is the same. Tom likes his busy week.`,
      grammar: ["prepositions-of-time"],
      names: ["Tom"],
      questions: [
        [
          ["When does Tom have piano lessons?", "汤姆什么时候上钢琴课？"],
          ["On Monday and Wednesday", "星期一和星期三"],
          [
            ["On Tuesday and Thursday", "星期二和星期四"],
            ["On Saturday morning", "星期六上午"],
          ],
          [
            'The passage says: "On Monday and Wednesday he has a piano lesson after school."',
            "文中说：“On Monday and Wednesday he has a piano lesson after school.”",
          ],
        ],
        [
          ["Why does Tom like Friday?", "汤姆为什么喜欢星期五？"],
          ["There is no homework on Friday evening", "星期五晚上没有作业"],
          [
            ["He plays football on Friday", "他星期五踢足球"],
            ["He visits his grandma on Friday", "他星期五去看奶奶"],
          ],
          [
            'The passage says: "Friday is his favorite school day, because there is no homework on Friday evening!"',
            "文中说星期五是他最喜欢的上学日，因为星期五晚上没有作业。",
          ],
        ],
        [
          ["What does Tom do on Saturday morning?", "汤姆星期六上午做什么？"],
          ["He helps his dad in the garden", "在花园里帮爸爸干活"],
          [
            ["He goes to the library", "去图书馆"],
            ["He is free", "他有空"],
          ],
          [
            'The passage says: "On Saturday morning he helps his dad in the garden."',
            "文中说：“On Saturday morning he helps his dad in the garden.”",
          ],
        ],
      ],
    }),
    timeDates({
      id: "a1-time-birthdays-around-the-year",
      title: ["Birthdays around the Year", "一年里的生日"],
      body: `There are five people in my family, and we have birthdays in different months.

My birthday is on the third of March. My brother Jack has his birthday on the fifth of June. Mom has her birthday on the first of October, and Dad has his in December, near the end of the year.

And my sister Lily? Her birthday is on the second of February!

In our family, every birthday is a big day. We have a big cake, and we sing a song. On my birthday we sometimes go out to a restaurant.`,
      grammar: ["prepositions-of-time"],
      names: ["Lily", "Jack"],
      questions: [
        [
          ["When is the writer's birthday?", "作者的生日是哪天？"],
          ["On the third of March", "三月三日"],
          [
            ["On the fifth of June", "六月五日"],
            ["On the first of October", "十月一日"],
          ],
          ['The writer says: "My birthday is on the third of March."', "作者说：“My birthday is on the third of March.”"],
        ],
        [
          ["Whose birthday is in December?", "谁的生日在十二月？"],
          ["Dad's", "爸爸的"],
          [
            ["Mom's", "妈妈的"],
            ["Jack's", "杰克的"],
          ],
          ['The passage says: "Dad has his in December."', "文中说：“Dad has his in December.”"],
        ],
        [
          ["What does the family do on every birthday?", "每次过生日家里都做什么？"],
          ["Have a big cake and sing a song", "吃大蛋糕、唱歌"],
          [
            ["Go out to a restaurant", "去餐馆吃饭"],
            ["Buy a new phone", "买新手机"],
          ],
          [
            'The passage says: "We have a big cake, and we sing a song." Restaurants are only sometimes.',
            "文中说他们吃大蛋糕、唱歌；去餐馆只是有时候。",
          ],
        ],
      ],
    }),
    timeDates({
      id: "a1-time-what-time-is-it",
      title: ["What Time Is It?", "现在几点？"],
      body: `Mia is learning to tell the time. Her dad shows her the clock in the kitchen.

"Look, Mia. The short hand shows the hour, and the long hand shows the minutes. What time is it?"

"The short hand is on seven, and the long hand is on twelve. It's seven o'clock!"

"Good! And now?"

"The long hand is on six. It's half past seven."

"Yes! And when the long hand is on three, it's a quarter past. What time is breakfast?"

"Breakfast is at a quarter past seven, and it's half past seven now. We're late!"`,
      grammar: ["prepositions-of-time"],
      names: ["Mia"],
      questions: [
        [
          ["What does the short hand of the clock show?", "钟的短针表示什么？"],
          ["The hour", "小时"],
          [
            ["The minutes", "分钟"],
            ["The day", "日期"],
          ],
          ['Dad says: "The short hand shows the hour, and the long hand shows the minutes."', "爸爸说短针表示小时，长针表示分钟。"],
        ],
        [
          ["Where is the long hand at half past seven?", "七点半时长针指在哪里？"],
          ["On six", "指在六上"],
          [
            ["On twelve", "指在十二上"],
            ["On three", "指在三上"],
          ],
          ['Mia says: "The long hand is on six. It\'s half past seven."', "Mia 说：“The long hand is on six. It's half past seven.”"],
        ],
        [
          ['Why does Mia say "We\'re late!"?', "米娅为什么说“我们迟到了”？"],
          ["Breakfast is at a quarter past seven, and it is already half past seven", "早饭是七点一刻，现在已经七点半了"],
          [
            ["School starts at seven", "学校七点开始上课"],
            ["The clock is wrong", "钟坏了"],
          ],
          ['Mia says: "Breakfast is at a quarter past seven, and it\'s half past seven now."', "Mia 说早饭是七点一刻，现在已经七点半了。"],
        ],
      ],
    }),
    timeDates({
      id: "a1-time-the-bus-at-half-past-eight",
      title: ["The Bus at Half Past Eight", "八点半的公共汽车"],
      body: `Ben goes to school by bus. The bus comes at half past eight every morning, and school starts at nine.

On Monday Ben gets up late, at a quarter past eight. He has no time for breakfast. He runs to the bus stop, but the bus isn't there. It's twenty to nine!

Ben waits for ten minutes. Then the mother of his friend Sam stops her car. "Hello, Ben! Do you need help?" She takes him to school.

Ben arrives at five minutes to nine. "Thank you!" he says. Next Monday he wants to get up early.`,
      grammar: ["prepositions-of-time"],
      names: ["Ben", "Sam"],
      questions: [
        [
          ["When does the bus usually come?", "公共汽车通常几点来？"],
          ["At half past eight", "八点半"],
          [
            ["At a quarter past eight", "八点一刻"],
            ["At nine", "九点"],
          ],
          [
            'The first paragraph says: "The bus comes at half past eight every morning."',
            "第一段说：“The bus comes at half past eight every morning.”",
          ],
        ],
        [
          ["How does Ben get to school on Monday?", "星期一本是怎么到学校的？"],
          ["The mother of his friend takes him in her car", "朋友的妈妈开车送他"],
          [
            ["He takes the bus", "他坐公共汽车"],
            ["He walks", "他走路去"],
          ],
          [
            'The passage says the mother of his friend Sam stops her car, and "She takes him to school."',
            "文中说朋友的妈妈停下车，送他去了学校。",
          ],
        ],
        [
          ["Is Ben late for school?", "本上学迟到了吗？"],
          ["No, he arrives at five minutes to nine", "没有，他八点五十五分到校"],
          [
            ["Yes, he arrives at half past nine", "迟到了，他九点半才到"],
            ["Yes, he misses the morning", "迟到了，他错过了整个上午"],
          ],
          [
            'School starts at nine, and the passage says: "Ben arrives at five minutes to nine."',
            "学校九点上课，文中说本八点五十五分到校。",
          ],
        ],
      ],
    }),
    timeDates({
      id: "a1-time-a-month-of-weekends",
      title: ["A Month of Weekends", "一个月的周末"],
      body: `July is the start of the summer holiday, and Amy has an idea for every weekend.

On the first weekend she goes to the beach with her family. On the second weekend her friend Kate comes to stay. They go to the zoo on Saturday and to a movie on Sunday.

The third weekend is the best. Her birthday is on that Saturday, and she has a party in the park.

On the last weekend of July the family stays at home. They clean the house, and Amy reads her new books. Then August begins!`,
      grammar: ["prepositions-of-time"],
      names: ["Amy", "Kate"],
      questions: [
        [
          ["What does Amy do on the first weekend?", "第一个周末艾米做什么？"],
          ["She goes to the beach with her family", "和家人去海边"],
          [
            ["She goes to the zoo", "去动物园"],
            ["She stays at home", "待在家里"],
          ],
          [
            'The passage says: "On the first weekend she goes to the beach with her family."',
            "文中说：“On the first weekend she goes to the beach with her family.”",
          ],
        ],
        [
          ["When is Amy's birthday?", "艾米的生日是哪天？"],
          ["On the Saturday of the third weekend", "第三个周末的星期六"],
          [
            ["On the first of August", "八月一日"],
            ["On the last weekend of July", "七月的最后一个周末"],
          ],
          [
            'The passage says about the third weekend: "Her birthday is on that Saturday."',
            "文中说第三个周末：“Her birthday is on that Saturday.”",
          ],
        ],
        [
          ["What happens on the last weekend of July?", "七月的最后一个周末发生了什么？"],
          ["The family stays at home and cleans the house", "一家人待在家里打扫房子"],
          [
            ["Amy has a party in the park", "艾米在公园开派对"],
            ["Kate comes to stay", "凯特来住"],
          ],
          [
            'The passage says: "On the last weekend of July the family stays at home. They clean the house."',
            "文中说七月最后一个周末一家人待在家里打扫房子。",
          ],
        ],
      ],
    }),
    timeDates({
      id: "a1-time-the-first-day-of-spring",
      title: ["The First Day of Spring", "春天的第一天"],
      body: `In my country, winter is long and cold. It often snows from November to February.

But today is the first of March, the first day of spring! In the morning it is cold, but the sun is out. At lunch I sit outside for the first time this year.

In the afternoon I see the first flowers in the park. They are small and yellow. The birds are back in the trees, and they sing all day.

In April the days get longer and warmer. I love spring!`,
      grammar: ["prepositions-of-time", "it-for-weather"],
      questions: [
        [
          ["When does it often snow in the writer's country?", "作者的国家什么时候常下雪？"],
          ["From November to February", "十一月到二月"],
          [
            ["From March to April", "三月到四月"],
            ["All year", "全年"],
          ],
          [
            'The first paragraph says: "It often snows from November to February."',
            "第一段说：“It often snows from November to February.”",
          ],
        ],
        [
          ["What is the date of the first day of spring here?", "这里春天的第一天是哪天？"],
          ["The first of March", "三月一日"],
          [
            ["The twentieth of March", "三月二十日"],
            ["The first of April", "四月一日"],
          ],
          [
            'The passage says: "today is the first of March, the first day of spring!"',
            "文中说：“today is the first of March, the first day of spring!”",
          ],
        ],
        [
          ["What does the writer see in the park?", "作者在公园里看到了什么？"],
          ["The first small yellow flowers", "第一批黄色小花"],
          [
            ["Snow on the trees", "树上的雪"],
            ["A lot of people", "很多人"],
          ],
          [
            'The passage says: "In the afternoon I see the first flowers in the park. They are small and yellow."',
            "文中说下午在公园里看到第一批黄色的小花。",
          ],
        ],
      ],
    }),
    timeDates({
      id: "a1-time-late-again",
      title: ["Late Again!", "又迟到了！"],
      body: `Leo is often late. On Monday he is late for school, because he can't find his shoes. On Tuesday he is late for his piano lesson, because he plays a computer game for too long.

On Wednesday his teacher, Mr Brown, talks to him. "Leo, class starts at eight o'clock, not at a quarter past eight. Why are you always late?"

"I don't know," says Leo. "I don't have a clock in my bedroom."

That evening his mother gives him an old clock. On Thursday it wakes him up at seven. Leo is at school at ten minutes to eight. Mr Brown smiles. "You're early, Leo!"`,
      grammar: ["prepositions-of-time"],
      names: ["Leo", "Mr", "Brown"],
      questions: [
        [
          ["Why is Leo late on Tuesday?", "利奥星期二为什么迟到？"],
          ["He plays a computer game for too long", "他玩电脑游戏玩得太久了"],
          [
            ["He can't find his shoes", "他找不到鞋子"],
            ["He doesn't have a clock", "他没有钟"],
          ],
          [
            'The passage says he is late on Tuesday "because he plays a computer game for too long."',
            "文中说他星期二迟到是因为玩电脑游戏太久了。",
          ],
        ],
        [
          ["When does class start?", "几点上课？"],
          ["At eight o'clock", "八点"],
          [
            ["At a quarter past eight", "八点一刻"],
            ["At seven o'clock", "七点"],
          ],
          ['Mr Brown says: "class starts at eight o\'clock, not at a quarter past eight."', "Brown 老师说八点上课，不是八点一刻。"],
        ],
        [
          ["What helps Leo on Thursday?", "星期四是什么帮了利奥？"],
          ["An old clock from his mother", "妈妈给他的一个旧钟"],
          [
            ["His teacher", "他的老师"],
            ["A new computer game", "一个新的电脑游戏"],
          ],
          [
            'The passage says: "his mother gives him an old clock. On Thursday it wakes him up at seven."',
            "文中说妈妈给了他一个旧钟，星期四它七点把他叫醒了。",
          ],
        ],
      ],
    }),
  ],
};

const food = passageMaker(words, [
  "a1-words-food",
  "a1-words-drinks",
  "a1-words-meals",
  "a1-words-favorite-foods",
  "countable-and-uncountable-nouns",
  "some-and-any",
]);

/** readingFood is the reading unit of the theme Food and Drink: meals, cooking and favorite foods. */
const readingFood: ReadingUnitDef = {
  id: "a1-reading-food",
  title: t("Food and Drink", "食物和饮料"),
  passages: [
    food({
      id: "a1-food-breakfast-around-the-world",
      title: ["Breakfast around the World", "世界各地的早餐"],
      body: `People eat different things for breakfast in different countries.

In many Chinese homes, people have noodles, dumplings or hot rice soup. In England, some people like eggs, bread and a cup of tea. In Japan, a lot of families have rice, fish and soup.

In Mexico, people often eat eggs with tomatoes and bread. And in many countries, children have milk and some fruit, like an apple or a banana.

What do you have for breakfast? Is it the same every day?`,
      grammar: ["countable-and-uncountable-nouns"],
      names: ["England", "Japan", "Mexico"],
      questions: [
        [
          ["What do people in many Chinese homes have for breakfast?", "很多中国家庭早餐吃什么？"],
          ["Noodles, dumplings or rice soup", "面条、饺子或粥"],
          [
            ["Rice, fish and soup", "米饭、鱼和汤"],
            ["Eggs, bread and tea", "鸡蛋、面包和茶"],
          ],
          [
            'The passage says: "In many Chinese homes, people have noodles, dumplings or hot rice soup."',
            "文中说很多中国家庭早餐吃面条、饺子或热粥。",
          ],
        ],
        [
          ["Where do a lot of families have rice, fish and soup?", "在哪里很多家庭早餐吃米饭、鱼和汤？"],
          ["In Japan", "日本"],
          [
            ["In England", "英国"],
            ["In Mexico", "墨西哥"],
          ],
          [
            'The passage says: "In Japan, a lot of families have rice, fish and soup."',
            "文中说：“In Japan, a lot of families have rice, fish and soup.”",
          ],
        ],
        [
          ["What do people in Mexico often eat with eggs?", "墨西哥人常把鸡蛋和什么一起吃？"],
          ["Tomatoes and bread", "西红柿和面包"],
          [
            ["Rice and fish", "米饭和鱼"],
            ["Noodles", "面条"],
          ],
          ['The passage says: "In Mexico, people often eat eggs with tomatoes and bread."', "文中说墨西哥人常把鸡蛋和西红柿、面包一起吃。"],
        ],
      ],
    }),
    food({
      id: "a1-food-making-a-fruit-salad",
      title: ["Making a Fruit Salad", "做水果沙拉"],
      body: `Do you want to make a fruit salad? It's easy, and you don't need to cook!

First, get a big bowl and a knife. Ask your mom or dad to help you with the knife.

Then use the knife to make two apples, two bananas and some oranges into small parts. Put them in the bowl.

Do you have any other fruit? You can put it in too.

Then put in a cup of orange juice. You don't need any sugar.

Put the salad in small bowls, and eat it with a spoon. It's great on a hot day.`,
      grammar: ["some-and-any", "countable-and-uncountable-nouns"],
      questions: [
        [
          ["What do you need help with?", "什么事需要别人帮忙？"],
          ["The knife", "用刀"],
          [
            ["The bowl", "拿碗"],
            ["The juice", "倒果汁"],
          ],
          [
            'The passage says: "Ask your mom or dad to help you with the knife."',
            "文中说：“Ask your mom or dad to help you with the knife.”",
          ],
        ],
        [
          ["What do you put in after the fruit?", "放完水果后再放什么？"],
          ["A cup of orange juice", "一杯橙汁"],
          [
            ["Some sugar", "一些糖"],
            ["Some milk", "一些牛奶"],
          ],
          ['The passage says: "Then put in a cup of orange juice. You don\'t need any sugar."', "文中说再倒一杯橙汁，不需要加糖。"],
        ],
        [
          ["Why don't you need to cook?", "为什么不需要做饭？"],
          ["A fruit salad is just fruit and juice", "水果沙拉只有水果和果汁"],
          [
            ["The fruit is cooked already", "水果已经煮好了"],
            ["Mom or Dad cooks it", "爸爸或妈妈来煮"],
          ],
          [
            'The first line says the salad is easy and "you don\'t need to cook!" It is only fruit and juice.',
            "第一句说做沙拉很容易，不用做饭，只需要水果和果汁。",
          ],
        ],
      ],
    }),
    food({
      id: "a1-food-whats-in-the-kitchen",
      title: ["What's in the Kitchen?", "厨房里有什么？"],
      body: `Mom: Ben, can you help me? I want to make soup for dinner. Is there any meat in the kitchen?

Ben: Yes, there is some chicken on the table.

Mom: Good. Are there any potatoes?

Ben: There are three potatoes in the cupboard, and there are some tomatoes too.

Mom: Great. Is there any rice?

Ben: No, there isn't any rice. But there is some bread.

Mom: Okay. Then we have chicken soup with bread. Is there any milk for you?

Ben: No, there isn't. Can I have some juice?`,
      grammar: ["some-and-any", "there-is-and-there-are"],
      names: ["Mom", "Ben"],
      questions: [
        [
          ["What does Mom want to make?", "妈妈想做什么？"],
          ["Soup for dinner", "晚饭的汤"],
          [
            ["A cake", "蛋糕"],
            ["A salad", "沙拉"],
          ],
          ['Mom says: "I want to make soup for dinner."', "妈妈说：“I want to make soup for dinner.”"],
        ],
        [
          ["What is there none of in the kitchen?", "厨房里没有什么？"],
          ["Rice", "米"],
          [
            ["Chicken", "鸡肉"],
            ["Potatoes", "土豆"],
          ],
          ['Ben says: "No, there isn\'t any rice."', "Ben 说：“No, there isn't any rice.”"],
        ],
        [
          ["What do they have with the soup?", "他们喝汤时配什么吃？"],
          ["Bread", "面包"],
          [
            ["Rice", "米饭"],
            ["Noodles", "面条"],
          ],
          ['Mom says: "Then we have chicken soup with bread."', "妈妈说：“Then we have chicken soup with bread.”"],
        ],
      ],
    }),
    food({
      id: "a1-food-a-birthday-cake",
      title: ["A Birthday Cake", "生日蛋糕"],
      body: `Grandma has her birthday on Sunday, and Anna wants to make a cake for her.

On Saturday morning Anna and her dad go to the kitchen. They need four eggs, some sugar, some milk and a lot of flour. Flour is the white food that we make bread and cakes from.

Dad puts everything in a big bowl, and Anna helps. Then the cake cooks for forty minutes. The kitchen is warm, and everyone is hungry!

On Sunday Grandma sees the cake, and she laughs. She is very happy. She has some cake with a cup of tea.`,
      grammar: ["countable-and-uncountable-nouns", "some-and-any"],
      names: ["Anna", "Grandma"],
      glossed: ["flour"],
      questions: [
        [
          ["Who makes the cake?", "谁做的蛋糕？"],
          ["Anna and her dad", "安娜和她爸爸"],
          [
            ["Grandma", "奶奶"],
            ["Anna and her mom", "安娜和她妈妈"],
          ],
          ['The passage says: "Anna and her dad go to the kitchen," and they make it together.', "文中说安娜和爸爸去厨房一起做蛋糕。"],
        ],
        [
          ["How many eggs do they need?", "他们需要几个鸡蛋？"],
          ["Four", "四个"],
          [
            ["Seven", "七个"],
            ["Forty", "四十个"],
          ],
          [
            'The passage says: "They need four eggs, some sugar, some milk and a lot of flour."',
            "文中说他们需要四个鸡蛋、一些糖、一些牛奶和很多面粉。",
          ],
        ],
        [
          ["How long does the cake cook?", "蛋糕烤多长时间？"],
          ["Forty minutes", "四十分钟"],
          [
            ["Seven minutes", "七分钟"],
            ["An hour", "一小时"],
          ],
          ['The passage says: "the cake cooks for forty minutes."', "文中说：“the cake cooks for forty minutes.”"],
        ],
      ],
    }),
    food({
      id: "a1-food-noodles-or-rice",
      title: ["Noodles or Rice?", "面条还是米饭？"],
      body: `Li Ming and his friend Lucy are at a Chinese restaurant.

Lucy: There are so many things! Do you want noodles or rice?

Li Ming: I usually have rice at home, so today I want noodles. Chicken noodles are my favorite.

Lucy: I don't eat meat. Do they have any vegetable dishes?

Li Ming: Yes, look. There's egg and tomato with rice. It's very good.

Lucy: Great, I want that. And can we have some dumplings too?

Li Ming: Sure! And two glasses of water, please.`,
      grammar: ["some-and-any"],
      names: ["Li", "Ming", "Lucy"],
      questions: [
        [
          ["Why does Li Ming want noodles today?", "李明今天为什么想吃面条？"],
          ["He usually has rice at home", "他在家常吃米饭"],
          [
            ["He doesn't like rice", "他不喜欢米饭"],
            ["Lucy wants noodles", "露西想吃面条"],
          ],
          ['Li Ming says: "I usually have rice at home, so today I want noodles."', "李明说他在家常吃米饭，所以今天想吃面条。"],
        ],
        [
          ["Why does Lucy ask for a vegetable dish?", "露西为什么要素菜？"],
          ["She doesn't eat meat", "她不吃肉"],
          [
            ["She is not hungry", "她不饿"],
            ["She doesn't like noodles", "她不喜欢面条"],
          ],
          ['Lucy says: "I don\'t eat meat. Do they have any vegetable dishes?"', "Lucy 说她不吃肉，问有没有素菜。"],
        ],
        [
          ["What do they order to drink?", "他们点了什么喝的？"],
          ["Two glasses of water", "两杯水"],
          [
            ["Two cups of tea", "两杯茶"],
            ["Some juice", "一些果汁"],
          ],
          ['Li Ming says: "And two glasses of water, please."', "李明说：“And two glasses of water, please.”"],
        ],
      ],
    }),
    food({
      id: "a1-food-lunch-at-school",
      title: ["Lunch at School", "学校的午饭"],
      body: `At my school, lunch is at twelve o'clock. We eat in a big room with long tables.

Every day there is rice or noodles, some meat or fish, and vegetables. On Fridays there is pizza, and everyone is happy!

We get our food on a plate, and we take a bowl of soup. There is water and milk to drink, but there isn't any juice.

I don't like fish very much, but I eat it. My teacher says it is good for us. After lunch we have some fruit, usually an apple or a banana.`,
      grammar: ["countable-and-uncountable-nouns"],
      questions: [
        [
          ["When is lunch?", "午饭是几点？"],
          ["At twelve o'clock", "十二点"],
          [
            ["At one o'clock", "一点"],
            ["At eleven o'clock", "十一点"],
          ],
          ['The first line says: "lunch is at twelve o\'clock."', "第一句说：“lunch is at twelve o'clock.”"],
        ],
        [
          ["What is there on Fridays?", "星期五有什么？"],
          ["Pizza", "比萨饼"],
          [
            ["Fish", "鱼"],
            ["Juice", "果汁"],
          ],
          [
            'The passage says: "On Fridays there is pizza, and everyone is happy!"',
            "文中说：“On Fridays there is pizza, and everyone is happy!”",
          ],
        ],
        [
          ["What does the writer think about fish?", "作者觉得鱼怎么样？"],
          ["The writer doesn't like it very much but eats it", "不太喜欢，但还是会吃"],
          [
            ["It is the writer's favorite food", "是作者最喜欢的食物"],
            ["The writer never eats it", "作者从来不吃"],
          ],
          ['The writer says: "I don\'t like fish very much, but I eat it."', "作者说：“I don't like fish very much, but I eat it.”"],
        ],
      ],
    }),
    food({
      id: "a1-food-a-hungry-rabbit",
      title: ["A Hungry Rabbit", "一只饿兔子"],
      body: `We have a white rabbit. Her name is Snowy, and she is always hungry!

In the morning Snowy eats some grass in the garden. At lunch she has some green vegetables. She drinks a lot of water too.

One day Snowy is in the kitchen. There is a bag of vegetables on the floor. She eats two tomatoes, a banana and half a potato!

Mom is angry, but she laughs too. "Snowy, you can't eat our dinner!" Snowy doesn't say sorry. She goes to sleep under the table.`,
      grammar: ["countable-and-uncountable-nouns", "some-and-any"],
      names: ["Snowy"],
      questions: [
        [
          ["What does Snowy eat in the morning?", "雪雪早上吃什么？"],
          ["Some grass in the garden", "花园里的草"],
          [
            ["Tomatoes", "西红柿"],
            ["A potato", "一个土豆"],
          ],
          [
            'The passage says: "In the morning Snowy eats some grass in the garden."',
            "文中说：“In the morning Snowy eats some grass in the garden.”",
          ],
        ],
        [
          ["Where are the vegetables that Snowy eats?", "雪雪吃的蔬菜在哪里？"],
          ["In a bag on the kitchen floor", "在厨房地板上的一个袋子里"],
          [
            ["On the table", "在桌子上"],
            ["In the garden", "在花园里"],
          ],
          ['The passage says: "There is a bag of vegetables on the floor."', "文中说：“There is a bag of vegetables on the floor.”"],
        ],
        [
          ["How does Mom feel?", "妈妈的心情怎样？"],
          ["Angry, but she laughs too", "生气，但也笑了"],
          [
            ["Very happy", "很高兴"],
            ["Sad", "难过"],
          ],
          ['The passage says: "Mom is angry, but she laughs too."', "文中说：“Mom is angry, but she laughs too.”"],
        ],
      ],
    }),
  ],
};

const shopping = passageMaker(words, [
  "a1-words-clothes",
  "a1-words-shopping",
  "a1-words-at-the-shop",
  "present-continuous",
  "how-much-and-how-many",
]);

/** readingShopping is the reading unit of the theme Clothes and Shopping: what people wear, prices and buying things. */
const readingShopping: ReadingUnitDef = {
  id: "a1-reading-shopping",
  title: t("Clothes and Shopping", "衣服和购物"),
  passages: [
    shopping({
      id: "a1-shop-at-the-market",
      title: ["At the Market", "在市场上"],
      body: `It's Saturday morning, and Mia is out with her mother. On Saturdays, people sell things on their street. There are a lot of people, and everyone is buying something.

A man is selling fruit and vegetables there. "How much are the apples?" Mia's mother asks. "Two dollars for six," he says. She buys twelve apples and some tomatoes.

Then they see a woman who is selling hats. Mia wants a yellow sun hat. "How much is it?" "Five dollars." That is cheap, so her mother buys it.

Mia is wearing her new hat now. She is very happy.`,
      grammar: ["how-much-and-how-many", "present-continuous"],
      names: ["Mia", "Mia's"],
      questions: [
        [
          ["What is the man in the street selling?", "街上的那个男人在卖什么？"],
          ["Fruit and vegetables", "水果和蔬菜"],
          [
            ["Hats", "帽子"],
            ["Clothes", "衣服"],
          ],
          ['The passage says: "A man is selling fruit and vegetables there."', "文中说：“A man is selling fruit and vegetables there.”"],
        ],
        [
          ["How much are six apples?", "六个苹果多少钱？"],
          ["Two dollars", "两美元"],
          [
            ["Five dollars", "五美元"],
            ["Twelve dollars", "十二美元"],
          ],
          ['The man says: "Two dollars for six."', "那个男人说：“Two dollars for six.”"],
        ],
        [
          ["Why does Mia's mother buy the hat?", "米娅的妈妈为什么买了那顶帽子？"],
          ["It is cheap", "因为便宜"],
          [
            ["It is Mia's birthday", "因为是米娅的生日"],
            ["The apples are expensive", "因为苹果很贵"],
          ],
          [
            'The hat is five dollars, and the passage says: "That is cheap, so her mother buys it."',
            "帽子五美元，文中说很便宜，所以妈妈买了。",
          ],
        ],
      ],
    }),
    shopping({
      id: "a1-shop-a-new-coat-for-winter",
      title: ["A New Coat for Winter", "过冬的新外套"],
      body: `Winter is coming, and Tom's old coat is too small. So on Saturday he goes to a clothes store with his dad.

There are many coats. Tom tries a black one, but it is too big. Then he tries a blue one in a smaller size. It is just right!

"How much is this coat?" Dad asks. "It's eighty dollars," says the woman in the shop. That is expensive. "Do you have a cheaper one?" "Yes, this green coat is the same size, and it is fifty dollars."

Tom likes the green coat too. Dad pays, and Tom wears his new coat home.`,
      grammar: ["how-much-and-how-many"],
      names: ["Tom", "Tom's"],
      questions: [
        [
          ["Why does Tom need a new coat?", "汤姆为什么需要一件新外套？"],
          ["His old coat is too small", "他的旧外套太小了"],
          [
            ["His old coat is dirty", "他的旧外套脏了"],
            ["He wants a green coat", "他想要一件绿外套"],
          ],
          ['The first line says: "Tom\'s old coat is too small."', "第一句说汤姆的旧外套太小了。"],
        ],
        [
          ["What is wrong with the black coat?", "黑色外套有什么问题？"],
          ["It is too big", "太大了"],
          [
            ["It is too small", "太小了"],
            ["It is too expensive", "太贵了"],
          ],
          ['The passage says: "Tom tries a black one, but it is too big."', "文中说：“Tom tries a black one, but it is too big.”"],
        ],
        [
          ["Which coat does Dad buy?", "爸爸买了哪件外套？"],
          ["The green coat, for fifty dollars", "五十美元的绿外套"],
          [
            ["The blue coat, for eighty dollars", "八十美元的蓝外套"],
            ["The black coat", "黑外套"],
          ],
          [
            "The blue coat is eighty dollars, so they ask for a cheaper one. The green coat is fifty dollars, and Tom wears it home.",
            "蓝外套八十美元太贵，他们要了便宜一些的；绿外套五十美元，汤姆穿着它回家。",
          ],
        ],
      ],
    }),
    shopping({
      id: "a1-shop-the-school-uniform",
      title: ["The School Uniform", "校服"],
      body: `At Lily's school, every student wears the same clothes. Boys and girls wear white shirts and blue jackets. The girls wear blue skirts or pants, and the boys wear blue pants. Everyone wears black shoes and white socks.

Lily likes it. In the morning she doesn't need to think about her clothes, so she has more time for breakfast.

But on Friday the students don't wear the school clothes. They can wear what they want. Today is Friday, and Lily is wearing a pink T-shirt and her favorite green pants.`,
      grammar: ["present-continuous"],
      names: ["Lily", "Lily's"],
      questions: [
        [
          ["What color are the school jackets?", "校服外套是什么颜色的？"],
          ["Blue", "蓝色"],
          [
            ["White", "白色"],
            ["Black", "黑色"],
          ],
          [
            'The passage says: "Boys and girls wear white shirts and blue jackets."',
            "文中说：“Boys and girls wear white shirts and blue jackets.”",
          ],
        ],
        [
          ["Why does Lily like the school clothes?", "莉莉为什么喜欢校服？"],
          ["She has more time for breakfast", "她有更多时间吃早饭"],
          [
            ["They are pink", "校服是粉色的"],
            ["She can wear what she wants", "她可以想穿什么就穿什么"],
          ],
          [
            'The passage says she doesn\'t need to think about her clothes, "so she has more time for breakfast."',
            "文中说她不用考虑穿什么，所以有更多时间吃早饭。",
          ],
        ],
        [
          ["What is Lily wearing today?", "莉莉今天穿什么？"],
          ["A pink T-shirt and green pants", "粉色T恤和绿裤子"],
          [
            ["A white shirt and a blue skirt", "白衬衫和蓝裙子"],
            ["A blue jacket", "蓝外套"],
          ],
          [
            'Today is Friday, and the passage says: "Lily is wearing a pink T-shirt and her favorite green pants."',
            "今天是星期五，文中说莉莉穿着粉色T恤和她最喜欢的绿裤子。",
          ],
        ],
      ],
    }),
    shopping({
      id: "a1-shop-two-dollars-or-ten",
      title: ["Two Dollars or Ten?", "两美元还是十美元？"],
      body: `Sam has twelve dollars, and he wants to buy a ball. He goes to two stores.

In the first store, a big red ball is ten dollars. It is a very good ball, but it is expensive.

In the second store, there is a small blue ball. "How much is it?" Sam asks. "Two dollars," says the man. It is very cheap, but it is not a good ball.

Sam thinks about it. Then he buys the red ball. "It is more expensive, but I want a ball for a long time," he says. He has two dollars left for some candy.`,
      grammar: ["how-much-and-how-many"],
      names: ["Sam"],
      questions: [
        [
          ["How much money does Sam have?", "萨姆有多少钱？"],
          ["Twelve dollars", "十二美元"],
          [
            ["Ten dollars", "十美元"],
            ["Two dollars", "两美元"],
          ],
          ['The first line says: "Sam has twelve dollars."', "第一句说：“Sam has twelve dollars.”"],
        ],
        [
          ["What is the problem with the blue ball?", "蓝色的球有什么问题？"],
          ["It is not a good ball", "它质量不好"],
          [
            ["It is too expensive", "它太贵了"],
            ["It is too big", "它太大了"],
          ],
          ['The passage says: "It is very cheap, but it is not a good ball."', "文中说：“It is very cheap, but it is not a good ball.”"],
        ],
        [
          ["Why does Sam buy the red ball?", "萨姆为什么买了红色的球？"],
          ["He wants a ball for a long time", "他想要一个能用很久的球"],
          [
            ["It is cheaper", "它更便宜"],
            ["He likes red more than blue", "他更喜欢红色"],
          ],
          ['Sam says he wants "a ball for a long time."', "萨姆说他想要一个能用很久的球。"],
        ],
      ],
    }),
    shopping({
      id: "a1-shop-which-shoes",
      title: ["Which Shoes?", "哪双鞋？"],
      body: `Emma: Hello. I want some shoes for school, please.

Woman: Sure. What size are you?

Emma: Size thirty, I think.

Woman: We have these black shoes and these brown shoes in your size. The black shoes are forty dollars, and the brown shoes are twenty dollars.

Emma: Can I try the black shoes?

Woman: Sure. How are they?

Emma: They are nice, but they are too small. Can I try the brown shoes?

Woman: Yes. Are they better?

Emma: Yes, they are great, and they are cheaper too. I want the brown shoes, please.`,
      grammar: ["present-continuous", "how-much-and-how-many"],
      names: ["Emma"],
      questions: [
        [
          ["What size is Emma?", "埃玛穿多大码？"],
          ["Thirty", "三十码"],
          [
            ["Twenty", "二十码"],
            ["Forty", "四十码"],
          ],
          ['Emma says: "Size thirty, I think."', "Emma 说：“Size thirty, I think.”"],
        ],
        [
          ["What is wrong with the black shoes?", "黑鞋有什么问题？"],
          ["They are too small", "太小了"],
          [
            ["They are too big", "太大了"],
            ["They are dirty", "脏了"],
          ],
          ['Emma says: "They are nice, but they are too small."', "Emma 说黑鞋很好看，但太小了。"],
        ],
        [
          ["How much are the shoes that Emma buys?", "埃玛买的鞋多少钱？"],
          ["Twenty dollars", "二十美元"],
          [
            ["Forty dollars", "四十美元"],
            ["Thirty dollars", "三十美元"],
          ],
          [
            'Emma buys the brown shoes, and the woman says: "the brown shoes are twenty dollars."',
            "Emma 买了棕色的鞋，店员说棕色的鞋二十美元。",
          ],
        ],
      ],
    }),
    shopping({
      id: "a1-shop-a-gift-for-mom",
      title: ["A Gift for Mom", "给妈妈的礼物"],
      body: `Next Sunday is the birthday of their mom, and Ben and his sister Lucy want to buy her a gift. They have twenty dollars.

First they look at dresses, but a dress is too expensive. Then Lucy sees a beautiful red bag, but Ben says Mom has a lot of red things.

In the next shop they find a green hat. It is twelve dollars. "Mom loves green," says Lucy. "And she wears a hat in the garden every day."

They buy the hat. With the other eight dollars they buy a card and some flowers. Now they are writing on the card: "Happy birthday, Mom! We love you."`,
      grammar: ["present-continuous", "how-much-and-how-many"],
      names: ["Ben", "Lucy"],
      questions: [
        [
          ["How much money do Ben and Lucy have?", "本和露西有多少钱？"],
          ["Twenty dollars", "二十美元"],
          [
            ["Twelve dollars", "十二美元"],
            ["Eight dollars", "八美元"],
          ],
          ['The first paragraph says: "They have twenty dollars."', "第一段说：“They have twenty dollars.”"],
        ],
        [
          ["Why do they buy the green hat?", "他们为什么买了那顶绿帽子？"],
          ["Mom loves green, and she wears a hat in the garden", "妈妈喜欢绿色，而且她在花园里戴帽子"],
          [
            ["It is the cheapest thing in the shop", "它是店里最便宜的东西"],
            ["Mom has a lot of red things", "妈妈有很多红色的东西"],
          ],
          ['Lucy says: "Mom loves green. And she wears a hat in the garden every day."', "Lucy 说妈妈喜欢绿色，而且每天在花园里戴帽子。"],
        ],
        [
          ["What do they buy with the other eight dollars?", "他们用剩下的八美元买了什么？"],
          ["A card and some flowers", "一张贺卡和一些花"],
          [
            ["A dress", "一条连衣裙"],
            ["Some candy", "一些糖果"],
          ],
          [
            'The passage says: "With the other eight dollars they buy a card and some flowers."',
            "文中说：“With the other eight dollars they buy a card and some flowers.”",
          ],
        ],
      ],
    }),
    shopping({
      id: "a1-shop-the-shop-on-our-street",
      title: ["The Shop on Our Street", "我们街上的小店"],
      body: `There is a small shop on our street. It is Mr Lee's shop, and it sells a lot of different things: bread, milk, fruit, pens, toys and umbrellas.

Mr Lee is a kind man. He opens his shop at seven in the morning, and he closes it at ten at night. He knows everyone on the street.

Right now I am in the shop. Mr Lee is helping an old woman with her bags, and a young woman, Amy, is selling ice cream to two children.

The big stores in the city are cheaper, but I like this shop. It is near my home, and it is a friendly place.`,
      grammar: ["present-continuous"],
      names: ["Mr", "Lee", "Lee's", "Amy"],
      questions: [
        [
          ["When does Mr Lee open his shop?", "李先生几点开店？"],
          ["At seven in the morning", "早上七点"],
          [
            ["At ten in the morning", "早上十点"],
            ["At ten at night", "晚上十点"],
          ],
          [
            'The passage says: "He opens his shop at seven in the morning, and he closes it at ten at night."',
            "文中说他早上七点开门，晚上十点关门。",
          ],
        ],
        [
          ["What is Mr Lee doing right now?", "李先生现在在做什么？"],
          ["Helping an old woman with her bags", "帮一位老奶奶拿袋子"],
          [
            ["Selling ice cream", "卖冰淇淋"],
            ["Closing the shop", "关店"],
          ],
          ['The passage says: "Mr Lee is helping an old woman with her bags."', "文中说：“Mr Lee is helping an old woman with her bags.”"],
        ],
        [
          ["Why does the writer like the shop?", "作者为什么喜欢这家店？"],
          ["It is near home, and it is friendly", "离家近，而且很友好"],
          [
            ["It is cheaper than the big stores", "比大商店便宜"],
            ["It sells only ice cream", "只卖冰淇淋"],
          ],
          [
            'The writer says the big stores are cheaper, "but I like this shop. It is near my home, and it is a friendly place."',
            "作者说大商店更便宜，但喜欢这家店，因为离家近、很友好。",
          ],
        ],
      ],
    }),
  ],
};

const home = passageMaker(words, [
  "a1-words-home",
  "a1-words-things-at-home",
  "a1-words-housework",
  "there-is-and-there-are",
  "prepositions-of-place",
]);

/** readingHome is the reading unit of the theme Home: rooms, things at home and housework. */
const readingHome: ReadingUnitDef = {
  id: "a1-reading-home",
  title: t("Home", "家"),
  passages: [
    home({
      id: "a1-home-our-new-apartment",
      title: ["Our New Apartment", "我们的新公寓"],
      body: `We live in a new apartment now. It is on the fifth floor of a tall building, so we see a lot of the city from our windows.

There are three bedrooms, a kitchen, a bathroom and a large living room. My bedroom is next to the bathroom. The bedroom of my sister is between my room and the room of my mom and dad.

In the living room there is a big sofa in front of the TV. There are pictures of our family on the walls.

The best part of the apartment is the kitchen. It has a big window, and the sun comes in every morning.`,
      grammar: ["there-is-and-there-are", "prepositions-of-place"],
      questions: [
        [
          ["Which floor is the apartment on?", "公寓在几楼？"],
          ["The fifth floor", "五楼"],
          [
            ["The third floor", "三楼"],
            ["The first floor", "一楼"],
          ],
          ['The passage says: "It is on the fifth floor of a tall building."', "文中说：“It is on the fifth floor of a tall building.”"],
        ],
        [
          ["Where is the writer's bedroom?", "作者的卧室在哪里？"],
          ["Next to the bathroom", "在浴室旁边"],
          [
            ["Next to the kitchen", "在厨房旁边"],
            ["Between two other bedrooms", "在另外两间卧室中间"],
          ],
          [
            'The passage says: "My bedroom is next to the bathroom." The sister\'s room is between two rooms.',
            "文中说作者的卧室在浴室旁边；在两间卧室中间的是姐姐的房间。",
          ],
        ],
        [
          ["What is the best part of the apartment for the writer?", "作者觉得公寓最好的地方是哪里？"],
          ["The kitchen, with its big window", "有大窗户的厨房"],
          [
            ["The living room, with its big sofa", "有大沙发的客厅"],
            ["The view from the bathroom", "从浴室看到的风景"],
          ],
          [
            'The last paragraph says: "The best part of the apartment is the kitchen. It has a big window."',
            "最后一段说公寓最好的地方是厨房，那里有一扇大窗户。",
          ],
        ],
      ],
    }),
    home({
      id: "a1-home-my-bedroom",
      title: ["My Bedroom", "我的卧室"],
      body: `My bedroom is small, but I love it. It has one window, and my bed is under the window.

Next to the bed there is a small table with a lamp on it. I read in bed every night, so I need the lamp. My desk is near the door, and my computer is on the desk.

There is a big cupboard behind the door. My clothes are in it, and my toys are on the floor of the cupboard.

On the walls there are pictures of my favorite football team. My room is not always clean, but it is my own place.`,
      grammar: ["there-is-and-there-are", "prepositions-of-place"],
      questions: [
        [
          ["Where is the bed?", "床在哪里？"],
          ["Under the window", "在窗户下面"],
          [
            ["Near the door", "在门旁边"],
            ["Behind the door", "在门后面"],
          ],
          ['The passage says: "my bed is under the window."', "文中说：“my bed is under the window.”"],
        ],
        [
          ["Why does the writer need the lamp?", "作者为什么需要台灯？"],
          ["To read in bed every night", "每天晚上在床上看书"],
          [
            ["To use the computer", "用电脑"],
            ["To find clothes in the cupboard", "在柜子里找衣服"],
          ],
          [
            'The passage says: "I read in bed every night, so I need the lamp."',
            "文中说：“I read in bed every night, so I need the lamp.”",
          ],
        ],
        [
          ["What is behind the door?", "门后面有什么？"],
          ["A big cupboard", "一个大柜子"],
          [
            ["The desk", "书桌"],
            ["The bed", "床"],
          ],
          ['The passage says: "There is a big cupboard behind the door."', "文中说：“There is a big cupboard behind the door.”"],
        ],
      ],
    }),
    home({
      id: "a1-home-a-house-by-the-sea",
      title: ["A House by the Sea", "海边的房子"],
      body: `My grandma Sara lives in a small white house by the sea. It has a red roof and blue windows.

There are only four rooms: a kitchen, a living room, a bathroom and one bedroom. The bedroom is up the stairs, under the roof. From its window you can see the sea and the boats.

In front of the house there is a garden with flowers, and behind it there is the beach. In summer we visit her, and we swim every day.

The house is old, and the walls are not straight. But it is the most beautiful house I know.`,
      grammar: ["there-is-and-there-are", "prepositions-of-place"],
      names: ["Sara"],
      questions: [
        [
          ["What color is the roof?", "屋顶是什么颜色的？"],
          ["Red", "红色"],
          [
            ["Blue", "蓝色"],
            ["White", "白色"],
          ],
          ['The passage says: "It has a red roof and blue windows."', "文中说：“It has a red roof and blue windows.”"],
        ],
        [
          ["Where is the bedroom?", "卧室在哪里？"],
          ["Up the stairs, under the roof", "在楼上，屋顶下面"],
          [
            ["Next to the kitchen", "在厨房旁边"],
            ["In the garden", "在花园里"],
          ],
          ['The passage says: "The bedroom is up the stairs, under the roof."', "文中说：“The bedroom is up the stairs, under the roof.”"],
        ],
        [
          ["What is behind the house?", "房子后面是什么？"],
          ["The beach", "海滩"],
          [
            ["A garden with flowers", "种着花的花园"],
            ["A big road", "一条大路"],
          ],
          [
            'The passage says: "In front of the house there is a garden with flowers, and behind it there is the beach."',
            "文中说房子前面是花园，后面是海滩。",
          ],
        ],
      ],
    }),
    home({
      id: "a1-home-who-cleans-the-kitchen",
      title: ["Who Cleans the Kitchen?", "谁打扫厨房？"],
      body: `In our family, everyone helps at home.

Mom usually cooks dinner, and Dad washes the dishes after it. My brother Tom puts the clean dishes in the cupboard. My sister Kate cleans the bathroom on Saturdays, and I clean the windows.

But who cleans the kitchen? We all say: "Not me!" The floor is often dirty, and there are always cups on the table.

So last week Mom had an idea. Now everyone has a day: Dad on Monday, Tom on Tuesday, Kate on Wednesday, and me on Thursday. On Friday the kitchen is very clean!`,
      grammar: ["present-simple"],
      names: ["Tom", "Kate"],
      questions: [
        [
          ["Who washes the dishes after dinner?", "晚饭后谁洗碗？"],
          ["Dad", "爸爸"],
          [
            ["Mom", "妈妈"],
            ["Tom", "汤姆"],
          ],
          ['The passage says: "Mom usually cooks dinner, and Dad washes the dishes after it."', "文中说妈妈通常做晚饭，爸爸饭后洗碗。"],
        ],
        [
          ["What does Kate clean on Saturdays?", "凯特星期六打扫哪里？"],
          ["The bathroom", "浴室"],
          [
            ["The windows", "窗户"],
            ["The kitchen", "厨房"],
          ],
          [
            'The passage says: "My sister Kate cleans the bathroom on Saturdays."',
            "文中说：“My sister Kate cleans the bathroom on Saturdays.”",
          ],
        ],
        [
          ["Who cleans the kitchen on Tuesday?", "星期二谁打扫厨房？"],
          ["Tom", "汤姆"],
          [
            ["Dad", "爸爸"],
            ["Kate", "凯特"],
          ],
          [
            'The passage says: "Dad on Monday, Tom on Tuesday, Kate on Wednesday."',
            "文中说：“Dad on Monday, Tom on Tuesday, Kate on Wednesday.”",
          ],
        ],
      ],
    }),
    home({
      id: "a1-home-where-is-the-cat",
      title: ["Where Is the Cat?", "猫在哪里？"],
      body: `Lily: Mom, where is Tiger? I can't find him.

Mom: Is he on the sofa? He often sleeps there.

Lily: No, he isn't. And he isn't under the table in the kitchen.

Mom: Look behind the TV. He likes that warm place.

Lily: He isn't there. Is he in the garden?

Mom: No, the door is closed. What about your bedroom?

Lily: I'm looking... There's something in my cupboard, between my shirts and my dresses. It's Tiger! He's sleeping on my new T-shirt.

Mom: That cat!`,
      grammar: ["prepositions-of-place", "there-is-and-there-are"],
      names: ["Lily", "Tiger"],
      questions: [
        [
          ["Where does Tiger often sleep?", "老虎（Tiger）常在哪里睡觉？"],
          ["On the sofa", "在沙发上"],
          [
            ["Behind the TV", "在电视后面"],
            ["In the garden", "在花园里"],
          ],
          ['Mom says: "Is he on the sofa? He often sleeps there."', "妈妈说：“Is he on the sofa? He often sleeps there.”"],
        ],
        [
          ["Why can't Tiger be in the garden?", "为什么老虎不可能在花园里？"],
          ["The door is closed", "门关着"],
          [
            ["It is raining", "外面在下雨"],
            ["He doesn't like the garden", "他不喜欢花园"],
          ],
          ['Mom says: "No, the door is closed."', "妈妈说：“No, the door is closed.”"],
        ],
        [
          ["Where is Tiger?", "老虎在哪里？"],
          ["In Lily's cupboard", "在莉莉的柜子里"],
          [
            ["Under Lily's bed", "在莉莉的床下"],
            ["Behind the TV", "在电视后面"],
          ],
          [
            "Lily says: \"There's something in my cupboard, between my shirts and my dresses. It's Tiger!\"",
            "Lily 说她柜子里衬衫和裙子中间有东西，是 Tiger！",
          ],
        ],
      ],
    }),
    home({
      id: "a1-home-a-small-house-with-a-big-garden",
      title: ["A Small House with a Big Garden", "带大花园的小房子"],
      body: `The house of my grandpa is very small. It has only two rooms and a kitchen. But behind the house there is a very large garden.

In the garden there are three big trees and a lot of flowers. Grandpa grows tomatoes, potatoes and other vegetables there too. Between the trees there is an old table with four chairs.

In summer we eat our lunch at that table. Grandpa says the garden is his real home. He works in it every morning, and he sits in it every evening.

His house is small, but his garden is big, and he is happy.`,
      grammar: ["there-is-and-there-are", "prepositions-of-place"],
      names: ["Grandpa"],
      questions: [
        [
          ["How many rooms does the house have?", "房子有几个房间？"],
          ["Two rooms and a kitchen", "两个房间和一个厨房"],
          [
            ["Four rooms", "四个房间"],
            ["Three rooms and a kitchen", "三个房间和一个厨房"],
          ],
          ['The passage says: "It has only two rooms and a kitchen."', "文中说：“It has only two rooms and a kitchen.”"],
        ],
        [
          ["What is between the trees?", "树中间有什么？"],
          ["An old table with four chairs", "一张旧桌子和四把椅子"],
          [
            ["Tomatoes and potatoes", "西红柿和土豆"],
            ["A small house", "一座小房子"],
          ],
          [
            'The passage says: "Between the trees there is an old table with four chairs."',
            "文中说：“Between the trees there is an old table with four chairs.”",
          ],
        ],
        [
          ["What does Grandpa say about the garden?", "爷爷怎么说他的花园？"],
          ["It is his real home", "那是他真正的家"],
          [
            ["It is too large", "它太大了"],
            ["It needs more trees", "它需要更多的树"],
          ],
          ['The passage says: "Grandpa says the garden is his real home."', "文中说：“Grandpa says the garden is his real home.”"],
        ],
      ],
    }),
    home({
      id: "a1-home-moving-day",
      title: ["Moving Day", "搬家日"],
      body: `Today is moving day! We are moving from our old apartment to a new house.

Everyone is busy. Dad and two men are carrying the sofa down the stairs. Mom is putting the dishes into bags. My brother Max is helping too. He is carrying his toys to the car.

The new house is near my school. It has a garden, and there are two bathrooms! I have my own bedroom for the first time. In the old apartment, Max and I had one room together.

In the evening we are all tired, but we are happy. Our new home is great.`,
      grammar: ["there-is-and-there-are", "present-continuous"],
      names: ["Max"],
      questions: [
        [
          ["What are Dad and two men carrying?", "爸爸和两个男人在搬什么？"],
          ["The sofa", "沙发"],
          [
            ["The dishes", "盘子"],
            ["The toys", "玩具"],
          ],
          [
            'The passage says: "Dad and two men are carrying the sofa down the stairs."',
            "文中说：“Dad and two men are carrying the sofa down the stairs.”",
          ],
        ],
        [
          ["What is new for the writer in the new house?", "在新房子里，作者有什么新变化？"],
          ["The writer has a bedroom of their own", "作者有了自己的卧室"],
          [
            ["The writer has a new brother", "作者有了一个新弟弟"],
            ["The writer goes to a new school", "作者去了一所新学校"],
          ],
          ['The writer says: "I have my own bedroom for the first time."', "作者说：“I have my own bedroom for the first time.”"],
        ],
        [
          ["How does the family feel in the evening?", "晚上一家人感觉怎样？"],
          ["Tired but happy", "很累但很高兴"],
          [
            ["Sad", "难过"],
            ["Angry", "生气"],
          ],
          [
            'The last paragraph says: "In the evening we are all tired, but we are happy."',
            "最后一段说：“In the evening we are all tired, but we are happy.”",
          ],
        ],
      ],
    }),
  ],
};

const freeTime = passageMaker(words, [
  "a1-words-sports-and-music",
  "a1-words-hobbies",
  "a1-words-parties",
  "a1-words-actions",
  "like-and-love-with-ing",
]);

/** readingFreeTime is the reading unit of the theme Free Time: sports, music, hobbies and parties. */
const readingFreeTime: ReadingUnitDef = {
  id: "a1-reading-free-time",
  title: t("Free Time", "业余时间"),
  passages: [
    freeTime({
      id: "a1-free-the-school-music-club",
      title: ["The School Music Club", "学校音乐社"],
      body: `Our school has a music club. It meets every Wednesday after school, from four o'clock to half past five.

There are fifteen students in the club. Some play the guitar, some play the piano, and two students play the drums. I love singing, so I sing with three other girls.

Our teacher is Mr Park. He is very kind, and he plays the piano very well. He helps us with new songs every week.

At the end of the year the club gives a concert for our families. This year we are learning six songs. I hope my mom and dad enjoy it!`,
      grammar: ["like-and-love-with-ing"],
      names: ["Mr", "Park"],
      questions: [
        [
          ["When does the music club meet?", "音乐社什么时候活动？"],
          ["Every Wednesday after school", "每周三放学后"],
          [
            ["Every day after school", "每天放学后"],
            ["On Saturday morning", "星期六上午"],
          ],
          ['The first paragraph says: "It meets every Wednesday after school."', "第一段说：“It meets every Wednesday after school.”"],
        ],
        [
          ["What does the writer do in the club?", "作者在音乐社做什么？"],
          ["Sings", "唱歌"],
          [
            ["Plays the drums", "打鼓"],
            ["Plays the piano", "弹钢琴"],
          ],
          ['The writer says: "I love singing, so I sing with three other girls."', "作者说她喜欢唱歌，和另外三个女孩一起唱。"],
        ],
        [
          ["What happens at the end of the year?", "年底有什么活动？"],
          ["The club gives a concert for the families", "音乐社为家人们举办音乐会"],
          [
            ["The club gets a new teacher", "音乐社换新老师"],
            ["The students buy new guitars", "学生们买新吉他"],
          ],
          [
            'The passage says: "At the end of the year the club gives a concert for our families."',
            "文中说：“At the end of the year the club gives a concert for our families.”",
          ],
        ],
      ],
    }),
    freeTime({
      id: "a1-free-saturday-in-the-park",
      title: ["Saturday in the Park", "星期六在公园"],
      body: `It's Saturday afternoon, and there are a lot of people in the park.

Near the lake, some children are riding their bikes. Two old men are sitting at a table, and they are playing chess. A girl is painting a picture of the trees.

Ben and his sister Mia are here too. Ben is playing football with his friends. Mia doesn't like football. She is taking photos of the ducks with her new camera.

Their dad is sitting on the grass. He is reading a book and eating an ice cream. Everyone is having fun.`,
      grammar: ["present-continuous"],
      names: ["Ben", "Mia"],
      questions: [
        [
          ["What are the two old men doing?", "两位老人在做什么？"],
          ["Playing chess", "下棋"],
          [
            ["Riding bikes", "骑自行车"],
            ["Painting", "画画"],
          ],
          ['The passage says: "Two old men are sitting at a table, and they are playing chess."', "文中说两位老人坐在桌边下棋。"],
        ],
        [
          ["What is Mia doing?", "米娅在做什么？"],
          ["Taking photos of the ducks", "给鸭子拍照"],
          [
            ["Playing football", "踢足球"],
            ["Eating an ice cream", "吃冰淇淋"],
          ],
          [
            'The passage says: "She is taking photos of the ducks with her new camera."',
            "文中说：“She is taking photos of the ducks with her new camera.”",
          ],
        ],
        [
          ["Where is their dad?", "他们的爸爸在哪里？"],
          ["Sitting on the grass", "坐在草地上"],
          [
            ["At the table with the old men", "和老人们坐在桌边"],
            ["Near the lake on his bike", "在湖边骑车"],
          ],
          ['The passage says: "Their dad is sitting on the grass."', "文中说：“Their dad is sitting on the grass.”"],
        ],
      ],
    }),
    freeTime({
      id: "a1-free-our-football-team",
      title: ["Our Football Team", "我们的足球队"],
      body: `I play in a football team. Our team is the Tigers, and there are eleven children in it, boys and girls.

We play together every Tuesday and Thursday after school. On Saturdays we often have a game with another team.

Last Saturday we played with the Lions. It rained all afternoon, but we played. Our shoes and socks got very dirty! Our moms and dads stood near us with umbrellas, and they called our names.

After the game Sam's mom gave everyone a cup of hot tea. We felt cold, but we all laughed. I love playing football with my team.`,
      grammar: ["like-and-love-with-ing"],
      names: ["Tigers", "Lions", "Sam", "Sam's"],
      questions: [
        [
          ["When does the team play together?", "球队什么时候一起练球？"],
          ["Every Tuesday and Thursday after school", "每周二和周四放学后"],
          [
            ["Every day", "每天"],
            ["Only on Saturdays", "只在星期六"],
          ],
          [
            'The passage says: "We play together every Tuesday and Thursday after school."',
            "文中说：“We play together every Tuesday and Thursday after school.”",
          ],
        ],
        [
          ["What was the weather like last Saturday?", "上星期六天气怎样？"],
          ["It rained all afternoon", "下了一下午的雨"],
          [
            ["It was sunny and hot", "晴朗炎热"],
            ["It snowed", "下雪了"],
          ],
          ['The passage says: "It rained all afternoon, but we played."', "文中说：“It rained all afternoon, but we played.”"],
        ],
        [
          ["What did Sam's mom do after the game?", "比赛后萨姆的妈妈做了什么？"],
          ["She gave everyone hot tea", "她给每个人一杯热茶"],
          [
            ["She took photos", "她拍照"],
            ["She gave everyone an umbrella", "她给每个人一把伞"],
          ],
          [
            'The passage says: "After the game Sam\'s mom gave everyone a cup of hot tea."',
            "文中说：“After the game Sam's mom gave everyone a cup of hot tea.”",
          ],
        ],
      ],
    }),
    freeTime({
      id: "a1-free-a-kite-on-a-windy-day",
      title: ["A Kite on a Windy Day", "刮风天放风筝"],
      body: `It's a windy Sunday, and Leo and his grandpa are on the hill near their home. Leo has a new kite. It is red and yellow, and it looks like a big bird.

At first the kite doesn't fly. It goes up, and then it comes down again. "Run, Leo!" says Grandpa. Leo runs down the hill, and the wind takes the kite up into the sky.

The kite flies high over the trees. Leo laughs. "Look, Grandpa! It's flying!"

They stay on the hill for two hours. Then the wind stops, and the kite comes down. Leo is tired, but he wants to come again next week.`,
      grammar: ["like-and-love-with-ing"],
      names: ["Leo"],
      questions: [
        [
          ["What does the kite look like?", "风筝看起来像什么？"],
          ["A big bird", "一只大鸟"],
          [
            ["A fish", "一条鱼"],
            ["A plane", "一架飞机"],
          ],
          [
            'The passage says: "It is red and yellow, and it looks like a big bird."',
            "文中说：“It is red and yellow, and it looks like a big bird.”",
          ],
        ],
        [
          ["What helps the kite go up into the sky?", "什么帮助风筝飞上天？"],
          ["Leo runs down the hill, and the wind takes it up", "利奥跑下山坡，风把它带上去"],
          [
            ["Grandpa throws it", "爷爷把它扔上去"],
            ["Leo stands on a tree", "利奥站在树上"],
          ],
          [
            'The passage says: "Leo runs down the hill, and the wind takes the kite up into the sky."',
            "文中说利奥跑下山坡，风把风筝带上了天空。",
          ],
        ],
        [
          ["Why does the kite come down at the end?", "风筝最后为什么掉下来？"],
          ["The wind stops", "风停了"],
          [
            ["Leo is tired", "利奥累了"],
            ["It starts to rain", "开始下雨了"],
          ],
          ['The passage says: "Then the wind stops, and the kite comes down."', "文中说：“Then the wind stops, and the kite comes down.”"],
        ],
      ],
    }),
    freeTime({
      id: "a1-free-grandpa-plays-chess",
      title: ["Grandpa Plays Chess", "爷爷下棋"],
      body: `My grandpa Lin loves playing chess. He plays it every day in the park near his apartment.

His friend Mr Wang is always there too. They sit at the same table under a big tree. They don't talk much. They think a lot, and their games are slow. Sometimes one game takes two hours!

Other old men stand near the table and watch. They often tell Grandpa which move to make, but he never listens to them.

Last month Grandpa started to teach me. I'm not very good, but I enjoy it. Grandpa says I can play with Mr Wang next year.`,
      grammar: ["like-and-love-with-ing", "present-simple"],
      names: ["Mr", "Lin", "Wang"],
      questions: [
        [
          ["Where does Grandpa play chess?", "爷爷在哪里下棋？"],
          ["In the park near his apartment", "在公寓附近的公园里"],
          [
            ["At home", "在家里"],
            ["At a chess club", "在棋社"],
          ],
          [
            'The first paragraph says: "He plays it every day in the park near his apartment."',
            "第一段说：“He plays it every day in the park near his apartment.”",
          ],
        ],
        [
          ["What do the other old men do?", "其他老人做什么？"],
          ["They watch and tell Grandpa which move to make", "他们在旁边看，还告诉爷爷该怎么走"],
          [
            ["They play with Mr Wang", "他们和王先生下棋"],
            ["They sing songs", "他们唱歌"],
          ],
          [
            'The passage says they stand near the table and watch, and "They often tell Grandpa which move to make."',
            "文中说他们站在桌边看，还常告诉爷爷该怎么走。",
          ],
        ],
        [
          ["What did Grandpa start last month?", "爷爷上个月开始做什么？"],
          ["He started to teach the writer chess", "他开始教作者下棋"],
          [
            ["He started to play with Mr Wang", "他开始和王先生下棋"],
            ["He started to listen to the other men", "他开始听其他人的话"],
          ],
          ['The passage says: "Last month Grandpa started to teach me."', "文中说：“Last month Grandpa started to teach me.”"],
        ],
      ],
    }),
    freeTime({
      id: "a1-free-a-party-for-lucy",
      title: ["A Party for Lucy", "露西的派对"],
      body: `Next Saturday is Lucy's birthday. She is ten on that day, and she is having a party at home. She is inviting twelve friends from school.

Her mom is making a big fruit cake with a lot of cream. Her dad is putting up pictures and pink and yellow paper in the living room.

At the party the children are going to play games, dance and sing songs. Lucy's friend Anna is bringing her guitar.

Lucy hopes everyone comes. She loves parties, and she loves gifts too!`,
      grammar: ["like-and-love-with-ing"],
      names: ["Lucy", "Lucy's", "Anna"],
      questions: [
        [
          ["How old is Lucy on her birthday?", "露西生日那天满几岁？"],
          ["Ten", "十岁"],
          [
            ["Twelve", "十二岁"],
            ["Nine", "九岁"],
          ],
          ['The passage says: "She is ten on that day."', "文中说：“She is going to be ten.”"],
        ],
        [
          ["What kind of cake is her mom making?", "她妈妈在做什么蛋糕？"],
          ["A fruit cake", "水果蛋糕"],
          [
            ["A chocolate cake with no cream", "不加奶油的巧克力蛋糕"],
            ["An ice cream cake", "冰淇淋蛋糕"],
          ],
          [
            'The passage says: "Her mom is making a big fruit cake with a lot of cream."',
            "文中说：“Her mom is making a big fruit cake with a lot of cream.”",
          ],
        ],
        [
          ["What is Anna bringing?", "安娜要带什么来？"],
          ["Her guitar", "她的吉他"],
          [
            ["A cake", "一个蛋糕"],
            ["Colored paper", "彩纸"],
          ],
          ['The passage says: "Lucy\'s friend Anna is bringing her guitar."', "文中说：“Lucy's friend Anna is bringing her guitar.”"],
        ],
      ],
    }),
    freeTime({
      id: "a1-free-what-is-your-hobby",
      title: ["What Is Your Hobby?", "你的爱好是什么？"],
      body: `Our teacher, Mr Brown, asked us about our hobbies. Here are some answers.

Mia: My hobby is painting. I paint flowers and animals, and sometimes I paint my cat. I enjoy it because it is quiet.

Jack: I like riding my bike. Every weekend I ride with my dad by the river. It's fun, and it's good for my body.

Ella: I love taking photos. I have an old camera from my grandma. I take photos of people in the street.

Mr Brown: And my hobby? I play the drums! The people in the next apartment don't like my hobby very much.`,
      grammar: ["like-and-love-with-ing"],
      names: ["Mia", "Jack", "Ella", "Mr", "Brown"],
      questions: [
        [
          ["Why does Mia enjoy painting?", "米娅为什么喜欢画画？"],
          ["It is quiet", "因为很安静"],
          [
            ["It is good for her body", "因为对身体好"],
            ["Her grandma paints", "因为她奶奶画画"],
          ],
          ['Mia says: "I enjoy it because it is quiet."', "Mia 说：“I enjoy it because it is quiet.”"],
        ],
        [
          ["Who does Jack ride his bike with?", "杰克和谁一起骑车？"],
          ["His dad", "他爸爸"],
          [
            ["His teacher", "他的老师"],
            ["Ella", "埃拉"],
          ],
          ['Jack says: "Every weekend I ride with my dad by the river."', "Jack 说：“Every weekend I ride with my dad by the river.”"],
        ],
        [
          ["What is Mr Brown's hobby?", "布朗老师的爱好是什么？"],
          ["Playing the drums", "打鼓"],
          [
            ["Taking photos", "拍照"],
            ["Painting", "画画"],
          ],
          ['Mr Brown says: "I play the drums."', "Brown 老师说：“I play the drums.”"],
        ],
      ],
    }),
  ],
};

const school = passageMaker(words, [
  "a1-words-school-subjects",
  "a1-words-schoolwork",
  "a1-words-little-words-2",
  "present-simple-negatives",
  "present-simple-questions",
]);

/** readingSchool is the reading unit of the theme School: subjects, tests, teachers and questions in class. */
const readingSchool: ReadingUnitDef = {
  id: "a1-reading-school",
  title: t("School", "学校"),
  passages: [
    school({
      id: "a1-school-a-school-in-the-mountains",
      title: ["A School in the Mountains", "山里的学校"],
      body: `Li Hua is twelve, and she lives in a small town in the mountains of Yunnan. Her school is very small. There are only thirty students and three teachers.

The school is far from her home. Every morning she walks for an hour, up and down two hills. She doesn't take a bus, because there is no bus.

The students learn Chinese, math, science, English and art. Li Hua's favorite subject is science. One day she wants to help sick people, like a doctor.

The school doesn't have many books, but the teachers are very kind, and the students love learning.`,
      grammar: ["present-simple", "present-simple-negatives"],
      names: ["Yunnan", "Li", "Hua", "Hua's"],
      questions: [
        [
          ["How many students are in the school?", "学校有多少学生？"],
          ["Thirty", "三十个"],
          [
            ["Three", "三个"],
            ["Twelve", "十二个"],
          ],
          [
            'The passage says: "There are only thirty students and three teachers."',
            "文中说：“There are only thirty students and three teachers.”",
          ],
        ],
        [
          ["How does Li Hua get to school?", "李华怎么去上学？"],
          ["She walks for an hour", "她走一个小时的路"],
          [
            ["She takes a bus", "她坐公共汽车"],
            ["Her father drives her", "她爸爸开车送她"],
          ],
          [
            'The passage says: "Every morning she walks for an hour... She doesn\'t take a bus, because there is no bus."',
            "文中说她每天早上走一个小时，因为没有公共汽车。",
          ],
        ],
        [
          ["What is Li Hua's favorite subject?", "李华最喜欢哪门课？"],
          ["Science", "科学"],
          [
            ["English", "英语"],
            ["Art", "美术"],
          ],
          ['The passage says: "Li Hua\'s favorite subject is science."', "文中说：“Li Hua's favorite subject is science.”"],
        ],
      ],
    }),
    school({
      id: "a1-school-my-favorite-subject",
      title: ["My Favorite Subject", "我最喜欢的科目"],
      body: `Everyone in my class has a favorite subject.

My favorite subject is history. I love learning about the lives of people a long time before us. Our history teacher tells great stories.

My friend Tom doesn't like history. He says it has too many dates! Tom loves math, because there is always a right answer. I don't like math very much. It is difficult for me.

But Tom helps me with it. And I help him with history. We are a good team!`,
      grammar: ["present-simple-negatives"],
      names: ["Tom"],
      questions: [
        [
          ["What is the writer's favorite subject?", "作者最喜欢哪门课？"],
          ["History", "历史"],
          [
            ["Math", "数学"],
            ["Science", "科学"],
          ],
          ['The writer says: "My favorite subject is history."', "作者说：“My favorite subject is history.”"],
        ],
        [
          ["Why does Tom love math?", "汤姆为什么喜欢数学？"],
          ["There is always a right answer", "总有一个正确答案"],
          [
            ["The teacher tells great stories", "老师故事讲得好"],
            ["It has a lot of dates", "有很多日期"],
          ],
          ['The passage says: "Tom loves math, because there is always a right answer."', "文中说汤姆喜欢数学，因为总有正确答案。"],
        ],
        [
          ["How do the two friends help each other?", "两个朋友怎样互相帮助？"],
          ["Tom helps with math, and the writer helps with history", "汤姆帮忙学数学，作者帮忙学历史"],
          [
            ["They do their homework together every day", "他们每天一起做作业"],
            ["They ask the teacher for help", "他们请老师帮忙"],
          ],
          ['The passage says: "Tom helps me. And I help him with history."', "文中说汤姆帮作者学数学，作者帮汤姆学历史。"],
        ],
      ],
    }),
    school({
      id: "a1-school-the-science-test",
      title: ["The Science Test", "科学考试"],
      body: `Ben: Do we have a science test today?

Amy: Yes, we do. It's at ten o'clock. Don't you know?

Ben: No! I don't know anything about animals. Which pages are in the test?

Amy: Pages twenty to thirty. They're about animals and water.

Ben: Do animals need water every day?

Amy: Yes, they do. And they need food too. Do you understand that page?

Ben: I think so. Thanks, Amy!

After the test Mrs Clark gives the papers back. Ben has eight answers right and two wrong. "Good work, Ben!" she says. Ben smiles at Amy.`,
      grammar: ["present-simple-questions", "present-simple-negatives"],
      names: ["Ben", "Amy", "Mrs", "Clark"],
      questions: [
        [
          ["When is the science test?", "科学考试是几点？"],
          ["At ten o'clock", "十点"],
          [
            ["At eight o'clock", "八点"],
            ["After lunch", "午饭后"],
          ],
          ["Amy says: \"It's at ten o'clock.\"", "Amy 说：“It's at ten o'clock.”"],
        ],
        [
          ["Which pages are in the test?", "考试考哪几页？"],
          ["Pages twenty to thirty", "第二十到三十页"],
          [
            ["Pages ten to twenty", "第十到二十页"],
            ["Page eight", "第八页"],
          ],
          ['Amy says: "Pages twenty to thirty."', "Amy 说：“Pages twenty to thirty.”"],
        ],
        [
          ["How many answers does Ben get right?", "本答对了几道题？"],
          ["Eight", "八道"],
          [
            ["Two", "两道"],
            ["Ten", "十道"],
          ],
          ['The passage says: "Ben has eight answers right and two wrong."', "文中说：“Ben has eight answers right and two wrong.”"],
        ],
      ],
    }),
    school({
      id: "a1-school-a-new-teacher",
      title: ["A New Teacher", "新老师"],
      body: `This year we have a new English teacher. Her name is Ms Green, and she is from Australia.

On the first day she asked everyone a question: "What is your favorite word in English?" My friend said "pizza", and everyone laughed. My word is "sky".

Ms Green doesn't give us a lot of tests. She likes games and songs. Every Friday we learn a new song, and we sing it together. She also reads us a story at the end of every lesson.

Her lessons are always fun. I think English is my favorite subject now!`,
      grammar: ["present-simple-negatives"],
      names: ["Ms", "Green", "Australia"],
      questions: [
        [
          ["Where is Ms Green from?", "格林老师来自哪里？"],
          ["Australia", "澳大利亚"],
          [
            ["China", "中国"],
            ["Canada", "加拿大"],
          ],
          [
            'The passage says: "Her name is Ms Green, and she is from Australia."',
            "文中说：“Her name is Ms Green, and she is from Australia.”",
          ],
        ],
        [
          ["What is the writer's favorite word?", "作者最喜欢的单词是什么？"],
          ["Sky", "sky（天空）"],
          [
            ["Pizza", "pizza（比萨饼）"],
            ["Song", "song（歌）"],
          ],
          ['The writer says: "My word is \'sky\'." The friend\'s word is "pizza".', "作者说自己的词是 sky，pizza 是朋友的词。"],
        ],
        [
          ["What do they do every Friday?", "他们每周五做什么？"],
          ["They learn a new song", "学一首新歌"],
          [
            ["They have a test", "考试"],
            ["They write a story", "写故事"],
          ],
          [
            'The passage says: "Every Friday we learn a new song, and we sing it together."',
            "文中说：“Every Friday we learn a new song, and we sing it together.”",
          ],
        ],
      ],
    }),
    school({
      id: "a1-school-questions-in-class",
      title: ["Questions in Class", "课堂上的提问"],
      body: `Mr Hill: Good morning, everyone. Today we are learning about the sea. Who has a question?

Leo: Mr Hill, why is the sea blue?

Mr Hill: That's a good question, Leo. The sea is blue because of the sky and the sun. Is the sea always blue?

Leo: No, it isn't. Sometimes it's gray or green.

Mr Hill: Right! Any other questions?

Leo: "Ocean" is another word for "sea", right? How do you spell it?

Mr Hill: Can you try? Write it on this paper.

Leo writes the word, and he spells it right. Mr Hill says, "Great job!"`,
      grammar: ["present-simple-questions"],
      names: ["Mr", "Hill", "Leo"],
      glossed: ["ocean"],
      questions: [
        [
          ["What are they learning about today?", "今天他们学什么？"],
          ["The sea", "大海"],
          [
            ["The sky", "天空"],
            ["The sun", "太阳"],
          ],
          ['Mr Hill says: "Today we are learning about the sea."', "Hill 老师说：“Today we are learning about the sea.”"],
        ],
        [
          ["What is Leo's first question?", "利奥的第一个问题是什么？"],
          ["Why is the sea blue?", "大海为什么是蓝色的？"],
          [
            ['How do you spell "sea"?', "sea 怎么拼？"],
            ["Is the sea always blue?", "大海总是蓝色的吗？"],
          ],
          ['Leo asks: "Mr Hill, why is the sea blue?"', "Leo 问：“Mr Hill, why is the sea blue?”"],
        ],
        [
          ["What does Leo write on the paper?", "利奥在纸上写了什么？"],
          ['The word "ocean"', "ocean 这个词"],
          [
            ["His name", "他的名字"],
            ["A question", "一个问题"],
          ],
          ['Mr Hill asks him to write "ocean" on the paper, and Leo spells it right.', "Hill 老师让他把 ocean 写在纸上，他拼对了。"],
        ],
      ],
    }),
    school({
      id: "a1-school-art-on-friday",
      title: ["Art on Friday", "星期五的美术课"],
      body: `It's Friday afternoon, and we have art. This is my favorite lesson of the week.

Today we are painting pictures of our families. I am painting my mom, my dad, my baby brother and our dog. My friend Nina is painting her grandma's garden, because her grandma is her family too.

The teacher goes to every desk and looks at our pictures. She doesn't say "right" or "wrong" in art. She says, "Tell me about your picture."

At the end of the lesson we put our pictures on the wall. Now the classroom looks beautiful.`,
      grammar: ["present-continuous"],
      names: ["Nina", "grandma's"],
      questions: [
        [
          ["What are the students painting today?", "学生们今天画什么？"],
          ["Pictures of their families", "他们家人的画"],
          [
            ["Pictures of animals", "动物的画"],
            ["Pictures of the school", "学校的画"],
          ],
          [
            'The passage says: "Today we are painting pictures of our families."',
            "文中说：“Today we are painting pictures of our families.”",
          ],
        ],
        [
          ["What does the teacher say about the pictures?", "老师对画说什么？"],
          ['"Tell me about your picture."', "“给我讲讲你的画。”"],
          [
            ['"That\'s wrong."', "“画错了。”"],
            ['"That\'s right."', "“画对了。”"],
          ],
          [
            "The passage says: \"She doesn't say 'right' or 'wrong' in art. She says, 'Tell me about your picture.'\"",
            "文中说老师在美术课上不说对错，而是说“给我讲讲你的画”。",
          ],
        ],
        [
          ["Where do they put the pictures?", "他们把画放在哪里？"],
          ["On the wall", "墙上"],
          [
            ["In their bags", "书包里"],
            ["On the teacher's desk", "老师的桌子上"],
          ],
          [
            'The passage says: "At the end of the lesson we put our pictures on the wall."',
            "文中说：“At the end of the lesson we put our pictures on the wall.”",
          ],
        ],
      ],
    }),
    school({
      id: "a1-school-everyone-helps",
      title: ["Everyone Helps", "大家互相帮助"],
      body: `There is a new boy in our class. His name is Carlos, and he is from Spain. He speaks Spanish, but he doesn't speak much English.

On his first day he looked sad. He didn't understand the questions in math, and he didn't know the other children.

So now everyone helps him. At lunch I teach him English words for food. My friend Mei shows him the library. In math our teacher writes the questions on paper, and Carlos answers them all right. He is very good at math!

And Carlos teaches us Spanish. Now I can say "hola". Hola is Spanish for "hello".`,
      grammar: ["present-simple"],
      names: ["Carlos", "Spain", "Mei"],
      glossed: ["spanish", "hola"],
      questions: [
        [
          ["Where is Carlos from?", "卡洛斯来自哪里？"],
          ["Spain", "西班牙"],
          [
            ["China", "中国"],
            ["Australia", "澳大利亚"],
          ],
          ['The passage says: "His name is Carlos, and he is from Spain."', "文中说：“His name is Carlos, and he is from Spain.”"],
        ],
        [
          ["How does the writer help Carlos?", "作者怎样帮助卡洛斯？"],
          ["The writer teaches him English words for food", "教他与食物有关的英语单词"],
          [
            ["The writer shows him the library", "带他参观图书馆"],
            ["The writer helps him with math", "帮他学数学"],
          ],
          [
            'The writer says: "At lunch I teach him English words for food." Mei shows him the library.',
            "作者说午饭时教他食物的英语单词；带他去图书馆的是 Mei。",
          ],
        ],
        [
          ['What does "hola" mean?', "hola 是什么意思？"],
          ["Hello", "你好"],
          [
            ["Goodbye", "再见"],
            ["Thank you", "谢谢"],
          ],
          ["The passage says: \"It means 'hello'.\"", "文中说：“It means 'hello'.”"],
        ],
      ],
    }),
  ],
};

const library = passageMaker(words, ["a1-words-library", "a1-words-books", "object-pronouns", "the-article-the"]);

/** readingLibrary is the reading unit of the theme The Library: borrowing and returning books, the librarian and quiet places to read. */
const readingLibrary: ReadingUnitDef = {
  id: "a1-reading-library",
  title: t("The Library", "图书馆"),
  passages: [
    library({
      id: "a1-library-a-day-at-the-town-library",
      title: ["A Day at the Town Library", "在镇图书馆的一天"],
      body: `On Saturdays I go to the town library with my sister Anna. The library is a big old building near the park, and it opens at nine.

On the first floor there are books for children. There are stories, comics and books about animals and science. Anna loves the comics. I like the books about history.

On the second floor there are computers and tables. Students do their projects there.

We can borrow five books every week. The librarian puts them in a bag for us, and we take them home. We return them the next Saturday.`,
      grammar: ["the-article-the"],
      names: ["Anna"],
      questions: [
        [
          ["When does the library open?", "图书馆几点开门？"],
          ["At nine", "九点"],
          [
            ["At ten", "十点"],
            ["At eight", "八点"],
          ],
          ['The first paragraph says: "it opens at nine."', "第一段说：“it opens at nine.”"],
        ],
        [
          ["What is on the second floor?", "二楼有什么？"],
          ["Computers and tables", "电脑和桌子"],
          [
            ["Books for children", "儿童书"],
            ["Comics", "漫画书"],
          ],
          [
            'The passage says: "On the second floor there are computers and tables."',
            "文中说：“On the second floor there are computers and tables.”",
          ],
        ],
        [
          ["How many books can they borrow every week?", "他们每周可以借几本书？"],
          ["Five", "五本"],
          [
            ["Two", "两本"],
            ["Ten", "十本"],
          ],
          ['The passage says: "We can borrow five books every week."', "文中说：“We can borrow five books every week.”"],
        ],
      ],
    }),
    library({
      id: "a1-library-a-lost-library-card",
      title: ["A Lost Library Card", "丢失的借书卡"],
      body: `Sam: Hello. I want to borrow these two books, but I can't find my library card.

Librarian: I see. Where is it? Do you have it in your bag?

Sam: No, I looked in my bag, and I looked in my coat too. It isn't there.

Librarian: That's okay. What's your name?

Sam: Sam Brown.

Librarian: Let me look on the computer... Yes, here you are. You can take the books today. But you need a new card. It's two dollars.

Sam: Thank you! Here are two dollars.

Librarian: And here is your new card. Please keep it in your bag!`,
      grammar: ["object-pronouns"],
      names: ["Sam", "Brown"],
      questions: [
        [
          ["What is Sam's problem?", "萨姆遇到了什么问题？"],
          ["He can't find his library card", "他找不到借书卡"],
          [
            ["He can't find the books", "他找不到书"],
            ["He doesn't have any money", "他没有钱"],
          ],
          ['Sam says: "I can\'t find my library card."', "Sam 说：“I can't find my library card.”"],
        ],
        [
          ["Where does the librarian find Sam's name?", "图书管理员在哪里找到萨姆的名字？"],
          ["On the computer", "在电脑上"],
          [
            ["In his bag", "在他的书包里"],
            ["On a book", "在一本书上"],
          ],
          ['The librarian says: "Let me look on the computer... Yes, here you are."', "管理员说她在电脑上查，找到了。"],
        ],
        [
          ["How much is a new card?", "新卡多少钱？"],
          ["Two dollars", "两美元"],
          [
            ["Five dollars", "五美元"],
            ["Nothing", "免费"],
          ],
          ['The librarian says: "But you need a new card. It\'s two dollars."', "管理员说：“But you need a new card. It's two dollars.”"],
        ],
      ],
    }),
    library({
      id: "a1-library-the-story-corner",
      title: ["The Story Corner", "故事角"],
      body: `In our library there is a small room for young children. We call it the story corner. It has small chairs, a big table and pictures of animals on the walls.

Every Wednesday afternoon, the librarian, Mrs Lee, reads a story to the children. She makes funny faces when she reads, and the children laugh a lot. My brother is five, and he goes every week.

After the story the children draw pictures of it. Then they borrow books, and they take them home.

My brother says the story corner is his favorite place in the town.`,
      grammar: ["the-article-the"],
      names: ["Mrs", "Lee"],
      questions: [
        [
          ["Who is the story corner for?", "故事角是给谁的？"],
          ["Young children", "小孩子"],
          [
            ["Old people", "老人"],
            ["Students with projects", "做课题的学生"],
          ],
          ['The passage says: "there is a small room for young children."', "文中说：“there is a small room for young children.”"],
        ],
        [
          ["When does Mrs Lee read a story?", "李太太什么时候讲故事？"],
          ["Every Wednesday afternoon", "每周三下午"],
          [
            ["Every morning", "每天早上"],
            ["On Saturdays", "每个星期六"],
          ],
          [
            'The passage says: "Every Wednesday afternoon, the librarian, Mrs Lee, reads a story to the children."',
            "文中说：“Every Wednesday afternoon, the librarian, Mrs Lee, reads a story to the children.”",
          ],
        ],
        [
          ["What do the children do after the story?", "听完故事后孩子们做什么？"],
          ["They draw pictures of it", "画关于故事的画"],
          [
            ["They sing a song", "唱歌"],
            ["They go to the park", "去公园"],
          ],
          [
            'The passage says: "After the story the children draw pictures of it."',
            "文中说：“After the story the children draw pictures of it.”",
          ],
        ],
      ],
    }),
    library({
      id: "a1-library-books-are-due-on-friday",
      title: ["Books Are Due on Friday", "书星期五到期"],
      body: `Leo has three library books at home. They are due on Friday, and today is Thursday.

He finds two of them fast. One is on his desk, and one is under his bed. But where is the third book? It is a big dictionary, and he needs to return it.

Leo asks his mom. "I don't know," she says. "Ask your sister." Leo asks her. "Yes, I have it," she says. "I need it for my English project. Can I keep it for one more week?"

So on Friday Leo returns two books. At the desk he borrows the dictionary again, for his sister.`,
      grammar: ["object-pronouns"],
      names: ["Leo", "Leo's"],
      questions: [
        [
          ["When are the books due?", "书什么时候到期？"],
          ["On Friday", "星期五"],
          [
            ["On Thursday", "星期四"],
            ["Next week", "下周"],
          ],
          [
            'The first paragraph says: "They are due on Friday, and today is Thursday."',
            "第一段说：“They are due on Friday, and today is Thursday.”",
          ],
        ],
        [
          ["Who has the dictionary?", "词典在谁那里？"],
          ["Leo's sister", "利奥的姐姐"],
          [
            ["Leo's mom", "利奥的妈妈"],
            ["The librarian", "图书管理员"],
          ],
          [
            'His sister says: "Yes, I have it. I need it for my English project."',
            "姐姐说：“Yes, I have it. I need it for my English project.”",
          ],
        ],
        [
          ["What does Leo do on Friday?", "利奥星期五做了什么？"],
          ["He returns two books and borrows the dictionary again", "他还了两本书，又把词典借了一次"],
          [
            ["He returns all three books", "他把三本书全还了"],
            ["He buys a new dictionary", "他买了一本新词典"],
          ],
          [
            'The last paragraph says Leo returns two books, and "he borrows the dictionary again, for his sister."',
            "最后一段说他还了两本书，并为姐姐再借了一次词典。",
          ],
        ],
      ],
    }),
    library({
      id: "a1-library-the-quiet-room",
      title: ["The Quiet Room", "安静的阅览室"],
      body: `Our school library has a quiet room. In this room, students read and do their homework. They don't talk, and they don't use their phones.

Mei goes to the quiet room every day after lunch. She sits at the table by the window, and she reads for half an hour. She says it is the best place in the school.

One day her friend Ella comes in, and she starts to talk to Mei. Everyone looks at them. The librarian comes to the door and shows them the words on the wall: "Quiet, please!"

Ella says sorry, and she sits down with a book.`,
      grammar: ["the-article-the"],
      names: ["Mei", "Ella"],
      questions: [
        [
          ["What can't students do in the quiet room?", "在安静的阅览室里，学生不能做什么？"],
          ["Talk or use their phones", "说话或用手机"],
          [
            ["Read books", "看书"],
            ["Sit at the tables", "坐在桌边"],
          ],
          [
            "The passage says: \"They don't talk, and they don't use their phones.\"",
            "文中说：“They don't talk, and they don't use their phones.”",
          ],
        ],
        [
          ["When does Mei go to the quiet room?", "梅什么时候去阅览室？"],
          ["Every day after lunch", "每天午饭后"],
          [
            ["Every morning", "每天早上"],
            ["On Fridays", "每个星期五"],
          ],
          [
            'The passage says: "Mei goes to the quiet room every day after lunch."',
            "文中说：“Mei goes to the quiet room every day after lunch.”",
          ],
        ],
        [
          ["What does Ella do at the end?", "最后埃拉做了什么？"],
          ["She says sorry and sits down with a book", "她道了歉，拿着书坐下来"],
          [
            ["She leaves the library", "她离开了图书馆"],
            ["She talks on her phone", "她打电话"],
          ],
          [
            'The last line says: "Ella says sorry, and she sits down with a book."',
            "最后一句说：“Ella says sorry, and she sits down with a book.”",
          ],
        ],
      ],
    }),
    library({
      id: "a1-library-a-dictionary-for-sam",
      title: ["A Dictionary for Sam", "给萨姆的词典"],
      body: `Sam is learning English, and he often finds new words in his books. He doesn't know these words, so he asks his teacher. But his teacher is not always there.

For his birthday his grandpa gives him a dictionary. It is a big blue book with a lot of English words in it. Next to every English word there are Chinese words too.

Now when Sam finds a new word, he looks in the dictionary. Last week he found the word "giraffe". He looked for it, and he found a picture of a tall animal with long legs.

Sam takes his dictionary to school every day. His friends call it "Sam's teacher".`,
      grammar: ["object-pronouns"],
      names: ["Sam", "Sam's"],
      questions: [
        [
          ["Why does Sam ask his teacher about words?", "萨姆为什么问老师单词？"],
          ["He doesn't know what they mean", "他不知道它们是什么意思"],
          [
            ["He wants to borrow a book", "他想借书"],
            ["He can't spell them", "他不会拼"],
          ],
          [
            'The passage says: "He doesn\'t know these words, so he asks his teacher."',
            "文中说：“He doesn't know these words, so he asks his teacher.”",
          ],
        ],
        [
          ["Who gives Sam the dictionary?", "谁送给萨姆词典？"],
          ["His grandpa", "他的爷爷"],
          [
            ["His teacher", "他的老师"],
            ["His friends", "他的朋友们"],
          ],
          [
            'The passage says: "For his birthday his grandpa gives him a dictionary."',
            "文中说：“For his birthday his grandpa gives him a dictionary.”",
          ],
        ],
        [
          ["What do his friends call the dictionary?", "他的朋友们管这本词典叫什么？"],
          ['"Sam\'s teacher"', "“萨姆的老师”"],
          [
            ['"Sam\'s book"', "“萨姆的书”"],
            ['"The blue book"', "“蓝书”"],
          ],
          ['The last line says: His friends call it "Sam\'s teacher".', "最后一句说他的朋友们叫它“萨姆的老师”。"],
        ],
      ],
    }),
    library({
      id: "a1-library-the-librarians-favorite-book",
      title: ["The Librarian's Favorite Book", "图书管理员最喜欢的书"],
      body: `Mr Gray is the librarian at our school. He knows every book on every shelf.

One day I asked him, "What is your favorite book?" He smiled and took an old book from a shelf behind his desk. It is green, and you can't read the title now.

"My father gave me this book for my birthday, many years before you came to this school," he said. "It is a story about a boy and a bear in the mountains. I read it every year."

He gave it to me. "You can borrow it, but please bring it back. I love it very much." I read it in two days, and now it is my favorite book too.`,
      grammar: ["the-article-the", "object-pronouns"],
      names: ["Mr", "Gray", "Gray's"],
      questions: [
        [
          ["Where does Mr Gray keep his favorite book?", "格雷先生把他最喜欢的书放在哪里？"],
          ["On a shelf behind his desk", "在他桌子后面的书架上"],
          [
            ["At home", "在家里"],
            ["In his bag", "在包里"],
          ],
          ['The passage says he "took an old book from a shelf behind his desk."', "文中说他从桌子后面的书架上拿出一本旧书。"],
        ],
        [
          ["What is the book about?", "这本书讲什么？"],
          ["A boy and a bear in the mountains", "山里的一个男孩和一只熊"],
          [
            ["A girl and a lion", "一个女孩和一头狮子"],
            ["A library", "一个图书馆"],
          ],
          [
            'Mr Gray says: "It is a story about a boy and a bear in the mountains."',
            "Gray 先生说：“It is a story about a boy and a bear in the mountains.”",
          ],
        ],
        [
          ["How long does the writer take to read the book?", "作者花多长时间读完这本书？"],
          ["Two days", "两天"],
          [
            ["One year", "一年"],
            ["Ten days", "十天"],
          ],
          ['The last paragraph says: "I read it in two days."', "最后一段说：“I read it in two days.”"],
        ],
      ],
    }),
  ],
};

const weather = passageMaker(words, ["a1-words-weather", "a1-words-seasons", "a1-words-nature", "a1-words-wild-animals", "it-for-weather"]);

/** readingWeather is the reading unit of the theme Weather and Nature: the weather, the seasons, places in nature and wild animals. */
const readingWeather: ReadingUnitDef = {
  id: "a1-reading-weather",
  title: t("Weather and Nature", "天气和自然"),
  passages: [
    weather({
      id: "a1-weather-four-seasons-in-one-city",
      title: ["Four Seasons in One City", "一座城市的四季"],
      body: `I live in Beijing. Here we have four very different seasons.

In spring it is warm and windy. The trees in the parks get new leaves, and there are flowers in every garden.

Summer is hot, and it often rains in July. We go swimming, and we eat a lot of ice cream.

Fall is my favorite season. It is cool and sunny, and the sky is very blue. The leaves on the trees turn yellow and red.

Winter is cold, and the wind is cold too. It doesn't snow much, but sometimes the lake in the park turns to ice, and people go on it.`,
      grammar: ["it-for-weather"],
      names: ["Beijing"],
      questions: [
        [
          ["What is the weather like in spring?", "春天天气怎样？"],
          ["Warm and windy", "温暖多风"],
          [
            ["Hot and rainy", "炎热多雨"],
            ["Cold and snowy", "寒冷多雪"],
          ],
          ['The passage says: "In spring it is warm and windy."', "文中说：“In spring it is warm and windy.”"],
        ],
        [
          ["What is the writer's favorite season?", "作者最喜欢哪个季节？"],
          ["Fall", "秋天"],
          [
            ["Summer", "夏天"],
            ["Winter", "冬天"],
          ],
          ['The passage says: "Fall is my favorite season."', "文中说：“Fall is my favorite season.”"],
        ],
        [
          ["What happens to the lake in winter?", "冬天湖会怎样？"],
          ["Sometimes it turns to ice", "有时会结冰"],
          [
            ["It gets very hot", "变得很热"],
            ["It snows a lot on it", "上面下很多雪"],
          ],
          ['The passage says: "sometimes the lake in the park turns to ice."', "文中说：“sometimes the lake in the park turns to ice.”"],
        ],
      ],
    }),
    weather({
      id: "a1-weather-a-rainy-day-at-home",
      title: ["A Rainy Day at Home", "在家的下雨天"],
      body: `It's Sunday, and it's raining. Mia and her brother Leo want to go to the park, but they can't go out in the rain.

"What can we do?" asks Leo. "We can make a small house in the living room," says Mia.

They put two chairs next to the sofa, and they put a big coat over them. Then they sit under it with a lamp, some cookies and their favorite books. Leo reads a story about a bear in the forest. Mia draws pictures of the rain outside the window.

In the afternoon the sun comes out, but they don't want to leave their small house now. "Rainy days are the best days," says Leo.`,
      grammar: ["it-for-weather", "present-continuous"],
      names: ["Mia", "Leo"],
      questions: [
        [
          ["Why can't they go to the park?", "他们为什么不能去公园？"],
          ["It's raining", "在下雨"],
          [
            ["It's snowing", "在下雪"],
            ["It's too hot", "太热了"],
          ],
          ["The passage says: \"it's raining... but they can't go out in the rain.\"", "文中说在下雨，他们不能出去。"],
        ],
        [
          ["What do they make in the living room?", "他们在客厅里做了什么？"],
          ["A small house", "一个小房子"],
          [
            ["A cake", "一个蛋糕"],
            ["A picture of the park", "一幅公园的画"],
          ],
          ['Mia says: "We can make a small house in the living room."', "Mia 说：“We can make a small house in the living room.”"],
        ],
        [
          ["What happens in the afternoon?", "下午发生了什么？"],
          ["The sun comes out", "太阳出来了"],
          [
            ["It starts to snow", "开始下雪"],
            ["They go to the park", "他们去了公园"],
          ],
          ['The last paragraph says: "In the afternoon the sun comes out."', "最后一段说：“In the afternoon the sun comes out.”"],
        ],
      ],
    }),
    weather({
      id: "a1-weather-snow",
      title: ["Snow!", "下雪了！"],
      body: `Tom looks out of the window in the morning, and he smiles. Everything is white! It snowed all night.

There is no school today, because the roads are closed. Tom puts on his warm coat, his hat and warm socks, and he runs outside.

His friends from the street are there too. They make a big man of snow in the garden. He has an orange nose and two black eyes. Then they play in the snow, and they laugh and laugh.

At lunch Tom comes home with cold hands and red ears. Mom gives him a cup of hot milk.`,
      grammar: ["it-for-weather"],
      names: ["Tom"],
      questions: [
        [
          ["Why is there no school today?", "今天为什么不上学？"],
          ["The roads are closed", "路封了"],
          [
            ["It is Saturday", "今天是星期六"],
            ["The teacher is sick", "老师病了"],
          ],
          [
            'The passage says: "There is no school today, because the roads are closed."',
            "文中说：“There is no school today, because the roads are closed.”",
          ],
        ],
        [
          ["What do the children make in the garden?", "孩子们在花园里做了什么？"],
          ["A big man of snow", "一个大雪人"],
          [
            ["A house", "一座房子"],
            ["A fire", "一堆火"],
          ],
          ['The passage says: "They make a big man of snow in the garden."', "文中说：“They make a big man of snow in the garden.”"],
        ],
        [
          ["What does Mom give Tom at lunch?", "午饭时妈妈给汤姆什么？"],
          ["A cup of hot milk", "一杯热牛奶"],
          [
            ["A cup of cold water", "一杯凉水"],
            ["A warm coat", "一件暖和的外套"],
          ],
          ['The last line says: "Mom gives him a cup of hot milk."', "最后一句说：“Mom gives him a cup of hot milk.”"],
        ],
      ],
    }),
    weather({
      id: "a1-weather-a-day-at-the-beach",
      title: ["A Day at the Beach", "海滩上的一天"],
      body: `It's a hot summer day, and Lily's family is at the beach. The sky is blue, and there are no clouds.

Lily's dad is swimming in the sea. Her mom is sitting under a big umbrella, and she is reading a book. Lily and her brother are playing in the water.

At one o'clock they eat sandwiches and fruit. Then the wind starts, and big gray clouds come over the sea. "It's going to rain," says Mom.

They run to the car with their bags. Five minutes later it is raining a lot. But they all had a great day at the beach.`,
      grammar: ["it-for-weather", "present-continuous"],
      names: ["Lily", "Lily's"],
      questions: [
        [
          ["What is Lily's mom doing?", "莉莉的妈妈在做什么？"],
          ["Reading under an umbrella", "在伞下看书"],
          [
            ["Swimming in the sea", "在海里游泳"],
            ["Playing in the water", "在水里玩"],
          ],
          ['The passage says: "Her mom is sitting under a big umbrella, and she is reading a book."', "文中说她妈妈坐在大伞下看书。"],
        ],
        [
          ["What do they eat at one o'clock?", "他们一点钟吃什么？"],
          ["Sandwiches and fruit", "三明治和水果"],
          [
            ["Ice cream", "冰淇淋"],
            ["Fish", "鱼"],
          ],
          ['The passage says: "At one o\'clock they eat sandwiches and fruit."', "文中说：“At one o'clock they eat sandwiches and fruit.”"],
        ],
        [
          ["Why do they run to the car?", "他们为什么跑向车？"],
          ["It is going to rain", "快要下雨了"],
          [
            ["It is too hot", "太热了"],
            ["Lily is tired", "莉莉累了"],
          ],
          ['Gray clouds come, and Mom says: "It\'s going to rain."', "乌云来了，妈妈说：“It's going to rain.”"],
        ],
      ],
    }),
    weather({
      id: "a1-weather-animals-in-winter",
      title: ["Animals in Winter", "动物怎样过冬"],
      body: `Winter is a difficult season for wild animals. It is cold, and there is not much food.

Different animals do different things. Some birds fly to warm countries in the fall, and they come back in the spring.

Bears eat a lot in the summer and fall. In winter they sleep in a warm place in the forest or the mountains. They don't eat for months.

Some small animals keep food for the winter. In the fall they carry food to their homes under the trees.

And some animals get white coats, so you can't see them in the snow.`,
      grammar: ["it-for-weather", "present-simple"],
      questions: [
        [
          ["Why is winter difficult for wild animals?", "为什么冬天对野生动物来说很艰难？"],
          ["It is cold, and there is not much food", "天冷，食物也少"],
          [
            ["There is too much rain", "雨太多"],
            ["There are too many people", "人太多"],
          ],
          ['The first paragraph says: "It is cold, and there is not much food."', "第一段说：“It is cold, and there is not much food.”"],
        ],
        [
          ["What do bears do in winter?", "熊冬天做什么？"],
          ["They sleep in a warm place", "在暖和的地方睡觉"],
          [
            ["They fly to warm countries", "飞到温暖的国家"],
            ["They eat a lot", "吃很多东西"],
          ],
          [
            'The passage says: "In winter they sleep in a warm place in the forest or the mountains."',
            "文中说：“In winter they sleep in a warm place in the forest or the mountains.”",
          ],
        ],
        [
          ["Why do some animals get white coats?", "为什么有些动物会长出白色的皮毛？"],
          ["So you can't see them in the snow", "这样在雪地里就看不见它们"],
          [
            ["So they are beautiful", "这样它们更漂亮"],
            ["So they can fly", "这样它们能飞"],
          ],
          [
            'The last line says some animals get white coats, "so you can\'t see them in the snow."',
            "最后一句说有些动物长出白色皮毛，在雪里就看不见它们了。",
          ],
        ],
      ],
    }),
    weather({
      id: "a1-weather-the-windy-hill",
      title: ["The Windy Hill", "刮风的小山"],
      body: `Near our town there is a high hill. It is always windy up there, so we call it the windy hill.

On Sunday my brother Ben and I walked up the hill with our dog, Max. It took an hour. Up on the hill the wind took my hat! Max ran after it, and he brought it back to me.

From the hill you can see the town, the river and the mountains. We saw a lot of clouds, but sometimes the sun came out.

We sat on the grass, and we ate our sandwiches. Then we walked down. Max felt very tired.`,
      grammar: ["it-for-weather"],
      names: ["Ben", "Max"],
      questions: [
        [
          ["Why do they call it the windy hill?", "为什么叫它“刮风的小山”？"],
          ["It is always windy up there", "山上总是刮风"],
          [
            ["It is very high", "它很高"],
            ["There are a lot of trees", "那里有很多树"],
          ],
          ['The passage says: "It is always windy up there, so we call it the windy hill."', "文中说山顶总是刮风，所以叫它“刮风的小山”。"],
        ],
        [
          ["What happens to the writer's hat?", "作者的帽子怎么了？"],
          ["The wind takes it, and Max brings it back", "被风吹走了，马克斯把它叼了回来"],
          [
            ["It falls in the river", "掉进了河里"],
            ["Ben puts it in his bag", "本把它放进了包里"],
          ],
          [
            'The passage says the wind took the hat, and "Max ran after it, and he brought it back to me."',
            "文中说帽子被吹走了，马克斯追上去把它叼了回来。",
          ],
        ],
        [
          ["What can you see from the hill?", "从山上能看到什么？"],
          ["The town, the river and the mountains", "小镇、河流和群山"],
          [
            ["The sea", "大海"],
            ["Their school only", "只有他们的学校"],
          ],
          ['The passage says: "From the hill you can see the town, the river and the mountains."', "文中说从山上能看到小镇、河流和群山。"],
        ],
      ],
    }),
    weather({
      id: "a1-weather-a-walk-in-the-forest",
      title: ["A Walk in the Forest", "森林里散步"],
      body: `It's a cool fall morning. Amy and her grandma are walking in the forest near the lake.

The leaves are falling from the trees. They are red, yellow and brown. Grandma knows the names of all the trees. "This is an old tree," she says. "It is two hundred years old."

They stop by the river. A small brown animal is drinking water there. "What is it?" asks Amy. "It's a fox," says Grandma. "Don't talk." The fox looks at them, and then it runs into the trees.

Amy takes a red leaf home for her room.`,
      grammar: ["it-for-weather", "present-continuous"],
      names: ["Grandma", "Amy"],
      glossed: ["fox"],
      questions: [
        [
          ["What season is it?", "现在是什么季节？"],
          ["Fall", "秋天"],
          [
            ["Spring", "春天"],
            ["Winter", "冬天"],
          ],
          ['The first line says: "It\'s a cool fall morning."', "第一句说：“It's a cool fall morning.”"],
        ],
        [
          ["How old is the tree?", "那棵树多少岁了？"],
          ["Two hundred years old", "两百岁"],
          [
            ["Twenty years old", "二十岁"],
            ["One hundred years old", "一百岁"],
          ],
          ['Grandma says: "It is two hundred years old."', "奶奶说：“It is two hundred years old.”"],
        ],
        [
          ["What animal do they see by the river?", "他们在河边看到了什么动物？"],
          ["A fox", "一只狐狸"],
          [
            ["A bear", "一只熊"],
            ["A snake", "一条蛇"],
          ],
          ['Grandma says: "It\'s a fox."', "奶奶说：“It's a fox.”"],
        ],
      ],
    }),
  ],
};

const jobs = passageMaker(words, ["a1-words-jobs", "a1-words-describing-people", "a1-words-work-actions"]);

/** readingJobs is the reading unit of the theme People and Jobs: what people do at work and what they are like. */
const readingJobs: ReadingUnitDef = {
  id: "a1-reading-jobs",
  title: t("People and Jobs", "人和职业"),
  passages: [
    jobs({
      id: "a1-jobs-a-day-with-a-nurse",
      title: ["A Day with a Nurse", "护士的一天"],
      body: `My mom, Rosa, is a nurse. She works in the big hospital in our city.

Her day starts very early. She gets up at five o'clock, and she drives to the hospital. At six she meets the other nurses, and they talk about the sick people in every room.

Then she is very busy. She gives people their food and water, she helps them out of bed, and she calls the doctors. She often doesn't have time for lunch.

She comes home at four, and she is tired. But she loves her job. "Every day I help people," she says.`,
      grammar: ["present-simple"],
      names: ["Rosa"],
      questions: [
        [
          ["Where does Rosa work?", "罗莎在哪里工作？"],
          ["In a hospital", "在医院"],
          [
            ["In a school", "在学校"],
            ["In an office", "在办公室"],
          ],
          [
            'The first paragraph says: "She works in the big hospital in our city."',
            "第一段说：“She works in the big hospital in our city.”",
          ],
        ],
        [
          ["What time does she get up?", "她几点起床？"],
          ["At five o'clock", "五点"],
          [
            ["At six o'clock", "六点"],
            ["At four o'clock", "四点"],
          ],
          ['The passage says: "She gets up at five o\'clock."', "文中说：“She gets up at five o'clock.”"],
        ],
        [
          ["Why does she love her job?", "她为什么喜欢她的工作？"],
          ["She helps people every day", "她每天都在帮助别人"],
          [
            ["She has a long lunch", "她午饭时间很长"],
            ["She gets up late", "她起得很晚"],
          ],
          ['She says: "Every day I help people."', "她说：“Every day I help people.”"],
        ],
      ],
    }),
    jobs({
      id: "a1-jobs-grandpa-worked-on-a-farm",
      title: ["Grandpa Worked on a Farm", "爷爷在农场工作过"],
      body: `My grandpa lives in the city now, but he worked on a farm for forty years.

He told me about his days on the farm. He got up at four o'clock every morning, before the sun. First he walked to the cows, and he gave them food and water. Then he worked outside all day. He grew potatoes and other vegetables.

The work never stopped, in summer and in winter. But Grandpa liked it. He loved the animals, and he loved the quiet.

Now he grows tomatoes in a small garden behind his apartment. "It's a very small farm," he says, and he laughs.`,
      names: ["Grandpa"],
      questions: [
        [
          ["How long did Grandpa work on the farm?", "爷爷在农场工作了多久？"],
          ["Forty years", "四十年"],
          [
            ["Four years", "四年"],
            ["Fourteen years", "十四年"],
          ],
          ['The first line says: "he worked on a farm for forty years."', "第一句说：“he worked on a farm for forty years.”"],
        ],
        [
          ["What did he do first every morning?", "他每天早上先做什么？"],
          ["He gave the cows food and water", "给牛喂食喂水"],
          [
            ["He grew potatoes", "种土豆"],
            ["He drove to the city", "开车进城"],
          ],
          [
            'The passage says: "First he walked to the cows, and he gave them food and water."',
            "文中说：“First he walked to the cows, and he gave them food and water.”",
          ],
        ],
        [
          ["What does Grandpa grow now?", "爷爷现在种什么？"],
          ["Tomatoes in a small garden", "在小花园里种西红柿"],
          [
            ["Potatoes on a farm", "在农场种土豆"],
            ["Flowers in a park", "在公园种花"],
          ],
          [
            'The last paragraph says: "Now he grows tomatoes in a small garden behind his apartment."',
            "最后一段说：“Now he grows tomatoes in a small garden behind his apartment.”",
          ],
        ],
      ],
    }),
    jobs({
      id: "a1-jobs-jobs-in-our-town",
      title: ["Jobs in Our Town", "我们镇上的职业"],
      body: `Our town is small, and everyone knows everyone. Here are some of the people on our street.

Mr Wang is a police officer. He is tall and friendly, and he often stands near the school in the morning.

Mrs Lin is a doctor. Her office is next to the bank. She is very kind, and children aren't afraid of her.

Ms Chen drives the town bus. She knows the names of all the old people on her bus, and she always waits for them.

And Mr Kim fixes cars. He is short, and he is very funny. His hands are always dirty!`,
      grammar: ["present-simple"],
      names: ["Mr", "Wang", "Lin", "Ms", "Chen", "Kim", "Mrs"],
      questions: [
        [
          ["What is Mr Wang's job?", "王先生是做什么的？"],
          ["A police officer", "警察"],
          [
            ["A doctor", "医生"],
            ["A bus driver", "公共汽车司机"],
          ],
          ['The passage says: "Mr Wang is a police officer."', "文中说：“Mr Wang is a police officer.”"],
        ],
        [
          ["Where is Mrs Lin's office?", "林医生的诊所在哪里？"],
          ["Next to the bank", "在银行旁边"],
          [
            ["Near the school", "在学校附近"],
            ["On the bus", "在公共汽车上"],
          ],
          ['The passage says: "Her office is next to the bank."', "文中说：“Her office is next to the bank.”"],
        ],
        [
          ["Why are Mr Kim's hands always dirty?", "金先生的手为什么总是脏的？"],
          ["He fixes cars", "他修汽车"],
          [
            ["He drives a bus", "他开公共汽车"],
            ["He grows vegetables", "他种菜"],
          ],
          ['The passage says: "Mr Kim fixes cars... His hands are always dirty!"', "文中说金先生修汽车，所以手总是脏的。"],
        ],
      ],
    }),
    jobs({
      id: "a1-jobs-the-bus-driver",
      title: ["The Bus Driver", "公共汽车司机"],
      body: `Joe is a bus driver. Every day he drives the number nine bus from the train station to the airport and back.

He starts work at six in the morning. The first bus is always quiet, with only some workers on it. At eight o'clock it gets very busy. There are students, office workers and people with big bags for the airport.

Joe is always friendly. He smiles at everyone, and he says "Good morning!" He waits for people when they are running to the bus.

The children on the bus love him. Sometimes they make pictures of Joe's bus, and they give them to him.`,
      grammar: ["present-simple", "adverbs-of-frequency"],
      names: ["Joe", "Joe's"],
      questions: [
        [
          ["Where does Joe's bus go?", "乔的公共汽车开到哪里？"],
          ["From the train station to the airport", "从火车站到机场"],
          [
            ["From the school to the park", "从学校到公园"],
            ["From the hospital to the bank", "从医院到银行"],
          ],
          ['The passage says he drives "from the train station to the airport and back."', "文中说他从火车站开到机场，再开回来。"],
        ],
        [
          ["When does the bus get very busy?", "公共汽车什么时候变得很拥挤？"],
          ["At eight o'clock", "八点"],
          [
            ["At six o'clock", "六点"],
            ["At night", "晚上"],
          ],
          ['The passage says: "At eight o\'clock it gets very busy."', "文中说：“At eight o'clock it gets very busy.”"],
        ],
        [
          ["What do the children sometimes give Joe?", "孩子们有时送给乔什么？"],
          ["Pictures of his bus", "画他公共汽车的画"],
          [
            ["Cake", "蛋糕"],
            ["Bus tickets", "车票"],
          ],
          [
            'The passage says: "Sometimes they make pictures of Joe\'s bus, and they give them to him."',
            "文中说孩子们有时画乔的公共汽车并送给他。",
          ],
        ],
      ],
    }),
    jobs({
      id: "a1-jobs-a-doctors-busy-morning",
      title: ["A Doctor's Busy Morning", "医生忙碌的早晨"],
      body: `It's nine o'clock on Monday morning, and there are a lot of people in Dr Ali's office. Ten people are waiting to see her.

Right now she is talking to an old man. He has a bad cold, and he feels very tired. She tells him to stay in bed for three days and to drink a lot of water.

Next is a young mother with her baby. The baby is crying, because she is hot and sick. Dr Ali is very kind, and after five minutes the baby is smiling at her.

At twelve o'clock Dr Ali has a short lunch. Then she calls the hospital about another sick person. She doesn't stop all day.`,
      grammar: ["present-continuous"],
      names: ["Dr", "Ali", "Ali's"],
      questions: [
        [
          ["How many people are waiting at nine o'clock?", "九点钟有多少人在等？"],
          ["Ten", "十个"],
          [
            ["Three", "三个"],
            ["Twelve", "十二个"],
          ],
          ['The passage says: "Ten people are waiting to see her."', "文中说：“Ten people are waiting to see her.”"],
        ],
        [
          ["What does Dr Ali tell the old man?", "阿里医生告诉那位老人什么？"],
          ["Stay in bed and drink a lot of water", "卧床休息，多喝水"],
          [
            ["Go to the hospital", "去医院"],
            ["Eat a lot of fruit", "多吃水果"],
          ],
          [
            'The passage says: "She tells him to stay in bed for three days and to drink a lot of water."',
            "文中说她让他卧床三天、多喝水。",
          ],
        ],
        [
          ["Why is the baby crying?", "婴儿为什么哭？"],
          ["She is hot and sick", "她发烧生病了"],
          [
            ["She is hungry", "她饿了"],
            ["She is afraid of the doctor", "她害怕医生"],
          ],
          [
            'The passage says: "The baby is crying, because she is hot and sick."',
            "文中说：“The baby is crying, because she is hot and sick.”",
          ],
        ],
      ],
    }),
    jobs({
      id: "a1-jobs-who-builds-houses",
      title: ["Who Builds Houses?", "谁来盖房子？"],
      body: `There is a new house on our street. Every day I watch the workers after school.

There are six workers. They start at seven in the morning, and they stop at four. They carry a lot of big things, and they build the walls one by one. One worker drives a big orange car.

The man who tells them what to do is Ivan. He is tall, and he talks a lot. He shows the workers a big paper with a picture of the house on it.

The house isn't ready, but it is growing every week. A family with three children is going to live in it.`,
      grammar: ["present-simple"],
      names: ["Ivan"],
      questions: [
        [
          ["When do the workers stop work?", "工人们几点收工？"],
          ["At four", "四点"],
          [
            ["At seven", "七点"],
            ["At six", "六点"],
          ],
          [
            'The passage says: "They start at seven in the morning, and they stop at four."',
            "文中说：“They start at seven in the morning, and they stop at four.”",
          ],
        ],
        [
          ["What does Ivan show the workers?", "伊万给工人们看什么？"],
          ["A paper with a picture of the house", "一张画着房子的纸"],
          [
            ["A big orange car", "一辆橙色的大汽车"],
            ["A family photo", "一张全家福"],
          ],
          [
            'The passage says: "He shows the workers a big paper with a picture of the house on it."',
            "文中说：“He shows the workers a big paper with a picture of the house on it.”",
          ],
        ],
        [
          ["Who is going to live in the house?", "谁要住进这座房子？"],
          ["A family with three children", "一个有三个孩子的家庭"],
          [
            ["Ivan", "伊万"],
            ["The writer", "作者"],
          ],
          [
            'The last line says: "A family with three children is going to live in it."',
            "最后一句说：“A family with three children is going to live in it.”",
          ],
        ],
      ],
    }),
    jobs({
      id: "a1-jobs-my-mom-works-in-a-factory",
      title: ["My Mom Works in a Factory", "我妈妈在工厂上班"],
      body: `My mom, Ana, works in a toy factory. The factory makes toy cars, toy trains and toy animals.

Every morning she takes the bus to work at seven. In the factory she wears a blue jacket and a white hat. Her job is to look at every toy car. If a car doesn't work, she fixes it, or she puts it in a red bag.

The work is not easy. She stands all day, and the factory is hot. But she likes the other workers. They eat lunch together, and they tell funny stories.

Sometimes she brings me a toy car home. I have twenty cars now!`,
      grammar: ["present-simple"],
      names: ["Ana", "Ana's"],
      questions: [
        [
          ["What does the factory make?", "这家工厂生产什么？"],
          ["Toys", "玩具"],
          [
            ["Clothes", "衣服"],
            ["Cars for people", "真正的汽车"],
          ],
          [
            'The passage says: "The factory makes toy cars, toy trains and toy animals."',
            "文中说：“The factory makes toy cars, toy trains and toy animals.”",
          ],
        ],
        [
          ["What does Ana do with a car that doesn't work?", "安娜怎样处理有毛病的玩具车？"],
          ["She fixes it, or she puts it in a red bag", "修好它，或者放进红袋子"],
          [
            ["She takes it home", "带回家"],
            ["She gives it to a child", "送给孩子"],
          ],
          [
            'The passage says: "If a car doesn\'t work, she fixes it, or she puts it in a red bag."',
            "文中说：“If a car doesn't work, she fixes it, or she puts it in a red bag.”",
          ],
        ],
        [
          ["Why does she like her job?", "她为什么喜欢她的工作？"],
          ["She likes the other workers", "她喜欢其他工人"],
          [
            ["It is easy", "工作很轻松"],
            ["The factory is quiet", "工厂很安静"],
          ],
          ['The passage says: "But she likes the other workers. They eat lunch together."', "文中说她喜欢其他工人，他们一起吃午饭。"],
        ],
      ],
    }),
  ],
};

const town = passageMaker(words, ["a1-words-town", "a1-words-directions", "a1-words-trips", "wh-questions", "can-for-requests"]);

/** readingTown is the reading unit of the theme Town and Travel: places in town, directions and trips. */
const readingTown: ReadingUnitDef = {
  id: "a1-reading-town",
  title: t("Town and Travel", "城镇和出行"),
  passages: [
    town({
      id: "a1-town-a-map-of-our-town",
      title: ["A Map of Our Town", "我们镇的地图"],
      body: `This is a map of our town. Our town is small, but it has everything.

There is a big park in the town. The museum is on the left of the park, and the bank is on the right. Next to the bank there is a small hotel with a good restaurant.

The train station is on Park Road, near the river. From there, trains go to the city every hour.

There is a bridge over the river. Over the bridge there is the hospital, and behind it there is my school.`,
      grammar: ["there-is-and-there-are", "prepositions-of-place"],
      questions: [
        [
          ["What is on the left of the park?", "公园左边是什么？"],
          ["The museum", "博物馆"],
          [
            ["The bank", "银行"],
            ["The hotel", "旅馆"],
          ],
          [
            'The passage says: "The museum is on the left of the park, and the bank is on the right."',
            "文中说博物馆在公园左边，银行在右边。",
          ],
        ],
        [
          ["How often do trains go to the city?", "去城里的火车多久一班？"],
          ["Every hour", "每小时一班"],
          [
            ["Every day", "每天一班"],
            ["Every week", "每周一班"],
          ],
          ['The passage says: "From there, trains go to the city every hour."', "文中说：“From there, trains go to the city every hour.”"],
        ],
        [
          ["What is over the bridge?", "过了桥是什么？"],
          ["The hospital", "医院"],
          [
            ["The train station", "火车站"],
            ["The museum", "博物馆"],
          ],
          ['The last paragraph says: "Over the bridge there is the hospital."', "最后一段说：“Over the bridge there is the hospital.”"],
        ],
      ],
    }),
    town({
      id: "a1-town-lost-in-the-city",
      title: ["Lost in the City", "在城里迷路"],
      body: `Sara is visiting the city for the first time. She wants to go to the museum, but she can't find it. She stops a woman in the street.

Sara: Hello. Can you help me, please? Where is the museum?

Woman: The museum? It's not far. Go straight on this street, and turn left at the bank.

Sara: Turn left at the bank. And then?

Woman: Then cross the road. The museum is next to a big hotel.

Sara: How long does it take?

Woman: About ten minutes. It's easy to find.

Sara: Thank you very much!`,
      grammar: ["wh-questions", "can-for-requests"],
      names: ["Sara"],
      questions: [
        [
          ["Where does Sara want to go?", "萨拉想去哪里？"],
          ["The museum", "博物馆"],
          [
            ["The bank", "银行"],
            ["The hotel", "旅馆"],
          ],
          ['Sara asks: "Where is the museum?"', "Sara 问：“Where is the museum?”"],
        ],
        [
          ["Where does she turn left?", "她在哪里左转？"],
          ["At the bank", "在银行那里"],
          [
            ["At the hotel", "在旅馆那里"],
            ["At the station", "在车站那里"],
          ],
          [
            'The woman says: "Go straight on this street, and turn left at the bank."',
            "那位女士说：“Go straight on this street, and turn left at the bank.”",
          ],
        ],
        [
          ["How long does it take to walk there?", "走过去要多长时间？"],
          ["About ten minutes", "大约十分钟"],
          [
            ["About an hour", "大约一小时"],
            ["Two minutes", "两分钟"],
          ],
          ['The woman says: "About ten minutes."', "那位女士说：“About ten minutes.”"],
        ],
      ],
    }),
    town({
      id: "a1-town-by-train-to-the-sea",
      title: ["By Train to the Sea", "坐火车去海边"],
      body: `It's the first day of our summer holiday, and we are on the train to the sea. The trip takes three hours.

The train leaves the station at eight o'clock. At first we see the streets and the tall hotels of the city. Then we see farms, rivers and small towns. My brother Ben is looking out of the window at the cows.

Mom is reading, and Dad is sleeping. I am playing a game on my phone.

At eleven o'clock the train arrives. We get off, and we can see the sea from the station. It's blue and beautiful. Our holiday is starting!`,
      grammar: ["present-continuous"],
      names: ["Ben"],
      questions: [
        [
          ["How long does the trip take?", "这趟旅程要多长时间？"],
          ["Three hours", "三个小时"],
          [
            ["One hour", "一个小时"],
            ["Eight hours", "八个小时"],
          ],
          ['The first paragraph says: "The trip takes three hours."', "第一段说：“The trip takes three hours.”"],
        ],
        [
          ["What is Ben doing on the train?", "本在火车上做什么？"],
          ["Looking at the cows", "看奶牛"],
          [
            ["Sleeping", "睡觉"],
            ["Playing a game", "玩游戏"],
          ],
          ['The passage says: "My brother Ben is looking out of the window at the cows."', "文中说本望着窗外看奶牛。"],
        ],
        [
          ["What can they see from the station?", "他们在车站能看到什么？"],
          ["The sea", "大海"],
          [
            ["The city", "城市"],
            ["The farms", "农场"],
          ],
          ['The passage says: "we can see the sea from the station."', "文中说：“we can see the sea from the station.”"],
        ],
      ],
    }),
    town({
      id: "a1-town-the-museum-is-next-to-the-bank",
      title: ["The Museum Is Next to the Bank", "博物馆在银行旁边"],
      body: `Leo: Mia, which bus goes to the museum?

Mia: The number five. But we don't need a bus. It's near here.

Leo: Really? Where is it?

Mia: It's on River Street, next to the bank. We can walk.

Leo: How do we get there?

Mia: We go down this road, and we cross the bridge. Then we turn right, and the museum is on the left.

Leo: What time does it close?

Mia: At five o'clock. It's three now, so we have two hours.

Leo: Great. What can we see there?

Mia: Old maps of our town, and a very big, very old ship!`,
      grammar: ["wh-questions", "prepositions-of-place"],
      names: ["Leo", "Mia"],
      questions: [
        [
          ["Which bus goes to the museum?", "哪路公共汽车去博物馆？"],
          ["The number five", "五路"],
          [
            ["The number three", "三路"],
            ["The number nine", "九路"],
          ],
          ['Mia says: "The number five."', "Mia 说：“The number five.”"],
        ],
        [
          ["Why don't they take the bus?", "他们为什么不坐公共汽车？"],
          ["The museum is near, so they can walk", "博物馆很近，可以走过去"],
          [
            ["The bus is late", "公共汽车晚点了"],
            ["They don't have money", "他们没有钱"],
          ],
          ["Mia says: \"But we don't need a bus. It's near here.\"", "Mia 说他们不需要坐公共汽车，博物馆就在附近。"],
        ],
        [
          ["When does the museum close?", "博物馆几点关门？"],
          ["At five o'clock", "五点"],
          [
            ["At three o'clock", "三点"],
            ["At two o'clock", "两点"],
          ],
          ["Mia says: \"At five o'clock. It's three now.\"", "Mia 说：“At five o'clock. It's three now.”"],
        ],
      ],
    }),
    town({
      id: "a1-town-a-taxi-to-the-airport",
      title: ["A Taxi to the Airport", "打车去机场"],
      body: `Mr Brown is going to London for work. His plane leaves at ten o'clock, and it's seven now. He calls a taxi.

Driver: Good morning. Where are you going?

Mr Brown: To the airport, please. Can you drive fast? My plane leaves at ten.

Driver: That's okay. The roads are quiet this morning. We can get there in forty minutes.

Mr Brown: Great. Can I put my bag in the back of the car?

Driver: Sure. Here you are.

At the airport Mr Brown pays the driver thirty dollars. He has a lot of time, so he buys a coffee and a book. Then he waits for his plane.`,
      grammar: ["can-for-requests", "wh-questions"],
      names: ["Mr", "Brown", "London"],
      questions: [
        [
          ["What time does the plane leave?", "飞机几点起飞？"],
          ["At ten o'clock", "十点"],
          [
            ["At seven o'clock", "七点"],
            ["At forty minutes past seven", "七点四十分"],
          ],
          ['Mr Brown says: "My plane leaves at ten."', "Brown 先生说：“My plane leaves at ten.”"],
        ],
        [
          ["Why can they get there fast?", "他们为什么能很快到达？"],
          ["The roads are quiet", "路上车少"],
          [
            ["The taxi is new", "出租车是新的"],
            ["The airport is near", "机场很近"],
          ],
          [
            'The driver says: "The roads are quiet this morning. We can get there in forty minutes."',
            "司机说今天早上路上车少，四十分钟就能到。",
          ],
        ],
        [
          ["How much does Mr Brown pay?", "布朗先生付了多少钱？"],
          ["Thirty dollars", "三十美元"],
          [
            ["Forty dollars", "四十美元"],
            ["Ten dollars", "十美元"],
          ],
          [
            'The passage says: "At the airport Mr Brown pays the driver thirty dollars."',
            "文中说：“At the airport Mr Brown pays the driver thirty dollars.”",
          ],
        ],
      ],
    }),
    town({
      id: "a1-town-turn-left-at-the-corner",
      title: ["Turn Left at the Corner", "在拐角处左转"],
      body: `Tom is having a party on Saturday, and he is writing to his friend Amy. She doesn't know the way to his new home.

Hi Amy,

Here is the way to my house from the school. Walk out of the school, and turn right. Go straight for five minutes, and you can see a big restaurant on the corner. Turn left at the corner. That's Hill Road.

Walk down Hill Road, past the bank and the hotel. My house is number twenty. It's a white house with a green door, next to a small park.

Can you come at three o'clock? Call me if you can't find it!

Tom`,
      grammar: ["can-for-requests"],
      names: ["Tom", "Amy", "Hill"],
      questions: [
        [
          ["What is on the corner?", "拐角处有什么？"],
          ["A big restaurant", "一家大餐馆"],
          [
            ["A bank", "一家银行"],
            ["A park", "一个公园"],
          ],
          ['The note says: "you can see a big restaurant on the corner."', "便条上说：“you can see a big restaurant on the corner.”"],
        ],
        [
          ["What color is the door of Tom's house?", "汤姆家的门是什么颜色？"],
          ["Green", "绿色"],
          [
            ["White", "白色"],
            ["Red", "红色"],
          ],
          ['The note says: "It\'s a white house with a green door."', "便条上说：“It's a white house with a green door.”"],
        ],
        [
          ["What time does Tom want Amy to come?", "汤姆希望埃米几点来？"],
          ["At three o'clock", "三点"],
          [
            ["At five o'clock", "五点"],
            ["At twenty past four", "四点二十"],
          ],
          ['Tom asks: "Can you come at three o\'clock?"', "Tom 问：“Can you come at three o'clock?”"],
        ],
      ],
    }),
    town({
      id: "a1-town-a-boat-trip",
      title: ["A Boat Trip", "坐船游玩"],
      body: `On Sunday Lily and her grandpa took a boat trip on the river. They bought two tickets at the bridge, and they waited for the boat.

The boat didn't go fast, but Lily liked that. They traveled for two hours. They saw old houses, green hills and a lot of birds. A man on the boat told stories about the town and the river.

At twelve o'clock the boat stopped at a small island. They had lunch in a restaurant there, and they ate fish from the river.

In the afternoon they took the boat back. Lily asked, "Can we come again in the summer?" Grandpa smiled and said, "Yes, we can!"`,
      grammar: ["wh-questions"],
      names: ["Lily", "Grandpa"],
      questions: [
        [
          ["Where did they buy their tickets?", "他们在哪里买的船票？"],
          ["At the bridge", "在桥边"],
          [
            ["On the boat", "在船上"],
            ["At the train station", "在火车站"],
          ],
          ['The passage says: "They bought two tickets at the bridge."', "文中说：“They bought two tickets at the bridge.”"],
        ],
        [
          ["Where did the boat stop at twelve o'clock?", "船十二点停在哪里？"],
          ["At a small island", "一个小岛"],
          [
            ["At a big hotel", "一家大旅馆"],
            ["At the sea", "海边"],
          ],
          [
            'The passage says: "At twelve o\'clock the boat stopped at a small island."',
            "文中说：“At twelve o'clock the boat stopped at a small island.”",
          ],
        ],
        [
          ["What did they eat for lunch?", "他们午饭吃了什么？"],
          ["Fish from the river", "河里的鱼"],
          [
            ["Sandwiches", "三明治"],
            ["Chicken", "鸡肉"],
          ],
          ['The passage says: "they ate fish from the river."', "文中说：“they ate fish from the river.”"],
        ],
      ],
    }),
  ],
};

/** reading are the reading units of A1. */
export const reading: readonly ReadingUnitDef[] = [
  readingAllAboutMe,
  readingMyDay,
  readingTimeAndDates,
  readingFood,
  readingShopping,
  readingHome,
  readingFreeTime,
  readingSchool,
  readingLibrary,
  readingWeather,
  readingJobs,
  readingTown,
];
