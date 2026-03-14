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
export type FeedType = {
  id: string;
  name: string;
  description: string;
  companyId?: string;
};
export type FeedSupplier = {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  companyId?: string;
};
export type FeedPurchase = {
  id: string;
  supplierName: string;
  supplierIdRef?: string;
  feedType: string;
  quantityBags: number;
  quantityKg: number;
  ratePerBag: number;
  discountAmount: number;
  totalAmount: number;
  purchaseDate: string;
  challanNumber?: string;
  branchId?: string;
  receivingFarmId?: string;
};
export type FeedStock = {
  id: string;
  farmId: string;
  feedType: string;
  currentStockBags: number;
  alertThresholdBags: number;
  openingStockKg: number;
};
export type FeedIssue = {
  id: string;
  farmId: string;
  shedId: string;
  feedType: string;
  quantityBags: number;
  quantityKg: number;
  issueDate: string;
  zoneId?: string;
  branchId?: string;
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
  createdBy?: string;
  name: string;
  employeeId?: string;
  mobileNumber?: string;
  email?: string;
  assignedArea?: string;
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
  logoUrl?: string;
  contactNumber?: string;
  email?: string;
  subscriptionPlan?: "Basic" | "Standard" | "Premium";
  farmCapacityLimit?: number;
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
  branchCode?: string;
  address?: string;
  branchManagerId?: string;
  contactNumber?: string;
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

// ---- Subscription & Billing Types ----
export type SubscriptionRecord = {
  id: string;
  userId: string;
  userRole: "CompanyAdmin" | "Dealer" | "Farmer";
  trialStartDate: string;
  trialEndDate: string;
  status: "trial_active" | "trial_expired" | "active" | "pending" | "suspended";
  farmCapacity: number;
  perBirdRate: number;
  minSubscription: number;
  monthlyAmount: number;
  activatedAt?: string;
  suspendedAt?: string;
};

export type SubscriptionPaymentRecord = {
  id: string;
  subscriptionId: string;
  userId: string;
  paymentMethod:
    | "PhonePe"
    | "Google Pay"
    | "UPI"
    | "Net Banking"
    | "Debit Card"
    | "Credit Card"
    | "Cash";
  paymentReference: string;
  paymentDate: string;
  amount: number;
  status: "Pending" | "Paid" | "Failed";
  verifiedBy?: string;
  verifiedAt?: string;
  invoiceId?: string;
};

export type SubscriptionInvoice = {
  id: string;
  invoiceNumber: string;
  subscriptionId: string;
  userId: string;
  paymentId: string;
  invoiceDate: string;
  period: string;
  totalBirds: number;
  perBirdRate: number;
  calculatedAmount: number;
  minimumAmount: number;
  finalAmount: number;
  status: "paid";
};

export type SubscriptionNotification = {
  id: string;
  userId: string;
  type:
    | "trial_ending"
    | "payment_pending"
    | "invoice_generated"
    | "payment_failed"
    | "subscription_active";
  message: string;
  date: string;
  read: boolean;
};

// ---- General Notification Type ----
export type Notification = {
  id: string;
  userId: string; // recipient user id, or 'all' for broadcast
  companyId?: string;
  type:
    | "sub_user_assigned"
    | "expense_pending"
    | "settlement_pending"
    | "report_ready"
    | "trial_expiring"
    | "payment_pending"
    | "general";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
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

function padNum(n: number) {
  return String(n).padStart(3, "0");
}

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
        employeeId: "EMP-001",
        active: true,
      },
    ]);
  }
}
seedUsers();

