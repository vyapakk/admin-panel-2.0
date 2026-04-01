// BACKEND INTEGRATION POINT: Replace all mock data with API calls to your PHP Yii2 backend.
// Each section documents the expected API endpoint and response shape.

// BACKEND INTEGRATION POINT: GET /api/admin/stats
export const mockStats = {
  totalUsers: 1247,
  activeSubscriptions: 384,
  totalDashboards: 56,
  pendingInquiries: 12,
};

// BACKEND INTEGRATION POINT: GET /api/admin/recent-signups?limit=10
export const mockRecentSignups = [
  { id: 1, name: "Sarah Chen", email: "sarah.chen@techcorp.com", company: "TechCorp Inc.", date: "2026-03-30" },
  { id: 2, name: "Michael Brooks", email: "m.brooks@globalind.com", company: "Global Industries", date: "2026-03-29" },
  { id: 3, name: "Priya Sharma", email: "priya@innovalabs.io", company: "InnovaLabs", date: "2026-03-28" },
  { id: 4, name: "James Wilson", email: "jwilson@acmecorp.com", company: "Acme Corp", date: "2026-03-27" },
  { id: 5, name: "Elena Rodriguez", email: "elena.r@futuretech.com", company: "FutureTech", date: "2026-03-26" },
  { id: 6, name: "David Kim", email: "dkim@nexgen.co", company: "NexGen Solutions", date: "2026-03-25" },
  { id: 7, name: "Amanda Foster", email: "a.foster@bluewave.com", company: "BlueWave Analytics", date: "2026-03-24" },
  { id: 8, name: "Raj Patel", email: "raj.patel@datadriven.in", company: "DataDriven", date: "2026-03-23" },
  { id: 9, name: "Lisa Chang", email: "lchang@smartsys.com", company: "SmartSys", date: "2026-03-22" },
  { id: 10, name: "Tom Anderson", email: "tanderson@peak.io", company: "Peak Industries", date: "2026-03-21" },
];

// BACKEND INTEGRATION POINT: GET /api/admin/popular-dashboards?limit=5
export const mockPopularDashboards = [
  { id: 1, name: "Aerospace & Defense Market Overview", subscribers: 142 },
  { id: 2, name: "EV Battery Materials Tracker", subscribers: 118 },
  { id: 3, name: "Medical Devices Competitive Landscape", subscribers: 97 },
  { id: 4, name: "Semiconductor Supply Chain Analysis", subscribers: 89 },
  { id: 5, name: "Renewable Energy Market Forecast", subscribers: 76 },
];

// BACKEND INTEGRATION POINT: POST /api/admin/login
// Request: { email: string, password: string }
// Response: { token: string, admin: { name: string, email: string } }
export const mockAdminCredentials = {
  email: "admin@stratviewresearch.com",
  password: "admin123",
  name: "Admin",
};
