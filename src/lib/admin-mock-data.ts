// BACKEND INTEGRATION POINT: Replace all mock data with API calls to your PHP Yii2 backend.
// Each section documents the expected API endpoint and response shape.

// BACKEND INTEGRATION POINT: GET /api/admin/stats
export const mockStats = {
  totalUsers: 1247,
  activeSubscriptions: 384,
  totalDashboards: 56,
};

// BACKEND INTEGRATION POINT: GET /api/admin/recent-signups?limit=20
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
  { id: 11, name: "Nina Petrova", email: "nina.p@quantumres.com", company: "Quantum Research", date: "2026-03-20" },
  { id: 12, name: "Carlos Mendez", email: "cmendez@latamtech.co", company: "LatAm Tech", date: "2026-03-19" },
  { id: 13, name: "Fatima Al-Hassan", email: "fatima@gulfdata.ae", company: "Gulf Data Systems", date: "2026-03-18" },
  { id: 14, name: "Ryan O'Brien", email: "robrien@celticind.ie", company: "Celtic Industries", date: "2026-03-17" },
  { id: 15, name: "Yuki Tanaka", email: "y.tanaka@tokyomat.jp", company: "Tokyo Materials", date: "2026-03-16" },
  { id: 16, name: "Sophie Laurent", email: "slaurent@euroaero.fr", company: "EuroAero", date: "2026-03-15" },
  { id: 17, name: "Kevin Zhao", email: "kzhao@shenzhentech.cn", company: "Shenzhen Tech", date: "2026-03-14" },
  { id: 18, name: "Maria Santos", email: "msantos@brasilcomp.br", company: "Brasil Composites", date: "2026-03-13" },
  { id: 19, name: "Henrik Johansson", email: "hjohansson@nordmat.se", company: "Nord Materials", date: "2026-03-12" },
  { id: 20, name: "Aisha Okonkwo", email: "aokonkwo@afritech.ng", company: "AfriTech Solutions", date: "2026-03-11" },
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
