import React, { useState, useEffect } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { SessionTable } from "@/components/dashboard/SessionTable";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Filter, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/hooks/useClientData";

import { getProgressionName, getPaginationRange } from "@/lib/utils";

const SessionLogs: React.FC = () => {
  const { clientData, selectedClient } = useClientData();

  // Debugging: Log selectedClient and clientData
  console.log("Debugging selectedClient:", selectedClient);
  console.log("Debugging clientData:", clientData);

  const [searchTerm, setSearchTerm] = useState("");

  // Check if clientData is available and has session logs
  const sessionLogs = clientData?.mealHistory || [];

  // Tracks current page number
  const [currentPage, setCurrentPage] = useState(1);

  // Reset current page when switching changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm(""); // Clear search on client switch
  }, [clientData]);

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter logs based on search term
  const filteredLogs = sessionLogs
    .sort((a, b) => b.mealStartTime - a.mealStartTime)
    .filter((log) => {
      const meal = log.mealType?.toLowerCase() || "";
      const keyNotes = (log.mealAttributes || []).join(" ").toLowerCase();
      const comments = log.comment?.toLowerCase() || "";
      const level = getProgressionName(clientData?.progressionStages || [], log.progressionUuid).toLowerCase();
      const rating = log.successRating || log.rating;
      return (
        meal.includes(searchTerm.toLowerCase()) ||
        keyNotes.includes(searchTerm.toLowerCase()) ||
        comments.includes(searchTerm.toLowerCase()) ||
        level.includes(searchTerm.toLowerCase()) ||
        (rating ? rating.toString() + "/10" : "").includes(searchTerm)
      );
    });

  // Compute sliced logs for current page
  const logsPerPage = 10;
  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;
  const pagedLogs = filteredLogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

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
            {/* <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search logs..."
                className="pl-8 w-full sm:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}
          </div>
        </div>
        {selectedClient ? (
          <SessionTable clientId={selectedClient} showAllLogs={true} showClientColumn={false} />
        ) : (
          <div className="text-center text-muted-foreground">
            Please select a client to view their session logs.
          </div>
        )}
      </div>
    </TherapyLayout>
  );
};

export default SessionLogs;