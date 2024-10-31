import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Menu = () => {
  const [category, setCategory] = useState('Dives');

  return (
    <View className="flex flex-col w-full">
      <View className="flex w-full flex-row justify-around">
        <TouchableOpacity
          className={`py-[3%] w-[50%] justify-center items-center ${category === 'Dives' ? 'border-b-2 border-darkblue' : 'border-b-2 border-gray-200'}`}
          onPress={() => setCategory('Dives')}
        >
          <Text className="font-bold text-lg text-darkblue">Dives</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-[3%] w-[50%] justify-center items-center ${category === 'Species' ? 'border-b-2 border-darkblue' : 'border-b-2 border-gray-200'}`}
          onPress={() => setCategory('Species')}
        >
          <Text className="text-darkblue font-bold text-lg">Species</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Menu;
