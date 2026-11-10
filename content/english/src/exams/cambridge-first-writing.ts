// Cambridge B2 First Writing, judged by a model: Part 1 is an essay for a teacher that uses two given notes and an idea
// of the writer's own; Part 2 is an article, an email or letter, a report or a review. Both ask for 140 to 190 words.
// Every task and model answer is written for this course.

import { type TopicDef, t } from "@ga/content";
import type { WritingItem } from "@ga/subject-english";
import { judgedExamTopic } from "./kit.ts";

/** essay builds a task of Part 1 from what the class talked about, the question, the two notes and a model. */
function essay(talk: string, question: string, notes: readonly [string, string], model: string): WritingItem {
  return {
    task: `In your English class you have been talking about ${talk}. Now your English teacher has asked you to write an essay.\n\n**${question}**\n\nNotes. Write about:\n\n1. ${notes[0]}\n2. ${notes[1]}\n3. your own idea\n\nWrite your essay in 140 to 190 words, using all the notes and giving reasons for your point of view.`,
    model,
  };
}

const essayBank: readonly WritingItem[] = [
  essay(
    "where people live",
    "Is it better for young people to live in a city or in the countryside?",
    ["jobs and education", "health"],
    "Many young people leave the countryside as soon as they can, but is city life really better? In my opinion, it depends on the stage of life you are at.\n\nFirstly, cities clearly offer more opportunities for work and study. Universities, large companies and training courses are mostly found in cities, so a young person who wants to build a career may have little choice but to move there.\n\nOn the other hand, the countryside is often a healthier place to live. The air is cleaner, there is less noise and stress, and it is easier to spend time outdoors. Many people who grew up in the country say that they only appreciated this after they had left.\n\nAnother point to consider is the cost of living. Rents in cities are much higher, which means that many young people spend most of their income on housing.\n\nTo sum up, I believe the city is the better choice for young people starting their careers, but the countryside may suit them better later, when they want a calmer life.",
  ),
  essay(
    "rules at school",
    "Should students have to wear a school uniform?",
    ["the cost for families", "expressing your personality"],
    "School uniforms are common in many countries, but people disagree about whether they are a good idea. Personally, I think the advantages are greater than the disadvantages.\n\nTo begin with, uniforms can save families money. Without a uniform, many teenagers feel they need fashionable and expensive clothes, and parents feel under pressure to buy them. A few simple uniforms are cheaper in the long run.\n\nIt is true that uniforms make it harder for students to express their personality through their clothes. However, young people have many other ways to show who they are, such as their hobbies, their opinions and what they wear at weekends.\n\nIn addition, uniforms help to create a sense of belonging. When everyone wears the same clothes, it is less obvious who comes from a rich family and who does not, and this can reduce bullying.\n\nIn conclusion, although uniforms limit freedom a little, I believe they make school a fairer and more comfortable place for most students.",
  ),
  essay(
    "the lives of teenagers",
    "Do young people today have enough free time?",
    ["homework and exams", "time spent online"],
    "It is often said that teenagers today are busier than ever. In my view, many young people do not have enough real free time, although part of the problem is how they use the time they have.\n\nFirst of all, the pressure of school has increased. Many students have several hours of homework every evening, and in the months before exams they may also have extra classes at weekends. For them, free time is something they can only dream of.\n\nOn the other hand, young people spend a great deal of time online. Some of this is relaxing, but much of it is not really free time at all: scrolling through messages and videos can leave you more tired than before.\n\nA further point is that sport and hobbies are often organised by adults, with timetables and competitions, so even leisure can feel like work.\n\nTo conclude, I think schools should reduce homework, but young people should also learn to switch off their phones and use their free time in ways that really refresh them.",
  ),
  essay(
    "what schools should teach",
    "Should all students learn to cook at school?",
    ["healthy eating", "the cost"],
    "Cooking is a skill that everyone needs, yet many young people leave home without being able to make a simple meal. I strongly believe that cooking should be taught to all students.\n\nThe main reason is health. People who cannot cook tend to depend on fast food and ready meals, which often contain too much salt, sugar and fat. If students learn to prepare fresh food, they are more likely to eat well for the rest of their lives.\n\nSome people argue that cooking lessons are too expensive for schools, because they need kitchens and ingredients. This is a fair point, but simple dishes can be made with basic equipment, and the long-term savings for the health service could be enormous.\n\nMoreover, cooking teaches other useful skills, such as planning, working in a team and managing money. Students who learn to cook on a budget will find life much easier when they live on their own.\n\nFor these reasons, I think cooking deserves a place in every school timetable, just like maths or science.",
  ),
  essay(
    "travel",
    "Is it better to travel alone or with other people?",
    ["safety", "meeting new people"],
    "More and more young people are choosing to travel on their own. Although this can be a wonderful experience, I believe that for most people travelling with others is the better option.\n\nThe most important reason is safety. When you are in a foreign country, you may get lost, fall ill or lose your passport. In these situations, it is much easier to cope if someone is with you, and your family at home will worry less.\n\nOn the other hand, people who travel alone often say that it is easier to meet new people. When you are with friends, you tend to stay together and talk to each other, while a person on their own is more likely to chat to locals and other travellers.\n\nFinally, there is the question of cost. Sharing hotel rooms, taxis and meals with others can make a trip considerably cheaper.\n\nAll things considered, I think travelling alone suits confident, experienced travellers, but for most people, especially on their first trips abroad, going with others is wiser.",
  ),
  essay(
    "technology and young people",
    "Do smartphones do more good than harm to teenagers?",
    ["keeping in touch", "concentration"],
    "Almost every teenager now owns a smartphone, and adults often worry about the effect this has. In my opinion, smartphones do more good than harm, as long as they are used sensibly.\n\nOne clear benefit is that they help teenagers keep in touch with family and friends. Parents feel safer when they can contact their children, and young people who move to a new school or city can stay close to old friends.\n\nHowever, there is no doubt that phones can damage concentration. Notifications interrupt homework every few minutes, and many students find it difficult to read for long periods without checking their screens.\n\nAnother advantage is that a smartphone is a powerful tool for learning. Students can look up information instantly, practise languages with apps and watch videos that explain difficult topics.\n\nIn conclusion, smartphones bring real benefits, but teenagers need to learn to control them rather than be controlled by them. Simple rules, such as no phones during homework or at meals, can help them get the best of both worlds.",
  ),
  essay(
    "transport in cities",
    "Should cars be banned from city centres?",
    ["pollution", "shops and businesses"],
    "Many cities are considering banning cars from their centres. I believe this would be a positive step, although it needs to be planned carefully.\n\nThe strongest argument for a ban is pollution. Traffic is one of the main causes of dirty air in cities, which leads to serious health problems. Without cars, city centres would be cleaner, quieter and much more pleasant places to walk.\n\nShop owners often fear that a ban would keep customers away. However, in cities that have already removed cars, the opposite has often happened: people spend more time in streets where they can walk safely, and they visit more shops and cafés.\n\nAnother important point is that a ban only works if public transport is good. If buses and trains are expensive or unreliable, people will simply go shopping somewhere else.\n\nIn conclusion, I am in favour of car-free city centres, but only if cities first invest in cheap, frequent public transport and make sure that deliveries and disabled people can still reach the centre.",
  ),
  essay(
    "learning languages",
    "Is it still important to learn a foreign language?",
    ["jobs", "understanding other cultures"],
    "Now that translation apps are so good, some people wonder whether learning a foreign language is still worth the effort. I am convinced that it is.\n\nFirst of all, languages are valuable in the job market. Employers in many fields, from tourism to engineering, prefer candidates who can communicate with clients and colleagues in other countries, and these jobs are often better paid.\n\nSecondly, learning a language helps us to understand other cultures. Every language has expressions and jokes that reflect the way its speakers see the world, and you can only really appreciate them if you understand the language itself.\n\nIt is true that apps can translate menus and signs instantly. However, they cannot replace a real conversation, in which you build a relationship with someone and understand not only their words but also their feelings.\n\nIn conclusion, technology makes some tasks easier, but it does not make language learning unnecessary. Speaking another language opens doors, both professionally and personally, that no app can open for us.",
  ),
  essay(
    "museums and galleries",
    "Should museums be free for everyone?",
    ["education", "who should pay for them"],
    "In some countries, national museums are free to visit, while in others tickets are quite expensive. I believe that museums should be free, at least for their main collections.\n\nThe main argument is education. Museums allow people of all ages to learn about history, science and art in a way that books cannot. If entry is free, families with little money can visit as often as wealthy ones, and schools can organise trips without asking parents to pay.\n\nThe obvious question is who should pay for them. Running a museum is expensive, and if visitors do not pay, the money must come from taxes. However, I think this is fair, because the whole of society benefits from a better educated population.\n\nIn addition, free museums attract more tourists, who spend money in local hotels, restaurants and shops.\n\nTo sum up, free entry to museums is a good investment. Museums could still charge for special exhibitions, but their permanent collections should be open to everyone.",
  ),
  essay(
    "sport",
    "Are team sports better for young people than individual sports?",
    ["friendship", "competition"],
    "Young people can choose from a huge range of sports, from football to swimming. In my opinion, team sports offer some special benefits, but individual sports are just as valuable.\n\nOne advantage of team sports is that they help young people make friends. Players train together every week, celebrate victories together and support each other after defeats, and these friendships often last for years.\n\nCompetition is part of both kinds of sport. In a team, the pressure to win is shared, which some young people find easier to deal with. In individual sports, by contrast, you are fully responsible for your own results, which can teach discipline and independence.\n\nAnother point is that not everyone enjoys team sports. Shy or less confident teenagers may feel uncomfortable in a team, but they might love running, climbing or tennis, and any sport is better than none.\n\nIn conclusion, I do not think one type of sport is better than the other. What matters most is that young people find an activity that they enjoy and will keep doing.",
  ),
  essay(
    "work and study",
    "Should students have part-time jobs while they are at school?",
    ["money", "studies"],
    "Many teenagers work at weekends or in the evenings, in shops, cafés or restaurants. I think a part-time job can be good for students, as long as it does not take up too much of their time.\n\nThe most obvious benefit is money. Earning their own money allows young people to pay for their hobbies and clothes without asking their parents, and it teaches them how hard it is to earn and how important it is to save.\n\nOn the other hand, a job can harm a student's studies. If a teenager works long hours, they may be too tired to concentrate in class or to do their homework properly, and their exam results may suffer.\n\nA further benefit is experience. A part-time job teaches responsibility, teamwork and how to deal with customers, and it looks good when students later apply for university or full-time work.\n\nIn conclusion, I believe a job of a few hours a week is a valuable experience for students, but school should always come first.",
  ),
  essay(
    "reading",
    "Is it better to read books on paper or on a screen?",
    ["cost", "concentration"],
    "E-readers and tablets have changed the way many people read. However, in my view, paper books still have important advantages over screens.\n\nSome people prefer screens because electronic books are often cheaper, and thousands of them can be carried on a single device. This is certainly convenient for travellers and students. On the other hand, the device itself is expensive, and paper books can be borrowed from libraries for free or bought second-hand.\n\nThe most important difference, I believe, is concentration. When I read on a screen, I am easily distracted by messages and notifications, and many readers say they remember less of what they read on screens. A paper book has no other function, so it is easier to focus on the story.\n\nAnother point is that many people simply enjoy the experience of a real book: the feel of the pages and the pleasure of seeing it on a shelf.\n\nIn conclusion, screens are useful for some purposes, but for serious reading, I would always choose a book on paper.",
  ),
];

