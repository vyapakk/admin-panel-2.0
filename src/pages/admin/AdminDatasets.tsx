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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import { Plus, Trash2, Search, Database, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { type AdminDataset, mockDatasets } from "@/lib/admin-datasets-mock";
import { mockCategories } from "@/lib/admin-categories-mock";
import StatusToggleConfirmDialog from "@/components/admin/StatusToggleConfirmDialog";

const ITEMS_PER_PAGE = 10;

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminDatasets = () => {
  const [datasets, setDatasets] = useState<AdminDataset[]>(mockDatasets);
  const [categories] = useState(mockCategories);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [toggleTarget, setToggleTarget] = useState<AdminDataset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminDataset | null>(null);

  const filtered = useMemo(() => {
    if (!search) return datasets;
    const q = search.toLowerCase();
    return datasets.filter((d) =>
      d.name.toLowerCase().includes(q) ||
      d.slug.toLowerCase().includes(q) ||
      d.categoryName.toLowerCase().includes(q) ||
      d.createdBy.toLowerCase().includes(q) ||
      d.createdDate.includes(q) ||
      d.status.toLowerCase().includes(q)
    );
  }, [datasets, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const openCreateDialog = () => {
    setFormName("");
    setFormSlug("");
    setFormCategoryId("");
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormName(name);
    setFormSlug(generateSlug(name));
  };

  // BACKEND INTEGRATION POINT: POST /api/admin/datasets
  const handleSave = () => {
    if (!formName.trim() || !formSlug.trim() || !formCategoryId) {
      toast.error("Please fill all required fields");
      return;
    }
    const cat = categories.find((c) => c.id === formCategoryId);
    const newId = String(Math.max(0, ...datasets.map((d) => Number(d.id) || 0)) + 1);
    setDatasets((prev) => [
      ...prev,
      {
        id: newId,
        name: formName,
        slug: formSlug,
        categoryId: formCategoryId,
        categoryName: cat?.name || "Unknown",
        createdDate: new Date().toISOString().split("T")[0],
        status: "active" as const,
        createdBy: "Admin",
      },
    ]);
    toast.success(`Dataset "${formName}" created`);
    setDialogOpen(false);
  };

  // BACKEND INTEGRATION POINT: DELETE /api/admin/datasets/{id}
  const handleDelete = (id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
    toast.success("Dataset deleted");
  };

  // BACKEND INTEGRATION POINT: PUT /api/admin/datasets/{id}/status
  const handleToggleStatus = () => {
    if (!toggleTarget) return;
    setDatasets((prev) =>
      prev.map((d) =>
        d.id === toggleTarget.id ? { ...d, status: d.status === "active" ? "inactive" as const : "active" as const } : d
      )
    );
    setToggleTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#1b4263", fontFamily: "'Poppins', sans-serif" }}
          >
            Manage Datasets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {datasets.length} datasets configured
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" style={{ backgroundColor: "#1b4263" }}>
          <Plus className="h-4 w-4" />
          Add Dataset
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, slug, category, admin..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Dataset Name</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Slug</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Category</TableHead>
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
                  No datasets found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((ds) => (
                <TableRow key={ds.id} className="group hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    {ds.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ds.slug}</TableCell>
                  <TableCell>
                    <span className="text-sm">{ds.categoryName}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ds.createdDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ds.createdBy}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => setToggleTarget(ds)}
                      className="flex items-center gap-1.5"
                      title={`Click to ${ds.status === "active" ? "deactivate" : "activate"}`}
                    >
                      {ds.status === "active" ? (
                        <ToggleRight className="h-5 w-5" style={{ color: "#0d9488" }} />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      )}
                      <Badge
                        variant={ds.status === "active" ? "default" : "secondary"}
                        className="text-[10px]"
                        style={ds.status === "active" ? { backgroundColor: "#0d948820", color: "#0d9488" } : {}}
                      >
                        {ds.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(ds)}>
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
              Add New Dataset
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Category *</Label>
              <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Dataset Name *</Label>
              <Input
                placeholder="e.g. Carbon Fiber Market"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Slug *</Label>
              <Input
                placeholder="e.g. carbon-fiber-market"
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
        entityType="Dataset"
        currentStatus={toggleTarget?.status || "active"}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
};

export default AdminDatasets;
