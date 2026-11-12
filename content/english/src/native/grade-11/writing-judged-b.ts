// Grade 11: writing judged by a model, part two: an open letter and a narrative of two worlds.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after, covers } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";
import { limits } from "./writing-judged-a.ts";

/** letterBank gives a cause and an addressee for an open letter. */
const letterBank: readonly WritingItem[] = [
  {
    task: "Write an open letter to the town council, to be published in the local paper, asking it to keep the public swimming pool open after the council voted to close it to save money.",
    model:
      "To the members of the town council,\n\nLast Tuesday you voted to close the Riverside swimming pool at the end of the summer to save forty thousand dollars a year. I am writing, as a student and a swimmer, to ask you to reverse that decision, and I am writing in public because the pool belongs to everyone who reads this paper.\n\nI understand that the budget is tight, and I do not doubt that you weighed the choice carefully. But the pool is not a luxury. It is the only place in town where children can learn to swim for free. Last year more than three hundred children took lessons there, many from families who could never pay for a private club. In a town built on a river, knowing how to swim is a matter of safety.\n\nThe pool is also one of the few places where people of every age and background meet. On any summer afternoon you will find retired teachers swimming laps beside teenagers and toddlers.\n\nI ask you to look for savings elsewhere, or to work with local businesses to sponsor the pool. Many of us would gladly help.\n\nA town shows what it values by what it keeps. I hope you will keep the place where our children learn not to be afraid of the water.\n\nYours sincerely, A Riverside student",
  },
  {
    task: "Write an open letter to the head of a large clothing company, to be shared online, asking the company to stop sending its unsold clothes to be burned.",
    model:
      "Dear Chief Executive,\n\nA report published this month revealed that your company burns tons of unsold clothing every year rather than sell it at a discount or give it away. I am writing this open letter, which I have shared with my classmates and online, to ask you to end that practice.\n\nI know that companies protect their brands, and that cheap copies of your clothes could damage your prices. That concern is real. But burning new clothes is a waste that the world can no longer afford. Every shirt took water, cotton and human labor to make. Destroying it means that all of that effort was spent for nothing, while the smoke adds to the pollution your company says it wants to reduce.\n\nThere are better options. Unsold clothes can be recycled into new fabric, donated to shelters with the labels removed, or sold through outlet stores. Other brands have already done this and found that customers respect them for it.\n\nMany of us who buy your clothes are young. We will be buying clothes for the next sixty years, and we are paying attention to which companies take the future seriously.\n\nYou have the power to turn waste into a sign of responsibility. I hope you will use it, and that your next report will tell a different story.\n\nSincerely, A customer who wants to stay one",
  },
  {
    task: "Write an open letter to your school's principal, to be posted in the school newsletter, asking for a quiet room where students can study or rest during lunch.",
    model:
      "Dear Principal Moreno,\n\nI am writing this open letter on behalf of many students who have asked me to share it in the newsletter. We would like the school to open a quiet room at lunchtime, where students can study, read or simply rest.\n\nFor many of us, lunch is the loudest part of the day. The cafeteria holds four hundred students at once, and the hallways are crowded and noisy. Some students enjoy this, and they should keep it. But others find it exhausting, especially those who are anxious, who have long bus rides or who need to catch up on work. At present, they have nowhere to go. The library is closed at lunch, and students are not allowed to stay in classrooms.\n\nWe are not asking for anything expensive. An empty classroom with a few tables, a rule of silence and one adult on duty would be enough. Several students have already volunteered to help set it up and keep it tidy.\n\nWe know that supervision takes staff time, and we appreciate how much the teachers already give. Perhaps the duty could rotate, or be shared with parent volunteers.\n\nA school is not only a place where students learn; it is a place where they spend most of their waking hours. A single quiet room would tell every student that the school cares about how they feel, not only how they perform.\n\nRespectfully, The students of the lunchtime petition",
  },
  {
    task: "Write an open letter to a national leader, to be published in a newspaper, asking for better protection of the country's rivers from pollution.",
    model:
      "Dear Prime Minister,\n\nI am a seventeen-year-old student, and I live beside a river that I am no longer allowed to swim in. I am writing this open letter because I believe our rivers need your protection, and because I know I am not alone.\n\nEvery summer for the past five years, signs have gone up along our river warning that the water is unsafe. Sewage overflows after heavy rain, and runoff from farms turns the water green. The fish my grandfather used to catch are gone. Similar reports come from rivers across the country.\n\nI understand that cleaning rivers is expensive and that water companies and farmers face real costs. I do not want them to be punished unfairly. But the cost of doing nothing is already being paid, by people who cannot swim, by fishermen who cannot fish and by the wildlife that is disappearing.\n\nI ask your government to set strict limits on sewage releases, to fund farmers who protect riverbanks, and to publish water quality reports that everyone can read.\n\nRivers are not only a resource. They are the places where many of us first learned to love the natural world. If we lose them, we lose part of what makes this country worth living in. I hope that when I have children, they will be able to swim where I could not.\n\nYours faithfully, A student from the river valley",
  },
  {
    task: "Write an open letter to the managers of a social media app, to be shared online, asking them to change features that keep young users scrolling late at night.",
    model:
      "To the managers of the app,\n\nLike millions of teenagers, I use your app every day. I enjoy it, and I am not writing to ask you to shut it down. I am writing this open letter to ask you to change the features that keep young users awake long after they should be asleep.\n\nYour app is designed so that the feed never ends. Videos play one after another without any choice, and notifications arrive late into the night. These features work exactly as intended: they keep people watching. But for teenagers who need nine hours of sleep and have school in the morning, they come at a high cost. Many of my friends tell me they regularly scroll until one or two in the morning, then struggle through the next day.\n\nI understand that your business depends on attention, and that you compete with other apps. But a company can make money without harming its youngest users.\n\nI ask you to turn off autoplay at night for users under eighteen, to pause notifications after ten o'clock, and to show a gentle reminder when someone has been scrolling for an hour.\n\nThese changes are small, and they would show that you care about the people who use your app, not only about how long they use it. The best way to keep young users is to earn their trust, and the generation you protect now will remember it.\n\nSincerely, A user who would like to sleep",
  },
  {
    task: "Write an open letter to the owner of a historic cinema in your town, to be published locally, asking them not to sell the building to be turned into apartments.",
    model:
      "Dear Mr. Haddad,\n\nI have heard that you are considering selling the Regent Cinema to a developer who plans to turn it into apartments. I am writing this open letter, which several neighbors have signed, to ask you to look for another way.\n\nI know the cinema has struggled. Fewer people go to the movies than before, and an old building is expensive to heat and repair. No one in town has the right to ask you to lose money. But I hope you will consider what the Regent means to the people who have grown up with it.\n\nFor ninety years, it has been the place where this town gathers. My grandparents went on their first date there. My class watched our first film on a field trip there. On Saturday mornings, the children's showings are full. Its painted ceiling and red curtains are part of the town's history, and once they are gone, they cannot be rebuilt.\n\nThere may be other options. The cinema could become a community trust, supported by members and local businesses, or it could host concerts, lectures and school events alongside films. Many people would volunteer to help.\n\nApartments can be built anywhere. A place where a whole town has laughed and cried together cannot. I hope you will give us the chance to help keep the lights of the Regent on.\n\nWith respect, A neighbor and a regular",
  },
  {
    task: "Write an open letter to a city's transport authority, to be published online, asking for safe bike lanes on the route to the city's largest high school.",
    model:
      "To the City Transport Authority,\n\nEvery morning, about two hundred students ride their bicycles along Station Road to Central High School. Most of us ride in traffic, between parked cars and buses, on a road with no bike lane. I am writing this open letter to ask you to build one before someone is seriously hurt.\n\nLast year, three students from our school were struck by cars on Station Road. One spent a month in hospital. Many parents now refuse to let their children ride, so they drive them instead, which makes the traffic even worse.\n\nI understand that a bike lane would take space from parking and that shop owners worry about losing customers. Their concern deserves an answer. But studies in other cities have found that bike lanes often bring more customers to local shops, not fewer, because people on bicycles stop more often than people in cars.\n\nI ask you to build a protected bike lane on Station Road, separated from traffic by a curb or posts, and to lower the speed limit near the school.\n\nYou often say that you want a cleaner, healthier city. The students who ride to school each day are already doing their part. Please give us a road that lets us do it safely. A city that protects its youngest riders is building the habits of the next generation.\n\nRespectfully, A student cyclist at Central High",
  },
  {
    task: "Write an open letter to the organizers of a music festival, to be shared on social media, asking them to make the festival accessible to people who use wheelchairs.",
    model:
      "Dear Festival Organizers,\n\nMy older brother has loved your festival for years. He knows every band on this year's program. He uses a wheelchair, and last year he left after two hours because he could not reach the main stage, the food stands or the toilets. I am writing this open letter to ask you to make the festival open to people like him.\n\nI know that a festival in a field is hard to plan, and I am grateful for everything you already do to keep the crowds safe. But at present, the paths are muddy grass, the viewing areas are only reachable by stairs, and there is just one accessible toilet for a crowd of twenty thousand.\n\nThese problems can be solved. Other festivals lay temporary metal tracks across the grass, build raised viewing platforms with ramps, and offer accessible camping near the entrance. Some even let a companion enter free.\n\nMaking these changes would not only help wheelchair users. Parents with strollers, older fans and anyone with an injury would benefit too.\n\nYour festival says it is about bringing people together through music. I believe that, and that is why I am asking. Please make sure that next summer, my brother can stay until the last song with everyone else. The music is for all of us.\n\nWith hope, A fan's younger sister",
  },
  {
    task: "Write an open letter to a school board, to be published in the local paper, asking it to keep music and art classes after it proposed cutting them.",
    model:
      "To the members of the school board,\n\nYou have proposed cutting music and art classes in our district's high schools to save money for math and science. I am writing this open letter, as a student who studies both physics and the violin, to ask you to keep them.\n\nI understand why you made the proposal. Test scores in math have fallen, and you want to give students the best chance to succeed. I share that goal. But cutting the arts will not reach it.\n\nMusic and art are not a break from serious learning; they are part of it. Learning to read music trains the same attention to pattern that algebra needs. Drawing teaches students to observe carefully, which every scientist must do. For many students, art and music classes are the reason they come to school at all. Without them, some will simply stop trying.\n\nThere are other ways to save money. The district could share teachers between schools, or ask local arts groups to help.\n\nEvery great society is remembered not only for its inventions but for its art. The students in our schools today will be the engineers and doctors of tomorrow, but they will also be the people who write its songs and paint its walls. Please do not ask them to choose. Keep the arts, and you keep the reason many of us love to learn.\n\nYours sincerely, A student in the orchestra and the physics club",
  },
  {
    task: "Write an open letter to the owners of a factory near your town, to be published in the local paper, asking them to reduce the noise and smoke the factory produces at night.",
    model:
      "Dear Owners of the Northfield Plant,\n\nI live four streets from your factory, and I am writing this open letter on behalf of the families who live near it. We are asking you to reduce the noise and smoke the plant produces at night.\n\nYour factory has been part of our town for decades. It employs many of our parents, and we know how much the town depends on it. We are not asking you to close or to cut jobs. But since the night shift began last year, the noise of the machines has kept many children awake, and on still nights the smoke settles over our houses with a sharp smell that makes it hard to breathe.\n\nSeveral neighbors have already complained, and some have seen doctors about coughs that began this year. We do not know for certain that the smoke is the cause, but we would like to know it is safe.\n\nWe ask you to build sound barriers around the night machinery, to run the loudest work during the day where possible, and to publish regular tests of the air near the plant.\n\nA good neighbor is not one who never makes noise; it is one who listens when the neighbors speak. You have been part of this town for a long time. We hope you will help make sure that it remains a place where your own workers can sleep at night.\n\nSincerely, A family on Mill Street",
  },
  {
    task: "Write an open letter to a group of world leaders meeting at a climate conference, to be published online, asking them to act for the young people who will live with their decisions.",
    model:
      "To the leaders at the climate conference,\n\nYou are meeting this week to decide how the world will respond to climate change. I am sixteen years old. Most of you will not live to see the year 2080, but I will, and so will millions of people my age. I am writing this open letter to ask you to make your decisions as if we were in the room.\n\nI know that the choices before you are difficult. Cutting emissions costs money and jobs, and you answer to voters who are worried about prices today. I do not think you are careless. But each conference ends with promises that are delayed until the next one, and each year the cost of waiting grows.\n\nAlready, my generation has seen record heat, floods and fires. We study for exams knowing that the world we are preparing for is changing faster than any textbook. We are not asking for miracles. We are asking for clear targets, real funding for poorer countries and honest reports of progress every year.\n\nYou speak often about the future. For us, it is not an idea; it is where we will spend our lives.\n\nHistory will remember this conference by what it did, not what it said. I hope that when my own children ask what happened in this decade, I can tell them that the leaders finally listened, and acted.\n\nRespectfully, A student who will be here in 2080",
  },
  {
    task: "Write an open letter to a museum, to be shared online, asking it to return an object taken from another country during a war.",
    model:
      'Dear Director of the National Museum,\n\nIn your third gallery stands a carved wooden door from a temple in a country your army occupied more than a century ago. The label says it was "acquired" in 1902. I am writing this open letter to ask you to return it to the people it was taken from.\n\nI understand that museums care for objects that might otherwise be lost, and that your staff have preserved this door with great skill. I also know that returning it raises hard questions about other objects in your collection. But the history is clear. The door was taken by soldiers during a war, from a community that did not agree to give it up. Calling that an acquisition does not change what happened.\n\nThe community that built the temple still exists. Its leaders have asked for the door\'s return several times. They have a museum ready to receive it and care for it.\n\nYou could make the return an act of partnership rather than loss: a shared exhibition, a loan of other objects, a public ceremony. Other museums have done this and been praised for it.\n\nA museum teaches people about history. By returning the door, you would teach the most important lesson of all: that it is never too late to correct a wrong. I hope you will be brave enough to teach it.\n\nRespectfully, A visitor who read the label',
  },
];

