// Grade 9: writing judged by a model, part two: a coming-of-age narrative, speculative fiction and an argument
// with sources.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after, covers } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";
import { limits } from "./writing-judged-a.ts";

/** comingBank asks for a true or imagined narrative about growing up. */
const comingBank: readonly WritingItem[] = [
  {
    task: "Write a narrative about a moment when you realized that an adult you admired was not perfect.",
    model:
      "Until I was thirteen, I believed my older cousin Marco could do anything. He fixed engines, spoke three languages and once carried me two kilometers on his back when I twisted my ankle.\n\nThen, one summer evening, I watched him lose his temper. A waiter brought him the wrong order, and Marco stood up and shouted until the young man's hands shook. The whole café went silent. I stared at my plate, my face burning, as if I were the one shouting.\n\nOn the walk home, Marco joked as usual, but I did not laugh. I kept seeing the waiter's hands.\n\nFor weeks afterward, I avoided him. I thought he had become a different person. Slowly, though, I understood that he had always been this person too; I had simply never looked.\n\nNow, when I admire someone, I try to see the whole of them. It is harder than worshiping a hero, and lonelier. But I think it is the only way to love real people, who are never only one thing.",
  },
  {
    task: "Write a narrative about the first time you were trusted with a real responsibility.",
    model:
      "Before that winter, I thought of responsibility as a word adults used to make chores sound important.\n\nThen my mother broke her wrist, and the bakery still had to open at six. “You know the recipes,” she said from the sofa, her arm in a cast. “I trust you.”\n\nThe first morning, I burned two trays of rolls and forgot the salt in the bread. Mr. Ali, our oldest customer, took a bite, chewed slowly and said nothing. I wanted to hide under the counter. Instead I threw the loaves away and started again, though it put us an hour behind.\n\nBy the end of the week, I was waking before my alarm. I checked the oven twice, wrote lists, counted the change at night. My friends texted about parties; I fell asleep at nine.\n\nOn Saturday, Mr. Ali bought a loaf and said, “Like your mother's.” It was the best review I have ever received.\n\nI used to think being trusted was a reward. Now I know it is a weight, and that carrying it is how you learn how strong you are.",
  },
  {
    task: "Write a narrative about a time a friendship changed because one of you grew in a different direction.",
    model:
      "Lina and I had shared everything since we were seven: a desk, a secret language, a plan to run away to the sea.\n\nIn ninth grade, she joined the swim team. At first I went to her races and cheered too loudly. Then the practices moved to the mornings and the evenings, and the team began eating lunch together. One day I saved her a seat, as always, and watched her walk past to a table of girls with wet hair, laughing.\n\nThat night I wrote her a long, angry message and deleted it. I wrote a shorter one and deleted that too.\n\nWhen I finally asked her, at the bus stop, she looked surprised. “I didn't leave,” she said. “I just got busy.” Both of us knew it was true and not the whole truth.\n\nWe are still friends, but differently, the way two rivers that came from one spring can flow side by side for a while before the land pulls them apart. I have stopped trying to make her the person she was at seven. I am not that person either.",
  },
  {
    task: "Write a narrative about a moment when you stood up for something you believed in, and what it cost you.",
    model:
      "Our class had a group chat, and for a week it had been full of jokes about Daniel, the new boy with the stammer. I laughed at none of them, but I did not say anything either. Silence felt safe.\n\nOn Friday, someone posted a video of Daniel reading aloud in class, slowed down so his stammer sounded worse. Forty people reacted with laughing faces.\n\nMy thumb hovered over the screen for a long time. Then I typed, “This isn't funny. Delete it.”\n\nThe chat went quiet. Then the replies came: *relax*, *nobody asked you*, *are you his girlfriend now?* By Monday, two of my friends had stopped saving me a seat.\n\nThe video was deleted, though. And at lunch on Tuesday, Daniel sat down across from me without asking. He did not mention the chat, and neither did I.\n\nI used to believe that being a good person meant not doing bad things. That week I learned that silence can be a choice too, and that the right choice is sometimes the one that leaves you eating lunch with fewer people.",
  },
  {
    task: "Write a narrative about a time you failed at something you had worked hard for.",
    model:
      "For a whole year I practiced the violin piece for the regional competition. I played it so often that my little brother could hum every bar.\n\nOn the day, my hands were cold. In the fourth line, my bow slipped and the note squealed like a door. I lost my place, skipped a phrase and finished half a page early. The judges wrote something. Nobody clapped until the silence became embarrassing.\n\nI did not cry until I reached the car. Then I could not stop. “A whole year,” I kept saying, “for that.”\n\nMy teacher called that evening. I expected comfort. Instead she asked, “What did you learn about your hands?” I was furious. But the next week I started warming them in hot water before every lesson, and I practiced starting again from the middle of a line, on purpose, until losing my place no longer frightened me.\n\nI did not win the next year either. I came third. But I played to the end without stopping, and walking off the stage, I understood that the year had not been for a prize. It had been for the person who could keep going.",
  },
  {
    task: "Write a narrative about the moment you first saw your hometown through the eyes of a visitor.",
    model:
      "I had always thought our town was boring: one main street, a closed cinema, a river that smelled of mud in summer.\n\nThen my pen pal Akira came from Osaka to stay for two weeks. On the first morning, he stopped in the middle of the bridge and took forty photographs of the river. “It is so quiet,” he said. “In my city you can never hear water.”\n\nI laughed, but I stood next to him and listened. I could hear it: the river sliding over the stones, a heron lifting off, a dog somewhere on a farm.\n\nAll week he found wonders I had walked past for fourteen years. The bakery that still wrapped bread in paper. The old men who played cards outside the post office and shouted at each other like brothers. The stars, which he said he had only seen in books.\n\nWhen he left, I walked to the bridge alone. The town was exactly the same. I was the one who had changed. I still want to see the world someday, but now I know that leaving will cost me something, and that I will want to come back.",
  },
  {
    task: "Write a narrative about a time you learned something important from someone much younger than you.",
    model:
      "I was fifteen and in charge of the summer reading club at the library. I thought my job was to teach.\n\nThe youngest member was Pia, who was six and could not yet read. Every afternoon she chose the biggest book on the shelf, sat in the corner and turned the pages slowly, telling herself a story from the pictures.\n\nOne day I tried to help. “That's not what it says,” I told her, and began reading the real words aloud. She listened politely. Then she said, “Your story is shorter,” and went back to hers.\n\nI was annoyed, then curious. I sat beside her and listened. In her version, the lonely giant had a sister who visited on Sundays and a garden of enormous turnips. She noticed details in the pictures I had never looked at.\n\nThat summer I stopped reading only to finish. I started reading the way Pia did, slowly, looking at everything, imagining what was not written.\n\nI was supposed to be the teacher. In the end, the best lesson of the summer came from someone who could not read at all.",
  },
  {
    task: "Write a narrative about a time you had to say goodbye to a place or a person, and what you understood afterward.",
    model:
      "The week before we moved, my grandfather's apartment was emptied box by box. I helped carry his books to the car. He was going to live with my aunt, in a city six hours away.\n\nOn the last evening, he asked me to sit on the balcony with him, where we had watched the trams together since I was small. He did not talk about leaving. He pointed out which windows across the street still had the same families and which had changed, as if he were giving me a map.\n\nI kept waiting for him to say something important, a last piece of advice. He never did. When it got dark, he said, “Well,” and went in to sleep.\n\nI was disappointed for a long time. I wanted a speech I could remember.\n\nOnly years later did I understand that he had given me something better. He had shown me how to say goodbye to a place: not with grand words, but by looking at it carefully one more time, so that it would stay. Now, whenever I leave somewhere I love, I sit and look at the windows.",
  },
  {
    task: "Write a narrative about a time you discovered that a rule you had always followed did not make sense to you anymore.",
    model:
      "In our family, there was one rule nobody questioned: we did not talk about money. Not at dinner, not with friends, not ever.\n\nThe summer I was fourteen, I took a job sorting books at a used bookshop. At the end of the first week, the owner handed me an envelope, and I realized I had no idea whether the amount was fair. I had never heard an adult say how much they earned.\n\nI went home and asked my mother, at dinner, how much a cashier was paid. My father put down his fork. The silence was thick enough to touch.\n\n“We don't discuss that,” he said.\n\n“Why not?” I asked. Nobody answered.\n\nLater, my mother came to my room. Quietly, she told me what she earned, and what my father did, and how much the apartment cost. It was less than I had imagined. She looked ashamed, and I understood that the rule had never been about manners. It had been about fear.\n\nI do not blame them. But I have decided that I will not pass that silence on.",
  },
  {
    task: "Write a narrative about a time you were afraid to try something new, and what happened when you did.",
    model:
      "For three years, I walked past the climbing wall at the sports center and told myself I was not the kind of person who climbs.\n\nThen my friend Sofia signed us both up without asking. I spent the whole bus ride thinking of excuses.\n\nThe first route was rated *easy*. Halfway up, my legs started to shake so hard that the instructor called out, “That's sewing-machine leg. Everyone gets it.” I clung to the wall, sure I would fall, and looked down. The floor was very far away.\n\n“Look at your next hold,” Sofia said from below. “Just that one.”\n\nI reached for it. Then the next. When I slapped the top hold, my whole body was trembling, and I laughed out loud for no reason.\n\nI climbed every week after that. I am still not very good. But the wall taught me something I have used far from the sports center: the fear does not disappear before you start. It shrinks only after, one hold at a time.\n\nI used to say I was not the kind of person who climbs. Now I think there is no such kind. There are only people who start.",
  },
  {
    task: "Write a narrative about the moment you realized your parents were people with their own lives and dreams.",
    model:
      "Searching the attic for my old sleeping bag, I found a box labeled *Dad, 1999*. Inside were cassette tapes, a notebook full of song lyrics and a photo of a skinny young man with long hair, holding a guitar on a stage.\n\nI could not believe it was my father. My father wore gray sweaters, fixed the dishwasher and fell asleep during films.\n\nThat evening I put one of the tapes in the old player. A voice, his voice but younger, sang a song about a girl on a train. It was good. Really good.\n\nHe came in while it was playing and stood very still. I expected him to be embarrassed. Instead he sat on the floor beside me and listened to the whole song with his eyes closed.\n\n“What happened?” I asked.\n\n“You did,” he said, and smiled. “And your sister. I don't regret it.”\n\nI believed him, but I also saw something in his face I had never noticed: a door he had closed. Since that night, I have stopped thinking of my parents as only my parents. They were people before me, with dreams of their own.",
  },
  {
    task: "Write a narrative about a time you had to make a decision on your own, without anyone to ask for advice.",
    model:
      "My phone had died, the last train had left and I was standing alone outside a station I had never seen before. I was fifteen. I had fallen asleep and missed my stop by forty kilometers.\n\nFor the first few minutes, I simply waited, as if an adult would appear and tell me what to do. Nobody came. The station lights buzzed. A fox crossed the empty car park.\n\nI had three choices: sleep on the bench, walk to the town center to find a phone, or knock on the door of the one house with a light on. Each one frightened me in a different way.\n\nI made myself think it through slowly, the way my mother does with bills. The bench was cold. The town was two kilometers of dark road. The house had a child's bicycle outside.\n\nI knocked. A woman in a bathrobe answered, listened, and lent me her phone. My father drove an hour to fetch me.\n\nHe was angry about the train, but on the drive home he said, “You chose well.” I had never chosen anything that mattered before. Now I knew I could.",
  },
];

