// Grade 3: writing checked by rules, part one: adding details to a sentence, grouping related facts, closing a
// paragraph, the parts of a friendly letter, and taking notes from a text.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { type Arrange, type Ask, arrangeGenerator, askGenerator, need, rows, topic } from "./kit.ts";
import { readingLetters } from "./reading-facts.ts";

// Kernels and their details: kernel|where|when|why|how.

const detailRows = rows(`
  The cat slept|on the warm windowsill|all afternoon|because it was tired|peacefully
  The children cheered|in the gym|at the end of the game|because their team had won|loudly
  Grandpa fished|from the old wooden pier|every Sunday morning|because he loved the quiet|patiently
  The baby giggled|in her high chair|during breakfast|because the puppy licked her toes|happily
  The runners raced|around the school track|before lunch|because the coach was timing them|swiftly
  The bird sang|in the apple tree|at sunrise|because spring had come|sweetly
  My brother whispered|under the blanket|late at night|so that no one would hear him|quietly
  The leaves fell|onto the sidewalk|in October|because the wind was strong|slowly
  Maya practiced the piano|in the living room|after school|because her recital was soon|carefully
  The firefighters worked|at the burning barn|through the night|to save the horses|bravely
  The puppy dug|under the fence|this morning|because it smelled a bone|eagerly
  The class planted seeds|in the school garden|last spring|so that they could grow beans|neatly
`);

const questionsOf = ["where", "when", "why", "how"] as const;
type Wh = (typeof questionsOf)[number];

const whZh: Record<Wh, string> = { where: "在哪里", when: "什么时候", why: "为什么", how: "怎样" };

const whWhy: Record<Wh, readonly [string, string]> = {
  where: [
    "It tells the place where the action happens, often starting with a word like *in*, *on* or *under*.",
    "它说明动作发生的地点，常以 *in*、*on* 或 *under* 这样的词开头。",
  ],
  when: [
    "It tells the time when the action happens, such as *at sunrise* or *after school*.",
    "它说明动作发生的时间，比如 *at sunrise* 或 *after school*。",
  ],
  why: [
    "It gives the reason for the action, often starting with *because* or *so that*.",
    "它说明动作的原因，常以 *because* 或 *so that* 开头。",
  ],
  how: ["It tells the way the action is done, often with a word ending in *-ly*.", "它说明动作是怎样做的，常用以 *-ly* 结尾的词。"],
};

const whNot: Record<Wh, readonly [string, string]> = {
  where: [
    "A detail that answers *where* names a place, and this one does not name a place.",
    "回答 *where* 的细节会说出一个地点，而这个细节没有说出地点。",
  ],
  when: [
    "A detail that answers *when* names a time, and this one does not name a time.",
    "回答 *when* 的细节会说出一个时间，而这个细节没有说出时间。",
  ],
  why: [
    "A detail that answers *why* gives a reason, and this one gives no reason.",
    "回答 *why* 的细节会给出原因，而这个细节没有给出原因。",
  ],
  how: [
    "A detail that answers *how* tells the way something is done, and this one does not.",
    "回答 *how* 的细节说明事情是怎样做的，而这个细节没有说明。",
  ],
};

const details = detailRows.map((row) => {
  const [kernel = "", where = "", when = "", why = "", how = ""] = need(row, 5);
  return { kernel, parts: { where, when, why, how } as Record<Wh, string> };
});

const nameDetailBank: readonly Ask[] = details.flatMap((d) =>
  questionsOf.map((wh, k): Ask => {
    const others = [questionsOf[(k + 1) % 4], questionsOf[(k + 2) % 4]] as Wh[];
    return {
      question: t("Which question does the detail in bold answer?", "粗体的细节回答了哪个问题？"),
      shown: `${d.kernel} **${d.parts[wh]}**.`,
      right: wh,
      wrong: others,
      why: t(`It answers **${wh}**. ${whWhy[wh][0]}`, `它回答 **${wh}**（${whZh[wh]}）。${whWhy[wh][1]}`),
      whyNot: others.map((o) => t(...whNot[o])),
    };
  }),
);

const chooseDetailBank: readonly Ask[] = details.flatMap((d) =>
  questionsOf.map((wh, k): Ask => {
    const others = [questionsOf[(k + 1) % 4], questionsOf[(k + 3) % 4]] as Wh[];
    return {
      question: t(`Which sentence adds a detail that answers *${wh}*?`, `哪个句子加上了回答 *${wh}*（${whZh[wh]}）的细节？`),
      shown: `${d.kernel}.`,
      right: `${d.kernel} ${d.parts[wh]}.`,
      wrong: others.map((o) => `${d.kernel} ${d.parts[o]}.`),
      why: t(`The detail *${d.parts[wh]}* answers **${wh}**. ${whWhy[wh][0]}`, `细节 *${d.parts[wh]}* 回答了 **${wh}**。${whWhy[wh][1]}`),
      whyNot: others.map((o) =>
        t(
          `That detail answers *${o}*, not *${wh}*. ${whWhy[o][0]}`,
          `这个细节回答的是 *${o}*（${whZh[o]}），而不是 *${wh}*。${whWhy[o][1]}`,
        ),
      ),
    };
  }),
);

