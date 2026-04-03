

## Add Admin Role Types (Super Admin, Content Admin, Sales Admin)

### What changes

**1. Update AdminEntry interface & mock data** (`AdminManagement.tsx`)
- Add `role: "super_admin" | "content_admin" | "sales_admin"` to the `AdminEntry` interface
- Update the initial admin to be a Super Admin
- Display role as a colored badge in the table

**2. Add role selector to the "Add Admin" dialog** (`AdminManagement.tsx`)
- Add a radio group (using existing `RadioGroup` component) with three options:
  - **Super Admin** — Access to all modules
  - **Content Admin** — Overview, Categories, Datasets, Dashboards, Notifications
  - **Sales Admin** — Overview, Notifications
- Each option shows a brief description of what modules they can access
- New `newRole` state, required before submission

**3. Add "Role" column to the admin table** (`AdminManagement.tsx`)
- New column between Email and Added showing a styled badge:
  - Super Admin → navy badge (#1b4263)
  - Content Admin → teal badge (#0d5a5a)
  - Sales Admin → mint badge (#4fc9ab, dark text)

### Role-to-module access mapping (for future backend integration)
```text
Super Admin:   Overview, Users, Admin Mgmt, Categories, Datasets, Dashboards, Leads, Notifications
Content Admin: Overview, Categories, Datasets, Dashboards, Notifications
Sales Admin:   Overview, Notifications
```
This mapping will be added as a comment/constant for backend integration. Sidebar filtering is NOT implemented now (all modules remain visible) — it will be enforced server-side when the backend is connected.

### Files to edit
- `src/pages/admin/AdminManagement.tsx` — interface, form, table, role state

