// Grade 3: the words of the last five themes, ten to a batch: a river kingdom and ancient life, time long ago,
// ancient China and its walls, thinking, forces, magnets and explaining how, music, its instruments and performing,
// and poetry, the seasons and the words for sounds and light.

import { t } from "@ga/content";
import type { Grade3Batch } from "./batches.ts";

const riverKingdom: Grade3Batch = {
  id: "words-of-a-river-kingdom",
  title: t("Words of a River Kingdom", "河流王国的词汇"),
  summary: t(
    "Ten words of life along the Nile: silt, delta, cataract, barge, granary, reed, sickle, chariot and more.",
    "十个尼罗河沿岸生活的词：silt、delta、cataract、barge、granary、reed、sickle、chariot 等。",
  ),
  intro: t(
    "After the Nile flood pulls back, dark, rich **silt** blankets the riverbank—perfect soil for planting wheat. Reading about ancient river kingdoms starts with knowing what each boat, tool, and landform is called.",
    "尼罗河的洪水退去后，河岸上留下一层黑黝黝、肥沃的淤泥（**silt**），正好用来种麦子。读古代大河文明的故事，得先认清这些船只、农具和河道地貌的叫法。",
  ),
  watchOut: {
    meanings: t(
      "Tell **delta** (flat fan-shaped land where a river splits near the sea) apart from **cataract** (fast, rocky rapids that block boats).",
      "分清 **delta**（入海口平坦分叉的三角洲）和 **cataract**（挡住行船的急流险滩）。",
    ),
    use: t(
      "A **barge** floats heavy cargo on water, while a **chariot** rolls behind horses on land—check whether the scene is on a river or a road.",
      "**barge** 是在河上运重货的驳船，**chariot** 是马拉的战车——看场景在水里还是陆地上。",
    ),
    spelling: t(
      "Watch **sphinx** (*ph* says /f/ + *x*), **chariot** (*ch* + *-iot*), and **sickle** (*ck* + *-le*).",
      "注意 **sphinx** 里的 **ph** 与 **x**、**chariot** 的 **-iot**，以及 **sickle** 的 **ck** 和 **-le**。",
    ),
  },
  domain: ["life along a great river long ago", "古代大河沿岸的生活"],
  lines: `
    silt|-|fine, rich mud carried and left behind by a river|淤泥，河水带来并留下的肥沃细泥|When the flood went down, a layer of black ___ covered the fields.|Farmers planted their seeds in the soft ___ left by the river.|The river water was brown because it carried so much ___.|delta,reed
    delta|deltas|flat land where a river splits into many streams before it reaches the sea|三角洲|The Nile splits into many small streams in its ___ near the sea.|Birds nest in the wet, green ___ where the river meets the sea.|Seen from above, the river's ___ looks like a fan.|cataract,silt
    cataract|cataracts|a place where a river rushes over rocks in fast, rough water|（河流的）大瀑布，急流险滩|Boats could not sail past the ___, where the water crashed over rocks.|The sailors carried their boat around the dangerous ___.|We heard the roar of the ___ before we saw the white water.|delta,silt
    barge|barges|a long, flat boat for carrying heavy loads on a river|驳船|A ___ carried huge blocks of stone down the river.|The workers loaded sacks of grain onto the ___.|The flat ___ floated slowly with the current.|chariot,granary
    granary|granaries|a building where grain is stored|粮仓|After the harvest, the wheat was stored in the ___.|The king's ___ held enough grain to feed the city for a year.|Mice tried to sneak into the ___ to eat the grain.|barge,sphinx
    reed|reeds|a tall, thin grass that grows in water|芦苇|The ___ by the river grew taller than a man.|Egyptians wove baskets and mats from the river ___.|A duck hid behind a tall green ___ beside the pond.|linen,silt
    sickle|sickles|a tool with a curved blade for cutting grain|镰刀|The farmer cut the wheat with a sharp ___.|Each worker carried a ___ into the field at harvest time.|The curved blade of the ___ flashed in the sun.|granary,barge
    chariot|chariots|a two-wheeled cart pulled by horses, used long ago in battles and races|（古代）战车|The king rode into battle in a golden ___.|Two horses pulled the ___ around the track.|Soldiers fought from the back of a fast ___.|barge,sickle
    sphinx|sphinxes|a stone statue with the body of a lion and the head of a person|狮身人面像|The great ___ lies in the sand near the pyramids.|The ___ has a lion's body and a king's face.|Long ago, sand covered the ___ up to its neck.|granary,chariot
    linen|-|a cool, light cloth made from the flax plant|亚麻布|Egyptians wore clothes made of white ___ in the hot sun.|The mummy was wrapped in strips of ___.|This ___ shirt keeps me cool on summer days.|reed,silt
  `,
  notes: `
    silt|a black layer of river mud covering the fields after a flood|soft mud left by the river for planting seeds|fine mud turning the river water brown|silt is fine river mud; delta is the whole fan-shaped land at a river mouth|silt 是河水留下的细泥；delta 是整片入海口三角洲|delta is a wide stretch of flat land at a river mouth, not fine rich mud carried by a river|delta 指入海口的大片三角洲陆地，不是河水挟带的肥沃细泥|reed is a tall water grass, not fine rich river mud|reed 是水边长出的高大芦苇，不是河水留下的细泥|silt|short i followed by lt blend|短音 i 加结尾 lt
    delta|flat land where the Nile splits into many streams near the sea|wet, green land where the river meets the sea|fan-shaped land formed at the mouth of a river|delta is flat land where a river fans out into the sea; cataract is rough rocky rapids|delta 是入海口平坦分叉的三角洲；cataract 是急流险滩|cataract is fast water crashing over rocks, not flat land where a river splits near the sea|cataract 是撞击岩石的急流险滩，不是入海口平坦分叉的陆地|silt is fine mud carried by water, not flat land where a river meets the sea|silt 是河水挟带的细泥，不是河流入海口的整片平地|del · ta|short e in del and -ta ending|del 里的短 e 和结尾 -ta
    cataract|rough water crashing over rocks where boats cannot sail|dangerous rapids that sailors must carry their boat around|roaring white water rushing over river rocks|cataract is rough rocky rapids; delta is calm flat land by the sea|cataract 是撞石飞溅的急流；delta 是平坦三角洲|delta is calm flat land by the sea, not fast, rough water crashing over rocks|delta 是入海口平缓的陆地，不是撞击岩石的急流险滩|silt is fine soft mud, not fast, rough water rushing over river rocks|silt 是松软的淤泥，不是激荡险峻的急流险滩|cat · a · ract|a-a-a vowels ending in ct|三个 a，结尾是 ct
    barge|a flat river boat carrying huge blocks of stone|a boat loaded with sacks of grain|a flat boat floating slowly with the river current|barge floats heavy loads on rivers; chariot rolls behind horses on land|barge 是河运重货的驳船；chariot 是马拉战车|chariot is a horse-drawn cart on land, not a flat boat on a river|chariot 是陆上马拉的战车，不是河上行进的平底船|granary is a fixed building that stores grain, not a boat moving loads on water|granary 是固定存粮的粮仓，不是在水上运货的船|barge|ar + soft g before silent e|ar 加在 e 前读 /dʒ/ 的 g
    granary|a building where harvested wheat is stored|a storehouse holding enough grain to feed a city|a grain storehouse that mice try to sneak into|granary is a building that stores grain; barge is a boat that carries it|granary 是存放粮食的粮仓；barge 是运粮的驳船|barge is a flat river boat that moves cargo, not a building where grain is stored|barge 是河上运货的驳船，不是存放粮食的仓库建筑|sphinx is a stone statue, not a building for storing grain|sphinx 是石雕狮身人面像，不是储藏粮食的建筑|gran · a · ry|gran (like grain without i) plus -ary|gran（比 grain 少 i）加 -ary
    reed|a tall water plant growing taller than a person by the river|river grass woven into baskets and mats|a tall green water stalk hiding a duck beside a pond|reed is a tall grass growing in water; linen is woven cloth|reed 是水边生长的芦苇；linen 是织好的亚麻布|linen is finished woven cloth, not a tall green grass growing in water|linen 是织好的亚麻布，不是长在水边的高大水草|silt is fine river mud, not a tall, thin water plant|silt 是河底淤泥，不是细长高大的水边植物|reed|ee spelling long e (not read)|发长 e 音的 ee（别写成 read）
    sickle|a sharp curved tool used to cut wheat|a harvest blade carried into the field|a curved blade flashing in the sun at harvest|sickle is a hand tool for cutting grain; granary is the building that stores it|sickle 是收割麦子的镰刀；granary 是存粮的粮仓|granary is a building where grain is stored, not a sharp curved blade held in the hand|granary 是存粮的建筑，不是握在手里的弯刃农具|barge is a flat river boat, not a curved tool for cutting grain|barge 是平底驳船，不是收割谷物的弯刃工具|sick · le|ck after short i plus -le|短音 i 后的 ck 加结尾 -le
    chariot|a golden battle vehicle ridden by a king|a two-wheeled cart pulled by two horses around a track|a fast horse-drawn cart carrying soldiers into battle|chariot is a horse-drawn cart on land; barge is a flat boat on water|chariot 是马拉战车；barge 是平底驳船|barge is a flat boat on a river, not a fast two-wheeled cart pulled by horses|barge 是河上缓行的驳船，不是马拉的双轮战车|sickle is a small curved harvest blade, not a horse-drawn wheeled cart|sickle 是割麦的小弯刀，不是马拉的两轮车|char · i · ot|ch + ar + i-ot|ch 加 ar 再加 i-ot
    sphinx|a giant stone statue lying in the sand near the pyramids|a statue with a lion's body and a king's face|a desert statue once buried in sand up to its neck|sphinx is a lion-bodied stone statue; granary is a grain storehouse|sphinx 是狮身人面石像；granary 是粮仓|granary is a building for storing grain, not a stone statue|granary 是储存粮食的仓库，不是石雕像|chariot is a horse-drawn cart, not a stone statue|chariot 是马拉战车，不是巨型石雕像|sphinx|sph- (ph saying /f/) and ending nx|开头的 sph-（ph 读 /f/）和结尾 nx
    linen|cool white cloth worn in the hot Egyptian sun|light cloth strips used to wrap a mummy|a cool summer shirt made of light woven fabric|linen is cool light cloth woven from flax; reed is a tall water grass|linen 是凉爽的亚麻布；reed 是水边芦苇|reed is a stiff water grass, not cool light cloth made from flax|reed 是硬挺的水草，不是亚麻织成的轻爽布料|silt is fine river mud, not cool light woven cloth|silt 是河底淤泥，不是轻爽洁净的布料|lin · en|single n in the middle and -en ending|中间单个 n，结尾 -en
  `,
};

const ancientLife: Grade3Batch = {
  id: "words-of-ancient-life",
  title: t("Words of Ancient Life", "古代生活的词汇"),
  summary: t(
    "Ten words for how people lived in ancient times: civilization, kingdom, temple, merchant, artisan and more.",
    "十个描述古人生活的词：civilization、kingdom、temple、merchant、artisan 等。",
  ),
  intro: t(
    "Inside a sunlit workshop, an **artisan** spends weeks shaping a tiny stone cat by hand. To picture an ancient city, you need the right words for its people, buildings, and daily work.",
    "阳光照进作坊，工匠（**artisan**）花上几周手工雕出一只精致的石猫。想在脑海里还原一座古城，得先认准古人的身份、建筑和劳作。",
  ),
  watchOut: {
    meanings: t(
      "Tell **merchant** (buys and sells goods at the market) apart from **artisan** (makes pots, statues, or jewelry by hand).",
      "分清 **merchant**（做买卖的商人）和 **artisan**（手工做器物首饰的工匠）。",
    ),
    use: t(
      "A **temple** is for praying to gods, while a **monument** honors a person or battle—check whether people go there to worship or to remember.",
      "**temple** 是用来祭拜神明的神庙，**monument** 是纪念人物或战役的纪念碑——看句中是祈祷还是纪念。",
    ),
    spelling: t(
      "Watch **pyramid** (*y* says short *i*), **civilization** (*-zation*), and **worship** (*or* says /ɜːr/ after *w*).",
      "注意 **pyramid** 里读短 *i* 的 **y**、**civilization** 的 **-zation**，以及 **worship** 里跟在 *w* 后读 /ɜːr/ 的 **or**。",
    ),
  },
  domain: ["how people lived long ago", "古人的生活"],
  lines: `
    civilization|civilizations|a large group of people with cities, laws, writing and a shared way of life|文明|Ancient Egypt was a great ___ that lasted for thousands of years.|The ___ along the river built cities, wrote laws and traded goods.|Every ___ has its own way of building, writing and worshipping.|kingdom,temple
    kingdom|kingdoms|a land ruled by a king or queen|王国|The king ruled his ___ from a palace by the river.|The two lands joined to make one large ___.|Soldiers guarded the borders of the ___.|civilization,temple
    temple|temples|a building where people go to worship a god or gods|神庙，寺庙|People brought gifts of food to the ___ of the sun god.|People went inside the ___ to pray to the cat goddess.|Priests lit lamps inside the ___ every evening.|monument,pyramid
    noble|nobles|a rich person of high rank, close to the king|贵族|The ___ lived in a big house with servants and a garden.|Each ___ wore gold rings and fine clothes at the feast.|The king chose a ___ to rule the city for him.|merchant,artisan
    merchant|merchants|a person who buys and sells goods|商人|The ___ sold cloth and spices at the market.|A ___ sailed up the river with jars of oil to trade.|The ___ counted his coins after a busy day of selling.|artisan,noble
    trade|traded,trades|to swap goods with other people|交易，以物易物|Farmers would ___ grain for cloth and pots.|Egypt began to ___ gold for wood from other lands.|I will ___ you my apple for your orange.|worship,merchant
    artisan|artisans|a skilled worker who makes things by hand|工匠|The ___ carved a beautiful cat out of stone.|The ___ spent weeks making a gold necklace for the queen.|Each ___ in the workshop had a special skill, like making pots or jewelry.|merchant,noble
    worship|worshipped,worships|to show love and respect to a god|崇拜，敬拜|People went to the temple to ___ the gods.|Ancient Egyptians would ___ the sun god every morning.|Many people still ___ in old temples today.|trade,temple
    monument|monuments|a building or statue made to remember a person or event|纪念碑，纪念性建筑|The city built a stone ___ to honor the brave king.|A tall ___ stands in the square to remember the battle.|This ___ was built to help people remember the day the war ended.|temple,pyramid
    pyramid|pyramids|a huge stone building with a square base and four sloping sides that meet at a point|金字塔|The king was buried inside a giant ___.|Thousands of workers built the ___ block by block.|The ___ has four sides that meet at a point at the top.|temple,monument
  `,
  notes: `
    civilization|a whole ancient society lasting thousands of years|a river society with cities, laws, and trade|a shared way of building, writing, and worshipping|civilization is a whole society with cities, writing, and laws; kingdom is a land ruled by a king|civilization 是包含城市、文字和法律的整个文明；kingdom 是国王统治的王国|kingdom is only the territory ruled by a king or queen, not a whole society with cities, laws, and writing|kingdom 只指国王统治的疆域，不概括文字、建筑与法律构成的整个文明|temple is a single building for prayer, not a large group of people with a shared way of life|temple 只是单个祭拜神明的建筑，不是整个古代社会文明|civ · i · li · za · tion|i-i-i pattern plus -zation|三个 i 加结尾 -zation
    kingdom|a land ruled by a king from his palace|two lands united into one realm|a ruled territory whose borders soldiers guard|kingdom is a land ruled by a king or queen; civilization is a whole society's way of life|kingdom 是国王统治的王国；civilization 是整个社会文明|civilization is a whole society's shared way of life, not specifically a land ruled by a king or queen|civilization 指文字、法律等整体文明，不专指国王统治的领土王国|temple is a house of worship, not a land ruled by a king or queen|temple 是神庙建筑，不是国王统治的国土|king · dom|compound king + -dom|king 加后缀 -dom
    temple|a sacred building where people bring food offerings to the sun god|a house of prayer for the cat goddess|a sanctuary where priests light lamps each evening|temple is a building for worshipping gods; monument is built to remember a person or event|temple 是祭拜神明的神庙；monument 是纪念人物或事件的纪念碑|monument honors a memory or event rather than serving as a building for worshipping gods|monument 用来纪念人物或事件，不是供奉祈祷神明的建筑|pyramid is a pointed four-sided royal tomb, not a building where people worship gods|pyramid 是四角尖顶的金字塔陵墓，不是日常拜神的神庙|tem · ple|ending -ple with silent e|结尾 -ple 带不发音的 e
    noble|a rich high-ranking person with servants and a garden|a high-born guest in gold rings and fine clothes|a trusted lord chosen by the king to rule a city|noble is a wealthy lord of high rank; merchant is a trader who buys and sells goods|noble 是位高权重的贵族；merchant 是做买卖的商人|merchant earns a living buying and selling goods, not holding high rank close to the king|merchant 靠买卖货物谋生，不是国王身旁的高位贵族|artisan makes things by hand in a workshop, not holding high rank as a wealthy lord|artisan 是手工制器的工匠，不是位高权重的富贵贵族|no · ble|long o in no and -ble ending|no 里的长 o 和结尾 -ble
    merchant|a trader selling cloth and spices at the market|a river trader carrying jars of oil to swap|a seller counting coins after a busy market day|merchant buys and sells goods; artisan makes goods by hand|merchant 靠买卖经商；artisan 靠手艺制作器物|artisan crafts objects by hand rather than buying and selling goods|artisan 是手工制器的工匠，不是买卖货物的商人|noble is a high-ranking lord, not a trader who buys and sells goods|noble 是高位贵族，不是做买卖的商人|mer · chant|er + ch + -ant ending|er 加 ch 再加 -ant
    trade|swapping grain for cloth and pots|exchanging gold for wood with other lands|swapping an apple for an orange|trade is the action of swapping goods; worship is the action of honoring a god|trade 是交换货物的动作；worship 是敬拜神明的动作|worship means praying to and honoring a god, not swapping goods with someone|worship 是向神明祈祷致敬，不是彼此交换物品|merchant is the person who trades, not the verb for swapping one thing for another|merchant 是做买卖的人，不是表示“交换”的动词|trade|tr blend and silent e making long a|tr 连缀和让 a 读长音的 e
    artisan|a skilled craftsperson carving a stone cat|a goldsmith spending weeks making a queen's necklace|a workshop maker skilled at pots or jewelry|artisan crafts things by hand; merchant sells them at market|artisan 是手工制器的工匠；merchant 是买卖货物的商人|merchant buys and sells finished goods instead of making things by hand|merchant 是买卖成品的商人，不是亲手制作器物的手艺人|noble is a wealthy lord of high rank, not a skilled worker who makes things by hand|noble 是高位贵族，不是靠手艺手工制作物品的工匠|ar · ti · san|ar + ti + san (with s saying /z/)|ar 加 ti 加读 /z/ 的 san
    worship|honoring and praying to gods inside a temple|showing daily reverence to the sun god|praying to gods in old temples|worship is honoring a god; trade is swapping goods|worship 是敬拜神明；trade 是以物易物|trade means swapping goods with other people, not showing love and respect to a god|trade 指交换货物，不是向神明敬拜致敬|temple is the building itself, not the verb for honoring a god|temple 是神庙建筑本身，不是表示“敬拜”的动词|wor · ship|or saying /ɜːr/ after w, plus ship|w 后读 /ɜːr/ 的 or 加 ship
    monument|a stone structure built to honor a brave king|a tall memorial standing in a square to remember a battle|a memorial built so people remember the end of a war|monument honors a person or event; temple is a place to worship gods|monument 用来纪念人物或事件；temple 用来祭拜神明|temple is a building for worshipping gods, not a structure built to remember a person or event|temple 是供奉神明的神庙，不是为了纪念人物或事件建造的纪念碑|pyramid is specifically a pointed four-sided tomb, not any building or statue made as a memorial|pyramid 专指四角尖顶的金字塔，不是泛指各类纪念人物或事件的纪念碑|mon · u · ment|u in the middle and -ment ending|中间的 u 和结尾 -ment
    pyramid|a giant stone tomb where a king is buried|a massive stone structure built block by block|a monument with four sloping sides meeting at a point|pyramid has four sloping sides meeting at a point; temple is a house of prayer|pyramid 是四角斜坡汇于尖顶的金字塔；temple 是神庙|temple is a hall for worshipping gods, not a huge four-sided building with sloping sides meeting at a point|temple 是拜神的神庙，不是四面斜坡汇于尖顶的巨型石建筑|monument is a general memorial, not defined by a square base and four sloping sides meeting at a point|monument 泛指各类纪念建筑，并不专指四面斜坡聚于一顶的金字塔|pyr · a · mid|y saying short i at the start|开头读短 i 音的 y
  `,
};

