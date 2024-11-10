import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../auth/authStore';
import { useLikeDivelog } from './user';
import { useDiveLog } from './divelog';

const useLike = (divelogId: string) => {
  const { supabaseId, mongoDBId } = useAuthStore();
  const { data } = useDiveLog(divelogId);

  const likeMutation = useLikeDivelog();
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (data && Array.isArray(data.likes)) {
      const isUserLiking = data.likes.includes(mongoDBId);
      setIsLiking(isUserLiking);
    }
  }, [data, mongoDBId]);

  const handleLikeToggle = useCallback(async () => {
    if (!supabaseId) {
      console.error('supabaseId is null');
      return null;
    }

    setIsLiking((prevIsLiking) => !prevIsLiking);

    try {
      await likeMutation.mutateAsync({
        id: supabaseId,
        divelogId: divelogId,
      });
    } catch (error) {
      console.error('Error toggling like status:', error);
      setIsLiking((prevIsLiking) => !prevIsLiking);
    }
  }, [likeMutation, divelogId, supabaseId]);

  return {
    isLiking,
    handleLikeToggle,
  };
};

export default useLike;
