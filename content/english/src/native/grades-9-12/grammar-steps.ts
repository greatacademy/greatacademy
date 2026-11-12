// Grades 9 to 12: the second step of the grammar and style topics, from recognizing a pattern to using or repairing
// it: fixing punctuation, building a sentence's shape, naming a condition, combining with an absolute phrase, telling
// a noun clause from its neighbors, fixing a quotation's lead-in, moving the stress, and hearing what a sentence does.

import { t } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { point } from "@ga/subject-english";
import { bars, fields, kindedChoice, type Label, labelChoice } from "../../topics/steps.ts";
import { moreAbsoluteCombineLines, moreClauseLines, moreConditionLines, moreShapeParts, moreStressLines } from "./grammar-more.ts";

// Fixing semicolons and colons.

const splice = "a comma splice";
const badColon = "a colon after an incomplete clause";
const badSemicolon = "a semicolon before a phrase";
const fine = "nothing: it is correct";

const punctuationLabels: Readonly<Record<string, Label>> = {
  [splice]: {
    zh: "逗号粘连",
    why: [
      "Two complete clauses are joined by a comma alone. Use a semicolon, a period, or a comma with a joining word such as *and* or *but*.",
      "两个完整分句之间只用了逗号连接。应该用分号、句号，或者逗号加上 *and*、*but* 这样的连接词。",
    ],
    not: [
      "Look for two complete clauses joined by a comma alone. This sentence has no such pair.",
      "要找的是只用逗号连接的两个完整分句。这个句子里没有这样的分句。",
    ],
  },
  [badColon]: {
    zh: "冒号前不是完整分句",
    why: [
      "A colon must follow a complete clause, but the words before this colon cannot stand alone as a sentence. Remove the colon.",
      "冒号必须跟在完整分句后面，而这个冒号前的文字不能独立成句。应该去掉冒号。",
    ],
    not: [
      "Check what comes before any colon. Here the colon, if there is one, follows a clause that could stand alone.",
      "检查冒号前面的内容。这里如果有冒号，它前面的分句可以独立成句。",
    ],
  },
  [badSemicolon]: {
    zh: "分号后面是短语",
    why: [
      "A semicolon needs a complete clause on each side, but what follows this one is only a phrase. Use a comma instead.",
      "分号两边都需要完整分句，而这个分号后面只是一个短语。应该改用逗号。",
    ],
    not: [
      "Check both sides of any semicolon. Here each side, if there is one, is a complete clause.",
      "检查分号的两边。这里如果有分号，它两边都是完整分句。",
    ],
  },
  [fine]: {
    zh: "没有错误",
    why: [
      "Every mark does its job: each semicolon or comma with a joining word links complete clauses, and each colon follows a complete clause.",
      "每个标点都各司其职：分号或带连接词的逗号连接的是完整分句，冒号前面是完整分句。",
    ],
    not: [
      "Something here is wrong: look for two clauses joined by a comma alone, or a semicolon or colon on the wrong side of a clause.",
      "这里有错误：找一找只用逗号连接的两个分句，或者位置不对的分号或冒号。",
    ],
  },
};

const punctuationLines = `
  The library closed at six, we had to finish our project at home.|${splice}
  The recipe needs: flour, eggs and a little milk.|${badColon}
  We waited for the bus; standing in the rain for an hour.|${badSemicolon}
  The museum has one rule: no photographs in the gallery.|${fine}
  My sister loves soccer, she practices every afternoon.|${splice}
  The team's best players are: Ana, Theo and Kemal.|${badColon}
  He finally finished the novel; after three long months of work.|${badSemicolon}
  The storm knocked out the power; we read by candlelight all evening.|${fine}
  The test was harder than expected, most of the class ran out of time.|${splice}
  To make the poster, you will need: glue, scissors and paint.|${badColon}
  She studied every night; especially before the final exam.|${badSemicolon}
  I have visited three capitals: Lima, Quito and Bogotá.|${fine}
  The river flooded in spring, the farmers lost their crops.|${splice}
  Our trip included: a museum, a boat ride and a picnic.|${badColon}
  The town grew quickly; with new houses on every hill.|${badSemicolon}
  The bakery was closed, so we bought bread at the market.|${fine}
  The play was long, however, nobody left early.|${splice}
  The reasons for the delay were: rain, traffic and a flat tire.|${badColon}
  The puppy slept all afternoon; curled up beside the fire.|${badSemicolon}
  The coach gave one piece of advice: keep your eyes on the ball.|${fine}
  The phone rang twice, no one answered it.|${splice}
  The guide pointed out: the old church, the castle and the bridge.|${badColon}
  We hiked to the summit; despite the heavy fog.|${badSemicolon}
  The concert was cancelled; the singer had lost her voice.|${fine}
  The bridge was closed for repairs, drivers took the long way around.|${splice}
  His favorite foods include: noodles, mangoes and fried rice.|${badColon}
  She sang the final song; with tears in her eyes.|${badSemicolon}
  The festival drew visitors from Rome, Italy; Lyon, France; and Porto, Portugal.|${fine}
  The class planted trees in the park, the city provided the shovels.|${splice}
  The rules of the game are: no running, no shouting and no pushing.|${badColon}
`;

/** punctuationFixStep asks what is wrong with a sentence's semicolons, colons and commas. */
export const punctuationFixStep = point(
  "fixing-the-punctuation",
  t("Fixing the Punctuation", "修正标点"),
  t(
    "Writers most often misuse these marks in three ways, and each has a quick test.\n\n- A **comma splice** joins two complete clauses with a comma alone: *The library closed at six, we went home.* Test: could the words on each side of the comma stand alone? If so, use a semicolon or a period, or add *and*, *but* or *so*. A word such as *however* does not fix it.\n- A **colon after an incomplete clause**: *The recipe needs: flour and eggs.* Test: could the words before the colon end with a period? If not, remove the colon.\n- A **semicolon before a phrase**: *We waited; standing in the rain.* Test: is there a complete clause after the semicolon? If not, use a comma.\n\nIf every mark passes its test, the sentence is correct.",
    "作者最常在三个方面误用这些标点，每一种都有简单的检验方法。\n\n- **逗号粘连**（comma splice）只用逗号连接两个完整分句：*The library closed at six, we went home.* 检验：逗号两边的文字能否各自独立成句？如果能，就用分号或句号，或者加上 *and*、*but*、*so*。*however* 这样的词不能纠正这个错误。\n- **冒号前不是完整分句**：*The recipe needs: flour and eggs.* 检验：冒号前的文字能否以句号结尾？如果不能，就去掉冒号。\n- **分号后面是短语**：*We waited; standing in the rain.* 检验：分号后面是否有完整分句？如果没有，就改用逗号。\n\n如果每个标点都通过了检验，句子就是正确的。",
  ),
  labelChoice(["What is wrong with the punctuation of this sentence?", "这个句子的标点有什么错误？"], punctuationLines, punctuationLabels),
);

// Building the shape of a sentence.

