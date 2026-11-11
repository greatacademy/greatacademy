// Grade 4: the reading skills of plays: the parts of a script, telling a poem from a play and a story, turning a story
// into a script, and what characters say and think.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { fields, findKind, type Item, itemGenerator, type Kind, type KindSpec, nameKind, pick } from "./kit.ts";
import { after } from "./prior.ts";

// Parts of a play.

const scriptKinds: Readonly<Record<string, Kind>> = {
  "the cast of characters": {
    zh: "角色表",
    is: [
      "It lists the people of the play, often with a few words about each, before the play begins.",
      "它在剧本开头列出剧中人物，常常给每人附上几句介绍。",
    ],
  },
  "the setting of a scene": {
    zh: "场景说明",
    is: ["It tells where and when a scene takes place, and what the stage looks like.", "它说明一场戏发生的地点和时间，以及舞台的样子。"],
  },
  "a line of dialogue": {
    zh: "台词",
    is: ["It starts with a character's name and gives the words that character says aloud.", "它以角色的名字开头，写出这个角色说的话。"],
  },
  "a stage direction": {
    zh: "舞台指示",
    is: [
      "It is in brackets and tells the actors how to move or speak; it is not said aloud.",
      "它写在括号里，告诉演员怎样动作或说话；它不念出来。",
    ],
  },
};

const scriptLines = `
  CHARACTERS: MAYA, a girl of ten; GRANDPA, her grandfather; ROBO, a small robot.|the cast of characters
  SCENE 1: Grandpa's workshop, late at night. Tools hang on the walls, and a robot sits on the bench.|the setting of a scene
  MAYA: Grandpa, I think the robot just blinked at me!|a line of dialogue
  (Maya steps back and grabs Grandpa's arm.)|a stage direction
  CAST: THE QUEEN, who hates rain; THE GARDENER, who loves it; A LITTLE CLOUD.|the cast of characters
  SCENE 2: The palace garden on a gray morning. Dry flowers droop in their pots.|the setting of a scene
  QUEEN: Not one drop of rain shall fall on my palace again!|a line of dialogue
  (The Queen stamps her foot and points at the sky.)|a stage direction
  CHARACTERS: SAM and LILY, best friends; MR. PATEL, the lunch teacher.|the cast of characters
  SCENE 1: The school cafeteria at noon. Trays clatter, and children talk at long tables.|the setting of a scene
  SAM: I will trade you my apple for your cookie. Deal?|a line of dialogue
  (Lily looks at the cookie, then slowly shakes her head.)|a stage direction
  PEOPLE IN THE PLAY: THE DRAGON, who has a toothache; DR. FANG, a dentist; A NERVOUS NURSE.|the cast of characters
  SCENE 3: A dentist's office with a very, very large chair.|the setting of a scene
  DR. FANG: Open wide, please. Wider. Even wider!|a line of dialogue
  (The nurse hides behind the door, trembling.)|a stage direction
  CHARACTERS: JAY, a boy who lost his ticket; A CONDUCTOR; AN OLD WOMAN with a large hat.|the cast of characters
  SCENE 1: A crowded train station. A clock above the platform shows five minutes to ten.|the setting of a scene
  CONDUCTOR: Tickets, please! Have your tickets ready!|a line of dialogue
  (Jay pats every pocket, faster and faster.)|a stage direction
  CAST: THREE WISHES, played by three children in silver capes; TOM, who makes them.|the cast of characters
  SCENE 2: Tom's bedroom, the next morning. The room is full of ice cream.|the setting of a scene
  TOM: I wish I had never wished for ice cream!|a line of dialogue
  (He slips on a puddle of melted ice cream and falls.)|a stage direction
  CHARACTERS: MOM, DAD, and the twins, ROSA and RAUL.|the cast of characters
  SCENE 1: The living room during a storm. Suddenly, all the lights go out.|the setting of a scene
  RAUL: Who turned off the lights? This isn't funny!|a line of dialogue
  (In the dark, a flashlight clicks on under Rosa's chin.)|a stage direction
  CHARACTERS: THE HOST of the talent show; FOUR PERFORMERS; THE JUDGES.|the cast of characters
  SCENE 4: The school stage, just before the curtain rises. Performers wait in the wings.|the setting of a scene
  HOST: Welcome, everyone, to the greatest talent show on Earth!|a line of dialogue
  (The curtain rises, and a spotlight finds the host.)|a stage direction
  (She whispers, so the others cannot hear.)|a stage direction
`;

