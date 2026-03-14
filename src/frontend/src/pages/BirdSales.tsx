import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompanyScope } from "@/lib/roleFilter";
import { type BirdSale, storage } from "@/lib/storage";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

export default function BirdSales() {
  const { farms } = useCompanyScope();
  const farmIds = new Set(farms.map((f) => f.id));
  const allBatches = storage.getBatches();
  const batches = allBatches.filter((b) => farmIds.has(b.farmId));
  const [sales, setSales] = useState<BirdSale[]>(() => {
    return storage.getBirdSales().filter((s) => farmIds.has(s.farmId));
  });
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
    const farmIds2 = new Set(farms.map((f) => f.id));
    const updated = storage.getBirdSales();
    setSales(updated.filter((s) => farmIds2.has(s.farmId)));
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

  return (
    <div className="space-y-6" data-ocid="sales.page">
      <h2 className="text-2xl font-bold">Bird Sales</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Farm *</Label>
                  <select
                    data-ocid="sales.farm.select"
                    value={form.farmId}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        farmId: e.target.value,
                        batchId: "",
                      }))
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
                <div className="col-span-2">
                  <Label>Batch *</Label>
                  <select
                    data-ocid="sales.batch.select"
                    value={form.batchId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, batchId: e.target.value }))
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    disabled={!form.farmId}
                  >
                    <option value="">Select Batch...</option>
                    {farmBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchNumber} ({b.birdsAlive} birds alive)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Birds Qty *</Label>
                  <Input
                    data-ocid="sales.qty.input"
                    type="number"
                    value={form.birdsQty}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birdsQty: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Avg Weight (kg)</Label>
                  <Input
                    data-ocid="sales.weight.input"
                    type="number"
                    step="0.01"
                    value={form.avgWeightKg}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, avgWeightKg: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Rate/kg (₹)</Label>
                  <Input
                    data-ocid="sales.rate.input"
                    type="number"
                    step="0.01"
                    value={form.ratePerKg}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, ratePerKg: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Dispatch Date</Label>
                  <Input
                    data-ocid="sales.date.input"
                    type="date"
                    value={form.dispatchDate}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        dispatchDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Trader Name</Label>
                  <Input
                    data-ocid="sales.trader.input"
                    value={form.traderName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, traderName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Vehicle No.</Label>
                  <Input
                    data-ocid="sales.vehicle.input"
                    value={form.vehicleNumber}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        vehicleNumber: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {totalAmount > 0 && (
                <div className="p-3 bg-muted/50 rounded text-sm">
                  Total Weight: {totalWeightKg.toFixed(2)} kg | Total:{" "}
                  <strong>₹ {totalAmount.toLocaleString()}</strong>
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                data-ocid="sales.submit_button"
              >
                <Plus size={16} className="mr-1" /> Record Sale
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Sales ({sales.length})</h3>
            {sales.length === 0 ? (
              <p
                className="text-muted-foreground text-sm"
                data-ocid="sales.empty_state"
              >
                No sales recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs" data-ocid="sales.table">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-1">Date</th>
                      <th className="text-left p-1">Farm</th>
                      <th className="text-right p-1">Birds</th>
                      <th className="text-right p-1">Wt(kg)</th>
                      <th className="text-right p-1">₹</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((s, i) => (
                      <tr
                        key={s.id}
                        className="border-b hover:bg-muted/30"
                        data-ocid={`sales.row.${i + 1}`}
                      >
                        <td className="p-1">{s.dispatchDate}</td>
                        <td className="p-1">
                          {farms.find((f) => f.id === s.farmId)?.name || "-"}
                        </td>
                        <td className="p-1 text-right">{s.birdsQty}</td>
                        <td className="p-1 text-right">
                          {s.totalWeightKg.toFixed(1)}
                        </td>
                        <td className="p-1 text-right">
                          {s.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
