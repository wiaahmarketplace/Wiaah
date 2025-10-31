"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Address {
  id: string;
  type: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  illustration: string;
}

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
  mode: "add" | "edit";
  onSave?: (address: Partial<Address>) => void;
}

interface AddressResult {
  place_id: string;
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

const searchAddress = async (query: string): Promise<AddressResult[]> => {
  if (query.length < 3) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=5`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
};

export function AddressDialog({
  open,
  onOpenChange,
  address,
  mode,
  onSave,
}: AddressDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddress2, setStreetAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [isDefaultDelivery, setIsDefaultDelivery] = useState(false);
  const [isDefaultBilling, setIsDefaultBilling] = useState(false);

  useEffect(() => {
    if (address && mode === "edit") {
      const [first, ...rest] = address.name.split(" ");
      setFirstName(first || "");
      setLastName(rest.join(" ") || "");
      setStreetAddress(address.street || "");
      setStreetAddress2("");
      setZipCode(address.zip || "");
      setCity(address.city || "");
      setState(address.state || "");
      setCountry(address.country || "");
      setIsDefaultDelivery(address.type === "Default delivery Address");
      setIsDefaultBilling(address.type === "Billing address");
    } else {
      setFirstName("");
      setLastName("");
      setStreetAddress("");
      setStreetAddress2("");
      setZipCode("");
      setCity("");
      setState("");
      setCountry("");
      setIsDefaultDelivery(false);
      setIsDefaultBilling(false);
      setSearchQuery("");
    }
  }, [address, mode, open]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length < 3) {
      setShowSuggestions(false);
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchAddress(searchQuery);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setIsSearching(false);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSelectSuggestion = (suggestion: AddressResult) => {
    const addr = suggestion.address;

    const streetParts = [];
    if (addr.house_number) streetParts.push(addr.house_number);
    if (addr.road) streetParts.push(addr.road);
    const fullStreet = streetParts.join(' ');

    setSearchQuery(suggestion.display_name);
    setStreetAddress(fullStreet || addr.road || '');
    setCity(addr.city || addr.town || addr.village || '');
    setState(addr.state || '');
    setZipCode(addr.postcode || '');
    setCountry(addr.country || '');
    setShowSuggestions(false);
  };

  const handleSave = () => {
    const newAddress = {
      name: `${firstName} ${lastName}`.trim(),
      street: streetAddress,
      city,
      state,
      zip: zipCode,
      country,
      type: isDefaultDelivery
        ? "Default delivery Address"
        : isDefaultBilling
        ? "Billing address"
        : "Other Addresses",
    };

    if (onSave) {
      onSave(newAddress);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full max-h-[90vh]">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="text-sm text-gray-500 mb-1">
              Settings / <span className="text-gray-900 font-medium">Addresses</span>
            </div>
            <DialogTitle className="text-xl font-bold">
              {mode === "add" ? "Add New Address" : "Edit Address"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="searchAddress" className="text-sm text-gray-700 mb-1.5 block">
                  Search Address
                </Label>
                <div className="relative">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin z-10" />
                    )}
                    <Input
                      id="searchAddress"
                      placeholder="Search any address in the world..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10 bg-gray-50 border-gray-200"
                    />
                  </div>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion) => {
                        const addr = suggestion.address;
                        const mainText = [addr.house_number, addr.road].filter(Boolean).join(' ');
                        const secondaryParts = [
                          addr.city || addr.town || addr.village,
                          addr.state,
                          addr.postcode,
                          addr.country
                        ].filter(Boolean);
                        const secondaryText = secondaryParts.join(', ');

                        return (
                          <button
                            key={suggestion.place_id}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b last:border-b-0"
                          >
                            <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 text-sm">
                                {mainText || suggestion.display_name.split(',')[0]}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5 truncate">
                                {secondaryText || suggestion.display_name}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-sm text-gray-700 mb-1.5 block">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm text-gray-700 mb-1.5 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="streetAddress" className="text-sm text-gray-700 mb-1.5 block">
                  Street Address
                </Label>
                <Input
                  id="streetAddress"
                  placeholder="Street Address"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>

              <div>
                <Label htmlFor="streetAddress2" className="text-sm text-gray-700 mb-1.5 block">
                  Street Address Line 2 (Optional)
                </Label>
                <Input
                  id="streetAddress2"
                  placeholder="Street Address Line 2 (Optional)"
                  value={streetAddress2}
                  onChange={(e) => setStreetAddress2(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>

              <div>
                <Label htmlFor="zipCode" className="text-sm text-gray-700 mb-1.5 block">
                  Zip Code
                </Label>
                <Input
                  id="zipCode"
                  placeholder="Zip Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-sm text-gray-700 mb-1.5 block">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-sm text-gray-700 mb-1.5 block">
                  State
                </Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-sm text-gray-700 mb-1.5 block">
                  Country
                </Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="defaultDelivery"
                    checked={isDefaultDelivery}
                    onCheckedChange={(checked) => {
                      setIsDefaultDelivery(checked === true);
                      if (checked) setIsDefaultBilling(false);
                    }}
                  />
                  <Label
                    htmlFor="defaultDelivery"
                    className="text-sm text-gray-700 cursor-pointer font-normal"
                  >
                    Set as default delivery address
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="defaultBilling"
                    checked={isDefaultBilling}
                    onCheckedChange={(checked) => {
                      setIsDefaultBilling(checked === true);
                      if (checked) setIsDefaultDelivery(false);
                    }}
                  />
                  <Label
                    htmlFor="defaultBilling"
                    className="text-sm text-gray-700 cursor-pointer font-normal"
                  >
                    Set as default billing address
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-white flex-shrink-0">
            <Button
              onClick={handleSave}
              className="w-full bg-black hover:bg-gray-800 text-white h-11"
            >
              Save Address
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
