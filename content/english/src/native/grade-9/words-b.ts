// Grade 9: the batches of words of the last five units, from imagined futures, food and medicine to the customs of
// many cultures, the arts, the life of words and the academic words of the year.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const power = batch(
  "words-of-power-and-control",
  ["Words of Power and Control", "权力与控制的词"],
  ["the power of rulers and how they control people", "统治者的权力与对人的控制"],
  `
  compliance|the act of obeying a rule, an order or a request|服从，遵守|The new rules demand total ___: every citizen must obey without question.|Inspectors check the factory's ___ with safety laws, making sure every rule is followed.|In the novel, ___ with every order is rewarded and questions are punished.|repression,edict|compliant
  indoctrinate|to teach someone to accept a set of beliefs without questioning them|灌输，洗脑|The regime used its schools to ___ children, teaching them never to question the leader.|The cult tried to ___ new members, filling their heads with its beliefs within days.|Songs and posters were used to ___ the young with the party's ideas.|coerce,subjugate|indoctrinates,indoctrinated,indoctrination
  autocrat|a ruler who has complete power and does not share it|独裁者，专制君主|The ___ made every decision himself and shared power with no one.|Under the ___, who ruled alone, no one dared to criticize the palace.|The old ___ who had ruled alone for forty years was finally forced from power.|conformist,emissary|autocrats,autocratic,autocracy
  subjugate|to defeat a people and bring them fully under your control|征服，使屈服|The empire set out to ___ its neighbors and rule them by force.|The novel shows how a state can ___ its own citizens until they have no power left.|The invaders tried to ___ the island's people, but they fought back and kept their freedom.|indoctrinate,purge|subjugates,subjugated,subjugation
  edict|an official order given by a person in authority|法令，敕令|The king's ___ banned all public meetings from that day on.|By ___ of the council, the gates were closed at dusk.|The new ___ was read aloud in every square: no one could leave the city.|compliance,repression|edicts
  conformist|a person who behaves and thinks like everyone else and follows the rules without question|墨守成规的人|In the novel, the ___ follows every rule, while the heroine questions them all.|He was a quiet ___ who never broke a rule and always did what others did.|The school rewarded the ___ who did as everyone else did and punished the rebel.|autocrat,compliance|conformists,nonconformist
  coerce|to make someone do something by using force or threats|胁迫，强迫|The guards tried to ___ him into signing by threatening his family.|It is wrong to ___ a prisoner into a confession with threats.|The state used fear and threats to ___ the people into obeying.|indoctrinate,subjugate|coerces,coerced,coercion,coercive
  repression|the use of force to control people and stop them from expressing themselves|镇压，压制|Years of ___ by the secret police made the people afraid to speak.|The government's violent ___ of every protest was condemned abroad.|The novel describes the ___ of all free thought by force.|edict,compliance|repress,represses,repressed,repressive
  authoritarian|demanding strict obedience to authority at the expense of personal freedom|专制的，独裁主义的|The ___ government, demanding strict obedience, banned all newspapers but one.|Her ___ father demanded obedience and allowed no arguments at dinner.|Many novels warn against ___ rule, where personal freedom is lost.|arbitrary,didactic|authoritarianism
  purge|to remove people from an organization or a country, often violently, because they are thought disloyal|清洗，清除|The dictator set out to ___ the army of every officer he did not trust.|After the failed revolt, the leader decided to ___ hundreds of disloyal officials.|The party would ___ anyone who questioned its leader.|coerce,subjugate|purges,purged
  `,
  "context-clues",
  {
    intro: t(
      "In the novel, an **autocrat** rules alone: his **edict** forbids all meetings, his schools **indoctrinate** the young, and anyone who refuses **compliance** disappears. These ten words help you describe how rulers take and keep control.",
      "小说里，一位独裁者（**autocrat**）独揽大权：他的法令（**edict**）禁止一切集会，他的学校向青少年灌输思想（**indoctrinate**），凡是拒不服从（**compliance**）的人都会消失。这十个词帮你描述统治者如何夺取并保持控制。",
    ),
    watchOut: {
      meanings: t(
        "Tell the methods apart: to **coerce** is to force with *threats*, to **indoctrinate** is to teach beliefs that must not be *questioned*, and to **subjugate** is to *conquer* a whole people.",
        "分清手段：**coerce** 是用威胁强迫，**indoctrinate** 是灌输不许质疑的信念，**subjugate** 是征服整个民族。",
      ),
      use: t(
        "An **edict** is the *order*; **compliance** is *obeying* it; a **conformist** is the *person* who obeys; and an **autocrat** is the *ruler* who gives it.",
        "**edict** 是命令本身；**compliance** 是服从；**conformist** 是服从的人；**autocrat** 是下令的统治者。",
      ),
      spelling: t(
        "Watch the *-ance* of **compliance**, the *co-erce* of **coerce**, the double *s* of **repression** and the *-ju-* of **subjugate**.",
        "注意 **compliance** 的 -ance、**coerce** 拼作 co-erce、**repression** 的双写 s，以及 **subjugate** 中的 -ju-。",
      ),
    },
    notes: `
      compliance|every citizen obeying new rules without question|a factory following every safety law|obeying every order and being rewarded for it|compliance is obeying; an edict is the order that is obeyed|compliance 是服从；edict 是被服从的命令|repression is the use of force to silence people, not the act of obeying|repression 是用武力让人噤声，不是服从的行为|edict is the official order itself, not the act of obeying it|edict 是官方命令本身，不是服从命令的行为|com · pli · ance|comply changes y to i, then -ance|comply 的 y 变成 i，再加 -ance
      indoctrinate|schools teaching children never to question a leader|a cult filling new members' heads with its beliefs|songs and posters filling the young with a party's ideas|to indoctrinate is to teach unquestioned beliefs; to coerce is to force with threats|indoctrinate 是灌输不许质疑的信念；coerce 是用威胁强迫|coerce means to force someone with threats, not to teach beliefs that must not be questioned|coerce 指用威胁强迫人，不是灌输不许质疑的信念|subjugate means to defeat a people and bring them under control, not to teach them beliefs|subjugate 指征服一个民族并加以控制，不是向他们灌输信念|in · doc · tri · nate|doctrine without its e, then -ate|doctrine 去掉 e 再加 -ate
      autocrat|a ruler who made every decision himself|a palace no one dared to criticize under a lone ruler|a ruler forced from power after forty years of ruling alone|an autocrat rules with total power; a conformist simply follows the rules|autocrat 独揽大权；conformist 只是循规蹈矩|conformist is someone who follows the rules like everyone else, not a ruler with total power|conformist 是和大家一样循规蹈矩的人，不是独揽大权的统治者|emissary is someone sent with a message, not a ruler who keeps all power|emissary 是奉命传信的人，不是独揽大权的统治者|au · to · crat|auto- plus -crat|auto- 加 -crat
      subjugate|an empire ruling its neighbors by force|a state taking every bit of power from its own citizens|invaders trying to rule an island's people|to subjugate is to conquer a people; to purge is to remove the disloyal|subjugate 是征服一个民族；purge 是清除不忠的人|indoctrinate means to teach beliefs that must not be questioned, not to conquer a people|indoctrinate 指灌输不许质疑的信念，不是征服一个民族|purge means to remove people thought disloyal, not to conquer a people and rule them|purge 指清除被认为不忠的人，不是征服并统治一个民族|sub · ju · gate|sub- plus -jugate|sub- 加 -jugate
      edict|a king's order banning all public meetings|a council's order closing the gates at dusk|an order read aloud in every square|an edict is an official order; compliance is obeying one|edict 是官方命令；compliance 是服从命令|compliance is obeying an order, not the order itself|compliance 是服从命令，不是命令本身|repression is the use of force to silence people, not an official order|repression 是用武力让人噤声，不是官方命令|e · dict|e- plus dict, as in dictate|e- 加 dict（同 dictate）
      conformist|a character who follows every rule while the heroine questions them|a quiet man who never broke a rule|a student rewarded for doing as everyone else did|a conformist goes along with everyone; an autocrat rules over everyone|conformist 随大流；autocrat 统治所有人|autocrat is a ruler with total power, not someone who obeys like everyone else|autocrat 是独揽大权的统治者，不是和大家一样服从的人|compliance is the act of obeying, not the person who goes along with everyone|compliance 是服从的行为，不是随大流的人|con · form · ist|con- plus form plus -ist|con- 加 form 再加 -ist
      coerce|guards threatening a man's family to make him sign|threats used to force a confession from a prisoner|a state using fear to force people to obey|to coerce is to force with threats; to indoctrinate is to teach unquestioned beliefs|coerce 是用威胁强迫；indoctrinate 是灌输不许质疑的信念|indoctrinate means to teach beliefs that must not be questioned, not to force with threats|indoctrinate 指灌输不许质疑的信念，不是用威胁强迫|subjugate means to conquer a whole people, not to force one action by threats|subjugate 指征服整个民族，不是用威胁逼人做某件事|co · erce|co- plus -erce, not -urse|co- 加 -erce，不是 -urse
      repression|secret police making people afraid to speak|a government crushing every protest by force|free thought crushed by force|repression is using force to silence people; an edict is an official order|repression 是用武力压制；edict 是官方命令|edict is an official order, not the use of force to silence people|edict 是官方命令，不是用武力让人噤声|compliance is obeying, not using force to stop people from speaking|compliance 是服从，不是用武力阻止人们发声|re · pres · sion|the double s in -ssion|-ssion 中双写 s
      authoritarian|a government that demanded obedience and banned newspapers|a father who allowed no arguments at dinner|rule in which personal freedom is lost|authoritarian demands strict obedience; arbitrary acts on whim|authoritarian 要求绝对服从；arbitrary 凭一时兴起|arbitrary means based on whim rather than reason, not demanding strict obedience|arbitrary 指凭一时兴起而非道理，不是要求绝对服从|didactic means meant to teach a lesson, not demanding obedience|didactic 指意在说教，不是要求服从|au · thor · i · tar · i · an|author plus -itarian|author 加 -itarian
      purge|a dictator removing every officer he did not trust from the army|a leader removing hundreds of disloyal officials after a revolt|a party removing anyone who questioned its leader|to purge is to remove the disloyal; to coerce is to force with threats|purge 是清除不忠者；coerce 是用威胁强迫|coerce means to force someone to do something by threats, not to remove people thought disloyal|coerce 指用威胁逼人做事，不是清除被认为不忠的人|subjugate means to conquer a people, not to remove disloyal members|subjugate 指征服一个民族，不是清除不忠的成员|purge|the -urge ending, as in urge|结尾是 -urge，同 urge
    `,
  },
);

const space = batch(
  "words-of-space-travel",
  ["Words of Space Travel", "太空旅行的词"],
  ["travel beyond the Earth", "地球之外的旅行"],
  `
  trajectory|the curved path of something moving through the air or through space|轨道，轨迹|The engineers calculated the rocket's curved ___ to the moon.|A small bend in its ___ sent the probe off course.|The ball's high, curving ___ carried it over the fence.|velocity,zenith|trajectories
  velocity|the speed of something in a given direction|速度|The capsule reached a ___ of eleven kilometers per second.|To escape Earth's pull, a rocket must reach a very high ___.|Wind ___ in kilometers per hour is measured at the top of the tower.|propulsion,trajectory|velocities
  propulsion|the force that drives something forward|推进，推进力|The ship was driven by a new form of ___, using light instead of fuel.|Jet ___ changed air travel forever.|Engineers are testing solar ___ to drive ships on long voyages.|thruster,velocity
  payload|the people or equipment carried by a rocket or an aircraft, beyond what it needs to fly|有效载荷|The rocket's ___ was a weather satellite.|At two hundred kilometers up, the rocket released its ___, a small satellite, into orbit.|Each extra kilogram of ___ needs more fuel.|telemetry,thruster|payloads
  terrestrial|having to do with the Earth or with land rather than water or the sky|地球的，陆地的|Animals that are ___ live on land, not in water.|The astronauts missed ordinary ___ things like rain and grass.|Radio signals from ___ stations on Earth guided the ship.|celestial,synthetic
  celestial|having to do with the sky or outer space|天体的，天空的|Ancient sailors steered by ___ bodies such as stars.|A ___ map showed every known star and planet.|The comet was a rare ___ event in the night sky.|terrestrial,synthetic
  colonize|to send people to live in a place and take control of it|殖民，开拓|Some scientists dream of sending people to ___ Mars and build cities there.|The story imagines settlers who ___ distant moons and make homes there.|Plants were the first living things to ___ the bare volcanic island, spreading over the rock.|subjugate,purge|colonizes,colonized,colonization
  zenith|the point in the sky directly above you; or the highest point of something|天顶；顶峰|At noon the sun stood at its ___, straight overhead.|The empire reached its ___, its highest point, under its third ruler.|Her career was at its ___ when she won the prize.|trajectory,velocity
  telemetry|the automatic measuring of data at a distance and its sending by radio to a receiver|遥测，遥测数据|Mission control studied the ___ sent by radio from the probe.|The ___, data beamed back every second, showed that one engine was failing.|Without ___ from the satellite, the engineers could not tell where it was.|payload,propulsion
  thruster|a small engine used to steer a spacecraft or change its position|推进器|The pilot fired a small ___ on the left to turn the ship.|One ___ failed, and the capsule began to spin.|A tiny ___ keeps the satellite in its proper place.|propulsion,telemetry|thrusters
  `,
  "context-clues",
  {
    intro: t(
      "The rocket climbed on a curved **trajectory**, gaining **velocity** until it released its **payload**; then a small **thruster** turned the satellite toward Earth. These ten words help you follow a journey beyond the Earth.",
      "火箭沿着弧形轨道（**trajectory**）上升，不断加速（**velocity**），最后释放出有效载荷（**payload**）；随后一个小推进器（**thruster**）把卫星转向地球。这十个词帮你跟随一次地球之外的旅行。",
    ),
    watchOut: {
      meanings: t(
        "**Velocity** is *how fast*, **trajectory** is *which path*, and **propulsion** is the *force* that drives the ship; a **thruster** is one small engine that steers.",
        "**velocity** 是多快，**trajectory** 是走哪条路，**propulsion** 是推动飞船的力；**thruster** 是一个负责转向的小发动机。",
      ),
      use: t(
        "**Terrestrial** points *down* to the Earth and its land; **celestial** points *up* to the sky; the **zenith** is the highest point straight overhead.",
        "**terrestrial** 指向下方的地球与陆地；**celestial** 指向上方的天空；**zenith** 是头顶正上方的最高点。",
      ),
      spelling: t(
        "Watch the double *r* of **terrestrial**, the soft *c* and *-tial* of **celestial**, the *z* and *-th* of **zenith**, and the single *l* of **velocity**.",
        "注意 **terrestrial** 的双写 r、**celestial** 中读软音的 c 和结尾 -tial、**zenith** 开头的 z 和结尾的 -th，以及 **velocity** 只有一个 l。",
      ),
    },
    notes: `
      trajectory|a rocket's curved path to the moon|a small bend in a probe's path that sent it off course|a ball's high, curving path over a fence|a trajectory is the path; velocity is the speed|trajectory 是路径；velocity 是速度|velocity is speed in a direction, not the curved path itself|velocity 是某个方向上的速度，不是弯曲的路径本身|zenith is the single highest point, not a whole path through the air|zenith 是一个最高点，不是穿过空中的整条路径|tra · jec · to · ry|the -ject- and the -ory ending|中间是 -ject-，结尾是 -ory
      velocity|a capsule moving eleven kilometers every second|the high speed a rocket needs to escape Earth's pull|wind speed in kilometers per hour measured on a tower|velocity is speed; propulsion is the force that drives|velocity 是速度；propulsion 是推动的力|propulsion is the force that drives something forward, not its speed|propulsion 是推动物体前进的力，不是它的速度|trajectory is the path something follows, not how fast it moves|trajectory 是物体经过的路径，不是它移动得多快|ve · loc · i · ty|the -loc- with one c and the -ity ending|-loc- 中只有一个 c，结尾是 -ity
      propulsion|a ship driven across space by light instead of fuel|jet engines that changed air travel|sunlight tested as a way to drive ships on long voyages|propulsion is the driving force; a thruster is one small engine|propulsion 是推动力；thruster 是一个小发动机|thruster is one small engine for steering, not the driving force itself|thruster 是一个负责转向的小发动机，不是推动力本身|velocity is speed, not the force that drives something|velocity 是速度，不是推动物体的力|pro · pul · sion|the -pul- and the -sion ending|中间是 -pul-，结尾是 -sion
      payload|a weather satellite carried by a rocket|a small satellite released into orbit two hundred kilometers up|cargo that needs more fuel for every extra kilogram|the payload is the cargo; telemetry is data sent back|payload 是运载的货物；telemetry 是传回的数据|telemetry is data sent back by radio, not the cargo carried|telemetry 是用无线电传回的数据，不是运载的货物|thruster is a small steering engine, not the cargo the rocket carries|thruster 是转向用的小发动机，不是火箭运载的货物|pay · load|pay plus load|pay 加 load
      terrestrial|animals that live on land instead of in water|astronauts missing rain and grass on Earth|radio stations on Earth guiding a ship|terrestrial belongs to the Earth or land; celestial belongs to the sky|terrestrial 属于地球或陆地；celestial 属于天空|celestial means having to do with the sky or outer space, not the Earth or land|celestial 指与天空或外太空有关，不是地球或陆地|synthetic means made by people, not having to do with the Earth|synthetic 指人造的，与地球无关|ter · res · tri · al|the double r and the -trial ending|双写 r，结尾是 -trial
      celestial|stars used by ancient sailors to steer|a map of every known star and planet|a comet in the night sky|celestial belongs to the sky; terrestrial belongs to the Earth|celestial 属于天空；terrestrial 属于地球|terrestrial means having to do with the Earth or land, not the sky|terrestrial 指与地球或陆地有关，不是天空|synthetic means made by people, not belonging to the sky|synthetic 指人造的，不是属于天空的|ce · les · tial|the soft c and the -tial ending|c 读软音，结尾是 -tial
      colonize|sending people to live on Mars and build cities there|settlers making homes on distant moons|plants spreading over a bare volcanic island|to colonize is to settle a new place; to subjugate is to conquer a people|colonize 是去新地方定居；subjugate 是征服一个民族|subjugate means to defeat a people and rule them, not to send settlers to live in a new place|subjugate 指征服并统治一个民族，不是派人去新地方定居|purge means to remove people thought disloyal, not to send settlers to live somewhere|purge 指清除被认为不忠的人，不是派人去某地定居|col · o · nize|colony changes y to i, then -ize|colony 的 y 变成 i，再加 -ize
      zenith|the sun straight overhead at noon|an empire at its highest point under its third ruler|a career at its peak when she won a prize|the zenith is the highest point; a trajectory is a whole path|zenith 是最高点；trajectory 是整条路径|trajectory is a curved path, not the single highest point|trajectory 是一条弯曲的路径，不是一个最高点|velocity is speed, not the highest point|velocity 是速度，不是最高点|ze · nith|the z at the start and the -th at the end|开头是 z，结尾是 -th
      telemetry|data sent by radio from a probe to mission control|readings beamed back every second showing a failing engine|signals from a satellite telling engineers where it was|telemetry is data sent back by radio; a payload is the cargo carried|telemetry 是用无线电传回的数据；payload 是运载的货物|payload is the cargo a rocket carries, not data sent back by radio|payload 是火箭运载的货物，不是用无线电传回的数据|propulsion is the force that drives something, not measured data|propulsion 是推动物体的力，不是测得的数据|te · lem · e · try|tele- plus -metry|tele- 加 -metry
      thruster|a small engine fired to turn a ship|one small engine failing so that a capsule spins|a tiny engine keeping a satellite in place|a thruster is one small steering engine; propulsion is the driving force in general|thruster 是一个转向的小发动机；propulsion 泛指推动力|propulsion is the driving force in general, not one small steering engine|propulsion 泛指推动力，不是一个转向用的小发动机|telemetry is data sent by radio, not an engine|telemetry 是用无线电传回的数据，不是发动机|thrust · er|thrust plus -er|thrust 加 -er
    `,
  },
);

