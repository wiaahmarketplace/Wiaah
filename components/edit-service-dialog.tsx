'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { AddHotelRoomForm } from './forms/add-hotel-room-form';
// import { AddPropertyForm } from './forms/add-property-form';
// import { AddDishForm } from './forms/add-dish-form';
// import { AddVehicleForm } from './forms/add-vehicle-form';
// import { AddBeautyServiceForm } from './forms/add-beauty-service-form';
// import { AddHealthServiceForm } from './forms/add-health-service-form';
// import { AddCoachingServiceForm } from './forms/add-coaching-service-form';

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceCategory: string;
  serviceId: string;
}

const SERVICE_TITLES: Record<string, string> = {
  'hotels': 'Edit Room',
  'holiday-rentals': 'Edit Property',
  'restaurants': 'Edit Dish',
  'vehicle': 'Edit Vehicle',
  'beauty-centers': 'Edit Beauty Service',
  'mobile-beauty': 'Edit Mobile Beauty Service',
  'health-centers': 'Edit Health Service',
  'coaching-personal-growth': 'Edit Coaching Session',
  'family-childcare': 'Edit Childcare Service',
  'lifestyle-creative': 'Edit Creative Service',
  'local-tourism': 'Edit Tour',
  'tradespeople': 'Edit Trade Service',
  'weddings': 'Edit Wedding Service',
};

export function EditServiceDialog({ open, onOpenChange, serviceCategory, serviceId }: EditServiceDialogProps) {
  const title = SERVICE_TITLES[serviceCategory] || 'Edit Service';

  const renderForm = () => {
    return <div className="p-6 text-center text-gray-500">Edit form coming soon for {serviceCategory}</div>;
    // switch (serviceCategory) {
    //   case 'hotels':
    //     return <AddHotelRoomForm onSuccess={() => onOpenChange(false)} />;
    //   case 'holiday-rentals':
    //     return <AddPropertyForm onSuccess={() => onOpenChange(false)} />;
    //   case 'restaurants':
    //     return <AddDishForm onSuccess={() => onOpenChange(false)} />;
    //   case 'vehicle':
    //     return <AddVehicleForm onSuccess={() => onOpenChange(false)} />;
    //   case 'beauty-centers':
    //   case 'mobile-beauty':
    //     return <AddBeautyServiceForm onSuccess={() => onOpenChange(false)} serviceCategory={serviceCategory} />;
    //   case 'health-centers':
    //     return <AddHealthServiceForm onSuccess={() => onOpenChange(false)} />;
    //   case 'coaching-personal-growth':
    //     return <AddCoachingServiceForm onSuccess={() => onOpenChange(false)} />;
    //   default:
    //     return <AddBeautyServiceForm onSuccess={() => onOpenChange(false)} serviceCategory={serviceCategory} />;
    // }
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
