// The reading unit of the A2 theme Festivals and Celebrations: festivals, weddings, parties and the feelings around them.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "a2-words-festivals",
  "a2-words-wishes",
  "a2-words-feelings-2",
  "a2-words-people-together",
  "verbs-followed-by-to",
  "subordinating-conjunctions",
]);

/** readingFestivals is the reading unit of the theme Festivals and Celebrations. */
export const readingFestivals: ReadingUnitDef = {
  id: "a2-reading-festivals",
  title: t("Festivals and Celebrations", "节日与庆祝"),
  passages: [
    passage({
      id: "a2-festivals-the-lantern-festival",
      title: ["The Lantern Festival", "元宵节"],
      body: `The Lantern Festival comes on the fifteenth day of the first month of the Chinese year. It is the last day of the Spring Festival, and it is the first night of the year with a full moon.

On this evening, families eat sweet rice balls called yuanxiao or tangyuan. They are white and soft, with something sweet in the center. People say that the balls are a wish for a family that stays together.

After dinner, everybody goes out to look at the lanterns. In the parks and streets there are thousands of lanterns in every color: red ones, gold ones, fish, birds and even animals as big as a bus. In the past, people made their lanterns from paper and put a candle in them. Today most lanterns have electric lights.

Many lanterns have a question written on them, and people try to find the answer. If you find it, you sometimes win a small gift.

When I was little, my grandpa always took me to the lantern show. I was too small to read the questions, so he read them to me. Now I read them to my little sister.`,
      grammar: ["past-simple-irregular", "too-and-enough", "one-and-ones"],
      names: ["Chinese", "yuanxiao", "tangyuan"],
      questions: [
        [
          ["When is the Lantern Festival?", "元宵节在什么时候？"],
          ["On the fifteenth day of the first month of the Chinese year", "农历正月十五"],
          [
            ["On the first day of the year", "一年的第一天"],
            ["In the middle of the summer", "夏天的中间"],
          ],
          [
            'The passage says: "The Lantern Festival comes on the fifteenth day of the first month of the Chinese year."',
            "元宵节是农历正月十五，春节的最后一天。",
          ],
        ],
        [
          ["What do the sweet rice balls mean?", "甜汤圆代表什么？"],
          ["A wish for a family that stays together", "希望一家人团团圆圆"],
          [
            ["A wish for a lot of money", "希望发大财"],
            ["A wish for good weather", "希望天气好"],
          ],
          ['The passage says: "People say that the balls are a wish for a family that stays together."', "汤圆象征家人团圆。"],
        ],
        [
          ["What happens if you find the answer to a lantern question?", "猜中灯谜会怎样？"],
          ["You sometimes win a small gift", "有时能赢一份小礼物"],
          [
            ["You can take the lantern home", "可以把灯笼带回家"],
            ["You have to write a new question", "要写一个新谜题"],
          ],
          ['The passage says: "If you find it, you sometimes win a small gift."', "猜对了有时能得到小礼物。"],
        ],
      ],
    }),
    passage({
      id: "a2-festivals-a-wedding-in-the-village",
      title: ["A Wedding in the Village", "村里的婚礼"],
      body: `Last October my cousin Maria got married in our grandparents' village. The whole village came to the wedding, more than three hundred guests!

The day started early. At eight o'clock the women of the family were already in the kitchen, and the men were putting long tables in the square. Children decorated the trees with flowers and lanterns.

At eleven, Maria arrived in her white dress with her father. She looked beautiful, but she was very nervous. Her husband, Paolo, was even more nervous. His hands were shaking when he put the ring on her finger. Everybody cheered, and Maria's mother cried because she was so happy.

Then the party started. We ate for four hours: soup, fish, meat, salad and a huge cake with five floors. After lunch the music began, and everybody danced, from small children to my grandpa, who is ninety.

Late in the evening the guests carried candles and walked with Maria and Paolo to their new home. Everybody wished them luck and a long and happy life together. It was the best day of the year.`,
      grammar: ["past-simple-irregular", "past-continuous", "subordinating-conjunctions"],
      names: ["Maria", "Paolo", "Maria's"],
      questions: [
        [
          ["How many guests came to the wedding?", "有多少客人来参加婚礼？"],
          ["More than three hundred", "三百多人"],
          [
            ["About thirty", "大约三十人"],
            ["Only the family", "只有家里人"],
          ],
          ['The passage says: "The whole village came to the wedding, more than three hundred guests!"', "全村人都来了，有三百多位客人。"],
        ],
        [
          ["Why were Paolo's hands shaking?", "保罗的手为什么在发抖？"],
          ["He was very nervous", "他非常紧张"],
          [
            ["He was cold", "他很冷"],
            ["He was ill", "他生病了"],
          ],
          [
            'The passage says Paolo "was even more nervous. His hands were shaking when he put the ring on her finger."',
            "保罗比玛丽亚还紧张，戴戒指时手都在抖。",
          ],
        ],
        [
          ["Why did Maria's mother cry?", "玛丽亚的妈妈为什么哭了？"],
          ["Because she was so happy", "因为她太高兴了"],
          [
            ["Because she was sad", "因为她很伤心"],
            ["Because she was tired", "因为她很累"],
          ],
          ['The passage says: "Maria\'s mother cried because she was so happy."', "妈妈是高兴得哭了。because 引出原因。"],
        ],
      ],
    }),
    passage({
      id: "a2-festivals-fireworks-at-midnight",
      title: ["Fireworks at Midnight", "午夜的烟花"],
      body: `In many countries, people celebrate the new year with fireworks at midnight. Sydney, in Australia, has one of the most famous shows in the world.

Every December 31, more than a million people come to the water in the center of the city. Many of them arrive early in the morning to find a good place, and they wait all day with food, drinks and friends. Because it is summer in Australia, the evening is warm, and people sit on the grass and in the parks.

At nine o'clock there is a small show for families with young children, so they can go to bed early. But the big show starts at midnight. For twelve minutes, the sky over the water is full of color. Fireworks go up from the bridge and from boats on the water. The fireworks are so loud that you feel them in your body.

Not everybody loves fireworks. Many dogs and cats are scared of them, and some people say they are bad for the air. So some cities now use light shows with small flying machines in the sky. But in Sydney, millions of people still watch the fireworks every year.`,
      grammar: ["comparatives-and-superlatives", "subordinating-conjunctions"],
      names: ["Sydney", "Australia"],
      questions: [
        [
          ["Why do many people arrive early in the morning?", "为什么很多人一大早就到了？"],
          ["To find a good place", "为了找个好位置"],
          [
            ["To buy tickets", "为了买票"],
            ["To help with the fireworks", "为了帮忙放烟花"],
          ],
          ['The passage says: "Many of them arrive early in the morning to find a good place."', "很多人早早到来，是为了占个好位置。"],
        ],
        [
          ["Why is there a show at nine o'clock?", "为什么九点有一场表演？"],
          ["So families with young children can go to bed early", "让带小孩的家庭可以早点睡"],
          [
            ["Because it is too cold at midnight", "因为午夜太冷"],
            ["Because the big show is too expensive", "因为大型表演太贵"],
          ],
          [
            'The passage says: "there is a small show for families with young children, so they can go to bed early."',
            "九点的小型表演是给带小孩的家庭看的。",
          ],
        ],
        [
          ["Why don't some people like fireworks?", "为什么有些人不喜欢烟花？"],
          ["Animals are scared, and they are bad for the air", "动物会害怕，而且污染空气"],
          [
            ["They are too short", "时间太短"],
            ["They are boring", "很无聊"],
          ],
          [
            'The passage says: "Many dogs and cats are scared of them, and some people say they are bad for the air."',
            "烟花会吓到猫狗，也对空气不好。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-festivals-a-surprise-party-that-wasnt-a-surprise",
      title: ["A Surprise Party That Wasn't a Surprise", "不是惊喜的惊喜派对"],
      body: `When my mom was forty, my dad, my sister and I decided to have a surprise party. We planned it for weeks. We invited twenty of her friends, and we told everybody: "Don't tell Mom!"

On the day of the party, Dad took Mom to the movies. While they were out, my sister and I decorated the living room and put the food on the table. At six o'clock the guests arrived and waited in the dark.

At seven we heard the door. The lights came on, and everybody shouted, "Surprise!"

Mom smiled, but she wasn't surprised at all. "Thank you!" she said. "I'm so pleased. I hoped that you were going to invite Anna!"

We were very surprised. "How did you know?" I asked.

Mom laughed. "Last week I wanted to borrow your phone, and I saw a message from Anna: 'See you at the party on Saturday!' I didn't want to say anything, because you were all so excited."

My sister was a little embarrassed, but Mom hugged us all. "It's my best birthday," she said. "Not because of the surprise, but because you planned it together."`,
      grammar: ["past-continuous", "subordinating-conjunctions", "verbs-followed-by-to"],
      names: ["Anna", "Anna's"],
      questions: [
        [
          ["Where did Dad take Mom on the day of the party?", "派对那天爸爸带妈妈去了哪里？"],
          ["To the movies", "看电影"],
          [
            ["To a restaurant", "餐馆"],
            ["To the shops", "商店"],
          ],
          ['The passage says: "On the day of the party, Dad took Mom to the movies."', "爸爸带妈妈去看电影，其他人在家布置。"],
        ],
        [
          ["How did Mom know about the party?", "妈妈是怎么知道派对的？"],
          ["She saw a message from Anna", "她看到了安娜的一条消息"],
          [
            ["Dad told her", "爸爸告诉了她"],
            ["She heard the guests", "她听到了客人的声音"],
          ],
          ["Mom says: \"I saw a message from Anna: 'See you at the party on Saturday!'\"", "妈妈借手机时看到了安娜发的消息。"],
        ],
        [
          ["Why was it Mom's best birthday?", "为什么这是妈妈最好的生日？"],
          ["Because her family planned it together", "因为家人一起策划了它"],
          [
            ["Because she was really surprised", "因为她真的很惊喜"],
            ["Because she got a lot of gifts", "因为她收到了很多礼物"],
          ],
          ['Mom says: "Not because of the surprise, but because you planned it together."', "妈妈说重要的不是惊喜，而是全家一起策划。"],
        ],
      ],
    }),
    passage({
      id: "a2-festivals-costumes-for-the-parade",
      title: ["Costumes for the Parade", "游行的服装"],
      body: `Every February our town has a big parade. Hundreds of people walk through the streets in costumes, and there is music and dancing in every street.

This year our class decided to join the parade. We wanted to be the sea, so everybody chose a sea animal: fish, turtles, sharks and even a whale.

We made the costumes ourselves. For six weeks we stayed at school after lessons and worked on them. We used old clothes, paper, plastic bottles and a lot of paint. I was an orange fish, and my costume had a big tail that moved when I walked. My friend Leo was the whale. His costume was so big that he needed two other students to help him carry it.

On the day of the parade it was cold and windy, and I was worried about our costumes. But they were fine. When we walked past, people laughed and took photos. Little children wanted to hold the tail of the whale.

At the end, the town gave a prize for the best costumes. We didn't win, but we were proud of our work, and we had a lot of fun.`,
      grammar: ["past-simple-irregular", "verbs-followed-by-to", "subordinating-conjunctions"],
      names: ["Leo"],
      questions: [
        [
          ["What did the class want to be in the parade?", "全班想在游行中扮成什么？"],
          ["The sea", "大海"],
          [
            ["A forest", "森林"],
            ["A zoo", "动物园"],
          ],
          ['The passage says: "We wanted to be the sea, so everybody chose a sea animal."', "全班扮成大海，每人选一种海洋动物。"],
        ],
        [
          ["Why did Leo need help?", "为什么里奥需要帮忙？"],
          ["His whale costume was too big", "他的鲸鱼服装太大了"],
          [
            ["He was ill", "他生病了"],
            ["He couldn't see", "他看不见"],
          ],
          [
            'The passage says: "His costume was so big that he needed two other students to help him carry it."',
            "鲸鱼服装太大，需要两个同学帮他抬。",
          ],
        ],
        [
          ["How did the class feel at the end?", "最后全班感觉如何？"],
          ["Proud of their work", "为自己的作品自豪"],
          [
            ["Upset because they didn't win", "因为没赢而难过"],
            ["Jealous of the winners", "嫉妒获奖者"],
          ],
          ['The passage says: "We didn\'t win, but we were proud of our work."', "虽然没获奖，但他们为自己的作品感到自豪。"],
        ],
      ],
    }),
    passage({
      id: "a2-festivals-mooncakes-and-the-moon",
      title: ["Mooncakes and the Moon", "月饼与月亮"],
      body: `The Mid-Autumn Festival comes on the fifteenth day of the eighth month of the Chinese year, in September or October. On this night the moon is full, and people say it is the biggest moon of the year.

There is an old story about this festival. A long time ago, a woman called Chang'e drank something special and flew up to the moon. She still lives there today with a white rabbit. On the night of the festival, people look up at the moon and think about her, and about the people they love who are far from home.

The most important food of the festival is the mooncake. Mooncakes are small and heavy, and they are sweet. Some have an egg in the center, like a small yellow moon. Families buy mooncakes and give them to friends, neighbors and colleagues.

My family always has dinner together on this night. Then we sit outside with tea and mooncakes and look at the moon. Last year my brother was studying abroad, so he couldn't come home. But at nine o'clock we all looked at the moon at the same time, and he looked at it too. It felt like he was with us.`,
      grammar: ["past-continuous", "comparatives-and-superlatives", "could-for-past-ability"],
      names: ["Mid-Autumn", "Chinese", "Chang'e"],
      questions: [
        [
          ["Who lives on the moon in the old story?", "古老的故事里谁住在月亮上？"],
          ["Chang'e and a white rabbit", "嫦娥和一只白兔"],
          [
            ["An old man and his dog", "一位老人和他的狗"],
            ["A family of birds", "一家鸟"],
          ],
          ['The passage says Chang\'e "still lives there today with a white rabbit."', "传说嫦娥和玉兔住在月亮上。"],
        ],
        [
          ["What do families do with mooncakes?", "家人用月饼做什么？"],
          ["Give them to friends, neighbors and colleagues", "送给朋友、邻居和同事"],
          [
            ["Sell them in the market", "在市场上卖"],
            ["Keep them for the next year", "留到明年"],
          ],
          [
            'The passage says: "Families buy boxes of mooncakes and give them to friends, neighbors and colleagues."',
            "中秋节人们互相赠送月饼。",
          ],
        ],
        [
          ["How did the family feel close to the brother last year?", "去年一家人怎样感到和哥哥在一起？"],
          ["They all looked at the moon at the same time", "大家在同一时间看月亮"],
          [
            ["He came home for dinner", "他回家吃了晚饭"],
            ["They sent him mooncakes", "他们给他寄了月饼"],
          ],
          [
            'The passage says: "at nine o\'clock we all looked at the moon at the same time, and he looked at it too."',
            "哥哥回不了家，但大家同时看月亮，感觉他就在身边。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-festivals-birthdays-around-the-world",
      title: ["Birthdays Around the World", "世界各地的生日"],
      body: `Everybody has a birthday, but people celebrate it in different ways around the world.

In China, many people eat long noodles on their birthday. The long noodles are a wish for a long life, so you should not cut them! Some families also eat eggs, because eggs mean a new start.

In Mexico, children often have a piñata at their party. A piñata is a paper animal full of candy. It is up in a tree, and the children try to hit it and break it. When it breaks, the candy falls on the ground, and everybody runs to get it.

In Germany, a child often doesn't have to do any jobs at home on their birthday, and there is cake for breakfast. In Canada, some families put butter on the nose of the birthday child for good luck.

In Korea, when a baby is one year old, the family has a big party. They put things on a table in front of the baby, like money, a pencil and a ball. People say that the thing the baby picks up shows its future job.

What do you do on your birthday? Is it the same as your friends?`,
      grammar: ["should-and-must", "have-to", "subordinating-conjunctions"],
      names: ["China", "Mexico", "Germany", "Canada", "Korea", "piñata"],
      glossed: ["piñata"],
      questions: [
        [
          ["Why do people in China eat long noodles on their birthday?", "为什么中国人生日吃长面条？"],
          ["They are a wish for a long life", "它们代表长寿的愿望"],
          [
            ["They are cheap", "它们很便宜"],
            ["They are easy to cook", "它们容易做"],
          ],
          [
            'The passage says: "The long noodles are a wish for a long life, so you should not cut them!"',
            "长寿面代表长寿，所以不能切断。",
          ],
        ],
        [
          ["What happens when the piñata breaks?", "皮纳塔被打破时会怎样？"],
          ["The candy falls, and everybody runs to get it", "糖果掉下来，大家跑去捡"],
          [
            ["The party ends", "派对结束"],
            ["The children cry", "孩子们哭了"],
          ],
          [
            'The passage says: "When it breaks, the candy falls on the ground, and everybody runs to get it."',
            "皮纳塔破了，糖果掉在地上，孩子们都跑去抢。",
          ],
        ],
        [
          ["In Korea, what does the thing a baby picks up show?", "在韩国，宝宝抓到的东西代表什么？"],
          ["Its future job", "它将来的职业"],
          [
            ["Its favorite food", "它最喜欢的食物"],
            ["How many friends it will have", "它会有多少朋友"],
          ],
          ['The passage says: "People say that the thing the baby picks up shows its future job."', "这是韩国的周岁抓周习俗。"],
        ],
      ],
    }),
    passage({
      id: "a2-festivals-the-invitation-that-got-lost",
      title: ["The Invitation That Got Lost", "丢失的请柬"],
      body: `Last spring, Mr. and Mrs. Brown had a big wedding anniversary: fifty years together. Their daughter Kate wanted to have a big party for them, so she sent invitations to all their old friends.

Two weeks later, almost everybody had answered. Only one person didn't reply: Mr. Brown's best friend from school, George. They didn't see each other for many years, and Mr. Brown really wanted him to come.

Kate called George's old number, but there was no answer. She was upset. "Maybe he doesn't want to come," she thought.

On the day of the party, all the guests were in the garden. Mr. Brown was happy, but Kate could see he was looking at the gate all the time.

Then, at four o'clock, an old man walked through the gate with an envelope in his hand. It was George! "I'm so sorry," he said. "I moved to a new house last year. Your invitation went to my old address, and my old neighbor gave it to me only yesterday. I took the first train this morning!"

Mr. Brown hugged his old friend for a long time. Then George gave him a gift: a photo of the two of them at school, sixty years ago.`,
      grammar: ["past-continuous", "could-for-past-ability", "subordinating-conjunctions"],
      names: ["Mr", "Mrs", "Brown", "Brown's", "Kate", "George", "George's"],
      questions: [
        [
          ["Why did Kate have a party?", "凯特为什么办派对？"],
          ["For her parents' fiftieth wedding anniversary", "为了父母结婚五十周年"],
          [
            ["For her own birthday", "为了她自己的生日"],
            ["For George's new house", "为了乔治的新房子"],
          ],
          [
            'The passage says: "Mr. and Mrs. Brown had a big wedding anniversary: fifty years together."',
            "派对是为了庆祝布朗夫妇结婚五十周年。",
          ],
        ],
        [
          ["Why didn't George reply?", "乔治为什么没回复？"],
          ["The invitation went to his old address", "请柬寄到了他的旧地址"],
          [
            ["He didn't want to come", "他不想来"],
            ["He was ill", "他生病了"],
          ],
          [
            'George says: "Your invitation went to my old address, and my old neighbor gave it to me only yesterday."',
            "乔治搬了家，请柬寄到旧地址，昨天才拿到。",
          ],
        ],
        [
          ["What gift did George bring?", "乔治带了什么礼物？"],
          ["A photo of the two friends at school", "两人上学时的一张照片"],
          [
            ["A cake", "一个蛋糕"],
            ["A new watch", "一块新手表"],
          ],
          ['The passage says George gave him "a photo of the two of them at school, sixty years ago."', "礼物是六十年前两人在学校的合影。"],
        ],
      ],
    }),
  ],
};
