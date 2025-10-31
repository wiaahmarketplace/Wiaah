"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SuspendAccountDialog } from "@/components/suspend-account-dialog";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";

export default function AccountManagementPage() {
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Account Deletion</h2>
            <Link href="/account-settings">
              <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Account
              </Button>
            </Link>
          </div>

          <div className="space-y-12">
            {/* Delete Account */}
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Delete Account
                </h3>
                <p className="text-base text-gray-600">
                  Permanently delete your account and all associated data.
                  <br />
                  This action cannot be undone.
                </p>
              </div>
              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5 text-base font-semibold min-w-[140px]"
              >
                Delete
              </Button>
            </div>

            {/* Suspend Account */}
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Suspend Account
                </h3>
                <p className="text-base text-gray-600">
                  Temporarily suspend your account. You can reactivate it at any time.
                </p>
              </div>
              <Button
                onClick={() => setIsSuspendDialogOpen(true)}
                variant="outline"
                className="border-2 border-gray-300 text-gray-900 hover:bg-gray-100 px-8 py-2.5 text-base font-semibold min-w-[140px]"
              >
                Suspend
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SuspendAccountDialog
        open={isSuspendDialogOpen}
        onOpenChange={setIsSuspendDialogOpen}
      />

      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
}
