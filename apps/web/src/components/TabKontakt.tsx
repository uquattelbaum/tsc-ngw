import type { TabKontaktProps } from '@/types'

export default function TabKontakt({ mitglied, onChange }: TabKontaktProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="block text-sm mb-1">Telefon</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={mitglied.telefon ?? ''}
          onChange={(e) => onChange('telefon', e.target.value)}
        />
      </div>
      {/* Platzhalter für weitere Kontaktfelder (Adresse, PLZ/Ort, etc.) */}
    </div>
  )
}
