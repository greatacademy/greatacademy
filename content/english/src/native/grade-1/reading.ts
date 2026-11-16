// Grade 1: the reading units of the course, one for each theme: short stories and short texts of facts in words a first
// grader can sound out or knows by sight, three questions each.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage, words } from "../grade-3/reading-kit.ts";

const who = words("who-and-where-in-a-story", 0.3);
const order = words("what-happens-first-next-and-last", 0.3);
const facts = words("finding-facts-in-a-text", 0.3);

/** allAboutMe is the reading unit of grade 1 on children, their families and what they can do. */
export const allAboutMe: ReadingUnitDef = {
  id: "all-about-me",
  title: t("All About Me", "关于我"),
  passages: [
    passage(
      "my-name-is-pam",
      t("My Name Is Pam", "我叫帕姆"),
      `Hi! My name is Pam, and I am six. I have red hair and a big smile. I live in a little house on a hill.

I like to run and jump in the grass. I like to sing songs with my dad. When it rains, I read a book in my bed.

My best pal is a dog named Rex. Rex has black spots and a long tail. He sleeps on a rug next to my bed. When I get up, he licks my hand.`,
      [who],
      [
        ask(
          ["How old is Pam?", "帕姆几岁了？"],
          ["Six", "六岁"],
          [
            ["Ten", "十岁"],
            ["Two", "两岁"],
            ["Eight", "八岁"],
          ],
          ['Pam says, "My name is Pam, and I am six."', "帕姆说：“我叫帕姆，我六岁了。”"],
        ),
        ask(
          ["What does Pam do when it rains?", "下雨时帕姆做什么？"],
          ["She reads a book in bed", "她在床上看书"],
          [
            ["She runs in the grass", "她在草地上跑"],
            ["She sings with her dad", "她和爸爸唱歌"],
            ["She jumps in the mud", "她在泥里跳"],
          ],
          ["The story says that when it rains, Pam reads a book in her bed.", "故事说，下雨时帕姆在床上看书。"],
        ),
        ask(
          ["Who is Rex?", "雷克斯是谁？"],
          ["Pam's dog", "帕姆的狗"],
          [
            ["Pam's dad", "帕姆的爸爸"],
            ["Pam's cat", "帕姆的猫"],
            ["A boy at school", "学校里的一个男孩"],
          ],
          ["Pam says her best pal is a dog named Rex.", "帕姆说她最好的朋友是一只叫雷克斯的狗。"],
        ),
      ],
      ["Pam", "Rex"],
    ),
    passage(
      "my-family",
      t("My Family", "我的家人"),
      `This is my family. There is my mom, my dad, my little sister and me. My gran lives with us too.

Mom is a vet. She helps sick cats and dogs get well. Dad is a cook. He makes the best soup in the town.

My sister is just two. She likes to stack blocks and then knock them down. Gran tells us stories at night. We all sit on the rug and listen.

We are not all the same, but we all love each other a lot.`,
      [who, facts],
      [
        ask(
          ["What does Mom do?", "妈妈是做什么的？"],
          ["She is a vet who helps sick pets", "她是兽医，帮助生病的宠物"],
          [
            ["She is a cook", "她是厨师"],
            ["She drives a bus", "她开公共汽车"],
            ["She tells stories at school", "她在学校讲故事"],
          ],
          ["The text says Mom is a vet who helps sick cats and dogs get well.", "短文说妈妈是兽医，帮助生病的猫和狗恢复健康。"],
        ),
        ask(
          ["What does the little sister like to do?", "妹妹喜欢做什么？"],
          ["Stack blocks and knock them down", "搭积木再把它们推倒"],
          [
            ["Make soup", "做汤"],
            ["Tell stories", "讲故事"],
            ["Help sick dogs", "帮助生病的狗"],
          ],
          ["The text says she likes to stack blocks and then knock them down.", "短文说她喜欢搭积木，然后把它们推倒。"],
        ),
        ask(
          ["When does Gran tell stories?", "奶奶什么时候讲故事？"],
          ["At night", "晚上"],
          [
            ["At lunch", "午饭时"],
            ["In the morning", "早上"],
            ["At school", "在学校"],
          ],
          ["The text says Gran tells stories at night, when they all sit on the rug.", "短文说奶奶晚上讲故事，那时大家都坐在地毯上。"],
        ),
      ],
    ),
    passage(
      "what-i-can-do",
      t("What I Can Do", "我会做的事"),
      `When I was a baby, I could not do much. I could not walk or talk. I just slept and drank milk.

Now I can do lots of things. I can get dressed on my own. I can brush my teeth and make my bed. I can ride a bike with no help.

I can read short books, and I can write my name. I can count to one hundred.

There are still things I want to learn. Next year, I want to swim across the big pool. What can you do?`,
      [order],
      [
        ask(
          ["What could the child do as a baby?", "这个孩子还是婴儿时会做什么？"],
          ["Sleep and drink milk", "睡觉和喝奶"],
          [
            ["Ride a bike", "骑自行车"],
            ["Write a name", "写名字"],
            ["Make the bed", "整理床铺"],
          ],
          ["The text says that as a baby, the child just slept and drank milk.", "短文说，这个孩子还是婴儿时只会睡觉和喝奶。"],
        ),
        ask(
          ["Which can the child do now?", "这个孩子现在会做哪件事？"],
          ["Ride a bike with no help", "不用帮忙就能骑自行车"],
          [
            ["Swim across the big pool", "游过大泳池"],
            ["Drive a car", "开车"],
            ["Fly a plane", "开飞机"],
          ],
          ['The text says, "I can ride a bike with no help."', "短文说：“我不用帮忙就能骑自行车。”"],
        ),
        ask(
          ["What does the child want to learn next year?", "这个孩子明年想学什么？"],
          ["To swim across the big pool", "游过大泳池"],
          [
            ["To brush teeth", "刷牙"],
            ["To walk", "走路"],
            ["To read short books", "读短书"],
          ],
          ['The last part says, "Next year, I want to swim across the big pool."', "最后一段说：“明年我想游过大泳池。”"],
        ),
      ],
    ),
  ],
};

