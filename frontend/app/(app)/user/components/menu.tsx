import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useAuthStore } from '../../../../auth/authStore';
import { useUserDiveLogs, useUserFish } from '../../../../hooks/user';
import DiveLog from './divelog';

const Menu = () => {
  const [category, setCategory] = useState('Dives');
  const {
    data: diveLogData,
    isError: diveLogError,
    isLoading: diveLogLoading,
  } = useUserDiveLogs();
  const {
    data: fishData,
    isError: fishError,
    isLoading: fishLoading,
  } = useUserFish();
  const { user } = useAuthStore();

  const renderDiveLog = ({ item }: { item: any }) => {
    const firstPhoto =
      item?.photos && item.photos.length > 0 ? item.photos[0] : null;
    return (
      <DiveLog
        image={firstPhoto}
        description={item?.description}
        username={user.username}
        profilePhoto="https://media.istockphoto.com/id/486456250/photo/quokka.jpg?s=612x612&w=0&k=20&c=yEGZPgo4V-v-f4omG_1oW7urV3pCHa3qbcdrqqhYoPA="
        date={item?.date}
      />
    );
  };

  return (
    <View className="flex flex-col w-full mb-[20%]">
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

      {category === 'Dives' && (
        <FlatList
          data={diveLogData}
          renderItem={renderDiveLog}
          ItemSeparatorComponent={() => <View className="h-[3%]"></View>}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {category === 'Species' &&
        fishData?.map((fish: any, key: number) => <Text key={key}>Fish</Text>)}
    </View>
  );
};

export default Menu;
