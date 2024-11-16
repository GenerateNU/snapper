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

  if (!mongoDBId) {
    return {
      isLiking: false,
      handleLikeToggle: () => {
        console.error('User ID is required');
      },
      isPending: false,
      isReady: false,
    } as const;
  }

  const { data } = useDiveLog(divelogId);
  const likeMutation = useLikeDivelog();

  const toggleBase = useToggleBase<DiveLog, LikeMutationParams>({
    initialState: false,
    data: data,
    checkIsActive: (data) => {
      return Array.isArray(data.likes) && 
        data.likes.includes(mongoDBId);
    },
    mutation: likeMutation,
    mutationParams: {
      id: mongoDBId,
      divelogId: divelogId,
    },
  });

  return {
    ...toggleBase,
    isLiking: toggleBase.isActive,
    handleLikeToggle: toggleBase.handleToggle,
    isReady: true,
  };
};

export default useLike;