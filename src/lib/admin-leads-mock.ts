// BACKEND INTEGRATION POINT: Replace all mock data with API calls to your PHP Yii2 backend.

export type LeadType = "access_request" | "subscription_inquiry";

export interface AdminLead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  // Access Request specific
  datasetName?: string;
  // Subscription Inquiry specific
  dashboardName?: string;
  message?: string;
  submittedAt: string; // ISO date string
}

// BACKEND INTEGRATION POINT: GET /api/admin/leads
export const mockLeads: AdminLead[] = [
  {
    id: "1",
    type: "access_request",
    name: "James Carter",
    email: "james.carter@aerocorp.com",
    phone: "+1 312 555 0101",
    company: "AeroCorp Industries",
    designation: "VP Engineering",
    datasetName: "Global Composites Market Analysis 2025",
    submittedAt: "2025-03-28T14:32:00Z",
  },
  {
    id: "2",
    type: "subscription_inquiry",
    name: "Priya Mehta",
    email: "priya.mehta@tatagroup.com",
    phone: "+91 98765 43210",
    company: "Tata Advanced Materials",
    designation: "Director – Strategy",
    dashboardName: "Aerospace & Defense Dashboard",
    message: "Looking for 5-user license for 12 months. Need access to full dataset + quarterly updates.",
    submittedAt: "2025-03-27T09:15:00Z",
  },
  {
    id: "3",
    type: "access_request",
    name: "Michael O'Brien",
    email: "mobrien@boeing.com",
    phone: "+1 206 555 0199",
    company: "Boeing Commercial",
    designation: "Senior Analyst",
    datasetName: "Carbon Fiber Reinforced Polymers Market",
    submittedAt: "2025-03-26T16:45:00Z",
  },
  {
    id: "4",
    type: "subscription_inquiry",
    name: "Sofia Rossi",
    email: "s.rossi@leonardocompany.com",
    phone: "+39 06 555 1234",
    company: "Leonardo S.p.A.",
    designation: "Market Research Lead",
    dashboardName: "Automotive Composites Dashboard",
    message: "Interested in a trial subscription for the automotive composites module.",
    submittedAt: "2025-03-25T11:20:00Z",
  },
  {
    id: "5",
    type: "access_request",
    name: "Chen Wei",
    email: "chen.wei@comacgroup.cn",
    phone: "+86 21 5555 8888",
    company: "COMAC Group",
    designation: "Technical Manager",
    datasetName: "Glass Fiber Market Outlook 2030",
    submittedAt: "2025-03-24T08:00:00Z",
  },
  {
    id: "6",
    type: "access_request",
    name: "Laura Fischer",
    email: "l.fischer@airbus.com",
    phone: "+49 40 555 6789",
    company: "Airbus SE",
    designation: "Procurement Manager",
    datasetName: "Wind Energy Composites Market",
    submittedAt: "2025-03-23T13:10:00Z",
  },
  {
    id: "7",
    type: "subscription_inquiry",
    name: "David Kim",
    email: "dkim@hyundai-motor.com",
    phone: "+82 2 555 4321",
    company: "Hyundai Motor Company",
    designation: "Research Director",
    dashboardName: "EV Battery Materials Dashboard",
    message: "Need enterprise access for our R&D team of 15 members.",
    submittedAt: "2025-03-22T10:30:00Z",
  },
  {
    id: "8",
    type: "access_request",
    name: "Amara Johnson",
    email: "ajohnson@lockheedmartin.com",
    phone: "+1 817 555 0333",
    company: "Lockheed Martin",
    designation: "Business Development",
    datasetName: "Advanced Ceramics Market Report",
    submittedAt: "2025-03-21T15:45:00Z",
  },
];
