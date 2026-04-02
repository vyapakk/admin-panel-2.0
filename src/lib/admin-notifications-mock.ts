// BACKEND INTEGRATION POINT: Replace all mock data with API calls to your PHP Yii2 backend.

// Notification types matching the base project's DashboardHeader notification types
export type NotificationType = "update" | "alert" | "info";

export type TargetAudience = "all" | "individual" | "industry" | "company" | "access" | "dataset";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  targetAudience: TargetAudience;
  targetDetails: string; // e.g., specific email, industry name, company name, category
  recipientCount: number;
  sentDate: string;
  sentTime: string;
  sentBy: string;
}

// BACKEND INTEGRATION POINT: GET /api/admin/notifications?limit=20
export const mockNotifications: AdminNotification[] = [
  {
    id: "n1",
    title: "New Dataset Available",
    message: "Carbon Fiber Market Q4 2024 data has been updated with the latest industry figures.",
    type: "update",
    targetAudience: "industry",
    targetDetails: "Composites",
    recipientCount: 342,
    sentDate: "2026-04-01",
    sentTime: "14:30:00",
    sentBy: "Admin",
  },
  {
    id: "n2",
    title: "Subscription Expiring Reminder",
    message: "Your subscription is expiring soon. Please renew to maintain uninterrupted access.",
    type: "alert",
    targetAudience: "all",
    targetDetails: "All Users",
    recipientCount: 1247,
    sentDate: "2026-03-31",
    sentTime: "09:00:00",
    sentBy: "Admin",
  },
  {
    id: "n3",
    title: "New Dashboard Added",
    message: "EV Battery Market dashboard now includes regional forecasts and trend analysis.",
    type: "info",
    targetAudience: "industry",
    targetDetails: "Automotive & Transportation",
    recipientCount: 189,
    sentDate: "2026-03-30",
    sentTime: "16:15:00",
    sentBy: "Admin",
  },
  {
    id: "n4",
    title: "System Maintenance Notice",
    message: "Scheduled maintenance on April 5th from 2 AM to 4 AM UTC. Services may be briefly unavailable.",
    type: "alert",
    targetAudience: "all",
    targetDetails: "All Users",
    recipientCount: 1247,
    sentDate: "2026-03-29",
    sentTime: "10:00:00",
    sentBy: "Admin",
  },
  {
    id: "n5",
    title: "Exclusive Report Available",
    message: "A new exclusive report on defense spending trends is now available in your dashboard.",
    type: "update",
    targetAudience: "access",
    targetDetails: "Aerospace & Defense datasets",
    recipientCount: 56,
    sentDate: "2026-03-28",
    sentTime: "11:30:00",
    sentBy: "Admin",
  },
  {
    id: "n6",
    title: "Welcome to Stratview One",
    message: "Thank you for joining! Explore our dashboards and datasets to get started.",
    type: "info",
    targetAudience: "individual",
    targetDetails: "sarah.chen@techcorp.com",
    recipientCount: 1,
    sentDate: "2026-03-27",
    sentTime: "14:23:00",
    sentBy: "Admin",
  },
  {
    id: "n7",
    title: "Data Update: Glass Fiber Composites",
    message: "Glass Fiber Composites dataset has been refreshed with March 2026 data.",
    type: "update",
    targetAudience: "company",
    targetDetails: "TechCorp Inc.",
    recipientCount: 3,
    sentDate: "2026-03-26",
    sentTime: "08:45:00",
    sentBy: "Admin",
  },
  {
    id: "n8",
    title: "Feature Update: Enhanced Filters",
    message: "We've added new filtering options to all dashboards for better data exploration.",
    type: "info",
    targetAudience: "all",
    targetDetails: "All Users",
    recipientCount: 1247,
    sentDate: "2026-03-25",
    sentTime: "13:00:00",
    sentBy: "Admin",
  },
  {
    id: "n9",
    title: "Urgent: Data Correction",
    message: "A correction has been made to the Aircraft Interiors Q3 dataset. Please review your reports.",
    type: "alert",
    targetAudience: "access",
    targetDetails: "Aircraft Interiors dataset",
    recipientCount: 24,
    sentDate: "2026-03-24",
    sentTime: "17:00:00",
    sentBy: "Admin",
  },
  {
    id: "n10",
    title: "New Industry Coverage",
    message: "We've expanded our coverage to include Mining, Metals & Minerals industry datasets.",
    type: "update",
    targetAudience: "industry",
    targetDetails: "Mining, Metals & Minerals",
    recipientCount: 87,
    sentDate: "2026-03-23",
    sentTime: "10:30:00",
    sentBy: "Admin",
  },
];

// Industries list for targeting
export const industryOptions = [
  "Aerospace & Defense",
  "Automotive & Transportation",
  "Building & Construction",
  "Chemical & Materials",
  "Composites",
  "Consumer Goods & Services",
  "Disruptive Technology",
  "Electrical & Electronics",
  "Energy & Power",
  "Engineering",
  "Healthcare",
  "Information & Communications Technology",
  "Mining, Metals & Minerals",
  "Packaging",
];

// Unique companies from users mock
export const companyOptions = [
  "TechCorp Inc.",
  "Global Industries",
  "InnovaLabs",
  "Acme Corp",
  "FutureTech",
  "NexGen Solutions",
  "BlueWave Analytics",
  "DataDriven",
  "SmartSys",
  "Peak Industries",
  "Quantum Research",
  "LatAm Tech",
];

// Category options for access-based targeting
export const categoryOptions = [
  "Composites",
  "Aerospace & Defense",
  "Automotive & Transportation",
];

// Dataset options for dataset-based targeting
export const datasetOptions = [
  "Carbon Fiber Market",
  "Glass Fiber Composites",
  "Polymer Matrix Composites",
  "Aircraft Interiors",
  "Commercial Aircraft",
  "Defense Systems",
  "Electric Vehicle Market",
];
