/// <reference types="@cloudflare/workers-types" />

import { Hono } from "hono";
import {cors} from "hono/cors";
import { classesRoute } from "./routes/classes";
import { membersRoute } from "./routes/members";

type Bindings = { DATABASE_URL: string; CORS_ORIGIN?: string };

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: (origin, c) => c.env.CORS_ORIGIN ?? origin ?? "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/health", (c) => c.json({ ok: true }));
app.route("/", classesRoute);
app.route("/", membersRoute);

export default {
  fetch: (req: Request, env: { DATABASE_URL: string }, ctx: ExecutionContext) =>
    app.fetch(req, env, ctx),
};
