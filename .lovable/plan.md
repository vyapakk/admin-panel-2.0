

## Persist Conversion Feedback in Google Sheets Detector

### Problem
The "Converted to CSV" confirmation disappears after 2 seconds, leaving the user unsure whether the conversion happened.

### Solution
Remove the `setTimeout` that clears the feedback. Keep the converted format label visible permanently (until the URL changes or another format is picked).

### Changes

**File: `src/components/admin/proxy/GoogleSheetsDetector.tsx`**
- Remove the `setTimeout(() => setConverted(null), 2000)` line in `handleFormat`
- The `converted` state will persist, showing which format is active
- Clicking a different format updates the label accordingly
- If the user changes the URL to a non-Sheets link, the whole detector unmounts naturally

