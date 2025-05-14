
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "alert" | "info" | "success";
  title: string;
  message: string;
  date: string;
}

export const NotificationsCard = () => {
  const notifications: Notification[] = [
    {
      id: "n1",
      type: "alert",
      title: "Missing Session Data",
      message: "Client #3 is missing feeding session data for yesterday",
      date: "Today"
    },
    {
      id: "n2",
      type: "info",
      title: "Team Meeting",
      message: "Reminder: Team meeting today at 4:00 PM",
      date: "Today"
    },
    {
      id: "n3",
      type: "success",
      title: "Goal Achieved",
      message: "Client #8 has reached their monthly progress goal",
      date: "Yesterday"
    },
    {
      id: "n4",
      type: "alert",
      title: "Intervention Review Needed",
      message: "Client #12's intervention needs review - no progress for 2 weeks",
      date: "Yesterday"
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {notifications.length}
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-0">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start p-3 hover:bg-muted/50 rounded-md transition-colors">
              <div className="mr-3 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
