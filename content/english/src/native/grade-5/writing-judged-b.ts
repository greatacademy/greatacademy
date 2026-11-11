// Grade 5: writing judged by a model, part two: a news article, a mystery, a personal narrative and a diary from
// history.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after } from "./links.ts";
import { criterion, onePiece } from "./writing-judged-a.ts";

/** newsBank gives the notes of an event to write up as a news article. */
const newsBank: readonly WritingItem[] = [
  {
    task: 'Write a news article from these notes. Notes: new Riverside Bridge opened Saturday, May 4, in Millbrook; 600 m long, suspension bridge; took three years to build; cost 40 million dollars; replaces a ferry; Mayor Ana Ruiz cut the ribbon; she said, "Today our two halves of town become one."; about 5,000 people walked across.',
    model:
      'MILLBROOK — The new Riverside Bridge opened on Saturday, May 4, joining the two sides of Millbrook across the river for the first time.\n\nMayor Ana Ruiz cut the ribbon at ten o\'clock in the morning. "Today our two halves of town become one," she said. About 5,000 people then walked across the bridge.\n\nThe 600-meter suspension bridge took three years to build and cost 40 million dollars. It replaces the ferry that carried cars and people across the river for more than fifty years.',
  },
  {
    task: 'Write a news article from these notes. Notes: engineers tested the new Harbor Bridge on Tuesday; 40 loaded trucks drove onto it at once; it bent less than 3 cm, well within safe limits; tests checked 2,000 bolts; chief engineer Lena Park said, "The bridge did exactly what we designed it to do."; it will open to traffic on June 1.',
    model:
      'Engineers tested the new Harbor Bridge on Tuesday by driving forty loaded trucks onto it at once, and the bridge passed the test.\n\nUnder the weight of the trucks, the bridge bent less than three centimeters, well within safe limits. "The bridge did exactly what we designed it to do," said chief engineer Lena Park.\n\nThe engineers also checked all 2,000 of the bridge\'s bolts during the test. The Harbor Bridge will open to traffic on June 1.',
  },
  {
    task: 'Write a news article from these notes. Notes: the old clock tower in Fairview was reopened Friday after two years of repairs; it was damaged in an earthquake; workers strengthened it with steel beams inside; it is now built to survive a stronger earthquake; tower is 120 years old; architect Omar Diaz said, "We kept every original brick we could."; visitors can climb it on weekends.',
    model:
      'FAIRVIEW — The town\'s 120-year-old clock tower reopened on Friday after two years of repairs following an earthquake.\n\nWorkers strengthened the tower by fitting steel beams inside its walls. As a result, it is now built to survive an earthquake stronger than the one that damaged it.\n\n"We kept every original brick we could," said architect Omar Diaz, who led the work. Visitors will be able to climb the tower on weekends.',
  },
  {
    task: 'Write a news article from these notes. Notes: a new 52-story tower in the city center passed its wind test on Monday; engineers used a model in a wind tunnel; it was built to sway up to 50 cm at the top in a storm; a heavy weight near the top slows the swaying; engineer Rosa Kim said, "People inside will hardly feel a thing."; the tower will open next spring.',
    model:
      'A new 52-story tower in the city center passed its wind test on Monday, engineers announced.\n\nThe engineers tested a model of the tower in a wind tunnel. They found that in a strong storm, the top of the tower will sway no more than 50 centimeters. A heavy weight near the top slows the swaying. "People inside will hardly feel a thing," said engineer Rosa Kim.\n\nThe tower is scheduled to open next spring.',
  },
  {
    task: 'Write a news article from these notes. Notes: a footbridge across Pine Creek in Oakdale was closed Wednesday after inspectors found a crack in one beam; no one was hurt; the bridge is 70 years old; repairs will take about six weeks; a free bus will carry walkers around; inspector Sam Lee said, "We closed it before the crack could become dangerous."',
    model:
      'OAKDALE — The footbridge across Pine Creek was closed on Wednesday after inspectors found a crack in one of its beams. No one was hurt.\n\n"We closed it before the crack could become dangerous," said inspector Sam Lee.\n\nThe bridge is 70 years old. Repairs are expected to take about six weeks. Until then, a free bus will carry walkers around the creek.',
  },
  {
    task: 'Write a news article from these notes. Notes: students at Lincoln School built a bridge out of 2,000 craft sticks; it held 180 kg in a contest on Thursday, the most of 30 schools; the team had 5 students in grade 5; they spent two months on it; team captain Maya Chen said, "We learned that triangles are the strongest shape."; they won a trophy and a visit to a real bridge site.',
    model:
      'A team of five fifth graders from Lincoln School won a bridge-building contest on Thursday with a bridge made of 2,000 craft sticks.\n\nThe team\'s bridge held 180 kilograms before it broke, more than the bridges of any of the 30 schools that entered. The students spent two months building it. "We learned that triangles are the strongest shape," said team captain Maya Chen.\n\nThe team won a trophy and a visit to the site of a real bridge.',
  },
  {
    task: 'Write a news article from these notes. Notes: the new city library, with a glass dome, opened Monday in Westfield; the dome is 30 m wide; it lets in sunlight so fewer lights are needed; the building took two years; librarian Grace Mbeki said, "Reading under the sky is something special."; 3,000 visitors came on the first day; it has 200,000 books.',
    model:
      'WESTFIELD — The city\'s new library, crowned by a glass dome 30 meters wide, opened on Monday, and 3,000 visitors came on its first day.\n\nThe dome lets sunlight pour into the reading room, so fewer lights are needed during the day. "Reading under the sky is something special," said librarian Grace Mbeki.\n\nThe library took two years to build and holds 200,000 books.',
  },
  {
    task: 'Write a news article from these notes. Notes: a tunnel under the Blue River in Granton was finished Sunday when the two digging machines met in the middle; 2 km long; will carry trains; took four years; the machines met within 2 cm of each other; project leader Kemi Adeyemi said, "Four years of measuring came down to two centimeters."; trains will run from next year.',
    model:
      'GRANTON — Workers finished digging the tunnel under the Blue River on Sunday, when the two giant digging machines met in the middle.\n\nThe machines had started from opposite banks four years ago, yet they met within two centimeters of each other. "Four years of measuring came down to two centimeters," said project leader Kemi Adeyemi.\n\nThe tunnel is two kilometers long and will carry trains. Trains are expected to run through it from next year.',
  },
  {
    task: 'Write a news article from these notes. Notes: the old Mill Road bridge in Halton was moved in one piece on Saturday; it is 150 years old, made of iron; moved 300 m on rollers to a park; a new wider bridge will be built in its place; it took 10 hours; historian Ruth Obi said, "This bridge is part of our town\'s story."; about 1,000 people watched.',
    model:
      'HALTON — The 150-year-old iron bridge on Mill Road was moved in one piece on Saturday to make room for a new, wider bridge.\n\nWorkers rolled the bridge 300 meters to a nearby park, a job that took ten hours. About 1,000 people gathered to watch. "This bridge is part of our town\'s story," said historian Ruth Obi.\n\nThe old bridge will stay in the park, and a new bridge will be built where it used to stand.',
  },
  {
    task: 'Write a news article from these notes. Notes: a wooden tower 80 m tall, the tallest wooden building in the country, passed a fire test on Wednesday in Brookfield; a section of its thick wooden walls burned for two hours but still held its weight; the wood chars on the outside, protecting the inside; engineer Felix Grant said, "Thick wood burns slowly, like a log in a campfire."; people will move in this autumn.',
    model:
      'BROOKFIELD — An 80-meter wooden tower, the tallest wooden building in the country, passed a fire test on Wednesday.\n\nDuring the test, a section of the tower\'s thick wooden walls burned for two hours but still held its weight. The outside of the wood turns to char, which protects the wood inside. "Thick wood burns slowly, like a log in a campfire," said engineer Felix Grant.\n\nThe first residents will move into the tower this autumn.',
  },
  {
    task: 'Write a news article from these notes. Notes: the Seaview lighthouse was relit Friday night after 40 years dark; volunteers spent three years repairing it; new LED lamp seen 30 km out to sea; it will guide fishing boats into the harbor; volunteer leader Ida Moss said, "The light is home again."; the town held a celebration with music.',
    model:
      'SEAVIEW — The Seaview lighthouse shone again on Friday night for the first time in 40 years.\n\nVolunteers spent three years repairing the lighthouse. Its new LED lamp can be seen 30 kilometers out to sea and will guide fishing boats into the harbor. "The light is home again," said volunteer leader Ida Moss.\n\nThe town celebrated the relighting with music near the harbor.',
  },
  {
    task: 'Write a news article from these notes. Notes: a dam above Elm Valley was repaired after cracks were found last winter; the work finished Thursday; the dam holds back a lake for 20,000 homes; 1,500 tonnes of new concrete were added; engineer Jun Park said, "The dam is now stronger than the day it was built."; the lake will be refilled over the summer.',
    model:
      'Repairs to the dam above Elm Valley were finished on Thursday, after cracks were found in the dam last winter.\n\nWorkers added 1,500 tonnes of new concrete to strengthen the dam, which holds back the lake that supplies water to 20,000 homes. "The dam is now stronger than the day it was built," said engineer Jun Park.\n\nThe lake, which was partly drained for the work, will be refilled over the summer.',
  },
];

