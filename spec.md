# Poultrix

## Current State
Poultrix uses localStorage as primary storage with canister as a sync target.
- `storage.ts` `get()`/`set()` functions read/write localStorage
- `set()` calls `pushToCanister()` (fire-and-forget) after every write
- `AuthContext` calls `pullFromCanister()` on startup and login to load canister data into localStorage
- `canisterSync.ts` defines KEY_MAP mapping localStorage keys → canister methods

## Requested Changes (Diff)

### Add
- Add missing localStorage key mappings to KEY_MAP (GC schemes, GC settlements, sub-payments, sub-invoices, sub-notifications, ledger entries, pending settlements, medicines, vaccines, receipts)
- Add canister collections for missing data types (gcSchemesJson, gcSettlementsJson, pendingSettlementsJson, ledgerEntriesJson, etc.)

### Modify
- Fix 3 KEY_MAP key mismatches in canisterSync.ts:
  - `px_daily_entries` → `px_daily` (daily entries)
  - `px_feed_stocks` → `px_feed_stock` (feed stock)
  - `px_bird_sales` → `px_sales` (bird sales)
- Fix pullFromCanister() to correctly map canister export keys back to the right localStorage keys
- Make critical writes (addUser, updateUser, addSignupRequest, approveSignupRequest) use awaited pushCollectionToCanister instead of fire-and-forget
- On app startup (init), clear stale localStorage before loading from canister to prevent inconsistency
- Seed superadmin directly to canister on first run

### Remove
- Remove any leftover hardcoded credentials from UI (if found)

## Implementation Plan
1. Fix canisterSync.ts KEY_MAP mismatches and add missing mappings
2. Update pullFromCanister() to use correct key mappings
3. Add missing stable vars and setters/getters to main.mo backend
4. Make signup and user management operations push to canister synchronously
5. Update storage.ts seed function to push superadmin to canister on first run
6. Test cross-device data consistency
