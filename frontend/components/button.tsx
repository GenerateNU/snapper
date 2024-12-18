import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  text?: string;
  onPress?: () => void;
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
  textOnly?: boolean;
  outline?: boolean;
  small?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  backgroundColor,
  color,
  disabled = false,
  textOnly = false,
  outline = false,
  small = false,
}) => {
  const isOutlined = outline || disabled;

  return (
    <>
      {!textOnly && (
        <TouchableOpacity
          className={`items-center h-10 justify-center ${small ? 'w-[30%]' : 'w-full'} py-[2%] rounded-lg
            ${isOutlined ? 'bg-transparent border' : backgroundColor ? `bg-${backgroundColor}` : 'bg-ocean'}
            ${isOutlined ? `border border-${backgroundColor || 'ocean'}` : ''}`}
          disabled={disabled}
          onPress={onPress}
        >
          <Text
            className={`${disabled ? 'text-ocean' : color ? `text-${color}` : 'text-white'}`}
          >
            {text}
          </Text>
        </TouchableOpacity>
      )}
      {textOnly && (
        <TouchableOpacity disabled={disabled} onPress={onPress}>
          <Text
            className={`underline ${disabled ? 'text-gray-400' : color ? `text-${color}` : 'text-black'}`}
            style={{ opacity: disabled ? 0.5 : 1 }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default Button;
