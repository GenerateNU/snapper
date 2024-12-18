import React from 'react';
import { router, Stack } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import Arrow from '../../../../components/arrow';
import { FormFields } from '../../../../types/divelog';

export default function Layout() {
  const methods = useForm<FormFields>();

  return (
    <FormProvider {...methods}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerShown: true,
            gestureEnabled: false,
            headerLeft: () => (
              <Arrow direction="left" onPress={() => router.push('/(tabs)')} />
            ),
          }}
        />
        <Stack.Screen
          name="tag-fish"
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            gestureEnabled: false,
            headerLeft: () => (
              <Arrow direction="left" onPress={() => router.back()} />
            ),
          }}
        />
      </Stack>
    </FormProvider>
  );
}
