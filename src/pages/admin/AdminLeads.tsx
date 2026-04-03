import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Search, Download, Eye, ChevronLeft, ChevronRight, CalendarIcon, Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { type AdminLead, type LeadType, mockLeads } from "@/lib/admin-leads-mock";

const ITEMS_PER_PAGE = 10;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const typeLabel: Record<LeadType, string> = {
  access_request: "Access Request",
  subscription_inquiry: "Subscription Inquiry",
  enquiry: "Query Form",
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<AdminLead[]>(mockLeads);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [exportFrom, setExportFrom] = useState<Date | undefined>();
  const [exportTo, setExportTo] = useState<Date | undefined>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ type: "single"; id: string } | { type: "bulk" } | null>(null);

  const filtered = useMemo(() => {
    let result = leads;
    if (typeFilter !== "all") {
      result = result.filter((l) => l.type === typeFilter);
    }
    if (statusFilter !== "all") {
      const isResolved = statusFilter === "resolved";
      result = result.filter((l) => l.resolved === isResolved);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.designation.toLowerCase().includes(q) ||
          (l.datasetName?.toLowerCase().includes(q)) ||
          (l.dashboardName?.toLowerCase().includes(q)) ||
          (l.queryDashboard?.toLowerCase().includes(q)) ||
          (l.queryText?.toLowerCase().includes(q))
      );
    }
    if (exportFrom) {
      result = result.filter((l) => new Date(l.submittedAt) >= exportFrom);
    }
    if (exportTo) {
      const toEnd = new Date(exportTo);
      toEnd.setHours(23, 59, 59, 999);
      result = result.filter((l) => new Date(l.submittedAt) <= toEnd);
    }
    return result;
  }, [leads, search, typeFilter, statusFilter, exportFrom, exportTo]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const allPageSelected = paginated.length > 0 && paginated.every((l) => selectedIds.has(l.id));

  const toggleSelectAll = () => {
    const newSet = new Set(selectedIds);
    if (allPageSelected) {
      paginated.forEach((l) => newSet.delete(l.id));
    } else {
      paginated.forEach((l) => newSet.add(l.id));
    }
    setSelectedIds(newSet);
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleToggleResolved = (id: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, resolved: !l.resolved, resolvedBy: !l.resolved ? "Admin" : undefined } : l))
    );
    const lead = leads.find((l) => l.id === id);
    if (lead) {
      toast.success(lead.resolved ? "Marked as unresolved" : "Marked as resolved");
    }
    // Update selected lead if open
    setSelectedLead((prev) => (prev?.id === id ? { ...prev, resolved: !prev.resolved, resolvedBy: !prev.resolved ? "Admin" : undefined } : prev));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "single") {
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      if (selectedLead?.id === deleteTarget.id) setSelectedLead(null);
      selectedIds.delete(deleteTarget.id);
      setSelectedIds(new Set(selectedIds));
      toast.success("Lead deleted");
    } else {
      setLeads((prev) => prev.filter((l) => !selectedIds.has(l.id)));
      if (selectedLead && selectedIds.has(selectedLead.id)) setSelectedLead(null);
      toast.success(`Deleted ${selectedIds.size} leads`);
      setSelectedIds(new Set());
    }
    setDeleteTarget(null);
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error("No leads to export");
      return;
    }
    const headers = ["ID", "Type", "Name", "Email", "Phone", "Company", "Designation", "Dataset/Dashboard", "Message/Query", "Status", "Submitted At"];
    const rows = filtered.map((l) => [
      l.id, typeLabel[l.type], l.name, l.email, l.phone, l.company, l.designation,
      l.datasetName || l.dashboardName || l.queryDashboard || "",
      l.message || l.queryText || "",
      l.resolved ? "Resolved" : "Unresolved",
      formatDateTime(l.submittedAt),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} leads`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1b4263", fontFamily: "'Poppins', sans-serif" }}>
            Leads
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} lead{filtered.length !== 1 ? "s" : ""} from form submissions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => setDeleteTarget({ type: "bulk" })}
            >
              <Trash2 className="h-4 w-4" />
              Delete {selectedIds.size} selected
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !exportFrom && "text-muted-foreground")} style={{ borderColor: "#1b4263" }}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {exportFrom ? format(exportFrom, "MMM d, yyyy") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={exportFrom} onSelect={setExportFrom} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !exportTo && "text-muted-foreground")} style={{ borderColor: "#1b4263" }}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {exportTo ? format(exportTo, "MMM d, yyyy") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={exportTo} onSelect={setExportTo} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
          {(exportFrom || exportTo) && (
            <Button variant="ghost" size="sm" onClick={() => { setExportFrom(undefined); setExportTo(undefined); }}>
              Clear
            </Button>
          )}
          <Button onClick={handleExportCSV} variant="outline" className="gap-2" style={{ borderColor: "#1b4263", color: "#1b4263" }}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, company, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="access_request">Access Requests</SelectItem>
            <SelectItem value="subscription_inquiry">Subscription Inquiries</SelectItem>
            <SelectItem value="enquiry">Query Form</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="unresolved">Unresolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[40px]">
                <Checkbox checked={allPageSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Name</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Company</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Type</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Status</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Submitted</TableHead>
              <TableHead className="font-semibold text-right" style={{ color: "#1b4263" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((lead) => (
                <TableRow
                  key={lead.id}
                  className={cn(
                    "group transition-colors cursor-pointer",
                    !lead.resolved ? "bg-orange-50/60 hover:bg-orange-50" : "hover:bg-muted/20"
                  )}
                  onClick={() => setSelectedLead(lead)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selectedIds.has(lead.id)} onCheckedChange={() => toggleSelect(lead.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!lead.resolved && <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />}
                      <div>
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{lead.company}</p>
                      <p className="text-xs text-muted-foreground">{lead.designation}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-xs"
                      style={
                        lead.type === "access_request"
                          ? { backgroundColor: "#0d5a5a", color: "#fff" }
                          : lead.type === "enquiry"
                          ? { backgroundColor: "#d97706", color: "#fff" }
                          : { backgroundColor: "#1b426315", color: "#1b4263" }
                      }
                    >
                      {typeLabel[lead.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", lead.resolved ? "border-green-300 text-green-700" : "border-orange-300 text-orange-700 font-semibold")}
                    >
                      {lead.resolved ? "Resolved" : "Unresolved"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(lead.submittedAt)}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost" size="sm"
                        title={lead.resolved ? "Mark unresolved" : "Mark resolved"}
                        onClick={() => handleToggleResolved(lead.id)}
                      >
                        {lead.resolved
                          ? <CheckCircle2 className="h-4 w-4 text-green-600" />
                          : <Circle className="h-4 w-4 text-orange-500" />
                        }
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setDeleteTarget({ type: "single", id: lead.id })}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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

      {/* Detail Sheet */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle style={{ color: "#1b4263", fontFamily: "'Poppins', sans-serif" }}>
                  Lead Details
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-2">
                  <Badge
                    style={
                      selectedLead.type === "access_request"
                        ? { backgroundColor: "#0d5a5a", color: "#fff" }
                        : selectedLead.type === "enquiry"
                        ? { backgroundColor: "#d97706", color: "#fff" }
                        : { backgroundColor: "#1b426315", color: "#1b4263" }
                    }
                  >
                    {typeLabel[selectedLead.type]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", selectedLead.resolved ? "border-green-300 text-green-700" : "border-orange-300 text-orange-700 font-semibold")}
                  >
                    {selectedLead.resolved ? "Resolved" : "Unresolved"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <DetailRow label="Name" value={selectedLead.name} />
                  <DetailRow label="Email" value={selectedLead.email} />
                  <DetailRow label="Phone" value={selectedLead.phone} />
                  <DetailRow label="Company" value={selectedLead.company} />
                  <DetailRow label="Designation" value={selectedLead.designation} />

                  {selectedLead.type === "access_request" && selectedLead.datasetName && (
                    <DetailRow label="Requested Dataset" value={selectedLead.datasetName} />
                  )}

                  {selectedLead.type === "subscription_inquiry" && (
                    <>
                      {selectedLead.dashboardName && (
                        <DetailRow label="Dashboard Interest" value={selectedLead.dashboardName} />
                      )}
                      {selectedLead.message && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Message</p>
                          <p className="text-sm bg-muted/30 rounded-lg p-3">{selectedLead.message}</p>
                        </div>
                      )}
                    </>
                  )}

                  {selectedLead.type === "enquiry" && (
                    <>
                      {selectedLead.queryDashboard && (
                        <DetailRow label="Dashboard" value={selectedLead.queryDashboard} />
                      )}
                      {selectedLead.queryText && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Query</p>
                          <p className="text-sm bg-muted/30 rounded-lg p-3">{selectedLead.queryText}</p>
                        </div>
                      )}
                    </>
                  )}

                  <DetailRow label="Submitted At" value={formatDateTime(selectedLead.submittedAt)} />
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => handleToggleResolved(selectedLead.id)}
                  >
                    {selectedLead.resolved
                      ? <><Circle className="h-4 w-4" /> Mark Unresolved</>
                      : <><CheckCircle2 className="h-4 w-4" /> Mark Resolved</>
                    }
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => setDeleteTarget({ type: "single", id: selectedLead.id })}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === "bulk" ? `${selectedIds.size} leads` : "this lead"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. {deleteTarget?.type === "bulk"
                ? `${selectedIds.size} selected leads will be permanently removed.`
                : "This lead will be permanently removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-sm font-medium mt-0.5">{value}</p>
  </div>
);

export default AdminLeads;
