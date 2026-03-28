import { pullFromCanister, seedSuperAdminIfNeeded } from "@/lib/canisterSync";
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
  isInitializing: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  // isInitializing = true while we're pulling from canister on startup
  const [isInitializing, setIsInitializing] = useState(true);

  // On mount: pull ALL data from canister, then seed superadmin if needed,
  // then restore session if there was one.
  useEffect(() => {
    async function init() {
      setIsInitializing(true);
      try {
        // Pull fresh data from canister — this overwrites localStorage cache
        await pullFromCanister();
        // If canister is empty (fresh deployment), seed superadmin
        await seedSuperAdminIfNeeded();
      } catch (e) {
        console.warn("[AUTH] Init sync failed, using local cache:", e);
        // If canister unreachable, still seed locally so login works
        await seedSuperAdminIfNeeded();
      } finally {
        // Restore session from localStorage session token
        const sessionId = localStorage.getItem("px_session");
        if (sessionId) {
          const user = storage.getUsers().find((u) => u.id === sessionId);
          if (user && user.active !== false) {
            setCurrentUser(user);
          } else {
            localStorage.removeItem("px_session");
          }
        }
        setIsInitializing(false);
      }
    }
    init();
  }, []);

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

      // Always pull fresh from canister before login
      // This ensures we see users created on other devices
      setIsSyncing(true);
      try {
        await pullFromCanister();
        await seedSuperAdminIfNeeded();
      } catch (e) {
        console.warn("[AUTH] Pre-login sync failed, using local:", e);
      } finally {
        setIsSyncing(false);
      }

      const user = storage.getUserByUsername(trimmedUsername);

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
    () => ({
      currentUser,
      companyId,
      login,
      logout,
      hasRole,
      isSyncing,
      isInitializing,
    }),
    [currentUser, companyId, login, logout, hasRole, isSyncing, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
