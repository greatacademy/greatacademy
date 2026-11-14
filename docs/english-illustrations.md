# English Illustrations

> How the color illustrations of English are made with ChatGPT: the style, the recurring characters, the prompts and the review. [简体中文](english-illustrations.zh-CN.md).

## 1. Where Illustrations Go

Color illustrations make the cover of a reading unit and the scene of a conversation. An illustration sets a scene; it never carries an answer. No problem may depend on a detail of one, because a generated picture can be wrong in small ways that a reviewer misses.

## 2. Using ChatGPT

1. **One chat per batch.** Start a new chat for each batch below and paste the style block of §3 as its first message, with the words: *Use this style for every image in this chat. Reply "Ready" and wait.*
2. **Characters first.** In the same chat, generate the character sheet of §4 before any scene. When it is right, attach it to each later message that shows those characters and add: *Keep the characters exactly as in the attached sheet.*
3. **One image per message.** Paste one prompt of §6 at a time. Each prompt is complete on its own, so a prompt can also be pasted into a fresh chat after the style block.
4. **Keep the style.** After the first scene that looks right, attach it to later messages as well, with: *Match the style, palette and grain of the attached image.*
5. **Size.** Landscape 3:2 (1536 × 1024) for every cover and scene. Ask again if ChatGPT returns another shape.
6. **A smaller file.** A generated PNG of that size is usually 2 to 3 MB. That is too much for a learner on a phone, and no wording in the image prompt makes it smaller. So once an image passes the review of §5, send this in the same chat, with `{name}` replaced by the file name of §6:

   ```text
   Make a smaller copy of the last image for the web. Use Python with Pillow: resize it to 1200 × 800 pixels with LANCZOS, reduce it to 96 colors, and save it as an optimized PNG named {name}. If the file is larger than 300 KB, use 64 colors instead. Tell me the final size in KB and give me the file to download.
   ```

   Open the copy at full size and compare it with the original. If the colors band or the grain turns blotchy, ask again with 128 colors, as long as the file stays within 300 KB.
7. **Fixing an image.** Name the fault and what to keep: *Keep everything, but give the girl five fingers on each hand and remove the letters on the book spines.* Regenerate from the prompt when a fix makes it worse.

## 3. The Style Block

Paste this, unchanged, as the first message of every chat:

```text
Style for every image in this chat:
Mid-century modern children's book illustration. Flat shapes with soft edges and no outlines.
A warm, muted palette: mustard yellow, terracotta red, olive and teal green, dusty blue, warm cream and walnut brown, with deep navy for the darkest shadows.
A very fine, faint paper grain over the whole image. Soft daylight, gentle long shadows, calm and friendly mood.
Simple, rounded figures with small dot eyes and simple faces; natural proportions for adults, slightly larger heads for children.
People of many backgrounds, shown with respect and without stereotypes.
Absolutely no text: no letters, words, numbers, logos or signs with writing anywhere, including book spines, posters, maps and screens. Where writing would appear, use plain color blocks or simple lines.
No brands, no real people, no copyrighted characters.
Landscape format, 3:2.
```

The prompts stay in English: image models follow English prompts most reliably, and so both versions of this document share one set of prompts.

## 4. Recurring Characters

The courses for children share a small cast, so that the same faces return across units. Generate this sheet first:

```text
Character sheet in the style above, on a plain cream background, each character standing in a row, full body, facing slightly to the side, no labels:
1. Mia, a girl of about 8 with a dark brown bob haircut and bangs, light olive skin, a terracotta dress and white socks with black shoes.
2. Leo, a boy of about 8 of East Asian heritage with short black hair, a mustard yellow sweater, navy shorts and white sneakers.
3. Amara, a girl of about 9 with dark brown skin and her hair in two puffs, a teal cardigan over a cream top, and olive trousers.
4. Ms. Rivera, a teacher in her thirties with her dark hair in a low bun, a mustard cardigan, a navy skirt and round glasses.
5. Grandpa Wei, a grandfather in his seventies with short grey hair, a dusty blue jacket and a warm smile.
6. Mr. Okafor, a man in his forties with a short beard, a walnut brown jacket over an olive shirt.
```

In the prompts below, a name means that character as on the sheet. Other people in a scene are described in the prompt.

## 5. Review

Every image is checked before it is used. Reject or fix one that has:

