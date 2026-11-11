// Grade 3: writing checked by rules, part two: story openings and endings, reasons for an opinion, and strong verbs.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { type Ask, askGenerator, kinded, need, rows, topic } from "./kit.ts";

// Stories: problem|an opening that hints at it|an opening with who, where and when only|one without who|one without
// where and when|an opening that hints at another problem|an ending that solves the problem|one that leaves it
// unsolved|one that solves the other problem|one that comes from nowhere|one that does not fit the character.

const storyRows = rows(`
  A girl's kite gets stuck in a tall tree.|On a windy Saturday in the park, Lin flew her new kite higher and higher, right toward the tall oak.|On a windy Saturday in the park, Lin flew her new red kite with her dad.|On a windy Saturday in the park, a red kite flew high above the grass.|Lin flew her new red kite and laughed as it climbed into the sky.|On a windy Saturday in the park, Lin dropped her ice cream cone on the path, sat down on the bench and began to cry.|Lin ran to ask the park keeper for help, and he brought a long ladder, climbed up the oak and freed her kite.|Lin went home sadly without it, and the red kite stayed stuck in the oak tree all winter long.|Lin's dad bought her a new ice cream, and she felt better.|Suddenly a giant eagle swooped down and dropped the kite at her feet.|Lin laughed, said she had never liked kites anyway, and walked off to play on the swings instead.
  A boy loses his puppy at the beach.|Early one summer morning at the beach, Sam let his puppy off the leash for just a minute, and it ran off.|Early one summer morning at the beach, Sam walked his puppy, Rex, along the sand.|Early one summer morning at the beach, the waves rolled gently onto the sand.|Sam walked his puppy, Rex, and threw sticks into the water for him.|Early one summer morning at the beach, a big wave washed Sam's sandcastle away.|Sam called Rex's name along the shore until the puppy came running back.|Sam sat down on the sand and waited, but Rex never came back.|Sam carried buckets of wet sand far up the beach and built a new sandcastle where the waves could not reach.|Suddenly a friendly dolphin swam up to the shore and carried Rex all the way back to Sam on its back.|Sam shrugged and decided he would rather have a cat.
  A mouse is in danger from a cat.|Late one night in a farmhouse kitchen, Milo the mouse crept toward the cheese, not seeing the cat by the stove.|Late one night in a farmhouse kitchen, Milo the mouse looked for crumbs on the floor.|Late one night in a farmhouse kitchen, the old clock ticked softly on the wall.|Milo the mouse looked for crumbs under the table and hummed to himself.|Late one night in a farmhouse kitchen, Milo the mouse heard his little sister crying in their hole because her tooth hurt.|Milo dropped the cheese and dashed back into his hole just in time.|Milo froze beside the cheese, too frightened to move, as the cat crept closer and closer to him.|Milo rubbed his sister's tooth with clove oil, and she fell asleep.|A wizard suddenly appeared and turned the cat into a teacup.|Milo walked right up to the hungry cat, tapped it on the nose and asked for a ride on its back.
  A girl is nervous on her first day at a new school.|On the first Monday of September, Nadia stood at the gate of her new school, her hands shaking.|On the first Monday of September, Nadia walked to her new school with her mother.|On the first Monday of September, the new school opened its big front gates.|Nadia walked to school with her lunch box swinging at her side.|On the first Monday of September, Nadia found that she had left her lunch at home.|By lunchtime a friendly girl named Ruby had asked Nadia to come and sit with her, and Nadia smiled for the first time.|Nadia stood at the gate all day and never went inside.|At lunchtime Nadia's mother hurried to the school with the lunch box that Nadia had left on the kitchen table.|A magic bus flew down from the clouds, picked Nadia up at the gate and carried her back to her old school.|Nadia marched in and shouted that she was the boss of the whole school.
  A farmer's fields are drying up.|In the hot summer of a dry year, Farmer Hu looked at his brown, thirsty fields and the empty sky.|In the hot summer of a dry year, Farmer Hu worked in his fields with his ox.|In the hot summer of a dry year, the fields stretched for miles under the sun.|Farmer Hu worked in his fields with his old ox and sang to it.|In the hot summer of a dry year, Farmer Hu heard a strange scratching noise coming from his barn every single night.|Farmer Hu dug a ditch from the mountain stream, and water flowed into his fields.|The fields stayed brown and dry all summer, and Farmer Hu just sat on his porch and stared at the empty sky.|Farmer Hu found that the noise in the barn was only an owl.|A pot of gold fell from the sky, so he never needed crops again.|Farmer Hu laughed, said he had always hated farming, and packed his bags to move to the city that same day.
  A boy breaks his friend's new toy.|After school on Friday, in Ben's bedroom, Theo picked up Ben's new robot and heard a loud crack.|After school on Friday, in Ben's bedroom, Theo played with his friend Ben.|After school on Friday, in Ben's bedroom, toys covered every bit of the floor.|Theo played with his best friend, Ben, and they laughed and laughed.|After school on Friday, in Ben's bedroom, Theo realized he had left his homework on the bus.|Theo told Ben the truth, and together they glued the robot's arm back on.|Theo hid the robot under the bed and went home without a word.|Theo's mother drove all the way to the bus station and asked the driver to look for Theo's homework.|In the middle of the night, the broken robot mended itself by magic, and its arm was as good as new.|Theo laughed and broke the rest of Ben's toys, one by one.
  A crow cannot reach the water in a jar.|On a hot afternoon in the village, a thirsty crow found a jar with only a little water at the bottom.|On a hot afternoon in the village, a black crow hopped along a garden wall.|On a hot afternoon in the village, the streets were quiet and dusty.|A black crow hopped along a garden wall and looked all around.|On a hot afternoon in the village, a mother crow saw a hungry cat creeping slowly up the tree toward her nest.|The crow dropped pebbles into the jar, one by one, until the water rose high enough for her to drink at last.|The crow pecked and pecked at the side of the jar, gave up at last and flew away, still terribly thirsty.|The crow cawed loudly and chased the cat away from her nest.|It suddenly began to rain lemonade all over the village.|The crow suddenly decided that she was not thirsty after all, tucked her head under her wing and took a nap.
  A girl gets lost in a big museum.|On a rainy Saturday at the city museum, Ana stopped to look at a mummy, and when she turned around, her class was gone.|On a rainy Saturday at the city museum, Ana looked at a mummy with her class.|On a rainy Saturday at the city museum, the halls were full of people.|Ana looked at a mummy with her class and read the signs.|On a rainy Saturday at the city museum, Ana felt her loose tooth wobble and fall out.|Ana asked a guard for help, and he took her to her class in the dinosaur hall.|Ana wandered from room to room until the lights went out.|Ana carefully wrapped her tiny tooth in a tissue and put it in her pocket to take home and show her mother.|The mummy in the glass case suddenly came to life, took Ana by the hand and walked her back to her teacher.|Ana decided to stay in the museum and live there forever.
  A boy is afraid to jump off the diving board.|At the town pool on a sunny July afternoon, Omar climbed the diving board and froze at the very edge.|At the town pool on a sunny July afternoon, Omar swam with his friends.|At the town pool on a sunny July afternoon, the water sparkled in the sun.|Omar swam with his friends and splashed his little sister.|At the town pool on a sunny July afternoon, Omar came out of the water and found that someone had taken his towel.|Omar took a deep breath, held his nose and jumped, and came up laughing.|Omar stood frozen at the edge of the diving board for hours, until the lifeguard blew the whistle to close.|The lifeguard found Omar's towel behind a bench.|Omar suddenly grew wings and flew gently down into the water.|Omar pushed his friend off the diving board instead, laughed loudly and ran all the way home.
  A rabbit's burrow floods in a storm.|One stormy spring night in the meadow, Clover the rabbit woke to the sound of water trickling into her burrow.|One stormy spring night in the meadow, Clover the rabbit slept in her burrow.|One stormy spring night in the meadow, the rain fell hard on the grass.|Clover the rabbit slept in her burrow with her three brothers.|One stormy spring night in the meadow, Clover the rabbit heard a fox sniffing at her door.|Clover woke her three brothers, and together they dug a new, dry burrow higher up the hill, safe from the water.|Clover lay awake as the water rose higher around her.|The hungry fox sniffed at the door for a while, gave up and trotted away to look for food somewhere else.|The rain suddenly turned into candy, and the water in the burrow dried up all by itself before morning.|Clover hopped outside and danced in the storm all night.
  A girl keeps spelling one word wrong before the spelling bee.|The week before the spelling bee at Hill School, Priya spelled *necessary* wrong for the third time.|The week before the spelling bee at Hill School, Priya studied her words.|The week before the spelling bee at Hill School, the hall was set up with chairs.|Priya studied her words at the kitchen table after dinner.|The week before the spelling bee at Hill School, Priya woke up with a terrible sore throat and could not say a word.|Priya wrote *necessary* ten times every night, and at the bee she spelled it perfectly.|At the spelling bee, Priya spelled *necessary* wrong once again, and she sat down with tears in her eyes.|Priya drank warm honey water, and her voice came back.|A talking dictionary whispered every answer into her ear.|Priya decided that spelling was boring and stayed at home on the day of the bee, playing with her dolls.
  A boy's bike gets a flat tire far from home.|On a long Sunday ride along the river path, Diego heard a hiss and felt his back wheel go soft.|On a long Sunday ride along the river path, Diego pedaled his new bike.|On a long Sunday ride along the river path, the sun shone on the water.|Diego pedaled his new bike as fast as he could go.|On a long Sunday ride along the river path, Diego saw a puppy alone and shivering by the water.|Diego pushed his bike to a gas station, where a kind man helped him patch the tire.|Diego sat by the path as the sky grew dark.|Diego wrapped the shivering puppy in his warm jacket and carried it all the way home to his family.|With a flash of light, his bike turned into a white horse and galloped with him all the way back home.|Diego threw his bike into the river and laughed.
  An old woman's cat is stuck on the roof.|One windy evening on Elm Street, Mrs. Gray heard her cat meowing from high up on the roof.|One windy evening on Elm Street, Mrs. Gray fed her cat in the kitchen.|One windy evening on Elm Street, the leaves blew along the sidewalk.|Mrs. Gray fed her cat and sat down in her chair to knit.|One windy evening on Elm Street, Mrs. Gray came home from the shops and found that her front door key was missing.|Mrs. Gray called the fire station, and a kind firefighter climbed a ladder to the roof and brought her cat down safely.|The cat stayed up on the cold roof all night, meowing and meowing, while Mrs. Gray watched from below.|Mrs. Gray found her key under the doormat.|The cat floated gently down on a little cloud.|Mrs. Gray shrugged, locked the door and went to bed without her cat, even though she loved it dearly.
  A boy forgets his lines in the school play.|On the night of the school play, in the crowded hall, Leo stepped onto the stage and his mind went blank.|On the night of the school play, in the crowded hall, Leo waited backstage.|On the night of the school play, in the crowded hall, the lights went dim.|Leo waited backstage in his costume and tapped his feet.|On the night of the school play, in the crowded hall, Leo saw that his costume had a big rip.|Leo looked at his friend in the front row, remembered his first word, and the rest came back.|Leo stood without a word until the curtain came down.|Leo's teacher found a needle and some thread and quickly sewed up the big rip in the back of his costume.|A friendly ghost suddenly floated onto the stage and whispered every one of his lines into his ear.|Leo walked off the stage and went home to play games.
  Two friends both want to be captain of the team.|On the first day of soccer practice in the town park, Kim and Jamal both raised their hands to be captain.|On the first day of soccer practice in the town park, Kim and Jamal kicked a ball.|On the first day of soccer practice in the town park, the grass was freshly cut.|Kim and Jamal kicked a ball back and forth and talked.|On the first day of soccer practice in the town park, Kim and Jamal found that the only ball the team had was flat.|Kim and Jamal agreed to take turns, one week each.|Kim and Jamal argued until practice was over.|The coach found a new ball in the back of his car.|A famous player arrived and made them both captain forever.|Kim and Jamal both quit the team that very day.
  A girl's paper lantern is torn before the festival.|The night before the Lantern Festival in her town, Mei found a long tear in her paper lantern.|The night before the Lantern Festival in her town, Mei made a paper lantern.|The night before the Lantern Festival in her town, the streets glowed with lights.|Mei made a paper lantern with her cousins at the table.|The night before the Lantern Festival in her town, Mei could not find her little brother anywhere.|Mei and her grandmother patched the long tear with red paper, and that night the lantern glowed as brightly as the rest.|Mei put the torn lantern away and stayed home.|Mei searched the whole house and found her little brother fast asleep under the kitchen table.|A friendly dragon flew down, breathed softly on the torn lantern and made it as good as new again.|Mei tore the lantern into pieces and threw it away.
  A bear cub is too scared to cross a river.|One summer morning by the wide mountain river, Bo the bear cub watched his sister cross and stayed on the bank, trembling.|One summer morning by the wide mountain river, Bo the bear cub ate berries.|One summer morning by the wide mountain river, the water rushed over the stones.|Bo the bear cub ate berries with his sister in the sun.|One summer morning by the wide mountain river, Bo the bear cub stepped on a sharp thorn and got it stuck deep in his front paw.|Bo's sister held out her paw, and step by step Bo crossed beside her.|Bo stayed on the bank all day, alone and trembling, while his sister waited for him on the other side.|Bo's mother pulled the thorn out of his paw.|The river froze in the middle of summer so that Bo could walk across.|Bo jumped into the deepest part of the river for fun, laughing.
  A boy wants a puppy, but his father says no.|At dinner one Tuesday night in their small apartment, Kenji asked for a puppy for the tenth time, and his father shook his head.|At dinner one Tuesday night in their small apartment, Kenji ate his noodles.|At dinner one Tuesday night in their small apartment, the soup was hot.|Kenji ate his noodles and talked about his day at school.|At dinner one Tuesday night in their small apartment, Kenji spilled juice all over his homework.|Kenji showed his father a plan for feeding and walking a dog, and his father agreed to try.|Kenji asked again the next night, and his father still said no.|Kenji's mother dried his wet homework with a hair dryer, page by page, so that he could hand it in.|A tiny brown puppy suddenly fell out of the sky, right through the open window, and landed in his lap.|Kenji said he had never wanted a pet anyway.
  A rabbit is eating a girl's garden.|One spring morning in the back yard, Ivy found that half of her lettuce had been nibbled down to the stems.|One spring morning in the back yard, Ivy watered her garden.|One spring morning in the back yard, the flowers were opening.|Ivy watered her garden and pulled some weeds.|One spring morning in the back yard, Ivy went out to play and saw that her swing had broken during the night.|Ivy built a wire fence all the way around her lettuce, and the next morning the rabbit sniffed at it and hopped away.|The rabbit came back the next night and the night after that, and it ate every bit of the lettuce.|Ivy's father fixed the swing with a new rope.|The lettuce grew back overnight by magic.|Ivy pulled up every one of her plants, threw down her watering can and gave up gardening forever.
  A ship is lost in the fog.|On a gray autumn evening far out at sea, Captain Ruby could no longer see the lighthouse through the thick fog.|On a gray autumn evening far out at sea, Captain Ruby steered her ship.|On a gray autumn evening far out at sea, the waves were calm.|Captain Ruby steered her ship and hummed a song.|On a gray autumn evening far out at sea, Captain Ruby found a hungry stowaway hiding in a barrel.|Captain Ruby rang the ship's bell, heard the lighthouse horn answer, and steered safely home.|The ship drifted in the fog all night.|Captain Ruby gave the hungry stowaway a hot bowl of soup, a warm blanket and a job on the ship.|A bright rainbow suddenly appeared in the middle of the fog and pointed the ship all the way home.|Captain Ruby went to sleep and let the ship go wherever it wanted.
  A boy has no money for his mother's birthday present.|Two days before his mother's birthday, in his bedroom, Hugo shook his piggy bank and heard nothing inside.|Two days before his mother's birthday, in his bedroom, Hugo made a list.|Two days before his mother's birthday, in his bedroom, the lamp was on.|Hugo made a list of the things his mother liked best.|Two days before his mother's birthday, in his bedroom, Hugo found that the door of his hamster's cage was wide open.|Hugo made his mother a card and breakfast in bed, and she said it was the best gift ever.|On his mother's birthday, Hugo still had nothing to give her, so he hid in his room all day long.|Hugo found his hamster asleep in a slipper.|A genie popped out of the lamp and gave Hugo a bag of gold.|Hugo got so busy playing with his friends that he forgot all about his mother's birthday that year.
  A girl cannot find her way home in the snow.|One snowy afternoon on the hill behind her village, Zoe looked around and could not see a single path.|One snowy afternoon on the hill behind her village, Zoe rode her sled.|One snowy afternoon on the hill behind her village, the snow fell softly.|Zoe rode her sled down the hill again and again.|One snowy afternoon on the hill behind her village, Zoe's sled cracked in two.|Zoe found her own sled tracks in the snow and followed them carefully, all the way back down the hill to the village.|Zoe sat in the snow as the sky grew dark.|Zoe's father fixed the broken sled with a few nails and some glue, and it was ready to ride again.|A snowman at the top of the hill suddenly came to life, picked Zoe up and carried her all the way home.|Zoe built a snow house and decided to live there forever.
  A monkey will not share his mangoes.|One hot day in the jungle, Tiko the monkey found a tree full of mangoes and chased the hungry parrots away.|One hot day in the jungle, Tiko the monkey swung through the trees.|One hot day in the jungle, the parrots squawked in the trees.|Tiko the monkey swung through the trees and called to his friends.|One hot day in the jungle, Tiko the monkey slipped from a high branch, fell to the ground and hurt his long tail.|When a storm knocked down the mangoes, the parrots shared their figs, and Tiko learned to share.|Tiko kept every single mango for himself, chased the parrots away again and never learned to share.|Tiko's tail healed after a week of rest.|A wizard made every tree in the jungle grow mangoes.|For no reason at all, Tiko suddenly gave away every mango he had to the parrots, then sat down hungry.
  A boy is teased about his new glasses.|On his first day back at school in September, Pablo heard two boys laughing at his new round glasses.|On his first day back at school in September, Pablo wore his new glasses.|On his first day back at school in September, the classroom smelled of new books.|Pablo wore his new glasses and smiled at everyone.|On his first day back at school in September, Pablo found that his desk had been moved.|Pablo told his teacher, the boys said sorry, and one even asked to try the glasses on.|Pablo hid his glasses and could not see the board all year.|Pablo's teacher helped him move his desk back to its old place by the sunny window at the front.|Pablo put on his new glasses and found that they gave him magic powers, so the boys ran away scared.|Pablo laughed at the boys' shoes and started a fight.
  A hen's eggs go missing.|Early one morning in the barnyard, Henrietta the hen came back from her walk and found her nest empty.|Early one morning in the barnyard, Henrietta the hen sat on her nest.|Early one morning in the barnyard, the rooster crowed.|Henrietta the hen sat on her nest and clucked.|Early one morning in the barnyard, Henrietta the hen heard the other hens say that the farmer was selling the farm.|Henrietta searched the whole barn and found her eggs safe and warm in a basket, where the farmer had put them for her.|Henrietta sat beside her empty nest day after day, but she never found out what had happened to her eggs.|The farmer decided not to sell the farm after all.|The eggs flew back to the nest on tiny wings.|Henrietta said that she did not care about her eggs at all, and she waddled off to go for a swim in the pond.
  A girl cannot sleep the night before a big trip.|At midnight before the family trip to the mountains, Ella lay in bed with her eyes wide open, counting the hours.|At midnight before the family trip to the mountains, Ella lay in bed.|At midnight before the family trip to the mountains, the house was dark.|Ella lay in bed with her teddy bear.|At midnight before the family trip to the mountains, Ella heard a loud crash downstairs.|Ella's mother sat with her and read a story, and soon Ella fell asleep.|Ella was still wide awake when the sun came up.|In the morning they found that the crash was only the cat, which had knocked over a plant in the hall.|A sleepy little fairy flew in through the window and sprinkled magic sleeping dust on Ella's eyelids.|Ella got up and cleaned the whole house until morning.
  A town's only bridge is washed away.|After a week of heavy rain in the river town of Bale, Sam and Tess woke to find that the old bridge was gone.|After a week of heavy rain in the river town of Bale, Sam and Tess played inside.|After a week of heavy rain in the river town of Bale, puddles filled the streets.|Sam and Tess played a board game inside by the fire.|After a week of heavy rain in the river town of Bale, Sam and Tess found a strange, speckled egg lying in the mud.|Sam and Tess built a raft and carried food across until the bridge was rebuilt.|The town stayed cut off from the other side of the river, and nobody did anything to help at all.|The egg hatched into a fluffy baby duck.|A giant appeared and lifted the whole town across the river.|Sam and Tess packed their bags, moved to another town far away and forgot all about the people of Bale.
  A boy breaks a neighbor's window with his ball.|On a sunny Saturday in the street outside his house, Max kicked his ball too hard toward Mr. Patel's window.|On a sunny Saturday in the street outside his house, Max kicked his ball.|On a sunny Saturday in the street outside his house, the neighbors washed their cars.|Max kicked his ball against the wall again and again.|On a sunny Saturday in the street outside his house, Max saw the ice cream truck drive past without stopping.|Max knocked on Mr. Patel's door, said that he was sorry and offered all of his savings to help pay for a new window.|Max ran inside and hid, and the window stayed broken.|The next day the ice cream truck came back down the street, and this time it stopped right outside Max's house.|The broken pieces of glass jumped up from the ground and flew back into the window all by themselves.|Max kicked another ball through a second window.
  A girl is jealous of her sister's new bike.|On her sister's birthday, in the driveway, June watched her sister ride a shiny new bike while hers sat rusting.|On her sister's birthday, in the driveway of their house, June watched her sister.|On her sister's birthday, in the driveway of their house, balloons bobbed in the wind.|June watched her sister open her presents.|On her sister's birthday, in the driveway of their house, June tripped over a long balloon string and scraped her knee badly.|June told her sister how she felt, and her sister let her ride the new bike too.|June sulked in her room for the rest of the day and would not even come down for the birthday cake.|June's mother put a bandage on her knee.|Her rusty bike turned shiny overnight by magic.|June hugged her sister, said she had never wanted a bike anyway, and went inside to watch TV.
  A boy will not stop his game to help his grandmother.|On a Saturday morning at his grandmother's house, Ben played video games while she struggled with the heavy shopping bags.|On a Saturday morning at his grandmother's house, Ben played video games.|On a Saturday morning at his grandmother's house, the kettle whistled.|Ben played video games and ate a cookie.|On a Saturday morning at his grandmother's house, Ben found that the video game would not turn on.|Ben paused his game, carried the bags in, and helped his grandmother put the shopping away.|Ben kept playing while his grandmother carried every bag alone.|Ben's grandmother sat down with the video game, found the loose cable and got it working again for him.|All of a sudden the heavy bags floated up and drifted into the kitchen all by themselves, like magic.|Ben laughed at his grandmother and asked her to make him lunch.
`);

