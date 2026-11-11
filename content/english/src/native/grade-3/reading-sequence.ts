// Grade 3: reading a timeline, following the steps of a procedure, and comparing two texts on one topic.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { type Arrange, type Ask, arrangeGenerator, askGenerator, need, rows, topic } from "./kit.ts";

/** Timeline is a list of events with their years; years before the Common Era are negative. */
interface Timeline {
  readonly title: string;
  readonly events: readonly (readonly [year: number, event: string])[];
}

const timelines: readonly Timeline[] = [
  {
    title: "People in the Air",
    events: [
      [1783, "A hot-air balloon carries people into the sky."],
      [1903, "The Wright brothers fly the first airplane."],
      [1927, "A pilot flies alone across the Atlantic Ocean."],
      [1969, "Astronauts walk on the Moon."],
      [1981, "The first space shuttle is launched."],
    ],
  },
  {
    title: "Ancient Egypt",
    events: [
      [-3100, "Upper and Lower Egypt join as one kingdom."],
      [-2560, "The Great Pyramid of Giza is finished."],
      [-1550, "The New Kingdom begins."],
      [-1332, "Tutankhamun becomes king."],
      [-30, "Egypt becomes part of the Roman Empire."],
    ],
  },
  {
    title: "Inventions in the Home",
    events: [
      [1876, "The first telephone call is made."],
      [1879, "A light bulb that lasts for hours is made."],
      [1927, "The first television picture is sent."],
      [1947, "The first microwave oven is sold."],
      [1973, "The first call on a handheld mobile phone is made."],
    ],
  },
  {
    title: "Ancient China",
    events: [
      [-1600, "The Shang dynasty begins."],
      [-1046, "The Zhou dynasty begins."],
      [-551, "Confucius is born."],
      [-221, "The Qin state unites China."],
      [-202, "The Han dynasty begins."],
    ],
  },
  {
    title: "The Story of Riverton",
    events: [
      [1850, "Families build the first houses of Riverton."],
      [1872, "Riverton's first school opens."],
      [1901, "The railway reaches the town."],
      [1925, "The town library opens."],
      [1990, "A new bridge is built across the river."],
    ],
  },
  {
    title: "Ancient Greece and Rome",
    events: [
      [-776, "The first Olympic Games are held in Greece."],
      [-753, "The city of Rome is founded, the old stories say."],
      [-490, "The Greeks win the battle of Marathon."],
      [-432, "The Parthenon temple in Athens is finished."],
      [-27, "Augustus becomes the first Roman emperor."],
    ],
  },
  {
    title: "Recorded Music",
    events: [
      [1877, "Edison records a voice on a machine for the first time."],
      [1948, "Long-playing records go on sale."],
      [1963, "The cassette tape is invented."],
      [1979, "The first pocket cassette player goes on sale."],
      [1982, "CDs go on sale."],
    ],
  },
];

const yearText = (y: number) => (y < 0 ? `${-y} BCE` : `${y}`);
const showTimeline = (tl: Timeline) => [`**${tl.title}**`, "", ...tl.events.map(([y, e]) => `- ${yearText(y)}: ${e}`)].join("\n");
const bare = (e: string) => e.replace(/\.$/, "");

const firstBank: readonly Ask[] = timelines.flatMap((tl) =>
  (
    [
      [0, 1],
      [3, 1],
      [2, 4],
      [3, 0],
      [1, 4],
      [2, 0],
    ] as const
  ).map(([i, j]): Ask => {
    const [ya, ea] = tl.events[i] ?? [0, ""];
    const [yb, eb] = tl.events[j] ?? [0, ""];
    const [early, late, ye, yl] = ya < yb ? [ea, eb, ya, yb] : [eb, ea, yb, ya];
    const bce = ye < 0;
    return {
      question: t(`Which came first: “${bare(ea)}” or “${bare(eb)}”?`, `哪件事先发生：“${bare(ea)}”还是“${bare(eb)}”？`),
      shown: showTimeline(tl),
      right: early,
      wrong: [late, "They happened in the same year."],
      why: bce
        ? t(
            `${yearText(ye)} comes before ${yearText(yl)}: years before the Common Era count down, so the bigger number is earlier.`,
            `${yearText(ye)} 在 ${yearText(yl)} 之前：公元前的年份是倒着数的，所以数字越大越早。`,
          )
        : t(
            `${yearText(ye)} comes before ${yearText(yl)}: in years of the Common Era, the smaller number is earlier.`,
            `${yearText(ye)} 在 ${yearText(yl)} 之前：公元的年份数字越小越早。`,
          ),
      whyNot: [
        bce
          ? t(
              "That came later: in years BCE, the smaller number is later, because those years count down.",
              "这件事更晚：公元前的年份是倒着数的，数字越小越晚。",
            )
          : t(
              "That came later: its year is the bigger number, and later years have bigger numbers.",
              "这件事更晚：它的年份数字更大，越晚的年份数字越大。",
            ),
        t(
          "The two events have different years on the timeline, so they did not happen in the same year.",
          "时间线上两件事的年份不同，所以不是同一年发生的。",
        ),
      ],
    };
  }),
);

