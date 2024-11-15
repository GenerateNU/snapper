import React from 'react';
import { router, Stack } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import { Photo } from '../../types/divelog';

export type Location = {
  type: string;
  coordinates: number[];
};

export type FormFields = {
  tags: string[];
  photos: Photo[];
  date: Date;
  location: Location;
  description: string;
  user: string;
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
