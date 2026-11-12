// Grade 8: writing judged by a model, part two: a scene for the stage, a reflective essay and an essay on a retold
// tale.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";
import { limits } from "./writing-judged-a.ts";

/** sceneBank gives the situation of a scene to write for the stage. */
const sceneBank: readonly WritingItem[] = [
  {
    task: "Write a scene for the stage. Situation: Two young actors at the Globe Theatre in 1600 both want the part of Juliet. The company's leader will decide tonight.",
    model:
      "(The tiring-house behind the stage of the Globe. Costumes hang from hooks. NED, fourteen, holds a long blue dress. TOM, thirteen, enters quickly.)\nTOM: (stopping short) That's Juliet's dress.\nNED: (holding it against himself) And it fits me. Master Burbage will see that.\nTOM: (stepping closer) It fits anyone who stands still. Juliet has to weep. Can you weep, Ned?\nNED: (laughing, too loudly) I can weep when I like.\nTOM: (quietly) Then do it now.\n(A long pause. NED stares at the dress. His lip trembles, but no tears come. He turns away.)\nNED: (his voice breaking) My voice is going. Did you know that? By spring, I'll sound like my father. This is my last chance to play a girl.\n(TOM lowers his eyes. Outside, a trumpet sounds: the play is about to begin.)\nTOM: (after a moment) Then you should have it.\nNED: (turning, surprised) You'd give it up?\nTOM: (taking the dress and folding it gently over NED's arm) You just wept, Ned. Go and show him.\n(NED looks at him, then hurries out. TOM sits alone among the costumes as the crowd roars.)",
  },
  {
    task: "Write a scene for the stage. Situation: A queen's adviser must tell her that the ship carrying her son has been lost at sea, but the queen refuses to believe him.",
    model:
      '(A throne room at night. Candles burn low. The QUEEN stands at a tall window, looking out at the sea. LORD HALE enters, holding a letter. He stops at a distance and bows.)\nHALE: Your Majesty. A letter from the harbor.\nQUEEN: (without turning) The Swan has come in. I saw a sail at sunset.\nHALE: (hesitating) That was a fishing boat, madam.\nQUEEN: (turning sharply) Then read the letter.\n(HALE unfolds it slowly. His hands shake.)\nHALE: (reading) "The Swan was seen in the storm off the northern rocks. No boat has found her since."\nQUEEN: (crossing to him and snatching the letter) Seen. Not sunk. Not found. You bring me nothing.\nHALE: (gently) Madam, it has been nine days.\nQUEEN: (crumpling the letter and throwing it into the fire) He swims better than any man in the kingdom. I taught him myself.\n(The letter flares and burns. The QUEEN watches it. Slowly, her hand goes to her mouth. She sinks onto the step of the throne.)\nQUEEN: (barely audible) Leave the candles burning, Hale. All of them. He will need the light to find the harbor.\n(HALE bows and does not move. The wind rises outside. Lights fade.)',
  },
  {
    task: "Write a scene for the stage. Situation: The children of two feuding families meet secretly in an orchard, and one of them must decide whether to warn the other of an attack planned for tonight.",
    model:
      "(An orchard at dusk. Apple trees, a low stone wall. ROSA, fifteen, waits by the wall, looking over her shoulder. A whistle offstage. MARCUS climbs over the wall.)\nMARCUS: (dropping down, smiling) You came. I thought your brothers would be watching.\nROSA: (not smiling) They are busy tonight.\nMARCUS: (noticing her face) What's wrong?\nROSA: (turning away, pulling a leaf from a branch and tearing it into pieces) Nothing.\nMARCUS: Rosa.\n(A dog barks in the distance. ROSA flinches.)\nROSA: (quickly) If I told you something, and it meant betraying my family, would you think less of me?\nMARCUS: (slowly) That depends on what it is.\nROSA: (facing him) They are going to burn your father's barn. Tonight, at midnight. They say he burned ours.\n(MARCUS steps back as if struck.)\nMARCUS: He didn't. I swear he didn't.\nROSA: (taking his hands) I know. That's why I'm telling you. Go home. Move the horses.\nMARCUS: (pulling free, then stopping) And if they find out it was you?\nROSA: (lifting her chin) Then they will know that I chose what was right.\n(MARCUS climbs the wall and is gone. ROSA stands alone. Far away, a bell strikes eleven.)",
  },
  {
    task: "Write a scene for the stage. Situation: A playwright's apprentice discovers that his master has copied a scene from another writer's play, and confronts him before opening night.",
    model:
      "(A cramped room above a tavern. Papers cover a table. WILL, an old playwright, writes by candlelight. KIT, his apprentice, enters holding two sheets of paper.)\nKIT: (setting the sheets side by side on the table) Master, look at these.\nWILL: (without looking up) Not now, Kit. We open tomorrow.\nKIT: (firmly) That's why it must be now.\n(WILL sighs, puts down his pen and looks. His face goes still.)\nKIT: This one is your new scene. This one is from Master Greene's play, printed last year. They are the same, word for word.\nWILL: (pushing the papers away) Greene is dead. He cannot mind.\nKIT: (leaning on the table) His widow can. She sells his plays to feed her children.\nWILL: (standing, angry) And who will feed mine if this play fails? I had nothing left, Kit. Nothing.\n(Silence. Below, someone laughs in the tavern. WILL sinks back into his chair and covers his face.)\nKIT: (softly) Then write something new tonight. I'll stay up with you.\nWILL: (looking up at last) One night, for a whole scene?\nKIT: (pulling up a stool and dipping a pen in the ink) You wrote a whole act in one night once. You told me so.\n(WILL hesitates, then takes a fresh sheet. The candle burns down as they write.)",
  },
  {
    task: "Write a scene for the stage. Situation: A young servant in a royal court overhears a plot against the king and must decide whether to tell the king's suspicious steward.",
    model:
      "(A dark corridor in a castle. A torch burns on the wall. ELLEN, a servant girl, carries a tray of cups. She stops suddenly as voices come from behind a door.)\nVOICE: (offstage, low) At the feast. In his wine. No one will know.\n(ELLEN freezes. The cups rattle on the tray. She steadies it, backs away and turns to run, but walks straight into STEWARD CRANE.)\nCRANE: (grabbing her arm) Why are you shaking, girl?\nELLEN: (looking at the door, then at him) I dropped a cup, sir.\nCRANE: (glancing at the full tray) You have every cup.\n(A pause. ELLEN looks at his hand on her arm.)\nELLEN: (quietly) If a servant heard something, sir, something dangerous, would anyone believe her?\nCRANE: (narrowing his eyes) That depends on whether she is lying.\nELLEN: (lifting her chin) Then I won't say it to you. I will say it to the king.\nCRANE: (letting go of her arm, surprised) You would go to the king himself?\nELLEN: If I must.\n(Behind the door, footsteps approach. CRANE pulls ELLEN into the shadows as the door opens and a cloaked man slips past. CRANE watches him go, then turns to her.)\nCRANE: (very quietly) Come. We will both see the king.",
  },
  {
    task: "Write a scene for the stage. Situation: On the night before she leaves to study in another city, a girl tells her father, a fisherman who never went to school, that she is afraid to go.",
    model:
      "(A small kitchen. A suitcase stands by the door. A lamp on the table. FATHER mends a fishing net. MEI sits opposite him, not eating.)\nFATHER: (without looking up) Eat. The train is early.\nMEI: (pushing her bowl away) I'm not hungry.\n(FATHER's hands stop on the net. He looks at her.)\nFATHER: You've been packed for a week. You were singing yesterday.\nMEI: (standing and going to the suitcase) Yesterday it was far away. Now it's tomorrow.\n(She kneels and begins to unbuckle the suitcase.)\nFATHER: (rising) What are you doing?\nMEI: (her hands shaking) Everyone there will know more than me. They'll know how to talk and what to wear. They'll know I'm a fisherman's daughter.\n(Silence. FATHER crosses to her slowly. He kneels beside her, buckles the suitcase again and rests his rough hand on it.)\nFATHER: When I first went out alone on the boat, I was sick with fear. I didn't know the currents. I didn't know the rocks.\nMEI: (quietly) What did you do?\nFATHER: I learned them. (He lifts her chin.) You know how to learn. That's all you need.\n(MEI looks at him, then nods. FATHER returns to his net. MEI picks up her bowl and eats. The lamp burns low.)",
  },
  {
    task: "Write a scene for the stage. Situation: Two actors rehearse a sword fight for a play, but one of them has real anger at the other because of a part he lost.",
    model:
      "(An empty stage in the afternoon. Wooden swords lie on a bench. JAMES and OWEN, both sixteen, face each other with swords raised.)\nJAMES: (lowering his sword) Slower, Owen. It's only a rehearsal.\nOWEN: (raising his sword again) Tybalt doesn't fight slowly.\n(They clash. OWEN swings hard. JAMES stumbles back against the bench.)\nJAMES: (rubbing his wrist) That hurt.\nOWEN: (circling him) Romeo's supposed to win. Show me.\n(They fight again. OWEN strikes the sword from JAMES's hand. It clatters across the floor. JAMES does not pick it up.)\nJAMES: (quietly) This isn't about the fight.\nOWEN: (his sword still raised) You knew I wanted Romeo. I learned every line.\nJAMES: I didn't ask for it. Mr. Bell chose.\nOWEN: (throwing down his sword) Because your father pays for the costumes.\n(Silence. JAMES walks slowly to his sword, picks it up and holds it out to OWEN, handle first.)\nJAMES: Then play Romeo in the Thursday show. I'll tell Mr. Bell I'm sick.\nOWEN: (staring at the sword) Why would you do that?\nJAMES: Because you learned every line. I still don't know half of mine.\n(OWEN takes the sword. For the first time, he laughs. Lights fade.)",
  },
  {
    task: "Write a scene for the stage. Situation: A prince who has been told he will one day be king admits to his old tutor that he does not want the crown.",
    model:
      "(A library in a palace. Rain against the windows. The old TUTOR sits reading. PRINCE EDMUND, seventeen, enters in a heavy ceremonial robe and stands by the fire.)\nTUTOR: (closing his book) The fitting is over, then.\nEDMUND: (pulling at the robe's collar) It weighs as much as a horse.\nTUTOR: (smiling) The crown weighs more.\n(EDMUND turns from the fire. He takes off the robe and lets it fall to the floor.)\nEDMUND: I don't want it.\n(The TUTOR's smile fades. He stands slowly.)\nTUTOR: The robe, or the crown?\nEDMUND: (crossing to the window) Either. Both. My brother wanted it. He'd have been good at it. And then the fever took him, and now everyone looks at me as if I'm him.\nTUTOR: (picking up the robe and folding it) Do you know why your brother would have been a good king?\nEDMUND: (bitterly) Because he was brave.\nTUTOR: Because he was afraid, and he went on anyway. (He holds out the robe.) A man who wants a crown too much should never wear one.\n(EDMUND looks at the robe for a long moment. Thunder rumbles. Slowly, he takes it.)\nEDMUND: (quietly) Teach me, then. Everything he knew.\n(The TUTOR nods and opens his book. Lights fade on them, side by side.)",
  },
  {
    task: "Write a scene for the stage. Situation: During a performance, the actor playing a ghost falls ill backstage, and the young prompter, who knows every line, is told to go on in his place.",
    model:
      "(Backstage, during a play. Through a gap in the curtain, light and the murmur of an audience. The OLD ACTOR lies on a bench, coughing. SAM, the prompter, fourteen, holds the script. The STAGE MANAGER rushes in.)\nSTAGE MANAGER: (to the OLD ACTOR) The ghost is on in two minutes!\nOLD ACTOR: (trying to rise, then falling back) I cannot stand, let alone walk.\nSTAGE MANAGER: (turning, desperate) Who knows the ghost's lines?\n(Silence. SAM looks down at the script in his hands. Slowly, he raises one hand.)\nSAM: I do. I know everyone's lines.\nSTAGE MANAGER: (staring at him) You're a boy.\nSAM: (quietly) A ghost doesn't have to be tall. Only frightening.\n(The OLD ACTOR laughs weakly and pulls a gray sheet from his costume. He holds it out.)\nOLD ACTOR: Then be frightening. Walk slowly. Never blink. And when you speak, speak as if you have been waiting a hundred years.\n(SAM takes the sheet and pulls it over his head. A drum sounds three times onstage: the ghost's cue.)\nSTAGE MANAGER: (whispering) Go.\n(SAM walks slowly through the curtain. A gasp from the audience. The STAGE MANAGER and the OLD ACTOR listen as a clear, cold voice begins to speak.)",
  },
  {
    task: "Write a scene for the stage. Situation: A woman disguised as a man to serve as a lawyer in court is recognized by her own brother, who is the accused.",
    model:
      "(A courtroom. A judge's bench, an empty chair for the accused. CLARA, in a lawyer's black robe and wig, stands reading papers. Guards bring in her brother, DANIEL, in chains, and leave.)\nDANIEL: (sitting, not looking at her) They tell me you're my lawyer. You look young.\nCLARA: (keeping her voice low and rough) Young enough to win.\n(DANIEL glances up. He frowns, then stares. CLARA turns quickly back to her papers.)\nDANIEL: (slowly) You have a scar on your left hand. Just there. My sister has one. She got it climbing our neighbor's fence.\n(CLARA's hand freezes on the paper. She hides it in her sleeve.)\nCLARA: (still in the low voice) Many people have scars.\nDANIEL: (leaning forward, whispering) Clara. If they find out, they'll put you in prison beside me.\nCLARA: (dropping the false voice, fierce and quick) And if I hadn't come, they would hang you. No lawyer in this city would take your case. So I took it.\n(A door opens offstage. Footsteps. DANIEL sits back, his face wet.)\nDANIEL: (barely moving his lips) Then win.\nCLARA: (straightening her wig and raising her voice again) All rise.\n(The JUDGE enters. CLARA steps forward to face him. Lights narrow to her alone.)",
  },
];

