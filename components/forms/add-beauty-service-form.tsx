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
import { CancellationPolicySection } from './cancellation-policy-section';
import { Calendar } from '@/components/ui/calendar';

interface AddBeautyServiceFormProps {
  onSuccess: () => void;
  serviceCategory: string;
}

const SERVICE_TYPES = {
  'beauty-centers': [
    'Haircut', 'Hair Coloring', 'Hair Treatment', 'Hair Styling',
    'Manicure', 'Pedicure', 'Gel Nails', 'Acrylic Nails',
    'Facial', 'Skin Treatment', 'Massage', 'Body Treatment',
    'Waxing', 'Threading', 'Makeup', 'Bridal Makeup',
    'Eyelash Extensions', 'Eyebrow Shaping', 'Spray Tan'
  ],
  'mobile-beauty': [
    'Mobile Haircut', 'Mobile Hair Coloring', 'Mobile Manicure',
    'Mobile Pedicure', 'Mobile Makeup', 'Mobile Massage',
    'Mobile Waxing', 'Mobile Facial'
  ]
};

const DURATION_OPTIONS = ['15 min', '30 min', '45 min', '1 hour', '1.5 hours', '2 hours', '2.5 hours', '3 hours', '4 hours'];

const SKILL_LEVELS = ['Junior Stylist', 'Senior Stylist', 'Master Stylist', 'Celebrity Stylist'];

const GENDER_PREFERENCE = ['All', 'Female Only', 'Male Only', 'Non-binary Friendly'];

export function AddBeautyServiceForm({ onSuccess, serviceCategory }: AddBeautyServiceFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceType: '',
    price: '',
    duration: '',
    location: '',
    stylistName: '',
    skillLevel: '',
    genderPreference: 'All',
    productsUsed: '',
    specialRequirements: '',
    depositRequired: '',
    appointmentOnly: true,
    homeService: serviceCategory === 'mobile-beauty',
    travelFee: serviceCategory === 'mobile-beauty' ? '' : '0',
    maxTravelDistance: serviceCategory === 'mobile-beauty' ? '' : '0',
  });

  const serviceTypes = SERVICE_TYPES[serviceCategory as keyof typeof SERVICE_TYPES] || SERVICE_TYPES['beauty-centers'];

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
          deposit_required: formData.depositRequired ? parseFloat(formData.depositRequired) : 0,
          travel_fee: formData.travelFee ? parseFloat(formData.travelFee) : 0,
          currency: 'USD',
          unit: 'per session'
        },
        specifications: {
          service_type: formData.serviceType,
          duration: formData.duration,
          stylist_name: formData.stylistName,
          skill_level: formData.skillLevel,
          gender_preference: formData.genderPreference,
          products_used: formData.productsUsed,
          special_requirements: formData.specialRequirements,
          appointment_only: formData.appointmentOnly,
          home_service: formData.homeService,
          max_travel_distance: formData.maxTravelDistance,
          available_time_slots: timeSlots
        },
        availability: {
          blocked_dates: blockedDates.map(d => d.toISOString()),
          available_slots: timeSlots
        },
        cancellation_policy: cancellationPolicy,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Beauty service added successfully',
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

  const addTimeSlot = () => {
    const newSlot = '09:00';
    if (!timeSlots.includes(newSlot)) {
      setTimeSlots([...timeSlots, newSlot]);
    }
  };

  const removeTimeSlot = (slot: string) => {
    setTimeSlots(timeSlots.filter(s => s !== slot));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Premium Haircut & Style"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the service, what it includes, and expected results"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration *</Label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (USD) *</Label>
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

            <div>
              <Label htmlFor="depositRequired">Deposit Required (USD)</Label>
              <Input
                id="depositRequired"
                type="number"
                step="0.01"
                value={formData.depositRequired}
                onChange={(e) => setFormData({ ...formData, depositRequired: e.target.value })}
                placeholder="20.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Salon address or service area"
              required
            />
          </div>

          {serviceCategory === 'mobile-beauty' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="travelFee">Travel Fee (USD)</Label>
                <Input
                  id="travelFee"
                  type="number"
                  step="0.01"
                  value={formData.travelFee}
                  onChange={(e) => setFormData({ ...formData, travelFee: e.target.value })}
                  placeholder="10.00"
                />
              </div>

              <div>
                <Label htmlFor="maxTravelDistance">Max Travel Distance (km)</Label>
                <Input
                  id="maxTravelDistance"
                  type="number"
                  value={formData.maxTravelDistance}
                  onChange={(e) => setFormData({ ...formData, maxTravelDistance: e.target.value })}
                  placeholder="20"
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
          <p className="text-sm text-gray-500 mt-2">
            Upload before/after photos, portfolio work, or images of your salon
          </p>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="stylistName">Stylist/Professional Name</Label>
            <Input
              id="stylistName"
              value={formData.stylistName}
              onChange={(e) => setFormData({ ...formData, stylistName: e.target.value })}
              placeholder="e.g., Maria Rodriguez"
            />
          </div>

          <div>
            <Label htmlFor="skillLevel">Skill Level</Label>
            <Select value={formData.skillLevel} onValueChange={(value) => setFormData({ ...formData, skillLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                {SKILL_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="genderPreference">Gender Preference</Label>
            <Select value={formData.genderPreference} onValueChange={(value) => setFormData({ ...formData, genderPreference: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GENDER_PREFERENCE.map(pref => (
                  <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="productsUsed">Products/Brands Used</Label>
            <Textarea
              id="productsUsed"
              value={formData.productsUsed}
              onChange={(e) => setFormData({ ...formData, productsUsed: e.target.value })}
              placeholder="e.g., Olaplex, Redken, L'Oréal Professional"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
            <Textarea
              id="specialRequirements"
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              placeholder="e.g., Patch test required 48h before coloring, Bring reference photos"
              rows={3}
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
            <div className="grid grid-cols-5 gap-2 mb-3">
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
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimeSlot(slot)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={addTimeSlot} className="w-full">
              Add Time Slot
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="appointmentOnly"
              checked={formData.appointmentOnly}
              onCheckedChange={(checked) => setFormData({ ...formData, appointmentOnly: checked as boolean })}
            />
            <Label htmlFor="appointmentOnly" className="font-normal cursor-pointer">
              Appointment only (no walk-ins)
            </Label>
          </div>
        </TabsContent>

        <TabsContent value="policy" className="mt-6">
          <CancellationPolicySection policy={cancellationPolicy} onPolicyChange={setCancellationPolicy} />

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Service Policy Reminders</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Late arrivals may result in shortened service time</li>
              <li>• Cancellations within 24 hours may incur fees</li>
              <li>• Patch tests required for coloring services</li>
              <li>• Please arrive with clean, dry hair for styling services</li>
            </ul>
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
