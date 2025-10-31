import { supabase } from './supabase';

export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export async function followUser(followingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (user.id === followingId) {
      return { success: false, error: 'Cannot follow yourself' };
    }

    const { error } = await supabase
      .from('followers')
      .insert({
        follower_id: user.id,
        following_id: followingId
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error following user:', error);
    return { success: false, error: 'Failed to follow user' };
  }
}

export async function unfollowUser(followingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', followingId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { success: false, error: 'Failed to unfollow user' };
  }
}

export async function checkIsFollowing(followingId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) {
      console.error('Error checking follow status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

export async function getFollowStats(userId: string): Promise<FollowStats> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const [followersResult, followingResult, isFollowingResult] = await Promise.all([
      supabase
        .from('followers')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId),
      supabase
        .from('followers')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', userId),
      user ? supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .maybeSingle() : Promise.resolve({ data: null })
    ]);

    return {
      followersCount: followersResult.count || 0,
      followingCount: followingResult.count || 0,
      isFollowing: !!isFollowingResult.data
    };
  } catch (error) {
    console.error('Error getting follow stats:', error);
    return {
      followersCount: 0,
      followingCount: 0,
      isFollowing: false
    };
  }
}

export async function getFollowers(userId: string) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        follower_id,
        created_at,
        profiles!followers_follower_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          verified
        )
      `)
      .eq('following_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting followers:', error);
    return [];
  }
}

export async function getFollowing(userId: string) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        following_id,
        created_at,
        profiles!followers_following_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          verified
        )
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting following:', error);
    return [];
  }
}
