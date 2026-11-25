// Grade 3: the reading unit of the theme of music: sound, rhythm, pitch, the families of instruments, the orchestra
// and music around the world.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, clues, passage, words } from "./reading-kit.ts";

const music = words("words-of-music");
const families = words("words-of-instrument-families");
const describing = words("words-for-describing-music");
const performing = words("words-for-performing");

/** theWorldOfMusic is the reading unit of grade 3 on how music is made and played. */
export const theWorldOfMusic: ReadingUnitDef = {
  id: "the-world-of-music",
  title: t("Making Music", "演奏音乐"),
  passages: [
    passage(
      "what-is-sound",
      t("What Is Sound?", "什么是声音？"),
      `Put your fingers gently on the front of your throat and hum. Can you feel a tiny buzzing? That buzzing is a vibration, and it is the start of every sound you hear.

A sound begins when something vibrates, or moves back and forth very quickly. When you pluck a rubber band, it shakes so fast that it looks blurry. The shaking band pushes on the air around it. The air passes the vibration along, like a wave moving across a pond, until it reaches your ears. Inside your ear, a thin piece of skin called the eardrum starts to vibrate too, and your brain hears a sound.

Sound can travel through more than air. It moves through water, which is why whales can hear each other from far away. It also moves through solid things. Put your ear against a table while a friend taps the other end, and you will hear the tap loud and clear.

Every musical instrument is a way of making something vibrate. A guitar shakes its strings, a drum shakes its skin, and a flute shakes the air inside it. Music is sound that people shape with care.`,
      [clues, music, describing],
      [
        ask(
          ["How does every sound begin?", "每一种声音是怎样开始的？"],
          ["Something vibrates, or moves back and forth quickly", "某样东西振动，也就是很快地来回移动"],
          [
            ["Something becomes very hot", "某样东西变得很热"],
            ["Your brain makes it up", "你的大脑想出了它"],
            ["The air becomes very still", "空气变得一动不动"],
          ],
          [
            "The second paragraph says a sound begins when something vibrates, or moves back and forth very quickly.",
            "第二段说，当某样东西振动，也就是很快地来回移动时，声音就开始了。",
          ],
          [
            ["Becoming very hot is not in the passage.", "变得很热文中没有。"],
            ["Your brain making it up is wrong. The brain hears a real vibration.", "大脑编出来不对。大脑听到的是真实的振动。"],
            ["Still air is the opposite. The air passes the vibration along.", "空气很静正好相反。空气把振动传过去。"],
          ],
        ),
        ask(
          ["How does a vibration reach your ears?", "振动是怎样传到你耳朵里的？"],
          ["The air passes it along like a wave", "空气像波浪一样把它传过来"],
          [
            ["It jumps straight from the band to your brain", "它直接从橡皮筋跳到你的大脑"],
            ["A friend carries it to you", "一个朋友把它带给你"],
            ["It only travels through solid tables", "它只能通过结实的桌子传播"],
          ],
          [
            "The second paragraph says the air passes the vibration along, like a wave moving across a pond, until it reaches your ears.",
            "第二段说，空气把振动一路传下去，就像水波在池塘上移动，直到它到达你的耳朵。",
          ],
          [
            [
              "Jumping straight to your brain is wrong. It travels through the air to your ear first.",
              "直接跳到大脑不对。它先通过空气传到耳朵。",
            ],
            ["A friend carrying it is not in the passage.", "朋友带过来文中没有。"],
            [
              "Only through tables is wrong. Sound travels through air, water and solids.",
              "只能通过桌子不对。声音能在空气、水和固体中传播。",
            ],
          ],
        ),
        ask(
          ["Which detail shows that sound can travel through water?", "哪个细节说明声音能在水中传播？"],
          ["Whales can hear each other from far away", "鲸鱼能听见远处同伴的声音"],
          [
            ["A rubber band looks blurry", "橡皮筋看起来模模糊糊"],
            ["A friend taps the end of a table", "一个朋友敲桌子的另一头"],
            ["A guitar shakes its strings", "吉他让琴弦振动"],
          ],
          [
            "The third paragraph says sound moves through water, which is why whales can hear each other from far away.",
            "第三段说，声音能在水中传播，所以鲸鱼能听见远处同伴的声音。",
          ],
          [
            ["A blurry rubber band shows vibration, not sound in water.", "模糊的橡皮筋说明的是振动，不是水中的声音。"],
            ["Tapping a table shows sound through solids.", "敲桌子说明的是声音能通过固体。"],
            ["A guitar shaking its strings is about instruments.", "吉他振动琴弦说的是乐器。"],
          ],
        ),
        ask(
          ["What is the thin piece of skin inside your ear called?", "耳朵里那层薄薄的膜叫什么？"],
          ["The eardrum", "鼓膜"],
          [
            ["The throat", "喉咙"],
            ["The drum skin", "鼓皮"],
            ["The pond", "池塘"],
          ],
          ["Inside your ear, a thin piece of skin called the eardrum starts to vibrate.", "在耳朵里，一层叫鼓膜的薄膜开始振动。"],
          [
            ["The throat is where you feel the hum.", "喉咙是你感到嗡嗡声的地方。"],
            ["A drum skin is on a drum, not in your ear.", "鼓皮在鼓上，不在耳朵里。"],
            ["A pond is part of the comparison with a wave.", "池塘是和波浪比喻里的一部分。"],
          ],
        ),
      ],
    ),
    passage(
      "beat-and-rhythm",
      t("Beat and Rhythm", "节拍和节奏"),
      `Tap your foot while you listen to a song you like. Without even thinking, you are keeping the beat. The beat is the steady pulse of the music, like the ticking of a clock or the beating of your heart. It goes on and on at the same speed.

Some music has a fast beat that makes you want to jump and dance. Some has a slow beat that makes you feel calm and sleepy. How fast or slow the beat goes is called the tempo. A march has a quick, firm tempo for walking in step. A lullaby has a slow, gentle one.

Rhythm is the pattern of long and short sounds that sit on top of the beat. Clap the words "Twinkle, twinkle, little star." Some claps are short, and the last one is long. That pattern is the rhythm of the song. Two songs can share the same beat but have very different rhythms.

Drummers are the keepers of the beat in many bands. If they speed up or slow down, everyone else must follow. That is why musicians practice with a ticking machine that keeps the beat perfectly steady.`,
      [clues, music, describing, performing],
      [
        ask(
          ["What is the beat of a piece of music?", "音乐的节拍是什么？"],
          ["Its steady pulse that goes on at the same speed", "它以同样速度一直持续的稳定律动"],
          [
            ["The words that a singer sings", "歌手唱的歌词"],
            ["The loudest note in the song", "歌里最响的那个音"],
            ["The pattern of long and short sounds", "长音和短音组成的规律"],
          ],
          [
            "The first paragraph says the beat is the steady pulse of the music, which goes on at the same speed.",
            "第一段说，节拍是音乐稳定的律动，以同样的速度一直持续下去。",
          ],
          [
            ["The singer's words are not the beat.", "歌手唱的词不是节拍。"],
            ["The loudest note is not in the passage.", "最响的音文中没有。"],
            ["A pattern of long and short sounds is rhythm, not the beat.", "长短音的组合是节奏，不是节拍。"],
          ],
        ),
        ask(
          ["What is the tempo of a piece of music?", "音乐的速度指的是什么？"],
          ["How fast or slow the beat goes", "节拍走得多快或多慢"],
          [
            ["How loud the music is", "音乐有多响"],
            ["How many people are playing", "有多少人在演奏"],
            ["Which instrument plays first", "哪种乐器先演奏"],
          ],
          ["The second paragraph says that how fast or slow the beat goes is called the tempo.", "第二段说，节拍走得多快或多慢叫作速度。"],
          [
            ["Loudness is not tempo.", "响度不是速度。"],
            ["How many people are playing is not tempo.", "多少人演奏不是速度。"],
            ["Which instrument plays first is not tempo.", "哪个乐器先演奏不是速度。"],
          ],
        ),
        ask(
          ["Why do the other musicians in a band follow the drummer?", "为什么乐队里的其他乐手要跟着鼓手？"],
          ["The drummer keeps the beat for everyone", "鼓手为大家掌握节拍"],
          [
            ["The drummer sings all the words", "鼓手唱所有的歌词"],
            ["The drummer is always the oldest", "鼓手总是年纪最大的"],
            ["The drummer plays the highest notes", "鼓手演奏最高的音"],
          ],
          [
            "The last paragraph says drummers keep the beat in many bands, so if they speed up or slow down, everyone else must follow.",
            "最后一段说，在很多乐队里鼓手掌握节拍，所以他们加快或放慢时，其他人都得跟着。",
          ],
          [
            ["Singing all the words is not what the drummer does.", "唱所有的词不是鼓手的事。"],
            ["Being the oldest is not in the passage.", "年纪最大文中没有。"],
            ["The highest notes are not the drummer's job.", "最高的音不是鼓手的工作。"],
          ],
        ),
        ask(
          ["What is rhythm?", "什么是节奏？"],
          ["The pattern of long and short sounds on top of the beat", "拍子之上长短声音的组合"],
          [
            ["How fast the beat goes", "拍子有多快"],
            ["How loud the music is", "音乐有多响"],
            ["The steady pulse of the music", "音乐稳定的脉动"],
          ],
          ["Rhythm is the pattern of long and short sounds that sit on top of the beat.", "节奏是落在拍子之上的长短声音的组合。"],
          [
            ["How fast the beat goes is tempo.", "节拍有多快是速度。"],
            ["How loud the music is is not rhythm.", "音乐多响不是节奏。"],
            ["The steady pulse is the beat, not the rhythm on top of it.", "稳定的律动是节拍，不是上面的节奏。"],
          ],
        ),
      ],
      ["Twinkle"],
    ),
    passage(
      "high-notes-and-low-notes",
      t("High Notes and Low Notes", "高音和低音"),
      `Sing the lowest note you can, and then the highest. The difference between them is called pitch. Pitch is how high or low a sound is.

Pitch depends on how fast something vibrates. When an object vibrates very quickly, it makes a high pitch, like the squeak of a mouse or the whistle of a bird. When it vibrates slowly, it makes a low pitch, like the rumble of thunder or the growl of a big dog.

The size of an object changes its pitch too. Fill some glasses with different amounts of water and tap each one with a spoon. The glass with the least water rings with the highest note. On a xylophone, the short bars play high notes and the long bars play low ones. A small violin sounds higher than a huge double bass, which is so tall that the player must stand beside it.

Pitch is different from loudness. A high note can be soft, like a gentle whistle, and a low note can be very loud, like a booming drum. When musicians write down music, they place each note higher or lower on a set of lines to show its pitch.`,
      [clues, music, describing],
      [
        ask(
          ["What is pitch?", "什么是音高？"],
          ["How high or low a sound is", "声音有多高或多低"],
          [
            ["How loud or soft a sound is", "声音有多响或多轻"],
            ["How long a song lasts", "一首歌有多长"],
            ["How fast the beat goes", "节拍走得多快"],
          ],
          ["The first paragraph says that pitch is how high or low a sound is.", "第一段说，音高就是声音有多高或多低。"],
          [
            ["Loud or soft is loudness. The passage says pitch is different from loudness.", "响或轻是响度。文中说音高和响度不同。"],
            ["How long a song lasts is not pitch.", "一首歌多长不是音高。"],
            ["How fast the beat goes is tempo, from another passage.", "节拍多快是速度，在另一篇里。"],
          ],
        ),
        ask(
          ["Why does the squeak of a mouse have a high pitch?", "为什么老鼠的吱吱声音调很高？"],
          ["It comes from something vibrating very quickly", "它来自振动得很快的东西"],
          [
            ["It comes from something vibrating slowly", "它来自振动得很慢的东西"],
            ["Mice are bigger than dogs", "老鼠比狗大"],
            ["It is louder than thunder", "它比雷声还响"],
          ],
          [
            "The second paragraph says that when an object vibrates very quickly it makes a high pitch, like the squeak of a mouse.",
            "第二段说，物体振动得很快时会发出高音，比如老鼠的吱吱声。",
          ],
          [
            ["Vibrating slowly makes a low pitch, like thunder.", "振动慢产生低音，像雷声。"],
            ["Mice being bigger than dogs is wrong and not the reason.", "老鼠比狗大是错的，也不是原因。"],
            ["Being louder than thunder is wrong. Pitch is not loudness.", "比雷声响不对。音高不是响度。"],
          ],
        ),
        ask(
          ["On a xylophone, which bars play the low notes?", "在木琴上，哪些琴键发出低音？"],
          ["The long bars", "长的琴键"],
          [
            ["The short bars", "短的琴键"],
            ["The bars filled with water", "装满水的琴键"],
            ["The bars that are painted", "涂了颜色的琴键"],
          ],
          [
            "The third paragraph says the short bars on a xylophone play high notes and the long bars play low ones.",
            "第三段说，木琴上短的琴键发出高音，长的琴键发出低音。",
          ],
          [
            ["The short bars play the high notes.", "短的木条奏高音。"],
            ["Bars filled with water mixes up the glasses.", "装水的木条把玻璃杯弄混了。"],
            ["Painted bars are not in the passage.", "涂了颜色的木条文中没有。"],
          ],
        ),
        ask(
          ["Which glass rings with the highest note?", "哪个杯子敲出的音最高？"],
          ["The glass with the least water", "水最少的杯子"],
          [
            ["The glass with the most water", "水最多的杯子"],
            ["The biggest glass", "最大的杯子"],
            ["An empty bottle", "一个空瓶子"],
          ],
          ["The text says the glass with the least water rings with the highest note.", "短文说水最少的杯子敲出的音最高。"],
          [
            ["The most water gives the lowest note.", "水最多的杯子音最低。"],
            ["The biggest glass is not what the passage compares.", "最大的杯子不是文中比较的东西。"],
            ["An empty bottle is not in this test.", "空瓶子不在这个实验里。"],
          ],
        ),
      ],
    ),
    passage(
      "strings-that-sing",
      t("Strings That Sing", "会唱歌的琴弦"),
      `The string family is the largest group of instruments in an orchestra. It has four main members: the violin, the viola, the cello and the double bass. They look alike, but they come in different sizes. The violin is the smallest and plays the highest notes. The double bass is the biggest and plays the lowest.

All string instruments make sound in the same way: a tight string vibrates. Players can make the strings vibrate in two ways. Most of the time they draw a bow across them. A bow is a long stick with a ribbon of horsehair stretched along it. Players can also pluck the strings with their fingers for a short, bouncy sound.

To change the pitch, a player presses a string down against the neck of the instrument with one finger. This makes the part of the string that vibrates shorter, and a shorter string plays a higher note.

The body of a string instrument is hollow wood. When the strings vibrate, the wooden body vibrates too and makes the sound much louder. Guitars and harps also belong to the string family, though you will not often see a guitar in an orchestra.`,
      [clues, music, families],
      [
        ask(
          ["Which string instrument plays the lowest notes?", "哪种弦乐器发出的音最低？"],
          ["The double bass", "低音提琴"],
          [
            ["The violin", "小提琴"],
            ["The viola", "中提琴"],
            ["The harp", "竖琴"],
          ],
          [
            "The first paragraph says the double bass is the biggest member of the family and plays the lowest notes.",
            "第一段说，低音提琴是这一家里最大的，发出的音最低。",
          ],
          [
            ["The violin is the smallest and plays the highest.", "小提琴最小，奏最高的音。"],
            ["The viola is not the biggest.", "中提琴不是最大的。"],
            ["The harp is not one of the four main members.", "竖琴不是四个主要成员之一。"],
          ],
        ),
        ask(
          ["What is a bow made of?", "琴弓是用什么做的？"],
          ["A long stick with horsehair stretched along it", "一根长杆，上面绷着马尾毛"],
          [
            ["A hollow piece of wood with strings", "一块装着琴弦的空心木头"],
            ["A metal tube with holes", "一根带孔的金属管"],
            ["A drum skin on a frame", "绷在框上的鼓皮"],
          ],
          [
            "The second paragraph says a bow is a long stick with a ribbon of horsehair stretched along it.",
            "第二段说，琴弓是一根长杆，上面绷着一条马尾毛。",
          ],
          [
            ["Hollow wood with strings is the body of the instrument.", "带弦的空心木头是乐器的琴身。"],
            ["A metal tube with holes sounds like a flute.", "带孔的金属管像长笛。"],
            ["A drum skin on a frame is a drum.", "框上的鼓皮是鼓。"],
          ],
        ),
        ask(
          ["Why does pressing a string down make a higher note?", "为什么按住琴弦会发出更高的音？"],
          ["The part of the string that vibrates becomes shorter", "琴弦振动的那一段变短了"],
          [
            ["The string becomes looser", "琴弦变松了"],
            ["The body of the instrument stops shaking", "琴身停止了振动"],
            ["The bow moves more slowly", "琴弓移动得更慢了"],
          ],
          [
            "The third paragraph says pressing a string down makes the part that vibrates shorter, and a shorter string plays a higher note.",
            "第三段说，按住琴弦会让振动的那一段变短，而更短的琴弦发出更高的音。",
          ],
          [
            ["Looser is wrong. Pressing makes the vibrating part shorter.", "变松不对。按下是让振动部分变短。"],
            ["The body stopping is wrong. It vibrates too.", "琴身停止振动不对。它也在振动。"],
            ["The bow moving slowly is not in the passage.", "弓移动得慢文中没有。"],
          ],
        ),
        ask(
          ["Why is the body of a string instrument hollow wood?", "弦乐器的琴身为什么是空心木头？"],
          ["It vibrates too and makes the sound much louder", "它也会振动，让声音响得多"],
          [
            ["It makes the instrument lighter to carry", "让乐器更轻便"],
            ["It keeps the strings dry", "让琴弦保持干燥"],
            ["It changes the pitch", "它改变音高"],
          ],
          [
            "When the strings vibrate, the wooden body vibrates too and makes the sound much louder.",
            "琴弦振动时，木质琴身也振动，使声音响得多。",
          ],
          [
            ["Lighter to carry is not the reason given.", "更轻便好拿不是文中给的原因。"],
            ["Keeping strings dry is not in the passage.", "让琴弦保持干燥文中没有。"],
            ["Changing the pitch is done with the fingers on the strings.", "改变音高是用手指按弦。"],
          ],
        ),
      ],
    ),
    passage(
      "blowing-through-brass-and-wood",
      t("Blowing Through Brass and Wood", "吹响铜管和木管"),
      `Some instruments make music when a player blows into them. They belong to two families: the woodwinds and the brass.

Woodwind instruments include the flute, the clarinet, the oboe and the bassoon. Long ago, they were all made of wood, which gave the family its name, but today many flutes are made of metal. A flute player blows across a hole, the way you can blow across the top of a bottle to make a hooting sound. A clarinet player blows against a thin, flat piece of cane called a reed, which vibrates against the mouthpiece. Players change the pitch by covering holes along the instrument with their fingers or with keys.

Brass instruments include the trumpet, the trombone, the French horn and the tuba. They are made of long metal tubes curled into loops. A brass player presses the lips against a cup-shaped mouthpiece and buzzes them, a little like blowing a raspberry. Players change the pitch by tightening their lips and by pressing buttons called valves. The trombone uses a long slide instead.

In both families, the bigger the instrument, the lower its notes. The tiny piccolo squeaks high above the orchestra, while the giant tuba booms below.`,
      [clues, music, families],
      [
        ask(
          ["How did the woodwind family get its name?", "木管乐器这一家的名字是怎么来的？"],
          ["Long ago its instruments were all made of wood", "很久以前，这一家的乐器都是用木头做的"],
          [
            ["Its players live in the woods", "演奏它的人住在树林里"],
            ["It sounds like wind blowing through trees", "它听起来像风吹过树林"],
            ["It is played only outdoors", "它只在室外演奏"],
          ],
          [
            "The second paragraph says woodwinds were once all made of wood, which gave the family its name.",
            "第二段说，木管乐器以前都是用木头做的，这一家的名字就是这么来的。",
          ],
          [
            ["Living in the woods is not in the passage.", "住在树林里文中没有。"],
            ["Sounding like wind in trees is not the reason given.", "听起来像风吹过树不是文中给的原因。"],
            ["Being played outdoors is not in the passage.", "只在户外演奏文中没有。"],
          ],
        ),
        ask(
          ["How does a brass player make a sound?", "铜管乐手怎样发出声音？"],
          ["By buzzing the lips against a cup-shaped mouthpiece", "把嘴唇贴在杯形吹嘴上振动"],
          [
            ["By blowing across a hole like a flute", "像吹长笛一样对着孔吹气"],
            ["By plucking a string with one finger", "用一根手指拨弦"],
            ["By hitting the tubes with a stick", "用棍子敲打管子"],
          ],
          [
            "The third paragraph says a brass player presses the lips against a cup-shaped mouthpiece and buzzes them.",
            "第三段说，铜管乐手把嘴唇贴在杯形吹嘴上，让嘴唇振动。",
          ],
          [
            ["Blowing across a hole is how a flute works.", "对着孔吹是长笛的方法。"],
            ["Plucking a string is how string players make a short sound.", "拨弦是弦乐手发出短音的方法。"],
            ["Hitting the tubes is not in the passage.", "敲管子文中没有。"],
          ],
        ),
        ask(
          ["Which instrument plays lower notes, the piccolo or the tuba?", "短笛和大号，哪个发出的音更低？"],
          ["The tuba, because it is much bigger", "大号，因为它大得多"],
          [
            ["The piccolo, because it is much smaller", "短笛，因为它小得多"],
            ["The piccolo, because it is made of wood", "短笛，因为它是木头做的"],
            ["They both play the same notes", "它们发出的音一样"],
          ],
          [
            "The last paragraph says the bigger the instrument, the lower its notes, so the giant tuba booms below the tiny piccolo.",
            "最后一段说，乐器越大，音越低，所以巨大的大号在小小的短笛下面低沉地轰鸣。",
          ],
          [
            ["Smaller means higher, so the piccolo plays high.", "越小音越高，所以短笛音高。"],
            ["Being made of wood is not the reason. Size sets the pitch.", "木头做的不是原因。大小决定音高。"],
            ["Playing the same notes is wrong. One squeaks high, one booms low.", "同样的音不对。一个尖高，一个低沉。"],
          ],
        ),
        ask(
          ["What is a reed?", "簧片是什么？"],
          ["A thin, flat piece of cane that vibrates", "一片会振动的薄而扁的藤片"],
          [
            ["A button on a trumpet", "小号上的按键"],
            ["A long metal slide", "一根长长的金属滑管"],
            ["A hole along a flute", "长笛上的孔"],
          ],
          [
            "A clarinet player blows against a thin, flat piece of cane called a reed, which vibrates.",
            "单簧管演奏者吹向一片叫簧片的薄而扁的藤片，簧片会振动。",
          ],
          [
            ["A button on a trumpet is a valve.", "小号上的按钮是活塞。"],
            ["A long metal slide is on a trombone.", "长金属滑管在长号上。"],
            ["A hole along a flute is covered with fingers to change pitch.", "长笛上的孔是用手指按住来改变音高的。"],
          ],
        ),
      ],
      ["French"],
    ),
    passage(
      "the-drum-family",
      t("The Drum Family", "打击乐器家族"),
      `The percussion family is the oldest family of instruments. Percussion instruments make sound when they are hit, shaken or scraped. People have been beating on drums, logs and rocks for many thousands of years.

Some percussion instruments play a pitch, and some do not. A snare drum makes a sharp crack, and a bass drum makes a deep thud, but neither plays a tune. Cymbals crash, tambourines jingle and shakers rattle. Other percussion instruments can play real notes. The xylophone has wooden bars, and the timpani are huge copper drums that a player can tune to different pitches with a foot pedal.

A drum makes its sound when its skin, stretched tightly across the top, is struck. The skin vibrates, and the hollow body of the drum makes the sound bigger. A tighter skin plays a higher sound, and a looser one plays a lower sound.

In an orchestra, the percussion players stand at the back. They often have many instruments to look after and must move quickly from one to the next. A single crash of the cymbals at the right moment can make the whole audience jump.`,
      [clues, music, families, performing],
      [
        ask(
          ["How do percussion instruments make sound?", "打击乐器怎样发出声音？"],
          ["They are hit, shaken or scraped", "人们敲打、摇晃或刮擦它们"],
          [
            ["Players blow into them", "演奏者往里吹气"],
            ["Players draw a bow across them", "演奏者用弓在上面拉"],
            ["They play by themselves", "它们自己会演奏"],
          ],
          [
            "The first paragraph says percussion instruments make sound when they are hit, shaken or scraped.",
            "第一段说，打击乐器在被敲打、摇晃或刮擦时发出声音。",
          ],
          [
            ["Blowing is how woodwinds and brass work.", "吹是木管和铜管的方法。"],
            ["Drawing a bow is how strings work.", "拉弓是弦乐的方法。"],
            ["Playing by themselves is not in the passage.", "自己演奏文中没有。"],
          ],
        ),
        ask(
          ["Which percussion instrument can play different pitches?", "哪种打击乐器能发出不同的音高？"],
          ["The timpani", "定音鼓"],
          [
            ["The snare drum", "小军鼓"],
            ["The bass drum", "大鼓"],
            ["The shaker", "沙锤"],
          ],
          [
            "The second paragraph says the timpani are huge copper drums that a player can tune to different pitches with a foot pedal.",
            "第二段说，定音鼓是巨大的铜鼓，演奏者可以用脚踏板把它调成不同的音高。",
          ],
          [
            ["A snare drum makes a sharp crack but no tune.", "小军鼓发出清脆的响声，但奏不出曲调。"],
            ["A bass drum makes a deep thud but no tune.", "大鼓发出低沉的咚声，但奏不出曲调。"],
            ["A shaker rattles but plays no notes.", "沙锤沙沙响，但奏不出音。"],
          ],
        ),
        ask(
          ["What happens to the sound of a drum when its skin is tighter?", "鼓皮绷得更紧时，鼓声会怎样？"],
          ["It plays a higher sound", "它发出更高的声音"],
          [
            ["It plays a lower sound", "它发出更低的声音"],
            ["It makes no sound at all", "它一点声音也没有"],
            ["It sounds like a cymbal", "它听起来像钹"],
          ],
          [
            "The third paragraph says a tighter skin plays a higher sound, and a looser one plays a lower sound.",
            "第三段说，鼓皮越紧声音越高，越松声音越低。",
          ],
          [
            ["A lower sound comes from a looser skin.", "更低的声音来自更松的鼓皮。"],
            ["No sound at all is wrong. It still vibrates.", "完全没声音不对。它还会振动。"],
            ["Sounding like a cymbal is not in the passage.", "听起来像钹文中没有。"],
          ],
        ),
        ask(
          ["Where do the percussion players stand in an orchestra?", "管弦乐队中打击乐手站在哪里？"],
          ["At the back", "在后面"],
          [
            ["At the front", "在前面"],
            ["In the middle", "在中间"],
            ["Beside the conductor", "在指挥旁边"],
          ],
          ['The text says, "In an orchestra, the percussion players stand at the back."', "短文说：“在管弦乐队中，打击乐手站在后面。”"],
          [
            ["The front is where the strings sit.", "前面是弦乐坐的地方。"],
            ["The middle is for woodwinds.", "中间是木管乐器。"],
            ["Beside the conductor is wrong. The conductor stands in front.", "指挥旁边不对。指挥站在最前面。"],
          ],
        ),
      ],
    ),
    passage(
      "inside-an-orchestra",
      t("Inside an Orchestra", "走进管弦乐团"),
      `An orchestra is a large group of musicians who play together. A full orchestra can have nearly one hundred players, and every one of them has a place on the stage.

The players sit in a curved shape that faces the audience, with the families of instruments grouped together. The strings sit at the front, because there are so many of them. Behind them sit the woodwinds, and behind the woodwinds sit the brass, whose loud sound can carry from the back. The percussion players stand at the very back.

In front of everyone stands the conductor. The conductor does not play an instrument. Instead, he or she holds a thin stick called a baton and moves it to show the beat. With a look or a wave of the hand, the conductor tells each section when to come in, when to play louder or softer, and when to stop.

Before a concert begins, the oboe plays a single note, and all the other players tune their instruments to match it. Then the hall falls silent. The conductor raises the baton, and the music begins. When the last note fades, the audience claps, and the musicians stand and bow.`,
      [clues, music, families, performing],
      [
        ask(
          ["Why do the strings sit at the front of the orchestra?", "为什么弦乐组坐在乐团的最前面？"],
          ["There are so many of them", "因为他们人数很多"],
          [
            ["They are the loudest instruments", "因为它们是声音最响的乐器"],
            ["They arrive at the hall first", "因为他们最早到达音乐厅"],
            ["The conductor plays a string instrument", "因为指挥演奏的是弦乐器"],
          ],
          [
            "The second paragraph says the strings sit at the front because there are so many of them.",
            "第二段说，弦乐组坐在前面，是因为他们人数很多。",
          ],
          [
            ["The loudest is wrong. The brass is loud and sits at the back.", "最响不对。铜管很响，坐在后面。"],
            ["Arriving first is not in the passage.", "最先到达文中没有。"],
            ["The conductor plays no instrument.", "指挥不演奏乐器。"],
          ],
        ),
        ask(
          ["What does the conductor do?", "指挥做些什么？"],
          ["Shows the beat and tells each section when to play", "打出节拍，并告诉每个声部什么时候演奏"],
          [
            ["Plays the loudest drum", "敲最响的鼓"],
            ["Sells tickets to the audience", "向观众卖票"],
            ["Plays the first note on the oboe", "用双簧管吹出第一个音"],
          ],
          [
            "The third paragraph says the conductor moves a baton to show the beat and tells each section when to come in, play louder or softer, and stop.",
            "第三段说，指挥挥动指挥棒打出节拍，并告诉每个声部什么时候进来、什么时候大声或小声、什么时候停下。",
          ],
          [
            ["Playing a drum is wrong. The conductor plays no instrument.", "打鼓不对。指挥不演奏乐器。"],
            ["Selling tickets is not in the passage.", "卖票文中没有。"],
            ["The first note comes from the oboe player, not the conductor.", "第一个音是双簧管乐手吹的，不是指挥。"],
          ],
        ),
        ask(
          ["What happens just before a concert begins?", "音乐会开始前会发生什么？"],
          ["The oboe plays a note, and everyone tunes to match it", "双簧管吹出一个音，大家都照着它调音"],
          [
            ["The audience claps and bows", "观众鼓掌并鞠躬"],
            ["The percussion players move to the front", "打击乐手走到前面"],
            ["The conductor plays a solo", "指挥独奏一曲"],
          ],
          [
            "The last paragraph says that before a concert the oboe plays a single note, and all the other players tune their instruments to match it.",
            "最后一段说，音乐会开始前，双簧管吹出一个音，其他乐手都照着它给乐器调音。",
          ],
          [
            ["Clapping and bowing happen at the end.", "鼓掌和鞠躬是在结束时。"],
            ["Percussion moving to the front is wrong. They stay at the back.", "打击乐手移到前面不对。他们待在后面。"],
            ["A conductor's solo is wrong. The conductor plays no instrument.", "指挥独奏不对。指挥不演奏乐器。"],
          ],
        ),
      ],
    ),
    passage(
      "music-around-the-world",
      t("Music Around the World", "世界各地的音乐"),
      `Every culture on Earth makes music. The instruments may look and sound different, but people everywhere use music to celebrate, to tell stories and to feel close to one another.

In China, the erhu has only two strings and a small round body covered with snakeskin. The player draws a bow between the two strings, and its sound is so sweet and sad that people say it can almost talk. The pipa is a Chinese lute with four strings that the player plucks with quick fingers.

In West Africa, the talking drum is shaped like an hourglass and held under the arm. By squeezing the cords on its sides, a drummer changes its pitch so that it rises and falls like a voice. Long ago, drummers sent messages from village to village this way.

In Australia, the didgeridoo is a long wooden tube that makes a low, humming drone. Players learn a clever trick of breathing in through the nose while they keep blowing out, so the sound never stops.

From the steel drums of the Caribbean to the bagpipes of Scotland, the world is full of music. Listening to it is a way to travel without leaving home.`,
      [clues, music, families, describing],
      [
        ask(
          ["How does a player make the erhu sound?", "演奏者怎样让二胡发出声音？"],
          ["By drawing a bow between its two strings", "在两根弦之间拉动琴弓"],
          [
            ["By plucking four strings with quick fingers", "用灵活的手指拨四根弦"],
            ["By blowing into a long wooden tube", "往一根长长的木管里吹气"],
            ["By squeezing the cords on its sides", "挤压两侧的绳子"],
          ],
          ["The second paragraph says the erhu player draws a bow between the two strings.", "第二段说，二胡演奏者在两根弦之间拉动琴弓。"],
          [
            ["Plucking four strings is the pipa.", "拨四根弦是琵琶。"],
            ["A long wooden tube is the didgeridoo.", "长木管是迪吉里杜管。"],
            ["Squeezing cords is the talking drum.", "挤压绳子是会说话的鼓。"],
          ],
        ),
        ask(
          ["How did drummers in West Africa send messages long ago?", "很久以前，西非的鼓手怎样传递消息？"],
          ["With talking drums whose pitch rose and fell like a voice", "用音高像说话声一样起伏的会说话的鼓"],
          [
            ["By writing letters on drum skins", "在鼓皮上写信"],
            ["By playing the didgeridoo all night", "整夜吹迪吉里杜管"],
            ["By sending the drums to each village", "把鼓送到每个村子"],
          ],
          [
            "The third paragraph says drummers changed the pitch of the talking drum so it rose and fell like a voice, and sent messages from village to village.",
            "第三段说，鼓手改变会说话的鼓的音高，让它像说话声一样起伏，把消息从一个村子传到另一个村子。",
          ],
          [
            ["Writing letters on drum skins is not in the passage.", "在鼓皮上写信文中没有。"],
            ["The didgeridoo is from Australia, not West Africa.", "迪吉里杜管来自澳大利亚，不是西非。"],
            ["Sending the drums is wrong. The sound carried the message.", "把鼓送过去不对。是声音传递了消息。"],
          ],
        ),
        ask(
          ["Why does the sound of a didgeridoo never stop?", "为什么迪吉里杜管的声音从不中断？"],
          ["Players breathe in through the nose while blowing out", "演奏者一边往外吹气，一边用鼻子吸气"],
          [
            ["The tube is very long", "因为管子很长"],
            ["Several players take turns blowing", "因为几个人轮流吹"],
            ["The wind blows through it", "因为风会吹过它"],
          ],
          [
            "The fourth paragraph says players breathe in through the nose while they keep blowing out, so the sound never stops.",
            "第四段说，演奏者一边继续往外吹气，一边用鼻子吸气，所以声音从不中断。",
          ],
          [
            ["A very long tube is true but not why the sound never stops.", "管子很长是真的，但不是声音不停的原因。"],
            ["Players taking turns is not in the passage.", "几个人轮流吹文中没有。"],
            ["The wind blowing through it is not in the passage.", "风吹过它文中没有。"],
          ],
        ),
      ],
      ["Earth", "China", "Chinese", "West", "Africa", "Australia", "Caribbean", "Scotland"],
      ["erhu", "pipa", "didgeridoo"],
    ),
  ],
};
