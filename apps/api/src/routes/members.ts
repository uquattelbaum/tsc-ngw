import { Hono } from "hono";
import { z } from "zod";
import { makeDb } from "../lib/db";
import { mitglieder } from "@tsc/db";
import { eq } from "drizzle-orm"; 

export const membersRoute = new Hono<{ Bindings: { DATABASE_URL: string } }>();

// Query-Params (wir unterstützen erstmal nur "q")
const ListQuery = z.object({ q: z.string().trim().min(1).optional() });

// POST-Body
const CreateBody = z.object({
  vorname: z.string().min(1, "Vorname fehlt"),
  nachname: z.string().min(1, "Nachname fehlt"),
  email: z.string().email().optional().or(z.literal("")).transform(v => v || undefined),
  telefon: z.string().optional(),
});

membersRoute.get("/api/members", async (c) => {
  const db = makeDb(c.env.DATABASE_URL);
  const { q } = ListQuery.parse(Object.fromEntries(new URL(c.req.url).searchParams));

  // Einfach: alles oder LIKE-Filter (Name/Email)
  if (!q) {
    const rows = await db.select().from(mitglieder).orderBy(mitglieder.nachname, mitglieder.vorname).limit(200);
    return c.json(rows);
  }

  const like = `%${q}%`.toLowerCase();
  // drizzle/neon-http: einfacher Raw-Filter
  const rows = await db.execute(
    // language=sql
    `select * from mitglieder 
     where lower(vorname) like ${like} 
        or lower(nachname) like ${like} 
        or lower(coalesce(email,'')) like ${like}
     order by nachname, vorname
     limit 200`
  );
  return c.json(rows);
});

membersRoute.post("/api/members", async (c) => {
  const db = makeDb(c.env.DATABASE_URL);
  const body = CreateBody.parse(await c.req.json());

  const [row] = await db.insert(mitglieder).values({
    vorname: body.vorname,
    nachname: body.nachname,
    email: body.email ?? null,
    telefonMobil: body.telefon ?? null,
  }).returning();

  return c.json(row, 201);
});

membersRoute.delete("/api/members/:id", async (c) => {
  const db = makeDb(c.env.DATABASE_URL);
  const id = c.req.param("id");

  try {
    await db.delete(mitglieder).where(eq(mitglieder.id, id));   // ⬅️ so ist’s richtig
    return c.body(null, 204);
  } catch (e: any) {
    // Wenn es abhängige Datensätze gibt (FK), gib eine klare Meldung zurück
    if (e?.code === "23503") {
      return c.json({ error: "Dieses Mitglied wird noch verwendet (FK-Constraint)." }, 409);
    }
    console.error("DELETE /api/members error:", e);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

const UpdateBody = z.object({
  vorname: z.string().min(1).optional(),
  nachname: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal("")).transform(v => (v === "" ? undefined : v)),
  telefon: z.string().optional(), // mappe gleich korrekt auf deine Spalte
});

membersRoute.patch("/api/members/:id", async (c) => {
  const db = makeDb(c.env.DATABASE_URL);
  const id = c.req.param("id");
  const body = UpdateBody.parse(await c.req.json());

  // Nur erlaubte Spalten setzen (an deine Spaltennamen anpassen)
  const data: Partial<typeof mitglieder.$inferInsert> = {
    vorname: body.vorname,
    nachname: body.nachname,
    email: body.email,
    // Wähle die passende Telefonspalte:
    // telefon: body.telefon,
    // telefonFestnetz: body.telefon,
    telefonMobil: body.telefon,
  };

  // Leere/undefined Felder nicht updaten
  Object.keys(data).forEach((k) => (data as any)[k] === undefined && delete (data as any)[k]);

  const [row] = await db.update(mitglieder).set(data).where(eq(mitglieder.id, id)).returning();
  return c.json(row ?? {}, row ? 200 : 404);
});