const stories = storyRows.map((row) => {
  const [problem = "", hint = "", plain = "", noWho = "", noWhen = "", other = "", ...ends] = need(row, 11);
  const [solves = "", unsolved = "", otherEnd = "", nowhere = "", unlike = ""] = ends;
  return { problem, hint, plain, noWho, noWhen, other, solves, unsolved, otherEnd, nowhere, unlike };
});

const openingBank: readonly Ask[] = stories.map((s) => ({
  question: t("Which opening tells who the story is about, where it happens and when?", "哪个开头说出了故事写的是谁、在哪里、什么时候？"),
  shown: "",
  right: s.plain,
  wrong: [s.noWho, s.noWhen],
  why: t(
    "This opening names the main character, the place and the time, so the reader knows who, where and when from the first sentence.",
    "这个开头说出了主角、地点和时间，读者从第一句就知道是谁、在哪里、什么时候。",
  ),
  whyNot: [
    t(
      "That opening tells where and when, but no main character appears in it, so it does not tell who.",
      "这个开头说了地点和时间，但没有出现主角，所以没有说出是谁。",
    ),
    t(
      "That opening tells who, but it gives no place and no time, so it does not tell where or when.",
      "这个开头说了是谁，但没有地点和时间，所以没有说出在哪里、什么时候。",
    ),
  ],
}));

