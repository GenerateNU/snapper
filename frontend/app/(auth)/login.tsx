import React from 'react';
import {
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  View,
  Image,
} from 'react-native';
import LoginForm from './components/login-form';
import Button from '../../components/button';

const Login = () => {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable
        className="flex-1 flex-col bg-white justify-start items-center p-[8%]"
        onPress={() => Keyboard.dismiss()}
      >
        <View className="w-full mb-[30%] py-[5%] flex-start pt-[10%]">
          <Text className="text-2xl font-bold">Welcome Back!</Text>
        </View>
        <LoginForm />
        <View className="w-full pt-[15%] justify-center items-center">
          <Button textOnly color="ocean" text="Forgot password?" />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default Login;
