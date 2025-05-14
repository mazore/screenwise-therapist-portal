
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, ListCheck, AlertTriangle } from "lucide-react";

interface ClientOverviewProps {
  clients: Array<{
    id: string;
    name: string;
    lastLogDate: string;
    logsLast7Days: number;
    mainGoal: {
      type: string;
      current: number;
      starting: number;
      target: number;
      displayUnit?: string;
    };
  }>;
}

export const ClientOverview = ({ clients }: ClientOverviewProps) => {
  const calculateProgress = (current: number, starting: number, target: number) => {
    return Math.max(0, Math.min(1, (current - starting) / ((target - starting) || 1))) * 100;
  };

  const isInactive = (lastLogDate: string) => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(lastLogDate) < threeDaysAgo;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Client Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.map((client) => (
            <div key={client.id} className="grid grid-cols-4 gap-4 p-4 bg-[#F3F0FA] rounded-lg relative">
              {isInactive(client.lastLogDate) && (
                <div className="absolute top-2 right-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#7E69AB] flex items-center justify-center">
                  <CalendarDays className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">{client.name}</div>
                  <div className="text-xs text-muted-foreground">Last log: {client.lastLogDate}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#7E69AB] flex items-center justify-center">
                  <ListCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">{client.logsLast7Days}</div>
                  <div className="text-xs text-muted-foreground">(Past 7 days)</div>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="mb-1">
                  <span className="text-sm font-medium">{client.mainGoal.type}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    Current: {client.mainGoal.current}
                    {client.mainGoal.displayUnit && <span className="ml-1">{client.mainGoal.displayUnit}</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{client.mainGoal.starting}</span>
                  <Progress 
                    value={calculateProgress(
                      client.mainGoal.current,
                      client.mainGoal.starting,
                      client.mainGoal.target
                    )} 
                    className="flex-1 h-2 bg-[#E5DEFF]"
                  />
                  <span className="text-xs">{client.mainGoal.target}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
