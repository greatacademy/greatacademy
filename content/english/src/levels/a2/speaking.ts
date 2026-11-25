// The speaking topics of A2 (S2–S4): in each unit, after its listening, the unit's words said after a recording,
// its sentences read aloud, and questions on its theme answered aloud in a full sentence with a given word.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { say, unitSpeaking } from "../speaking.ts";
// The modules whose vocabulary topics the speaking says, built before it.
import "./topics.ts";

/** topics are the speaking topics of the units of A2, in their order. */
export const topics: readonly TopicDef[] = [
  unitSpeaking({
    id: "a2-speaking-last-weekend",
    watchOut: {
      repeat: t(
        "*cousin* is *KUZ-in*. *daughter* is *DAW-ter*; the *gh* is silent. *suddenly* has three beats, *SUD-un-lee*.",
        "*cousin* 读作 *KUZ-in*。*daughter* 读作 *DAW-ter*，*gh* 不发音。*suddenly* 读三拍，*SUD-un-lee*。",
      ),
      read: t(
        "Say the past endings: *visited* has an extra beat, *watched* ends in a short *t*, *played* in a short *d*. Do not read them as the present.",
        "过去式词尾要读出来：*visited* 多一拍，*watched* 结尾是短促的 *t*，*played* 是短促的 *d*。不要读成现在时。",
      ),
      say: t(
        "Answer in the past: *I went*, *I ate*, *I saw*, *I felt*. These irregular forms carry the meaning, so say them clearly.",
        "用过去时回答：*I went*、*I ate*、*I saw*、*I felt*。这些不规则形式承载意思，要说清楚。",
      ),
    },
    title: t("Speaking: Last Weekend", "口语：上个周末"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“上个周末”的词汇，并朗读句子。"),
    listening: "a2-listening-last-weekend",
    words: [
      "a2-words-past-time",
      "a2-words-relatives",
      "a2-words-events",
      "a2-words-weekend",
      "a2-words-useful-words",
      "a2-words-family-food-and-measures",
    ],
    frames: [
      say(
        "What did you do last weekend?",
        "I {x} last weekend. / I {x}.",
        "played tennis, visited my grandmother, watched a film, went swimming, cleaned my room",
      ),
      say("Where did you go on Saturday?", "I went to the {x} on Saturday. / I went to the {x}.", "park, beach, cinema, museum, zoo"),
      say("What did you eat on Sunday?", "I ate {x} on Sunday. / I ate {x}.", "pizza, fish, noodles, chicken, pancakes"),
      say("Who did you see last weekend?", "I saw my {x}. / I saw my {x} last weekend.", "grandparents, cousins, friends, uncle, aunt"),
      say(
        "What did you watch on Saturday?",
        "I watched {x}. / I watched {x} on Saturday.",
        "a film, a football match, a cartoon, a concert, a quiz show",
      ),
      say("How did you feel on Sunday evening?", "I felt {x}. / I felt {x} on Sunday evening.", "tired, happy, bored, relaxed, excited"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-health-and-the-body",
    watchOut: {
      repeat: t(
        "*stomach* is *STUM-uk*. *medicine* is *MED-ih-sin*. *temperature* is *TEM-pruh-cher*, three beats in fast speech.",
        "*stomach* 读作 *STUM-uk*。*medicine* 读作 *MED-ih-sin*。*temperature* 读作 *TEM-pruh-cher*，快读时三拍。",
      ),
      read: t(
        "Keep *should* light, with a silent *l*: *shud*. Say *hurts* with the *s* after a singular part: *My knee hurts*.",
        "*should* 轻读，*l* 不发音：*shud*。单数部位后的 *hurts* 要带 *s*：*My knee hurts*。",
      ),
      say: t(
        "Say *I have a*, then the problem: *I have a cough*. For advice, start with *You should*. Say *twice* and *three times* clearly.",
        "先说 *I have a* 再说症状：*I have a cough*。给建议以 *You should* 开头。*twice*、*three times* 要说清楚。",
      ),
    },
    title: t("Speaking: Health and the Body", "口语：健康和身体"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“健康和身体”的词汇，并朗读句子。"),
    listening: "a2-listening-health-and-the-body",
    words: ["a2-words-health", "a2-words-body-2", "a2-words-staying-well", "a2-words-at-the-doctor"],
    frames: [
      say("What's the matter?", "I have a {x}. / I have got a {x}.", "headache, cold, cough, stomachache, sore throat"),
      say("How often do you exercise?", "I exercise {x}.", "every day, twice a week, three times a week, once a week, every morning"),
      say("What should I do for a cold?", "You should {x}.", "drink hot tea, stay in bed, see a doctor, take some medicine, rest at home"),
      say("Which part of your body hurts?", "My {x} hurts. / My {x} hurts a lot.", "leg, arm, back, knee, foot"),
      say("How many hours do you sleep?", "I sleep {x} hours. / I sleep for {x} hours.", "six, seven, eight, nine, ten"),
      say("What do you eat to stay healthy?", "I eat {x} to stay healthy. / I eat {x}.", "fruit, vegetables, fish, salad, nuts"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-neighbors-and-community",
    watchOut: {
      repeat: t(
        "*volunteer* is stressed at the end, *vol-un-TEER*. *crowded* has two beats, *KROW-did*. *themselves* ends in *selvz*.",
        "*volunteer* 重音在后，*vol-un-TEER*。*crowded* 读两拍，*KROW-did*。*themselves* 结尾读 *selvz*。",
      ),
      read: t(
        "Do not drop the *-ed* beat of *crowded* or *organized*. Link *next to* and *in front of* into one smooth phrase.",
        "*crowded*、*organized* 的 *-ed* 不要丢。*next to*、*in front of* 要连成一个短语读。",
      ),
      say: t(
        "Keep *the* after *opposite* and *behind*: *opposite the bank*. Before a vowel, say *an*: *An old man lives next door*.",
        "*opposite*、*behind* 后面保留 *the*：*opposite the bank*。元音前用 *an*：*An old man lives next door*。",
      ),
    },
    title: t("Speaking: Neighbors and Community", "口语：邻里和社区"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“邻里和社区”的词汇，并朗读句子。"),
    listening: "a2-listening-neighbors-and-community",
    words: [
      "a2-words-neighborhood",
      "a2-words-community-actions",
      "a2-words-people-around",
      "a2-words-describing-places",
      "a2-words-pronouns",
      "a2-words-positions-and-shapes",
    ],
    frames: [
      say(
        "Where is the post office?",
        "It is opposite the {x}. / The post office is opposite the {x}.",
        "bank, library, park, police station, supermarket",
      ),
      say(
        "What can we do at the community center?",
        "We can {x} there. / We can {x} at the community center. / We can {x}.",
        "play games, learn to cook, read books, meet friends, take a dance class",
      ),
      say("Who lives next door?", "An old {x} lives next door. / My neighbor is an old {x}.", "man, woman, couple, teacher, doctor"),
      say(
        "How can we help our neighbors?",
        "We can {x}. / We can help by trying to {x}.",
        "carry their shopping, walk their dog, clean the street, water their plants, visit them",
      ),
      say("Where is the bus stop?", "It is behind the {x}. / The bus stop is behind the {x}.", "school, bank, caf\u00e9, hospital, church"),
      say("What is your street like?", "My street is {x}. / It is {x}.", "quiet, busy, noisy, clean, long"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-cooking",
    watchOut: {
      repeat: t(
        "*recipe* is *RES-ih-pee*, three beats. *onion* is *UN-yun*. *garlic* and *carrot* are stressed at the start.",
        "*recipe* 读作 *RES-ih-pee*，三拍。*onion* 读作 *UN-yun*。*garlic* 和 *carrot* 重音在前。",
      ),
      read: t(
        "Read the instructions with a firm verb at the start: *Mix*, *Add*, *Pour*. Say *degrees* with the *z* at the end.",
        "读步骤时开头的动词要有力：*Mix*、*Add*、*Pour*。*degrees* 结尾带 *z*。",
      ),
      say: t(
        "Start with *First* or *Next*, then the verb: *Next, we boil the water*. For taste, say *It tastes* with the *s*: *It tastes sour*.",
        "以 *First* 或 *Next* 开头再接动词：*Next, we boil the water*。说味道用 *It tastes*，带 *s*：*It tastes sour*。",
      ),
    },
    title: t("Speaking: Cooking", "口语：烹饪"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“烹饪”的词汇，并朗读句子。"),
    listening: "a2-listening-cooking",
    words: ["a2-words-cooking", "a2-words-ingredients", "a2-words-taste", "a2-words-quantities"],
    frames: [
      say(
        "What do we do first?",
        "First, we {x} the vegetables. / First, {x} the vegetables. / We {x} the vegetables first.",
        "wash, cut, peel, chop, boil",
      ),
      say("How does it taste?", "It tastes {x}.", "sweet, salty, sour, spicy, delicious"),
      say("What do we need for the cake?", "We need {x}. / We need some {x}.", "eggs, flour, sugar, butter, milk"),
      say("How long do we cook it?", "We cook it for {x} minutes. / For {x} minutes.", "ten, fifteen, twenty, thirty, forty"),
      say("What can you cook?", "I can cook {x}.", "rice, pasta, eggs, soup, pancakes"),
      say(
        "What do we do next?",
        "Next, we {x}. / Then we {x}.",
        "cut the onions, boil the water, mix the eggs, add the salt, wash the vegetables",
      ),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-sports-and-games",
    watchOut: {
      repeat: t(
        "*badminton* is *BAD-min-tun*. *champion* is *CHAM-pee-un*. *carefully* has three beats, *KAIR-fuh-lee*.",
        "*badminton* 读作 *BAD-min-tun*。*champion* 读作 *CHAM-pee-un*。*carefully* 读三拍，*KAIR-fuh-lee*。",
      ),
      read: t(
        "Keep the *-ly* of *quickly* and *slowly*; it changes the word. Say *won* like *one*, not like *woman*.",
        "*quickly*、*slowly* 的 *-ly* 要保留，它改变了词义。*won* 读得像 *one*，不像 *woman* 的开头。",
      ),
      say: t(
        "Say *I am good at*, then the sport, with *at*. For the result, use the past: *The blue team won*.",
        "说 *I am good at* 再接运动，别漏 *at*。说结果用过去时：*The blue team won*。",
      ),
    },
    title: t("Speaking: Sports and Games", "口语：运动和游戏"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“运动和游戏”的词汇，并朗读句子。"),
    listening: "a2-listening-sports-and-games",
    words: ["a2-words-sports", "a2-words-competition", "a2-words-movement", "a2-words-games", "a2-words-adverbs"],
    frames: [
      say("Which sport are you good at?", "I am good at {x}.", "running, swimming, basketball, tennis, table tennis"),
      say("Who won the match?", "The {x} team won. / The {x} team won the match.", "red, blue, green, yellow, white"),
      say("What sport do you watch on TV?", "I watch {x} on TV. / I watch {x}.", "football, tennis, basketball, swimming, golf"),
      say("How often do you play sports?", "I play sports {x}.", "every day, twice a week, at the weekend, once a week, after school"),
      say("Where do you play football?", "I play football in the {x}. / In the {x}.", "park, playground, garden, stadium, street"),
      say("What was the score?", "It was {x} to one. / The score was {x} to one.", "two, three, four, five, six"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-animals-and-pets",
    watchOut: {
      repeat: t(
        "*parrot* and *hamster* are stressed at the start. *giraffe* is stressed at the end. Say *wolf* with a round *oo*, *wulf*.",
        "*parrot*、*hamster* 重音在前。*giraffe* 重音在后。*wolf* 读圆唇的 *oo*，*wulf*。",
      ),
      read: t(
        "Plural animals keep their endings: *wolves* with *vz*, *foxes* with an extra beat. Say *feeds* and *lays* with the *z*.",
        "动物复数要保留词尾：*wolves* 读 *vz*，*foxes* 多一拍。*feeds*、*lays* 结尾读 *z*。",
      ),
      say: t(
        "Say *I would like a*, then the pet. For the biggest, say *The whale is the biggest*, with *the* twice.",
        "先说 *I would like a* 再说宠物。说最大的用 *The whale is the biggest*，两个 *the* 都要说。",
      ),
    },
    title: t("Speaking: Animals and Pets", "口语：动物和宠物"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“动物和宠物”的词汇，并朗读句子。"),
    listening: "a2-listening-animals-and-pets",
    words: ["a2-words-pets", "a2-words-wildlife", "a2-words-animal-life", "a2-words-farm-and-care"],
    frames: [
      say("What pet would you like?", "I would like a {x}.", "dog, cat, rabbit, parrot, hamster"),
      say("What does your dog eat?", "It eats {x}. / My dog eats {x}.", "meat, biscuits, rice, fish, vegetables"),
      say(
        "What is your favorite wild animal?",
        "My favorite wild animal is the {x}. / It is the {x}.",
        "lion, tiger, elephant, giraffe, monkey",
      ),
      say("Where does your cat sleep?", "It sleeps on the {x}. / My cat sleeps on the {x}.", "sofa, bed, floor, chair, carpet"),
      say("How old is your pet?", "It is {x} years old. / My pet is {x}.", "two, three, four, five, six"),
      say(
        "What animal is the biggest?",
        "The {x} is the biggest. / I think the {x} is the biggest.",
        "whale, elephant, giraffe, bear, horse",
      ),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-travel-and-holidays",
    watchOut: {
      repeat: t(
        "*souvenir* is *soo-vuh-NEER*, stressed at the end. *luggage* is *LUG-ij*. *helicopter* has four beats.",
        "*souvenir* 读作 *soo-vuh-NEER*，重音在后。*luggage* 读作 *LUG-ij*。*helicopter* 读四拍。",
      ),
      read: t(
        "Say *will* clearly or as *'ll*; do not drop it, or the sentence becomes present. *passport* and *postcard* are stressed at the start.",
        "*will* 要说清楚或缩成 *'ll*，不要丢，否则句子就成了现在时。*passport*、*postcard* 重音在前。",
      ),
      say: t(
        "Use *by* for transport and *to* for places: *We are going by plane*, *I am going to Paris*. Past trips take *stayed*, *took*, *saw*.",
        "交通用 *by*，地点用 *to*：*We are going by plane*、*I am going to Paris*。说过去的旅行用 *stayed*、*took*、*saw*。",
      ),
    },
    title: t("Speaking: Travel and Holidays", "口语：旅行和假期"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“旅行和假期”的词汇，并朗读句子。"),
    listening: "a2-listening-travel-and-holidays",
    words: ["a2-words-holidays", "a2-words-places-to-visit", "a2-words-transport", "a2-words-future"],
    frames: [
      say("How are you going to travel?", "We are going to travel by {x}. / We are going by {x}.", "plane, train, boat, bus, car"),
      say(
        "Where are you going this summer?",
        "I am going to {x} this summer. / I am going to {x}.",
        "London, Paris, Beijing, Sydney, New York",
      ),
      say("Where did you stay on holiday?", "We stayed in a {x}. / We stayed at a {x}.", "hotel, tent, cottage, flat, guesthouse"),
      say("What did you take with you?", "I took {x}. / I took {x} with me.", "a camera, a map, a suitcase, my passport, some books"),
      say("How long was your holiday?", "It was {x}. / My holiday was {x}.", "one week, two weeks, ten days, three days, a month"),
      say(
        "What did you see on your trip?",
        "I saw {x}. / I saw {x} on my trip.",
        "a castle, the sea, some mountains, a waterfall, an old church",
      ),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-the-natural-world",
    watchOut: {
      repeat: t(
        "*lightning* has no *e*: *LYT-ning*. *waterfall* is stressed at the start. Say *earth* with the *ur* of *bird* and a soft *th*.",
        "*lightning* 中间没有 *e*：*LYT-ning*。*waterfall* 重音在前。*earth* 的 *ur* 同 *bird*，结尾是轻柔的 *th*。",
      ),
      read: t(
        "*through* is *throo*; do not read the *gh*. Keep *could* light, with a silent *l*: *kud*.",
        "*through* 读作 *throo*，*gh* 不发音。*could* 轻读，*l* 不发音：*kud*。",
      ),
      say: t(
        "For the future say *It will be*, and for yesterday *It was*; the verb carries the time. Plural animals take *live*, not *lives*.",
        "说明天用 *It will be*，说昨天用 *It was*，动词表示时间。复数动物后面用 *live*，不是 *lives*。",
      ),
    },
    title: t("Speaking: The Natural World", "口语：自然世界"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“自然世界”的词汇，并朗读句子。"),
    listening: "a2-listening-the-natural-world",
    words: ["a2-words-landscape", "a2-words-weather-2", "a2-words-space", "a2-words-plants", "a2-words-little-words-3"],
    frames: [
      say("What can you see in the sky at night?", "I can see the {x}.", "moon, stars, planets, clouds, lights"),
      say("What will the weather be like tomorrow?", "It will be {x} tomorrow. / It will be {x}.", "sunny, rainy, windy, snowy, foggy"),
      say("What lives in the forest?", "{x} live in the forest. / I think {x} live in the forest.", "bears, wolves, foxes, deer, owls"),
      say(
        "Where is the highest mountain?",
        "It is in {x}. / The highest mountain is in {x}.",
        "Asia, Nepal, China, the Himalayas, the east",
      ),
      say("What was the weather like yesterday?", "It was {x} yesterday. / It was {x}.", "sunny, rainy, windy, snowy, foggy"),
      say("What do you like doing outside?", "I like {x}. / I like {x} outside.", "walking, climbing, swimming, camping, fishing"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-shopping-and-money",
    watchOut: {
      repeat: t(
        "*leather* has a soft *th*: *LETH-er*. *supermarket* is stressed at the start. *wooden* is *WUD-un*.",
        "*leather* 中间是轻柔的 *th*：*LETH-er*。*supermarket* 重音在前。*wooden* 读作 *WUD-un*。",
      ),
      read: t(
        "Say *costs* with all three end sounds, *sts*. *bought* is *bawt*; do not read the *gh*.",
        "*costs* 结尾三个音 *sts* 都要读出来。*bought* 读作 *bawt*，*gh* 不发音。",
      ),
      say: t(
        "Say *It costs*, then the number and *dollars*. Materials take *made of*: *It is made of wool*. Paying takes *by card* or *in cash*.",
        "说 *It costs* 再接数字和 *dollars*。材料用 *made of*：*It is made of wool*。付款用 *by card* 或 *in cash*。",
      ),
    },
    title: t("Speaking: Shopping and Money", "口语：购物和金钱"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“购物和金钱”的词汇，并朗读句子。"),
    listening: "a2-listening-shopping-and-money",
    words: ["a2-words-money", "a2-words-shops", "a2-words-things-we-buy", "a2-words-materials"],
    frames: [
      say("How much does it cost?", "It costs {x} dollars.", "ten, twenty, thirty, forty, fifty"),
      say("What is the bag made of?", "It is made of {x}.", "leather, cotton, plastic, paper, wool"),
      say("Where can I buy bread?", "You can buy bread at the {x}. / At the {x}.", "bakery, supermarket, market, corner shop, caf\u00e9"),
      say("How would you like to pay?", "I would like to pay {x}. / I'll pay {x}.", "by card, in cash, by phone, with coins, with notes"),
      say("What size do you need?", "I need a {x}. / I need size {x}.", "small, medium, large, ten, twelve"),
      say("What did you buy yesterday?", "I bought {x}. / I bought {x} yesterday.", "a shirt, some apples, a book, new shoes, a present"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-technology",
    watchOut: {
      repeat: t(
        "*password* is stressed at the start. *keyboard* is *KEE-bord*. *electric* is *ih-LEK-trik*.",
        "*password* 重音在前。*keyboard* 读作 *KEE-bord*。*electric* 读作 *ih-LEK-trik*。",
      ),
      read: t(
        "Keep the *-ed* of *deleted* and *downloaded* as an extra beat. Say *messages* with three beats, *MES-ij-iz*.",
        "*deleted*、*downloaded* 的 *-ed* 要多读一拍。*messages* 读三拍，*MES-ij-iz*。",
      ),
      say: t(
        "Say *I use it to*, then a verb, or *I use it for*, then a noun: *to take photos*, *for homework*. Keep *hours* after the number.",
        "*I use it to* 后接动词，*I use it for* 后接名词：*to take photos*、*for homework*。数字后要说 *hours*。",
      ),
    },
    title: t("Speaking: Technology", "口语：科技"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“科技”的词汇，并朗读句子。"),
    listening: "a2-listening-technology",
    words: ["a2-words-technology", "a2-words-using-tech", "a2-words-communication", "a2-words-machines", "a2-words-sounds-and-messages"],
    frames: [
      say(
        "What do you use your phone for?",
        "I use it to {x}. / I use my phone to {x}.",
        "call my friends, take photos, listen to music, play games, send messages",
      ),
      say(
        "How long do you spend online every day?",
        "I spend {x} hours online. / I spend about {x} hours online. / I spend {x} hours online every day.",
        "two, three, four, five, six",
      ),
      say("What do you use your computer for?", "I use it for {x}. / I use my computer for {x}.", "homework, games, music, films, emails"),
      say(
        "How do you talk to your friends?",
        "I {x}. / I talk to them when I {x}.",
        "send messages, call them, use video chat, write emails, meet them",
      ),
      say(
        "What app do you use most?",
        "I use {x} most. / I use {x} the most.",
        "a music app, a map app, a game app, a photo app, a chat app",
      ),
      say(
        "How often do you check your phone?",
        "I check it {x}. / I check my phone {x}.",
        "every hour, every morning, ten times a day, after school, all the time",
      ),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-festivals-and-celebrations",
    watchOut: {
      repeat: t(
        "*congratulations* has five beats, *kun-grach-uh-LAY-shunz*. *traditional* is *truh-DISH-uh-nul*. *anniversary* is *an-ih-VER-suh-ree*.",
        "*congratulations* 读五拍，*kun-grach-uh-LAY-shunz*。*traditional* 读作 *truh-DISH-uh-nul*。*anniversary* 读作 *an-ih-VER-suh-ree*。",
      ),
      read: t(
        "Keep the *-ed* endings: *celebrated* with a beat, *decorated* with a beat. Say *embarrassed* as *im-BAR-ust*.",
        "保留 *-ed* 词尾：*celebrated*、*decorated* 都多一拍。*embarrassed* 读作 *im-BAR-ust*。",
      ),
      say: t(
        "Say *We eat*, *I give them*, *They wear*, then the thing. For the month, use *in*: *It is in February*.",
        "先说 *We eat*、*I give them*、*They wear*，再说东西。月份用 *in*：*It is in February*。",
      ),
    },
    title: t("Speaking: Festivals and Celebrations", "口语：节日和庆祝"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“节日和庆祝”的词汇，并朗读句子。"),
    listening: "a2-listening-festivals-and-celebrations",
    words: ["a2-words-festivals", "a2-words-wishes", "a2-words-feelings-2", "a2-words-people-together"],
    frames: [
      say(
        "What do you eat at the Spring Festival?",
        "We eat {x}. / We eat {x} at the Spring Festival.",
        "dumplings, fish, noodles, rice cakes, sweets",
      ),
      say("When is the festival?", "It is in {x}. / The festival is in {x}.", "January, February, April, September, December"),
      say(
        "What do you do on your birthday?",
        "I {x} on my birthday. / On my birthday, I {x}.",
        "have a party, eat cake, open presents, go out for dinner, see my friends",
      ),
      say("What do people wear at the festival?", "They wear {x}. / People wear {x}.", "red clothes, costumes, masks, new clothes, hats"),
      say("What do you give your friends?", "I give them {x}. / I give my friends {x}.", "cards, sweets, flowers, books, toys"),
      say("Where do you watch the fireworks?", "I watch them from the {x}. / From the {x}.", "park, roof, beach, bridge, window"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-jobs-and-dreams",
    watchOut: {
      repeat: t(
        "*engineer* is stressed at the end, *en-juh-NEER*. *mechanic* is *muh-KAN-ik*. *scientist* is *SY-un-tist*.",
        "*engineer* 重音在后，*en-juh-NEER*。*mechanic* 读作 *muh-KAN-ik*。*scientist* 读作 *SY-un-tist*。",
      ),
      read: t(
        "Say *university* in five beats, *yoo-nih-VER-sih-tee*. Keep the *s* of *works* and *earns* after *he* or *she*.",
        "*university* 读五拍，*yoo-nih-VER-sih-tee*。*he*、*she* 后的 *works*、*earns* 要带 *s*。",
      ),
      say: t(
        "Say *I want to be a*, then the job. For reasons, start with *Because I want to*. Workplaces keep *a* or *an*: *in an office*.",
        "先说 *I want to be a* 再说职业。说原因以 *Because I want to* 开头。工作地点保留 *a* 或 *an*：*in an office*。",
      ),
    },
    title: t("Speaking: Jobs and Dreams", "口语：工作和梦想"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“工作和梦想”的词汇，并朗读句子。"),
    listening: "a2-listening-jobs-and-dreams",
    words: ["a2-words-jobs-2", "a2-words-work-life", "a2-words-ambitions", "a2-words-everyday-ideas"],
    frames: [
      say(
        "What do you want to be in the future?",
        "I want to be a {x}. / I want to be a {x} in the future.",
        "pilot, scientist, chef, vet, singer",
      ),
      say(
        "Why do you want to be a doctor?",
        "Because I want to {x}. / I want to {x}.",
        "help sick people, work in a hospital, save lives, learn about medicine, help children",
      ),
      say(
        "Where would you like to work?",
        "I would like to work in {x}. / I'd like to work in {x}.",
        "a hospital, a school, an office, a shop, a studio",
      ),
      say(
        "What do you want to learn?",
        "I want to learn {x}. / I want to learn how to play {x}.",
        "the guitar, the piano, chess, tennis, the drums",
      ),
      say(
        "What is your dream?",
        "My dream is to {x}. / I want to {x}.",
        "travel the world, write a book, be famous, help people, live by the sea",
      ),
      say("How many hours does a nurse work?", "A nurse works {x} hours a day. / About {x} hours.", "eight, nine, ten, eleven, twelve"),
    ],
  }),
].flat();
