

## Fix Dialog Overflow Issue

### Problem
The "Add New Admin" dialog has enough content (Name, Email, Password, Role with 3 radio options, and footer buttons) that it overflows the viewport vertically. The dialog uses `top-[50%] translate-y-[-50%]` centering, so tall content extends beyond the screen.

### Solution
Add `max-h-[90vh] overflow-y-auto` to the `DialogContent` component so all dialogs become scrollable when they exceed the viewport height. This is a single-line change in the shared UI component that fixes the issue globally.

### Changes

**File: `src/components/ui/dialog.tsx`**
- Add `max-h-[90vh] overflow-y-auto` to the `DialogPrimitive.Content` className (line 39), ensuring the dialog never exceeds 90% of viewport height and scrolls internally when content is too tall.

