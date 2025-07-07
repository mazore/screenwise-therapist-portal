/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

import { useClientData } from "@/hooks/useClientData";

import { useMsal } from "@azure/msal-react";
import DisruptiveBehaviorsCheckboxes from './DisruptiveBehaviorsCheckboxes';
import ProgressionStagesEditor from './ProgressionStagesEditor';

const API_URL = 'https://screenwise-backend.azurewebsites.net/';

const AdjustIntervention = () => {

  const { therapistData, clientData, lastSyncedNow } = useClientData();

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
        lastSyncedNow();
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
            <ProgressionStagesEditor
              clientData={clientData}
              userId={userId}
              lastSyncedNow={lastSyncedNow}
            />

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
