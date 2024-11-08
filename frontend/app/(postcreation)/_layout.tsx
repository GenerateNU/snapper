import React from 'react';
import { router, Stack } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';

type FormFields = {
  tags: string[];
  image: string;
  date: Date;
  location: string;
  description: string;
};

export default function Layout() {
  const methods = useForm<FormFields>();

  return (
    <FormProvider {...methods}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            headerTitle: '',
            headerTransparent: true,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="tag-fish"
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </FormProvider>
  );
}
