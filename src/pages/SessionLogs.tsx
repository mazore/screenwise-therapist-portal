import React, { useState } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { format } from "date-fns";
import { Filter, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/hooks/useClientData";

// import { CreateLogDialog } from "@/components/logs/CreateLogDialog";

// Dummy data for session logs
// const sessionLogs = [
//   {
//     id: 1,
//     dateTime: new Date("2024-04-16T12:30:00"),
//     meal: "Lunch",
//     progressionLevel: "Level 2",
//     bites: 6,
//     duration: "15:20",
//     success: 7,
//     foods: "Mashed potatoes, steamed carrots",
//     disruptiveBehaviors: ["Gagging", "Spitting out food"],
//     keyCircumstances: ["Non-routine setting"],
//     comments: "Showed improvement with texture acceptance"
//   },
//   {
//     id: 2,
//     dateTime: new Date("2024-04-16T08:15:00"),
//     meal: "Breakfast",
//     progressionLevel: "Level 2",
//     bites: 4,
//     duration: "12:45",
//     success: 6,
//     foods: "Oatmeal, banana puree",
//     disruptiveBehaviors: ["Improper chewing"],
//     keyCircumstances: ["New medication"],
//     comments: "Morning session - slightly less cooperative than usual"
//   },
//   {
//     id: 3,
//     dateTime: new Date("2024-04-15T18:00:00"),
//     meal: "Dinner",
//     progressionLevel: "Level 1",
//     bites: 5,
//     duration: "20:10",
//     success: 8,
//     foods: "Pureed chicken, mashed sweet potato",
//     disruptiveBehaviors: [],
//     keyCircumstances: [],
//     comments: "Good engagement throughout session"
//   },
//   {
//     id: 4,
//     dateTime: new Date("2024-04-14T12:00:00"),
//     meal: "Lunch",
//     progressionLevel: "Level 3",
//     bites: 8,
//     duration: "18:30",
//     success: 9,
//     foods: "Small pasta pieces, pureed vegetables",
//     disruptiveBehaviors: [],
//     keyCircumstances: ["Sitting at dining table"],
//     comments: "Excellent progress with new food textures"
//   },
//   {
//     id: 5,
//     dateTime: new Date("2024-04-13T17:45:00"),
//     meal: "Dinner",
//     progressionLevel: "Level 2",
//     bites: 5,
//     duration: "16:15",
//     success: 7,
//     foods: "Mashed sweet potato, soft rice",
//     disruptiveBehaviors: ["Crying"],
//     keyCircumstances: ["Sickness"],
//     comments: "Slightly resistant due to mild cold symptoms"
//   }
// ];

const SessionLogs: React.FC = () => {
  const { clientData } = useClientData();
  console.log("Session logs printing clientData:", clientData);

  const [searchTerm, setSearchTerm] = useState("");

  // Check if clientData is available and has session logs
  const sessionLogs = clientData?.mealHistory || [];

  // Filter logs based on search term
  // const filteredLogs = sessionLogs.filter(log =>
  //   log.meal.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   log.foods.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   log.comments.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredLogs = sessionLogs.filter((log) => {
    const meal = log.mealType?.toLowerCase() || "";
    const foods = (log.mealAttributes || []).join(" ").toLowerCase();
    const comments = log.comment?.toLowerCase() || "";
    return (
      meal.includes(searchTerm.toLowerCase()) ||
      foods.includes(searchTerm.toLowerCase()) ||
      comments.includes(searchTerm.toLowerCase())
    );
  });


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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
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
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell>
                          {log.mealStartTime ? (
                            <div>
                              <div>{format(new Date(log.mealStartTime), "MMM d, yyyy")}</div>
                              <div>{format(new Date(log.mealStartTime), "h:mm a")}</div>
                            </div>
                          ) : "N/A"}
                        </TableCell>
                        <TableCell>{log.mealType ? log.mealType.charAt(0).toUpperCase() + log.mealType.slice(1) : "—"}</TableCell>
                        <TableCell>{log.level ?? "—"}</TableCell>
                        <TableCell>{log.bitesTaken}</TableCell>
                        <TableCell>
                          {typeof log.elapsedSeconds === "number" ? (
                            (() => {
                              const minutes = Math.floor(log.elapsedSeconds / 60);
                              const seconds = Math.round(log.elapsedSeconds % 60);
                              return `${minutes}m ${seconds}s`;
                            })()
                          ) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {typeof log.successRating === "number"
                            ? `${log.successRating}/10`
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
                            ? log.mealAttributes.join(", ")
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
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
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