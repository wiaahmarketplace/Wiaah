"use client";

import { useState } from "react";
import { Star, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { serviceCategories, servicesData } from "@/lib/services-data";
import { Header } from "@/components/header";

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("hotels");
  const router = useRouter();

  const filteredServices = servicesData[selectedCategory] || [];

  const handleShowOnMap = (service: any) => {
    router.push(`/map?service=${service.id}&lat=${service.latitude || 40.7128}&lng=${service.longitude || -74.0060}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 overflow-x-hidden">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                  selectedCategory === category.slug
                    ? "bg-red-600 text-white border border-red-600"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-red-500 hover:bg-red-50"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow border-0">
              <Link href={`/booking/${selectedCategory}/${service.id}`}>
                <div className="cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-gray-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {service.priceRange || `$${service.hourlyRate}/hr`}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                {service.username && service.userAvatar && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/profile/${service.username}`);
                    }}
                    className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={service.userAvatar} />
                      <AvatarFallback>{service.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-gray-900">@{service.username}</span>
                  </button>
                )}
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{service.location}</p>
                <p className="text-sm text-emerald-600 font-medium mb-3">{service.specialty}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {service.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({service.reviews} reviews)
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-gray-300 hover:bg-gray-50"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShowOnMap(service);
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  Show on map
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
