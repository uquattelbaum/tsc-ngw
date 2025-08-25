// apps/web/src/types.ts
// Zentrale Typen für dein Frontend. Diese passen zu deinem aktuellen Drizzle‑Schema
// (Tabelle "mitglieder" u. a.) und definieren einheitliche Props für die Tab‑Komponenten.

// --- Stammdaten (mitglieder) ---
export interface Mitglied {
  id?: string;
  vorname: string;
  nachname: string;
  email?: string | null;
  telefon?: string | null; // Aktuell ein Feld – falls du festnetz/mobil trennst, erweitern
  erstelltAm?: string | null; // timestamptz
}

export type OnMitgliedChange = (field: keyof Mitglied, value: string) => void;

// --- Mitgliedschaft (mitgliedschaften) ---
export type Intervall = "monatlich" | "vierteljährlich" | "halbjährlich" | "jährlich";

export interface Mitgliedschaft {
  id?: string;
  mitgliedId?: string;
  intervall: Intervall;
  beitrag: number; // in Cent oder Euro – je nachdem, wie du es speicherst
  aktiv: boolean;
  mandatsreferenz?: string | null;
  // bank?: string | null;
  iban?: string | null;
}

export type OnMitgliedschaftChange = (patch: Partial<Mitgliedschaft>) => void;

// --- Bankdaten (falls separat geführt) ---
export interface Bankdaten {
  iban?: string | null;
  mandatsreferenz?: string | null;
  mandatsdatum?: string | null;
}

export type OnBankChange = (patch: Partial<Bankdaten>) => void;

// --- Tab‑Props (UI) ---
export interface TabPersoenlichProps {
  mitglied: Mitglied;
  onChange: OnMitgliedChange; // z. B. onChange('vorname', 'Anna')
}

export interface TabKontaktProps {
  mitglied: Mitglied;
  onChange: OnMitgliedChange; // z. B. onChange('telefon', '0123…')
}

// Für eine saubere Trennung wäre Mitgliedschaft ein eigener State/Endpoint.
// Wenn du das sofort nutzen möchtest, nimm diese Props und pflege in Mitglieder.tsx
// einen eigenen State "mitgliedschaft" + separate API.
export interface TabMitgliedschaftProps {
  mitgliedId?: string;
  mitgliedschaft: Mitgliedschaft;
  onChange: OnMitgliedschaftChange; // z. B. onChange({ intervall: 'monatlich' })
}

export interface TabBankProps {
  mitglied: Mitglied; // Quick‑Variante: Bankdaten hängen (noch) am Mitglied
  onChange: OnMitgliedChange | OnBankChange; // akzeptiert beide Signaturen
}
