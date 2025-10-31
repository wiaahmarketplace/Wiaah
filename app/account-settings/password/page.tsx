"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowLeft, Eye, EyeOff, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirm password do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your password has been updated successfully",
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <div className="flex-1 p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Change Password</h2>
            <Link href="/account-settings">
              <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Account
              </Button>
            </Link>
          </div>

          <div className="max-w-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-base font-semibold text-gray-900">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10 h-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-base font-semibold text-gray-900">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10 h-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-base font-semibold text-gray-900">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 h-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Key className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Password Security Tips
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>Use a combination of letters, numbers, and symbols</li>
                      <li>Avoid using personal information</li>
                      <li>Don't reuse passwords from other accounts</li>
                      <li>Consider using a password manager</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  onClick={handleUpdatePassword}
                  className="bg-black text-white hover:bg-gray-800 px-8 h-12 text-base font-semibold"
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