const timeLongAgo: Grade3Batch = {
  id: "words-for-time-long-ago",
  title: t("Words for Time Long Ago", "表达久远时间的词"),
  summary: t(
    "Ten words for talking about time and history: century, decade, era, ancient, modern, generation and more.",
    "十个谈论时间和历史的词：century、decade、era、ancient、modern、generation 等。",
  ),
  intro: t(
    "If your big brother just turned ten, he has already lived through one full **decade**—and ten of those make a **century**! Talking about history gets much sharper once you sort out lengths of time.",
    "哥哥刚满十岁，就已经走过整整一个十年（**decade**）——十个十年加起来才是一个世纪（**century**）。分清这些时间尺度和远近的词，读历史故事就不容易迷糊。",
  ),
  watchOut: {
    meanings: t(
      "Tell **decade** (10 years) apart from **century** (100 years)—a century is ten times as long.",
      "分清 **decade**（十年）和 **century**（一百年）——一个世纪是十个十年。",
    ),
    use: t(
      "**Former** means someone or something from before (no longer now), while **recent** means it happened only a short time ago.",
      "**former** 指“以前的、前任的”，**recent** 指“刚发生不久的、最近的”——不要混用。",
    ),
    spelling: t(
      "Watch **ancient** (*ci* says /ʃ/ + *-ent*) and **previous** (*-ious* at the end).",
      "注意 **ancient** 里读 /ʃ/ 的 **ci** 加 **-ent**，以及 **previous** 结尾的 **-ious**。",
    ),
  },
  domain: ["time and history", "时间和历史"],
  lines: `
    century|centuries|a hundred years|世纪，一百年|This house was built over a ___ ago, more than a hundred years back.|A ___ is ten times as long as a decade.|The giant oak tree has stood here for more than a hundred years — over a whole ___.|decade,generation
    decade|decades|ten years|十年|My big brother is ten, so he has lived for a ___.|Over the ten years of the past ___, our town built three new schools.|The ten years from 2010 to 2019 make up one ___.|century,era
    era|eras|a long period of history known for something special|时代，纪元|The age of the pharaohs was the ___ of great building.|Dinosaurs lived in the ___ long before people.|The invention of the car began a new ___ of travel.|period,century
    ancient|-|from a very long time ago|古代的，古老的|We saw ___ pots that were five thousand years old.|The ___ Egyptians wrote with pictures.|Archaeologists found the ruins of the ___ city buried under the sand.|former,modern
    period|periods|a length of time|时期，一段时间|There was a long ___ with no rain, and the crops dried up.|The class had a quiet reading ___ of twenty minutes after lunch.|For a short ___, the town had no school.|era,decade
    former|-|from before, but not now|以前的，前任的|The ___ king handed his crown to his son.|Our ___ teacher moved to another city.|The old mill is now a library, but its ___ owner made flour there.|modern,recent
    recent|-|happening a short time ago|最近的|In ___ years, more people have started riding bikes.|The ___ storm knocked down two trees last week.|A ___ photo shows how much my sister has grown since spring.|former,previous
    modern|-|of the present time, new and up to date|现代的|A ___ kitchen has a fridge and a microwave.|Most ___ ships are made of steel, not wood.|My grandparents' farm is old, but the tractor is ___.|recent,ancient
    previous|-|the one just before|上一个的，先前的|The ___ day was sunny, but today it is raining.|I read the ___ chapter again before starting a new one.|The new owners painted over the ___ owner's green walls.|modern,recent
    generation|generations|all the people born around the same time, such as parents or grandparents|一代人|My grandmother's ___ grew up without computers.|My mother's ___ was the first to grow up with mobile phones.|Each ___ of the family has lived in this house.|century,decade
  `,
  notes: `
    century|a span of more than a hundred years|a length of time ten times longer than a decade|an oak tree standing for more than a hundred years|century is 100 years; decade is 10 years|century 是一百年；decade 是十年|decade is only ten years, not a full hundred years|decade 只有十年，不是整整一百年|generation is a group of people born around the same time, not a fixed 100-year unit|generation 指同期出生的一代人，不是固定一百年的时间单位|cen · tu · ry|soft c (/s/) and -tury ending|开头读 /s/ 的 c 和结尾 -tury
    decade|a ten-year span matching a ten-year-old brother's life|the past ten years when a town built three new schools|the ten years from 2010 to 2019|decade is 10 years; century is 100 years|decade 是十年；century 是一百年|century is a hundred years—ten times too long for a ten-year span|century 是一百年，比十年长了十倍|era is a long historical age defined by a theme, not strictly ten years|era 指有鲜明特征的漫长历史时代，并不固定是十年|dec · ade|short e in dec and silent e in -ade|dec 的短 e 和 -ade 的词尾 e
    era|the grand historical age of the pharaohs and great building|the long prehistoric age when dinosaurs lived|a new historical age of travel begun by the car|era is a grand historical age known for something special; period is any stretch of time|era 是有标志性特征的历史时代；period 泛指任意一段时间|period can be any short or long stretch of time without marking a grand historical age|period 泛指任意长短的一段时间，不强调宏大的历史纪元|century is strictly one hundred years, not a long period of history known for something special|century 严格指一百年，不是以特殊特征闻名的漫长历史时代|e · ra|long e at the start and -ra|开头长音 e 加 -ra
    ancient|pots that are five thousand years old|Egyptians from thousands of years ago who wrote with pictures|ruins of a long-ago city buried under desert sand|ancient means from a very long time ago; former simply means earlier and no longer now|ancient 指远古时期的；former 只表示以前、前任|former means from before but not now, not necessarily from a very long time ago|former 只指“从前的、前任的”，不强调距今极其久远|modern means present-day and up to date, the exact opposite of from a very long time ago|modern 是现代崭新的，与远古古老正相反|an · cient|ci saying /ʃ/ plus -ent|读 /ʃ/ 音的 ci 加 -ent
    period|a long dry stretch with no rain|a twenty-minute quiet reading stretch after lunch|a short time when a town had no school|period is any length of time; era is a grand historical age|period 泛指任意一段时间；era 是宏大的历史时代|era names a huge historical age, not any ordinary length of time|era 指宏大的历史纪元，不能用来指普通的一段时间|decade means strictly ten years, whereas no ten-year count is given here|decade 固定指十年，而这里并没有说恰好十年|pe · ri · od|io in the middle (pe-ri-od)|中间的 io（pe-ri-od）
    former|a king who handed his crown to his son and no longer rules|a teacher who used to teach the class before moving away|an earlier owner of a mill that is now a library|former means from before and no longer now; modern means of the present time|former 强调“曾任、如今已不是”；modern 强调“现代新式”|modern means up to date and of the present time, the opposite of a past role that ended|modern 指现代的、新式的，与“从前的、前任的”正相反|recent means happening a short time ago, not holding a role in the past that has ended|recent 指不久前发生的，不能表示“前任的、昔日的”|for · mer|or in the first part and -er|前段 or 和结尾 -er
    recent|the last few years as more people ride bikes|a storm that happened just last week|a photo taken only since spring|recent means happening a short time ago; former means from an earlier time and no longer now|recent 指刚发生不久的；former 指以前但现在已不是|former means an earlier role that ended, not something that happened a short time ago|former 指“前任的、昔日的”，不表示刚刚发生不久|previous means the single one right before in order, not just "a short time ago"|previous 指顺序上的“前一个”，不表达“最近、不久前”|re · cent|soft c (/s/) before e and -ent|e 前读 /s/ 的 c 和结尾 -ent
    modern|a present-day kitchen with a fridge and microwave|up-to-date ships built of steel instead of wood|a brand-new tractor on an old farm|modern means up to date and of the present time; recent only means it happened not long ago|modern 指现代的、新式的；recent 只指不久前发生的|recent means happening a short time ago, not up to date and of the present time|recent 只说时间离现在近，不表示“现代新式”|ancient means from a very long time ago, the exact opposite of modern and up to date|ancient 是远古的，与现代崭新正相反|mod · ern|short o and -ern ending|短音 o 和结尾 -ern
    previous|the day right before today|the chapter just before the new one|the owner right before the new owners painted the walls|previous means the exact one just before; modern means of the present time|previous 指紧挨着的上一个；modern 指现代新式|modern means of the present time and up to date, not the one just before|modern 指现代崭新的，不是顺序上紧挨着的上一个|recent means a short time ago, not specifically the one right before in order|recent 只指最近不久，不专指顺序上紧挨着的前一个|pre · vi · ous|pre- plus -vious with -ious|前缀 pre- 加含 -ious 的 -vious
    generation|grandmother's age group who grew up without computers|mother's age group who first grew up with mobile phones|each age group of a family living in the same house|generation is all the people born around the same time; century is a fixed 100 years|generation 是一代人；century 是固定的一百年|century is a hundred-year length of time, not a group of people born around the same time|century 是一百年的时间长度，不是同期出生的一代人|decade is a ten-year stretch of time, not a group of people born around the same time|decade 是十年的时间，不是同期成长起来的一代人|gen · er · a · tion|soft g (/dʒ/) and -tion ending|开头读 /dʒ/ 的 g 和结尾 -tion
  `,
};

const ancientChina: Grade3Batch = {
  id: "words-of-ancient-china",
  title: t("Words of Ancient China", "中国古代的词汇"),
  summary: t(
    "Ten words of life along the Yellow River long ago: millet, paddy, levee, canal, bronze, calligraphy, jade and more.",
    "十个古代黄河沿岸生活的词：millet、paddy、levee、canal、bronze、calligraphy、jade 等。",
  ),
  intro: t(
    "Dip a brush into black ink, unroll a silk **scroll**, and watch every smooth stroke of **calligraphy** appear. Life along the ancient Yellow River comes alive through words for crops, waterways, crafts, and thinkers.",
    "毛笔蘸满黑墨，展开丝绸卷轴（**scroll**），流畅的书法（**calligraphy**）一笔笔落纸生辉。读古代黄河流域的故事，离不开这些关于农田、水利、器物与思想家的词。",
  ),
  watchOut: {
    meanings: t(
      "Tell **levee** (a raised earth bank that holds river water back) apart from **canal** (a dug waterway that carries boats or water).",
      "分清 **levee**（拦住河水的土堤坝）和 **canal**（人工开凿通船引水的运河水渠）。",
    ),
    use: t(
      "**Millet** grows in dry northern soil, while a **paddy** is a flooded field for wet rice.",
      "**millet**（小米）长在干旱的黄土里，**paddy**（稻田）则是蓄满水种水稻的田。",
    ),
    spelling: t(
      "Watch **calligraphy** (double *l*, *ph* for /f/) and **philosopher** (*ph* twice, *-er* at the end).",
      "注意 **calligraphy** 里的双写 **l** 与 **ph**，以及 **philosopher** 里出现两次的 **ph**。",
    ),
  },
  domain: ["ancient China", "中国古代"],
  lines: `
    millet|-|a grain with small round seeds that grows well in dry places|小米，粟|Farmers in the north grew ___ in the dry yellow soil.|Bowls of ___ porridge were a common breakfast long ago.|The tiny round seeds of ___ can be cooked like rice.|paddy,canal
    paddy|paddies|a flooded field where rice is grown|稻田|The farmer waded through the muddy ___ to plant rice.|Water covered the ___ so the young rice could grow.|Frogs croaked in the green rice ___ at night.|millet,canal
    levee|levees|a high bank of earth built to keep a river from flooding|堤坝|The villagers piled up earth to build a ___ along the river.|When the ___ broke, water poured into the fields.|People walked along the top of the ___ to check for cracks.|canal,paddy
    canal|canals|a long waterway dug by people for boats or for watering fields|运河，水渠|Boats carried rice along the ___ to the city.|Workers dug a ___ to bring river water to the dry farms.|The Grand ___ in China is over a thousand miles long.|levee,paddy
    bronze|-|a hard, golden-brown metal made by melting copper and tin together|青铜|Ancient Chinese artisans cast bells and pots in ___.|The golden-brown ___ vessel was cast from melted metal with faces on its sides.|Mixed with tin, copper becomes ___, which is much harder.|jade,scroll
    calligraphy|-|the art of beautiful handwriting, often with a brush and ink|书法|My uncle practices ___ with a brush and black ink.|Each stroke of ___ must be smooth and careful.|The scroll on the wall shows a poem written in ___.|scroll,philosopher
    jade|-|a hard green stone used to make jewelry and carvings|玉|The emperor wore a ring carved from green ___.|The ___ bracelet felt cool and smooth on her wrist.|Artisans spent months carving a dragon out of ___.|bronze,scroll
    ancestor|ancestors|a family member who lived long before you|祖先|My great-great-grandfather is the ___ who came from a small village.|Families honored each ___ with gifts and prayers.|We found the name of one ___ in an old family book.|philosopher,scroll
    philosopher|philosophers|a person who thinks deeply about how people should live|哲学家，思想家|Confucius was a ___ who taught people to be kind and respectful.|The old ___ spent his days thinking about what makes a good ruler.|Students came from far away to learn from the wise ___.|ancestor,calligraphy
    scroll|scrolls|a long roll of paper or silk with writing or pictures on it|卷轴|The emperor unrolled a ___ covered with a map.|A long ___ showed a painting of mountains and rivers.|Each poem was written on its own silk ___.|calligraphy,jade
  `,
  notes: `
    millet|a dry-soil grain grown in northern yellow soil|a grain cooked into bowls of breakfast porridge|tiny round seeds that can be cooked like rice|millet is a dry-land grain you eat; paddy is a flooded field where rice grows|millet 是耐旱可食用的小米谷物；paddy 是蓄水种稻的稻田|paddy is a flooded field where rice is grown, not a dry-soil grain|paddy 是蓄水种稻的稻田，不是旱地种植的谷物|canal is a man-made waterway for boats or irrigation, not an edible grain|canal 是人工开凿的水渠运河，不是可食用的农作物谷粒|mil · let|double l and -et ending|双写 l 和结尾 -et
    paddy|a muddy flooded field where a farmer plants rice|a water-covered field helping young rice grow|a green wet rice field where frogs croak at night|paddy is a flooded field for wet rice; millet is a dry-soil grain|paddy 是蓄水种稻的稻田；millet 是旱地小米|millet is a grain that grows in dry places, not a flooded field for rice|millet 是长在旱地的谷物，不是积满水种稻的水田|canal is a long dug waterway for boats or carrying water, not a flooded field where rice is grown|canal 是通船引水的长水渠，不是插秧种稻的田块|pad · dy|double d and -y ending|双写 d 和结尾 -y
    levee|a bank of piled earth built along a river|a flood wall whose break lets water pour into fields|a raised bank people walk along to check for cracks|levee is a raised bank blocking river floods; canal is a dug channel carrying water|levee 是拦水防洪的土堤坝；canal 是引水通船的运河|canal is a dug waterway that carries water or boats, not a high earth bank built to stop floods|canal 是挖出来引水行船的水道，不是堆土筑起的挡水堤坝|paddy is a flooded rice field, not a raised earth bank keeping a river from flooding|paddy 是种水稻的水田，不是拦住河水防洪的土堤|lev · ee|single v and double e at the end|单个 v，结尾双写 e
    canal|a dug waterway carrying rice boats to the city|a dug channel bringing river water to dry farms|a thousand-mile-long man-made waterway|canal is a dug waterway carrying boats or water; levee is a raised bank keeping water out|canal 用来通航引水；levee 用来筑堤拦水|levee is a high earth bank that keeps water out, not a dug waterway carrying water or boats|levee 是拦住洪水的土堤，不是通航引水的人工水道|paddy is a flooded rice field, not a long waterway dug by people|paddy 是种稻的水田，不是人工开凿的长运河水渠|ca · nal|single n and -al ending|单个 n 和结尾 -al
    bronze|a hard metal cast into bells and pots|a golden-brown vessel cast from melted metal|a golden-brown metal made by melting copper and tin|bronze is a golden-brown copper-and-tin metal; jade is a hard green stone|bronze 是铜锡熔铸的青铜金属；jade 是坚硬的绿色玉石|jade is a hard green stone, not a golden-brown metal made from copper and tin|jade 是坚硬的绿色玉石，不是铜锡熔铸的青铜金属|scroll is a rolled sheet of paper or silk, not a hard metal|scroll 是纸或丝绸卷轴，不是坚硬的金属|bronze|br blend and silent e after z|br 连缀和 z 后的不发音 e
    calligraphy|the art of writing with a brush and black ink|smooth, careful brush strokes on paper|beautiful brushwork displaying a poem on a wall scroll|calligraphy is the art of brush handwriting; scroll is the roll of paper or silk it is written on|calligraphy 是毛笔书法艺术；scroll 是书写用的卷轴|scroll is the rolled sheet of silk or paper itself, not the art of beautiful handwriting|scroll 指丝绸或纸张卷轴本身，不是运笔写字的书法艺术|philosopher is a deep thinker who teaches wisdom, not the art of handwriting|philosopher 是思考人生的哲学家，不是书写艺术|cal · lig · ra · phy|double l and ph spelling /f/|双写 l 和发 /f/ 音的 ph
    jade|a hard green stone carved into an emperor's ring|a cool, smooth green stone bracelet|a hard stone carved into a dragon over months|jade is a hard green stone; bronze is a golden-brown metal|jade 是绿色硬玉；bronze 是金褐色青铜|bronze is a golden-brown metal alloy, not a hard green stone|bronze 是金褐色的金属合金，不是坚硬翠绿的玉石|scroll is a flexible roll of paper or silk, not a hard green stone|scroll 是柔软的纸绢卷轴，不是坚硬的绿色玉石|jade|silent e making long a|词尾不发音的 e 让 a 读长音
    ancestor|a great-great-grandfather from a family's past|a forebear honored with family gifts and prayers|a past relative recorded in an old family book|ancestor is a family member who lived long before you; philosopher is a deep thinker|ancestor 是家族先祖；philosopher 是思想家|philosopher is a thinker about how to live, not necessarily a family member who lived long before you|philosopher 是探讨人生的哲学家，并不是家族里的先辈|scroll is a rolled sheet of paper or silk, not a family member who lived long before you|scroll 是写字作画的卷轴，不是你的家族祖先|an · ces · tor|soft c (/s/) before e and -or ending|e 前读 /s/ 的 c 和结尾 -or
    philosopher|a wise thinker like Confucius teaching kindness|a deep thinker reflecting on what makes a good ruler|a wise teacher students travel far to learn from|philosopher thinks deeply about how people should live; ancestor is an earlier family member|philosopher 是探讨为人处世的思想家；ancestor 是家族祖先|ancestor is a relative from an earlier generation, not a deep thinker about how people should live|ancestor 指家族里的先辈，不是探讨为人处世的哲学家|calligraphy is the art of brush handwriting, not a wise person who thinks deeply about life|calligraphy 是书法艺术，不是深入思考人生的哲人|phi · los · o · pher|ph spelling /f/ twice|前后两处发 /f/ 音的 ph
    scroll|a rolled map that the emperor unrolls|a long painted roll showing mountains and rivers|a silk roll carrying a written poem|scroll is the rolled sheet of paper or silk; calligraphy is the brush handwriting on it|scroll 是可展开的卷轴；calligraphy 是写在上面的书法|calligraphy is the art of handwriting, not a long roll of paper or silk|calligraphy 是写字的艺术，不是可以展开的纸绢卷轴|jade is a hard green stone, not a long roll of paper or silk|jade 是坚硬的绿玉，不是写字作画的长卷轴|scroll|scr three-letter blend and double l|开头的 scr 连缀和结尾双写 l
  `,
};

