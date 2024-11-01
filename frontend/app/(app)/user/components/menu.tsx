import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useAuthStore } from '../../../../auth/authStore';
import { useUserDiveLogs, useUserFish } from '../../../../hooks/user';
import DiveLog from './divelog';
import Species from './species';
import DiveLogSkeleton from './skeleton/divelog-skeleton';
import SpeciesSkeleton from './skeleton/species-skeleton';
import { PROFILE_PHOTO } from '../../../../consts/profile';

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

  const profilePhoto = user.profilePicture ? user.profilePicture : PROFILE_PHOTO;

  const renderDiveLog = ({ item }: { item: any }) => {
    const firstPhoto =
      item?.photos && item.photos.length > 0 ? item.photos[0] : null;
    return (
      <DiveLog
        fishTags={item?.fishTags}
        image={firstPhoto}
        description={item?.description}
        username={user.username}
        profilePhoto={profilePhoto}
        date={item?.date}
      />
    );
  };

  const renderSpecies = ({ item }: { item: any }) => {
    return <Species id={item._id} name={item.commonName} />;
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
        diveLogLoading ? (
          <FlatList
            data={[1, 2]}
            renderItem={() => <DiveLogSkeleton />}
            keyExtractor={(item) => item.toString()}
          />
        ) : diveLogError ? (
          <Text className="text-gray-500 text-md">Error loading divelogs. Please try again.</Text>
        ) : (
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
        )
      )}
      {category === 'Species' && (
        fishLoading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6]}
            renderItem={() => <SpeciesSkeleton />}
            keyExtractor={(item) => item.toString()}
            numColumns={3}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingBottom: 10,
            }}
            columnWrapperStyle={{
              gap: 10,
            }}
          />
        ) : fishError ? (
          <Text className="text-gray-500 text-md">Error loading species. Please try again.</Text>
        ) : (
          <FlatList
            data={fishData}
            renderItem={renderSpecies}
            numColumns={3}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingBottom: 10,
            }}
            columnWrapperStyle={{
              gap: 10,
            }}
            keyExtractor={(item) => item._id}
          />
        )
      )}
    </View>
  );
};

export default Menu;
