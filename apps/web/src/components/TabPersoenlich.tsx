import type { TabPersoenlichProps } from '@/types'

export default function TabPersoenlich({ mitglied, onChange }: TabPersoenlichProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <label className="block text-sm mb-1">Vorname</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={mitglied.vorname ?? ''}
          onChange={(e) => onChange('vorname', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Nachname</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={mitglied.nachname ?? ''}
          onChange={(e) => onChange('nachname', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">E‑Mail (optional)</label>
        <input
          type="email"
          className="border rounded px-3 py-2 w-full"
          value={mitglied.email ?? ''}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>
    </div>
  )
}
