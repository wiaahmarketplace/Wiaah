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

interface AddTourismFormProps {
  onSuccess: () => void;
}

const TOUR_TYPES = ['Guided Tour', 'Walking Tour', 'Bus Tour', 'Boat Tour', 'Food Tour', 'Wine Tour', 'Adventure Tour', 'Cultural Tour', 'Private Tour', 'Group Tour'];
const DURATION_OPTIONS = ['1 hour', '2 hours', '3 hours', 'Half Day', 'Full Day', 'Multi-Day'];
const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Challenging', 'Difficult'];

export function AddTourismForm({ onSuccess }: AddTourismFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [addOns, setAddOns] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tourType: '',
    duration: '',
    difficulty: 'Easy',
    price: '',
    groupSize: '',
    location: '',
    meetingPoint: '',
    guideName: '',
    languages: '',
    inclusions: '',
    exclusions: '',
    requirements: '',
    mealsIncluded: false,
    transportIncluded: false,
    equipmentProvided: false,
    accessible: false,
    childFriendly: false,
    petFriendly: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || images.length === 0) {
        toast({ title: 'Error', description: !user ? 'Please login' : 'Add images', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('service_items').insert({
        user_id: user.id,
        service_category: 'local-tourism',
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photos: images,
        pricing: { base_price: parseFloat(formData.price), currency: 'USD', unit: 'per person' },
        specifications: { ...formData, group_size: parseInt(formData.groupSize) },
        availability: { blocked_dates: blockedDates.map(d => d.toISOString()) },
        cancellation_policy: cancellationPolicy,
        add_ons: addOns,
        status: 'draft'
      });

      if (error) throw error;
      toast({ title: 'Success', description: 'Tour added successfully' });
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
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
          <TabsTrigger value="details">Tour Details</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="policy">Policy & Extras</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Tour Name *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Historic City Walking Tour" required />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tourType">Tour Type *</Label>
              <Select value={formData.tourType} onValueChange={(value) => setFormData({ ...formData, tourType: value })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{TOUR_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                <SelectContent>{DURATION_OPTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DIFFICULTY_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price per Person (USD) *</Label>
              <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="groupSize">Max Group Size *</Label>
              <Input id="groupSize" type="number" value={formData.groupSize} onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })} required />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="meetingPoint">Meeting Point *</Label>
              <Input id="meetingPoint" value={formData.meetingPoint} onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guideName">Guide Name</Label>
              <Input id="guideName" value={formData.guideName} onChange={(e) => setFormData({ ...formData, guideName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="languages">Languages Offered *</Label>
              <Input id="languages" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} placeholder="English, Spanish" required />
            </div>
          </div>
          <div>
            <Label htmlFor="inclusions">What's Included *</Label>
            <Textarea id="inclusions" value={formData.inclusions} onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })} rows={3} required />
          </div>
          <div>
            <Label htmlFor="exclusions">What's Not Included</Label>
            <Textarea id="exclusions" value={formData.exclusions} onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })} rows={2} />
          </div>
          <div className="space-y-3">
            <Checkbox id="mealsIncluded" checked={formData.mealsIncluded} onCheckedChange={(c) => setFormData({ ...formData, mealsIncluded: c as boolean })} />
            <Label htmlFor="mealsIncluded" className="ml-2">Meals Included</Label>
          </div>
        </TabsContent>

        <TabsContent value="availability" className="mt-6">
          <Calendar mode="multiple" selected={blockedDates} onSelect={(d) => setBlockedDates(d || [])} />
        </TabsContent>

        <TabsContent value="policy" className="space-y-8 mt-6">
          <CancellationPolicySection policy={cancellationPolicy} onPolicyChange={setCancellationPolicy} />
          <AddOnsSection addOns={addOns} onAddOnsChange={setAddOns} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Tour'}</Button>
      </div>
    </form>
  );
}