const hintBank: readonly Ask[] = stories.map((s) => ({
  question: t(`Which opening sets up this problem: “${s.problem}”`, `哪个开头为这个问题做了铺垫：“${s.problem}”`),
  shown: "",
  right: s.hint,
  wrong: [s.other, s.plain],
  why: t(
    "This opening tells who, where and when, and it also hints at the trouble to come, so the reader wants to find out what happens.",
    "这个开头说出了是谁、在哪里、什么时候，还暗示了将要到来的麻烦，让读者想知道接下来会怎样。",
  ),
  whyNot: [
    t(
      "That opening hints at a problem, but at a different one from the problem this story has.",
      "这个开头暗示了一个问题，但不是这个故事要讲的那个问题。",
    ),
    t(
      "That opening tells who, where and when, but it gives no hint of any problem.",
      "这个开头说了是谁、在哪里、什么时候，但没有暗示任何问题。",
    ),
  ],
}));

const solvingEndBank: readonly Ask[] = stories.map((s) => ({
  question: t("Which ending solves the problem of this story?", "哪个结尾解决了这个故事的问题？"),
  shown: s.hint,
  right: s.solves,
  wrong: [s.unsolved, s.otherEnd],
  why: t(
    `The problem was this: ${s.problem} This ending settles it, so the story can end.`,
    `问题是：${s.problem} 这个结尾解决了它，故事因此可以结束。`,
  ),
  whyNot: [
    t("That ending leaves the problem just where it was; nothing has been solved.", "这个结尾让问题原封不动；什么都没有解决。"),
    t(
      "That ending solves a different problem, not the one this story opens with.",
      "这个结尾解决的是另一个问题，而不是这个故事开头提出的问题。",
    ),
  ],
}));

