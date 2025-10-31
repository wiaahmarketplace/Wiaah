'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Facebook, MessageCircle, Globe, Users, MapPin, MessageSquare, Video, ChevronRight, Tag, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { VisibilitySettingsDialog } from './visibility-settings-dialog';
import { TagPeopleDialog } from './tag-people-dialog';
import { LocationPickerDialog } from './location-picker-dialog';

interface PostDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  filter?: string;
  videoStart?: number;
  videoEnd?: number;
  onBack: () => void;
}

const defaultHashtags = ['#paris', '#paris', '#paris', '#paris', '#paris', '#paris', '#paris'];

export function PostDetailsDialog({
  open,
  onOpenChange,
  mediaUrl,
  mediaType,
  filter,
  videoStart,
  videoEnd,
  onBack,
}: PostDetailsDialogProps) {
  const [caption, setCaption] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [allowComments, setAllowComments] = useState(true);
  const [allowHighQuality, setAllowHighQuality] = useState(false);
  const [visibility, setVisibility] = useState('Everyone can view this post');
  const [publishing, setPublishing] = useState(false);
  const [location, setLocation] = useState('');
  const [taggedPeople, setTaggedPeople] = useState<any[]>([]);
  const [shareOn, setShareOn] = useState<string[]>([]);

  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false);
  const [showTagPeopleDialog, setShowTagPeopleDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showHashtagDropdown, setShowHashtagDropdown] = useState(false);
  const [hashtagSearch, setHashtagSearch] = useState('');
  const [hashtagPosition, setHashtagPosition] = useState(0);

  const mockHashtags = [
    { id: '1', name: 'JavaScript', posts: '2.5M' },
    { id: '2', name: 'React', posts: '1.8M' },
    { id: '3', name: 'NextJS', posts: '850K' },
    { id: '4', name: 'TypeScript', posts: '1.2M' },
    { id: '5', name: 'WebDev', posts: '3.1M' },
    { id: '6', name: 'Programming', posts: '4.2M' },
    { id: '7', name: 'Coding', posts: '2.9M' },
    { id: '8', name: 'DevTips', posts: '650K' },
    { id: '9', name: 'Frontend', posts: '890K' },
    { id: '10', name: 'Backend', posts: '720K' },
    { id: '11', name: 'FullStack', posts: '940K' },
    { id: '12', name: 'Python', posts: '2.1M' },
    { id: '13', name: 'NodeJS', posts: '1.1M' },
    { id: '14', name: 'CSS', posts: '1.5M' },
    { id: '15', name: 'HTML', posts: '1.3M' },
  ];

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCaption(value);

    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastHashIndex = textBeforeCursor.lastIndexOf('#');

    if (lastHashIndex !== -1) {
      const textAfterHash = textBeforeCursor.slice(lastHashIndex + 1);
      if (!textAfterHash.includes(' ')) {
        setShowHashtagDropdown(true);
        setHashtagSearch(textAfterHash.toLowerCase());
        setHashtagPosition(lastHashIndex);
      } else {
        setShowHashtagDropdown(false);
      }
    } else {
      setShowHashtagDropdown(false);
    }
  };

  const handleHashtagSelect = (hashtag: string) => {
    const beforeHashtag = caption.slice(0, hashtagPosition);
    const afterHashtag = caption.slice(hashtagPosition).replace(/#\w*/, `#${hashtag} `);
    setCaption(beforeHashtag + afterHashtag);
    setShowHashtagDropdown(false);
  };

  const filteredHashtags = mockHashtags.filter(hashtag =>
    hashtag.name.toLowerCase().includes(hashtagSearch)
  );

  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter((h) => h !== hashtag));
    } else {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
  };

  const toggleSharePlatform = (platform: string) => {
    if (shareOn.includes(platform)) {
      setShareOn(shareOn.filter(p => p !== platform));
    } else {
      setShareOn([...shareOn, platform]);
    }
  };

  const performSharing = (postUrl: string) => {
    const shareText = caption || 'Check out this post!';

    shareOn.forEach(platform => {
      if (platform === 'Facebook') {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(fbUrl, '_blank', 'width=600,height=400');
      } else if (platform === 'WhatsApp') {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`;
        window.open(waUrl, '_blank');
      } else if (platform === 'Messenger') {
        const messengerUrl = `fb-messenger://share?link=${encodeURIComponent(postUrl)}`;
        window.open(messengerUrl, '_blank');
      }
    });
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);

      // Get current user or use mock user ID
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'mock-user-id';

      // Convert blob URL to file
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const fileExtension = mediaType === 'image' ? 'jpg' : 'mp4';
      const fileName = `${userId}/${Date.now()}.${fileExtension}`;

      // Upload media to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts-media')
        .upload(fileName, blob, {
          contentType: mediaType === 'image' ? 'image/jpeg' : 'video/mp4',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload media');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posts-media')
        .getPublicUrl(fileName);

      // Save post to database
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          media_type: mediaType,
          media_url: publicUrl,
          caption: caption || null,
          hashtags: selectedHashtags,
          location: location || null,
          tagged_users: taggedPeople.map(p => p.id || p),
          filter: filter || null,
          video_start: videoStart || null,
          video_end: videoEnd || null,
          allow_comments: allowComments,
          allow_high_quality: allowHighQuality,
          visibility: visibility === 'Everyone can view this post' ? 'public' : 'private'
        })
        .select()
        .single();

      if (postError) {
        console.error('Post error:', postError);
        toast.error('Failed to save post');
        return;
      }

      const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/post/${post.id}` : '';

      if (shareOn.length > 0) {
        performSharing(postUrl);
        toast.success('Post published and shared successfully!');
      } else {
        toast.success('Post published successfully!');
      }

      // Navigate to profile or action page based on media type
      if (typeof window !== 'undefined') {
        if (mediaType === 'image') {
          window.location.href = '/myprofile';
        } else {
          window.location.href = '/action';
        }
      }

      onOpenChange(false);

      // Reset form
      setCaption('');
      setSelectedHashtags([]);
      setAllowComments(true);
      setAllowHighQuality(false);
      setVisibility('Everyone can view this post');
      setLocation('');
      setTaggedPeople([]);
      setShareOn([]);
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh]">
        <div className="bg-white flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h2 className="text-xl font-bold">New Post</h2>
            <div className="w-20"></div>
          </div>

          <div className="flex overflow-hidden flex-1">
            <div className="flex-1 bg-black flex items-center justify-center">
              {mediaType === 'image' ? (
                <img
                  src={mediaUrl}
                  alt="Post"
                  style={{ filter }}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={mediaUrl}
                  controls
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            <div className="w-96 border-l flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="relative">
                  {showHashtagDropdown && filteredHashtags.length > 0 && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-64 overflow-y-auto z-50">
                      <div className="p-2 border-b bg-gray-50">
                        <input
                          type="text"
                          placeholder="Search hashtags..."
                          value={hashtagSearch}
                          onChange={(e) => setHashtagSearch(e.target.value.toLowerCase())}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 transition-colors"
                          autoFocus
                        />
                      </div>
                      <div className="py-2">
                        {filteredHashtags.map((hashtag) => (
                          <button
                            key={hashtag.id}
                            onClick={() => handleHashtagSelect(hashtag.name)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">#</span>
                              </div>
                              <div className="text-left">
                                <div className="font-semibold text-sm">#{hashtag.name}</div>
                                <span className="text-xs text-gray-500">{hashtag.posts} posts</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <Textarea
                    placeholder="Share your thoughts within 4000 characters"
                    value={caption}
                    onChange={handleCaptionChange}
                    maxLength={4000}
                    className="min-h-[120px] resize-none border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setShowHashtagDropdown(false);
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {caption.length}/4000
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    {defaultHashtags.map((hashtag, index) => (
                      <button
                        key={index}
                        onClick={() => toggleHashtag(hashtag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedHashtags.includes(hashtag)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {hashtag}
                      </button>
                    ))}
                  </div>
                </div>

                {(location || taggedPeople.length > 0 || shareOn.length > 0) && (
                  <div className="space-y-2">
                    {location && (
                      <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                        <MapPin className="w-4 h-4 text-red-400" />
                        <span className="flex-1">{location}</span>
                        <button
                          type="button"
                          onClick={() => setLocation('')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {taggedPeople.length > 0 && (
                      <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                        <Tag className="w-4 h-4 text-yellow-400" />
                        <span className="flex-1">
                          Tagged {taggedPeople.length} {taggedPeople.length === 1 ? 'person' : 'people'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTaggedPeople([])}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {shareOn.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {shareOn.map((platform, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs bg-gray-50 px-3 py-1.5 rounded-full">
                            <span>Share on {platform}</span>
                            <button
                              type="button"
                              onClick={() => setShareOn(shareOn.filter(p => p !== platform))}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-sm mb-3">Sharing Options</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSharePlatform('Facebook')}
                      className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                        shareOn.includes('Facebook')
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSharePlatform('WhatsApp')}
                      className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                        shareOn.includes('WhatsApp')
                          ? 'border-green-600 bg-green-50 ring-2 ring-green-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSharePlatform('Messenger')}
                      className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                        shareOn.includes('Messenger')
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium">Messenger</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSharePlatform('Direct Message')}
                      className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                        shareOn.includes('Direct Message')
                          ? 'border-gray-700 bg-gray-100 ring-2 ring-gray-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5 text-gray-700" />
                      <span className="text-sm font-medium">Direct Message</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-3">Post Settings</h3>
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setShowVisibilityDialog(true)}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <p className="text-sm font-medium">Visibility</p>
                          <p className="text-xs text-gray-500">{visibility}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowTagPeopleDialog(true)}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-600" />
                        <p className="text-sm font-medium">Tag People</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowLocationDialog(true)}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <p className="text-sm font-medium">Location</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                        <p className="text-sm font-medium">Allow Comments</p>
                      </div>
                      <Switch checked={allowComments} onCheckedChange={setAllowComments} />
                    </div>

                    {mediaType === 'video' && (
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Video className="w-5 h-5 text-gray-600" />
                          <p className="text-sm font-medium">Allow High Quality Video</p>
                        </div>
                        <Switch checked={allowHighQuality} onCheckedChange={setAllowHighQuality} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t flex-shrink-0">
                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-base font-semibold"
                >
                  {publishing ? 'Publishing...' : 'Publish'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

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
    </Dialog>
  );
}
