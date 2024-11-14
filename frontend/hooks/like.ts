import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../auth/authStore';
import { useLikeDivelog } from './user';
import { useDiveLog } from './divelog';

const useLike = (divelogId: string) => {
  const { mongoDBId } = useAuthStore();
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
    if (!mongoDBId) {
      console.error('ID is null');
      return null;
    }

    setIsLiking((prevIsLiking) => !prevIsLiking);

    try {
      await likeMutation.mutateAsync({
        id: mongoDBId,
        divelogId: divelogId,
      });
    } catch (error) {
      console.error('Error toggling like status:', error);
      setIsLiking((prevIsLiking) => !prevIsLiking);
    }
  }, [likeMutation, divelogId, mongoDBId]);

  return {
    isLiking,
    handleLikeToggle,
  };
};

export default useLike;
