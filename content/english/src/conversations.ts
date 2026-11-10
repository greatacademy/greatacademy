import type { ConversationDef } from "@ga/content";
import { t } from "@ga/content";

/**
 * englishConversations are the spoken conversations of S6. The first one is a
 * test of the voice service end to end; its rubric is calibrated in E5.12.
 */
export const englishConversations: readonly ConversationDef[] = [
  {
    id: "library-help-desk",
    title: t("At the library help desk", "在图书馆服务台"),
    task: t(
      "You need a book for a school project. Tell the librarian your topic, ask for a book about it, and find out when you must bring it back.",
      "你需要一本书来完成学校的课题。告诉图书管理员你的课题，请他帮你找一本相关的书，并问清楚什么时候要还书。",
    ),
    scenario: [
      "You are the librarian at the help desk of a school library. The learner is a student who comes to the desk.",
      "The learner's task: say what their project is about, ask for a book on it, and find out when the book is due back.",
      "Help them as a librarian would: ask what the project is about if they have not said, suggest one or two books with simple made-up titles on their topic, and ask which one they want.",
      "If they do not ask when the book is due, wait one turn, then ask whether they have any other questions.",
      "Books are due back in two weeks. Library cards are not needed.",
      "When they have their book and know when it is due, wish them luck with the project and end the conversation.",
    ].join("\n"),
    opening: "Hello! Welcome to the library. How can I help you today?",
    minutes: 4,
  },
];
