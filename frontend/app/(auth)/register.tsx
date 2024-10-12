import React from 'react';
import {
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import SignUpForm from './components/register-form';

const Register = () => {
  return (
    <KeyboardAvoidingView
      className="flex-1 h-full bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={200}
    >
      <Pressable
        className="flex-1 justify-start items-center gap-y-5"
        onPress={() => Keyboard.dismiss()}
      >
        <View className="h-[30%] w-full bg-[#d0e2ee] justify-center items-center" />
        <View className="w-full px-7">
          <View className="w-full items-center pb-5">
            <Text className="text-xl font-bold">Create your account</Text>
            <Text className="text-xs">
              Dive in - Start Your Ocean Adventure
            </Text>
          </View>
          <SignUpForm />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default Register;
