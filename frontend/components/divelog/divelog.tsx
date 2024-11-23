import { View, Pressable, Text, TouchableOpacity } from 'react-native';
import Profile from '../profile';
import { PROFILE_PHOTO } from '../../consts/profile';
import ImageCarousel from './carousel';
import LikeAndShare from './like-share';
import Caption from './caption';
import PopulatedInfoPopupButton from '../populated-info-popup';
import { useState } from 'react';
import useLike from '../../hooks/like';
import { router } from 'expo-router';

interface DiveLogProps {
  userId: string;
  id: string;
  description: string;
  username: string;
  photos: string[];
  speciesTags: any[];
}

const BigDiveLog: React.FC<DiveLogProps> = ({
  userId,
  id,
  description,
  username,
  photos,
  speciesTags,
}) => {
  const { isLiking, handleLikeToggle } = useLike(id);
  const [lastTap, setLastTap] = useState(0);

  const handleDoubleTap = () => {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastTap;

    if (timeDifference < 300 && !isLiking) {
      handleLikeToggle();
    }
    setLastTap(currentTime);
  };

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

  const navigateUserProfile = () => router.push(`/user/${userId}`);

  return (
    <Pressable className="w-full" onPress={handleDoubleTap}>
      <View style={{ gap: 12 }} className="justify-center w-full">
        <View style={{ gap: 12 }} className="w-full flex-row items-center">
          <Pressable
            style={{ gap: 12 }}
            className="flex-row items-center"
            onPress={navigateUserProfile}
          >
            <Profile size="md" image={PROFILE_PHOTO} />
            <View className="flex flex-col items-start">
              <Text className="font-bold text-md">{username}</Text>
              <Text className="text-gray-700">Western Reefs</Text>
            </View>
          </Pressable>
        </View>

        <ImageCarousel data={photos} />

        {speciesTags && speciesTags.length > 0 && (
          <View
            className="flex-row flex-wrap"
            style={{
              gap: 8,
            }}
          >
            {speciesTags.map((item: any) => renderTag(item))}
          </View>
        )}

        <LikeAndShare diveLogId={id} />

        <Caption
          onPress={navigateUserProfile}
          description={description}
          username={username}
        />
      </View>
    </Pressable>
  );
};

export default BigDiveLog;