const apartBank: readonly Ask[] = timelines.flatMap((tl) =>
  (
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [0, 4],
    ] as const
  ).map(([i, j]): Ask => {
    const [ya, ea] = tl.events[i] ?? [0, ""];
    const [yb, eb] = tl.events[j] ?? [0, ""];
    const diff = Math.abs(yb - ya);
    const bce = ya < 0;
    const sum = Math.abs(ya) + Math.abs(yb);
    const wrong = bce ? [sum, diff + 10] : [diff + 10, diff > 10 ? diff - 10 : diff + 20];
    return {
      question: t(
        `How many years apart were these two events: “${bare(ea)}” and “${bare(eb)}”?`,
        `这两件事相隔多少年：“${bare(ea)}”和“${bare(eb)}”？`,
      ),
      shown: showTimeline(tl),
      right: `${diff} years`,
      wrong: wrong.map((n) => `${n} years`),
      why: t(
        `To find how far apart two events were, subtract the smaller year number from the bigger one: ${Math.max(Math.abs(ya), Math.abs(yb))} − ${Math.min(Math.abs(ya), Math.abs(yb))} = ${diff}.`,
        `要算出两件事相隔多久，就用较大的年份数减去较小的年份数：${Math.max(Math.abs(ya), Math.abs(yb))} − ${Math.min(Math.abs(ya), Math.abs(yb))} = ${diff}。`,
      ),
      whyNot: wrong.map((n) =>
        n === sum && bce
          ? t(
              "That adds the two years. Both are BCE, so subtract one from the other instead.",
              "这是把两个年份加起来了。两个都是公元前的年份，应该相减。",
            )
          : t(
              "That is off by ten or more; subtract the smaller year number from the bigger one again.",
              "这差了十年或更多；再用较大的年份数减一次较小的年份数。",
            ),
      ),
    };
  }),
);

// Procedures: the experiment|its four steps|the place of a step to skip, from 0|what goes wrong without it.

