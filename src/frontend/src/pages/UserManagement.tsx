import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { type User, storage } from "@/lib/storage";
import { Pencil, Plus, Trash2, UserCheck, UserX } from "lucide-react";
import { useState } from "react";

type FormState = {
  name: string;
  username: string;
  password: string;
  role: User["role"];
  companyId: string;
  assignedFarmIds: string[];
  assignedZoneIds: string[];
  assignedBranchIds: string[];
  assignedShedId: string;
  active: boolean;
};

const emptyForm = (): FormState => ({
  name: "",
  username: "",
  password: "",
  role: "Farmer",
  companyId: "",
  assignedFarmIds: [],
  assignedZoneIds: [],
  assignedBranchIds: [],
  assignedShedId: "",
  active: true,
});

export default function UserManagement() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const companies = storage.getCompanies();
  const allZones = storage.getZones();
  const allBranches = storage.getBranches();
  const allFarms = storage.getFarms();
  const allSheds = storage.getSheds();

  const isSuperAdmin = currentUser?.role === "SuperAdmin";
  const isCompanyAdmin = currentUser?.role === "CompanyAdmin";

  const visibleUsers = users.filter((u) => {
    if (isSuperAdmin) return true;
    if (isCompanyAdmin)
      return u.companyId === currentUser?.companyId || u.id === currentUser?.id;
    return false;
  });

  const formCompanyId = isSuperAdmin
    ? form.companyId
    : currentUser?.companyId || "";
  const filteredZones = allZones.filter(
    (z) => !formCompanyId || z.companyId === formCompanyId,
  );
  const filteredBranches = allBranches.filter(
    (b) => !formCompanyId || b.companyId === formCompanyId,
  );
  const filteredFarms = allFarms.filter(
    (f) => !formCompanyId || f.companyId === formCompanyId,
  );
  const filteredSheds = allSheds.filter(
    (s) =>
      form.assignedFarmIds.includes(s.farmId) ||
      filteredFarms.some((f) => f.id === s.farmId),
  );

  const availableRoles: User["role"][] = isSuperAdmin
    ? [
        "SuperAdmin",
        "CompanyAdmin",
        "Manager",
        "Supervisor",
        "Farmer",
        "Dealer",
        "Staff",
      ]
    : ["CompanyAdmin", "Manager", "Supervisor", "Farmer", "Dealer", "Staff"];

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setDialog(true);
  };

  const openEdit = (u: User) => {
    setEditId(u.id);
    setForm({
      name: u.name,
      username: u.username,
      password: "",
      role: u.role,
      companyId: u.companyId || "",
      assignedFarmIds: u.assignedFarmIds || [],
      assignedZoneIds: u.assignedZoneIds || [],
      assignedBranchIds: u.assignedBranchIds || [],
      assignedShedId: u.assignedShedId || "",
      active: u.active !== false,
    });
    setDialog(true);
  };

  const save = () => {
    if (!form.name || !form.username) return;
    const companyId = isSuperAdmin
      ? form.companyId || undefined
      : currentUser?.companyId;
    if (editId) {
      const updates: Partial<User> = {
        name: form.name,
        username: form.username,
        role: form.role,
        companyId,
        assignedFarmIds: form.assignedFarmIds,
        assignedZoneIds: form.assignedZoneIds,
        assignedBranchIds: form.assignedBranchIds,
        assignedShedId: form.assignedShedId || undefined,
        active: form.active,
      };
      if (form.password) updates.password = form.password;
      storage.updateUser(editId, updates);
    } else {
      if (!form.password) return;
      storage.addUser({
        name: form.name,
        username: form.username,
        password: form.password,
        role: form.role,
        companyId,
        assignedFarmIds: form.assignedFarmIds,
        assignedZoneIds: form.assignedZoneIds,
        assignedBranchIds: form.assignedBranchIds,
        assignedShedId: form.assignedShedId || undefined,
        active: form.active,
      });
    }
    setUsers(storage.getUsers());
    setDialog(false);
  };

  const toggleActive = (u: User) => {
    storage.updateUser(u.id, { active: !(u.active === false) });
    setUsers(storage.getUsers());
  };

  const doDelete = (id: string) => {
    storage.deleteUser(id);
    setUsers(storage.getUsers());
    setConfirmDelete(null);
  };

  const toggleFarmId = (id: string) => {
    setForm((f) => ({
      ...f,
      assignedFarmIds: f.assignedFarmIds.includes(id)
        ? f.assignedFarmIds.filter((x) => x !== id)
        : [...f.assignedFarmIds, id],
    }));
  };
  const toggleZoneId = (id: string) => {
    setForm((f) => ({
      ...f,
      assignedZoneIds: f.assignedZoneIds.includes(id)
        ? f.assignedZoneIds.filter((x) => x !== id)
        : [...f.assignedZoneIds, id],
    }));
  };
  const toggleBranchId = (id: string) => {
    setForm((f) => ({
      ...f,
      assignedBranchIds: f.assignedBranchIds.includes(id)
        ? f.assignedBranchIds.filter((x) => x !== id)
        : [...f.assignedBranchIds, id],
    }));
  };

  const roleColor: Record<string, string> = {
    SuperAdmin: "bg-purple-100 text-purple-800",
    CompanyAdmin: "bg-blue-100 text-blue-800",
    Manager: "bg-indigo-100 text-indigo-800",
    Supervisor: "bg-cyan-100 text-cyan-800",
    Farmer: "bg-green-100 text-green-800",
    Dealer: "bg-amber-100 text-amber-800",
    Staff: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6" data-ocid="users.page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage users, roles, and farm assignments
          </p>
        </div>
        <Button onClick={openAdd} data-ocid="users.add_user.button">
          <Plus size={16} className="mr-1" /> Add User
        </Button>
      </div>

      {visibleUsers.length === 0 ? (
        <Card data-ocid="users.empty_state">
          <CardContent className="p-8 text-center text-muted-foreground">
            No users found.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="users.table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2">#</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Username</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Company</th>
                <th className="text-left p-2">Assigned Farms</th>
                <th className="text-left p-2">Status</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((u, i) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-muted/30"
                  data-ocid={`users.row.${i + 1}`}
                >
                  <td className="p-2 text-muted-foreground">{i + 1}</td>
                  <td className="p-2 font-medium">{u.name}</td>
                  <td className="p-2 font-mono text-xs">{u.username}</td>
                  <td className="p-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        roleColor[u.role] || "bg-gray-100"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-2 text-sm text-muted-foreground">
                    {companies.find((c) => c.id === u.companyId)?.name || "-"}
                  </td>
                  <td className="p-2 text-xs text-muted-foreground">
                    {(u.assignedFarmIds || []).length > 0
                      ? (u.assignedFarmIds || [])
                          .map(
                            (fid) => allFarms.find((f) => f.id === fid)?.name,
                          )
                          .filter(Boolean)
                          .join(", ")
                      : "-"}
                  </td>
                  <td className="p-2">
                    <Badge
                      variant={u.active !== false ? "default" : "secondary"}
                    >
                      {u.active !== false ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-2 text-right space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(u)}
                      data-ocid={`users.edit_button.${i + 1}`}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleActive(u)}
                      title={u.active !== false ? "Deactivate" : "Activate"}
                      data-ocid={`users.toggle.${i + 1}`}
                    >
                      {u.active !== false ? (
                        <UserX size={14} className="text-orange-500" />
                      ) : (
                        <UserCheck size={14} className="text-green-500" />
                      )}
                    </Button>
                    {u.id !== currentUser?.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => setConfirmDelete(u.id)}
                        data-ocid={`users.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="users.user.dialog"
        >
          <DialogHeader>
            <DialogTitle>{editId ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Full Name *</Label>
              <Input
                data-ocid="users.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Full name"
              />
            </div>
            <div>
              <Label>Username *</Label>
              <Input
                data-ocid="users.username.input"
                value={form.username}
                onChange={(e) =>
                  setForm((f) => ({ ...f, username: e.target.value }))
                }
                placeholder="username"
              />
            </div>
            <div>
              <Label>
                {editId ? "New Password (leave blank to keep)" : "Password *"}
              </Label>
              <Input
                data-ocid="users.password.input"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                placeholder={
                  editId ? "Leave blank to keep current" : "Set password"
                }
              />
            </div>
            <div>
              <Label>Role *</Label>
              <select
                data-ocid="users.role.select"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    role: e.target.value as User["role"],
                    assignedFarmIds: [],
                    assignedZoneIds: [],
                    assignedBranchIds: [],
                    assignedShedId: "",
                  }))
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {availableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            {isSuperAdmin && (
              <div>
                <Label>Company</Label>
                <select
                  data-ocid="users.company.select"
                  value={form.companyId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, companyId: e.target.value }))
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select Company...</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form.role === "Manager" && filteredZones.length > 0 && (
              <div>
                <Label>Assigned Zones</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {filteredZones.map((z) => (
                    <div key={z.id} className="flex items-center gap-2">
                      <Checkbox
                        data-ocid="users.zone.checkbox"
                        checked={form.assignedZoneIds.includes(z.id)}
                        onCheckedChange={() => toggleZoneId(z.id)}
                      />
                      <span className="text-sm">{z.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(form.role === "Manager" || form.role === "Supervisor") &&
              filteredBranches.length > 0 && (
                <div>
                  <Label>Assigned Branches</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                    {filteredBranches.map((b) => (
                      <div key={b.id} className="flex items-center gap-2">
                        <Checkbox
                          data-ocid="users.branch.checkbox"
                          checked={form.assignedBranchIds.includes(b.id)}
                          onCheckedChange={() => toggleBranchId(b.id)}
                        />
                        <span className="text-sm">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {["Supervisor", "Farmer", "Dealer", "Staff"].includes(form.role) &&
              filteredFarms.length > 0 && (
                <div>
                  <Label>Assigned Farms</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                    {filteredFarms.map((f) => (
                      <div key={f.id} className="flex items-center gap-2">
                        <Checkbox
                          data-ocid="users.farm.checkbox"
                          checked={form.assignedFarmIds.includes(f.id)}
                          onCheckedChange={() => toggleFarmId(f.id)}
                        />
                        <span className="text-sm">{f.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {form.role === "Staff" && filteredSheds.length > 0 && (
              <div>
                <Label>Assigned Shed</Label>
                <select
                  data-ocid="users.shed.select"
                  value={form.assignedShedId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, assignedShedId: e.target.value }))
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select Shed...</option>
                  {filteredSheds.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (
                      {allFarms.find((f) => f.id === s.farmId)?.name || "?"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Switch
                data-ocid="users.active.switch"
                checked={form.active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialog(false)}
              data-ocid="users.user.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={save} data-ocid="users.user.submit_button">
              {editId ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent data-ocid="users.delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this user? This cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(null)}
              data-ocid="users.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete && doDelete(confirmDelete)}
              data-ocid="users.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
