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

interface AddTradespeopleFormProps {
  onSuccess: () => void;
}

const TRADE_TYPES = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Roofing',
  'HVAC', 'Landscaping', 'Flooring', 'Masonry', 'Welding',
  'Locksmith', 'Appliance Repair', 'Handyman', 'Pest Control',
  'Window Installation', 'Drywall', 'Tile Work', 'Demolition'
];

const SERVICE_AREAS = [
  'Residential', 'Commercial', 'Industrial', 'Emergency Services'
];

const PRICING_TYPES = ['Per Hour', 'Per Project', 'Per Square Foot', 'Fixed Rate'];

export function AddTradespeopleForm({ onSuccess }: AddTradespeopleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tradeType: '',
    serviceAreas: [] as string[],
    price: '',
    pricingType: 'Per Hour',
    location: '',
    businessName: '',
    yearsExperience: '',
    licenseNumber: '',
    insuranceCoverage: '',
    certifications: '',
    servicesOffered: '',
    equipmentProvided: '',
    materialsIncluded: false,
    warrantyOffered: false,
    warrantyDetails: '',
    minimumCharge: '',
    callOutFee: '',
    emergencyAvailable: false,
    emergencySurcharge: '',
    maxProjectSize: '',
    freeEstimate: true,
    licenseVerified: false,
    insured: false,
    bonded: false,
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
          description: 'Please add at least one image of your work',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('service_items').insert({
        user_id: user.id,
        service_category: 'tradespeople',
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photos: images,
        pricing: {
          base_price: parseFloat(formData.price),
          pricing_type: formData.pricingType,
          minimum_charge: formData.minimumCharge ? parseFloat(formData.minimumCharge) : null,
          call_out_fee: formData.callOutFee ? parseFloat(formData.callOutFee) : null,
          emergency_surcharge: formData.emergencySurcharge ? parseFloat(formData.emergencySurcharge) : null,
          currency: 'USD',
          unit: formData.pricingType.toLowerCase()
        },
        specifications: {
          trade_type: formData.tradeType,
          service_areas: formData.serviceAreas,
          business_name: formData.businessName,
          years_experience: formData.yearsExperience,
          license_number: formData.licenseNumber,
          insurance_coverage: formData.insuranceCoverage,
          certifications: formData.certifications,
          services_offered: formData.servicesOffered,
          equipment_provided: formData.equipmentProvided,
          materials_included: formData.materialsIncluded,
          warranty_offered: formData.warrantyOffered,
          warranty_details: formData.warrantyDetails,
          emergency_available: formData.emergencyAvailable,
          max_project_size: formData.maxProjectSize,
          free_estimate: formData.freeEstimate,
          license_verified: formData.licenseVerified,
          insured: formData.insured,
          bonded: formData.bonded
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
        description: 'Trade service added successfully',
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

  const toggleServiceArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="photos">Portfolio</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Service Title *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Professional Plumbing Services"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Service Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your services, expertise, and what sets you apart"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tradeType">Trade Type *</Label>
              <Select value={formData.tradeType} onValueChange={(value) => setFormData({ ...formData, tradeType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trade" />
                </SelectTrigger>
                <SelectContent>
                  {TRADE_TYPES.map(trade => (
                    <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Your business or company name"
                required
              />
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Service Areas *</Label>
            <div className="grid grid-cols-2 gap-3">
              {SERVICE_AREAS.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.serviceAreas.includes(area)}
                    onCheckedChange={() => toggleServiceArea(area)}
                  />
                  <Label htmlFor={area} className="text-sm font-normal cursor-pointer">
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Service Location/Coverage Area *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Greater Boston Area, 50km radius"
              required
            />
          </div>

          <div>
            <Label htmlFor="servicesOffered">Specific Services Offered *</Label>
            <Textarea
              id="servicesOffered"
              value={formData.servicesOffered}
              onChange={(e) => setFormData({ ...formData, servicesOffered: e.target.value })}
              placeholder="List specific services: repairs, installations, maintenance, etc."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="equipmentProvided">Tools & Equipment</Label>
            <Input
              id="equipmentProvided"
              value={formData.equipmentProvided}
              onChange={(e) => setFormData({ ...formData, equipmentProvided: e.target.value })}
              placeholder="e.g., All professional tools and equipment provided"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="materialsIncluded"
                checked={formData.materialsIncluded}
                onCheckedChange={(checked) => setFormData({ ...formData, materialsIncluded: checked as boolean })}
              />
              <Label htmlFor="materialsIncluded" className="font-normal cursor-pointer">
                Materials included in price
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergencyAvailable"
                checked={formData.emergencyAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, emergencyAvailable: checked as boolean })}
              />
              <Label htmlFor="emergencyAvailable" className="font-normal cursor-pointer">
                24/7 Emergency services available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="freeEstimate"
                checked={formData.freeEstimate}
                onCheckedChange={(checked) => setFormData({ ...formData, freeEstimate: checked as boolean })}
              />
              <Label htmlFor="freeEstimate" className="font-normal cursor-pointer">
                Free estimate/consultation
              </Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
          <p className="text-sm text-gray-500 mt-2">
            Upload before/after photos, completed projects, or work in progress
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
              <Label htmlFor="price">Base Rate (USD) *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minimumCharge">Minimum Charge (USD)</Label>
              <Input
                id="minimumCharge"
                type="number"
                step="0.01"
                value={formData.minimumCharge}
                onChange={(e) => setFormData({ ...formData, minimumCharge: e.target.value })}
                placeholder="100.00"
              />
            </div>

            <div>
              <Label htmlFor="callOutFee">Call-out/Service Fee (USD)</Label>
              <Input
                id="callOutFee"
                type="number"
                step="0.01"
                value={formData.callOutFee}
                onChange={(e) => setFormData({ ...formData, callOutFee: e.target.value })}
                placeholder="50.00"
              />
            </div>
          </div>

          {formData.emergencyAvailable && (
            <div>
              <Label htmlFor="emergencySurcharge">Emergency Service Surcharge (%)</Label>
              <Input
                id="emergencySurcharge"
                type="number"
                value={formData.emergencySurcharge}
                onChange={(e) => setFormData({ ...formData, emergencySurcharge: e.target.value })}
                placeholder="e.g., 50 for 50% extra"
              />
            </div>
          )}

          <div>
            <Label htmlFor="maxProjectSize">Maximum Project Size</Label>
            <Input
              id="maxProjectSize"
              value={formData.maxProjectSize}
              onChange={(e) => setFormData({ ...formData, maxProjectSize: e.target.value })}
              placeholder="e.g., Up to $10,000 projects"
            />
          </div>

          <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="warrantyOffered"
              checked={formData.warrantyOffered}
              onCheckedChange={(checked) => setFormData({ ...formData, warrantyOffered: checked as boolean })}
            />
            <div className="flex-1">
              <Label htmlFor="warrantyOffered" className="font-normal cursor-pointer">
                Work warranty/guarantee offered
              </Label>
              {formData.warrantyOffered && (
                <Textarea
                  value={formData.warrantyDetails}
                  onChange={(e) => setFormData({ ...formData, warrantyDetails: e.target.value })}
                  placeholder="Describe warranty terms (e.g., 1-year workmanship guarantee)"
                  className="mt-2"
                  rows={2}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="yearsExperience">Years of Experience *</Label>
            <Input
              id="yearsExperience"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              placeholder="e.g., 10+ years"
              required
            />
          </div>

          <div>
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              placeholder="Your professional license number"
            />
          </div>

          <div>
            <Label htmlFor="insuranceCoverage">Insurance Coverage</Label>
            <Input
              id="insuranceCoverage"
              value={formData.insuranceCoverage}
              onChange={(e) => setFormData({ ...formData, insuranceCoverage: e.target.value })}
              placeholder="e.g., $1M liability insurance"
            />
          </div>

          <div>
            <Label htmlFor="certifications">Certifications & Training</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              placeholder="List relevant certifications, training, or professional memberships"
              rows={3}
            />
          </div>

          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900">Professional Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="licenseVerified"
                  checked={formData.licenseVerified}
                  onCheckedChange={(checked) => setFormData({ ...formData, licenseVerified: checked as boolean })}
                />
                <Label htmlFor="licenseVerified" className="font-normal cursor-pointer text-blue-800">
                  Licensed Professional
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insured"
                  checked={formData.insured}
                  onCheckedChange={(checked) => setFormData({ ...formData, insured: checked as boolean })}
                />
                <Label htmlFor="insured" className="font-normal cursor-pointer text-blue-800">
                  Fully Insured
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bonded"
                  checked={formData.bonded}
                  onCheckedChange={(checked) => setFormData({ ...formData, bonded: checked as boolean })}
                />
                <Label htmlFor="bonded" className="font-normal cursor-pointer text-blue-800">
                  Bonded
                </Label>
              </div>
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
