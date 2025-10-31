"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationPage() {
  const [pushNotifications, setPushNotifications] = useState<NotificationSetting[]>([
    {
      id: "pause-all",
      title: "Pause All",
      description: "Allow notifications from Connect",
      enabled: true,
    },
    {
      id: "likes",
      title: "Likes",
      description: "When someone likes or comments on your photos or videos",
      enabled: true,
    },
    {
      id: "followers",
      title: "Followers",
      description: "When someone starts following you",
      enabled: true,
    },
    {
      id: "mentions",
      title: "Mentions",
      description: "When someone mentions you in a comment or caption",
      enabled: true,
    },
    {
      id: "comments",
      title: "Comments",
      description: "When someone comments on your content",
      enabled: true,
    },
    {
      id: "shares",
      title: "Shares",
      description: "When someone shares a post with you",
      enabled: true,
    },
    {
      id: "follow-request",
      title: "Follow Request",
      description: "When someone sends you a follow request",
      enabled: false,
    },
    {
      id: "follow-request-response",
      title: "Follow Request Response",
      description: "When someone has accepted your follow request",
      enabled: false,
    },
    {
      id: "messages",
      title: "Messages",
      description: "When someone sends you a message",
      enabled: true,
    },
    {
      id: "posts-updates",
      title: "Posts Updates",
      description: "When someone you follow posts a new image or action",
      enabled: true,
    },
    {
      id: "story-updates",
      title: "Story Updates",
      description: "When someone you follow posts a new story",
      enabled: true,
    },
    {
      id: "remix",
      title: "Remix",
      description: "When someone uses your action content as mixed content",
      enabled: true,
    },
    {
      id: "orders-perks",
      title: "Orders & Perks Updates",
      description: "Updates about orders, reservations, rewards, and cashback",
      enabled: true,
    },
  ]);

  const [emailNotifications, setEmailNotifications] = useState<NotificationSetting[]>([
    {
      id: "account-activities",
      title: "Account activities",
      description: "Receive emails about password resets or security alerts",
      enabled: true,
    },
    {
      id: "product-updates",
      title: "Product Updates",
      description: "Stay informed about new features and promotions",
      enabled: true,
    },
    {
      id: "reservations-updates",
      title: "Reservations Updates",
      description: "Stay informed about new updates and promotions",
      enabled: true,
    },
    {
      id: "business-tips",
      title: "Business Tips",
      description: "Receive tips on how to grow your business",
      enabled: true,
    },
    {
      id: "news",
      title: "News",
      description: "Receive platform updates and announcements",
      enabled: true,
    },
    {
      id: "reminder",
      title: "Reminder",
      description: "Receive reminder emails about your account activities",
      enabled: true,
    },
    {
      id: "support",
      title: "Support",
      description: "Receive updates about your support requests",
      enabled: true,
    },
  ]);

  const togglePushNotification = (id: string) => {
    setPushNotifications(
      pushNotifications.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  const toggleEmailNotification = (id: string) => {
    setEmailNotifications(
      emailNotifications.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <div className="flex-1 p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
            <Link href="/account-settings">
              <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Account
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl">
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Push Notifications</h3>

              <div className="space-y-4">
                {pushNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between py-4 border-b border-gray-200"
                  >
                    <div className="flex-1 pr-6">
                      <Label className="text-base font-semibold text-gray-900 mb-1 block cursor-pointer">
                        {notification.title}
                      </Label>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => togglePushNotification(notification.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Email Notifications</h3>

              <div className="space-y-4">
                {emailNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between py-4 border-b border-gray-200"
                  >
                    <div className="flex-1 pr-6">
                      <Label className="text-base font-semibold text-gray-900 mb-1 block cursor-pointer">
                        {notification.title}
                      </Label>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => toggleEmailNotification(notification.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex gap-3">
                <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Notification Preferences
                  </h4>
                  <p className="text-sm text-gray-600">
                    You can customize your notification preferences at any time. Changes will take
                    effect immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
