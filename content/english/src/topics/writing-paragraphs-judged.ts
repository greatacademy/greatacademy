// Writing: paragraphs written by the learner and judged by a model, one move at a time (W4).

import { type CriterionSpec, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** fromNotesBank asks for a paragraph built from notes: the topic sentence states what the notes add up to. */
const fromNotesBank: readonly WritingItem[] = [
  {
    task: "Turn these notes into a paragraph about why the school garden is useful.",
    source: "grows beans and tomatoes for lunch; students learn how plants grow; a quiet place to read at break",
    model:
      "Our school garden is useful in more ways than one. It grows beans and tomatoes that the kitchen serves at lunch. Students also learn how plants grow by caring for them. At break, it is a quiet place to sit and read.",
  },
  {
    task: "Turn these notes into a paragraph about why bicycles are good for a town.",
    source: "no fumes; take up little space on the road; riders get exercise on the way to work",
    model:
      "Bicycles make a town a better place to live. Unlike cars, they give off no fumes, so the air stays cleaner. They take up little space, which keeps the roads clear. Riders also get exercise on their way to work.",
  },
  {
    task: "Turn these notes into a paragraph about why the library is a good place to study.",
    source: "quiet rooms; free computers and printers; librarians help find books",
    model:
      "The library is one of the best places to study. Its rooms are quiet, so it is easy to think. It has free computers and printers for homework. If you are stuck, the librarians will help you find the right book.",
  },
  {
    task: "Turn these notes into a paragraph about why dogs need daily walks.",
    source: "use up energy; stay at a healthy weight; meet other dogs and people",
    model:
      "Dogs need a walk every day. A walk uses up their energy, so they are calmer at home. It also keeps them at a healthy weight. On the way, they meet other dogs and people, which helps them stay friendly.",
  },
  {
    task: "Turn these notes into a paragraph about how a rainy day can be fun.",
    source: "board games with family; baking bread; jumping in puddles in boots",
    model:
      "A rainy day can be a lot of fun. My family plays board games at the kitchen table. Sometimes we bake bread and eat it warm. When the rain slows down, we put on our boots and jump in the puddles.",
  },
  {
    task: "Turn these notes into a paragraph about why breakfast matters.",
    source: "energy for the morning; easier to pay attention in class; less snacking before lunch",
    model:
      "Eating breakfast makes a real difference to the day. It gives you energy for the whole morning. With food in your body, it is easier to pay attention in class. You are also less likely to snack on sweets before lunch.",
  },
  {
    task: "Turn these notes into a paragraph about why trees are good for a street.",
    source: "shade in summer; homes for birds; roots hold the soil when it rains",
    model:
      "Trees do a lot of good on a street. In summer, they give shade, so the sidewalk stays cool. Birds build their nests in the branches. When it rains hard, the roots hold the soil in place.",
  },
  {
    task: "Turn these notes into a paragraph about why learning to swim is important.",
    source: "safer near rivers and pools; good exercise for the whole body; can join friends at the beach",
    model:
      "Everyone should learn to swim. A swimmer is much safer near rivers, lakes and pools. Swimming is also good exercise, because it works the whole body. And a swimmer can join friends at the beach instead of watching from the sand.",
  },
];

/** detailBank asks for a paragraph that backs its point with specific details, examples or facts. */
const detailBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph about a place you like to visit. Give at least one specific detail that shows why you like it.",
    model:
      "I love visiting my grandmother's farm. Every morning I help her collect eggs from the twelve hens in the barn. In the afternoon we pick apples from the old tree by the gate, and she turns them into a pie.",
  },
  {
    task: "Write a paragraph about a skill you have learned. Give at least one specific example of how you learned it.",
    model:
      "Last year I learned to ride a bike. At first I fell off every time I tried to turn. My older brother held the back of the seat and ran beside me down our street. After two weeks, I could ride all the way to the park alone.",
  },
  {
    task: "Write a paragraph about an animal you find interesting. Give at least one specific fact about it.",
    model:
      "Octopuses are some of the smartest animals in the sea. They can change the color of their skin in less than a second to hide from danger. Some have even learned to open jars to reach the food inside.",
  },
  {
    task: "Write a paragraph about a good friend. Give at least one specific example of something your friend did.",
    model:
      "My friend Sam is always kind to others. When a new student joined our class, Sam sat with her at lunch every day. He also showed her where the music room was and helped her with the math homework.",
  },
  {
    task: "Write a paragraph about your favorite season. Give at least one specific detail about it.",
    model:
      "Autumn is my favorite season. The trees on my street turn bright red and orange. On cool evenings, my family drinks hot cocoa on the porch and watches the leaves fall.",
  },
  {
    task: "Write a paragraph about a meal you enjoy. Give at least one specific detail about how it is made or eaten.",
    model:
      "My favorite meal is the soup my father makes on Sundays. He cooks carrots, onions and noodles in a big pot for two hours. We eat it with fresh bread, and there is always enough left for Monday's lunch.",
  },
  {
    task: "Write a paragraph about a time you helped someone. Give at least one specific detail about what you did.",
    model:
      "Last winter I helped my neighbor when the snow was deep. She is eighty years old and could not reach her car. I shoveled a path from her door to the street, and she gave me a cup of tea when I finished.",
  },
  {
    task: "Write a paragraph about a book or a story you enjoyed. Give at least one specific detail from it.",
    model:
      "I enjoyed a story about a girl who builds a boat. She uses old doors and a bedsheet for the sail. When a storm comes, she has to fix a hole in the boat while the waves splash over her.",
  },
];

