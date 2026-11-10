// Grades 9 to 12: the reading unit of the third theme, tragedy and the stage, from the theaters of Athens to the
// rehearsal room.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const theater = { topic: "words-of-the-theater", weight: 0.3 } as const;
const drama = { topic: "dramatic-structure-and-dialogue", weight: 0.2 } as const;
const academic = { topic: "academic-words-1", weight: 0.1 } as const;

/** tragedyOnTheStage is a reading unit of grades 9 to 12 on drama: its history, its forms and the people who make it. */
export const tragedyOnTheStage: ReadingUnitDef = {
  id: "tragedy-on-the-stage",
  title: t("Tragedy on the Stage", "舞台上的悲剧"),
  passages: [
    passage(
      "the-theater-of-athens",
      t("The Theater of Athens", "雅典的剧场"),
      `Every spring, about two and a half thousand years ago, the people of Athens gathered on a hillside to watch plays. The festival honored Dionysus, the god of wine and celebration, and it lasted several days. Thousands of citizens sat on stone benches cut into the slope, looking down at a round, flat space where the actors and the chorus performed.

The plays were contests. Each year, three writers were chosen to present their work, and each offered three tragedies followed by a shorter, lighter play. At the end of the festival, judges named a winner. Writers such as Aeschylus, Sophocles and Euripides became famous through these contests, and a few of their plays survive today.

Greek theater looked very different from theater now. There were only two or three actors, all of them men, and each played several parts by changing masks. The masks were large and simple, with clear expressions, so that people in the highest rows could tell a king from a servant or grief from anger. Behind the actors stood a building used for changing costumes, and its painted front could represent a palace or a temple.

The chorus, a group of twelve to fifteen performers, sang and danced between the scenes. It spoke as a group of citizens, elders or servants, commenting on the action and asking the questions the audience might ask.

The tragedies usually told old stories that the audience already knew, about the families of ancient kings. The surprise was not in what happened but in how the writer made it feel. Watching a proud ruler fall, the audience felt pity and fear, and left, the Greeks believed, somehow cleansed. Aristotle, a philosopher who studied these plays, called this feeling catharsis, and the word is still used today. When a film or a novel leaves you shaken but strangely calm, you are feeling something the people of Athens felt on that hillside long ago.`,
      [clues, theater],
      [
        ask(
          t("Why were the masks of Greek actors large and simple?", "希腊演员的面具为什么又大又简单？"),
          t("So that people far away could see who each character was and how they felt", "为了让远处的观众看清每个角色是谁以及他们的感受"),
          [
            t("Because the actors were ashamed of their faces", "因为演员羞于露出自己的脸"),
            t("Because masks were cheap to make", "因为面具制作便宜"),
            t("So that the judges could not recognize the actors", "为了不让评委认出演员"),
          ],
          t(
            "The passage says the masks had clear expressions so that people in the highest rows could tell a king from a servant or grief from anger.",
            "文章说，面具的表情清楚，这样坐在最高几排的人也能分辨国王和仆人、悲伤和愤怒。",
          ),
        ),
        ask(
          t("Where did the surprise of a Greek tragedy lie, according to the passage?", "根据文章，希腊悲剧的惊喜之处在哪里？"),
          t("In how the writer made a familiar story feel", "在于作者如何让一个熟悉的故事打动人"),
          [
            t("In a twist ending that no one expected", "在于一个谁也想不到的结局"),
            t("In stories that were new every year", "在于每年都是全新的故事"),
            t("In the number of actors on stage", "在于台上演员的人数"),
          ],
          t(
            "The audience already knew the stories, so the surprise was not in what happened but in how the writer made it feel.",
            "观众早已知道这些故事，所以惊喜不在于发生了什么，而在于作者怎样让它打动人心。",
          ),
        ),
        ask(
          t("What does the word catharsis name in the last paragraph?", "最后一段中的 catharsis 一词指的是什么？"),
          t("The cleansing release of pity and fear an audience feels", "观众释放怜悯与恐惧后获得的净化感"),
          [
            t("A kind of Greek mask", "一种希腊面具"),
            t("The contest between writers", "作者之间的比赛"),
            t("The building behind the actors", "演员身后的建筑"),
          ],
          t(
            "Context clues: watching a ruler fall, the audience felt pity and fear and left somehow cleansed; Aristotle called this feeling catharsis.",
            "上下文线索：看着统治者倒下，观众感到怜悯和恐惧，离开时仿佛得到了净化；亚里士多德把这种感受称为 catharsis。",
          ),
        ),
      ],
      ["Athens", "Dionysus", "Aeschylus", "Sophocles", "Euripides", "Aristotle", "Greeks", "Greek"],
    ),
    passage(
      "the-wooden-o",
      t("The Wooden O", "木制的 O 形剧场"),
      `In 1599, a company of actors in London did something remarkable. Their landlord had refused to renew the lease on their old theater, so one cold night they took the building apart, carried its heavy timbers across the river and used them to build a new playhouse. They called it the Globe, and one of the company's members was a writer named William Shakespeare.

The Globe was a tall, round building, open to the sky in the middle. Shakespeare called it "this wooden O." Around the edge were three levels of covered seats for those who could pay more. In the center, standing on the bare ground, were the poorer members of the audience, who paid a single penny. They stood close to the stage, which pushed out into the crowd, so that the actors performed almost among them.

Plays began in the afternoon, using daylight, because there was no electric lighting. There was little scenery, either. A writer had to set the scene with words, so characters often described where they were and what time it was. When a character said that dawn was breaking, the audience imagined it, even in the bright afternoon.

Audiences were loud. They ate nuts and fruit, cheered the heroes, shouted at the villains and sometimes threw things at actors they did not like. A playwright who wanted to hold their attention had to give them sword fights, jokes and ghosts as well as great speeches.

All the roles, including those of women, were played by men and boys. Shakespeare wrote many of his finest plays for this stage, from comedies full of disguises to tragedies such as Hamlet and Macbeth. The original Globe burned down in 1613, when a cannon fired during a play set the roof alight. A careful copy now stands near the original site, and audiences still stand in the yard to watch.`,
      [clues, theater],
      [
        ask(
          t("Why did the actors take apart their old theater?", "演员们为什么拆掉了他们的旧剧场？"),
          t("Their landlord refused to renew the lease, so they reused its timbers", "房东拒绝续租，于是他们重新利用剧场的木料"),
          [
            t("It had burned down in a fire", "它在一场火灾中烧毁了"),
            t("The queen ordered them to move", "女王命令他们搬走"),
            t("It was too small for the chorus", "它太小，容不下歌队"),
          ],
          t(
            "The first paragraph says the landlord had refused to renew the lease, so they carried the timbers across the river to build the Globe.",
            "第一段说，房东拒绝续租，于是他们把木料运过河，建起了环球剧场。",
          ),
        ),
        ask(
          t(
            "Why did characters in these plays often describe where they were and what time it was?",
            "这些戏中的人物为什么常常描述自己在哪里、是什么时间？",
          ),
          t("Because there was little scenery and no lighting to show it", "因为几乎没有布景，也没有灯光来表现"),
          [
            t("Because the audience could not hear well", "因为观众听不清楚"),
            t("Because the actors forgot their lines", "因为演员忘了台词"),
            t("Because plays were performed at night", "因为戏是在晚上演出的"),
          ],
          t(
            "Plays used daylight and had little scenery, so a writer had to set the scene with words.",
            "演出依靠日光，几乎没有布景，所以作者必须用文字来交代场景。",
          ),
        ),
        ask(
          t(
            "What can you infer about what a playwright needed in order to succeed at the Globe?",
            "关于剧作家要在环球剧场取得成功需要什么，你能推断出什么？",
          ),
          t("Variety and excitement that could hold a loud, restless crowd", "能吸引吵闹、躁动观众的丰富性和刺激感"),
          [
            t("Long silences and very little action", "长时间的沉默和极少的动作"),
            t("Plays written only for the rich", "只为富人写的戏"),
            t("Roles written for women actors", "为女演员写的角色"),
          ],
          t(
            "Audiences were loud, so a playwright had to give them sword fights, jokes and ghosts as well as great speeches.",
            "观众很吵闹，所以剧作家除了精彩的独白，还得提供剑斗、笑话和鬼魂。",
          ),
        ),
      ],
      ["London", "Globe", "William", "Shakespeare", "Shakespeare's", "Hamlet", "Macbeth"],
    ),
    passage(
      "the-shape-of-a-tragedy",
      t("The Shape of a Tragedy", "悲剧的结构"),
      `Most tragedies, from ancient Athens to the present, follow a similar shape. Knowing it does not spoil a play; it helps you notice how a writer builds tension and where the turning points fall.

A tragedy usually centers on a protagonist who begins in a high position: a king, a general, a respected leader or simply a person admired by everyone around them. This character is not wicked. Often they are brave, clever or generous. But they also have a weakness, sometimes called a tragic flaw. Very often it is hubris, a pride so great that the character believes they cannot be wrong or cannot be beaten.

The play opens with exposition, which introduces the characters and the situation. Then comes an inciting incident, an event that sets the conflict in motion: a prophecy, a crime, a message from a ghost. As the rising action continues, the protagonist makes choices, and each choice, driven partly by the flaw, pulls them deeper into trouble.

At the climax, the highest point of tension, the protagonist makes a decision or discovers a truth from which there is no turning back. Often this moment includes a reversal: the action the character hoped would save them is exactly what destroys them. In many tragedies, the climax also brings recognition, the moment when the protagonist finally sees the truth about themselves.

After the climax, the falling action moves quickly toward the end. The denouement, or final resolution, often brings death or ruin. Yet tragedy is not simply sad. Watching the fall, the audience recognizes how human the protagonist's mistakes are, and feels both pity for the character and fear that the same thing could happen to anyone.

Dramatic irony adds to the tension throughout. When the audience knows something a character does not, every confident line that character speaks sounds like a warning.`,
      [clues, theater, drama],
      [
        ask(
          t("According to the passage, what is often the protagonist's tragic flaw?", "根据文章，主人公的悲剧性缺陷常常是什么？"),
          t("Hubris, a pride so great they think they cannot be wrong", "傲慢，即骄傲到认为自己不可能犯错"),
          [
            t("Laziness and a lack of ambition", "懒惰和缺乏抱负"),
            t("Wickedness and cruelty", "邪恶与残忍"),
            t("Poverty and bad luck", "贫穷和厄运"),
          ],
          t(
            "The passage says the flaw is very often hubris, a pride so great that the character believes they cannot be wrong or beaten.",
            "文章说，这种缺陷往往是傲慢，骄傲到让人物以为自己不会错、不会被打败。",
          ),
        ),
        ask(
          t("What is a reversal, as described in the passage?", "文章所描述的“逆转”是什么？"),
          t("The action meant to save the character is what destroys them", "原本想用来自救的行动恰恰毁了人物"),
          [
            t("The play is performed backward", "这出戏倒着演"),
            t("The villain becomes the hero", "反派变成了英雄"),
            t("The audience learns a secret", "观众得知了一个秘密"),
          ],
          t(
            "The passage defines a reversal as the moment when the action the character hoped would save them is exactly what destroys them.",
            "文章把逆转定义为：人物希望用来自救的行动，恰恰把他毁掉的时刻。",
          ),
        ),
        ask(
          t(
            "Why does dramatic irony make a character's confident lines sound like warnings?",
            "为什么戏剧反讽会让人物自信的台词听起来像警告？",
          ),
          t("Because the audience knows something the character does not", "因为观众知道人物所不知道的事"),
          [
            t("Because the actor speaks them quietly", "因为演员说得很小声"),
            t("Because the chorus repeats them", "因为歌队重复这些台词"),
            t("Because the character is lying on purpose", "因为人物在故意说谎"),
          ],
          t(
            "When the audience knows something a character does not, the character's confidence shows how little they understand their danger.",
            "当观众知道人物所不知道的事情时，人物的自信恰恰说明他对自身危险知之甚少。",
          ),
        ),
      ],
      ["Athens"],
    ),
    passage(
      "the-voice-of-the-chorus",
      t("The Voice of the Chorus", "歌队的声音"),
      `In the earliest Greek plays, the chorus was the heart of the performance. Before there were individual actors at all, groups of singers and dancers performed songs about gods and heroes. Over time, writers added one actor, then a second, then a third, and the chorus gradually gave up the center of the stage. But it never disappeared.

A Greek chorus spoke and sang as a single character, though it was made up of many people. It might represent the elders of a city, a group of young women or the servants of a house. Between scenes, it filled the stage with songs that looked back on what had happened and forward to what might come.

The chorus did several jobs at once. It gave background information the audience needed, much like exposition. It reacted to events, showing the audience how ordinary people felt about the choices of kings and queens. Sometimes it gave advice to the main characters, warning them to be careful, and was ignored. Most of all, it gave the audience time to think. After a terrible scene, the chorus's song slowed the play down and turned a single event into a reflection on human life.

Later writers found new ways to use the idea. Shakespeare opened some of his plays with a single speaker called the Chorus, who set the scene and asked the audience to use its imagination. In modern theater, a group of townspeople, a narrator who speaks directly to the audience, or even a song in a musical can serve the same purpose.

When you read a play with a chorus, pay attention to the gap between what the chorus knows and what the characters know. The chorus often sees the danger clearly while the protagonist rushes on, and that gap is one of the sources of a tragedy's power.`,
      [clues, theater, drama, academic],
      [
        ask(
          t("How did the role of the chorus change in early Greek theater?", "在早期希腊戏剧中，歌队的作用发生了怎样的变化？"),
          t("It gave up the center of the stage as writers added actors", "随着作者增加演员，它让出了舞台中心"),
          [
            t("It grew larger until it replaced the actors", "它越来越大，最终取代了演员"),
            t("It was removed from all plays", "它从所有剧中被删去"),
            t("It began to play only comedies", "它开始只演喜剧"),
          ],
          t(
            "The first paragraph says writers added one actor, then a second, then a third, and the chorus gradually gave up the center of the stage.",
            "第一段说，作者先后增加了第一、第二、第三个演员，歌队逐渐让出了舞台中心。",
          ),
        ),
        ask(
          t("Which of these is NOT a job of the chorus described in the passage?", "以下哪一项不是文章所描述的歌队的职能？"),
          t("Playing the part of the protagonist", "扮演主人公"),
          [
            t("Giving background information", "提供背景信息"),
            t("Reacting to events as ordinary people", "以普通人的身份对事件作出反应"),
            t("Giving the audience time to think", "给观众留出思考的时间"),
          ],
          t(
            "The passage lists background information, reactions, advice and time to think; the protagonist is played by an actor, not the chorus.",
            "文章列出了提供背景、作出反应、给出建议和留出思考时间；主人公由演员扮演，而不是歌队。",
          ),
        ),
        ask(
          t("According to the last paragraph, what gap is a source of a tragedy's power?", "根据最后一段，哪种差距是悲剧力量的来源之一？"),
          t("The gap between what the chorus sees and what the protagonist knows", "歌队所看到的与主人公所知道的之间的差距"),
          [
            t("The gap between rich and poor seats", "贵座和廉价座位之间的差距"),
            t("The gap between two acts of a play", "戏剧两幕之间的间隔"),
            t("The gap between the stage and the audience", "舞台与观众之间的距离"),
          ],
          t(
            "The chorus often sees the danger clearly while the protagonist rushes on, and that gap is a source of power.",
            "歌队常常清楚地看到危险，而主人公却一意孤行，这种差距就是悲剧力量的来源之一。",
          ),
        ),
      ],
      ["Greek", "Shakespeare"],
    ),
    passage(
      "the-understudys-night",
      t("The Understudy's Night", "替补演员之夜"),
      `For six weeks, Maya Okonkwo had sat in the back row of every rehearsal with the script open on her knees. She was the understudy for Lady Macbeth, which meant she learned every line, every movement and every pause, and then watched someone else perform them. "You're our insurance," the director had told her on the first day, smiling. Maya had smiled back and tried not to think about what insurance was for.

At five o'clock on opening night, her phone rang. The lead actor had a fever and could barely speak. "You're on," the stage manager said. "Costume fitting in ten minutes."

The next two hours passed in a blur. The dress had to be pinned because it was too long. Someone fixed her hair while someone else read her the changes to the second act that had been made only the day before. In the corner, an actor who played a servant quietly ran lines with her, cueing each speech so she could hear the rhythm again.

Then the lights went down. Maya stood in the dark at the side of the stage, her heart pounding so hard she was sure the front row could hear it. She thought of all the evenings in the back row, of the pages she had marked in pencil, of the soliloquy she had whispered to herself on the bus.

When she stepped into the light, something strange happened. The fear did not leave, but it changed. It became energy, sharp and bright, and she spoke the first line clearly into the silence.

She stumbled once, in the third act, and the actor beside her covered the moment so smoothly that no one noticed. At the curtain call, the cast pushed her forward, and the applause rose like a wave. Afterward, the director found her backstage. "Insurance," he said, shaking his head. "Not anymore."`,
      [clues, theater],
      [
        ask(
          t('What does the director mean by calling Maya "our insurance"?', "导演称玛雅为“我们的保险”是什么意思？"),
          t("She will step in if the lead actor cannot perform", "如果主演无法演出，她就会顶上"),
          [
            t("She handles the theater's money", "她负责剧院的财务"),
            t("She has the most experience in the cast", "她是剧组里最有经验的人"),
            t("She sells tickets before the show", "她在演出前卖票"),
          ],
          t(
            "An understudy learns a role in case the regular actor cannot go on, just as insurance protects against something going wrong.",
            "替补演员学习角色，以防正式演员不能上台，就像保险是用来防备意外的。",
          ),
        ),
        ask(
          t("How does Maya's fear change when she steps onto the stage?", "玛雅走上舞台时，她的恐惧发生了什么变化？"),
          t("It turns into sharp, bright energy", "它变成了敏锐而明亮的能量"),
          [
            t("It disappears completely", "它完全消失了"),
            t("It makes her forget all her lines", "它让她忘了所有台词"),
            t("It makes her leave the stage", "它让她离开了舞台"),
          ],
          t(
            "The passage says the fear did not leave, but it changed into energy, sharp and bright.",
            "文章说，恐惧并没有消失，而是变成了敏锐而明亮的能量。",
          ),
        ),
        ask(
          t('What does the director\'s final line, "Not anymore," suggest?', "导演最后一句“Not anymore”暗示了什么？"),
          t("Maya has proved herself as a real performer, not just a backup", "玛雅已经证明自己是真正的演员，而不只是替补"),
          [
            t("Maya will be fired from the company", "玛雅将被剧团解雇"),
            t("The theater will stop buying insurance", "剧院将不再购买保险"),
            t("The lead actor has left for good", "主演永远离开了"),
          ],
          t(
            "The director returns to the word he used at the start; after her success, she is no longer only a backup.",
            "导演用回开头说过的那个词；她成功之后，就不再只是一个备用人选了。",
          ),
        ),
      ],
      ["Maya", "Okonkwo", "Macbeth"],
    ),
    passage(
      "when-comedy-goes-wrong",
      t("When Comedy Goes Wrong on Purpose", "故意出错的喜剧"),
      `Tragedy asks us to feel for characters who suffer. Farce asks us to laugh at characters who suffer, and to laugh harder the worse things get. It may seem like the opposite of tragedy, but the two forms share more than you might think.

A farce is a comedy built on ridiculous situations, mistaken identities, perfect bad timing and physical humor. Doors slam, people hide in cupboards, letters reach the wrong person and lies grow more and more complicated as characters try to cover them up. The characters are usually not deep or complex; they are types, such as the jealous husband, the clever servant or the nervous guest, and we laugh at how they react to chaos.

Like tragedy, farce depends on structure. Each scene must make the situation slightly worse than the one before, so the tension rises steadily toward a climax. And like tragedy, it often uses dramatic irony: the audience knows that the man hiding in the cupboard is the doctor, while the characters on stage do not. Every innocent question becomes a threat, and the audience waits for the moment when the truth comes out.

The difference lies mainly in how we feel about the characters. In a tragedy, we care about the protagonist and fear for them. In a farce, we stay at a distance. Nobody is really hurt, and we know that everything will be put right by the end.

Farce is also extremely hard to perform. Timing must be exact: a door that opens one second too late can kill a joke. Actors in a farce often rehearse every movement as carefully as dancers. The audience should feel that everything is falling apart, while in fact every fall has been planned to the inch. In that sense, a good farce is a perfectly controlled machine for producing chaos.`,
      [clues, theater, drama],
      [
        ask(
          t("What is the main difference between farce and tragedy, according to the passage?", "根据文章，闹剧和悲剧的主要区别是什么？"),
          t("How the audience feels about the characters", "观众对人物的感受"),
          [
            t("Whether the play has a structure", "这出戏是否有结构"),
            t("Whether the play uses dramatic irony", "这出戏是否运用戏剧反讽"),
            t("How long the play lasts", "这出戏演多长时间"),
          ],
          t(
            "The passage says the difference lies mainly in how we feel: we care about a tragic protagonist but stay at a distance in a farce.",
            "文章说，区别主要在于我们的感受：我们关心悲剧主人公，而对闹剧人物则保持距离。",
          ),
        ),
        ask(
          t("Why do actors in a farce rehearse like dancers?", "为什么闹剧演员要像舞者一样排练？"),
          t("Because exact timing is needed for the jokes to work", "因为笑点需要精确的时机"),
          [
            t("Because farces always include dances", "因为闹剧总是包含舞蹈"),
            t("Because they have no lines to learn", "因为他们没有台词要背"),
            t("Because the stage is very small", "因为舞台很小"),
          ],
          t(
            "The passage says timing must be exact, since a door that opens one second too late can kill a joke.",
            "文章说，时机必须精确，因为一扇门晚开一秒就可能毁掉一个笑点。",
          ),
        ),
        ask(
          t(
            'What does the writer mean by calling farce "a perfectly controlled machine for producing chaos"?',
            "作者称闹剧为“一台精确控制的、制造混乱的机器”，是什么意思？",
          ),
          t("The chaos the audience sees is carefully planned", "观众看到的混乱是精心设计的"),
          [
            t("Farces are performed by machines", "闹剧由机器表演"),
            t("Farces are random and unplanned", "闹剧是随意而无计划的"),
            t("The audience controls what happens", "观众控制着剧情"),
          ],
          t(
            "The phrase joins opposite ideas: what looks like chaos is the product of exact planning, as the paragraph says every fall is planned to the inch.",
            "这个说法把相反的概念放在一起：看起来的混乱其实是精确策划的产物，正如这一段所说，每一次摔倒都经过分毫不差的设计。",
          ),
        ),
      ],
    ),
    passage(
      "reading-the-stage-directions",
      t("Reading the Stage Directions", "阅读舞台说明"),
      `When you read a play rather than watch it, you have to do the work of the director, the designers and the actors in your own head. The most important tools for this are the stage directions, the words in italics or brackets that are not spoken aloud.

Some stage directions describe the setting. A modern play might begin: A small kitchen, late at night. A single lamp. Dishes pile up in the sink. In only a few words, the writer tells you that the family is tired, perhaps struggling, and that something has been left undone. Every object a playwright puts on stage is a choice, and many of them carry meaning.

Other directions tell actors how to move or speak. Words such as quietly, turning away or a long pause can completely change how a line sounds. Compare a character who says "I'm fine" while smiling with one who says it while staring at the floor. The words are the same; the meaning is opposite.

Pauses are especially important. In some modern plays, the silences are as carefully written as the speeches. A pause can show that a character is hiding something, struggling to find words or deciding whether to tell the truth. When you see one, stop and ask what is happening in that silence.

Stage directions can also reveal subtext, the meaning beneath the words. Two characters may talk politely about the weather while the directions show one of them gripping a letter she has not opened. The audience senses the real conversation underneath the polite one.

Older plays often have very few stage directions, because writers expected to direct the actors themselves. In those plays, you must find the clues in the dialogue: a character who says "Why do you weep?" tells you what the other one is doing.`,
      [clues, theater, drama, academic],
      [
        ask(
          t(
            'What can the setting "Dishes pile up in the sink" suggest about a family?',
            "“水槽里堆满了碗碟”这个场景能暗示这个家庭的什么情况？",
          ),
          t("That they are tired or struggling and things are left undone", "他们很疲惫或处境艰难，事情没有做完"),
          [
            t("That they are very rich", "他们非常富有"),
            t("That they are about to have a party", "他们即将举办派对"),
            t("That they love to cook together", "他们喜欢一起做饭"),
          ],
          t(
            "The passage says these few words tell you that the family is tired, perhaps struggling, and that something has been left undone.",
            "文章说，这寥寥几个词告诉你，这个家庭很疲惫，也许在挣扎，还有事情没做完。",
          ),
        ),
        ask(
          t("What is subtext, as the passage uses the word?", "文章中使用的 subtext 一词是什么意思？"),
          t("The meaning beneath what the characters actually say", "人物实际所说的话之下的含义"),
          [
            t("A second script printed under the first", "印在第一份剧本下面的第二份剧本"),
            t("A translation of the dialogue", "对白的翻译"),
            t("The list of characters at the start", "开头的人物表"),
          ],
          t(
            "The passage defines subtext as the meaning beneath the words, as when a polite chat hides a real conversation underneath.",
            "文章把 subtext 定义为话语之下的含义，就像一场客气的闲聊下面隐藏着真正的对话。",
          ),
        ),
        ask(
          t(
            "How can you find stage directions in older plays that have very few written ones?",
            "在书面舞台说明很少的老剧本里，怎样找到舞台说明？",
          ),
          t("Look for clues in the dialogue itself", "在对白本身中寻找线索"),
          [
            t("Read the reviews of the first performance", "阅读首演的评论"),
            t("Guess, since there is no way to know", "只能猜，因为无从得知"),
            t("Look at the list of costumes", "查看服装清单"),
          ],
          t(
            'The last paragraph says that in older plays you must find the clues in the dialogue, as when "Why do you weep?" shows that another character is crying.',
            '最后一段说，在老剧本中，你必须从对白中找线索，比如 "Why do you weep?" 说明另一个人物在哭。',
          ),
        ),
      ],
    ),
    passage(
      "a-scene-in-the-rain",
      t("A Scene in the Rain", "雨中的一场戏"),
      `The following is a short scene from an original play. Read it as a director would.

A bus shelter at night. Rain. DANIEL, seventeen, sits on the bench with a duffel bag at his feet. His father, MR. REYES, enters, out of breath, holding an umbrella he has not opened.

MR. REYES: Your mother said you'd be here.

DANIEL: (Not looking up.) The bus is late.

MR. REYES: The bus to where?

DANIEL: Does it matter?

(A long pause. MR. REYES sits at the far end of the bench.)

MR. REYES: When I was your age, I left home too. I had a bag just like that one.

DANIEL: And you came back.

MR. REYES: Three days later. I had run out of money and ideas at about the same time.

(DANIEL almost smiles, then stops himself.)

DANIEL: You don't even know why I'm leaving.

MR. REYES: No. I was hoping you'd tell me. (Pause.) I'm better at talking than listening. Your mother says so. She's usually right.

(Headlights sweep across the shelter. The bus approaches. DANIEL stands and picks up the bag. MR. REYES does not move to stop him.)

MR. REYES: If you get on, call her when you arrive. Wherever it is.

(DANIEL looks at the bus. Then at his father. The bus doors open with a hiss. A long moment. DANIEL sits down again, the bag still on his shoulder.)

DANIEL: The bus is late.

MR. REYES: (Opening the umbrella, holding it over both of them.) I've got time.

(The bus pulls away. Lights fade.)

Notice how little either character says directly. Daniel never explains why he is leaving, and his father never asks him to stay. The meaning is in the pauses, the bag that stays on Daniel's shoulder and the umbrella that finally opens. The repetition of the line about the late bus has a different meaning the second time, because now Daniel is choosing not to go.`,
      [clues, theater, drama],
      [
        ask(
          t("Why does Mr. Reyes tell Daniel that he once left home too?", "雷耶斯先生为什么告诉丹尼尔自己也曾离家出走？"),
          t("To connect with his son without ordering him to stay", "为了在不命令儿子留下的情况下与他沟通"),
          [
            t("To boast about his adventures", "为了吹嘘自己的冒险经历"),
            t("To ask Daniel for money", "为了向丹尼尔要钱"),
            t("To make Daniel miss the bus on purpose", "为了故意让丹尼尔错过公交车"),
          ],
          t(
            "Mr. Reyes never asks Daniel to stay; sharing his own story is a way to reach him, and Daniel almost smiles in response.",
            "雷耶斯先生从未要求丹尼尔留下；讲自己的故事是接近儿子的方式，丹尼尔听后差点笑了。",
          ),
        ),
        ask(
          t("What does the opening of the umbrella at the end suggest?", "结尾撑开雨伞暗示了什么？"),
          t("The father is now protecting and staying with his son", "父亲现在正在保护并陪伴儿子"),
          [
            t("The father is about to leave", "父亲正要离开"),
            t("The rain has stopped", "雨已经停了"),
            t("Daniel has decided to get on the bus", "丹尼尔决定上车了"),
          ],
          t(
            "The father holds the umbrella over both of them, a gesture of care and presence that the stage direction shows without any words.",
            "父亲把伞撑在两人头上，这个舞台说明不用任何台词就表现出关怀与陪伴。",
          ),
        ),
        ask(
          t(
            'Why does the line "The bus is late" mean something different the second time?',
            '为什么第二次说 "The bus is late" 时含义不同了？',
          ),
          t("Daniel says it after choosing not to get on the bus", "丹尼尔是在选择不上车之后说的这句话"),
          [
            t("The bus really is later the second time", "第二次公交车真的更晚了"),
            t("A different character says it", "这句话是另一个人物说的"),
            t("Daniel is angry at the driver", "丹尼尔在生司机的气"),
          ],
          t(
            "The last paragraph explains that the repeated line changes meaning because now Daniel is choosing not to go.",
            "最后一段解释说，重复的台词含义变了，因为此时丹尼尔选择了不走。",
          ),
        ),
      ],
      ["Daniel", "Reyes", "DANIEL", "REYES", "MR"],
    ),
  ],
};
