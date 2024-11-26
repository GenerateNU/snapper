import { View, SafeAreaView, FlatList, ScrollView } from 'react-native';
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

const Home = () => {
  const { mongoDBId } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    Category.FOLLOWING,
  );
  const [currentLocation, setCurrentLocation] = useState({
    latitude: DEFAULT_SHERM_LOCATION.latitude,
    longitude: DEFAULT_SHERM_LOCATION.longitude,
  });
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([
    Filter.ALL,
  ]);

  const {
    data: followingPosts,
    isLoading: isLoadingFollowing,
    fetchNextPage: fetchNextPageFollowing,
    hasNextPage: hasNextPageFollowing,
    isFetchingNextPage: isFetchingNextPageFollowing,
  } = useUserFollowingPosts(mongoDBId!);

  const {
    data: nearbyPosts,
    isLoading: isLoadingNearby,
    fetchNextPage: fetchNextPageNearby,
    hasNextPage: hasNextPageNearby,
  } = useNearbyDiveLogs(currentLocation.latitude, currentLocation.longitude);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      if (selectedCategory === Category.NEARBY) {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    };

    fetchLocation();
  }, [selectedCategory]);

  const renderFollowingPost = ({ item }: { item: any }) => (
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
        location={item?.location.coordinates}
      />
    </View>
  );

  const renderNearbyPost = ({ item, index }: { item: any; index: number }) => (
    <View className={`mb-4 ${index % 2 === 0 ? 'mr-2' : 'ml-2'}`}>
      <NearbyDiveLog
        profilePhoto={item?.user.profilePicture || PROFILE_PHOTO}
        description={item?.description}
        divelogId={item?._id}
        coverPhoto={item?.photos[0]}
      />
    </View>
  );

  const loadMorePosts = (fetchNextPage: () => void, hasNextPage: boolean) => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderPosts = () => {
    if (selectedCategory === Category.FOLLOWING) {
      return renderFollowingPosts();
    }
    return renderNearbyPosts();
  };

  const renderFollowingPosts = () => {
    if (isLoadingFollowing) {
      return (
        <FlatList
          data={[1, 2, 3]}
          renderItem={() => (
            <View className="mt-10">
              <DiveLogSkeleton />
            </View>
          )}
        />
      );
    }

    return (
      <FlatList
        data={followingPosts?.pages.flatMap((page) => page) || []}
        renderItem={renderFollowingPost}
        key="following-divelogs"
        showsVerticalScrollIndicator={false}
        onEndReached={() =>
          loadMorePosts(fetchNextPageFollowing, hasNextPageFollowing)
        }
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingNextPageFollowing ? (
            <View className="mt-10">
              <DiveLogSkeleton />
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 150 }}
        ItemSeparatorComponent={() => <View className="h-12" />}
      />
    );
  };

  const renderNearbyPosts = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <MasonryFlashList
          data={nearbyPosts?.pages.flatMap((page) => page) || []}
          numColumns={2}
          renderItem={renderNearbyPost}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </ScrollView>
    );
  };

  return (
    <>
      <SafeAreaView className="flex-1 justify-start" style={{ gap: 15 }}>
        <View className="flex-col" style={{ gap: 10 }}>
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

        <View className="px-[5%]">{renderPosts()}</View>
      </SafeAreaView>
      <InfoPopup />
    </>
  );
};

export default Home;