/** mysteryBank sets up a mystery to be written. */
const mysteryBank: readonly WritingItem[] = [
  {
    task: "Write a short mystery of several paragraphs about a prize pie that vanishes from a window sill. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      'On the morning of the fair, Mrs. Hale set her blueberry pie on the window sill to cool. When she came back, the sill was empty except for a few crumbs.\n\nNora looked around. Her little brother Ben had blue juice on his fingers, and he was hiding behind the sofa. "It wasn\'t me!" he cried. Everyone stared at him.\n\nBut Nora noticed that the crumbs led not into the house but along the sill and down the drainpipe. Below, in the soft mud, were small paw prints with five long toes. Then she remembered that Ben had been painting with blue paint all morning.\n\nNora followed the prints to the old oak tree. High in a branch, a raccoon was licking its paws, with the empty pie tin beside it.',
  },
  {
    task: "Write a short mystery of several paragraphs about a school trophy that goes missing the night before an assembly. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      'The gold soccer trophy was gone. Yesterday it had stood in the glass case by the gym; this morning the case was empty, and the assembly was in an hour.\n\nLeo noticed three things. The case was not broken but unlocked. There was a smear of silver polish on the glass. And a new student, Marco, had been seen near the gym after school, looking nervous.\n\nThe principal frowned at Marco, but Leo shook his head. Marco had been at the dentist; the nervous look was just his swollen cheek. The polish was the real clue.\n\nLeo went to Mr. Grant, the janitor, who had the only key. Mr. Grant laughed and pulled the trophy from his cart. "I wanted it shining for the big day," he said, holding up a tin of silver polish.',
  },
  {
    task: "Write a short mystery of several paragraphs about strange knocks heard every night in an old lighthouse. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      "Every night at midnight, the knocks began: tap, tap, tap, high in the lighthouse tower. Grandpa said it was the ghost of the old keeper.\n\nIda did not believe in ghosts, but she did write things down. The knocks came only on windy nights. On calm nights, the tower was silent. And one morning she found a loose shutter at the very top, swinging on one hinge.\n\nOn the stairs she also found a small boot print, and for a moment her heart jumped. Then she saw it matched her cousin's boots; he had come up yesterday to look at the view.\n\nThat night, Ida climbed the stairs with a hammer and a nail. She fixed the shutter tight. The wind howled until morning, but the tower made no sound at all.",
  },
  {
    task: "Write a short mystery of several paragraphs about a garden whose tomatoes disappear one by one. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      "Every morning, another ripe tomato was missing from Rosa's garden. By Friday, only three were left.\n\nRosa searched for clues. The fence was tall, and its gate was latched. The missing tomatoes were always the ones hanging lowest. And on the soil were tiny holes, each about the size of a finger.\n\nHer neighbor, Mr. Ortiz, had said he loved tomatoes, and he had a ladder that could reach over the fence. Rosa's father thought he was the thief. But a ladder would have left two deep marks, and there were none.\n\nAt dawn, Rosa hid behind the shed. Out of a hole by the fence crept a rabbit. It stood on its back legs, grabbed the lowest tomato and dragged it into its burrow.",
  },
  {
    task: "Write a short mystery of several paragraphs about a dog that barks at the same spot in the yard every evening. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      "Every evening at six, Biscuit ran to the corner of the yard and barked at the ground. He never did it at any other time.\n\nSam began to watch. The barking always started just as the streetlights came on. At the corner, the grass was flattened in a small circle. And once, Sam heard a faint, high squeak coming from under the hedge.\n\nHis sister said Biscuit was barking at the neighbors' cat, which often sat on the wall. But the cat sat on the far wall, and Biscuit never looked at it.\n\nOn the seventh evening, Sam lay on the grass with a flashlight. As the streetlights flickered on, a hedgehog poked its nose out of a nest under the hedge and began its night walk. Biscuit wagged his tail and barked hello.",
  },
  {
    task: "Write a short mystery of several paragraphs about a library book that keeps being returned with a pressed flower inside. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      "Three times this month, the same book, A Field Guide to Wildflowers, had come back to the library with a pressed violet between its pages. Ms. Park, the librarian, wanted to know who was leaving them.\n\nJada helped her look. The book was always returned in the early morning drop box. The violets were always pressed at the page about the mountain trail. And each time, the borrower's card showed the same name: \"E. Wells.\"\n\nThere were two E. Wells in town: Ellie, a girl in Jada's class, and her grandmother, Edith. Everyone thought Ellie liked flowers, since she carried a flower notebook.\n\nBut Jada remembered that Edith walked the mountain trail every morning at dawn. The next day, they waited by the drop box and saw Edith slip the book inside, smiling.",
  },
  {
    task: "Write a short mystery of several paragraphs about a class pet hamster that escapes from a locked cage. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      "On Monday morning, the hamster's cage was empty, even though its door was still locked. The whole class gasped.\n\nOmar examined the cage. One of the thin bars at the back was bent a little outward. Seeds were scattered in a line along the floor toward the bookshelf. And the bag of sunflower seeds on the teacher's desk had a small hole chewed in it.\n\nSomeone said the twins had been playing with the cage on Friday and must have let Peanut out. But the door was locked, and the twins did not have the key.\n\nOmar followed the line of seeds to the bookshelf. Behind the dictionaries, curled up on a nest of shredded paper, Peanut was fast asleep, his cheeks still full of seeds.",
  },
  {
    task: "Write a short mystery of several paragraphs about muddy footprints that appear on a museum floor overnight. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      'When the museum opened on Tuesday, a trail of muddy footprints crossed the clean marble floor, from the back door to the hall of Maya masks. Yet nothing had been stolen.\n\nKira, whose mother was a guard, studied the prints. They were large boots with a deep zigzag tread. They stopped at the mask case and then turned back. And beside the case lay a small paintbrush, still wet with water.\n\nThe night guard, Mr. Bell, wore big boots too, so some people suspected him. But his boots had a smooth sole, and the prints had a zigzag.\n\nKira asked who had worked late. It was Dr. Ruiz, the museum\'s expert, who had come in from the rain to clean a mask for a show. He blushed when he saw the floor. "I forgot to wipe my boots," he said.',
  },
  {
    task: "Write a short mystery of several paragraphs about a bicycle bell that rings by itself in a shed. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      "Ting! The bell on Lucy's bicycle rang again, though the shed was locked and no one was inside.\n\nLucy looked for clues. The bell rang only in the afternoon. A thin thread was caught on the handlebar. And there was a small gap under the shed's back wall, just wide enough for a small animal.\n\nHer brother said the wind was ringing it. But the shed had no windows, and the air inside was still.\n\nLucy waited quietly by the gap. At four o'clock, a sparrow hopped in, pulled at the thread on the handlebar to take for its nest, and ting! The bell rang as the bird tugged. Lucy laughed and left a pile of soft string by the door.",
  },
  {
    task: "Write a short mystery of several paragraphs about a family's spare key that keeps moving to a different place. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      "The spare key was supposed to hang on the hook by the door. But each morning, Felix found it somewhere new: in a shoe, under the mat, once even in the fruit bowl.\n\nFelix looked closely. The key always moved during the night. It was always somewhere low, never on a high shelf. And each time, it was a little wet.\n\nHis sister was a sleepwalker, and Dad said she must be moving it. But she slept upstairs behind a gate that Dad locked every night.\n\nThe next night, Felix stayed up with a flashlight. At midnight, the family's puppy trotted to the hook, jumped, snatched the jingling key in its mouth and carried it proudly to the fruit bowl.",
  },
  {
    task: "Write a short mystery of several paragraphs about a letter from long ago found inside a wall. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      "When builders opened the wall of Aisha's old house, they found a letter signed only with the letter M. \"I hid the treasure where the sun first touches the house,\" it said.\n\nAisha studied the letter. It was dated 1890. The paper smelled of smoke. And the house's records showed that a family named Moss had lived there from 1880 to 1900.\n\nAt first, Aisha thought the treasure must be in the attic, because an old chest was up there. But the chest was empty and much newer than the letter.\n\nAt sunrise the next morning, Aisha watched where the first light fell. It touched a loose stone beside the kitchen chimney. Behind it was a tin box holding a silver spoon engraved with an M.",
  },
  {
    task: "Write a short mystery of several paragraphs about a science fair project that is ruined overnight. Set up the puzzle early, plant clues and one red herring, and solve it with the clues.",
    model:
      "On the morning of the science fair, Ana's bean plants lay flat and wilted, though they had been tall and green the night before.\n\nAna searched for clues. The soil was dry, but she had watered it. A puddle had spread under the table, and the window above it had been left open. And on the windowsill sat a fat gray pigeon, cooing.\n\nHer rival, Jake, had been jealous of her project, and some students said he had sneaked in early. But the gym doors were locked until eight.\n\nAna lifted the pot. Its bottom had a crack, and all the water had drained out. When she found the crack, she remembered the janitor had moved the tables, bumping her pot against the leg. With a new pot and water, her plants were standing again by noon.",
  },
];