/** fullBank asks for a whole paragraph: a topic sentence, details that support it, and a closing sentence. */
const fullBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph that explains why students should have time to play outside during the school day.",
    model:
      "Students should have time to play outside every school day. Running and climbing give their bodies exercise they cannot get at a desk. Fresh air helps them feel awake, and many teachers notice that classes are calmer after break. A little time outside makes the whole day go better.",
  },
  {
    task: "Write a paragraph that explains why it is good to have a pet.",
    model:
      "Having a pet is good for a family. A pet teaches children to be responsible, because it must be fed and cared for every day. Pets are also great company: my cat sits beside me when I do my homework. For these reasons, a pet can make a home happier.",
  },
  {
    task: "Write a paragraph that explains how to get ready for a test.",
    model:
      "Getting ready for a test takes a plan. First, start studying a few days early instead of the night before. Next, go over your notes and practice the problems you found hardest. Finally, get a good night's sleep. If you follow these steps, you will feel calm on the day of the test.",
  },
  {
    task: "Write a paragraph that explains why people should recycle.",
    model:
      "People should recycle whatever they can. Recycling paper means fewer trees have to be cut down. Glass and metal can be melted and used again, so less of them ends up buried in the ground. When everyone recycles, we waste less and keep our land cleaner.",
  },
  {
    task: "Write a paragraph that explains why reading every day is a good habit.",
    model:
      "Reading every day is a habit worth having. Each book teaches you new words, so your writing improves. Stories also let you see the world through other people's eyes. Even twenty minutes a day can make you a better reader, writer and thinker.",
  },
  {
    task: "Write a paragraph that explains what makes a good teammate.",
    model:
      "A good teammate thinks about the whole team. In a soccer game, a good teammate passes the ball to a player who is open instead of always trying to score. A good teammate also cheers for others after a mistake. In the end, teams with players like this usually play better together.",
  },
  {
    task: "Write a paragraph that explains why it helps to keep your room tidy.",
    model:
      "Keeping your room tidy makes life easier. When everything has its place, you can find your shoes and books quickly in the morning. A clean floor is also safer, because there is nothing to trip over. A few minutes of tidying each day saves a lot of time later.",
  },
  {
    task: "Write a paragraph that explains why families should eat dinner together.",
    model:
      "Families should try to eat dinner together. At the table, everyone can share what happened during the day. Children learn to listen and take turns speaking. Even a short meal together each evening helps a family stay close.",
  },
];

