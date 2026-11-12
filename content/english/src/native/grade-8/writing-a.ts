// Grade 8: writing skills checked by rule, part one: summarizing a technical text, quoting a primary source, using
// statistics in a sentence and qualifying a claim.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const technical = topic("writing", {
  id: "summarizing-a-technical-text",
  title: ["Summarizing a Technical Text", "概括技术性文本"],
  summary: [
    "A summary of a technical text keeps the key steps and ideas in plain words, leaves out minor detail and adds nothing the text did not say.",
    "技术性文本的概要用平实的话保留关键步骤和要点，略去次要细节，不添加原文没有的内容。",
  ],
  after: ["keeping-a-summary-objective", "how-a-paragraph-is-built"],
  points: [
    label(
      "does-it-belong-in-the-summary",
      ["Does It Belong in the Summary", "它该不该写进概要"],
      [
        "A technical text, such as a manual or an explanation of a machine, is full of detail. A summary keeps **the key idea or step**: what the machine does and the main stages of how. It drops **minor detail**: exact measurements, part numbers and asides that a reader of the summary does not need. And it never **adds what the text did not say**, such as your guess, your opinion or a fact from elsewhere.",
        "技术性文本，如说明书或对机器的解释，充满了细节。概要保留**关键要点或步骤**：机器做什么，以及怎样做的主要阶段。它略去**次要细节**：概要读者不需要的精确尺寸、零件编号和题外话。它绝不**添加原文没有的内容**，比如你的猜测、你的看法或来自别处的事实。",
      ],
      [
        "A text explains how a steam engine works. Does this sentence belong in a summary of it?",
        "一篇文章解释蒸汽机如何工作。这个句子该写进它的概要吗？",
      ],
      `
        Burning coal heats water in a boiler until it turns to steam.|a key step
        The boiler of the engine described is 2.4 meters long and made of riveted iron plates.|a minor detail
        Steam engines are the most important invention in history.|not in the text
        The steam pushes a piston back and forth inside a cylinder.|a key step
        The piston in the drawing is labeled part 14.|a minor detail
        Steam engines were invented by the ancient Greeks.|not in the text
        A rod connects the piston to a wheel, turning the back-and-forth motion into a turning one.|a key step
        The rod was painted green on the engines at the Leeds works.|a minor detail
        These engines must have been very noisy to work beside.|not in the text
        Used steam is cooled in a condenser and turned back into water.|a key step
        The condenser holds about forty liters of cold water.|a minor detail
        Modern power stations use exactly the same engine.|not in the text
        A computer program is a list of instructions that the processor carries out one by one.|a key step
        The processor in the example runs at 3.2 gigahertz.|a minor detail
        Programming is the best career for young people.|not in the text
        A sewing machine joins two pieces of cloth by locking an upper thread with a lower one.|a key step
        The bobbin holds about twenty meters of thread.|a minor detail
        Sewing by hand is more beautiful than sewing by machine.|not in the text
        A refrigerator keeps food cold by moving heat from inside the box to the air outside.|a key step
        The coils at the back are made of copper tubing 8 millimeters wide.|a minor detail
        Refrigerators save more lives than medicine does.|not in the text
        A bicycle's chain carries the force of the rider's feet from the pedals to the back wheel.|a key step
        The chain in the picture has 112 links.|a minor detail
        Everyone should ride a bicycle to work.|not in the text
        A camera lens bends light so that it forms a sharp image on the sensor.|a key step
        The lens in the diagram has seven glass elements.|a minor detail
        Film cameras take better pictures than digital ones.|not in the text
        A lock opens only when the key lifts each pin to exactly the right height.|a key step
        The lock shown has five brass pins.|a minor detail
        Most burglars cannot pick a lock.|not in the text
      `,
      {
        "a key step": L(
          "关键步骤",
          "The sentence gives a main idea or a main stage of the process, which any summary must keep.",
          "这个句子给出主要观点或过程的主要阶段，任何概要都必须保留。",
          "The sentence is not one of the main ideas or stages of the text.",
          "这个句子不是原文的主要观点或阶段。",
        ),
        "a minor detail": L(
          "次要细节",
          "The sentence gives an exact size, number or label that the text includes but a summary can leave out.",
          "这个句子给出原文中有、但概要可以略去的精确尺寸、数字或标签。",
          "The sentence is not a minor detail from the text.",
          "这个句子不是原文中的次要细节。",
        ),
        "not in the text": L(
          "原文没有",
          "The sentence adds an opinion, a guess or a claim that the text never made, so it does not belong in a summary.",
          "这个句子添加了原文从未提出的看法、猜测或论断，所以不该写进概要。",
          "The sentence does come from the text.",
          "这个句子确实来自原文。",
        ),
      },
    ),
    choose(
      "in-plain-words",
      ["In Plain Words", "用平实的话说"],
      [
        "A summary of a technical text should be clear to a reader who is not an expert. Keep the meaning exact, but put long technical terms into plain words. *The apparatus effects a conversion of thermal energy into mechanical work* becomes *The machine turns heat into motion.* Two mistakes are common: **copying the jargon** of the source, and making it plain but **changing the meaning**.",
        "技术性文本的概要应该让非专业的读者也能看懂。意思要准确，但要把冗长的术语换成平实的话。*The apparatus effects a conversion of thermal energy into mechanical work* 变成 *The machine turns heat into motion.* 常见的错误有两种：**照抄原文的术语**，以及说得平实却**改变了意思**。",
      ],
      ["Which plain-words version keeps the meaning of the technical sentence?", "哪个平实的版本保留了这个技术性句子的意思？"],
      `
        The apparatus effects a conversion of thermal energy into mechanical work.|The machine turns heat into motion.|The apparatus effects a conversion of thermal energy into work.|The machine turns motion into heat.
        Precipitation is collected in a reservoir prior to filtration.|Rain is stored in a lake before it is cleaned.|Precipitation is held in a reservoir prior to filtration.|Rain is cleaned before it falls into a lake.
        The device emits an audible signal upon detection of combustion products.|The alarm beeps when it senses smoke.|The device emits an audible signal upon detecting combustion.|The alarm beeps to put out a fire.
        The vehicle's velocity diminishes as frictional forces act upon it.|The car slows down because of friction.|The vehicle's velocity diminishes owing to friction.|The car speeds up because of friction.
        Illumination is generated when current passes through a filament.|The bulb lights up when electricity runs through a thin wire.|Illumination is produced when current passes through a filament.|The bulb lights up when the wire is heated by a flame.
        The organism obtains nutrition through the absorption of dissolved substances.|The creature feeds by soaking up dissolved food.|The organism obtains nutrition by absorbing dissolved substances.|The creature feeds by hunting other animals.
        Data are transmitted in discrete packets across the network.|Information travels across the network in small separate pieces.|Data are transmitted in discrete packets over the network.|Information travels across the network in one large block.
        The pump elevates water from the subterranean aquifer to the surface.|The pump lifts water up from underground.|The pump elevates water from the aquifer to the surface.|The pump pushes water down underground.
        The compound undergoes decomposition when exposed to elevated temperatures.|The substance breaks down when it gets very hot.|The compound undergoes decomposition at elevated temperatures.|The substance freezes when it gets very cold.
        Rotational motion is transferred from the crankshaft to the wheels.|The turning of one shaft is passed on to the wheels.|Rotational motion is transferred from the crankshaft to the axle.|The wheels turn the crankshaft.
        The patient's respiration rate was monitored at hourly intervals.|The patient's breathing was checked every hour.|The patient's respiration rate was monitored hourly.|The patient's heart was checked every minute.
        The structure's load-bearing capacity is insufficient for the proposed use.|The building is not strong enough for its planned use.|The structure's load-bearing capacity is insufficient for this use.|The building is too strong for its planned use.
        Thermal insulation impedes the transfer of heat through the walls.|Insulation slows heat from passing through the walls.|Thermal insulation impedes the transfer of heat through walls.|Insulation speeds heat through the walls.
        The vessel's hull is subdivided into watertight compartments.|The ship's body is split into sealed rooms that keep out water.|The vessel's hull is divided into watertight compartments.|The ship's body is one big open room.
        Atmospheric moisture condenses upon contact with the cooled surface.|Water from the air forms drops when it touches the cold surface.|Atmospheric moisture condenses on contact with cool surfaces.|The cold surface dries the air completely.
        The mechanism permits rotation in a single direction only.|The part lets it turn only one way.|The mechanism permits rotation in one direction only.|The part lets it turn both ways freely.
        Sound waves are converted into electrical signals by the microphone.|The microphone turns sounds into electric signals.|Sound waves are converted into electrical signals by microphones.|The microphone turns electric signals into sounds.
        Excess voltage is diverted to the ground through the conductor.|Extra electricity is led safely into the earth through the wire.|Excess voltage is diverted to the ground through a conductor.|Extra electricity is stored in the wire.
        The seed remains dormant until environmental conditions become favorable.|The seed stays asleep until the conditions are right.|The seed remains dormant until conditions become favorable.|The seed grows at once, whatever the conditions.
        The lens refracts incoming light to a focal point on the sensor.|The lens bends light to a sharp point on the sensor.|The lens refracts incoming light to a focal point.|The lens blocks light from reaching the sensor.
        Lubricant reduces abrasion between the moving components.|Oil stops the moving parts from wearing each other down.|Lubricant reduces abrasion between moving components.|Oil makes the moving parts grind harder.
        The valve prevents the backflow of fluid into the chamber.|The valve stops liquid from flowing back into the chamber.|The valve prevents fluid backflow into the chamber.|The valve lets liquid flow back into the chamber.
        Solar radiation is absorbed by the panel and converted into electricity.|The panel takes in sunlight and turns it into electricity.|Solar radiation is absorbed by panels and converted into electricity.|The panel turns electricity into sunlight.
        The software periodically creates duplicate copies of stored files.|The program makes backup copies of saved files from time to time.|The software periodically creates duplicates of stored files.|The program deletes old files from time to time.
        Ventilation is achieved through apertures in the upper walls.|Air flows in through openings high in the walls.|Ventilation is achieved through apertures in upper walls.|Air is kept out by sealing the walls.
        The bridge's cables distribute the weight of the deck to the towers.|The cables spread the road's weight to the towers.|The bridge's cables distribute the deck's weight to the towers.|The towers hold up the cables with no weight on them.
        Corrosion of the iron framework was accelerated by saltwater exposure.|Salt water made the iron frame rust faster.|Corrosion of the iron framework was accelerated by salt water.|Salt water kept the iron frame from rusting.
        The thermostat deactivates the heater once the target temperature is reached.|The thermostat turns the heater off when the room is warm enough.|The thermostat deactivates the heater at the target temperature.|The thermostat turns the heater on when the room is warm enough.
        Kinetic energy from the descending water drives the turbine.|The force of falling water spins the turbine.|Kinetic energy from descending water drives the turbine.|The turbine pushes the water back uphill.
        The capsule's heat shield dissipates the energy generated during reentry.|The shield carries away the heat made as the capsule returns to Earth.|The capsule's heat shield dissipates energy generated during reentry.|The shield makes the capsule hotter as it returns.
      `,
      (right) => [
        `*${right}* says the same thing as the technical sentence, in words any reader can follow.`,
        `*${right}* 与技术性句子意思相同，而且用的是任何读者都能看懂的话。`,
      ],
      [
        [
          "*{wrong}* copies the jargon of the source almost word for word, so it is not in plain words.",
          "*{wrong}* 几乎逐字照抄了原文的术语，所以不是平实的话。",
        ],
        [
          "*{wrong}* is plain, but it changes or reverses what the technical sentence says.",
          "*{wrong}* 说得平实，但改变或颠倒了技术性句子的意思。",
        ],
      ],
    ),
  ],
});

