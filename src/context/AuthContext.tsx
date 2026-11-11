import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, TOKEN_KEY, type User } from '../api';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from a saved token on page load.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false);
      return;
    }
    api<User>('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = ({ token, user }: { token: string; user: User }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  };

  const value: AuthState = {
    user,
    loading,
    login: async (email, password) =>
      handleAuth(await api('/auth/login', { method: 'POST', body: { email, password } })),
    register: async (name, email, password) =>
      handleAuth(await api('/auth/register', { method: 'POST', body: { name, email, password } })),
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
