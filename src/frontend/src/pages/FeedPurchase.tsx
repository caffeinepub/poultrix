import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type FeedPurchase as FP, storage } from "@/lib/storage";
import { Plus } from "lucide-react";
import { useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);
const FEED_TYPES = [
  "Starter",
  "Grower",
  "Finisher",
  "Broiler Pre-Starter",
  "Broiler Finisher",
];

export default function FeedPurchase() {
  const [purchases, setPurchases] = useState<FP[]>(storage.getFeedPurchases());
  const [form, setForm] = useState({
    supplierName: "",
    feedType: "",
    quantityBags: "",
    ratePerBag: "",
    discountAmount: "",
    purchaseDate: today(),
  });

  const totalAmount = Math.max(
    0,
    (Number.parseInt(form.quantityBags) || 0) *
      (Number.parseInt(form.ratePerBag) || 0) -
      (Number.parseInt(form.discountAmount) || 0),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.feedType || !form.quantityBags) return;
    storage.addFeedPurchase({
      supplierName: form.supplierName,
      feedType: form.feedType,
      quantityBags: Number.parseInt(form.quantityBags),
      ratePerBag: Number.parseInt(form.ratePerBag) || 0,
      discountAmount: Number.parseInt(form.discountAmount) || 0,
      totalAmount,
      purchaseDate: form.purchaseDate,
    });
    setPurchases(storage.getFeedPurchases());
    setForm({
      supplierName: "",
      feedType: "",
      quantityBags: "",
      ratePerBag: "",
      discountAmount: "",
      purchaseDate: today(),
    });
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
            <div>
              <Label>Supplier Name</Label>
              <Input
                data-ocid="feed_purchase.supplier.input"
                value={form.supplierName}
                onChange={(e) =>
                  setForm({ ...form, supplierName: e.target.value })
                }
                placeholder="Supplier"
              />
            </div>
            <div>
              <Label>Feed Type *</Label>
              <select
                data-ocid="feed_purchase.feed_type.select"
                required
                value={form.feedType}
                onChange={(e) => setForm({ ...form, feedType: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select Type...</option>
                {FEED_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Quantity (bags) *</Label>
              <Input
                data-ocid="feed_purchase.qty.input"
                required
                type="number"
                value={form.quantityBags}
                onChange={(e) =>
                  setForm({ ...form, quantityBags: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Rate per Bag (PKR)</Label>
              <Input
                data-ocid="feed_purchase.rate.input"
                type="number"
                value={form.ratePerBag}
                onChange={(e) =>
                  setForm({ ...form, ratePerBag: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Discount (PKR)</Label>
              <Input
                data-ocid="feed_purchase.discount.input"
                type="number"
                value={form.discountAmount}
                onChange={(e) =>
                  setForm({ ...form, discountAmount: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Purchase Date</Label>
              <Input
                data-ocid="feed_purchase.date.input"
                type="date"
                value={form.purchaseDate}
                onChange={(e) =>
                  setForm({ ...form, purchaseDate: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                Total Amount:
              </span>
              <span className="font-bold text-xl">
                PKR {totalAmount.toLocaleString()}
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
                  <th className="text-right p-2">Bags</th>
                  <th className="text-right p-2">Rate</th>
                  <th className="text-right p-2">Discount</th>
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
                    <td className="p-2">{p.feedType}</td>
                    <td className="p-2 text-right">{p.quantityBags}</td>
                    <td className="p-2 text-right">{p.ratePerBag}</td>
                    <td className="p-2 text-right">{p.discountAmount}</td>
                    <td className="p-2 text-right font-medium">
                      PKR {p.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
