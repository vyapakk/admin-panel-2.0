import { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Shield,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import { type AdminUser, type UserAccess, mockCatalog } from "@/lib/admin-users-mock";
import { toast } from "sonner";

interface UserDetailSheetProps {
  user: AdminUser | null;
  onClose: () => void;
  onUserUpdate: (user: AdminUser) => void;
  onUserDelete: (userId: number) => void;
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-500",
  revoked: "bg-red-100 text-red-600",
};

const UserDetailSheet = ({ user, onClose, onUserUpdate, onUserDelete }: UserDetailSheetProps) => {
  const [showGrantForm, setShowGrantForm] = useState(false);
  const [grantType, setGrantType] = useState<"dashboard" | "dataset" | "master">("dashboard");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [selectedDashboard, setSelectedDashboard] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [datasetSearch, setDatasetSearch] = useState("");
  const [dashboardSearch, setDashboardSearch] = useState("");

  if (!user) return null;

  const availableDatasets = selectedCategory
    ? mockCatalog.find((c) => c.categoryId === selectedCategory)?.datasets || []
    : [];

  const filteredDatasets = datasetSearch
    ? availableDatasets.filter((d) => d.datasetName.toLowerCase().includes(datasetSearch.toLowerCase()))
    : availableDatasets;

  const availableDashboards = selectedDataset
    ? availableDatasets.find((d) => d.datasetId === selectedDataset)?.dashboards || []
    : [];

  const filteredDashboards = dashboardSearch
    ? availableDashboards.filter((d) => d.name.toLowerCase().includes(dashboardSearch.toLowerCase()))
    : availableDashboards;

  const resetGrantForm = () => {
    setShowGrantForm(false);
    setGrantType("dashboard");
    setSelectedCategory("");
    setSelectedDataset("");
    setSelectedDashboard("");
    setValidUntil("");
    setDatasetSearch("");
    setDashboardSearch("");
  };

  // BACKEND INTEGRATION POINT: POST /api/admin/users/{userId}/access
  const handleGrantAccess = () => {
    if (grantType === "master") {
      if (!validUntil) {
        toast.error("Please select a validity date");
        return;
      }
      const newAccess: UserAccess = {
        id: `a-${Date.now()}`,
        type: "master",
        categoryId: "",
        categoryName: "",
        datasetId: "",
        datasetName: "",
        grantedDate: new Date().toISOString().slice(0, 10),
        validUntil,
        status: "active",
      };
      const updatedUser = {
        ...user,
        accessGrants: [...user.accessGrants, newAccess],
      };
      onUserUpdate(updatedUser);
      resetGrantForm();
      toast.success("Master access granted — user can access all datasets & dashboards");
      return;
    }

    if (!selectedCategory || !selectedDataset || !validUntil) {
      toast.error("Please fill all required fields");
      return;
    }
    if (grantType === "dashboard" && !selectedDashboard) {
      toast.error("Please select a dashboard");
      return;
    }

    const cat = mockCatalog.find((c) => c.categoryId === selectedCategory);
    const ds = cat?.datasets.find((d) => d.datasetId === selectedDataset);
    const db = grantType === "dashboard"
      ? ds?.dashboards.find((d) => d.id === selectedDashboard)
      : undefined;

    const newAccess: UserAccess = {
      id: `a-${Date.now()}`,
      type: grantType,
      categoryId: selectedCategory,
      categoryName: cat?.categoryName || "",
      datasetId: selectedDataset,
      datasetName: ds?.datasetName || "",
      dashboardId: db?.id,
      dashboardName: db?.name,
      grantedDate: new Date().toISOString().slice(0, 10),
      validUntil,
      status: "active",
    };

    const updatedUser = {
      ...user,
      accessGrants: [...user.accessGrants, newAccess],
    };
    onUserUpdate(updatedUser);
    resetGrantForm();
    toast.success(`Access granted to ${grantType === "dataset" ? ds?.datasetName : db?.name}`);
  };

  // BACKEND INTEGRATION POINT: DELETE /api/admin/users/{userId}/access/{accessId}
  const handleRevokeAccess = (accessId: string) => {
    const updatedUser = {
      ...user,
      accessGrants: user.accessGrants.map((a) =>
        a.id === accessId ? { ...a, status: "revoked" as const } : a
      ),
    };
    onUserUpdate(updatedUser);
    toast.success("Access revoked");
  };

  // BACKEND INTEGRATION POINT: DELETE /api/admin/users/{userId}
  const handleDeleteUser = () => {
    onUserDelete(user.id);
    toast.success(`User "${user.name}" has been deleted`);
  };

  const activeGrants = user.accessGrants.filter((a) => a.status === "active");
  const inactiveGrants = user.accessGrants.filter((a) => a.status !== "active");

  return (
    <Sheet open={!!user} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto p-0"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Header */}
        <div
          className="p-6 text-white"
          style={{
            background: "linear-gradient(135deg, #1b4263 0%, #0d5a5a 100%)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
              style={{ backgroundColor: "#4fc9ab", color: "#1b4263" }}
            >
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <SheetHeader className="text-left space-y-0 p-0">
                <SheetTitle className="text-white text-xl font-bold">
                  {user.name}
                </SheetTitle>
                <SheetDescription className="text-white/70 text-sm">
                  {user.designation} at {user.company}
                </SheetDescription>
              </SheetHeader>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 gap-1.5 text-xs" onClick={() => setDeleteUserOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete User
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Contact Information
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{user.company}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{user.designation}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Signup & Activity */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Activity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Signed up</p>
                  <p className="text-sm font-medium">{user.signupDate}</p>
                  <p className="text-xs text-muted-foreground">{user.signupTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Last login</p>
                  <p className="text-sm font-medium">{user.lastLogin || "Never"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Industries */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Industries of Interest
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.industries.map((ind) => (
                <Badge key={ind} variant="secondary" className="text-xs">
                  {ind}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Access Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Access Grants
              </h3>
              <Button
                size="sm"
                className="gap-1 text-xs"
                style={{ backgroundColor: "#1b4263" }}
                onClick={() => setShowGrantForm(true)}
              >
                <Plus className="h-3 w-3" />
                Grant Access
              </Button>
            </div>

            {/* Grant Form */}
            {showGrantForm && (
              <div
                className="rounded-xl p-4 space-y-3 border"
                style={{ borderColor: "rgba(79,201,171,0.3)", backgroundColor: "rgba(79,201,171,0.04)" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: "#1b4263" }}>
                    New Access Grant
                  </p>
                  <Button variant="ghost" size="sm" onClick={resetGrantForm}>
                    Cancel
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Grant Type</Label>
                  <Select value={grantType} onValueChange={(v: "dashboard" | "dataset" | "master") => {
                    setGrantType(v);
                    setSelectedCategory("");
                    setSelectedDataset("");
                    setSelectedDashboard("");
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="master">Master Access (All Datasets & Dashboards)</SelectItem>
                      <SelectItem value="dashboard">Single Dashboard</SelectItem>
                      <SelectItem value="dataset">Entire Dataset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {grantType === "master" && (
                  <div className="rounded-lg p-3 text-xs" style={{ backgroundColor: "rgba(79,201,171,0.1)", color: "#0d5a5a" }}>
                    Master access grants the user access to <strong>all</strong> datasets and dashboards across all categories.
                  </div>
                )}

                {grantType !== "master" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs">Category</Label>
                      <Select value={selectedCategory} onValueChange={(v) => {
                        setSelectedCategory(v);
                        setSelectedDataset("");
                        setSelectedDashboard("");
                        setDatasetSearch("");
                        setDashboardSearch("");
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCatalog.map((cat) => (
                            <SelectItem key={cat.categoryId} value={cat.categoryId}>
                              {cat.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCategory && (
                      <div className="space-y-2">
                        <Label className="text-xs">Dataset</Label>
                        <Select value={selectedDataset} onValueChange={(v) => {
                          setSelectedDataset(v);
                          setSelectedDashboard("");
                          setDashboardSearch("");
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dataset" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="px-2 pb-2">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                  placeholder="Search datasets..."
                                  value={datasetSearch}
                                  onChange={(e) => setDatasetSearch(e.target.value)}
                                  className="h-8 pl-7 text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            {filteredDatasets.length === 0 ? (
                              <p className="text-xs text-muted-foreground text-center py-2">No datasets found</p>
                            ) : (
                              filteredDatasets.map((ds) => (
                                <SelectItem key={ds.datasetId} value={ds.datasetId}>
                                  {ds.datasetName}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {grantType === "dashboard" && selectedDataset && (
                      <div className="space-y-2">
                        <Label className="text-xs">Dashboard</Label>
                        <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dashboard" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="px-2 pb-2">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                  placeholder="Search dashboards..."
                                  value={dashboardSearch}
                                  onChange={(e) => setDashboardSearch(e.target.value)}
                                  className="h-8 pl-7 text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            {filteredDashboards.length === 0 ? (
                              <p className="text-xs text-muted-foreground text-center py-2">No dashboards found</p>
                            ) : (
                              filteredDashboards.map((db) => (
                                <SelectItem key={db.id} value={db.id}>
                                  {db.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-2">
                  <Label className="text-xs">Valid Until</Label>
                  <Input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </div>

                <Button
                  onClick={handleGrantAccess}
                  className="w-full"
                  style={{ backgroundColor: "#0d5a5a" }}
                >
                  Grant Access
                </Button>
              </div>
            )}

            {/* Active Grants */}
            {activeGrants.length > 0 ? (
              <div className="space-y-2">
                {activeGrants.map((access) => (
                  <div
                    key={access.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-muted/40 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] capitalize"
                          style={{
                            backgroundColor: access.type === "master" ? "rgba(79,201,171,0.25)" : access.type === "dataset" ? "rgba(79,201,171,0.15)" : "rgba(27,66,99,0.1)",
                            color: access.type === "master" ? "#0d5a5a" : access.type === "dataset" ? "#0d5a5a" : "#1b4263",
                          }}
                        >
                          {access.type === "master" ? "Master" : access.type}
                        </Badge>
                        {access.type !== "master" && (
                          <span className="text-xs text-muted-foreground">
                            {access.categoryName}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium mt-1">
                        {access.type === "master" ? "All Datasets & Dashboards" : access.type === "dashboard" ? access.dashboardName : access.datasetName}
                      </p>
                      {access.type === "dashboard" && (
                        <p className="text-xs text-muted-foreground">{access.datasetName}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Valid until {access.validUntil}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive shrink-0"
                      onClick={() => setRevokeTarget(access.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active access grants
              </p>
            )}

            {/* Inactive Grants */}
            {inactiveGrants.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Expired / Revoked
                </p>
                {inactiveGrants.map((access) => (
                  <div
                    key={access.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-muted/20 opacity-60"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-[10px] capitalize ${statusColors[access.status]}`}>
                          {access.status}
                        </Badge>
                        {access.type !== "master" && (
                          <span className="text-xs text-muted-foreground">
                            {access.categoryName}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium mt-1">
                        {access.type === "master" ? "All Datasets & Dashboards" : access.type === "dashboard" ? access.dashboardName : access.datasetName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Was valid until {access.validUntil}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailSheet;
