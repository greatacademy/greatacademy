// Grade 12: the batches of words of food and appetite, of the build of the body, of ill will, of obedience, of
// wandering, of riches and want, of clear and muddled writing, of inheritance, of ships and of pirates.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const food = batch(
  "words-of-taste-and-appetite",
  ["Words of Taste and Appetite", "口味与食欲的词"],
  ["fine food, the people who love it and hunger", "美食、爱美食的人与饥饿"],
  `
  gourmet|a connoisseur of good food; of high quality|美食家；美味的|The ___, an expert on fine food, praised the delicate sauce and named every herb in it.|As a true ___, he could tell from one taste which valley the cheese came from.|Only a ___, a person with a deeply expert palate, would notice that the wine was a year too young.|glutton,gastronomy|gourmets
  gastronomy|the practice or art of choosing, cooking and eating good food|烹饪法，美食学|Lyon is famous for its ___, the fine art of cooking and eating well.|She wrote a history of French ___, the country's long tradition of cooking and eating good food.|The festival celebrates local ___, the art of the region's cooks and their best dishes.|gourmand,glutton|gastronomic
  epicure|a person who takes particular pleasure in fine food and drink|美食家，讲究饮食的人|The ___ tasted the wine slowly, taking deep pleasure in every fine sip.|Only a true ___, a lover of fine food, could tell the two rare cheeses apart.|He was a true ___ who took great pleasure in fine dishes and hated fast food.|glutton,gastronomy|epicurean
  glutton|a person who eats far too much; one very eager for something|贪吃的人；酷爱…的人|The ___ ate the whole cake by himself, far more than anyone should eat.|She is a real ___ for hard work, always eager for more, never satisfied.|Don't be such a greedy ___; you have eaten far too much already, so leave some for others.|epicure,gourmet|gluttony
  gourmand|a person who enjoys eating, often too much|嗜吃的人|The ___ ordered three desserts, loving food so much that he ate far more than he needed.|He was a cheerful ___ who cared more about large helpings than about fine cooking.|A true ___, who loves to eat and eat, never refuses second helpings.|gastronomy,epicure|gourmands
  voracious|wanting great quantities of food; very eager|贪婪的，如饥似渴的|She is a ___ reader, eagerly finishing three books a week.|The ___ caterpillars, wanting more and more, ate every leaf on the tree.|He has a ___ appetite and eats huge plates of food, always wanting more.|succulent,palatable|voraciously
  ravenous|extremely hungry|饥肠辘辘的|After the long hike we were ___, so hungry that we could have eaten anything.|The ___ wolves, starving after the hard winter, circled the camp.|He came home ___ from football practice and, desperately hungry, ate two plates.|delectable,palatable|ravenously
  delectable|delicious; delightful|美味的；令人愉快的|The baker made a ___ pie, so delicious that everyone asked for another slice.|A ___ smell of fresh bread, delicious and warm, came from the kitchen.|They served ___ little cakes that tasted wonderful.|ravenous,voracious|
  succulent|tender, juicy and tasty|多汁的|The chef served a ___ steak, tender and full of juice.|Ripe, ___ peaches, heavy with sweet juice, hung from the tree.|The roast was ___ and pink, juicy and tender in every slice.|voracious,ravenous|
  palatable|pleasant to taste; acceptable|可口的；可接受的|The soup was barely ___; it tasted only just good enough to eat.|They changed the plan to make it ___ to voters, something they could accept.|Add a little salt to make the dish ___, pleasant enough to eat.|voracious,ravenous|unpalatable
  `,
  "context-clues",
  {
    intro: t(
      "The **epicure** sipped his wine slowly, the **gourmand** ordered a third dessert, and the **ravenous** children fell on the **succulent** roast. These ten words help you talk about fine food, the people who love it and hunger.",
      "讲究饮食的人（**epicure**）慢慢品着葡萄酒，嗜吃的人（**gourmand**）点了第三份甜点，饥肠辘辘的（**ravenous**）孩子们则扑向那块多汁的（**succulent**）烤肉。这十个词帮你谈论美食、热爱美食的人以及饥饿。",
    ),
    watchOut: {
      meanings: t(
        "A **gourmet** and an **epicure** are *experts* who enjoy fine food; a **gourmand** loves *eating*, often too much; a **glutton** simply eats *far too much*; **gastronomy** is the *art* itself, not a person.",
        "**gourmet** 和 **epicure** 是懂行、讲究美食的*行家*；**gourmand** 是爱*吃*、常吃得过多的人；**glutton** 就是*吃得太多*的人；**gastronomy** 是美食这门*艺术*本身，不是人。",
      ),
      use: t(
        "**Ravenous** describes being *very hungry* now; **voracious** describes a *big, eager appetite*, for food or for books; **palatable** means only *good enough*, while **delectable** means *delicious*.",
        "**ravenous** 指此刻*非常饿*；**voracious** 指*胃口大、如饥似渴*，可以是对食物也可以是对书；**palatable** 只是*还算可口*，**delectable** 则是*美味极了*。",
      ),
      spelling: t(
        "**Gourmet** ends in a silent *t*; **gourmand** ends in *-and*; **epicure** has *-cure*; **succulent** has a double *c*; **palatable** has *-lat-*.",
        "**gourmet** 结尾的 t 不发音；**gourmand** 结尾是 -and；**epicure** 结尾是 -cure；**succulent** 双写 c；**palatable** 中间是 -lat-。",
      ),
    },
    notes: `
      gourmet|an expert on fine food naming every herb in a sauce|a taster telling from one bite which valley a cheese came from|a deeply expert palate noticing a wine a year too young|a gourmet is an expert on fine food; a glutton just eats too much|gourmet 美食行家；glutton 贪吃的人|glutton is a person who eats far too much, not an expert who notices fine details of taste|glutton 指吃得太多的人，不是能尝出细微差别的行家|gastronomy is the art of good food, not a person who tastes and judges it|gastronomy 指美食艺术，不是品尝鉴别美食的人|gour · met|gour- plus -met, with a silent t|gour- 加 -met，t 不发音
      gastronomy|the fine art of cooking and eating well for which Lyon is famous|a country's long tradition of cooking and eating good food|the art of a region's cooks and their best dishes|gastronomy is the art of good food; a gourmand is a person who loves eating|gastronomy 美食艺术；gourmand 嗜吃的人|gourmand is a person who loves eating, not the art or tradition of cooking|gourmand 指爱吃的人，不是烹饪艺术或传统|glutton is a person who eats too much, not the fine art of a city or country|glutton 指贪吃的人，不是城市或国家的烹饪艺术|gas · tron · o · my|gastro- for stomach, then -nomy|gastro- 表示“胃”，再接 -nomy
      epicure|a person taking deep pleasure in every fine sip of wine|a lover of fine food telling two rare cheeses apart|a man who loved fine dishes and hated fast food|an epicure takes pleasure in fine food; a glutton eats too much|epicure 讲究饮食的人；glutton 贪吃的人|glutton is someone who eats far too much, not someone who tastes slowly for pleasure|glutton 指吃得太多的人，不是慢慢品味享受的人|gastronomy is the art of good food, not a person who enjoys it|gastronomy 指美食艺术，不是享受美食的人|ep · i · cure|epi- plus -cure|epi- 加 -cure
      glutton|a man eating a whole cake by himself|a worker always eager for more and never satisfied|a greedy eater who has eaten far too much|a glutton eats far too much; an epicure enjoys fine food with care|glutton 贪吃；epicure 讲究品味|epicure is someone who enjoys fine food with care, not someone who eats far too much|epicure 指细细品味美食的人，不是吃得太多的人|gourmet is an expert on fine food, not a greedy eater who never has enough|gourmet 指美食行家，不是贪得无厌的吃货|glut · ton|glut plus -ton, with a double t|glut 加 -ton，双写 t
      gourmand|a diner ordering three desserts and eating far more than needed|a cheerful eater caring more about large helpings than fine cooking|an eater who never refuses second helpings|a gourmand loves eating, often too much; an epicure cares about fine taste|gourmand 嗜吃；epicure 讲究品味|gastronomy is the art of good food, not a person who orders three desserts|gastronomy 指美食艺术，不是点三份甜点的人|epicure cares about fine cooking, the opposite of caring more about large helpings|epicure 讲究精致的烹饪，和只在乎分量大正相反|gour · mand|gour- plus -mand, ending in -and|gour- 加 -mand，结尾 -and
      voracious|a reader eagerly finishing three books a week|caterpillars eating every leaf on a tree|a huge appetite always wanting more food|voracious means wanting great quantities; succulent means juicy|voracious 贪婪的；succulent 多汁的|succulent means tender and juicy, which describes food, not an eager reader or eater|succulent 指多汁鲜嫩，形容食物，不形容如饥似渴的读者或食客|palatable means pleasant enough to taste, which describes food, not a huge appetite|palatable 指还算可口，形容食物，不形容大胃口|vo · ra · cious|vor- plus -acious|vor- 加 -acious
      ravenous|hikers so hungry they could eat anything|wolves starving after a hard winter|a boy desperately hungry after practice|ravenous means extremely hungry; delectable means delicious|ravenous 饥肠辘辘；delectable 美味|delectable means delicious, which describes food, not hungry hikers|delectable 指美味，形容食物，不形容饥饿的徒步者|palatable means pleasant to taste, which describes food, not starving wolves|palatable 指可口，形容食物，不形容饥饿的狼|rav · en · ous|raven plus -ous|raven 加 -ous
      delectable|a pie so delicious everyone asked for more|a delicious, warm smell of fresh bread|little cakes that tasted wonderful|delectable means delicious; ravenous means very hungry|delectable 美味；ravenous 饥饿|ravenous means extremely hungry, which describes people or animals, not a pie|ravenous 指非常饿，形容人或动物，不形容馅饼|voracious means having a huge appetite, which describes eaters, not cakes or smells|voracious 指胃口大，形容食客，不形容蛋糕或香味|de · lec · ta · ble|de- plus -lect- plus -able|de- 加 -lect- 再加 -able
      succulent|a steak tender and full of juice|peaches heavy with sweet juice|a roast juicy and tender in every slice|succulent means juicy and tender; voracious means hungry for a lot|succulent 多汁；voracious 贪吃|voracious means wanting great quantities of food, which describes eaters, not a juicy steak|voracious 指贪吃，形容食客，不形容多汁的牛排|ravenous means extremely hungry, which describes eaters, not ripe peaches|ravenous 指非常饿，形容食客，不形容熟透的桃子|suc · cu · lent|the double c, then -ulent|双写 c，结尾 -ulent
      palatable|soup only just good enough to eat|a plan changed so voters could accept it|a little salt making a dish pleasant enough to eat|palatable means acceptable or pleasant enough; delectable means delicious|palatable 还算可口；delectable 美味|voracious means having a huge appetite, which describes eaters, not soup or a plan|voracious 指胃口大，形容食客，不形容汤或计划|ravenous means extremely hungry, which describes eaters, not a dish or a plan voters accept|ravenous 指非常饿，形容食客，不形容菜肴或选民能接受的计划|pal · at · a · ble|palate drops its e before -able|palate 去掉 e 再加 -able
    `,
  },
);