const procedureRows = rows(`
  Growing a Bean in a Bag|Wet a paper towel.|Put a bean on the paper towel.|Seal the towel and the bean in a clear bag.|Tape the bag to a sunny window and check it each day.|0|The bean would stay dry and not sprout.
  Making a Rainbow|Fill a clear glass with water.|Set the glass in bright sunlight.|Put a sheet of white paper on the floor below it.|Look for the colors on the paper.|1|No rainbow would show on the paper.
  Floating and Sinking|Fill a tub with water.|Gather a coin, a cork, a leaf and a key.|Guess which ones will float.|Drop each one in and write down what it does.|2|There would be no guesses to check.
  Melting Ice|Put one ice cube in the sun and one in the shade.|Start a timer.|Check both cubes every five minutes.|Write down which one melted first.|1|You would not know how long each took to melt.
  Testing a Magnet|Gather a nail, a paper clip, a rubber band and a coin.|Hold a magnet near each object.|Sort them into a pile that was pulled and a pile that was not.|Write what the pulled objects have in common.|1|You would have nothing to sort them by.
  Changing a Sound|Stretch a rubber band around a box.|Pluck it and listen.|Stretch it tighter and pluck it again.|Compare the two sounds.|2|There would be only one sound to compare.
  How Plants Drink|Put water in a glass and add red food coloring.|Cut the end of a celery stalk.|Stand the celery in the red water.|Check the leaves the next day.|0|You could not see the water move up the stalk.
  Racing Down a Ramp|Build a ramp with a board and a pile of books.|Mark a starting line at the top.|Let a toy car roll down from the line.|Measure how far it rolls past the ramp.|1|Each car might start in a different place.
  Dissolving Sugar|Pour warm water into one cup and cold water into another.|Add one spoon of sugar to each cup.|Stir each cup ten times.|See which cup's sugar disappears first.|1|There would be no sugar to dissolve.
  Tracking a Shadow|Stand a stick in the ground on a sunny morning.|Mark the end of its shadow with a stone.|Come back every hour and mark the shadow again.|Look at how the marks have moved.|2|You could not see the shadow move.
  Drying Puddles|Pour the same amount of water into two dishes.|Put one dish in the sun and one in a dark cupboard.|Wait for two days.|Measure the water left in each dish.|0|The dishes would start out different.
  Air Takes Up Space|Push a paper towel into the bottom of a cup.|Turn the cup upside down.|Push it straight down into a bowl of water.|Lift it out and feel the paper towel.|1|Water would pour in and soak the towel.
  Making a Compass|Rub a needle along a magnet twenty times in one direction.|Push the needle through a small piece of cork.|Float the cork in a bowl of water.|Watch which way the needle points.|0|The needle would not point north.
  Testing Paper Towels|Cut a square from each of three kinds of paper towel.|Pour one spoon of water onto a plate for each square.|Lay a square on each puddle.|See which square soaks up the most water.|1|There would be no water to soak up.
  Jumping Paper|Blow up a balloon and tie it.|Rub the balloon on a wool sweater.|Hold it near tiny bits of paper.|Watch what the paper does.|1|The paper would not jump to the balloon.
  Mixing Colors|Put a spoon of yellow paint on a plate.|Put a spoon of blue paint beside it.|Mix the two together with a brush.|Write down the new color you see.|1|No new color would appear.
  A Boat of Foil|Fold a sheet of foil into a small boat.|Float it in a tub of water.|Add pennies one at a time.|Count how many it holds before it sinks.|1|You could not see how many pennies it holds.
  Moldy Bread|Put one slice of bread in a bag in a warm place.|Put another slice in a bag in the fridge.|Check both slices every day for a week.|Compare how much mold grew on each.|1|There would be nothing to compare with.
  Do Seeds Need Water?|Plant beans in two cups of soil.|Water one cup every day and leave the other dry.|Put both cups on a sunny windowsill.|Compare the cups after a week.|1|You could not learn what water does.
  A Swinging Washer|Tie a washer to the end of a string.|Hold the other end of the string still.|Pull the washer to one side and let go.|Count how many swings it makes in ten seconds.|2|The washer would hang still.
  Bouncing Balls|Stand a meter stick against a wall.|Drop a ball from the top of the stick.|Watch how high it bounces.|Write down the height and try another ball.|0|You could not measure the bounce.
  Growing Salt Crystals|Stir salt into a jar of hot water until no more dissolves.|Tie a string to a pencil.|Lay the pencil across the jar so the string hangs in the water.|Wait a week and look for crystals on the string.|0|No crystals would grow on the string.
  Which Way the Wind Blows|Tie a ribbon to the end of a stick.|Take it outside on a windy day.|Hold the stick up high.|Use a compass to see which way the ribbon points.|3|You would not know the wind's direction.
  Where Worms Like to Live|Put damp soil in one half of a tray and dry sand in the other.|Place five worms in the middle.|Cover the tray and wait ten minutes.|Count the worms on each side.|0|The worms would have nothing to choose.
  What Lets Light Through|Shine a flashlight at a wall in a dark room.|Hold a piece of glass in front of the light.|Hold wax paper, and then a book, in front of it.|Sort the objects by how much light got through.|0|There would be no light to block.
  Cleaning Muddy Water|Cut the bottom off a plastic bottle and turn it upside down.|Fill it with layers of gravel, sand and cotton.|Pour muddy water in at the top.|Compare the water that drips out with the muddy water.|1|The water would come out just as muddy.
  Which Spoon Gets Hot|Put a pat of butter on a metal, a wooden and a plastic spoon.|Stand the spoons in a cup of hot water.|Wait five minutes.|See which spoon's butter melted first.|1|The butter would not melt on any spoon.
  Paper Planes|Fold one plane with wide wings and one with narrow wings.|Stand behind the same line.|Throw each plane with the same strength.|Measure how far each one flies.|1|The planes might start in different places.
  Washing Away a Hill|Build two hills of sand on a tray.|Press small stones into one hill.|Pour a cup of water slowly over each hill.|Compare how much sand washed away.|1|You could not see what the stones do.
  A Fizzing Cup|Put a spoon of baking soda in a cup.|Set the cup in a tray.|Pour in some vinegar.|Watch the foam bubble up and out.|0|The vinegar would not foam.
`);

