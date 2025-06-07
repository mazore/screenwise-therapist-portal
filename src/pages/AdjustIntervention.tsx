import React, { useState } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useClientData } from "@/hooks/useClientData";
import { useMsal } from "@azure/msal-react";
import { API_URL } from "@/lib/constants";

interface Level {
  bites: number;
  rewardTime: string;
  sessionsToAdvance: number;
}

interface DisruptiveBehavior {
  id: string;
  label: string;
  custom?: boolean;
  value?: string;
}

interface KeyCircumstance {
  id: string;
  label: string;
}

const AdjustIntervention = () => {
  const { accounts, instance } = useMsal();
  const isMobile = useIsMobile();
  const [operationalDefinition, setOperationalDefinition] = useState("");
  const [successRating, setSuccessRating] = useState(7);
  const [chewingInterval, setChewingInterval] = useState(30);
  const [targetBehaviorWording, setTargetBehaviorWording] = useState("Bite");
  const [targetBehaviorPromptWording, setTargetBehaviorPromptWording] = useState("");
  const [levels, setLevels] = useState<Level[]>([{
    bites: 5,
    rewardTime: "00:30",
    sessionsToAdvance: 3
  }, {
    bites: 10,
    rewardTime: "01:00",
    sessionsToAdvance: 3
  }, {
    bites: 15,
    rewardTime: "01:30",
    sessionsToAdvance: 3
  }, {
    bites: 20,
    rewardTime: "02:00",
    sessionsToAdvance: 3
  }, {
    bites: 25,
    rewardTime: "02:30",
    sessionsToAdvance: 3
  }]);
  // const [finalRewardTime, setFinalRewardTime] = useState(6);
  // const [weightLogFrequency, setWeightLogFrequency] = useState("Weekly");
  const [allowCaregiverOverride, setAllowCaregiverOverride] = useState(false);
  const [enableSwallowConfirm, setEnableSwallowConfirm] = useState(false);
  // const [intervalWording, setIntervalWording] = useState("Chew");
  // const [trackAcceptance, setTrackAcceptance] = useState(false);
  // const [trackSwallowing, setTrackSwallowing] = useState(false);

  const [disruptiveBehaviors, setDisruptiveBehaviors] = useState<DisruptiveBehavior[]>([
    { id: "choking", label: "Choking" },
    { id: "gagging", label: "Gagging" },
    { id: "spittingOutFood", label: "Spitting out food" },
    { id: "refusalToAcceptFood", label: "Refusal to accept food" },
    { id: "coughing", label: "Coughing" },
    { id: "improperChewing", label: "Improper chewing" },
    { id: "assistedFeeding", label: "Assisted feeding" },
    { id: "vomiting", label: "Vomiting" },
    { id: "packing", label: "Packing" },
    { id: "notSittingAtTable", label: "Not sitting at the table" },
    { id: "other", label: "Other", custom: true }
  ]);

  // const [keyCircumstances, setKeyCircumstances] = useState<KeyCircumstance[]>([
  //   { id: "SICKNESS", label: "Sickness" },
  //   { id: "NON_ROUTINE_SETTING", label: "Non-routine setting" },
  //   { id: "NEW_MEDICATION", label: "New medication" },
  // ]);

  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [selectedCircumstances, setSelectedCircumstances] = useState<string[]>([]);

  const [behaviorCustomValues, setBehaviorCustomValues] = useState<Record<string, string>>({});
  const [circumstanceCustomValues, setCircumstanceCustomValues] = useState<Record<string, string>>({});

  const { therapistData, selectedClient } = useClientData();

  // This is a helper function to make API calls automatically including clientUserId and clientProfile
  const makeAPICall = React.useCallback((endpoint: string, additionalBodyItems: object) => {
    return instance.acquireTokenSilent({scopes: ['openid', 'profile'], account: accounts[0]})
      .then((tokenResponse) => {
        return fetch(API_URL + endpoint, {
          method: 'POST',
          headers: {'Authorization': 'Bearer ' + tokenResponse.idToken},
          body: JSON.stringify({
            clientProfile: selectedClient,
            clientUserId: therapistData.clients[selectedClient].userId,
            ...additionalBodyItems
          })
        })
      })
      .then((apiResponse) => apiResponse.json())
  }, [accounts, instance, selectedClient, therapistData]);

  // Testing backend endpoint
  React.useEffect(() => {
    const endpoint = 'therapist_set_progression_uuid';
    makeAPICall(endpoint, { progressionUuid: '870d964f-678c-4c66-9c89-a0d0ef85b817' })
      .then((responseJSON) => console.log(`Testing response from backend (/${endpoint}):`, responseJSON));
  }, [accounts, instance, selectedClient, therapistData, makeAPICall]);

  const addLevel = () => {
    if (levels.length < 10) {
      const lastLevel = levels[levels.length - 1];
      const newLevel = {
        bites: lastLevel.bites + 5,
        rewardTime: `0${Math.floor(lastLevel.bites / 2)}:30`,
        sessionsToAdvance: lastLevel.sessionsToAdvance
      };
      setLevels([...levels, newLevel]);
    }
  };

  const removeLevel = () => {
    if (levels.length > 1) {
      setLevels(levels.slice(0, -1));
    }
  };

  const handleLevelChange = (index: number, field: keyof Level, value: string | number) => {
    const newLevels = [...levels];
    if (field === "rewardTime" && typeof value === "string") {
      newLevels[index].rewardTime = value;
    } else if (field === "bites" && typeof value === "number") {
      newLevels[index].bites = value;
    } else if (field === "sessionsToAdvance" && typeof value === "number") {
      newLevels[index].sessionsToAdvance = value;
    } else if (field === "bites" && typeof value === "string") {
      newLevels[index].bites = parseInt(value) || 0;
    } else if (field === "sessionsToAdvance" && typeof value === "string") {
      newLevels[index].sessionsToAdvance = parseInt(value) || 0;
    }
    setLevels(newLevels);
  };

  const handleBehaviorChange = (behaviorId: string, checked: boolean) => {
    if (checked) {
      setSelectedBehaviors([...selectedBehaviors, behaviorId]);

      const behavior = disruptiveBehaviors.find(b => b.id === behaviorId);
      if (behavior?.custom) {
        const otherNumber = parseInt(behaviorId.replace("other", "")) || 1;
        const nextOtherId = `other${otherNumber + 1}`;

        if (!disruptiveBehaviors.some(b => b.id === nextOtherId)) {
          setDisruptiveBehaviors([
            ...disruptiveBehaviors,
            { id: nextOtherId, label: `Other ${otherNumber + 1}`, custom: true }
          ]);
        }
      }
    } else {
      setSelectedBehaviors(selectedBehaviors.filter(id => id !== behaviorId));

      // Clean up custom values when unchecking
      if (behaviorId.startsWith("other")) {
        // Remove the custom value for this ID
        const newCustomValues = { ...behaviorCustomValues };
        delete newCustomValues[behaviorId];
        setBehaviorCustomValues(newCustomValues);

        // Clean up any "other" items after this one
        const otherNumber = parseInt(behaviorId.replace("other", "")) || 1;

        // Find the highest selected "other" behavior
        const highestSelectedOther = selectedBehaviors
          .filter(id => id.startsWith("other") && id !== behaviorId)
          .map(id => parseInt(id.replace("other", "")) || 1)
          .reduce((max, num) => Math.max(max, num), 0);

        // Keep only behaviors up to the highest selected one, plus one more for the next addition
        if (highestSelectedOther > 0) {
          setDisruptiveBehaviors(disruptiveBehaviors.filter(b => {
            if (b.id.startsWith("other")) {
              const num = parseInt(b.id.replace("other", "")) || 1;
              return num <= highestSelectedOther + 1;
            }
            return true;
          }));
        } else {
          // If no others are selected, just keep the first "other" option
          setDisruptiveBehaviors(disruptiveBehaviors.filter(b => {
            if (b.id.startsWith("other")) {
              const num = parseInt(b.id.replace("other", "")) || 1;
              return num <= 1;
            }
            return true;
          }));
        }
      }
    }
  };

  // const handleCircumstanceChange = (circumstanceId: string, checked: boolean) => {
  //   if (checked) {
  //     setSelectedCircumstances([...selectedCircumstances, circumstanceId]);

  //     const circumstance = keyCircumstances.find(c => c.id === circumstanceId);
  //     if (circumstance?.custom) {
  //       const otherNumber = parseInt(circumstanceId.replace("other", "")) || 1;
  //       const nextOtherId = `other${otherNumber + 1}`;

  //       if (!keyCircumstances.some(c => c.id === nextOtherId)) {
  //         setKeyCircumstances([
  //           ...keyCircumstances,
  //           { id: nextOtherId, label: `Other ${otherNumber + 1}`, custom: true }
  //         ]);
  //       }
  //     }
  //   } else {
  //     setSelectedCircumstances(selectedCircumstances.filter(id => id !== circumstanceId));

  //     // Clean up custom values when unchecking
  //     if (circumstanceId.startsWith("other")) {
  //       // Remove the custom value for this ID
  //       const newCustomValues = { ...circumstanceCustomValues };
  //       delete newCustomValues[circumstanceId];
  //       setCircumstanceCustomValues(newCustomValues);

  //       // Clean up any "other" items after this one
  //       const otherNumber = parseInt(circumstanceId.replace("other", "")) || 1;

  //       // Find the highest selected "other" circumstance
  //       const highestSelectedOther = selectedCircumstances
  //         .filter(id => id.startsWith("other") && id !== circumstanceId)
  //         .map(id => parseInt(id.replace("other", "")) || 1)
  //         .reduce((max, num) => Math.max(max, num), 0);

  //       // Keep only circumstances up to the highest selected one, plus one more for the next addition
  //       if (highestSelectedOther > 0) {
  //         setKeyCircumstances(keyCircumstances.filter(c => {
  //           if (c.id.startsWith("other")) {
  //             const num = parseInt(c.id.replace("other", "")) || 1;
  //             return num <= highestSelectedOther + 1;
  //           }
  //           return true;
  //         }));
  //       } else {
  //         // If no others are selected, just keep the first "other" option
  //         setKeyCircumstances(keyCircumstances.filter(c => {
  //           if (c.id.startsWith("other")) {
  //             const num = parseInt(c.id.replace("other", "")) || 1;
  //             return num <= 1;
  //           }
  //           return true;
  //         }));
  //       }
  //     }
  //   }
  // };

  const handleCustomValueChange = (
    id: string,
    value: string,
    isCircumstance: boolean
  ) => {
    if (isCircumstance) {
      setCircumstanceCustomValues({...circumstanceCustomValues, [id]: value});
    } else {
      setBehaviorCustomValues({...behaviorCustomValues, [id]: value});
    }
  };

  return (
    <TherapyLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">Adjust Intervention</h1>

        <Card>
          <CardHeader>
            <CardTitle>Intervention Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="operational-definition">
                Operational Definition of Successful Meal
              </Label>
              <Textarea
                id="operational-definition"
                value={operationalDefinition}
                onChange={e => setOperationalDefinition(e.target.value)}
                placeholder="Enter the operational definition..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Progression Levels</h3>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={removeLevel}
                    disabled={levels.length <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={addLevel}
                    disabled={levels.length >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {levels.map((level, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                    <div className="space-y-2">
                      <Label htmlFor={`bites-${index}`}>
                        Level {index + 1}: Number of Bites
                      </Label>
                      <Input
                        id={`bites-${index}`}
                        type="number"
                        value={level.bites}
                        onChange={e => handleLevelChange(index, "bites", e.target.value)}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`reward-${index}`}>Reward Time (MM:SS)</Label>
                      <Input
                        id={`reward-${index}`}
                        type="text"
                        value={level.rewardTime}
                        onChange={e => handleLevelChange(index, "rewardTime", e.target.value)}
                        pattern="[0-9]{2}:[0-9]{2}"
                        placeholder="00:00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`sessions-${index}`}>Sessions to Advance</Label>
                      <Input
                        id={`sessions-${index}`}
                        type="number"
                        value={level.sessionsToAdvance}
                        onChange={e => handleLevelChange(index, "sessionsToAdvance", parseInt(e.target.value) || 0)}
                        min={1}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Success Rating Needed to Advance ({successRating}/10)</Label>
                <Slider
                  value={[successRating]}
                  onValueChange={value => setSuccessRating(value[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="caregiver-override"
                checked={allowCaregiverOverride}
                onCheckedChange={checked => setAllowCaregiverOverride(checked === true)}
              />
              <Label
                htmlFor="caregiver-override"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow caregiver to override progression advancement
              </Label>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="swallow-confirm"
                checked={enableSwallowConfirm}
                onCheckedChange={checked => setEnableSwallowConfirm(checked === true)}
              />
              <Label
                htmlFor="swallow-confirm"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable ‘Swallow & Mouth Clear’ confirmation after each bite
              </Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="interval">Chewing Interval (seconds)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="interval"
                    type="number"
                    value={chewingInterval}
                    onChange={e => setChewingInterval(parseInt(e.target.value) || 0)}
                    min={1}
                    className="w-32"
                  />
                  {/* <div className="flex items-center space-x-2">
                    <Label htmlFor="interval-wording">Interval Wording:</Label>
                    <select
                      id="interval-wording"
                      value={intervalWording}
                      onChange={e => setIntervalWording(e.target.value)}
                      className="border border-input rounded-md px-2 py-1 text-sm"
                    >
                      <option value="Chew">Chew</option>
                      <option value="Swallow">Swallow</option>
                    </select>
                  </div> */}
                </div>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="weight-log-frequency">Weight Log Notification Frequency</Label>
                <Select
                  value={weightLogFrequency}
                  onValueChange={setWeightLogFrequency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Biweekly">Biweekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            {/* <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6 mt-6`}> */}
            <div className={`grid 'grid-cols-1' gap-6 mt-6`}>
              <Card>
                <CardHeader>
                  <CardTitle>Disruptive Behaviors Tracked</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {disruptiveBehaviors.map((behavior) => (
                    <div key={behavior.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`behavior-${behavior.id}`}
                          checked={selectedBehaviors.includes(behavior.id)}
                          onCheckedChange={(checked) => handleBehaviorChange(behavior.id, checked === true)}
                        />
                        <Label
                          htmlFor={`behavior-${behavior.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {behavior.label}
                        </Label>
                      </div>

                      {behavior.custom && selectedBehaviors.includes(behavior.id) && (
                        <Input
                          placeholder={`Specify ${behavior.label.toLowerCase()}`}
                          value={behaviorCustomValues[behavior.id] || ''}
                          onChange={(e) => handleCustomValueChange(behavior.id, e.target.value, false)}
                          className="mt-2 ml-6"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>Key Circumstances Tracked</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {keyCircumstances.map((circumstance) => (
                    <div key={circumstance.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`circumstance-${circumstance.id}`}
                          checked={selectedCircumstances.includes(circumstance.id)}
                          onCheckedChange={(checked) => handleCircumstanceChange(circumstance.id, checked === true)}
                        />
                        <Label
                          htmlFor={`circumstance-${circumstance.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {circumstance.label}
                        </Label>
                      </div>

                      {circumstance.custom && selectedCircumstances.includes(circumstance.id) && (
                        <Input
                          placeholder={`Specify ${circumstance.label.toLowerCase()}`}
                          value={circumstanceCustomValues[circumstance.id] || ''}
                          onChange={(e) => handleCustomValueChange(circumstance.id, e.target.value, true)}
                          className="mt-2 ml-6"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card> */}
            </div>

            {/* <Card>
              <CardHeader>
                <CardTitle>Additional Tracking Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="track-acceptance"
                      checked={trackAcceptance}
                      onCheckedChange={(checked) => setTrackAcceptance(checked === true)}
                    />
                    <Label
                      htmlFor="track-acceptance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Track Acceptance
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="track-swallowing"
                      checked={trackSwallowing}
                      onCheckedChange={(checked) => setTrackSwallowing(checked === true)}
                    />
                    <Label
                      htmlFor="track-swallowing"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Track Swallowing
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="target-behavior">Target Behavior Wording</Label>
                <Input
                  id="target-behavior"
                  value={targetBehaviorWording}
                  onChange={e => setTargetBehaviorWording(e.target.value)}
                  placeholder="e.g., Bite, Swallow, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-behavior-prompt">Target Behavior Prompt Wording</Label>
                <Input
                  id="target-behavior-prompt"
                  value={targetBehaviorPromptWording}
                  onChange={e => setTargetBehaviorPromptWording(e.target.value)}
                  placeholder="e.g., Take a bite, Try a swallow, etc."
                />
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </TherapyLayout>
  );
};

export default AdjustIntervention;
