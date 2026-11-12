// Grade 8: writing skills checked by rule, part two: creating atmosphere with sensory details, writing stage directions
// and interviewing and quoting a person.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const atmosphere = topic("writing", {
  id: "creating-atmosphere-with-sensory-details",
  title: ["Creating Atmosphere with Sensory Details", "用感官细节营造氛围"],
  summary: [
    "Atmosphere comes from details of sight, sound, smell and touch chosen to point the same way, not from naming the feeling.",
    "氛围来自指向同一方向的视觉、听觉、嗅觉和触觉细节，而不是直接说出那种感觉。",
  ],
  after: ["choosing-sensory-details", "recognizing-gothic-elements"],
  points: [
    label(
      "does-it-build-the-atmosphere",
      ["Does It Build the Atmosphere", "它是否营造了氛围"],
      [
        "A writer who wants the reader to feel dread does not write *It was scary.* Instead, they choose details of the senses that all point the same way: *The candle guttered, and somewhere below, a door creaked open by itself.* A sentence can **build the atmosphere** with such details, it can **name the feeling** instead of showing it, or it can give a **detail that breaks the mood**, such as a cheerful or flat detail in a scene of dread.",
        "想让读者感到恐惧的作者，不会写 *It was scary.* 而是选择全都指向同一方向的感官细节：*The candle guttered, and somewhere below, a door creaked open by itself.* 一个句子可以用这样的细节**营造氛围**；也可以**直接说出感觉**而不加以展现；还可能给出**破坏氛围的细节**，比如在恐怖场景中出现欢快或平淡的细节。",
      ],
      ["A writer wants a mood of dread. What does this sentence do?", "作者想营造恐惧的氛围。这个句子起了什么作用？"],
      `
        The candle guttered, and somewhere below, a door creaked open by itself.|builds the atmosphere
        The house was really frightening.|names the feeling
        The candle smelled pleasantly of vanilla, like a birthday cake.|breaks the mood
        Cold air crept along the floor, and the smell of wet earth rose from the cellar.|builds the atmosphere
        I felt very scared in the cellar.|names the feeling
        The cellar had a handy shelf for storing jam jars.|breaks the mood
        Rain hissed against the black windows, and the portraits seemed to watch me pass.|builds the atmosphere
        The hallway gave me a creepy feeling.|names the feeling
        The portraits were painted in bright, cheerful colors by a famous artist.|breaks the mood
        Somewhere in the walls, something scratched, stopped, and scratched again.|builds the atmosphere
        The noise in the walls was terrifying.|names the feeling
        The walls had recently been given a fresh coat of yellow paint.|breaks the mood
        The stairs groaned under my weight, and the banister was slick and cold under my hand.|builds the atmosphere
        Climbing the stairs was the scariest thing I had ever done.|names the feeling
        The stairs were carpeted in a soft and comfortable blue.|breaks the mood
        Fog pressed against the glass, and the only sound was my own breath.|builds the atmosphere
        It was a very eerie night.|names the feeling
        Through the fog came the jolly tune of an ice cream van.|breaks the mood
        The sheets smelled of dust, and the mirror showed a shape behind me that was gone when I turned.|builds the atmosphere
        The bedroom made me feel afraid.|names the feeling
        The bedroom had a modern lamp with three brightness settings.|breaks the mood
        Wind moaned in the chimney, and ash stirred in the cold grate.|builds the atmosphere
        The fireplace was spooky.|names the feeling
        The fireplace was perfect for toasting marshmallows with friends.|breaks the mood
        Water dripped somewhere in the dark, slow as a clock counting down.|builds the atmosphere
        The tunnel was horrible and frightening.|names the feeling
        The tunnel was well lit and clearly signposted.|breaks the mood
        The garden's dead roses rattled on their stems, and a crow watched from the broken gate.|builds the atmosphere
        The garden had a sinister feeling.|names the feeling
        A family was enjoying a picnic beside the garden's fountain.|breaks the mood
      `,
      {
        "builds the atmosphere": L(
          "营造了氛围",
          "The sentence uses details of the senses that all point toward dread, so the reader feels the mood without being told it.",
          "这个句子使用全都指向恐惧的感官细节，读者无需被告知就能感受到氛围。",
          "The sentence does not build the mood with sensory details.",
          "这个句子没有用感官细节营造氛围。",
        ),
        "names the feeling": L(
          "直接说出感觉",
          "The sentence tells the reader the place was scary or eerie instead of giving details that would make them feel it.",
          "这个句子直接告诉读者这里可怕或诡异，而不是给出让读者自己感受到的细节。",
          "The sentence does not simply name a feeling.",
          "这个句子并不只是说出一种感觉。",
        ),
        "breaks the mood": L(
          "破坏了氛围",
          "The detail is cheerful, cozy or flatly practical, so it pulls against the dread the writer wants.",
          "这个细节欢快、温馨或平淡务实，与作者想要的恐惧背道而驰。",
          "The detail does not pull against the mood of dread.",
          "这个细节并没有与恐惧的氛围背道而驰。",
        ),
      },
    ),
    choose(
      "the-detail-that-fits-the-mood",
      ["The Detail That Fits the Mood", "符合氛围的细节"],
      [
        "Each mood has its own details. Peace may come from *soft light on still water*; tension from *a clock ticking in a silent room*; gloom from *gray rain on empty streets*. Choose a detail of the senses that matches the mood, and be wary of two mistakes: a detail that **points to a different mood**, and a sentence that **only names the mood** with no detail at all.",
        "每种氛围都有自己的细节。宁静可以来自 *soft light on still water*；紧张来自 *a clock ticking in a silent room*；阴郁来自 *gray rain on empty streets*。选择与氛围相符的感官细节，并警惕两种错误：**指向另一种氛围**的细节，以及**只说出氛围名称**、没有任何细节的句子。",
      ],
      ["Which sentence best creates the mood given?", "哪个句子最能营造所给的氛围？"],
      `
        Mood: peace.|Soft light lay on the still water, and a heron stood without moving.|Anyone could tell that the lake was very peaceful and calm that day, and everyone there felt it.|Thunder cracked, and the boat lurched against the rocks.
        Mood: tension.|In the silent room, the clock ticked, and no one met anyone's eyes.|Everyone in the room felt extremely tense.|The friends laughed and passed around the warm bread.
        Mood: gloom.|Gray rain fell on empty streets, and the shop windows were dark.|The town was a gloomy and depressing place.|Children played in the sunny square while music drifted from a café.
        Mood: joy.|Bells rang across the valley, and the smell of fresh bread filled the street.|Everyone agreed that the festival was a very joyful occasion, and nobody could deny it.|Wind tore at the shutters, and the lamps went out one by one.
        Mood: loneliness.|One cup sat on the table, and the only sound was the fridge humming.|The old man was extremely lonely.|The kitchen was crowded with cousins arguing over the last slice of pie.
        Mood: dread.|The door at the end of the hall stood open an inch, and a cold draft came through it.|The hallway filled her with dread.|A kitten purred in a sunny patch on the hallway carpet.
        Mood: excitement.|The crowd roared, drums thundered, and the air smelled of smoke and popcorn.|Everyone agreed that it was a very exciting night at the fair, and nobody could deny it.|The fairground was empty, and a single paper cup rolled across the mud.
        Mood: calm.|Snow fell without a sound, and the fire settled in the grate.|The cabin felt calm and relaxing.|Alarms rang through the cabin as smoke poured from the stove.
        Mood: menace.|The dog's lips drew back, and a low growl rose from its chest.|The dog seemed very menacing.|The dog rolled over and wagged its tail for a scratch.
        Mood: nostalgia.|The attic smelled of old paper and cedar, and her childhood skates hung on a nail.|Anyone could tell that the attic made her feel nostalgic, and everyone there felt it.|The attic was being cleared by workers with loud drills.
        Mood: sorrow.|Rain ran down the window, and his coat still hung by the door.|The house was full of sorrow after he died.|The house rang with laughter and the clatter of a party.
        Mood: wonder.|Above the desert, the stars spread so thick they seemed to hum.|The night sky was truly wonderful.|Clouds hid the sky, and the car's headlights showed only gravel.
        Mood: unease.|The picture on the wall was crooked, though she was sure she had straightened it.|Everyone who walked in could tell at once that the room made her feel uneasy, and everyone there felt it.|The room was neat, bright and exactly as she had left it.
        Mood: triumph.|The flag cracked in the wind at the summit, and below them the clouds lay like a sea.|Reaching the top was a triumphant moment.|At the summit, they huddled in the fog, too tired to speak.
        Mood: coziness.|Rain tapped the roof while the kettle sang and the cat slept on the quilt.|Everyone agreed that the kitchen was cozy and comfortable, and nobody could deny it.|The kitchen was cold, and the broken window let the rain blow in.
        Mood: despair.|The well was dry, the fields cracked, and the last cow lay down in the dust.|The farmers were in complete despair.|Green shoots pushed through the soil after the first spring rain.
        Mood: suspense.|Footsteps paused outside the door, and the handle began to turn.|Anyone could tell that the moment was full of suspense, and everyone there felt it.|The visitor knocked cheerfully and called out a greeting.
        Mood: freedom.|Wind filled the sail, and the shore shrank behind them to a thin gray line.|They felt completely free on the sea.|The boat sat chained to the dock in the narrow harbor.
        Mood: decay.|Paint peeled from the walls, and mushrooms grew in the rotting floorboards.|Everyone agreed that the mansion was in a state of decay, and nobody could deny it.|The mansion gleamed with polished floors and fresh paint.
        Mood: hope.|After the storm, a thin line of gold broke along the edge of the clouds.|The sailors felt hopeful again.|The storm grew worse, and the mast split with a crack.
        Mood: chaos.|Pots crashed, the smoke alarm shrieked, and the dog raced through spilled flour.|Anyone could tell that the kitchen was in total chaos, and everyone there felt it.|The kitchen was quiet, and every pot hung in its place.
        Mood: isolation.|For miles, there was only ice, and the wind erased their footprints behind them.|The explorers felt very isolated.|A busy trading post stood just over the next ridge.
        Mood: serenity.|The temple bell faded, and a single leaf drifted onto the raked sand.|Anyone could tell that the garden was serene, and everyone there felt it.|Tourists shouted and took photos as buses honked outside the garden.
        Mood: horror.|The thing in the jar opened one eye and turned it toward her.|She felt total horror.|The jar held a neat row of pickled onions.
        Mood: anticipation.|The curtain stirred, the hall fell silent, and the first violin lifted its bow.|Everyone agreed that the audience was full of anticipation, and nobody could deny it.|The concert was over, and the cleaners swept up the programs.
        Mood: weariness.|His boots dragged in the mud, and the pack straps cut into his shoulders.|He felt very weary after the march.|He bounded up the path, whistling, as fresh as morning.
        Mood: mystery.|The letter had no name, only a pressed flower and a key no lock in the house would take.|Everyone who walked in could tell at once that the letter was mysterious, and everyone there felt it.|The letter was a bill for the electricity, clearly marked and dated.
        Mood: warmth.|Lamplight spilled from the windows, and someone had saved her a seat by the fire.|Coming home felt warm and welcoming.|The house was dark, and the door was locked against her.
        Mood: grandeur.|Columns rose a hundred feet into the gold-painted dome, and every footstep echoed.|Everyone who walked in could tell at once that the cathedral was grand, and everyone there felt it.|The chapel was a small room with plastic chairs.
        Mood: danger.|The ice groaned beneath them, and a black crack raced toward their feet.|Crossing the ice was very dangerous.|The ice was a meter thick and safe for a whole team of horses.
      `,
      (right) => [`*${right}* uses details of the senses that point toward that mood.`, `*${right}* 使用了指向这种氛围的感官细节。`],
      [
        [
          "*{wrong}* only names the mood and gives no detail of the senses to create it.",
          "*{wrong}* 只说出了氛围的名称，没有用任何感官细节去营造它。",
        ],
        ["*{wrong}* has vivid details, but they create a different mood.", "*{wrong}* 有生动的细节，但营造的是另一种氛围。"],
      ],
    ),
  ],
});