const directionLines = `
  (whispering)|Say the line very quietly.|Shout the line as loudly as possible.|Read the line aloud as a stage direction.
  (She tiptoes across the stage.)|Walk quietly on the tips of your toes.|Run quickly across the stage with loud, heavy steps.|Say the word tiptoes to the audience.
  (angrily, slamming the book down)|Speak in an angry voice and slam the book.|Open the book and read it quietly to yourself.|Hand the book gently to another actor.
  (He turns away and wipes his eyes.)|Turn your back and show that you are crying.|Turn to face the audience and laugh out loud.|Leave the stage at once.
  (Lights dim slowly.)|Nothing to say: the stage gets darker.|Say the word dim to the audience.|Switch on every single light on the stage at once.
  (She looks at the door, then back at her friend.)|Glance at the door, then at your friend.|Walk straight out through the door and leave.|Shut the door with a bang.
  (to the audience)|Speak this line facing the audience.|Speak this line only to another actor.|Leave out this line.
  (shaking with fear)|Tremble to show you are frightened.|Dance happily across the stage, smiling widely.|Stand still and look calm.
  (He jumps up from his chair.)|Rise quickly from your seat.|Sit down slowly in the chair and rest there.|Say the word jumps loudly.
  (pause)|Stop for a moment before going on.|Rush straight on and speak the next line very fast.|Say the word pause aloud.
  (laughing so hard she cannot speak)|Laugh too hard to get the words out.|Speak the whole line clearly in a calm voice.|Cry quietly in the corner.
  (A doorbell rings offstage.)|A sound is heard from out of sight.|An actor on the stage says ring ring loudly.|The door opens with no sound.
  (She hides the letter behind her back.)|Hold the letter behind you so no one sees it.|Open the letter and read it aloud to everyone.|Tear up the letter.
  (yawning and stretching)|Show that you are sleepy.|Show that you are very angry.|Show that you are hungry.
  (He counts the coins slowly, one by one.)|Count the coins slowly, showing care.|Throw all the coins up high into the air.|Put the coins away without looking.
  (proudly)|Speak in a pleased, proud voice.|Speak in a sad, quiet, slow voice.|Speak in a scared, shaky voice.
  (The two friends shake hands.)|Show that the friends make peace or agree.|Show that the friends start to fight.|Show that the friends do not know each other.
  (She stares at the empty box in shock.)|Look at the box, surprised and upset.|Open the box and smile happily at what is inside.|Hand the box to the audience.
  (sarcastically)|Say the line so it means the opposite.|Say the line exactly as you mean it, plainly.|Sing the line to a tune.
  (He drops to his knees.)|Kneel down suddenly.|Climb onto a chair.|Walk calmly offstage.
  (Thunder crashes. Everyone freezes.)|After a loud sound, all actors stop still.|All the actors run around the stage, shouting.|Everyone shouts the word thunder.
  (nervously, twisting her hands)|Speak nervously and twist your hands.|Speak boldly with your hands on your hips.|Wave cheerfully at the audience.
  (She exits, slamming the door.)|Leave the stage and slam the door.|Enter the stage quietly and close the door softly.|Open the door for another actor.
  (He enters, carrying a huge cake.)|Come onto the stage holding a big cake.|Leave the stage after eating the whole cake.|Point to a cake already on the table.
  (softly, to herself)|Say the line quietly, as if no one else hears.|Shout the line loudly to everyone on the stage.|Say nothing at all.
  (The robot's eyes light up.)|The robot's lights come on.|The robot falls apart.|The robot says the words light up.
  (excitedly, bouncing on his toes)|Speak with excitement and bounce.|Speak slowly and sadly, looking at the floor.|Sit still and say nothing.
  (They all turn to look at Maya.)|Everyone looks toward Maya.|Everyone walks away from Maya.|Maya leaves the stage.
  (She pretends to be asleep.)|Close your eyes and act as if sleeping.|Really fall asleep on the stage for the whole scene.|Wake the other actors.
  (in a deep, slow voice)|Speak low and slowly.|Speak in a high, fast voice.|Speak in a whisper.
  (He peeks around the corner.)|Look carefully around the corner.|Run around the corner.|Hide behind a curtain the whole scene.
  (Everyone cheers.)|All the actors cheer together.|All the actors boo and stamp their feet.|Only one actor cheers.
`;

const directions = fields(directionLines).map(([direction, right, w1, w2]) => {
  if (!direction || !right || !w1 || !w2) throw new Error(`a direction needs four fields: ${direction}`);
  return { direction, right, wrong: [w1, w2] as const };
});

/** directionBank asks what a stage direction tells an actor. */
const directionBank: readonly Item[] = directions.map((d) => ({
  question: t("What does this stage direction tell the actor?", "这个舞台指示告诉演员什么？"),
  shown: d.direction,
  right: d.right,
  wrong: [...d.wrong],
  why: t(
    `It tells the actor: ${d.right} Stage directions are in brackets; actors follow them and never read them aloud.`,
    `它告诉演员：${d.right} 舞台指示写在括号里；演员照着做，但从不念出来。`,
  ),
  whyNot: d.wrong.map((w) =>
    t(
      `“${w}” is not what the direction says. Read the words in brackets as instructions for moving or speaking.`,
      `“${w}”不是这个指示说的。把括号里的话当作动作或说话方式的说明来读。`,
    ),
  ),
}));

// Poem, play or story.

const formKinds: Readonly<Record<string, Kind>> = {
  "a poem": {
    zh: "诗",
    is: [
      "It is set out in lines, with rhythm and rhyme, and has no speakers' names or brackets.",
      "它分行排列，有节奏和韵脚，没有说话人的名字或括号。",
    ],
  },
  "a play": {
    zh: "剧本",
    is: [
      "Each speaker's name comes before their words, and stage directions are in brackets.",
      "每个说话人的名字写在台词前面，舞台指示写在括号里。",
    ],
  },
  "a story": {
    zh: "故事",
    is: [
      "A narrator tells the events in sentences and paragraphs, with spoken words in quotation marks.",
      "叙述者用句子和段落讲述事件，说的话放在引号里。",
    ],
  },
};

