import { describe, expect, test } from "vitest";
import { loopbackTwin, readConfig } from "./config.ts";

describe("loopbackTwin", () => {
  test("names a site on this machine by its other name", () => {
    expect(loopbackTwin("http://localhost:4700")).toEqual(["http://127.0.0.1:4700"]);
    expect(loopbackTwin("http://127.0.0.1:4700/")).toEqual(["http://localhost:4700"]);
  });

  test("has none for a site elsewhere", () => {
    expect(loopbackTwin("https://greatacademy.dev")).toEqual([]);
  });
});

describe("readConfig", () => {
  test("trusts the site's other name on this machine with the other origins", () => {
    const config = readConfig({
      SITE_URL: "http://localhost:4700",
      OTHER_ORIGINS: "http://192.168.1.20:4700/",
      DATABASE_URL: "postgres://localhost/test",
      BETTER_AUTH_SECRET: "test",
    });
    expect(config.otherOrigins).toEqual(["http://127.0.0.1:4700", "http://192.168.1.20:4700"]);
  });
});
