import { useAuth } from "@/context/AuthContext";
import { Navigate } from "@/lib/react-router-compat";
import type { User } from "@/lib/storage";

type Props = {
  children: React.ReactNode;
  roles?: User["role"][];
};

export default function ProtectedRoute({ children, roles }: Props) {
  const { currentUser, isInitializing } = useAuth();

  // While pulling data from canister on startup, show a loading screen
  // instead of immediately redirecting to login
  if (isInitializing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading Poultrix...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
