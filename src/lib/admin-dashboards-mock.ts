// BACKEND INTEGRATION POINT: Replace all mock data with API calls to your PHP Yii2 backend.

export interface AdminDashboard {
  id: string;
  name: string;
  slug: string;
  datasetId: string;
  datasetName: string;
  createdDate: string;
  status: "active" | "inactive";
}

// BACKEND INTEGRATION POINT: GET /api/admin/dashboards
export const mockDashboards: AdminDashboard[] = [
  { id: "1", name: "Carbon Fiber Overview", slug: "carbon-fiber-overview", datasetId: "1", datasetName: "Carbon Fiber Market", createdDate: "2025-12-01", status: "active" },
  { id: "2", name: "EV Battery Trends", slug: "ev-battery-trends", datasetId: "4", datasetName: "EV Battery Market", createdDate: "2026-01-20", status: "active" },
  { id: "3", name: "Defense Composites Analysis", slug: "defense-composites-analysis", datasetId: "5", datasetName: "Defense Composites Market", createdDate: "2026-03-10", status: "inactive" },
];
