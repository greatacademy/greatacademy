// Grade 4: writing judged by a model, a short script of one scene and a paragraph of biography from notes.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { criterion, onePiece } from "./judged-kit.ts";

/** scriptBank asks for a script of one scene with a problem between two or three characters. */
const scriptBank: readonly WritingItem[] = [
  {
    task: "Write a short script of one scene in which two friends both want the last seat on the school bus.",
    model:
      "MAYA: (running up the steps) Wait! That seat is mine. I sat there yesterday.\nLEO: (crossing his arms) Yesterday doesn't count. I got here first today.\nMAYA: (looking at the full bus) But I get carsick if I sit at the back.\nLEO: (pausing, then sighing) Fine. You take it. I'll sit at the back.\nMAYA: (smiling) Thanks, Leo. I'll save you a seat tomorrow, I promise.\nLEO: (grinning) Deal. And you owe me a cookie.",
  },
  {
    task: "Write a short script of one scene in which a brother and sister argue about who broke a lamp.",
    model:
      "(A living room. A broken lamp lies on the floor.)\nSAM: (pointing) You broke it! You were throwing your ball.\nNINA: (shaking her head) I was not! You were jumping on the sofa.\nMOM: (entering, hands on hips) What happened here?\nSAM: (looking at the floor) Well... maybe I bumped it when I jumped.\nNINA: (quietly) And maybe my ball rolled into it after.\nMOM: (sighing, then smiling) Then you can both help me clean it up.",
  },
  {
    task: "Write a short script of one scene in which a knight is afraid of a very small dragon.",
    model:
      "(A dark cave. A tiny dragon sits on a rock.)\nSIR ROLAND: (shaking, holding up his shield) Stand back, terrible beast!\nDRAGON: (in a squeaky voice) Terrible? I'm the size of a teapot.\nSIR ROLAND: (peeking over his shield) The king said you burned down a barn.\nDRAGON: (looking down sadly) I only sneezed. It was an accident.\nSIR ROLAND: (lowering his shield) An accident? Then perhaps we can fix the barn together.\nDRAGON: (flapping happily) I'd like that very much.",
  },
  {
    task: "Write a short script of one scene in which two students must share one paintbrush for an art project.",
    model:
      "ANA: (holding the brush) I need it for the sky. It's the biggest part.\nOMAR: (reaching for it) But I need it for the trees, and they go first.\nANA: (frowning) Why do they go first?\nOMAR: (pointing at the paper) Because the sky goes around them. If you paint it first, it will cover my lines.\nANA: (thinking, then handing him the brush) Okay. You paint the trees, and I'll mix the blue.\nOMAR: (smiling) Teamwork!",
  },
  {
    task: "Write a short script of one scene in which a shopkeeper and a customer disagree about the price of a melon.",
    model:
      "(A busy market stall.)\nCUSTOMER: (holding up a melon) Five coins? Yesterday it was three!\nSHOPKEEPER: (wiping his hands) Yesterday the melons were small. Look how big this one is.\nCUSTOMER: (tapping the melon) Big, yes. But is it ripe?\nSHOPKEEPER: (smelling it, then grinning) Sweet as honey. I'll give you four coins and a lemon for free.\nCUSTOMER: (laughing) Now that is a fair price.\n(The customer hands over the coins.)",
  },
  {
    task: "Write a short script of one scene in which a boy wants to keep a stray cat but his grandmother is not sure.",
    model:
      "(A kitchen. A thin gray cat sits by the door.)\nKAI: (kneeling beside the cat) Please, Grandma, can we keep her? She's so hungry.\nGRANDMA: (frowning) Cats need food every day, Kai. And someone must clean up after them.\nKAI: (standing up straight) I'll do it. I'll feed her before school and after.\nGRANDMA: (watching the cat rub against Kai's leg) She does seem to like you.\nKAI: (holding his breath) So is that a yes?\nGRANDMA: (smiling) It's a yes, for one week. Then we'll see.",
  },
  {
    task: "Write a short script of one scene in which two explorers disagree about which way to go in a jungle.",
    model:
      "(A thick jungle. Two explorers stand at a fork in the path.)\nROSA: (pointing left) The river is this way. I can hear it.\nEMIL: (studying a map) The map says the river is to the right.\nROSA: (cupping her ear) Listen! That's running water.\nEMIL: (turning the map around, embarrassed) Oh. I was holding it upside down.\nROSA: (laughing) Then left it is.\nEMIL: (folding the map) From now on, you can carry this.",
  },
  {
    task: "Write a short script of one scene in which a girl tries to convince her coach to let her play in the final game.",
    model:
      "(A school field after practice.)\nJADA: (running up, out of breath) Coach, please put me in the final game.\nCOACH: (checking his clipboard) You missed two practices last week, Jada.\nJADA: (looking down) I know. I was helping my mom at the shop. But I practiced every night in the yard.\nCOACH: (raising his eyebrows) Every night?\nJADA: (nodding firmly) I can kick with my left foot now. Watch.\n(She kicks the ball straight into the net.)\nCOACH: (smiling) All right. You start on Saturday.",
  },
  {
    task: "Write a short script of one scene in which a robot and a child disagree about what makes a good breakfast.",
    model:
      "(A kitchen. A robot holds a plate of gray cubes.)\nROBOT: (in a flat voice) Breakfast is ready. Nutrition cubes. One hundred percent healthy.\nLILY: (wrinkling her nose) They look like rocks.\nROBOT: (tilting its head) Rocks are not healthy. These are.\nLILY: (opening the fridge) Healthy breakfast can taste good too. Like fruit and yogurt.\nROBOT: (beeping slowly) Processing... Fruit is acceptable.\nLILY: (handing it a banana) Try it. You're going to love it.",
  },
  {
    task: "Write a short script of one scene in which two actors argue over who gets to play the hero in the class play.",
    model:
      "BEN: (holding the script) I should be the hero. I'm the loudest in the class.\nZARA: (shaking her head) Being loud isn't acting. I know all the lines already.\nBEN: (surprised) All of them?\nZARA: (closing her eyes and reciting) \"I will cross the mountain and bring back the light!\"\nBEN: (slowly lowering the script) Wow. That was good.\nZARA: (smiling) You could play the dragon. It has the loudest roar.\nBEN: (roaring) I accept!",
  },
  {
    task: "Write a short script of one scene in which a traveler on the Silk Road loses a camel and a merchant helps find it.",
    model:
      "(A desert oasis at sunset.)\nTRAVELER: (looking around wildly) My camel is gone! All my silk is on its back.\nMERCHANT: (calmly sipping tea) Camels do not go far from water. Have you looked by the well?\nTRAVELER: (throwing up his hands) I have looked everywhere!\nMERCHANT: (pointing behind the traveler) Everywhere except behind you.\n(The camel is drinking from a trough.)\nTRAVELER: (laughing with relief) Thank you, friend. Please, take a scarf as thanks.",
  },
  {
    task: "Write a short script of one scene in which a girl and her father disagree about whether she can climb a tall tree.",
    model:
      "(A park. A tall oak tree.)\nHANA: (looking up) Dad, I want to climb to the top branch.\nDAD: (shaking his head) That's too high. What if you fall?\nHANA: (pointing) I'll use the thick branches only, and I'll go slowly.\nDAD: (rubbing his chin) Hmm. How about the middle branch first?\nHANA: (sighing, then nodding) Okay. The middle today, the top next summer.\nDAD: (smiling and holding out his hands) I'll be right here to catch you.",
  },
];

