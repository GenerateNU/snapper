import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  Image as ReactNativeImage,
  Text,
  View,
} from 'react-native';
import usePulsingAnimation from '../../utils/skeleton';
import Profile from '../profile';

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
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const opacity = usePulsingAnimation();

  useEffect(() => {
    const preloadImages = async () => {
      try {
        await Promise.all([
          Image.prefetch(coverPhoto),
          Image.prefetch(profilePhoto),
        ]);

        const { width, height } = await ReactNativeImage.getSize(coverPhoto);
        setAspectRatio(width / height);
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading images:', error);
        setAspectRatio(1);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [coverPhoto, profilePhoto]);

  if (aspectRatio === null || isLoading) {
    return (
      <Animated.View
        style={{ opacity: opacity, aspectRatio: 4 / 3 }}
        className="w-full bg-gray-100 rounded-lg"
      />
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/divelog/${divelogId}`)}
      className="w-full"
    >
      <View
        style={{ aspectRatio }}
        className="drop-shadow-2xl w-full bg-gray-100"
      >
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
          transition={200} // Smooth fade-in transition
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
