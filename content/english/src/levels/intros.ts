// The introductions of the listening, speaking and answering topics of the levels, written for each topic: a moment from
// its own words, dialogues or questions, and what the learner will do with them.

import { type Text, t } from "@ga/content";

/** levelAuralIntros are the introductions of the pair, listening, speaking and answering topics of the levels, by id. */
export const levelAuralIntros: Readonly<Record<string, Text>> = {
  // Pairs
  "listening-ship-and-sheep": t(
    "On a ferry, *Is that your ship?* and *Is that your sheep?* sound almost alike: only the short *i* of *ship* or the long *ee* of *sheep* tells you which. Here you pick the word you hear, then decide whether two words played one after the other are the same.",
    "在渡船上，*Is that your ship?* 和 *Is that your sheep?* 几乎一模一样，只有 *ship* 的短 *i* 和 *sheep* 的长 *ee* 能告诉你是哪一个。本主题先听音选词，再判断先后听到的两个词是否相同。",
  ),
  "listening-bad-and-bed": t(
    "*The bed is bad* puts both sounds in one sentence: the mouth opens wide for the *a* of *bad* and only halfway for the *e* of *bed*. You will hear one of the two and choose it, then judge pairs like *man* and *men*.",
    "*The bed is bad* 一句里两个音都有：*bad* 的 *a* 嘴张得很大，*bed* 的 *e* 只张一半。本主题先听出是哪个词，再判断 *man* 和 *men* 这样的词对是否相同。",
  ),
  "listening-light-and-right": t(
    "*Turn right at the light* asks you to hear an *r*, then an *l*: the tongue curls back for *right* and touches behind the teeth for *light*. You will choose the word you hear and tell pairs such as *long* and *wrong* apart.",
    "*Turn right at the light* 要你先听出 *r*，再听出 *l*：*right* 舌头向后卷，*light* 舌尖抵住上齿后面。本主题听音选词，并分辨 *long* 和 *wrong* 这样的词对。",
  ),
  "listening-think-and-sink": t(
    "*I think it will sink* has a *th* with the tongue between the teeth and an *s* with the teeth closed. You will hear one word and choose it, then decide whether pairs like *thick* and *sick* are the same word.",
    "*I think it will sink* 里，*th* 要把舌尖放在上下齿之间，*s* 则合上牙齿。本主题先听音选词，再判断 *thick* 和 *sick* 这样的词对是否相同。",
  ),
  "listening-win-and-wing": t(
    "*The bird hurt its wing* and *We want to win* end in different sounds: *n* with the tongue up front, *ng* at the back of the mouth with no *g* after it. You will pick the word you hear and judge pairs such as *sin* and *sing*.",
    "*The bird hurt its wing* 和 *We want to win* 结尾的音不同：*n* 舌尖在前，*ng* 在口腔后部，后面不带 *g*。本主题听音选词，并判断 *sin* 和 *sing* 这样的词对。",
  ),

  // A1
  "a1-listening-all-about-me": t(
    "A new classmate says, *I'm from China. My friend Tom is from Brazil.* Two countries in two sentences: which one is his? You will catch this unit's words, like *fourteen*, in spoken sentences, then answer a question about short dialogues like this one.",
    "新同学说：*I'm from China. My friend Tom is from Brazil.* 两句话两个国家，哪个是他的？本主题先在听到的句子里抓住 *fourteen* 等本单元的词，再就这样的短对话回答问题。",
  ),
  "a1-speaking-all-about-me": t(
    "*Fourteen* and *forty* sound alike unless you put the stress on *-TEEN*. You will say this unit's words after a recording, then read short sentences about age, home and feelings aloud.",
    "*fourteen* 和 *forty* 很像，除非把重音放在 *-TEEN* 上。本主题先跟着录音说本单元的词，再大声朗读关于年龄、家乡和感受的短句。",
  ),
  "a1-answering-all-about-me": t(
    "Someone asks *Where are you from?* and you are given *China*: the answer is not just *China* but *I am from China.* You will hear questions about yourself and answer each one aloud in a full sentence.",
    "别人问 *Where are you from?*，给你的词是 *China*：回答不是只说 *China*，而是 *I am from China.* 本主题听关于自己的问题，每题都用完整的句子大声回答。",
  ),
  "a1-listening-my-day": t(
    "*I usually go by bus, but today I'm going by bike.* The question asks how he *usually* goes, so the bike is a trap. You will hear this unit's words, like *up* in *Wake up!*, then follow short talks about the day.",
    "*I usually go by bus, but today I'm going by bike.* 问题问他 *usually* 怎么去，所以自行车是陷阱。本主题先听出 *Wake up!* 里的 *up* 等本单元的词，再听懂谈论一天的短对话。",
  ),
  "a1-speaking-my-day": t(
    "*Get up*, *have breakfast*, *go to school*: the words of a day come in short pairs that you say as one. You will repeat this unit's words after a recording and read sentences about your day aloud.",
    "*get up*、*have breakfast*、*go to school*：一天里的说法常是两三个词连成一个整体来说。本主题跟着录音说本单元的词，并大声朗读描述一天的句子。",
  ),
  "a1-answering-my-day": t(
    "Asked *Do you walk to school?* with the word *always*, you say *I always walk to school.*—the word goes before the verb. You will answer questions about your day aloud, each in a full sentence.",
    "被问 *Do you walk to school?*，给的词是 *always*，你要说 *I always walk to school.*——这个词放在动词前面。本主题用完整的句子大声回答关于一天的问题。",
  ),
  "a1-listening-time-and-dates": t(
    "*It's on Monday. It isn't on Tuesday.* Both days are said, but only one is the party. You will catch words like *clock* in spoken sentences, then pick out the day, date or time a dialogue or announcement gives.",
    "*It's on Monday. It isn't on Tuesday.* 两天都说到了，但派对只在一天。本主题先在句子里听出 *clock* 等词，再从对话或通知里抓出所说的星期、日期或时间。",
  ),
  "a1-speaking-time-and-dates": t(
    "*Clock*, *o'clock*, *Wednesday*: time words hide letters you do not say, like the first *d* of *Wednesday*. You will say this unit's words after a recording and read sentences with days and times aloud.",
    "*clock*、*o'clock*、*Wednesday*：表示时间的词常有不发音的字母，比如 *Wednesday* 的第一个 *d*。本主题跟着录音说本单元的词，并朗读带有星期和时间的句子。",
  ),
  "a1-answering-time-and-dates": t(
    "*What day is it today?* — *It is Monday.* An answer about time starts with *It is*, not with the day alone. You will hear questions about days, dates and times and answer them aloud in full sentences.",
    "*What day is it today?* —— *It is Monday.* 回答时间的问题要以 *It is* 开头，不是只说星期几。本主题听关于星期、日期和时间的问题，用完整句子大声回答。",
  ),
  "a1-listening-food-and-drink": t(
    "*I usually have eggs. I don't like bread.* Breakfast is the eggs; the bread is what he does not eat. You will hear words like *fruit* in sentences, then answer questions about ordering food and what is for lunch.",
    "*I usually have eggs. I don't like bread.* 早餐是鸡蛋，面包是他不吃的。本主题先在句子里听出 *fruit* 等词，再回答关于点餐和午饭吃什么的问题。",
  ),
  "a1-speaking-food-and-drink": t(
    "*Fruit* is one beat, *froot*, with a silent *i*, and *vegetables* squeezes four letters into three beats. You will repeat this unit's food words after a recording and read sentences about meals aloud.",
    "*fruit* 只有一拍，读 *froot*，*i* 不发音；*vegetables* 也只读三拍。本主题跟着录音说本单元的食物词，并朗读关于一日三餐的句子。",
  ),
  "a1-answering-food-and-drink": t(
    "*What do you have for breakfast?* — *I have eggs for breakfast.* Using the question's own words makes a full answer. You will answer questions about food and drink aloud, each in a complete sentence with the word you are given.",
    "*What do you have for breakfast?* —— *I have eggs for breakfast.* 借用问题里的说法，就能说出完整的回答。本主题用给出的词，以完整句子大声回答关于饮食的问题。",
  ),
  "a1-listening-clothes-and-shopping": t(
    "In a shop: *I'm looking for a jacket.* — *The sweaters are here, and the jackets are over there.* Two kinds of clothes, one that he wants. You will hear words like *shirt*, then follow short talks about prices, colors and what people need.",
    "在商店里：*I'm looking for a jacket.* —— *The sweaters are here, and the jackets are over there.* 两种衣服，他要的只有一种。本主题先听出 *shirt* 等词，再听懂关于价钱、颜色和需要什么的短对话。",
  ),
  "a1-speaking-clothes-and-shopping": t(
    "*Shirt* has the *ur* of *bird*, and *T-shirt* says the letter *T* first. You will say this unit's clothes and shopping words after a recording and read sentences about what people wear aloud.",
    "*shirt* 的元音同 *bird* 的 *ur*，*T-shirt* 先读字母 *T*。本主题跟着录音说本单元关于衣服和购物的词，并朗读描述穿着的句子。",
  ),
  "a1-answering-clothes-and-shopping": t(
    "*How much is the T-shirt?* — *It is five dollars.* A price needs *It is* and *dollars*, not just *five*. You will answer shopping questions aloud in full sentences with the word you are given.",
    "*How much is the T-shirt?* —— *It is five dollars.* 说价钱要有 *It is* 和 *dollars*，不能只说 *five*。本主题用给出的词，以完整句子大声回答购物的问题。",
  ),
  "a1-listening-home": t(
    "*There are two. My old house had three.* Asked how many bedrooms there are, you need the number for now, not for the old house. You will hear words like *rooms* in sentences, then answer questions about where things are and the housework to do.",
    "*There are two. My old house had three.* 问现在有几间卧室，要的是现在的数字，不是旧房子的。本主题先在句子里听出 *rooms* 等词，再回答东西在哪里、要做什么家务的问题。",
  ),
  "a1-speaking-home": t(
    "*Bedroom* and *bathroom* stress the first part, *BED-room*, *BATH-room*. You will repeat the words of the home after a recording and read sentences about rooms and furniture aloud.",
    "*bedroom* 和 *bathroom* 重音都在前半部分：*BED-room*、*BATH-room*。本主题跟着录音说关于家的词，并朗读描述房间和家具的句子。",
  ),
  "a1-answering-home": t(
    "*How many rooms are there in your home?* — *There are three rooms.* A *There are* question gets a *There are* answer. You will answer questions about your home aloud, in full sentences.",
    "*How many rooms are there in your home?* —— *There are three rooms.* 用 *There are* 问，就用 *There are* 答。本主题用完整句子大声回答关于你家的问题。",
  ),
  "a1-listening-free-time": t(
    "*Do you like dancing?* — *It's OK, but I love swimming.* What he loves comes after *but*. You will hear words like *game* in sentences, then answer questions about hobbies, clubs and parties.",
    "*Do you like dancing?* —— *It's OK, but I love swimming.* 他真正喜欢的在 *but* 后面。本主题先在句子里听出 *game* 等词，再回答关于爱好、社团和聚会的问题。",
  ),
  "a1-speaking-free-time": t(
    "*Game* has a long *a*, like *name*, and *guitar* is stressed at the end, *gi-TAR*. You will say this unit's free-time words after a recording and read sentences about what people like doing aloud.",
    "*game* 是长 *a*，同 *name*；*guitar* 重音在后，*gi-TAR*。本主题跟着录音说本单元关于休闲的词，并朗读描述人们爱做什么的句子。",
  ),
  "a1-answering-free-time": t(
    "*What instrument do you play?* — *I play the piano.* Instruments keep *the*. You will answer questions about your free time aloud, in full sentences with the word you are given.",
    "*What instrument do you play?* —— *I play the piano.* 乐器前要加 *the*。本主题用给出的词，以完整句子大声回答关于业余时间的问题。",
  ),
  "a1-listening-school": t(
    "*We have English now, and science after lunch.* Two lessons, two times: the question asks about now. You will hear school words like *science* in sentences, then answer questions about lessons and classrooms.",
    "*We have English now, and science after lunch.* 两门课，两个时间，问题问的是现在。本主题先在句子里听出 *science* 等学校词汇，再回答关于课程和教室的问题。",
  ),
  "a1-speaking-school": t(
    "*Science* starts with an *s* sound, *SY-ens*, and *pencil* with a *p* and an *s*, *PEN-sul*. You will repeat this unit's school words after a recording and read sentences about lessons aloud.",
    "*science* 开头是 *s* 音，读 *SY-ens*；*pencil* 读 *PEN-sul*。本主题跟着录音说本单元的学校词汇，并朗读关于上课的句子。",
  ),
  "a1-answering-school": t(
    "*When is your English lesson?* — *It is on Monday.* A day takes *on*. You will answer questions about school aloud, each in a full sentence with the word you are given.",
    "*When is your English lesson?* —— *It is on Monday.* 星期前用 *on*。本主题用给出的词，以完整句子大声回答关于学校的问题。",
  ),
  "a1-listening-the-library": t(
    "*You can borrow two books. Children can borrow three.* The woman is not a child, so her number is the first one. You will hear words like *borrow* in sentences, then answer questions about opening times and where books are.",
    "*You can borrow two books. Children can borrow three.* 这位女士不是孩子，所以她的数字是前一个。本主题先在句子里听出 *borrow* 等词，再回答关于开放时间和书在哪里的问题。",
  ),
  "a1-speaking-the-library": t(
    "*Library* has three beats, *LY-brer-ee*; do not drop the first *r*. You will say this unit's library words after a recording and read sentences about borrowing books aloud.",
    "*library* 读三拍，*LY-brer-ee*，第一个 *r* 别丢。本主题跟着录音说本单元关于图书馆的词，并朗读关于借书的句子。",
  ),
  "a1-answering-the-library": t(
    "*How many books can I borrow?* — *You can borrow two books.* The *I* of the question becomes *you* in the answer. You will answer library questions aloud in full sentences.",
    "*How many books can I borrow?* —— *You can borrow two books.* 问题里的 *I* 在回答里变成 *you*。本主题用完整句子大声回答关于图书馆的问题。",
  ),
  "a1-listening-weather-and-nature": t(
    "*Today it's ten degrees. Yesterday it was fifteen.* The question asks about today. You will hear words like *sun* in sentences, then answer questions about the weather, the seasons and animals outside.",
    "*Today it's ten degrees. Yesterday it was fifteen.* 问题问的是今天。本主题先在句子里听出 *sun* 等词，再回答关于天气、季节和户外动物的问题。",
  ),
  "a1-speaking-weather-and-nature": t(
    "*Sun* and *son* sound the same, and *weather* has a soft *th*. You will repeat this unit's weather and nature words after a recording and read sentences about the sky and the seasons aloud.",
    "*sun* 和 *son* 读音相同，*weather* 中间是轻柔的 *th*。本主题跟着录音说本单元关于天气和自然的词，并朗读描述天空和季节的句子。",
  ),
  "a1-answering-weather-and-nature": t(
    "*What is your favorite season?* — *My favorite season is spring.* Start from the question's words and add yours at the end. You will answer questions about weather and nature aloud in full sentences.",
    "*What is your favorite season?* —— *My favorite season is spring.* 从问题的说法开始，把你的词放在最后。本主题用完整句子大声回答关于天气和自然的问题。",
  ),
  "a1-listening-people-and-jobs": t(
    "*He works in a hospital. My sister works in a school.* The brother's workplace is the first one. You will hear words like *doctor* in sentences, then answer questions about what people do and where they work.",
    "*He works in a hospital. My sister works in a school.* 哥哥工作的地方是第一个。本主题先在句子里听出 *doctor* 等词，再回答人们做什么、在哪里工作的问题。",
  ),
  "a1-speaking-people-and-jobs": t(
    "*Doctor* and *teacher* stress the first beat, and their *-or* and *-er* both sound like a soft *uh*. You will say this unit's words for people and jobs after a recording and read sentences about them aloud.",
    "*doctor* 和 *teacher* 重音都在第一拍，结尾 *-or* 和 *-er* 都读轻轻的 *uh*。本主题跟着录音说本单元关于人物和职业的词，并朗读相关句子。",
  ),
  "a1-answering-people-and-jobs": t(
    "*What is your friend like?* — *He is tall.* The answer describes the friend with *He is* or *She is*. You will answer questions about people and jobs aloud in full sentences.",
    "*What is your friend like?* —— *He is tall.* 用 *He is* 或 *She is* 描述朋友。本主题用完整句子大声回答关于人物和职业的问题。",
  ),
  "a1-listening-town-and-travel": t(
    "*The train to London leaves from platform one. The train to Oxford leaves from platform two.* Match each train to its own number. You will hear words like *street* in sentences, then answer questions about directions, buses and platforms.",
    "*The train to London leaves from platform one. The train to Oxford leaves from platform two.* 每趟车要对上自己的站台号。本主题先在句子里听出 *street* 等词，再回答关于问路、公交和站台的问题。",
  ),
  "a1-speaking-town-and-travel": t(
    "*Street* starts with three consonants, *s-t-r*, with no vowel between them. You will repeat this unit's town and travel words after a recording and read sentences about places in town aloud.",
    "*street* 开头三个辅音 *s-t-r* 连在一起，中间不加元音。本主题跟着录音说本单元关于城镇和出行的词，并朗读描述城里地点的句子。",
  ),
  "a1-answering-town-and-travel": t(
    "*Where is the bank?* — *It is next to the park.* Places keep *the*. You will answer questions about town and travel aloud, in full sentences with the word you are given.",
    "*Where is the bank?* —— *It is next to the park.* 地点前保留 *the*。本主题用给出的词，以完整句子大声回答关于城镇和出行的问题。",
  ),

  // A2
  "a2-listening-last-weekend": t(
    "*We went to the zoo. We wanted to go to the beach, but it rained.* Where they wanted to go is not where they went. You will hear past forms in sentences, then answer questions about what people did last weekend and when they got home.",
    "*We went to the zoo. We wanted to go to the beach, but it rained.* 想去的地方不是去了的地方。本主题先在句子里听出过去式，再回答人们上周末做了什么、几点到家的问题。",
  ),
  "a2-speaking-last-weekend": t(
    "*Visited* has an extra beat and *watched* ends in a short *t*: past endings carry the time. You will say this unit's words after a recording and read sentences about last weekend aloud.",
    "*visited* 多一拍，*watched* 结尾是短促的 *t*：过去式词尾表示时间。本主题跟着录音说本单元的词，并朗读关于上周末的句子。",
  ),
  "a2-answering-last-weekend": t(
    "*Where did you go on Saturday?* — *I went to the park on Saturday.* A past question needs a past answer. You will answer questions about your weekend aloud in full sentences.",
    "*Where did you go on Saturday?* —— *I went to the park on Saturday.* 用过去时问，就用过去时答。本主题用完整句子大声回答关于周末的问题。",
  ),
  "a2-listening-health-and-the-body": t(
    "*I've got a headache. Yesterday I had a cold.* Today's problem is the headache. You will hear body and health words in sentences, then answer questions about what is wrong, how often to take medicine and when to see the doctor.",
    "*I've got a headache. Yesterday I had a cold.* 今天的问题是头疼。本主题先在句子里听出身体和健康的词，再回答哪里不舒服、药怎么吃、几点看医生的问题。",
  ),
  "a2-speaking-health-and-the-body": t(
    "*Stomach* is *STUM-uk* and *medicine* is *MED-ih-sin*: neither sounds the way it looks. You will repeat this unit's health words after a recording and read sentences about the body aloud.",
    "*stomach* 读 *STUM-uk*，*medicine* 读 *MED-ih-sin*，都和拼写看起来不一样。本主题跟着录音说本单元的健康词汇，并朗读关于身体的句子。",
  ),
  "a2-answering-health-and-the-body": t(
    "*What's the matter?* — *I have a headache.* The problem follows *I have a*. You will answer questions about health and exercise aloud in full sentences with the word you are given.",
    "*What's the matter?* —— *I have a headache.* 症状放在 *I have a* 后面。本主题用给出的词，以完整句子大声回答关于健康和锻炼的问题。",
  ),
  "a2-listening-neighbors-and-community": t(
    "*A doctor lives there. A teacher lives across the street.* Next door is the doctor, not the teacher. You will hear words about neighbors and the community, then answer questions about street parties, places and people nearby.",
    "*A doctor lives there. A teacher lives across the street.* 隔壁住的是医生，不是老师。本主题先听出关于邻里和社区的词，再回答关于街头聚会、附近地点和邻居的问题。",
  ),
  "a2-speaking-neighbors-and-community": t(
    "*Neighbor* hides a silent *gh*, *NAY-ber*, and *volunteer* is stressed at the end. You will say this unit's community words after a recording and read sentences about your street aloud.",
    "*neighbor* 里的 *gh* 不发音，读 *NAY-ber*；*volunteer* 重音在后。本主题跟着录音说本单元的社区词汇，并朗读描述街坊的句子。",
  ),
  "a2-answering-neighbors-and-community": t(
    "*Where is the post office?* — *It is opposite the bank.* Places after *opposite* keep *the*. You will answer questions about your neighborhood aloud in full sentences.",
    "*Where is the post office?* —— *It is opposite the bank.* *opposite* 后的地点保留 *the*。本主题用完整句子大声回答关于你家附近的问题。",
  ),
  "a2-listening-cooking": t(
    "*For ten minutes. Not twelve, ten.* When a cook corrects a number, the right one comes last. You will hear kitchen words in sentences, then answer questions about recipes, ingredients and cooking times.",
    "*For ten minutes. Not twelve, ten.* 厨师更正数字时，正确的那个在最后。本主题先在句子里听出厨房用语，再回答关于菜谱、食材和烹饪时间的问题。",
  ),
  "a2-speaking-cooking": t(
    "*Recipe* has three beats, *RES-ih-pee*, and *onion* is *UN-yun*. You will repeat this unit's cooking words after a recording and read the steps of a recipe aloud.",
    "*recipe* 读三拍，*RES-ih-pee*；*onion* 读 *UN-yun*。本主题跟着录音说本单元的烹饪词汇，并朗读菜谱的步骤。",
  ),
  "a2-answering-cooking": t(
    "*What do we do first?* — *First, we wash the vegetables.* A step starts with *First* or *Next* and a verb. You will answer questions about cooking aloud in full sentences.",
    "*What do we do first?* —— *First, we wash the vegetables.* 说步骤以 *First* 或 *Next* 加动词开头。本主题用完整句子大声回答关于做饭的问题。",
  ),
  "a2-listening-sports-and-games": t(
    "*It was three to one at the end. At half time it was one to one.* The final score is the one *at the end*. You will hear sports words in sentences, then answer questions about matches, scores and classes.",
    "*It was three to one at the end. At half time it was one to one.* 最终比分是 *at the end* 的那个。本主题先在句子里听出体育词汇，再回答关于比赛、比分和课程的问题。",
  ),
  "a2-speaking-sports-and-games": t(
    "*Badminton* is *BAD-min-tun* and *champion* is *CHAM-pee-un*. You will say this unit's sports words after a recording and read sentences about games and players aloud.",
    "*badminton* 读 *BAD-min-tun*，*champion* 读 *CHAM-pee-un*。本主题跟着录音说本单元的体育词汇，并朗读关于比赛和运动员的句子。",
  ),
  "a2-answering-sports-and-games": t(
    "*Which sport are you good at?* — *I am good at swimming.* Keep the *at*. You will answer questions about sports and games aloud in full sentences with the word you are given.",
    "*Which sport are you good at?* —— *I am good at swimming.* 别丢 *at*。本主题用给出的词，以完整句子大声回答关于运动和游戏的问题。",
  ),
  "a2-listening-animals-and-pets": t(
    "*Yes, a dog. My sister has a cat.* His pet is the dog; the cat is his sister's. You will hear animal words in sentences, then answer questions about pets, their ages and what they eat.",
    "*Yes, a dog. My sister has a cat.* 他的宠物是狗，猫是他姐姐的。本主题先在句子里听出动物词汇，再回答关于宠物、年龄和食物的问题。",
  ),
  "a2-speaking-animals-and-pets": t(
    "*Parrot* and *hamster* stress the start, but *giraffe* stresses the end. You will repeat this unit's animal words after a recording and read sentences about pets and wild animals aloud.",
    "*parrot* 和 *hamster* 重音在前，*giraffe* 重音在后。本主题跟着录音说本单元的动物词汇，并朗读关于宠物和野生动物的句子。",
  ),
  "a2-answering-animals-and-pets": t(
    "*What pet would you like?* — *I would like a rabbit.* The pet keeps *a*. You will answer questions about animals aloud in full sentences with the word you are given.",
    "*What pet would you like?* —— *I would like a rabbit.* 宠物前保留 *a*。本主题用给出的词，以完整句子大声回答关于动物的问题。",
  ),
  "a2-listening-travel-and-holidays": t(
    "*The flight to Rome will leave from gate twelve, not gate fourteen.* An announcement can name the wrong gate to correct it. You will hear travel words in sentences, then answer questions about gates, destinations and holidays.",
    "*The flight to Rome will leave from gate twelve, not gate fourteen.* 广播可能先说错的登机口再更正。本主题先在句子里听出旅行词汇，再回答关于登机口、目的地和假期的问题。",
  ),
  "a2-speaking-travel-and-holidays": t(
    "*Souvenir* is stressed at the end, *soo-vuh-NEER*, and *luggage* is *LUG-ij*. You will say this unit's travel words after a recording and read sentences about trips aloud.",
    "*souvenir* 重音在后，*soo-vuh-NEER*；*luggage* 读 *LUG-ij*。本主题跟着录音说本单元的旅行词汇，并朗读关于旅行的句子。",
  ),
  "a2-answering-travel-and-holidays": t(
    "*How are you going to travel?* — *We are going by plane.* Transport takes *by*, with no *the*. You will answer questions about travel plans aloud in full sentences.",
    "*How are you going to travel?* —— *We are going by plane.* 交通方式用 *by*，不加 *the*。本主题用完整句子大声回答关于旅行计划的问题。",
  ),
  "a2-listening-the-natural-world": t(
    "*We saw a deer near the river, and a fox in the trees.* Each animal has its own place. You will hear nature words in sentences, then answer questions about mountains, animals and the weather.",
    "*We saw a deer near the river, and a fox in the trees.* 每种动物在不同的地方。本主题先在句子里听出自然词汇，再回答关于山、动物和天气的问题。",
  ),
  "a2-speaking-the-natural-world": t(
    "*Lightning* has no *e* in the middle, *LYT-ning*, and *through* is just *throo*. You will repeat this unit's nature words after a recording and read sentences about the natural world aloud.",
    "*lightning* 中间没有 *e*，读 *LYT-ning*；*through* 就读 *throo*。本主题跟着录音说本单元的自然词汇，并朗读描述自然的句子。",
  ),
  "a2-answering-the-natural-world": t(
    "*What will the weather be like tomorrow?* — *It will be sunny tomorrow.* The future takes *will be*. You will answer questions about nature and the weather aloud in full sentences.",
    "*What will the weather be like tomorrow?* —— *It will be sunny tomorrow.* 说将来用 *will be*。本主题用完整句子大声回答关于自然和天气的问题。",
  ),
  "a2-listening-shopping-and-money": t(
    "*I paid fifty dollars. They were sixty dollars last week.* What he paid is today's price. You will hear shopping words in sentences, then answer questions about prices, shops and what things are made of.",
    "*I paid fifty dollars. They were sixty dollars last week.* 他付的是今天的价钱。本主题先在句子里听出购物词汇，再回答关于价钱、商店和材质的问题。",
  ),
  "a2-speaking-shopping-and-money": t(
    "*Costs* ends in three sounds, *sts*, and *bought* is just *bawt*. You will say this unit's shopping words after a recording and read sentences about buying things aloud.",
    "*costs* 结尾三个音 *sts*，*bought* 就读 *bawt*。本主题跟着录音说本单元的购物词汇，并朗读关于买东西的句子。",
  ),
  "a2-answering-shopping-and-money": t(
    "*What is the bag made of?* — *It is made of leather.* Materials take *made of*. You will answer shopping questions aloud in full sentences with the word you are given.",
    "*What is the bag made of?* —— *It is made of leather.* 材质用 *made of*。本主题用给出的词，以完整句子大声回答购物的问题。",
  ),
  "a2-listening-technology": t(
    "*It's sunflower. The old one was rainbow.* The password is the new one. You will hear technology words in sentences, then answer questions about phones, batteries and passwords.",
    "*It's sunflower. The old one was rainbow.* 密码是新的那个。本主题先在句子里听出科技词汇，再回答关于手机、电池和密码的问题。",
  ),
  "a2-speaking-technology": t(
    "*Password* and *keyboard* stress the first part, and *electric* is *ih-LEK-trik*. You will repeat this unit's technology words after a recording and read sentences about devices aloud.",
    "*password* 和 *keyboard* 重音在前，*electric* 读 *ih-LEK-trik*。本主题跟着录音说本单元的科技词汇，并朗读关于设备的句子。",
  ),
  "a2-answering-technology": t(
    "*What do you use your phone for?* — *I use it to take photos.* A verb follows *to*. You will answer questions about technology aloud in full sentences with the word you are given.",
    "*What do you use your phone for?* —— *I use it to take photos.* *to* 后面接动词。本主题用给出的词，以完整句子大声回答关于科技的问题。",
  ),
  "a2-listening-festivals-and-celebrations": t(
    "*On the first of October. The music starts on the fifth.* The festival and the music begin on different days. You will hear festival words in sentences, then answer questions about dates, costumes and presents.",
    "*On the first of October. The music starts on the fifth.* 节日和音乐会在不同的日子开始。本主题先在句子里听出节日词汇，再回答关于日期、服装和礼物的问题。",
  ),
  "a2-speaking-festivals-and-celebrations": t(
    "*Congratulations* rolls through five beats, *kun-grach-uh-LAY-shunz*. You will say this unit's festival words after a recording and read sentences about celebrations aloud.",
    "*congratulations* 一口气读五拍，*kun-grach-uh-LAY-shunz*。本主题跟着录音说本单元的节日词汇，并朗读关于庆祝活动的句子。",
  ),
  "a2-answering-festivals-and-celebrations": t(
    "*What do you eat at the Spring Festival?* — *We eat dumplings.* A custom is said with *We*. You will answer questions about festivals aloud in full sentences with the word you are given.",
    "*What do you eat at the Spring Festival?* —— *We eat dumplings.* 说习俗用 *We*。本主题用给出的词，以完整句子大声回答关于节日的问题。",
  ),
  "a2-listening-jobs-and-dreams": t(
    "*I want to be a pilot. My friend wants to be a vet.* His dream is the first job. You will hear job words in sentences, then answer questions about dreams, working hours and interviews.",
    "*I want to be a pilot. My friend wants to be a vet.* 他的梦想是第一个职业。本主题先在句子里听出职业词汇，再回答关于梦想、工作时间和面试的问题。",
  ),
  "a2-speaking-jobs-and-dreams": t(
    "*Engineer* stresses the end, *en-juh-NEER*, while *mechanic* stresses the middle, *muh-KAN-ik*. You will repeat this unit's job words after a recording and read sentences about work aloud.",
    "*engineer* 重音在后，*en-juh-NEER*；*mechanic* 重音在中间，*muh-KAN-ik*。本主题跟着录音说本单元的职业词汇，并朗读关于工作的句子。",
  ),
  "a2-answering-jobs-and-dreams": t(
    "*What do you want to be in the future?* — *I want to be a pilot.* The job keeps *a*. You will answer questions about jobs and dreams aloud in full sentences with the word you are given.",
    "*What do you want to be in the future?* —— *I want to be a pilot.* 职业前保留 *a*。本主题用给出的词，以完整句子大声回答关于职业和梦想的问题。",
  ),

  // B1
  "b1-listening-education-and-learning": t(
    "*It was due on Monday, but now we have until Friday.* The new deadline follows *now*. You will hear education words in sentences, then answer questions about deadlines, courses, exam rooms and ways of revising.",
    "*It was due on Monday, but now we have until Friday.* 新的截止日期在 *now* 后面。本主题先在句子里听出教育词汇，再回答关于截止日期、课程、考场和复习方法的问题。",
  ),
  "b1-speaking-education-and-learning": t(
    "*Knowledge* starts with a silent *k*, *NOL-ij*, and *semester* is *suh-MES-ter*. You will say this unit's words about school and study after a recording and read sentences about learning aloud.",
    "*knowledge* 的 *k* 不发音，读 *NOL-ij*；*semester* 读 *suh-MES-ter*。本主题跟着录音说本单元关于学校和学习的词，并朗读关于学习的句子。",
  ),
  "b1-answering-education-and-learning": t(
    "*How do you prepare for an exam?* — *I make flashcards before an exam.* You will answer questions about school and learning aloud, in full sentences with the word or phrase you are given.",
    "*How do you prepare for an exam?* —— *I make flashcards before an exam.* 本主题用给出的词或短语，以完整句子大声回答关于学校和学习的问题。",
  ),
  "b1-listening-work-and-careers": t(
    "*The team meeting has moved from nine thirty to eleven o'clock.* The old time comes after *from*, the new one after *to*. You will hear work words in sentences, then answer questions about interviews, meetings and departments.",
    "*The team meeting has moved from nine thirty to eleven o'clock.* 旧时间在 *from* 后，新时间在 *to* 后。本主题先在句子里听出工作词汇，再回答关于面试、会议和部门的问题。",
  ),
  "b1-speaking-work-and-careers": t(
    "*Employer* and *employee* differ only in their last beat: *em-PLOY-er*, *em-ploy-EE*. You will repeat this unit's work words after a recording and read sentences about jobs and offices aloud.",
    "*employer* 和 *employee* 只差最后一拍：*em-PLOY-er*、*em-ploy-EE*。本主题跟着录音说本单元的工作词汇，并朗读关于职业和办公室的句子。",
  ),
  "b1-answering-work-and-careers": t(
    "*Would you prefer to work indoors or outdoors?* — *I'd rather work outdoors.* You will answer questions about work and careers aloud, in full sentences with the word you are given.",
    "*Would you prefer to work indoors or outdoors?* —— *I'd rather work outdoors.* 本主题用给出的词，以完整句子大声回答关于工作和职业的问题。",
  ),
  "b1-listening-health-and-fitness": t(
    "*She said it isn't the flu. It's just a cold.* The doctor names what it is not before what it is. You will hear health words in sentences, then answer questions about illnesses, gym hours, exercise and diet.",
    "*She said it isn't the flu. It's just a cold.* 医生先说不是什么，再说是什么。本主题先在句子里听出健康词汇，再回答关于疾病、健身房时间、锻炼和饮食的问题。",
  ),
  "b1-speaking-health-and-fitness": t(
    "*Muscle* has a silent *c* and *vaccine* is stressed at the end, *vak-SEEN*. You will say this unit's health and fitness words after a recording and read sentences about staying well aloud.",
    "*muscle* 的 *c* 不发音，*vaccine* 重音在后，*vak-SEEN*。本主题跟着录音说本单元关于健康和健身的词，并朗读关于保持健康的句子。",
  ),
  "b1-answering-health-and-fitness": t(
    "*How often do you go to the gym?* — *I go to the gym twice a week.* How often goes at the end. You will answer questions about health and fitness aloud in full sentences.",
    "*How often do you go to the gym?* —— *I go to the gym twice a week.* 频率放在句末。本主题用完整句子大声回答关于健康和健身的问题。",
  ),
  "b1-listening-the-environment": t(
    "*Glass is now collected on Tuesdays. Paper is still collected on Fridays.* Two kinds of waste, two days. You will hear environment words in sentences, then answer questions about recycling, clean-ups and a town's plans.",
    "*Glass is now collected on Tuesdays. Paper is still collected on Fridays.* 两类垃圾，两个日子。本主题先在句子里听出环境词汇，再回答关于回收、清洁活动和城镇计划的问题。",
  ),
  "b1-speaking-the-environment": t(
    "*Species* is *SPEE-sheez* and *sustainable* is *suh-STAY-nuh-bul*. You will repeat this unit's environment words after a recording and read sentences about nature and waste aloud.",
    "*species* 读 *SPEE-sheez*，*sustainable* 读 *suh-STAY-nuh-bul*。本主题跟着录音说本单元的环境词汇，并朗读关于自然和垃圾的句子。",
  ),
  "b1-answering-the-environment": t(
    "*What can schools do for the environment?* — *Schools can plant trees.* You will answer questions about the environment aloud, in full sentences with the word or phrase you are given.",
    "*What can schools do for the environment?* —— *Schools can plant trees.* 本主题用给出的词或短语，以完整句子大声回答关于环境的问题。",
  ),
  "b1-listening-media-and-news": t(
    "*Today will be cloudy, but tomorrow will be sunny across the whole country.* A weather report gives two days; the question asks about one. You will hear news words in sentences, then answer questions about short reports and where people get their news.",
    "*Today will be cloudy, but tomorrow will be sunny across the whole country.* 天气预报说了两天，问题只问一天。本主题先在句子里听出新闻词汇，再回答关于简讯和人们从哪里看新闻的问题。",
  ),
  "b1-speaking-media-and-news": t(
    "*Documentary* is *dok-yuh-MEN-tuh-ree* and *episode* is *EP-ih-sohd*. You will say this unit's media and news words after a recording and read sentences about the news aloud.",
    "*documentary* 读 *dok-yuh-MEN-tuh-ree*，*episode* 读 *EP-ih-sohd*。本主题跟着录音说本单元关于媒体和新闻的词，并朗读关于新闻的句子。",
  ),
  "b1-answering-media-and-news": t(
    "*Where do you get your news?* — *I get my news from a news app.* Keep the *from*. You will answer questions about the media aloud in full sentences with the word you are given.",
    "*Where do you get your news?* —— *I get my news from a news app.* 别丢 *from*。本主题用给出的词，以完整句子大声回答关于媒体的问题。",
  ),
  "b1-listening-technology-in-our-lives": t(
    "*To reset your password, press one. To report a problem, press two.* A helpdesk menu lists several numbers; only one does what you need. You will hear technology words in sentences, then answer questions about broken devices, phones and time online.",
    "*To reset your password, press one. To report a problem, press two.* 客服菜单列出好几个号码，只有一个是你需要的。本主题先在句子里听出科技词汇，再回答关于设备故障、手机和上网时间的问题。",
  ),
  "b1-speaking-technology-in-our-lives": t(
    "*Privacy* is *PRY-vuh-see* and *anonymous* is *uh-NON-ih-mus*. You will repeat this unit's technology words after a recording and read sentences about devices and safety online aloud.",
    "*privacy* 读 *PRY-vuh-see*，*anonymous* 读 *uh-NON-ih-mus*。本主题跟着录音说本单元的科技词汇，并朗读关于设备和网络安全的句子。",
  ),
  "b1-answering-technology-in-our-lives": t(
    "*Which device do you use most?* — *I use my phone most.* You will answer questions about technology in your life aloud, in full sentences with the word you are given.",
    "*Which device do you use most?* —— *I use my phone most.* 本主题用给出的词，以完整句子大声回答关于生活中科技的问题。",
  ),
  "b1-listening-travel-and-culture": t(
    "*At first they said thirty minutes, but now it's two hours.* The delay that counts is the one after *now*. You will hear travel and culture words in sentences, then answer questions about platforms, delays and where travelers stay.",
    "*At first they said thirty minutes, but now it's two hours.* 算数的延误是 *now* 后面那个。本主题先在句子里听出旅行和文化词汇，再回答关于站台、延误和住处的问题。",
  ),
  "b1-speaking-travel-and-culture": t(
    "*Itinerary* has five beats, *eye-TIN-uh-rer-ee*, and *queue* is just *kyoo*. You will say this unit's travel words after a recording and read sentences about journeys and customs aloud.",
    "*itinerary* 读五拍，*eye-TIN-uh-rer-ee*；*queue* 就读 *kyoo*。本主题跟着录音说本单元的旅行词汇，并朗读关于旅途和风俗的句子。",
  ),
  "b1-answering-travel-and-culture": t(
    "*How do you prefer to travel?* — *I prefer to travel by train.* You will answer questions about travel and culture aloud, in full sentences with the word you are given.",
    "*How do you prefer to travel?* —— *I prefer to travel by train.* 本主题用给出的词，以完整句子大声回答关于旅行和文化的问题。",
  ),
  "b1-listening-relationships": t(
    "*Is he moving abroad?* — *No, he's getting married!* A wrong guess comes first and the news after *No*. You will hear words about people and feelings in sentences, then answer questions about friends' plans and news.",
    "*Is he moving abroad?* —— *No, he's getting married!* 先是猜错的，真正的消息在 *No* 后面。本主题先在句子里听出关于人物和感受的词，再回答关于朋友计划和近况的问题。",
  ),
  "b1-speaking-relationships": t(
    "*Acquaintance* is *uh-KWAYN-tuns*, and *disappointed* keeps its *-ed* as a beat. You will repeat this unit's words about people and feelings after a recording and read sentences about relationships aloud.",
    "*acquaintance* 读 *uh-KWAYN-tuns*，*disappointed* 的 *-ed* 要多读一拍。本主题跟着录音说本单元关于人物和情感的词，并朗读关于人际关系的句子。",
  ),
  "b1-answering-relationships": t(
    "*What do you like doing with your friends?* — *I like playing games with my friends.* You will answer questions about friends and family aloud, in full sentences with the word you are given.",
    "*What do you like doing with your friends?* —— *I like playing games with my friends.* 本主题用给出的词，以完整句子大声回答关于朋友和家人的问题。",
  ),
  "b1-listening-cities-and-transport": t(
    "*The number five bus will not stop at the station this week. Please use the number seven.* Which bus will not stop? You will hear city and transport words in sentences, then answer questions about directions, timetables and city life.",
    "*The number five bus will not stop at the station this week. Please use the number seven.* 哪路车不停？本主题先在句子里听出城市和交通词汇，再回答关于问路、时刻表和城市生活的问题。",
  ),
  "b1-speaking-cities-and-transport": t(
    "*Pedestrian* is *puh-DES-tree-un* and *commute* is stressed at the end. You will say this unit's city and transport words after a recording and read sentences about getting around aloud.",
    "*pedestrian* 读 *puh-DES-tree-un*，*commute* 重音在后。本主题跟着录音说本单元的城市和交通词汇，并朗读关于出行的句子。",
  ),
  "b1-answering-cities-and-transport": t(
    "*How long is your journey to school?* — *It takes twenty minutes.* You will answer questions about your city and how you travel aloud, in full sentences with the word you are given.",
    "*How long is your journey to school?* —— *It takes twenty minutes.* 本主题用给出的词，以完整句子大声回答关于你的城市和出行方式的问题。",
  ),
  "b1-listening-science-and-discovery": t(
    "*We expected the plants to grow faster in the dark, but they grew faster in the sun.* The result follows *but*. You will hear science words in sentences, then answer questions about experiments, discoveries and inventions.",
    "*We expected the plants to grow faster in the dark, but they grew faster in the sun.* 结果在 *but* 后面。本主题先在句子里听出科学词汇，再回答关于实验、发现和发明的问题。",
  ),
  "b1-speaking-science-and-discovery": t(
    "*Hypothesis* is *hy-POTH-uh-sis*, and *analyze* moves its stress in *analysis*. You will repeat this unit's science words after a recording and read sentences about research and space aloud.",
    "*hypothesis* 读 *hy-POTH-uh-sis*，*analyze* 到 *analysis* 重音会移动。本主题跟着录音说本单元的科学词汇，并朗读关于研究和太空的句子。",
  ),
  "b1-answering-science-and-discovery": t(
    "*What would you like to discover?* — *I would like to discover a new planet.* You will answer questions about science aloud, in full sentences with the word or phrase you are given.",
    "*What would you like to discover?* —— *I would like to discover a new planet.* 本主题用给出的词或短语，以完整句子大声回答关于科学的问题。",
  ),
  "b1-listening-money-and-consumers": t(
    "*It was sixty dollars, but it was on sale, so I paid forty.* The price paid is the second number. You will hear money words in sentences, then answer questions about prices, refunds, saving and deliveries.",
    "*It was sixty dollars, but it was on sale, so I paid forty.* 实付的是第二个数字。本主题先在句子里听出金钱词汇，再回答关于价钱、退款、存钱和送货的问题。",
  ),
  "b1-speaking-money-and-consumers": t(
    "*Debt* hides a silent *b*, and *guarantee* is stressed at the end, *gair-un-TEE*. You will say this unit's money words after a recording and read sentences about buying and saving aloud.",
    "*debt* 的 *b* 不发音，*guarantee* 重音在后，*gair-un-TEE*。本主题跟着录音说本单元的金钱词汇，并朗读关于消费和储蓄的句子。",
  ),
  "b1-answering-money-and-consumers": t(
    "*How do you usually pay in shops?* — *I usually pay by card.* You will answer questions about money and shopping aloud, in full sentences with the word or phrase you are given.",
    "*How do you usually pay in shops?* —— *I usually pay by card.* 本主题用给出的词或短语，以完整句子大声回答关于金钱和购物的问题。",
  ),
  "b1-listening-arts-and-entertainment": t(
    "*The ads start at seven o'clock, but the film itself starts at seven thirty.* Two times, and only one is the film. You will hear arts words in sentences, then answer questions about shows, books and what people thought of them.",
    "*The ads start at seven o'clock, but the film itself starts at seven thirty.* 两个时间，只有一个是电影开场。本主题先在句子里听出艺术词汇，再回答关于演出、书籍和观众评价的问题。",
  ),
  "b1-speaking-arts-and-entertainment": t(
    "*Choir* sounds like *KWIRE* and *orchestra* is *OR-kis-truh*. You will repeat this unit's arts words after a recording and read sentences about films, music and books aloud.",
    "*choir* 读作 *KWIRE*，*orchestra* 读 *OR-kis-truh*。本主题跟着录音说本单元的艺术词汇，并朗读关于电影、音乐和书籍的句子。",
  ),
  "b1-answering-arts-and-entertainment": t(
    "*Which instrument would you like to learn?* — *I would like to learn the piano.* You will answer questions about arts and entertainment aloud, in full sentences with the word you are given.",
    "*Which instrument would you like to learn?* —— *I would like to learn the piano.* 本主题用给出的词，以完整句子大声回答关于艺术和娱乐的问题。",
  ),

  // B2
  "b2-listening-society-and-change": t(
    "*Twenty years ago it was about two million people; today it is closer to four million.* A report sets the past against the present. You will hear words about society in sentences, then answer questions about population, history and social problems.",
    "*Twenty years ago it was about two million people; today it is closer to four million.* 报道把过去和现在放在一起。本主题先在句子里听出关于社会的词，再回答关于人口、历史和社会问题的问题。",
  ),
  "b2-speaking-society-and-change": t(
    "*Migrate* is *MY-grate* but *migration* is *my-GRAY-shun*: stress moves inside a word family. You will say this unit's words about society after a recording and read sentences about change aloud.",
    "*migrate* 读 *MY-grate*，*migration* 读 *my-GRAY-shun*：同族词的重音会移动。本主题跟着录音说本单元关于社会的词，并朗读关于社会变迁的句子。",
  ),
  "b2-answering-society-and-change": t(
    "*Which group needs more support from society?* — *Older people need more support.* You will answer questions about society and change aloud, in full sentences with the words you are given.",
    "*Which group needs more support from society?* —— *Older people need more support.* 本主题用给出的词，以完整句子大声回答关于社会与变迁的问题。",
  ),
  "b2-listening-work-and-the-economy": t(
    "*The first plan was twenty, but because of the budget it's now just ten.* The number that stands is the one after *now*. You will hear economic words in sentences, then answer questions about shares, offices, hiring and mergers.",
    "*The first plan was twenty, but because of the budget it's now just ten.* 最终的数字在 *now* 后面。本主题先在句子里听出经济词汇，再回答关于股价、办公室、招聘和合并的问题。",
  ),
  "b2-speaking-work-and-the-economy": t(
    "*Mortgage* hides a silent *t*, *MOR-gij*, and *economic* is *ee-kuh-NOM-ik*. You will repeat this unit's words about work and money after a recording and read sentences about the economy aloud.",
    "*mortgage* 的 *t* 不发音，读 *MOR-gij*；*economic* 读 *ee-kuh-NOM-ik*。本主题跟着录音说本单元关于工作和金融的词，并朗读关于经济的句子。",
  ),
  "b2-answering-work-and-the-economy": t(
    "*Would you rather work from home or in an office?* — *I would rather work from home.* You will answer questions about work and the economy aloud, in full sentences with the words you are given.",
    "*Would you rather work from home or in an office?* —— *I would rather work from home.* 本主题用给出的词，以完整句子大声回答关于工作和经济的问题。",
  ),
  "b2-listening-science-ethics-and-medicine": t(
    "*The new drug helped two thirds of patients. The older treatment helped only half.* Two treatments, two results. You will hear medical words in sentences, then answer questions about trials, risks and the ethics of research.",
    "*The new drug helped two thirds of patients. The older treatment helped only half.* 两种疗法，两个结果。本主题先在句子里听出医学词汇，再回答关于试验、风险和研究伦理的问题。",
  ),
  "b2-speaking-science-ethics-and-medicine": t(
    "*Antibiotic* is *an-tee-by-OT-ik* and *controversial* is *kon-truh-VER-shul*. You will say this unit's words about medicine and ethics after a recording and read sentences about them aloud.",
    "*antibiotic* 读 *an-tee-by-OT-ik*，*controversial* 读 *kon-truh-VER-shul*。本主题跟着录音说本单元关于医学和伦理的词，并朗读相关句子。",
  ),
  "b2-answering-science-ethics-and-medicine": t(
    "*How do you look after your mental health?* — *I look after my mental health by getting enough sleep.* You will answer questions about health and medical science aloud, in full sentences with the words you are given.",
    "*How do you look after your mental health?* —— *I look after my mental health by getting enough sleep.* 本主题用给出的词，以完整句子大声回答关于健康和医学的问题。",
  ),
  "b2-listening-climate-and-sustainability": t(
    "*The government aims to cut emissions by half by twenty forty. Its earlier target was twenty thirty-five.* The target now is the first year. You will hear climate words in sentences, then answer questions about energy, floods and local projects.",
    "*The government aims to cut emissions by half by twenty forty. Its earlier target was twenty thirty-five.* 现在的目标是第一个年份。本主题先在句子里听出气候词汇，再回答关于能源、洪水和本地项目的问题。",
  ),
  "b2-speaking-climate-and-sustainability": t(
    "*Biodiversity* has six beats and *nuclear* is *NOO-klee-er*. You will repeat this unit's climate and energy words after a recording and read sentences about sustainability aloud.",
    "*biodiversity* 有六拍，*nuclear* 读 *NOO-klee-er*。本主题跟着录音说本单元关于气候和能源的词，并朗读关于可持续发展的句子。",
  ),
  "b2-answering-climate-and-sustainability": t(
    "*Which source of energy should we use more?* — *We should use more solar power.* You will answer questions about the climate aloud, in full sentences with the words you are given.",
    "*Which source of energy should we use more?* —— *We should use more solar power.* 本主题用给出的词，以完整句子大声回答关于气候的问题。",
  ),
  "b2-listening-media-and-persuasion": t(
    "*Everyone thinks it was a blog, but it actually started on a podcast.* What everyone thinks is the decoy. You will hear media words in sentences, then answer questions about stories, adverts and time online.",
    "*Everyone thinks it was a blog, but it actually started on a podcast.* 大家以为的是干扰项。本主题先在句子里听出媒体词汇，再回答关于报道、广告和上网时间的问题。",
  ),
  "b2-speaking-media-and-persuasion": t(
    "*Column* hides a silent *n*, *KOL-um*, and *algorithm* is *AL-guh-rith-um*. You will say this unit's media words after a recording and read sentences about news and persuasion aloud.",
    "*column* 的 *n* 不发音，读 *KOL-um*；*algorithm* 读 *AL-guh-rith-um*。本主题跟着录音说本单元的媒体词汇，并朗读关于新闻和说服的句子。",
  ),
  "b2-answering-media-and-persuasion": t(
    "*How do you check if a story is true?* — *I check it by trying to compare sources.* You will answer questions about the media aloud, in full sentences with the words you are given.",
    "*How do you check if a story is true?* —— *I check it by trying to compare sources.* 本主题用给出的词，以完整句子大声回答关于媒体的问题。",
  ),
  "b2-listening-education-and-opportunity": t(
    "*My parents wanted me to apply to Leeds, but I chose Bristol.* The choice follows *I chose*. You will hear words about higher education in sentences, then answer questions about universities, deadlines and assessment.",
    "*My parents wanted me to apply to Leeds, but I chose Bristol.* 选择在 *I chose* 后面。本主题先在句子里听出高等教育词汇，再回答关于大学、截止日期和考核方式的问题。",
  ),
  "b2-speaking-education-and-opportunity": t(
    "*Plagiarism* is *PLAY-juh-riz-um* and *academic* is *ak-uh-DEM-ik*. You will repeat this unit's education words after a recording and read sentences about learning and opportunity aloud.",
    "*plagiarism* 读 *PLAY-juh-riz-um*，*academic* 读 *ak-uh-DEM-ik*。本主题跟着录音说本单元的教育词汇，并朗读关于学习和机会的句子。",
  ),
  "b2-answering-education-and-opportunity": t(
    "*What would you like to study at university?* — *I would like to study medicine.* You will answer questions about education aloud, in full sentences with the words you are given.",
    "*What would you like to study at university?* —— *I would like to study medicine.* 本主题用给出的词，以完整句子大声回答关于教育的问题。",
  ),
  "b2-listening-culture-identity-and-globalization": t(
    "*My parents speak Polish to each other, but with us they always speak Spanish.* *To each other* and *with us* split the two languages. You will hear words about culture in sentences, then answer questions about language, festivals and living abroad.",
    "*My parents speak Polish to each other, but with us they always speak Spanish.* *to each other* 和 *with us* 把两种语言分开。本主题先在句子里听出文化词汇，再回答关于语言、节日和海外生活的问题。",
  ),
  "b2-speaking-culture-identity-and-globalization": t(
    "*Indigenous* is *in-DIJ-ih-nus* and *pronunciation* has no *noun* in it. You will say this unit's words about identity and language after a recording and read sentences about culture aloud.",
    "*indigenous* 读 *in-DIJ-ih-nus*，*pronunciation* 里没有 *noun*。本主题跟着录音说本单元关于身份和语言的词，并朗读关于文化的句子。",
  ),
  "b2-answering-culture-identity-and-globalization": t(
    "*Which tradition from your culture would you share with the world?* — *I would share our food.* You will answer questions about culture and globalization aloud, in full sentences with the words you are given.",
    "*Which tradition from your culture would you share with the world?* —— *I would share our food.* 本主题用给出的词，以完整句子大声回答关于文化和全球化的问题。",
  ),
  "b2-listening-technology-and-the-future": t(
    "*The mission to Mars, first planned for twenty thirty, is now expected to launch in twenty thirty-four.* The plan changed, and the answer is the new year. You will hear technology words in sentences, then answer questions about AI, cyber attacks and space.",
    "*The mission to Mars, first planned for twenty thirty, is now expected to launch in twenty thirty-four.* 计划变了，答案是新的年份。本主题先在句子里听出科技词汇，再回答关于人工智能、网络攻击和太空的问题。",
  ),
  "b2-speaking-technology-and-the-future": t(
    "*Autonomous* is *aw-TON-uh-mus* and *phishing* starts with an *f*. You will repeat this unit's words about technology after a recording and read sentences about the future aloud.",
    "*autonomous* 读 *aw-TON-uh-mus*，*phishing* 开头读 *f*。本主题跟着录音说本单元的科技词汇，并朗读关于未来的句子。",
  ),
  "b2-answering-technology-and-the-future": t(
    "*Which job will robots do first?* — *I think robots will drive taxis first.* You will answer questions about technology and the future aloud, in full sentences with the words you are given.",
    "*Which job will robots do first?* —— *I think robots will drive taxis first.* 本主题用给出的词，以完整句子大声回答关于科技和未来的问题。",
  ),
  "b2-listening-law-rights-and-justice": t(
    "*The man was sentenced to three years in prison. He could have received up to ten.* The sentence is the first number, not the most he could have got. You will hear legal words in sentences, then answer questions about courts, rights and new laws.",
    "*The man was sentenced to three years in prison. He could have received up to ten.* 判决是第一个数字，不是最多可判的年数。本主题先在句子里听出法律词汇，再回答关于法庭、权利和新法律的问题。",
  ),
  "b2-speaking-law-rights-and-justice": t(
    "*Permit* is *PER-mit* as a noun and *per-MIT* as a verb, and *jury* is *JOOR-ee*. You will say this unit's legal words after a recording and read sentences about rights and justice aloud.",
    "*permit* 作名词读 *PER-mit*，作动词读 *per-MIT*；*jury* 读 *JOOR-ee*。本主题跟着录音说本单元的法律词汇，并朗读关于权利和正义的句子。",
  ),
  "b2-answering-law-rights-and-justice": t(
    "*What age should people be able to vote?* — *They should be able to vote at sixteen.* You will answer questions about law and rights aloud, in full sentences with the words you are given.",
    "*What age should people be able to vote?* —— *They should be able to vote at sixteen.* 本主题用给出的词，以完整句子大声回答关于法律和权利的问题。",
  ),
  "b2-listening-mind-and-behavior": t(
    "*Our next talk has moved from room two hundred to room three hundred and ten.* The room now is the one after *to*. You will hear words about the mind in sentences, then answer questions about sleep, decisions and habits.",
    "*Our next talk has moved from room two hundred to room three hundred and ten.* 现在的房间是 *to* 后面那个。本主题先在句子里听出关于心理的词，再回答关于睡眠、决策和习惯的问题。",
  ),
  "b2-speaking-mind-and-behavior": t(
    "*Psychologist* hides a silent *p*, and *procrastinate* is *proh-KRAS-tih-nate*. You will repeat this unit's words about the mind after a recording and read sentences about behavior aloud.",
    "*psychologist* 的 *p* 不发音，*procrastinate* 读 *proh-KRAS-tih-nate*。本主题跟着录音说本单元关于心理的词，并朗读关于行为的句子。",
  ),
  "b2-answering-mind-and-behavior": t(
    "*What habit would you like to change?* — *I would like to change going to bed late.* You will answer questions about the mind and behavior aloud, in full sentences with the words you are given.",
    "*What habit would you like to change?* —— *I would like to change going to bed late.* 本主题用给出的词，以完整句子大声回答关于心理和行为的问题。",
  ),
};

/** levelAuralIntro is the introduction of a level's pair, listening, speaking or answering topic. */
export function levelAuralIntro(id: string): Text {
  const intro = levelAuralIntros[id];
  if (!intro) throw new Error(`${id}: no introduction in levels/intros.ts`);
  return intro;
}
