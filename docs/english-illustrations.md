# English Illustrations

> Instructions for the coding agent that generates the color illustrations of English with its image tool: what to make, how to write each prompt, how to check each image and make its small web files. [简体中文](english-illustrations.zh-CN.md).

## 1. The Task

You are a coding agent working in this repository, with a tool that generates images. Your task is to make every image listed in §7 whose files do not exist yet in `content/english/illustrations/`, check it, make its web files and commit them. An image whose two WebP files of §6 exist is done; skip it. An image whose original exists in `originals/` but whose WebP files do not needs only step 2 of §6, not a new generation.

The images are the covers of reading units and the scenes of conversations. An illustration sets a scene and never carries an answer, so it never has to show a detail precisely; but it must not show anything wrong.

Work in this order:

1. If `content/english/illustrations/originals/characters.png` is missing, make the character sheet of §4 first, through steps 2 to 4.
2. For each image of §7 that is not done, in the order listed: write its prompt (§2), generate it, review it (§5), and save it and make its web files (§6).
3. When a batch is done, commit it (§6) and report to the user: the files made, the size of each, and any image you gave up on, with why.

## 2. Writing a Prompt

The image tool keeps no memory between calls, so every prompt is complete in itself. Join, in this order:

1. The style block of §3, unchanged.
2. The line of §4 for each character the scene names, unchanged.
3. The scene of §7, unchanged.

Ask for landscape 1536 × 1024. If the tool accepts reference images, pass `content/english/illustrations/originals/characters.png` with every scene that names a character, and the first scene of the batch that passed review with every later one, and add: *Keep the characters exactly as in the reference sheet, and match the style, palette and grain of the reference scene.*

Only the characters a scene names may look like the cast. Every other person in a scene is described in the scene itself, and must not share a cast member's face, hair or clothes: a librarian is not Ms. Rivera in another room.

Do not add to a prompt or reword it. If an image keeps failing the same point of §5, you may add one sentence that names the fault, such as *The girl has five fingers on each hand.*

## 3. The Style Block

```text
Mid-century modern children's book illustration. Flat shapes with soft edges and no outlines.
A warm, muted palette: mustard yellow, terracotta red, olive and teal green, dusty blue, warm cream and walnut brown, with deep navy for the darkest shadows.
A very fine, faint paper grain over the whole image. Soft daylight, gentle long shadows, calm and friendly mood.
Simple, rounded figures with small dot eyes and simple faces; natural proportions for adults, slightly larger heads for children.
People of many backgrounds, shown with respect and without stereotypes.
Absolutely no text: no letters, words, numbers, logos or signs with writing anywhere, including book spines, posters, maps and screens. Where writing would appear, use plain color blocks or simple lines.
No brands, no real people, no copyrighted characters.
Landscape format, 3:2.
```

The prompts are in English, because image models follow English prompts most reliably; both versions of this document share them.

## 4. The Cast

The courses for children share a small cast, so that the same faces return across units. A name in a scene means that character:

```text
Mia: a girl of about 8 with a dark brown bob haircut and bangs, light olive skin, a terracotta dress and white socks with black shoes.
Leo: a boy of about 8 of East Asian heritage with short black hair, a mustard yellow sweater, navy shorts and white sneakers.
Amara: a girl of about 9 with dark brown skin and her hair in two puffs, a teal cardigan over a cream top, and olive trousers.
Ms. Rivera: a teacher in her thirties with her dark hair in a low bun, a mustard cardigan, a navy skirt and round glasses.
Grandpa Wei: a grandfather in his seventies with short grey hair, a dusty blue jacket and a warm smile.
Mr. Okafor: a man in his forties with a short beard, a walnut brown jacket over an olive shirt.
```

The scene of the character sheet, whose name is `characters`:

```text
A character sheet on a plain cream background: Mia, Leo, Amara, Ms. Rivera, Grandpa Wei and Mr. Okafor standing in a row, full body, each facing slightly to the side, evenly spaced, no labels. No text anywhere.
```

Other people in a scene are described in the scene itself.

## 5. Review

Look at every generated image before saving it. Generate it again if it has:

- Any letters, words, numbers or logo, even blurred or invented ones.
- Hands with too many or too few fingers, faces that are distorted, or bodies at impossible angles.
- A character that does not match the line of §4 or the character sheet.
- A fact that is wrong for the scene, such as a pyramid of the wrong shape, a plant growing from its leaves, or the Great Wall without battlements.
- Anything unsafe or frightening for a young child, or a stereotype of a people or a place.
- A style that drifts from the batch: brighter colors, outlines, a glossy or photographic look.
- A shape other than landscape 3:2.

If the tool can edit an image, fix a small fault by editing, naming the fault and what to keep. Give up on an image after three failed tries, and name it in your report.

## 6. Files

Each image has a name `<kind>-<id>`, where `kind` is `reading` for the cover of a reading unit and `conversation` for the scene of a conversation, and `id` is the id in the content, so that it can be matched without a list. §7 lists each image by the file name of its original.

