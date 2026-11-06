import { Code, ConnectError } from "@connectrpc/connect";
import { describe, expect, it } from "vitest";

import { isNotFound, shouldRetry } from "./rpc.ts";

const notFound = new ConnectError("unknown course", Code.NotFound);
const unavailable = new ConnectError("try later", Code.Unavailable);

describe("isNotFound", () => {
  it("recognizes only the code for what does not exist", () => {
    expect(isNotFound(notFound)).toBe(true);
    expect(isNotFound(unavailable)).toBe(false);
    expect(isNotFound(new Error("network"))).toBe(false);
  });
});

describe("shouldRetry", () => {
  it("retries a failure once", () => {
    expect(shouldRetry(0, unavailable)).toBe(true);
    expect(shouldRetry(1, unavailable)).toBe(false);
  });

  it("does not ask again for what does not exist", () => {
    expect(shouldRetry(0, notFound)).toBe(false);
  });
});
