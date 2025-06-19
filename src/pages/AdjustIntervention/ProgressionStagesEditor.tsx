/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Trash, Circle, CheckCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useMsal } from "@azure/msal-react";

const API_URL = "https://screenwise-backend.azurewebsites.net/";

interface ProgressionStagesEditorProps {
  /** Selected client’s profile data (should include name, progressionStages, progressionUuid, etc.) */
  clientData: any;
  /** Azure AD B2C user ID for the selected client (used by the backend) */
  userId?: string;
  lastSyncedNow: () => void;
}

/**
 * Stand-alone editor for adding, removing, and adjusting a client’s progression stages.
 * Handles local state, optimistic UI updates, and debounced backend persistence.
 */
const ProgressionStagesEditor: React.FC<ProgressionStagesEditorProps> = ({
  clientData,
  userId,
  lastSyncedNow
}) => {
  const { accounts, instance } = useMsal();

  /** Local editable copy of the stages plus bookkeeping to reset when client changes */
  const [editableStages, setEditableStages] = useState<any[]>(
    clientData?.progressionStages ?? []
  );
  const [lastStagesClient, setLastStagesClient] = useState(clientData?.name);

  /** Per-stage uncontrolled textbox state (to avoid cursor jumps) */
  const [stageInputs, setStageInputs] = useState<
    Record<number, { numberOfBites?: string; mealsNeeded?: string }>
  >({});
  /** Separate state for reward-time minutes / seconds textboxes */
  const [rewardTimeInputs, setRewardTimeInputs] = useState<
    Record<number, { minutes?: string; seconds?: string }>
  >({});

  /** Debounce handles for the whole array (key `"all"`) and per-stage if needed */
  const progressionStageTimeoutRefs = useRef<Record<string, NodeJS.Timeout | null>>(
    {}
  );

  /** Add this state to track the current progression UUID in the UI */
  const [currentProgressionUuid, setCurrentProgressionUuid] = useState<string | undefined>(
    clientData?.progressionUuid
  );

  /* ---------- helpers ---------- */

  const getRewardTimeInput = (index: number, stage: any) => {
    if (rewardTimeInputs[index]) return rewardTimeInputs[index];
    const total = stage.secondsOfReward ?? 0;
    return {
      minutes: String(Math.floor(total / 60)),
      seconds: String(total % 60).padStart(2, "0"),
    };
  };

  const getStageInputValue = (
    index: number,
    field: "numberOfBites" | "mealsNeeded",
    fallback: number
  ) =>
    stageInputs[index]?.[field] !== undefined
      ? stageInputs[index]![field]!
      : String(fallback ?? "");

  /* ---------- keep local state in sync with client switch / server pushes ---------- */

  useEffect(() => {
    if (clientData?.name !== lastStagesClient) {
      setEditableStages(clientData?.progressionStages ?? []);
      setStageInputs({});
      setRewardTimeInputs({});
      setLastStagesClient(clientData?.name);
    } else if (
      clientData?.progressionStages &&
      JSON.stringify(clientData.progressionStages) !== JSON.stringify(editableStages)
    ) {
      setEditableStages(clientData.progressionStages);
      setStageInputs({});
      setRewardTimeInputs({});
    }
  }, [clientData]);

  // Update currentProgressionUuid when clientData changes
  useEffect(() => {
    setCurrentProgressionUuid(clientData?.progressionUuid);
  }, [clientData?.progressionUuid]);

  /* ---------- stage selection ---------- */

  const handleStageChange = (stageUuid: string) => {
    if (!clientData?.name || !userId) return;

    // Immediately update UI state for immediate feedback
    setCurrentProgressionUuid(stageUuid);

    // Debounce API call
    if (progressionStageTimeoutRefs.current.progressionUuid) {
      clearTimeout(progressionStageTimeoutRefs.current.progressionUuid);
    }

    progressionStageTimeoutRefs.current.progressionUuid = setTimeout(() => {
      instance
        .acquireTokenSilent({
          scopes: ["openid", "profile"],
          account: accounts[0],
        })
        .then((tokenResponse) =>
          fetch(API_URL + "therapist_set_progression_uuid", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokenResponse.idToken,
            },
            body: JSON.stringify({
              clientProfile: clientData.name,
              clientUserId: userId,
              progressionUuid: stageUuid,
            }),
          }).then(lastSyncedNow)
        );
    }, 500);
  };

  /* ---------- save helpers ---------- */

  const saveProgressionStages = (stages: any[]) => {
    if (!clientData?.name || !userId) return;
    instance
      .acquireTokenSilent({
        scopes: ["openid", "profile"],
        account: accounts[0],
      })
      .then((tokenResponse) =>
        fetch(API_URL + "therapist_set_progression_stages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenResponse.idToken,
          },
          body: JSON.stringify({
            clientProfile: clientData.name,
            clientUserId: userId,
            progressionStages: stages,
          }),
        }).then(lastSyncedNow)
      );
  };

  /** Debounced field update */
  const handleStageFieldChange = (stageIndex: number, field: string, value: any) => {
    setEditableStages((prev) => {
      const updated = prev.map((s, i) => (i === stageIndex ? { ...s, [field]: value } : s));

      // Debounce entire array save
      if (progressionStageTimeoutRefs.current.all) {
        clearTimeout(progressionStageTimeoutRefs.current.all);
      }
      progressionStageTimeoutRefs.current.all = setTimeout(() => {
        if (clientData?.name === lastStagesClient) saveProgressionStages(updated);
      }, 500);

      return updated;
    });

    // clear transient textbox state so server pushes won't overwrite fresh edits
    setStageInputs((prev) => ({
      ...prev,
      [stageIndex]: { ...prev[stageIndex], [field]: undefined },
    }));
    if (field === "secondsOfReward") {
      setRewardTimeInputs((prev) => ({ ...prev, [stageIndex]: undefined }));
    }
  };

  /* ---------- add / remove ---------- */

  const addProgressionStage = () => {
    setEditableStages((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      const next = {
        uuid: uuidv4(),
        name: `${prev.length + 1}`,
        headline: "",
        imageUrl: "",
        imageHiddenUrl: "",
        numberOfBites: (last.numberOfBites ?? 0) + 5,
        secondsOfReward: (last.secondsOfReward ?? 0) + 10,
        mealsNeeded: (last.mealsNeeded ?? 0) + 10,
      };
      const updated = [...prev, next];
      saveProgressionStages(updated);
      return updated;
    });
  };

  const removeProgressionStage = (index: number) => {
    setEditableStages((prev) => {
      if (prev.length <= 6) return prev; // safeguard
      const updated = prev.filter((_, i) => i !== index);
      saveProgressionStages(updated);
      return updated;
    });
  };

  /* ---------- UI ---------- */

  return (
    <div className="space-y-7">
      <h3 className="text-lg font-semibold">Progression Levels</h3>

      {editableStages.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No progression stages found for this client.
        </p>
      ) : (
        editableStages.map((stage, index) => {
          const rewardTime = getRewardTimeInput(index, stage);
          const isCurrent = currentProgressionUuid === stage.uuid;

          return (
            <div
              key={stage.uuid ?? index}
              className={`relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pl-10 rounded-md border transition-colors ${
                isCurrent ? "bg-blue-50 border-blue-600 shadow-md" : ""
              }`}
              style={isCurrent ? { boxShadow: "0 0 0 2px #2563eb" } : undefined}
            >
              {/* Stage selection radio button */}
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => !isCurrent && handleStageChange(stage.uuid)}
                title={isCurrent ? "Current stage" : "Set as current stage"}
              >
                {isCurrent ? (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Title showing stage name */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 py-0.5 text-sm font-regular border rounded">
                Stage {stage.name}
              </div>

              {isCurrent && (
                <span className="absolute -top-3 left-4 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow">
                  Current Stage
                </span>
              )}

              {editableStages.length > 6 && index >= 6 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  title="Remove this level"
                  onClick={() => removeProgressionStage(index)}
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              )}

              {/* Number of bites */}
              <div className="space-y-2">
                <Label>Number of Bites</Label>
                <Input
                  type="number"
                  min={0}
                  value={getStageInputValue(index, "numberOfBites", stage.numberOfBites)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+/, "") || "0";
                    setStageInputs((p) => ({
                      ...p,
                      [index]: { ...p[index], numberOfBites: val },
                    }));
                    if (val !== "" && !isNaN(Number(val)))
                      handleStageFieldChange(index, "numberOfBites", Number(val));
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.replace(/^0+/, "") || "0";
                    handleStageFieldChange(index, "numberOfBites", Number(val));
                  }}
                />
              </div>

              {/* Reward time */}
              <div className="space-y-2">
                <Label>Reward Time</Label>
                <div className="flex items-center space-x-2">
                  {/* minutes */}
                  <div className="flex flex-col items-center">
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      className="w-16"
                      value={rewardTime.minutes}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^0+/, "") || "0";
                        setRewardTimeInputs((p) => ({
                          ...p,
                          [index]: { ...p[index], minutes: val },
                        }));
                        const m = parseInt(val, 10) || 0;
                        const s = parseInt(rewardTime.seconds, 10) || 0;
                        handleStageFieldChange(index, "secondsOfReward", m * 60 + s);
                      }}
                      onBlur={(e) => {
                        const val = e.target.value.replace(/^0+/, "") || "0";
                        const m = parseInt(val, 10) || 0;
                        const s = parseInt(rewardTime.seconds, 10) || 0;
                        handleStageFieldChange(index, "secondsOfReward", m * 60 + s);
                      }}
                      aria-label="Minutes"
                    />
                    <span className="text-xs mt-1">min</span>
                  </div>
                  <span>:</span>
                  {/* seconds */}
                  <div className="flex flex-col items-center">
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      className="w-16"
                      value={rewardTime.seconds}
                      onChange={(e) => {
                        let num = parseInt(e.target.value.replace(/^0+/, "") || "0", 10);
                        if (isNaN(num) || num < 0) num = 0;
                        if (num > 59) num = 59;
                        const val = String(num).padStart(2, "0");
                        setRewardTimeInputs((p) => ({
                          ...p,
                          [index]: { ...p[index], seconds: val },
                        }));
                        const m = parseInt(rewardTime.minutes, 10) || 0;
                        handleStageFieldChange(index, "secondsOfReward", m * 60 + num);
                      }}
                      onBlur={(e) => {
                        let num = parseInt(e.target.value.replace(/^0+/, "") || "0", 10);
                        if (isNaN(num) || num < 0) num = 0;
                        if (num > 59) num = 59;
                        const m = parseInt(rewardTime.minutes, 10) || 0;
                        handleStageFieldChange(index, "secondsOfReward", m * 60 + num);
                      }}
                      aria-label="Seconds"
                    />
                    <span className="text-xs mt-1">sec</span>
                  </div>
                </div>
              </div>

              {/* meals needed */}
              <div className="space-y-2">
                <Label>Sessions to Advance</Label>
                <Input
                  type="number"
                  min={0}
                  value={getStageInputValue(index, "mealsNeeded", stage.mealsNeeded)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+/, "") || "0";
                    setStageInputs((p) => ({
                      ...p,
                      [index]: { ...p[index], mealsNeeded: val },
                    }));
                    if (val !== "" && !isNaN(Number(val)))
                      handleStageFieldChange(index, "mealsNeeded", Number(val));
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.replace(/^0+/, "") || "0";
                    handleStageFieldChange(index, "mealsNeeded", Number(val));
                  }}
                />
              </div>
            </div>
          );
        })
      )}

      {/* add level */}
      <div className="flex justify-center mt-4">
        <Button variant="outline" size="sm" onClick={addProgressionStage}>
          Add Level
        </Button>
      </div>
    </div>
  );
};

export default ProgressionStagesEditor;