const primarySource = topic("writing", {
  id: "quoting-a-primary-source",
  title: ["Quoting a Primary Source", "引用原始资料"],
  summary: [
    "A quotation from a primary source is introduced with its speaker and context, explained after it, and changed only with brackets and ellipses.",
    "引用原始资料时，要先交代说话人和背景，引用后加以解释，改动时只能使用方括号和省略号。",
  ],
  after: ["integrating-quotations", "quoting-accurately", "reading-a-founding-document"],
  points: [
    label(
      "how-is-the-quotation-used",
      ["How Is the Quotation Used", "引语是如何使用的"],
      [
        "A quotation from a primary source, such as a letter, speech or declaration, needs help to do its work. A **well-integrated** quotation is introduced with who said it and when, and then explained: what it shows about the writer's point. A **dropped-in** quotation stands alone, with no introduction, so the reader does not know who is speaking. A quotation **left unexplained** is introduced, but the writer moves on without saying why it matters.",
        "引用信件、演讲或宣言等原始资料时，需要帮助引语发挥作用。**融合得好**的引语会交代是谁、在什么时候说的，然后加以解释：它对作者的观点说明了什么。**突兀插入**的引语孤零零地放着，没有引入，读者不知道是谁在说话。**未加解释**的引语有引入，但作者没有说明它为什么重要就转向了别的话题。",
      ],
      ["How is the quotation used in this passage?", "这段文字中的引语是如何使用的？"],
      `
        In 1776, Thomas Paine wrote, "These are the times that try men's souls." With these words, he admitted the war was going badly while urging Americans not to give up.|well integrated
        "These are the times that try men's souls." The war was going badly that winter.|dropped in
        In 1776, Thomas Paine wrote, "These are the times that try men's souls." The next battle took place at Trenton.|left unexplained
        In a 1776 letter, Abigail Adams asked her husband to "remember the ladies." She was pressing him to protect women's rights in the new nation's laws.|well integrated
        "Remember the ladies." Women had few rights at the time.|dropped in
        In a 1776 letter, Abigail Adams asked her husband to "remember the ladies." John Adams was then in Philadelphia.|left unexplained
        Frederick Douglass asked in 1852, "What, to the American slave, is your Fourth of July?" His question forced his audience to see that the holiday's freedom was not shared by all.|well integrated
        "What, to the American slave, is your Fourth of July?" Many people celebrated the holiday.|dropped in
        Frederick Douglass asked in 1852, "What, to the American slave, is your Fourth of July?" The speech was given in Rochester, New York.|left unexplained
        The Declaration of the Rights of Man states that "men are born and remain free and equal in rights." This idea challenged the power of the French nobles, who claimed rights by birth.|well integrated
        "Men are born and remain free and equal in rights." The revolution began in 1789.|dropped in
        The Declaration of the Rights of Man states that "men are born and remain free and equal in rights." It has seventeen articles.|left unexplained
        Patrick Henry ended his 1775 speech with "Give me liberty, or give me death!" The cry showed how far some colonists were willing to go.|well integrated
        "Give me liberty, or give me death!" The colonists were angry about taxes.|dropped in
        Patrick Henry ended his 1775 speech with "Give me liberty, or give me death!" The speech was given in a church.|left unexplained
        Toussaint Louverture told his followers in 1793, "I want liberty and equality to reign." He was framing the revolt in Haiti as part of the same struggle as the French Revolution.|well integrated
        "I want liberty and equality to reign." The revolt began in 1791.|dropped in
        Toussaint Louverture told his followers in 1793, "I want liberty and equality to reign." He had once been enslaved.|left unexplained
        Sojourner Truth asked in 1851, "Ain't I a woman?" With this question she challenged those who thought women and Black people were weak.|well integrated
        "Ain't I a woman?" There was a convention in Ohio.|dropped in
        Sojourner Truth asked in 1851, "Ain't I a woman?" She was over fifty years old.|left unexplained
        Simón Bolívar wrote in 1815 that "the bonds that united us to Spain have been severed." He meant that the colonies could no longer go back to Spanish rule.|well integrated
        "The bonds that united us to Spain have been severed." South America was ruled by Spain.|dropped in
        Simón Bolívar wrote in 1815 that "the bonds that united us to Spain have been severed." He wrote the letter in Jamaica.|left unexplained
        In his first speech as president, Lincoln said, "We are not enemies, but friends." He was pleading with the Southern states not to leave the Union.|well integrated
        "We are not enemies, but friends." The country was divided.|dropped in
        In his first speech as president, Lincoln said, "We are not enemies, but friends." It was March 1861.|left unexplained
        A mill girl wrote in 1845 that the bell "calls us to our labor" before dawn. Her words show how the factory clock ruled the workers' days.|well integrated
        "The bell calls us to our labor." Mill girls worked in Lowell.|dropped in
        A mill girl wrote in 1845 that the bell "calls us to our labor" before dawn. Lowell had many mills.|left unexplained
      `,
      {
        "well integrated": L(
          "融合得好",
          "The quotation is introduced with its speaker and context, and then explained, so the reader sees why it matters.",
          "引语交代了说话人和背景，随后又加以解释，所以读者明白它为什么重要。",
          "The quotation is missing its introduction or its explanation.",
          "这条引语缺少引入或解释。",
        ),
        "dropped in": L(
          "突兀插入",
          "The quotation stands alone with no speaker or context, so the reader does not know whose words they are.",
          "引语孤零零地放着，没有说话人或背景，读者不知道是谁的话。",
          "The quotation is introduced with its speaker.",
          "这条引语交代了说话人。",
        ),
        "left unexplained": L(
          "未加解释",
          "The quotation is introduced, but the next sentence moves on to a side fact instead of saying what the words show.",
          "引语有引入，但下一句转向了无关的事实，没有说明这些话说明了什么。",
          "The quotation is either explained or not introduced at all.",
          "这条引语要么得到了解释，要么根本没有引入。",
        ),
      },
    ),
    choose(
      "changing-a-quotation-fairly",
      ["Changing a Quotation Fairly", "合理地改动引语"],
      [
        'Sometimes a quotation needs a small change to fit your sentence or to make it clear. Put any word you add or change in **square brackets**: *Paine wrote that "[these] are the times that try men\'s souls."* Use brackets to explain a pronoun too: *"They [the British] have cut off our trade."* Do not change words without brackets, and do not use parentheses, which make the added words look like the original writer\'s.',
        '有时引语需要稍作改动，才能融入你的句子或变得清楚。你添加或改动的词要放在**方括号**里：*Paine wrote that "[these] are the times that try men\'s souls."* 也可以用方括号解释代词：*"They [the British] have cut off our trade."* 不要不加方括号就改词，也不要用圆括号，因为圆括号会让添加的词看起来像原作者的话。',
      ],
      ["Which correctly changes or explains the quotation?", "哪个选项正确地改动或解释了引语？"],
      `
        Original: "He has cut off our trade." (He is King George.)|"[King George] has cut off our trade."|"King George has cut off our trade."|"(King George) has cut off our trade."
        Original: "They have taxed us without our consent." (They are the British Parliament.)|"They [the British Parliament] have taxed us without our consent."|"The British Parliament have taxed us without our consent."|"They (the British Parliament) have taxed us without our consent."
        Original: "We hold these truths to be self-evident." (to fit: Jefferson wrote that the colonists...)|Jefferson wrote that the colonists "[held] these truths to be self-evident."|Jefferson wrote that the colonists "held these truths to be self-evident."|Jefferson wrote that the colonists "(held) these truths to be self-evident."
        Original: "It will be our ruin." (It is the new tax.)|"It [the new tax] will be our ruin."|"The new tax will be our ruin."|"It (the new tax) will be our ruin."
        Original: "She works fourteen hours a day." (She is a mill girl.)|"She [a mill girl] works fourteen hours a day."|"A mill girl works fourteen hours a day."|"She (a mill girl) works fourteen hours a day."
        Original: "I shall return." (to fit: He promised that he...)|He promised that he "[would] return."|He promised that he "would return."|He promised that he "(would) return."
        Original: "This city is a furnace." (This city is Manchester.)|"This city [Manchester] is a furnace."|"Manchester is a furnace."|"This city (Manchester) is a furnace."
        Original: "Our men fought bravely." (Our men are the colonial militia.)|"Our men [the colonial militia] fought bravely."|"The colonial militia fought bravely."|"Our men (the colonial militia) fought bravely."
        Original: "He freed us." (He is Toussaint Louverture.)|"He [Toussaint Louverture] freed us."|"Toussaint Louverture freed us."|"He (Toussaint Louverture) freed us."
        Original: "We are starving." (to fit: The workers said that they...)|The workers said that they "[were] starving."|The workers said that they "were starving."|The workers said that they "(were) starving."
        Original: "These machines will be the death of us." (These machines are power looms.)|"These machines [power looms] will be the death of us."|"Power looms will be the death of us."|"These machines (power looms) will be the death of us."
        Original: "It was signed in haste." (It is the treaty.)|"It [the treaty] was signed in haste."|"The treaty was signed in haste."|"It (the treaty) was signed in haste."
        Original: "They marched through the night." (They are the rebels.)|"They [the rebels] marched through the night."|"The rebels marched through the night."|"They (the rebels) marched through the night."
        Original: "I have a dream." (to fit: King told the crowd that he...)|King told the crowd that he "[had] a dream."|King told the crowd that he "had a dream."|King told the crowd that he "(had) a dream."
        Original: "Here the air is black." (Here is the mining town.)|"Here [in the mining town] the air is black."|"In the mining town the air is black."|"Here (in the mining town) the air is black."
        Original: "His words set us on fire." (He is Patrick Henry.)|"His [Patrick Henry's] words set us on fire."|"Patrick Henry's words set us on fire."|"His (Patrick Henry's) words set us on fire."
        Original: "We demand the vote." (to fit: The women declared that they...)|The women declared that they "[demanded] the vote."|The women declared that they "demanded the vote."|The women declared that they "(demanded) the vote."
        Original: "It changed everything." (It is the railway.)|"It [the railway] changed everything."|"The railway changed everything."|"It (the railway) changed everything."
        Original: "They will not be slaves." (They are the people of Haiti.)|"They [the people of Haiti] will not be slaves."|"The people of Haiti will not be slaves."|"They (the people of Haiti) will not be slaves."
        Original: "She gave her life for the cause." (She is the nurse.)|"She [the nurse] gave her life for the cause."|"The nurse gave her life for the cause."|"She (the nurse) gave her life for the cause."
        Original: "We are a free people." (to fit: The colonists claimed that they...)|The colonists claimed that they "[were] a free people."|The colonists claimed that they "were a free people."|The colonists claimed that they "(were) a free people."
        Original: "This law is a chain upon us." (This law is the Stamp Act.)|"This law [the Stamp Act] is a chain upon us."|"The Stamp Act is a chain upon us."|"This law (the Stamp Act) is a chain upon us."
        Original: "He betrayed us all." (He is Benedict Arnold.)|"He [Benedict Arnold] betrayed us all."|"Benedict Arnold betrayed us all."|"He (Benedict Arnold) betrayed us all."
        Original: "They burned the mills." (They are the Luddites.)|"They [the Luddites] burned the mills."|"The Luddites burned the mills."|"They (the Luddites) burned the mills."
        Original: "We will not go back." (to fit: The marchers swore that they...)|The marchers swore that they "[would] not go back."|The marchers swore that they "would not go back."|The marchers swore that they "(would) not go back."
        Original: "There the children work all night." (There is the glass factory.)|"There [in the glass factory] the children work all night."|"In the glass factory the children work all night."|"There (in the glass factory) the children work all night."
        Original: "It is a bargain for the rich." (It is the corn law.)|"It [the corn law] is a bargain for the rich."|"The corn law is a bargain for the rich."|"It (the corn law) is a bargain for the rich."
        Original: "She wrote it in one night." (She is Mary Shelley.)|"She [Mary Shelley] wrote it in one night."|"Mary Shelley wrote it in one night."|"She (Mary Shelley) wrote it in one night."
        Original: "We have no voice." (to fit: The workers complained that they...)|The workers complained that they "[had] no voice."|The workers complained that they "had no voice."|The workers complained that they "(had) no voice."
        Original: "He alone can save us." (He is General Washington.)|"He [General Washington] alone can save us."|"General Washington alone can save us."|"He (General Washington) alone can save us."
      `,
      (right) => [
        `${right} The added or changed words are in square brackets, so the reader can tell them from the original.`,
        `${right} 添加或改动的词放在方括号里，读者能把它们和原文区分开。`,
      ],
      [
        [
          "*{wrong}* changes the original words inside the quotation marks without brackets, so it misquotes the source.",
          "*{wrong}* 不加方括号就改动了引号内的原话，等于错误引用了原文。",
        ],
        [
          "*{wrong}* uses parentheses, which make the added words look like part of the original.",
          "*{wrong}* 用了圆括号，让添加的词看起来像是原文的一部分。",
        ],
      ],
    ),
  ],
});