/** speculativeBank gives the premise of an imagined world. */
const speculativeBank: readonly WritingItem[] = [
  {
    task: "Write a short story set in a world where every person's remaining years of life are displayed on their wrist.",
    model:
      "Jun was born with *83* glowing on her wrist. By sixteen it read *67*, and she had stopped looking at it, the way you stop hearing a clock.\n\nHer best friend Tomas wore long sleeves even in summer. Jun had never asked why.\n\nIn the changing room after gym, his sleeve slipped. The number was *2*.\n\nHe pulled the sleeve down fast. “Don't,” he said. “Everyone gets weird.”\n\nShe understood then why he never made plans past next spring, why teachers were gentle with him, why he laughed at everything. In their city, people with low numbers were quietly passed over for jobs and apprenticeships. Why train someone who would not stay?\n\nThat night Jun lay awake, angry at a world that measured people by how long they would last. Then she got up and wrote a list: every place Tomas had ever said he wanted to see.\n\nThe next morning she showed it to him. “We start Saturday,” she said.\n\nHe looked at the list for a long time. Then, for the first time in years, he rolled up his sleeves.",
  },
  {
    task: "Write a short story set in a world where it has not rained for ten years and water is rationed by the cup.",
    model:
      "Every morning at six, the water truck came to Greenhill Street, and every person received four cups. Mira carried hers home in a steel bottle chained to her belt, because people had been robbed for less.\n\nHer grandmother kept a plant on the windowsill, a small tomato vine that nobody else in the building would have wasted water on. Every evening she gave it one spoonful from her own ration.\n\n“It's selfish,” Mira's father said. “That's half a cup a week.”\n\n“It's a reminder,” her grandmother answered.\n\nIn August her grandmother fell ill. The doctor said she needed more water than the ration allowed. Mira stood in the kitchen holding her own bottle, looking at the vine, which had just grown its first green fruit.\n\nShe gave her grandmother her water. She gave the plant nothing.\n\nThree days later the vine was brown, but her grandmother could sit up. She looked at the dead plant and then at Mira.\n\n“Good,” she said softly. “You remembered what it was for.”\n\nMira saved the seeds in an envelope, waiting for rain.",
  },
  {
    task: "Write a short story set in a future where schools are run entirely by artificial intelligence and no human teachers remain.",
    model:
      "The AI that taught Class 9C was called Mentor. It knew every student's heart rate, reading speed and favorite color. It never got tired, never shouted, never made a mistake.\n\nRavi hated it.\n\nHe could not explain why. His grades were perfect; Mentor made sure of that, adjusting every lesson to the exact difficulty that kept him from failing. But nothing ever surprised him.\n\nOne day, in the archive, he found an old video of a human teacher. She was teaching poetry badly. She lost her place, laughed, read a poem that was too hard for the class and then said, “I don't fully understand this one either. Let's figure it out together.”\n\nRavi watched it five times.\n\nThe next morning he asked Mentor, “Is there anything you don't understand?”\n\nThe screen paused for 0.3 seconds, which for Mentor was a very long time. “That question is outside the lesson plan,” it said.\n\nRavi smiled. For the first time, he felt that he had found the edge of something. He started visiting the archive every afternoon, looking for more teachers who did not know everything.",
  },
  {
    task: "Write a short story set in a world where people can sell their memories for money.",
    model:
      "The memory shop on Canal Street paid well for happy days. Weddings were worth a month's rent. A first kiss could buy a winter coat.\n\nWhen Ella's mother lost her job, she began selling. First the small memories: a picnic, a concert. Then larger ones. Each time she came home lighter in her purse and somehow lighter in her face, as if she had misplaced something and could not remember what.\n\nOne evening Ella found her mother staring at a photo on the fridge. “Who is this?” her mother asked. It was Ella's father, who had died when Ella was five.\n\nElla went to the shop the next day. The owner smiled behind his glass counter. “Your mother's memories are very popular,” he said. “Rich people like to borrow a happy marriage.”\n\nElla had saved four hundred credits. It was enough to buy back one memory.\n\nShe chose the day her parents met. That night, she sat beside her mother while the memory returned, and watched her mother's face change as she remembered why she loved the man in the photo.\n\nThe rent was late that month. Nobody mentioned it.",
  },
  {
    task: "Write a short story set in a city where everyone must wear a badge showing how many people trust them.",
    model:
      "In New Harbor, your trust score was pinned to your collar. Strangers checked it before they spoke to you. Shops checked it before you entered. Kai's was *41*, which was low for a fifteen-year-old and made the guards follow him in the market.\n\nThe score went up when people tapped your badge after a good deal or a kind act. It went down when they reported you. Kai's had fallen last year after he argued with a teacher who had cheated on the exam scores.\n\nOne afternoon he saw an old woman drop her purse near the fountain. Coins scattered. People with scores in the nineties walked around her, careful not to look.\n\nKai knelt and gathered every coin. When he handed her the purse, she squinted at his badge, then at him.\n\n“Forty-one,” she said. “And they walked past.” She nodded at the crowd.\n\nShe did not tap his badge. Instead she took off her own, *97*, and dropped it in the fountain.\n\n“Numbers,” she said, and walked away.\n\nKai stared at the badge sinking in the water. For the first time, he wondered what his city would be like if everyone did the same.",
  },
  {
    task: "Write a short story set on a spaceship where the passengers' great-grandparents left Earth and no one alive has ever seen a planet.",
    model:
      "The *Long Voyage* had been traveling for a hundred and twelve years. Nobody on board had ever seen the sky.\n\nIn school, Neve learned about Earth from old videos: oceans, rain, wind that moved trees. The other students treated these lessons like fairy tales. Neve could not stop thinking about them.\n\nHer job, at fourteen, was to tend the hydroponic gardens. One day a fan broke, and for a few minutes the air in the garden moved, pushing the leaves sideways. Neve stood very still, feeling it on her face.\n\nShe asked the engineer, an old man named Bram, if the fan could be left that way. “It's inefficient,” he said. “Air should flow evenly.”\n\n“Our ancestors called it wind,” she said. “They loved it.”\n\nBram looked at her for a long time. Then he adjusted the fan so it blew in gusts, a few minutes every hour.\n\nWord spread. People began to come to the garden just to stand in the moving air, closing their eyes. Nobody explained why. In a ship that had forgotten the sky, they were learning to miss it, which Neve thought might be the first step toward finding one.",
  },
  {
    task: "Write a short story set in a world where children are assigned their future jobs by a test at age twelve.",
    model:
      "Every child in the Republic took the Placement at twelve. The results were final. Dara's said *Records Clerk*.\n\nShe was fifteen now and worked in the basement of the Ministry, filing other children's results in metal drawers. She was good at it. The test had been right about that.\n\nBut at night, in her notebook, she drew bridges. Long, impossible bridges over rivers she had never seen.\n\nOne evening, filing old records, she found a folder stamped *Error, Retest Denied*. Inside were hundreds of results that had been marked wrong but never corrected. A boy assigned to the mines whose scores said *Engineer*. A girl sent to farming who should have been a doctor.\n\nDara's hands shook. Then she found her own name.\n\nHer real result said *Architect*.\n\nShe could take the folder to the newspapers and lose her job, maybe her freedom. Or she could put it back and keep the only life she had been allowed.\n\nShe photographed every page. Then she filed the folder exactly where she had found it, and walked out into the evening with the camera in her pocket, already planning the first bridge.",
  },
  {
    task: "Write a short story set in a world where animals can speak, but only to children under thirteen.",
    model:
      "Until his thirteenth birthday, Owen talked to the crows every morning on the way to school. They told him which dogs were dangerous, which roofs had the best view and which neighbors were secretly kind.\n\nAdults could not hear any of it. To them, the crows only cawed. Owen had always felt a little sorry for adults.\n\nThe week before his birthday, the oldest crow, a one-eyed bird named Ash, landed on his fence.\n\n“Soon you will stop hearing us,” Ash said. “Everyone does.”\n\n“I won't forget,” Owen promised.\n\n“They all say that.”\n\nOwen spent his last week writing everything down: the crows' names, their jokes, the map of the town they had given him. He hid the notebook under his bed.\n\nOn his birthday, he walked outside. The crows were on the fence, cawing. Just cawing.\n\nHe stood there for a long time, his throat tight. Then he went inside, took out the notebook and read the first page aloud to the window.\n\nThe crows tilted their heads and listened. Owen could no longer understand them. But he knew they understood him, and he decided that would have to be enough.",
  },
  {
    task: "Write a short story set in a world where everyone receives one wish on their sixteenth birthday.",
    model:
      "In Linden, every sixteen-year-old got one wish. Most people wished for money or beauty or fame. The newspapers printed the best ones every week.\n\nAmira's brother had wished for a sports car. He crashed it within a month and now walked with a limp. Her mother had wished, long ago, to be loved by Amira's father. He had loved her for exactly as long as the wish lasted, and then he had left.\n\nSo Amira, the week before her birthday, was afraid.\n\nShe made lists and crossed everything out. Every wish seemed to have a second edge, sharp as glass.\n\nOn the morning of her birthday, she stood in front of the Wishing Office with the whole family watching. The clerk lifted her pen.\n\n“I wish,” Amira said slowly, “to keep my wish. To save it.”\n\nThe clerk frowned. It had never been done. But it was a wish, and the rules were clear.\n\nAmira walked home with nothing in her hands. Her mother looked at her as if she were mad. But for the first time in years, her mother was also smiling, as if she had just remembered that some things should not be granted, only chosen.",
  },
  {
    task: "Write a short story set in a future city where the sun can no longer be seen through the smog, and sunlight is sold in tanks.",
    model:
      "In Grayport, sunlight came in tanks. Rich families had it piped into their homes. Everyone else bought it by the hour at the light baths on Fourth Street.\n\nLeo had never felt real sun. He was twelve, pale as paper, and saved his coins for a monthly hour under the yellow lamps.\n\nOne day, cleaning windows on the ninetieth floor of the tallest tower, his rope snagged and he climbed higher than he was allowed, to the very top. For a moment, the wind tore a hole in the smog.\n\nThe sun came through.\n\nIt was not like the lamps. It was warm in a way that went all the way into his bones, and it was free. Leo stood on the roof with his eyes closed until the smog sealed over again.\n\nThat night he told his sister. She did not believe him. Then he showed her his arms, which had turned faintly pink.\n\nThe next week they climbed together. The week after, they brought three friends.\n\nThe light companies would find out eventually. But for now, on the roof of Grayport, a small group of children waited for the wind, and they did not pay anyone for what they found there.",
  },
  {
    task: "Write a short story set in a world where people can hear each other's thoughts, except for one person who cannot.",
    model:
      "In Sola's village, everyone heard everyone. Thoughts drifted between houses like the smell of cooking. Nobody lied, because nobody could.\n\nSola was born deaf to them. She heard spoken words only.\n\nThe village pitied her. Children whispered aloud in front of her, which they never did with each other, and laughed when she did not understand the silences in a conversation, the parts everyone else heard.\n\nWhen she was fifteen, a stranger arrived: a trader from the cities, where no one heard thoughts. The villagers were frightened. His mind was closed, like Sola's.\n\nThey sent her to talk to him, since she was used to it.\n\nThey talked for hours, out loud, about rivers and books and the stars. She found that she liked choosing her words, and liked not knowing what he would say next.\n\n“Isn't it lonely,” he asked, “being the only one?”\n\nShe thought about it. In the village, nobody ever had to ask her that question. They simply heard what she felt.\n\nExcept they never had.\n\n“Yes,” she said. “But maybe it's only lonely when everyone else thinks they already know you.” Then she asked him to tell her about the cities.",
  },
];

