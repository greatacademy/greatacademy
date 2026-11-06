import { Code, ConnectError } from "@connectrpc/connect";
import { describe, expect, it } from "vitest";

import { isNotEnrolled, isNotFound, shouldRetry } from "./rpc.ts";

const notFound = new ConnectError("unknown course", Code.NotFound);
const notEnrolled = new ConnectError("not enrolled", Code.FailedPrecondition);
const unavailable = new ConnectError("try later", Code.Unavailable);

describe("isNotFound", () => {
  it("recognizes only the code for what does not exist", () => {
    expect(isNotFound(notFound)).toBe(true);
    expect(isNotFound(unavailable)).toBe(false);
    expect(isNotFound(new Error("network"))).toBe(false);
  });
});

describe("isNotEnrolled", () => {
  it("recognizes only the code for a missing enrollment", () => {
    expect(isNotEnrolled(notEnrolled)).toBe(true);
    expect(isNotEnrolled(notFound)).toBe(false);
    expect(isNotEnrolled(new Error("network"))).toBe(false);
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

  it("does not ask again before the learner enrolls", () => {
    expect(shouldRetry(0, notEnrolled)).toBe(false);
  });
});