const stageDirections = topic("writing", {
  id: "writing-stage-directions",
  title: ["Writing Stage Directions", "写舞台说明"],
  summary: [
    "Stage directions tell actors what to do and how, in the present tense, with things an audience can see or hear, never thoughts they cannot.",
    "舞台说明用现在时告诉演员做什么、怎样做，写的是观众能看到或听到的东西，而不是他们无法感知的想法。",
  ],
  after: ["script-format"],
  points: [
    label(
      "will-it-work-on-stage",
      ["Will It Work on Stage", "它在舞台上可行吗"],
      [
        "A stage direction is an instruction to actors and the crew, written in the **present tense**: *(She crosses to the window and pulls the curtain shut.)* A **playable** direction describes what an audience can see or hear. A direction that tells **an inner thought** cannot be performed: no actor can show that a character *remembers her tenth birthday*. A direction in **the past tense** reads like a story instead of an instruction.",
        "舞台说明是给演员和工作人员的指示，用**现在时**写成：*(She crosses to the window and pulls the curtain shut.)* **可表演的**说明描述观众能看到或听到的东西。写**内心想法**的说明无法表演：没有演员能表现出角色 *remembers her tenth birthday*。用**过去时**写的说明读起来像故事而不是指示。",
      ],
      ["Is this stage direction ready for the stage?", "这条舞台说明能直接用于舞台吗？"],
      `
        (She crosses to the window and pulls the curtain shut.)|playable
        (She remembers the day her father left.)|an inner thought
        (She crossed to the window and pulled the curtain shut.)|the past tense
        (A clock strikes midnight. HAMID freezes.)|playable
        (HAMID wonders whether anyone has noticed him.)|an inner thought
        (A clock struck midnight, and HAMID froze.)|the past tense
        (LENA slams the letter on the table.)|playable
        (LENA secretly hopes he will apologize.)|an inner thought
        (LENA slammed the letter on the table.)|the past tense
        (Thunder. The lights flicker and go out.)|playable
        (Everyone in the room silently fears the worst.)|an inner thought
        (There was thunder, and the lights went out.)|the past tense
        (He sinks into the chair and covers his face.)|playable
        (He thinks about how unfair his life has been.)|an inner thought
        (He sank into the chair and covered his face.)|the past tense
        (MARCO enters, dripping wet, carrying a lantern.)|playable
        (MARCO knows deep down that he is too late.)|an inner thought
        (MARCO entered, dripping wet, with a lantern.)|the past tense
        (The KING rises. The courtiers bow.)|playable
        (The KING privately doubts his own advisers.)|an inner thought
        (The KING rose, and the courtiers bowed.)|the past tense
        (A knock at the door. They look at each other.)|playable
        (They each guess who is at the door.)|an inner thought
        (There was a knock at the door.)|the past tense
        (She laughs, too loudly, and turns away.)|playable
        (She feels embarrassed but hides it from herself.)|an inner thought
        (She laughed too loudly and turned away.)|the past tense
        (Footsteps above. ANA looks up at the ceiling.)|playable
        (ANA recalls the ghost story her grandmother told.)|an inner thought
        (ANA heard footsteps and looked up.)|the past tense
      `,
      {
        playable: L(
          "可表演的",
          "The direction is in the present tense and describes actions, sounds or lights the audience can see or hear.",
          "这条说明用现在时，描述观众能看到或听到的动作、声音或灯光。",
          "The direction cannot be performed as it is written.",
          "这条说明按原样无法表演。",
        ),
        "an inner thought": L(
          "内心想法",
          "The direction describes a thought, memory or wish that an actor cannot show, so the audience would never know it.",
          "这条说明描述了演员无法表现的想法、回忆或愿望，观众永远无法得知。",
          "The direction describes something the audience can see or hear.",
          "这条说明描述的是观众能看到或听到的东西。",
        ),
        "the past tense": L(
          "过去时",
          "The direction describes visible action, but in the past tense, so it reads like a story rather than an instruction.",
          "这条说明描述了可见的动作，但用的是过去时，读起来像故事而不是指示。",
          "The direction is written in the present tense.",
          "这条说明是用现在时写的。",
        ),
      },
    ),
    choose(
      "showing-it-on-stage",
      ["Showing It on Stage", "在舞台上表现出来"],
      [
        "When a character feels something, the stage direction must turn the feeling into something visible or audible. *She is nervous* becomes *(She twists her ring and keeps glancing at the door.)* Avoid two mistakes: a direction that still **only states the feeling**, and one that shows an action **that does not fit** the feeling.",
        "当角色有某种感受时，舞台说明必须把感受变成可见或可听的东西。*She is nervous* 变成 *(She twists her ring and keeps glancing at the door.)* 避免两种错误：仍然**只陈述感受**的说明，以及表现的动作与感受**不相符**的说明。",
      ],
      ["Which stage direction best shows the feeling to an audience?", "哪条舞台说明最能向观众表现这种感受？"],
      `
        She is nervous.|(She twists her ring and keeps glancing at the door.)|(She feels very nervous inside, and the audience should understand exactly how this feels.)|(She stretches lazily and yawns.)
        He is angry.|(He kicks the chair across the room.)|(He is filled with anger.)|(He hums happily as he waters the plants.)
        She is grieving.|(She holds his coat to her face and does not move.)|(She is full of grief.)|(She dances across the stage, laughing.)
        He is bored.|(He drums his fingers on the desk and stares at the ceiling.)|(He feels extremely bored, more than he has ever felt it before.)|(He leaps up and cheers.)
        They are afraid.|(They back toward the wall, eyes on the door.)|(They are very afraid.)|(They stroll forward, chatting calmly.)
        She is overjoyed.|(She throws her arms around him and spins in a circle.)|(She is overjoyed by the news, and this is the most important thing in the scene.)|(She sighs and turns her back on him.)
        He is guilty.|(He cannot meet her eyes and hides the broken vase behind him.)|(He feels guilty about what he did.)|(He proudly points to the broken vase.)
        She is exhausted.|(She sinks to the floor and lets her bag drop.)|(She is completely exhausted, and the audience should understand exactly how this feels.)|(She jogs in place, full of energy.)
        He is suspicious.|(He narrows his eyes and checks the seal on the letter.)|(He is suspicious of the letter.)|(He tosses the letter aside without looking.)
        She is cold.|(She hugs herself, shivering, and blows on her hands.)|(She feels very cold, more than she has ever felt it before.)|(She fans herself and wipes sweat from her brow.)
        He is impatient.|(He checks his watch, taps his foot and checks it again.)|(He is impatient.)|(He settles comfortably into the armchair.)
        She is shy.|(She hides behind her mother and peeks out.)|(She feels shy around strangers, and this is the most important thing in the scene.)|(She marches up and shakes every hand.)
        He is in pain.|(He clutches his side and winces as he stands.)|(He is in a lot of pain.)|(He springs up and touches his toes.)
        She is proud.|(She lifts her chin and holds the medal up for everyone to see.)|(She feels proud of herself, and the audience should understand exactly how this feels.)|(She hides the medal in her pocket.)
        He is confused.|(He turns the map upside down, then sideways.)|(He is confused by the map.)|(He folds the map neatly and strides off.)
        She is jealous.|(She watches them dance, her fists tight at her sides.)|(She is jealous of her sister, more than she has ever felt it before.)|(She claps warmly for the dancing couple.)
        He is relieved.|(He lets out a long breath and drops into a chair.)|(He feels relieved.)|(He paces faster, biting his nails.)
        She is defiant.|(She folds her arms and stays in her seat.)|(She is defiant, and this is the most important thing in the scene.)|(She bows her head and obeys at once.)
        He is lost in thought.|(He stares out of the window, his tea going cold.)|(He is lost in thought.)|(He chatters to everyone at the table.)
        She is startled.|(She jumps and drops the cup.)|(She is startled by the noise.)|(She keeps reading, unbothered.)
        He is embarrassed.|(He turns red and pulls his hat low.)|(He feels embarrassed, and the audience should understand exactly how this feels.)|(He bows grandly to the crowd.)
        She is determined.|(She grips the rope and pulls herself up another foot.)|(She is determined to climb.)|(She lets go of the rope and walks away.)
        He is hungry.|(He stares at the bread and his stomach growls loudly.)|(He is very hungry, more than he has ever felt it before.)|(He pushes his plate away, full.)
        She is drowsy.|(Her head nods, jerks up, and nods again.)|(She feels drowsy.)|(She paces the room, wide awake.)
        He is terrified.|(He presses himself into the corner, shaking.)|(He is terrified, and this is the most important thing in the scene.)|(He laughs and steps toward the beast.)
        She is curious.|(She leans close to the box and lifts the lid an inch.)|(She is curious about the box.)|(She pushes the box away without a glance.)
        He is disappointed.|(He reads the letter, lets it fall and stares at the floor.)|(He is disappointed by the letter, and the audience should understand exactly how this feels.)|(He reads the letter and punches the air in delight.)
        She is calm.|(She folds her hands and waits, breathing slowly.)|(She stays calm.)|(She paces and shouts at the guards.)
        He is sneaky.|(He tiptoes to the desk, glancing back, and slips a key into his pocket.)|(He is being sneaky, and the audience should understand exactly how this feels.)|(He marches loudly to the desk and announces himself.)
        She is heartbroken.|(She tears up the photograph and turns away, her shoulders shaking.)|(She is heartbroken.)|(She frames the photograph and hums to herself.)
      `,
      (right) => [`*${right}* turns the feeling into an action the audience can see.`, `*${right}* 把感受变成了观众能看到的动作。`],
      [
        [
          "*{wrong}* still only states the feeling, so the actor is given nothing to do.",
          "*{wrong}* 仍然只陈述了感受，演员没有可做的动作。",
        ],
        ["*{wrong}* shows an action, but it suggests a different feeling.", "*{wrong}* 表现了一个动作，但它暗示的是另一种感受。"],
      ],
    ),
  ],
});