const fittingEndBank: readonly Ask[] = stories.map((s) => ({
  question: t("Which ending fits the characters and what they want?", "哪个结尾符合角色和他们想要的？"),
  shown: s.hint,
  right: s.solves,
  wrong: [s.nowhere, s.unlike],
  why: t(
    "In this ending the characters solve the problem themselves, in a way that fits who they are and what they want.",
    "在这个结尾里，角色用符合自己性格和愿望的方式亲自解决了问题。",
  ),
  whyNot: [
    t(
      "That ending comes from nowhere: something magic or sudden fixes everything, and the characters do nothing.",
      "这个结尾来得毫无来由：突然出现的魔法把一切都解决了，角色什么也没做。",
    ),
    t(
      "That ending does not fit the character: it goes against what the character has wanted all along.",
      "这个结尾不符合角色：它和角色一直以来想要的相反。",
    ),
  ],
}));

// Opinions: opinion|a reason for it|a reason against it|a fact that is no reason at all.

const reasonChoice = kinded(
  ["Which reason supports this opinion?", "哪个理由支持这个观点？"],
  (right) => [
    `*${right}* gives a reason to agree with the opinion, so it supports it.`,
    `*${right}* 给出了赞同这个观点的理由，所以它支持这个观点。`,
  ],
  [
    ["{wrong} is a reason for the opposite opinion: it argues against this one.", "{wrong} 是支持相反观点的理由：它反驳的是这个观点。"],
    ["{wrong} is true, but it gives no reason at all to agree with the opinion.", "{wrong} 是真的，但它根本没有给出赞同这个观点的理由。"],
  ],
);

