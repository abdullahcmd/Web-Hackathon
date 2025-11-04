import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Backend user shape
export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  role?: "admin" | "farmer" | string;
  region?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser, token?: string) => void; // allow pages to set
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);

    // react to storage changes across tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth_user") {
        const v = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(v);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (u: AuthUser, token?: string) => {
    localStorage.setItem("auth_user", JSON.stringify(u));
    if (token) localStorage.setItem("auth_token", token);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    setUser(null);
    // Ensure UI returns to login immediately, regardless of route guards
    if (typeof window !== "undefined") {
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
