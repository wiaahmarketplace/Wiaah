"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowLeft, MapPin, Users, Image, Camera, Mic, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ManagePermissionDialog } from "@/components/manage-permission-dialog";

const permissions = [
  {
    id: "location",
    icon: MapPin,
    title: "Location",
    description: "Access your precise location for location-based features.",
  },
  {
    id: "contacts",
    icon: Users,
    title: "Contacts",
    description: "Access your contacts to find friends and connect with.",
  },
  {
    id: "photos",
    icon: Image,
    title: "Photos",
    description: "Access your photos and videos to share content and.",
  },
  {
    id: "camera",
    icon: Camera,
    title: "Camera",
    description: "Access your camera to capture photos and videos.",
  },
  {
    id: "microphone",
    icon: Mic,
    title: "Microphone",
    description: "Access your microphone to record audio for voice.",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Receive notifications to stay updated on new messages.",
  },
  {
    id: "calendar",
    icon: Calendar,
    title: "Calendar",
    description: "Access your calendar to integrate events and.",
  },
];

export default function AppPermissionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<typeof permissions[0] | null>(null);
  const [permissionStatuses, setPermissionStatuses] = useState<
    Record<string, "allow" | "deny" | "ask">
  >({
    location: "ask",
    contacts: "deny",
    photos: "allow",
    camera: "allow",
    microphone: "ask",
    notifications: "allow",
    calendar: "deny",
  });

  const handleManageClick = (permission: typeof permissions[0]) => {
    setSelectedPermission(permission);
    setIsDialogOpen(true);
  };

  const handleSavePermission = (permissionId: string, status: "allow" | "deny" | "ask") => {
    setPermissionStatuses((prev) => ({
      ...prev,
      [permissionId]: status,
    }));
  };

  const getStatusLabel = (status: "allow" | "deny" | "ask") => {
    switch (status) {
      case "allow":
        return "Allowed";
      case "deny":
        return "Denied";
      case "ask":
        return "Ask";
    }
  };

  const getStatusColor = (status: "allow" | "deny" | "ask") => {
    switch (status) {
      case "allow":
        return "text-green-600 bg-green-50";
      case "deny":
        return "text-red-600 bg-red-50";
      case "ask":
        return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">App Permissions</h2>
            <Link href="/account-settings">
              <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Account
              </Button>
            </Link>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Device Permissions</h3>

            <div className="space-y-4">
              {permissions.map((permission) => {
                const Icon = permission.icon;
                const status = permissionStatuses[permission.id];
                return (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">
                          {permission.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {permission.description}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          status
                        )}`}
                      >
                        {getStatusLabel(status)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-gray-900 hover:bg-gray-100 font-medium ml-4"
                      onClick={() => handleManageClick(permission)}
                    >
                      Manage
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ManagePermissionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        permission={selectedPermission}
        currentStatus={selectedPermission ? permissionStatuses[selectedPermission.id] : "ask"}
        onSave={handleSavePermission}
      />
    </div>
  );
}
