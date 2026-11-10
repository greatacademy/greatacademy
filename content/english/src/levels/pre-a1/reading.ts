// The reading units of Pre-A1, one on each theme: short dialogues, notes and descriptions in the words of the level.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "./reading-kit.ts";
import { vocabulary } from "./topics.ts";

const hello = passageMaker(vocabulary, ["pre-a1-words-hello", "pre-a1-words-i-and-you", "the-verb-be"]);

/** readingHello is the reading unit of the theme Hello!: children meet, say their names and say goodbye. */
const readingHello: ReadingUnitDef = {
  id: "pre-a1-reading-hello",
  title: t("Hello!", "你好！"),
  passages: [
    hello({
      id: "pre-a1-hello-im-mia",
      title: ["Hello, I'm Mia", "你好，我是米娅"],
      body: `Mia: Hello! I'm Mia. What's your name?

Leo: Hi, Mia! My name is Leo.

Mia: How old are you, Leo?

Leo: I'm seven. How old are you?

Mia: I'm seven too!

Leo: Are you a friend of Sam?

Mia: Yes, I am. Sam is my friend.

Leo: He's my friend too! Are we friends?

Mia: Yes, we are!`,
      grammar: ["the-verb-be"],
      names: ["Mia", "Leo", "Sam"],
      questions: [
        [
          ["What is the boy's name?", "男孩叫什么名字？"],
          ["Leo", "利奥（Leo）"],
          [
            ["Mia", "米娅（Mia）"],
            ["Sam", "萨姆（Sam）"],
          ],
          ['Leo says: "My name is Leo."', "Leo 说：“My name is Leo.”"],
        ],
        [
          ["How old is Mia?", "米娅几岁？"],
          ["Seven", "七岁"],
          [
            ["Six", "六岁"],
            ["Eight", "八岁"],
          ],
          ['Leo is seven, and Mia says: "I\'m seven too!"', "Leo 七岁，Mia 说：“I'm seven too!”"],
        ],
        [
          ["Who is a friend of Mia and of Leo?", "谁是米娅和利奥两个人的朋友？"],
          ["Sam", "萨姆（Sam）"],
          [
            ["Nobody", "没有人"],
            ["Leo's sister", "利奥的姐姐"],
          ],
          ['Mia says: "Sam is my friend." Leo says: "He\'s my friend too!"', "Mia 说 Sam 是她的朋友，Leo 说他也是自己的朋友。"],
        ],
      ],
    }),
    hello({
      id: "pre-a1-hello-whats-her-name",
      title: ["What's Her Name?", "她叫什么名字？"],
      body: `Anna: Hi! I'm Anna. What's your name?

Ben: I'm Ben.

Anna: And what's her name?

Ben: Her name is Lily. She's my friend.

Anna: Hello, Lily!

Lily: Hi, Anna! Are you a friend of Ben?

Anna: No, I'm not. I'm a friend of his sister, Kate.

Lily: Kate? She's my friend too!

Anna: We are friends too!`,
      grammar: ["the-verb-be"],
      names: ["Anna", "Ben", "Lily", "Kate"],
      questions: [
        [
          ["What is the name of Ben's friend?", "本的朋友叫什么名字？"],
          ["Lily", "莉莉（Lily）"],
          [
            ["Anna", "安娜（Anna）"],
            ["Kate", "凯特（Kate）"],
          ],
          ['Ben says: "Her name is Lily. She\'s my friend."', "Ben 说：“Her name is Lily. She's my friend.”"],
        ],
        [
          ["Who is Kate?", "凯特是谁？"],
          ["Ben's sister", "本的姐姐（妹妹）"],
          [
            ["Anna's sister", "安娜的姐姐（妹妹）"],
            ["Ben's mother", "本的妈妈"],
          ],
          ['Anna says: "I\'m a friend of his sister, Kate." "His" means Ben\'s.', "Anna 说她是 Ben 的姐妹 Kate 的朋友，his 指的是 Ben。"],
        ],
        [
          ["Is Anna a friend of Ben?", "安娜是本的朋友吗？"],
          ["No, she is a friend of Kate", "不是，她是凯特的朋友"],
          [
            ["Yes, she is", "是的"],
            ["No, she is a friend of Lily's mother", "不是，她是莉莉妈妈的朋友"],
          ],
          ["Anna says: \"No, I'm not. I'm a friend of his sister, Kate.\"", "Anna 说：“No, I'm not. I'm a friend of his sister, Kate.”"],
        ],
      ],
    }),
    hello({
      id: "pre-a1-hello-goodbye-tom",
      title: ["Goodbye, Tom!", "再见，汤姆！"],
      body: `Tom: Goodbye, Amy!

Amy: Bye, Tom! Is she your mom?

Tom: No, she isn't. She's my grandma.

Grandma: Hello! What's your name?

Amy: Hello! My name is Amy. I'm a friend of Tom.

Grandma: Hello, Amy. And who is he?

Amy: He's my dad.

Dad: Hello! I'm Amy's dad.

Grandma: Hello! Goodbye, Amy!

Amy: Goodbye! Bye, Tom!`,
      grammar: ["the-verb-be"],
      names: ["Tom", "Amy", "Amy's"],
      questions: [
        [
          ["Who is with Tom?", "谁和汤姆在一起？"],
          ["His grandma", "他的奶奶（外婆）"],
          [
            ["His mom", "他的妈妈"],
            ["His dad", "他的爸爸"],
          ],
          [
            "Amy asks if she is Tom's mom, and Tom says: \"No, she isn't. She's my grandma.\"",
            "Amy 问她是不是 Tom 的妈妈，Tom 说：“No, she isn't. She's my grandma.”",
          ],
        ],
        [
          ["Who is with Amy?", "谁和艾米在一起？"],
          ["Her dad", "她的爸爸"],
          [
            ["Her grandma", "她的奶奶（外婆）"],
            ["Her brother", "她的哥哥（弟弟）"],
          ],
          ['Amy says: "He\'s my dad."', "Amy 说：“He's my dad.”"],
        ],
        [
          ["What do the children say at the end?", "孩子们最后说什么？"],
          ["Goodbye", "再见"],
          [
            ["Hello", "你好"],
            ["Thank you", "谢谢"],
          ],
          ['At the end Amy says: "Goodbye! Bye, Tom!"', "最后 Amy 说：“Goodbye! Bye, Tom!”"],
        ],
      ],
    }),
    hello({
      id: "pre-a1-hello-my-friend-ella",
      title: ["My Friend Ella", "我的朋友埃拉"],
      body: `Hi! I'm Jack. I'm eight years old.

Ella is my friend. Is she eight? No, she isn't. She's nine. Is Ella my sister? No, she isn't. She's my friend.

Max is my friend too. He's eight, and I'm eight. Max and I are friends, and Ella is our friend.

Ella: Hello, Jack! Hello, Max!

Max: Hi, Ella!

Jack: Hi, Ella! Hi, Max!`,
      grammar: ["the-verb-be"],
      names: ["Jack", "Ella", "Max"],
      questions: [
        [
          ["How old is Ella?", "埃拉几岁？"],
          ["Nine", "九岁"],
          [
            ["Eight", "八岁"],
            ["Seven", "七岁"],
          ],
          ["Jack says: \"Is she eight? No, she isn't. She's nine.\"", "Jack 说：“Is she eight? No, she isn't. She's nine.”"],
        ],
        [
          ["Is Ella Jack's sister?", "埃拉是杰克的姐姐（妹妹）吗？"],
          ["No, she is his friend", "不是，她是他的朋友"],
          [
            ["Yes, she is", "是的"],
            ["No, she is Max's sister", "不是，她是马克斯的姐姐（妹妹）"],
          ],
          ["Jack says: \"Is Ella my sister? No, she isn't. She's my friend.\"", "Jack 说 Ella 不是他的姐妹，是他的朋友。"],
        ],
        [
          ["Who is eight, like Jack?", "谁和杰克一样八岁？"],
          ["Max", "马克斯（Max）"],
          [
            ["Ella", "埃拉（Ella）"],
            ["Nobody", "没有人"],
          ],
          ["Jack says about Max: \"He's eight, and I'm eight.\"", "Jack 说到 Max：“He's eight, and I'm eight.”"],
        ],
      ],
    }),
    hello({
      id: "pre-a1-hello-sorry-kate",
      title: ["Thank You and Sorry", "谢谢和对不起"],
      body: `Leo: Hello! Are you Kim?

Kate: No, I'm not. I'm Kate.

Leo: Sorry, Kate! I'm Leo. Is Kim your sister?

Kate: Yes, she is. She's twelve, and I'm ten. Kim! Kim! He's Leo. He's a friend of Sam.

Kim: Hi, Leo! Are you a friend of my brother Sam?

Leo: Yes, I am. Hello, Kim!

Kim: Sam isn't here. Sorry!

Leo: Thank you, Kim. Thank you, Kate! Goodbye!`,
      grammar: ["the-verb-be"],
      names: ["Leo", "Kim", "Kate", "Sam"],
      questions: [
        [
          ["Why does Leo say sorry to Kate?", "利奥为什么对凯特说对不起？"],
          ["He thinks she is Kim", "他以为她是金"],
          [
            ["He does not know Sam", "他不认识萨姆"],
            ["Kate is not his friend", "凯特不是他的朋友"],
          ],
          [
            'Leo asks: "Are you Kim?" Kate says she is Kate, and then Leo says: "Sorry, Kate!"',
            "Leo 问她是不是 Kim，Kate 说她是 Kate，于是 Leo 说：“Sorry, Kate!”",
          ],
        ],
        [
          ["How old is Kim?", "金几岁？"],
          ["Twelve", "十二岁"],
          [
            ["Ten", "十岁"],
            ["Eleven", "十一岁"],
          ],
          ["Kate says: \"She's twelve, and I'm ten.\"", "Kate 说：“She's twelve, and I'm ten.”"],
        ],
        [
          ["Who is Sam?", "萨姆是谁？"],
          ["The brother of Kim and Kate", "金和凯特的哥哥（弟弟）"],
          [
            ["Leo's brother", "利奥的哥哥（弟弟）"],
            ["Kate's friend from school", "凯特的同学"],
          ],
          ['Kim says: "Are you a friend of my brother Sam?" Kim and Kate are sisters.', "Kim 说 Sam 是她的兄弟，Kim 和 Kate 是姐妹。"],
        ],
      ],
    }),
    hello({
      id: "pre-a1-hello-ben-and-ted",
      title: ["Hello from Ben and Ted", "本和特德向你问好"],
      body: `Hello! We are Ben and Ted. We're friends.

I'm Ben. I'm nine. My friend is Ted. He's ten.

Is Ted my brother? No, he isn't. His brother is Tim. Tim is five, and he's my friend too.

Ted and Tim have a sister. Her name is Eva. She's seven. She isn't my sister, but she's my friend.

Bye! We are Ben, Ted, Tim and Eva.`,
      grammar: ["the-verb-be"],
      names: ["Ben", "Ted", "Tim", "Eva"],
      questions: [
        [
          ["How old is Ted?", "特德几岁？"],
          ["Ten", "十岁"],
          [
            ["Nine", "九岁"],
            ["Five", "五岁"],
          ],
          ['Ben says: "My friend is Ted. He\'s ten."', "Ben 说：“My friend is Ted. He's ten.”"],
        ],
        [
          ["Who is Tim?", "蒂姆是谁？"],
          ["Ted's brother", "特德的弟弟"],
          [
            ["Ben's brother", "本的弟弟"],
            ["Eva's friend only", "只是伊娃的朋友"],
          ],
          ['Ben says: "His brother is Tim." "His" means Ted\'s.', "Ben 说：“His brother is Tim.” his 指的是 Ted。"],
        ],
        [
          ["Who is Eva?", "伊娃是谁？"],
          ["The sister of Ted and Tim", "特德和蒂姆的妹妹"],
          [
            ["Ben's sister", "本的妹妹"],
            ["Ted's mother", "特德的妈妈"],
          ],
          ['Ben says: "Ted and Tim have a sister. Her name is Eva."', "Ben 说：“Ted and Tim have a sister. Her name is Eva.”"],
        ],
      ],
    }),
  ],
};

