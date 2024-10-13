import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface FullScreenSpinnerProps {
  isLoading: boolean;
}

const FullScreenSpinner: React.FC<FullScreenSpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default FullScreenSpinner;