// Groups of facts in pairs: each group's name|four facts|two names that fit only one fact. The facts of a group's
// partner are the ones that do not belong.

const groupRows = rows(`
  How Animals Live in the Desert|Camels can go for days without drinking water.|Lizards warm themselves on hot rocks in the morning.|Fennec foxes lose heat through their huge ears.|Desert toads stay underground until it rains.|How Camels Drink|Where Toads Hide
  How Animals Live in the Arctic|Polar bears have thick fur and a layer of fat.|Arctic foxes turn white in winter.|Walruses use their tusks to climb onto the ice.|Snowy owls hunt lemmings on the frozen ground.|Polar Bear Fur|How Owls Hunt
  Parts of a Plant|Roots take in water from the soil.|The stem carries water up to the leaves.|Leaves use sunlight to make food.|Flowers make seeds for new plants.|What Roots Do|How Flowers Make Seeds
  Kinds of Weather|Rain falls from heavy gray clouds.|Snow falls when the air is below freezing.|Hail is made of balls of ice.|Fog is a cloud that touches the ground.|Rainy Days|What Fog Is
  Ways to Stay Healthy|Eating fruit and vegetables gives your body vitamins.|Sleeping ten hours a night helps children grow.|Exercise makes your heart and muscles strong.|Washing your hands stops germs from spreading.|Healthy Fruit|Why We Wash Our Hands
  Tools for Measuring|A ruler measures how long something is.|A scale measures how heavy something is.|A thermometer measures how hot or cold it is.|A clock measures time.|How to Use a Ruler|Telling the Time
  Life in Ancient Egypt|Egyptians farmed the land beside the Nile.|They wrote with picture signs called hieroglyphs.|Kings were buried in huge pyramids.|Paper was made from reeds called papyrus.|Farming by the Nile|Egyptian Paper
  The Solar System|The Sun is a star at the center of the solar system.|Eight planets travel around the Sun.|Jupiter is the largest planet.|Mars is called the red planet.|The Sun Is a Star|The Red Planet
  Families of Instruments|Violins and cellos are string instruments.|Trumpets and tubas are brass instruments.|Flutes and clarinets are woodwinds.|Drums and cymbals are percussion instruments.|Violins and Cellos|Drums and Cymbals
  Ways to Travel|Trains carry people along tracks.|Ships carry goods across the sea.|Airplanes fly people around the world.|Buses take children to school.|Riding on Trains|School Buses
  Pushes and Pulls|A push moves something away from you.|A pull moves something toward you.|Friction slows a rolling ball.|A magnet can pull a nail without touching it.|How to Push a Cart|How Magnets Pull
  The Life of a Frog|A frog lays its eggs in water.|Tadpoles hatch from the eggs.|A tadpole slowly grows legs.|The grown frog leaves the water.|Frog Eggs|Grown Frogs
  Staying Safe at the Beach|Swim only where a lifeguard can see you.|Wear sunscreen so that you do not burn.|Drink water so that you do not get too hot.|Never swim alone.|Wearing Sunscreen|Swimming with a Friend
  Ways to Recycle|Old paper can become new paper.|Glass bottles can be melted and made again.|Cans can be crushed and turned into new cans.|Food scraps can become compost for gardens.|Making New Paper|Making Compost
  Inventions of Ancient China|The Chinese made the first paper from bark and rags.|They made silk from the threads of silkworms.|They made bowls of fine white porcelain.|They printed books with carved wooden blocks.|Raising Silkworms|Printing Books
  Parts of a Map|A map key explains the symbols on a map.|A compass rose shows north, south, east and west.|A scale shows how far apart places really are.|The title tells what the map shows.|The Map Key|Finding North and South
`);

const groups = groupRows.map((row) => {
  const [name = "", f1 = "", f2 = "", f3 = "", f4 = "", n1 = "", n2 = ""] = need(row, 7);
  return { name, facts: [f1, f2, f3, f4], narrow: [n1, n2] };
});

const partnerOf = (i: number) => groups[i % 2 === 0 ? i + 1 : i - 1] ?? groups[0];

const notBelongBank: readonly Ask[] = groups.flatMap((g, i) => {
  const p = partnerOf(i);
  if (!p) return [];
  return [0, 1].map((k): Ask => {
    const odd = p.facts[k] ?? "";
    const kept = g.facts.slice(k, k + 3);
    return {
      question: t("Which fact does not belong with the others?", "哪个事实和其他的不属于一组？"),
      shown: "",
      right: odd,
      wrong: kept,
      why: t(
        `The other facts are all about one thing, *${g.name}*, but this one is about *${p.name}*: ${odd}`,
        `其他事实都属于同一个主题 *${g.name}*，而这一条属于 *${p.name}*：${odd}`,
      ),
      whyNot: kept.map(() =>
        t(
          `That fact belongs to the group: like most of the others, it is about *${g.name}*.`,
          `这个事实属于这一组：和其他大多数事实一样，它讲的是 *${g.name}*。`,
        ),
      ),
    };
  });
});