// Seed demo user for testing — runs every load, ensures demo1990 always exists
function seedDemoUser() {
  // Ensure demo company exists
  const companies = get<Company>("px_companies");
  const demoCompanyId = "demo-company-001";
  if (!companies.find((c) => c.id === demoCompanyId)) {
    set("px_companies", [
      ...companies,
      {
        id: demoCompanyId,
        name: "Demo Poultry Pvt Ltd",
        address: "Demo Address, City",
        contactNumber: "9999999999",
        email: "demo@poultrix.com",
        subscriptionPlan: "Standard" as const,
      },
    ]);
  }

  const users = get<User>("px_users");
  const exists = users.find((u) => u.username === "demo1990");
  if (!exists) {
    set("px_users", [
      ...users,
      {
        id: "demo-1990",
        username: "demo1990",
        password: "demo@123",
        role: "CompanyAdmin" as const,
        name: "Demo User 1990",
        employeeId: "EMP-DEMO",
        companyId: demoCompanyId,
        active: true,
      },
    ]);
  } else if (!exists.companyId) {
    // Fix existing demo user that is missing companyId
    set(
      "px_users",
      users.map((u) =>
        u.username === "demo1990" ? { ...u, companyId: demoCompanyId } : u,
      ),
    );
  }
}
seedDemoUser();

// Seed default feed types
function seedFeedTypes() {
  const types = get<FeedType>("px_feed_types");
  if (types.length === 0) {
    set("px_feed_types", [
      { id: "ft-1", name: "Pre-Starter", description: "For chicks 1-7 days" },
      { id: "ft-2", name: "Starter", description: "For chicks 8-21 days" },
      { id: "ft-3", name: "Grower", description: "For birds 22-35 days" },
      {
        id: "ft-4",
        name: "Finisher",
        description: "For birds 35+ days before sale",
      },
    ]);
  }
}
seedFeedTypes();

// Seed default general notifications for superadmin
function seedNotifications() {
  const notifs = get<Notification>("px_notifications");
  if (notifs.length === 0) {
    const now = new Date().toISOString();
    set("px_notifications", [
      {
        id: "notif-1",
        userId: "sa-1",
        type: "general" as const,
        title: "Welcome to Poultrix",
        message:
          "Welcome to Poultrix Smart Poultry Farm Management Platform. Get started by setting up your company structure.",
        read: false,
        createdAt: now,
      },
      {
        id: "notif-2",
        userId: "sa-1",
        type: "trial_expiring" as const,
        title: "Trial Expires in 3 Days",
        message:
          "Your free trial period ends in 3 days. Please activate your subscription to continue using Poultrix.",
        read: false,
        createdAt: now,
      },
      {
        id: "notif-3",
        userId: "sa-1",
        type: "settlement_pending" as const,
        title: "New Settlement Pending Review",
        message:
          "A new Growing Charge settlement is awaiting your review and confirmation in the Finance module.",
        read: false,
        createdAt: now,
      },
    ]);
  }
}
seedNotifications();