const procedures = procedureRows.map((row) => {
  const [title = "", s0 = "", s1 = "", s2 = "", s3 = "", skip = "", result = ""] = need(row, 7);
  return { title, steps: [s0, s1, s2, s3], skip: Number(skip), result };
});

const procedureOrderBank: readonly Arrange[] = procedures.map((p) => ({
  question: t(`Put the steps of this experiment in order: ${p.title}.`, `把这个实验的步骤按顺序排列：${p.title}。`),
  shown: "",
  steps: p.steps,
  why: t(
    `The right order is: ${p.steps.join(" ")} Each step gets things ready for the next one.`,
    `正确的顺序是：${p.steps.join(" ")} 每一步都为下一步做好准备。`,
  ),
}));

const nothing = "Nothing; the experiment would work the same.";
const slower = "The experiment would only take a little longer.";

const skipBank: readonly Ask[] = procedures.map((p) => {
  const step = p.steps[p.skip] ?? "";
  return {
    question: t(`What would go wrong if you skipped this step: “${step}”`, `如果跳过这一步，会出什么问题：“${step}”`),
    shown: p.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
    right: p.result,
    wrong: [nothing, slower],
    why: t(
      `Without this step, the experiment fails: ${p.result} Each step of a procedure has a job that later steps depend on.`,
      `没有这一步，实验就会失败：${p.result} 步骤中的每一步都有自己的作用，后面的步骤要依靠它。`,
    ),
    whyNot: [
      t("Every step of a procedure has a job, so skipping one changes what happens.", "步骤中的每一步都有作用，跳过一步就会改变结果。"),
      t(
        "Skipping a step does not just slow things down; the later steps cannot do their job without it.",
        "跳过一步不只是让实验变慢；没有它，后面的步骤就无法起作用。",
      ),
    ],
  };
});

/** TextPair is two short texts of facts on one topic and the points they make. */
interface TextPair {
  readonly topic: string;
  readonly a: string;
  readonly b: string;
  readonly shared: readonly [string, string];
  readonly onlyA: string;
  readonly onlyB: string;
  readonly neither: string;
}