const groupNameBank: readonly Ask[] = groups.flatMap((g, i) => {
  const p = partnerOf(i);
  if (!p) return [];
  return [0, 1].map((k): Ask => {
    const facts = g.facts.slice(k, k + 3);
    const narrow = g.narrow[k] ?? "";
    return {
      question: t("Which name fits this group of facts?", "哪个名称适合这一组事实？"),
      shown: facts.map((f) => `- ${f}`).join("\n"),
      right: g.name,
      wrong: [narrow, p.name],
      why: t(
        `*${g.name}* covers every fact in the group. A group's name is wide enough for all of its facts, and no wider.`,
        `*${g.name}* 涵盖了这一组里的每个事实。一组的名称要能涵盖所有事实，又不能太宽泛。`,
      ),
      whyNot: [
        t(
          `*${narrow}* is too narrow: it fits one fact of the group, not all of them.`,
          `*${narrow}* 太窄了：它只适合其中一个事实，而不是全部。`,
        ),
        t(
          `*${p.name}* is the name of a different group; these facts are not about that.`,
          `*${p.name}* 是另一组的名称；这些事实讲的不是它。`,
        ),
      ],
    };
  });
});

// Paragraphs: topic sentence|three details|closing sentence|a sentence that starts a new topic.

const paragraphRows = rows(`
  Dogs make wonderful pets.|They are loyal to their families.|They love to play and go for walks.|Many dogs can even learn tricks.|A dog is a great friend to have.|Cats sleep for most of the day and hunt at night.
  Autumn is a busy time for squirrels.|They gather nuts and seeds from morning to night.|They bury them in hundreds of hiding places.|Some squirrels also build warm nests of leaves.|All this work gets them ready for winter.|Bears catch fish in the rushing rivers of the north.
  Our town library has something for everyone.|Little children can hear stories on Saturday mornings.|Older kids can use the computers for homework.|Grown-ups can borrow books, films and music.|Every visitor finds something there.|The new swimming pool in our town opens in June.
  Exercise is good for your body.|It makes your heart stronger.|It helps your muscles grow.|It even helps you sleep better at night.|Moving every day keeps you healthy.|Vegetables come in many different shapes and colors.
  The desert is a hard place to live.|It is very hot in the day and cold at night.|There is very little rain.|Food and water are hard to find.|Only tough living things survive there.|Rainforests are full of tall trees and noisy birds.
  Bees are important to farmers.|They carry pollen from flower to flower.|This helps plants make fruit and seeds.|Without bees, many crops would not grow.|Farmers need bees for their crops.|Ants live in large nests deep under the ground.
  Recycling helps our planet.|It means less trash goes into the ground.|Old things are turned into new ones.|Fewer trees are cut down to make paper.|When we recycle, we care for the Earth.|My family has just bought a big red car.
  The ancient Egyptians were clever builders.|They built huge pyramids from stone blocks.|They carved tall statues of their kings.|They planned temples with great stone columns.|Their buildings still amaze people.|The Greeks held the first Olympic Games long ago.
  Winter brings many kinds of fun.|You can build a snowman in the yard.|You can slide down a hill on a sled.|You can skate on a frozen pond.|Snow days are full of fun.|Summer is the best time of year for swimming.
  Magnets are useful at home.|They hold notes and drawings on the fridge.|They keep some cupboard doors shut.|They are even inside speakers and headphones.|Magnets help us every day.|Wood is used to build many houses and chairs.
  Owls are skilled night hunters.|Their big eyes see well in the dark.|Their sharp ears hear the tiny sounds of mice.|Their soft feathers let them fly without a sound.|Owls are made for hunting at night.|Eagles build huge nests high up on cliffs.
  Breakfast is an important meal.|It gives you energy for the morning.|It helps you pay attention in class.|It keeps you from feeling hungry before lunch.|A good breakfast starts the day well.|Dinner is often a time to talk with the family.
  Trees help people in many ways.|They give us shade on hot days.|Their wood is used to build homes.|Their fruit and nuts are good to eat.|We could not live well without trees.|Many flowers bloom in the garden in spring.
  Rain is important for living things.|Plants need rain to grow.|Animals drink from rivers and ponds that rain fills.|Farmers need rain for their crops.|Life on Earth depends on rain.|Snow is the most fun kind of weather to play in.
  Playing an instrument takes practice.|You must learn to read notes.|You must train your fingers to move quickly.|You must play a little every day.|Practice is what makes a musician.|Drums are some of the loudest instruments of all.
  Our class trip to the farm was exciting.|We fed the goats and the sheep.|We collected eggs from the hens.|We rode on a wagon pulled by a tractor.|It was a wonderful day for everyone.|Next year our class is going to visit the zoo.
  Frogs have amazing bodies.|They can breathe through their skin.|Their long, sticky tongues catch insects.|Their strong back legs help them jump far.|A frog's body suits its life.|Snakes shed their old skin as they grow bigger.
  Maps help people find their way.|They show roads and paths.|They mark rivers, lakes and mountains.|A map key explains what the symbols mean.|With a map, you will not get lost.|A globe is round, just like the Earth itself.
  Penguins are well suited to the cold.|A thick layer of fat keeps them warm.|Tight feathers keep out the icy water.|They huddle together to share their heat.|Penguins have many ways to stay warm.|Parrots live in warm rainforests far to the north.
  Friction is a force we use every day.|It helps our shoes grip the ground.|It lets brakes slow the wheels of a bike.|It keeps a pencil from slipping out of our fingers.|Without friction, everything would slide.|Magnets can pull on iron without even touching it.
  The Great Wall of China is a wonder of the world.|It stretches for thousands of kilometers.|It was built over hundreds of years.|Millions of people visit it every year.|Few things people built are as great.|Rice grows in wet fields along the rivers of China.
  Spiders are skilled builders.|They spin silk threads from their bodies.|They weave webs in beautiful patterns.|Some can build a whole web in an hour.|Spiders are some of nature's best builders.|Ladybugs eat tiny insects called aphids on leaves.
  Reading every day helps you learn.|It teaches you new words.|It shows you how the world works.|It takes you on adventures in your mind.|Daily reading makes you a better learner.|Our math homework is due on Friday this week.
  Elephants live in close families.|The oldest female leads the group.|The aunts help care for the babies.|The family stays together for many years.|Family matters a great deal to elephants.|Giraffes are the tallest animals in the world.
  Sound is made when things vibrate.|A guitar string shakes when you pluck it.|A drum skin shakes when you hit it.|Your throat shakes when you speak.|Every sound begins with shaking.|Light travels faster than anything else we know.
  Wearing a helmet keeps you safe on a bike.|It protects your head if you fall.|It can stop a serious injury.|In many places riders must wear one by law.|Always wear a helmet when you ride.|Bikes come in many sizes, shapes and colors.
  Ancient China gave the world many inventions.|The Chinese made the first paper.|They learned to make silk.|They printed books with wooden blocks.|Much that we use today began in China.|The Yellow River often flooded its banks long ago.
  The ocean is home to many creatures.|Whales and dolphins swim near the surface.|Crabs and starfish live on the ocean floor.|Strange glowing fish live in the deep, dark water.|All kinds of life fill the ocean.|Lakes are filled with fresh water instead of salt.
  Thunderstorms can be dangerous.|Lightning can strike tall trees.|Strong winds can knock down branches.|Heavy rain can flood streets.|A storm is something to take seriously.|Rainbows sometimes appear in the sky after the rain.
  Grandparents have a lot to teach us.|They know stories about the past.|They can show us how to cook family recipes.|They share skills like fishing or sewing.|We can learn so much from them.|My cousin lives in a big city far from here.
`);

