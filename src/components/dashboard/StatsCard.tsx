
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon,
  change
}: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center">
          <CardDescription className="text-xs text-muted-foreground">
            {description}
          </CardDescription>
          {change && (
            <span 
              className={`text-xs font-medium ml-2 ${
                change.positive ? "text-therapy-green" : "text-red-500"
              }`}
            >
              {change.positive ? "+" : ""}{change.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
