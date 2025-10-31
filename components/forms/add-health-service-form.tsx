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

interface AddHealthServiceFormProps {
  onSuccess: () => void;
}

const HEALTH_SERVICES = [
  'General Consultation', 'Dental Care', 'Physiotherapy', 'Mental Health Counseling',
  'Nutrition Consultation', 'Chiropractic', 'Acupuncture', 'Massage Therapy',
  'Occupational Therapy', 'Speech Therapy', 'Diagnostic Tests', 'Vaccination',
  'Health Screening', 'Alternative Medicine', 'Sports Medicine'
];

const DURATION_OPTIONS = ['15 min', '30 min', '45 min', '1 hour', '1.5 hours', '2 hours'];

const CONSULTATION_TYPES = ['In-Person', 'Telemedicine', 'Home Visit', 'Both In-Person & Online'];

export function AddHealthServiceForm({ onSuccess }: AddHealthServiceFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceType: '',
    price: '',
    duration: '',
    location: '',
    consultationType: 'In-Person',
    doctorName: '',
    specialty: '',
    qualifications: '',
    experience: '',
    languages: '',
    insuranceAccepted: '',
    prescriptionProvided: false,
    followUpIncluded: false,
    emergencyAvailable: false,
    depositRequired: '',
    homeVisitFee: '',
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
        service_category: 'health-centers',
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photos: images,
        pricing: {
          base_price: parseFloat(formData.price),
          deposit_required: formData.depositRequired ? parseFloat(formData.depositRequired) : 0,
          home_visit_fee: formData.homeVisitFee ? parseFloat(formData.homeVisitFee) : 0,
          currency: 'USD',
          unit: 'per consultation'
        },
        specifications: {
          service_type: formData.serviceType,
          duration: formData.duration,
          consultation_type: formData.consultationType,
          doctor_name: formData.doctorName,
          specialty: formData.specialty,
          qualifications: formData.qualifications,
          experience: formData.experience,
          languages: formData.languages,
          insurance_accepted: formData.insuranceAccepted,
          prescription_provided: formData.prescriptionProvided,
          follow_up_included: formData.followUpIncluded,
          emergency_available: formData.emergencyAvailable,
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
        description: 'Health service added successfully',
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
              placeholder="e.g., General Health Consultation"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the service, what conditions you treat, and what patients can expect"
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
                  {HEALTH_SERVICES.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="consultationType">Consultation Type *</Label>
              <Select value={formData.consultationType} onValueChange={(value) => setFormData({ ...formData, consultationType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTATION_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
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
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="75.00"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location/Address *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Clinic address or service area"
              required
            />
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
              <Label htmlFor="homeVisitFee">Home Visit Fee (USD)</Label>
              <Input
                id="homeVisitFee"
                type="number"
                step="0.01"
                value={formData.homeVisitFee}
                onChange={(e) => setFormData({ ...formData, homeVisitFee: e.target.value })}
                placeholder="50.00"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="prescriptionProvided"
                checked={formData.prescriptionProvided}
                onCheckedChange={(checked) => setFormData({ ...formData, prescriptionProvided: checked as boolean })}
              />
              <Label htmlFor="prescriptionProvided" className="font-normal cursor-pointer">
                Prescription can be provided
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="followUpIncluded"
                checked={formData.followUpIncluded}
                onCheckedChange={(checked) => setFormData({ ...formData, followUpIncluded: checked as boolean })}
              />
              <Label htmlFor="followUpIncluded" className="font-normal cursor-pointer">
                Follow-up consultation included
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergencyAvailable"
                checked={formData.emergencyAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, emergencyAvailable: checked as boolean })}
              />
              <Label htmlFor="emergencyAvailable" className="font-normal cursor-pointer">
                Emergency appointments available
              </Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
          <p className="text-sm text-gray-500 mt-2">
            Upload photos of your clinic, consultation room, or professional certifications
          </p>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="doctorName">Doctor/Practitioner Name *</Label>
            <Input
              id="doctorName"
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              placeholder="Dr. John Smith"
              required
            />
          </div>

          <div>
            <Label htmlFor="specialty">Specialty *</Label>
            <Input
              id="specialty"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="e.g., General Practitioner, Dentist, Physiotherapist"
              required
            />
          </div>

          <div>
            <Label htmlFor="qualifications">Qualifications *</Label>
            <Textarea
              id="qualifications"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              placeholder="Medical degrees, certifications, licenses"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="e.g., 10+ years"
            />
          </div>

          <div>
            <Label htmlFor="languages">Languages Spoken</Label>
            <Input
              id="languages"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              placeholder="e.g., English, Spanish, French"
            />
          </div>

          <div>
            <Label htmlFor="insuranceAccepted">Insurance Accepted</Label>
            <Textarea
              id="insuranceAccepted"
              value={formData.insuranceAccepted}
              onChange={(e) => setFormData({ ...formData, insuranceAccepted: e.target.value })}
              placeholder="List accepted insurance providers"
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
        </TabsContent>

        <TabsContent value="policy" className="mt-6">
          <CancellationPolicySection policy={cancellationPolicy} onPolicyChange={setCancellationPolicy} />

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Medical Service Policy</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Please arrive 10 minutes early for paperwork</li>
              <li>• Bring all relevant medical records and test results</li>
              <li>• Late cancellations may incur fees</li>
              <li>• Emergency appointments subject to availability</li>
              <li>• Insurance verification required before appointment</li>
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