/** shapeParts are lines of "main clause|details|periodic|cumulative|split", one sentence built three ways. */
const shapeParts = fields(`
  the bell rang|after an hour of silence; loud across the empty yard|After an hour of silence, loud across the empty yard, the bell rang.|The bell rang after an hour of silence, loud across the empty yard.|After an hour of silence, the bell rang, loud across the empty yard.
  the fox slipped into the woods|its tail low; leaving no tracks in the frost|Its tail low, leaving no tracks in the frost, the fox slipped into the woods.|The fox slipped into the woods, its tail low, leaving no tracks in the frost.|Its tail low, the fox slipped into the woods, leaving no tracks in the frost.
  my grandmother laughed|tired from the journey; still wearing her coat|Tired from the journey, still wearing her coat, my grandmother laughed.|My grandmother laughed, tired from the journey, still wearing her coat.|Tired from the journey, my grandmother laughed, still wearing her coat.
  the ship reached the harbor|battered by the storm; its sails in rags|Battered by the storm, its sails in rags, the ship reached the harbor.|The ship reached the harbor, battered by the storm, its sails in rags.|Battered by the storm, the ship reached the harbor, its sails in rags.
  the runner collapsed|gasping for breath; one step past the finish line|Gasping for breath, one step past the finish line, the runner collapsed.|The runner collapsed, gasping for breath, one step past the finish line.|Gasping for breath, the runner collapsed, one step past the finish line.
  the old house burned|its windows glowing orange; its roof folding inward|Its windows glowing orange, its roof folding inward, the old house burned.|The old house burned, its windows glowing orange, its roof folding inward.|Its windows glowing orange, the old house burned, its roof folding inward.
  the crowd fell silent|stunned by the news; staring at the screen|Stunned by the news, staring at the screen, the crowd fell silent.|The crowd fell silent, stunned by the news, staring at the screen.|Stunned by the news, the crowd fell silent, staring at the screen.
  the boy opened the letter|his hands shaking; afraid of what it might say|His hands shaking, afraid of what it might say, the boy opened the letter.|The boy opened the letter, his hands shaking, afraid of what it might say.|His hands shaking, the boy opened the letter, afraid of what it might say.
  the train pulled away|whistling once; trailing smoke over the fields|Whistling once, trailing smoke over the fields, the train pulled away.|The train pulled away, whistling once, trailing smoke over the fields.|Whistling once, the train pulled away, trailing smoke over the fields.
  the queen entered the hall|dressed in black; her face calm and unreadable|Dressed in black, her face calm and unreadable, the queen entered the hall.|The queen entered the hall, dressed in black, her face calm and unreadable.|Dressed in black, the queen entered the hall, her face calm and unreadable.
  the snow kept falling|soft and steady; covering the roads and the cars|Soft and steady, covering the roads and the cars, the snow kept falling.|The snow kept falling, soft and steady, covering the roads and the cars.|Soft and steady, the snow kept falling, covering the roads and the cars.
  the dog waited by the door|ears pricked; nose pressed to the glass|Ears pricked, nose pressed to the glass, the dog waited by the door.|The dog waited by the door, ears pricked, nose pressed to the glass.|Ears pricked, the dog waited by the door, nose pressed to the glass.
  the climbers reached the summit|exhausted and frostbitten; after eleven hours on the ice|Exhausted and frostbitten, after eleven hours on the ice, the climbers reached the summit.|The climbers reached the summit, exhausted and frostbitten, after eleven hours on the ice.|Exhausted and frostbitten, the climbers reached the summit after eleven hours on the ice.
  the judge read the verdict|slowly; her voice steady in the hushed courtroom|Slowly, her voice steady in the hushed courtroom, the judge read the verdict.|The judge read the verdict slowly, her voice steady in the hushed courtroom.|Slowly, the judge read the verdict, her voice steady in the hushed courtroom.
  the kite rose|tugging at its string; climbing above the trees|Tugging at its string, climbing above the trees, the kite rose.|The kite rose, tugging at its string, climbing above the trees.|Tugging at its string, the kite rose, climbing above the trees.
${moreShapeParts}
`);

const shapeBuildBank: ChoiceItem[] = shapeParts.flatMap(([main, details, periodic, cumulative, split]): ChoiceItem[] => {
  if (!main || !details || !periodic || !cumulative || !split) throw new Error(`a shape line needs five fields: ${main}`);
  const parts = `Main clause: *${main}*\nDetails: ${details
    .split(";")
    .map((d) => `*${d.trim()}*`)
    .join(", ")}`;
  return [
    [`${parts}\n\nBuild a **periodic** sentence.`, periodic, [cumulative, split]],
    [`${parts}\n\nBuild a **cumulative** sentence.`, cumulative, [periodic, split]],
  ];
});

/** shapeBuildStep asks for the sentence that puts given parts into a periodic or a cumulative shape. */
export const shapeBuildStep = point(
  "building-the-shape",
  t("Building the Shape", "构造句子的形态"),
  t(
    "Given a main clause and some details, you can build either shape on purpose.\n\n- For a **periodic** sentence, put every detail first and save the main clause for the very end: *After an hour of silence, loud across the empty yard, the bell rang.* The reader waits, and the last words land hardest.\n- For a **cumulative** sentence, state the main clause first and let the details follow it: *The bell rang after an hour of silence, loud across the empty yard.*\n\nA sentence that puts some details before the main clause and some after is neither: it is a mixed shape, perfectly good English, but it gives up the suspense of the periodic and the easy flow of the cumulative.",
    "给定一个主句和一些细节，你可以有意识地构造出任意一种形态。\n\n- 要构造**圆周句**（periodic），就把所有细节放在前面，把主句留到最后：*After an hour of silence, loud across the empty yard, the bell rang.* 读者一直在等待，最后的词分量最重。\n- 要构造**累积句**（cumulative），就先说出主句，再让细节跟在后面：*The bell rang after an hour of silence, loud across the empty yard.*\n\n把一部分细节放在主句前、一部分放在主句后的句子两者都不是：它是混合形态，也是很好的英语，但既没有圆周句的悬念，也没有累积句的流畅。",
  ),
  kindedChoice(
    ["Which sentence builds the shape asked for from these parts?", "哪个句子用这些部分构造出了所要求的形态？"],
    shapeBuildBank,
    (right, shown) =>
      shown.includes("**periodic**")
        ? [
            `*${right}* Every detail comes first and the main clause waits until the end, which is what makes a sentence periodic.`,
            `*${right}* 所有细节都在前面，主句一直等到句末，这正是圆周句的特点。`,
          ]
        : [
            `*${right}* The main clause comes first and every detail follows it, which is what makes a sentence cumulative.`,
            `*${right}* 主句在前，所有细节都跟在后面，这正是累积句的特点。`,
          ],
    [
      [
        "*{wrong}* has the opposite shape: check whether the main clause should open the sentence or close it.",
        "*{wrong}* 的形态正好相反：检查主句应该放在句首还是句末。",
      ],
      [
        "*{wrong}* splits the details around the main clause, so it is neither periodic nor cumulative.",
        "*{wrong}* 把细节分放在主句两边，所以它既不是圆周句，也不是累积句。",
      ],
    ],
  ),
);

// Naming the condition.

const real = "real";
const unrealNow = "unreal present";
const unrealPast = "unreal past";
const mixed = "mixed";