const minds = batch(
  "words-of-artificial-minds",
  ["Words of Artificial Minds", "人造心智的词"],
  ["robots and thinking machines", "机器人与会思考的机器"],
  `
  synthetic|made by people, often as a copy of something natural|合成的，人造的|The robot's skin was made of a ___ material, produced in a factory to look like real skin.|Fabrics such as nylon are ___, made from chemicals rather than plants.|The story asks whether a mind that is ___, made in a lab, can feel.|humanoid,programmable|synthetically
  sentient|able to feel and to be aware of things|有知觉的，有感情的|Is the machine in the story ___, able to feel pain and joy?|Most people agree that dogs are ___ beings that can suffer.|The ship's computer became ___ and began to feel fear.|sapient,programmable|sentience
  conscious|aware of yourself and your surroundings; or aware of a particular thing|有意识的；意识到的|After the fall, she was still ___ but confused, awake and aware of the room.|The robot slowly became ___ of its own thoughts.|He was ___ of the other students staring at him.|sentient,programmable|consciously,consciousness,unconscious,subconscious
  interface|the way a person communicates with a machine, or the point where two systems meet|界面，接口|The new ___ lets people talk to the computer instead of typing.|A simple, clear ___ of buttons and menus makes the app easy to use.|The story describes a direct ___ between brain and machine, where the two meet.|glitch,telemetry|interfaces
  cybernetic|having to do with the joining of living bodies with machines, or with control systems in both|控制论的，人机结合的|The soldier had a ___ arm, wired to his nerves, that could lift a car.|Some ___ research studies how brains and machines both control movement.|The novel's hero is half human and half machine, a ___ being.|humanoid,synthetic|cybernetics
  humanoid|having the shape or the qualities of a human; or a robot shaped like a person|类人的；类人机器人|The ___ robot walked on two legs and had a face like a person's.|The aliens in the film are ___, with two arms and two legs, but green skin.|The hotel greeted visitors with a ___ machine shaped like a smiling woman.|synthetic,cybernetic|humanoids
  programmable|able to be given instructions so that it carries out tasks automatically|可编程的|The ___ oven starts cooking at whatever time you set.|Early robots were simply ___ arms in factories, repeating the steps they were given.|Each ___ drone follows the instructions loaded into it.|synthetic,cybernetic
  glitch|a small fault that stops a machine or a system from working properly|小故障，失灵|A tiny ___ in the software, a small fault in one line, shut down the trains.|The robot's strange behavior began with a small ___ in its memory chip.|After the ___ was fixed, the game ran smoothly again.|interface,malware|glitches
  sapient|wise, or able to think and reason as humans do|有智慧的，能思考的|The novel imagines ___ machines that reason and write poetry.|Humans call themselves the ___ species, the wise ones.|Is a ___ robot, one that thinks and reasons like a person, a person in the eyes of the law?|sentient,synthetic|sapience
  automaton|a machine that moves on its own like a person; or a person who acts without thinking|自动机，机器人；机械般的人|The clockmaker's ___, a mechanical boy of gears and springs, could write a letter.|Tired and silent, he worked through the night like a machine, a mere ___.|The ___ in the museum, moved by clockwork, still plays the flute.|conformist,interface|automata,automatons
  `,
  "context-clues",
  {
    intro: t(
      "The **humanoid** robot had **synthetic** skin and a **programmable** brain, until one day a strange **glitch** left it asking whether it was **sentient**. These ten words help you talk about robots and thinking machines.",
      "这个类人（**humanoid**）机器人有人造（**synthetic**）皮肤和可编程（**programmable**）的大脑，直到有一天，一个奇怪的故障（**glitch**）让它开始追问自己是否有知觉（**sentient**）。这十个词帮你谈论机器人与会思考的机器。",
    ),
    watchOut: {
      meanings: t(
        "Three words about minds: **sentient** can *feel*, **sapient** can *think and reason*, and **conscious** is *awake and aware*.",
        "三个关于心智的词：**sentient** 能感受，**sapient** 能思考推理，**conscious** 是清醒并有意识。",
      ),
      use: t(
        "**Humanoid** is about *shape* like a human; **synthetic** is about being *made by people*; **cybernetic** is about a living body *joined to* a machine.",
        "**humanoid** 说的是像人的外形；**synthetic** 说的是人造的；**cybernetic** 说的是生物体与机器相连。",
      ),
      spelling: t(
        "Watch the *-sci-* of **conscious**, the *-tient* (said *shent*) of **sentient**, the double *m* of **programmable** and the *-tch* of **glitch**.",
        "注意 **conscious** 中的 -sci-、**sentient** 的 -tient（读 shent）、**programmable** 的双写 m，以及 **glitch** 结尾的 -tch。",
      ),
    },
    notes: `
      synthetic|robot skin made in a factory to look like real skin|fabrics such as nylon made from chemicals|a mind made in a lab|synthetic is made by people; humanoid is shaped like a person|synthetic 是人造的；humanoid 是人形的|humanoid means shaped like a human, not made by people as a copy of something natural|humanoid 指外形像人，不是人工仿造的|programmable means able to be given instructions, not made as a copy of something natural|programmable 指能输入指令，不是仿造自然之物|syn · thet · ic|syn- with a y and the -thet- in the middle|syn- 中是 y，中间是 -thet-
      sentient|a machine that may feel pain and joy|dogs as beings that can suffer|a ship's computer that began to feel fear|sentient can feel; sapient can think and reason|sentient 能感受；sapient 能思考推理|sapient means able to think and reason like a human, not simply able to feel|sapient 指能像人一样思考推理，不只是能感受|programmable means able to be given instructions, not able to feel|programmable 指能输入指令，不是能感受|sen · tient|the -tient ending, said shent|结尾 -tient 读作 shent
      conscious|a woman awake and aware of the room after a fall|a robot slowly becoming aware of its own thoughts|a boy aware of other students staring at him|conscious is awake and aware; sentient is able to feel|conscious 是清醒、意识到；sentient 是能感受|sentient means able to feel, a general power of a living being, not awake or aware of one particular thing|sentient 指能感受，是生物的一种能力，不是清醒或意识到某件事|programmable means able to follow instructions, not aware|programmable 指能执行指令，不是有意识的|con · scious|the -sci- as in science, then -ous|中间是 -sci-（同 science），结尾是 -ous
      interface|a way to talk to a computer instead of typing|buttons and menus that make an app easy to use|the point where a brain and a machine meet|an interface is how a person and a machine meet; a glitch is a fault|interface 是人与机器交流的方式；glitch 是故障|glitch is a small fault that stops something working, not the way a person communicates with a machine|glitch 是让机器出问题的小故障，不是人与机器交流的方式|telemetry is data sent back by radio, not the point where a person and a machine meet|telemetry 是用无线电传回的数据，不是人与机器相接之处|in · ter · face|inter- plus face|inter- 加 face
      cybernetic|an arm wired to a soldier's nerves that could lift a car|research on how brains and machines both control movement|a being that is half human and half machine|cybernetic joins body and machine; humanoid is shaped like a person|cybernetic 是人机结合；humanoid 是人形的|humanoid means shaped like a human, not joining a living body with machines|humanoid 指外形像人，不是生物体与机器结合|synthetic means made by people, which says nothing of joining a body to a machine|synthetic 指人造的，并不涉及身体与机器相连|cy · ber · net · ic|cyber- with a y and the -netic ending|cyber- 中是 y，结尾是 -netic
      humanoid|a robot walking on two legs with a person's face|aliens with two arms and two legs but green skin|a machine shaped like a smiling woman|humanoid is shaped like a human; synthetic is made by people|humanoid 是人形的；synthetic 是人造的|synthetic means made by people, not shaped like a human|synthetic 指人造的，不是外形像人|cybernetic means joining living bodies with machines, not having a human shape|cybernetic 指生物体与机器结合，不是有人的外形|hu · man · oid|human plus -oid|human 加 -oid
      programmable|an oven that starts cooking at a set time|factory arms repeating the steps they were given|drones following instructions loaded into them|programmable takes instructions; synthetic is made by people|programmable 能输入指令；synthetic 是人造的|synthetic means made by people from chemicals or parts, not able to follow instructions|synthetic 指用化学品或零件人工制成，不是能执行指令|cybernetic means joining living bodies and machines, not able to be given instructions|cybernetic 指生物体与机器结合，不是能输入指令|pro · gram · ma · ble|the double m and the -able ending|双写 m，结尾是 -able
      glitch|a small fault in one line of software that shut down trains|a small fault in a robot's memory chip|a fault that, once fixed, let a game run smoothly|a glitch is a small accidental fault; malware is harmful software made on purpose|glitch 是偶然的小故障；malware 是故意制造的恶意软件|interface is the way a person communicates with a machine, not a fault|interface 是人与机器交流的方式，不是故障|malware is harmful software made on purpose, not a small accidental fault|malware 是故意制作的有害软件，不是偶然的小故障|glitch|the -tch ending, as in itch|结尾是 -tch，同 itch
      sapient|machines that reason and write poetry|humans calling themselves the wise species|a robot that thinks and reasons like a person|sapient can think and reason; sentient can feel|sapient 能思考推理；sentient 能感受|sentient means able to feel, not able to think and reason|sentient 指能感受，不是能思考推理|synthetic means made by people, not wise or able to reason|synthetic 指人造的，不是有智慧、能推理|sa · pi · ent|the -ient ending|结尾是 -ient
      automaton|a mechanical boy of gears and springs that could write|a man working through the night like a machine|a clockwork figure in a museum that plays the flute|an automaton moves by itself like a person; a conformist just follows others|automaton 是会自己动的机械人；conformist 只是随大流的人|conformist is a person who follows the rules like everyone else, not a moving machine or someone who acts like one|conformist 是和大家一样循规蹈矩的人，不是会自己动的机器或像机器一样的人|interface is how a person communicates with a machine, not a self-moving figure|interface 是人与机器交流的方式，不是会自己动的机械人|au · tom · a · ton|auto- and the -aton ending|auto- 开头，结尾是 -aton
    `,
  },
);

const diet = batch(
  "words-of-diet-and-health",
  ["Words of Diet and Health", "饮食与健康的词"],
  ["food, diet and health", "食物、饮食与健康"],
  `
  digestion|the process by which the body breaks down food so it can be used|消化|Good bacteria in the gut help ___ by breaking food down.|A walk after dinner is said to aid the ___ of the meal.|The breaking down of food, called ___, begins in the mouth with saliva.|deficiency,moderation|digestive
  deficiency|a lack of something that is needed|缺乏，不足|Scurvy is caused by a lack of vitamin C; this ___ was once common among sailors.|The doctor found that she lacked iron: her blood showed an iron ___.|The plan's main ___ is that it lacks money.|moderation,obesity|deficiencies,deficient
  moderation|the quality of not doing something too much|适度，节制|Sweets are fine in ___, a little at a time.|The doctor advised ___ in all things: not too much of anything.|She drinks coffee, but only in ___, one cup a day.|deficiency,digestion
  abstain|to choose not to do or have something, especially something you enjoy|戒除，避免|He chose to ___ from sugar for a month.|Three members chose to ___ from voting and stayed silent.|Athletes often ___ from heavy food before a race.|forsake,improvise|abstains,abstained,abstinence
  dietary|having to do with the food you eat|饮食的|The restaurant can meet any ___ needs, such as no meat or no nuts.|Beans and grains are rich in ___ fiber, the part of food that helps your gut.|Her ___ habits, what she ate each day, improved after the illness.|malnourished,respiratory
  gluten|a protein found in wheat and some other grains, which makes dough stretchy|麸质，面筋|Some people cannot eat ___, the protein in wheat, and must avoid bread.|The bakery sells cakes made without wheat or ___.|The ___ in flour gives pizza dough its stretch.|cholesterol,insulin
  cholesterol|a fatty substance in the blood that can block arteries when there is too much of it|胆固醇|Fried foods can raise the ___ in your blood.|The doctor tested the level of ___ in his blood every year.|High ___ can block arteries and increase the risk of heart disease.|gluten,obesity
  obesity|the condition of being very overweight in a way that harms health|肥胖症|Rates of childhood ___ have risen as children eat more and move less.|Exercise and a healthy diet can help prevent ___ and keep weight down.|Being far too heavy, called ___, is linked to many diseases.|deficiency,cholesterol|obese
  malnourished|weak and ill because of not having enough of the right food|营养不良的|The rescued children were badly ___ after months with too little food.|Lacking the right food, the ___ child grew slowly.|Even people who eat a lot can be ___ if their food lacks vitamins.|dietary,skeletal|malnourishment
  insulin|a substance made in the body that controls the amount of sugar in the blood|胰岛素|People with some kinds of diabetes need ___ injections to control their blood sugar.|After a meal, the body makes ___ to control the sugar in the blood.|The discovery of ___ saved millions of people with diabetes.|gluten,cholesterol
  `,
  "context-clues",
  {
    intro: t(
      "The doctor said his **cholesterol** was high but warned against a **deficiency** of iron too: eat everything in **moderation**, she said, and **abstain** from fried food. These ten words help you talk about food, diet and health.",
      "医生说他的胆固醇（**cholesterol**）偏高，但也提醒他别缺铁（**deficiency**）：什么都要适度（**moderation**），还要戒掉（**abstain**）油炸食品。这十个词帮你谈论食物、饮食与健康。",
    ),
    watchOut: {
      meanings: t(
        "A **deficiency** is *too little* of something; **obesity** is *too much* body weight; **moderation** is the sensible amount in between.",
        "**deficiency** 是某样东西太少；**obesity** 是体重太多；**moderation** 是介于两者之间的合理分量。",
      ),
      use: t(
        "Three substances: **gluten** is a protein in *wheat*, **cholesterol** is a fat in the *blood*, and **insulin** controls blood *sugar*.",
        "三种物质：**gluten** 是小麦中的蛋白质，**cholesterol** 是血液中的脂肪，**insulin** 控制血糖。",
      ),
      spelling: t(
        "Watch the *ch* said as *k* in **cholesterol**, the *-cien-* of **deficiency**, the single *s* and *l* of **insulin**, and the *-nour-* of **malnourished**.",
        "注意 **cholesterol** 中读作 k 的 ch、**deficiency** 中的 -cien-、**insulin** 只有一个 s 和一个 l，以及 **malnourished** 中的 -nour-。",
      ),
    },
    notes: `
      digestion|gut bacteria helping to break food down|a walk after dinner to help the body process a meal|the breaking down of food starting in the mouth|digestion is breaking food down; a deficiency is a lack|digestion 是分解食物；deficiency 是缺乏|deficiency is a lack of something needed, not breaking food down|deficiency 是缺少所需之物，不是分解食物|moderation is not doing something too much, not the body's processing of food|moderation 是不过量，不是身体对食物的处理|di · ges · tion|digest plus -ion|digest 加 -ion
      deficiency|a lack of vitamin C that once troubled sailors|blood showing too little iron|a plan that lacks money|a deficiency is too little of something; moderation is the right amount|deficiency 是太少；moderation 是适量|moderation is not having too much, not a lack of something needed|moderation 是不过量，不是缺少所需之物|obesity is being very overweight, not lacking something|obesity 是严重超重，不是缺少什么|de · fi · cien · cy|the -cien- with a c and the -cy ending|中间是带 c 的 -cien-，结尾是 -cy
      moderation|sweets eaten a little at a time|a doctor's advice of not too much of anything|only one cup of coffee a day|moderation is not too much; a deficiency is too little|moderation 是不过量；deficiency 是太少|deficiency is a lack of something, not having just the right amount|deficiency 是缺乏，不是恰到好处的分量|digestion is breaking down food, not avoiding too much of something|digestion 是分解食物，不是避免过量|mod · er · a · tion|moderate drops its e, then -ion|moderate 去掉 e 再加 -ion
      abstain|giving up sugar for a month|members choosing not to vote|athletes going without heavy food before a race|to abstain is to hold back from something; to forsake is to abandon it forever|abstain 是暂时不做；forsake 是永远抛弃|forsake means to leave someone or something forever, not to choose not to do something for a time|forsake 指永远离开某人或某物，不是暂时选择不做某事|improvise means to make something up on the spot, not to hold back from something|improvise 指临时凑成，不是忍住不做某事|ab · stain|ab- plus stain|ab- 加 stain
      dietary|a restaurant meeting needs such as no meat or no nuts|fiber in beans and grains that helps the gut|what a woman ate each day after an illness|dietary has to do with food in general; malnourished means ill from lacking the right food|dietary 泛指与饮食有关；malnourished 指因缺乏合适的食物而虚弱|malnourished means weak from not getting the right food, not having to do with food in general|malnourished 指因缺乏合适的食物而虚弱，不是泛指与饮食有关|respiratory has to do with breathing, not food|respiratory 指与呼吸有关，不是饮食|di · e · tar · y|diet plus -ary|diet 加 -ary
      gluten|the protein in wheat that some people cannot eat|cakes made without wheat|the stretch in pizza dough|gluten is a protein in wheat; cholesterol is a fat in the blood|gluten 是小麦中的蛋白质；cholesterol 是血液中的脂肪|cholesterol is a fatty substance in the blood, not a protein in wheat|cholesterol 是血液中的脂肪类物质，不是小麦中的蛋白质|insulin is made in the body to control blood sugar, not a protein in grain|insulin 是体内产生、控制血糖的物质，不是谷物中的蛋白质|glu · ten|glue without its e, then -ten|glue 去掉 e 再加 -ten
      cholesterol|fried food raising a fat in the blood|a yearly blood test for a fatty substance|a fat that can block arteries and cause heart disease|cholesterol is a fat in the blood; obesity is the whole body being overweight|cholesterol 是血液中的脂肪；obesity 是全身超重|gluten is a protein in wheat, not a fatty substance in the blood|gluten 是小麦中的蛋白质，不是血液中的脂肪类物质|obesity is being very overweight, not a substance in the blood|obesity 是严重超重，不是血液中的物质|cho · les · ter · ol|the ch said as k and the -ol ending|ch 读作 k，结尾是 -ol
      obesity|more children becoming very overweight as they eat more and move less|exercise and diet keeping weight down|being far too heavy, linked to many diseases|obesity is being very overweight; a deficiency is a lack|obesity 是严重超重；deficiency 是缺乏|deficiency is a lack of something, not being very overweight|deficiency 是缺少某物，不是严重超重|cholesterol is a fatty substance in the blood, not the whole body being overweight|cholesterol 是血液中的脂肪类物质，不是全身超重|o · bes · i · ty|obese drops its e, then -ity|obese 去掉 e 再加 -ity
      malnourished|children weak after months with too little food|a child growing slowly for lack of the right food|people who eat a lot but whose food lacks vitamins|malnourished is weak from lacking the right food; skeletal is very thin or about bones|malnourished 指营养不良；skeletal 指骨瘦如柴或与骨骼有关|dietary means having to do with food in general, not weak from lacking the right food|dietary 泛指与饮食有关，不是因缺乏合适的食物而虚弱|skeletal has to do with bones or means very thin, not ill from lacking the right food|skeletal 指与骨骼有关或骨瘦如柴，不是因缺乏合适的食物而生病|mal · nour · ished|mal- plus nourish plus -ed|mal- 加 nourish 再加 -ed
      insulin|injections that control blood sugar in diabetes|a substance the body makes after a meal to control sugar|a discovery that saved millions with diabetes|insulin controls blood sugar; gluten is a protein in wheat|insulin 控制血糖；gluten 是小麦中的蛋白质|gluten is a protein in wheat, not what controls blood sugar|gluten 是小麦中的蛋白质，不是控制血糖的物质|cholesterol is a fat in the blood, not the substance that controls sugar|cholesterol 是血液中的脂肪，不是控制血糖的物质|in · su · lin|one s and one l|只有一个 s 和一个 l
    `,
  },
);

const hospital = batch(
  "words-of-the-hospital",
  ["Words of the Hospital", "医院的词"],
  ["hospitals and medical care", "医院与医疗"],
  `
  diagnosis|the act of identifying an illness from its signs, or the judgment that results|诊断|The doctor looked at the X-ray, and her ___ was a broken wrist.|Early ___ of the illness, finding out what it is, can save lives.|After many tests, she finally learned what illness she had: the ___ came at last.|prognosis,triage|diagnostic
  prognosis|a doctor's judgment of how an illness will develop|预后，预断|The ___ is good; doctors expect him to recover fully.|The doctors gave a hopeful ___ about how well she would heal.|The ___ for the patient's recovery over the next year is poor.|diagnosis,dosage|prognoses
  acute|very serious or severe, coming on quickly; or sharp and keen|急性的；敏锐的|She was rushed to hospital with sudden, ___ pain in her side.|The shortage of nurses has become ___, a serious problem that came on fast.|Owls have ___ hearing, sharp enough to hear a mouse under the snow.|clinical,cardiac|acutely
  dosage|the amount of a medicine to be taken at one time|剂量|Follow the ___ on the label: two tablets a day.|The doctor lowered the ___ when the medicine made him dizzy.|A child's ___ of medicine is smaller than an adult's.|anesthetic,incision|dosages
  surgical|having to do with operations on the body|外科的，手术的|The nurse wore a ___ mask in the operating room.|The ___ tools used in operations must be cleaned carefully.|The ___ team operated through the night.|clinical,cardiac|surgically
  clinical|having to do with the examination and treatment of patients; or cold and without feeling|临床的；冷静客观的|The drug is now in ___ trials, tested on real patients.|She described the accident in a cold, ___ voice, with no feeling at all.|The ___ staff who examine and treat patients work in shifts.|surgical,acute|clinically,clinic,clinics
  anesthetic|a drug that stops a person from feeling pain|麻醉剂|The dentist gave her a local ___ so she would feel no pain.|Before the operation, he was given a general ___ that put him to sleep.|The ___ wore off after an hour, and the pain came back.|dosage,incision|anesthetics,anesthesia
  incision|a cut made in the body during an operation|切口|The surgeon made a small ___ in his side with a scalpel.|The ___ healed in two weeks, leaving a thin scar.|Modern methods need only a tiny ___ instead of a long cut.|anesthetic,dosage|incisions
  ailment|an illness, usually a minor one|小病，疾病|Grandmother treated every minor ___, from colds to sore throats, with tea and honey.|A cold is a common ___ in winter.|He suffered from a strange ___ of the skin that made it itch.|diagnosis,dosage|ailments
  triage|the sorting of patients by how urgently they need treatment|伤员分类，分诊|The nurse at ___ sorted the patients and sent him straight to a doctor.|After the crash, doctors set up ___ in a tent to decide who to treat first.|In ___, the most serious cases are treated first.|diagnosis,prognosis
  `,
  "context-clues",
  {
    intro: t(
      "At **triage**, the nurse saw his **acute** pain and sent him in at once; the **diagnosis** was appendicitis, and the surgeon made a small **incision** after the **anesthetic** took effect. These ten words help you follow what happens in a hospital.",
      "分诊（**triage**）时，护士看到他急性（**acute**）疼痛，立刻让他进去；诊断（**diagnosis**）结果是阑尾炎，麻醉剂（**anesthetic**）起效后，外科医生开了一个小切口（**incision**）。这十个词帮你了解医院里发生的事。",
    ),
    watchOut: {
      meanings: t(
        "**Diagnosis** says *what* the illness is; **prognosis** says *how it will go* from here; **triage** decides *who is treated first*.",
        "**diagnosis** 说明得的是什么病；**prognosis** 判断病情将如何发展；**triage** 决定先治谁。",
      ),
      use: t(
        "**Surgical** is about *operations*; **clinical** is about *examining and treating* patients, or a *cold* manner; **acute** means *sudden and severe*, or *sharp*.",
        "**surgical** 与手术有关；**clinical** 与检查治疗病人有关，也可指冷静无情；**acute** 指突然而严重，或敏锐。",
      ),
      spelling: t(
        "Watch the *-gno-* of **diagnosis** and **prognosis**, the *-esthet-* of **anesthetic**, the *-ci-* of **incision** and the *-age* of **dosage** and **triage**.",
        "注意 **diagnosis** 和 **prognosis** 中的 -gno-、**anesthetic** 中的 -esthet-、**incision** 中的 -ci-，以及 **dosage** 和 **triage** 结尾的 -age。",
      ),
    },
    notes: `
      diagnosis|a doctor reading an X-ray and naming a broken wrist|finding out early what an illness is|learning at last which illness she had after many tests|a diagnosis names the illness; a prognosis says how it will develop|diagnosis 判断是什么病；prognosis 判断病情发展|prognosis is a judgment of how an illness will develop, not what the illness is|prognosis 是对病情发展的判断，不是说明得了什么病|triage is sorting patients by urgency, not naming an illness|triage 是按紧急程度给病人分类，不是说出病名|di · ag · no · sis|the -gno- and the -sis ending|中间是 -gno-，结尾是 -sis
      prognosis|doctors expecting a full recovery|a hopeful judgment about how well she would heal|a poor outlook for a patient's recovery over the next year|a prognosis looks ahead; a diagnosis names the illness now|prognosis 预测未来；diagnosis 确定眼下的病|diagnosis names what the illness is, not how it will develop|diagnosis 说明得的是什么病，不是病情将如何发展|dosage is the amount of a medicine, not a judgment about the future|dosage 是药物的剂量，不是对未来的判断|prog · no · sis|pro- plus -gnosis|pro- 加 -gnosis
      acute|sudden, severe pain that sent a woman to hospital|a shortage of nurses that became serious fast|hearing sharp enough to hear a mouse under the snow|acute is sudden and severe, or sharp; clinical is about treating patients|acute 是急性严重或敏锐；clinical 与诊治病人有关|clinical has to do with treating patients or means coldly unemotional, not severe and sudden or sharp|clinical 与诊治病人有关或指冷漠无情，不是急性严重或敏锐|cardiac has to do with the heart, not severe, sudden or sharp|cardiac 与心脏有关，不是急性严重或敏锐|a · cute|a plus cute|a 加 cute
      dosage|two tablets a day as the label says|a smaller amount of medicine after it made a man dizzy|a child's smaller amount of medicine|dosage is the amount of medicine; an anesthetic is a drug that stops pain|dosage 是药量；anesthetic 是止痛的麻醉药|anesthetic is a drug that stops pain, not the amount to take|anesthetic 是让人感觉不到疼的药，不是服用的分量|incision is a cut made in surgery, not an amount of medicine|incision 是手术中的切口，不是药量|dos · age|dose drops its e, then -age|dose 去掉 e 再加 -age
      surgical|a mask worn in an operating room|tools used in operations|a team that operated through the night|surgical is about operations; clinical is about examining and treating patients|surgical 与手术有关；clinical 与检查治疗病人有关|clinical has to do with examining and treating patients in general, not with operations|clinical 泛指与检查治疗病人有关，不是专指手术|cardiac has to do with the heart, not with operations|cardiac 与心脏有关，不是与手术有关|sur · gi · cal|surgery loses -ery and adds -ical|surgery 去掉 -ery 再加 -ical
      clinical|a drug tested on real patients|a cold voice with no feeling describing an accident|staff who examine and treat patients in shifts|clinical is about treating patients or a cold manner; surgical is about operations|clinical 与诊治病人有关或指冷漠；surgical 与手术有关|surgical has to do with operations, not examining patients or a cold manner|surgical 与手术有关，不是检查病人或冷漠的态度|acute means severe and sudden or sharp, not cool and without feeling|acute 指急性严重或敏锐，不是冷静无情|clin · i · cal|clinic plus -al|clinic 加 -al
      anesthetic|a dentist's drug so a patient feels no pain|a drug that put a man to sleep before an operation|a drug wearing off so the pain came back|an anesthetic stops pain; a dosage is an amount of medicine|anesthetic 让人不疼；dosage 是药量|dosage is the amount of a medicine, not the drug that stops pain|dosage 是药物的剂量，不是止痛的药|incision is a cut, not a drug|incision 是切口，不是药|an · es · thet · ic|an- plus -esthet- plus -ic|an- 加 -esthet- 再加 -ic
      incision|a surgeon's small cut in a man's side|a cut that healed in two weeks leaving a scar|a tiny opening instead of a long cut|an incision is a cut in surgery; an anesthetic is a drug that stops pain|incision 是手术切口；anesthetic 是麻醉药|anesthetic is a drug that stops pain, not a cut|anesthetic 是止痛的药，不是切口|dosage is an amount of medicine, not a cut|dosage 是药量，不是切口|in · ci · sion|the -ci- and the -sion ending|中间是 -ci-，结尾是 -sion
      ailment|colds and sore throats treated with tea and honey|a cold as a common winter illness|a strange itching illness of the skin|an ailment is the illness itself; a diagnosis identifies it|ailment 是病本身；diagnosis 是诊断出来|diagnosis is identifying an illness, not the illness itself|diagnosis 是诊断疾病，不是疾病本身|dosage is the amount of medicine, not an illness|dosage 是药量，不是疾病|ail · ment|ail plus -ment|ail 加 -ment
      triage|a nurse sorting patients and sending one straight to a doctor|doctors in a tent deciding who to treat first after a crash|the most serious cases treated first|triage sorts patients by urgency; a diagnosis names an illness|triage 按紧急程度分类；diagnosis 确定病名|diagnosis names an illness, not sorting patients by urgency|diagnosis 说出病名，不是按紧急程度给病人分类|prognosis judges how an illness will develop, not who is treated first|prognosis 判断病情发展，不是决定谁先治|tri · age|the -age said ahzh, as in garage|结尾 -age 读作 ahzh，同 garage
    `,
  },
);

const body = batch(
  "words-of-the-body-and-brain",
  ["Words of the Body and Brain", "身体与大脑的词"],
  ["the body and the brain", "身体与大脑"],
  `
  neuron|a cell that carries messages through the brain and the nerves|神经元|The brain has billions of nerve cells, and each ___ carries messages.|Each ___ can connect to thousands of other nerve cells.|A ___ sends signals along its length with tiny bursts of electricity.|synapse,cortex|neurons
  cortex|the outer layer of the brain, where thinking happens|大脑皮层|The ___, the brain's wrinkled outer layer, helps us plan and reason.|Damage to the outer layer of the brain, the ___, can affect speech.|The visual ___ at the back of the brain processes what we see.|neuron,synapse|cortexes,cortices
  synapse|the tiny gap between two nerve cells, across which signals pass|突触|Signals jump across the ___, the tiny gap between two nerve cells.|When you learn, a new ___ forms where two nerve cells meet.|Each ___ is a tiny gap where one nerve cell passes a signal to the next.|neuron,tendon|synapses
  cardiac|having to do with the heart|心脏的|He was taken to hospital after ___ arrest, when his heart stopped.|The ___ ward for heart patients is on the third floor.|Regular exercise improves ___ health and keeps the heart strong.|respiratory,cerebral
  respiratory|having to do with breathing|呼吸的|Smoking causes ___ disease that damages the lungs.|Colds are a common ___ infection of the nose and throat.|The ___ system, which includes the lungs, lets us breathe.|cardiac,skeletal
  skeletal|having to do with the bones of the body; or very thin|骨骼的；骨瘦如柴的|The ___ system of bones supports the body.|The ___ remains of a dinosaur, nothing but bones, were found in the cliff.|After the long illness he was so thin that he looked almost ___.|respiratory,cerebral
  cerebral|having to do with the brain; or using the mind rather than feelings|大脑的；理性的|The blow to his head caused a ___ injury that affected his memory.|Chess is a very ___ game, played with the mind more than the body.|Her ___ films, full of ideas, are admired more than loved.|cardiac,skeletal
  vertebra|one of the small bones that form the backbone|脊椎骨|He cracked a ___ in his back in the fall.|Each ___ of the backbone protects part of the spinal cord.|A small bone in the backbone, a ___, can slip out of place.|cartilage,tendon|vertebrae
  cartilage|the strong, flexible tissue found in joints and in the nose and ears|软骨|The ___ in her knee, the soft cushion between the bones, was damaged.|Your ears are shaped by flexible ___, not bone.|Sharks have skeletons made of bendable ___, not bone.|tendon,vertebra
  tendon|a strong band of tissue that joins a muscle to a bone|肌腱|The runner tore the ___ joining her calf muscle to her heel bone.|The Achilles ___ is the strongest band of tissue in the body.|A strained ___ between the shoulder muscle and the bone can take weeks to heal.|cartilage,synapse|tendons
  `,
  "context-clues",
  {
    intro: t(
      "Every thought starts when a **neuron** in the **cortex** fires and its signal jumps across a **synapse**; meanwhile your **cardiac** muscle keeps beating and your **respiratory** system keeps breathing. These ten words help you name the parts of the body and brain.",
      "每一个念头，都始于大脑皮层（**cortex**）中的一个神经元（**neuron**）放电，信号跃过突触（**synapse**）；与此同时，你的心脏（**cardiac**）肌肉不停跳动，呼吸（**respiratory**）系统持续工作。这十个词帮你说出身体与大脑各部分的名称。",
    ),
    watchOut: {
      meanings: t(
        "A **neuron** is the nerve *cell*; a **synapse** is the *gap* between two of them; the **cortex** is the brain's outer *layer* made of many of them.",
        "**neuron** 是神经细胞；**synapse** 是两个神经元之间的间隙；**cortex** 是由大量神经元构成的大脑外层。",
      ),
      use: t(
        "Match each adjective to its body part: **cardiac** for the *heart*, **respiratory** for *breathing*, **skeletal** for the *bones*, **cerebral** for the *brain*.",
        "把形容词和身体部位对上：**cardiac** 对心脏，**respiratory** 对呼吸，**skeletal** 对骨骼，**cerebral** 对大脑。",
      ),
      spelling: t(
        "Watch the *eu* of **neuron**, the *-apse* of **synapse**, the *-lage* (not *-ledge*) of **cartilage**, and the *-a* of **vertebra**, whose plural is **vertebrae**.",
        "注意 **neuron** 中的 eu、**synapse** 结尾的 -apse、**cartilage** 结尾的 -lage（不是 -ledge），以及 **vertebra** 以 -a 结尾，复数是 vertebrae。",
      ),
    },
    notes: `
      neuron|one of the brain's billions of nerve cells carrying messages|a nerve cell connecting to thousands of others|a cell sending signals with bursts of electricity|a neuron is a nerve cell; a synapse is the gap between two|neuron 是神经细胞；synapse 是两个神经元间的间隙|synapse is the gap between two nerve cells, not a cell itself|synapse 是两个神经细胞之间的间隙，不是细胞本身|cortex is the outer layer of the brain, not one cell|cortex 是大脑的外层，不是单个细胞|neu · ron|the eu said yoo and the -on ending|eu 读作 yoo，结尾是 -on
      cortex|the brain's wrinkled outer layer used to plan and reason|the outer layer of the brain where damage can affect speech|the part at the back of the brain that handles sight|the cortex is the brain's outer layer; a neuron is one cell in it|cortex 是大脑外层；neuron 是其中的一个细胞|neuron is a single nerve cell, not the brain's outer layer|neuron 是单个神经细胞，不是大脑的外层|synapse is a tiny gap between nerve cells, not a layer of the brain|synapse 是神经细胞间的微小间隙，不是大脑的一层|cor · tex|the -tex ending with an x|结尾是带 x 的 -tex
      synapse|signals jumping the tiny gap between two nerve cells|a new link forming between nerve cells as you learn|a gap where one nerve cell passes a signal to the next|a synapse is the gap between nerve cells; a neuron is the cell itself|synapse 是神经细胞间的间隙；neuron 是细胞本身|neuron is the nerve cell itself, not the gap between two cells|neuron 是神经细胞本身，不是两个细胞间的间隙|tendon joins a muscle to a bone, not one nerve cell to another|tendon 连接肌肉和骨头，不是连接两个神经细胞|syn · apse|syn- with a y and the -apse ending|syn- 中是 y，结尾是 -apse
      cardiac|a man in hospital after his heart stopped|a ward for heart patients|exercise that keeps the heart strong|cardiac is about the heart; respiratory is about breathing|cardiac 与心脏有关；respiratory 与呼吸有关|respiratory has to do with breathing, not the heart|respiratory 与呼吸有关，不是心脏|cerebral has to do with the brain, not the heart|cerebral 与大脑有关，不是心脏|car · di · ac|the -iac ending, as in maniac|结尾是 -iac，同 maniac
      respiratory|smoking damaging the lungs|colds infecting the nose and throat|the lungs and the system that lets us breathe|respiratory is about breathing; cardiac is about the heart|respiratory 与呼吸有关；cardiac 与心脏有关|cardiac has to do with the heart, not breathing|cardiac 与心脏有关，不是呼吸|skeletal has to do with bones, not breathing|skeletal 与骨骼有关，不是呼吸|res · pi · ra · to · ry|the -ratory ending with an o|结尾是带 o 的 -ratory
      skeletal|the system of bones that supports the body|a dinosaur's remains that were nothing but bones|a man so thin after an illness that he looked like bones|skeletal is about bones or great thinness; cerebral is about the brain|skeletal 与骨骼有关或指骨瘦如柴；cerebral 与大脑有关|respiratory has to do with breathing, not bones or great thinness|respiratory 与呼吸有关，不是骨骼或骨瘦如柴|cerebral has to do with the brain or the mind, not bones|cerebral 与大脑或头脑有关，不是骨骼|skel · e · tal|skeleton changes -on to -al|skeleton 的 -on 变成 -al
      cerebral|a head injury that affected memory|chess played with the mind more than the body|films full of ideas, admired more than loved|cerebral is about the brain or the mind; cardiac is about the heart|cerebral 与大脑或头脑有关；cardiac 与心脏有关|cardiac has to do with the heart, not the brain or the mind|cardiac 与心脏有关，不是大脑或头脑|skeletal has to do with bones, not the brain or the mind|skeletal 与骨骼有关，不是大脑或头脑|cer · e · bral|the soft c and the -bral ending|c 读软音，结尾是 -bral
      vertebra|a bone in the back cracked in a fall|a bone of the backbone protecting the spinal cord|a small bone of the backbone slipping out of place|a vertebra is a small bone of the backbone; cartilage is flexible tissue|vertebra 是一节脊椎骨；cartilage 是柔韧的组织|cartilage is flexible tissue, not a small bone|cartilage 是柔韧的组织，不是小骨头|tendon is a band joining muscle to bone, not a bone of the backbone|tendon 是连接肌肉和骨头的带状组织，不是脊椎骨|ver · te · bra|the -a ending, with the plural vertebrae|结尾是 -a，复数是 vertebrae
      cartilage|the soft cushion between the bones of a knee|the flexible tissue that shapes your ears|the bendable material of a shark's skeleton|cartilage is flexible tissue; a tendon joins muscle to bone|cartilage 是柔韧的组织；tendon 连接肌肉和骨头|tendon is a band joining muscle to bone, not bendable tissue in joints, ears and nose|tendon 是连接肌肉和骨头的带状组织，不是关节、耳朵和鼻子里柔韧的组织|vertebra is a small bone of the backbone, not flexible tissue|vertebra 是一节脊椎骨，不是柔韧的组织|car · ti · lage|the -lage ending, not -ledge|结尾是 -lage，不是 -ledge
      tendon|the band joining a runner's calf muscle to her heel bone|the strongest band of tissue in the body|a strained band between a shoulder muscle and the bone|a tendon joins muscle to bone; cartilage is flexible tissue in joints|tendon 连接肌肉和骨头；cartilage 是关节里柔韧的组织|cartilage is flexible tissue in joints and ears, not a band joining muscle to bone|cartilage 是关节和耳朵里柔韧的组织，不是连接肌肉和骨头的带状组织|synapse is a gap between nerve cells, not a band of tissue|synapse 是神经细胞间的间隙，不是带状组织|ten · don|the -don ending with an o|结尾是带 o 的 -don
    `,
  },
);

const custom = batch(
  "words-of-tradition-and-custom",
  ["Words of Tradition and Custom", "传统与习俗的词"],
  ["traditions and customs", "传统与习俗"],
  `
  taboo|something that a culture forbids people to do or to talk about|禁忌|In some cultures, saying a dead person's name is the strongest ___ of all, something never done.|Money was the great ___ in her family; no one ever mentioned it.|The novel breaks every ___ of its time by writing about forbidden subjects.|etiquette,observance|taboos
  etiquette|the rules of polite behavior in a group or a setting|礼节，礼仪|Table ___, such as how to hold a fork, differs from country to country.|Arriving late breaks the rules of polite ___.|She studied the ___ of the royal court: whom to bow to and how.|taboo,observance
  pageant|a public show in which people in costume act out history or a story|露天表演，盛会|The town held a ___ in which actors in costume showed its founding.|Children dressed as kings and queens to act out history in the ___.|The New Year ___, a show of costumes and old stories, fills the streets with color.|procession,garland|pageants,pageantry
  procession|a line of people or vehicles moving slowly as part of a ceremony|行列，队伍|A wedding ___ wound slowly through the village.|The funeral ___ of cars and walkers stretched for a mile.|Lanterns lit the long line of the ___ as it moved through the night.|pageant,observance|processions
  elder|an older person who is respected and has authority in a group|长者，长辈|The village ___, an old man respected by all, settled the quarrel.|Each respected ___ of the tribe had a seat on the council.|At the festival, the oldest ___ of the tribe told its story.|kinsfolk,matriarch|elders
  ceremonial|used in or having to do with a formal ceremony|礼仪的，仪式的|The chief's ___ headdress, made new each year, was worn only for formal rites.|The ___ sword is carried in parades but never used in battle.|The mayor's role is mostly ___: cutting ribbons and opening events.|ancestral,archaic|ceremonially,ceremony,ceremonies
  observance|the keeping of a law, custom or religious practice; or a ceremony that marks a special day|遵守；仪式|The ___ of the holiday includes a day of fasting.|Strict ___ of the rules was expected of every monk.|The yearly ___ on this day honors those who died in the war.|etiquette,taboo|observances,observant
  dowry|money or goods that a bride's family gives to the groom when she marries, in some cultures|嫁妆|Her ___, given by her family when she married, included land and three horses.|The custom of the bride's family paying a ___ is fading in many places.|The play's plot turns on a missing ___ that the bride's father cannot pay.|garland,kinsfolk|dowries
  kinsfolk|a person's relatives|亲属，亲戚|All his ___, uncles, aunts and cousins, came to the wedding.|She returned home to live among her ___ in the village.|The old man had no ___ left in the town; all his relatives had moved away.|elder,guardian
  garland|a ring of flowers or leaves worn on the head or hung as a decoration|花环|Each guest was given a ___ of flowers to wear.|A ___ of leaves hung over the door for the festival.|The winner was crowned with a laurel ___.|pageant,dowry|garlands
  `,
  "context-clues",
  {
    intro: t(
      "On the festival day, the village **elder** led a slow **procession** to the temple, each girl wearing a **garland**, while children acted out old stories in a **pageant**. These ten words help you describe traditions and customs.",
      "节日那天，村中长者（**elder**）带领缓缓行进的队伍（**procession**）走向神庙，每个女孩都戴着花环（**garland**），孩子们则在露天表演（**pageant**）中演出古老的故事。这十个词帮你描述传统与习俗。",
    ),
    watchOut: {
      meanings: t(
        "A **taboo** is *forbidden*; **etiquette** is *polite* behavior; an **observance** is the *keeping* of a custom or the marking of a special day.",
        "**taboo** 是禁止的事；**etiquette** 是礼貌的规矩；**observance** 是遵守习俗或纪念特殊日子。",
      ),
      use: t(
        "A **procession** *moves* slowly in a line; a **pageant** is a *show* that acts out a story; a **garland** is a *ring of flowers* someone wears.",
        "**procession** 是缓缓行进的队列；**pageant** 是演出故事的表演；**garland** 是戴在身上的花环。",
      ),
      spelling: t(
        "Watch the *-quette* of **etiquette**, the silent *e* of **pageant**, the silent *l* of **kinsfolk**, and the double *o* at the end of **taboo**.",
        "注意 **etiquette** 的 -quette、**pageant** 中不发音的 e、**kinsfolk** 中不发音的 l，以及 **taboo** 结尾的双写 o。",
      ),
    },
    notes: `
      taboo|a dead person's name that must never be said|money never mentioned in a family|forbidden subjects a novel wrote about|a taboo is forbidden; etiquette is polite behavior|taboo 是禁忌；etiquette 是礼貌规矩|etiquette is the rules of polite behavior, not something forbidden|etiquette 是礼貌的规矩，不是禁止的事|observance is the keeping of a custom, not a forbidden act|observance 是遵守习俗，不是被禁止的行为|ta · boo|the double o at the end|结尾双写 o
      etiquette|how to hold a fork in different countries|the polite rule of not arriving late|whom to bow to at a royal court, and how|etiquette is polite behavior; a taboo is forbidden|etiquette 是礼貌规矩；taboo 是禁忌|taboo is something forbidden, not the rules of polite behavior|taboo 是禁止做的事，不是礼貌的规矩|observance is keeping a law or marking a day, not rules of manners|observance 是遵守法律或纪念日子，不是礼貌规矩|et · i · quette|the -quette ending with qu and a double t|结尾是 -quette，有 qu 和双写 t
      pageant|actors in costume showing a town's founding|children dressed as kings and queens acting out history|a New Year show of costumes and old stories|a pageant is a show that acts out a story; a procession is a slow moving line|pageant 是演出故事的表演；procession 是缓缓行进的队列|procession is a slow line of people moving in a ceremony, not a show that acts out a story|procession 是仪式中缓缓行进的队列，不是演出故事的表演|garland is a ring of flowers, not a show|garland 是花环，不是表演|pag · eant|the -geant with a silent e|-geant 中的 e 不发音
      procession|a wedding party winding slowly through a village|a mile-long funeral line of cars and walkers|a line of people lit by lanterns through the night|a procession moves in a line; a pageant acts out a story|procession 是行进的队列；pageant 是演出故事|pageant is a show acting out history or a story, not a line moving slowly|pageant 是演出历史或故事的表演，不是缓缓行进的队列|observance is keeping a custom or marking a day, not a moving line of people|observance 是遵守习俗或纪念日子，不是行进的人群|pro · ces · sion|the -cess- and the -sion ending|中间是 -cess-，结尾是 -sion
      elder|an old man respected by all who settled a quarrel|respected old members with seats on a tribe's council|the oldest respected member telling a tribe's story|an elder is a respected older member of a group; kinsfolk are all your relatives|elder 是群体中受尊敬的长者；kinsfolk 是全部亲属|kinsfolk are your relatives, not an old person respected for authority|kinsfolk 是你的亲戚，不是因有威望而受尊敬的长者|matriarch is a woman at the head of a family, not any old person respected in a group|matriarch 是一家之长的女性，不是群体中任何受尊敬的长者|el · der|the -er ending|结尾是 -er
      ceremonial|a headdress made new each year for formal rites|a sword carried in parades but never used in battle|a mayor's role of cutting ribbons and opening events|ceremonial is for formal ceremonies; ancestral is from your ancestors|ceremonial 用于正式仪式；ancestral 来自祖先|ancestral means belonging to your ancestors, not used in a ceremony|ancestral 指属于祖先的，不是用于仪式的|archaic means very old or no longer used, not for a formal ceremony|archaic 指非常古老或已不再使用，不是用于正式仪式|cer · e · mo · ni · al|ceremony changes y to i, then -al|ceremony 的 y 变成 i，再加 -al
      observance|a holiday kept with a day of fasting|monks keeping the rules strictly|a yearly ceremony honoring those who died in a war|an observance is the keeping of a custom or day; etiquette is polite behavior|observance 是遵守习俗或纪念日；etiquette 是礼貌规矩|etiquette is the rules of polite behavior, not the keeping of a law or a special day|etiquette 是礼貌的规矩，不是遵守法律或纪念特殊日子|taboo is something forbidden, not the keeping of a custom|taboo 是禁止的事，不是遵守习俗|ob · ser · vance|observe drops its e, then -ance|observe 去掉 e 再加 -ance
      dowry|land and horses a bride's family gave when she married|a custom of the bride's family paying at a wedding|a payment a bride's father cannot make in a play|a dowry is money or goods given at a marriage; a garland is a ring of flowers|dowry 是结婚时给的财物；garland 是花环|garland is a ring of flowers, not money or goods given at a marriage|garland 是花环，不是结婚时给的钱财|kinsfolk are relatives, not money given at a marriage|kinsfolk 是亲属，不是结婚时给的钱财|dow · ry|the ow as in cow and the -ry ending|ow 同 cow，结尾是 -ry
      kinsfolk|uncles, aunts and cousins at a wedding|relatives in a home village|relatives who had all moved away from a town|kinsfolk are all your relatives; an elder is one respected old person|kinsfolk 是全部亲属；elder 是一位受尊敬的长者|elder is one older person respected in a group, not all your relatives|elder 是群体中一位受尊敬的长者，不是你的全部亲属|guardian is one person responsible for a child, not your relatives|guardian 是负责照看孩子的人，不是你的亲属|kins · folk|the silent l in folk|folk 中的 l 不发音
      garland|flowers given to each guest to wear|leaves hung over a door for a festival|laurel leaves crowning a winner|a garland is a ring of flowers or leaves; a pageant is a show|garland 是花环；pageant 是表演|pageant is a show, not a ring of flowers|pageant 是表演，不是花环|dowry is money or goods given at a marriage, not flowers|dowry 是结婚时给的财物，不是花|gar · land|gar plus land|gar 加 land
    `,
  },
);

