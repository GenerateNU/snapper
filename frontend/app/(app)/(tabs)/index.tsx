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
import SpeciesInfo from '../../../components/species-info';

const speciesData = {
  _id: '6746410540c040de1093b6a2',
  domain: 'Q19088',
  kingdom: 'Q729',
  phylum: 'Q10915',
  class: 'Q127282',
  order: 'Q127595',
  family: 'Q465563',
  genus: 'Q1515467',
  species: 'Q674381',
  aphiaId: '219665',
  scientificName: 'Naso lituratus',
  articleUrl: 'https://en.wikipedia.org/wiki/Naso_lituratus',
  articleTitle: 'Naso lituratus',
  commonNames: [
    'Naso trang',
    'Pacific orange-spine Unicorn',
    'Striped Unicornfish',
    'Orange-spine Unicornfish',
    'Clown Tang',
    'Poll Unicornfish',
    'Redlip Surgeonfish',
    'Masked Unicornfish',
    'Striped-faced Unicornfish',
    'Smooth-head Unicornfish',
    'Barcheek Unicornfish',
    'Orange Spine Surgeonfish',
  ],
  imageUrls: [
    'http://commons.wikimedia.org/wiki/Special:FilePath/Orangespine%20Unicornfish%20-%20Naso%20lituratus.jpg',
    'http://commons.wikimedia.org/wiki/Special:FilePath/Orangespine%20unicornfish%20Naso%20lituratus.jpg',
  ],
  locations: ['South China Sea'],
  visibility: true,
  introduction: `Naso lituratus, the clown unicornfish, orangespined unicornfish, black-finned unicornfish, Pacific orangespined unicornfish, blackfinned unicornfish or stripefaced unicornfish, is a species of marine ray-finned fish belonging to the family Acanthuridae, the surgeonfishes, unicornfishes and tangs. This fish is found in the eastern Indian Ocean and western Pacific Ocean. 
Unique to members of Acanthuridae, including Naso lituratus, are the Epulopiscium bacteria. These bacteria influence the digestion of Naso lituratus, helping them process the algae in their diet.
Naso lituratus can be found in the Indian Ocean and the Pacific Ocean. This species can be easily recognised by two bright orange forward-hooked spines on the caudal peduncle (the tail base), its orange lips and black face mask. The body is brownish grey with yellow nape and there is a broad black band on the dorsal fin. It reaches about 45 cm (18 in) in length.
It can be found on coral reefs, often in pairs.`,
  iconUrl: 'https://dodo.ac/np/images/0/00/Black_Bass_NH_Icon.png',
};

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
  } = useUserFollowingPosts(mongoDBId!, selectedFilters);

  // hooks call for nearby posts
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
  }, [selectedFilters, selectedCategory]);

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

  // component to show no post found
  const NoPostFound = () => (
    <View className="w-full items-center mt-5">
      <Text className="text-gray-500">No posts found</Text>
    </View>
  );

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
