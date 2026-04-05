import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { ProxyEntry } from "@/types/proxy";
import { GoogleSheetsDetector } from "./GoogleSheetsDetector";

interface Props {
  entry: ProxyEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: Partial<{ name: string; csvUrl: string; allowedDomains: string[] }>) => void;
  loading?: boolean;
}

export function EditEntryDialog({ entry, open, onOpenChange, onSubmit, loading }: Props) {
  const [name, setName] = useState(entry.name);
  const [csvUrl, setCsvUrl] = useState(entry.csvUrl);
  const [domainInput, setDomainInput] = useState("");
  const [domains, setDomains] = useState<string[]>(entry.allowedDomains);

  useEffect(() => {
    if (open) {
      setName(entry.name);
      setCsvUrl(entry.csvUrl);
      setDomains([...entry.allowedDomains]);
      setDomainInput("");
    }
  }, [open, entry]);

  const addDomain = () => {
    const d = domainInput.trim().toLowerCase();
    if (d && !domains.includes(d)) {
      setDomains([...domains, d]);
      setDomainInput("");
    }
  };

  const removeDomain = (d: string) => setDomains(domains.filter((x) => x !== d));

  const handleSubmit = () => {
    if (!name.trim() || !csvUrl.trim() || domains.length === 0) return;
    onSubmit(entry.id, { name: name.trim(), csvUrl: csvUrl.trim(), allowedDomains: domains });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Proxy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-csvUrl">Source File URL</Label>
            <Input id="edit-csvUrl" value={csvUrl} onChange={(e) => setCsvUrl(e.target.value)} />
            <GoogleSheetsDetector url={csvUrl} onConvert={(u) => setCsvUrl(u)} />
          </div>
          <div className="space-y-2">
            <Label>Allowed Domains</Label>
            <div className="flex gap-2">
              <Input
                placeholder="example.com"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDomain())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addDomain}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {domains.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {domains.map((d) => (
                  <Badge key={d} variant="secondary" className="gap-1">
                    {d}
                    <button onClick={() => removeDomain(d)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Button
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: "#0d5a5a" }}
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !csvUrl.trim() || domains.length === 0}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
