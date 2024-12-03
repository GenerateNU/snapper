import React from 'react';

import { Stack, router } from 'expo-router';
import Arrow from '../../../components/arrow';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="follower_following"
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
  );
};

export default Layout;