/** sceneBank asks for a scene whose dialogue shows who its characters are, with stage directions for the actors. */
const sceneBank: readonly WritingItem[] = [
  {
    task: "Write a short script of one scene in which a nervous new student meets a friendly classmate. Use stage directions to help the actors.",
    model:
      "(A classroom before the bell. ELI stands by the door, holding his bag tightly.)\nPRIYA: (waving) Hi! Are you new? You can sit next to me.\nELI: (quietly, not moving) Um... I don't want to take someone's seat.\nPRIYA: (patting the chair) Nobody sits here. It's been waiting for you.\nELI: (walking over slowly) Thanks. I don't know anyone yet.\nPRIYA: (grinning) Now you know me. Do you like drawing? We have art first.\nELI: (smiling for the first time) I love drawing.",
  },
  {
    task: "Write a short script of one scene in which a proud king learns a lesson from a clever servant. Use stage directions to help the actors.",
    model:
      "(A throne room. The KING sits high on his throne.)\nKING: (loudly) I am the wisest king in the world. No one can trick me.\nSERVANT: (bowing low) Then, Your Majesty, can you tell me what is heavier: a pound of feathers or a pound of gold?\nKING: (laughing) Gold, of course!\nSERVANT: (smiling gently) They weigh the same, sire. A pound is a pound.\nKING: (pausing, then slowly standing) Perhaps... I still have things to learn.\nSERVANT: (bowing again) That, sire, is truly wise.",
  },
  {
    task: "Write a short script of one scene in which a grumpy neighbor and a cheerful child meet over a lost ball. Use stage directions to help the actors.",
    model:
      "(A garden fence. A ball lies in MR. GRAY's flower bed.)\nMR. GRAY: (scowling, holding the ball) Is this yours? It squashed my tulips.\nTOM: (bouncing on his toes) Sorry, Mr. Gray! I'll be more careful. Your tulips are the prettiest on the street.\nMR. GRAY: (surprised) You think so?\nTOM: (nodding eagerly) I always look at them on my way to school.\nMR. GRAY: (his face softening) Well... perhaps you'd like to help me plant some more.\nTOM: (cheering) Yes, please!",
  },
  {
    task: "Write a short script of one scene in which two castle guards hear a strange noise at night. Use stage directions to help the actors.",
    model:
      "(The top of a castle wall at night. Wind howls.)\nGUARD ONE: (gripping his spear, whispering) Did you hear that?\nGUARD TWO: (yawning) It's only the wind. Go back to sleep.\nGUARD ONE: (pointing into the dark) No, there! Something is climbing the wall!\nGUARD TWO: (jumping up and raising his lantern) Who goes there?\n(A small goat pokes its head over the wall.)\nGUARD TWO: (laughing) Your great enemy is a goat.\nGUARD ONE: (embarrassed) Well, it's a very brave goat.",
  },
  {
    task: "Write a short script of one scene in which a famous painter meets a young fan who wants to learn. Use stage directions to help the actors.",
    model:
      "(An art studio full of canvases.)\nMIA: (peeking around the door) Excuse me. Are you the painter of the sunflowers?\nPAINTER: (without looking up, gruffly) I am busy. What do you want?\nMIA: (stepping in, holding out a drawing) I wanted to show you this. I copied your painting.\nPAINTER: (taking it, then studying it closely) Hmm. Your yellow is too careful. Sunflowers are wild.\nMIA: (eagerly) Can you show me how?\nPAINTER: (handing her a brush, smiling at last) Come. Let us be wild together.",
  },
  {
    task: "Write a short script of one scene in which a shy boy has to give a speech and his friend helps him. Use stage directions to help the actors.",
    model:
      "(Backstage at the school hall. NOAH paces, holding a card.)\nNOAH: (in a shaky voice) I can't do it. Everyone will stare at me.\nAVA: (putting a hand on his shoulder) Then don't look at everyone. Look at me in the front row.\nNOAH: (taking a deep breath) What if I forget the words?\nAVA: (tapping his card) That's what this is for. And you practiced ten times.\nNOAH: (standing a little taller) Okay. Front row.\nAVA: (giving a thumbs-up) You've got this.\n(NOAH walks onto the stage.)",
  },
  {
    task: "Write a short script of one scene in which a fox tries to trick a crow out of her cheese. Use stage directions to help the actors.",
    model:
      "(A forest. CROW sits on a branch with a piece of cheese in her beak.)\nFOX: (sweetly, looking up) Good morning, lovely Crow. What shiny feathers you have!\nCROW: (nodding proudly, but keeping her beak shut)\nFOX: (sighing dramatically) If only I could hear your beautiful voice.\nCROW: (dropping the cheese into her claw before speaking) Nice try, Fox. I heard that story last year.\nFOX: (stamping his paw) Bah! Crows these days are too clever.\nCROW: (flying off, laughing) Read more stories, Fox!",
  },
  {
    task: "Write a short script of one scene in which a scientist and her assistant wait for an experiment to work. Use stage directions to help the actors.",
    model:
      "(A laboratory. Bottles bubble on the table.)\nDR. LIN: (staring at a test tube) Any moment now. It should turn blue.\nASSISTANT: (yawning) You said that an hour ago.\nDR. LIN: (not looking away) Science takes patience.\nASSISTANT: (leaning on the table, bored) Patience takes snacks.\n(The test tube suddenly turns bright blue.)\nDR. LIN: (jumping up and clapping) It worked! I told you!\nASSISTANT: (wide-eyed) Wow. Okay, that was worth the wait.",
  },
  {
    task: "Write a short script of one scene in which two sisters plan a surprise for their mother. Use stage directions to help the actors.",
    model:
      "(A bedroom. Two sisters whisper on the floor.)\nGRACE: (excitedly) Let's make her breakfast in bed! Pancakes!\nLUCY: (worried) Last time we made pancakes, the smoke alarm went off.\nGRACE: (waving her hand) That was one time.\nLUCY: (thinking, then brightening) What if we make a card and pick flowers instead?\nGRACE: (pausing) And toast. Toast is safe.\nLUCY: (giggling) Okay. Card, flowers and very careful toast.\n(They shake hands.)",
  },
  {
    task: "Write a short script of one scene in which an astronaut talks to mission control when something goes wrong. Use stage directions to help the actors.",
    model:
      "(Inside a small spaceship. A red light flashes.)\nASTRONAUT: (calmly, pressing a button) Mission control, this is Star One. We have a red light on panel three.\nCONTROL: (voice crackling) Star One, stay calm. What does the screen say?\nASTRONAUT: (leaning closer, reading) It says the door is open.\nCONTROL: (after a pause) Did you close the snack cupboard?\nASTRONAUT: (looking over her shoulder, then laughing) Ah. It's closed now. Light is green.\nCONTROL: (relieved) Good work, Star One.",
  },
  {
    task: "Write a short script of one scene in which a boy tries to return a library book that is very late. Use stage directions to help the actors.",
    model:
      "(A library desk. The LIBRARIAN stamps books.)\nJAMAL: (slowly sliding a book across the desk) I need to return this.\nLIBRARIAN: (checking the date, eyebrows rising) This was due three months ago.\nJAMAL: (looking at his shoes) I know. I read it four times. I couldn't stop.\nLIBRARIAN: (softening) Four times? Then you must have loved it.\nJAMAL: (nodding quickly) Is there a second book in the series?\nLIBRARIAN: (smiling, handing him another book) Yes. But this one comes back in two weeks.",
  },
  {
    task: "Write a short script of one scene in which a giant and a tiny mouse become unlikely friends. Use stage directions to help the actors.",
    model:
      "(A huge kitchen. The GIANT sits at the table, crying.)\nMOUSE: (climbing onto the table) Why are you crying, Giant?\nGIANT: (sniffing loudly) Everyone runs away from me. I have no friends.\nMOUSE: (crossing his tiny arms) I'm not running.\nGIANT: (leaning down, surprised) You're not afraid of me?\nMOUSE: (shrugging) Everyone is big to me. You're just a little bigger.\nGIANT: (laughing so hard the table shakes) Then will you be my friend?\nMOUSE: (holding on to a cup) Yes, if you stop shaking the table!",
  },
];

