import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";

// The app talks to the web app's Worker. In development that is the Vite dev
// server, which the iOS simulator reaches at localhost; a device on the LAN
// needs EXPO_PUBLIC_API_URL set to the Mac's address.
const baseUrl = `${process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5173"}/api/rpc`;

// Unary calls only: React Native's fetch cannot stream, and the services have no streaming methods.
const transport = createConnectTransport({ baseUrl });

export const catalog = createClient(CatalogService, transport);
export const learning = createClient(LearningService, transport);