const build = batch(
  "words-for-the-build-of-the-body",
  ["Words for the Build of the Body", "体型的词"],
  ["thin and stout, weak and strong", "瘦与胖，弱与强"],
  `
  frail|weak and delicate|虚弱的，脆弱的|Her ___ grandmother, weak and thin, needs help to stand.|The ___ old bridge, weak and delicate, creaked in the wind.|He looked ___ after the illness, thin and weak, barely able to walk.|sturdy,brawny|frailty
  sturdy|strongly and solidly built|结实的，坚固的|Buy some ___ boots, strongly made to last for years of hard walking.|The ___ table, solidly built of oak, held the weight of the piano.|The ___ little pony, strong and solidly built, carried all the bags up the hill.|frail,emaciated|sturdily
  brawny|physically strong; muscular|强壮的，肌肉发达的|The ___ farmer, all muscle, lifted the heavy sack with one hand.|The ___ guard, big and muscular, blocked the door.|He had ___ arms, thick with muscle from years of rowing.|svelte,lanky|brawn
  emaciated|abnormally thin or weak, especially from illness or lack of food|消瘦的，憔悴的|The ___ dog had not eaten for days, and every rib showed.|Prisoners were found ___ and ill, little more than skin and bone after months of hunger.|Her ___ face, hollow and thin, showed years of hunger.|portly,corpulent|emaciation
  portly|having a stout body; somewhat fat, especially of an older man|发福的，肥胖的|A ___ old gentleman, round and stout, sat in the armchair.|The ___ mayor, his waistcoat stretched over his round belly, cut the ribbon.|He grew ___ in middle age, his waist getting stouter every year.|lanky,svelte|
  corpulent|large and fat|肥胖的|The ___ king, so fat and heavy, could barely climb onto his horse.|A huge, ___ man, large and fat, filled the doorway.|The doctor warned the ___ patient, who was badly overweight, to diet.|svelte,lanky|corpulence
  svelte|slender and elegant|苗条的，体态优美的|The ___ dancer, slim and graceful, moved across the stage.|She looked ___ in her black dress, slender and elegant.|The ___ cat, slim and elegant, leapt lightly onto the wall.|corpulent,burly|
  lanky|tall, thin and awkward-looking|瘦长的|A ___ teenager, tall and thin, ducked awkwardly through the low door.|The ___ boy, all long thin arms and legs, tripped over his own feet.|He was ___ but strong, tall and thin with long, awkward limbs.|stocky,portly|lankiness
  stocky|short and broad and solidly built|矮壮的|The ___ wrestler, short and broad, was almost impossible to move.|A ___ man with a beard, short and thickset, ran the shop.|On the mountain paths, ___ ponies, short and solidly built, are better than tall horses.|lanky,svelte|
  burly|large and strong; heavily built|魁梧的|Two ___ men, big and heavily built, carried the piano up the stairs.|The ___ bouncer, large and strong, stood at the door.|The ___ sailor, huge and powerful, hauled the rope alone.|frail,svelte|
  `,
  "context-clues",
  {
    intro: t(
      "At the gym a **burly** weightlifter, a **lanky** basketball player and a **svelte** dancer trained side by side, while a **portly** old man pedaled slowly on a bike. These ten words help you describe the build of the body: thin and stout, weak and strong.",
      "健身房里，一个魁梧的（**burly**）举重运动员、一个瘦长的（**lanky**）篮球运动员和一个体态优美的（**svelte**）舞者并肩训练，一位发福的（**portly**）老人则在单车上慢慢地蹬着。这十个词帮你描写体型：瘦与胖，弱与强。",
    ),
    watchOut: {
      meanings: t(
        "**Svelte** is thin and *elegant*; **lanky** is thin and *awkward*; **emaciated** is thin from *hunger or illness*; **frail** is *weak and delicate*.",
        "**svelte** 是苗条而*优雅*；**lanky** 是瘦长而*笨拙*；**emaciated** 是因*饥饿或疾病*而消瘦；**frail** 是*虚弱、脆弱*。",
      ),
      use: t(
        "**Portly** is a polite word for a *stout*, often older man; **corpulent** is more plainly *fat*; **stocky** is *short and broad*; **burly** and **brawny** are *big and strong*.",
        "**portly** 是形容*发福*、多指年长男子的委婉说法；**corpulent** 更直白地指*肥胖*；**stocky** 是*矮而壮*；**burly** 和 **brawny** 是*高大强壮*。",
      ),
      spelling: t(
        "**Emaciated** has *-mac-* and ends in *-iated*; **corpulent** has *-pul-*; **svelte** ends in *-te*; **brawny** has *aw*.",
        "**emaciated** 中间是 -mac-，结尾是 -iated；**corpulent** 中间是 -pul-；**svelte** 结尾是 -te；**brawny** 含 aw。",
      ),
    },
    notes: `
      frail|a weak, thin grandmother who needs help to stand|a weak, delicate bridge creaking in the wind|a man thin and weak after illness|frail means weak and delicate; sturdy means strongly built|frail 虚弱；sturdy 结实|sturdy means strongly and solidly built, the opposite of weak and delicate|sturdy 指结实牢固，和虚弱脆弱正相反|brawny means muscular and strong, the opposite of barely able to walk|brawny 指肌肉发达，和几乎走不动正相反|frail|fr- plus -ail, as in nail|fr- 加 -ail，同 nail
      sturdy|boots strongly made for years of hard walking|an oak table solidly built to hold a piano|a pony strong enough to carry all the bags uphill|sturdy means strongly built; frail means weak and delicate|sturdy 结实；frail 脆弱|frail means weak and delicate, the opposite of strongly made to last|frail 指脆弱，和结实耐用正相反|emaciated means abnormally thin from hunger, the opposite of strong and solidly built|emaciated 指因饥饿而极瘦，和强壮结实正相反|stur · dy|stur- plus -dy|stur- 加 -dy
      brawny|a farmer lifting a heavy sack with one hand|a big, muscular guard blocking a door|arms thick with muscle from rowing|brawny means muscular; svelte means slender and elegant|brawny 肌肉发达；svelte 苗条优雅|svelte means slender and elegant, the opposite of big and muscular|svelte 指苗条优雅，和魁梧多肌肉正相反|lanky means tall and thin, the opposite of thick with muscle|lanky 指瘦长，和肌肉粗壮正相反|brawn · y|brawn plus -y|brawn 加 -y
      emaciated|a dog with every rib showing after days without food|prisoners reduced to skin and bone by months of hunger|a hollow, thin face from years of hunger|emaciated means abnormally thin from hunger or illness; corpulent means fat|emaciated 消瘦；corpulent 肥胖|portly means stout and round, the opposite of skin and bone|portly 指发福、圆胖，和皮包骨正相反|corpulent means large and fat, the opposite of every rib showing|corpulent 指肥胖，和根根肋骨可见正相反|e · ma · ci · at · ed|-mac- in the middle, then -iated|中间是 -mac-，结尾 -iated
      portly|a round, stout old gentleman in an armchair|a mayor's waistcoat stretched over his round belly|a waist getting stouter every year in middle age|portly means stout, usually of an older man; lanky means tall and thin|portly 发福；lanky 瘦长|lanky means tall and thin, the opposite of round and stout|lanky 指瘦长，和圆胖正相反|svelte means slender and elegant, the opposite of a stretched waistcoat over a round belly|svelte 指苗条优雅，和背心绷在圆肚子上正相反|port · ly|port plus -ly|port 加 -ly
      corpulent|a king so fat he could barely climb onto his horse|a huge, fat man filling a doorway|a badly overweight patient told to diet|corpulent means large and fat; svelte means slender|corpulent 肥胖；svelte 苗条|svelte means slender and elegant, the opposite of large and fat|svelte 指苗条优雅，和肥胖正相反|lanky means tall and thin, the opposite of badly overweight|lanky 指瘦长，和严重超重正相反|cor · pu · lent|-pul- in the middle, then -ent|中间是 -pul-，结尾 -ent
      svelte|a slim, graceful dancer moving across a stage|a woman slender and elegant in a black dress|a slim, elegant cat leaping lightly onto a wall|svelte means slender and elegant; corpulent means fat|svelte 苗条优雅；corpulent 肥胖|corpulent means large and fat, the opposite of slim and graceful|corpulent 指肥胖，和苗条优雅正相反|burly means large and heavily built, the opposite of slender and light|burly 指魁梧壮实，和纤细轻盈正相反|svelte|sv- plus -elte, ending in -te|sv- 加 -elte，结尾 -te
      lanky|a tall, thin teenager ducking awkwardly through a low door|a boy of long thin arms and legs tripping over his feet|a man tall and thin with long, awkward limbs|lanky means tall, thin and awkward; stocky means short and broad|lanky 瘦长笨拙；stocky 矮壮|stocky means short and broad, the opposite of tall and thin|stocky 指矮壮，和瘦高正相反|portly means stout and round, the opposite of long thin arms and legs|portly 指发福圆胖，和细长的胳膊腿正相反|lank · y|lank plus -y|lank 加 -y
      stocky|a short, broad wrestler almost impossible to move|a short, thickset man with a beard|short, solid ponies better than tall horses on mountain paths|stocky means short and broad; lanky means tall and thin|stocky 矮壮；lanky 瘦长|lanky means tall and thin, the opposite of short and broad|lanky 指瘦高，和矮壮正相反|svelte means slender and elegant, the opposite of short and thickset|svelte 指苗条优雅，和矮胖结实正相反|stock · y|stock plus -y|stock 加 -y
      burly|two big, heavily built men carrying a piano upstairs|a large, strong bouncer at a door|a huge, powerful sailor hauling a rope alone|burly means big and heavily built; frail means weak|burly 魁梧；frail 虚弱|frail means weak and delicate, the opposite of huge and powerful|frail 指虚弱，和高大有力正相反|svelte means slender and elegant, the opposite of big and heavily built|svelte 指苗条优雅，和高大魁梧正相反|bur · ly|bur- plus -ly|bur- 加 -ly
    `,
  },
);

