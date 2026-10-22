'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface AdminCtx {
  password: string | null;
  login: (pw: string) => void;
  logout: () => void;
}

const Ctx = createContext<AdminCtx | null>(null);

// Stores the admin password in memory only — not persisted, cleared on refresh.
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState<string | null>(null);

  const login = useCallback((pw: string) => setPassword(pw), []);
  const logout = useCallback(() => setPassword(null), []);

  return (
    <Ctx.Provider value={{ password, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
