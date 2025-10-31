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
import { DiscountSection } from './discount-section';

interface AddHotelRoomFormProps {
  onSuccess: () => void;
}

const ROOM_AMENITIES = [
  'Wi-Fi', 'TV', 'Air Conditioning', 'Heating', 'Mini Bar', 'Room Service',
  'Safe', 'Balcony', 'Ocean View', 'City View', 'Bathtub', 'Shower',
  'Hair Dryer', 'Toiletries', 'Iron', 'Coffee Maker'
];

const BED_TYPES = ['Single', 'Double', 'Queen', 'King', 'Twin'];

export function AddHotelRoomForm({ onSuccess }: AddHotelRoomFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [availability, setAvailability] = useState<any>({});
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [addOns, setAddOns] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    maxGuests: '',
    bedType: '',
    numberOfBeds: '',
    roomSize: '',
    location: '',
    amenities: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to add a room',
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
        service_category: 'hotels',
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photos: images,
        pricing: {
          base_price: parseFloat(formData.pricePerNight),
          currency: 'USD',
          unit: 'per night'
        },
        specifications: {
          max_guests: parseInt(formData.maxGuests),
          bed_type: formData.bedType,
          number_of_beds: parseInt(formData.numberOfBeds),
          room_size: parseFloat(formData.roomSize),
          room_size_unit: 'sqm'
        },
        amenities: formData.amenities,
        availability: availability,
        cancellation_policy: cancellationPolicy,
        add_ons: addOns,
        discounts: discounts,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Hotel room added successfully',
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add hotel room',
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="extras">Add-ons</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Room Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Deluxe Ocean View Suite"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the room features and amenities"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricePerNight">Price per Night (USD) *</Label>
              <Input
                id="pricePerNight"
                type="number"
                step="0.01"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                placeholder="150.00"
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
                placeholder="2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedType">Bed Type *</Label>
              <Select value={formData.bedType} onValueChange={(value) => setFormData({ ...formData, bedType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bed type" />
                </SelectTrigger>
                <SelectContent>
                  {BED_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="numberOfBeds">Number of Beds *</Label>
              <Input
                id="numberOfBeds"
                type="number"
                value={formData.numberOfBeds}
                onChange={(e) => setFormData({ ...formData, numberOfBeds: e.target.value })}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomSize">Room Size (sqm) *</Label>
              <Input
                id="roomSize"
                type="number"
                step="0.1"
                value={formData.roomSize}
                onChange={(e) => setFormData({ ...formData, roomSize: e.target.value })}
                placeholder="35"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Floor or building location"
                required
              />
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Amenities</Label>
            <div className="grid grid-cols-2 gap-3">
              {ROOM_AMENITIES.map((amenity) => (
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
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
        </TabsContent>

        <TabsContent value="availability" className="mt-6">
          <AvailabilitySection availability={availability} onAvailabilityChange={setAvailability} />
        </TabsContent>

        <TabsContent value="policy" className="mt-6">
          <CancellationPolicySection policy={cancellationPolicy} onPolicyChange={setCancellationPolicy} />
        </TabsContent>

        <TabsContent value="discounts" className="mt-6">
          <DiscountSection discounts={discounts} onDiscountsChange={setDiscounts} />
        </TabsContent>

        <TabsContent value="extras" className="mt-6">
          <AddOnsSection addOns={addOns} onAddOnsChange={setAddOns} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Room'}
        </Button>
      </div>
    </form>
  );
}