const numbers = passageMaker(vocabulary, [
  "pre-a1-words-numbers",
  "pre-a1-words-colors",
  "pre-a1-words-how-many",
  "a-and-an",
  "plural-nouns-with-s",
]);

/** readingNumbersAndColors is the reading unit of the theme Numbers and Colors: counting, ages and colors. */
const readingNumbersAndColors: ReadingUnitDef = {
  id: "pre-a1-reading-numbers-and-colors",
  title: t("Numbers and Colors", "数字和颜色"),
  passages: [
    numbers({
      id: "pre-a1-numbers-twelve-oranges",
      title: ["Twelve Oranges", "十二个橙子"],
      body: `Lily: Mom, how many oranges do we have?

Mom: We have twelve oranges.

Lily: One, two, three, four, five, six, seven, eight, nine, ten, eleven. Eleven oranges, not twelve!

Mom: Eleven? Not twelve? Who has an orange?

Dad: Sorry! I have an orange. It's here.

Lily: Dad has one orange, and we have eleven. One and eleven is twelve!`,
      grammar: ["plural-nouns-with-s", "a-and-an"],
      names: ["Lily"],
      questions: [
        [
          ["How many oranges does Mom say they have?", "妈妈说他们有几个橙子？"],
          ["Twelve", "十二个"],
          [
            ["Eleven", "十一个"],
            ["Ten", "十个"],
          ],
          ['Mom says: "We have twelve oranges."', "妈妈说：“We have twelve oranges.”"],
        ],
        [
          ["How many oranges does Lily count?", "莉莉数出了几个橙子？"],
          ["Eleven", "十一个"],
          [
            ["Twelve", "十二个"],
            ["One", "一个"],
          ],
          ['Lily counts to eleven and says: "Eleven oranges, not twelve!"', "Lily 数到 eleven，说：“Eleven oranges, not twelve!”"],
        ],
        [
          ["Who has the twelfth orange?", "第十二个橙子在谁那里？"],
          ["Dad", "爸爸"],
          [
            ["Mom", "妈妈"],
            ["Lily", "莉莉"],
          ],
          ['Dad says: "Sorry! I have an orange."', "爸爸说：“Sorry! I have an orange.”"],
        ],
      ],
    }),
    numbers({
      id: "pre-a1-numbers-my-pencils",
      title: ["My Colored Pencils", "我的彩色铅笔"],
      body: `I have twelve pencils. Two pencils are red, and two are blue. Three pencils are green. One is yellow, one is pink and one is purple. Two pencils are black.

And one pencil is orange. Twelve? No! I have thirteen pencils. Sorry!

I love my orange pencil. Orange is a happy color.

My sister has pencils too. She has ten. Her pencils are brown and gray. Brown and gray are not happy colors!`,
      grammar: ["plural-nouns-with-s"],
      glossed: ["thirteen"],
      questions: [
        [
          ["How many pencils are green?", "有几支铅笔是绿色的？"],
          ["Three", "三支"],
          [
            ["Two", "两支"],
            ["One", "一支"],
          ],
          ['The writer says: "Three pencils are green."', "作者说：“Three pencils are green.”"],
        ],
        [
          ["Which pencil does the writer love?", "作者喜爱哪支铅笔？"],
          ["The orange pencil", "橙色的铅笔"],
          [
            ["The purple pencil", "紫色的铅笔"],
            ["The brown pencil", "棕色的铅笔"],
          ],
          ['The writer says: "I love my orange pencil."', "作者说：“I love my orange pencil.”"],
        ],
        [
          ["What colors are the sister's pencils?", "姐姐（妹妹）的铅笔是什么颜色的？"],
          ["Brown and gray", "棕色和灰色"],
          [
            ["Red and blue", "红色和蓝色"],
            ["Pink and purple", "粉色和紫色"],
          ],
          ['The last paragraph says: "Her pencils are brown and gray."', "最后一段说：“Her pencils are brown and gray.”"],
        ],
      ],
    }),
    numbers({
      id: "pre-a1-numbers-how-old-is-sam",
      title: ["How Old Is Sam?", "萨姆几岁？"],
      body: `Hi! I'm Sam. How old am I? I'm not ten, and I'm not twelve. I'm eleven years old.

My sister is Meg. She is older. She's twelve. My brother Joe is the oldest. He isn't a boy. He's a man!

We have a baby sister too. Her name is Rose. She is one year old.

How old are you?`,
      names: ["Sam", "Meg", "Joe", "Rose"],
      questions: [
        [
          ["How old is Sam?", "萨姆几岁？"],
          ["Eleven", "十一岁"],
          [
            ["Ten", "十岁"],
            ["Twelve", "十二岁"],
          ],
          ['Sam says: "I\'m eleven years old."', "Sam 说：“I'm eleven years old.”"],
        ],
        [
          ["Who is twelve?", "谁十二岁？"],
          ["Meg", "梅格（Meg）"],
          [
            ["Joe", "乔（Joe）"],
            ["Rose", "罗丝（Rose）"],
          ],
          ['Sam says: "My sister is Meg. She is older. She\'s twelve."', "Sam 说：“My sister is Meg. She is older. She's twelve.”"],
        ],
        [
          ["Who is the oldest child?", "哪个孩子年纪最大？"],
          ["Joe", "乔（Joe）"],
          [
            ["Meg", "梅格（Meg）"],
            ["Sam", "萨姆（Sam）"],
          ],
          ['Sam says: "My brother Joe is the oldest."', "Sam 说：“My brother Joe is the oldest.”"],
        ],
      ],
    }),
    numbers({
      id: "pre-a1-numbers-three-bags",
      title: ["Red, Blue and Green Bags", "红色、蓝色和绿色的包"],
      body: `Here are three bags: a red bag, a blue bag and a green bag.

The red bag is my bag. It has two pens and a book in it.

The blue bag is Tom's bag. Tom is my brother. His bag has five pencils and an eraser in it.

The green bag isn't my bag, and it isn't Tom's bag. Who has the green bag? Dad has it. And what is in it? An orange!`,
      grammar: ["a-and-an", "plural-nouns-with-s"],
      names: ["Tom", "Tom's"],
      questions: [
        [
          ["What color is the writer's bag?", "作者的包是什么颜色的？"],
          ["Red", "红色"],
          [
            ["Blue", "蓝色"],
            ["Green", "绿色"],
          ],
          ['The writer says: "The red bag is my bag."', "作者说：“The red bag is my bag.”"],
        ],
        [
          ["What is in Tom's bag?", "汤姆的包里有什么？"],
          ["Five pencils and an eraser", "五支铅笔和一块橡皮"],
          [
            ["Two pens and a book", "两支钢笔和一本书"],
            ["An orange", "一个橙子"],
          ],
          ['The writer says: "His bag has five pencils and an eraser in it."', "作者说：“His bag has five pencils and an eraser in it.”"],
        ],
        [
          ["Whose bag is green?", "绿色的包是谁的？"],
          ["Dad's", "爸爸的"],
          [
            ["Tom's", "汤姆的"],
            ["The writer's", "作者的"],
          ],
          ['The writer asks: "Who has the green bag?" and says: "Dad has it."', "作者问绿色的包在谁那里，然后说：“Dad has it.”"],
        ],
      ],
    }),
    numbers({
      id: "pre-a1-numbers-twelve-children",
      title: ["Twelve Children", "十二个孩子"],
      body: `Here is my classroom. There are twelve children in it: seven girls and five boys.

The girls have pink, purple and yellow bags. The boys have black, brown and blue bags. My bag is purple. I'm a girl.

Our teacher is a woman. Her name is Lin Fang. Her bag is green. She is not old, and she is not a girl.

How many people are in my classroom? Twelve children and one teacher!`,
      grammar: ["plural-nouns-with-s"],
      names: ["Lin", "Fang"],
      questions: [
        [
          ["How many boys are in the classroom?", "教室里有几个男孩？"],
          ["Five", "五个"],
          [
            ["Seven", "七个"],
            ["Twelve", "十二个"],
          ],
          ['The writer says: "seven girls and five boys."', "作者说：“seven girls and five boys.”"],
        ],
        [
          ["What color is the teacher's bag?", "老师的包是什么颜色的？"],
          ["Green", "绿色"],
          [
            ["Purple", "紫色"],
            ["Black", "黑色"],
          ],
          ['The writer says about the teacher: "Her bag is green."', "作者说到老师：“Her bag is green.”"],
        ],
        [
          ["How many people are in the classroom?", "教室里一共有几个人？"],
          ["Thirteen: twelve children and a teacher", "十三个：十二个孩子和一位老师"],
          [
            ["Twelve: seven girls and five boys", "十二个：七个女孩和五个男孩"],
            ["Seven", "七个"],
          ],
          [
            'The last line says: "Twelve children and one teacher!" Twelve and one is thirteen.',
            "最后一句说有十二个孩子和一位老师，加起来是十三个人。",
          ],
        ],
      ],
    }),
    numbers({
      id: "pre-a1-numbers-what-color-is-it",
      title: ["What Color Is It?", "它是什么颜色的？"],
      body: `What is it? It is orange, but it isn't a color. You can eat it. It's an orange!

What is it? It is long, and it is yellow and black. I write with it. It's a pencil.

What is it? It is white. I read it, and I draw in it. It's a book.

What is it? It is red and blue, and my books and pens are in it. It's my bag!`,
      grammar: ["a-and-an"],
      questions: [
        [
          ["What is yellow and black?", "什么东西是黄黑相间的？"],
          ["A pencil", "一支铅笔"],
          [
            ["A book", "一本书"],
            ["A bag", "一个包"],
          ],
          [
            'The second riddle says: "It is long, and it is yellow and black. I write with it. It\'s a pencil."',
            "第二个谜语说它又长又是黄黑色，用来写字，是铅笔。",
          ],
        ],
        [
          ["What can you eat?", "什么东西可以吃？"],
          ["The orange", "橙子"],
          [
            ["The pencil", "铅笔"],
            ["The book", "书"],
          ],
          ['The first riddle says: "You can eat it. It\'s an orange!"', "第一个谜语说：“You can eat it. It's an orange!”"],
        ],
        [
          ["What color is the bag?", "包是什么颜色的？"],
          ["Red and blue", "红色和蓝色"],
          [
            ["White", "白色"],
            ["Yellow and black", "黄色和黑色"],
          ],
          ['The last riddle says: "It is red and blue... It\'s my bag!"', "最后一个谜语说它是红蓝色的，是“我”的包。"],
        ],
      ],
    }),
  ],
};

