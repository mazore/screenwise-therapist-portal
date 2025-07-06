import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TimeframeSelect } from "@/components/charts/TimeframeSelect";
import { useClientData } from "@/hooks/useClientData";
import { STATS_TIME_MODES } from "@/lib/utils";
import moment from "moment";

interface DisruptiveBehaviorChartProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export const DisruptiveBehaviorChart = ({ timeframe, onTimeframeChange }: DisruptiveBehaviorChartProps) => {
  const { clientData } = useClientData();
  const mealHistory = clientData?.mealHistory || [];
  const [chartData, setChartData] = useState([]);
  const [behaviorKeys, setBehaviorKeys] = useState<string[]>([]);

  useEffect(() => {
    const timeMode = STATS_TIME_MODES.find((mode) => mode.label === timeframe);
    if (!timeMode) return;

    // Build time buckets using the same logic as other charts
    let buckets = [];
    if (timeMode.resolution === "month") {
      buckets = Array.from({ length: timeMode.amount }).map((_, i) => {
        const start = moment().startOf("month").subtract(timeMode.amount - 1 - i, "months");
        return {
          label: start.format("MMM YYYY"),
          startTime: start.unix(),
          endTime: moment(start).endOf("month").unix(),
        };
      });
    } else if (timeMode.resolution === "week") {
      buckets = Array.from({ length: timeMode.amount }).map((_, i) => {
        const start = moment().startOf("isoWeek").subtract(timeMode.amount - 1 - i, "weeks");
        return {
          label: timeMode.getLabel ? timeMode.getLabel(start) : `${start.format("MMM D")} – ${moment(start).endOf("isoWeek").format("MMM D")}`,
          startTime: start.unix(),
          endTime: moment(start).endOf("isoWeek").unix(),
          rangeLabel: `${start.format("MMM D")} – ${moment(start).endOf("isoWeek").format("MMM D")}`,
        };
      });
    } else if (timeMode.resolution === "day") {
      buckets = Array.from({ length: timeMode.amount }).map((_, i) => {
        const start = moment().startOf("day").subtract(timeMode.amount - 1 - i, "days");
        return {
          label: start.format("MMM D"),
          startTime: start.unix(),
          endTime: moment(start).endOf("day").unix(),
        };
      });
    }

    // Collect all possible disruptive behavior keys
    const allBehaviorSet = new Set<string>();
    // Prepare chart data: one object per bucket, each with an average for each behavior
    const bucketData = buckets.map((bucket) => {
      const behaviors: Record<string, number[]> = {};
      for (const meal of mealHistory) {
        const mealTime = meal.mealStartTime ? meal.mealStartTime / 1000 : null;
        if (
          mealTime &&
          mealTime >= bucket.startTime &&
          mealTime <= bucket.endTime &&
          meal.disruptiveBehaviorRatings &&
          typeof meal.disruptiveBehaviorRatings === "object"
        ) {
          Object.entries(meal.disruptiveBehaviorRatings).forEach(([behavior, rating]) => {
            if (typeof rating === "number" && rating > 0) {
              allBehaviorSet.add(behavior);
              if (!behaviors[behavior]) behaviors[behavior] = [];
              behaviors[behavior].push(rating);
            }
          });
        }
      }
      // For each behavior, average all ratings for this bucket (max 10)
      const behaviorAverages: Record<string, number> = {};
      Object.entries(behaviors).forEach(([behavior, arr]) => {
        const avg = arr.length ? Math.min(10, Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10) : 0;
        behaviorAverages[behavior] = avg;
      });
      return {
        date: bucket.label,
        startTime: bucket.startTime,
        endTime: bucket.endTime,
        rangeLabel: bucket.rangeLabel || bucket.label,
        ...behaviorAverages,
      };
    });

    setChartData(bucketData);
    setBehaviorKeys(Array.from(allBehaviorSet));
  }, [timeframe, mealHistory]);

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
        {/* Legend/Key */}
        {behaviorKeys.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-2">
            {behaviorKeys.map((behavior, idx) => (
              <div key={behavior} className="flex items-center space-x-2">
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    backgroundColor: barColor(idx),
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
                <span className="text-xs">{behavior}</span>
              </div>
            ))}
          </div>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ left: 10, right: 10 }}
          >
            <XAxis
              dataKey="date"
              interval={0}
              padding={{ right: 20 }}
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
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip behaviorKeys={behaviorKeys} timeframe={timeframe} />} />
            {behaviorKeys.map((behavior, idx) => (
              <Bar
                key={behavior}
                dataKey={behavior}
                stackId="a"
                fill={barColor(idx)}
                name={behavior}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Improved color palette: orange, green, blue, red, yellow, purple, indigo, then others
function barColor(idx: number) {
  const palette = [
    "#F97316", // orange
    "#6366F1", // indigo
    "#F43F5E", // red
    "#9B66D7", // purple
    "#10B981", // green
    "#FACC15", // yellow
    //"#4B9CD3", // blue
    "#22D3EE", // cyan
    "#A3A3A3", // gray
    "#E11D48", // rose
    "#84CC16", // lime
    "#F59E42", // amber
    "#3B82F6", // sky blue
    "#7C3AED", // violet
    "#F472B6", // light pink
    "#FDE68A", // light yellow
  ];
  return palette[idx % palette.length];
}

const CustomTooltip = ({ active, payload, label, timeframe, behaviorKeys }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  let labelContent;
  if (timeframe === '6W' || timeframe === '12W') {
    const start = data.startTime ? new Date(data.startTime * 1000) : null;
    const end = data.endTime ? new Date(data.endTime * 1000) : null;
    labelContent =
      start && end ? `${formatDate(start)} – ${formatDate(end)}` : label;
  } else {
    labelContent = data.rangeLabel || label;
  }

  // Reverse the order of behaviorKeys for tooltip display
  const reversedKeys = [...behaviorKeys].reverse();

  return (
    <div className="rounded bg-white p-2 shadow-md border text-sm">
      <div className="font-semibold">{labelContent}</div>
      {reversedKeys.map((behavior) =>
        data[behavior] !== undefined && data[behavior] !== 0 ? (
          <div key={behavior}>
            <span className="font-semibold">{behavior}</span>: {data[behavior]}
          </div>
        ) : null
      )}
    </div>
  );
};
