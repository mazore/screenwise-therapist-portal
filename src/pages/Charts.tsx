import React, { useState } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { MealDurationChart } from "@/components/dashboard/MealDurationChart";
import { DisruptiveBehaviorChart } from "@/components/dashboard/DisruptiveBehaviorChart";
import { BodyweightChart } from "@/components/dashboard/BodyweightChart";
import { BitesPerMealChart } from "@/components/dashboard/BitesPerMealChart";
import { Button } from "@/components/ui/button";
import { GraphManagerDialog, type Graph } from "@/components/charts/GraphManagerDialog";

import { VolumePerMealChart } from "@/components/dashboard/VolumePerMealChart";
import { VolumePerBiteChart } from "@/components/dashboard/VolumePerBiteChart";

const initialGraphs: Graph[] = [
  { id: "meal-duration", name: "Meal Duration", visible: true },
  { id: "bites-per-meal", name: "Bites Per Meal", visible: true },
  { id: "volume-consumed-per-meal", name: "Volume Consumed Per Meal", visible: false },
  { id: "volume-consumed-per-bite", name: "Volume Consumed Per Bite", visible: false },
  { id: "bodyweight", name: "Bodyweight", visible: true },
  { id: "disruptive-behaviors", name: "Avg. Disruptive Behaviors Per Meal", visible: true },
  { id: "acceptance-percentage", name: "Avg. Acceptance % Per Meal", visible: false },
  { id: "swallowing-percentage", name: "Avg. Swallowing % Per Meal", visible: false },
];

const Charts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [graphs, setGraphs] = useState<Graph[]>(initialGraphs);
  const [timeframes, setTimeframes] = useState<Record<string, string>>({
    "meal-duration": "6W",
    "bites-per-meal": "6W",
    "bodyweight": "6W",
    "disruptive-behaviors": "6W",
    "volume-per-meal": "6W",
    "volume-per-bite": "6W"
  });

  const handleTimeframeChange = (graphId: string, value: string) => {
    setTimeframes((prev) => ({ ...prev, [graphId]: value }));
  };

  const visibleGraphs = graphs.filter((g) => g.visible);

  return (
    <TherapyLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Analytics & Charts</h1>
          <Button onClick={() => setIsDialogOpen(true)}>Add/Remove Graphs</Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleGraphs.map((graph) => {
            const timeframe = timeframes[graph.id] || "6W";
            
            switch (graph.id) {
              case "meal-duration":
                return <MealDurationChart key={graph.id} timeframe={timeframe} onTimeframeChange={(value) => handleTimeframeChange(graph.id, value)} />;
              case "bites-per-meal":
                return <BitesPerMealChart key={graph.id} timeframe={timeframe} onTimeframeChange={(value) => handleTimeframeChange(graph.id, value)} />;
              case "bodyweight":
                return <BodyweightChart key={graph.id} timeframe={timeframe} onTimeframeChange={(value) => handleTimeframeChange(graph.id, value)} />;
              case "disruptive-behaviors":
                return <DisruptiveBehaviorChart key={graph.id} timeframe={timeframe} onTimeframeChange={(value) => handleTimeframeChange(graph.id, value)} />;
              case "volume-consumed-per-meal":
                return <VolumePerMealChart key={graph.id} timeframe={timeframe} onTimeframeChange={(value) => handleTimeframeChange(graph.id, value)} />;
              case "volume-consumed-per-bite":
                return <VolumePerBiteChart key={graph.id} timeframe={timeframe} onTimeframeChange={(value) => handleTimeframeChange(graph.id, value)} />;
              default:
                return null;
            }
          })}
        </div>

        <GraphManagerDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          graphs={graphs}
          onSave={setGraphs}
        />
      </div>
    </TherapyLayout>
  );
};

export default Charts;