const family = passageMaker(vocabulary, [
  "pre-a1-words-family",
  "pre-a1-words-my-and-your",
  "pre-a1-words-people",
  "he-she-and-it",
  "my-your-his-her",
  "have-and-has",
]);

/** readingMyFamily is the reading unit of the theme My Family: who is in a family, their names and ages. */
const readingMyFamily: ReadingUnitDef = {
  id: "pre-a1-reading-my-family",
  title: t("My Family", "我的家庭"),
  passages: [
    family({
      id: "pre-a1-family-who-is-in-my-family",
      title: ["Who Is in My Family?", "我家有谁？"],
      body: `Hi! I'm Lucy, and I'm nine years old. Who is in my family?

My mother is Anna, and my father is Mark. I have a brother. His name is Tom, and he is six. I have a sister too. Her name is Rose, and she is twelve. She is the oldest child.

My grandma and grandpa are in my family too. We are seven people, and I love them!`,
      grammar: ["my-your-his-her", "have-and-has"],
      names: ["Lucy", "Anna", "Mark", "Tom", "Rose"],
      questions: [
        [
          ["How many people are in Lucy's family?", "露西家有几口人？"],
          ["Seven", "七口"],
          [
            ["Five", "五口"],
            ["Six", "六口"],
          ],
          [
            'Lucy says: "We are seven people." They are Lucy, her mother, father, brother, sister, grandma and grandpa.',
            "Lucy 说：“We are seven people.” 包括她、爸爸妈妈、弟弟、姐姐、奶奶和爷爷。",
          ],
        ],
        [
          ["Who is the oldest child?", "哪个孩子年纪最大？"],
          ["Rose", "罗丝（Rose）"],
          [
            ["Lucy", "露西（Lucy）"],
            ["Tom", "汤姆（Tom）"],
          ],
          ['Lucy says about Rose: "She is the oldest child."', "Lucy 说到 Rose：“She is the oldest child.”"],
        ],
        [
          ["Who is Mark?", "马克是谁？"],
          ["Lucy's father", "露西的爸爸"],
          [
            ["Lucy's brother", "露西的弟弟"],
            ["Lucy's grandpa", "露西的爷爷"],
          ],
          ['Lucy says: "My father is Mark."', "Lucy 说：“My father is Mark.”"],
        ],
      ],
    }),
    family({
      id: "pre-a1-family-baby-max",
      title: ["A Baby Brother", "小弟弟"],
      body: `We have a baby in our family! He's a boy, and his name is Max. Max is my brother.

Max is very small. He has small hands and small feet. He has no hair!

My sister Ella loves Max. Ella is ten, and I'm eight. Grandma and Grandpa love Max too.

Dad: Who has the baby?

Mom: Ella has him.

Ella: Here he is. He's with me!`,
      grammar: ["he-she-and-it", "have-and-has"],
      names: ["Max", "Ella"],
      questions: [
        [
          ["Who is Max?", "马克斯是谁？"],
          ["The writer's baby brother", "作者的小弟弟"],
          [
            ["The writer's father", "作者的爸爸"],
            ["Ella's friend", "埃拉的朋友"],
          ],
          ['The writer says: "His name is Max. Max is my brother."', "作者说：“His name is Max. Max is my brother.”"],
        ],
        [
          ["What does Max not have?", "马克斯没有什么？"],
          ["Hair", "头发"],
          [
            ["Hands", "手"],
            ["Feet", "脚"],
          ],
          ['The second paragraph says: "He has no hair!"', "第二段说：“He has no hair!”"],
        ],
        [
          ["Who has the baby at the end?", "最后宝宝在谁那里？"],
          ["Ella", "埃拉"],
          [
            ["Mom", "妈妈"],
            ["Grandpa", "爷爷"],
          ],
          ['Mom says: "Ella has him." Ella says: "He\'s with me!"', "妈妈说：“Ella has him.” Ella 说：“He's with me!”"],
        ],
      ],
    }),
    family({
      id: "pre-a1-family-grandma-and-grandpa",
      title: ["Grandma and Grandpa Are Here", "爷爷奶奶来了"],
      body: `Grandma and Grandpa are here with us! They are the mother and father of my dad.

Grandma has a big bag. What is in it? Oranges! She has ten oranges. Grandpa has a book and a pen. My sister has the book, and I have the pen.

"Thank you, Grandma! Thank you, Grandpa!"

We sit with Grandpa, and he reads the book with us. We love them!`,
      grammar: ["have-and-has", "my-your-his-her"],
      questions: [
        [
          ["Who are Grandma and Grandpa?", "爷爷奶奶是谁的父母？"],
          ["The mother and father of the writer's dad", "作者爸爸的父母"],
          [
            ["The mother and father of the writer's mom", "作者妈妈的父母"],
            ["Friends of the family", "家里的朋友"],
          ],
          ['The writer says: "They are the mother and father of my dad."', "作者说：“They are the mother and father of my dad.”"],
        ],
        [
          ["What is in Grandma's bag?", "奶奶的包里有什么？"],
          ["Ten oranges", "十个橙子"],
          [
            ["A book and a pen", "一本书和一支笔"],
            ["Twelve oranges", "十二个橙子"],
          ],
          ['The writer says: "She has ten oranges."', "作者说：“She has ten oranges.”"],
        ],
        [
          ["What does Grandpa do with the children?", "爷爷和孩子们一起做什么？"],
          ["He reads the book with them", "他和他们一起读书"],
          [
            ["He draws with them", "他和他们一起画画"],
            ["He writes with the pen", "他用笔写字"],
          ],
          ['The last paragraph says: "he reads the book with us."', "最后一段说：“he reads the book with us.”"],
        ],
      ],
    }),
    family({
      id: "pre-a1-family-who-is-that-man",
      title: ["Who Is That Man?", "那个男人是谁？"],
      body: `Kate: Who is that man?

Ben: He's my dad.

Kate: And who is that woman with him? Is she your mom?

Ben: No, she isn't. She's his sister. Her name is Jane.

Kate: Who are those children with Jane?

Ben: They are her children. The boy is Paul, and the girls are Amy and Sue.

Kate: How old are they?

Ben: Paul is seven. Amy and Sue are five. They are sisters, and they are very happy!`,
      grammar: ["he-she-and-it", "my-your-his-her"],
      names: ["Kate", "Ben", "Jane", "Paul", "Amy", "Sue"],
      questions: [
        [
          ["Who is the man?", "那个男人是谁？"],
          ["Ben's dad", "本的爸爸"],
          [
            ["Ben's grandpa", "本的爷爷"],
            ["Jane's dad", "简的爸爸"],
          ],
          ['Ben says: "He\'s my dad."', "Ben 说：“He's my dad.”"],
        ],
        [
          ["Who is Jane?", "简是谁？"],
          ["The sister of Ben's dad", "本爸爸的姐姐（妹妹）"],
          [
            ["Ben's mom", "本的妈妈"],
            ["Ben's sister", "本的姐姐（妹妹）"],
          ],
          ['Ben says: "No, she isn\'t. She\'s his sister." "His" means his dad\'s.', "Ben 说她不是他妈妈，是他爸爸的姐妹（his 指爸爸）。"],
        ],
        [
          ["How many children does Jane have?", "简有几个孩子？"],
          ["Three", "三个"],
          [
            ["Two", "两个"],
            ["Five", "五个"],
          ],
          [
            'Ben says: "The boy is Paul, and the girls are Amy and Sue." That is three children.',
            "Ben 说男孩是 Paul，女孩是 Amy 和 Sue，一共三个孩子。",
          ],
        ],
      ],
    }),
    family({
      id: "pre-a1-family-two-sisters-and-a-brother",
      title: ["Two Sisters and a Brother", "两个姐妹和一个兄弟"],
      body: `I'm Paul, and I'm ten. I have two sisters and a brother.

My sisters are Ann and Bella. Ann is twelve. She has long black hair. Bella is eight. She has a cat, and she loves it.

My brother is Leo. He is four. He is very small. He is the baby of our family. He has a red pencil, and he draws with it.

My sisters and my brother are my friends. We are four children in a happy family.`,
      grammar: ["have-and-has", "he-she-and-it"],
      names: ["Paul", "Ann", "Bella", "Leo"],
      questions: [
        [
          ["How many children are in Paul's family?", "保罗家有几个孩子？"],
          ["Four", "四个"],
          [
            ["Three", "三个"],
            ["Two", "两个"],
          ],
          ['Paul says: "We are four children."', "Paul 说：“We are four children.”"],
        ],
        [
          ["Who has a cat?", "谁有一只猫？"],
          ["Bella", "贝拉（Bella）"],
          [
            ["Ann", "安（Ann）"],
            ["Leo", "利奥（Leo）"],
          ],
          ['Paul says about Bella: "She has a cat, and she loves it."', "Paul 说到 Bella：“She has a cat, and she loves it.”"],
        ],
        [
          ["How old is Leo?", "利奥几岁？"],
          ["Four", "四岁"],
          [
            ["Eight", "八岁"],
            ["Ten", "十岁"],
          ],
          ['Paul says: "My brother is Leo. He is four."', "Paul 说：“My brother is Leo. He is four.”"],
        ],
      ],
    }),
    family({
      id: "pre-a1-family-i-love-my-family",
      title: ["I Love My Family", "我爱我的家人"],
      body: `I love my family. My mom is a teacher. She reads with me. My dad is a big man, and he has a big dog.

My grandma has a small dog, and my grandpa has two cats. I sit with them, and we look at the cats.

My brother and I are friends. He is twelve, and I am nine. He draws, and I write. We love our mom and dad, and they love us.`,
      grammar: ["my-your-his-her", "have-and-has"],
      questions: [
        [
          ["What is the writer's mom?", "作者的妈妈是做什么的？"],
          ["A teacher", "老师"],
          [
            ["A grandma", "奶奶"],
            ["A doctor", "医生"],
          ],
          ['The writer says: "My mom is a teacher."', "作者说：“My mom is a teacher.”"],
        ],
        [
          ["Who has two cats?", "谁有两只猫？"],
          ["Grandpa", "爷爷"],
          [
            ["Dad", "爸爸"],
            ["Grandma", "奶奶"],
          ],
          ['The writer says: "my grandpa has two cats."', "作者说：“my grandpa has two cats.”"],
        ],
        [
          ["How old is the writer's brother?", "作者的哥哥几岁？"],
          ["Twelve", "十二岁"],
          [
            ["Nine", "九岁"],
            ["Ten", "十岁"],
          ],
          ['The writer says: "He is twelve, and I am nine."', "作者说：“He is twelve, and I am nine.”"],
        ],
      ],
    }),
  ],
};

