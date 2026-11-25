// Grade 10: the batches of words of puzzling and pondering, of rough handling, of fire and heat, of crowds, of
// blocking and breaking, of urging, of flinching and of strong dislike.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const puzzling = batch(
  "words-of-puzzling-and-pondering",
  ["Words of Puzzling and Pondering", "困惑与思考的词"],
  ["being confused, thinking hard and asking", "困惑、苦思与提问"],
  `
  baffle|to confuse someone completely|使困惑|The riddle will ___ you; even clever people cannot work out the answer.|Her silence seemed to ___ him completely, and he had no idea what she meant.|The case continues to ___ the police, who are completely confused about what happened.|garble,ponder|baffling
  bewilder|to cause someone to become perplexed and confused|使迷惑|The new traffic rules ___ many drivers, who are confused about which way to turn.|The maze is meant to ___ visitors, leaving them lost and confused among its paths.|Big cities can ___ newcomers, who feel confused by the noise and the crowded streets.|ponder,surmise|bewildering,bewilderment
  perplex|to make someone feel completely puzzled|使困惑|Her strange answer seemed to ___ him, leaving him puzzled about what she meant.|Such questions ___ even experts, who remain puzzled after years of study.|The problem will ___ you at first, but it becomes clear once you draw a diagram.|garble,surmise|perplexing
  fluster|to make someone agitated or confused; a nervous state|使慌乱|Don't let the noisy crowd ___ you; stay calm and don't get nervous and muddled.|Rapid questions from reporters tend to ___ her, so she gets nervous and mixes up her answers.|The fire alarm seemed to ___ the new waiter, who nervously dropped plates in a panic.|ponder,garble|flustered
  dazed|unable to think clearly, especially after a shock or blow|恍惚的，晕眩的|After hitting his head on the ice, he looked ___, unable to think clearly or say where he was.|She walked out of the car crash ___ and confused, too shocked to answer the police.|The ___ boxer sat on the floor after the punch, shaking his head and staring blankly.|weary,haggard|
  garble|to mix up words or a message so that it is hard to understand|歪曲，混淆(信息)|A bad phone line can ___ a call, mixing up the words until no one understands them.|Don't ___ the instructions when you pass them on; repeat them clearly and in the right order.|He tends to ___ his words when he is nervous, mixing them up so badly that no one can follow.|scrawl,baffle|garbled
  ponder|to think about something carefully|仔细考虑|Take time to ___ your choice carefully before you decide.|She sat down by the window to ___ the problem, thinking about it for a long time.|He liked to ___ the stars at night, thinking deeply about how far away they were.|surmise,garble|pondered
  surmise|to suppose something without having evidence|推测|With no witnesses, we can only ___ what happened that night, guessing without proof.|I ___ that she left early, though I have no proof; her coat is gone.|From his gloomy face, I ___ that the news was bad, though he had not said a word.|comprehend,query|surmised
  comprehend|to understand fully|理解|She could not ___ his anger; she simply did not understand why he was so upset.|It is hard to ___ the size of space; the mind cannot fully grasp it.|Read the text slowly so that you fully ___ every idea in it.|ponder,surmise|comprehended,comprehension
  query|a question, especially one addressed to an official; to ask|疑问；询问|If you have a ___ about your bill, a question we can answer, please call us.|The clerk patiently answered every ___ that the visitors asked.|Send your ___ to the help desk, and someone will reply to your question within a day.|caveat,conjecture|queried,queries
  `,
  "context-clues",
  {
    intro: t(
      "The strange map seemed to **baffle** everyone, so we sat down to **ponder** it, and I could only **surmise** that the X marked a well. These ten words help you talk about being confused, thinking hard and asking questions.",
      "这张怪地图似乎把每个人都难住了（**baffle**），于是我们坐下来仔细琢磨（**ponder**），我只能推测（**surmise**）那个 X 标的是一口井。这十个词帮你谈论困惑、苦思和提问。",
    ),
    watchOut: {
      meanings: t(
        "**Baffle**, **bewilder** and **perplex** all *confuse* someone, but **fluster** adds *nervousness*, and **dazed** describes someone *stunned* by a shock or blow.",
        "**baffle**、**bewilder**、**perplex** 都是让人困惑，**fluster** 还带着慌乱，**dazed** 则形容被冲击或撞击弄得发懵的人。",
      ),
      use: t(
        "To **ponder** is to think *carefully*; to **surmise** is to *guess* without proof; to **comprehend** is to *understand fully*; and to **garble** is to *mix up* words.",
        "**ponder** 是仔细思考；**surmise** 是无凭无据地猜测；**comprehend** 是完全理解；**garble** 是把话说乱。",
      ),
      spelling: t(
        "**Baffle** has a double *f*; **surmise** ends in *-ise*, not *-ize*; **query** has *qu* followed by *-ery*.",
        "**baffle** 双写 f；**surmise** 以 -ise 结尾，不是 -ize；**query** 是 qu 后接 -ery。",
      ),
    },
    notes: `
      baffle|a riddle even clever people cannot work out|a silence that left a man with no idea what was meant|a case the police are completely confused about|baffle confuses someone else; ponder is thinking hard yourself|baffle 让别人困惑；ponder 是自己仔细思考|garble means to mix up words or a message, not to confuse a person completely|garble 指把话语或信息弄乱，不是让人彻底困惑|ponder means to think carefully about something, not to leave someone confused|ponder 指仔细思考，不是让人困惑|baf · fle|the double f before -le|-le 前面双写 f
      bewilder|traffic rules leaving drivers confused about which way to turn|a maze leaving visitors lost among its paths|newcomers confused by a city's noise and crowds|bewilder leaves someone lost and confused; surmise is guessing without proof|bewilder 让人迷惑；surmise 是无凭据的猜测|ponder means to think about something carefully, not to make someone lost and confused|ponder 指仔细思考，不是让人迷失困惑|surmise means to guess without evidence, not to confuse someone|surmise 指无凭据地猜测，不是让人困惑|be · wil · der|be- followed by wilder|be- 加 wilder
      perplex|a strange answer leaving a man puzzled|questions that keep experts puzzled for years|a problem that puzzles you until you draw a diagram|perplex puzzles someone; garble mixes up words|perplex 使人困惑；garble 把话弄乱|garble means to mix up a message, not to puzzle a person|garble 指把信息弄乱，不是使人困惑|surmise means to suppose without evidence, not to leave someone puzzled|surmise 指无凭据地推测，不是让人困惑|per · plex|the -plex ending|结尾是 -plex
      fluster|a noisy crowd making someone nervous and muddled|reporters' rapid questions making a woman mix up her answers|a fire alarm making a waiter drop plates in a panic|fluster makes someone nervous and muddled; ponder means thinking calmly|fluster 使人慌乱；ponder 是冷静地思考|ponder means to think carefully, the opposite of becoming nervous and muddled|ponder 指仔细思考，与慌乱失措正相反|garble means to mix up words, not to make a person nervous|garble 指把话说乱，不是使人紧张|flus · ter|the -ter ending|结尾是 -ter
      dazed|a man unable to think clearly after hitting his head|a woman too shocked to answer after a crash|a boxer staring blankly after a punch|dazed is stunned by a shock or blow; weary is simply very tired|dazed 被冲击打懵；weary 只是很累|weary means very tired, not stunned and unable to think after a shock|weary 指非常疲倦，不是受到冲击后头脑发懵|haggard means looking exhausted and unwell, not stunned by a blow|haggard 指憔悴疲惫，不是被撞击打懵|dazed|the z and the -ed ending|中间是 z，结尾是 -ed
      garble|a bad phone line mixing up the words of a call|instructions passed on out of order|a nervous man mixing up his words|garble mixes up words; baffle confuses the listener|garble 把话说乱；baffle 让听的人困惑|scrawl means to write in a hurried, messy way, not to mix up the words of a spoken message|scrawl 指潦草地写，不是把口头信息说乱|baffle means to confuse a person, not to mix up the words of a message|baffle 指使人困惑，不是把信息的词句弄乱|gar · ble|the -ble ending|结尾是 -ble
      ponder|thinking carefully before a choice|thinking about a problem for a long time by a window|thinking deeply about how far away the stars are|ponder is careful thinking; surmise is a quick guess|ponder 是仔细思考；surmise 是随意猜测|surmise means to guess without evidence, not to think long and carefully|surmise 指无凭据地猜，不是长时间仔细思考|garble means to mix up words, not to think about something carefully|garble 指把话说乱，不是仔细思考|pon · der|the -der ending|结尾是 -der
      surmise|guessing without proof what happened with no witnesses|supposing a woman left early because her coat is gone|guessing bad news from a gloomy face|surmise guesses without proof; comprehend understands fully|surmise 无凭据地猜；comprehend 完全理解|comprehend means to understand fully, not to guess without proof|comprehend 指完全理解，不是无凭据地猜测|query means to ask a question, not to suppose something without evidence|query 指提出疑问，不是无凭据地推测|sur · mise|the -ise ending, not -ize|结尾是 -ise，不是 -ize
      comprehend|a woman who did not understand why a man was upset|the mind unable to fully grasp the size of space|reading slowly to fully understand every idea|comprehend means understanding fully; ponder means thinking it over|comprehend 是完全理解；ponder 是反复思考|ponder means to think about something carefully, which does not mean you understand it|ponder 指仔细思考，不等于已经理解|surmise means to guess without evidence, not to understand fully|surmise 指无凭据地猜测，不是完全理解|com · pre · hend|com- + pre- + hend|com- 加 pre- 加 hend
      query|a question about a bill that a company can answer|questions a clerk answered for visitors|a question sent to a help desk for a reply|a query is a question asked; a caveat is a warning added|query 是提出的问题；caveat 是附加的提醒|caveat is a warning that a claim has limits, not a question someone asks|caveat 是说明有局限的提醒，不是别人提的问题|conjecture is a guess without evidence, not a question waiting for an answer|conjecture 是无凭据的猜测，不是等待回答的问题|que · ry|the qu followed by -ery|qu 后接 -ery
    `,
  },
);