- Any letters, words, numbers or logo, even blurred or invented ones.
- Hands with too many or too few fingers, faces that are distorted, or bodies at impossible angles.
- A character that does not match the sheet.
- A fact that is wrong for the theme, such as a pyramid of the wrong shape, a plant growing from its leaves, or the Great Wall without battlements.
- Anything unsafe or frightening for a young child, or a stereotype of a people or a place.
- A style that drifts from the batch: brighter colors, outlines, a glossy or photographic look.

## 6. Prompts

Each file is named `<kind>-<id>.png`, where `kind` is `reading` for the cover of a reading unit and `conversation` for the scene of a conversation, and `id` is the id in the content, so that it can be matched without a list. Save the smaller copy of §2 under that name: a PNG of 1200 × 800 pixels and at most 300 KB. Keep ChatGPT's original next to it as `<kind>-<id>.original.png`, in case the image is needed again at another size.

### 6.1 Batch 1: Grade 3 Reading Units

`reading-stories-and-fables.png`

```text
Using the style of this chat: a cozy reading corner in a classroom. Mia sits on a large cushion with an open picture book on her lap, and around her, as if rising from the pages, float soft shapes of a tortoise, a hare, a fox and a crow with a piece of cheese, all in the same flat style. A low bookshelf with books whose spines are plain color blocks. Warm afternoon light from a window. No text anywhere.
```

`reading-how-plants-live.png`

```text
Using the style of this chat: Leo and Amara kneel at a school vegetable garden in spring, watering young bean plants climbing up bamboo canes. Beside them, a clear glass jar shows a bean seed with its roots growing down and a shoot growing up. Sunflowers at the back, a watering can, a few bees. Soft morning sun. No text anywhere.
```

`reading-how-animals-survive.png`

```text
Using the style of this chat: a wide nature scene split gently into three habitats from left to right: a snowy forest with an arctic fox curled in its thick white coat, a desert with a camel resting by a cactus, and a green pond with a frog on a lily pad and a heron standing in the reeds. Mia stands at the front with binoculars, seen from behind. No text anywhere.
```

`reading-weather-and-climate.png`

```text
Using the style of this chat: a school rooftop weather station. Amara reads a simple rain gauge while Leo points at a wind vane on a pole; a thermometer is fixed to a white box. In the sky, the weather changes from left to right: sun, then fluffy clouds, then a grey rain cloud with a soft rainbow at its edge. No text or numbers anywhere; the instruments have plain marks only.
```

`reading-our-world-on-a-map.png`

```text
Using the style of this chat: Ms. Rivera and three children, including Mia and Leo, lean over a large paper map spread on a classroom table. The map shows a coastline, a river, green hills, a forest and a small town drawn as tiny houses, with a compass rose made only of a star shape and arrows. A globe stands at the edge of the table. The map has no words, letters or numbers at all.
```

`reading-life-on-the-nile.png`

```text
Using the style of this chat: ancient Egypt by the river Nile. Farmers in white linen tunics work green fields along the riverbank, one using a shaduf, a long wooden pole with a bucket, to lift water from the river. A wooden boat with a square sail floats on the blue water. In the distance, three smooth-sided pyramids stand on the golden desert under a clear sky. Accurate, respectful clothing and tools. No hieroglyphs or text anywhere.
```

`reading-along-the-yellow-river.png`

```text
Using the style of this chat: the Yellow River in China winding through a wide valley of terraced yellow loess hills. Cave homes are dug into a hillside with arched wooden doors and windows, and a farmer leads an ox along a path. A traditional waterwheel turns at the river's edge. Further away the river widens into a broad, muddy, golden-brown stream. Soft evening light. No text anywhere.
```

`reading-pushes-pulls-and-magnets.png`

```text
Using the style of this chat: a bright classroom science table. Leo holds a red and grey horseshoe magnet that lifts a chain of paper clips, while Amara pushes a toy car down a wooden ramp onto a strip of carpet. A tug-of-war rope lies coiled on the floor, and small metal and wooden objects are sorted into two trays. No text anywhere.
```

`reading-the-world-of-music.png`

```text
Using the style of this chat: a school music room. Children play different instruments together: Mia plays a violin, Leo strikes a small drum, Amara plays a wooden recorder, and another child plays a xylophone. Ms. Rivera conducts with a raised hand. A piano stands at the side, and soft curving lines in the air suggest sound, without any musical notes or symbols. No text anywhere.
```

`reading-poems-for-all-seasons.png`