const walls: Grade3Batch = {
  id: "words-of-walls-and-watchtowers",
  title: t("Words of Walls and Watchtowers", "城墙与烽火台的词汇"),
  summary: t(
    "Ten words of walls built to guard a land: fortress, beacon, watchtower, rampart, invader, patrol and more.",
    "十个守卫国土的城墙的词：fortress、beacon、watchtower、rampart、invader、patrol 等。",
  ),
  intro: t(
    "A distant rider appears on the horizon, and the guard on the **watchtower** touches a torch to the pile of wood—the **beacon** flares up to warn the next hill! Guarding great walls brings a whole set of vivid words.",
    "地平线上出现敌骑，瞭望台（**watchtower**）上的守兵立刻点燃柴堆——烽火（**beacon**）冲天而起，向下一座山头报信！读守卫城墙的故事，这十个词最常用。",
  ),
  watchOut: {
    meanings: t(
      "Tell **watchtower** (a tall lookout tower) apart from **fortress** (a whole walled stronghold) and **rampart** (the wide walkway along the top of a wall).",
      "分清 **watchtower**（高耸的瞭望台）、**fortress**（整座坚固要塞）和 **rampart**（城墙顶部供士兵行走的宽台）。",
    ),
    use: t(
      "A **beacon** is specifically a warning fire on a high place, while a **signal** can be any sign—smoke, a flag, or a drum.",
      "**beacon** 专指高处燃起的警报烽火，**signal** 则泛指烟、旗帜、鼓声等一切信号。",
    ),
    spelling: t(
      "Watch **beacon** (*ea* says long *e*), **garrison** (double *r*, *-ison*), and **fortress** (double *s*).",
      "注意 **beacon** 里的 **ea**、**garrison** 的双写 **r**，以及 **fortress** 结尾的双写 **s**。",
    ),
  },
  domain: ["walls and how people guarded them", "城墙及其守卫"],
  lines: `
    fortress|fortresses|a large, strong building with walls, built to keep enemies out|要塞，堡垒|The soldiers hid inside the stone ___ when the enemy came.|The ___ on the hill had thick walls and a heavy gate.|No army could break into the mighty ___.|watchtower,rampart
    beacon|beacons|a fire lit on a high place as a warning signal|烽火，信号火|When guards saw the enemy, they lit a ___ on the tower.|The ___ blazed on the hilltop so the next tower could see it.|One ___ after another was lit, all the way to the capital.|signal,watchtower
    watchtower|watchtowers|a tall tower where guards stand to look out for danger|瞭望塔，烽火台|A guard climbed the ___ to look across the desert.|From the top of the ___, you could see for miles.|Each ___ stood on a hill along the wall.|fortress,rampart
    rampart|ramparts|the wide top of a wall where soldiers can walk and fight|城墙，壁垒|Soldiers marched along the ___ of the city wall.|Archers stood on the ___ and looked down at the enemy.|The ___ was wide enough for five horses to walk side by side.|fortress,barrier
    laborer|laborers|a worker who does hard work with their hands|劳工，体力劳动者|Each ___ carried heavy stones up the mountain.|Every ___ on the wall worked from sunrise to sunset.|The tired ___ rested in the shade after a long day of digging.|invader,garrison
    invader|invaders|an enemy who comes into a land to take it|侵略者|The wall was built to keep out any ___ from the north.|One ___ tried to climb the wall at night.|The guards drove the ___ away from the gate.|garrison,laborer
    barrier|barriers|something that blocks the way|屏障，障碍物|The river was a natural ___ that the enemy could not cross.|A ___ of rocks blocked the road.|The wall made a long ___ across the mountains.|rampart,fortress
    garrison|garrisons|a group of soldiers who live in a place to guard it|驻军，卫戍部队|A ___ of fifty soldiers lived at the fort.|The ___ guarded the gate day and night.|When the beacon was lit, the whole ___ ran to the wall.|invader,laborer
    signal|signals|a sound, light or sign that sends a message|信号|Smoke in the day was a ___ that the enemy was coming.|The guard waved a flag as a ___ to open the gate.|A loud drum was the ___ for the soldiers to gather.|beacon,patrol
    patrol|patrolled,patrols|to walk or ride around a place to guard it|巡逻|Soldiers would ___ the wall every night.|Guards on horses ___ along the border.|Two guards ___ the gate from dusk until dawn.|observe,recite
  `,
  notes: `
    fortress|a stone stronghold where soldiers shelter from enemies|a hilltop stronghold with thick walls and a heavy gate|a mighty walled stronghold no army can break into|fortress is a whole walled stronghold; watchtower is a single tall lookout tower|fortress 是有厚墙重门的整座要塞；watchtower 只是单个瞭望高塔|watchtower is a single tall lookout tower, not a large walled stronghold built to keep enemies out|watchtower 只是单个瞭望高塔，不是能抵御敌军的大型坚固要塞|rampart is just the wide top walkway of a wall, not a whole large building with strong walls|rampart 只是城墙顶部的通道，不是整座坚固堡垒|for · tress|tr blend and double s at the end|tr 连缀和结尾双写 s
    beacon|a warning fire lit on a tower when enemies appear|a fire blazing on a hilltop for the next tower to see|a chain of warning fires lit all the way to the capital|beacon is specifically a warning fire on a high place; signal can be any flag, sound, or smoke|beacon 专指高处燃起的警报烽火；signal 泛指一切信号|signal can be any sound, flag, or sign, not specifically a warning fire lit on a high place|signal 可以是旗帜、鼓声或烟，并不专指高处燃起的警报烽火|watchtower is the tall lookout tower itself, not the warning fire lit on top|watchtower 是瞭望塔楼本身，不是燃起的警报火堆|bea · con|ea spelling long e and -con ending|发长 e 音的 ea 和结尾 -con
    watchtower|a tall tower a guard climbs to scan the desert|a high lookout post with a view for miles|a lookout tower standing on a hill along the wall|watchtower is a tall lookout tower; fortress is a whole walled stronghold|watchtower 是高耸的瞭望塔；fortress 是整座要塞|fortress is a whole walled stronghold, not a single tall tower where guards look out for danger|fortress 是驻守大军的整座要塞，不是供哨兵登高望远的单个高塔|rampart is the wide walkway on top of a wall, not a tall lookout tower|rampart 是城墙顶上的通道，不是高耸的瞭望塔|watch · tow · er|silent t in watch plus tower|watch 里不发音的 t 加 tower
    rampart|the wide top of a city wall where soldiers march|the high wall top where archers look down at enemies|a wall top wide enough for five horses side by side|rampart is the wide walkway on top of a wall; fortress is a whole walled building|rampart 是城墙顶部的宽道；fortress 是整座要塞|fortress is a whole walled building, not the wide walkway along the top of a wall|fortress 是整座堡垒建筑，不是城墙顶上供士兵行走作战的宽台|barrier is anything that blocks a way, not specifically the wide top of a wall where soldiers walk and fight|barrier 泛指任何阻路的障碍物，不专指城墙顶上的宽道|ram · part|ram + part (with ar)|ram 加含 ar 的 part
    laborer|a worker carrying heavy stones up the mountain|a wall builder working from sunrise to sunset|a tired worker resting after a long day of digging|laborer does hard physical building work; invader is an attacking enemy|laborer 是做重体力活的劳工；invader 是来犯的侵略者|invader is an enemy attacking a land, not a worker who does hard physical labor|invader 是来夺取土地的敌人，不是做重体力活的劳工|garrison is a group of guarding soldiers, not a worker who does hard physical work|garrison 是守卫要塞的驻军部队，不是干体力活的单个劳工|la · bor · er|-or + -er ending|词尾 -or 再加 -er
    invader|an enemy from the north that the wall keeps out|an enemy trying to climb the wall at night|an attacker driven away from the gate by guards|invader is an attacking enemy; garrison is the group of soldiers defending the fort|invader 是来犯的侵略者；garrison 是守城的驻军|garrison is the home force guarding a place, the opposite of an enemy coming to take a land|garrison 是守卫当地的己方驻军，与来犯的侵略者正相反|laborer is a worker who builds and digs, not an enemy who enters a land to take it|laborer 是做体力活的工人，不是入侵夺地的敌人|in · vad · er|long a in vad and -er ending|vad 里的长 a 和结尾 -er
    barrier|a natural river that enemies cannot cross|a pile of rocks blocking a road|a long wall blocking passage across the mountains|barrier is anything natural or built that blocks the way; rampart is the wide top of a wall|barrier 泛指阻挡通行的屏障；rampart 专指城墙顶道|rampart is specifically the wide top of a city wall, not anything that blocks the way|rampart 专指城墙顶上的通道，不是泛指任何挡路的障碍|fortress is a large walled stronghold, not just anything that blocks the way|fortress 是大型堡垒建筑，不是泛指各种屏障障碍|bar · ri · er|double r and -ier ending|双写 r 和结尾 -ier
    garrison|fifty soldiers living at a fort to guard it|a troop of defenders guarding the gate day and night|the whole force of fort soldiers running to the wall at the alarm|garrison is the defending troop stationed at a fort; invader is an attacking enemy|garrison 是驻守防卫的部队；invader 是来犯敌人|invader is an enemy attacking from outside, not the group of soldiers living at a place to guard it|invader 是从外面来犯的敌人，不是常驻守卫的驻军部队|laborer is a single physical worker, not a group of soldiers stationed to guard a fort|laborer 是干体力活的单个劳工，不是驻守要塞的士兵部队|gar · ri · son|double r and -ison ending|双写 r 和结尾 -ison
    signal|daytime smoke warning that enemies are coming|a waved flag telling guards to open the gate|a loud drum calling soldiers to gather|signal is any sign, sound, or light sending a message; beacon is specifically a hilltop fire|signal 泛指烟、旗、鼓等任何信号；beacon 专指高处烽火|beacon is specifically a warning fire on a high place, not any sound, light, or sign that sends a message|beacon 专指高处燃起的烽火，不能泛指所有传递信息的声音或标志|patrol is the action of walking or riding guard rounds, not a sound, light, or sign sending a message|patrol 是巡逻守卫的动作，不是传递信息的信号|sig · nal|g pronounced clearly and -al ending|清晰发音的 g 和结尾 -al
    patrol|soldiers walking the wall every night on guard|guards riding horses along the border|guards watching and walking by the gate all night|patrol walks or rides guard rounds; observe watches carefully to learn|patrol 是巡逻守卫；observe 是仔细观察|observe means watching something quietly to learn about it, not walking or riding guard rounds along a wall or border|observe 是静静观察以了解事物，不是沿城墙边境来回巡逻守卫|recite means saying a poem aloud from memory, not walking or riding around to guard a place|recite 是背诵诗文，不是巡查守卫|pa · trol|tr blend and long o before l|tr 连缀和 l 前的长音 o
  `,
};

const thinking: Grade3Batch = {
  id: "words-for-thinking-and-wondering",
  title: t("Words for Thinking and Wondering", "表达思考与好奇的词"),
  summary: t(
    "Ten words for how we think: wonder, notice, imagine, suppose, puzzle, reason, wisdom and more.",
    "十个描述思考的词：wonder、notice、imagine、suppose、puzzle、reason、wisdom 等。",
  ),
  intro: t(
    "You find strange footprints in fresh snow and stop—they **puzzle** you, so you begin to **wonder** what animal walked by in the night. Thinking words show exactly how a mind works.",
    "新雪地上留着一串奇怪的脚印，你停下脚步——它们让你百思不得其解（**puzzle**），忍不住好奇（**wonder**）昨晚经过了什么动物。这些思考词，能准确写出大脑在做什么。",
  ),
  watchOut: {
    meanings: t(
      "Tell **notice** (spot something real right in front of you) apart from **imagine** (picture something in your mind).",
      "分清 **notice**（留意到眼前的真实细节）和 **imagine**（在脑海里凭空想象画面）。",
    ),
    use: t(
      "**Wonder** asks a curious question (*why is the sky blue?*), while **suppose** makes a likely guess (*the bus is late because of snow*).",
      "**wonder** 是带着好奇发问，**suppose** 是推测某事八成如此——看句子是在追问还是在猜测。",
    ),
    spelling: t(
      "Watch **wonder** (starts with *won-*, not *wan-* like *wander*) and **imagine** (single *m*, silent *e*).",
      "注意 **wonder** 开头是 **won-**（别和闲逛 *wander* 混了），以及 **imagine** 中间是单个 **m**。",
    ),
  },
  domain: ["thinking and wondering", "思考和好奇"],
  lines: `
    wonder|wondered,wonders|to ask yourself about something you want to know|想知道，好奇|I ___ why the sky is blue.|Do you ever ___ what is at the bottom of the sea?|The children began to ___ who had left the box on the step.|suppose,imagine
    notice|noticed,notices|to see or become aware of something|注意到|Did you ___ that the leaves are turning red?|I did not ___ the cat sitting on the roof until it meowed.|Good scientists ___ small changes.|imagine,wonder
    imagine|imagined,imagines|to make a picture of something in your mind|想象|Close your eyes and ___ you are flying over the clouds.|Can you ___ life without electricity?|I like to ___ what my town looked like long ago.|notice,suppose
    explore|explored,explores|to travel around a place to learn about it|探索|We used flashlights to ___ the dark cave.|The children wanted to ___ every corner of the old castle.|Astronauts ___ space to learn about other planets.|wonder,notice
    suppose|supposed,supposes|to think that something is probably true|猜想，认为|I ___ the bus is late because of the snow.|Since her umbrella is dripping, I ___ it is raining outside.|I ___ you are hungry after that long walk.|wonder,imagine
    puzzle|puzzled,puzzles|to confuse someone and make them think hard|使困惑|Riddles ___ me, but I love trying to solve them.|The strange tracks in the snow began to ___ the hunters.|Does this math problem ___ you too?|wonder,decide
    reason|reasons|why something happens or why someone does something|原因，理由|The ___ the road is wet is that it rained last night.|Give one ___ why you like your favorite book.|What was the ___ for building the wall?|wisdom,effort
    decide|decided,decides|to make up your mind about something|决定|I cannot ___ whether to have pizza or pasta.|Let us flip a coin to ___ who goes first.|You must ___ which book you want to borrow.|suppose,wonder
    wisdom|-|good sense and knowledge that come from experience|智慧|The old owl was known for its ___.|My grandmother has the ___ to give good advice.|People traveled far to hear the ___ of the teacher.|reason,respect
    respect|respected,respects|to think highly of someone and treat them well|尊重|We should ___ our elders and listen to them.|The players ___ their coach because she is fair.|I ___ people who tell the truth even when it is hard.|notice,decide
  `,
  notes: `
    wonder|asking curiously why the sky is blue|asking yourself what lies at the bottom of the sea|children asking curiously who left the box on the step|wonder asks a curious question; suppose makes a likely guess|wonder 是带着好奇追问；suppose 是推测某事多半如此|suppose means making a likely guess, not asking an open question you want answered|suppose 指做出八成如此的推测，不是好奇发问|imagine means picturing something in your mind, not asking yourself a question you want answered|imagine 是在脑海里勾勒画面，不是提出想知道答案的问题|won · der|o saying short u (not wander with a)|发短 u 音的 o（别写成 wander）
    notice|spotting that the autumn leaves are turning red|finally seeing a cat on the roof after it meowed|good scientists spotting small real changes|notice spots real details right in front of you; imagine makes up a picture inside your mind|notice 是留意眼前真实细节；imagine 是在脑中想象|imagine pictures something inside your head rather than seeing or becoming aware of something real|imagine 是在脑中构想画面，不是亲眼看到或察觉真实细节|wonder means asking a curious question, not seeing or becoming aware of something|wonder 是心里发问好奇，不是察觉眼前真实存在的事物|no · tice|soft c (/s/) before silent e|结尾 e 前读 /s/ 的 c
    imagine|closing your eyes to picture flying over clouds|picturing what life without electricity would be like|picturing what a town looked like long ago|imagine creates a mental picture; notice spots something physically present|imagine 是在脑海里构想画面；notice 是看到眼前的实物|notice means seeing something real right in front of you, not making a picture inside your mind|notice 是留意眼前真实存在的东西，不是在脑中想象画面|suppose means guessing something is probably true, not making a picture in your mind|suppose 是推测某事大概如此，不是在脑中描绘画面|im · ag · ine|single m and soft g before i|单个 m 和 i 前读 /dʒ/ 的 g
    explore|using flashlights to travel through a dark cave|wandering every corner of an old castle to learn about it|astronauts traveling through space to study other planets|explore physically travels around a place to discover it; wonder only asks questions in your head|explore 是实地四处探索；wonder 只是在心里好奇发问|wonder stays in your thoughts asking questions instead of traveling around a place to learn about it|wonder 只停留在脑中好奇，不是四处探访去了解一个地方|notice means spotting a detail, not traveling around a place to learn about it|notice 只是留意到某个细节，不是四处探索去了解一个地方|ex · plore|pl blend and -ore with silent e|pl 连缀和带 e 的 -ore
    suppose|guessing that the bus is probably late from snow|guessing from a dripping umbrella that it is raining outside|guessing that someone is probably hungry after a long walk|suppose thinks something is probably true; wonder asks an open curious question|suppose 是推测八成如此；wonder 是好奇追问|wonder asks an open curious question rather than thinking something is probably true|wonder 是提出疑问，不是推测某事大概如此|imagine makes a picture in your mind rather than thinking something is probably true|imagine 侧重在脑中浮现画面，不像 suppose 那样推测某事多半是真的|sup · pose|double p and silent e making long o|双写 p 和让 o 读长音的 e
    puzzle|riddles making you stop and think hard|strange snow tracks confusing the hunters|a tricky math problem confusing a student|puzzle confuses someone and makes them think hard; wonder is feeling curious yourself|puzzle 是“使某人困惑”；wonder 是自己感到好奇|wonder is what a person feels on their own, not a verb meaning to confuse someone|wonder 是人自己感到好奇，不能表示“使某人困惑”|decide means making up your mind, the opposite of confusing someone and making them think hard|decide 是拿定主意，与让人百思不得其解正相反|puz · zle|double z and -le ending|双写 z 和结尾 -le
    reason|the explanation for why the road is wet|a cause explaining why you love a favorite book|the explanation for why a wall was built|reason explains why something happens; wisdom is deep good judgment from experience|reason 是某件事的具体原因；wisdom 是阅历积淀的智慧|wisdom is deep good sense from experience, not the explanation for why something happens|wisdom 是人生阅历带来的智慧，不是解释某事为何发生的原因|effort is hard work put into a task, not the explanation for why something happens|effort 是付出的努力，不是回答“为什么”的原因理由|rea · son|ea saying long e and s saying /z/|发长 e 音的 ea 和读 /z/ 的 s
    decide|choosing between pizza and pasta|flipping a coin to settle who goes first|making up your mind which book to borrow|decide settles on a clear choice; suppose only makes a rough guess|decide 是拍板定下选择；suppose 只是大概猜想|suppose only thinks something is probably true instead of making up your mind|suppose 只是猜想可能如此，并没有拿定主意做出选择|wonder stays curious without making up your mind about a choice|wonder 停留在好奇发问，并没有拿定主意|de · cide|soft c (/s/) and silent e making long i|读 /s/ 的 c 和让 i 读长音的 e
    wisdom|the deep good sense an old owl is famous for|a grandmother's experience that gives good advice|the deep knowledge people travel far to hear from a teacher|wisdom is good judgment earned through experience; reason is a single cause for an event|wisdom 是阅历带来的智慧；reason 是单件事的理由|reason explains why one thing happened, not good sense and knowledge from experience|reason 只解释某事为何发生，不是经验积淀的深厚智慧|respect is the verb for honoring someone, not good sense and knowledge from experience|respect 是“尊重”这个动作，不是经验带来的智慧|wis · dom|wis- (not wise) plus -dom|wis-（不带 e）加后缀 -dom
    respect|honoring elders and listening to them|thinking highly of a fair coach|admiring people who tell the truth even when it is hard|respect treats someone with honor and care; notice only means spotting them|respect 是敬重并善待他人；notice 只是注意到某人|notice simply means seeing someone or something, without thinking highly of them and treating them well|notice 只是看见或察觉，不含敬重善待他人的意思|decide means making a choice, not thinking highly of someone and treating them well|decide 是做决定，不是敬重并善待他人|re · spect|sp blend and ct at the end|中间的 sp 和结尾的 ct
  `,
};