/** bioBank asks for a paragraph of biography from notes about a person who made a difference. */
const bioBank: readonly WritingItem[] = [
  {
    task: "Use these notes to write a paragraph about Marie Curie.",
    source:
      "born 1867 in Warsaw, Poland; moved to Paris to study science; studied radioactivity with her husband, Pierre; discovered two new elements, polonium and radium; won Nobel Prizes in 1903 and 1911; first person to win two",
    model:
      "Marie Curie was a scientist known for her discoveries about radioactivity. She was born in Warsaw, Poland, in 1867, and later moved to Paris to study science. There she worked with her husband, Pierre, and together they discovered two new elements, polonium and radium. She won a Nobel Prize in 1903 and another in 1911, which made her the first person ever to win two. Her work still matters today, because her discoveries helped doctors use radiation to find and treat illness.",
  },
  {
    task: "Use these notes to write a paragraph about Louis Braille.",
    source:
      "born 1809 in France; blind after an accident at age three; went to a school for blind children in Paris at ten; invented an alphabet of raised dots at fifteen; became a teacher at the school; his system is used around the world",
    model:
      "Louis Braille was the inventor of the raised-dot alphabet that blind people use to read. He was born in France in 1809 and lost his sight after an accident when he was three. At ten, he went to a school for blind children in Paris. When he was only fifteen, he invented an alphabet of raised dots that could be read with the fingertips. Later he became a teacher at the same school. His invention still matters, because millions of blind people around the world read with Braille today.",
  },
  {
    task: "Use these notes to write a paragraph about Wangari Maathai.",
    source:
      "born 1940 in Kenya; studied biology in the United States; first woman in East Africa to earn a doctorate; founded the Green Belt Movement in 1977; helped women plant over thirty million trees; won the Nobel Peace Prize in 2004",
    model:
      "Wangari Maathai was a Kenyan who led a movement to plant trees. She was born in Kenya in 1940 and studied biology in the United States. She became the first woman in East Africa to earn a doctorate. In 1977, she founded the Green Belt Movement, which helped women plant more than thirty million trees. In 2004, she won the Nobel Peace Prize. Her work still matters, because the trees protect the land and show that ordinary people can heal the Earth.",
  },
  {
    task: "Use these notes to write a paragraph about Mary Anning.",
    source:
      "born 1799 in Lyme Regis, England; poor family; searched the seaside cliffs for fossils to sell; at about twelve, found the skull of an ichthyosaur with her brother; later found the first complete plesiosaur; scientists of her time often did not give her credit",
    model:
      "Mary Anning was one of the first great fossil hunters. She was born in 1799 in Lyme Regis, England, to a poor family, and she searched the seaside cliffs for fossils to sell. When she was about twelve, she and her brother found the skull of an ichthyosaur, an ancient sea reptile. Later she found the first complete plesiosaur. Scientists of her time often did not give her credit. Today, her finds still matter, because they helped people understand that animals lived and died out long ago.",
  },
  {
    task: "Use these notes to write a paragraph about Zhang Heng.",
    source:
      "born 78 CE in China during the Han dynasty; scientist, inventor and poet; studied the stars and mapped them; in 132 CE built the first machine to detect earthquakes; bronze jar with dragons and toads; a ball dropped to show the direction of a quake",
    model:
      "Zhang Heng was a Chinese scientist and inventor of the Han dynasty. He was born in 78 CE and was also a poet. He studied the stars and made maps of them. In 132 CE, he built the first machine that could detect earthquakes. It was a bronze jar with dragons around the top and toads below, and when the ground shook, a ball dropped from a dragon's mouth into a toad's to show the direction of the quake. His work still matters, because scientists today still study earthquakes to keep people safe.",
  },
  {
    task: "Use these notes to write a paragraph about Jane Goodall.",
    source:
      "born 1934 in London, England; loved animals as a child; went to Gombe in Tanzania in 1960 to study chimpanzees; discovered that chimpanzees make and use tools; studied them for over sixty years; started an institute to protect chimpanzees",
    model:
      "Jane Goodall is a scientist famous for her study of chimpanzees. She was born in London, England, in 1934 and loved animals from a young age. In 1960, she went to Gombe in Tanzania to watch wild chimpanzees. There she discovered that chimpanzees make and use tools, which no one had known before. She went on studying them for more than sixty years and started an institute to protect them. Her work still matters, because it taught the world how much animals think and feel.",
  },
  {
    task: "Use these notes to write a paragraph about Helen Keller.",
    source:
      "born 1880 in Alabama, USA; lost sight and hearing as a baby after an illness; teacher Anne Sullivan arrived in 1887; learned words by spelling into her hand; graduated from college in 1904; wrote books and worked for people with disabilities",
    model:
      "Helen Keller was an author who could neither see nor hear. She was born in Alabama in 1880 and lost her sight and hearing after an illness when she was a baby. In 1887, a teacher named Anne Sullivan arrived and began spelling words into her hand. Helen learned quickly, and in 1904 she graduated from college. She went on to write books and work for people with disabilities. Her life still matters, because it shows that people with disabilities can do great things.",
  },
  {
    task: "Use these notes to write a paragraph about Florence Nightingale.",
    source:
      "born 1820 in Italy to a British family; wanted to be a nurse; in 1854 led nurses to an army hospital in the Crimean War; cleaned the hospital and saved many lives; walked the wards at night with a lamp; opened a school for nurses in 1860",
    model:
      "Florence Nightingale was a nurse who changed how hospitals care for people. She was born in Italy in 1820 to a British family and wanted to be a nurse from a young age. In 1854, she led a group of nurses to an army hospital during the Crimean War. She cleaned the dirty hospital and saved many lives, and she walked the wards at night with a lamp to check on the soldiers. In 1860, she opened a school for nurses. Her work still matters, because clean hospitals save lives today.",
  },
  {
    task: "Use these notes to write a paragraph about Yuan Longping.",
    source:
      "born 1930 in Beijing, China; saw people go hungry when he was young; studied farming; in the 1970s developed the first hybrid rice that gave much more grain; his rice was grown in many countries; died in 2021",
    model:
      "Yuan Longping was a Chinese scientist known as the father of hybrid rice. He was born in Beijing in 1930, and as a young man he saw many people go hungry. He decided to study farming. In the 1970s, he developed the first hybrid rice, a kind of rice that gave much more grain than before. His rice was soon grown in many countries. He died in 2021. His work still matters, because it helps feed millions of people around the world every day.",
  },
  {
    task: "Use these notes to write a paragraph about Ruby Bridges.",
    source:
      "born 1954 in Mississippi, USA; in 1960, at age six, first Black child to attend an all-white school in New Orleans; walked past angry crowds with guards; spent the year in a class of one with her teacher; later worked to fight unfair treatment",
    model:
      "Ruby Bridges was a brave girl who helped end unfair separation in American schools. She was born in Mississippi in 1954. In 1960, when she was six, she became the first Black child to attend an all-white elementary school in New Orleans. Every day, she walked past angry crowds with guards beside her. For that whole year, she was the only student in her class, taught by one teacher. Later she worked to fight unfair treatment. Her courage still matters, because it helped make schools open to all children.",
  },
  {
    task: "Use these notes to write a paragraph about Galileo Galilei.",
    source:
      "born 1564 in Pisa, Italy; scientist and astronomer; in 1609 built a better telescope; saw the moons of Jupiter and mountains on the Moon; said the Earth moves around the Sun; was punished for this idea",
    model:
      "Galileo Galilei was an Italian scientist who studied the sky. He was born in Pisa in 1564. In 1609, he built a better telescope than any before it. With it, he saw moons circling Jupiter and mountains on the Moon. He said that the Earth moves around the Sun, not the other way around, and he was punished for this idea. His work still matters, because it showed that we should trust what we can observe, which is the heart of science.",
  },
  {
    task: "Use these notes to write a paragraph about Frida Kahlo.",
    source:
      "born 1907 in Mexico City; had polio as a child; badly hurt in a bus accident at eighteen; began painting while in bed; painted many portraits of herself with bright colors and Mexican clothes; her paintings are now in museums around the world",
    model:
      "Frida Kahlo was a Mexican painter known for her bold self-portraits. She was born in Mexico City in 1907 and had polio as a child. At eighteen, she was badly hurt in a bus accident, and while she was stuck in bed, she began to paint. She painted many portraits of herself in bright colors, often wearing traditional Mexican clothes. Today her paintings hang in museums around the world. Her art still matters, because it shows how pain and pride can become something beautiful.",
  },
];

