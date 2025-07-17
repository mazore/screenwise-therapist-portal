import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TimeframeSelect } from "@/components/charts/TimeframeSelect";
import { useClientData } from "@/hooks/useClientData";
import computeStats from "@/lib/computeStats";
import { STATS_TIME_MODES } from "@/lib/utils";

interface VolumePerMealChartProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export const VolumePerMealChart = ({
  timeframe,
  onTimeframeChange,
}: VolumePerMealChartProps) => {
  const { clientData } = useClientData();
  const mealHistory = clientData?.mealHistory || [];
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const timeMode = STATS_TIME_MODES.find((mode) => mode.label === timeframe);
    if (!timeMode) return;

    const data = computeStats(
      "volumePerMeal",
      (meal) => {
        const initial = parseFloat(meal.initialOunces);
        const final = parseFloat(meal.finalOunces);
        if (isNaN(initial) || isNaN(final)) return null;
        return initial - final;
      },
      null,
      timeMode,
      mealHistory
    );

    const formatted = data.map((item) => ({
      date: item.label,
      ounces: item.y,
      startTime: item.startTime,
      endTime: item.endTime,
      rangeLabel: item.rangeLabel || item.label,
    }));

    setChartData(formatted);
  }, [timeframe, mealHistory]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Volume Consumed per Meal</CardTitle>
          <CardDescription>
            Average ounces consumed per meal
          </CardDescription>
        </div>
        <TimeframeSelect value={timeframe} onValueChange={onTimeframeChange} />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis
              padding={{ right: 20 }}
              dataKey="date"
              interval={0}
              tickFormatter={(label, index) => {
                if (timeframe === "30D") {
                  return index % 5 === 0 ? label : "";
                }
                if (timeframe === "6M" || timeframe === "12M") {
                  return label.split(" ")[0];
                }
                return label;
              }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip timeframe={timeframe} />} />
            <Line
              type="monotone"
              dataKey="ounces"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label, timeframe }: any) => {
  if (!active || !payload?.[0]) return null;

  const { ounces, startTime, endTime } = payload[0].payload;

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
      <div>{ounces} oz</div>
    </div>
  );
};
