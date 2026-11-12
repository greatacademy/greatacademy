// Grade 10: writing judged by a model, part two: an editorial, a letter of application and a satire.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after, covers } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";
import { limits } from "./writing-judged-a.ts";

/** editorialBank gives an issue on which the student writes an editorial for a school or town newspaper. */
const editorialBank: readonly WritingItem[] = [
  {
    task: "Write an editorial for your school newspaper arguing whether students should be allowed to use phones during lunch.",
    model:
      'Our school is debating a ban on phones during lunch. The proposal is well meant, but it is the wrong answer to a real problem. The school should keep lunch phone-free by choice, not by rule.\n\nThe problem is real. Walk into the cafeteria any day and you will see tables of students staring at screens instead of talking to each other. A survey by our student council found that 64 percent of students spend most of lunch on their phones. Lunch is one of the few times in the day when we can talk freely, and we are wasting it.\n\nBut a ban would create new problems. Some students use phones at lunch to contact parents who work late, to check bus changes or to finish urgent assignments. A rule would punish them along with everyone else, and it would turn teachers into phone police.\n\nThere is a better way. The council could create "talk tables" where phones stay in bags, and organize weekly lunch games and clubs. When students have something better to do, they put their phones away on their own.\n\nWe do not need a new rule. We need better reasons to look up. Let us give each other those reasons, starting this Monday.',
  },
  {
    task: "Write an editorial for your town newspaper arguing whether the town should turn its main street into a car-free zone on weekends.",
    model:
      "Every Saturday, Main Street fills with cars circling for parking, horns blaring and exhaust drifting into the cafés. The town council should close Main Street to cars on weekends and give it back to the people who walk there.\n\nFirst, a car-free street would help local businesses. Towns that have tried this, such as Pontevedra in Spain, found that shops gained customers when people could stroll, linger and browse instead of rushing back to their cars. Shoppers on foot visit more stores and stay longer.\n\nSecond, it would make the town safer and healthier. Last year, our police recorded eleven accidents involving pedestrians on Main Street. Without traffic, children could walk freely, older residents could cross without fear, and the air would be cleaner for everyone.\n\nSome shop owners worry that customers who drive will stay away. This concern deserves an answer. The council should offer free parking at the edge of town and a weekend shuttle bus, so that no one is shut out.\n\nOur main street was built long before the car. For two days a week, we can remember what it was for: meeting neighbors, sitting in the sun and enjoying the place we call home. The council should vote yes.",
  },
  {
    task: "Write an editorial for your school newspaper arguing whether the school should start classes later in the morning.",
    model:
      "At 7:45 every morning, our first-period classrooms are full of students who are physically present but mentally asleep. The school should move the start of the day to 8:45, because science, safety and common sense all support it.\n\nThe science is clear. Sleep researchers have found that teenagers' body clocks naturally shift later during adolescence, so that most cannot fall asleep before 11 p.m. With an early start, many of us get less than seven hours of sleep, far below the eight to ten hours that experts recommend.\n\nTired students learn less. A study of schools in Minnesota that moved their start times later found that attendance improved and grades rose, especially in first-period classes. Car accidents involving teenage drivers also fell.\n\nSome parents argue that a later start would make it harder for them to get to work. This is a fair concern, and the school should respond by opening the library at 7:30 for students who need to arrive early.\n\nAn extra hour is not a luxury. It is the difference between a student who yawns through algebra and one who understands it. If we want our school to make students more alert, healthier and safer, the answer is simple: let us sleep.",
  },
  {
    task: "Write an editorial for your town newspaper arguing whether the town should build a new sports stadium with public money.",
    model:
      "The mayor wants to spend 80 million dollars of public money on a new stadium for our football team. The council should reject this plan, because the costs are certain and the benefits are not.\n\nSupporters say the stadium will bring jobs and visitors. But economists who have studied stadiums across the country have found that they rarely produce the growth they promise. Money that fans spend at the stadium is mostly money they would have spent elsewhere in town, at restaurants, cinemas or shops.\n\nMeanwhile, our needs are urgent. The library has cut its opening hours twice in three years. Two of our elementary schools have roofs that leak in heavy rain. The bus service to the eastern neighborhoods runs only once an hour. Eighty million dollars could repair every one of these problems.\n\nThe team is a source of pride, and no one wants to lose it. If a new stadium makes economic sense, private investors and the team's owners should be willing to pay for most of it.\n\nA town is judged by how it cares for its people, not by the size of its stadium. Before we build a palace for football, let us fix the roofs over our children's heads.",
  },
  {
    task: "Write an editorial for your school newspaper arguing whether school uniforms should be required.",
    model:
      "Next month, the school board will vote on whether to require uniforms. Our school should say no, because the problems that uniforms are meant to solve can be solved in better ways.\n\nSupporters argue that uniforms reduce bullying over clothes and make families spend less. These are real concerns. No student should be mocked for wearing old shoes, and no family should feel pressure to buy expensive brands.\n\nBut uniforms do not remove differences between students; they only move them. Students still notice whose shoes are new, whose bag is designer and whose phone is the latest model. Meanwhile, uniforms take away one of the few ways young people can express who they are. For many of us, choosing what to wear is a small but important act of independence.\n\nCost is also less simple than it looks. A full set of uniforms, with spares, can cost families more than ordinary clothes, especially for those with several children.\n\nThere are better answers. The school could enforce a clear dress code, run a free clothing exchange and take bullying seriously wherever it happens. These measures address the real problems without asking every student to look the same.\n\nWe should solve the problem, not hide it. The board should vote against uniforms.",
  },
  {
    task: "Write an editorial for your town newspaper arguing whether the town should ban single-use plastic bags.",
    model:
      "Walk along the river after a windy day and you will see them: plastic bags caught in branches, floating in the water and tangled in the reeds. Our town should ban single-use plastic bags in all shops by next year.\n\nThe damage is well documented. Plastic bags are used for an average of about twelve minutes, but they can take hundreds of years to break down. In the sea, they break into small pieces that animals mistake for food. Our own river cleanup last spring collected more than four thousand bags in a single afternoon.\n\nBans work. When Ireland introduced a small charge on bags, their use fell by more than 90 percent within a year. Many towns and countries have since gone further and banned them completely, with little disruption.\n\nSome shop owners fear the cost of paper bags, and some shoppers worry about convenience. These concerns are fair. The town could give every household two free reusable bags and allow shops a six-month period to use up their stock.\n\nWe already carry keys, phones and wallets everywhere we go. Carrying a bag is not a great sacrifice. For a small change in our habits, we can keep our river clean for the next generation. The council should act now.",
  },
  {
    task: "Write an editorial for your school newspaper arguing whether the school should replace printed textbooks with tablets.",
    model:
      "The school has proposed replacing all printed textbooks with tablets next year. The idea sounds modern, but the school should keep printed books as the main tool for learning and use tablets only alongside them.\n\nIt is true that tablets have advantages. They are lighter than a backpack full of books, they can be updated instantly, and they offer videos and quizzes that printed pages cannot. For subjects such as science, these features can be valuable.\n\nHowever, research suggests that many students understand and remember long texts better when they read them on paper. On a screen, readers tend to skim, and the notifications and games on a tablet are always one tap away. Our own teachers report that students using laptops in class are often doing something other than the lesson.\n\nCost and fairness matter too. Tablets break, batteries die and software must be paid for every year. Students without good internet at home would fall behind when homework moves online.\n\nThe best solution is a balance. Keep printed textbooks for core reading, and give each classroom a set of tablets for research and interactive work.\n\nTechnology should serve learning, not replace it. Before we throw away our books, we should be sure that what replaces them is truly better.",
  },
  {
    task: "Write an editorial for your town newspaper arguing whether the town should create a skate park in the central park.",
    model:
      "For years, young skateboarders in our town have been chased from car parks, shopping centers and the steps of the library. The council should give them a place of their own by building a skate park in the corner of Central Park.\n\nSkateboarding is no longer a fringe hobby; it is an Olympic sport. Yet our town offers young people nowhere to practice it safely. As a result, skaters use streets and public squares, where they risk accidents and annoy residents.\n\nA skate park would solve both problems. It would give young people a safe and legal place to skate, and it would move skating away from places where it causes conflict. Towns that have built skate parks, such as nearby Riverton, report fewer complaints about skaters elsewhere and a drop in minor vandalism.\n\nSome neighbors worry about noise and crowds. These concerns can be met with careful design: the park could be placed far from homes, surrounded by trees and closed at nine in the evening.\n\nThe cost, about 300,000 dollars, is small compared with the town's budget, and local businesses have already offered to help.\n\nWe often complain that young people have nothing to do. Here is a chance to give them something. The council should build the park.",
  },
  {
    task: "Write an editorial for your school newspaper arguing whether students should have a say in choosing their teachers' evaluation.",
    model:
      "Teachers at our school are evaluated by the principal, who watches one or two lessons a year. Students, who sit in those classrooms every day, have no voice at all. The school should include anonymous student surveys as one part of every teacher's evaluation.\n\nStudents know things that a short visit cannot reveal. We know whether a teacher explains clearly, returns work on time and treats every student fairly. A principal who observes one carefully prepared lesson sees a performance; students see the whole year.\n\nResearch supports this. A large study in the United States found that student surveys, when well designed, predicted which teachers helped students learn the most. The surveys asked specific questions, such as whether the teacher checked that students understood before moving on.\n\nSome teachers fear that students will use surveys to punish strict teachers. This is a reasonable worry. To prevent it, the surveys should count for only part of the evaluation, ask about specific behaviors rather than popularity, and be reviewed together with other evidence.\n\nGood teachers have nothing to fear from honest feedback; most will welcome it. By listening to students, the school would show that it values our experience and would help every teacher improve. The school board should adopt student surveys next year.",
  },
  {
    task: "Write an editorial for your town newspaper arguing whether the town library should stay open until midnight during exam season.",
    model:
      "In May and June, hundreds of students in our town prepare for the most important exams of their lives. Many of them have nowhere quiet to study. The town library should stay open until midnight during exam season.\n\nFor many families, home is not a good place to study. Apartments are small, younger siblings are noisy and internet connections are slow or expensive. When the library closes at seven, these students lose the one calm, free and well-lit space they have. Students from wealthier families can pay for tutors or study rooms; others cannot.\n\nLonger hours would be a fair and practical response. The library already has desks, computers and books. Keeping it open for five extra hours a night for eight weeks would cost the town about 40,000 dollars, mainly for staff and security.\n\nCritics say that students should study during normal hours. But many teenagers work part-time jobs after school or care for family members, which leaves only the late evening for revision.\n\nA library is more than a building full of books; it is a promise that everyone has the chance to learn. During the weeks that decide so many young people's futures, the town should keep that promise until midnight.",
  },
  {
    task: "Write an editorial for your school newspaper arguing whether the school should stop selling sugary drinks.",
    model:
      "The vending machines outside our gym sell cola, energy drinks and sweetened iced tea. The school should replace them with water, milk and unsweetened drinks, because a school's job is to support students' health, not damage it.\n\nThe evidence about sugary drinks is strong. A single can of cola contains about nine teaspoons of sugar, more than the daily limit that the World Health Organization recommends for teenagers. Regular consumption is linked to tooth decay, weight gain and type 2 diabetes. Energy drinks add high levels of caffeine, which can disturb sleep and concentration.\n\nThe school already teaches healthy eating in biology and physical education. Selling sugary drinks a few meters from the classroom sends the opposite message.\n\nSome students argue that they should be free to choose what they drink. This is true, and nothing would stop them from bringing their own drinks from home. But the school does not have to sell products that harm us. Others point out that the machines raise money for sports teams. The school could replace that income by selling healthier drinks and snacks, as many schools now do successfully.\n\nSmall choices, repeated every day, shape our health for years. The school should make the healthy choice the easy one.",
  },
  {
    task: "Write an editorial for your town newspaper arguing whether the town should plant trees on every residential street.",
    model:
      "Many of our residential streets are bare strips of concrete and asphalt that bake in the summer sun. The town should launch a program to plant trees on every residential street within ten years.\n\nTrees do far more than make streets beautiful. On a hot day, a shaded street can be several degrees cooler than an unshaded one, which reduces the need for air conditioning and protects older residents during heat waves. Trees also absorb rainwater, which helps prevent the flooding that damaged dozens of homes on the east side last autumn.\n\nThe benefits reach our health and our wallets. Studies have found that people living on tree-lined streets report less stress, and that homes on such streets sell for higher prices.\n\nSome residents worry about falling leaves, blocked drains or roots damaging pavements. These problems are real but manageable. The town should choose species suited to narrow streets, plant them in proper pits and include leaf collection in its autumn cleaning.\n\nThe cost, about 500 dollars per tree, could be shared through a program in which the town pays for planting and neighbors agree to water the young trees.\n\nA tree planted today will shade our grandchildren. The council should begin planting this spring.",
  },
];

