import { WorkerEntrypoint } from "cloudflare:workers";
import {
  type Checker,
  type ProblemRef,
  routeSource,
  type SubjectGateway,
  type SubjectListing,
  type SubjectManifest,
  type SubjectSource,
  subjectListing,
  type TopicDef,
  topicSource,
} from "@ga/content";

/**
 * shardWorker is the Worker entrypoint of a shard: it serves a subject's source
 * for the topics it holds. A subject is split into shards because a single
 * Worker cannot hold the generators of a large subject.
 */
export function shardWorker(topics: readonly TopicDef[], checkers: readonly Checker[]) {
  // Built on the first call, so that the topics do not count against the Worker's startup time.
  let source: SubjectSource | undefined;
  const held = () => {
    source ??= topicSource(topics, checkers);
    return source;
  };
  return class extends WorkerEntrypoint {
    problems(refs: readonly ProblemRef[]) {
      return held().problems(refs);
    }
    lesson(topic: string, kp: number) {
      return held().lesson(topic, kp);
    }
    judge(ref: ProblemRef, response: string) {
      return held().judge(ref, response);
    }
  };
}

/**
 * gatewayWorker is the Worker entrypoint of a subject, the only one the web
 * Worker binds: it holds the manifest and routes to the shards. shards maps the
 * name of each shard's service binding to the ids of the topics it holds.
 */
export function gatewayWorker(manifest: SubjectManifest, shards: Readonly<Record<string, readonly string[]>>) {
  const listing: SubjectListing = subjectListing(manifest);
  return class extends WorkerEntrypoint<Readonly<Record<string, SubjectSource>>> implements SubjectGateway {
    #source = routeSource(shards, (binding) => {
      const shard = this.env[binding];
      if (!shard) throw new Error(`no service binding ${binding}`);
      return shard;
    });
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
  };
}
