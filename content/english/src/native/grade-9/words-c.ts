// Grade 9: the batches of words of injuries, of illness, of sport, of cooking, of taste, of weather, of pets and
// of clothes.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const injuries = batch(
  "words-of-injuries",
  ["Words of Injuries", "受伤的词"],
  ["hurts to the body and what doctors use to treat them", "身体的伤及医生的治疗用品"],
  `
  bruise|a dark mark on the skin from a blow; to cause one|瘀伤；碰伤|After the fall, a dark ___ appeared on his arm.|Apples ___ easily.|The ___ turned purple.|scar,swollen|bruised,bruises
  scar|a mark left on the skin after a wound heals|伤疤|The cut left a ___.|He has an old ___ on his chin from a fall years ago.|The war left a deep ___ on the nation.|bruise,splinter|scarred,scars
  splinter|a small sharp piece of wood stuck in the skin|木刺|I got a ___ in my finger.|Pull out the ___ with tweezers.|A ___ of glass cut her.|scar,splint|splinters
  fracture|a crack or break in a bone; to break|骨折；断裂|She had a ___ in her wrist.|The fall may ___ his leg.|The X-ray showed a ___.|concussion,sling|fractured
  concussion|a brain injury from a blow to the head|脑震荡|He hit his head and got a ___ in the game.|Helmets help prevent a ___.|A ___ can cause headaches.|fracture,swollen|concussions
  swollen|larger than normal because of injury or illness|肿胀的|Her ankle was ___.|The river was ___ with rain.|His eyes were ___ from crying.|bruise,concussion|swelling
  bandage|a strip of cloth for covering a wound; to cover one|绷带；用绷带包扎|Put a ___ on the cut.|The nurse began to ___ his arm.|Change the ___ daily.|splint,sling|bandaged,bandages
  splint|a strip of rigid material used to hold a broken bone still|夹板|The doctor put a ___ on her broken finger to keep it straight.|Use a stick as a ___.|A stiff ___ held his broken finger still for weeks.|bandage,crutch|splints
  sling|a strap that supports an injured arm; to throw|吊带；抛掷|Her arm hung in a ___ around her neck.|Don't ___ your bag on the bed.|He wore his arm in a ___ after the fall.|crutch,splint|slung
  crutch|a stick that helps an injured person walk|拐杖|He walked with a ___.|With a broken leg, she must lean on a ___ for a month.|Don't use TV as a ___.|sling,bandage|crutches
  `,
);

const illness = batch(
  "words-of-illness",
  ["Words of Illness", "生病的词"],
  ["the signs of being unwell", "身体不适的症状"],
  `
  fever|an abnormally high body temperature|发烧|She has a high ___.|The ___ broke in the night.|A ___ is a sign of infection.|cough,migraine|feverish,fevers
  cough|to push air out of the lungs with a sudden noise|咳嗽|Cover your mouth when you ___.|His dry ___ kept everyone awake.|The smoke made me ___.|sneeze,ache|coughed,coughing
  sneeze|to blow air out of the nose suddenly|打喷嚏|Dust tickles my nose and makes me ___.|She gave a loud ___.|Cats make him ___ again and again: achoo!|cough,itch|sneezed,sneezing
  itch|an uncomfortable feeling that makes one want to scratch|痒|Mosquito bites ___.|I have an ___ on my back.|Don't scratch the ___.|ache,sneeze|itchy,itched
  ache|a continuous dull pain; to feel it|疼痛；疼|My legs ___ after the run.|She has a tooth ___.|His heart began to ___ for home.|itch,dizzy|ached,aching
  migraine|a severe headache, often with sickness|偏头痛|She gets a ___ from bright light.|A pounding ___ kept him in a dark room all day.|Stress may cause a ___.|fever,nausea|migraines
  nausea|a feeling of sickness with an urge to vomit|恶心|Boats give me ___.|The drug may cause ___.|A wave of ___ hit her.|migraine,dizzy|nauseous
  dizzy|having a feeling of spinning and losing balance|头晕的|I feel ___.|The ride made me ___.|She got ___ at the top.|nausea,ache|dizziness
  allergy|a bad reaction of the body to a substance|过敏|He has a nut ___.|My ___ to cats is bad.|An ___ can be dangerous.|fever,stitches|allergic,allergies
  stitches|loops of thread used to close a wound|缝针|He needed ten ___.|The nurse took out the ___.|The ___ will heal in a week.|fever,allergy|
  `,
);

