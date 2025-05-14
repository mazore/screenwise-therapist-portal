import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, RefreshCw, Target, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
interface ActivityItem {
  id: string;
  type: "session" | "goal" | "intervention" | "note" | "client";
  title: string;
  description: string;
  timestamp: string;
  client: string;
}
export const RecentActivity = () => {
  const activities: ActivityItem[] = [{
    id: "1",
    type: "session",
    title: "Completed Dinner Session",
    description: "Client #1 completed a level 2 session with 6/10 success rating",
    timestamp: "Today, 6:30 PM",
    client: "Client #1"
  }, {
    id: "2",
    type: "goal",
    title: "Goal Achieved",
    description: "Client #8 reached their goal of 5 successful bites per session",
    timestamp: "Today, 4:15 PM",
    client: "Client #8"
  }, {
    id: "3",
    type: "intervention",
    title: "Intervention Updated",
    description: "Adjusted chewing interval for Client #3 from 25s to 30s",
    timestamp: "Today, 2:45 PM",
    client: "Client #3"
  }, {
    id: "4",
    type: "session",
    title: "Completed Lunch Session",
    description: "Client #12 completed a level 1 session with 7/10 success rating",
    timestamp: "Today, 12:10 PM",
    client: "Client #12"
  }, {
    id: "5",
    type: "note",
    title: "Note Added",
    description: "New observation note added about Client #1's texture tolerance",
    timestamp: "Yesterday, 3:40 PM",
    client: "Client #1"
  }];
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "session":
        return <Calendar className="h-4 w-4" />;
      case "goal":
        return <Target className="h-4 w-4" />;
      case "intervention":
        return <RefreshCw className="h-4 w-4" />;
      case "note":
        return <FileText className="h-4 w-4" />;
      case "client":
        return <User className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  const getActivityColor = (type: string) => {
    switch (type) {
      case "session":
        return "bg-blue-100 text-blue-700";
      case "goal":
        return "bg-green-100 text-green-700";
      case "intervention":
        return "bg-purple-100 text-purple-700";
      case "note":
        return "bg-amber-100 text-amber-700";
      case "client":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map(activity => <div key={activity.id} className="flex items-start">
              <div className={cn("p-2 rounded-full mr-3", getActivityColor(activity.type))}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <User className="inline h-3 w-3 mr-1" /> 
                  {activity.client}
                </p>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};