const forces: Grade3Batch = {
  id: "words-of-forces-and-motion",
  title: t("Words of Forces and Motion", "力与运动的词汇"),
  summary: t(
    "Ten words for how things move: force, friction, motion, speed, direction, slope, ramp and more.",
    "十个描述物体运动的词：force、friction、motion、speed、direction、slope、ramp 等。",
  ),
  intro: t(
    "Rub your palms together fast on a chilly morning—the warmth you feel comes from **friction**! Science uses exact words to explain every push, pull, slide, and stop.",
    "寒冷的早晨，把双手用力搓一搓，掌心很快热起来——这就是摩擦力（**friction**）在起作用。科学里，推、拉、滑、停各有精准的名称。",
  ),
  watchOut: {
    meanings: t(
      "Tell **speed** (how fast something moves) apart from **direction** (which way it heads).",
      "分清 **speed**（跑得多快）和 **direction**（朝哪个方向走）。",
    ),
    use: t(
      "A **slope** is any tilted ground or hill, while a **ramp** is a flat board or path built to roll things up and down.",
      "**slope** 泛指自然斜坡，**ramp** 特指搭起来推运物品或供轮椅上下的坡道。",
    ),
    spelling: t(
      "Watch **weight** (*ei* says long *a*, silent *gh*) and **friction** (*-tion* says /ʃən/).",
      "注意 **weight** 里读长 *a* 的 **ei** 与不发音的 **gh**，以及 **friction** 结尾的 **-tion**。",
    ),
  },
  domain: ["forces and how things move", "力和物体的运动"],
  lines: `
    force|forces|a push or a pull|力|It takes a big ___ to push a heavy box across the floor.|Kicking a ball gives it a ___ that sends it flying.|Gravity is the ___ that pulls things down to the ground.|friction,weight
    friction|-|a force that slows things down when two surfaces rub together|摩擦力|The rough carpet makes ___ that slows the toy car.|There is less ___ on smooth ice, so we slide.|Rub your hands together, and ___ makes them warm.|force,weight
    motion|-|the act of moving|运动，移动|The ball stayed in ___ until it hit the wall.|A push puts a swing in ___.|Everything on the busy street was in ___.|speed,direction
    speed|-|how fast something moves|速度|The car's ___ was very high on the steep hill.|A cheetah can run at great ___.|The wind's ___ grew stronger before the storm.|direction,motion
    direction|directions|the way something moves or points|方向|The wind changed ___ and blew from the north.|Push the cart in the ___ of the door.|The ball rolled in the ___ of the slope.|speed,position
    balanced|-|equal on both sides, so nothing moves|平衡的|When two teams pull a rope equally hard, the forces are ___.|The seesaw stayed still because it was ___.|The book on the table does not move because the forces on it are ___.|invisible,crisp
    weight|-|how heavy something is|重量|The ___ of the bag made my arms tired.|A scale shows the ___ of the apples.|The bridge can hold the ___ of ten trucks.|force,friction
    slope|slopes|a surface that is higher at one end than the other|斜坡|The sled raced down the snowy ___.|The mountain goats climbed steadily up the steep rocky ___.|We pushed our bikes up the gentle ___.|ramp,direction
    ramp|ramps|a flat surface that goes up or down, used to move things between levels|坡道|The movers rolled the piano up a ___ into the truck.|We built a ___ from a board and some books to race toy cars.|A wheelchair can go up the ___ at the side of the building.|slope,position
    position|positions|the place where something is|位置|Mark the car's starting ___ with tape.|Move the magnet to a new ___ and see what happens.|After the ball rolled, its ___ was two meters from the start.|direction,motion
  `,
  notes: `
    force|a big push moving a heavy box across the floor|a kick that sends a ball flying|gravity pulling everything down to the ground|force is any push or pull; friction is specifically the rubbing force that slows motion|force 泛指任何推力或拉力；friction 特指摩擦阻力|friction only slows rubbing surfaces down, not any general push or pull|friction 只是表面摩擦时的阻力，不是泛指的推力或拉力|weight is how heavy something is, not a push or a pull|weight 指物体有多重，不是推力或拉力|force|or + soft c (/s/) before silent e|or 加在 e 前读 /s/ 的 c
    friction|rubbing on a rough carpet that slows a toy car|very little rubbing resistance on smooth ice so we slide|rubbing hands together to make them warm|friction comes from two surfaces rubbing together; force is any push or pull|friction 是两表面摩擦产生的阻力；force 泛指所有推拉力|force is any general push or pull, without specifically naming the slowing force when surfaces rub|force 泛指推力拉力，不特指两表面摩擦产生的阻力|weight measures how heavy something is, not the rubbing force between two surfaces|weight 表示轻重，不是表面摩擦产生的力|fric · tion|fr blend and -tion spelling /ʃən/|fr 连缀和发 /ʃən/ 音的 -tion
    motion|a ball continuing to move until it hits a wall|a swing starting to move after a push|everything on a busy street moving around|motion is the act of moving itself; speed is only how fast it goes|motion 是运动、移动本身；speed 只衡量快慢|speed measures how fast something moves, not the act of moving itself|speed 只表示快慢，不表示“移动”这件事本身|direction tells which way something points or moves, not the act of moving itself|direction 指朝哪个方向，不表示物体正在移动|mo · tion|long o in mo and -tion ending|mo 里的长 o 和结尾 -tion
    speed|how fast a car races on a steep hill|how fast a cheetah can run|how fast the wind blows before a storm|speed measures how fast something moves; direction tells which way it goes|speed 衡量快慢；direction 说明朝向|direction tells which way something goes, not how fast it moves|direction 说的是方向，不是移动得有多快|motion simply means the act of moving, without measuring how fast it is|motion 只说在动，不衡量速度是快还是慢|speed|sp blend and double e|sp 连缀和双写 e
    direction|the compass way the wind blows from the north|the way toward the door to push a cart|the way toward the slope where a ball rolls|direction is the way something points or moves; speed is how fast it goes|direction 是移动或指向的方向；speed 是速度快慢|speed tells how fast something moves, not which way it moves or points|speed 讲快慢，不说明朝向哪个方向|position is the place where something sits, not the way something moves or points|position 指停在哪个位置，不是朝哪个方向行进|di · rec · tion|single r and -tion ending|单个 r 和结尾 -tion
    balanced|two teams pulling a rope equally hard so nothing shifts|a seesaw staying completely still|a book resting motionless under equal forces|balanced means equal on both sides so nothing moves; invisible means unable to be seen|balanced 是两边相等、纹丝不动；invisible 是看不见|invisible means impossible to see, not equal on both sides so nothing moves|invisible 指肉眼看不见，不是受力相等保持静止|crisp means cool and fresh or crunchy, not equal in opposing forces|crisp 指清凉或酥脆，不是两边受力平衡|bal · anced|single l and soft c (/s/) before -ed|单个 l 和 -ed 前读 /s/ 的 c
    weight|the heaviness of a bag tiring your arms|the heaviness of apples shown on a scale|the heavy load of ten trucks that a bridge holds|weight measures how heavy something is; force is any push or pull|weight 是物体的重量；force 是推力或拉力|force is a push or a pull, not how heavy something is|force 是推或拉的作用，不是物体的轻重重量|friction is the rubbing force between surfaces, not how heavy something is|friction 是表面摩擦力，不是物体的重量|weight|ei saying long a and silent gh|发长 a 音的 ei 和不发音的 gh
    slope|a snowy hillside a sled races down|a steep rocky mountainside goats climb up|a gentle uphill surface for pushing bikes|slope is any tilted ground or hillside; ramp is a flat board or path built between levels|slope 泛指自然斜坡；ramp 特指人工搭建的坡道|ramp is a flat surface built to move things between levels, not any natural tilted ground|ramp 是人工搭的坡道，不是自然倾斜的坡面|direction is which way something moves, not a surface higher at one end than the other|direction 是方向，不是一端高一端低的斜坡|slope|sl blend and silent e making long o|sl 连缀和让 o 读长音的 e
    ramp|a slanted path movers roll a piano up into a truck|a flat board propped on books for racing toy cars|a built slanted path letting a wheelchair enter a building|ramp is a built slanted path between two levels; slope is any natural tilted ground|ramp 是人工搭建的坡道；slope 泛指自然倾斜坡面|slope is any tilted ground or hillside, not specifically a flat path built to move things between levels|slope 多指自然斜坡，不像 ramp 特指连接高低两层的平直坡道|position is a single spot, not a built flat surface connecting two levels|position 是单个位置，不是连接高低两层的坡道|ramp|short a followed by mp blend|短音 a 加结尾 mp
    position|a car's starting spot marked with tape|a new spot where you place a magnet|the spot two meters from the start where a ball stops|position is the exact place where an object sits; direction is which way it moves|position 是物体所在的位置；direction 是运动的方向|direction tells which way something moves or points, not the exact place where it is|direction 讲朝向，不是物体所在的具体位置|motion is the act of moving, not the fixed place where something is|motion 是移动过程，不是物体停放的具体位置|po · si · tion|s saying /z/ and -tion ending|读 /z/ 的 s 和结尾 -tion
  `,
};

const magnets: Grade3Batch = {
  id: "words-of-magnets",
  title: t("Words of Magnets", "磁铁的词汇"),
  summary: t(
    "Ten words of magnets and what they do: magnet, attract, repel, pole, iron, steel, field, static and more.",
    "十个关于磁铁的词：magnet、attract、repel、pole、iron、steel、field、static 等。",
  ),
  intro: t(
    "Try pushing two north ends of bar magnets together—an **invisible** force shoves your hands apart! They **repel** each other. Magnet experiments make these ten science words easy to see and feel.",
    "把两块条形磁铁的北极凑到一起，一股看不见（**invisible**）的劲儿会把你的手推开——它们在互相排斥（**repel**）。亲手做过磁铁实验，这十个词一下就能记住。",
  ),
  watchOut: {
    meanings: t(
      "Do not swap **attract** (pull together) and **repel** (push apart)—opposite poles attract, while matching poles repel.",
      "别把 **attract**（相吸）和 **repel**（相斥）搞反——异极相吸，同极相斥。",
    ),
    use: t(
      "Tell **pole** (the two ends of the magnet) apart from **field** (the whole invisible space around it where its pull works).",
      "分清 **pole**（磁铁两端的磁极）和 **field**（磁铁周围起作用的整个磁场空间）。",
    ),
    spelling: t(
      "Watch **field** (*i* before *e*), **attract** (double *t* + *ct*), and **iron** (*r* comes before *o*, even though it sounds like *i-urn*).",
      "注意 **field** 的 **ie**、**attract** 的双写 **t**，以及 **iron** 里 **r** 在 **o** 前面的拼写。",
    ),
  },
  domain: ["magnets", "磁铁"],
  lines: `
    magnet|magnets|a piece of metal that pulls iron and steel toward it|磁铁|The ___ picked up a pile of paper clips.|We stuck our drawing to the fridge with a ___.|A ___ has a north end and a south end.|iron,steel
    magnetic|-|able to be pulled by a magnet, or able to pull like one|有磁性的|Iron nails are ___, so the magnet pulls them.|Wood is not ___, so the magnet does nothing to it.|The fridge door is ___, so magnets stick to it.|static,invisible
    attract|attracted,attracts|to pull something toward itself|吸引|A magnet will ___ an iron nail.|Opposite poles of two magnets ___ each other.|Flowers ___ bees with their bright colors.|repel,observe
    repel|repels|to push something away|排斥|Two north poles of magnets ___ each other.|If you turn one magnet around, they will ___ instead of stick.|These two magnets ___, so I cannot push them together.|attract,recite
    pole|poles|one of the two ends of a magnet, where its pull is strongest|磁极|The magnet's pull is strongest at each ___, its two ends.|The paper clips gathered at each ___ of the magnet.|Paint the north ___ of the magnet red and the south end blue.|field,magnet
    iron|-|a strong gray metal that magnets attract|铁|The blacksmith heated gray ___ in the furnace to hammer out horseshoes.|The old gate was made of ___ and had turned rusty.|Unlike copper, raw gray ___ rusts in the rain and is pulled by magnets.|magnet,pole
    steel|-|a very strong metal made mostly from iron|钢|Cars and bridges are made of ___.|The shiny stainless ___ spoon stuck to the magnet without rusting.|A ___ beam holds up the roof of the building.|magnet,field
    field|fields|the space around a magnet where you can feel its push or pull|磁场|The magnet's ___ is strongest close to its ends.|Iron dust lines up in the ___ around a magnet.|You cannot see a magnet's ___, but you can see what it does.|pole,static
    static|-|electricity that builds up when things rub together|静电|After I rubbed the balloon on my hair, ___ made it stick to the wall.|When I took off my wool hat, ___ made my hair stand up.|You can hear the crackle of ___ when you pull off a sweater.|magnetic,field
    invisible|-|not able to be seen|看不见的|Air is ___, but you can feel it when the wind blows.|The pull of a magnet is ___.|The spy wrote a message in ___ ink.|magnetic,balanced
  `,
  notes: `
    magnet|a pulling metal piece that picks up paper clips|a small pulling piece holding a drawing on the fridge|an object with a north end and a south end|magnet is the object that pulls iron and steel; iron is a metal that gets pulled|magnet 是主动吸铁的磁铁；iron 是被吸的铁金属|iron is a gray metal pulled by magnets, not the object that pulls iron and steel toward it|iron 是被磁铁吸住的铁，不是能主动吸铁的磁铁|steel is a strong metal made from iron, not a pulling piece of metal with two poles|steel 是由铁炼成的钢材，不是自带两极的磁铁|mag · net|g pronounced clearly and -net|清晰发音的 g 和结尾 -net
    magnetic|iron nails that a magnet can pull|wood that a magnet does nothing to|a fridge door that magnets stick to|magnetic describes materials that respond to magnets; static is electricity from rubbing|magnetic 指能被磁铁吸引的有磁性特征；static 是摩擦产生的静电|static is electricity built up by rubbing, not the ability to be pulled by a magnet|static 是摩擦产生的静电，不是能被磁铁吸引的有磁性特征|invisible means unable to be seen, not able to be pulled by a magnet|invisible 是“看不见的”，不是“有磁性的”|mag · net · ic|magnet + -ic ending|magnet 加形容词后缀 -ic
    attract|a magnet pulling an iron nail toward itself|opposite magnet poles pulling each other together|bright flowers drawing bees toward them|attract pulls something closer; repel pushes it away|attract 是拉近吸引；repel 是推开排斥|repel pushes things away, the exact opposite of pulling something toward itself|repel 是往外推开，与拉近吸引正相反|observe means watching carefully to learn, not pulling a nail, magnet, or bee closer|observe 是仔细观察，不是把铁钉、磁铁或蜜蜂吸过来|at · tract|double t and ending ct|双写 t 和结尾 ct
    repel|two north magnet poles pushing each other apart|turning a magnet around so it pushes instead of sticking|two magnets pushing apart so you cannot press them together|repel pushes away; attract pulls together|repel 是推开排斥；attract 是拉近吸引|attract pulls things together, the exact opposite of pushing something away|attract 是互相吸引，与推开排斥正相反|recite means saying a poem aloud from memory, not pushing magnets apart|recite 是背诵诗文，不是把两块磁铁推开排斥|re · pel|single l at the end|结尾单个 l
    pole|one of the two ends where a magnet's pull is strongest|either end of a magnet where paper clips cluster|the north end painted red opposite the blue south end|pole is one tip or end of a magnet; field is the whole invisible space around it|pole 是磁铁两端的磁极；field 是磁铁周围整片磁场|field is the whole invisible space around a magnet, not one of its two solid ends|field 是磁铁周围看不见的整片空间，不是磁铁的两端实体|magnet is the entire piece of metal, not specifically one of its two ends|magnet 指整块磁铁，不是单指它的两端磁极|pole|silent e making long o|词尾不发音的 e 让 o 读长音
    iron|raw gray metal heated by a blacksmith for horseshoes|an old metal gate that has turned rusty|raw gray metal that rusts in rain and is pulled by magnets|iron is a gray metal pulled by magnets; magnet is the object that does the pulling|iron 是被磁铁吸引的灰色金属铁；magnet 是主动吸铁的磁铁|magnet is the object that pulls iron and steel toward it, not the raw gray metal itself|magnet 是主动吸铁的磁铁，不是原材料金属铁|pole is one of the two ends of a magnet, not a strong gray metal|pole 是磁铁两端的磁极，不是灰色的金属铁|i · ron|r before o even though it sounds like i-urn|拼作 iron（r 在 o 前，虽然读起来像 i-urn）
    steel|the very strong metal used to build cars and bridges|a shiny stainless metal spoon that does not rust|a strong metal beam holding up a building's roof|steel is a very strong building metal made from iron; magnet is the object that pulls it|steel 是由铁炼成的坚硬钢材；magnet 是吸铁的磁铁|magnet is the pulling piece of metal with two poles, not the very strong building metal made from iron|magnet 是自带两极的磁铁，不是由铁炼成的坚硬钢材|field is the invisible space around a magnet, not a solid strong metal made from iron|field 是磁铁周围看不见的磁场空间，不是坚硬的金属钢材|steel|ee spelling long e (not steal)|发长 e 音的 ee（不是偷盗 steal）
    field|the invisible pull zone strongest near a magnet's ends|the space around a magnet where iron dust lines up|the invisible space around a magnet whose effects you can see|field is the whole invisible zone around a magnet; pole is just one end of the magnet|field 是磁铁周围整片磁场空间；pole 只是磁铁的一个端点|pole is just one solid end of a magnet, not the whole space around it|pole 只是磁铁的一个实体端点，不是磁铁周围的整片空间|static is electricity from rubbing, not the space around a magnet where its pull works|static 是摩擦起的静电，不是磁铁周围的磁场|field|ie spelling long e before ld|ld 前发长 e 音的 ie
    static|electricity from rubbing a balloon on hair so it sticks to a wall|electricity making hair stand up under a wool hat|crackling electricity heard when pulling off a sweater|static builds up from rubbing; magnetic comes from magnets|static 是摩擦产生的静电；magnetic 来自磁铁|magnetic describes a magnet's pull on iron or steel, not electricity built up by rubbing|magnetic 指磁铁吸铁，不是物体摩擦产生的静电|field is the space around a magnet, not electricity that builds up when things rub together|field 是磁铁周围的磁场，不是摩擦产生的静电|stat · ic|st blend and -ic ending|开头的 st 和结尾 -ic
    invisible|air that cannot be seen even though you feel the wind|a magnet's pull that you cannot see with your eyes|secret spy ink that cannot be seen on the page|invisible means unable to be seen; magnetic means pulled by a magnet|invisible 是“看不见的”；magnetic 是“有磁性的”|magnetic means able to be pulled by a magnet, not unable to be seen|magnetic 指有磁性，不是“看不见的”|balanced means equal on both sides so nothing moves, not impossible to see|balanced 指两边受力平衡，不是肉眼看不见|in · vis · i · ble|in- + vis + -ible (not -able)|in- 加 vis 加 -ible（不是 -able）
  `,
};

