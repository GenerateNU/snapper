import React from 'react';
import { View, Alert, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../../components/button';
import { z, ZodError } from 'zod';
import { router } from 'expo-router';
import { useAuthStore } from '../../../auth/authStore';

type LoginFormData = {
  email: string;
  password: string;
};

const LOGIN_SCHEMA = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(1, { message: 'Password required' }),
});

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LOGIN_SCHEMA),
    mode: 'onTouched',
  });

  const { login, loading, error: authError } = useAuthStore();

  const onLoginPress = async (loginData: LoginFormData) => {
    try {
      const validData = LOGIN_SCHEMA.parse(loginData);
      await login(validData);
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (isAuthenticated) {
        router.push('/(app)');
      }
    } catch (err: any) {
      if (err instanceof ZodError) {
        Alert.alert(err.errors[0].message);
      }
    }
  };

  return (
    <View style={{ gap: 10, flexDirection: 'column' }} className="w-full">
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
      {authError && (
        <Text className="text-red-500">Login failed. Please try again.</Text>
      )}
      <View className="w-full pt-[25%]">
        <Button
          text={loading ? 'Logging in...' : 'Log In'}
          onPress={handleSubmit(onLoginPress)}
          disabled={loading || !isValid}
        />
      </View>
    </View>
  );
};

export default LoginForm;