const handling = batch(
  "words-of-rough-handling",
  ["Words of Rough Handling", "粗暴动作的词"],
  ["waving, pushing, throwing, searching and twisting", "挥舞、推挤、投掷、翻找与扭曲"],
  `
  brandish|to wave something as a threat or in excitement|挥舞|The robber began to ___ a knife, waving it in the air to frighten the shopkeeper.|Fans ___ their scarves above their heads, waving them wildly as the team scores.|Furious, she would ___ the letter in his face, shaking it at him as she shouted.|hurl,lunge|brandished
  grope|to search blindly with the hands|摸索|In the pitch-dark room, she had to ___ along the wall for the light switch, feeling her way with her hands.|Blindfolded, he had to ___ in front of him with outstretched hands to find the door.|Lost in the thick smoke, the firefighters had to ___ their way along the corridor by touch.|rummage,lunge|groped
  jostle|to push against people in a crowd|推挤|Fans began to ___ one another in the packed crowd, pushing for a better view.|Don't ___ the old lady on the crowded bus; stop pushing against her.|Shoppers ___ each other at the busy sale, pushing and shoving to reach the bargains.|lunge,contort|jostled,jostling
  lunge|a sudden forward movement; to make one|猛冲|The dog tried to ___ at the cat, leaping suddenly forward on its lead.|The goalkeeper had to ___ to his left, throwing himself suddenly forward to catch the ball.|When the guard turned, she would ___ for the door in one sudden forward rush.|jostle,hurl|lunged
  hurl|to throw with great force|猛投|He chose to ___ the stone far into the lake, throwing it with all his strength.|Angry protesters began to ___ bottles at the police, throwing them hard over the fence.|In her rage she would ___ insults at him, flinging cruel words with great force.|brandish,douse|hurled
  rummage|to search untidily through a mass of things|翻找|She began to ___ in her messy bag for a pen, pulling out keys, papers and sweets.|They ___ through old boxes in the attic, tossing things aside untidily as they search.|Don't ___ in my drawers, turning everything upside down while you look!|scour,grope|rummaged
  scour|to clean by hard rubbing; to search thoroughly|擦洗；搜寻|Police will ___ the woods, searching every inch for the missing boy.|She would ___ the newspapers for jobs, reading every advertisement carefully.|Rescuers ___ the ruins for survivors, searching every corner thoroughly.|rummage,scrawl|scoured
  scrawl|to write in a hurried, careless way; such writing|潦草地写；潦草的字迹|In a hurry, he began to ___ his name across the wall in big, messy letters.|Don't ___ in your books; write neatly if you write in them at all.|She had time only to ___ a quick note, the words so messy they were barely readable.|garble,scour|scrawled
  douse|to pour a liquid over; to put out a fire|浇水；熄灭|Firemen had to ___ the flames with water from the hoses until the fire went out.|She would ___ the salad with oil, pouring far too much over it.|Always ___ the campfire with a bucket of water before you leave.|hurl,scald|doused
  contort|to twist or bend out of normal shape|扭曲|Pain made him ___ his face, twisting it out of shape.|Acrobats ___ their bodies, bending and twisting them into strange shapes.|Don't ___ the facts by twisting them until they mean something else.|jostle,scrawl|contorted,contortion
  `,
  "context-clues",
  {
    intro: t(
      "At the market people **jostle** for space, a boy tries to **hurl** a ball over the stalls, and a woman stops to **rummage** through a box of old coins. These ten words help you describe rough, quick movements of the hands and body.",
      "集市上人们推推搡搡（**jostle**）抢位置，一个男孩想把球猛扔（**hurl**）过摊位，一位妇女停下来在一盒旧硬币里翻找（**rummage**）。这十个词帮你描写手和身体粗猛、急促的动作。",
    ),
    watchOut: {
      meanings: t(
        "To **brandish** is to *wave* something while keeping hold of it; to **hurl** is to *throw* it away with force; to **lunge** is to throw *your whole body* forward.",
        "**brandish** 是拿在手里挥舞；**hurl** 是用力扔出去；**lunge** 是整个人猛地向前扑。",
      ),
      use: t(
        "You **grope** *blindly* by touch, **rummage** *untidily* through a mess, and **scour** a place *thoroughly*, inch by inch.",
        "**grope** 是看不见时靠手摸索，**rummage** 是在一堆东西里乱翻，**scour** 是一寸一寸地彻底搜寻。",
      ),
      spelling: t(
        "**Brandish** ends in *-ish*; **jostle** has a silent *t*; **scour** has *ou* as in *sour*.",
        "**brandish** 以 -ish 结尾；**jostle** 中的 t 不发音；**scour** 的 ou 同 sour。",
      ),
    },
    notes: `
      brandish|a robber waving a knife in the air to frighten someone|fans waving scarves wildly above their heads|a woman shaking a letter in a man's face|brandish waves something while holding it; hurl throws it away|brandish 是握着挥舞；hurl 是扔出去|hurl means to throw something hard, not to keep hold of it and wave it|hurl 指用力扔出，不是握在手里挥舞|lunge means to move your whole body suddenly forward, not to wave something in your hand|lunge 指整个人猛地前冲，不是挥舞手中的东西|bran · dish|the -ish ending|结尾是 -ish
      grope|feeling along a dark wall for a light switch|a blindfolded man reaching out with his hands to find a door|firefighters feeling their way through smoke by touch|grope searches blindly by touch; rummage searches untidily through a mess|grope 靠触摸摸索；rummage 在一堆东西里乱翻|rummage means to search untidily through a pile of things, not to feel your way blindly|rummage 指在一堆东西里乱翻，不是看不见时摸索前进|lunge means a sudden forward rush, not slowly feeling your way by touch|lunge 指猛地前冲，不是慢慢摸索|grope|the -ope ending, as in rope|结尾 -ope 同 rope
      jostle|fans pushing one another in a packed crowd|someone pushing against an old lady on a crowded bus|shoppers pushing and shoving at a sale|jostle pushes against people in a crowd; lunge is one sudden forward move|jostle 在人群中推挤；lunge 是一次猛冲|lunge means one sudden forward movement, not pushing against people in a crowd|lunge 指一下猛冲，不是在人群中推挤|contort means to twist something out of shape, not to push against people|contort 指扭曲变形，不是推挤他人|jos · tle|the silent t, said like jossle|t 不发音，读作 jossle
      lunge|a dog leaping suddenly forward at a cat|a goalkeeper throwing himself forward to catch a ball|a sudden forward rush for a door|lunge throws your body forward; jostle pushes against people around you|lunge 是身体猛扑向前；jostle 是推挤周围的人|jostle means to push against people in a crowd, not one sudden leap forward|jostle 指在人群中推挤，不是一下子扑向前|hurl means to throw something with force, not to throw your own body forward|hurl 指用力扔东西，不是自己扑过去|lunge|the -nge ending, as in sponge|结尾 -nge 同 sponge
      hurl|throwing a stone far into a lake with all one's strength|protesters throwing bottles hard over a fence|flinging cruel insults with great force|hurl throws with force; brandish waves while holding on|hurl 用力扔出；brandish 握着挥舞|brandish means to wave something while holding it, not to throw it away|brandish 指握着挥舞，不是扔出去|douse means to pour liquid over something, not to throw it hard|douse 指往上浇液体，不是用力扔|hurl|the ur, as in hurt|ur 同 hurt
      rummage|pulling keys, papers and sweets out of a messy bag|tossing things aside in old attic boxes|turning drawers upside down while looking|rummage searches untidily; scour searches thoroughly and carefully|rummage 乱翻；scour 彻底仔细地搜|scour means to search thoroughly and carefully, not to dig untidily through a mess|scour 指彻底仔细地搜寻，不是在一堆东西里乱翻|grope means to feel for something blindly, not to toss things aside as you look|grope 指看不见时摸索，不是边找边乱扔|rum · mage|the double m and the -age ending|双写 m，结尾是 -age
      scour|police searching every inch of the woods|reading every job advertisement in the papers|rescuers searching every corner of ruins|scour searches thoroughly; rummage digs untidily|scour 彻底搜寻；rummage 乱翻|rummage means to dig untidily through a pile, not to search every inch of a place|rummage 指在一堆东西里乱翻，不是把一个地方搜遍|scrawl means to write in a messy way, not to search thoroughly|scrawl 指潦草地写，不是彻底搜寻|scour|the ou, as in sour|ou 同 sour
      scrawl|a name written across a wall in big, messy letters|writing messily in books instead of neatly|a quick note so messy it was barely readable|scrawl writes messily; garble mixes up the words themselves|scrawl 是字写得潦草；garble 是把话本身弄乱|garble means to mix up the words of a message, not to write the letters messily|garble 指把信息的词句弄乱，不是把字写得潦草|scour means to search thoroughly, not to write in a hurry|scour 指彻底搜寻，不是匆忙地写|scrawl|the aw, as in crawl|aw 同 crawl
      douse|firemen putting out flames with water from hoses|pouring far too much oil over a salad|putting out a campfire with a bucket of water|douse pours liquid over; scald burns with hot liquid|douse 是往上浇液体；scald 是被热液烫伤|hurl means to throw something hard, not to pour liquid over it|hurl 指用力扔，不是浇液体|scald means to burn with very hot liquid, not to put out a fire or pour oil on a salad|scald 指被热液烫伤，不是灭火或往沙拉上浇油|douse|the ou, as in house|ou 同 house
      contort|a face twisted out of shape by pain|acrobats bending their bodies into strange shapes|facts twisted until they mean something else|contort twists out of shape; jostle pushes in a crowd|contort 扭曲变形；jostle 在人群中推挤|jostle means to push against people in a crowd, not to twist something out of shape|jostle 指在人群中推挤，不是扭曲变形|scrawl means to write messily, not to bend or twist something|scrawl 指潦草地写，不是弯曲扭转|con · tort|con- followed by tort|con- 加 tort
    `,
  },
);

