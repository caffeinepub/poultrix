import { pullFromCanister } from "@/lib/canisterSync";
import { type User, storage } from "@/lib/storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type LoginResult = {
  success: boolean;
  error?:
    | "user_not_found"
    | "wrong_password"
    | "inactive"
    | "account_pending"
    | "account_rejected";
};

type AuthContextType = {
  currentUser: User | null;
  companyId: string | undefined;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  hasRole: (roles: User["role"][]) => boolean;
  isSyncing: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const sessionId = localStorage.getItem("px_session");
    if (!sessionId) return null;
    return storage.getUsers().find((u) => u.id === sessionId) ?? null;
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("px_session", currentUser.id);
    } else {
      localStorage.removeItem("px_session");
    }
  }, [currentUser]);

  const login = useCallback(
    async (username: string, password: string): Promise<LoginResult> => {
      const trimmedUsername = username.trim().toLowerCase();
      const trimmedPassword = password.trim();

      console.log("[AUTH] Login attempt:", { username: trimmedUsername });

      // First try localStorage (has seeded users)
      let user = storage.getUserByUsername(trimmedUsername);

      // If not found locally, pull from canister and retry
      // This handles cross-device login where user was created on another device
      if (!user) {
        console.log("[AUTH] User not found locally, pulling from canister...");
        setIsSyncing(true);
        await pullFromCanister();
        setIsSyncing(false);
        user = storage.getUserByUsername(trimmedUsername);
      }

      console.log(
        "[AUTH] User found:",
        user
          ? {
              username: user.username,
              role: user.role,
              companyId: user.companyId,
            }
          : "NOT FOUND",
      );

      if (!user) {
        return { success: false, error: "user_not_found" };
      }
      if (user.signupStatus === "pending") {
        return { success: false, error: "account_pending" };
      }
      if (user.signupStatus === "rejected") {
        return { success: false, error: "account_rejected" };
      }
      if (user.active === false) {
        return { success: false, error: "inactive" };
      }
      if (user.password !== trimmedPassword) {
        return { success: false, error: "wrong_password" };
      }

      // Pull all data from canister in background after login
      // so all modules show the same data as on other devices
      pullFromCanister().catch(() => {});

      setCurrentUser(user);
      return { success: true };
    },
    [],
  );

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
    () => ({ currentUser, companyId, login, logout, hasRole, isSyncing }),
    [currentUser, companyId, login, logout, hasRole, isSyncing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
