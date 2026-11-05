import type { SubjectManifest } from "@ga/content";
import { gatewayWorker } from "@ga/subject-worker";

import manifest from "../gen/manifest.json" with { type: "json" };
import shards from "../gen/shards.json" with { type: "json" };

export default gatewayWorker(manifest as unknown as SubjectManifest, shards);
