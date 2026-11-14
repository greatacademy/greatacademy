# 英语插图

> 给用图像工具生成英语彩色插图的编码智能体的说明：要做什么、每条提示词怎么写、每张图怎么检查并做出小巧的网页文件。[English](english-illustrations.md)。

## 1. 任务

你是在本仓库中工作的编码智能体，有一个能生成图片的工具。你的任务是：§7 中列出、而 `content/english/illustrations/` 中还没有其文件的每张图片，都生成出来，检查、做出网页文件并提交。§6 的两个 WebP 文件都已存在的图片就是做完了，跳过。原图已在 `originals/` 中、但还没有 WebP 文件的图片，只需执行 §6 的第 2 步，不要重新生成。

这些图片是阅读单元的封面和对话的场景。插图只用来营造场景，从不承载答案，所以不必精确表现细节；但不能画错。

按以下顺序工作：

1. 如果 `content/english/illustrations/originals/characters.png` 不存在，先按步骤 2 到 4 制作 §4 的角色表。
2. 对 §7 中每张还没做完的图片，按列出的顺序：写提示词（§2），生成，审核（§5），保存并做出网页文件（§6）。
3. 一批完成后提交（§6），并向用户报告：做了哪些文件、各自多大，以及放弃了哪张图、为什么。

## 2. 写提示词

图像工具在两次调用之间没有记忆，所以每条提示词都要自成一体。按顺序拼接：

1. §3 的风格块，原样不改。
2. 场景中提到的每个角色在 §4 中的那一行，原样不改。
3. §7 的场景，原样不改。

要求横版 1536 × 1024。如果工具接受参考图，凡是提到角色的场景都传入 `content/english/illustrations/originals/characters.png`，本批第一张通过审核的场景也传给之后的每一张，并加上：*Keep the characters exactly as in the reference sheet, and match the style, palette and grain of the reference scene.*

不要增删或改写提示词。如果一张图在 §5 的同一点上反复不合格，可以加一句点明问题的话，比如 *The girl has five fingers on each hand.*

## 3. 风格块

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

提示词用英文，因为图片模型对英文提示的理解最稳定；两种语言的文档共用同一套提示词。

## 4. 角色

面向儿童的课程共用一小组角色，让同样的面孔在各单元反复出现。场景中的名字指以下角色：

```text
Mia: a girl of about 8 with a dark brown bob haircut and bangs, light olive skin, a terracotta dress and white socks with black shoes.
Leo: a boy of about 8 of East Asian heritage with short black hair, a mustard yellow sweater, navy shorts and white sneakers.
Amara: a girl of about 9 with dark brown skin and her hair in two puffs, a teal cardigan over a cream top, and olive trousers.
Ms. Rivera: a teacher in her thirties with her dark hair in a low bun, a mustard cardigan, a navy skirt and round glasses.
Grandpa Wei: a grandfather in his seventies with short grey hair, a dusty blue jacket and a warm smile.
Mr. Okafor: a man in his forties with a short beard, a walnut brown jacket over an olive shirt.
```

角色表的场景，名字是 `characters`：

```text
A character sheet on a plain cream background: Mia, Leo, Amara, Ms. Rivera, Grandpa Wei and Mr. Okafor standing in a row, full body, each facing slightly to the side, evenly spaced, no labels. No text anywhere.
```

场景中的其他人物在场景里另行描述。

## 5. 审核

每张生成的图片保存前都要查看。出现以下情况就重新生成：

- 任何字母、文字、数字或标志，即使模糊或是编造的。
- 手指过多或过少、面部变形、身体姿势不可能。
- 角色与 §4 的描述或角色表不一致。
- 与场景不符的事实错误，比如金字塔形状不对、植物从叶子上长出来、长城没有垛口。
- 任何对幼儿不安全或令人害怕的内容，或对某个民族、某个地方的刻板印象。
- 风格偏离本批：颜色更鲜艳、出现描边、光亮或照片般的质感。
- 不是横版 3:2。

如果工具能编辑图片，小问题就用编辑来修，说明问题所在和要保留的部分。一张图试了三次仍不合格就放弃，并写进报告。

## 6. 文件

每张图片的名字是 `<kind>-<id>`：阅读单元封面的 `kind` 是 `reading`，对话场景的 `kind` 是 `conversation`，`id` 是内容中的 id，这样无需清单就能对应。§7 用原图的文件名列出每张图片。

学习者下载的是网页文件，所以要尽量小：插图只是装饰，页面永远不能等它。每张图片有两个 WebP 网页文件。所有浏览器和两种手机系统都能显示 WebP，对这种扁平插图，它比 PNG 小四到六倍：

| 文件 | 尺寸 | 上限 | 显示位置 |
| :--- | :--- | :--- | :--- |
| `<name>.webp` | 960 × 640 | 80 KB | 单元页或对话页上，与手机屏幕同宽 |
| `<name>.thumb.webp` | 480 × 320 | 30 KB | 课程和单元列表中 |