const textPairs: readonly TextPair[] = [
  {
    topic: "Honeybees",
    a: "Honeybees live in hives with thousands of other bees. Worker bees fly from flower to flower to collect nectar. Back at the hive, they turn the nectar into honey.",
    b: "Bees are important to farmers. As a bee collects nectar, yellow pollen sticks to its body. When it visits the next flower, some pollen rubs off, and this helps the plant make fruit. Bees also turn nectar into honey.",
    shared: ["Bees collect nectar from flowers.", "Bees make honey from nectar."],
    onlyA: "A hive holds thousands of bees.",
    onlyB: "Bees help plants make fruit.",
    neither: "Bees sleep through the winter.",
  },
  {
    topic: "Volcanoes",
    a: "A volcano is an opening in the earth's crust. Deep underground, rock gets so hot that it melts. When the melted rock pushes up and out, the volcano erupts, and lava flows down its sides.",
    b: "Lava is melted rock from deep inside the earth, and it pours out when a volcano erupts. When lava cools, it turns into new rock. Over many years, that rock breaks down into rich soil, and farmers grow crops on it.",
    shared: ["Lava is melted rock from inside the earth.", "Lava comes out when a volcano erupts."],
    onlyA: "A volcano is an opening in the crust.",
    onlyB: "Old lava can become rich soil.",
    neither: "Volcanoes are found only in cold places.",
  },
  {
    topic: "Penguins",
    a: "Penguins are birds, but they cannot fly. Their wings work like flippers, and they are fast swimmers. Emperor penguins live in Antarctica, the coldest place on Earth.",
    b: "Penguins spend much of their lives in the sea, where they catch fish. Their wings have become flippers that push them through the water. Some penguins live on warm beaches in Africa.",
    shared: ["Penguins use their wings as flippers.", "Penguins are good swimmers."],
    onlyA: "Emperor penguins live in Antarctica.",
    onlyB: "Some penguins live in Africa.",
    neither: "Penguins build nests in trees.",
  },
  {
    topic: "Recycling",
    a: "Recycling turns old things into new ones. Used paper can be made into new paper, and old cans can become new cans. When paper is recycled, fewer trees are cut down.",
    b: "When we recycle, less trash goes to the dump. Glass bottles can be melted and made into new bottles, and old paper becomes new paper. Many towns collect recycling every week.",
    shared: ["Old paper can be made into new paper.", "Recycling turns old things into new ones."],
    onlyA: "Recycling paper saves trees.",
    onlyB: "Many towns collect recycling weekly.",
    neither: "Recycling costs nothing at all.",
  },
  {
    topic: "Sharks",
    a: "Sharks have lived in the oceans for millions of years. They have no bones; their skeletons are made of cartilage, the same bendy stuff that is in your ears. Sharks lose teeth often, but new ones grow in.",
    b: "A shark can grow thousands of teeth in its life, because new teeth keep moving forward to replace the ones it loses. Sharks can smell blood in the water from far away. Their skeletons are made of cartilage, not bone.",
    shared: ["Sharks have skeletons of cartilage.", "Sharks grow new teeth to replace lost ones."],
    onlyA: "Sharks have lived for millions of years.",
    onlyB: "Sharks smell blood from far away.",
    neither: "Sharks breathe air like whales.",
  },
  {
    topic: "The Moon",
    a: "The Moon travels around the Earth about once a month. It does not make its own light; it shines with light from the Sun. Astronauts first walked on the Moon in 1969.",
    b: "From Earth, the Moon seems to change shape over a month, from a thin curve to a full circle. This happens because we see different parts of its side that the Sun lights up. The Moon has no air or water.",
    shared: ["The Moon is lit by the Sun.", "The Moon's cycle takes about a month."],
    onlyA: "Astronauts walked on the Moon in 1969.",
    onlyB: "The Moon has no air or water.",
    neither: "The Moon is bigger than the Earth.",
  },
  {
    topic: "Frogs",
    a: "Frogs begin life as eggs laid in water. The eggs hatch into tadpoles, which swim with their tails. Grown frogs can breathe through their skin.",
    b: "A tadpole slowly changes into a frog: it grows legs, and its tail shrinks away. Grown frogs catch insects with long, sticky tongues. Frogs lay their eggs in ponds and streams.",
    shared: ["Frogs lay their eggs in water.", "Young frogs are tadpoles with tails."],
    onlyA: "Frogs can breathe through their skin.",
    onlyB: "Frogs catch insects with their tongues.",
    neither: "Frogs live only in deserts.",
  },
  {
    topic: "Rainforests",
    a: "Rainforests are warm, wet forests where it rains almost every day. More kinds of plants and animals live there than anywhere else on land. Many medicines come from rainforest plants.",
    b: "The tallest rainforest trees grow higher than a fifteen-story building. Below them, monkeys, frogs and birds live among the leaves. Rainforests get more rain than most places on Earth.",
    shared: ["Rainforests get a lot of rain.", "Many animals live in rainforests."],
    onlyA: "Many medicines come from rainforests.",
    onlyB: "Some rainforest trees are very tall.",
    neither: "Rainforests are covered with snow.",
  },
  {
    topic: "Healthy Teeth",
    a: "Brushing your teeth twice a day keeps them healthy. Brushing removes bits of food and the germs that make holes in teeth. Children should visit a dentist twice a year.",
    b: "Sugary food and drinks feed the germs that make holes in teeth. Brushing in the morning and at night washes those germs away. Drinking water instead of soda helps, too.",
    shared: ["Brushing twice a day keeps teeth healthy.", "Germs make holes in teeth."],
    onlyA: "Children should see a dentist twice a year.",
    onlyB: "Sugar feeds the germs that harm teeth.",
    neither: "Teeth grow back every year.",
  },
  {
    topic: "Butterflies",
    a: "A butterfly starts as an egg on a leaf. A caterpillar hatches and eats and eats. Then it forms a hard case called a chrysalis, and inside it, it changes into a butterfly.",
    b: "Monarch butterflies fly thousands of miles south each autumn to stay warm. Before they can fly, they spend weeks as caterpillars, munching on milkweed leaves. Then each one changes inside a chrysalis.",
    shared: ["Butterflies begin life as caterpillars.", "A caterpillar changes inside a chrysalis."],
    onlyA: "Butterfly eggs are laid on leaves.",
    onlyB: "Monarchs fly south each autumn.",
    neither: "Butterflies live for a hundred years.",
  },
  {
    topic: "Wind",
    a: "Wind is moving air. When the sun warms the land, warm air rises, and cooler air rushes in to take its place. Wind can turn the blades of a tall turbine to make electricity.",
    b: "People have used the wind for thousands of years. It pushes sailing ships across the sea, and today wind turbines turn it into electricity. Wind is simply air on the move.",
    shared: ["Wind is moving air.", "Wind can be used to make electricity."],
    onlyA: "Wind starts when the sun warms the land.",
    onlyB: "Wind pushes sailing ships.",
    neither: "Wind blows only at night.",
  },
  {
    topic: "Trees",
    a: "Trees make oxygen, the gas we breathe. Their roots hold soil in place so that rain does not wash it away. A tree's age can be told by counting the rings in its trunk.",
    b: "Trees give homes to birds, squirrels and insects. Their leaves make oxygen from sunlight, air and water. Without trees, rain would wash away much more soil.",
    shared: ["Trees make oxygen.", "Trees keep soil from washing away."],
    onlyA: "Rings in a trunk show a tree's age.",
    onlyB: "Trees are homes for animals.",
    neither: "Trees grow best in the dark.",
  },
  {
    topic: "The Pyramids",
    a: "The pyramids of Egypt were built as tombs for kings. The Great Pyramid took about twenty years to build. Teams of workers moved huge stone blocks with ramps and sleds.",
    b: "Thousands of workers built the pyramids. They were not slaves but paid workers, who were given bread and beer. Each pyramid was a tomb for a king, called a pharaoh.",
    shared: ["The pyramids were tombs for kings.", "Many workers built the pyramids."],
    onlyA: "The Great Pyramid took about twenty years.",
    onlyB: "Workers were paid in bread and beer.",
    neither: "The pyramids were built in one week.",
  },
  {
    topic: "Dogs' Noses",
    a: "Dogs have a much better sense of smell than people do. A dog's nose can find a person lost in deep snow. Dogs can also hear sounds too high for us to hear.",
    b: "A dog's nose has millions more smell sensors than a human nose. Some dogs work at airports, sniffing bags for things that should not be there. Dogs use their noses to learn about the world.",
    shared: ["Dogs smell far better than people.", "Dogs' noses help people find things."],
    onlyA: "Dogs hear very high sounds.",
    onlyB: "Some dogs work at airports.",
    neither: "Dogs see more colors than people.",
  },
  {
    topic: "Snow",
    a: "Snow forms when tiny drops of water in a cloud freeze into ice crystals. Every snowflake has six sides. As they fall, snowflakes often stick together into bigger flakes.",
    b: "No two snowflakes look exactly alike, but every one has six points. Each flake is made of ice crystals. Snow keeps plants and small animals warm by covering them like a blanket.",
    shared: ["Snowflakes have six sides.", "Snow is made of ice crystals."],
    onlyA: "Snowflakes stick together as they fall.",
    onlyB: "Snow keeps plants warm like a blanket.",
    neither: "Snow is made of salt.",
  },
  {
    topic: "The Great Wall",
    a: "The Great Wall of China was built to keep out armies from the north. It was built and rebuilt over hundreds of years. Soldiers lit fires in its towers to send warnings.",
    b: "The Great Wall is not one wall but many walls, joined together over a long time. Builders used earth, wood, brick and stone. Towers along the wall let guards see enemies coming.",
    shared: ["The wall was built over a long time.", "The wall had towers for guards."],
    onlyA: "Fires were lit to send warnings.",
    onlyB: "Builders used earth, wood and stone.",
    neither: "The wall was built in one year.",
  },
];

