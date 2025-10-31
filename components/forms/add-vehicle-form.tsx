'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadSection } from './image-upload-section';
import { AvailabilitySection } from './availability-section';
import { CancellationPolicySection } from './cancellation-policy-section';
import { AddOnsSection } from './add-ons-section';

interface AddVehicleFormProps {
  onSuccess: () => void;
}

const VEHICLE_TYPES = ['Car', 'SUV', 'Van', 'Motorcycle', 'Bicycle', 'Scooter', 'Boat', 'Camper', 'Luxury Car'];

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'LPG', 'CNG'];

const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'Semi-Automatic', 'CVT'];

const VEHICLE_FEATURES = [
  'Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging',
  'Parking Sensors', 'Backup Camera', 'Cruise Control', 'Heated Seats',
  'Sunroof', 'Child Safety Seat', 'Ski Rack', 'Bike Rack', 'Roof Box',
  'All-Wheel Drive', 'Leather Seats', 'Apple CarPlay', 'Android Auto'
];

const INSURANCE_TYPES = [
  'Basic Coverage',
  'Collision Damage Waiver',
  'Theft Protection',
  'Third Party Liability',
  'Personal Accident Insurance',
  'Full Coverage'
];

export function AddVehicleForm({ onSuccess }: AddVehicleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [availability, setAvailability] = useState<any>({});
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [addOns, setAddOns] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vehicleType: '',
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    pricePerHour: '',
    seats: '',
    fuelType: '',
    transmission: '',
    mileage: '',
    mileageLimit: '',
    extraMileageCost: '',
    minRentalDays: '1',
    location: '',
    licenseRequired: '',
    minAge: '21',
    securityDeposit: '',
    insuranceIncluded: 'basic',
    features: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to add a vehicle',
          variant: 'destructive',
        });
        return;
      }

      if (images.length === 0) {
        toast({
          title: 'Error',
          description: 'Please add at least one image',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('service_items').insert({
        user_id: user.id,
        service_category: 'vehicle',
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photos: images,
        pricing: {
          per_day: parseFloat(formData.pricePerDay) || 0,
          per_hour: parseFloat(formData.pricePerHour) || 0,
          extra_mileage_cost: formData.extraMileageCost ? parseFloat(formData.extraMileageCost) : 0,
          security_deposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : 0,
          currency: 'USD'
        },
        specifications: {
          vehicle_type: formData.vehicleType,
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          seats: parseInt(formData.seats),
          fuel_type: formData.fuelType,
          transmission: formData.transmission,
          current_mileage: formData.mileage,
          mileage_limit: formData.mileageLimit,
          min_rental_days: parseInt(formData.minRentalDays),
          license_required: formData.licenseRequired,
          min_age: parseInt(formData.minAge),
          insurance_included: formData.insuranceIncluded
        },
        amenities: formData.features,
        availability: availability,
        cancellation_policy: cancellationPolicy,
        add_ons: addOns,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vehicle added successfully',
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add vehicle',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="policy">Policy & Add-ons</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Vehicle Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Toyota Camry 2022"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the vehicle condition and features"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g., Toyota"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Camry"
                required
              />
            </div>

            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2022"
                required
              />
            </div>

            <div>
              <Label htmlFor="seats">Seats *</Label>
              <Input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                placeholder="5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuelType">Fuel Type *</Label>
              <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transmission">Transmission *</Label>
              <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSION_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder="e.g., 25000 km"
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Features</Label>
            <div className="grid grid-cols-3 gap-3">
              {VEHICLE_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() => toggleFeature(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricePerDay">Price per Day (USD) *</Label>
              <Input
                id="pricePerDay"
                type="number"
                step="0.01"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                placeholder="50.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="pricePerHour">Price per Hour (USD)</Label>
              <Input
                id="pricePerHour"
                type="number"
                step="0.01"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                placeholder="10.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileageLimit">Mileage Limit per Day</Label>
              <Input
                id="mileageLimit"
                value={formData.mileageLimit}
                onChange={(e) => setFormData({ ...formData, mileageLimit: e.target.value })}
                placeholder="e.g., 100 km/day or Unlimited"
              />
            </div>

            <div>
              <Label htmlFor="extraMileageCost">Extra Mileage Cost (USD/km)</Label>
              <Input
                id="extraMileageCost"
                type="number"
                step="0.01"
                value={formData.extraMileageCost}
                onChange={(e) => setFormData({ ...formData, extraMileageCost: e.target.value })}
                placeholder="0.50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="securityDeposit">Security Deposit (USD)</Label>
              <Input
                id="securityDeposit"
                type="number"
                step="0.01"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                placeholder="500.00"
              />
            </div>

            <div>
              <Label htmlFor="minRentalDays">Minimum Rental Days *</Label>
              <Input
                id="minRentalDays"
                type="number"
                value={formData.minRentalDays}
                onChange={(e) => setFormData({ ...formData, minRentalDays: e.target.value })}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Insurance Coverage</Label>
            <RadioGroup value={formData.insuranceIncluded} onValueChange={(value) => setFormData({ ...formData, insuranceIncluded: value })}>
              <div className="space-y-2">
                {INSURANCE_TYPES.map((insurance) => (
                  <div key={insurance} className="flex items-center space-x-2">
                    <RadioGroupItem value={insurance} id={insurance} />
                    <Label htmlFor={insurance} className="font-normal cursor-pointer">
                      {insurance}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="licenseRequired">Driver License Required *</Label>
            <Input
              id="licenseRequired"
              value={formData.licenseRequired}
              onChange={(e) => setFormData({ ...formData, licenseRequired: e.target.value })}
              placeholder="e.g., Valid driver's license (Class B)"
              required
            />
          </div>

          <div>
            <Label htmlFor="minAge">Minimum Age *</Label>
            <Input
              id="minAge"
              type="number"
              value={formData.minAge}
              onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
              placeholder="21"
              required
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Rental Requirements</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Valid driver's license required</li>
              <li>• Credit card for security deposit</li>
              <li>• Proof of insurance may be required</li>
              <li>• Additional driver fees may apply</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="availability" className="mt-6">
          <AvailabilitySection availability={availability} onAvailabilityChange={setAvailability} />
        </TabsContent>

        <TabsContent value="policy" className="space-y-8 mt-6">
          <CancellationPolicySection policy={cancellationPolicy} onPolicyChange={setCancellationPolicy} />

          <div className="border-t pt-8">
            <AddOnsSection addOns={addOns} onAddOnsChange={setAddOns} />
            <p className="text-sm text-gray-500 mt-2">
              Examples: GPS device, Child seat, Additional driver, Airport delivery, Full tank option
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Vehicle'}
        </Button>
      </div>
    </form>
  );
}
