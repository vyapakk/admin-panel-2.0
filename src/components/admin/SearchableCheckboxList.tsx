import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchableCheckboxListProps {
  items: { value: string; label: string; sublabel?: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  placeholder?: string;
}

const SearchableCheckboxList = ({
  items,
  selected,
  onToggle,
  placeholder = "Search...",
}: SearchableCheckboxListProps) => {
  const [search, setSearch] = useState("");

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      (item.sublabel && item.sublabel.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-sm"
        />
      </div>
      <div className="border rounded-md p-2 max-h-40 overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">No results found</p>
        ) : (
          filtered.map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.value)}
                onChange={() => onToggle(item.value)}
                className="rounded"
              />
              <span className="truncate">{item.label}</span>
              {item.sublabel && (
                <span className="text-xs text-muted-foreground ml-auto truncate">
                  {item.sublabel}
                </span>
              )}
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchableCheckboxList;
