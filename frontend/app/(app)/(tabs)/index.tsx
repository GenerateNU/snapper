import { View, SafeAreaView, FlatList } from 'react-native';
import { useAuthStore } from '../../../auth/authStore';
import HomeMenu from '../../../components/home/menu-bar';
import { Category } from '../../../consts/home-menu';
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

const Home = () => {
  const { mongoDBId } = useAuthStore();
  const [selected, setSelected] = useState<Category>(Category.FOLLOWING);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>(DEFAULT_SHERM_LOCATION);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      if (selected === Category.NEARBY) {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    };

    fetchLocation();
  }, [selected]);

  const {
    data: followingPosts,
    isLoading: isLoadingFollowing,
    error: errorFollowing,
    refetch: refetchFollowing,
    fetchNextPage: fetchNextPageFollowing,
    hasNextPage: hasNextPageFollowing,
    isFetchingNextPage: isFetchingNextPageFollowing,
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

  const renderFollowingPost = ({ item }: { item: any }) => (
    <View className="w-full">
      <BigDiveLog
        id={item?._id}
        date={new Date()}
        profilePicture={PROFILE_PHOTO}
        photos={[
          'https://media.istockphoto.com/id/541599504/photo/underwater-scuba-divers-enjoy-explore-reef-sea-life-sea-sponge.jpg?s=612x612&w=0&k=20&c=SVgk2ad0R2Sx7ZZmKZ6VijJKL6OASKwVfeSOEUjUwiI=',
          'https://media.istockphoto.com/id/1425382824/photo/green-turtle-at-the-water-surface.jpg?s=612x612&w=0&k=20&c=CyMAvEvjfnpEPHWRwprwMRLvprgVfeK14FmFF_LTs_k=',
          'https://media.istockphoto.com/id/1482719596/photo/japanese-freediver-and-shark-embrace-the-deep-blue-on-a-sunny-day.jpg?s=612x612&w=0&k=20&c=43GvAqzyEiMYU5seQRExAgIGlVcW28UkhqQUpRIH2c0=',
        ]}
        description={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        }
        username={item?.user.username}
        userId={item?.user._id}
        speciesTags={item?.speciesTags}
      />
    </View>
  );

  const renderNearbyPost = ({ item, index }: { item: any; index: number }) => (
    <View className={`mb-4 ${index % 2 === 0 ? 'mr-2' : 'ml-2'}`}>
      <NearbyDiveLog
        profilePhoto={PROFILE_PHOTO}
        description={item.description}
        divelogId={item._id}
        photos={item.photos}
      />
    </View>
  );

  const loadMoreFollowingPosts = () => {
    if (hasNextPageFollowing) {
      fetchNextPageFollowing();
    }
  };

  const renderFooterComponent = () => (
    <View className="mt-8">
      <DiveLogSkeleton />
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <View
        style={{ gap: 20 }}
        className="flex-1 justify-start px-[5%] mt-[5%]"
      >
        <HomeMenu selected={selected} setSelected={setSelected} />
        {selected === Category.FOLLOWING ? (
          isLoadingFollowing ? (
            <FlatList data={[1, 2, 3]} renderItem={() => <DiveLogSkeleton />} />
          ) : (
            <FlatList
              key="following-divelogs"
              renderItem={renderFollowingPost}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooterComponent}
              onEndReached={loadMoreFollowingPosts}
              ItemSeparatorComponent={() => <View className="h-12" />}
              data={followingPosts?.pages.flatMap((page) => page) || []}
            />
          )
        ) : (
          <MasonryFlashList
            data={nearbyPosts?.pages.flatMap((page) => page) || []}
            numColumns={2}
            renderItem={renderNearbyPost}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