const paragraphs = paragraphRows.map((row) => {
  const [topic = "", d1 = "", d2 = "", d3 = "", closing = "", off = ""] = need(row, 6);
  return { topic, details: [d1, d2, d3], closing, off };
});

const findClosingBank: readonly Ask[] = paragraphs.map((p) => ({
  question: t("Which is the closing sentence of this paragraph?", "哪一句是这个段落的结尾句？"),
  shown: [p.topic, ...p.details, p.closing].join(" "),
  right: p.closing,
  wrong: [p.topic, p.details[1] ?? ""],
  why: t(
    `The closing sentence comes last and sums up the point in new words: “${p.closing}”`,
    `结尾句在最后，用新的说法总结段落的要点：“${p.closing}”`,
  ),
  whyNot: [
    t("That is the topic sentence: it opens the paragraph and names its point.", "这是主题句：它是段落的开头，说出段落的要点。"),
    t(
      "That is a detail from the middle; it supports the point but does not sum it up.",
      "这是中间的一个细节；它支持要点，但没有总结要点。",
    ),
  ],
}));

const chooseClosingBank: readonly Ask[] = paragraphs.map((p) => ({
  question: t("Which sentence would close this paragraph best?", "哪一句最适合作为这个段落的结尾？"),
  shown: [p.topic, ...p.details].join(" "),
  right: p.closing,
  wrong: [p.topic, p.off],
  why: t(
    `“${p.closing}” sums up the point of the paragraph in new words and adds nothing new.`,
    `“${p.closing}” 用新的说法总结了段落的要点，而且没有增加新内容。`,
  ),
  whyNot: [
    t(
      "That repeats the topic sentence word for word; a closing says the point again in new words.",
      "这一句和主题句一字不差；结尾句要用新的说法再说一遍要点。",
    ),
    t(
      "That starts a new topic; a closing sums up this paragraph and adds nothing new.",
      "这一句开始了一个新话题；结尾句总结本段，不增加新内容。",
    ),
  ],
}));

// Friendly letters: the letters of the reading topics, and short ones of their own: date|reader|body|closing|writer.

