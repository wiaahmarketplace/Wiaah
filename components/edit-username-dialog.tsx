"use client";

import { useState } from "react";
import { AtSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditUsernameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername: string;
  onSave: (username: string) => void;
}

export function EditUsernameDialog({
  open,
  onOpenChange,
  currentUsername,
  onSave,
}: EditUsernameDialogProps) {
  const [username, setUsername] = useState(currentUsername);

  const handleSave = () => {
    onSave(username);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Edit Username
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-900">
              Username
            </Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="pl-10"
              />
            </div>
            <p className="text-sm text-gray-500">
              Your username is unique and used to identify your account.
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
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