export const storage = {
  // Users
  getUsers: () => get<User>("px_users"),
  addUser: (u: Omit<User, "id">) => {
    const d = get<User>("px_users");
    const empNum = d.length + 1;
    const employeeId = u.employeeId || `EMP-${padNum(empNum)}`;
    const n = { ...u, id: uid(), employeeId };
    set("px_users", [...d, n]);
    return n;
  },
  updateUser: (id: string, updates: Partial<User>) => {
    const d = get<User>("px_users").map((u) =>
      u.id === id ? { ...u, ...updates } : u,
    );
    set("px_users", d);
  },
  // Accepts username or email (case-insensitive)
  getUserByUsername: (input: string) => {
    const lower = input.toLowerCase();
    return get<User>("px_users").find(
      (u) =>
        u.username === input ||
        (u.email != null && u.email.toLowerCase() === lower),
    );
  },
  deleteUser: (id: string) =>
    set(
      "px_users",
      get<User>("px_users").filter((u) => u.id !== id),
    ),
  getUsersByCompanyId: (companyId: string): User[] =>
    get<User>("px_users").filter((u) => u.companyId === companyId),

  // General Notifications
  getNotifications: () => get<Notification>("px_notifications"),
  addNotification: (n: Omit<Notification, "id">) => {
    const d = get<Notification>("px_notifications");
    const newN = { ...n, id: uid() };
    set("px_notifications", [...d, newN]);
    return newN;
  },
  markNotificationRead: (id: string) => {
    // Mark in both general and subscription notifications
    const gd = get<Notification>("px_notifications").map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    set("px_notifications", gd);
    const sd = get<SubscriptionNotification>("px_sub_notifications").map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    set("px_sub_notifications", sd);
  },
  markAllNotificationsRead: (userId: string) => {
    const gd = get<Notification>("px_notifications").map((n) =>
      n.userId === userId || n.userId === "all" ? { ...n, read: true } : n,
    );
    set("px_notifications", gd);
    const sd = get<SubscriptionNotification>("px_sub_notifications").map((n) =>
      n.userId === userId ? { ...n, read: true } : n,
    );
    set("px_sub_notifications", sd);
  },

  // Companies
  getCompanies: () => get<Company>("px_companies"),
  addCompany: (c: Omit<Company, "id">) => {
    const d = get<Company>("px_companies");
    const n = { ...c, id: uid() };
    set("px_companies", [...d, n]);
    return n;
  },
  updateCompany: (id: string, updates: Partial<Company>) => {
    const d = get<Company>("px_companies").map((c) =>
      c.id === id ? { ...c, ...updates } : c,
    );
    set("px_companies", d);
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
    const branchNum = d.length + 1;
    const branchCode = b.branchCode || `BR-${padNum(branchNum)}`;
    const n = { ...b, id: uid(), branchCode };
    set("px_branches", [...d, n]);
    return n;
  },
  updateBranch: (id: string, updates: Partial<Branch>) => {
    const d = get<Branch>("px_branches").map((b) =>
      b.id === id ? { ...b, ...updates } : b,
    );
    set("px_branches", d);
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

  // Feed Types
  getFeedTypes: () => {
    const types = get<FeedType>("px_feed_types");
    if (types.length === 0) {
      seedFeedTypes();
      return get<FeedType>("px_feed_types");
    }
    return types;
  },
  addFeedType: (ft: Omit<FeedType, "id">) => {
    const d = get<FeedType>("px_feed_types");
    const n = { ...ft, id: uid() };
    set("px_feed_types", [...d, n]);
    return n;
  },
  updateFeedType: (id: string, updates: Partial<FeedType>) => {
    const d = get<FeedType>("px_feed_types").map((ft) =>
      ft.id === id ? { ...ft, ...updates } : ft,
    );
    set("px_feed_types", d);
  },
  deleteFeedType: (id: string) =>
    set(
      "px_feed_types",
      get<FeedType>("px_feed_types").filter((ft) => ft.id !== id),
    ),

  // Feed Suppliers
  getFeedSuppliers: () => get<FeedSupplier>("px_feed_suppliers"),
  addFeedSupplier: (s: Omit<FeedSupplier, "id">) => {
    const d = get<FeedSupplier>("px_feed_suppliers");
    const n = { ...s, id: uid() };
    set("px_feed_suppliers", [...d, n]);
    return n;
  },
  updateFeedSupplier: (id: string, updates: Partial<FeedSupplier>) => {
    const d = get<FeedSupplier>("px_feed_suppliers").map((s) =>
      s.id === id ? { ...s, ...updates } : s,
    );
    set("px_feed_suppliers", d);
  },
  deleteFeedSupplier: (id: string) =>
    set(
      "px_feed_suppliers",
      get<FeedSupplier>("px_feed_suppliers").filter((s) => s.id !== id),
    ),

  // Feed Purchases
  getFeedPurchases: () => get<FeedPurchase>("px_feed_purchases"),
  addFeedPurchase: (f: Omit<FeedPurchase, "id">) => {
    const qKg = f.quantityKg ?? f.quantityBags * 50;
    const d = get<FeedPurchase>("px_feed_purchases");
    const n = { ...f, id: uid(), quantityKg: qKg };
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
        openingStockKg: 0,
      });
    }
    set("px_feed_stock", stocks);
    return n;
  },

  // Feed Stock
  getFeedStocks: () => get<FeedStock>("px_feed_stock"),
  saveFeedStock: (s: FeedStock) => {
    const d = get<FeedStock>("px_feed_stock");
    const i = d.findIndex((x) => x.id === s.id);
    const item = { ...s, openingStockKg: s.openingStockKg ?? 0 };
    if (i >= 0) d[i] = item;
    else d.push(item);
    set("px_feed_stock", d);
  },

  // Feed Issue
  getFeedIssues: () => get<FeedIssue>("px_feed_issues"),
  addFeedIssue: (f: Omit<FeedIssue, "id">) => {
    const qKg = f.quantityKg ?? f.quantityBags * 50;
    const d = get<FeedIssue>("px_feed_issues");
    const n = { ...f, id: uid(), quantityKg: qKg };
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

  // Feed Stock Balance helper
  getFeedStockBalance: (feedType: string, farmId?: string) => {
    const stocks = get<FeedStock>("px_feed_stock");
    const stock = farmId
      ? stocks.find((s) => s.feedType === feedType && s.farmId === farmId)
      : stocks.find((s) => s.feedType === feedType && s.farmId === "global");
    const openingKg = stock?.openingStockKg ?? 0;
    const purchases = get<FeedPurchase>("px_feed_purchases");
    const receivedKg = purchases
      .filter(
        (p) =>
          p.feedType === feedType && (!farmId || p.receivingFarmId === farmId),
      )
      .reduce((sum, p) => sum + (p.quantityKg ?? p.quantityBags * 50), 0);
    const issues = get<FeedIssue>("px_feed_issues");
    const issuedKg = issues
      .filter(
        (i) => i.feedType === feedType && (!farmId || i.farmId === farmId),
      )
      .reduce((sum, i) => sum + (i.quantityKg ?? i.quantityBags * 50), 0);
    return {
      openingKg,
      receivedKg,
      issuedKg,
      balanceKg: openingKg + receivedKg - issuedKg,
    };
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

  // Pending Settlements (Finance Module)
  getPendingSettlements: () => get<PendingSettlement>("px_pending_settlements"),
  addPendingSettlement: (s: Omit<PendingSettlement, "id">) => {
    const d = get<PendingSettlement>("px_pending_settlements");
    const n = { ...s, id: uid() };
    set("px_pending_settlements", [...d, n]);
    return n;
  },
  confirmPendingSettlement: (id: string, confirmedBy: string) => {
    const d = get<PendingSettlement>("px_pending_settlements");
    set(
      "px_pending_settlements",
      d.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "confirmed" as const,
              confirmedAt: new Date().toISOString(),
              confirmedBy,
            }
          : s,
      ),
    );
  },

  // Ledger Entries (Finance Module)
  getLedgerEntries: () => get<LedgerEntry>("px_ledger_entries"),
  addLedgerEntry: (e: Omit<LedgerEntry, "id">) => {
    const d = get<LedgerEntry>("px_ledger_entries");
    const n = { ...e, id: uid() };
    set("px_ledger_entries", [...d, n]);
    return n;
  },
  updateLedgerEntry: (id: string, e: Partial<LedgerEntry>) => {
    const d = get<LedgerEntry>("px_ledger_entries");
    set(
      "px_ledger_entries",
      d.map((item) => (item.id === id ? { ...item, ...e } : item)),
    );
  },

  // Expenses (Finance Module)
  getExpenses: () => get<Expense>("px_expenses"),
  addExpense: (e: Omit<Expense, "id">) => {
    const d = get<Expense>("px_expenses");
    const n = { ...e, id: uid() };
    set("px_expenses", [...d, n]);
    return n;
  },
  updateExpense: (id: string, e: Partial<Expense>) => {
    const d = get<Expense>("px_expenses");
    set(
      "px_expenses",
      d.map((item) => (item.id === id ? { ...item, ...e } : item)),
    );
  },
  deleteExpense: (id: string) => {
    set(
      "px_expenses",
      get<Expense>("px_expenses").filter((e) => e.id !== id),
    );
  },

  // Subscription Records
  getSubscriptions: () => get<SubscriptionRecord>("px_subscriptions"),
  addSubscription: (s: Omit<SubscriptionRecord, "id">) => {
    const d = get<SubscriptionRecord>("px_subscriptions");
    const n = { ...s, id: uid() };
    set("px_subscriptions", [...d, n]);
    return n;
  },
  updateSubscription: (id: string, updates: Partial<SubscriptionRecord>) => {
    const d = get<SubscriptionRecord>("px_subscriptions").map((s) =>
      s.id === id ? { ...s, ...updates } : s,
    );
    set("px_subscriptions", d);
  },
  getSubscriptionByUserId: (userId: string) =>
    get<SubscriptionRecord>("px_subscriptions").find(
      (s) => s.userId === userId,
    ),

  // Subscription Payments
  getSubscriptionPayments: () =>
    get<SubscriptionPaymentRecord>("px_sub_payments"),
  addSubscriptionPayment: (p: Omit<SubscriptionPaymentRecord, "id">) => {
    const d = get<SubscriptionPaymentRecord>("px_sub_payments");
    const n = { ...p, id: uid() };
    set("px_sub_payments", [...d, n]);
    return n;
  },
  updateSubscriptionPayment: (
    id: string,
    updates: Partial<SubscriptionPaymentRecord>,
  ) => {
    const d = get<SubscriptionPaymentRecord>("px_sub_payments").map((p) =>
      p.id === id ? { ...p, ...updates } : p,
    );
    set("px_sub_payments", d);
  },

  // Subscription Invoices
  getSubscriptionInvoices: () => get<SubscriptionInvoice>("px_sub_invoices"),
  addSubscriptionInvoice: (
    inv: Omit<SubscriptionInvoice, "id" | "invoiceNumber">,
  ) => {
    const d = get<SubscriptionInvoice>("px_sub_invoices");
    const invoiceNum = `INV-${String(d.length + 1).padStart(3, "0")}`;
    const n = { ...inv, id: uid(), invoiceNumber: invoiceNum };
    set("px_sub_invoices", [...d, n]);
    return n;
  },

  // Subscription Notifications
  getSubscriptionNotifications: () =>
    get<SubscriptionNotification>("px_sub_notifications"),
  addSubscriptionNotification: (n: Omit<SubscriptionNotification, "id">) => {
    const d = get<SubscriptionNotification>("px_sub_notifications");
    const newN = { ...n, id: uid() };
    set("px_sub_notifications", [...d, newN]);
    return newN;
  },
  // Company-scoped helpers for data isolation
  getFarmsByCompany: (companyId?: string) => {
    const all = get<Farm>("px_farms");
    return companyId ? all.filter((f) => f.companyId === companyId) : all;
  },
  getZonesByCompany: (companyId?: string) => {
    const all = get<Zone>("px_zones");
    return companyId ? all.filter((z) => z.companyId === companyId) : all;
  },
  getBranchesByCompany: (companyId?: string) => {
    const all = get<Branch>("px_branches");
    return companyId ? all.filter((b) => b.companyId === companyId) : all;
  },
  getUsersByCompany: (companyId?: string) => {
    const all = get<User>("px_users");
    return companyId ? all.filter((u) => u.companyId === companyId) : all;
  },
  getGCSchemesByCompany: (companyId?: string) => {
    const all = get<GCScheme>("px_gc_schemes");
    return companyId ? all.filter((s) => s.companyId === companyId) : all;
  },
  getFeedTypesByCompany: (companyId?: string) => {
    const all = get<FeedType>("px_feed_types");
    return companyId
      ? all.filter((ft) => !ft.companyId || ft.companyId === companyId)
      : all;
  },
  getFeedSuppliersByCompany: (companyId?: string) => {
    const all = get<FeedSupplier>("px_feed_suppliers");
    return companyId
      ? all.filter((s) => !s.companyId || s.companyId === companyId)
      : all;
  },
};

// ---- Finance Module Types ----
export type PendingSettlement = GCSettlement & {
  status: "pending" | "confirmed";
  confirmedAt?: string;
  confirmedBy?: string;
};

export type LedgerEntry = {
  id: string;
  farmerId: string;
  type:
    | "opening_balance"
    | "gc_earning"
    | "medicine_deduction"
    | "feed_deduction"
    | "manual_deduction";
  amount: number;
  description: string;
  date: string;
  batchId?: string;
  settlementId?: string;
};

export type Expense = {
  id: string;
  farmId: string;
  batchId?: string;
  type: "Medicine Cost" | "Transport" | "Labour" | "Maintenance" | "Other";
  amount: number;
  description: string;
  date: string;
  addedBy: string;
  addedByRole: string;
  status: "approved" | "pending_approval" | "rejected";
};