```text
Using the style of this chat: one tree shown through four seasons in a single landscape, left to right: blossom in spring, full green leaves in summer, orange and red leaves falling in autumn, and bare branches with snow in winter. Under the tree, Mia sits with a notebook whose pages are blank, looking up and thinking. No text anywhere.
```

### 6.2 Batch 1: Grade 3 Conversations

`conversation-library-help-desk.png`

```text
Using the style of this chat: a bright school library with tall wooden bookshelves and a large arched window onto green trees. Amara stands at the wooden help desk asking a question, and a friendly librarian in a mustard cardigan leans forward to listen, a small stack of books on the desk between them. A few readers sit at tables in the background. All book spines are plain color blocks. No text anywhere.
```

`conversation-fable-for-a-younger-cousin.png`

```text
Using the style of this chat: a living room at bedtime. Mia sits on a sofa telling a story to her younger cousin, a small boy of about five in pajamas who listens with wide eyes, hugging a toy rabbit. Above them, in a soft thought cloud, a tortoise and a hare race along a path. A warm lamp glows. No text anywhere.
```

`conversation-garden-center-plant-advice.png`

```text
Using the style of this chat: a garden center greenhouse full of potted plants on wooden tables. Leo holds a small potted plant and asks a question, while a gardener in a green apron and gloves kneels to his height and points at the plant's leaves and soil. Bags of soil, watering cans and hanging plants around them. Price tags are blank. No text anywhere.
```

`conversation-zookeeper-interview.png`

```text
Using the style of this chat: at a zoo, beside a wide open enclosure where two giraffes eat leaves from a tall tree. Amara holds a notebook with blank pages and asks a question, and a zookeeper in an olive uniform and hat answers, holding a bucket of food. A low wooden fence and grass in front. Signs are blank boards. No text anywhere.
```

`conversation-hiking-trip-weather-check.png`

```text
Using the style of this chat: the start of a mountain trail on a cool morning. Mr. Okafor and Leo, both in hiking boots and backpacks, look up at the sky, where clouds gather over a peak. Leo holds a phone whose screen shows only a sun and cloud shape. Pine trees and a wooden trail marker with a plain arrow and no writing. No text anywhere.
```

`conversation-lost-visitor-directions.png`

```text
Using the style of this chat: a small town square with a fountain, a clock tower, a bakery and a park gate. A tourist with a rolling suitcase and a paper map with no writing looks puzzled, while Mia points down a street to the left. Shop signs are plain shapes, such as a loaf of bread, without words. No text or numbers anywhere, including the clock face, which has only marks.
```

`conversation-egyptian-gallery-guide.png`

```text
Using the style of this chat: a calm museum gallery of ancient Egypt. A painted wooden coffin stands in a glass case, with a stone statue of a seated pharaoh and small clay pots on plinths. A museum guide in a dusty blue blazer gestures toward the coffin while Leo and Amara listen. Walls are decorated with simple patterns only, no hieroglyphs or writing. No text anywhere.
```

`conversation-great-wall-guide.png`

```text
Using the style of this chat: the Great Wall of China winding over green mountain ridges in autumn, with square stone watchtowers along it and battlements on its edges. On the wall in front, a tour guide in a walnut brown jacket points toward a watchtower while Leo and Grandpa Wei look out over the hills. Clear sky. No text anywhere.
```

`conversation-toy-car-ramp-test.png`

```text
Using the style of this chat: a living room floor. Leo kneels beside a ramp made of a wooden board propped on a stack of books, explaining to his little sister, a girl of about five, who lets a small toy car roll down. At the bottom the floor changes from smooth wood to a rug. Small arrows of soft color hint at the car's movement, with no letters. No text anywhere.
```

`conversation-music-shop-first-instrument.png`

```text
Using the style of this chat: a cozy music shop with guitars and ukuleles hanging on the wall, a cello in the corner and a row of small keyboards. Mia holds a ukulele and looks at it closely, while a shop worker with curly hair shows her how to strum. No musical notes, price tags with writing or brand names. No text anywhere.
```

`conversation-poem-for-a-grandparent.png`

```text
Using the style of this chat: Mia at a desk in her bedroom on a video call on a tablet. On the screen, Grandpa Wei smiles and waves from his own room. Through Mia's window, autumn leaves are falling, and she holds a sheet of paper with blank lines, reading aloud. No text anywhere, including on the screen.
```