1. 把生成的原图保存到 `content/english/illustrations/originals/<name>.png`。Git 忽略这个文件夹；原图留在本机，以后要换尺寸或格式时可以重新做网页文件，无需重新生成。
2. 在仓库根目录做出两个网页文件，把 `<name>` 换成图片的名字：

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

   脚本逐步降低质量，直到每个文件不超过上限，并打印最终采用的设置。质量通常是 80；低于 70 说明画面太繁杂。
3. 打开较大的网页文件，与原图对比。如果边缘模糊或颜色变成斑块，说明这张图对这个上限来说太复杂：用更简单的背景重新生成，并写进报告。
4. 一批网页文件（包括角色表的）一起提交，遵循 [AGENTS.md](../AGENTS.md)：`feat(content-english): illustrations of grade 3, reading covers and conversation scenes`。不要提交原图。删除本说明旧版本在 `content/english/illustrations/` 中留下的 PNG。

## 7. 场景

### 7.1 第一批：三年级阅读封面

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

### 7.2 第一批：三年级对话

`conversation-library-help-desk.png`

```text
a bright school library with tall wooden bookshelves and a large arched window onto green trees. Amara stands at the wooden help desk asking a question, and a friendly librarian in a mustard cardigan leans forward to listen, a small stack of books on the desk between them. A few readers sit at tables in the background. All book spines are plain color blocks. No text anywhere.
```

`conversation-fable-for-a-younger-cousin.png`

```text
a living room at bedtime. Mia sits on a sofa telling a story to her younger cousin, a small boy of about five in pajamas who listens with wide eyes, hugging a toy rabbit. Above them, in a soft thought cloud, a tortoise and a hare race along a path. A warm lamp glows. No text anywhere.
```

`conversation-garden-center-plant-advice.png`

```text
a garden center greenhouse full of potted plants on wooden tables. Leo holds a small potted plant and asks a question, while a gardener in a green apron and gloves kneels to his height and points at the plant's leaves and soil. Bags of soil, watering cans and hanging plants around them. Price tags are blank. No text anywhere.
```

`conversation-zookeeper-interview.png`

```text
at a zoo, beside a wide open enclosure where two giraffes eat leaves from a tall tree. Amara holds a notebook with blank pages and asks a question, and a zookeeper in an olive uniform and hat answers, holding a bucket of food. A low wooden fence and grass in front. Signs are blank boards. No text anywhere.
```

`conversation-hiking-trip-weather-check.png`

```text
the start of a mountain trail on a cool morning. Mr. Okafor and Leo, both in hiking boots and backpacks, look up at the sky, where clouds gather over a peak. Leo holds a phone whose screen shows only a sun and cloud shape. Pine trees and a wooden trail marker with a plain arrow and no writing. No text anywhere.
```

`conversation-lost-visitor-directions.png`

```text
a small town square with a fountain, a clock tower, a bakery and a park gate. A tourist with a rolling suitcase and a paper map with no writing looks puzzled, while Mia points down a street to the left. Shop signs are plain shapes, such as a loaf of bread, without words. No text or numbers anywhere, including the clock face, which has only marks.
```

`conversation-egyptian-gallery-guide.png`

```text
a calm museum gallery of ancient Egypt. A painted wooden coffin stands in a glass case, with a stone statue of a seated pharaoh and small clay pots on plinths. A museum guide in a dusty blue blazer gestures toward the coffin while Leo and Amara listen. Walls are decorated with simple patterns only, no hieroglyphs or writing. No text anywhere.
```

`conversation-great-wall-guide.png`

```text
the Great Wall of China winding over green mountain ridges in autumn, with square stone watchtowers along it and battlements on its edges. On the wall in front, a tour guide in a walnut brown jacket points toward a watchtower while Leo and Grandpa Wei look out over the hills. Clear sky. No text anywhere.
```

`conversation-toy-car-ramp-test.png`

```text
a living room floor. Leo kneels beside a ramp made of a wooden board propped on a stack of books, explaining to his little sister, a girl of about five, who lets a small toy car roll down. At the bottom the floor changes from smooth wood to a rug. Small arrows of soft color hint at the car's movement, with no letters. No text anywhere.
```

`conversation-music-shop-first-instrument.png`

```text
a cozy music shop with guitars and ukuleles hanging on the wall, a cello in the corner and a row of small keyboards. Mia holds a ukulele and looks at it closely, while a shop worker with curly hair shows her how to strum. No musical notes, price tags with writing or brand names. No text anywhere.
```

`conversation-poem-for-a-grandparent.png`

```text
Mia at a desk in her bedroom on a video call on a tablet. On the screen, Grandpa Wei smiles and waves from his own room. Through Mia's window, autumn leaves are falling, and she holds a sheet of paper with blank lines, reading aloud. No text anywhere, including on the screen.
```
