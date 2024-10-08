import React from 'react';

import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: '',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          headerTitle: '',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          headerTitle: '',
          headerTransparent: true,
        }}
      />
    </Stack>
  );
};

export default Layout;
