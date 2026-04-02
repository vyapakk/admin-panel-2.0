import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { type AdminUser } from "@/lib/admin-users-mock";
import { toast } from "sonner";

const industries = [
  "Aerospace & Defense",
  "Composites",
  "Automotive & Transportation",
  "Building & Construction",
  "Chemical & Materials",
  "Consumer Goods & Services",
  "Disruptive Technology",
  "Electrical & Electronics",
  "Energy & Power",
  "Engineering",
  "Healthcare",
  "Information & Communications Technology",
  "Mining, Metals & Minerals",
  "Packaging",
];

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserCreated: (user: AdminUser) => void;
}

const CreateUserDialog = ({ open, onClose, onUserCreated }: CreateUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    designation: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
    { label: "One special character (!@#$%^&*)", test: (p: string) => /[!@#$%^&*]/.test(p) },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.test(formData.password));
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
    setError("");
  };

  const resetForm = () => {
    setFormData({ name: "", company: "", designation: "", phone: "", email: "", password: "", confirmPassword: "" });
    setSelectedIndustries([]);
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // BACKEND INTEGRATION POINT: POST /api/admin/users
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError("Please ensure the password meets all requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    if (selectedIndustries.length === 0) {
      setError("Please select at least one industry of interest.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date();
      const newUser: AdminUser = {
        id: Date.now(),
        name: formData.name,
        company: formData.company,
        designation: formData.designation,
        phone: formData.phone,
        email: formData.email,
        industries: selectedIndustries,
        signupDate: now.toISOString().slice(0, 10),
        signupTime: now.toTimeString().slice(0, 8),
        
        lastLogin: null,
        status: "active",
        accessGrants: [],
      };

      onUserCreated(newUser);
      resetForm();
      onClose();
      toast.success(`User "${newUser.name}" created successfully`);
    } catch {
      setError("Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { resetForm(); onClose(); } }}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ color: "#1b4263" }}>
            Create New User
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the same details as the signup form to maintain uniformity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-name" className="text-sm font-medium">Full Name</Label>
            <Input id="cu-name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-company" className="text-sm font-medium">Company</Label>
            <Input id="cu-company" name="company" placeholder="Company Name" value={formData.company} onChange={handleInputChange} required />
          </div>

          {/* Designation */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-designation" className="text-sm font-medium">Designation</Label>
            <Input id="cu-designation" name="designation" placeholder="e.g. Research Analyst" value={formData.designation} onChange={handleInputChange} required />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-phone" className="text-sm font-medium">Phone Number</Label>
            <Input id="cu-phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleInputChange} required />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-email" className="text-sm font-medium">Email Address</Label>
            <Input id="cu-email" name="email" type="email" placeholder="name@company.com" value={formData.email} onChange={handleInputChange} required />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-password" className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Input
                id="cu-password" name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password} onChange={handleInputChange}
                className="pr-10" required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.password && (
              <div className="space-y-0.5 mt-1">
                {passwordRules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    {rule.test(formData.password) ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-muted-foreground" />}
                    <span className={rule.test(formData.password) ? "text-emerald-600" : "text-muted-foreground"}>{rule.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-confirm" className="text-sm font-medium">Confirm Password</Label>
            <div className="relative">
              <Input
                id="cu-confirm" name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword} onChange={handleInputChange}
                className="pr-10" required
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="flex items-center gap-1.5 text-xs mt-1">
                {passwordsMatch ? <><Check className="h-3 w-3 text-emerald-600" /><span className="text-emerald-600">Passwords match</span></> : <><X className="h-3 w-3 text-destructive" /><span className="text-destructive">Passwords do not match</span></>}
              </div>
            )}
          </div>

          {/* Industries */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Industries of Interest <span className="text-muted-foreground font-normal">(select at least one)</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {industries.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cu-${industry}`}
                    checked={selectedIndustries.includes(industry)}
                    onCheckedChange={() => handleIndustryToggle(industry)}
                  />
                  <Label htmlFor={`cu-${industry}`} className="text-xs font-normal cursor-pointer leading-tight">
                    {industry}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { resetForm(); onClose(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1" style={{ backgroundColor: "#1b4263" }}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
