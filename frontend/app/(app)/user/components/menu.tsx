import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import {
  useUserById,
  useUserDiveLogs,
  useUserSpecies,
} from '../../../../hooks/user';
import Species from './species';
import DiveLogSkeleton from './skeleton/divelog-skeleton';
import SpeciesSkeleton from './skeleton/species-skeleton';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import PopulatedInfoPopupButton from '../../../../components/populated-info-popup';
import BigDiveLog from '../../../../components/divelog/divelog';

const Menu = ({ id }: { id: string }) => {
  const [category, setCategory] = useState('Dives');
  const { data: userData } = useUserById(id);

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

  const username = userData?.user.username;

  const renderDiveLog = ({ item }: { item: any }) => {
    return (
      <BigDiveLog
        date={item?.date}
        userId={item?.user}
        id={item?._id}
        speciesTags={item?.speciesTags}
        photos={item?.photos}
        description={item?.description}
        username={username}
        profilePicture={item?.profilePicture || PROFILE_PHOTO}
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
      <View style={{ gap: 10 }} className="flex-row">
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
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
            ItemSeparatorComponent={() => <View className="h-12" />}
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
