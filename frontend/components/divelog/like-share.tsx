import { View } from 'react-native';
import IconButton from '../icon-button';
import useLike from '../../hooks/like';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

interface LikeAndShareProps {
  diveLogId: string;
}

const LikeAndShare: React.FC<LikeAndShareProps> = ({ diveLogId }) => {
  const { isLiking, handleLikeToggle } = useLike(diveLogId);

  return (
    <View style={{ gap: 10 }} className="flex-row">
      <IconButton
        onPress={handleLikeToggle}
        size={25}
        icon={isLiking ? faHeart : faHeartOutline}
      />
      <IconButton size={25} icon={faPaperPlane} />
    </View>
  );
};

export default LikeAndShare;
