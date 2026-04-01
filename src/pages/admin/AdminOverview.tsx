import { Users, CreditCard, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import StatCard from "@/components/admin/StatCard";
import { mockStats, mockRecentSignups, mockPopularDashboards } from "@/lib/admin-mock-data";

const AdminOverview = () => {
  const adminName = localStorage.getItem("stratview_admin_name") || "Admin";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-xl p-6 text-white"
        style={{
          background: "linear-gradient(135deg, #1b4263 0%, #0d5a5a 60%, #1f7a7a 100%)",
        }}
      >
        <h1 className="text-2xl font-bold">Welcome back, {adminName}!</h1>
        <p className="text-sm mt-1 opacity-80">{today}</p>
      </div>

      {/* Stat Cards */}
      {/* BACKEND INTEGRATION POINT: GET /api/admin/stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Signups */}
        {/* BACKEND INTEGRATION POINT: GET /api/admin/recent-signups?limit=20 */}
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold" style={{ color: "#1b4263" }}>
                Recent Signups
              </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentSignups.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {user.company}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {user.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Popular Dashboards */}
          {/* BACKEND INTEGRATION POINT: GET /api/admin/popular-dashboards?limit=5 */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold" style={{ color: "#1b4263" }}>
                Popular Dashboards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPopularDashboards.map((dash, i) => (
                <div key={dash.id} className="flex items-start gap-3">
                  <span
                    className="text-xs font-bold mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: i === 0 ? "#4fc9ab" : "hsl(var(--muted))",
                      color: i === 0 ? "#1b4263" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">{dash.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <TrendingUp className="h-3 w-3" />
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
