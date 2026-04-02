import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Search, BarChart3 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { type AdminDashboard, mockDashboards } from "@/lib/admin-dashboards-mock";
import { mockDatasets } from "@/lib/admin-datasets-mock";

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminDashboards = () => {
  const [dashboards, setDashboards] = useState<AdminDashboard[]>(mockDashboards);
  const [datasets] = useState(mockDatasets);
  const [search, setSearch] = useState("");
  const [datasetFilter, setDatasetFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDatasetId, setFormDatasetId] = useState("");
  const [datasetSearch, setDatasetSearch] = useState("");

  const filtered = dashboards.filter((d) => {
    const matchesSearch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.slug.toLowerCase().includes(search.toLowerCase()) ||
      d.datasetName.toLowerCase().includes(search.toLowerCase());
    const matchesDataset = datasetFilter === "all" || d.datasetId === datasetFilter;
    return matchesSearch && matchesDataset;
  });

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
            placeholder="Search dashboards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              <TableHead className="font-semibold text-right" style={{ color: "#1b4263" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No dashboards found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((db) => (
                <TableRow key={db.id} className="group hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    {db.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{db.slug}</TableCell>
                  <TableCell className="text-sm">{db.datasetName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{db.createdDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Dashboard</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{db.name}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(db.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
    </div>
  );
};

export default AdminDashboards;
