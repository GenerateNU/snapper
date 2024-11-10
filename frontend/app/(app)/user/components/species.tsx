import { Text, TouchableOpacity } from 'react-native';
import Fish from '../../../../assets/species.svg';
import React from 'react';

interface SpeciesProps {
  text?: string;
  onPress?: () => void;
  image?: string;
}

const Species: React.FC<SpeciesProps> = React.memo(
  ({ image, text, onPress }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="bg-water mb-3 rounded-md flex flex-col w-[32%] justify-center items-center pt-[2%] pb-[5%]"
      >
        <Fish height={80} width={80} />
        <Text className="text-center px-2 font-bold text-xs sm:text-sm md:text-md">
          {text}
        </Text>
      </TouchableOpacity>
    );
  },
);

export default Species;
