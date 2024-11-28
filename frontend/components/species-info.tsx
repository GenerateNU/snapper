import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  PanResponderInstance,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { SpeciesContent } from '../types/species';
import ImageCarousel from './divelog/carousel';

interface SpeciesInfoProps {
  panResponder?: PanResponderInstance;
  speciesContent: SpeciesContent;
  scrollViewRef?: React.RefObject<ScrollView>;
}

const SpeciesInfo: React.FC<SpeciesInfoProps> = ({
  panResponder,
  speciesContent,
  scrollViewRef,
}) => {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fullscreenIndex !== null) {
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [fullscreenIndex]);

  const handleImagePress = (index: number) => {
    setFullscreenIndex(index);
  };

  return (
    <View>
      <View
        {...(panResponder ? panResponder.panHandlers : {})}
        className="bg-primary-blue pt-12 pb-12 px-8 flex flex-row justify-between"
      >
        <View className="flex flex-col gap-1">
          <Text className="text-sm">
            📍{' '}
            {speciesContent.locations?.length > 0
              ? speciesContent.locations.join(', ')
              : 'Unknown'}
          </Text>
          <Text className="text-2xl font-semibold">
            {speciesContent?.commonNames && speciesContent.commonNames[0]}
          </Text>
          <Text className="text-sm italic">
            {speciesContent?.scientificName}
          </Text>
        </View>
        <Image
          className="h-32 w-32"
          source={{
            uri:
              speciesContent?.iconUrl ||
              'https://dodo.ac/np/images/0/00/Black_Bass_NH_Icon.png',
          }}
        />
      </View>

      <ScrollView
        scrollEnabled={!!scrollViewRef}
        ref={scrollViewRef}
        className={`bg-white px-8 py-8 gap-y-2 ${scrollViewRef ? 'h-[60%]' : ''}`}
      >
        <View>
          <View className="flex flex-row justify-between pb-2">
            <Text className="text-xs font-bold">Photos:</Text>
          </View>
          {speciesContent?.imageUrls?.length > 0 ? (
            <ScrollView horizontal className="flex flex-row gap-2">
              {speciesContent?.imageUrls.map((url, i) => (
                <Pressable key={i} onPress={() => handleImagePress(i)}>
                  <Image
                    style={{ overlayColor: 'white' }}
                    className="w-20 h-20 rounded-xl overlay"
                    source={{ uri: url }}
                  />
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View>
              <Text>No Images Available</Text>
            </View>
          )}
        </View>

        <View className="border-background border-b-2" />
        <View className="flex flex-col gap-y-2 h-full">
          <Text className="text-xs font-bold">Description:</Text>
          <Text className="text-xs">{speciesContent?.introduction}</Text>
        </View>
        <View className="py-14"></View>
      </ScrollView>

      {fullscreenIndex !== null && (
        <Modal transparent={true} visible={true}>
          <Pressable
            className="flex-1"
            onPress={() => setFullscreenIndex(null)}
          >
            <Animated.View
              className="absolute top-0 left-0 right-0 bottom-0"
              style={{
                opacity: modalOpacity,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              }}
            >
              <View className="flex-1 pt-[60%]">
                <ImageCarousel
                  rounded={false}
                  initialPage={fullscreenIndex}
                  data={speciesContent.imageUrls}
                />
              </View>
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

export default SpeciesInfo;
