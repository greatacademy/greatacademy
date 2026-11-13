// Gaokao continuation writing, judged by rules: the two skills a continuation is built on. A story stops, and each of
// its two paragraphs starts with a given sentence; the learner first chooses the sentence that follows the given one
// and keeps the story consistent, then the sentence that shows a feeling through what a character does rather than
// naming it. All stories are written for this course in the words of B1 and below.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** Opening is the first sentence given for a paragraph, the sentence that follows it, wrong ones and why. */
type Opening = readonly [given: string, right: string, wrong: readonly string[], why: string];

/** Story is the end of a story as the paper gives it, with the two paragraph openings that continue it. */
interface Story {
  readonly text: string;
  readonly openings: readonly [Opening, Opening];
}

const stories: readonly Story[] = [
  {
    text: "Lily had practised for the school singing competition for weeks. On the day, her best friend Mei, who was supposed to play the piano for her, phoned to say she was ill. The competition started in an hour, and Lily had no one else to play.",
    openings: [
      [
        "Lily looked around the hall, hoping for a miracle.",
        "Then she noticed Mr Chen, the music teacher, sitting quietly in the back row.",
        [
          "She went home and watched television.",
          "Mei arrived ten minutes later, feeling perfectly well.",
          "The competition had been cancelled the week before.",
        ],
        "It keeps the problem (no one to play) and starts a way to solve it. Mei is ill, so she cannot suddenly arrive, and nothing earlier says the competition was cancelled.",
      ],
      [
        "When the last note faded, the hall was silent for a moment.",
        "Then the audience burst into applause, and Lily saw Mr Chen smiling at her.",
        [
          "Lily forgot all the words of the song.",
          "The next morning, Lily started learning the guitar.",
          "Mei played the piano better than ever.",
        ],
        "The given sentence says the song has just ended; the next sentence tells how people reacted. Mei is not there, and *forgot the words* contradicts *the last note faded*.",
      ],
    ],
  },
  {
    text: "Tom and his younger brother went hiking in the hills. In the afternoon, thick fog came down, and they could no longer see the path. Tom's phone had no signal, and his brother began to cry.",
    openings: [
      [
        "Tom took a deep breath and knelt down beside his brother.",
        '"Don\'t worry," he said softly. "We\'ll stay together and wait for the fog to clear."',
        [
          "He ran off to find the path alone.",
          "The sun was shining brightly over the hills.",
          "His brother laughed and said he was not afraid at all.",
        ],
        "Kneeling beside a crying child leads to comforting him. Running off alone or bright sun contradicts the story.",
      ],
      [
        "An hour later, they heard a voice calling their names.",
        "Tom shouted back as loudly as he could, and soon a torch appeared through the fog.",
        [
          "They decided to hide behind a rock.",
          "Tom's phone rang with a message from a friend about homework.",
          "The voice was a song on the radio at home.",
        ],
        "Hearing someone call leads to answering and being found. The phone has no signal, and they are not at home.",
      ],
    ],
  },
  {
    text: "Every morning, an old man sat alone on the same bench in the park. Anna passed him on her way to school, but she had never spoken to him. One morning, the bench was empty.",
    openings: [
      [
        "The next day, the bench was still empty, and Anna began to worry.",
        "After school, she asked the woman at the flower shop whether she knew the old man.",
        [
          "Anna was glad she no longer had to walk past him.",
          "She sat on the bench and ate her lunch happily.",
          "The old man was sitting on the bench, reading a newspaper.",
        ],
        "Worry leads to finding out what happened. The given sentence says the bench is empty, so he cannot be sitting there.",
      ],
      [
        "When Anna knocked on his door that weekend, the old man looked surprised.",
        "Then his face broke into a warm smile, and he invited her in for tea.",
        [
          "He closed the door without a word and never spoke again.",
          "Anna realised she had come to the wrong city.",
          "The old man had moved to another country years ago.",
        ],
        "Surprise turns into welcome, which leads the story toward its ending of friendship. He cannot have moved years ago: he sat on the bench until recently.",
      ],
    ],
  },
  {
    text: "Jack had always wanted a dog, but his mother said he was not responsible enough. One rainy evening, he found a small, wet puppy shaking under a car outside their flat.",
    openings: [
      [
        "Jack carefully picked up the puppy and carried it inside.",
        "He dried it with a towel and gave it some warm milk, while his mother watched from the doorway.",
        [
          "He left it under the car and went to bed.",
          "The puppy grew into a huge dog that night.",
          "His mother had already bought him a cat.",
        ],
        "Carrying a cold, wet puppy inside leads to caring for it, and the mother watching sets up the question of responsibility.",
      ],
      [
        "For the next week, Jack got up early every morning to walk the puppy.",
        'On Sunday, his mother put her hand on his shoulder and said, "I think he has found a home."',
        [
          "He soon forgot about the puppy and played computer games.",
          "The puppy was taken away by a car that morning.",
          "His mother still said he was not responsible enough.",
        ],
        "A week of getting up early proves he is responsible, so the mother changes her mind: the story's problem is solved.",
      ],
    ],
  },
  {
    text: "Before the school sports day, Wang Fang was chosen to run the last part of the relay race. She was the slowest runner in the team, and she heard two classmates whispering that the team would lose because of her.",
    openings: [
      [
        "That evening, Wang Fang went to the school track alone.",
        "She ran lap after lap until her legs ached, and she promised herself she would not give up.",
        ["She decided to tell the teacher she was ill.", "She sat in her room and cried all night.", "The race had already finished."],
        "Going to the track alone leads to practising. The race is still in the future, and *telling the teacher she was ill* does not fit going to the track.",
      ],
      [
        "When Wang Fang took the baton, her team was in third place.",
        "She fixed her eyes on the finish line and ran faster than she had ever run before.",
        [
          "She dropped the baton and walked off the track.",
          "Her team was already in first place by a long way.",
          "The two classmates were running the last part instead.",
        ],
        "The given sentence sets up a chance to catch up; the next sentence makes her try. The team is third, not first.",
      ],
    ],
  },
  {
    text: "Grandpa Li had lived in the village all his life and had never used a smartphone. When his grandson moved to a city far away, Grandpa Li felt very lonely. His grandson sent him a phone as a present.",
    openings: [
      [
        "At first, the phone seemed impossible to use.",
        "Grandpa Li pressed the wrong buttons again and again, and once he almost threw it on the floor.",
        [
          "Grandpa Li became an expert in five minutes.",
          "His grandson came back to live in the village the next day.",
          "The phone was so easy that he never needed help.",
        ],
        "*Impossible to use* is followed by an example of the difficulty, not by sudden success.",
      ],
      [
        "A month later, Grandpa Li's phone rang in the middle of dinner.",
        "It was a video call from his grandson, and the old man's eyes shone as he waved at the screen.",
        [
          "He did not know how to answer it, so he turned it off.",
          "He had given the phone to a neighbour weeks ago.",
          "It was a call from a shop selling new phones.",
        ],
        "A month later he has learned: the call is from the grandson, which ends his loneliness, the story's problem.",
      ],
    ],
  },
  {
    text: "Sara forgot her purse at home and found she could not pay for the bus. The driver told her to get off. It was cold, and her school was five kilometres away.",
    openings: [
      [
        "Just as Sara stood up, an old woman behind her spoke.",
        '"Let me pay for this young lady," she said, holding out a few coins.',
        [
          '"Please get off quickly," she shouted angrily at Sara.',
          "Sara found a thousand dollars in her pocket.",
          "The bus suddenly turned into a taxi.",
        ],
        "The woman speaking just as Sara is about to leave suggests help. Sara has no money, so she cannot find any.",
      ],
      [
        "The next morning, Sara waited at the same bus stop with two coins in her hand.",
        "When the old woman got on, Sara smiled and paid for her ticket.",
        [
          "Sara decided never to take the bus again.",
          "Sara spent the coins on sweets.",
          "The old woman did not recognise Sara and walked past.",
        ],
        "The two coins in her hand look forward to returning the kindness, which completes the story.",
      ],
    ],
  },
  {
    text: "Our class planted a small garden behind the school. After weeks of work, the vegetables were almost ready. Then, one night, a storm destroyed almost everything.",
    openings: [
      [
        "The next morning, we stood in silence looking at the broken plants.",
        "Some of the girls were close to tears, and even our teacher could not find anything to say.",
        ["We were all very pleased with the result.", "The vegetables were bigger than ever.", "We had never planted a garden before."],
        "Silence in front of broken plants is followed by sadness, not pleasure.",
      ],
      [
        '"Well," said our teacher at last, "we still have some seeds."',
        "One by one, we picked up our tools and began to clear the ground.",
        [
          "We all went home and forgot about the garden.",
          "The storm came back and destroyed the school.",
          "The teacher threw the seeds away.",
        ],
        "*We still have some seeds* is an invitation to start again; the class answers it by working.",
      ],
    ],
  },
  {
    text: "Ming was the shyest boy in the class. When the teacher asked each student to give a five-minute talk about their hobby, Ming felt sick. His hobby was making paper birds, and he was sure everyone would laugh.",
    openings: [
      [
        "On the day of the talk, Ming walked slowly to the front of the class.",
        "His hands were shaking as he took a small paper bird out of his bag.",
        [
          "He told a joke and everyone laughed loudly.",
          "He had forgotten to bring anything at all.",
          "He ran out of the classroom before he spoke.",
        ],
        "Walking slowly shows his fear; shaking hands and the paper bird continue it and lead into the talk.",
      ],
      [
        "When Ming finished, a girl in the front row put up her hand.",
        '"Could you teach me how to make one?" she asked.',
        [
          '"That was the worst talk I have ever heard," she said.',
          "She asked when the lesson would end.",
          "She asked him about his football team.",
        ],
        "The question about making one shows interest and answers Ming's fear that everyone would laugh.",
      ],
    ],
  },
  {
    text: "Every year, Helen's family went to the beach for their holiday. This year, her father lost his job, and there was no money for a trip. Helen's little brother was very disappointed.",
    openings: [
      [
        "Helen thought for a while and then had an idea.",
        'She asked her mother if they could make a "beach" in the back garden.',
        ["She asked her father to buy plane tickets to Spain.", "She decided not to talk to her brother.", "She went to the beach alone."],
        "There is no money, so her idea must cost little: a beach at home. Plane tickets contradict the story.",
      ],
      [
        "On Saturday morning, Helen's brother stepped into the garden.",
        "His mouth fell open when he saw the sand, the paddling pool and the colourful umbrella.",
        [
          "He was angry and went back to bed.",
          "He saw that the garden was the same as usual.",
          "He found the family car packed for the beach.",
        ],
        "His surprise at the garden beach is the reward for Helen's idea and ends his disappointment.",
      ],
    ],
  },
  {
    text: "David borrowed his best friend's new bike without asking and left it outside a shop. When he came out, the bike was gone. He knew his friend had saved for a year to buy it.",
    openings: [
      [
        "David walked to his friend's house with a heavy heart.",
        "He stood at the door for a long time before he finally knocked.",
        [
          "He was looking forward to telling a funny story.",
          "He rode the bike all the way there.",
          "He decided to buy himself a new bike instead.",
        ],
        "A heavy heart shows guilt, so he hesitates. The bike is gone, so he cannot ride it.",
      ],
      [
        '"I\'m sorry," David said. "I\'ll work every weekend until I can pay for a new one."',
        'His friend was quiet for a moment, and then he said, "I\'ll help you look for it first."',
        [
          "His friend laughed and said he had never had a bike.",
          "David then left and never came back.",
          "His friend said the bike was red, not blue.",
        ],
        "After the apology and the promise, the friend's answer shows forgiveness and keeps the friendship.",
      ],
    ],
  },
  {
    text: "Lucy found a wallet on the street with a lot of money and an ID card inside. She had wanted a new pair of trainers for months, and nobody had seen her pick it up.",
    openings: [
      [
        "Lucy held the wallet in her hands for a long time.",
        "She thought of the trainers, and then she thought of how she would feel if she had lost the money.",
        ["She bought the trainers at once.", "She threw the wallet in the river.", "She could not remember where the shop was."],
        "Holding it for a long time shows she is deciding; the next sentence shows both sides of her choice.",
      ],
      [
        "The address on the ID card led Lucy to a small old house.",
        "An old woman opened the door, and when she saw the wallet, she began to cry with relief.",
        [
          "The house was a large shopping centre.",
          "Nobody had lived there for a hundred years.",
          "Lucy decided to keep the wallet after all.",
        ],
        "Reaching the address leads to the owner; her relief shows why returning it mattered.",
      ],
    ],
  },
  {
    text: "Kevin wanted to be in the school football team, but he was not chosen. The coach said he needed to be faster and fitter. Kevin went home angry and threw his boots into a corner.",
    openings: [
      [
        "The next morning, Kevin's alarm rang at six o'clock.",
        "He looked at his boots in the corner, then pulled on his trainers and went out to run.",
        ["He turned it off and slept until noon.", "He was already the fastest player in the school.", "He gave his boots to a neighbour."],
        "An alarm at six suggests a new plan; running answers the coach's advice.",
      ],
      [
        "Three months later, the coach watched Kevin race across the field.",
        '"You\'ve worked hard," he said. "There\'s a place for you in the team."',
        ['"You\'re still too slow," he said, and walked away.', "Kevin fell over and went home.", "The coach had never seen Kevin before."],
        "Three months of training are rewarded; the story's problem (not being chosen) is solved.",
      ],
    ],
  },
  {
    text: "During the summer holiday, Jenny volunteered at an animal centre. On her first day, she was given the job of feeding an old cat that hid in a corner and never let anyone touch it.",
    openings: [
      [
        "For days, Jenny sat quietly near the cat's corner while it ate.",
        "She did not try to touch it; she just read her book and spoke to it softly.",
        [
          "She picked it up and held it tightly.",
          "The cat ran up to her and jumped onto her knees.",
          "She stopped going to the animal centre.",
        ],
        "Sitting quietly near it is the patient way to win a frightened cat; touching it at once contradicts that.",
      ],
      [
        "On the last day of the holiday, the cat walked slowly out of its corner.",
        "It stopped in front of Jenny, looked at her for a moment, and then rubbed its head against her hand.",
        [
          "It hissed at her and ran under the table.",
          "It had been a dog all along.",
          "It ate its food and went back to sleep in the corner.",
        ],
        "Walking out of its corner on the last day is the moment of change; the cat finally lets her touch it.",
      ],
    ],
  },
  {
    text: "Mr Zhao ran a small noodle shop near the station. A large restaurant opened across the street, and soon Mr Zhao's shop was almost empty. His wife said they should close.",
    openings: [
      [
        "That night, Mr Zhao could not sleep.",
        "He sat in the empty shop, thinking about the customers who had come for twenty years.",
        ["He slept well and forgot about the problem.", "He decided to open a third restaurant.", "His shop was full of customers."],
        "Not sleeping shows worry; thinking about old customers prepares a decision.",
      ],
      [
        "A week later, a sign appeared in Mr Zhao's window: \"Grandma's Recipe – Made by Hand\".",
        "Soon, people who were tired of the big restaurant began to come back.",
        [
          "Nobody noticed the sign, and the shop closed.",
          "The big restaurant copied the sign the next day and closed Mr Zhao's shop.",
          "Mr Zhao took down the sign and went on holiday.",
        ],
        "The sign shows his plan: what the big restaurant cannot offer. The next sentence shows it working.",
      ],
    ],
  },
];

