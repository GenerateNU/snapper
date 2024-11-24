import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../../../auth/authStore';
import DiveLog from '../../../../components/divelog/divelog';
import PopulatedInfoPopupButton from '../../../../components/populated-info-popup';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import {
  useUserById,
  useUserDiveLogs,
  useUserSpecies,
} from '../../../../hooks/user';
import DiveLogSkeleton from './skeleton/divelog-skeleton';
import SpeciesSkeleton from './skeleton/species-skeleton';
import Species from './species';

const Menu = ({ id }: { id: string }) => {
  const [category, setCategory] = useState('Dives');
  const { mongoDBId } = useAuthStore();
  const { data: userData } = useUserById(id);

  const isViewingOwnProfile = mongoDBId === id;

  const {
    data: diveLogPages,
    isLoading: diveLogIsLoading,
    error: diveLogError,
    fetchNextPage: diveLogFetchNextPage,
    hasNextPage: diveLogHasNextPage,
    isFetchingNextPage: diveLogIsFetchingNextPage,
  } = useUserDiveLogs(id);

  const {
    data: speciesPages,
    isLoading: speciesIsLoading,
    error: speciesError,
    fetchNextPage: speciesFetchNextPage,
    hasNextPage: speciesHasNextPage,
    isFetchingNextPage: speciesIsFetchingNextPage,
  } = useUserSpecies(id);

  const diveLogData = diveLogPages?.pages.flatMap((page) => page) ?? [];
  const speciesData = speciesPages?.pages.flatMap((page) => page) ?? [];

  if (diveLogData.length === 0 && speciesData.length === 0) {
    return;
  }

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
        <Species image={item.iconUrl} />
      </PopulatedInfoPopupButton>
    );
  };

  const loadMoreSpecies = () => {
    if (speciesHasNextPage && !speciesIsFetchingNextPage) {
      speciesFetchNextPage();
    }
  };

  const loadMoreDiveLog = () => {
    if (diveLogHasNextPage && !diveLogIsFetchingNextPage) {
      diveLogFetchNextPage();
    }
  };

  const renderDiveLogFooter = () => {
    if (!diveLogIsFetchingNextPage) return null;
    return <DiveLogSkeleton />;
  };

  const renderSpeciesFooter = () => {
    if (!speciesIsFetchingNextPage) return null;
    return (
      <View className="flex-row gap-2">
        <SpeciesSkeleton />
        <SpeciesSkeleton />
        <SpeciesSkeleton />
      </View>
    );
  };

  return (
    <View className="flex flex-col w-full mb-10">
      <View className="flex w-full flex-row justify-around pb-[5%]">
        <TouchableOpacity
          className={`py-[3%] w-[50%] justify-center items-center ${
            category === 'Dives'
              ? 'border-b-2 border-darkblue'
              : 'border-b-2 border-gray-200'
          }`}
          onPress={() => setCategory('Dives')}
        >
          <Text className="font-bold text-base sm:text-lg md:text-xl text-darkblue">
            Dives
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-[3%] w-[50%] justify-center items-center ${
            category === 'Species'
              ? 'border-b-2 border-darkblue'
              : 'border-b-2 border-gray-200'
          }`}
          onPress={() => setCategory('Species')}
        >
          <Text className="font-bold text-base sm:text-lg md:text-xl text-darkblue">
            Species
          </Text>
        </TouchableOpacity>
      </View>
      {category === 'Dives' &&
        (diveLogIsLoading ? (
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
            onEndReached={loadMoreDiveLog}
            onEndReachedThreshold={0.7}
            renderItem={renderDiveLog}
            ListFooterComponent={renderDiveLogFooter}
            ItemSeparatorComponent={() => <View className="h-5" />}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
            keyExtractor={(item, index) => `species-${item._id}-${index}`}
          />
        ))}

      {category === 'Species' &&
        (speciesIsLoading ? (
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
            onEndReachedThreshold={0.7}
            onEndReached={loadMoreSpecies}
            ListFooterComponent={renderSpeciesFooter}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingBottom: 10,
            }}
            columnWrapperStyle={{
              gap: 10,
            }}
            keyExtractor={(item, index) => `diveLog-${item._id}-${index}`}
          />
        ))}
    </View>
  );
};

export default Menu;
