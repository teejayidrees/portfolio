'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Users, Trash2, Loader2, UserPlus } from 'lucide-react';
import type { Subscriber } from '@/lib/types';
import { useAdmin } from './AdminContext';
import { EmptyState } from './MessagesTable';

export default function SubscribersTable() {
  const { password } = useAdmin();
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subscribers', {
        headers: { 'x-admin-password': password ?? '' },
      });
      if (!res.ok) throw new Error();
      setSubs(await res.json());
    } catch {
      toast.error('Could not load subscribers');
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password ?? '' },
      });
      if (!res.ok) throw new Error();
      toast.success('Subscriber removed');
      load();
    } catch {
      toast.error('Remove failed');
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-2 font-mono text-lg font-semibold">
        <Users className="h-5 w-5 text-primary" /> Subscribers
        <span className="text-xs text-muted-foreground">({subs.length})</span>
      </h2>

      {subs.length === 0 ? (
        <EmptyState icon={UserPlus} text="No subscribers yet" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-left">
            <thead className="border-b border-border/60 bg-secondary/30">
              <tr className="font-mono text-[11px] text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Email</th>
                <th className="px-4 py-2.5 font-medium">Subscribed</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s._id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{s.email}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(s._id)}
                      className="rounded-md border border-border/60 p-1.5 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}