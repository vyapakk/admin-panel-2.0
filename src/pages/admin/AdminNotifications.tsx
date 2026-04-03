import { useState, useMemo } from "react";
import { Bell, Plus, Send, Users, User, Building2, FolderTree, Globe, Eye, Database, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { mockUsers } from "@/lib/admin-users-mock";
import {
  mockNotifications,
  AdminNotification,
  NotificationType,
  TargetAudience,
  industryOptions,
  companyOptions,
  categoryOptions,
  datasetOptions,
} from "@/lib/admin-notifications-mock";
import SearchableCheckboxList from "@/components/admin/SearchableCheckboxList";

const typeColors: Record<NotificationType, string> = {
  update: "bg-blue-100 text-blue-800",
  alert: "bg-red-100 text-red-800",
  info: "bg-green-100 text-green-800",
};

const audienceLabels: Record<TargetAudience, string> = {
  all: "All Users",
  individual: "Individual",
  industry: "By Industry",
  company: "By Company",
  access: "By Access/Category",
  dataset: "By Dataset",
};

const audienceIcons: Record<TargetAudience, React.ReactNode> = {
  all: <Globe className="h-3.5 w-3.5" />,
  individual: <User className="h-3.5 w-3.5" />,
  industry: <Users className="h-3.5 w-3.5" />,
  company: <Building2 className="h-3.5 w-3.5" />,
  access: <FolderTree className="h-3.5 w-3.5" />,
  dataset: <Database className="h-3.5 w-3.5" />,
};

const PAGE_SIZE = 10;

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>(mockNotifications);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailNotif, setDetailNotif] = useState<AdminNotification | null>(null);

  // Filter & pagination state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAudience, setFilterAudience] = useState<string>("all");
  const [filterSentBy, setFilterSentBy] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");
  const [targetAudience, setTargetAudience] = useState<TargetAudience>("all");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("info");
    setTargetAudience("all");
    setSelectedEmails([]);
    setSelectedIndustries([]);
    setSelectedCompanies([]);
    setSelectedCategories([]);
    setSelectedDatasets([]);
  };

  const getRecipientCount = (): number => {
    switch (targetAudience) {
      case "all":
        return mockUsers.length;
      case "individual":
        return selectedEmails.length;
      case "industry":
        return mockUsers.filter((u) => u.industries.some((i) => selectedIndustries.includes(i))).length;
      case "company":
        return mockUsers.filter((u) => selectedCompanies.includes(u.company)).length;
      case "access":
        return mockUsers.filter((u) =>
          u.accessGrants.some((a) => selectedCategories.includes(a.categoryName))
        ).length;
      case "dataset":
        return mockUsers.filter((u) =>
          u.accessGrants.some((a) => selectedDatasets.includes(a.datasetName))
        ).length;
      default:
        return 0;
    }
  };

  const getTargetDetails = (): string => {
    switch (targetAudience) {
      case "all":
        return "All Users";
      case "individual":
        return selectedEmails.join(", ");
      case "industry":
        return selectedIndustries.join(", ");
      case "company":
        return selectedCompanies.join(", ");
      case "access":
        return selectedCategories.join(", ");
      case "dataset":
        return selectedDatasets.join(", ");
      default:
        return "";
    }
  };

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in title and message.");
      return;
    }
    const recipientCount = getRecipientCount();
    if (recipientCount === 0) {
      toast.error("No recipients match your targeting criteria.");
      return;
    }

    const now = new Date();
    const newNotif: AdminNotification = {
      id: `n${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      type,
      targetAudience,
      targetDetails: getTargetDetails(),
      recipientCount,
      sentDate: now.toISOString().split("T")[0],
      sentTime: now.toTimeString().split(" ")[0],
      sentBy: localStorage.getItem("stratview_admin_name") || "Admin",
    };

    // BACKEND INTEGRATION POINT: POST /api/admin/notifications
    setNotifications((prev) => [newNotif, ...prev]);
    toast.success(`Notification sent to ${recipientCount} recipient(s).`);
    resetForm();
    setDialogOpen(false);
  };

  const toggleSelection = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  // Filtered & paginated notifications
  const uniqueSentBy = useMemo(() => [...new Set(notifications.map((n) => n.sentBy))], [notifications]);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const q = search.toLowerCase();
      const matchesSearch = !search ||
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.targetDetails.toLowerCase().includes(q) ||
        n.sentBy.toLowerCase().includes(q) ||
        n.sentDate.includes(q);
      const matchesType = filterType === "all" || n.type === filterType;
      const matchesAudience = filterAudience === "all" || n.targetAudience === filterAudience;
      const matchesSentBy = filterSentBy === "all" || n.sentBy === filterSentBy;
      return matchesSearch && matchesType && matchesAudience && matchesSentBy;
    });
  }, [notifications, search, filterType, filterAudience, filterSentBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const displayedNotifications = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (val: string) => {
    setter(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1b4263" }}>
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Push notifications to users on the Stratview One platform.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "#0d5a5a" }} className="text-white hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" /> New Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle style={{ color: "#1b4263" }}>Create Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {/* Title */}
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  placeholder="Notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  placeholder="Notification message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">{message.length}/500</p>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as NotificationType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Audience */}
              <div className="space-y-1.5">
                <Label>Send To</Label>
                <Select
                  value={targetAudience}
                  onValueChange={(v) => {
                    setTargetAudience(v as TargetAudience);
                    setSelectedEmails([]);
                    setSelectedIndustries([]);
                    setSelectedCompanies([]);
                    setSelectedCategories([]);
                    setSelectedDatasets([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="individual">Individual User(s)</SelectItem>
                    <SelectItem value="industry">By Industry</SelectItem>
                    <SelectItem value="company">By Company</SelectItem>
                    <SelectItem value="access">By Category / Access</SelectItem>
                    <SelectItem value="dataset">By Dataset</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic targeting options */}
              {targetAudience === "individual" && (
                <div className="space-y-1.5">
                  <Label>Select Users</Label>
                  <SearchableCheckboxList
                    items={mockUsers.map((u) => ({ value: u.email, label: u.name, sublabel: u.email }))}
                    selected={selectedEmails}
                    onToggle={(v) => toggleSelection(v, selectedEmails, setSelectedEmails)}
                    placeholder="Search users..."
                  />
                  {selectedEmails.length > 0 && (
                    <p className="text-xs text-muted-foreground">{selectedEmails.length} user(s) selected</p>
                  )}
                </div>
              )}

              {targetAudience === "industry" && (
                <div className="space-y-1.5">
                  <Label>Select Industries</Label>
                  <SearchableCheckboxList
                    items={industryOptions.map((i) => ({ value: i, label: i }))}
                    selected={selectedIndustries}
                    onToggle={(v) => toggleSelection(v, selectedIndustries, setSelectedIndustries)}
                    placeholder="Search industries..."
                  />
                  {selectedIndustries.length > 0 && (
                    <p className="text-xs text-muted-foreground">{getRecipientCount()} matching user(s)</p>
                  )}
                </div>
              )}

              {targetAudience === "company" && (
                <div className="space-y-1.5">
                  <Label>Select Companies</Label>
                  <SearchableCheckboxList
                    items={companyOptions.map((c) => ({ value: c, label: c }))}
                    selected={selectedCompanies}
                    onToggle={(v) => toggleSelection(v, selectedCompanies, setSelectedCompanies)}
                    placeholder="Search companies..."
                  />
                  {selectedCompanies.length > 0 && (
                    <p className="text-xs text-muted-foreground">{getRecipientCount()} matching user(s)</p>
                  )}
                </div>
              )}

              {targetAudience === "access" && (
                <div className="space-y-1.5">
                  <Label>Select Categories</Label>
                  <SearchableCheckboxList
                    items={categoryOptions.map((c) => ({ value: c, label: c }))}
                    selected={selectedCategories}
                    onToggle={(v) => toggleSelection(v, selectedCategories, setSelectedCategories)}
                    placeholder="Search categories..."
                  />
                  {selectedCategories.length > 0 && (
                    <p className="text-xs text-muted-foreground">{getRecipientCount()} matching user(s)</p>
                  )}
                </div>
              )}

              {targetAudience === "dataset" && (
                <div className="space-y-1.5">
                  <Label>Select Datasets</Label>
                  <SearchableCheckboxList
                    items={datasetOptions.map((d) => ({ value: d, label: d }))}
                    selected={selectedDatasets}
                    onToggle={(v) => toggleSelection(v, selectedDatasets, setSelectedDatasets)}
                    placeholder="Search datasets..."
                  />
                  {selectedDatasets.length > 0 && (
                    <p className="text-xs text-muted-foreground">{getRecipientCount()} matching user(s)</p>
                  )}
                </div>
              )}

              {/* Preview */}
              <div className="bg-muted/30 rounded-lg p-3 border">
                <p className="text-xs font-medium text-muted-foreground mb-1">Preview</p>
                <div className="flex items-center gap-2">
                  <Send className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">
                    Will be sent to <strong>{getRecipientCount()}</strong> recipient(s)
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleSend}
                style={{ backgroundColor: "#0d5a5a" }}
                className="text-white hover:opacity-90"
              >
                <Send className="mr-2 h-4 w-4" /> Send Notification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold" style={{ color: "#1b4263" }}>
            Recent Notifications
          </h2>
          <span className="text-xs text-muted-foreground">
            Showing last {displayedNotifications.length} notifications
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No notifications sent yet.
                </TableCell>
              </TableRow>
            ) : (
              displayedNotifications.map((notif) => (
                <TableRow key={notif.id} className="cursor-pointer hover:bg-muted/40 transition-colors" onClick={() => setDetailNotif(notif)}>
                  <TableCell className="font-medium max-w-[200px] truncate">{notif.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={typeColors[notif.type]}>
                      {notif.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      {audienceIcons[notif.targetAudience]}
                      <span>{audienceLabels[notif.targetAudience]}</span>
                    </div>
                  </TableCell>
                  <TableCell>{notif.recipientCount}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{notif.sentDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDetailNotif(notif)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!detailNotif} onOpenChange={(open) => !open && setDetailNotif(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle style={{ color: "#1b4263" }}>Notification Details</SheetTitle>
          </SheetHeader>
          {detailNotif && (
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-xs text-muted-foreground">Title</p>
                <p className="font-medium">{detailNotif.title}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Message</p>
                <p className="text-sm">{detailNotif.message}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <Badge variant="secondary" className={typeColors[detailNotif.type]}>
                    {detailNotif.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Recipients</p>
                  <p className="font-medium">{detailNotif.recipientCount}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Target</p>
                <div className="flex items-center gap-1.5 text-sm mt-0.5">
                  {audienceIcons[detailNotif.targetAudience]}
                  <span>{audienceLabels[detailNotif.targetAudience]}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{detailNotif.targetDetails}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Sent Date</p>
                  <p className="text-sm">{detailNotif.sentDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sent Time</p>
                  <p className="text-sm">{detailNotif.sentTime}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sent By</p>
                <p className="text-sm">{detailNotif.sentBy}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminNotifications;
