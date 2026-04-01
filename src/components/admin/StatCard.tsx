import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: "#1b4263" }}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {trend && (
              <p className="text-xs mt-1" style={{ color: "#4fc9ab" }}>
                {trend}
              </p>
            )}
          </div>
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(79, 201, 171, 0.12)" }}
          >
            <Icon className="h-6 w-6" style={{ color: "#1f7a7a" }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