const conditionLabels: Readonly<Record<string, Label>> = {
  [real]: {
    zh: "真实条件",
    why: [
      "The condition may really happen, or is always true, so the *if* clause takes the present and the result takes *will* or the present.",
      "条件可能真的发生，或者总是成立，所以 *if* 从句用一般现在时，结果用 *will* 或一般现在时。",
    ],
    not: [
      "A real condition uses the present after *if* and *will* or the present in the result. These verbs are pushed back into the past.",
      "真实条件在 *if* 后用一般现在时，结果用 *will* 或一般现在时。这里的动词往过去推了一步。",
    ],
  },
  [unrealNow]: {
    zh: "与现在事实相反",
    why: [
      "The condition is not true now, so the *if* clause takes the past (or *were*) and the result takes *would* with a plain verb.",
      "条件现在并不成立，所以 *if* 从句用一般过去时（或 *were*），结果用 *would* 加动词原形。",
    ],
    not: [
      "An unreal present condition pairs *if* + past with *would* + plain verb, both about now. These verbs do not make that pair.",
      "与现在事实相反的条件把 *if* + 过去时与 *would* + 动词原形配对，两者都关于现在。这里的动词不是这样配对的。",
    ],
  },
  [unrealPast]: {
    zh: "与过去事实相反",
    why: [
      "The condition did not happen in the past, so the *if* clause takes *had* + past participle and the result takes *would have* + past participle.",
      "条件在过去并没有发生，所以 *if* 从句用 *had* + 过去分词，结果用 *would have* + 过去分词。",
    ],
    not: [
      "An unreal past condition needs *had* + participle and *would have* + participle in both clauses. These verbs do not have both.",
      "与过去事实相反的条件两个分句都需要 *had* + 分词和 *would have* + 分词。这里的动词并非两者兼有。",
    ],
  },
  [mixed]: {
    zh: "混合条件",
    why: [
      "The two clauses belong to different times: a past condition with a present result (*had* ... *would*), or a present condition with a past result (*were* ... *would have*).",
      "两个分句属于不同的时间：过去的条件配现在的结果（*had* ... *would*），或现在的条件配过去的结果（*were* ... *would have*）。",
    ],
    not: [
      "In a mixed conditional the two clauses point to different times. Here both clauses point to the same time.",
      "混合条件句的两个分句指向不同的时间。这里两个分句指向的是同一时间。",
    ],
  },
};

const conditionLines = `
  If the bus is late, we will walk to school.|${real}
  If I had a car, I would drive you to the airport.|${unrealNow}
  If we had left earlier, we would have caught the train.|${unrealPast}
  If she had studied medicine, she would be a doctor now.|${mixed}
  If you freeze water, it turns to ice.|${real}
  If I were taller, I would join the basketball team.|${unrealNow}
  If the goalkeeper had stayed on his line, he would have saved the shot.|${unrealPast}
  If he were more careful, he would not have broken the vase yesterday.|${mixed}
  If it snows tonight, the schools will close tomorrow.|${real}
  If they lived closer, we would visit them every weekend.|${unrealNow}
  If you had told me about the party, I would have come.|${unrealPast}
  If I had saved my money last year, I would have enough for the trip now.|${mixed}
  If the store has any bread left, I will buy two loaves.|${real}
  If our town had a cinema, we would not have to drive to the city.|${unrealNow}
  If the bridge had been inspected, it would not have collapsed.|${unrealPast}
  If she were not so shy, she would have spoken at the meeting last night.|${mixed}
  If you mix blue and yellow, you get green.|${real}
  If I knew the answer, I would tell you.|${unrealNow}
  If the team had trained harder, it would have won the final.|${unrealPast}
  If they had planted the trees ten years ago, the street would be shady today.|${mixed}
  If the price drops, my parents will buy a new laptop.|${real}
  If dogs could talk, they would complain about baths.|${unrealNow}
  If the alarm had rung, I would not have missed the exam.|${unrealPast}
  If I spoke French, I would have understood the film last night.|${mixed}
  If you press this button, the machine starts.|${real}
  If we had more time, we would paint the whole fence.|${unrealNow}
  If he had checked the weather, he would have brought an umbrella.|${unrealPast}
  If the dam had not been built, this valley would be a lake now.|${mixed}
  If the meeting ends early, I will call you.|${real}
  If my brother were here, he would know how to fix the bike.|${unrealNow}
${moreConditionLines(real, unrealNow, unrealPast, mixed)}
`;

/** conditionStep asks what kind of conditional a sentence is. */
export const conditionStep = point(
  "naming-the-condition",
  t("Naming the Condition", "辨别条件类型"),
  t(
    "To check a conditional you have written, name its kind from the verbs in both clauses.\n\n- **Real**: *if* + present, then *will* or the present. *If the bus is late, we will walk.*\n- **Unreal present**: *if* + past or *were*, then *would* + verb. *If I had a car, I would drive.*\n- **Unreal past**: *if* + *had* + participle, then *would have* + participle. *If we had left earlier, we would have caught the train.*\n- **Mixed**: the clauses point to different times. A past condition with a present result: *If she had studied medicine, she would be a doctor now.* A present condition with a past result: *If he were more careful, he would not have broken the vase.*\n\nTime words such as *now*, *yesterday* and *last year* often show which times the clauses refer to.",
    "要检查自己写的条件句，就根据两个分句中的动词说出它的类型。\n\n- **真实条件**：*if* + 一般现在时，结果用 *will* 或一般现在时。*If the bus is late, we will walk.*\n- **与现在事实相反**：*if* + 过去时或 *were*，结果用 *would* + 动词。*If I had a car, I would drive.*\n- **与过去事实相反**：*if* + *had* + 分词，结果用 *would have* + 分词。*If we had left earlier, we would have caught the train.*\n- **混合条件**：两个分句指向不同的时间。过去的条件配现在的结果：*If she had studied medicine, she would be a doctor now.* 现在的条件配过去的结果：*If he were more careful, he would not have broken the vase.*\n\n*now*、*yesterday*、*last year* 这样的时间词常常能表明分句所指的时间。",
  ),
  labelChoice(["What kind of conditional sentence is this?", "这是哪种条件句？"], conditionLines, conditionLabels),
);

// Combining with an absolute phrase.

