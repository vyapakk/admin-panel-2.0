// BACKEND INTEGRATION POINT: Replace all mock data with API calls to your PHP Yii2 backend.

export interface AdminDataset {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  createdDate: string;
  status: "active" | "inactive";
  createdBy: string; // Admin name who created this dataset
}

// BACKEND INTEGRATION POINT: GET /api/admin/datasets
export const mockDatasets: AdminDataset[] = [
  { id: "1", name: "Carbon Fiber Market", slug: "carbon-fiber-market", categoryId: "1", categoryName: "Composites", createdDate: "2025-11-10", status: "active", createdBy: "Admin" },
  { id: "2", name: "Glass Fiber Market", slug: "glass-fiber-market", categoryId: "1", categoryName: "Composites", createdDate: "2025-12-05", status: "active", createdBy: "Admin" },
  { id: "3", name: "Commercial Aircraft Market", slug: "commercial-aircraft-market", categoryId: "2", categoryName: "Aerospace & Defense", createdDate: "2026-01-15", status: "active", createdBy: "Admin" },
  { id: "4", name: "EV Battery Market", slug: "ev-battery-market", categoryId: "3", categoryName: "Automotive & Transportation", createdDate: "2026-02-20", status: "active", createdBy: "Admin" },
  { id: "5", name: "Defense Composites Market", slug: "defense-composites-market", categoryId: "2", categoryName: "Aerospace & Defense", createdDate: "2026-03-01", status: "inactive", createdBy: "Admin" },
];
