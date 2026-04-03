import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface Props {
  onSubmit: (data: {
    name: string;
    csvUrl: string;
    allowedDomains: string[];
    useApiKey: boolean;
  }) => void;
  loading?: boolean;
}

export function CreateEntryDialog({ onSubmit, loading }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [csvUrl, setCsvUrl] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [domains, setDomains] = useState<string[]>([]);
  const [useApiKey, setUseApiKey] = useState(false);

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
    onSubmit({ name: name.trim(), csvUrl: csvUrl.trim(), allowedDomains: domains, useApiKey });
    setOpen(false);
    setName("");
    setCsvUrl("");
    setDomains([]);
    setUseApiKey(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: "#0d5a5a" }} className="text-white hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" /> New Proxy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create File Proxy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g. Product Feed" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="csvUrl">Source File URL</Label>
            <Input id="csvUrl" placeholder="https://example.com/data.csv or .xlsx or any file" value={csvUrl} onChange={(e) => setCsvUrl(e.target.value)} />
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
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Require API Key</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch checked={useApiKey} onCheckedChange={setUseApiKey} />
          </div>
          <Button
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: "#0d5a5a" }}
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !csvUrl.trim() || domains.length === 0}
          >
            Create Proxy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
