'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadSection } from './image-upload-section';

interface AddDishFormProps {
  onSuccess: () => void;
}

const DISH_CATEGORIES = [
  'Appetizer', 'Soup', 'Salad', 'Main Course', 'Side Dish', 'Dessert',
  'Beverage', 'Breakfast', 'Brunch', 'Lunch Special', 'Dinner Special',
  'Kids Menu', 'Combo Meal', 'Chef Special'
];

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
  'Halal', 'Kosher', 'Keto', 'Low-Carb', 'Organic', 'Sugar-Free',
  'Paleo', 'Raw', 'Pescatarian'
];

const SPICE_LEVELS = ['None', 'Mild', 'Medium', 'Hot', 'Extra Hot'];

const MEAL_TIMES = ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'All Day'];

export function AddDishForm({ onSuccess }: AddDishFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    servingSize: '',
    preparationTime: '',
    spiceLevel: 'None',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    ingredients: '',
    allergens: '',
    chefNotes: '',
    mealTime: [] as string[],
    dietaryOptions: [] as string[],
    customizable: false,
    popularDish: false,
    seasonal: false,
    takeawayAvailable: true,
    deliveryAvailable: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to add a dish',
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
        service_category: 'restaurants',
        name: formData.name,
        description: formData.description,
        photos: images,
        pricing: {
          base_price: parseFloat(formData.price),
          currency: 'USD',
          unit: 'per serving'
        },
        specifications: {
          category: formData.category,
          serving_size: formData.servingSize,
          preparation_time: formData.preparationTime,
          spice_level: formData.spiceLevel,
          nutritional_info: {
            calories: formData.calories ? parseInt(formData.calories) : null,
            protein: formData.protein,
            carbs: formData.carbs,
            fat: formData.fat
          },
          ingredients: formData.ingredients,
          allergens: formData.allergens,
          chef_notes: formData.chefNotes,
          meal_time: formData.mealTime,
          customizable: formData.customizable,
          popular_dish: formData.popularDish,
          seasonal: formData.seasonal,
          takeaway_available: formData.takeawayAvailable,
          delivery_available: formData.deliveryAvailable
        },
        amenities: formData.dietaryOptions,
        availability: {
          blocked_dates: blockedDates.map(d => d.toISOString())
        },
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Dish added successfully',
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add dish',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDietary = (option: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryOptions: prev.dietaryOptions.includes(option)
        ? prev.dietaryOptions.filter(o => o !== option)
        : [...prev.dietaryOptions, option]
    }));
  };

  const toggleMealTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      mealTime: prev.mealTime.includes(time)
        ? prev.mealTime.filter(t => t !== time)
        : [...prev.mealTime, time]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="dietary">Dietary & Options</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Dish Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Grilled Salmon with Herbs"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the dish, its flavors, and what makes it special"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DISH_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                placeholder="15.99"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="servingSize">Serving Size *</Label>
              <Input
                id="servingSize"
                value={formData.servingSize}
                onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                placeholder="e.g., 1 portion, 250g"
                required
              />
            </div>

            <div>
              <Label htmlFor="preparationTime">Prep Time *</Label>
              <Input
                id="preparationTime"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                placeholder="e.g., 15-20 min"
                required
              />
            </div>

            <div>
              <Label htmlFor="spiceLevel">Spice Level *</Label>
              <Select value={formData.spiceLevel} onValueChange={(value) => setFormData({ ...formData, spiceLevel: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPICE_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="ingredients">Main Ingredients *</Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="List main ingredients separated by commas"
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="allergens">Allergens</Label>
            <Input
              id="allergens"
              value={formData.allergens}
              onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
              placeholder="e.g., Contains nuts, gluten, dairy"
            />
          </div>

          <div>
            <Label htmlFor="chefNotes">Chef's Notes</Label>
            <Textarea
              id="chefNotes"
              value={formData.chefNotes}
              onChange={(e) => setFormData({ ...formData, chefNotes: e.target.value })}
              placeholder="Special preparation methods, pairing suggestions, story behind the dish"
              rows={2}
            />
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ImageUploadSection images={images} onImagesChange={setImages} />
          <p className="text-sm text-gray-500 mt-2">
            Upload high-quality photos of the dish from different angles
          </p>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4 mt-6">
          <div>
            <h4 className="font-semibold mb-4">Nutritional Information (Optional)</h4>
            <p className="text-sm text-gray-600 mb-4">
              Providing nutritional info helps health-conscious customers
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories">Calories (kcal)</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="450"
              />
            </div>

            <div>
              <Label htmlFor="protein">Protein</Label>
              <Input
                id="protein"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                placeholder="e.g., 25g"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="carbs">Carbohydrates</Label>
              <Input
                id="carbs"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                placeholder="e.g., 30g"
              />
            </div>

            <div>
              <Label htmlFor="fat">Fat</Label>
              <Input
                id="fat"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                placeholder="e.g., 15g"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dietary" className="space-y-6 mt-6">
          <div>
            <Label className="mb-3 block">Dietary Options & Labels</Label>
            <div className="grid grid-cols-3 gap-3">
              {DIETARY_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={formData.dietaryOptions.includes(option)}
                    onCheckedChange={() => toggleDietary(option)}
                  />
                  <Label htmlFor={option} className="text-sm font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Available Meal Times</Label>
            <div className="grid grid-cols-5 gap-3">
              {MEAL_TIMES.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={time}
                    checked={formData.mealTime.includes(time)}
                    onCheckedChange={() => toggleMealTime(time)}
                  />
                  <Label htmlFor={time} className="text-sm font-normal cursor-pointer">
                    {time}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customizable"
                checked={formData.customizable}
                onCheckedChange={(checked) => setFormData({ ...formData, customizable: checked as boolean })}
              />
              <Label htmlFor="customizable" className="font-normal cursor-pointer">
                Customizable (customers can modify ingredients)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="popularDish"
                checked={formData.popularDish}
                onCheckedChange={(checked) => setFormData({ ...formData, popularDish: checked as boolean })}
              />
              <Label htmlFor="popularDish" className="font-normal cursor-pointer">
                Popular/Signature Dish
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="seasonal"
                checked={formData.seasonal}
                onCheckedChange={(checked) => setFormData({ ...formData, seasonal: checked as boolean })}
              />
              <Label htmlFor="seasonal" className="font-normal cursor-pointer">
                Seasonal Dish (limited availability)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="takeawayAvailable"
                checked={formData.takeawayAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, takeawayAvailable: checked as boolean })}
              />
              <Label htmlFor="takeawayAvailable" className="font-normal cursor-pointer">
                Available for takeaway
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, deliveryAvailable: checked as boolean })}
              />
              <Label htmlFor="deliveryAvailable" className="font-normal cursor-pointer">
                Available for delivery
              </Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6 mt-6">
          <div>
            <Label className="mb-3 block">Block Dates (When Dish is Unavailable)</Label>
            <p className="text-sm text-gray-600 mb-4">
              Select dates when this dish won't be available (e.g., seasonal ingredients out of stock)
            </p>
            <div className="border rounded-lg p-4 bg-white">
              <Calendar
                mode="multiple"
                selected={blockedDates}
                onSelect={(dates) => setBlockedDates(dates || [])}
                className="rounded-md"
              />
            </div>
          </div>

          {blockedDates.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Unavailable Dates: {blockedDates.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {blockedDates.map((date, index) => (
                  <Badge key={index} variant="secondary">
                    {date.toLocaleDateString()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Dish'}
        </Button>
      </div>
    </form>
  );
}
