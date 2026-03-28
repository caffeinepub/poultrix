/**
 * canisterSync.ts
 * Canister is the SINGLE SOURCE OF TRUTH.
 * localStorage is used only as a local cache for performance.
 */

import { createActorWithConfig } from "@/config";

const KEY_MAP: Record<string, { suffix: string; exportKey: string }> = {
  px_users: { suffix: "Users", exportKey: "users" },
  px_companies: { suffix: "Companies", exportKey: "companies" },
  px_zones: { suffix: "Zones", exportKey: "zones" },
  px_branches: { suffix: "Branches", exportKey: "branches" },
  px_farms: { suffix: "Farms", exportKey: "farms" },
  px_sheds: { suffix: "Sheds", exportKey: "sheds" },
  px_batches: { suffix: "Batches", exportKey: "batches" },
  px_daily_entries: { suffix: "DailyEntries", exportKey: "dailyEntries" },
  px_feed_types: { suffix: "FeedTypes", exportKey: "feedTypes" },
  px_feed_suppliers: { suffix: "FeedSuppliers", exportKey: "feedSuppliers" },
  px_feed_purchases: { suffix: "FeedPurchases", exportKey: "feedPurchases" },
  px_feed_stocks: { suffix: "FeedStocks", exportKey: "feedStocks" },
  px_feed_issues: { suffix: "FeedIssues", exportKey: "feedIssues" },
  px_bird_sales: { suffix: "BirdSales", exportKey: "birdSales" },
  px_expenses: { suffix: "Expenses", exportKey: "expenses" },
  px_signup_requests: { suffix: "SignupRequests", exportKey: "signupRequests" },
  px_audit_logs: { suffix: "AuditLogs", exportKey: "auditLogs" },
  px_payments: { suffix: "Payments", exportKey: "payments" },
  px_subscriptions: { suffix: "Subscriptions", exportKey: "subscriptions" },
  px_notifications: { suffix: "Notifications", exportKey: "notifications" },
};

/**
 * Push a single collection to the canister.
 * Called after every localStorage write so canister stays in sync.
 */
export function pushToCanister(key: string, data: unknown[]): void {
  const mapping = KEY_MAP[key];
  if (!mapping) return;

  createActorWithConfig()
    .then((actor) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const setterFn = (actor as any)[`set${mapping.suffix}`] as (
        json: string,
      ) => Promise<void>;
      if (typeof setterFn === "function") {
        return setterFn.call(actor, JSON.stringify(data));
      }
    })
    .catch((e) => {
      console.warn(`[SYNC] Push failed for ${key}:`, e);
    });
}

/**
 * Pull ALL collections from the canister and overwrite localStorage.
 * This is called on app startup and after login.
 * Returns the users array if found, so AuthContext can restore session.
 */
export async function pullFromCanister(): Promise<boolean> {
  try {
    const actor = await createActorWithConfig();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allJson = (await (actor as any).exportAll()) as string;
    const all = JSON.parse(allJson) as Record<string, unknown[]>;

    let anyData = false;
    for (const [lsKey, mapping] of Object.entries(KEY_MAP)) {
      const data = all[mapping.exportKey];
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(lsKey, JSON.stringify(data));
        anyData = true;
      }
    }

    console.log(
      "[SYNC] Canister pull:",
      anyData ? "data loaded" : "canister is empty",
    );
    return anyData;
  } catch (e) {
    console.warn("[SYNC] Pull from canister failed:", e);
    return false;
  }
}

/**
 * Push a specific collection by key (awaited version for critical ops).
 */
export async function pushCollectionToCanister(
  key: string,
  data: unknown[],
): Promise<void> {
  const mapping = KEY_MAP[key];
  if (!mapping) return;
  try {
    const actor = await createActorWithConfig();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setterFn = (actor as any)[`set${mapping.suffix}`] as (
      json: string,
    ) => Promise<void>;
    if (typeof setterFn === "function") {
      await setterFn.call(actor, JSON.stringify(data));
      console.log(`[SYNC] Pushed ${key} to canister (${data.length} records)`);
    }
  } catch (e) {
    console.warn(`[SYNC] Critical push failed for ${key}:`, e);
  }
}

/**
 * Seed the superadmin user into the canister if it doesn't exist.
 * Called once on app startup after pulling from canister.
 */
export async function seedSuperAdminIfNeeded(): Promise<void> {
  try {
    const raw = localStorage.getItem("px_users");
    const users = raw ? (JSON.parse(raw) as Array<{ username?: string }>) : [];
    const hasSuperAdmin = users.some(
      (u) => u.username?.toLowerCase() === "superadmin",
    );
    if (!hasSuperAdmin) {
      const newUsers = [
        {
          id: "sa-1",
          username: "superadmin",
          password: "Admin@123",
          role: "SuperAdmin",
          name: "Super Admin",
          employeeId: "EMP-001",
          active: true,
        },
        ...users,
      ];
      localStorage.setItem("px_users", JSON.stringify(newUsers));
      await pushCollectionToCanister("px_users", newUsers);
      console.log("[SEED] SuperAdmin seeded into canister");
    }
  } catch (e) {
    console.warn("[SEED] Seed failed:", e);
  }
}
