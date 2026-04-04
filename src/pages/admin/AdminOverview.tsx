import { Users, CreditCard, BarChart3, TrendingUp, Database, FileText, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/admin/StatCard";
import { mockStats, mockRecentSignups, mockPopularDashboards, mockUserGrowth } from "@/lib/admin-mock-data";

const AdminOverview = () => {
  const adminName = localStorage.getItem("stratview_admin_name") || "Admin";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-8 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1b4263 0%, #0d5a5a 60%, #1f7a7a 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "#4fc9ab", filter: "blur(80px)" }} />
        <p className="text-sm opacity-70 mb-1">{today}</p>
        <h1 className="text-2xl font-bold">Welcome back, {adminName}!</h1>
        <p className="text-sm mt-2 opacity-60">Here's what's happening on your platform today.</p>
      </div>

      {/* Stat Cards */}
      {/* BACKEND INTEGRATION POINT: GET /api/admin/stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={mockStats.totalUsers}
          icon={Users}
          trend="+12% from last month"
        />
        <StatCard
          title="Active Subscriptions"
          value={mockStats.activeSubscriptions}
          icon={CreditCard}
          trend="+5% from last month"
        />
        <StatCard
          title="Total Dashboards"
          value={mockStats.totalDashboards}
          icon={BarChart3}
        />
        <StatCard
          title="Total Datasets"
          value={mockStats.totalDatasets}
          icon={Database}
        />
        <StatCard
          title="Form Submissions"
          value={mockStats.formSubmissions30d}
          icon={FileText}
          trend="Last 30 days"
        />
        <StatCard
          title="Active Users Now"
          value={mockStats.activeUsersNow}
          icon={UserCheck}
          trend="Live"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Signups */}
        {/* BACKEND INTEGRATION POINT: GET /api/admin/recent-signups?limit=10 */}
        <Card className="xl:col-span-3 border-none shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold" style={{ color: "#1b4263" }}>
                Recent Signups
              </CardTitle>
              <Badge variant="secondary" className="text-xs font-normal">
                Last 10
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="space-y-0">
              {mockRecentSignups.slice(0, 10).map((user, i) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 py-3 ${i !== 9 ? "border-b border-border/50" : ""}`}
                >
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{
                      backgroundColor: `hsl(${(i * 37) % 360}, 40%, 92%)`,
                      color: `hsl(${(i * 37) % 360}, 50%, 35%)`,
                    }}
                  >
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.company}</p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{user.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Dashboards */}
        {/* BACKEND INTEGRATION POINT: GET /api/admin/popular-dashboards?limit=5 */}
        <Card className="xl:col-span-2 border-none shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold" style={{ color: "#1b4263" }}>
                Popular Dashboards
              </CardTitle>
              <Badge variant="secondary" className="text-xs font-normal">
                Top 5
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-4 space-y-1">
            {mockPopularDashboards.map((dash, i) => (
              <div
                key={dash.id}
                className="flex items-center gap-3 py-3 rounded-xl px-3 -mx-3 hover:bg-muted/40 transition-colors"
              >
                <span
                  className="text-xs font-bold h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: i === 0 ? "#4fc9ab" : i === 1 ? "rgba(79,201,171,0.2)" : "hsl(var(--muted))",
                    color: i === 0 ? "#1b4263" : i === 1 ? "#0d5a5a" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{dash.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <TrendingUp className="h-3 w-3" style={{ color: "#4fc9ab" }} />
                    {dash.subscribers} subscribers
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