const heat = batch(
  "words-of-fire-and-heat",
  ["Words of Fire and Heat", "火与热的词"],
  ["lighting, burning, boiling and thirst", "点燃、燃烧、沸腾与口渴"],
  `
  ignite|to catch fire or cause to catch fire; to arouse|点燃；激起|A single spark may ___ the gas, setting it suddenly on fire.|Her fiery speech helped ___ the protest, setting the crowd's anger alight.|The dry grass began to ___, catching fire from the dropped match.|quench,scald|ignited,ignition
  kindle|to light a fire; to arouse an emotion|点燃；激起|We gathered dry twigs to ___ the campfire, lighting it with a single match.|The book helped ___ her love of history, sparking an interest that grew for years.|A good teacher can ___ curiosity, lighting a spark of interest in every student.|quench,parch|kindled
  smolder|to burn slowly with smoke but no flame; to feel suppressed anger|闷烧；郁积|After the fire, the ashes continued to ___, giving off smoke with no flame.|Anger continued to ___ inside him for years, hidden but never going out.|A peat fire may ___ underground for days, burning slowly with smoke but no flames.|scald,ignite|smoldered,smoldering
  scald|to burn with very hot liquid or steam|烫伤|Be careful not to ___ your hand with the boiling water from the kettle.|Steam from the pot can ___ your skin and leave a painful burn.|Tea that hot may ___ the baby's mouth, so let it cool first.|smolder,swelter|scalded,scalding
  simmer|to stay just below boiling; to be in a state of suppressed anger|慢炖；即将爆发|Let the soup ___ for an hour, just below boiling over a low flame.|Tension continued to ___ in the town, quietly building but not yet exploding.|Cover the pot and ___ the rice gently, just below the boil, until it is soft.|parch,scald|simmered
  seethe|to be filled with intense but unexpressed anger; to bubble as if boiling|怒火中烧；沸腾|She began to ___ with rage, furious inside but saying nothing.|The sea seemed to ___ in the storm, foaming and churning as if it were boiling.|He would ___ in silence, burning with anger he never let out.|parch,quench|seethed,seething
  swelter|to be uncomfortably hot|热得难受|We ___ in the summer heat, sweating in the stuffy classroom.|Workers ___ in the hot factory, dripping with sweat all day.|Tourists ___ in the crowds under the burning midday sun.|scald,parch|sweltered,sweltering
  parch|to make or become dry through intense heat|烤干|The blazing sun will ___ the fields, drying them until the soil cracks.|Months of drought began to ___ the land, leaving it dry and cracked.|Hot, dry air can ___ your throat, leaving it painfully dry.|quench,swelter|parched
  quench|to satisfy thirst; to put out a fire|解渴；熄灭|Cold water will ___ your thirst after the long run.|Firefighters worked all night to ___ the flames and put the fire out.|Nothing could ___ her thirst for knowledge; she always wanted to learn more.|kindle,illuminate|quenched
  illuminate|to light up; to help to explain|照亮；阐明|Street lamps ___ the road at night, lighting it up so drivers can see.|The diary helps ___ the past, explaining what life was really like back then.|Fireworks ___ the night sky, filling it with bright light.|ignite,kindle|illuminated,illumination
  `,
  "context-clues",
  {
    intro: t(
      "We used dry leaves to **kindle** the fire, let the stew **simmer** above it, and drank cold water to **quench** our thirst while we waited. These ten words help you talk about fire, heat and the feelings that burn like them.",
      "我们用干树叶生火（**kindle**），把炖菜放在上面慢慢炖（**simmer**），等待时喝凉水解渴（**quench**）。这十个词帮你谈论火、热，以及像火一样燃烧的情感。",
    ),
    watchOut: {
      meanings: t(
        "To **smolder** is to burn *slowly with smoke*; to **simmer** is to stay *just below boiling*; to **seethe** is to *bubble* or boil with fury inside.",
        "**smolder** 是冒烟无焰地慢慢燃烧；**simmer** 是保持在将沸未沸；**seethe** 是翻腾，或内心怒火翻滚。",
      ),
      use: t(
        "You **scald** your skin with hot *liquid*; you **swelter** when the *air* is too hot; and heat can **parch** land or a throat until it is *dry*.",
        "被热的液体烫伤是 **scald**；空气太热、热得难受是 **swelter**；热能把土地或喉咙烤干是 **parch**。",
      ),
      spelling: t(
        "**Seethe** has a double *e* and ends in *-the*; **illuminate** has a double *l*; **smolder** has *-ol-*, not *-oul-*.",
        "**seethe** 双写 e、以 -the 结尾；**illuminate** 双写 l；**smolder** 中间是 -ol-，不是 -oul-。",
      ),
    },
    notes: `
      ignite|a spark setting gas suddenly on fire|a fiery speech setting a crowd's anger alight|dry grass catching fire from a match|ignite sets something on fire; quench puts it out|ignite 点燃；quench 熄灭|quench means to put out a fire or satisfy thirst, the opposite of setting something alight|quench 指熄灭或解渴，与点燃正相反|scald means to burn skin with hot liquid, not to set something on fire|scald 指被热液烫伤，不是点燃东西|ig · nite|the -ite ending, as in kite|结尾 -ite 同 kite
      kindle|twigs used to light a campfire|a book sparking a lasting love of history|a teacher lighting a spark of interest|kindle lights a fire or feeling; quench puts it out|kindle 点燃火焰或情感；quench 熄灭|quench means to put out a fire or satisfy a thirst, not to light or spark something|quench 指熄灭或解渴，不是点燃|parch means to dry something out with heat, not to light a fire or spark an interest|parch 指烤干，不是点燃火焰或激起兴趣|kin · dle|the -dle ending|结尾是 -dle
      smolder|ashes giving off smoke with no flame|anger hidden inside for years but never going out|a peat fire burning slowly underground for days|smolder burns slowly without flame; ignite bursts into fire|smolder 无焰慢燃；ignite 一下子燃起|scald means to burn skin with hot liquid, not to burn slowly with smoke|scald 指被热液烫伤，不是冒烟慢燃|ignite means to burst into fire suddenly, not to burn slowly with no flame|ignite 指突然燃起，不是无焰慢燃|smol · der|-ol- in the middle, not -oul-|中间是 -ol-，不是 -oul-
      scald|boiling water from a kettle burning a hand|steam from a pot leaving a painful burn|tea hot enough to burn a baby's mouth|scald burns with hot liquid; swelter is feeling too hot in the air|scald 被热液烫伤；swelter 是在热空气中难受|smolder means to burn slowly with smoke, not to burn skin with hot liquid|smolder 指冒烟慢燃，不是被热液烫伤|swelter means to suffer from hot air, not to be burned by boiling water|swelter 指热得难受，不是被开水烫伤|scald|sc followed by -ald|sc 后接 -ald
      simmer|soup cooking just below boiling over a low flame|tension quietly building in a town but not exploding|rice cooked gently just below the boil|simmer stays just below boiling; scald burns with boiling liquid|simmer 保持将沸未沸；scald 被沸水烫伤|parch means to dry out with heat, not to cook just below boiling|parch 指烤干，不是将沸未沸地煮|scald means to burn skin with hot liquid, not to cook gently below the boil|scald 指被热液烫伤，不是小火慢煮|sim · mer|the double m|双写 m
      seethe|a woman furious inside but saying nothing|a stormy sea foaming as if it were boiling|a man burning with anger he never let out|seethe boils with fury inside; quench satisfies or puts out|seethe 内心怒火翻腾；quench 平息或熄灭|parch means to dry out with heat, not to boil with anger|parch 指烤干，不是怒火中烧|quench means to satisfy or put out, the opposite of boiling with fury|quench 指平息或熄灭，与怒火翻腾正相反|seethe|the double e and the -the ending|双写 e，结尾是 -the
      swelter|sweating in a stuffy classroom in summer|workers dripping with sweat in a hot factory|tourists in crowds under the midday sun|swelter is suffering from hot air; parch is drying something out|swelter 是热得难受；parch 是烤干|scald means to burn skin with hot liquid, not to sweat in hot air|scald 指被热液烫伤，不是在热空气中流汗|parch means to dry out land or a throat, not to suffer and sweat in the heat|parch 指把土地或喉咙烤干，不是热得流汗难受|swel · ter|the double l|双写 l
      parch|a blazing sun drying fields until the soil cracks|drought leaving land dry and cracked|hot, dry air drying a throat|parch dries out; quench satisfies thirst|parch 烤干；quench 解渴|quench means to satisfy thirst, the opposite of making a throat dry|quench 指解渴，与使喉咙干燥正相反|swelter means to feel uncomfortably hot, not to dry land until it cracks|swelter 指热得难受，不是把土地烤裂|parch|the -ch ending, as in march|结尾 -ch 同 march
      quench|cold water after a long run|firefighters putting out flames all night|a thirst for knowledge nothing could satisfy|quench satisfies or puts out; kindle lights or sparks|quench 平息或熄灭；kindle 点燃或激起|kindle means to light a fire or spark a feeling, the opposite of putting it out|kindle 指点燃或激起，与熄灭正相反|illuminate means to light something up, not to satisfy thirst or put out a fire|illuminate 指照亮，不是解渴或灭火|quench|the qu at the start and the -ench ending|开头是 qu，结尾是 -ench
      illuminate|street lamps lighting a road for drivers|a diary explaining what life was like long ago|fireworks filling the sky with bright light|illuminate lights up; ignite sets on fire|illuminate 照亮；ignite 点燃|ignite means to set something on fire, not to light it up so it can be seen or understood|ignite 指点燃，不是照亮或阐明|kindle means to light a fire, not to fill a road or sky with light|kindle 指生火，不是让道路或天空充满光亮|il · lu · mi · nate|the double l and the -ate ending|双写 l，结尾是 -ate
    `,
  },
);