const showPair = (p: TextPair) => `**Text 1: ${p.topic}**\n${p.a}\n\n**Text 2: ${p.topic}**\n${p.b}`;

const bothBank: readonly Ask[] = textPairs.flatMap((p) =>
  p.shared.map(
    (point, i): Ask => ({
      question: t("Which key point do both texts make?", "两篇文章都提到了哪个要点？"),
      shown: showPair(p),
      right: point,
      wrong: [i === 0 ? p.onlyA : p.onlyB, p.neither],
      why: t(
        `Both texts say this: ${point} A point both texts make can be found in each of them, in its own words.`,
        `两篇文章都这样说：${point} 两篇都提到的要点，在每篇文章里都能找到，只是说法不同。`,
      ),
      whyNot: [
        t("Only one of the texts makes that point; the other one does not mention it.", "只有其中一篇文章提到了这一点；另一篇没有提到。"),
        t("Neither text says that; it is not a point of either one.", "两篇文章都没有这样说；它不是任何一篇的要点。"),
      ],
    }),
  ),
);

const onlyBank: readonly Ask[] = textPairs.flatMap((p): Ask[] => [
  {
    question: t("Which point does only Text 1 make?", "哪个要点只有第一篇文章提到？"),
    shown: showPair(p),
    right: p.onlyA,
    wrong: [p.shared[0], p.onlyB],
    why: t(
      `Only Text 1 says this: ${p.onlyA} Text 2 is about the same topic, but it adds other points instead.`,
      `只有第一篇这样说：${p.onlyA} 第二篇文章话题相同，但补充的是别的要点。`,
    ),
    whyNot: [
      t("Both texts make that point, so it is not one that only Text 1 makes.", "两篇文章都提到了这一点，所以它不是只有第一篇才有的要点。"),
      t("That point is in Text 2, not in Text 1.", "这个要点在第二篇文章里，不在第一篇里。"),
    ],
  },
  {
    question: t("Which point does only Text 2 make?", "哪个要点只有第二篇文章提到？"),
    shown: showPair(p),
    right: p.onlyB,
    wrong: [p.shared[1], p.onlyA],
    why: t(
      `Only Text 2 says this: ${p.onlyB} Text 1 is about the same topic, but it adds other points instead.`,
      `只有第二篇这样说：${p.onlyB} 第一篇文章话题相同，但补充的是别的要点。`,
    ),
    whyNot: [
      t("Both texts make that point, so it is not one that only Text 2 makes.", "两篇文章都提到了这一点，所以它不是只有第二篇才有的要点。"),
      t("That point is in Text 1, not in Text 2.", "这个要点在第一篇文章里，不在第二篇里。"),
    ],
  },
]);

