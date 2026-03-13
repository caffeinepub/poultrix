import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccessibleFarmIds } from "@/lib/roleFilter";
import { type FeedIssue as FI, storage } from "@/lib/storage";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);
const FEED_TYPES = [
  "Starter",
  "Grower",
  "Finisher",
  "Broiler Pre-Starter",
  "Broiler Finisher",
];

export default function FeedIssue() {
  const accessibleFarmIds = useAccessibleFarmIds();
  const allFarms = storage.getFarms();
  const farms =
    accessibleFarmIds === null
      ? allFarms
      : allFarms.filter((f) => accessibleFarmIds.includes(f.id));
  const sheds = storage.getSheds();
  const allIssues = storage.getFeedIssues();
  const [issues, setIssues] = useState<FI[]>(
    accessibleFarmIds === null
      ? allIssues
      : allIssues.filter((i) => accessibleFarmIds.includes(i.farmId)),
  );
  const [form, setForm] = useState({
    farmId: "",
    shedId: "",
    feedType: "",
    quantityBags: "",
    issueDate: today(),
  });
  const filteredSheds = useMemo(
    () => sheds.filter((s) => s.farmId === form.farmId),
    [sheds, form.farmId],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.farmId || !form.feedType || !form.quantityBags) return;
    storage.addFeedIssue({
      farmId: form.farmId,
      shedId: form.shedId,
      feedType: form.feedType,
      quantityBags: Number.parseInt(form.quantityBags),
      issueDate: form.issueDate,
    });
    const updated = storage.getFeedIssues();
    setIssues(
      accessibleFarmIds === null
        ? updated
        : updated.filter((i) => accessibleFarmIds.includes(i.farmId)),
    );
    setForm({
      farmId: "",
      shedId: "",
      feedType: "",
      quantityBags: "",
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
            <div>
              <Label>Farm *</Label>
              <select
                data-ocid="feed_issue.farm.select"
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
            <div>
              <Label>Feed Type *</Label>
              <select
                data-ocid="feed_issue.type.select"
                value={form.feedType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, feedType: e.target.value }))
                }
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
              <Label>Quantity (Bags) *</Label>
              <Input
                data-ocid="feed_issue.qty.input"
                type="number"
                value={form.quantityBags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quantityBags: e.target.value }))
                }
              />
            </div>
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
            <div className="flex items-end">
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

      {issues.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="feed_issue.table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Farm</th>
                <th className="text-left p-2">Shed</th>
                <th className="text-left p-2">Feed Type</th>
                <th className="text-right p-2">Bags</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((i, idx) => (
                <tr
                  key={i.id}
                  className="border-b hover:bg-muted/30"
                  data-ocid={`feed_issue.row.${idx + 1}`}
                >
                  <td className="p-2">{i.issueDate}</td>
                  <td className="p-2">
                    {farms.find((f) => f.id === i.farmId)?.name || "-"}
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {sheds.find((s) => s.id === i.shedId)?.name || "-"}
                  </td>
                  <td className="p-2">{i.feedType}</td>
                  <td className="p-2 text-right">{i.quantityBags}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
