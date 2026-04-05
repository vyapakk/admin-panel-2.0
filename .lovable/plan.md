

## Fix Close Button Visibility on Blue Background

### Problem
The Sheet close button (X icon) inherits dark text color, making it invisible against the blue gradient header in the User Detail Sheet.

### Solution
Add a custom class to the `SheetContent` in `UserDetailSheet.tsx` that styles the close button to be white with proper hover/focus states.

### Changes

**File: `src/components/admin/UserDetailSheet.tsx`**
- Add a class like `[&>button]:text-white [&>button]:hover:opacity-80` to the `SheetContent` component's `className` prop. This targets the close button (direct child button) and makes it white so it's visible on the blue gradient header.

Single file, single line change.