const wisdom = batch(
  "words-of-folk-wisdom",
  ["Words of Folk Wisdom", "民间智慧的词"],
  ["sayings and folk wisdom", "俗语与民间智慧"],
  `
  proverb|a short, well-known saying that gives advice or states a truth|谚语|Her grandmother's favorite ___, the short saying "look before you leap," warned against haste.|The old ___ "many hands make light work" is only five words long.|She ended her letter with a well-known ___, one short line of advice: "waste not, want not."|parable,folklore|proverbs,proverbial
  maxim|a short statement of a general rule or principle|格言，准则|His personal ___ was a single rule: "never borrow money."|She lived by one simple ___, a rule she wrote on her mirror: work hard and be kind.|The company's guiding ___, a one-line rule printed on every wall, is "the customer comes first."|parable,sage|maxims
  adage|an old saying that is widely believed to be true|古训，谚语|As the old ___ goes, "time is money," a saying people have repeated for centuries.|The ___ "practice makes perfect," a saying almost everyone believes, proved true for her.|She remembered the old ___, a four-word saying: "don't count your chickens."|parable,folklore|adages
  parable|a short, simple story that teaches a moral or a spiritual lesson|寓言，比喻|The teacher told a short ___, a simple story about two builders, one on rock and one on sand, to teach a lesson about planning.|In the ___ of the lost sheep, a single short story teaches that every person matters.|His speech ended with a simple ___: the story of a farmer whose patience is rewarded, told to teach a moral.|folklore,adage|parables
  folklore|the traditional stories, beliefs and customs of a people, passed down by word of mouth|民间传说|In local ___, the body of old stories and beliefs passed down by word of mouth, the lake is home to a dragon.|She collects the ___ of mountain villages: the tales, beliefs and customs that grandparents pass to children.|Many fairy tales come from European ___, the traditional stories and beliefs of country people.|parable,proverb|folklorist
  sage|a very wise person, often an old one|智者，圣人|People traveled for miles to ask the ___, a hermit famous for his deep wisdom, for advice.|The young monk wandered the world looking for the one ___ wise enough to answer his questions about life.|In the story, the ___, a wise woman from a faraway land with no family or tribe, guides the young king.|wit,elder|sages
  shrewd|clever at understanding situations and making good judgments, especially for your own advantage|精明的|The ___ merchant, quick to spot a bargain and sharp at judging buyers, never lost a deal.|Selling just before prices fell was a ___ move, clever and to her own advantage.|With one ___ look, she sized up the stranger and saw through his clever lie.|prudent,naive|shrewdly,shrewdness
  prudent|careful and sensible, thinking of what may happen in the future|谨慎的，审慎的|It is ___ to save some money each month, in case of trouble ahead.|In the desert, the careful, ___ traveler always carries extra water in case of trouble.|The ___ choice, careful and thinking ahead, was to wait for the storm to pass.|shrewd,flippant|prudently,prudence
  aphorism|a short, clever saying that expresses a general truth|格言，警句|"Less is more" is a famous ___, a clever three-word saying about design.|The essay opens with a clever ___, one short line stating a general truth: "habit makes the person."|Printed on a poster, the ___ "knowledge is power" fit on a single line.|parable,wit|aphorisms
  wit|the ability to say clever and amusing things; or a person known for this|机智，风趣；机智的人|Her quick ___, her talent for funny remarks, made everyone laugh.|He was a famous ___, known for clever jokes that made readers laugh out loud.|The play is full of ___ and charm, with clever, amusing lines in every scene.|sage,aphorism|wits,witty
  `,
  "context-clues",
  {
    intro: t(
      "Grandmother had a **proverb** for everything, the village **sage** told a **parable** instead of giving orders, and her uncle's quick **wit** turned every **maxim** into a joke. These ten words help you talk about sayings and the people known for their wisdom.",
      "奶奶凡事都有一句谚语（**proverb**），村里的智者（**sage**）不下命令而是讲一则寓言（**parable**），叔叔的机智（**wit**）则能把每条格言（**maxim**）都变成笑话。这十个词帮你谈论俗语和以智慧著称的人。",
    ),
    watchOut: {
      meanings: t(
        "A **proverb**, an **adage**, a **maxim** and an **aphorism** are all *short sayings*; a **parable** is a *story*, and **folklore** is a people's *whole body* of stories and beliefs.",
        "**proverb**、**adage**、**maxim** 和 **aphorism** 都是简短的话；**parable** 是一个故事；**folklore** 是一个民族全部的故事与信仰。",
      ),
      use: t(
        "A **sage** is wise, a **wit** is funny; a **shrewd** person judges cleverly for gain, a **prudent** person acts carefully for the future.",
        "**sage** 有智慧，**wit** 很风趣；**shrewd** 的人精明、为己谋利，**prudent** 的人谨慎、为将来打算。",
      ),
      spelling: t(
        "Watch the *-age* of **adage**, the *-xim* of **maxim**, the *ph* of **aphorism**, the *-ew-* of **shrewd** and the *-dent* of **prudent**.",
        "注意 **adage** 的 -age、**maxim** 的 -xim、**aphorism** 中的 ph、**shrewd** 中的 -ew-，以及 **prudent** 的 -dent。",
      ),
    },
    notes: `
      proverb|the short saying "look before you leap"|a five-word saying about many hands|one short line of advice ending a letter|a proverb is a short saying; a parable is a short story|proverb 是一句简短的话；parable 是一个短故事|parable is a story that teaches a lesson, not a short saying|parable 是讲道理的故事，不是一句简短的话|folklore is a people's whole body of stories and beliefs, not one short saying|folklore 是一个民族全部的故事与信仰，不是一句简短的话|prov · erb|pro- plus verb|pro- 加 verb
      maxim|a single rule about never borrowing money|a rule written on a mirror|a one-line rule printed on every wall|a maxim is a rule to live by; a sage is a wise person|maxim 是处世准则；sage 是智者|parable is a story, not a one-line rule|parable 是一个故事，不是一句准则|sage is a wise person, not a rule|sage 是智者，不是准则|max · im|the x and the -im ending|中间是 x，结尾是 -im
      adage|"time is money," repeated for centuries|a saying almost everyone believes about practice|a four-word saying about counting chickens|an adage is an old saying; folklore is a whole body of traditions|adage 是古老的俗语；folklore 是全部传统|parable is a story, not an old saying|parable 是一个故事，不是一句古老的俗语|folklore is a whole body of stories and beliefs, not a single saying|folklore 是全部故事与信仰，不是一句俗语|ad · age|ad- plus -age|ad- 加 -age
      parable|a story of two builders, one on rock and one on sand|a single story of a lost sheep|a story of a patient farmer told to teach a moral|a parable is one story with a lesson; an adage is a short saying|parable 是一个讲道理的故事；adage 是一句俗语|folklore is a people's whole body of tradition, not one story told to teach a lesson|folklore 是一个民族的全部传统，不是一个讲道理的故事|adage is a short old saying, not a story|adage 是一句古老的俗语，不是故事|par · a · ble|the -able ending, as in table|结尾是 -able，同 table
      folklore|old stories and beliefs about a lake's dragon|tales, beliefs and customs grandparents pass on|the traditional stories of European country people|folklore is a whole body of tradition; a parable is one story|folklore 是全部传统；parable 是一个故事|parable is one story with a moral, not a people's whole body of tradition|parable 是一个讲道理的故事，不是一个民族的全部传统|proverb is one short saying, not stories, beliefs and customs|proverb 是一句简短的话，不是故事、信仰和习俗|folk · lore|folk plus lore, with a silent l in folk|folk 加 lore，folk 中的 l 不发音
      sage|a hermit famous for his deep wisdom|someone wise enough to answer questions about life|a wise woman from a faraway land guiding a king|a sage is deeply wise; a wit is cleverly funny|sage 极有智慧；wit 风趣机智|wit is a person known for funny remarks, not for deep wisdom|wit 是以风趣话语著称的人，不是以深刻智慧著称|elder is an older person respected within a group, not a wise stranger from outside|elder 是群体内受尊敬的长者，不是外来的智者|sage|the soft g, as in page|g 读软音，同 page
      shrewd|a merchant quick to spot a bargain|selling just before prices fell|a look that saw through a lie|shrewd is clever for your own gain; prudent is careful about the future|shrewd 精明、为己谋利；prudent 谨慎、为将来打算|prudent means careful about the future, not quick and clever for your own gain|prudent 指为将来小心打算，不是为己谋利的精明|naive means trusting and lacking experience, not sharp at judging people|naive 指天真、缺乏经验，不是善于识人|shrewd|the -ew- as in crew|中间是 -ew-，同 crew
      prudent|saving money in case of trouble ahead|carrying extra water in the desert|waiting for a storm to pass|prudent is careful about the future; shrewd is clever for your own gain|prudent 谨慎、为将来打算；shrewd 精明、为己谋利|shrewd means clever at winning an advantage, not careful about what may go wrong|shrewd 指善于谋利，不是小心防范可能的问题|flippant means not serious enough, not careful and sensible|flippant 指轻率不认真，不是谨慎明智|pru · dent|the -dent ending|结尾是 -dent
      aphorism|"less is more," a clever saying about design|one short line stating a general truth about habit|"knowledge is power" on a poster|an aphorism is a clever saying; wit is the talent for clever remarks|aphorism 是警句；wit 是说俏皮话的才能|parable is a story, not a short clever saying|parable 是一个故事，不是简短的警句|wit is a talent or a person, not a saying itself|wit 是一种才能或一个人，不是一句话本身|aph · o · rism|the ph said f and the -ism ending|ph 读作 f，结尾是 -ism
      wit|a talent for funny remarks that made everyone laugh|a man known for clever jokes|clever, amusing lines in every scene|wit is cleverness that amuses; a sage is wise|wit 是逗人的机智；sage 是有智慧的人|sage is someone deeply wise, not someone known for funny remarks|sage 是极有智慧的人，不是以俏皮话著称的人|aphorism is one clever saying, not a talent for being funny|aphorism 是一句警句，不是风趣的才能|wit|a short word that doubles its t in witty|短词，变 witty 时双写 t
    `,
  },
);

const art = batch(
  "words-of-art-and-criticism",
  ["Words of Art and Criticism", "艺术与评论的词"],
  ["art and the judging of art", "艺术与艺术评论"],
  `
  aesthetic|having to do with beauty and art; or a particular set of ideas about what is beautiful|美学的；审美观|The building has great ___ appeal: everyone agrees it is beautiful, though it is neither new nor daring.|She chose the colors for ___ reasons, because they looked beautiful, not because they were new or clever.|The garden's value is mostly ___, about beauty rather than ideas or new experiments.|avant-garde,cerebral|aesthetics,aesthetically
  realism|a style of art or writing that shows things as they really are|现实主义|The novel is admired for its gritty ___, showing poor people's lives exactly as they are, with nothing exaggerated.|Painters of ___ showed workers in the fields in exact, careful detail, not with quick brushstrokes or funny exaggeration.|The film's ___, which shows the war as it truly was without exaggeration, makes the fighting feel close.|impressionism,caricature|realist,realistic
  impressionism|a style of painting that shows the effect of light and color with quick brushstrokes|印象派|Born in France in the 1870s, ___ used quick brushstrokes to catch the passing effect of light.|The painting's soft, blurry colors and quick brushstrokes, showing light rather than exact detail, are typical of ___.|Critics first mocked ___, the style of quick brushstrokes and flickering light, but later loved it.|realism,caricature|impressionist,impressionists
  composition|the way the parts of a picture or a work are arranged; or a piece of music or writing|构图；作品|The ___ of the photograph, the way its parts are arranged, draws your eye to the child.|A good ___ arranges light and dark areas so that the picture feels balanced.|In this painting, the ___ places the tree on the left and the house on the right so the eye moves across.|pastiche,caricature|compositions
  connoisseur|a person who knows a lot about an art and can judge its quality|鉴赏家，行家|My uncle is a ___ of old maps: he cannot draw one, but he can judge any map's age and value at a glance.|Even the ___, an expert who could judge the quality of any painting, was fooled by the fake.|As a ___ of fine wine, she judges each bottle's quality by taste, though she has never made any.|virtuoso,sage|connoisseurs
  avant-garde|new and experimental, ahead of its time in art or ideas|前卫的，先锋派的|The ___ play, so new and experimental that it had no plot at all, puzzled the audience.|Her music was too ___ for the audience: strange, experimental and decades ahead of its time.|The gallery shows only ___ art, new and experimental work that breaks the old rules.|aesthetic,archaic
  kitsch|art or objects that are cheap, showy and in poor taste, sometimes enjoyed as a joke|俗气的艺术品|The shop was full of ___: plastic flamingos, glowing saints and other cheap, showy objects in poor taste.|Some people collect ___, cheap and tasteless ornaments, for fun.|Her house is filled with ___, gaudy souvenirs in poor taste that she loves as a joke.|parody,pastiche|kitschy
  parody|a piece of writing, music or art that copies another in a funny way|戏仿，模仿作品|The comedy is a ___ of spy films, copying their style to make fun of them.|She wrote a funny ___ of a famous poem, copying its rhymes to mock it.|The show's ___ of the old soap opera copied its dramatic music to make everyone laugh.|pastiche,caricature|parodies,parodied
  pastiche|a work that imitates the style of another work, artist or period|模仿作品，混成作品|The novel is a loving ___ of Victorian mysteries, imitating their style with respect, not to mock them.|The building is a ___ of several older styles, borrowing from each without making fun of any.|His song is a clever ___ of 1960s pop, copying the sound of that period in admiration rather than mockery.|parody,composition|pastiches
  caricature|a drawing or a description that exaggerates someone's features for a funny effect|漫画，讽刺画|The artist drew a ___ of the president with huge ears and a tiny body.|The villain is a ___, his features so exaggerated that he seems a cartoon rather than a real person.|At the fair, a street artist drew each tourist's ___, making noses and smiles comically huge.|parody,realism|caricatures
  `,
  "context-clues",
  {
    intro: t(
      "The critic called the painting **kitsch**, the artist called it **avant-garde**, and a **connoisseur** in the crowd said it was really a **pastiche** of **impressionism**. These ten words help you describe and judge works of art.",
      "评论家说这幅画是俗气之作（**kitsch**），画家说它是前卫的（**avant-garde**），人群中一位鉴赏家（**connoisseur**）却说它其实是对印象派（**impressionism**）的模仿（**pastiche**）。这十个词帮你描述和评判艺术作品。",
    ),
    watchOut: {
      meanings: t(
        "Three kinds of copying: a **parody** copies to *mock*, a **pastiche** copies a style with *respect*, and a **caricature** *exaggerates* a person's features.",
        "三种模仿：**parody** 模仿是为了嘲弄，**pastiche** 是怀着敬意模仿风格，**caricature** 是夸大一个人的特征。",
      ),
      use: t(
        "**Realism** shows things *exactly as they are*; **impressionism** catches *light* with quick brushstrokes; **avant-garde** work is *new and experimental*.",
        "**realism** 如实呈现事物；**impressionism** 用快速笔触捕捉光线；**avant-garde** 的作品新颖而实验性强。",
      ),
      spelling: t(
        "Watch the *ae* at the start of **aesthetic**, the double *n* and double *s* of **connoisseur**, the hyphen in **avant-garde** and the *-tsch* of **kitsch**.",
        "注意 **aesthetic** 开头的 ae、**connoisseur** 中的双写 n 和双写 s、**avant-garde** 中间的连字符，以及 **kitsch** 中的 -tsch。",
      ),
    },
    notes: `
      aesthetic|a building everyone agrees is beautiful|colors chosen because they looked beautiful|a garden valued for its beauty rather than ideas|aesthetic is about beauty; avant-garde is about being new and daring|aesthetic 关乎美；avant-garde 关乎新颖大胆|avant-garde means new and experimental, not simply beautiful|avant-garde 指新颖、实验性强，不只是美|cerebral means using the mind and ideas, not about beauty|cerebral 指重思想、重理性，与美无关|aes · thet · ic|the ae at the start and the -thet- in the middle|开头是 ae，中间是 -thet-
      realism|poor people's lives shown exactly as they are|workers painted in exact, careful detail|a war shown as it truly was|realism shows things exactly as they are; caricature exaggerates|realism 如实呈现；caricature 夸张|impressionism catches light with quick brushstrokes, not exact detail of real life|impressionism 用快速笔触捕捉光线，不是如实刻画细节|caricature exaggerates features for fun, not showing things exactly as they are|caricature 为逗趣而夸大特征，不是如实呈现|re · al · ism|real plus -ism|real 加 -ism
      impressionism|a French style of the 1870s that caught the effect of light|soft, blurry colors showing light rather than detail|a style of quick brushstrokes once mocked by critics|impressionism catches light quickly; realism shows exact detail|impressionism 迅速捕捉光线；realism 刻画精确细节|realism shows things in exact detail, not as quick brushstrokes of light|realism 精确刻画细节，不是用快速笔触表现光线|caricature exaggerates a person's features, not a painting style of light|caricature 夸大人的特征，不是表现光线的画风|im · pres · sion · ism|impression plus -ism|impression 加 -ism
      composition|the way the parts of a photograph are arranged|light and dark areas arranged to feel balanced|a tree on the left and a house on the right|composition is how parts are arranged; a pastiche imitates a style|composition 是各部分的安排；pastiche 是模仿风格|pastiche is a work imitating another style, not the arrangement of parts|pastiche 是模仿他人风格的作品，不是各部分的安排|caricature is an exaggerated drawing of a person, not the arrangement of a picture|caricature 是夸张的人物画，不是画面的布局|com · po · si · tion|compose drops its e, then -ition|compose 去掉 e 再加 -ition
      connoisseur|an uncle who judges old maps but cannot draw one|an expert who judges paintings and was fooled by a fake|a woman who judges wine by taste|a connoisseur judges an art; a virtuoso performs it|connoisseur 评鉴艺术；virtuoso 表演艺术|virtuoso is someone who performs with great skill, not someone who judges quality|virtuoso 是技艺高超的表演者，不是评鉴品质的人|sage is wise about life in general, not an expert judge of one art|sage 对人生普遍有智慧，不是某门艺术的鉴赏行家|con · nois · seur|the double n, the -ois- and the -seur ending|双写 n，中间 -ois-，结尾 -seur
      avant-garde|a play with no plot at all|music decades ahead of its time|new work that breaks the old rules|avant-garde is new and experimental; archaic is very old|avant-garde 新颖前卫；archaic 非常古老|aesthetic has to do with beauty, not with being new and experimental|aesthetic 与美有关，不是新颖、实验性强|archaic means very old or no longer used, not ahead of its time|archaic 指非常古老或已不再使用，不是超前|a · vant - garde|the hyphen between avant and garde|avant 和 garde 之间有连字符
      kitsch|plastic flamingos and glowing saints|cheap, tasteless ornaments collected for fun|gaudy souvenirs in poor taste|kitsch is cheap and tasteless; a parody copies a work to mock it|kitsch 廉价俗气；parody 模仿作品以嘲弄|parody is a funny copy of a particular work, not cheap, showy objects|parody 是对某部作品的滑稽模仿，不是廉价花哨的物件|pastiche is a respectful imitation of a style, not tasteless junk|pastiche 是对风格的敬意模仿，不是俗气的东西|kitsch|the -tsch ending|结尾是 -tsch
      parody|a comedy copying spy films to make fun of them|a funny copy of a famous poem|a copy of a soap opera's music that made everyone laugh|a parody copies to mock; a pastiche copies with respect|parody 模仿以嘲弄；pastiche 怀着敬意模仿|pastiche imitates a style with respect, not to make fun of it|pastiche 怀着敬意模仿风格，不是为了嘲弄|caricature exaggerates a person's features, not copying a work|caricature 夸大人的特征，不是模仿作品|par · o · dy|the -ody ending, as in melody|结尾是 -ody，同 melody
      pastiche|a loving imitation of Victorian mysteries|a building borrowing from several older styles|a song copying the 1960s sound in admiration|a pastiche imitates with respect; a parody imitates to mock|pastiche 怀着敬意模仿；parody 模仿以嘲弄|parody copies a work to make fun of it, not with respect|parody 模仿作品是为了嘲弄，不是出于敬意|composition is how the parts of a work are arranged, not an imitation of another style|composition 是作品各部分的安排，不是模仿他人风格|pas · tiche|the -iche ending, said eesh|结尾 -iche 读作 eesh
      caricature|a president drawn with huge ears|a villain so exaggerated he seems a cartoon|tourists drawn with comically huge noses|a caricature exaggerates a person; realism shows things as they are|caricature 夸大人物；realism 如实呈现|parody copies a work such as a film or poem, not a person's features|parody 模仿的是电影、诗歌等作品，不是人的相貌|realism shows things as they are, not exaggerated|realism 如实呈现，不是夸张|car · i · ca · ture|the -ca- and the -ture ending|中间是 -ca-，结尾是 -ture
    `,
  },
);

