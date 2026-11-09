// État d'authentification partagé par toute l'application.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchMe, loginWithGoogle, type User } from '../api/auth';
import { getToken, setToken } from './tokenStorage';

interface AuthState {
  user: User | null;
  loading: boolean;
  loginWithGoogleCredential: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => getToken() !== null);

  // Au chargement : si un jeton existe, on récupère l'utilisateur correspondant.
  useEffect(() => {
    if (!getToken()) return;
    fetchMe()
      .then((me) => {
        if (!me) setToken(null);
        setUser(me);
      })
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const loginWithGoogleCredential = useCallback(async (credential: string) => {
    const { token, user: loggedIn } = await loginWithGoogle(credential);
    setToken(token);
    setUser(loggedIn);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    window.google?.accounts.id.disableAutoSelect();
  }, []);

  const value = useMemo(
    () => ({ user, loading, loginWithGoogleCredential, logout }),
    [user, loading, loginWithGoogleCredential, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
