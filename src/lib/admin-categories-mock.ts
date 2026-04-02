// BACKEND INTEGRATION POINT: Replace all mock data with API calls to your PHP Yii2 backend.
// Categories match the structure used in the base platform (src/data/datasets.ts)

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name (kebab-case)
  color: string; // teal | navy | amber | rose | violet | emerald | sky | orange
  status: "active" | "inactive";
}

// BACKEND INTEGRATION POINT: GET /api/admin/categories
export const mockCategories: AdminCategory[] = [
  { id: "1", name: "Composites", slug: "composites", icon: "layers", color: "teal" },
  { id: "2", name: "Aerospace & Defense", slug: "aerospace-defense", icon: "plane", color: "navy" },
  { id: "3", name: "Automotive & Transportation", slug: "automotive-transportation", icon: "car", color: "amber" },
];

export const availableColors = [
  { value: "teal", label: "Teal", hex: "#0d9488" },
  { value: "navy", label: "Navy", hex: "#1b4263" },
  { value: "amber", label: "Amber", hex: "#d97706" },
  { value: "rose", label: "Rose", hex: "#e11d48" },
  { value: "violet", label: "Violet", hex: "#7c3aed" },
  { value: "emerald", label: "Emerald", hex: "#059669" },
  { value: "sky", label: "Sky", hex: "#0284c7" },
  { value: "orange", label: "Orange", hex: "#ea580c" },
];

// Common Lucide icons suitable for categories
export const availableIcons = [
  "layers", "plane", "car", "building-2", "cpu", "zap", "flask-conical",
  "heart-pulse", "hard-hat", "package", "circuit-board", "shield",
  "atom", "factory", "leaf", "globe", "truck", "wrench", "microscope",
  "rocket", "satellite", "battery-charging", "cog", "gem",
];
