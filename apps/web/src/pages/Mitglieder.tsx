import { useEffect, useMemo, useState } from "react";
import {
  useCreateMitglied,
  useMitgliederList,
  useRemoveMitglied,
  useUpdateMitglied,
  type MitgliedRow,
} from "@/hooks/useMitglieder";

import TabPersoenlich from "@/components/TabPersoenlich";
import TabKontakt from "@/components/TabKontakt";
import TabMitgliedschaft from "@/components/TabMitgliedschaft";
import TabBank from "@/components/TabBank";

import type { Mitglied } from "@/types";

type TabKey = "persoenlich" | "kontakt" | "mitgliedschaft" | "bank";

export default function MitgliederPage() {
  const [search, setSearch] = useState("");
  const list = useMitgliederList({ search });

  // gesamter Mitglieds-State
  const [mitglied, setMitglied] = useState<Mitglied>({} as Mitglied);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("persoenlich");

  const create = useCreateMitglied();
  const remove = useRemoveMitglied();
  const update = useUpdateMitglied();

  useEffect(() => {
    if (!editId) return;
    const row = (list.data ?? []).find((m) => m.id === editId);
    if (row) {
      setMitglied(row as Mitglied);
      setShowForm(true);
      setActiveTab("persoenlich");
    }
  }, [editId, list.data]);

  const isSubmitting = create.isPending || update.isPending;
  const rows: MitgliedRow[] = useMemo(() => list.data ?? [], [list.data]);

  function resetForm() {
    setMitglied({} as Mitglied);
    setEditId(null);
    setActiveTab("persoenlich");
    setShowForm(false);
  }

  function handleSave() {
    const payload = { ...mitglied } as Partial<MitgliedRow>;
    if (!payload.vorname || !payload.nachname) return;

    if (editId) {
      update.mutate({ id: editId, data: payload }, { onSuccess: () => resetForm() });
    } else {
      create.mutate(payload as any, { onSuccess: () => resetForm() });
    }
  }

  function handleChange(field: keyof Mitglied, value: string) {
    setMitglied((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div style={{ maxWidth: 960, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Mitglieder</h1>

      <div style={{ margin: "12px 0 16px" }}>
        <input
          placeholder="Suche (Vorname, Nachname, E‑Mail)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6 }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 12px" }}>
        <div />
        <button type="button" style={btnPrimary} onClick={() => { resetForm(); setShowForm(true); }}>Neues Mitglied</button>
      </div>

      {showForm && (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {([
              ["persoenlich", "Persönlich"],
              ["kontakt", "Kontakt"],
              ["mitgliedschaft", "Mitgliedschaft"],
              ["bank", "Bank"],
            ] as [TabKey, string][]).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                style={{
                  ...btnSecondary,
                  background: activeTab === key ? "#2563eb" : "#f3f4f6",
                  color: activeTab === key ? "white" : "#111827",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "persoenlich" && <TabPersoenlich mitglied={mitglied} onChange={handleChange} />}
          {activeTab === "kontakt" && <TabKontakt mitglied={mitglied} onChange={handleChange} />}
          {activeTab === "mitgliedschaft" && <TabMitgliedschaft mitgliedschaft={mitglied} onChange={handleChange} />}
          {activeTab === "bank" && <TabBank mitglied={mitglied} onChange={handleChange} />}

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button type="button" style={btnPrimary} onClick={handleSave} disabled={isSubmitting}>
              {editId ? "Aktualisieren" : "Speichern"}
            </button>
            <button type="button" style={btnSecondary} onClick={resetForm} disabled={isSubmitting}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {list.isLoading && <p>Lade Mitglieder…</p>}
      {create.isError && <p style={errStyle}>Fehler beim Speichern.</p>}
      {update.isError && <p style={errStyle}>Fehler beim Aktualisieren.</p>}
      {remove.isError && <p style={errStyle}>Fehler beim Löschen.</p>}

      {!list.isLoading && (
        <table width="100%" cellPadding={10} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th>Name</th>
              <th>E‑Mail</th>
              <th style={{ width: 220 }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td>{m.nachname}, {m.vorname}</td>
                <td>{m.email ?? "—"}</td>
                <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setEditId(m.id)} style={btnSecondary}>Bearbeiten</button>
                  <button
                    type="button"
                    onClick={() => { if (!confirm("Mitglied wirklich löschen?")) return; remove.mutate(m.id); }}
                    style={btnDanger}
                    disabled={remove.isPending}
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 20, color: "#666" }}>Keine Mitglieder gefunden.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const btnBase: React.CSSProperties = { padding: "10px 14px", borderRadius: 8, border: "1px solid transparent", cursor: "pointer" };
const btnPrimary: React.CSSProperties = { ...btnBase, background: "#2563eb", color: "white" };
const btnSecondary: React.CSSProperties = { ...btnBase, background: "#f3f4f6", color: "#111827", borderColor: "#e5e7eb", border: "1px solid #e5e7eb" };
const btnDanger: React.CSSProperties = { ...btnBase, background: "#ef4444", color: "white" };
const errStyle: React.CSSProperties = { color: "#b91c1c", marginBottom: 12 };
