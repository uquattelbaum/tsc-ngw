import { Hono } from "hono";
import { makeDb } from "../lib/db";
//import { gruppen } from "@tsc/db/src/schema";
 import { gruppen } from "@tsc/db";

export const classesRoute = new Hono<{ Bindings: { DATABASE_URL: string } }>();

classesRoute.get("/api/classes", async (c) => {
  const db = makeDb(c.env.DATABASE_URL);
  // ⬇️ aus der Tabelle "gruppen" lesen
  const rows = await db.select().from(gruppen).limit(50);
  return c.json({ items: rows });
});
