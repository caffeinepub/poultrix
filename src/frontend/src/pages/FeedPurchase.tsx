import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useCompanyScope } from "@/lib/roleFilter";
import { type FeedPurchase as FP, storage } from "@/lib/storage";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

const DEFAULT_FORM = {
  supplierIdRef: "",
  supplierName: "",
  feedType: "",
  unit: "bags" as "bags" | "kg",
  quantityBags: "",
  quantityKgInput: "",
  ratePerBag: "",
  discountAmount: "",
  purchaseDate: today(),
  challanNumber: "",
  branchId: "",
  receivingFarmId: "",
};

export default function FeedPurchase() {
  const { currentUser: _cu } = useAuth();
  const {
    farms: allFarms,
    branches,
    feedTypes,
    feedSuppliers: suppliers,
  } = useCompanyScope();
  const [purchases, setPurchases] = useState<FP[]>(storage.getFeedPurchases());
  const [form, setForm] = useState(DEFAULT_FORM);
  const [quickAddSupplier, setQuickAddSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");

  const filteredFarms = useMemo(
    () =>
      form.branchId
        ? allFarms.filter((f) => f.branchId === form.branchId)
        : allFarms,
    [allFarms, form.branchId],
  );

  const bags =
    form.unit === "bags"
      ? Number(form.quantityBags) || 0
      : Math.round((Number(form.quantityKgInput) || 0) / 50);
  const kg =
    form.unit === "kg"
      ? Number(form.quantityKgInput) || 0
      : (Number(form.quantityBags) || 0) * 50;

  const totalAmount = Math.max(
    0,
    bags * (Number(form.ratePerBag) || 0) - (Number(form.discountAmount) || 0),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.feedType || bags === 0) return;
    const selectedSupplier = suppliers.find((s) => s.id === form.supplierIdRef);
    storage.addFeedPurchase({
      supplierName: selectedSupplier?.name || form.supplierName,
      supplierIdRef: form.supplierIdRef || undefined,
      feedType: form.feedType,
      quantityBags: bags,
      quantityKg: kg,
      ratePerBag: Number(form.ratePerBag) || 0,
      discountAmount: Number(form.discountAmount) || 0,
      totalAmount,
      purchaseDate: form.purchaseDate,
      challanNumber: form.challanNumber || undefined,
      branchId: form.branchId || undefined,
      receivingFarmId: form.receivingFarmId || undefined,
    });
    setPurchases(storage.getFeedPurchases());
    setForm(DEFAULT_FORM);
  };

  const handleAddSupplier = () => {
    if (!newSupplierName.trim()) return;
    const s = storage.addFeedSupplier({
      name: newSupplierName.trim(),
      contactName: "",
      phone: "",
    });
    setForm((f) => ({ ...f, supplierIdRef: s.id }));
    setNewSupplierName("");
    setQuickAddSupplier(false);
  };

  return (
    <div className="space-y-6" data-ocid="feed_purchase.page">
      <h2 className="text-2xl font-bold">Feed Purchase</h2>
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Supplier */}
            <div>
              <Label>Supplier / Feed Mill</Label>
              <div className="flex gap-2">
                <select
                  data-ocid="feed_purchase.supplier.select"
                  value={form.supplierIdRef}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, supplierIdRef: e.target.value }))
                  }
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select Supplier...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickAddSupplier(true)}
                  data-ocid="feed_purchase.add_supplier.button"
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>

            {/* Feed Type */}
            <div>
              <Label>Feed Type *</Label>
              <select
                data-ocid="feed_purchase.feed_type.select"
                required
                value={form.feedType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, feedType: e.target.value }))
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select Type...</option>
                {feedTypes.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <Label>Branch (Receiving)</Label>
              <select
                data-ocid="feed_purchase.branch.select"
                value={form.branchId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    branchId: e.target.value,
                    receivingFarmId: "",
                  }))
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All / Central</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Receiving Farm */}
            <div>
              <Label>Receiving Farm</Label>
              <select
                data-ocid="feed_purchase.farm.select"
                value={form.receivingFarmId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, receivingFarmId: e.target.value }))
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Not specified</option>
                {filteredFarms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit toggle + Quantity */}
            <div className="sm:col-span-2">
              <Label>Quantity</Label>
              <div className="flex gap-3 items-start mt-1">
                <div className="flex rounded-md border border-input overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, unit: "bags" }))}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      form.unit === "bags"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                    data-ocid="feed_purchase.unit_bags.toggle"
                  >
                    Bags
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, unit: "kg" }))}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      form.unit === "kg"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                    data-ocid="feed_purchase.unit_kg.toggle"
                  >
                    KG
                  </button>
                </div>
                {form.unit === "bags" ? (
                  <div className="flex-1">
                    <Input
                      data-ocid="feed_purchase.qty_bags.input"
                      type="number"
                      min="0"
                      value={form.quantityBags}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, quantityBags: e.target.value }))
                      }
                      placeholder="Number of bags"
                    />
                    {bags > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        = {bags * 50} kg
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex-1">
                    <Input
                      data-ocid="feed_purchase.qty_kg.input"
                      type="number"
                      min="0"
                      value={form.quantityKgInput}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          quantityKgInput: e.target.value,
                        }))
                      }
                      placeholder="Quantity in kg"
                    />
                    {kg > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ≈ {Math.round(kg / 50)} bags
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Rate */}
            <div>
              <Label>Rate per Bag (₹)</Label>
              <Input
                data-ocid="feed_purchase.rate.input"
                type="number"
                value={form.ratePerBag}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ratePerBag: e.target.value }))
                }
                placeholder="0"
              />
            </div>

            {/* Discount */}
            <div>
              <Label>Discount (₹)</Label>
              <Input
                data-ocid="feed_purchase.discount.input"
                type="number"
                value={form.discountAmount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountAmount: e.target.value }))
                }
                placeholder="0"
              />
            </div>

            {/* Date */}
            <div>
              <Label>Purchase Date</Label>
              <Input
                data-ocid="feed_purchase.date.input"
                type="date"
                value={form.purchaseDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, purchaseDate: e.target.value }))
                }
              />
            </div>

            {/* Challan */}
            <div>
              <Label>Delivery Challan No.</Label>
              <Input
                data-ocid="feed_purchase.challan.input"
                value={form.challanNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, challanNumber: e.target.value }))
                }
                placeholder="Challan number"
              />
            </div>

            {/* Total */}
            <div className="sm:col-span-2 flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                Total Amount:
              </span>
              <span className="font-bold text-xl">
                ₹ {totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" data-ocid="feed_purchase.submit.button">
                <Plus size={16} className="mr-1" />
                Save Purchase
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Purchase History */}
      <div>
        <h3 className="font-semibold mb-3">Purchase History</h3>
        {purchases.length === 0 ? (
          <Card data-ocid="feed_purchase.empty_state">
            <CardContent className="p-6 text-center text-muted-foreground">
              No purchases recorded.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="feed_purchase.table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Supplier</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Challan</th>
                  <th className="text-right p-2">Bags</th>
                  <th className="text-right p-2">KG</th>
                  <th className="text-right p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...purchases].reverse().map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-muted/30"
                    data-ocid={`feed_purchase.row.${i + 1}`}
                  >
                    <td className="p-2">{p.purchaseDate}</td>
                    <td className="p-2">{p.supplierName}</td>
                    <td className="p-2">
                      <Badge variant="outline">{p.feedType}</Badge>
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {p.challanNumber || "—"}
                    </td>
                    <td className="p-2 text-right">{p.quantityBags}</td>
                    <td className="p-2 text-right text-muted-foreground">
                      {p.quantityKg ?? p.quantityBags * 50}
                    </td>
                    <td className="p-2 text-right font-medium">
                      ₹ {p.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick-add supplier dialog */}
      <Dialog open={quickAddSupplier} onOpenChange={setQuickAddSupplier}>
        <DialogContent data-ocid="feed_purchase.quick_supplier.dialog">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Supplier Name *</Label>
            <Input
              data-ocid="feed_purchase.quick_supplier.input"
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(e.target.value)}
              placeholder="Supplier / Feed Mill name"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setQuickAddSupplier(false)}
              data-ocid="feed_purchase.quick_supplier.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSupplier}
              data-ocid="feed_purchase.quick_supplier.save_button"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
