import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus, Trash2, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StatusToggleConfirmDialog from "@/components/admin/StatusToggleConfirmDialog";

// BACKEND INTEGRATION POINT: Role-to-module access mapping
// Super Admin:   Overview, Users, Admin Mgmt, Categories, Datasets, Dashboards, Leads, Notifications
// Content Admin: Overview, Categories, Datasets, Dashboards, Notifications
// Sales Admin:   Overview, Leads, Notifications

type AdminRole = "super_admin" | "content_admin" | "sales_admin";

interface AdminEntry {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  addedDate: string;
  status: "active" | "inactive";
}

const roleConfig: Record<AdminRole, { label: string; description: string; bgColor: string; textColor: string }> = {
  super_admin: {
    label: "Super Admin",
    description: "Access to all modules of admin panel",
    bgColor: "#1b426320",
    textColor: "#1b4263",
  },
  content_admin: {
    label: "Content Admin",
    description: "Overview, Categories, Datasets, Dashboards, Notifications",
    bgColor: "#0d5a5a20",
    textColor: "#0d5a5a",
  },
  sales_admin: {
    label: "Sales Admin",
    description: "Overview, Notifications",
    bgColor: "#4fc9ab20",
    textColor: "#0a6e55",
  },
};

const initialAdmins: AdminEntry[] = [
  { id: 1, name: "Admin", email: "admin@stratviewresearch.com", role: "super_admin", addedDate: "2026-01-01", status: "active" },
];

const AdminManagement = () => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminEntry[]>(initialAdmins);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminEntry | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("content_admin");
  const [toggleTarget, setToggleTarget] = useState<AdminEntry | null>(null);

  const handleAdd = () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }
    const newAdmin: AdminEntry = {
      id: Date.now(),
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      addedDate: new Date().toISOString().split("T")[0],
      status: "active",
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("content_admin");
    setAddOpen(false);
    toast({ title: "Admin added successfully" });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (admins.length <= 1) {
      toast({ title: "Cannot remove the last admin", variant: "destructive" });
      setDeleteTarget(null);
      return;
    }
    setAdmins((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    toast({ title: `Admin "${deleteTarget.name}" removed` });
    setDeleteTarget(null);
  };

  const handleToggleStatus = () => {
    if (!toggleTarget) return;
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === toggleTarget.id ? { ...a, status: a.status === "active" ? "inactive" as const : "active" as const } : a
      )
    );
    setToggleTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1b4263" }}>
            Admin Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add or remove administrators who can access this panel.
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "#0d5a5a" }} className="text-white hover:opacity-90">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="admin@example.com" />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Set a password" />
              </div>
              <div>
                <Label className="mb-2 block">Role</Label>
                <RadioGroup value={newRole} onValueChange={(v) => setNewRole(v as AdminRole)} className="space-y-2">
                  {(Object.keys(roleConfig) as AdminRole[]).map((role) => (
                    <label
                      key={role}
                      className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      style={newRole === role ? { borderColor: roleConfig[role].textColor, backgroundColor: roleConfig[role].bgColor } : {}}
                    >
                      <RadioGroupItem value={role} className="mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{roleConfig[role].label}</p>
                        <p className="text-xs text-muted-foreground">{roleConfig[role].description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAdd} style={{ backgroundColor: "#0d5a5a" }} className="text-white hover:opacity-90">
                Add Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: "#0d5a5a" }} />
            Administrators ({admins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="text-[11px] font-medium"
                      style={{
                        backgroundColor: roleConfig[admin.role].bgColor,
                        color: roleConfig[admin.role].textColor,
                      }}
                    >
                      {roleConfig[admin.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{admin.addedDate}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => setToggleTarget(admin)}
                      className="flex items-center gap-1.5"
                      title={`Click to ${admin.status === "active" ? "deactivate" : "activate"}`}
                    >
                      {admin.status === "active" ? (
                        <ToggleRight className="h-5 w-5" style={{ color: "#0d9488" }} />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      )}
                      <Badge
                        variant={admin.status === "active" ? "default" : "secondary"}
                        className="text-[10px]"
                        style={admin.status === "active" ? { backgroundColor: "#0d948820", color: "#0d9488" } : {}}
                      >
                        {admin.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    {admins.length > 1 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(admin)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Primary</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email}) as an administrator? They will no longer be able to access this panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <StatusToggleConfirmDialog
        open={!!toggleTarget}
        onOpenChange={(o) => !o && setToggleTarget(null)}
        entityName={toggleTarget?.name || ""}
        entityType="Admin"
        currentStatus={toggleTarget?.status || "active"}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
};

export default AdminManagement;