const malice = batch(
  "words-of-envy-and-malice",
  ["Words of Envy and Malice", "嫉妒与恶意的词"],
  ["wanting what others have and wishing them harm", "想要别人所有与希望别人受害"],
  `
  envy|a feeling of wanting what someone else has; to feel this|嫉妒，羡慕|Her shiny new car was the ___ of the street; every neighbor wished it were theirs.|He was eaten up with ___, wanting his brother's fame and fortune for himself.|She felt a stab of ___ when her friend won the prize she had wanted for herself.|misgiving,euphoria|envied
  covet|to want something that belongs to someone else|觊觎，贪求|He would ___ his neighbor's land, longing to own it though it was not his.|Many athletes ___ the gold medal that the champion holds, longing to make it their own.|They ___ power above all, wanting the throne that belongs to their cousin.|malign,bequeath|coveted,covetous
  begrudge|to resent someone having something; to give unwillingly|嫉妒；不情愿地给|I don't ___ her success; she earned it, and I am glad for her.|He seemed to ___ every penny he spent, handing it over slowly and resentfully.|Few would ___ them a holiday after such a hard year; everyone agrees they deserve it.|malign,bequeath|begrudged,begrudgingly
  rancorous|full of bitter, long-lasting resentment|充满怨恨的|The divorce was long and ___, full of bitter resentment on both sides.|The party was split by a ___ debate that left bitter feelings for years.|Their ___ feud, bitter and resentful, lasted forty years.|beneficent,gracious|
  spiteful|showing a wish to hurt or annoy|恶意的，怀恨的|She made a ___ remark about his weight, meant only to hurt him.|The ___ boy broke his sister's toy just to upset her.|Don't be ___ just because you lost; hurting the winner won't help.|beneficent,gracious|spitefully,spite
  malicious|intending to do harm|恶意的|He spread ___ rumors about her, meaning to ruin her name.|The software was ___, written to damage computers and steal passwords.|There was nothing ___ in her joke; she did not mean to hurt anyone.|beneficent,gracious|maliciously,malice
  vindictive|having a strong wish for revenge|报复心强的|The ___ ruler punished every critic, determined to take revenge for each insult.|She was not ___ after the trial and wanted no revenge on the man who had wronged her.|Her ___ ex-partner, wanting revenge for the breakup, posted the photos online.|gracious,beneficent|vindictively,vindictiveness
  malevolent|wishing evil to others|恶毒的，邪恶的|The ___ spirit that haunted the castle wished harm on all who entered.|He gave her a ___ stare, full of hatred and evil wishes.|The ___ witch cursed the baby, wishing it nothing but evil.|beneficent,gracious|malevolence
  malign|to speak harmful untruths about; evil in nature|诽谤；有害的|Don't ___ him behind his back by spreading lies about him.|The press tried to ___ the judge with false stories that damaged her name.|Jealous rivals set out to ___ her good name with untrue rumors.|covet,bequeath|maligned
  beneficent|doing good; generous and kind|行善的，慈善的|The ___ queen, generous and kind, built schools for the poor.|The ___ donor, who wished only to do good, paid for the whole hospital.|They hoped for a ___ outcome, one that would do good for everyone.|malevolent,rancorous|beneficence
  `,
  "context-clues",
  {
    intro: t(
      "Filled with **envy**, the **spiteful** stepsister began to **covet** Cinderella's slipper and to **malign** her with lies, but the **beneficent** fairy set everything right. These ten words help you describe wanting what others have and wishing them harm.",
      "满怀嫉妒（**envy**）的、恶意的（**spiteful**）继姐开始觊觎（**covet**）灰姑娘的水晶鞋，还造谣诽谤（**malign**）她，可行善的（**beneficent**）仙女把一切都纠正了过来。这十个词帮你描写想要别人所有的东西和希望别人受害。",
    ),
    watchOut: {
      meanings: t(
        "**Covet** is to *want* what belongs to another; **begrudge** is to *resent* someone having it; **malign** is to *tell lies* that harm someone; **envy** is the *feeling* itself.",
        "**covet** 是*想要*别人的东西；**begrudge** 是*怨恨*别人拥有它；**malign** 是*造谣*中伤别人；**envy** 是这种*感觉*本身。",
      ),
      use: t(
        "**Vindictive** is about *revenge*; **rancorous** is about *bitterness* that lasts; **malevolent** is about *wishing evil*; **beneficent** is the opposite, *doing good*.",
        "**vindictive** 关乎*报复*；**rancorous** 关乎长久的*怨恨*；**malevolent** 关乎*希望别人遭殃*；**beneficent** 正相反，是*行善*。",
      ),
      spelling: t(
        "**Malevolent** and **beneficent** share *-ent* endings; **rancorous** has *-cor-*; **vindictive** has *-dict-*; **begrudge** ends in *-dge*.",
        "**malevolent** 和 **beneficent** 都以 -ent 结尾；**rancorous** 中间是 -cor-；**vindictive** 中间是 -dict-；**begrudge** 结尾是 -dge。",
      ),
    },
    notes: `
      envy|a new car every neighbor wished were theirs|a man eaten up with wanting his brother's fame and fortune|a stab of feeling when a friend won the prize one wanted|envy is wanting what someone else has; misgiving is doubt|envy 嫉妒；misgiving 疑虑|misgiving is a feeling of doubt or worry, not of wanting what someone else has|misgiving 指疑虑担忧，不是想要别人拥有的东西|euphoria is a feeling of intense happiness, not of wanting another's prize|euphoria 指狂喜，不是想要别人的奖品|en · vy|en- plus -vy|en- 加 -vy
      covet|longing to own a neighbor's land|athletes longing to make a champion's gold medal their own|wanting a throne that belongs to a cousin|covet means to want what belongs to another; bequeath means to leave in a will|covet 觊觎；bequeath 遗赠|malign means to speak lies about someone, not to long to own their land|malign 指造谣中伤，不是渴望拥有别人的土地|bequeath means to give one's own property away in a will, the opposite of wanting another's|bequeath 指立遗嘱把自己的财产留给别人，和想要别人的东西正相反|cov · et|cov- plus -et|cov- 加 -et
      begrudge|a success one is glad about because it was earned|every penny handed over slowly and resentfully|a holiday everyone agrees a family deserves|begrudge means to resent someone having something; malign means to speak lies about them|begrudge 嫉妒、不情愿给；malign 诽谤|malign means to spread lies about someone, not to resent their success or a holiday|malign 指造谣中伤，不是怨恨别人的成功或假期|bequeath means to leave something in a will, not to hand over money resentfully|bequeath 指遗赠，不是不情愿地掏钱|be · grudge|be- plus grudge, ending in -dge|be- 加 grudge，结尾 -dge
      rancorous|a long divorce full of bitter resentment on both sides|a debate leaving bitter feelings for years|a bitter feud lasting forty years|rancorous means full of lasting bitterness; beneficent means doing good|rancorous 充满怨恨；beneficent 行善|beneficent means generous and doing good, the opposite of bitter resentment|beneficent 指慷慨行善，和满怀怨恨正相反|gracious means kind and warm, the opposite of a bitter feud|gracious 指和蔼亲切，和积怨正相反|ran · cor · ous|rancor plus -ous|rancor 加 -ous
      spiteful|a remark about someone's weight meant only to hurt|a boy breaking his sister's toy just to upset her|hurting the winner because one lost|spiteful means wanting to hurt or annoy; gracious means kind and warm|spiteful 恶意；gracious 亲切|beneficent means doing good, the opposite of meaning only to hurt|beneficent 指行善，和存心伤人正相反|gracious means kind and warm, the opposite of breaking a toy to upset someone|gracious 指和蔼亲切，和故意弄坏玩具惹人难过正相反|spite · ful|spite plus -ful, with one l|spite 加 -ful，只有一个 l
      malicious|rumors spread to ruin someone's name|software written to damage computers and steal passwords|a joke not meant to hurt anyone|malicious means meaning harm; beneficent means doing good|malicious 恶意；beneficent 行善|beneficent means doing good, the opposite of written to damage and steal|beneficent 指行善，和用来破坏和盗窃正相反|gracious means kind and polite, the opposite of meaning to ruin someone|gracious 指和蔼有礼，和存心毁人名声正相反|ma · li · cious|malice changes -ce to -cious|malice 的 -ce 变成 -cious
      vindictive|a ruler determined to take revenge for every insult|wanting no revenge on a man who had done wrong|an ex-partner posting photos as revenge for a breakup|vindictive means wanting revenge; gracious means kind and forgiving|vindictive 报复心强；gracious 宽厚亲切|gracious means kind and warm, the opposite of taking revenge for every insult|gracious 指和蔼宽厚，和有仇必报正相反|beneficent means doing good, the opposite of posting photos as revenge|beneficent 指行善，和发照片报复正相反|vin · dic · tive|-dict- in the middle, then -ive|中间是 -dict-，结尾 -ive
      malevolent|a spirit wishing harm on all who entered a castle|a stare full of hatred and evil wishes|a witch cursing a baby and wishing it evil|malevolent means wishing evil; beneficent means doing good|malevolent 恶毒；beneficent 行善|beneficent means generous and doing good, the opposite of wishing harm on all|beneficent 指慷慨行善，和希望人人遭殃正相反|gracious means kind and warm, the opposite of a stare full of hatred|gracious 指和蔼亲切，和满怀恨意的瞪视正相反|ma · lev · o · lent|mal- for bad, then -evolent|mal- 表示“坏”，再接 -evolent
      malign|spreading lies about someone behind his back|false stories damaging a judge's name|untrue rumors aimed at someone's good name|malign means to spread harmful lies; covet means to want what is another's|malign 诽谤；covet 觊觎|covet means to want what belongs to someone else, not to spread lies about them|covet 指觊觎别人的东西，不是造谣中伤|bequeath means to leave property in a will, not to damage someone's name|bequeath 指遗赠财产，不是损害别人的名声|ma · lign|the silent g before n, as in sign|g 在 n 前不发音，同 sign
      beneficent|a generous queen building schools for the poor|a donor paying for a whole hospital to do good|an outcome that would do good for everyone|beneficent means doing good; malevolent means wishing evil|beneficent 行善；malevolent 恶毒|malevolent means wishing evil to others, the opposite of building schools for the poor|malevolent 指恶毒，和为穷人建学校正相反|rancorous means full of bitter resentment, the opposite of doing good for everyone|rancorous 指充满怨恨，和造福所有人正相反|be · nef · i · cent|bene- for good, then -ficent|bene- 表示“好”，再接 -ficent
    `,
  },
);

const obedience = batch(
  "words-of-obedience-and-revolt",
  ["Words of Obedience and Revolt", "服从与反抗的词"],
  ["doing as one is told and refusing to", "照吩咐做与拒绝服从"],
  `
  oppress|to keep people down by cruel, unjust use of power|压迫|The tyrant used soldiers to ___ the people, crushing every protest with cruelty and injustice.|Unjust laws that ___ minorities, keeping them poor and powerless, must change.|The heat began to ___ us, pressing down so cruelly that we could hardly breathe.|propitiate,conciliate|oppressed,oppressor
  docile|ready to accept control; easily taught|温顺的|The ___ old horse, gentle and easy to control, let the child ride it.|The bosses wanted ___ workers who would accept every order without complaint.|A quiet, willing, ___ puppy is easy to train.|unruly,rebellious|docility
  subservient|too willing to obey others; less important|恭顺的，屈从的|She refused to be ___ to her boss, bowing to his every wish.|The press was ___ to the government, printing whatever it was told.|In that firm, his own needs were always ___ to the company's, treated as less important.|insubordinate,rebellious|subservience
  insubordinate|refusing to obey orders|不服从的，违抗命令的|The ___ soldier, who refused his captain's orders, was sent home.|The ___ clerk ignored every rule and refused to do as he was told.|Her ___ tone, openly refusing the order, angered the captain.|docile,meek|insubordination
  submissive|ready to obey others without arguing|顺从的|The ___ dog rolled onto its back, ready to obey the bigger dog.|He was always ___ to his older brother, doing what he said without arguing.|She lowered her eyes, ___ and silent, accepting the order without a word.|unruly,rebellious|submissively,submission
  meek|quiet, gentle and easily imposed on|温顺的，逆来顺受的|The ___ boy never complained, even when the others took his lunch.|She gave a quiet, ___ reply and let them have their way.|Don't be so ___; stand up for yourself instead of letting people push you around.|rebellious,unruly|meekly
  rebellious|resisting authority or control|叛逆的|The ___ teenager, refusing to obey her parents, dyed her hair green.|In the night, ___ troops rose against the king and seized the palace.|He was ___ at school, defying every teacher and breaking every rule.|meek,docile|rebelliously
  tractable|easy to control or influence; easily dealt with|易驾驭的；易处理的|The ___ child obeyed at once and was easy to guide.|The problem proved ___, easily dealt with in an afternoon.|A more ___ partner, easy to persuade, would help the deal go through.|unruly,insubordinate|
  unruly|disorderly and hard to control|难以控制的，不守规矩的|The ___ crowd, wild and out of control, pushed past the police.|He tried to comb his ___ hair, which stuck up in every direction.|The ___ class, shouting and out of control, wore out the teacher.|tractable,docile|unruliness
  biddable|meekly ready to accept and follow instructions|听话的，顺从的|The ___ sheepdog came at once, doing exactly as it was told.|She was a quiet, ___ child who always did what her parents asked.|They hired ___ servants who would follow every instruction without question.|insubordinate,unruly|
  `,
  "context-clues",
  {
    intro: t(
      "The king wanted **docile**, **biddable** subjects, but the more he tried to **oppress** them, the more **rebellious** they became, until even his **subservient** courtiers turned against him. These ten words help you describe obeying and refusing to obey.",
      "国王想要温顺的（**docile**）、听话的（**biddable**）臣民，可他越是压迫（**oppress**）他们，他们就越叛逆（**rebellious**），最后连他那些恭顺的（**subservient**）朝臣也起来反对他。这十个词帮你描写服从与拒绝服从。",
    ),
    watchOut: {
      meanings: t(
        "**Docile**, **tractable** and **biddable** mean *easy to control*; **submissive** and **subservient** mean *too ready to obey*; **meek** means *gentle and easily imposed on*.",
        "**docile**、**tractable** 和 **biddable** 指*容易管束*；**submissive** 和 **subservient** 指*过于顺从*；**meek** 指*温顺、逆来顺受*。",
      ),
      use: t(
        "**Insubordinate** describes refusing a *superior's orders*, at work or in the army; **rebellious** describes resisting *any authority*; **unruly** describes a crowd, class or hair that is *hard to control*.",
        "**insubordinate** 指违抗*上级命令*，用于职场或军队；**rebellious** 指反抗*一切权威*；**unruly** 形容*难以控制*的人群、班级或头发。",
      ),
      spelling: t(
        "**Subservient** has *-serv-*; **insubordinate** has *-bord-*; **biddable** has a double *d*; **oppress** has a double *p* and a double *s*.",
        "**subservient** 中间是 -serv-；**insubordinate** 中间是 -bord-；**biddable** 双写 d；**oppress** 双写 p 和 s。",
      ),
    },
    notes: `
      oppress|a tyrant crushing every protest with cruelty and injustice|unjust laws keeping minorities poor and powerless|heat pressing down so cruelly one could hardly breathe|oppress means to keep down by cruel power; propitiate means to please|oppress 压迫；propitiate 讨好|propitiate means to win someone's favor by pleasing them, the opposite of crushing them cruelly|propitiate 指讨好以博得欢心，和残酷镇压正相反|conciliate means to calm anger and bring people together, the opposite of keeping them down by injustice|conciliate 指平息怒气、调解，和不公正地压制正相反|op · press|the double p and the double s|双写 p，双写 s
      docile|a gentle old horse easy to control letting a child ride|workers who accept every order without complaint|a quiet, willing puppy easy to train|docile means easy to control; unruly means hard to control|docile 温顺；unruly 难以控制|unruly means disorderly and hard to control, the opposite of gentle and easy to control|unruly 指难以控制，和温顺易驾驭正相反|rebellious means resisting authority, the opposite of accepting every order|rebellious 指叛逆，和接受一切命令正相反|doc · ile|doc- as in doctor, then -ile|doc- 同 doctor，结尾 -ile
      subservient|bowing to a boss's every wish|a press printing whatever the government told it|one's own needs always treated as less important|subservient means too willing to obey; insubordinate means refusing orders|subservient 恭顺；insubordinate 违抗命令|insubordinate means refusing to obey orders, the opposite of bowing to every wish|insubordinate 指违抗命令，和唯命是从正相反|rebellious means resisting authority, the opposite of printing whatever one is told|rebellious 指叛逆，和让印什么就印什么正相反|sub · ser · vi · ent|sub- plus serve plus -ient|sub- 加 serve 再加 -ient
      insubordinate|a soldier sent home for refusing his captain's orders|a clerk ignoring every rule|a tone openly refusing an order|insubordinate means refusing orders; docile means easy to control|insubordinate 违抗命令；docile 温顺|docile means ready to accept control, the opposite of refusing a captain's orders|docile 指温顺听话，和违抗上尉的命令正相反|meek means quiet and easily imposed on, the opposite of openly refusing|meek 指逆来顺受，和公然拒绝正相反|in · sub · or · di · nate|in- plus subordinate|in- 加 subordinate
      submissive|a dog rolling onto its back to obey a bigger dog|a brother doing what he was told without arguing|eyes lowered in accepting an order without a word|submissive means ready to obey; unruly means hard to control|submissive 顺从；unruly 难以控制|unruly means disorderly and hard to control, the opposite of ready to obey|unruly 指难以控制，和乖乖服从正相反|rebellious means resisting authority, the opposite of obeying without arguing|rebellious 指叛逆，和不争辩地服从正相反|sub · mis · sive|submit changes t to ss, then -ive|submit 的 t 变成 ss，再接 -ive
      meek|a boy who never complained even when his lunch was taken|a quiet reply letting others have their way|letting people push one around|meek means gentle and easily imposed on; rebellious means resisting|meek 逆来顺受；rebellious 叛逆|rebellious means resisting authority, the opposite of never complaining|rebellious 指叛逆，和从不抱怨正相反|unruly means hard to control, the opposite of quietly letting others have their way|unruly 指难以控制，和默默让步正相反|meek|the double e, as in week|双写 e，同 week
      rebellious|a teenager refusing to obey her parents|troops rising against a king and seizing his palace|a pupil defying every teacher and breaking every rule|rebellious means resisting authority; meek means gentle and obedient|rebellious 叛逆；meek 温顺|meek means quiet and easily imposed on, the opposite of refusing to obey|meek 指逆来顺受，和拒不服从正相反|docile means easy to control, the opposite of rising against a king|docile 指温顺易管，和起兵反抗国王正相反|re · bel · lious|rebel plus a double l, then -ious|rebel 双写 l，再接 -ious
      tractable|a child who obeyed at once and was easy to guide|a problem easily dealt with in an afternoon|a partner easy to persuade|tractable means easy to control or deal with; unruly means hard to control|tractable 易驾驭；unruly 难以控制|unruly means hard to control, the opposite of easy to guide|unruly 指难以控制，和容易引导正相反|insubordinate means refusing orders, the opposite of obeying at once|insubordinate 指违抗命令，和立刻服从正相反|trac · ta · ble|tract plus -able|tract 加 -able
      unruly|a wild crowd pushing past the police|hair sticking up in every direction|a shouting class out of control|unruly means hard to control; tractable means easy to control|unruly 难以控制；tractable 易驾驭|tractable means easy to control, the opposite of wild and out of control|tractable 指易于驾驭，和失控正相反|docile means gentle and easy to control, the opposite of shouting and out of control|docile 指温顺易管，和吵闹失控正相反|un · ru · ly|un- plus rule, which drops its e before -ly|un- 加 rule，去掉 e 再加 -ly
      biddable|a sheepdog coming at once and doing exactly as told|a child who always did what her parents asked|servants following every instruction without question|biddable means ready to follow instructions; insubordinate means refusing orders|biddable 听话；insubordinate 违抗命令|insubordinate means refusing to obey orders, the opposite of doing exactly as told|insubordinate 指违抗命令，和完全照办正相反|unruly means hard to control, the opposite of following every instruction|unruly 指难以控制，和听从每一个指示正相反|bid · da · ble|bid plus a double d, then -able|bid 双写 d，再接 -able
    `,
  },
);

