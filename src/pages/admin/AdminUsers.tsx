import { useState, useMemo } from "react";
import { Search, Download, Filter, ChevronDown, X, UserPlus, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CreateUserDialog from "@/components/admin/CreateUserDialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { mockUsers, type AdminUser } from "@/lib/admin-users-mock";
import UserDetailSheet from "@/components/admin/UserDetailSheet";
import StatusToggleConfirmDialog from "@/components/admin/StatusToggleConfirmDialog";

const ITEMS_PER_PAGE = 10;

const industries = [
  "Aerospace & Defense",
  "Composites",
  "Automotive & Transportation",
  "Building & Construction",
  "Chemical & Materials",
  "Consumer Goods & Services",
  "Disruptive Technology",
  "Electrical & Electronics",
  "Energy & Power",
  "Engineering",
  "Healthcare",
  "Information & Communications Technology",
  "Mining, Metals & Minerals",
  "Packaging",
];

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toggleTarget, setToggleTarget] = useState<AdminUser | null>(null);

  // BACKEND INTEGRATION POINT: GET /api/admin/users?search=&industry=&page=&limit=
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.company.toLowerCase().includes(q) ||
        user.phone.includes(q) ||
        user.designation.toLowerCase().includes(q);

      const matchesIndustry =
        industryFilter === "all" || user.industries.includes(industryFilter);

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }, [users, search, industryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleIndustryChange = (val: string) => {
    setIndustryFilter(val);
    setCurrentPage(1);
  };

  const activeFiltersCount = (industryFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const handleExportCSV = () => {
    // BACKEND INTEGRATION POINT: GET /api/admin/users/export?format=csv
    const headers = [
      "Name", "Email", "Company", "Designation", "Phone",
      "Industries", "Signup Date", "Signup Time", "Last Login",
    ];
    const rows = filteredUsers.map((u) => [
      u.name, u.email, u.company, u.designation, u.phone,
      u.industries.join("; "), u.signupDate, u.signupTime,
      u.lastLogin || "Never",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stratview-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setIndustryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleToggleStatus = () => {
    if (!toggleTarget) return;
    // BACKEND INTEGRATION POINT: PUT /api/admin/users/{id}/status
    setUsers((prev) =>
      prev.map((u) =>
        u.id === toggleTarget.id
          ? { ...u, status: u.status === "active" ? "inactive" as const : "active" as const }
          : u
      )
    );
    setToggleTarget(null);
  };

  const handleUserUpdate = (updatedUser: AdminUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setSelectedUser(updatedUser);
  };

  const handleUserDelete = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setSelectedUser(null);
  };

  const handleUserCreated = (newUser: AdminUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1b4263" }}>
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 shrink-0"
            style={{ backgroundColor: "#1b4263" }}
          >
            <UserPlus className="h-4 w-4" />
            Create User
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="gap-2 shrink-0"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search + Filters */}
      <Card className="border-none shadow-md rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, company, phone, designation..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="gap-2 shrink-0">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      className="h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                      style={{ backgroundColor: "#4fc9ab", color: "#1b4263" }}
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>

          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent>
              <div className="flex flex-wrap gap-3 pt-2 border-t">
                <Select value={industryFilter} onValueChange={handleIndustryChange}>
226:                   <SelectTrigger className="w-[260px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                    <X className="h-3 w-3" /> Clear filters
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="hidden lg:table-cell">Designation</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden xl:table-cell">Industries</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Signup Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => setSelectedUser(user)}
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                          style={{
                            backgroundColor: `hsl(${(user.id * 47) % 360}, 40%, 92%)`,
                            color: `hsl(${(user.id * 47) % 360}, 50%, 35%)`,
                          }}
                        >
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.company}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {user.designation}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {user.phone}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {user.industries.slice(0, 2).map((ind) => (
                          <Badge key={ind} variant="secondary" className="text-[10px] font-normal">
                            {ind}
                          </Badge>
                        ))}
                        {user.industries.length > 2 && (
                          <Badge variant="secondary" className="text-[10px] font-normal">
                            +{user.industries.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => { e.stopPropagation(); setToggleTarget(user); }}
                        className="flex items-center gap-1.5"
                        title={`Click to ${user.status === "active" ? "deactivate" : "activate"}`}
                      >
                        {user.status === "active" ? (
                          <ToggleRight className="h-5 w-5" style={{ color: "#0d9488" }} />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                        )}
                        <Badge
                          variant={user.status === "active" ? "default" : "secondary"}
                          className="text-[10px]"
                          style={user.status === "active" ? { backgroundColor: "#0d948820", color: "#0d9488" } : {}}
                        >
                          {user.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div>
                        <p className="text-sm">{user.signupDate}</p>
                        <p className="text-xs text-muted-foreground">{user.signupTime}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">…</span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 text-xs"
                      style={currentPage === page ? { backgroundColor: "#1b4263" } : {}}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UserDetailSheet
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUserUpdate={handleUserUpdate}
        onUserDelete={handleUserDelete}
      />

      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default AdminUsers;
