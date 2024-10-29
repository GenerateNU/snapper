import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Button from '../../components/button';
import { router } from 'expo-router';
import { ProgressContext } from './_layout';
import { ONBOARDING_DATA } from '../../consts/onboarding';

const Welcome = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setProgress } = useContext(ProgressContext);

  const isLargeDevice = () => {
    return Platform.OS === 'ios' && width >= 428;
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: width * nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  useEffect(() => {
    const newProgress = ((currentIndex + 1) / ONBOARDING_DATA.length) * 100;
    setProgress(newProgress);
  }, [currentIndex]);

  return (
    <View className="flex-1 justify-center">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ width: width * ONBOARDING_DATA.length }}
      >
        {ONBOARDING_DATA.map((item, index) => (
          <ImageBackground
            key={index}
            source={item.image}
            style={{ width, height: '100%' }}
            resizeMode="cover"
          >
            <View className="w-full mt-[75%] flex-1 flex-col justify-center items-center px-[8%]">
              <View className="w-full items-center pb-[8%] flex-gap">
                <Text
                  className={`text-center ${
                    isLargeDevice() ? 'text-3xl' : 'text-2xl'
                  } pb-[4%] font-bold text-white px-10`}
                >
                  {item.title}
                </Text>
                {item.description && (
                  <Text className="text-center px-[10%] text-base text-white">
                    {item.description}
                  </Text>
                )}
              </View>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>
      <View className="w-full px-[8%] absolute bottom-20">
        <Button
          color="ocean"
          backgroundColor="white"
          text={currentIndex < ONBOARDING_DATA.length - 1 ? 'Next' : 'Finish'}
          onPress={
            currentIndex < ONBOARDING_DATA.length - 1
              ? handleNext
              : () => router.push('/(auth)/redirect')
          }
        />
      </View>
    </View>
  );
};

export default Welcome;
