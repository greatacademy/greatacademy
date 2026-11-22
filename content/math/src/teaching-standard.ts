/**
 * taughtCourses lists the courses written to the teaching standard (docs/content.md §4, "Teaching, not stating"):
 * every topic has an introduction, every explanation ends with a callout on its typical mistake, and solutions are
 * worked step by step and check their answer. Its test holds every topic of these courses to it.
 */
export const taughtCourses: readonly string[] = ["algebra-i", "geometry"];

/**
 * taughtTopics lists further topics written to the standard while their course is still being rewritten; once the
 * course is listed in taughtCourses, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
];