const sport = batch(
  "words-of-sport",
  ["Words of Sport", "体育的词"],
  ["games, the people in them, the prizes and the places", "比赛、参赛者、奖杯与场地"],
  `
  coach|a person who trains a team; to train|教练；训练|The ___ shouted from the side.|She will ___ the girls' team.|Listen to your ___.|umpire,underdog|coached,coaching
  umpire|an official who watches a game to enforce the rules|裁判|The ___ called him out.|Don't argue with the ___.|The ___ stopped play.|coach,trophy|umpires
  trophy|a cup or prize for winning|奖杯|The team won the ___.|The ___ sits on the shelf.|She lifted the ___.|stadium,relay|trophies
  stadium|a large sports ground with seats|体育场|The ___ holds 50,000.|We went to the ___.|The ___ was packed.|trophy,knockout|stadiums
  tackle|to try to take the ball from; to deal with a problem|抢断；处理|He made a hard ___.|We must ___ the problem.|Don't ___ from behind.|dribble,rematch|tackled
  dribble|to move a ball with small kicks or bounces; to let liquid run from the mouth|运球；流口水|He likes to ___ past players.|Babies ___.|She can ___ with both feet.|tackle,relay|dribbled
  relay|a race in which team members take turns; to pass on|接力赛；传达|Our four runners won the ___.|Please ___ the message.|She ran the last leg of the ___.|dribble,trophy|relayed,relays
  knockout|a blow that ends a fight; a contest in which losers leave|击倒；淘汰赛|He won by a ___.|The ___ stage begins today.|The dress is a ___.|rematch,stadium|knockouts
  rematch|a second game between the same opponents|复赛|They asked for a ___.|The ___ is in May.|She lost the first game but won the ___.|knockout,underdog|rematches
  underdog|a competitor thought to have little chance of winning|劣势一方|Everyone loves the ___.|The ___ won the cup.|We were the ___.|rematch,coach|underdogs
  `,
);

const cooking = batch(
  "words-of-cooking",
  ["Words of Cooking", "烹饪的词"],
  ["ways of cooking, mixing and preparing food", "烹调、搅拌与备餐"],
  `
  roast|to cook in an oven or over a fire; meat cooked this way|烤；烤肉|___ the chicken in the oven for an hour.|We had a Sunday ___.|They ___ nuts on the fire.|grill,marinate|roasted
  grill|to cook on a metal frame over heat; such a frame|烧烤；烤架|___ the fish on the barbecue for five minutes.|Light the ___.|They ___ burgers in the yard.|roast,skewer|grilled
  marinate|to soak food in a sauce before cooking|腌泡|___ the meat overnight.|She likes to ___ chicken in lemon.|Let it ___ in the sauce for an hour.|roast,whisk|marinated,marinade
  skewer|a long pin used to hold food while cooking|烤肉签|Put the meat on a ___.|Test the cake with a ___.|Thread the onions onto a ___.|grill,whisk|skewers,skewered
  whisk|a tool for beating eggs or cream; to beat|打蛋器；搅打|___ the eggs well.|Use a ___ for the cream.|She would ___ the sauce.|batter,dough|whisked
  batter|a mix of flour, eggs and milk; to hit hard|面糊；猛击|Pour the ___ into the pan.|Waves ___ the coast.|Fish in ___ is tasty.|dough,whisk|battered
  dough|a thick mix of flour and water for baking|面团|Knead the ___.|The ___ must rise.|Roll out the ___.|batter,garnish|
  garnish|a small piece of food used to decorate a dish; to decorate|装饰菜；点缀|Add a ___ of parsley.|___ the soup with cream.|The ___ looked nice.|seasoning,dough|garnished
  seasoning|salt, pepper or spices added to food|调味品|Add ___ to taste.|The soup needs more ___.|She used little ___, just a pinch of salt.|garnish,utensil|season
  utensil|a tool used in the kitchen|器皿|A spoon is a ___.|Wash every ___ in the drawer: forks, knives and spoons.|Each ___ has its place.|seasoning,skewer|utensils
  `,
);

