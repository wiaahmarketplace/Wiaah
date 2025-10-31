"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowLeft, Smartphone, BarChart3, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ManageThirdPartyDialog } from "@/components/manage-third-party-dialog";
import { DownloadDataDialog } from "@/components/download-data-dialog";

const thirdPartyServices = [
  {
    id: "ad-partners",
    icon: Smartphone,
    title: "Settings",
    subtitle: "Ad Partners",
    description: "Show personalized ads.",
    enabled: false,
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Your Experience",
    subtitle: "Analytics Tools",
    description: "Help us improve your experience.",
    enabled: false,
  },
  {
    id: "social-networks",
    icon: Users,
    title: "Settings",
    subtitle: "Social Networks",
    description: "Share data for account syncing.",
    enabled: false,
  },
  {
    id: "payment-processors",
    icon: CreditCard,
    title: "Payment",
    subtitle: "Payment Processors",
    description: "Process your payments.",
    enabled: false,
  },
];

export default function ThirdPartyAccessPage() {
  const { toast } = useToast();
  const [services, setServices] = useState(thirdPartyServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof thirdPartyServices[0] | null>(null);

  const toggleService = (id: string) => {
    setServices(services.map(service =>
      service.id === id ? { ...service, enabled: !service.enabled } : service
    ));
  };

  const handleManageClick = (service: typeof thirdPartyServices[0]) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleSaveService = (serviceId: string, enabled: boolean, settings: any) => {
    setServices(services.map(service =>
      service.id === serviceId ? { ...service, enabled } : service
    ));
  };

  const handleCancel = () => {
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Your third-party access preferences have been saved successfully",
    });
  };

  const handleDownloadData = () => {
    setIsDownloadDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Data Sharing & Third-Party Access</h2>
            <Link href="/account-settings">
              <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Account
              </Button>
            </Link>
          </div>

          <p className="text-gray-600 mb-8">
            We care about your privacy. Below are the third parties we share your data with, and why. You can manage your permissions anytime.
          </p>

          <div className="space-y-4 mb-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900">
                        {service.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        {service.subtitle}
                      </p>
                      <p className="text-sm text-gray-500">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={service.enabled}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <Button
                      variant="ghost"
                      className="text-gray-900 hover:bg-gray-100 font-medium"
                      onClick={() => handleManageClick(service)}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <Button
              variant="ghost"
              className="text-gray-900 hover:bg-gray-100"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-900 hover:bg-gray-100"
                onClick={handleDownloadData}
              >
                Download My Data
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ManageThirdPartyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={selectedService}
        onSave={handleSaveService}
      />

      <DownloadDataDialog
        open={isDownloadDialogOpen}
        onOpenChange={setIsDownloadDialogOpen}
      />
    </div>
  );
}
