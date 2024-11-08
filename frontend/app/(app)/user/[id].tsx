import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import User from './components/user-profile';

const Profile = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <User id={id} />;
};

export default Profile;
