import Map "mo:core/Map";

actor {
  // ---- Legacy types (kept for stable variable compatibility) ----
  type FarmId = Nat;
  type ShedId = Nat;
  type BatchId = Nat;

  type LegacyFarm = {
    id : FarmId;
    name : Text;
    location : Text;
    totalCapacity : Nat;
  };

  type LegacyShed = {
    id : ShedId;
    farmId : FarmId;
    name : Text;
    capacity : Nat;
  };

  type LegacyBatch = {
    id : BatchId;
    batchNumber : Text;
    placementDate : Int;
    hatcheryName : Text;
    breedType : Text;
    chicksQty : Nat;
    chicksRate : Nat;
    transportCost : Nat;
    totalPlacementCost : Nat;
    farmId : FarmId;
    shedId : ShedId;
    birdsAlive : Nat;
    status : Text;
  };

  // ---- Legacy stable vars (must be kept to allow upgrade from old version) ----
  stable var nextFarmId : Nat = 1;
  stable var nextShedId : Nat = 1;
  stable var nextBatchId : Nat = 1;
  stable var timestamp : Int = 0;
  let farmsMap = Map.empty<FarmId, LegacyFarm>();
  let shedsMap = Map.empty<ShedId, LegacyShed>();
  let batchesMap = Map.empty<BatchId, LegacyBatch>();

  // ---- New centralized JSON storage ----
  stable var usersJson : Text = "[]";
  stable var companiesJson : Text = "[]";
  stable var zonesJson : Text = "[]";
  stable var branchesJson : Text = "[]";
  stable var farmsJson : Text = "[]";
  stable var shedsJson : Text = "[]";
  stable var batchesJson : Text = "[]";
  stable var dailyEntriesJson : Text = "[]";
  stable var feedTypesJson : Text = "[]";
  stable var feedSuppliersJson : Text = "[]";
  stable var feedPurchasesJson : Text = "[]";
  stable var feedStocksJson : Text = "[]";
  stable var feedIssuesJson : Text = "[]";
  stable var birdSalesJson : Text = "[]";
  stable var expensesJson : Text = "[]";
  stable var signupRequestsJson : Text = "[]";
  stable var auditLogsJson : Text = "[]";
  stable var paymentsJson : Text = "[]";
  stable var subscriptionsJson : Text = "[]";
  stable var notificationsJson : Text = "[]";

  public func setUsers(json : Text) : async () { usersJson := json };
  public query func getUsers() : async Text { usersJson };

  public func setCompanies(json : Text) : async () { companiesJson := json };
  public query func getCompanies() : async Text { companiesJson };

  public func setZones(json : Text) : async () { zonesJson := json };
  public query func getZones() : async Text { zonesJson };

  public func setBranches(json : Text) : async () { branchesJson := json };
  public query func getBranches() : async Text { branchesJson };

  public func setFarms(json : Text) : async () { farmsJson := json };
  public query func getFarms() : async Text { farmsJson };

  public func setSheds(json : Text) : async () { shedsJson := json };
  public query func getSheds() : async Text { shedsJson };

  public func setBatches(json : Text) : async () { batchesJson := json };
  public query func getBatches() : async Text { batchesJson };

  public func setDailyEntries(json : Text) : async () { dailyEntriesJson := json };
  public query func getDailyEntries() : async Text { dailyEntriesJson };

  public func setFeedTypes(json : Text) : async () { feedTypesJson := json };
  public query func getFeedTypes() : async Text { feedTypesJson };

  public func setFeedSuppliers(json : Text) : async () { feedSuppliersJson := json };
  public query func getFeedSuppliers() : async Text { feedSuppliersJson };

  public func setFeedPurchases(json : Text) : async () { feedPurchasesJson := json };
  public query func getFeedPurchases() : async Text { feedPurchasesJson };

  public func setFeedStocks(json : Text) : async () { feedStocksJson := json };
  public query func getFeedStocks() : async Text { feedStocksJson };

  public func setFeedIssues(json : Text) : async () { feedIssuesJson := json };
  public query func getFeedIssues() : async Text { feedIssuesJson };

  public func setBirdSales(json : Text) : async () { birdSalesJson := json };
  public query func getBirdSales() : async Text { birdSalesJson };

  public func setExpenses(json : Text) : async () { expensesJson := json };
  public query func getExpenses() : async Text { expensesJson };

  public func setSignupRequests(json : Text) : async () { signupRequestsJson := json };
  public query func getSignupRequests() : async Text { signupRequestsJson };

  public func setAuditLogs(json : Text) : async () { auditLogsJson := json };
  public query func getAuditLogs() : async Text { auditLogsJson };

  public func setPayments(json : Text) : async () { paymentsJson := json };
  public query func getPayments() : async Text { paymentsJson };

  public func setSubscriptions(json : Text) : async () { subscriptionsJson := json };
  public query func getSubscriptions() : async Text { subscriptionsJson };

  public func setNotifications(json : Text) : async () { notificationsJson := json };
  public query func getNotifications() : async Text { notificationsJson };

  public query func exportAll() : async Text {
    "{" #
    "\"users\":" # usersJson # "," #
    "\"companies\":" # companiesJson # "," #
    "\"zones\":" # zonesJson # "," #
    "\"branches\":" # branchesJson # "," #
    "\"farms\":" # farmsJson # "," #
    "\"sheds\":" # shedsJson # "," #
    "\"batches\":" # batchesJson # "," #
    "\"dailyEntries\":" # dailyEntriesJson # "," #
    "\"feedTypes\":" # feedTypesJson # "," #
    "\"feedSuppliers\":" # feedSuppliersJson # "," #
    "\"feedPurchases\":" # feedPurchasesJson # "," #
    "\"feedStocks\":" # feedStocksJson # "," #
    "\"feedIssues\":" # feedIssuesJson # "," #
    "\"birdSales\":" # birdSalesJson # "," #
    "\"expenses\":" # expensesJson # "," #
    "\"signupRequests\":" # signupRequestsJson # "," #
    "\"auditLogs\":" # auditLogsJson # "," #
    "\"payments\":" # paymentsJson # "," #
    "\"subscriptions\":" # subscriptionsJson # "," #
    "\"notifications\":" # notificationsJson #
    "}"
  };
};
