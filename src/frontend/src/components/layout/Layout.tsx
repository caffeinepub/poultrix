import { useAuth } from "@/context/AuthContext";
import type { User } from "@/lib/storage";
import { cn } from "@/lib/utils";
import {
  ArrowRightLeft,
  Bird,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  DollarSign,
  FileBarChart,
  GitBranch,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Receipt,
  ShoppingCart,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

type NavChild = { label: string; to: string; icon: React.ElementType };
type NavItem = {
  label: string;
  icon: React.ElementType;
  to?: string;
  children?: NavChild[];
  roles?: User["role"][];
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  {
    label: "Company Structure",
    icon: Globe,
    roles: ["SuperAdmin", "CompanyAdmin"],
    children: [
      { label: "Companies", to: "/companies", icon: Building2 },
      { label: "Zones", to: "/zones", icon: Globe },
      { label: "Branches", to: "/branches", icon: GitBranch },
    ],
  },
  {
    label: "Farm Management",
    icon: Building2,
    children: [
      { label: "Farms & Sheds", to: "/farms", icon: Building2 },
      { label: "Chick Placement", to: "/chicks", icon: Bird },
      { label: "Daily Entry", to: "/daily-entry", icon: ClipboardList },
    ],
  },
  {
    label: "Feed Management",
    icon: Package,
    roles: ["SuperAdmin", "CompanyAdmin", "Manager", "Supervisor"],
    children: [
      { label: "Feed Purchase", to: "/feed/purchase", icon: ShoppingCart },
      { label: "Feed Stock", to: "/feed/stock", icon: Package },
      { label: "Feed Issue", to: "/feed/issue", icon: ArrowRightLeft },
    ],
  },
  {
    label: "Finance",
    icon: DollarSign,
    roles: ["SuperAdmin", "CompanyAdmin", "Manager"],
    children: [
      { label: "Payments", to: "/finance/payments", icon: DollarSign },
      { label: "Receipts", to: "/finance/receipts", icon: Receipt },
    ],
  },
  { label: "Bird Sales", to: "/sales", icon: DollarSign },
  { label: "Reports", to: "/reports", icon: FileBarChart },
];

function NavGroup({
  item,
  role,
  onClose,
}: {
  item: NavItem;
  role: User["role"] | undefined;
  onClose: () => void;
}) {
  const location = useLocation();
  const isActive = item.children?.some((c) =>
    location.pathname.startsWith(c.to),
  );
  const [open, setOpen] = useState(isActive ?? false);

  if (item.roles && role && !item.roles.includes(role)) return null;

  if (!item.children) {
    return (
      <NavLink
        to={item.to!}
        onClick={onClose}
        data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
        className={({ isActive: a }) =>
          cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            a
              ? "bg-primary text-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent",
          )
        }
      >
        <item.icon size={18} />
        {item.label}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "text-primary"
            : "text-sidebar-foreground hover:bg-sidebar-accent",
        )}
      >
        <item.icon size={18} />
        <span className="flex-1 text-left">{item.label}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children.map((c) => (
            <NavLink
              key={c.to}
              to={c.to}
              onClick={onClose}
              data-ocid={`nav.${c.label.toLowerCase().replace(/\s+/g, "_").replace(/\//g, "_")}.link`}
              className={({ isActive: a }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  a
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )
              }
            >
              <c.icon size={16} />
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200",
          "lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bird size={18} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">
              Poultrix
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1"
            data-ocid="nav.close.button"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <NavGroup
              key={item.label}
              item={item}
              role={currentUser?.role}
              onClose={() => setSidebarOpen(false)}
            />
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {currentUser?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser?.role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="nav.logout.button"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b bg-card flex items-center px-4 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1"
            data-ocid="nav.menu.button"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-semibold text-foreground flex-1">
            Poultrix Farm Management
          </h1>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon size={14} />
            <span>{currentUser?.name}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {currentUser?.role}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
