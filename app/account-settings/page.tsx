"use client";

import { useState } from "react";
import { Settings, Key, ShieldCheck, Bell, ChartBar as BarChart3, Share2, CreditCard, Ban, Trash2, Database, Cake, Mail, Phone, Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/optimized-image";
import Link from "next/link";
import { EditDateOfBirthDialog } from "@/components/edit-date-of-birth-dialog";
import { EditPhoneDialog } from "@/components/edit-phone-dialog";
import { EditCountryDialog } from "@/components/edit-country-dialog";
import { EditLanguageDialog } from "@/components/edit-language-dialog";
import { EditUsernameDialog } from "@/components/edit-username-dialog";
import { DownloadDataDialog } from "@/components/download-data-dialog";
import { Header } from "@/components/header";

const menuItems = [
  { id: "account", label: "Account", icon: Settings },
  { id: "password", label: "Password", icon: Key },
  { id: "verification", label: "My Verification", icon: ShieldCheck },
  { id: "notification", label: "Notification", icon: Bell },
  { id: "statistics", label: "My Profile Statistics", icon: BarChart3 },
  { id: "share", label: "Share Your Wiaah Qr", icon: Share2 },
  { id: "membership", label: "Your Membership", icon: CreditCard },
  { id: "blocklist", label: "Blocklist", icon: Ban },
  { id: "personalization", label: "Personalization and data", icon: Database },
];

export default function AccountSettingsPage() {
  const [activeSection, setActiveSection] = useState("account");
  const [dateOfBirth, setDateOfBirth] = useState("2025-03-15");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("English");
  const [username, setUsername] = useState("vinodjaspa");

  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-200 min-h-screen bg-white">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                if (item.id === "password") {
                  return (
                    <Link key={item.id} href="/account-settings/password">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </Link>
                  );
                }

                if (item.id === "notification") {
                  return (
                    <Link key={item.id} href="/account-settings/notification">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </Link>
                  );
                }

                if (item.id === "share") {
                  return (
                    <Link key={item.id} href="/account-settings/share-qr">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </Link>
                  );
                }

                if (item.id === "membership") {
                  return (
                    <Link key={item.id} href="/account-settings/membership">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </Link>
                  );
                }

                if (item.id === "blocklist") {
                  return (
                    <Link key={item.id} href="/account-settings/blocklist">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </Link>
                  );
                }

                if (item.id === "verification") {
                  return (
                    <Link key={item.id} href="/account-settings/verification">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </Link>
                  );
                }

                if (item.id === "statistics") {
                  return (
                    <Link key={item.id} href="/account-settings/profile-statistics">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </Link>
                  );
                }

                if (item.id === "personalization") {
                  return (
                    <Link key={item.id} href="/account-settings/personalization-data">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Account</h2>

          {/* Account Information */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <Cake className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                    <p className="text-sm text-gray-600">
                      {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsDateDialogOpen(true)}
                >
                  Edit
                </Button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">vintujaspa93@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Number</p>
                    <p className="text-sm text-gray-600">{phoneNumber || 'Not set'}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsPhoneDialogOpen(true)}
                >
                  Edit
                </Button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Country</p>
                    <p className="text-sm text-gray-600">{country || 'Not set'}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsCountryDialogOpen(true)}
                >
                  Edit
                </Button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <Languages className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Language</p>
                    <p className="text-sm text-gray-600">{language}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsLanguageDialogOpen(true)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Account Overview */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Overview</h3>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <OptimizedImage
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Vinod Jaspa</p>
                  <p className="text-sm text-gray-600">@{username}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-gray-900 hover:bg-gray-100"
                onClick={() => setIsUsernameDialogOpen(true)}
              >
                Edit
              </Button>
            </div>
          </div>

          {/* App Permissions */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">App Permissions</h3>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-base font-semibold text-gray-900 mb-1">Manage App Permissions</p>
                <p className="text-sm text-gray-600">Manage which apps can access your account</p>
              </div>
              <Link href="/account-settings/app-permissions">
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Manage
                </Button>
              </Link>
            </div>
          </div>

          {/* Third-Party Access */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Third-Party Access</h3>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-base font-semibold text-gray-900 mb-1">Manage Third-Party Access</p>
                <p className="text-sm text-gray-600">Manage which third-party services can access your account</p>
              </div>
              <Link href="/account-settings/third-party-access">
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Manage
                </Button>
              </Link>
            </div>
          </div>

          {/* Data Management */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Data Management</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="text-base font-semibold text-gray-900 mb-1">Download Your Data</p>
                  <p className="text-sm text-gray-600">Download a copy of your account data</p>
                </div>
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsDownloadDialogOpen(true)}
                >
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="text-base font-semibold text-gray-900 mb-1">Account Deletion</p>
                  <p className="text-sm text-gray-600">Delete or suspend your account</p>
                </div>
                <Link href="/account-settings/account-management">
                  <Button
                    variant="ghost"
                    className="text-gray-900 hover:bg-gray-100"
                  >
                    Manage
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditDateOfBirthDialog
        open={isDateDialogOpen}
        onOpenChange={setIsDateDialogOpen}
        currentDate={dateOfBirth}
        onSave={setDateOfBirth}
      />

      <EditPhoneDialog
        open={isPhoneDialogOpen}
        onOpenChange={setIsPhoneDialogOpen}
        currentPhone={phoneNumber}
        onSave={setPhoneNumber}
      />

      <EditCountryDialog
        open={isCountryDialogOpen}
        onOpenChange={setIsCountryDialogOpen}
        currentCountry={country}
        onSave={setCountry}
      />

      <EditLanguageDialog
        open={isLanguageDialogOpen}
        onOpenChange={setIsLanguageDialogOpen}
        currentLanguage={language}
        onSave={setLanguage}
      />

      <EditUsernameDialog
        open={isUsernameDialogOpen}
        onOpenChange={setIsUsernameDialogOpen}
        currentUsername={username}
        onSave={setUsername}
      />

      <DownloadDataDialog
        open={isDownloadDialogOpen}
        onOpenChange={setIsDownloadDialogOpen}
      />
    </div>
  );
}