const shortLetterRows = rows(`
  March 8, 2026|Grandpa|Thank you for the book about trains. I read it in two days!|Love|Mia
  May 2, 2026|Aunt Lucy|I lost my first tooth today. The tooth fairy left me a coin.|Hugs|Ben
  June 19, 2026|Coach Lee|Thank you for a great season. I learned to kick with both feet.|Your player|Sara
  July 4, 2026|Grandma|We are at the beach, and the water is warm. I found a starfish!|Love|Kai
  August 12, 2026|Jamal|Our new puppy is named Pepper. Come and meet her soon!|Your friend|Omar
  September 9, 2026|Mrs. Hill|I miss your class. My new teacher reads us poems too.|Your student|Lily
  October 21, 2026|Uncle Ray|I carved a pumpkin with a funny face. Mom says it looks like you!|Love|Zoe
  November 30, 2026|Cousin Ana|It snowed today, so we built a snow fort. I wish you were here.|Your cousin|Leo
  December 15, 2026|Grandpa Ken|Thank you for the warm hat. I wear it to school every day.|Love|Priya
  January 6, 2027|Ms. Park|Thank you for the piano lessons. I can play two songs now.|Your student|Diego
  February 14, 2027|Mom|You are the best mom in the world. I made this card myself.|Love|Rosa
  March 22, 2027|Aunt Nell|Our class hatched chicks. One of them is named Nell, after you!|Love|Sam
  April 3, 2027|Grandma June|I planted the seeds you sent. Three tiny green shoots came up!|Love|Hana
  May 18, 2027|Mr. Ortiz|Thank you for fixing my bike. Now I can ride to school again.|Your neighbor|Tom
`);

const allLetters = [
  ...readingLetters,
  ...shortLetterRows.map((row) => {
    const [date = "", reader = "", body = "", closing = "", writer = ""] = need(row, 5);
    return { date, reader, body, closing, writer };
  }),
];

const letterParts = ["the date", "the greeting", "the body", "the closing", "the signature"] as const;

const partWhy: readonly (readonly [string, string])[] = [
  ["The date comes first, at the top, and tells when the letter was written.", "日期放在最前面、最上方，说明信是什么时候写的。"],
  [
    "The greeting comes after the date: *Dear* and the reader's name, with a comma.",
    "称呼在日期之后：*Dear* 加上收信人的名字，后面跟逗号。",
  ],
  [
    "The body is the main part of the letter, where the writer shares news or asks for something.",
    "正文是信的主体部分，写信人在这里分享消息或提出请求。",
  ],
  [
    "The closing comes after the body, such as *Love,* or *Your friend,* with a comma.",
    "结束语在正文之后，比如 *Love,* 或 *Your friend,*，后面跟逗号。",
  ],
  ["The signature comes last: the writer's name, under the closing.", "签名放在最后：写信人的名字，写在结束语下面。"],
];

const partNot: readonly (readonly [string, string])[] = [
  ["The date is at the very top and tells when the letter was written.", "日期在最上方，说明写信的时间。"],
  ["The greeting is the line that begins with *Dear* and names the reader.", "称呼是以 *Dear* 开头、写出收信人名字的那一行。"],
  ["The body is the main part, with the news or the request, in sentences.", "正文是信的主体，用句子写出消息或请求。"],
  ["The closing is a short phrase like *Love,* just before the writer's name.", "结束语是像 *Love,* 这样的短语，就在写信人名字的前面。"],
  ["The signature is the writer's name at the very end.", "签名是写在最后的写信人名字。"],
];

const letterLines = (l: (typeof allLetters)[number]) => [l.date, `Dear ${l.reader},`, l.body, `${l.closing},`, l.writer];

const namePartBank: readonly Ask[] = allLetters.flatMap((l) =>
  letterParts.map((part, k): Ask => {
    const others = [(k + 1) % 5, (k + 2) % 5];
    const lines = letterLines(l);
    return {
      question: t("Which part of the letter is in bold?", "粗体的是信的哪一部分？"),
      shown: lines.map((line, i) => (i === k ? `**${line}**` : line)).join("\n\n"),
      right: part,
      wrong: others.map((o) => letterParts[o] ?? ""),
      why: t(...(partWhy[k] ?? ["", ""])),
      whyNot: others.map((o) => t(...(partNot[o] ?? ["", ""]))),
    };
  }),
);

const orderLetterBank: readonly Arrange[] = allLetters.map((l) => ({
  question: t("Put the parts of this friendly letter in order.", "把这封书信的各部分按顺序排列。"),
  shown: "",
  steps: letterLines(l),
  why: t(
    "A friendly letter goes in this order: the date, the greeting, the body, the closing and the signature.",
    "书信的顺序是：日期、称呼、正文、结束语、签名。",
  ),
}));

// Notes: a sentence|a note that keeps its key fact|a note that keeps it in too many words|a note that loses it|a note
// too short to keep it.