/** sequenceTopics are the reading topics of grade 3 on timelines, procedures and two texts on one topic. */
export const sequenceTopics: readonly TopicDef[] = [
  topic(
    "reading-a-timeline",
    t("Reading a Timeline", "读时间线"),
    t(
      "A timeline lists events in the order of their dates, and the years before the Common Era count down.",
      "时间线按日期的先后列出事件，公元前的年份是倒着数的。",
    ),
    ["sequence-in-texts"],
    [
      point(
        "which-came-first",
        t("Which Came First", "哪件事先发生"),
        t(
          "A **timeline** lists events in order, from the earliest to the latest. In years of the Common Era, a smaller number is earlier: 1903 came before 1969.\n\nYears **before the Common Era**, written BCE, count down toward year 1, so there a bigger number is earlier: 2560 BCE came before 1550 BCE.",
          "**时间线**按从早到晚的顺序列出事件。公元的年份，数字越小越早：1903 年在 1969 年之前。\n\n**公元前**的年份写作 BCE，它们是朝着公元 1 年倒着数的，所以数字越大越早：公元前 2560 年在公元前 1550 年之前。",
        ),
        askGenerator(firstBank),
      ),
      point(
        "how-long-apart",
        t("How Long Apart", "相隔多久"),
        t(
          "To find how many years apart two events were, **subtract** the smaller year from the bigger one: from 1903 to 1969 is 1969 − 1903 = 66 years.\n\nWhen both years are BCE, subtract the same way, the smaller number from the bigger: from 1046 BCE to 551 BCE is 1046 − 551 = 495 years. Do not add them.",
          "要算出两件事相隔多少年，就用较大的年份**减去**较小的年份：从 1903 年到 1969 年是 1969 − 1903 = 66 年。\n\n两个年份都是公元前时，也一样用大数减小数：从公元前 1046 年到公元前 551 年是 1046 − 551 = 495 年。不要把它们相加。",
        ),
        askGenerator(apartBank),
      ),
    ],
  ),
  topic(
    "steps-in-a-procedure",
    t("Steps in a Procedure", "操作步骤"),
    t(
      "A procedure, such as an experiment, gives steps that must be done in order, with what to use and what to look for.",
      "操作步骤（比如一个实验）给出必须按顺序完成的步骤，以及要用什么、要观察什么。",
    ),
    ["sequence-in-texts"],
    [
      point(
        "ordering-the-steps",
        t("Putting the Steps in Order", "给步骤排序"),
        t(
          "A **procedure** tells how to do something step by step. The order matters: you get things ready first, then you do the test, then you look at what happened.\n\nTo order steps, ask what each one needs: you cannot float a cork until the tub has water, and you cannot compare results before there are any.",
          "**操作步骤**一步一步地告诉你怎样做一件事。顺序很重要：先做好准备，再进行测试，最后观察结果。\n\n给步骤排序时，问问每一步需要什么：盆里没有水，就不能让软木塞浮起来；还没有结果，就不能比较结果。",
        ),
        arrangeGenerator(procedureOrderBank),
      ),
      point(
        "skipping-a-step",
        t("If a Step Is Skipped", "如果跳过一步"),
        t(
          "Every step of a procedure has a **job**. If you skip one, a later step cannot do its job, and the experiment fails or gives an unfair answer.\n\nTo see what goes wrong, ask what the skipped step made ready. Without water on the paper towel, the bean stays dry and never sprouts.",
          "操作步骤中的每一步都有自己的**作用**。跳过一步，后面的步骤就无法起作用，实验就会失败或者得出不公平的结果。\n\n要看出会出什么问题，就问问被跳过的那一步准备了什么。纸巾上没有水，豆子就一直是干的，永远不会发芽。",
        ),
        askGenerator(skipBank),
      ),
    ],
  ),
  topic(
    "two-texts-on-one-topic",
    t("Two Texts on One Topic", "同一话题的两篇文章"),
    t(
      "Two texts about the same topic share some key points, and each adds others.",
      "关于同一话题的两篇文章有一些相同的要点，每篇又补充了别的要点。",
    ),
    ["supporting-details"],
    [
      point(
        "a-point-both-make",
        t("A Point Both Texts Make", "两篇都提到的要点"),
        t(
          "Two texts on the same topic often make some of the **same key points**, each in its own words. One says *bees collect nectar*, the other *as a bee collects nectar*: both make that point.\n\nTo find a shared point, check it in **each** text. If only one text says it, it is not shared.",
          "关于同一话题的两篇文章，常常用各自的说法提到一些**相同的要点**。一篇说 *bees collect nectar*，另一篇说 *as a bee collects nectar*：两篇都提到了这个要点。\n\n要找共同的要点，就在**每一篇**里检查。如果只有一篇这样说，它就不是共同的要点。",
        ),
        askGenerator(bothBank),
      ),
      point(
        "a-point-only-one-makes",
        t("A Point Only One Text Makes", "只有一篇提到的要点"),
        t(
          "Each text also **adds** points of its own. One text about bees may tell how big a hive is; the other may tell how bees help plants make fruit.\n\nTo find a point only one text makes, look for a fact in it that the other text does not mention at all. Reading both texts gives you more facts than either one alone.",
          "每篇文章也会**补充**自己的要点。一篇讲蜜蜂的文章可能说蜂巢有多大；另一篇可能说蜜蜂怎样帮助植物结果。\n\n要找只有一篇提到的要点，就在这一篇里找另一篇完全没有提到的事实。两篇都读，能比只读一篇得到更多的事实。",
        ),
        askGenerator(onlyBank),
      ),
    ],
  ),
];
