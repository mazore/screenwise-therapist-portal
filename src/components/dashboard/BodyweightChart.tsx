
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TimeframeSelect } from "@/components/charts/TimeframeSelect";

const data = [
  { date: "Apr 10", weight: 45.5 },
  { date: "Apr 11", weight: 45.3 },
  { date: "Apr 12", weight: 45.4 },
  { date: "Apr 13", weight: 45.6 },
  { date: "Apr 14", weight: 45.7 },
  { date: "Apr 15", weight: 45.8 },
];

interface BodyweightChartProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export const BodyweightChart = ({ timeframe, onTimeframeChange }: BodyweightChartProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Bodyweight Progression</CardTitle>
          <CardDescription>Daily weight measurements in kg</CardDescription>
        </div>
        <TimeframeSelect value={timeframe} onValueChange={onTimeframeChange} />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} kg`} />
            <Line type="monotone" dataKey="weight" stroke="#9B66D7" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
