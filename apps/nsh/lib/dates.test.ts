import { expect, test } from "nsh/test";
import { dayText, grouped, momentText, monthName, monthOfYear } from "./dates.ts";

const at = new Date(2026, 10, 15, 16, 5);
test("dates write a day in each language", () => {
  expect(dayText(at, "en")).toBe("Nov 15, 2026");
  expect(dayText(at, "zh-CN")).toBe("2026年11月15日");
});
test("dates write a moment in each language", () => {
  expect(momentText(at, "en")).toBe("Sunday, Nov 15, 4:05 PM");
  expect(momentText(at, "zh-CN")).toBe("11月15日星期日 16:05");
  expect(momentText(new Date(2026, 10, 15, 0, 0), "en")).toBe("Sunday, Nov 15, 12:00 AM");
});
test("dates name months", () => {
  expect(monthName(6, "short", "en")).toBe("Jun");
  expect(monthName(6, "long", "zh-CN")).toBe("6月");
  expect(monthOfYear(2027, 6, "en")).toBe("June 2027");
  expect(monthOfYear(2027, 6, "zh-CN")).toBe("2027年6月");
});
test("dates group thousands", () => {
  expect(grouped(1612)).toBe("1,612");
  expect(grouped(23)).toBe("23");
  expect(grouped(1234567)).toBe("1,234,567");
});
