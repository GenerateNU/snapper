import React, { createContext, useState } from 'react';
import { router, Stack } from 'expo-router';
import { View } from 'react-native';
import ProgressBar from '../../components/progress-bar';
import Arrow from '../../components/arrow';
import { useAuthStore } from '../../auth/authStore';

// Create context with initial progress at 0
export const ProgressContext = createContext({
  progress: 0,
  setProgress: (p: number) => {},
});

const Layout = () => {
  const [progress, setProgress] = useState(0);
  const { clearError } = useAuthStore();

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            gestureEnabled: false,
            header: () => (
              <View className="w-full px-[8%] flex mt-[20%]">
                <ProgressBar progress={progress} />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="redirect"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: true,
            gestureEnabled: false,
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: () => (
              <Arrow
                direction="left"
                onPress={() => {
                  router.back();
                  clearError();
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: true,
            gestureEnabled: false,
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: () => (
              <Arrow
                direction="left"
                onPress={() => {
                  router.back();
                  clearError();
                }}
              />
            ),
          }}
        />
      </Stack>
    </ProgressContext.Provider>
  );
};

export default Layout;