const wandering = batch(
  "words-of-roaming-and-wandering",
  ["Words of Roaming and Wandering", "漫游与流浪的词"],
  ["travelers without a fixed road", "没有固定路线的旅人"],
  `
  peregrination|a long, wandering journey|游历，漫游|His ___, a long journey of many years, took him slowly through Asia.|The book records her ___ across Africa, a winding journey of ten thousand miles.|After years of ___, wandering from land to land, he finally came home.|wanderlust,wayfarer|peregrinations
  wanderlust|a strong desire to travel|旅行癖，漫游的欲望|Her ___, a longing to travel that never left her, led her to sail around the world.|He caught ___ at eighteen and longed to see every country on the map.|Even at ninety, her ___ never faded, and she still dreamed of new journeys.|peregrination,vagabond|
  vagabond|a person who wanders from place to place without a home or job|流浪者|The ___, with no home and no job, slept under the bridge.|He lived like a ___ for years, wandering from town to town with no home.|A ___ with no roof of his own knocked at the farm door and asked for bread.|wanderlust,peregrination|vagabonds
  roam|to move about with no fixed purpose or direction|漫步，闲逛|Wild horses ___ the plains, moving freely across hundreds of miles, harming no one.|We let the dogs ___ in the woods, running wherever they liked.|Tourists ___ the old streets, wandering with no fixed route and stealing nothing but glances.|loiter,maraud|roamed,roaming
  wayfarer|a person who travels on foot|徒步旅行者|The inn gave shelter to every ___ who came walking down the road.|A weary ___, footsore after a day's walk, asked for water.|Each ___ who passed on foot left a stone on the pile at the top of the pass.|wanderlust,peregrination|wayfarers
  drifter|a person who moves from place to place with no fixed home or work|流浪汉，漂泊者|A ___ with no fixed home came to town looking for a few days' work.|He was a ___, moving from job to job and town to town, until he settled down.|The police questioned the ___, a man with no home who had arrived the night before.|wanderlust,peregrination|drifters
  rove|to travel constantly without a fixed destination|漫游，流浪|Shepherds used to ___ these hills with their flocks, moving on every few days and harming no one.|His eyes began to ___ around the room, moving from face to face.|They ___ from city to city, never staying anywhere long.|loiter,maraud|roved,roving
  ramble|to walk for pleasure in the country; to talk at length without focus|漫步；漫谈|We like to ___ in the hills on Sundays, strolling for pleasure with no fixed route.|He tends to ___ when he is tired, talking on and on without getting to the point.|Don't ___ through your answer; stop talking around the subject and say it in a sentence.|traverse,loiter|rambled,rambler,rambling
  traverse|to travel across or through|穿越，横越|It took a week to ___ the desert, crossing it from one side to the other.|A new bridge will ___ the river, carrying traffic from one bank to the other.|They had to ___ the glacier, crossing its whole width on foot.|maraud,loiter|traversed
  globetrotter|a person who travels widely|环球旅行者|The ___ had visited ninety countries on six continents.|She writes a magazine for every ___ who travels the world.|A seasoned ___, used to flying around the world, packs light.|wanderlust,peregrination|globetrotters,globetrotting
  `,
  "context-clues",
  {
    intro: t(
      "Driven by **wanderlust**, the young **globetrotter** set out to **traverse** the desert and **roam** the mountains beyond; her **peregrination** lasted ten years. These ten words help you describe travelers who follow no fixed road.",
      "在旅行癖（**wanderlust**）的驱使下，年轻的环球旅行者（**globetrotter**）出发去穿越（**traverse**）沙漠，再到更远的群山中漫游（**roam**）；她的游历（**peregrination**）持续了十年。这十个词帮你描写不走固定路线的旅人。",
    ),
    watchOut: {
      meanings: t(
        "**Wanderlust** is the *desire* to travel; a **peregrination** is the *journey* itself; a **vagabond**, a **drifter**, a **wayfarer** and a **globetrotter** are *people* who travel.",
        "**wanderlust** 是旅行的*欲望*；**peregrination** 是*旅程*本身；**vagabond**、**drifter**、**wayfarer** 和 **globetrotter** 都是旅行的*人*。",
      ),
      use: t(
        "**Traverse** takes an object and means to *cross* something: traverse a desert. **Roam** and **rove** mean to *move about freely*; **ramble** is to walk *for pleasure*, or to talk *without focus*.",
        "**traverse** 后接宾语，指*横越*某处：traverse a desert。**roam** 和 **rove** 指*自由地四处走动*；**ramble** 指*为消遣*而散步，或说话*不着边际*。",
      ),
      spelling: t(
        "**Peregrination** has *-egrin-*; **wanderlust** is *wander* plus *lust*; **vagabond** ends in *-bond*; **globetrotter** doubles the *t*.",
        "**peregrination** 中间是 -egrin-；**wanderlust** 是 wander 加 lust；**vagabond** 结尾是 -bond；**globetrotter** 双写 t。",
      ),
    },
    notes: `
      peregrination|a long journey of many years through Asia|a winding journey of ten thousand miles across Africa|years of wandering from land to land before coming home|a peregrination is a long journey; wanderlust is the desire to travel|peregrination 游历；wanderlust 旅行欲|wanderlust is the desire to travel, not the long journey itself|wanderlust 指旅行的欲望，不是漫长的旅程本身|wayfarer is a person who travels on foot, not the journey he makes|wayfarer 指徒步旅行的人，不是他走过的旅程|per · e · gri · na · tion|-egrin- in the middle, then -ation|中间是 -egrin-，结尾 -ation
      wanderlust|a longing to travel that led to a voyage around the world|a young man longing to see every country on the map|dreams of new journeys at ninety|wanderlust is the desire to travel; a peregrination is the journey|wanderlust 旅行欲；peregrination 游历|peregrination is the journey itself, not the longing that leads to it|peregrination 指旅程本身，不是引发旅行的渴望|vagabond is a person without a home, not a feeling of longing to travel|vagabond 指无家可归的流浪者，不是渴望旅行的感觉|wan · der · lust|wander plus lust|wander 加 lust
      vagabond|a man with no home and no job sleeping under a bridge|years wandering from town to town with no home|a man with no roof of his own asking for bread|a vagabond is a homeless wanderer; wanderlust is the wish to travel|vagabond 流浪者；wanderlust 旅行欲|wanderlust is a desire to travel, not a person sleeping under a bridge|wanderlust 指旅行的欲望，不是睡在桥下的人|peregrination is a long journey, not a homeless person knocking at a door|peregrination 指漫长的旅程，不是上门讨饭的流浪者|vag · a · bond|vaga- plus bond|vaga- 加 bond
      roam|wild horses moving freely across hundreds of miles|dogs running wherever they liked in the woods|tourists wandering the old streets with no fixed route|roam means to move about freely; loiter means to hang about in one place|roam 四处漫游；loiter 闲荡|loiter means to stand around in one place, not to move freely across many miles|loiter 指在一处闲站着，不是在广阔的地方自由行走|maraud means to roam in order to steal, not to move about freely harming no one|maraud 指四处劫掠，不是无害地自由游荡|roam|r- plus -oam, as in foam|r- 加 -oam，同 foam
      wayfarer|a traveler on foot sheltered at an inn|a footsore walker asking for water|walkers each leaving a stone at the top of a pass|a wayfarer is a traveler on foot; wanderlust is the desire to travel|wayfarer 徒步旅行者；wanderlust 旅行欲|wanderlust is a desire to travel, not a person who walks down a road|wanderlust 指旅行的欲望，不是走在路上的人|peregrination is a long journey, not a weary walker asking for water|peregrination 指漫长的旅程，不是讨水喝的疲惫行人|way · far · er|way plus farer|way 加 farer
      drifter|a man with no fixed home looking for a few days' work|a man moving from job to job until he settled down|a homeless man who arrived the night before|a drifter is a person with no fixed home or work; a peregrination is a journey|drifter 漂泊者；peregrination 游历|wanderlust is the desire to travel, not a man looking for work|wanderlust 指旅行的欲望，不是找活干的人|peregrination is a long journey, not a man questioned by the police|peregrination 指漫长的旅程，不是被警察盘问的人|drift · er|drift plus -er|drift 加 -er
      rove|shepherds moving with their flocks every few days|eyes moving from face to face around a room|travelers never staying anywhere long|rove means to travel about constantly; loiter means to hang about in one place|rove 漫游；loiter 闲荡|loiter means to stand around in one place, the opposite of moving on every few days|loiter 指在一处闲荡，和每隔几天就换地方正相反|maraud means to roam in search of loot, not to move about harming no one|maraud 指四处劫掠，不是无害地游荡|rove|r- plus -ove, as in drove|r- 加 -ove，同 drove
      ramble|strolling in the hills for pleasure with no fixed route|talking on and on without getting to the point|talking around a subject instead of saying it in a sentence|ramble means to stroll for pleasure or talk without focus; traverse means to cross|ramble 漫步、漫谈；traverse 横越|traverse means to travel across something from side to side, not to stroll or talk without focus|traverse 指从一边穿越到另一边，不是闲逛或漫谈|loiter means to stand about in one place, not to stroll the hills or talk on and on|loiter 指在一处闲荡，不是在山里漫步或说个不停|ram · ble|ram- plus -ble|ram- 加 -ble
      traverse|crossing a desert from one side to the other in a week|a bridge carrying traffic from one bank to the other|crossing the whole width of a glacier on foot|traverse means to travel across; loiter means to hang about|traverse 横越；loiter 闲荡|maraud means to roam about looking for loot, not to cross from one side to the other|maraud 指四处劫掠，不是从一边穿越到另一边|loiter means to stand around in one place, the opposite of crossing a whole desert|loiter 指在一处闲荡，和横穿整片沙漠正相反|tra · verse|tra- plus verse|tra- 加 verse
      globetrotter|a traveler who had visited ninety countries|readers who travel the world|a seasoned traveler used to flying around the world|a globetrotter is a person who travels widely; wanderlust is the desire to|globetrotter 环球旅行者；wanderlust 旅行欲|wanderlust is a desire to travel, not a person who has visited ninety countries|wanderlust 指旅行的欲望，不是去过九十个国家的人|peregrination is a long journey, not a traveler who packs light|peregrination 指漫长的旅程，不是轻装出行的旅行者|globe · trot · ter|globe plus trot, which doubles its t before -er|globe 加 trot，双写 t 再加 -er
    `,
  },
);

