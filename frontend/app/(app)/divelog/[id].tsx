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
import { useAuthStore } from '../../../auth/authStore';
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
            className="flex-row items-center"
            onPress={navigateUserProfile}
          >
            <Profile
              size="md"
              image={data?.user.profilePicture || PROFILE_PHOTO}
            />
            <View className="flex flex-col items-start">
              <Text className="font-bold text-md">{data?.user.username}</Text>
              <Text className="text-gray-700">Western Reefs</Text>
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

        <Text className="text-md">
          <Text className="font-bold">{data?.user.username + ' '}</Text>
          <Text>{data?.description}</Text>
        </Text>
      </SafeAreaView>
      <InfoPopup />
    </>
  );
};

export default DiveLog;
