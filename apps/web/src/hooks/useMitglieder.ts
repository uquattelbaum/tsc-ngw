import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMitglied,
  listMitglieder,
  removeMitglied,
  updateMitglied,
  type MitgliedRow,
} from '@/services/mitglieder'

export function useMitgliederList(params: { search?: string }) {
  return useQuery({
    queryKey: ['mitglieder', params.search ?? ''],
    queryFn: () => listMitglieder({ search: params.search }),
  })
}

export function useCreateMitglied() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createMitglied,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mitglieder'] }),
  })
}

export function useRemoveMitglied() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removeMitglied(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mitglieder'] }),
  })
}

export function useUpdateMitglied() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MitgliedRow> }) =>
      updateMitglied(id, {
        vorname: data.vorname,
        nachname: data.nachname,
        email: data.email ?? undefined,      // ⬅️ null → undefined
        telefon: (data as any).telefon ?? undefined, // falls vorhanden
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mitglieder"] }),
  });
}

export type { MitgliedRow }
