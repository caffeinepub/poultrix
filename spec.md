# Poultrix

## Current State
- Data stored in localStorage as primary, canister as secondary (manual migration required)
- Multiple seeded users hardcoded in storage.ts (superadmin, demo1990, sukhvinder9929, admin123, supervisor01, testadmin, etc.)
- On login, canister pull only happens if user not found locally
- pushToCanister is fire-and-forget and may silently fail
- Cross-device sync works only if user manually clicks 'Push All Data to Cloud'
- App re-seeds all users from code on every page load, which can overwrite canister data

## Requested Changes (Diff)

### Add
- App-level initialization that ALWAYS pulls data from canister on startup before any UI renders
- On every storage write (addUser, addFarm, etc.), push the updated collection to canister reliably
- Single-device login: store active session token in canister; second login shows 'You are logged in on another device. Continue here?'
- On login: full canister pull overwrites localStorage completely (no merge, fresh load)

### Modify
- storage.ts: Remove ALL seeded users except superadmin / Admin@123. Remove all other seed data. Canister is source of truth.
- AuthContext.tsx: On app init, pull from canister before resolving session. Login always pulls fresh from canister.
- canisterSync.ts: More reliable push with proper error handling. Push is awaited (not fire-and-forget) for critical operations like user creation.
- Login.tsx: After signup approval, user is written to canister immediately.
- SignupRequests.tsx: On approve, push updated users to canister immediately.

### Remove
- All seeded users in storage.ts except superadmin
- All seeded companies, farms, sheds, batches, daily entries in storage.ts
- DataMigration.tsx page (no longer needed - canister is always the source)
- DataMigration route in App.tsx
- DataMigration link in sidebar

## Implementation Plan
1. Rewrite canisterSync.ts: pullFromCanister clears localStorage and loads fresh from canister. pushToCanister awaits and retries once on failure.
2. Rewrite storage.ts: Only seed superadmin user if no users found in canister. Remove all other seed data.
3. Rewrite AuthContext.tsx: On mount, always pull from canister first. On login, do fresh canister pull. Store session token in canister for single-device enforcement.
4. Update SignupRequests.tsx: After approve/reject, push users collection to canister.
5. Remove DataMigration page and its sidebar link.
6. Validate and deploy.
