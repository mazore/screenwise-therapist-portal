
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface MealEntry {
  id: string;
  clientName: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;
  date: string;
  foodItems: string[];
  interventions: string[];
  success: number; // 1-5 rating
}

const mockMealEntries: MealEntry[] = [
  {
    id: "1",
    clientName: "Alex Johnson",
    mealType: "Breakfast",
    time: "8:30 AM",
    date: "2024-04-10",
    foodItems: ["Oatmeal", "Banana", "Milk"],
    interventions: ["Visual prompting", "Positive reinforcement"],
    success: 4
  },
  {
    id: "2",
    clientName: "Sam Torres",
    mealType: "Lunch",
    time: "12:15 PM",
    date: "2024-04-10",
    foodItems: ["Sandwich", "Apple slices", "Yogurt"],
    interventions: ["Food chaining", "Systematic desensitization"],
    success: 3
  },
  {
    id: "3",
    clientName: "Jamie Smith",
    mealType: "Dinner",
    time: "6:00 PM",
    date: "2024-04-10",
    foodItems: ["Pasta", "Broccoli", "Chicken"],
    interventions: ["Modeling", "Reinforcement"],
    success: 5
  },
  {
    id: "4",
    clientName: "Casey Lee",
    mealType: "Snack",
    time: "3:30 PM",
    date: "2024-04-10",
    foodItems: ["Crackers", "Cheese"],
    interventions: ["Food play", "No pressure approach"],
    success: 2
  },
  {
    id: "5",
    clientName: "Riley Wong",
    mealType: "Breakfast",
    time: "9:00 AM",
    date: "2024-04-10",
    foodItems: ["Toast", "Eggs", "Orange juice"],
    interventions: ["Sensory desensitization", "Gradual exposure"],
    success: 4
  }
];

export const MealLogCard = () => {
  const getSuccessBadge = (success: number) => {
    if (success >= 4) return <Badge className="bg-therapy-green">High Success</Badge>;
    if (success >= 3) return <Badge className="bg-yellow-500">Moderate</Badge>;
    return <Badge className="bg-red-500">Needs Support</Badge>;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Today's Meal Logs</CardTitle>
          <CardDescription>
            Track client eating behaviors and interventions
          </CardDescription>
        </div>
        <Button size="sm" className="bg-therapy-green hover:bg-therapy-green/90">
          <Plus className="h-4 w-4 mr-1" /> Add Log
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {mockMealEntries.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-therapy-blue">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{entry.clientName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{entry.mealType}</span>
                        <span>•</span>
                        <span>{entry.time}</span>
                      </div>
                    </div>
                    {getSuccessBadge(entry.success)}
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium">Foods:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.foodItems.map((food, index) => (
                        <Badge key={index} variant="outline" className="bg-therapy-lightBlue text-therapy-blue">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium">Interventions:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.interventions.map((intervention, index) => (
                        <Badge key={index} variant="outline" className="bg-therapy-lightGreen text-therapy-green">
                          {intervention}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
