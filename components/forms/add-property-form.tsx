'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadSection } from './image-upload-section';
import { AvailabilitySection } from './availability-section';
import { CancellationPolicySection } from './cancellation-policy-section';
import { AddOnsSection } from './add-ons-section';

interface AddPropertyFormProps {
  onSuccess: () => void;
}

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Cottage', 'Cabin', 'Bungalow', 'Studio', 'Loft', 'Chalet'];

const PROPERTY_AMENITIES = [
  'Wi-Fi', 'Kitchen', 'Parking', 'Pool', 'Hot Tub', 'Gym',
  'Air Conditioning', 'Heating', 'Washer', 'Dryer', 'TV', 'Fireplace',
  'BBQ Grill', 'Garden', 'Balcony', 'Terrace', 'Beach Access', 'Mountain View',
  'Pet Friendly', 'Child Friendly', 'Wheelchair Accessible', 'Smoke Free'
];

const HOUSE_RULES = [
  'No smoking', 'No pets', 'No parties', 'No events', 'Quiet hours 10PM-8AM',
  'Check-in after 3PM', 'Check-out before 11AM', 'Respect neighbors'
];

export function AddPropertyForm({ onSuccess }: AddPropertyFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [availability, setAvailability] = useState<any>({});
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [addOns, setAddOns] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    propertyType: '',
    pricePerNight: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    propertySize: '',
    location: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cleaningFee: '',
    securityDeposit: '',
    amenities: [] as string[],
    houseRules: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to add a property',
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
        service_category: 'holiday-rentals',
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photos: images,
        pricing: {
          base_price: parseFloat(formData.pricePerNight),
          cleaning_fee: formData.cleaningFee ? parseFloat(formData.cleaningFee) : 0,
          security_deposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : 0,
          currency: 'USD',
          unit: 'per night'
        },
        specifications: {
          property_type: formData.propertyType,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          max_guests: parseInt(formData.maxGuests),
          property_size: parseFloat(formData.propertySize),
          property_size_unit: 'sqm',
          check_in_time: formData.checkInTime,
          check_out_time: formData.checkOutTime
        },
        amenities: formData.amenities,
        house_rules: formData.houseRules,
        availability: availability,
        cancellation_policy: cancellationPolicy,
        add_ons: addOns,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Property added successfully',
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add property',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleRule = (rule: string) => {
    setFormData(prev => ({
      ...prev,
      houseRules: prev.houseRules.includes(rule)
        ? prev.houseRules.filter(r => r !== rule)
        : [...prev.houseRules, rule]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
          <TabsTrigger value="extras">Add-ons</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Property Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cozy Beach House"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your property and what makes it special"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="2"
                required
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="maxGuests">Max Guests *</Label>
              <Input
                id="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                placeholder="4"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="propertySize">Property Size (sqm) *</Label>
            <Input
              id="propertySize"
              type="number"
              step="0.1"
              value={formData.propertySize}
              onChange={(e) => setFormData({ ...formData, propertySize: e.target.value })}
              placeholder="80"
              required
            />
          </div>

          <div>
            <Label className="mb-3 block">Amenities</Label>
            <div className="grid grid-cols-3 gap-3">
              {PROPERTY_AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">House Rules</Label>
            <div className="grid grid-cols-2 gap-3">
              {HOUSE_RULES.map((rule) => (
                <div key={rule} className="flex items-center space-x-2">
                  <Checkbox
                    id={rule}
                    checked={formData.houseRules.includes(rule)}
                    onCheckedChange={() => toggleRule(rule)}
                  />
                  <Label htmlFor={rule} className="text-sm font-normal cursor-pointer">
                    {rule}
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
          <div>
            <Label htmlFor="pricePerNight">Base Price per Night (USD) *</Label>
            <Input
              id="pricePerNight"
              type="number"
              step="0.01"
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
              placeholder="200.00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cleaningFee">Cleaning Fee (USD)</Label>
              <Input
                id="cleaningFee"
                type="number"
                step="0.01"
                value={formData.cleaningFee}
                onChange={(e) => setFormData({ ...formData, cleaningFee: e.target.value })}
                placeholder="50.00"
              />
            </div>

            <div>
              <Label htmlFor="securityDeposit">Security Deposit (USD)</Label>
              <Input
                id="securityDeposit"
                type="number"
                step="0.01"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                placeholder="200.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkInTime">Check-in Time *</Label>
              <Input
                id="checkInTime"
                type="time"
                value={formData.checkInTime}
                onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="checkOutTime">Check-out Time *</Label>
              <Input
                id="checkOutTime"
                type="time"
                value={formData.checkOutTime}
                onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                required
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="availability" className="mt-6">
          <AvailabilitySection availability={availability} onAvailabilityChange={setAvailability} />
        </TabsContent>

        <TabsContent value="policy" className="mt-6">
          <CancellationPolicySection policy={cancellationPolicy} onPolicyChange={setCancellationPolicy} />
        </TabsContent>

        <TabsContent value="extras" className="mt-6">
          <AddOnsSection addOns={addOns} onAddOnsChange={setAddOns} />
          <p className="text-sm text-gray-500 mt-2">
            Examples: Airport pickup, Grocery delivery, Bike rental, Late check-out
          </p>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Property'}
        </Button>
      </div>
    </form>
  );
}
