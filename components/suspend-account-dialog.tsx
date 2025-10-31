"use client";

import { Ban, RotateCcw, Database } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuspendAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuspendAccountDialog({
  open,
  onOpenChange,
}: SuspendAccountDialogProps) {
  const handleSuspend = () => {
    // Handle suspend logic here
    console.log("Account suspended");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Suspend Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              What happens when you suspend your account?
            </h3>
            <p className="text-base text-gray-600">
              Suspending your account will temporarily disable your profile and remove it from public view.
              You can reactivate it at any time by logging back in.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Ban className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  Profile invisibility
                </h4>
                <p className="text-sm text-gray-600">
                  Profile invisibility
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  Reactivation
                </h4>
                <p className="text-sm text-gray-600">
                  Reactivation
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  Data retention
                </h4>
                <p className="text-sm text-gray-600">
                  Data retention
                </p>
              </div>
            </div>
          </div>

          <p className="text-base text-gray-600">
            Your profile, posts, and activity will not be visible to other users. You can reactivate your
            account by simply logging back in. Your data (posts, messages, etc.) will be preserved and
            restored upon reactivation.
          </p>

          <div className="flex justify-between gap-4 pt-4">
            <Button
              onClick={handleSuspend}
              className="bg-black text-white hover:bg-gray-800 px-12 py-6 text-lg font-semibold"
            >
              Suspend Account
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-900 hover:bg-gray-100 px-12 py-6 text-lg font-semibold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
