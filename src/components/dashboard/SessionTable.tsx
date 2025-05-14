import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Utensils, Skull, MessageSquare } from "lucide-react";
import { format } from "date-fns";
interface SessionTableProps {
  clientId?: string | null;
}
export const SessionTable = ({
  clientId
}: SessionTableProps) => {
  const sessions = [{
    id: "1",
    dateTime: new Date("2024-04-16T18:00:00"),
    client: "Client #1",
    meal: "Dinner",
    clientId: "client-1",
    level: "Level 1",
    bites: 4,
    duration: "15:20",
    success: "6/10",
    foods: "Mashed potatoes, pureed carrots",
    disruptiveBehaviors: ["gagging", "crying"],
    keyCircumstances: ["Non-routine setting"],
    comments: "Showed resistance to new textures"
  }, {
    id: "2",
    dateTime: new Date("2024-04-16T12:30:00"),
    client: "Client #3",
    meal: "Lunch",
    clientId: "client-3",
    level: "Level 2",
    bites: 6,
    duration: "22:45",
    success: "8/10",
    foods: "Yogurt, apple sauce",
    disruptiveBehaviors: [],
    keyCircumstances: [],
    comments: "Good progress with smooth textures"
  }, {
    id: "3",
    dateTime: new Date("2024-04-16T08:00:00"),
    client: "Client #8",
    meal: "Breakfast",
    clientId: "client-8",
    level: "Level 1",
    bites: 3,
    duration: "12:15",
    success: "7/10",
    foods: "Oatmeal",
    disruptiveBehaviors: ["spitting out"],
    keyCircumstances: [],
    comments: "Morning session, still adjusting"
  }, {
    id: "4",
    dateTime: new Date("2024-04-16T15:30:00"),
    client: "Client #12",
    meal: "Snack",
    clientId: "client-1",
    level: "Level 2",
    bites: 2,
    duration: "08:35",
    success: "9/10",
    foods: "Pudding",
    disruptiveBehaviors: [],
    keyCircumstances: [],
    comments: "Excellent session"
  }];
  const displayedSessions = clientId ? sessions.filter(session => session.clientId === clientId) : sessions;
  return <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Recent Logs</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day/Time</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Meal</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Bites</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Success</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  <span>Foods</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Skull className="h-4 w-4" />
                  <span>Disruptive Behaviors</span>
                </div>
              </TableHead>
              <TableHead>Key Circumstances</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comments</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedSessions.map(session => <TableRow key={session.id}>
                <TableCell>{format(session.dateTime, "MMM d, yyyy h:mm a")}</TableCell>
                <TableCell>{session.client}</TableCell>
                <TableCell>{session.meal}</TableCell>
                <TableCell>{session.level}</TableCell>
                <TableCell>{session.bites}</TableCell>
                <TableCell>{session.duration}</TableCell>
                <TableCell>{session.success}</TableCell>
                <TableCell>{session.foods}</TableCell>
                <TableCell>
                  {session.disruptiveBehaviors.length > 0 ? session.disruptiveBehaviors.join(", ") : "None"}
                </TableCell>
                <TableCell>
                  {session.keyCircumstances?.length > 0 ? session.keyCircumstances.join(", ") : "None"}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {session.comments}
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>;
};