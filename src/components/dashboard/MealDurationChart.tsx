
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TimeframeSelect } from "@/components/charts/TimeframeSelect";

const data = [
  { date: "Apr 10", duration: 15 },
  { date: "Apr 11", duration: 18 },
  { date: "Apr 12", duration: 12 },
  { date: "Apr 13", duration: 20 },
  { date: "Apr 14", duration: 16 },
  { date: "Apr 15", duration: 14 },
];

interface MealDurationChartProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export const MealDurationChart = ({ timeframe, onTimeframeChange }: MealDurationChartProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Meal Duration Over Time</CardTitle>
          <CardDescription>Average meal duration in minutes per day</CardDescription>
        </div>
        <TimeframeSelect value={timeframe} onValueChange={onTimeframeChange} />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} mins`} />
            <Line type="monotone" dataKey="duration" stroke="#4B9CD3" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
