import { writeFileSync } from "node:fs";

import { themeCss } from "../src/web.ts";

writeFileSync(new URL("../theme.css", import.meta.url), themeCss());
