/** AudioObject is what serveAudio needs of a stored recording: an R2 object's body, size and the range read. */
export interface AudioObject {
  readonly body: ReadableStream;
  readonly size: number;
  readonly httpEtag: string;
  readonly range?: { offset?: number; length?: number; suffix?: number };
}

/** AudioStore reads recordings by key, a range of one when the headers ask for it, as an R2 bucket does. */
export interface AudioStore {
  get(key: string, options: { range: Headers }): Promise<AudioObject | null>;
}

/** AUDIO_PATH is a recording's path, which is also its key in the bucket: audio/, a subject, the recording's name and its format. */
const AUDIO_PATH = /^\/(audio\/[a-z][a-z0-9-]*\/[0-9a-f]{16}\.(mp3|wav))$/u;

/** TYPES are the media types of the formats of recordings: MP3 for the apps, WAV for the voice service. */
const TYPES = { mp3: "audio/mpeg", wav: "audio/wav" } as const;

/**
 * serveAudio serves a recording of a subject from the R2 bucket, under the same key as its path,
 * /audio/<subject>/<name>.mp3 or .wav, with ranges, which players on
 * phones ask for. A recording never changes, since its name is a hash of what it reads, so it is cached for a year.
 */
export async function serveAudio(store: AudioStore, request: Request): Promise<Response> {
  const match = AUDIO_PATH.exec(new URL(request.url).pathname);
  const key = match?.[1];
  const ext = match?.[2] as keyof typeof TYPES | undefined;
  if (!key || !ext) return new Response("Not Found", { status: 404 });
  const object = await store.get(key, { range: request.headers });
  if (!object) return new Response("Not Found", { status: 404 });
  const headers = new Headers({
    "Content-Type": TYPES[ext],
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
    ETag: object.httpEtag,
  });
  const body = request.method === "HEAD" ? null : object.body;
  const r = object.range;
  if (!request.headers.has("Range") || !r) {
    headers.set("Content-Length", String(object.size));
    return new Response(body, { headers });
  }
  const offset = r.suffix !== undefined ? Math.max(object.size - r.suffix, 0) : (r.offset ?? 0);
  const length = r.suffix !== undefined ? object.size - offset : (r.length ?? object.size - offset);
  headers.set("Content-Range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
  headers.set("Content-Length", String(length));
  return new Response(body, { status: 206, headers });
}