const explaining: Grade3Batch = {
  id: "words-for-explaining-how",
  title: t("Words for Explaining How", "解释原理的词"),
  summary: t(
    "Ten words for explaining how things work: depend, connect, contain, combine, prevent, release, observe and more.",
    "十个用来解释事物原理的词：depend、connect、contain、combine、prevent、release、observe 等。",
  ),
  intro: t(
    "Mix yellow paint and blue paint in a cup and green appears—you **combine** them. Then use a magnet to pull iron nails out of dry sand—you **separate** them. These ten verbs let you explain how anything works.",
    "把黄颜料和蓝颜料倒进杯子搅一搅，绿色就出来了——这叫混合（**combine**）；再用磁铁把铁钉从沙子里吸出来——这叫分开（**separate**）。讲清事物原理，全靠这十个动词。",
  ),
  watchOut: {
    meanings: t(
      "Tell **combine** (mix into one) apart from **separate** (pull things apart into different groups).",
      "分清 **combine**（合并混合）和 **separate**（分离开来）。",
    ),
    use: t(
      "**Prevent** stops something from happening, while **allow** lets it happen—check whether the lid or gate is blocking or opening the way.",
      "**prevent** 是阻止发生，**allow** 是允许放行——看句中是拦住还是打开通道。",
    ),
    spelling: t(
      "Watch **separate** (has *a-r-a* in the middle, not *e-r-a*) and **connect** (double *n* + *ct*).",
      "注意 **separate** 中间是 **a-r-a**（不是 *e-r-a*），以及 **connect** 的双写 **n**。",
    ),
  },
  domain: ["explaining how things work", "解释事物的原理"],
  lines: `
    depend|depended,depends|to need something in order to work or happen|依靠，取决于|Plants ___ on sunlight to make their food.|Whether we play outside will ___ on the weather.|Baby birds ___ on their parents for food.|contain,allow
    connect|connected,connects|to join two things together|连接|If you ___ the wire to the battery, the bulb lights up.|A bridge will ___ the two sides of the river.|Use tape to ___ the two pieces of the track.|combine,separate
    contain|contained,contains|to have something inside|包含，容纳|This box will ___ all of our toys.|Oranges ___ a lot of juice.|Rain clouds ___ tiny drops of water.|combine,depend
    combine|combined,combines|to mix or join things together into one|结合，混合|We ___ flour, eggs and milk to make pancake batter.|When you ___ blue and yellow paint, you get green.|The two classes will ___ for the school play.|connect,separate
    separate|separated,separates|to move things apart from each other|分开|Use a magnet to ___ the nails from the sand.|A fence will ___ the sheep from the goats.|Always ___ the white clothes from the dark ones before washing.|combine,connect
    prevent|prevented,prevents|to stop something from happening|防止，阻止|A helmet can ___ injuries when you fall off a bike.|Brushing your teeth helps ___ holes in them.|Put a lid on the pot to ___ the soup from spilling.|allow,release
    allow|allowed,allows|to let something happen|允许|Our teacher will ___ us to play outside if it is sunny.|The gate is open to ___ the cows into the field.|Big windows ___ more light into the room.|prevent,release
    release|released,releases|to let something go free|释放，放开|If you ___ the balloon, it will float up into the sky.|The zookeepers will ___ the healed bird back into the wild.|When you ___ the spring, the toy jumps.|allow,prevent
    pattern|patterns|something that happens again and again in the same way|规律，模式|Day and night follow a ___ that never changes.|Do you see the ___ in these numbers: 2, 4, 6, 8?|The stripes on a zebra make a black-and-white ___.|reason,effort
    observe|observed,observes|to watch something carefully to learn about it|观察|Scientists ___ the birds to learn how they build nests.|Sit quietly and ___ the ice cube as it melts.|We will ___ the moon every night for a month.|depend,recite
  `,
  notes: `
    depend|plants needing sunlight to make food|playing outside being decided by the weather|baby birds relying on their parents for food|depend means needing something in order to work; contain means holding something inside|depend 是依靠、取决于；contain 是内部装有|contain means having something inside, not needing something in order to work or happen|contain 指内部装着某物，不是依靠或取决于某事|allow means letting something happen, not needing something in order to work or happen|allow 是允许放行，不是需要或取决于某事|de · pend|de- + pend ending in nd|de- 加以 nd 结尾的 pend
    connect|joining a wire to a battery so a bulb lights|a bridge linking two sides of a river|using tape to join two pieces of track|connect links two separate items together; combine mixes them into one|connect 是把两件东西接起来；combine 是混合融为一体|combine mixes things into one new whole, rather than joining two separate things together|combine 是把东西混成一体，不是把两个独立部分连接起来|separate pulls things apart, the exact opposite of joining two things together|separate 是把东西分开，与连接起来正相反|con · nect|double n and ct at the end|双写 n 和结尾 ct
    contain|a box holding all our toys inside|oranges holding lots of juice inside|rain clouds holding tiny drops of water inside|contain means having something inside; combine means mixing separate things into one|contain 是里面装有；combine 是把东西混成一体|combine mixes separate things into one, rather than simply having something inside|combine 是把多种东西混合起来，不是内部装有某物|depend means needing something in order to work, not having something inside|depend 是依靠取决于，不是内部包含容纳|con · tain|ai spelling long a before n|n 前发长 a 音的 ai
    combine|mixing flour, eggs, and milk into pancake batter|mixing blue and yellow paint to make green|two classes joining together into one group for a play|combine blends things into one; connect only links two ends together|combine 是混合合并为一；connect 只是把两头接上|connect links two separate things at a point, rather than mixing or joining them into one|connect 只是把两处接通，不是混合合并为一个整体|separate moves things apart, the exact opposite of mixing or joining them into one|separate 是拆开分开，与合并混合正相反|com · bine|silent e making long i in bine|词尾 e 让 bine 里的 i 读长音
    separate|using a magnet to pull nails out of sand|a fence keeping sheep apart from goats|sorting white clothes away from dark clothes|separate moves things apart; combine mixes them into one|separate 是分离开来；combine 是混合合并|combine mixes or joins things into one, the exact opposite of moving them apart|combine 是合二为一，与分离开来正相反|connect fastens two things together, the exact opposite of moving them apart|connect 是连接起来，与分开隔开正相反|sep · a · rate|a-r-a in the middle (not sep-er-ate)|中间是 a-r-a（别写成 sep-er-ate）
    prevent|a helmet stopping injuries in a bike fall|brushing teeth to stop cavities from forming|a pot lid stopping soup from spilling|prevent stops something unwanted from happening; allow lets it happen|prevent 是防止阻止；allow 是允许放行|allow lets something happen, the exact opposite of stopping it from happening|allow 是任其发生，与防止阻止正相反|release lets something go free, not stopping something unwanted from happening|release 是放开释放，不是阻止坏事发生|pre · vent|pre- + vent ending in nt|pre- 加以 nt 结尾的 vent
    allow|a teacher letting students play outside on a sunny day|an open gate letting cows walk into the field|big windows letting more sunlight into a room|allow lets something happen; prevent blocks it|allow 是允许放行；prevent 是阻拦阻止|prevent stops something from happening, the exact opposite of letting it happen|prevent 是阻止发生，与允许放行正相反|release physically lets go of something held or caged, rather than letting something happen|release 是松手放开被抓住的东西，不是允许某事发生|al · low|double l and ow saying /aʊ/|双写 l 和发 /aʊ/ 音的 ow
    release|letting go of a balloon so it floats skyward|freeing a healed bird back into the wild|letting go of a spring so a toy jumps|release lets something held or caged go free; allow simply lets something happen|release 是松手放开或放归自由；allow 只是允许发生|allow gives permission or lets something happen, rather than letting something held go free|allow 只是允许，不是松手放开被抓住或关住的东西|prevent stops something from happening, the exact opposite of letting something go free|prevent 是阻挡制止，与松手释放正相反|re · lease|ea spelling long e plus silent e after s|发长 e 音的 ea 和 s 后的不发音 e
    pattern|day and night repeating in the same unchanging order|numbers 2, 4, 6, 8 repeating by the same rule|black-and-white stripes repeating on a zebra|pattern is a repeating rule or design; reason is why something happens|pattern 是重复出现的规律或花纹；reason 是原因|reason explains why something happens, not a repeating order or stripe design|reason 是解释为什么的原因，不是反复出现的规律或条纹图案|effort is hard work put into a task, not a repeating rule or stripe design|effort 是付出的努力，不是重复出现的规律或花纹|pat · tern|double t and -ern ending|双写 t 和结尾 -ern
    observe|scientists watching birds carefully to learn how they nest|sitting quietly to watch an ice cube melt|watching the moon every night for a month|observe watches carefully to learn; depend relies on something|observe 是仔细观察；depend 是依靠取决于|depend means relying on something, not watching something carefully to learn about it|depend 是依靠取决于，不是仔细观察以了解事物|recite means saying a poem aloud from memory, not quietly watching birds, ice, or the moon|recite 是脱稿背诵诗文，不是静静观察鸟类、冰块或月亮|ob · serve|er saying /ɜːr/ plus silent e after v|发 /ɜːr/ 的 er 和 v 后的不发音 e
  `,
};

const music: Grade3Batch = {
  id: "words-of-music",
  title: t("Words of Music", "音乐的词汇"),
  summary: t(
    "Ten words of making music: rhythm, melody, tempo, pitch, orchestra, conductor, composer, harmony and more.",
    "十个关于音乐的词：rhythm、melody、tempo、pitch、orchestra、conductor、composer、harmony 等。",
  ),
  intro: t(
    "You cannot remember a single lyric of the song, yet you can still hum the tune on the way home—that tune is its **melody**. Talking about music gets much clearer when you know the words for beat, speed, and players.",
    "歌词一句也想不起来了，回家路上却还能把调子哼出来——那段调子就是旋律（**melody**）。聊音乐时，分清节奏、音高、速度和乐手分工，表达立刻专业得多。",
  ),
  watchOut: {
    meanings: t(
      "Tell **tempo** (how fast or slow the music goes) apart from **pitch** (how high or low a note sounds).",
      "分清 **tempo**（音乐快慢的速度）和 **pitch**（音调高低的音高）。",
    ),
    use: t(
      "A **composer** writes the music on paper, while a **conductor** stands in front of the orchestra waving a stick to lead the players.",
      "**composer** 负责谱曲写歌，**conductor** 负责站在乐队前挥棒指挥——别把两者弄混。",
    ),
    spelling: t(
      "Watch **rhythm** (no *a, e, i, o, u*—*rh* + *y* + *thm*) and **orchestra** (*ch* says /k/).",
      "注意 **rhythm** 里的 **rh**、**y** 和 **thm**（没有常规元音），以及 **orchestra** 里读 /k/ 的 **ch**。",
    ),
  },
  domain: ["music", "音乐"],
  lines: `
    rhythm|rhythms|the pattern of long and short sounds and beats in music|节奏|Clap your hands to the ___ of the song.|The drums kept a steady ___ for the dancers.|The drums tapped out a ___ of long and short beats.|melody,tempo
    melody|melodies|the tune of a song, the notes you can hum|旋律|I can hum the ___ but I cannot remember the words.|The violin played a sweet ___.|The ___ goes up and down like a bird flying.|rhythm,harmony
    tempo|-|how fast or slow music is played|速度，节拍快慢|The song starts slow, then the ___ speeds up.|A lullaby has a slow ___.|The conductor waved her arms faster to change the ___.|pitch,rhythm
    pitch|-|how high or low a sound is|音高|A tiny bird sings at a very high ___.|The tuba plays notes of a low ___.|When you tighten a guitar string, its ___ goes up.|tempo,melody
    orchestra|orchestras|a large group of musicians who play together, with many kinds of instruments|管弦乐队|The ___ had violins, flutes, drums and trumpets.|We went to hear the city ___ play on Saturday night.|More than eighty musicians play in the ___.|duet,percussion
    conductor|conductors|the person who leads a group of musicians by moving their hands or a stick|指挥|The ___ raised her stick, and the music began.|Every musician watched the ___ to know when to play.|The ___ stood in front of the musicians and waved a thin stick.|composer,orchestra
    composer|composers|a person who writes music|作曲家|Mozart was a ___ who wrote his first music at age five.|The ___ wrote a new song for the school's birthday.|A ___ writes notes on paper for musicians to play.|conductor,harmony
    harmony|harmonies|different notes sung or played together in a way that sounds good|和声，和谐|The choir sang in beautiful ___.|When my sister sings the high part and I sing the low part, we make ___.|Two singers sang the song in ___.|melody,rhythm
    percussion|-|instruments you hit or shake to make sound, such as drums|打击乐器|Drums, bells and maracas are ___ instruments.|Tom plays in the ___ section of the band.|The ___ players kept the beat with their drums.|orchestra,rhythm
    duet|duets|music for two people to play or sing together|二重奏，二重唱|My sister and I played a ___ on the piano.|The two friends sang a ___ at the talent show.|A ___ needs two singers or players.|orchestra,harmony
  `,
  notes: `
    rhythm|clapping hands along to a song's beat|drums keeping a steady beat for dancers|drums tapping out a pattern of long and short beats|rhythm is the pattern of long and short beats; melody is the tune you hum|rhythm 是长短拍子的节奏；melody 是哼唱的旋律|melody is the rising and falling tune you hum, not the pattern of long and short beats|melody 是高低起伏的曲调，不是长短拍子的节奏|tempo is only how fast or slow music goes, not the pattern of long and short beats|tempo 只指快慢速度，不指长短拍子的组合规律|rhy · thm|rh at the start, y for short i, and -thm|开头的 rh、发短 i 的 y 和结尾 -thm
    melody|a song's tune you can hum without remembering the words|a sweet tune played by a violin|notes going up and down like a flying bird|melody is the main single tune; rhythm is the beat pattern|melody 是能哼出的主旋律；rhythm 是拍子节奏|rhythm is the beat pattern you clap or tap, not the tune of a song you can hum|rhythm 是拍手打出的节奏，不是能哼出的曲调旋律|harmony is different notes sounding together at once, not one single tune you hum|harmony 是多声部同时交织的和声，不是单条主旋律|mel · o · dy|single l and -dy ending|单个 l 和结尾 -dy
    tempo|a song starting slow and then speeding up|the slow pace of a lullaby|a conductor waving faster to speed up the music|tempo is how fast or slow music moves; pitch is how high or low a sound is|tempo 管音乐快慢；pitch 管声音高低|pitch measures whether a sound is high or low, not how fast or slow music is played|pitch 指音调高低，不是音乐演奏的快慢速度|rhythm is the pattern of long and short beats, not how fast or slow music is played|rhythm 是长短拍子的组合，不是音乐演奏的快慢速度|tem · po|tem + po with long o at the end|tem 加结尾长音 po
    pitch|a tiny bird singing at a very high tone|a tuba playing deep, low notes|tightening a guitar string so its tone goes higher|pitch is how high or low a sound is; tempo is how fast or slow music goes|pitch 是音调高低；tempo 是演奏快慢|tempo measures how fast or slow music goes, not how high or low a sound is|tempo 衡量快慢，不是声音的高低音高|melody is a whole tune of many notes, not how high or low a sound is|melody 是整段曲调，不是声音的高低音高|pitch|silent t in -tch after short i|短音 i 后 -tch 里不发音的 t
    orchestra|a large ensemble with violins, flutes, drums, and trumpets|a city's full musical group performing on Saturday night|more than eighty musicians playing together|orchestra is a huge group of many instruments; duet is for just two people|orchestra 是大型管弦乐队；duet 只是二人合奏|duet is music for only two players or singers, not a large group of musicians with many instruments|duet 只有两个人，不是多种乐器齐奏的大型管弦乐队|percussion is only instruments you hit or shake, not a whole large group of musicians|percussion 只包含敲击类打击乐，不是整支管弦乐队|or · ches · tra|ch saying /k/ and tr blend|读 /k/ 的 ch 和结尾 tra
    conductor|the leader who raises a stick to start the music|the leader every musician watches to know when to play|the person waving a thin stick in front of the players|conductor leads players live with a stick; composer writes the notes on paper|conductor 是台前挥棒的指挥；composer 是写乐谱的作曲家|composer writes music on paper beforehand rather than leading musicians in front of them|composer 是在纸上谱曲的人，不是站在乐手前面带领演奏的指挥|orchestra is the whole group of musicians, not the single person who leads them|orchestra 是整支乐队，不是带领乐手的指挥本人|con · duc · tor|con + duc + -tor (not -ter)|con 加 duc 加 -tor（不是 -ter）
    composer|Mozart writing his first music at age five|a music writer creating a new school birthday song|a person who writes notes on paper for musicians to play|composer writes the music; conductor leads the musicians playing it|composer 负责谱曲写歌；conductor 负责挥棒指挥|conductor leads musicians during a performance, rather than writing the music|conductor 是现场挥棒指挥的人，不是谱写乐曲的作曲家|harmony is different notes sounding good together, not a person who writes music|harmony 是悦耳的多声部和声，不是谱曲的人|com · pos · er|s saying /z/ and -er ending|读 /z/ 的 s 和结尾 -er
    harmony|a choir blending different vocal parts beautifully|a high part and a low part sung together|two singers blending different notes at the same time|harmony blends different notes together at once; melody is a single tune|harmony 是多声部同时交织的和声；melody 是单条主旋律|melody is one single tune of notes, not different notes sung or played together|melody 是单条旋律线，不是不同声部同时唱奏的和声|rhythm is the beat pattern of long and short sounds, not different notes blending together|rhythm 是拍子节奏，不是多声部和谐交融|har · mo · ny|ar in har and -ny ending|har 里的 ar 和结尾 -ny
    percussion|drums, bells, and maracas you hit or shake|the drum-and-bell section of a band|players keeping the beat with drums|percussion is instruments you hit or shake; orchestra is the entire multi-family group|percussion 指敲打摇晃的打击乐器；orchestra 指包含弦管打击的整支乐队|orchestra is a whole large group of many instrument families, not specifically instruments you hit or shake|orchestra 包含弦乐、管乐等所有乐器，不特指敲打摇晃的打击乐|rhythm is the beat pattern itself, not the family of instruments you hit or shake|rhythm 是节奏本身，不是打击乐器这一类乐器|per · cus · sion|double s in -ssion saying /ʃən/|发 /ʃən/ 音的双写 s（-ssion）
    duet|two sisters playing a piano piece together|two friends singing together at a talent show|a musical piece requiring two players or singers|duet is music for two people; orchestra is a huge ensemble of dozens|duet 是二人二重奏/二重唱；orchestra 是大型管弦乐队|orchestra brings together dozens of musicians, far too many for a two-person piece|orchestra 有几十上百名乐手，不是两个人弹或唱的作品|harmony describes notes sounding good together in any group size, not a piece specifically for two people|harmony 可以是任意人数的和声，并不特指由两个人表演的曲目|du · et|u-e pronounced as two syllables (du-et)|分两个音节读的 u-e（du-et）
  `,
};

