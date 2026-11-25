// The speaking topics of B1 (S2–S4): in each unit, after its listening, the words of four of its vocabulary topics
// said after a recording, their sentences read aloud, and questions on its theme answered aloud in a full sentence with
// a given word.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type SayFrame, say, type UnitSpeakingSpec, unitSpeaking } from "../speaking.ts";
import { units } from "./listening.ts";

const frames: Record<(typeof units)[number]["slug"], readonly SayFrame[]> = {
  "education-and-learning": [
    say(
      "Which subject do you find most difficult?",
      "I find {x} the most difficult. / {x} is the most difficult for me. / {x} is the most difficult subject for me.",
      "math, physics, chemistry, history, English",
    ),
    say(
      "How do you prepare for an exam?",
      "I {x} before an exam. / I prepare by trying to {x}. / I {x}.",
      "make flashcards, write summaries, do practice tests, study with friends, read my notes again",
    ),
    say(
      "Which subject do you enjoy most?",
      "I enjoy {x} most. / {x} is my favorite subject. / I like {x} the most.",
      "art, biology, geography, music, literature",
    ),
    say(
      "How do you learn new words?",
      "I learn new words by trying to {x}. / I {x}.",
      "read a lot, use a dictionary, write them down, use an app, watch films in English",
    ),
    say(
      "What would you change about your school?",
      "I would change {x}. / I would like to change {x}.",
      "the timetable, the uniform, the canteen food, the homework rules, the start time",
    ),
    say(
      "Who helps you most with your studies?",
      "My {x} helps me most. / I get most help from my {x}.",
      "teacher, mother, father, older sister, best friend",
    ),
  ],
  "work-and-careers": [
    say(
      "What job would you like to do in the future?",
      "I would like to be {x}. / I'd like to be {x} in the future. / I want to be {x}.",
      "a doctor, an engineer, a teacher, a lawyer, a designer",
    ),
    say(
      "What is most important to you in a job?",
      "{x} is the most important thing to me. / The most important thing is {x}. / For me, {x} is most important.",
      "a good salary, interesting work, friendly colleagues, free time, a short journey",
    ),
    say(
      "Would you prefer to work indoors or outdoors?",
      "I would prefer to work {x}. / I'd rather work {x}.",
      "indoors, outdoors, at home, in an office, in a garden",
    ),
    say(
      "What skill is most useful at work?",
      "{x} is the most useful skill. / I think {x} is most useful.",
      "teamwork, communication, problem solving, time management, creativity",
    ),
    say(
      "How many hours a week would you like to work?",
      "I would like to work {x} hours a week. / About {x} hours.",
      "twenty, thirty, thirty-five, forty, forty-five",
    ),
    say(
      "What kind of company would you like to work for?",
      "I would like to work for {x}. / I'd like to work for {x}.",
      "a big company, a small business, a charity, a hospital, a school",
    ),
  ],
  "health-and-fitness": [
    say(
      "What do you do to stay fit?",
      "I {x} to stay fit. / I stay fit by trying to {x}. / I {x}.",
      "go running, swim, play football, go to the gym, ride my bike",
    ),
    say("What healthy food do you like?", "I like {x}. / I really like {x}. / I like eating {x}.", "fish, vegetables, fruit, salad, nuts"),
    say("How many hours of sleep do you need?", "I need {x} hours of sleep. / I need about {x} hours.", "six, seven, eight, nine, ten"),
    say(
      "What do you eat when you want to be healthy?",
      "I eat {x}. / I try to eat {x}.",
      "more vegetables, less sugar, fresh fruit, whole grains, more fish",
    ),
    say(
      "What do you do when you feel stressed?",
      "I {x} when I feel stressed. / I {x}.",
      "go for a walk, listen to music, talk to a friend, do yoga, take a hot bath",
    ),
    say(
      "How often do you go to the gym?",
      "I go to the gym {x}. / I go {x}.",
      "every day, twice a week, three times a week, once a week, every weekend",
    ),
  ],
  "the-environment": [
    say(
      "What do you do to help the environment?",
      "I {x} to help the environment. / I help by trying to {x}. / I {x}.",
      "recycle paper, save water, walk to school, turn off the lights, use a reusable bag",
    ),
    say(
      "What is the biggest environmental problem where you live?",
      "The biggest problem is {x}. / {x} is the biggest problem. / I think {x} is the biggest problem.",
      "air pollution, plastic waste, traffic, noise, dirty rivers",
    ),
    say(
      "How do you travel to save energy?",
      "I travel {x} to save energy. / I usually go {x}.",
      "by bike, on foot, by bus, by train, by tram",
    ),
    say(
      "What can schools do for the environment?",
      "Schools can {x}. / They can {x}.",
      "plant trees, recycle paper, save water, use solar power, grow vegetables",
    ),
    say(
      "Which animal is most in danger?",
      "I think the {x} is most in danger. / The {x} is most in danger.",
      "tiger, polar bear, panda, elephant, gorilla",
    ),
    say("What do you recycle at home?", "I recycle {x} at home. / We recycle {x}.", "paper, plastic bottles, glass, cans, old clothes"),
  ],
  "media-and-news": [
    say(
      "Where do you get your news?",
      "I get my news from {x}. / I usually get my news from {x}.",
      "the radio, a news app, the newspaper, the television, the internet",
    ),
    say(
      "What kind of news interests you most?",
      "{x} interests me most. / I am most interested in {x}. / I like {x} most.",
      "sports news, science news, local news, world news, entertainment news",
    ),
    say(
      "How often do you read the news?",
      "I read the news {x}. / I read it {x}.",
      "every day, every morning, once a week, on weekends, now and then",
    ),
    say(
      "Which TV program do you watch most?",
      "I watch {x} most. / I mostly watch {x}.",
      "the news, quiz shows, documentaries, cooking shows, sports programs",
    ),
    say("Do you trust news on social media?", "I trust it {x}. / I {x} trust it.", "sometimes, rarely, never, often, usually"),
    say(
      "What would you write about as a journalist?",
      "I would write about {x}. / I'd write about {x}.",
      "sport, politics, music, travel, science",
    ),
  ],
  "technology-in-our-lives": [
    say(
      "Which device do you use most?",
      "I use my {x} most. / My {x} is the device I use most. / I use my {x} the most.",
      "phone, laptop, tablet, computer, smartwatch",
    ),
    say(
      "What do you usually do online?",
      "I usually {x} online. / Online I usually {x}. / I {x}.",
      "watch videos, chat with friends, read the news, play games, do my homework",
    ),
    say(
      "What would you do without your phone?",
      "I would {x}. / Without my phone, I would {x}.",
      "read more, talk to people, go outside, get bored, feel lost",
    ),
    say(
      "Which app could you not live without?",
      "I could not live without {x}. / I couldn't live without {x}.",
      "my music app, my map app, my messaging app, my camera, my calendar",
    ),
    say(
      "How do you keep your data safe?",
      "I keep it safe by trying to {x}. / I {x}.",
      "use strong passwords, update my phone, avoid strange links, back up my files, lock my screen",
    ),
    say(
      "How many hours do you spend on screens?",
      "I spend {x} hours a day on screens. / About {x} hours a day.",
      "two, three, four, five, six",
    ),
  ],
  "travel-and-culture": [
    say(
      "Which country would you most like to visit?",
      "I would most like to visit {x}. / I'd like to visit {x}. / I want to visit {x}.",
      "Japan, Italy, Brazil, Canada, Egypt",
    ),
    say("How do you prefer to travel?", "I prefer to travel by {x}. / I like traveling by {x}.", "train, plane, car, bus, boat"),
    say(
      "What do you always pack for a trip?",
      "I always pack {x}. / I never travel without {x}.",
      "a phone charger, a good book, sunscreen, a map, a warm jacket",
    ),
    say(
      "Where would you like to stay on holiday?",
      "I would like to stay in {x}. / I'd like to stay in {x}.",
      "a hotel, a tent, a small flat, a farmhouse, a cabin by a lake",
    ),
    say(
      "What do you like to try in another country?",
      "I like to try {x}. / I always try {x}.",
      "the local food, the language, the music, the markets, the festivals",
    ),
    say(
      "Where did you go on your last trip?",
      "I went to {x}. / My last trip was to {x}.",
      "the coast, the mountains, a big city, my grandparents' village, another country",
    ),
  ],
  relationships: [
    say(
      "What do you like doing with your friends?",
      "I like {x} with my friends. / With my friends I like {x}. / I like {x}.",
      "playing games, going to the cinema, cooking, playing football, talking",
    ),
    say(
      "What kind of person is your best friend?",
      "My best friend is {x}. / He is {x}. / She is {x}.",
      "funny, kind, honest, clever, friendly",
    ),
    say(
      "How do you keep in touch with old friends?",
      "I keep in touch by trying to {x}. / I {x}.",
      "send messages, call them, meet for coffee, write emails, visit them",
    ),
    say(
      "What makes a good friend?",
      "{x} makes a good friend. / A good friend needs {x}.",
      "honesty, kindness, loyalty, patience, a sense of humor",
    ),
    say(
      "Who do you talk to when you have a problem?",
      "I talk to my {x}. / I usually talk to my {x}.",
      "mother, father, best friend, sister, brother",
    ),
    say(
      "What do you argue about with your family?",
      "We argue about {x}. / We sometimes argue about {x}.",
      "housework, money, homework, my phone, the TV",
    ),
  ],
  "cities-and-transport": [
    say("How do you usually get to school or work?", "I usually go by {x}. / I usually get there by {x}.", "bus, train, bike, car, tram"),
    say(
      "What is your favorite place in your city?",
      "My favorite place is the {x}. / I like the {x} best. / The {x} is my favorite place.",
      "park, museum, library, market, river",
    ),
    say(
      "What is the worst thing about traffic in your city?",
      "The worst thing is {x}. / I think {x} is the worst thing.",
      "the noise, the air, the delays, the parking, the crowded buses",
    ),
    say(
      "What would make your city better?",
      "{x} would make it better. / I think {x} would make it better.",
      "more parks, cleaner streets, cheaper buses, more bike lanes, less traffic",
    ),
    say(
      "How long is your journey to school?",
      "It takes {x} minutes. / My journey takes about {x} minutes.",
      "ten, fifteen, twenty, thirty, forty",
    ),
    say(
      "What is the biggest problem in your city?",
      "The biggest problem is {x}. / I think it is {x}.",
      "traffic, pollution, noise, high rents, crowded buses",
    ),
  ],
  "science-and-discovery": [
    say(
      "Which science do you find most interesting?",
      "I find {x} the most interesting. / {x} is the most interesting for me. / I like {x} best.",
      "biology, physics, chemistry, astronomy, geology",
    ),
    say(
      "Which invention could you not live without?",
      "I could not live without {x}. / I couldn't live without {x}.",
      "the internet, my phone, electricity, the fridge, the washing machine",
    ),
    say(
      "Which scientist do you admire most?",
      "I admire {x} most. / I most admire {x}.",
      "Marie Curie, Albert Einstein, Isaac Newton, Charles Darwin, Ada Lovelace",
    ),
    say(
      "What would you like to discover?",
      "I would like to discover {x}. / I'd like to discover {x}.",
      "a new planet, a cure for cancer, a new animal, clean energy, life on Mars",
    ),
    say(
      "Which science lesson do you remember best?",
      "I remember the lesson on {x} best. / The one on {x}.",
      "the solar system, volcanoes, the human heart, electricity, plants",
    ),
    say(
      "Where would you like to do research?",
      "I would like to do research in {x}. / In {x}.",
      "the Arctic, the rainforest, the ocean, space, a big laboratory",
    ),
  ],
  "money-and-consumers": [
    say(
      "What do you spend most of your money on?",
      "I spend most of my money on {x}. / Most of my money goes on {x}.",
      "food, clothes, books, games, travel",
    ),
    say(
      "Where do you like shopping?",
      "I like shopping {x}. / I prefer shopping {x}. / I usually shop {x}.",
      "online, at the market, in small shops, in the mall, at the supermarket",
    ),
    say(
      "How do you save money?",
      "I save money by trying to {x}. / I {x}.",
      "cook at home, walk instead of driving, buy second-hand clothes, compare prices, avoid eating out",
    ),
    say(
      "What was the last thing you bought online?",
      "The last thing I bought online was {x}. / I bought {x}.",
      "a book, some shoes, a phone case, a game, a jacket",
    ),
    say(
      "How do you usually pay in shops?",
      "I usually pay {x}. / I pay {x}.",
      "by card, in cash, with my phone, by bank transfer, with a voucher",
    ),
    say("What would you buy with a lot of money?", "I would buy {x}. / I'd buy {x}.", "a house, a car, a boat, a plane ticket, a farm"),
  ],
  "arts-and-entertainment": [
    say(
      "What kind of films do you like?",
      "I like {x}. / I really like {x}. / I enjoy {x}.",
      "comedies, action films, cartoons, horror films, documentaries",
    ),
    say(
      "What do you like doing in the evening?",
      "I like {x} in the evening. / In the evening I like {x}. / I like {x}.",
      "reading, watching films, listening to music, drawing, playing the guitar",
    ),
    say("What kind of music do you listen to?", "I listen to {x}. / I mostly listen to {x}.", "pop, rock, jazz, classical music, hip hop"),
    say(
      "Which instrument would you like to learn?",
      "I would like to learn {x}. / I'd like to learn {x}.",
      "the piano, the guitar, the violin, the drums, the saxophone",
    ),
    say(
      "Where do you like watching films?",
      "I like watching films {x}. / I prefer watching them {x}.",
      "at the cinema, at home, on my laptop, with friends, outdoors",
    ),
    say(
      "What was the last concert you went to?",
      "The last concert was {x}. / I went to {x}.",
      "a rock concert, a jazz concert, a school concert, an opera, a festival",
    ),
  ],
};