const classroom = passageMaker(vocabulary, [
  "pre-a1-words-classroom",
  "pre-a1-words-this-and-that",
  "pre-a1-words-classroom-actions",
  "this-that-these-those",
  "in-on-and-under",
  "imperatives",
]);

/** readingClassroom is the reading unit of the theme My Classroom: things at school, where they are, and commands. */
const readingClassroom: ReadingUnitDef = {
  id: "pre-a1-reading-classroom",
  title: t("My Classroom", "我的教室"),
  passages: [
    classroom({
      id: "pre-a1-classroom-what-is-in-my-bag",
      title: ["What Is in My Bag?", "我的包里有什么？"],
      body: `What is in my bag? Look! Here is my book. It's blue. Here are two pencils and a pen. The pencils are yellow, and the pen is black.

This is my ruler. It is long and green. And this is my eraser. It's small and pink.

Is my bag big? No, it isn't. It's a small red bag, but my books and pencils are in it. I love my bag!`,
      grammar: ["this-that-these-those", "in-on-and-under"],
      questions: [
        [
          ["What color is the book?", "书是什么颜色的？"],
          ["Blue", "蓝色"],
          [
            ["Black", "黑色"],
            ["Green", "绿色"],
          ],
          ['The writer says: "Here is my book. It\'s blue."', "作者说：“Here is my book. It's blue.”"],
        ],
        [
          ["What is long and green?", "什么东西又长又是绿色的？"],
          ["The ruler", "尺子"],
          [
            ["The eraser", "橡皮"],
            ["The pen", "钢笔"],
          ],
          ['The writer says: "This is my ruler. It is long and green."', "作者说：“This is my ruler. It is long and green.”"],
        ],
        [
          ["What is the bag like?", "这个包是什么样的？"],
          ["Small and red", "又小又是红色的"],
          [
            ["Big and red", "又大又是红色的"],
            ["Small and pink", "又小又是粉色的"],
          ],
          ['The writer says: "It\'s a small red bag."', "作者说：“It's a small red bag.”"],
        ],
      ],
    }),
    classroom({
      id: "pre-a1-classroom-our-classroom",
      title: ["Our Classroom", "我们的教室"],
      body: `This is our classroom. It is big and very happy!

There are ten desks and ten chairs. The desks are brown, and the chairs are blue. Our books are on the desks, and our bags are under the chairs.

The desk of the teacher is here. It is big, and her chair is black. Her books are on her desk. There is an orange on her desk too!

We read and write here. We draw here too. I love our classroom.`,
      grammar: ["in-on-and-under", "this-that-these-those"],
      questions: [
        [
          ["How many chairs are in the classroom for the children?", "教室里有几把给孩子们坐的椅子？"],
          ["Ten", "十把"],
          [
            ["Twelve", "十二把"],
            ["One", "一把"],
          ],
          ['The writer says: "There are ten desks and ten chairs."', "作者说：“There are ten desks and ten chairs.”"],
        ],
        [
          ["Where are the bags?", "包在哪里？"],
          ["Under the chairs", "在椅子下面"],
          [
            ["On the desks", "在课桌上"],
            ["On the teacher's desk", "在老师的桌子上"],
          ],
          ['The writer says: "our bags are under the chairs."', "作者说：“our bags are under the chairs.”"],
        ],
        [
          ["What is on the teacher's desk?", "老师的桌子上有什么？"],
          ["Her books and an orange", "她的书和一个橙子"],
          [
            ["The children's bags", "孩子们的包"],
            ["A black chair", "一把黑色的椅子"],
          ],
          ['The writer says: "Her books are on her desk. There is an orange on her desk too!"', "作者说她的书在桌上，桌上还有一个橙子。"],
        ],
      ],
    }),
    classroom({
      id: "pre-a1-classroom-open-your-books",
      title: ["Open Your Books", "打开你们的书"],
      body: `Teacher: Hello, children! Please sit. Open your books.

Ben: Sorry! My book isn't here.

Teacher: Look under your chair, Ben.

Ben: Yes! It's under my chair. Thank you!

Teacher: Look at the book and read it. Don't write in your book, please.

Amy: Can we draw?

Teacher: Yes, you can. Draw a cat, but don't draw in your book! Close your books, please.`,
      grammar: ["imperatives", "in-on-and-under"],
      names: ["Ben", "Amy"],
      questions: [
        [
          ["Where is Ben's book?", "本的书在哪里？"],
          ["Under his chair", "在他的椅子下面"],
          [
            ["In his bag", "在他的包里"],
            ["On the teacher's desk", "在老师的桌子上"],
          ],
          ['Ben says: "It\'s under my chair."', "Ben 说：“It's under my chair.”"],
        ],
        [
          ["What must the children not do?", "孩子们不可以做什么？"],
          ["Write in their books", "在书上写字"],
          [
            ["Read the book", "读书"],
            ["Draw a cat", "画一只猫"],
          ],
          ['The teacher says: "Don\'t write in your book, please."', "老师说：“Don't write in your book, please.”"],
        ],
        [
          ["What do the children draw?", "孩子们画什么？"],
          ["A cat", "一只猫"],
          [
            ["A book", "一本书"],
            ["A chair", "一把椅子"],
          ],
          ['The teacher says: "Yes, you can. Draw a cat."', "老师说：“Yes, you can. Draw a cat.”"],
        ],
      ],
    }),
    classroom({
      id: "pre-a1-classroom-where-is-my-pen",
      title: ["Where Is My Pen?", "我的钢笔在哪里？"],
      body: `Tom: Where is my pen? It isn't in my bag.

Lily: Is it on your desk?

Tom: No, it isn't. My books are on my desk, but my pen isn't there.

Lily: Look under your desk.

Tom: No, there is a pencil under my desk, but it isn't my pencil. Where's my pen?

Lily: Is it a red pen?

Tom: Yes, it is.

Lily: Look! It's in your hand!`,
      grammar: ["in-on-and-under"],
      names: ["Tom", "Lily"],
      questions: [
        [
          ["What is Tom looking for?", "汤姆在找什么？"],
          ["His pen", "他的钢笔"],
          [
            ["His pencil", "他的铅笔"],
            ["His book", "他的书"],
          ],
          ['Tom asks: "Where is my pen?"', "Tom 问：“Where is my pen?”"],
        ],
        [
          ["What is under Tom's desk?", "汤姆的课桌下面有什么？"],
          ["A pencil of another child", "别人的一支铅笔"],
          [
            ["His red pen", "他的红色钢笔"],
            ["His books", "他的书"],
          ],
          ['Tom says: "there is a pencil under my desk, but it isn\'t my pencil."', "Tom 说桌子下有一支铅笔，但不是他的。"],
        ],
        [
          ["Where is the pen at the end?", "最后发现钢笔在哪里？"],
          ["In Tom's hand", "在汤姆的手里"],
          [
            ["On Tom's desk", "在汤姆的课桌上"],
            ["In Lily's bag", "在莉莉的包里"],
          ],
          ['Lily says: "Look! It\'s in your hand!"', "Lily 说：“Look! It's in your hand!”"],
        ],
      ],
    }),
    classroom({
      id: "pre-a1-classroom-these-and-those-books",
      title: ["These Books and Those Books", "这些书和那些书"],
      body: `Teacher: Anna, look at these books here. They are red. What are they?

Anna: They are English books.

Teacher: Yes. And look at those books there, on the chair. What color are they?

Anna: Those books are green.

Teacher: Yes. Those are Chinese books. Open a red book, please, and read.

Anna: This red book here?

Teacher: Yes, that book. Don't open the green books. Thank you, Anna!`,
      grammar: ["this-that-these-those", "imperatives"],
      names: ["Anna", "English", "Chinese"],
      questions: [
        [
          ["What color are the English books?", "英语书是什么颜色的？"],
          ["Red", "红色"],
          [
            ["Green", "绿色"],
            ["Blue", "蓝色"],
          ],
          [
            'The teacher says: "look at these books here. They are red." Anna says: "They are English books."',
            "老师说这些书是红色的，Anna 说它们是英语书。",
          ],
        ],
        [
          ["Where are the green books?", "绿色的书在哪里？"],
          ["On the chair, there", "在那边的椅子上"],
          [
            ["Here, near the teacher", "在这里，在老师旁边"],
            ["Under the desk", "在课桌下面"],
          ],
          ['The teacher says: "look at those books there, on the chair."', "老师说：“look at those books there, on the chair.”"],
        ],
        [
          ["Which book does the teacher ask Anna to open?", "老师让安娜打开哪本书？"],
          ["A red English book", "一本红色的英语书"],
          [
            ["A green Chinese book", "一本绿色的语文书"],
            ["All the books", "所有的书"],
          ],
          [
            'The teacher says: "open a red book, please, and read," and "Don\'t open the green books."',
            "老师让她打开一本红色的书读，不要打开绿色的书。",
          ],
        ],
      ],
    }),
    classroom({
      id: "pre-a1-classroom-my-school",
      title: ["My School", "我的学校"],
      body: `Hello! I'm Mei, and I'm eight years old. This is my school. It is very big!

There are twelve classrooms in my school. My classroom is here. Look in! There are twelve children and one teacher in it.

My teacher is Mr Wang. He is a good teacher. He reads with us, and we draw and write with him.

My friend Lucy is in my classroom too. She sits with me. We open our books, and we read. I love my school!`,
      grammar: ["in-on-and-under", "this-that-these-those"],
      names: ["Mei", "Mr", "Wang", "Lucy"],
      questions: [
        [
          ["How many classrooms are in Mei's school?", "美的学校有几间教室？"],
          ["Twelve", "十二间"],
          [
            ["Eight", "八间"],
            ["One", "一间"],
          ],
          ['Mei says: "There are twelve classrooms in my school."', "Mei 说：“There are twelve classrooms in my school.”"],
        ],
        [
          ["Who is Mr Wang?", "王老师是谁？"],
          ["Mei's teacher", "美的老师"],
          [
            ["Mei's father", "美的爸爸"],
            ["Lucy's brother", "露西的哥哥"],
          ],
          ['Mei says: "My teacher is Mr Wang."', "Mei 说：“My teacher is Mr Wang.”"],
        ],
        [
          ["Who sits with Mei?", "谁和美坐在一起？"],
          ["Her friend Lucy", "她的朋友露西"],
          [
            ["Mr Wang", "王老师"],
            ["Her sister", "她的姐姐"],
          ],
          ['Mei says: "My friend Lucy is in my classroom too. She sits with me."', "Mei 说：“My friend Lucy ... She sits with me.”"],
        ],
      ],
    }),
  ],
};

