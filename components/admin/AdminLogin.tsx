'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, Loader2, Terminal } from 'lucide-react';
import { useAdmin } from './AdminContext';

export default function AdminLogin() {
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        toast.error('Invalid password');
        return;
      }
      login(pw);
      toast.success('Access granted');
      router.refresh();
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-bg flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/40 px-4 py-3 font-mono text-xs text-muted-foreground">
          <Terminal className="h-3.5 w-3.5 text-primary" /> admin — secure access
        </div>
        <form onSubmit={submit} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] text-muted-foreground">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-input bg-background/60 py-2.5 pl-9 pr-3 font-mono text-sm outline-none transition-colors focus:border-primary/50"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !pw}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-all hover:glow-primary disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Terminal className="h-4 w-4" />}
            {loading ? 'Authenticating…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
