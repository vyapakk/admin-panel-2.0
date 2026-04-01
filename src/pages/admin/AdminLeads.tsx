import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Search, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
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
  enquiry: "Enquiry",
};

const AdminLeads = () => {
  const [leads] = useState<AdminLead[]>(mockLeads);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);

  const filtered = useMemo(() => {
    let result = leads;
    if (typeFilter !== "all") {
      result = result.filter((l) => l.type === typeFilter);
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
    return result;
  }, [leads, search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    const headers = ["ID", "Type", "Name", "Email", "Phone", "Company", "Designation", "Dataset/Dashboard", "Message/Query", "Submitted At"];
    const rows = filtered.map((l) => [
      l.id,
      typeLabel[l.type],
      l.name,
      l.email,
      l.phone,
      l.company,
      l.designation,
      l.datasetName || l.dashboardName || l.queryDashboard || "",
      l.message || l.queryText || "",
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
        <Button onClick={handleExportCSV} variant="outline" className="gap-2" style={{ borderColor: "#1b4263", color: "#1b4263" }}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
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
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Name</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Company</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Type</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Dataset / Dashboard</TableHead>
              <TableHead className="font-semibold" style={{ color: "#1b4263" }}>Submitted</TableHead>
              <TableHead className="font-semibold text-right" style={{ color: "#1b4263" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((lead) => (
                <TableRow key={lead.id} className="group hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{lead.company}</p>
                      <p className="text-xs text-muted-foreground">{lead.designation}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.type === "access_request" ? "default" : "secondary"}
                      className={lead.type === "access_request" ? "text-xs" : "text-xs"}
                      style={lead.type === "access_request"
                        ? { backgroundColor: "#0d5a5a", color: "#fff" }
                        : { backgroundColor: "#1b426315", color: "#1b4263" }
                      }
                    >
                      {typeLabel[lead.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">
                    {lead.datasetName || lead.dashboardName || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(lead.submittedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
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
                <Badge
                  style={selectedLead.type === "access_request"
                    ? { backgroundColor: "#0d5a5a", color: "#fff" }
                    : { backgroundColor: "#1b426315", color: "#1b4263" }
                  }
                >
                  {typeLabel[selectedLead.type]}
                </Badge>

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

                  <DetailRow label="Submitted At" value={formatDateTime(selectedLead.submittedAt)} />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
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
