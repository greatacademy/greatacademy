// The part of the Workers runtime this package uses, for its own typecheck.
// A Worker that imports the package compiles against its generated runtime types.
declare module "cloudflare:workers" {
  export class WorkerEntrypoint<Env = unknown> {
    protected env: Env;
    fetch?(request: unknown): Response | Promise<Response>;
  }
}

declare class Response {
  constructor(body: null, init: { status: number });
}
