/**
 * canisterSync.ts
 * Syncs localStorage data to/from the Motoko backend canister.
 * This enables cross-device data access: any browser/device sees the same data.
 */

import { createActorWithConfig } from "@/config";

// Maps localStorage key → { setterSuffix for canister method, exportKey in exportAll() }
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
 * Push a single collection to the canister (fire-and-forget, never blocks UI).
 * Called after every localStorage write in storage.ts.
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
 * Pull ALL collections from the canister and merge into localStorage.
 * Called on login so any device sees the same data.
 * Only overwrites a collection if the canister has non-empty data for it.
 * Returns true if any data was pulled, false if canister is empty.
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
      "[SYNC] Pull from canister:",
      anyData ? "data loaded" : "canister is empty, using local seed data",
    );
    return anyData;
  } catch (e) {
    console.warn("[SYNC] Pull from canister failed:", e);
    return false;
  }
}

/**
 * Push ALL current localStorage data to the canister at once.
 * Useful for initial migration from a device that already has data.
 */
export async function pushAllToCanister(): Promise<void> {
  try {
    const actor = await createActorWithConfig();
    for (const [lsKey, mapping] of Object.entries(KEY_MAP)) {
      const raw = localStorage.getItem(lsKey);
      const data = raw ? (JSON.parse(raw) as unknown[]) : [];
      if (data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setterFn = (actor as any)[`set${mapping.suffix}`] as (
          json: string,
        ) => Promise<void>;
        if (typeof setterFn === "function") {
          await setterFn.call(actor, JSON.stringify(data));
        }
      }
    }
    console.log("[SYNC] Full push to canister complete");
  } catch (e) {
    console.warn("[SYNC] Full push failed:", e);
  }
}
