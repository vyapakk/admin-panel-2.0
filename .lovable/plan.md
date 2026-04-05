

## Fix Dialog Rounded Corners with Scroll

### Problem
Adding `overflow-y-auto` directly on the `DialogPrimitive.Content` element clips the `sm:rounded-lg` border-radius — the scrollbar sits flush against the edges, hiding the rounded corners on the right side (top and bottom).

### Solution
Move the scroll behavior to an inner wrapper `<div>` so the outer container keeps `overflow: hidden` (preserving rounded corners) while the content inside scrolls.

### Changes

**File: `src/components/ui/dialog.tsx`**
- Remove `max-h-[90vh] overflow-y-auto` from the `DialogPrimitive.Content` className
- Keep `max-h-[90vh]` on the outer element but change overflow to `overflow: hidden` to clip corners properly
- Wrap `{children}` in a `<div className="overflow-y-auto max-h-[calc(90vh-2rem)] p-6">` inner scroll container
- Remove `p-6` from the outer element (padding moves to inner wrapper so scrollbar sits at the edge)
- The close button stays `absolute` on the outer container so it doesn't scroll away