const formLines = `
  The wind is loud, the night is cold, / The barn is creaking, gray and old.|a poem
  MAYA: (peeking into the box) Grandpa, it moved! / GRANDPA: Nonsense. Robots don't move by themselves.|a play
  Maya peeked into the box. "Grandpa, it moved!" she cried. Grandpa only laughed.|a story
  I saw a fox beneath the moon, / He sang a soft and silver tune.|a poem
  QUEEN: (stamping) No more rain! / GARDENER: But, Your Majesty, the roses are thirsty.|a play
  The Queen stamped her foot. "No more rain!" she shouted, and the gardener sighed.|a story
  My kite is high, my kite is free, / It dances far above the tree.|a poem
  SAM: (holding up an apple) Trade? / LILY: (shaking her head) Not for my cookie.|a play
  Sam held up his apple. "Trade?" he asked. Lily shook her head and hid her cookie.|a story
  The snow came down without a sound / And laid a blanket on the ground.|a poem
  DR. FANG: (peering into the dragon's mouth) Hmm. A very large cavity. / DRAGON: Is that bad?|a play
  Dr. Fang peered into the dragon's huge mouth. "A very large cavity," she said.|a story
  Tick, tock, the clock upon the wall / Is the tallest clock of all.|a poem
  JAY: (patting his pockets) My ticket! Where is it? / CONDUCTOR: No ticket, no ride.|a play
  Jay patted every pocket. His ticket was gone. "No ticket, no ride," said the conductor.|a story
  The river runs, the river bends, / It hurries on and never ends.|a poem
  TOM: (sinking into ice cream) Help! / WISH ONE: (giggling) You asked for it.|a play
  Tom was sinking into ice cream. "Help!" he called, but the wish only giggled.|a story
  The bees go humming through the hay, / They work and work the livelong day.|a poem
  ROSA: (with the flashlight under her chin) Boo! / RAUL: (screaming) Aaah! Rosa!|a play
  In the dark, Rosa held the flashlight under her chin. "Boo!" she said, and Raul screamed.|a story
  The moon is round, the stars are bright, / They watch the town all through the night.|a poem
  HOST: (into the microphone) Our next act juggles fire! / JUDGE: (nervously) Is that allowed?|a play
  The host leaned into the microphone. "Our next act juggles fire!" he said. The judges looked nervous.|a story
  A little seed beneath the earth / Is waiting for its day of birth.|a poem
  OLD WOMAN: (holding out a ticket) Is this yours, young man? / JAY: (relieved) Yes! Thank you!|a play
  The old woman held out a ticket. "Is this yours?" she asked. Jay nearly hugged her.|a story
  The waves roll in, the waves roll out, / The seagulls wheel and dip and shout.|a poem
  CLOUD: (softly) May I rain, just a little? / QUEEN: (after a pause) Just a little.|a play
  The little cloud asked softly if it might rain, just a little. After a long pause, the Queen nodded.|a story
  My grandma's kitchen smells of bread, / Of cinnamon and honey spread.|a poem
  GRANDPA: (wiping his glasses) Well, I never. It really did blink. / ROBO: (beeping) Hello.|a play
  Grandpa wiped his glasses and looked again. The robot blinked. "Hello," it beeped.|a story
`;

const features: Readonly<Record<string, readonly (readonly [string, string])[]>> = {
  "a poem": [
    ["Its lines end in words that rhyme.", "它的诗行末尾的词押韵。"],
    ["It is set out in short lines, not sentences in a paragraph.", "它分成短短的诗行，而不是段落里的句子。"],
    ["It has a steady beat, like a song.", "它有稳定的节拍，像一首歌。"],
  ],
  "a play": [
    ["Each speaker's name comes before their words.", "每个说话人的名字写在台词前面。"],
    ["It has stage directions in brackets.", "它有写在括号里的舞台指示。"],
    ["The spoken words have no quotation marks.", "说的话没有引号。"],
  ],
  "a story": [
    ["A narrator tells what the characters do.", "叙述者讲述角色做了什么。"],
    ["The spoken words are in quotation marks.", "说的话放在引号里。"],
    ["It is written in sentences, not in lines.", "它是用句子写的，而不是分行写的。"],
  ],
};

/** featureBank asks which feature shows the kind of a text. */
const featureBank: readonly Item[] = fields(formLines).map(([text, kind], i) => {
  const own = features[kind ?? ""];
  if (!text || !kind || !own) throw new Error(`a form line needs a text and a kind: ${text}`);
  const others = Object.keys(features).filter((k) => k !== kind);
  const right = pick(own, i);
  const wrong = others.map((k, n) => pick(features[k] ?? own, i + n + 1));
  return {
    question: t(`This text is ${kind}. Which feature shows it?`, `这段文字是${formKinds[kind]?.zh}。哪个特点表明了这一点？`),
    shown: text,
    right: right[0],
    wrong: wrong.map((w) => w[0]),
    why: t(`${right[0]} That is a feature of ${kind}.`, `${right[1]} 这是${formKinds[kind]?.zh}的特点。`),
    whyNot: wrong.map((w, n) =>
      t(
        `“${w[0]}” is a feature of ${others[n]}, and this text does not have it.`,
        `“${w[1]}”是${formKinds[others[n] ?? ""]?.zh}的特点，这段文字没有这个特点。`,
      ),
    ),
  };
});

// A story and its script.

