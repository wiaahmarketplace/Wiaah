'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, MessageCircle, Send, Search } from 'lucide-react';
import { toast } from 'sonner';

interface SharePlatformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: 'facebook' | 'whatsapp' | 'messenger' | 'dm' | null;
  onShare: (platform: string) => void;
  postContent?: string;
}

export function SharePlatformDialog({
  open,
  onOpenChange,
  platform,
  onShare,
  postContent = '',
}: SharePlatformDialogProps) {
  const [search, setSearch] = useState('');

  const platformConfig = {
    facebook: {
      name: 'Facebook',
      icon: Facebook,
      color: 'blue',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'green',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    messenger: {
      name: 'Messenger',
      icon: Send,
      color: 'blue',
      bgColor: 'bg-blue-400',
      hoverColor: 'hover:bg-blue-500',
    },
    dm: {
      name: 'Direct Message',
      icon: Send,
      color: 'purple',
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
  };

  if (!platform) return null;

  const config = platformConfig[platform];
  const Icon = config.icon;

  const handleShare = () => {
    const shareText = postContent || 'Check out this post!';
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (platform === 'facebook') {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(fbUrl, '_blank', 'width=600,height=400');
      toast.success('Opening Facebook share dialog...');
    } else if (platform === 'whatsapp') {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
      window.open(waUrl, '_blank');
      toast.success('Opening WhatsApp...');
    } else if (platform === 'messenger') {
      const messengerUrl = `fb-messenger://share?link=${encodeURIComponent(shareUrl)}`;
      window.open(messengerUrl, '_blank');
      toast.success('Opening Messenger...');
    } else if (platform === 'dm') {
      toast.success('Direct message feature coming soon!');
    }

    onShare(config.name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Icon className={`w-5 h-5 text-${config.color}-500`} />
            Share to {config.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {platform === 'dm' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Post Preview</p>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-900">Your post will be shared on {config.name}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              className={`flex-1 ${config.bgColor} ${config.hoverColor} text-white`}
            >
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
