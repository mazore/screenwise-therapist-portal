
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PatientLogsProps {
  clientId: string;
}

export const PatientLogs = ({ clientId }: PatientLogsProps) => {
  // Sample patient-specific session data - same for all clients for now
  const sessions = [
    {
      id: "1",
      date: "2025-04-12",
      time: "6:00 PM",
      meal: "Dinner",
      method: "Manual",
      bites: 4,
      duration: "15:20",
      ounces: 1.1,
      success: 65,
      comments: "Bad day, resistance to new foods",
    },
    {
      id: "2",
      date: "2025-04-12",
      time: "12:30 PM",
      meal: "Lunch",
      method: "Assisted",
      bites: 3,
      duration: "17:17",
      ounces: 0.8,
      success: 78,
      comments: "Showed interest in yogurt",
    },
    {
      id: "3",
      date: "2025-04-11",
      time: "6:30 PM",
      meal: "Dinner",
      method: "Manual",
      bites: 5,
      duration: "20:05",
      ounces: 1.3,
      success: 82,
      comments: "Good progress with pureed vegetables",
    },
    {
      id: "4",
      date: "2025-04-11",
      time: "8:00 AM",
      meal: "Breakfast",
      method: "Guided",
      bites: 2,
      duration: "12:45",
      ounces: 0.7,
      success: 60,
      comments: "Morning resistance as usual",
    },
  ];

  const latestSession = sessions[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Latest Session Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Bites Taken</p>
              <p className="text-xl font-bold">{latestSession.bites}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-xl font-bold">{latestSession.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ounces Eaten</p>
              <p className="text-xl font-bold">{latestSession.ounces} oz</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Success</p>
              <p className="text-xl font-bold">{latestSession.success}%</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Success</p>
            <Progress value={latestSession.success} className="h-2" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Comments</p>
            <p className="italic">"{latestSession.comments}"</p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Session Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Meal</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Bites</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Ounces</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>{session.time}</TableCell>
                  <TableCell>{session.meal}</TableCell>
                  <TableCell>{session.method}</TableCell>
                  <TableCell>{session.bites}</TableCell>
                  <TableCell>{session.duration}</TableCell>
                  <TableCell>{session.ounces} oz</TableCell>
                  <TableCell>{session.success}%</TableCell>
                  <TableCell className="max-w-xs truncate">{session.comments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