/** applicationBank gives a position for which the student writes a letter of application. */
const applicationBank: readonly WritingItem[] = [
  {
    task: "Write a letter of application for a summer job as an assistant at a children's science camp, advertised on the camp's website.",
    model:
      "Dear Ms. Romero,\n\nI am writing to apply for the position of summer assistant at the Bright Sparks Science Camp, which I saw advertised on your website. I am sixteen years old and have a strong interest in science and in working with children.\n\nFor the past year, I have volunteered every Saturday at our town library's homework club, where I help children aged eight to eleven with math and science. Last spring, I designed a simple experiment on plant growth for the group, and the children recorded their results for six weeks. Several parents told the librarian that their children talked about it at home every evening.\n\nI also have experience of keeping children safe and organized. I hold a first-aid certificate, and last summer I helped my aunt run a day camp for fifteen children, planning games and leading craft activities.\n\nAt school, I am a member of the science club and placed third in the regional science fair with a project on water filters. I would love to share that enthusiasm with your campers.\n\nI am available from June 20 until the end of August. Thank you for considering my application, and I would welcome the chance to discuss it in an interview.\n\nYours sincerely,\nDaniel Okafor",
  },
  {
    task: "Write a letter of application for a part-time job at a local bookshop, which you saw advertised in the shop window.",
    model:
      "Dear Mr. Patel,\n\nI am writing to apply for the part-time position at Chapter and Verse that I saw advertised in your shop window last week. As a regular customer and a keen reader, I would be delighted to join your team.\n\nI have read widely since I was a child, and I can recommend books to readers of many ages and tastes. This year I started a book club at my school, which now has fourteen members. Each month I choose a book, prepare questions and lead the discussion, so I am used to talking about books with enthusiasm and listening to other readers' opinions.\n\nI also have experience in customer service. For eight months I have worked on Saturday mornings at my uncle's café, where I take orders, handle cash and help keep the shop clean and tidy. My uncle has trusted me to close the till at the end of my shift since my second month.\n\nI am organized and careful, and I would be happy to help with shelving, stock checks and window displays.\n\nI am available on Saturdays and on two weekday afternoons after school. Thank you for your time. I hope to have the opportunity to meet you and discuss the position.\n\nYours sincerely,\nLeila Haddad",
  },
  {
    task: "Write a letter of application to volunteer as a guide at the city's history museum during the summer holidays.",
    model:
      "Dear Volunteer Coordinator,\n\nI am writing to apply for a place in the summer volunteer guide program at the City History Museum, which my history teacher, Mr. Lang, told me about. History is my favorite subject, and your museum has been one of my favorite places since I first visited it at the age of seven.\n\nI believe I would make a good guide because I enjoy explaining the past to others. Last term I gave a presentation to my class on the city's great fire of 1866, using old maps and photographs from your online archive. My teacher asked me to present it again to two younger classes.\n\nI am also comfortable speaking to visitors of different ages and backgrounds. I speak English and Polish fluently and have basic Spanish, which may help with foreign tourists. For the past two summers, I have helped at our church's information desk during the town festival, answering questions and giving directions to hundreds of visitors.\n\nI am reliable and punctual, and I am happy to learn the museum's tours in detail before guiding any groups.\n\nI am available for three days a week from July 1 to August 31. Thank you for considering my application. I look forward to hearing from you.\n\nYours faithfully,\nMarta Kowalski",
  },
  {
    task: "Write a letter of application for a summer internship at a local newspaper, advertised in the newspaper itself.",
    model:
      "Dear Ms. Bennett,\n\nI am writing to apply for the summer internship advertised in the Valley Herald on April 14. I am a Year 11 student with a strong interest in journalism, and I would be grateful for the chance to learn from your team.\n\nFor two years I have written for our school newspaper, The Lantern, and this year I became its news editor. I manage a team of six writers, assign stories and edit every article before publication. Under my editing, we have not missed a single monthly deadline.\n\nOne of my articles, on the closing of the public pool, was reprinted in your own youth section last autumn. To write it, I interviewed the mayor's office, two lifeguards and several families, and I learned how important it is to check facts and to give every side a fair hearing.\n\nI am confident with basic photography and with simple editing software, and I am happy to help with any task, from research to proofreading.\n\nI am available for the whole of July and August and can work full-time. Thank you very much for considering my application. I have attached three samples of my writing, and I would welcome the opportunity to discuss the internship with you.\n\nYours sincerely,\nSamuel Adeyemi",
  },
  {
    task: "Write a letter of application for a weekend job as a junior lifeguard at the town swimming pool.",
    model:
      "Dear Mr. Lindqvist,\n\nI would like to apply for the position of weekend junior lifeguard at the Eastside Swimming Pool, which I saw on the noticeboard in the entrance hall. I have been a member of the pool's swimming club for six years, and I would be proud to help keep it safe.\n\nI am a strong and confident swimmer. I train with the club four times a week and won the regional under-sixteen 400-meter freestyle race last year. More importantly, I completed the National Pool Lifeguard course in March, including rescue techniques and first aid, and I passed every part of the assessment on my first attempt.\n\nI also have experience with young swimmers. For the past year, I have helped the club's coaches teach beginners' classes on Saturday mornings, working with children aged five to eight. I have learned to watch a group carefully, to stay calm and to give instructions clearly.\n\nI understand that a lifeguard's job requires constant attention and responsibility, and I take this seriously.\n\nI am available every Saturday and Sunday, and during school holidays I could work additional shifts. Thank you for considering my application. I would be happy to attend an interview or a practical test at any time.\n\nYours sincerely,\nEmma Nilsson",
  },
  {
    task: "Write a letter of application for a place on a youth exchange program to spend a month studying with a family abroad.",
    model:
      "Dear Selection Committee,\n\nI am writing to apply for a place on the Global Youth Exchange program, which I learned about at my school's careers evening in February. I would especially like to spend my month in Japan, a country whose language and culture I have studied for two years.\n\nI have been learning Japanese at an evening class since I was fourteen, and in March I passed the beginner level of the Japanese Language Proficiency Test. I practice every week with a conversation partner from Osaka through an online program, and I can now hold simple conversations about daily life.\n\nI am curious, adaptable and comfortable in new situations. When my family moved from Brazil to Canada three years ago, I had to learn a new language and make new friends in a new school. Within a year, I had joined the debate team and been elected class representative.\n\nI hope to share my own culture with my host family as well. I could cook traditional Brazilian dishes for them and teach them a little Portuguese.\n\nI believe this exchange would help me become a more open and independent person. Thank you for considering my application. I would be glad to attend an interview at your convenience.\n\nYours faithfully,\nLucas Ferreira",
  },
  {
    task: "Write a letter of application for a job as an assistant at an animal shelter during the summer.",
    model:
      "Dear Ms. Harper,\n\nI am writing to apply for the summer assistant position at Second Chance Animal Shelter, which was advertised in our local newspaper last Thursday. Animals have always been an important part of my life, and working at your shelter would be a wonderful opportunity.\n\nFor the past eighteen months, I have volunteered at the shelter's weekend dog-walking program. I walk four or five dogs every Saturday, and I have learned how to handle nervous and energetic animals calmly and safely. Last month, one of the staff asked me to help introduce a frightened new arrival to the other dogs.\n\nI also have experience with the less glamorous side of animal care. At home, I look after our two cats, three rabbits and a very old tortoise, which means feeding, cleaning cages and noticing when an animal seems unwell.\n\nI am hard-working and not afraid of physical tasks. I understand that a shelter job includes cleaning kennels, washing bowls and carrying heavy bags of food, and I am happy to do all of these.\n\nI would be available from June 25 until September 1, and I can work weekends. Thank you for considering my application. I hope to hear from you and would gladly visit for an interview.\n\nYours sincerely,\nPriya Sharma",
  },
  {
    task: "Write a letter of application for a role as a peer tutor in your school's mathematics support program.",
    model:
      "Dear Mrs. Okonkwo,\n\nI am writing to apply for a role as a peer tutor in the school's mathematics support program, which you announced in assembly on Monday. I enjoy mathematics and would like to help other students feel more confident with it.\n\nMathematics has been my strongest subject throughout secondary school. This year I scored in the top 5 percent of the regional mathematics competition, and I am currently studying for the advanced exam a year early.\n\nMore importantly for this role, I have experience explaining mathematics to others. Since September, I have tutored two Year 8 students in algebra every Tuesday afternoon. When we started, one of them was failing; by the end of the term, both had raised their test scores by at least one grade. I learned that the most useful thing a tutor can do is to find out exactly where a student is confused, rather than simply repeating the teacher's explanation.\n\nI am patient and friendly, and I remember how frustrating mathematics felt for me before I understood fractions properly.\n\nI am available on Tuesdays, Thursdays and Friday lunchtimes. Thank you for considering my application. I would be happy to discuss how I could help the program.\n\nYours sincerely,\nThomas Mensah",
  },
  {
    task: "Write a letter of application for a job helping at a community garden during the spring and summer.",
    model:
      "Dear Mr. Alvarez,\n\nI am writing to apply for the position of garden assistant at the Riverside Community Garden, which I saw on the garden's noticeboard. I live three streets away and walk past the garden every day, and I would love to help it grow.\n\nI have gardened with my grandmother since I was a small child, and for the past three years I have grown my own vegetables on a small plot behind our apartment building. Last summer I grew enough tomatoes, beans and courgettes to share with six neighbors. I know how to prepare soil, plant seedlings, water carefully and recognize common pests.\n\nI also enjoy working with people. At school, I helped set up a gardening club for younger students, which now meets every Wednesday and has planted a herb garden beside the cafeteria. I am used to explaining simple gardening tasks and encouraging people who have never grown anything before.\n\nI am physically fit and happy to do heavy work such as digging, moving compost and carrying watering cans.\n\nI am available every Saturday and on Wednesday afternoons from April until September. Thank you for your time and consideration. I hope to have the chance to meet you and to see the garden's plans for this year.\n\nYours sincerely,\nAisha Rahman",
  },
  {
    task: "Write a letter of application for a seat on your town's youth council, which advises the mayor on young people's needs.",
    model:
      "Dear Members of the Selection Panel,\n\nI am writing to apply for a seat on the Greenfield Youth Council, as advertised on the town's website. I care deeply about our town, and I want to help make sure that young people's voices are heard in its decisions.\n\nI have already worked to improve our community. Last year, after two students were nearly hit by cars on Hill Road, I organized a petition for a safe pedestrian crossing near our school. I collected 900 signatures, presented them at a council meeting and answered questions from councillors. The crossing was built in the autumn.\n\nThis experience taught me how local government works and how important it is to prepare carefully, listen to different views and stay polite even when people disagree.\n\nI am also used to representing others. I have been class representative for two years, which means I gather my classmates' concerns and bring them to the school's student council.\n\nIf selected, I would focus on two issues that many young people raise with me: the lack of safe places to meet in the evening and the poor bus service to the east of town.\n\nThank you for considering my application. I would be honored to serve on the council.\n\nYours faithfully,\nNoah Bergström",
  },
  {
    task: "Write a letter of application for a summer job as a kitchen helper at a local restaurant.",
    model:
      "Dear Ms. Moreau,\n\nI am writing to apply for the summer position of kitchen helper at Le Petit Jardin, which I saw advertised on your restaurant's social media page. I am seventeen, I love cooking, and I would welcome the chance to learn in a professional kitchen.\n\nI have some kitchen experience already. Last December, I worked for three weeks at my aunt's restaurant during the busy holiday season. I washed dishes, prepared vegetables and helped the cooks keep their stations clean and organized. I learned how fast a kitchen moves at dinner time, and how important it is to follow instructions exactly.\n\nAt home, I cook dinner for my family twice a week, and I recently completed an online food hygiene course, for which I received a certificate.\n\nI am hard-working and reliable. My aunt told me that I was the only helper who never arrived late during those three weeks, even when the buses were delayed by snow.\n\nI understand that kitchen work can be hot, tiring and repetitive, and I am ready for that. I would be happy to start with any task you need.\n\nI am available from July 1 until the end of August, including evenings and weekends. Thank you for your consideration. I look forward to your reply.\n\nYours sincerely,\nJulien Dubois",
  },
  {
    task: "Write a letter of application for a position as an assistant coach for a children's football team.",
    model:
      "Dear Mr. Carter,\n\nI am writing to apply for the position of assistant coach for the Under-10 team at Westside Football Club, which I saw on the club's website. I have played football since I was six, and I would love to help younger players enjoy the game as much as I do.\n\nI have played for my school team for five years and was captain last season. As captain, I learned that encouraging teammates after a mistake is often more useful than shouting instructions. I also helped our coach run warm-up sessions before every match.\n\nI have some direct coaching experience as well. Last spring, when the coach of my younger brother's team fell ill, I ran their training sessions for a month. I planned simple drills for passing and dribbling, and I made sure that every child, not only the strongest, got time with the ball.\n\nI hold a basic first-aid certificate, and I understand the importance of keeping children safe and supervised at all times.\n\nI am patient and enthusiastic, and I believe that football should teach children teamwork and confidence as well as skill.\n\nI am available for training on Tuesday and Thursday evenings and for matches on Saturdays. Thank you for considering my application.\n\nYours sincerely,\nOmar Haddad",
  },
];

