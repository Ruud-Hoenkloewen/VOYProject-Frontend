import { useState, useEffect } from 'react';
import { followArtist as apiFollow, unfollowArtist as apiUnfollow } from '../services/artistService';

export function useFollowArtist(artistId, initialFollowing = false, initialCount = 0) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [followersCount, setFollowersCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  useEffect(() => {
    setFollowersCount(initialCount);
  }, [initialCount]);

  const toggleFollow = async () => {
    if (loading || !artistId) return;

    // Optimistic UI update
    const previousFollowing = isFollowing;
    const previousCount = followersCount;

    const nextFollowing = !previousFollowing;
    const nextCount = nextFollowing
      ? previousCount + 1
      : Math.max(0, previousCount - 1);

    setIsFollowing(nextFollowing);
    setFollowersCount(nextCount);
    setLoading(true);

    try {
      if (previousFollowing) {
        await apiUnfollow(artistId);
      } else {
        await apiFollow(artistId);
      }
    } catch (err) {
      console.error('[useFollowArtist] Error al alternar follow, revirtiendo estado:', err);
      setIsFollowing(previousFollowing);
      setFollowersCount(previousCount);
    } finally {
      setLoading(false);
    }
  };

  return {
    isFollowing,
    followersCount,
    toggleFollow,
    loading,
  };
}
