// Gaokao English writing, judged by a model: practical writing asks for an email, a notice, an invitation or a letter
// of about 80 words; continuation writing gives a story and asks for two more paragraphs of about 150 words in all,
// each beginning with a given sentence. Every task, story and model answer is written for this course.

import { type TopicDef, t } from "@ga/content";
import type { WritingItem } from "@ga/subject-english";
import { judgedExamTopic } from "./kit.ts";

/** practical builds a task of practical writing from the situation and the points it must cover. */
function practical(situation: string, points: readonly string[], model: string): WritingItem {
  return {
    task: `${situation}\n\n${points.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\nWrite about 80 words.`,
    model,
  };
}

const practicalBank: readonly WritingItem[] = [
  practical(
    "Suppose you are Li Hua. Your English teacher, Mr. Smith, is leaving your school at the end of term. Write him an email to:",
    ["thank him", "say what you learned from him", "give him your good wishes"],
    "Dear Mr. Smith,\n\nI'm writing to thank you for everything you have done for our class. We are all sad that you are leaving.\n\nBefore you came, I was afraid to speak English in class. You always encouraged us and never laughed at our mistakes, so I slowly became confident. You also showed us that reading English novels can be fun, and I have now read five of them.\n\nI wish you good health and every success in your new job. Please keep in touch!\n\nYours,\nLi Hua",
  ),
  practical(
    "Suppose you are Li Hua, head of the Student Union. Write a notice for the school's English newspaper about a book swap. Include:",
    ["the time and place", "what students should do", "why it is worth joining"],
    "Book Swap Day\n\nDo you have books you have already read? Bring them to our Book Swap Day and take home something new!\n\nThe event will be held in the school library from 3:30 to 5:30 p.m. next Friday. Each student may bring up to five books in good condition, and for each book you bring you can choose another one to take away.\n\nIt is a great way to find new books for free, share your favorite stories and make friends who love reading. Everyone is welcome!\n\nThe Student Union",
  ),
  practical(
    "Suppose you are Li Hua. Your British friend Tom wants to learn about Chinese food before he visits China. Write him an email to:",
    ["recommend one dish", "describe how it tastes or is made", "invite him to try it with your family"],
    "Dear Tom,\n\nI'm glad to hear you want to learn about Chinese food before your visit. Let me recommend my favorite dish: dumplings.\n\nDumplings are made of a thin dough wrapped around meat and vegetables, and they are usually boiled. They taste soft and juicy, and we eat them with a little vinegar. In my family, we make them together at the Spring Festival, which is great fun.\n\nWhy not come to my home when you arrive? My mother will teach you to make them.\n\nBest wishes,\nLi Hua",
  ),
  practical(
    "Suppose you are Li Hua. You borrowed a book from the school library but have lost it. Write an email to the librarian, Ms. Brown, to:",
    ["say sorry and explain what happened", "offer a way to solve the problem", "ask what you should do next"],
    "Dear Ms. Brown,\n\nI'm writing to say sorry. Two weeks ago I borrowed the book Stories of the Sea from the library, but I'm afraid I have lost it. I think I left it on the bus on my way home last Friday, and although I called the bus company, nobody has found it.\n\nI would like to buy a new copy for the library, or pay for the book if you prefer.\n\nCould you tell me which would be better, and how I should do it?\n\nYours sincerely,\nLi Hua",
  ),
  practical(
    "Suppose you are Li Hua. Your school is holding an English speech contest. Write an email to your foreign teacher, Ms. Green, to:",
    ["invite her to be a judge", "give the time and place", "say why the students would like her to come"],
    'Dear Ms. Green,\n\nOur school will hold an English speech contest, and we would be very glad if you could be one of the judges.\n\nThe contest will take place in the school hall from 2:00 to 4:30 p.m. next Wednesday. Twelve students will each give a five-minute speech on the topic "My Hometown".\n\nAs a native speaker, you would be able to give the speakers useful advice on their pronunciation and ideas, and all the students would love to hear your comments.\n\nI look forward to your reply.\n\nYours sincerely,\nLi Hua',
  ),
  practical(
    "Suppose you are Li Hua. Your exchange-student friend Anna is feeling homesick and lonely. Write her a letter to:",
    ["show that you understand how she feels", "give her two pieces of advice", "say you will help"],
    "Dear Anna,\n\nI'm sorry to hear that you are feeling homesick. It's completely natural to miss your family when you live so far from home, and many students feel the same in their first months.\n\nHere are two ideas that may help. First, set a regular time to video-call your family, so you have something to look forward to. Second, join a school club; doing something you enjoy is the easiest way to make friends.\n\nIf you like, I could take you to our dance club this Thursday. You're not alone!\n\nYours,\nLi Hua",
  ),
  practical(
    "Suppose you are Li Hua. Your class has just visited a local farm. Write a short report for the school's English newspaper. Include:",
    ["when and where you went", "what you did there", "what you learned"],
    "A Day on the Farm\n\nLast Saturday, our class visited Green Valley Farm, about an hour from the city.\n\nIn the morning, the farmer showed us how vegetables are grown without chemicals, and we helped pick tomatoes and beans. After a lunch made with the food we had picked, we fed the goats and learned how to plant young trees.\n\nThe visit taught us how much hard work goes into the food on our tables. Many of us said we would never waste food again.\n\nLi Hua, Class 3",
  ),
  practical(
    "Suppose you are Li Hua. You read an advertisement for volunteers at an international sports event in your city. Write an email to apply. Include:",
    ["why you are writing", "why you are suitable", "when you are free"],
    "Dear Sir or Madam,\n\nI'm writing to apply to be a volunteer at the international sports event next month.\n\nI'm a senior high school student, and I think I would be suitable for the job. I speak good English and have helped guide foreign visitors at our city museum. I'm also friendly, patient and good at working in a team.\n\nI'm free every weekend and could work every day during the summer holiday, which begins on July 10.\n\nThank you for considering my application. I look forward to hearing from you.\n\nYours faithfully,\nLi Hua",
  ),
  practical(
    "Suppose you are Li Hua. Your friend Chris has asked you how to stay healthy during the busy exam months. Write him an email to:",
    ["give at least two suggestions", "explain why they help"],
    "Dear Chris,\n\nThanks for your email. I know how busy the exam months are, so here are a few things that work for me.\n\nFirst, try to sleep at least seven hours a night. When you are well rested, you can remember more and make fewer careless mistakes. Second, take a short walk or do some exercise every day, even for twenty minutes. It clears your mind and helps you study better afterward. Finally, eat fruit instead of sweets when you feel hungry.\n\nGood luck with your exams!\n\nYours,\nLi Hua",
  ),
  practical(
    "Suppose you are Li Hua. Your school's English club is organizing a trip to a science museum. Write a notice. Include:",
    ["the date, time and meeting place", "what students will see", "how to sign up"],
    "Trip to the Science Museum\n\nThe English Club is organizing a trip to the City Science Museum on Sunday, May 18. We will meet at the school gate at 8:30 a.m. and return by 4:00 p.m.\n\nAt the museum, we will visit the space hall, try hands-on experiments and watch a film about robots, all with an English-speaking guide.\n\nIf you would like to join, please write your name and class on the list outside Room 201 before Thursday. Only forty places are available.\n\nThe English Club",
  ),
  practical(
    "Suppose you are Li Hua. Your American friend Mike would like to come with you to a traditional festival in your hometown, but you are busy that week. Write him an email to:",
    ["say sorry that you cannot go together", "suggest another time", "tell him what you can do then"],
    "Dear Mike,\n\nThank you for wanting to come with me to the Lantern Festival in my hometown. I'm really sorry, but I have to take part in a math competition that week, so I won't be able to go.\n\nHow about visiting in late October instead? There is a mid-autumn fair in the old town then, and it is much less crowded than the spring festivals.\n\nWe could watch the lion dance, try local snacks and visit my grandparents, who would love to meet you.\n\nLet me know what you think!\n\nYours,\nLi Hua",
  ),
  practical(
    "Suppose you are Li Hua. Your school wants to ask students how to make the school canteen better. Write a letter to the head teacher. Include:",
    ["what the problem is", "your suggestions", "why they would help"],
    "Dear Mr. Wang,\n\nI'm writing to share some ideas about how our school canteen could be improved.\n\nAt present, the lines at lunchtime are very long, and many students have only ten minutes to eat. Besides, the menu hardly changes from week to week.\n\nI would suggest opening a second window at busy times, and letting each class have lunch at a slightly different time. It would also be good to ask students to vote on new dishes every month.\n\nThese changes would save time and make lunch something we look forward to.\n\nYours sincerely,\nLi Hua",
  ),
];