const reasonBank: readonly Ask[] = rows(`
  Dogs make better pets than goldfish.|You can play and go for walks with a dog.|Goldfish are much easier to care for.|Most dogs have four legs, a tail and a wet nose.
  Our school should have a longer recess.|Playing outside helps us focus in class.|A longer recess means less time for lessons.|Recess happens after lunch.
  Summer is the best season.|There is no school, and the days are long and warm.|Summer can be too hot to play outside.|Summer comes after spring and before autumn every year.
  Everyone should learn to swim.|Swimming can keep you safe near water.|Swimming lessons can cost a lot.|Pools are filled with water and have a deep end and a shallow end.
  Reading is better than watching TV.|Books let you imagine the story yourself.|Shows have exciting music and pictures.|Most books have a cover, a title and many pages.
  Children should help with chores at home.|Chores teach children to be responsible.|Children are already busy with homework.|Many homes have a kitchen.
  Our town needs a new park.|Children need a safe place to play outside.|A park would cost the town a lot of money.|Our town has a post office.
  Breakfast is the most important meal.|It gives you energy for the whole morning.|Some people are not hungry in the morning.|Breakfast is eaten in the morning.
  Riding a bike is the best way to get to school.|It is good exercise and does not pollute the air.|Riding a bike in the rain is no fun.|Most bikes have two wheels, a seat and a bell on the handlebars.
  Every class should have a pet.|Caring for a pet teaches children responsibility.|Some children are allergic to animals.|Hamsters are small animals with soft fur and short tails.
  Winter is the most fun season.|You can sled, skate and build snowmen.|Winter is cold, and the days are short.|Winter comes after autumn.
  Students should wear uniforms.|With uniforms, nobody worries about what to wear.|Uniforms stop students from showing their style.|Uniforms are made of cloth.
  Libraries are important for a town.|They let everyone borrow books for free.|Many people read books on screens now.|Libraries have shelves.
  Vegetables should be part of every meal.|Vegetables give your body vitamins to stay healthy.|Many children do not like the taste of vegetables.|Carrots are orange, and they grow under the ground.
  Kids should play a sport.|Sports keep your body strong and teach teamwork.|Some sports can lead to injuries.|Soccer is played on a big field with a ball and two goals.
  Our class should visit the science museum.|We would see real fossils and experiments.|The museum is far away from our school.|Museums have doors.
  Homework should be shorter.|Children need time to play and rest after school.|Homework helps children practice what they learned.|Teachers give homework.
  Cats are the best pets.|Cats are clean and can stay home alone.|Cats sometimes scratch the furniture.|Cats have whiskers.
  Everyone should plant a tree.|Trees clean the air and give us shade.|Trees take many years to grow.|Trees have leaves.
  Learning a second language is useful.|You can talk with more people around the world.|Learning a language takes a lot of time.|There are thousands of languages spoken around the world.
  The school day should start later.|Children learn better when they have had enough sleep.|Starting later means finishing later too.|School starts in the morning and ends in the afternoon.
  Music class is important.|Music helps children's brains grow, and it is fun.|Music class takes time away from reading and math.|Pianos have keys.
  It is better to live in the country than in a city.|The country is quiet and has fresh air.|Cities have more shops and jobs.|Many people live on Earth.
  Board games are better than video games.|Board games bring the family together around a table.|Video games have amazing pictures.|Chess is a board game played with sixteen pieces on each side.
  We should recycle at school.|Recycling keeps trash out of the ground.|Sorting trash takes extra time.|Schools have many classrooms.
  A picnic is the best way to spend a Sunday.|You get fresh air and food with your family.|Ants and wasps can spoil a picnic.|Sunday comes after Saturday.
  Zoos help animals.|Many zoos protect animals that are in danger.|Zoo animals do not have much space to roam.|Zoos sell tickets at the gate, and some also sell snacks.
  Everyone should learn to cook.|Cooking lets you make healthy food for yourself.|Cooking can make a big mess.|Most kitchens have an oven, a sink and a big fridge.
  Our school should have a garden.|Students could learn how food grows.|A garden needs care even in the summer holidays.|Tomatoes are red.
  Walking is better than driving for short trips.|Walking is healthy and saves fuel.|Walking takes longer than driving.|Cars have engines.
  Children should have a bedtime.|Sleep helps children grow and stay healthy.|Some children are not tired at bedtime.|Beds have pillows.
  Kites are the best toy for a windy day.|The wind lifts them high, and they are fun to fly.|Kites can get stuck in trees.|Most kites have a long string and a tail made of ribbon.
`).map((row) => reasonChoice(need(row, 4)));

