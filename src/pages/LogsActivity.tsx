
import React from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

// Dummy data for session logs
const sessionLogs = [
  {
    id: 1,
    dateTime: new Date("2024-04-16T12:30:00"),
    meal: "Lunch",
    progressionLevel: "Level 2",
    bites: 6,
    duration: "15:20",
    success: 7,
    foods: "Mashed potatoes, steamed carrots",
    disruptiveBehaviors: ["Gagging", "Spitting out food"],
    keyCircumstances: ["Non-routine setting"],
    comments: "Showed improvement with texture acceptance"
  },
  {
    id: 2,
    dateTime: new Date("2024-04-16T08:15:00"),
    meal: "Breakfast",
    progressionLevel: "Level 2",
    bites: 4,
    duration: "12:45",
    success: 6,
    foods: "Oatmeal, banana puree",
    disruptiveBehaviors: ["Improper chewing"],
    keyCircumstances: ["New medication"],
    comments: "Morning session - slightly less cooperative than usual"
  },
  {
    id: 3,
    dateTime: new Date("2024-04-15T18:00:00"),
    meal: "Dinner",
    progressionLevel: "Level 1",
    bites: 5,
    duration: "20:10",
    success: 8,
    foods: "Pureed chicken, mashed sweet potato",
    disruptiveBehaviors: [],
    keyCircumstances: [],
    comments: "Good engagement throughout session"
  }
];

const LogsActivity = () => {
  return (
    <TherapyLayout>
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                    <TableHead>Disruptive Behaviors</TableHead>
                    <TableHead>Key Circumstances</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(log.dateTime, "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>{log.meal}</TableCell>
                      <TableCell>{log.progressionLevel}</TableCell>
                      <TableCell>{log.bites}</TableCell>
                      <TableCell>{log.duration}</TableCell>
                      <TableCell>{log.success}/10</TableCell>
                      <TableCell>{log.foods}</TableCell>
                      <TableCell>
                        {log.disruptiveBehaviors.length > 0
                          ? log.disruptiveBehaviors.join(", ")
                          : "None"}
                      </TableCell>
                      <TableCell>
                        {log.keyCircumstances.length > 0
                          ? log.keyCircumstances.join(", ")
                          : "None"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.comments}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TherapyLayout>
  );
};

export default LogsActivity;
