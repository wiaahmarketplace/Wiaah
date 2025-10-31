'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Search,
  MessageSquare,
  Instagram,
  Mail,
  Link2,
  QrCode,
  Check
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url?: string;
  title?: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Ava',
    username: '@avawang',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: '2',
    name: 'Ella',
    username: '@ellaliu',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: '3',
    name: 'Kai',
    username: '@kaicheng',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: '4',
    name: 'Nora',
    username: '@norahuang',
    avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: '5',
    name: 'Liam',
    username: '@liamhuang',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: '6',
    name: 'Mia',
    username: '@miachen',
    avatar: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: '7',
    name: 'Ella',
    username: '@ellaliu',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: '8',
    name: 'Mia',
    username: '@miachen',
    avatar: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

export function ShareDialog({ open, onOpenChange, url = '', title = '' }: ShareDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleCopyLink = async () => {
    const shareUrl = url || window.location.href;
    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSMS = () => {
    const shareUrl = url || window.location.href;
    const message = title ? `${title} - ${shareUrl}` : shareUrl;
    window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
  };

  const handleWhatsApp = () => {
    const shareUrl = url || window.location.href;
    const message = title ? `${title} - ${shareUrl}` : shareUrl;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleInstagram = () => {
    alert('Instagram sharing opens the Instagram app to share');
  };

  const handleFacebook = () => {
    const shareUrl = url || window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleDirectMessage = () => {
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact');
      return;
    }
    console.log('Sending to contacts:', selectedContacts);
    alert(`Message sent to ${selectedContacts.length} contact(s)`);
    setSelectedContacts([]);
  };

  const handleEmail = () => {
    const shareUrl = url || window.location.href;
    const subject = title || 'Check this out';
    const body = `I thought you might be interested in this: ${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleQRCode = () => {
    alert('QR Code generation feature');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <div className="flex flex-col max-h-[85vh]">
          <div className="p-6 pb-4">
            <h2 className="text-2xl font-bold text-center mb-4">Share</h2>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search contacts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-100 border-0 h-12 rounded-xl text-base"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => toggleContact(contact.id)}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-colors text-left ${
                    selectedContacts.includes(contact.id)
                      ? 'bg-emerald-50 border-2 border-emerald-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedContacts.includes(contact.id) && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{contact.name}</div>
                    <div className="text-xs text-gray-500 truncate">{contact.username}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedContacts.length > 0 && (
            <div className="border-t px-6 pt-4 pb-2">
              <div className="relative">
                <textarea
                  placeholder="Add a message..."
                  className="w-full min-h-[120px] resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 focus:ring-0"
                  maxLength={500}
                />
                <Button
                  onClick={handleDirectMessage}
                  className="absolute bottom-3 right-3 h-10 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-full shadow-md"
                >
                  Share
                </Button>
              </div>
            </div>
          )}

          <div className="border-t p-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-14 justify-start gap-3 text-base font-semibold rounded-xl border-2"
                onClick={handleSMS}
              >
                <MessageSquare className="h-5 w-5" />
                SMS
              </Button>
              <Button
                variant="outline"
                className="h-14 justify-start gap-3 text-base font-semibold rounded-xl border-2"
                onClick={handleWhatsApp}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp Contact
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-14 justify-start gap-3 text-base font-semibold rounded-xl border-2"
                onClick={handleInstagram}
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </Button>
              <Button
                variant="outline"
                className="h-14 justify-start gap-3 text-base font-semibold rounded-xl border-2"
                onClick={handleFacebook}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-14 justify-start gap-3 text-base font-semibold rounded-xl border-2"
                onClick={handleEmail}
              >
                <Mail className="h-5 w-5" />
                Email
              </Button>
              <Button
                variant="outline"
                className="h-14 justify-start gap-3 text-base font-semibold rounded-xl border-2"
                onClick={handleCopyLink}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-5 w-5" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="h-14 justify-start gap-3 text-base font-semibold rounded-xl border-2"
                onClick={handleQRCode}
              >
                <QrCode className="h-5 w-5" />
                QR Code
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
