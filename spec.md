# Poultrix – Signup & Admin Approval Workflow

## Current State
- Login page has a single "Login" button in the header that opens a centered modal
- Modal has Username + Password fields only
- Footer shows `sukhvinderprofess@gmail.com`
- User type includes `active?: boolean` for enabling/disabling accounts
- No signup flow exists; users are only created by admins from User Management or My Team
- No pending/rejected status on users

## Requested Changes (Diff)

### Add
- `SignupRequest` type in storage.ts with fields: id, fullName, mobileNumber, email, farmName, state, city, role (Farmer/Dealer/Company), birdCapacity (integer), password, status (pending/approved/rejected), createdAt, userId (set on approval)
- `getSignupRequests()`, `addSignupRequest()`, `updateSignupRequest()` storage methods
- `SignupRequests.tsx` admin page listing all pending signup requests with Approve/Reject actions
- On approval: auto-generate userId (FARM001, DEALER001, ADM001 format with incrementing counter), set status=approved, create User record with active=true, status='active'
- On rejection: set status=rejected
- `Signup.tsx` — dedicated signup modal triggered by "Sign Up" button (NOT the login modal)
- Sign Up button in the header next to Login button (separate, not merged)
- Support email updated to `poultrixindia@gmail.com` with clickable mailto link in footer
- Route `/signup-requests` for SignupRequests page
- Sidebar entry "Signup Requests" visible to SuperAdmin only

### Modify
- `Login.tsx` — Add separate "Sign Up" button in header (next to Login), update footer email to `poultrixindia@gmail.com` with mailto link
- `AuthContext.tsx` — login() checks for signup status: if user has `signupStatus='pending'` → error `account_pending`; if `signupStatus='rejected'` → error `account_rejected`. Only `active=true` users can login.
- `storage.ts` — Add SignupRequest type/storage, add `signupStatus` field to User type
- `App.tsx` — Add `/signup-requests` route (SuperAdmin protected)
- Sidebar — Add "Signup Requests" link under Users section for SuperAdmin

### Remove
- Old contact email `sukhvinderprofess@gmail.com` from footer (replace with new one)

## Implementation Plan
1. Add `SignupRequest` type + storage methods to `storage.ts`; add `signupStatus` to User type
2. Update `AuthContext.tsx` login to return pending/rejected errors and check signupStatus
3. Create `Signup.tsx` with all required fields and pending confirmation screen
4. Update `Login.tsx` — add Sign Up button, update email in footer, update error messages
5. Create `SignupRequests.tsx` admin page with approval/rejection and auto userId generation
6. Update `App.tsx` with new route and sidebar with new nav link