/** petsAndAnimals is the reading unit of grade 1 on pets and on where animals live. */
export const petsAndAnimals: ReadingUnitDef = {
  id: "pets-and-animals",
  title: t("Pets and Animals", "宠物和动物"),
  passages: [
    passage(
      "a-pup-named-max",
      t("A Pup Named Max", "一只叫麦克斯的小狗"),
      `Ben got a pup for his birthday. The pup was small and brown, with big soft ears. Ben named him Max.

Max liked to run and dig. One day, he dug a big hole in the garden. Mom was not glad! Ben filled the hole with dirt.

Then Ben got a red ball. He threw it, and Max ran to get it. Max brought the ball back to Ben again and again. Max did not dig any more holes that day. He was too tired to dig.`,
      [who, order],
      [
        ask(
          ["Who got a pup?", "谁得到了一只小狗？"],
          ["Ben", "本"],
          [
            ["Mom", "妈妈"],
            ["Max", "麦克斯"],
            ["Ben's dad", "本的爸爸"],
          ],
          ["The story says Ben got a pup for his birthday.", "故事说本过生日时得到了一只小狗。"],
        ),
        ask(
          ["What did Max do in the garden?", "麦克斯在花园里做了什么？"],
          ["He dug a big hole", "他挖了一个大坑"],
          [
            ["He ate the plants", "他吃了植物"],
            ["He slept in the sun", "他在太阳下睡觉"],
            ["He found a ball", "他找到了一个球"],
          ],
          ["The story says that one day Max dug a big hole in the garden.", "故事说有一天麦克斯在花园里挖了一个大坑。"],
        ),
        ask(
          ["Why did Max stop digging?", "麦克斯为什么不再挖坑了？"],
          ["He was too tired from getting the ball", "他追球追得太累了"],
          [
            ["Mom took him away", "妈妈把他带走了"],
            ["It began to rain", "开始下雨了"],
            ["He did not like dirt", "他不喜欢泥土"],
          ],
          ["After running for the ball again and again, Max was too tired to dig.", "麦克斯一次又一次地跑去捡球之后，累得挖不动了。"],
        ),
      ],
      ["Ben", "Max"],
    ),
    passage(
      "animal-homes",
      t("Animal Homes", "动物的家"),
      `All animals need a home. A home keeps them safe and dry.

A bird makes a nest in a tree. It uses twigs, grass and mud. The nest holds its eggs.

A rabbit digs a hole in the ground. The hole keeps the rabbit safe from a fox.

Bees live in a hive. Lots of bees live in one hive, and they make honey there.

A fish lives in water. Some fish live in a pond, and some live in the sea. Where do you live?`,
      [facts],
      [
        ask(
          ["What does a bird use to make a nest?", "鸟用什么筑巢？"],
          ["Twigs, grass and mud", "树枝、草和泥"],
          [
            ["Rocks and sand", "石头和沙子"],
            ["Honey and wax", "蜂蜜和蜡"],
            ["Snow and ice", "雪和冰"],
          ],
          ["The text says a bird uses twigs, grass and mud.", "短文说鸟用树枝、草和泥筑巢。"],
        ),
        ask(
          ["Why does a rabbit dig a hole?", "兔子为什么挖洞？"],
          ["To stay safe from a fox", "为了躲开狐狸，保护自己"],
          [
            ["To find honey", "为了找蜂蜜"],
            ["To lay eggs in a tree", "为了在树上产蛋"],
            ["To swim in a pond", "为了在池塘里游泳"],
          ],
          ["The text says the hole keeps the rabbit safe from a fox.", "短文说洞能保护兔子不被狐狸抓到。"],
        ),
        ask(
          ["Where do bees live?", "蜜蜂住在哪里？"],
          ["In a hive", "在蜂巢里"],
          [
            ["In a nest of mud", "在泥做的巢里"],
            ["In a hole in the ground", "在地洞里"],
            ["In a pond", "在池塘里"],
          ],
          ["The text says bees live in a hive, where they make honey.", "短文说蜜蜂住在蜂巢里，在那里酿蜜。"],
        ),
      ],
    ),
    passage(
      "the-hen-and-her-chicks",
      t("The Hen and Her Chicks", "母鸡和她的小鸡"),
      `A red hen sat on her eggs in the barn. She sat and sat for days. She kept the eggs warm.

Then one morning, she felt a tap, tap, tap. A crack came in one egg. Then a little chick came out! It was wet and yellow. Soon the other eggs cracked too.

Now the hen had six chicks. She took them out to the yard. She showed them how to peck for seeds and bugs. At night, the chicks slept under her soft wings.`,
      [order, who],
      [
        ask(
          ["Where did the hen sit on her eggs?", "母鸡在哪里孵蛋？"],
          ["In the barn", "在谷仓里"],
          [
            ["In a tree", "在树上"],
            ["By the pond", "在池塘边"],
            ["In the house", "在房子里"],
          ],
          ["The story says a red hen sat on her eggs in the barn.", "故事说一只红母鸡在谷仓里孵蛋。"],
        ),
        ask(
          ["What happened after the hen felt a tap?", "母鸡感觉到轻轻的敲击之后发生了什么？"],
          ["An egg cracked and a chick came out", "一个蛋裂开了，一只小鸡钻了出来"],
          [
            ["She ran to the yard", "她跑到了院子里"],
            ["The chicks went to sleep", "小鸡们睡着了"],
            ["She found some seeds", "她找到了一些种子"],
          ],
          ["After the tap, a crack came in one egg and a little chick came out.", "敲击之后，一个蛋裂开了，一只小鸡钻了出来。"],
        ),
        ask(
          ["Where did the chicks sleep at night?", "小鸡晚上睡在哪里？"],
          ["Under the hen's wings", "在母鸡的翅膀下"],
          [
            ["In a box", "在盒子里"],
            ["In the yard", "在院子里"],
            ["On a log", "在木头上"],
          ],
          ["The last sentence says the chicks slept under her soft wings.", "最后一句说小鸡睡在她柔软的翅膀下。"],
        ),
      ],
    ),
  ],
};

