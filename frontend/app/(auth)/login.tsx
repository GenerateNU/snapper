import React from 'react';
import {
  Text,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  View,
} from 'react-native';
import LoginForm from './components/login-form';
import Button from '../../components/button';
import { router } from 'expo-router';

const Login = () => {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable
        className="flex-1 flex-col bg-white justify-center items-center p-[8%]"
        onPress={() => Keyboard.dismiss()}
      >
        <Text className="text-lg font-bold">Login</Text>
        <Text>Dive in</Text>
        <LoginForm />
        <View className="w-full justify-center items-center">
          <View className="w-full flex-start pt-[3%]">
            <Button textOnly text="Forgot password?" />
          </View>
          {/* <Button
            onPress={() => router.push('/(auth)/register')}
            textOnly
            text="Don't have account? Sign up."
          /> */}
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default Login;
