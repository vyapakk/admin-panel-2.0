import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
];

const futureNav = [
  { title: "Subscriptions", url: "#", icon: CreditCard },
  { title: "Dashboards", url: "#", icon: BarChart3 },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = () => {
    // BACKEND INTEGRATION POINT: POST /api/admin/logout — clear session/token
    localStorage.removeItem("stratview_admin_auth");
    localStorage.removeItem("stratview_admin_name");
    navigate("/admin/login");
  };

  const adminName = localStorage.getItem("stratview_admin_name") || "Admin";

  return (
    <Sidebar collapsible="icon">
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
          style={{ backgroundColor: "#4fc9ab", color: "#1b4263" }}
        >
          S1
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm" style={{ color: "#1b4263" }}>
              Stratview One
            </span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="font-medium"
                      style={{ color: "#1b4263" }}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Modules (Coming Soon)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {futureNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton disabled className="opacity-40 cursor-not-allowed">
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ backgroundColor: "#0d5a5a", color: "#fff" }}
          >
            {adminName.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#1b4263" }}>
                {adminName}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
