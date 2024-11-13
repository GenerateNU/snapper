import React from 'react';
import { router, Stack } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import Arrow from '../../../components/arrow';
export type Location = {
  type: string;
  coordinates: number[];
};

export type FormFields = {
  tags: string[];
  image: string;
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
          name="post"
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerShown: true,
            headerLeft: () => (
              <Arrow direction="left" onPress={() => router.push("/(tabs)")} />
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
          }}
        />
      </Stack>
    </FormProvider>
  );
}