// Linking words: a sentence with a gap|the right word|two wrong words, each as it would stand in the gap.

const roleOf = (word: string): readonly [string, string] => {
  const w = word.toLowerCase();
  if (w === "because" || w === "since") return ["gives a reason", "引出原因"];
  if (w === "therefore") return ["gives a result that follows", "引出随之而来的结果"];
  return ["gives an example", "引出例子"];
};

const linkBank: readonly Ask[] = rows(`
  Dogs make good pets ___ they are loyal and friendly.|because|therefore|for example
  Playing outside helps us focus. ___, recess should be longer.|Therefore|Because|For example
  Our town needs more places to play. ___, there is no park near the school.|For example|Therefore|Because
  ___ trees clean the air, everyone should plant one.|Since|Therefore|For example
  Summer is the best season ___ there is no school.|because|for example|therefore
  Bikes do not pollute the air. ___, more people should ride them.|Therefore|For example|Since
  Vegetables are good for you. ___, carrots help your eyes.|For example|Therefore|Since
  ___ swimming can keep you safe, everyone should learn it.|Since|For example|Therefore
  I think cats are the best pets ___ they are clean.|because|therefore|for example
  Reading teaches new words. ___, children should read every day.|Therefore|Because|For example
  Winter has many fun activities. ___, you can sled down a hill.|For example|Therefore|Because
  ___ libraries lend books for free, every town should have one.|Since|Therefore|For example
  Children should help at home ___ chores teach responsibility.|because|for example|therefore
  Sleep helps children grow. ___, children need a bedtime.|Therefore|For example|Since
  Sports teach teamwork. ___, soccer players must pass to each other.|For example|Therefore|Since
  ___ music is fun and good for the brain, every school needs music class.|Since|For example|Therefore
  We should recycle at school ___ it keeps trash out of the ground.|because|therefore|for example
  Walking saves fuel. ___, we should walk on short trips.|Therefore|Because|For example
  Zoos protect animals in danger. ___, some zoos help pandas raise their babies.|For example|Therefore|Because
  ___ a garden teaches how food grows, our school should start one.|Since|Therefore|For example
  Board games are great ___ they bring families together.|because|for example|therefore
  Uniforms save time in the morning. ___, students should wear them.|Therefore|For example|Since
  Pets need a lot of care. ___, a dog must be walked every day.|For example|Therefore|Since
  ___ cooking lets you make healthy food, everyone should learn it.|Since|For example|Therefore
  Kites are perfect for windy days ___ the wind lifts them high.|because|therefore|for example
  Learning a language helps you make friends. ___, everyone should try one.|Therefore|Because|For example
  The country has many quiet places. ___, you can walk in a forest all day.|For example|Therefore|Because
  ___ children learn better after enough sleep, school should start later.|Since|Therefore|For example
  Picnics are wonderful ___ you eat outside in the fresh air.|because|for example|therefore
  Homework takes time away from play. ___, homework should be shorter.|Therefore|For example|Since
  Museums make learning fun. ___, the science museum has real experiments.|For example|Therefore|Since
  ___ a class pet teaches care, each class should have one.|Since|For example|Therefore
`).map((row) => {
  const [shown = "", right = "", w1 = "", w2 = ""] = need(row, 4);
  const [role, roleZh] = roleOf(right);
  return {
    question: t("Which linking word fits the gap?", "哪个连接词适合填在空白处？"),
    shown,
    right,
    wrong: [w1, w2],
    why: t(`*${right}* ${role}, and the words after the gap do just that.`, `*${right}* ${roleZh}，而空白后面的内容正是这样。`),
    whyNot: [w1, w2].map((w) => {
      const [r, rz] = roleOf(w);
      return t(`*${w}* ${r}, but the words after the gap do not.`, `*${w}* ${rz}，但空白后面的内容不是这样。`);
    }),
  };
});

// Strong verbs: a sentence with a gap|the meaning wanted|the verb that shows it|two strong verbs that show something else.

const strongVerbChoice = kinded(
  ["Which verb fits the meaning in brackets?", "哪个动词符合括号里的意思？"],
  (right, shown) => [
    `*${right}* shows exactly the meaning in brackets: ${shown.replace("___", right).replace(/ \(.*\)$/, "")}`,
    `*${right}* 正好表现了括号里的意思：${shown.replace("___", right).replace(/ \(.*\)$/, "")}`,
  ],
  [
    [
      "*{wrong}* is a strong verb, but it shows a different way of moving or sounding from the one in brackets.",
      "*{wrong}* 是个生动的动词，但它表现的动作或声音和括号里的不同。",
    ],
    [
      "*{wrong}* is a strong verb, but its meaning does not match the words in brackets.",
      "*{wrong}* 是个生动的动词，但它的意思和括号里的词不符。",
    ],
  ],
);