/** absoluteCombineBank joins two sentences; its wrong options keep the verb in a comma splice, then use a participial phrase. */
const absoluteCombineBank = bars(
  `
  The runner crossed the line. Her arms were raised high.|The runner crossed the line, her arms raised high.|The runner crossed the line, her arms were raised high.|Raising her arms high, the runner crossed the line.
  The old man sat on the porch. His pipe was glowing in the dark.|The old man sat on the porch, his pipe glowing in the dark.|The old man sat on the porch, his pipe was glowing in the dark.|Glowing in the dark, the old man sat on the porch.
  The horses galloped across the field. Their manes were flying.|The horses galloped across the field, their manes flying.|The horses galloped across the field, their manes were flying.|Flying across the field, the horses galloped.
  The soldier stood at attention. His boots were polished to a shine.|The soldier stood at attention, his boots polished to a shine.|The soldier stood at attention, his boots were polished to a shine.|Polishing his boots to a shine, the soldier stood at attention.
  The girl read under the blanket. Her flashlight was flickering.|The girl read under the blanket, her flashlight flickering.|The girl read under the blanket, her flashlight was flickering.|Flickering, the girl read under the blanket.
  The boat drifted toward the shore. Its engine was silent.|The boat drifted toward the shore, its engine silent.|The boat drifted toward the shore, its engine was silent.|Silently running its engine, the boat drifted toward the shore.
  The chef tasted the soup. Her eyes were closed in concentration.|The chef tasted the soup, her eyes closed in concentration.|The chef tasted the soup, her eyes were closed in concentration.|Closing her eyes in concentration, the chef tasted the soup.
  The cat watched the bird. Its tail was twitching.|The cat watched the bird, its tail twitching.|The cat watched the bird, its tail was twitching.|Twitching its tail, the cat watched the bird.
  The students filed into the hall. Their faces were pale with nerves.|The students filed into the hall, their faces pale with nerves.|The students filed into the hall, their faces were pale with nerves.|Pale with nerves, the students filed into the hall.
  The singer bowed to the audience. Her voice was finally silent.|The singer bowed to the audience, her voice finally silent.|The singer bowed to the audience, her voice was finally silent.|Finally silent, the singer bowed to the audience.
  The climbers rested on the ledge. Their ropes were coiled beside them.|The climbers rested on the ledge, their ropes coiled beside them.|The climbers rested on the ledge, their ropes were coiled beside them.|Coiling their ropes beside them, the climbers rested on the ledge.
  The detective studied the map. His finger was tracing the river.|The detective studied the map, his finger tracing the river.|The detective studied the map, his finger was tracing the river.|Tracing the river with his finger, the detective studied the map.
  The city slept. Its streets were empty and wet.|The city slept, its streets empty and wet.|The city slept, its streets were empty and wet.|Empty and wet, the city slept.
  The baby laughed. His cheeks were red from the cold.|The baby laughed, his cheeks red from the cold.|The baby laughed, his cheeks were red from the cold.|Red from the cold, the baby laughed.
  The ship sailed out of the harbor. Its flags were snapping in the wind.|The ship sailed out of the harbor, its flags snapping in the wind.|The ship sailed out of the harbor, its flags were snapping in the wind.|Snapping its flags in the wind, the ship sailed out of the harbor.
  The farmer walked home. His work was done for the day.|The farmer walked home, his work done for the day.|The farmer walked home, his work was done for the day.|Having done his work for the day, the farmer walked home.
  The dancers waited in the wings. Their costumes were glittering under the lights.|The dancers waited in the wings, their costumes glittering under the lights.|The dancers waited in the wings, their costumes were glittering under the lights.|Glittering under the lights, the dancers waited in the wings.
  The teacher stood at the board. Her chalk was squeaking with every word.|The teacher stood at the board, her chalk squeaking with every word.|The teacher stood at the board, her chalk was squeaking with every word.|Squeaking with every word, the teacher stood at the board.
  The wolves circled the camp. Their eyes were shining in the firelight.|The wolves circled the camp, their eyes shining in the firelight.|The wolves circled the camp, their eyes were shining in the firelight.|Shining in the firelight, the wolves circled the camp.
  The pianist began to play. His hands were trembling slightly.|The pianist began to play, his hands trembling slightly.|The pianist began to play, his hands were trembling slightly.|Trembling slightly, the pianist began to play.
  The children ran into the sea. Their shoes were left in a pile on the sand.|The children ran into the sea, their shoes left in a pile on the sand.|The children ran into the sea, their shoes were left in a pile on the sand.|Leaving their shoes in a pile on the sand, the children ran into the sea.
  The judge entered the courtroom. Her robe was sweeping the floor.|The judge entered the courtroom, her robe sweeping the floor.|The judge entered the courtroom, her robe was sweeping the floor.|Sweeping the floor, the judge entered the courtroom.
  The train crawled up the mountain. Its whistle was echoing off the cliffs.|The train crawled up the mountain, its whistle echoing off the cliffs.|The train crawled up the mountain, its whistle was echoing off the cliffs.|Echoing off the cliffs, the train crawled up the mountain.
  My father fell asleep in his chair. The newspaper was spread across his chest.|My father fell asleep in his chair, the newspaper spread across his chest.|My father fell asleep in his chair, the newspaper was spread across his chest.|Spreading the newspaper across his chest, my father fell asleep in his chair.
  The army marched north. Its banners were raised.|The army marched north, its banners raised.|The army marched north, its banners were raised.|Raising its banners, the army marched north.
  The swimmer climbed out of the pool. Her hair was dripping.|The swimmer climbed out of the pool, her hair dripping.|The swimmer climbed out of the pool, her hair was dripping.|Dripping, the swimmer climbed out of the pool.
  The trees bent in the storm. Their branches were creaking.|The trees bent in the storm, their branches creaking.|The trees bent in the storm, their branches were creaking.|Creaking, the trees bent in the storm.
  The guests sat down to dinner. Their glasses were already filled.|The guests sat down to dinner, their glasses already filled.|The guests sat down to dinner, their glasses were already filled.|Already filling their glasses, the guests sat down to dinner.
  The goalkeeper dived to the left. His gloves were stretched toward the ball.|The goalkeeper dived to the left, his gloves stretched toward the ball.|The goalkeeper dived to the left, his gloves were stretched toward the ball.|Stretching his gloves toward the ball, the goalkeeper dived to the left.
  The writer stared at the blank page. Her coffee was growing cold beside her.|The writer stared at the blank page, her coffee growing cold beside her.|The writer stared at the blank page, her coffee was growing cold beside her.|Growing cold beside her, the writer stared at the blank page.
${moreAbsoluteCombineLines}
  `,
  2,
);

/** absoluteCombineStep asks for the combination of two sentences that uses an absolute phrase. */
export const absoluteCombineStep = point(
  "combining-with-an-absolute",
  t("Combining with an Absolute Phrase", "用独立主格结构合并句子"),
  t(
    "Two sentences often become one by turning the second into an absolute phrase. Keep its noun, and drop its *was* or *were*: *The runner crossed the line. Her arms were raised high.* becomes *The runner crossed the line, **her arms raised high**.* The detail now hangs off the whole sentence like a close-up.\n\nTwo near misses are common. Keeping *was* or *were* leaves two complete clauses joined by a comma, which is a comma splice. Dropping the noun turns the phrase into a participial phrase that describes the subject, which changes the meaning and can make it dangle: *Glowing in the dark, the old man sat on the porch* says the man was glowing.",
    "把第二个句子变成独立主格结构，常常能把两句合成一句。保留它的名词，去掉它的 *was* 或 *were*：*The runner crossed the line. Her arms were raised high.* 就变成 *The runner crossed the line, **her arms raised high**.* 这个细节现在附着在整个句子上，就像一个特写镜头。\n\n有两种常见的差错。保留 *was* 或 *were*，就会留下两个只用逗号连接的完整分句，也就是逗号粘连。去掉名词，短语就变成了修饰主语的分词短语，这会改变意思，还可能造成悬垂修饰：*Glowing in the dark, the old man sat on the porch* 说的是老人在发光。",
  ),
  kindedChoice(
    ["Which sentence combines the two using an absolute phrase?", "哪个句子用独立主格结构把两句合并了起来？"],
    absoluteCombineBank,
    (right) => [
      `*${right}* The second sentence keeps its noun and drops *was* or *were*, so it becomes an absolute phrase attached by a comma.`,
      `*${right}* 第二句保留了名词，去掉了 *was* 或 *were*，于是变成了用逗号连接的独立主格结构。`,
    ],
    [
      [
        "*{wrong}* keeps *was* or *were*, so two complete clauses are joined by a comma alone: a comma splice, not an absolute phrase.",
        "*{wrong}* 保留了 *was* 或 *were*，于是两个完整分句只用逗号连接：这是逗号粘连，而不是独立主格结构。",
      ],
      [
        "*{wrong}* drops the noun, so the phrase is a participial phrase describing the subject of the sentence, not an absolute phrase.",
        "*{wrong}* 去掉了名词，于是这个短语成了修饰句子主语的分词短语，而不是独立主格结构。",
      ],
    ],
  ),
);

// Noun, relative or adverb clause.

const nounClause = "a noun clause";
const relativeClause = "a relative clause";
const adverbClause = "an adverb clause";