const noteRows = rows(`
  Camels can walk for many days in the desert without drinking any water.|camels: many days without water|camels can walk in the desert for a long, long time|camels: walk in the desert|camels: water
  A camel's hump stores fat, which gives the camel energy when food is hard to find.|hump stores fat for energy|the hump on the back of a camel stores fat inside it for energy|hump: on its back|hump: fat
  Penguins cannot fly, but they use their wings like flippers to swim.|penguins swim with wings as flippers|penguins are birds that use their two wings like flippers to swim|penguins: are birds|penguins: wings
  The Nile River flooded every summer and left rich black mud on the fields.|Nile flooded each summer, left rich mud|the river called the Nile flooded each and every summer and left mud|Nile: a river|Nile: mud
  Honeybees tell each other where to find flowers by doing a special dance.|bees dance to show where flowers are|honeybees do a special kind of dance to tell each other about flowers|bees: find flowers|bees: dance
  Owls can turn their heads almost all the way around.|owls turn heads almost all the way|owls are able to turn their heads around almost all of the way|owls: have heads|owls: turn
  A polar bear's skin is black, which helps it soak up the sun's heat.|black skin soaks up heat|the skin of a polar bear is black and it helps it to soak up the heat|polar bears: have skin|skin: black
  Lightning is hotter than the surface of the Sun.|lightning hotter than Sun's surface|lightning is really, really hot, even hotter than the surface of the Sun|lightning: in storms|lightning: hot
  The Great Wall of China was built over hundreds of years by many different rulers.|Great Wall built over hundreds of years|the Great Wall of China was built over a very long time, hundreds of years|Great Wall: in China|Great Wall: rulers
  Friction is a force that slows down moving objects.|friction slows moving things|friction is the name of a force that makes moving objects slow down|friction: a force|friction: objects
  Butterflies taste their food with their feet.|butterflies taste with feet|butterflies use their feet when they want to taste their food|butterflies: eat food|butterflies: feet
  Magnets pull on things made of iron, such as nails and paper clips.|magnets pull iron things|magnets are able to pull on all kinds of things that are made out of iron|magnets: nails|magnets: pull
  Sound travels through the air as waves that we cannot see.|sound travels as waves in air|sound is able to travel through the air in waves that you cannot see|sound: cannot see|sound: travels
  Giraffes sleep for only a few minutes at a time.|giraffes sleep a few minutes at a time|giraffes are animals that only sleep for a few minutes at one time|giraffes: are tall|giraffes: sleep
  The ancient Egyptians made paper from a river plant called papyrus.|Egyptian paper from papyrus plant|the ancient Egyptian people made their paper out of a plant called papyrus|Egyptians: lived long ago|paper: plant
  A hummingbird's heart can beat more than a thousand times a minute.|heart beats over 1,000 times a minute|the heart of a hummingbird can beat more than one thousand times every minute|hummingbirds: small birds|heart: fast
  Snakes smell the air by flicking their forked tongues.|snakes smell with forked tongues|snakes flick out their forked tongues in order to smell the air around them|snakes: no legs|snakes: tongues
  Seeds need water, warmth and air to start growing.|seeds need water, warmth, air|seeds need to have water and warmth and air if they are going to start to grow|seeds: in soil|seeds: water
  Some sea turtles swim thousands of kilometers every year.|sea turtles swim thousands of km yearly|some of the sea turtles swim for thousands and thousands of kilometers every year|sea turtles: in the ocean|turtles: swim
  Bats find insects in the dark by listening for echoes.|bats find insects by echoes|bats are able to find insects when it is dark by listening for echoes|bats: fly at night|bats: echoes
  The violin has four strings that the player rubs with a bow.|violin: four strings, played with a bow|the violin is an instrument that has four strings that you rub with a bow|violin: an instrument|violin: strings
  Earthquakes happen when large pieces of the earth's crust slip.|earthquakes: crust pieces slip|earthquakes are things that happen when big pieces of the crust slip past|earthquakes: shake ground|earthquakes: crust
  Beavers build dams across streams with branches and mud.|beavers build dams of branches and mud|beavers are animals that build dams across streams out of branches and mud|beavers: live by streams|beavers: dams
  An octopus squirts dark ink to escape from enemies.|octopus squirts ink to escape|an octopus is an animal that can squirt dark ink when it wants to escape|octopus: eight arms|octopus: ink
  Silk is made from the threads that silkworms spin.|silk comes from silkworm threads|silk is a cloth that is made out of the threads that the silkworms spin|silk: soft cloth|silk: worms
  Clouds are made of tiny drops of water or bits of ice.|clouds: tiny water drops or ice|clouds are made out of very tiny drops of water or very small bits of ice|clouds: in the sky|clouds: water
  The Moon has no light of its own; it shines with light from the Sun.|Moon shines with the Sun's light|the Moon has no light of its own, so it shines with light that comes from the Sun|Moon: in the night sky|Moon: light
  Plants make their own food from sunlight, air and water.|plants make food from sun, air, water|plants are living things that make their own food out of sunlight and air and water|plants: are green|plants: food
  A ramp makes it easier to move a heavy box up to a higher place.|ramp makes moving heavy things up easier|a ramp is a thing that makes it easier to move a heavy box up to a higher place|ramp: a slope|ramp: box
  Drums make sound when their tight skin is hit and shakes.|drums: hit skin shakes, makes sound|drums make their sound when the tight skin on them is hit and then it shakes|drums: loud|drums: skin
`);

const notes = noteRows.map((row) => {
  const [sentence = "", note = "", wordy = "", missing = "", tooShort = ""] = need(row, 5);
  return { sentence, note, wordy, missing, tooShort };
});