const taste = batch(
  "words-of-taste-and-texture",
  ["Words of Taste and Texture", "味道与口感的词"],
  ["how food tastes and feels in the mouth", "食物的味道与口感"],
  `
  spicy|strongly flavored with spice|辣的|I like ___ food with lots of chili.|The curry is ___.|Is the chili too ___ for you?|tangy,savory|
  tangy|having a strong sharp taste|味道浓烈的|The lemon sauce is ___.|Orange juice has a ___, fresh taste.|The lime drink was sour and ___.|spicy,bitter|
  savory|salty or spicy rather than sweet|咸香的|I prefer ___ snacks like cheese to sweet ones.|A ___ pie of meat and onions.|The dish is ___, salty rather than sweet.|tangy,juicy|
  bitter|having a sharp unpleasant taste; angry and hurt|苦的；怨恨的|Black coffee without sugar tastes ___.|She was ___ about losing.|A ___ wind blew.|tangy,stale|bitterly,bitterness
  juicy|full of juice|多汁的|The ripe peach is so ___ it drips.|A ___ orange dripped down my chin.|She heard some ___ gossip.|tender,crispy|juicier
  tender|soft and easy to cut or chew; gentle; painful|嫩的；温柔的；疼痛的|The meat is so ___ it falls apart.|She gave a ___ smile.|My knee is ___.|juicy,soggy|tenderly,tenderness
  crispy|firm and pleasantly crunchy|酥脆的|I like my bacon ___, so it crunches.|The fries are golden and ___.|A ___ crust cracks when you bite it.|soggy,greasy|crispier
  soggy|wet and soft|湿软的|The cereal went ___ in the milk.|My shoes were ___.|Nobody likes wet, ___ chips.|crispy,stale|
  stale|no longer fresh|不新鲜的|The old bread is hard and ___.|The air was ___.|His jokes are ___.|soggy,bitter|
  greasy|covered with or full of fat or oil|油腻的|The food was ___ with too much oil.|Wash your ___ hands.|He has ___ hair.|crispy,savory|grease
  `,
);

const weather = batch(
  "words-of-weather",
  ["Words of Weather", "天气的词"],
  ["storms, rain, heat and cold", "风暴、雨、炎热与寒冷"],
  `
  thunder|the loud noise after lightning|雷声|We heard ___ in the distance.|The ___ shook the house.|Dogs fear the loud boom of ___.|lightning,hail|thundered,thunderous
  lightning|a flash of light in the sky in a storm|闪电|___ lit up the sky.|A tree was hit by ___.|She ran like ___.|thunder,downpour|
  hail|small balls of ice falling like rain; to call out to|冰雹；招呼|___ broke the windows.|She tried to ___ a taxi.|The ___ hurt the crops.|icicle,thunder|hailed,hailstone
  downpour|a heavy fall of rain|倾盆大雨|We got caught in a ___.|The ___ flooded the road.|A sudden ___ began.|hail,damp|downpours
  damp|slightly wet|潮湿的|The towel is ___.|The ___ air in the cellar smells of mold.|Wipe it with a ___ cloth.|muggy,chilly|dampness,dampen
  muggy|unpleasantly warm and wet|闷热的|It's hot and ___ today.|The ___ air made us tired.|A ___ summer night.|damp,heatwave|
  heatwave|a period of very hot weather|热浪|The ___ lasted a week.|Crops died in the ___.|Stay cool in a ___.|muggy,downpour|heatwaves
  chilly|uncomfortably cool|寒冷的|It's ___ outside, so wear a sweater.|She gave him a ___ look.|Wear gloves; it's ___ this morning.|breezy,damp|chill,chillier
  breezy|pleasantly windy; relaxed and cheerful|有微风的；轻松愉快的|It was a ___ day, good for flying kites.|She has a ___ manner.|The ___ coast kept the sails full.|chilly,icicle|
  icicle|a hanging spike of ice|冰柱|An ___ hung from the roof.|The ___ began to melt.|Kids broke off an ___.|hail,breezy|icicles
  `,
);

