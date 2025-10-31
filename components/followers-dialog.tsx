'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OptimizedImage } from '@/components/optimized-image';
import { followUser, unfollowUser, getFollowers, getFollowing } from '@/lib/follow-service';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  verified: boolean;
  following?: boolean;
}

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'followers' | 'following';
  username: string;
  userId: string;
}

export function FollowersDialog({
  open,
  onOpenChange,
  type,
  username,
  userId,
}: FollowersDialogProps) {
  const router = useRouter();
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingFollow, setProcessingFollow] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      const [followersData, followingData] = await Promise.all([
        getFollowers(userId),
        getFollowing(userId)
      ]);

      const transformFollowers = followersData.map((item: any) => {
        const profile = item.profiles;
        return {
          id: profile.id,
          username: profile.username || 'user',
          name: profile.full_name || profile.username || 'User',
          avatar: profile.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
          verified: profile.verified || false,
          following: false
        };
      });

      const transformFollowing = followingData.map((item: any) => {
        const profile = item.profiles;
        return {
          id: profile.id,
          username: profile.username || 'user',
          name: profile.full_name || profile.username || 'User',
          avatar: profile.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
          verified: profile.verified || false,
          following: true
        };
      });

      if (currentUser) {
        const { data: currentUserFollowing } = await supabase
          .from('followers')
          .select('following_id')
          .eq('follower_id', currentUser.id);

        const followingIds = new Set(currentUserFollowing?.map(f => f.following_id) || []);

        transformFollowers.forEach(user => {
          user.following = followingIds.has(user.id);
        });
      }

      setFollowers(transformFollowers);
      setFollowing(transformFollowing);

      // Load suggestions - get users not being followed by the current user
      if (currentUser) {
        const { data: currentUserFollowing } = await supabase
          .from('followers')
          .select('following_id')
          .eq('follower_id', currentUser.id);

        const followingIds = new Set(currentUserFollowing?.map(f => f.following_id) || []);
        followingIds.add(currentUser.id); // Don't suggest current user

        const { data: suggestedProfiles } = await supabase
          .from('profiles')
          .select('*')
          .not('id', 'in', `(${Array.from(followingIds).join(',') || 'null'})`)
          .limit(20);

        const transformSuggestions = (suggestedProfiles || []).map((profile: any) => ({
          id: profile.id,
          username: profile.username || 'user',
          name: profile.full_name || profile.username || 'User',
          avatar: profile.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
          verified: profile.verified || false,
          following: false
        }));

        setSuggestions(transformSuggestions);
      }
    } catch (error) {
      console.error('Error loading followers/following:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId: string, isCurrentlyFollowing: boolean, event: React.MouseEvent) => {
    event.stopPropagation();

    setProcessingFollow(targetUserId);

    try {
      if (isCurrentlyFollowing) {
        const result = await unfollowUser(targetUserId);
        if (result.success) {
          setFollowers(followers.map(user =>
            user.id === targetUserId ? { ...user, following: false } : user
          ));
          setFollowing(following.filter(user => user.id !== targetUserId));
          setSuggestions(suggestions.map(user =>
            user.id === targetUserId ? { ...user, following: false } : user
          ));
        }
      } else {
        const result = await followUser(targetUserId);
        if (result.success) {
          setFollowers(followers.map(user =>
            user.id === targetUserId ? { ...user, following: true } : user
          ));
          setSuggestions(suggestions.map(user =>
            user.id === targetUserId ? { ...user, following: true } : user
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setProcessingFollow(null);
    }
  };

  const handleUserClick = (userUsername: string) => {
    router.push(`/profile/${userUsername}`);
    onOpenChange(false);
  };

  const renderUserList = (users: User[]) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[500px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="flex items-center justify-center h-[500px] text-gray-500">
          No users found
        </div>
      );
    }

    return (
      <ScrollArea className="h-[500px]">
        <div className="space-y-3 p-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => handleUserClick(user.username)}
              >
                <OptimizedImage
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                  width={48}
                  height={48}
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">{user.name}</span>
                    {user.verified && (
                      <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">@{user.username}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant={user.following ? "outline" : "default"}
                className={user.following ? "text-gray-700" : "bg-emerald-500 hover:bg-emerald-600 text-white"}
                onClick={(e) => handleFollowToggle(user.id, user.following || false, e)}
                disabled={processingFollow === user.id}
              >
                {processingFollow === user.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : user.following ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-1" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">@{username}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Tabs defaultValue={type} className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
            <TabsTrigger
              value="followers"
              className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-4 py-3 flex-1"
            >
              <span className="font-semibold">Followers</span>
              <span className="ml-2 text-gray-500">{followers.length.toLocaleString()}</span>
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-4 py-3 flex-1"
            >
              <span className="font-semibold">Following</span>
              <span className="ml-2 text-gray-500">{following.length.toLocaleString()}</span>
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-4 py-3 flex-1"
            >
              <span className="font-semibold">Suggestions</span>
              <span className="ml-2 text-gray-500">{suggestions.length.toLocaleString()}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="mt-0">
            {renderUserList(followers)}
          </TabsContent>

          <TabsContent value="following" className="mt-0">
            {renderUserList(following)}
          </TabsContent>

          <TabsContent value="suggestions" className="mt-0">
            {renderUserList(suggestions)}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
