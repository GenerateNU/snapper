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
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="user"
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