const animals = passageMaker(vocabulary, [
  "pre-a1-words-animals",
  "pre-a1-words-can-and-like",
  "pre-a1-words-little-words",
  "can-for-ability",
  "questions-with-be",
]);

/** readingAnimals is the reading unit of the theme Animals: what animals are like and what they can do. */
const readingAnimals: ReadingUnitDef = {
  id: "pre-a1-reading-animals",
  title: t("Animals", "动物"),
  passages: [
    animals({
      id: "pre-a1-animals-grandpas-animals",
      title: ["Grandpa's Animals", "爷爷的动物"],
      body: `My grandpa has many animals. He has two horses, three cows and four pigs. The horses are brown, the cows are black and white, and the pigs are pink.

Grandpa has ducks too. They are white, and they can swim. How many ducks? I see eleven!

His dog is Rex. Rex is big and black. He can run, and he can swim too. He likes Grandpa, and Grandpa likes him.

I love Grandpa and his animals.`,
      grammar: ["plural-nouns-with-s", "can-for-ability"],
      names: ["Rex"],
      questions: [
        [
          ["How many cows does Grandpa have?", "爷爷有几头奶牛？"],
          ["Three", "三头"],
          [
            ["Two", "两头"],
            ["Four", "四头"],
          ],
          ['The writer says: "He has two horses, three cows and four pigs."', "作者说：“He has two horses, three cows and four pigs.”"],
        ],
        [
          ["What color are the pigs?", "猪是什么颜色的？"],
          ["Pink", "粉色"],
          [
            ["Brown", "棕色"],
            ["Black and white", "黑白色"],
          ],
          ['The writer says: "the pigs are pink."', "作者说：“the pigs are pink.”"],
        ],
        [
          ["Who is Rex?", "雷克斯是谁？"],
          ["Grandpa's dog", "爷爷的狗"],
          [
            ["Grandpa's horse", "爷爷的马"],
            ["The writer's brother", "作者的弟弟"],
          ],
          ['The writer says: "His dog is Rex."', "作者说：“His dog is Rex.”"],
        ],
      ],
    }),
    animals({
      id: "pre-a1-animals-a-cat-and-a-mouse",
      title: ["A Cat and a Mouse", "一只猫和一只老鼠"],
      body: `Here is a big gray cat. Her name is Kitty. Kitty likes mice. She can run and jump.

Look! There is a small brown mouse under the chair. Kitty sees the mouse. The mouse sees Kitty too!

Kitty runs to the chair, but the mouse runs to a bag. Kitty looks in the bag. The mouse isn't in it! Where is it? It is on the desk, with the books.

Kitty is sad. The mouse is happy!`,
      grammar: ["can-for-ability", "in-on-and-under"],
      names: ["Kitty"],
      questions: [
        [
          ["Where is the mouse at first?", "老鼠一开始在哪里？"],
          ["Under the chair", "在椅子下面"],
          [
            ["On the chair", "在椅子上"],
            ["In a bag", "在包里"],
          ],
          ['The passage says: "There is a small brown mouse under the chair."', "文中说：“There is a small brown mouse under the chair.”"],
        ],
        [
          ["Where is the mouse at the end?", "最后老鼠在哪里？"],
          ["On the desk, with the books", "在桌子上，和书在一起"],
          [
            ["In the bag", "在包里"],
            ["Under the chair", "在椅子下面"],
          ],
          [
            'Kitty looks in the bag, but "The mouse isn\'t in it!" It is "on the desk, with the books."',
            "基蒂往包里看，老鼠不在里面，它在桌子上，和书在一起。",
          ],
        ],
        [
          ["How is the mouse at the end?", "最后老鼠的心情怎样？"],
          ["Happy", "高兴"],
          [
            ["Sad", "难过"],
            ["Bad", "很糟"],
          ],
          ['The last line says: "Kitty is sad. The mouse is happy!"', "最后一句说：“Kitty is sad. The mouse is happy!”"],
        ],
      ],
    }),
    animals({
      id: "pre-a1-animals-can-a-fish-fly",
      title: ["Can a Fish Fly?", "鱼会飞吗？"],
      body: `Can a fish fly? No, it can't. A fish can swim, but it can't walk or fly.

Can a bird fly? Yes, it can. Many birds can fly, and they can walk too. Can a bird swim? A duck is a bird, and it can swim!

Can a horse fly? No! A horse can't fly, but it can run and jump.

Can a frog jump? Yes, it can. A frog can jump, and it can swim too. Is a frog a fish? No, it isn't.`,
      grammar: ["can-for-ability", "questions-with-be"],
      questions: [
        [
          ["What can a fish do?", "鱼会做什么？"],
          ["Swim", "游泳"],
          [
            ["Fly", "飞"],
            ["Walk", "走路"],
          ],
          ['The passage says: "A fish can swim, but it can\'t walk or fly."', "文中说：“A fish can swim, but it can't walk or fly.”"],
        ],
        [
          ["Which bird can swim?", "哪种鸟会游泳？"],
          ["A duck", "鸭子"],
          [
            ["Every bird", "所有的鸟"],
            ["No bird", "没有鸟会游泳"],
          ],
          ['The passage says: "A duck is a bird, and it can swim!"', "文中说：“A duck is a bird, and it can swim!”"],
        ],
        [
          ["What can a frog do?", "青蛙会做什么？"],
          ["Jump and swim", "跳和游泳"],
          [
            ["Fly and swim", "飞和游泳"],
            ["Only jump", "只会跳"],
          ],
          ['The passage says: "A frog can jump, and it can swim too."', "文中说：“A frog can jump, and it can swim too.”"],
        ],
      ],
    }),
    animals({
      id: "pre-a1-animals-a-big-dog-and-a-small-dog",
      title: ["A Big Dog and a Small Dog", "一只大狗和一只小狗"],
      body: `We have two dogs. Their names are Bear and Pip.

Bear is a very big dog. He is black, and he has long legs. He can run and swim, and he likes to eat!

Pip is a small dog. She is white and brown. She can't run with Bear, but she can jump. She likes to sit with me.

Bear is older. He is ten years old, and Pip is two. Bear is the bigger dog, but Pip is the happier dog!`,
      grammar: ["can-for-ability"],
      names: ["Bear", "Pip"],
      questions: [
        [
          ["How old is Bear?", "熊熊（Bear）几岁？"],
          ["Ten", "十岁"],
          [
            ["Two", "两岁"],
            ["Twelve", "十二岁"],
          ],
          ['The passage says: "He is ten years old, and Pip is two."', "文中说：“He is ten years old, and Pip is two.”"],
        ],
        [
          ["What can Pip do?", "皮普会做什么？"],
          ["Jump", "跳"],
          [
            ["Run with Bear", "和熊熊一起跑"],
            ["Swim with Bear", "和熊熊一起游泳"],
          ],
          ['The passage says: "She can\'t run with Bear, but she can jump."', "文中说：“She can't run with Bear, but she can jump.”"],
        ],
        [
          ["Which dog is happier?", "哪只狗更快乐？"],
          ["Pip", "皮普"],
          [
            ["Bear", "熊熊"],
            ["They are both sad", "它们都很难过"],
          ],
          ['The last line says: "Bear is the bigger dog, but Pip is the happier dog!"', "最后一句说熊熊更大，但皮普更快乐。"],
        ],
      ],
    }),
    animals({
      id: "pre-a1-animals-what-animals-do-you-like",
      title: ["What Animals Do You Like?", "你喜欢什么动物？"],
      body: `Teacher: What animals do you like, children?

Ann: I like cats. They are small, and they are very good animals.

Bob: I don't like cats. I like dogs! Dogs can run and swim.

Mia: I like birds. Birds can fly, and I can't fly!

Teacher: And you, Leo?

Leo: I like horses. A horse is very big, but it is good. I can sit on a horse!

Teacher: I like frogs. They are green, and they can jump.`,
      grammar: ["can-for-ability"],
      names: ["Ann", "Bob", "Mia", "Leo"],
      questions: [
        [
          ["Who doesn't like cats?", "谁不喜欢猫？"],
          ["Bob", "鲍勃（Bob）"],
          [
            ["Ann", "安（Ann）"],
            ["Mia", "米娅（Mia）"],
          ],
          ['Bob says: "I don\'t like cats. I like dogs!"', "Bob 说：“I don't like cats. I like dogs!”"],
        ],
        [
          ["Why does Mia like birds?", "米娅为什么喜欢鸟？"],
          ["They can fly", "它们会飞"],
          [
            ["They are small", "它们很小"],
            ["They can swim", "它们会游泳"],
          ],
          ['Mia says: "Birds can fly, and I can\'t fly!"', "Mia 说：“Birds can fly, and I can't fly!”"],
        ],
        [
          ["Which animal does the teacher like?", "老师喜欢哪种动物？"],
          ["Frogs", "青蛙"],
          [
            ["Horses", "马"],
            ["Dogs", "狗"],
          ],
          ['The teacher says: "I like frogs."', "老师说：“I like frogs.”"],
        ],
      ],
    }),
    animals({
      id: "pre-a1-animals-hop-the-frog",
      title: ["Hop the Frog", "青蛙跳跳"],
      body: `Look at this frog. It is small and green. His name is Hop. Hop can jump, and he can swim. Can he fly? No, he can't.

Hop sees a fly. A fly is a very small animal, and it can fly. Hop likes flies! He jumps, and he eats the fly.

A big bird sees Hop. The bird likes frogs! Hop jumps, and he swims. The bird can't see him.

Where is Hop? Look! He is with his frog friends. He is happy!`,
      grammar: ["can-for-ability", "questions-with-be"],
      names: ["Hop"],
      questions: [
        [
          ["What does Hop eat?", "跳跳吃了什么？"],
          ["A fly", "一只苍蝇"],
          [
            ["A fish", "一条鱼"],
            ["A bird", "一只鸟"],
          ],
          [
            'The passage says: "Hop likes flies! He jumps, and he eats the fly."',
            "文中说：“Hop likes flies! He jumps, and he eats the fly.”",
          ],
        ],
        [
          ["Who likes frogs?", "谁喜欢吃青蛙？"],
          ["The big bird", "那只大鸟"],
          [
            ["The fly", "那只苍蝇"],
            ["Hop", "跳跳"],
          ],
          ['The passage says: "A big bird sees Hop. The bird likes frogs!"', "文中说：“A big bird sees Hop. The bird likes frogs!”"],
        ],
        [
          ["Why is Hop happy at the end?", "为什么跳跳最后很高兴？"],
          ["The bird can't see him", "大鸟看不见他了"],
          [
            ["He can fly", "他会飞了"],
            ["The bird is his friend", "大鸟是他的朋友"],
          ],
          ['Hop swims, and "The bird can\'t see him." He is safe and happy.', "跳跳游走了，大鸟看不见他，所以他很安全，很高兴。"],
        ],
      ],
    }),
  ],
};

