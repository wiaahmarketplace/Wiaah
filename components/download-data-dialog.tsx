"use client";

import { Download, FileText, Image, MessageSquare, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface DownloadDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dataTypes = [
  {
    id: "profile",
    icon: FileText,
    label: "Profile Information",
    description: "Your account details and settings",
  },
  {
    id: "posts",
    icon: Image,
    label: "Posts & Content",
    description: "All your posts, photos, and videos",
  },
  {
    id: "messages",
    icon: MessageSquare,
    label: "Messages",
    description: "Your conversations and direct messages",
  },
  {
    id: "orders",
    icon: Package,
    label: "Orders & Transactions",
    description: "Your purchase history and order details",
  },
];

export function DownloadDataDialog({
  open,
  onOpenChange,
}: DownloadDataDialogProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    dataTypes.map((type) => type.id)
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const handleToggle = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    // Simulate download preparation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create a mock JSON file with account data
    const accountData = {
      profile: {
        username: "@vinodjaspa",
        email: "vintuijaspa93@gmail.com",
        dateOfBirth: "15 mars 2025",
        country: "Not set",
        language: "English",
      },
      exportDate: new Date().toISOString(),
      dataTypes: selectedTypes,
      message: "This is your account data export",
    };

    const blob = new Blob([JSON.stringify(accountData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `account-data-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsDownloading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Download Your Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-base text-gray-600">
            Select the types of data you want to download. Your data will be
            prepared and downloaded as a ZIP file.
          </p>

          <div className="space-y-4">
            {dataTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    id={type.id}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={() => handleToggle(type.id)}
                    className="mt-1"
                  />
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor={type.id}
                        className="text-base font-semibold text-gray-900 cursor-pointer"
                      >
                        {type.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-900">
              Your download may take a few minutes to prepare depending on the
              amount of data selected.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-900 hover:bg-gray-100 px-6"
              disabled={isDownloading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-black text-white hover:bg-gray-800 px-6 gap-2"
              disabled={selectedTypes.length === 0 || isDownloading}
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Preparing..." : "Download Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