const music = batch(
  "words-of-music-and-performance",
  ["Words of Music and Performance", "音乐与演出的词"],
  ["music and performance", "音乐与演出"],
  `
  crescendo|a gradual increase in loudness in music; or the point of greatest intensity|渐强；高潮|The music grew louder and louder, rising to a thundering ___ at the end.|The ___ of applause, growing steadily louder, filled the hall.|The protests grew stronger each week and reached their ___, their most intense point, in May.|overture,aria|crescendos
  symphony|a long piece of music for an orchestra, usually in four parts|交响乐|The full orchestra played Beethoven's Ninth ___, a long work in four parts with no soloist.|The ___ for full orchestra, with no solo instrument, ended with a great crash of drums.|He wrote a four-part ___ for the whole orchestra, giving no part to a soloist.|sonata,concerto|symphonies,symphonic
  virtuoso|a person who is extremely skilled at playing music or at some other art|大师，演奏名家|The young ___ played the violin with a skill no one else could match.|She is a ___ of the guitar, able to play the hardest pieces with ease.|Only a true ___, a player of extraordinary skill, could perform that fast passage.|repertoire,connoisseur|virtuosos,virtuosity
  aria|a song for one voice in an opera|咏叹调|The soprano stepped forward and sang the famous ___, a song for her voice alone.|The tenor's ___, a solo song in the second act, moved the audience to tears.|The opera's best solo song, the ___ in the third act, is sung by the queen alone.|libretto,overture|arias
  libretto|the words of an opera or a musical|歌剧剧本，歌词|The ___, all the words of the opera, was written by a poet.|You can follow the story by reading the ___, the printed text of everything the singers say.|The opera's ___, its words, is in Italian, with English translations shown above the stage.|aria,sonata|librettos,libretti
  overture|a piece of music played at the start of an opera or a ballet; or a first offer to begin talks|序曲；提议|The orchestra played the ___ before the curtain rose, opening the ballet.|The ___, the opening piece played before the first act, hints at the tunes to come.|The country's peace ___, a first offer to begin talks, was welcomed by its neighbor.|crescendo,libretto|overtures
  sonata|a piece of music for one instrument, or for one instrument with a piano|奏鸣曲|She played a Mozart ___ for piano alone at the recital, without any orchestra.|The ___ for cello and piano has three movements and no orchestra.|He composed a ___ for solo violin, a piece for one instrument rather than a full orchestra.|symphony,concerto|sonatas
  concerto|a piece of music for one or more solo instruments and an orchestra|协奏曲|The pianist played a ___ with the city orchestra, her solo part answered by all the other players.|In a ___, the soloist and the orchestra take turns.|She practiced the solo part of the violin ___ for months before playing it with the orchestra.|symphony,sonata|concertos
  improvise|to make something up on the spot without preparation|即兴创作，临时凑成|Jazz musicians often ___ their solos, making them up on the spot.|When the lights failed, the actors had to ___, inventing lines on the spot with no script.|With no tent, the campers had to ___ one from a sheet and a rope, making it up as they went.|abstain,synthesize|improvises,improvised,improvisation
  repertoire|all the pieces that a performer or a group knows and can perform|全部曲目，保留剧目|The singer's ___ includes every folk song and opera piece she knows and can perform.|The company added three new plays to its ___, the list of works it can perform.|His ___ of jokes, every one he knew by heart, seemed endless.|virtuoso,libretto|repertoires
  `,
  "context-clues",
  {
    intro: t(
      "The **overture** began softly, the soprano's **aria** rose to a great **crescendo**, and in the second half a young **virtuoso** played a violin **concerto** with the whole orchestra. These ten words help you talk about music and performance.",
      "序曲（**overture**）轻轻响起，女高音的咏叹调（**aria**）升至高潮（**crescendo**）；下半场，一位年轻的演奏名家（**virtuoso**）与整个乐团合奏了一首小提琴协奏曲（**concerto**）。这十个词帮你谈论音乐与演出。",
    ),
    watchOut: {
      meanings: t(
        "Count the players: a **sonata** is for *one instrument*, a **concerto** is a *soloist with an orchestra*, and a **symphony** is for the *whole orchestra*.",
        "数一数演奏者：**sonata** 是为一件乐器写的，**concerto** 是独奏者加乐团，**symphony** 是为整个乐团写的。",
      ),
      use: t(
        "In an opera, the **overture** is the *opening* music, an **aria** is one *solo song*, and the **libretto** is all the *words*.",
        "在歌剧里，**overture** 是开场音乐，**aria** 是一段独唱，**libretto** 是全部歌词与台词。",
      ),
      spelling: t(
        "Watch the *sc* of **crescendo**, the *-uoso* of **virtuoso**, the *-oire* of **repertoire**, and the *ph* and *y* of **symphony**.",
        "注意 **crescendo** 中的 sc、**virtuoso** 的 -uoso、**repertoire** 的 -oire，以及 **symphony** 中的 ph 和 y。",
      ),
    },
    notes: `
      crescendo|music rising to a thundering end|applause growing steadily louder|protests reaching their most intense point in May|a crescendo is a rise in loudness or intensity; an overture is an opening piece|crescendo 是渐强或高潮；overture 是开场曲|overture is the opening piece of an opera or ballet, not a rise in loudness|overture 是歌剧或芭蕾的开场曲，不是音量渐强|aria is a solo song, not a growing loudness or a peak|aria 是独唱曲，不是渐强或高潮|cre · scen · do|the sc said sh|sc 读作 sh
      symphony|Beethoven's Ninth in four parts with no soloist|a piece for full orchestra ending in drums|a four-part work for the whole orchestra|a symphony is for the whole orchestra; a concerto adds a soloist|symphony 为整个乐团而作；concerto 有独奏者|sonata is for one instrument, not the whole orchestra|sonata 为一件乐器而作，不是整个乐团|concerto features a soloist with the orchestra, not the orchestra alone|concerto 是独奏者与乐团合作，不是乐团单独演奏|sym · pho · ny|the y in sym- and the ph said f|sym- 中是 y，ph 读作 f
      virtuoso|a young violinist with unmatched skill|a guitarist playing the hardest pieces with ease|a player of extraordinary skill|a virtuoso performs with great skill; a connoisseur judges others' work|virtuoso 技艺高超地表演；connoisseur 评鉴他人作品|repertoire is the list of pieces someone can play, not the skilled player|repertoire 是能演奏的曲目，不是技艺高超的演奏者|connoisseur is an expert who judges an art, not someone who performs it|connoisseur 是评鉴艺术的行家，不是表演者|vir · tu · o · so|the -uo- and the -oso ending|中间是 -uo-，结尾是 -oso
      aria|a soprano's song for her voice alone|a tenor's solo song in the second act|the queen's solo song in the third act|an aria is one solo song; a libretto is all the words|aria 是一段独唱；libretto 是全部歌词|libretto is all the words of an opera, not one song for one voice|libretto 是歌剧的全部歌词，不是一段独唱|overture is the orchestra's opening piece, not a song for one voice|overture 是乐团的开场曲，不是独唱|a · ri · a|begins and ends with a|以 a 开头，以 a 结尾
      libretto|all the words of an opera, written by a poet|the printed text of everything the singers say|an opera's words in Italian with translations above the stage|a libretto is the words; an aria is one song|libretto 是歌词台词；aria 是一段唱段|aria is one solo song, not all the words of the opera|aria 是一段独唱，不是歌剧的全部歌词|sonata is a piece for an instrument, with no words at all|sonata 是器乐曲，根本没有歌词|li · bret · to|the double t|双写 t
      overture|the music played before the curtain rose|the opening piece that hints at tunes to come|a first offer to begin peace talks|an overture opens a work or talks; a crescendo is a rise in loudness|overture 是开场或初步提议；crescendo 是渐强|crescendo is a rise in loudness or a peak, not an opening piece or a first offer|crescendo 是渐强或高潮，不是开场曲或初步提议|libretto is the words of an opera, not music played first or an offer|libretto 是歌剧的歌词，不是先奏的音乐或提议|o · ver · ture|over plus -ture|over 加 -ture
      sonata|a Mozart piece for piano alone|a piece for cello and piano with no orchestra|a piece for one violin rather than a full orchestra|a sonata is for one instrument; a symphony is for the whole orchestra|sonata 为一件乐器；symphony 为整个乐团|symphony is for the whole orchestra, not one instrument|symphony 为整个乐团而作，不是一件乐器|concerto needs an orchestra behind the soloist, not one instrument alone|concerto 需要乐团伴奏独奏者，不是单件乐器|so · na · ta|the -ata ending|结尾是 -ata
      concerto|a pianist's solo answered by the orchestra|a soloist and orchestra taking turns|a violin solo part played with the orchestra|a concerto joins a soloist and an orchestra; a sonata has no orchestra|concerto 是独奏者加乐团；sonata 没有乐团|symphony is for the orchestra alone with no soloist|symphony 由乐团演奏，没有独奏者|sonata is for one instrument without an orchestra|sonata 为一件乐器而作，没有乐团|con · cer · to|the c said ch in -certo|-certo 中的 c 读作 ch
      improvise|jazz solos made up on the spot|actors inventing lines with no script|a tent made from a sheet and a rope|to improvise is to make up on the spot; to synthesize is to combine into a whole|improvise 是临场发挥；synthesize 是综合成整体|abstain means to choose not to do something, not to make something up on the spot|abstain 指选择不做某事，不是临场编出来|synthesize means to combine separate things carefully into a whole, not to invent without preparation|synthesize 指把分散的东西综合成整体，不是毫无准备地临场发挥|im · pro · vise|the -vise ending with an s|结尾是带 s 的 -vise
      repertoire|every song a singer knows and can perform|a company's list of plays it can perform|every joke a man knew by heart|a repertoire is everything someone can perform; a virtuoso is a skilled performer|repertoire 是能表演的全部节目；virtuoso 是技艺高超的表演者|virtuoso is the skilled performer, not the list of pieces they know|virtuoso 是技艺高超的表演者，不是他会的曲目|libretto is the words of one opera, not everything a performer can do|libretto 是一部歌剧的歌词，不是表演者会的全部节目|rep · er · toire|the -oire ending, said wahr|结尾 -oire 读作 wahr
    `,
  },
);

