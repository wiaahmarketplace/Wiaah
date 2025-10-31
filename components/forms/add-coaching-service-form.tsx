'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadSection } from './image-upload-section';
import { CancellationPolicySection } from './cancellation-policy-section';
import { AddOnsSection } from './add-ons-section';

interface AddCoachingServiceFormProps {
  onSuccess: () => void;
}

const COACHING_TYPES = [
  'Life Coaching', 'Business Coaching', 'Career Coaching', 'Executive Coaching',
  'Health & Wellness Coaching', 'Relationship Coaching', 'Financial Coaching',
  'Performance Coaching', 'Leadership Coaching', 'Personal Development',
  'Mindfulness Coaching', 'Fitness Coaching', 'Nutrition Coaching'
];

const SESSION_FORMATS = ['One-on-One', 'Group Session', 'Workshop', 'Online Course', 'Hybrid'];

const DURATION_OPTIONS = ['30 min', '45 min', '1 hour', '1.5 hours', '2 hours', '3 hours', 'Full Day'];

const DELIVERY_METHODS = ['In-Person', 'Video Call', 'Phone Call', 'Both In-Person & Online'];

export function AddCoachingServiceForm({ onSuccess }: AddCoachingServiceFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [addOns, setAddOns] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>(['09:00', '11:00', '14:00', '16:00']);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coachingType: '',
    sessionFormat: 'One-on-One',
    duration: '',
    deliveryMethod: 'Video Call',
    price: '',
    packagePrice: '',
    sessionsInPackage: '',
    location: '',
    coachName: '',
    certifications: '',
    experience: '',
    specializations: '',
    methodologies: '',
    targetAudience: '',
    languages: '',
    freeConsultation: false,
    materialIncluded: false,
    followUpSupport: false,
    groupSize: '',
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
        service_category: 'coaching-personal-growth',
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photos: images,
        pricing: {
          base_price: parseFloat(formData.price),
          package_price: formData.packagePrice ? parseFloat(formData.packagePrice) : null,
          sessions_in_package: formData.sessionsInPackage ? parseInt(formData.sessionsInPackage) : null,
          currency: 'USD',
          unit: 'per session'
        },
        specifications: {
          coaching_type: formData.coachingType,
          session_format: formData.sessionFormat,
          duration: formData.duration,
          delivery_method: formData.deliveryMethod,
          coach_name: formData.coachName,
          certifications: formData.certifications,
          experience: formData.experience,
          specializations: formData.specializations,
          methodologies: formData.methodologies,
          target_audience: formData.targetAudience,
          languages: formData.languages,
          free_consultation: formData.freeConsultation,
          material_included: formData.materialIncluded,
          follow_up_support: formData.followUpSupport,
          group_size: formData.groupSize ? parseInt(formData.groupSize) : null,
          available_time_slots: timeSlots
        },
        availability: {
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
        description: 'Coaching service added successfully',
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
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Personal Life Coaching Sessions"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your coaching approach, what clients will achieve, and your methodology"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coachingType">Coaching Type *</Label>
              <Select value={formData.coachingType} onValueChange={(value) => setFormData({ ...formData, coachingType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {COACHING_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sessionFormat">Session Format *</Label>
              <Select value={formData.sessionFormat} onValueChange={(value) => setFormData({ ...formData, sessionFormat: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_FORMATS.map(format => (
                    <SelectItem key={format} value={format}>{format}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="deliveryMethod">Delivery Method *</Label>
              <Select value={formData.deliveryMethod} onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_METHODS.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.sessionFormat === 'Group Session' && (
            <div>
              <Label htmlFor="groupSize">Maximum Group Size</Label>
              <Input
                id="groupSize"
                type="number"
                value={formData.groupSize}
                onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>
          )}

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Office address or 'Online' or 'Worldwide'"
              required
            />
          </div>

          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="e.g., Entrepreneurs, Corporate Executives, Students"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="freeConsultation"
                checked={formData.freeConsultation}
                onCheckedChange={(checked) => setFormData({ ...formData, freeConsultation: checked as boolean })}
              />
              <Label htmlFor="freeConsultation" className="font-normal cursor-pointer">
                Offer free initial consultation (15-30 min)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="materialIncluded"
                checked={formData.materialIncluded}
                onCheckedChange={(checked) => setFormData({ ...formData, materialIncluded: checked as boolean })}
              />
              <Label htmlFor="materialIncluded" className="font-normal cursor-pointer">
                Workbooks and materials included
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="followUpSupport"
                checked={formData.followUpSupport}
                onCheckedChange={(checked) => setFormData({ ...formData, followUpSupport: checked as boolean })}
              />
              <Label htmlFor="followUpSupport" className="font-normal cursor-pointer">
                Email/messaging support between sessions
              </Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
          <p className="text-sm text-gray-500 mt-2">
            Upload professional photos, client testimonials, certification images, or workspace
          </p>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="price">Price per Session (USD) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="100.00"
              required
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
            <h4 className="font-semibold">Package Pricing (Optional)</h4>
            <p className="text-sm text-gray-600">Offer discounted rates for multiple sessions</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionsInPackage">Number of Sessions</Label>
                <Input
                  id="sessionsInPackage"
                  type="number"
                  value={formData.sessionsInPackage}
                  onChange={(e) => setFormData({ ...formData, sessionsInPackage: e.target.value })}
                  placeholder="e.g., 5 or 10"
                />
              </div>

              <div>
                <Label htmlFor="packagePrice">Package Price (USD)</Label>
                <Input
                  id="packagePrice"
                  type="number"
                  step="0.01"
                  value={formData.packagePrice}
                  onChange={(e) => setFormData({ ...formData, packagePrice: e.target.value })}
                  placeholder="450.00"
                />
              </div>
            </div>

            {formData.price && formData.packagePrice && formData.sessionsInPackage && (
              <div className="text-sm text-green-700">
                Savings: ${(parseFloat(formData.price) * parseInt(formData.sessionsInPackage) - parseFloat(formData.packagePrice)).toFixed(2)}
                ({(((parseFloat(formData.price) * parseInt(formData.sessionsInPackage) - parseFloat(formData.packagePrice)) / (parseFloat(formData.price) * parseInt(formData.sessionsInPackage))) * 100).toFixed(0)}% off)
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="coachName">Coach Name *</Label>
            <Input
              id="coachName"
              value={formData.coachName}
              onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
              placeholder="Your name or professional name"
              required
            />
          </div>

          <div>
            <Label htmlFor="certifications">Certifications & Credentials *</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              placeholder="e.g., ICF Certified Coach, NLP Practitioner, MBA"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="experience">Experience *</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="e.g., 8+ years coaching experience"
              required
            />
          </div>

          <div>
            <Label htmlFor="specializations">Specializations</Label>
            <Textarea
              id="specializations"
              value={formData.specializations}
              onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
              placeholder="e.g., Career transition, Work-life balance, Leadership development"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="methodologies">Coaching Methodologies</Label>
            <Textarea
              id="methodologies"
              value={formData.methodologies}
              onChange={(e) => setFormData({ ...formData, methodologies: e.target.value })}
              placeholder="e.g., GROW Model, Solution-Focused Coaching, Cognitive Behavioral Approach"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="languages">Languages</Label>
            <Input
              id="languages"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              placeholder="e.g., English, Spanish"
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
        </TabsContent>

        <TabsContent value="policy" className="space-y-8 mt-6">
          <CancellationPolicySection policy={cancellationPolicy} onPolicyChange={setCancellationPolicy} />

          <div className="border-t pt-8">
            <AddOnsSection addOns={addOns} onAddOnsChange={setAddOns} />
            <p className="text-sm text-gray-500 mt-2">
              Examples: Assessment tools, Personality tests, Additional resources, Extended support
            </p>
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