const strongVerbBank: readonly Ask[] = rows(`
  The leaves ___ across the road.|moved quickly and lightly|skittered|crept|thundered
  The tired hikers ___ up the last hill.|walked slowly and heavily|trudged|skipped|dashed
  The mouse ___ behind the cupboard.|ran quickly in small steps|scurried|stomped|drifted
  The thunder ___ over the hills.|made a deep, rolling sound|rumbled|whispered|squeaked
  The baby ___ when she saw the puppy.|laughed in a high, happy way|giggled|groaned|roared
  The kite ___ high above the beach.|flew smoothly upward|soared|tumbled|crawled
  The children ___ down the hallway when the bell rang.|ran very fast|raced|tiptoed|wandered
  The old door ___ as it opened.|made a high, sharp sound|creaked|boomed|hummed
  The snake ___ through the grass.|moved by twisting its body|slithered|hopped|marched
  The lion ___ at the crowd.|made a loud, fierce sound|roared|chirped|sighed
  The girl ___ into the cold lake.|jumped in with a big splash|plunged|crept|floated
  The bees ___ around the flowers.|made a low, steady sound|buzzed|shrieked|banged
  Max ___ his glass of milk in one go.|drank quickly and all at once|gulped|sipped|nibbled
  The rain ___ on the tin roof.|hit again and again with light sounds|pattered|crashed|oozed
  The horse ___ across the field.|ran fast on its four legs|galloped|waddled|limped
  The thief ___ past the sleeping guard.|moved slowly and quietly|crept|stomped|sprinted
  The wind ___ through the cracks in the window.|made a high, long sound|whistled|thudded|clanged
  Grandma ___ her tea slowly.|drank it in tiny amounts|sipped|gulped|slurped
  The puppy ___ its tail.|moved it quickly from side to side|wagged|stretched|dragged
  The angry boy ___ up the stairs.|walked with heavy, loud steps|stomped|tiptoed|floated
  The duck ___ to the pond.|walked swaying from side to side|waddled|galloped|zoomed
  The fire ___ in the fireplace.|made small, sharp popping sounds|crackled|roared|whimpered
  The girl ___ the paper into a ball.|pressed it tightly into a small shape|crumpled|folded|smoothed
  The rocket ___ into the sky.|went up very fast with great power|blasted|drifted|wobbled
  The tired puppy ___ onto the rug.|lay down all at once, relaxed|flopped|leaped|marched
  The water ___ out of the broken pipe.|came out fast in a big stream|gushed|dripped|trickled
  The owl ___ softly in the night.|made a low, round sound|hooted|screeched|growled
  The car ___ to a stop at the red light.|stopped suddenly with a loud, sharp sound|screeched|rolled|drifted
  The boy ___ when he saw the spider.|let out a short, high cry|shrieked|giggled|grumbled
  The leaf ___ slowly to the ground.|moved gently through the air|floated|plunged|dashed
  The frog ___ onto the lily pad.|jumped lightly|hopped|crawled|slithered
  The dog ___ at the mail carrier.|made a low, angry sound|growled|purred|chirped
`).map((row) => {
  const [sentence = "", meaning = "", right = "", w1 = "", w2 = ""] = need(row, 5);
  return strongVerbChoice([`${sentence} (${meaning})`, right, w1, w2]);
});

const replaceChoice = kinded(
  ["Which strong verb should replace the weak verb in bold?", "哪个生动的动词应该替换粗体的弱动词？"],
  (right, shown) => {
    const weak = /\*\*(.+?)\*\*/.exec(shown)?.[1] ?? "";
    return [
      `*${right}* shows exactly how, and it fits the clues in the sentence much better than the weak verb *${weak}*.`,
      `*${right}* 准确地表现了动作的方式，比弱动词 *${weak}* 更符合句子里的线索。`,
    ];
  },
  [
    [
      "*{wrong}* is a strong verb, but it goes against the clues in the sentence about how it happened.",
      "*{wrong}* 是个生动的动词，但它和句子里关于动作方式的线索相反。",
    ],
    [
      "*{wrong}* is a strong verb, but it names a different action from the one in the sentence.",
      "*{wrong}* 是个生动的动词，但它说的是和句子里不同的动作。",
    ],
  ],
);

const replaceBank: readonly Ask[] = rows(`
  The horse **went** across the field at top speed.|galloped|tiptoed|swam
  The baby **said** goodnight so softly that we could hardly hear her.|whispered|bellowed|sang
  The hungry boy **ate** his sandwich in three huge bites.|gobbled|nibbled|sniffed
  Mia **looked** at the stars for a long, long time.|gazed|glanced|pointed
  The tired old dog **walked** slowly to its bed.|shuffled|sprinted|leaped
  The angry coach **said**, “Get back here right now!”|shouted|murmured|giggled
  The ice cream **went** down the side of the cone in the hot sun.|dripped|zoomed|bounced
  The children **went** into the pool with a huge splash.|plunged|tiptoed|climbed
  The thief **went** quietly past the sleeping dog.|crept|stomped|skated
  The rocket **went** up into the sky with a roar.|blasted|drifted|sank
  The puppy **got** the ball in its mouth and ran off.|grabbed|dropped|sniffed
  The mouse **moved** quickly under the door.|scurried|strolled|swam
  The rain **fell** hard on the roof all night.|pounded|drizzled|floated
  The tired runner **drank** the whole bottle of water in seconds.|gulped|sipped|spilled
  The little boy **cried** loudly when he dropped his ice cream.|wailed|sniffled|laughed
  The cat **moved** silently toward the bird.|crept|charged|danced
  The leaves **moved** gently in the soft breeze.|fluttered|crashed|marched
  The girl **laughed** quietly behind her hand.|giggled|roared|coughed
  The frog **moved** from one lily pad to the next in one jump.|hopped|crawled|rolled
  The old car **went** slowly up the steep hill.|crawled|raced|flew
  The boy **put** his heavy bag down with a loud thump.|dropped|lowered|opened
  The water **came** out of the broken pipe in a great rush.|gushed|dripped|froze
  The wind **blew** hard all night and bent the trees.|howled|whispered|sparkled
  Ella **walked** happily down the path, swinging her arms.|skipped|trudged|crawled
  The fireworks **went** into the sky and burst into colors.|shot|drifted|sank
  The kitten **drank** its milk with small licks.|lapped|gulped|chewed
  The bus **stopped** suddenly with a loud squeal.|screeched|drifted|honked
  The giant **walked** heavily through the village, shaking the ground.|stomped|tiptoed|danced
  The eagle **flew** high and smoothly over the mountains.|soared|tumbled|dived
  The boy **said** “Ow!” when he stubbed his toe.|yelped|whispered|sang
  The snake **moved** silently through the long grass.|slithered|stomped|hopped
  The sad girl **walked** slowly home with her head down.|trudged|skipped|raced
`).map((row) => replaceChoice(need(row, 4)));

