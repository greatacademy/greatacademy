// The speaking topics of A1 (S2–S4): in each unit, after its listening, the unit's words said after a recording,
// its sentences read aloud, and questions on its theme answered aloud in a full sentence with a given word.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { say, unitSpeaking } from "../speaking.ts";
// The modules whose vocabulary topics the speaking says, built before it.
import "./topics.ts";

/** topics are the speaking topics of the units of A1, in their order. */
export const topics: readonly TopicDef[] = [
  unitSpeaking({
    id: "a1-speaking-all-about-me",
    watchOut: {
      repeat: t(
        "Stress the end of *thirteen* to *nineteen* and the start of *thirty* to *fifty*. Say the *th* of *thirty* with your tongue between your teeth, not as *s*.",
        "*thirteen* 到 *nineteen* 重音在后，*thirty* 到 *fifty* 重音在前。*thirty* 的 *th* 要把舌头放在齿间，不要发成 *s*。",
      ),
      read: t(
        "Do not drop the *s* of *speaks* or *lives* after *he* or *she*. Say *English* and *Chinese* with the stress on *ENG* and *NESE*.",
        "*he*、*she* 后面的 *speaks*、*lives* 不要丢掉 *s*。*English* 重音在 *ENG*，*Chinese* 重音在 *NESE*。",
      ),
      say: t(
        "Start with *I am* or *My name is*, not the word alone. For brothers, say the plural *brothers* with a clear *z* at the end.",
        "用 *I am* 或 *My name is* 开头，不要只说那个词。说兄弟时，复数 *brothers* 结尾的 *z* 要清楚。",
      ),
    },
    title: t("Speaking: All About Me", "口语：关于我"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“关于我”的词汇，并朗读句子。"),
    listening: "a1-listening-all-about-me",
    words: ["a1-words-numbers-to-hundred", "a1-words-about-me", "a1-words-feelings", "a1-words-everyday-words", "a1-words-little-words-3"],
    frames: [
      say("How old are you?", "I am {x}. / I am {x} years old.", "nine, ten, eleven, twelve, thirteen"),
      say("Where are you from?", "I am from {x}.", "China, Brazil, Spain, Canada, Japan"),
      say("What is your name?", "My name is {x}. / I am {x}.", "Tom, Anna, Leo, Mia, Sam"),
      say("How many brothers do you have?", "I have {x} brothers. / I have got {x} brothers.", "two, three, four, five, six"),
      say("What color are your eyes?", "My eyes are {x}. / They are {x}.", "brown, blue, green, gray, black"),
      say("What can you do?", "I can {x}.", "swim, sing, dance, draw, cook"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-my-day",
    watchOut: {
      repeat: t(
        "Say *breakfast* as *BREK-fust*, not break-fast. Link *get up* into *ge-tup*, and keep the *s* of *always* soft as *z*.",
        "*breakfast* 读作 *BREK-fust*，不是 break-fast。*get up* 连读成 *ge-tup*，*always* 里的 *s* 读作柔和的 *z*。",
      ),
      read: t(
        "After *he* and *she*, verbs take *s*: *gets*, *goes*, *watches*. Say *watches* with two beats, *WOCH-iz*.",
        "*he*、*she* 后面的动词要加 *s*：*gets*、*goes*、*watches*。*watches* 读两拍，*WOCH-iz*。",
      ),
      say: t(
        "Put the frequency word before the verb: *I usually walk*, not *I walk usually*. Say *o'clock* clearly after the number.",
        "频率词放在动词前：*I usually walk*，不是 *I walk usually*。数字后的 *o'clock* 要说清楚。",
      ),
    },
    title: t("Speaking: My Day", "口语：我的一天"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“我的一天”的词汇，并朗读句子。"),
    listening: "a1-listening-my-day",
    words: ["a1-words-my-day", "a1-words-times-of-day", "a1-words-how-often", "a1-words-little-words-1"],
    frames: [
      say("What time do you get up?", "I get up at {x}. / I get up at {x} o'clock.", "six, seven, eight, nine, ten"),
      say("Do you walk to school?", "I {x} walk to school.", "always, usually, often, sometimes, never"),
      say("What time do you go to bed?", "I go to bed at {x}. / I go to bed at {x} o'clock.", "eight, nine, ten, eleven, twelve"),
      say(
        "What do you do after school?",
        "I {x} after school. / After school, I {x}.",
        "play football, do my homework, watch TV, read a book, play games",
      ),
      say("When do you have lunch?", "I have lunch at {x}. / I have lunch at {x} o'clock.", "eleven, twelve, one, two, three"),
      say("How often do you read before bed?", "I {x} read before bed.", "always, usually, often, sometimes, never"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-time-and-dates",
    watchOut: {
      repeat: t(
        "*Wednesday* is *WENZ-day*; the first *d* is silent. *February* is *FEB-roo-er-ee*. Say *twelfth* with all its final sounds, *lfth*.",
        "*Wednesday* 读作 *WENZ-day*，第一个 *d* 不发音。*February* 读作 *FEB-roo-er-ee*。*twelfth* 结尾的 *lfth* 要读全。",
      ),
      read: t(
        "Read dates as *the fifth of May*, with *the* and *of*. The *th* of ordinals is soft: *fifth*, *sixth*, *tenth*.",
        "日期读作 *the fifth of May*，带上 *the* 和 *of*。序数词结尾的 *th* 要轻柔：*fifth*、*sixth*、*tenth*。",
      ),
      say: t(
        "Use *in* with months and *on* with days: *in October*, *on Saturday*. For habits, say *on Mondays* with the *z* at the end.",
        "月份前用 *in*，星期前用 *on*：*in October*、*on Saturday*。说习惯时用 *on Mondays*，结尾有 *z*。",
      ),
    },
    title: t("Speaking: Time and Dates", "口语：时间和日期"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“时间和日期”的词汇，并朗读句子。"),
    listening: "a1-listening-time-and-dates",
    words: ["a1-words-time", "a1-words-days", "a1-words-months", "a1-words-dates", "a1-words-ordinals"],
    frames: [
      say("When is your birthday?", "My birthday is in {x}. / It is in {x}.", "January, March, May, July, October"),
      say("What day is it today?", "It is {x}. / Today is {x}. / It is {x} today.", "Monday, Tuesday, Wednesday, Thursday, Friday"),
      say("What month is it?", "It is {x}. / It is {x} now.", "April, June, August, September, November"),
      say("What time is it?", "It is {x} o'clock. / It is {x}.", "one, two, three, four, five"),
      say("What day is your party?", "It is on {x}. / My party is on {x}.", "Saturday, Sunday, Monday, Friday, Wednesday"),
      say("When do you go swimming?", "I go swimming on {x}. / On {x}.", "Mondays, Tuesdays, Thursdays, Saturdays, Sundays"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-food-and-drink",
    watchOut: {
      repeat: t(
        "*vegetable* has three beats, *VEJ-tuh-bul*. *tomato* is *tuh-MAY-toh* or *tuh-MAH-toh*. Keep the *k* of *knife* silent.",
        "*vegetable* 读三拍，*VEJ-tuh-bul*。*tomato* 读作 *tuh-MAY-toh* 或 *tuh-MAH-toh*。*knife* 的 *k* 不发音。",
      ),
      read: t(
        "Say the small words *some* and *any* lightly but clearly. *bread* rhymes with *red*, not with *read* in the present.",
        "*some*、*any* 这些小词轻读但要清楚。*bread* 与 *red* 押韵，不要读成现在时的 *read*。",
      ),
      say: t(
        "Say *I would like*, or *I'd like*, then the food: *I'd like some fish*. Add *please* at the end of a request; keep *a* or *some* before the food.",
        "先说 *I would like* 或 *I'd like*，再说食物：*I'd like some fish*。提出请求时句末加 *please*，食物前保留 *a* 或 *some*。",
      ),
    },
    title: t("Speaking: Food and Drink", "口语：食物和饮料"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“食物和饮料”的词汇，并朗读句子。"),
    listening: "a1-listening-food-and-drink",
    words: ["a1-words-food", "a1-words-drinks", "a1-words-meals", "a1-words-favorite-foods"],
    frames: [
      say(
        "What would you like to drink?",
        "I would like some {x}, please. / I would like {x}, please. / I would like some {x}. / I would like {x}.",
        "water, milk, juice, tea, coffee",
      ),
      say("What do you have for breakfast?", "I have {x} for breakfast. / I have {x}.", "eggs, bread, rice, fruit, noodles"),
      say("What is your favorite fruit?", "My favorite fruit is {x}. / I like {x}.", "apples, bananas, oranges, grapes, pears"),
      say("What do you have for lunch?", "I have {x} for lunch. / I have {x}.", "soup, rice, a sandwich, pasta, chicken"),
      say("Do you like vegetables?", "I like {x}. / Yes, I like {x}.", "carrots, beans, tomatoes, potatoes, peas"),
      say("What would you like to eat?", "I would like {x}, please. / I'd like {x}.", "a pizza, a burger, some fish, some cake, an egg"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-clothes-and-shopping",
    watchOut: {
      repeat: t(
        "*clothes* is one beat, close to *klohz*. *expensive* is *ik-SPEN-siv*. Finish the *t* of *shirt* and *skirt*.",
        "*clothes* 只读一拍，接近 *klohz*。*expensive* 读作 *ik-SPEN-siv*。*shirt*、*skirt* 结尾的 *t* 要发出来。",
      ),
      read: t(
        "*pants* and *shoes* are plural; keep their final *s* and *z*. Say *dollars* with the *z* at the end, never *dollar*.",
        "*pants*、*shoes* 是复数，结尾的 *s*、*z* 要保留。*dollars* 结尾要有 *z*，不要说成 *dollar*。",
      ),
      say: t(
        "Shoes take *They are*; one T-shirt takes *It is*. Say the number, then *dollars*: *They are forty dollars*.",
        "鞋子用 *They are*，一件 T 恤用 *It is*。先说数字，再说 *dollars*：*They are forty dollars*。",
      ),
    },
    title: t("Speaking: Clothes and Shopping", "口语：衣服和购物"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“衣服和购物”的词汇，并朗读句子。"),
    listening: "a1-listening-clothes-and-shopping",
    words: ["a1-words-clothes", "a1-words-shopping", "a1-words-at-the-shop"],
    frames: [
      say(
        "What are you wearing today?",
        "I am wearing {x}. / I am wearing {x} today.",
        "a blue shirt, a red dress, jeans, a black coat, a green hat",
      ),
      say("How much is the T-shirt?", "It is {x} dollars. / The T-shirt is {x} dollars.", "five, ten, twelve, fifteen, twenty"),
      say("What color is your coat?", "My coat is {x}. / It is {x}.", "red, blue, black, green, yellow"),
      say("What do you want to buy?", "I want to buy {x}. / I want {x}.", "a hat, a dress, some shoes, a bag, a jacket"),
      say("How much are the shoes?", "They are {x} dollars. / The shoes are {x} dollars.", "twenty, thirty, forty, fifty, sixty"),
      say("What do you wear when it is cold?", "I wear {x}. / I wear {x} when it is cold.", "a coat, a scarf, boots, gloves, a sweater"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-home",
    watchOut: {
      repeat: t(
        "*cupboard* is *KUB-erd*; the *p* is silent. *apartment* is *uh-PART-ment*. Say *stairs* with a clear *z*.",
        "*cupboard* 读作 *KUB-erd*，*p* 不发音。*apartment* 读作 *uh-PART-ment*。*stairs* 结尾的 *z* 要清楚。",
      ),
      read: t(
        "Link *There is a* smoothly, and keep *there are* for more than one. Do not skip *the* before rooms: *in the kitchen*.",
        "*There is a* 要连贯读出，多个东西用 *there are*。房间前不要漏 *the*：*in the kitchen*。",
      ),
      say: t(
        "Say *in the*, not just *in*: *It is in the garden*. For rooms, say the number then *rooms*: *There are five rooms*.",
        "要说 *in the*，不是只说 *in*：*It is in the garden*。说房间数先说数字再说 *rooms*：*There are five rooms*。",
      ),
    },
    title: t("Speaking: Home", "口语：家"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“家”的词汇，并朗读句子。"),
    listening: "a1-listening-home",
    words: ["a1-words-home", "a1-words-things-at-home", "a1-words-housework"],
    frames: [
      say("Where is your cat?", "My cat is in the {x}. / It is in the {x}.", "living room, kitchen, bedroom, bathroom, garden"),
      say(
        "How many rooms are there in your home?",
        "There are {x} rooms. / There are {x} rooms in my home.",
        "three, four, five, six, seven",
      ),
      say("Where do you live?", "I live in {x}. / I live in {x} with my family.", "a house, a flat, a big city, a small town, a village"),
      say("Where is the sofa?", "It is in the {x}. / The sofa is in the {x}.", "living room, kitchen, bedroom, hall, garden"),
      say("What is in your bedroom?", "There is {x} in my bedroom. / There is {x}.", "a bed, a desk, a lamp, a chair, a mirror"),
      say("What color is your door?", "My door is {x}. / It is {x}.", "white, red, blue, green, brown"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-free-time",
    watchOut: {
      repeat: t(
        "*guitar* is stressed at the end, *gi-TAR*. *piano* is *pee-AN-oh*. *movie* and *music* both start with a long *oo* sound.",
        "*guitar* 重音在后，*gi-TAR*。*piano* 读作 *pee-AN-oh*。*movie* 和 *music* 开头都是长 *oo* 音。",
      ),
      read: t(
        "Keep the *-ing* of *swimming* and *dancing* full, with *ng*. Do not add a vowel after *play* or *ride*.",
        "*swimming*、*dancing* 的 *-ing* 要读完整，带 *ng*。*play*、*ride* 后面不要多加元音。",
      ),
      say: t(
        "Instruments take *the*: *I play the piano*. Sports do not: *I play tennis*. After *I like*, use *-ing*: *I like painting*.",
        "乐器前加 *the*：*I play the piano*。运动不加：*I play tennis*。*I like* 后面用 *-ing*：*I like painting*。",
      ),
    },
    title: t("Speaking: Free Time", "口语：业余时间"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“业余时间”的词汇，并朗读句子。"),
    listening: "a1-listening-free-time",
    words: ["a1-words-sports-and-music", "a1-words-hobbies", "a1-words-parties", "a1-words-actions"],
    frames: [
      say(
        "What do you like doing in your free time?",
        "I like {x}. / I like {x} in my free time.",
        "swimming, reading, dancing, painting, playing football",
      ),
      say("What instrument do you play?", "I play the {x}.", "piano, guitar, violin, drums, flute"),
      say("What sport do you play?", "I play {x}.", "football, tennis, basketball, volleyball, badminton"),
      say(
        "What do you do on Sundays?",
        "I {x} on Sundays. / On Sundays, I {x}.",
        "visit my grandma, go to the park, ride my bike, watch films, play with friends",
      ),
      say("What games do you like?", "I like {x}.", "chess, cards, computer games, board games, hide and seek"),
      say("What do you like watching?", "I like watching {x}.", "cartoons, films, football, music videos, nature shows"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-school",
    watchOut: {
      repeat: t(
        "*science* is *SY-uns*. *difficult* is *DIF-ih-kult*. Say *subject* with the stress at the start.",
        "*science* 读作 *SY-uns*。*difficult* 读作 *DIF-ih-kult*。*subject* 重音在前。",
      ),
      read: t(
        "Do not drop the *s* of *students* or *questions*. *answer* has a silent *w*: *AN-ser*.",
        "*students*、*questions* 结尾的 *s* 不要丢。*answer* 的 *w* 不发音：*AN-ser*。",
      ),
      say: t(
        "Say *My favorite subject is*, then the subject; with numbers, end with *students*. Use *on* before the day of the lesson.",
        "先说 *My favorite subject is*，再说科目；说人数时以 *students* 结尾。上课的星期前用 *on*。",
      ),
    },
    title: t("Speaking: School", "口语：学校"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“学校”的词汇，并朗读句子。"),
    listening: "a1-listening-school",
    words: ["a1-words-school-subjects", "a1-words-schoolwork", "a1-words-little-words-2"],
    frames: [
      say("What is your favorite subject?", "My favorite subject is {x}. / It is {x}.", "math, music, art, science, history"),
      say("When is your English lesson?", "It is on {x}. / My English lesson is on {x}.", "Monday, Tuesday, Wednesday, Thursday, Friday"),
      say("What is your teacher's name?", "My teacher's name is {x}. / It is {x}.", "Mr. Brown, Ms. Green, Mr. Smith, Ms. White, Mrs. Lee"),
      say("What do you have in your bag?", "I have {x} in my bag. / I have {x}.", "a pencil, a book, a ruler, an eraser, a notebook"),
      say(
        "How many students are in your class?",
        "There are {x} students in my class. / There are {x}.",
        "twenty, twenty-five, thirty, thirty-five, forty",
      ),
      say("What is your favorite day at school?", "My favorite day is {x}. / It is {x}.", "Monday, Tuesday, Wednesday, Thursday, Friday"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-the-library",
    watchOut: {
      repeat: t(
        "*library* has three beats, *LY-brer-ee*; keep both *r* sounds. *dictionary* is *DIK-shun-er-ee*.",
        "*library* 读三拍，*LY-brer-ee*，两个 *r* 都要读出来。*dictionary* 读作 *DIK-shun-er-ee*。",
      ),
      read: t(
        "Read *must* and *need* clearly; they carry the rule. Say *borrowed* with one beat at the end, *BOR-ohd*.",
        "*must*、*need* 要读清楚，它们承载着规则。*borrowed* 结尾只有一拍，*BOR-ohd*。",
      ),
      say: t(
        "Say *It opens at* and the time, or *You can borrow* and the number with *books*. Keep *the* before places: *next to the park*.",
        "说 *It opens at* 加时间，或 *You can borrow* 加数字和 *books*。地点前保留 *the*：*next to the park*。",
      ),
    },
    title: t("Speaking: The Library", "口语：图书馆"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“图书馆”的词汇，并朗读句子。"),
    listening: "a1-listening-the-library",
    words: ["a1-words-library", "a1-words-books", "a1-words-schoolwork"],
    frames: [
      say("What kind of books do you like?", "I like {x}.", "comics, stories, poems, novels, picture books"),
      say("How many books can I borrow?", "You can borrow {x} books.", "two, three, four, five, six"),
      say("When does the library open?", "It opens at {x}. / The library opens at {x}.", "eight, nine, ten, eleven, noon"),
      say(
        "What book are you reading?",
        "I am reading {x}. / I'm reading {x}.",
        "a story, a comic, a poem book, a book about animals, a book about space",
      ),
      say(
        "How often do you go to the library?",
        "I go to the library {x}. / I go {x}.",
        "every day, every week, on Saturdays, on Sundays, once a month",
      ),
      say("Where is the library?", "It is next to the {x}. / The library is next to the {x}.", "school, park, bank, station, museum"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-weather-and-nature",
    watchOut: {
      repeat: t(
        "*giraffe* is *juh-RAF*. *island* has a silent *s*, *EYE-lund*. *weather* starts with a soft *th* in the middle: *WEH-ther*.",
        "*giraffe* 读作 *juh-RAF*。*island* 的 *s* 不发音，*EYE-lund*。*weather* 中间是柔和的 *th*：*WEH-ther*。",
      ),
      read: t(
        "Do not swallow the *-y* of *cloudy* or *windy*. Say *It is* or *It's* before the weather word.",
        "*cloudy*、*windy* 的 *-y* 不要吞掉。天气词前要说 *It is* 或 *It's*。",
      ),
      say: t(
        "Weather sentences start with *It is*. Animals are plural after *I like*: *I like horses*, with the *iz* at the end.",
        "天气句以 *It is* 开头。*I like* 后面的动物用复数：*I like horses*，结尾读 *iz*。",
      ),
    },
    title: t("Speaking: Weather and Nature", "口语：天气和自然"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“天气和自然”的词汇，并朗读句子。"),
    listening: "a1-listening-weather-and-nature",
    words: ["a1-words-weather", "a1-words-seasons", "a1-words-nature", "a1-words-wild-animals"],
    frames: [
      say("What is the weather like today?", "It is {x}. / It is {x} today.", "sunny, rainy, windy, cloudy, cold"),
      say("What is your favorite season?", "My favorite season is {x}. / It is {x}.", "spring, summer, autumn, winter, fall"),
      say("What is the weather like in winter?", "It is {x} in winter. / It is {x}.", "cold, snowy, windy, cloudy, rainy"),
      say("What animal do you like?", "I like {x}.", "birds, horses, rabbits, fish, cats"),
      say("What color are the flowers?", "They are {x}. / The flowers are {x}.", "red, yellow, pink, white, purple"),
      say("Where do you like to walk?", "I like to walk in the {x}. / In the {x}.", "park, forest, garden, mountains, fields"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-people-and-jobs",
    watchOut: {
      repeat: t(
        "*police* is stressed at the end, *puh-LEES*. *nurse* has the *ur* of *bird*. Say *beautiful* in three beats, *BYOO-tih-ful*.",
        "*police* 重音在后，*puh-LEES*。*nurse* 的 *ur* 与 *bird* 相同。*beautiful* 读三拍，*BYOO-tih-ful*。",
      ),
      read: t(
        "Keep *a* before a job: *She is a nurse*. After *he* or *she*, say *works* and *drives* with the *s*.",
        "职业前保留 *a*：*She is a nurse*。*he*、*she* 后面要说 *works*、*drives*，带上 *s*。",
      ),
      say: t(
        "Say *She is a* or *He is a* before the job, never the job alone. For looks, use *is* and the adjective: *She is tall*.",
        "职业前说 *She is a* 或 *He is a*，不要只说职业。说外貌用 *is* 加形容词：*She is tall*。",
      ),
    },
    title: t("Speaking: People and Jobs", "口语：人和职业"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“人和职业”的词汇，并朗读句子。"),
    listening: "a1-listening-people-and-jobs",
    words: ["a1-words-jobs", "a1-words-describing-people", "a1-words-work-actions"],
    frames: [
      say("What does your mother do?", "She is a {x}. / My mother is a {x}.", "teacher, doctor, nurse, farmer, driver"),
      say("What is your friend like?", "He is {x}. / My friend is {x}.", "tall, short, friendly, funny, kind"),
      say("What does your father do?", "He is a {x}. / My father is a {x}.", "cook, doctor, pilot, farmer, police officer"),
      say("What job do you like?", "I like the job of a {x}. / I like {x}s.", "teacher, nurse, vet, singer, driver"),
      say("What does your best friend look like?", "She is {x}. / My best friend is {x}.", "tall, short, pretty, slim, strong"),
      say("Who is your favorite person?", "My favorite person is my {x}. / It is my {x}.", "mother, father, grandma, sister, brother"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-town-and-travel",
    watchOut: {
      repeat: t(
        "*museum* is *myoo-ZEE-um*, stressed in the middle. *restaurant* is *RES-tuh-ront*. Say *straight* with the *ay* of *day*.",
        "*museum* 读作 *myoo-ZEE-um*，重音在中间。*restaurant* 读作 *RES-tuh-ront*。*straight* 的元音同 *day*。",
      ),
      read: t(
        "Say *by bus* and *by train* without *the*. Keep the *t* of *left* and *straight* before the next word.",
        "*by bus*、*by train* 不加 *the*。*left*、*straight* 的 *t* 在下一个词前要保留。",
      ),
      say: t(
        "Travel takes *by* with no article: *I go by train*. Places take *the*: *next to the station*, *to the beach*.",
        "交通方式用 *by*，不加冠词：*I go by train*。地点加 *the*：*next to the station*、*to the beach*。",
      ),
    },
    title: t("Speaking: Town and Travel", "口语：城镇和出行"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“城镇和出行”的词汇，并朗读句子。"),
    listening: "a1-listening-town-and-travel",
    words: ["a1-words-town", "a1-words-directions", "a1-words-trips"],
    frames: [
      say("How do you go to school?", "I go to school by {x}. / I go by {x}.", "bus, bike, car, train, taxi"),
      say("Where is the bank?", "It is next to the {x}. / The bank is next to the {x}.", "park, station, school, hotel, library"),
      say("Where is the station?", "It is near the {x}. / The station is near the {x}.", "bank, hotel, park, school, market"),
      say("How do you go to the city?", "I go by {x}. / I go to the city by {x}.", "train, bus, car, bike, taxi"),
      say("What is there in your town?", "There is {x} in my town. / There is {x}.", "a museum, a park, a cinema, a zoo, a market"),
      say("Where do you want to go?", "I want to go to the {x}. / To the {x}.", "beach, zoo, museum, cinema, mountains"),
    ],
  }),
].flat();