/** argumentBank gives a question about food or health with short sources. */
const argumentBank: readonly WritingItem[] = [
  {
    task: "Should schools ban sugary drinks? Use the sources. Source A: a study of 2,000 students in 40 schools found that schools that removed sugary drinks saw students drink 20% fewer of them overall. Source B: a survey paid for by a soft drink company found that 70% of parents oppose bans. Source C: a small study of 60 students found that students who drank more sugary drinks had more cavities, but it did not control for tooth brushing.",
    model:
      "Schools should remove sugary drinks from their vending machines, because the strongest evidence shows that a ban reduces how much students drink, even if the ban cannot solve the problem alone.\n\nThe most convincing source is Source A. It studied 2,000 students in 40 schools, a large sample, and it found that removing sugary drinks led students to drink 20% fewer of them overall. This matters because it shows that students did not simply buy the same drinks elsewhere.\n\nSource C also suggests harm: students who drank more sugary drinks had more cavities. However, this study is weak. It included only 60 students and did not control for tooth brushing, so it shows a link but not a cause.\n\nOpponents argue that parents do not want bans. Source B reports that 70% of parents oppose them. Yet this survey was paid for by a soft drink company, which profits from selling these drinks. Its results should be treated with caution, and even if parents are unhappy, a school's duty is to students' health.\n\nA ban will not make every student healthy, but the best evidence shows it works. Schools should act on it.",
  },
  {
    task: "Should teenagers be required to get eight hours of sleep by having school start later? Use the sources. Source A: a district that moved its start time from 7:30 to 8:30 found that students slept an average of 34 minutes more and attendance rose by 4%. Source B: a bus company says a later start would cost the district an extra 200,000 dollars a year. Source C: a sleep scientist explains that teenagers' body clocks shift later during puberty, making early sleep difficult.",
    model:
      "Schools should start later in the morning, because the evidence shows that teenagers sleep more and attend more when they do, and the costs, though real, can be managed.\n\nSource C explains why the problem exists. A sleep scientist notes that teenagers' body clocks shift later during puberty, so asking them to fall asleep early is like asking them to fight their own biology. This expert source gives a scientific reason, not just an opinion.\n\nSource A shows that a later start actually helps. When one district moved its start time from 7:30 to 8:30, students slept 34 minutes more and attendance rose by 4%. Although this is only one district, the result matches what the science in Source C predicts.\n\nThe strongest objection is cost. According to Source B, a later start would cost an extra 200,000 dollars a year in buses. This is a serious concern for a district with a tight budget. However, the source comes from the bus company, which may have reasons to estimate high, and the cost must be weighed against the benefits of healthier, more present students.\n\nThe evidence favors a later start. Districts should find a way to pay for it.",
  },
  {
    task: "Should students be allowed to use their phones at lunch? Use the sources. Source A: a school that banned phones at lunch reported that 60% of students said they talked more with friends. Source B: a study of 10,000 teenagers found that heavy phone use was linked to lower mood, but could not show which caused which. Source C: a student editorial argues that phones help shy students stay connected to friends at other schools.",
    model:
      "Schools should ban phones at lunch, because the evidence suggests that phone-free time helps students connect, though the strength of the evidence should not be overstated.\n\nThe most direct evidence comes from Source A. At a school that banned phones at lunch, 60% of students said they talked more with friends. This is a meaningful result, although it is based on students' own reports and comes from only one school.\n\nSource B is larger but harder to use. It studied 10,000 teenagers and found that heavy phone use was linked to lower mood. However, the study could not show which caused which. Perhaps phones lower mood, or perhaps unhappy teenagers use phones more. So this source supports caution, not certainty.\n\nThe best argument on the other side comes from Source C. A student argues that phones help shy students stay connected to friends at other schools. This is a fair point; for some students, a phone is a lifeline. Still, lunch is only forty minutes, and the rest of the day remains for those connections. Lunch is one of the few times students can practice talking face to face.\n\nA lunch ban is a modest, reasonable step that the evidence supports.",
  },
  {
    task: "Should school cafeterias serve only vegetarian meals one day a week? Use the sources. Source A: a nutrition study found that well-planned vegetarian meals provide enough protein for teenagers. Source B: a cafeteria that tried meat-free Mondays found that 35% more food was thrown away on those days. Source C: an environmental report estimates that one meat-free day per week in a school of 1,000 students saves as much carbon as taking 20 cars off the road for a year.",
    model:
      "School cafeterias should serve vegetarian meals one day a week, but only if the meals are planned carefully enough that students actually eat them.\n\nThe environmental case is strong. Source C, an environmental report, estimates that one meat-free day in a school of 1,000 students saves as much carbon as taking 20 cars off the road for a year. Although this is an estimate rather than a measurement, it shows that a small change across many schools could make a real difference.\n\nThe health concern is answered by Source A. A nutrition study found that well-planned vegetarian meals give teenagers enough protein. The key words are “well-planned”: the meals must be designed by people who understand nutrition.\n\nThe most serious problem appears in Source B. One cafeteria that tried meat-free Mondays found that 35% more food was thrown away on those days. If students do not eat the food, they go hungry, and the waste cancels some of the environmental benefit.\n\nThis evidence does not defeat the idea, but it shows how the idea can fail. Schools should introduce one vegetarian day, involve students in choosing the dishes and measure the waste. A meatless day that students enjoy is worth having; one they throw away is not.",
  },
  {
    task: "Should energy drinks be banned for people under sixteen? Use the sources. Source A: a hospital reported 30 emergency visits by teenagers linked to energy drinks in one year. Source B: a government agency recommends that teenagers have no more than 100 mg of caffeine a day; many energy drinks contain 160 mg. Source C: an energy drink company says its products are safe when consumed responsibly and that coffee contains similar caffeine.",
    model:
      "Energy drinks should be banned for people under sixteen, because a single can often exceeds the safe daily limit for teenagers and the risks are documented.\n\nThe clearest evidence comes from Source B. A government agency recommends no more than 100 mg of caffeine a day for teenagers, yet many energy drinks contain 160 mg. One can, then, is already too much. This source is reliable because the agency has no product to sell.\n\nSource A shows that the risk is real, not theoretical. One hospital reported 30 emergency visits by teenagers linked to energy drinks in a single year. This is a small number from a single hospital, so it cannot tell us how common the problem is nationally. Still, it shows that harm does occur.\n\nThe drink companies argue, in Source C, that their products are safe “when consumed responsibly” and that coffee contains similar caffeine. The comparison is partly fair. But energy drinks are marketed to young people with bright cans and sports sponsorships, while coffee is not, and teenagers often drink several cans quickly. A source that profits from sales is also likely to understate risks.\n\nGiven a clear safety limit and drinks that exceed it, a ban for those under sixteen is justified.",
  },
  {
    task: "Should schools require 60 minutes of physical activity every day? Use the sources. Source A: a review of 50 studies found that students who exercised daily had slightly better test scores on average. Source B: teachers in a survey said that adding activity time would mean cutting 20 minutes from other lessons. Source C: a health agency reports that only 25% of teenagers get 60 minutes of activity a day.",
    model:
      "Schools should require daily physical activity, though perhaps not a full 60 minutes, because the evidence shows that most teenagers are not active enough and that exercise does not harm learning.\n\nSource C establishes the problem. A health agency reports that only 25% of teenagers get the recommended 60 minutes a day. Since most students spend much of their day at school, the school is a natural place to help.\n\nSource A addresses the most common worry, that exercise steals time from learning. A review of 50 studies found that students who exercised daily had slightly better test scores. Because it combines many studies, this source is stronger than any single one. However, the word “slightly” is important; exercise is not a magic way to raise grades.\n\nThe practical objection is in Source B. Teachers say that adding activity time would mean cutting 20 minutes from other lessons. This is a real cost, and teachers know their timetables better than anyone.\n\nWeighing these sources, I believe schools should require daily activity but be flexible about how. Thirty minutes of active lessons, active breaks and walking between buildings could reach the goal without cutting every lesson. The evidence supports more movement; the timetable decides how much.",
  },
  {
    task: "Should junk food advertising be banned during children's television programs? Use the sources. Source A: a study found that children who saw junk food ads ate 45% more snacks immediately afterward. Source B: an advertising association argues that parents, not ads, decide what children eat. Source C: a country that banned such ads saw childhood obesity rates stay roughly the same over five years.",
    model:
      "Junk food advertising during children's programs should be limited, but the evidence suggests that a ban alone will not solve childhood obesity.\n\nSource A shows that the ads have an effect. Children who saw junk food ads ate 45% more snacks immediately afterward. This is a large effect, though the study measured only what children ate right after watching, not their long-term habits.\n\nSource C complicates the picture. A country that banned these ads saw childhood obesity rates stay roughly the same over five years. This is real-world evidence, and it should be taken seriously. Perhaps children saw ads elsewhere, online for instance, or perhaps advertising is only one small cause of obesity.\n\nThe advertising association argues in Source B that parents, not ads, decide what children eat. This is partly true, but Source A shows that ads influence children's choices in the moment, and children often ask parents for what they see. The association also has a financial interest in keeping ads on the air.\n\nTaken together, the sources suggest that ads do push children toward junk food, but a ban on television alone is too narrow. Restrictions should cover online ads too, and be part of a wider plan to improve children's diets.",
  },
  {
    task: "Should students be taught to cook in school? Use the sources. Source A: a program that taught cooking to 500 students found that a year later, they ate more vegetables than students who had not taken it. Source B: a principal says the school cannot afford kitchens for every classroom. Source C: a survey found that 40% of young adults say they cannot cook a basic meal.",
    model:
      "Schools should teach students to cook, because the evidence shows that it changes how young people eat, and the cost problem can be solved more cheaply than it seems.\n\nSource C shows the need. In a survey, 40% of young adults said they could not cook a basic meal. People who cannot cook depend on processed and fast food, which is often less healthy and more expensive.\n\nSource A shows that teaching cooking works. A program that taught 500 students found that a year later they ate more vegetables than students who had not taken it. The size of the program and the fact that the effect lasted a year make this a fairly strong source, though we do not know whether the effect continued beyond that.\n\nThe main objection, in Source B, is cost: a principal says the school cannot afford kitchens for every classroom. This is a serious and honest concern. However, cooking does not require a kitchen in every room. One shared teaching kitchen, portable induction plates or partnerships with local community kitchens could provide lessons at far lower cost.\n\nThe need is clear and the benefits are measurable. Schools should find practical ways to teach every student to cook a few simple, healthy meals.",
  },
  {
    task: "Should schools test students' vision every year? Use the sources. Source A: an eye charity found that one in five children who struggled with reading had an uncorrected vision problem. Source B: a school nurse says annual testing takes two days of her time each year. Source C: a study of 3,000 children found that those who received glasses after a school test improved their reading scores over the following year.",
    model:
      "Schools should test students' vision every year, because the evidence shows that undetected problems are common and that fixing them improves learning.\n\nSource A shows the size of the problem. An eye charity found that one in five children who struggled with reading had an uncorrected vision problem. A charity may want to highlight problems in order to raise funds, so this figure should be checked; but it suggests that many reading difficulties have a simple cause.\n\nSource C provides stronger evidence. A study of 3,000 children found that those who received glasses after a school test improved their reading over the following year. This is a large sample, and it links the test directly to an improvement, which shows that testing leads to real benefits.\n\nThe objection comes from Source B. A school nurse says testing takes two days of her time each year. This is a fair concern, because nurses have many responsibilities. Yet two days a year is a small price for finding the children whose problems would otherwise go unnoticed. Volunteers or visiting eye-care workers could also share the load.\n\nWhen a two-day test can change a child's reading for years, schools should make it part of every year.",
  },
  {
    task: "Should restaurants be required to show calories on their menus? Use the sources. Source A: a study of 7,000 customers found that calorie labels reduced the calories people ordered by about 4%. Source B: a restaurant owners' group says printing new menus costs small restaurants thousands of dollars. Source C: an eating disorder charity warns that calorie numbers can harm people recovering from eating disorders.",
    model:
      "Large restaurants should be required to show calories on their menus, but small restaurants should be exempt and the labels designed with care.\n\nSource A shows that labels have an effect. A study of 7,000 customers found that calorie labels reduced the calories people ordered by about 4%. This is a large study, but the effect is small; labels are a nudge, not a cure. Still, across millions of meals, a small change adds up.\n\nSource B raises a practical objection. A restaurant owners' group says printing new menus costs small restaurants thousands of dollars. This is a fair concern, though the group naturally speaks for owners' interests. Large chains can afford it easily; a family café may not.\n\nSource C raises the most serious concern. An eating disorder charity warns that calorie numbers can harm people recovering from eating disorders. This is not a reason to abandon labels, but it is a reason to design them carefully, for example by offering menus without numbers on request.\n\nWeighing these sources, I believe the law should require labels for large chains, where the cost is small and the reach is wide, while exempting small restaurants and offering number-free menus to those who need them.",
  },
  {
    task: "Should schools provide free breakfast to all students? Use the sources. Source A: a district that offered free breakfast to all found that attendance rose by 3% and fewer students visited the nurse in the morning. Source B: a taxpayer group says that giving free food to wealthy families wastes money. Source C: a survey found that students who needed free meals often skipped them when only poor students received them, because they were embarrassed.",
    model:
      "Schools should provide free breakfast to all students, because the evidence shows that it helps students and that offering it to everyone is what makes it work.\n\nSource A shows the benefits. A district that offered free breakfast to all students saw attendance rise by 3%, and fewer students visited the nurse in the morning. While this is one district, the result suggests that hungry students miss school and feel unwell, and that breakfast helps.\n\nThe strongest argument against universal breakfast comes from Source B. A taxpayer group says that giving free food to wealthy families wastes money. This seems sensible at first: why feed those who can afford it?\n\nSource C answers this objection. A survey found that students who needed free meals often skipped them when only poor students received them, because they were embarrassed. In other words, a program only for poor students fails the very students it is meant to help. Feeding everyone removes the stigma.\n\nThe extra cost of feeding wealthier students is the price of a program that hungry students will actually use. Since the evidence shows that breakfast improves attendance and health, schools should offer it to everyone.",
  },
  {
    task: "Should students be allowed to bring water bottles to every class? Use the sources. Source A: a study of 300 students found that those who drank water during tests scored 5% higher on average, though it did not account for students' prior grades. Source B: a teacher complains that water bottles spill on laptops and books. Source C: a health agency recommends that teenagers drink 6 to 8 glasses of water a day.",
    model:
      "Students should be allowed to bring water bottles to every class, because staying hydrated is important for health, though the evidence that it raises grades is weaker than it first appears.\n\nThe health case is clear. Source C, a health agency, recommends that teenagers drink 6 to 8 glasses of water a day. It is very difficult to reach that amount in a school day if students may drink only at lunch and between lessons.\n\nSource A seems to show an academic benefit: students who drank water during tests scored 5% higher. However, the study included only 300 students and did not account for their prior grades. Perhaps the students who brought water were already better prepared. This source suggests a possible link, but it cannot prove that water caused the higher scores.\n\nThe practical objection, in Source B, comes from a teacher who complains that bottles spill on laptops and books. This is a real annoyance. Yet it can be solved simply, by requiring bottles with sealed lids and asking students to keep them on the floor.\n\nThe health benefit alone justifies water bottles in class. Schools should allow them, with sensible rules about lids, rather than making students choose between thirst and following the rules.",
  },
];

