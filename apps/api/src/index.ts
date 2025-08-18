import { Hono } from "hono";

const app = new Hono();
app.get("/health", (c) => c.json({ ok: true }));

export default {
  fetch: (req: Request, env: Record<string, unknown>, ctx: ExecutionContext) =>
    app.fetch(req, env, ctx),
};
