import React from 'react';

import { router, Stack } from 'expo-router';
import Arrow from '../../components/arrow';
import IconButton from '../../components/icon-button';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { StyleSheet } from 'react-native';

const Layout = ({ isOwnProfile }: { isOwnProfile: boolean }) => {
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
