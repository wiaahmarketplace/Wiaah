'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddHotelRoomForm } from './forms/add-hotel-room-form';
import { AddPropertyForm } from './forms/add-property-form';
import { AddDishForm } from './forms/add-dish-form';
import { AddVehicleForm } from './forms/add-vehicle-form';
import { AddBeautyServiceForm } from './forms/add-beauty-service-form';
import { AddHealthServiceForm } from './forms/add-health-service-form';
import { AddCoachingServiceForm } from './forms/add-coaching-service-form';
import { AddTradespeopleForm } from './forms/add-tradespeople-form';
import { AddChildcareForm } from './forms/add-childcare-form';
import { AddTourismForm } from './forms/add-tourism-form';
import { AddGenericServiceForm } from './forms/add-generic-service-form';

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceCategory: string;
}

const SERVICE_TITLES: Record<string, string> = {
  'hotels': 'Add New Room',
  'holiday-rentals': 'Add New Property',
  'restaurants': 'Add New Dish',
  'vehicle': 'Add New Vehicle',
  'beauty-centers': 'Add New Beauty Service',
  'mobile-beauty': 'Add New Mobile Beauty Service',
  'health-centers': 'Add New Health Service',
  'coaching-personal-growth': 'Add New Coaching Session',
  'family-childcare': 'Add New Childcare Service',
  'lifestyle-creative': 'Add New Creative Service',
  'local-tourism': 'Add New Tour',
  'tradespeople': 'Add New Trade Service',
  'weddings': 'Add New Wedding Service',
};

export function AddServiceDialog({ open, onOpenChange, serviceCategory }: AddServiceDialogProps) {
  const title = SERVICE_TITLES[serviceCategory] || 'Add New Service';

  const renderForm = () => {
    switch (serviceCategory) {
      case 'hotels':
        return <AddHotelRoomForm onSuccess={() => onOpenChange(false)} />;
      case 'holiday-rentals':
        return <AddPropertyForm onSuccess={() => onOpenChange(false)} />;
      case 'restaurants':
        return <AddDishForm onSuccess={() => onOpenChange(false)} />;
      case 'vehicle':
        return <AddVehicleForm onSuccess={() => onOpenChange(false)} />;
      case 'beauty-centers':
      case 'mobile-beauty':
        return <AddBeautyServiceForm onSuccess={() => onOpenChange(false)} serviceCategory={serviceCategory} />;
      case 'health-centers':
        return <AddHealthServiceForm onSuccess={() => onOpenChange(false)} />;
      case 'coaching-personal-growth':
        return <AddCoachingServiceForm onSuccess={() => onOpenChange(false)} />;
      case 'tradespeople':
        return <AddTradespeopleForm onSuccess={() => onOpenChange(false)} />;
      case 'family-childcare':
        return <AddChildcareForm onSuccess={() => onOpenChange(false)} />;
      case 'local-tourism':
        return <AddTourismForm onSuccess={() => onOpenChange(false)} />;
      case 'lifestyle-creative':
      case 'weddings':
      default:
        return <AddGenericServiceForm onSuccess={() => onOpenChange(false)} serviceCategory={serviceCategory} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}