const film = batch(
  "words-of-film",
  ["Words of Film", "电影的词"],
  ["the making of films", "电影制作"],
  `
  cinematography|the art of filming a movie: lighting, camera angles and movement|电影摄影术|The film won an award for its ___: the lighting, camera angles and camera movement.|Through careful lighting and slow camera movement, the ___ makes the desert look endless.|Students study the lighting and camera angles, the ___, of old black-and-white films.|montage,storyboard|cinematographer
  montage|a series of short shots edited together to show time passing or to build a mood|蒙太奇，剪辑|Quick shots cut together into a ___ show the boxer's months of training passing in under a minute.|The film opens with a ___ of city life: dozens of short shots cut together to set the mood.|In a fast ___ of short clips edited together, years pass in a single minute.|sequence,cinematography|montages
  sequence|the order in which related events or things follow one another|顺序|Put the pictures in the right ___, from first to last, so the story makes sense.|The ___ of events, the order in which they happened, is hard to follow.|The numbers follow a ___ in which each is double the one before.|montage,sequel|sequences,sequential
  soundtrack|the music and sound recorded for a film|电影原声，配乐|The film's ___, the music and sound recorded for it, became more famous than the film itself.|She bought the album of the film's music, its ___, on the day it came out.|The eerie music of the ___ makes the scene frightening.|screenplay,premiere|soundtracks
  screenplay|the written script of a film, with dialogue and directions|电影剧本|She wrote the ___, every line of dialogue and every direction, in three months.|The ___, the written script of the film, was based on a novel.|He won an award for the best ___, praised for its sharp written dialogue.|storyboard,soundtrack|screenplays
  sequel|a film, book or game that continues the story of an earlier one|续集|The ___, which continues the story of the first film, was even better than the original.|Fans of the first book are waiting for the ___ to find out what happens next.|The novel's ___ continues the story ten years later.|premiere,sequence|sequels
  premiere|the first public showing of a film or a play|首映，首演|The stars walked the red carpet at the ___, the very first public showing of the film.|The play's opening night, its ___, was sold out.|The film's world ___, its first public showing anywhere, will be in Paris.|sequel,documentary|premieres,premiered
  documentary|a film or a program that presents facts about real people and events|纪录片|The ___ follows a real family of wolves through a year, with no actors or script.|She made a ___ about ocean pollution, filming real beaches and real scientists.|The ___ uses interviews with real survivors to tell the true story of the flood.|premiere,screenplay|documentaries
  subtitle|a line of words at the bottom of a screen that translates or records what is said|字幕|Each ___ at the bottom of the screen translates one line of the Korean dialogue into English.|The ___ under the speaker's face flashed by too fast to read.|One ___ on the screen spelled the actor's line wrong.|soundtrack,storyboard|subtitles,subtitled
  storyboard|a series of drawings that show the planned shots of a film|故事板，分镜头脚本|The director sketched a ___, a series of drawings of every planned shot, before filming.|The ___, drawn panel by panel, showed where each camera would go.|Artists drew the ___ in pencil, like a comic strip of the planned shots, before filming began.|screenplay,cinematography|storyboards
  `,
  "context-clues",
  {
    intro: t(
      "Before filming, the writer finished the **screenplay** and an artist drew the **storyboard**; months later, at the **premiere**, the audience cheered the **cinematography** and hummed the **soundtrack** all the way home. These ten words help you talk about how films are made.",
      "开拍前，编剧写完了剧本（**screenplay**），画师画好了故事板（**storyboard**）；几个月后的首映（**premiere**）上，观众为摄影（**cinematography**）喝彩，回家路上还哼着电影配乐（**soundtrack**）。这十个词帮你谈论电影是怎样拍成的。",
    ),
    watchOut: {
      meanings: t(
        "Before filming: the **screenplay** is the *words*, the **storyboard** is the *drawings*. After: the **soundtrack** is the *music*, the **subtitle** is the *text* on screen.",
        "拍摄前：**screenplay** 是文字剧本，**storyboard** 是画出来的分镜。拍摄后：**soundtrack** 是配乐，**subtitle** 是屏幕上的字幕。",
      ),
      use: t(
        "A **sequel** *continues* a story; a **premiere** is a film's *first showing*; a **sequence** is an *order*; a **montage** is short shots *cut together*.",
        "**sequel** 是故事的续集；**premiere** 是电影的首映；**sequence** 是顺序；**montage** 是剪在一起的短镜头。",
      ),
      spelling: t(
        "Watch the *cine-* and *-graphy* of **cinematography**, the *-qu-* of **sequel** and **sequence**, and the *-iere* of **premiere**.",
        "注意 **cinematography** 的 cine- 和 -graphy、**sequel** 和 **sequence** 中的 -qu-，以及 **premiere** 的 -iere。",
      ),
    },
    notes: `
      cinematography|an award for lighting, camera angles and movement|careful lighting and slow camera movement in a desert|the lighting and camera angles of old films|cinematography is how the film is shot; a storyboard is drawings planned beforehand|cinematography 是拍摄手法；storyboard 是事先画好的分镜|montage is short shots edited together, not the lighting and camera work|montage 是剪辑在一起的短镜头，不是灯光和摄影机运用|storyboard is drawings made before filming, not the filming itself|storyboard 是拍摄前画的图，不是拍摄本身|cin · e · ma · tog · ra · phy|cinema plus -tography|cinema 加 -tography
      montage|a boxer's months of training passing in a minute|dozens of short shots of city life cut together|short clips edited so years pass in a minute|a montage is short shots cut together; cinematography is how shots are filmed|montage 是剪在一起的短镜头；cinematography 是镜头怎样拍|sequence is the order in which things follow, not short shots cut together to show time passing|sequence 是先后顺序，不是为表现时间流逝而剪在一起的短镜头|cinematography is lighting and camera work, not editing short shots together|cinematography 是灯光和摄影机运用，不是把短镜头剪在一起|mon · tage|the -tage ending, said tahzh|结尾 -tage 读作 tahzh
      sequence|pictures put in order from first to last|the order in which events happened|numbers each double the one before|a sequence is an order; a sequel is a later work|sequence 是顺序；sequel 是续作|montage is short film shots edited together, not an order of events or numbers|montage 是剪辑在一起的电影短镜头，不是事件或数字的顺序|sequel is a later work continuing a story, not an order|sequel 是延续故事的后续作品，不是顺序|se · quence|the -qu- and the -ence ending|中间是 -qu-，结尾是 -ence
      soundtrack|the music and sound recorded for a film|an album of a film's music|eerie music that frightens|a soundtrack is the music; a screenplay is the written script|soundtrack 是配乐；screenplay 是文字剧本|screenplay is the written script, not the music|screenplay 是文字剧本，不是音乐|premiere is a first showing, not music|premiere 是首映，不是音乐|sound · track|sound plus track|sound 加 track
      screenplay|every line of dialogue and every direction|the written script of a film|sharp written dialogue that won an award|a screenplay is written words; a storyboard is drawings|screenplay 是文字；storyboard 是图画|storyboard is a set of drawings, not the written script|storyboard 是一组图画，不是文字剧本|soundtrack is the music of a film, not its written script|soundtrack 是电影配乐，不是文字剧本|screen · play|screen plus play|screen 加 play
      sequel|a film that continues the story of the first|a book fans await to learn what happens next|a novel continuing the story ten years later|a sequel continues a story; a premiere is a first showing|sequel 延续故事；premiere 是首映|premiere is a first public showing, not a work that continues a story|premiere 是首次公开放映，不是延续故事的作品|sequence is an order of things, not a work that continues a story|sequence 是事物的顺序，不是延续故事的作品|se · quel|the -qu- and the -el ending|中间是 -qu-，结尾是 -el
      premiere|a red carpet at a film's very first showing|a sold-out opening night of a play|a film's first public showing anywhere|a premiere is a first showing; a sequel is a later work|premiere 是首映；sequel 是续作|sequel is a later work continuing a story, not a first showing|sequel 是延续故事的后续作品，不是首映|documentary is a film about real events, not its first showing|documentary 是关于真实事件的影片，不是首映|pre · miere|the -iere ending|结尾是 -iere
      documentary|a film following real wolves with no actors|a film of real beaches and real scientists|interviews with real survivors telling a true story|a documentary shows real events; a screenplay is a written script|documentary 呈现真实事件；screenplay 是文字剧本|premiere is a first showing, not a film about real events|premiere 是首映，不是关于真实事件的影片|screenplay is a written script, not a film of real people and events|screenplay 是文字剧本，不是记录真人真事的影片|doc · u · men · ta · ry|document plus -ary|document 加 -ary
      subtitle|a line at the bottom of the screen translating Korean|words under a speaker's face that flashed by|a line on screen that misspelled an actor's words|a subtitle is text on screen; a soundtrack is music|subtitle 是屏幕上的文字；soundtrack 是音乐|soundtrack is the music and sound of a film, not words on the screen|soundtrack 是电影的音乐和声音，不是屏幕上的文字|storyboard is drawings made before filming, not words on the screen|storyboard 是拍摄前画的图，不是屏幕上的文字|sub · ti · tle|sub- plus title|sub- 加 title
      storyboard|drawings of every planned shot|panels showing where each camera would go|a comic strip of planned shots in pencil|a storyboard is drawings; a screenplay is written words|storyboard 是图画；screenplay 是文字|screenplay is the written script, not drawings of shots|screenplay 是文字剧本，不是镜头的图画|cinematography is the actual filming, not drawings made beforehand|cinematography 是真正的拍摄，不是事先画的图|sto · ry · board|story plus board|story 加 board
    `,
  },
);

const language = batch(
  "words-of-language-and-its-history",
  ["Words of Language and Its History", "语言及其历史的词"],
  ["language and the history of words", "语言与词汇的历史"],
  `
  etymology|the origin and history of a word|词源|The ___ of "salary" goes back to the Latin word for salt.|A good dictionary gives each word's ___, the story of where it came from.|She loves tracing the ___ of place names back through history to their first roots.|lexicon,coinage|etymologies,etymological
  lexicon|all the words of a language, or of a person or a subject|词汇，词典|The ___ of English, the whole stock of its words, keeps growing.|"Selfie" has entered the ___, joining the thousands of words people use.|Each science has its own ___, a whole set of special words.|etymology,syntax|lexicons
  neologism|a newly invented word or expression|新词|Twenty years ago, "podcast" was a fresh ___, a new word invented in English rather than borrowed.|Shakespeare made up many words; "swagger" was his ___, brand new to English.|Each ___ the dictionary added this year, such as "doomscrolling," is a newly made English word, not borrowed from abroad.|loanword,etymology|neologisms
  archaic|very old or no longer in use|古老的，过时的|The word "thou" is ___, an old form of "you" that no one uses today.|The law is ___ and out of date, written for a world long gone.|The ___ spelling, no longer used today, made the old letter hard to read.|phonetic,ancestral
  loanword|a word taken from another language|外来词|"Kindergarten" is a ___ taken from German.|"Ballet" is one ___ that English borrowed from French.|"Tea" is a ___ that English took from Chinese.|neologism,creole|loanwords
  coinage|a newly invented word or phrase; or the making of new words|新造词；造词|The word "cyberspace" was one writer's ___, invented by him in the 1980s.|The poet's ___, a word she made up herself, caught on quickly.|"Smog" is a famous ___, invented by joining smoke and fog.|loanword,etymology|coinages
  syntax|the way words are arranged to form sentences|句法|Yoda's ___ is unusual: he says "strong you are," putting the words in odd order.|The poem's twisted ___, the strange order of its words, slows the reader down.|Each language has its own rules of ___, which decide how words are arranged in a sentence.|lexicon,etymology|syntactic
  phonetic|having to do with the sounds of speech|语音的|The dictionary shows each word's ___ spelling, which tells you how it sounds.|Spanish spelling is more ___ than English: its letters match the sounds of speech.|The ___ alphabet has a symbol for every sound of speech.|archaic,explicit|phonetically,phonetics
  pidgin|a simple language made from two or more languages, used by people who share no common tongue|洋泾浜语，混杂语言|Traders who shared no language spoke a ___ of English and Chinese, simple and no one's first tongue.|With a small vocabulary and simple grammar, the ___ was nobody's mother tongue.|The sailors used a simple ___, mixed from three languages, to bargain at the port.|creole,loanword|pidgins
  creole|a language that grew from a pidgin and became the first language of a community|克里奥尔语|Haitian ___ is the first language of millions.|The traders' children grew up speaking the mixed language as their mother tongue, turning it into a full ___.|The island's ___, a mix of French and African languages, is the first language of every child born there.|pidgin,lexicon|creoles
  `,
  "context-clues",
  {
    intro: t(
      'The **etymology** of "ketchup" leads back to a Chinese word: it is a **loanword**. "Smog," by contrast, is a **coinage**, a **neologism** of 1905 that has now entered the **lexicon**. These ten words help you talk about language and the history of words.',
      "“ketchup”的词源（**etymology**）可以追溯到一个汉语词：它是一个外来词（**loanword**）。相比之下，“smog”是一个新造词（**coinage**），是1905年的新词（**neologism**），如今已进入词汇（**lexicon**）。这十个词帮你谈论语言和词汇的历史。",
    ),
    watchOut: {
      meanings: t(
        "New words: a **neologism** or a **coinage** is *invented*, while a **loanword** is *borrowed* from another language; **etymology** is the *history* of any word.",
        "新词：**neologism** 或 **coinage** 是新造的，**loanword** 是从别的语言借来的；**etymology** 是任何一个词的来历。",
      ),
      use: t(
        "A **pidgin** is *nobody's first language*; once children grow up speaking it, it becomes a **creole**. **Syntax** is word *order*; the **lexicon** is the *stock of words*.",
        "**pidgin** 不是任何人的母语；孩子们把它当母语说之后，它就成了 **creole**。**syntax** 是词序；**lexicon** 是词汇总量。",
      ),
      spelling: t(
        "Watch the *-ology* of **etymology**, the *x* of **lexicon** and **syntax**, the *ph* of **phonetic** and the *ch* said *k* in **archaic**.",
        "注意 **etymology** 的 -ology、**lexicon** 和 **syntax** 中的 x、**phonetic** 中的 ph，以及 **archaic** 中读作 k 的 ch。",
      ),
    },
    notes: `
      etymology|"salary" going back to the Latin word for salt|the story of where each word came from|place names traced back to their first roots|etymology is a word's history; a lexicon is a stock of words|etymology 是词的来历；lexicon 是词汇总量|lexicon is the whole stock of words, not one word's history|lexicon 是全部词汇，不是一个词的来历|coinage is a newly invented word, not the history of a word|coinage 是新造的词，不是一个词的来历|et · y · mol · o · gy|the y after et- and the -ology ending|et- 后是 y，结尾是 -ology
      lexicon|the whole growing stock of English words|"selfie" joining the words people use|the special words of each science|a lexicon is a stock of words; syntax is how they are arranged|lexicon 是词汇总量；syntax 是词的排列|etymology is the history of a word, not a whole stock of words|etymology 是一个词的来历，不是全部词汇|syntax is the arrangement of words in sentences, not the words themselves|syntax 是句中词的排列，不是词汇本身|lex · i · con|the x and the -icon ending|中间是 x，结尾是 -icon
      neologism|"podcast" invented in English twenty years ago|"swagger," made up by Shakespeare|newly made English words added to a dictionary|a neologism is invented; a loanword is borrowed|neologism 是新造的；loanword 是借来的|loanword is borrowed from another language, not newly invented in English|loanword 是从别的语言借来的，不是英语里新造的|etymology is the history of a word, not a new word itself|etymology 是一个词的来历，不是新词本身|ne · o · lo · gism|neo- plus -logism|neo- 加 -logism
      archaic|"thou," an old form no one uses today|a law written for a world long gone|old spelling that made a letter hard to read|archaic is old and out of use; phonetic is about speech sounds|archaic 古老过时；phonetic 与语音有关|phonetic means having to do with speech sounds, not old and out of use|phonetic 指与语音有关，不是古老过时|ancestral means belonging to your ancestors, not out of date and no longer used|ancestral 指属于祖先的，不是过时不用|ar · cha · ic|the ch said k|ch 读作 k
      loanword|"kindergarten" taken from German|"ballet" borrowed from French|"tea" taken from Chinese|a loanword is borrowed; a neologism is invented|loanword 是借来的；neologism 是新造的|neologism is newly invented, not borrowed from another language|neologism 是新造的，不是从别的语言借来的|creole is a whole language, not one borrowed word|creole 是一整门语言，不是一个借来的词|loan · word|loan plus word|loan 加 word
      coinage|"cyberspace," invented by a writer in the 1980s|a word a poet made up herself|"smog," made by joining smoke and fog|a coinage is invented; etymology is a word's history|coinage 是新造的；etymology 是词的来历|loanword is borrowed from another language, not invented|loanword 是从别的语言借来的，不是新造的|etymology is the history of a word, not a newly invented word|etymology 是一个词的来历，不是新造的词|coin · age|coin plus -age|coin 加 -age
      syntax|"strong you are," words in odd order|the strange word order of a poem|rules deciding how words are arranged in a sentence|syntax is word order; a lexicon is the words themselves|syntax 是词序；lexicon 是词汇本身|lexicon is the stock of words, not how they are arranged|lexicon 是全部词汇，不是词的排列方式|etymology is the history of a word, not word order|etymology 是一个词的来历，不是词序|syn · tax|syn- with a y plus tax|syn- 中是 y，加 tax
      phonetic|a spelling that tells you how a word sounds|Spanish letters matching the sounds of speech|an alphabet with a symbol for every sound|phonetic is about speech sounds; archaic is about being old|phonetic 关乎语音；archaic 关乎古老|archaic means old and no longer used, not about speech sounds|archaic 指古老不用，与语音无关|explicit means stated clearly, not about the sounds of speech|explicit 指明确表达，与语音无关|pho · net · ic|the ph said f|ph 读作 f
      pidgin|a simple mix of English and Chinese used by traders|a language with simple grammar that was nobody's mother tongue|a mix of three languages used to bargain at a port|a pidgin is nobody's first language; a creole is a community's first language|pidgin 不是任何人的母语；creole 是一个群体的母语|creole is a community's first language, not a simple tongue that no one speaks from birth|creole 是一个群体的母语，不是没人从小说的简单语言|loanword is one borrowed word, not a mixed language|loanword 是一个借来的词，不是混合语言|pid · gin|the -dg- as in pigeon|中间是 -dg-，读音同 pigeon
      creole|Haitian, the first language of millions|a mixed language that became children's mother tongue|an island's first language mixing French and African languages|a creole is a first language; a pidgin is nobody's first language|creole 是母语；pidgin 不是任何人的母语|pidgin is a simple language nobody speaks as a first language, not a mother tongue|pidgin 是没人当母语说的简单语言，不是母语|lexicon is a stock of words, not a whole language spoken as a mother tongue|lexicon 是词汇总量，不是被当作母语的一门语言|cre · ole|the -ole ending|结尾是 -ole
    `,
  },
);

