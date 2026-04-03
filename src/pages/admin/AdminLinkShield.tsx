import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEntries, createEntry, deleteEntry, updateEntry } from "@/lib/proxy-api";
import { CreateEntryDialog } from "@/components/admin/proxy/CreateEntryDialog";
import { EntryCard } from "@/components/admin/proxy/EntryCard";
import { Shield, FileSpreadsheet, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 20;
const PROXY_BASE = import.meta.env.VITE_PROXY_API_URL || "";

export default function AdminLinkShield() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["proxy-entries"],
    queryFn: getEntries,
  });

  const createMut = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["proxy-entries"] });
      toast.success("Proxy created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["proxy-entries"] });
      toast.success("Proxy deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string; csvUrl: string; allowedDomains: string[] }> }) =>
      updateEntry(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["proxy-entries"] });
      toast.success("Proxy updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.csvUrl.toLowerCase().includes(q) ||
        e.allowedDomains.some((d) => d.toLowerCase().includes(q))
    );
  }, [entries, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1b4263" }}>
            Link Shield
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Domain-restricted file proxy management.
          </p>
        </div>
        <CreateEntryDialog
          onSubmit={(d) => createMut.mutate(d)}
          loading={createMut.isPending}
        />
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, URL, or domain…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {search && (
          <span className="text-sm text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "#0d5a5a", borderTopColor: "transparent" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">
            {search ? "No matching proxies" : "No proxies yet"}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search
              ? "Try adjusting your search terms."
              : "Create a proxy to serve any file (CSV, XLS, JSON, etc.) only to requests from your allowed domains."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                proxyBaseUrl={PROXY_BASE}
                onDelete={(id) => deleteMut.mutate(id)}
                onEdit={(id, data) => updateMut.mutate({ id, data })}
                editLoading={updateMut.isPending}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((p, i) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`e-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === currentPage}
                          onClick={() => setPage(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
