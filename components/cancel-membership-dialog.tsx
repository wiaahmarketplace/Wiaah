"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CancelMembershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membershipData: {
    planName: string;
    expirationDate: string;
  };
}

export function CancelMembershipDialog({
  open,
  onOpenChange,
  membershipData,
}: CancelMembershipDialogProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancelMembership = async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Membership Cancelled",
      description: "Your membership has been successfully cancelled. You will retain access until the expiration date.",
    });

    setIsProcessing(false);
    onOpenChange(false);
  };

  const handleKeepMembership = () => {
    toast({
      title: "Membership Retained",
      description: "Your membership will continue as normal.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0">
        <DialogHeader className="px-8 pt-8 pb-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Confirm Cancellation
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 pb-8 space-y-6">
          <div className="border-t border-b border-gray-200 py-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Membership Details
            </h3>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">Plan Name</p>
                <p className="text-base font-semibold text-gray-900">
                  {membershipData.planName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Expiration Date</p>
                <p className="text-base font-semibold text-gray-900">
                  {membershipData.expirationDate}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Cancellation Summary
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              You are about to cancel your {membershipData.planName} membership. You will
              lose access to premium features after the expiration date.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleKeepMembership}
              className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-base"
              disabled={isProcessing}
            >
              Keep Membership
            </Button>

            <Button
              onClick={handleCancelMembership}
              className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold text-base"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Cancel Membership"}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-600">
            By canceling, you agree to our{" "}
            <button className="text-gray-900 underline hover:text-gray-700">
              terms of service
            </button>{" "}
            and{" "}
            <button className="text-gray-900 underline hover:text-gray-700">
              refund policy
            </button>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
