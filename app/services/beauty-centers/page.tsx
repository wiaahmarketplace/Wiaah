"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceListing } from "@/components/service-listing";
import { servicesData } from "@/lib/services-data";

export default function BeautyCentersPage() {
  const beautyCenters = servicesData["beauty-centers"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/services">
            <Button variant="ghost" className="mb-4 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Beauty Centers</h1>
          <p className="text-gray-600">Discover top-rated beauty and wellness services</p>
        </div>

        <ServiceListing category="beauty-centers" services={beautyCenters} />
      </div>
    </div>
  );
}
