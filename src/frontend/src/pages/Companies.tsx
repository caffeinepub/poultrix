import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Company, storage } from "@/lib/storage";
import { Building2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>(storage.getCompanies());
  const [form, setForm] = useState({ name: "", address: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    storage.addCompany({
      name: form.name.trim(),
      address: form.address.trim(),
    });
    setCompanies(storage.getCompanies());
    setForm({ name: "", address: "" });
  };

  const handleDelete = (id: string) => {
    storage.deleteCompany(id);
    setCompanies(storage.getCompanies());
  };

  return (
    <div className="space-y-6" data-ocid="companies.page">
      <h2 className="text-2xl font-bold">Companies</h2>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Add Company</h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <Label>Company Name *</Label>
              <Input
                data-ocid="companies.name.input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Al-Baraka Poultry"
                required
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                data-ocid="companies.address.input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="City / Address"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" data-ocid="companies.submit.button">
                <Plus size={16} className="mr-1" />
                Add Company
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {companies.length === 0 ? (
        <Card data-ocid="companies.empty_state">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Building2 size={40} className="mx-auto mb-2" />
            <p>No companies added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="companies.table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2">#</th>
                <th className="text-left p-2">Company Name</th>
                <th className="text-left p-2">Address</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {companies.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-muted/30"
                  data-ocid={`companies.row.${i + 1}`}
                >
                  <td className="p-2 text-muted-foreground">{i + 1}</td>
                  <td className="p-2 font-medium">{c.name}</td>
                  <td className="p-2 text-muted-foreground">
                    {c.address || "-"}
                  </td>
                  <td className="p-2 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(c.id)}
                      data-ocid={`companies.delete_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </Button>
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
