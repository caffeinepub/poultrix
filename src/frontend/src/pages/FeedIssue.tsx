import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const farms = storage.getFarms();
  const sheds = storage.getSheds();
  const [issues, setIssues] = useState<FI[]>(storage.getFeedIssues());
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
    setIssues(storage.getFeedIssues());
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <Label>Farm *</Label>
              <select
                data-ocid="feed_issue.farm.select"
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
              <Label>Shed</Label>
              <select
                data-ocid="feed_issue.shed.select"
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
              <Label>Feed Type *</Label>
              <select
                data-ocid="feed_issue.feed_type.select"
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
                data-ocid="feed_issue.qty.input"
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
              <Label>Issue Date</Label>
              <Input
                data-ocid="feed_issue.date.input"
                type="date"
                value={form.issueDate}
                onChange={(e) =>
                  setForm({ ...form, issueDate: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" data-ocid="feed_issue.submit.button">
                <Plus size={16} className="mr-1" />
                Issue Feed
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">Issue History</h3>
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
                  <th className="text-left p-2">Farm</th>
                  <th className="text-left p-2">Shed</th>
                  <th className="text-left p-2">Feed Type</th>
                  <th className="text-right p-2">Bags</th>
                </tr>
              </thead>
              <tbody>
                {[...issues].reverse().map((f, i) => (
                  <tr
                    key={f.id}
                    className="border-b hover:bg-muted/30"
                    data-ocid={`feed_issue.row.${i + 1}`}
                  >
                    <td className="p-2">{f.issueDate}</td>
                    <td className="p-2">
                      {farms.find((x) => x.id === f.farmId)?.name || "-"}
                    </td>
                    <td className="p-2">
                      {sheds.find((x) => x.id === f.shedId)?.name || "-"}
                    </td>
                    <td className="p-2">{f.feedType}</td>
                    <td className="p-2 text-right font-medium">
                      {f.quantityBags}
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
