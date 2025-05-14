import React, { useState } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { GoalCard, Goal } from "@/components/goals/GoalCard";
import { useToast } from "@/hooks/use-toast";

const DISRUPTIVE_BEHAVIOR_OPTIONS = [
  "Choking",
  "Gagging",
  "Spitting out food",
  "Refusal to accept food",
  "Coughing",
  "Improper chewing",
  "Assisted feeding",
  "Vomiting",
  "Packing",
  "Other"
];

const GOAL_TYPES = [
  "Meal Duration",
  "Number of Bites per Meal",
  "Volume Consumed per Meal",
  "Volume Consumed per Bite",
  "Bodyweight",
  "Disruptive Behaviors"
] as const;
type GoalType = typeof GOAL_TYPES[number];

const goalUnits: Partial<Record<GoalType, string>> = {
  "Volume Consumed per Meal": "oz",
  "Volume Consumed per Bite": "oz",
  "Bodyweight": "lbs",
  "Disruptive Behaviors": "/week",
  "Number of Bites per Meal": "/meal"
};

const isDuration = (type: string) => type === "Meal Duration";
const isDisruptiveBehavior = (type: string) => type === "Disruptive Behaviors";

function pad(num: number) {
  return num.toString().padStart(2, '0');
}
function durationToString(min: string, sec: string) {
  return `${pad(Number(min) || 0)}:${pad(Number(sec) || 0)}`;
}
function parseDuration(str: string) {
  if (!str) return { min: "", sec: "" };
  const [min, sec] = str.split(":");
  return {
    min: min || "",
    sec: sec || "",
  };
}
function durationAsNumber(min: string, sec: string) {
  return Number(min) * 60 + Number(sec);
}
function numberToDuration(value: number) {
  const min = Math.floor(value / 60);
  const sec = value % 60;
  return {
    min: min.toString(),
    sec: sec.toString().padStart(2, "0"),
  };
}

const mockClientGoals: Goal[] = [
  {
    id: "g1",
    clientName: "Client #1",
    type: "Meal Duration",
    starting: 12 * 60,
    target: 18 * 60,
    current: 15 * 60
  },
  {
    id: "g2",
    clientName: "Client #8",
    type: "Bodyweight",
    starting: 104,
    target: 120,
    current: 112
  },
  {
    id: "g3",
    clientName: "Client #1",
    type: "Number of Bites per Meal",
    starting: 8,
    target: 15,
    current: 11
  }
];

