
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TimeframeSelect } from "@/components/charts/TimeframeSelect";

const data = [
  { date: "Apr 10", bites: 4 },
  { date: "Apr 11", bites: 6 },
  { date: "Apr 12", bites: 5 },
  { date: "Apr 13", bites: 7 },
  { date: "Apr 14", bites: 6 },
  { date: "Apr 15", bites: 8 },
];

interface BitesPerMealChartProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export const BitesPerMealChart = ({ timeframe, onTimeframeChange }: BitesPerMealChartProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Bites per Meal</CardTitle>
          <CardDescription>Average number of bites taken during meals</CardDescription>
        </div>
        <TimeframeSelect value={timeframe} onValueChange={onTimeframeChange} />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} bites`} />
            <Line type="monotone" dataKey="bites" stroke="#F97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