const narrationDirectionLines = `
  Maya crept toward the box, holding her breath.|(Maya tiptoes toward the box, holding her breath.)|(Maya runs toward the box, laughing and shouting.)|(Maya walks away from the box.)
  The Queen stamped her foot so hard that the teacups rattled.|(The Queen stamps her foot. The teacups rattle.)|(The Queen sits down quietly and folds her hands.)|(The Queen drinks her tea calmly.)
  Lily slowly shook her head and hid the cookie behind her back.|(Lily shakes her head and hides the cookie behind her back.)|(Lily nods happily and hands over the cookie to Sam.)|(Lily eats the cookie in one bite.)
  The dragon opened its mouth so wide that the dentist could step inside.|(The dragon opens its mouth very wide. Dr. Fang steps inside.)|(The dragon shuts its mouth tight and shakes its head.)|(Dr. Fang runs out of the room.)
  Jay searched every pocket, faster and faster, as the train began to move.|(Jay pats his pockets faster and faster. The train starts to move.)|(Jay calmly takes out his ticket and hands it to the conductor.)|(Jay sits down and reads a book.)
  When the lights went out, Raul let out a squeak and grabbed his sister's arm.|(Lights out. Raul squeaks and grabs Rosa's arm.)|(Lights up. Raul waves cheerfully to the audience.)|(Raul turns on every light.)
  The host walked to the middle of the stage and tapped the microphone.|(The host walks to center stage and taps the microphone.)|(The host turns around and leaves the stage in silence.)|(The host sits in the audience.)
  Grandpa took off his glasses, wiped them, and looked at the robot again.|(Grandpa wipes his glasses and looks at the robot again.)|(Grandpa throws his glasses away and leaves the workshop.)|(Grandpa walks out of the workshop.)
  Tom sank slowly into the sea of ice cream, waving his arms.|(Tom sinks slowly, waving his arms.)|(Tom swims happily through the ice cream.)|(Tom stands up and walks away.)
  The little cloud floated shyly toward the Queen.|(The Cloud floats shyly toward the Queen.)|(The Cloud rushes angrily at the Queen, thundering.)|(The Cloud hides behind the castle.)
  The old woman smiled and held out the lost ticket.|(The Old Woman smiles and holds out the ticket.)|(The Old Woman frowns and tears the ticket into pieces.)|(The Old Woman puts the ticket in her bag.)
  The nurse hid behind the door, trembling from head to toe.|(The Nurse hides behind the door, trembling.)|(The Nurse marches boldly up to the dragon and pats it.)|(The Nurse opens the door wide.)
  Everyone in the cafeteria turned to stare at Sam.|(Everyone turns to stare at Sam.)|(Everyone keeps eating and ignores Sam.)|(Sam leaves the cafeteria.)
  Rosa giggled as she switched off the flashlight.|(Rosa giggles and switches off the flashlight.)|(Rosa starts to cry and switches on all the lights.)|(Rosa drops the flashlight and runs.)
  The gardener knelt down and touched the dry, drooping roses.|(The Gardener kneels and touches the drooping roses.)|(The Gardener picks all the roses and throws them away.)|(The Gardener waters the roses with a hose.)
  The robot's eyes flickered, then glowed a soft blue.|(The robot's eyes flicker, then glow blue.)|(The robot's eyes stay dark, and it does not move at all.)|(The robot falls off the bench.)
  The conductor folded his arms and tapped his foot.|(The Conductor folds his arms and taps his foot.)|(The Conductor smiles kindly and waves Jay onto the train.)|(The Conductor falls asleep.)
  The judges leaned back in their chairs, looking worried.|(The Judges lean back, looking worried.)|(The Judges jump up from their chairs and cheer loudly.)|(The Judges leave the room.)
  Dr. Fang climbed out of the dragon's mouth, holding up a tiny pebble.|(Dr. Fang climbs out, holding up a tiny pebble.)|(Dr. Fang slips and falls deep into the dragon's mouth.)|(Dr. Fang hides under the chair.)
  The second wish appeared in a puff of silver smoke.|(A puff of silver smoke. The Second Wish appears.)|(The Second Wish walks in slowly through the bedroom door.)|(The Second Wish disappears.)
  Mom lit a candle, and everyone's faces glowed in the dark.|(Mom lights a candle. A soft glow.)|(Mom turns on every light in the house.)|(Mom blows out all the candles.)
  The performers waited in the wings, whispering and fidgeting.|(Performers wait in the wings, whispering and fidgeting.)|(Performers lie down and fall asleep in the middle of the stage.)|(Performers bow to the audience.)
  Sam's face fell when Lily said no.|(Sam looks disappointed.)|(Sam jumps up and down for joy.)|(Sam laughs loudly.)
  The Queen pulled her cloak tightly around her and frowned at the sky.|(The Queen pulls her cloak tight and frowns at the sky.)|(The Queen throws off her cloak and smiles up at the sky.)|(The Queen goes inside.)
  Jay hugged the old woman, and her large hat fell off.|(Jay hugs the Old Woman. Her hat falls off.)|(Jay pushes the Old Woman away and runs for the train.)|(The Old Woman puts on another hat.)
  Grandpa slowly reached out and patted the robot on the head.|(Grandpa slowly pats the robot on the head.)|(Grandpa hits the robot hard with a heavy hammer.)|(Grandpa turns his back on the robot.)
  The dragon grinned, showing every one of its shiny teeth.|(The Dragon grins widely.)|(The Dragon frowns and growls.)|(The Dragon covers its mouth.)
  Tom closed his eyes and made his last wish very carefully.|(Tom closes his eyes and thinks hard.)|(Tom laughs loudly and shouts out a silly wish.)|(Tom runs out of the room.)
  Rain began to fall softly on the garden, and the roses lifted their heads.|(Soft rain falls. The roses lift their heads.)|(Thunder crashes, and all the roses wilt and fall.)|(The sun comes out and the rain stops.)
  The twins crawled under the table with the flashlight.|(The twins crawl under the table with the flashlight.)|(The twins climb up onto the table with the flashlight.)|(The twins run out of the house.)
  The curtain came down as everyone clapped and cheered.|(Applause. The curtain falls.)|(Silence. The curtain rises.)|(The audience boos and leaves.)
  The robot rolled across the floor and bumped into the door.|(The robot rolls across the floor and bumps into the door.)|(The robot flies out of the open window into the night.)|(The robot sits still on the bench.)
`;

