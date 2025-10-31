'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Facebook, MessageCircle, MapPin, Tag, Globe, X } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { VisibilitySettingsDialog } from './visibility-settings-dialog';
import { TagPeopleDialog } from './tag-people-dialog';
import { LocationPickerDialog } from './location-picker-dialog';
import { SharePlatformDialog } from './share-platform-dialog';

interface PostDetailsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    content: string;
    hashtags: string[];
    location?: string;
    visibility: string;
    taggedPeople?: any[];
    shareOn?: string[];
  }) => void;
  onBack: () => void;
}

interface TaggedPerson {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
}

export function PostDetailsFormDialog({
  open,
  onOpenChange,
  onSubmit,
  onBack,
}: PostDetailsFormDialogProps) {
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['#paris', '#paris', '#paris', '#paris', '#paris', '#paris', '#paris']);
  const [hashtagInput, setHashtagInput] = useState('');
  const [location, setLocation] = useState('');
  const [visibility, setVisibility] = useState('Everyone can view this post');
  const [taggedPeople, setTaggedPeople] = useState<TaggedPerson[]>([]);
  const [shareOn, setShareOn] = useState<string[]>([]);

  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false);
  const [showTagPeopleDialog, setShowTagPeopleDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [currentSharePlatform, setCurrentSharePlatform] = useState<'facebook' | 'whatsapp' | 'messenger' | 'dm' | null>(null);

  const maxCharacters = 4000;

  const handleAddHashtag = (tag: string) => {
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (formattedTag.length > 1 && !hashtags.includes(formattedTag)) {
      setHashtags([...hashtags, formattedTag]);
    }
    setHashtagInput('');
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    onSubmit({
      content,
      hashtags,
      location,
      visibility,
      taggedPeople,
      shareOn,
    });
  };

  const handleSharePlatform = (platform: 'facebook' | 'whatsapp' | 'messenger' | 'dm') => {
    setCurrentSharePlatform(platform);
    setShowShareDialog(true);
  };

  const handleShareConfirm = (platform: string) => {
    if (!shareOn.includes(platform)) {
      setShareOn([...shareOn, platform]);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 bg-black text-white border-none overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Post Details</DialogTitle>
          </VisuallyHidden>

          <div className="p-6 space-y-6">
            <textarea
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= maxCharacters) {
                  setContent(e.target.value);
                }
              }}
              placeholder="Share your thoughts within 4000 characters"
              className="w-full h-32 bg-white text-black placeholder:text-gray-400 rounded-lg px-4 py-3 resize-none outline-none text-sm"
            />
            <div className="flex justify-end text-xs text-gray-400">
              {content.length}/{maxCharacters}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRemoveHashtag(tag)}
                    className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && hashtagInput.trim()) {
                    e.preventDefault();
                    handleAddHashtag(hashtagInput.trim());
                  }
                }}
                placeholder="Add hashtag and press Enter..."
                className="w-full bg-transparent border-b border-gray-700 px-2 py-2 text-sm outline-none placeholder:text-gray-500"
              />
            </div>

            {location && (
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="flex-1">{location}</span>
                <button
                  type="button"
                  onClick={() => setLocation('')}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {taggedPeople.length > 0 && (
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-lg">
                <Tag className="w-4 h-4 text-yellow-400" />
                <span className="flex-1">
                  Tagged {taggedPeople.length} {taggedPeople.length === 1 ? 'person' : 'people'}
                </span>
                <button
                  type="button"
                  onClick={() => setTaggedPeople([])}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {shareOn.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {shareOn.map((platform, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-full">
                    <span>Share on {platform}</span>
                    <button
                      type="button"
                      onClick={() => setShareOn(shareOn.filter(p => p !== platform))}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSharePlatform('facebook')}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors border border-white/20"
              >
                <Facebook className="w-5 h-5 text-blue-400 fill-blue-400" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
              <button
                type="button"
                onClick={() => handleSharePlatform('whatsapp')}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors border border-white/20"
              >
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLocationDialog(true)}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors border border-white/20"
              >
                <MapPin className="w-5 h-5 text-red-400 fill-red-400" />
                <span className="text-sm font-medium">Location</span>
              </button>
              <button
                type="button"
                onClick={() => setShowTagPeopleDialog(true)}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors border border-white/20"
              >
                <Tag className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Tag People</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowVisibilityDialog(true)}
              className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors border border-white/20"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <span className="text-sm">{visibility}</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>

            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-base font-semibold rounded-lg"
            >
              Publish Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <VisibilitySettingsDialog
        open={showVisibilityDialog}
        onOpenChange={setShowVisibilityDialog}
        currentVisibility={visibility}
        onSelect={setVisibility}
      />

      <TagPeopleDialog
        open={showTagPeopleDialog}
        onOpenChange={setShowTagPeopleDialog}
        onTagged={setTaggedPeople}
      />

      <LocationPickerDialog
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        onLocationSelected={setLocation}
      />

      <SharePlatformDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        platform={currentSharePlatform}
        onShare={handleShareConfirm}
        postContent={content}
      />
    </>
  );
}
