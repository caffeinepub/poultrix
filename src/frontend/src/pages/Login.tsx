import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { storage } from "@/lib/storage";
import {
  Bird,
  ClipboardList,
  DollarSign,
  Droplets,
  Heart,
  LayoutDashboard,
  Pill,
  Scale,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const highlights = [
  { icon: Bird, label: "Chick Batch Management" },
  { icon: ClipboardList, label: "Daily Farm Data Entry" },
  { icon: Scale, label: "Feed & FCR Tracking" },
  { icon: Heart, label: "Mortality Monitoring" },
  { icon: Pill, label: "Medicine Management" },
  { icon: LayoutDashboard, label: "Farm Performance Dashboard" },
  { icon: DollarSign, label: "Financial & Expense Tracking" },
  { icon: Droplets, label: "Real-Time Analytics" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = login(username.trim(), password.trim());
    setLoading(false);
    if (ok) {
      const user = storage.getUserByUsername(username.trim());
      if (
        user?.role === "SuperAdmin" ||
        user?.role === "CompanyAdmin" ||
        user?.role === "Manager"
      ) {
        navigate("/dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } else {
      setError("Invalid credentials. Check your username/email and password.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #f0fdf4 100%)",
      }}
    >
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Info Section */}
        <div className="lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-20 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #16a34a, transparent)",
              transform: "translate(-40%, -40%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #15803d, transparent)",
              transform: "translate(30%, 30%)",
            }}
          />

          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
              style={{
                background: "linear-gradient(135deg, #16a34a, #15803d)",
              }}
            >
              <Bird size={24} className="text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold" style={{ color: "#15803d" }}>
                Poultrix
              </span>
              <div className="text-xs font-medium" style={{ color: "#16a34a" }}>
                Smart Poultry Farm Management
              </div>
            </div>
          </div>

          <h1
            className="text-3xl xl:text-4xl font-bold leading-tight mb-4"
            style={{ color: "#14532d" }}
          >
            Poultrix – Smart Poultry Farm
            <br />
            <span style={{ color: "#16a34a" }}>Management Platform</span>
          </h1>

          <p
            className="text-sm leading-relaxed mb-8 max-w-lg"
            style={{ color: "#166534" }}
          >
            Poultrix is an advanced digital platform designed for poultry
            companies, dealers, and farmers to manage their farms efficiently.
            The system helps track chick placement, daily farm data, feed
            consumption, mortality, body weight, FCR performance, medicine
            usage, and financial records in one place.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-lg">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(22,163,74,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                  }}
                >
                  <Icon size={16} style={{ color: "#16a34a" }} />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: "#166534" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image + Login Card */}
        <div className="lg:w-1/2 relative flex items-center justify-center py-12 px-6 lg:px-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/assets/generated/poultry-farm-hero.dim_900x700.jpg')`,
              opacity: 0.25,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(240,253,244,0.6) 0%, rgba(187,247,208,0.4) 50%, rgba(21,128,61,0.3) 100%)",
            }}
          />

          <div
            className="relative w-full max-w-sm rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 20px 60px rgba(21,128,61,0.15), 0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(22,163,74,0.15)",
            }}
          >
            <div className="text-center mb-8">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-md"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                }}
              >
                <Bird size={26} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "#14532d" }}>
                Welcome Back
              </h2>
              <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                Sign in to your Poultrix account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold"
                  style={{ color: "#374151" }}
                >
                  Email / Username
                </Label>
                <Input
                  id="username"
                  data-ocid="login.input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  autoComplete="username"
                  required
                  className="mt-1.5 h-11 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold"
                    style={{ color: "#374151" }}
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-xs font-medium hover:underline"
                    style={{ color: "#16a34a" }}
                    data-ocid="login.secondary_button"
                  >
                    Forgot Password?
                  </button>
                </div>
                <Input
                  id="password"
                  data-ocid="login.password.input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-11 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {error && (
                <p
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5"
                  data-ocid="login.error_state"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                disabled={loading}
                data-ocid="login.submit_button"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  border: "none",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p
              className="text-xs text-center mt-5"
              style={{ color: "#9ca3af" }}
            >
              Default:{" "}
              <span
                className="font-mono font-medium"
                style={{ color: "#6b7280" }}
              >
                superadmin / Admin@123
              </span>
            </p>
          </div>
        </div>
      </div>

      <footer
        className="py-4 text-center"
        style={{
          borderTop: "1px solid rgba(22,163,74,0.15)",
          background: "rgba(255,255,255,0.6)",
        }}
      >
        <p className="text-xs font-medium" style={{ color: "#6b7280" }}>
          Poultrix – Smart Automation for Poultry Business Management.
        </p>
      </footer>
    </div>
  );
}