const narrationDialogueLines = `
  Maya told Grandpa that she thought the robot had blinked at her.|MAYA: Grandpa, I think the robot just blinked at me!|GRANDPA: Maya, did you see the robot blink?|MAYA: "Grandpa, I think the robot just blinked at me!"
  The Queen announced that no rain would ever fall on her palace again.|QUEEN: No rain shall ever fall on my palace again!|GARDENER: The Queen says no rain will fall again.|QUEEN: "No rain shall ever fall on my palace again!"
  Sam asked Lily if she would trade her cookie for his apple.|SAM: Will you trade your cookie for my apple?|LILY: Will you trade your apple for my cookie?|SAM said, "Will you trade your cookie for my apple?"
  Dr. Fang told the dragon to open its mouth wider.|DR. FANG: Open wider, please.|DRAGON: Open wider, please.|Dr. Fang: "Open wider, please."
  The conductor shouted that everyone should have their tickets ready.|CONDUCTOR: Tickets ready, everyone!|JAY: Tickets ready, everyone!|"Tickets ready, everyone!" shouted the conductor.
  Raul demanded to know who had turned off the lights.|RAUL: Who turned off the lights?|ROSA: Who turned off the lights?|RAUL: "Who turned off the lights?"
  The host welcomed everyone to the talent show.|HOST: Welcome, everyone, to the talent show!|JUDGE: Welcome, everyone, to the talent show!|The host said, "Welcome, everyone, to the talent show!"
  Tom cried out that he wished he had never wished for ice cream.|TOM: I wish I had never wished for ice cream!|WISH: Tom wishes he had never wished for ice cream.|TOM: "I wish I had never wished for ice cream!"
  Grandpa admitted that the robot really had blinked.|GRANDPA: Well, it really did blink.|MAYA: Well, it really did blink.|"Well, it really did blink," Grandpa admitted.
  The little cloud asked the Queen if it could rain just a little.|CLOUD: May I rain, just a little?|QUEEN: May I rain, just a little?|CLOUD: "May I rain, just a little?"
  The old woman asked Jay if the ticket was his.|OLD WOMAN: Is this your ticket, young man?|JAY: Is this your ticket, young man?|The old woman asked, "Is this your ticket, young man?"
  Lily told Sam that she would never trade her cookie.|LILY: I will never trade my cookie.|SAM: I will never trade my cookie.|LILY: "I will never trade my cookie."
  The dragon asked nervously whether it would hurt.|DRAGON: (nervously) Will it hurt?|DR. FANG: (nervously) Will it hurt?|DRAGON: "Will it hurt?" (nervously)
  Mom told the twins to stay calm and find the candles.|MOM: Stay calm, you two, and find the candles.|ROSA: Stay calm, you two, and find the candles.|Mom said, "Stay calm, you two, and find the candles."
  Jay thanked the old woman again and again.|JAY: Thank you! Oh, thank you!|OLD WOMAN: Thank you! Oh, thank you!|JAY: "Thank you! Oh, thank you!"
  The gardener begged the Queen to let the roses drink.|GARDENER: Please, Your Majesty, let the roses drink.|QUEEN: Please, Your Majesty, let the roses drink.|"Please, Your Majesty, let the roses drink," the gardener begged.
  The robot said hello in a tiny, beeping voice.|ROBO: (beeping) Hello.|MAYA: (beeping) Hello.|ROBO: "Hello." (beeping)
  The first wish asked Tom what he would like.|WISH ONE: What would you like, Tom?|TOM: What would you like, Tom?|WISH ONE: "What would you like, Tom?"
  A judge asked whether juggling fire was allowed.|JUDGE: Is juggling fire allowed?|HOST: Is juggling fire allowed?|A judge asked, "Is juggling fire allowed?"
  Rosa said she was only joking.|ROSA: I was only joking!|RAUL: I was only joking!|ROSA: "I was only joking!"
  The nurse whispered that she was afraid of dragons.|NURSE: (whispering) I'm afraid of dragons.|DR. FANG: (whispering) I'm afraid of dragons.|NURSE: "I'm afraid of dragons." (whispering)
  Sam said that Lily was a good friend anyway.|SAM: You're a good friend anyway, Lily.|LILY: You're a good friend anyway, Sam.|SAM: "You're a good friend anyway, Lily."
  The Queen agreed, after a long pause, that it might rain a little.|QUEEN: (after a long pause) Just a little, then.|CLOUD: (after a long pause) Just a little, then.|QUEEN: "Just a little, then." (after a long pause)
  Grandpa asked the robot what its name was.|GRANDPA: What is your name, little robot?|ROBO: What is your name, little robot?|"What is your name, little robot?" asked Grandpa.
  Dad called out that he had found the flashlight.|DAD: I found the flashlight!|MOM: I found the flashlight!|DAD: "I found the flashlight!"
  The conductor told Jay that there was no ride without a ticket.|CONDUCTOR: No ticket, no ride.|JAY: No ticket, no ride.|The conductor said, "No ticket, no ride."
  The host thanked the performers and the audience.|HOST: Thank you, performers, and thank you, audience!|JUDGE: Thank you, performers, and thank you, audience!|HOST: "Thank you, performers, and thank you, audience!"
  Tom made his third wish: that everything would go back to normal.|TOM: I wish everything would go back to normal.|WISH THREE: I wish everything would go back to normal.|TOM: "I wish everything would go back to normal."
  The dragon thanked Dr. Fang with a huge, toothy smile.|DRAGON: (smiling hugely) Thank you, doctor!|NURSE: (smiling hugely) Thank you, doctor!|DRAGON: "Thank you, doctor!" (smiling hugely)
  Maya asked Grandpa if they could keep the robot.|MAYA: Can we keep him, Grandpa?|GRANDPA: Can we keep him, Maya?|Maya asked, "Can we keep him, Grandpa?"
  Raul admitted that he had been a little scared.|RAUL: Okay, I was a little scared.|ROSA: Okay, I was a little scared.|RAUL: "Okay, I was a little scared."
  The gardener cried that the roses were blooming again.|GARDENER: Look! The roses are blooming again!|QUEEN: Look! The roses are blooming again!|"Look! The roses are blooming again!" cried the gardener.
`;

