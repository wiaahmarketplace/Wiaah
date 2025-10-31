"use client";

import { useState } from "react";
import { ServiceSidebar } from "@/components/service-sidebar";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/optimized-image";
import { FileDown } from "lucide-react";
import { generateAffiliationHistoryPDF } from "@/lib/pdf-generator";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";
import { Header } from "@/components/header";

const affiliationData = [
  {
    id: 1,
    serviceImage: "https://images.pexels.com/photos/3738334/pexels-photo-3738334.jpeg?auto=compress&cs=tinysrgb&w=100",
    serviceName: "Sample Service 1",
    servicePrice: 99.99,
    affiliator: "affiliate_user",
    purchaser: "purchaser_user",
    commission: 5,
    commissionAmount: 10.5,
  },
  {
    id: 2,
    serviceImage: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=100",
    serviceName: "Sample Service 2",
    servicePrice: 99.99,
    affiliator: "affiliate_user",
    purchaser: "purchaser_user",
    commission: 5,
    commissionAmount: 10.5,
  },
  {
    id: 3,
    serviceImage: "https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg?auto=compress&cs=tinysrgb&w=100",
    serviceName: "Sample Service 3",
    servicePrice: 99.99,
    affiliator: "affiliate_user",
    purchaser: "purchaser_user",
    commission: 5,
    commissionAmount: 10.5,
  },
  {
    id: 4,
    serviceImage: "https://images.pexels.com/photos/5473184/pexels-photo-5473184.jpeg?auto=compress&cs=tinysrgb&w=100",
    serviceName: "Sample Service 4",
    servicePrice: 99.99,
    affiliator: "affiliate_user",
    purchaser: "purchaser_user",
    commission: 5,
    commissionAmount: 10.5,
  },
  {
    id: 5,
    serviceImage: "https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=100",
    serviceName: "Sample Service 5",
    servicePrice: 99.99,
    affiliator: "affiliate_user",
    purchaser: "purchaser_user",
    commission: 5,
    commissionAmount: 10.5,
  },
];

export default function AffiliationHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(affiliationData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = affiliationData.slice(startIndex, endIndex);

  const totalCommission = affiliationData.reduce((sum, item) => sum + item.commissionAmount, 0);

  const handleDownloadPDF = () => {
    try {
      generateAffiliationHistoryPDF(affiliationData);
      toast.success("Affiliation history report downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download report. Please try again.");
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ServiceSidebar activePage="affiliation-history" />

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Affiliation History</h1>
              <Button
                onClick={handleDownloadPDF}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <FileDown className="w-4 h-4 mr-2" />
                pdf
              </Button>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Service Image</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Service Name</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Service Price</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Affiliator</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Purchaser</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Commission</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Commission Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            <OptimizedImage
                              src={item.serviceImage}
                              alt={item.serviceName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">{item.serviceName}</td>
                        <td className="py-4 px-6 text-sm text-gray-900">${item.servicePrice.toFixed(2)}</td>
                        <td className="py-4 px-6 text-sm text-gray-900">{item.affiliator}</td>
                        <td className="py-4 px-6 text-sm text-gray-900">{item.purchaser}</td>
                        <td className="py-4 px-6 text-sm text-gray-900">{item.commission}%</td>
                        <td className="py-4 px-6 text-sm text-gray-900">${item.commissionAmount.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-200 bg-gray-50 py-4 px-6">
                <div className="flex justify-end items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">Total Money:</span>
                  <span className="text-sm font-bold text-gray-900">${totalCommission.toFixed(1)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 py-4 px-6">
                <div className="flex justify-end">
                  <span className="text-sm text-gray-600">Commission summary</span>
                </div>
              </div>

              <div className="border-t border-gray-200 py-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