/** part2 builds a task of Part 2 from the situation, the kind of text and a model. */
function part2(situation: string, kind: string, model: string): WritingItem {
  return { task: `${situation}\n\nWrite your ${kind} in 140 to 190 words.`, model };
}

const part2Bank: readonly WritingItem[] = [
  part2(
    "You have seen this announcement in an international magazine for young people:\n\n**Articles wanted: a place that is special to me.** Describe a place that is special to you and tell us why it means so much to you. The best articles will be published next month.",
    "article",
    "The Bench Above the Harbour\n\nEveryone has a place where they go to think. Mine is an old wooden bench on the hill above the harbour in my home town, and I have been going there since I was eight.\n\nIt is not a beautiful bench. The paint has almost gone, and someone carved their initials into it long ago. But the view is wonderful. From there you can see the fishing boats coming in, the roofs of the old town and, on clear days, the islands far out at sea.\n\nMy grandfather used to take me there on Sunday mornings. He would point at the boats and tell me stories about the years he spent working at sea. He died three years ago, and now, when I sit on the bench, I feel as if he is still beside me.\n\nI go there when I am worried about exams, when I have argued with friends, or just when I need some peace. Somehow, problems always look smaller from up there. Do you have a place like that?",
  ),
  part2(
    "You have seen this announcement on an English-language website for students:\n\n**Has technology made you happier?** Tell us how technology has changed your life, for better or for worse. We will publish the most interesting articles.",
    "article",
    "My Phone and Me: It's Complicated\n\nTwo years ago, I was the kind of person who checked my phone before I even got out of bed. I thought technology was making my life better. Now I'm not so sure.\n\nDon't get me wrong: technology has given me a lot. I video-call my cousins in Canada every week, I've taught myself the guitar with online lessons, and I never get lost in a new city. Without technology, my world would be much smaller.\n\nBut last year I noticed something worrying. I was spending four hours a day on social media, and the more I scrolled, the worse I felt. Everyone else seemed to have more exciting lives, better holidays and more friends.\n\nSo I made a change. I deleted two apps and started leaving my phone in another room at night. Within a month I was sleeping better, reading again and actually talking to my family at dinner.\n\nSo, has technology made me happier? Yes, but only since I learned to switch it off.",
  ),
  part2(
    "You have seen this announcement in your school's English-language magazine:\n\n**My hero.** Tell us about a person you admire. It could be someone famous or someone you know. What have they done, and why do you admire them?",
    "article",
    "My Hero Wears an Apron\n\nWhen people talk about heroes, they usually mean famous athletes or brave firefighters. My hero is Mrs Okafor, who runs the small bakery at the end of my street.\n\nMrs Okafor came to this country twenty years ago with two young children and almost no money. She worked in a factory during the day and baked bread at night to sell to her neighbours. Five years later, she opened her own shop.\n\nWhat makes her a hero to me is not only her hard work, but her kindness. Every evening, she gives the bread she has not sold to a shelter for homeless people. When my father lost his job, she offered me a weekend job so that our family had a little extra money, and she never made me feel embarrassed about it.\n\nFrom her, I have learned that you don't need to be rich or famous to change people's lives. You just need to notice who needs help, and then help them.\n\nEveryone should have a Mrs Okafor in their life.",
  ),
  part2(
    "This is part of an email you have received from your English friend Sam:\n\n*I'm coming to your country for the summer, and I'd love to get a part-time job while I'm there. What kind of job could I do? How should I look for one? Is there anything I should be careful about?*",
    "email",
    "Hi Sam,\n\nGreat to hear you're coming in the summer! It would be fantastic to see you.\n\nFinding a summer job here shouldn't be too hard, especially in July, when the town is full of tourists. Cafés and restaurants on the seafront always need extra staff, and since you speak English, you could also try the hotels or the tourist information office, where they need people to help foreign visitors.\n\nThe best way to find something is to walk round with a few copies of your CV and ask in person. Managers here prefer to meet people face to face. You could also look at the job pages of the local newspaper's website.\n\nOne thing to be careful about: check whether you're allowed to work here with your passport, and always agree the pay and hours before you start. Some places pay very little to students who don't ask.\n\nLet me know when you've booked your flights, and you can stay with us for the first few days!\n\nBest wishes,\nAna",
  ),
  part2(
    "You have seen this advertisement:\n\n**Summer camp assistants wanted.** We need young people to help at our international summer camp for children aged 8 to 12. Activities include sport, art and music. You must speak English. Write to the director, Ms Carter, telling us why you would be suitable.",
    "letter",
    "Dear Ms Carter,\n\nI am writing to apply for the position of assistant at your international summer camp, which I saw advertised on your website.\n\nI am seventeen years old and in my final year at secondary school. I have been learning English for ten years, and last year I passed the B2 First exam, so I can communicate easily with children and staff from different countries.\n\nI have plenty of experience with young children. For the past two years, I have helped at a Saturday football club for eight- to ten-year-olds, and I often look after my younger cousins. I also play the guitar, and I would be very happy to lead music activities, such as singing around the campfire.\n\nI am patient, energetic and reliable, and I believe I would be a useful member of your team. I am available for the whole of July and August.\n\nThank you for considering my application. I look forward to hearing from you.\n\nYours sincerely,\nMarta Kowalska",
  ),
  part2(
    "This is part of an email you have received from your English-speaking friend Jess:\n\n*I'm doing a school project about festivals around the world. Could you tell me about an important festival in your country? What do people do, and what do you enjoy most about it?*",
    "email",
    "Hi Jess,\n\nThanks for your email! Your project sounds really interesting, and I'm happy to help.\n\nThe most important festival in my country is the Spring Festival, which is also called Chinese New Year. It usually falls in late January or February, and the celebrations last for about two weeks.\n\nBefore the festival, families clean their homes from top to bottom to sweep away bad luck, and they decorate their doors with red paper. On New Year's Eve, everyone tries to get home, however far away they live, for a big family dinner. Afterwards, we stay up late, watch a famous TV show and set off fireworks at midnight.\n\nWhat I enjoy most is the time with my family. My grandparents live in another city, so it's the only time of year when all my cousins are together. I also love the red envelopes of money that older relatives give to children!\n\nIf you need any photos for your project, just let me know.\n\nLove,\nMei",
  ),
  part2(
    "Your teacher has asked you to write a report on the sports facilities at your school. Describe the facilities, say how much students use them, and suggest how they could be improved.",
    "report",
    "Introduction\n\nThe aim of this report is to describe the sports facilities at our school, to explain how much students use them and to suggest some improvements.\n\nCurrent facilities\n\nThe school has a large sports hall, a football pitch and two outdoor tennis courts. The sports hall is in good condition and is used for basketball, volleyball and badminton. However, the changing rooms are old, and the showers often do not work.\n\nHow the facilities are used\n\nThe sports hall is very popular and is booked every lunchtime and after school. The football pitch is used mainly by boys, while the tennis courts are hardly used at all, partly because students have to bring their own equipment.\n\nRecommendations\n\nFirst of all, I would suggest that the changing rooms should be repaired, as many students say they avoid sport because of them. Secondly, the school could lend rackets and balls so that more students can play tennis. Finally, it would be a good idea to offer activities such as dance or yoga, which might attract students who do not enjoy team sports.",
  ),
  part2(
    "The manager of the English club you go to wants to attract more members. She has asked you to write a report saying what the club offers now, why some students stop coming, and what changes would attract new members.",
    "report",
    "Introduction\n\nThis report describes what the English club offers at present, explains why some students stop attending and suggests changes that could attract new members.\n\nWhat the club offers\n\nThe club meets every Wednesday from four to six. Activities include conversation practice, grammar exercises and, once a month, a film in English. Members say they appreciate the friendly atmosphere and the chance to speak English outside lessons.\n\nWhy students leave\n\nMost former members I spoke to said that the meetings had become too similar to normal classes. Others said that Wednesday afternoon clashes with sports training, and some simply did not know anyone in the group.\n\nRecommendations\n\nFirstly, I would recommend replacing the grammar exercises with more practical activities, such as games, debates and cooking evenings. Secondly, the club could meet on a different day, or alternate between two days. Finally, each new member could be welcomed by an existing member who introduces them to the group. If these changes are made, I am confident that the club will grow.",
  ),
  part2(
    "Last month some students from your school spent two weeks at a partner school abroad. The head teacher wants to know whether to continue the exchange. Write a report describing the exchange, saying what students gained from it and recommending whether it should continue.",
    "report",
    "Introduction\n\nThe purpose of this report is to describe last month's exchange with our partner school in Dublin, to explain what students gained from it and to recommend whether it should continue.\n\nThe exchange\n\nTwenty students spent two weeks in Dublin, staying with local families and attending lessons at the partner school. The programme also included trips to museums and a weekend in the countryside.\n\nWhat students gained\n\nAlmost every student said that their spoken English had improved considerably, especially their listening, as they had to understand people speaking quickly and with a local accent. Many also said that living with a family taught them a great deal about daily life in Ireland, and several have stayed in touch with their hosts.\n\nProblems\n\nThe main problem was cost. Some students could not take part because their families could not afford the flights.\n\nRecommendation\n\nI strongly recommend that the exchange should continue. However, the school should consider raising money to help students from families with lower incomes, so that everyone has the same opportunity.",
  ),
  part2(
    "You have seen this announcement on an English-language website:\n\n**Reviews wanted: a film that made you think.** Tell us about a film that made you think. What is it about, why did it make you think, and would you recommend it to other people?",
    "review",
    "The Long Road Home: a quiet film that stays with you\n\nI chose The Long Road Home almost by chance one rainy evening, and I was still thinking about it a week later.\n\nThe film tells the story of Tom, a farmer in his seventies whose memory is slowly failing. When he forgets his granddaughter's name, she decides to take him on a journey to all the places that were important in his life, hoping to help him remember.\n\nWhat made me think was the way the film shows memory. We often believe that our memories are who we are, but Tom remains kind, funny and brave even when he has forgotten almost everything. By the end, I was asking myself what really makes a person who they are.\n\nThe acting is excellent, especially from the actor who plays Tom, and the photography of the countryside is beautiful. The only weakness is that the middle part is a little slow.\n\nI would recommend this film to anyone who likes thoughtful stories, but make sure you have some tissues ready!",
  ),
  part2(
    "You have seen this announcement in an English-language guide for young visitors to your town:\n\n**Where should we meet?** Write a review of a café or restaurant where young people can meet their friends. Tell us about the place, the food and drink and the prices, and say whether you would recommend it.",
    "review",
    "Café Lumière: the perfect place to meet\n\nIf you are a young visitor looking for somewhere to relax with friends, Café Lumière, in a quiet street just behind the main square, is the place I would recommend.\n\nThe café is in an old bookshop, and the owners have kept many of the shelves, so you can borrow a book while you drink your coffee. There are comfortable sofas, board games and free wifi, and nobody minds if you stay all afternoon.\n\nThe menu is simple but good. The hot chocolate is the best in town, and the homemade cakes are enormous. A drink and a cake cost less than six euros, which is very reasonable for the city centre.\n\nThe only problem is that the café is small, so it can be hard to find a table on Saturday afternoons. It is best to go in the morning or on a weekday.\n\nOverall, Café Lumière is friendly, cheap and full of character. Whether you want to chat, play games or read quietly, you will feel at home there.",
  ),
  part2(
    "You have seen this announcement in your school's English-language magazine:\n\n**Apps that help you learn.** Write a review of an app that has helped you learn something. Tell us what it does and what you like and dislike about it, and say whether you would recommend it to other students.",
    "review",
    "WordWise: learning made fun\n\nA few months ago, I was looking for a way to improve my English vocabulary before my exams, and a friend recommended an app called WordWise. I have used it almost every day since then.\n\nThe app teaches new words through short daily games that take about ten minutes. You choose a topic, such as travel or science, and the app shows each word in a sentence with a picture. Later, it tests you on the words you found difficult, so you keep practising them until you remember them.\n\nWhat I like most is that it never gets boring. You can compete with friends, and you get points for every day you practise. It also includes recordings, so you can hear how each word is pronounced.\n\nHowever, the free version shows quite a lot of adverts, and some of the more advanced topics are only available if you pay.\n\nOverall, I would definitely recommend WordWise to anyone who wants to build their vocabulary. Even ten minutes a day really makes a difference.",
  ),
];

