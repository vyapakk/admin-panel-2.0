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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Search, Database, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { type AdminDataset, mockDatasets } from "@/lib/admin-datasets-mock";
import { mockCategories } from "@/lib/admin-categories-mock";

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminDatasets = () => {
  const [datasets, setDatasets] = useState<AdminDataset[]>(mockDatasets);
  const [categories] = useState(mockCategories);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");

  const filtered = search
    ? datasets.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.slug.toLowerCase().includes(search.toLowerCase()) ||
          d.categoryName.toLowerCase().includes(search.toLowerCase())
      )
    : datasets;

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
  const handleToggleStatus = (id: string) => {
    setDatasets((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === "active" ? "inactive" as const : "active" as const } : d
      )
    );
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
          placeholder="Search datasets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              <TableHead className="font-semibold text-right" style={{ color: "#1b4263" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No datasets found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((ds) => (
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
                            <AlertDialogTitle>Delete Dataset</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{ds.name}</strong>? This may affect users with access to this dataset.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(ds.id)}
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
    </div>
  );
};

export default AdminDatasets;
