'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink, TrendingUp, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';

interface AffiliationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliation: {
    id: string;
    image: string;
    brand: string;
    commission: string;
    clicks: number;
    description?: string;
    price?: number;
    features?: string[];
    category?: string;
    affiliateLink?: string;
  } | null;
}

export function AffiliationDetailsDialog({
  open,
  onOpenChange,
  affiliation,
}: AffiliationDetailsDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!affiliation) return null;

  const affiliateLink = affiliation.affiliateLink || `https://example.com/aff/${affiliation.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      toast.success('Affiliate link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleOpenLink = () => {
    window.open(affiliateLink, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh]">
        <div className="flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
          <div className="flex-1 bg-black flex items-center justify-center p-8">
            <img
              src={affiliation.image}
              alt={affiliation.brand}
              className="max-w-full max-h-[600px] object-contain rounded-lg"
            />
          </div>

          <div className="w-full md:w-96 border-l bg-white overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {affiliation.brand}
                </h2>
                {affiliation.description && (
                  <p className="text-gray-600">{affiliation.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">Commission</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {affiliation.commission}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointerClick className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Total Clicks</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {affiliation.clicks}
                  </p>
                </div>
              </div>

              {affiliation.price && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Price</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    ${affiliation.price.toFixed(2)}
                  </p>
                </div>
              )}

              {affiliation.category && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Category</h3>
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    {affiliation.category}
                  </span>
                </div>
              )}

              {affiliation.features && affiliation.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Features</h3>
                  <ul className="space-y-2">
                    {affiliation.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Affiliate Link</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="flex-1 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleOpenLink}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Performance</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Estimated Earnings:</span>
                    <span className="font-semibold text-emerald-600">
                      ${(affiliation.clicks * 0.5).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate:</span>
                    <span className="font-semibold">
                      {((affiliation.clicks / (affiliation.clicks + 100)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
