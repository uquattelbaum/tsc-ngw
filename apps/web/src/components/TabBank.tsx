import type { TabBankProps } from '@/types'

export default function TabBank({ mitglied, onChange }: TabBankProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <label className="block text-sm mb-1">IBAN</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={(mitglied as any).iban ?? ''}
          onChange={(e) => onChange('iban' as any, e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Bank (Name)</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={(mitglied as any).bank ?? ''}
          onChange={(e) => onChange('bank' as any, e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Mandatsreferenz</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={(mitglied as any).mandatsreferenz ?? ''}
          onChange={(e) => onChange('mandatsreferenz' as any, e.target.value)}
        />
      </div>
    </div>
  )
}
