import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useInfoPopup } from '../contexts/info-popup-context';
import { Image } from 'expo-image';
import ImageCarousel from './divelog/carousel';

const InfoPopup = () => {
  const { speciesContent, isOpen, setClose } = useInfoPopup();
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setClose());
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

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

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOpen ? 0 : screenHeight,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Animated.View
      className="absolute flex flex-col justify-end h-full"
      style={{
        transform: [{ translateY }],
      }}
    >
      <View className="w-screen h-2/3">
        <View
          {...panResponder.panHandlers}
          className="shadow-xl h-7 rounded-t-2xl bg-white flex flex-row justify-center items-center"
        >
          <View className="bg-slate-400 opacity-60 h-[6px] w-12 rounded-lg" />
        </View>
        <View
          {...panResponder.panHandlers}
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
              {speciesContent.commonNames && speciesContent.commonNames[0]}
            </Text>
            <Text className="text-sm italic">
              {speciesContent.scientificName}
            </Text>
          </View>
          <Image
            className="h-32 w-32"
            source={{
              uri:
                speciesContent.iconUrl ||
                'https://dodo.ac/np/images/0/00/Black_Bass_NH_Icon.png',
            }}
          />
        </View>
        <ScrollView ref={scrollViewRef} className="bg-white px-8 py-8 gap-y-2">
          <View>
            <View className="flex flex-row justify-between pb-2">
              <Text className="text-xs font-bold">Photos:</Text>
            </View>
            {speciesContent.imageUrls?.length > 0 ? (
              <ScrollView horizontal className="flex flex-row gap-2">
                {speciesContent.imageUrls.map((url, i) => (
                  <Pressable key={i} onPress={() => setFullscreenIndex(i)}>
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
            <Text className="text-xs">{speciesContent.introduction}</Text>
          </View>
          <View className="flex flex-col gap-y-2">
            <Text className="text-xs font-bold">More Facts:</Text>
          </View>
          <View className="py-8"></View>
        </ScrollView>
      </View>

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
    </Animated.View>
  );
};

export default InfoPopup;
