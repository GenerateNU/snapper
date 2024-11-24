import { View, Text, Pressable } from 'react-native';
import Profile from '../profile';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import ImageSize from 'react-native-image-size';

interface NearbyDivelogProps {
  profilePhoto: string;
  coverPhoto: string;
  description: string;
  divelogId: string;
}

const NearbyDiveLog: React.FC<NearbyDivelogProps> = ({
  profilePhoto,
  coverPhoto,
  description,
  divelogId,
}) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    const fetchImageSize = async () => {
      if (coverPhoto) {
        const { width, height } = await ImageSize.getSize(coverPhoto);
        setAspectRatio(width / height);
      }
    };

    fetchImageSize();
  }, [coverPhoto]);

  return (
    <Pressable
      onPress={() => router.push(`/divelog/${divelogId}`)}
      className="w-full"
    >
      <View style={{ aspectRatio: aspectRatio }} className="drop-shadow-2xl w-full">
        <Image
          style={{
            width: '100%',
            flex: 1,
          }}
          contentFit="contain"
          className="rounded-lg"
          source={{
            uri: coverPhoto,
          }}
        />
      </View>
      <View className="absolute bottom-2 left-2 flex-row items-center">
        <View>
          <Profile
            borderColor="border-white border-[1px]"
            outline
            image={profilePhoto}
            size="md"
          />
        </View>
        <Text
          className="text-white ml-2"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ maxWidth: '65%' }}
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
};

export default NearbyDiveLog;
