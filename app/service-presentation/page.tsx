"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ServiceSidebar } from "@/components/service-sidebar";
import { toast } from "sonner";
import { Header } from "@/components/header";

export default function ServicePresentationPage() {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([
    "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1181411/pexels-photo-1181411.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=400"
  ]);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video file size must be less than 100MB");
      return;
    }

    const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload MP4, MOV or AVI format");
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    toast.success("Video uploaded successfully");
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview("");
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length >= 10) {
      toast.error("Maximum 10 photos allowed");
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} must be JPG or PNG format`);
        return;
      }

      if (photos.length < 10) {
        const url = URL.createObjectURL(file);
        setPhotos((prev) => [...prev, url]);
        toast.success("Photo added successfully");
      }
    });

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const handleAddPhoto = () => {
    if (photos.length >= 10) {
      toast.error("Maximum 10 photos allowed");
      return;
    }
    photoInputRef.current?.click();
  };

  const handleRemovePhoto = (index: number) => {
    const photoToRemove = photos[index];
    if (photoToRemove.startsWith("blob:")) {
      URL.revokeObjectURL(photoToRemove);
    }
    setPhotos(photos.filter((_, i) => i !== index));
    toast.success("Photo removed");
  };

  const handleUpdate = () => {
    console.log("Update service presentation");
    toast.success("Service presentation updated");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ServiceSidebar activePage="service-presentation" />

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="space-y-8">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold text-gray-900 mb-3 block">
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="Enter service name"
                      className="bg-white border-gray-200 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-base font-semibold text-gray-900 mb-3 block">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter service description"
                      className="bg-white border-gray-200 min-h-32 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-3 block">
                      Video
                    </Label>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    {videoPreview ? (
                      <div className="relative">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={handleRemoveVideo}
                          className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center transition-opacity"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={handleVideoClick}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <span className="text-emerald-500 hover:text-emerald-600 font-medium">
                              Click to upload
                            </span>
                            <span className="text-gray-500 text-sm"> or drag and drop</span>
                          </div>
                          <p className="text-xs text-gray-500">MP4, MOV or AVI (max. 100MB)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-3 block">
                      Photos
                    </Label>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="grid grid-cols-5 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemovePhoto(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                      {photos.length < 10 && (
                        <button
                          onClick={handleAddPhoto}
                          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Upload className="w-5 h-5 text-gray-400" />
                            </div>
                            <span className="text-xs text-gray-500 text-center px-2">Add Photo</span>
                          </div>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Upload up to 10 photos (JPG, PNG max. 5MB each)</p>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button
                    onClick={handleUpdate}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-11 text-base"
                  >
                    Update
                  </Button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