Learners download the web files, so they are kept small: an illustration is decoration, and a page must never wait for it. Each image has two web files in WebP, which every browser and both phone systems display and which is four to six times smaller than PNG for these flat pictures:

| File | Size | Limit | Shown |
| :--- | :--- | :--- | :--- |
| `<name>.webp` | 960 × 640 | 80 KB | On the page of a unit or a conversation, as wide as a phone screen |
| `<name>.thumb.webp` | 480 × 320 | 30 KB | In lists of courses and units |

1. Save the image as generated to `content/english/illustrations/originals/<name>.png`. Git ignores that folder; the originals stay on this machine, so that the web files can be made again at another size or in another format without generating anything.
2. Make the two web files from the root of the repository, with `<name>` replaced by the image's name:

   ```bash
   mise exec -- uv run --no-project --with pillow==11.3.0 python - <name> <<'EOF'
   import os, sys
   from PIL import Image
   folder, name = "content/english/illustrations", sys.argv[1]
   original = Image.open(f"{folder}/originals/{name}.png").convert("RGB")
   for width, limit, suffix in ((960, 80_000, ".webp"), (480, 30_000, ".thumb.webp")):
       path = f"{folder}/{name}{suffix}"
       image = original.resize((width, width * 2 // 3), Image.Resampling.LANCZOS)
       for quality in (80, 75, 70, 65, 60):
           image.save(path, "WEBP", quality=quality, method=6)
           if os.path.getsize(path) <= limit:
               break
       print(f"{path}: {width} × {width * 2 // 3}, quality {quality}, {os.path.getsize(path) // 1000} KB")
   EOF
   ```

   The script lowers the quality step by step until each file fits its limit, and prints what it used. A quality of 80 is usual; one below 70 means the picture is busy.
3. Open the larger web file and compare it with the original. If edges blur or the colors turn blotchy, the picture is too detailed for the limit: generate it again with a simpler background, and say so in the report.
4. Commit the web files of a batch, the character sheet's included, in one commit, following [AGENTS.md](../AGENTS.md): `feat(content-english): illustrations of grade 3, reading covers and conversation scenes`. Do not commit the originals. Delete any PNG left in `content/english/illustrations/` by an earlier version of this guide.

## 7. Scenes

### 7.1 Batch 1: Grade 3 Reading Covers

`reading-stories-and-fables.png`

```text
a cozy reading corner in a classroom. Mia sits on a large cushion with an open picture book on her lap, and around her, as if rising from the pages, float soft shapes of a tortoise, a hare, a fox and a crow with a piece of cheese, all in the same flat style. A low bookshelf with books whose spines are plain color blocks. Warm afternoon light from a window. No text anywhere.
```

`reading-how-plants-live.png`

```text
Leo and Amara kneel at a school vegetable garden in spring, watering young bean plants climbing up bamboo canes. Beside them, a clear glass jar shows a bean seed with its roots growing down and a shoot growing up. Sunflowers at the back, a watering can, a few bees. Soft morning sun. No text anywhere.
```

`reading-how-animals-survive.png`

```text
a wide nature scene split gently into three habitats from left to right: a snowy forest with an arctic fox curled in its thick white coat, a desert with a camel resting by a cactus, and a green pond with a frog on a lily pad and a heron standing in the reeds. Mia stands at the front with binoculars, seen from behind. No text anywhere.
```

`reading-weather-and-climate.png`

```text
a school rooftop weather station. Amara reads a simple rain gauge while Leo points at a wind vane on a pole; a thermometer is fixed to a white box. In the sky, the weather changes from left to right: sun, then fluffy clouds, then a grey rain cloud with a soft rainbow at its edge. No text or numbers anywhere; the instruments have plain marks only.
```

`reading-our-world-on-a-map.png`

```text
Ms. Rivera and three children, including Mia and Leo, lean over a large paper map spread on a classroom table. The map shows a coastline, a river, green hills, a forest and a small town drawn as tiny houses, with a compass rose made only of a star shape and arrows. A globe stands at the edge of the table. The map has no words, letters or numbers at all.
```

`reading-life-on-the-nile.png`

```text
ancient Egypt by the river Nile. Farmers in white linen tunics work green fields along the riverbank, one using a shaduf, a long wooden pole with a bucket, to lift water from the river. A wooden boat with a square sail floats on the blue water. In the distance, three smooth-sided pyramids stand on the golden desert under a clear sky. Accurate, respectful clothing and tools. No hieroglyphs or text anywhere.
```

`reading-along-the-yellow-river.png`

```text
the Yellow River in China winding through a wide valley of terraced yellow loess hills. Cave homes are dug into a hillside with arched wooden doors and windows, and a farmer leads an ox along a path. A traditional waterwheel turns at the river's edge. Further away the river widens into a broad, muddy, golden-brown stream. Soft evening light. No text anywhere.
```

`reading-pushes-pulls-and-magnets.png`

