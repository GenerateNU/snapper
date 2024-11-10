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
import SpeciesTag from '../user/components/species-tag';
import PopulatedInfoPopupButton from '../../../components/populated-info-popup';
import InfoPopup from '../../../components/info-popup';

const DiveLog = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useDiveLog(id);

  const navigateUserProfile = () =>
    router.push(`/user/${data?.user.supabaseId}`);

  // Render a single tag in a TouchableOpacity
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

        {/* Display the first photo */}
        <Image
          className="rounded-2xl w-full mb-2"
          source={{ uri: data?.photos[0] }}
          style={{ aspectRatio: 1 }}
        />

        <View
          style={{
            flexDirection: 'row', // Arrange items in a row
            flexWrap: 'wrap', // Allow wrapping when there's no space
            gap: 8, // Space between items
          }}
        >
          {data?.speciesTags?.map((item: any) => renderTag(item))}
        </View>

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
