import React from 'react';
import { View, Text, Image } from 'react-native';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Profile from '../../../../components/profile';
import IconButton from '../../../../components/icon-button';
import FishTag from './fish-tag';
import { timeAgo } from '../../../../utils/profile';

interface DiveLogProps {
  username?: string;
  image?: string;
  description?: string;
  profilePhoto: string;
  date: Date;
  fishTags: any[];
}

const DiveLog: React.FC<DiveLogProps> = ({
  username,
  image,
  description,
  profilePhoto,
  date,
  fishTags,
}) => {
  return (
    <View className="w-full p-[5%] bg-white shadow-lg rounded-lg">
      <View className="flex-row justify-between items-start">
        <View className="flex flex-row items-center">
          <Profile small image={profilePhoto} />
          <View className="ml-[7%] flex flex-col">
            <Text className="font-bold">{username}</Text>
            <Text className="text-gray-500">{timeAgo(date)}</Text>
          </View>
        </View>
        <IconButton icon={faEllipsisVertical} />
      </View>
      <View className="w-full h-40 my-[5%]">
        <Image
          className="w-full h-full object-cover rounded-lg"
          source={{
            uri: image,
          }}
        />
      </View>
      <Text className="pb-[5%]">{description}</Text>
      <View style={{ gap: 10 }} className="flex flex-row flex-wrap">
        {fishTags?.map((fish: any) => (
          <FishTag key={fish._id} id={fish._id} name={fish.commonName} />
        ))}
      </View>
    </View>
  );
};

export default DiveLog;
