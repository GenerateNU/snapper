import { View, Image, Text, Pressable } from 'react-native';
import Profile from '../profile';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

interface NearbyDivelogProps {
  profilePhoto: string;
  photos: string[];
  description: string;
  divelogId: string;
}

const NearbyDiveLog: React.FC<NearbyDivelogProps> = ({
  profilePhoto,
  photos,
  description,
  divelogId,
}) => {
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (photos[0]) {
      Image.getSize(photos[0], (width, height) => {
        setAspectRatio(width / height);
        setImageLoading(true);
      });
    }
  }, [photos[0]]);

  return (
    <Pressable
      onPress={() => router.push(`/divelog/${divelogId}`)}
      className="w-full"
    >
      <View className="drop-shadow-2xl">
        <Image
          style={{
            width: '100%',
            aspectRatio: aspectRatio,
            resizeMode: 'cover',
          }}
          className="rounded-lg"
          source={{
            uri: photos[0],
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