const clauseLabels: Readonly<Record<string, Label>> = {
  [nounClause]: {
    zh: "名词性从句",
    why: [
      "The clause fills the place of a noun, as subject, object or complement, so replacing it with *something* or *it* keeps the sentence whole.",
      "这个从句占据了名词的位置，作主语、宾语或表语，所以把它换成 *something* 或 *it*，句子依然完整。",
    ],
    not: [
      "A noun clause could be replaced by *something*. Try it here: the sentence would no longer make sense.",
      "名词性从句可以用 *something* 替换。在这里试一试：句子就讲不通了。",
    ],
  },
  [relativeClause]: {
    zh: "定语从句",
    why: [
      "The clause comes right after a noun and describes it, the way an adjective would, telling which one or what kind.",
      "这个从句紧跟在一个名词后面并修饰它，就像形容词一样，说明是哪一个或哪一种。",
    ],
    not: [
      "A relative clause describes the noun just before it. Here no noun is being described by the clause.",
      "定语从句修饰紧挨在它前面的名词。这里的从句并没有修饰任何名词。",
    ],
  },
  [adverbClause]: {
    zh: "状语从句",
    why: [
      "The clause tells when, where, why or under what condition the main action happens, and it could move to the other end of the sentence.",
      "这个从句说明主要动作发生的时间、地点、原因或条件，并且可以移到句子的另一端。",
    ],
    not: [
      "An adverb clause tells when, where, why or under what condition, and it can be moved. This clause cannot be moved away.",
      "状语从句说明时间、地点、原因或条件，并且可以移动。这个从句不能移走。",
    ],
  },
};

const clauseLines = `
  Nobody knew **where the old key was hidden**.|${nounClause}
  The house **where the old key was hidden** burned down last year.|${relativeClause}
  We found the key **where the old map said it would be**.|${adverbClause}
  **What she said at the meeting** surprised everyone.|${nounClause}
  The speech **that she gave at the meeting** surprised everyone.|${relativeClause}
  **When she spoke at the meeting**, everyone listened.|${adverbClause}
  The coach asked **whether we were ready**.|${nounClause}
  The players **who were ready** ran onto the field.|${relativeClause}
  **Because we were ready**, the coach let us start early.|${adverbClause}
  I wonder **why the birds left so early**.|${nounClause}
  The reason **that the birds left so early** is still a mystery.|${relativeClause}
  The birds left early **because the winter came fast**.|${adverbClause}
  **That the bridge was unsafe** became clear after the storm.|${nounClause}
  The bridge **that was unsafe** was closed after the storm.|${relativeClause}
  **Although the bridge was unsafe**, people kept crossing it.|${adverbClause}
  My question is **how the machine works**.|${nounClause}
  The engineer **who built the machine** answered my question.|${relativeClause}
  **Once the machine starts**, it cannot be stopped.|${adverbClause}
  She told us **that the museum would close early**.|${nounClause}
  The museum, **which closes early on Sundays**, was already dark.|${relativeClause}
  **If the museum closes early**, we will visit the park instead.|${adverbClause}
  **Whoever finishes first** can choose the music.|${nounClause}
  The student **who finishes first** can choose the music.|${relativeClause}
  **After everyone finishes**, we will choose the music.|${adverbClause}
  The problem was **that nobody had a map**.|${nounClause}
  The hikers **whose map was lost** waited for help.|${relativeClause}
  **Since nobody had a map**, we followed the river.|${adverbClause}
  We argued about **which road led to the village**.|${nounClause}
  The road **which led to the village** was blocked by snow.|${relativeClause}
  **Wherever the road led**, the dog followed us.|${adverbClause}
${moreClauseLines(nounClause, relativeClause, adverbClause)}
`;

/** clauseKindStep asks whether a bold clause is a noun, relative or adverb clause. */
export const clauseKindStep = point(
  "noun-relative-or-adverb",
  t("Noun, Relative or Adverb Clause", "名词性、定语还是状语从句"),
  t(
    "The same words, such as *where*, *that* or *when*, can begin three kinds of clause, so look at the job, not the first word.\n\n- A **noun clause** fills a noun's place. Replace it with *something* and the sentence still works: *Nobody knew **where the key was hidden*** becomes *Nobody knew something*.\n- A **relative clause** follows a noun and describes it: *The house **where the key was hidden** burned down.* Ask which house: the one where the key was hidden.\n- An **adverb clause** tells when, where, why or under what condition, and can usually move to the other end of the sentence: *We found the key **where the map said*** can become *Where the map said, we found the key.*",
    "同样的词，比如 *where*、*that* 或 *when*，可以引导三种从句，所以要看从句的作用，而不是它的第一个词。\n\n- **名词性从句**占据名词的位置。把它换成 *something*，句子仍然成立：*Nobody knew **where the key was hidden*** 可以变成 *Nobody knew something*。\n- **定语从句**跟在名词后面并修饰它：*The house **where the key was hidden** burned down.* 问一问是哪座房子：藏钥匙的那座。\n- **状语从句**说明时间、地点、原因或条件，通常可以移到句子的另一端：*We found the key **where the map said*** 可以变成 *Where the map said, we found the key.*",
  ),
  labelChoice(["What kind of clause is the one in bold?", "加粗的从句是哪一种？"], clauseLines, clauseLabels),
);

// Fixing a quotation's lead-in.

const commaAfterThat = "a comma after that";
const colonAfterFragment = "a colon after an incomplete clause";
const missingComma = "no comma after the signal phrase";
const unmarkedChange = "a changed word without brackets";
const worksIn = "nothing: it is correct";

const leadInLabels: Readonly<Record<string, Label>> = {
  [commaAfterThat]: {
    zh: "that 后面多了逗号",
    why: [
      "After *that*, the quotation simply continues the writer's sentence, so no comma should come between *that* and the quotation.",
      "在 *that* 之后，引文直接接续作者的句子，所以 *that* 和引文之间不应该有逗号。",
    ],
    not: [
      "No comma follows *that* here, or there is no *that* before the quotation at all.",
      "这里 *that* 后面没有逗号，或者引文前根本没有 *that*。",
    ],
  },
  [colonAfterFragment]: {
    zh: "冒号前不是完整分句",
    why: [
      "A colon may introduce a quotation only after a complete clause, and the words before this colon cannot stand alone as a sentence.",
      "只有在完整分句后面才能用冒号引出引文，而这个冒号前的文字不能独立成句。",
    ],
    not: [
      "Either there is no colon here, or the words before it form a complete clause, which may take a colon.",
      "这里要么没有冒号，要么冒号前的文字是完整分句，可以用冒号。",
    ],
  },
  [missingComma]: {
    zh: "引导语后缺少逗号",
    why: [
      "A signal phrase such as *the narrator says* needs a comma before the quotation, and this sentence leaves it out.",
      "*the narrator says* 这样的引导语后面需要用逗号引出引文，而这个句子漏掉了逗号。",
    ],
    not: ["The signal phrase here, if there is one, is already followed by its comma.", "这里如果有引导语，它后面已经有逗号了。"],
  },
  [unmarkedChange]: {
    zh: "改动的词没有加方括号",
    why: [
      "The source said *I* or *my*, and the writer changed it to fit the sentence, so the changed word must go in square brackets.",
      "原文说的是 *I* 或 *my*，作者为了适应句子而改动了它，所以改动的词必须放在方括号里。",
    ],
    not: [
      "No word of the quotation has been changed without brackets: the words inside the marks are the source's own.",
      "引文中没有不加方括号就改动的词：引号里的词都是原文的。",
    ],
  },
  [worksIn]: {
    zh: "没有错误",
    why: [
      "The lead-in and its punctuation fit together, and any word changed from the source is already in square brackets.",
      "引导语和标点相互匹配，凡是改动原文的词都已经放在方括号里了。",
    ],
    not: [
      "Something here breaks a rule: check the mark after the lead-in, and whether any changed word lacks brackets.",
      "这里违反了某条规则：检查引导语后面的标点，以及改动的词是否缺少方括号。",
    ],
  },
};

