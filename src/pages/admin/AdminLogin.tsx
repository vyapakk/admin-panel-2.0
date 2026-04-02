import { useState } from "react";
import stratviewLogo from "@/assets/stratview-logo.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockAdminCredentials } from "@/lib/admin-mock-data";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // BACKEND INTEGRATION POINT: POST /api/admin/login
    // Replace mock check with real API call. Store JWT token on success.
    await new Promise((r) => setTimeout(r, 800));

    if (
      email === mockAdminCredentials.email &&
      password === mockAdminCredentials.password
    ) {
      localStorage.setItem("stratview_admin_auth", "true");
      localStorage.setItem("stratview_admin_name", mockAdminCredentials.name);
      toast.success("Welcome back!");
      navigate("/admin");
    } else {
      toast.error("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(135deg, #1b4263 0%, #0d5a5a 50%, #1f7a7a 100%)",
      }}
    >
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <img
              src={stratviewLogo}
              alt="Stratview Research"
              className="h-16 mx-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold" style={{ color: "#1b4263" }}>
            Stratview One
          </CardTitle>
          <CardDescription>Sign in to the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@stratviewresearch.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full font-semibold"
              style={{ backgroundColor: "#1b4263" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