const pets = batch(
  "words-of-pets",
  ["Words of Pets", "宠物的词"],
  ["caring for animals and the sounds they make", "照顾动物与它们的叫声"],
  `
  leash|a strap for leading a dog|狗绳|Keep your dog on a ___.|She held the ___ tight.|The dog pulled at the ___ in my hand.|collar,muzzle|leashes
  collar|a band around an animal's neck; the part of a shirt around the neck|项圈；衣领|The dog's ___ has a tag.|Turn up your ___.|Her shirt ___ was dirty.|leash,muzzle|collars
  muzzle|the nose and mouth of an animal; a guard over it|口鼻；口套|The dog must wear a ___ so it can't bite.|The horse's ___ was soft.|Put a ___ over his mouth.|leash,kennel|muzzled
  kennel|a small shelter for a dog; a place where dogs are kept|狗窝；寄养所|The dog sleeps in a ___.|We left him at the ___.|Build the dog a wooden ___.|muzzle,stray|kennels
  stray|an animal with no home; to move away from the right place|流浪动物；偏离|We fed a ___ cat.|Don't ___ from the path.|The ___ followed us home.|tame,kennel|strayed,strays
  tame|not wild; to make gentle|驯服的；驯服|The fox was ___.|It is hard to ___ a horse.|The party was ___.|stray,groom|tamed
  groom|to clean an animal's fur; a man about to marry|梳理(毛)；新郎|___ your dog each week.|The ___ kissed the bride.|Cats ___ themselves.|tame,veterinarian|groomed,grooming
  veterinarian|a doctor for animals|兽医|Take the cat to the ___.|She wants to be a ___.|The ___ checked the horse.|groom,purr|vet,veterinarians
  purr|the low sound a happy cat makes; to make it|呼噜声|The cat began to ___.|I love the ___ of a kitten.|The engine began to ___.|growl,leash|purred
  growl|a low angry sound; to make it|咆哮|The dog began to ___.|We heard an angry ___.|My stomach began to ___.|purr,collar|growled
  `,
);

const clothes = batch(
  "words-of-clothes",
  ["Words of Clothes", "衣物的词"],
  ["parts of clothes, cloth and what we wear", "衣服的部件、布料与穿着"],
  `
  sleeve|the part of a garment covering the arm|袖子|Roll up your ___.|The ___ is torn at the elbow.|She wiped her nose on her ___.|zipper,seam|sleeves,sleeveless
  zipper|a fastener of two rows of teeth|拉链|The ___ on my jacket is stuck halfway.|Pull up your ___ to close your coat.|My bag's ___ broke.|buckle,sleeve|zippers
  buckle|a clasp for a belt; to fasten; to bend under pressure|扣环；扣上；弯曲|___ your seat belt.|The ___ on his belt is gold.|His knees began to ___.|zipper,seam|buckled
  seam|a line where two pieces of cloth are sewn|接缝|The ___ where the cloth was sewn split.|Sew along the ___.|A ___ of coal ran through the rock.|sleeve,tailor|seams
  fabric|cloth|布料|The silk ___ is soft.|They sell ___ by the meter.|The ___ of society.|denim,outfit|fabrics
  denim|a strong cotton cloth used for jeans|牛仔布|He wore a ___ jacket.|Blue jeans are made of ___.|Cowboys wore tough ___ trousers.|fabric,fashion|
  tailor|a person who makes clothes; to make to fit|裁缝；定制|The ___ made his suit.|We can ___ the course to you.|Ask the ___ to take in your trousers.|outfit,seam|tailored,tailors
  outfit|a set of clothes worn together|全套服装|What a nice ___ for the party: dress, hat and shoes.|She bought a new ___.|He wore a cowboy ___.|wardrobe,fabric|outfits
  wardrobe|a cupboard for clothes; one's collection of clothes|衣柜；全部衣服|Hang it in the ___.|She has a big ___.|Update your ___ with clothes for the new season.|outfit,fashion|wardrobes
  fashion|a popular style; a way of doing|时尚；方式|It is the latest ___.|She studies ___.|He spoke in a strange ___.|wardrobe,denim|fashionable
  `,
);

/** batchesC are the batches of injuries, illness, sport, cooking, taste, weather, pets and clothes. */
export const batchesC: readonly BatchSpec[] = [injuries, illness, sport, cooking, taste, weather, pets, clothes];