/** homeAndSchool is the reading unit of grade 1 on a day at school and helping at home. */
export const homeAndSchool: ReadingUnitDef = {
  id: "home-and-school",
  title: t("Home and School", "家和学校"),
  passages: [
    passage(
      "a-day-at-school",
      t("A Day at School", "学校里的一天"),
      `Kim gets to school at eight. First, she hangs up her coat and bag. Then she sits on the rug with her class.

The teacher reads a story. After that, the class does math. Kim likes to add and take away.

At lunch, Kim eats a ham sandwich and an apple. Then she plays tag with her friends.

In the afternoon, the class paints pictures of the sea. Kim paints a big blue whale. When the bell rings, it is time to go home.`,
      [order],
      [
        ask(
          ["What does Kim do first at school?", "金到学校后先做什么？"],
          ["She hangs up her coat and bag", "她挂好外套和书包"],
          [
            ["She eats lunch", "她吃午饭"],
            ["She paints a whale", "她画一头鲸"],
            ["She plays tag", "她玩捉人游戏"],
          ],
          ['The story says, "First, she hangs up her coat and bag."', "故事说：“她先挂好外套和书包。”"],
        ),
        ask(
          ["What does Kim eat at lunch?", "金午饭吃什么？"],
          ["A ham sandwich and an apple", "一个火腿三明治和一个苹果"],
          [
            ["Soup and bread", "汤和面包"],
            ["Eggs and milk", "鸡蛋和牛奶"],
            ["A cake", "一块蛋糕"],
          ],
          ["The story says she eats a ham sandwich and an apple.", "故事说她吃一个火腿三明治和一个苹果。"],
        ),
        ask(
          ["What does Kim paint?", "金画了什么？"],
          ["A big blue whale", "一头蓝色的大鲸"],
          [
            ["A red ship", "一艘红色的船"],
            ["Her friends", "她的朋友们"],
            ["A green frog", "一只绿色的青蛙"],
          ],
          ["The story says Kim paints a big blue whale.", "故事说金画了一头蓝色的大鲸。"],
        ),
      ],
      ["Kim"],
    ),
    passage(
      "ben-helps-at-home",
      t("Ben Helps at Home", "本在家帮忙"),
      `Ben likes to help at home. Every day, he has a job to do.

On Monday, he feeds the cat. On Tuesday, he waters the plants. On Wednesday, he helps Dad wash the dishes. On Thursday, he puts away his toys. On Friday, he helps Mom fold the clothes.

Ben's jobs are not hard, but they help the family a lot. Mom says that when we all help, the work gets done fast. Then there is more time to play!`,
      [order, facts],
      [
        ask(
          ["What does Ben do on Monday?", "本星期一做什么？"],
          ["He feeds the cat", "他喂猫"],
          [
            ["He waters the plants", "他给植物浇水"],
            ["He washes the dishes", "他洗碗"],
            ["He folds the clothes", "他叠衣服"],
          ],
          ['The text says, "On Monday, he feeds the cat."', "短文说：“星期一，他喂猫。”"],
        ),
        ask(
          ["Who does Ben help wash the dishes?", "本帮谁洗碗？"],
          ["Dad", "爸爸"],
          [
            ["Mom", "妈妈"],
            ["His sister", "他的姐姐"],
            ["The cat", "猫"],
          ],
          ["The text says that on Wednesday he helps Dad wash the dishes.", "短文说星期三他帮爸爸洗碗。"],
        ),
        ask(
          ["Why does Mom say it is good when we all help?", "妈妈为什么说大家都帮忙很好？"],
          ["The work gets done fast", "活儿很快就干完了"],
          [
            ["The cat gets fed", "猫能吃到东西"],
            ["The toys get lost", "玩具会丢"],
            ["The plants get dry", "植物会变干"],
          ],
          [
            "Mom says that when we all help, the work gets done fast, and there is more time to play.",
            "妈妈说大家都帮忙，活儿就干得快，玩的时间就更多。",
          ],
        ),
      ],
      ["Ben"],
    ),
    passage(
      "the-lost-lunch-box",
      t("The Lost Lunch Box", "丢失的午餐盒"),
      `It was time for lunch, but Sam could not find his lunch box. It was green, with a frog on the lid.

Sam looked in his bag. It was not there. He looked under his desk. It was not there. He looked by the door. It was not there.

Sam felt sad. His friend Ann said, "I will help you look." They went back to the bus stop. There it was, on the bench!

Sam was glad. He gave Ann a big hug and shared his grapes with her.`,
      [who, order],
      [
        ask(
          ["What did the lunch box look like?", "午餐盒是什么样子的？"],
          ["Green, with a frog on the lid", "绿色的，盖子上有一只青蛙"],
          [
            ["Red, with a cat on it", "红色的，上面有一只猫"],
            ["Blue, with a ship on it", "蓝色的，上面有一艘船"],
            ["Black, with no lid", "黑色的，没有盖子"],
          ],
          ["The story says it was green, with a frog on the lid.", "故事说它是绿色的，盖子上有一只青蛙。"],
        ),
        ask(
          ["Where did they find the lunch box?", "他们在哪里找到了午餐盒？"],
          ["On the bench at the bus stop", "在公共汽车站的长凳上"],
          [
            ["In Sam's bag", "在萨姆的书包里"],
            ["Under the desk", "在桌子下面"],
            ["By the door", "在门边"],
          ],
          ["Sam and Ann went back to the bus stop, and the lunch box was on the bench.", "萨姆和安回到公共汽车站，午餐盒就在长凳上。"],
        ),
        ask(
          ["How did Sam thank Ann?", "萨姆怎样感谢安？"],
          ["He hugged her and shared his grapes", "他拥抱了她，还和她分享葡萄"],
          [
            ["He gave her his lunch box", "他把午餐盒给了她"],
            ["He sang her a song", "他给她唱了一首歌"],
            ["He drew her a picture", "他给她画了一幅画"],
          ],
          [
            "The last sentence says he gave Ann a big hug and shared his grapes with her.",
            "最后一句说他给了安一个大大的拥抱，还和她分享葡萄。",
          ],
        ),
      ],
      ["Sam", "Ann"],
    ),
  ],
};

