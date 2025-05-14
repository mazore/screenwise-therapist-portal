
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TimeframeSelect } from "@/components/charts/TimeframeSelect";

const data = [
  { date: "Apr 10", behaviors: 3 },
  { date: "Apr 11", behaviors: 5 },
  { date: "Apr 12", behaviors: 2 },
  { date: "Apr 13", behaviors: 4 },
  { date: "Apr 14", behaviors: 1 },
  { date: "Apr 15", behaviors: 2 },
];

interface DisruptiveBehaviorChartProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export const DisruptiveBehaviorChart = ({ timeframe, onTimeframeChange }: DisruptiveBehaviorChartProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Disruptive Behaviors per Meal</CardTitle>
          <CardDescription>Number of incidents during meals</CardDescription>
        </div>
        <TimeframeSelect value={timeframe} onValueChange={onTimeframeChange} />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} incidents`} />
            <Bar dataKey="behaviors" fill="#57B894" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
