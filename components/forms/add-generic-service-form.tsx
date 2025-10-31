'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadSection } from './image-upload-section';
import { AvailabilitySection } from './availability-section';
import { CancellationPolicySection } from './cancellation-policy-section';
import { AddOnsSection } from './add-ons-section';

interface AddGenericServiceFormProps {
  onSuccess: () => void;
  serviceCategory: string;
}

const DURATION_OPTIONS = ['30 min', '1 hour', '2 hours', '3 hours', '4 hours', 'Half Day', 'Full Day', 'Multi-Day'];

const PRICING_TYPES = ['Per Hour', 'Per Day', 'Per Session', 'Per Project', 'Fixed Price'];

const SERVICE_DELIVERY = ['In-Person', 'Online', 'Home Visit', 'On-Site', 'Hybrid'];

export function AddGenericServiceForm({ onSuccess, serviceCategory }: AddGenericServiceFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [availability, setAvailability] = useState<any>({});
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [addOns, setAddOns] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>(['09:00', '10:00', '13:00', '14:00', '15:00', '16:00']);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    pricingType: 'Per Hour',
    duration: '',
    location: '',
    serviceDelivery: 'In-Person',
    providerName: '',
    experience: '',
    qualifications: '',
    equipment: '',
    requirements: '',
    depositRequired: '',
    travelFee: '',
    maxTravelDistance: '',
    emergencyService: false,
    consultationRequired: false,
    licenseRequired: false,
    insuranceIncluded: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to add a service',
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
        service_category: serviceCategory,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photos: images,
        pricing: {
          base_price: parseFloat(formData.price),
          pricing_type: formData.pricingType,
          deposit_required: formData.depositRequired ? parseFloat(formData.depositRequired) : 0,
          travel_fee: formData.travelFee ? parseFloat(formData.travelFee) : 0,
          currency: 'USD',
          unit: formData.pricingType.toLowerCase()
        },
        specifications: {
          duration: formData.duration,
          service_delivery: formData.serviceDelivery,
          provider_name: formData.providerName,
          experience: formData.experience,
          qualifications: formData.qualifications,
          equipment: formData.equipment,
          requirements: formData.requirements,
          max_travel_distance: formData.maxTravelDistance,
          emergency_service: formData.emergencyService,
          consultation_required: formData.consultationRequired,
          license_required: formData.licenseRequired,
          insurance_included: formData.insuranceIncluded,
          available_time_slots: timeSlots
        },
        availability: {
          ...availability,
          blocked_dates: blockedDates.map(d => d.toISOString()),
          available_slots: timeSlots
        },
        cancellation_policy: cancellationPolicy,
        add_ons: addOns,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Service added successfully',
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add service',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    const titles: Record<string, string> = {
      'family-childcare': 'Childcare Service',
      'lifestyle-creative': 'Creative Service',
      'local-tourism': 'Tourism Service',
      'tradespeople': 'Trade Service',
      'weddings': 'Wedding Service',
    };
    return titles[serviceCategory] || 'Service';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="policy">Policy & Extras</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">{getCategoryTitle()} Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`e.g., Professional ${getCategoryTitle()}`}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your service, what you offer, and what makes you stand out"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Typical Duration *</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map(duration => (
                    <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="serviceDelivery">Service Delivery *</Label>
              <Select value={formData.serviceDelivery} onValueChange={(value) => setFormData({ ...formData, serviceDelivery: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_DELIVERY.map(delivery => (
                    <SelectItem key={delivery} value={delivery}>{delivery}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location/Service Area *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Your location or service coverage area"
              required
            />
          </div>

          <div>
            <Label htmlFor="requirements">Customer Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="What customers need to provide or prepare"
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergencyService"
                checked={formData.emergencyService}
                onCheckedChange={(checked) => setFormData({ ...formData, emergencyService: checked as boolean })}
              />
              <Label htmlFor="emergencyService" className="font-normal cursor-pointer">
                Emergency service available (24/7 or urgent calls)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="consultationRequired"
                checked={formData.consultationRequired}
                onCheckedChange={(checked) => setFormData({ ...formData, consultationRequired: checked as boolean })}
              />
              <Label htmlFor="consultationRequired" className="font-normal cursor-pointer">
                Free consultation required before booking
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="licenseRequired"
                checked={formData.licenseRequired}
                onCheckedChange={(checked) => setFormData({ ...formData, licenseRequired: checked as boolean })}
              />
              <Label htmlFor="licenseRequired" className="font-normal cursor-pointer">
                Licensed & Certified
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="insuranceIncluded"
                checked={formData.insuranceIncluded}
                onCheckedChange={(checked) => setFormData({ ...formData, insuranceIncluded: checked as boolean })}
              />
              <Label htmlFor="insuranceIncluded" className="font-normal cursor-pointer">
                Insurance/Liability coverage included
              </Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
          <p className="text-sm text-gray-500 mt-2">
            Upload photos of your work, portfolio, equipment, or workspace
          </p>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricingType">Pricing Type *</Label>
              <Select value={formData.pricingType} onValueChange={(value) => setFormData({ ...formData, pricingType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICING_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Base Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="50.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="depositRequired">Deposit Required (USD)</Label>
              <Input
                id="depositRequired"
                type="number"
                step="0.01"
                value={formData.depositRequired}
                onChange={(e) => setFormData({ ...formData, depositRequired: e.target.value })}
                placeholder="25.00"
              />
            </div>

            <div>
              <Label htmlFor="travelFee">Travel/Call-out Fee (USD)</Label>
              <Input
                id="travelFee"
                type="number"
                step="0.01"
                value={formData.travelFee}
                onChange={(e) => setFormData({ ...formData, travelFee: e.target.value })}
                placeholder="15.00"
              />
            </div>
          </div>

          {(formData.serviceDelivery === 'Home Visit' || formData.serviceDelivery === 'On-Site') && (
            <div>
              <Label htmlFor="maxTravelDistance">Maximum Travel Distance (km)</Label>
              <Input
                id="maxTravelDistance"
                value={formData.maxTravelDistance}
                onChange={(e) => setFormData({ ...formData, maxTravelDistance: e.target.value })}
                placeholder="e.g., 30"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="professional" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="providerName">Service Provider Name *</Label>
            <Input
              id="providerName"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
              placeholder="Your name or business name"
              required
            />
          </div>

          <div>
            <Label htmlFor="experience">Experience *</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="e.g., 5+ years experience"
              required
            />
          </div>

          <div>
            <Label htmlFor="qualifications">Qualifications & Certifications</Label>
            <Textarea
              id="qualifications"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              placeholder="List your relevant certifications, licenses, or training"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="equipment">Equipment & Tools</Label>
            <Textarea
              id="equipment"
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              placeholder="What equipment or tools you use/provide"
              rows={2}
            />
          </div>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-6 mt-6">
          <div>
            <Label className="mb-3 block">Block Unavailable Dates</Label>
            <div className="border rounded-lg p-4 bg-white">
              <Calendar
                mode="multiple"
                selected={blockedDates}
                onSelect={(dates) => setBlockedDates(dates || [])}
                className="rounded-md"
                disabled={(date) => date < new Date()}
              />
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Available Time Slots</Label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot}
                    onChange={(e) => {
                      const newSlots = [...timeSlots];
                      newSlots[index] = e.target.value;
                      setTimeSlots(newSlots);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setTimeSlots(timeSlots.filter((_, i) => i !== index))}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTimeSlots([...timeSlots, '09:00'])}
              className="w-full"
            >
              Add Time Slot
            </Button>
          </div>

          <AvailabilitySection availability={availability} onAvailabilityChange={setAvailability} />
        </TabsContent>

        <TabsContent value="policy" className="space-y-8 mt-6">
          <CancellationPolicySection policy={cancellationPolicy} onPolicyChange={setCancellationPolicy} />

          <div className="border-t pt-8">
            <AddOnsSection addOns={addOns} onAddOnsChange={setAddOns} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Service'}
        </Button>
      </div>
    </form>
  );
}