/** satireBank gives a target for a short satire that exaggerates a folly to make a serious point. */
const satireBank: readonly WritingItem[] = [
  {
    task: "Write a short satire in the form of an advertisement for a new phone that mocks how much time people spend looking at screens.",
    model:
      "Introducing the iStare 12: the only phone you will ever need, because you will never look at anything else.\n\nWhy waste your eyes on sunsets, which happen only once a day, when the iStare 12 can show you four thousand photographs of sunsets every hour? Why talk to your family at dinner, when our new Silent Supper mode lets everyone at the table message each other without the awkward business of speaking?\n\nThe iStare 12 has our brightest screen yet, so bright that you can read it in the dark, in the rain and, according to our tests, through your eyelids while you sleep. Its battery lasts thirty hours, which is almost long enough for one ordinary day of use.\n\nNew features include Walk Assist, which beeps gently a second before you hit a lamppost, and Friend Finder, which tells you which of your friends are in the same room as you, in case you have not looked up for a while.\n\nDoctors recommend two hours of screen time a day. The iStare 12 recommends doctors find a hobby.\n\nThe iStare 12. Because life is happening somewhere else.",
  },
  {
    task: "Write a short satire in the form of a school announcement that mocks the amount of homework students are given.",
    model:
      "Good morning, students. This is your principal with an exciting announcement.\n\nAfter studying last year's results, the school board has discovered that students who do more homework learn more. Therefore, beginning Monday, every subject will assign four hours of homework per night. Since you study eight subjects, this comes to thirty-two hours of homework each evening. Our mathematics department has confirmed that this is more than the number of hours in a day, and they have set it as tonight's homework to explain how this is possible.\n\nTo help, we are cancelling sleep. Research suggests that sleep is important for learning, but we have found that sleeping students complete almost no worksheets at all.\n\nWe are also replacing lunch with a short reading quiz, and the school bus will now be a moving study hall. Students who look out of the window will be given extra homework on the subject of windows.\n\nParents have asked when their children will have time for family, sport or rest. We are happy to report that these activities will be added to the homework schedule from 3 a.m. to 3:05 a.m.\n\nThank you, and have a productive day.",
  },
  {
    task: "Write a short satire in the form of a news report that mocks people who post every moment of their lives online.",
    model:
      'LOCAL TEENAGER EXPERIENCES CONCERT ENTIRELY THROUGH PHONE SCREEN\n\nA sixteen-year-old fan returned home on Saturday night delighted after attending her favorite band\'s concert, which she watched for two hours on the screen of her phone while standing twenty meters from the stage.\n\n"It was the best night of my life," said Mia Torres, scrolling through her 412 videos of the event. "I can\'t wait to see what it was like."\n\nWitnesses say that Torres raised her phone at the first note and lowered it only to check how many people had liked her first video. At one point, the lead singer walked down into the crowd and stood directly in front of her, but Torres reportedly asked him to move because he was blocking her shot of the stage.\n\nScientists at the National Institute of Memory confirmed that Torres now has a perfect record of the concert and no memory of it whatsoever. "This is the future," said one researcher. "Soon we will not need to experience anything at all. We will simply post it."\n\nTorres is already planning her next outing: a sunset, which she intends to photograph from inside a car park.',
  },
  {
    task: "Write a short satire in the form of a speech by a company boss that mocks endless meetings at work.",
    model:
      "Team, thank you for coming to this meeting, which is about our meetings.\n\nAs you know, our company has been very productive this year. We held 1,200 meetings in January alone, which is a record. Unfortunately, our productivity has fallen, because some of you have been wasting time doing actual work between meetings.\n\nThis cannot continue. From Monday, there will be no time between meetings. Each meeting will end at the exact moment that the next one begins, in the same room, with the same people, about the same subject. To save time, we will no longer say goodbye.\n\nWe are also creating a new Meeting Planning Committee, which will meet daily to plan the meetings at which we discuss the results of previous meetings. Its first task will be to schedule a meeting to choose its chairperson.\n\nSome of you have asked when the products will be made. I understand your concern, and I have scheduled a series of meetings to discuss it, beginning in March and ending, we hope, by the year after next.\n\nThank you all. Please stay seated, because this meeting has now become the next one.",
  },
  {
    task: "Write a short satire in the form of a product review that mocks the fashion for very expensive bottled water.",
    model:
      'I have tried many waters in my life, but none compares to Glacier Whisper Artisan Water, which costs only 45 dollars a bottle.\n\nThe water is collected by hand from the morning tears of a single Norwegian glacier, then flown by private jet to a monastery in Switzerland, where monks gently bless it for six hours. Each bottle comes with a certificate signed by the glacier.\n\nWhen I opened my first bottle, I was overwhelmed. The water was clear, wet and almost exactly like water. The label promised "notes of mountain air and quiet ambition," and while I could not taste either of these, I definitely felt more ambitious after paying for it.\n\nMy neighbor, a simple man, claims that the water from his kitchen tap is just as good. I invited him to a blind tasting. He chose the tap water every time, which only proves how little he understands about luxury.\n\nGlacier Whisper is not for everyone. It is for people who believe that the more something costs, the better it must be. I am proud to be one of them.\n\nFive stars. I would give six, but I need to save up for the next bottle.',
  },
  {
    task: "Write a short satire in the form of a guidebook entry that mocks tourists who visit famous places only to photograph themselves.",
    model:
      "WELCOME TO THE GRAND CANYON: A GUIDE FOR THE MODERN TRAVELER\n\nThe Grand Canyon is one of the most beautiful places on Earth, carved over six million years by the Colorado River. Fortunately, you will not have to look at it for long.\n\nOn arrival, proceed directly to the Official Selfie Platform, where the canyon has been conveniently placed behind you. Please turn your back to the view, extend your arm and smile. If the canyon appears too large in your photograph, our staff can help you stand closer to the camera so that more of you is visible.\n\nVisitors who wish to see the canyon itself are reminded that the view is available in high resolution in the gift shop, on postcards, mugs and T-shirts, all of which can also be photographed.\n\nFor those with more time, we recommend the Sunrise Experience. Wake at 4 a.m., climb to the rim and wait two hours for the sun to appear, then spend twenty minutes choosing a filter that makes it look more like a sunrise.\n\nFinally, please do not fall into the canyon while walking backward for a better angle. It has happened before, and the photographs were very disappointing.",
  },
  {
    task: "Write a short satire in the form of a letter from a town council that mocks the slowness of official paperwork.",
    model:
      "Dear Resident,\n\nThank you for your request of March 2019 to repair the hole in the road outside your house. We are pleased to inform you that your request has now reached the second stage of our process.\n\nBefore we can continue, we will need you to complete Form 27B, confirming that the hole exists. Please attach three photographs of the hole, a letter from a neighbor who has also seen the hole and a signed statement from the hole itself, if possible.\n\nWe note from your recent letter that the hole has grown and that a delivery van fell into it last week. Unfortunately, a larger hole is legally a different hole, so you will need to submit a new request. Our records show that the original hole no longer exists, and your first request has therefore been closed as resolved.\n\nPlease be assured that our department works tirelessly. Last year we processed more than four thousand forms, and several of them led to decisions.\n\nWe expect to send an inspector to your street within the next eighteen to thirty-six months. If you are not at home, he will leave a form.\n\nYours faithfully,\nDepartment of Roads, Holes and Related Matters",
  },
  {
    task: "Write a short satire in the form of a speech by a school sports coach that mocks the idea that winning is the only thing that matters.",
    model:
      "Listen up, team. Tomorrow we play the Under-9 Junior Friendship Cup, and I want you to remember one thing: friendship is for losers.\n\nSome people say that sport is about having fun, learning teamwork and making new friends. Those people have never won a plastic trophy that cost almost eleven dollars. I have, and I want another.\n\nSo here is the plan. Jamie, you are the fastest player, so you will play every position at once. Everyone else, your job is to stand near the edge of the pitch and stay out of Jamie's way. Sam, I know you scored a goal last week, but it was against our own team, and I am still thinking about it.\n\nWhen the match ends, if we win, you may celebrate for exactly two minutes before we start training for next week. If we lose, there will be no snacks, no smiles and no shaking hands with the other team. Those children are not your friends. They are obstacles with juice boxes.\n\nOne more thing: parents have asked me to remind you that this is supposed to be enjoyable. I have noted their concern, and I will deal with it after we win.\n\nNow, everybody, try to have fun. That is an order.",
  },
  {
    task: "Write a short satire in the form of an advertisement for a fashion brand that mocks clothes that are thrown away after a few weeks.",
    model:
      "TRENDLY: FASHION THAT LASTS FOREVER, OR AT LEAST UNTIL THURSDAY\n\nAre you tired of clothes that last for years? Do you open your wardrobe and feel ashamed of a sweater you bought as long ago as last month? Then Trendly is for you.\n\nAt Trendly, we release four hundred new styles every week, because fashion moves fast and so should you. Our clothes are carefully designed to fall apart after five washes, so that you never have to suffer the embarrassment of wearing something out of date.\n\nOur new Spring Collection arrives on Monday and will be out of fashion by Friday. Our Summer Collection was released yesterday, in February, so that you can be ahead of the trend before the trend exists.\n\nBest of all, our prices are so low that you can buy a T-shirt for less than a sandwich. Please do not ask how we do this. You do not want to know, and neither do we.\n\nWhen you are finished with your Trendly clothes, simply throw them away. Somewhere, a landfill the size of a small country is waiting for them with open arms.\n\nTrendly. Wear it once. Forget it forever.",
  },
  {
    task: "Write a short satire in the form of a scientist's report that mocks wellness fads that promise miracle results.",
    model:
      "REPORT ON THE MIRACLE MOON CRYSTAL, BY DR. EVELYN SHARP\n\nI was asked by a popular wellness company to test its Miracle Moon Crystal, which sells for 199 dollars and claims to cure headaches, improve memory, remove stress and make the user more attractive to the right people.\n\nMethod: I gave the crystal to fifty volunteers, who held it for ten minutes every morning for a month. I gave a second group of fifty volunteers an ordinary stone from my garden, which I told them was also a Miracle Moon Crystal.\n\nResults: Both groups reported feeling calmer, happier and more attractive. Several members of the garden-stone group said that their headaches had disappeared, and one claimed that his stone had helped him pass his driving test.\n\nConclusion: The Miracle Moon Crystal is exactly as powerful as a stone from my garden. This is a remarkable discovery, because my garden contains about four thousand stones, which means I am sitting on a fortune of nearly 800,000 dollars.\n\nI have therefore decided to leave science and open a crystal shop. My first product, the Genuine Garden Stone of Wisdom, will be available next week at a special price.",
  },
  {
    task: "Write a short satire in the form of instructions from a car company that mocks how much cities are designed around cars.",
    model:
      "CONGRATULATIONS ON YOUR NEW CITY! A USER'S GUIDE FROM MOTORCO\n\nThank you for choosing Motorco City, the world's first city designed entirely for cars. We hope you and your vehicle enjoy many happy years together.\n\nGetting around: Motorco City has 900 kilometers of roads and 12 meters of pavement. Pedestrians are welcome to use the pavement, which can be found behind the gas station on Exit 14. Walking elsewhere is not forbidden, but it is strongly discouraged by the twelve-lane highways.\n\nShopping: All shops are located in the Megamall, conveniently placed forty minutes from every home. The Megamall has 30,000 parking spaces and one bench.\n\nParks: Motorco City has a beautiful park, which is currently being converted into a car park, because our surveys showed that more cars than people were using it.\n\nChildren: Children may play in the street on the first Sunday of each leap year, between 6 and 6:15 a.m., when traffic is lightest.\n\nHealth: If you would like exercise, Motorco City offers several excellent gyms, each with a large car park, so that you can drive to the treadmill.\n\nWe hope you enjoy your city. Please remember to stay in your car at all times.",
  },
  {
    task: "Write a short satire in the form of a diary entry by a student that mocks the pressure of exams.",
    model:
      'Monday, 6 a.m.\n\nThree weeks until my final exams. I have made a revision timetable. It took me four days and used eleven colors, so I am already exhausted, but it is very beautiful.\n\nMy parents say that these exams will decide my whole future. My teachers say that they will decide which university I go to, which will decide my job, which will decide my house, my car, my happiness and, according to my uncle, whether I will ever be loved. No pressure, they said.\n\nTo prepare, I have given up sport, music, friends, sunlight and most vegetables. I now sleep with my chemistry textbook under my pillow, in the hope that the periodic table will enter my brain at night.\n\nLast week, the school sent a letter advising students to "stay calm and look after their mental health." The same letter reminded us that one bad result could "close many doors." I read it twice and then lay on the floor for an hour, which I believe counts as looking after my mental health.\n\nTomorrow I will finally begin revising. First, however, I need to make a new timetable, because this one does not include enough time for panicking.',
  },
];

