"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface CookiePreference {
  id: string;
  title: string;
  description: string;
  items: string[];
  enabled: boolean;
  required?: boolean;
}

export default function PersonalizationDataPage() {
  const { toast } = useToast();

  const [essentialCookies, setEssentialCookies] = useState<CookiePreference>({
    id: "essential",
    title: "Essential Cookies",
    description:
      "These cookies are required to use Wiaah Company Products. They're necessary for these sites to work as intended.",
    items: ["Enable login and security", "Store user preferences", "Maintain session state"],
    enabled: true,
    required: true,
  });

  const [optionalCookies, setOptionalCookies] = useState<CookiePreference[]>([
    {
      id: "other-apps",
      title: "Our Cookies on Other Apps and Websites",
      description:
        "These cookies help other companies share information with us about your activity on their apps and websites.",
      items: [
        "Continue using Instagram to log into other apps and websites",
        "Show relevant ads using partner data",
        "Provide cross-app login support",
      ],
      enabled: false,
    },
    {
      id: "other-companies",
      title: "Cookies From Other Companies",
      description:
        "For advertising and measurement services off of Facebook Products, analytics, and to provide certain features and improve our services for you, we use tools from other companies.",
      items: [
        "Personalize ads off Instagram",
        "Measure ad performance",
        "Improve analytics and site experience",
      ],
      enabled: false,
    },
  ]);

  const handleToggleOptional = (id: string) => {
    setOptionalCookies((prev) =>
      prev.map((cookie) => (cookie.id === id ? { ...cookie, enabled: !cookie.enabled } : cookie))
    );
  };

  const handleSelectAllEssential = () => {
    // Essential cookies are always enabled
    toast({
      title: "Essential Cookies",
      description: "Essential cookies cannot be disabled as they are required for the site to function",
    });
  };

  const handleSelectAllOptional = () => {
    setOptionalCookies((prev) => prev.map((cookie) => ({ ...cookie, enabled: true })));
    toast({
      title: "Preferences Updated",
      description: "All optional cookies have been enabled",
    });
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your cookie preferences have been saved successfully",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <div className="flex-1 p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Cookies</h2>
            <Link href="/account-settings">
              <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Account
              </Button>
            </Link>
          </div>

          <div className="max-w-5xl">
            {/* Introduction */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                We use cookies to provide, personalize, and improve your experience — including the
                ads you see — help businesses with analytics and performance, and offer a safer
                experience. Learn more in our Cookie Policy. We'll remember your cookie choices and
                apply them anywhere you're logged in. You can change them anytime in your cookie
                settings.
              </p>
            </div>

            {/* Essential Cookies Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Essential Cookies</h3>
                <Button
                  variant="ghost"
                  onClick={handleSelectAllEssential}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                >
                  Select All
                </Button>
              </div>

              <p className="text-sm text-gray-700 mb-6">
                {essentialCookies.description.replace(
                  "They're",
                  "They are"
                )}
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      {essentialCookies.title}
                    </h4>
                    <p className="text-sm text-gray-700 mb-4">
                      {essentialCookies.description}
                    </p>
                    <ul className="space-y-2">
                      {essentialCookies.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-gray-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="ml-6 flex-shrink-0">
                    <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-center cursor-not-allowed">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Cookies Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Optional Cookies</h3>
                <Button
                  variant="ghost"
                  onClick={handleSelectAllOptional}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                >
                  Select All
                </Button>
              </div>

              <div className="space-y-6">
                {optionalCookies.map((cookie) => (
                  <div key={cookie.id} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">
                          {cookie.title}
                        </h4>
                        <p className="text-sm text-gray-700 mb-4">{cookie.description}</p>
                        <ul className="space-y-2">
                          {cookie.items.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-gray-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="ml-6 flex-shrink-0">
                        <Switch
                          checked={cookie.enabled}
                          onCheckedChange={() => handleToggleOptional(cookie.id)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-8 border-t border-gray-200">
              <Button
                onClick={handleSave}
                className="bg-gray-900 hover:bg-gray-800 text-white px-12 h-12 text-base font-semibold rounded-lg"
              >
                Save
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">About Cookie Settings</h4>
                  <p className="text-sm text-gray-600">
                    Your cookie preferences will be remembered across all devices where you're logged
                    in. You can update these settings at any time.
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
