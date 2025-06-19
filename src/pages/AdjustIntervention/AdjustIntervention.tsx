/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { useClientData } from "@/hooks/useClientData";

import { useMsal } from "@azure/msal-react";
import { v4 as uuidv4 } from "uuid";
import DisruptiveBehaviorsCheckboxes from './DisruptiveBehaviorsCheckboxes';

const API_URL = 'https://screenwise-backend.azurewebsites.net/';

interface Level {
  bites: number;
  rewardTime: string;
  sessionsToAdvance: number;
}

const AdjustIntervention = () => {

  const { therapistData, clientData } = useClientData();

  // --- Generalized Save State ---
  type SaveFields = "chewingInterval" | "operationalDefinition" | "successRating" | "disruptiveBehaviorsTracked" | "autoplayAfterLastBite" | "canUnlockProgression";
  const [lastSavedValues, setLastSavedValues] = useState<Record<string, Record<SaveFields, any>>>({});
  const saveTimeoutRefs = useRef<Record<SaveFields, NodeJS.Timeout | null>>({
    chewingInterval: null,
    operationalDefinition: null,
    successRating: null,
    disruptiveBehaviorsTracked: null,
    autoplayAfterLastBite: null,
    canUnlockProgression: null,
  });

  // Set initial values
  const [chewingInterval, setChewingInterval] = useState(clientData?.secondsToChew || 30);
  const [chewingIntervalInput, setChewingIntervalInput] = useState(String(clientData?.secondsToChew ?? 30));
  const [operationalDefinition, setOperationalDefinition] = useState(clientData?.operationalDefinition || "");
  const [successRating, setSuccessRating] = useState(clientData?.successRatingMinForSuccess || 0);
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>(clientData?.disruptiveBehaviorsTracked);
  const [enableSwallowConfirm, setEnableSwallowConfirm] = useState(
    clientData?.autoplayAfterLastBite === undefined ? false : !clientData.autoplayAfterLastBite
  );
  const [lastClientName, setLastClientName] = useState(clientData?.name);
  const [allowCaregiverOverride, setAllowCaregiverOverride] = useState(!!clientData?.canUnlockProgression);

  // Update values when clientData changes
  useEffect(() => {
    setChewingInterval(clientData?.secondsToChew || 30);
    setChewingIntervalInput(String(clientData?.secondsToChew ?? 30));
    setOperationalDefinition(clientData?.operationalDefinition || "");
    setSuccessRating(clientData?.successRatingMinForSuccess || 0);
    setSelectedBehaviors(clientData?.disruptiveBehaviorsTracked);
    setEnableSwallowConfirm(
      clientData?.autoplayAfterLastBite === undefined ? false : !clientData.autoplayAfterLastBite
    );
    setLastClientName(clientData?.name);
    setAllowCaregiverOverride(!!clientData?.canUnlockProgression);

    Object.keys(saveTimeoutRefs.current).forEach((field) => {
      if (saveTimeoutRefs.current[field as SaveFields]) {
        clearTimeout(saveTimeoutRefs.current[field as SaveFields]!);
        saveTimeoutRefs.current[field as SaveFields] = null;
      }
    });
  }, [clientData]);

  // --- Generalized Save Function ---
  const { accounts, instance } = useMsal();
  const userId = therapistData?.clients?.[clientData?.name]?.userId;

  const saveClientSetting = (
    field: SaveFields,
    value: any,
    endpoint: string,
    bodyKey: string
  ) => {
    if (
      clientData &&
      clientData.name &&
      userId &&
      clientData.name === lastClientName
    ) {
      if (lastSavedValues[clientData.name]?.[field] === value) {
        return;
      }
      if (saveTimeoutRefs.current[field]) {
        clearTimeout(saveTimeoutRefs.current[field]!);
      }
      saveTimeoutRefs.current[field] = setTimeout(async () => {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ['openid', 'profile'],
          account: accounts[0],
        });

        await fetch(API_URL + endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + tokenResponse.idToken,
          },
          body: JSON.stringify({
            clientProfile: clientData.name,
            clientUserId: userId,
            [bodyKey]: value,
          }),
        });
        setLastSavedValues(prev => ({
          ...prev,
          [clientData.name]: {
            ...prev[clientData.name],
            [field]: value
          }
        }));
      }, 500);
    }
  };

  // --- Save Chewing Interval ---
  useEffect(() => {
    saveClientSetting("chewingInterval", chewingInterval, "therapist_set_seconds_to_chew", "secondsToChew");
    // Cleanup on unmount or client switch
    return () => {
      if (saveTimeoutRefs.current.chewingInterval) {
        clearTimeout(saveTimeoutRefs.current.chewingInterval);
        saveTimeoutRefs.current.chewingInterval = null;
      }
    };
  }, [chewingInterval, clientData, userId, lastClientName, instance, accounts, API_URL, lastSavedValues]);

  // --- Save Operational Definition ---
  useEffect(() => {
    saveClientSetting("operationalDefinition", operationalDefinition, "therapist_set_operational_definition", "operationalDefinition");
    // Cleanup on unmount or client switch
    return () => {
      if (saveTimeoutRefs.current.operationalDefinition) {
        clearTimeout(saveTimeoutRefs.current.operationalDefinition);
        saveTimeoutRefs.current.operationalDefinition = null;
      }
    };
  }, [operationalDefinition, clientData, userId, lastClientName, instance, accounts, API_URL, lastSavedValues]);

  // --- Save Success Rating ---
  useEffect(() => {
    saveClientSetting(
      "successRating",
      successRating,
      "therapist_set_success_rating_min_for_success",
      "successRatingMinForSuccess"
    );
    // Cleanup on unmount or client switch
    return () => {
      if (saveTimeoutRefs.current.successRating) {
        clearTimeout(saveTimeoutRefs.current.successRating);
        saveTimeoutRefs.current.successRating = null;
      }
    };
  }, [successRating, clientData, userId, lastClientName, instance, accounts, API_URL, lastSavedValues]);

  // --- Save Disruptive Behaviors Tracked ---
  useEffect(() => {
    saveClientSetting(
      "disruptiveBehaviorsTracked",
      selectedBehaviors,
      "therapist_set_disruptive_behaviors_tracked",
      "disruptiveBehaviorsTracked"
    );
    // Cleanup on unmount or client switch
    return () => {
      if (saveTimeoutRefs.current.disruptiveBehaviorsTracked) {
        clearTimeout(saveTimeoutRefs.current.disruptiveBehaviorsTracked);
        saveTimeoutRefs.current.disruptiveBehaviorsTracked = null;
      }
    };
  }, [selectedBehaviors, clientData, userId, lastClientName, instance, accounts, API_URL, lastSavedValues]);

  // --- Save Swallow & Mouth Clear Confirmation (autoplayAfterLastBite) ---
  useEffect(() => {
    saveClientSetting(
      "autoplayAfterLastBite",
      !enableSwallowConfirm,
      "therapist_set_autoplay_after_last_bite",
      "autoplayAfterLastBite"
    );
    return () => {
      if (saveTimeoutRefs.current.autoplayAfterLastBite) {
        clearTimeout(saveTimeoutRefs.current.autoplayAfterLastBite);
        saveTimeoutRefs.current.autoplayAfterLastBite = null;
      }
    };
  }, [enableSwallowConfirm, clientData, userId, lastClientName, instance, accounts, API_URL, lastSavedValues]);

  // --- Save Allow Caregiver Override (canUnlockProgression) ---
  useEffect(() => {
    saveClientSetting(
      "canUnlockProgression",
      allowCaregiverOverride,
      "therapist_set_can_unlock_progression",
      "canUnlockProgression"
    );
    return () => {
      if (saveTimeoutRefs.current.canUnlockProgression) {
        clearTimeout(saveTimeoutRefs.current.canUnlockProgression);
        saveTimeoutRefs.current.canUnlockProgression = null;
      }
    };
  }, [allowCaregiverOverride, clientData, userId, lastClientName, instance, accounts, API_URL, lastSavedValues]);

  // Editable progression stages state, synced to clientData
  const [editableStages, setEditableStages] = useState<any[]>(clientData?.progressionStages || []);
  const [lastStagesClient, setLastStagesClient] = useState(clientData?.name);

  // Add local input state for numberOfBites and mealsNeeded fields
  const [stageInputs, setStageInputs] = useState<Record<number, { numberOfBites: string; mealsNeeded: string }>>({});

  // Add local input state for reward time (minutes and seconds) per stage
  const [rewardTimeInputs, setRewardTimeInputs] = useState<Record<number, { minutes: string; seconds: string }>>({});

  // Helper to get reward time input values for a stage, fallback to stage value
  const getRewardTimeInput = (index: number, stage: any) => {
    if (rewardTimeInputs[index]) {
      return rewardTimeInputs[index];
    }
    // fallback: parse from stage.secondsOfReward
    const totalSeconds = stage.secondsOfReward || 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes: String(minutes),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  // Helper to get input value for a stage/field, falling back to stage value
  const getStageInputValue = (
    index: number,
    field: "numberOfBites" | "mealsNeeded",
    fallback: number
  ) => {
    return stageInputs[index]?.[field] !== undefined
      ? stageInputs[index][field]
      : String(fallback ?? "");
  };

  // --- Ensure progression stages are always in sync with selected client ---
  useEffect(() => {
    // Only update editableStages if client changed
    if (clientData?.name !== lastStagesClient) {
      setEditableStages(clientData?.progressionStages || []);
      setLastStagesClient(clientData?.name);
      setStageInputs({});
      setRewardTimeInputs({});
    }
    // If progressionStages changed for the same client, update as well
    else if (
      clientData?.progressionStages &&
      JSON.stringify(clientData.progressionStages) !== JSON.stringify(editableStages)
    ) {
      setEditableStages(clientData.progressionStages);
      setStageInputs({});
      setRewardTimeInputs({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientData]);

  // Debounce refs for each stage by uuid
  const progressionStageTimeoutRefs = useRef<Record<string, NodeJS.Timeout | null>>({});

  // Save a single progression stage to the backend
  const saveProgressionStages = (stages: any[]) => {
    // Only save for the currently selected client
    if (!clientData?.name || !userId) return;
    instance.acquireTokenSilent({ scopes: ['openid', 'profile'], account: accounts[0] })
      .then(tokenResponse => {
        return fetch(API_URL + "therapist_set_progression_stages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + tokenResponse.idToken,
          },
          body: JSON.stringify({
            clientProfile: clientData.name,
            clientUserId: userId,
            progressionStages: stages,
          }),
        });
      });
  };

  // Handle field change for a progression stage
  const handleStageFieldChange = (stageIndex: number, field: string, value: any) => {
    setEditableStages(prevStages => {
      // Only update if the client is still the same
      if (clientData?.name !== lastStagesClient) return prevStages;
      const updatedStages = prevStages.map((stage, idx) =>
        idx === stageIndex ? { ...stage, [field]: value } : stage
      );
      // Debounce save for the whole array
      if (progressionStageTimeoutRefs.current['all']) {
        clearTimeout(progressionStageTimeoutRefs.current['all']!);
      }
      progressionStageTimeoutRefs.current['all'] = setTimeout(() => {
        // Only save for the current client
        if (clientData?.name === lastStagesClient) {
          saveProgressionStages(updatedStages);
        }
      }, 500);
      return updatedStages;
    });
    // Reset input state for this field after save
    setStageInputs(prev => ({
      ...prev,
      [stageIndex]: {
        ...prev[stageIndex],
        [field]: undefined
      }
    }));
    if (field === "secondsOfReward") {
      setRewardTimeInputs(prev => ({
        ...prev,
        [stageIndex]: undefined
      }));
    }
  };

  // Add these functions inside AdjustIntervention component, before return:
  const addProgressionStage = () => {
    setEditableStages(prevStages => {
      if (!prevStages || prevStages.length < 1) return prevStages;
      const last = prevStages[prevStages.length - 1];
      const nextIndex = prevStages.length + 1;
      const newStage = {
        uuid: uuidv4(),
        name: `${nextIndex}`,
        headline: "",
        imageUrl: "",
        imageHiddenUrl: "",
        numberOfBites: (last.numberOfBites ?? 0) + 5,
        secondsOfReward: (last.secondsOfReward ?? 0) + 10,
        mealsNeeded: (last.mealsNeeded ?? 0) + 10,
      };
      const updated = [...prevStages, newStage];
      saveProgressionStages(updated);
      return updated;
    });
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
            {/* Operational Definition */}
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

            {/* Progression Levels */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Progression Levels</h3>
              </div>
              <div className="space-y-4">
                {editableStages.length === 0 ? (
                  <div className="text-muted-foreground text-sm">No progression stages found for this client.</div>
                ) : (
                  editableStages.map((stage: any, index: number) => {
                    const rewardTime = getRewardTimeInput(index, stage);
                    // Highlight if this is the current progression stage
                    const isCurrent = clientData?.progressionUuid === stage.uuid;
                    return (
                      <div
                        key={stage.uuid || index}
                        className={
                          "grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative transition-colors " +
                          (isCurrent
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : "border")
                        }
                        style={isCurrent ? { boxShadow: "0 0 0 2px #2563eb" } : {}}
                      >
                        {/* Current stage indicator */}
                        {isCurrent && (
                          <span className="absolute -top-3 left-4 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow z-10">
                            Current Stage
                          </span>
                        )}
                        {/* Remove Level button for stages > 6 */}
                        {editableStages.length > 6 && index >= 6 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            title="Remove this level"
                            onClick={() => {
                              setEditableStages(prevStages => {
                                if (prevStages.length <= 6) return prevStages;
                                const updated = prevStages.filter((_, i) => i !== index);
                                saveProgressionStages(updated);
                                return updated;
                              });
                            }}
                          >
                            <Minus className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                        <div className="space-y-2">
                          <Label>
                            Level {index + 1}: Number of Bites
                          </Label>
                          <Input
                            type="number"
                            value={getStageInputValue(index, "numberOfBites", stage.numberOfBites)}
                            onChange={e => {
                              let val = e.target.value;
                              if (val.length > 1) {
                                val = val.replace(/^0+/, '') || '0';
                              }
                              setStageInputs(prev => ({
                                ...prev,
                                [index]: {
                                  ...prev[index],
                                  numberOfBites: val
                                }
                              }));
                              if (val !== "" && !isNaN(Number(val))) {
                                handleStageFieldChange(index, "numberOfBites", Number(val));
                              }
                            }}
                            onBlur={e => {
                              let val = e.target.value;
                              if (val.length > 1) {
                                val = val.replace(/^0+/, '') || '0';
                              }
                              if (val === "") {
                                handleStageFieldChange(index, "numberOfBites", 0);
                                setStageInputs(prev => ({
                                  ...prev,
                                  [index]: {
                                    ...prev[index],
                                    numberOfBites: "0"
                                  }
                                }));
                              } else {
                                handleStageFieldChange(index, "numberOfBites", Number(val));
                                setStageInputs(prev => ({
                                  ...prev,
                                  [index]: {
                                    ...prev[index],
                                    numberOfBites: val
                                  }
                                }));
                              }
                            }}
                            min={0}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Reward Time</Label>
                          <div className="flex items-center space-x-2">
                            <div className="flex flex-col items-center">
                              <Input
                                type="number"
                                min={0}
                                max={59}
                                value={rewardTime.minutes}
                                onChange={e => {
                                  let val = e.target.value.replace(/^0+/, '') || '0';
                                  if (val === "") val = "0";
                                  setRewardTimeInputs(prev => ({
                                    ...prev,
                                    [index]: {
                                      ...prev[index],
                                      minutes: val
                                    }
                                  }));
                                  const minutesNum = parseInt(val, 10);
                                  const secondsNum = parseInt(rewardTime.seconds, 10) || 0;
                                  if (!isNaN(minutesNum) && !isNaN(secondsNum)) {
                                    handleStageFieldChange(index, "secondsOfReward", minutesNum * 60 + secondsNum);
                                  }
                                }}
                                onBlur={e => {
                                  const val = e.target.value.replace(/^0+/, '') || '0';
                                  setRewardTimeInputs(prev => ({
                                    ...prev,
                                    [index]: {
                                      ...prev[index],
                                      minutes: val
                                    }
                                  }));
                                  const minutesNum = parseInt(val, 10);
                                  const secondsNum = parseInt(rewardTime.seconds, 10) || 0;
                                  if (!isNaN(minutesNum) && !isNaN(secondsNum)) {
                                    handleStageFieldChange(index, "secondsOfReward", minutesNum * 60 + secondsNum);
                                  }
                                }}
                                className="w-16"
                                aria-label="Minutes"
                              />
                              <span className="text-xs mt-1">min</span>
                            </div>
                            <span>:</span>
                            <div className="flex flex-col items-center">
                              <Input
                                type="number"
                                min={0}
                                max={59}
                                value={rewardTime.seconds}
                                onChange={e => {
                                  let val = e.target.value.replace(/^0+/, '') || '0';
                                  let num = parseInt(val, 10);
                                  if (isNaN(num) || num < 0) num = 0;
                                  if (num > 59) num = 59;
                                  val = String(num).padStart(2, "0");
                                  setRewardTimeInputs(prev => ({
                                    ...prev,
                                    [index]: {
                                      ...prev[index],
                                      seconds: val
                                    }
                                  }));
                                  const minutesNum = parseInt(rewardTime.minutes, 10) || 0;
                                  if (!isNaN(minutesNum)) {
                                    handleStageFieldChange(index, "secondsOfReward", minutesNum * 60 + num);
                                  }
                                }}
                                onBlur={e => {
                                  let val = e.target.value.replace(/^0+/, '') || '0';
                                  let num = parseInt(val, 10);
                                  if (isNaN(num) || num < 0) num = 0;
                                  if (num > 59) num = 59;
                                  val = String(num).padStart(2, "0");
                                  setRewardTimeInputs(prev => ({
                                    ...prev,
                                    [index]: {
                                      ...prev[index],
                                      seconds: val
                                    }
                                  }));
                                  const minutesNum = parseInt(rewardTime.minutes, 10) || 0;
                                  if (!isNaN(minutesNum)) {
                                    handleStageFieldChange(index, "secondsOfReward", minutesNum * 60 + num);
                                  }
                                }}
                                className="w-16"
                                aria-label="Seconds"
                              />
                              <span className="text-xs mt-1">sec</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Sessions to Advance</Label>
                          <Input
                            type="number"
                            value={getStageInputValue(index, "mealsNeeded", stage.mealsNeeded)}
                            onChange={e => {
                              let val = e.target.value;
                              if (val.length > 1) {
                                val = val.replace(/^0+/, '') || '0';
                              }
                              setStageInputs(prev => ({
                                ...prev,
                                [index]: {
                                  ...prev[index],
                                  mealsNeeded: val
                                }
                              }));
                              if (val !== "" && !isNaN(Number(val))) {
                                handleStageFieldChange(index, "mealsNeeded", Number(val));
                              }
                            }}
                            onBlur={e => {
                              let val = e.target.value;
                              if (val.length > 1) {
                                val = val.replace(/^0+/, '') || '0';
                              }
                              if (val === "") {
                                handleStageFieldChange(index, "mealsNeeded", 0);
                                setStageInputs(prev => ({
                                  ...prev,
                                  [index]: {
                                    ...prev[index],
                                    mealsNeeded: "0"
                                  }
                                }));
                              } else {
                                handleStageFieldChange(index, "mealsNeeded", Number(val));
                                setStageInputs(prev => ({
                                  ...prev,
                                  [index]: {
                                    ...prev[index],
                                    mealsNeeded: val
                                  }
                                }));
                              }
                            }}
                            min={0}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {/* Add Level button below all stages */}
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addProgressionStage}
                >
                  Add Level
                </Button>
              </div>
            </div>

            {/* Success Rating Slider */}
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

            {/* Booleans */}
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

            {/* Chewing Interval */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="interval">Chewing Interval (seconds)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="interval"
                    type="number"
                    value={chewingIntervalInput}
                    onChange={e => {
                      let val = e.target.value;
                      if (val.length > 1) {
                        val = val.replace(/^0+/, '') || '0';
                      }
                      setChewingIntervalInput(val);
                      if (val !== "" && !isNaN(Number(val))) {
                        setChewingInterval(Number(val));
                      }
                    }}
                    onBlur={e => {
                      let val = e.target.value;
                      if (val.length > 1) {
                        val = val.replace(/^0+/, '') || '0';
                      }
                      if (val === "") {
                        setChewingInterval(0);
                        setChewingIntervalInput("0");
                      } else {
                        setChewingInterval(Number(val));
                        setChewingIntervalInput(val);
                      }
                    }}
                    min={0}
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            {/* Disruptive Behaviors */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              <DisruptiveBehaviorsCheckboxes
                selectedBehaviors={selectedBehaviors}
                setSelectedBehaviors={setSelectedBehaviors}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TherapyLayout>
  );
};

export default AdjustIntervention;
