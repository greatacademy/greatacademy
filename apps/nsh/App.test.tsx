import { expect, open, test } from "nsh/test";

const url = "http://localhost:5173/api/rpc/ga.catalog.v1.CatalogService";
const json = (body: unknown) => ({ status: 200, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const text = (en: string, zh: string) => ({ values: { en, "zh-CN": zh } });

const network = {
  [`POST ${url}/ListCourses`]: json({
    courses: [
      {
        id: "algebra",
        title: text("Algebra", "代数"),
        description: text("Solve equations", "解方程"),
        subjectTitle: text("Mathematics", "数学"),
        topicCount: 2,
      },
    ],
  }),
  [`POST ${url}/GetCourse`]: json({
    course: {
      id: "algebra",
      title: text("Algebra", "代数"),
      units: [
        {
          title: text("Unit one", "第一单元"),
          modules: [{ title: text("Module one", "第一模块"), topics: [{ id: "linear", title: text("Linear equations", "一次方程") }] }],
        },
      ],
    },
  }),
};

test("opens a course from the list", async () => {
  const app = await open("./App.tsx", { network });
  await app.waitFor("text:2 topics");
  await app.press("text:Solve equations");
  await app.waitFor("text:· Linear equations");
  expect(app.texts()).toContain("Unit one");
});

test("follows a Chinese device", async () => {
  const app = await open("./App.tsx", { network, locale: "zh-Hans-CN" });
  await app.waitFor("text:2 个知识点");
  expect(app.texts()).toContain("代数");
});

test("offers a retry when the call fails", async () => {
  const app = await open("./App.tsx", { network: { [`POST ${url}/ListCourses`]: { status: 503, body: "{}" } } });
  await app.waitFor("text:Retry");
});