const leadInLines = `
  Source, the narrator: "I have never trusted the sea."\\nWriter: The narrator admits that, "[he has] never trusted the sea."|${commaAfterThat}
  Source, the captain: "We sail at dawn, whatever the weather."\\nWriter: The captain says: "We sail at dawn, whatever the weather."|${colonAfterFragment}
  Source, the mother: "No one leaves this house tonight."\\nWriter: The mother warns "No one leaves this house tonight."|${missingComma}
  Source, the girl: "I am not afraid of the dark."\\nWriter: The girl insists that "she is not afraid of the dark."|${unmarkedChange}
  Source, the old man: "My garden is my whole world."\\nWriter: The old man tells his visitor that "[his] garden is [his] whole world."|${worksIn}
  Source, the soldier: "I will come home when the war is over."\\nWriter: The soldier promises that, "[he] will come home when the war is over."|${commaAfterThat}
  Source, the judge: "The law must be the same for everyone."\\nWriter: As the judge declares: "The law must be the same for everyone."|${colonAfterFragment}
  Source, the coach: "Hard work beats talent."\\nWriter: Before the game the coach repeats "Hard work beats talent."|${missingComma}
  Source, the poet: "I wandered lonely through the hills."\\nWriter: The poet recalls that "he wandered lonely through the hills."|${unmarkedChange}
  Source, the teacher: "Every question deserves an answer."\\nWriter: The teacher holds one belief above all: "Every question deserves an answer."|${worksIn}
  Source, the farmer: "The rain came too late for my crops."\\nWriter: The farmer complains that, "the rain came too late for [his] crops."|${commaAfterThat}
  Source, the queen: "I will not bow to any king."\\nWriter: The queen proudly states: "I will not bow to any king."|${colonAfterFragment}
  Source, the boy: "Nobody listens to me."\\nWriter: Near the end the boy cries "Nobody listens to me."|${missingComma}
  Source, the scientist: "My results surprised me."\\nWriter: The scientist confesses that "her results surprised her."|${unmarkedChange}
  Source, the sailor: "The sea gives and the sea takes."\\nWriter: As the sailor puts it, "The sea gives and the sea takes."|${worksIn}
  Source, the doctor: "I cannot promise that she will recover."\\nWriter: The doctor explains that, "[she] cannot promise that [the patient] will recover."|${commaAfterThat}
  Source, the mayor: "Our town will rebuild."\\nWriter: The mayor tells the crowd: "Our town will rebuild."|${colonAfterFragment}
  Source, the stranger: "I have come a very long way."\\nWriter: At the door the stranger murmurs "I have come a very long way."|${missingComma}
  Source, the grandmother: "I remember the year the river froze."\\nWriter: The grandmother says that "she remembers the year the river froze."|${unmarkedChange}
  Source, the explorer: "I have seen things no one will believe."\\nWriter: The explorer writes that "[he has] seen things no one will believe."|${worksIn}
  Source, the actor: "I forget my lines when I am nervous."\\nWriter: The actor admits that, "[he forgets his] lines when [he is] nervous."|${commaAfterThat}
  Source, the student: "This school changed my life."\\nWriter: In her speech the student says: "This school changed my life."|${colonAfterFragment}
  Source, the father: "We are not giving up."\\nWriter: The father tells his children "We are not giving up."|${missingComma}
  Source, the king: "I trusted my brother more than anyone."\\nWriter: The king laments that "he trusted his brother more than anyone."|${unmarkedChange}
  Source, the singer: "Music saved me."\\nWriter: The singer's whole story rests on one line: "Music saved me."|${worksIn}
  Source, the witness: "I saw a red car speed away."\\nWriter: The witness reports that, "[she] saw a red car speed away."|${commaAfterThat}
  Source, the guide: "Stay on the path at all times."\\nWriter: The guide warns the group: "Stay on the path at all times."|${worksIn}
  Source, the inventor: "My machine will change the world."\\nWriter: The inventor boasts that "his machine will change the world."|${unmarkedChange}
  Source, the child: "I want to go home."\\nWriter: The lost child whispers "I want to go home."|${missingComma}
  Source, the general: "We will hold the bridge."\\nWriter: According to the general: "We will hold the bridge."|${colonAfterFragment}
`;

/** leadInFixStep asks what is wrong with how a quotation is worked into a sentence. */
export const leadInFixStep = point(
  "fixing-the-lead-in",
  t("Fixing the Lead-In", "修正引文的引导方式"),
  t(
    'When you revise an essay, check each quotation against four rules, since each has a typical slip.\n\n- After ***that***, no comma: *The narrator admits that "[he has] never trusted the sea."*\n- A **colon** only after a complete clause. *The captain says:* is not one, so it takes a comma; *The captain gives one order:* is one, so it may take a colon.\n- After a **signal phrase** such as *the mother warns*, a **comma** before the quotation.\n- If you change a word of the source, such as *I* to *he*, put the changed word in **square brackets**: *[he]*.\n\nIf the lead-in passes all four, the quotation is worked in correctly.',
    '修改文章时，要用四条规则检查每一处引文，因为每条规则都有一种常见的疏漏。\n\n- ***that*** 之后不加逗号：*The narrator admits that "[he has] never trusted the sea."*\n- **冒号**只能跟在完整分句后面。*The captain says:* 不是完整分句，所以用逗号；*The captain gives one order:* 是完整分句，所以可以用冒号。\n- 在 *the mother warns* 这类**引导语**后面，引文前要用**逗号**。\n- 如果改动了原文的词，比如把 *I* 改成 *he*，就要把改动的词放在**方括号**里：*[he]*。\n\n如果引导部分通过了全部四条检验，引文就融入得正确。',
  ),
  labelChoice(
    ["What is wrong with how the writer works this quotation in?", "作者引用这句话的方式有什么错误？"],
    leadInLines,
    leadInLabels,
  ),
);

// Moving the stress.

