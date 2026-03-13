export type Farm = {
  id: string;
  name: string;
  location: string;
  totalCapacity: number;
  companyId?: string;
  zoneId?: string;
  branchId?: string;
  farmerName?: string;
  farmerContact?: string;
  address?: string;
  supervisorId?: string;
  dealerId?: string;
};
export type Shed = {
  id: string;
  name: string;
  farmId: string;
  capacity: number;
  shedType?: "Open" | "Environment Controlled";
};
export type Batch = {
  id: string;
  batchNumber: string;
  farmId: string;
  shedId: string;
  placementDate: string;
  hatcheryName: string;
  breedType: string;
  chicksQty: number;
  chicksRate: number;
  transportCost: number;
  totalPlacementCost: number;
  birdsAlive: number;
  status: "active" | "sold" | "closed";
  initialBodyWeightGrams?: number;
};
export type DailyEntry = {
  id: string;
  batchId: string;
  entryDate: string;
  birdsAlive: number;
  mortalityCount: number;
  cullBirds: number;
  feedIntakeGrams: number;
  bodyWeightGrams: number;
  waterConsumptionLiters: number;
  fcr: number;
  mortalityPct: number;
  cumulativeFeed: number;
  medicineUsed?: string;
  vaccineUsed?: string;
  remarks?: string;
};
export type FeedPurchase = {
  id: string;
  supplierName: string;
  feedType: string;
  quantityBags: number;
  ratePerBag: number;
  discountAmount: number;
  totalAmount: number;
  purchaseDate: string;
};
export type FeedStock = {
  id: string;
  farmId: string;
  feedType: string;
  currentStockBags: number;
  alertThresholdBags: number;
};
export type FeedIssue = {
  id: string;
  farmId: string;
  shedId: string;
  feedType: string;
  quantityBags: number;
  issueDate: string;
};
export type BirdSale = {
  id: string;
  farmId: string;
  batchId: string;
  birdsQty: number;
  avgWeightKg: number;
  ratePerKg: number;
  totalWeightKg: number;
  totalAmount: number;
  traderName: string;
  vehicleNumber: string;
  dispatchDate: string;
};
export type User = {
  id: string;
  username: string;
  password: string;
  role:
    | "SuperAdmin"
    | "CompanyAdmin"
    | "Dealer"
    | "Farmer"
    | "Manager"
    | "Supervisor"
    | "Staff";
  companyId?: string;
  name: string;
  assignedFarmIds?: string[];
  assignedZoneIds?: string[];
  assignedBranchIds?: string[];
  assignedShedId?: string;
  active?: boolean;
};
export type Company = {
  id: string;
  name: string;
  address: string;
};
export type Zone = {
  id: string;
  companyId: string;
  name: string;
};
export type Branch = {
  id: string;
  zoneId: string;
  companyId: string;
  name: string;
};
export type Medicine = {
  id: string;
  name: string;
};
export type Vaccine = {
  id: string;
  name: string;
};
export type Payment = {
  id: string;
  date: string;
  farmId: string;
  amount: number;
  paymentType: "Cash" | "Online";
  description: string;
  enteredBy: string;
};
export type Receipt = {
  id: string;
  date: string;
  farmId: string;
  amount: number;
  paymentType: "Cash" | "Online";
  notes: string;
  enteredBy: string;
};
export type GCScheme = {
  id: string;
  companyId: string;
  name: string;
  baseGCRate: number;
  standardFCR: number;
  standardMortalityPct: number;
  fcrBonusPerBird: number;
  mortalityPenaltyPerBird: number;
};
export type GCSettlement = {
  id: string;
  batchId: string;
  batchNumber: string;
  farmId: string;
  schemeId: string;
  birdsPlaced: number;
  birdsSold: number;
  mortalityCount: number;
  mortalityPct: number;
  totalFeedKg: number;
  avgBodyWeightKg: number;
  finalFCR: number;
  gcRatePerBird: number;
  fcrBonus: number;
  mortalityPenalty: number;
  totalGCPayable: number;
  closedAt: string;
  closedBy: string;
};

function get<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}
function set<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Seed default superadmin
function seedUsers() {
  const users = get<User>("px_users");
  if (users.length === 0) {
    set("px_users", [
      {
        id: "sa-1",
        username: "superadmin",
        password: "Admin@123",
        role: "SuperAdmin",
        name: "Super Admin",
        active: true,
      },
    ]);
  }
}
seedUsers();

