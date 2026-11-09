/**
 * The app writes dates itself: the runtime's Intl knows English only, so a learner reading Chinese saw English dates.
 * Each function takes the language to write in; times are the device's local time.
 */

/** Lang is a language the app writes dates in. */
export type Lang = "en" | "zh-CN";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

/** monthName names a month, 1 to 12: "Jun" or "June", "6月". */
export function monthName(month: number, style: "short" | "long", lang: Lang): string {
  if (lang === "zh-CN") return `${month}月`;
  const name = MONTHS[month - 1] ?? "";
  return style === "short" ? name.slice(0, 3) : name;
}

/** monthOfYear writes a month of a year: "June 2027", "2027年6月". */
export function monthOfYear(year: number, month: number, lang: Lang): string {
  return lang === "zh-CN" ? `${year}年${month}月` : `${monthName(month, "long", lang)} ${year}`;
}

/** dayText writes a day: "Jun 30, 2027", "2027年6月30日". */
export function dayText(at: Date, lang: Lang): string {
  const year = at.getFullYear();
  const month = at.getMonth() + 1;
  const day = at.getDate();
  return lang === "zh-CN" ? `${year}年${month}月${day}日` : `${monthName(month, "short", lang)} ${day}, ${year}`;
}

/** momentText writes a weekday, a day and a time: "Sunday, Nov 15, 4:00 PM", "11月15日星期日 16:00". */
export function momentText(at: Date, lang: Lang): string {
  const month = at.getMonth() + 1;
  const day = at.getDate();
  const hours = at.getHours();
  const minutes = String(at.getMinutes()).padStart(2, "0");
  if (lang === "zh-CN") return `${month}月${day}日${WEEKDAYS_ZH[at.getDay()]} ${hours}:${minutes}`;
  const half = hours < 12 ? "AM" : "PM";
  return `${WEEKDAYS_EN[at.getDay()]}, ${monthName(month, "short", lang)} ${day}, ${hours % 12 || 12}:${minutes} ${half}`;
}

/** grouped writes a whole number with its thousands grouped: "1,612". */
export function grouped(n: number): string {
  const sign = n < 0 ? "-" : "";
  return sign + String(Math.trunc(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
