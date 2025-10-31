"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ManagePermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
  } | null;
  currentStatus: "allow" | "deny" | "ask";
  onSave: (permissionId: string, status: "allow" | "deny" | "ask") => void;
}

export function ManagePermissionDialog({
  open,
  onOpenChange,
  permission,
  currentStatus,
  onSave,
}: ManagePermissionDialogProps) {
  if (!permission) return null;

  const Icon = permission.icon;
  const [status, setStatus] = React.useState(currentStatus);

  React.useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus, open]);

  const handleSave = () => {
    onSave(permission.id, status);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Manage {permission.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                {permission.title}
              </h4>
              <p className="text-sm text-gray-600">{permission.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-900">
              Permission Settings
            </Label>

            <RadioGroup value={status} onValueChange={(value: any) => setStatus(value)}>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="allow" id="allow" className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor="allow"
                      className="text-sm font-semibold text-gray-900 cursor-pointer"
                    >
                      Always Allow
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      App can access this permission at any time
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="ask" id="ask" className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor="ask"
                      className="text-sm font-semibold text-gray-900 cursor-pointer"
                    >
                      Ask Every Time
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      You'll be asked for permission each time it's needed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="deny" id="deny" className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor="deny"
                      className="text-sm font-semibold text-gray-900 cursor-pointer"
                    >
                      Always Deny
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      App will not be able to access this permission
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-900 hover:bg-gray-100 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-800 px-6"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
