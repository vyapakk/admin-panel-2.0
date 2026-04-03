import { ProxyEntry } from "@/types/proxy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Key, Globe, Link, Pencil } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/proxy/DeleteConfirmDialog";
import { EditEntryDialog } from "@/components/admin/proxy/EditEntryDialog";
import { useState } from "react";

interface Props {
  entry: ProxyEntry;
  proxyBaseUrl: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Partial<{ name: string; csvUrl: string; allowedDomains: string[] }>) => void;
  editLoading?: boolean;
}

export function EntryCard({ entry, proxyBaseUrl, onDelete, onEdit, editLoading }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const proxyUrl = `${proxyBaseUrl}/proxy/${entry.id}`;
  const proxyUrlWithKey = entry.apiKey ? `${proxyUrl}?key=${entry.apiKey}` : proxyUrl;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base">{entry.name}</CardTitle>
          <p className="text-xs text-muted-foreground">
            Created {new Date(entry.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditOpen(true)} title="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <DeleteConfirmDialog
            entryName={entry.name}
            onConfirm={() => onDelete(entry.id)}
          />
        </div>
        <EditEntryDialog
          entry={entry}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSubmit={onEdit}
          loading={editLoading}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Link className="h-3 w-3" /> Source
          </div>
          <p className="truncate rounded bg-muted px-2 py-1 text-xs font-mono">{entry.csvUrl}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Globe className="h-3 w-3" /> Proxy URL
          </div>
          <div className="flex gap-1">
            <p className="flex-1 truncate rounded bg-muted px-2 py-1 text-xs font-mono">{proxyUrlWithKey}</p>
            <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => copyToClipboard(proxyUrlWithKey, "Proxy URL")}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {entry.apiKey && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Key className="h-3 w-3" /> API Key
            </div>
            <div className="flex gap-1">
              <p className="flex-1 truncate rounded bg-muted px-2 py-1 text-xs font-mono">
                {entry.apiKey.slice(0, 8)}...{entry.apiKey.slice(-4)}
              </p>
              <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => copyToClipboard(entry.apiKey!, "API Key")}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {entry.allowedDomains.map((d) => (
            <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