const riches = batch(
  "words-of-luxury-and-penury",
  ["Words of Luxury and Penury", "奢华与贫困的词"],
  ["living in comfort and living in need", "舒适生活与贫困生活"],
  `
  sumptuous|splendid and expensive-looking|奢华的，豪华的|They ate a ___ feast of roast swan, rare wines and golden cakes, splendid and costly.|The hotel had ___ rooms hung with silk and lit by crystal chandeliers.|She wore a ___ silk gown, splendid and very expensive, to the ball.|spartan,threadbare|sumptuously
  luxurious|very comfortable and expensive|奢侈的，舒适的|They stayed in a ___ villa with soft beds, a private pool and a chef.|After the race she took a long, ___ bath, hot, scented and wonderfully comfortable.|The car has ___ leather seats, soft, heated and very costly.|threadbare,spartan|luxuriously
  spartan|showing simplicity and a lack of comfort|简朴的，简陋的|The soldiers lived in ___ huts with bare floors and no heating.|His room was ___: a hard bed, a desk and nothing else for comfort.|They kept a ___ diet of plain bread, beans and water.|sumptuous,luxurious|
  penurious|extremely poor; unwilling to spend money|贫穷的；吝啬的|The ___ poet lived in a cold attic, too poor to buy coal.|A ___ old man, unwilling to spend a cent, counted every coin twice.|They grew up in ___ conditions, with barely enough money for food.|moneyed,well-heeled|penury
  indigent|poor and in need|贫困的|The clinic treats ___ patients, too poor to pay, for free.|Each winter, ___ families who could not afford food received parcels from the church.|The law gives ___ defendants, who cannot pay for one, a lawyer.|well-heeled,moneyed|indigence
  impoverished|made poor; weakened in quality|贫困的；枯竭的|The war left the region ___, its farms burned and its people poor.|They grew up in a remote, ___ village where most families had nothing.|The soil was ___ after years of farming, too weak to grow good crops.|luxurious,moneyed|impoverish,impoverishment
  penniless|having no money|身无分文的|He arrived in the city ___, without a single coin in his pocket.|The failed gamble left them ___, with every cent of their savings gone.|The ___ student, who had no money at all, asked for a loan.|moneyed,well-heeled|
  well-heeled|wealthy|富有的|The shop sells to ___ tourists who can easily afford its high prices.|The ___ crowd in furs and diamonds filled the opera house.|They live in the ___ suburb of large houses owned by the rich.|penniless,indigent|
  moneyed|having a great deal of money|有钱的|The resort attracts ___ families who think nothing of spending a fortune.|He was born into the ___ class, with more wealth than he could ever spend.|The town is run by the ___ elite, the few families with great wealth.|indigent,penniless|
  threadbare|thin and worn from use; weak from overuse|破旧的；陈腐的|He wore a ___ coat, so worn that you could see through the elbows.|The rug was ___ in the middle, rubbed thin by years of feet.|Their ___ excuse, used so often that it was worn out, no longer worked.|sumptuous,luxurious|
  `,
  "context-clues",
  {
    intro: t(
      "The **moneyed** banker lived in a **luxurious** villa and gave **sumptuous** dinners, while his **penniless** brother wore a **threadbare** coat in a **spartan** room. These ten words help you describe living in comfort and living in need.",
      "那位有钱的（**moneyed**）银行家住在奢侈舒适的（**luxurious**）别墅里，大摆奢华的（**sumptuous**）晚宴；而他身无分文的（**penniless**）弟弟却穿着破旧的（**threadbare**）外套，住在简陋的（**spartan**）屋子里。这十个词帮你描写舒适的生活和贫困的生活。",
    ),
    watchOut: {
      meanings: t(
        "**Sumptuous** stresses *splendor*; **luxurious** stresses *comfort*; **spartan** is plain and *lacking comfort*, often by choice; **threadbare** is *worn thin*.",
        "**sumptuous** 强调*华丽*；**luxurious** 强调*舒适*；**spartan** 指简朴、*缺少舒适*，常常是自己选择的；**threadbare** 指*磨得很薄*。",
      ),
      use: t(
        "**Indigent** and **penurious** are formal words for *very poor*; **penurious** can also mean *stingy*; **impoverished** means *made* poor; **well-heeled** and **moneyed** mean *rich*.",
        "**indigent** 和 **penurious** 是*非常贫穷*的正式说法；**penurious** 还可指*吝啬*；**impoverished** 指*变得*贫穷；**well-heeled** 和 **moneyed** 指*有钱*。",
      ),
      spelling: t(
        "**Sumptuous** has *-mpt-*; **penurious** has *-nur-*; **well-heeled** keeps its hyphen; **moneyed** keeps the *e* of money.",
        "**sumptuous** 中有 -mpt-；**penurious** 中间是 -nur-；**well-heeled** 保留连字符；**moneyed** 保留 money 的 e。",
      ),
    },
    notes: `
      sumptuous|a costly feast of roast swan, rare wines and golden cakes|hotel rooms hung with silk and crystal chandeliers|a splendid, very expensive silk gown for a ball|sumptuous means splendid and costly; spartan means plain and without comfort|sumptuous 奢华；spartan 简朴|spartan means plain and lacking comfort, the opposite of silk and crystal chandeliers|spartan 指简朴、缺少舒适，和丝绸、水晶吊灯正相反|threadbare means worn thin, the opposite of a splendid new gown|threadbare 指磨得很薄，和华丽的新礼服正相反|sump · tu · ous|-mpt- in the middle, then -uous|中间是 -mpt-，结尾 -uous
      luxurious|a villa with soft beds, a private pool and a chef|a hot, scented, wonderfully comfortable bath|soft, heated, very costly leather seats|luxurious means very comfortable and costly; threadbare means worn thin|luxurious 奢侈舒适；threadbare 破旧|threadbare means worn thin from use, the opposite of soft and costly|threadbare 指磨得很薄，和柔软昂贵正相反|spartan means lacking comfort, the opposite of wonderfully comfortable|spartan 指缺少舒适，和舒服极了正相反|lux · u · ri · ous|luxury drops its y before -ious|luxury 去掉 y 再加 -ious
      spartan|soldiers' huts with bare floors and no heating|a room with a hard bed, a desk and nothing else|a diet of plain bread, beans and water|spartan means plain and without comfort; sumptuous means splendid|spartan 简朴；sumptuous 奢华|sumptuous means splendid and costly, the opposite of bare floors and no heating|sumptuous 指奢华昂贵，和光秃秃的地板、没有暖气正相反|luxurious means very comfortable, the opposite of a hard bed and nothing else|luxurious 指舒适奢侈，和一张硬床别无他物正相反|spar · tan|Sparta plus -n|Sparta 加 -n
      penurious|a poet too poor to buy coal for his attic|an old man unwilling to spend a cent|a childhood with barely enough money for food|penurious means very poor or stingy; moneyed means rich|penurious 贫穷或吝啬；moneyed 有钱|moneyed means having a great deal of money, the opposite of too poor to buy coal|moneyed 指很有钱，和穷得买不起煤正相反|well-heeled means wealthy, the opposite of barely enough money for food|well-heeled 指富有，和连饭钱都不够正相反|pe · nu · ri · ous|penury drops its y before -ious|penury 去掉 y 再加 -ious
      indigent|patients too poor to pay treated for free|families who could not afford food receiving parcels|defendants who cannot pay for a lawyer|indigent means poor and in need; well-heeled means wealthy|indigent 贫困；well-heeled 富有|well-heeled means wealthy, the opposite of too poor to pay|well-heeled 指富有，和穷得付不起钱正相反|moneyed means having a lot of money, the opposite of unable to afford food|moneyed 指很有钱，和买不起食物正相反|in · di · gent|in- plus -digent, with a soft g|in- 加 -digent，g 读软音
      impoverished|a region left poor with its farms burned by war|a remote village where most families had nothing|soil too weak to grow good crops after years of farming|impoverished means made poor or weak; moneyed means rich|impoverished 贫困、枯竭；moneyed 有钱|luxurious means very comfortable and costly, the opposite of a village where families had nothing|luxurious 指奢侈舒适，和家家一无所有的村子正相反|moneyed means having a great deal of money, the opposite of a region left poor|moneyed 指很有钱，和被弄穷的地区正相反|im · pov · er · ished|im- plus poverish plus -ed|im- 加 poverish 再加 -ed
      penniless|arriving in a city without a single coin|savings all gone after a failed gamble|a student with no money at all asking for a loan|penniless means having no money; moneyed means having a lot|penniless 身无分文；moneyed 有钱|moneyed means having a great deal of money, the opposite of without a single coin|moneyed 指很有钱，和一枚硬币都没有正相反|well-heeled means wealthy, the opposite of having no money at all|well-heeled 指富有，和一分钱都没有正相反|pen · ni · less|penny changes y to i, then -less|penny 的 y 变成 i，再加 -less
      well-heeled|tourists who easily afford high prices|a crowd in furs and diamonds at the opera|a suburb of large houses owned by the rich|well-heeled means wealthy; penniless means having no money|well-heeled 富有；penniless 身无分文|penniless means having no money, the opposite of easily affording high prices|penniless 指身无分文，和轻松付得起高价正相反|indigent means poor and in need, the opposite of furs and diamonds|indigent 指贫困，和穿皮草戴钻石正相反|well · heeled|well plus heeled, joined by a hyphen|well 加 heeled，用连字符相连
      moneyed|families who think nothing of spending a fortune|a class with more money than one could ever spend|the few families of great wealth who run a town|moneyed means having much money; indigent means poor and in need|moneyed 有钱；indigent 贫困|indigent means poor and in need, the opposite of spending a fortune easily|indigent 指贫困，和随意挥金如土正相反|penniless means having no money, the opposite of more money than one could spend|penniless 指身无分文，和钱多得花不完正相反|mon · eyed|money plus -ed, keeping the e|money 加 -ed，保留 e
      threadbare|a coat so worn you could see through the elbows|a rug rubbed thin by years of feet|an excuse used so often it was worn out|threadbare means worn thin; luxurious means comfortable and costly|threadbare 破旧；luxurious 奢侈舒适|sumptuous means splendid and costly, the opposite of worn through at the elbows|sumptuous 指奢华昂贵，和手肘磨穿正相反|luxurious means very comfortable and costly, the opposite of rubbed thin by feet|luxurious 指奢侈舒适，和被踩得磨薄正相反|thread · bare|thread plus bare|thread 加 bare
    `,
  },
);