/** personalBank asks for a true story about a challenge the writer faced. */
const personalBank: readonly WritingItem[] = [
  {
    task: "Write a true story of several paragraphs about a time you were afraid to try something new. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      'Last summer, my family went to a lake with a high wooden diving board. My cousins jumped off it again and again, but I stayed on the dock all week.\n\nOn the last day, I finally climbed the ladder. At the top, the water looked a mile away. My knees shook, and my toes curled over the edge of the board. My cousin shouted, "You can do it!" I took a deep breath, held my nose and stepped off.\n\nFor one second, I was flying. Then the cold water closed over my head, and I burst up laughing.\n\nThat day I learned that the scariest part of trying something new is the moment before you start.',
  },
  {
    task: "Write a true story of several paragraphs about a time you lost something important. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      "In third grade, my grandmother gave me a small silver bracelet that had belonged to her mother. I wore it every day.\n\nOne afternoon after recess, I looked down and my wrist was bare. My stomach dropped. I ran back to the playground and searched the sand, the grass and the slide. The bell rang, and I still had not found it. I could hardly breathe for the lump in my throat.\n\nThe next morning, my teacher held up something shiny. A first grader had found it near the swings.\n\nNow I keep the bracelet in a box and wear it only on special days. I learned that some things are too precious to take for granted.",
  },
  {
    task: "Write a true story of several paragraphs about a time you had to speak or perform in front of others. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      "In fourth grade, I was chosen to read a poem at the school assembly. I practiced it every night for two weeks.\n\nWhen my name was called, I walked to the microphone. Three hundred faces stared at me. My hands were sweaty, and the paper shook so much that the words jumped around. I opened my mouth and nothing came out. Then I found my mom in the third row. She smiled and nodded. I looked only at her and began to read.\n\nWhen I finished, the whole hall clapped.\n\nI learned that being nervous does not mean you will fail, and that one friendly face can make you brave.",
  },
  {
    task: "Write a true story of several paragraphs about a time you got lost. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      'When I was seven, my family visited a huge market in the city. I stopped to watch a man making balloon animals, and when I turned around, my parents were gone.\n\nPeople rushed past me in every direction. I spun around, looking for my dad\'s red cap, but all I saw were strangers. My heart pounded, and tears blurred my eyes. Then I remembered what my mom always said: "If you get lost, stay where you are and find someone in uniform." I walked to a guard at the gate and told him my name.\n\nTen minutes later, my parents came running.\n\nI learned that staying calm and remembering a plan can turn a scary moment around.',
  },
  {
    task: "Write a true story of several paragraphs about a time you made a mistake and had to fix it. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      'Last spring, I was playing ball in the yard when my throw went wild. It smashed straight through our neighbor\'s window.\n\nI froze. For a moment, I thought about running inside and pretending nothing had happened. My face felt hot, and my legs felt heavy as I walked to Mr. Brown\'s door. I knocked, and when he opened it, my voice came out small. "I broke your window. I\'m really sorry."\n\nMr. Brown was quiet for a moment. Then he said, "Thank you for telling me." We fixed the window together that weekend, and I paid for half from my savings.\n\nI learned that owning up to a mistake is hard, but it makes things better much faster.',
  },
  {
    task: "Write a true story of several paragraphs about a time you helped someone who needed it. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      "On the first day of fifth grade, a new girl named Lina sat alone at lunch. She had just moved from another country and spoke little English.\n\nFor three days, I watched her eat by herself. On the fourth day, I picked up my tray, walked over and sat down across from her. My heart was thumping; what if she didn't want me there? I pointed to my sandwich and said, \"Cheese.\" She smiled a tiny smile, pointed to her lunch and said a word I didn't know.\n\nBy the end of the week, we were teaching each other words every day.\n\nI learned that a small act of kindness can be the beginning of a friendship.",
  },
  {
    task: "Write a true story of several paragraphs about a time you worked hard to reach a goal. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      "Last year, I wanted to run the whole two-kilometer school race without stopping. At my first try, I had to walk after three laps.\n\nSo I practiced every evening for two months, running a little farther each week. On race day, my legs burned by the last lap, and my breath came in rasps. I wanted to stop more than anything. Then I heard my friends shouting my name at the finish. I pumped my arms and kept going, one step and then another.\n\nI crossed the line without walking once. I wasn't first, but I didn't care.\n\nI learned that hard goals are reached a little at a time, through practice that no one else sees.",
  },
  {
    task: "Write a true story of several paragraphs about a time you faced bad weather. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      'Last winter, my dad and I went for a walk in the hills. The sky was blue when we left, so we did not bring much.\n\nAn hour later, the clouds rolled in, and snow began to fall thickly. Soon we could not see the path. The wind stung my cheeks, and my fingers went numb inside my thin gloves. I was scared, but Dad stayed calm. "Stay close and follow the fence," he said. We walked beside the fence, step by step, until the roof of the car appeared through the snow.\n\nAt home, I held a cup of hot chocolate and finally stopped shivering.\n\nI learned to always check the weather and pack for the worst, even on a sunny day.',
  },
  {
    task: "Write a true story of several paragraphs about a time you had to say goodbye to someone or something. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      "When I was nine, we moved to a new city, and I had to say goodbye to my best friend, Sophie.\n\nOn our last day, we sat on her front steps where we had spent a hundred summer evenings. Neither of us said much. Then the moving truck honked. Sophie gave me a bracelet she had made of green and blue thread. My throat felt tight, and I couldn't speak, so I just hugged her for a long time. As the car pulled away, I watched her wave until she was a tiny dot.\n\nWe still write to each other every month.\n\nI learned that goodbyes are hard because something was good, and that real friends stay friends even far apart.",
  },
  {
    task: "Write a true story of several paragraphs about a time you learned to do something difficult, such as riding a bike or swimming. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      'I was the last kid on my street who could not ride a bike without training wheels. Every time I tried, I wobbled and fell.\n\nOne Saturday, my older sister held the back of my seat and ran beside me. "Keep pedaling, keep looking ahead," she said. I pedaled hard, gripping the handlebars until my knuckles turned white. The bike felt steady. "You\'re doing great!" she called, but her voice sounded far away. I looked back. She was standing at the end of the street. I had been riding alone!\n\nI wobbled, but I didn\'t fall.\n\nI learned that sometimes you are ready before you believe you are.',
  },
  {
    task: "Write a true story of several paragraphs about a time you stood up for what was right. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      'In fourth grade, some kids in my class started making fun of a boy named Theo because of his stutter.\n\nOne day at recess, they surrounded him and copied the way he talked. Theo stared at the ground. My heart was pounding, and part of me wanted to walk away. Instead, I stepped next to him and said, "Stop it. That\'s not funny." The others went quiet. One of them shrugged, and they wandered off.\n\nTheo looked at me and said, "Thanks." After that, we played together every recess.\n\nI learned that it only takes one person to speak up, and that being brave can feel scary and good at the same time.',
  },
  {
    task: "Write a true story of several paragraphs about a time something did not go as you had planned. Set the situation, slow down at the key moment, show your feelings and end with what you learned.",
    model:
      'For my tenth birthday, I planned a picnic in the park with all my friends. I had made the invitations myself, and I had been looking forward to it for weeks.\n\nThat morning, rain poured down. I pressed my face to the window and watched the puddles grow. My eyes stung with tears; everything was ruined. Then my mom came in with a pile of blankets. "Who says a picnic has to be outside?" she asked. We spread the blankets on the living room floor and ate sandwiches while the rain drummed on the roof.\n\nIt turned out to be my favorite birthday ever.\n\nI learned that when plans fall apart, something even better can take their place.',
  },
];

