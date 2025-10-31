"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowLeft, Shield, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function VerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [frontIdImage, setFrontIdImage] = useState<string | null>(null);
  const [backIdImage, setBackIdImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "2025-03-15",
    address: "",
    city: "",
    zipCode: "",
    state: "",
    country: "",
    idNumber: "",
    idExpiration: "",
  });

  const totalSteps = 6;

  const handleFileUpload = (type: "front" | "back" | "selfie", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === "front") {
          setFrontIdImage(result);
        } else if (type === "back") {
          setBackIdImage(result);
        } else {
          setSelfieImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartVerification = () => {
    setCurrentStep(1);
  };

  const handleUploadContinue = () => {
    if (!frontIdImage || !backIdImage || !selfieImage) {
      toast({
        title: "Missing Information",
        description: "Please upload all required documents",
        variant: "destructive",
      });
      return;
    }
    setPreviewImage(frontIdImage);
    setCurrentStep(2);
  };

  const handlePreviewConfirm = () => {
    setCurrentStep(3);
  };

  const handleUploadNewImage = () => {
    setFrontIdImage(null);
    setBackIdImage(null);
    setCurrentStep(1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setCurrentStep(4);
  };

  const handleFinalContinue = () => {
    toast({
      title: "Verification Submitted",
      description: "Your identity verification has been submitted for review",
    });
    router.push("/account-settings");
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-200 min-h-screen bg-white">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
            </div>

            <nav className="space-y-1">
              <Link href="/account-settings">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100">
                  <span className="text-sm font-medium">Account</span>
                </button>
              </Link>
              <Link href="/account-settings/password">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100">
                  <span className="text-sm font-medium">Password</span>
                </button>
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors bg-gray-200 text-gray-900">
                <span className="text-sm font-medium">My Verification</span>
              </button>
              <Link href="/account-settings/notification">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100">
                  <span className="text-sm font-medium">Notification</span>
                </button>
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100">
                <span className="text-sm font-medium">My Profile Statistics</span>
              </button>
              <Link href="/account-settings/share-qr">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100">
                  <span className="text-sm font-medium">Share Your Wiaah Qr</span>
                </button>
              </Link>
              <Link href="/account-settings/membership">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100">
                  <span className="text-sm font-medium">Your Membership</span>
                </button>
              </Link>
              <Link href="/account-settings/blocklist">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100">
                  <span className="text-sm font-medium">Blocklist</span>
                </button>
              </Link>
              <Link href="/account-settings/personalization-data">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100">
                  <span className="text-sm font-medium">Personalization and data</span>
                </button>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-12">
          {/* Progress Dots */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? "bg-gray-900" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 0: Introduction */}
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Verify your identity</h2>
              <p className="text-base text-gray-600 mb-12">
                To help keep our community safe, we'll need to verify your identity. This helps us
                confirm you're a real person and reduces fraud.
              </p>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                  <Shield className="w-8 h-8 text-gray-700 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Verify your identity</h3>
                    <p className="text-sm text-gray-600">
                      Confirm your identity with a government-issued ID
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                  <Shield className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Your information is safe</h3>
                    <p className="text-sm text-gray-600">
                      We'll never share your information with anyone
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStartVerification}
                className="bg-black hover:bg-gray-800 text-white px-12 h-14 text-base font-semibold rounded-full"
              >
                Start verification
              </Button>
            </div>
          )}

          {/* Step 1: Upload Documents */}
          {currentStep === 1 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload your ID</h2>
              <p className="text-base text-gray-600 mb-12">
                Take a photo of your government-issued ID. Make sure it's clear.
              </p>

              <div className="space-y-8 mb-12">
                {/* Front of ID */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Upload front of ID
                  </h3>
                  {frontIdImage ? (
                    <div className="text-center">
                      <img
                        src={frontIdImage}
                        alt="Front of ID"
                        className="max-w-sm mx-auto rounded-lg mb-4"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setFrontIdImage(null)}
                        className="text-gray-900"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("front", e)}
                        className="hidden"
                        id="front-upload"
                      />
                      <label htmlFor="front-upload">
                        <Button
                          variant="outline"
                          className="text-gray-900 border-gray-300 hover:bg-gray-100 cursor-pointer"
                          asChild
                        >
                          <span>Upload</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>

                {/* Back of ID */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Upload back of ID
                  </h3>
                  {backIdImage ? (
                    <div className="text-center">
                      <img
                        src={backIdImage}
                        alt="Back of ID"
                        className="max-w-sm mx-auto rounded-lg mb-4"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setBackIdImage(null)}
                        className="text-gray-900"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("back", e)}
                        className="hidden"
                        id="back-upload"
                      />
                      <label htmlFor="back-upload">
                        <Button
                          variant="outline"
                          className="text-gray-900 border-gray-300 hover:bg-gray-100 cursor-pointer"
                          asChild
                        >
                          <span>Upload</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>

                {/* Selfie with ID */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    Take a selfie while holding your ID next to your face
                  </h3>
                  {selfieImage ? (
                    <div className="text-center">
                      <img
                        src={selfieImage}
                        alt="Selfie with ID"
                        className="max-w-sm mx-auto rounded-lg mb-4"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setSelfieImage(null)}
                        className="text-gray-900"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) => handleFileUpload("selfie", e)}
                        className="hidden"
                        id="selfie-upload"
                      />
                      <label htmlFor="selfie-upload">
                        <Button
                          variant="outline"
                          className="text-gray-900 border-gray-300 hover:bg-gray-100 cursor-pointer gap-2"
                          asChild
                        >
                          <span>
                            <Camera className="w-4 h-4" />
                            Open Camera
                          </span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="text-gray-900 border-gray-300 hover:bg-gray-100 px-12 h-14 text-base font-semibold rounded-full"
                >
                  Back
                </Button>
                <Button
                  onClick={handleUploadContinue}
                  className="bg-black hover:bg-gray-800 text-white px-12 h-14 text-base font-semibold rounded-full"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Preview ID */}
          {currentStep === 2 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Preview your ID</h2>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Government-Issued Document
                </h3>
                <p className="text-base text-gray-600 mb-8 text-center">
                  (ID card, Passport, driver's License)
                </p>

                <p className="text-base text-gray-700 mb-8 text-center">
                  Please provide a clear and valid copy of your government-issued identification
                  document (such as a passport, driver's license, or national ID card)
                </p>

                {previewImage && (
                  <div className="flex justify-center mb-8">
                    <img
                      src={previewImage}
                      alt="ID Preview"
                      className="max-w-2xl rounded-lg shadow-lg"
                    />
                  </div>
                )}

                <p className="text-sm text-gray-600 text-center">
                  Make sure all details are clear and legible. If not, please upload a new image.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleUploadNewImage}
                  className="text-gray-900 border-gray-300 hover:bg-gray-100 px-8 h-12 text-base font-semibold"
                >
                  Upload new image
                </Button>
                <Button
                  onClick={handlePreviewConfirm}
                  className="bg-black hover:bg-gray-800 text-white px-8 h-12 text-base font-semibold"
                >
                  Confirm and submit
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Information Review */}
          {currentStep === 3 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">ID Information Review</h2>
              <p className="text-base text-gray-600 mb-8">
                Please review the information extracted from the document and make any necessary
                edits to ensure accuracy.
              </p>

              <div className="space-y-6 mb-12">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-base font-semibold text-gray-900">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-base font-semibold text-gray-900">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-base font-semibold text-gray-900">
                      Date of birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-base font-semibold text-gray-900">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city" className="text-base font-semibold text-gray-900">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-base font-semibold text-gray-900">
                      Zip Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="state" className="text-base font-semibold text-gray-900">
                      State
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-base font-semibold text-gray-900">
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="idNumber" className="text-base font-semibold text-gray-900">
                    ID Number (if applicable)
                  </Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="idExpiration" className="text-base font-semibold text-gray-900">
                    ID Expiration Date
                  </Label>
                  <Input
                    id="idExpiration"
                    type="date"
                    value={formData.idExpiration}
                    onChange={(e) => handleInputChange("idExpiration", e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="text-gray-900 border-gray-300 hover:bg-gray-100 px-12 h-14 text-base font-semibold rounded-full"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-black hover:bg-gray-800 text-white px-12 h-14 text-base font-semibold rounded-full"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success Confirmation */}
          {currentStep === 4 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Identity verification</h2>

              <p className="text-xl text-center text-gray-900 mb-12">
                Your identity has been successfully verified.
              </p>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Personal Information</h3>
                    <p className="text-sm text-gray-600">Submitted</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Government ID</h3>
                    <p className="text-sm text-gray-600">Submitted</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Selfie Verification</h3>
                    <p className="text-sm text-gray-600">Submitted</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center mb-8">
                We're currently reviewing your information. This process usually takes 1-2 business
                days. You'll receive an email notification once your verification is complete.
              </p>

              <div className="flex justify-end">
                <Button
                  onClick={handleFinalContinue}
                  className="bg-black hover:bg-gray-800 text-white px-12 h-14 text-base font-semibold rounded-full"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
