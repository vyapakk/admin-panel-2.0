import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto bg-muted/30 p-6">
            <div className="mb-4 md:hidden">
              <SidebarTrigger />
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
