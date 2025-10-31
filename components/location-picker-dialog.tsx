'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Navigation, Check } from 'lucide-react';

interface LocationPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelected: (location: string) => void;
}

const popularLocations = [
  { id: '1', name: 'Eiffel Tower', type: 'Landmark', city: 'Paris, France' },
  { id: '2', name: 'Louvre Museum', type: 'Museum', city: 'Paris, France' },
  { id: '3', name: 'Arc de Triomphe', type: 'Landmark', city: 'Paris, France' },
  { id: '4', name: 'Notre-Dame Cathedral', type: 'Landmark', city: 'Paris, France' },
  { id: '5', name: 'Sacré-Cœur', type: 'Landmark', city: 'Paris, France' },
  { id: '6', name: 'Champs-Élysées', type: 'Street', city: 'Paris, France' },
  { id: '7', name: 'Versailles', type: 'Palace', city: 'Versailles, France' },
  { id: '8', name: 'Montmartre', type: 'Neighborhood', city: 'Paris, France' },
];

export function LocationPickerDialog({
  open,
  onOpenChange,
  onLocationSelected,
}: LocationPickerDialogProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');

  const filteredLocations = popularLocations.filter((location) =>
    location.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (locationName: string) => {
    setSelected(locationName);
    onLocationSelected(locationName);
    onOpenChange(false);
  };

  const handleUseCurrentLocation = () => {
    onLocationSelected('Current Location');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Location</DialogTitle>
        </DialogHeader>

        <Button
          onClick={handleUseCurrentLocation}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Use Current Location
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredLocations.map((location) => {
            const isSelected = selected === location.name;
            return (
              <button
                key={location.id}
                onClick={() => handleSelect(location.name)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-gray-50 ${
                  isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                }`}
              >
                <div className="p-2 rounded-full bg-red-100">
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{location.name}</p>
                  <p className="text-sm text-gray-500">
                    {location.type} • {location.city}
                  </p>
                </div>
                {isSelected && <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