const clarity = batch(
  "words-of-clear-and-muddled-thought",
  ["Words of Clear and Muddled Thought", "清晰与混乱思维的词"],
  ["ideas easy to follow and ideas hard to grasp", "易懂的想法与难懂的想法"],
  `
  abstruse|difficult to understand; obscure|深奥的|The lecture was too ___ for most of us, full of ideas so obscure that only experts could follow them.|He writes ___ theories of time that even other scientists find hard to understand.|The contract was filled with ___ legal terms that no ordinary reader could understand.|intelligible,perspicuous|
  turbid|cloudy or muddy; confused|浑浊的；混乱的|The river was ___ after the rain, thick and brown with mud.|His ___ prose, cloudy and confused, was hard to follow.|Fish cannot see in ___ water, so muddy that light barely gets through.|crystalline,perspicuous|turbidity
  nebulous|unclear, vague or ill-defined|模糊的，朦胧的|Their plans for the future are ___, with no clear shape or dates.|The idea is still ___, a vague cloud of a thought that no one can pin down.|He gave a ___ answer, so vague and ill-defined that we learned nothing.|perspicuous,crystalline|
  vague|not clearly expressed or understood|模糊的，含糊的|Her description of the man was ___, with no clear details of his face or clothes.|My memory of the house is ___; I can picture only its general shape, not its details.|The instructions were too ___, never saying clearly what to do.|intelligible,perspicuous|vaguely,vagueness
  crystalline|very clear; having the structure of crystals|清澈透明的；晶体的|The lake was ___ and cold, so clear that we could see the stones on the bottom.|Her ___ prose, perfectly clear in every line, was a joy to read.|Salt forms ___ shapes, tiny cubes with flat, sharp faces.|turbid,muddled|
  perspicuous|clearly expressed and easily understood|明晰的，易懂的|Her account of the theory was ___, so clear that every student understood it.|The judge's ruling was ___, plainly written and easy for anyone to follow.|Textbooks need a style that is ___, clear and easy for beginners to understand.|abstruse,muddled|perspicuity
  intelligible|able to be understood|可理解的，清楚的|His speech was barely ___; through the crackling line we could just understand him.|Rewrite your notes so they are ___ to others and anyone can understand them.|Despite the noise, the message was ___, and we understood every word.|abstruse,unintelligible|intelligibly,intelligibility
  unintelligible|impossible to understand|难以理解的|The radio message was ___, nothing but crackles that no one could make out.|Her handwriting is ___; not even she can read it.|He mumbled something ___ into his pillow, impossible to understand.|intelligible,perspicuous|
  convoluted|extremely complex and difficult to follow|错综复杂的|The plot was too ___, with so many twists and turns that we lost track.|Their excuse was ___, so long and tangled that nobody could follow it.|The ___ rules, full of exceptions to exceptions, confused everyone.|perspicuous,intelligible|convolution
  muddled|confused and disorganized|糊涂的，混乱的|His ideas were ___, jumbled together in no clear order.|She got ___ about the dates, mixing up Monday and Thursday.|The ___ report, confused and disorganized, left out key facts.|crystalline,perspicuous|muddle
  `,
  "context-clues",
  {
    intro: t(
      "The professor's lecture was **abstruse** and his notes **muddled**, but his assistant gave a **perspicuous** summary that made the **convoluted** argument **intelligible** to everyone. These ten words help you describe ideas that are easy to follow and ideas that are hard to grasp.",
      "教授的讲课深奥难懂（**abstruse**），讲义也杂乱无章（**muddled**），可他的助手做了一个明晰的（**perspicuous**）总结，让那套错综复杂的（**convoluted**）论证人人都能理解（**intelligible**）。这十个词帮你描写易懂的想法和难懂的想法。",
    ),
    watchOut: {
      meanings: t(
        "**Abstruse** ideas are *deep and obscure*; **convoluted** ones are *tangled and complex*; **nebulous** and **vague** ones are *unclear in shape*; **muddled** ones are *confused and jumbled*.",
        "**abstruse** 的想法*深奥晦涩*；**convoluted** 的*错综复杂*；**nebulous** 和 **vague** 的*轮廓模糊*；**muddled** 的*混乱颠倒*。",
      ),
      use: t(
        "**Turbid** and **crystalline** describe *water* as well as writing: muddy or clear. **Intelligible** means only *able to be understood*; **perspicuous** means *clearly and well* expressed.",
        "**turbid** 和 **crystalline** 既能形容*水*，也能形容文字：浑浊或清澈。**intelligible** 只是*能被理解*；**perspicuous** 指表达得*清楚而出色*。",
      ),
      spelling: t(
        "**Perspicuous** ends in *-uous*, not *-acious*; **intelligible** ends in *-ible*; **crystalline** has a *y* and ends in *-ine*; **abstruse** ends in *-use*.",
        "**perspicuous** 结尾是 -uous，不是 -acious；**intelligible** 结尾是 -ible；**crystalline** 含 y，结尾是 -ine；**abstruse** 结尾是 -use。",
      ),
    },
    notes: `
      abstruse|a lecture of ideas so obscure only experts could follow|theories of time that scientists find hard to understand|legal terms no ordinary reader could understand|abstruse means hard to understand; intelligible means able to be understood|abstruse 深奥；intelligible 可理解|intelligible means able to be understood, the opposite of something only experts can follow|intelligible 指能被理解，和只有专家才懂正相反|perspicuous means clearly expressed, the opposite of terms no reader could understand|perspicuous 指表达清楚，和谁也看不懂的术语正相反|ab · struse|ab- plus -struse, ending in -use|ab- 加 -struse，结尾 -use
      turbid|a river thick and brown with mud after rain|cloudy, confused prose hard to follow|water so muddy light barely gets through|turbid means muddy or confused; crystalline means very clear|turbid 浑浊；crystalline 清澈|crystalline means perfectly clear, the opposite of thick and brown with mud|crystalline 指清澈透明，和满是泥浆的褐色河水正相反|perspicuous means clearly expressed, the opposite of cloudy, confused prose|perspicuous 指表达清楚，和浑浊混乱的文字正相反|tur · bid|tur- plus -bid|tur- 加 -bid
      nebulous|plans with no clear shape or dates|a vague cloud of a thought no one can pin down|an answer so vague we learned nothing|nebulous means unclear and ill-defined; perspicuous means clearly expressed|nebulous 模糊；perspicuous 明晰|perspicuous means clearly expressed, the opposite of having no clear shape|perspicuous 指表达清楚，和没有清晰轮廓正相反|crystalline means perfectly clear, the opposite of a vague cloud of a thought|crystalline 指清澈透明，和一团模糊的想法正相反|neb · u · lous|nebula drops its a, then -ous|nebula 去掉 a，再加 -ous
      vague|a description of a man with no clear details|a memory of only the general shape of a house|instructions never saying clearly what to do|vague means not clearly expressed; perspicuous means very clear|vague 模糊；perspicuous 明晰|intelligible means able to be understood, the opposite of never saying clearly what to do|intelligible 指能被理解，和从不说清该做什么正相反|perspicuous means clearly expressed, the opposite of no clear details|perspicuous 指表达清楚，和毫无清晰细节正相反|vague|the silent -ue at the end|结尾的 -ue 不发音
      crystalline|a lake so clear the stones on the bottom showed|prose perfectly clear in every line|salt forming tiny cubes with flat, sharp faces|crystalline means very clear or like crystals; turbid means muddy|crystalline 清澈；turbid 浑浊|turbid means cloudy and muddy, the opposite of clear enough to see the bottom|turbid 指浑浊，和清澈见底正相反|muddled means confused and jumbled, the opposite of perfectly clear in every line|muddled 指混乱颠倒，和每一行都清清楚楚正相反|crys · tal · line|crystal plus -line|crystal 加 -line
      perspicuous|an account of a theory every student understood|a ruling plainly written and easy to follow|a clear style easy for beginners|perspicuous means clearly expressed; abstruse means hard to understand|perspicuous 明晰；abstruse 深奥|abstruse means hard to understand, the opposite of clear enough for every student|abstruse 指深奥难懂，和人人都能听懂正相反|muddled means confused and disorganized, the opposite of plainly written|muddled 指混乱无序，和写得清清楚楚正相反|per · spic · u · ous|-spic- in the middle, then -uous|中间是 -spic-，结尾 -uous
      intelligible|a voice one could just understand through a crackling line|notes rewritten so anyone can understand them|a message understood word for word despite noise|intelligible means able to be understood; unintelligible means impossible to understand|intelligible 可理解；unintelligible 无法理解|abstruse means hard to understand, the opposite of understood word for word|abstruse 指深奥难懂，和听懂每一个字正相反|unintelligible means impossible to understand, the opposite of something we could understand|unintelligible 指无法理解，和我们能听懂正相反|in · tel · li · gi · ble|intelli- plus -gible, ending in -ible|intelli- 加 -gible，结尾 -ible
      unintelligible|a radio message of nothing but crackles|handwriting not even its writer can read|a mumble into a pillow impossible to understand|unintelligible means impossible to understand; intelligible means understandable|unintelligible 无法理解；intelligible 可理解|intelligible means able to be understood, the opposite of crackles no one could make out|intelligible 指能被理解，和谁也听不清的噼啪声正相反|perspicuous means clearly expressed, the opposite of handwriting no one can read|perspicuous 指表达清楚，和谁也认不出的字迹正相反|un · in · tel · li · gi · ble|un- plus intelligible|un- 加 intelligible
      convoluted|a plot with so many twists that we lost track|a long, tangled excuse nobody could follow|rules full of exceptions to exceptions|convoluted means tangled and complex; perspicuous means clear|convoluted 错综复杂；perspicuous 明晰|perspicuous means clearly expressed, the opposite of so tangled no one could follow|perspicuous 指表达清楚，和缠绕得没人跟得上正相反|intelligible means able to be understood, the opposite of rules that confused everyone|intelligible 指能被理解，和让所有人都糊涂的规则正相反|con · vo · lut · ed|con- plus -volute plus -d|con- 加 -volute 再加 -d
      muddled|ideas jumbled together in no clear order|Monday and Thursday mixed up|a confused, disorganized report missing key facts|muddled means confused and disorganized; crystalline means perfectly clear|muddled 混乱；crystalline 清澈|crystalline means perfectly clear, the opposite of jumbled in no clear order|crystalline 指清清楚楚，和杂乱无章正相反|perspicuous means clearly expressed, the opposite of a confused, disorganized report|perspicuous 指表达清楚，和混乱无序的报告正相反|mud · dled|muddle plus -d, with a double d|muddle 加 -d，双写 d
    `,
  },
);

const inheritance = batch(
  "words-of-wills-and-inheritance",
  ["Words of Wills and Inheritance", "遗嘱与继承的词"],
  ["what the dead leave and who receives it", "逝者留下的与接受者"],
  `
  bequeath|to leave property to someone in a will; to pass on|遗赠；传给|In her will she will ___ the house to her niece, who will own it after her death.|He hoped to ___ his books to the library, leaving them to it in his will.|Each generation should ___ a better world to the next, handing on what it has made.|disinherit,covet|bequeathed
  bequest|something left to someone in a will|遗赠物，遗产|The museum received a large ___, a fortune left to it in a collector's will.|Her ___, the money she left in her will, funded ten scholarships.|A ___ of paintings, left by the artist's will, went to the town.|testament,beneficiary|bequests
  heiress|a woman who will inherit or has inherited great wealth|女继承人|The young ___, a woman who had inherited her father's fortune, owned three castles.|He married the rich ___, the only daughter who would inherit the family's millions.|The ___ gave away the great fortune she had inherited.|executor,testament|heiresses
  executor|a person named in a will to carry out its terms|遗嘱执行人|The ___, the person the will put in charge, read it aloud to the family.|She was named ___ of her father's estate and had to carry out every term of his will.|As the will directed, the ___ sold the house and shared the money among the heirs.|beneficiary,heiress|executors
  testament|a will; something that serves as proof|遗嘱；证明|"This is my last will and ___," the old man wrote at the top of the page.|The bridge, still standing after two hundred years, is a ___ to their skill, proof of how well they built.|Her success is a ___ to hard work, clear proof of what effort can do.|bequest,probate|testaments
  primogeniture|the right of the eldest son to inherit everything|长子继承制|Under ___, the eldest son got the whole farm and his brothers got nothing.|The law of ___, which gave everything to the firstborn son, was abolished.|In those days ___ left younger sons with nothing, since only the eldest could inherit.|probate,testament|
  disinherit|to prevent someone from inheriting one's property|剥夺继承权|He threatened to ___ his son, cutting him out of the will entirely.|She chose to ___ her greedy nephew, leaving him nothing at all in her will.|Few parents ___ their children, though some do leave them out of their wills.|bequeath,covet|disinherited
  beneficiary|a person who receives money or property from a will or insurance|受益人|She was the sole ___ of the will and received everything her uncle left.|Name your ___ on the policy, the person who will receive the money.|Farmers are the main ___ of the scheme, receiving most of its money.|executor,testament|beneficiaries
  probate|the official process of proving that a will is valid|遗嘱认证|The will is now in ___, being officially checked by the court to prove it is valid.|The court's process of ___ can take many months before a will is officially accepted.|The house cannot be sold until ___ ends and the court has confirmed the will is valid.|primogeniture,testament|
  intestate|having died without making a will|未留遗嘱的|He died ___, leaving no will, so the state divided his money.|By law, the estates of people who die ___, without a will, go to their next of kin.|She did not want to die ___, so she wrote her will at once.|penniless,indigent|
  `,
  "context-clues",
  {
    intro: t(
      "The old lord chose to **disinherit** his son and **bequeath** his castle to his daughter, the new **heiress**; the **executor** read the **testament** aloud. These ten words help you talk about what the dead leave behind and who receives it.",
      "老勋爵决定剥夺（**disinherit**）儿子的继承权，把城堡遗赠（**bequeath**）给女儿——新的女继承人（**heiress**）；遗嘱执行人（**executor**）当众宣读了遗嘱（**testament**）。这十个词帮你谈论逝者留下了什么、由谁接受。",
    ),
    watchOut: {
      meanings: t(
        "The **executor** *carries out* a will; the **beneficiary** *receives* from it; a **bequest** is *what* is left; **probate** is the court's *proof* that the will is valid.",
        "**executor** 负责*执行*遗嘱；**beneficiary** 从遗嘱中*受益*；**bequest** 是留下的*东西*；**probate** 是法院对遗嘱有效性的*认证*。",
      ),
      use: t(
        "**Bequeath** is the *verb* and **bequest** the *noun*; **intestate** describes someone who died *without* a will; **primogeniture** gives everything to the *eldest son*.",
        "**bequeath** 是*动词*，**bequest** 是*名词*；**intestate** 形容死时*未留*遗嘱的人；**primogeniture** 把一切都给*长子*。",
      ),
      spelling: t(
        "**Bequeath** ends in *-eath*; **heiress** has a silent *h* and a double *s*; **beneficiary** ends in *-iary*; **primogeniture** has *-geni-*.",
        "**bequeath** 结尾是 -eath；**heiress** 的 h 不发音，结尾双写 s；**beneficiary** 结尾是 -iary；**primogeniture** 中间是 -geni-。",
      ),
    },
    notes: `
      bequeath|a house left to a niece in a will|books left to a library in a will|a better world handed on to the next generation|bequeath means to leave property in a will; disinherit means to stop someone inheriting|bequeath 遗赠；disinherit 剥夺继承权|disinherit means to stop someone from inheriting, the opposite of leaving them a house|disinherit 指剥夺继承权，和把房子留给某人正相反|covet means to want what belongs to another, the opposite of giving one's own property away|covet 指觊觎别人的东西，和把自己的财产赠出正相反|be · queath|be- plus -queath, ending in -eath|be- 加 -queath，结尾 -eath
      bequest|a fortune left to a museum in a collector's will|money left in a will that funded scholarships|paintings left by an artist's will to a town|a bequest is what is left in a will; a testament is the will itself|bequest 遗赠物；testament 遗嘱|testament is the will itself or a proof, not the money or paintings left by it|testament 指遗嘱本身或证明，不是遗嘱留下的钱或画|beneficiary is the person who receives, not the thing that is left|beneficiary 指受益人，不是留下的东西|be · quest|be- plus quest|be- 加 quest
      heiress|a woman who inherited her father's fortune and three castles|an only daughter who would inherit the family's millions|a woman giving away a great inherited fortune|an heiress inherits great wealth; an executor carries out a will|heiress 女继承人；executor 遗嘱执行人|executor is the person who carries out a will, not a woman who inherits a fortune|executor 指执行遗嘱的人，不是继承财富的女子|testament is a will or a proof, not a woman who owns castles|testament 指遗嘱或证明，不是拥有城堡的女子|heir · ess|heir plus -ess, with a silent h and a double s|heir 加 -ess，h 不发音，结尾双写 s
      executor|the person a will puts in charge reading it aloud|a daughter carrying out every term of her father's will|selling a house and sharing the money as a will directs|an executor carries out a will; a beneficiary receives from it|executor 执行人；beneficiary 受益人|beneficiary is the person who receives from a will, not the one put in charge of carrying it out|beneficiary 指从遗嘱中受益的人，不是负责执行遗嘱的人|heiress is a woman who inherits wealth, not the person who sells the house and shares the money|heiress 指继承财富的女子，不是卖房分钱的人|ex · ec · u · tor|execute drops its e before -or|execute 去掉 e 再加 -or
      testament|the words at the top of an old man's will|a bridge standing for two centuries as proof of skill|success as clear proof of what effort can do|a testament is a will or a proof; a bequest is what a will leaves|testament 遗嘱或证明；bequest 遗赠物|bequest is something left in a will, not the will itself or a proof|bequest 指遗赠物，不是遗嘱本身或证明|probate is the court's process of proving a will, not proof of skill or effort|probate 指法院认证遗嘱的程序，不是技艺或努力的证明|tes · ta · ment|testa- plus -ment|testa- 加 -ment
      primogeniture|an eldest son getting the whole farm and his brothers nothing|a law giving everything to the firstborn son|younger sons left with nothing because only the eldest could inherit|primogeniture gives everything to the eldest son; probate proves a will|primogeniture 长子继承制；probate 遗嘱认证|probate is the court's process of proving a will valid, not the eldest son's right to everything|probate 指法院认证遗嘱的程序，不是长子独得一切的权利|testament is a will, not a law that gives everything to the firstborn|testament 指遗嘱，不是把一切都给长子的法律|pri · mo · gen · i · ture|primo- for first, then -geniture|primo- 表示“第一”，再接 -geniture
      disinherit|a son cut out of a will entirely|a greedy nephew left nothing at all|children left out of their parents' wills|disinherit means to stop someone inheriting; bequeath means to leave them property|disinherit 剥夺继承权；bequeath 遗赠|bequeath means to leave property to someone, the opposite of cutting them out|bequeath 指遗赠财产，和把人从遗嘱中除名正相反|covet means to want another's property, not to leave a relative out of one's will|covet 指觊觎别人的财产，不是把亲人排除在遗嘱之外|dis · in · her · it|dis- plus inherit|dis- 加 inherit
      beneficiary|a woman who received everything her uncle left|the person named to receive money from a policy|farmers receiving most of a scheme's money|a beneficiary receives money or property; an executor carries out the will|beneficiary 受益人；executor 执行人|executor is the person who carries out a will, not the one who receives everything|executor 指执行遗嘱的人，不是得到一切的人|testament is a will, not a person who receives its money|testament 指遗嘱，不是领取钱财的人|ben · e · fi · ci · ar · y|benefit changes t to c, then -iary|benefit 的 t 变成 c，再接 -iary
      probate|a will being checked by a court to prove it valid|the months a court takes before officially accepting a will|a house unsold until a court confirms the will|probate is the court's proof that a will is valid; a testament is the will|probate 遗嘱认证；testament 遗嘱|primogeniture is the eldest son's right to inherit, not a court's checking of a will|primogeniture 指长子继承权，不是法院审核遗嘱|testament is the will itself, not the court's process of proving it|testament 指遗嘱本身，不是法院认证它的程序|pro · bate|pro- plus -bate, as in probation|pro- 加 -bate，同 probation
      intestate|a man who left no will, so the state divided his money|estates of people who die without a will going to their next of kin|a woman writing her will so as not to die without one|intestate means having died without a will; penniless means having no money|intestate 未留遗嘱；penniless 身无分文|penniless means having no money at all, not dying without a will while leaving money behind|penniless 指身无分文，不是死时留有钱财却未立遗嘱|indigent means poor and in need, not having left no will|indigent 指贫困，不是未留遗嘱|in · tes · tate|in- plus testate|in- 加 testate
    `,
  },
);

