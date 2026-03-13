import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Farm, type Shed, storage } from "@/lib/storage";
import { Building2, Home, Plus } from "lucide-react";
import { useState } from "react";

export default function Farms() {
  const [farms, setFarms] = useState<Farm[]>(storage.getFarms());
  const [sheds, setSheds] = useState<Shed[]>(storage.getSheds());
  const [farmDialog, setFarmDialog] = useState(false);
  const [shedDialog, setShedDialog] = useState(false);
  const [farmForm, setFarmForm] = useState({
    name: "",
    location: "",
    totalCapacity: "",
  });
  const [shedForm, setShedForm] = useState({
    farmId: "",
    name: "",
    capacity: "",
  });

  const saveFarm = () => {
    if (!farmForm.name) return;
    storage.addFarm({
      name: farmForm.name,
      location: farmForm.location,
      totalCapacity: Number.parseInt(farmForm.totalCapacity) || 0,
    });
    setFarms(storage.getFarms());
    setFarmForm({ name: "", location: "", totalCapacity: "" });
    setFarmDialog(false);
  };
  const saveShed = () => {
    if (!shedForm.name || !shedForm.farmId) return;
    storage.addShed({
      farmId: shedForm.farmId,
      name: shedForm.name,
      capacity: Number.parseInt(shedForm.capacity) || 0,
    });
    setSheds(storage.getSheds());
    setShedForm({ farmId: "", name: "", capacity: "" });
    setShedDialog(false);
  };

  return (
    <div className="space-y-6" data-ocid="farms.page">
      <h2 className="text-2xl font-bold">Farm Management</h2>
      <Tabs defaultValue="farms" data-ocid="farms.tab">
        <TabsList>
          <TabsTrigger value="farms" data-ocid="farms.farms.tab">
            Farms ({farms.length})
          </TabsTrigger>
          <TabsTrigger value="sheds" data-ocid="farms.sheds.tab">
            Sheds ({sheds.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="farms" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setFarmDialog(true)}
              data-ocid="farms.add_farm.button"
            >
              <Plus size={16} className="mr-1" />
              Add Farm
            </Button>
          </div>
          {farms.length === 0 ? (
            <Card data-ocid="farms.empty_state">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Building2 size={40} className="mx-auto mb-2" />
                <p>No farms added yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {farms.map((f, i) => (
                <Card key={f.id} data-ocid={`farms.farm.card.${i + 1}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{f.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {f.location}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {sheds.filter((s) => s.farmId === f.id).length} sheds
                      </Badge>
                    </div>
                    <p className="text-sm mt-2">
                      Capacity:{" "}
                      <span className="font-medium">
                        {f.totalCapacity.toLocaleString()} birds
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="sheds" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setShedDialog(true)}
              data-ocid="farms.add_shed.button"
            >
              <Plus size={16} className="mr-1" />
              Add Shed
            </Button>
          </div>
          {sheds.length === 0 ? (
            <Card data-ocid="farms.sheds.empty_state">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Home size={40} className="mx-auto mb-2" />
                <p>No sheds added yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="farms.sheds.table">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Shed</th>
                    <th className="text-left p-2">Farm</th>
                    <th className="text-right p-2">Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {sheds.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-b hover:bg-muted/50"
                      data-ocid={`farms.shed.row.${i + 1}`}
                    >
                      <td className="p-2 font-medium">{s.name}</td>
                      <td className="p-2 text-muted-foreground">
                        {farms.find((f) => f.id === s.farmId)?.name || "-"}
                      </td>
                      <td className="p-2 text-right">
                        {s.capacity.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={farmDialog} onOpenChange={setFarmDialog}>
        <DialogContent data-ocid="farms.add_farm.dialog">
          <DialogHeader>
            <DialogTitle>Add Farm</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Farm Name</Label>
              <Input
                data-ocid="farms.farm_name.input"
                value={farmForm.name}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, name: e.target.value })
                }
                placeholder="e.g. Farm A"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                data-ocid="farms.farm_location.input"
                value={farmForm.location}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, location: e.target.value })
                }
                placeholder="City/Area"
              />
            </div>
            <div>
              <Label>Total Capacity (birds)</Label>
              <Input
                data-ocid="farms.farm_capacity.input"
                type="number"
                value={farmForm.totalCapacity}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, totalCapacity: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFarmDialog(false)}
              data-ocid="farms.add_farm.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={saveFarm} data-ocid="farms.add_farm.submit_button">
              Save Farm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shedDialog} onOpenChange={setShedDialog}>
        <DialogContent data-ocid="farms.add_shed.dialog">
          <DialogHeader>
            <DialogTitle>Add Shed</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Farm</Label>
              <select
                data-ocid="farms.shed_farm.select"
                value={shedForm.farmId}
                onChange={(e) =>
                  setShedForm({ ...shedForm, farmId: e.target.value })
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
              <Label>Shed Name</Label>
              <Input
                data-ocid="farms.shed_name.input"
                value={shedForm.name}
                onChange={(e) =>
                  setShedForm({ ...shedForm, name: e.target.value })
                }
                placeholder="e.g. Shed 1"
              />
            </div>
            <div>
              <Label>Capacity (birds)</Label>
              <Input
                data-ocid="farms.shed_capacity.input"
                type="number"
                value={shedForm.capacity}
                onChange={(e) =>
                  setShedForm({ ...shedForm, capacity: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShedDialog(false)}
              data-ocid="farms.add_shed.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={saveShed} data-ocid="farms.add_shed.submit_button">
              Save Shed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
