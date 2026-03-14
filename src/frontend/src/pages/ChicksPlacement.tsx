import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompanyScope } from "@/lib/roleFilter";
import { type Batch, storage } from "@/lib/storage";
import { Bird, Plus } from "lucide-react";
import { useMemo, useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);
const genBatch = () =>
  `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(storage.getBatches().length + 1).padStart(3, "0")}`;
const statusColor = (s: string) =>
  s === "active"
    ? "bg-emerald-100 text-emerald-700"
    : s === "sold"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-600";

export default function ChicksPlacement() {
  const { farms } = useCompanyScope();
  const sheds = storage.getSheds();
  const allBatches = storage.getBatches();
  const farmIds = new Set(farms.map((f) => f.id));
  const [batches, setBatches] = useState<Batch[]>(
    allBatches.filter((b) => farmIds.has(b.farmId)),
  );
  const [form, setForm] = useState({
    farmId: "",
    shedId: "",
    placementDate: today(),
    hatcheryName: "",
    breedType: "",
    chicksQty: "",
    chicksRate: "",
    transportCost: "",
  });

  const filteredSheds = useMemo(
    () => sheds.filter((s) => s.farmId === form.farmId),
    [sheds, form.farmId],
  );
  const totalCost =
    (Number.parseInt(form.chicksQty) || 0) *
      (Number.parseInt(form.chicksRate) || 0) +
    (Number.parseInt(form.transportCost) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.farmId || !form.shedId || !form.chicksQty) return;
    storage.addBatch({
      batchNumber: genBatch(),
      farmId: form.farmId,
      shedId: form.shedId,
      placementDate: form.placementDate,
      hatcheryName: form.hatcheryName,
      breedType: form.breedType,
      chicksQty: Number.parseInt(form.chicksQty) || 0,
      chicksRate: Number.parseInt(form.chicksRate) || 0,
      transportCost: Number.parseInt(form.transportCost) || 0,
      totalPlacementCost: totalCost,
      birdsAlive: Number.parseInt(form.chicksQty) || 0,
      status: "active",
    });
    const farmIds2 = new Set(farms.map((f) => f.id));
    const updated = storage.getBatches();
    setBatches(updated.filter((b) => farmIds2.has(b.farmId)));
    setForm({
      farmId: "",
      shedId: "",
      placementDate: today(),
      hatcheryName: "",
      breedType: "",
      chicksQty: "",
      chicksRate: "",
      transportCost: "",
    });
  };

  return (
    <div className="space-y-6" data-ocid="chicks.page">
      <h2 className="text-2xl font-bold">Chick Placement</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Farm *</Label>
                  <select
                    data-ocid="chicks.farm.select"
                    value={form.farmId}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        farmId: e.target.value,
                        shedId: "",
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
                  <Label>Shed *</Label>
                  <select
                    data-ocid="chicks.shed.select"
                    value={form.shedId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, shedId: e.target.value }))
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    disabled={!form.farmId}
                  >
                    <option value="">Select Shed...</option>
                    {filteredSheds.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Placement Date</Label>
                  <Input
                    data-ocid="chicks.date.input"
                    type="date"
                    value={form.placementDate}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        placementDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Chicks Qty *</Label>
                  <Input
                    data-ocid="chicks.qty.input"
                    type="number"
                    value={form.chicksQty}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, chicksQty: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Chick Rate (₹)</Label>
                  <Input
                    data-ocid="chicks.rate.input"
                    type="number"
                    value={form.chicksRate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, chicksRate: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Transport Cost</Label>
                  <Input
                    data-ocid="chicks.transport.input"
                    type="number"
                    value={form.transportCost}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        transportCost: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Hatchery Name</Label>
                  <Input
                    data-ocid="chicks.hatchery.input"
                    value={form.hatcheryName}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        hatcheryName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Breed Type</Label>
                  <Input
                    data-ocid="chicks.breed.input"
                    value={form.breedType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, breedType: e.target.value }))
                    }
                  />
                </div>
              </div>
              {totalCost > 0 && (
                <div className="p-3 bg-muted/50 rounded text-sm">
                  Total Placement Cost:{" "}
                  <strong>₹ {totalCost.toLocaleString()}</strong>
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                data-ocid="chicks.submit_button"
              >
                <Plus size={16} className="mr-1" /> Add Batch
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Batches ({batches.length})</h3>
            {batches.length === 0 ? (
              <div
                className="text-center text-muted-foreground py-8"
                data-ocid="chicks.empty_state"
              >
                <Bird size={40} className="mx-auto mb-2" />
                <p>No batches yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs" data-ocid="chicks.table">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-1">Batch</th>
                      <th className="text-left p-1">Farm</th>
                      <th className="text-right p-1">Placed</th>
                      <th className="text-right p-1">Alive</th>
                      <th className="text-right p-1">Rate</th>
                      <th className="text-left p-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((b, i) => (
                      <tr
                        key={b.id}
                        className="border-b hover:bg-muted/30"
                        data-ocid={`chicks.row.${i + 1}`}
                      >
                        <td className="p-1">{b.batchNumber}</td>
                        <td className="p-1 text-muted-foreground">
                          {farms.find((f) => f.id === b.farmId)?.name || "-"}
                        </td>
                        <td className="p-1 text-right">{b.chicksQty}</td>
                        <td className="p-1 text-right">{b.birdsAlive}</td>
                        <td className="p-1 text-right">₹ {b.chicksRate}</td>
                        <td className="p-1">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${statusColor(b.status)}`}
                          >
                            {b.status}
                          </span>
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