```text
a bright classroom science table. Leo holds a red and grey horseshoe magnet that lifts a chain of paper clips, while Amara pushes a toy car down a wooden ramp onto a strip of carpet. A tug-of-war rope lies coiled on the floor, and small metal and wooden objects are sorted into two trays. No text anywhere.
```

`reading-the-world-of-music.png`

```text
a school music room. Children play different instruments together: Mia plays a violin, Leo strikes a small drum, Amara plays a wooden recorder, and another child plays a xylophone. Ms. Rivera conducts with a raised hand. A piano stands at the side, and soft curving lines in the air suggest sound, without any musical notes or symbols. No text anywhere.
```

`reading-poems-for-all-seasons.png`

```text
one tree shown through four seasons in a single landscape, left to right: blossom in spring, full green leaves in summer, orange and red leaves falling in autumn, and bare branches with snow in winter. Under the tree, Mia sits with a notebook whose pages are blank, looking up and thinking. No text anywhere.
```

### 7.2 Batch 1: Grade 3 Conversations

`conversation-library-help-desk.png`

```text
a bright school library with tall wooden bookshelves and a large arched window onto green trees. Amara stands at the wooden help desk asking a question, and a friendly librarian, a tall woman in her fifties with short curly grey hair and a dark green dress, leans forward to listen, a small stack of books on the desk between them. A few adult readers, none of them from the character sheet, sit at tables in the background. All book spines are plain color blocks. No text anywhere.
```

`conversation-fable-for-a-younger-cousin.png`

```text
a living room at bedtime. Mia sits on a sofa telling a story to her younger cousin, a small boy of about five in pajamas who listens with wide eyes, hugging a toy rabbit. Above them, in a soft thought cloud, a tortoise and a hare race along a path. A warm lamp glows. No text anywhere.
```

`conversation-garden-center-plant-advice.png`

```text
a garden center greenhouse full of potted plants on wooden tables. Leo holds a small potted plant and asks a question, while a gardener, an older man with a white moustache in a green apron and gloves, kneels to his height and points at the plant's leaves and soil. Bags of soil, watering cans and hanging plants around them. Price tags are blank. No text anywhere.
```

`conversation-zookeeper-interview.png`

```text
at a zoo, beside a wide open enclosure where two giraffes eat leaves from a tall tree. Amara holds a notebook with blank pages and asks a question, and a zookeeper, a young woman with a short blonde ponytail in a khaki uniform and hat, answers, holding a bucket of food. A low wooden fence and grass in front. Signs are blank boards. No text anywhere.
```

`conversation-hiking-trip-weather-check.png`

```text
the start of a mountain trail on a cool morning. Mr. Okafor and Leo, both in hiking boots and backpacks, look up at the sky, where clouds gather over a peak. Leo holds a phone whose screen shows only a sun and cloud shape. Pine trees and a wooden trail marker with a plain arrow and no writing. No text anywhere.
```

`conversation-lost-visitor-directions.png`

```text
a small town square with a fountain, a clock tower, a bakery and a park gate. A tourist, a tall man with a grey ponytail and a red backpack, holds a rolling suitcase and a paper map with no writing and looks puzzled, while Mia points down a street to the left. Shop signs are plain shapes, such as a loaf of bread, without words. No text or numbers anywhere, including the clock face, which has only marks.
```

`conversation-egyptian-gallery-guide.png`

```text
a calm museum gallery of ancient Egypt. A painted wooden coffin stands in a glass case, with a stone statue of a seated pharaoh and small clay pots on plinths. A museum guide, a young man with curly red hair and a cream sweater, gestures toward the coffin while Leo and Amara listen. Walls are decorated with simple patterns only, no hieroglyphs or writing. No text anywhere.
```

`conversation-great-wall-guide.png`

```text
the Great Wall of China winding over green mountain ridges in autumn, with square stone watchtowers along it and battlements on its edges. On the wall in front, a tour guide, a young woman with a long black braid and a red windbreaker, points toward a watchtower while Leo and Grandpa Wei look out over the hills. Clear sky. No text anywhere.
```

`conversation-toy-car-ramp-test.png`

```text
a living room floor. Leo kneels beside a ramp made of a wooden board propped on a stack of books, explaining to his little sister, a girl of about five, who lets a small toy car roll down. At the bottom the floor changes from smooth wood to a rug. Small arrows of soft color hint at the car's movement, with no letters. No text anywhere.
```

`conversation-music-shop-first-instrument.png`

```text
a cozy music shop with guitars and ukuleles hanging on the wall, a cello in the corner and a row of small keyboards. Mia holds a ukulele and looks at it closely, while a shop worker, a young man with curly blond hair and a teal T-shirt, shows her how to strum. No musical notes, price tags with writing or brand names. No text anywhere.
```

`conversation-poem-for-a-grandparent.png`

```text
Mia at a desk in her bedroom on a video call on a tablet. On the screen, Grandpa Wei smiles and waves from his own room. Through Mia's window, autumn leaves are falling, and she holds a sheet of paper with blank lines, reading aloud. No text anywhere, including on the screen.
```
