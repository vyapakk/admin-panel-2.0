// BACKEND INTEGRATION POINT: Replace all mock data with API calls to your PHP Yii2 backend.
// Categories match the structure used in the base platform (src/data/datasets.ts)

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name (kebab-case)
  color: string; // matches availableColors values
  status: "active" | "inactive";
}

// BACKEND INTEGRATION POINT: GET /api/admin/categories
// Synced with base platform categories (project: Admin Panel - Base Version)
export const mockCategories: AdminCategory[] = [
  { id: "1", name: "Composites", slug: "composites", icon: "layers", color: "teal", status: "active" },
  { id: "2", name: "Aerospace & Defense", slug: "aerospace-defense", icon: "plane", color: "navy", status: "active" },
  { id: "3", name: "Automotive & Transport", slug: "automotive-transport", icon: "car", color: "mint", status: "active" },
  { id: "4", name: "Building & Construction", slug: "building-construction", icon: "building-2", color: "teal-dark", status: "active" },
  { id: "5", name: "Prepregs", slug: "prepregs", icon: "layers", color: "teal", status: "active" },
  { id: "6", name: "Others", slug: "others", icon: "more-horizontal", color: "teal", status: "active" },
];

// Colors matching the base platform color tokens + extended palette
export const availableColors = [
  // Core brand colors
  { value: "teal", label: "Teal", hex: "#0d9488" },
  { value: "navy", label: "Navy", hex: "#1b4263" },
  { value: "mint", label: "Mint", hex: "#4fc9ab" },
  { value: "teal-dark", label: "Teal Dark", hex: "#0d5a5a" },
  // Extended palette
  { value: "amber", label: "Amber", hex: "#d97706" },
  { value: "rose", label: "Rose", hex: "#e11d48" },
  { value: "violet", label: "Violet", hex: "#7c3aed" },
  { value: "emerald", label: "Emerald", hex: "#059669" },
  { value: "sky", label: "Sky", hex: "#0284c7" },
  { value: "orange", label: "Orange", hex: "#ea580c" },
  { value: "indigo", label: "Indigo", hex: "#4f46e5" },
  { value: "cyan", label: "Cyan", hex: "#0891b2" },
  { value: "lime", label: "Lime", hex: "#65a30d" },
  { value: "pink", label: "Pink", hex: "#db2777" },
  { value: "fuchsia", label: "Fuchsia", hex: "#c026d3" },
  { value: "yellow", label: "Yellow", hex: "#ca8a04" },
  { value: "red", label: "Red", hex: "#dc2626" },
  { value: "blue", label: "Blue", hex: "#2563eb" },
  { value: "slate", label: "Slate", hex: "#475569" },
  { value: "gray", label: "Gray", hex: "#6b7280" },
];

// Icons organized by category for the searchable picker
export const iconGroups: { label: string; icons: string[] }[] = [
  {
    label: "Industry & Manufacturing",
    icons: ["factory", "hard-hat", "wrench", "cog", "hammer", "settings", "tool", "construction"],
  },
  {
    label: "Science & Technology",
    icons: ["atom", "microscope", "cpu", "circuit-board", "flask-conical", "beaker", "dna", "binary", "code", "database"],
  },
  {
    label: "Transport & Logistics",
    icons: ["plane", "car", "truck", "ship", "train-front", "bike", "rocket", "satellite", "bus", "container"],
  },
  {
    label: "Energy & Environment",
    icons: ["battery-charging", "zap", "wind", "sun", "flame", "leaf", "trees", "droplets", "cloud", "thermometer"],
  },
  {
    label: "Buildings & Infrastructure",
    icons: ["building-2", "building", "home", "landmark", "warehouse", "store", "school", "hospital"],
  },
  {
    label: "Materials & Packaging",
    icons: ["layers", "gem", "box", "package", "archive", "cube", "shield", "hexagon"],
  },
  {
    label: "Business & Analytics",
    icons: ["briefcase", "bar-chart-3", "trending-up", "target", "award", "pie-chart", "activity", "calculator"],
  },
  {
    label: "Medical & Health",
    icons: ["heart-pulse", "syringe", "stethoscope", "pill", "cross", "scan", "thermometer-sun"],
  },
  {
    label: "General",
    icons: ["globe", "star", "bookmark", "tag", "flag", "more-horizontal", "grid-3x3", "layout-grid", "circle-dot", "sparkles"],
  },
];

// Flat list for backward compatibility
export const availableIcons = iconGroups.flatMap((g) => g.icons);
