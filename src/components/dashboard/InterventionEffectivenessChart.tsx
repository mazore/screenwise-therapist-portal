
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Visual Prompting',
    effectiveness: 85,
  },
  {
    name: 'Food Chaining',
    effectiveness: 72,
  },
  {
    name: 'Positive Reinforcement',
    effectiveness: 94,
  },
  {
    name: 'Sensory Play',
    effectiveness: 68,
  },
  {
    name: 'Modeling',
    effectiveness: 79,
  },
  {
    name: 'Systematic Desensitization',
    effectiveness: 63,
  },
];

export const InterventionEffectivenessChart = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Intervention Effectiveness</CardTitle>
        <CardDescription>Success rate percentage across all clients</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="effectiveness" name="Success Rate (%)" fill="#4B9CD3" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
