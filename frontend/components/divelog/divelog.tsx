import { View, Pressable, Text, TouchableOpacity } from 'react-native';
import Profile from '../profile';
import { PROFILE_PHOTO } from '../../consts/profile';
import ImageCarousel from './carousel';
import LikeAndShare from './like-share';
import Caption from './caption';
import { useState, useEffect } from 'react';
import useLike from '../../hooks/like';
import { router } from 'expo-router';
import { timeAgo } from '../../utils/profile';
import { reverseGeocode } from '../../api/location';
import { useAuthStore } from '../../auth/authStore';
import PopulatedInfoPopupButton from '../populated-info-popup';

interface DiveLogProps {
  userId: string;
  id: string;
  description: string;
  username: string;
  photos: string[];
  speciesTags: any[];
  profilePicture: string;
  date: Date;
  location: number[];
}

const BigDiveLog: React.FC<DiveLogProps> = ({
  userId,
  id,
  description,
  username,
  photos,
  speciesTags,
  profilePicture,
  date,
  location,
}) => {
  const { mongoDBId } = useAuthStore();
  const { isLiking, handleLikeToggle } = useLike(id);
  const [lastTap, setLastTap] = useState(0);
  const [address, setAddress] = useState('Loading...');

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const address = await reverseGeocode(location[0], location[1]);
        setAddress(address || 'Western Reefs');
      } catch (error) {
        setAddress('Western Reefs');
      }
    };

    fetchAddress();
  }, [location]);

  const handleDoubleTap = () => {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastTap;

    if (timeDifference < 300 && !isLiking) {
      handleLikeToggle();
    }
    setLastTap(currentTime);
  };

  const renderTag = (item: any) => {
    if (!item || !item.scientificName) return null;

    const displayName = item.commonNames?.length
      ? item.commonNames[0]
      : item.scientificName;

    return (
      <PopulatedInfoPopupButton
        key={`${item._id}`}
        speciesId={item.scientificName}
      >
        <TouchableOpacity className="p-2 rounded-full border border-[0.5px] border-gray-500">
          <Text className="text-gray-600">{displayName}</Text>
        </TouchableOpacity>
      </PopulatedInfoPopupButton>
    );
  };

  const navigateUserProfile =
    mongoDBId !== userId ? () => router.push(`/user/${userId}`) : () => null;

  return (
    <Pressable className="w-full" onPress={handleDoubleTap}>
      <View style={{ gap: 12 }} className="justify-center w-full">
        <View style={{ gap: 12 }} className="w-full flex-row items-center">
          <Pressable
            style={{ gap: 12 }}
            className="flex-row items-center"
            onPress={navigateUserProfile}
          >
            <Profile size="md" image={profilePicture || PROFILE_PHOTO} />
            <View className="flex flex-col items-start">
              <Text className="font-bold text-md">{username}</Text>
              <Text className="text-gray-700">{address}</Text>
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

        <Text className="text-xs text-gray-500">{timeAgo(date)}</Text>
      </View>
    </Pressable>
  );
};

export default BigDiveLog;
