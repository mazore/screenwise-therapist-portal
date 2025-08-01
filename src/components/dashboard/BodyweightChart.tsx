import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TimeframeSelect } from "@/components/charts/TimeframeSelect";
import { useClientData } from "@/hooks/useClientData";
import { STATS_TIME_MODES } from "@/lib/utils";
import { computeWeightStats } from "@/lib/computeStats";

interface BodyweightChartProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export const BodyweightChart = ({ timeframe, onTimeframeChange }: BodyweightChartProps) => {
  const { clientData } = useClientData();
  const weightMeasurements = clientData?.weightMeasurements || [];
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const timeMode = STATS_TIME_MODES.find((mode) => mode.label === timeframe);
    if (!timeMode) return;

    const data = computeWeightStats(timeMode, weightMeasurements);

    const formatted = data.map((item) => ({
      date: item.label,
      weight: item.y,
      startTime: item.startTime,
      endTime: item.endTime,
      rangeLabel: item.rangeLabel || item.label,
    }));

    setChartData(formatted);
  }, [timeframe, weightMeasurements]);

  // Calculate dynamic Y-axis range and tick count
  const validWeights = chartData.filter(item => item.weight != null && item.weight > 0).map(item => item.weight);
  const hasData = validWeights.length > 1;
  
  let yMin = 0;
  let yMax = 100;
  let tickCount = 5;

  if (hasData) {
    const minWeight = Math.min(...validWeights);
    const maxWeight = Math.max(...validWeights);
    const range = maxWeight - minWeight;
    
    // Add padding (similar to mobile app's +/- 2)
    const padding = Math.max(2, range * 0.1);
    yMin = Math.max(0, minWeight - padding);
    yMax = maxWeight + padding;
    
    // Calculate number of ticks based on range
    const dataRange = yMax - yMin;
    if (dataRange <= 10) {
      tickCount = 5;
    } else if (dataRange <= 20) {
      tickCount = 6;
    } else {
      tickCount = 8;
    }
    
    // Adjust yMax to ensure equal tick spacing
    const tickInterval = (yMax - yMin) / (tickCount - 1);
    const roundedInterval = Math.ceil(tickInterval * 2) / 2; // Round to nearest 0.5
    yMax = yMin + (roundedInterval * (tickCount - 1));
  }

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
                  return label.split(" ")[0];
                }
                return label;
              }}
            />
            <YAxis 
              domain={hasData ? [yMin, yMax] : ['dataMin - 2', 'dataMax + 2']}
              tickCount={tickCount}
              tickFormatter={(value) => `${Math.round(value)}`}
            />
            <Tooltip content={<CustomTooltip timeframe={timeframe} />} />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#9B66D7" 
              strokeWidth={2} 
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label, timeframe }: any) => {
  if (!active || !payload?.[0]) return null;

  const { weight, startTime, endTime } = payload[0].payload;

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
      <div>{weight !== undefined && weight !== null ? weight : ""} kg</div>
    </div>
  );
};
