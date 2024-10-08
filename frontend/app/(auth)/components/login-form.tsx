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
  const [loading, setLoading] = useState(false);

  const onLoginPress = async (loginData: LoginFormData) => {
    setLoading(true);
    try {
      const validData = LOGIN_SCHEMA.parse(loginData);
      setLoginError(null);
      await handleLogin(validData); 
    } catch (err: any) {
      console.error('Login error:', err);
      if (err instanceof ZodError) {
        Alert.alert(err.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Logging in...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isError && <Text style={styles.errorText}>{error.message}</Text>}
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
      <Button text="Log in" onPress={handleSubmit(onLoginPress)} disabled={isPending} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginForm;
