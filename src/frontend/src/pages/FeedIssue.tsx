import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompanyScope } from "@/lib/roleFilter";
import { type FeedIssue as FI, storage } from "@/lib/storage";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

export default function FeedIssue() {
  const { farms, zones, branches, feedTypes } = useCompanyScope();
  const sheds = storage.getSheds();

  const allIssues = storage.getFeedIssues();
  const farmIds = new Set(farms.map((f) => f.id));
  const [issues, setIssues] = useState<FI[]>(
    allIssues.filter((i) => farmIds.has(i.farmId)),
  );
  const [form, setForm] = useState({
    zoneId: "",
    branchId: "",
    farmId: "",
    shedId: "",
    feedType: "",
    unit: "bags" as "bags" | "kg",
    quantityBags: "",
    quantityKgInput: "",
    issueDate: today(),
  });

  const filteredBranches = useMemo(
    () =>
      form.zoneId ? branches.filter((b) => b.zoneId === form.zoneId) : branches,
    [branches, form.zoneId],
  );
  const filteredFarms = useMemo(
    () =>
      form.branchId
        ? farms.filter((f) => f.branchId === form.branchId)
        : form.zoneId
          ? farms.filter((f) => f.zoneId === form.zoneId)
          : farms,
    [farms, form.branchId, form.zoneId],
  );
  const filteredSheds = useMemo(
    () => sheds.filter((s) => s.farmId === form.farmId),
    [sheds, form.farmId],
  );

  const bags =
    form.unit === "bags"
      ? Number(form.quantityBags) || 0
      : Math.round((Number(form.quantityKgInput) || 0) / 50);
  const kg =
    form.unit === "kg"
      ? Number(form.quantityKgInput) || 0
      : (Number(form.quantityBags) || 0) * 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.farmId || !form.feedType || bags === 0) return;
    storage.addFeedIssue({
      farmId: form.farmId,
      shedId: form.shedId,
      feedType: form.feedType,
      quantityBags: bags,
      quantityKg: kg,
      issueDate: form.issueDate,
      zoneId: form.zoneId || undefined,
      branchId: form.branchId || undefined,
    });
    const updated = storage.getFeedIssues();
    setIssues(updated.filter((i) => farms.some((f) => f.id === i.farmId)));
    setForm({
      zoneId: "",
      branchId: "",
      farmId: "",
      shedId: "",
      feedType: "",
      unit: "bags",
      quantityBags: "",
      quantityKgInput: "",
      issueDate: today(),
    });
  };

  return (
    <div className="space-y-6" data-ocid="feed_issue.page">
      <h2 className="text-2xl font-bold">Feed Issue to Farm</h2>
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {/* Zone */}
            <div>
              <Label>Zone</Label>
              <select
                data-ocid="feed_issue.zone.select"
                value={form.zoneId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    zoneId: e.target.value,
                    branchId: "",
                    farmId: "",
                    shedId: "",
                  }))
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All Zones</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <Label>Branch</Label>
              <select
                data-ocid="feed_issue.branch.select"
                value={form.branchId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    branchId: e.target.value,
                    farmId: "",
                    shedId: "",
                  }))
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All Branches</option>
                {filteredBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Farm */}
            <div>
              <Label>Farm *</Label>
              <select
                data-ocid="feed_issue.farm.select"
                required
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
                {filteredFarms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Shed */}
            <div>
              <Label>Shed</Label>
              <select
                data-ocid="feed_issue.shed.select"
                value={form.shedId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shedId: e.target.value }))
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                disabled={!form.farmId}
              >
                <option value="">All Sheds</option>
                {filteredSheds.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Feed Type */}
            <div>
              <Label>Feed Type *</Label>
              <select
                data-ocid="feed_issue.type.select"
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

            {/* Quantity with unit toggle */}
            <div>
              <Label>Quantity</Label>
              <div className="flex gap-2 items-start mt-1">
                <div className="flex rounded-md border border-input overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, unit: "bags" }))}
                    className={`px-2 py-1.5 text-xs font-medium transition-colors ${
                      form.unit === "bags"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    }`}
                    data-ocid="feed_issue.unit_bags.toggle"
                  >
                    Bags
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, unit: "kg" }))}
                    className={`px-2 py-1.5 text-xs font-medium transition-colors ${
                      form.unit === "kg"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    }`}
                    data-ocid="feed_issue.unit_kg.toggle"
                  >
                    KG
                  </button>
                </div>
                {form.unit === "bags" ? (
                  <div className="flex-1">
                    <Input
                      data-ocid="feed_issue.qty.input"
                      type="number"
                      min="0"
                      value={form.quantityBags}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, quantityBags: e.target.value }))
                      }
                      placeholder="Bags"
                    />
                    {bags > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        = {bags * 50} kg
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex-1">
                    <Input
                      data-ocid="feed_issue.qty_kg.input"
                      type="number"
                      min="0"
                      value={form.quantityKgInput}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          quantityKgInput: e.target.value,
                        }))
                      }
                      placeholder="KG"
                    />
                    {kg > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ≈ {Math.round(kg / 50)} bags
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Date */}
            <div>
              <Label>Issue Date</Label>
              <Input
                data-ocid="feed_issue.date.input"
                type="date"
                value={form.issueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, issueDate: e.target.value }))
                }
              />
            </div>

            <div className="flex items-end col-span-2 md:col-span-1">
              <Button
                type="submit"
                className="w-full"
                data-ocid="feed_issue.submit_button"
              >
                <Plus size={16} className="mr-1" /> Issue Feed
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {issues.length === 0 ? (
        <Card data-ocid="feed_issue.empty_state">
          <CardContent className="p-6 text-center text-muted-foreground">
            No feed issues recorded.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="feed_issue.table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Zone</th>
                <th className="text-left p-2">Branch</th>
                <th className="text-left p-2">Farm</th>
                <th className="text-left p-2">Shed</th>
                <th className="text-left p-2">Feed Type</th>
                <th className="text-right p-2">Bags</th>
                <th className="text-right p-2">KG</th>
              </tr>
            </thead>
            <tbody>
              {[...issues].reverse().map((i, idx) => (
                <tr
                  key={i.id}
                  className="border-b hover:bg-muted/30"
                  data-ocid={`feed_issue.row.${idx + 1}`}
                >
                  <td className="p-2">{i.issueDate}</td>
                  <td className="p-2 text-muted-foreground">
                    {zones.find((z) => z.id === i.zoneId)?.name || "—"}
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {branches.find((b) => b.id === i.branchId)?.name || "—"}
                  </td>
                  <td className="p-2">
                    {farms.find((f) => f.id === i.farmId)?.name || "-"}
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {sheds.find((s) => s.id === i.shedId)?.name || "-"}
                  </td>
                  <td className="p-2">
                    <Badge variant="outline">{i.feedType}</Badge>
                  </td>
                  <td className="p-2 text-right">{i.quantityBags}</td>
                  <td className="p-2 text-right text-muted-foreground">
                    {i.quantityKg ?? i.quantityBags * 50}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