/** essayTopic is Part 1 of B2 First Writing, judged by a model. */
export const essayTopic: TopicDef = judgedExamTopic({
  id: "fce-writing-an-essay",
  title: t("B2 First Writing Part 1: the Essay", "B2 First 写作第 1 部分：议论文"),
  summary: t(
    "Write an essay of 140 to 190 words for a teacher that answers a question, discusses both given notes and adds an idea of your own, as in Part 1 of B2 First Writing.",
    "按照 B2 First 写作第 1 部分的要求，为老师写一篇 140 至 190 词的议论文：回答问题，讨论所给的两点提示，并加上自己的一个观点。",
  ),
  prerequisites: ["writing-an-opinion-essay"],
  encompasses: [{ topic: "writing-an-opinion-essay", weight: 0.5 }],
  criteria: ["fce-essay-notes", "fce-essay-answer", "fce-organized"],
  point: {
    id: "essay",
    title: t("An essay with two notes and your own idea", "包含两点提示和自己观点的议论文"),
    explanation: t(
      "Part 1 is compulsory, and every essay has the same shape: a question, two notes and a third point that is yours. Plan five short paragraphs in about 40 minutes:\n\n1. **Introduction**: rephrase the question and give your view in a sentence.\n2. **The first note**, explained with a reason or an example.\n3. **The second note**, the same way; it may support the other side, which you then answer (*It is true that ... However, ...*).\n4. **Your own idea**: a point the notes do not mention, such as cost, safety or the effect on families.\n5. **Conclusion**: sum up and repeat your view in new words.\n\nWrite in a neutral style for a teacher, link the paragraphs (*Firstly*, *On the other hand*, *In addition*, *To sum up*) and stay within 140 to 190 words. An essay that leaves out a note, or forgets the third idea, cannot get full marks for content.",
      "第 1 部分是必答题，每篇议论文的结构都一样：一个问题、两点提示，以及属于你自己的第三点。用约 40 分钟安排五个短段：\n\n1. **引言**：换一种说法复述问题，用一句话表明看法。\n2. **第一点提示**：用理由或例子加以解释。\n3. **第二点提示**：同样处理；它可能支持另一方，你随后加以回应（*It is true that ... However, ...*）。\n4. **自己的观点**：写一个提示中没有提到的方面，例如费用、安全或对家庭的影响。\n5. **结论**：总结全文，用新的说法重申你的看法。\n\n用适合写给老师的中性文体，段落之间要有衔接（*Firstly*、*On the other hand*、*In addition*、*To sum up*），字数控制在 140 至 190 词。漏掉一点提示，或者忘了第三个观点，内容分就不可能拿满。",
    ),
  },
  question: t(
    "Write an essay of 140 to 190 words in English for the task below, as in Part 1 of B2 First Writing. You have about 40 minutes.",
    "按照 B2 First 写作第 1 部分的要求，用英语就下面的任务写一篇 140 至 190 词的议论文。时间约 40 分钟。",
  ),
  bank: essayBank,
  limits: { minWords: 140, maxChars: 1600 },
  xp: 30,
  what: t("essay", "议论文"),
});

