import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn("bg-white p-6 border border-neutral-200", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-xs mt-2 font-medium",
                trendUp ? "text-green-600" : "text-red-500"
              )}
            >
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-brand-50 text-brand-600">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
