
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Star } from "lucide-react";

type GoalType = string;
export type Goal = {
  id: string;
  clientName: string;
  type: GoalType;
  starting: number;
  target: number;
  current: number;
  isMain?: boolean;
  displayStarting?: string | number;
  displayTarget?: string | number;
  displayCurrent?: string | number;
  displayUnit?: string;
};

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onMakeMain: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete, onMakeMain }) => {
  const {
    id,
    type,
    isMain,
    displayUnit,
    displayStarting,
    displayTarget,
    displayCurrent
  } = goal;

  // Progress calculation
  let pct: number;
  if (typeof goal.current === "number" && typeof goal.starting === "number" && typeof goal.target === "number") {
    pct = Math.max(0, Math.min(1, (goal.current - goal.starting) / ((goal.target - goal.starting) || 1)));
  } else {
    pct = 0;
  }

  return (
    <Card className="mb-6 shadow transition-shadow hover:shadow-md">
      <CardHeader className="py-3 pb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col flex-1">
          <span className="text-xs text-gray-500 font-medium mb-1">
            Current: <span className="font-semibold">{displayCurrent}</span>{displayUnit && <span className="ml-1">{displayUnit}</span>}
          </span>
          <div className="flex items-center gap-2">
            {isMain ? (
              <Star className="h-4 w-4 text-[#F7B801]" fill="#F7B801" />
            ) : (
              <div className="rounded-full h-4 w-4 bg-[#7E69AB] opacity-40" />
            )}
            <CardTitle className="text-md font-semibold text-[#1A1F2C]">{type}</CardTitle>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-7 w-7 p-0 rounded-full hover:bg-[#EEE6FB]" aria-label="More options">
              <MoreHorizontal className="w-5 h-5 text-[#7E69AB]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-44 z-[110] bg-white shadow-lg border border-[#f3f0fa]">
            <DropdownMenuItem className="gap-2 text-gray-800 hover:bg-[#F3F0FA]" onClick={() => onMakeMain(id)}>
              <Star className="w-4 h-4 text-[#F7B801]" />
              Make Main Goal
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-800" onClick={() => onDelete(id)}>
              <Trash2 className="w-4 h-4 text-red-600" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <span className="text-base font-medium text-gray-600 min-w-[44px]">
            {displayStarting}{displayUnit && <span className="ml-1">{displayUnit}</span>}
          </span>
          <div className="relative flex-1 mx-3">
            <Progress value={pct * 100} className="h-3 bg-[#E5DEFF] shadow-inner" />
          </div>
          <span className="text-base font-medium text-gray-600 min-w-[44px] text-right">
            {displayTarget}{displayUnit && <span className="ml-1">{displayUnit}</span>}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