const body = passageMaker(vocabulary, ["pre-a1-words-body", "adjectives-before-nouns", "writing-about-yourself"]);

/** readingMyBody is the reading unit of the theme My Body: faces, hair and eyes, and what a body can do. */
const readingMyBody: ReadingUnitDef = {
  id: "pre-a1-reading-my-body",
  title: t("My Body", "我的身体"),
  passages: [
    body({
      id: "pre-a1-body-my-face",
      title: ["My Face", "我的脸"],
      body: `This is my face. I have two eyes, two ears, one nose and one mouth.

My eyes are brown, and my hair is black. My hair is long. My nose is small, and my mouth is big. I'm happy. Look at my happy face!

My sister has blue eyes and long yellow hair. She has a small mouth and a small nose. Her ears are small too. She is happy, and I am happy.`,
      grammar: ["adjectives-before-nouns"],
      questions: [
        [
          ["What color are the writer's eyes?", "作者的眼睛是什么颜色的？"],
          ["Brown", "棕色"],
          [
            ["Blue", "蓝色"],
            ["Black", "黑色"],
          ],
          ['The writer says: "My eyes are brown, and my hair is black."', "作者说：“My eyes are brown, and my hair is black.”"],
        ],
        [
          ["What is big on the writer's face?", "作者脸上什么是大的？"],
          ["The mouth", "嘴巴"],
          [
            ["The nose", "鼻子"],
            ["The ears", "耳朵"],
          ],
          ['The writer says: "My nose is small, and my mouth is big."', "作者说：“My nose is small, and my mouth is big.”"],
        ],
        [
          ["What hair does the sister have?", "姐姐（妹妹）的头发是什么样的？"],
          ["Long yellow hair", "长长的金黄色头发"],
          [
            ["Long black hair", "长长的黑头发"],
            ["Small brown hair", "棕色的短头发"],
          ],
          ['The writer says: "My sister has blue eyes and long yellow hair."', "作者说：“My sister has blue eyes and long yellow hair.”"],
        ],
      ],
    }),
    body({
      id: "pre-a1-body-a-monster-with-three-eyes",
      title: ["A Monster with Three Eyes", "三只眼睛的怪物"],
      body: `Look at my drawing! It is a monster. A monster isn't a man or a woman, and it isn't an animal. It is a monster!

My monster is green. It has one big head and three eyes. Its eyes are red. It has two mouths and no nose!

It has four arms and six legs. Its hair is long and purple.

Can it walk? Yes, it can. Can it fly? No, it can't. Is it a bad monster? No! It is a happy monster.`,
      grammar: ["adjectives-before-nouns"],
      glossed: ["monster"],
      questions: [
        [
          ["How many eyes does the monster have?", "怪物有几只眼睛？"],
          ["Three", "三只"],
          [
            ["Two", "两只"],
            ["Four", "四只"],
          ],
          ['The writer says: "It has one big head and three eyes."', "作者说：“It has one big head and three eyes.”"],
        ],
        [
          ["How many legs does it have?", "它有几条腿？"],
          ["Six", "六条"],
          [
            ["Four", "四条"],
            ["Two", "两条"],
          ],
          ['The writer says: "It has four arms and six legs." Four is the number of arms.', "作者说它有四只手臂、六条腿；四是手臂的数目。"],
        ],
        [
          ["What color is its hair?", "它的头发是什么颜色的？"],
          ["Purple", "紫色"],
          [
            ["Green", "绿色"],
            ["Red", "红色"],
          ],
          [
            'The writer says: "Its hair is long and purple." The monster is green, and its eyes are red.',
            "作者说它的头发又长又是紫色的；怪物本身是绿色，眼睛是红色。",
          ],
        ],
      ],
    }),
    body({
      id: "pre-a1-body-hands-and-feet",
      title: ["Hands and Feet", "手和脚"],
      body: `I have two hands and two feet.

With my hands, I write and I draw. I open and close my book with my hands.

With my feet, I walk, I run and I jump. I can stand on one foot!

A dog has four feet, but it has no hands. It can't write or draw. A bird has two feet, and it can fly. A fish has no hands and no feet, but it can swim.

What can you do with your hands and feet?`,
      grammar: ["can-for-ability"],
      questions: [
        [
          ["What does the writer do with the hands?", "作者用手做什么？"],
          ["Write and draw", "写字和画画"],
          [
            ["Walk and run", "走路和跑步"],
            ["Jump", "跳"],
          ],
          ['The writer says: "With my hands, I write and I draw."', "作者说：“With my hands, I write and I draw.”"],
        ],
        [
          ["How many feet does a dog have?", "狗有几只脚？"],
          ["Four", "四只"],
          [
            ["Two", "两只"],
            ["None", "没有"],
          ],
          ['The passage says: "A dog has four feet, but it has no hands."', "文中说：“A dog has four feet, but it has no hands.”"],
        ],
        [
          ["Which animal has no hands and no feet?", "哪种动物没有手也没有脚？"],
          ["A fish", "鱼"],
          [
            ["A bird", "鸟"],
            ["A dog", "狗"],
          ],
          [
            'The passage says: "A fish has no hands and no feet, but it can swim."',
            "文中说：“A fish has no hands and no feet, but it can swim.”",
          ],
        ],
      ],
    }),
    body({
      id: "pre-a1-body-long-hair-and-big-eyes",
      title: ["Long Hair and Big Eyes", "长头发和大眼睛"],
      body: `My friend Lily has long black hair and big brown eyes. She has a small nose and a big happy mouth.

Her brother Sam has red hair. His hair isn't long. He has small blue eyes and big ears. He is a small boy, and he is six.

Who am I? I have long yellow hair and big green eyes. I am a girl, and I'm a friend of Lily and Sam.`,
      grammar: ["adjectives-before-nouns", "have-and-has"],
      names: ["Lily", "Sam"],
      questions: [
        [
          ["What color are Lily's eyes?", "莉莉的眼睛是什么颜色的？"],
          ["Brown", "棕色"],
          [
            ["Blue", "蓝色"],
            ["Green", "绿色"],
          ],
          [
            'The passage says: "My friend Lily has long black hair and big brown eyes."',
            "文中说：“My friend Lily has long black hair and big brown eyes.”",
          ],
        ],
        [
          ["What is Sam's hair like?", "萨姆的头发是什么样的？"],
          ["Red, and not long", "红色的，不长"],
          [
            ["Long and black", "又长又黑"],
            ["Long and yellow", "又长又是金黄色"],
          ],
          [
            'The passage says: "Her brother Sam has red hair. His hair isn\'t long."',
            "文中说：“Her brother Sam has red hair. His hair isn't long.”",
          ],
        ],
        [
          ["Who is the writer?", "作者是谁？"],
          ["A girl with long yellow hair, a friend of Lily and Sam", "一个金黄色长发的女孩，莉莉和萨姆的朋友"],
          [
            ["Lily", "莉莉"],
            ["Sam's sister", "萨姆的姐姐"],
          ],
          [
            'The writer says: "I have long yellow hair and big green eyes. I am a girl, and I\'m a friend of Lily and Sam."',
            "作者说她有金黄色的长发和绿色的大眼睛，是莉莉和萨姆的朋友。",
          ],
        ],
      ],
    }),
    body({
      id: "pre-a1-body-what-can-your-body-do",
      title: ["What Can Your Body Do?", "你的身体能做什么？"],
      body: `What can your body do? Your eyes can see. Look with your eyes! Listen with your ears. Eat with your mouth.

Your legs can walk, run and jump. Your hands can draw and write. Your arms are long, and they can open a big book.

Can your nose see? No, it can't! Can your ears eat? No, they can't!

Stand, please. Open your mouth. Close your eyes. Jump on one foot. Are you happy? Good!`,
      grammar: ["imperatives", "can-for-ability"],
      questions: [
        [
          ["What do you look with?", "我们用什么看？"],
          ["Your eyes", "眼睛"],
          [
            ["Your ears", "耳朵"],
            ["Your nose", "鼻子"],
          ],
          ['The passage says: "Your eyes can see. Look with your eyes!"', "文中说：“Your eyes can see. Look with your eyes!”"],
        ],
        [
          ["What can your legs do?", "腿能做什么？"],
          ["Walk, run and jump", "走、跑和跳"],
          [
            ["Draw and write", "画画和写字"],
            ["See and listen", "看和听"],
          ],
          ['The passage says: "Your legs can walk, run and jump."', "文中说：“Your legs can walk, run and jump.”"],
        ],
        [
          ["What does the passage ask you to do on one foot?", "文章让你用一只脚做什么？"],
          ["Jump", "跳"],
          [
            ["Stand and read", "站着读书"],
            ["Walk", "走路"],
          ],
          ['The passage says: "Jump on one foot."', "文中说：“Jump on one foot.”"],
        ],
      ],
    }),
    body({
      id: "pre-a1-body-a-happy-face-and-a-sad-face",
      title: ["A Happy Face and a Sad Face", "开心的脸和难过的脸"],
      body: `Look at these two faces. This face is happy. Its mouth is open, and its eyes are big. That face is sad. Its mouth is closed, and its eyes are small.

Ben has a sad face. Where is his dog, Spot? Spot isn't in the classroom. He isn't under the desk, and he isn't on the chair.

Ben's sister Amy looks in his bag. Look! A small white dog is in the bag. It's Spot! Ben has a happy face.`,
      grammar: ["adjectives-before-nouns", "in-on-and-under"],
      names: ["Ben", "Spot", "Ben's", "Amy"],
      questions: [
        [
          ["What is the happy face like?", "开心的脸是什么样的？"],
          ["Its mouth is open, and its eyes are big", "嘴巴张开，眼睛很大"],
          [
            ["Its mouth is closed, and its eyes are small", "嘴巴闭着，眼睛很小"],
            ["Its mouth is closed, and its eyes are big", "嘴巴闭着，眼睛很大"],
          ],
          [
            'The passage says: "This face is happy. Its mouth is open, and its eyes are big."',
            "文中说：“This face is happy. Its mouth is open, and its eyes are big.”",
          ],
        ],
        [
          ["Why is Ben sad?", "本为什么难过？"],
          ["He can't see his dog", "他找不到他的狗"],
          [
            ["His sister is not there", "他的妹妹不在"],
            ["His bag is not there", "他的包不见了"],
          ],
          [
            'The passage asks: "Where is his dog, Spot?" and says that Spot is not in the classroom.',
            "文中问：“Where is his dog, Spot?” 并说 Spot 不在教室里。",
          ],
        ],
        [
          ["Where is Spot?", "斑点（Spot）在哪里？"],
          ["In Ben's bag", "在本的包里"],
          [
            ["Under the desk", "在桌子下面"],
            ["On the chair", "在椅子上"],
          ],
          ['The passage says: "A small white dog is in the bag. It\'s Spot!"', "文中说：“A small white dog is in the bag. It's Spot!”"],
        ],
      ],
    }),
  ],
};

/** reading are the reading units of Pre-A1. */
export const reading: readonly ReadingUnitDef[] = [
  readingHello,
  readingNumbersAndColors,
  readingMyFamily,
  readingClassroom,
  readingAnimals,
  readingMyBody,
];
