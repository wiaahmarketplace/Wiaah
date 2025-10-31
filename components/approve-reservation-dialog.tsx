"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

interface ApproveReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: {
    id: string;
    customer: {
      name: string;
    };
    date: string;
    time: string;
    service: string;
  } | null;
  onConfirm: (action: "approve" | "refuse", message?: string) => void;
}

export function ApproveReservationDialog({
  open,
  onOpenChange,
  reservation,
  onConfirm,
}: ApproveReservationDialogProps) {
  const [action, setAction] = useState<"approve" | "refuse" | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (action) {
      onConfirm(action, message);
      setAction(null);
      setMessage("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setAction(null);
    setMessage("");
    onOpenChange(false);
  };

  if (!reservation) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Reservation Action
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Customer:</span>
              <span className="text-sm font-medium">{reservation.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Service:</span>
              <span className="text-sm font-medium">{reservation.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date:</span>
              <span className="text-sm font-medium">{reservation.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Time:</span>
              <span className="text-sm font-medium">{reservation.time}</span>
            </div>
          </div>

          {!action && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Choose an action for this reservation:
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setAction("approve")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => setAction("refuse")}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Refuse
                </Button>
              </div>
            </div>
          )}

          {action && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                {action === "approve" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">
                  {action === "approve" ? "Approving" : "Refusing"} reservation
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  {action === "approve" ? "Confirmation message (optional)" : "Reason for refusal (optional)"}
                </Label>
                <Textarea
                  id="message"
                  placeholder={
                    action === "approve"
                      ? "Add a confirmation message to the customer..."
                      : "Explain why you're refusing this reservation..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {action ? (
            <>
              <Button variant="outline" onClick={() => setAction(null)}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className={
                  action === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                Confirm {action === "approve" ? "Approval" : "Refusal"}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
