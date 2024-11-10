import { router, useLocalSearchParams } from 'expo-router';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useDiveLog } from '../../../hooks/divelog';
import Profile from '../../../components/profile';
import { PROFILE_PHOTO } from '../../../consts/profile';
import PopulatedInfoPopupButton from '../../../components/populated-info-popup';
import InfoPopup from '../../../components/info-popup';
import IconButton from '../../../components/icon-button';
import {
  faArrowUpFromBracket,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutlined } from '@fortawesome/free-regular-svg-icons';
import { useAuthStore } from '../../../auth/authStore';
import useLike from '../../../hooks/like';
import LikeAndShare from '../../../components/divelog/like-share';

const DiveLog = () => {
  const { supabaseId } = useAuthStore();
  const { id: diveLogId } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useDiveLog(diveLogId);

  const navigateUserProfile = () =>
    router.push(`/user/${data?.user.supabaseId}`);

  const renderTag = (item: any) => {
    return (
      <PopulatedInfoPopupButton
        key={`${item._id}`}
        speciesId={item.scientificName}
      >
        <TouchableOpacity className="p-2 rounded-full border border-1">
          <Text>{item.commonNames[0]}</Text>
        </TouchableOpacity>
      </PopulatedInfoPopupButton>
    );
  };

  return (
    <>
      <SafeAreaView style={{ gap: 12 }} className="justify-center mx-[8%]">
        <View style={{ gap: 12 }} className="w-full flex-row items-center">
          <Pressable
            style={{ gap: 12 }}
            className="flex-row"
            onPress={navigateUserProfile}
          >
            <Profile
              size="md"
              image={data?.user.profilePicture || PROFILE_PHOTO}
            />
            <View className="flex flex-col">
              <Text className="font-bold text-base">{data?.user.username}</Text>
              <Text>Western Reefs</Text>
            </View>
          </Pressable>
        </View>

        <Image
          className="rounded-2xl w-full mb-2"
          source={{ uri: data?.photos[0] }}
          style={{ aspectRatio: 1 }}
        />

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {data?.speciesTags?.map((item: any) => renderTag(item))}
        </View>

        <LikeAndShare diveLogId={diveLogId} />

        <Text className="text-base">
          <Text className="font-bold text-base">
            {data?.user.username + ' '}
          </Text>
          <Text>{data?.description}</Text>
        </Text>
      </SafeAreaView>
      <InfoPopup />
    </>
  );
};

export default DiveLog;
