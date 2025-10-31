"use client";

import { Trash2, AlertTriangle, Database, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const handleDelete = () => {
    // Handle delete logic here
    console.log("Account deleted");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Delete Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              What happens when you delete your account?
            </h3>
            <p className="text-base text-gray-600">
              Deleting your account is permanent and cannot be undone. All your data will be permanently
              removed from our servers.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  Permanent deletion
                </h4>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  All data removed
                </h4>
                <p className="text-sm text-gray-600">
                  Posts, messages, and profile information will be deleted
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  No recovery
                </h4>
                <p className="text-sm text-gray-600">
                  You will not be able to recover your account
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-base text-gray-900 font-semibold">
              Are you sure you want to proceed?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Consider suspending your account instead if you might want to return later.
            </p>
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600 px-12 py-6 text-lg font-semibold"
            >
              Delete Account
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
