import type { TabMitgliedschaftProps, Intervall } from '@/types'

const intervallOptions: { value: Intervall; label: string }[] = [
  { value: 'monatlich', label: 'Monatlich' },
  { value: 'vierteljährlich', label: 'Vierteljährlich' },
  { value: 'halbjährlich', label: 'Halbjährlich' },
  { value: 'jährlich', label: 'Jährlich' },
]

export default function TabMitgliedschaft({ mitgliedId, mitgliedschaft, onChange }: TabMitgliedschaftProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <label className="block text-sm mb-1">Intervall</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={mitgliedschaft.intervall}
          onChange={(e) => onChange({ intervall: e.target.value as Intervall })}
        >
          {intervallOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Beitrag</label>
        <input
          type="number"
          className="border rounded px-3 py-2 w-full"
          value={mitgliedschaft.beitrag}
          onChange={(e) => onChange({ beitrag: Number(e.target.value || 0) })}
          min={0}
        />
      </div>

      <div className="flex items-center gap-2 mt-6">
        <input
          id="mitgliedschaft-aktiv"
          type="checkbox"
          className="h-4 w-4"
          checked={!!mitgliedschaft.aktiv}
          onChange={(e) => onChange({ aktiv: e.target.checked })}
        />
        <label htmlFor="mitgliedschaft-aktiv" className="text-sm">aktiv</label>
      </div>

      <div className="sm:col-span-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-sm mb-1">Mandatsreferenz</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={mitgliedschaft.mandatsreferenz ?? ''}
            onChange={(e) => onChange({ mandatsreferenz: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">IBAN</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={mitgliedschaft.iban ?? ''}
            onChange={(e) => onChange({ iban: e.target.value })}
          />
        </div>
      </div>

      {/* Hinweis: Das tatsächliche Speichern erfolgt in Mitglieder.tsx (TODO API) */}
      {mitgliedId && (
        <p className="text-xs text-gray-500 sm:col-span-3">Mitglied: {mitgliedId}</p>
      )}
    </div>
  )
}
