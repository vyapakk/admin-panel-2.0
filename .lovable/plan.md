

## Embed Google Sheets URL Converter in Proxy Dialogs

### What It Does
When pasting a Google Sheets link into the "Source File URL" field while creating or editing a proxy, the system detects it and shows a format picker (CSV, XLSX, TSV, PDF) inline. Selecting a format auto-converts the URL to a direct export link — no more manual conversion via ChatGPT.

### Changes

**1. New file: `src/lib/google-sheets-utils.ts`**
- `isGoogleSheetsUrl(url)` — regex check for `docs.google.com/spreadsheets/d/`
- `extractSheetId(url)` — pulls spreadsheet ID and optional `gid` from the URL
- `buildExportUrl(id, gid, format)` — returns `https://docs.google.com/spreadsheets/d/{id}/export?format={format}&gid={gid}`
- Supported formats: `csv`, `xlsx`, `tsv`, `pdf`

**2. Update `src/components/admin/proxy/CreateEntryDialog.tsx`**
- Import the utility functions
- On URL input change, run `isGoogleSheetsUrl()` check
- When detected, render a small inline bar below the input:
  - "Google Sheets detected" label with a sheets icon
  - Four format buttons (CSV, XLSX, TSV, PDF) styled as small outlined pills
  - Clicking a format replaces the URL field value with the converted export URL
  - After conversion, show a subtle "Converted to CSV export link" confirmation

**3. Update `src/components/admin/proxy/EditEntryDialog.tsx`**
- Same detection and inline conversion UI as the create dialog

### Technical Details

Conversion example:
```
Input:  https://docs.google.com/spreadsheets/d/ABC123/edit#gid=456
Output: https://docs.google.com/spreadsheets/d/ABC123/export?format=csv&gid=456
```

Regex pattern: `/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/` for ID extraction, `/[#&?]gid=(\d+)/` for gid.

The inline bar uses the existing brand teal color for the format buttons, matching the dialog's style.

