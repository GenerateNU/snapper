import React, { createContext, useState } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import ProgressBar from '../../components/progress-bar';

// create context with initial progress at 0
export const ProgressContext = createContext({
  progress: 0,
  setProgress: (p: number) => {},
});

const Layout = () => {
  const [progress, setProgress] = useState(0);

  return (
    // progress context allows for child components to update progress
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
              <View className="w-full px-[10%] flex mt-[20%]">
                <ProgressBar progress={progress} />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </ProgressContext.Provider>
  );
};

export default Layout;
