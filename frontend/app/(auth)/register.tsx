import React from 'react';
import {
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  Image,
} from 'react-native';
import SignUpForm from './components/register-form';

const Register = () => {
  return (
    <KeyboardAvoidingView
      className="flex-1 h-full bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
    >
      <Pressable
        className="flex-1 justify-start items-center gap-y-5"
        onPress={() => Keyboard.dismiss()}
      >
        <View className="w-full px-7">
          <Text className="mb-[20%] mt-[5%] text-xl font-bold">
            Create an account
          </Text>
          <SignUpForm />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default Register;