/** reflectionBank gives notes on an experience for a reflective essay. */
const reflectionBank: readonly WritingItem[] = [
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: moved to a new country at age eleven; on the first day, a classmate laughed at your lunch of dumplings; you ate in the toilets for a week; a month later, the same classmate asked to try one; now you bring extra to share.",
    model:
      'When I moved to a new country at eleven, I believed that fitting in meant hiding everything that made me different. A box of dumplings taught me otherwise.\n\nOn my first day at school, I opened my lunch and the smell of ginger and pork filled the table. A boy named Liam laughed and held his nose. Everyone looked at me. My face burned, and I closed the box without eating.\n\nFor the next week, I ate my lunch in the toilets, alone, where no one could see. I told myself that I would ask my mother for sandwiches, like everyone else\'s.\n\nThen, a month later, Liam sat down beside me in the library. He looked embarrassed. "Those things you had," he said. "Do they taste as good as they smell?"\n\nAt the time, I thought I had to choose between my old life and my new one. Now I understand that the two can sit at the same table. These days, I bring extra dumplings, and there is always someone waiting to try one. What I was ashamed of became a way to make friends.',
  },
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: your grandfather came to this country with one suitcase; you thought his stories about the old village were boring; he became ill; you recorded him telling the stories; after he died, the recordings were the most precious thing your family had.",
    model:
      "For most of my childhood, my grandfather's stories were the price I paid for visiting him. Only after he was gone did I understand that they were a gift.\n\nGrandpa came to this country with one suitcase, and he never stopped talking about the village he had left. He described its well, its market and the mountain behind it. I would nod and look at my phone, wishing he would talk about something real.\n\nWhen he became ill, my mother asked me to sit with him in the afternoons. To pass the time, I started recording him on my phone. He told me about the night the river flooded and the year the village had no rice. His voice was weak, but his eyes shone.\n\nGrandpa died that winter. At the funeral, my family played the recordings, and everyone cried. My aunt said they were the most precious thing we owned.\n\nI used to think that the past was something old people talked about because they had nothing new to say. Now I know that it was everything he had carried in that suitcase, and that I almost let it go unheard.",
  },
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: at age twelve, you translated for your parents at the doctor, the bank and the landlord; you felt proud but also angry that you had to grow up fast; once you made a mistake that cost them money; your mother said she was proud of you anyway; now you volunteer helping new arrivals.",
    model:
      'At twelve, I became my family\'s voice. It made me proud, it made me angry, and in the end it showed me what I want to do with my life.\n\nMy parents spoke little English when we arrived, so I went everywhere with them: to the doctor, the bank and the landlord\'s office. I learned words like "deposit" and "prescription" before I learned the words for my school subjects. Adults spoke to me as if I were one of them.\n\nSometimes I resented it. My friends were playing football while I sat in waiting rooms. Then, one day at the bank, I misunderstood a form, and my parents lost money they could not afford to lose. I cried all the way home.\n\nThat night, my mother sat on my bed. "You carry us," she said. "I am proud of you, even on the days you stumble."\n\nThen, I thought translating was a burden I had been given unfairly. Now I see that it taught me how frightening it is to be lost in a new language. That is why, every Saturday, I volunteer helping new families fill in their forms, so that their children do not have to carry the weight alone.',
  },
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: you refused to speak your family's language at home, wanting to be like your friends; your grandmother, who spoke no English, came to live with you; you could not talk to her; you began to learn the language again; at her birthday you gave a short speech in it, and she cried.",
    model:
      "For years, I refused to speak my family's language at home. I thought it was the thing that kept me from belonging. It took my grandmother to show me that it was also the thing that let me belong.\n\nWhen I was nine, I decided I would speak only English, like my friends. My parents kept speaking to me in Tagalog, but I answered in English, and slowly I forgot the words.\n\nThen my grandmother came to live with us. She spoke no English at all. She would smile at me across the dinner table and ask me questions, and I could only shrug. I felt like a stranger in my own kitchen.\n\nOne night, I heard her singing alone in her room and realized I did not understand a single word. The next morning, I asked my mother to teach me again. It was slow and embarrassing, but every week I understood more.\n\nOn my grandmother's eightieth birthday, I stood up and gave a short speech in Tagalog. She covered her face and cried.\n\nI used to believe that I had to choose one language. Now I know that each one opens a different door, and I nearly locked one forever.",
  },
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: your family ran a small restaurant; you hated working there on weekends; one night a customer who had arrived as a refugee told you your food tasted like home; you realized the restaurant was more than a business.",
    model:
      'For years, I thought of my family\'s restaurant as a prison with tables. One night, a stranger changed how I saw it.\n\nEvery Saturday and Sunday, while my friends went to the cinema, I carried plates, wiped tables and washed pots until my hands wrinkled. The kitchen was hot and loud, and I smelled of frying oil all weekend. I counted the hours until I could leave for university and never come back.\n\nThen, one rainy evening, an old man sat alone at the corner table. He ordered my mother\'s lentil soup. When I brought him the bill, his eyes were wet. He told me that he had fled his country thirty years ago and had never found this taste again. "Your mother cooks like my mother," he said. "For an hour, I was home."\n\nI went into the kitchen and watched my mother stirring the pot, and I saw her differently. She was not just running a business. She was keeping a whole lost world alive, one bowl at a time.\n\nI still do not want to run a restaurant. But now I understand that food can carry memory, and that my weekends were part of something that mattered.',
  },
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: at thirteen, you went back to visit the country your parents came from; you expected to feel at home; instead people said you had a foreign accent; you felt you belonged nowhere; on the flight home you decided you could belong to both places.",
    model:
      'At thirteen, I flew to the country my parents had left, expecting to feel that I had finally come home. Instead, I felt like a visitor in both of my worlds.\n\nAll my life, my parents had talked about Lagos: the noise of the markets, the taste of street food, the warmth of the family I had never met. I imagined stepping off the plane and feeling, at last, that I belonged.\n\nMy cousins welcomed me with hugs and enormous meals. But when I spoke, they laughed. "You sound like an American," they said. In the market, a woman asked where I was visiting from. I was hurt. At home, my classmates thought I was different because of my parents. Here, my family thought I was different because of me.\n\nFor the first week, I felt as if I belonged nowhere. Then, on the flight home, I looked down at the ocean between the two countries and had a different thought. Perhaps I did not have to choose.\n\nThen, I believed that belonging meant fitting perfectly into one place. Now I think it can mean carrying two places with me, and being at home in the space between them.',
  },
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: when you arrived in the new country, a librarian helped you find books in your language; you went to the library every day; you learned English by reading picture books with her; years later you went back to thank her, and she had kept your first drawing.",
    model:
      "In my first lonely months in a new country, the place that saved me was a library, and the person who saved me was a librarian named Mrs. Ruiz.\n\nI arrived at ten, speaking almost no English. At school, I sat silently while the other children talked around me. One afternoon, my mother took me to the public library, and I wandered among the shelves, unable to read a single title.\n\nMrs. Ruiz noticed me. Without a word, she led me to a small shelf of books in Arabic, and I nearly cried with relief. After that, I went every day. She began sitting with me at a low table, reading picture books in English and pointing at each word. Slowly, the words began to make sense.\n\nLast year, I went back to thank her. She smiled, opened a drawer and took out a crayon drawing of a girl holding a book. I had given it to her when I was ten.\n\nBack then, I thought she was simply doing her job. Now I understand that she chose to notice a lonely child, and that small kindness opened the door to a whole new language and life.",
  },
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: your older brother left home to work in another country to send money back; you were angry that he left; you did not answer his letters; he sent you a phone; when you finally called him, you learned how lonely he was.",
    model:
      'When my brother left home to work abroad, I decided that he had abandoned us. It took a phone call to show me how wrong I was.\n\nI was eleven when Ahmed packed his bag and took the bus to the airport. He was going to work on building sites in another country and send money home. Everyone said he was brave. I said nothing. I went to my room and refused to say goodbye.\n\nFor a year, he wrote me letters, and I did not answer one. When my mother read them aloud, I left the room. Then, on my birthday, a parcel arrived from him. Inside was a phone and a note: "Call me. Any time."\n\nI waited a week before I did. When he answered, his voice was tired. He told me he shared a room with eight men, worked twelve hours in the heat and ate dinner alone. "I keep your school photo by my bed," he said.\n\nI had thought he left because he wanted to. Now I know that he left because he loved us, and that every month of my silence had made his loneliness worse. We talk every Sunday now.',
  },
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: your family's new home was in a cold northern city; you hated the snow and the dark winters; your neighbor, an old woman, taught you to skate; by the second winter, you looked forward to the frozen lake.",
    model:
      'When my family moved from a warm coastal city to a cold northern one, I thought winter was a punishment. An old woman next door taught me that it could also be a gift.\n\nOur first winter was a shock. The sun set before four o\'clock, and the wind cut through my thin coat like a knife. Snow piled against the door. I stayed inside, missing the beach, and counting the days until spring.\n\nOur neighbor, Mrs. Lindqvist, was eighty years old and walked everywhere in the snow. One Saturday, she knocked on our door holding a pair of old skates. "The lake is frozen," she said. "Come."\n\nI fell more times than I could count. The ice was hard, and my knees were bruised. But she held my hands and skated backward in front of me, laughing, until I could glide alone. Under the gray sky, with the snow squeaking under my blades, I felt free for the first time since we had arrived.\n\nBy the second winter, I was the one knocking on her door. I used to think that a new place had to feel like the old one before I could love it. Now I know that it only needs someone to show you its beauty.',
  },
  {
    task: "Write a reflective essay from these notes, as if they were your own experience. Notes: you entered a speech contest in your new school's language; you forgot your words halfway through; some students laughed; your teacher told you to start again; you finished, and came last, but you were proud.",
    model:
      'The worst two minutes of my first year in a new country were spent in front of an audience, with my mind completely blank. They turned out to be some of the most important minutes of my life.\n\nI had lived in Spain for only eight months when my teacher suggested that I enter the school\'s speech contest. My Spanish was still clumsy, but I practiced every night, saying my speech to the mirror until I knew it by heart.\n\nOn the day of the contest, I walked onto the stage, looked at the rows of faces and began. Halfway through, the words simply vanished. The silence stretched. A few students in the back began to giggle, and my eyes stung.\n\nThen my teacher, Señora Vidal, stood up at the side of the hall. "Start again," she said calmly. "We have time."\n\nSo I did. My voice shook, but I finished every word. I came last out of twelve.\n\nAt the time, I thought I had failed in front of the whole school. Now I see that I learned something better than winning. I learned that I could fall apart in public, take a breath, and begin again.',
  },
];