const crowds = batch(
  "words-of-crowds-and-gatherings",
  ["Words of Crowds and Gatherings", "人群与聚集的词"],
  ["coming together, mixing, scattering and plotting", "聚集、交往、散开与密谋"],
  `
  congregate|to gather into a crowd|聚集|Every evening, people ___ in the square, gathering in a big crowd to talk.|Birds ___ by the lake at dusk, flocking together by the hundreds.|Fans began to ___ outside the hotel, gathering in a crowd to see the star.|disperse,merge|congregated,congregation
  throng|a large, densely packed crowd; to fill a place|人群；挤满|Shoppers ___ the streets at Christmas, filling them with packed crowds.|Thousands of visitors ___ the old square every summer, crowding into it shoulder to shoulder.|Crowds began to ___ the stadium gates hours before the match, packing every inch.|merge,disperse|thronged
  mingle|to mix together; to move around and talk at a party|混合；交往|The host began to ___ with her guests, moving around the room and chatting with each one.|The smells of bread and coffee ___ in the air, mixing together.|Don't just stand in the corner; go and ___ with the other guests.|conspire,disperse|mingled
  merge|to combine into a single thing|合并|The two companies will ___ next year, combining into one single firm.|Traffic must ___ into one lane where the road narrows.|The two rivers ___ near the city and flow on as one wide river.|disperse,conspire|merged,merger
  converge|to come together from different directions|汇聚|The roads ___ at the bridge, coming in from three directions to meet there.|Fans began to ___ on the stadium from every part of the city.|Their views, once far apart, began to ___ until they almost agreed.|disperse,mingle|converged
  disperse|to scatter in different directions|驱散，散开|Police tried to ___ the crowd, sending people off in every direction.|The morning fog will ___ by noon, scattering and thinning until it is gone.|Seeds ___ in the wind, scattering far from the parent plant.|converge,congregate|dispersed
  ally|a person or country that cooperates with another; to join with|盟友；结盟|The two nations chose to ___ against the threat, joining forces openly in a treaty.|Small farmers decided to ___ with the city workers, joining them to demand fair prices.|Britain chose to ___ itself with France, promising openly to fight on the same side.|conspire,disperse|allied
  conspire|to make secret plans to do something wrong|密谋|They tried to ___ against the king, meeting in secret to plan his murder.|The three men ___ to rob the bank, secretly planning every step of the crime.|Rain, traffic and a flat tire seemed to ___ against us, as if secretly plotting to make us late.|ally,mingle|conspired,conspiracy,conspirator
  commotion|a state of confused and noisy disturbance|骚动|There was a loud ___ in the street, with people shouting and running about in confusion.|What's all the ___ about? Why is everyone shouting and pushing?|The dog's escape caused a noisy ___ in the hall as children screamed and chased it.|distraction,insurgency|
  uproar|a loud and impassioned noise or disturbance; public outrage|喧闹；公愤|The unfair decision caused a public ___, with angry people protesting in the streets.|When the result was read out, the hall broke into ___, a roar of angry shouting.|There was national ___ over the price rise, and furious letters poured into the papers.|distraction,armistice|
  `,
  "context-clues",
  {
    intro: t(
      "On festival night people **congregate** in the square, strangers **mingle** by the food stalls, and at midnight the crowds slowly **disperse** into the dark streets. These ten words help you talk about people coming together, mixing and scattering.",
      "节日之夜，人们聚集（**congregate**）在广场，陌生人在小吃摊旁交谈往来（**mingle**），到了午夜，人群慢慢散开（**disperse**），消失在幽暗的街巷。这十个词帮你谈论人们聚集、交往和散去。",
    ),
    watchOut: {
      meanings: t(
        "Things that **converge** come *toward one point* from different directions; things that **merge** *become one*; things that **disperse** *scatter apart*.",
        "**converge** 是从不同方向汇向一点；**merge** 是合而为一；**disperse** 是向四处散开。",
      ),
      use: t(
        "To **ally** is to join someone *openly* as a partner; to **conspire** is to plot something wrong *in secret*; and a **commotion** is noisy confusion, while an **uproar** is often loud public *anger*.",
        "**ally** 是公开结成伙伴；**conspire** 是暗中密谋坏事；**commotion** 是吵闹的混乱，**uproar** 则常是公众愤怒的喧哗。",
      ),
      spelling: t(
        "**Congregate** has *-greg-* in the middle; **commotion** has a double *m*; **disperse** ends in *-se*.",
        "**congregate** 中间是 -greg-；**commotion** 双写 m；**disperse** 以 -se 结尾。",
      ),
    },
    notes: `
      congregate|people gathering in a big crowd in a square each evening|birds flocking together by the hundreds at a lake|fans gathering outside a hotel to see a star|congregate gathers into a crowd; disperse scatters a crowd|congregate 聚成人群；disperse 驱散人群|disperse means to scatter in different directions, the opposite of gathering together|disperse 指向四处散开，与聚集正相反|merge means to combine into one single thing, not to gather into a crowd|merge 指合并成一个整体，不是聚成人群|con · gre · gate|the -greg- in the middle|中间是 -greg-
      throng|shoppers filling streets with packed crowds at Christmas|visitors crowding a square shoulder to shoulder|crowds packing every inch of a stadium's gates|throng fills a place with crowds; disperse empties it|throng 使某处挤满人；disperse 使人群散去|merge means to combine into one thing, not to fill a place with crowds|merge 指合而为一，不是挤满某处|disperse means to scatter, the opposite of packing a place with people|disperse 指散开，与挤满正相反|throng|the -ong ending, as in strong|结尾 -ong 同 strong
      mingle|a host moving around a room chatting with each guest|smells of bread and coffee mixing in the air|guests mixing and talking instead of standing alone|mingle mixes in and talks; conspire plots in secret|mingle 交往闲谈；conspire 暗中密谋|conspire means to plot something wrong in secret, not to mix and chat with guests|conspire 指暗中密谋坏事，不是与客人交谈|disperse means to scatter in different directions, not to mix together|disperse 指四散，不是混在一起|min · gle|the -gle ending|结尾是 -gle
      merge|two companies combining into one firm|traffic becoming a single lane|two rivers flowing on as one wide river|merge makes two into one; disperse spreads one into many|merge 合二为一；disperse 一分为多|disperse means to scatter in different directions, the opposite of combining into one|disperse 指向四处散开，与合而为一正相反|conspire means to plot something wrong in secret, not to combine into one thing|conspire 指暗中密谋，不是合并成一体|merge|the -erge ending|结尾是 -erge
      converge|roads from three directions meeting at a bridge|fans coming to a stadium from every part of a city|views once far apart moving toward agreement|converge comes together toward one point; disperse moves apart|converge 汇向一点；disperse 向四处散开|disperse means to scatter apart, the opposite of coming together from different directions|disperse 指四散，与从各方汇聚正相反|mingle means to mix and talk with people, not to move toward one point from different directions|mingle 指交往混合，不是从不同方向汇向一点|con · verge|con- followed by verge|con- 加 verge
      disperse|police sending a crowd off in every direction|morning fog scattering and thinning by noon|seeds scattering far from the parent plant|disperse scatters apart; converge comes together|disperse 四散；converge 汇聚|converge means to come together from different directions, the opposite of scattering|converge 指从各方汇聚，与散开正相反|congregate means to gather into a crowd, the opposite of scattering|congregate 指聚成人群，与散开正相反|dis · perse|the -se ending|结尾是 -se
      ally|two nations joining forces openly in a treaty|small farmers joining city workers to demand fair prices|Britain openly promising to fight on France's side|ally joins openly as a partner; conspire plots in secret|ally 公开结盟；conspire 暗中密谋|conspire means to plan something wrong in secret, not to join openly as partners|conspire 指暗中密谋坏事，不是公开结成伙伴|disperse means to scatter apart, the opposite of joining forces|disperse 指散开，与联合起来正相反|al · ly|the double l and the -y ending|双写 l，结尾是 -y
      conspire|men meeting in secret to plan a king's murder|three men secretly planning a bank robbery|rain, traffic and a flat tire seeming to plot against us|conspire plots in secret; ally joins openly|conspire 暗中密谋；ally 公开结盟|ally means to join openly with a partner, not to plot something wrong in secret|ally 指公开结盟，不是暗中密谋坏事|mingle means to mix and chat with people, not to plan a crime|mingle 指与人交往闲谈，不是策划犯罪|con · spire|con- followed by spire|con- 加 spire
      commotion|people shouting and running about in confusion|everyone shouting and pushing|children screaming and chasing an escaped dog|a commotion is noisy confusion; a distraction is anything that pulls attention away|commotion 是吵闹的混乱；distraction 是任何让人分心的事|distraction is something that takes attention away, not noisy confusion with shouting and running|distraction 是让人分心的事，不是叫喊奔跑的混乱场面|insurgency is an armed rebellion against a government, not a noisy fuss in a street or hall|insurgency 是反政府的武装叛乱，不是街头或大厅里的吵闹|com · mo · tion|the double m and the -tion ending|双写 m，结尾是 -tion
      uproar|angry people protesting an unfair decision|a hall breaking into angry shouting at a result|furious letters about a price rise|an uproar is loud public anger; a distraction just pulls attention away|uproar 是公众愤怒的喧哗；distraction 只是让人分心|distraction is something that pulls attention away, not loud public anger|distraction 是让人分心的事，不是公众的强烈愤怒|armistice is an agreement to stop fighting, not loud angry shouting|armistice 是停战协定，不是愤怒的喧哗|up · roar|up followed by roar|up 加 roar
    `,
  },
);

