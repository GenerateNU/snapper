import { View, Image, Text } from 'react-native';
import Profile from '../profile';
import { useEffect, useState } from 'react';

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
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (photos[0]) {
      Image.getSize(photos[0], (width, height) => {
        setAspectRatio(width / height);
      });
    }
  }, [photos[0]]);

  return (
    <View className="w-full">
      <View>
        <Image
          style={{
            width: '100%',
            aspectRatio: aspectRatio,
            resizeMode: 'contain',
          }}
          className="rounded-lg"
          source={{
            uri: photos[0],
          }}
        />
      </View>
      <View className="absolute bottom-2 left-2 flex-row items-center">
        <View>
          <Profile outline image={profilePhoto} size="md" />
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
    </View>
  );
};

export default NearbyDiveLog;
