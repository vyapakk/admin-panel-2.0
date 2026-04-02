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

// Colors matching the base platform color tokens
export const availableColors = [
  { value: "teal", label: "Teal", hex: "#0d9488" },
  { value: "navy", label: "Navy", hex: "#1b4263" },
  { value: "mint", label: "Mint", hex: "#4fc9ab" },
  { value: "teal-dark", label: "Teal Dark", hex: "#0d5a5a" },
  { value: "amber", label: "Amber", hex: "#d97706" },
  { value: "rose", label: "Rose", hex: "#e11d48" },
  { value: "violet", label: "Violet", hex: "#7c3aed" },
  { value: "emerald", label: "Emerald", hex: "#059669" },
  { value: "sky", label: "Sky", hex: "#0284c7" },
  { value: "orange", label: "Orange", hex: "#ea580c" },
];

// Icons matching base platform usage + common extras for new categories
// All names are kebab-case Lucide icon names
export const availableIcons = [
  "layers", "plane", "car", "building-2", "more-horizontal",
  "cpu", "zap", "flask-conical", "heart-pulse", "hard-hat",
  "package", "circuit-board", "shield", "atom", "factory",
  "leaf", "globe", "truck", "wrench", "microscope",
  "rocket", "satellite", "battery-charging", "cog", "gem",
];