/** scriptRows reads lines of "narration|right|wrong|wrong". */
const scriptRows = (lines: string) =>
  fields(lines).map(([narration, right, w1, w2]) => {
    if (!narration || !right || !w1 || !w2) throw new Error(`a script line needs four fields: ${narration}`);
    return { narration, right, wrong: [w1, w2] as const };
  });

/** narrationDirectionBank asks for the stage direction that matches a sentence of narration. */
const narrationDirectionBank: readonly Item[] = scriptRows(narrationDirectionLines).map((r) => ({
  question: t(
    "This sentence is from a story. Which stage direction matches it in the script?",
    "这句话出自一个故事。剧本中哪个舞台指示与它相符？",
  ),
  shown: r.narration,
  right: r.right,
  wrong: [...r.wrong],
  why: t(
    `${r.right} matches. When a story becomes a script, what the narrator says the characters do becomes a stage direction in brackets, in the present tense.`,
    `${r.right} 与它相符。故事改编成剧本时，叙述者讲的角色动作变成括号里的舞台指示，用现在时。`,
  ),
  whyNot: r.wrong.map((w) =>
    t(`${w} shows something different from what the narrator says happens.`, `${w} 表现的与叙述者所说的发生的事不同。`),
  ),
}));

/** narrationDialogueBank asks for the line of dialogue that matches what a narrator reports. */
const narrationDialogueBank: readonly Item[] = scriptRows(narrationDialogueLines).map((r) => ({
  question: t("This sentence is from a story. Which line of the script matches it?", "这句话出自一个故事。剧本中哪一行台词与它相符？"),
  shown: r.narration,
  right: r.right,
  wrong: [...r.wrong],
  why: t(
    `${r.right} matches. In a script, the character's name comes first, then a colon, then their own words, without quotation marks.`,
    `${r.right} 与它相符。在剧本中，先写角色的名字，再写冒号，然后是他们自己说的话，不加引号。`,
  ),
  whyNot: [
    t("This gives the words to the wrong character. Check who speaks in the narration.", "这把台词给了错误的角色。看看叙述中是谁在说话。"),
    t(
      "This keeps the quotation marks or the narrator's words of a story. A script has neither.",
      "这保留了故事中的引号或叙述者的话。剧本里两者都没有。",
    ),
  ],
}));

// What characters say and think.

const traitKinds: Readonly<Record<string, Kind>> = {
  brave: { zh: "勇敢", is: ["A brave character faces danger or fear and acts anyway.", "勇敢的角色面对危险或恐惧，仍然采取行动。"] },
  kind: { zh: "善良", is: ["A kind character thinks of others and helps them.", "善良的角色为别人着想，并帮助他们。"] },
  selfish: { zh: "自私", is: ["A selfish character thinks only of what they want.", "自私的角色只想着自己想要的东西。"] },
  curious: { zh: "好奇", is: ["A curious character wants to find out and explore.", "好奇的角色想要弄清楚、去探索。"] },
  honest: { zh: "诚实", is: ["An honest character tells the truth, even when it is hard.", "诚实的角色说真话，即使这很难。"] },
  impatient: { zh: "急躁", is: ["An impatient character cannot bear to wait.", "急躁的角色无法忍受等待。"] },
};

