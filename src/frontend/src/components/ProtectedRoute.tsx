import { useAuth } from "@/context/AuthContext";
import type { User } from "@/lib/storage";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  roles?: User["role"][];
};

export default function ProtectedRoute({ children, roles }: Props) {
  const { currentUser } = useAuth();

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