/** judgedTopics10b are the second writing topics of grade 10 judged by a model. */
export const judgedTopics10b: readonly TopicDef[] = [
  {
    id: "writing-an-editorial",
    title: t("Writing an Editorial", "写社论"),
    summary: t(
      "Write an editorial for a school or town newspaper that takes a clear position on a local issue, supports it with evidence, answers the other side and ends with a call to act.",
      "为学校或城镇报纸写一篇社论，就一个本地问题表明清楚的立场，用证据支持它，回应对方观点，并以行动号召结尾。",
    ),
    prerequisites: after("writing-an-argument-with-sources", "identifying-bias-in-the-news"),
    encompasses: covers(0.2, "writing-an-argument-with-sources"),
    xp: 24,
    strand: "writing",
    criteria: ["g10-editorial-position", "g10-editorial-evidence", "g10-editorial-other-side"].map(criterion),
    knowledgePoints: [
      point(
        "a-position-on-a-local-issue",
        t("A Position on a Local Issue", "对本地问题表明立场"),
        t(
          "An editorial speaks for the paper. State the **position** early and plainly: *The council should close Main Street to cars on weekends.* Support it with **facts your readers can check**, such as figures, surveys and the example of another place, not only feelings.",
          "社论代表报纸发声。要尽早、明白地陈述**立场**：*The council should close Main Street to cars on weekends.* 用**读者能核实的事实**支持它，例如数字、调查和其他地方的例子，而不只是感受。",
        ),
        writingGenerator(
          t(
            "Write the editorial in English, stating your position early and supporting it with facts readers can check.",
            "用英语写这篇社论，尽早陈述立场，并用读者能核实的事实支持它。",
          ),
          editorialBank,
          ["g10-editorial-position", "g10-editorial-evidence", "g10-editorial-other-side"],
          limits,
          onePiece,
        ),
      ),
      point(
        "answering-the-other-side",
        t("Answering the Other Side", "回应对方观点"),
        t(
          "A fair editorial **names the strongest objection** and answers it: *Some shop owners worry that customers who drive will stay away. This concern deserves an answer...* Then it ends with what readers or leaders **should do**.",
          "公正的社论会**指出最有力的反对意见**并加以回应：*Some shop owners worry that customers who drive will stay away. This concern deserves an answer...* 然后以读者或决策者**应当做什么**结尾。",
        ),
        writingGenerator(
          t(
            "Write the editorial in English, answering the strongest objection fairly and ending with what readers or leaders should do.",
            "用英语写这篇社论，公正地回应最有力的反对意见，并以读者或决策者应当做什么结尾。",
          ),
          editorialBank,
          ["g10-editorial-other-side", "g10-editorial-position", "g10-editorial-evidence"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-letter-of-application",
    title: t("Writing a Letter of Application", "写申请信"),
    summary: t(
      "Write a formal letter applying for a job, a volunteer place or a program, showing with specific evidence why you are suited to it.",
      "写一封正式信件，申请一份工作、一个志愿岗位或一个项目，用具体证据说明你为何适合。",
    ),
    prerequisites: after("showing-qualifications-with-evidence", "writing-a-letter-to-a-leader"),
    encompasses: covers(0.2, "showing-qualifications-with-evidence"),
    xp: 24,
    strand: "writing",
    criteria: ["g10-application-purpose", "g10-application-evidence", "g10-application-format"].map(criterion),
    knowledgePoints: [
      point(
        "the-purpose-and-the-evidence",
        t("The Purpose and the Evidence", "目的和证据"),
        t(
          "Say in the first sentence **what you are applying for** and where you saw it. Then show that you are suited with **specific evidence**: what you did, how long, and what came of it. *For eight months I have worked on Saturday mornings at my uncle's café* says more than *I am hard-working.*",
          "第一句就说明**你申请的是什么**，以及在哪里看到。然后用**具体证据**说明你适合：你做过什么、做了多久、有什么结果。*For eight months I have worked on Saturday mornings at my uncle's café* 比 *I am hard-working* 更有说服力。",
        ),
        writingGenerator(
          t(
            "Write the letter in English, stating what you are applying for at once and backing each quality with specific evidence.",
            "用英语写这封信，开头就说明申请什么，并用具体证据支持每一项品质。",
          ),
          applicationBank,
          ["g10-application-purpose", "g10-application-evidence", "g10-application-format"],
          limits,
          onePiece,
        ),
      ),
      point(
        "a-formal-letter-that-closes-well",
        t("A Formal Letter That Closes Well", "结尾得体的正式信件"),
        t(
          "Keep the conventions of a **formal letter**: a greeting such as *Dear Ms. Romero,*, one paragraph for each kind of evidence, a polite and confident tone, and a closing that gives your **availability**, thanks the reader and asks for an interview, before *Yours sincerely* and your name.",
          "遵守**正式信件**的格式：用 *Dear Ms. Romero,* 这样的称呼，每类证据一段，语气礼貌而自信，结尾说明你**何时有空**、感谢读者并请求面试，然后写 *Yours sincerely* 和你的名字。",
        ),
        writingGenerator(
          t(
            "Write the letter in English with the conventions of a formal letter, ending with your availability, thanks and a request for an interview.",
            "按正式信件的格式用英语写这封信，结尾说明你何时有空、表示感谢并请求面试。",
          ),
          applicationBank,
          ["g10-application-format", "g10-application-purpose", "g10-application-evidence"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-satire",
    title: t("Writing a Satire", "写讽刺作品"),
    summary: t(
      "Write a short satire in a familiar form, such as an advertisement, an announcement or a news report, that exaggerates a real folly to make a serious point.",
      "用广告、通知或新闻报道等常见形式写一篇简短的讽刺作品，夸大一种真实的愚蠢行为，以表达一个严肃的观点。",
    ),
    prerequisites: after("understanding-satire", "writing-an-argument-with-sources"),
    encompasses: covers(0.2, "understanding-satire"),
    xp: 24,
    strand: "writing",
    criteria: ["g10-satire-target", "g10-satire-exaggeration", "g10-satire-voice"].map(criterion),
    knowledgePoints: [
      point(
        "a-target-and-an-exaggeration",
        t("A Target and an Exaggeration", "目标和夸张"),
        t(
          "Satire mocks a **real folly** that readers will recognize, such as too much homework or too many meetings, and pushes it to an **absurd extreme**: *Since you study eight subjects, this comes to thirty-two hours of homework each evening.* The exaggeration should make the serious point plain.",
          "讽刺嘲弄读者能认出的**真实愚蠢行为**，例如作业太多或会议太多，并把它推向**荒唐的极端**：*Since you study eight subjects, this comes to thirty-two hours of homework each evening.* 夸张应当让严肃的观点一目了然。",
        ),
        writingGenerator(
          t(
            "Write the satire in English, aiming at a real folly and pushing it to an absurd extreme that makes the serious point plain.",
            "用英语写这篇讽刺作品，针对一种真实的愚蠢行为，把它推向荒唐的极端，使严肃的观点一目了然。",
          ),
          satireBank,
          ["g10-satire-target", "g10-satire-exaggeration", "g10-satire-voice"],
          limits,
          onePiece,
        ),
      ),
      point(
        "a-straight-faced-voice",
        t("A Straight-Faced Voice", "一本正经的口吻"),
        t(
          "Borrow a **familiar form**, such as an advertisement, an official letter or a news report, and keep its **straight face**: the speaker praises the folly as if it were sensible. *Doctors recommend two hours of screen time a day. The iStare 12 recommends doctors find a hobby.*",
          "借用一种**常见形式**，例如广告、公函或新闻报道，并保持**一本正经**：说话者把愚蠢的事当作明智之举来称赞。*Doctors recommend two hours of screen time a day. The iStare 12 recommends doctors find a hobby.*",
        ),
        writingGenerator(
          t(
            "Write the satire in English in the form the task names, keeping a straight face as the speaker praises the folly.",
            "按任务指定的形式用英语写这篇讽刺作品，让说话者一本正经地称赞这种愚蠢行为。",
          ),
          satireBank,
          ["g10-satire-voice", "g10-satire-target", "g10-satire-exaggeration"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