const instruments: Grade3Batch = {
  id: "words-of-instrument-families",
  title: t("Words of Instrument Families", "乐器家族的词汇"),
  summary: t(
    "Ten words of instruments and their families: string, brass, woodwind, violin, cello, flute, trumpet, harp and more.",
    "十个乐器及其家族的词：string、brass、woodwind、violin、cello、flute、trumpet、harp 等。",
  ),
  intro: t(
    "A **violin** tucks neatly under your chin, while a **cello** is so tall you sit down and rest it between your knees! Every orchestra instrument belongs to a family based on how it makes sound.",
    "小提琴（**violin**）能稳稳夹在下巴下，大提琴（**cello**）却大得只能坐着夹在双膝间拉。管弦乐队里的乐器，都按发声方式归入不同家族。",
  ),
  watchOut: {
    meanings: t(
      "Tell **brass** (metal horns you buzz your lips into, like trumpets) apart from **woodwind** (instruments blown across a hole or reed, like flutes).",
      "分清 **brass**（铜管乐器，如小号）和 **woodwind**（木管乐器，如吹孔或簧片发声的长笛）。",
    ),
    use: t(
      "A **violin** rests under the chin, whereas a **cello** sits between the knees and plays deeper notes.",
      "**violin** 夹在下巴下、音色高，**cello** 夹在两膝间、音色低沉浑厚——看演奏姿势和音高线索。",
    ),
    spelling: t(
      "Watch **cello** (*c* says /tʃ/, double *l*) and **xylophone** (starts with *x* saying /z/, *ph* says /f/).",
      "注意 **cello** 里读 /tʃ/ 的 **c** 与双写 **l**，以及 **xylophone** 开头读 /z/ 的 **x** 和读 /f/ 的 **ph**。",
    ),
  },
  domain: ["musical instruments", "乐器"],
  lines: `
    string|strings|a thin wire or cord on an instrument that makes sound when plucked or played with a bow|（乐器的）弦|Guitars and violins belong to the ___ family.|When you pluck a guitar ___, it shakes and makes a sound.|My violin has a broken ___, so I cannot play it today.|brass,woodwind
    brass|-|the family of metal instruments you blow into, such as trumpets|铜管乐器|The trumpet and the tuba are ___ instruments.|The ___ players puffed out their cheeks to play the loud march.|Shiny ___ instruments are made of metal.|woodwind,string
    woodwind|woodwinds|the family of instruments you blow into that use a small hole or a reed, such as the flute|木管乐器|The flute and the clarinet are ___ instruments.|The ___ section sits in front of the brass in the orchestra.|A ___ instrument makes sound when you blow air across a hole or a reed.|brass,string
    keyboard|keyboards|a row of keys that you press to play an instrument such as a piano|键盘（乐器）|A piano has a ___ of black and white keys.|I play songs on the ___ in my bedroom.|Press a key on the ___ to hear a note.|harp,xylophone
    violin|violins|a small wooden string instrument held under the chin and played with a bow|小提琴|She held the ___ under her chin and moved the bow.|The ___ is the smallest string instrument in the orchestra.|Grandpa tucked his ___ under his chin and began to play a jig.|cello,harp
    cello|cellos|a large string instrument that you play sitting down, with it between your knees|大提琴|The ___ is too big to hold under your chin, so you sit to play it.|The deep, warm notes of the bowed ___ filled the room.|She rested the ___ between her knees and drew the bow across it.|violin,harp
    flute|flutes|a long, thin woodwind instrument held sideways that you blow across|长笛|She blew across the hole of the silver ___ to play a high note.|The thin, silver ___ played a soft, high tune like a bird.|You hold a ___ sideways when you play it.|trumpet,violin
    trumpet|trumpets|a brass instrument with three buttons that makes a loud, bright sound|小号|The ___ played a loud call to wake the soldiers.|He pressed the three buttons of the ___ to change the notes.|A bright ___ blast began the parade.|flute,brass
    xylophone|xylophones|an instrument with wooden bars that you hit with small hammers|木琴|She hit the wooden bars of the ___ with two little hammers.|The ___ made a bright, plinking sound.|Each bar on the ___ plays a different note.|harp,keyboard
    harp|harps|a large instrument with many strings in a tall frame that you pluck with your fingers|竖琴|The ___ has more than forty strings in a tall frame.|Her fingers plucked the strings of the ___ gently.|She sat beside the tall ___ and plucked its strings.|violin,cello
  `,
  notes: `
    string|the plucked-or-bowed family that guitars and violins belong to|a thin guitar cord that vibrates when plucked|a broken wire on a violin|string vibrates when plucked or bowed; brass is metal horns you blow into|string 是拨拉发声的弦乐或琴弦；brass 是吹奏的铜管乐器|brass is a family of metal instruments you blow into, not a thin cord plucked or bowed|brass 是吹奏的金属铜管家族，不是拨动或拉弓发声的琴弦|woodwind uses blown air across a hole or reed, not a thin wire or cord that vibrates|woodwind 靠吹气过吹孔或簧片发声，不是振动的琴弦|string|str three-letter blend and ng ending|开头的 str 三字母连缀和结尾 ng
    brass|the metal horn family of trumpets and tubas|players puffing cheeks to blow a loud march|shiny metal instruments you blow into|brass is metal horns like trumpets; woodwind blows across a hole or reed like flutes|brass 是铜管乐器；woodwind 是木管乐器|woodwind instruments use a blowhole or reed, not metal horns buzzed with the lips|woodwind 靠吹孔或簧片发声，不是铜管金属号角|string instruments are plucked or bowed, not metal instruments you blow into|string 靠拨弦或拉弓发声，不是吹奏的金属管乐|brass|br blend and double s at the end|br 连缀和结尾双写 s
    woodwind|the blown family of flutes and clarinets|the orchestra section sitting right in front of the brass|instruments sounded by blowing across a hole or reed|woodwind blows across a hole or reed; brass is metal horns buzzed with the lips|woodwind 是木管乐器；brass 是铜管乐器|brass is the family of metal horns you blow into, not woodwinds using a hole or reed|brass 是铜管金属号角，不是靠吹孔或簧片发声的木管乐器|string uses plucked or bowed cords, not air blown across a hole or reed|string 靠琴弦振动发声，不是吹气过吹孔或簧片|wood · wind|compound wood (oo) + wind|合成词 wood（含 oo）加 wind
    keyboard|a piano's row of black and white keys|an electric key instrument played in a bedroom|a row of keys you press to hear notes|keyboard has keys you press down; harp has vertical strings you pluck|keyboard 是按琴键发声的键盘；harp 是拨弦竖琴|harp has strings in a tall frame that you pluck, not a row of keys you press|harp 是高大框架里用手拨的琴弦，不是按键发声的键盘|xylophone has wooden bars struck with small hammers, not a row of keys you press|xylophone 是用小槌敲击的木条，不是手指按下的琴键|key · board|key (ey) + board (oar)|key（含 ey）加 board（含 oar）
    violin|a small bowed instrument tucked under the chin|the smallest string instrument in the orchestra|a small chin-held fiddle playing a lively jig|violin is small and tucked under the chin; cello is huge and held between the knees|violin 小巧夹在下巴下；cello 高大夹在两膝间|cello is far too big for your chin and must be played sitting down between your knees|cello 体积庞大，根本夹不到下巴下，必须坐着夹在双膝间拉|harp stands tall beside you and is plucked with fingers rather than tucked under the chin with a bow|harp 高高立在身旁靠手指拨弦，不用琴弓也不会夹在下巴下|vi · o · lin|io pronounced as two syllables (vi-o)|分两音节读的 io（vi-o）
    cello|a huge string instrument played sitting down|a deep, warm-voiced bowed string instrument|a large string instrument rested between the knees with a bow|cello sits between the knees with deep notes; violin is small and rests under the chin|cello 坐着夹膝拉、音色低沉；violin 夹下巴拉、音色清亮|violin is small and held under the chin with higher notes, not a large deep instrument played sitting down|violin 小巧夹在下巴下、音色较高，不是坐着拉的低沉大提琴|harp is plucked with the fingers rather than played sitting down with a bow|harp 是用手拨弦的竖琴，不是坐着用弓拉奏的大提琴|cel · lo|c saying /tʃ/ and double l|开头读 /tʃ/ 的 c 和双写 l
    flute|a thin silver tube blown across a hole for high notes|a slender silver instrument playing a birdlike tune|a thin woodwind held sideways when played|flute is held sideways and blown across a hole; trumpet is a loud brass horn with three buttons|flute 横握吹孔、音色清脆；trumpet 按三键、声音嘹亮|trumpet is a loud brass horn with three buttons, not a thin woodwind held sideways|trumpet 是朝前吹、有三个按键的嘹亮铜管，不是横握吹奏的细长木管|violin is a wooden string instrument played with a bow, not a woodwind blown across sideways|violin 是用弓拉的木质弦乐器，不是横吹的长笛|flute|fl blend and silent e making long u|fl 连缀和让 u 读长音的 e
    trumpet|a loud brass horn playing a wake-up call for soldiers|a brass instrument with three buttons to change notes|a bright brass blast starting a parade|trumpet is a specific three-button brass horn; flute is a soft sideways woodwind|trumpet 是有三个按键的嘹亮小号；flute 是轻柔横吹的长笛|flute is a thin woodwind held sideways with a soft high tone, not a loud bright brass horn|flute 音色轻柔、横吹发声，不是嘹亮响亮的铜管小号|brass names the whole metal horn family, not one specific loud three-button instrument|brass 指整个铜管家族，不是单指小号这一件乐器|trum · pet|tr blend and -pet ending|开头的 tr 和结尾 -pet
    xylophone|wooden bars hit with two little hammers|an instrument making a bright, plinking sound|a row of wooden bars where each bar plays a note|xylophone has wooden bars struck with hammers; harp has strings plucked by fingers|xylophone 是用小槌敲的木条琴；harp 是手拨的竖琴|harp has plucked strings in a tall frame, not wooden bars hit with small hammers|harp 是高框拨弦乐器，不是用小槌敲打的木条|keyboard has keys you press down, not wooden bars struck with small hammers|keyboard 是手指按下的琴键，不是用小槌敲击的木条|xy · lo · phone|x saying /z/, y for long i, and ph for /f/|读 /z/ 的 x、长音 y 和读 /f/ 的 ph
    harp|a tall frame holding more than forty plucked strings|strings plucked gently with the fingers|a tall standing instrument you sit beside to pluck|harp has many plucked strings in a tall frame; violin is bowed under the chin|harp 是高框多弦手拨的竖琴；violin 是夹在下巴下用弓拉的小提琴|violin is small and bowed under the chin, not a tall frame of plucked strings|violin 小巧夹在下巴下用弓拉，不是高大框架的拨弦竖琴|cello is bowed between the knees, not a tall frame of many plucked strings|cello 夹在两膝间用弓拉奏，不是高框多弦手拨的竖琴|harp|ar spelling /ɑːr/ before p|p 前发 /ɑːr/ 音的 ar
  `,
};

const describingMusic: Grade3Batch = {
  id: "words-for-describing-music",
  title: t("Words for Describing Music", "描述音乐的词"),
  summary: t(
    "Ten words for how music sounds and feels: lively, graceful, mournful, booming, soothing, shrill, delicate and more.",
    "十个描述音乐声音和感觉的词：lively、graceful、mournful、booming、soothing、shrill、delicate 等。",
  ),
  intro: t(
    "A music box tinkles with **delicate** little notes, and then a giant bass drum shakes the floorboards with a **booming** crash. Exact sound adjectives let readers hear the music right off the page.",
    "音乐盒叮咚作响，淌出轻柔精致（**delicate**）的音符；紧接着一面大鼓轰鸣（**booming**）敲响，震得地板直抖。用对这些形容词，读者光看文字就能听见乐声。",
  ),
  watchOut: {
    meanings: t(
      "Tell **soothing** (soft and calming, helping you relax) apart from **shrill** (high, sharp, and piercing to the ears).",
      "分清 **soothing**（轻柔抚慰、让人放松）和 **shrill**（尖锐刺耳、让人捂耳朵）。",
    ),
    use: t(
      "**Booming** is loud and deep (like drums or thunder), while **delicate** is light and whisper-soft (like a harp or snowflake).",
      "**booming** 是低沉响亮（如大鼓、雷声），**delicate** 是轻柔纤细（如竖琴、雪花）——看声音大小和质感。",
    ),
    spelling: t(
      "Watch **mournful** (*our* says /ɔːr/, one *l* in *-ful*), **steady** (*ea* says short *e*), and **shrill** (*shr* + double *l*).",
      "注意 **mournful** 里的 **our** 与单个 **l** 的 **-ful**、**steady** 里读短 *e* 的 **ea**，以及 **shrill** 结尾的双写 **l**。",
    ),
  },
  domain: ["how music sounds and feels", "音乐的声音和感觉"],
  lines: `
    lively|-|full of energy and fun|活泼的，轻快的|The band played a ___ tune that made everyone dance.|The party music was fast and ___.|A ___ song is perfect for a sunny morning.|mournful,peaceful
    graceful|-|moving or sounding smooth and beautiful|优雅的|The ballerina's ___ turns flowed smoothly across the stage.|The swan glided across the lake in a ___ way.|The dancer's ___ steps matched the gentle music.|delicate,soothing
    mournful|-|very sad|悲伤的，哀伤的|The ___ song made my grandmother cry.|The ___ tune was so sad that everyone looked at the floor.|The wolf gave a long, ___ howl at the moon.|peaceful,soothing
    booming|-|very loud and deep|轰鸣的，低沉响亮的|The ___ drums shook the floor of the hall.|We heard the ___ voice of the giant from far away.|The ___ thunder made the windows rattle.|shrill,dramatic
    soothing|-|making you feel calm and relaxed|舒缓的，抚慰的|Mom sang a ___ song to help the baby sleep.|The soft sound of rain on the roof is ___ and helps me calm down and relax.|A warm bath and ___ music help me relax.|peaceful,delicate
    steady|-|staying the same, without stopping or changing|稳定的，平稳的|The drummer kept a ___ beat all through the song.|My heart beat in a slow, ___ rhythm.|The clock made a ___ tick-tock all night.|peaceful,dramatic
    dramatic|-|exciting and full of strong feeling|戏剧性的，激动人心的|The music grew loud and ___ as the hero raced to the castle.|There was a ___ crash of cymbals at the end.|The movie had ___ music during the chase.|lively,booming
    peaceful|-|quiet and calm|宁静的，平和的|The ___ valley lay completely quiet and still at dawn.|After the storm, the forest was ___ again.|We sat by the river on a ___ afternoon.|soothing,mournful
    shrill|-|very high and sharp in a way that hurts your ears|尖锐刺耳的|The ___ whistle made the dogs bark.|The baby let out a ___ cry.|A ___ alarm rang through the school.|booming,dramatic
    delicate|-|light, soft and easily broken|轻柔的，精致的|The harp played a ___ tune that was almost a whisper.|A ___ snowflake melted on my glove.|The ___ notes of the music box tinkled softly.|graceful,soothing
  `,
  notes: `
    lively|a bright tune that makes everyone dance|fast, energetic party music|a cheerful song for a sunny morning|lively is bright and full of energy; mournful is heavy and sad|lively 欢快有活力；mournful 悲伤沉重|mournful means very sad, the exact opposite of being full of energy and fun|mournful 是悲伤哀痛的，与充满活力的欢快正相反|peaceful means quiet and calm, not fast and full of energy and fun|peaceful 是安静平和的，没有充满活力的轻快劲儿|live · ly|keep the e in live before -ly|live 保留不发音的 e 再加 -ly
    graceful|a ballerina's smooth turns flowing across the stage|a swan gliding smoothly across a lake|a dancer's smooth, beautiful steps|graceful describes smooth, lovely motion or flow; delicate stresses fragility and lightness|graceful 强调优美流畅的姿态与线条；delicate 强调轻柔易碎|delicate means light, soft, and easily broken, not moving or sounding smooth and beautiful|delicate 强调轻柔易碎，不是形容优美流畅的姿态|soothing means calming someone down, not moving or sounding smooth and beautiful|soothing 强调安抚助眠，不是形容优雅流畅|grace · ful|soft c (/s/) before e and single l in -ful|e 前读 /s/ 的 c，以及单个 l 的 -ful
    mournful|a sad song making grandmother cry|a sorrowful tune making everyone look at the floor|a wolf's long, sad howl at the moon|mournful is full of deep grief; peaceful is calm and untroubled|mournful 充满悲痛哀伤；peaceful 是安宁平和|peaceful means quiet and calm, not very sad|peaceful 是平静舒心的，不是满含悲伤|soothing comforts and relaxes you, rather than sounding very sad|soothing 让人放松宽慰，不是十分悲伤|mourn · ful|our saying /ɔːr/ and single l in -ful|发 /ɔːr/ 的 our 和单个 l 的 -ful
    booming|loud, deep drums shaking the hall floor|a giant's deep, loud voice heard from far away|deep thunder rattling the windows|booming is very loud and deep; shrill is very high and sharp|booming 是低沉震耳的轰鸣；shrill 是高亢刺耳的尖响|shrill is a piercing high sound, the opposite of very loud and deep|shrill 是尖锐刺耳的高音，与低沉响亮正相反|dramatic means exciting and full of strong feeling, not specifically very loud and deep|dramatic 只说激动人心，不专指声音低沉响亮|boom · ing|oo for long /uː/ plus -ing|发长音 /uː/ 的 oo 加 -ing
    soothing|a gentle song helping a baby fall asleep|soft rain on a roof helping you calm down and relax|calming music paired with a warm bath|soothing actively calms and relaxes you; peaceful simply describes a quiet place|soothing 强调主动安抚让人放松；peaceful 形容环境宁静|peaceful describes a quiet, calm place or mood, rather than actively making you feel calm and relaxed|peaceful 多形容环境静谧，不如 soothing 强调主动安抚让人放松|delicate means light, soft, and easily broken, not making you feel calm and relaxed|delicate 指轻盈易碎，不是让人舒缓放松|sooth · ing|oo + th (voiced) + -ing (drop silent e)|oo 加 th 再加 -ing（去末尾 e）
    steady|a drummer keeping an unchanging beat all song long|a heart beating in a slow, even rhythm|a clock ticking evenly all night long|steady stays even without changing; peaceful simply means quiet and calm|steady 强调恒定均匀、不快不慢；peaceful 只是安静平和|peaceful means quiet and calm, not staying the same without stopping or changing|peaceful 说的是安静平和，不是平稳不变的节奏|dramatic surges with excitement and strong feeling, the opposite of staying even and unchanging|dramatic 起伏激烈、充满张力，与平稳不变正相反|stead · y|ea saying short e before d|d 前发短 e 音的 ea
    dramatic|music growing loud and thrilling as a hero races to a castle|an exciting cymbal crash at the end|intense movie music during a chase|dramatic is packed with strong feeling and suspense; lively is just cheerful and upbeat|dramatic 充满张力与戏剧起伏；lively 只是欢快活泼|lively is cheerful and fun, not intense, exciting, and full of strong feeling|lively 是轻松欢快，没有紧张强烈的戏剧张力|booming describes only a loud, deep sound, not exciting and full of strong feeling|booming 只形容声音低沉响亮，不表达激动人心的戏剧感|dra · mat · ic|dr blend and -ic ending|开头的 dr 连缀和结尾 -ic
    peaceful|a valley lying completely quiet and still at dawn|a calm, quiet forest after a storm passes|a quiet afternoon sitting by the river|peaceful means quiet, calm, and undisturbed; soothing specifically calms nerves or puts someone to sleep|peaceful 形容安静平和的氛围；soothing 强调安抚紧张情绪|soothing actively calms and relaxes someone, rather than describing a quiet, calm scene|soothing 侧重安抚情绪，不是形容安静平和的景象或时光|mournful means very sad, not quiet and calm|mournful 满是悲伤，不是安详宁静|peace · ful|ea for long e, soft c, single l in -ful|发长 e 的 ea、软音 c、单个 l 的 -ful
    shrill|a piercing high whistle making dogs bark|a sharp, high cry from a baby|a sharp, ear-hurting school alarm|shrill is high, sharp, and ear-piercing; booming is deep and low|shrill 是高亢刺耳的尖声；booming 是低沉的轰鸣声|booming is a very loud, deep sound, the opposite of high and sharp|booming 是低沉轰响，与高亢尖锐正相反|dramatic means exciting and full of strong feeling, not high and sharp in a way that hurts your ears|dramatic 指扣人心弦，不专指高亢刺耳|shrill|shr three-letter blend and double l|开头的 shr 连缀和结尾双写 l
    delicate|a whisper-soft harp tune|a fragile snowflake melting on a glove|tiny, soft notes tinkling from a music box|delicate is light, fine, and easily broken; graceful is smooth and flowing in motion|delicate 是轻柔纤细、一碰就碎；graceful 是姿态优美流畅|graceful describes smooth, beautiful movement or flow, not light, soft, and easily broken|graceful 形容优美舒展的姿态，不是轻柔易碎|soothing means making you feel calm and relaxed, not light, soft, and easily broken|soothing 强调安抚放松，不是轻柔精致或易碎|del · i · cate|single l and -cate ending|单个 l 和结尾 -cate
  `,
};