/** weatherAndSeasons is the reading unit of grade 1 on rain, snow and the seasons. */
export const weatherAndSeasons: ReadingUnitDef = {
  id: "weather-and-seasons",
  title: t("Weather and Seasons", "天气和季节"),
  passages: [
    passage(
      "rain-rain",
      t("Rain, Rain", "下雨了"),
      `Drip, drop, drip. It is raining. Meg looks out the window. She wants to play in the park, but it is too wet.

"Can I go out?" Meg asks. "Put on your coat and boots," says Mom.

Meg puts on her yellow coat and her red boots. She runs out and jumps in a big puddle. Splash! Then she sees a worm on the path. Worms come up when it rains.

At last, the sun comes out, and Meg sees a rainbow in the sky.`,
      [who, order],
      [
        ask(
          ["What did Meg put on to go out?", "梅格出门前穿了什么？"],
          ["A yellow coat and red boots", "黄色的外套和红色的靴子"],
          [
            ["A hat and gloves", "帽子和手套"],
            ["A swimsuit", "游泳衣"],
            ["Her socks and no shoes", "只穿袜子不穿鞋"],
          ],
          ["The story says Meg puts on her yellow coat and her red boots.", "故事说梅格穿上了黄色的外套和红色的靴子。"],
        ),
        ask(
          ["What did Meg see on the path?", "梅格在小路上看到了什么？"],
          ["A worm", "一条虫子"],
          [
            ["A frog", "一只青蛙"],
            ["A cat", "一只猫"],
            ["A ball", "一个球"],
          ],
          ["The story says she sees a worm on the path.", "故事说她在小路上看到了一条虫子。"],
        ),
        ask(
          ["What did Meg see at the end?", "最后梅格看到了什么？"],
          ["A rainbow", "一道彩虹"],
          [
            ["Snow", "雪"],
            ["The moon", "月亮"],
            ["A storm", "一场暴风雨"],
          ],
          ["At last the sun comes out, and Meg sees a rainbow in the sky.", "最后太阳出来了，梅格看到天上有一道彩虹。"],
        ),
      ],
      ["Meg"],
    ),
    passage(
      "fun-in-the-snow",
      t("Fun in the Snow", "雪中的乐趣"),
      `When Tom woke up, the world was white. Snow was on the trees, on the cars and on the grass.

Tom put on his hat, his coat and his mittens. He went out with his sister Jen. They made a big snowman. Jen gave it two black stones for eyes and a carrot for a nose. Tom gave it his old red scarf.

Then they slid down the hill on a sled. It was fast and fun! When their hands got cold, they went in for hot milk.`,
      [order, who],
      [
        ask(
          ["What did the world look like when Tom woke up?", "汤姆醒来时外面是什么样子的？"],
          ["It was white with snow", "到处是白白的雪"],
          [
            ["It was wet with rain", "到处湿漉漉的"],
            ["It was hot and sunny", "又热又晴"],
            ["It was dark and windy", "又黑又刮风"],
          ],
          ["The story says the world was white, with snow on the trees, cars and grass.", "故事说外面一片白，树上、车上和草地上都是雪。"],
        ),
        ask(
          ["What did Jen use for the snowman's nose?", "珍用什么做雪人的鼻子？"],
          ["A carrot", "一根胡萝卜"],
          [
            ["A black stone", "一块黑石头"],
            ["A red scarf", "一条红围巾"],
            ["A stick", "一根树枝"],
          ],
          ["The story says Jen gave it a carrot for a nose.", "故事说珍给雪人装了一根胡萝卜当鼻子。"],
        ),
        ask(
          ["Why did they go in?", "他们为什么进屋了？"],
          ["Their hands got cold", "他们的手冻冷了"],
          [
            ["It got dark", "天黑了"],
            ["The snowman fell", "雪人倒了"],
            ["Mom called them", "妈妈叫他们"],
          ],
          [
            "The last sentence says that when their hands got cold, they went in for hot milk.",
            "最后一句说，他们的手冻冷了，就进屋喝热牛奶。",
          ],
        ),
      ],
      ["Tom", "Jen"],
    ),
    passage(
      "the-four-seasons",
      t("The Four Seasons", "四季"),
      `A year has four seasons. They are spring, summer, fall and winter.

In spring, the days get warm. Plants start to grow, and baby animals are born.

In summer, it is hot and sunny. The days are long. Lots of people swim and play outside.

In fall, the air gets cool. Leaves turn red and yellow, and they fall from the trees.

In winter, it is cold. In some places, snow falls. Then spring comes back again, and the year starts over.`,
      [facts],
      [
        ask(
          ["How many seasons are in a year?", "一年有几个季节？"],
          ["Four", "四个"],
          [
            ["Two", "两个"],
            ["Three", "三个"],
            ["Six", "六个"],
          ],
          ["The text says a year has four seasons: spring, summer, fall and winter.", "短文说一年有四个季节：春、夏、秋、冬。"],
        ),
        ask(
          ["When do leaves turn red and yellow?", "树叶什么时候变红变黄？"],
          ["In fall", "秋天"],
          [
            ["In spring", "春天"],
            ["In summer", "夏天"],
            ["In winter", "冬天"],
          ],
          ["The text says that in fall, leaves turn red and yellow.", "短文说秋天树叶变红变黄。"],
        ),
        ask(
          ["What happens in spring?", "春天会发生什么？"],
          ["Plants grow and baby animals are born", "植物生长，小动物出生"],
          [
            ["Snow falls", "下雪"],
            ["Leaves fall from the trees", "树叶从树上落下"],
            ["The days get cold", "天气变冷"],
          ],
          ["The text says that in spring, plants start to grow and baby animals are born.", "短文说春天植物开始生长，小动物出生。"],
        ),
      ],
    ),
  ],
};

