import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useAuthStore } from '../../../../auth/authStore';
import {
  useUserById,
  useUserDivelogById,
  useUserSpeciesById,
} from '../../../../hooks/user';
import DiveLog from '../../../../components/divelog';
import Species from './species';
import DiveLogSkeleton from './skeleton/divelog-skeleton';
import SpeciesSkeleton from './skeleton/species-skeleton';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import PopulatedInfoPopupButton from '../../../../components/populated-info-popup';

const Menu = ({ id }: { id: string }) => {
  const [category, setCategory] = useState('Dives');
  const { supabaseId } = useAuthStore();
  const { data: userData } = useUserById(id);

  const isViewingOwnProfile = supabaseId === id;

  const {
    data: diveLogData,
    isError: diveLogError,
    isLoading: diveLogLoading,
  } = useUserDivelogById(id);

  const {
    data: speciesData,
    isError: speciesError,
    isLoading: speciesLoading,
  } = useUserSpeciesById(id);

  const noData =
    (!diveLogData || diveLogData.length === 0) &&
    (!speciesData || speciesData.length === 0);

  const profilePhoto = userData?.user.profilePicture || PROFILE_PHOTO;
  const username = userData?.user.username;

  const renderDiveLog = ({ item }: { item: any }) => {
    const firstPhoto = item?.photos?.[0] || null;
    return (
      <DiveLog
        divelogId={item._id}
        isMyProfile={isViewingOwnProfile}
        speciesTags={item?.speciesTags}
        image={firstPhoto}
        description={item?.description}
        username={username}
        profilePhoto={profilePhoto}
        date={item?.date}
      />
    );
  };

  const renderSpecies = ({ item }: { item: any }) => {
    return (
      <PopulatedInfoPopupButton key={item._id} speciesId={item.scientificName}>
        <Species />
      </PopulatedInfoPopupButton>
    );
  };

  if (noData) {
    return null;
  }

  return (
    <View className="flex flex-col w-full mb-[20%]">
      <View className="flex w-full flex-row justify-around pb-[5%]">
        <TouchableOpacity
          className={`py-[3%] w-[50%] justify-center items-center ${category === 'Dives' ? 'border-b-2 border-darkblue' : 'border-b-2 border-gray-200'}`}
          onPress={() => setCategory('Dives')}
        >
          <Text className="font-bold text-base sm:text-lg md:text-xl text-darkblue">
            Dives
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-[3%] w-[50%] justify-center items-center ${category === 'Species' ? 'border-b-2 border-darkblue' : 'border-b-2 border-gray-200'}`}
          onPress={() => setCategory('Species')}
        >
          <Text className="font-bold text-base sm:text-lg md:text-xl text-darkblue">
            Species
          </Text>
        </TouchableOpacity>
      </View>
      {category === 'Dives' &&
        (diveLogLoading ? (
          <FlatList
            data={[1, 2]}
            renderItem={() => <DiveLogSkeleton />}
            keyExtractor={(item) => item.toString()}
          />
        ) : diveLogError ? (
          <Text className="text-gray-500 text-sm sm:text-base md:text-lg">
            Error loading divelogs. Please try again.
          </Text>
        ) : (
          <FlatList
            data={diveLogData}
            renderItem={renderDiveLog}
            ItemSeparatorComponent={() => <View className="h-5"></View>}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
            keyExtractor={(_, index) => index.toString()}
          />
        ))}
      {category === 'Species' &&
        (speciesLoading ? (
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
        ) : speciesError ? (
          <Text className="text-gray-500 text-sm sm:text-base md:text-lg">
            Error loading species. Please try again.
          </Text>
        ) : (
          <FlatList
            data={speciesData}
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
        ))}
    </View>
  );
};

export default Menu;
