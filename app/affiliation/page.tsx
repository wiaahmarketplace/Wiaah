'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/loading-spinner';
import { toast as sonnerToast } from 'sonner';

interface Affiliation {
  id: string;
  name: string;
  description: string;
  price: number;
  cashbackPercentage: number;
  affiliateLink: string;
  imageUrl: string;
  providerName: string;
  providerType: 'shop' | 'service';
  providerLogo: string;
  category: string;
  features: string[];
  username: string;
  userAvatar: string;
}

const mockAffiliations = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-fidelity sound for an immersive audio experience.',
    price: 149.99,
    cashbackPercentage: 10,
    affiliateLink: 'https://example.com/affiliate/wireless-headphones',
    imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600',
    providerName: 'TechStore',
    providerType: 'shop',
    providerLogo: 'https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Electronics',
    features: ['Noise cancellation', 'Bluetooth 5.0', '30-hour battery life', 'Premium build quality'],
    username: 'techstore_official',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '2',
    name: 'Smartwatch',
    description: 'Track your fitness goals and stay connected on the go.',
    price: 249.99,
    cashbackPercentage: 12,
    affiliateLink: 'https://example.com/affiliate/smartwatch',
    imageUrl: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=600',
    providerName: 'FitGear',
    providerType: 'shop',
    providerLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Wearables',
    features: ['Heart rate monitor', 'GPS tracking', 'Water resistant', 'Sleep tracking'],
    username: 'fitgear_pro',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    description: 'A comfortable and stylish everyday essential.',
    price: 29.99,
    cashbackPercentage: 15,
    affiliateLink: 'https://example.com/affiliate/cotton-tshirt',
    imageUrl: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600',
    providerName: 'Fashion Hub',
    providerType: 'shop',
    providerLogo: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Clothing',
    features: ['100% cotton', 'Available in multiple colors', 'Machine washable', 'Comfortable fit'],
    username: 'fashionhub',
    userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '4',
    name: 'Bluetooth Speaker',
    description: 'Portable and powerful — bring your music anywhere.',
    price: 89.99,
    cashbackPercentage: 8,
    affiliateLink: 'https://example.com/affiliate/bluetooth-speaker',
    imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
    providerName: 'AudioPro',
    providerType: 'shop',
    providerLogo: 'https://images.pexels.com/photos/158826/structure-light-led-movement-158826.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Electronics',
    features: ['360-degree sound', 'Waterproof design', '12-hour battery', 'Compact and portable'],
    username: 'audiopro_official',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '5',
    name: 'Yoga Classes',
    description: 'Find your balance with professional yoga instruction.',
    price: 79.99,
    cashbackPercentage: 10,
    affiliateLink: 'https://example.com/affiliate/yoga-classes',
    imageUrl: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=600',
    providerName: 'Wellness Studio',
    providerType: 'service',
    providerLogo: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Fitness',
    features: ['Beginner to advanced levels', 'Online and in-person', 'Certified instructors', 'Flexible scheduling'],
    username: 'wellness_studio',
    userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '6',
    name: 'Photography Course',
    description: 'Master the art of photography with expert guidance.',
    price: 149.99,
    cashbackPercentage: 5,
    affiliateLink: 'https://example.com/affiliate/photography-course',
    imageUrl: 'https://images.pexels.com/photos/631997/pexels-photo-631997.jpeg?auto=compress&cs=tinysrgb&w=600',
    providerName: 'Creative Academy',
    providerType: 'service',
    providerLogo: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Education',
    features: ['10 weeks course', 'Hands-on projects', 'Portfolio building', 'Certificate included'],
    username: 'creative_academy',
    userAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '7',
    name: 'Premium Coffee Beans',
    description: 'Artisan roasted beans for the perfect cup.',
    price: 24.99,
    cashbackPercentage: 12,
    affiliateLink: 'https://example.com/affiliate/coffee-beans',
    imageUrl: 'https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg?auto=compress&cs=tinysrgb&w=600',
    providerName: 'Brew Masters',
    providerType: 'shop',
    providerLogo: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Food & Beverage',
    features: ['Organic and fair trade', 'Small batch roasted', 'Multiple origin options', 'Fresh guarantee'],
    username: 'brewmasters',
    userAvatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '8',
    name: 'Car Detailing Service',
    description: 'Professional cleaning for your vehicle inside and out.',
    price: 129.99,
    cashbackPercentage: 7,
    affiliateLink: 'https://example.com/affiliate/car-detailing',
    imageUrl: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg?auto=compress&cs=tinysrgb&w=600',
    providerName: 'Auto Care Pro',
    providerType: 'service',
    providerLogo: 'https://images.pexels.com/photos/261985/pexels-photo-261985.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Automotive',
    features: ['Interior and exterior', 'Waxing and polishing', 'Engine cleaning', 'Mobile service available'],
    username: 'autocarepro',
    userAvatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function AffiliationPage() {
  const [selectedAffiliation, setSelectedAffiliation] = useState<Affiliation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadAffiliations();
  }, []);

  const loadAffiliations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('affiliations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedAffiliations: Affiliation[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: parseFloat(item.price),
          cashbackPercentage: parseFloat(item.cashback_percentage),
          affiliateLink: item.affiliate_link,
          imageUrl: item.image_url,
          providerName: item.provider_name,
          providerType: item.provider_type,
          providerLogo: item.provider_logo || '',
          category: item.category || '',
          features: item.features || [],
          username: item.username || '',
          userAvatar: item.user_avatar || '',
        }));
        setAffiliations(formattedAffiliations);
      }
    } catch (error) {
      console.error('Error loading affiliations:', error);
      sonnerToast.error('Failed to load affiliations');
    } finally {
      setLoading(false);
    }
  };

  const copyAffiliateLink = async (link: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      toast({
        title: 'Link copied!',
        description: 'Affiliate link has been copied to clipboard.',
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const displayAffiliations: Affiliation[] = affiliations.length > 0 ? affiliations : mockAffiliations.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    cashbackPercentage: item.cashbackPercentage,
    affiliateLink: item.affiliateLink,
    imageUrl: item.imageUrl,
    providerName: item.providerName,
    providerType: item.providerType as 'shop' | 'service',
    providerLogo: item.providerLogo,
    category: item.category,
    features: item.features,
    username: item.username,
    userAvatar: item.userAvatar,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayAffiliations.map((affiliation) => (
            <div
              key={affiliation.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAffiliation(affiliation)}
            >
              <div className="relative h-56">
                <img
                  src={affiliation.imageUrl}
                  alt={affiliation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded">
                  {affiliation.cashbackPercentage}%% Cashback
                </div>
              </div>

              <div className="p-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${affiliation.username}`);
                  }}
                  className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={affiliation.userAvatar} />
                    <AvatarFallback>{affiliation.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-gray-900">@{affiliation.username}</span>
                </button>

                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {affiliation.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {affiliation.description}
                </p>
                <div className="text-2xl font-bold text-emerald-500 mb-4">
                  ${affiliation.price}
                </div>

                <Button
                  onClick={(e) => copyAffiliateLink(affiliation.affiliateLink, affiliation.id, e)}
                  variant="outline"
                  className="w-full border-2 border-black text-black hover:bg-black hover:text-white font-semibold"
                >
                  {copiedId === affiliation.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      Affiliate Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedAffiliation} onOpenChange={() => setSelectedAffiliation(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedAffiliation && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {selectedAffiliation.providerLogo && (
                      <img
                        src={selectedAffiliation.providerLogo}
                        alt={selectedAffiliation.providerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <DialogTitle className="text-2xl">{selectedAffiliation.name}</DialogTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedAffiliation.providerName} • {selectedAffiliation.providerType === 'shop' ? 'Shop' : 'Service Provider'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/profile/${selectedAffiliation.username}`);
                    }}
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                  >
                    <Avatar className="w-10 h-10 cursor-pointer">
                      <AvatarImage src={selectedAffiliation.userAvatar} />
                      <AvatarFallback>{selectedAffiliation.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">@{selectedAffiliation.username}</p>
                      <p className="text-xs text-gray-500">View profile</p>
                    </div>
                  </button>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <img
                    src={selectedAffiliation.imageUrl}
                    alt={selectedAffiliation.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white text-sm font-medium px-4 py-2 rounded">
                    {selectedAffiliation.cashbackPercentage}% Cashback
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedAffiliation.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Price</h3>
                  <div className="text-3xl font-bold text-emerald-500">
                    ${selectedAffiliation.price}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Features</h3>
                  <ul className="space-y-2">
                    {selectedAffiliation.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Category</h3>
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {selectedAffiliation.category}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={(e) => copyAffiliateLink(selectedAffiliation.affiliateLink, selectedAffiliation.id, e)}
                    className="w-full bg-black hover:bg-gray-800 text-white h-12 text-base font-semibold"
                  >
                    {copiedId === selectedAffiliation.id ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mr-2" />
                        Copy Affiliate Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