const performing: Grade3Batch = {
  id: "words-for-performing",
  title: t("Words for Performing", "表达表演的词"),
  summary: t(
    "Ten words for being on stage: perform, audience, applaud, talent, confident, solo, festival and more.",
    "十个关于登台表演的词：perform、audience、applaud、talent、confident、solo、festival 等。",
  ),
  intro: t(
    "The choir steps back, Mei takes a breath to sing her **solo**, and when the last note lands, the whole **audience** rises to **applaud**! Being on stage—or cheering from a seat—uses all ten of these words.",
    "合唱团往后退了一步，小梅深吸一口气唱起独唱（**solo**）；最后一个音刚落，全场观众（**audience**）起立鼓掌（**applaud**）！无论登台还是看演出，这十个词都用得上。",
  ),
  watchOut: {
    meanings: t(
      "Tell **talent** (a natural gift you are born with) apart from **effort** (the hard practice you put in).",
      "分清 **talent**（天生的才华天赋）和 **effort**（后天付出的刻苦努力）。",
    ),
    use: t(
      "**Perform** is what the people on stage do, while **applaud** is what the crowd does when they clap.",
      "**perform** 是台上的人登台表演，**applaud** 是台下的观众鼓掌喝彩——别把动作主体弄混。",
    ),
    spelling: t(
      "Watch **audience** (*au* + *i* + *-ence*) and **applaud** (double *p*, *au* says /ɔː/).",
      "注意 **audience** 里的 **au** 与 **-ience**，以及 **applaud** 的双写 **p** 和 **au**。",
    ),
  },
  domain: ["performing for others", "为他人表演"],
  lines: `
    perform|performed,performs|to sing, dance, act or play music for people to watch|表演|Our class will ___ a play for the parents on Friday.|The band will ___ three songs at the fair.|Clowns ___ tricks in the circus ring.|entertain,applaud
    audience|audiences|the people who watch or listen to a show|观众，听众|The ___ laughed at the funny puppet show.|There were three hundred people in the ___.|The singer waved to the ___ before she began.|festival,solo
    applaud|applauded,applauds|to clap your hands to show you liked something|鼓掌|The crowd will ___ loudly at the end of the show.|Please ___ for our wonderful dancers!|We stood up to ___ the orchestra.|admire,perform
    talent|talents|a natural skill at doing something well|天赋，才能|Maya has a ___ for drawing animals.|The school is holding a ___ show next week.|Singing is his special ___.|effort,solo
    confident|-|sure that you can do something well|自信的|After weeks of practice, Leo felt ___ about his speech.|The ___ dancer smiled as she walked on stage.|Be ___ and speak loudly so everyone can hear you.|alert,foolish
    solo|solos|a song or piece of music performed by one person alone|独唱，独奏|Mei sang a ___ while the rest of the choir listened.|In the middle of the song, the guitarist played a ___.|He was nervous because the ___ meant he would be alone on stage.|festival,audience
    admire|admired,admires|to like and respect someone or something very much|钦佩，欣赏|I ___ my sister because she practices piano every day.|People ___ the painting for its bright colors.|We ___ how brave the firefighters are.|applaud,entertain
    entertain|entertained,entertains|to keep people happy and interested with a show or game|使娱乐，招待|The magician will ___ the children at the party.|Grandpa likes to ___ us with funny stories.|Street musicians ___ people walking in the park.|perform,admire
    festival|festivals|a special time or event with music, food and fun|节日，庆典，音乐节|Our town holds a music ___ every summer in the park.|At the spring ___, there were dancers, food stalls and fireworks.|The kite ___ fills the sky with colors every April.|audience,solo
    effort|efforts|hard work you put into trying to do something|努力|She practiced every day, and her hard ___ paid off.|She made a great ___ to finish the race.|The play was a success because of everyone's ___.|talent,wisdom
  `,
  notes: `
    perform|a class acting out a play for parents|a band playing three songs at a fair|clowns doing tricks in a circus ring|perform puts on a play, song, or act; entertain focuses on keeping people amused|perform 是登台演出某个节目；entertain 强调逗乐招待观众|entertain takes people as its object rather than a play, song, or trick|entertain 后面接被逗乐的人，不直接接剧目、歌曲或杂技|applaud means clapping from the seats, not putting on a show|applaud 是台下观众拍手鼓掌，不是台上演出节目|per · form|per- + form (with or)|per- 加含 or 的 form
    audience|the crowd laughing at a funny puppet show|three hundred people sitting to watch a show|the people a singer waves to from stage|audience is the people watching; festival is the whole public celebration|audience 是观看演出的观众；festival 是整场节庆活动|festival is a special public celebration with music and food, not the people watching a show|festival 是盛大的节庆活动，不是观看演出的观众群|solo is a piece performed by one person alone, not the people who watch or listen to a show|solo 是单人独唱或独奏，不是观看演出的听众观众|au · di · ence|au saying /ɔː/ and -ience ending|发 /ɔː/ 的 au 和结尾 -ience
    applaud|a crowd clapping loudly at the end of a show|clapping hands for wonderful dancers|standing up to clap for an orchestra|applaud means clapping hands aloud; admire is a quiet feeling of respect|applaud 是伸手鼓掌喝彩；admire 是心里钦佩欣赏|admire is a quiet feeling of respect, not clapping your hands to show you liked something|admire 是内心的敬佩欣赏，不是拍手鼓掌喝彩|perform means singing, acting, or playing on stage, not clapping your hands for a show|perform 是上台表演，不是鼓掌喝彩|ap · plaud|double p and au saying /ɔː/|双写 p 和发 /ɔː/ 音的 au
    talent|a natural gift for drawing animals|a school show where students display special skills|a natural special gift for singing|talent is a natural gift you are born with; effort is hard work you put in|talent 是天生才能；effort 是刻苦努力|effort is hard work you put in, not a natural skill at doing something well|effort 是后天付出的努力，不是天生的才华技能|solo is a piece performed by one person alone, not a natural skill|solo 是单人独奏独唱，不是天生的才能|tal · ent|single l and -ent ending|单个 l 和结尾 -ent
    confident|feeling sure about a speech after weeks of practice|a smiling dancer walking bravely onto stage|speaking loudly with self-assurance so everyone hears|confident feels sure you can do well; alert stays watchful for danger|confident 是自信有把握；alert 是警惕危险|alert means watching carefully for danger, not feeling sure about your own speech or stage performance|alert 指时刻提防危险，不指演说或登台表演时从容自信|foolish means silly and unwise, not sure and poised after weeks of practice|foolish 是愚蠢糊涂，不是充分练习后的自信大方|con · fi · dent|con + fi + -dent (not -dant)|con 加 fi 加 -dent（不是 -dant）
    solo|one singer singing while the whole choir listens|a guitarist playing alone in the middle of a song|a performance that puts one person alone on stage|solo is performed by one person alone; festival is a big public event|solo 是单人独演；festival 是盛大节庆|festival is a large public celebration, not a piece performed by one person alone|festival 是盛大公众庆典，不是单人独唱或独奏|audience is the crowd watching, not a song or piece performed by one person|audience 是台下观众，不是一个人表演的独唱独奏|so · lo|two long o sounds (so-lo)|两个发长音的 o（so-lo）
    admire|respecting a sister who practices piano daily|liking a painting for its bright colors|respecting how brave firefighters are|admire means respecting and liking deeply; applaud means clapping your hands|admire 是打心底欣赏敬佩；applaud 是拍手鼓掌|applaud means clapping your hands, not quietly liking and respecting someone or something|applaud 是拍手鼓掌，不是打心底欣赏敬佩|entertain means keeping people amused with a show or game, not liking and respecting deeply|entertain 是表演或讲故事逗乐大家，不是钦佩欣赏|ad · mire|ad- + mire with silent e making long i|ad- 加带 e 的 mire（i 读长音）
    entertain|a magician keeping party children happy and amazed|Grandpa amusing everyone with funny stories|street musicians keeping park walkers delighted|entertain keeps people happy and interested; perform puts on a specific act or song|entertain 强调让观众开心尽兴；perform 是表演具体剧目或曲子|perform takes a song or play as its object, rather than keeping people happy and interested|perform 后面接节目或曲目，不直接接被逗乐招待的人|admire means liking and respecting someone, not keeping people happy and interested with a show or game|admire 是钦佩尊重，不是逗乐招待大家|en · ter · tain|ai spelling long a in -tain|结尾 -tain 里发长 a 音的 ai
    festival|an annual summer music event in the town park|a spring celebration with dancers, food stalls, and fireworks|an April kite celebration filling the sky with colors|festival is a joyful public celebration; audience is just the crowd watching|festival 是有吃有玩的节庆活动；audience 只是观看演出的观众|audience is only the people watching a show, not a special public event with music, food, and fun|audience 只指看演出的观众群，不是盛大的节日庆典|solo is a single-person musical piece, not a special celebration with music, food, and fun|solo 是单人独唱或独奏，不是盛大的节日庆典|fes · ti · val|-ti- in the middle and -val ending|中间的 ti 和结尾 -val
    effort|hard daily practice that finally paid off|working very hard to finish a race|everyone's hard work making a play succeed|effort is the hard work you put in; talent is a natural gift you already had|effort 是后天付出的努力；talent 是天生自带的才华|talent is a natural ability, not the hard work you put into trying to do something|talent 是天生本领，不是刻苦付出的努力|wisdom is deep good sense from life experience, not hard physical or daily practice|wisdom 是人生阅历积淀的智慧，不是每天刻苦练习或奋力冲刺的努力|ef · fort|double f and -ort ending|双写 f 和结尾 -ort
  `,
};

const poetry: Grade3Batch = {
  id: "words-of-poetry",
  title: t("Words of Poetry", "诗歌的词汇"),
  summary: t(
    "Ten words of poems and their sounds: rhyme, verse, poet, limerick, syllable, repetition, riddle and more.",
    "十个关于诗歌及其声音的词：rhyme、verse、poet、limerick、syllable、repetition、riddle 等。",
  ),
  intro: t(
    "Clap once for *cat*, clap twice for *kit-ten*—every clap marks one **syllable**! Reading poems aloud is much more fun when you know how **rhyme**, **verse**, and **repetition** make words bounce.",
    "念 *cat* 拍一下手，念 *kit-ten* 拍两下手——每一拍就是一个音节（**syllable**）。弄懂押韵（**rhyme**）、诗节（**verse**）和重复（**repetition**），朗诵诗歌就会带劲得多。",
  ),
  watchOut: {
    meanings: t(
      "Tell **rhyme** (words sharing an ending sound like *moon/spoon*) apart from **syllable** (one clapped beat inside a word).",
      "分清 **rhyme**（尾音相同的押韵词，如 *moon/spoon*）和 **syllable**（词里能拍出来的音节）。",
    ),
    use: t(
      "A **limerick** is a silly five-line poem, a **riddle** is a guessing puzzle, and a **lullaby** is a soft bedtime song.",
      "**limerick** 是幽默的五行打油诗，**riddle** 是猜谜语，**lullaby** 是哄睡摇篮曲——看文体和用途。",
    ),
    spelling: t(
      "Watch **rhyme** (silent *h*, *y* for long *i*, silent *e*) and **syllable** (*y* + double *l* + *-able*).",
      "注意 **rhyme** 里不发音的 **h** 与发长 *i* 的 **y**，以及 **syllable** 的 **y** 加双写 **l**。",
    ),
  },
  domain: ["poems and their sounds", "诗歌及其声音"],
  lines: `
    rhyme|rhymes|a word that ends with the same sound as another, like "cat" and "hat"|押韵的词|"Moon" is a ___ for "spoon."|Can you think of a ___ for "tree"?|The poet chose "night" as a ___ for "bright."|syllable,repetition
    verse|verses|a group of lines in a song or poem|（诗或歌的）节，段|We sang the first ___ of the song and then the chorus.|Each ___ of the poem tells about a different season.|The last ___ of the song is the saddest part.|rhyme,limerick
    poet|poets|a person who writes poems|诗人|The ___ wrote a poem about the sea.|Our class met a ___ who read her poems aloud.|A ___ chooses each word carefully.|verse,limerick
    limerick|limericks|a funny poem of five lines with a bouncy rhythm|五行打油诗|A ___ is a funny poem with five lines.|"There was an old man with a beard" is the start of a famous ___.|We laughed at the silly ___ about a cat who could fly.|riddle,lullaby
    syllable|syllables|one beat of a word, a part you can clap|音节|"Cat" has one ___, but "kitten" has two.|Clap once for each ___ when you say your name.|The word "but" is just one ___.|rhyme,repetition
    repetition|-|saying the same word or line again and again|重复|The ___ of "Rain, rain, rain" makes the poem sound like falling drops.|Poets use ___ to make important words stand out.|There is ___ in the song because every verse ends with "Go to sleep."|rhyme,chant
    recite|recited,recites|to say a poem or text aloud from memory|背诵|Each child will ___ a poem in front of the class.|Can you ___ the poem without looking at the page?|Grandpa can still ___ the poems he learned at school.|observe,patrol
    riddle|riddles|a question or poem with a tricky answer you have to guess|谜语|Here is a ___: what has hands but cannot clap? A clock!|The ___ was so hard that nobody could guess the answer.|My brother told me a ___ about an egg.|limerick,chant
    lullaby|lullabies|a soft, gentle song sung to help a baby sleep|摇篮曲|Mom sang a ___ to the baby at bedtime.|The soft ___ made the baby close her eyes.|"Rock-a-bye Baby" is a famous ___.|chant,limerick
    chant|chants|words said or sung together again and again with a strong beat|有节奏的反复吟唱|The fans shouted a ___ to cheer on their team.|The children clapped as they said the jump-rope ___.|"We will win! We will win!" was the team's ___.|lullaby,repetition
  `,
  notes: `
    rhyme|"moon" matching the ending sound of "spoon"|finding a word that ends with the same sound as "tree"|picking "night" to match the ending sound of "bright"|rhyme matches ending sounds between two words; syllable counts the clapped beats inside one word|rhyme 是两词尾音押韵；syllable 是单词里的音节|syllable is one clapped beat inside a word, not a word ending with the same sound as another|syllable 是单词里拍出来的音节，不是尾音相同的押韵词|repetition repeats the same word or line again and again, not pairing words that share an ending sound|repetition 是反复说同一词句，不是尾音相同的押韵词|rhyme|rh with silent h, y for long i, silent e|带不发音 h 的 rh、长音 y 和词尾 e
    verse|the first section of a song sung before the chorus|each section of a poem describing a different season|the saddest final section of a song|verse is a whole group of lines in a song or poem; rhyme is just two matching ending sounds|verse 是诗节或歌段；rhyme 只是押韵词|rhyme is a word sharing an ending sound, not a whole group of lines in a song or poem|rhyme 只是押韵词，不是诗歌或歌曲里的整段诗节|limerick is a complete funny five-line poem, not one section inside a song or poem|limerick 是一首完整的搞笑五行诗，不是诗或歌里的其中一节|verse|er saying /ɜːr/ plus silent e after s|发 /ɜːr/ 的 er 和 s 后的不发音 e
    poet|the writer who composed a poem about the sea|a visiting author reading her poems aloud to class|a careful writer who chooses every word in a poem|poet is the person who writes poems; verse is a section of lines inside a poem|poet 是写诗的诗人；verse 是诗里的诗节|verse is a group of lines in a poem, not a person who writes poems|verse 是诗中的段落，不是写诗的人|limerick is a funny five-line poem itself, not the person who writes poems|limerick 是五行打油诗本身，不是写诗的作者|po · et|o-e pronounced as two syllables (po-et)|分两音节读的 o-e（po-et）
    limerick|a funny five-line poem with a bouncy rhythm|a famous humorous five-line poem about an old man with a beard|a silly five-line poem about a flying cat|limerick is a humorous five-line poem; riddle is a tricky guessing question|limerick 是幽默的五行打油诗；riddle 是要猜答案的谜语|riddle asks a tricky question with a hidden answer to guess, rather than a funny five-line poem|riddle 是让你猜谜底的谜语，不是五行的搞笑打油诗|lullaby is a gentle song to help a baby sleep, not a funny five-line poem|lullaby 是哄宝宝入睡的轻柔摇篮曲，不是滑稽的五行打油诗|lim · er · ick|single m and -ick ending|单个 m 和结尾 -ick
    syllable|one clapped beat in "cat" versus two in "kitten"|each beat you clap while saying your name|the single spoken beat in the word "but"|syllable is one clapped beat inside a word; rhyme is a matching ending sound between words|syllable 是词里的音节拍子；rhyme 是词尾押韵|rhyme compares the ending sounds of two words, rather than counting one clapped beat inside a word|rhyme 比的是两个词尾音是否相同，不是数单词里的音节|repetition repeats the same word or line over and over, not one clapped beat inside a word|repetition 是把同一句重复多遍，不是单词里的音节|syl · la · ble|y for short i, double l, -able|发短 i 的 y、双写 l 和 -able
    repetition|saying "Rain, rain, rain" over and over like falling drops|repeating words to make key ideas stand out|ending every verse of a song with the same line|repetition is saying the same word or line again and again; rhyme matches different words' ending sounds|repetition 是重复同一词句；rhyme 是不同词尾音押韵|rhyme pairs different words with matching ending sounds, not saying the same word or line again and again|rhyme 是用不同词押韵，不是反复说同一个词或同一句|chant is a rhythmic group call with a strong beat, not simply saying the same word or line again and again|chant 是众人齐声喊的强节奏口号，不是文字里单纯的重复手法|rep · e · ti · tion|e-e-i-i vowels (not re-pa-tition)|元音 e-e-i-i，结尾 -tion
    recite|saying a poem aloud in front of the class from memory|speaking a poem without looking at the page|remembering and saying childhood school poems aloud|recite says a poem aloud from memory; observe watches carefully|recite 是脱稿背诵诗文；observe 是仔细观察|observe means watching something carefully to learn, not speaking a poem aloud from memory|observe 是静静观察，不是当众脱稿背诵诗歌|patrol means walking or riding around to guard a place, not saying a poem from memory|patrol 是巡逻守卫，不是背诵诗歌|re · cite|soft c (/s/) and silent e making long i|读 /s/ 的 c 和让 i 读长音的 e
    riddle|a tricky guessing question whose answer is a clock|a hard puzzle nobody could guess|a guessing question about an egg|riddle is a puzzle with a tricky answer to guess; limerick is a funny five-line poem|riddle 是猜答案的谜语；limerick 是五行打油诗|limerick is a silly five-line poem for laughs, not a tricky question or puzzle you have to guess|limerick 是逗乐的五行诗，不是让你猜谜底的谜语|chant is a repeated cheer with a strong beat, not a tricky puzzle with an answer to guess|chant 是反复呼喊的口号，不是需要猜答案的谜语|rid · dle|double d and -le ending|双写 d 和结尾 -le
    lullaby|a gentle bedtime song sung to a baby|a soft song making a baby close her eyes|the famous bedtime song "Rock-a-bye Baby"|lullaby is a soft bedtime song; chant is a loud, strong-beat group call|lullaby 是轻柔哄睡的摇篮曲；chant 是响亮齐声喊|chant is loud and bouncy with a strong beat, the opposite of a soft song that helps a baby sleep|chant 节奏强烈、声音响亮，与哄婴儿入睡的轻柔摇篮曲正相反|limerick is a funny five-line poem meant to make you laugh, not a soft bedtime song|limerick 是搞笑的五行打油诗，不是轻柔哄睡的摇篮曲|lul · la · by|double l and y saying long i at the end|双写 l 和结尾发长 i 的 y
    chant|fans shouting a rhythmic cheer for their team|children clapping to a jump-rope beat|a team repeating "We will win!" together with a strong beat|chant is rhythmic group words shouted or clapped together; lullaby is a soft bedtime song|chant 是带强拍的齐声吟唱；lullaby 是轻柔摇篮曲|lullaby is a soft, gentle bedtime song for a baby, not words said or sung together with a strong beat|lullaby 是哄睡婴儿的轻柔歌曲，不是带着强拍齐声呼喊的吟唱|repetition is the general act of repeating words, not a strong-beat rhythmic call shouted or clapped together|repetition 泛指文字里的重复，不像 chant 特指合拍齐声呼喊的节奏口号|chant|ch digraph and nt blend|开头 ch 和结尾 nt
  `,
};