/** worldsBank gives a situation in which a character crosses between two worlds. */
const worldsBank: readonly WritingItem[] = [
  {
    task: "Write a short narrative, in the third person, about a girl who moves to a new country and spends her first day at a school where she does not yet speak the language well. Let the reader hear her thoughts without quotation marks.",
    model:
      'Lin stood at the classroom door with her new backpack pressed against her chest. Thirty faces turned to look at her. The teacher said something warm and quick, and the class laughed, and Lin smiled because everyone else was smiling. Had the joke been about her? Surely not. Probably not.\n\nShe sat where the teacher pointed, beside a boy with a pencil behind his ear. He whispered something. She caught only the word "name."\n\n"Lin," she said, too loudly, and her cheeks went hot.\n\nAt home, in her old city, she had been the girl who answered every question first. Here she was a girl who could not follow the instructions for opening a textbook. Her mother had promised it would get easier. Her mother promised a lot of things.\n\nAt lunch she sat alone with the dumplings her grandmother had packed, and she could feel the other children looking at the smell. She almost put them away. Then the boy with the pencil sat down across from her, pointed at the dumplings and raised his eyebrows.\n\nShe pushed one toward him. He tasted it and his eyes went wide. "Good," he said, slowly, as if she were a child.\n\nWell. She would teach him a better word than good. Tomorrow, perhaps. She had a whole year to learn his.',
  },
  {
    task: "Write a short narrative, in the third person, about a boy who leaves his family's farm to work in a big city for the first time. Let the reader hear his thoughts without quotation marks.",
    model:
      "The city began long before the bus reached it. First came the warehouses, then the billboards, then streets so full of cars that the bus barely moved. Tomas pressed his forehead to the window. So many people, and not one of them looking up.\n\nAt home, the morning would be starting now. His father would be walking to the barn, the dog at his heels, the sky turning grey over the hills. Here the sky was a narrow strip between buildings, and it was already the color of dishwater.\n\nThe job was in a warehouse that never closed. A man with a clipboard showed him the shelves, the scanner and the clock where he would punch in. He spoke fast. Tomas nodded at everything.\n\nBy the end of the first shift, his feet ached in a way they never had after a day in the fields. On the farm the work was hard, but it ended when the light ended. Here the lights never went out. How did anyone know when they were tired?\n\nThat night, in the rented room, he called home. His mother asked if he was eating properly. Yes, he said. Lies were easier on the phone.\n\nAfterward he lay awake listening to the traffic. Somewhere under all that noise, perhaps, there was a sound like the wind in the barley. He would listen for it. He had six months to find it.",
  },
  {
    task: "Write a short narrative, in the third person, about a teenager who visits her grandparents' village in the country her parents left before she was born. Let the reader hear her thoughts without quotation marks.",
    model:
      "The village was smaller than the photographs. Maya had expected that. What she had not expected was how everyone already knew her name.\n\nOld women stopped her grandmother in the lane and held Maya's face between their hands. They said things she half understood, in the language her parents used only when they argued. You look like your father, one said. You have your grandmother's eyes, said another. How could they all see so much in a face they had never seen?\n\nAt home, in the city, she was the girl with the strange lunch and the name teachers mispronounced. Here she was the granddaughter who could not speak properly. Too foreign there, too foreign here. Was there anywhere she was simply Maya?\n\nThat evening her grandfather took her up the hill behind the house. He did not say much; his words were as slow as his walk. At the top, he pointed down at the roofs, the fields and the river, and then at a small stone house with a broken gate.\n\nYour father, he said, in careful English. Born there.\n\nMaya looked at the house for a long time. It was only a house, small and ordinary. And yet something in her went quiet, the way it did when a song she had forgotten came back.\n\nPerhaps she did not have to choose. Perhaps she could carry both.",
  },
  {
    task: "Write a short narrative, in the third person, about a boy from a poor neighborhood who wins a scholarship to a wealthy private school. Let the reader hear his thoughts without quotation marks.",
    model:
      "The school had a gate with gold letters, and a man in a uniform who opened it. Daniel had never had a door opened for him in his life. He walked through quickly, before the man could change his mind.\n\nEverything inside was clean. The floors shone, the lockers had no dents, and the boys in his class wore shoes that had clearly never been worn by anyone else. He tucked his feet under his chair.\n\nIn the first lesson, the teacher asked where everyone had spent the summer. Switzerland. A sailing camp. Our house in France. When it came to Daniel, he said, At home, and someone laughed, though not unkindly. As if home were a joke.\n\nHe did not tell them about the summer job at the car wash, or the evenings looking after his little sisters while his mother worked late. What would they know about any of that?\n\nAt lunch he sat at the end of a table and ate quickly. Then a boy named Oliver, who had sailed all summer, asked him how he had solved the entrance exam's last problem. No one had been able to do it.\n\nDaniel explained. Oliver listened, then shook his head slowly. That's brilliant, he said.\n\nOn the bus home, Daniel watched the neighborhoods change outside the window, the houses growing smaller and closer together. Brilliant. He turned the word over and over. It fit better than he had expected.",
  },
  {
    task: "Write a short narrative, in the third person, about an elderly man who must move from his own house into his daughter's busy family home. Let the reader hear his thoughts without quotation marks.",
    model:
      "They had given him the room above the garage. It was a nice room, his daughter said, with its own little bathroom and a window over the garden. Frank put his suitcase on the bed and looked at the walls. Nice. Everything was nice.\n\nIn his own house, the mornings had been silent. He would make his coffee, read the paper from front to back and listen to the clock. Here, the mornings began at six with shouting. Someone could not find a shoe. Someone had eaten the last of the cereal. The dog barked at the school bus as if it were an invader.\n\nHe came down to the kitchen and stood in the doorway, not sure where to put himself. His daughter kissed his cheek on her way past. Sit down, Dad, she said, and then she was gone.\n\nHe sat. He was good at sitting now. Forty years as an engineer, and now his skill was staying out of the way.\n\nThat afternoon, his granddaughter came home and threw her bag on the floor. Her bicycle chain had come off again, she said, and nobody ever had time to fix it.\n\nFrank stood up. His knees complained, but he ignored them.\n\nIn the garage, with the bicycle upside down between them, she watched his hands. Show me, she said.\n\nWell, now. Perhaps there was a place for him here after all.",
  },
  {
    task: "Write a short narrative, in the third person, about a teenage refugee who arrives at a camp after a long journey. Let the reader hear her thoughts without quotation marks.",
    model:
      "The camp was a field of white tents that went on until the hills. Amira had imagined it many times on the journey, in the back of trucks and on the deck of the boat. She had imagined walls, or a gate, or at least a door. It was only tents, and mud, and a long line of people waiting for blankets.\n\nHer little brother held her hand so tightly that her fingers had gone numb. She did not tell him to loosen it.\n\nAt home, there had been a blue door and a lemon tree in the yard. Her mother used to sit under it shelling peas. Was the tree still there? Was the door? She tried not to think about who might be sitting under the tree now.\n\nA woman in a vest gave them a tent number and a bag with soap, a toothbrush and a thin blanket. She spoke Arabic with an accent from somewhere else, and she smiled with her whole face. Welcome, she said.\n\nWelcome. As if this were a place one came to on purpose.\n\nThat night, in the tent, her brother asked if they would go home soon. Amira looked at the canvas above them, glowing faintly in the light from the camp's lamps.\n\nSoon, she said. She did not know if it was a lie. But she pulled the thin blanket over both of them and began to tell him about the lemon tree, so that at least one of them would remember it.",
  },
  {
    task: "Write a short narrative, in the third person, about a young athlete who leaves her small town to train with a national team in the capital. Let the reader hear her thoughts without quotation marks.",
    model:
      "The training center was bigger than Kira's whole school. It had three pools, a gym full of machines she did not know the names of, and a dining hall where a nutritionist weighed every portion. On the first morning, Kira stood on the pool deck in her old swimsuit, the one with the faded club logo, and tried not to stare.\n\nAt home she had been the fastest swimmer in the county. People stopped her in the supermarket to congratulate her. Here, every girl in the pool had been the fastest swimmer somewhere.\n\nThe coach blew a whistle and they dove in. Kira swam hard. By the fourth length she was last, and by the sixth she could taste blood. Was this what it felt like to be ordinary?\n\nThat night she called her mother and said everything was great. Then she lay in the narrow bed and cried quietly, so her roommate would not hear.\n\nIn the morning, the roommate, a tall girl from the coast, sat beside her at breakfast. You did a good turn yesterday, she said. On the wall. Coach noticed.\n\nKira looked up. Had he?\n\nShe finished her measured portion of porridge and walked to the pool. The water was cold and bright. She had been the best in a small place. Now, it seemed, she would have to learn to be good in a large one. She dove in first.",
  },
  {
    task: "Write a short narrative, in the third person, about a boy who goes to live with his father after years with his mother, in a very different kind of home. Let the reader hear his thoughts without quotation marks.",
    model:
      "His mother's apartment had been small and loud, with music always playing and friends always dropping by. His father's house was large and silent. Even the refrigerator hummed quietly, as if it had been told to.\n\nSam carried his bag up the stairs to the room his father had prepared. The walls were freshly painted. There was a desk, a lamp and a shelf of books chosen, apparently, for a boy much younger than him. Picture books. Did his father think he was still seven?\n\nAt dinner they sat at opposite ends of a long table. His father asked about school. Sam said it was fine. His father nodded and cut his meat into small, careful squares. The clock ticked. At his mother's, nobody had ever heard a clock.\n\nHe missed her laugh. He missed the way she sang off-key while she cooked. He missed being somewhere he did not have to be polite.\n\nAfter dinner, he found his father in the garage, bent over an old guitar with two broken strings. It was mine, his father said, without looking up, when I was your age. I was going to fix it for you.\n\nSam stood there for a moment. Then he picked up one of the new strings. Show me how, he said.\n\nHis father looked at him, surprised, and for the first time that day, he smiled. Perhaps the house was not as silent as it seemed.",
  },
  {
    task: "Write a short narrative, in the third person, about a girl who begins working at her family's restaurant after school and sees her parents in a new way. Let the reader hear her thoughts without quotation marks.",
    model:
      "For sixteen years, Grace had thought of the restaurant as the place that took her parents away. They left before she woke and came home after she slept. On her birthday, there had been a cake, but her father had been at the stove.\n\nNow she was old enough to help, and on her first Friday night she stood behind the counter in an apron that was too big. The orders came in faster than she could read them. Table six wanted no onions. Table nine had been waiting twenty minutes. Someone was shouting about a spilled soup.\n\nAnd there, in the middle of it, was her mother, calm as a lake, taking three orders at once and remembering every one. How had Grace never seen this?\n\nIn the kitchen her father moved between six pans like a dancer. He tasted, stirred, flipped and plated without a wasted step. The cooks watched him and copied him. He did not look tired. He looked happy.\n\nAt midnight, when the last customer left, the three of them sat at a corner table and ate the leftover noodles. Her father asked how she had liked it.\n\nIt was awful, she said, and then, after a moment, You were amazing.\n\nHe laughed. Her mother squeezed her hand.\n\nGrace looked around at the empty restaurant, the chairs on the tables, the warm smell of garlic. All these years, she had thought it took her parents away. Perhaps it had been where they were all along.",
  },
  {
    task: "Write a short narrative, in the third person, about a deaf teenager who joins a hearing family's holiday dinner for the first time. Let the reader hear his thoughts without quotation marks.",
    model:
      "The dining room was full of moving mouths. Ben watched them all, trying to follow, but the conversation went too fast and in too many directions. Jake's uncle told a story with big gestures, and everyone laughed. Ben laughed a second too late.\n\nHe had known Jake since the start of the school year. At school they wrote notes, and Jake had learned enough sign language to make Ben laugh with terrible jokes. But Jake's family did not sign. They spoke slowly and loudly at him, as if loudness could help.\n\nAt home, dinner was a different world. His parents and his sister were deaf too, and their hands moved across the table as freely as voices. Nobody was left out. Nobody had to wait to be told what was funny.\n\nHere, he waited.\n\nThen Jake's little sister, who could not have been more than six, tugged his sleeve. She held up her hands and made a clumsy shape. It took him a second to recognize it. Turkey. She had learned it from Jake, she wrote on her napkin, just for today.\n\nBen stared at her, and then he signed the word back properly, slowly, so she could see. She copied him, beaming. Then she pointed at the potatoes and raised her eyebrows.\n\nHe showed her that one too. Across the table, Jake was grinning. Perhaps he did not have to wait after all. Perhaps, sometimes, the world could learn to speak to him.",
  },
  {
    task: "Write a short narrative, in the third person, about a city girl who spends a summer working on her aunt's sheep farm in the mountains. Let the reader hear her thoughts without quotation marks.",
    model:
      "On the first morning, her aunt woke her at five. Five! Zoe lay in the narrow bed and listened to the rain on the roof and the sheep complaining somewhere outside. Back in the city, her friends would not be awake for another six hours.\n\nShe pulled on borrowed boots and went out into the mud. The air smelled of wet grass and animals. There was no phone signal, no traffic, no music from the apartment next door. Just wind, and a dog that ran circles around her as if she were a lost sheep.\n\nThe work was endless. Water, fences, feed, fences again. By noon her arms ached and her jeans were ruined. Her aunt barely spoke. Was this how people actually lived?\n\nIn the second week, a ewe gave birth in the night, and her aunt woke her to help. In the barn, under a single bulb, Zoe held a lamp while her aunt eased the lamb into the world. It lay wet and still, and then it shook its head and bleated.\n\nZoe found she was crying. Her aunt did not comment. She only handed her a towel and showed her how to rub the lamb warm.\n\nAt the end of the summer, back in the city, Zoe woke at five on the first morning without an alarm. She lay listening to the traffic and, beneath it, something she could almost hear: the wind on the mountain, and a lamb calling.",
  },
  {
    task: "Write a short narrative, in the third person, about a teenager who starts a new life with an adoptive family after years in foster care. Let the reader hear his thoughts without quotation marks.",
    model:
      "The house had a name on the mailbox, and now it was his name too. Marcus read it three times as the car pulled into the driveway. It looked strange, like a word in another language.\n\nHe had lived in five homes in six years. He knew how it went. First everyone was kind, then the kindness became tired, and then one day a social worker came with a cardboard box for his things. He had learned not to unpack all the way.\n\nHis new mother showed him his room. It had a blue bedspread and a desk by the window, and on the desk was a framed photograph of the three of them from the court, all smiling. He had not known anyone took that picture.\n\nThat night he left most of his clothes in the bag, just in case.\n\nIn the morning, his new father knocked and asked if he wanted to help with breakfast. In the kitchen, there was a row of hooks by the door, each with a mug hanging from it. Four mugs. Three had names painted on them. The fourth was new, and it said Marcus.\n\nHe stood looking at it for a long time. A mug was such a small thing. You did not paint a name on something you planned to give back.\n\nAfter breakfast, he went upstairs and unpacked the bag, all the way to the bottom.",
  },
];

