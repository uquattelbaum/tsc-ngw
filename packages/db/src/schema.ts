import {
  pgTable,
  index,
  unique,
  pgPolicy,
  uuid,
  text,
  date,
  boolean,
  timestamp,
  time,
  numeric,
  foreignKey,
  check,
  pgEnum,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/* Enums */
export const intervall = pgEnum("intervall", [
  "monatlich",
  "vierteljährlich",
  "halbjährlich",
  "jährlich",
]);
export const wochentag = pgEnum("wochentag", [
  "mo",
  "di",
  "mi",
  "do",
  "fr",
  "sa",
  "so",
]);
export const zahlungStatus = pgEnum("zahlung_status", [
  "offen",
  "eingezogen",
  "fehlgeschlagen",
  "storniert",
  "manuell",
]);

/* citext helper */
export const citext = (name: string) =>
  customType<{ data: string; driverData: string }>({
    dataType: () => "citext",
  })(name);

/* Tabellen */

export const mitglieder = pgTable(
  "mitglieder",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    adressnummer: text("adressnummer"),
    nachname: text("nachname").notNull(),
    vorname: text("vorname").notNull(),
    geburtstag: date("geburtstag"),
    geschlecht: text("geschlecht"),
    strasse: text("strasse"),
    plz: text("plz"),
    ort: text("ort"),
    email: citext("email"),
    aktiv: boolean("aktiv").default(true),
    erstelltAm: timestamp("erstellt_am", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    notizen: text("notizen"),
    telefonMobil: text("telefon_mobil"),
    telefonFestnetz: text("telefon_festnetz"),
  },
  (table) => [
    index("mitglieder_nachname_idx").on(table.nachname),
    unique("mitglieder_adressnummer_key").on(table.adressnummer),

    // RLS-Policies (nur referenziert, eigentliche Logik ist in der DB bereits vorhanden)
    pgPolicy("del_mitglieder", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
    }),
    pgPolicy("ins_mitglieder", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("sel_mitglieder", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
    pgPolicy("upd_mitglieder", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
  ]
);

export const mitgliedschaften = pgTable(
  "mitgliedschaften",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    mitgliedId: uuid("mitglied_id"),
    beitragsintervall: intervall("beitragsintervall").notNull(),
    beitragshoehe: numeric("beitragshoehe", {
      precision: 12,
      scale: 2,
    }).notNull(),
    beginn: date("beginn").notNull(),
    enddatum: date("enddatum"),
    mandatsreferenz: text("mandatsreferenz").notNull(),
    mandatsdatum: date("mandatsdatum").notNull(),
    iban: text("iban").notNull(),
    kontoinhaber: text("kontoinhaber").notNull(),
  },
  (table) => [
    index("mitgliedschaften_mitglied_id_idx").on(table.mitgliedId),
    foreignKey({
      columns: [table.mitgliedId],
      foreignColumns: [mitglieder.id],
      name: "mitgliedschaften_mitglied_id_fkey",
    }).onDelete("cascade"),
    unique("mitgliedschaften_mandatsreferenz_uq").on(table.mandatsreferenz),
    pgPolicy("del_mitgliedschaften", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
      using: sql`exists (select 1 from app_owner o where o.user_id = auth.uid())`,
    }),
    pgPolicy("ins_mitgliedschaften", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("sel_mitgliedschaften", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
    pgPolicy("upd_mitgliedschaften", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
  ]
);

export const sepaExports = pgTable(
  "sepa_exports",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    erstelltAm: timestamp("erstellt_am", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    dateiname: text("dateiname"),
    kommentar: text("kommentar"),
  },
  (_table) => [
    pgPolicy("del_sepa_exports", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
      using: sql`exists (select 1 from app_owner o where o.user_id = auth.uid())`,
    }),
    pgPolicy("ins_sepa_exports", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("sel_sepa_exports", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
    pgPolicy("upd_sepa_exports", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
  ]
);

export const abteilungen = pgTable(
  "abteilungen",
  {
    id: uuid("id").primaryKey().notNull(),
    name: text("name").notNull(),
    beschreibung: text("beschreibung"),
  },
  (table) => [
    unique("abteilungen_name_key").on(table.name),
    pgPolicy("del_abteilungen", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
      using: sql`exists (select 1 from app_owner o where o.user_id = auth.uid())`,
    }),
    pgPolicy("ins_abteilungen", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("sel_abteilungen", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
    pgPolicy("upd_abteilungen", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
  ]
);

export const gruppen = pgTable(
  "gruppen",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(),
    wochentag: wochentag("wochentag"),
    uhrzeit: time("uhrzeit"),
    trainer: text("trainer"),
    raum: text("raum"),
    abteilungId: uuid("abteilung_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.abteilungId],
      foreignColumns: [abteilungen.id],
      name: "gruppen_abteilung_id_fkey",
    }).onDelete("set null"),
    pgPolicy("del_gruppen", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
      using: sql`exists (select 1 from app_owner o where o.user_id = auth.uid())`,
    }),
    pgPolicy("ins_gruppen", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("sel_gruppen", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
    pgPolicy("upd_gruppen", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
  ]
);

export const mitgliedGruppe = pgTable(
  "mitglied_gruppe",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    mitgliedschaftId: uuid("mitgliedschaft_id"),
    gruppeId: uuid("gruppe_id"),
    vonDatum: date("von_datum").notNull(),
    bisDatum: date("bis_datum"),
  },
  (table) => [
    index("mitglied_gruppe_mitgliedschaft_idx").on(table.mitgliedschaftId),
    index("mitglied_gruppe_gruppe_idx").on(table.gruppeId),
    foreignKey({
      columns: [table.gruppeId],
      foreignColumns: [gruppen.id],
      name: "mitglied_gruppe_gruppe_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.mitgliedschaftId],
      foreignColumns: [mitgliedschaften.id],
      name: "mitglied_gruppe_mitgliedschaft_id_fkey",
    }).onDelete("cascade"),
    check(
      "mitglied_gruppe_datum_chk",
      sql`bis_datum is null or bis_datum >= von_datum`
    ),
    pgPolicy("del_mitglied_gruppe", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
      using: sql`exists (select 1 from app_owner o where o.user_id = auth.uid())`,
    }),
    pgPolicy("ins_mitglied_gruppe", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("sel_mitglied_gruppe", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
    pgPolicy("upd_mitglied_gruppe", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
  ]
);

export const zahlungen = pgTable(
  "zahlungen",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    mitgliedschaftId: uuid("mitgliedschaft_id"),
    zahlungsdatum: date("zahlungsdatum").notNull(),
    betrag: numeric("betrag", { precision: 12, scale: 2 }).notNull(),
    bezahltAm: date("bezahlt_am"),
    status: zahlungStatus("status").default("offen").notNull(),
    faelligkeit: date("faelligkeit"),
    mitgliedId: uuid("mitglied_id"),
    sepaExportId: uuid("sepa_export_id"),
  },
  (table) => [
    index("zahlungen_mitgliedschaft_idx").on(table.mitgliedschaftId),
    index("idx_zahlungen_faelligkeit_status").on(
      table.faelligkeit,
      table.status
    ),
    index("zahlungen_offen_idx")
      .on(table.mitgliedschaftId)
      .where(sql`status = 'offen'::zahlung_status`),
    foreignKey({
      columns: [table.mitgliedId],
      foreignColumns: [mitglieder.id],
      name: "zahlungen_mitglied_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.mitgliedschaftId],
      foreignColumns: [mitgliedschaften.id],
      name: "zahlungen_mitgliedschaft_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.sepaExportId],
      foreignColumns: [sepaExports.id],
      name: "zahlungen_sepa_export_id_fkey",
    }).onDelete("set null"),
    check("zahlungen_betrag_pos_chk", sql`betrag > 0::numeric`),
    pgPolicy("del_zahlungen", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
      using: sql`exists (select 1 from app_owner o where o.user_id = auth.uid())`,
    }),
    pgPolicy("ins_zahlungen", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("sel_zahlungen", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
    pgPolicy("upd_zahlungen", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
  ]
);

export const appOwner = pgTable(
  "app_owner",
  {
    userId: uuid("user_id").primaryKey().notNull(),
  },
  (_table) => [
    pgPolicy("sel_app_owner", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
      using: sql`user_id = auth.uid()`,
    }),
  ]
);
