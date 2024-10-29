import React, { forwardRef } from 'react';
import { TextInput, View, Text, ReturnKeyTypeOptions } from 'react-native';

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
  onSubmitEditing?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
}

const Input = forwardRef<TextInput, TextInputProps>((props, ref) => {
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
    onSubmitEditing,
    returnKeyType,
  } = props;

  return (
    <View className="w-full mb-2">
      {title && <Text className="text-sm mb-2 font-bold">{title}</Text>}
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor="#a09b9b"
        className={`border py-[3%] rounded-md px-[5%] ${
          error ? 'border-red-500' : 'border-gray-200'
        }`}
        onSubmitEditing={onSubmitEditing}
        onChangeText={onChangeText}
        value={value}
        maxLength={maxLength}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        editable={!readOnly}
        keyboardType={inputMode === 'numeric' ? 'numeric' : 'default'}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
});

export default Input;