const traitLines = `
  MAYA: I'm scared of the dark, but someone has to go down and check the basement. I'll go.|brave
  JAY: (handing back the wallet) You dropped this, sir. It's all there. I didn't take anything.|honest
  LILY: (thinking) What's inside that locked box? I have to find out.|curious
  SAM: You can have the last slice. You look hungrier than me.|kind
  RAUL: It's my ball, so I'm the only one who gets to kick it.|selfish
  TOM: Are we there yet? Are we there yet? Is it now? How about now?|impatient
  ROSA: (to the bully) Leave him alone. If you want to pick on someone, pick on me.|brave
  GRANDPA: I broke the window. Don't blame the boy; it was my fault.|honest
  MAYA: How does the robot know what to say? Can I look at its wires?|curious
  OLD WOMAN: (offering her umbrella) Here, take this. You'll get soaked.|kind
  QUEEN: I don't care if the roses die. I want sunshine, and I want it now.|selfish
  CONDUCTOR: (tapping his watch) Hurry up! I can't wait all day!|impatient
  JAY: The others ran away when the dog barked, but I stayed to help the little girl.|brave
  LILY: I said I liked the cake, but that wasn't true. I'm sorry. It was too sweet for me.|honest
  TOM: (thinking) Where does the river go after it leaves the town? I'm going to follow it.|curious
  NURSE: Let me carry those bags for you. They look very heavy.|kind
  DRAGON: All the gold in the cave is mine. Nobody else may touch a single coin.|selfish
  RAUL: Why is this line so long? I'm leaving if it doesn't move right now!|impatient
  ROSA: (climbing toward the kitten) I know the branch might break. I'm going up anyway.|brave
  SAM: (to the teacher) I didn't do my homework. I don't have an excuse.|honest
  MAYA: What's at the top of the hill? Come on, let's climb up and see!|curious
  DR. FANG: Don't worry, little one. I'll be very gentle. Hold my hand if you like.|kind
  TOM: I'm not sharing my toys. Get your own.|selfish
  JAY: (drumming his fingers) Is the cake ready yet? It's been five whole minutes!|impatient
  GARDENER: I will tell the Queen the truth about the roses, even if she sends me away.|brave
  QUEEN: I must admit it: the gardener was right, and I was wrong.|honest
  LILY: Why do cats purr? How do birds know where to fly? I want to know everything!|curious
  RAUL: (giving his coat to his shivering sister) Here, wear this. I'm not cold.|kind
  HOST: I want the biggest dressing room. The other performers can share the closet.|selfish
  SAM: (pulling at the wrapping paper) I can't wait until my birthday. Let me open it now!|impatient
  CLOUD: (trembling) The Queen is fierce, but I will ask her anyway.|brave
  ROSA: (to Mom) I ate the cookies. Raul didn't do it. It was me.|honest
  GRANDPA: I wonder what would happen if I connected this wire to that one.|curious
  JAY: (to the new boy) Do you want to sit with us? There's plenty of room.|kind
  WISH ONE: I'll grant your wish, but only if you give me your lunch first.|selfish
  MAYA: (bouncing on her toes) When is the show going to start? I can't stand waiting!|impatient
`;

const traitSpec: KindSpec = {
  lines: traitLines,
  kinds: traitKinds,
  name: ["What trait does this line show about the character?", "这句话表现了角色的什么特点？"],
  find: (en: string, zh: string) => [`Which line shows a character who is ${en}?`, `哪句话表现了一个${zh}的角色？`],
};

