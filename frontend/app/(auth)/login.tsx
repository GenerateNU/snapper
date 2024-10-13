import React from 'react';
import {
  Text,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  View,
  Image,
  useWindowDimensions,
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
        <View className="flex justify-start items-center">
          <View className="bg-water p-[15%] rounded-full overflow-hidden items-center justify-center">
            <Image
              className="w-32 h-32 object-cover"
              source={require('../../assets/🐠.png')}
            />
          </View>
        </View>
        <View className="w-full py-[5%] flex-start pt-[10%]">
          <Text className="text-4xl font-bold">Login</Text>
          <Text>Dive in</Text>
        </View>
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
