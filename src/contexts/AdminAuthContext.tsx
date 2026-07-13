'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  type AdminUser,
  clearAuth,
  getStoredAuth,
  login as loginRequest,
  logoutRemote,
} from '@/lib/adminAuth';

interface AdminAuthValue {
  user: AdminUser | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredAuth()?.user ?? null);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const loggedInUser = await loginRequest(identifier, password);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(async () => {
    await logoutRemote();
    clearAuth();
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
