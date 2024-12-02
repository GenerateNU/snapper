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
import usePulsingAnimation from '../../../utils/skeleton';
import { useInfoPopup } from '../../../contexts/info-popup-context';
import InfoPopup from '../../../components/info-popup';
import { InfiniteData } from '@tanstack/react-query';

const Home = () => {
  const { setClose } = useInfoPopup();
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

  // hooks call for following posts
  const {
    data: followingPosts,
    isLoading: isLoadingFollowingPosts,
    fetchNextPage: fetchNextPageFollowing,
    hasNextPage: hasNextPageFollowing,
    isFetchingNextPage: isFetchingNextPageFollowing,
    refetch: refetchFollowingPosts,
    isRefetching: isRefetchingFollowingPosts,
    error: errorFollowingPosts,
  } = useUserFollowingPosts(mongoDBId!, selectedFilters);

  // hooks call for nearby posts
  const {
    data: nearbyPosts,
    isLoading: isLoadingNearby,
    fetchNextPage: fetchNextPageNearby,
    hasNextPage: hasNextPageNearby,
    refetch: refetchNearByPosts,
    isFetching: isFetchingNearbyPosts,
    error: errorNearbyPosts,
  } = useNearbyDiveLogs(
    currentLocation.latitude,
    currentLocation.longitude,
    selectedFilters,
  );

  // fetch the current location of user
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

  // refetch to when filters or categories change
  useEffect(() => {
    setClose();
    if (selectedCategory === Category.NEARBY) {
      refetchNearByPosts();
    } else {
      refetchFollowingPosts();
    }
  }, [selectedFilters, selectedCategory, nearbyPosts]);

  // render a following post
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

  // render a nearby post
  const renderNearbyPost = ({ item, index }: { item: any; index: number }) => (
    <View className={`mb-4 `} key ={index}>
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

  // component to show no post found
  const TextMessage = ({
    message,
    error = false,
  }: {
    message: string;
    error?: boolean;
  }) => (
    <View className="w-full items-center mt-5">
      <Text className={`${error ? 'text-red-500' : 'text-gray-500'}`}>
        {message}
      </Text>
    </View>
  );

  const ErrorPost = () => (
    <TextMessage message="Error loading posts" error={true} />
  );
  const NoPostFound = () => <TextMessage message="No posts found" />;

  // render posts based on category selected
  const renderPosts = () => {
    if (selectedCategory === Category.FOLLOWING) {
      return renderFollowingPosts();
    }
    return renderNearbyPosts();
  };

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

    if (errorFollowingPosts) {
      return <ErrorPost />;
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

  const split = (divelogs: any[]): any[]=> {
    let array1 = []
    let array2 = []
    let whichArray = true

    for(let i = 0; i < divelogs.length; i ++){
      if(whichArray){
        array1.push(divelogs[i])
      } else {
        array2.push(divelogs[i])
      }
      whichArray = !whichArray
    }

    return [array1, array2]

  }

  const renderNearbyPosts = () => {
    if (nearbyPosts?.pages.flatMap((page) => page).length === 0) {
      return <NoPostFound />;
    }

    if (errorNearbyPosts) {
      return <ErrorPost />;
    }

    return (
        <ScrollView 
        onScroll={(e) => {
          const contentHeight = e.nativeEvent.contentSize.height;
          const layoutHeight = e.nativeEvent.layoutMeasurement.height;
          const offsetY = e.nativeEvent.contentOffset.y;
          if (contentHeight - layoutHeight - offsetY <= 200) {
            loadMorePosts(fetchNextPageNearby, hasNextPageNearby)
          } else {
          }
        } }
        >
          <View className = "flex flex-row">
            <View className = "w-[48%] mr-[2%]">
              {split(nearbyPosts?.pages.flatMap((page) => page) || [])[0].map((item:any, index:number)=> {
                return (
                  renderNearbyPost({item, index})
                )
              })}

            </View>

            <View className = "w-[48%] ml-[2%]">
              {split(nearbyPosts?.pages.flatMap((page) => page) || [])[1].map((item:any, index:number)=> {
                return (
                  renderNearbyPost({item, index})
                )
            })}
            </View>
          </View>
        </ScrollView>
      );
  };

  return (
    <>
      <SafeAreaView
        className="flex-1 justify-start bg-white"
        style={{ gap: 15 }}
      >
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
