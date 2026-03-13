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
import { type FeedStock as FS, storage } from "@/lib/storage";
import { AlertTriangle, Package, Plus } from "lucide-react";
import { useState } from "react";

const FEED_TYPES = [
  "Starter",
  "Grower",
  "Finisher",
  "Broiler Pre-Starter",
  "Broiler Finisher",
];

export default function FeedStock() {
  const farms = storage.getFarms();
  const [stocks, setStocks] = useState<FS[]>(storage.getFeedStocks());
  const [dialog, setDialog] = useState(false);
  const [editItem, setEditItem] = useState<FS | null>(null);
  const [form, setForm] = useState({
    farmId: "",
    feedType: "",
    currentStockBags: "",
    alertThresholdBags: "10",
  });

  const lowStock = stocks.filter(
    (s) => s.currentStockBags <= s.alertThresholdBags,
  );

  const openEdit = (s: FS) => {
    setEditItem(s);
    setForm({
      farmId: s.farmId,
      feedType: s.feedType,
      currentStockBags: String(s.currentStockBags),
      alertThresholdBags: String(s.alertThresholdBags),
    });
    setDialog(true);
  };
  const openNew = () => {
    setEditItem(null);
    setForm({
      farmId: "",
      feedType: "",
      currentStockBags: "",
      alertThresholdBags: "10",
    });
    setDialog(true);
  };

  const save = () => {
    if (!form.feedType) return;
    const item: FS = {
      id: editItem?.id || `${Date.now()}`,
      farmId: form.farmId || "global",
      feedType: form.feedType,
      currentStockBags: Number.parseInt(form.currentStockBags) || 0,
      alertThresholdBags: Number.parseInt(form.alertThresholdBags) || 10,
    };
    storage.saveFeedStock(item);
    setStocks(storage.getFeedStocks());
    setDialog(false);
  };

  return (
    <div className="space-y-6" data-ocid="feed_stock.page">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feed Stock</h2>
        <Button onClick={openNew} data-ocid="feed_stock.add.button">
          <Plus size={16} className="mr-1" />
          Add Stock Record
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Stock Entries</p>
            <p className="text-2xl font-bold">{stocks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Bags</p>
            <p className="text-2xl font-bold">
              {stocks
                .reduce((s, x) => s + x.currentStockBags, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            {lowStock.length > 0 ? (
              <AlertTriangle className="text-red-500" size={24} />
            ) : (
              <Package className="text-emerald-500" size={24} />
            )}
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
              <p className="text-2xl font-bold">{lowStock.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {stocks.length === 0 ? (
        <Card data-ocid="feed_stock.empty_state">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Package size={40} className="mx-auto mb-2" />
            <p>No stock records. Add feed purchases to auto-create stock.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="feed_stock.table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2">Farm</th>
                <th className="text-left p-2">Feed Type</th>
                <th className="text-right p-2">Current Stock</th>
                <th className="text-right p-2">Alert Threshold</th>
                <th className="text-center p-2">Status</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {stocks.map((s, i) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-muted/30"
                  data-ocid={`feed_stock.row.${i + 1}`}
                >
                  <td className="p-2">
                    {s.farmId === "global"
                      ? "All Farms"
                      : farms.find((f) => f.id === s.farmId)?.name || s.farmId}
                  </td>
                  <td className="p-2">{s.feedType}</td>
                  <td className="p-2 text-right font-medium">
                    {s.currentStockBags} bags
                  </td>
                  <td className="p-2 text-right">
                    {s.alertThresholdBags} bags
                  </td>
                  <td className="p-2 text-center">
                    {s.currentStockBags <= s.alertThresholdBags ? (
                      <Badge variant="destructive">LOW STOCK</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        OK
                      </Badge>
                    )}
                  </td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(s)}
                      data-ocid={`feed_stock.edit_button.${i + 1}`}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent data-ocid="feed_stock.edit.dialog">
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Stock" : "Add Stock Record"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Farm</Label>
              <select
                data-ocid="feed_stock.farm.select"
                value={form.farmId}
                onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All Farms (Global)</option>
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Feed Type</Label>
              <select
                data-ocid="feed_stock.feed_type.select"
                value={form.feedType}
                onChange={(e) => setForm({ ...form, feedType: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select...</option>
                {FEED_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Current Stock (bags)</Label>
              <Input
                data-ocid="feed_stock.current.input"
                type="number"
                value={form.currentStockBags}
                onChange={(e) =>
                  setForm({ ...form, currentStockBags: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Alert Threshold (bags)</Label>
              <Input
                data-ocid="feed_stock.threshold.input"
                type="number"
                value={form.alertThresholdBags}
                onChange={(e) =>
                  setForm({ ...form, alertThresholdBags: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialog(false)}
              data-ocid="feed_stock.edit.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={save} data-ocid="feed_stock.edit.save_button">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