/** part2Topic is Part 2 of B2 First Writing, judged by a model. */
export const part2Topic: TopicDef = judgedExamTopic({
  id: "fce-writing-part-2",
  title: t("B2 First Writing Part 2", "B2 First 写作第 2 部分"),
  summary: t(
    "Write an article, an email or letter, a report or a review of 140 to 190 words, in the form and register its reader expects, as in Part 2 of B2 First Writing.",
    "按照 B2 First 写作第 2 部分的要求，写一篇 140 至 190 词的文章、电子邮件或信件、报告或评论，形式和语体要符合读者的期待。",
  ),
  prerequisites: ["writing-an-article", "writing-a-review", "writing-a-report"],
  encompasses: [
    { topic: "writing-an-article", weight: 0.2 },
    { topic: "writing-a-review", weight: 0.2 },
    { topic: "writing-a-report", weight: 0.2 },
    { topic: "writing-a-formal-email", weight: 0.2 },
  ],
  criteria: ["fce-part2-content", "fce-part2-form", "fce-register", "fce-organized"],
  point: {
    id: "part-2",
    title: t("Four kinds of text for four readers", "写给四类读者的四种文本"),
    explanation: t(
      "In the test you choose one of three tasks, so know all four kinds of text. First find the reader and every point the task asks you to cover, then write in the form that reader expects:\n\n- **Article**: a title, an opening that catches the reader's interest, a lively and personal style, perhaps a question to the reader at the end.\n- **Email or letter**: a greeting and a closing that fit the reader; friendly and informal for a friend (*Hi Sam*, *Best wishes*), polite and formal for a manager or a director (*Dear Ms Carter*, *Yours sincerely*), with the reason for writing near the start.\n- **Report**: a neutral style, short headings, facts first and recommendations at the end (*I would recommend that ...*).\n- **Review**: say what is being reviewed, describe it briefly, give your opinion of its good and bad points, and end with a recommendation.\n\nAnswer every part of the task, and stay within 140 to 190 words.",
      "考试中要从三个任务里选一个，所以四种文本都要会写。先找出读者和任务要求涵盖的每一点，再写成读者期待的形式：\n\n- **文章**：有标题，开头吸引读者，文风生动、有个人色彩，结尾可以向读者提一个问题。\n- **电子邮件或信件**：称呼和结束语要适合读者；给朋友的写得友好随意（*Hi Sam*、*Best wishes*），给经理或负责人的写得礼貌正式（*Dear Ms Carter*、*Yours sincerely*），并在开头说明写信目的。\n- **报告**：文体中性，用简短的小标题，先写事实，最后提出建议（*I would recommend that ...*）。\n- **评论**：说明评论的对象，简要描述，评价其优缺点，最后给出是否推荐的建议。\n\n回答任务的每一部分，字数控制在 140 至 190 词。",
    ),
  },
  question: t(
    "Write a text of 140 to 190 words in English for the task below, as in Part 2 of B2 First Writing. You have about 40 minutes.",
    "按照 B2 First 写作第 2 部分的要求，用英语就下面的任务写一篇 140 至 190 词的文本。时间约 40 分钟。",
  ),
  bank: part2Bank,
  limits: { minWords: 140, maxChars: 1600 },
  xp: 30,
  what: t("answer", "范文"),
});
