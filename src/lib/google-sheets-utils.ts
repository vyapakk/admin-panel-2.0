export type SheetExportFormat = "csv" | "xlsx" | "tsv" | "pdf";

const SHEET_ID_REGEX = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
const GID_REGEX = /[#&?]gid=(\d+)/;

export function isGoogleSheetsUrl(url: string): boolean {
  return SHEET_ID_REGEX.test(url);
}

export function extractSheetInfo(url: string): { id: string; gid: string | null } | null {
  const idMatch = url.match(SHEET_ID_REGEX);
  if (!idMatch) return null;
  const gidMatch = url.match(GID_REGEX);
  return { id: idMatch[1], gid: gidMatch ? gidMatch[1] : null };
}

export function buildExportUrl(id: string, gid: string | null, format: SheetExportFormat): string {
  let url = `https://docs.google.com/spreadsheets/d/${id}/export?format=${format}`;
  if (gid) url += `&gid=${gid}`;
  return url;
}

export function convertGoogleSheetsUrl(url: string, format: SheetExportFormat): string | null {
  const info = extractSheetInfo(url);
  if (!info) return null;
  return buildExportUrl(info.id, info.gid, format);
}
