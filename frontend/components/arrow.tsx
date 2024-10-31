import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

interface ArrowProps {
  direction: 'left' | 'right';
  onPress: () => void;
  backgroundColor?: string;
}

const Arrow: React.FC<ArrowProps> = ({
  direction,
  onPress,
  backgroundColor = 'bg-transparent',
}) => {
  const icon = direction === 'left' ? faChevronLeft : faChevronRight;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`rounded-full ${backgroundColor ? backgroundColor : ''} flex items-center justify-center`}
      >
        <FontAwesomeIcon icon={icon} size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
};

export default Arrow;
