import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type DailyEntry as DE, storage } from "@/lib/storage";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

export default function DailyEntry() {
  const batches = storage.getBatches().filter((b) => b.status === "active");
  const farms = storage.getFarms();
  const [entries, setEntries] = useState<DE[]>(storage.getDailyEntries());
  const [medicines, setMedicines] = useState(storage.getMedicines());
  const [vaccines, setVaccines] = useState(storage.getVaccines());
  const [newMedicine, setNewMedicine] = useState("");
  const [newVaccine, setNewVaccine] = useState("");
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);

  const [form, setForm] = useState({
    batchId: "",
    entryDate: today(),
    birdsAlive: "",
    mortalityCount: "",
    cullBirds: "",
    feedIntakeGrams: "",
    bodyWeightGrams: "",
    waterConsumptionLiters: "",
    medicineUsed: "",
    vaccineUsed: "",
    remarks: "",
  });

  const selBatch = batches.find((b) => b.id === form.batchId);
  const prevEntries = useMemo(
    () => entries.filter((e) => e.batchId === form.batchId),
    [entries, form.batchId],
  );
  const cumulativeFeed =
    prevEntries.reduce((s, e) => s + e.feedIntakeGrams, 0) +
    (Number.parseInt(form.feedIntakeGrams) || 0);
  const fcr =
    (Number.parseInt(form.bodyWeightGrams) || 0) > 0
      ? Number.parseFloat(
          (
            cumulativeFeed / (Number.parseInt(form.bodyWeightGrams) || 1)
          ).toFixed(2),
        )
      : 0;
  const mortalityPct = selBatch
    ? Number.parseFloat(
        (
          ((selBatch.chicksQty -
            selBatch.birdsAlive +
            (Number.parseInt(form.mortalityCount) || 0)) /
            selBatch.chicksQty) *
          100
        ).toFixed(1),
      )
    : 0;

  const handleAddMedicine = () => {
    if (!newMedicine.trim()) return;
    storage.addMedicine(newMedicine.trim());
    setMedicines(storage.getMedicines());
    setForm({ ...form, medicineUsed: newMedicine.trim() });
    setNewMedicine("");
    setShowAddMedicine(false);
  };

  const handleAddVaccine = () => {
    if (!newVaccine.trim()) return;
    storage.addVaccine(newVaccine.trim());
    setVaccines(storage.getVaccines());
    setForm({ ...form, vaccineUsed: newVaccine.trim() });
    setNewVaccine("");
    setShowAddVaccine(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.batchId) return;
    const dead =
      (Number.parseInt(form.mortalityCount) || 0) +
      (Number.parseInt(form.cullBirds) || 0);
    storage.addDailyEntry({
      batchId: form.batchId,
      entryDate: form.entryDate,
      birdsAlive: Number.parseInt(form.birdsAlive) || 0,
      mortalityCount: Number.parseInt(form.mortalityCount) || 0,
      cullBirds: Number.parseInt(form.cullBirds) || 0,
      feedIntakeGrams: Number.parseInt(form.feedIntakeGrams) || 0,
      bodyWeightGrams: Number.parseInt(form.bodyWeightGrams) || 0,
      waterConsumptionLiters:
        Number.parseFloat(form.waterConsumptionLiters) || 0,
      fcr,
      mortalityPct,
      cumulativeFeed,
      medicineUsed: form.medicineUsed || undefined,
      vaccineUsed: form.vaccineUsed || undefined,
      remarks: form.remarks || undefined,
    });
    if (selBatch) {
      const newAlive = Math.max(0, selBatch.birdsAlive - dead);
      storage.updateBatch(form.batchId, { birdsAlive: newAlive });
    }
    setEntries(storage.getDailyEntries());
    setForm((f) => ({
      ...f,
      birdsAlive: "",
      mortalityCount: "",
      cullBirds: "",
      feedIntakeGrams: "",
      bodyWeightGrams: "",
      waterConsumptionLiters: "",
      medicineUsed: "",
      vaccineUsed: "",
      remarks: "",
    }));
  };

  return (
    <div className="space-y-6" data-ocid="daily.page">
      <h2 className="text-2xl font-bold">Daily Farm Entry</h2>
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <Label>Batch *</Label>
              <select
                data-ocid="daily.batch.select"
                required
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select Batch...</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber} —{" "}
                    {farms.find((f) => f.id === b.farmId)?.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Entry Date</Label>
              <Input
                data-ocid="daily.date.input"
                type="date"
                value={form.entryDate}
                onChange={(e) =>
                  setForm({ ...form, entryDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Birds Alive</Label>
              <Input
                data-ocid="daily.birds_alive.input"
                type="number"
                value={form.birdsAlive}
                onChange={(e) =>
                  setForm({ ...form, birdsAlive: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Mortality Count</Label>
              <Input
                data-ocid="daily.mortality.input"
                type="number"
                value={form.mortalityCount}
                onChange={(e) =>
                  setForm({ ...form, mortalityCount: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Cull Birds</Label>
              <Input
                data-ocid="daily.cull.input"
                type="number"
                value={form.cullBirds}
                onChange={(e) =>
                  setForm({ ...form, cullBirds: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Feed Intake (grams/bird)</Label>
              <Input
                data-ocid="daily.feed.input"
                type="number"
                value={form.feedIntakeGrams}
                onChange={(e) =>
                  setForm({ ...form, feedIntakeGrams: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Body Weight (grams)</Label>
              <Input
                data-ocid="daily.weight.input"
                type="number"
                value={form.bodyWeightGrams}
                onChange={(e) =>
                  setForm({ ...form, bodyWeightGrams: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Water Consumption (liters)</Label>
              <Input
                data-ocid="daily.water.input"
                type="number"
                value={form.waterConsumptionLiters}
                onChange={(e) =>
                  setForm({ ...form, waterConsumptionLiters: e.target.value })
                }
                placeholder="0"
              />
            </div>

            {/* Medicine Used */}
            <div className="space-y-1">
              <Label>Medicine Used</Label>
              <div className="flex gap-2">
                <select
                  data-ocid="daily.medicine.select"
                  value={form.medicineUsed}
                  onChange={(e) => {
                    if (e.target.value === "__add__") {
                      setShowAddMedicine(true);
                    } else {
                      setForm({ ...form, medicineUsed: e.target.value });
                    }
                  }}
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">None</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                  <option value="__add__">＋ Add New Medicine</option>
                </select>
              </div>
              {showAddMedicine && (
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newMedicine}
                    onChange={(e) => setNewMedicine(e.target.value)}
                    placeholder="Medicine name"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddMedicine}
                    data-ocid="daily.add_medicine.button"
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddMedicine(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Vaccine Used */}
            <div className="space-y-1">
              <Label>Vaccine Used</Label>
              <div className="flex gap-2">
                <select
                  data-ocid="daily.vaccine.select"
                  value={form.vaccineUsed}
                  onChange={(e) => {
                    if (e.target.value === "__add__") {
                      setShowAddVaccine(true);
                    } else {
                      setForm({ ...form, vaccineUsed: e.target.value });
                    }
                  }}
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">None</option>
                  {vaccines.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                  <option value="__add__">＋ Add New Vaccine</option>
                </select>
              </div>
              {showAddVaccine && (
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newVaccine}
                    onChange={(e) => setNewVaccine(e.target.value)}
                    placeholder="Vaccine name"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddVaccine}
                    data-ocid="daily.add_vaccine.button"
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddVaccine(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Remarks */}
            <div className="sm:col-span-2">
              <Label>Remarks</Label>
              <Textarea
                data-ocid="daily.remarks.textarea"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                placeholder="Additional notes or observations..."
                rows={2}
              />
            </div>

            <div className="sm:col-span-2 grid grid-cols-3 gap-3 p-3 bg-muted rounded-lg text-sm">
              <div>
                <span className="text-muted-foreground">FCR</span>
                <p className="font-bold text-lg">{fcr}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Mortality %</span>
                <p className="font-bold text-lg">{mortalityPct}%</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cum. Feed</span>
                <p className="font-bold text-lg">
                  {cumulativeFeed.toLocaleString()}g
                </p>
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" data-ocid="daily.submit.button">
                <Plus size={16} className="mr-1" />
                Save Entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">Recent Entries</h3>
        {entries.length === 0 ? (
          <Card data-ocid="daily.empty_state">
            <CardContent className="p-6 text-center text-muted-foreground">
              No entries yet.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="daily.entries.table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Batch</th>
                  <th className="text-right p-2">Alive</th>
                  <th className="text-right p-2">Deaths</th>
                  <th className="text-right p-2">Feed(g)</th>
                  <th className="text-right p-2">FCR</th>
                  <th className="text-right p-2">Mort%</th>
                  <th className="text-left p-2">Medicine</th>
                  <th className="text-left p-2">Vaccine</th>
                  <th className="text-left p-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {[...entries]
                  .reverse()
                  .slice(0, 50)
                  .map((e, i) => (
                    <tr
                      key={e.id}
                      className="border-b hover:bg-muted/30"
                      data-ocid={`daily.entry.row.${i + 1}`}
                    >
                      <td className="p-2">{e.entryDate}</td>
                      <td className="p-2 text-xs font-mono">
                        {batches.find((b) => b.id === e.batchId)?.batchNumber ||
                          e.batchId.slice(0, 8)}
                      </td>
                      <td className="p-2 text-right">
                        {e.birdsAlive.toLocaleString()}
                      </td>
                      <td className="p-2 text-right text-red-600">
                        {e.mortalityCount}
                      </td>
                      <td className="p-2 text-right">
                        {e.feedIntakeGrams.toLocaleString()}
                      </td>
                      <td className="p-2 text-right">{e.fcr}</td>
                      <td className="p-2 text-right">{e.mortalityPct}%</td>
                      <td className="p-2 text-xs">{e.medicineUsed || "-"}</td>
                      <td className="p-2 text-xs">{e.vaccineUsed || "-"}</td>
                      <td
                        className="p-2 text-xs max-w-[120px] truncate"
                        title={e.remarks}
                      >
                        {e.remarks || "-"}
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
