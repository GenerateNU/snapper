import { useAuthStore } from '../auth/authStore';
import { useLikeDivelog } from './user';
import { useDiveLog } from './divelog';
import { useToggleBase } from './base';

interface DiveLog {
  likes: string[];
}

interface LikeMutationParams {
  id: string;
  divelogId: string;
}

const useLike = (divelogId: string) => {
  const { mongoDBId } = useAuthStore();
  const { data } = useDiveLog(divelogId);
  const likeMutation = useLikeDivelog();

  const toggleBase = useToggleBase<DiveLog, LikeMutationParams>({
    initialState: false,
    data: data,
    checkIsActive: (data) => {
      return mongoDBId
        ? Array.isArray(data.likes) && data.likes.includes(mongoDBId)
        : false;
    },
    mutation: likeMutation,
    mutationParams: {
      id: mongoDBId || '',
      divelogId: divelogId,
    },
  });

  return {
    ...toggleBase,
    isLiking: toggleBase.isActive,
    handleLikeToggle: mongoDBId
      ? toggleBase.handleToggle
      : () => {
          console.error('User ID is required');
        },
    isPending: toggleBase.isPending,
  };
};

export default useLike;