/** Shown is a feeling, the sentence that shows it through action, and sentences that only name it or show another. */
type Shown = readonly [feeling: string, right: string, wrong: readonly string[]];

const showing: readonly Shown[] = [
  [
    "nervous",
    "Her hands trembled as she opened the envelope.",
    ["She was very nervous.", "She felt nervous about the letter.", "She smiled and tore the envelope open."],
  ],
  [
    "happy",
    "He jumped up, punched the air and laughed out loud.",
    ["He was extremely happy.", "He felt a lot of happiness.", "He sighed and looked at the floor."],
  ],
  [
    "sad",
    "Tears rolled down her cheeks as the train pulled away.",
    ["She felt very sad.", "She was sad that he left.", "She waved cheerfully until the train was gone."],
  ],
  [
    "angry",
    "He slammed the door so hard that the windows shook.",
    ["He was very angry.", "He felt angry with his sister.", "He closed the door quietly behind him."],
  ],
  [
    "afraid",
    "She froze, holding her breath, as the footsteps came closer.",
    ["She was really afraid.", "She felt afraid of the footsteps.", "She hummed a song and walked on."],
  ],
  [
    "tired",
    "He dropped onto the sofa and was asleep before he could take off his shoes.",
    ["He was very tired.", "He felt tired after work.", "He ran upstairs, full of energy."],
  ],
  [
    "surprised",
    "Her mouth fell open, and the cup almost slipped from her hand.",
    ["She was very surprised.", "She felt surprised by the news.", "She nodded as if she had known all along."],
  ],
  [
    "embarrassed",
    "His face turned red, and he stared at his shoes.",
    ["He was embarrassed.", "He felt embarrassed in class.", "He looked up proudly and smiled at everyone."],
  ],
  [
    "excited",
    "She could not sit still and kept checking the clock every minute.",
    ["She was very excited.", "She felt excited about the trip.", "She yawned and went back to her book."],
  ],
  [
    "proud",
    "Mum held up the certificate for every visitor to see.",
    ["Mum was proud.", "Mum felt proud of me.", "Mum put the certificate in a drawer and forgot it."],
  ],
  [
    "lonely",
    "He set one plate on the table and ate in silence, listening to the clock.",
    ["He was very lonely.", "He felt lonely at dinner.", "He laughed with his friends around the table."],
  ],
  [
    "worried",
    "She walked up and down by the window, phone in hand, checking it again and again.",
    ["She was worried.", "She felt worried about her son.", "She fell asleep peacefully in her chair."],
  ],
  [
    "relieved",
    "He let out a long breath, and his shoulders dropped.",
    ["He was relieved.", "He felt relief at last.", "He held his breath and clenched his fists."],
  ],
  [
    "confused",
    "He read the instructions three times and scratched his head.",
    ["He was confused.", "He felt confused by the instructions.", "He finished the task in a minute."],
  ],
  [
    "bored",
    "She drew circles on her notebook and watched the clouds outside.",
    ["She was bored.", "She felt bored in the lesson.", "She listened carefully and took notes."],
  ],
  [
    "shy",
    "The girl hid behind her mother and peeped out at the guests.",
    ["The girl was shy.", "The girl felt shy with guests.", "The girl ran to greet every guest."],
  ],
  [
    "grateful",
    "He held the old man's hand in both of his and could not find the words to thank him.",
    ["He was grateful.", "He felt grateful to the old man.", "He took the money and walked off."],
  ],
  [
    "determined",
    "She wiped the sweat from her face, tied her shoes tighter and started up the hill again.",
    ["She was determined.", "She felt determined to finish.", "She sat down and waited for a bus."],
  ],
  [
    "disappointed",
    "His smile disappeared, and he slowly put the ticket back in his pocket.",
    ["He was disappointed.", "He felt disappointed about the match.", "He waved the ticket and cheered."],
  ],
  [
    "jealous",
    "She watched her sister open the new bike and turned away without a word.",
    ["She was jealous.", "She felt jealous of her sister.", "She hugged her sister and helped her ride it."],
  ],
  [
    "calm",
    "He breathed slowly, looked at the question again and picked up his pen.",
    ["He was calm.", "He felt calm in the exam.", "He tore up the paper and shouted."],
  ],
  [
    "guilty",
    "He could not look his mother in the eye and kept pushing his food around the plate.",
    ["He felt guilty.", "He was guilty about lying.", "He told the story loudly and laughed."],
  ],
  [
    "cold",
    "Her teeth chattered, and she pulled her coat tighter around her.",
    ["She was very cold.", "She felt the cold weather.", "She took off her coat and fanned herself."],
  ],
  [
    "impatient",
    "He tapped his foot and looked at his watch for the third time.",
    ["He was impatient.", "He felt impatient in the queue.", "He sat back and enjoyed the wait."],
  ],
  [
    "moved",
    "She read the letter twice, pressed it to her heart and smiled through her tears.",
    ["She was moved by the letter.", "She felt touched.", "She threw the letter in the bin."],
  ],
  [
    "shocked",
    "The glass fell from his hand and broke on the floor, but he did not move.",
    ["He was shocked.", "He felt shocked at the news.", "He calmly finished his drink."],
  ],
  [
    "hopeful",
    "Every evening she checked the letterbox, sure that tomorrow the letter would come.",
    ["She was hopeful.", "She felt hopeful about the letter.", "She stopped checking the letterbox."],
  ],
  [
    "frightened",
    "The little boy grabbed his father's hand and pressed his face into his coat.",
    ["The little boy was frightened.", "The little boy felt fear.", "The little boy ran toward the big dog, laughing."],
  ],
  [
    "thankful",
    "The family stood at the gate, waving until the doctor's car was out of sight.",
    ["The family was thankful.", "The family felt thankful to the doctor.", "The family closed the gate before the doctor left."],
  ],
  [
    "satisfied",
    "He stepped back, looked at the finished painting and nodded slowly.",
    ["He was satisfied.", "He felt satisfied with his work.", "He painted over the whole picture in black."],
  ],
];

