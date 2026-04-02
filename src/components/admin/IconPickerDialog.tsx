import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { iconGroups } from "@/lib/admin-categories-mock";
import CategoryIconPreview from "@/components/admin/CategoryIconPreview";
import { cn } from "@/lib/utils";

interface IconPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSelect: (icon: string) => void;
}

const IconPickerDialog = ({ open, onOpenChange, value, onSelect }: IconPickerDialogProps) => {
  const [search, setSearch] = useState("");

  const filteredGroups = iconGroups
    .map((group) => ({
      ...group,
      icons: group.icons.filter((icon) =>
        icon.replace(/-/g, " ").includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.icons.length > 0);

  const handleSelect = (icon: string) => {
    onSelect(icon);
    onOpenChange(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setSearch(""); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ color: "#1b4263", fontFamily: "'Poppins', sans-serif" }}>
            Choose Icon
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <ScrollArea className="h-[360px] pr-3">
          {filteredGroups.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No icons found</p>
          ) : (
            <div className="space-y-4">
              {filteredGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-medium text-muted-foreground mb-2">{group.label}</p>
                  <div className="grid grid-cols-6 gap-2">
                    {group.icons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => handleSelect(icon)}
                        title={icon.replace(/-/g, " ")}
                        className={cn(
                          "h-10 w-full rounded-lg flex items-center justify-center transition-colors border",
                          value === icon
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-transparent hover:bg-muted text-foreground"
                        )}
                      >
                        <CategoryIconPreview name={icon} className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default IconPickerDialog;
