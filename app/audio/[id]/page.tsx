'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, Heart, Bookmark, Music2 } from 'lucide-react';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';

const audioData = {
  'summer-vibes-001': {
    id: 'summer-vibes-001',
    name: 'Summer Vibes',
    author: 'DJ Summer',
    thumbnail: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videosCount: 2453,
    videos: [
      {
        id: 1,
        thumbnail: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'beach_lover',
        likes: 23700,
        views: 156000,
      },
      {
        id: 3,
        thumbnail: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'creative_mind',
        likes: 31200,
        views: 198000,
      },
      {
        id: 4,
        thumbnail: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'sunset_chaser',
        likes: 18900,
        views: 142000,
      },
      {
        id: 5,
        thumbnail: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'ocean_dreams',
        likes: 42100,
        views: 289000,
      },
      {
        id: 6,
        thumbnail: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'wave_rider',
        likes: 27800,
        views: 174000,
      },
      {
        id: 7,
        thumbnail: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'beach_life',
        likes: 19500,
        views: 138000,
      },
    ],
  },
  'adventure-beats-002': {
    id: 'adventure-beats-002',
    name: 'Adventure Beats',
    author: 'Explorer Music',
    thumbnail: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    videosCount: 1876,
    videos: [
      {
        id: 2,
        thumbnail: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'explorer_life',
        likes: 45200,
        views: 312000,
      },
      {
        id: 8,
        thumbnail: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'mountain_guide',
        likes: 38900,
        views: 267000,
      },
      {
        id: 9,
        thumbnail: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'wild_explorer',
        likes: 29700,
        views: 198000,
      },
      {
        id: 10,
        thumbnail: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        username: 'adventure_seeker',
        likes: 52300,
        views: 384000,
      },
    ],
  },
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export default function AudioPage() {
  const params = useParams();
  const router = useRouter();
  const audioId = params.id as string;
  const audio = audioData[audioId as keyof typeof audioData];
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!audio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Audio not found</h2>
          <button
            onClick={() => router.back()}
            className="text-emerald-500 hover:text-emerald-600 font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex justify-center">
        <div className="flex-1 max-w-7xl mx-auto px-6 py-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    {audio.thumbnail ? (
                      <img
                        src={audio.thumbnail}
                        alt={audio.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music2 className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <button
                    onClick={handlePlayPause}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-12 h-12 text-white fill-white" />
                    ) : (
                      <Play className="w-12 h-12 text-white fill-white" />
                    )}
                  </button>
                  <audio ref={audioRef} src={audio.audioUrl} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{audio.name}</h1>
                      <button
                        onClick={() => router.push('/profile/djsummer')}
                        className="text-lg text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                      >
                        {audio.author}
                      </button>
                    </div>
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors",
                        isFavorited
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      <Bookmark className={cn("w-5 h-5", isFavorited && "fill-white")} />
                      {isFavorited ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(audio.videosCount)}</p>
                      <p className="text-sm text-gray-600">Videos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">Videos with this audio</h2>
              <p className="text-sm text-gray-600 mt-1">{formatNumber(audio.videosCount)} videos</p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {audio.videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => router.push(`/post/${video.id}`)}
                  className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-200 hover:scale-105 transition-transform"
                >
                  <img
                    src={video.thumbnail}
                    alt={`Video by ${video.username}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold text-sm mb-2">@{video.username}</p>
                      <div className="flex items-center gap-4 text-white text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{formatNumber(video.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          <span>{formatNumber(video.views)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white fill-white drop-shadow-lg" />
                  </div>
                </button>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
