// The listening topics of A2 (S1): in each unit, the unit's words heard in sentences and short dialogues and
// announcements on its theme. In the dialogues, A is the usual voice, a woman's, and B a man's.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { frame, unitListening } from "../listening.ts";
// The modules whose vocabulary topics the listening plays, built before it.
import "./topics.ts";

/** topics are the listening topics of the units of A2, in their order. */
export const topics: readonly TopicDef[] = [
  unitListening({
    id: "a2-listening-last-weekend",
    title: t("Listening: Last Weekend", "听力：上个周末"),
    summary: t(
      "Hear what people did last weekend, where they went and when they got home.",
      "听人们上个周末做了什么、去了哪里、几点到家。",
    ),
    words: [
      "a2-words-past-time",
      "a2-words-relatives",
      "a2-words-events",
      "a2-words-weekend",
      "a2-words-useful-words",
      "a2-words-family-food-and-measures",
    ],
    frames: [
      frame(
        "A: What did you do on Saturday? | B: I {x}. On Sunday I {y}.",
        "What did the man do on Saturday?",
        "这个男人星期六做了什么？",
        "went to the beach, visited my aunt, played tennis, cleaned my room, watched a movie",
      ),
      frame(
        "A: Where did you go last weekend? | B: We went to {x}. We wanted to go to {y}, but it rained.",
        "Where did the man go last weekend?",
        "这个男人上个周末去了哪里？",
        "the zoo, the beach, the museum, the park, the lake",
      ),
      frame(
        "A: What time did you get home? | B: At {x}. My sister got home at {y}.",
        "When did the man get home?",
        "这个男人几点到家？",
        "nine o'clock, ten o'clock, eleven o'clock, midnight, half past ten",
      ),
      frame(
        "Hi Kate, it's Dan. I'm sorry I missed your party on {y}. Can we meet on {x}?",
        "When does Dan want to meet?",
        "Dan 想哪天见面？",
        "Monday, Tuesday, Wednesday, Thursday, Friday",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-health-and-the-body",
    title: t("Listening: Health and the Body", "听力：健康和身体"),
    summary: t(
      "Hear what is wrong, how often to take medicine and when the doctor is free.",
      "听哪里不舒服、药多久吃一次、医生什么时候有空。",
    ),
    words: ["a2-words-health", "a2-words-body-2", "a2-words-staying-well", "a2-words-at-the-doctor"],
    frames: [
      frame(
        "A: What's the matter? | B: I've got a {x}. Yesterday I had a {y}.",
        "What's the matter with the man today?",
        "这个男人今天哪里不舒服？",
        "headache, cold, sore throat, stomachache, fever",
      ),
      frame(
        "A: How often should I take the medicine? | B: Take it {x}, not {y}.",
        "How often should the woman take the medicine?",
        "这个女人应该多久吃一次药？",
        "once a day, twice a day, three times a day, every morning, every evening",
      ),
      frame(
        "A: When can I see the doctor? | B: The doctor can see you at {x}. She's busy at {y}.",
        "When can the woman see the doctor?",
        "这个女人什么时候可以看医生？",
        "nine o'clock, ten o'clock, eleven o'clock, two o'clock, four o'clock",
      ),
      frame(
        "A: Which part hurts? | B: My {x}. My {y} is fine now.",
        "Which part of the man's body hurts?",
        "这个男人身体哪个部位疼？",
        "arm, leg, back, knee, foot",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-neighbors-and-community",
    title: t("Listening: Neighbors and Community", "听力：邻里和社区"),
    summary: t(
      "Hear about street parties, neighbors, volunteering and new places on the street.",
      "听有关街头聚会、邻居、志愿活动和街上新地方的内容。",
    ),
    words: [
      "a2-words-neighborhood",
      "a2-words-community-actions",
      "a2-words-people-around",
      "a2-words-describing-places",
      "a2-words-pronouns",
      "a2-words-positions-and-shapes",
    ],
    frames: [
      frame(
        "A: When is the street party? | B: It's in {x}. Last year it was in {y}.",
        "When is the street party?",
        "街头聚会在什么时候？",
        "May, June, July, August, September",
      ),
      frame(
        "A: Who lives in the house next to yours? | B: A {x} lives there. A {y} lives across the street.",
        "Who lives next to the man?",
        "谁住在这个男人隔壁？",
        "doctor, teacher, police officer, farmer, musician",
      ),
      frame(
        "We need volunteers to {x} on Saturday morning. On Sunday we will {y}.",
        "What will the volunteers do on Saturday morning?",
        "志愿者星期六上午要做什么？",
        "clean the park, plant trees, paint the school, pick up litter, help at the library",
      ),
      frame(
        "A: Where is the new café? | B: It's on {x} Street, near {y} Street.",
        "Which street is the new café on?",
        "新咖啡馆在哪条街上？",
        "Green, Hill, Park, Station, Market",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-cooking",
    title: t("Listening: Cooking", "听力：烹饪"),
    summary: t("Hear recipes: how long to cook, what to buy and how hot the oven should be.", "听菜谱：煮多久、买什么、烤箱要多热。"),
    words: ["a2-words-cooking", "a2-words-ingredients", "a2-words-taste", "a2-words-quantities"],
    frames: [
      frame(
        "A: How long do I cook the pasta? | B: For {x} minutes. Not {y}, {x}.",
        "How long should the pasta cook?",
        "意大利面要煮多久？",
        "five, eight, ten, twelve, fifteen",
      ),
      frame(
        "A: What do we need for the cake? | B: We need to buy {x}. We already have {y}.",
        "What do they need to buy for the cake?",
        "做蛋糕他们需要买什么？",
        "eggs, flour, sugar, butter, milk",
      ),
      frame(
        "A: What are you cooking? | B: I'm making {x}. Tomorrow I'm going to make {y}.",
        "What is the man making now?",
        "这个男人现在在做什么菜？",
        "soup, a curry, pancakes, fried rice, a salad",
      ),
      frame(
        "First, heat the oven to {x} degrees. Not {y} degrees: that is for bread.",
        "How hot should the oven be?",
        "烤箱要预热到多少度？",
        "one hundred and fifty, one hundred and sixty, one hundred and eighty, two hundred, two hundred and twenty",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-sports-and-games",
    title: t("Listening: Sports and Games", "听力：运动和游戏"),
    summary: t(
      "Hear who won, the score, when classes start and which sport people prefer.",
      "听谁赢了、比分多少、课程几点开始、人们更喜欢哪项运动。",
    ),
    words: ["a2-words-sports", "a2-words-competition", "a2-words-movement", "a2-words-games", "a2-words-adverbs"],
    frames: [
      frame(
        "A: Who won the match? | B: The {x} team won. The {y} team lost.",
        "Which team won?",
        "哪个队赢了？",
        "red, blue, green, yellow, white",
      ),
      frame(
        "A: What was the score? | B: It was {x} at the end. At half time it was {y}.",
        "What was the final score?",
        "最终比分是多少？",
        "two to one, three to one, four to two, three to three, one to one",
      ),
      frame(
        "A: When does the swimming class start? | B: At {x}. The tennis class starts at {y}.",
        "When does the swimming class start?",
        "游泳课几点开始？",
        "four o'clock, five o'clock, six o'clock, seven o'clock, half past five",
      ),
      frame(
        "A: Which sport do you prefer? | B: I prefer {x}. I think {y} is more boring.",
        "Which sport does the man prefer?",
        "这个男人更喜欢哪项运动？",
        "tennis, football, basketball, swimming, running",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-animals-and-pets",
    title: t("Listening: Animals and Pets", "听力：动物和宠物"),
    summary: t("Hear about pets, what animals eat and feeding times at the zoo.", "听有关宠物、动物吃什么和动物园喂食时间的内容。"),
    words: ["a2-words-pets", "a2-words-wildlife", "a2-words-animal-life", "a2-words-farm-and-care"],
    frames: [
      frame(
        "A: Have you got a pet? | B: Yes, a {x}. My sister has a {y}.",
        "What pet does the man have?",
        "这个男人养了什么宠物？",
        "dog, cat, rabbit, parrot, hamster",
      ),
      frame(
        "A: How old is your dog? | B: He's {x}. Our cat is {y}.",
        "How old is the man's dog?",
        "这个男人的狗几岁？",
        "two, three, five, seven, nine",
      ),
      frame(
        "Welcome to the zoo. The {x} are fed at two o'clock, and the {y} at three o'clock.",
        "Which animals are fed at two o'clock?",
        "哪种动物在两点喂食？",
        "lions, penguins, monkeys, elephants, bears",
      ),
      frame(
        "A: What does your rabbit eat? | B: It eats {x}. It doesn't eat {y}.",
        "What does the man's rabbit eat?",
        "这个男人的兔子吃什么？",
        "carrots, grass, apples, lettuce, hay",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-travel-and-holidays",
    title: t("Listening: Travel and Holidays", "听力：旅行和假期"),
    summary: t("Hear gates, places, how long people stay and how they travel.", "听登机口、地点、停留多久和怎么出行。"),
    words: ["a2-words-holidays", "a2-words-places-to-visit", "a2-words-transport", "a2-words-future"],
    frames: [
      frame(
        "The flight to Rome will leave from gate {x}, not gate {y}.",
        "Which gate does the flight to Rome leave from?",
        "去罗马的航班从几号登机口出发？",
        "twelve, fourteen, sixteen, twenty, twenty-two",
      ),
      frame(
        "A: Where are you going this summer? | B: We're going to {x}. Last year we went to {y}.",
        "Where is the man going this summer?",
        "这个男人今年夏天要去哪里？",
        "Italy, Japan, Mexico, Egypt, Australia",
      ),
      frame(
        "A: How long are you staying? | B: For {x}. My parents are staying for {y}.",
        "How long is the man staying?",
        "这个男人要待多久？",
        "three days, five days, a week, two weeks, ten days",
      ),
      frame(
        "A: How are you getting to the airport? | B: We're taking the {x}. Coming back, we'll take the {y}.",
        "How is the man getting to the airport?",
        "这个男人怎么去机场？",
        "bus, train, ferry, subway, tram",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-the-natural-world",
    title: t("Listening: The Natural World", "听力：自然世界"),
    summary: t(
      "Hear about mountains, rivers, animals on a walk and the weather in different places.",
      "听有关山、河、散步时看到的动物和各地天气的内容。",
    ),
    words: ["a2-words-landscape", "a2-words-weather-2", "a2-words-space", "a2-words-plants", "a2-words-little-words-3"],
    frames: [
      frame(
        "A: How high is the mountain? | B: It's about {x} meters. The hill next to it is {y} meters.",
        "How high is the mountain?",
        "这座山有多高？",
        "five hundred, eight hundred, a thousand, twelve hundred, two thousand",
      ),
      frame(
        "On our walk today we saw a {x} near the river, and a {y} in the trees.",
        "What animal did they see near the river?",
        "他们在河边看到了什么动物？",
        "deer, fox, snake, squirrel, frog",
      ),
      frame(
        "A: Which is the longest river? | B: I think it's the {x}. The {y} is shorter.",
        "Which river does the man think is the longest?",
        "这个男人认为哪条河最长？",
        "Nile, Amazon, Yangtze, Mississippi, Danube",
      ),
      frame(
        "Tomorrow there will be {x} in the north and {y} in the south.",
        "What weather will there be in the north?",
        "北部会是什么天气？",
        "rain, snow, sunshine, strong winds, fog",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-shopping-and-money",
    title: t("Listening: Shopping and Money", "听力：购物和金钱"),
    summary: t("Hear prices, where to buy things and which floor has a sale.", "听价格、在哪里买东西、哪一层在打折。"),
    words: ["a2-words-money", "a2-words-shops", "a2-words-things-we-buy", "a2-words-materials"],
    frames: [
      frame(
        "A: How much did you pay for your shoes? | B: I paid {x} dollars. They were {y} dollars last week.",
        "How much did the man pay for his shoes?",
        "这个男人买鞋花了多少钱？",
        "thirty, forty, fifty, sixty, seventy",
      ),
      frame(
        "A: Where can I buy stamps? | B: At the {x}. The {y} doesn't sell them.",
        "Where can the woman buy stamps?",
        "这个女人在哪里可以买到邮票？",
        "post office, supermarket, drugstore, gas station, bookstore",
      ),
      frame(
        "This week, everything on the {x} floor is twenty percent off. The {y} floor is closed.",
        "Which floor has twenty percent off?",
        "哪一层打八折？",
        "first, second, third, fourth, fifth",
      ),
      frame(
        "A: Which phone is cheaper? | B: The {x} one. The {y} one is more expensive.",
        "Which phone is cheaper?",
        "哪部手机更便宜？",
        "black, white, silver, blue, red",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-technology",
    title: t("Listening: Technology", "听力：科技"),
    summary: t("Hear passwords, batteries, messages and when the computer room opens.", "听密码、电池、消息以及电脑室几点开门。"),
    words: ["a2-words-technology", "a2-words-using-tech", "a2-words-communication", "a2-words-machines", "a2-words-sounds-and-messages"],
    frames: [
      frame(
        "A: What's the Wi-Fi password? | B: It's {x}. The old one was {y}.",
        "What is the Wi-Fi password?",
        "无线网密码是什么？",
        "sunflower, rainbow, tiger, moonlight, river",
      ),
      frame(
        "A: How long does your battery last? | B: About {x} hours. My old phone lasted {y} hours.",
        "How long does the man's battery last?",
        "这个男人的手机电池能用多久？",
        "six, eight, ten, twelve, twenty",
      ),
      frame(
        "A: How many messages did you get today? | B: About {x}. Yesterday I got {y}.",
        "How many messages did the man get today?",
        "这个男人今天收到了多少条消息？",
        "ten, twenty, thirty, fifty, a hundred",
      ),
      frame(
        "The computer room opens at {x} today, and at {y} tomorrow.",
        "When does the computer room open today?",
        "电脑室今天几点开门？",
        "nine o'clock, ten o'clock, eleven o'clock, noon, one o'clock",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-festivals-and-celebrations",
    title: t("Listening: Festivals and Celebrations", "听力：节日和庆祝"),
    summary: t("Hear when festivals start, costumes, fireworks and presents.", "听节日什么时候开始、装扮、烟花和礼物。"),
    words: ["a2-words-festivals", "a2-words-wishes", "a2-words-feelings-2", "a2-words-people-together"],
    frames: [
      frame(
        "A: When does the festival start? | B: On the {x} of October. The music starts on the {y}.",
        "On which day of October does the festival start?",
        "节日在十月几号开始？",
        "first, second, fifth, tenth, fifteenth",
      ),
      frame(
        "A: What are you going as to the party? | B: I'm going as a {x}. My brother is going as a {y}.",
        "What is the man going to dress up as?",
        "这个男人要装扮成什么？",
        "pirate, cat, robot, ghost, king",
      ),
      frame(
        "The fireworks begin at {x}. The parade begins at {y}.",
        "When do the fireworks begin?",
        "烟花几点开始？",
        "seven o'clock, eight o'clock, nine o'clock, ten o'clock, half past eight",
      ),
      frame(
        "A: What did you get for your birthday? | B: I got a {x} from my parents and a {y} from my sister.",
        "What did the man get from his parents?",
        "这个男人从父母那里得到了什么？",
        "bike, watch, book, camera, guitar",
      ),
    ],
  }),
  unitListening({
    id: "a2-listening-jobs-and-dreams",
    title: t("Listening: Jobs and Dreams", "听力：工作和梦想"),
    summary: t(
      "Hear what people want to be, how long they work and when interviews are.",
      "听人们想做什么、工作多长时间、面试在什么时候。",
    ),
    words: ["a2-words-jobs-2", "a2-words-work-life", "a2-words-ambitions", "a2-words-everyday-ideas"],
    frames: [
      frame(
        "A: What do you want to be? | B: I want to be a {x}. My friend wants to be a {y}.",
        "What does the man want to be?",
        "这个男人想成为什么？",
        "pilot, vet, chef, singer, scientist",
      ),
      frame(
        "A: How many hours do you work? | B: I work {x} hours a day. On Saturdays I work {y}.",
        "How many hours a day does the man work?",
        "这个男人每天工作几个小时？",
        "six, seven, eight, nine, ten",
      ),
      frame(
        "Your interview is on {x} at ten o'clock. Not on {y}: on {x}.",
        "When is the interview?",
        "面试在哪天？",
        "Monday, Tuesday, Wednesday, Thursday, Friday",
      ),
      frame(
        "A: What did you study? | B: I studied {x}. My brother studied {y}.",
        "What did the man study?",
        "这个男人学的是什么？",
        "law, music, medicine, art, engineering",
      ),
    ],
  }),
];
