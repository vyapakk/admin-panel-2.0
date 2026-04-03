// BACKEND INTEGRATION POINT: Replace all mock data with API calls to your PHP Yii2 backend.

// Signup fields from base project: name, company, designation, phone, email, password, industries[]
// Additional admin fields: id, signupDate, status, lastLogin, accessGrants

export interface UserAccess {
  id: string;
  type: "dashboard" | "dataset" | "master";
  categoryId: string;
  categoryName: string;
  datasetId: string;
  datasetName: string;
  dashboardId?: string;
  dashboardName?: string;
  grantedDate: string;
  validUntil: string;
  status: "active" | "expired" | "revoked";
}

// BACKEND INTEGRATION POINT: Admin roles control sidebar/module visibility
// super_admin  → Full access to all modules
// content_admin → Overview, Categories, Datasets, Dashboards, Notifications
// sales_admin   → Overview, Leads
export type AdminRole = "super_admin" | "content_admin" | "sales_admin";

export const adminRoleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  content_admin: "Content Admin",
  sales_admin: "Sales Admin",
};

export const adminRoleDescriptions: Record<AdminRole, string> = {
  super_admin: "Full access to all modules",
  content_admin: "Overview, Categories, Datasets, Dashboards, Notifications",
  sales_admin: "Overview, Leads",
};

export interface AdminUser {
  id: number;
  name: string;
  company: string;
  designation: string;
  phone: string;
  email: string;
  industries: string[];
  signupDate: string;
  signupTime: string;
  lastLogin: string | null;
  status: "active" | "inactive";
  adminRole: AdminRole;
  accessGrants: UserAccess[];
}

// Dataset/dashboard catalog for access management
// BACKEND INTEGRATION POINT: GET /api/admin/catalog
export const mockCatalog = [
  {
    categoryId: "composites",
    categoryName: "Composites",
    datasets: [
      {
        datasetId: "carbon-fiber",
        datasetName: "Carbon Fiber Market",
        dashboards: [
          { id: "cf-global", name: "Global Carbon Fiber Market Overview" },
          { id: "cf-aerospace", name: "Aerospace Carbon Fiber Applications" },
          { id: "cf-automotive", name: "Automotive Carbon Fiber Trends" },
        ],
      },
      {
        datasetId: "glass-fiber",
        datasetName: "Glass Fiber Composites",
        dashboards: [
          { id: "gf-market", name: "Glass Fiber Market Analysis" },
          { id: "gf-construction", name: "Construction Applications" },
        ],
      },
      {
        datasetId: "polymer-matrix",
        datasetName: "Polymer Matrix Composites",
        dashboards: [
          { id: "pmc-overview", name: "PMC Market Overview" },
          { id: "pmc-industrial", name: "Industrial Applications" },
          { id: "pmc-forecast", name: "Market Forecast 2025-2030" },
        ],
      },
    ],
  },
  {
    categoryId: "aerospace-defense",
    categoryName: "Aerospace & Defense",
    datasets: [
      {
        datasetId: "aircraft-interiors",
        datasetName: "Aircraft Interiors",
        dashboards: [
          { id: "ai-overview", name: "Aircraft Interiors Overview" },
        ],
      },
      {
        datasetId: "commercial-aircraft",
        datasetName: "Commercial Aircraft",
        dashboards: [
          { id: "ca-fleet", name: "Global Fleet Analysis" },
          { id: "ca-deliveries", name: "Aircraft Deliveries Forecast" },
          { id: "ca-oem", name: "OEM Market Share" },
        ],
      },
      {
        datasetId: "defense-systems",
        datasetName: "Defense Systems",
        dashboards: [
          { id: "ds-spending", name: "Global Defense Spending" },
          { id: "ds-uav", name: "UAV/Drone Market" },
        ],
      },
    ],
  },
  {
    categoryId: "automotive",
    categoryName: "Automotive & Transportation",
    datasets: [
      {
        datasetId: "ev-market",
        datasetName: "Electric Vehicle Market",
        dashboards: [
          { id: "ev-global", name: "Global EV Market Overview" },
          { id: "ev-battery", name: "EV Battery Materials Tracker" },
        ],
      },
    ],
  },
];

