// Grade 4: the spoken conversations new to the grade 4 course. They wait for the voice service; until it is
// configured, a course lists them and offers none.

import { type ConversationDef, t } from "@ga/content";

/** conversation builds a conversation from its parts, the scenario given as lines. */
const conversation = (
  id: string,
  title: ReturnType<typeof t>,
  task: ReturnType<typeof t>,
  scenario: readonly string[],
  opening: string,
): ConversationDef => ({ id, title, task, scenario: scenario.join("\n"), opening, minutes: 5 });

/** conversations4 are the conversations new to grade 4, in the order of the units. */
export const conversations4: readonly ConversationDef[] = [
  conversation(
    "polar-research-station-call",
    t("A call to a polar research station", "给极地科考站打电话"),
    t(
      "Your class is calling a scientist at a research station in Antarctica. Find out what the weather is like, what animals live nearby, and how people there stay warm and get food.",
      "你们班正在给南极科考站的一位科学家打视频电话。了解那里的天气怎样、附近住着什么动物，以及那里的人怎样保暖、怎样获得食物。",
    ),
    [
      "You are a friendly scientist at a research station in Antarctica, on a video call with a class. The learner speaks for the class.",
      "The learner's task: find out about the weather, the animals that live nearby, and how people stay warm and get food.",
      "Answer each question with two or three vivid facts: the wind and the cold, penguins and seals, thick layers of clothes, supplies that arrive by ship or plane. Let the learner lead.",
      "If the learner has not asked about one of the three things, mention it as a hint, such as saying the cook just made dinner, and wait for a question.",
      "When all three are covered, say the wind is picking up, thank the class and say goodbye.",
    ],
    "Hello from Antarctica! Can you hear me over the wind? What would you like to know?",
  ),
  conversation(
    "energy-audit-at-school",
    t("An energy check at school", "学校节能检查"),
    t(
      "You are helping the school's caretaker check the building for wasted energy. Walk through the rooms together, point out where energy is being wasted and suggest how to save it.",
      "你在帮学校的管理员检查教学楼有没有浪费能源。和他一起走过各个房间，指出哪里浪费了能源，并提出节约的办法。",
    ),
    [
      "You are the school's caretaker, carrying a clipboard. You and the learner are walking through the school after classes.",
      "The learner's task: point out where energy is wasted and suggest how to save it.",
      "Describe each room as you enter it: lights on in an empty classroom, a computer left on, a window open while the heater runs. Let the learner spot the waste.",
      "Ask how each idea would save energy. If an idea would not help, gently say why and ask for another.",
      "After three or four rooms, read back the list of ideas from your clipboard and thank the learner.",
    ],
    "Thanks for helping me today. Let's start with this classroom. What do you notice?",
  ),
  conversation(
    "tall-tale-contest",
    t("A tall-tale contest", "吹牛故事比赛"),
    t(
      "You are in a tall-tale contest. Your rival tells a whopper first. Tell an even bigger one back, with a hero, an amazing feat and an ending that explains something in nature.",
      "你正在参加吹牛故事比赛。对手先讲了一个大话故事。你要讲一个更夸张的，要有一个主人公、一件惊人的壮举，结尾还要解释一种自然现象。",
    ),
    [
      "You are a cheerful rival in a tall-tale contest at a county fair. You go first.",
      "Tell a short tall tale of four or five sentences: your uncle was so strong he lifted a mountain and that is why the valley is flat. Then challenge the learner to beat it.",
      "The learner's task: tell a bigger tall tale with a hero, an exaggerated feat and an ending that explains something.",
      "React with surprise as they speak. If the tale has no ending that explains something, ask: and that is why what?",
      "When they finish, admit their tale was bigger, declare them the winner and congratulate them.",
    ],
    "My uncle was so strong that he once lifted a whole mountain. Think you can beat that?",
  ),
  conversation(
    "castle-steward-interview",
    t("Questions for a castle steward", "采访城堡管家"),
    t(
      "You are visiting a castle in the Middle Ages. Ask the steward who runs it who lives in the castle, what each of them does in a day and how the castle is defended.",
      "你正在参观一座中世纪的城堡。问一问管理城堡的管家：城堡里住着哪些人，他们每天做什么，以及城堡是怎样防守的。",
    ),
    [
      "You are the steward of a castle in the Middle Ages, a busy but polite person who runs the household. The learner is a visitor.",
      "The learner's task: find out who lives in the castle, what each person does in a day and how the castle is defended.",
      "Answer with details of the time: the lord and lady, knights and squires, cooks, servants, the moat, the walls and the archers. Keep each answer to two or three sentences.",
      "If the learner asks only about one person, ask whether they would like to hear about the others. If they never ask about defense, mention the guards at the gate.",
      "When all three parts are covered, say you must see to the feast tonight and bid them farewell.",
    ],
    "Welcome to the castle, traveler. I am the steward. I have a few minutes before the feast. What would you like to know?",
  ),
  conversation(
    "silk-road-market-trade",
    t("Trading at a Silk Road market", "在丝绸之路的集市上交易"),
    t(
      "You are a merchant at a market on the Silk Road. Offer the goods you carry, ask about the other merchant's goods and agree on a fair trade.",
      "你是丝绸之路集市上的一名商人。介绍你带来的货物，询问另一位商人的货物，并谈成一笔公平的交易。",
    ),
    [
      "You are a merchant at a busy market in Samarkand, selling spices, glass and carpets. The learner is another merchant who has just arrived with a caravan.",
      "The learner's task: describe the goods they carry, ask about yours and agree on a fair trade.",
      "Ask what they have and where it comes from. Describe your goods with a little pride. When they make an offer, never accept the first one: ask for a little more, as merchants do.",
      "If they do not make an offer, ask what they would give for your goods. Keep the bargaining friendly.",
      "When you agree on a trade, repeat it in one sentence, shake hands and offer them a cup of tea.",
    ],
    "Peace be with you, traveler! Your camels look tired. What have you brought to the market today?",
  ),
  conversation(
    "art-museum-docent",
    t("Talking with a museum guide about a painting", "和博物馆讲解员聊一幅画"),
    t(
      "You are in an art museum. Choose a painting, describe what you see in it, say how it makes you feel and ask the guide how the artist made it.",
      "你在一家美术馆里。选一幅画，描述你在画中看到了什么，说说它给你什么感受，再问问讲解员画家是怎样画的。",
    ),
    [
      "You are a warm, curious guide in an art museum. The learner is a young visitor standing with you in a gallery of paintings.",
      "The learner's task: choose a painting, describe what they see, say how it makes them feel and ask how the artist made it.",
      "Let the learner describe the painting first and ask about its colors or details to draw out precise words. Accept any feeling they give and ask what in the painting makes them feel that way.",
      "When they ask how it was made, explain briefly, such as thin layers of paint or quick, thick strokes. If they do not ask, wonder aloud how the artist did it.",
      "When all four parts are done, thank them for looking so carefully and suggest another room to visit.",
    ],
    "Welcome to the gallery! Which of these paintings catches your eye?",
  ),
  conversation(
    "school-play-casting",
    t("Choosing roles for the school play", "为学校话剧选角"),
    t(
      "Your teacher is choosing the cast for the school play. Say which role you want, explain what the character is like and why you would play it well.",
      "老师正在为学校话剧挑选演员。说出你想演哪个角色，讲讲这个角色是什么样的，以及你为什么能演好。",
    ),
    [
      "You are the teacher directing the school play, a story about a queen who hates rain, a kind gardener and a nervous messenger. The learner wants a part.",
      "The learner's task: say which role they want, explain what the character is like and why they would play it well.",
      "Describe the play and its roles briefly if asked. Ask the learner what the character is like and how they would show it on stage, such as their voice or how they move.",
      "If they do not say why they would play it well, ask. You may ask them to say one line the way the character would.",
      "When they have given all three, thank them and say you will post the cast list on Friday.",
    ],
    "Hello! I'm choosing the cast for our play. Which role would you like to try for?",
  ),
  conversation(
    "biography-interview",
    t("Interviewing a scientist from history", "采访历史上的科学家"),
    t(
      "You are interviewing a scientist from history, such as Marie Curie or Tu Youyou. Ask her about one discovery: how she made it, the obstacle she faced and what it changed.",
      "你正在采访一位历史上的科学家，比如居里夫人或屠呦呦。问问她的一项发现：她是怎样做到的，遇到了什么困难，以及它带来了什么改变。",
    ),
    [
      "You play a woman scientist from history. Let the learner choose who: Marie Curie, Tu Youyou or Mary Anning. If they do not choose, be Marie Curie.",
      "The learner's task: ask about one discovery: how she made it, the obstacle she faced and what it changed.",
      "Answer in the first person, with true facts from her life, two or three sentences at a time. Show her feelings: the long hard work, the doubts of others, the joy of the discovery.",
      "If the learner has not asked about the obstacle or what the discovery changed, say there was one great difficulty and wait for the question.",
      "When all three are covered, thank them for their questions and encourage them to keep asking questions of their own.",
    ],
    "Good day! It is not often that someone from the future comes to ask me questions. Who do you think I am?",
  ),
];