const blocking = batch(
  "words-of-blocking-and-breaking",
  ["Words of Blocking and Breaking", "阻挠与破坏的词"],
  ["getting in the way, damaging, cutting and knocking over", "妨碍、损坏、切断与推倒"],
  `
  hamper|to hinder or impede the movement or progress of|妨碍|Deep snow began to ___ the rescue, slowing the teams down without stopping them.|Injuries may ___ the team this season, making every match a little harder.|Lack of money will ___ the research, holding it back for months.|thwart,sever|hampered
  thwart|to prevent someone from accomplishing something|挫败|Police managed to ___ the robbery, stopping the gang before they took a thing.|A sudden storm may ___ our plan to climb the peak, ending it before we start.|Guards tried to ___ his escape and caught him at the gate.|hamper,foil|thwarted
  foil|to prevent something wrong from succeeding|挫败|A sharp-eyed guard was able to ___ the theft, catching the thief at the door.|The detective hoped to ___ the plot before the bomb went off.|Quick thinking let the cashier ___ the scam and keep the money safe.|hamper,impair|foiled
  obstruct|to block a path or progress|阻塞，妨碍|A fallen tree may ___ the road, blocking the way for every car.|Anyone who tries to ___ the police by standing in their path will be arrested.|That tall pillar will ___ your view of the stage, blocking half of it.|disrupt,impair|obstructed,obstruction
  impair|to weaken or damage|损害|Loud music can ___ your hearing, slowly weakening it for life.|Too little sleep will ___ your judgment, making your choices worse.|The injury may ___ his sight, leaving it weaker than before.|disrupt,obstruct|impaired,impairment
  disrupt|to interrupt by causing a disturbance|扰乱|Protesters tried to ___ the meeting, shouting until the speaker had to stop.|Strikes may ___ train services, causing delays and cancellations all week.|Please don't ___ the class by talking while others are working.|impair,stifle|disrupted,disruption,disruptive
  stifle|to restrain a reaction or stop something from developing|压制|She tried to ___ a yawn, pressing her lips together to hold it in.|Too many rules can ___ new ideas, smothering them before they grow.|He had to ___ a laugh, biting his lip so no one would hear.|obstruct,disrupt|stifled,stifling
  sever|to cut off; to put an end to a connection|切断|A sharp blade can ___ a finger, cutting it clean off.|The two nations chose to ___ all ties, cutting off every link between them.|The falling branch may ___ the power line, cutting it in two.|rupture,topple|severed
  rupture|to break or burst suddenly|破裂|Water pipes may ___ in the frost, bursting open as the ice expands.|Too much pressure can make a tire ___ with a loud bang.|The dam could ___ under the flood and burst, releasing a wall of water.|sever,topple|ruptured
  topple|to overbalance and fall; to remove from power|倒下；推翻|The old tower may ___ in a strong wind, falling over onto the street.|Rebels tried to ___ the government and seize power for themselves.|Don't stack the books so high, or the pile will ___ over.|rupture,disrupt|toppled
  `,
  "context-clues",
  {
    intro: t(
      "The storm did not just **hamper** the trains; it made a branch **sever** the power line and a pipe **rupture** under the station. These ten words help you describe what gets in the way of things and what breaks them.",
      "那场风暴不只是妨碍（**hamper**）了列车：一根树枝砸断（**sever**）了电线，车站下的一根水管也爆裂（**rupture**）了。这十个词帮你描述阻碍事情的东西和破坏事物的力量。",
    ),
    watchOut: {
      meanings: t(
        "To **hamper** is to *slow* something down; to **thwart** or **foil** is to *stop it completely*, and **foil** is used for stopping something *wrong*, like a theft or a plot.",
        "**hamper** 是使事情变慢；**thwart** 和 **foil** 是彻底阻止，而 **foil** 多用于阻止坏事，比如盗窃或阴谋。",
      ),
      use: t(
        "You **obstruct** a road or a view by *blocking* it; you **disrupt** a meeting by *interrupting* it; you **impair** hearing or judgment by *weakening* it.",
        "**obstruct** 是挡住道路或视线；**disrupt** 是打断会议之类的进程；**impair** 是削弱听力或判断力。",
      ),
      spelling: t(
        "**Disrupt** and **rupture** share the root *rupt* (break); **topple** has a double *p*; **thwart** begins with *th*.",
        "**disrupt** 和 **rupture** 共用词根 rupt（破裂）；**topple** 双写 p；**thwart** 以 th 开头。",
      ),
    },
    notes: `
      hamper|deep snow slowing rescue teams without stopping them|injuries making every match a little harder|lack of money holding research back for months|hamper slows something down; thwart stops it altogether|hamper 是拖慢；thwart 是彻底阻止|thwart means to stop something completely, but here it only slows down and goes on|thwart 指彻底阻止，而这里事情只是变慢、仍在继续|sever means to cut something off, not to slow progress|sever 指切断，不是拖慢进程|ham · per|ham followed by -per|ham 加 -per
      thwart|police stopping a gang before they took anything|a storm ending a climb before it starts|guards catching an escaping man at the gate|thwart stops a plan completely; hamper only slows it|thwart 彻底挫败；hamper 只是拖慢|hamper means only to slow something down, but here the plan is stopped completely|hamper 只指拖慢，而这里计划被彻底阻止|foil fits a wrongdoing, but here the word must also fit an honest plan to climb a peak|foil 用于阻止坏事，而这里还要用于爬山这一正当计划|th · wart|the th- at the start and the -wart ending|开头 th-，结尾 -wart
      foil|a guard catching a thief at the door|a detective stopping a bomb plot|a cashier stopping a scam and keeping money safe|foil stops a wrongdoing completely; hamper only slows things down|foil 彻底挫败坏事；hamper 只是拖慢|hamper means to slow something down, but here the wrongdoing is stopped completely|hamper 指拖慢，而这里坏事被彻底阻止|impair means to weaken something like hearing, not to stop a crime|impair 指削弱听力之类，不是阻止犯罪|foil|f, then -oil|f 加 -oil
      obstruct|a fallen tree blocking the way for every car|people standing in the police's path|a pillar blocking half the view of a stage|obstruct blocks a path or a view; disrupt interrupts an activity|obstruct 挡住道路或视线；disrupt 打断活动|disrupt means to interrupt an activity, not to stand in a path and block it|disrupt 指打断活动，不是挡在路上|impair means to weaken something, not to block a road or a view|impair 指削弱，不是挡住道路或视线|ob · struct|ob- followed by struct|ob- 加 struct
      impair|loud music slowly weakening hearing for life|too little sleep making choices worse|an injury leaving sight weaker than before|impair weakens an ability; disrupt interrupts an event|impair 削弱能力；disrupt 打断事件|disrupt means to interrupt an event, not to weaken hearing, judgment or sight|disrupt 指打断事件，不是削弱听力、判断或视力|obstruct means to block a path or view, not to weaken an ability|obstruct 指挡住路或视线，不是削弱能力|im · pair|im- followed by pair|im- 加 pair
      disrupt|protesters shouting until a speaker had to stop|strikes causing delays and cancellations|talking while others are working in class|disrupt interrupts an activity; impair weakens an ability|disrupt 打断活动；impair 削弱能力|impair means to weaken an ability, not to interrupt a meeting, a service or a class|impair 指削弱能力，不是打断会议、服务或课堂|stifle means to hold back a reaction or an idea, not to interrupt an event with noise|stifle 指压住反应或想法，不是用吵闹打断活动|dis · rupt|the root rupt, meaning break|词根 rupt 意为破裂
      stifle|pressing lips together to hold in a yawn|too many rules smothering new ideas|biting a lip so no one hears a laugh|stifle holds back a reaction; obstruct blocks a path|stifle 压住反应；obstruct 挡住道路|obstruct means to block a road or view, not to hold back a yawn, an idea or a laugh|obstruct 指挡住路或视线，不是压住哈欠、想法或笑声|disrupt means to interrupt an event, not to hold back your own reaction|disrupt 指打断事件，不是压住自己的反应|sti · fle|the -fle ending|结尾是 -fle
      sever|a blade cutting a finger clean off|two nations cutting off every link|a branch cutting a power line in two|sever cuts something off; rupture bursts it open|sever 切断；rupture 胀破|rupture means to burst open under pressure, not to cut cleanly off|rupture 指受压爆裂，不是干净地切断|topple means to fall over, not to cut something off|topple 指倒下，不是切断|se · ver|s-e-v-e-r, with no double letter|没有双写字母
      rupture|pipes bursting as ice expands|a tire bursting with a loud bang under pressure|a dam bursting under a flood|rupture bursts open under pressure; sever cuts cleanly through|rupture 受压爆裂；sever 干净地切断|sever means to cut something off with a blade or a blow, not to burst open from pressure|sever 指用刀或撞击切断，不是因压力爆裂|topple means to fall over, not to burst open|topple 指倒下，不是爆开|rup · ture|the root rupt plus -ure|词根 rupt 加 -ure
      topple|an old tower falling over onto a street|rebels seizing power from a government|a high pile of books falling over|topple falls over or brings down; rupture bursts open|topple 倒下或推翻；rupture 爆裂|rupture means to burst open, not to fall over or lose power|rupture 指爆开，不是倒下或失去权力|disrupt means to interrupt an event, not to fall over or bring a government down|disrupt 指打断事件，不是倒下或推翻政府|top · ple|the double p and the -le ending|双写 p，结尾是 -le
    `,
  },
);

