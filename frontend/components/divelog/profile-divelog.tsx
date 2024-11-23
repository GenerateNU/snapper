import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Profile from '../profile';
import { timeAgo } from '../../utils/profile';
import IconButton from '../icon-button';
import PopulatedInfoPopupButton from '../populated-info-popup';
import SpeciesTag from '../../app/(app)/user/components/species-tag';
import LikeAndShare from './like-share';
import ImageCarousel from './carousel';

interface DiveLogProps {
  username: string;
  images: string[];
  description?: string;
  profilePhoto: string;
  date: Date;
  speciesTags?: any[];
  isMyProfile: boolean;
  divelogId: string;
}

const ProfileDiveLog: React.FC<DiveLogProps> = React.memo(
  ({
    username,
    description,
    profilePhoto,
    date,
    speciesTags,
    isMyProfile,
    divelogId,
    images,
  }) => {
    const { width } = Dimensions.get('window');
    const carouselWidth = width * 0.9;

    return (
      <Pressable
        style={{ gap: 20 }}
        className="w-full p-[5%] bg-white shadow-lg rounded-lg"
      >
        <View className="flex-row justify-between items-start">
          <View className="flex flex-row items-center">
            <Profile size="sm" outline image={profilePhoto} />
            <View className="ml-[7%] flex flex-col">
              <Text className="font-bold">{username}</Text>
              <Text className="text-gray-500">{timeAgo(date)}</Text>
            </View>
          </View>
          {isMyProfile && <IconButton icon={faEllipsisVertical} />}
        </View>
        {images && <ImageCarousel data={images} />}
        {description && <Text>{description}</Text>}
        {speciesTags && (
          <View style={{ gap: 10 }} className="flex flex-row flex-wrap mt-2">
            {speciesTags?.map((species, key) => (
              <PopulatedInfoPopupButton
                key={`${species.id}-${key}`}
                speciesId={species.scientificName}
              >
                <SpeciesTag />
              </PopulatedInfoPopupButton>
            ))}
          </View>
        )}
        <LikeAndShare diveLogId={divelogId} />
      </Pressable>
    );
  },
);

export default ProfileDiveLog;
