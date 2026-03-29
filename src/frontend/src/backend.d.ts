import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type FarmId = bigint;
export interface Farm {
    id: FarmId;
    name: string;
    location: string;
    totalCapacity: bigint;
}
export interface Batch {
    id: BatchId;
    status: string;
    shedId: ShedId;
    hatcheryName: string;
    chicksQty: bigint;
    placementDate: bigint;
    birdsAlive: bigint;
    totalPlacementCost: bigint;
    batchNumber: string;
    transportCost: bigint;
    breedType: string;
    chicksRate: bigint;
    farmId: FarmId;
}
export interface Shed {
    id: ShedId;
    name: string;
    capacity: bigint;
    farmId: FarmId;
}
export type ShedId = bigint;
export type BatchId = bigint;
export interface backendInterface {
    createBatch(placementDate: bigint, hatcheryName: string, breedType: string, chicksQty: bigint, chicksRate: bigint, transportCost: bigint, totalPlacementCost: bigint, farmId: FarmId, shedId: ShedId): Promise<BatchId>;
    createFarm(name: string, location: string, totalCapacity: bigint): Promise<FarmId>;
    createShed(farmId: FarmId, name: string, capacity: bigint): Promise<ShedId>;
    getBatch(id: BatchId): Promise<Batch | null>;
    getFarm(id: FarmId): Promise<Farm | null>;
    getShed(id: ShedId): Promise<Shed | null>;
    updateBirdsAlive(batchId: BatchId, birdsAlive: bigint): Promise<void>;
    exportAll(): Promise<string>;
    // Users
    setUsers(json: string): Promise<undefined>;
    getUsers(): Promise<string>;
    // Companies
    setCompanies(json: string): Promise<undefined>;
    getCompanies(): Promise<string>;
    // Zones
    setZones(json: string): Promise<undefined>;
    getZones(): Promise<string>;
    // Branches
    setBranches(json: string): Promise<undefined>;
    getBranches(): Promise<string>;
    // Farms
    setFarms(json: string): Promise<undefined>;
    getFarms(): Promise<string>;
    // Sheds
    setSheds(json: string): Promise<undefined>;
    getSheds(): Promise<string>;
    // Batches
    setBatches(json: string): Promise<undefined>;
    getBatches(): Promise<string>;
    // Daily Entries
    setDailyEntries(json: string): Promise<undefined>;
    getDailyEntries(): Promise<string>;
    // Feed Types
    setFeedTypes(json: string): Promise<undefined>;
    getFeedTypes(): Promise<string>;
    // Feed Suppliers
    setFeedSuppliers(json: string): Promise<undefined>;
    getFeedSuppliers(): Promise<string>;
    // Feed Purchases
    setFeedPurchases(json: string): Promise<undefined>;
    getFeedPurchases(): Promise<string>;
    // Feed Stocks
    setFeedStocks(json: string): Promise<undefined>;
    getFeedStocks(): Promise<string>;
    // Feed Issues
    setFeedIssues(json: string): Promise<undefined>;
    getFeedIssues(): Promise<string>;
    // Bird Sales
    setBirdSales(json: string): Promise<undefined>;
    getBirdSales(): Promise<string>;
    // Expenses
    setExpenses(json: string): Promise<undefined>;
    getExpenses(): Promise<string>;
    // Signup Requests
    setSignupRequests(json: string): Promise<undefined>;
    getSignupRequests(): Promise<string>;
    // Audit Logs
    setAuditLogs(json: string): Promise<undefined>;
    getAuditLogs(): Promise<string>;
    // Payments
    setPayments(json: string): Promise<undefined>;
    getPayments(): Promise<string>;
    // Subscriptions
    setSubscriptions(json: string): Promise<undefined>;
    getSubscriptions(): Promise<string>;
    // Notifications
    setNotifications(json: string): Promise<undefined>;
    getNotifications(): Promise<string>;
    // Medicines
    setMedicines(json: string): Promise<undefined>;
    getMedicines(): Promise<string>;
    // Vaccines
    setVaccines(json: string): Promise<undefined>;
    getVaccines(): Promise<string>;
    // Receipts
    setReceipts(json: string): Promise<undefined>;
    getReceipts(): Promise<string>;
    // GC Schemes
    setGcSchemes(json: string): Promise<undefined>;
    getGcSchemes(): Promise<string>;
    // GC Settlements
    setGcSettlements(json: string): Promise<undefined>;
    getGcSettlements(): Promise<string>;
    // Pending Settlements
    setPendingSettlements(json: string): Promise<undefined>;
    getPendingSettlements(): Promise<string>;
    // Ledger Entries
    setLedgerEntries(json: string): Promise<undefined>;
    getLedgerEntries(): Promise<string>;
    // Sub Payments
    setSubPayments(json: string): Promise<undefined>;
    getSubPayments(): Promise<string>;
    // Sub Invoices
    setSubInvoices(json: string): Promise<undefined>;
    getSubInvoices(): Promise<string>;
    // Sub Notifications
    setSubNotifications(json: string): Promise<undefined>;
    getSubNotifications(): Promise<string>;
}
