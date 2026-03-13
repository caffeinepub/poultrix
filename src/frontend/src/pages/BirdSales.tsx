import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type BirdSale, storage } from "@/lib/storage";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

export default function BirdSales() {
  const farms = storage.getFarms();
  const batches = storage.getBatches();
  const [sales, setSales] = useState<BirdSale[]>(storage.getBirdSales());
  const [form, setForm] = useState({
    farmId: "",
    batchId: "",
    birdsQty: "",
    avgWeightKg: "",
    ratePerKg: "",
    traderName: "",
    vehicleNumber: "",
    dispatchDate: today(),
  });

  const farmBatches = useMemo(
    () =>
      batches.filter((b) => b.farmId === form.farmId && b.status === "active"),
    [batches, form.farmId],
  );
  const totalWeightKg =
    (Number.parseInt(form.birdsQty) || 0) *
    (Number.parseFloat(form.avgWeightKg) || 0);
  const totalAmount = totalWeightKg * (Number.parseFloat(form.ratePerKg) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.batchId || !form.birdsQty) return;
    storage.addBirdSale({
      farmId: form.farmId,
      batchId: form.batchId,
      birdsQty: Number.parseInt(form.birdsQty),
      avgWeightKg: Number.parseFloat(form.avgWeightKg) || 0,
      ratePerKg: Number.parseFloat(form.ratePerKg) || 0,
      totalWeightKg,
      totalAmount,
      traderName: form.traderName,
      vehicleNumber: form.vehicleNumber,
      dispatchDate: form.dispatchDate,
    });
    // reduce birds alive
    const batch = batches.find((b) => b.id === form.batchId);
    if (batch) {
      const newAlive = Math.max(
        0,
        batch.birdsAlive - Number.parseInt(form.birdsQty),
      );
      storage.updateBatch(form.batchId, {
        birdsAlive: newAlive,
        status: newAlive === 0 ? "sold" : "active",
      });
    }
    setSales(storage.getBirdSales());
    setForm({
      farmId: "",
      batchId: "",
      birdsQty: "",
      avgWeightKg: "",
      ratePerKg: "",
      traderName: "",
      vehicleNumber: "",
      dispatchDate: today(),
    });
  };

  const totalSales = sales.reduce((s, x) => s + x.totalAmount, 0);

  return (
    <div className="space-y-6" data-ocid="sales.page">
      <h2 className="text-2xl font-bold">Bird Sales</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold">{sales.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">
              PKR {totalSales.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Birds Sold</p>
            <p className="text-2xl font-bold">
              {sales.reduce((s, x) => s + x.birdsQty, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">New Sale Entry</h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <Label>Farm *</Label>
              <select
                data-ocid="sales.farm.select"
                required
                value={form.farmId}
                onChange={(e) =>
                  setForm({ ...form, farmId: e.target.value, batchId: "" })
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select Farm...</option>
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Batch *</Label>
              <select
                data-ocid="sales.batch.select"
                required
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select Batch...</option>
                {farmBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber} ({b.birdsAlive.toLocaleString()} alive)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Birds Quantity *</Label>
              <Input
                data-ocid="sales.birds_qty.input"
                required
                type="number"
                value={form.birdsQty}
                onChange={(e) => setForm({ ...form, birdsQty: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Avg Bird Weight (kg)</Label>
              <Input
                data-ocid="sales.avg_weight.input"
                type="number"
                step="0.01"
                value={form.avgWeightKg}
                onChange={(e) =>
                  setForm({ ...form, avgWeightKg: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Rate per kg (PKR)</Label>
              <Input
                data-ocid="sales.rate.input"
                type="number"
                step="0.01"
                value={form.ratePerKg}
                onChange={(e) =>
                  setForm({ ...form, ratePerKg: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Trader Name</Label>
              <Input
                data-ocid="sales.trader.input"
                value={form.traderName}
                onChange={(e) =>
                  setForm({ ...form, traderName: e.target.value })
                }
                placeholder="Trader"
              />
            </div>
            <div>
              <Label>Vehicle Number</Label>
              <Input
                data-ocid="sales.vehicle.input"
                value={form.vehicleNumber}
                onChange={(e) =>
                  setForm({ ...form, vehicleNumber: e.target.value })
                }
                placeholder="ABC-123"
              />
            </div>
            <div>
              <Label>Dispatch Date</Label>
              <Input
                data-ocid="sales.dispatch_date.input"
                type="date"
                value={form.dispatchDate}
                onChange={(e) =>
                  setForm({ ...form, dispatchDate: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Total Weight</p>
                <p className="font-bold text-lg">
                  {totalWeightKg.toFixed(2)} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold text-xl text-emerald-600">
                  PKR {totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" data-ocid="sales.submit.button">
                <Plus size={16} className="mr-1" />
                Record Sale
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">Sales History</h3>
        {sales.length === 0 ? (
          <Card data-ocid="sales.empty_state">
            <CardContent className="p-6 text-center text-muted-foreground">
              No sales recorded yet.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="sales.table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Batch</th>
                  <th className="text-left p-2">Farm</th>
                  <th className="text-right p-2">Birds</th>
                  <th className="text-right p-2">Wt(kg)</th>
                  <th className="text-right p-2">Rate</th>
                  <th className="text-right p-2">Total Wt</th>
                  <th className="text-right p-2">Amount</th>
                  <th className="text-left p-2">Trader</th>
                </tr>
              </thead>
              <tbody>
                {[...sales].reverse().map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-muted/30"
                    data-ocid={`sales.row.${i + 1}`}
                  >
                    <td className="p-2">{s.dispatchDate}</td>
                    <td className="p-2 text-xs font-mono">
                      {batches.find((b) => b.id === s.batchId)?.batchNumber ||
                        "-"}
                    </td>
                    <td className="p-2">
                      {farms.find((f) => f.id === s.farmId)?.name || "-"}
                    </td>
                    <td className="p-2 text-right">
                      {s.birdsQty.toLocaleString()}
                    </td>
                    <td className="p-2 text-right">{s.avgWeightKg}</td>
                    <td className="p-2 text-right">{s.ratePerKg}</td>
                    <td className="p-2 text-right">
                      {s.totalWeightKg.toFixed(2)}
                    </td>
                    <td className="p-2 text-right font-medium">
                      PKR {s.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-2">{s.traderName}</td>
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
