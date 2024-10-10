import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  text?: string;
  onPress?: () => void;
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
  textOnly?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  backgroundColor,
  color,
  disabled = false,
  textOnly = false,
}) => {
  return (
    <>
      {!textOnly && (
        <TouchableOpacity
          className={`items-center justify-center w-full h-14 rounded-full ${disabled ? 'bg-gray-400' : 'bg-ocean'}`}
          style={{
            backgroundColor: backgroundColor || '#4899cf',
          }}
          disabled={disabled}
          onPress={onPress}
        >
          <Text
            className={`font-bold ${disabled ? 'text-gray-300' : ''}`}
            style={{ color: color || 'white' }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      )}
      {textOnly && (
        <TouchableOpacity disabled={disabled} onPress={onPress}>
          <Text
            className={`${disabled ? 'text-gray-400' : ''}`}
            style={{ color: color || 'black' }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default Button;
