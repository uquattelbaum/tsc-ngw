import type { TabMitgliedschaftProps, Intervall } from '@/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const intervallOptions: { value: Intervall; label: string }[] = [
  { value: 'monatlich', label: 'Monatlich' },
  { value: 'vierteljährlich', label: 'Vierteljährlich' },
  { value: 'halbjährlich', label: 'Halbjährlich' },
  { value: 'jährlich', label: 'Jährlich' },
]

export default function TabMitgliedschaft({ mitgliedId, mitgliedschaft, onChange }: TabMitgliedschaftProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label className="mb-1 block">Intervall</Label>
          <Select value={mitgliedschaft.intervall} onValueChange={(v) => onChange({ intervall: v as Intervall })}>
            <SelectTrigger><SelectValue placeholder="Intervall" /></SelectTrigger>
            <SelectContent>
              {intervallOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="beitrag" className="mb-1 block">Beitrag</Label>
          <Input
            id="beitrag"
            type="number"
            value={mitgliedschaft.beitrag}
            onChange={(e) => onChange({ beitrag: Number(e.target.value || 0) })}
            min={0}
          />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <Checkbox id="mitgliedschaft-aktiv" checked={!!mitgliedschaft.aktiv} onCheckedChange={(v) => onChange({ aktiv: Boolean(v) })} />
          <Label htmlFor="mitgliedschaft-aktiv">aktiv</Label>
        </div>
      </div>

      {/* Hinweis: IBAN/Mandat verwalten wir im Tab "Bank" */}
      {mitgliedId && (
        <p className="text-xs text-muted-foreground">Mitglied: {mitgliedId}</p>
      )}
    </div>
  )
}
