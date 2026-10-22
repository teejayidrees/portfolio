'use client';

import { useAdmin, AdminProvider } from '@/components/admin/AdminContext';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

function AdminGate() {
  const { password } = useAdmin();
  // Password is held in memory only — not persisted across reloads.
  return password ? <AdminDashboard /> : <AdminLogin />;
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminGate />
    </AdminProvider>
  );
}
