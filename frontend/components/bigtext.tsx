import React, { forwardRef } from 'react';
import { TextInput, View, Text } from 'react-native';

interface TextInputProps {
  title?: string;
  placeholder?: string;
  error?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  inputMode?: 'text' | 'numeric';
  onChangeText?: (value: string) => void;
  value?: string;
  maxLength?: number;
  secureTextEntry?: boolean;
}

const BigText = forwardRef<TextInput, TextInputProps>((props, ref) => {
  const {
    title,
    placeholder,
    error,
    autoFocus,
    readOnly,
    inputMode = 'text',
    onChangeText,
    value,
    maxLength,
    secureTextEntry,
  } = props;

  return (
    <View className="w-full">
      {title && <Text className="text-sm mb-1 font-bold">{title}</Text>}
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor="#a09b9b"
        className={`h-[15vh] pt-[1.5vh] border rounded-md px-[5%] bg-white ${
          error ? 'border-red-500' : 'border-gray-400'
        }`}
        onChangeText={onChangeText}
        value={value}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        editable={!readOnly}
        multiline={true}
        keyboardType={inputMode === 'numeric' ? 'numeric' : 'default'}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
});

export default BigText;