/** playTopics4 are the reading topics of grade 4 about plays. */
export const playTopics4: readonly TopicDef[] = [
  {
    id: "parts-of-a-play",
    title: t("Parts of a Play", "剧本的组成部分"),
    summary: t(
      "A play has a cast of characters, a setting, scenes, dialogue after each speaker's name and stage directions in brackets.",
      "剧本有角色表、场景、分场、写在说话人名字后面的台词，以及写在括号里的舞台指示。",
    ),
    prerequisites: after("parts-of-stories-and-poems"),
    encompasses: [],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "naming-a-part-of-a-script",
        t("Naming a Part of a Script", "说出剧本的组成部分"),
        t(
          "A **script** is a play written down. It begins with the **cast of characters**, a list of the people in the play. Each **scene** begins with its **setting**: where and when it takes place. Then comes the **dialogue**, each line after the speaker's name and a colon, and **stage directions** in brackets that tell the actors what to do.",
          "**剧本**是写下来的戏剧。它以**角色表**开头，列出剧中的人物。每一**场**以**场景说明**开始：说明发生的地点和时间。接着是**台词**，每行写在说话人的名字和冒号后面，还有写在括号里、告诉演员做什么的**舞台指示**。",
        ),
        nameKind({
          lines: scriptLines,
          kinds: scriptKinds,
          name: ["Which part of a script is this?", "这是剧本的哪个部分？"],
          find: (en, zh) => [`Which of these is ${en}?`, `下面哪一项是${zh}？`],
        }),
      ),
      point(
        "what-a-stage-direction-tells",
        t("What a Stage Direction Tells", "舞台指示说明了什么"),
        t(
          "A **stage direction** is written in brackets and is never spoken. It tells an actor how to move, *(She tiptoes across the stage.)*, or how to speak, *(whispering)*, or what happens on stage, *(Lights dim.)*. Read it as an instruction.",
          "**舞台指示**写在括号里，从来不念出来。它告诉演员怎样动作，*(She tiptoes across the stage.)*；怎样说话，*(whispering)*；或者舞台上发生什么，*(Lights dim.)*。要把它当作指令来读。",
        ),
        itemGenerator(directionBank),
      ),
    ],
  },
  {
    id: "poem-play-or-story",
    title: t("Poem, Play or Story", "诗、剧本还是故事"),
    summary: t(
      "Poems have lines, stanzas, rhythm and rhyme; plays have dialogue and stage directions; stories have a narrator and paragraphs.",
      "诗有诗行、诗节、节奏和韵脚；剧本有台词和舞台指示；故事有叙述者和段落。",
    ),
    prerequisites: ["parts-of-a-play"],
    encompasses: [{ topic: "parts-of-a-play", weight: 0.3 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "naming-the-kind-of-a-text",
        t("Naming the Kind of a Text", "说出文字的种类"),
        t(
          "The same events can be told as a **poem**, a **play** or a **story**, and each looks different on the page. A poem is set out in lines, often with rhythm and rhyme (here a slash marks where a line ends). A play puts each speaker's name before their words. A story has a narrator who tells what happens in sentences.",
          "同样的事件可以写成**诗**、**剧本**或**故事**，每种在纸面上看起来都不一样。诗分行排列，常有节奏和韵脚（这里用斜线表示一行结束的地方）。剧本把每个说话人的名字放在台词前面。故事有叙述者，用句子讲述发生的事。",
        ),
        nameKind({
          lines: formLines,
          kinds: formKinds,
          name: ["What kind of text is this?", "这是哪一种文字？"],
          find: (en, zh) => [`Which of these is ${en}?`, `下面哪一段是${zh}？`],
        }),
      ),
      point(
        "the-feature-that-shows-the-kind",
        t("The Feature That Shows the Kind", "显示种类的特点"),
        t(
          "To explain how you know the kind of a text, name a feature it has. A poem: lines that rhyme, a steady beat. A play: speakers' names before their words, stage directions in brackets, no quotation marks. A story: a narrator, spoken words in quotation marks, sentences rather than lines.",
          "要说明你怎样知道一段文字的种类，就说出它具有的一个特点。诗：押韵的诗行、稳定的节拍。剧本：台词前有说话人的名字、括号里的舞台指示、没有引号。故事：有叙述者、说的话放在引号里、用句子而不是分行。",
        ),
        itemGenerator(featureBank),
      ),
    ],
  },
  {
    id: "story-and-script",
    title: t("A Story and Its Script", "故事和它的剧本"),
    summary: t(
      "When a story becomes a script, the narrator's words become dialogue and stage directions.",
      "故事改编成剧本时，叙述者的话变成了台词和舞台指示。",
    ),
    prerequisites: after("parts-of-a-play", "retelling-key-events"),
    encompasses: [{ topic: "parts-of-a-play", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "narration-into-stage-directions",
        t("Narration into Stage Directions", "把叙述变成舞台指示"),
        t(
          "A story's narrator tells what the characters do: *Maya crept toward the box, holding her breath.* A script has no narrator, so the same action becomes a **stage direction** in brackets, usually in the present tense: *(Maya tiptoes toward the box, holding her breath.)* The direction must show the same action and the same feeling.",
          "故事的叙述者讲述角色做了什么：*Maya crept toward the box, holding her breath.* 剧本没有叙述者，所以同样的动作变成括号里的**舞台指示**，通常用现在时：*(Maya tiptoes toward the box, holding her breath.)* 舞台指示必须表现同样的动作和感情。",
        ),
        itemGenerator(narrationDirectionBank),
      ),
      point(
        "reported-words-into-dialogue",
        t("Reported Words into Dialogue", "把转述的话变成台词"),
        t(
          "When a narrator reports what a character said, *Maya told Grandpa that she thought the robot had blinked*, the script gives the character's own words after their name: *MAYA: Grandpa, I think the robot just blinked at me!* Check that the right character speaks, and leave out quotation marks.",
          "叙述者转述角色说的话时，*Maya told Grandpa that she thought the robot had blinked*，剧本在角色名字后写出他们自己的话：*MAYA: Grandpa, I think the robot just blinked at me!* 要检查说话的角色对不对，并且不加引号。",
        ),
        itemGenerator(narrationDialogueBank),
      ),
    ],
  },
  {
    id: "what-characters-say-and-think",
    title: t("What Characters Say and Think", "角色说什么、想什么"),
    summary: t(
      "What a character says, does and thinks, and what others say about them, show who they are.",
      "角色说的话、做的事、想的事，以及别人对他们的评价，都表现出他们是什么样的人。",
    ),
    prerequisites: after("character-change"),
    encompasses: [{ topic: "characters", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "the-trait-a-line-shows",
        t("The Trait a Line Shows", "一句台词表现的特点"),
        t(
          "A play has no narrator to tell us what a character is like, so we learn it from what they **say** and **think**. *I'm scared of the dark, but someone has to go down. I'll go.* shows a brave character: she is afraid and acts anyway. Name the trait the words show.",
          "剧本没有叙述者告诉我们角色是什么样的人，所以我们从他们**说的**和**想的**中了解。*I'm scared of the dark, but someone has to go down. I'll go.* 表现了一个勇敢的角色：她害怕，却仍然去做。说出这些话表现的特点。",
        ),
        nameKind(traitSpec),
      ),
      point(
        "the-line-that-shows-a-trait",
        t("The Line That Shows a Trait", "表现某个特点的台词"),
        t(
          "Now start from the trait and find the words that show it. A kind character offers help; a selfish one keeps things for themselves; an impatient one cannot wait; an honest one tells the truth even when it costs them. Look for what the words do, not just what they mention.",
          "现在从特点出发，找出表现它的话。善良的角色主动帮忙；自私的角色把东西留给自己；急躁的角色等不及；诚实的角色即使吃亏也说真话。要看这些话在做什么，而不只是它们提到了什么。",
        ),
        findKind(traitSpec),
      ),
    ],
  },
];
