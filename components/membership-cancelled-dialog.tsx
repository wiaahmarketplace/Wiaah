"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface MembershipCancelledDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membershipData: {
    planName: string;
    expirationDate: string;
  };
}

export function MembershipCancelledDialog({
  open,
  onOpenChange,
  membershipData,
}: MembershipCancelledDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleRejoin = () => {
    toast({
      title: "Rejoining Membership",
      description: "Redirecting to plan selection...",
    });
    onOpenChange(false);
  };

  const handleReturnToAccount = () => {
    onOpenChange(false);
    router.push("/account-settings");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-8 pt-8 pb-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Your Membership Has Been Cancelled
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 pb-8 space-y-6">
          <div className="border-t border-b border-gray-200 py-6">
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
            <p className="text-sm text-gray-700 leading-relaxed">
              Your {membershipData.planName} membership has been successfully cancelled. You will
              continue to have access to premium features until the expiration date. No further
              charges will apply.
            </p>
          </div>

          <div className="flex items-center gap-4 justify-center">
            <Button
              onClick={handleRejoin}
              variant="outline"
              className="px-8 h-12 border-2 border-gray-900 text-gray-900 hover:bg-gray-50 font-semibold text-base"
            >
              Rejoin
            </Button>

            <Button
              onClick={handleReturnToAccount}
              className="px-8 h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base"
            >
              Return to Account
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-center text-gray-600">
              If you have any questions or need further assistance, please visit our FAQs or contact
              our support team.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