export const storage = {
  // Users
  getUsers: () => get<User>("px_users"),
  addUser: (u: Omit<User, "id">) => {
    const d = get<User>("px_users");
    const n = { ...u, id: uid() };
    set("px_users", [...d, n]);
    return n;
  },
  updateUser: (id: string, updates: Partial<User>) => {
    const d = get<User>("px_users").map((u) =>
      u.id === id ? { ...u, ...updates } : u,
    );
    set("px_users", d);
  },
  getUserByUsername: (username: string) =>
    get<User>("px_users").find((u) => u.username === username),
  deleteUser: (id: string) =>
    set(
      "px_users",
      get<User>("px_users").filter((u) => u.id !== id),
    ),

  // Companies
  getCompanies: () => get<Company>("px_companies"),
  addCompany: (c: Omit<Company, "id">) => {
    const d = get<Company>("px_companies");
    const n = { ...c, id: uid() };
    set("px_companies", [...d, n]);
    return n;
  },
  deleteCompany: (id: string) =>
    set(
      "px_companies",
      get<Company>("px_companies").filter((c) => c.id !== id),
    ),

  // Zones
  getZones: () => get<Zone>("px_zones"),
  addZone: (z: Omit<Zone, "id">) => {
    const d = get<Zone>("px_zones");
    const n = { ...z, id: uid() };
    set("px_zones", [...d, n]);
    return n;
  },
  deleteZone: (id: string) =>
    set(
      "px_zones",
      get<Zone>("px_zones").filter((z) => z.id !== id),
    ),

  // Branches
  getBranches: () => get<Branch>("px_branches"),
  addBranch: (b: Omit<Branch, "id">) => {
    const d = get<Branch>("px_branches");
    const n = { ...b, id: uid() };
    set("px_branches", [...d, n]);
    return n;
  },
  deleteBranch: (id: string) =>
    set(
      "px_branches",
      get<Branch>("px_branches").filter((b) => b.id !== id),
    ),

  // Medicines
  getMedicines: () => get<Medicine>("px_medicines"),
  addMedicine: (name: string) => {
    const d = get<Medicine>("px_medicines");
    const n: Medicine = { id: uid(), name };
    set("px_medicines", [...d, n]);
    return n;
  },

  // Vaccines
  getVaccines: () => get<Vaccine>("px_vaccines"),
  addVaccine: (name: string) => {
    const d = get<Vaccine>("px_vaccines");
    const n: Vaccine = { id: uid(), name };
    set("px_vaccines", [...d, n]);
    return n;
  },

  // Payments
  getPayments: () => get<Payment>("px_payments"),
  addPayment: (p: Omit<Payment, "id">) => {
    const d = get<Payment>("px_payments");
    const n = { ...p, id: uid() };
    set("px_payments", [...d, n]);
    return n;
  },
  deletePayment: (id: string) =>
    set(
      "px_payments",
      get<Payment>("px_payments").filter((p) => p.id !== id),
    ),

  // Receipts
  getReceipts: () => get<Receipt>("px_receipts"),
  addReceipt: (r: Omit<Receipt, "id">) => {
    const d = get<Receipt>("px_receipts");
    const n = { ...r, id: uid() };
    set("px_receipts", [...d, n]);
    return n;
  },
  deleteReceipt: (id: string) =>
    set(
      "px_receipts",
      get<Receipt>("px_receipts").filter((r) => r.id !== id),
    ),

  // Farms
  getFarms: () => get<Farm>("px_farms"),
  addFarm: (f: Omit<Farm, "id">) => {
    const d = get<Farm>("px_farms");
    const n = { ...f, id: uid() };
    set("px_farms", [...d, n]);
    return n;
  },
  updateFarm: (id: string, updates: Partial<Farm>) => {
    const d = get<Farm>("px_farms").map((f) =>
      f.id === id ? { ...f, ...updates } : f,
    );
    set("px_farms", d);
  },
  deleteFarm: (id: string) =>
    set(
      "px_farms",
      get<Farm>("px_farms").filter((f) => f.id !== id),
    ),

  // Sheds
  getSheds: () => get<Shed>("px_sheds"),
  addShed: (s: Omit<Shed, "id">) => {
    const d = get<Shed>("px_sheds");
    const n = { ...s, id: uid() };
    set("px_sheds", [...d, n]);
    return n;
  },
  updateShed: (id: string, updates: Partial<Shed>) => {
    const d = get<Shed>("px_sheds").map((s) =>
      s.id === id ? { ...s, ...updates } : s,
    );
    set("px_sheds", d);
  },
  getShedsByFarm: (farmId: string) =>
    get<Shed>("px_sheds").filter((s) => s.farmId === farmId),
  getActiveBatchByShed: (shedId: string) =>
    get<Batch>("px_batches").find(
      (b) => b.shedId === shedId && b.status === "active",
    ),

  // Batches
  getBatches: () => get<Batch>("px_batches"),
  addBatch: (b: Omit<Batch, "id">) => {
    const d = get<Batch>("px_batches");
    const n = { ...b, id: uid() };
    set("px_batches", [...d, n]);
    return n;
  },
  updateBatch: (id: string, updates: Partial<Batch>) => {
    const d = get<Batch>("px_batches").map((b) =>
      b.id === id ? { ...b, ...updates } : b,
    );
    set("px_batches", d);
  },

  // Daily Entries
  getDailyEntries: () => get<DailyEntry>("px_daily"),
  addDailyEntry: (e: Omit<DailyEntry, "id">) => {
    const d = get<DailyEntry>("px_daily");
    const n = { ...e, id: uid() };
    set("px_daily", [...d, n]);
    return n;
  },

  // Feed
  getFeedPurchases: () => get<FeedPurchase>("px_feed_purchases"),
  addFeedPurchase: (f: Omit<FeedPurchase, "id">) => {
    const d = get<FeedPurchase>("px_feed_purchases");
    const n = { ...f, id: uid() };
    set("px_feed_purchases", [...d, n]);
    const stocks = get<FeedStock>("px_feed_stock");
    const si = stocks.findIndex(
      (s) => s.farmId === "global" && s.feedType === f.feedType,
    );
    if (si >= 0) {
      stocks[si].currentStockBags += f.quantityBags;
    } else {
      stocks.push({
        id: uid(),
        farmId: "global",
        feedType: f.feedType,
        currentStockBags: f.quantityBags,
        alertThresholdBags: 10,
      });
    }
    set("px_feed_stock", stocks);
    return n;
  },
  getFeedStocks: () => get<FeedStock>("px_feed_stock"),
  saveFeedStock: (s: FeedStock) => {
    const d = get<FeedStock>("px_feed_stock");
    const i = d.findIndex((x) => x.id === s.id);
    if (i >= 0) d[i] = s;
    else d.push(s);
    set("px_feed_stock", d);
  },
  getFeedIssues: () => get<FeedIssue>("px_feed_issues"),
  addFeedIssue: (f: Omit<FeedIssue, "id">) => {
    const d = get<FeedIssue>("px_feed_issues");
    const n = { ...f, id: uid() };
    set("px_feed_issues", [...d, n]);
    const stocks = get<FeedStock>("px_feed_stock");
    const si = stocks.findIndex((s) => s.feedType === f.feedType);
    if (si >= 0) {
      stocks[si].currentStockBags = Math.max(
        0,
        stocks[si].currentStockBags - f.quantityBags,
      );
    }
    set("px_feed_stock", stocks);
    return n;
  },

  // Bird Sales
  getBirdSales: () => get<BirdSale>("px_sales"),
  addBirdSale: (s: Omit<BirdSale, "id">) => {
    const d = get<BirdSale>("px_sales");
    const n = { ...s, id: uid() };
    set("px_sales", [...d, n]);
    return n;
  },

  // GC Schemes
  getGCSchemes: () => get<GCScheme>("px_gc_schemes"),
  addGCScheme: (s: Omit<GCScheme, "id">) => {
    const d = get<GCScheme>("px_gc_schemes");
    const n = { ...s, id: uid() };
    set("px_gc_schemes", [...d, n]);
    return n;
  },
  deleteGCScheme: (id: string) =>
    set(
      "px_gc_schemes",
      get<GCScheme>("px_gc_schemes").filter((s) => s.id !== id),
    ),

  // GC Settlements
  getGCSettlements: () => get<GCSettlement>("px_gc_settlements"),
  addGCSettlement: (s: Omit<GCSettlement, "id">) => {
    const d = get<GCSettlement>("px_gc_settlements");
    const n = { ...s, id: uid() };
    set("px_gc_settlements", [...d, n]);
    return n;
  },
};