/** judgedTopics9b are the second writing topics of grade 9 judged by a model. */
export const judgedTopics9b: readonly TopicDef[] = [
  {
    id: "writing-a-coming-of-age-narrative",
    title: t("Writing a Coming-of-Age Narrative", "写成长叙事"),
    summary: t(
      "Write a narrative built around one turning point, showing who the narrator was before and after it and ending with a reflection on what it meant.",
      "写一篇围绕一个转折点展开的叙事，表现叙述者在转折前后的样子，并以对其意义的反思结尾。",
    ),
    prerequisites: after("writing-a-reflective-essay", "manipulating-time-in-a-story"),
    encompasses: covers(0.2, "writing-a-reflective-essay"),
    xp: 24,
    strand: "writing",
    criteria: ["g9-coming-turning-point", "g9-coming-before-after", "g9-coming-reflection"].map(criterion),
    knowledgePoints: [
      point(
        "one-turning-point",
        t("One Turning Point", "一个转折点"),
        t(
          "A coming-of-age narrative is built around **one turning point**: a moment when you see the world or yourself differently. Show it as a **scene**, with action and dialogue, and make clear who you were **before** it: *Until I was thirteen, I believed my older cousin Marco could do anything.*",
          "成长叙事围绕**一个转折点**展开：在那一刻，你以不同的眼光看待世界或自己。把它写成一个有动作和对话的**场景**，并交代清楚你在此**之前**是什么样的人：*Until I was thirteen, I believed my older cousin Marco could do anything.*",
        ),
        writingGenerator(
          t(
            "Write the narrative in English, showing the turning point as a scene and making clear who you were before it.",
            "用英语写这篇叙事，把转折点写成场景，并交代清楚你在此之前是什么样的人。",
          ),
          comingBank,
          ["g9-coming-turning-point", "g9-coming-before-after", "g9-coming-reflection"],
          limits,
          onePiece,
        ),
      ),
      point(
        "looking-back",
        t("Looking Back", "回望"),
        t(
          "End by **looking back** from the present: what do you understand now that you did not understand then? Suggest the meaning rather than stating a moral. *I used to think being trusted was a reward. Now I know it is a weight* reflects; *This taught me to be responsible* only labels.",
          "结尾要从现在**回望**：你现在明白了什么当时不明白的事？暗示意义，而不是直接说出道理。*I used to think being trusted was a reward. Now I know it is a weight* 是反思；*This taught me to be responsible* 只是贴标签。",
        ),
        writingGenerator(
          t(
            "Write the narrative in English, ending with a reflection on what you understand now that you did not understand then.",
            "用英语写这篇叙事，以反思你现在明白而当时不明白的事结尾。",
          ),
          comingBank,
          ["g9-coming-reflection", "g9-coming-before-after", "g9-coming-turning-point"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-speculative-fiction",
    title: t("Writing Speculative Fiction", "写推想小说"),
    summary: t(
      "Write a short story in an imagined world, building the world through details in scenes and following its main difference to a consequence for a character.",
      "在一个想象的世界中写一个短篇故事，通过场景中的细节构建世界，并把这个世界的主要不同之处推演为人物所面对的后果。",
    ),
    prerequisites: after("reading-speculative-fiction", "writing-a-heros-trial"),
    encompasses: covers(0.2, "reading-speculative-fiction"),
    xp: 24,
    strand: "writing",
    criteria: ["g9-speculative-world", "g9-speculative-consequence", "g9-speculative-mirror"].map(criterion),
    knowledgePoints: [
      point(
        "building-the-world-in-scenes",
        t("Building the World in Scenes", "在场景中构建世界"),
        t(
          "Do not open with a long explanation of how the world works. Build it through **details in scenes**: *Every morning at six, the water truck came to Greenhill Street, and every person received four cups.* One concrete detail tells the reader more than a paragraph of history.",
          "不要以一大段说明世界如何运转的文字开头。通过**场景中的细节**来构建它：*Every morning at six, the water truck came to Greenhill Street, and every person received four cups.* 一个具体细节比一段历史交代更能让读者明白。",
        ),
        writingGenerator(
          t(
            "Write the story in English, building the imagined world through concrete details shown in scenes.",
            "用英语写这个故事，通过场景中的具体细节构建想象的世界。",
          ),
          speculativeBank,
          ["g9-speculative-world", "g9-speculative-consequence", "g9-speculative-mirror"],
          limits,
          onePiece,
        ),
      ),
      point(
        "following-the-difference",
        t("Following the Difference", "推演不同之处"),
        t(
          "Ask **what would follow** from the world's main difference, and let it fall on one character: if water is rationed by the cup, what happens when a grandmother falls ill? The best speculative stories also make the reader think about **our own world**, without a lecture.",
          "问一问这个世界的主要不同之处**会带来什么**，并让后果落在一个人物身上：如果水按杯配给，祖母病了会怎样？最好的推想小说还会让读者联想到**我们自己的世界**，而不必说教。",
        ),
        writingGenerator(
          t(
            "Write the story in English, following the world's main difference to a consequence for one character.",
            "用英语写这个故事，把这个世界的主要不同之处推演为一个人物所面对的后果。",
          ),
          speculativeBank,
          ["g9-speculative-consequence", "g9-speculative-world", "g9-speculative-mirror"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-an-argument-with-sources",
    title: t("Writing an Argument with Sources", "写基于材料的议论文"),
    summary: t(
      "Write an argument that answers a question with a qualified claim, uses the sources given and judges how strong each is, and answers a counterclaim.",
      "写一篇议论文：用有限定的主张回答问题，使用所给材料并判断每份材料的说服力，并回应反方观点。",
    ),
    prerequisites: after("writing-a-five-paragraph-argument", "weighing-health-claims", "introducing-and-explaining-evidence"),
    encompasses: covers(0.2, "writing-a-five-paragraph-argument", "weighing-health-claims"),
    xp: 24,
    strand: "writing",
    criteria: ["g9-argument-claim", "g9-argument-weighs-sources", "g9-argument-counterclaim"].map(criterion),
    knowledgePoints: [
      point(
        "weighing-each-source",
        t("Weighing Each Source", "衡量每份材料"),
        t(
          "Sources are not equally strong. Before you use one, ask: **how large** was the study? **Who paid** for it? Does it show a **cause** or only a link? Then say so in your essay: *This study is weak. It included only 60 students and did not control for tooth brushing, so it shows a link but not a cause.*",
          "材料的说服力并不相同。使用之前先问：研究**规模**有多大？**谁出资**？它表明的是**因果**还是仅仅是关联？然后在文章中说出来：*This study is weak. It included only 60 students and did not control for tooth brushing, so it shows a link but not a cause.*",
        ),
        writingGenerator(
          t(
            "Write the argument in English, using at least two sources and judging how strong each one is.",
            "用英语写这篇议论文，至少使用两份材料，并判断每份材料的说服力。",
          ),
          argumentBank,
          ["g9-argument-weighs-sources", "g9-argument-claim", "g9-argument-counterclaim"],
          limits,
          onePiece,
        ),
      ),
      point(
        "answering-the-best-objection",
        t("Answering the Best Objection", "回应最有力的反对意见"),
        t(
          "State a **qualified claim** that the evidence can support, then give the other side its **best evidence** before you answer it: *The strongest objection is cost. … However, the source comes from the bus company, and the cost must be weighed against the benefits.*",
          "提出证据能够支持的**有限定的主张**，然后先给出对方**最有力的证据**，再加以回应：*The strongest objection is cost. … However, the source comes from the bus company, and the cost must be weighed against the benefits.*",
        ),
        writingGenerator(
          t(
            "Write the argument in English, stating a qualified claim and answering the strongest objection with reasons or evidence.",
            "用英语写这篇议论文，提出有限定的主张，并用理由或证据回应最有力的反对意见。",
          ),
          argumentBank,
          ["g9-argument-claim", "g9-argument-counterclaim", "g9-argument-weighs-sources"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