// BACKEND INTEGRATION POINT: GET /api/admin/users
export const mockUsers: AdminUser[] = [
  {
    id: 1, name: "Sarah Chen", company: "TechCorp Inc.", designation: "Research Director",
    phone: "+1 (415) 555-0101", email: "sarah.chen@techcorp.com",
    industries: ["Aerospace & Defense", "Composites"], signupDate: "2026-03-30", signupTime: "14:23:45",
    lastLogin: "2026-04-01 09:15", status: "active", adminRole: "super_admin" as const,
    accessGrants: [
      { id: "a1", type: "dashboard", categoryId: "composites", categoryName: "Composites", datasetId: "carbon-fiber", datasetName: "Carbon Fiber Market", dashboardId: "cf-global", dashboardName: "Global Carbon Fiber Market Overview", grantedDate: "2026-03-30", validUntil: "2027-03-30", status: "active" },
      { id: "a2", type: "dataset", categoryId: "aerospace-defense", categoryName: "Aerospace & Defense", datasetId: "commercial-aircraft", datasetName: "Commercial Aircraft", grantedDate: "2026-03-30", validUntil: "2027-03-30", status: "active" },
    ],
  },
  {
    id: 2, name: "Michael Brooks", company: "Global Industries", designation: "VP Strategy",
    phone: "+1 (212) 555-0202", email: "m.brooks@globalind.com",
    industries: ["Automotive & Transportation", "Energy & Power"], signupDate: "2026-03-29", signupTime: "10:05:12",
    lastLogin: "2026-03-31 16:42", status: "active", adminRole: "content_admin",
    accessGrants: [
      { id: "a3", type: "dataset", categoryId: "automotive", categoryName: "Automotive & Transportation", datasetId: "ev-market", datasetName: "Electric Vehicle Market", grantedDate: "2026-03-29", validUntil: "2027-03-29", status: "active" },
    ],
  },
  {
    id: 3, name: "Priya Sharma", company: "InnovaLabs", designation: "Market Analyst",
    phone: "+91 98765 43210", email: "priya@innovalabs.io",
    industries: ["Chemical & Materials", "Composites"], signupDate: "2026-03-28", signupTime: "08:30:00",
    lastLogin: "2026-04-01 11:20", status: "active", adminRole: "sales_admin", accessGrants: [],
  },
  {
    id: 4, name: "James Wilson", company: "Acme Corp", designation: "Senior Analyst",
    phone: "+1 (312) 555-0404", email: "jwilson@acmecorp.com",
    industries: ["Aerospace & Defense"], signupDate: "2026-03-27", signupTime: "16:45:33",
    lastLogin: "2026-03-28 09:00", status: "active", adminRole: "content_admin",
    accessGrants: [
      { id: "a4", type: "dashboard", categoryId: "aerospace-defense", categoryName: "Aerospace & Defense", datasetId: "defense-systems", datasetName: "Defense Systems", dashboardId: "ds-spending", dashboardName: "Global Defense Spending", grantedDate: "2026-03-27", validUntil: "2026-06-27", status: "active" },
    ],
  },
  {
    id: 5, name: "Elena Rodriguez", company: "FutureTech", designation: "CEO",
    phone: "+34 612 345 678", email: "elena.r@futuretech.com",
    industries: ["Disruptive Technology", "Information & Communications Technology"], signupDate: "2026-03-26", signupTime: "12:00:00",
    lastLogin: "2026-03-30 14:55", status: "active", adminRole: "super_admin", accessGrants: [],
  },
  {
    id: 6, name: "David Kim", company: "NexGen Solutions", designation: "Product Manager",
    phone: "+82 10 1234 5678", email: "dkim@nexgen.co",
    industries: ["Electrical & Electronics", "Automotive & Transportation"], signupDate: "2026-03-25", signupTime: "09:15:22",
    lastLogin: null, status: "inactive", adminRole: "sales_admin", accessGrants: [],
  },
  {
    id: 7, name: "Amanda Foster", company: "BlueWave Analytics", designation: "Data Scientist",
    phone: "+1 (617) 555-0707", email: "a.foster@bluewave.com",
    industries: ["Healthcare", "Chemical & Materials"], signupDate: "2026-03-24", signupTime: "11:30:45",
    lastLogin: "2026-04-01 08:00", status: "active", adminRole: "content_admin",
    accessGrants: [
      { id: "a5", type: "dataset", categoryId: "composites", categoryName: "Composites", datasetId: "polymer-matrix", datasetName: "Polymer Matrix Composites", grantedDate: "2026-03-25", validUntil: "2027-03-25", status: "active" },
    ],
  },
  {
    id: 8, name: "Raj Patel", company: "DataDriven", designation: "Consultant",
    phone: "+91 91234 56789", email: "raj.patel@datadriven.in",
    industries: ["Mining, Metals & Minerals", "Energy & Power"], signupDate: "2026-03-23", signupTime: "07:45:10",
    lastLogin: "2026-03-29 17:30", status: "active", adminRole: "super_admin", accessGrants: [],
  },
  {
    id: 9, name: "Lisa Chang", company: "SmartSys", designation: "Research Lead",
    phone: "+886 912 345 678", email: "lchang@smartsys.com",
    industries: ["Electrical & Electronics", "Packaging"], signupDate: "2026-03-22", signupTime: "15:20:00",
    lastLogin: "2026-03-31 10:15", status: "active", adminRole: "content_admin",
    accessGrants: [
      { id: "a6", type: "dashboard", categoryId: "composites", categoryName: "Composites", datasetId: "glass-fiber", datasetName: "Glass Fiber Composites", dashboardId: "gf-market", dashboardName: "Glass Fiber Market Analysis", grantedDate: "2026-03-22", validUntil: "2026-09-22", status: "active" },
    ],
  },
  {
    id: 10, name: "Tom Anderson", company: "Peak Industries", designation: "Business Analyst",
    phone: "+1 (503) 555-1010", email: "tanderson@peak.io",
    industries: ["Building & Construction", "Engineering"], signupDate: "2026-03-21", signupTime: "13:00:30",
    lastLogin: "2026-03-28 12:45", status: "inactive", adminRole: "sales_admin",
    accessGrants: [
      { id: "a7", type: "dashboard", categoryId: "aerospace-defense", categoryName: "Aerospace & Defense", datasetId: "commercial-aircraft", datasetName: "Commercial Aircraft", dashboardId: "ca-fleet", dashboardName: "Global Fleet Analysis", grantedDate: "2026-03-21", validUntil: "2026-03-21", status: "expired" },
    ],
  },
  {
    id: 11, name: "Nina Petrova", company: "Quantum Research", designation: "Principal Analyst",
    phone: "+7 495 123 4567", email: "nina.p@quantumres.com",
    industries: ["Aerospace & Defense", "Disruptive Technology"], signupDate: "2026-03-20", signupTime: "10:10:10",
    lastLogin: "2026-04-01 07:30", status: "active", adminRole: "super_admin", accessGrants: [],
  },
  {
    id: 12, name: "Carlos Mendez", company: "LatAm Tech", designation: "Regional Director",
    phone: "+52 55 1234 5678", email: "cmendez@latamtech.co",
    industries: ["Automotive & Transportation", "Consumer Goods & Services"], signupDate: "2026-03-19", signupTime: "18:30:00",
    lastLogin: "2026-03-27 11:00", status: "active", adminRole: "content_admin", accessGrants: [],
  },
];
