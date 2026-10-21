import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "@/src/services/api";
import type { User } from "@/src/schemas/food";
type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const users = await api.signIn(email, password);
      const nextUser = users[0];
      if (!nextUser) {
        return false;
      }
      setUser(nextUser);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };
  const value = useMemo(
    () => ({ user, loading, signIn, signOut: () => setUser(null) }),
    [user, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
