'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceMessageProps {
  audioUrl: string;
  duration: number;
  isUser: boolean;
  time: string;
}

export function VoiceMessage({ audioUrl, duration, isUser, time }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl px-4 py-3 min-w-[240px] max-w-md',
          isUser ? 'bg-gray-100' : 'bg-white border'
        )}
      >
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

        <button
          onClick={togglePlay}
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            isUser
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-emerald-500 hover:bg-emerald-600'
          )}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-white" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden mb-1.5">
            <div
              className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-1">{time}</span>
    </div>
  );
}
