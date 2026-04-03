import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import {
  type AdminCategory,
  mockCategories,
  availableColors,
} from "@/lib/admin-categories-mock";
import CategoryIconPreview from "@/components/admin/CategoryIconPreview";
import StatusToggleConfirmDialog from "@/components/admin/StatusToggleConfirmDialog";
import IconPickerDialog from "@/components/admin/IconPickerDialog";

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminCategories = () => {
  const [categories, setCategories] = useState<AdminCategory[]>(mockCategories);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formIcon, setFormIcon] = useState("layers");
  const [formColor, setFormColor] = useState("teal");
  const [formId, setFormId] = useState("");
  const [toggleTarget, setToggleTarget] = useState<AdminCategory | null>(null);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const filtered = search
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.id.toLowerCase().includes(search.toLowerCase()) ||
          c.slug.toLowerCase().includes(search.toLowerCase())
      )
    : categories;

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormIcon("layers");
    setFormColor("teal");
    const nextId = String(Math.max(0, ...categories.map((c) => Number(c.id) || 0)) + 1);
    setFormId(nextId);
    setDialogOpen(true);
  };

  const openEditDialog = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormIcon(cat.icon);
    setFormColor(cat.color);
    setFormId(cat.id);
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!editingCategory) {
      setFormSlug(generateSlug(name));
      const nextId = String(Math.max(0, ...categories.map((c) => Number(c.id) || 0)) + 1);
      setFormId(nextId);
    }
  };

  // BACKEND INTEGRATION POINT: POST /api/admin/categories or PUT /api/admin/categories/{id}
  const handleSave = () => {
    if (!formName.trim() || !formSlug.trim() || !formId.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { id: formId, name: formName, slug: formSlug, icon: formIcon, color: formColor, status: c.status, createdBy: c.createdBy }
            : c
        )
      );
      toast.success(`Category "${formName}" updated`);
    } else {
      if (categories.some((c) => c.id === formId)) {
        toast.error("A category with this ID already exists");
        return;
      }
      setCategories((prev) => [
        ...prev,
        { id: formId, name: formName, slug: formSlug, icon: formIcon, color: formColor, status: "active" as const },
      ]);
      toast.success(`Category "${formName}" created`);
    }
    setDialogOpen(false);
  };

  // BACKEND INTEGRATION POINT: DELETE /api/admin/categories/{id}
  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category deleted");
  };

  // BACKEND INTEGRATION POINT: PUT /api/admin/categories/{id}/status
  const handleToggleStatus = () => {
    if (!toggleTarget) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === toggleTarget.id ? { ...c, status: c.status === "active" ? "inactive" as const : "active" as const } : c
      )
    );
    toast.success(`Category "${toggleTarget.name}" ${toggleTarget.status === "active" ? "deactivated" : "activated"}`);
    setToggleTarget(null);
  };

  const getColorHex = (color: string) =>
    availableColors.find((c) => c.value === color)?.hex || "#64748b";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#1b4263", fontFamily: "'Poppins', sans-serif" }}
          >
            Manage Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} categories configured
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="gap-2"
          style={{ backgroundColor: "#1b4263" }}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Icon</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Category Name</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Slug</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Color</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Status</TableHead>
              <TableHead className="font-semibold text-right" style={{ color: "#1b4263" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cat) => (
                <TableRow key={cat.id} className="group hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${getColorHex(cat.color)}20`, color: getColorHex(cat.color) }}
                    >
                      <CategoryIconPreview name={cat.icon} className="h-5 w-5" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: getColorHex(cat.color) }}
                      />
                      <span className="text-sm capitalize">{cat.color}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setToggleTarget(cat)}
                      className="flex items-center gap-1.5"
                      title={`Click to ${cat.status === "active" ? "deactivate" : "activate"}`}
                    >
                      {cat.status === "active" ? (
                        <ToggleRight className="h-5 w-5" style={{ color: "#0d9488" }} />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      )}
                      <Badge
                        variant={cat.status === "active" ? "default" : "secondary"}
                        className="text-[10px]"
                        style={cat.status === "active" ? { backgroundColor: "#0d948820", color: "#0d9488" } : {}}
                      >
                        {cat.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{cat.name}</strong>? This may affect datasets and dashboards linked to this category.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(cat.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#1b4263", fontFamily: "'Poppins', sans-serif" }}>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Category Name *</Label>
              <Input
                placeholder="e.g. Aerospace & Defense"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Slug *</Label>
              <Input
                placeholder="e.g. aerospace-defense"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Icon</Label>
                <button
                  type="button"
                  onClick={() => setIconPickerOpen(true)}
                  className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground"
                >
                  <CategoryIconPreview name={formIcon} className="h-4 w-4" />
                  <span className="capitalize truncate">{formIcon.replace(/-/g, " ")}</span>
                </button>
                <IconPickerDialog
                  open={iconPickerOpen}
                  onOpenChange={setIconPickerOpen}
                  value={formIcon}
                  onSelect={setFormIcon}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Color</Label>
                <Select value={formColor} onValueChange={setFormColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl border p-4 bg-muted/20">
              <p className="text-xs text-muted-foreground mb-3">Preview</p>
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${availableColors.find((c) => c.value === formColor)?.hex || "#64748b"}20`,
                    color: availableColors.find((c) => c.value === formColor)?.hex || "#64748b",
                  }}
                >
                  <CategoryIconPreview name={formIcon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{formName || "Category Name"}</p>
                  <p className="text-xs text-muted-foreground">/{formSlug || "slug"}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} style={{ backgroundColor: "#1b4263" }}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StatusToggleConfirmDialog
        open={!!toggleTarget}
        onOpenChange={(o) => !o && setToggleTarget(null)}
        entityName={toggleTarget?.name || ""}
        entityType="Category"
        currentStatus={toggleTarget?.status || "active"}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
};

export default AdminCategories;
