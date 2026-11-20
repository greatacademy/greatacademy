// Guardians' signed forms, kept in the R2 bucket ga-guardian-forms through its S3-compatible API, with an R2 API token
// that may read and write that bucket only (docs/architecture.md §6).

import type { FormStore } from "@ga/api";
import { AwsClient } from "aws4fetch";

/** R2Bucket names an R2 bucket and the S3 credentials of a token that may use it. */
export interface R2Bucket {
  readonly accountId: string;
  readonly bucket: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
}

/** r2Forms keeps forms as objects of an R2 bucket, each under its key. */
export function r2Forms(r2: R2Bucket, fetcher: typeof fetch = fetch): FormStore {
  const aws = new AwsClient({
    accessKeyId: r2.accessKeyId,
    secretAccessKey: r2.secretAccessKey,
    service: "s3",
    region: "auto",
    retries: 2,
  });
  const url = (key: string) =>
    `https://${r2.accountId}.r2.cloudflarestorage.com/${r2.bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;
  const send = async (key: string, init: RequestInit, ok: (status: number) => boolean) => {
    const res = await fetcher(await aws.sign(url(key), init));
    if (!ok(res.status)) throw new Error(`R2 ${init.method} of a form failed with status ${res.status}`);
    return res;
  };
  return {
    async put(key, form, contentType) {
      await send(key, { method: "PUT", body: form, headers: { "content-type": contentType } }, (s) => s === 200);
    },
    async get(key) {
      const res = await send(key, { method: "GET" }, (s) => s === 200 || s === 404);
      return res.status === 404 ? undefined : new Uint8Array(await res.arrayBuffer());
    },
    async delete(key) {
      await send(key, { method: "DELETE" }, (s) => s === 204 || s === 200 || s === 404);
    },
  };
}
