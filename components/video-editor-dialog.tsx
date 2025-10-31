'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoFile: File | null;
  onNext: (videoUrl: string, startTime: number, endTime: number) => void;
  onBack: () => void;
}

export function VideoEditorDialog({ open, onOpenChange, videoFile, onNext, onBack }: VideoEditorDialogProps) {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setEndTime(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= endTime) {
        video.pause();
        setIsPlaying(false);
        video.currentTime = startTime;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [endTime, startTime]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      if (video.currentTime >= endTime) {
        video.currentTime = startTime;
      }
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(startTime, video.currentTime - 5);
  };

  const handleSkipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(endTime, video.currentTime + 5);
  };

  const handleSpeedChange = (direction: 'prev' | 'next') => {
    const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    let newIndex = direction === 'next'
      ? Math.min(currentIndex + 1, speeds.length - 1)
      : Math.max(currentIndex - 1, 0);

    const newSpeed = speeds[newIndex];
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimelineMouseDown = (e: React.MouseEvent, type: 'start' | 'end') => {
    e.preventDefault();
    e.stopPropagation();

    const handleDrag = (moveEvent: MouseEvent) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const newTime = percentage * duration;

      if (type === 'start') {
        setStartTime((prevStart) => {
          const clampedTime = Math.max(0, Math.min(newTime, endTime - 0.5));
          if (videoRef.current) {
            videoRef.current.currentTime = clampedTime;
          }
          return clampedTime;
        });
      } else {
        setEndTime((prevEnd) => {
          const clampedTime = Math.max(startTime + 0.5, Math.min(newTime, duration));
          return clampedTime;
        });
      }
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleUp);
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
    };

    if (type === 'start') {
      setIsDraggingStart(true);
    } else {
      setIsDraggingEnd(true);
    }

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleUp);
  };

  const handleSubmit = () => {
    onNext(videoUrl, startTime, endTime);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-white flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h2 className="text-xl font-bold">Video Editing</h2>
            <div className="w-20"></div>
          </div>

          <div className="flex items-center justify-between px-8 py-4 border-b flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium">Editor</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-400">Details</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="relative bg-black rounded-lg overflow-hidden mb-6">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full max-h-[400px] object-contain"
                onClick={togglePlayPause}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <button
                    onClick={handleSkipBack}
                    className="text-white hover:text-emerald-400 transition-colors"
                  >
                    <SkipBack className="w-8 h-8" fill="currentColor" />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="text-white hover:text-emerald-400 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-12 h-12" fill="currentColor" />
                    ) : (
                      <Play className="w-12 h-12" fill="currentColor" />
                    )}
                  </button>
                  <button
                    onClick={handleSkipForward}
                    className="text-white hover:text-emerald-400 transition-colors"
                  >
                    <SkipForward className="w-8 h-8" fill="currentColor" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-white">
                  <Volume2 className="w-5 h-5" />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeedChange('prev')}
                      className="hover:text-emerald-400"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold min-w-[60px] text-center">
                      {playbackSpeed.toFixed(2)}X
                    </span>
                    <button
                      onClick={() => handleSpeedChange('next')}
                      className="hover:text-emerald-400"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-gray-900">
                  <span>0:00</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div
                  ref={timelineRef}
                  className="relative h-20 bg-gray-900 rounded-lg overflow-visible select-none"
                >
                  <div className="absolute inset-0">
                    <div className="relative w-full h-full bg-gray-900 rounded-lg">
                      {/* Video thumbnail preview grid */}
                      <div className="absolute inset-0 grid grid-cols-12 gap-0.5 p-1">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-sm border border-gray-600"
                          ></div>
                        ))}
                      </div>

                      {/* Unselected overlay - left side */}
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-black/60 pointer-events-none rounded-l-lg"
                        style={{
                          width: `${(startTime / duration) * 100}%`,
                        }}
                      ></div>

                      {/* Unselected overlay - right side */}
                      <div
                        className="absolute top-0 bottom-0 right-0 bg-black/60 pointer-events-none rounded-r-lg"
                        style={{
                          width: `${100 - (endTime / duration) * 100}%`,
                        }}
                      ></div>

                      {/* Selected area border */}
                      <div
                        className="absolute top-0 bottom-0 border-t-2 border-b-2 border-emerald-400 pointer-events-none"
                        style={{
                          left: `${(startTime / duration) * 100}%`,
                          right: `${100 - (endTime / duration) * 100}%`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-emerald-500 px-3 py-1 rounded-full text-xs text-white font-bold shadow-lg">
                            {formatTime(endTime - startTime)}
                          </div>
                        </div>
                      </div>

                      {/* Start handle */}
                      <div
                        className={`absolute top-0 bottom-0 w-3 bg-emerald-400 cursor-ew-resize z-30 transition-all ${isDraggingStart ? 'w-4 bg-emerald-300' : 'hover:w-4'}`}
                        onMouseDown={(e) => handleTimelineMouseDown(e, 'start')}
                        style={{ left: `calc(${(startTime / duration) * 100}% - 6px)` }}
                      >
                        <div className={`absolute top-1/2 -translate-y-1/2 -left-3 w-9 h-14 bg-emerald-400 rounded-lg flex items-center justify-center shadow-2xl border-2 border-white transition-all ${isDraggingStart ? 'scale-110 bg-emerald-300' : 'hover:scale-105'}`}>
                          <ChevronLeft className="w-6 h-6 text-white" strokeWidth={3} />
                        </div>
                        <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-gray-900 px-3 py-1.5 rounded-md text-xs text-white font-bold whitespace-nowrap shadow-xl border-2 border-emerald-400">
                          {formatTime(startTime)}
                        </div>
                      </div>

                      {/* End handle */}
                      <div
                        className={`absolute top-0 bottom-0 w-3 bg-emerald-400 cursor-ew-resize z-30 transition-all ${isDraggingEnd ? 'w-4 bg-emerald-300' : 'hover:w-4'}`}
                        onMouseDown={(e) => handleTimelineMouseDown(e, 'end')}
                        style={{ left: `calc(${(endTime / duration) * 100}% - 6px)` }}
                      >
                        <div className={`absolute top-1/2 -translate-y-1/2 -right-3 w-9 h-14 bg-emerald-400 rounded-lg flex items-center justify-center shadow-2xl border-2 border-white transition-all ${isDraggingEnd ? 'scale-110 bg-emerald-300' : 'hover:scale-105'}`}>
                          <ChevronRight className="w-6 h-6 text-white" strokeWidth={3} />
                        </div>
                        <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-gray-900 px-3 py-1.5 rounded-md text-xs text-white font-bold whitespace-nowrap shadow-xl border-2 border-emerald-400">
                          {formatTime(endTime)}
                        </div>
                      </div>

                      {/* Current time indicator */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white z-40 pointer-events-none"
                        style={{
                          left: `${(currentTime / duration) * 100}%`,
                        }}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 font-medium mb-1">Start</p>
                    <p className="text-gray-900 font-bold text-lg">{formatTime(startTime)}</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-gray-500 font-medium mb-1">Duration</p>
                    <p className="text-emerald-600 font-bold text-lg">{formatTime(endTime - startTime)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 font-medium mb-1">End</p>
                    <p className="text-gray-900 font-bold text-lg">{formatTime(endTime)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  Drag the green handles to select your video sequence
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex-shrink-0 bg-white">
            <Button
              onClick={handleSubmit}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-base font-semibold"
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
