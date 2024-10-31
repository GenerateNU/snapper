import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../../../auth/authStore';
import { useUserDiveLogs, useUserFish } from '../../../../hooks/user';
import DiveLog from './divelog';

const Menu = () => {
  const [category, setCategory] = useState('Dives');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: diveLogData, isError: diveLogError, isLoading: diveLogLoading } = useUserDiveLogs();
  const { data: fishData , isError: fishError, isLoading: fishLoading } = useUserFish();

  return (
    <View className="flex flex-col w-full">
      <View className="flex w-full flex-row justify-around pb-[5%]">
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
      {category === "Dives" && 
        <View className="mb-[5%]">
          {diveLogData?.map((divelog: any, key: number) => (
            <DiveLog time={divelog?.time} />
          ))}
        </View>
      }
    </View>
  );
};

export default Menu;