const seasons: Grade3Batch = {
  id: "words-for-seasons-and-senses",
  title: t("Words for Seasons and Senses", "表达季节与感官的词"),
  summary: t(
    "Ten words for what we see, hear and feel through the year: autumn, blossom, thaw, dew, wither, rustle, crisp and more.",
    "十个描述一年中所见所闻所感的词：autumn、blossom、thaw、dew、wither、rustle、crisp 等。",
  ),
  intro: t(
    "Step onto the lawn at sunrise and tiny drops of **dew** soak your shoes while the spider's web begins to **glisten**. Seasonal poems rely on sharp sense words to capture spring melt, summer bloom, and crisp fall air.",
    "日出时踩上草坪，细密的露珠（**dew**）沾湿了鞋尖，蛛网在阳光下微微闪亮（**glisten**）。写四季的诗歌，全靠这些细腻的感官词把风霜花叶写活。",
  ),
  watchOut: {
    meanings: t(
      "Tell **bloom** (open into fresh flowers) apart from **wither** (dry up and die).",
      "分清 **bloom**（花朵盛开）和 **wither**（干枯凋谢）。",
    ),
    use: t(
      "**Glisten** is something you *see* (wet surfaces shining), while **rustle** is something you *hear* (dry leaves or paper moving softly).",
      "**glisten** 是眼睛看到的湿润微光，**rustle** 是耳朵听到的沙沙轻响——先判断是视觉还是听觉。",
    ),
    spelling: t(
      "Watch the silent **n** in **autumn**, the silent **t** in **glisten** and **rustle**, and **thaw** (*aw* says /ɔː/).",
      "注意 **autumn** 结尾不发音的 **n**、**glisten** 和 **rustle** 里不发音的 **t**，以及 **thaw** 里的 **aw**。",
    ),
  },
  domain: ["the seasons and the senses", "季节和感官"],
  lines: `
    autumn|-|the season after summer when leaves fall; also called fall|秋天|In ___, the leaves turn red and gold.|We pick apples in ___, after the hot summer is over.|The days get shorter in ___.|blossom,dew
    blossom|blossoms|a flower, especially on a fruit tree|（果树的）花|A pink ___ opened on the cherry tree.|Each apple ___ will become an apple in the fall.|The bee landed on a white ___.|dew,autumn
    thaw|thawed,thaws|to melt and become soft after being frozen|融化，解冻|In spring, the frozen lake begins to ___.|Leave the frozen bread out to ___ before lunch.|When the snow starts to ___, the streets are full of slush.|wither,drift
    dew|-|small drops of water that form on grass at night|露水|In the morning, ___ covered the grass in tiny drops.|My shoes got wet from the ___ on the lawn.|A spider's web sparkled with ___ at sunrise.|blossom,autumn
    bloom|bloomed,blooms|to open into flowers|开花|Tulips ___ in early spring.|The roses will ___ in June.|The cactus will ___ only once a year.|wither,thaw
    wither|withered,withers|to dry up and die|枯萎|Flowers will ___ if you forget to water them.|In the hot summer, the grass began to ___.|The leaves ___ and turn brown in the fall.|bloom,thaw
    glisten|glistened,glistens|to shine because it is wet|（湿物）闪光，闪亮|The wet streets ___ under the lights.|After the rain, the leaves ___ in the sun.|Drops of dew ___ on the spider's web.|rustle,drift
    rustle|rustled,rustles|to make soft, dry sounds like leaves moving|沙沙作响|The dry leaves ___ under our feet.|We heard something ___ in the bushes.|Papers ___ when the wind blows through the window.|glisten,drift
    crisp|-|cool and fresh, or dry and easy to break with a snap|清新凉爽的，脆的|We went for a walk in the ___ autumn air.|The ___ leaves crunched under my boots.|A ___ apple makes a loud crunch when you bite it.|balanced,invisible
    drift|drifted,drifts|to move slowly, carried by wind or water|漂流，飘|Snowflakes ___ slowly to the ground.|The little boat began to ___ down the river.|Clouds ___ across the sky on a windy day.|rustle,glisten
  `,
  notes: `
    autumn|the season when leaves turn red and gold|the apple-picking season right after hot summer|the season when days grow shorter|autumn is the fall season; blossom is a flower on a tree|autumn 是秋天这个季节；blossom 是果树上的花朵|blossom is a single flower on a tree, not the whole season after summer|blossom 是树上开的一朵花，不是夏天过后的整个季节|dew is tiny morning water drops on grass, not a whole season of the year|dew 是草叶上的清晨露水，不是一年里的一个季节|au · tumn|au saying /ɔː/ and silent n at the end|发 /ɔː/ 的 au 和结尾不发音的 n
    blossom|a pink flower opening on a cherry tree|an apple-tree flower that becomes an apple in fall|a white flower where a bee lands|blossom is a flower on a tree; dew is tiny water drops|blossom 是树上的花朵；dew 是细小露珠|dew is tiny morning water drops, not a flower growing on a tree|dew 是清晨的细小露珠，不是树上开出的花朵|autumn is a whole season of the year, not a single flower|autumn 是一年里的秋天，不是一朵具体的花|blos · som|bl blend, double s, and -om ending|bl 连缀、双写 s 和结尾 -om
    thaw|a frozen lake melting in spring|frozen bread softening before lunch|snow melting into street slush|thaw means melting after being frozen; wither means drying up and dying|thaw 是解冻融化；wither 是干枯凋萎|wither means drying up and dying from lack of water, not something frozen melting soft|wither 是缺水枯萎，不是冻结的东西化软融化|drift means moving slowly on wind or water, not melting after being frozen|drift 是随风随水漂移，不是结冰后融化解冻|thaw|th digraph and aw saying /ɔː/|开头 th 和发 /ɔː/ 音的 aw
    dew|tiny morning water drops covering the grass|wet morning drops soaking shoes on the lawn|sparkling sunrise drops on a spider's web|dew is tiny night-formed water drops; blossom is a flower|dew 是夜间凝结的露水；blossom 是花朵|blossom is a flower on a tree, not tiny wet drops that form overnight|blossom 是树上的花朵，不是夜间凝结的细小水珠|autumn is a whole season of the year, not tiny wet drops formed at night|autumn 是秋天这个季节，不是夜间凝结的水滴|dew|ew spelling /uː/ (not do)|发 /uː/ 音的 ew（别写成 do）
    bloom|tulips opening into flowers in early spring|roses opening in June|a cactus opening its flowers once a year|bloom means opening into fresh flowers; wither means drying up and dying|bloom 是开花盛放；wither 是干枯凋谢|wither means drying up and dying, the exact opposite of opening into fresh flowers|wither 是枯萎凋谢，与开出鲜花正相反|thaw means melting after being frozen, not a plant opening into flowers|thaw 是冰冻融化，不是植物绽放开花|bloom|bl blend and double o|bl 连缀和双写 o
    wither|flowers drying up when you forget to water them|grass drying and dying in hot summer|leaves drying up and turning brown in fall|wither means drying up and dying; bloom means opening into fresh flowers|wither 是干枯凋萎；bloom 是开花盛放|bloom means opening into fresh flowers, the exact opposite of drying up and dying|bloom 是花朵绽放，与干枯凋谢正相反|thaw means melting after being frozen, not a plant drying up and dying|thaw 是冰冻融化，不是植物干枯萎缩|with · er|th (voiced) + -er ending|中间 th 加结尾 -er
    glisten|wet streets shining under streetlights|rain-wet leaves shining in the sun|dew drops shining on a spider's web|glisten is a wet shine you see; rustle is a dry sound you hear|glisten 是眼睛看到的湿润微光；rustle 是耳朵听到的沙沙声|rustle is a soft dry sound you hear, not a wet surface shining in the light|rustle 是耳朵听到的干燥沙沙声，不是湿润表面在光下闪亮|drift means moving slowly on wind or water, not shining with wetness|drift 是随风随水飘动，不是因为湿润而闪闪发亮|glis · ten|silent t in -sten|在 -sten 中不发音的 t
    rustle|dry leaves making soft sounds underfoot|something moving softly in the bushes|papers making dry fluttering sounds in the breeze|rustle is a soft dry sound you hear; glisten is a wet shine you see|rustle 是听到的沙沙轻响；glisten 是看到的湿润微光|glisten is a wet shine seen with the eyes, not a soft dry sound you hear|glisten 是肉眼看见的湿光，不是耳朵听见的轻柔沙沙声|drift means floating silently on air or water, not making soft dry moving sounds|drift 是静静飘浮移动，不指发出轻柔干燥的沙沙声|rus · tle|silent t in -stle|在 -stle 中不发音的 t
    crisp|cool, fresh autumn air on a walk|dry leaves crunching under boots|a fresh apple making a loud crunch when bitten|crisp is cool and fresh or crunchy; balanced is equal on both sides|crisp 是清凉或酥脆的；balanced 是平衡的|balanced means equal on both sides so nothing moves, not cool fresh air or crunchy leaves and apples|balanced 指两边受力平衡，不能形容清凉秋风或嘎吱作响的干叶苹果|invisible means unable to be seen, not cool, fresh, or crunchy|invisible 指看不见，不是清凉干脆|crisp|cr blend at the start and sp at the end|开头的 cr 和结尾的 sp
    drift|snowflakes floating slowly down to the ground|a little boat moving slowly down a river|clouds floating slowly across a windy sky|drift means moving slowly on wind or water; rustle means making dry moving sounds|drift 是随风随水缓缓飘移；rustle 是发出沙沙声|rustle is a soft dry sound you hear, not moving slowly on wind or water|rustle 是干燥的沙沙声，不是随风或水流缓缓移动|glisten means shining because something is wet, not moving slowly on wind or water|glisten 是湿润发亮，不是随风或水流慢慢飘移|drift|dr blend at the start and ft at the end|开头的 dr 和结尾的 ft
  `,
};

const soundsAndLight: Grade3Batch = {
  id: "sensory-words",
  title: t("Words for Sounds and Light", "表达声音与光亮的词"),
  summary: t(
    "Ten words that help readers hear and see: shimmer, gleam, crackle, murmur, whisper, rumble, flicker and more.",
    "十个让读者听到、看到的词：shimmer、gleam、crackle、murmur、whisper、rumble、flicker 等。",
  ),
  intro: t(
    "Logs **crackle** in the fireplace while the candle flame begins to **flicker** in the draft. Swapping plain *shine* and *sound* for exact sensory verbs lets readers see and hear your scene right away.",
    "壁炉里的木柴噼啪作响（**crackle**），烛火在微风里忽明忽暗（**flicker**）。把平淡的 *shine* 和 *sound* 换成精准的感官动词，画面和声音立刻就活了。",
  ),
  watchOut: {
    meanings: t(
      "Sort the five light verbs carefully: **glow** is steady, **flicker** jumps on and off, **shimmer** waves softly, **sparkle** flashes in tiny points, and **gleam** shines bright off a clean surface.",
      "分清五个发光动词：**glow**（柔和稳定）、**flicker**（忽明忽暗）、**shimmer**（微微晃闪）、**sparkle**（点点闪烁）、**gleam**（洁净光亮）。",
    ),
    use: t(
      "Sort the five sound verbs too: **crackle** snaps (fire, twigs), **rattle** knocks (windows, beads), **rumble** rolls deep (thunder, trucks), while **murmur** and **whisper** are soft and low.",
      "五个声音动词也各有场景：**crackle**（柴火枯枝噼啪）、**rattle**（窗户珠子咔嗒）、**rumble**（雷声卡车隆隆），**murmur** 和 **whisper** 则是轻柔低语。",
    ),
    spelling: t(
      "Watch **whisper** (*wh* at the start), **gleam** (*ea* for long *e*), and the double letters in **shimmer** and **rattle**.",
      "注意 **whisper** 开头的 **wh**、**gleam** 里的 **ea**，以及 **shimmer**、**rattle** 中间的双写辅音。",
    ),
  },
  domain: ["sounds and light", "声音和光亮"],
  lines: `
    shimmer|shimmered,shimmers|to shine with a soft light that seems to shake|闪烁，发出微光|The moonlit lake seemed to ___ with a soft, wavy glow that trembled on the water.|Heat made the road ___ on the summer day.|Her silver silk dress seemed to ___ with a soft, rippling sheen as she danced.|flicker,murmur
    gleam|gleamed,gleams|to shine brightly, often because something is clean or polished|闪闪发光|Freshly washed and waxed, the new car's smooth hood began to ___ in the sunlight.|Polish the spoons until they ___.|After we scrubbed the brass doorknob, its clean metal surface began to ___ brightly.|flicker,crackle
    crackle|crackled,crackles|to make lots of small, sharp snapping sounds|噼啪作响|The logs ___ in the fireplace.|The radio began to ___ and buzz.|Dry twigs ___ when you step on them.|murmur,glow
    murmur|murmured,murmurs|to make a soft, low sound that is hard to hear clearly|低语，潺潺声|We could hear the stream ___ over the stones.|The crowd began to ___ in a low, muffled hum when the lights went out.|Bees ___ softly in the clover.|crackle,glow
    whisper|whispered,whispers|to speak very quietly|低声说，耳语|Please ___ in the library so others can read.|I heard my friend ___ a secret in my ear.|Lean close so I can ___ the password without anyone else hearing.|rumble,sparkle
    sparkle|sparkled,sparkles|to shine with many small flashes of light|闪耀，发光|Tiny stars ___ with bright little flashes across the night sky.|Fresh snow crystals ___ with thousands of tiny bright flashes in the sun.|Diamonds ___ when light shines on them.|flicker,rattle
    rumble|rumbled,rumbles|to make a long, low, deep sound|隆隆作响|We heard the thunder ___ far away.|My stomach began to ___ before lunch.|Heavy freight trucks ___ with a deep, low roar past our house all night.|whisper,gleam
    glow|glowed,glows|to give off a steady, soft light|发出柔和的光|The night-light will ___ softly in the dark.|Fireflies ___ with a steady, soft green light in the summer evening.|Hot coals ___ red in the fire.|flicker,crackle
    flicker|flickered,flickers|to shine on and off in a quick, unsteady way|闪烁不定，忽明忽暗|The candle will ___ in the breeze.|The lights began to ___ during the storm.|The weak flashlight beam began to ___ on and off as its battery ran low.|glow,murmur
    rattle|rattled,rattles|to make quick knocking sounds when shaken|发出咔嗒声|The windows ___ when the wind blows hard.|Shake the box and listen to the beads ___.|The old car will ___ over the bumpy road.|whisper,shimmer
  `,
  notes: `
    shimmer|a moonlit lake shining with a soft, wavy, trembling glow|summer heat making a road look wavy and bright|a silver silk dress catching a soft, rippling sheen while dancing|shimmer is a soft, wavy, trembling shine; flicker jumps quickly on and off|shimmer 是柔和晃动的微光；flicker 是忽明忽暗地闪动|flicker blinks quickly on and off in an unsteady way, rather than shining with a soft, wavy light|flicker 是急促不稳地忽明忽暗，不是柔和晃动的微光|murmur is a soft low sound you hear, not a soft wavy light you see|murmur 是听见的低柔声音，不是看见的柔和摇曳微光|shim · mer|sh digraph and double m|开头 sh 和中间双写 m
    gleam|a freshly washed and waxed car hood shining in sunlight|spoons polished until they shine cleanly|a scrubbed brass doorknob shining brightly on its clean metal surface|gleam is a bright, clean, polished shine; flicker jumps quickly on and off|gleam 是光洁擦亮的明光；flicker 是忽明忽暗地闪动|flicker shines on and off in a quick, unsteady way, not a bright steady shine off a clean polished surface|flicker 是急促不稳地一闪一灭，不是洁净抛光表面平稳明亮的光泽|crackle is lots of sharp snapping sounds you hear, not a bright polished shine you see|crackle 是听见的噼啪脆响，不是看见的洁净亮光|gleam|gl blend and ea spelling long e|gl 连缀和发长 e 音的 ea
    crackle|fireplace logs making sharp snapping sounds|a radio snapping and buzzing|dry twigs snapping sharply underfoot|crackle is lots of sharp snapping sounds; murmur is a soft, low, indistinct hum|crackle 是清脆细碎的噼啪声；murmur 是低柔模糊的嗡嗡声|murmur is a soft, gentle, low hum, not lots of small, sharp snapping sounds|murmur 是轻柔低沉的嗡嗡声，不是细碎尖锐的噼啪脆响|glow is a steady soft light you see, not sharp snapping sounds you hear|glow 是看见的柔和微光，不是听见的噼啪声|crack · le|cr blend, ck after short a, and -le|cr 连缀、短 a 后的 ck 和结尾 -le
    murmur|a stream making a soft low sound over stones|a crowd making a low, muffled hum when lights go out|bees making a soft low hum in clover|murmur is a soft, low, indistinct sound; crackle is sharp snapping noises|murmur 是低柔模糊的潺潺声或嗡嗡声；crackle 是尖锐的噼啪声|crackle is lots of small sharp snapping sounds, not a soft, low, indistinct hum|crackle 是细碎尖锐的噼啪脆响，不是低柔连绵的嗡嗡声|glow is a steady soft light you see, not a soft low sound you hear|glow 是看见的柔和微光，不是听见的低柔声音|mur · mur|mur repeated twice with ur|ur 重复两次（mur-mur）
    whisper|speaking very quietly inside a library|telling a secret softly into a friend's ear|speaking a password softly so nobody else can hear|whisper is speaking very quietly; rumble is a loud, deep rolling sound|whisper 是轻声耳语；rumble 是低沉响亮的隆隆声|rumble is a long, low, deep rolling sound, the opposite of speaking very quietly|rumble 是绵长低沉的隆隆声，与压低声音轻声说话正相反|sparkle is tiny bright flashes of light you see, not speaking very quietly|sparkle 是看见的点点闪光，不是轻声耳语|whis · per|wh at the start and -er ending|开头的 wh 和结尾 -er
    sparkle|tiny stars flashing brightly across the night sky|fresh snow crystals flashing in thousands of bright points|diamonds sending out many small flashes of light|sparkle flashes in many tiny bright points; flicker blinks unsteadily on and off|sparkle 是点点璀璨的碎闪；flicker 是忽明忽暗地不稳闪动|flicker shines on and off in a quick, unsteady way, not many tiny bright flashes of light|flicker 是急促不稳地一明一暗，不是无数细小明亮的闪点|rattle is quick knocking sounds when shaken, not tiny bright flashes of light you see|rattle 是晃动碰撞发出的咔嗒声，不是看见的点点闪光|spar · kle|sp + ar + -kle ending|sp 加 ar 再加结尾 -kle
    rumble|distant thunder rolling with a long deep sound|a hungry stomach making a low growl before lunch|heavy freight trucks rolling past with a deep low roar all night|rumble is a long, low, deep rolling sound; whisper is speaking very quietly|rumble 是绵长低沉的隆隆声；whisper 是轻声耳语|whisper means speaking very quietly with a breathy voice, far softer than a long deep rolling sound|whisper 是轻声耳语，远没有绵长低沉的隆隆声那样厚重响亮|gleam is a bright polished shine you see, not a deep rolling sound you hear|gleam 是看见的光洁亮光，不是听见的低沉隆隆声|rum · ble|short u and -ble ending|短音 u 和结尾 -ble
    glow|a night-light giving off a steady soft light|fireflies giving off a steady soft green light|hot red coals shining steadily in a fire|glow is a steady, soft, warm light; flicker jumps on and off unsteadily|glow 是平稳柔和的微光；flicker 是忽明忽暗的闪动|flicker shines on and off in a quick, unsteady way, the opposite of a steady soft light|flicker 是急促不稳地忽明忽暗，与平稳柔和的微光正相反|crackle is small sharp snapping sounds you hear, not a steady soft light you see|crackle 是听见的噼啪声，不是看见的平稳柔光|glow|gl blend and ow saying long o|gl 连缀和发长 o 音的 ow
    flicker|a candle flame jumping on and off in a breeze|stormy lights blinking unsteadily on and off|a weak flashlight beam blinking on and off as the battery runs low|flicker shines on and off in a quick, unsteady way; glow stays steady and calm|flicker 是忽明忽暗、摇曳不定；glow 是平稳柔和地发光|glow gives off a steady, unchanging soft light, not a quick unsteady on-and-off flash|glow 是稳定不变的柔光，不是忽明忽暗的急促闪动|murmur is a soft low sound you hear, not an unsteady light blinking on and off|murmur 是听见的低柔声音，不是一明一暗的灯光|flick · er|fl blend, ck after short i, and -er|fl 连缀、短 i 后的 ck 和结尾 -er
    rattle|windows knocking quickly in a hard wind|beads knocking inside a shaken box|an old car knocking and clattering on a bumpy road|rattle is quick knocking when shaken; whisper is speaking very quietly|rattle 是震动碰撞的咔嗒声；whisper 是轻声耳语|whisper means speaking very quietly, not quick knocking sounds made when hard things shake|whisper 是轻声说话，不是硬物晃动碰撞发出的急促咔嗒声|shimmer is a soft wavy light you see, not quick knocking sounds you hear|shimmer 是看见的柔和波光，不是听见的咔嗒碰撞声|rat · tle|double t and -le ending|双写 t 和结尾 -le
  `,
};

/** batchesB are the vocabulary batches of the last five units of grade 3. */
export const batchesB: readonly Grade3Batch[] = [
  riverKingdom,
  ancientLife,
  timeLongAgo,
  ancientChina,
  walls,
  thinking,
  forces,
  magnets,
  explaining,
  music,
  instruments,
  describingMusic,
  performing,
  poetry,
  seasons,
  soundsAndLight,
];