/** retoldBank gives an old tale and a modern story that retells it, for an essay. */
const retoldBank: readonly WritingItem[] = [
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: Cinderella, a kind girl mistreated by her stepfamily, is helped by magic to attend a ball, wins the prince's love and is rescued from her life. Modern story: Ella, a girl who repairs bicycles in her stepmother's shop, enters a city cycling race in secret, wins it with a bike she built herself and uses the prize to open her own shop.",
    model:
      "The modern story of Ella keeps the shape of the Cinderella tale but changes how its heroine escapes, and that change gives the story a different message.\n\nLike Cinderella, Ella is mistreated by her stepfamily. She works long hours in her stepmother's bicycle shop, just as Cinderella scrubs floors. Both girls attend a great event in secret, the ball in one story and the city cycling race in the other, and both are transformed by what happens there.\n\nThe key difference is the source of the transformation. Cinderella is saved by magic and by a prince. A fairy godmother gives her a dress, and marriage rescues her from her life. Ella, by contrast, wins the race on a bike she built herself and uses the prize to open her own shop. No one rescues her; she rescues herself.\n\nThis change shifts the meaning of the story. The old tale suggests that a good girl will be rewarded if she waits patiently for help. The modern story suggests that skill and hard work can change a person's life. By replacing the prince with a prize she earns, the writer turns a story about luck into a story about independence.",
  },
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: In the Greek myth, Icarus flies too close to the sun on wings of wax made by his father, Daedalus, ignores his warnings, and falls into the sea. Modern story: Ikaika, a young engineer, builds a solar-powered glider, ignores her mentor's warning about the battery, flies too high and crashes, but survives and redesigns the glider with her mentor.",
    model:
      "The modern story of Ikaika retells the myth of Icarus, keeping its warning about pride while changing its ending to make room for learning.\n\nThe two stories follow the same pattern. In the myth, Icarus flies on wings of wax built by his father, Daedalus, who warns him not to fly too close to the sun. In the modern story, Ikaika flies a solar glider and ignores her mentor's warning about the battery. Both young flyers are thrilled by their new power, climb too high and crash.\n\nThe great difference is the ending. Icarus falls into the sea and drowns; his story ends with his mistake. Ikaika crashes but survives, and she goes back to work with her mentor to redesign the glider. Her failure becomes the start of something better.\n\nThis change alters the lesson of the story. The old myth warns that pride and disobedience lead to destruction, and it treats limits as something people must respect. The modern story agrees that ignoring advice is dangerous, but it adds that mistakes can teach us. By letting Ikaika live, the writer turns a tragedy into a story about how engineers, and people, grow through failure.",
  },
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: In Little Red Riding Hood, a girl walking through the woods to her grandmother's house is tricked by a wolf, who eats her grandmother, and she is saved by a passing woodcutter. Modern story: Ruby, a girl on her way to her grandmother's flat, is followed online by a stranger pretending to be a friend; she notices the lies in his messages, warns her grandmother and reports him to the police herself.",
    model:
      "The modern story of Ruby retells Little Red Riding Hood, moving the danger from the woods to the internet and turning the helpless girl into the one who saves the day.\n\nThe story keeps the pattern of the old tale. Like Red Riding Hood, Ruby is on her way to her grandmother's home. In both stories, a stranger pretends to be something he is not: the wolf disguises himself as the grandmother, and the man online pretends to be Ruby's friend. Both tales warn about trusting strangers who hide their true intentions.\n\nHowever, the modern story makes two important changes. First, it moves the setting. The dark forest becomes the online world, a place where young people today can meet hidden dangers. Second, it changes who solves the problem. Red Riding Hood is saved by a woodcutter who happens to pass by. Ruby notices the lies herself, warns her grandmother and reports the man to the police.\n\nThese changes give the story a new meaning. The old tale teaches girls to be obedient and to stay on the path. The modern story teaches them to pay attention and to act, showing that a young person can be alert and brave rather than simply a victim waiting for rescue.",
  },
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: In the story of King Midas, a greedy king wishes that everything he touches will turn to gold, and his wish becomes a curse when his food and even his daughter turn to gold. Modern story: Max, a teenager, gains millions of followers online by posting every moment of his life; soon he cannot eat a meal or talk to his sister without filming it, and he loses his closest friend.",
    model:
      "The modern story of Max retells the myth of King Midas, replacing gold with online fame while keeping the old warning that getting everything you want can destroy what matters most.\n\nThe pattern of the two stories is the same. Midas wishes that everything he touches will turn to gold, and at first he is delighted. Max wants followers, and he gains millions by posting every moment of his life. In both stories, the gift turns into a curse. Midas cannot eat because his food turns to gold. Max cannot eat a meal without filming it.\n\nThe modern story changes what the hero desires. Midas wants wealth, a goal people have always understood. Max wants attention, a goal that belongs to our own time. The writer also changes the final loss. Midas turns his daughter into a golden statue, while Max loses his closest friend and cannot talk to his sister without his camera.\n\nThis change makes the old lesson feel urgent for modern readers. The myth warns against greed for money. By turning gold into followers, the modern story warns that the desire to be watched can be just as dangerous, slowly turning real relationships into something cold and lifeless.",
  },
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: In Beauty and the Beast, a young woman lives in the castle of a frightening beast to save her father, slowly sees his kindness, and her love breaks the spell that made him a beast. Modern story: Bella, a new student, is placed next to Damon, a boy everyone fears because of his scarred face and angry silence; she learns he is grieving his mother, becomes his friend, and he begins to speak in class again. There is no spell.",
    model:
      "The modern story of Bella and Damon retells Beauty and the Beast, keeping its message about looking past appearances but removing the magic to make the story more realistic.\n\nThe story follows the old tale closely. In both, a young woman is placed with someone everyone fears. Beauty must live in the Beast's castle, and Bella must sit next to Damon, whose scarred face and angry silence frighten the other students. In both stories, the heroine slowly discovers the kindness behind the frightening surface.\n\nThe biggest change is that there is no spell. The Beast is cursed, and Beauty's love transforms him back into a handsome prince. Damon is not under a curse; he is grieving the death of his mother. Bella's friendship does not change his face, but it helps him begin to speak in class again.\n\nRemoving the magic changes the meaning. In the old tale, the reward for Beauty's love is that the Beast becomes beautiful on the outside. The modern story suggests that people do not need to change how they look to be worth loving. What changes is how others see them. By leaving Damon's scars in place, the writer makes the lesson about appearances even stronger.",
  },
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: In the Pied Piper of Hamelin, a piper rids the town of rats with his music, but when the town refuses to pay him, he plays again and leads all its children away forever. Modern story: A young coder fixes a city's broken water system; when the city council refuses to pay her, she shuts down all the city's traffic lights until the council apologizes and keeps its promise.",
    model:
      "The modern story of the coder retells the Pied Piper of Hamelin, keeping the old tale's anger at broken promises but softening its terrible ending.\n\nThe pattern of the two stories is nearly the same. In Hamelin, a piper solves a serious problem, ridding the town of rats with his music. In the modern story, a young coder solves a different problem, fixing the city's broken water system. In both, the leaders refuse to pay what they promised, and the hero uses the same skill to strike back.\n\nThe stories differ most in how far the revenge goes. The Pied Piper leads all the children of Hamelin away forever, punishing innocent families for the council's dishonesty. The coder shuts down the city's traffic lights, causing chaos, but only until the council apologizes and pays her.\n\nThis change gives the modern story a different meaning. The old tale is a dark warning: break your word, and you may lose what you love most. The modern story still warns leaders to keep their promises, but it shows the hero wanting justice rather than cruelty. Her goal is to be treated fairly, not to destroy, so the story ends with the promise kept instead of with grief.",
  },
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: In the Chinese legend of Hua Mulan, a young woman disguises herself as a man to take her old father's place in the army, fights bravely for twelve years, and returns home, where her comrades are amazed to learn she is a woman. Modern story: Mia, a girl who wants to join her school's all-boys robotics team, enters under her brother's name, leads the team to a national prize and then reveals who she is on stage.",
    model:
      "The modern story of Mia retells the legend of Hua Mulan, moving the hero from the battlefield to a robotics competition while keeping the old tale's challenge to ideas about what girls can do.\n\nThe two stories share a clear pattern. Mulan disguises herself as a man to take her father's place in the army. Mia enters a competition under her brother's name to join an all-boys team. Both heroines succeed brilliantly in a world that would not have accepted them openly. Mulan fights bravely for twelve years, and Mia leads her team to a national prize.\n\nThe modern story changes the setting and the reason for the disguise. Mulan's disguise comes from duty: she wants to protect her old father. Mia's disguise comes from ambition: she simply wants to build robots. The ending changes too. Mulan's comrades discover the truth when she returns home. Mia chooses to reveal herself on stage, in front of everyone.\n\nThese changes shift the story's meaning. The legend honors a daughter's loyalty and courage. The modern story celebrates a girl's right to follow her own interests. By having Mia reveal herself in public, the writer turns a private surprise into a public challenge, showing that the problem was never Mia's ability, but the rule that kept her out.",
  },
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: In the fable of the tortoise and the hare, a proud, fast hare is so sure he will win a race that he falls asleep, and the slow, steady tortoise wins. Modern story: Two students prepare for an exam; the brilliant one stays up gaming, sure he can pass easily, and fails, while the steady one studies a little every day and passes, but then helps her friend study for the retake.",
    model:
      "The modern story of the two students retells the fable of the tortoise and the hare, keeping its lesson about steady effort but adding a new ending about kindness.\n\nThe pattern of the fable is easy to see. The hare is fast and proud, and he is so sure of winning that he falls asleep during the race. The brilliant student in the modern story is just as confident. He stays up gaming instead of studying, sure he can pass easily. Like the hare, he loses. Meanwhile, the steady student, like the tortoise, studies a little every day and succeeds.\n\nThe modern story makes one important change at the end. The fable stops when the tortoise wins, and the hare is left to learn his lesson in shame. In the modern story, the steady student does not simply enjoy her success. She helps her friend study for the retake.\n\nThis change adds a second lesson to the first. The old fable teaches that slow and steady effort beats careless talent, and it is a story about winners and losers. The modern story teaches that lesson too, but it suggests that success is better when it is shared. By turning a rival into a friend, the writer turns a contest into a story about helping others grow.",
  },
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: In the myth of Pandora's box, the first woman, Pandora, opens a jar she was told never to open, and all the evils of the world fly out; only hope remains inside. Modern story: Pan, a lab assistant, opens a sealed file of a scientist's secret research; it reveals that a company has been hiding pollution that made people sick; the truth causes a scandal and anger, but it also brings hope that the town can be cleaned.",
    model:
      "The modern story of Pan retells the myth of Pandora's box, but it turns the act of opening forbidden things from a terrible mistake into a brave choice.\n\nThe pattern of the old tale is clear in the new one. Pandora opens a jar that she was told never to open, and Pan opens a sealed file that she was not supposed to read. In both stories, the opening releases something harmful into the world. In the myth, it is all the evils of humanity. In the modern story, it is the truth about a company's hidden pollution, which causes scandal and anger.\n\nYet the modern story changes the meaning of what is released. In the myth, the evils did not exist in the world until Pandora let them out, so she is blamed for human suffering. In the modern story, the harm already existed: the pollution had been making people sick in secret. Pan does not create the evil; she exposes it.\n\nBoth stories end with hope, but the hope means something different. Pandora's hope is a small comfort left in an emptied jar. Pan's hope is practical: now that the truth is known, the town can be cleaned. The modern story suggests that sometimes opening the forbidden box is the only way to heal.",
  },
  {
    task: "Write an essay on how a modern story retells an old tale. Old tale: In the story of Rapunzel, a girl with long hair is locked in a tower by a witch and is rescued when a prince climbs her hair. Modern story: Rae, a girl kept at home by an overprotective mother after an illness, teaches herself to code and builds an online game; through it she makes friends around the world and finally convinces her mother to let her go to school.",
    model:
      "The modern story of Rae retells the tale of Rapunzel, turning the tower into an overprotective home and replacing the rescuing prince with the heroine's own skills.\n\nThe modern story keeps the central image of the old tale: a girl shut away from the world. Rapunzel is locked in a tower by a witch, and Rae is kept at home by her mother after an illness. Both girls live lonely lives, watching the world from a distance and longing to be part of it.\n\nThe story changes two things. First, the person keeping the girl inside is no longer a villain. The witch keeps Rapunzel for selfish reasons, but Rae's mother is acting out of love and fear. Second, the girl's escape comes from herself. Rapunzel waits until a prince climbs her hair. Rae teaches herself to code, builds a game, makes friends around the world and convinces her mother to let her go to school.\n\nThese changes make the story more realistic and give it a new message. The old tale suggests that a trapped girl must wait for someone to rescue her. The modern story shows that a young person can build her own way out, and that even loving walls must eventually open. Rae's long hair has become her own talent.",
  },
];