/** bioOrderBank asks for a paragraph of biography that tells the key events of a life in order and keeps to the notes. */
const bioOrderBank: readonly WritingItem[] = [
  {
    task: "Use these notes to write a paragraph about Malala Yousafzai. Tell the events in the order they happened.",
    source:
      "won the Nobel Peace Prize in 2014, at seventeen; born 1997 in Pakistan; spoke out for girls' right to go to school; was attacked in 2012 but recovered; started a fund to help girls get an education",
    model:
      "Malala Yousafzai is an activist who fights for girls' education. She was born in Pakistan in 1997. As a girl, she spoke out for the right of girls to go to school. In 2012, she was attacked for speaking out, but she recovered. In 2014, at seventeen, she won the Nobel Peace Prize. She also started a fund to help girls get an education. Her work still matters, because millions of girls around the world still cannot go to school.",
  },
  {
    task: "Use these notes to write a paragraph about Jesse Owens. Tell the events in the order they happened.",
    source:
      "won four gold medals at the 1936 Olympics in Berlin; born 1913 in Alabama, USA; family moved to Ohio; set three world records in one afternoon in 1935; grandson of enslaved people",
    model:
      "Jesse Owens was an American runner and jumper who became an Olympic hero. He was born in Alabama in 1913, the grandson of enslaved people, and his family later moved to Ohio. In 1935, he set three world records in a single afternoon. The next year, at the 1936 Olympics in Berlin, he won four gold medals. His story still matters, because he showed the world what talent can do, even in the face of unfairness.",
  },
  {
    task: "Use these notes to write a paragraph about Tu Youyou. Tell the events in the order they happened.",
    source:
      "won the Nobel Prize in Medicine in 2015; born 1930 in Ningbo, China; studied medicine; in 1969 began searching for a cure for malaria; found artemisinin in sweet wormwood, a plant of old Chinese medicine",
    model:
      "Tu Youyou is a Chinese scientist who found a medicine for malaria. She was born in Ningbo, China, in 1930 and studied medicine. In 1969, she began searching for a cure for malaria, a disease spread by mosquitoes. By studying old Chinese medicine, she found artemisinin in a plant called sweet wormwood. In 2015, she won the Nobel Prize in Medicine. Her work still matters, because her medicine has saved millions of lives.",
  },
  {
    task: "Use these notes to write a paragraph about Neil Armstrong. Tell the events in the order they happened.",
    source:
      "first person to walk on the Moon, July 1969; born 1930 in Ohio, USA; got his pilot's license at sixteen; became a test pilot and then an astronaut; commanded Apollo 11",
    model:
      "Neil Armstrong was an astronaut and the first person to walk on the Moon. He was born in Ohio in 1930 and got his pilot's license when he was only sixteen. He became a test pilot and then an astronaut. He commanded the Apollo 11 mission, and in July 1969 he stepped onto the Moon. His journey still matters, because it showed that people can reach places that once seemed impossible.",
  },
  {
    task: "Use these notes to write a paragraph about Wilma Rudolph. Tell the events in the order they happened.",
    source:
      "won three gold medals in running at the 1960 Olympics; born 1940 in Tennessee, USA; had polio as a child and wore a leg brace; took off the brace at about twelve; became a track star in high school",
    model:
      "Wilma Rudolph was an American runner who overcame illness to become a champion. She was born in Tennessee in 1940. As a child, she had polio and had to wear a brace on her leg. At about twelve, she took off the brace, and by high school she was a track star. At the 1960 Olympics, she won three gold medals in running. Her story still matters, because it shows that hard work can overcome great challenges.",
  },
  {
    task: "Use these notes to write a paragraph about Mae Jemison. Tell the events in the order they happened.",
    source:
      "flew into space on the shuttle Endeavour in 1992; born 1956 in Alabama, USA; grew up in Chicago; studied engineering and became a doctor; joined NASA as an astronaut in 1987; first African American woman in space",
    model:
      "Mae Jemison is a doctor and astronaut who was the first African American woman in space. She was born in Alabama in 1956 and grew up in Chicago. She studied engineering and then became a doctor. In 1987, she joined NASA as an astronaut. In 1992, she flew into space on the shuttle Endeavour. Her journey still matters, because it encourages young people of every background to study science.",
  },
  {
    task: "Use these notes to write a paragraph about Ada Lovelace. Tell the events in the order they happened.",
    source:
      "wrote what many call the first computer program, in 1843; born 1815 in London, England; loved mathematics as a girl; met the inventor Charles Babbage in 1833; worked on his plans for a calculating machine",
    model:
      "Ada Lovelace was a mathematician who is often called the first computer programmer. She was born in London in 1815 and loved mathematics as a girl. In 1833, she met the inventor Charles Babbage, who was planning a calculating machine. She worked on his plans, and in 1843 she wrote what many call the first computer program. Her ideas still matter, because computers today follow programs just as she imagined.",
  },
  {
    task: "Use these notes to write a paragraph about Ludwig van Beethoven. Tell the events in the order they happened.",
    source:
      "wrote his famous Ninth Symphony while completely deaf; born 1770 in Bonn, Germany; gave his first concert at seven; moved to Vienna at twenty-one; began to lose his hearing in his late twenties",
    model:
      "Ludwig van Beethoven was a composer of some of the world's greatest music. He was born in Bonn, Germany, in 1770 and gave his first concert when he was seven. At twenty-one, he moved to Vienna. In his late twenties, he began to lose his hearing, but he kept writing music. He wrote his famous Ninth Symphony when he was completely deaf. His music still matters, because orchestras around the world play it today.",
  },
  {
    task: "Use these notes to write a paragraph about the Wright brothers. Tell the events in the order they happened.",
    source:
      "made the first powered airplane flight in 1903 at Kitty Hawk; Wilbur born 1867, Orville born 1871; ran a bicycle shop in Ohio; tested gliders for several years; first flight lasted twelve seconds",
    model:
      "Wilbur and Orville Wright were two brothers who built the first airplane. Wilbur was born in 1867 and Orville in 1871. Together they ran a bicycle shop in Ohio. For several years, they tested gliders to learn how to control a flying machine. In 1903, at Kitty Hawk, they made the first powered airplane flight, which lasted twelve seconds. Their work still matters, because airplanes now carry millions of people around the world.",
  },
  {
    task: "Use these notes to write a paragraph about Rachel Carson. Tell the events in the order they happened.",
    source:
      "wrote Silent Spring in 1962; born 1907 in Pennsylvania, USA; studied biology; worked as a scientist for the government, writing about the ocean; her book warned that some sprays harmed birds and other wildlife",
    model:
      "Rachel Carson was a scientist and writer who helped start the movement to protect nature. She was born in Pennsylvania in 1907 and studied biology. She worked as a scientist for the government and wrote about the ocean. In 1962, she wrote Silent Spring, a book that warned that some sprays harmed birds and other wildlife. Her work still matters, because it taught people to think about how their actions affect the natural world.",
  },
  {
    task: "Use these notes to write a paragraph about Nelson Mandela. Tell the events in the order they happened.",
    source:
      "became president of South Africa in 1994; born 1918 in South Africa; became a lawyer; fought against laws that kept people apart by race; was in prison for twenty-seven years; freed in 1990",
    model:
      "Nelson Mandela was a leader who fought for equal rights in South Africa. He was born in South Africa in 1918 and became a lawyer. He fought against laws that kept people apart by race. Because of this, he was put in prison for twenty-seven years. He was freed in 1990, and in 1994 he became president of South Africa. His life still matters, because he showed that forgiveness can help a country heal.",
  },
  {
    task: "Use these notes to write a paragraph about Thomas Edison. Tell the events in the order they happened.",
    source:
      "made a light bulb that lasted many hours in 1879; born 1847 in Ohio, USA; sold newspapers on trains as a boy; invented the phonograph in 1877; held over a thousand patents",
    model:
      "Thomas Edison was an American inventor of many useful machines. He was born in Ohio in 1847, and as a boy he sold newspapers on trains. In 1877, he invented the phonograph, which could record and play sound. Two years later, in 1879, he made a light bulb that lasted many hours. Over his life he held more than a thousand patents. His work still matters, because electric light and recorded sound are part of everyday life.",
  },
];