/** continuation builds a task of continuation writing from the story and the two sentences that begin its paragraphs. */
function continuation(story: string, first: string, second: string, model: string): WritingItem {
  return {
    task: `Read the story, then continue it in two paragraphs of about 150 words in all. Begin the first paragraph with "${first}" and the second with "${second}"`,
    source: story,
    model,
  };
}

const continuationBank: readonly WritingItem[] = [
  continuation(
    'Every morning on her way to school, Mei passed an old man who sat on a bench outside the park, feeding the birds. He never spoke to anyone, and the other students said he was strange. Mei was a little afraid of him too.\n\nOne cold morning in December, Mei saw that the bench was empty. The next day it was empty again, and the day after. The birds still came, waiting on the ground, but nobody fed them. Mei felt a strange worry.\n\nOn Friday, she decided to ask the woman who ran the shop across the street. "Oh, Mr. Liu?" the woman said. "He fell on the ice and hurt his leg. He lives alone in the building behind the park. I don\'t think anyone has visited him."\n\nThat evening, Mei bought a bag of bread and walked to the building. Her heart was beating fast as she climbed the stairs.',
    "When the door opened, Mr. Liu looked very surprised.",
    "From that day on, Mei visited him every Saturday.",
    'When the door opened, Mr. Liu looked very surprised. He was leaning on a stick, and his face was pale. "I\'m Mei," she said quickly. "I walk past your bench every day. The birds miss you, so I brought some bread." For a moment he said nothing. Then his eyes filled with tears, and he invited her in. His small flat was cold, and there was almost no food in the kitchen. Mei made him a cup of hot tea, and he told her he had fed the birds every morning since his wife died.\n\nFrom that day on, Mei visited him every Saturday. Before school each morning, she fed the birds for him and told him about them later. By February, his leg was better, and one morning Mei found him back on his bench. This time he waved and called her name. The other students stared. Mei just smiled and sat down beside him.',
  ),
  continuation(
    "Jack had been chosen to run the last part of the relay race for his class at the school sports meeting. He had trained for weeks, and everyone believed he would win.\n\nOn the day of the race, the first three runners did well, and when the baton reached Jack, his team was in second place, only a few meters behind. Jack ran as fast as he could. He passed the leader and could already hear the cheers. But twenty meters from the finish line, his foot caught on the edge of the track, and he fell hard.\n\nFor a second, everything was silent. His knee was bleeding, and runners from three other classes rushed past him. Jack lay on the ground, thinking of all the weeks of training and of his classmates watching.",
    "Slowly, Jack pushed himself up from the ground.",
    "Back in the classroom, Jack could not look at anyone.",
    'Slowly, Jack pushed himself up from the ground. His knee hurt badly, but he picked up the baton and began to walk, then to run, toward the finish line. The crowd went quiet, and then someone began to clap. Soon the whole field was clapping and calling his name. Jack crossed the line in last place, tears running down his face, not because of the pain but because he had let his team down.\n\nBack in the classroom, Jack could not look at anyone. He sat at his desk and stared at his hands. Then Lily, the first runner, put a bottle of water in front of him. "We didn\'t come first," she said, "but you finished. That\'s what we\'ll remember." One by one, his classmates came over, patting his back. Jack looked up at last and managed a smile. Next year, he thought, he would run again.',
  ),
  continuation(
    "Lin had always wanted a dog, but her parents said their flat was too small. So when she found a thin, dirty puppy shaking under a car in the rain, she knew she couldn't leave it there.\n\nShe wrapped it in her coat and carried it home, planning to hide it in her room until she could think of something. For two days, the plan worked. She saved food from her own meals and took the puppy out early in the morning, before her parents woke up.\n\nOn the third evening, Lin came home from school and heard her mother's voice in her bedroom. Her heart stopped. The door was open, and her mother was sitting on the floor with the puppy in her arms.",
    '"How long has he been here?" her mother asked quietly.',
    "That weekend, the family made a decision.",
    '"How long has he been here?" her mother asked quietly. Lin\'s face turned red. She told her everything: the rain, the car, the saved food and the early walks. "I\'m sorry I lied," she said. "I just couldn\'t leave him." Her mother looked at the puppy, who was licking her hand. "You should have told us," she said. "But you did the right thing by helping him." That night, Lin\'s father came home and, to her surprise, laughed when he saw the puppy asleep in a shoe.\n\nThat weekend, the family made a decision. They would keep the puppy, but Lin had to promise to feed him, walk him twice a day and pay for his food with her pocket money. Lin agreed at once. They named him Rainy, after the day she had found him. Months later, Rainy was strong and healthy, and Lin had learned that telling the truth was easier than hiding it.',
  ),
  continuation(
    "Zhang Wei was the best student in his class at math, and he was proud of it. When a new student called Ahmed joined the class, Zhang Wei didn't pay much attention to him. Ahmed's Chinese was still poor, and he often sat alone.\n\nOne day the teacher announced a math competition for pairs. To everyone's surprise, she put Zhang Wei with Ahmed. Zhang Wei was annoyed. How could someone who could hardly understand the questions help him?\n\nAt their first practice, Zhang Wei worked on the problems by himself and didn't ask Ahmed anything. But when he got stuck on a difficult problem about shapes, Ahmed quietly took the pencil and drew a picture. In two minutes, the answer was clear.",
    "Zhang Wei stared at the drawing in surprise.",
    "On the day of the competition, the two boys sat side by side.",
    'Zhang Wei stared at the drawing in surprise. "How did you do that?" he asked. Ahmed smiled shyly and explained, half in Chinese and half with his hands, that he had always seen math as pictures. Zhang Wei felt ashamed of how he had treated him. For the rest of the week, they practiced together every day after school. Zhang Wei helped Ahmed with the Chinese words in the questions, and Ahmed showed him how to draw problems that seemed impossible.\n\nOn the day of the competition, the two boys sat side by side. When they reached the hardest problem, Zhang Wei read it aloud slowly, and Ahmed began to draw. They finished just as time ran out. A week later, the teacher announced that they had won second place. Zhang Wei was happy, but what pleased him most was that he had found a real friend.',
  ),
  continuation(
    "It was the first time Xiao Yu had gone camping without her parents. She and three friends had walked for hours into the mountains and put up their tent beside a small lake.\n\nAs it grew dark, they made a fire and told stories. Then the wind began to rise. Clouds covered the stars, and the first heavy drops of rain fell. Within minutes, it was pouring. The fire went out, and water began to come in under the tent.\n\nThey tried to call home, but there was no signal. The others looked at Xiao Yu, who was the oldest. She was frightened too, but she remembered that they had passed a small wooden hut on the path about half an hour before.",
    '"We have to go back to the hut," Xiao Yu said.',
    "When the sun came up, the storm was over.",
    '"We have to go back to the hut," Xiao Yu said. She tried to sound calm. They packed only what they needed, held hands so that no one would get lost and followed the light of a single phone down the muddy path. Twice someone slipped, and once they thought they had taken the wrong way. At last, through the rain, they saw the dark shape of the hut. Inside it was dry. They sat close together under their sleeping bags, wet and shaking, and listened to the storm until they fell asleep.\n\nWhen the sun came up, the storm was over. The lake shone, and birds were singing as if nothing had happened. They walked back to the tent, which had fallen flat, and laughed at how small it looked. That afternoon, when they reached home, Xiao Yu\'s mother hugged her for a long time. Xiao Yu realized she had grown up a little that night.',
  ),
  continuation(
    "My grandfather had been a carpenter all his life. His hands were rough and strong, and our home was full of the chairs, tables and toys he had made. When I was small, I spent hours in his workshop, watching wood turn into something beautiful.\n\nWhen I was twelve, his hands began to shake, and he could no longer hold his tools. He stopped going into the workshop. He sat by the window for most of the day and hardly spoke. My mother said he felt useless.\n\nOne afternoon, I found an unfinished wooden boat in the corner of the workshop, covered in dust. I knew he had been making it for me before he got ill. I carried it into the living room and put it on the table in front of him.",
    "Grandfather looked at the boat for a long time.",
    "Three weeks later, the boat was finished.",
    'Grandfather looked at the boat for a long time. Then he touched its side gently, the way he used to. "It needs a mast," he said at last, "and the bottom isn\'t smooth yet." "Then teach me," I said. He looked at me in surprise. Slowly a smile appeared on his face. The next afternoon, he sat beside me in the workshop for the first time in months. He couldn\'t hold the tools, but he told me exactly what to do, and when I made a mistake, he laughed and showed me how to fix it.\n\nThree weeks later, the boat was finished. It wasn\'t perfect, but it was ours. We took it to the river near our home and watched it float. Grandfather stood on the bank, holding my arm, his eyes bright. "You have good hands," he said. From then on, we spent every weekend in the workshop, and he never sat silently by the window again.',
  ),
  continuation(
    "Ever since she was little, Hannah had been terrified of speaking in front of people. So when her teacher chose her to give the welcome speech at the school's open day, she almost cried.\n\nFor two weeks she practiced every evening in front of the mirror. She knew every word by heart. But on the morning of the open day, when she walked onto the stage and saw hundreds of parents and visitors, her mind went completely empty. She looked down at her notes, but her hands were shaking so much that she couldn't read them.\n\nThe silence went on and on. Someone coughed. Hannah looked desperately across the hall and saw her little brother in the front row, holding up a sign he had made: \"Go, Hannah!\"",
    "Hannah took a deep breath and smiled at her brother.",
    "After the speech, a woman came up to Hannah.",
    'Hannah took a deep breath and smiled at her brother. She put her notes down. Instead of the speech she had learned, she began to tell the audience the truth: that she had been afraid of speaking all her life, and that this school had helped her try new things anyway. Her voice was shaky at first, but it grew stronger. She talked about her teachers, her friends and the clubs she had joined. When she finished, there was a moment of silence, and then loud applause.\n\nAfter the speech, a woman came up to Hannah. "My daughter is very shy, just like you were," she said. "She\'s starting here next year, and after hearing you, she isn\'t so worried anymore." Hannah\'s face glowed. That evening she gave her brother the biggest hug of his life. She had not given a perfect speech, she realized, but she had given an honest one.',
  ),
  continuation(
    "Every year, Tom's class planted trees on the hill behind the school. This spring, Tom was given a small pine tree to look after. He watered it every day after class and was proud when it grew its first new branch.\n\nOne Monday morning in June, Tom ran up the hill and stopped in shock. Someone had broken several of the young trees, and his pine lay on the ground, its top snapped off. Tom felt angry and sad at the same time. He wanted to find out who had done it.\n\nLater that week, he saw a younger boy standing alone on the hill, looking at the broken trees. When the boy saw Tom, he turned red and started to run away.",
    '"Wait!" Tom shouted, running after him.',
    "The next Saturday, the two boys met on the hill.",
    '"Wait!" Tom shouted, running after him. The boy stopped, his head down. "It was me," he said in a small voice. "I was playing football with my friends, and we kicked the ball into the trees. They ran away, but I felt terrible." Tom\'s anger began to fade. The boy, whose name was Leo, looked as if he might cry. "I wanted to say sorry," he said, "but I didn\'t know how." Tom thought for a moment. "Saying sorry is a good start," he said. "Fixing it would be better."\n\nThe next Saturday, the two boys met on the hill. Tom had asked his teacher for some new young trees, and Leo had brought his friends. Together they dug holes, planted the trees and watered them. Leo promised to come every week to help. By the end of the summer, the new trees were growing strongly, and Tom had a new friend who never played football near the hill again.',
  ),
  continuation(
    "Sun Li had worked at the small restaurant on the corner for three years, washing dishes in the kitchen. She was quiet and hardworking, and most customers didn't know she existed.\n\nOne busy Saturday evening, the cook suddenly fell ill and had to go home. The restaurant was full, and the owner, Mr. Zhao, didn't know what to do. He was about to tell the customers that the kitchen was closing when Sun Li stepped forward.\n\n\"I can cook,\" she said. Mr. Zhao looked at her doubtfully. He had never seen her do anything but wash dishes. But with forty hungry customers waiting, he had no choice.",
    "Sun Li tied on an apron and went to work.",
    "The following Monday, Mr. Zhao called Sun Li into his office.",
    "Sun Li tied on an apron and went to work. She moved quickly and calmly, as if she had done it all her life. She had watched the cook for three years and had practiced at home every evening, cooking for her family. Soon the kitchen was full of good smells. Mr. Zhao carried the first plates out nervously, but the customers ate every bite. One man even came into the kitchen to ask who had made his noodles, because they tasted just like his mother's.\n\nThe following Monday, Mr. Zhao called Sun Li into his office. She was afraid she had done something wrong. Instead, he thanked her and asked why she had never told him she could cook. \"Nobody asked,\" she said simply. Mr. Zhao laughed and offered her a job as the second cook. A month later, a new dish appeared on the menu: Sun Li's Saturday noodles.",
  ),
  continuation(
    "When Maria moved to a new city, the thing she missed most was her piano. The new flat was too small, and her family couldn't afford to bring it. For months she practiced on the table with her fingers, imagining the music.\n\nOne afternoon, on her way home, she passed an old piano standing in the middle of the train station. A sign on it said: \"Play me. I'm yours.\" People hurried past without looking at it.\n\nMaria stopped. She hadn't played in front of strangers before. She looked around, then sat down on the stool and lifted the lid. The keys were old and yellow. She put her fingers on them and began to play the piece she had loved most at home.",
    "At first nobody seemed to notice the music.",
    "When Maria finally looked up, an old man was standing beside the piano.",
    'At first nobody seemed to notice the music. People kept walking, talking on their phones and checking the time. But Maria forgot about them. She played as if she were back in her old home, with the window open and her grandmother listening from the kitchen. Slowly, people began to stop. A woman put down her bags. Two children sat on the floor. When the last note ended, the small crowd burst into applause, and Maria realized her face was wet with tears.\n\nWhen Maria finally looked up, an old man was standing beside the piano. "I teach music at the community center," he said. "We have a piano there that nobody plays. Would you like to use it?" Maria could hardly speak. She nodded. From then on, she practiced there every day after school, and on Saturdays she came back to the station to play for whoever would listen.',
  ),
  continuation(
    "Every evening, Wang Fang's father came home late from the factory, tired and silent. He ate quickly, watched the news and went to bed. Wang Fang felt she hardly knew him. They never talked about anything except her grades.\n\nOne day her teacher asked the class to interview a family member about their job. Wang Fang didn't want to ask her father. She thought his work was boring and that he wouldn't want to talk. But her mother was away visiting relatives, so she had no choice.\n\nThat evening, she nervously sat down beside her father with her notebook. \"Dad, can I ask you some questions about your work?\" she said. He looked up from the TV, surprised.",
    "Her father turned off the TV and thought for a moment.",
    "The next day, Wang Fang read her report to the class.",
    'Her father turned off the TV and thought for a moment. Then he began to talk. He told her that he checked the parts that went into hospital machines, and that one small mistake could put a patient in danger. He described how he had once found a broken part that everyone else had missed. As he spoke, his tired face came alive. Wang Fang wrote quickly, filling page after page. When they finally stopped, it was almost midnight. "Nobody has ever asked me about my work before," he said quietly.\n\nThe next day, Wang Fang read her report to the class. She called it "The Man Who Keeps Patients Safe." Her classmates listened carefully, and the teacher said it was one of the best reports she had heard. That evening, Wang Fang told her father, and for the first time in years, he laughed out loud. After that, they talked every evening, and not only about her grades.',
  ),
  continuation(
    "Li Ming had saved his pocket money for a whole year to buy a new bike. When he finally had enough, he went to the shop with his father and chose a shiny blue one. He rode it to school every day and cleaned it every weekend.\n\nOne afternoon, after basketball practice, Li Ming went to the bike shed and found that his bike was gone. He searched everywhere and asked everyone, but no one had seen it. He walked home in the rain, feeling sick.\n\nTwo weeks later, on his way to the market, he saw a blue bike leaning against a wall outside a small house. It had the same scratch on the front wheel that he had made the week he bought it.",
    "Li Ming knocked on the door of the house.",
    "That evening, Li Ming told his parents what had happened.",
    "Li Ming knocked on the door of the house. A thin boy of about ten opened it, and when he saw Li Ming looking at the bike, his face went white. Behind him, Li Ming could see a tiny room and an old woman lying in bed, coughing. The boy explained in a shaking voice that he had taken the bike to deliver medicine to his grandmother from the hospital across the city, because the buses were too expensive. \"I was going to give it back,\" he said. \"I'm sorry.\"\n\nThat evening, Li Ming told his parents what had happened. He had his bike back, but he couldn't stop thinking about the boy. His father was quiet for a while. Then he went to the storeroom and brought out Li Ming's old bike, which was too small for him now. The next morning, they fixed it together and took it to the boy, who couldn't believe his eyes.",
  ),
];

