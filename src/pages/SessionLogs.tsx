import React, { useState, useEffect } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { format } from "date-fns";
import { Filter, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/hooks/useClientData";

import { getPaginationRange, getProgressionName } from "@/lib/utils";

//import { CreateLogDialog } from "@/components/logs/CreateLogDialog";

const SessionLogs: React.FC = () => {
  const { clientData } = useClientData();
  console.log("Session logs printing clientData:", clientData);

  const [searchTerm, setSearchTerm] = useState("");

  // Check if clientData is available and has session logs
  const sessionLogs = clientData?.mealHistory || [];

  //Tracks current page number
  const [currentPage, setCurrentPage] = useState(1);

  // Reset current page when switching changes
  // Clear search term when switching clients
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm(""); // optional: clear search on client switch
  }, [clientData]);

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  // Filter logs based on search term
  const filteredLogs = sessionLogs.sort((a, b) => (b.mealStartTime - a.mealStartTime)).filter((log) => {
    const meal = log.mealType?.toLowerCase() || "";
    const keyNotes = (log.mealAttributes || []).join(" ").toLowerCase();
    const comments = log.comment?.toLowerCase() || "";
    const level = getProgressionName(clientData?.progressionStages || [], log.progressionUuid).toLowerCase();
    const rating = log.successRating || log.rating
    return (
      meal.includes(searchTerm.toLowerCase()) ||
      keyNotes.includes(searchTerm.toLowerCase()) ||
      comments.includes(searchTerm.toLowerCase()) ||
      level.includes(searchTerm.toLowerCase()) ||
      (rating ? rating.toString() + "/10" : "").includes(searchTerm)
    );
  });

  //Compute sliced logs for current page
  const logsPerPage = 10;
  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;
  const pagedLogs = filteredLogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredLogs.length / 10);

  return (
    <TherapyLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold tracking-tight">Session Logs</h1>
            <p className="text-muted-foreground">
              View and manage feeding therapy session logs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search logs..."
                className="pl-8 w-full sm:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/*<Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>*/}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Session Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day/Time</TableHead>
                    <TableHead>Meal</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Bites</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Foods</TableHead>
                    <TableHead>Disruptive Behaviors Tracked</TableHead>
                    <TableHead>Key Circumstances Tracked</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedLogs.length > 0 ? (
                    pagedLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell>
                          {log.mealStartTime ? (
                            <div>
                              <div>{format(new Date(log.mealStartTime), "MMM d, yyyy")}</div>
                              <div>{format(new Date(log.mealStartTime), "h:mm a")}</div>
                            </div>
                          ) : "—"}
                        </TableCell>
                        <TableCell>{log.mealType ? log.mealType.charAt(0).toUpperCase() + log.mealType.slice(1) : "—"}</TableCell>
                        <TableCell>{getProgressionName(clientData?.progressionStages || [], log.progressionUuid)}</TableCell>
                        <TableCell>{log.bitesTaken}</TableCell>
                        <TableCell>
                          {typeof log.elapsedSeconds === "number" ? (
                            (() => {
                              const minutes = Math.floor(log.elapsedSeconds / 60);
                              const seconds = Math.round(log.elapsedSeconds % 60);
                              return `${minutes}m ${seconds}s`;
                            })()
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          {typeof log.successRating === "number"
                            ? `${log.successRating}/10`
                            : typeof log.rating === "number"
                            ? `${log.rating}/10`
                            : "—"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {(log.foods || []).length > 0
                            ? log.foods.join(", ")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {(log.disruptiveBehaviors || []).length > 0
                            ? log.disruptiveBehaviors.join(", ")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {(log.mealAttributes || []).length > 0
                            ? log.mealAttributes
                                .map((circ) => 
                                  circ.toLowerCase().split("_").map((word) => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(" ")
                                ).join(", ")
                            : "—"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {log.comment || "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                        No session logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  {/* Previous page button */}
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {/* Dynamically generate page numbers and ellipses */}
                  {getPaginationRange(currentPage, totalPages).map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "..." ? (
                        <span className="px-2 text-muted-foreground">...</span>
                      ) : (
                        // Render actual page number link
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

                  {/* Next page button */}
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
          </CardContent>
        </Card>
      </div>
    </TherapyLayout>
  );
};

export default SessionLogs;