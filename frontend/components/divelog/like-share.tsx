import {
  View,
  Text,
  Share,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import IconButton from '../icon-button';
import useLike from '../../hooks/like';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import Modal from 'react-native-modal';

interface LikeAndShareProps {
  diveLogId: string;
}

const LikeAndShare: React.FC<LikeAndShareProps> = ({ diveLogId }) => {
  const { isLiking, handleLikeToggle } = useLike(diveLogId);

  const handleShare = async () => {
    try {
      await Share.share({
        message: "",
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = () => {
    Clipboard.setStringAsync("");
    Alert.alert('Link Copied', 'The link has been copied to your clipboard.');
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : require('react-native-extra-dimensions-android').get(
          'REAL_WINDOW_HEIGHT',
        );

  return (
    <View style={{ gap: 10 }} className="flex-row">
      <Modal
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        coverScreen={false}
        isVisible={isModalVisible}
      >
        <View>
          <Text>Popup menu test</Text>
        </View>
      </Modal>
      <IconButton
        onPress={handleLikeToggle}
        size={25}
        icon={isLiking ? faHeart : faHeartOutline}
      />
      <IconButton onPress={toggleModal} size={25} icon={faPaperPlane} />
    </View>
  );
};

export default LikeAndShare;