/** practicalWriting is the practical writing of the writing section of the paper. */
export const practicalWriting: TopicDef = judgedExamTopic({
  id: "gaokao-practical-writing",
  title: t("Practical Writing", "应用文写作"),
  summary: t(
    "Write an email, a notice, an invitation or a letter of about 80 words that covers every point of a task, as in the practical writing of the Gaokao.",
    "按照高考应用文写作的形式，写一封约 80 词的邮件、通知、邀请或书信，覆盖任务的每个要点。",
  ),
  prerequisites: ["writing-a-formal-email"],
  encompasses: [
    { topic: "writing-a-formal-email", weight: 0.3 },
    { topic: "writing-an-informal-email", weight: 0.3 },
  ],
  criteria: ["gaokao-practical-points", "gaokao-practical-form"],
  point: {
    id: "practical-writing",
    title: t("Practical writing", "应用文写作"),
    explanation: t(
      "Read the task and number its points: each one needs at least a sentence, and a point you leave out costs more than a small mistake. Begin with the reason for writing, give each point its own few sentences with a detail or a reason, and end politely. A letter or email has a greeting, such as *Dear Mr. Smith*, and a closing with the name the task gives; a notice has a title and the facts its readers need: what, when, where and how. Keep to about 80 words, and choose the tone for the reader: friendly to a friend, polite to a teacher or a stranger.",
      "读题时给要点编号：每个要点至少要写一句，漏掉一个要点比犯一个小错误损失更大。开头说明写信的目的，每个要点用几句话展开，并给出细节或理由，结尾要礼貌。书信或邮件要有称呼，如 *Dear Mr. Smith*，以及署有题目所给姓名的结束语；通知要有标题，并写明读者需要的信息：什么事、什么时间、什么地点、怎样参加。篇幅控制在 80 词左右，语气要适合读者：对朋友亲切，对老师或陌生人礼貌。",
    ),
  },
  question: t("Write the text the task asks for.", "按要求写出这篇应用文。"),
  bank: practicalBank,
  limits: { minWords: 60, maxChars: 1000 },
  xp: 15,
  what: t("answer", "范文"),
});

