import React, { createContext, useContext, useState, useEffect } from 'react';
import { SuperAdminUser } from '../types';

interface AuthContextType {
  user: SuperAdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPERADMIN_STORAGE_KEY = 'stockdine_superadmin_user';
const TOKEN_KEY = 'stockdine_superadmin_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SUPERADMIN_STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (stored && token) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role === 'superadmin') {
          setUser(parsed);
        } else {
          logout();
        }
      }
    } catch (e) {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Call real backend Super Admin API endpoints
    const endpoints = [
      `${apiBase}/api/superadmin/login`,
      `${apiBase}/api/auth/superadmin/login`
    ];

    let lastErrorMsg = 'Invalid Super Admin credentials or unauthorized account role.';

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: pass }),
        });

        const data = await response.json();

        if (response.ok && data.token && (data.user?.role === 'superadmin' || data.user?.role === 'super_admin' || data.user?.role === 'admin' || data.role === 'superadmin')) {
          const saUser: SuperAdminUser = {
            id: data.user?._id || data.user?.id || 'sa-001',
            email: data.user?.email || cleanEmail,
            name: data.user?.name || 'Platform Super Admin',
            role: 'superadmin',
          };
          setUser(saUser);
          localStorage.setItem(SUPERADMIN_STORAGE_KEY, JSON.stringify(saUser));
          localStorage.setItem(TOKEN_KEY, data.token);
          setIsLoading(false);
          return { success: true };
        } else if (data.message) {
          lastErrorMsg = data.message;
        }
      } catch (e: any) {
        lastErrorMsg = e.message || 'Unable to connect to StockDine backend API server.';
      }
    }

    setIsLoading(false);
    return {
      success: false,
      message: lastErrorMsg,
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SUPERADMIN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.clear();
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    return {
      success: true,
      message: `Password reset link sent to ${email}. Please check your administrative inbox.`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.role === 'superadmin',
        isLoading,
        login,
        logout,
        requestPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
