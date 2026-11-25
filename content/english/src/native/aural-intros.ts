// The introductions of the listening and reading-aloud topics of the native grades, written for each unit: a question
// its passages answer, and a sentence of its passages to read aloud.

import { type Text, t } from "@ga/content";

/** AuralIntro is the introduction of a unit's listening topic and of its reading-aloud topic. */
export interface AuralIntro {
  /** listening introduces the listening topic. */
  readonly listening: Text;
  /** aloud introduces the reading-aloud topic. */
  readonly aloud: Text;
}

/** auralIntros are the introductions of the native units' listening and reading-aloud topics, keyed `grade-N-slug`. */
export const auralIntros: Readonly<Record<string, AuralIntro>> = {
  // Grade 1
  "grade-1-all-about-me": {
    listening: t(
      "In *My Family*, you hear what everyone at home does. Then the question comes: *What does Mom do?* Listen for the part about sick pets. Here you hear this unit's stories read to you, with no page to look at, and answer one question at a time.",
      "在 *My Family* 里，你会听到家里每个人做什么。接着问题来了：*What does Mom do?* 要留心听讲生病宠物的那一句。本主题不看书页，听本单元的小故事，一题一题回答。",
    ),
    aloud: t(
      "*I live in a little house on a hill.* Read it like you are telling a friend: *I live* / *in a little house* / *on a hill*, then stop at the period. You will read sentences and a few lines from this unit's stories aloud.",
      "*I live in a little house on a hill.* 像讲给朋友听那样读：*I live* / *in a little house* / *on a hill*，到句号停下。本主题大声朗读本单元故事里的句子和几小段话。",
    ),
  },
  "grade-1-pets-and-animals": {
    listening: t(
      "Ben's new pup Max loves to run and dig. *What did Max do in the garden?* The answer is in the story you hear, not in what pups usually do. You will listen to this unit's stories about pets and animal homes and answer questions on them.",
      "Ben 的小狗 Max 爱跑爱挖。*What did Max do in the garden?* 答案在你听到的故事里，不是小狗平常会做的事。本主题听本单元关于宠物和动物家园的故事，回答问题。",
    ),
    aloud: t(
      "*The pup was small and brown, with big soft ears.* Take a tiny rest at the comma, then finish with *big soft ears*. You will read sentences and short parts of this unit's animal stories aloud.",
      "*The pup was small and brown, with big soft ears.* 逗号处轻轻停一下，再读完 *big soft ears*。本主题大声朗读本单元动物故事里的句子和小段落。",
    ),
  },
  "grade-1-home-and-school": {
    listening: t(
      "Kim's lunch box is lost! *What did the lunch box look like?* Listen for its color and the animal on the lid. You will hear this unit's stories about home and school and answer a question about each.",
      "Kim 的午餐盒丢了！*What did the lunch box look like?* 要听出它的颜色和盖子上的小动物。本主题听本单元关于家庭和学校的故事，并回答问题。",
    ),
    aloud: t(
      "*First, she hangs up her coat and bag.* Words like *First* and *Then* tell the order of Kim's day, so give them a little pause. You will read sentences and short stretches of this unit's stories aloud.",
      "*First, she hangs up her coat and bag.* *First*、*Then* 这些词告诉我们 Kim 一天的先后顺序，读到它们稍停一下。本主题大声朗读本单元故事里的句子和小段落。",
    ),
  },
  "grade-1-weather-and-seasons": {
    listening: t(
      "Tom wakes up, looks out, and the whole world has changed. *What did the world look like when Tom woke up?* You will listen to this unit's stories about snow, rain and the four seasons and answer what you hear.",
      "Tom 一觉醒来往外看，整个世界都变了样。*What did the world look like when Tom woke up?* 本主题听本单元关于雪、雨和四季的故事，回答听到的内容。",
    ),
    aloud: t(
      "*\"Put on your coat and boots,\" says Mom.* Read Mom's words the way Mom would say them, then *says Mom* a little quieter. You will read sentences and short parts of this unit's weather stories aloud.",
      '*"Put on your coat and boots," says Mom.* 引号里的话要像妈妈在说话，*says Mom* 读得轻一点。本主题大声朗读本单元天气故事里的句子和小段落。',
    ),
  },
  "grade-1-food-and-friends": {
    listening: t(
      "Gran is sick, so Lily and Dad make soup. *What did they do first?* Listen for the word *First*. You will hear this unit's stories about picnics, soup and where food comes from, and answer questions on them.",
      "奶奶病了，Lily 和爸爸给她煮汤。*What did they do first?* 留心听 *First* 这个词。本主题听本单元关于野餐、煮汤和食物从哪里来的故事，并回答问题。",
    ),
    aloud: t(
      "*Next, Dad cut them up, and Lily put them in the pot.* Two people, two jobs: pause at the comma between Dad's part and Lily's part. You will read sentences and short stretches of this unit's stories aloud.",
      "*Next, Dad cut them up, and Lily put them in the pot.* 两个人做两件事：在爸爸和 Lily 之间的逗号处停一下。本主题大声朗读本单元故事里的句子和小段落。",
    ),
  },
  "grade-1-bugs-and-growing-things": {
    listening: t(
      "A seed needs soil and water, and its leaves need one more thing to make food. *What do the leaves need to make food?* You will hear this unit's passages about ants, butterflies and seeds and answer questions on them.",
      "种子需要土和水，叶子制造养分还需要一样东西。*What do the leaves need to make food?* 本主题听本单元关于蚂蚁、蝴蝶和种子的短文，并回答问题。",
    ),
    aloud: t(
      "*First, a little root grows down into the soil.* Read it slowly enough that someone could picture the root going *down*. You will read sentences and short parts of this unit's passages aloud.",
      "*First, a little root grows down into the soil.* 读得慢一点，让听的人能想象根往 *down* 长下去。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },

  // Grade 2
  "grade-2-long-ago-and-today": {
    listening: t(
      "Long ago there were no light switches. *What did people use for light long ago?* Listen for what the candles were made from. You will hear this unit's passages about school, light and toys long ago and answer questions on them.",
      "很久以前没有电灯开关。*What did people use for light long ago?* 要听出蜡烛是用什么做的。本主题听本单元关于从前的学校、照明和玩具的短文，并回答问题。",
    ),
    aloud: t(
      "*A child might have a wooden top.* The word *might* tells you this is what some children had, so read it clearly. You will read sentences and short stretches of this unit's passages aloud.",
      "*A child might have a wooden top.* *might* 说明这是有些孩子才有的，要读清楚。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-2-our-neighborhood": {
    listening: t(
      "Ravi and his mom walk to the market and make several stops. *Where did Ravi and his mom stop first?* Only the first stop answers it. You will hear this unit's passages about markets, libraries and town helpers and answer questions on them.",
      "Ravi 和妈妈去市场，路上停了好几次。*Where did Ravi and his mom stop first?* 只有第一站是答案。本主题听本单元关于市场、图书馆和社区帮手的短文，并回答问题。",
    ),
    aloud: t(
      "*Firefighters put out fires and keep people safe.* Two jobs joined by *and*: read them as one smooth line. You will read sentences and short stretches about the helpers in our town aloud.",
      "*Firefighters put out fires and keep people safe.* 两件事由 *and* 连起来，要连贯地读成一句。本主题大声朗读本单元关于社区帮手的句子和小段落。",
    ),
  },
  "grade-2-animals-big-and-small": {
    listening: t(
      "The blue whale is the biggest animal on Earth, yet it eats something tiny. *What does a blue whale eat?* You will hear this unit's passages about hummingbirds, whales and a lion and a mouse, and answer questions on them.",
      "蓝鲸是地球上最大的动物，吃的却是很小的东西。*What does a blue whale eat?* 本主题听本单元关于蜂鸟、蓝鲸以及狮子和老鼠的短文，并回答问题。",
    ),
    aloud: t(
      "*It is not a dinosaur. It is the blue whale!* The first sentence sets up a surprise; let your voice rise with excitement on the second. You will read sentences and short stretches of this unit's passages aloud.",
      "*It is not a dinosaur. It is the blue whale!* 第一句埋下悬念，第二句要读出惊喜。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-2-tales-to-tell": {
    listening: t(
      'The boy shouts *Wolf!* when there is no wolf at all. *Why did the boy shout "Wolf!" the first time?* Listen for how he was feeling. You will hear this unit\'s old tales and answer questions about what happens in them.',
      '明明没有狼，男孩却大喊 *Wolf!*。*Why did the boy shout "Wolf!" the first time?* 要听出他当时的心情。本主题听本单元的经典故事，回答故事里发生了什么。',
    ),
    aloud: t(
      '*"Why do you work so hard?" asked the grasshopper.* A question goes up at the end, and *asked the grasshopper* comes back down. You will read sentences and short stretches of this unit\'s tales aloud.',
      '*"Why do you work so hard?" asked the grasshopper.* 问句结尾语调上扬，*asked the grasshopper* 再降下来。本主题大声朗读本单元故事里的句子和小段落。',
    ),
  },
  "grade-2-how-things-work": {
    listening: t(
      "A heavy box will not slide, but on a cart it rolls with one push. *Why do wheels make work easier?* You will hear this unit's passages about magnets, kites and wheels and answer questions on them.",
      "重箱子推不动，放到小车上一推就走。*Why do wheels make work easier?* 本主题听本单元关于磁铁、风筝和轮子的短文，并回答问题。",
    ),
    aloud: t(
      "*Wheels make work easier because they roll instead of rubbing.* The word *because* starts the reason, so take a breath just before it. You will read sentences and short stretches of this unit's passages aloud.",
      "*Wheels make work easier because they roll instead of rubbing.* *because* 后面是原因，在它前面换口气。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-2-letters-and-celebrations": {
    listening: t(
      "Families gather to look at the moon and share round cakes. *When is the Moon Festival?* You will hear this unit's passages and letters about festivals, parties and a birthday, and answer questions on them.",
      "一家人团聚赏月，分吃圆圆的月饼。*When is the Moon Festival?* 本主题听本单元关于节日、聚会和生日的短文和书信，并回答问题。",
    ),
    aloud: t(
      "*It has a pocket for my pencils and a place for my water.* A letter sounds like talking to someone you love, so read it warmly. You will read sentences and short stretches of this unit's letters and passages aloud.",
      "*It has a pocket for my pencils and a place for my water.* 书信像在和亲人说话，要读得亲切。本主题大声朗读本单元书信和短文里的句子和小段落。",
    ),
  },

  // Grade 3
  "grade-3-stories-and-fables": {
    listening: t(
      "Who is telling *The Kite Under the Stairs*? Not a child, but the kite itself. You will hear this unit's stories and fables read aloud and answer questions about narrators, feelings and lessons.",
      "*The Kite Under the Stairs* 是谁在讲？不是孩子，而是风筝自己。本主题听本单元故事和寓言的朗读，回答关于叙述者、人物感受和寓意的问题。",
    ),
    aloud: t(
      "*\"What's wrong?\" asked Ruby, who sat next to him.* Ruby's question should sound worried, and *who sat next to him* is extra information, read a little faster. You will read sentences and short stretches of this unit's stories aloud.",
      '*"What\'s wrong?" asked Ruby, who sat next to him.* Ruby 的问话要带着关心，*who sat next to him* 是补充说明，可以读快一点。本主题大声朗读本单元故事里的句子和小段落。',
    ),
  },
  "grade-3-how-plants-live": {
    listening: t(
      "A stem is like a highway. *Why does the writer compare a stem to a highway?* Listen for which way things travel through it. You will hear this unit's passages about roots, stems, leaves, flowers and seeds and answer questions on them.",
      "茎像一条公路。*Why does the writer compare a stem to a highway?* 要听出东西在茎里往哪个方向走。本主题听本单元关于根、茎、叶、花和种子的短文，并回答问题。",
    ),
    aloud: t(
      "*Every plant needs four things: light, water, air and a place to grow.* After the colon comes a list; pause lightly between the four things. You will read sentences and short stretches of this unit's passages aloud.",
      "*Every plant needs four things: light, water, air and a place to grow.* 冒号后面是列举，四样东西之间轻轻停顿。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-3-how-animals-survive": {
    listening: t(
      "Farmers shout, bang pots and light fires, yet the elephants keep raiding the fields. *What happened when the farmers shouted, banged pots and lit fires?* You will hear this unit's passages about how animals survive and answer questions on them.",
      "农民大喊、敲锅、点火，大象却还是来闯田。*What happened when the farmers shouted, banged pots and lit fires?* 本主题听本单元关于动物如何生存的短文，并回答问题。",
    ),
    aloud: t(
      "*This kind of hiding is called camouflage.* Slow down on the new word, *CAM-uh-flahzh*, so the listener catches it. You will read sentences and short stretches of this unit's passages aloud.",
      "*This kind of hiding is called camouflage.* 读到新词 *camouflage*（*CAM-uh-flahzh*）要放慢，让听的人听清。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-3-weather-and-climate": {
    listening: t(
      "Many people think summer comes because Earth moves closer to the sun. *What mistaken idea does the passage correct?* You will hear this unit's passages about sun, wind, storms and seasons and answer questions on them.",
      "很多人以为夏天是因为地球离太阳更近。*What mistaken idea does the passage correct?* 本主题听本单元关于太阳、风、风暴和季节的短文，并回答问题。",
    ),
    aloud: t(
      "*The atmosphere is made of gases.* A short, firm sentence: say *atmosphere* as *AT-muh-sfeer* and stop cleanly at the period. You will read sentences and short stretches of this unit's passages aloud.",
      "*The atmosphere is made of gases.* 简短有力的一句：*atmosphere* 读作 *AT-muh-sfeer*，句号处干脆收住。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-3-our-world-on-a-map": {
    listening: t(
      "Look at most maps: north is at the top. *On most maps, where is east?* You will hear this unit's passages about map keys, directions, continents and oceans and answer questions on them.",
      "大多数地图上北在上方。*On most maps, where is east?* 本主题听本单元关于图例、方向、大洲和大洋的短文，并回答问题。",
    ),
    aloud: t(
      "*A map is a drawing of a place as it looks from high above.* This sentence defines a word, so give *map* a little weight at the start. You will read sentences and short stretches of this unit's passages aloud.",
      "*A map is a drawing of a place as it looks from high above.* 这是给词下定义的句子，开头的 *map* 要稍加重。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-3-life-on-the-nile": {
    listening: t(
      "Every summer the Nile rose over its banks, though Egypt is a land of desert. *What caused the Nile to flood every summer?* You will hear this unit's passages about farming, pharaohs, pyramids and hieroglyphs and answer questions on them.",
      "埃及遍地沙漠，尼罗河却每年夏天泛滥。*What caused the Nile to flood every summer?* 本主题听本单元关于农耕、法老、金字塔和象形文字的短文，并回答问题。",
    ),
    aloud: t(
      "*How could so many people live in a desert?* A question the writer asks you; let it rise, then read the answer that follows. You will read sentences and short stretches of this unit's passages aloud.",
      "*How could so many people live in a desert?* 作者在向你提问，语调上扬，再读出紧接着的答案。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-3-along-the-yellow-river": {
    listening: t(
      "The first farmers in northern China grew millet, not rice. *Why did the first farmers in the north grow millet instead of rice?* You will hear this unit's passages about the Yellow River, bronze, oracle bones and the Great Wall and answer questions on them.",
      "中国北方最早的农民种的是小米，不是稻米。*Why did the first farmers in the north grow millet instead of rice?* 本主题听本单元关于黄河、青铜器、甲骨和长城的短文，并回答问题。",
    ),
    aloud: t(
      "*The water looks like thick soup the color of sand.* Let the picture come through: *thick soup* / *the color of sand*. You will read sentences and short stretches of this unit's passages aloud.",
      "*The water looks like thick soup the color of sand.* 把画面读出来：*thick soup* / *the color of sand*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-3-pushes-pulls-and-magnets": {
    listening: t(
      "In tug of war, both teams pull as hard as they can. *What happens when both teams pull with the same strength?* You will hear this unit's passages about forces, friction, ramps and magnets and answer questions on them.",
      "拔河时两队都拼命拉。*What happens when both teams pull with the same strength?* 本主题听本单元关于力、摩擦力、斜坡和磁铁的短文，并回答问题。",
    ),
    aloud: t(
      "*When you push something, you move it away from you.* The comma splits the *when* part from what happens; pause there. You will read sentences and short stretches of this unit's passages aloud.",
      "*When you push something, you move it away from you.* 逗号把 *when* 部分和结果分开，在那里停一下。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-3-making-music": {
    listening: t(
      "Violins, cellos and a giant bass all have strings. *Which string instrument plays the lowest notes?* You will hear this unit's passages about beat, pitch and the families of the orchestra and answer questions on them.",
      "小提琴、大提琴和巨大的低音提琴都有弦。*Which string instrument plays the lowest notes?* 本主题听本单元关于节拍、音高和管弦乐器家族的短文，并回答问题。",
    ),
    aloud: t(
      "*Can you feel a tiny buzzing?* The passage talks to you, so ask it like a real question. You will read sentences and short stretches of this unit's passages aloud.",
      "*Can you feel a tiny buzzing?* 文章在和你对话，要像真的在提问那样读。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-3-poems-for-all-seasons": {
    listening: t(
      "One poem compares the summer sun to something fierce. *What does the poet compare the sun to?* You will hear this unit's poems about puddles, bees, fireflies and falling leaves and answer questions on them.",
      "有一首诗把夏天的太阳比作一样猛烈的东西。*What does the poet compare the sun to?* 本主题听本单元关于水坑、蜜蜂、萤火虫和落叶的诗，并回答问题。",
    ),
    aloud: t(
      "*The air was cold and sharp and clean. My footsteps crunched across the ground.* A poem has a beat: let *clean* and *ground* ring as a pair. You will read lines and short stretches of this unit's poems aloud.",
      "*The air was cold and sharp and clean. My footsteps crunched across the ground.* 诗有节奏：让 *clean* 和 *ground* 押着韵响起来。本主题大声朗读本单元诗歌里的诗句和小段。",
    ),
  },

  // Grade 4
  "grade-4-our-changing-earth": {
    listening: t(
      "Magma and lava are the same melted rock with two names. *What is the difference between magma and lava?* You will hear this unit's passages about rocks, plates, volcanoes and earthquakes and answer questions on them.",
      "magma 和 lava 是同一种熔岩的两个名字。*What is the difference between magma and lava?* 本主题听本单元关于岩石、板块、火山和地震的短文，并回答问题。",
    ),
    aloud: t(
      "*Compared with the whole Earth, the crust is very thin, like the skin of a peach.* Two commas, three parts: build up to the comparison at the end. You will read sentences and short stretches of this unit's passages aloud.",
      "*Compared with the whole Earth, the crust is very thin, like the skin of a peach.* 两个逗号分出三部分，最后的比喻要读得清楚。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-4-deserts-rainforests-and-polar-lands": {
    listening: t(
      "The fennec fox lives in the Sahara, one of the hottest places on Earth. *How does the fennec fox avoid the heat of the day?* You will hear this unit's passages about deserts, rainforests and polar lands and answer questions on them.",
      "耳廓狐生活在地球上最热的地方之一——撒哈拉。*How does the fennec fox avoid the heat of the day?* 本主题听本单元关于沙漠、雨林和极地的短文，并回答问题。",
    ),
    aloud: t(
      "*A biome is a large area with its own climate and its own kinds of plants and animals.* Say *biome* as *BY-ohm*, and keep *its own* … *its own* even. You will read sentences and short stretches of this unit's passages aloud.",
      "*A biome is a large area with its own climate and its own kinds of plants and animals.* *biome* 读作 *BY-ohm*，两个 *its own* 读得一样平稳。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-4-the-human-body": {
    listening: t(
      "Arteries and veins both carry blood, but in opposite directions. *What is the difference between arteries and veins?* You will hear this unit's passages about bones, muscles, the heart, lungs and brain and answer questions on them.",
      "动脉和静脉都运送血液，但方向相反。*What is the difference between arteries and veins?* 本主题听本单元关于骨骼、肌肉、心脏、肺和大脑的短文，并回答问题。",
    ),
    aloud: t(
      "*A single drop of blood holds millions of them, and your whole body has trillions.* Let *millions* and *trillions* stand out: the second is far bigger. You will read sentences and short stretches of this unit's passages aloud.",
      "*A single drop of blood holds millions of them, and your whole body has trillions.* 突出 *millions* 和 *trillions*，后者大得多。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-4-energy-all-around": {
    listening: t(
      "Heat moves between a cup of cocoa and your hands, but only one way. *Which way does heat always flow?* You will hear this unit's passages about motion, heat, light, sound and electricity and answer questions on them.",
      "热量在一杯热可可和你的手之间传递，但只朝一个方向。*Which way does heat always flow?* 本主题听本单元关于运动、热、光、声和电的短文，并回答问题。",
    ),
    aloud: t(
      "*A ball rolls, a kettle boils, a plant grows toward the light, and a lamp lights up a dark room.* Four short pictures in a row: pause at each comma and keep an even pace. You will read sentences and short stretches of this unit's passages aloud.",
      "*A ball rolls, a kettle boils, a plant grows toward the light, and a lamp lights up a dark room.* 四个画面接连出现，逗号处都停一下，节奏要均匀。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-4-tall-tales-and-tricksters": {
    listening: t(
      "Fox invites Rabbit to dinner, but not to share the food. *Why did Fox invite Rabbit to dinner?* You will hear this unit's tall tales and trickster stories and answer questions about what the characters want and do.",
      "狐狸请兔子吃饭，可不是为了分享美食。*Why did Fox invite Rabbit to dinner?* 本主题听本单元的夸张故事和机智故事，回答人物想要什么、做了什么。",
    ),
    aloud: t(
      "*By ten, she could rope a whole herd of cattle with a single throw and tie them up in a bow.* A tall tale is told with a straight face; read the impossible part as if it were true. You will read sentences and short stretches of this unit's tales aloud.",
      "*By ten, she could rope a whole herd of cattle with a single throw and tie them up in a bow.* 夸张故事要一本正经地讲，把不可能的事读得像真的一样。本主题大声朗读本单元故事里的句子和小段落。",
    ),
  },
  "grade-4-life-in-the-middle-ages": {
    listening: t(
      "Monks copied books by hand, and they sat by the windows to do it. *Why did monks work by the windows?* You will hear this unit's passages about castles, knights, manors and towns and answer questions on them.",
      "修士手抄书籍，而且总坐在窗边抄。*Why did monks work by the windows?* 本主题听本单元关于城堡、骑士、庄园和城镇的短文，并回答问题。",
    ),
    aloud: t(
      "*It was like a pyramid of promises, with the king at the top and the peasants at the bottom.* Set *top* against *bottom* so the listener sees the pyramid. You will read sentences and short stretches of this unit's passages aloud.",
      "*It was like a pyramid of promises, with the king at the top and the peasants at the bottom.* 把 *top* 和 *bottom* 对比着读，让听的人看到这座金字塔。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-4-the-silk-road": {
    listening: t(
      "In Europe, pepper was so precious that people sometimes paid their rent with it. *Which detail supports the point that spices were precious in Europe?* You will hear this unit's passages about silk, caravans, markets and ideas on the move and answer questions on them.",
      "在欧洲，胡椒珍贵到有人用它交房租。*Which detail supports the point that spices were precious in Europe?* 本主题听本单元关于丝绸、商队、集市和思想传播的短文，并回答问题。",
    ),
    aloud: t(
      "*The Silk Road was a huge web of routes that linked China to Central Asia, India, the Middle East and Europe.* Read the list of places as a journey, with a light pause at each comma. You will read sentences and short stretches of this unit's passages aloud.",
      "*The Silk Road was a huge web of routes that linked China to Central Asia, India, the Middle East and Europe.* 把这串地名读成一段旅程，每个逗号处轻轻停顿。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-4-art-and-artists": {
    listening: t(
      "Some of the oldest paintings in the world were found because of a dog. *How were the Lascaux paintings found?* You will hear this unit's passages about cave paintings, colors, portraits, landscapes and sculpture and answer questions on them.",
      "世界上最古老的一些绘画是因为一只狗才被发现的。*How were the Lascaux paintings found?* 本主题听本单元关于洞穴壁画、色彩、肖像、山水画和雕塑的短文，并回答问题。",
    ),
    aloud: t(
      "*Long before anyone could write, humans carved shapes into bone and painted animals on rock.* Open slowly on *Long before*, then let the two actions follow. You will read sentences and short stretches of this unit's passages aloud.",
      "*Long before anyone could write, humans carved shapes into bone and painted animals on rock.* 开头 *Long before* 读得慢一些，再接上后面两个动作。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-4-plays-for-the-stage": {
    listening: t(
      "In one play, the queen forbids the rain from falling. *Why does the queen forbid the rain?* You will hear this unit's short plays read aloud and answer questions about the characters, their problems and how things turn out.",
      "有一部剧里，女王下令不许下雨。*Why does the queen forbid the rain?* 本主题听本单元短剧的朗读，回答关于人物、问题和结局的问题。",
    ),
    aloud: t(
      "*MAYA: Of course I looked in my coat. I'm not a baby, Leo.* In a play you speak as the character: Maya sounds annoyed. You will read lines and short scenes from this unit's plays aloud.",
      "*MAYA: Of course I looked in my coat. I'm not a baby, Leo.* 读剧本要以角色的口吻说话：Maya 有点不耐烦。本主题大声朗读本单元剧本里的台词和小片段。",
    ),
  },
  "grade-4-lives-that-made-a-difference": {
    listening: t(
      "At Louis Braille's school, the books for blind readers were huge and heavy. *Why was reading slow at Louis's school?* You will hear this unit's passages about inventors, scientists and a tree planter and answer questions on them.",
      "在路易·布莱叶的学校，给盲人读的书又大又重。*Why was reading slow at Louis's school?* 本主题听本单元关于发明家、科学家和植树人的短文，并回答问题。",
    ),
    aloud: t(
      "*When Mary was about twelve, she and her brother found the skull of a strange creature in the cliffs.* Build toward the discovery at the end of the sentence. You will read sentences and short stretches of this unit's passages aloud.",
      "*When Mary was about twelve, she and her brother found the skull of a strange creature in the cliffs.* 语气逐渐推向句末的发现。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },

  // Grade 5
  "grade-5-water-on-earth": {
    listening: t(
      "A cold glass gets wet on the outside, though nothing spilled. *Where does the water on the outside of the cold glass come from?* You will hear this unit's passages about water's forms, clouds, rain and rivers and answer questions on them.",
      "冰水杯外面湿了，可并没有洒出水来。*Where does the water on the outside of the cold glass come from?* 本主题听本单元关于水的形态、云、降水和河流的短文，并回答问题。",
    ),
    aloud: t(
      "*If you could pour all of Earth's water into one hundred cups, more than ninety-seven of them would be filled from the oceans.* Hold the *if* part, then land on the number. You will read sentences and short stretches of this unit's passages aloud.",
      "*If you could pour all of Earth's water into one hundred cups, more than ninety-seven of them would be filled from the oceans.* 先撑住 *if* 部分，再落在那个数字上。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-5-matter-and-its-changes": {
    listening: t(
      "A class mixes baking soda and vinegar on a scale. *What question did the class want to answer?* You will hear this unit's passages about particles, states of matter, mixtures and new substances and answer questions on them.",
      "全班把小苏打和醋放在秤上混合。*What question did the class want to answer?* 本主题听本单元关于微粒、物质状态、混合物和新物质的短文，并回答问题。",
    ),
    aloud: t(
      "*A bowling ball has more mass than a beach ball of the same size, which is why it is much harder to lift.* Compare the two balls, then pause before *which is why*. You will read sentences and short stretches of this unit's passages aloud.",
      "*A bowling ball has more mass than a beach ball of the same size, which is why it is much harder to lift.* 先比较两个球，在 *which is why* 前稍停。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-5-the-world-under-a-microscope": {
    listening: t(
      "One bacterium becomes two, then four, then eight. *How quickly can one bacterium become two?* You will hear this unit's passages about cells, pond life, bacteria, fungi, yeast and viruses and answer questions on them.",
      "一个细菌变两个，再变四个、八个。*How quickly can one bacterium become two?* 本主题听本单元关于细胞、池塘微生物、细菌、真菌、酵母和病毒的短文，并回答问题。",
    ),
    aloud: t(
      "*When he looked at a drop of rainwater, he saw something no one had ever seen before.* Slow down toward the end, where the discovery is. You will read sentences and short stretches of this unit's passages aloud.",
      "*When he looked at a drop of rainwater, he saw something no one had ever seen before.* 读到句末的发现时放慢。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-5-the-solar-system": {
    listening: t(
      "Jupiter and Saturn are giants, yet no spaceship could ever land on them. *Why could a spaceship never land on the giant planets?* You will hear this unit's passages about day and night, the moon, the planets and comets and answer questions on them.",
      "木星和土星是巨行星，可飞船永远无法在上面着陆。*Why could a spaceship never land on the giant planets?* 本主题听本单元关于昼夜、月相、行星和彗星的短文，并回答问题。",
    ),
    aloud: t(
      "*It is so big that more than one million Earths could fit inside it.* *So big that* builds up to the number; give *one million* its full weight. You will read sentences and short stretches of this unit's passages aloud.",
      "*It is so big that more than one million Earths could fit inside it.* *so big that* 一路铺垫到数字，*one million* 要读得有分量。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-5-ancient-greece": {
    listening: t(
      "Democracy is a Greek word made of two smaller words. *Where does the word democracy come from?* You will hear this unit's passages about city-states, Athens, Sparta, the Olympics and Greek thinkers and answer questions on them.",
      "democracy 是由两个希腊词组成的。*Where does the word democracy come from?* 本主题听本单元关于城邦、雅典、斯巴达、奥运会和希腊思想家的短文，并回答问题。",
    ),
    aloud: t(
      "*Because the mountains made travel over land slow and hard, villages in different valleys grew up apart from one another.* The cause comes first: carry it to the comma, then give the result. You will read sentences and short stretches of this unit's passages aloud.",
      "*Because the mountains made travel over land slow and hard, villages in different valleys grew up apart from one another.* 原因在前，一口气读到逗号，再说出结果。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-5-the-maya-aztec-and-inca": {
    listening: t(
      "Machu Picchu sits in a land of earthquakes, yet its walls still stand. *Why have the walls of Machu Picchu survived many earthquakes?* You will hear this unit's passages about the Maya, Aztec and Inca and answer questions on them.",
      "马丘比丘位于多地震的地方，城墙却至今屹立。*Why have the walls of Machu Picchu survived many earthquakes?* 本主题听本单元关于玛雅、阿兹特克和印加的短文，并回答问题。",
    ),
    aloud: t(
      "*The Maya had no metal tools, no wheels for carrying loads and no horses or oxen.* Three *no*s in a row: give each one the same stress. You will read sentences and short stretches of this unit's passages aloud.",
      "*The Maya had no metal tools, no wheels for carrying loads and no horses or oxen.* 连续三个 *no*，每个都要同样重读。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-5-bridges-towers-and-domes": {
    listening: t(
      'A bridge in Washington State rose and fell in waves, even on calm days. *Why was the bridge nicknamed "Galloping Gertie"?* You will hear this unit\'s passages about arches, domes, towers and bridges and answer questions on them.',
      '美国华盛顿州有座桥，即使风平浪静也会上下起伏。*Why was the bridge nicknamed "Galloping Gertie"?* 本主题听本单元关于拱、穹顶、高楼和桥梁的短文，并回答问题。',
    ),
    aloud: t(
      "*The paper has not changed, but its shape has.* The point of the experiment sits after *but*; stress *shape*. You will read sentences and short stretches of this unit's passages aloud.",
      "*The paper has not changed, but its shape has.* 实验的要点在 *but* 后面，重读 *shape*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-5-mysteries-and-detectives": {
    listening: t(
      "Small round footprints with four little marks lead through the flour. *Why did Tess think the thief was not a person?* You will hear this unit's mystery stories and answer questions about clues and what the detectives conclude.",
      "面粉上留下一串小小的圆脚印，还有四个小印子。*Why did Tess think the thief was not a person?* 本主题听本单元的推理故事，回答关于线索和侦探推断的问题。",
    ),
    aloud: t(
      "*The glass was not broken, and the little lock on the door was not scratched.* Two clues, each with *not*: let the listener notice both. You will read sentences and short stretches of this unit's stories aloud.",
      "*The glass was not broken, and the little lock on the door was not scratched.* 两条线索都带 *not*，要让听的人都注意到。本主题大声朗读本单元故事里的句子和小段落。",
    ),
  },
  "grade-5-stories-of-survival": {
    listening: t(
      "Caught by a current, a girl in *Adrift* paddles hard toward the shore and gets nowhere. *Why did paddling straight toward shore not work?* You will hear this unit's survival stories and answer questions about the dangers and the choices people make.",
      "*Adrift* 里的女孩被水流卷住，拼命朝岸边划，却毫无进展。*Why did paddling straight toward shore not work?* 本主题听本单元的求生故事，回答关于危险和人物抉择的问题。",
    ),
    aloud: t(
      "*One moment he could see the next red post on the ridge ahead of him; the next, there was only gray.* The semicolon is the moment the fog arrives: pause, then drop your voice on *only gray*. You will read sentences and short stretches of this unit's stories aloud.",
      "*One moment he could see the next red post on the ridge ahead of him; the next, there was only gray.* 分号处就是浓雾袭来的一刻：停顿，再压低声音读 *only gray*。本主题大声朗读本单元故事里的句子和小段落。",
    ),
  },
  "grade-5-letters-and-diaries-from-the-past": {
    listening: t(
      "Long ago, every word of a telegram cost money. *Why did people use as few words as possible in telegrams?* You will hear this unit's letters and diaries from the past and answer questions about the writers' lives.",
      "从前发电报，每个字都要花钱。*Why did people use as few words as possible in telegrams?* 本主题听本单元从前的书信和日记，回答关于写信人生活的问题。",
    ),
    aloud: t(
      "*Instead, two mules walk along a path beside the canal, pulling the boat with a rope.* The diary writer is describing what she sees; read it as if you were there. You will read sentences and short stretches of this unit's letters and diaries aloud.",
      "*Instead, two mules walk along a path beside the canal, pulling the boat with a rope.* 日记作者在描述眼前的景象，读的时候就像身临其境。本主题大声朗读本单元书信和日记里的句子和小段落。",
    ),
  },
  // Grade 6
  "grade-6-myths-and-legends": {
    listening: t(
      "Before Hou Yi drew his bow, ten suns crossed the sky by turns. *How did the ten suns behave before the trouble began?* You will hear this unit's myths from Greece and China and answer questions on what happens in them and why.",
      "后羿拉弓之前，十个太阳轮流在天上走。*How did the ten suns behave before the trouble began?* 本主题听本单元来自希腊和中国的神话，回答其中发生了什么、为什么发生。",
    ),
    aloud: t(
      "*He swung a great axe, and the egg cracked open.* A myth is told with ceremony: give *great axe* weight and let *cracked open* land. You will read sentences and short stretches of this unit's myths aloud.",
      "*He swung a great axe, and the egg cracked open.* 神话要讲得庄重：*great axe* 有分量，*cracked open* 稳稳落下。本主题大声朗读本单元神话里的句子和小段落。",
    ),
  },
  "grade-6-poetry-and-song": {
    listening: t(
      "Rain on a tin roof can *patter*, *ping* and *gurgle*. *Which group of words from the poem is onomatopoeia?* You will hear this unit's poems and stories and answer questions about sound devices, conflict and theme.",
      "雨落在铁皮屋顶上会 *patter*、*ping*、*gurgle*。*Which group of words from the poem is onomatopoeia?* 本主题听本单元的诗歌和故事，回答关于声音修辞、冲突和主题的问题。",
    ),
    aloud: t(
      "*It rattled the windows of every house on Pine Street, as if it were knocking to be let in.* The wind is a person here; let *knocking to be let in* sound like it. You will read sentences and short stretches of this unit's poems and stories aloud.",
      "*It rattled the windows of every house on Pine Street, as if it were knocking to be let in.* 这里风被写成了人，*knocking to be let in* 要读出敲门的味道。本主题大声朗读本单元诗歌和故事里的句子和小段落。",
    ),
  },
  "grade-6-ancient-rome": {
    listening: t(
      "The Roman Republic chose two consuls each year, never one. *Why did the Republic have two consuls instead of one?* You will hear this unit's passages about the Republic, roads, aqueducts, Pompeii and the Colosseum and answer questions on them.",
      "罗马共和国每年选两位执政官，从不只选一位。*Why did the Republic have two consuls instead of one?* 本主题听本单元关于共和国、道路、引水渠、庞贝和斗兽场的短文，并回答问题。",
    ),
    aloud: t(
      "*But the basket that held the babies did not sink.* After a cruel order, *But* turns the story; give it a beat before going on. You will read sentences and short stretches of this unit's passages aloud.",
      "*But the basket that held the babies did not sink.* 一道残忍的命令之后，*But* 让故事转折，读到它要稍停。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-6-the-first-cities": {
    listening: t(
      "Unlike the Nile, the rivers of Mesopotamia flooded without warning. *How were the rivers of Mesopotamia different from the Nile?* You will hear this unit's passages about ziggurats, cuneiform, scribes and Hammurabi's laws and answer questions on them.",
      "和尼罗河不同，美索不达米亚的河流泛滥毫无规律。*How were the rivers of Mesopotamia different from the Nile?* 本主题听本单元关于塔庙、楔形文字、书吏和汉谟拉比法典的短文，并回答问题。",
    ),
    aloud: t(
      '*The Greeks later called it Mesopotamia, which means "the land between the rivers."* Say *Mesopotamia* as *mes-uh-puh-TAY-mee-uh*, then read the meaning a little slower. You will read sentences and short stretches of this unit\'s passages aloud.',
      '*The Greeks later called it Mesopotamia, which means "the land between the rivers."* *Mesopotamia* 读作 *mes-uh-puh-TAY-mee-uh*，后面的释义稍慢些。本主题大声朗读本单元短文里的句子和小段落。',
    ),
  },
  "grade-6-the-restless-earth": {
    listening: t(
      "Where two plates pull apart, something new appears between them. *What happens at a divergent boundary?* You will hear this unit's passages about the earth's layers, plate boundaries, volcanoes and earthquakes and answer questions on them.",
      "两个板块彼此分离的地方，中间会出现新东西。*What happens at a divergent boundary?* 本主题听本单元关于地球圈层、板块边界、火山和地震的短文，并回答问题。",
    ),
    aloud: t(
      "*He called his idea continental drift.* A short sentence that names a big idea: stress *continental drift*. You will read sentences and short stretches of this unit's passages aloud.",
      "*He called his idea continental drift.* 短句点出一个重要概念，重读 *continental drift*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-6-living-cells": {
    listening: t(
      "Van Helmont grew a willow in a pot of weighed soil for five years. *What evidence did van Helmont have that plants do not eat soil?* You will hear this unit's passages about organelles, plant and animal cells, energy and heredity and answer questions on them.",
      "范·海尔蒙特在称过重量的一盆土里种了五年柳树。*What evidence did van Helmont have that plants do not eat soil?* 本主题听本单元关于细胞器、动植物细胞、能量和遗传的短文，并回答问题。",
    ),
    aloud: t(
      "*They reminded him of the small rooms in which monks lived, which were called cells.* Two *which* clauses: pause lightly before the second so the word *cells* comes out clearly. You will read sentences and short stretches of this unit's passages aloud.",
      "*They reminded him of the small rooms in which monks lived, which were called cells.* 两个 *which* 从句，在第二个前轻停，让 *cells* 清楚地出来。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-6-memories-and-growing-up": {
    listening: t(
      "The smell of ginger takes one writer straight back to her grandmother's kitchen. *What does the smell of ginger do for the writer now?* You will hear this unit's memoirs and answer questions about the writers' feelings and what they learned.",
      "姜的气味一下子把作者带回外婆的厨房。*What does the smell of ginger do for the writer now?* 本主题听本单元的回忆性散文，回答关于作者感受和成长收获的问题。",
    ),
    aloud: t(
      "*My fear had a reason, or at least a story.* The writer corrects herself mid-sentence; pause at the comma and read *or at least a story* more quietly. You will read sentences and short stretches of this unit's memoirs aloud.",
      "*My fear had a reason, or at least a story.* 作者话说一半改了口：逗号处停一下，*or at least a story* 读得轻一些。本主题大声朗读本单元回忆散文里的句子和小段落。",
    ),
  },
  "grade-6-food-for-everyone": {
    listening: t(
      "Bees carry pollen from flower to flower, and much of our food depends on it. *What is pollination?* You will hear this unit's passages about farming, city gardens, food waste and a seed vault and answer questions on them.",
      "蜜蜂把花粉从一朵花带到另一朵，我们的许多食物都靠它。*What is pollination?* 本主题听本单元关于农业、城市菜园、食物浪费和种子库的短文，并回答问题。",
    ),
    aloud: t(
      "*Carbohydrates, found in bread, rice, pasta and fruit, are the body's main source of energy.* The examples sit inside commas; drop your voice for them, then come back up for the main point. You will read sentences and short stretches of this unit's passages aloud.",
      "*Carbohydrates, found in bread, rice, pasta and fruit, are the body's main source of energy.* 逗号里的例子要降低声调，主干部分再提上来。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-6-sport-and-fair-play": {
    listening: t(
      "A runner jumps the start after the starter has already warned the field once. *What happens?* You will hear this unit's passages about referees, rules, practice and sportsmanship and answer questions, some of which ask you to apply a rule you heard.",
      "发令员已经警告过一次后，又有选手抢跑。*What happens?* 本主题听本单元关于裁判、规则、训练和体育精神的短文并回答问题，有些题要你运用听到的规则。",
    ),
    aloud: t(
      "*Historians are not sure the story is true.* After a famous legend, this flat sentence brings us back to fact; read it plainly. You will read sentences and short stretches of this unit's passages aloud.",
      "*Historians are not sure the story is true.* 在一段著名传说之后，这句平实的话把我们拉回事实，要读得平稳。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },

  // Grade 7
  "grade-7-making-the-case": {
    listening: t(
      "Workers measured eighty-four degrees on a shady street and ninety-three on a bare one. *Which is the strongest evidence for the claim that trees cool streets?* You will hear this unit's arguments and answer questions about claims, evidence and reasoning.",
      "工人在林荫街测得 84 度，在光秃秃的街上测得 93 度。*Which is the strongest evidence for the claim that trees cool streets?* 本主题听本单元的议论文，回答关于观点、论据和推理的问题。",
    ),
    aloud: t(
      "*Our middle school should start at nine o'clock instead of a quarter to eight.* This is the writer's claim; say it with conviction and stress *should*. You will read sentences and short stretches of this unit's arguments aloud.",
      "*Our middle school should start at nine o'clock instead of a quarter to eight.* 这是作者的观点，要读得坚定，重读 *should*。本主题大声朗读本单元议论文里的句子和小段落。",
    ),
  },
  "grade-7-oceans-and-ecosystems": {
    listening: t(
      "Humpback whales swim thousands of miles to warm water every winter. *Why do humpback whales travel to tropical waters in winter?* You will hear this unit's passages about plankton, reefs, kelp forests, food webs and plastic and answer questions on them.",
      "座头鲸每年冬天游上几千英里去温暖的海域。*Why do humpback whales travel to tropical waters in winter?* 本主题听本单元关于浮游生物、珊瑚礁、海藻林、食物网和塑料污染的短文，并回答问题。",
    ),
    aloud: t(
      "*Below it lies the twilight zone, which extends to about three thousand feet.* The sentence takes you deeper; read *twilight zone* clearly and the depth at an even pace. You will read sentences and short stretches of this unit's passages aloud.",
      "*Below it lies the twilight zone, which extends to about three thousand feet.* 句子带你往深处去，*twilight zone* 要读清，深度数字平稳读出。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-7-the-renaissance": {
    listening: t(
      "Gutenberg did not invent printing, yet his press changed Europe. *What was new about Gutenberg's achievement?* You will hear this unit's passages about the Medici, artists' workshops, Leonardo, the printing press and Galileo and answer questions on them.",
      "印刷术并非古腾堡发明，他的印刷机却改变了欧洲。*What was new about Gutenberg's achievement?* 本主题听本单元关于美第奇家族、艺术作坊、达·芬奇、印刷机和伽利略的短文，并回答问题。",
    ),
    aloud: t(
      "*Italian scholars could walk past the past every day, and many of them began to search monasteries for forgotten copies of ancient books.* Enjoy the play on *walk past the past*, then read on without rushing. You will read sentences and short stretches of this unit's passages aloud.",
      "*Italian scholars could walk past the past every day, and many of them began to search monasteries for forgotten copies of ancient books.* 读出 *walk past the past* 的文字游戏，后半句从容读完。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-7-empires-of-west-africa": {
    listening: t(
      "Timbuktu stood where camels from the desert met boats on the Niger. *Why was Timbuktu a natural meeting point?* You will hear this unit's passages about the salt and gold trade, Mansa Musa, griots and Songhai and answer questions on them.",
      "廷巴克图正是沙漠驼队与尼日尔河船只交汇之处。*Why was Timbuktu a natural meeting point?* 本主题听本单元关于盐金贸易、曼萨·穆萨、格里奥说唱艺人和桑海帝国的短文，并回答问题。",
    ),
    aloud: t(
      "*To the south lay mines where workers dug gold from riverbanks. To the north, in the heart of the Sahara, lay mines of salt.* Set *south* against *north*, gold against salt. You will read sentences and short stretches of this unit's passages aloud.",
      "*To the south lay mines where workers dug gold from riverbanks. To the north, in the heart of the Sahara, lay mines of salt.* 把 *south* 和 *north*、金和盐对照着读。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-7-fighting-disease": {
    listening: t(
      "Deaths clustered around one water pump in London, but that alone proved nothing. *Why did the cluster of deaths around the pump not prove that the water caused cholera?* You will hear this unit's passages about how doctors found the causes of disease and answer questions on them.",
      "伦敦的死亡病例集中在一台水泵周围，但光凭这一点什么也证明不了。*Why did the cluster of deaths around the pump not prove that the water caused cholera?* 本主题听本单元关于医生如何找出病因的短文，并回答问题。",
    ),
    aloud: t(
      '*Miasma is a Greek word meaning "pollution."* Say *miasma* as *my-AZ-muh* and give the meaning a small pause before it. You will read sentences and short stretches of this unit\'s passages aloud.',
      '*Miasma is a Greek word meaning "pollution."* *miasma* 读作 *my-AZ-muh*，释义前稍作停顿。本主题大声朗读本单元短文里的句子和小段落。',
    ),
  },
  "grade-7-money-and-business": {
    listening: t(
      "Every choice costs you the next best thing you did not choose. *What is opportunity cost?* You will hear this unit's passages about coins, banks, prices, a small business and inflation and answer questions on them.",
      "每做一个选择，都要放弃没选的那个次优选项。*What is opportunity cost?* 本主题听本单元关于钱币、银行、价格、小生意和通货膨胀的短文，并回答问题。",
    ),
    aloud: t(
      "*Without money, you would have to find a shoemaker who wants eggs.* The example is meant to be a little funny; let *who wants eggs* come out with a smile. You will read sentences and short stretches of this unit's passages aloud.",
      "*Without money, you would have to find a shoemaker who wants eggs.* 这个例子有点好笑，*who wants eggs* 可以带着笑意读。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-7-imagined-futures": {
    listening: t(
      "On a ship that will travel for generations, nothing is ever thrown away. *Why does the ship waste nothing?* You will hear this unit's science fiction and answer questions about settings, characters and the worlds they live in.",
      "在一艘要航行好几代人的飞船上，什么都不会被扔掉。*Why does the ship waste nothing?* 本主题听本单元的科幻作品，回答关于背景、人物和他们所处世界的问题。",
    ),
    aloud: t(
      '*The name is a joke in Greek: it can mean "good place," but it also means "no place."* The joke turns on *but*; pause there and stress *no place*. You will read sentences and short stretches of this unit\'s passages and stories aloud.',
      '*The name is a joke in Greek: it can mean "good place," but it also means "no place."* 笑点在 *but* 处，停一下再重读 *no place*。本主题大声朗读本单元短文和故事里的句子和小段落。',
    ),
  },
  "grade-7-rights-and-reform": {
    listening: t(
      "Lincoln's address at Gettysburg was only ten sentences long. *How did Lincoln organize his argument?* You will hear this unit's passages about votes for women, Gandhi's march, child labor and the bus boycott and answer questions on them.",
      "林肯的葛底斯堡演说只有十句话。*How did Lincoln organize his argument?* 本主题听本单元关于女性选举权、甘地游行、童工和公交抵制运动的短文，并回答问题。",
    ),
    aloud: t(
      "*For two years, they argued over every word.* Short and heavy: slow down on *every word*. You will read sentences and short stretches of this unit's passages aloud.",
      "*For two years, they argued over every word.* 简短而沉重，*every word* 要放慢。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-7-flight": {
    listening: t(
      "Before people flew, a sheep, a duck and a rooster rode a hot-air balloon. *Why does a bag full of hot air rise?* You will hear this unit's passages about wings, balloons, the Wright brothers, Bessie Coleman and air traffic control and answer questions on them.",
      "人类飞上天之前，一只羊、一只鸭和一只公鸡先坐上了热气球。*Why does a bag full of hot air rise?* 本主题听本单元关于机翼、热气球、莱特兄弟、贝茜·科尔曼和空中交通管制的短文，并回答问题。",
    ),
    aloud: t(
      "*Understanding these four forces is the first step to understanding how anything flies.* A long subject comes first; carry *Understanding these four forces* as one group. You will read sentences and short stretches of this unit's passages aloud.",
      "*Understanding these four forces is the first step to understanding how anything flies.* 主语很长，把 *Understanding these four forces* 作为一个意群读完。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },

  // Grade 8
  "grade-8-turning-points": {
    listening: t(
      "Kenji knows who broke the window, because he did. *What is the main conflict in the story?* You will hear this unit's stories about moves, losses and choices and answer questions about conflict, character and change.",
      "Kenji 知道窗户是谁打破的——就是他自己。*What is the main conflict in the story?* 本主题听本单元关于搬家、失去和抉择的故事，回答关于冲突、人物和转变的问题。",
    ),
    aloud: t(
      '*"Can you get up at five?" Okafor asked, wiping flour from his hands.* The question is a test for Daniel; ask it the way a busy baker would. You will read sentences and short stretches of this unit\'s stories aloud.',
      '*"Can you get up at five?" Okafor asked, wiping flour from his hands.* 这句问话是在考验 Daniel，要像忙碌的面包师那样问。本主题大声朗读本单元故事里的句子和小段落。',
    ),
  },
  "grade-8-machines-that-changed-the-world": {
    listening: t(
      'Before it was a machine, a *computer* was something else entirely. *What did the word "computer" originally mean?* You will hear this unit\'s passages about the steam engine, telegraph, light bulb, telephone, airplane and computer and answer questions on them.',
      '在成为机器之前，*computer* 指的是完全不同的东西。*What did the word "computer" originally mean?* 本主题听本单元关于蒸汽机、电报、电灯、电话、飞机和计算机的短文，并回答问题。',
    ),
    aloud: t(
      "*Within fifty years, printing shops had opened in more than two hundred European cities, and millions of books had been printed.* Two big numbers in one sentence; let each one register. You will read sentences and short stretches of this unit's passages aloud.",
      "*Within fifty years, printing shops had opened in more than two hundred European cities, and millions of books had been printed.* 一句里两个大数字，让每个都被听清。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-8-explorers-and-voyages": {
    listening: t(
      "Amundsen and Scott raced to the South Pole with very different plans. *How did the two expeditions travel differently?* You will hear this unit's passages about navigators and voyages from Polynesia to the deepest sea and answer questions on them.",
      "阿蒙森和斯科特带着截然不同的计划奔向南极。*How did the two expeditions travel differently?* 本主题听本单元从波利尼西亚航海家到深海下潜的短文，并回答问题。",
    ),
    aloud: t(
      "*Zheng He did not sail to conquer land or build colonies.* The *not* is the point of the sentence; stress it. You will read sentences and short stretches of this unit's passages aloud.",
      "*Zheng He did not sail to conquer land or build colonies.* 这句的重点是 *not*，要重读。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-8-the-age-of-revolutions": {
    listening: t(
      "In 1789, many Paris families could barely afford bread. *Why were many French families struggling in 1789?* You will hear this unit's passages about revolutions in America, France, Haiti and South America and the fight against the slave trade, and answer questions on them.",
      "1789 年，许多巴黎家庭几乎买不起面包。*Why were many French families struggling in 1789?* 本主题听本单元关于美国、法国、海地和南美革命以及反奴隶贸易斗争的短文，并回答问题。",
    ),
    aloud: t(
      '*"No taxation without representation" became their cry.* Read the slogan as a slogan, firm and even, then finish the sentence. You will read sentences and short stretches of this unit\'s passages aloud.',
      '*"No taxation without representation" became their cry.* 口号要读得坚定有力，再把句子读完。本主题大声朗读本单元短文里的句子和小段落。',
    ),
  },
  "grade-8-smoke-and-steam": {
    listening: t(
      "Mill owners filled their factories with children. *Why did mill owners hire children?* You will hear this unit's passages about mills, coal, railways, Manchester, the Luddites and the match girls and answer questions on them.",
      "工厂主让纺织厂里挤满了童工。*Why did mill owners hire children?* 本主题听本单元关于纺织厂、煤炭、铁路、曼彻斯特、卢德分子和火柴女工的短文，并回答问题。",
    ),
    aloud: t(
      "*James Hargreaves built the spinning jenny, which let one worker spin eight threads at once.* Name the machine, pause at the comma, then stress *eight threads*. You will read sentences and short stretches of this unit's passages aloud.",
      "*James Hargreaves built the spinning jenny, which let one worker spin eight threads at once.* 说出机器名，逗号处停一下，再重读 *eight threads*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-8-the-story-of-life": {
    listening: t(
      "Mendel could have studied any plant, but he chose peas. *Why did Mendel choose to study pea plants?* You will hear this unit's passages about naming species, Darwin's finches, fossils, mass extinction and heredity and answer questions on them.",
      "孟德尔本可以研究任何植物，他却选了豌豆。*Why did Mendel choose to study pea plants?* 本主题听本单元关于物种命名、达尔文雀、化石、大灭绝和遗传的短文，并回答问题。",
    ),
    aloud: t(
      '*Scientists later named it Ichthyosaurus, which means "fish lizard," although it was neither a fish nor a lizard.* Say *Ichthyosaurus* as *ik-thee-uh-SOR-us*, and let *although* turn the sentence. You will read sentences and short stretches of this unit\'s passages aloud.',
      '*Scientists later named it Ichthyosaurus, which means "fish lizard," although it was neither a fish nor a lizard.* *Ichthyosaurus* 读作 *ik-thee-uh-SOR-us*，读到 *although* 语气转折。本主题大声朗读本单元短文里的句子和小段落。',
    ),
  },
  "grade-8-tales-of-dread": {
    listening: t(
      'The narrator of *The Tell-Tale Heart* insists again and again that he is not mad. *Why is the narrator of "The Tell-Tale Heart" unreliable?* You will hear this unit\'s Gothic tales and passages and answer questions about suspense, narrators and why fear can be fun.',
      '《泄密的心》的叙述者一再坚称自己没疯。*Why is the narrator of "The Tell-Tale Heart" unreliable?* 本主题听本单元的哥特故事和短文，回答关于悬念、叙述者以及恐惧为何有趣的问题。',
    ),
    aloud: t(
      "*A portrait stepped out of its frame, a statue's nose began to bleed, and a gloomy castle seemed to hold secrets in every passage.* Three eerie events: let each one land before the next. You will read sentences and short stretches of this unit's passages aloud.",
      "*A portrait stepped out of its frame, a statue's nose began to bleed, and a gloomy castle seemed to hold secrets in every passage.* 三件怪事，每件读完再接下一件。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-8-the-globe-and-its-plays": {
    listening: t(
      "Juliet asks *Wherefore art thou Romeo?*, and she is not asking where he is. *What does Juliet mean?* You will hear this unit's passages about the Globe, Shakespeare's life and his plays and answer questions on them.",
      "朱丽叶问 *Wherefore art thou Romeo?*，她并不是在问罗密欧在哪儿。*What does Juliet mean?* 本主题听本单元关于环球剧场、莎士比亚生平和剧作的短文，并回答问题。",
    ),
    aloud: t(
      "*The landlord took them to court, but he lost.* The story ends with a twist in three short words; save a little emphasis for *he lost*. You will read sentences and short stretches of this unit's passages aloud.",
      "*The landlord took them to court, but he lost.* 故事在最后三个词里反转，留一点力气给 *he lost*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-8-journeys-to-a-new-home": {
    listening: t(
      "Angel Island and Ellis Island both received newcomers, but for different purposes. *How was the purpose of Angel Island different from that of Ellis Island?* You will hear this unit's passages, oral histories and memoirs of migration and answer questions on them.",
      "天使岛和埃利斯岛都接收新移民，用途却不同。*How was the purpose of Angel Island different from that of Ellis Island?* 本主题听本单元关于迁徙的短文、口述史和回忆录，并回答问题。",
    ),
    aloud: t(
      "*Everyone else was taken by ferry to Ellis Island. There, they climbed a long staircase to the Great Hall.* After the first-class passengers, *Everyone else* shifts the story; read the climb slowly. You will read sentences and short stretches of this unit's passages aloud.",
      "*Everyone else was taken by ferry to Ellis Island. There, they climbed a long staircase to the Great Hall.* 头等舱乘客之后，*Everyone else* 转向其他人，攀登楼梯那句要读得慢。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },

  // Grade 9
  "grade-9-the-writers-craft": {
    listening: t(
      "Daniel says *Nothing can go wrong* moments before the rain. *What kind of irony is it?* You will hear this unit's stories and answer questions about symbol, irony, point of view and flashback.",
      "Daniel 刚说完 *Nothing can go wrong*，就下起雨来。*What kind of irony is it?* 本主题听本单元的小说，回答关于象征、反讽、视角和倒叙的问题。",
    ),
    aloud: t(
      "*Ortiz opened the back of the watch, looked at it for a long time, and closed it again.* Three actions with a silence in the middle; slow down on *for a long time*. You will read sentences and short stretches of this unit's stories aloud.",
      "*Ortiz opened the back of the watch, looked at it for a long time, and closed it again.* 三个动作，中间有一段沉默，读到 *for a long time* 要放慢。本主题大声朗读本单元小说里的句子和小段落。",
    ),
  },
  "grade-9-heroes-and-epics": {
    listening: t(
      "The Cyclops roars for help, but his neighbors stay away. *Why do the neighbors of the Cyclops not come to help him?* You will hear this unit's passages about epics from Greece, England, Mali, India, China and Persia and answer questions on them.",
      "独眼巨人大声呼救，邻居们却没有来。*Why do the neighbors of the Cyclops not come to help him?* 本主题听本单元关于希腊、英国、马里、印度、中国和波斯史诗的短文，并回答问题。",
    ),
    aloud: t(
      "*He is two-thirds divine and one-third mortal, stronger than any man, and he treats his people harshly.* Balance *two-thirds* against *one-third*, then let *harshly* fall. You will read sentences and short stretches of this unit's passages aloud.",
      "*He is two-thirds divine and one-third mortal, stronger than any man, and he treats his people harshly.* 把 *two-thirds* 和 *one-third* 对称地读，*harshly* 语调下沉。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-9-tragedy-and-the-stage": {
    listening: t(
      "Many tragic heroes share one flaw: they cannot believe they might be wrong. *What is often the protagonist's tragic flaw?* You will hear this unit's passages and scenes about Greek tragedy, the Globe, farce and stage directions and answer questions on them.",
      "许多悲剧主人公都有同一个缺陷：不相信自己会错。*What is often the protagonist's tragic flaw?* 本主题听本单元关于希腊悲剧、环球剧场、闹剧和舞台说明的短文和片段，并回答问题。",
    ),
    aloud: t(
      "*Writers such as Aeschylus, Sophocles and Euripides became famous through these contests.* Three Greek names: *ES-kuh-lus*, *SOF-uh-kleez*, *yoo-RIP-ih-deez*. You will read sentences and short stretches of this unit's passages aloud.",
      "*Writers such as Aeschylus, Sophocles and Euripides became famous through these contests.* 三个希腊人名：*ES-kuh-lus*、*SOF-uh-kleez*、*yoo-RIP-ih-deez*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-9-coming-of-age": {
    listening: t(
      "In the Swat Valley, one girl kept speaking out after an order closed her school. *What had the Taliban ordered in the Swat Valley?* You will hear this unit's passages about the teenage brain, novels of growing up, diaries and young people who spoke up, and answer questions on them.",
      "在斯瓦特山谷，一道命令关闭了学校，一个女孩却继续发声。*What had the Taliban ordered in the Swat Valley?* 本主题听本单元关于青少年大脑、成长小说、日记和勇于发声的年轻人的短文，并回答问题。",
    ),
    aloud: t(
      "*First, the young person is separated from childhood. Next comes a period of transition, which may involve a test.* *First*, *Next*, *Finally* mark the stages; give each a clear start. You will read sentences and short stretches of this unit's passages aloud.",
      "*First, the young person is separated from childhood. Next comes a period of transition, which may involve a test.* *First*、*Next*、*Finally* 标出各个阶段，每个开头都要清楚。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-9-worlds-of-tomorrow": {
    listening: t(
      "Turing found the question *Can machines think?* too vague to answer. *Why did Turing replace the question with a game?* You will hear this unit's passages about robots, artificial intelligence, the Moon, Mars and stories of the future and answer questions on them.",
      "图灵认为 *Can machines think?* 这个问题太模糊，无法回答。*Why did Turing replace the question with a game?* 本主题听本单元关于机器人、人工智能、登月、火星和未来故事的短文，并回答问题。",
    ),
    aloud: t(
      "*Verne was not a scientist, but he read scientific journals constantly and talked to experts.* Contrast *not a scientist* with what he did instead. You will read sentences and short stretches of this unit's passages aloud.",
      "*Verne was not a scientist, but he read scientific journals constantly and talked to experts.* 把 *not a scientist* 和他实际所做的对照着读。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-9-food-health-and-the-body": {
    listening: t(
      "Before anesthesia, the most admired surgeons were simply the fastest. *Why were the best surgeons before anesthesia the fastest ones?* You will hear this unit's passages about sugar, placebos, handwashing, the brain and gut bacteria and answer questions on them.",
      "在麻醉出现之前，最受推崇的外科医生就是动刀最快的。*Why were the best surgeons before anesthesia the fastest ones?* 本主题听本单元关于糖、安慰剂、洗手、大脑和肠道细菌的短文，并回答问题。",
    ),
    aloud: t(
      "*Their gums swelled and bled, their teeth loosened, and old wounds that had healed years before opened again.* The symptoms grow worse as the sentence goes on; let the last one land hardest. You will read sentences and short stretches of this unit's passages aloud.",
      "*Their gums swelled and bled, their teeth loosened, and old wounds that had healed years before opened again.* 症状一个比一个严重，最后一个读得最重。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-9-stories-from-many-cultures": {
    listening: t(
      "Night after night, Shahrazad stays alive by telling stories. *How does Shahrazad keep the king from killing her?* You will hear this unit's passages about tales and traditions from many cultures and answer questions on them.",
      "一夜又一夜，山鲁佐德靠讲故事活了下来。*How does Shahrazad keep the king from killing her?* 本主题听本单元关于各地故事与传统的短文，并回答问题。",
    ),
    aloud: t(
      "*He is a trickster, a character who wins not by strength but by cunning, and who often breaks the rules.* The definition hangs on *not by strength but by cunning*; stress the contrast. You will read sentences and short stretches of this unit's passages aloud.",
      "*He is a trickster, a character who wins not by strength but by cunning, and who often breaks the rules.* 定义的关键是 *not by strength but by cunning*，重读这组对比。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-9-art-and-its-subjects": {
    listening: t(
      "*The Great Wave* was not painted at all. *How was The Great Wave produced?* You will hear this unit's passages about Impressionism, Guernica, Hokusai, Beethoven, early film and Frida Kahlo and answer questions on them.",
      "《神奈川冲浪里》根本不是画出来的。*How was The Great Wave produced?* 本主题听本单元关于印象派、《格尔尼卡》、葛饰北斋、贝多芬、早期电影和弗里达·卡罗的短文，并回答问题。",
    ),
    aloud: t(
      "*What is striking about the painting is how little of it shows the myth. Icarus is almost impossible to find.* The surprise is in the second sentence; read it plainly and let it speak. You will read sentences and short stretches of this unit's passages aloud.",
      "*What is striking about the painting is how little of it shows the myth. Icarus is almost impossible to find.* 意外在第二句，平实地读出来就好。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },

  // Grade 10
  "grade-10-voices-of-persuasion": {
    listening: t(
      "*We planted them in the rain. We planted them in the heat.* The same opening returns again and again. *Which device is used?* You will hear this unit's speeches, letters and debates and answer questions about purpose, devices and fallacies.",
      "*We planted them in the rain. We planted them in the heat.* 同样的开头一再出现。*Which device is used?* 本主题听本单元的演讲、书信和辩论，回答关于目的、修辞手法和逻辑谬误的问题。",
    ),
    aloud: t(
      "*But every morning since, I have watched children walk to school along that bridge, inches from the gap, and I have held my breath.* A speaker moving a council: slow on *inches from the gap*, quiet on *held my breath*. You will read sentences and short stretches of this unit's speeches and letters aloud.",
      "*But every morning since, I have watched children walk to school along that bridge, inches from the gap, and I have held my breath.* 发言人在打动议会：*inches from the gap* 放慢，*held my breath* 压低。本主题大声朗读本单元演讲和书信里的句子和小段落。",
    ),
  },
  "grade-10-poems-across-time": {
    listening: t(
      "Neruda wrote odes, but not to kings or heroes. *How did Pablo Neruda's odes differ from older ones?* You will hear this unit's passages about the ballad, haiku, elegy, ode, line breaks and meter and answer questions on them.",
      "聂鲁达写颂歌，歌颂的却不是君王或英雄。*How did Pablo Neruda's odes differ from older ones?* 本主题听本单元关于歌谣、俳句、挽歌、颂歌、跨行和格律的短文，并回答问题。",
    ),
    aloud: t(
      "*The most important feature of a sonnet is the turn, sometimes called the volta: the moment when the poem changes direction.* The colon announces the definition; pause there. You will read sentences and short stretches of this unit's passages aloud.",
      "*The most important feature of a sonnet is the turn, sometimes called the volta: the moment when the poem changes direction.* 冒号引出定义，在那里停顿。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-10-ambition-and-power": {
    listening: t(
      "Edward VIII wanted the crown and a marriage, and he could not have both. *Why could Edward not keep both the crown and his marriage plans?* You will hear this unit's passages and stories about ambition and power and answer questions on them.",
      "爱德华八世既想要王冠又想要婚姻，却不能两全。*Why could Edward not keep both the crown and his marriage plans?* 本主题听本单元关于野心与权力的短文和故事，并回答问题。",
    ),
    aloud: t(
      "*Napoleon owed his power to no one.* Four words carry the weight: *owed*, *power*, *no one*. You will read sentences and short stretches of this unit's passages aloud.",
      "*Napoleon owed his power to no one.* 重音落在 *owed*、*power* 和 *no one* 上。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-10-war-and-memory": {
    listening: t(
      "Around the soldiers' graves in Belgium and France, bright red poppies bloomed. *Why did so many poppies grow on the battlefields?* You will hear this unit's passages about Verdun, Hiroshima, the Unknown Soldier and memorials and answer questions on them.",
      "在比利时和法国的士兵墓地周围，开满了鲜红的虞美人。*Why did so many poppies grow on the battlefields?* 本主题听本单元关于凡尔登、广岛、无名战士和纪念碑的短文，并回答问题。",
    ),
    aloud: t(
      "*On Christmas Eve, something remarkable happened along parts of the front.* After the mud and the rats, this sentence changes the mood; read it with quiet wonder. You will read sentences and short stretches of this unit's passages aloud.",
      "*On Christmas Eve, something remarkable happened along parts of the front.* 在泥泞和老鼠之后，这句话转换了气氛，要带着轻轻的惊奇来读。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-10-the-natural-world": {
    listening: t(
      "When wolves vanished from Yellowstone, the riverbank trees vanished too. *Why did trees along Yellowstone's rivers disappear after the wolves were gone?* You will hear this unit's passages about ecosystems, the Dust Bowl, glaciers and the moor and answer questions on them.",
      "狼从黄石消失后，河岸边的树也随之消失。*Why did trees along Yellowstone's rivers disappear after the wolves were gone?* 本主题听本单元关于生态系统、沙尘暴、冰川和荒原的短文，并回答问题。",
    ),
    aloud: t(
      "*The cause was not magic but chemistry.* A short pivot after a fable-like opening; stress *chemistry*. You will read sentences and short stretches of this unit's passages aloud.",
      "*The cause was not magic but chemistry.* 在寓言式的开头之后，这句短句是转折，重读 *chemistry*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-10-media-and-truth": {
    listening: t(
      "Bombers that came home were full of holes, but almost never in the engines. *Why did the returning planes have few holes in their engines?* You will hear this unit's passages about investigative reporting, hoaxes, polls and attention-grabbing design and answer questions on them.",
      "飞回来的轰炸机满是弹孔，引擎上却几乎没有。*Why did the returning planes have few holes in their engines?* 本主题听本单元关于调查报道、骗局、民调和抓人眼球的设计的短文，并回答问题。",
    ),
    aloud: t(
      "*There were forests and seas, herds of brown animals like small bison, and a blue creature with a single horn, like a goat.* The hoax piles on wonders; read the list as a newspaper reader in 1835 would have heard it. You will read sentences and short stretches of this unit's passages aloud.",
      "*There were forests and seas, herds of brown animals like small bison, and a blue creature with a single horn, like a goat.* 这场骗局一层层堆叠奇观，像 1835 年的读者那样把这串描述读出来。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-10-money-and-work": {
    listening: t(
      "One extreme salary can make the average pay at a small café look high. *What does the café example show about the mean?* You will hear this unit's passages about wages, bubbles, averages, training, debt and misleading graphs and answer questions on them.",
      "一份极高的薪水就能让小咖啡馆的平均工资显得很高。*What does the café example show about the mean?* 本主题听本单元关于工资、泡沫、平均数、职业培训、债务和误导性图表的短文，并回答问题。",
    ),
    aloud: t(
      "*One of the most fashionable was a flower that had arrived from Turkey only a few decades earlier: the tulip.* The colon holds back the answer; pause, then reveal *the tulip*. You will read sentences and short stretches of this unit's passages aloud.",
      "*One of the most fashionable was a flower that had arrived from Turkey only a few decades earlier: the tulip.* 冒号先卖个关子，停一下再揭晓 *the tulip*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-10-satire-and-humor": {
    listening: t(
      "A television report showed farmers picking spaghetti from trees, and many viewers believed it. *What made the spaghetti report so convincing?* You will hear this unit's passages about satire, hoaxes, jesters and cartoons and answer questions on them.",
      "一则电视报道展示农民从树上采摘意大利面，许多观众信以为真。*What made the spaghetti report so convincing?* 本主题听本单元关于讽刺、恶作剧、弄臣和漫画的短文，并回答问题。",
    ),
    aloud: t(
      "*The writer has considered the question carefully, he says, and he has a solution that will benefit everyone.* Satire wears a straight face; read *carefully* and *benefit everyone* in the calm voice of an expert. You will read sentences and short stretches of this unit's passages aloud.",
      "*The writer has considered the question carefully, he says, and he has a solution that will benefit everyone.* 讽刺要板着脸说：用专家般冷静的口吻读 *carefully* 和 *benefit everyone*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  // Grade 11
  "grade-11-rights-and-laws": {
    listening: t(
      "In a courtroom, the judge and the jury answer different kinds of questions. *What is the difference between the work of the judge and the jury?* You will hear this unit's passages about Magna Carta, juries, the vote, the separation of powers and arguments in court and answer questions on them.",
      "在法庭上，法官和陪审团回答的是不同类型的问题。*What is the difference between the work of the judge and the jury?* 本主题听本单元关于《大宪章》、陪审团、选举权、三权分立和法庭辩论的短文，并回答问题。",
    ),
    aloud: t(
      '*The code is famous for the idea of "an eye for an eye": a person who blinds another may lose an eye in return.* Quote the famous phrase, pause at the colon, then explain it evenly. You will read sentences and short stretches of this unit\'s passages aloud.',
      '*The code is famous for the idea of "an eye for an eye": a person who blinds another may lose an eye in return.* 读出那句名言，冒号处停顿，再平稳地解释。本主题大声朗读本单元短文里的句子和小段落。',
    ),
  },
  "grade-11-a-century-of-change": {
    listening: t(
      "Share prices kept rising as long as people believed they would. *Why did share prices depend on confidence?* You will hear this unit's passages about immigration, two world wars, the Crash, the end of empire and the fall of the Berlin Wall and answer questions on them.",
      "只要人们相信股价会涨，它就一直涨。*Why did share prices depend on confidence?* 本主题听本单元关于移民、两次世界大战、股市崩盘、帝国终结和柏林墙倒塌的短文，并回答问题。",
    ),
    aloud: t(
      "*Water from the river turned great wheels that powered thousands of machines.* Follow the power from the river to the machines in one smooth line. You will read sentences and short stretches of this unit's passages aloud.",
      "*Water from the river turned great wheels that powered thousands of machines.* 顺着动力从河水一路读到机器，一气呵成。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-11-science-and-society": {
    listening: t(
      "Ice cream sales and drownings rise and fall together, yet neither causes the other. *Why do ice cream sales and drowning deaths rise together?* You will hear this unit's passages about causation, placebos, replication, headlines and gene editing and answer questions on them.",
      "冰淇淋销量和溺水人数同涨同落，却互不为因。*Why do ice cream sales and drowning deaths rise together?* 本主题听本单元关于因果、安慰剂、可重复性、科学新闻标题和基因编辑的短文，并回答问题。",
    ),
    aloud: t(
      "*A few even chose to give birth in the street rather than go there.* The word *even* shows how afraid the women were; give it weight. You will read sentences and short stretches of this unit's passages aloud.",
      "*A few even chose to give birth in the street rather than go there.* *even* 显示出妇女们有多害怕，要加重。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-11-dreams-and-promises": {
    listening: t(
      "In 1940, nine in ten children grew up to earn more than their parents. *What happened to that chance between 1940 and 1980?* You will hear this unit's passages about rags-to-riches stories, homesteads, philanthropy, suburbs and migration and answer questions on them.",
      "1940 年，十个孩子里有九个长大后挣得比父母多。*What happened to that chance between 1940 and 1980?* 本主题听本单元关于白手起家的故事、宅地法、慈善、郊区和移民的短文，并回答问题。",
    ),
    aloud: t(
      "*Yet the book gave the country a phrase it has used ever since: the American dream.* Build to the colon and let *the American dream* stand alone. You will read sentences and short stretches of this unit's passages aloud.",
      "*Yet the book gave the country a phrase it has used ever since: the American dream.* 一路铺垫到冒号，让 *the American dream* 单独突出。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-11-nature-and-the-self": {
    listening: t(
      "Tao Yuanming gave up his post rather than bow to an inspector. *Why did Tao Yuanming resign from his post?* You will hear this unit's passages about Emerson, Muir, the Wordsworths, Tao Yuanming and mountains and forests and answer questions on them.",
      "陶渊明宁可辞官，也不愿向督邮躬身行礼。*Why did Tao Yuanming resign from his post?* 本主题听本单元关于爱默生、缪尔、华兹华斯兄妹、陶渊明以及山林自然的短文，并回答问题。",
    ),
    aloud: t(
      "*He did not want to discover, when he came to die, that he had not lived.* The middle clause interrupts; drop your voice for it and come back for *that he had not lived*. You will read sentences and short stretches of this unit's passages aloud.",
      "*He did not want to discover, when he came to die, that he had not lived.* 中间的插入语声音放低，再回到 *that he had not lived*。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-11-justice-and-protest": {
    listening: t(
      "The Freedom Riders boarded buses knowing they might be attacked. *What were the Freedom Riders trying to do?* You will hear this unit's passages about the civil rights movement, the farm workers, the Triangle fire and protest at the Olympics and answer questions on them.",
      "自由乘车者明知可能遭到袭击，仍然登上了巴士。*What were the Freedom Riders trying to do?* 本主题听本单元关于民权运动、农场工人、三角工厂火灾和奥运会抗议的短文，并回答问题。",
    ),
    aloud: t(
      "*Its argument was that a person's conscience is a higher authority than the law.* The whole essay comes down to this; set *conscience* against *the law*. You will read sentences and short stretches of this unit's passages aloud.",
      "*Its argument was that a person's conscience is a higher authority than the law.* 整篇文章归结于此，把 *conscience* 和 *the law* 对照着读。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-11-between-two-worlds": {
    listening: t(
      "Radcliffe drew a border across India in five weeks, never having been there before. *Why was Radcliffe's task so difficult?* You will hear this unit's passages about partition, emigrants' letters, third-culture children, guest workers and fading languages and answer questions on them.",
      "雷德克里夫从未去过印度，却要在五周内划出一条国界。*Why was Radcliffe's task so difficult?* 本主题听本单元关于印巴分治、移民家书、第三文化孩子、客籍工人和逐渐消失的语言的短文，并回答问题。",
    ),
    aloud: t(
      "*A few had already found jobs; most had not.* The semicolon balances *a few* against *most*; pause there and let *most had not* sink in. You will read sentences and short stretches of this unit's passages aloud.",
      "*A few had already found jobs; most had not.* 分号两边是 *a few* 与 *most* 的对比，停一下，让 *most had not* 沉下来。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-11-machines-and-makers": {
    listening: t(
      "A self-driving car must be told in advance what to do when every choice causes harm. *Why have self-driving cars made an old puzzle practical?* You will hear this unit's passages about looms, strikes, chess computers, algorithms and cameras and answer questions on them.",
      "自动驾驶汽车必须事先被告知：当每个选择都会造成伤害时该怎么办。*Why have self-driving cars made an old puzzle practical?* 本主题听本单元关于织布机、罢工、国际象棋电脑、算法和监控摄像头的短文，并回答问题。",
    ),
    aloud: t(
      "*He went at night to the banks of the river and shaped a giant figure of clay.* A legend told at night: keep your voice low and even. You will read sentences and short stretches of this unit's passages aloud.",
      "*He went at night to the banks of the river and shaped a giant figure of clay.* 这是一个夜里发生的传说，声音放低、保持平稳。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },

  // Grade 12
  "grade-12-essays-of-experience": {
    listening: t(
      'A letter is addressed to *Twelve* and signed *Seventeen*. *Why is the letter addressed to "Twelve" and signed "Seventeen"?* You will hear this unit\'s personal essays and answer questions about what the writers experienced and what they came to understand.',
      '一封信写给 *Twelve*，署名 *Seventeen*。*Why is the letter addressed to "Twelve" and signed "Seventeen"?* 本主题听本单元的个人随笔，回答关于作者的经历和感悟的问题。',
    ),
    aloud: t(
      "*She lived another year, but she could no longer use her hands.* The sentence is about the gift the writer did not wear; read the second half softly. You will read sentences and short stretches of this unit's essays aloud.",
      "*She lived another year, but she could no longer use her hands.* 这句话背后是作者没有穿的那件手工衣服，后半句轻声读。本主题大声朗读本单元随笔里的句子和小段落。",
    ),
  },
  "grade-12-power-and-conscience": {
    listening: t(
      "Milgram told his volunteers the study was about memory, but it was not. *What was the real purpose of Milgram's study?* You will hear this unit's passages about people who refused, obeyed or exposed power and answer questions on them.",
      "米尔格拉姆告诉志愿者实验是关于记忆的，其实不然。*What was the real purpose of Milgram's study?* 本主题听本单元关于拒绝、服从或揭露权力之人的短文，并回答问题。",
    ),
    aloud: t(
      "*She did not rely on rumor.* Four plain words that describe a method; stress *rumor*, then read on to what she did instead. You will read sentences and short stretches of this unit's passages aloud.",
      "*She did not rely on rumor.* 简短的一句交代了她的做法，重读 *rumor*，再接着读她实际怎么做。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-12-belief-and-doubt": {
    listening: t(
      "Behind a veil of ignorance, no one knows who they will be. *Why would people behind the veil of ignorance choose fair rules, according to Rawls?* You will hear this unit's passages about Plato, Hume, Mencius, Nozick, Rawls and Jackson and answer questions on their arguments.",
      "在无知之幕后，没有人知道自己将会是谁。*Why would people behind the veil of ignorance choose fair rules, according to Rawls?* 本主题听本单元关于柏拉图、休谟、孟子、诺齐克、罗尔斯和杰克逊的短文，回答关于他们论证的问题。",
    ),
    aloud: t(
      "*A stick in water looks bent; a tower that seems round from far away turns out to be square.* Two examples of the senses deceiving us, balanced on a semicolon. You will read sentences and short stretches of this unit's passages aloud.",
      "*A stick in water looks bent; a tower that seems round from far away turns out to be square.* 两个感官欺骗我们的例子，以分号平衡。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-12-art-and-its-critics": {
    listening: t(
      'A critic coined the name *Impressionists*, and he did not mean it kindly. *Why did Leroy call the painters "Impressionists"?* You will hear this unit\'s passages about art that shocked its critics and answer questions on them.',
      '“印象派”这个名字是一位评论家起的，而且并无好意。*Why did Leroy call the painters "Impressionists"?* 本主题听本单元关于令评论家震惊的艺术作品的短文，并回答问题。',
    ),
    aloud: t(
      "*They stamped, turned their feet inward and jerked as if pulled by strings.* The verbs are the shock; give *stamped* and *jerked* their bite. You will read sentences and short stretches of this unit's passages aloud.",
      "*They stamped, turned their feet inward and jerked as if pulled by strings.* 动词本身就是冲击，*stamped* 和 *jerked* 要读得有力。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-12-literature-across-languages": {
    listening: t(
      "Lu Xun kept the shape of foreign sentences even when the Chinese sounded awkward. *What was Lu Xun's method of \"hard translation\"?* You will hear this unit's passages about translators and translation and answer questions on them.",
      '鲁迅即使让中文读起来别扭，也要保留外文的句式。*What was Lu Xun\'s method of "hard translation"?* 本主题听本单元关于译者与翻译的短文，并回答问题。',
    ),
    aloud: t(
      "*Translation, he said, has three difficulties: faithfulness, expressiveness and elegance.* Yan Fu's three standards: pause at the colon and give each its own beat. You will read sentences and short stretches of this unit's passages aloud.",
      "*Translation, he said, has three difficulties: faithfulness, expressiveness and elegance.* 这是严复的“信、达、雅”：冒号处停顿，三个词各占一拍。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
  "grade-12-risk-and-responsibility": {
    listening: t(
      "After one terrible event, many people drove instead of flying, and more of them died. *Why was the choice to drive instead of fly not a safe one?* You will hear this unit's passages about disasters, unsafe cars, the year 2000 bug and the precautionary principle and answer questions on them.",
      "一场灾难之后，很多人改开车不坐飞机，结果死的人更多了。*Why was the choice to drive instead of fly not a safe one?* 本主题听本单元关于灾难、不安全的汽车、千年虫和预防原则的短文，并回答问题。",
    ),
    aloud: t(
      "*Within seconds, two explosions blew the heavy lid off the reactor and set the building on fire.* *Within seconds* sets the speed; read the rest without slowing down. You will read sentences and short stretches of this unit's passages aloud.",
      "*Within seconds, two explosions blew the heavy lid off the reactor and set the building on fire.* *Within seconds* 定下速度，后面不要放慢。本主题大声朗读本单元短文里的句子和小段落。",
    ),
  },
};

/** auralIntro is the introduction of a native unit's listening and reading-aloud topics, by `grade-N-slug`. */
export function auralIntro(key: string): AuralIntro {
  const intro = auralIntros[key];
  if (!intro) throw new Error(`${key}: no introduction in native/aural-intros.ts`);
  return intro;
}
