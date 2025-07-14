import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Utensils, Skull, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useClientData } from "@/hooks/useClientData"; // Import hook
import { getProgressionName } from "@/lib/utils"; 
interface SessionTableProps {
  clientId?: string | null;
}

export const SessionTable = ({ clientId }: SessionTableProps) => {
  const { allClients } = useClientData(); // Access all clients' data
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (allClients) {
      const logs = [];
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 3); // Calculate the date 3 days ago

      Object.entries(allClients).forEach(([clientName, client]: [string, any]) => {
        if (client.mealHistory) {
          logs.push(...client.mealHistory
            .filter((log: any) => new Date(log.mealStartTime) >= oneWeekAgo) // Filter logs from the last 3 days
            .map((log: any) => ({
              ...log,
              client: clientName,
              dateTime: new Date(log.mealStartTime), // Correctly convert Unix timestamp to Date
              level: getProgressionName(client.progressionStages || [], log.progressionUuid), // Get level name
            })));
        }
      });

      // Sort logs by mealStartTime in descending order (most recent first)
      logs.sort((a, b) => b.mealStartTime - a.mealStartTime);

      setSessions(logs);
    }
  }, [allClients]);

  const displayedSessions = clientId
    ? sessions.filter(session => session.clientId === clientId)
    : sessions;

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
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
              <TableHead>Level</TableHead> {/* Updated to display level */}
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
            {displayedSessions.map(session => (
              <TableRow key={session.mealStartTime}>
                <TableCell>
                  {session.mealStartTime ? (
                    <div>
                      <div>{format(new Date(session.mealStartTime), "MMM d, yyyy")}</div>
                      <div>{format(new Date(session.mealStartTime), "h:mm a")}</div>
                    </div>
                  ) : "—"}
                </TableCell>
                <TableCell>{session.client}</TableCell>
                <TableCell>{session.mealType ? session.mealType.charAt(0).toUpperCase() + session.mealType.slice(1) : "—"}</TableCell>
                <TableCell>{session.level || "N/A"}</TableCell> 
                <TableCell>{session.bitesTaken}</TableCell>
                <TableCell>
                  {typeof session.elapsedSeconds === "number" ? (
                    (() => {
                      const minutes = Math.floor(session.elapsedSeconds / 60);
                      const seconds = Math.round(session.elapsedSeconds % 60);
                      return `${minutes}m ${seconds}s`;
                    })()
                  ) : "—"}
                </TableCell>
                <TableCell>
                  {typeof session.successRating === "number"
                    ? `${session.successRating}/10`
                    : typeof session.rating === "number"
                    ? `${session.rating}/10`
                    : "—"}
                </TableCell>
                <TableCell>{session.foods ? session.foods.join(", ") : "—"}</TableCell>
                <TableCell>
                  {session.disruptiveBehaviorRatings && Object.keys(session.disruptiveBehaviorRatings).length > 0
                    ? Object.keys(session.disruptiveBehaviorRatings).join(", ")
                    : "—"}
                </TableCell>
                <TableCell>
                  {(session.mealAttributes || []).length > 0
                    ? session.mealAttributes
                      .map((circ) => 
                         circ.toLowerCase().split("_").map((word) => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(" ")
                      ).join(", ")
                    : "—"}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {session.comment || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};