const chooseNoteBank: readonly Ask[] = notes.map((n) => ({
  question: t("Which is the best note of this sentence?", "哪一条是这句话最好的笔记？"),
  shown: n.sentence,
  right: n.note,
  wrong: [n.sentence, n.missing],
  why: t(
    `The note “${n.note}” keeps the key fact of the sentence in a few words of the writer's own.`,
    `笔记“${n.note}”用自己的几个词保留了这句话的关键事实。`,
  ),
  whyNot: [
    t(
      "That copies the whole sentence; a note keeps only the key fact, in a few words.",
      "这是把整句话抄了下来；笔记只用几个词保留关键事实。",
    ),
    t("That is short, but it leaves out the key fact of the sentence.", "这条笔记很短，但它漏掉了这句话的关键事实。"),
  ],
}));

const shortestNoteBank: readonly Ask[] = notes.map((n) => ({
  question: t("Which is the shortest note that still keeps the key fact?", "哪一条是仍然保留关键事实的最短笔记？"),
  shown: n.sentence,
  right: n.note,
  wrong: [n.wordy, n.tooShort],
  why: t(
    `“${n.note}” is short, and the key fact is still all there, so it will help when you read it later.`,
    `“${n.note}” 很短，而且关键事实一点不少，所以以后读的时候能帮上忙。`,
  ),
  whyNot: [
    t("That keeps the fact, but it uses many words that a note does not need.", "这条保留了事实，但用了很多笔记不需要的词。"),
    t("That is too short: it has lost the key fact, so it would not help you later.", "这条太短了：它丢掉了关键事实，以后帮不上忙。"),
  ],
}));