const statistics = topic("writing", {
  id: "using-statistics-in-a-sentence",
  title: ["Using Statistics in a Sentence", "在句子中使用统计数据"],
  summary: [
    "A statistic in a sentence needs its source and its context, and its wording must match the numbers: doubled, halved, a third.",
    "句子中的统计数据需要注明出处和背景，措辞也必须与数字相符：翻倍、减半、三分之一。",
  ],
  after: ["reporting-numbers-from-a-graph", "evidence"],
  points: [
    label(
      "does-the-number-do-its-job",
      ["Does the Number Do Its Job", "数字是否发挥了作用"],
      [
        "A number convinces only when the reader knows where it came from and what it means. A **clear and sourced** statistic names its source and gives context, a year, a comparison or a total: *According to the 1851 census, half of Britain's people lived in towns, up from a fifth in 1800.* A statistic with **no source** asks the reader to take it on trust. A statistic with **no context** gives a bare number the reader cannot judge: is 30,000 a lot?",
        "数字只有在读者知道它从哪里来、意味着什么时才有说服力。**清楚并注明出处**的统计数据会说明来源并给出背景，即年份、对比或总数：*According to the 1851 census, half of Britain's people lived in towns, up from a fifth in 1800.* **没有出处**的统计数据要求读者凭信任接受。**没有背景**的统计数据只给出一个光秃秃的数字，读者无法判断：三万算多吗？",
      ],
      ["How well does this sentence use its statistic?", "这个句子对统计数据的使用如何？"],
      `
        According to the 1851 census, half of Britain's people lived in towns, up from a fifth in 1800.|clear and sourced
        Half of Britain's people lived in towns, up from a fifth in 1800.|no source given
        According to the 1851 census, 10 million people lived in British towns.|no context
        A government report of 1833 found that a third of mill workers were under eighteen.|clear and sourced
        A third of mill workers were under eighteen in 1833.|no source given
        A government report of 1833 counted 56,000 young mill workers.|no context
        Railway company records show that track grew from 100 miles in 1830 to 6,000 by 1850.|clear and sourced
        Track grew from 100 miles in 1830 to 6,000 by 1850.|no source given
        Railway company records list 6,000 miles of track.|no context
        Chadwick's 1842 report found that laborers in Liverpool died at an average age of fifteen, compared with thirty-five for gentlemen.|clear and sourced
        Laborers in Liverpool died at an average age of fifteen, compared with thirty-five for gentlemen.|no source given
        Chadwick's 1842 report gave an average age of death of fifteen.|no context
        Mine inspectors recorded about 1,000 deaths a year in British mines in the 1850s, out of some 220,000 miners.|clear and sourced
        About 1,000 miners died each year in the 1850s, out of some 220,000.|no source given
        Mine inspectors recorded about 1,000 deaths.|no context
        The 1901 census shows that London had 6.5 million people, more than any city in the world.|clear and sourced
        London had 6.5 million people in 1901, more than any city in the world.|no source given
        The 1901 census counted 6.5 million people.|no context
        According to the Board of Trade, cotton made up nearly half of Britain's exports in 1830.|clear and sourced
        Cotton made up nearly half of Britain's exports in 1830.|no source given
        According to the Board of Trade, cotton exports were worth £19 million.|no context
        A 1904 survey by Seebohm Rowntree found that over a quarter of York's people lived in poverty.|clear and sourced
        Over a quarter of York's people lived in poverty in 1904.|no source given
        A 1904 survey by Seebohm Rowntree counted 20,000 poor people.|no context
        Factory records show that the mill's workforce fell from 800 to 300 after the power looms arrived.|clear and sourced
        The mill's workforce fell from 800 to 300 after the power looms arrived.|no source given
        Factory records show 300 workers at the mill.|no context
        According to the city's health office, deaths from cholera fell by nine tenths after the new sewers opened.|clear and sourced
        Deaths from cholera fell by nine tenths after the new sewers opened.|no source given
        According to the city's health office, 400 people died of cholera.|no context
      `,
      {
        "clear and sourced": L(
          "清楚并注明出处",
          "The sentence names where the number came from and gives a comparison, a total or a change, so the reader can judge it.",
          "这个句子说明了数字的来源，并给出对比、总数或变化，读者能做出判断。",
          "The sentence lacks a source or the context needed to judge the number.",
          "这个句子缺少出处或判断数字所需的背景。",
        ),
        "no source given": L(
          "没有出处",
          "The number has context, but the sentence does not say where it came from, so the reader must take it on trust.",
          "数字有背景，但句子没有说明来源，读者只能凭信任接受。",
          "The sentence does name its source.",
          "这个句子注明了出处。",
        ),
        "no context": L(
          "没有背景",
          "The source is named, but the number stands bare, with no total, comparison or change to show what it means.",
          "注明了出处，但数字是孤立的，没有总数、对比或变化来说明它的意义。",
          "The number is given with a comparison, a total or a change.",
          "这个数字有对比、总数或变化作为背景。",
        ),
      },
    ),
    choose(
      "words-that-match-the-numbers",
      ["Words That Match the Numbers", "与数字相符的措辞"],
      [
        "When you put numbers into words, the words must match. From 100 to 200 has **doubled**; from 100 to 50 has **halved** or **fallen by half**; 25 out of 100 is **a quarter**; from 100 to 400 has **quadrupled** or grown **fourfold**. Check the arithmetic before you write: a writer who says *tripled* for a rise from 30 to 60 loses the reader's trust.",
        "把数字变成文字时，措辞必须相符。从 100 到 200 是**翻倍**（doubled）；从 100 到 50 是**减半**（halved 或 fallen by half）；100 中的 25 是**四分之一**（a quarter）；从 100 到 400 是**变为四倍**（quadrupled 或 fourfold）。写之前要核对算术：把从 30 到 60 的增长说成 *tripled* 的作者，会失去读者的信任。",
      ],
      ["Which sentence describes the numbers accurately?", "哪个句子准确地描述了这些数字？"],
      `
        Wages: 10 shillings a week in 1800, 5 shillings in 1830.|Wages halved between 1800 and 1830.|Wages fell by a tenth between 1800 and 1830.|Wages doubled between 1800 and 1830.
        Factories in the town: 20 in 1820, 40 in 1840.|The number of factories doubled.|The number of factories tripled.|The number of factories fell by half.
        Workers under 18: 300 of 900 workers.|A third of the workers were under 18.|Half of the workers were under 18.|Three quarters of the workers were under 18.
        Coal output: 10 million tonnes in 1800, 40 million in 1840.|Coal output quadrupled.|Coal output doubled.|Coal output fell to a quarter.
        Deaths from fever: 600 in 1840, 200 in 1860.|Deaths from fever fell to a third.|Deaths from fever fell by a third.|Deaths from fever tripled.
        Children in school: 25 of 100 children.|A quarter of the children were in school.|Most of the children were in school.|Four in ten children were in school.
        Cost of a cotton shirt: 20 pence in 1790, 5 pence in 1830.|The price fell to a quarter of what it had been.|The price fell by a quarter.|The price rose fourfold.
        Town population: 5,000 in 1801, 50,000 in 1851.|The population grew tenfold.|The population doubled.|The population grew by a tenth.
        Hours worked per day: 14 in 1830, 10 in 1850.|The working day was cut by four hours.|The working day was cut in half.|The working day grew by four hours.
        Miners injured: 50 of 200 miners.|A quarter of the miners were injured.|Half of the miners were injured.|A fifth of the miners were injured.
        Railway passengers: 5 million in 1840, 15 million in 1845.|The number of passengers tripled.|The number of passengers doubled.|The number of passengers fell by two thirds.
        Price of a train ticket: 12 shillings in 1840, 6 shillings in 1850.|The ticket price halved.|The ticket price fell by a sixth.|The ticket price doubled.
        Women in the mill: 450 of 600 workers.|Three quarters of the mill's workers were women.|A third of the mill's workers were women.|Nearly all the mill's workers were women.
        Steam engines in the county: 30 in 1800, 90 in 1820.|The number of steam engines tripled.|The number of steam engines rose by thirty.|The number of steam engines halved.
        Gas lamps on the street: 200 in 1820, 1,000 in 1840.|The number of gas lamps grew fivefold.|The number of gas lamps doubled.|The number of gas lamps grew by a fifth.
        Infant deaths: 200 per 1,000 births in 1850, 100 per 1,000 in 1900.|Infant deaths fell by half.|Infant deaths fell by a tenth.|Infant deaths doubled.
        Union members: 100,000 in 1870, 1 million in 1890.|Union membership grew tenfold.|Union membership doubled.|Union membership grew by a tenth.
        Houses with running water: 1 in 10 in 1850.|A tenth of houses had running water.|Most houses had running water.|A third of houses had running water.
        Cotton imports: 50 million pounds in 1800, 500 million in 1840.|Cotton imports grew tenfold.|Cotton imports grew by half.|Cotton imports fell to a tenth.
        Child workers in the mill: 400 in 1830, 100 in 1850.|The number of child workers fell to a quarter.|The number of child workers fell by a quarter.|The number of child workers quadrupled.
        Bread price: 8 pence in 1810, 12 pence in 1812.|The price of bread rose by half.|The price of bread doubled.|The price of bread fell by a third.
        Letters posted: 80 million in 1839, 160 million in 1840.|The number of letters posted doubled in a year.|The number of letters posted rose by a tenth.|The number of letters posted halved in a year.
        Workers who could read: 60 of 120.|Half the workers could read.|A third of the workers could read.|Nearly all the workers could read.
        Iron output: 250,000 tonnes in 1800, 750,000 in 1820.|Iron output tripled.|Iron output doubled.|Iron output rose by a third.
        Accidents at the works: 60 in 1880, 15 in 1900.|Accidents fell to a quarter of their earlier number.|Accidents fell by fifteen.|Accidents quadrupled.
        Weekly rent: 2 shillings in 1840, 3 shillings in 1860.|Rent rose by half.|Rent rose threefold.|Rent fell by a third.
        Cholera deaths in the city: 1,000 in 1849, 100 in 1866.|Cholera deaths fell to a tenth.|Cholera deaths fell by a tenth.|Cholera deaths grew tenfold.
        Children working in mines: 1 in 5 miners.|A fifth of the miners were children.|Half of the miners were children.|A twentieth of the miners were children.
        Spinning speed: one thread by hand, eighty threads with the mule.|The spinning mule made eighty times as much thread.|The spinning mule made eight times as much thread.|The spinning mule made half as much thread.
        Travel time London to Edinburgh: 10 days by coach in 1750, 10 hours by train in 1850.|The journey became about twenty-four times faster.|The journey became twice as fast.|The journey became ten times slower.
      `,
      (right) => [`*${right}* matches the arithmetic of the numbers given.`, `*${right}* 与所给数字的算术相符。`],
      [
        ["*{wrong}* gets the size of the change wrong, saying too much or too little.", "*{wrong}* 把变化的幅度说错了，说多了或说少了。"],
        [
          "*{wrong}* gets the direction or the share wrong, saying a rise was a fall or the reverse.",
          "*{wrong}* 把方向或比例说错了，把增长说成下降，或反过来。",
        ],
      ],
    ),
  ],
});

