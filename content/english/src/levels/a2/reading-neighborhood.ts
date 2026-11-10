// The reading unit of the A2 theme Neighbors and Community: places, people and helping out, with comparisons and
// possessives.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "a2-words-neighborhood",
  "a2-words-community-actions",
  "a2-words-people-around",
  "a2-words-describing-places",
  "a2-words-pronouns",
  "comparatives-and-superlatives",
  "possessive-pronouns",
  "apostrophes-and-possessives",
]);

/** readingNeighborhood is the reading unit of the theme Neighbors and Community. */
export const readingNeighborhood: ReadingUnitDef = {
  id: "a2-reading-neighborhood",
  title: t("Neighbors and Community", "邻里和社区"),
  passages: [
    passage({
      id: "a2-neighbors-the-new-bakery-on-the-square",
      title: ["The New Bakery on the Square", "广场上的新面包店"],
      body: `For many years there was an empty shop on the corner of our square. Last spring a young man and his wife, Paul and Rita, opened a bakery there.

Every morning they start work at four o'clock. When I walk to school at seven, the whole square smells of fresh bread. Paul bakes the bread, and Rita makes cakes and cookies. Her lemon cake is the best in town.

The bakery is small, but it is always full. People from the neighborhood meet there for coffee, and old Mr. Kim reads his book there every morning. On Saturdays, children watch Paul through a big window while he works.

The bread is a little more expensive than the bread at the big shop on Main Street, but it is much better. And Paul and Rita are friendly. They know the names of everyone who comes in.

Our square was quiet and a bit boring before. Now it is the busiest and friendliest place in the neighborhood.`,
      grammar: ["comparatives-and-superlatives"],
      names: ["Paul", "Rita", "Mr", "Kim", "Main"],
      questions: [
        [
          ["What was on the corner of the square before the bakery?", "面包店开张前，广场角落里是什么？"],
          ["An empty shop", "一家空着的店"],
          [
            ["A playground", "一个游乐场"],
            ["A bank", "一家银行"],
          ],
          ['The first sentence says: "there was an empty shop on the corner of our square."', "第一句说那里很多年来一直是一家空店。"],
        ],
        [
          ["Who makes the cakes at the bakery?", "面包店里谁做蛋糕？"],
          ["Rita", "丽塔"],
          [
            ["Paul", "保罗"],
            ["Mr. Kim", "金先生"],
          ],
          [
            'The passage says: "Paul bakes the bread, and Rita makes cakes and cookies."',
            "保罗烤面包，丽塔做蛋糕和饼干；金先生是来看书的老人。",
          ],
        ],
        [
          ["How is the bakery's bread different from the bread at the big shop?", "面包店的面包和大商店的面包有什么不同？"],
          ["It costs a little more, but it is much better", "贵一点，但好得多"],
          [
            ["It is cheaper and better", "更便宜也更好"],
            ["It is cheaper, but it is not as good", "更便宜，但没那么好"],
          ],
          [
            'The passage says: "The bread is a little more expensive than the bread at the big shop on Main Street, but it is much better."',
            "more expensive than 说明它更贵，much better 说明它好得多。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-neighbors-a-village-that-shares",
      title: ["A Village That Shares", "一个分享的村子"],
      body: `In the small village of Elm Hill, people share many things. Next to the church there is a little house of wood, and it is full of things that people don't use every day: bikes, tents, games, books, a big pan for parties and even a boat.

If you need something, you can take it, use it and bring it back. You don't have to pay. Everyone in the village is a member of the group.

The idea started five years ago. Anna Berg, a teacher, noticed that every family had the same things, and they used them only a few times a year. "Why should every house have its own tent?" she asked. She organized a meeting, and twenty families joined.

Now there are more than sixty members. People also share their time. Young people help old people with their shopping, and old people teach children to cook, paint and repair bikes.

"Our village is small," says Anna, "but we have more than bigger villages, because we share."`,
      grammar: ["comparatives-and-superlatives"],
      names: ["Elm", "Anna", "Berg"],
      questions: [
        [
          ["What is in the little house next to the church?", "教堂旁边的小房子里有什么？"],
          ["Things people can borrow, like bikes and tents", "人们可以借用的东西，比如自行车和帐篷"],
          [
            ["Food from the farms", "农场里的食物"],
            ["Old clothes to sell", "要卖的旧衣服"],
          ],
          [
            'The passage says it is "full of things that people don\'t use every day: bikes, tents, games, books".',
            "小房子里放着大家不常用的东西，可以拿去用再还回来。",
          ],
        ],
        [
          ["Who started the idea?", "这个主意是谁提出的？"],
          ["Anna Berg, a teacher", "老师安娜·伯格"],
          [
            ["The leader of the church", "教堂的负责人"],
            ["The children of the village", "村里的孩子们"],
          ],
          [
            'The passage says: "Anna Berg, a teacher, noticed that every family had the same things."',
            "是一位叫安娜·伯格的老师发现了这个问题并组织了会议。",
          ],
        ],
        [
          ["How many members are there now?", "现在有多少成员？"],
          ["More than sixty", "六十多个"],
          [
            ["Twenty", "二十个"],
            ["Five", "五个"],
          ],
          ['The passage says: "Now there are more than sixty members."', "一开始有二十个家庭加入，现在有六十多个成员；五是年数。"],
        ],
      ],
    }),
    passage({
      id: "a2-neighbors-our-noisy-street",
      title: ["Our Noisy Street", "我们吵闹的街道"],
      body: `I live on Bridge Street, and it is the noisiest street in our town. There is a big school at one end and a bus station at the other end.

Every morning at seven the buses start. At eight, hundreds of children walk past my window, shouting and laughing. In the afternoon the traffic is terrible, and the cars are louder than the buses. Even at night it is not quiet, because the restaurant across the street is open until twelve.

My cousin lives in a village in the mountains. Her street is much quieter than mine. It is also safer and prettier, with flowers in front of every house. When I visit her, I sleep for ten hours!

But my street has good things too. I can walk to school in two minutes. There are shops, a library and a park near my house, and I never feel lonely. My cousin has to take a bus for an hour to get to her school.

So which street is better? I think hers is more peaceful, but mine is more fun.`,
      grammar: ["comparatives-and-superlatives", "possessive-pronouns"],
      names: ["Bridge"],
      questions: [
        [
          ["Why is the street not quiet at night?", "为什么这条街晚上也不安静？"],
          ["A restaurant is open until twelve", "一家餐馆营业到十二点"],
          [
            ["The buses start at night", "公共汽车晚上开始运行"],
            ["The children play outside", "孩子们在外面玩"],
          ],
          [
            'The passage says: "it is not quiet, because the restaurant across the street is open until twelve."',
            "because 后面说明原因：街对面的餐馆开到十二点。",
          ],
        ],
        [
          ["What is better about the cousin's street?", "表妹住的街道哪方面更好？"],
          ["It is quieter, safer and prettier", "更安静、更安全、更漂亮"],
          [
            ["It is nearer to her school", "离她的学校更近"],
            ["It has more shops", "商店更多"],
          ],
          [
            'The passage says her street is "much quieter than mine. It is also safer and prettier".',
            "表妹的街更安静、更安全、更漂亮；但她上学要坐一小时公共汽车。",
          ],
        ],
        [
          ["What does the writer think in the end?", "作者最后是怎么想的？"],
          ["Hers is more peaceful, but mine is more fun", "她的街更宁静，我的街更有趣"],
          [
            ["The writer wants to move to the village", "作者想搬到村子里去"],
            ["Both streets are boring", "两条街都很无聊"],
          ],
          ['The last sentence says: "I think hers is more peaceful, but mine is more fun."', "hers 指表妹的街，mine 指作者自己的街。"],
        ],
      ],
    }),
    passage({
      id: "a2-neighbors-the-playground-volunteers",
      title: ["The Playground Volunteers", "游乐场志愿者"],
      body: `The playground in our neighborhood was old and ugly. Some of the toys were broken, there were old bottles and papers on the ground, and children didn't want to play there.

Last spring Mr. Brown, the owner of the shoe shop, decided to do something. He put a notice on the door of his shop: "Help us fix our playground! Saturday, nine o'clock."

Forty people came: parents, children, old people and even the police officer from the corner. They worked all day. Some people collected the bottles and papers. Others painted the walls yellow and blue. Two fathers repaired the old toys, and the children planted flowers and small trees.

At five o'clock they finished. The playground looked new. Mr. Brown thanked everyone and gave them pizza.

Now the playground is the busiest place in the neighborhood. The volunteers meet there on the first Saturday of every month to keep it clean and safe.`,
      grammar: ["past-simple-regular", "comparatives-and-superlatives"],
      names: ["Mr", "Brown"],
      questions: [
        [
          ["Who organized the work at the playground?", "谁组织了游乐场的劳动？"],
          ["Mr. Brown, the owner of a shop", "布朗先生，一家店的老板"],
          [
            ["The police officer", "警察"],
            ["The teachers of the school", "学校的老师"],
          ],
          [
            'The passage says: "Mr. Brown, the owner of the shoe shop, decided to do something."',
            "鞋店老板布朗先生在门上贴了通知，召集大家。",
          ],
        ],
        [
          ["What did the children do?", "孩子们做了什么？"],
          ["They planted flowers and small trees", "种花和小树"],
          [
            ["They repaired the old toys", "修旧玩具"],
            ["They painted the walls", "刷墙"],
          ],
          ['The passage says: "the children planted flowers and small trees."', "修玩具的是两位爸爸，刷墙的是其他人，孩子们种了花和小树。"],
        ],
        [
          ["When do the volunteers meet now?", "志愿者现在什么时候见面？"],
          ["On the first Saturday of every month", "每月第一个星期六"],
          [
            ["Every Sunday", "每个星期天"],
            ["Once a year", "每年一次"],
          ],
          ['The last sentence says they "meet there on the first Saturday of every month".', "最后一句说他们每月第一个星期六在那里见面。"],
        ],
      ],
    }),
    passage({
      id: "a2-neighbors-mrs-lees-garden",
      title: ["Mrs. Lee's Garden", "李太太的花园"],
      body: `Mrs. Lee is eighty-two years old, and she lives alone in the house next to ours. Her garden is the prettiest on our street. It has roses, sunflowers and a small lemon tree. She works in it every day, and in summer it is full of color.

Last winter Mrs. Lee fell on the ice and hurt her knee. She couldn't walk well for months, and she couldn't work in her garden. In spring the garden looked sad and empty, and Mrs. Lee looked sad too.

My sister and I wanted to help. After school we went to her house and asked, "Can we work in your garden? You can tell us what to do." She smiled. "That's very kind of you," she said.

Every afternoon for two months we worked in the garden, and Mrs. Lee sat on a chair and told us what to do. We learned a lot about plants. She also told us stories about her life in Korea.

By the summer the garden was beautiful again, and Mrs. Lee's knee was better. Now she says, "This garden isn't only mine. It's ours."`,
      grammar: ["possessive-pronouns", "apostrophes-and-possessives"],
      names: ["Mrs", "Lee", "Lee's", "Korea"],
      questions: [
        [
          ["Why couldn't Mrs. Lee work in her garden?", "李太太为什么不能在花园里干活？"],
          ["She hurt her knee on the ice", "她在冰上摔伤了膝盖"],
          [
            ["She went to Korea", "她去了韩国"],
            ["She was too busy", "她太忙了"],
          ],
          ['The passage says: "Mrs. Lee fell on the ice and hurt her knee."', "去年冬天她在冰上摔倒，伤了膝盖，好几个月走不好路。"],
        ],
        [
          ["What did Mrs. Lee do while the girls worked?", "女孩们干活时李太太在做什么？"],
          ["She sat on a chair and told them what to do", "坐在椅子上告诉她们怎么做"],
          [
            ["She cooked dinner for them", "给她们做晚饭"],
            ["She slept in the house", "在屋里睡觉"],
          ],
          ['The passage says: "Mrs. Lee sat on a chair and told us what to do."', "李太太坐在椅子上指导她们，还讲了自己在韩国的故事。"],
        ],
        [
          ['What does Mrs. Lee mean by "It\'s ours"?', '李太太说 "It\'s ours" 是什么意思？'],
          ["The garden belongs to her and the girls now", "花园现在属于她和两个女孩"],
          [
            ["The garden belongs only to the girls now", "花园现在只属于两个女孩"],
            ["She wants to sell the garden", "她想卖掉花园"],
          ],
          ["She says: \"This garden isn't only mine. It's ours.\"", "ours 是“我们的”，包括她自己和两个女孩，所以说花园不只是她的。"],
        ],
      ],
    }),
    passage({
      id: "a2-neighbors-a-stranger-at-the-door",
      title: ["A Stranger at the Door", "门口的陌生人"],
      body: `Last Saturday I was at home alone when I heard someone at the door. I looked out of the window. There was a man I didn't know. He was tall, with a gray coat and a big bag.

My parents always say, "Don't open the door to strangers." So I didn't open it. I asked through the door, "Who are you?"

"I'm Peter Novak," the man said. "I'm looking for my sister, Eva. Does she live here?"

"No," I said. "I'm sorry." He looked tired and worried. "I came by train from Prague," he said. "She wrote the name of this street on a card, but maybe it is the wrong street."

Then I remembered that a woman called Eva lived at number twelve. "Try number twelve," I said.

From the window, I watched him walk to number twelve. A woman opened the door, and she cried and laughed at the same time.

Later, Eva came to our house with a cake to thank me. "You were careful and helpful," she said. "That was the right thing to do."`,
      grammar: ["past-simple-irregular"],
      names: ["Peter", "Novak", "Eva", "Prague"],
      questions: [
        [
          ["Why didn't the writer open the door?", "作者为什么没有开门？"],
          ["The parents say not to open the door to strangers", "父母说不要给陌生人开门"],
          [
            ["The door was broken", "门坏了"],
            ["The writer was asleep", "作者在睡觉"],
          ],
          [
            "The passage says: \"My parents always say, 'Don't open the door to strangers.' So I didn't open it.\"",
            "作者记得父母的话，所以隔着门问话。",
          ],
        ],
        [
          ["Who was the man looking for?", "那个男人在找谁？"],
          ["His sister", "他的妹妹"],
          [
            ["His mother", "他的妈妈"],
            ["His friend from Prague", "他在布拉格的朋友"],
          ],
          ['The man says: "I\'m looking for my sister, Eva."', "他说他在找妹妹伊娃。"],
        ],
        [
          ["How did the writer help?", "作者是怎么帮忙的？"],
          ["By telling him to try number twelve", "让他去十二号试试"],
          [
            ["By calling the police", "打电话报警"],
            ["By walking with him to the station", "陪他走到车站"],
          ],
          ['The writer says: "Try number twelve."', "作者想起十二号住着一位叫伊娃的女人，就让他去那里试试。"],
        ],
      ],
    }),
    passage({
      id: "a2-neighbors-the-quietest-place-in-town",
      title: ["The Quietest Place in Town", "城里最安静的地方"],
      body: `Our town is busy. There are crowded markets, noisy streets and a lot of traffic. But I know the quietest place in town: the old library garden.

It is behind the library, and you go in through a small gate. Not many people know about it. There is a fountain in the center, some old trees and a few chairs. Birds sing in the trees, and you can hear the water of the fountain.

I go there after school on most days. I sit under the biggest tree and read, or I just think. It is the most peaceful place I know.

The garden is safer and cleaner than the park, and it is much quieter than the square. It is also free! There is only one rule: you must speak quietly, because people are reading.

Last week my best friend asked me, "Where do you go every afternoon?" I thought for a moment. Then I said, "Come with me. I'll show you." I hope she doesn't tell everyone!`,
      grammar: ["comparatives-and-superlatives"],
      questions: [
        [
          ["Where is the garden?", "这个花园在哪里？"],
          ["Behind the library", "在图书馆后面"],
          [
            ["Next to the market", "在市场旁边"],
            ["In the park", "在公园里"],
          ],
          ['The passage says: "It is behind the library, and you go in through a small gate."', "花园在图书馆后面，从一扇小门进去。"],
        ],
        [
          ["What is the only rule of the garden?", "花园唯一的规定是什么？"],
          ["You must speak quietly", "必须小声说话"],
          [
            ["You must pay at the gate", "必须在门口付钱"],
            ["Children can't come in", "孩子不能进去"],
          ],
          [
            'The passage says: "There is only one rule: you must speak quietly, because people are reading."',
            "花园是免费的，唯一的规定是小声说话。",
          ],
        ],
        [
          ["How is the garden different from the square?", "花园和广场有什么不同？"],
          ["It is much quieter", "安静得多"],
          [
            ["It is bigger", "更大"],
            ["It is more crowded", "更拥挤"],
          ],
          ['The passage says: "it is much quieter than the square."', "much quieter than 表示“比……安静得多”。"],
        ],
      ],
    }),
    passage({
      id: "a2-neighbors-welcome-to-the-neighborhood",
      title: ["Welcome to the Neighborhood", "欢迎来到我们街区"],
      body: `Hello, new neighbors!

We are the Ortiz family from number nine, and we are happy that you are here on Green Street. Here are some things that are good to know.

The best bakery is on the square, five minutes from here. Go early, because the fresh bread is gone by ten. The market is open on Tuesdays and Saturdays, and the vegetables there are cheaper and fresher than in the shops.

The playground is at the end of the street, and the library is next to the church. The library is free, and it has a corner for children. The bus to the city center stops in front of the bank.

Our street is quiet and safe, and the neighbors are friendly. Mr. Kim at number four is a doctor, and Mrs. Patel at number seven organizes a party in the square every summer. Everyone is invited!

If you need anything, our house is the one with the red door. Please come and say hello. Our son Diego is nine, and he would like a new friend!

Best wishes,
Ana and Luis Ortiz`,
      grammar: ["comparatives-and-superlatives"],
      names: ["Ortiz", "Green", "Mr", "Kim", "Mrs", "Patel", "Diego", "Ana", "Luis"],
      questions: [
        [
          ["When is the market open?", "市场什么时候开？"],
          ["On Tuesdays and Saturdays", "星期二和星期六"],
          [
            ["Every day", "每天"],
            ["On Sundays", "星期天"],
          ],
          ['The note says: "The market is open on Tuesdays and Saturdays."', "便条上说市场星期二和星期六开。"],
        ],
        [
          ["Where does the bus to the city center stop?", "去市中心的公共汽车停在哪里？"],
          ["In front of the bank", "银行门前"],
          [
            ["Next to the church", "教堂旁边"],
            ["At the end of the street", "街道尽头"],
          ],
          [
            'The note says: "The bus to the city center stops in front of the bank."',
            "教堂旁边是图书馆，街道尽头是游乐场，公共汽车停在银行门前。",
          ],
        ],
        [
          ["Who organizes a party every summer?", "谁每年夏天组织聚会？"],
          ["Mrs. Patel", "帕特尔太太"],
          [
            ["Mr. Kim", "金先生"],
            ["The Ortiz family", "奥尔蒂斯一家"],
          ],
          [
            'The note says: "Mrs. Patel at number seven organizes a party in the square every summer."',
            "金先生是医生，帕特尔太太每年夏天在广场组织聚会。",
          ],
        ],
      ],
    }),
  ],
};