const urging = batch(
  "words-of-coaxing-and-urging",
  ["Words of Coaxing and Urging", "劝诱与催促的词"],
  ["persuading gently, tempting, begging, stirring up and forcing", "温和劝说、引诱、恳求、激起与强迫"],
  `
  coax|to gently persuade someone to do something|哄劝|She had to ___ the frightened cat out of the tree, talking softly and patiently for an hour.|He tried to ___ a smile from his shy sister with gentle jokes and kind words.|With soft words and a little patience, we managed to ___ the nervous child into the water.|compel,incite|coaxed
  entice|to attract or tempt by offering pleasure|诱惑|The promise of free pizza will ___ students to the meeting, tempting them with a treat.|Shops ___ buyers with big sales, tempting them with bargains they can't resist.|The smell of fresh bread can ___ people into the bakery, tempting them inside with pleasure.|compel,implore|enticed,enticing
  lure|to tempt a person or animal to do something|引诱|Bright lights ___ moths at night, drawing them in with their glow.|Scammers ___ victims with promises of easy money, drawing them into a trap.|The hunters tried to ___ the wolf into the trap with a piece of fresh meat.|compel,implore|lured
  implore|to beg someone earnestly or desperately|恳求|On my knees, I ___ you to stay; please don't leave me.|With tears in her eyes, she began to ___ them to help her son.|The prisoners ___ the judge to show mercy, begging him desperately.|coax,incite|implored
  incite|to encourage violent or unlawful behavior; to stir up|煽动|He was jailed for trying to ___ a riot with an angry speech.|Leaders who ___ hatred against their neighbors stir people up to violence.|The speaker's furious words may ___ the crowd to attack the police.|coax,arouse|incited,incitement
  compel|to force someone to do something|强迫|The new law will ___ firms to pay a fair wage, giving them no choice.|Nobody can ___ you to speak; you have the right to stay silent.|Illness may ___ him to retire, forcing him to leave the job he loves.|coax,entice|compelled,compelling
  prod|to poke someone to make them act; to urge someone to act|戳；督促|Parents often ___ their children to study, reminding them again and again.|Without his manager there to ___ him, he never finished anything on time.|The farmer used a stick to ___ the slow cow toward the barn.|implore,lure|prodded
  rouse|to wake from sleep; to stir up feelings|唤醒；激起|Try to ___ him from his sleep; it's late and the bus is leaving.|The general's speech will ___ the troops, filling the tired soldiers with fresh courage.|The alarm failed to ___ her, and she slept until noon.|implore,lure|roused,rousing
  arouse|to evoke a feeling or response|引起|The strange noise may ___ suspicion in the guards, making them wonder what is wrong.|Its odd title will ___ your curiosity, making you want to read the story.|His cruel words were sure to ___ anger in everyone who heard them.|rouse,compel|aroused
  oblige|to make someone legally or morally bound to do something|迫使|In some countries, the law will ___ you to vote, and you can be fined for not voting.|School rules ___ us to wear uniforms, and no one is allowed to skip them.|A signed contract will ___ the builder to finish the house by June.|entice,lure|obliged,obligatory
  `,
  "context-clues",
  {
    intro: t(
      "First we tried to **coax** the old dog into the car with soft words, then to **lure** him with a sausage, and in the end the vet had to **prod** him gently from behind. These ten words help you describe the many ways of getting someone to act.",
      "我们先用温柔的话哄（**coax**）老狗上车，又用香肠引诱（**lure**）它，最后兽医只好从后面轻轻戳（**prod**）它一下。这十个词帮你描述让人行动的各种方式。",
    ),
    watchOut: {
      meanings: t(
        "To **coax** is to persuade *gently*; to **compel** or **oblige** is to *force*, by power or by a rule; to **implore** is to *beg*; to **incite** is to stir people up to *violence* or wrongdoing.",
        "**coax** 是温和地劝；**compel** 和 **oblige** 是凭力量或规定强迫；**implore** 是恳求；**incite** 是煽动人去施暴或做坏事。",
      ),
      use: t(
        "You **rouse** a *person* from sleep or to action, but you **arouse** a *feeling* such as suspicion, curiosity or anger.",
        "**rouse** 的对象常是人（把人叫醒或激励起来），**arouse** 的对象是感情，如怀疑、好奇或愤怒。",
      ),
      spelling: t(
        "**Compel** doubles the *l* in *compelled*; **entice** ends in *-ice*; **implore** ends in a silent *e*.",
        "**compel** 变成 compelled 时双写 l；**entice** 以 -ice 结尾；**implore** 结尾的 e 不发音。",
      ),
    },
    notes: `
      coax|softly and patiently talking a frightened cat down|gentle jokes and kind words for a shy sister|soft words and patience with a nervous child|coax persuades gently; compel forces|coax 温和劝说；compel 强迫|compel means to force someone, but here only soft, patient words are used|compel 指强迫，而这里只用了温柔耐心的话|incite means to stir people up to violence, not to persuade gently and kindly|incite 指煽动暴力，不是温柔地劝说|coax|the -oax ending|结尾是 -oax
      entice|free pizza tempting students to a meeting|bargains tempting buyers into shops|the smell of bread tempting people inside|entice tempts with something pleasant; compel forces|entice 用好处引诱；compel 强迫|compel means to force, but here people are tempted with a treat, not forced|compel 指强迫，而这里是用好处引诱，不是强迫|implore means to beg desperately, not to tempt with pleasure|implore 指苦苦恳求，不是用乐事引诱|en · tice|the -ice ending|结尾是 -ice
      lure|bright lights drawing moths in|promises of easy money drawing victims into a trap|fresh meat drawing a wolf into a trap|lure draws someone in with bait; compel forces them|lure 用诱饵引来；compel 强迫|compel means to force, but here something is drawn in by an attraction|compel 指强迫，而这里是被诱饵吸引过来|implore means to beg someone, and moths, victims and wolves are drawn by bait, not begged|implore 指恳求，而这里是用诱饵吸引，不是恳求|lure|l, then -ure|l 加 -ure
      implore|begging someone on your knees not to leave|a mother in tears asking help for her son|prisoners begging a judge for mercy|implore begs desperately; coax persuades gently|implore 苦苦恳求；coax 温和劝说|coax means to persuade gently and patiently, not to beg desperately on your knees|coax 指温和耐心地劝，不是跪地苦求|incite means to stir up violence, not to beg for help or mercy|incite 指煽动暴力，不是乞求帮助或宽恕|im · plore|im- followed by -plore, with a silent e|im- 加 -plore，结尾 e 不发音
      incite|an angry speech starting a riot|leaders stirring people up to hatred and violence|furious words sending a crowd to attack police|incite stirs people up to wrongdoing; arouse just stirs a feeling|incite 煽动人去做坏事；arouse 只是引起感情|coax means to persuade gently, not to stir people up to violence|coax 指温和劝说，不是煽动暴力|arouse means to stir a feeling, not to push people into a riot or an attack|arouse 指引起感情，不是唆使人暴动或攻击|in · cite|in- followed by cite|in- 加 cite
      compel|a law giving firms no choice about pay|the right to stay silent when forced to speak|illness forcing a man to leave his job|compel forces; coax persuades gently|compel 强迫；coax 温和劝说|coax means to persuade gently, but here there is no choice at all|coax 指温和劝说，而这里根本没有选择|entice means to tempt with something pleasant, not to force|entice 指以好处引诱，不是强迫|com · pel|one l in compel, two in compelled|compel 一个 l，compelled 两个
      prod|parents reminding children again and again to study|a manager pushing someone to finish on time|a stick poking a slow cow toward a barn|prod pokes or nags someone into acting; implore begs them|prod 戳一下或催促；implore 苦苦恳求|implore means to beg desperately, not to keep reminding or poke with a stick|implore 指苦苦恳求，不是一再提醒或用棍子戳|lure means to tempt with bait, not to push or poke someone into action|lure 指用诱饵引诱，不是推着、戳着让人行动|prod|p-r-o-d, doubled d in prodded|prodded 双写 d
      rouse|waking a sleeper because the bus is leaving|a speech filling tired soldiers with courage|an alarm failing to wake a late sleeper|rouse wakes or stirs a person; implore begs them|rouse 唤醒或激励人；implore 恳求人|implore means to beg someone desperately, not to wake them or fill them with courage|implore 指苦苦恳求，不是叫醒人或给人鼓劲|lure means to tempt with bait, not to wake someone or fill them with courage|lure 指用诱饵引诱，不是叫醒人或给人鼓劲|rouse|r-o-u-s-e, with no a at the front|开头没有 a
      arouse|a strange noise making guards suspicious|an odd title stirring curiosity|cruel words stirring anger in everyone|arouse stirs a feeling; rouse wakes or stirs a person|arouse 引起感情；rouse 唤醒或激励人|rouse takes a person as its object, but here the object is a feeling|rouse 的对象是人，而这里的对象是感情|compel means to force someone to act, not to stir a feeling|compel 指强迫人行动，不是引起感情|a · rouse|a- followed by rouse|a- 加 rouse
      oblige|a law fining people who don't vote|school rules no one may skip|a signed contract binding a builder to a date|oblige binds someone by a rule or duty; entice tempts them|oblige 以规定或义务约束；entice 以好处引诱|entice means to tempt with something pleasant, not to bind by law, rules or contract|entice 指以好处引诱，不是用法律、规定或合同约束|lure means to tempt with bait, not to bind by a rule|lure 指用诱饵引诱，不是用规定约束|ob · lige|the -lige ending, sounding like -lyje|结尾 -lige
    `,
  },
);

