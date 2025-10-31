'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    username: string;
    avatar: string;
    bio: string;
  };
}

export function EditProfileDialog({ isOpen, onClose, profile }: EditProfileDialogProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [gender, setGender] = useState('');
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleSave = () => {
    onClose();
  };

  const handleImportPhoto = () => {
    fileInputRef.current?.click();
    setShowPhotoOptions(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      setShowCamera(true);
      setShowPhotoOptions(false);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setProfilePhoto(photoData);
      }
    }
    closeCamera();
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        closeCamera();
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {showCamera ? (
            <div className="mb-8">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button
                    onClick={capturePhoto}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Capture
                  </Button>
                  <Button
                    onClick={closeCamera}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button
                  onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                className="text-blue-500 font-semibold text-lg mb-1 hover:text-blue-600"
              >
                Change profile photo
              </button>

              {showPhotoOptions && (
                <div className="mt-2 bg-white border rounded-lg shadow-lg p-2 w-64">
                  <button
                    onClick={handleTakePhoto}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Take a photo</span>
                  </button>
                  <button
                    onClick={handleImportPhoto}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Import a photo</span>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-base font-semibold text-gray-900 mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div>
              <Label htmlFor="username" className="text-base font-semibold text-gray-900 mb-2 block">
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
                className="h-12 text-base"
              />
              <p className="text-gray-400 text-sm mt-2">30 characters max</p>
            </div>

            <div>
              <Label htmlFor="bio" className="text-base font-semibold text-gray-900 mb-2 block">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Enter your bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[120px] text-base resize-none"
              />
            </div>

            <div>
              <Label htmlFor="gender" className="text-base font-semibold text-gray-900 mb-2 block">
                Gender
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Switch to Business Account
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get access to professional tools, analytics, and promotional features
                  </p>
                </div>
                <Switch
                  checked={isBusinessAccount}
                  onCheckedChange={setIsBusinessAccount}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-8 h-12 text-base font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="px-8 h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