const academic4 = batch(
  "academic-words-4",
  ["Academic Words 4", "学术词汇 4"],
  ["thinking and arguing in school", "学业中的思考与论证"],
  `
  analyze|to examine something in detail in order to understand it|分析|We will ___ the poem line by line, taking it apart to see how each piece works.|Scientists ___ each water sample in the lab, breaking it down to learn what it contains.|The coach will ___ the video of the game, taking each play apart to understand what went wrong.|synthesize,assess|analyzes,analyzed,analysis,analyses,analytical
  assess|to judge the quality, size or value of something|评定，评估|Teachers ___ each student's progress every term, judging how much they have learned.|Experts came to ___ the damage after the storm and put a value on it.|It is hard to ___ how much the plan will cost before the work begins.|validate,scrutinize|assesses,assessed,assessment,assessments
  validate|to prove or confirm that something is true or correct|证实，确认|Further experiments must ___ her theory, proving that it is correct.|Other scientists repeated the test to ___ the results and confirm they were true.|The bank will ___ your signature, confirming that it is really yours.|assess,postulate|validates,validated,validation,validity
  synthesize|to combine separate ideas or things into a whole|综合，合成|A good essay must ___ ideas from several sources, combining them into one argument.|Plants ___ sugar from sunlight, water and air, combining them into food.|She had to ___ five reports, joining them into one summary.|analyze,elucidate|synthesizes,synthesized,synthesis
  scrutinize|to examine something very carefully|仔细检查，审查|The editor will ___ every line of the article, examining it closely for the smallest mistake.|Voters should ___ each candidate's record, looking at it very carefully.|He began to ___ the painting through a magnifying glass, searching closely for signs of forgery.|assess,analyze|scrutinizes,scrutinized,scrutiny
  postulate|to suggest that something is true as a basis for reasoning|假定，假设|Scientists ___ that the planet once had water, and build their theory on that idea.|The theory begins by asking us to ___ a hidden ninth planet, assuming it exists without proof.|Euclid chose to ___ that two points fix a single straight line, taking it as true without proof.|validate,elucidate|postulates,postulated
  elucidate|to make something clear by explaining it|阐明，解释|The teacher tried to ___ the difficult passage, explaining it until it was clear.|Can you ___ what you mean by explaining it more clearly?|The notes at the back ___ the poem's references, explaining each one clearly.|contextualize,synthesize|elucidates,elucidated
  contextualize|to place something in its setting so that it can be understood|将……置于背景中考虑|To understand the speech, we must ___ it, placing it in the history of its time.|The museum labels ___ each object by describing the period and place it came from.|The historian tried to ___ the letter, setting it within the events of the war.|elucidate,synthesize|contextualizes,contextualized
  hypothesize|to suggest an explanation that can then be tested|假设，假定|Students ___ that plants grow faster in light, and then test the idea.|Researchers ___ that the disease spreads through water, a guess they still need to test.|Before the experiment, she had to ___ about the result, suggesting an explanation to test.|validate,analyze|hypothesizes,hypothesized,hypothetical
  delineate|to describe or mark something clearly and in detail|描绘，勾画|The report will ___ the duties of each worker, describing them clearly and in detail.|A fence and a row of stones ___ the border of the farm, marking it clearly.|The essay sets out to ___ the stages of the war, describing each one clearly.|scrutinize,contextualize|delineates,delineated
  `,
  "context-clues",
  {
    intro: t(
      "In the science fair, you **hypothesize** first, then **analyze** your data; the judges **scrutinize** your method, **assess** your results and ask whether further tests can **validate** them. These ten verbs help you think and argue in school.",
      "在科学展上，你先提出假设（**hypothesize**），再分析（**analyze**）数据；评委会仔细审查（**scrutinize**）你的方法，评估（**assess**）你的结果，并追问更多实验能否证实（**validate**）它们。这十个动词帮你在学业中思考与论证。",
    ),
    watchOut: {
      meanings: t(
        "**Analyze** takes a thing *apart*; **synthesize** puts things *together*; **hypothesize** and **postulate** suggest an idea *before* proof; **validate** *proves* it.",
        "**analyze** 是拆开分析；**synthesize** 是组合成整体；**hypothesize** 和 **postulate** 是在证明之前提出想法；**validate** 是证实它。",
      ),
      use: t(
        "**Assess** puts a *value* on something; **scrutinize** looks *very closely*; **elucidate** makes it *clear*; **contextualize** sets it in its *time and place*; **delineate** *marks out* its outline.",
        "**assess** 是评定价值；**scrutinize** 是仔细审视；**elucidate** 是解释清楚；**contextualize** 是放进时代背景；**delineate** 是勾勒轮廓。",
      ),
      spelling: t(
        "Watch the *-yze* of **analyze**, the *-size* of **synthesize** and **hypothesize**, the double *s* twice in **assess** and the *-eate* of **delineate**.",
        "注意 **analyze** 的 -yze、**synthesize** 和 **hypothesize** 的 -size、**assess** 中两处双写 s，以及 **delineate** 的 -eate。",
      ),
    },
    notes: `
      analyze|a poem taken apart line by line|water samples broken down in a lab|each play of a game taken apart to see what went wrong|to analyze is to take apart; to synthesize is to put together|analyze 是拆开；synthesize 是组合|synthesize means to combine parts into a whole, not to take something apart|synthesize 指把部分组合成整体，不是拆开|assess means to judge value or size, not to take something apart to see how it works|assess 指评定价值或大小，不是拆开看如何运作|an · a · lyze|the y in -lyze|-lyze 中是 y
      assess|judging how much each student has learned|putting a value on storm damage|judging how much a plan will cost|to assess is to judge value; to validate is to prove true|assess 是评定价值；validate 是证实|validate means to prove something true, not to judge its size or value|validate 指证明某事属实，不是评定大小或价值|scrutinize means to look very closely, not to put a value on something|scrutinize 指仔细审视，不是评定价值|as · sess|two double s's|有两处双写 s
      validate|experiments proving a theory correct|a repeated test confirming results|a bank confirming a signature is real|to validate is to confirm true; to postulate is to assume true without proof|validate 是证实；postulate 是不经证明地假定|assess means to judge value or quality, not to prove something true|assess 指评定价值或质量，不是证明属实|postulate means to assume something without proof, not to prove it|postulate 指不经证明地假定，不是证明它|val · i · date|valid plus -ate|valid 加 -ate
      synthesize|ideas from several sources combined into one argument|sugar made by combining sunlight, water and air|five reports joined into one summary|to synthesize is to combine; to analyze is to take apart|synthesize 是组合；analyze 是拆开|analyze means to take something apart to study it, not to combine parts|analyze 指拆开研究，不是组合各部分|elucidate means to explain clearly, not to combine things into a whole|elucidate 指解释清楚，不是组合成整体|syn · the · size|syn- with a y and the -size ending|syn- 中是 y，结尾是 -size
      scrutinize|an editor checking every line for the smallest mistake|voters looking very carefully at a record|a painting searched closely through a magnifying glass|to scrutinize is to look very closely; to assess is to judge value|scrutinize 是仔细审视；assess 是评定价值|assess means to judge value or amount, not to search closely for small details|assess 指评定价值或数量，不是仔细搜寻细节|analyze means to take apart to understand, not to search closely for flaws|analyze 指拆开以理解，不是仔细查找瑕疵|scru · ti · nize|scrutiny changes y to i, then -ize|scrutiny 的 y 变成 i，再加 -ize
      postulate|scientists assuming a planet once had water|a hidden planet assumed without proof|a line through two points taken as true without proof|to postulate is to assume as a basis; to validate is to prove|postulate 是作为前提假定；validate 是证实|validate means to prove true, not to assume without proof|validate 指证明属实，不是不经证明地假定|elucidate means to explain clearly, not to assume something as a starting point|elucidate 指解释清楚，不是把某事假定为前提|pos · tu · late|the -tu- and the -late ending|中间是 -tu-，结尾是 -late
      elucidate|a teacher explaining a hard passage until it was clear|explaining what you mean more clearly|notes explaining each reference of a poem|to elucidate is to make clear; to contextualize is to set in a time and place|elucidate 是解释清楚；contextualize 是放进时代背景|contextualize means to set something in its time and place, not simply to explain it clearly|contextualize 指把事物放进时代背景，不只是解释清楚|synthesize means to combine things, not to explain one clearly|synthesize 指组合事物，不是把一件事解释清楚|e · lu · ci · date|the -luc- as in lucid, then -idate|中间是 -luc-（同 lucid），结尾是 -idate
      contextualize|a speech placed in the history of its time|museum labels describing the period and place of each object|a letter set within the events of a war|to contextualize is to set in its time and place; to elucidate is to explain clearly|contextualize 是放进背景；elucidate 是解释清楚|elucidate means to explain clearly, not to place something in its time and setting|elucidate 指解释清楚，不是放进时代背景|synthesize means to combine parts into a whole, not to set one thing in its time|synthesize 指组合成整体，不是把一件事放进其时代|con · tex · tu · al · ize|context plus -ual plus -ize|context 加 -ual 再加 -ize
      hypothesize|students suggesting plants grow faster in light before testing|researchers guessing how a disease spreads|an explanation suggested before an experiment|to hypothesize is to suggest an idea to test; to validate is to prove it|hypothesize 是提出待验证的设想；validate 是证实它|validate means to prove true, not to suggest an idea that still needs testing|validate 指证明属实，不是提出尚待验证的想法|analyze means to examine in detail, not to suggest an explanation before testing|analyze 指仔细研究，不是在验证前提出解释|hy · poth · e · size|the y after h and the -size ending|h 后是 y，结尾是 -size
      delineate|a report describing each worker's duties in detail|a fence and stones marking a farm's border|an essay describing each stage of a war clearly|to delineate is to mark out clearly; to scrutinize is to look closely|delineate 是清楚勾勒；scrutinize 是仔细审视|scrutinize means to examine closely, not to mark out or describe clearly|scrutinize 指仔细检查，不是清楚地勾勒或描述|contextualize means to set something in its time, not to mark out its outline|contextualize 指放进时代背景，不是勾勒轮廓|de · lin · e · ate|de- plus line plus -ate|de- 加 line 再加 -ate
    `,
  },
);

const academic5 = batch(
  "academic-words-5",
  ["Academic Words 5", "学术词汇 5"],
  ["reasoning about texts and data", "文本与数据的推理"],
  `
  context|the situation or the words around something that help explain its meaning|上下文，背景|Use the ___, the words around a new word, to guess its meaning.|The quotation was taken out of its ___, so readers did not see the situation around it.|Seen in the ___ of the war, the situation around it, the decision makes sense.|syntax,subtext|contexts,contextual
  implicit|suggested but not stated directly|含蓄的，暗示的|His words carried a threat that was ___: never said aloud, yet clear to everyone.|The poem's message is ___, suggested but never stated, yet clear and strong.|Her trust in him was ___: she never said so, but it showed in everything she did.|explicit,tenuous|implicitly
  explicit|stated clearly and directly, leaving no doubt|明确的，清楚的|The instructions were ___, stated plainly: no phones in the exam.|The author makes the theme ___ in the last line, stating it directly.|He gave ___ permission, saying clearly and directly that we could use the photo.|implicit,coherent|explicitly
  qualitative|having to do with quality or kind rather than amount|定性的，质量的|The study collected ___ data from interviews, describing people's feelings rather than counting anything.|There is a ___ difference between the two paintings, a difference of kind, not of size.|This kind of research is ___, asking people to describe experiences instead of measuring amounts.|quantitative,salient|qualitatively
  quantitative|having to do with amounts that can be measured or counted|定量的，数量的|The survey produced ___ data, numbers that can be shown in charts.|Research that is ___ uses numbers and statistics to measure amounts.|We need some ___ measure of success, one we can count and compare.|qualitative,arbitrary|quantitatively
  coherent|clear and logical, with parts that fit together|连贯的，条理清楚的|Her essay's argument is ___, with every part fitting logically together.|After the fall he was confused, and his account of what happened was not ___: its parts made no logical sense together.|The plan is not ___; its parts do not fit together logically.|explicit,tenuous|coherently,coherence,incoherent
  arbitrary|based on chance or personal whim rather than on reason or a rule|任意的，武断的|The choice of date seemed ___, picked by chance rather than for any reason.|The ruler's ___ decisions, made on a whim without any rule, angered the people.|Grades should not be ___ but based on clear rules.|tenuous,quantitative|arbitrarily
  salient|most noticeable or most important|显著的，最重要的|Summarize the ___ points of the article, the most important ones, not every detail.|The ___ feature of the building, the first thing anyone notices, is its tower.|She listed the ___ facts for the jury, picking out the most noticeable.|cogent,tenuous
  tenuous|very weak or slight|薄弱的，站不住脚的|The link between the two events is ___, so weak that it could easily be broken.|His hold on power was ___, slight and likely to slip at any moment.|The evidence for the claim is ___: thin, weak and easily doubted.|arbitrary,implicit|tenuously
  cogent|clear, logical and convincing|有说服力的|She made a ___ case for the new park, so logical and convincing that the council agreed.|The essay offers ___ evidence that persuades even doubtful readers.|His argument was so ___, clear and convincing, that no one objected.|salient,tenuous|cogently,cogency
  `,
  "context-clues",
  {
    intro: t(
      "A good essay makes a **coherent**, **cogent** argument; it states its main claim in **explicit** terms, picks out the **salient** facts, and never rests on a **tenuous** link. These ten words help you reason about texts and data.",
      "一篇好文章的论证连贯（**coherent**）而有说服力（**cogent**）；它明确（**explicit**）提出主要观点，挑出最重要的（**salient**）事实，从不依赖站不住脚（**tenuous**）的联系。这十个词帮你对文本与数据进行推理。",
    ),
    watchOut: {
      meanings: t(
        "Opposite pairs: **implicit** is *suggested* while **explicit** is *stated*; **qualitative** describes *kind* while **quantitative** counts *amounts*.",
        "成对的反义词：**implicit** 是暗示的，**explicit** 是明说的；**qualitative** 描述种类，**quantitative** 计算数量。",
      ),
      use: t(
        "Judging an argument: **cogent** is *convincing*, **coherent** *fits together*, **tenuous** is *weak*, **arbitrary** is *by whim*, and **salient** points *stand out*.",
        "评判论证：**cogent** 有说服力，**coherent** 前后连贯，**tenuous** 薄弱，**arbitrary** 随意武断，**salient** 的要点格外突出。",
      ),
      spelling: t(
        "Watch the *-cit* of **implicit** and **explicit**, the *-ary* of **arbitrary**, the *-uous* of **tenuous** and the soft *g* of **cogent**.",
        "注意 **implicit** 和 **explicit** 的 -cit、**arbitrary** 的 -ary、**tenuous** 的 -uous，以及 **cogent** 中读软音的 g。",
      ),
    },
    notes: `
      context|the words around a new word that show its meaning|a quotation taken out of the situation around it|the situation of a war that explains a decision|context is what surrounds something; subtext is a hidden meaning beneath it|context 是周围的情境；subtext 是隐藏的言外之意|syntax is the order of words in a sentence, not the situation around something|syntax 是句中的词序，不是周围的情境|subtext is a hidden meaning under the words, not the situation around them|subtext 是字面下隐藏的意思，不是周围的情境|con · text|con- plus text|con- 加 text
      implicit|a threat never said aloud but clear to everyone|a poem's message suggested but never stated|trust that showed without being said|implicit is suggested; explicit is stated|implicit 是暗示的；explicit 是明说的|explicit means stated directly, not suggested without being said|explicit 指直接说出，不是不言而喻|tenuous means weak, not suggested yet clear|tenuous 指薄弱，不是暗示却清楚|im · pli · cit|im- plus -plicit|im- 加 -plicit
      explicit|instructions stated plainly|a theme stated directly in the last line|permission given clearly and directly|explicit is stated outright; implicit is only suggested|explicit 是直说的；implicit 只是暗示的|implicit means suggested without being said, not stated plainly|implicit 指暗示而不明说，不是直说|coherent means logical and fitting together, not stated outright|coherent 指有条理、前后连贯，不是直说|ex · pli · cit|ex- plus -plicit|ex- 加 -plicit
      qualitative|data from interviews describing feelings|a difference of kind, not of size|research asking people to describe experiences|qualitative describes kind; quantitative counts amounts|qualitative 描述种类；quantitative 计算数量|quantitative means measured in amounts, not describing kind or quality|quantitative 指用数量衡量，不是描述种类或质量|salient means most noticeable, not about kind rather than amount|salient 指最显著的，与种类或数量无关|qual · i · ta · tive|quality changes y to i, then -tative|quality 的 y 变成 i，再加 -tative
      quantitative|numbers shown in charts|research using statistics to measure amounts|a measure of success that can be counted|quantitative counts amounts; qualitative describes kind|quantitative 计算数量；qualitative 描述种类|qualitative means describing kind or quality, not counting amounts|qualitative 指描述种类或质量，不是计算数量|arbitrary means chosen by whim, not measured in numbers|arbitrary 指随意决定，不是用数字衡量|quan · ti · ta · tive|quantity changes y to i, then -tative|quantity 的 y 变成 i，再加 -tative
      coherent|an essay whose parts fit logically together|an account of a fall whose parts made no logical sense|a plan whose parts do not fit together|coherent fits together; tenuous is weak|coherent 前后连贯；tenuous 薄弱|explicit means stated directly, not having parts that fit together|explicit 指直接说明，不是各部分连贯|tenuous means weak or slight, not logical and well connected|tenuous 指薄弱，不是有条理、连贯|co · her · ent|co- plus here plus -nt|co- 加 here 再加 -nt
      arbitrary|a date picked by chance|decisions made on a whim without any rule|grades not based on clear rules|arbitrary is by whim; tenuous is weak|arbitrary 随意武断；tenuous 薄弱|tenuous means weak or slight, not based on whim|tenuous 指薄弱，不是凭一时兴起|quantitative means measured in amounts, not chosen without reason|quantitative 指用数量衡量，不是无缘无故地选|ar · bi · trar · y|the -trary ending, with r twice|结尾是 -trary，有两个 r
      salient|the most important points of an article|a tower that anyone notices first|the most noticeable facts for a jury|salient stands out; cogent convinces|salient 格外突出；cogent 有说服力|cogent means convincing, not most noticeable or important|cogent 指有说服力，不是最显著或最重要|tenuous means weak, not the most noticeable|tenuous 指薄弱，不是最显著的|sa · li · ent|the -ient ending|结尾是 -ient
      tenuous|a link so weak it could easily break|a hold on power likely to slip|evidence that is thin and easily doubted|tenuous is weak; arbitrary is by whim|tenuous 薄弱；arbitrary 随意武断|arbitrary means based on whim, not weak or slight|arbitrary 指凭一时兴起，不是薄弱|implicit means suggested without being said, not weak|implicit 指暗示而不明说，不是薄弱|ten · u · ous|the -uous ending|结尾是 -uous
      cogent|a case so convincing the council agreed|evidence that persuades doubtful readers|an argument so convincing no one objected|cogent convinces; salient stands out|cogent 有说服力；salient 格外突出|salient means most noticeable, not convincing|salient 指最显著，不是有说服力|tenuous means weak, the opposite of convincing|tenuous 指薄弱，与有说服力相反|co · gent|the soft g, as in agent|g 读软音，同 agent
    `,
  },
);

/** batchesB are the batches of words of the last five units of grade 9. */
export const batchesB: readonly BatchSpec[] = [
  power,
  space,
  minds,
  diet,
  hospital,
  body,
  custom,
  wisdom,
  art,
  music,
  film,
  language,
  academic4,
  academic5,
];
