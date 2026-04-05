import { useState } from "react";
import { isGoogleSheetsUrl, convertGoogleSheetsUrl, type SheetExportFormat } from "@/lib/google-sheets-utils";
import { FileSpreadsheet, Check } from "lucide-react";

const FORMATS: SheetExportFormat[] = ["csv", "xlsx", "tsv", "pdf"];

interface Props {
  url: string;
  onConvert: (exportUrl: string) => void;
}

export function GoogleSheetsDetector({ url, onConvert }: Props) {
  const [converted, setConverted] = useState<string | null>(null);

  if (!isGoogleSheetsUrl(url)) return null;

  const handleFormat = (format: SheetExportFormat) => {
    const result = convertGoogleSheetsUrl(url, format);
    if (result) {
      onConvert(result);
      setConverted(format.toUpperCase());
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#0d5a5a33", backgroundColor: "#0d5a5a08" }}>
      <FileSpreadsheet className="h-4 w-4 shrink-0" style={{ color: "#0d5a5a" }} />
      <span className="text-muted-foreground text-xs">Google Sheets detected —</span>
      <div className="flex gap-1">
        {FORMATS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => handleFormat(f)}
            className="rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase transition-colors hover:text-white"
            style={{ borderColor: "#0d5a5a", color: "#0d5a5a" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0d5a5a"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#0d5a5a"; }}
          >
            {f}
          </button>
        ))}
      </div>
      {converted && (
        <span className="flex items-center gap-1 text-xs" style={{ color: "#0d5a5a" }}>
          <Check className="h-3 w-3" /> Converted to {converted}
        </span>
      )}
    </div>
  );
}
