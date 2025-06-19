import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DisruptiveBehavior {
  key: string;          // internal unique key – not exposed to parent
  label: string;        // human‑readable name
  custom?: boolean;     // marks "Other" slots
}

const INITIAL_BEHAVIORS: DisruptiveBehavior[] = [
  { key: "choking", label: "Choking" },
  { key: "gagging", label: "Gagging" },
  { key: "spitting", label: "Spitting out food" },
  { key: "refusal", label: "Refusal to accept food" },
  { key: "coughing", label: "Coughing" },
  { key: "improperChewing", label: "Improper chewing" },
  { key: "assistedFeeding", label: "Assisted feeding" },
  { key: "vomiting", label: "Vomiting" },
  { key: "packing", label: "Packing" },
  { key: "notSittingAtTable", label: "Not sitting at the table" },
  { key: "other1", label: "Other", custom: true },
];

type Props = {
  selectedBehaviors: string[];
  setSelectedBehaviors: React.Dispatch<React.SetStateAction<string[]>>;
};

const DisruptiveBehaviorsCheckboxes: React.FC<Props> = ({
  selectedBehaviors,
  setSelectedBehaviors,
}) => {
  const [behaviors, setBehaviors] = useState<DisruptiveBehavior[]>(INITIAL_BEHAVIORS);
  const [customChecked, setCustomChecked] = useState<Record<string, boolean>>({});
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  if (!selectedBehaviors || !setSelectedBehaviors) {
    return null; // Ensure props are provided
  }

  // Determines if a box is checked
  const isChecked = (b: DisruptiveBehavior) => {
    return b.custom ? !!customChecked[b.key] : selectedBehaviors.includes(b.label);
  };

  // Toggle any checkbox
  const handleToggle = (behavior: DisruptiveBehavior, checked: boolean) => {
    if (behavior.custom) {
      setCustomChecked((prev) => ({ ...prev, [behavior.key]: checked }));

      if (!checked) {
        // Remove any stored value when un‑checking
        const value = customValues[behavior.key];
        setSelectedBehaviors((prev) => prev.filter((v) => v !== value));
        setCustomValues((prev) => {
          const copy = { ...prev };
          delete copy[behavior.key];
          return copy;
        });
      } else {
        // Add next "Other" slot the first time this one is ticked
        const number = parseInt(behavior.key.replace("other", "")) || 1;
        const nextKey = `other${number + 1}`;
        if (!behaviors.some((b) => b.key === nextKey)) {
          setBehaviors((prev) => [...prev, { key: nextKey, label: "Other", custom: true }]);
        }
      }
      return;
    }

    // Regular (built‑in) behaviors
    setSelectedBehaviors((prev) => {
      if (checked) {
        return prev.includes(behavior.label) ? prev : [...prev, behavior.label];
      }
      return prev.filter((v) => v !== behavior.label);
    });
  };

  // Handle typing inside an "Other" text input
  const handleCustomInput = (behaviorKey: string, value: string) => {
    const oldValue = customValues[behaviorKey] ?? "";
    setCustomValues((prev) => ({ ...prev, [behaviorKey]: value }));

    setSelectedBehaviors((prev) => {
      const withoutOld = oldValue ? prev.filter((v) => v !== oldValue) : prev;
      if (value.trim() === "") return withoutOld;
      return withoutOld.includes(value.trim()) ? withoutOld : [...withoutOld, value.trim()];
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disruptive Behaviors Tracked</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {behaviors.map((behavior) => (
          <div key={behavior.key} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`behavior-${behavior.key}`}
                checked={isChecked(behavior)}
                onCheckedChange={(c) => handleToggle(behavior, c === true)}
              />
              <Label
                htmlFor={`behavior-${behavior.key}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {behavior.label}
              </Label>
            </div>

            {behavior.custom && isChecked(behavior) && (
              <Input
                placeholder="Specify other behavior"
                value={customValues[behavior.key] || ""}
                onChange={(e) => handleCustomInput(behavior.key, e.target.value)}
                className="mt-2 ml-6"
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DisruptiveBehaviorsCheckboxes;
