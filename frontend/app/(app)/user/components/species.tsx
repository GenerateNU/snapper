import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

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
        className="bg-water mb-3 rounded-md flex flex-col w-[31.5%] justify-center items-center pt-[2%] pb-[5%]"
      >
        <Image
          height={80}
          width={80}
          source={{
            uri: image,
          }}
        />
        <Text className="text-center px-2 font-bold text-xs sm:text-sm md:text-md">
          {text}
        </Text>
      </TouchableOpacity>
    );
  },
);

export default Species;
