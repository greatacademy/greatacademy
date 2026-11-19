// The whole books of the native grades (docs/chinese-curriculum.md §9), in grade order.

import { earlyBooks } from "./early.ts";
import type { BookData } from "./index.ts";
import { laterBooks } from "./later.ts";

/** books are the whole books, grades 3 to 6 and then 7 to 10. */
export const books: readonly BookData[] = [...earlyBooks, ...laterBooks];
