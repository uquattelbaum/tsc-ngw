import { useCreateMitglied } from '@/hooks/useMitglieder';
// ...

const create = useCreateMitglied();
const [newVorname, setNewVorname] = useState("");
const [newNachname, setNewNachname] = useState("");
const [newEmail, setNewEmail] = useState("");

{zuBearbeiten !== null && (
  <form
    className="rounded border p-4 grid gap-3 grid-cols-1 sm:grid-cols-4 items-end"
    onSubmit={(e) => {
      e.preventDefault();
      create.mutate(
        { vorname: newVorname.trim(), nachname: newNachname.trim(), email: newEmail.trim() || undefined },
        {
          onSuccess: () => {
            setNewVorname(""); setNewNachname(""); setNewEmail("");
            setZuBearbeiten(null); // Formular einklappen
          }
        }
      );
    }}
  >
    <div>
      <label className="block text-sm font-medium mb-1">Vorname</label>
      <input className="border rounded px-3 py-2 w-full" value={newVorname} onChange={(e)=>setNewVorname(e.target.value)} required />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Nachname</label>
      <input className="border rounded px-3 py-2 w-full" value={newNachname} onChange={(e)=>setNewNachname(e.target.value)} required />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">E‑Mail (optional)</label>
      <input className="border rounded px-3 py-2 w-full" type="email" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} />
    </div>
    <div className="flex gap-2">
      <Button type="submit" disabled={create.isPending}>Speichern</Button>
      <Button type="button" variant="secondary" onClick={()=>setZuBearbeiten(null)}>Abbrechen</Button>
    </div>
  </form>
)}
