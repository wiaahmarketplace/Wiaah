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

interface AddChildcareFormProps {
  onSuccess: () => void;
}

const CHILDCARE_TYPES = [
  'Babysitting', 'Nanny', 'Au Pair', 'Daycare', 'After School Care',
  'Newborn Care', 'Special Needs Care', 'Overnight Care', 'Tutor'
];

const AGE_GROUPS = [
  'Newborn (0-3 months)', 'Infant (3-12 months)', 'Toddler (1-3 years)',
  'Preschool (3-5 years)', 'School Age (5-12 years)', 'Teenager (13+)'
];

const PRICING_TYPES = ['Per Hour', 'Per Day', 'Per Week', 'Per Month'];

export function AddChildcareForm({ onSuccess }: AddChildcareFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    careType: '',
    ageGroups: [] as string[],
    price: '',
    pricingType: 'Per Hour',
    location: '',
    caregiverName: '',
    yearsExperience: '',
    education: '',
    certifications: '',
    languages: '',
    maxChildren: '',
    activities: '',
    mealsProvided: false,
    homeworkHelp: false,
    transportation: false,
    overnightCare: false,
    specialNeeds: false,
    petFriendly: false,
    smokeFree: true,
    cprCertified: false,
    firstAidCertified: false,
    backgroundChecked: false,
    references: '',
    additionalSkills: '',
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
          description: 'Please add at least one photo',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('service_items').insert({
        user_id: user.id,
        service_category: 'family-childcare',
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photos: images,
        pricing: {
          base_price: parseFloat(formData.price),
          pricing_type: formData.pricingType,
          currency: 'USD',
          unit: formData.pricingType.toLowerCase()
        },
        specifications: {
          care_type: formData.careType,
          age_groups: formData.ageGroups,
          caregiver_name: formData.caregiverName,
          years_experience: formData.yearsExperience,
          education: formData.education,
          certifications: formData.certifications,
          languages: formData.languages,
          max_children: formData.maxChildren ? parseInt(formData.maxChildren) : null,
          activities: formData.activities,
          meals_provided: formData.mealsProvided,
          homework_help: formData.homeworkHelp,
          transportation: formData.transportation,
          overnight_care: formData.overnightCare,
          special_needs: formData.specialNeeds,
          pet_friendly: formData.petFriendly,
          smoke_free: formData.smokeFree,
          cpr_certified: formData.cprCertified,
          first_aid_certified: formData.firstAidCertified,
          background_checked: formData.backgroundChecked,
          references: formData.references,
          additional_skills: formData.additionalSkills
        },
        availability: {
          blocked_dates: blockedDates.map(d => d.toISOString())
        },
        cancellation_policy: cancellationPolicy,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Childcare service added successfully',
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

  const toggleAgeGroup = (group: string) => {
    setFormData(prev => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(group)
        ? prev.ageGroups.filter(g => g !== group)
        : [...prev.ageGroups, group]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Service Title *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Experienced Nanny for Toddlers"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">About You & Your Service *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your childcare experience, approach, and what makes you special"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="careType">Care Type *</Label>
              <Select value={formData.careType} onValueChange={(value) => setFormData({ ...formData, careType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CHILDCARE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="caregiverName">Your Name *</Label>
              <Input
                id="caregiverName"
                value={formData.caregiverName}
                onChange={(e) => setFormData({ ...formData, caregiverName: e.target.value })}
                placeholder="First name or full name"
                required
              />
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Age Groups You Care For *</Label>
            <div className="grid grid-cols-2 gap-3">
              {AGE_GROUPS.map((group) => (
                <div key={group} className="flex items-center space-x-2">
                  <Checkbox
                    id={group}
                    checked={formData.ageGroups.includes(group)}
                    onCheckedChange={() => toggleAgeGroup(group)}
                  />
                  <Label htmlFor={group} className="text-sm font-normal cursor-pointer">
                    {group}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxChildren">Maximum Children *</Label>
              <Input
                id="maxChildren"
                type="number"
                value={formData.maxChildren}
                onChange={(e) => setFormData({ ...formData, maxChildren: e.target.value })}
                placeholder="e.g., 3"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location/Area *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Your location or service area"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="languages">Languages Spoken *</Label>
            <Input
              id="languages"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              placeholder="e.g., English, Spanish"
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
          <p className="text-sm text-gray-500 mt-2">
            Upload photos of yourself, activities with children, or your childcare environment
          </p>
        </TabsContent>

        <TabsContent value="qualifications" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yearsExperience">Years of Experience *</Label>
              <Input
                id="yearsExperience"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                placeholder="e.g., 5 years"
                required
              />
            </div>

            <div>
              <Label htmlFor="education">Education Level *</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="e.g., Bachelor's in Early Childhood Education"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="certifications">Certifications & Training</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              placeholder="List relevant certifications (e.g., Montessori, Child Development)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="additionalSkills">Additional Skills</Label>
            <Textarea
              id="additionalSkills"
              value={formData.additionalSkills}
              onChange={(e) => setFormData({ ...formData, additionalSkills: e.target.value })}
              placeholder="e.g., Music, Arts & Crafts, Swimming, Cooking"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="references">References</Label>
            <Textarea
              id="references"
              value={formData.references}
              onChange={(e) => setFormData({ ...formData, references: e.target.value })}
              placeholder="Professional references available upon request"
              rows={2}
            />
          </div>

          <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900">Safety & Credentials</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cprCertified"
                  checked={formData.cprCertified}
                  onCheckedChange={(checked) => setFormData({ ...formData, cprCertified: checked as boolean })}
                />
                <Label htmlFor="cprCertified" className="font-normal cursor-pointer text-green-800">
                  CPR Certified
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="firstAidCertified"
                  checked={formData.firstAidCertified}
                  onCheckedChange={(checked) => setFormData({ ...formData, firstAidCertified: checked as boolean })}
                />
                <Label htmlFor="firstAidCertified" className="font-normal cursor-pointer text-green-800">
                  First Aid Certified
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backgroundChecked"
                  checked={formData.backgroundChecked}
                  onCheckedChange={(checked) => setFormData({ ...formData, backgroundChecked: checked as boolean })}
                />
                <Label htmlFor="backgroundChecked" className="font-normal cursor-pointer text-green-800">
                  Background Check Completed
                </Label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4 mt-6">
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
              <Label htmlFor="price">Rate (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="20.00"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="activities">Activities & Daily Routine</Label>
            <Textarea
              id="activities"
              value={formData.activities}
              onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
              placeholder="Describe typical activities and daily schedule"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Services Offered</h4>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mealsProvided"
                checked={formData.mealsProvided}
                onCheckedChange={(checked) => setFormData({ ...formData, mealsProvided: checked as boolean })}
              />
              <Label htmlFor="mealsProvided" className="font-normal cursor-pointer">
                Meals & Snacks Provided
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="homeworkHelp"
                checked={formData.homeworkHelp}
                onCheckedChange={(checked) => setFormData({ ...formData, homeworkHelp: checked as boolean })}
              />
              <Label htmlFor="homeworkHelp" className="font-normal cursor-pointer">
                Homework Help & Tutoring
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="transportation"
                checked={formData.transportation}
                onCheckedChange={(checked) => setFormData({ ...formData, transportation: checked as boolean })}
              />
              <Label htmlFor="transportation" className="font-normal cursor-pointer">
                Transportation (school pickup/dropoff)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="overnightCare"
                checked={formData.overnightCare}
                onCheckedChange={(checked) => setFormData({ ...formData, overnightCare: checked as boolean })}
              />
              <Label htmlFor="overnightCare" className="font-normal cursor-pointer">
                Overnight Care Available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="specialNeeds"
                checked={formData.specialNeeds}
                onCheckedChange={(checked) => setFormData({ ...formData, specialNeeds: checked as boolean })}
              />
              <Label htmlFor="specialNeeds" className="font-normal cursor-pointer">
                Special Needs Experience
              </Label>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold">Environment</h4>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="petFriendly"
                checked={formData.petFriendly}
                onCheckedChange={(checked) => setFormData({ ...formData, petFriendly: checked as boolean })}
              />
              <Label htmlFor="petFriendly" className="font-normal cursor-pointer">
                Pet-Friendly
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="smokeFree"
                checked={formData.smokeFree}
                onCheckedChange={(checked) => setFormData({ ...formData, smokeFree: checked as boolean })}
              />
              <Label htmlFor="smokeFree" className="font-normal cursor-pointer">
                Smoke-Free Environment
              </Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="policy" className="space-y-6 mt-6">
          <div>
            <Label className="mb-3 block">Unavailable Dates</Label>
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

          <CancellationPolicySection policy={cancellationPolicy} onPolicyChange={setCancellationPolicy} />

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-900 mb-2">Important Childcare Policies</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Current immunization records required</li>
              <li>• Emergency contact information must be provided</li>
              <li>• Allergies and medical conditions must be disclosed</li>
              <li>• Payment due at time of service unless otherwise agreed</li>
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