/** stressBank asks for a rewrite that stresses the bold words; its wrong options break the grammar, then stress other words. */
const stressBank = bars(
  `
  We had **never** seen such a flood.|Never had we seen such a flood.|Never we had seen such a flood.|Such a flood we had never seen.
  The answer **only** came to me then.|Only then did the answer come to me.|Only then the answer did come to me.|It was the answer that came to me only then.
  An old **oak** stood under the hill.|Under the hill stood an old oak.|Under the hill an old oak it stood.|It was under the hill that an old oak stood.
  I will **never** forgive that lie.|That lie I will never forgive.|That lie will I never forgive it.|Never will I forgive anyone.
  **Maria** found the missing ring.|It was Maria who found the missing ring.|It was Maria found who the missing ring.|What Maria found was the missing ring.
  We need **more time** above all.|What we need above all is more time.|What we need above all more time is.|It is above all that we need more time.
  I **rarely** see such kindness.|Rarely do I see such kindness.|Rarely I do see such kindness.|Such kindness I see only rarely, it seems.
  The bus driver **noticed the smoke** first.|It was the bus driver who noticed the smoke first.|It was the bus driver noticed who the smoke first.|What the bus driver noticed first was the smoke.
  We **had barely** sat down when the phone rang.|Barely had we sat down when the phone rang.|Barely we had sat down when the phone rang.|When the phone rang, we had barely sat down.
  The singer wanted **silence**.|What the singer wanted was silence.|What wanted the singer was silence.|It was the singer who wanted silence.
  Two small boats lay **beyond the reef**.|Beyond the reef lay two small boats.|Beyond the reef two small boats lay them.|Two small boats, beyond the reef, lay.
  You must **not under any circumstances** open this door.|Under no circumstances must you open this door.|Under no circumstances you must open this door.|This door you must not open.
  I have **seldom** heard a better speech.|Seldom have I heard a better speech.|Seldom I have heard a better speech.|A better speech I have seldom heard.
  The **storm** destroyed the pier.|It was the storm that destroyed the pier.|It was the storm destroyed that the pier.|What the storm destroyed was the pier.
  She **finally** told us the truth at midnight.|Only at midnight did she finally tell us the truth.|Only at midnight she did finally tell us the truth.|The truth she finally told us at midnight.
  I dislike **his arrogance**, not his ideas.|What I dislike is his arrogance, not his ideas.|What I dislike his arrogance is, not his ideas.|It is I who dislike his arrogance, not his ideas.
  A tiny village sat **at the top of the mountain**.|At the top of the mountain sat a tiny village.|At the top of the mountain a tiny village it sat.|A tiny village was what sat at the top of the mountain.
  The team **did not lose** a single game all season.|Not a single game did the team lose all season.|Not a single game the team did lose all season.|It was the team that did not lose a single game all season.
  **The quiet student** won the prize.|It was the quiet student who won the prize.|It was the quiet student won who the prize.|What the quiet student won was the prize.
  We remember **the kindness of strangers** most.|What we remember most is the kindness of strangers.|What we remember most the kindness of strangers is.|It is we who remember the kindness of strangers most.
  He had **no sooner** arrived than he wanted to leave.|No sooner had he arrived than he wanted to leave.|No sooner he had arrived than he wanted to leave.|He wanted to leave no sooner than he had arrived.
  The prize went to **the youngest runner**.|It was the youngest runner who won the prize.|It was the youngest runner won who the prize.|The prize, it went to the youngest runner.
  A strange light shone **through the window**.|Through the window shone a strange light.|Through the window a strange light it shone.|It was a strange light that shone through the window.
  I **did not** understand the poem **until I read it aloud**.|Not until I read it aloud did I understand the poem.|Not until I read it aloud I did understand the poem.|The poem I did not understand until I read it aloud.
  The town needs **a hospital**, not another mall.|What the town needs is a hospital, not another mall.|What the town needs a hospital is, not another mall.|It is the town that needs a hospital, not another mall.
  My **grandfather** built this table.|It was my grandfather who built this table.|It was my grandfather built who this table.|What my grandfather built was this table.
  We had **hardly** begun when the rain started.|Hardly had we begun when the rain started.|Hardly we had begun when the rain started.|When the rain started, we had hardly begun.
  The ghost of the old captain stood **at the top of the stairs**.|At the top of the stairs stood the ghost of the old captain.|At the top of the stairs the ghost of the old captain it stood.|It was the ghost of the old captain who stood at the top of the stairs.
  **Courage**, more than strength, wins battles.|What wins battles is courage, more than strength.|What wins battles courage is, more than strength.|Battles are won by courage, more than strength.
  I have **never in my life** been so cold.|Never in my life have I been so cold.|Never in my life I have been so cold.|So cold I have never been in my life.
${moreStressLines}
  `,
  2,
);

/** stressStep asks for the rewrite that puts the bold words in a place of stress. */
export const stressStep = point(
  "stressing-the-words",
  t("Stressing the Words", "强调指定的词"),
  t(
    "To put weight on particular words, choose the move that brings them to a place of stress, and get its grammar right.\n\n- A **negative or limiting word** (*never, rarely, only then, not until, no sooner*) moves to the front, and the helping verb comes before the subject: *Never **had we** seen such a flood.* Without that swap, *Never we had seen* is not English.\n- A **phrase of place** moves to the front, and the main verb comes before the subject: *Under the hill stood an old oak.*\n- A **person or thing** takes the stress in a cleft: *It was Maria who found the ring.*\n- An **object or idea** takes the end of a *What ... is* cleft: *What we need is more time.*\n\nA correct rewrite that stresses other words misses the point.",
    "要强调特定的词，就选择能把它们移到重读位置的方式，并且语法要正确。\n\n- **否定词或限制词**（*never, rarely, only then, not until, no sooner*）移到句首，助动词放在主语前面：*Never **had we** seen such a flood.* 不这样调换，*Never we had seen* 就不是正确的英语。\n- **地点短语**移到句首，主要动词放在主语前面：*Under the hill stood an old oak.*\n- 用分裂句强调**某人或某物**：*It was Maria who found the ring.*\n- 用 *What ... is* 分裂句把**宾语或想法**放到句末：*What we need is more time.*\n\n语法正确、却强调了别的词的改写，没有抓住要点。",
  ),
  kindedChoice(
    ["Which rewrite puts the stress on the words in bold?", "哪种改写把重音放在了加粗的词上？"],
    stressBank,
    (right) => [
      `*${right}* It moves the bold words to the front or into a cleft, where the stress falls, and keeps the grammar the move needs.`,
      `*${right}* 它把加粗的词移到句首或放进分裂句，即重音所在的位置，并保持了这种调整所需要的语法。`,
    ],
    [
      [
        "*{wrong}* tries the right move but breaks the grammar: after a fronted negative or phrase, the verb must come before the subject.",
        "*{wrong}* 方向对了，但语法错了：否定词或短语前置后，动词必须放在主语前面。",
      ],
      [
        "*{wrong}* is correct English, but it puts the stress on different words, not the ones in bold.",
        "*{wrong}* 是正确的英语，但它强调的是别的词，而不是加粗的词。",
      ],
    ],
  ),
);

// What a sentence does to the rhythm.

const lands = "it lands a point after longer sentences";
const releases = "it releases tension after short sentences";
const flat = "it keeps the same rhythm, with no contrast";

const rhythmLabels: Readonly<Record<string, Label>> = {
  [lands]: {
    zh: "在长句之后落下要点",
    why: [
      "It is much shorter than the long sentences before it, so the reader stops on it and its few words carry great weight.",
      "它比前面的长句短得多，所以读者会在这里停顿，它寥寥几个词就有很大的分量。",
    ],
    not: [
      "For a short sentence to land a point, the sentences before it must be long. Compare the lengths here again.",
      "短句要想落下要点，前面的句子必须是长句。再比较一下这里句子的长短。",
    ],
  },
  [releases]: {
    zh: "在短句之后释放紧张",
    why: [
      "It flows on at length after a run of short, tense sentences, so the reader breathes out with it as the tension eases.",
      "它跟在一连串紧张的短句之后，从容地铺展开来，读者随着它松了一口气，紧张感也缓和了。",
    ],
    not: [
      "For a long sentence to release tension, the sentences before it must be short and tense. Compare the lengths here again.",
      "长句要想释放紧张，前面的句子必须是紧张的短句。再比较一下这里句子的长短。",
    ],
  },
  [flat]: {
    zh: "节奏不变，没有对比",
    why: [
      "It is about as long as the sentences around it, so it continues the rhythm instead of breaking it, and nothing stands out.",
      "它和周围的句子长短差不多，所以延续了原有的节奏而没有打破它，没有什么显得突出。",
    ],
    not: [
      "The bold sentence is very different in length from those before it, so it does break the rhythm.",
      "加粗的句子与前面的句子长短差别很大，所以它确实打破了节奏。",
    ],
  },
};

