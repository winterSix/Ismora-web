import type { Metadata } from 'next';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminGate } from './AdminGate';
import './admin.css';

export const metadata: Metadata = {
  title: 'Ismora — Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGate>{children}</AdminGate>
    </AdminAuthProvider>
  );
}
