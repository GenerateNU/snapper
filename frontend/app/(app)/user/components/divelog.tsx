import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Profile from '../../../../components/profile';
import IconButton from '../../../../components/icon-button';
import { useLocalSearchParams } from 'expo-router';
import { useUserDiveLogs } from '../../../../hooks/user';
import Tag from '../../../../components/tag';

interface DiveLogProps {
  username?: string;
  image?: string;
  description?: string;
  profilePhoto: string;
  date: Date;
}

const DiveLog: React.FC<DiveLogProps> = ({
  username,
  image,
  description,
  profilePhoto,
  date,
}) => {
  const timeAgo = (date: Date = new Date()): string => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000,
    );
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return `${seconds} seconds ago`;
  };

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
      <Text>{description}</Text>
    </View>
  );
};

export default DiveLog;
