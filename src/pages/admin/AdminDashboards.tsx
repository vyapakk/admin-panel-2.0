import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import { Plus, Trash2, Search, BarChart3, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { type AdminDashboard, mockDashboards } from "@/lib/admin-dashboards-mock";
import { mockDatasets } from "@/lib/admin-datasets-mock";
import StatusToggleConfirmDialog from "@/components/admin/StatusToggleConfirmDialog";

const ITEMS_PER_PAGE = 10;

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminDashboards = () => {
  const [dashboards, setDashboards] = useState<AdminDashboard[]>(mockDashboards);
  const [datasets] = useState(mockDatasets);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [datasetFilter, setDatasetFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDatasetId, setFormDatasetId] = useState("");
  const [datasetSearch, setDatasetSearch] = useState("");
  const [toggleTarget, setToggleTarget] = useState<AdminDashboard | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminDashboard | null>(null);

  const filtered = useMemo(() => {
    return dashboards.filter((d) => {
      const q = search.toLowerCase();
      const matchesSearch = !search ||
        d.name.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q) ||
        d.datasetName.toLowerCase().includes(q) ||
        d.createdBy.toLowerCase().includes(q) ||
        d.createdDate.includes(q) ||
        d.status.toLowerCase().includes(q);
      const matchesDataset = datasetFilter === "all" || d.datasetId === datasetFilter;
      return matchesSearch && matchesDataset;
    });
  }, [dashboards, search, datasetFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const filteredDatasets = datasetSearch
    ? datasets.filter((ds) =>
        ds.name.toLowerCase().includes(datasetSearch.toLowerCase()) ||
        ds.slug.toLowerCase().includes(datasetSearch.toLowerCase())
      )
    : datasets;

  const openCreateDialog = () => {
    setFormName("");
    setFormSlug("");
    setFormDatasetId("");
    setDatasetSearch("");
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormName(name);
    setFormSlug(generateSlug(name));
  };

  // BACKEND INTEGRATION POINT: POST /api/admin/dashboards
  const handleSave = () => {
    if (!formName.trim() || !formSlug.trim() || !formDatasetId) {
      toast.error("Please fill all required fields");
      return;
    }
    const ds = datasets.find((d) => d.id === formDatasetId);
    const newId = String(Math.max(0, ...dashboards.map((d) => Number(d.id) || 0)) + 1);
    setDashboards((prev) => [
      ...prev,
      {
        id: newId,
        name: formName,
        slug: formSlug,
        datasetId: formDatasetId,
        datasetName: ds?.name || "Unknown",
        createdDate: new Date().toISOString().split("T")[0],
        status: "active" as const,
        createdBy: "Admin",
      },
    ]);
    toast.success(`Dashboard "${formName}" created`);
    setDialogOpen(false);
  };

  // BACKEND INTEGRATION POINT: DELETE /api/admin/dashboards/{id}
  const handleDelete = (id: string) => {
    setDashboards((prev) => prev.filter((d) => d.id !== id));
    toast.success("Dashboard deleted");
  };

  // BACKEND INTEGRATION POINT: PUT /api/admin/dashboards/{id}/status
  const handleToggleStatus = () => {
    if (!toggleTarget) return;
    setDashboards((prev) =>
      prev.map((d) =>
        d.id === toggleTarget.id ? { ...d, status: d.status === "active" ? "inactive" as const : "active" as const } : d
      )
    );
    setToggleTarget(null);
  };

  const selectedDataset = datasets.find((d) => d.id === formDatasetId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#1b4263", fontFamily: "'Poppins', sans-serif" }}
          >
            Manage Dashboards
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {dashboards.length} dashboards configured
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" style={{ backgroundColor: "#1b4263" }}>
          <Plus className="h-4 w-4" />
          Add Dashboard
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, slug, dataset, admin..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={datasetFilter} onValueChange={setDatasetFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by dataset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Datasets</SelectItem>
            {[...new Map(dashboards.map((d) => [d.datasetId, d.datasetName])).entries()].map(
              ([id, name]) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Dashboard Name</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Slug</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Dataset</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Created</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Created By</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Status</TableHead>
              <TableHead className="font-semibold text-right" style={{ color: "#1b4263" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No dashboards found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((db) => (
                <TableRow key={db.id} className="group hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    {db.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{db.slug}</TableCell>
                  <TableCell className="text-sm">{db.datasetName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{db.createdDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{db.createdBy}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => setToggleTarget(db)}
                      className="flex items-center gap-1.5"
                      title={`Click to ${db.status === "active" ? "deactivate" : "activate"}`}
                    >
                      {db.status === "active" ? (
                        <ToggleRight className="h-5 w-5" style={{ color: "#0d9488" }} />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      )}
                      <Badge
                        variant={db.status === "active" ? "default" : "secondary"}
                        className="text-[10px]"
                        style={db.status === "active" ? { backgroundColor: "#0d948820", color: "#0d9488" } : {}}
                      >
                        {db.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(db)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm"
                className="w-8 h-8 p-0"
                style={page === currentPage ? { backgroundColor: "#1b4263" } : {}}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#1b4263", fontFamily: "'Poppins', sans-serif" }}>
              Add New Dashboard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Dataset *</Label>
              <div className="border rounded-md">
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search datasets..."
                    value={datasetSearch}
                    onChange={(e) => setDatasetSearch(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto p-1">
                  {filteredDatasets.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-3">No datasets found</p>
                  ) : (
                    filteredDatasets.map((ds) => (
                      <button
                        key={ds.id}
                        type="button"
                        onClick={() => setFormDatasetId(ds.id)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          formDatasetId === ds.id
                            ? "bg-primary/10 font-medium"
                            : "hover:bg-muted/50"
                        }`}
                        style={formDatasetId === ds.id ? { color: "#1b4263" } : {}}
                      >
                        {ds.name}
                        <span className="text-xs text-muted-foreground ml-2">({ds.categoryName})</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
              {selectedDataset && (
                <p className="text-xs text-muted-foreground">
                  Selected: <strong>{selectedDataset.name}</strong>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Dashboard Name *</Label>
              <Input
                placeholder="e.g. Carbon Fiber Overview"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Slug *</Label>
              <Input
                placeholder="e.g. carbon-fiber-overview"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} style={{ backgroundColor: "#1b4263" }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StatusToggleConfirmDialog
        open={!!toggleTarget}
        onOpenChange={(o) => !o && setToggleTarget(null)}
        entityName={toggleTarget?.name || ""}
        entityType="Dashboard"
        currentStatus={toggleTarget?.status || "active"}
        onConfirm={handleToggleStatus}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete Dashboard"
        description={<span>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.</span>}
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget.id); setDeleteTarget(null); }}
        confirmLabel="Delete Dashboard"
      />
    </div>
  );
};

export default AdminDashboards;