/** scriptBioTopics4 are the judged writing topics of grade 4 for a short script and a paragraph of biography. */
export const scriptBioTopics4: readonly TopicDef[] = [
  {
    id: "writing-a-short-script",
    title: t("Writing a Short Script", "写短剧本"),
    summary: t(
      "Write a one-scene script for two or three characters, in script format, with a problem, dialogue that shows who the characters are and stage directions that help the actors.",
      "为两三个人物写一场戏的剧本：用剧本格式，有一个问题，用对话表现人物是什么样的人，用舞台说明帮助演员。",
    ),
    prerequisites: ["script-format", "writing-a-narrative-paragraph"],
    encompasses: [{ topic: "script-format", weight: 0.3 }],
    xp: 22,
    strand: "writing",
    criteria: ["g4-script-format", "g4-script-conflict", "g4-script-dialogue", "g4-script-directions"].map(criterion),
    knowledgePoints: [
      point(
        "a-scene-with-a-problem",
        t("A Scene with a Problem", "有问题的一场戏"),
        t(
          "A good scene has a **problem**: two characters want different things, or something goes wrong. The scene shows the problem, lets the characters argue or try, and brings it to some end. Write every line in **script format**: *MAYA: (running up the steps) Wait! That seat is mine.*",
          "好的一场戏要有一个**问题**：两个人物想要不同的东西，或者出了什么差错。这场戏展现问题，让人物争论或尝试，最后给出某种结果。每句台词都要用**剧本格式**写：*MAYA: (running up the steps) Wait! That seat is mine.*",
        ),
        writingGenerator(
          t(
            "Write a short script of one scene in English, in script format, with a problem between the characters.",
            "用英语写一场戏的短剧本，使用剧本格式，人物之间要有一个问题。",
          ),
          scriptBank,
          ["g4-script-format", "g4-script-conflict", "g4-script-dialogue"],
          { minWords: 50, maxChars: 2000 },
          onePiece,
        ),
      ),
      point(
        "dialogue-and-directions",
        t("Dialogue and Directions", "对话和舞台说明"),
        t(
          "In a script there is no narrator, so the **dialogue** must show who the characters are: a shy boy says *Um... I don't want to take someone's seat.* **Stage directions** in brackets tell the actors what to do and how to speak: *(quietly, not moving)*, *(smiling for the first time)*.",
          "剧本中没有叙述者，所以**对话**必须表现出人物是什么样的人：害羞的男孩会说 *Um... I don't want to take someone's seat.* 括号中的**舞台说明**告诉演员做什么、怎么说：*(quietly, not moving)*、*(smiling for the first time)*。",
        ),
        writingGenerator(
          t(
            "Write a short script of one scene in English whose dialogue shows who the characters are, with stage directions for the actors.",
            "用英语写一场戏的短剧本，用对话表现人物，并为演员写上舞台说明。",
          ),
          sceneBank,
          ["g4-script-dialogue", "g4-script-directions", "g4-script-format"],
          { minWords: 50, maxChars: 2000 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-biography-paragraph",
    title: t("Writing About a Life", "写人物生平"),
    summary: t(
      "Write a paragraph from notes about a person who made a difference: who they were, the key events of their life in order, facts from the notes and why their work still matters.",
      "根据笔记写一个段落，介绍一位改变了世界的人：他们是谁，按顺序写出生平大事，事实来自笔记，并说明他们的成就为什么至今仍然重要。",
    ),
    prerequisites: ["writing-a-paragraph", "biography-or-autobiography", "turning-notes-into-sentences"],
    encompasses: [{ topic: "turning-notes-into-sentences", weight: 0.3 }],
    xp: 22,
    strand: "writing",
    criteria: ["g4-bio-person", "g4-bio-order", "g4-bio-facts", "g4-bio-importance"].map(criterion),
    knowledgePoints: [
      point(
        "who-they-were-and-why-they-matter",
        t("Who They Were and Why They Matter", "他们是谁，为什么重要"),
        t(
          "A paragraph of biography opens by saying **who the person was** and what they are known for: *Marie Curie was a scientist known for her discoveries about radioactivity.* It ends by saying **why their work still matters** today. In between, it turns the notes into sentences, keeping every fact as the notes give it.",
          "人物生平段落开头说明**这个人是谁**、以什么闻名：*Marie Curie was a scientist known for her discoveries about radioactivity.* 结尾说明**他们的成就为什么至今仍然重要**。中间把笔记写成句子，每个事实都和笔记一致。",
        ),
        writingGenerator(
          t("Use the notes to write a paragraph in English about the person.", "根据笔记，用英语写一个介绍这个人的段落。"),
          bioBank,
          ["g4-bio-person", "g4-bio-facts", "g4-bio-importance"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
      point(
        "the-events-of-a-life-in-order",
        t("The Events of a Life in Order", "按顺序写生平大事"),
        t(
          "Notes are not always in order. Before you write, find the **year or age** of each event and put them in time order, starting with the birth. Words such as *as a girl*, *later*, *in 1960* and *two years later* help the reader follow the life from one event to the next.",
          "笔记不一定是按顺序排的。动笔之前，找出每件事的**年份或年龄**，按时间顺序排好，从出生开始。*as a girl*、*later*、*in 1960*、*two years later* 这样的词帮助读者从一件事跟到下一件事。",
        ),
        writingGenerator(
          t(
            "Use the notes to write a paragraph in English about the person, telling the events in order.",
            "根据笔记，用英语写一个介绍这个人的段落，按顺序讲述事件。",
          ),
          bioOrderBank,
          ["g4-bio-order", "g4-bio-facts", "g4-bio-person"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
    ],
  },
];
