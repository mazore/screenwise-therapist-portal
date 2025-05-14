
import React from "react";
import { Users, AlertTriangle } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface DashboardStatsProps {
  totalClients: number;
  inactiveClients: number;
}

export const DashboardStats = ({ totalClients, inactiveClients }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <StatsCard
        title="Active Clients"
        value={totalClients.toString()}
        description="Currently in therapy"
        icon={<Users className="h-5 w-5 text-green-500" />}
      />
      <StatsCard
        title="Caregiver Inactivity"
        value={inactiveClients.toString()}
        description="Clients with no recent activity in past three days"
        icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
      />
    </div>
  );
};
