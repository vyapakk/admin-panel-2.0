

## Integrate Link Proxy App as Admin Module ("Link Shield")

### What it does
Brings the entire [Final - Proxy App](/projects/65d158fc-94dd-42bc-ae32-1149f2f346e3) functionality into this admin panel as a new "Link Shield" module under the Content sidebar group. Accessible to Super Admins and Content Admins only (per existing role mapping).

### What changes

**1. Port types and API layer**
- Create `src/types/proxy.ts` — copy the `ProxyEntry` interface
- Create `src/lib/proxy-api.ts` — copy the API functions (`getEntries`, `createEntry`, `updateEntry`, `deleteEntry`) with `VITE_API_URL` base, same pattern as the original app

**2. Port proxy components** (adapted to admin panel styling)
- `src/components/admin/proxy/EntryCard.tsx` — proxy card with copy URL, edit, delete actions
- `src/components/admin/proxy/CreateEntryDialog.tsx` — create dialog with name, source URL, allowed domains, API key toggle
- `src/components/admin/proxy/EditEntryDialog.tsx` — edit dialog
- `src/components/admin/proxy/DeleteConfirmDialog.tsx` — type-to-confirm delete dialog

All components are copied from the proxy app with minor adjustments:
- Remove standalone header/logout (handled by admin layout)
- Apply Stratview color tokens (#1b4263, #0d5a5a) to buttons

**3. Create the page** (`src/pages/admin/AdminLinkShield.tsx`)
- Full proxy management page: search bar, paginated grid of EntryCard components, "New Proxy" button
- Ported from the proxy app's `Index.tsx`, stripped of its own header/auth — it sits inside `AdminLayout`
- Uses react-query for data fetching (already installed in this project)

**4. Add route and sidebar entry**
- `src/App.tsx` — add `<Route path="link-shield" element={<AdminLinkShield />} />` under the admin routes
- `src/components/admin/AdminSidebar.tsx` — add "Link Shield" to `contentNav` with the `Shield` or `Link` icon:
  ```text
  Content group:
    Categories
    Datasets
    Dashboards
    Link Shield  ← new
  ```

**5. Update role access mapping** (`AdminManagement.tsx`)
- Update Content Admin description: "Overview, Categories, Datasets, Dashboards, Link Shield, Notifications"
- Update Super Admin comment to include Link Shield
- Sales Admin remains unchanged (no access)

### What stays the same
- The proxy app's backend API (`/api/entries`, `/proxy/:id`) is untouched — this admin module calls the same endpoints
- Login for the proxy app is replaced by the admin panel's auth
- No sidebar filtering is enforced yet (frontend-only, as per existing pattern)

### Files to create
- `src/types/proxy.ts`
- `src/lib/proxy-api.ts`
- `src/components/admin/proxy/EntryCard.tsx`
- `src/components/admin/proxy/CreateEntryDialog.tsx`
- `src/components/admin/proxy/EditEntryDialog.tsx`
- `src/components/admin/proxy/DeleteConfirmDialog.tsx`
- `src/pages/admin/AdminLinkShield.tsx`

### Files to edit
- `src/App.tsx` — add route
- `src/components/admin/AdminSidebar.tsx` — add nav item
- `src/pages/admin/AdminManagement.tsx` — update role descriptions

