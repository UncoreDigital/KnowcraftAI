import MetricCard from "@/components/MetricCard";
import { MessageSquare, Users, Clock, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-8" data-testid="page-analytics">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor AI assistant performance and usage metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Queries"
          value="1,284"
          change="+12% from last month"
          icon={MessageSquare}
        />
        <MetricCard
          label="Active Users"
          value="342"
          change="+8% from last month"
          icon={Users}
        />

      </div>
    </div>
  );
}
