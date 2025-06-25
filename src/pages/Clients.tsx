import React, { useState } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Copy, Mail, UserPlus } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useClientData } from "@/hooks/useClientData";
import QRCode from "react-qr-code";

export default function Clients() {
  const { therapistData } = useClientData();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  if (!therapistData) {
    return null;
  }

  // const url = "com.screenwiseeating.yumeats://link_to_therapist/?therapist_id=" + therapistData?.userId;
  const url = "https://app.screenwiseeating.com/deep-link?therapist_id=" + therapistData?.userId;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast({
      title: "Link copied!",
      description: "The link has been copied to your clipboard.",
      duration: 3000,
    });
    setTimeout(() => setIsCopied(false), 3000);
  };

  return <TherapyLayout>
    <div className="max-w-3xl mx-auto py-4 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Connect with your clients</h2>

        <div className="mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
              1
            </div>
            <p className="text-gray-600 pt-1">
              Have your clients download the "YumEats" App from the App Store
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
              2
            </div>
            <p className="text-gray-600 pt-1">
              Share this QR code or link with your clients to connect them to your account.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <QRCode value={url} size={200} />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Ask clients to scan this QR code using their device camera
          </p>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or share this link with your clients:
          </label>
          <div className="flex">
            <Input
              value={url}
              readOnly
              className="flex-1 bg-gray-50"
            />
            <Button
              onClick={handleCopyLink}
              className="ml-2 flex items-center gap-1"
              variant="outline"
            >
              <Copy size={16} />
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            You can email or message this link to your clients directly
          </p>
        </div>
      </div>
    </div>
  </TherapyLayout>;
}