function Goals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>(mockClientGoals);
  const [mainGoalId, setMainGoalId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [goalType, setGoalType] = useState<GoalType | "">("");
  const [starting, setStarting] = useState("");
  const [startingSec, setStartingSec] = useState("");
  const [target, setTarget] = useState("");
  const [targetSec, setTargetSec] = useState("");
  const [clientName] = useState("Client #1");
  const [disruptiveBehaviorMode, setDisruptiveBehaviorMode] = useState<"all" | "specific">("all");
  const [selectedDisruptiveBehavior, setSelectedDisruptiveBehavior] = useState<string>("");

  function openAddDialog() {
    setGoalType("");
    setStarting("");
    setStartingSec("");
    setTarget("");
    setTargetSec("");
    setDisruptiveBehaviorMode("all");
    setSelectedDisruptiveBehavior("");
    setDialogOpen(true);
  }

  function handleSaveGoal() {
    let sValue: number, tValue: number;
    if (goalType === "") return;

    if (isDuration(goalType)) {
      if (!starting || !startingSec || !target || !targetSec) return;
      if (isNaN(Number(starting)) || isNaN(Number(startingSec)) || isNaN(Number(target)) || isNaN(Number(targetSec))) return;
      sValue = durationAsNumber(starting, startingSec);
      tValue = durationAsNumber(target, targetSec);
    } else {
      if (!starting || !target || isNaN(Number(starting)) || isNaN(Number(target))) return;
      sValue = Number(starting);
      tValue = Number(target);
    }

    if (isDisruptiveBehavior(goalType) && disruptiveBehaviorMode === "specific" && selectedDisruptiveBehavior === "") {
      toast({
        title: "Please specify a disruptive behavior type",
        description: "You must select a disruptive behavior option."
      });
      return;
    }

    setGoals(prevGoals => [
      ...prevGoals,
      {
        id: "g" + (Math.random() + "").slice(2, 8),
        clientName,
        type: goalType as GoalType,
        starting: sValue,
        target: tValue,
        current: sValue,
        ...(isDisruptiveBehavior(goalType)
          ? {
              specificDisruptiveBehavior:
                disruptiveBehaviorMode === "specific"
                  ? selectedDisruptiveBehavior
                  : undefined,
              disruptiveBehaviorMode
            }
          : {})
      }
    ]);
    
    toast({
      title: "Goal Created",
      description: "Your new goal has been created successfully."
    });

    setDialogOpen(false);
  }

  function handleDeleteGoal(id: string) {
    setGoals(goals => goals.filter(g => g.id !== id));
    if (mainGoalId === id) setMainGoalId(null);
    toast({
      title: "Goal Deleted",
      description: "The goal has been removed."
    });
  }

  function handleMakeMainGoal(id: string) {
    setMainGoalId(id);
    toast({
      title: "Main Goal Set",
      description: "The selected goal is now your main goal."
    });
  }

  React.useEffect(() => {
    if (!dialogOpen) {
      const timer = setTimeout(() => {
        setGoalType("");
        setStarting("");
        setStartingSec("");
        setTarget("");
        setTargetSec("");
        setDisruptiveBehaviorMode("all");
        setSelectedDisruptiveBehavior("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [dialogOpen]);

  const goalsWithMain = goals.map((g) => {
    const _unit = (() => {
      if (isDisruptiveBehavior(g.type)) return "/week";
      if (g.type === "Number of Bites per Meal") return "/meal";
      return goalUnits[g.type as GoalType] || "";
    })();
    const _isDuration = isDuration(g.type);
    const _isDisruptiveBehavior = isDisruptiveBehavior(g.type);

    let pct;
    if (_isDisruptiveBehavior) {
      pct =
        typeof g.current === "number" && typeof g.starting === "number" && typeof g.target === "number"
          ? 1 - Math.max(0, Math.min(1, (g.current - g.target) / ((g.starting - g.target) || 1)))
          : 0;
    } else {
      pct =
        typeof g.current === "number" && typeof g.starting === "number" && typeof g.target === "number"
          ? Math.max(0, Math.min(1, (g.current - g.starting) / ((g.target - g.starting) || 1)))
          : 0;
    }

    let displayLabel = g.type;
    if (_isDisruptiveBehavior && (g as any).specificDisruptiveBehavior) {
      displayLabel = (g as any).specificDisruptiveBehavior;
    }

    let displayGoal: any = { ...g };
    if (_isDuration) {
      displayGoal.displayStarting = durationToString(numberToDuration(g.starting).min, numberToDuration(g.starting).sec);
      displayGoal.displayTarget = durationToString(numberToDuration(g.target).min, numberToDuration(g.target).sec);
      displayGoal.displayCurrent = durationToString(numberToDuration(g.current).min, numberToDuration(g.current).sec);
      displayGoal.displayUnit = "";
    } else {
      displayGoal.displayStarting = g.starting;
      displayGoal.displayTarget = g.target;
      displayGoal.displayCurrent = g.current;
      displayGoal.displayUnit = _unit;
    }

    return {
      ...displayGoal,
      isMain: mainGoalId === g.id,
      _unit,
      _isDuration,
      _isDisruptiveBehavior,
      displayLabel,
      pct
    };
  });

  function renderGoalEntryFields() {
    if (isDuration(goalType)) {
      return (
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={starting}
            min={0}
            max={59}
            placeholder="mm"
            onChange={e => setStarting(e.target.value.replace(/\D/g, ""))}
            className="w-16"
          />
          <span className="font-semibold">:</span>
          <Input
            type="number"
            value={startingSec}
            min={0}
            max={59}
            placeholder="ss"
            onChange={e => setStartingSec(e.target.value.replace(/\D/g, ""))}
            className="w-16"
          />
          <span className="mx-2 text-gray-500">to</span>
          <Input
            type="number"
            value={target}
            min={0}
            max={59}
            placeholder="mm"
            onChange={e => setTarget(e.target.value.replace(/\D/g, ""))}
            className="w-16"
          />
          <span className="font-semibold">:</span>
          <Input
            type="number"
            value={targetSec}
            min={0}
            max={59}
            placeholder="ss"
            onChange={e => setTargetSec(e.target.value.replace(/\D/g, ""))}
            className="w-16"
          />
        </div>
      );
    }

    if (isDisruptiveBehavior(goalType)) {
      return (
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Track:</div>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  checked={disruptiveBehaviorMode === "all"}
                  onChange={() => {
                    setDisruptiveBehaviorMode("all");
                    setSelectedDisruptiveBehavior("");
                  }}
                  className="accent-[#7E69AB] h-4 w-4"
                  name="disBehaviorMode"
                />
                <span className="">All Disruptive Behaviors</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  checked={disruptiveBehaviorMode === "specific"}
                  onChange={() => setDisruptiveBehaviorMode("specific")}
                  className="accent-[#7E69AB] h-4 w-4"
                  name="disBehaviorMode"
                />
                <span>Specific Disruptive Behavior</span>
              </label>
            </div>
            {disruptiveBehaviorMode === "specific" && (
              <div className="mt-2">
                <Select
                  value={selectedDisruptiveBehavior}
                  onValueChange={setSelectedDisruptiveBehavior}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select behavior"/>
                  </SelectTrigger>
                  <SelectContent>
                    {DISRUPTIVE_BEHAVIOR_OPTIONS.map(behavior => (
                      <SelectItem key={behavior} value={behavior}>
                        {behavior}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex space-x-2 items-center">
            <Input
              type="number"
              value={starting}
              min={0}
              placeholder="Starting Point"
              onChange={e => setStarting(e.target.value)}
              className="w-32"
            />
            <span className="text-base font-medium text-gray-500">/week</span>
            <span className="mx-2 text-gray-500">to</span>
            <Input
              type="number"
              value={target}
              min={0}
              placeholder="Goal Target"
              onChange={e => setTarget(e.target.value)}
              className="w-32"
            />
            <span className="text-base font-medium text-gray-500">/week</span>
          </div>
        </div>
      );
    }

    const unit = goalType && goalUnits[goalType as GoalType] ? goalUnits[goalType as GoalType] : "";

    return (
      <div className="flex space-x-2 items-center">
        <Input
          type="number"
          value={starting}
          min={0}
          placeholder="Starting Point"
          onChange={e => setStarting(e.target.value)}
          className="w-32"
        />
        {unit && <span className="ml-1 font-semibold text-gray-500">{unit}</span>}
        <span className="mx-2 text-gray-500">to</span>
        <Input
          type="number"
          value={target}
          min={0}
          placeholder="Goal Target"
          onChange={e => setTarget(e.target.value)}
          className="w-32"
        />
        {unit && <span className="ml-1 font-semibold text-gray-500">{unit}</span>}
      </div>
    );
  }

  return (
    <TherapyLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1A1F2C]">Client Goals</h1>
            <p className="text-muted-foreground text-base">Track Progress Towards Specified Targets</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#7E69AB] hover:bg-[#6E59A5] text-white" onClick={openAddDialog}>
                <span className="text-xl leading-none">+</span>
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogDescription>
                  Create a new goal for client progress tracking.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <Select value={goalType} onValueChange={(val) => setGoalType(val as GoalType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
                {renderGoalEntryFields()}
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-[#7E69AB] text-white hover:bg-[#6E59A5]"
                  onClick={handleSaveGoal}
                  disabled={
                    !goalType ||
                    (isDuration(goalType)
                      ? (!starting || !startingSec || !target || !targetSec || isNaN(Number(starting)) || isNaN(Number(startingSec)) || isNaN(Number(target)) || isNaN(Number(targetSec)))
                      : isDisruptiveBehavior(goalType)
                        ? (!starting || !target || isNaN(Number(starting)) || isNaN(Number(target)) ||
                            (disruptiveBehaviorMode === "specific" && !selectedDisruptiveBehavior)
                          )
                        : (!starting || !target || isNaN(Number(starting)) || isNaN(Number(target)))
                    )
                  }
                >
                  Add Goal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          {goalsWithMain.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 border border-dashed rounded-lg">
              <span className="mx-auto h-12 w-12 flex items-center justify-center text-muted-foreground opacity-50 mb-2">
                <svg width={32} height={32} fill="none"><circle cx={16} cy={16} r={14} stroke="#DDD6F3" strokeWidth={4} /></svg>
              </span>
              <p className="text-lg font-medium">No goals created yet</p>
              <p className="text-sm text-muted-foreground">Add your first goal to start tracking progress</p>
            </div>
          ) : (
            goalsWithMain.map(goal => (
              <GoalCard
                key={goal.id}
                goal={{
                  ...goal,
                  type: goal.displayLabel,
                  displayStarting: goal.displayStarting,
                  displayTarget: goal.displayTarget,
                  displayCurrent: goal.displayCurrent,
                  displayUnit: goal.displayUnit,
                  pct: goal.pct,
                  isMain: goal.isMain
                }}
                onDelete={handleDeleteGoal}
                onMakeMain={handleMakeMainGoal}
              />
            ))
          )}
        </div>
      </div>
    </TherapyLayout>
  );
}

export default Goals;
