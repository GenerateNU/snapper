import {
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import { useAuthStore } from '../../../auth/authStore';
import HomeMenu from '../../../components/home/menu-bar';
import { Category, Filter } from '../../../consts/home-menu';
import { useEffect, useState } from 'react';
import { useUserFollowingPosts } from '../../../hooks/user';
import BigDiveLog from '../../../components/divelog/divelog';
import NearbyDiveLog from '../../../components/home/nearby-divelog';
import { MasonryFlashList } from '@shopify/flash-list';
import DiveLogSkeleton from '../divelog/components/skeleton';
import * as Location from 'expo-location';
import { DEFAULT_SHERM_LOCATION } from '../../../consts/location';
import { PROFILE_PHOTO } from '../../../consts/profile';
import { useNearbyDiveLogs } from '../../../hooks/divelog';
import FilterMenu from '../../../components/home/filter';
import InfoPopup from '../../../components/info-popup';
import { useInfoPopup } from '../../../contexts/info-popup-context';

const Home = () => {
  const { mongoDBId } = useAuthStore();
  const { setClose } = useInfoPopup();
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    Category.FOLLOWING,
  );
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>(DEFAULT_SHERM_LOCATION);
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([
    Filter.ALL,
  ]);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      if (selectedCategory === Category.NEARBY) {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    };

    fetchLocation();
  }, [selectedCategory]);

  const {
    data: followingPosts,
    isLoading: isLoadingFollowing,
    error: errorFollowing,
    refetch: refetchFollowing,
    fetchNextPage: fetchNextPageFollowing,
    hasNextPage: hasNextPageFollowing,
    isFetchingNextPage: isFetchingNextPageFollowing,
    handleEndReached: handleEndReachFollowingPosts,
  } = useUserFollowingPosts(mongoDBId!);

  const {
    data: nearbyPosts,
    isLoading: isLoadingNearby,
    error: errorNearby,
    refetch: refetchNearby,
    fetchNextPage: fetchNextPageNearby,
    hasNextPage: hasNextPageNearby,
    isFetchingNextPage: isFetchingNextPageNearby,
  } = useNearbyDiveLogs(currentLocation.latitude, currentLocation.longitude);

  const renderFollowingPost = ({ item }: { item: any }) => {
    return (
      <View className="w-full">
        <BigDiveLog
          id={item?._id}
          date={item?.date}
          profilePicture={item?.user.profilePicture || PROFILE_PHOTO}
          photos={item?.photos}
          description={item?.description}
          username={item?.user.username}
          userId={item?.user._id}
          speciesTags={item?.speciesTags}
        />
      </View>
    );
  };

  const renderNearbyPost = ({ item, index }: { item: any; index: number }) => (
    <View className={`mb-4 ${index % 2 === 0 ? 'mr-2' : 'ml-2'}`}>
      <NearbyDiveLog
        profilePhoto={item?.user.profilePicture || PROFILE_PHOTO}
        description={item?.description}
        divelogId={item?._id}
        photos={item?.photos}
      />
    </View>
  );

  return (
    <Pressable className="flex-1" onPress={setClose}>
      <SafeAreaView className="flex-1 justify-start" style={{ gap: 15 }}>
        <View style={{ gap: 10 }} className="flex-col">
          <View className="px-[5%]">
            <HomeMenu
              selected={selectedCategory}
              setSelected={setSelectedCategory}
            />
          </View>
          <FilterMenu
            selected={selectedFilters}
            setSelected={setSelectedFilters}
          />
        </View>

        <View className="px-[5%]">
          {selectedCategory === Category.FOLLOWING ? (
            isLoadingFollowing ? (
              <FlatList
                data={[1, 2, 3]}
                renderItem={() => <DiveLogSkeleton />}
              />
            ) : (
              <FlatList
                key="following-divelogs"
                renderItem={renderFollowingPost}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.3}
                onEndReached={handleEndReachFollowingPosts}
                ItemSeparatorComponent={() => <View className="h-12" />}
                data={followingPosts?.pages.flatMap((page) => page) || []}
              />
            )
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <MasonryFlashList
                data={nearbyPosts?.pages.flatMap((page) => page) || []}
                numColumns={2}
                renderItem={renderNearbyPost}
                estimatedItemSize={200}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 100,
                }}
              />
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
      <InfoPopup />
    </Pressable>
  );
};

export default Home;
