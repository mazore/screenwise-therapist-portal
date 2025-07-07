import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";

const DeepLinkFallback = () => {
  const [searchParams] = useSearchParams();
  const therapist_id = searchParams.get("therapist_id");

  useEffect(() => {
    // Attempt to open the app via deep link
    const deepLinkUrl = `com.screenwiseeating.yumeats://link_to_therapist?therapist_id=${therapist_id}`;
    const timer = setTimeout(() => {
      // Fallback if the app doesn't open
      console.log("App not installed or deep link failed.");
    }, 2000);

    window.location.href = deepLinkUrl;

    return () => clearTimeout(timer);
  }, [therapist_id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="max-w-md w-full text-center shadow-xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Opening App...</h1>
          <p className="mb-2 text-gray-600">
            If the app doesn't open automatically, you may need to install it first.
          </p>
          <p className="mb-6 text-gray-600">
            Once installed and setup, go back to the QR code or link shared by your therapist.
          </p>
          <Button
            variant="default"
            onClick={() => {
              window.location.href = "https://apps.apple.com/us/app/yumeats/id6737301809?platform=iphone";
            }}
          >
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Download the App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepLinkFallback;
