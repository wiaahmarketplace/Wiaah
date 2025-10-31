"use client";

import { Star, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServiceListingProps {
  category: string;
  services: any[];
}

export function ServiceListing({ category, services }: ServiceListingProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {services.map((service) => (
        <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow border-0">
          <Link href={`/booking/${category}/${service.id}`}>
            <div className="cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                {service.priceRange && (
                  <div className="absolute top-3 left-3 bg-gray-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {service.priceRange}
                  </div>
                )}
                {service.hourlyRate && (
                  <div className="absolute top-3 left-3 bg-gray-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${service.hourlyRate}/hr
                  </div>
                )}
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
            {service.lat && service.lng && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/map?lat=${service.lat}&lng=${service.lng}&type=${category}&id=${service.id}&name=${encodeURIComponent(service.name)}`);
                }}
                variant="outline"
                size="sm"
                className="w-full gap-2 text-xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                Show on map
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
