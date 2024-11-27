import {
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
  Animated,
  Text,
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
import usePulsingAnimation from '../../../utils/skeleton';

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
  const opacity = usePulsingAnimation();

  const {
    data: followingPosts,
    isLoading: isLoadingFollowingPosts,
    fetchNextPage: fetchNextPageFollowing,
    hasNextPage: hasNextPageFollowing,
    isFetchingNextPage: isFetchingNextPageFollowing,
    refetch: refetchFollowingPosts,
    isRefetching: isRefetchingFollowingPosts,
  } = useUserFollowingPosts(mongoDBId!, selectedFilters);

  const {
    data: nearbyPosts,
    isLoading: isLoadingNearby,
    fetchNextPage: fetchNextPageNearby,
    hasNextPage: hasNextPageNearby,
    refetch: refetchNearByPosts,
    isFetching: isFetchingNearbyPosts,
  } = useNearbyDiveLogs(
    currentLocation.latitude,
    currentLocation.longitude,
    selectedFilters,
  );

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

  useEffect(() => {
    if (selectedCategory === Category.NEARBY) {
      refetchNearByPosts();
    } else {
      refetchFollowingPosts();
    }
  }, [selectedFilters, selectedCategory]);

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

  const NoPostFound = () => (
    <View className="w-full items-center mt-5">
      <Text className="text-gray-500">No posts found</Text>
    </View>
  );

  const renderFollowingPosts = () => {
    if (isLoadingFollowingPosts || isRefetchingFollowingPosts) {
      return (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3]}
          renderItem={() => (
            <View className="mb-10">
              <DiveLogSkeleton />
            </View>
          )}
        />
      );
    }

    if (followingPosts?.pages.flatMap((page) => page).length === 0) {
      return <NoPostFound />;
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
    if (isFetchingNearbyPosts) {
      return (
        <FlatList
          data={[1, 2, 3, 4]}
          numColumns={2}
          renderItem={({ item, index }: { item: any; index: number }) => (
            <Animated.View
              className={`w-[48%] h-32 bg-slate-200 mb-4 rounded-xl ${index % 2 === 0 ? 'mr-2' : 'ml-2'}`}
              style={{ opacity: opacity }}
            />
          )}
        />
      );
    }

    if (nearbyPosts?.pages.flatMap((page) => page).length === 0) {
      return <NoPostFound />;
    }

    return (
      <ScrollView className="h-[100%]" showsVerticalScrollIndicator={false}>
        <MasonryFlashList
          data={nearbyPosts?.pages.flatMap((page) => page) || []}
          numColumns={2}
          renderItem={renderNearbyPost}
          estimatedItemSize={200}
          // onEndReachedThreshold={0}
          // onEndReached={() =>
          //   loadMorePosts(fetchNextPageNearby, hasNextPageNearby)
          // }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
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
              categories={Object.values(Category)}
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