/** continuationWriting is the continuation writing of the writing section of the paper. */
export const continuationWriting: TopicDef = judgedExamTopic({
  id: "gaokao-continuation-writing",
  title: t("Continuation Writing", "读后续写"),
  summary: t(
    "Read a story and continue it in two paragraphs of about 150 words in all, each beginning with a given sentence, as in the continuation writing of the Gaokao.",
    "按照高考读后续写的形式，读一个故事，用两段共约 150 词把它续写完，每段以所给的句子开头。",
  ),
  prerequisites: ["writing-a-story"],
  encompasses: [{ topic: "writing-a-story", weight: 0.5 }],
  criteria: ["gaokao-continuation-plot", "gaokao-continuation-detail"],
  point: {
    id: "continuation-writing",
    title: t("Continuation writing", "读后续写"),
    explanation: t(
      "Before you write, ask what the story is about and how its main character feels at the end of it. The first given sentence tells you what happens next, and the second tells you where the story must arrive, so the first paragraph must lead to the second. Keep the characters as the story has shown them, and finish with an ending that answers the problem the story raised. Show rather than tell: what people do, how they feel and a few words they say, in the past tense of the story.",
      "动笔之前，先想一想故事讲的是什么、主人公在故事结尾有什么感受。第一段所给的句子告诉你接下来发生了什么，第二段所给的句子告诉你故事要走向哪里，所以第一段必须自然地引出第二段。人物要保持原文中的样子，结尾要回应故事提出的问题。要用描写代替叙述：写人物做了什么、有什么感受、说了哪几句话，并沿用故事的过去时。",
    ),
  },
  question: t("Continue the story as the task asks.", "按要求续写这个故事。"),
  bank: continuationBank,
  limits: { minWords: 120, maxChars: 1600 },
  xp: 25,
  what: t("continuation", "续写"),
});
