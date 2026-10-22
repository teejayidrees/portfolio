'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { GraduationCap, Trash2, Loader2, Plus, Pencil, Save, X } from 'lucide-react';
import { useAdmin } from './AdminContext';

export default function JourneyManager() {
  const { password } = useAdmin();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/journey');
      if (!res.ok) throw new Error();
      setEntries(await res.json());
    } catch {
      toast.error('Failed to load journey');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await fetch(`/api/admin/journey?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password ?? '' },
      });
      toast.success('Deleted successfully');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-mono text-lg font-semibold">
          <GraduationCap className="h-5 w-5 text-primary" /> The Journey
        </h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 font-mono text-xs font-medium text-primary-foreground transition-all hover:glow-primary"
        >
          <Plus className="h-3.5 w-3.5" /> New Entry
        </button>
      </div>

      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e._id} className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
                {e.kind} (Order: {e.order})
              </span>
              <h3 className="mt-2 font-mono text-sm font-semibold">{e.title} <span className="text-primary">— {e.org}</span></h3>
              <p className="mt-1 text-xs text-muted-foreground">{e.period}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(e); setShowForm(true); }} className="rounded-md border p-2 hover:text-primary">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => remove(e._id)} className="rounded-md border p-2 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <JourneyForm 
          entry={editing} 
          password={password ?? ''} 
          onClose={() => setShowForm(false)} 
          onSaved={() => { setShowForm(false); load(); }} 
        />
      )}
    </div>
  );
}

function JourneyForm({ entry, password, onClose, onSaved }: any) {
  const [form, setForm] = useState({
    title: entry?.title ?? '', org: entry?.org ?? '', period: entry?.period ?? '',
    detail: entry?.detail ?? '', kind: entry?.kind ?? 'experience', order: entry?.order ?? 0
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/journey', {
        method: entry ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ ...form, _id: entry?._id }),
      });
      if (!res.ok) throw new Error();
      toast.success('Saved successfully');
      onSaved();
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border/60 bg-card p-6 shadow-2xl">
        <div className="mb-4 flex justify-between"><h3 className="font-mono font-semibold">{entry ? 'Edit' : 'New'} Entry</h3><button onClick={onClose}><X className="h-5 w-5"/></button></div>
        <form onSubmit={save} className="space-y-4">
          <input className="adm-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title (e.g. Tutor)" required/>
          <input className="adm-input" value={form.org} onChange={e => setForm({...form, org: e.target.value})} placeholder="Organization" required/>
          <input className="adm-input" value={form.period} onChange={e => setForm({...form, period: e.target.value})} placeholder="Period (e.g. Aug 2025 - Oct 2025)" required/>
          <select className="adm-input" value={form.kind} onChange={e => setForm({...form, kind: e.target.value})}>
            <option value="experience">Experience</option><option value="education">Education</option>
          </select>
          <textarea className="adm-input" value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} placeholder="Details" rows={3} required/>
          <input type="number" className="adm-input" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} placeholder="Display Order (0 is first)" required/>
          <button type="submit" disabled={saving} className="w-full rounded-lg bg-primary py-2 font-mono text-sm text-primary-foreground hover:glow-primary">{saving ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
    </div>
  );
}