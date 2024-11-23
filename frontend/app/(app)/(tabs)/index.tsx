import { View, SafeAreaView, FlatList } from 'react-native';
import { useAuthStore } from '../../../auth/authStore';
import HomeMenu from '../../../components/home/menu-bar';
import { Category } from '../../../consts/home-menu';
import { useState } from 'react';
import { useUserFollowingPosts } from '../../../hooks/user';
import BigDiveLog from '../../../components/divelog/divelog';
import NearbyDiveLog from '../../../components/home/nearby-divelog';
import { MasonryFlashList } from '@shopify/flash-list';

const Home = () => {
  const { mongoDBId } = useAuthStore();
  const [selected, setSelected] = useState<Category>(Category.FOLLOWING);

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

  const {
    data: followingPosts,
    isLoading: isLoadingFollowing,
    error: errorFollowing,
    refetch: refetchFollowing,
    fetchNextPage: fetchNextPageFollowing,
    hasNextPage: hasNextPageFollowing,
    isFetchingNextPage: isFetchingNextPageFollowing,
  } = useUserFollowingPosts(mongoDBId!);

  const renderFollowingPost = ({ item }: { item: any }) => (
    <View className="w-full">
      <BigDiveLog
        id={item?._id}
        photos={[
          'https://media.istockphoto.com/id/541599504/photo/underwater-scuba-divers-enjoy-explore-reef-sea-life-sea-sponge.jpg?s=612x612&w=0&k=20&c=SVgk2ad0R2Sx7ZZmKZ6VijJKL6OASKwVfeSOEUjUwiI=',
          'https://media.istockphoto.com/id/1425382824/photo/green-turtle-at-the-water-surface.jpg?s=612x612&w=0&k=20&c=CyMAvEvjfnpEPHWRwprwMRLvprgVfeK14FmFF_LTs_k=',
          'https://media.istockphoto.com/id/1482719596/photo/japanese-freediver-and-shark-embrace-the-deep-blue-on-a-sunny-day.jpg?s=612x612&w=0&k=20&c=43GvAqzyEiMYU5seQRExAgIGlVcW28UkhqQUpRIH2c0=',
        ]}
        description={item?.description}
        username={item?.user.username}
        userId={item?.user._id}
        speciesTags={item?.speciesTags}
      />
    </View>
  );

  const renderNearbyPost = ({ item, index }: { item: any, index: number }) => (
    <View className={`mb-4 ${index % 2 === 0 ? "mr-2" : "ml-2"}`}>
      <NearbyDiveLog
        profilePhoto={item.profilePhoto}
        description={item.description}
        divelogId={item._id}
        photos={item.photos}
      />
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
          <FlatList
            key="following-divelogs"
            renderItem={renderFollowingPost}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-12" />}
            data={followingPosts?.pages.flatMap((page) => page) || []}
          />
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
