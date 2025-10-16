import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TimeframeSelect } from "@/components/charts/TimeframeSelect";
import computeStats from "@/lib/computeStats";
import { useClientData } from "@/hooks/useClientData";
import { STATS_TIME_MODES } from "@/lib/utils";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface BitesPerMealChartProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export const BitesPerMealChart = ({ timeframe, onTimeframeChange }: BitesPerMealChartProps) => {
  const { clientData } = useClientData();
  const mealHistory = clientData?.mealHistory || [];
  const [chartData, setChartData] = useState([]);
  const [foodInteraction, setFoodInteraction] = useState(clientData?.foodInteraction || "Bite");
  const [interactionSeen, setInteractionSeen] = useState(clientData?.foodInteraction || "Bite");
  useEffect(() => {
    const timeMode = STATS_TIME_MODES.find((mode) => mode.label === timeframe);
    if (!timeMode) return;


    const filteredMeals = mealHistory.filter((meal) => {
  const mealType = (meal.foodInteraction || "Bite").toLowerCase(); // ✅ default to Bite
  return mealType === interactionSeen.toLowerCase();
});



    const data = computeStats(
      "bitesPerMeal",
      (meal) => {
        if (interactionSeen === "Smell") return parseInt(meal.bitesTaken || "0", 10)
        if (interactionSeen === "Touch") return parseInt(meal.bitesTaken || "0", 10)
        return parseInt(meal.bitesTaken || "0", 10)
      },
      null, // Assuming no specific mealType filter
      timeMode,
      filteredMeals
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
    setFoodInteraction(clientData?.foodInteraction);
  }, [timeframe, mealHistory, clientData?.foodInteraction,interactionSeen]);


  return (
      <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      {/* Left side: title + description */}
      <div className="flex flex-col">
        <CardTitle>
          {interactionSeen === "Bite" && "Bites Per Meal"}
          {interactionSeen === "Smell" && "Smells Per Meal"}
          {interactionSeen === "Touch" && "Touches Per Meal"}
        </CardTitle>
        <CardDescription>
          Average number of{" "}
          {interactionSeen === "Bite" && "bites"}
          {interactionSeen === "Smell" && "smells"}
          {interactionSeen === "Touch" && "touches"} taken during meals
        </CardDescription>
      </div>

      {/* Right side: both dropdowns side by side */}
      <div className="flex flex-row items-center gap-3">
        <Select
          value={interactionSeen}
          onValueChange={(value) => setInteractionSeen(value)}
        >
          <SelectTrigger id="food-interaction" className="w-[130px]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bite">Bite</SelectItem>
            <SelectItem value="Smell">Smell</SelectItem>
            <SelectItem value="Touch">Touch</SelectItem>
          </SelectContent>
        </Select>

        <TimeframeSelect
          value={timeframe}
          onValueChange={onTimeframeChange}
        />
      </div>
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
              if (timeframe === "30D") return index % 5 === 0 ? label : "";
              if (timeframe === "6M" || timeframe === "12M")
                return label.split(" ")[0];
              return label;
            }}
          />
          <YAxis />
          <Tooltip
            content={<CustomTooltip timeframe={timeframe} foodInteraction={foodInteraction} />}
          />
          <Line
            type="monotone"
            dataKey="bites"
            stroke="#F97316"
            strokeWidth={2}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  );
};


const CustomTooltip = ({ active, payload, label, timeframe, foodInteraction }: any) => {
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
      <div>{bites}{" "} {foodInteraction === "Bite" && "bites"}
        {foodInteraction === "Smell" && "smells"}
        {foodInteraction === "Touch" && "touches"}
      </div>
    </div>
  );
};
