"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ContactSupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnId: string;
}

export function ContactSupportDialog({
  open,
  onOpenChange,
  returnId,
}: ContactSupportDialogProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    console.log("Support message submitted:", message);
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Contact Support</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Return ID</p>
            <p className="font-medium">{returnId}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">How can we help?</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors">
                <Mail className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium">Email</span>
                <span className="text-xs text-gray-600">support@shop.com</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors">
                <Phone className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium">Phone</span>
                <span className="text-xs text-gray-600">1-800-123-4567</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium">Live Chat</span>
                <span className="text-xs text-gray-600">Available 24/7</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Describe your issue
            </label>
            <Textarea
              placeholder="Please provide details about your return issue..."
              className="min-h-[150px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Response Time</h4>
            <p className="text-sm text-gray-600">
              Our support team typically responds within 24 hours. For urgent matters,
              please call our phone support line.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-black hover:bg-gray-800"
              onClick={handleSubmit}
              disabled={!message.trim()}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