/** writingRuleTopics are the first rule-checked writing topics of grade 3. */
export const writingRuleTopics: readonly TopicDef[] = [
  topic(
    "adding-details-to-a-sentence",
    t("Adding Details to a Sentence", "给句子添加细节"),
    t(
      "A short sentence grows when it answers who, what, where, when, why or how.",
      "一个短句回答了谁、什么、在哪里、什么时候、为什么或怎样之后，就会变得丰富。",
    ),
    ["subjects-and-predicates"],
    [
      point(
        "the-question-a-detail-answers",
        t("The Question a Detail Answers", "细节回答的问题"),
        t(
          "A **kernel sentence** has just a subject and a verb: *The cat slept.* Details make it richer, and each detail answers a question. *On the windowsill* answers **where**; *all afternoon* answers **when**; *because it was tired* answers **why**; *peacefully* answers **how**.\n\nTo name the question, ask which one the detail would answer on its own.",
          "**基本句**只有主语和动词：*The cat slept.* 细节让句子更丰富，每个细节都回答一个问题。*On the windowsill* 回答 **where**；*all afternoon* 回答 **when**；*because it was tired* 回答 **why**；*peacefully* 回答 **how**。\n\n要说出是哪个问题，就问问这个细节单独能回答哪一个。",
        ),
        askGenerator(nameDetailBank),
      ),
      point(
        "adding-the-detail-asked-for",
        t("Adding the Detail Asked For", "添加所要求的细节"),
        t(
          "A writer adds the details a reader needs. If the reader wants to know **where**, add a place; **when**, a time; **why**, a reason with *because* or *so that*; **how**, the way it was done.\n\nA detail of the wrong kind can be a fine detail and still not answer the question that was asked.",
          "作者会添加读者需要的细节。读者想知道**在哪里**，就加地点；**什么时候**，就加时间；**为什么**，就用 *because* 或 *so that* 加原因；**怎样**，就加做事的方式。\n\n种类不对的细节本身也许不错，但仍然没有回答所问的问题。",
        ),
        askGenerator(chooseDetailBank),
      ),
    ],
  ),
  topic(
    "grouping-related-facts",
    t("Grouping Related Facts", "把相关的事实归类"),
    t("Facts that belong together go into one group, and a group gets a name.", "属于一起的事实归为一组，每组都有一个名称。"),
    ["main-idea"],
    [
      point(
        "the-fact-that-does-not-belong",
        t("The Fact That Does Not Belong", "不属于这一组的事实"),
        t(
          "Before writing about a topic, a writer sorts facts into **groups**. Facts in a group are all about the same thing: how desert animals live, or the parts of a plant.\n\nTo find a fact that does not belong, ask what most of the facts are about, then look for the one about something else.",
          "写一个话题之前，作者会把事实分成**几组**。同一组的事实讲的都是同一件事：沙漠动物怎样生活，或者植物的各个部分。\n\n要找出不属于这一组的事实，先问问大多数事实讲的是什么，再找讲别的事情的那一条。",
        ),
        askGenerator(notBelongBank),
      ),
      point(
        "naming-a-group",
        t("Naming a Group of Facts", "给一组事实命名"),
        t(
          "A group of facts gets a **name** that fits all of them. Roots, stems, leaves and flowers make the group *Parts of a Plant*.\n\nA good name is not too narrow, fitting only one fact, and it is not the name of a different group. Test it on each fact.",
          "一组事实要有一个适合所有事实的**名称**。根、茎、叶、花组成了 *Parts of a Plant* 这一组。\n\n好的名称不能太窄，只适合其中一个事实；也不能是另一组的名称。用每个事实检验一下。",
        ),
        askGenerator(groupNameBank),
      ),
    ],
  ),
  topic(
    "choosing-a-closing-sentence",
    t("Choosing a Closing Sentence", "选择结尾句"),
    t(
      "A closing sentence sums up a paragraph's point in new words and adds nothing new.",
      "结尾句用新的说法总结段落的要点，不增加新内容。",
    ),
    ["identifying-topic-sentences"],
    [
      point(
        "finding-the-closing-sentence",
        t("Finding the Closing Sentence", "找出结尾句"),
        t(
          "A paragraph often has three kinds of sentences. The **topic sentence** comes first and names the point. The **details** in the middle support it. The **closing sentence** comes last and sums up the point again.\n\nThe closing sentence often sounds like the topic sentence, but in new words.",
          "一个段落通常有三种句子。**主题句**在最前面，说出要点。中间的**细节**支持要点。**结尾句**在最后，再次总结要点。\n\n结尾句常常听起来像主题句，但用的是新的说法。",
        ),
        askGenerator(findClosingBank),
      ),
      point(
        "choosing-a-closing-that-fits",
        t("Choosing a Closing That Fits", "选择合适的结尾句"),
        t(
          "A good closing sentence **sums up** the paragraph's point in **new words**. It does not repeat the topic sentence word for word, and it does not start a new topic.\n\nAfter *Dogs make wonderful pets* and three details, *A dog is a great friend to have* closes well; *Cats sleep all day* starts something new.",
          "好的结尾句用**新的说法****总结**段落的要点。它不会一字不差地重复主题句，也不会开始一个新话题。\n\n在 *Dogs make wonderful pets* 和三个细节之后，*A dog is a great friend to have* 是好的结尾；*Cats sleep all day* 则开始了新的内容。",
        ),
        askGenerator(chooseClosingBank),
      ),
    ],
  ),
  topic(
    "parts-of-a-friendly-letter",
    t("Parts of a Friendly Letter", "书信的组成部分"),
    t(
      "A friendly letter has a date, a greeting, a body, a closing and a signature, in that order.",
      "一封书信依次有日期、称呼、正文、结束语和签名。",
    ),
    ["commas-in-dates-addresses-and-letters"],
    [
      point(
        "naming-the-part-of-a-letter",
        t("Naming the Part of a Letter", "说出信的组成部分"),
        t(
          "A friendly letter has five parts. The **date** is at the top. The **greeting**, such as *Dear Grandma,*, names the reader. The **body** gives the news. The **closing**, such as *Love,*, ends it. The **signature** is the writer's name.\n\nThe greeting and the closing each end with a comma.",
          "书信有五个部分。**日期**在最上面。**称呼**（比如 *Dear Grandma,*）说出收信人。**正文**写出消息。**结束语**（比如 *Love,*）结束全信。**签名**是写信人的名字。\n\n称呼和结束语后面都要加逗号。",
        ),
        askGenerator(namePartBank),
      ),
      point(
        "putting-a-letter-in-order",
        t("Putting a Letter in Order", "给信排序"),
        t(
          "The parts of a friendly letter always come in the same order: **date**, **greeting**, **body**, **closing**, **signature**.\n\nTo order a scrambled letter, find the date first, then the line with *Dear*. The longest part with the news is the body, and the short phrase with a comma before the name is the closing.",
          "书信的各部分总是按同样的顺序排列：**日期**、**称呼**、**正文**、**结束语**、**签名**。\n\n给打乱的信排序时，先找日期，再找有 *Dear* 的那一行。写着消息的最长部分是正文，名字前面带逗号的短语是结束语。",
        ),
        arrangeGenerator(orderLetterBank),
      ),
    ],
  ),
  topic(
    "taking-notes-from-a-text",
    t("Taking Notes from a Text", "从文本中做笔记"),
    t("A note keeps a key fact in a few words, not a whole sentence copied.", "笔记用几个词保留关键事实，而不是把整句抄下来。"),
    ["supporting-details"],
    [
      point(
        "choosing-the-note",
        t("Choosing the Note", "选择笔记"),
        t(
          "A **note** keeps the **key fact** of a sentence in a few words. From *Camels can walk for many days without drinking any water*, a good note is *camels: many days without water*.\n\nA note is not the whole sentence copied, and it must not leave out the key fact. Ask: what would I need to remember?",
          "**笔记**用几个词保留一句话的**关键事实**。对于 *Camels can walk for many days without drinking any water*，好的笔记是 *camels: many days without water*。\n\n笔记不是把整句话抄下来，也不能漏掉关键事实。问问自己：我需要记住的是什么？",
        ),
        askGenerator(chooseNoteBank),
      ),
      point(
        "the-shortest-note",
        t("The Shortest Note That Keeps the Fact", "保留事实的最短笔记"),
        t(
          "A good note is **as short as it can be** while keeping the key fact. Drop words like *the*, *is able to* and *a kind of*, and keep the words that carry the fact.\n\nBut cut too much, as in *camels: water*, and the fact is lost: later you will not know what it meant.",
          "好的笔记在保留关键事实的前提下**越短越好**。去掉 *the*、*is able to*、*a kind of* 这样的词，留下承载事实的词。\n\n但删得太多，比如 *camels: water*，事实就丢了：以后你就不知道它是什么意思了。",
        ),
        askGenerator(shortestNoteBank),
      ),
    ],
  ),
];