/** judgedTopics11b are the second writing topics of grade 11 judged by a model. */
export const judgedTopics11b: readonly TopicDef[] = [
  {
    id: "writing-an-open-letter",
    title: t("Writing an Open Letter", "写公开信"),
    summary: t(
      "Write an open letter addressed to a person or a group in power but meant for the public, making a respectful case and ending with a view of why it matters.",
      "写一封写给某个掌权者或群体、却面向公众的公开信，以尊重的态度陈述理由，并以说明此事为何重要的视野作结。",
    ),
    prerequisites: after("conclusions-that-widen-the-view", "writing-a-letter-to-a-leader"),
    encompasses: covers(0.2, "conclusions-that-widen-the-view"),
    xp: 24,
    strand: "writing",
    criteria: ["g11-open-letter-audience", "g11-open-letter-case", "g11-open-letter-ending"].map(criterion),
    knowledgePoints: [
      point(
        "two-audiences",
        t("Two Audiences", "两类读者"),
        t(
          "An open letter has **two audiences**: the person it names and the public who will read it. Address the first directly and respectfully, say why you are writing in public, and acknowledge their position fairly: *I understand that the budget is tight, and I do not doubt that you weighed the choice carefully.*",
          "公开信有**两类读者**：信中称呼的人，以及将会读到它的公众。要直接而尊重地称呼前者，说明你为什么公开写信，并公正地承认对方的立场：*I understand that the budget is tight, and I do not doubt that you weighed the choice carefully.*",
        ),
        writingGenerator(
          t(
            "Write the open letter in English, addressing the named reader respectfully, saying why you write in public and acknowledging their position.",
            "用英语写这封公开信，尊重地称呼收信人，说明你为什么公开写信，并承认对方的立场。",
          ),
          letterBank,
          ["g11-open-letter-audience", "g11-open-letter-case", "g11-open-letter-ending"],
          limits,
          onePiece,
        ),
      ),
      point(
        "the-case-and-the-close",
        t("The Case and the Close", "理由与结尾"),
        t(
          "Then make the **case** with specific facts and a clear, practical request: *I ask you to build a protected bike lane on Station Road.* Close by widening the view to what is at stake for everyone: *A town shows what it values by what it keeps.*",
          "然后用具体的事实和明确、可行的请求来陈述**理由**：*I ask you to build a protected bike lane on Station Road.* 结尾要把视野拓宽到此事对所有人的意义：*A town shows what it values by what it keeps.*",
        ),
        writingGenerator(
          t(
            "Write the open letter in English, supporting a specific request with facts and ending by showing what is at stake beyond the letter.",
            "用英语写这封公开信，用事实支持一个具体的请求，并在结尾说明此事在信之外的意义。",
          ),
          letterBank,
          ["g11-open-letter-case", "g11-open-letter-ending", "g11-open-letter-audience"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-narrative-of-two-worlds",
    title: t("Writing a Narrative of Two Worlds", "写两个世界之间的叙事"),
    summary: t(
      "Write a third-person narrative about a character caught between two worlds, using free indirect discourse to let the reader hear the character's thoughts and showing a change by the end.",
      "写一篇第三人称叙事，讲述一个夹在两个世界之间的人物，用自由间接引语让读者听到人物的想法，并在结尾呈现一个变化。",
    ),
    prerequisites: after("free-indirect-discourse", "writing-a-coming-of-age-narrative"),
    encompasses: covers(0.2, "free-indirect-discourse"),
    xp: 24,
    strand: "writing",
    criteria: ["g11-worlds-contrast", "g11-worlds-inner-voice", "g11-worlds-change"].map(criterion),
    knowledgePoints: [
      point(
        "the-two-worlds",
        t("The Two Worlds", "两个世界"),
        t(
          "Set the **two worlds** side by side in concrete details: the new place the character faces now, and the old one they remember. *At home, the morning would be starting now. His father would be walking to the barn. Here the sky was a narrow strip between buildings.*",
          "用具体细节把**两个世界**并列：人物现在面对的新地方，以及他们记忆中的旧地方。*At home, the morning would be starting now. His father would be walking to the barn. Here the sky was a narrow strip between buildings.*",
        ),
        writingGenerator(
          t(
            "Write the narrative in English, in the third person, contrasting the new world and the remembered one in concrete details.",
            "用英语以第三人称写这篇叙事，用具体细节对比新世界和记忆中的世界。",
          ),
          worldsBank,
          ["g11-worlds-contrast", "g11-worlds-inner-voice", "g11-worlds-change"],
          limits,
          onePiece,
        ),
      ),
      point(
        "the-voice-within",
        t("The Voice Within", "内心的声音"),
        t(
          "Let the reader hear the character's thoughts through **free indirect discourse**, in the third person and the past tense, with no quotation marks or *he thought*: *Had the joke been about her? Surely not. Probably not.* By the end, show a **small change** in how the character sees one of the two worlds.",
          "通过**自由间接引语**让读者听到人物的想法：用第三人称和过去时，不加引号，也不用 *he thought*：*Had the joke been about her? Surely not. Probably not.* 到结尾，要呈现人物看待其中一个世界的方式发生了一个**小小的变化**。",
        ),
        writingGenerator(
          t(
            "Write the narrative in English, using free indirect discourse for the character's thoughts and ending with a small change in how the character sees things.",
            "用英语写这篇叙事，用自由间接引语呈现人物的想法，并以人物看法上的一个小变化作结。",
          ),
          worldsBank,
          ["g11-worlds-inner-voice", "g11-worlds-change", "g11-worlds-contrast"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
