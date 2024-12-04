import React from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import User from './components/user-profile';
import Arrow from '../../../components/arrow';

const Profile = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerShown: true,
          headerLeft: () => (
            <Arrow direction="left" onPress={() => router.back()} />
          ),
        }}
      />
      <User id={id} />
    </>
  );
};

export default Profile;