/** opinionBank asks for a paragraph that states an opinion and backs it with reasons. */
const opinionBank: readonly WritingItem[] = [
  {
    task: "Should every school have a library? Write a paragraph that gives your opinion and at least two reasons.",
    model:
      "Every school should have a library. A library gives students books they might not have at home. It is also a quiet place to study and do research. For these reasons, a school without a library is missing something important.",
  },
  {
    task: "Is it better to have a cat or a dog? Write a paragraph that gives your opinion and at least two reasons.",
    model:
      "I think a dog is a better pet than a cat. A dog gets you outside, because it needs a walk every day. Dogs can also learn tricks and play games such as fetch. That is why a dog makes the best friend.",
  },
  {
    task: "Should students wear uniforms to school? Write a paragraph that gives your opinion and at least two reasons.",
    model:
      "Students should not have to wear uniforms. Choosing their own clothes lets students show who they are. Uniforms can also cost families extra money, since they are only worn at school. Students can dress well without being told exactly what to wear.",
  },
  {
    task: "Is summer or winter the better season? Write a paragraph that gives your opinion and at least two reasons.",
    model:
      "Summer is the better season. The days are long, so there is more time to play outside after dinner. There is no school, which means families can travel together. Winter has its fun, but summer gives us more freedom.",
  },
  {
    task: "Should children learn to cook? Write a paragraph that gives your opinion and at least two reasons.",
    model:
      "Every child should learn to cook. Cooking teaches you to measure, follow steps and be careful with heat. It also means you can make a healthy meal for yourself instead of eating snacks. Learning to cook is a skill you will use for the rest of your life.",
  },
  {
    task: "Is it better to read a book or watch the movie of it? Write a paragraph that gives your opinion and at least two reasons.",
    model:
      "Reading the book is better than watching the movie. A book has room for more of the story, so you learn what the characters think. When you read, you also picture the places in your own way. The movie can be fun, but the book usually tells the whole story.",
  },
  {
    task: "Should our town build a new park or a new swimming pool? Write a paragraph that gives your opinion and at least two reasons.",
    model:
      "Our town should build a new park. A park is free, so every family can use it. It can be enjoyed all year, while a pool is closed for most of the winter. A park would bring the most people together.",
  },
  {
    task: "Should students have homework on weekends? Write a paragraph that gives your opinion and at least two reasons.",
    model:
      "Students should not get homework on weekends. Weekends are a time to rest, so students come back to school ready to learn. They also need time for sports, hobbies and their families. A free weekend makes for a better school week.",
  },
];

