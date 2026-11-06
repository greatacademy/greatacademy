import { createFileRoute } from "@tanstack/react-router";

import { Landing } from "../components/Landing.tsx";

export const Route = createFileRoute("/landing")({ component: Landing });