const ships = batch(
  "words-of-ships-and-sailors",
  ["Words of Ships and Sailors", "船与水手的词"],
  ["life at sea and the ships of old", "海上生活与古老的船"],
  `
  mariner|a sailor|水手，海员|The old ___, who had sailed the oceans for fifty years, told tales of storms at sea.|Every ___ who steers a ship by night knows the North Star.|A ___ must read the tides before taking his ship out to sea.|stevedore,wayfarer|mariners
  stevedore|a person who loads and unloads ships|码头装卸工|On the dock, the ___ carried crates off the ship and stacked them on the quay.|Each ___ at the harbor worked a twelve-hour shift loading and unloading cargo.|A ___ unloading the ship's hold found the hidden cargo.|mariner,regatta|stevedores
  frigate|a fast warship|护卫舰|The navy sent a ___, a fast warship, to guard the coast.|The ___ fired its cannons at the enemy fleet and sped away.|That old ___, once a swift ship of war, is now a museum.|schooner,regatta|frigates
  schooner|a sailing ship with two or more masts|纵帆船|The ___ raised the sails on both her masts and sailed out at dawn.|They crossed the bay in a ___, a two-masted sailing ship.|A white ___ with three tall masts rode at anchor.|flotsam,stevedore|schooners
  regatta|a series of boat races|赛船会|The ___, a week of boat races, draws rowers from all over Europe.|They watched the ___ from the bank as the boats raced past.|She won the junior race at the ___, the first of many sailing races that summer.|frigate,stevedore|regattas
  seafaring|traveling by sea; working as a sailor|航海的|The Vikings were a ___ people, living by their ships and sailing the open sea for trade.|He comes from a ___ family; his father and grandfather were sailors who spent their lives at sea.|Over the centuries, ___ nations such as Portugal built great fleets to sail the oceans.|picaresque,bellicose|seafarer
  capsize|of a boat, to turn over in the water|(船)翻覆|A big wave may ___ the canoe, turning it upside down.|Don't stand up, or the boat will tip over and ___.|The ferry began to ___ in the storm, rolling onto its side until it turned over.|scuttle,jettison|capsized
  scuttle|to sink one's own ship deliberately; to ruin a plan; to run with short quick steps|凿沉；破坏；急促奔跑|Rather than let the enemy take it, the crew chose to ___ the ship, opening holes in its hull on purpose.|Bad news may ___ the deal, ruining it before it is signed.|Crabs ___ across the sand on short, quick legs.|capsize,jettison|scuttled
  jettison|to throw goods overboard; to abandon something unwanted|抛弃(货物)；放弃|To lighten the ship in the storm, the crew had to ___ the cargo, throwing it into the sea.|They decided to ___ the old plan and throw it out completely.|The pilot had to ___ fuel, dumping it from the plane before landing.|scuttle,capsize|jettisoned
  flotsam|wreckage or goods found floating on the sea; people or things rejected|漂浮物；被遗弃的人或物|After the storm the beach was covered in ___, wreckage washed up by the waves.|Bits of ___, broken planks and floating crates, drifted past the boat.|The war left human ___ in every city, homeless people cast aside by the world.|contraband,schooner|
  `,
  "context-clues",
  {
    intro: t(
      "The old **mariner** watched the **regatta** from the quay, where a **stevedore** was unloading a **schooner**; he remembered the night his own ship had begun to **capsize**. These ten words help you talk about life at sea and the ships of old.",
      "老水手（**mariner**）站在码头上观看赛船会（**regatta**），旁边一个码头装卸工（**stevedore**）正在卸一艘纵帆船（**schooner**）的货；他想起了自己的船开始翻覆（**capsize**）的那个夜晚。这十个词帮你谈论海上生活和古老的船只。",
    ),
    watchOut: {
      meanings: t(
        "A ship **capsizes** by accident when it *turns over*; a crew **scuttles** a ship *on purpose* to sink it; to **jettison** is to *throw goods overboard*; **flotsam** is what *floats* on the sea afterward.",
        "**capsize** 是船意外*翻覆*；**scuttle** 是船员*故意*凿沉船只；**jettison** 是把货物*抛下海*；**flotsam** 是事后*漂浮*在海上的东西。",
      ),
      use: t(
        "A **mariner** *sails* ships; a **stevedore** *loads and unloads* them in port; a **frigate** is a *warship*, a **schooner** a *sailing ship* with two or more masts.",
        "**mariner** 是*驾船航行*的人；**stevedore** 是在港口*装卸货物*的人；**frigate** 是*战舰*，**schooner** 是有两根或更多桅杆的*帆船*。",
      ),
      spelling: t(
        "**Stevedore** ends in *-dore*; **regatta** has a double *t*; **jettison** has a double *t*; **schooner** begins with *sch-*; **capsize** ends in *-ize*.",
        "**stevedore** 结尾是 -dore；**regatta** 双写 t；**jettison** 双写 t；**schooner** 以 sch- 开头；**capsize** 结尾是 -ize。",
      ),
    },
    notes: `
      mariner|an old sailor of fifty years telling tales of storms|a sailor steering a ship by the North Star|a sailor reading the tides before going out|a mariner is a sailor; a stevedore loads ships in port|mariner 水手；stevedore 码头装卸工|stevedore is a dock worker who loads and unloads ships, not a sailor who sails the oceans|stevedore 指装卸船货的码头工人，不是远航大洋的水手|wayfarer is a traveler on foot, not someone who steers a ship|wayfarer 指徒步旅行者，不是驾船的人|mar · i · ner|marine drops its e before -er|marine 去掉 e 再加 -er
      stevedore|a worker carrying crates off a ship onto the quay|a twelve-hour shift loading and unloading cargo at a harbor|a worker unloading a ship's hold finding hidden cargo|a stevedore loads and unloads ships; a mariner sails them|stevedore 码头装卸工；mariner 水手|mariner is a sailor at sea, not a worker loading crates on a dock|mariner 指海上的水手，不是在码头上搬箱子的工人|regatta is a series of boat races, not a worker at a harbor|regatta 指赛船会，不是港口的工人|ste · ve · dore|steve- plus -dore|steve- 加 -dore
      frigate|a fast warship sent to guard a coast|a ship firing cannons at an enemy fleet|a swift ship of war now a museum|a frigate is a fast warship; a schooner is a sailing ship|frigate 护卫舰；schooner 纵帆船|schooner is a sailing ship with two or more masts, not a warship that fires cannons|schooner 指多桅帆船，不是开炮的战舰|regatta is a series of boat races, not a ship sent to guard a coast|regatta 指赛船会，不是派去守卫海岸的船|frig · ate|frig- plus -ate|frig- 加 -ate
      schooner|a ship raising sails on both masts at dawn|a two-masted sailing ship crossing a bay|a white ship with three tall masts at anchor|a schooner is a sailing ship with two or more masts; flotsam is floating wreckage|schooner 纵帆船；flotsam 漂浮残骸|flotsam is wreckage floating on the sea, not a ship that raises its sails|flotsam 指海上漂浮的残骸，不是扬帆的船|stevedore is a dock worker, not a ship with masts|stevedore 指码头工人，不是有桅杆的船|schoo · ner|sch- plus -ooner|sch- 加 -ooner
      regatta|a week of boat races drawing rowers from all over Europe|boats racing past people on a bank|the first of many sailing races that summer|a regatta is a series of boat races; a frigate is a warship|regatta 赛船会；frigate 护卫舰|frigate is a fast warship, not a series of races watched from a bank|frigate 指护卫舰，不是在岸边观看的系列赛|stevedore is a dock worker, not a week of boat races|stevedore 指码头工人，不是一周的赛船活动|re · gat · ta|re- plus -gatta, with a double t|re- 加 -gatta，双写 t
      seafaring|a people living by their ships and sailing for trade|a family of sailors who spent their lives at sea|nations building great fleets to sail the oceans|seafaring means living or traveling by sea; bellicose means eager for war|seafaring 航海的；bellicose 好战的|picaresque describes a story of a lovable rogue's adventures, not a people who live by sailing|picaresque 形容讲述可爱无赖冒险经历的故事，不形容以航海为生的民族|bellicose means eager for war, not living by ships and sailing for trade|bellicose 指好战，不是靠船只生活、航海经商|sea · far · ing|sea plus faring|sea 加 faring
      capsize|a wave turning a canoe upside down|a boat tipping over when someone stands up|a ferry rolling onto its side until it turned over|capsize means a boat turns over by accident; scuttle means to sink it on purpose|capsize 翻覆；scuttle 故意凿沉|scuttle means to sink one's own ship on purpose, not to turn over in a wave|scuttle 指故意凿沉自己的船，不是被浪打翻|jettison means to throw goods overboard, not for a boat to turn over|jettison 指把货物抛入海中，不是船翻覆|cap · size|cap plus size|cap 加 size
      scuttle|a crew opening holes in its own ship's hull on purpose|bad news ruining a deal before it is signed|crabs running across sand on short, quick legs|scuttle means to sink on purpose, ruin or scurry; capsize means to turn over by accident|scuttle 故意凿沉、破坏、急跑；capsize 意外翻覆|capsize means to turn over by accident, not to sink a ship on purpose or ruin a deal|capsize 指意外翻覆，不是故意凿沉或破坏交易|jettison means to throw goods overboard, not to run on short, quick legs|jettison 指把货物抛入海中，不是迈着小短腿疾跑|scut · tle|scut- plus -tle, with a double t|scut- 加 -tle，双写 t
      jettison|cargo thrown into the sea to lighten a ship in a storm|an old plan thrown out completely|fuel dumped from a plane before landing|jettison means to throw away; scuttle means to sink a ship on purpose|jettison 抛弃；scuttle 故意凿沉|scuttle means to sink one's own ship, not to throw its cargo into the sea|scuttle 指故意凿沉船只，不是把货物抛入海中|capsize means to turn over in the water, not to dump fuel or throw out a plan|capsize 指翻覆，不是倾倒燃油或放弃计划|jet · ti · son|jet plus a double t, then -ison|jet 双写 t，再接 -ison
      flotsam|wreckage washed up on a beach after a storm|broken planks and floating crates drifting past a boat|homeless people cast aside by war|flotsam is floating wreckage or rejected people; contraband is smuggled goods|flotsam 漂浮物；contraband 走私货|contraband is goods smuggled illegally, not wreckage washed up by waves|contraband 指非法走私的货物，不是被冲上岸的残骸|schooner is a sailing ship, not broken planks drifting past one|schooner 指帆船，不是漂过船边的碎木板|flot · sam|flot- as in float, then -sam|flot- 同 float，再接 -sam
    `,
  },
);

