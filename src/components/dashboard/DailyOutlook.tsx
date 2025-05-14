
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock, UserRound } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  type: "appointment";
  clientName: string;
  time: string;
}

export const DailyOutlook = () => {
  // Mock data - in a real app this would come from your backend
  const todaysEvents: Event[] = [
    { id: "1", type: "appointment", clientName: "Client #1", time: "10:00 AM" },
    { id: "2", type: "appointment", clientName: "Client #3", time: "2:30 PM" },
    { id: "3", type: "appointment", clientName: "Client #8", time: "4:15 PM" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Daily Outlook
          </div>
        </CardTitle>
        <span className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d")}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 rounded-lg bg-purple-100 p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-200">
                <Clock className="h-5 w-5 text-purple-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-purple-900">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <span>{event.time}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <UserRound className="h-3 w-3" />
                    {event.clientName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
