import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Receipt, storage } from "@/lib/storage";
import { Plus, Receipt as ReceiptIcon, Trash2 } from "lucide-react";
import { useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

export default function Receipts() {
  const farms = storage.getFarms();
  const [receipts, setReceipts] = useState<Receipt[]>(storage.getReceipts());
  const [form, setForm] = useState({
    date: today(),
    farmId: "",
    amount: "",
    paymentType: "Cash" as "Cash" | "Online",
    notes: "",
    enteredBy: "",
  });

  const totalReceipts = receipts.reduce((s, r) => s + r.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.farmId || !form.amount) return;
    storage.addReceipt({
      date: form.date,
      farmId: form.farmId,
      amount: Number.parseFloat(form.amount) || 0,
      paymentType: form.paymentType,
      notes: form.notes,
      enteredBy: form.enteredBy,
    });
    setReceipts(storage.getReceipts());
    setForm({
      date: today(),
      farmId: "",
      amount: "",
      paymentType: "Cash",
      notes: "",
      enteredBy: "",
    });
  };

  const handleDelete = (id: string) => {
    storage.deleteReceipt(id);
    setReceipts(storage.getReceipts());
  };

  return (
    <div className="space-y-6" data-ocid="receipts.page">
      <h2 className="text-2xl font-bold">Receipts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ReceiptIcon size={18} className="text-blue-600" />
              <span className="text-xs text-muted-foreground">
                Total Receipts
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              PKR {totalReceipts.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ReceiptIcon size={18} className="text-indigo-600" />
              <span className="text-xs text-muted-foreground">
                Total Transactions
              </span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">
              {receipts.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Add Receipt</h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <Label>Date *</Label>
              <Input
                data-ocid="receipts.date.input"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Farm *</Label>
              <select
                data-ocid="receipts.farm.select"
                required
                value={form.farmId}
                onChange={(e) => setForm({ ...form, farmId: e.target.value })}
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
              <Label>Amount (PKR) *</Label>
              <Input
                data-ocid="receipts.amount.input"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label>Payment Type</Label>
              <select
                data-ocid="receipts.type.select"
                value={form.paymentType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentType: e.target.value as "Cash" | "Online",
                  })
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <div>
              <Label>Notes</Label>
              <Input
                data-ocid="receipts.notes.input"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Notes about this receipt"
              />
            </div>
            <div>
              <Label>Entered By</Label>
              <Input
                data-ocid="receipts.enteredby.input"
                value={form.enteredBy}
                onChange={(e) =>
                  setForm({ ...form, enteredBy: e.target.value })
                }
                placeholder="Name"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" data-ocid="receipts.submit.button">
                <Plus size={16} className="mr-1" />
                Save Receipt
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {receipts.length === 0 ? (
        <Card data-ocid="receipts.empty_state">
          <CardContent className="p-6 text-center text-muted-foreground">
            No receipts recorded yet.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="receipts.table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Farm</th>
                <th className="text-right p-2">Amount (PKR)</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Notes</th>
                <th className="text-left p-2">Entered By</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {[...receipts].reverse().map((r, i) => (
                <tr
                  key={r.id}
                  className="border-b hover:bg-muted/30"
                  data-ocid={`receipts.row.${i + 1}`}
                >
                  <td className="p-2">{r.date}</td>
                  <td className="p-2">
                    {farms.find((f) => f.id === r.farmId)?.name || "-"}
                  </td>
                  <td className="p-2 text-right font-medium text-blue-700">
                    {r.amount.toLocaleString()}
                  </td>
                  <td className="p-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        r.paymentType === "Cash"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {r.paymentType}
                    </span>
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {r.notes || "-"}
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {r.enteredBy || "-"}
                  </td>
                  <td className="p-2 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(r.id)}
                      data-ocid={`receipts.delete_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-muted/50 font-semibold">
                <td className="p-2" colSpan={2}>
                  Total
                </td>
                <td className="p-2 text-right text-blue-700">
                  PKR {totalReceipts.toLocaleString()}
                </td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
