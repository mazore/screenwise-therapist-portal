import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Utensils, Skull, MessageSquare } from "lucide-react";
import { format } from "date-fns";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


import { useClientData } from "@/hooks/useClientData"; // Import hook
import { getProgressionName, getPaginationRange } from "@/lib/utils"; 
interface SessionTableProps {
  clientId?: string | null;
  showAllLogs?: boolean; // Whether to show all logs or only the last 7 days
  showClientColumn?: boolean; // Whether to display the client name column
}

export const SessionTable = ({ clientId, showAllLogs = false, showClientColumn = true }: SessionTableProps) => {
  const { allClients, clientData } = useClientData();
  const [sessions, setSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Pagination: items per page

  useEffect(() => {
    const logs = [];
    const oneWeekAgo = new Date();
    if (!showAllLogs) oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const clients = clientId ? { [clientId]: clientData } : allClients;

    if (clients) {
      Object.entries(clients).forEach(([clientName, client]: [string, any]) => {
        if (client.mealHistory) {
          logs.push(
            ...client.mealHistory
              .filter((log: any) => showAllLogs || new Date(log.mealStartTime) >= oneWeekAgo)
              .map((log: any) => ({
                ...log,
                client: clientName,
                dateTime: log.mealStartTime ? new Date(log.mealStartTime) : null, // Handle missing timestamps
                level: getProgressionName(client.progressionStages || [], log.progressionUuid),
              }))
          );
        }
      });

      // Sort logs: logs with timestamps first, then by mealStartTime descending
      logs.sort((a, b) => {
        if (!a.mealStartTime && b.mealStartTime) return 1; // Logs without timestamps go last
        if (a.mealStartTime && !b.mealStartTime) return -1;
        return b.mealStartTime - a.mealStartTime; // Descending order
      });

      setSessions(logs);
    }
  }, [allClients, clientData, clientId, showAllLogs]);

  useEffect(() => {
    // Reset to the first page when switching clients or toggling logs
    setCurrentPage(1);
  }, [clientId, showAllLogs]);

  const filteredSessions = sessions;
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Session Logs</h2>
        <p className="text-sm text-muted-foreground">
          {showAllLogs ? "Showing all logs" : "Showing logs from the last 7 days"}
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day/Time</TableHead>
              {showClientColumn && <TableHead>Client</TableHead>}
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
            {paginatedSessions.map((session) => (
              <TableRow key={session.mealStartTime || session.id}>
                <TableCell>
                  {session.mealStartTime ? (
                    <div>
                      <div>{format(new Date(session.mealStartTime), "MMM d, yyyy")}</div>
                      <div>{format(new Date(session.mealStartTime), "h:mm a")}</div>
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                {showClientColumn && <TableCell>{session.client}</TableCell>}
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
                  {session.successRating != null
                    ? `${Number(session.successRating)}/10`
                    : "—"}
                </TableCell>
                <TableCell>{session.foods && session.foods.length > 0 ? session.foods.join(", ") : "—"}</TableCell>
                <TableCell>
                  {(() => {
                    // Handle both old and new disruptive behavior formats
                    const oldFormat = session.disruptiveBehaviorRatings && Object.keys(session.disruptiveBehaviorRatings).length > 0;
                    const newFormat = session.disruptiveBehaviorOccurrences && Object.keys(session.disruptiveBehaviorOccurrences).length > 0;
                    
                    if (oldFormat) {
                      return Object.keys(session.disruptiveBehaviorRatings).join(", ");
                    } else if (newFormat) {
                      return Object.entries(session.disruptiveBehaviorOccurrences)
                        .map(([behavior, occurrences]) => {
                          let count = 0;
                          
                          // Handle both old format (array) and new format (object with count/times)
                          if (Array.isArray(occurrences)) {
                            count = occurrences.length;
                          } else if (occurrences && typeof occurrences === 'object' && 'count' in occurrences) {
                            count = (occurrences as { count?: number; times?: number[] }).count || 0;
                          }
                          
                          return `${behavior} (${count}x)`;
                        })
                        .join(", ");
                    } else {
                      return "—";
                    }
                  })()}
                </TableCell>
                <TableCell>
                  {(session.mealAttributes || []).length > 0
                    ? session.mealAttributes
                        .map((circ) =>
                          circ
                            .toLowerCase()
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")
                        )
                        .join(", ")
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
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
              />
            </PaginationItem>
            {getPaginationRange(currentPage, totalPages).map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <span className="px-2 text-muted-foreground">...</span>
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};