/** stepsBank asks for a paragraph that explains how to do something, step by step. */
const stepsBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph that explains how to make a sandwich.",
    model:
      "Making a sandwich is easy if you follow a few steps. First, take two slices of bread and lay them on a plate. Next, spread butter or mayonnaise on one side of each slice. Then add cheese, lettuce and tomato to one slice. Finally, put the other slice on top and cut the sandwich in half.",
  },
  {
    task: "Write a paragraph that explains how to plant a seed.",
    model:
      "Planting a seed takes only a few minutes. First, fill a small pot with soil. Next, push a hole into the soil about as deep as your fingertip. Then drop the seed into the hole and cover it gently. Finally, water the soil and put the pot in a sunny window.",
  },
  {
    task: "Write a paragraph that explains how to brush your teeth.",
    model:
      "Brushing your teeth well keeps them healthy. First, wet your toothbrush and squeeze on a small amount of toothpaste. Next, brush the front, back and top of every tooth in small circles. After two minutes, spit out the toothpaste and rinse your mouth with water. Finally, rinse your brush and put it away to dry.",
  },
  {
    task: "Write a paragraph that explains how to wrap a present.",
    model:
      "You can wrap a present in a few simple steps. First, place the box upside down on a sheet of wrapping paper. Next, cut the paper so it is big enough to cover all sides. Then fold the paper around the box and tape it closed. Last, fold in the ends, tape them down, and add a bow on top.",
  },
  {
    task: "Write a paragraph that explains how to get ready for school in the morning.",
    model:
      "A good morning routine makes it easy to get to school on time. First, get out of bed as soon as the alarm rings. Then wash your face, brush your teeth and get dressed. After that, eat a healthy breakfast. Finally, check that your homework is in your bag before you leave.",
  },
  {
    task: "Write a paragraph that explains how to make a paper airplane.",
    model:
      "Making a paper airplane takes just one sheet of paper. First, fold the paper in half the long way and open it again. Next, fold the two top corners down to the middle line. Then fold the new edges to the middle once more. Finally, fold the plane in half, fold down the wings, and it is ready to fly.",
  },
  {
    task: "Write a paragraph that explains how to wash your hands properly.",
    model:
      "Washing your hands the right way stops germs from spreading. First, wet your hands under clean running water. Next, rub soap over your palms, the backs of your hands and between your fingers for twenty seconds. Then rinse off all the soap. Finally, dry your hands with a clean towel.",
  },
  {
    task: "Write a paragraph that explains how to care for a goldfish.",
    model:
      "Caring for a goldfish is simple but takes some attention. First, keep the fish in a large tank with clean water, not a small bowl. Next, feed it a pinch of fish food once or twice a day. Every week, change part of the water so it stays fresh. If you follow these steps, your goldfish can live for many years.",
  },
];

const notesCriteria = ["w4-topic-sentence", "w4-supports-point", "w4-answers-prompt"];
const detailCriteria = ["w4-topic-sentence", "w4-gives-detail", "w4-answers-prompt"];
const fullCriteria = ["w4-topic-sentence", "w4-supports-point", "w4-gives-detail", "w4-concludes"];
const reasonsCriteria = ["w4-states-opinion", "w4-gives-reasons", "w4-answers-prompt"];
const opinionCriteria = ["w4-states-opinion", "w4-gives-reasons", "w4-supports-point", "w4-concludes"];
const stepsCriteria = ["w4-topic-sentence", "w4-in-order", "w4-uses-transitions", "w4-answers-prompt"];

/**
 * judgedParagraphTopics are the paragraphs a learner writes, judged by a model
 * against yes-or-no criteria. A learner for whom no route qualifies does not get them.
 */