/** diaryBank asks for diary entries by an invented person of a past time. */
const diaryBank: readonly WritingItem[] = [
  {
    task: "Write two or three diary entries by an invented child crossing the ocean by ship to a new country in 1850. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "April 2, 1850\nToday we left the harbor. I stood at the rail and watched home grow smaller until it was only a gray line. Mother cried, but she told me it was the wind in her eyes. We sleep below deck in a narrow bunk, all five of us.\n\nApril 19, 1850\nA storm tossed the ship all night. Water came through the hatch, and the lanterns swung wildly. I held my little brother's hand and prayed. In the morning, the sailors said it was only a small storm.\n\nMay 23, 1850\nLand! Everyone ran on deck to see it. I am frightened of the new country, but I am happier than I have been in seven weeks.",
  },
  {
    task: "Write two or three diary entries by an invented child living in ancient Athens on the day of an assembly. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "The first day of the month of Gamelion\nFather left at dawn for the assembly on the Pnyx. He says they will vote on whether to build new ships. I wish I could go, but boys cannot vote until they are men. I went to my lessons and practiced the lyre instead.\n\nThe second day of Gamelion\nFather came home tired but proud. He stood up and spoke before thousands of citizens! The vote went his way, and the ships will be built. I listened to every word of his story.\n\nThe tenth day of Gamelion\nI watched the shipbuilders at the harbor today, cutting the long beams. One day I will be a citizen too, and I will speak on the Pnyx like Father.",
  },
  {
    task: "Write two or three diary entries by an invented child on a wagon train traveling west in 1848. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "May 10, 1848\nOur wagon left Independence this morning with thirty others. Our oxen are slow, and I walked beside them most of the day. The dust gets into everything, even my bread.\n\nJune 4, 1848\nWe crossed a wide river today. The men tied barrels to the wagon to help it float. I held on tight to Mother as the water rushed past. One wagon tipped and lost its flour, and the family wept. I am glad we lost nothing.\n\nJuly 1, 1848\nTonight we saw the mountains for the first time, white with snow even in summer. Father says the hardest part is still ahead. I am tired and my boots have holes, but I am not afraid.",
  },
  {
    task: "Write two or three diary entries by an invented child working in a cotton mill in 1840. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "September 8, 1840\nToday was my first day at the mill. The bell rang at five in the morning, and we worked until seven at night. The looms are so loud that I cannot hear my own voice, and the air is full of cotton fluff.\n\nSeptember 15, 1840\nMy fingers are sore from tying broken threads. The overseer shouts if we are slow. I earn two dollars a week, and I give it all to Mother for food and rent. I miss the fields at home.\n\nOctober 2, 1840\nOn Sunday, the only day we do not work, I learned my letters at the church school. I want to read well enough to find better work one day. That thought helps me through the long days.",
  },
  {
    task: "Write two or three diary entries by an invented child living through the eruption of Mount Vesuvius in the year 79. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "The day before the Kalends of September, in the year of the consuls Titus and Domitian\nThe ground shook again this morning, and the dogs howled. Mother says the mountain often grumbles. I helped carry water from the fountain and bought bread at the bakery near the forum.\n\nThe next day, at noon\nA great cloud rose from the mountain, shaped like a pine tree. Ash and stones began to fall. Father loaded our cart, and we fled along the road to the sea. I could hardly breathe for the dust, and I was more frightened than I have ever been.\n\nThree days later\nWe are safe in Neapolis, with cousins. I keep thinking of our house and my little clay horse, buried under the gray ash.",
  },
  {
    task: "Write two or three diary entries by an invented child of a lighthouse keeper in 1880. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "November 3, 1880\nFather let me help trim the wicks tonight. We climbed the 120 steps with the can of whale oil. The light must burn all night, and Father winds the clockwork every four hours so the lamp keeps turning.\n\nNovember 12, 1880\nA terrible storm. The waves broke over the rocks below us, and the tower shook. Father did not sleep at all. I polished the brass and cleaned the soot from the glass so the light would shine its brightest. I was frightened, but proud to help.\n\nNovember 13, 1880\nThis morning a fishing boat came in safe and its captain climbed up to thank Father. He said our light saved his crew. I think I would like to be a keeper one day.",
  },
  {
    task: "Write two or three diary entries by an invented child in an Inca village at harvest time, about 1500. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "The first day of harvest\nToday the whole village went up to the terraces to dig potatoes. I carried them down in a woven bag on my back. My grandmother says we must store some in the cold air so they will freeze and dry for winter.\n\nThe fifth day of harvest\nA runner came along the road today, carrying a message for the village leader. He ran so fast! He passed it to the next runner and rested in the rest house. Father says the message came from the emperor in Cusco.\n\nThe tenth day of harvest\nWe gave part of our potatoes and maize to the storehouses of the emperor, as every village must. My legs are tired from the steep steps, but tonight we will feast and play music.",
  },
  {
    task: "Write two or three diary entries by an invented child during the gold rush in California in 1849. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "March 3, 1849\nWe reached the gold fields today. Hundreds of men stand in the cold river, shaking pans of mud and water. Father bought a pan and a shovel for twelve dollars, a terrible price.\n\nMarch 20, 1849\nThree weeks of panning, and we have found only a few small flakes. A loaf of bread here costs a dollar. Mother washes miners' shirts to earn money, and I help her carry the water. I am tired of beans every night.\n\nApril 8, 1849\nToday I saw a yellow glint in my pan, bigger than a pea! Father weighed it and said it was worth almost twenty dollars. I danced all around our tent. Maybe our luck has turned at last.",
  },
  {
    task: "Write two or three diary entries by an invented child in London during a winter frost fair on the frozen Thames in 1814. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "February 1, 1814\nThe river has frozen solid! Today Father took me out onto the ice. There were tents and stalls all along it, selling gingerbread and hot drinks. A man even printed my name on a card with a little printing press, right there on the ice.\n\nFebruary 3, 1814\nWe walked across the river from one bank to the other. Someone led an elephant across the ice, and the crowd cheered. My toes were frozen, but I did not want to go home.\n\nFebruary 6, 1814\nThe thaw has come. The ice cracked today, and the stalls had to be taken away quickly. I am sad that the frost fair is over, but I will keep my printed card always.",
  },
  {
    task: "Write two or three diary entries by an invented child of a family building the Erie Canal in 1820. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "June 5, 1820\nFather has work digging the new canal. He leaves before sunrise with his shovel and comes home covered in mud. The canal will join the lake to the river, so boats can carry goods all the way to the sea.\n\nJuly 14, 1820\nThe men blasted rock with gunpowder today. The boom shook our cabin, and Mother dropped a dish. Father says the digging is slow, only a few feet each day for each man, but they are many.\n\nAugust 30, 1820\nI brought Father his dinner pail at noon and watched the workers. A mule pulled a cart full of dirt away. I am proud that Father is helping to build something so great.",
  },
  {
    task: "Write two or three diary entries by an invented child in a Maya city at the time of a festival, about the year 800. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "The day 4 Ahau\nThe priests climbed the great pyramid at dawn and studied the sky. They say the festival will begin in three days, when Venus rises. Mother is grinding maize to make tamales for the feast.\n\nThe day 7 Ok\nThe festival began! Drums and conch shells sounded from the temple. Dancers in feathered headdresses filled the plaza. I watched a ball game in the stone court, where the players hit the heavy ball with their hips, never their hands.\n\nThe day 8 Chuwen\nToday the scribe let me watch him paint signs in a bark-paper book. He says the book records the movements of the stars. I want to learn to read the signs too.",
  },
  {
    task: "Write two or three diary entries by an invented child whose town got its first telephone in 1880. Use a first-person voice, details true to the period, your feelings and dated entries in order.",
    model:
      "March 1, 1880\nThe doctor has a telephone! It is a wooden box on his wall with a handle to turn. Today he let me hold the piece to my ear, and I heard a voice from the next town, all crackly and tiny. I could not believe it.\n\nMarch 15, 1880\nGrandfather says the telephone is a silly toy and that a good letter is better. But when Mrs. Hale's barn caught fire last night, the doctor used the telephone to call for help from the next town. They came within an hour.\n\nApril 2, 1880\nFather says that one day every house will have a telephone. I think he must be dreaming, but I hope he is right.",
  },
];

