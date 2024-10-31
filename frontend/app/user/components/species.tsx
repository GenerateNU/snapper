import { View, Text, TouchableOpacity } from 'react-native';

interface SpeciesProps {
  id: string;
  name: string;
  image: string;
}

const Species: React.FC<SpeciesProps> = ({ id, name, image }) => {
  return (
    <TouchableOpacity className="bg-water rounded-md flex flex-col w-1/3 justify-center items-center p-[5%]">
      <View className="w-16 h-16 bg-ocean"></View>
      <Text className="pt-2 font-bold">{name}</Text>
    </TouchableOpacity>
  );
};

export default Species;