const pirates = batch(
  "words-of-pirates-and-plunder",
  ["Words of Pirates and Plunder", "海盗与劫掠的词"],
  ["robbers of the sea and what they took", "海上强盗及其掠夺物"],
  `
  buccaneer|a pirate, especially in the Caribbean; a bold adventurer|海盗；冒险家|The ___, a pirate who robbed ships in the Caribbean, buried his gold on an island.|He was a ___ of the business world, a bold adventurer who took wild risks.|The ___ and his pirate crew seized the Spanish treasure ship.|booty,contraband|buccaneers
  corsair|a pirate, especially of the Mediterranean coast of North Africa|(北非沿岸的)海盗|The ___, a pirate from the Barbary Coast, captured the merchant ship.|The ___ fleet, pirates sailing from North Africa, raided the coast of Italy.|Sailors in the Mediterranean feared every ___ who sailed out of Algiers.|booty,contraband|corsairs
  privateer|a privately owned ship allowed by a government to attack enemy ships|私掠船(主)|The queen gave the ___ a license, allowing his private ship to raid enemy ships.|With his government's permission, the ___ attacked the enemy's trade.|Each ___, a private captain licensed by the crown, kept a share of the prize.|booty,loot|privateers
  plunder|to steal goods by force, especially in war; the goods taken|掠夺；掠夺品|The invaders came to ___ the town, carrying off everything of value by force.|The pirates sailed up the coast to ___ every port, stealing gold and grain at sword point.|Companies ___ the forests for timber, taking whatever they want with no regard for the law.|besiege,jettison|plundered
  booty|valuable goods taken by force|战利品，赃物|The pirates counted their ___, the gold and jewels they had seized.|The thieves hid the ___, everything they had stolen, in a cave.|Gold and silks taken from the ship made up the ___.|privateer,corsair|
  maraud|to roam in search of things to steal|劫掠，抢劫|Bandits ___ through the border villages, roaming from place to place and stealing what they can.|Wolves ___ at night, prowling far and wide in search of sheep to steal.|Gangs began to ___ across the countryside, wandering from farm to farm looking for things to steal.|loiter,besiege|marauded,marauding,marauder
  pillage|to rob a place using violence, especially in war|(战争中)掠夺|The army began to ___ the city, robbing every house and killing anyone who resisted.|They would ___ every farm on their way, taking the food by force and burning the barns.|Soldiers were told not to ___ the villages or rob the people by force.|besiege,jettison|pillaged
  loot|goods stolen by thieves or soldiers; to steal during a riot or war|赃物；抢劫|After the riot the police found the stolen ___, televisions and phones, in a van.|The thieves split the ___, the jewels they had stolen, into three equal shares.|Soldiers carried their ___, silver and paintings taken from the palace, back home.|corsair,privateer|looted,looting,looter
  ransack|to search a place roughly, making a mess, often to steal|洗劫；仔细搜寻|Burglars ___ the house while we were away, tipping out every drawer to find money.|She will ___ the drawers for her passport, pulling everything out in a mess.|The soldiers ___ the palace, turning it upside down in their search for gold.|besiege,jettison|ransacked
  contraband|goods brought into or out of a country illegally|走私货|The ship carried ___ in hidden holds, smuggling goods past customs.|Customs officers seized the ___, goods brought into the country illegally.|Cigarettes smuggled across the border were sold as ___ in the market.|privateer,buccaneer|
  `,
  "context-clues",
  {
    intro: t(
      "The **buccaneer** and his crew sailed out to **plunder** Spanish ships; they would **ransack** each hold, share the **booty** and hide their **contraband** on a lonely island. These ten words help you talk about robbers of the sea and what they took.",
      "海盗（**buccaneer**）带着他的手下出海掠夺（**plunder**）西班牙船只；他们洗劫（**ransack**）每一个货舱，瓜分战利品（**booty**），再把走私货（**contraband**）藏到一座荒岛上。这十个词帮你谈论海上强盗和他们抢走的东西。",
    ),
    watchOut: {
      meanings: t(
        "A **buccaneer** robbed ships in the *Caribbean*; a **corsair** sailed from *North Africa*; a **privateer** attacked enemy ships *with a government's permission*.",
        "**buccaneer** 在*加勒比海*劫船；**corsair** 从*北非*出海；**privateer** 是*经政府许可*袭击敌船的私掠者。",
      ),
      use: t(
        "To **maraud** is to *roam* looking for things to steal; to **pillage** is to rob a place *with violence*; to **ransack** is to *search roughly*; **booty** and **loot** are the *goods taken*.",
        "**maraud** 是*四处游荡*寻找可抢的东西；**pillage** 是*用暴力*抢劫某地；**ransack** 是*粗暴地翻找*；**booty** 和 **loot** 是*抢来的东西*。",
      ),
      spelling: t(
        "**Buccaneer** has a double *c* and a double *e*; **privateer** ends in *-eer*; **maraud** has *au*; **contraband** is *contra-* plus *band*.",
        "**buccaneer** 双写 c，也双写 e；**privateer** 结尾是 -eer；**maraud** 含 au；**contraband** 是 contra- 加 band。",
      ),
    },
    notes: `
      buccaneer|a Caribbean pirate burying his gold on an island|a bold adventurer of the business world taking wild risks|a pirate and his crew seizing a Spanish treasure ship|a buccaneer is a pirate or bold adventurer; booty is the goods taken|buccaneer 海盗、冒险家；booty 战利品|booty is the goods pirates take, not a pirate himself|booty 指掠夺来的财物，不是海盗本人|contraband is goods smuggled illegally, not a person who robs ships|contraband 指走私货，不是劫船的人|buc · ca · neer|the double c, then -aneer|双写 c，结尾 -aneer
      corsair|a Barbary Coast pirate capturing a merchant ship|pirates from North Africa raiding the coast of Italy|pirates sailing out of Algiers feared by sailors|a corsair is a North African pirate; booty is what pirates take|corsair 北非海盗；booty 战利品|booty is the treasure pirates take, not a pirate who sails out of Algiers|booty 指海盗抢来的财宝，不是从阿尔及尔出海的海盗|contraband is smuggled goods, not a pirate who captures ships|contraband 指走私货，不是劫船的海盗|cor · sair|cor- plus -sair|cor- 加 -sair
      privateer|a private ship given a license by a queen to raid|a captain attacking enemy trade with his government's permission|a private captain licensed by the crown keeping a share of the prize|a privateer attacks enemy ships with permission; booty is the goods taken|privateer 私掠船主；booty 战利品|booty is the goods taken in a raid, not the licensed captain who takes them|booty 指劫掠所得的财物，不是持证劫掠的船长|loot is stolen goods, not a private ship with a government license|loot 指赃物，不是持政府许可证的私人船只|pri · va · teer|private drops its e before -eer|private 去掉 e 再加 -eer
      plunder|invaders carrying off everything of value from a town|pirates stealing gold and grain from every port at sword point|companies taking timber from forests with no regard for law|plunder means to steal by force; besiege means to surround|plunder 掠夺；besiege 围攻|besiege means to surround a place with an army, not to carry off its goods|besiege 指以军队包围某地，不是抢走它的财物|jettison means to throw goods away, the opposite of carrying them off by force|jettison 指抛弃货物，和用武力抢走财物正相反|plun · der|plun- plus -der|plun- 加 -der
      booty|gold and jewels pirates counted after a raid|everything thieves had stolen, hidden in a cave|gold and silks taken from a ship|booty is goods taken by force; a privateer is a licensed raider|booty 战利品；privateer 私掠者|privateer is a licensed sea raider, not the gold and jewels he takes|privateer 指持证劫掠的船主，不是他抢来的金银珠宝|corsair is a pirate, not the goods hidden in a cave|corsair 指海盗，不是藏在洞里的财物|boot · y|boot plus -y|boot 加 -y
      maraud|bandits roaming from village to village stealing what they can|wolves prowling far and wide for sheep at night|gangs wandering from farm to farm looking for things to steal|maraud means to roam in search of plunder; loiter means to hang about|maraud 四处劫掠；loiter 闲荡|loiter means to stand around in one place, not to roam far and wide stealing|loiter 指在一处闲站，不是四处游荡偷抢|besiege means to surround one place, not to roam from place to place|besiege 指包围一个地方，不是四处流窜|ma · raud|ma- plus -raud, with au|ma- 加 -raud，含 au
      pillage|an army robbing every house in a city and killing resisters|food taken by force from farms and barns burned|soldiers ordered not to rob villages by force|pillage means to rob violently; besiege means to surround|pillage 暴力掠夺；besiege 围攻|besiege means to surround a place and wait, not to rob every house in it|besiege 指包围等待，不是抢劫每一户|jettison means to throw goods away, the opposite of taking food by force|jettison 指抛弃货物，和用武力抢夺食物正相反|pil · lage|the double l, then -age|双写 l，结尾 -age
      loot|stolen televisions and phones found in a van after a riot|stolen jewels split into three shares|silver and paintings soldiers took from a palace|loot is stolen goods; a corsair is a pirate|loot 赃物；corsair 海盗|corsair is a North African pirate, not stolen televisions and phones|corsair 指北非海盗，不是被偷的电视和手机|privateer is a licensed sea raider, not silver and paintings carried home|privateer 指持证劫掠的船主，不是带回家的银器和画|loot|the double o, as in boot|双写 o，同 boot
      ransack|burglars tipping out every drawer to find money|drawers pulled out in a mess in search of a passport|soldiers turning a palace upside down in search of gold|ransack means to search roughly; besiege means to surround|ransack 洗劫、乱翻；besiege 围攻|besiege means to surround a place from outside, not to turn it upside down inside|besiege 指从外面包围，不是在里面翻个底朝天|jettison means to throw things away, not to search through drawers|jettison 指扔掉东西，不是翻找抽屉|ran · sack|ran plus sack|ran 加 sack
      contraband|goods smuggled past customs in hidden holds|goods brought into a country illegally and seized by customs|cigarettes smuggled across a border sold in a market|contraband is smuggled goods; a privateer is a licensed raider|contraband 走私货；privateer 私掠者|privateer is a licensed sea raider, not goods smuggled past customs|privateer 指持证劫掠的船主，不是偷运过海关的货物|buccaneer is a pirate, not cigarettes sold in a market|buccaneer 指海盗，不是市场上卖的香烟|con · tra · band|contra- plus band|contra- 加 band
    `,
  },
);

/** batchesI are the batches of taste, the build of the body, envy, obedience, roaming, riches, clear thought, inheritance, ships and pirates. */
export const batchesI: readonly BatchSpec[] = [food, build, malice, obedience, wandering, riches, clarity, inheritance, ships, pirates];
