import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import BirdSales from "./pages/BirdSales";
import Branches from "./pages/Branches";
import ChicksPlacement from "./pages/ChicksPlacement";
import Companies from "./pages/Companies";
import DailyEntry from "./pages/DailyEntry";
import Dashboard from "./pages/Dashboard";
import FarmDashboard from "./pages/FarmDashboard";
import Farms from "./pages/Farms";
import FeedIssue from "./pages/FeedIssue";
import FeedPurchase from "./pages/FeedPurchase";
import FeedStock from "./pages/FeedStock";
import GCProduction from "./pages/GCProduction";
import GCSchemes from "./pages/GCSchemes";
import GCSettlementReport from "./pages/GCSettlementReport";
import Login from "./pages/Login";
import Payments from "./pages/Payments";
import PerformanceReport from "./pages/PerformanceReport";
import Receipts from "./pages/Receipts";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import Zones from "./pages/Zones";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="farms" element={<Farms />} />
            <Route
              path="farm-dashboard/:farmId"
              element={
                <ProtectedRoute>
                  <FarmDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="chicks" element={<ChicksPlacement />} />
            <Route path="daily-entry" element={<DailyEntry />} />
            <Route path="feed/purchase" element={<FeedPurchase />} />
            <Route path="feed/stock" element={<FeedStock />} />
            <Route path="feed/issue" element={<FeedIssue />} />
            <Route path="sales" element={<BirdSales />} />
            <Route path="reports" element={<Reports />} />
            <Route
              path="performance-report"
              element={
                <ProtectedRoute
                  roles={[
                    "SuperAdmin",
                    "CompanyAdmin",
                    "Manager",
                    "Supervisor",
                    "Farmer",
                    "Dealer",
                  ]}
                >
                  <PerformanceReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute roles={["SuperAdmin", "CompanyAdmin"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="companies"
              element={
                <ProtectedRoute roles={["SuperAdmin"]}>
                  <Companies />
                </ProtectedRoute>
              }
            />
            <Route
              path="zones"
              element={
                <ProtectedRoute roles={["SuperAdmin", "CompanyAdmin"]}>
                  <Zones />
                </ProtectedRoute>
              }
            />
            <Route
              path="branches"
              element={
                <ProtectedRoute roles={["SuperAdmin", "CompanyAdmin"]}>
                  <Branches />
                </ProtectedRoute>
              }
            />
            <Route
              path="finance/payments"
              element={
                <ProtectedRoute
                  roles={["SuperAdmin", "CompanyAdmin", "Manager"]}
                >
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="finance/receipts"
              element={
                <ProtectedRoute
                  roles={["SuperAdmin", "CompanyAdmin", "Manager"]}
                >
                  <Receipts />
                </ProtectedRoute>
              }
            />
            <Route
              path="gc/schemes"
              element={
                <ProtectedRoute roles={["SuperAdmin", "CompanyAdmin"]}>
                  <GCSchemes />
                </ProtectedRoute>
              }
            />
            <Route
              path="gc/production"
              element={
                <ProtectedRoute
                  roles={[
                    "SuperAdmin",
                    "CompanyAdmin",
                    "Manager",
                    "Supervisor",
                  ]}
                >
                  <GCProduction />
                </ProtectedRoute>
              }
            />
            <Route
              path="gc/settlement-report"
              element={
                <ProtectedRoute
                  roles={[
                    "SuperAdmin",
                    "CompanyAdmin",
                    "Manager",
                    "Supervisor",
                    "Farmer",
                  ]}
                >
                  <GCSettlementReport />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