/** writingJudgedTopics8b are the topics of grade 8 whose writing a model judges, part two. */
export const writingJudgedTopics8b: readonly TopicDef[] = [
  {
    id: "writing-a-scene-for-the-stage",
    title: t("Writing a Scene for the Stage", "写一场舞台戏"),
    summary: t(
      "Write a scene in script format in which a conflict between characters reaches a turning point, with stage directions that show what the audience sees and hears.",
      "用剧本格式写一场戏：人物之间的冲突达到转折点，舞台说明要表现观众看到和听到的东西。",
    ),
    prerequisites: after("writing-stage-directions", "comparing-a-play-and-its-production"),
    encompasses: [{ topic: "writing-stage-directions", weight: 0.2 }],
    xp: 24,
    strand: "writing",
    criteria: ["g4-script-format", "g8-scene-turn", "g8-scene-shows"].map(criterion),
    knowledgePoints: [
      point(
        "conflict-and-turning-point",
        t("Conflict and Turning Point", "冲突与转折点"),
        t(
          "A good scene is built on **conflict**: two characters want different things, or one wants something the other is hiding. Let the conflict build through the dialogue until a **turning point**, a moment when something changes: a secret comes out, a choice is made, an enemy becomes an ally. End the scene soon after the turn.",
          "好的一场戏建立在**冲突**之上：两个人物想要不同的东西，或者一个人想要另一个人隐瞒的东西。让冲突在对话中逐步升级，直到**转折点**，即某件事发生变化的时刻：秘密被揭开、作出选择、敌人变成盟友。转折之后尽快结束这场戏。",
        ),
        writingGenerator(
          t(
            "Write the scene in English in script format, with a conflict that builds to a turning point.",
            "用英语以剧本格式写这场戏，让冲突逐步升级到转折点。",
          ),
          sceneBank,
          ["g8-scene-turn", "g4-script-format", "g8-scene-shows"],
          limits,
          onePiece,
        ),
      ),
      point(
        "directions-that-show",
        t("Directions That Show", "起展现作用的说明"),
        t(
          "On stage, the audience knows only what it can see and hear. Write stage directions in the **present tense** that turn feelings into actions: not *(She is afraid)* but *(Her hands shake; the cups rattle on the tray.)* Use directions for sounds and lights too, *(A bell strikes eleven.)*, and open the scene with a short direction that sets the place.",
          "在舞台上，观众只知道他们能看到和听到的东西。用**现在时**写舞台说明，把感受变成动作：不写 *(She is afraid)*，而写 *(Her hands shake; the cups rattle on the tray.)* 也用说明表示声音和灯光，如 *(A bell strikes eleven.)*，并在开场用一段简短的说明交代地点。",
        ),
        writingGenerator(
          t(
            "Write the scene in English in script format, with present-tense stage directions that show feelings through actions, sounds and lights.",
            "用英语以剧本格式写这场戏，用现在时的舞台说明，通过动作、声音和灯光表现感受。",
          ),
          sceneBank,
          ["g8-scene-shows", "g4-script-format", "g8-scene-turn"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-reflective-essay",
    title: t("Writing a Reflective Essay", "写反思性文章"),
    summary: t(
      "Write a reflective essay that tells a specific experience in detail, contrasts how you saw it then with how you see it now and ends with what it means.",
      "写一篇反思性文章：详细讲述一段具体经历，对比当时和现在的看法，并以它的意义作结。",
    ),
    prerequisites: after("interviewing-and-quoting-a-person", "comparing-a-memoir-and-a-report"),
    encompasses: [{ topic: "interviewing-and-quoting-a-person", weight: 0.2 }],
    xp: 24,
    strand: "writing",
    criteria: ["g8-reflect-moment", "g8-reflect-then-now", "g8-reflect-insight"].map(criterion),
    knowledgePoints: [
      point(
        "telling-the-moment",
        t("Telling the Moment", "讲述那个时刻"),
        t(
          "A reflective essay begins with **a specific experience**, told with concrete details: not *I felt left out at my new school*, but *A boy named Liam laughed and held his nose. Everyone looked at me.* Choose the moment when something shifted, tell it as a scene, and let a line of dialogue or a small detail carry the feeling.",
          "反思性文章从**一段具体经历**开始，用具体细节讲述：不写 *I felt left out at my new school*，而写 *A boy named Liam laughed and held his nose. Everyone looked at me.* 选择事情发生转变的那个时刻，把它写成一个场景，让一句对话或一个小细节承载感受。",
        ),
        writingGenerator(
          t(
            "Write a reflective essay in English from the notes, telling the key moment in specific detail and ending with what it means.",
            "根据笔记用英语写一篇反思性文章，用具体细节讲述关键时刻，并以它的意义作结。",
          ),
          reflectionBank,
          ["g8-reflect-moment", "g8-reflect-insight", "g8-reflect-then-now"],
          limits,
          onePiece,
        ),
      ),
      point(
        "then-and-now",
        t("Then and Now", "当时与现在"),
        t(
          "What makes an essay reflective is the distance between **then and now**. Say how you saw the experience at the time, and how you see it today: *At the time, I thought I had to choose between my old life and my new one. Now I understand that the two can sit at the same table.* End with the **insight**: what the experience taught you, beyond what happened.",
          "使文章具有反思性的，是**当时与现在**之间的距离。说出你当时如何看待这段经历，以及你今天如何看待它：*At the time, I thought I had to choose between my old life and my new one. Now I understand that the two can sit at the same table.* 以**感悟**结尾：这段经历教会了你什么，而不只是发生了什么。",
        ),
        writingGenerator(
          t(
            "Write a reflective essay in English from the notes, contrasting how you saw the experience then with how you see it now.",
            "根据笔记用英语写一篇反思性文章，对比你当时和现在对这段经历的看法。",
          ),
          reflectionBank,
          ["g8-reflect-then-now", "g8-reflect-insight", "g8-reflect-moment"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-an-essay-on-a-retold-tale",
    title: t("Writing an Essay on a Retold Tale", "写关于改编故事的文章"),
    summary: t(
      "Write an essay that explains how a modern story retells an old tale: the pattern it keeps, what it changes and what the change does to the meaning.",
      "写一篇文章，解释一个现代故事如何改编一个古老的故事：它保留了什么模式、改变了什么，以及这种改变对意义有什么影响。",
    ),
    prerequisites: after("how-modern-stories-use-old-tales", "writing-a-literary-analysis-paragraph"),
    encompasses: [{ topic: "how-modern-stories-use-old-tales", weight: 0.2 }],
    xp: 24,
    strand: "writing",
    criteria: ["g8-retold-pattern", "g8-retold-change", "g8-retold-meaning"].map(criterion),
    knowledgePoints: [
      point(
        "what-is-kept-and-what-is-changed",
        t("What Is Kept and What Is Changed", "保留了什么，改变了什么"),
        t(
          "An essay on a retold tale first shows the **pattern** the modern story keeps: the mistreated heroine, the warning ignored, the forbidden box opened. Then it identifies what the modern story **changes**: the setting, the hero, the ending. Give details from both stories side by side, with words such as *like*, *just as*, *by contrast* and *however*.",
          "关于改编故事的文章首先说明现代故事保留的**模式**：受虐待的女主角、被忽视的警告、被打开的禁忌之盒。然后指出现代故事**改变**了什么：背景、主人公、结局。把两个故事的细节并列，使用 *like*、*just as*、*by contrast*、*however* 等词。",
        ),
        writingGenerator(
          t(
            "Write an essay in English explaining what pattern the modern story keeps from the old tale and what it changes.",
            "用英语写一篇文章，解释现代故事保留了古老故事的什么模式、改变了什么。",
          ),
          retoldBank,
          ["g8-retold-pattern", "g8-retold-change", "g8-retold-meaning"],
          limits,
          onePiece,
        ),
      ),
      point(
        "what-the-change-means",
        t("What the Change Means", "改变意味着什么"),
        t(
          "Listing differences is not enough; the heart of the essay is **why the change matters**. Ask what lesson the old tale taught, and what the modern story teaches instead: *The old tale suggests that a good girl will be rewarded if she waits for help. The modern story suggests that skill and hard work can change a life.* End with that shift in meaning.",
          "仅仅列出差异是不够的；文章的核心是**改变为什么重要**。问问古老的故事教了什么道理，现代故事又改教了什么：*The old tale suggests that a good girl will be rewarded if she waits for help. The modern story suggests that skill and hard work can change a life.* 以意义的这种转变作结。",
        ),
        writingGenerator(
          t(
            "Write an essay in English explaining how the modern story's changes alter the meaning of the old tale.",
            "用英语写一篇文章，解释现代故事的改变如何改变了古老故事的意义。",
          ),
          retoldBank,
          ["g8-retold-meaning", "g8-retold-change", "g8-retold-pattern"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
