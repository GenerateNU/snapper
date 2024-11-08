import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface ButtonProps {
  text?: string;
  onPress?: () => void;
  backgroundColor?: string;
  color?: string;
  outline?: string;
}

const PageButton: React.FC<ButtonProps> = ({
  text,
  onPress,
  backgroundColor,
  color,
  outline,
}) => {
  return (
    <TouchableOpacity
      className={`items-center w-full py-[3%] border border-2 rounded-md h-[5vh] flex-row
            ${backgroundColor ? `bg-${backgroundColor}` : 'bg-ocean'}
            ${outline ? `border-${outline}` : 'border-ocean'}`}
      onPress={onPress}
    >
      <Text
        className={`${color ? `text-${color}` : 'text-black'} absolute left-5 text-[16px]`}
      >
        {text}
      </Text>
      <View className="h-[2vh] absolute right-5 items-center justify-center">
        <FontAwesomeIcon icon={faChevronRight} size={15} color="black" />
      </View>
    </TouchableOpacity>
  );
};

export default PageButton;
