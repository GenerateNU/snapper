import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import {
  useUserById,
  useUserDiveLogs,
  useUserSpecies,
} from '../../../../hooks/user';
import SpeciesSkeleton from './skeleton/species-skeleton';
import Species from './species';
import BigDiveLog from '../../../../components/divelog/divelog';
import PopulatedInfoPopupButton from '../../../../components/populated-info-popup';
import DiveLogSkeleton from '../../divelog/components/skeleton';
import { useFocusEffect } from 'expo-router';

const Menu = ({ id }: { id: string }) => {
  const { width } = Dimensions.get('window');
  const [category, setCategory] = useState('Dives');
  const { data: userData } = useUserById(id);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            category === 'Dives' ? 0 : (width / 2) * 0.86,
            {
              duration: 300,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            },
          ),
        },
      ],
    };
  }, [category]);

  const {
    data: diveLogPages,
    isLoading: diveLogIsLoading,
    error: diveLogError,
    fetchNextPage: diveLogFetchNextPage,
    hasNextPage: diveLogHasNextPage,
    isFetchingNextPage: diveLogIsFetchingNextPage,
    refetch: refetchDivelog,
    isRefetching: isRefetchingDivelog,
  } = useUserDiveLogs(id);

  const {
    data: speciesPages,
    isLoading: speciesIsLoading,
    error: speciesError,
    fetchNextPage: speciesFetchNextPage,
    hasNextPage: speciesHasNextPage,
    isFetchingNextPage: speciesIsFetchingNextPage,
    refetch: refetchSpecies,
  } = useUserSpecies(id);

  const memoizedRefetch = useMemo(() => {
    return category === 'Dives' ? refetchDivelog : refetchSpecies;
  }, [category, refetchDivelog, refetchSpecies]);

  useFocusEffect(
    useCallback(() => {
      console.log(`Refetching ${category} data`);
      memoizedRefetch();
    }, [memoizedRefetch, category]),
  );

  const diveLogData = diveLogPages?.pages.flatMap((page) => page) ?? [];
  const speciesData = speciesPages?.pages.flatMap((page) => page) ?? [];

  if (diveLogData.length === 0 && speciesData.length === 0) {
    return null;
  }

  const renderDiveLog = ({ item }: { item: any }) => {
    return (
      <BigDiveLog
        location={item?.location.coordinates}
        date={item?.date}
        userId={item?.user._id}
        id={item?._id}
        speciesTags={item?.speciesTags}
        photos={item?.photos}
        description={item?.description}
        username={userData?.user.username}
        profilePicture={item?.user.profilePicture || PROFILE_PHOTO}
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

    return (
      <View className="mt-4 mb-8">
        <DiveLogSkeleton />
      </View>
    );
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
      <View className="flex w-full flex-row justify-around pb-[5%] relative">
        <Animated.View
          className="bg-deep absolute h-[2px] w-1/2"
          style={[
            {
              bottom: '30%',
            },
            indicatorStyle,
          ]}
        />
        <TouchableOpacity
          className="py-2 w-[50%] justify-center items-center"
          onPress={() => setCategory('Dives')}
        >
          <Text
            className={`font-bold text-base sm:text-lg md:text-xl ${
              category === 'Dives' ? 'text-darkblue' : 'text-gray-400'
            }`}
          >
            Dives
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-[3%] w-[50%] justify-center items-center"
          onPress={() => setCategory('Species')}
        >
          <Text
            className={`font-bold text-base sm:text-lg md:text-xl ${
              category === 'Species' ? 'text-darkblue' : 'text-gray-400'
            }`}
          >
            Species
          </Text>
        </TouchableOpacity>
      </View>

      {category === 'Dives' &&
        (diveLogIsLoading || isRefetchingDivelog ? (
          <FlatList
            data={[1, 2]}
            renderItem={() => (
              <View className="mt-5">
                <DiveLogSkeleton />
              </View>
            )}
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
