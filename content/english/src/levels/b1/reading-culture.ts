// The reading unit of the B1 theme Travel and Culture: customs, hostels, food, living abroad, languages and travel problems.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const articles = "articles-in-general-and-specific";

const passage = passageMaker(readingWords, [
  "b1-words-culture",
  "b1-words-travel-2",
  "b1-words-adventure",
  "b1-words-food-culture",
  "b1-words-nations",
  "b1-words-travel-problems",
  "b1-words-describing-places-2",
  articles,
]);

/** readingCulture is the reading unit of the theme Travel and Culture. */
export const readingCulture: ReadingUnitDef = {
  id: "b1-reading-culture",
  title: t("Travel and Culture", "旅行与文化"),
  passages: [
    passage({
      id: "b1-culture-table-manners-around-the-world",
      title: ["Table Manners Around the World", "世界各地的餐桌礼仪"],
      body: `Good manners at the table seem natural to us, because we learned them as children. But when we travel, we soon discover that the rules change from one country to another. Something that is polite in one culture can be rude in the next.

Take noise, for example. In many Western countries, children are told never to make noise when they eat. In Japan, however, people often make a loud sound when they eat noodles. It shows that the food is delicious, and nobody thinks it is rude.

Finishing your plate is another custom that is different from place to place. In some countries, an empty plate tells the host that you enjoyed the meal. In parts of China, though, a guest may leave a little food, because an empty plate can mean that the host did not serve enough, and the host will quickly bring more.

Hands matter too. In India and parts of the Middle East, many people eat with their fingers, but only with the right hand. In Thailand, people use a fork and a spoon, but the fork is used only to push food onto the spoon. Putting the fork in your mouth looks rude there.

Then there is the question of when to start. In Korea, younger people wait until the oldest person at the table begins to eat. In France, the host often says "Bon appétit" before anyone starts.

So what should you do when you travel? The best advice is simple: watch the local people and do what they do. If you are not sure, ask. Most hosts are happy to explain their customs, and they will respect a foreigner who tries, even if he or she makes mistakes.`,
      grammar: [articles],
      names: ["Western", "Japan", "China", "India", "Middle", "East", "Thailand", "Korea", "France", "Bon", "appétit"],
      questions: [
        [
          ["Why do people in Japan often make noise when they eat noodles?", "为什么日本人吃面条时常常发出声音？"],
          ["It shows that the food is delicious", "这表示食物很美味"],
          [
            ["It shows that the food is too hot", "这表示食物太烫了"],
            ["It is a way to ask for more food", "这是要求再添食物的方式"],
          ],
          [
            '"In Japan, however, people often make a loud sound when they eat noodles. It shows that the food is delicious."',
            "在日本，吃面出声表示好吃，并不被认为失礼。",
          ],
        ],
        [
          ["Why might a guest in parts of China leave a little food?", "为什么在中国一些地方客人可能会剩一点食物？"],
          ["An empty plate can mean the host did not serve enough", "空盘子可能表示主人准备的不够"],
          [
            ["The food is not delicious", "食物不好吃"],
            ["Guests must never finish a meal", "客人绝不能吃完一顿饭"],
          ],
          [
            '"An empty plate can mean that the host did not serve enough, and the host will quickly bring more."',
            "在中国一些地方，盘子吃空可能意味着主人没准备够，主人会马上再添菜。",
          ],
        ],
        [
          ["What is the writer's advice for travelers?", "作者给旅行者的建议是什么？"],
          ["Watch the local people and do what they do", "观察当地人，照他们的样子做"],
          [
            ["Always eat with your fingers", "总是用手抓着吃"],
            ["Follow the manners of your own country", "遵守自己国家的礼仪"],
          ],
          [
            '"The best advice is simple: watch the local people and do what they do. If you are not sure, ask."',
            "入乡随俗：观察当地人怎么做，不确定就问。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-culture-a-night-in-a-mountain-hostel",
      title: ["A Night in a Mountain Hostel", "山间旅舍的一夜"],
      body: `When I planned my trip to the mountains of Nepal, I made a reservation at a hotel in the capital and at a hostel in every village on my route. But I didn't expect that the best night of the trip would be in a place without a reservation at all.

On the fourth day, the weather changed suddenly. A storm was coming, and the village where I had a reservation was still three hours away. My guide, a calm young man called Pemba, said that we should stop at a small hostel on the path. "It isn't in the guidebook," he told me, "but the family is kind."

The hostel was a stone house with six beds in one room. The owner, an old woman with a warm smile, didn't speak English, and I didn't speak Nepali, so Pemba translated for us. She gave us hot tea with milk and salt, which I had never tried before. I didn't like it at first, but after an hour in the cold, it was exactly right.

There were four other guests: two students from Germany, a husband and wife from Argentina and an old man who was walking to a temple. That evening we all sat around the fire in the kitchen. The woman cooked rice, beans and vegetables for everyone, and we shared stories in three languages, with a lot of laughing and many hand signs.

Later, the storm passed, and I went outside. I have never seen so many stars. The scenery that I had admired during the day was hidden by the dark, but the sky was breathtaking.

In the morning, the woman would take only a few dollars. I have stayed in many expensive hotels since then, but not one of them has been as unforgettable as that small stone house.`,
      grammar: [articles, "present-perfect-or-past-simple"],
      names: ["Nepal", "Nepali", "Pemba", "Germany", "Argentina"],
      questions: [
        [
          ["Why did the writer stop at the small hostel?", "作者为什么在那家小旅舍停下来？"],
          ["A storm was coming and the village with the reservation was too far", "暴风雨要来了，预订的村子还太远"],
          [
            ["It was in the guidebook", "它在旅行指南上"],
            ["The hotel in the capital was full", "首都的酒店满了"],
          ],
          [
            '"A storm was coming, and the village where I had a reservation was still three hours away." The hostel was not in the guidebook.',
            "暴风雨将至，预订的村子还要走三小时，所以向导建议在路边小旅舍停下。",
          ],
        ],
        [
          ["How did the writer and the owner understand each other?", "作者和旅舍主人是怎样交流的？"],
          ["The guide translated for them", "向导为他们翻译"],
          [
            ["The owner spoke good English", "主人英语说得很好"],
            ["The writer spoke Nepali", "作者会说尼泊尔语"],
          ],
          [
            "The owner didn't speak English and the writer didn't speak Nepali, \"so Pemba translated for us\".",
            "两人语言不通，由向导彭巴翻译。",
          ],
        ],
        [
          ["Why was the hostel unforgettable for the writer?", "为什么那家旅舍让作者难以忘怀？"],
          ["Because of the kind owner, the shared evening and the stars", "因为善良的主人、共度的夜晚和满天繁星"],
          [
            ["Because it was the most expensive place on the trip", "因为它是旅途中最贵的地方"],
            ["Because the beds were very comfortable", "因为床非常舒服"],
          ],
          [
            "The writer remembers the hot tea, the stories by the fire and the breathtaking sky. The owner took only a few dollars.",
            "热茶、炉火边的故事和壮丽的星空让作者难忘，而主人只收了几美元。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-culture-learning-to-use-chopsticks",
      title: ["Learning to Use Chopsticks", "学用筷子"],
      body: `About a third of the people in the world eat with chopsticks every day. If you did not grow up with them, they can seem impossible at first. Here is how to learn, and a few customs that everyone who visits East Asia should know.

First, take one of the chopsticks and hold it still. Put it in the space between your thumb and your first finger, and let it rest on your fourth finger. It should not move at all. Then hold the other one like a pencil, between your thumb, your first finger and your second finger. Only this second one moves. Open and close the two ends, like the beak of a bird, and keep the ends at the same level.

Practice with large, dry things first, like pieces of bread or cookies, and then move to rice and noodles. Most people can eat a whole meal after a week of practice. Children in China and Japan often start with special chopsticks that are connected at the top.

Customs matter as much as skill. Never stand your chopsticks up in a bowl of rice: in some countries, this is done only for someone who has died, and it makes people sad. Don't point at people with your chopsticks, and don't use them to pass food to the chopsticks of another person. When you finish, put them together on the table or on the side of your plate.

There are also differences between countries. Chinese chopsticks are long and usually made of wood or bamboo. Japanese ones are shorter, with sharp ends, which help with fish. In Korea, chopsticks are often made of metal and are thin.

So the next time you go to a Chinese or Japanese restaurant, don't ask for a fork. Ask the waiter for chopsticks, and enjoy the adventure.`,
      grammar: [articles],
      names: ["East", "Asia", "China", "Japan", "Korea", "Chinese", "Japanese"],
      glossed: ["thumb"],
      questions: [
        [
          ["How many of the chopsticks move when you eat?", "吃饭时有几根筷子在动？"],
          ["Only one, the one held like a pencil", "只有一根，就是像握铅笔那样握着的那根"],
          [
            ["Only the one that rests on your fourth finger", "只有搁在无名指上的那根"],
            ["Both of them equally", "两根同样地动"],
          ],
          [
            'Hold the first chopstick still: "It should not move at all." Then hold the other one like a pencil: "Only this second one moves."',
            "搁在无名指上的那根要固定不动，只有像握铅笔那样握着的那根移动。",
          ],
        ],
        [
          ["Why should you never stand chopsticks up in a bowl of rice?", "为什么绝不能把筷子竖插在米饭里？"],
          ["It is done only for someone who has died", "这只在有人去世时才这样做"],
          [
            ["The chopsticks may break", "筷子可能会断"],
            ["It means you want more rice", "这表示你还想要米饭"],
          ],
          [
            'In some countries this "is done only for someone who has died, and it makes people sad".',
            "在一些国家，只有祭奠逝者时才把筷子竖插在饭里，所以吃饭时这样做会让人难过。",
          ],
        ],
        [
          ["How are Korean chopsticks different?", "韩国的筷子有什么不同？"],
          ["They are often made of metal and are thin", "它们常用金属制成，而且很细"],
          [
            ["They are long and made of bamboo", "它们很长，用竹子做"],
            ["They are short with sharp ends for fish", "它们很短，头很尖，方便吃鱼"],
          ],
          [
            '"In Korea, chopsticks are often made of metal and are thin." Long bamboo ones are Chinese; short sharp ones are Japanese.',
            "韩国筷子多为细细的金属筷；长竹筷是中国的，短而尖的是日本的。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-culture-homesick-in-a-new-country",
      title: ["Homesick in a New Country", "在新的国家想家"],
      body: `When Li Wei arrived in Canada to study engineering, he was excited. Everything was new: the huge supermarkets, the friendly people, the vast lakes and forests. He sent photos to his parents every day. "It's like an adventure," he told them.

After about two months, the excited feeling disappeared. The weather became cold and dark. The food tasted different, and he couldn't find the ingredients to cook the dishes he loved. In class he understood the lecturers, but when his classmates chatted and told jokes, they spoke too fast, and he couldn't follow. He started to stay in his room in the evenings, watching videos from home. He felt homesick and lonely.

What happened to Li Wei is very normal. People who study the experience of moving abroad describe four stages. First comes the "honeymoon", when everything is exciting. Then comes culture shock, when the differences become hard and you miss home. Slowly, you learn the customs and the language, and you begin to feel more at home. Finally, the new country starts to feel like a second home.

Li Wei found his way out with help. A counselor at the university told him about a club for international students. There he met students from many nations who felt the same way. He also found an Asian supermarket across the city, and he started to cook for his new friends every Sunday. A Canadian classmate invited him to go skating, and he fell over many times, but he laughed.

Now, three years later, Li Wei is fluent and has friends from four continents. "I still miss my family," he says, "and the food of my mother. But I don't feel like a foreigner any more."`,
      grammar: [articles],
      names: ["Li", "Wei", "Canada", "Asian", "Canadian"],
      glossed: ["stages", "honeymoon", "shock"],
      questions: [
        [
          ["How did Li Wei feel after about two months?", "大约两个月后李伟感觉怎样？"],
          ["Homesick and lonely", "想家而且孤独"],
          [
            ["Excited about everything", "对一切都很兴奋"],
            ["Comfortable and at home", "舒适自在"],
          ],
          [
            '"After about two months, the excited feeling disappeared." The cold, the food and the fast speech made him feel homesick and lonely.',
            "两个月后新鲜感消失，天气、食物和语言让他感到想家又孤独。",
          ],
        ],
        [
          ["What is culture shock, according to the passage?", "根据文章，什么是文化冲击？"],
          ["The stage when the differences become hard and you miss home", "差异让人难受、开始想家的阶段"],
          [
            ["The first stage, when everything is exciting", "一切都很新鲜的第一阶段"],
            ["The last stage, when the country feels like home", "新国家像家一样的最后阶段"],
          ],
          [
            'After the honeymoon "comes culture shock, when the differences become hard and you miss home".',
            "文化冲击是继“蜜月期”之后的第二阶段，这时差异让人疲惫、思念家乡。",
          ],
        ],
        [
          ["What helped Li Wei feel better?", "什么帮助李伟感觉好起来？"],
          ["A club for international students and cooking for friends", "国际学生社团和给朋友们做饭"],
          [
            ["Staying in his room and watching videos", "待在房间里看视频"],
            ["Going back to his country for a year", "回国待了一年"],
          ],
          [
            "A counselor told him about a club for international students, and he started to cook for his new friends every Sunday.",
            "顾问介绍他加入国际学生社团，他还每周日给新朋友们做饭。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-culture-the-festival-i-didnt-understand",
      title: ["The Festival I Didn't Understand", "我没看懂的节日"],
      body: `I arrived in the small Spanish town of Buñol on a hot morning at the end of August. I had read about a festival there in a guidebook, but only one sentence: "On the last Wednesday of August, the town has a famous festival." I thought it would be music and dancing. I was wrong.

At ten o'clock the town square was full of people in old white T-shirts and glasses for swimming. Shop owners were putting plastic on their windows. I asked a young woman next to me what was happening. She laughed. "You don't know? It's La Tomatina! Take off your watch."

At eleven, a loud sound came from the other side of the square, and big farm machines drove slowly into it. On the back of each machine there were thousands of tomatoes. People on the machines started throwing them into the crowd, and then everybody in the square started throwing them at everybody else. For one hour, the town became a river of red. I was hit in the face, on the back and on the head. Tomato juice was in my ears and my hair. I couldn't stop laughing.

At twelve another sound came, and everybody stopped at once. That is a rule of the festival. Then firefighters washed the streets with water, and people went down to the river to wash themselves.

Later I learned the history. In 1945 some young people started throwing vegetables at each other during a parade, and the next year they did it again. The town banned it for some years, but people loved it, and now the whole country celebrates it.

I still don't really understand why people throw tomatoes. But I know that it was one of the happiest mornings of my life.`,
      grammar: [articles],
      names: ["Spanish", "Buñol", "August", "La", "Tomatina"],
      questions: [
        [
          ["What did the writer expect the festival to be?", "作者原以为这个节日是什么样的？"],
          ["Music and dancing", "音乐和舞蹈"],
          [
            ["A tomato fight", "番茄大战"],
            ["A swimming race in the river", "河里的游泳比赛"],
          ],
          [
            '"I thought it would be music and dancing. I was wrong." The guidebook gave only one sentence.',
            "旅行指南只写了一句话，作者以为是音乐和舞蹈，结果完全不是。",
          ],
        ],
        [
          ["What happened at twelve o'clock?", "十二点发生了什么？"],
          ["Everybody stopped throwing tomatoes", "大家都停止扔番茄"],
          [
            ["The farm machines arrived in the square", "农用车开进了广场"],
            ["The festival began", "节日开始了"],
          ],
          [
            '"At twelve another sound came, and everybody stopped at once. That is a rule of the festival."',
            "十二点信号一响，大家立刻停手，这是节日的规矩；农用车是十一点到的。",
          ],
        ],
        [
          ["How did the festival begin, according to the history?", "根据历史，这个节日是怎样开始的？"],
          ["Young people threw vegetables during a parade in 1945", "1945年一些年轻人在游行时互扔蔬菜"],
          [
            ["The government created it for tourists", "政府为游客创办了它"],
            ["Farmers had too many tomatoes one year", "某一年农民的番茄太多了"],
          ],
          [
            '"In 1945 some young people started throwing vegetables at each other during a parade, and the next year they did it again."',
            "1945年年轻人在游行中用蔬菜打闹，第二年又来了一次，后来成了全国性的节日。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-culture-bilingual-families",
      title: ["Bilingual Families", "双语家庭"],
      body: `In the Torres family, breakfast happens in two languages. The father, Diego, speaks Spanish to the children. The mother, Hannah, speaks English. The children, who are seven and nine, answer each parent in his or her language, and they switch between the two without thinking.

More than half of the people in the world speak at least two languages. In many regions, like parts of Africa and India, children grow up with three or four. Yet many parents still worry that learning two languages at once will be too hard for their children.

Research suggests that they don't need to worry. Bilingual children sometimes mix the two languages when they are small, and some of them start to speak a little later than other children. But by the age of five, most of them speak both languages well. Some studies even show that bilingual children are better at changing from one task to another, because their brains are used to switching.

Keeping two languages alive is not always easy. When children start school, the language of the school often becomes stronger, and they may stop using the language of the home. Diego says that his son went through a time when he did not want to speak Spanish. "He told me that Spanish was not cool," Diego laughs. "So we started watching Spanish football together, and we visited his grandparents in Mexico. Now he is proud of it."

Many teachers advise families to do the same thing every day. One parent, one language is a method that many families use. Another is to speak one language at home and the other outside. Books, songs and calls with relatives also help.

"It takes effort," says Hannah. "But our children can talk to all their grandparents. That is a gift for life."`,
      grammar: [articles],
      names: ["Torres", "Diego", "Spanish", "Hannah", "Africa", "India", "Mexico"],
      questions: [
        [
          ["How do the Torres children speak to their parents?", "托雷斯家的孩子怎样和父母说话？"],
          ["Each parent in his or her language", "用父母各自的语言回答各自"],
          [
            ["Only in English", "只说英语"],
            ["In a mix of three languages", "混用三种语言"],
          ],
          [
            '"The children answer each parent in his or her language": Spanish to their father and English to their mother.',
            "孩子们对父亲说西班牙语，对母亲说英语。",
          ],
        ],
        [
          ["What does research say about bilingual children?", "研究怎样看待双语儿童？"],
          ["By five most of them speak both languages well", "到五岁时大多数人两种语言都说得很好"],
          [
            ["They never learn either language well", "他们两种语言都学不好"],
            ["They always start to speak earlier", "他们总是更早开口说话"],
          ],
          [
            'Some start to speak a little later, "but by the age of five, most of them speak both languages well".',
            "双语儿童可能开口稍晚，但五岁时大多两种语言都很流利。",
          ],
        ],
        [
          ["What did Diego do when his son did not want to speak Spanish?", "儿子拒绝说西班牙语时，迭戈怎么做的？"],
          ["Watched Spanish football with him and visited Mexico", "和他一起看西班牙语足球比赛，并去墨西哥探亲"],
          [
            ["Stopped speaking Spanish at home", "在家不再说西班牙语"],
            ["Sent him to a Spanish school", "送他去西班牙语学校"],
          ],
          [
            '"So we started watching Spanish football together, and we visited his grandparents in Mexico. Now he is proud of it."',
            "迭戈用足球和探望祖父母让儿子重新喜欢上西班牙语。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-culture-when-the-flight-was-canceled",
      title: ["When the Flight Was Canceled", "航班被取消的时候"],
      body: `It was supposed to be a simple trip home. On a Friday evening in December, Sara Novak arrived at the airport two hours before her departure, with a backpack, a passport and a small gift for her mother. Then she looked at the screen. Next to her flight, there was one word: CANCELED.

A storm with heavy snow had closed the airport in the city where the plane was coming from. Within minutes, a long queue grew at the check-in desk. Sara waited for an hour and a half. When she finally got to the desk, the woman there looked tired. She told Sara that the next free seat was on Monday.

"Monday?" Sara said. "But my mother has her birthday on Sunday."

Sara didn't give up. She asked whether there was a flight to another city near her home. There was one, but it left the next morning from a different terminal and had a connection in Vienna. She took it. She was given a free night at a hotel near the airport, but the bus to the hotel was full, so she spent the night on a seat in the terminal, with her backpack under her head.

The next day, her first flight was delayed by two hours because of the weather, and she almost missed the connection. She ran through the airport in Vienna and was the last passenger to board. Her baggage did not make it. It arrived three days later.

But on Sunday afternoon, her mother opened the door and saw her. "I was tired, my clothes were dirty, and I had no gift," Sara remembers. "But my mother didn't care. She said that I was the best gift."`,
      grammar: [articles, "reported-speech"],
      names: ["Sara", "Novak", "Vienna", "December"],
      questions: [
        [
          ["Why was Sara's flight canceled?", "萨拉的航班为什么被取消了？"],
          ["A storm with heavy snow had closed another airport", "暴风雪导致另一个机场关闭"],
          [
            ["The pilot was ill", "飞行员生病了"],
            ["There were not enough passengers", "乘客不够"],
          ],
          [
            '"A storm with heavy snow had closed the airport in the city where the plane was coming from."',
            "飞机出发地的机场因暴风雪关闭，所以航班被取消。",
          ],
        ],
        [
          ["Where did Sara spend the night?", "萨拉在哪里过的夜？"],
          ["On a seat in the terminal", "航站楼里的座椅上"],
          [
            ["In a hotel near the airport", "机场附近的酒店"],
            ["At her mother's apartment", "她妈妈的公寓"],
          ],
          [
            'She was given a free night at a hotel, "but the bus to the hotel was full, so she spent the night on a seat in the terminal".',
            "她获得了免费住酒店的机会，但去酒店的大巴满了，只好在航站楼的座椅上过夜。",
          ],
        ],
        [
          ["What did Sara's mother say when Sara arrived?", "萨拉到家时妈妈说了什么？"],
          ["That Sara was the best gift", "萨拉本人就是最好的礼物"],
          [
            ["That Sara should have stayed at home", "萨拉应该留在家里"],
            ["That the gift was too small", "礼物太小了"],
          ],
          [
            'Reported speech: "She said that I was the best gift." Sara had no gift, but her mother didn\'t care.',
            "间接引语：妈妈说女儿本人就是最好的礼物。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-culture-why-tipping-differs",
      title: ["Why Tipping Differs", "小费为什么各地不同"],
      body: `You have just finished a delicious meal in a restaurant abroad. The waiter brings the bill. Now comes a difficult question: should you leave a tip, and if so, how much? The answer depends a lot on where you are.

In the United States, leaving a tip is almost a rule. Customers usually add about a sixth or a fifth to the bill. This is because many waiters there receive a very low salary, and tips are a big part of their income. If you don't leave a tip, the waiter may think that the service was terrible, or that you are rude.

In much of Europe, things are different. Service is often part of the price, and waiters earn a normal salary. People may leave a few coins or pay a little more than the bill, for example 20 euros for a bill of 18, but nobody expects a big tip.

In Japan, leaving a tip is not part of the culture at all. Good service is seen as a normal part of the job, and a waiter may even run after you to return money you left on the table. In China, too, a tip is not expected in most restaurants, although some hotels for tourists now take it.

Why are the customs so different? Part of the answer is history and law, which decide how waiters are paid. Part of it is culture: in some places, a tip is a way to say thank you; in others, giving money for good service can feel rude, as if the waiter did good work only for money.

For people who travel, the best idea is to check before you go. A guidebook or a local friend can tell you what is normal. And if you are not sure, it is always polite to say thank you with a smile.`,
      grammar: [articles],
      names: ["United", "States", "Europe", "Japan", "China", "euros"],
      questions: [
        [
          ["Why do customers in the United States usually leave a tip?", "为什么美国的顾客通常给小费？"],
          ["Many waiters have a low salary, and tips are a big part of their income", "很多服务员工资低，小费是他们收入的重要部分"],
          [
            ["The law says that every customer must tip", "法律规定每个顾客都必须给小费"],
            ["The service is included in the price", "服务费已含在价格里"],
          ],
          [
            '"Many waiters there receive a very low salary, and tips are a big part of their income."',
            "在美国，服务员底薪很低，收入很大一部分来自小费。",
          ],
        ],
        [
          ["What may happen in Japan if you leave money on the table?", "在日本把钱留在桌上可能会怎样？"],
          ["The waiter may run after you to return it", "服务员可能会追上来把钱还给你"],
          [
            ["The waiter will thank you warmly", "服务员会热情地感谢你"],
            ["The waiter will think you are rude", "服务员会觉得你没礼貌"],
          ],
          [
            'In Japan "a waiter may even run after you to return money you left on the table", because leaving a tip is not part of the culture.',
            "日本没有给小费的习惯，服务员甚至会追出来把钱还给你。",
          ],
        ],
        [
          ["What does the writer advise travelers to do?", "作者建议旅行者怎么做？"],
          ["Check what is normal before they go", "出发前了解当地的习惯"],
          [
            ["Always add a fifth to the bill", "总是多付账单的五分之一"],
            ["Never leave a tip anywhere", "在任何地方都不给小费"],
          ],
          [
            '"For people who travel, the best idea is to check before you go." A guidebook or a local friend can help.',
            "最好的办法是出发前通过旅行指南或当地朋友了解习惯。",
          ],
        ],
      ],
    }),
  ],
};