/** writingStoryTopics are the rule-checked writing topics of grade 3 on stories, opinions and verbs. */
export const writingStoryTopics: readonly TopicDef[] = [
  topic(
    "choosing-a-story-opening",
    t("Choosing a Story Opening", "选择故事的开头"),
    t("The opening of a story says who, where and when, and hints at the problem.", "故事的开头说出是谁、在哪里、什么时候，并暗示问题。"),
    ["setting-problem-and-solution"],
    [
      point(
        "who-where-and-when",
        t("Who, Where and When", "谁、在哪里、什么时候"),
        t(
          "A good story opening tells the reader three things at once: **who** the story is about, **where** it happens and **when**. *On a windy Saturday in the park, Lin flew her new kite* names Lin, the park and a windy Saturday.\n\nAn opening without a character, or without a place and a time, leaves the reader guessing.",
          "好的故事开头一下子告诉读者三件事：故事写的是**谁**，发生在**哪里**，**什么时候**。*On a windy Saturday in the park, Lin flew her new kite* 说出了 Lin、公园和一个刮风的星期六。\n\n没有角色，或者没有地点和时间的开头，会让读者摸不着头脑。",
        ),
        askGenerator(openingBank),
      ),
      point(
        "an-opening-that-sets-up-the-problem",
        t("An Opening That Sets Up the Problem", "为问题做铺垫的开头"),
        t(
          "The best openings also **hint at the problem** to come. If the story is about a kite stuck in a tree, the opening might show the kite flying *right toward the tall oak*.\n\nThe hint must fit this story's problem. An opening that hints at some other trouble, or at none, does not set it up.",
          "最好的开头还会**暗示将要出现的问题**。如果故事讲的是风筝卡在树上，开头就可能写风筝*正朝着那棵高大的橡树*飞去。\n\n暗示必须符合这个故事的问题。暗示了别的麻烦，或者什么都没暗示的开头，都没有为它做铺垫。",
        ),
        askGenerator(hintBank),
      ),
    ],
  ),
  topic(
    "ending-a-story",
    t("Ending a Story", "给故事结尾"),
    t("An ending solves the story's problem and fits what the characters want.", "结尾解决故事的问题，并且符合角色想要的东西。"),
    ["setting-problem-and-solution", "character-change"],
    [
      point(
        "an-ending-that-solves-the-problem",
        t("An Ending That Solves the Problem", "解决问题的结尾"),
        t(
          "A story's ending must **solve its problem**. If the kite is stuck in a tree, the ending tells how it comes down.\n\nAn ending that leaves the problem where it was does not finish the story, and an ending that solves some other problem misses the point. Find the problem first, then look for the ending that settles it.",
          "故事的结尾必须**解决它的问题**。如果风筝卡在树上，结尾就要讲它是怎样下来的。\n\n让问题原封不动的结尾没有讲完故事，解决别的问题的结尾则偏离了重点。先找出问题，再找解决它的结尾。",
        ),
        askGenerator(solvingEndBank),
      ),
      point(
        "an-ending-that-fits",
        t("An Ending That Fits the Characters", "符合角色的结尾"),
        t(
          "A good ending also **fits the characters**. They solve the problem themselves, in a way that matches what they want and who they are: Lin wants her kite back, so she asks for help to get it.\n\nAn ending where magic suddenly fixes everything comes from nowhere, and one where a character stops wanting what they wanted does not fit.",
          "好的结尾还要**符合角色**。角色亲自解决问题，方式符合他们的愿望和性格：Lin 想要回她的风筝，所以她请人帮忙把它取下来。\n\n突然出现魔法把一切都解决的结尾来得毫无来由；角色突然不再想要自己一直想要的东西，这样的结尾也不符合角色。",
        ),
        askGenerator(fittingEndBank),
      ),
    ],
  ),
  topic(
    "linking-reasons-to-an-opinion",
    t("Linking Reasons to an Opinion", "把理由和观点连起来"),
    t(
      "An opinion is followed by reasons joined with because, since, therefore and for example.",
      "观点后面跟着理由，用 because、since、therefore 和 for example 连接起来。",
    ),
    ["expanding-with-because-but-so"],
    [
      point(
        "the-reason-that-supports",
        t("The Reason That Supports", "支持观点的理由"),
        t(
          "An **opinion** says what someone thinks: *Dogs make better pets than goldfish.* A **reason** tells why, and a good reason makes a reader more likely to agree: *you can play with a dog*.\n\nA reason for the other side argues against the opinion, and a fact that is simply true, like *dogs have four legs*, gives no reason at all.",
          "**观点**说出某人的想法：*Dogs make better pets than goldfish.* **理由**说明为什么，好的理由会让读者更愿意赞同：*你可以和狗一起玩*。\n\n支持另一方的理由反驳了这个观点；而只是真实的事实，比如*狗有四条腿*，根本不算理由。",
        ),
        askGenerator(reasonBank),
      ),
      point(
        "the-linking-word",
        t("The Linking Word", "连接词"),
        t(
          "Linking words show how ideas connect. **Because** and **since** come before a reason: *Dogs are good pets because they are loyal.* **Therefore** comes before a result that follows: *Bikes do not pollute. Therefore, more people should ride them.* **For example** comes before an example.\n\nRead what comes after the gap, then choose the word that does that job.",
          "连接词表明想法之间怎样联系。**because** 和 **since** 放在原因前面：*Dogs are good pets because they are loyal.* **therefore** 放在随之而来的结果前面：*Bikes do not pollute. Therefore, more people should ride them.* **for example** 放在例子前面。\n\n读一读空白后面的内容，再选择起这个作用的词。",
        ),
        askGenerator(linkBank),
      ),
    ],
  ),
  topic(
    "strong-verbs",
    t("Strong Verbs", "生动的动词"),
    t(
      "A strong verb shows exactly how something moves or sounds, like the leaves skittered rather than the leaves went.",
      "生动的动词准确地表现事物怎样移动或发出什么声音，比如用 the leaves skittered 而不是 the leaves went。",
    ),
    ["action-and-linking-verbs"],
    [
      point(
        "the-verb-that-fits-the-meaning",
        t("The Verb That Fits the Meaning", "符合意思的动词"),
        t(
          "A **strong verb** paints a picture. *Went* says only that the leaves moved; *skittered* shows them moving quickly and lightly, and *crept* would show them moving slowly.\n\nStrong verbs are not all alike: each shows its own way of moving or sounding. Choose the one whose meaning matches what the writer wants to show.",
          "**生动的动词**能描绘出画面。*went* 只说明叶子动了；*skittered* 表现出它们又快又轻地移动，而 *crept* 表现的是慢慢地移动。\n\n生动的动词并不都一样：每个都表现自己特有的动作或声音。选择意思和作者想表现的内容相符的那个。",
        ),
        askGenerator(strongVerbBank),
      ),
      point(
        "replacing-a-weak-verb",
        t("Replacing a Weak Verb", "替换弱动词"),
        t(
          "**Weak verbs** such as *went*, *said*, *ate* and *moved* tell what happened but not how. To make a sentence stronger, replace the weak verb with one that shows how.\n\nUse the clues in the sentence: *at top speed* calls for *galloped*, not *tiptoed*; *so softly* calls for *whispered*, not *bellowed*.",
          "像 *went*、*said*、*ate*、*moved* 这样的**弱动词**只说出发生了什么，却没有说怎样发生。要让句子更有力，就用能表现方式的动词替换弱动词。\n\n利用句子里的线索：*at top speed* 需要 *galloped* 而不是 *tiptoed*；*so softly* 需要 *whispered* 而不是 *bellowed*。",
        ),
        askGenerator(replaceBank),
      ),
    ],
  ),
];
