import React from 'react';

import { router, Stack } from 'expo-router';
import Arrow from '../../../components/arrow';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerShown: true,
          headerLeft: () => (
            <Arrow direction="left" onPress={() => router.back()} />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
