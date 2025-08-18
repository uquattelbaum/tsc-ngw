import { pgTable, varchar, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const weekday = pgEnum("weekday", [
  "mo",
  "tu",
  "we",
  "th",
  "fr",
  "sa",
  "su",
]);

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  weekday: weekday("weekday").notNull(),
  startTime: varchar("start_time", { length: 5 }).notNull(),
  endTime: varchar("end_time", { length: 5 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
