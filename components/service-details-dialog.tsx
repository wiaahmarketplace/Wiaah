'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, DollarSign, User, MapPin, Info } from 'lucide-react';

interface Service {
  id: string;
  serviceId: string;
  name: string;
  category: string;
  price: string;
  availability: string;
  duration: string;
  lastUpdated: string;
  image: string;
}

interface ServiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

export function ServiceDetailsDialog({ open, onOpenChange, service }: ServiceDetailsDialogProps) {
  if (!service) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-orange-100 text-orange-800';
      case 'pending approval':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Service Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{service.serviceId}</p>
              </div>
              <Badge className={getStatusColor(service.availability)}>
                {service.availability}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Category</p>
                  <p className="text-sm text-gray-900">{service.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Price</p>
                  <p className="text-sm text-gray-900">{service.price}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-sm text-gray-900">{service.duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Updated</p>
                  <p className="text-sm text-gray-900">{service.lastUpdated}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                This is a placeholder description for the service. In a real implementation,
                this would contain detailed information about the service, its features,
                what's included, and any other relevant details that customers should know.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Key Features</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />
                  <span className="text-sm text-gray-600">Professional service delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />
                  <span className="text-sm text-gray-600">Flexible scheduling options</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />
                  <span className="text-sm text-gray-600">Quality guaranteed</span>
                </li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Booking Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">45</p>
                  <p className="text-xs text-gray-600 mt-1">Total Bookings</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-xs text-gray-600 mt-1">Average Rating</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-xs text-gray-600 mt-1">Satisfaction</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Service Information</p>
                <p className="text-xs text-blue-700 mt-1">
                  This service is currently {service.availability.toLowerCase()}. For real-time
                  availability and booking options, please check the reservation calendar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
