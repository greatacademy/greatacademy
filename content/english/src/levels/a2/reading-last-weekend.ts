// The reading unit of the A2 theme Last Weekend: stories and emails in the past simple.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const past = ["past-simple-regular", "past-simple-irregular"];

const passage = passageMaker(readingWords, [
  "a2-words-past-time",
  "a2-words-relatives",
  "a2-words-events",
  "a2-words-weekend",
  "a2-words-useful-words",
  ...past,
  "past-simple-questions-and-negatives",
]);

/** readingLastWeekend is the reading unit of the theme Last Weekend: picnics, camping, visits and small adventures. */
export const readingLastWeekend: ReadingUnitDef = {
  id: "a2-reading-last-weekend",
  title: t("Last Weekend", "上个周末"),
  passages: [
    passage({
      id: "a2-weekend-a-picnic-that-went-wrong",
      title: ["A Picnic That Went Wrong", "一次出了岔子的野餐"],
      body: `Last Saturday my family planned a picnic in the park. Mom made sandwiches and a big salad, and Dad bought juice and fruit at the shop. My little brother Leo carried the ball.

We found a nice place under a tree near the river and sat on the grass. Then the problems started. First, Leo dropped the salad on the ground. Next, a dog ran across the grass, took two sandwiches and ran off with them. We all laughed, but we were hungry.

After that, the sky suddenly got dark, and it started to rain. We picked up our things and hurried to the car. We were wet and cold.

At home, Dad made hot soup, and Mom found some cookies. We had our picnic on the kitchen floor. It wasn't the picnic we planned, but it was fun, and Leo says it was the best picnic ever.`,
      grammar: past,
      names: ["Leo"],
      questions: [
        [
          ["What did Dad buy for the picnic?", "爸爸为野餐买了什么？"],
          ["Juice and fruit", "果汁和水果"],
          [
            ["Sandwiches and a salad", "三明治和沙拉"],
            ["Soup and cookies", "汤和饼干"],
          ],
          ['The passage says: "Dad bought juice and fruit at the shop."', "文中说爸爸在商店买了果汁和水果；三明治和沙拉是妈妈做的。"],
        ],
        [
          ["What happened to two of the sandwiches?", "有两个三明治怎么了？"],
          ["A dog took them", "一只狗把它们叼走了"],
          [
            ["Leo dropped them", "利奥把它们掉在地上了"],
            ["The rain made them wet", "雨把它们淋湿了"],
          ],
          [
            'The passage says: "a dog ran across the grass, took two sandwiches and ran off with them."',
            "文中说一只狗跑过草地，叼走了两个三明治。利奥掉的是沙拉。",
          ],
        ],
        [
          ["Where did the family have their picnic in the end?", "这家人最后在哪里野餐？"],
          ["On the kitchen floor", "在厨房地板上"],
          [
            ["Under a tree by the river", "在河边的树下"],
            ["In the car", "在车里"],
          ],
          ['The passage says: "We had our picnic on the kitchen floor."', "下雨后他们回了家，在厨房地板上野餐。"],
        ],
      ],
    }),
    passage({
      id: "a2-weekend-camping-by-the-lake",
      title: ["Camping by the Lake", "在湖边露营"],
      body: `In the summer holidays, my uncle Sam took me and my cousin Amy camping. We drove for three hours to a quiet lake in the mountains.

When we arrived, we put up our tent between two tall trees near the water. Then we went for a long hike around the lake. We saw ducks, a lot of birds and, once, a big brown deer. Amy took photos of everything.

In the evening, Uncle Sam cooked fish, and we ate it outside with bread and tea. It was cold, so we wore our coats. After dinner, we sat by the water and looked at the stars. I never knew there were so many!

That night I didn't sleep well, because the ground was hard. But in the morning, when I opened the tent and saw the sun on the lake, I forgot about it. We swam, relaxed and played cards until lunch. I want to go camping again next summer.`,
      grammar: past,
      names: ["Sam", "Amy"],
      questions: [
        [
          ["How did they get to the lake?", "他们是怎么去湖边的？"],
          ["By car", "开车"],
          [
            ["By train", "坐火车"],
            ["On foot", "走路"],
          ],
          ['The passage says: "We drove for three hours to a quiet lake."', "文中说他们开了三个小时车到湖边。"],
        ],
        [
          ["Why didn't the writer sleep well?", "作者为什么没睡好？"],
          ["The ground was hard", "地面很硬"],
          [
            ["It was too cold", "天太冷了"],
            ["Amy talked all night", "埃米说了一整夜话"],
          ],
          ['The passage says: "I didn\'t sleep well, because the ground was hard."', "文中用 because 说明了原因：地面很硬。"],
        ],
        [
          ["What did they do on the second morning?", "第二天早上他们做了什么？"],
          ["They swam, relaxed and played cards", "游泳、休息、打牌"],
          [
            ["They went for a long hike", "走了很长的远足"],
            ["They drove home", "开车回家"],
          ],
          [
            'The passage says: "We swam, relaxed and played cards until lunch."',
            "文中说他们游泳、放松、打牌，一直到午饭。远足是第一天的事。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-weekend-a-visit-to-the-village",
      title: ["A Visit to Grandma's Village", "去奶奶的村子"],
      body: `Hi Lily,

How was your weekend? I spent mine in the village where my grandparents live. It is two hours from the city by bus, and it is very quiet there.

On Saturday morning I helped Grandpa in the garden. We planted tomatoes and carried water from the river. In the afternoon, Grandma taught me how to make dumplings. My first dumplings were ugly, but they tasted good!

In the evening, a lot of neighbors came to the house. They wanted to meet me, because they remembered me as a baby. One old man told funny stories about my dad when he was a boy.

On Sunday I didn't want to leave. Grandma gave me a bag of eggs from her hens, and Grandpa drove me to the bus station. I want to go back in the summer. Do you want to come with me?

Write soon,
Mei`,
      grammar: past,
      names: ["Lily", "Mei"],
      questions: [
        [
          ["How far is the village from the city?", "村子离城市有多远？"],
          ["Two hours by bus", "坐公共汽车两个小时"],
          [
            ["Three hours by car", "开车三个小时"],
            ["Thirty minutes by train", "坐火车三十分钟"],
          ],
          ['Mei writes: "It is two hours from the city by bus."', "梅写道：坐公共汽车两个小时。"],
        ],
        [
          ["What did Mei do on Saturday afternoon?", "梅星期六下午做了什么？"],
          ["She learned to make dumplings", "学包饺子"],
          [
            ["She planted tomatoes", "种西红柿"],
            ["She met the neighbors", "见邻居"],
          ],
          [
            'Mei writes: "In the afternoon, Grandma taught me how to make dumplings."',
            "种西红柿是上午的事，见邻居是晚上的事；下午奶奶教她包饺子。",
          ],
        ],
        [
          ["Why did the neighbors want to meet Mei?", "邻居们为什么想见梅？"],
          ["They remembered her as a baby", "他们记得她小时候的样子"],
          [
            ["They wanted to eat her dumplings", "他们想吃她包的饺子"],
            ["They knew her from the city", "他们在城里就认识她"],
          ],
          [
            'Mei writes: "They wanted to meet me, because they remembered me as a baby."',
            "原因在 because 后面：他们记得她还是婴儿时的样子。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-weekend-the-lost-tent",
      title: ["The Lost Tent", "丢失的帐篷"],
      body: `Last month our school club went camping in the forest. There were twelve students and two teachers, Mr. Park and Ms. Green. We traveled there by bus, and the driver left us at the end of a long road.

We walked for an hour to the camping place. Then the girls started to put up their tents, and Mr. Park asked the boys, "Where is your tent?" No one answered.

We looked in every bag, but the tent wasn't there. Then Tom remembered. "I put it under my seat on the bus!" We all felt terrible. It was late, and the bus was gone.

Ms. Green called the bus driver on her phone. He was very kind. He found the tent and drove back with it. When he arrived two hours later, it was dark. We thanked him and gave him a cup of hot tea.

That night we put up our tent with the lights of our phones. Tom didn't forget anything for the rest of the trip.`,
      grammar: past,
      names: ["Mr", "Ms", "Park", "Green", "Tom"],
      questions: [
        [
          ["Where was the boys' tent?", "男孩们的帐篷在哪里？"],
          ["Under a seat on the bus", "在公共汽车的座位下面"],
          [
            ["At school", "在学校"],
            ["In a girl's bag", "在一个女孩的包里"],
          ],
          ['Tom says: "I put it under my seat on the bus!"', "汤姆想起来：他把帐篷放在了公共汽车的座位下面。"],
        ],
        [
          ["Who brought the tent to the forest?", "谁把帐篷送到了森林？"],
          ["The bus driver", "公共汽车司机"],
          [
            ["Mr. Park", "帕克老师"],
            ["Tom's father", "汤姆的爸爸"],
          ],
          ['The passage says the driver "found the tent and drove back with it."', "格林老师给司机打了电话，司机找到帐篷并开车送了回来。"],
        ],
        [
          ["When did the driver arrive?", "司机什么时候到的？"],
          ["Two hours later, when it was dark", "两个小时后，天已经黑了"],
          [
            ["The next morning", "第二天早上"],
            ["After ten minutes", "十分钟后"],
          ],
          ['The passage says: "When he arrived two hours later, it was dark."', "文中说他两个小时后到达，那时天已经黑了。"],
        ],
      ],
    }),
    passage({
      id: "a2-weekend-a-rainy-saturday-at-the-gallery",
      title: ["A Rainy Saturday at the Gallery", "下雨的星期六去美术馆"],
      body: `On Saturday it rained all day, so my friend Nora and I decided to go to the city gallery. I thought it was going to be boring. I was wrong.

The gallery has five big rooms. In the first room there were very old pictures of ships and the sea. The second room was very different. Some were just big squares of color. Nora laughed and said, "I can paint that!" A guide heard her and smiled. "Perhaps you can," she said, "but he did it first, eighty years ago."

Then the guide showed us a room for children, where you can paint on the walls. We spent an hour there. I painted a rainy street, and Nora painted her cat.

When we left, it was still raining, but we didn't care. It was the most interesting rainy day I can remember.`,
      grammar: past,
      names: ["Nora"],
      questions: [
        [
          ["Why did they go to the gallery?", "他们为什么去美术馆？"],
          ["Because it was raining", "因为在下雨"],
          [
            ["Because Nora's mother worked there", "因为诺拉的妈妈在那里工作"],
            ["Because they had a school project", "因为他们有学校的课题"],
          ],
          [
            'The passage says: "it rained all day, so my friend Nora and I decided to go to the city gallery."',
            "so 前面说的就是原因：下了一整天雨。",
          ],
        ],
        [
          ["What did the writer think before the visit?", "去之前作者是怎么想的？"],
          ["It was going to be boring", "会很无聊"],
          [
            ["It was going to be crowded", "会很拥挤"],
            ["It was going to be expensive", "会很贵"],
          ],
          ['The writer says: "I thought it was going to be boring. I was wrong."', "作者以为会很无聊，后来发现自己想错了。"],
        ],
        [
          ["What did Nora paint on the wall?", "诺拉在墙上画了什么？"],
          ["Her cat", "她的猫"],
          [
            ["A rainy street", "下雨的街道"],
            ["Ships and the sea", "船和大海"],
          ],
          ['The passage says: "I painted a rainy street, and Nora painted her cat."', "下雨的街道是作者画的，诺拉画的是她的猫。"],
        ],
      ],
    }),
    passage({
      id: "a2-weekend-cousins-at-the-beach",
      title: ["Cousins at the Beach", "和表兄妹去海滩"],
      body: `Last weekend my aunt and uncle came to visit with their two children, my cousins Ben and Ella. Ben is ten, and Ella is seven. On Sunday we all went to the beach.

The weather was hot and sunny, and the beach was crowded. We found a place near the water. Dad and Uncle Tim swam far out into the sea, while Mom and Aunt Rosa sat in the sun and talked.

Ben and I built a big sand castle with four towers. Ella wanted to help, but she kept walking on it, so we built it again.

After lunch, Ella lost her blue hat. We looked for it all over the beach. Finally, a little boy found it in the water and brought it back. Ella was so happy that she gave him her ice cream.

In the evening we were tired, red from the sun and very happy. My cousins went home the next day, but they promised to come again in August.`,
      grammar: past,
      names: ["Ben", "Ella", "Tim", "Rosa"],
      questions: [
        [
          ["Who built the sand castle?", "谁堆了沙堡？"],
          ["Ben and the writer", "本和作者"],
          [
            ["Ella and Ben", "埃拉和本"],
            ["Dad and Uncle Tim", "爸爸和蒂姆叔叔"],
          ],
          ['The passage says: "Ben and I built a big sand castle."', "是本和“我”堆的沙堡；埃拉想帮忙，却总踩在上面。"],
        ],
        [
          ["What did Ella lose?", "埃拉丢了什么？"],
          ["Her blue hat", "她的蓝帽子"],
          [
            ["Her ice cream", "她的冰淇淋"],
            ["Her ball", "她的球"],
          ],
          ['The passage says: "After lunch, Ella lost her blue hat."', "埃拉丢的是蓝帽子；冰淇淋是她后来送给那个男孩的。"],
        ],
        [
          ["When will the cousins come again?", "表兄妹什么时候再来？"],
          ["In August", "八月"],
          [
            ["Next weekend", "下个周末"],
            ["In the winter", "冬天"],
          ],
          ['The passage says: "they promised to come again in August."', "文中说他们答应八月再来。"],
        ],
      ],
    }),
    passage({
      id: "a2-weekend-the-day-i-forgot-my-keys",
      title: ["The Day I Forgot My Keys", "我忘带钥匙的那天"],
      body: `Yesterday was a bad day. I got up late, hurried out of the house and left my keys on the kitchen table. Keys are the little things that open our front door.

After school I came home at four o'clock. Mom and Dad work until six, and my brother was at football practice. I couldn't open the door. I tried all the windows, but they were closed.

It started to rain. I sat by the door and felt cold and hungry. Then our neighbor, Mrs. Diaz, saw me from her window. She came out with an umbrella and said, "Come in and wait at my house."

Mrs. Diaz gave me hot milk and cookies, and I did my homework at her table. She told me about her life when she was a girl in Mexico. It was really interesting, and the time went quickly.

At six, Mom came home. She thanked Mrs. Diaz, and I promised to remember my keys. Now I keep them in my school bag every day.`,
      grammar: past,
      names: ["Mrs", "Diaz", "Mexico"],
      glossed: ["keys"],
      questions: [
        [
          ["Why couldn't the writer open the door?", "作者为什么开不了门？"],
          ["The keys were on the kitchen table", "钥匙在厨房桌子上"],
          [
            ["The door was broken", "门坏了"],
            ["Mom had the keys", "钥匙在妈妈那里"],
          ],
          ['The writer "left my keys on the kitchen table."', "作者早上匆忙出门，把钥匙落在了厨房桌子上。"],
        ],
        [
          ["Who helped the writer?", "谁帮助了作者？"],
          ["A neighbor, Mrs. Diaz", "邻居迪亚兹太太"],
          [
            ["The writer's brother", "作者的哥哥"],
            ["A teacher", "一位老师"],
          ],
          ['The passage says: "our neighbor, Mrs. Diaz, saw me from her window."', "邻居迪亚兹太太从窗口看见了作者，请作者到她家等。"],
        ],
        [
          ["Where does the writer keep the keys now?", "作者现在把钥匙放在哪里？"],
          ["In the school bag", "在书包里"],
          [
            ["On the kitchen table", "在厨房桌子上"],
            ["At Mrs. Diaz's house", "在迪亚兹太太家"],
          ],
          ['The writer says: "Now I keep them in my school bag every day."', "最后一句说作者现在每天把钥匙放在书包里。"],
        ],
      ],
    }),
    passage({
      id: "a2-weekend-a-surprise-for-dad",
      title: ["A Surprise for Dad", "给爸爸的惊喜"],
      body: `Last Sunday my dad turned forty, and my mom, my sister Jen and I planned a surprise for him: a party that he didn't know about.

For two weeks we planned everything quietly. We invited his friends from work, his brother and our neighbors. Jen made a big cake, and I made a card with photos of Dad as a baby.

On Sunday morning, Mom asked Dad to go to the market with her. While they were out, Jen and I put flowers and pictures on every wall. The guests came at eleven and waited in the living room.

At twelve o'clock the door opened, and everyone shouted, "Happy birthday!" Dad stood at the door with a bag of vegetables in each hand. He didn't say anything for a moment. Then he laughed and said, "You all knew, and I didn't!"

It was a great party, and Dad says it was the best birthday of his life.`,
      grammar: [...past, "past-simple-questions-and-negatives"],
      names: ["Jen"],
      glossed: ["surprise"],
      questions: [
        [
          ["What was the surprise?", "惊喜是什么？"],
          ["A party Dad didn't know about", "一个爸爸不知道的聚会"],
          [
            ["A trip to the market", "一次去市场的出行"],
            ["A new bike", "一辆新自行车"],
          ],
          ['The passage says: "a party that he didn\'t know about."', "惊喜是一个爸爸事先不知道的生日聚会。"],
        ],
        [
          ["Why did Mom take Dad to the market?", "妈妈为什么带爸爸去市场？"],
          ["So the others could get the house ready", "好让其他人把家里布置好"],
          [
            ["To buy a cake", "去买蛋糕"],
            ["To meet the guests there", "去那里见客人"],
          ],
          [
            'The passage says: "While they were out, Jen and I put flowers and pictures on every wall."',
            "他们出门的时候，珍和“我”在家里布置；蛋糕是珍自己做的。",
          ],
        ],
        [
          ["What did Dad have in his hands when he came in?", "爸爸进门时手里拿着什么？"],
          ["Bags of vegetables", "几袋蔬菜"],
          [
            ["Flowers", "花"],
            ["A cake", "一个蛋糕"],
          ],
          ['The passage says: "Dad stood at the door with a bag of vegetables in each hand."', "爸爸每只手里都提着一袋蔬菜。"],
        ],
      ],
    }),
  ],
};
