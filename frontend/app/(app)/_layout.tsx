import React from 'react';

import { router, Stack } from 'expo-router';
import Arrow from '../../components/arrow';
import IconButton from '../../components/icon-button';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { StyleSheet } from 'react-native';

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
          headerShown: true,
          headerStyle: styles.header,
          headerLeft: () => (
            <Arrow
              direction="left"
              onPress={() => router.back()}
            />
          ),
          headerRight: () => (
            <IconButton icon={faBars} />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({
  header: {
    height: 10,
    backgroundColor: 'transparent',
  },
});