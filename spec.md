# Poultrix

## Current State
- Farm Management has Farms (linked to Company/Zone/Branch) and Sheds tabs
- Farm type: id, name, location, totalCapacity, companyId, zoneId, branchId
- Shed type: id, name, farmId, capacity (no type or status fields)
- Batch type exists with batchNumber, placementDate, chicksQty, hatcheryName, breedType, chicksRate, status (active/sold/closed)
- Daily Entry is batch-linked with FCR auto-calc, medicine/vaccine dropdowns
- GC Production Book closes batches and calculates GC settlement
- Role-based access enforced via useAccessibleFarmIds()
- No Farm Dashboard page; no per-farm drill-down view
- No batch management UI in Farms page (batches managed via ChicksPlacement)

## Requested Changes (Diff)

### Add
- Farm profile fields: farmerName, farmerContact, address, supervisorId, dealerId, numberOfSheds
- Shed fields: shedType (Open/Environment Controlled), status (Active/Empty) with auto-update logic
- Batch fields: chick breed (Cobb/Ross/Hubbard), hatchery name, initial body weight (already partially present)
- Batch management tab in Farms page (list batches per shed, add new batch per shed, enforce one active batch per shed)
- FarmDashboard page: clickable per-farm card → opens farm-specific dashboard with active batches, bird balance, current FCR, mortality %, feed consumption
- Farm list clickable → navigate to /farms/:farmId/dashboard
- Batch closing merged with GC settlement: Close Batch button auto-triggers GC settlement calculation
- DailyEntry: show Age (days, auto-calculated from placement date), Birds Balance auto-calc, cumulative feed and FCR shown inline
- Storage methods: updateFarm, updateShed, getFarmById, getShedsByFarm, getActiveBatchByShed

### Modify
- Farms.tsx: add Batches tab, enhanced Add Farm dialog (farmerName, farmerContact, supervisorId, dealerId), enhanced Add Shed dialog (shedType, status), farm rows are clickable links to farm dashboard
- Sheds: status auto-derives from active batches (computed, not stored separately)
- storage.ts: extend Farm, Shed types; add updateFarm, getShedsByFarm, getActiveBatchByShed methods
- GCProduction.tsx: rename "Close Production Book" to "Close Batch & Settle" to reflect unified flow
- Layout.tsx / App.tsx: add /farm-dashboard/:farmId route for FarmDashboard

### Remove
- Nothing removed; all existing data and routes preserved

## Implementation Plan
1. Extend Farm type with farmerName, farmerContact, address, supervisorId, dealerId
2. Extend Shed type with shedType field
3. Add storage helper methods: updateFarm, getShedsByFarm, getActiveBatchByShed
4. Upgrade Farms.tsx: enhanced farm/shed dialogs, Batches tab (list + add per shed), farm rows clickable to farm dashboard, shed status computed from active batches
5. Create FarmDashboard.tsx page: KPI cards (active batches, bird count, FCR, mortality, feed consumption), batch detail table, role-based access guard
6. Update DailyEntry.tsx: show age in days, birds balance auto-calc display
7. Update App.tsx: add /farm-dashboard/:farmId route
8. Update Layout.tsx: navigation entry for Farm Dashboard (or rely on Farms page links)
9. Validate build and deploy
