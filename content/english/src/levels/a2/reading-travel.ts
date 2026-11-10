// The reading unit of the A2 theme Travel and Holidays: trips, places to visit and plans, with going to and will.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "a2-words-holidays",
  "a2-words-places-to-visit",
  "a2-words-transport",
  "a2-words-future",
  "be-going-to",
  "will-for-the-future",
]);

/** readingTravel is the reading unit of the theme Travel and Holidays. */
export const readingTravel: ReadingUnitDef = {
  id: "a2-reading-travel",
  title: t("Travel and Holidays", "旅行和假期"),
  passages: [
    passage({
      id: "a2-travel-packing-for-a-trip",
      title: ["Packing for a Trip", "收拾行李"],
      body: `Next Saturday my family is going to fly to Thailand for a week. We are going to stay in a hotel near the beach, and we are going to visit a famous temple in the mountains.

Mom says I can take one suitcase and one small bag. So what am I going to pack?

The weather there is hot, so I'm going to take five T-shirts, two skirts and a hat. The evenings may be cooler, so I'm also going to pack a jacket.

In my small bag I'm going to put my passport, my phone, a book for the flight and some medicine, because I sometimes feel sick on planes. Dad says I must keep my passport with me all the time.

Last year I packed too much, and I couldn't close my suitcase. This year I'm going to pack less. I'll probably forget something, but it doesn't matter. We can buy it there!`,
      grammar: ["be-going-to", "will-for-the-future"],
      names: ["Thailand"],
      questions: [
        [
          ["Where is the family going to stay?", "这家人打算住在哪里？"],
          ["In a hotel near the beach", "海边的一家酒店"],
          [
            ["With friends in the city", "城里的朋友家"],
            ["In a temple in the mountains", "山里的寺庙"],
          ],
          ['The passage says: "We are going to stay in a hotel near the beach."', "他们要住在海边的酒店；山里的寺庙是要去参观的地方。"],
        ],
        [
          ["Why is the writer going to take some medicine?", "作者为什么要带药？"],
          ["The writer sometimes feels sick on planes", "作者有时坐飞机会不舒服"],
          [
            ["The writer has a cough", "作者咳嗽"],
            ["The hotel has no doctor", "酒店没有医生"],
          ],
          ['The passage says: "some medicine, because I sometimes feel sick on planes."', "because 后面说明原因：作者有时坐飞机会难受。"],
        ],
        [
          ["What happened last year?", "去年发生了什么？"],
          ["The writer packed too much", "作者带的东西太多了"],
          [
            ["The writer lost a passport", "作者丢了护照"],
            ["The writer missed the flight", "作者误了航班"],
          ],
          [
            'The passage says: "Last year I packed too much, and I couldn\'t close my suitcase."',
            "去年作者装得太多，箱子都合不上，所以今年要少带点。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-travel-the-night-ferry",
      title: ["The Night Ferry", "夜班渡轮"],
      body: `Last summer we took the night ferry from our city to an island far out in the sea. It left at nine o'clock in the evening and arrived at six the next morning.

We had a small room with four beds. There was a little window, and through it I could see the lights of the city getting smaller and smaller.

After dinner I went outside with Dad. The air was cold and wet, and the wind was strong. The sea was black, and there were millions of stars above us. Dad showed me some of the stars and told me their names.

At about twelve o'clock the ferry started to move up and down a lot. My little sister felt sick, and Mom gave her some medicine. I lay in my bed and listened to the sea. I couldn't sleep for a long time.

When I woke up, the sun was shining. The ferry was arriving at the island. From the window I could see green hills, white houses and a small beach. We were tired, but our holiday was starting.`,
      grammar: ["past-continuous", "past-simple-irregular"],
      questions: [
        [
          ["How long was the trip on the ferry?", "坐渡轮用了多长时间？"],
          ["About nine hours", "大约九个小时"],
          [
            ["About two hours", "大约两个小时"],
            ["Two days", "两天"],
          ],
          [
            'The passage says: "It left at nine o\'clock in the evening and arrived at six the next morning."',
            "从晚上九点到第二天早上六点，大约九个小时。",
          ],
        ],
        [
          ["What did Dad show the writer?", "爸爸给作者看了什么？"],
          ["The stars", "星星"],
          [
            ["The island", "那座岛"],
            ["Some fish in the sea", "海里的鱼"],
          ],
          ['The passage says: "Dad showed me some of the stars and told me their names."', "爸爸指给作者看星星，还说了它们的名字。"],
        ],
        [
          ["Who felt sick on the ferry?", "谁在渡轮上不舒服？"],
          ["The writer's little sister", "作者的妹妹"],
          [
            ["The writer", "作者"],
            ["Dad", "爸爸"],
          ],
          [
            'The passage says: "My little sister felt sick, and Mom gave her some medicine."',
            "是妹妹不舒服，妈妈给她吃了药；作者只是睡不着。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-travel-a-castle-on-the-coast",
      title: ["A Castle on the Coast", "海岸上的城堡"],
      body: `Hi Grandma,

We're on vacation in Scotland, and it's great! Today we visited an old castle on the coast. It is eight hundred years old, and it stands on high rocks above the ocean.

A guide took us around. She told us that a famous family lived there for three hundred years. Then we climbed the tower. There were a hundred and twenty stairs, and when we got to the end, my legs hurt. But the view was beautiful: the coast, the green fields and the blue sea.

Under the castle there is a cave. People say that the family hid their money there. We looked, but we didn't find any!

Tomorrow we're going to take a boat to a small island to see the birds. It's going to be windy, so Mom is a bit worried. I'll show you all my photos when we get home.

Love,
Nina`,
      grammar: ["be-going-to", "past-simple-irregular"],
      names: ["Scotland", "Nina"],
      questions: [
        [
          ["How old is the castle?", "这座城堡有多少年历史？"],
          ["Eight hundred years", "八百年"],
          [
            ["Three hundred years", "三百年"],
            ["A hundred and twenty years", "一百二十年"],
          ],
          ['Nina writes: "It is eight hundred years old."', "城堡有八百年历史；三百年是那个家族住在那里的时间，一百二十是台阶数。"],
        ],
        [
          ["What is under the castle?", "城堡下面有什么？"],
          ["A cave", "一个山洞"],
          [
            ["A hotel", "一家酒店"],
            ["A beach", "一片海滩"],
          ],
          ['Nina writes: "Under the castle there is a cave."', "城堡下面有个山洞，据说那家人把钱藏在里面。"],
        ],
        [
          ["What are they going to do tomorrow?", "他们明天打算做什么？"],
          ["Take a boat to an island to see the birds", "坐船去一座小岛看鸟"],
          [
            ["Climb the tower again", "再爬一次塔"],
            ["Fly home", "坐飞机回家"],
          ],
          [
            'Nina writes: "Tomorrow we\'re going to take a boat to a small island to see the birds."',
            "be going to 表示已经定好的计划：明天坐船去小岛看鸟。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-travel-lost-luggage",
      title: ["Lost Luggage", "丢失的行李"],
      body: `When Mr. and Mrs. Sato arrived in Rome for their vacation, they waited for their suitcases at the airport. One suitcase came, but the second one didn't. They waited for an hour. Nothing.

Mr. Sato went to the luggage desk. A woman checked her computer. "I'm sorry," she said. "Your suitcase is in Paris. It missed your flight. It will probably arrive tomorrow, and we'll bring it to your hotel."

The problem was that all of Mrs. Sato's clothes were in that suitcase. That night she had only the dress she was wearing, so she bought a T-shirt and some things for the night at a shop near the hotel.

The next day the suitcase didn't come, and the day after that there was still no suitcase. Mrs. Sato bought more clothes. "Maybe it's on vacation too," Mr. Sato laughed. His wife didn't laugh.

On the fifth day, a man from the airport came to the hotel with the suitcase. It was a bit dirty, but everything was in it. Now, when Mrs. Sato travels, she always puts some of her clothes in both suitcases.`,
      grammar: ["will-for-the-future", "past-simple-irregular"],
      names: ["Mr", "Mrs", "Sato", "Sato's", "Rome", "Paris"],
      questions: [
        [
          ["Where was the second suitcase?", "第二个箱子在哪里？"],
          ["In Paris", "在巴黎"],
          [
            ["In Rome", "在罗马"],
            ["At the hotel", "在酒店"],
          ],
          ['The woman says: "Your suitcase is in Paris. It missed your flight."', "箱子没赶上航班，还在巴黎。"],
        ],
        [
          ["What did Mrs. Sato have to do?", "佐藤太太不得不做什么？"],
          ["Buy clothes", "买衣服"],
          [
            ["Wear her husband's clothes", "穿丈夫的衣服"],
            ["Go home early", "提前回家"],
          ],
          [
            'The passage says she "bought a T-shirt and some things for the night" and later "bought more clothes".',
            "她的衣服都在那个箱子里，只好去买衣服。",
          ],
        ],
        [
          ["When did the suitcase arrive?", "箱子什么时候到的？"],
          ["On the fifth day", "第五天"],
          [
            ["The next day", "第二天"],
            ["It never arrived", "一直没到"],
          ],
          [
            'The passage says: "On the fifth day, a man from the airport came to the hotel with the suitcase."',
            "工作人员说“明天大概会到”，结果第五天才送来。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-travel-our-flight-was-late",
      title: ["Our Flight Was Late", "我们的航班晚点了"],
      body: `Last month I flew with my dad to visit my grandparents in Chengdu. Our flight was at ten in the morning, so we got to the airport at eight.

At the gate we saw a bad word on the board: "Delayed." There was a storm, and no planes could leave. "It will probably be an hour," said a woman at the desk.

It wasn't an hour. It was six hours! The airport was full of passengers. Some people were angry and shouted at the woman at the desk. A baby cried for a long time. There were no free seats, so Dad and I sat on the floor.

But we had a good time. We played cards, read our books and ate noodles at a little restaurant. Dad told me stories about the trips he took when he was young. I learned more about my dad that day than in the whole year.

At four o'clock we finally got on the plane. We arrived late at night, but Grandma was waiting at the airport with hot dumplings.`,
      grammar: ["will-for-the-future", "past-simple-irregular", "could-for-past-ability"],
      names: ["Chengdu"],
      questions: [
        [
          ["Why was the flight delayed?", "航班为什么晚点？"],
          ["There was a storm", "有暴风雨"],
          [
            ["The plane was broken", "飞机坏了"],
            ["The passengers were late", "乘客迟到了"],
          ],
          ['The passage says: "There was a storm, and no planes could leave."', "因为暴风雨，所有飞机都不能起飞。"],
        ],
        [
          ["How long was the delay?", "航班晚点了多久？"],
          ["Six hours", "六个小时"],
          [
            ["One hour", "一个小时"],
            ["Two days", "两天"],
          ],
          ['The passage says: "It wasn\'t an hour. It was six hours!"', "工作人员说大概一小时，结果晚了六个小时。"],
        ],
        [
          ["What did the writer and Dad do while they waited?", "等待时作者和爸爸做了什么？"],
          ["Played cards, read and ate noodles", "打牌、看书、吃面条"],
          [
            ["Slept in a hotel", "在酒店睡觉"],
            ["Shouted at the woman at the desk", "对柜台的工作人员大喊"],
          ],
          [
            'The passage says: "We played cards, read our books and ate noodles at a little restaurant."',
            "大喊的是别的乘客；他们打牌、看书、吃面，过得很开心。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-travel-a-tour-of-the-temple",
      title: ["A Tour of the Temple", "参观寺庙"],
      body: `Good morning, everyone, and thank you for coming with us today. My name is Li Ming, and I'm going to be your guide today.

This temple is very old. People built it about nine hundred years ago. It is one of the most famous temples in the country, and every year a lot of tourists come to see it.

First, we're going to walk through the big gate and up the stairs to the biggest building. There you will see a huge statue. It is taller than a house!

Please remember a few rules. You must take off your hat, and you must speak quietly. You must not take photos in the big building, but you can take photos outside.

After that, we're going to walk to the garden at the back. There is a small pond with old fish in it. Some of them are fifty years old!

Our visit will take about an hour. At the end you can buy postcards and souvenirs at the shop near the gate. Are there any questions? No? Good. Please follow me.`,
      grammar: ["be-going-to", "will-for-the-future", "should-and-must"],
      names: ["Li", "Ming"],
      questions: [
        [
          ["When did people build the temple?", "人们什么时候建的这座寺庙？"],
          ["About nine hundred years ago", "大约九百年前"],
          [
            ["About fifty years ago", "大约五十年前"],
            ["About a hundred years ago", "大约一百年前"],
          ],
          ['The guide says: "People built it about nine hundred years ago."', "导游说寺庙大约建于九百年前；五十年是池塘里老鱼的年龄。"],
        ],
        [
          ["Where can the tourists take photos?", "游客可以在哪里拍照？"],
          ["Outside", "室外"],
          [
            ["In the big building", "在大殿里"],
            ["Nowhere", "哪里都不行"],
          ],
          [
            'The guide says: "You must not take photos in the big building, but you can take photos outside."',
            "大殿里不能拍照，室外可以。",
          ],
        ],
        [
          ["What is in the pond in the garden?", "花园的池塘里有什么？"],
          ["Old fish", "年老的鱼"],
          [
            ["A statue", "一座雕像"],
            ["Turtles", "乌龟"],
          ],
          ['The guide says: "There is a small pond with old fish in it."', "池塘里有老鱼，有的已经五十岁了；雕像在大殿里。"],
        ],
      ],
    }),
    passage({
      id: "a2-travel-postcards-from-the-desert",
      title: ["Postcards from the Desert", "来自沙漠的明信片"],
      body: `Monday

Hi Sam! I'm in the desert in Morocco. It's very hot in the day: forty degrees! We are traveling with a guide and a group of tourists. Tomorrow we're going to sleep in tents in the sand.
Kate

Wednesday

Hi again! Last night was the best night of the trip. In the day the desert was hot, but at night it was very cold, and I wore all my clothes! There were no lights, so we could see millions of stars. Our guide told us their names in Arabic.
Kate

Friday

Hi Sam, this is my last postcard. This morning we got up at five to see the sunrise. The sand turned red, then orange, then yellow. Then we drove to a green valley with water and trees. It looked like a garden in the desert. We're going to fly home on Sunday. I'll show you my photos!
Kate`,
      grammar: ["be-going-to", "will-for-the-future", "could-for-past-ability"],
      names: ["Sam", "Morocco", "Kate", "Arabic"],
      questions: [
        [
          ["How hot is the desert in the day?", "沙漠白天有多热？"],
          ["Forty degrees", "四十度"],
          [
            ["Twenty degrees", "二十度"],
            ["Thirty degrees", "三十度"],
          ],
          ['Kate writes: "It\'s very hot in the day: forty degrees!"', "凯特在星期一的明信片里写白天有四十度。"],
        ],
        [
          ["Why could they see millions of stars?", "他们为什么能看到无数颗星星？"],
          ["There were no lights", "那里没有灯光"],
          [
            ["The guide had a special light", "导游有一盏特别的灯"],
            ["It was very hot", "天气很热"],
          ],
          ['Kate writes: "There were no lights, so we could see millions of stars."', "so 前面是原因：沙漠里没有灯光。"],
        ],
        [
          ["What did they do on Friday morning?", "星期五早上他们做了什么？"],
          ["Got up at five to see the sunrise", "五点起床看日出"],
          [
            ["Slept in tents in the sand", "在沙地上的帐篷里睡觉"],
            ["Flew home", "坐飞机回家"],
          ],
          ['Kate writes: "This morning we got up at five to see the sunrise."', "星期五早上他们五点起床看日出；他们星期天才飞回家。"],
        ],
      ],
    }),
    passage({
      id: "a2-travel-travel-in-the-future",
      title: ["Travel in the Future", "未来的出行"],
      body: `How will we travel in the future? No one knows for sure, but here are some ideas.

First, cars will probably drive themselves. You will tell your car where you want to go, and then you will read, sleep or watch a movie. There will probably be less traffic, and the roads will be safer.

Second, trains will be much faster. Some trains may go faster than planes. You will have breakfast in one city and lunch in a city on the other side of the country.

Third, more people will travel to space. Today only a few people have been there, but perhaps someday there will be hotels on the moon. You will fly there in a rocket, look at the earth from your window and jump very high, because jumping is easy on the moon.

But some things will stay the same. People will still want to see new places, meet new people and come home with stories. And perhaps they will still buy postcards for their friends.`,
      grammar: ["will-for-the-future"],
      questions: [
        [
          ["What will people do in cars that drive themselves?", "在自动驾驶的车里人们会做什么？"],
          ["Read, sleep or watch a movie", "看书、睡觉或看电影"],
          [
            ["Drive faster", "开得更快"],
            ["Fix the car", "修车"],
          ],
          ['The passage says: "you will read, sleep or watch a movie."', "车会自己开，人可以看书、睡觉或看电影。"],
        ],
        [
          ["What may there be on the moon someday?", "将来月球上可能会有什么？"],
          ["Hotels", "酒店"],
          [
            ["Trains", "火车"],
            ["Farms", "农场"],
          ],
          ['The passage says: "perhaps someday there will be hotels on the moon."', "文中说将来月球上也许会有酒店。"],
        ],
        [
          ["What will stay the same?", "什么不会变？"],
          ["People will still want to see new places and meet new people", "人们仍然想去新的地方、认识新的人"],
          [
            ["Cars will still need drivers", "汽车仍然需要司机"],
            ["Trains will still be slow", "火车仍然很慢"],
          ],
          [
            'The passage says: "People will still want to see new places, meet new people and come home with stories."',
            "交通方式会变，但人们想看新地方、认识新朋友的愿望不会变。",
          ],
        ],
      ],
    }),
  ],
};