/** watchOuts are the Watch outs of the speaking topics, by unit. */
const watchOuts: Record<(typeof units)[number]["slug"], NonNullable<UnitSpeakingSpec["watchOut"]>> = {
  "education-and-learning": {
    repeat: t(
      "*semester* is *suh-MES-ter*. *knowledge* is *NOL-ij*, with a silent *k*. *certificate* is *ser-TIF-ih-kut*.",
      "*semester* 读作 *suh-MES-ter*。*knowledge* 读作 *NOL-ij*，*k* 不发音。*certificate* 读作 *ser-TIF-ih-kut*。",
    ),
    read: t(
      "Stress moves in word families: *EX-plain* is *ex-PLAIN*, but *ex-pluh-NAY-shun*. Keep the *-ed* of *submitted* and *corrected* as a beat.",
      "同族词重音会移动：*explain* 是 *ex-PLAIN*，*explanation* 是 *ex-pluh-NAY-shun*。*submitted*、*corrected* 的 *-ed* 要多读一拍。",
    ),
    say: t(
      "After *by trying to*, use the plain verb: *by trying to make flashcards*. Keep *the most* with *difficult*: *I find math the most difficult*.",
      "*by trying to* 后用动词原形：*by trying to make flashcards*。*difficult* 前要说 *the most*：*I find math the most difficult*。",
    ),
  },
  "work-and-careers": {
    repeat: t(
      "*qualification* is *kwol-ih-fih-KAY-shun*. *schedule* can be *SKED-jool* or *SHED-yool*. *headquarters* is stressed on *QUAR*.",
      "*qualification* 读作 *kwol-ih-fih-KAY-shun*。*schedule* 可读 *SKED-jool* 或 *SHED-yool*。*headquarters* 重音在 *QUAR*。",
    ),
    read: t(
      "*sign* has a silent *g*, but *signature* says it: *SIG-nuh-cher*. Keep the *s* of *requires* and *invests* after a singular subject.",
      "*sign* 的 *g* 不发音，*signature* 却要读出来：*SIG-nuh-cher*。单数主语后 *requires*、*invests* 要带 *s*。",
    ),
    say: t(
      "Jobs take *a* or *an*: *an engineer*, *a lawyer*. After *I'd rather* use the plain verb with no *to*: *I'd rather work outdoors*.",
      "职业前用 *a* 或 *an*：*an engineer*、*a lawyer*。*I'd rather* 后接动词原形，不加 *to*：*I'd rather work outdoors*。",
    ),
  },
  "health-and-fitness": {
    repeat: t(
      "*surgeon* is *SUR-jun*. *vaccine* is *vak-SEEN*. *diagnose* is stressed at the end in the US, *dy-ug-NOHS*.",
      "*surgeon* 读作 *SUR-jun*。*vaccine* 读作 *vak-SEEN*。*diagnose* 美式重音在后，*dy-ug-NOHS*。",
    ),
    read: t(
      "*vitamin* is *VY-tuh-min*. Say *calories* with three beats. Do not drop the *-ed* of *balanced*; it ends in a short *t*.",
      "*vitamin* 读作 *VY-tuh-min*。*calories* 读三拍。*balanced* 的 *-ed* 不要丢，结尾是短促的 *t*。",
    ),
    say: t(
      "Frequencies go at the end: *I go to the gym twice a week*. Say *hours of sleep* with *of*, and *to stay fit* with *to*.",
      "频率放在句末：*I go to the gym twice a week*。*hours of sleep* 别漏 *of*，*to stay fit* 别漏 *to*。",
    ),
  },
  "the-environment": {
    repeat: t(
      "*habitat* is *HAB-ih-tat*. *renewable* is *rih-NOO-uh-bul*. *sustainable* is *suh-STAY-nuh-bul*.",
      "*habitat* 读作 *HAB-ih-tat*。*renewable* 读作 *rih-NOO-uh-bul*。*sustainable* 读作 *suh-STAY-nuh-bul*。",
    ),
    read: t(
      "*endangered* has a short *d* at the end; *extinct* ends in *kt*. Read *recycle* and *reuse* with stress on the second beat.",
      "*endangered* 结尾是短促的 *d*，*extinct* 结尾是 *kt*。*recycle*、*reuse* 重音在第二拍。",
    ),
    say: t(
      "After *Schools can* use the plain verb: *Schools can plant trees*. Animals take *the*: *I think the tiger is most in danger*.",
      "*Schools can* 后接动词原形：*Schools can plant trees*。动物前用 *the*：*I think the tiger is most in danger*。",
    ),
  },
  "media-and-news": {
    repeat: t(
      "*documentary* is *dok-yuh-MEN-tuh-ree*. *episode* is *EP-ih-sohd*. *audience* is *AW-dee-uns*.",
      "*documentary* 读作 *dok-yuh-MEN-tuh-ree*。*episode* 读作 *EP-ih-sohd*。*audience* 读作 *AW-dee-uns*。",
    ),
    read: t(
      "*published* and *arrested* differ: a short *t*, then an extra *id* beat. *rob* and *robbed* must not sound the same.",
      "*published* 和 *arrested* 不同：一个是短促的 *t*，一个多出 *id* 一拍。*rob* 和 *robbed* 不能读得一样。",
    ),
    say: t(
      "Say *I get my news from*, with *from*. Frequencies come last: *I read the news every morning*. With *rarely* or *never*, no *don't*: *I rarely trust it*.",
      "说 *I get my news from*，别漏 *from*。频率放最后：*I read the news every morning*。用 *rarely*、*never* 时不再加 *don't*：*I rarely trust it*。",
    ),
  },
  "technology-in-our-lives": {
    repeat: t(
      "*privacy* is *PRY-vuh-see*. *anonymous* is *uh-NON-ih-mus*. *wireless* is *WIRE-lis*. *headphones* says *f* for *ph*.",
      "*privacy* 读作 *PRY-vuh-see*。*anonymous* 读作 *uh-NON-ih-mus*。*wireless* 读作 *WIRE-lis*。*headphones* 的 *ph* 读 *f*。",
    ),
    read: t(
      "*update* and *upgrade* stress the first beat as nouns. Say *crashed* with a short *t* and *installed* with a short *d*.",
      "*update*、*upgrade* 作名词时重音在前。*crashed* 结尾是短促的 *t*，*installed* 是短促的 *d*。",
    ),
    say: t(
      "Say *I use my phone most*, with *my*. After *I could not live without* comes a noun. For hours say *hours a day*.",
      "说 *I use my phone most*，别漏 *my*。*I could not live without* 后接名词。时长说 *hours a day*。",
    ),
  },
  "travel-and-culture": {
    repeat: t(
      "*itinerary* is *eye-TIN-uh-rer-ee*. *accommodation* is *uh-kom-uh-DAY-shun*. *heritage* is *HAIR-ih-tij*.",
      "*itinerary* 读作 *eye-TIN-uh-rer-ee*。*accommodation* 读作 *uh-kom-uh-DAY-shun*。*heritage* 读作 *HAIR-ih-tij*。",
    ),
    read: t(
      "*foreigner* has a silent *g*: *FOR-in-er*. *breathtaking* is stressed at the start. *cancelled* ends in a short *d*.",
      "*foreigner* 的 *g* 不发音：*FOR-in-er*。*breathtaking* 重音在前。*cancelled* 结尾是短促的 *d*。",
    ),
    say: t(
      "Say *by train*, *by plane* with no *the*. For places to stay keep *a*: *in a hotel*. A past trip takes *I went to*.",
      "*by train*、*by plane* 不加 *the*。住处保留 *a*：*in a hotel*。过去的旅行用 *I went to*。",
    ),
  },
  relationships: {
    repeat: t(
      "*acquaintance* is *uh-KWAYN-tuns*. *considerate* is *kun-SID-er-ut*. *ancestor* is *AN-ses-ter*.",
      "*acquaintance* 读作 *uh-KWAYN-tuns*。*considerate* 读作 *kun-SID-er-ut*。*ancestor* 读作 *AN-ses-ter*。",
    ),
    read: t(
      "Feelings ending in *-ed* keep the ending: *disappointed* and *frustrated* add a beat, *ashamed* and *relieved* end in *d*.",
      "以 *-ed* 结尾的感受词要保留词尾：*disappointed*、*frustrated* 多一拍，*ashamed*、*relieved* 结尾是 *d*。",
    ),
    say: t(
      "After *I like* use the *-ing* form: *I like playing games*. Say *a sense of humor* with *a* and *of*. Use *He is* or *She is* for your friend.",
      "*I like* 后用 *-ing* 形式：*I like playing games*。*a sense of humor* 别漏 *a* 和 *of*。说朋友用 *He is* 或 *She is*。",
    ),
  },
  "cities-and-transport": {
    repeat: t(
      "*pedestrian* is *puh-DES-tree-un*. *architecture* is *AR-kih-tek-cher*. *congestion* is *kun-JES-chun*.",
      "*pedestrian* 读作 *puh-DES-tree-un*。*architecture* 读作 *AR-kih-tek-cher*。*congestion* 读作 *kun-JES-chun*。",
    ),
    read: t(
      "*commute* is stressed at the end, *kuh-MYOOT*. *overcrowded* has four beats. Keep *the* in *the rush hour*.",
      "*commute* 重音在后，*kuh-MYOOT*。*overcrowded* 读四拍。*the rush hour* 保留 *the*。",
    ),
    say: t(
      "Say *by bus*, *by bike*. Places keep *the*: *My favorite place is the park*. Journeys take *It takes ... minutes*.",
      "说 *by bus*、*by bike*。地点保留 *the*：*My favorite place is the park*。路程用 *It takes ... minutes*。",
    ),
  },
  "science-and-discovery": {
    repeat: t(
      "*hypothesis* is *hy-POTH-uh-sis*. *astronomer* is *uh-STRON-uh-mer*. *particle* is *PAR-tih-kul*.",
      "*hypothesis* 读作 *hy-POTH-uh-sis*。*astronomer* 读作 *uh-STRON-uh-mer*。*particle* 读作 *PAR-tih-kul*。",
    ),
    read: t(
      "*analyze* is *AN-uh-lyz*, but *analysis* is *uh-NAL-ih-sis*. *chemical* starts with *k*. *launched* ends in *cht*.",
      "*analyze* 读作 *AN-uh-lyz*，*analysis* 读作 *uh-NAL-ih-sis*。*chemical* 以 *k* 开头。*launched* 结尾读 *cht*。",
    ),
    say: t(
      "After *the lesson on* comes a topic with *the*: *the solar system*. Say *I would like to discover* with *to*, then a noun.",
      "*the lesson on* 后的主题带 *the*：*the solar system*。说 *I would like to discover*，别漏 *to*，再接名词。",
    ),
  },
  "money-and-consumers": {
    repeat: t(
      "*guarantee* is *gair-un-TEE*. *warranty* is *WOR-un-tee*. *luxury* is *LUK-shuh-ree*. *courier* is *KUR-ee-er*.",
      "*guarantee* 读作 *gair-un-TEE*。*warranty* 读作 *WOR-un-tee*。*luxury* 读作 *LUK-shuh-ree*。*courier* 读作 *KUR-ee-er*。",
    ),
    read: t(
      "*purchase* is *PUR-chus*, not *chase*. *afford* is stressed on *FORD*. *withdrew* and *withdrawn* keep their vowels.",
      "*purchase* 读作 *PUR-chus*，不是 *chase*。*afford* 重音在 *FORD*。*withdrew*、*withdrawn* 元音要读准。",
    ),
    say: t(
      "Say *I spend most of my money on*, with *on*. Paying takes *by card*, *in cash*, *with my phone*. After *by trying to* use the plain verb.",
      "说 *I spend most of my money on*，别漏 *on*。付款用 *by card*、*in cash*、*with my phone*。*by trying to* 后接动词原形。",
    ),
  },
  "arts-and-entertainment": {
    repeat: t(
      "*sculpture* is *SKULP-cher*. *orchestra* is *OR-kis-truh*. *biography* is *by-OG-ruh-fee*. *masterpiece* is stressed at the start.",
      "*sculpture* 读作 *SKULP-cher*。*orchestra* 读作 *OR-kis-truh*。*biography* 读作 *by-OG-ruh-fee*。*masterpiece* 重音在前。",
    ),
    read: t(
      "*photography* is *fuh-TOG-ruh-fee*, unlike *PHOH-tuh-graf*. *rehearsed* ends in *st*. *lyrics* is *LIR-iks*.",
      "*photography* 读作 *fuh-TOG-ruh-fee*，与 *photograph* 的 *PHOH-tuh-graf* 不同。*rehearsed* 结尾读 *st*。*lyrics* 读作 *LIR-iks*。",
    ),
    say: t(
      "Instruments take *the*: *I would like to learn the piano*. Kinds of films are plural: *comedies*, *documentaries*. Past concerts take *I went to*.",
      "乐器前用 *the*：*I would like to learn the piano*。电影类型用复数：*comedies*、*documentaries*。过去的音乐会用 *I went to*。",
    ),
  },
};

/** topics are the speaking topics of the units of B1, two to a unit, in their order. */
export const topics: readonly TopicDef[] = units.flatMap((u) =>
  unitSpeaking({
    id: `b1-speaking-${u.slug}`,
    title: t(`Speaking: ${u.en}`, `口语：${u.zh}`),
    summary: t("Say the unit's words, and read its sentences aloud.", `说出“${u.zh}”的词汇，并朗读句子。`),
    listening: `b1-listening-${u.slug}`,
    words: u.words,
    frames: frames[u.slug],
    watchOut: watchOuts[u.slug],
  }),
);