const continuing: readonly SolvedChoice[] = interleave(
  stories.map((s) =>
    s.openings.map(([given, right, wrong, why]) => ({
      shown: `${s.text}\n\n**Paragraph:** ${given} ___`,
      right,
      wrong,
      solution: t(
        `**${right}** ${why} The sentence after a given opening must follow from it directly and agree with everything the story has said; a sudden new event or a contradiction loses marks.`,
        `**${right}** ${why} 段首句之后的句子必须直接承接它，并与故事已有内容一致；突然出现的新事件或前后矛盾都会失分。`,
      ),
    })),
  ),
);

const shownFeelings: readonly SolvedChoice[] = showing.map(([feeling, right, wrong]) => ({
  shown: `Which sentence **shows** that the character is *${feeling}*, without naming the feeling?`,
  right,
  wrong,
  solution: t(
    `**${right}** It shows the feeling through actions and the body, so the reader sees it. *${wrong[0]}* and *${wrong[1]}* only name it, and *${wrong[2]}* shows a different feeling.`,
    `**${right}** 它通过动作和身体反应来表现情感，让读者看到。*${wrong[0]}* 和 *${wrong[1]}* 只是说出了情感，*${wrong[2]}* 表现的是另一种情感。`,
  ),
}));

/** continuationSkills is the Gaokao topic of the rule-judged skills of continuation writing. */
export const continuationSkills: TopicDef = examTopic({
  id: "gaokao-continuation-skills",
  title: t("Continuing a Story", "续写的衔接与描写"),
  summary: t(
    "Gaokao continuation writing, step by step: the sentence that follows a given paragraph opening, and the sentence that shows a feeling through action.",
    "高考读后续写的分步练习：承接所给段首句的句子，以及通过动作表现情感的句子。",
  ),
  strand: "writing",
  prerequisites: ["b1-words-emotions", "ordering-sentences-in-a-paragraph"],
  encompasses: [],
  xp: 10,
  points: [
    point(
      "gaokao-following-the-opening",
      t("Following the Given Opening", "承接所给段首句"),
      t(
        "Each paragraph of a continuation starts with a sentence you are given. The sentence you write next must follow from it: if the given sentence says someone *took a deep breath and knelt down*, the next one says what they did or said then. It must also agree with the story: a character who is ill cannot suddenly appear, and a phone with no signal cannot ring. Keep the story moving toward solving its problem.",
        "续写的每一段都以所给的段首句开头。你写的下一句必须承接它：如果段首句说某人 *took a deep breath and knelt down*，下一句就写他接着做了什么、说了什么。它还必须与故事一致：生病的人不能突然出现，没有信号的手机不能响。让故事朝着解决问题的方向发展。",
      ),
      solvedChoiceGenerator(t("Choose the sentence that best follows the given opening.", "选出最能承接所给段首句的句子。"), continuing),
    ),
    point(
      "gaokao-showing-feelings",
      t("Showing a Feeling", "表现情感"),
      t(
        "Strong continuations show feelings instead of naming them. *She was nervous* tells the reader; *her hands trembled as she opened the envelope* lets the reader see it. Use what a character does, what their body does and what they say: *his face turned red*, *she could not sit still*, *he slammed the door*. Make sure the action matches the feeling.",
        "好的续写表现情感而不是直接说出来。*She was nervous* 是告诉读者；*her hands trembled as she opened the envelope* 让读者看到。用人物的动作、身体反应和话语：*his face turned red*、*she could not sit still*、*he slammed the door*。确保动作与情感相符。",
      ),
      solvedChoiceGenerator(t("Choose the best sentence.", "选出最佳句子。"), shownFeelings),
    ),
  ],
});
