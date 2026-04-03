import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminLeads from "./pages/admin/AdminLeads.tsx";
import AdminManagement from "./pages/admin/AdminManagement.tsx";
import AdminNotifications from "./pages/admin/AdminNotifications.tsx";
import AdminDatasets from "./pages/admin/AdminDatasets.tsx";
import AdminDashboards from "./pages/admin/AdminDashboards.tsx";
import AdminLinkShield from "./pages/admin/AdminLinkShield.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminAuthGuard from "./components/admin/AdminAuthGuard.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminAuthGuard>
                <AdminLayout />
              </AdminAuthGuard>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="management" element={<AdminManagement />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="datasets" element={<AdminDatasets />} />
            <Route path="dashboards" element={<AdminDashboards />} />
            <Route path="link-shield" element={<AdminLinkShield />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