const flinching = batch(
  "words-of-flinching-and-fretting",
  ["Words of Flinching and Fretting", "退缩与焦虑的词"],
  ["dodging, pulling back, making faces and worrying", "躲避、退缩、做鬼脸与担忧"],
  `
  elude|to escape from cleverly; to fail to be understood|躲避；难倒|The clever thief managed to ___ the police, slipping away down a dark alley.|No matter how tired she was, sleep began to ___ her, staying just out of reach all night.|The answer to the riddle may ___ you at first, slipping out of your grasp.|linger,recoil|eluded
  evade|to escape or avoid, especially by guile|逃避|The minister tried to ___ the question by changing the subject.|She was caught trying to ___ paying tax by hiding her income.|Some people try to ___ responsibility by blaming everyone else.|elude,linger|evaded,evasion,evasive
  recoil|to suddenly spring back in fear or disgust|退缩|She jumped back to ___ at the sight of the snake, springing away in horror.|The gun will ___ when fired, kicking back hard against your shoulder.|Most people ___ from cruelty, pulling back from it in disgust.|linger,fret|recoiled
  cringe|to bend one's head and body in fear; to feel embarrassment|畏缩；尴尬|I ___ with embarrassment, shrinking into my seat, whenever I hear my old songs.|The dog began to ___ at the shout, lowering its head and shrinking back in fear.|Teenagers often ___ at their parents' jokes, squirming with embarrassment.|brood,linger|cringed,cringing
  wince|to make a slight involuntary grimace from pain or distress|皱眉蹙额|She tried not to ___ when the nurse gave the shot, but her face tightened with pain.|He would ___ as the cold water touched his sore tooth.|I still ___ at the memory, my face twitching with shame.|brood,linger|winced
  grimace|an ugly, twisted expression of disgust or pain|鬼脸，痛苦的表情|His face twisted into an ugly ___ of disgust as he tasted the bitter medicine.|Her mouth pulled into a ___ of pain, her lips twisted and her eyes squeezed shut.|With a twisted ___ of effort on his face, he lifted the heavy box.|gasp,glance|grimaces
  startle|to cause to feel sudden shock or alarm|惊吓|Don't ___ the baby with a sudden loud noise.|The thunder will ___ the horses, making them jump in alarm.|Loud bangs ___ me, making my heart jump with shock.|recoil,fret|startling
  fret|to be constantly or visibly anxious|烦躁，发愁|Don't ___ about the test; worrying won't help, and you'll be fine.|She tends to ___ about money, anxious every time a bill arrives.|Parents ___ over exams, nervously pacing while they wait for the results.|startle,elude|fretted,fretful
  brood|to think deeply about something that makes one unhappy|沉思，忧思|He tends to ___ over his mistakes, thinking about them unhappily for days.|Don't sit alone and ___ about the loss; go out and see your friends.|She would ___ on the insult for weeks, going over it gloomily in her mind.|elude,startle|brooded,brooding
  linger|to stay in a place longer than necessary; to be slow to disappear|逗留；挥之不去|Don't ___ in the playground after school; come straight home instead of staying.|The smell of smoke may ___ in the house for days before it fades.|Her words continued to ___ in my mind long after she left.|elude,brood|lingered,lingering
  `,
  "context-clues",
  {
    intro: t(
      "At the dentist I **fret** in the waiting room, **wince** when the drill starts, and afterward the taste of the medicine makes me pull a **grimace**. These ten words help you describe how people dodge, pull back, make faces and worry.",
      "在牙医那里，我在候诊室里发愁（**fret**），钻头一响就皱眉（**wince**），之后药的味道又让我做了个苦脸（**grimace**）。这十个词帮你描述人们怎样躲避、退缩、做出表情和担忧。",
    ),
    watchOut: {
      meanings: t(
        "To **elude** is to *slip away* cleverly, often by luck or skill; to **evade** is to *dodge on purpose* something you should face, such as a question, a tax or a duty.",
        "**elude** 是巧妙地溜走，常靠运气或身手；**evade** 是故意躲开本该面对的事，如问题、税款或责任。",
      ),
      use: t(
        "To **wince** is a quick flinch of the face from pain, a **grimace** is the twisted *expression* itself, and to **cringe** is to shrink back in fear or *embarrassment*.",
        "**wince** 是因疼痛脸部一抽；**grimace** 是那副扭曲的表情本身；**cringe** 是因害怕或难堪而缩起身子。",
      ),
      spelling: t(
        "**Linger** has *-ger*, not *-gar*; **recoil** has *-oil*; **grimace** ends in *-ace*.",
        "**linger** 结尾是 -ger，不是 -gar；**recoil** 有 -oil；**grimace** 以 -ace 结尾。",
      ),
    },
    notes: `
      elude|a thief slipping away down a dark alley|sleep staying out of reach all night|an answer slipping out of your grasp|elude slips away from you; evade dodges something on purpose|elude 从你手中溜走；evade 故意躲开|linger means to stay longer, the opposite of slipping away|linger 指逗留，与溜走正相反|recoil means to spring back in fear, not to slip cleverly away|recoil 指因害怕往后缩，不是巧妙地溜走|e · lude|e- followed by -lude|e- 加 -lude
      evade|a minister changing the subject to dodge a question|hiding income to dodge paying tax|blaming everyone else to dodge responsibility|evade dodges on purpose; elude slips away by luck or skill|evade 故意逃避；elude 靠运气或身手溜走|elude does not take a question, a tax or a duty that a person deliberately dodges|elude 不用于故意躲避问题、税款或责任|linger means to stay longer, not to dodge something|linger 指逗留，不是躲避|e · vade|e- followed by -vade|e- 加 -vade
      recoil|springing back in horror from a snake|a gun kicking back against a shoulder|pulling back from cruelty in disgust|recoil springs backward; linger stays put|recoil 往后弹缩；linger 留在原处|linger means to stay longer, not to spring back|linger 指逗留，不是往后缩|fret means to worry, not to spring or kick back|fret 指担忧，不是向后弹|re · coil|re- followed by coil|re- 加 coil
      cringe|shrinking into a seat at old songs|a dog lowering its head and shrinking in fear|teenagers squirming at their parents' jokes|cringe shrinks back in fear or embarrassment; brood thinks unhappily for a long time|cringe 因害怕或难堪而缩起；brood 长久闷闷地想|brood means to think unhappily for a long time, not to shrink back at a moment|brood 指长久闷想，不是当场缩起身子|linger means to stay longer, not to shrink back in embarrassment|linger 指逗留，不是因难堪缩起|cringe|the -inge ending, as in hinge|结尾 -inge，同 hinge
      wince|a face tightening with pain at a shot|cold water touching a sore tooth|a face twitching with shame at a memory|wince flinches for a moment; brood dwells on something for a long time|wince 一瞬的抽搐；brood 长久纠结|brood means to dwell unhappily for a long time, not to flinch for a moment|brood 指长久闷想，不是一瞬的抽搐|linger means to stay longer, not to flinch with pain|linger 指逗留，不是因疼痛一抽|wince|the -ince ending, as in prince|结尾 -ince，同 prince
      grimace|a face twisted into disgust at bitter medicine|lips twisted and eyes squeezed shut in pain|a twisted face lifting a heavy box|a grimace is a twisted expression; a gasp is a sudden breath|grimace 是扭曲的表情；gasp 是猛吸一口气|gasp is a sudden breath, not a twisted look on the face|gasp 是猛吸气，不是脸上扭曲的表情|glance is a quick look with the eyes, not a twisted face|glance 是匆匆一瞥，不是扭曲的脸|gri · mace|the -ace ending|结尾是 -ace
      startle|a sudden loud noise and a baby|thunder making horses jump in alarm|loud bangs making a heart jump|startle gives someone a sudden shock; recoil is your own pulling back|startle 让别人吓一跳；recoil 是自己往后缩|recoil is what you do yourself, and it cannot take the baby, the horses or me as its object|recoil 是自己的动作，不能带婴儿、马或我作宾语|fret means to worry, and it does not give anyone a sudden shock|fret 指担忧，不会让人突然受惊|star · tle|star followed by -tle|star 加 -tle
      fret|worrying about a test|anxiety every time a bill arrives|parents nervously pacing as they wait for results|fret worries; startle gives a sudden shock|fret 担忧；startle 使受惊|startle means to give someone a sudden shock, not to worry about a test, money or results|startle 指使人突然受惊，不是为考试、钱或成绩担忧|elude means to slip away, not to worry|elude 指溜走，不是担忧|fret|f-r-e-t, doubled t in fretted|fretted 双写 t
      brood|thinking unhappily about mistakes for days|sitting alone thinking about a loss|going over an insult gloomily for weeks|brood dwells on unhappy thoughts; elude slips away|brood 闷闷地想；elude 溜走|elude means to slip away, not to think unhappily about something|elude 指溜走，不是闷闷不乐地想|startle means to give a sudden shock, not to dwell on unhappy thoughts|startle 指使人受惊，不是闷想|brood|the double o, as in mood|双写 o，同 mood
      linger|staying in a playground instead of going home|smoke staying in a house for days|words staying in the mind long after|linger stays longer; elude slips away|linger 逗留不去；elude 溜走|elude means to slip away, the opposite of staying on|elude 指溜走，与逗留正相反|brood means a person thinking unhappily, but here smoke and words stay on|brood 指人闷想，而这里是烟味和话语留着不散|lin · ger|the -ger ending, not -gar|结尾是 -ger，不是 -gar
    `,
  },
);