/** judgedTopics5b are the second judged writing topics of grade 5. */
export const judgedTopics5b: readonly TopicDef[] = [
  {
    id: "writing-a-news-article",
    title: t("Writing a News Article", "写新闻报道"),
    summary: t(
      "Write a short news article from notes about a bridge or a building: a lead with the five Ws, facts in order of importance, a quotation from someone involved and no opinion of the writer.",
      "根据关于一座桥或一栋建筑的笔记写一篇短新闻：包含五个W的导语、按重要性排列的事实、相关人员的引语，不加入作者的观点。",
    ),
    prerequisites: after("reading-a-news-article", "formal-style"),
    encompasses: [{ topic: "formal-style", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g5-news-lead", "g5-news-order", "g5-news-quote", "g5-news-objective"].map(criterion),
    knowledgePoints: [
      point(
        "a-lead-with-the-five-ws",
        t("A Lead with the Five Ws", "包含五个W的导语"),
        t(
          "A news article opens with its **lead**: one or two sentences that tell **who**, **what**, **when** and **where**, and often **why** or **how**: *The new Riverside Bridge opened on Saturday, May 4, joining the two sides of Millbrook.* Then the facts follow in **order of importance**, the biggest news first and the small details last, so a reader who stops early still has the main story.",
          "新闻报道以**导语**开头：用一两句话说明**谁**、**什么事**、**什么时候**、**在哪里**，常常还有**为什么**或**怎样**：*The new Riverside Bridge opened on Saturday, May 4, joining the two sides of Millbrook.* 接着按**重要性顺序**写出事实，最重要的新闻在前，小细节在后，这样读者即使只读开头也能知道主要内容。",
        ),
        writingGenerator(
          t(
            "Write the news article in English, opening with a lead that gives the five Ws.",
            "用英语写这篇新闻报道，以包含五个W的导语开头。",
          ),
          newsBank,
          ["g5-news-lead", "g5-news-order", "g5-news-objective"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
      point(
        "quotations-and-no-opinion",
        t("A Quotation and No Opinion", "引语与不带观点"),
        t(
          'A news article reports; it does not judge. It keeps the writer\'s own feelings out, so no *amazing* or *I think*, and uses a formal style. Opinions may appear only as **quotations** from people involved, in quotation marks and with the speaker named: *"The bridge did exactly what we designed it to do," said chief engineer Lena Park.*',
          '新闻报道只报道，不评判。它不写作者自己的感受，所以不用 *amazing* 或 *I think*，并使用正式文体。观点只能以相关人员的**引语**形式出现，放在引号里并说出说话人：*"The bridge did exactly what we designed it to do," said chief engineer Lena Park.*',
        ),
        writingGenerator(
          t(
            "Write the news article in English, with a quotation and without your own opinion.",
            "用英语写这篇新闻报道，包含一句引语，不加入你自己的观点。",
          ),
          newsBank,
          ["g5-news-quote", "g5-news-objective", "g5-news-lead"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-mystery",
    title: t("Writing a Mystery", "写推理故事"),
    summary: t(
      "Write a short mystery of several paragraphs: a puzzle set up early, clues the reader can follow, one red herring, a solution the clues explain and scenes that show rather than tell.",
      "写一篇几段长的短篇推理故事：开头就提出谜题，有读者能跟随的线索和一条误导线索，结局由线索解释，场景要展示而不是直接告诉。",
    ),
    prerequisites: after("writing-a-narrative-paragraph", "planning-a-story-arc", "clues-and-red-herrings"),
    encompasses: [
      { topic: "planning-a-story-arc", weight: 0.2 },
      { topic: "clues-and-red-herrings", weight: 0.2 },
    ],
    xp: 22,
    strand: "writing",
    criteria: ["g5-mystery-puzzle", "g5-mystery-clues", "g5-mystery-solution", "g35-narrative-shows"].map(criterion),
    knowledgePoints: [
      point(
        "a-puzzle-and-its-clues",
        t("A Puzzle and Its Clues", "谜题与线索"),
        t(
          "A mystery sets up its **puzzle** in the first lines: something missing, strange or unexplained. Then it places **clues** where the reader can notice them, details that will matter later, such as crumbs leading the wrong way. It also adds one **red herring**, a clue that points at the wrong answer, so the reader has something to think about.",
          "推理故事在开头几行就提出**谜题**：某样东西不见了、有什么奇怪或无法解释的事。然后把**线索**放在读者能注意到的地方，也就是以后会起作用的细节，比如往错误方向延伸的面包屑。它还要加入一条**误导线索**，指向错误的答案，让读者有东西可想。",
        ),
        writingGenerator(
          t(
            "Write the mystery in English, setting up the puzzle early and planting clues and a red herring.",
            "用英语写这个推理故事，开头提出谜题，并埋下线索和一条误导线索。",
          ),
          mysteryBank,
          ["g5-mystery-puzzle", "g5-mystery-clues", "g35-narrative-shows"],
          { minWords: 120, maxChars: 4000 },
          onePiece,
        ),
      ),
      point(
        "a-solution-the-clues-explain",
        t("A Solution the Clues Explain", "由线索解释的结局"),
        t(
          "A fair mystery is solved by the **clues** the reader has already seen, not by luck or by a fact that appears only at the end. When the detective explains, the reader should think, *Of course, the paw prints!* Show the scenes through actions and details instead of telling the reader what to think, so the reader can solve the puzzle too.",
          "公平的推理故事要用读者已经看到的**线索**来解开谜题，而不是靠运气，也不是靠到最后才出现的事实。侦探解释的时候，读者应该想：*Of course, the paw prints!* 用动作和细节展示场景，而不是告诉读者该怎么想，这样读者也能一起解谜。",
        ),
        writingGenerator(
          t("Write the mystery in English, with a solution that the clues explain.", "用英语写这个推理故事，结局要由线索来解释。"),
          mysteryBank,
          ["g5-mystery-solution", "g5-mystery-clues", "g35-narrative-shows"],
          { minWords: 120, maxChars: 4000 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-personal-narrative",
    title: t("Writing a Personal Narrative", "写个人经历叙事"),
    summary: t(
      "Write a true story of several paragraphs about a time you faced a challenge: set the situation, slow down at the key moment, show your feelings and end with what you learned.",
      "写一篇几段长的真实故事，讲你面对挑战的一次经历：交代情境，在关键时刻放慢节奏，表现你的感受，最后写出你学到了什么。",
    ),
    prerequisites: after("writing-a-narrative-paragraph", "pacing-a-story"),
    encompasses: [
      { topic: "writing-a-narrative-paragraph", weight: 0.3 },
      { topic: "pacing-a-story", weight: 0.2 },
    ],
    xp: 22,
    strand: "writing",
    criteria: ["g35-narrative-situation", "g5-personal-pacing", "g5-personal-feelings", "g5-personal-reflection"].map(criterion),
    knowledgePoints: [
      point(
        "slowing-down-at-the-key-moment",
        t("Slowing Down at the Key Moment", "在关键时刻放慢节奏"),
        t(
          "A personal narrative tells a **true** story from your own life. Set the situation quickly: who, where, and what the challenge was. Then **slow down** at the key moment, the jump off the diving board or the knock on the neighbor's door, and tell it second by second, with what you saw, heard and said.",
          "个人经历叙事讲的是你自己生活中的**真实**故事。快速交代情境：有谁、在哪里、面对的挑战是什么。然后在关键时刻**放慢节奏**，比如从跳台上跳下去或敲邻居家门的那一刻，一秒一秒地写出你看到、听到和说了什么。",
        ),
        writingGenerator(
          t("Write the true story in English, slowing down at the key moment.", "用英语写这个真实的故事，在关键时刻放慢节奏。"),
          personalBank,
          ["g35-narrative-situation", "g5-personal-pacing", "g5-personal-feelings"],
          { minWords: 100, maxChars: 3600 },
          onePiece,
        ),
      ),
      point(
        "feelings-and-what-you-learned",
        t("Feelings and What You Learned", "感受与收获"),
        t(
          "Let the reader feel what you felt. Instead of only *I was scared*, show it: *My knees shook, and my hands gripped the cold rail.* Then end by **looking back**: say what you learned or how you changed, in a sentence or two: *I learned that the scariest part of trying something new is the moment before you start.*",
          "让读者感受到你的感受。不要只写 *I was scared*，要把它表现出来：*My knees shook, and my hands gripped the cold rail.* 最后要**反思**：用一两句话说出你学到了什么或你有了怎样的改变：*I learned that the scariest part of trying something new is the moment before you start.*",
        ),
        writingGenerator(
          t(
            "Write the true story in English, showing your feelings and ending with what you learned.",
            "用英语写这个真实的故事，表现你的感受，并以你学到的东西结尾。",
          ),
          personalBank,
          ["g5-personal-feelings", "g5-personal-reflection", "g35-narrative-situation"],
          { minWords: 100, maxChars: 3600 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-diary-from-history",
    title: t("Writing a Diary from History", "写历史日记"),
    summary: t(
      "Write two or three diary entries by an invented person of a past time: a first-person voice, details true to the period, the writer's feelings and events in order by date.",
      "以一个虚构的古代人物的身份写两三篇日记：用第一人称，细节符合那个时代，写出作者的感受，事件按日期顺序排列。",
    ),
    prerequisites: after("reading-diaries-and-letters", "writing-a-narrative-paragraph"),
    encompasses: [{ topic: "reading-diaries-and-letters", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g5-diary-voice", "g5-diary-period", "g5-diary-feelings", "g5-diary-order"].map(criterion),
    knowledgePoints: [
      point(
        "a-voice-from-the-past",
        t("A Voice from the Past", "来自过去的声音"),
        t(
          "A diary from history is written by an **invented person** of a real time and place, in the **first person**, as if on the very day: *Today we left the harbor.* Each entry has a **date**, and the entries go in order of time. Fill them with **details true to the period**: lanterns, wagons, whale oil, not telephones in ancient Athens.",
          "历史日记由一个真实时代和地点中的**虚构人物**来写，用**第一人称**，就像写在当天一样：*Today we left the harbor.* 每篇日记都有**日期**，并按时间顺序排列。要写满**符合那个时代的细节**：提灯、马车、鲸油，而不是古代雅典的电话。",
        ),
        writingGenerator(
          t(
            "Write the diary entries in English, in a first-person voice of the past, dated and in order.",
            "用英语写这几篇日记，用过去时代的第一人称口吻，写上日期并按顺序排列。",
          ),
          diaryBank,
          ["g5-diary-voice", "g5-diary-order", "g5-diary-period"],
          { minWords: 90, maxChars: 3000 },
          onePiece,
        ),
      ),
      point(
        "feelings-in-a-time-gone-by",
        t("Feelings in a Time Gone By", "旧时光里的感受"),
        t(
          "A diary is private, so its writer says what they **feel**: fear in a storm at sea, pride in a parent, homesickness for the fields. The feelings bring the past to life, but they must still fit the time: a child of 1850 worries about the voyage, not about missing a bus. Use details of daily life, such as work, food and travel, to show what that time was like.",
          "日记是私人的，所以写日记的人会写出自己的**感受**：海上风暴中的恐惧、为父母感到的骄傲、对家乡田野的思念。感受让过去变得鲜活，但仍要符合那个时代：1850年的孩子担心的是航行，而不是错过公共汽车。用工作、食物、旅行等日常生活细节来表现那个时代的样子。",
        ),
        writingGenerator(
          t(
            "Write the diary entries in English, showing the writer's feelings and details true to the time.",
            "用英语写这几篇日记，表现作者的感受和符合那个时代的细节。",
          ),
          diaryBank,
          ["g5-diary-feelings", "g5-diary-period", "g5-diary-voice"],
          { minWords: 90, maxChars: 3000 },
          onePiece,
        ),
      ),
    ],
  },
];
