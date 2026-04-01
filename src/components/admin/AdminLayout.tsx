import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 bg-background">
            <SidebarTrigger className="ml-1" />
            <span
              className="ml-4 text-sm font-semibold"
              style={{ color: "#1b4263" }}
            >
              Stratview One Admin
            </span>
          </header>
          <main className="flex-1 overflow-auto bg-muted/30 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