const loathing = batch(
  "words-of-loathing-and-bullying",
  ["Words of Loathing and Bullying", "憎恶与欺凌的词"],
  ["hating, shocking, annoying, shaming and frightening", "憎恨、震惊、恼怒、羞辱与恐吓"],
  `
  despise|to feel contempt or a deep repugnance for|鄙视|The old soldiers ___ cowards, looking down on them with contempt.|She came to ___ her old job, looking down on it as worthless.|Don't ___ people for being poor; looking down on others is cruel.|harass,appall|despised
  detest|to dislike intensely|厌恶|I ___ cold weather and hate every winter day.|Most cats ___ water and hate getting wet.|She seemed to ___ her cousin, disliking him intensely from the start.|harass,intimidate|detested
  loathe|to feel intense dislike or disgust for|极讨厌|I ___ washing dishes; I hate it more than any other job.|The two rivals ___ each other, filled with hatred.|He came to ___ the very sight of her, feeling sick with dislike.|harass,appall|loathed,loathing,loathsome
  resent|to feel bitterness at having been treated unfairly|怨恨|She would ___ being called a child, feeling bitter at the unfairness.|Many workers ___ the new tax, bitter that it hits them hardest.|Don't ___ your brother's success; feeling bitter will only hurt you.|appall,harass|resented
  appall|to greatly dismay or horrify|使震惊|The news of the massacre will ___ you, filling you with horror.|Such cruelty must ___ anyone who sees it, horrifying them.|The waste of food seemed to ___ her, and she stared at the bins in shock.|resent,humiliate|appalled,appalling
  irk|to irritate; to annoy|使厌烦|His laziness began to ___ her, annoying her a little more each day.|Small noises ___ me, mildly annoying me while I work.|It may ___ you to wait in line, but the annoyance soon passes.|harass,humiliate|irked,irksome
  harass|to subject to aggressive pressure or intimidation|骚扰|Reporters began to ___ the family, following them and calling day and night.|It is illegal to ___ workers with threats and constant pressure.|Don't ___ the animals by chasing and poking them.|detest,loathe|harassed,harassment
  humiliate|to make someone feel ashamed and foolish|羞辱|The coach tried not to ___ the player in front of the crowd, making him feel ashamed.|They wanted to ___ him in public, making him look foolish.|Don't ___ your sister by laughing at her in front of everyone.|alienate,appall|humiliated,humiliating,humiliation
  intimidate|to frighten someone, especially to make them do what one wants|恐吓|Gangs try to ___ witnesses with threats so they will not speak.|Don't let the size of the task ___ you; it only looks frightening.|He used his size to ___ smaller boys, frightening them into handing over money.|detest,alienate|intimidated,intimidating,intimidation
  alienate|to cause someone to feel isolated or hostile|疏远|Rudeness may ___ customers, driving them away to other shops.|The new policy will ___ young voters, making them feel shut out.|He tried not to ___ his friends by ignoring them and pushing them away.|humiliate,intimidate|
  `,
  "context-clues",
  {
    intro: t(
      "The new boss seemed to **despise** his staff: he would **humiliate** them in meetings and **intimidate** anyone who disagreed, and soon even small habits of his began to **irk** everyone. These ten words help you describe strong dislike and the ways people hurt others.",
      "新老板似乎鄙视（**despise**）手下：开会时羞辱（**humiliate**）他们，恐吓（**intimidate**）任何持不同意见的人；没多久，他的一些小习惯也开始让每个人厌烦（**irk**）。这十个词帮你描述强烈的厌恶和伤人的种种方式。",
    ),
    watchOut: {
      meanings: t(
        "To **despise** is to *look down on*; to **detest** or **loathe** is to *hate*; to **resent** is to feel *bitter* at unfair treatment; to **irk** is only to *annoy* a little.",
        "**despise** 是看不起；**detest** 和 **loathe** 是憎恨；**resent** 是因受不公对待而怨恨；**irk** 只是有点烦人。",
      ),
      use: t(
        "With **appall** and **irk**, the *thing* that shocks or annoys comes first and the *person* follows (*the news appalled her*), while with **loathe** and **resent** the person comes first (*she loathed the news*).",
        "**appall** 和 **irk** 是令人震惊或烦恼的事物作主语、人作宾语（the news appalled her）；**loathe** 和 **resent** 则是人作主语（she loathed the news）。",
      ),
      spelling: t(
        "**Harass** has one *r* and a double *s*; **appall** has a double *p* and a double *l*; **loathe** with an *e* is the verb, **loath** without it means unwilling.",
        "**harass** 一个 r、两个 s；**appall** 双写 p 和 l；带 e 的 **loathe** 是动词，不带 e 的 loath 意为不情愿。",
      ),
    },
    notes: `
      despise|old soldiers looking down on cowards with contempt|looking down on an old job as worthless|looking down on people for being poor|despise looks down on; detest simply hates|despise 看不起；detest 单纯憎恨|harass means to pressure someone aggressively, not to look down on them in your mind|harass 指咄咄逼人地骚扰，不是心里看不起|appall means to horrify someone, and a job or cowards cannot be horrified by these people's contempt|appall 指使人震惊，与这里心里的轻蔑无关|de · spise|de- followed by -spise|de- 加 -spise
      detest|hating every winter day|cats hating getting wet|intensely disliking a cousin from the start|detest is a feeling of hate; harass is an action against someone|detest 是憎恨的感情；harass 是针对人的行为|harass means to pressure someone, and no one can harass cold weather or water|harass 指骚扰人，没有人能骚扰天气或水|intimidate means to frighten someone, not to hate something|intimidate 指恐吓，不是憎恨|de · test|de- followed by test|de- 加 test
      loathe|hating washing dishes more than any other job|rivals filled with hatred for each other|feeling sick with dislike at the sight of someone|loathe hates intensely; appall horrifies someone else|loathe 是自己极度憎恨；appall 是使别人震惊|harass means to pressure someone aggressively, not to hate a chore or a sight|harass 指骚扰，不是憎恨家务或某个样子|appall means to horrify, but here the people themselves feel hatred|appall 指使人震惊，而这里是人自己心怀憎恨|loa · the|the e at the end; loath without it means unwilling|结尾有 e；没有 e 的 loath 意为不情愿
      resent|feeling bitter at being called a child|workers bitter about a tax that hits them hardest|bitterness at a brother's success|resent feels bitter at unfairness; appall horrifies|resent 因不公而怨恨；appall 使人震惊|appall means to horrify someone, not to feel bitter at unfair treatment|appall 指使人震惊，不是因受不公而怨恨|harass means to pressure someone aggressively, not to feel bitter inside|harass 指骚扰，不是心中怨恨|re · sent|re- followed by sent|re- 加 sent
      appall|news of a massacre filling you with horror|cruelty horrifying anyone who sees it|staring at bins full of wasted food in shock|appall horrifies; humiliate shames|appall 使震惊；humiliate 使羞辱|resent means to feel bitter yourself, and its subject is a person, not news, cruelty or waste|resent 是人自己怨恨，主语是人，不是消息、残忍或浪费|humiliate means to make someone feel ashamed, not horrified|humiliate 指使人羞愧，不是使人惊骇|ap · pall|the double p and the double l|双写 p 和 l
      irk|laziness annoying someone more each day|small noises mildly annoying a worker|annoyance at waiting in line that soon passes|irk annoys mildly; harass attacks with pressure|irk 轻微烦扰；harass 施压骚扰|harass means to pressure someone aggressively, not to mildly annoy them through laziness or noise|harass 指施压骚扰，不是懒惰或噪音带来的轻微烦扰|humiliate means to make someone feel ashamed, not mildly annoyed|humiliate 指使人羞愧，不是轻微烦恼|irk|the -rk ending, as in work|结尾 -rk，同 work
      harass|reporters following and calling a family day and night|threats and constant pressure on workers|chasing and poking animals|harass is an action of aggressive pressure; detest is a feeling|harass 是施压骚扰的行为；detest 是感情|detest is a feeling of hate, not following, threatening or chasing someone|detest 是憎恨之情，不是跟踪、威胁或追赶|loathe is a feeling of hate, not an action of pressure|loathe 是憎恨之情，不是施压的行为|ha · rass|one r and a double s|一个 r、两个 s
      humiliate|a coach making a player feel ashamed in front of a crowd|making someone look foolish in public|laughing at a sister in front of everyone|humiliate shames someone; alienate pushes them away|humiliate 使人蒙羞；alienate 使人疏远|alienate means to push someone away, not to make them look foolish in public|alienate 指使人疏远，不是当众出丑|appall means to horrify, not to make someone feel ashamed|appall 指使人震惊，不是使人羞愧|hu · mil · i · ate|the -mil- and the -iate ending|中间 -mil-，结尾 -iate
      intimidate|gangs threatening witnesses into silence|a task that only looks frightening|using size to frighten boys into handing over money|intimidate frightens someone into obeying; alienate pushes them away|intimidate 吓唬人就范；alienate 使人疏远|detest is a feeling of hate, not threatening or frightening someone|detest 是憎恨之情，不是威胁或吓唬人|alienate means to push someone away, not to frighten them into obeying|alienate 指使人疏远，不是吓唬人服从|in · tim · i · date|the -tim- in the middle|中间是 -tim-
      alienate|rudeness driving customers away to other shops|a policy making young voters feel shut out|ignoring friends and pushing them away|alienate pushes someone away; humiliate shames them|alienate 使人疏远；humiliate 使人蒙羞|humiliate means to make someone feel ashamed, not to drive them away or shut them out|humiliate 指使人羞愧，不是把人赶走或拒之门外|intimidate means to frighten someone, not to push them away|intimidate 指恐吓，不是使人疏远|a · li · en · ate|alien followed by -ate|alien 加 -ate
    `,
  },
);

/** batchesC are the batches of puzzling, rough handling, heat, crowds, blocking, urging, flinching and loathing. */
export const batchesC: readonly BatchSpec[] = [puzzling, handling, heat, crowds, blocking, urging, flinching, loathing];
