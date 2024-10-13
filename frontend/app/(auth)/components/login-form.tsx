import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../../components/button';
import { z, ZodError } from 'zod';
import { router } from 'expo-router';
import { useLogin } from '../../../hooks/auth';

type LoginFormData = {
  email: string;
  password: string;
};

const LOGIN_SCHEMA = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(1, { message: 'Password required' }),
});

const LoginForm = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LOGIN_SCHEMA),
    mode: 'onTouched',
  });

  const { mutate: handleLogin, isPending, isError, error } = useLogin();

  const onLoginPress = async (loginData: LoginFormData) => {
    try {
      const validData = LOGIN_SCHEMA.parse(loginData);
      setLoginError(null);
      await handleLogin(validData);
      router.push('/(app)');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err instanceof ZodError) {
        Alert.alert(err.errors[0].message);
      } else if (isError && error) {
        Alert.alert(
          'Login Error',
          error.message || 'Login failed. Please try again.',
        );
      }
    }
  };

  return (
    <View style={{ gap: 10, flexDirection: 'column' }} className="w-full">
      {loginError && <Text className="text-red">{loginError}</Text>}
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={(text: string) => {
              onChange(text);
              trigger('email');
            }}
            value={value}
            title="Email"
            placeholder="Enter your email"
            error={errors.email && errors.email.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={(text: string) => {
              onChange(text);
              trigger('password');
            }}
            secureTextEntry
            value={value}
            title="Password"
            placeholder="Enter your password"
            error={errors.password && errors.password.message}
          />
        )}
      />
      <View className="w-full pt-[5%]">
        <Button
          text="Log in"
          onPress={handleSubmit(onLoginPress)}
          disabled={isPending}
        />
      </View>
    </View>
  );
};

export default LoginForm;