export const judgedParagraphTopics: readonly TopicDef[] = [
  {
    id: "writing-a-paragraph",
    title: t("Writing a Paragraph", "写一个段落"),
    summary: t(
      "Write paragraphs of your own: a topic sentence, details that support it, and a closing sentence.",
      "自己动笔写段落：主题句、支持它的细节和结尾句。",
    ),
    prerequisites: ["removing-off-topic-sentences", "choosing-transitions"],
    encompasses: [
      { topic: "identifying-topic-sentences", weight: 0.5 },
      { topic: "removing-off-topic-sentences", weight: 0.3 },
    ],
    xp: 20,
    criteria: [...new Set([...notesCriteria, ...detailCriteria, ...fullCriteria])].map(criterion),
    knowledgePoints: [
      point(
        "from-notes",
        t("From Notes to a Paragraph", "把笔记写成段落"),
        t(
          "Notes list facts; a paragraph makes a point with them. Before you write, ask what the notes add up to, and say that in your first sentence: that is the **topic sentence**. Then turn each note into a full sentence that supports it.\n\nNotes: *rain all week; the river rose; the bridge closed*. Topic sentence: *The storm caused trouble across town.* Each note then becomes a sentence that shows the trouble.",
          "笔记罗列事实；段落用事实来说明一个观点。动笔之前先想一想：这些笔记合起来说明了什么？把它写成第一句，这就是**主题句**（topic sentence）。然后把每条笔记写成支持它的完整句子。\n\n笔记：*rain all week; the river rose; the bridge closed*。主题句：*The storm caused trouble across town.* 接着每条笔记都写成一个说明这些麻烦的句子。",
        ),
        writingGenerator(
          t(
            "Write a paragraph in English. Open with a topic sentence, then use every note to support it.",
            "用英语写一个段落。以主题句开头，再用每一条笔记来支持它。",
          ),
          fromNotesBank,
          notesCriteria,
          { minWords: 25, maxChars: 1200 },
          (model) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`),
        ),
      ),
      point(
        "specific-details",
        t("Giving Specific Details", "给出具体细节"),
        t(
          "A point is believed when it is shown. General words such as *nice*, *fun* or *good* tell the reader little; a specific detail, example or fact shows them. *The park is fun* is general. *The park has a zip line that runs over the pond* is specific.\n\nAfter your topic sentence, give at least one detail the reader could picture or check.",
          "观点要靠展示才能让人信服。*nice*、*fun*、*good* 这样笼统的词告诉读者的很少；具体的细节、例子或事实才能展示观点。*The park is fun* 是笼统的说法，*The park has a zip line that runs over the pond* 才具体。\n\n在主题句之后，至少给出一个读者能想象出来或能核实的细节。",
        ),
        writingGenerator(
          t(
            "Write a paragraph in English. Open with a topic sentence and support it with specific details.",
            "用英语写一个段落。以主题句开头，用具体细节来支持它。",
          ),
          detailBank,
          detailCriteria,
          { minWords: 30, maxChars: 1200 },
          (model) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`),
        ),
      ),
      point(
        "closing-sentence",
        t("Closing the Paragraph", "写好结尾句"),
        t(
          "A paragraph that stops after its last detail feels cut off. A **closing sentence** brings the reader back to the point: it sums it up, or says why it matters, in new words rather than repeating the topic sentence.\n\nTopic sentence: *Our town needs a new library.* Closing sentence: *A new library would give everyone in town a place to learn.*",
          "一个段落在最后一个细节后戛然而止，会显得没有写完。**结尾句**（closing sentence）把读者带回要点：用新的说法总结要点或说明它为何重要，而不是重复主题句。\n\n主题句：*Our town needs a new library.* 结尾句：*A new library would give everyone in town a place to learn.*",
        ),
        writingGenerator(
          t(
            "Write a paragraph in English with a topic sentence, details that support it, and a closing sentence.",
            "用英语写一个段落，包括主题句、支持它的细节和结尾句。",
          ),
          fullBank,
          fullCriteria,
          { minWords: 35, maxChars: 1500 },
          (model) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`),
        ),
      ),
    ],
  },
  {
    id: "writing-an-opinion-paragraph",
    title: t("Writing an Opinion Paragraph", "写观点段落"),
    summary: t(
      "State what you think in the first sentence, back it with reasons, and close by bringing the reader back to your opinion.",
      "在第一句说出你的看法，用理由支持它，结尾再把读者带回你的观点。",
    ),
    prerequisites: ["writing-a-paragraph"],
    encompasses: [{ topic: "writing-a-paragraph", weight: 0.4 }],
    xp: 20,
    criteria: [...new Set([...reasonsCriteria, ...opinionCriteria])].map(criterion),
    knowledgePoints: [
      point(
        "opinion-and-reasons",
        t("An Opinion and Its Reasons", "观点和理由"),
        t(
          "An **opinion** is what you think, and other people may think differently: *Dogs make better pets than cats.* State it plainly in your first sentence, so the reader knows where you stand.\n\nThen give **reasons**: why do you think so? Each reason should be different. *Dogs are fun* and *Dogs are enjoyable* are one reason said twice. *Dogs get you outside every day* and *Dogs can learn tricks* are two.",
          "**观点**（opinion）是你的看法，别人可能看法不同：*Dogs make better pets than cats.* 在第一句就明确说出来，让读者知道你的立场。\n\n然后给出**理由**（reason）：你为什么这样想？每条理由应当不同。*Dogs are fun* 和 *Dogs are enjoyable* 是同一条理由说了两遍；*Dogs get you outside every day* 和 *Dogs can learn tricks* 才是两条。",
        ),
        writingGenerator(
          t(
            "Write a paragraph in English. State your opinion in the first sentence, then give at least two different reasons.",
            "用英语写一个段落。在第一句说出你的观点，再给出至少两条不同的理由。",
          ),
          opinionBank,
          reasonsCriteria,
          { minWords: 30, maxChars: 1200 },
          (model) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`),
        ),
      ),
      point(
        "closing-an-opinion",
        t("Closing an Opinion Paragraph", "观点段落的结尾"),
        t(
          "An opinion paragraph ends by bringing the reader back to the opinion, now that the reasons have been given. Use new words rather than copying the first sentence, and words such as *For these reasons* or *That is why* can lead into it.\n\nOpinion: *Every school should have a garden.* Closing: *For these reasons, a garden is worth the space it takes.*\n\nKeep every sentence on your opinion: a sentence about something else weakens the paragraph.",
          "观点段落在给出理由之后，结尾要把读者带回观点。用新的说法，而不是照抄第一句；可以用 *For these reasons* 或 *That is why* 这样的词引出结尾。\n\n观点：*Every school should have a garden.* 结尾：*For these reasons, a garden is worth the space it takes.*\n\n每个句子都要围绕你的观点：写别的事情的句子会削弱段落。",
        ),
        writingGenerator(
          t(
            "Write a paragraph in English that states your opinion, supports it with at least two reasons, and ends with a closing sentence.",
            "用英语写一个段落：说出你的观点，用至少两条理由支持它，并以结尾句收束。",
          ),
          opinionBank,
          opinionCriteria,
          { minWords: 35, maxChars: 1500 },
          (model) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`),
        ),
      ),
    ],
  },
  {
    id: "writing-a-how-to-paragraph",
    title: t("Writing a How-To Paragraph", "写操作步骤段落"),
    summary: t(
      "Explain how to do something: name the task, give the steps in order, and connect them with transitions.",
      "说明怎样做一件事：点明任务，按顺序写出步骤，并用过渡词把它们连接起来。",
    ),
    prerequisites: ["writing-a-paragraph"],
    encompasses: [
      { topic: "writing-a-paragraph", weight: 0.3 },
      { topic: "ordering-sentences-in-a-paragraph", weight: 0.3 },
      { topic: "choosing-transitions", weight: 0.2 },
    ],
    xp: 20,
    criteria: stepsCriteria.map(criterion),
    knowledgePoints: [
      point(
        "steps-in-order",
        t("Steps in Order", "按顺序写步骤"),
        t(
          "A how-to paragraph opens by naming the task: *Planting a seed takes only a few minutes.* Then it gives the steps in the order the reader must do them. A step out of order can spoil the task: you cannot water a seed you have not planted yet.\n\n**Transitions** show the reader where each step begins: *first*, *next*, *then*, *after that*, *finally*.",
          "操作步骤段落开头先点明任务：*Planting a seed takes only a few minutes.* 然后按读者要做的顺序写出步骤。步骤顺序错了，事情就可能做不成：种子还没种下，就没法浇水。\n\n**过渡词**（transition）告诉读者每一步从哪里开始：*first*、*next*、*then*、*after that*、*finally*。",
        ),
        writingGenerator(
          t(
            "Write a paragraph in English. Name the task in the first sentence, then give the steps in order with transition words.",
            "用英语写一个段落。在第一句点明任务，再用过渡词按顺序写出步骤。",
          ),
          stepsBank,
          stepsCriteria,
          { minWords: 35, maxChars: 1500 },
          (model) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`),
        ),
      ),
    ],
  },
];
