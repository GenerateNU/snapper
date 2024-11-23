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

const Home = () => {
  const { mongoDBId } = useAuthStore();
  const [selected, setSelected] = useState<Category>(Category.FOLLOWING);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>(DEFAULT_SHERM_LOCATION);

  const dummyData = [
    {
      profilePhoto:
        'https://i.pinimg.com/474x/d2/c1/ae/d2c1aea857d404b2b69837dca56c18da.jpg',
      photos: [
        'https://i.pinimg.com/474x/2c/c7/10/2cc7104b8a680aeb4350605c2f6223a5.jpg',
      ],
      description:
        'Exploring a world beneath the waves—where every breath feels like a new adventure.',
      divelogId: 1,
    },
    {
      profilePhoto:
        'https://i.pinimg.com/474x/77/3b/4c/773b4cb333ba75584c934868ca6d1717.jpg',
      photos: [
        'https://i.pinimg.com/474x/14/fa/b3/14fab36f6c6231d0200edf7b5dd9756e.jpg',
      ],
      description:
        'Diving into the deep blue, where serenity and wonder meet. ',
      divelogId: 1,
    },
    {
      profilePhoto:
        'https://i.pinimg.com/474x/df/fd/cf/dffdcfb031eeebbf3756c92c65e86670.jpg',
      photos: [
        'https://i.pinimg.com/474x/8a/23/df/8a23dfa4d342ad0dcfe821561f04c759.jpg',
      ],
      description: 'The ocean is calling, and I must dive.',
      divelogId: 1,
    },
    {
      profilePhoto:
        'https://i.pinimg.com/474x/21/5e/8d/215e8de59b60b0d8134edb189e93dc7e.jpg',
      photos: [
        'https://i.pinimg.com/474x/d2/c1/ae/d2c1aea857d404b2b69837dca56c18da.jpg',
      ],
      description: 'The deep sea doesn’t just call you—it embraces you.',
      divelogId: 1,
    },
    {
      profilePhoto:
        'https://i.pinimg.com/474x/68/fc/ac/68fcac9bb0bf479a585156ecad0d7946.jpg',
      photos: [
        'https://i.pinimg.com/474x/6d/24/18/6d2418b815fbf8584372328c903feea8.jpg',
      ],
      description:
        'In the ocean, every moment feels like a deep breath of freedom.',
      divelogId: 1,
    },
    {
      profilePhoto:
        'https://i.pinimg.com/474x/40/5e/a5/405ea58650831ac4a50d0b392ed9ece5.jpg',
      photos: [
        'https://i.pinimg.com/474x/d9/1c/94/d91c948ab38a306230453909a2dcfced.jpg',
      ],
      description:
        'In the ocean, every moment feels like a deep breath of freedom.',
      divelogId: 1,
    },
  ];

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
  } = useUserFollowingPosts(mongoDBId!);

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
        profilePhoto={item.profilePhoto}
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
            data={dummyData}
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
