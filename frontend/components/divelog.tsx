import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Profile from './profile';
import IconButton from './icon-button';
import { timeAgo } from '../utils/profile';
import SpeciesTag from '../app/(app)/user/components/species-tag';
import PopulatedInfoPopupButton from './populated-info-popup';
import { router } from 'expo-router';

interface DiveLogProps {
  username: string;
  image?: string;
  description?: string;
  profilePhoto: string;
  date: Date;
  speciesTags?: any[];
  isMyProfile: boolean;
  divelogId: string;
}

const DiveLog: React.FC<DiveLogProps> = React.memo(
  ({
    username,
    image,
    description,
    profilePhoto,
    date,
    speciesTags,
    isMyProfile,
    divelogId,
  }) => {
    const [aspectRatio, setAspectRatio] = useState(1);

    useEffect(() => {
      if (image) {
        Image.getSize(image, (width, height) => {
          setAspectRatio(width / height);
        });
      }
    }, [image]);

    return (
      <Pressable
        onPress={() => router.push(`/divelog/${divelogId}`)}
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
        {image && (
          <View className="my-[5%]">
            <Image
              style={{
                width: '100%',
                aspectRatio: aspectRatio,
                resizeMode: 'contain',
              }}
              className="rounded-lg"
              source={{
                uri: image,
              }}
            />
          </View>
        )}
        {description && <Text className="pb-[5%]">{description}</Text>}
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
      </Pressable>
    );
  },
);

export default DiveLog;
