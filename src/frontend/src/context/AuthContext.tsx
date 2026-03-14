import { type User, storage } from "@/lib/storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextType = {
  currentUser: User | null;
  companyId: string | undefined;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasRole: (roles: User["role"][]) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const sessionId = localStorage.getItem("px_session");
    if (!sessionId) return null;
    return storage.getUsers().find((u) => u.id === sessionId) ?? null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("px_session", currentUser.id);
    } else {
      localStorage.removeItem("px_session");
    }
  }, [currentUser]);

  const login = useCallback((username: string, password: string): boolean => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    console.log("[AUTH] Attempting login for:", trimmedUsername);

    const user = storage.getUserByUsername(trimmedUsername);

    console.log("[AUTH] Found user:", user ? user.username : "NOT FOUND");
    console.log(
      "[AUTH] Password match:",
      user ? user.password === trimmedPassword : false,
    );
    console.log("[AUTH] User active:", user?.active);

    if (user && user.password === trimmedPassword && user.active !== false) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: User["role"][]) => {
      if (!currentUser) return false;
      return roles.includes(currentUser.role);
    },
    [currentUser],
  );

  const companyId = currentUser?.companyId;

  const value = useMemo(
    () => ({ currentUser, companyId, login, logout, hasRole }),
    [currentUser, companyId, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
