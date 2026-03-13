import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const farms = storage.getFarms();
  const sheds = storage.getSheds();
  const [batches, setBatches] = useState<Batch[]>(storage.getBatches());
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
      chicksQty: Number.parseInt(form.chicksQty),
      chicksRate: Number.parseInt(form.chicksRate) || 0,
      transportCost: Number.parseInt(form.transportCost) || 0,
      totalPlacementCost: totalCost,
      birdsAlive: Number.parseInt(form.chicksQty),
      status: "active",
    });
    setBatches(storage.getBatches());
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
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">New Placement</h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <Label>Farm *</Label>
              <select
                data-ocid="chicks.farm.select"
                required
                value={form.farmId}
                onChange={(e) =>
                  setForm({ ...form, farmId: e.target.value, shedId: "" })
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
              <Label>Shed *</Label>
              <select
                data-ocid="chicks.shed.select"
                required
                value={form.shedId}
                onChange={(e) => setForm({ ...form, shedId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
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
                data-ocid="chicks.placement_date.input"
                type="date"
                value={form.placementDate}
                onChange={(e) =>
                  setForm({ ...form, placementDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Hatchery Name</Label>
              <Input
                data-ocid="chicks.hatchery.input"
                value={form.hatcheryName}
                onChange={(e) =>
                  setForm({ ...form, hatcheryName: e.target.value })
                }
                placeholder="Hatchery"
              />
            </div>
            <div>
              <Label>Breed Type</Label>
              <Input
                data-ocid="chicks.breed.input"
                value={form.breedType}
                onChange={(e) =>
                  setForm({ ...form, breedType: e.target.value })
                }
                placeholder="e.g. Ross 308"
              />
            </div>
            <div>
              <Label>Chicks Quantity *</Label>
              <Input
                data-ocid="chicks.qty.input"
                required
                type="number"
                value={form.chicksQty}
                onChange={(e) =>
                  setForm({ ...form, chicksQty: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Chicks Rate (PKR/chick)</Label>
              <Input
                data-ocid="chicks.rate.input"
                type="number"
                value={form.chicksRate}
                onChange={(e) =>
                  setForm({ ...form, chicksRate: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Transport Cost (PKR)</Label>
              <Input
                data-ocid="chicks.transport.input"
                type="number"
                value={form.transportCost}
                onChange={(e) =>
                  setForm({ ...form, transportCost: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div className="sm:col-span-2 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                Total Placement Cost:{" "}
              </span>
              <span className="font-bold text-lg">
                PKR {totalCost.toLocaleString()}
              </span>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" data-ocid="chicks.submit.button">
                <Plus size={16} className="mr-1" />
                Place Chicks
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">All Batches ({batches.length})</h3>
        {batches.length === 0 ? (
          <Card data-ocid="chicks.empty_state">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Bird size={40} className="mx-auto mb-2" />
              <p>No batches placed yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="chicks.batches.table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2">Batch#</th>
                  <th className="text-left p-2">Farm</th>
                  <th className="text-left p-2">Shed</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Chicks</th>
                  <th className="text-right p-2">Alive</th>
                  <th className="text-right p-2">Cost</th>
                  <th className="text-center p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b, i) => (
                  <tr
                    key={b.id}
                    className="border-b hover:bg-muted/30"
                    data-ocid={`chicks.batch.row.${i + 1}`}
                  >
                    <td className="p-2 font-mono text-xs">{b.batchNumber}</td>
                    <td className="p-2">
                      {farms.find((f) => f.id === b.farmId)?.name || "-"}
                    </td>
                    <td className="p-2">
                      {sheds.find((s) => s.id === b.shedId)?.name || "-"}
                    </td>
                    <td className="p-2">{b.placementDate}</td>
                    <td className="p-2 text-right">
                      {b.chicksQty.toLocaleString()}
                    </td>
                    <td className="p-2 text-right font-medium">
                      {b.birdsAlive.toLocaleString()}
                    </td>
                    <td className="p-2 text-right">
                      PKR {b.totalPlacementCost.toLocaleString()}
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(b.status)}`}
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
      </div>
    </div>
  );
}
