
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const data = [
  {
    week: 'Week 1',
    Alex: 2,
    Jamie: 1,
    Riley: 3,
    Casey: 1,
  },
  {
    week: 'Week 2',
    Alex: 3,
    Jamie: 2,
    Riley: 4,
    Casey: 2,
  },
  {
    week: 'Week 3',
    Alex: 3,
    Jamie: 3,
    Riley: 3,
    Casey: 3,
  },
  {
    week: 'Week 4',
    Alex: 4,
    Jamie: 3,
    Riley: 5,
    Casey: 4,
  },
  {
    week: 'Week 5',
    Alex: 5,
    Jamie: 4,
    Riley: 5,
    Casey: 3,
  },
  {
    week: 'Week 6',
    Alex: 4,
    Jamie: 5,
    Riley: 4,
    Casey: 4,
  },
];

export const ClientProgressChart = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Client Progress</CardTitle>
          <CardDescription>Weekly success rating (1-5 scale)</CardDescription>
        </div>
        <Select defaultValue="6weeks">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4weeks">4 weeks</SelectItem>
            <SelectItem value="6weeks">6 weeks</SelectItem>
            <SelectItem value="3months">3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Alex" stroke="#4B9CD3" activeDot={{ r: 8 }} strokeWidth={2} connectNulls={true} />
            <Line type="monotone" dataKey="Jamie" stroke="#57B894" activeDot={{ r: 8 }} strokeWidth={2} connectNulls={true} />
            <Line type="monotone" dataKey="Riley" stroke="#9B66D7" activeDot={{ r: 8 }} strokeWidth={2} connectNulls={true} />
            <Line type="monotone" dataKey="Casey" stroke="#F97316" activeDot={{ r: 8 }} strokeWidth={2} connectNulls={true} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
