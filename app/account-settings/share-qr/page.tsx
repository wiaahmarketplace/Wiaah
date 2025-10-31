"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowLeft, Download, Share2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ShareDialog } from "@/components/share-dialog";

export default function ShareQRPage() {
  const { toast } = useToast();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleDownloadJPG = () => {
    toast({
      title: "Success",
      description: "QR code downloaded as JPG",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Success",
      description: "QR code downloaded as PDF",
    });
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <div className="flex-1 p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Share your Wiaah QR</h2>
            <Link href="/account-settings">
              <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Account
              </Button>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-12">Your Wiaah QR.</h3>

              {/* QR Code Display */}
              <div className="mb-12">
                <div className="w-96 h-96 bg-white border-4 border-gray-200 rounded-lg p-8 flex items-center justify-center">
                  <svg
                    width="320"
                    height="320"
                    viewBox="0 0 29 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    {/* QR Code Pattern - This is a simplified representation */}
                    {/* Top-left corner */}
                    <rect x="0" y="0" width="7" height="7" fill="black" />
                    <rect x="1" y="1" width="5" height="5" fill="white" />
                    <rect x="2" y="2" width="3" height="3" fill="black" />

                    {/* Top-right corner */}
                    <rect x="22" y="0" width="7" height="7" fill="black" />
                    <rect x="23" y="1" width="5" height="5" fill="white" />
                    <rect x="24" y="2" width="3" height="3" fill="black" />

                    {/* Bottom-left corner */}
                    <rect x="0" y="22" width="7" height="7" fill="black" />
                    <rect x="1" y="23" width="5" height="5" fill="white" />
                    <rect x="2" y="24" width="3" height="3" fill="black" />

                    {/* Data pattern - simplified pattern */}
                    <rect x="8" y="0" width="1" height="1" fill="black" />
                    <rect x="10" y="0" width="1" height="1" fill="black" />
                    <rect x="12" y="0" width="1" height="1" fill="black" />
                    <rect x="14" y="0" width="1" height="1" fill="black" />
                    <rect x="16" y="0" width="1" height="1" fill="black" />
                    <rect x="18" y="0" width="1" height="1" fill="black" />
                    <rect x="20" y="0" width="1" height="1" fill="black" />

                    <rect x="8" y="2" width="1" height="1" fill="black" />
                    <rect x="10" y="2" width="1" height="1" fill="black" />
                    <rect x="11" y="2" width="1" height="1" fill="black" />
                    <rect x="13" y="2" width="1" height="1" fill="black" />
                    <rect x="15" y="2" width="1" height="1" fill="black" />
                    <rect x="17" y="2" width="1" height="1" fill="black" />
                    <rect x="19" y="2" width="1" height="1" fill="black" />

                    <rect x="8" y="4" width="1" height="1" fill="black" />
                    <rect x="9" y="4" width="1" height="1" fill="black" />
                    <rect x="11" y="4" width="1" height="1" fill="black" />
                    <rect x="13" y="4" width="1" height="1" fill="black" />
                    <rect x="14" y="4" width="1" height="1" fill="black" />
                    <rect x="16" y="4" width="1" height="1" fill="black" />
                    <rect x="18" y="4" width="1" height="1" fill="black" />
                    <rect x="20" y="4" width="1" height="1" fill="black" />

                    <rect x="8" y="6" width="1" height="1" fill="black" />
                    <rect x="10" y="6" width="1" height="1" fill="black" />
                    <rect x="12" y="6" width="1" height="1" fill="black" />
                    <rect x="15" y="6" width="1" height="1" fill="black" />
                    <rect x="17" y="6" width="1" height="1" fill="black" />
                    <rect x="19" y="6" width="1" height="1" fill="black" />

                    {/* Middle section pattern */}
                    <rect x="0" y="8" width="1" height="1" fill="black" />
                    <rect x="2" y="8" width="1" height="1" fill="black" />
                    <rect x="4" y="8" width="1" height="1" fill="black" />
                    <rect x="6" y="8" width="1" height="1" fill="black" />
                    <rect x="8" y="8" width="1" height="1" fill="black" />
                    <rect x="10" y="8" width="1" height="1" fill="black" />
                    <rect x="12" y="8" width="1" height="1" fill="black" />
                    <rect x="14" y="8" width="1" height="1" fill="black" />
                    <rect x="16" y="8" width="1" height="1" fill="black" />
                    <rect x="18" y="8" width="1" height="1" fill="black" />
                    <rect x="20" y="8" width="1" height="1" fill="black" />
                    <rect x="22" y="8" width="1" height="1" fill="black" />
                    <rect x="24" y="8" width="1" height="1" fill="black" />
                    <rect x="26" y="8" width="1" height="1" fill="black" />
                    <rect x="28" y="8" width="1" height="1" fill="black" />

                    {/* More data patterns */}
                    <rect x="9" y="10" width="1" height="1" fill="black" />
                    <rect x="10" y="10" width="1" height="1" fill="black" />
                    <rect x="12" y="10" width="1" height="1" fill="black" />
                    <rect x="14" y="10" width="1" height="1" fill="black" />
                    <rect x="15" y="10" width="1" height="1" fill="black" />
                    <rect x="17" y="10" width="1" height="1" fill="black" />
                    <rect x="19" y="10" width="1" height="1" fill="black" />

                    <rect x="8" y="12" width="1" height="1" fill="black" />
                    <rect x="10" y="12" width="1" height="1" fill="black" />
                    <rect x="11" y="12" width="1" height="1" fill="black" />
                    <rect x="13" y="12" width="1" height="1" fill="black" />
                    <rect x="15" y="12" width="1" height="1" fill="black" />
                    <rect x="16" y="12" width="1" height="1" fill="black" />
                    <rect x="18" y="12" width="1" height="1" fill="black" />
                    <rect x="20" y="12" width="1" height="1" fill="black" />

                    <rect x="9" y="14" width="1" height="1" fill="black" />
                    <rect x="11" y="14" width="1" height="1" fill="black" />
                    <rect x="12" y="14" width="1" height="1" fill="black" />
                    <rect x="14" y="14" width="1" height="1" fill="black" />
                    <rect x="16" y="14" width="1" height="1" fill="black" />
                    <rect x="17" y="14" width="1" height="1" fill="black" />
                    <rect x="19" y="14" width="1" height="1" fill="black" />

                    <rect x="8" y="16" width="1" height="1" fill="black" />
                    <rect x="10" y="16" width="1" height="1" fill="black" />
                    <rect x="13" y="16" width="1" height="1" fill="black" />
                    <rect x="15" y="16" width="1" height="1" fill="black" />
                    <rect x="18" y="16" width="1" height="1" fill="black" />
                    <rect x="20" y="16" width="1" height="1" fill="black" />

                    <rect x="9" y="18" width="1" height="1" fill="black" />
                    <rect x="11" y="18" width="1" height="1" fill="black" />
                    <rect x="12" y="18" width="1" height="1" fill="black" />
                    <rect x="14" y="18" width="1" height="1" fill="black" />
                    <rect x="16" y="18" width="1" height="1" fill="black" />
                    <rect x="19" y="18" width="1" height="1" fill="black" />

                    <rect x="0" y="20" width="1" height="1" fill="black" />
                    <rect x="2" y="20" width="1" height="1" fill="black" />
                    <rect x="4" y="20" width="1" height="1" fill="black" />
                    <rect x="6" y="20" width="1" height="1" fill="black" />
                    <rect x="8" y="20" width="1" height="1" fill="black" />
                    <rect x="10" y="20" width="1" height="1" fill="black" />
                    <rect x="13" y="20" width="1" height="1" fill="black" />
                    <rect x="15" y="20" width="1" height="1" fill="black" />
                    <rect x="17" y="20" width="1" height="1" fill="black" />
                    <rect x="19" y="20" width="1" height="1" fill="black" />

                    {/* Bottom patterns */}
                    <rect x="8" y="22" width="1" height="1" fill="black" />
                    <rect x="10" y="22" width="1" height="1" fill="black" />
                    <rect x="11" y="22" width="1" height="1" fill="black" />
                    <rect x="13" y="22" width="1" height="1" fill="black" />
                    <rect x="15" y="22" width="1" height="1" fill="black" />
                    <rect x="17" y="22" width="1" height="1" fill="black" />
                    <rect x="19" y="22" width="1" height="1" fill="black" />

                    <rect x="8" y="24" width="1" height="1" fill="black" />
                    <rect x="9" y="24" width="1" height="1" fill="black" />
                    <rect x="11" y="24" width="1" height="1" fill="black" />
                    <rect x="13" y="24" width="1" height="1" fill="black" />
                    <rect x="14" y="24" width="1" height="1" fill="black" />
                    <rect x="16" y="24" width="1" height="1" fill="black" />
                    <rect x="18" y="24" width="1" height="1" fill="black" />
                    <rect x="20" y="24" width="1" height="1" fill="black" />

                    <rect x="8" y="26" width="1" height="1" fill="black" />
                    <rect x="10" y="26" width="1" height="1" fill="black" />
                    <rect x="12" y="26" width="1" height="1" fill="black" />
                    <rect x="15" y="26" width="1" height="1" fill="black" />
                    <rect x="17" y="26" width="1" height="1" fill="black" />
                    <rect x="19" y="26" width="1" height="1" fill="black" />

                    <rect x="8" y="28" width="1" height="1" fill="black" />
                    <rect x="10" y="28" width="1" height="1" fill="black" />
                    <rect x="12" y="28" width="1" height="1" fill="black" />
                    <rect x="14" y="28" width="1" height="1" fill="black" />
                    <rect x="16" y="28" width="1" height="1" fill="black" />
                    <rect x="18" y="28" width="1" height="1" fill="black" />
                    <rect x="20" y="28" width="1" height="1" fill="black" />
                  </svg>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <Button
                  onClick={handleDownloadJPG}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 text-base font-semibold rounded-lg gap-2"
                >
                  <Download className="w-5 h-5" />
                  JPG
                </Button>

                <Button
                  onClick={handleDownloadPDF}
                  className="bg-black hover:bg-gray-800 text-white px-8 h-12 text-base font-semibold rounded-lg gap-2"
                >
                  <Download className="w-5 h-5" />
                  PDF
                </Button>

                <Button
                  onClick={handleShare}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white w-12 h-12 rounded-lg p-0 flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Description */}
              <p className="text-base text-gray-700 text-center">
                Share your Wiaah QR with your friends to keep in Touch.
              </p>

              {/* Info Box */}
              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-xl">
                <div className="flex gap-3">
                  <QrCode className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">About Your QR Code</h4>
                    <p className="text-sm text-gray-600">
                      Your unique Wiaah QR code makes it easy for people to find and connect with you.
                      Simply share it or let others scan it to instantly connect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/profile/sampleuser`}
        title="Share Your QR Code"
      />
    </div>
  );
}
