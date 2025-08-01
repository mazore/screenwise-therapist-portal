import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TimeframeSelect } from "@/components/charts/TimeframeSelect";
import computeStats from "@/lib/computeStats";
import { useClientData } from "@/hooks/useClientData";
import { STATS_TIME_MODES } from "@/lib/utils";

interface BitesPerMealChartProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export const BitesPerMealChart = ({ timeframe, onTimeframeChange }: BitesPerMealChartProps) => {
  const { clientData } = useClientData();
  const mealHistory = clientData?.mealHistory || [];
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const timeMode = STATS_TIME_MODES.find((mode) => mode.label === timeframe);
    if (!timeMode) return;

    const data = computeStats(
      "bitesPerMeal",
      (meal) => parseInt(meal.bitesTaken, 10),
      null, // Assuming no specific mealType filter
      timeMode,
      mealHistory
    );

    // Format data for the chart
    const formattedData = data.map((item) => ({
      date: item.label,
      bites: item.y,
      startTime: item.startTime,
      endTime: item.endTime,
      rangeLabel : item.rangeLabel || item.label
    }));

    setChartData(formattedData);
  }, [timeframe, mealHistory]);

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
          <LineChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              dataKey="date"
              interval={0}
              padding={{ left: 20, right: 20 }}
              tickFormatter={(label, index) => {
                if (timeframe === "30D") {
                  return index % 5 === 0 ? label : "";
                }
                if (timeframe === "6M" || timeframe === "12M") {
                  return label.split(" ")[0]; // "Jan 2025" → "Jan"
                }
                return label;
              }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip timeframe={timeframe} />} />
            <Line type="monotone" dataKey="bites" stroke="#F97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


const CustomTooltip = ({ active, payload, label, timeframe }: any) => {
  if (!active || !payload?.[0]) return null;

  const { bites, startTime, endTime } = payload[0].payload;

  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  let labelContent;

  if (timeframe === '6W' || timeframe === '12W') {
    const start = startTime ? new Date(startTime * 1000) : null;
    const end = endTime ? new Date(endTime * 1000) : null;
    labelContent =
      start && end ? `${formatDate(start)} – ${formatDate(end)}` : label;
  } else {
    labelContent = label;
  }

  return (
    <div className="rounded bg-white p-2 shadow-md border text-sm">
      <div className="font-semibold">{labelContent}</div>
      <div>{bites} bites</div>
    </div>
  );
};
