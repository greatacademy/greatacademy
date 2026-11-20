import { WorkerEntrypoint } from "cloudflare:workers";
import {
  type Checker,
  type ProblemRef,
  type ReadingUnitDef,
  routeSource,
  type SubjectGateway,
  type SubjectListing,
  type SubjectManifest,
  type SubjectSource,
  subjectListing,
  type TopicDef,
  topicSource,
} from "@ga/content";

// Cloudflare refuses to deploy a Worker without an event handler, even one called only over RPC.
// Nothing serves these Workers on HTTP, so a request gets 404.
const unreachable = () => new Response(null, { status: 404 });

/**
 * shardWorker is the Worker entrypoint of a shard: it serves a subject's source
 * for the topics it holds. A subject is split into shards because a single
 * Worker cannot hold the generators of a large subject.
 */
export function shardWorker(topics: readonly TopicDef[], checkers: readonly Checker[], reading: readonly ReadingUnitDef[] = []) {
  return lazyShardWorker(async () => ({ topics, reading }), checkers);
}

/** ShardContent is what a shard holds: its topics and the reading units of its passages. */
export interface ShardContent {
  readonly topics: readonly TopicDef[];
  readonly reading?: readonly ReadingUnitDef[];
}

/**
 * lazyShardWorker is the entrypoint of a shard whose content is loaded on the first call, by a dynamic import, rather
 * than when the Worker starts: content that builds its problem banks as its modules load would otherwise exceed
 * Cloudflare's limit on a Worker's startup time.
 */
export function lazyShardWorker(load: () => Promise<ShardContent>, checkers: readonly Checker[]) {
  // Built on the first call, so that the topics do not count against the Worker's startup time.
  let source: Promise<SubjectSource> | undefined;
  const held = () => {
    source ??= load().then((c) => topicSource(c.topics, checkers, c.reading ?? []));
    return source;
  };
  return class extends WorkerEntrypoint {
    override fetch() {
      return unreachable();
    }
    async problems(refs: readonly ProblemRef[]) {
      return (await held()).problems(refs);
    }
    async lesson(topic: string, kp: number) {
      return (await held()).lesson(topic, kp);
    }
    async judge(ref: ProblemRef, response: string) {
      return (await held()).judge(ref, response);
    }
    async passage(id: string) {
      return (await held()).passage(id);
    }
  };
}

/**
 * gatewayWorker is the Worker entrypoint of a subject, the only one the web
 * Worker binds: it holds the manifest and routes to the shards. shards maps the
 * name of each shard's service binding to the ids of the topics and passages it holds.
 */
export function gatewayWorker(manifest: SubjectManifest, shards: Readonly<Record<string, readonly string[]>>) {
  const listing: SubjectListing = subjectListing(manifest);
  return class extends WorkerEntrypoint<Readonly<Record<string, SubjectSource>>> implements SubjectGateway {
    #source = routeSource(shards, (binding) => {
      const shard = this.env[binding];
      if (!shard) throw new Error(`no service binding ${binding}`);
      return shard;
    });
    override fetch() {
      return unreachable();
    }
    async listing() {
      return listing;
    }
    async manifest() {
      return manifest;
    }
    problems(refs: readonly ProblemRef[]) {
      return this.#source.problems(refs);
    }
    lesson(topic: string, kp: number) {
      return this.#source.lesson(topic, kp);
    }
    judge(ref: ProblemRef, response: string) {
      return this.#source.judge(ref, response);
    }
    passage(id: string) {
      return this.#source.passage(id);
    }
  };
}
