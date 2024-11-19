import React from 'react';
import { View, Alert, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../../components/button';
import { z, ZodError } from 'zod';
import { router } from 'expo-router';
import { useAuthStore } from '../../../auth/authStore';

type RegisterFormData = {
  firstName: string; // New field
  lastName: string; // New field
  username: string;
  email: string;
  password: string;
};

// Update schema to include first name and last name for validation
const REGISTER_SCHEMA = z.object({
  firstName: z.string().min(1, {
    message: 'First name is required',
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required',
  }),
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters long',
  }),
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .regex(/[0-9]/, {
      message: 'Password must contain at least one number',
    })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character',
    })
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(REGISTER_SCHEMA),
    mode: 'onTouched',
  });

  const { register, loading, error: authError } = useAuthStore();

  const onSignUpPress = async (signupData: RegisterFormData) => {
    try {
      const validData = REGISTER_SCHEMA.parse(signupData);
      console.log(validData);
      const { ...apiData } = validData;

      await register(apiData);
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
    <View
      style={{ gap: 10, flexDirection: 'column' }}
      className="w-full justify-center items-center"
    >
      {authError && (
        <Text className="text-red-500">Signup failed. Please try again.</Text>
      )}
      <Controller
        name="firstName"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={(text: string) => {
              onChange(text);
              trigger('firstName');
            }}
            value={value}
            title="First Name"
            placeholder="Enter your first name"
            error={errors.firstName && errors.firstName.message}
          />
        )}
      />
      <Controller
        name="lastName"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={(text: string) => {
              onChange(text);
              trigger('lastName');
            }}
            value={value}
            title="Last Name"
            placeholder="Enter your last name"
            error={errors.lastName && errors.lastName.message}
          />
        )}
      />
      <Controller
        name="username"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={(text: string) => {
              onChange(text);
              trigger('username');
            }}
            value={value}
            title="Username"
            placeholder="Enter your username"
            error={errors.username && errors.username.message}
          />
        )}
      />
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
            onSubmitEditing={handleSubmit(onSignUpPress)}
            returnKeyType="done"
          />
        )}
      />
      <View className="w-full pt-[10%]">
        <Button
          disabled={loading || !isValid}
          text={loading ? 'Signing up...' : 'Sign Up'}
          onPress={handleSubmit(onSignUpPress)}
        />
      </View>
    </View>
  );
};

export default RegisterForm;
