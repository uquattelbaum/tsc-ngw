export type MitgliedRow = {
  id: string
  vorname: string
  nachname: string
  email?: string | null
  telefon?: string | null
}

const API = 'http://127.0.0.1:8787'

export async function listMitglieder(params?: { search?: string }) {
  const q = params?.search ? `?q=${encodeURIComponent(params.search)}` : ''
  const res = await fetch(`${API}/api/members${q}`, { credentials: 'include' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as MitgliedRow[]
}

export async function createMitglied(input: {
  vorname: string
  nachname: string
  email?: string
  telefon?: string
}) {
  const res = await fetch(`${API}/api/members`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as MitgliedRow
}

export async function removeMitglied(id: string) {
  const res = await fetch(`${API}/api/members/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`)
  return true
}

export async function updateMitglied(id: string, input: Partial<{
  vorname: string; nachname: string; email?: string; telefon?: string;
}>) {
  const res = await fetch(`${API}/api/members/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as MitgliedRow;
}