/** foodAndFriends is the reading unit of grade 1 on sharing food and where food comes from. */
export const foodAndFriends: ReadingUnitDef = {
  id: "food-and-friends",
  title: t("Food and Friends", "食物和朋友"),
  passages: [
    passage(
      "soup-for-gran",
      t("Soup for Gran", "给奶奶的汤"),
      `Gran was sick in bed. Lily wanted to help her feel better. "Let us make her some soup," said Dad.

First, they washed the carrots and the beans. Next, Dad cut them up, and Lily put them in the pot. Then they added water and a little salt. The soup cooked for a long time. The kitchen smelled so good!

Last, Lily took a hot bowl of soup to Gran. Gran ate it all up. "This is the best soup I have ever had," she said with a smile.`,
      [order, who],
      [
        ask(
          ["Why did Lily and Dad make soup?", "莉莉和爸爸为什么做汤？"],
          ["Gran was sick", "奶奶生病了"],
          [
            ["It was a birthday", "那天是生日"],
            ["Lily was hungry", "莉莉饿了"],
            ["It was cold out", "外面很冷"],
          ],
          ["The story says Gran was sick in bed, and Lily wanted to help her feel better.", "故事说奶奶生病躺在床上，莉莉想让她好受一些。"],
        ),
        ask(
          ["What did they do first?", "他们先做了什么？"],
          ["They washed the carrots and beans", "他们洗了胡萝卜和豆子"],
          [
            ["They added salt", "他们加了盐"],
            ["They took the soup to Gran", "他们把汤端给奶奶"],
            ["They cut up the carrots", "他们切了胡萝卜"],
          ],
          ['The story says, "First, they washed the carrots and the beans."', "故事说：“他们先洗了胡萝卜和豆子。”"],
        ),
        ask(
          ["What did Gran think of the soup?", "奶奶觉得汤怎么样？"],
          ["It was the best soup she had ever had", "这是她喝过的最好的汤"],
          [
            ["It was too hot", "太烫了"],
            ["It needed more salt", "还要再加点盐"],
            ["She did not like beans", "她不喜欢豆子"],
          ],
          ['Gran said, "This is the best soup I have ever had."', "奶奶说：“这是我喝过的最好的汤。”"],
        ),
      ],
      ["Lily"],
    ),
    passage(
      "a-picnic-in-the-park",
      t("A Picnic in the Park", "公园野餐"),
      `It was a sunny day, so Max and his friends had a picnic in the park. They sat on a big blanket under a tree.

Max brought sandwiches. Ann brought a bag of grapes. Dan brought a cake that his mom had made.

They were just about to eat when a little bird hopped up. It looked at the cake. Ann gave it a small crumb, and the bird flew off with it.

After lunch, they played catch with a ball. It was the best day!`,
      [who, facts],
      [
        ask(
          ["Where did the friends have their picnic?", "朋友们在哪里野餐？"],
          ["In the park, under a tree", "在公园里的一棵树下"],
          [
            ["At the beach", "在海滩上"],
            ["In the kitchen", "在厨房里"],
            ["At school", "在学校里"],
          ],
          ["The story says they had a picnic in the park and sat under a tree.", "故事说他们在公园野餐，坐在一棵树下。"],
        ),
        ask(
          ["What did Ann bring?", "安带了什么？"],
          ["A bag of grapes", "一袋葡萄"],
          [
            ["Sandwiches", "三明治"],
            ["A cake", "一块蛋糕"],
            ["A ball", "一个球"],
          ],
          ["The story says Ann brought a bag of grapes.", "故事说安带了一袋葡萄。"],
        ),
        ask(
          ["What did the bird take?", "小鸟拿走了什么？"],
          ["A small crumb of cake", "一小块蛋糕屑"],
          [
            ["A grape", "一颗葡萄"],
            ["A whole sandwich", "一整个三明治"],
            ["The ball", "那个球"],
          ],
          ["Ann gave the bird a small crumb, and it flew off with it.", "安给了小鸟一小块蛋糕屑，小鸟叼着它飞走了。"],
        ),
      ],
      ["Max", "Ann", "Dan"],
    ),
    passage(
      "where-food-comes-from",
      t("Where Food Comes From", "食物从哪里来"),
      `The food we eat comes from plants and animals.

Some food grows on plants. Apples and plums grow on trees. Carrots grow under the ground. Rice and wheat grow in big fields. Bread is made from wheat.

Some food comes from animals. Hens give us eggs. Cows give us milk, and milk is used to make cheese.

Farmers work hard to grow our food. Then trucks take it to the shops. Next time you eat, think about where your food came from!`,
      [facts],
      [
        ask(
          ["Where do carrots grow?", "胡萝卜长在哪里？"],
          ["Under the ground", "在地下"],
          [
            ["On trees", "在树上"],
            ["In the sea", "在海里"],
            ["On a vine in the sky", "在天上的藤上"],
          ],
          ["The text says carrots grow under the ground.", "短文说胡萝卜长在地下。"],
        ),
        ask(
          ["What is bread made from?", "面包是用什么做的？"],
          ["Wheat", "小麦"],
          [
            ["Rice", "大米"],
            ["Milk", "牛奶"],
            ["Plums", "李子"],
          ],
          ["The text says bread is made from wheat.", "短文说面包是用小麦做的。"],
        ),
        ask(
          ["What is made from milk?", "什么是用牛奶做的？"],
          ["Cheese", "奶酪"],
          [
            ["Eggs", "鸡蛋"],
            ["Bread", "面包"],
            ["Apples", "苹果"],
          ],
          ["The text says milk is used to make cheese.", "短文说牛奶可以用来做奶酪。"],
        ),
      ],
    ),
  ],
};

