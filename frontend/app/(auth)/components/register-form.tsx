import React from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../../components/button';
import { z, ZodError } from 'zod';
import { router } from 'expo-router';
import { useRegister } from '../../../hooks/auth';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

const REGISTER_SCHEMA = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters long',
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
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(REGISTER_SCHEMA),
    mode: 'onTouched',
  });

  const { mutateAsync: handleRegister, isPending, isError } = useRegister();

  const onSignUpPress = async (signupData: RegisterFormData) => {
    try {
      const validData = REGISTER_SCHEMA.parse(signupData);
      console.log({ validData });
      await handleRegister(validData);
      router.push('/(app)');
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
      {isError && <Text className="text-red-500">Signup failed. Please try again.</Text>}
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <Input
              onChangeText={(text: string) => {
                onChange(text);
                trigger('name');
              }}
              value={value}
              title="Name"
              placeholder="Enter your name"
              error={errors.name && errors.name.message}
            />
          </>
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
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
          </>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
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
          </>
        )}
      />
      <View className="w-full pt-[5%]">
        <Button disabled={isPending} 
                text={isPending ? "Logging in..." : "Log In" }
                onPress={handleSubmit(onSignUpPress)} />
      </View>
    </View>
  );
};

export default RegisterForm;