const qualifying = topic("writing", {
  id: "qualifying-a-claim",
  title: ["Qualifying a Claim", "限定论断"],
  summary: [
    "A qualified claim says no more than the evidence supports, using words like most, often or in these studies, without hedging so much it says nothing.",
    "限定过的论断不超出证据所支持的范围，使用 most、often 或 in these studies 等词，但又不过分含糊以致言之无物。",
  ],
  after: ["claims", "evaluating-a-scientific-argument"],
  points: [
    label(
      "how-strong-is-the-claim",
      ["How Strong Is the Claim", "论断有多强"],
      [
        "Scientists and careful writers fit the strength of a claim to the evidence. A **well-qualified** claim says exactly as much as the evidence shows, with words like *most*, *often*, *in this study* or *suggests*. A claim that is **too absolute** uses *all*, *always*, *never* or *proves* when the evidence covers only some cases. A claim that is **hedged into nothing** piles up so many *maybes* that it says nothing a reader can use.",
        "科学家和严谨的作者让论断的强度与证据相符。**限定得当**的论断说的恰好与证据显示的一样多，使用 *most*、*often*、*in this study* 或 *suggests* 等词。**过于绝对**的论断在证据只涉及部分情况时使用 *all*、*always*、*never* 或 *proves*。**含糊到言之无物**的论断堆砌了太多 *maybe*，说不出任何读者可用的东西。",
      ],
      ["Evidence is given first. How well does the claim fit it?", "先给出证据。论断与证据的契合程度如何？"],
      `
        Evidence: In a ten-year study of one island, finches with deeper beaks survived droughts more often. Claim: On this island, deeper beaks helped finches survive droughts.|well qualified
        Evidence: In a ten-year study of one island, finches with deeper beaks survived droughts more often. Claim: Deeper beaks always help every bird survive.|too absolute
        Evidence: In a ten-year study of one island, finches with deeper beaks survived droughts more often. Claim: Beaks might possibly have some kind of effect, perhaps, in some way.|hedged into nothing
        Evidence: Most fossils of early whales show back legs that shrank over time. Claim: The fossils suggest that whales descended from land animals.|well qualified
        Evidence: Most fossils of early whales show back legs that shrank over time. Claim: The fossils prove beyond any doubt everything about whale history.|too absolute
        Evidence: Most fossils of early whales show back legs that shrank over time. Claim: Whales may or may not perhaps be related to something.|hedged into nothing
        Evidence: Dark moths outnumbered pale ones in most sooty forests studied. Claim: In polluted forests, dark moths usually survived better.|well qualified
        Evidence: Dark moths outnumbered pale ones in most sooty forests studied. Claim: Dark moths survive better everywhere.|too absolute
        Evidence: Dark moths outnumbered pale ones in most sooty forests studied. Claim: Color could conceivably matter somewhat, possibly.|hedged into nothing
        Evidence: Bacteria in many hospitals became resistant to a common antibiotic within five years. Claim: Heavy use of an antibiotic can lead bacteria to resist it.|well qualified
        Evidence: Bacteria in many hospitals became resistant to a common antibiotic within five years. Claim: Antibiotics never work for long.|too absolute
        Evidence: Bacteria in many hospitals became resistant to a common antibiotic within five years. Claim: Something may perhaps sometimes happen to bacteria.|hedged into nothing
        Evidence: Cave fish in three caves had smaller eyes than river fish of the same kind. Claim: In these caves, the fish had evolved smaller eyes.|well qualified
        Evidence: Cave fish in three caves had smaller eyes than river fish of the same kind. Claim: All animals in the dark lose their eyes.|too absolute
        Evidence: Cave fish in three caves had smaller eyes than river fish of the same kind. Claim: Eyes are possibly maybe different, in a sense.|hedged into nothing
        Evidence: In most of the 40 lakes studied, stickleback fish lost their armor plates after moving from the sea. Claim: Sticklebacks that move to lakes often lose their armor.|well qualified
        Evidence: In most of the 40 lakes studied, stickleback fish lost their armor plates after moving from the sea. Claim: Every fish that enters fresh water loses its armor.|too absolute
        Evidence: In most of the 40 lakes studied, stickleback fish lost their armor plates after moving from the sea. Claim: Armor might be a thing that could change, perhaps.|hedged into nothing
        Evidence: DNA from 200 dog breeds closely matched DNA from gray wolves. Claim: The evidence strongly suggests that dogs descend from wolves.|well qualified
        Evidence: DNA from 200 dog breeds closely matched DNA from gray wolves. Claim: Every animal with four legs comes from wolves.|too absolute
        Evidence: DNA from 200 dog breeds closely matched DNA from gray wolves. Claim: Dogs and wolves could perhaps have some connection, maybe.|hedged into nothing
        Evidence: Lizards on two windy islands grew shorter legs over a few generations. Claim: On these islands, wind seems to have favored shorter legs.|well qualified
        Evidence: Lizards on two windy islands grew shorter legs over a few generations. Claim: Wind always shortens the legs of all animals.|too absolute
        Evidence: Lizards on two windy islands grew shorter legs over a few generations. Claim: Legs may be affected by something, possibly, at some point.|hedged into nothing
        Evidence: Most species on the Galapagos are found nowhere else on Earth. Claim: The islands' isolation likely helped many new species form.|well qualified
        Evidence: Most species on the Galapagos are found nowhere else on Earth. Claim: Islands always create new species.|too absolute
        Evidence: Most species on the Galapagos are found nowhere else on Earth. Claim: Islands might perhaps have some role in something.|hedged into nothing
        Evidence: Rabbits in snowy regions mostly had whiter fur than rabbits in deserts. Claim: Fur color in rabbits tends to match their surroundings.|well qualified
        Evidence: Rabbits in snowy regions mostly had whiter fur than rabbits in deserts. Claim: Every animal's color always matches its home.|too absolute
        Evidence: Rabbits in snowy regions mostly had whiter fur than rabbits in deserts. Claim: Fur could be one color or another, maybe, perhaps.|hedged into nothing
      `,
      {
        "well qualified": L(
          "限定得当",
          "The claim says exactly as much as the evidence shows, limited to the cases studied with words like *usually*, *often* or *suggests*.",
          "这个论断说的恰好与证据显示的一样多，用 *usually*、*often* 或 *suggests* 等词限定在研究的范围内。",
          "The claim says more or less than the evidence supports.",
          "这个论断说得比证据支持的多或少。",
        ),
        "too absolute": L(
          "过于绝对",
          "The claim uses *all*, *always*, *every* or *proves* and stretches far beyond the cases the evidence covers.",
          "这个论断使用 *all*、*always*、*every* 或 *proves*，远远超出了证据涉及的范围。",
          "The claim does not overstate the evidence.",
          "这个论断没有夸大证据。",
        ),
        "hedged into nothing": L(
          "含糊到言之无物",
          "The claim stacks *maybe*, *perhaps* and *possibly* until it says nothing definite, though the evidence supports a clear claim.",
          "这个论断堆砌 *maybe*、*perhaps* 和 *possibly*，直到什么确定的意思都没有，尽管证据支持一个明确的论断。",
          "The claim does say something definite.",
          "这个论断确实说出了确定的意思。",
        ),
      },
    ),
    choose(
      "fitting-the-claim-to-the-evidence",
      ["Fitting the Claim to the Evidence", "让论断与证据相符"],
      [
        "To qualify a claim, change the words that set its reach. Replace *all* with *most* or *many* when the evidence shows most; replace *always* with *often* or *usually*; replace *proves* with *suggests* or *shows* when one study is all you have; and limit the claim to *these islands* or *this study* when that is all that was studied. Do not overcorrect into a claim so weak it says nothing.",
        "要限定论断，就改动决定其范围的词。证据显示的是大多数时，用 *most* 或 *many* 代替 *all*；用 *often* 或 *usually* 代替 *always*；只有一项研究时，用 *suggests* 或 *shows* 代替 *proves*；如果只研究了 *these islands* 或 *this study*，就把论断限定在这个范围内。不要矫枉过正，变成一个弱到言之无物的论断。",
      ],
      ["Which revision best fits the claim to the evidence?", "哪个修改最能让论断与证据相符？"],
      `
        Evidence: 8 of 10 islands studied. Claim: All islands have unique species.|Most islands studied have unique species.|Every island on Earth has unique species.|Some islands could perhaps have some species.
        Evidence: one study of 50 mice. Claim: This diet proves mice live longer.|In one study, mice on this diet lived longer.|This diet proves that all animals live longer.|This diet might maybe do something to mice.
        Evidence: most moths in sooty forests were dark. Claim: Dark moths always survive.|In sooty forests, dark moths usually survived better.|Dark moths survive better in every forest, without a single exception.|Moths may possibly have colors.
        Evidence: 3 caves studied. Claim: Cave fish never have eyes.|In the three caves studied, the fish had smaller eyes.|No fish anywhere has eyes in caves.|Fish might have eyes, or might not.
        Evidence: many but not all bacteria resisted the drug. Claim: The drug never works.|The drug failed against many strains of the bacteria.|The drug fails against every germ that exists, and this will always be true.|The drug may or may not perhaps work.
        Evidence: fossils from 12 sites. Claim: Fossils prove birds came from dinosaurs.|Fossils from twelve sites suggest that birds came from dinosaurs.|Fossils prove that every bird is a dinosaur.|Birds and dinosaurs might be something.
        Evidence: 7 of 10 lizard groups grew shorter legs. Claim: Lizards always grow shorter legs on windy islands.|Most lizard groups on windy islands grew shorter legs.|All lizards everywhere grow shorter legs, as every scientist now agrees.|Lizard legs could maybe change.
        Evidence: one survey of 300 farmers. Claim: Every farmer prefers the new seed.|In one survey, most farmers preferred the new seed.|Every farmer in the world prefers the new seed.|Some farmers might perhaps like seeds.
        Evidence: most of the 40 lakes. Claim: Sticklebacks always lose their armor in lakes.|In most lakes studied, sticklebacks lost their armor.|Every fish loses its armor in every lake, in every place and at every time.|Armor may possibly be lost, maybe.
        Evidence: one experiment. Claim: Music proves to make plants grow.|In one experiment, plants played music grew taller.|Music makes every plant on Earth grow.|Music might do something to plants.
        Evidence: DNA of 200 breeds. Claim: It is a certain fact that all dogs come from wolves.|DNA from 200 breeds strongly suggests that dogs come from wolves.|DNA proves that every animal comes from wolves, without a single exception.|Dogs could perhaps be related to something.
        Evidence: most rabbits in snowy areas. Claim: Rabbits in snow are always white.|Rabbits in snowy areas are mostly white.|Every animal in the snow is white.|Rabbits may be some color, possibly.
        Evidence: 2 islands over 5 years. Claim: Finches always change beak size quickly.|On two islands, finch beaks changed size within five years.|All birds change beak size every year, and this will always be true.|Beaks might change, or might not.
        Evidence: a study of one river. Claim: Pollution kills all fish.|In one river, pollution was linked to fewer fish.|Pollution kills every living thing.|Fish might perhaps be affected somehow.
        Evidence: 60 percent of patients improved. Claim: The treatment cures everyone.|The treatment helped most of the patients in the study.|The treatment cures every disease, as every scientist now agrees.|The treatment may possibly do something.
        Evidence: one season of observation. Claim: These birds never migrate.|In the season observed, these birds did not migrate.|No birds ever migrate anywhere.|These birds might perhaps move around.
        Evidence: most species on the islands. Claim: Isolation always creates new species.|Isolation probably helped create many of the islands' species.|Isolation creates new species everywhere, every time, without a single exception.|Isolation could maybe matter, perhaps.
        Evidence: a few observations. Claim: This snake is always deadly.|In the few cases observed, this snake's bite was dangerous.|Every snake is deadly.|Snakes could perhaps bite, maybe.
        Evidence: nine out of ten trials. Claim: The bridge design never fails.|The bridge design held in nine of ten trials.|No bridge of any design ever fails, without a single exception.|The bridge might perhaps hold, or not.
        Evidence: one class of 30 students. Claim: All students learn better with music.|In one class, students who studied with music scored higher.|Every person in the world learns better with music.|Music might affect learning, perhaps.
        Evidence: many fossil layers. Claim: Fossils prove the exact age of Earth.|Fossil layers suggest that Earth is very old.|Fossils prove every fact about the past, and this will always be true.|Earth might perhaps be some age.
        Evidence: 80 percent of hospitals. Claim: Hand washing stops all infections.|In most hospitals studied, hand washing reduced infections.|Hand washing stops every disease forever.|Washing might do something, maybe.
        Evidence: a study of one forest. Claim: Wolves always help forests grow.|In one forest, the return of wolves helped trees grow back.|Wolves make every forest on Earth grow, as every scientist now agrees.|Wolves could perhaps matter, possibly.
        Evidence: most of the frogs tested. Claim: The chemical deforms every frog.|The chemical deformed most of the frogs tested.|The chemical deforms every animal.|Frogs might be affected in some way.
        Evidence: 5 years of records. Claim: Glaciers always shrink.|Over five years, the glacier shrank each year.|Every glacier in history has always shrunk, in every place and at every time.|Glaciers may perhaps change.
        Evidence: one ancient skull. Claim: This skull proves where all humans came from.|This skull suggests where some early humans lived.|This skull proves every fact about human history.|Skulls might be from somewhere.
        Evidence: two thirds of the seeds sprouted. Claim: These seeds always sprout.|About two thirds of these seeds sprouted.|Every seed on Earth sprouts, without a single exception.|Seeds might perhaps sprout, maybe.
        Evidence: a single drought. Claim: Droughts always change beaks.|During one drought, beak sizes changed.|Every drought changes every bird.|Droughts might maybe do things.
        Evidence: most whales tracked. Claim: Whales always swim the same route.|Most of the whales tracked swam a similar route.|Every sea animal swims the same route, and this will always be true.|Whales could swim somewhere, perhaps.
        Evidence: one year of data. Claim: The new law has ended crime.|In its first year, the new law was followed by less crime.|The new law has ended every crime in the world.|The law might possibly do something.
      `,
      (right) => [
        `*${right}* claims exactly as much as the evidence supports, no more and no less.`,
        `*${right}* 的论断恰好与证据支持的程度相当，不多也不少。`,
      ],
      [
        ["*{wrong}* stretches the claim even further than the evidence allows.", "*{wrong}* 把论断扩展得比证据允许的还要远。"],
        ["*{wrong}* hedges so much that it no longer says anything useful.", "*{wrong}* 含糊到不再说出任何有用的东西。"],
      ],
    ),
  ],
});

/** writingTopics8a are the writing topics, checked by rule, of the first units of grade 8. */
export const writingTopics8a: readonly TopicDef[] = [technical, primarySource, statistics, qualifying];