/** bugsAndGrowingThings is the reading unit of grade 1 on seeds, ants and butterflies. */
export const bugsAndGrowingThings: ReadingUnitDef = {
  id: "bugs-and-growing-things",
  title: t("Bugs and Growing Things", "小虫和生长的东西"),
  passages: [
    passage(
      "a-seed-becomes-a-plant",
      t("From Seed to Plant", "从种子到植物"),
      `A plant starts as a tiny seed. If you plant the seed in soil and give it water, it will begin to grow.

First, a little root grows down into the soil. The root drinks water. Next, a green shoot pushes up out of the soil. The shoot grows into a stem with leaves. The leaves need sunlight to make food for the plant.

Last, the plant may grow a flower. The flower makes new seeds, and then new plants can grow.`,
      [facts, order],
      [
        ask(
          ["What grows first from the seed?", "种子最先长出什么？"],
          ["A root", "根"],
          [
            ["A flower", "花"],
            ["A leaf", "叶子"],
            ["A new seed", "新的种子"],
          ],
          ['The text says, "First, a little root grows down into the soil."', "短文说：“首先，一条小根向下长进土里。”"],
        ),
        ask(
          ["What do the leaves need to make food?", "叶子需要什么来制造养料？"],
          ["Sunlight", "阳光"],
          [
            ["Snow", "雪"],
            ["Soil", "泥土"],
            ["Wind", "风"],
          ],
          ["The text says the leaves need sunlight to make food for the plant.", "短文说叶子需要阳光为植物制造养料。"],
        ),
        ask(
          ["What does the flower make?", "花会产生什么？"],
          ["New seeds", "新的种子"],
          [
            ["Roots", "根"],
            ["Water", "水"],
            ["Soil", "泥土"],
          ],
          ["The text says the flower makes new seeds, so new plants can grow.", "短文说花会结出新的种子，于是新的植物就能生长。"],
        ),
      ],
    ),
    passage(
      "the-busy-ant",
      t("The Busy Ant", "忙碌的蚂蚁"),
      `Ants are very small, but they are very strong. An ant can lift things that are much bigger than it is.

Ants live together in a nest under the ground. The nest has lots of little rooms and long tunnels. One big ant is the queen. She lays all the eggs.

The other ants work all day. Some ants look for food. Some take care of the eggs. Some dig new tunnels. When an ant finds food, it leaves a smell on the path so the other ants can find it too.`,
      [facts],
      [
        ask(
          ["Where do ants live?", "蚂蚁住在哪里？"],
          ["In a nest under the ground", "在地下的巢穴里"],
          [
            ["In a hive in a tree", "在树上的蜂巢里"],
            ["In a pond", "在池塘里"],
            ["On top of a hill", "在山顶上"],
          ],
          ["The text says ants live together in a nest under the ground.", "短文说蚂蚁一起住在地下的巢穴里。"],
        ),
        ask(
          ["What does the queen ant do?", "蚁后做什么？"],
          ["She lays all the eggs", "她产下所有的卵"],
          [
            ["She digs tunnels", "她挖隧道"],
            ["She looks for food", "她寻找食物"],
            ["She lifts big things", "她搬大东西"],
          ],
          ["The text says the queen lays all the eggs.", "短文说蚁后产下所有的卵。"],
        ),
        ask(
          ["How do other ants find the food?", "其他蚂蚁怎样找到食物？"],
          ["They follow a smell on the path", "它们循着路上的气味找"],
          [
            ["They see it from far away", "它们从远处看见它"],
            ["The queen tells them", "蚁后告诉它们"],
            ["They hear it", "它们听见了它"],
          ],
          [
            "The text says an ant leaves a smell on the path so the other ants can find the food.",
            "短文说蚂蚁在路上留下气味，让其他蚂蚁也能找到食物。",
          ],
        ),
      ],
    ),
    passage(
      "a-butterfly-grows",
      t("A Butterfly Grows", "蝴蝶的成长"),
      `A butterfly does not start out as a butterfly. It changes a lot as it grows.

First, a butterfly lays a tiny egg on a leaf. Then a little caterpillar comes out of the egg. The caterpillar is very hungry. It eats and eats, and it gets bigger and bigger.

Next, the caterpillar makes a hard shell around itself. Inside, it changes. This takes about two weeks.

At last, the shell opens, and out comes a butterfly with bright wings. It dries its wings in the sun and flies away.`,
      [order, facts],
      [
        ask(
          ["Where does a butterfly lay its egg?", "蝴蝶把卵产在哪里？"],
          ["On a leaf", "在叶子上"],
          [
            ["In the soil", "在土里"],
            ["In a pond", "在池塘里"],
            ["In a nest", "在鸟巢里"],
          ],
          ["The text says a butterfly lays a tiny egg on a leaf.", "短文说蝴蝶把小小的卵产在叶子上。"],
        ),
        ask(
          ["What comes out of the egg?", "从卵里出来的是什么？"],
          ["A caterpillar", "一条毛毛虫"],
          [
            ["A butterfly", "一只蝴蝶"],
            ["A bird", "一只鸟"],
            ["An ant", "一只蚂蚁"],
          ],
          ["The text says a little caterpillar comes out of the egg.", "短文说一条小毛毛虫从卵里钻出来。"],
        ),
        ask(
          ["What does the butterfly do last?", "蝴蝶最后做什么？"],
          ["It dries its wings and flies away", "它晾干翅膀，飞走了"],
          [
            ["It lays an egg", "它产卵"],
            ["It eats lots of leaves", "它吃很多叶子"],
            ["It makes a hard shell", "它做一个硬壳"],
          ],
          ["At last the butterfly dries its wings in the sun and flies away.", "最后，蝴蝶在阳光下晾干翅膀，飞走了。"],
        ),
      ],
    ),
  ],
};

/** readingUnits1 are the reading units of grade 1, one for each unit of the course. */
export const readingUnits1: readonly ReadingUnitDef[] = [
  allAboutMe,
  petsAndAnimals,
  homeAndSchool,
  weatherAndSeasons,
  foodAndFriends,
  bugsAndGrowingThings,
];
