"use client";

import * as React from "react";
import { LucideIcon, Shield, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface ManageThirdPartyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: string;
    icon: LucideIcon;
    title: string;
    subtitle: string;
    description: string;
    enabled: boolean;
  } | null;
  onSave: (serviceId: string, enabled: boolean, settings: any) => void;
}

export function ManageThirdPartyDialog({
  open,
  onOpenChange,
  service,
  onSave,
}: ManageThirdPartyDialogProps) {
  if (!service) return null;

  const Icon = service.icon;
  const [enabled, setEnabled] = React.useState(service.enabled);
  const [shareProfile, setShareProfile] = React.useState(true);
  const [shareActivity, setShareActivity] = React.useState(false);
  const [shareContacts, setShareContacts] = React.useState(false);

  React.useEffect(() => {
    setEnabled(service.enabled);
  }, [service.enabled, open]);

  const handleSave = () => {
    onSave(service.id, enabled, {
      shareProfile,
      shareActivity,
      shareContacts,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Manage Third-Party Access
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                {service.subtitle}
              </h4>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Enable Access
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Allow this third-party service to access your data
                </p>
              </div>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && (
            <>
              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-4 h-4 text-blue-600" />
                  <Label className="text-sm font-semibold text-gray-900">
                    Data Sharing Settings
                  </Label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-900 cursor-pointer">
                        Profile Information
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Share your name, email, and profile picture
                      </p>
                    </div>
                    <Switch
                      checked={shareProfile}
                      onCheckedChange={setShareProfile}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-900 cursor-pointer">
                        Activity Data
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Share your posts, likes, and interactions
                      </p>
                    </div>
                    <Switch
                      checked={shareActivity}
                      onCheckedChange={setShareActivity}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-900 cursor-pointer">
                        Contact List
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Share your saved contacts and connections
                      </p>
                    </div>
                    <Switch
                      checked={shareContacts}
                      onCheckedChange={setShareContacts}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-900">
              You can revoke access at any time. Your data will no longer be
              shared with this service once you disable access.
            </p>
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
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
