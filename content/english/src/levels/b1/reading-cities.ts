// The reading unit of the B1 theme Cities and Transport: skyscrapers, moving to the city, bike lanes, rents, a tunnel,
// car-free centers, a night bus and parks on roofs.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const soSuch = "so-and-such";
const might = "may-might-and-could";

const passage = passageMaker(readingWords, [
  "b1-words-city-life",
  "b1-words-getting-around",
  "b1-words-city-problems",
  "b1-words-directions-2",
  "b1-words-buildings",
  "b1-words-city-services",
  soSuch,
  might,
]);

/** readingCities is the reading unit of the theme Cities and Transport. */
export const readingCities: ReadingUnitDef = {
  id: "b1-reading-cities",
  title: t("Cities and Transport", "城市与交通"),
  passages: [
    passage({
      id: "b1-cities-life-in-a-skyscraper",
      title: ["Life in a Skyscraper", "住在摩天大楼里"],
      body: `Mei lives on floor 52 of a skyscraper in the downtown district of her city. The building has sixty floors, six elevators and more than eight hundred residents. "It's like a small town that goes up instead of across," she says.

Many of the facilities that people need are inside the building. On the ground floor there is a supermarket, a pharmacy and a coffee shop. On the tenth floor there is a gym and a swimming pool, and on the roof there is a garden where residents grow vegetables. Some neighbors hardly ever go outside on cold days.

The view from Mei's apartment is beautiful. On a clear morning she can see the mountains beyond the city and the ships on the river. At night the streets below look like rivers of light. "It's such a beautiful view that I never get tired of it," she says.

But life so high up is not always easy. When the wind is strong, the building moves a little, and the glasses in her kitchen shake. Once, the elevators stopped working for a whole day, and she had to walk down fifty-two floors to get to work. "My legs hurt for three days," she laughs.

Living in a skyscraper can also feel lonely. In an ordinary street, people meet their neighbors on the sidewalk, but in a tall building they might only see each other for a few seconds in the elevator. To solve this problem, the residents started a club. Every month they have a dinner on the roof, and new residents are invited to introduce themselves.

The rent is high, and the apartment is small. But Mei says she might never move. "I like being in the sky," she says. "Down there, the city is so noisy. Up here, it's quiet."`,
      grammar: [soSuch, might],
      names: ["Mei", "Mei's"],
      questions: [
        [
          ["Which facilities are inside Mei's building?", "梅住的大楼里有哪些设施？"],
          ["A supermarket, a gym, a pool and a roof garden", "超市、健身房、游泳池和屋顶花园"],
          [
            ["A school, a hospital and a cinema", "学校、医院和电影院"],
            ["A park, a stadium and a library", "公园、体育场和图书馆"],
          ],
          [
            "On the ground floor there is a supermarket, on the tenth floor a gym and a pool, and on the roof a garden.",
            "一楼有超市，十楼有健身房和游泳池，屋顶有花园。",
          ],
        ],
        [
          ["Why did the residents start a club?", "居民们为什么成立了一个俱乐部？"],
          ["Neighbors hardly met, except for a few seconds in the elevator", "邻居们几乎见不到面，只在电梯里碰见几秒钟"],
          [
            ["The rent was too high for most of the residents", "房租对大多数居民来说太高了"],
            ["The elevators often stopped working for a day", "电梯经常停运一整天"],
          ],
          [
            '"In a tall building they might only see each other for a few seconds in the elevator. To solve this problem, the residents started a club."',
            "高楼里的邻居只在电梯里短暂相遇，为了解决孤独的问题，居民们成立了俱乐部。",
          ],
        ],
        [
          ["What happened when the elevators stopped working?", "电梯停运时发生了什么？"],
          ["Mei walked down fifty-two floors to get to work", "梅走下五十二层楼去上班"],
          [
            ["Mei stayed at home and worked in her apartment", "梅待在家里，在公寓里工作"],
            ["The residents had a dinner together on the roof", "居民们在屋顶一起吃晚饭"],
          ],
          [
            "\"She had to walk down fifty-two floors to get to work. 'My legs hurt for three days.'\"",
            "她不得不走下五十二层楼去上班，腿疼了三天。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-cities-from-the-country-to-the-city",
      title: ["Moving from the Country to the City", "从乡村搬到城市"],
      body: `When I was eighteen, I left the small village where I grew up and moved to the capital to study. I had visited the city a few times with my parents, but living there was completely different.

In my village, everyone knew everyone. When I walked to the shop, I greeted ten people on the way. In the city, thousands of people walked past me every day, and nobody said hello. At first I found this strange and a little sad. Later I understood that it was not rude. There were just so many people that nobody could greet them all.

The noise was the hardest thing. At home, the only sounds at night were the wind and the dogs. In the city there were cars, ambulances and people shouting until three in the morning. For the first month I hardly slept.

There were good things too. In my village there was one bus a day, and it often did not come. In the city I could take the subway, a bus or a tram to almost every part of the city, at any time. There were cinemas, museums and restaurants with food from every part of the world. I could explore a new district every weekend.

Housing was a problem. My room was so small that I could touch both walls at the same time, and the rent took half of the money I earned at my part-time job. My parents' house in the village had a garden bigger than my whole building.

Now I have lived in the city for six years. I have a job, good friends and an apartment with a real kitchen. I still miss the quiet and the stars, and I go back to my village every summer. But when I return to the city after a few weeks, I feel that I am home again too. Perhaps a person can have two homes.`,
      grammar: [soSuch],
      questions: [
        [
          ["What did the writer find strange at first in the city?", "作者刚到城市时觉得什么很奇怪？"],
          ["Nobody said hello in the street", "街上没有人打招呼"],
          [
            ["People greeted the writer in every shop", "每家商店的人都和作者打招呼"],
            ["There was only one bus a day", "每天只有一班公共汽车"],
          ],
          [
            '"Thousands of people walked past me every day, and nobody said hello. At first I found this strange." The one bus a day was in the village.',
            "在城市里成千上万的人走过却没人打招呼，作者起初觉得奇怪；每天一班车说的是村里。",
          ],
        ],
        [
          ["What was the hardest thing about the city?", "城市生活中最难适应的是什么？"],
          ["The noise, which kept the writer awake at night", "噪音，让作者夜里睡不着"],
          [
            ["The transport, which was hard to use at night", "交通，夜里很难使用"],
            ["The food, which came from every part of the world", "食物，来自世界各地"],
          ],
          [
            '"The noise was the hardest thing... For the first month I hardly slept." Transport and food were among the good things.',
            "作者说最难的是噪音，第一个月几乎没睡着；交通和美食是好的方面。",
          ],
        ],
        [
          ["How does the writer feel now?", "作者现在感觉如何？"],
          ["At home both in the village and in the city", "在村里和城里都有家的感觉"],
          [
            ["Ready to move back to the village forever", "准备永远搬回村里"],
            ["Unhappy and never at home in the city", "不开心，在城里从来没有家的感觉"],
          ],
          [
            '"When I return to the city after a few weeks, I feel that I am home again too. Perhaps a person can have two homes."',
            "作者回到城市也觉得是回家了，认为一个人可以同时属于两个地方。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-cities-the-bike-lanes",
      title: ["The Bike Lanes That Changed a City", "改变一座城市的自行车道"],
      body: `Twenty years ago, the center of Velden had the same problems as many other cities. The streets were full of cars, traffic jams were common at rush hour, and on some days the smog was so thick that people could hardly see the end of the street. Cyclists were not safe, so only a few brave people rode bikes to work.

Then the city chose a new mayor. She promised to build bike lanes across the whole city, and many people laughed at her. "Nobody here will cycle in the rain," they said. Shop owners were angry too. They believed that if there were not so many parking places, customers would stop coming.

The council built the first lanes anyway. They were big, and a low concrete wall stood between them and the cars, so that cyclists felt safe. The lanes connected the suburbs with the downtown district, the schools and the train station.

At first, the number of cyclists grew slowly. But every year more lanes were added, and more people tried them. Parents started cycling with their children to school. Office workers discovered that the bike was often faster than the car, because they did not have to sit in jams or look for parking.

Today, about a third of all trips in Velden are made by bike. The air is cleaner, and the number of accidents has fallen. The shop owners who complained have changed their opinion too: people on bikes stop at shops more often than people in cars, because it is so easy to get off and go in.

Not everyone is happy. Some drivers say that the city is now too difficult for cars. But very few residents would like to go back to the old streets.`,
      grammar: [soSuch],
      names: ["Velden"],
      questions: [
        [
          ["Why were the shop owners angry about the plan?", "店主们为什么对这个计划感到生气？"],
          ["They thought fewer parking places meant fewer customers", "他们认为停车位减少意味着顾客减少"],
          [
            ["They thought cyclists would damage their shops", "他们认为骑车的人会损坏他们的店"],
            ["They wanted the lanes in front of their own shops", "他们想让车道修在自己的店门前"],
          ],
          [
            '"They believed that if there were not so many parking places, customers would stop coming."',
            "店主们担心停车位少了，顾客就不来了。",
          ],
        ],
        [
          ["Why did cyclists feel safe in the new lanes?", "骑车的人为什么在新车道上感到安全？"],
          ["A low concrete wall separated them from the cars", "一道低矮的混凝土墙把他们和汽车隔开"],
          [
            ["Cars were not allowed in the downtown district", "汽车不允许进入市中心"],
            ["The lanes were only open at rush hour", "车道只在高峰时段开放"],
          ],
          [
            '"They were big, and a low concrete wall stood between them and the cars, so that cyclists felt safe."',
            "车道很宽，并用矮混凝土墙与汽车隔开，所以骑车的人感到安全。",
          ],
        ],
        [
          ["What did the shop owners discover in the end?", "店主们最后发现了什么？"],
          ["People on bikes stop at shops more often", "骑车的人更常在店铺停留"],
          [
            ["People in cars spend more in their shops", "开车的人在店里花钱更多"],
            ["Their customers moved to the suburbs", "他们的顾客搬到了郊区"],
          ],
          [
            '"People on bikes stop at shops more often than people in cars, because it is so easy to get off and go in."',
            "骑车的人下车进店很方便，所以比开车的人更常光顾店铺。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-cities-why-rents-are-rising",
      title: ["Why Rents Are Rising", "房租为什么在上涨"],
      body: `In many big cities, rents have risen much faster than pay. In some places, young people spend more than half of what they earn on housing, and many of them still live with their parents at thirty. Why is this happening?

The first reason is simple: more people want to live in cities. That is where the jobs, universities and hospitals are. When more people want the same thing, its price goes up.

The second reason is a shortage of homes. Building new housing takes years, and in many cities there is a lack of land. Historic districts are often protected, so a new building there cannot be taller than the old ones around it. Some residents also oppose construction near their homes, because they are worried about noise, traffic or losing their view.

A third reason is that some apartments are not really used as homes. Some are rented to tourists for a few nights at a time, which can earn the owner more money than renting to a family for the whole year. Others are bought by people who already have a home, and they stay empty until the owner sells them for more money.

What can cities do? Some councils have built homes that they rent to residents at lower prices. Others have made rules about renting apartments to tourists, or charge extra taxes on empty apartments. Some allow tall apartment blocks near train stations, so that more people can live close to public transport.

Not one of these ideas works alone, and each one has people who are against it. But experts agree on one thing: if cities don't build more homes, rents will keep rising, and the people who keep a city running, such as nurses, teachers and bus drivers, might not be able to live in it.`,
      grammar: [might],
      questions: [
        [
          ["What is the first reason that rents are rising?", "房租上涨的第一个原因是什么？"],
          ["More people want to live in cities", "更多的人想住在城市里"],
          [
            ["Cities have too many empty schools", "城市里空置的学校太多"],
            ["People earn more in rural areas", "人们在乡村挣得更多"],
          ],
          [
            '"The first reason is simple: more people want to live in cities... When more people want the same thing, its price goes up."',
            "想住在城市的人越来越多，需求增加，价格就上涨。",
          ],
        ],
        [
          ["Why are tall new buildings not built in some old districts?", "为什么有些老城区不建高的新楼？"],
          ["New buildings cannot be taller than the historic ones", "新楼不能比周围的历史建筑高"],
          [
            ["The land there is cheaper than in the suburbs", "那里的土地比郊区便宜"],
            ["Tourists rent all the apartments in those districts", "游客租下了那些城区的所有公寓"],
          ],
          [
            '"Historic districts are often protected, so a new building there cannot be taller than the old ones around it."',
            "历史城区往往受到保护，新楼的高度不能超过周围的老建筑。",
          ],
        ],
        [
          ["What might happen if cities don't build more homes?", "如果城市不建更多住房，可能会发生什么？"],
          ["Nurses, teachers and bus drivers might not be able to live there", "护士、教师和公交司机可能住不起这座城市"],
          [
            ["Tourists might stop visiting the city at all", "游客可能完全不再来这座城市"],
            ["The council might sell its historic buildings", "市政府可能卖掉它的历史建筑"],
          ],
          [
            '"Rents will keep rising, and the people who keep a city running, such as nurses, teachers and bus drivers, might not be able to live in it."',
            "房租会继续上涨，让城市运转的护士、教师和公交司机可能无法住在城里。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-cities-a-tunnel-under-the-river",
      title: ["A Tunnel Under the River", "河底隧道"],
      body: `For three hundred years, the only ways to cross the big river in the middle of the city were by boat or over the old stone bridge. As the city grew, the bridge became overcrowded. Every morning, thousands of vehicles waited in a long line to cross it, and the commute from the south side of the river to the offices in the north could take more than an hour.

The council decided to build a tunnel under the river. It was the biggest construction project in the history of the city, and it took six years.

Building a tunnel under water is not like building one through a mountain. The ground under a river is soft and wet, so the workers used a huge machine that cut through the earth and built the walls of the tunnel behind it as it went. The walls were made of concrete and steel, strong enough to hold back the weight of the river above. The machine moved about ten meters a day.

There were problems. Once, water came into the tunnel, and the work had to stop for two months. The project cost much more than the council planned, and many residents complained about the noise and the heavy vehicles.

When the tunnel finally opened, the whole city celebrated. Thousands of people walked through it on the first day, before any cars were allowed in. It has two lanes for cars in each direction and another tunnel beside it for trains.

Today, the trip from south to north takes ten minutes. The old bridge is still there, but now it is only for pedestrians and cyclists. On summer evenings it is full of people who stop to look at the river, and at the boats passing above the tunnel.`,
      questions: [
        [
          ["Why did the council decide to build a tunnel?", "市政府为什么决定修建隧道？"],
          ["The old bridge was overcrowded and the commute was long", "老桥太拥挤，通勤时间很长"],
          [
            ["The old bridge was falling down into the river", "老桥快要塌进河里了"],
            ["The boats on the river were too slow and too few", "河上的船太慢也太少"],
          ],
          [
            '"As the city grew, the bridge became overcrowded... the commute from the south side... could take more than an hour."',
            "城市扩大后老桥变得拥挤，从南岸到北岸的通勤可能超过一小时。",
          ],
        ],
        [
          ["How did the machine build the tunnel?", "那台机器是怎样修建隧道的？"],
          ["It cut through the ground and built the walls behind it", "它挖穿地层，并在身后筑起隧道墙"],
          [
            ["It moved the river while the workers built the walls", "它把河移开，让工人修墙"],
            ["It dug a long hole through a mountain first", "它先在山里挖了一条长洞"],
          ],
          [
            '"A huge machine that cut through the earth and built the walls of the tunnel behind it as it went." A tunnel under water is not like one through a mountain.',
            "机器一边挖土一边在身后筑墙；文章说河底隧道和山中隧道不一样。",
          ],
        ],
        [
          ["What is the old bridge used for now?", "老桥现在有什么用途？"],
          ["Only pedestrians and cyclists use it", "只供行人和骑车的人使用"],
          [
            ["Trains cross it every ten minutes", "火车每十分钟经过一次"],
            ["It is closed because it is too old", "它因为太旧而被关闭了"],
          ],
          ['"The old bridge is still there, but now it is only for pedestrians and cyclists."', "老桥还在，但现在只供行人和骑车的人通行。"],
        ],
      ],
    }),
    passage({
      id: "b1-cities-cities-without-cars",
      title: ["Cities That Banned Cars", "禁止汽车的城市"],
      body: `Imagine a city center where you can hear birds instead of traffic, where children play in the street and where old people sit on benches in the middle of the road. In a few cities, this is not a dream. They have banned most cars from their centers.

One of the first was a small city in the south of Europe. Thirty years ago, its center was full of traffic, and many families had moved to the suburbs. A new mayor closed the old streets to cars, but ambulances could still come in, and the shops could still get things by car early in the morning. Within a few years, the number of people living in the center grew again. Shops that had closed opened again, and the number of accidents fell. The plaza in front of the town hall, which used to be a parking lot, became a place for markets and concerts.

Other cities have tried something similar, but not in the whole center. Some close certain streets on Sundays. Others have made "school streets", where no cars may drive in front of a school when children arrive and leave.

Not everyone likes the idea. People who live in the suburbs and work downtown may find it harder to get to work, especially if the buses are slow. Elderly residents might need a car to get to a doctor. And if cars are not allowed in the center, they could just move to other streets and cause jams there.

People who like the idea say that these problems can be solved with good buses and trams, and with parking outside the center. Streets, they say, are for people, not for machines. What do you think? Could your city live without cars?`,
      grammar: [might],
      names: ["Europe"],
      questions: [
        [
          ["What happened in the center after cars were banned?", "禁止汽车后，市中心发生了什么变化？"],
          ["More people lived there and there were fewer accidents", "住在那里的人多了，事故少了"],
          [
            ["Most shops closed and moved to the suburbs", "大多数商店关门并搬到了郊区"],
            ["The plaza became a parking lot for residents", "广场变成了居民的停车场"],
          ],
          [
            '"The number of people living in the center grew again... and the number of accidents fell." The plaza used to be a parking lot.',
            "市中心的居民又多了起来，事故减少了；广场原来是停车场，后来变成了集市和音乐会的场所。",
          ],
        ],
        [
          ['What is a "school street"?', "什么是“学校街道”？"],
          ["A street where cars may not drive when children arrive and leave", "孩子上学放学时禁止汽车通行的街道"],
          [
            ["A street where only school buses may park all day", "只允许校车全天停放的街道"],
            ["A street with a school at each end of it", "两头各有一所学校的街道"],
          ],
          [
            "\"'School streets', where no cars may drive in front of a school when children arrive and leave.\"",
            "“学校街道”指孩子到校和离校时，汽车不能在学校门前行驶。",
          ],
        ],
        [
          ["Which problem with banning cars does the passage mention?", "文章提到了禁止汽车的哪个问题？"],
          ["Traffic jams could move to other streets", "交通堵塞可能转移到其他街道"],
          [
            ["Children could not play in the street", "孩子们不能在街上玩"],
            ["The air in the center could get dirtier", "市中心的空气可能变得更脏"],
          ],
          [
            '"If cars are not allowed in the center, they could just move to other streets and cause jams there."',
            "汽车被挡在中心区外，可能转而挤到别的街道，造成堵塞。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-cities-the-night-bus",
      title: ["The Night Bus", "夜班公交车"],
      body: `Most people in the city are sleeping when Tomas starts work. He drives the number 4, a night bus that crosses the city from the airport in the west to the hospital in the east, between midnight and five in the morning.

"The passengers on a night bus are completely different from the ones in the day," he says. "There's no rush hour, no school children, no tourists with maps. Instead I have nurses and people who clean offices going to work, students going home from parties, and people who work in restaurants and finish very late."

Tomas has driven the night bus for eleven years, and he knows many of his passengers. There is a baker who gets on at two o'clock every morning and always sits in the same seat behind him. There is a young woman who works at the airport and goes to sleep as soon as she sits down; Tomas wakes her when they get to her stop.

The job is not always easy. Sometimes passengers are rude, and once someone broke a window. There is a camera on the bus and a button that Tomas can press to call the police. "But I have hardly ever used it," he says. "Most people are just tired and kind."

What he likes most is the empty city. "At three in the morning, the streets are only for the bus. The traffic lights change for nobody, the streetlights shine on empty sidewalks, and you can see all the way along the highway."

At five o'clock, Tomas drives the bus back to the station and goes home. He eats breakfast while his neighbors leave for work, and then he goes to sleep. "It's a strange life," he says. "But somebody has to take the city home."`,
      names: ["Tomas"],
      questions: [
        [
          ["Who usually rides the night bus?", "通常是哪些人乘坐夜班车？"],
          ["Workers going to or from work, and students going home", "上下班的工人和回家的学生"],
          [
            ["School children and tourists with maps", "上学的孩子和拿着地图的游客"],
            ["Business people going to the airport for flights", "去机场赶飞机的商务人士"],
          ],
          [
            '"Instead I have nurses and people who clean offices going to work, students going home from parties, and people who work in restaurants." There are no school children or tourists.',
            "夜班车上有去上班的护士和清洁工、聚会后回家的学生和下班很晚的餐馆员工，没有学生和游客。",
          ],
        ],
        [
          ["What does Tomas do for the young woman from the airport?", "托马斯为那位在机场工作的年轻女子做什么？"],
          ["He wakes her when they reach her stop", "到站时他把她叫醒"],
          [
            ["He saves her a seat behind him", "他在身后给她留座位"],
            ["He calls her when the bus is late", "车晚点时他给她打电话"],
          ],
          [
            '"A young woman who works at the airport and goes to sleep as soon as she sits down; Tomas wakes her when they get to her stop." The seat behind him is the baker\'s.',
            "她一坐下就睡着，到站时托马斯叫醒她；坐在他身后的是面包师。",
          ],
        ],
        [
          ["What does Tomas like most about his job?", "托马斯最喜欢这份工作的哪一点？"],
          ["Seeing the city when it is empty", "看到空荡荡的城市"],
          [
            ["Meeting tourists from other countries", "结识来自其他国家的游客"],
            ["Finishing work before the rush hour", "在高峰时段之前下班"],
          ],
          [
            "\"What he likes most is the empty city. 'At three in the morning, the streets are only for the bus.'\"",
            "他最喜欢的是凌晨空无一人的城市，街道仿佛只属于公交车。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-cities-parks-in-the-sky",
      title: ["Parks in the Sky", "空中公园"],
      body: `In a crowded city, there is often no space for a new park. The land is too expensive, and there are already houses, offices and roads on every block. So some cities have found a different answer: they have put parks on top of things.

One famous example is in New York. An old train line, built above the streets, was not used for many years. Some residents wanted it destroyed, but others suggested turning it into a park. Today it is a long, thin garden, more than two kilometers long, with trees, flowers and benches, and millions of visitors walk along it every year.

Other cities have built gardens on the roofs of schools, shopping centers and even hospitals. In some places, the law says that every new building must have plants on its roof. These green roofs are not only beautiful. They keep the rooms under them cooler in summer, they hold rain water, which helps to prevent floods, and they give a home to birds and insects.

Some designers do even more. They plan skyscrapers with trees growing on every floor. Two towers in Milan have hundreds of trees on the outside of every floor, so that from a distance the towers look like a forest standing up.

Of course, parks in the sky have problems too. They are expensive to build and to look after, because the earth is heavy and the plants need a lot of water. The structure under them must be strong enough to carry the weight. And a garden on the twentieth floor is not always open to everyone.

But as cities grow, the people who live in them need nature more than ever. If there is no room on the ground, the sky might be the best place left.`,
      grammar: [might],
      names: ["New", "York", "Milan"],
      questions: [
        [
          ["What was the park in New York before?", "纽约的那座公园以前是什么？"],
          ["An old train line above the streets", "街道上方的一条旧铁路"],
          [
            ["A parking garage under the streets", "街道下面的一个停车场"],
            ["The roof of a large shopping center", "一个大型购物中心的屋顶"],
          ],
          [
            '"An old train line, built above the streets, was not used for many years... others suggested turning it into a park."',
            "那是一条建在街道上方、多年不用的旧铁路，后来被改造成了公园。",
          ],
        ],
        [
          ["Which is a benefit of green roofs?", "绿色屋顶有哪一项好处？"],
          ["They keep buildings cooler in summer", "夏天让建筑更凉爽"],
          [
            ["They make buildings cheaper to build", "让建筑造价更低"],
            ["They give residents more places to park", "给居民提供更多停车位"],
          ],
          [
            '"They keep the rooms under them cooler in summer, they hold rain water... and they give a home to birds and insects." They are expensive, not cheap.',
            "绿色屋顶夏天降温、蓄存雨水、为鸟和昆虫提供栖息地；它们造价昂贵。",
          ],
        ],
        [
          ["What is one problem with parks in the sky?", "空中公园有什么问题？"],
          ["The structure must be strong enough for the weight", "下面的结构必须足够坚固才能承重"],
          [
            ["Birds and insects cannot live so high up", "鸟和昆虫无法在那么高的地方生活"],
            ["The plants there need almost no water", "那里的植物几乎不需要水"],
          ],
          [
            '"The structure under them must be strong enough to carry the weight." The earth is heavy and the plants need a lot of water.',
            "泥土很重，植物需要大量的水，所以下面的结构必须能承受重量。",
          ],
        ],
      ],
    }),
  ],
};