const rhythmLines = `
  We had driven all night through the mountains, taking turns at the wheel, stopping only for gas and bad coffee, watching the sky turn from black to grey. When we finally reached the coast, we stepped out of the car and walked to the edge of the cliff. **The sea was gone.**|${lands}
  Thunder. Rain. A scream. Then silence. **Slowly, as the storm rolled away over the hills and the first birds began to sing again, the family crept out of the cellar and blinked at the wet, shining world.**|${releases}
  The market opens at eight. The farmers set up their stalls. The bakers bring their bread. **The fishmongers lay out their ice.**|${flat}
  For a year my brother had trained every morning before school, running the hills in the dark, lifting weights in the garage, eating plain rice and boiled eggs while the rest of us ate cake. On the day of the race he lined up with the others, crouched, and waited for the gun. **He won.**|${lands}
  The alarm rang. The lights died. The doors locked. **Then the backup power hummed to life, the corridors filled with soft yellow light, and one by one the frightened students let out the breath they had been holding.**|${releases}
  My aunt lived in a small house near the station, where trains rattled the windows every hour and the smell of coal hung in the curtains. She kept a garden full of roses and a kitchen full of jars of jam. **She gave every visitor a jar to take home, wrapped in newspaper and tied with string.**|${flat}
  The committee met for six hours, reading every report, hearing every complaint and arguing over every line of the budget until the coffee ran out and the janitor began switching off the lights. At midnight the chair finally called for a vote. **It failed.**|${lands}
  Knock. Silence. Knock again. A shuffle. A cough. **At last the door creaked open, and an old woman in a faded blue dressing gown peered out at us, smiled the warmest smile I had ever seen, and invited us in out of the cold.**|${releases}
  The bus stopped at the corner. Three people got on. One person got off. **The driver closed the doors and pulled away.**|${flat}
  The letters had come every week for twenty years, always on Thursday, always in the same blue envelope, always with the same careful handwriting that my mother would recognize from across the room. Then one Thursday in March the postman walked past our door. **Nothing came.**|${lands}
  Fire. Smoke. Sirens. Shouting. **When the last flames died and the smoke drifted away over the rooftops, the neighbors gathered in the street in their pajamas, wrapped in blankets, and found that not one of them had been hurt.**|${releases}
  The classroom was quiet after lunch, the afternoon light falling across the desks and the radiator ticking under the window. The teacher read aloud from a book about ships, and some of the students drew pictures in their notebooks. **A few of them listened closely to every word, their chins resting on their hands.**|${flat}
  For three days the miners were trapped underground, their lamps fading, their water running out, the rescuers above them drilling through rock that broke drill after drill. On the fourth morning a camera slid down a narrow shaft into the dark. **They were alive.**|${lands}
  Cold. Hunger. Fear. Waiting. **Then a horn sounded across the valley, the gates of the camp swung open, and a line of trucks loaded with bread, blankets and medicine rolled slowly through the snow toward the waiting crowd.**|${releases}
  We walked to the beach in the morning. We swam until lunch. We ate sandwiches on the sand. **We walked home in the afternoon.**|${flat}
  The surgeon had worked for nine hours without a break, her hands steady, her eyes fixed on the screen, the nurses passing instruments without a word as the clock crawled past midnight. At last she stepped back from the table and pulled down her mask. **"Done."**|${lands}
  Bang. A flash. Glass everywhere. Screaming. **But when the dust settled and the firefighters lifted the last beam, they found the little dog curled under the kitchen table, shaking, filthy and completely unharmed.**|${releases}
  The village hall hosted a meeting every month, where neighbors discussed the roads, the school and the bus timetable over tea and biscuits. Most meetings ended early, and people walked home talking about the weather. **The meeting in May was much the same, with a little extra talk about the summer fair.**|${flat}
  The two armies had faced each other across the river all winter, digging trenches, firing at shadows, listening each night to the enemy singing songs they did not understand. On Christmas morning a single soldier climbed out of his trench, unarmed, and walked toward the river. **No one fired.**|${lands}
  Wind. Waves. A snapped mast. Darkness. **By dawn the storm had blown itself out, the sea lay flat and silver under a pale sky, and the crew, soaked and shivering, counted themselves and found that everyone was there.**|${releases}
  The shop sold newspapers, sweets and stamps. It opened at six every morning. The owner knew every customer by name. **She asked about their families while she counted their change.**|${flat}
  My grandmother had told the story of the lost ring at every family dinner for fifty years: how it slipped off her finger in the garden, how she searched for weeks, how she finally gave up and bought a cheaper one. Last spring my nephew was digging for worms by the old apple tree. **He found it.**|${lands}
  Hiss. Crack. Sparks. Darkness. **Then, one after another, the streetlights flickered back on along the avenue, the refrigerators hummed again in every kitchen, and somewhere down the block a radio started playing a song in the middle of a word.**|${releases}
  The library was busy on Saturday mornings, with children in the reading corner and students at the long tables by the windows. The librarians stamped books and answered questions and pushed carts of returns along the shelves. **Near noon the crowd thinned, and the librarians took turns going out for lunch.**|${flat}
  The scientists spent ten years building the telescope, grinding the mirror, raising the money, hauling every part up a mountain road that washed away each spring. On the first clear night they pointed it at the sky and switched it on. **It worked.**|${lands}
  Late. Lost. Tired. Hungry. **Then we turned a corner and saw the lights of the little inn glowing at the end of the lane, smoke curling from its chimney, and a woman in the doorway waving as if she had been expecting us all evening.**|${releases}
  The train left at seven. It stopped at every town. Passengers got on and off. **The conductor checked their tickets.**|${flat}
  For months the town had argued about the old theater: whether to save it, sell it or tear it down, at council meetings that ran past midnight and in letters to the paper that grew angrier every week. In the end the decision was made by a fire on a quiet Tuesday night. **It burned to the ground.**|${lands}
  Silence. A click. Silence again. A shout. **Then the whole stadium rose to its feet at once, roaring and stamping and hugging strangers, as the ball dropped through the net and the clock ran out on the longest losing streak in the history of the school.**|${releases}
  The family ate dinner at six every evening, around a kitchen table covered with a yellow cloth. They talked about school and work and the neighbors' new dog. **Afterward, the children washed the dishes and the parents read the newspaper.**|${flat}
`;

/** rhythmStep asks what a bold sentence does to the rhythm of its paragraph. */
export const rhythmStep = point(
  "what-the-sentence-does",
  t("What the Sentence Does", "句子起什么作用"),
  t(
    "To judge a sentence's effect, compare its length with the sentences just before it.\n\n- A **short sentence after long ones lands a point**. The long sentences build up detail and expectation; the short one stops the reader and carries the weight: *...we walked to the edge of the cliff. The sea was gone.*\n- A **long sentence after short ones releases tension**. Short, choppy sentences feel tense; a long, flowing one lets the reader breathe out: *Thunder. Rain. A scream. Then, as the storm rolled away...*\n- A sentence about as long as its neighbors **keeps the same rhythm**. That is often fine for ordinary narration, but it creates no special effect.\n\nThe effect comes from the contrast, so always read the bold sentence together with what precedes it.",
    "要判断一个句子的效果，就把它的长短与紧挨在它前面的句子作比较。\n\n- **长句之后的短句落下要点**。长句积累细节和期待；短句让读者停下来，承载分量：*...we walked to the edge of the cliff. The sea was gone.*\n- **短句之后的长句释放紧张**。简短、断续的句子让人感到紧张；舒展流畅的长句让读者松一口气：*Thunder. Rain. A scream. Then, as the storm rolled away...*\n- 与周围句子长短差不多的句子**保持原有的节奏**。对一般的叙述来说这常常没问题，但它不会产生特别的效果。\n\n效果来自对比，所以一定要把加粗的句子和它前面的内容一起读。",
  ),
  labelChoice(
    ["What does the sentence in bold do to the rhythm of the paragraph?", "加粗的句子对段落的节奏起什么作用？"],
    rhythmLines,
    rhythmLabels,
  ),
);
