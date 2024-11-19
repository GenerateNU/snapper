import React from 'react';
import {
  Text,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
} from 'react-native';
import LoginForm from './components/login-form';
import Button from '../../components/button';

const Login = () => {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center px-8 bg-white">
          <View className="w-full mb-12 pt-10">
            <Text className="text-2xl font-bold">Welcome Back!</Text>
          </View>
          <LoginForm />
          <View className="w-full pt-6 items-center">
            <Button textOnly color="ocean" text="Forgot password?" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