const interviewing = topic("writing", {
  id: "interviewing-and-quoting-a-person",
  title: ["Interviewing and Quoting a Person", "采访并引用他人的话"],
  summary: [
    "A good interview asks open questions that invite stories, and the write-up quotes the person's exact words with an attribution.",
    "好的采访提出引出故事的开放式问题，写作时要准确引用对方的原话并注明是谁说的。",
  ],
  after: ["quoting-accurately", "integrating-quotations"],
  points: [
    label(
      "what-kind-of-question",
      ["What Kind of Question", "什么样的问题"],
      [
        "In an interview, the question shapes the answer. An **open question** invites a story or an explanation: *What do you remember about your first day in the new country?* A **yes-or-no question** gets a one-word answer: *Were you scared?* A **leading question** puts the answer in the person's mouth: *Wasn't it terrible to leave your home?*",
        "在采访中，问题决定回答。**开放式问题**引出故事或解释：*What do you remember about your first day in the new country?* **是非问题**只能得到一个词的回答：*Were you scared?* **诱导性问题**把答案塞进对方嘴里：*Wasn't it terrible to leave your home?*",
      ],
      ["What kind of interview question is this?", "这是什么样的采访问题？"],
      `
        What do you remember about your first day in the new country?|an open question
        Were you scared on your first day?|a yes-or-no question
        Wasn't your first day absolutely terrifying?|a leading question
        How did you learn the new language?|an open question
        Did you learn the language quickly?|a yes-or-no question
        You must have found the language impossibly hard, didn't you?|a leading question
        What did you bring with you when you left?|an open question
        Did you bring anything with you?|a yes-or-no question
        Surely you had to leave everything precious behind?|a leading question
        Tell me about the journey across the sea.|an open question
        Was the journey long?|a yes-or-no question
        The journey was the worst part, wasn't it?|a leading question
        How did your neighbors treat you when you arrived?|an open question
        Were your neighbors friendly?|a yes-or-no question
        Your neighbors were unkind to you, weren't they?|a leading question
        What was your first job like?|an open question
        Did you like your first job?|a yes-or-no question
        Your first job must have been awful, right?|a leading question
        What do you miss most about the place you grew up?|an open question
        Do you miss your old home?|a yes-or-no question
        Don't you wish you had never left?|a leading question
        How did your family keep its traditions here?|an open question
        Did your family keep its traditions?|a yes-or-no question
        Your family lost all its traditions, didn't it?|a leading question
        What surprised you most about your new school?|an open question
        Was your new school different?|a yes-or-no question
        The new school was much better, wasn't it?|a leading question
        How has your idea of home changed over the years?|an open question
        Do you feel at home here now?|a yes-or-no question
        You feel completely at home here now, don't you?|a leading question
      `,
      {
        "an open question": L(
          "开放式问题",
          "The question begins with *what*, *how* or *tell me* and invites a story or an explanation in the person's own words.",
          "这个问题以 *what*、*how* 或 *tell me* 开头，引导对方用自己的话讲故事或解释。",
          "The question can be answered in a word or suggests its own answer.",
          "这个问题可以用一个词回答，或者暗示了答案。",
        ),
        "a yes-or-no question": L(
          "是非问题",
          "The question can be answered with *yes* or *no*, so it is unlikely to draw out a story.",
          "这个问题可以用 *yes* 或 *no* 回答，所以不太可能引出故事。",
          "The question cannot be answered with yes or no alone.",
          "这个问题不能只用是或否来回答。",
        ),
        "a leading question": L(
          "诱导性问题",
          "The question suggests the answer the interviewer expects, with words like *surely*, *must have* or a tag such as *didn't it?*",
          "这个问题用 *surely*、*must have* 或 *didn't it?* 之类的附加语，暗示了采访者期待的答案。",
          "The question does not push the person toward an answer.",
          "这个问题没有把对方推向某个答案。",
        ),
      },
    ),
    choose(
      "quoting-what-they-said",
      ["Quoting What They Said", "引用对方所说的话"],
      [
        'When you write up an interview, a direct quotation must keep the person\'s **exact words** in quotation marks, and say **who said it**: *"I cried for a week," said Mrs. Okafor.* If you change the words, drop the quotation marks and report them instead: *Mrs. Okafor said she cried for a week.* Two mistakes are common: putting **changed words inside quotation marks**, and giving a quotation **with no speaker**.',
        '整理采访时，直接引语必须把对方的**原话**放在引号里，并说明**是谁说的**：*"I cried for a week," said Mrs. Okafor.* 如果改动了用词，就去掉引号，改为转述：*Mrs. Okafor said she cried for a week.* 常见的错误有两种：把**改动过的话放在引号里**，以及给出的引语**没有说话人**。',
      ],
      ["The person said the words shown. Which write-up quotes them correctly?", "受访者说了所示的话。哪种写法正确地引用了它们？"],
      `
        Mrs. Okafor said: I cried for a week.|"I cried for a week," said Mrs. Okafor.|"I was very sad for many days," said Mrs. Okafor.|"I cried for a week."
        Mr. Diaz said: The bread here tasted of nothing.|"The bread here tasted of nothing," Mr. Diaz said.|"The bread was not very good," Mr. Diaz said during our interview.|"The bread here tasted of nothing."
        Grandma Lin said: We slept on the deck for twelve nights.|Grandma Lin recalled, "We slept on the deck for twelve nights."|Grandma Lin recalled, "We slept outside for about two weeks."|"We slept on the deck for twelve nights."
        Mr. Haddad said: My mother sold her gold ring to pay our way.|"My mother sold her gold ring to pay our way," said Mr. Haddad.|"My mother sold her jewelry for our tickets," said Mr. Haddad when I visited last spring.|"My mother sold her gold ring to pay our way."
        Ms. Novak said: Snow was the first thing I saw.|"Snow was the first thing I saw," Ms. Novak said.|"The first thing I noticed was the cold weather," Ms. Novak said.|"Snow was the first thing I saw."
        Mr. Tran said: I learned English from the radio.|Mr. Tran explained, "I learned English from the radio."|Mr. Tran explained, "I taught myself English with the radio and TV."|"I learned English from the radio."
        Mrs. Silva said: The factory whistle woke the whole street.|"The factory whistle woke the whole street," said Mrs. Silva.|"The factory was very noisy in the morning," said Mrs. Silva.|"The factory whistle woke the whole street."
        Mr. Abebe said: I carried my father's letters in my shoe.|"I carried my father's letters in my shoe," Mr. Abebe said.|"I hid some important papers," Mr. Abebe said.|"I carried my father's letters in my shoe."
        Mrs. Kowalski said: Nobody could say my name.|"Nobody could say my name," said Mrs. Kowalski.|"People found my name hard to pronounce," said Mrs. Kowalski.|"Nobody could say my name."
        Mr. Rossi said: We built the church with our own hands.|Mr. Rossi said, "We built the church with our own hands."|Mr. Rossi said, as we looked at old photographs, "We helped to build a church."|"We built the church with our own hands."
        Ms. Ahmed said: My first friend here was the librarian.|"My first friend here was the librarian," said Ms. Ahmed.|"I made friends at the library," said Ms. Ahmed.|"My first friend here was the librarian."
        Mr. Kim said: The city never went dark at night.|"The city never went dark at night," Mr. Kim remembered.|"The city had a lot of lights," Mr. Kim remembered with a quiet smile.|"The city never went dark at night."
        Mrs. Mensah said: I sent half my wages home every month.|"I sent half my wages home every month," Mrs. Mensah said.|"I sent money to my family," Mrs. Mensah said.|"I sent half my wages home every month."
        Mr. Petrov said: At the border, they took my books.|"At the border, they took my books," said Mr. Petrov.|"I lost some things when I crossed over," said Mr. Petrov.|"At the border, they took my books."
        Mrs. Gupta said: I cooked my mother's recipes to feel close to her.|Mrs. Gupta said, "I cooked my mother's recipes to feel close to her."|Mrs. Gupta said, during our interview, "Cooking reminded me of my family."|"I cooked my mother's recipes to feel close to her."
        Mr. Ortiz said: The first winter, I wore every shirt I owned.|"The first winter, I wore every shirt I owned," Mr. Ortiz laughed.|"The first winter was very cold," Mr. Ortiz laughed.|"The first winter, I wore every shirt I owned."
        Ms. Yamada said: My grandmother wept when she saw the ocean again.|"My grandmother wept when she saw the ocean again," said Ms. Yamada.|"My grandmother was emotional at the seaside," said Ms. Yamada when I visited last spring.|"My grandmother wept when she saw the ocean again."
        Mr. Nwosu said: I studied at night under the streetlight.|Mr. Nwosu said, "I studied at night under the streetlight."|Mr. Nwosu said, "I worked hard at my studies."|"I studied at night under the streetlight."
        Mrs. Costa said: The ship's horn still wakes me in my dreams.|"The ship's horn still wakes me in my dreams," Mrs. Costa said.|"I still remember the voyage," Mrs. Costa said as we looked at old photographs.|"The ship's horn still wakes me in my dreams."
        Mr. Ali said: We had one suitcase for six people.|"We had one suitcase for six people," said Mr. Ali.|"We did not bring much luggage," said Mr. Ali.|"We had one suitcase for six people."
        Mrs. Murphy said: My father kept a jar of soil from our farm.|"My father kept a jar of soil from our farm," said Mrs. Murphy.|"My father kept things to remind him of home," said Mrs. Murphy.|"My father kept a jar of soil from our farm."
        Mr. Chen said: I was ten, and I translated for my parents.|"I was ten, and I translated for my parents," Mr. Chen said.|"I helped my parents when I was young," Mr. Chen said with a quiet smile.|"I was ten, and I translated for my parents."
        Ms. Ivanova said: The first word I learned was "sorry."|Ms. Ivanova said, "The first word I learned was 'sorry.'"|Ms. Ivanova said, "I learned polite words first."|"The first word I learned was 'sorry.'"
        Mr. Bello said: My uncle met us with a sign that had my name spelled wrong.|"My uncle met us with a sign that had my name spelled wrong," said Mr. Bello.|"My uncle came to meet us at the airport," said Mr. Bello during our interview.|"My uncle met us with a sign that had my name spelled wrong."
        Mrs. Hassan said: I planted my mother's seeds in a tin can.|"I planted my mother's seeds in a tin can," Mrs. Hassan said.|"I grew some plants from home," Mrs. Hassan said.|"I planted my mother's seeds in a tin can."
        Mr. Santos said: The train was so full we stood for two days.|"The train was so full we stood for two days," Mr. Santos said.|"The train was crowded," Mr. Santos said when I visited last spring.|"The train was so full we stood for two days."
        Mrs. Ng said: My children speak to me in English, and I answer in Cantonese.|"My children speak to me in English, and I answer in Cantonese," said Mrs. Ng.|"My family speaks two languages," said Mrs. Ng.|"My children speak to me in English, and I answer in Cantonese."
        Mr. Okoro said: I still keep my old passport in a drawer.|"I still keep my old passport in a drawer," said Mr. Okoro.|"I have kept some old documents," said Mr. Okoro as we looked at old photographs.|"I still keep my old passport in a drawer."
        Ms. Dubois said: The teacher gave me a dictionary on my first day.|"The teacher gave me a dictionary on my first day," Ms. Dubois said.|"My teacher was kind to me," Ms. Dubois said.|"The teacher gave me a dictionary on my first day."
        Mr. Lopez said: We sang the old songs on the boat to stay brave.|"We sang the old songs on the boat to stay brave," said Mr. Lopez.|"We sang to keep our spirits up," said Mr. Lopez with a quiet smile.|"We sang the old songs on the boat to stay brave."
      `,
      (right) => [
        `${right} The exact words are in quotation marks, and the speaker is named.`,
        `${right} 原话放在引号里，并注明了说话人。`,
      ],
      [
        [
          "*{wrong}* puts changed words inside quotation marks, so it claims the person said something they did not.",
          "*{wrong}* 把改动过的话放在引号里，等于声称对方说了他们没说过的话。",
        ],
        ["*{wrong}* keeps the exact words but never says who said them.", "*{wrong}* 保留了原话，却没有说明是谁说的。"],
      ],
    ),
  ],
});

/** writingTopics8b are the writing topics, checked by rule, of the later units of grade 8. */
export const writingTopics8b: readonly TopicDef[] = [atmosphere, stageDirections, interviewing];
